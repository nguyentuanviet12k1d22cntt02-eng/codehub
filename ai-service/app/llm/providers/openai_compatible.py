import os
import time
import requests
from typing import Optional

from app.llm.pipeline.health import block_model, model_available, record_outcome

# A model the account cannot use (404) stays skipped for this long.
MODEL_NOT_FOUND_SECONDS = 6 * 3600


class OpenAICompatibleProviderMixin:

    def _call_groq(self, key: str, prompt: str, system_prompt: str = None) -> Optional[str]:
        # qwen is what the current Groq keys serve (the llama models answer 404).
        models_to_try = [name for name in ("qwen/qwen3.8-27b", "llama-3.3-70b-versatile", "llama-3.1-8b-instant")
                         if model_available("GROQ", name)]
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        headers = {
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json"
        }

        for model_name in models_to_try:
            payload = {
                "model": model_name,
                "messages": messages,
                "temperature": 0.7,
                "max_tokens": 2048,
                "response_format": {"type": "json_object"}
            }
            t0 = time.time()
            try:
                res = requests.post("https://api.groq.com/openai/v1/chat/completions", json=payload, headers=headers, timeout=12.0)
                lat = int((time.time() - t0) * 1000)
                if res.status_code == 200:
                    result = res.json()
                    content = result["choices"][0]["message"]["content"]
                    print(f"\n[AI-POOL] [SUCCESS] GROQ ({model_name}) SUCCESS in {lat}ms!", flush=True)
                    self.log_call("GROQ", model_name, key, "SUCCESS", 200, lat, prompt, content)
                    record_outcome("GROQ", True)
                    return content
                elif res.status_code in (429, 403):
                    self.mark_key_exhausted(key, "GROQ", 60.0, f"HTTP {res.status_code} Quota/Rate Limit")
                    self.log_call("GROQ", model_name, key, "FAILED", res.status_code, lat, prompt, None, f"HTTP {res.status_code} Quota")
                    return None
                elif res.status_code == 404:
                    block_model("GROQ", model_name, MODEL_NOT_FOUND_SECONDS)
                    self.log_call("GROQ", model_name, key, "FAILED", 404, lat, prompt, None, "model not available for this account")
                    continue
                else:
                    print(f"[Groq API Error] Model {model_name} Status {res.status_code}: {res.text[:100]}")
                    self.log_call("GROQ", model_name, key, "FAILED", res.status_code, lat, prompt, None, res.text[:100])
                    continue
            except Exception as e:
                lat = int((time.time() - t0) * 1000)
                print(f"[Groq Exception] {e}")
                self.log_call("GROQ", model_name, key, "FAILED", 500, lat, prompt, None, str(e)[:100])
                continue
        return None

    def _call_openrouter(self, key: str, prompt: str, system_prompt: str = None) -> Optional[str]:
        models_to_try = ["meta-llama/llama-3.3-70b-instruct", "deepseek/deepseek-chat", "openrouter/free"]
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        headers = {
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "LearnCode"
        }

        for model_name in models_to_try:
            payload = {
                "model": model_name,
                "messages": messages,
                "temperature": 0.7,
                "max_tokens": 4096,
                "response_format": {"type": "json_object"}
            }
            t0 = time.time()
            try:
                res = requests.post("https://openrouter.ai/api/v1/chat/completions", json=payload, headers=headers, timeout=14.0)
                lat = int((time.time() - t0) * 1000)
                if res.status_code == 200:
                    result = res.json()
                    content = result["choices"][0]["message"]["content"]
                    print(f"\n[AI-POOL] [SUCCESS] OPENROUTER ({model_name}) SUCCESS in {lat}ms!", flush=True)
                    self.log_call("OPENROUTER", model_name, key, "SUCCESS", 200, lat, prompt, content)
                    return content
                elif res.status_code in (429, 403):
                    self.mark_key_exhausted(key, "OPENROUTER", 60.0, f"HTTP {res.status_code} Quota/Rate Limit")
                    self.log_call("OPENROUTER", model_name, key, "FAILED", res.status_code, lat, prompt, None, f"HTTP {res.status_code} Quota")
                    return None
                else:
                    print(f"[OpenRouter Error] Model {model_name} Status {res.status_code}: {res.text[:100]}")
                    self.log_call("OPENROUTER", model_name, key, "FAILED", res.status_code, lat, prompt, None, res.text[:100])
                    continue
            except Exception as e:
                lat = int((time.time() - t0) * 1000)
                print(f"[OpenRouter Exception] {e}")
                self.log_call("OPENROUTER", model_name, key, "FAILED", 500, lat, prompt, None, str(e)[:100])
                continue
        return None

    def _call_openai(self, key: str, prompt: str, system_prompt: str = None) -> Optional[str]:
        models_to_try = ["gpt-4o-mini", "gpt-4o"]
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        headers = {
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json"
        }

        for model_name in models_to_try:
            payload = {
                "model": model_name,
                "messages": messages,
                "temperature": 0.7,
                "response_format": {"type": "json_object"}
            }
            t0 = time.time()
            try:
                res = requests.post("https://api.openai.com/v1/chat/completions", json=payload, headers=headers, timeout=14.0)
                lat = int((time.time() - t0) * 1000)
                if res.status_code == 200:
                    result = res.json()
                    content = result["choices"][0]["message"]["content"]
                    print(f"\n[AI-POOL] [SUCCESS] OPENAI ({model_name}) SUCCESS in {lat}ms!", flush=True)
                    self.log_call("OPENAI", model_name, key, "SUCCESS", 200, lat, prompt, content)
                    return content
                elif res.status_code in (429, 403):
                    self.mark_key_exhausted(key, "OPENAI", 60.0, f"HTTP {res.status_code} Quota/Rate Limit")
                    self.log_call("OPENAI", model_name, key, "FAILED", res.status_code, lat, prompt, None, f"HTTP {res.status_code} Quota")
                    return None
                else:
                    print(f"[OpenAI Error] Model {model_name} Status {res.status_code}: {res.text[:100]}")
                    self.log_call("OPENAI", model_name, key, "FAILED", res.status_code, lat, prompt, None, res.text[:100])
                    continue
            except Exception as e:
                lat = int((time.time() - t0) * 1000)
                print(f"[OpenAI Exception] {e}")
                self.log_call("OPENAI", model_name, key, "FAILED", 500, lat, prompt, None, str(e)[:100])
                continue
        return None

    def _call_inception(self, key: str, prompt: str, system_prompt: str = None) -> Optional[str]:
        model_name = os.getenv("INCEPTION_MODEL", "mercury-2")
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
        headers = {
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": model_name,
            "messages": messages,
            "temperature": 0.7,
            "max_tokens": 4096
        }
        t0 = time.time()
        try:
            res = requests.post(
                "https://api.inceptionlabs.ai/v1/chat/completions",
                json=payload,
                headers=headers,
                timeout=14.0
            )
            lat = int((time.time() - t0) * 1000)
            if res.status_code == 200:
                result = res.json()
                content = result["choices"][0]["message"]["content"]
                print(f"\n[AI-POOL] [SUCCESS] INCEPTION ({model_name}) SUCCESS in {lat}ms!", flush=True)
                self.log_call("INCEPTION", model_name, key, "SUCCESS", 200, lat, prompt, content)
                return content
            if res.status_code in (429, 403):
                self.mark_key_exhausted(key, "INCEPTION", 60.0, f"HTTP {res.status_code} Quota/Rate Limit")
                self.log_call("INCEPTION", model_name, key, "FAILED", res.status_code, lat, prompt, None, f"HTTP {res.status_code} Quota")
                return None
            print(f"[Inception API Error] Model {model_name} Status {res.status_code}: {res.text[:100]}")
            self.log_call("INCEPTION", model_name, key, "FAILED", res.status_code, lat, prompt, None, res.text[:100])
        except Exception as e:
            lat = int((time.time() - t0) * 1000)
            print(f"[Inception Exception] {e}")
            self.log_call("INCEPTION", model_name, key, "FAILED", 500, lat, prompt, None, str(e)[:100])
        return None
