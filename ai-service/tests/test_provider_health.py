"""Provider order, cross-run health, model overload, truncation and Gemini config.

Evidence (2026-11-21, 7 days / 78 runs): gemini-3.8-flash failed 204 of 252
calls (503 "high demand", 35 s timeouts, JSON cut off by thinking tokens) and
still went first on every stage, costing 10-35 s per stage.
"""
import os
import time
import unittest
from unittest.mock import patch

import requests

import app.pipeline.llm_client as llm_client_module
from app.llm.key_pool_manager import AIKeyPoolManager
from app.llm.pipeline import health
from app.llm.pipeline.catalog import ModelCatalogMixin, rank_gemini_models
from app.llm.pipeline.errors import is_model_overload
from app.llm.pipeline.transport import completion_truncated, gemini_generation_config
from app.pipeline.llm_client import PipelineLLMClient
from tests.test_pipeline_v3 import FakeProviderResponse

OVERLOAD = {"error": {"code": 503, "status": "UNAVAILABLE",
                      "message": "This model is currently experiencing high demand. Spikes in demand are usually temporary."}}
GROQ_OK = {"id": "groq", "model": "qwen/qwen3.8-27b", "usage": {"total_tokens": 9},
           "choices": [{"finish_reason": "stop", "message": {"content": '{"ok": true}'}}]}


def pool_with(**providers):
    pool = AIKeyPoolManager()
    for name, keys in providers.items():
        pool._provider_pools[name] = keys
    pool._last_fetch_time = time.time()
    pool.mark_key_temporarily_unavailable = lambda *a, **k: None
    pool.mark_key_exhausted = lambda *a, **k: None
    pool.report_key_success = lambda *a, **k: None
    pool.log_call_async = lambda **k: None
    return pool


def run_json(pool, post, order="GEMINI,GROQ", model=lambda provider, *a: "gemini-3.5-flash" if provider == "GEMINI" else "qwen/qwen3.8-27b", stage="IntentRouterAgent"):
    client = PipelineLLMClient(timeout_seconds=60)
    with patch.dict(os.environ, {"ADAPTIVE_PROVIDER": "", "ADAPTIVE_PROVIDER_ORDER": order}, clear=False), \
         patch.dict(llm_client_module._provider_blocked_until, {}, clear=True), \
         patch.object(llm_client_module, "key_pool", pool), \
         patch.object(client, "_model", side_effect=model), \
         patch.object(llm_client_module.requests, "post", side_effect=post):
        result = client.json(stage, "router", {"request": "x"})
    return result, client


class ProviderOrderTests(unittest.TestCase):
    def test_default_order_puts_measured_fast_providers_first(self):
        with patch.dict(os.environ, {"ADAPTIVE_PROVIDER_ORDER": ""}, clear=False):
            self.assertEqual(health.ordered_providers(), ["GROQ", "INCEPTION", "GEMINI", "OPENROUTER", "OPENAI"])

    def test_configured_order_ignores_unknown_names_and_keeps_the_rest_as_last_resort(self):
        with patch.dict(os.environ, {"ADAPTIVE_PROVIDER_ORDER": "inception, gemini, bogus"}, clear=False):
            self.assertEqual(health.ordered_providers(), ["INCEPTION", "GEMINI", "GROQ", "OPENROUTER", "OPENAI"])

    def test_provider_with_recent_slow_failures_moves_last_until_it_succeeds(self):
        with patch.dict(os.environ, {"ADAPTIVE_PROVIDER_ORDER": "GEMINI,GROQ,INCEPTION"}, clear=False):
            health.record_outcome("GEMINI", False, slow_failure=True)
            self.assertEqual(health.ordered_providers()[0], "GEMINI", "one slow failure is not a trend")
            health.record_outcome("GEMINI", False, slow_failure=True)
            self.assertEqual(health.ordered_providers()[:3], ["GROQ", "INCEPTION", "OPENROUTER"])
            self.assertEqual(health.ordered_providers()[-1], "GEMINI")
            health.record_outcome("GEMINI", True)
            self.assertEqual(health.ordered_providers()[0], "GEMINI")

    def test_fast_rate_limits_do_not_demote_a_provider(self):
        for _ in range(5):
            health.record_outcome("GROQ", False, slow_failure=False)
        self.assertFalse(health.provider_degraded("GROQ"))


class OverloadAndTimeoutTests(unittest.TestCase):
    def test_overload_body_is_recognised_but_a_bare_503_is_not(self):
        self.assertTrue(is_model_overload(503, str(OVERLOAD)))
        self.assertFalse(is_model_overload(503, ""))
        self.assertFalse(is_model_overload(500, str(OVERLOAD)))

    def test_gemini_high_demand_skips_sibling_keys_and_blocks_the_model(self):
        sent = []

        def post(url, **kwargs):
            sent.append(kwargs["headers"].get("x-goog-api-key") or kwargs["headers"].get("Authorization"))
            return FakeProviderResponse(503, OVERLOAD) if "googleapis" in url else FakeProviderResponse(200, GROQ_OK)

        pool = pool_with(GEMINI=["g-a", "g-b", "g-c"], GROQ=["q-a"])
        result, client = run_json(pool, post)
        self.assertEqual(result, {"ok": True})
        self.assertEqual(sent, ["g-a", "Bearer q-a"], "an overloaded model must not be retried on every key")
        self.assertEqual(client.calls[0]["error_code"], "PROVIDER_MODEL_OVERLOADED")
        self.assertFalse(health.model_available("GEMINI", "gemini-3.5-flash"))

    def test_bare_503_still_rotates_to_a_sibling_key(self):
        sent = []
        responses = [FakeProviderResponse(503), FakeProviderResponse(200, {
            "usageMetadata": {"totalTokenCount": 3},
            "candidates": [{"finishReason": "STOP", "content": {"parts": [{"text": '{"ok": true}'}]}}]})]

        def post(url, **kwargs):
            sent.append(kwargs["headers"].get("x-goog-api-key"))
            return responses.pop(0)

        result, _ = run_json(pool_with(GEMINI=["g-a", "g-b"]), post, order="GEMINI")
        self.assertEqual(result, {"ok": True})
        self.assertEqual(sent, ["g-a", "g-b"])

    def test_timeout_hands_the_stage_to_the_next_provider_without_a_second_wait(self):
        sent = []

        def post(url, **kwargs):
            sent.append(url)
            if "groq" in url:
                raise requests.Timeout()
            return FakeProviderResponse(200, {**GROQ_OK, "id": "mercury", "model": "mercury-2"})

        pool = pool_with(GROQ=["q-a", "q-b", "q-c"], INCEPTION=["m-a"])
        result, client = run_json(pool, post, order="GROQ,INCEPTION", model=lambda provider, *a: "qwen/qwen3.8-27b" if provider == "GROQ" else "mercury-2")
        self.assertEqual(result, {"ok": True})
        self.assertEqual(sum("groq" in url for url in sent), 1)
        self.assertEqual(client.calls[-1]["provider"], "INCEPTION")


class TruncationTests(unittest.TestCase):
    def test_truncated_reply_is_reported_as_such_and_falls_back(self):
        truncated = {"usageMetadata": {"totalTokenCount": 900},
                     "candidates": [{"finishReason": "MAX_TOKENS", "content": {"parts": [{"text": '{"intent": "EXPL'}]}}]}

        def post(url, **kwargs):
            return FakeProviderResponse(200, truncated) if "googleapis" in url else FakeProviderResponse(200, GROQ_OK)

        result, client = run_json(pool_with(GEMINI=["g-a", "g-b"], GROQ=["q-a"]), post)
        self.assertEqual(result, {"ok": True})
        self.assertEqual(client.calls[0]["error_code"], "PROVIDER_OUTPUT_TRUNCATED")
        self.assertEqual([call["provider"] for call in client.calls], ["GEMINI", "GROQ"])

    def test_truncation_detection_for_both_response_shapes(self):
        self.assertTrue(completion_truncated("GEMINI", {"candidates": [{"finishReason": "MAX_TOKENS"}]}))
        self.assertFalse(completion_truncated("GEMINI", {"candidates": [{"finishReason": "STOP"}]}))
        self.assertTrue(completion_truncated("GROQ", {"choices": [{"finish_reason": "length"}]}))
        self.assertFalse(completion_truncated("GROQ", {"choices": [{"finish_reason": "stop"}]}))
        self.assertFalse(completion_truncated("GROQ", {}))


class GeminiConfigTests(unittest.TestCase):
    def test_gemini_3_flash_thinks_low_with_room_for_the_answer(self):
        config = gemini_generation_config("gemini-3.5-flash", 900)
        self.assertEqual(config["thinkingConfig"], {"thinkingLevel": "low"})
        self.assertGreater(config["maxOutputTokens"], 900)

    def test_lite_and_older_models_keep_the_plain_config(self):
        for model in ("gemini-3.5-flash-lite", "gemini-2.5-flash"):
            config = gemini_generation_config(model, 900)
            self.assertNotIn("thinkingConfig", config)
            self.assertEqual(config["maxOutputTokens"], 900)

    def test_thinking_level_is_configurable(self):
        with patch.dict(os.environ, {"ADAPTIVE_GEMINI_THINKING_LEVEL": "medium"}, clear=False):
            self.assertEqual(gemini_generation_config("gemini-3.8-flash", 900)["thinkingConfig"], {"thinkingLevel": "medium"})

    def test_stable_models_rank_before_the_newest_flash(self):
        available = ["gemini-3.8-flash", "gemini-3.6-flash", "gemini-3.5-flash", "gemini-3.5-flash-lite", "gemini-flash-latest"]
        ranked = rank_gemini_models(available)
        self.assertEqual(ranked[:3], ["gemini-3.5-flash-lite", "gemini-3.5-flash", "gemini-3.6-flash"])
        self.assertEqual(ranked[-1], "gemini-flash-latest")

    def test_model_choice_skips_an_overloaded_model(self):
        class Catalog(ModelCatalogMixin):
            def __init__(self):
                self.models, self.key_models = {}, {}
            def remaining(self):
                return 30
        with health._provider_lock:
            health._provider_model_cache["GEMINI:ranked"] = ["gemini-3.5-flash-lite", "gemini-3.5-flash"]
        try:
            with patch.dict(os.environ, {"ADAPTIVE_GEMINI_MODEL": "", "ADAPTIVE_MODEL": ""}, clear=False):
                self.assertEqual(Catalog()._model("GEMINI", "key"), "gemini-3.5-flash-lite")
                health.block_model("GEMINI", "gemini-3.5-flash-lite", 60)
                self.assertEqual(Catalog()._model("GEMINI", "key"), "gemini-3.5-flash")
        finally:
            with health._provider_lock:
                health._provider_model_cache.pop("GEMINI:ranked", None)


class RateLimitTests(unittest.TestCase):
    """Groq answered 429 2-7 times per exercise in the 2026-11-21 browser runs (1-3 s each)."""

    def test_a_key_near_its_minute_budget_rests_before_the_next_429(self):
        rested = []
        ok = FakeProviderResponse(200, {**GROQ_OK, "usage": {"total_tokens": 4200}})
        ok.headers = {"x-ratelimit-remaining-tokens": "1800", "x-ratelimit-reset-tokens": "9.5s"}
        pool = pool_with(GROQ=["q-a"])
        pool.cool_key_quietly = lambda key, seconds: rested.append((key, seconds))
        result, client = run_json(pool, lambda url, **kw: ok, order="GROQ")
        self.assertEqual(result, {"ok": True})
        self.assertEqual(rested, [("q-a", 9.5)])
        self.assertEqual(client.calls[0]["key_rest_seconds"], 9.5)

    def test_a_key_with_budget_left_keeps_working(self):
        rested = []
        ok = FakeProviderResponse(200, GROQ_OK)
        ok.headers = {"x-ratelimit-remaining-tokens": "250000", "x-ratelimit-reset-tokens": "1s"}
        pool = pool_with(GROQ=["q-a"])
        pool.cool_key_quietly = lambda key, seconds: rested.append((key, seconds))
        run_json(pool, lambda url, **kw: ok, order="GROQ")
        self.assertEqual(rested, [])

    def test_two_rate_limited_keys_hand_the_stage_to_a_healthy_provider(self):
        sent = []

        def post(url, **kwargs):
            sent.append("groq" if "groq" in url else "mercury")
            return FakeProviderResponse(429) if "groq" in url else FakeProviderResponse(200, {**GROQ_OK, "model": "mercury-2"})

        pool = pool_with(GROQ=["q-a", "q-b", "q-c", "q-d"], INCEPTION=["m-a"])
        result, _ = run_json(pool, post, order="GROQ,INCEPTION",
                             model=lambda provider, *a: "qwen/qwen3.8-27b" if provider == "GROQ" else "mercury-2")
        self.assertEqual(result, {"ok": True})
        self.assertEqual(sent, ["groq", "groq", "mercury"])

    def test_without_a_fallback_provider_the_next_key_is_still_tried(self):
        responses = [FakeProviderResponse(429), FakeProviderResponse(429), FakeProviderResponse(200, GROQ_OK)]
        result, client = run_json(pool_with(GROQ=["q-a", "q-b", "q-c"]), lambda url, **kw: responses.pop(0),
                                  order="GROQ", model=lambda *a: "qwen/qwen3.8-27b", stage="ExerciseGeneratorAgent")
        self.assertEqual(result, {"ok": True})
        self.assertEqual(len(client.calls), 3)


class IndependentCriticTests(unittest.TestCase):
    def test_critic_prefers_a_provider_other_than_the_author(self):
        client = PipelineLLMClient(timeout_seconds=30)
        client._stage_providers["ExerciseGeneratorAgent"] = "GROQ"
        order = ["GROQ", "INCEPTION", "GEMINI"]
        self.assertEqual(client._independent_reviewer_order("CriticEvaluatorAgent", order), ["INCEPTION", "GEMINI", "GROQ"])
        self.assertEqual(client._independent_reviewer_order("ExplanationTutorAgent", order), order)

    def test_switch_off_and_single_provider_keep_the_order(self):
        client = PipelineLLMClient(timeout_seconds=30)
        client._stage_providers["ExerciseGeneratorAgent"] = "GROQ"
        with patch.dict(os.environ, {"ADAPTIVE_INDEPENDENT_CRITIC": "0"}, clear=False):
            self.assertEqual(client._independent_reviewer_order("CriticEvaluatorAgent", ["GROQ", "INCEPTION"]), ["GROQ", "INCEPTION"])
        self.assertEqual(client._independent_reviewer_order("CriticEvaluatorAgent", ["GROQ"]), ["GROQ"])

    def test_author_is_recorded_from_the_accepted_reply(self):
        pool = pool_with(GROQ=["q-a"])
        client = PipelineLLMClient(timeout_seconds=30)
        with patch.dict(os.environ, {"ADAPTIVE_PROVIDER": "", "ADAPTIVE_PROVIDER_ORDER": "GROQ"}, clear=False),              patch.dict(llm_client_module._provider_blocked_until, {}, clear=True),              patch.object(llm_client_module, "key_pool", pool),              patch.object(client, "_model", return_value="qwen/qwen3.8-27b"),              patch.object(llm_client_module.requests, "post", return_value=FakeProviderResponse(200, GROQ_OK)):
            client.json("ExerciseGeneratorAgent", "gen", {"x": 1})
        self.assertEqual(client._stage_providers["ExerciseGeneratorAgent"], "GROQ")


if __name__ == "__main__":
    unittest.main()
