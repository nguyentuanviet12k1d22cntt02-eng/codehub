import os
import requests
from .errors import PipelineError
from .health import _provider_lock, _provider_model_cache

_GROQ_STRUCTURED_MODELS = ("llama-3.3-70b-versatile", "llama-3.1-8b-instant", "qwen/qwen3.8-27b")

class ModelCatalogMixin:
    def _model(self, provider, key, timeout_seconds=4):
        configured = os.getenv(f"ADAPTIVE_{provider}_MODEL") or os.getenv("ADAPTIVE_MODEL")
        key_model = (provider, key)
        if provider == "INCEPTION":
            model = configured or os.getenv("INCEPTION_MODEL", "mercury-2")
            self.models[provider] = model
            return model
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
                version_text = name.partition("gemini-")[2].split("-", 1)[0]
                version_parts = version_text.split(".")
                number = tuple(-int(part) for part in version_parts[:2]) if version_parts and all(
                    part.isdigit() for part in version_parts[:2]) else (0, 0)
                number = (number + (0, 0))[:2]
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
