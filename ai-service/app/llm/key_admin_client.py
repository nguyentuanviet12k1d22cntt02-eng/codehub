import os
import time
import requests
from typing import List, Dict


class KeyAdminClientMixin:

    def _fetch_keys_from_backend(self) -> Dict[str, List[str]]:
        now = time.time()
        if (now - self._last_fetch_time < self._cache_ttl) and any(self._provider_pools.values()):
            return self._provider_pools

        try:
            res = requests.get(f"{self._backend_internal_url}/active", timeout=2.5)
            if res.status_code == 200:
                data = res.json()
                self._provider_pools["GEMINI"] = data.get("geminiKeys", [])
                self._provider_pools["GROQ"] = data.get("groqKeys", [])
                self._provider_pools["OPENROUTER"] = data.get("openrouterKeys", [])
                self._provider_pools["INCEPTION"] = data.get("inceptionKeys", [])
                self._provider_pools["OPENAI"] = data.get("openaiKeys", [])
                self._last_fetch_time = now
                return self._provider_pools
        except Exception:
            pass

        # Fallback từ .env nếu chưa lấy được từ backend
        env_gemini = os.getenv("GEMINI_API_KEY", os.getenv("GOOGLE_API_KEY", "")).strip()
        env_groq = os.getenv("GROQ_API_KEY", "").strip()
        env_openrouter = os.getenv("OPENROUTER_API_KEY", "").strip()
        env_inception = os.getenv("INCEPTION_API_KEY", "").strip()
        env_openai = os.getenv("OPENAI_API_KEY", "").strip()

        if env_gemini and env_gemini not in self._provider_pools["GEMINI"]:
            self._provider_pools["GEMINI"].append(env_gemini)
        if env_groq and env_groq not in self._provider_pools["GROQ"]:
            self._provider_pools["GROQ"].append(env_groq)
        if env_openrouter and env_openrouter not in self._provider_pools["OPENROUTER"]:
            self._provider_pools["OPENROUTER"].append(env_openrouter)
        if env_inception and env_inception not in self._provider_pools["INCEPTION"]:
            self._provider_pools["INCEPTION"].append(env_inception)
        if env_openai and env_openai not in self._provider_pools["OPENAI"]:
            self._provider_pools["OPENAI"].append(env_openai)

        self._last_fetch_time = now
        return self._provider_pools

    def mark_key_temporarily_unavailable(self, api_key: str, provider: str, cooldown_seconds: float = 60.0, error_msg: str = "provider error"):
        """Temporarily isolate one key and report the real provider failure."""
        with self._lock:
            self._cooldown_map[api_key] = time.time() + cooldown_seconds
        print(f"[AIKeyPool] [{provider}] Key ...{api_key[-6:]} tạm ngưng ({error_msg}). {cooldown_seconds}s.")

        try:
            requests.post(
                f"{self._backend_internal_url}/report",
                json={"apiKey": api_key, "success": False, "errorMessage": f"[{provider}] {error_msg}"},
                timeout=1.0
            )
        except Exception:
            pass

    def report_key_success(self, api_key: str):
        """Ghi nhận lượt gọi thành công của key"""
        try:
            requests.post(
                f"{self._backend_internal_url}/report",
                json={"apiKey": api_key, "success": True},
                timeout=1.0
            )
        except Exception:
            pass

    def log_call(self, provider: str, model: str, api_key: str, status: str, status_code: int = 200, latency_ms: int = 0, prompt_sample: str = None, response_sample: str = None, error_message: str = None, update_key_stats: bool = True):
        """Báo cáo log chi tiết về Backend để hiển thị trên Admin Dashboard"""
        try:
            requests.post(
                f"{self._backend_internal_url}/log",
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
