import os
import requests
from .errors import PipelineError
from .health import _provider_lock, _provider_model_cache, model_available

_GROQ_STRUCTURED_MODELS = ("llama-3.3-70b-versatile", "llama-3.1-8b-instant", "qwen/qwen3.8-27b")

# The newest Flash is the most contended: on 2026-11-21 gemini-3.8-flash
# answered 503 "high demand" or timed out on 81% of calls while
# gemini-3.5-flash-lite answered valid generator JSON in ~4 s. Prefer these in
# order; any other available Flash model stays a later candidate.
DEFAULT_GEMINI_PREFERENCE = ("gemini-3.5-flash-lite", "gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-3.6-flash")


def gemini_preference():
    raw = os.getenv("ADAPTIVE_GEMINI_MODELS", "")
    names = [name.strip() for name in raw.split(",") if name.strip()]
    return names or list(DEFAULT_GEMINI_PREFERENCE)


def rank_gemini_models(available):
    """Preferred stable models first, then the remaining Flash models."""
    def rank(name):
        version_text = name.partition("gemini-")[2].split("-", 1)[0]
        version_parts = version_text.split(".")
        number = tuple(-int(part) for part in version_parts[:2]) if version_parts and all(
            part.isdigit() for part in version_parts[:2]) else (0, 0)
        number = (number + (0, 0))[:2]
        return ('preview' in name or 'experimental' in name or 'latest' in name, 'lite' in name, number, name)
    preferred = [name for name in gemini_preference() if name in available]
    rest = sorted((name for name in available if name not in preferred), key=rank)
    return preferred + rest


class ModelCatalogMixin:
    def _gemini_model(self, key, timeout_seconds):
        """First Gemini candidate that is not isolated for a model-wide overload."""
        with _provider_lock:
            names = _provider_model_cache.get("GEMINI:ranked")
        if not names:
            response = requests.get("https://generativelanguage.googleapis.com/v1beta/models?pageSize=200", headers={"x-goog-api-key": key}, timeout=min(timeout_seconds, self.remaining()))
            response.raise_for_status()
            available = [m["name"].removeprefix("models/") for m in response.json().get("models", []) if "generateContent" in m.get("supportedGenerationMethods", []) and "flash" in m["name"] and not any(x in m["name"] for x in ("image", "audio", "tts", "live", "vision", "omni"))]
            names = rank_gemini_models(available)
            if not names:
                raise PipelineError("MODEL_CONFIGURATION_REQUIRED", "Cần cấu hình ADAPTIVE_GEMINI_MODEL khả dụng")
            with _provider_lock:
                _provider_model_cache["GEMINI:ranked"] = names
        model = next((name for name in names if model_available("GEMINI", name)), names[0])
        self.models["GEMINI"] = model
        return model

    def _model(self, provider, key, timeout_seconds=4):
        configured = os.getenv(f"ADAPTIVE_{provider}_MODEL") or os.getenv("ADAPTIVE_MODEL")
        key_model = (provider, key)
        if provider == "INCEPTION":
            model = configured or os.getenv("INCEPTION_MODEL", "mercury-2")
            self.models[provider] = model
            return model
        if provider == "GEMINI" and not configured:
            return self._gemini_model(key, timeout_seconds)
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
