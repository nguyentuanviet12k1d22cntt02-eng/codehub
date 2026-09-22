import json
import os
import re
import threading
import time
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
import requests
from app.pipeline.runtime import digest
from app.llm.key_pool_manager import key_pool


# Provider-wide recovery begins only after every currently usable key has been
# tried. Individual key failures must not suppress their sibling keys.
_provider_lock = threading.Lock()
_provider_blocked_until = {}
_provider_model_cache = {}

# Router and content agents require complete structured JSON.  Do not use
# reasoning models on Groq for these calls: their hidden reasoning budget can
# leave an otherwise valid response without the fields required by Pydantic.
# Keep Llama 3.3 first. Qwen is allowed only when the account does not expose
# a Llama structured-output model; reasoning models remain excluded.
_GROQ_STRUCTURED_MODELS = ("llama-3.3-70b-versatile", "llama-3.1-8b-instant", "qwen/qwen3.8-27b")


def provider_cooldown_seconds(error_code):
    """Return the temporary isolation period for one failed provider key."""
    return {
        "PROVIDER_SERVER_ERROR": 30,
        "PROVIDER_DEADLINE_EXCEEDED": 45,
        "PROVIDER_TIMEOUT": 45,
        "PROVIDER_NETWORK_ERROR": 20,
        "PROVIDER_RESPONSE_INVALID": 30,
    }.get(error_code, 20)


def key_cooldown_seconds(error_code):
    """Keep a failing key out of the current run and its immediate retry.

    This is deliberately key-scoped.  A 5xx from one credential never
    disables a sibling credential or an entire provider.
    """
    return {
        "PROVIDER_SERVER_ERROR": 180,
        "PROVIDER_DEADLINE_EXCEEDED": 120,
        "PROVIDER_TIMEOUT": 120,
        "PROVIDER_NETWORK_ERROR": 90,
        "PROVIDER_RESPONSE_INVALID": 120,
    }.get(error_code, 60)


def is_key_scoped_provider_failure(error_code, http_status=None):
    """Whether an error cools one key while the provider still has candidates."""
    return http_status in (500, 502, 503, 504) or error_code in {
        "PROVIDER_SERVER_ERROR",
        "PROVIDER_TIMEOUT",
        "PROVIDER_NETWORK_ERROR",
        "PROVIDER_DEADLINE_EXCEEDED",
        "PROVIDER_RESPONSE_INVALID",
    }


def _provider_available(provider):
    with _provider_lock:
        return _provider_blocked_until.get(provider, 0) <= time.monotonic()


def _block_provider(provider, error_code):
    seconds = provider_cooldown_seconds(error_code)
    with _provider_lock:
        _provider_blocked_until[provider] = max(_provider_blocked_until.get(provider, 0), time.monotonic() + seconds)


def stage_output_limit(stage):
    """Keep calls within provider quota; these are ceilings, not fallback content."""
    defaults = {
        "ExerciseGeneratorAgent": 2800,
        "ExplanationTutorAgent": 1800,
        "CriticEvaluatorAgent": 900,
        "GeneralChatAgent": 900,
    }
    configured = os.getenv("ADAPTIVE_" + stage.upper() + "_MAX_TOKENS")
    try:
        requested = int(configured or defaults.get(stage, 1400))
    except ValueError:
        requested = defaults.get(stage, 1400)
    return max(400, min(requested, 4000))


def stage_call_timeout(stage):
    """Use a bounded stage budget that permits a real non-streaming JSON reply."""
    defaults = {
        "ExerciseGeneratorAgent": 35,
        "ExplanationTutorAgent": 28,
        "CriticEvaluatorAgent": 28,
        "GeneralChatAgent": 20,
    }
    configured = os.getenv("ADAPTIVE_" + stage.upper() + "_CALL_TIMEOUT_SECONDS") or os.getenv("ADAPTIVE_PROVIDER_CALL_TIMEOUT_SECONDS")
    try:
        requested = int(configured or defaults.get(stage, 25))
    except ValueError:
        requested = defaults.get(stage, 25)
    return max(5, min(requested, 45))


def stage_budget_seconds(stage):
    """One real time budget for a whole LLM stage, not one budget per key."""
    defaults = {
        "ExerciseGeneratorAgent": 150,
        "ExplanationTutorAgent": 60,
        "CriticEvaluatorAgent": 110,
        "GeneralChatAgent": 40,
        "IntentRouterAgent": 25,
    }
    configured = os.getenv("ADAPTIVE_" + stage.upper() + "_STAGE_BUDGET_SECONDS")
    try:
        requested = int(configured or defaults.get(stage, 45))
    except ValueError:
        requested = defaults.get(stage, 45)
    return max(minimum_real_attempt_seconds(stage), min(requested, 180))


def minimum_real_attempt_seconds(stage):
    """Below this window a provider cannot receive a meaningful live call."""
    defaults = {
        "ExerciseGeneratorAgent": 5,
        "ExplanationTutorAgent": 5,
        "CriticEvaluatorAgent": 5,
        "GeneralChatAgent": 5,
        "IntentRouterAgent": 5,
    }
    return defaults.get(stage, 5)


def fair_attempt_timeout(stage, remaining_stage_seconds, candidate_count,
                         fallback_provider_count, preferred=False):
    """Allocate a live attempt without starving later providers.

    A previously successful key may use the normal call limit.  Unknown keys
    share the current stage budget, while retaining a minimum real attempt
    for each remaining provider.  No response is invented when the budget is
    insufficient; the caller records STAGE_BUDGET_EXHAUSTED and lets the
    durable retry continue later.
    """
    normal = min(stage_call_timeout(stage), remaining_stage_seconds)
    if preferred:
        return normal
    minimum = minimum_real_attempt_seconds(stage)
    reserved = minimum * max(0, fallback_provider_count)
    fair_share = (remaining_stage_seconds - reserved) / max(1, candidate_count)
    return max(1, min(normal, max(minimum, fair_share)))


def retry_after_seconds(response, default=75):
    """Read the standard backoff header without trusting it beyond a safe bound."""
    value = response.headers.get("Retry-After") if response is not None else None
    if value:
        try:
            return max(15, min(int(float(value)), 300))
        except ValueError:
            try:
                retry_at = parsedate_to_datetime(value)
                if retry_at.tzinfo is None:
                    retry_at = retry_at.replace(tzinfo=timezone.utc)
                return max(15, min(round((retry_at - datetime.now(timezone.utc)).total_seconds()), 300))
            except (TypeError, ValueError, IndexError):
                pass
    return max(15, min(default, 300))


class PipelineError(RuntimeError):
    def __init__(self, code, detail="", details=None):
        super().__init__(detail or code)
        self.code = code
        self.details = details or {}


def classify_provider_error(exc):
    """Return a stable, reportable category without exposing credentials."""
    if isinstance(exc, PipelineError):
        return exc.code
    if isinstance(exc, requests.Timeout):
        return "PROVIDER_TIMEOUT"
    if isinstance(exc, requests.ConnectionError):
        return "PROVIDER_NETWORK_ERROR"
    if isinstance(exc, requests.HTTPError):
        status = exc.response.status_code if exc.response is not None else None
        return {
            400: "PROVIDER_REQUEST_REJECTED", 401: "PROVIDER_AUTH_FAILED",
            403: "PROVIDER_AUTH_FAILED", 404: "PROVIDER_MODEL_NOT_FOUND",
            408: "PROVIDER_TIMEOUT", 409: "PROVIDER_REQUEST_REJECTED",
            413: "PROVIDER_REQUEST_TOO_LARGE", 422: "PROVIDER_REQUEST_REJECTED",
            429: "PROVIDER_RATE_LIMITED",
        }.get(status, "PROVIDER_SERVER_ERROR" if status and status >= 500 else "PROVIDER_HTTP_ERROR")
    if isinstance(exc, (ValueError, KeyError, IndexError, json.JSONDecodeError)):
        return "PROVIDER_RESPONSE_INVALID"
    return "PROVIDER_CALL_FAILED"


def parse_provider_json(raw):
    """Parse one provider response without altering its meaning.

    Providers sometimes wrap a valid JSON object in a Markdown fence or add a
    short label.  We only remove that transport wrapper; malformed JSON is
    still rejected and never converted into an exercise by a fallback.
    """
    text = raw.strip()
    if text.startswith("```"):
        first_newline = text.find("\n")
        text = text[first_newline + 1:] if first_newline >= 0 else ""
        if text.rstrip().endswith("```"):
            text = text.rstrip()[:-3]
    start = text.find("{")
    if start < 0:
        raise ValueError("JSON object required")
    parsed, _ = json.JSONDecoder().raw_decode(text[start:])
    if not isinstance(parsed, dict):
        raise ValueError("JSON object required")
    return parsed


class PipelineLLMClient:
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
            if provider not in ("GEMINI", "GROQ", "OPENROUTER", "OPENAI"):
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

    def _model(self, provider, key, timeout_seconds=4):
        configured = os.getenv(f"ADAPTIVE_{provider}_MODEL") or os.getenv("ADAPTIVE_MODEL")
        key_model = (provider, key)
        if provider == "GROQ" and key_model in self.key_models:
            return self.key_models[key_model]
        if provider != "GROQ" and configured:
            return configured
        if provider != "GROQ" and provider in self.models:
            return self.models[provider]
        if provider != "GROQ":
            with _provider_lock:
                cached = _provider_model_cache.get(provider)
            if cached:
                self.models[provider] = cached
                return cached
        if provider == "GEMINI":
            response = requests.get("https://generativelanguage.googleapis.com/v1beta/models", headers={"x-goog-api-key": key}, timeout=min(timeout_seconds, self.remaining()))
            response.raise_for_status()
            names = [m["name"].removeprefix("models/") for m in response.json().get("models", []) if "generateContent" in m.get("supportedGenerationMethods", []) and "flash" in m["name"] and not any(x in m["name"] for x in ("image", "audio", "tts", "live", "vision"))]
            def rank(name):
                version = re.search(r'gemini-(\d+)(?:\.(\d+))?', name)
                number = tuple(-int(v or 0) for v in version.groups()) if version else (0, 0)
                return ('preview' in name or 'experimental' in name, 'lite' in name, number, name)
            names.sort(key=rank)
        else:
            base = {"GROQ": "https://api.groq.com/openai/v1", "OPENROUTER": "https://openrouter.ai/api/v1", "OPENAI": "https://api.openai.com/v1"}[provider]
            response = requests.get(base + "/models", headers={"Authorization": "Bearer " + key}, timeout=min(timeout_seconds, self.remaining()))
            response.raise_for_status()
            available = [m["id"] for m in response.json().get("data", [])]
            # Model availability can differ by Groq key. Always rediscover it
            # there so a stale cache or environment override cannot bypass the
            # structured-output allowlist or Llama priority.
            preferred = {"GROQ": _GROQ_STRUCTURED_MODELS, "OPENAI": ["gpt-4.1-mini", "gpt-4o-mini"], "OPENROUTER": ["meta-llama/llama-3.3-70b-instruct"]}[provider]
            names = [n for n in preferred if n in available]
        if not names:
            raise PipelineError("MODEL_CONFIGURATION_REQUIRED", "Cần cấu hình ADAPTIVE_<PROVIDER>_MODEL khả dụng")
        if provider != "GROQ":
            self.models[provider] = names[0]
            with _provider_lock:
                _provider_model_cache[provider] = names[0]
        else:
            # Groq availability is discovered per key.  Caching only this
            # exact key preserves that policy and avoids another model-list
            # request when the same real key succeeds in a later stage.
            self.key_models[key_model] = names[0]
        return names[0]

    def json(self, stage, system, data):
        prompt = json.dumps(data, ensure_ascii=False, default=str)
        configured_provider = os.getenv("ADAPTIVE_PROVIDER", "").upper()
        providers = [configured_provider] if configured_provider else ["GEMINI", "GROQ", "OPENROUTER", "OPENAI"]
        last_error = "PROVIDER_UNAVAILABLE"
        attempted_any = False
        retry_after = None
        stage_deadline = min(time.monotonic() + stage_budget_seconds(stage), self.deadline)
        for provider_position, provider in enumerate(providers):
            if provider not in ("GEMINI", "GROQ", "OPENROUTER", "OPENAI"):
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
            while _provider_available(provider):
                key = key_pool.lease_key_for_provider(provider, attempted_keys, self._preferred_keys(provider))
                if key is None:
                    provider_exhausted = True
                    break
                attempted_keys.append(key)
                attempted_any = True
                with self.lock:
                    if self.tokens >= 32000:
                        key_pool.release_key(key)
                        raise PipelineError("LLM_BUDGET_EXCEEDED")
                started = time.monotonic()
                response = None
                raw = None
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
                    candidate_count = self._candidate_count(provider, attempted_keys[:-1])
                    fallback_count = self._fallback_provider_count(providers, provider_position)
                    stage_timeout = min(global_remaining, fair_attempt_timeout(
                        stage, stage_remaining, candidate_count, fallback_count,
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
                    if provider == "GEMINI":
                        payload = {"system_instruction": {"parts": [{"text": system}]}, "contents": [{"role": "user", "parts": [{"text": prompt}]}], "generationConfig": {"temperature": .25, "maxOutputTokens": output_limit, "responseMimeType": "application/json"}}
                        response = requests.post(f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent", headers={"x-goog-api-key": key}, json=payload, timeout=(min(4, read_timeout), read_timeout), stream=True)
                    else:
                        base = {"GROQ": "https://api.groq.com/openai/v1", "OPENROUTER": "https://openrouter.ai/api/v1", "OPENAI": "https://api.openai.com/v1"}[provider]
                        payload = {"model": model, "messages": [{"role": "system", "content": system}, {"role": "user", "content": prompt}], "temperature": .25, "max_tokens": output_limit, "response_format": {"type": "json_object"}}
                        response = requests.post(base + "/chat/completions", headers={"Authorization": "Bearer " + key}, json=payload, timeout=(min(4, read_timeout), read_timeout), stream=True)
                    receipt["http_status"] = response.status_code
                    response.raise_for_status()
                    body = bytearray()
                    for chunk in response.iter_content(chunk_size=8192):
                        if time.monotonic() > call_deadline:
                            raise PipelineError("PROVIDER_DEADLINE_EXCEEDED")
                        body.extend(chunk)
                        if len(body) > 1000000:
                            raise PipelineError("PROVIDER_RESPONSE_TOO_LARGE")
                    self.remaining()
                    if time.monotonic() > call_deadline:
                        raise PipelineError("PROVIDER_DEADLINE_EXCEEDED")
                    result = json.loads(body)
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
                    if last_error == "PROVIDER_RESPONSE_INVALID" and raw is not None:
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
