import json
import requests
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime

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

def is_request_scoped_provider_failure(error_code):
    """Whether retrying the identical payload with a sibling key is wasteful.

    Authentication, quota, network and server failures can differ by key. A
    rejected or oversized request cannot, so it must move to the next
    provider without consuming the current provider's entire key pool.
    """
    return error_code in {
        "PROVIDER_REQUEST_TOO_LARGE",
        "PROVIDER_REQUEST_REJECTED",
    }

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
