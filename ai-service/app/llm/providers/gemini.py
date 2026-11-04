import time
import requests
from typing import Optional


class GeminiProviderMixin:

    def _call_gemini(self, key: str, prompt: str, system_prompt: str = None) -> Optional[str]:
        models_to_try = ["gemini-3.5-flash", "gemini-3.6-flash", "gemini-3.1-flash-lite"]
        full_text = prompt
        if system_prompt:
            full_text = f"{system_prompt}\n\n{prompt}"

        payload = {
            "contents": [{"parts": [{"text": full_text}]}],
            "generationConfig": {
                "temperature": 0.7,
                "maxOutputTokens": 8192,
                "responseMimeType": "application/json"
            }
        }
        headers = {"Content-Type": "application/json"}

        for model_name in models_to_try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={key}"
            t0 = time.time()
            try:
                res = requests.post(url, json=payload, headers=headers, timeout=25.0)
                lat = int((time.time() - t0) * 1000)
                if res.status_code == 200:
                    result = res.json()
                    text = result["candidates"][0]["content"]["parts"][0]["text"]
                    print(f"\n[AI-POOL] [SUCCESS] GEMINI ({model_name}) SUCCESS in {lat}ms!", flush=True)
                    self.log_call("GEMINI", model_name, key, "SUCCESS", 200, lat, prompt, text)
                    return text
                elif res.status_code in (429, 403):
                    self.mark_key_exhausted(key, "GEMINI", 60.0, f"HTTP {res.status_code} Quota/Rate Limit")
                    self.log_call("GEMINI", model_name, key, "FAILED", res.status_code, lat, prompt, None, f"HTTP {res.status_code} Quota/Rate Limit")
                    return None
                else:
                    print(f"[Gemini API Error] Model {model_name} Status {res.status_code}: {res.text[:100]}")
                    self.log_call("GEMINI", model_name, key, "FAILED", res.status_code, lat, prompt, None, res.text[:100])
                    continue
            except Exception as e:
                lat = int((time.time() - t0) * 1000)
                print(f"[Gemini Exception] {e}")
                self.log_call("GEMINI", model_name, key, "FAILED", 500, lat, prompt, None, str(e)[:100])
                continue
        return None
