import threading
import time
from .errors import provider_cooldown_seconds

_provider_lock = threading.Lock()

_provider_blocked_until = {}

_provider_model_cache = {}

def _provider_available(provider):
    with _provider_lock:
        return _provider_blocked_until.get(provider, 0) <= time.monotonic()

def _block_provider(provider, error_code):
    seconds = provider_cooldown_seconds(error_code)
    with _provider_lock:
        _provider_blocked_until[provider] = max(_provider_blocked_until.get(provider, 0), time.monotonic() + seconds)
