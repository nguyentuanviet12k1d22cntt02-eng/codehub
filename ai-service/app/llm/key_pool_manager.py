from .key_admin_client import KeyAdminClientMixin
from .providers.gemini import GeminiProviderMixin
from .providers.openai_compatible import OpenAICompatibleProviderMixin
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

class AIKeyPoolManager(KeyAdminClientMixin, GeminiProviderMixin, OpenAICompatibleProviderMixin):
    """
    Quản lý Hồ chứa API Key Đa Nhà Cung Cấp & Tự động xoay vòng (Multi-Provider Key Pool)
    - Hỗ trợ: Google Gemini, Groq Cloud, OpenRouter, OpenAI, Inception AI
    - Tự động phân loại và đồng bộ từ database backend
    - Xoay vòng round-robin thông minh theo từng provider
    - Cơ chế Auto-Failover theo ADAPTIVE_PROVIDER_ORDER (mặc định Groq -> Inception -> Gemini -> OpenRouter -> OpenAI)
    - Tự động cách ly tạm thời từng key bị lỗi quota hoặc lỗi provider có thể hồi phục
    """

    @property
    def _backend_internal_url(self):
        return BACKEND_INTERNAL_URL

    def __init__(self):
        self._provider_pools: Dict[str, List[str]] = {
            "GEMINI": [],
            "GROQ": [],
            "OPENROUTER": [],
            "INCEPTION": [],
            "OPENAI": []
        }
        self._last_fetch_time: float = 0.0
        self._cache_ttl: float = 30.0 # Làm mới mỗi 30s
        self._cooldown_map: Dict[str, float] = {} # key -> timestamp hết hạn cooldown
        self._lock = threading.RLock()
        self._round_robin_index: Dict[str, int] = {}
        self._leases: Dict[str, int] = {}


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


    def cool_key_quietly(self, api_key: str, cooldown_seconds: float):
        """Rest a healthy key until its rate-limit window resets (not a failure; nothing is reported)."""
        with self._lock:
            self._cooldown_map[api_key] = max(self._cooldown_map.get(api_key, 0), time.time() + cooldown_seconds)

    def mark_key_exhausted(self, api_key: str, provider: str, cooldown_seconds: float = 60.0, error_msg: str = "429 Quota Exceeded"):
        """Compatibility alias for quota callers; all callers use key-scoped cooldowns."""
        self.mark_key_temporarily_unavailable(api_key, provider, cooldown_seconds, error_msg)


    def log_call_async(self, **kwargs):
        """Write observability data without putting the provider call on the Admin API critical path."""
        threading.Thread(target=self.log_call, kwargs=kwargs, daemon=True).start()

    # ==================== CALL PROVIDERS DIRECTLY ====================


    # ==================== MAIN DISPATCHER ====================

    def call_multi_provider_pool(self, prompt: str, system_prompt: str = None) -> Optional[str]:
        """
        Gọi AI qua Hồ chứa Key Đa Nhà Cung Cấp.
        Thứ tự ưu tiên: theo ADAPTIVE_PROVIDER_ORDER (mặc định Groq → Mercury →
        Gemini → OpenRouter → OpenAI); provider đang lỗi chậm liên tục bị dời xuống cuối.
        """
        # Same health-aware order as the adaptive pipeline (ADAPTIVE_PROVIDER_ORDER).
        from app.llm.pipeline.health import ordered_providers
        providers_order = ordered_providers()

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
                elif prov == "INCEPTION":
                    res_content = self._call_inception(key, prompt, system_prompt)
                elif prov == "OPENAI":
                    res_content = self._call_openai(key, prompt, system_prompt)

                if res_content:
                    self.report_key_success(key)
                    return res_content

        print("[AIKeyPool] Tất cả các nhà cung cấp (Gemini, Groq, OpenRouter, Inception, OpenAI) đều không khả dụng.")
        return None

    def call_gemini_with_pool(self, prompt: str, system_prompt: str = None) -> Optional[str]:
        """Tương thích ngược với các lệnh gọi cũ"""
        return self.call_multi_provider_pool(prompt, system_prompt)

# Singleton instance
key_pool = AIKeyPoolManager()
