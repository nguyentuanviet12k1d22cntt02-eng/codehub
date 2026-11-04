from .health import _provider_lock, _provider_blocked_until, _provider_model_cache
from .catalog import _GROQ_STRUCTURED_MODELS
from .errors import provider_cooldown_seconds
import json
import os
import threading
import time
import requests
from app.pipeline.runtime import digest
from app.llm.key_pool_manager import key_pool

from .errors import key_cooldown_seconds, is_key_scoped_provider_failure, is_request_scoped_provider_failure, retry_after_seconds, PipelineError, classify_provider_error, parse_provider_json
from .budget import stage_output_limit, stage_call_timeout, stage_budget_seconds, minimum_real_attempt_seconds, fair_attempt_timeout, provider_attempt_limit
from .health import _provider_available, _block_provider
from .catalog import ModelCatalogMixin
from .transport import request_completion, read_completion

class PipelineLLMClient(ModelCatalogMixin):
    """Real provider calls only; budgets and provider receipts belong to one run."""
    def __init__(self, timeout_seconds=300):
        self.deadline = time.monotonic() + min(timeout_seconds, 300)
        self.calls = []
        self.lock = threading.Lock()
        self.tokens = 0
        self.models = {}
        self.key_models = {}
        # A client has the lifetime of one real pipeline run.  Keep failed
        # keys out of later Theory/Critic calls even after a short pool
        # cooldown would otherwise make them selectable again.
        self._run_failed_keys = {}
        self._run_successful_keys = {}
        self._run_provider_outages = {}
        self.per_call_timeout = stage_call_timeout("default")

    def remaining(self):
        remaining = self.deadline - time.monotonic()
        if remaining <= 0:
            raise PipelineError("RUN_DEADLINE_EXCEEDED")
        return remaining

    def _failed_keys(self, provider):
        with self.lock:
            return list(self._run_failed_keys.get(provider, set()))

    def _preferred_keys(self, provider):
        with self.lock:
            failed = self._run_failed_keys.get(provider, set())
            return [key for key in self._run_successful_keys.get(provider, []) if key not in failed]

    def _remember_failed_key(self, provider, key):
        with self.lock:
            self._run_failed_keys.setdefault(provider, set()).add(key)
            successful = self._run_successful_keys.get(provider, [])
            self._run_successful_keys[provider] = [value for value in successful if value != key]

    def _remember_successful_key(self, provider, key):
        with self.lock:
            self._run_failed_keys.setdefault(provider, set()).discard(key)
            successful = [value for value in self._run_successful_keys.get(provider, []) if value != key]
            self._run_successful_keys[provider] = [key, *successful]

    def _candidate_count(self, provider, excluded):
        try:
            excluded = set(excluded)
            return sum(1 for key in key_pool.get_available_keys_for_provider(provider) if key not in excluded)
        except Exception:
            return 0

    def _fallback_provider_count(self, providers, position):
        count = 0
        for provider in providers[position + 1:]:
            if provider not in ("GEMINI", "GROQ", "OPENROUTER", "INCEPTION", "OPENAI"):
                continue
            if provider in self._run_provider_outages or not _provider_available(provider):
                continue
            if self._candidate_count(provider, self._failed_keys(provider)):
                count += 1
        return count

    def _scheduler_receipt(self, stage, provider, error_code, details=None):
        receipt = {
            "stage": stage,
            "provider": provider,
            "status": "SKIPPED",
            "error_code": error_code,
            "error_type": "SchedulerDecision",
            "duration_ms": 0,
            "details": details or {},
        }
        with self.lock:
            self.calls.append(receipt)


    def json(self, stage, system, data, *, validate_response=None):
        prompt = json.dumps(data, ensure_ascii=False, default=str)
        configured_provider = os.getenv("ADAPTIVE_PROVIDER", "").upper()
        providers = [configured_provider] if configured_provider else ["GEMINI", "GROQ", "OPENROUTER", "INCEPTION", "OPENAI"]
        last_error = "PROVIDER_UNAVAILABLE"
        attempted_any = False
        retry_after = None
        stage_deadline = min(time.monotonic() + stage_budget_seconds(stage), self.deadline)
        for provider_position, provider in enumerate(providers):
            if provider not in ("GEMINI", "GROQ", "OPENROUTER", "INCEPTION", "OPENAI"):
                continue
            if provider in self._run_provider_outages:
                last_error = "PROVIDER_FULL_POOL_OUTAGE"
                self._scheduler_receipt(stage, provider, "PROVIDER_SKIPPED_RUN_HEALTH", self._run_provider_outages[provider])
                continue
            if not _provider_available(provider):
                continue
            attempted_keys = self._failed_keys(provider)
            provider_failure_codes = []
            provider_exhausted = False
            provider_attempts = 0
            provider_deadline = None
            while _provider_available(provider):
                if provider_deadline is not None and provider_deadline - time.monotonic() < minimum_real_attempt_seconds(stage):
                    self._scheduler_receipt(stage, provider, "PROVIDER_WINDOW_EXHAUSTED", {
                        "attempted_key_count": provider_attempts,
                    })
                    break
                if provider_attempts >= provider_attempt_limit(stage):
                    if self._candidate_count(provider, attempted_keys) == 0:
                        provider_exhausted = True
                    else:
                        self._scheduler_receipt(stage, provider, "PROVIDER_ATTEMPT_LIMIT_REACHED", {
                            "attempted_key_count": provider_attempts,
                            "limit": provider_attempt_limit(stage),
                        })
                    break
                key = key_pool.lease_key_for_provider(provider, attempted_keys, self._preferred_keys(provider))
                if key is None:
                    provider_exhausted = True
                    break
                attempted_keys.append(key)
                provider_attempts += 1
                attempted_any = True
                with self.lock:
                    if self.tokens >= 32000:
                        key_pool.release_key(key)
                        raise PipelineError("LLM_BUDGET_EXCEEDED")
                started = time.monotonic()
                response = None
                raw = None
                stop_provider_after_receipt = False
                receipt = {"stage": stage, "provider": provider, "key_fingerprint": digest(key)[:12], "status": "FAILED", "prompt_hash": digest({"system": system, "user": data}), "prompt_version": "adaptive_v4", "input": data, "deadline_ms": 0}
                try:
                    global_remaining = self.remaining()
                    stage_remaining = stage_deadline - time.monotonic()
                    if stage_remaining < minimum_real_attempt_seconds(stage):
                        raise PipelineError("STAGE_BUDGET_EXHAUSTED", "Stage does not have enough time for a real provider call", {
                            "stage": stage,
                            "stage_budget_ms": round(stage_budget_seconds(stage) * 1000),
                            "stage_remaining_ms": max(0, round(stage_remaining * 1000)),
                        })
                    fallback_count = self._fallback_provider_count(providers, provider_position)
                    if provider_deadline is None:
                        # A pool with 12 keys still owns ONE provider window.
                        # Fast quota/5xx failures may try sibling keys within it;
                        # a slow provider cannot consume every fallback's window.
                        provider_deadline = time.monotonic() + stage_remaining / (fallback_count + 1)
                    provider_remaining = min(stage_remaining, provider_deadline - time.monotonic())
                    stage_timeout = min(global_remaining, fair_attempt_timeout(
                        stage, provider_remaining, 1, 0,
                        preferred=key in self._preferred_keys(provider),
                    ))
                    receipt["deadline_ms"] = round(stage_timeout * 1000)
                    model = self._model(provider, key, min(4, stage_timeout))
                    receipt["model"] = model
                    call_deadline = started + stage_timeout
                    remaining_for_read = min(call_deadline - time.monotonic(), self.remaining())
                    if remaining_for_read <= 0:
                        raise PipelineError("PROVIDER_DEADLINE_EXCEEDED")
                    read_timeout = max(1, remaining_for_read)
                    output_limit = stage_output_limit(stage)
                    response = request_completion(provider, model, key, system, prompt, output_limit, read_timeout)
                    receipt["http_status"] = response.status_code
                    response.raise_for_status()
                    result = read_completion(response, call_deadline, self.remaining)
                    if provider == "GEMINI":
                        raw = "".join(p.get("text", "") for p in result["candidates"][0]["content"]["parts"] if not p.get("thought"))
                        usage = result.get("usageMetadata", {})
                        token_count = usage.get("totalTokenCount", 0)
                        receipt.update(response_id=result.get("responseId"), model=result.get("modelVersion", model))
                    else:
                        raw = result["choices"][0]["message"]["content"]
                        usage = result.get("usage", {})
                        token_count = usage.get("total_tokens", 0)
                        receipt.update(response_id=result.get("id"), model=result.get("model", model))
                    receipt.update(usage=usage, response_hash=digest(raw))
                    with self.lock:
                        self.tokens += token_count
                    parsed = parse_provider_json(raw)
                    if validate_response is not None:
                        try:
                            parsed = validate_response(parsed)
                        except (ValueError, TypeError) as exc:
                            # Valid JSON is not yet valid agent output. Keep the
                            # same stage deadline and try another model/provider,
                            # not another key for the identical rejected content.
                            raise PipelineError("PROVIDER_CONTRACT_INVALID", str(exc)[:500]) from exc
                    receipt.update(status="SUCCEEDED", output=parsed)
                    self._remember_successful_key(provider, key)
                    key_pool.report_key_success(key)
                    return parsed
                except Exception as exc:
                    last_error = classify_provider_error(exc)
                    http_response = exc.response if isinstance(exc, requests.HTTPError) and exc.response is not None else response
                    if isinstance(exc, requests.HTTPError) and exc.response is not None:
                        receipt["http_status"] = exc.response.status_code
                    receipt.update(error_code=last_error, error_type=type(exc).__name__, error_message=str(exc)[:500])
                    if last_error in ("PROVIDER_RESPONSE_INVALID", "PROVIDER_CONTRACT_INVALID") and raw is not None:
                        receipt["private_response_excerpt"] = raw[:1200]
                    if last_error == "PROVIDER_RATE_LIMITED":
                        seconds = retry_after_seconds(http_response)
                        receipt["retry_after_seconds"] = seconds
                        retry_after = max(retry_after or 0, seconds)
                        self._remember_failed_key(provider, key)
                        key_pool.mark_key_exhausted(key, provider, cooldown_seconds=seconds, error_msg="HTTP 429 from adaptive pipeline")
                    elif last_error == "PROVIDER_AUTH_FAILED":
                        self._remember_failed_key(provider, key)
                        key_pool.mark_key_exhausted(key, provider, cooldown_seconds=300, error_msg="authentication rejected by provider")
                    elif is_key_scoped_provider_failure(last_error, receipt.get("http_status")):
                        seconds = key_cooldown_seconds(last_error)
                        receipt["key_cooldown_seconds"] = seconds
                        self._remember_failed_key(provider, key)
                        key_pool.mark_key_temporarily_unavailable(
                            key, provider, cooldown_seconds=seconds,
                            error_msg=f"{last_error} from adaptive pipeline",
                        )
                        provider_failure_codes.append(last_error)
                    elif last_error == "PROVIDER_CONTRACT_INVALID" or is_request_scoped_provider_failure(last_error):
                        # The payload and model are identical for sibling keys.
                        # Preserve the receipt, leave key health unchanged and
                        # give the next provider the remaining stage budget.
                        stop_provider_after_receipt = True
                    # The run envelope has expired.  Preserve this final receipt,
                    # then stop rather than manufacturing no-op attempts for every
                    # remaining key and provider.
                    if last_error in ("RUN_DEADLINE_EXCEEDED", "STAGE_BUDGET_EXHAUSTED"):
                        raise
                finally:
                    if response is not None:
                        response.close()
                    key_pool.release_key(key)
                    receipt["duration_ms"] = round((time.monotonic() - started) * 1000)
                    error_code = receipt.get("error_code")
                    status_code = receipt.get("http_status")
                    if not status_code:
                        status_code = 504 if error_code in (
                            "PROVIDER_TIMEOUT",
                            "PROVIDER_DEADLINE_EXCEEDED",
                            "STAGE_BUDGET_EXHAUSTED",
                            "RUN_DEADLINE_EXCEEDED",
                        ) else 500
                    key_pool.log_call_async(
                        provider=provider,
                        model=receipt.get("model") or "model-discovery",
                        api_key=key,
                        status="SUCCESS" if receipt["status"] == "SUCCEEDED" else "FAILED",
                        status_code=status_code,
                        latency_ms=receipt["duration_ms"],
                        prompt_sample=f"[{stage}] {prompt}",
                        response_sample=raw,
                        error_message=(
                            f"{error_code}: {receipt.get('error_message', '')}" if error_code else None
                        ),
                        # Key health is already recorded through /report.
                        # Observability must not increment the same call twice.
                        update_key_stats=False,
                    )
                    with self.lock:
                        self.calls.append(receipt)
                if stop_provider_after_receipt:
                    break
            # A provider circuit opens only after the key pool reports that no
            # untried eligible key remains.  A single 5xx/timeout must never
            # suppress the other keys held by the same provider.
            if provider_exhausted and provider_failure_codes and all(
                is_key_scoped_provider_failure(code) for code in provider_failure_codes
            ):
                _block_provider(provider, provider_failure_codes[-1])
                self._run_provider_outages[provider] = {
                    "prior_error_code": provider_failure_codes[-1],
                    "failed_key_count": len(self._failed_keys(provider)),
                }
        if not attempted_any:
            if self._run_provider_outages:
                raise PipelineError("PROVIDER_FULL_POOL_OUTAGE", "All keys for a provider failed in this run", {
                    "providers": self._run_provider_outages,
                })
            raise PipelineError("PROVIDER_COOLDOWN", "Các provider đang ở thời gian hồi phục; yêu cầu sẽ được thử lại.")
        attempts = [{"provider": call["provider"], "code": call.get("error_code"), "http_status": call.get("http_status"), "duration_ms": call.get("duration_ms")} for call in self.calls if call["stage"] == stage]
        details = {"attempts": attempts}
        if retry_after:
            details["retry_after_seconds"] = retry_after
        raise PipelineError(last_error, "Không nhận được JSON hợp lệ từ provider trong ngân sách cho phép", details)
