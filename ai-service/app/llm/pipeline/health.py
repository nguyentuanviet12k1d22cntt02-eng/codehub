import os
import threading
import time
from collections import deque
from .errors import provider_cooldown_seconds

_provider_lock = threading.Lock()

_provider_blocked_until = {}

_provider_model_cache = {}

# (provider, model) -> monotonic time until which that model is not used for
# any key. A model-wide overload (e.g. Gemini "high demand" 503) is not fixed
# by trying a sibling key, so it is isolated for every key at once.
_model_blocked_until = {}

# Recent outcomes per provider, shared by every run in this process. A slow
# failure (timeout, overload, truncated output) costs a whole stage window, so
# a provider that keeps producing them is moved behind healthy providers.
_provider_events = {}
HEALTH_WINDOW_SECONDS = 300
SLOW_FAILURES_TO_DEMOTE = 2

ALL_PROVIDERS = ("GEMINI", "GROQ", "OPENROUTER", "INCEPTION", "OPENAI")
# Measured on 2026-11-21 with the real generator prompt: Groq qwen 4.6-7.9 s,
# Mercury 4.6-7.3 s, Gemini flash-lite ~4 s, OpenRouter 18-27 s, while
# gemini-3.8-flash failed 81% of calls (503 high demand / 35 s timeouts).
DEFAULT_PROVIDER_ORDER = ("GROQ", "INCEPTION", "GEMINI", "OPENROUTER", "OPENAI")


def _provider_available(provider):
    with _provider_lock:
        return _provider_blocked_until.get(provider, 0) <= time.monotonic()


def _block_provider(provider, error_code):
    seconds = provider_cooldown_seconds(error_code)
    with _provider_lock:
        _provider_blocked_until[provider] = max(_provider_blocked_until.get(provider, 0), time.monotonic() + seconds)


def block_model(provider, model, seconds):
    if not model:
        return
    with _provider_lock:
        key = (provider, model)
        _model_blocked_until[key] = max(_model_blocked_until.get(key, 0), time.monotonic() + seconds)


def model_available(provider, model):
    with _provider_lock:
        return _model_blocked_until.get((provider, model), 0) <= time.monotonic()


def record_outcome(provider, ok, slow_failure=False):
    now = time.monotonic()
    with _provider_lock:
        events = _provider_events.setdefault(provider, deque(maxlen=50))
        events.append((now, bool(ok), bool(slow_failure)))


def provider_degraded(provider):
    """Several recent slow failures and no success after the latest one."""
    cutoff = time.monotonic() - HEALTH_WINDOW_SECONDS
    with _provider_lock:
        events = [event for event in _provider_events.get(provider, ()) if event[0] >= cutoff]
    slow = [event for event in events if event[2]]
    if len(slow) < SLOW_FAILURES_TO_DEMOTE:
        return False
    last_slow = slow[-1][0]
    return not any(ok and at > last_slow for at, ok, _ in events)


def configured_provider_order():
    raw = os.getenv("ADAPTIVE_PROVIDER_ORDER", "")
    order = [name.strip().upper() for name in raw.split(",") if name.strip().upper() in ALL_PROVIDERS]
    order = list(dict.fromkeys(order)) or list(DEFAULT_PROVIDER_ORDER)
    # Providers left out of an explicit order stay available as a last resort.
    return order + [name for name in DEFAULT_PROVIDER_ORDER if name not in order]


def ordered_providers():
    """Configured order with recently degraded providers moved to the end."""
    order = configured_provider_order()
    healthy = [name for name in order if not provider_degraded(name)]
    return healthy + [name for name in order if name not in healthy]


def reset_provider_health():
    """Test helper: forget cross-run health and model isolation."""
    with _provider_lock:
        _provider_events.clear()
        _model_blocked_until.clear()
