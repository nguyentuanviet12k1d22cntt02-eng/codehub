"""Legacy multi-provider path (learning-path generation, legacy agents).

Before the fix it asked Groq for two llama models that answer 404 on the
current keys, tried the two most overloaded Gemini Flash models first on every
key (25 s each), put the Gemini key in the URL, and always started with Gemini.
"""
import os
import time
import unittest
from unittest.mock import patch

import requests

from app.llm.key_pool_manager import AIKeyPoolManager
from app.llm.pipeline import health

OVERLOAD_TEXT = '{"error": {"code": 503, "message": "This model is currently experiencing high demand.", "status": "UNAVAILABLE"}}'


class Response:
    def __init__(self, status, payload=None, text=""):
        self.status_code = status
        self._payload = payload or {}
        self.text = text

    def json(self):
        return self._payload


def gemini_ok(text='{"ok": true}'):
    return Response(200, {"candidates": [{"content": {"parts": [{"text": text}]}}]})


def groq_ok():
    return Response(200, {"choices": [{"message": {"content": '{"ok": true}'}}]})


def quiet_pool(**providers):
    pool = AIKeyPoolManager()
    for name, keys in providers.items():
        pool._provider_pools[name] = keys
    pool._last_fetch_time = time.time()
    pool.log_call = lambda *a, **k: None
    pool.mark_key_exhausted = lambda *a, **k: None
    pool.report_key_success = lambda *a, **k: None
    return pool


class LegacyGeminiTests(unittest.TestCase):
    def test_overloaded_model_is_skipped_for_the_next_key_and_key_is_not_in_the_url(self):
        calls = []

        def post(url, json=None, headers=None, timeout=None):
            calls.append((url, headers.get("x-goog-api-key")))
            if url.endswith("gemini-3.5-flash-lite:generateContent"):
                return Response(503, text=OVERLOAD_TEXT)
            return gemini_ok()

        pool = quiet_pool(GEMINI=["key-a", "key-b"])
        with patch.dict(os.environ, {"ADAPTIVE_GEMINI_MODELS": "gemini-3.5-flash-lite,gemini-3.5-flash"}, clear=False), \
             patch.object(requests, "post", side_effect=post):
            self.assertEqual(pool._call_gemini("key-a", "p"), '{"ok": true}')
            self.assertEqual(pool._call_gemini("key-b", "p"), '{"ok": true}')
        models = [url.rsplit("/", 1)[1].split(":")[0] for url, _ in calls]
        self.assertEqual(models, ["gemini-3.5-flash-lite", "gemini-3.5-flash", "gemini-3.5-flash"])
        self.assertTrue(all("key=" not in url for url, _ in calls))
        self.assertEqual([key for _, key in calls], ["key-a", "key-a", "key-b"])

    def test_gemini_3_flash_uses_low_thinking(self):
        sent = []

        def post(url, json=None, headers=None, timeout=None):
            sent.append(json["generationConfig"])
            return gemini_ok()

        with patch.dict(os.environ, {"ADAPTIVE_GEMINI_MODELS": "gemini-3.5-flash"}, clear=False), \
             patch.object(requests, "post", side_effect=post):
            quiet_pool(GEMINI=["key-a"])._call_gemini("key-a", "p")
        self.assertEqual(sent[0]["thinkingConfig"], {"thinkingLevel": "low"})
        self.assertEqual(sent[0]["temperature"], 0.7)


class LegacyGroqTests(unittest.TestCase):
    def test_served_model_first_and_missing_models_are_not_requested_again(self):
        sent = []

        def post(url, json=None, headers=None, timeout=None):
            sent.append(json["model"])
            return groq_ok()

        with patch.object(requests, "post", side_effect=post):
            quiet_pool(GROQ=["g"])._call_groq("g", "return json")
        self.assertEqual(sent, ["qwen/qwen3.8-27b"])

    def test_a_404_model_is_skipped_on_later_calls(self):
        sent = []

        def post(url, json=None, headers=None, timeout=None):
            sent.append(json["model"])
            if json["model"] == "qwen/qwen3.8-27b":
                return Response(400, text="Failed to generate JSON")
            if json["model"] == "llama-3.3-70b-versatile":
                return Response(404, text="model does not exist")
            return groq_ok()

        pool = quiet_pool(GROQ=["g"])
        with patch.object(requests, "post", side_effect=post):
            pool._call_groq("g", "p")
            pool._call_groq("g", "p")
        self.assertEqual(sent, ["qwen/qwen3.8-27b", "llama-3.3-70b-versatile", "llama-3.1-8b-instant",
                                "qwen/qwen3.8-27b", "llama-3.1-8b-instant"])


class LegacyOrderTests(unittest.TestCase):
    def test_multi_provider_pool_follows_the_health_aware_order(self):
        order = []
        pool = quiet_pool(GEMINI=["gm"], GROQ=["gq"], INCEPTION=["mc"])
        pool._call_groq = lambda key, *a: order.append("GROQ") or None
        pool._call_inception = lambda key, *a: order.append("INCEPTION") or '{"ok": true}'
        pool._call_gemini = lambda key, *a: order.append("GEMINI") or '{"ok": true}'
        with patch.dict(os.environ, {"ADAPTIVE_PROVIDER_ORDER": ""}, clear=False):
            self.assertEqual(pool.call_multi_provider_pool("p"), '{"ok": true}')
        self.assertEqual(order, ["GROQ", "INCEPTION"])

    def test_degraded_gemini_is_tried_last(self):
        health.record_outcome("GEMINI", False, slow_failure=True)
        health.record_outcome("GEMINI", False, slow_failure=True)
        with patch.dict(os.environ, {"ADAPTIVE_PROVIDER_ORDER": "GEMINI,GROQ"}, clear=False):
            self.assertEqual(health.ordered_providers()[0], "GROQ")


if __name__ == "__main__":
    unittest.main()
