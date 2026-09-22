import os
import sys
import time
import threading
import requests
from typing import List, Dict, Optional, Any
from dotenv import load_dotenv

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, ".env"))

BACKEND_INTERNAL_URL = os.getenv("BACKEND_INTERNAL_URL", "http://localhost:3000/api/internal/ai-keys")

class AIKeyPoolManager:
    """
    Quản lý Hồ chứa API Key Đa Nhà Cung Cấp & Tự động xoay vòng (Multi-Provider Key Pool)
    - Hỗ trợ: Google Gemini, Groq Cloud, OpenRouter, OpenAI
    - Tự động phân loại và đồng bộ từ database backend
    - Xoay vòng round-robin thông minh theo từng provider
    - Cơ chế Auto-Failover: Gemini -> Groq -> OpenRouter -> OpenAI
    - Tự động cách ly tạm thời từng key bị lỗi quota hoặc lỗi provider có thể hồi phục
    """
    
    def __init__(self):
        self._provider_pools: Dict[str, List[str]] = {
            "GEMINI": [],
            "GROQ": [],
            "OPENROUTER": [],
            "OPENAI": []
        }
        self._last_fetch_time: float = 0.0
        self._cache_ttl: float = 30.0 # Làm mới mỗi 30s
        self._cooldown_map: Dict[str, float] = {} # key -> timestamp hết hạn cooldown
        self._lock = threading.RLock()
        self._round_robin_index: Dict[str, int] = {}
        self._leases: Dict[str, int] = {}
        
    def _fetch_keys_from_backend(self) -> Dict[str, List[str]]:
        now = time.time()
        if (now - self._last_fetch_time < self._cache_ttl) and any(self._provider_pools.values()):
            return self._provider_pools

        try:
            res = requests.get(f"{BACKEND_INTERNAL_URL}/active", timeout=2.5)
            if res.status_code == 200:
                data = res.json()
                self._provider_pools["GEMINI"] = data.get("geminiKeys", [])
                self._provider_pools["GROQ"] = data.get("groqKeys", [])
                self._provider_pools["OPENROUTER"] = data.get("openrouterKeys", [])
                self._provider_pools["OPENAI"] = data.get("openaiKeys", [])
                self._last_fetch_time = now
                return self._provider_pools
        except Exception:
            pass

        # Fallback từ .env nếu chưa lấy được từ backend
        env_gemini = os.getenv("GEMINI_API_KEY", os.getenv("GOOGLE_API_KEY", "")).strip()
        env_groq = os.getenv("GROQ_API_KEY", "").strip()
        env_openrouter = os.getenv("OPENROUTER_API_KEY", "").strip()
        env_openai = os.getenv("OPENAI_API_KEY", "").strip()

        if env_gemini and env_gemini not in self._provider_pools["GEMINI"]:
            self._provider_pools["GEMINI"].append(env_gemini)
        if env_groq and env_groq not in self._provider_pools["GROQ"]:
            self._provider_pools["GROQ"].append(env_groq)
        if env_openrouter and env_openrouter not in self._provider_pools["OPENROUTER"]:
            self._provider_pools["OPENROUTER"].append(env_openrouter)
        if env_openai and env_openai not in self._provider_pools["OPENAI"]:
            self._provider_pools["OPENAI"].append(env_openai)

        self._last_fetch_time = now
        return self._provider_pools

    def get_available_keys_for_provider(self, provider: str) -> List[str]:
        pools = self._fetch_keys_from_backend()
        normalized = provider.upper()
        with self._lock:
            now = time.time()
            active = [k for k in pools.get(normalized, []) if self._cooldown_map.get(k, 0) < now]
            if not active:
                return []
            return active

    def lease_key_for_provider(self, provider: str, excluded: Optional[List[str]] = None,
                               preferred: Optional[List[str]] = None) -> Optional[str]:
        """Atomically select the least busy usable key for one provider.

        A transient provider failure only cools the key that received it.
        Concurrent runs therefore spread across distinct keys when possible
        and never revive a cooling key prematurely.
        """
        normalized = provider.upper()
        excluded = set(excluded or [])
        preferred = set(preferred or [])
        keys = self.get_available_keys_for_provider(normalized)
        with self._lock:
            candidates = [key for key in keys if key not in excluded]
            if not candidates:
                return None
            # A key that returned a valid LLM response earlier in this run is
            # a better real candidate than an unproven sibling.  It is still
            # leased normally, so concurrent runs remain accounted for.
            known_good = [key for key in candidates if key in preferred]
            if known_good:
                candidates = known_good
            least_busy = min(self._leases.get(key, 0) for key in candidates)
            choices = [key for key in candidates if self._leases.get(key, 0) == least_busy]
            start = self._round_robin_index.get(normalized, 0) % len(choices)
            key = choices[start]
            self._round_robin_index[normalized] = (start + 1) % len(choices)
            self._leases[key] = self._leases.get(key, 0) + 1
            return key

    def release_key(self, api_key: str) -> None:
        with self._lock:
            remaining = self._leases.get(api_key, 0) - 1
            if remaining > 0:
                self._leases[api_key] = remaining
            else:
                self._leases.pop(api_key, None)

    def mark_key_temporarily_unavailable(self, api_key: str, provider: str, cooldown_seconds: float = 60.0, error_msg: str = "provider error"):
        """Temporarily isolate one key and report the real provider failure."""
        with self._lock:
            self._cooldown_map[api_key] = time.time() + cooldown_seconds
        print(f"[AIKeyPool] [{provider}] Key ...{api_key[-6:]} tạm ngưng ({error_msg}). {cooldown_seconds}s.")
        
        try:
            requests.post(
                f"{BACKEND_INTERNAL_URL}/report",
                json={"apiKey": api_key, "success": False, "errorMessage": f"[{provider}] {error_msg}"},
                timeout=1.0
            )
        except Exception:
            pass

    def mark_key_exhausted(self, api_key: str, provider: str, cooldown_seconds: float = 60.0, error_msg: str = "429 Quota Exceeded"):
        """Compatibility alias for quota callers; all callers use key-scoped cooldowns."""
        self.mark_key_temporarily_unavailable(api_key, provider, cooldown_seconds, error_msg)

    def report_key_success(self, api_key: str):
        """Ghi nhận lượt gọi thành công của key"""
        try:
            requests.post(
                f"{BACKEND_INTERNAL_URL}/report",
                json={"apiKey": api_key, "success": True},
                timeout=1.0
            )
        except Exception:
            pass

    def log_call(self, provider: str, model: str, api_key: str, status: str, status_code: int = 200, latency_ms: int = 0, prompt_sample: str = None, response_sample: str = None, error_message: str = None, update_key_stats: bool = True):
        """Báo cáo log chi tiết về Backend để hiển thị trên Admin Dashboard"""
        try:
            requests.post(
                f"{BACKEND_INTERNAL_URL}/log",
                json={
                    "provider": provider,
                    "model": model,
                    "apiKey": api_key,
                    "status": status,
                    "statusCode": status_code,
                    "latencyMs": latency_ms,
                    "promptSample": prompt_sample[:300] if prompt_sample else None,
                    "responseSample": response_sample[:400] if response_sample else None,
                    "errorMessage": error_message[:300] if error_message else None,
                    "updateKeyStats": update_key_stats,
                },
                timeout=1.5
            )
        except Exception:
            pass

    def log_call_async(self, **kwargs):
        """Write observability data without putting the provider call on the Admin API critical path."""
        threading.Thread(target=self.log_call, kwargs=kwargs, daemon=True).start()

    # ==================== CALL PROVIDERS DIRECTLY ====================

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

    def _call_groq(self, key: str, prompt: str, system_prompt: str = None) -> Optional[str]:
        models_to_try = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "qwen/qwen3.8-27b"]
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
                    return content
                elif res.status_code in (429, 403):
                    self.mark_key_exhausted(key, "GROQ", 60.0, f"HTTP {res.status_code} Quota/Rate Limit")
                    self.log_call("GROQ", model_name, key, "FAILED", res.status_code, lat, prompt, None, f"HTTP {res.status_code} Quota")
                    return None
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

    # ==================== MAIN DISPATCHER ====================

    def call_multi_provider_pool(self, prompt: str, system_prompt: str = None) -> Optional[str]:
        """
        Gọi AI qua Hồ chứa Key Đa Nhà Cung Cấp.
        Thứ tự ưu tiên:
        1. Google Gemini (nhanh, phản hồi tiếng Việt tự nhiên)
        2. Groq Cloud (siêu tốc với Llama 3.3 70B)
        3. OpenRouter (tổng hợp nhiều model)
        4. OpenAI (GPT-4o Mini)
        """
        providers_order = ["GEMINI", "GROQ", "OPENROUTER", "OPENAI"]

        for prov in providers_order:
            keys = self.get_available_keys_for_provider(prov)
            if not keys:
                continue

            for key in keys:
                res_content = None
                if prov == "GEMINI":
                    res_content = self._call_gemini(key, prompt, system_prompt)
                elif prov == "GROQ":
                    res_content = self._call_groq(key, prompt, system_prompt)
                elif prov == "OPENROUTER":
                    res_content = self._call_openrouter(key, prompt, system_prompt)
                elif prov == "OPENAI":
                    res_content = self._call_openai(key, prompt, system_prompt)

                if res_content:
                    self.report_key_success(key)
                    return res_content

        print("[AIKeyPool] Tất cả các nhà cung cấp (Gemini, Groq, OpenRouter, OpenAI) đều không khả dụng.")
        return None

    def call_gemini_with_pool(self, prompt: str, system_prompt: str = None) -> Optional[str]:
        """Tương thích ngược với các lệnh gọi cũ"""
        return self.call_multi_provider_pool(prompt, system_prompt)

# Singleton instance
key_pool = AIKeyPoolManager()
