import time
import requests
from typing import Optional

from app.llm.pipeline.catalog import gemini_preference
from app.llm.pipeline.errors import MODEL_OVERLOAD_SECONDS, is_model_overload
from app.llm.pipeline.health import block_model, model_available, record_outcome
from app.llm.pipeline.transport import gemini_generation_config


class GeminiProviderMixin:

    def _call_gemini(self, key: str, prompt: str, system_prompt: str = None) -> Optional[str]:
        # Same stable-first preference as the adaptive pipeline; a model isolated
        # for a model-wide overload is skipped for every key.
        models_to_try = [name for name in gemini_preference() if model_available("GEMINI", name)]
        full_text = prompt
        if system_prompt:
            full_text = f"{system_prompt}\n\n{prompt}"

        # The key travels in a header, never in the URL (URLs end up in proxy/server logs).
        headers = {"Content-Type": "application/json", "x-goog-api-key": key}

        for model_name in models_to_try:
            payload = {
                "contents": [{"parts": [{"text": full_text}]}],
                "generationConfig": {**gemini_generation_config(model_name, 8192), "temperature": 0.7},
            }
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent"
            t0 = time.time()
            try:
                res = requests.post(url, json=payload, headers=headers, timeout=25.0)
                lat = int((time.time() - t0) * 1000)
                if res.status_code == 200:
                    result = res.json()
                    text = result["candidates"][0]["content"]["parts"][0]["text"]
                    print(f"\n[AI-POOL] [SUCCESS] GEMINI ({model_name}) SUCCESS in {lat}ms!", flush=True)
                    self.log_call("GEMINI", model_name, key, "SUCCESS", 200, lat, prompt, text)
                    record_outcome("GEMINI", True)
                    return text
                elif res.status_code in (429, 403):
                    self.mark_key_exhausted(key, "GEMINI", 60.0, f"HTTP {res.status_code} Quota/Rate Limit")
                    self.log_call("GEMINI", model_name, key, "FAILED", res.status_code, lat, prompt, None, f"HTTP {res.status_code} Quota/Rate Limit")
                    return None
                elif is_model_overload(res.status_code, res.text):
                    # "High demand" applies to every key: isolate the model, try the next one.
                    block_model("GEMINI", model_name, MODEL_OVERLOAD_SECONDS)
                    record_outcome("GEMINI", False, slow_failure=True)
                    self.log_call("GEMINI", model_name, key, "FAILED", res.status_code, lat, prompt, None, "model overloaded")
                    continue
                else:
                    print(f"[Gemini API Error] Model {model_name} Status {res.status_code}: {res.text[:100]}")
                    self.log_call("GEMINI", model_name, key, "FAILED", res.status_code, lat, prompt, None, res.text[:100])
                    continue
            except Exception as e:
                lat = int((time.time() - t0) * 1000)
                print(f"[Gemini Exception] {e}")
                if isinstance(e, requests.Timeout):
                    record_outcome("GEMINI", False, slow_failure=True)
                self.log_call("GEMINI", model_name, key, "FAILED", 500, lat, prompt, None, str(e)[:100])
                continue
        return None
