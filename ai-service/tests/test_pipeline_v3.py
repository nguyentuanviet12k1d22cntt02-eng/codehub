"""Offline regression tests. Test doubles here are never production evidence."""
import copy
import json
import os
import sys
import time
import unittest
import requests
from unittest.mock import patch
from pathlib import Path
from pydantic import ValidationError
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import app.pipeline.llm_client as llm_client_module
from app.agents.intent_router_agent import IntentRouterAgent, ROUTER_SYSTEM_PROMPT
from app.agents.adaptive_exercise_planner import AdaptiveExercisePlanner
from app.agents.critic_evaluator_agent import CriticEvaluatorAgent
from app.agents.explanation_tutor_agent import MAX_EXPLANATION_INPUT_CHARS, compact_explanation_request
from app.agents.prerequisite_advisor_agent import PrerequisiteAdvisorAgent
from app.contracts.routing import RoutingDecision
from app.pipeline.llm_client import PipelineError, PipelineLLMClient, classify_provider_error, fair_attempt_timeout, parse_provider_json, retry_after_seconds, stage_budget_seconds
from app.llm.key_pool_manager import AIKeyPoolManager
from app.orchestrator.adaptive_learning_orchestrator import AdaptiveLearningOrchestrator
from app.validation.schema_validator import SchemaValidator
from app.validation.ast_constraint_validator import AstConstraintValidator
from app.validation.sandbox_validator import SandboxValidator
from app.pipeline.runtime import digest

DRAFT = dict(title="Tính gấp đôi một số nguyên",
    problem_statement="Viết hàm solution(n) nhận một số nguyên và trả về giá trị gấp đôi. Ví dụ n=2 thì kết quả là 4. Giữ nguyên kết quả cho số âm và số không.",
    quick_theory="Phép nhân một số nguyên với hai tạo ra giá trị gấp đôi.",
    starter_code="def solution(n):\n    pass", reference_solution="def solution(n):\n    return n * 2",
    test_cases=[dict(arguments=[n], call_style="spread", expected_output=str(n*2), is_hidden=i>=2,category="boundary" if n<=0 else "normal",explanation="Kiểm tra phép nhân với số nguyên.") for i,n in enumerate([1,2,0,-1])],
    hints=dict(scaffold_1_conceptual="Dùng phép nhân để tính kết quả.",scaffold_2_syntax="Hàm dùng return để trả kết quả.",scaffold_3_pseudocode="Nhận n, nhân với hai, trả về."),
    constraints=["n là số nguyên"],common_pitfall_warning="Không in kết quả thay vì return.")
REVIEW=dict(is_approved=True,theory_approved=True,exercise_approved=True,compatibility_approved=True,score=.9,
    feedback_target="NONE",feedback="Ví dụ và mục tiêu của bài phù hợp với đặc tả.",evidence=["Ví dụ 2 trả về 4"],theory_feedback=None,exercise_feedback=None)


class FakeProviderResponse:
    """Transport fixture for retry-policy control flow; never live-agent evidence."""
    def __init__(self, status_code, payload=None):
        self.status_code = status_code
        self.payload = payload or {}
        self.headers = {}

    def raise_for_status(self):
        if self.status_code >= 400:
            error = requests.HTTPError(f"HTTP {self.status_code}")
            error.response = self
            raise error

    def iter_content(self, chunk_size=8192):
        yield json.dumps(self.payload).encode()

    def json(self):
        return self.payload

    def close(self):
        pass

class Client:
    def __init__(self): self.calls=[];self.exercise_calls=0
    def remaining(self): return 60
    def json(self,stage,system,data):
        self.calls.append(dict(stage=stage,provider="TEST_DOUBLE",status="SUCCEEDED"))
        if stage=="ExerciseGeneratorAgent":
            self.exercise_calls+=1
            return copy.deepcopy(DRAFT)
        if stage=="ExplanationTutorAgent": return {"reply":"Giải thích phép nhân và cách trả kết quả trong hàm. "*10,"source_ids":[]}
        if stage=="CriticEvaluatorAgent": return copy.deepcopy(REVIEW)
        return {"reply":"Xin chào."}

class Sandbox:
    @staticmethod
    def validate(draft,spec,timeout=40):
        return True,[],[{"passed":True,"executed":True,"image":"TEST_DOUBLE","is_hidden":t["is_hidden"]} for t in draft["test_cases"]]

class PipelineTests(unittest.TestCase):
    def test_def_content_is_an_explanation_with_a_resolvable_topic(self):
        route = IntentRouterAgent().route("Hãy tạo nội dung Def trong Python cho tôi")
        self.assertEqual(route.intent, "EXPLAIN_CONCEPT")
        self.assertEqual(route.language, "python")
        self.assertEqual(route.topic, "PY-FUNC-01")

    def test_explicit_learning_request_routes_without_an_llm_call(self):
        class FailingClient:
            def json(self, *args):
                raise AssertionError("An explicit topic must not use the LLM router")

        route = IntentRouterAgent(FailingClient()).route("Tôi muốn học vòng lặp while trong python")
        self.assertEqual(route.intent, "EXPLAIN_CONCEPT")
        self.assertEqual(route.language, "python")
        self.assertEqual(route.topic, "PY-FLOW-02")

    def test_cpp_vector_is_not_collapsed_into_static_array(self):
        route = IntentRouterAgent().route("Hãy tạo cho tôi nội dung bài tập về vector trong C++ đi")
        self.assertEqual(route.intent, "REQUEST_ADAPTIVE_EXERCISE")
        self.assertEqual(route.language, "cpp")
        self.assertEqual(route.topic, "CPP-VECTOR-01")
        spec = AdaptiveExercisePlanner().plan_exercise(route, "u")
        self.assertEqual(spec.target_concept, "CPP-VECTOR-01")
        self.assertIn("vector", spec.required_constructs)

    def test_python_list_slicing_and_mutable_request_targets_published_list_concept(self):
        route = IntentRouterAgent().route(
            "Hãy tạo cho tôi bài tập về Slicing trên List & Tính Mutable trong Python"
        )
        self.assertEqual(route.intent, "REQUEST_ADAPTIVE_EXERCISE")
        self.assertEqual(route.language, "python")
        self.assertEqual(route.topic, "PY-LIST-02")

        spec = AdaptiveExercisePlanner().plan_exercise(route, "u")
        self.assertEqual(spec.target_concept, "PY-LIST-02")
        self.assertEqual(spec.concept_title, "Slicing trên List & Tính Mutable (Tham chiếu vs Bản sao)")

    def test_python_list_readiness_uses_unified_personal_knowledge_evidence(self):
        route = IntentRouterAgent().route(
            "Hãy tạo cho tôi bài tập về Slicing trên List & Tính Mutable trong Python"
        )
        context = {"states": {
            "PY-LIST-01": {"mastery": .7684, "confidence": .6558, "attempts": 4},
            "PY-LIST-02": {"mastery": .98, "confidence": .99, "attempts": 46},
        }}
        advisor = PrerequisiteAdvisorAgent(AdaptiveLearningOrchestrator(Client, Sandbox).kg)
        readiness = advisor.assess("python", route.topic, context)

        self.assertTrue(readiness["ready"])
        self.assertEqual(readiness["readiness_percent"], 98)
        self.assertEqual(readiness["prerequisite_gaps"], [])

    def test_router_canonicalizes_generic_array_to_the_list_concept_id(self):
        route = IntentRouterAgent().route("Tạo bài Python về array")
        self.assertEqual(route.topic, "PY-LIST-01")

        spec = AdaptiveExercisePlanner().plan_exercise(route, "u")
        self.assertEqual(spec.target_concept, "PY-LIST-01")

    def test_planner_rejects_an_unmapped_label_instead_of_querying_it(self):
        route = RoutingDecision(
            intent="REQUEST_ADAPTIVE_EXERCISE", language="python", topic="array", user_text="Tạo bài Python về array"
        )
        with self.assertRaisesRegex(ValueError, "mã concept"):
            AdaptiveExercisePlanner().plan_exercise(route, "u")

    def test_short_confirmation_restores_pending_vector_target(self):
        pending={"type":"PREREQUISITE_OVERRIDE","target_concept_id":"CPP-VECTOR-01",
            "target_concept_name":"std::vector và dữ liệu hai chiều động","language":"cpp"}
        route=IntentRouterAgent().route("Tiếp tục",{"language":"cpp","pending_confirmation":pending})
        self.assertEqual(route.intent,"REQUEST_ADAPTIVE_EXERCISE")
        self.assertEqual(route.topic,"CPP-VECTOR-01")
        self.assertEqual(route.language,"cpp")

    def test_vector_readiness_uses_full_prerequisite_chain(self):
        orchestrator=AdaptiveLearningOrchestrator(Client,Sandbox)
        advisor=PrerequisiteAdvisorAgent(orchestrator.kg)
        chain=advisor.assess("cpp","CPP-VECTOR-01",{"states":{}})["prerequisite_statuses"]
        states={item["concept_id"]:{"attempts":3,"mastery":.7,"confidence":.5} for item in chain}
        assessment=advisor.assess("cpp","CPP-VECTOR-01",{"states":states})
        self.assertTrue(assessment["ready"])
        self.assertEqual(assessment["readiness_percent"],70)
        self.assertEqual(assessment["prerequisite_gaps"],[])

    def test_ready_direct_prerequisite_is_sufficient_even_without_legacy_ancestor_records(self):
        orchestrator=AdaptiveLearningOrchestrator(Client,Sandbox)
        advisor=PrerequisiteAdvisorAgent(orchestrator.kg)
        assessment=advisor.assess("cpp","CPP-VECTOR-01",{"states":{
            "CPP-ARRAY-01":{"attempts":3,"mastery":.72,"confidence":.55},
        }})
        self.assertTrue(assessment["ready"])
        self.assertEqual(assessment["readiness_percent"],72)

    def test_routing_contract_requires_all_agent_owned_fields(self):
        with self.assertRaises(ValidationError):
            RoutingDecision.model_validate({"intent": "EXPLAIN_CONCEPT"})

    def test_llm_router_rejects_missing_fields_instead_of_defaulting_them(self):
        class MissingTopicClient:
            def json(self, *args):
                return {"intent": "EXPLAIN_CONCEPT", "language": "python"}

        with self.assertRaises(PipelineError) as error:
            IntentRouterAgent(MissingTopicClient()).route("Phân loại yêu cầu Def trong Python")
        self.assertEqual(error.exception.code, "ROUTING_SCHEMA_INVALID")

    def test_router_prompt_defines_every_intent_and_required_json_fields(self):
        for value in ("GENERAL_CHAT", "EXPLAIN_CONCEPT", "ASK_KNOWLEDGE", "REQUEST_ADAPTIVE_EXERCISE", "CREATE_LEARNING_PATH", "CHECK_WEAKNESS", '"intent"', '"language"', '"topic"'):
            self.assertIn(value, ROUTER_SYSTEM_PROMPT)

    def test_transient_failure_rotates_to_the_next_key_before_provider_failover(self):
        pool = AIKeyPoolManager()
        pool._provider_pools["GEMINI"] = ["gemini-key-a", "gemini-key-b"]
        pool._last_fetch_time = time.time()
        cooled, succeeded, sent_keys, admin_logs = [], [], [], []

        def cool(key, provider, cooldown_seconds, error_msg):
            cooled.append((key, provider, cooldown_seconds, error_msg))
            with pool._lock:
                pool._cooldown_map[key] = time.time() + cooldown_seconds

        pool.mark_key_temporarily_unavailable = cool
        pool.report_key_success = lambda key: succeeded.append(key)
        pool.log_call_async = lambda **kwargs: admin_logs.append(kwargs)
        responses = [
            FakeProviderResponse(503),
            FakeProviderResponse(200, {"responseId": "second-key-response", "modelVersion": "gemini-3.8-flash", "usageMetadata": {"totalTokenCount": 12}, "candidates": [{"content": {"parts": [{"text": '{"intent":"EXPLAIN_CONCEPT","language":"python","topic":"def"}'}]}}]}),
        ]

        def post(*args, **kwargs):
            sent_keys.append(kwargs["headers"].get("x-goog-api-key"))
            return responses.pop(0)

        with llm_client_module._provider_lock:
            llm_client_module._provider_blocked_until.pop("GEMINI", None)
        client = PipelineLLMClient(timeout_seconds=30)
        with patch.dict(os.environ, {"ADAPTIVE_PROVIDER": "GEMINI"}, clear=False), \
             patch.object(llm_client_module, "key_pool", pool), \
             patch.object(client, "_model", return_value="gemini-3.8-flash"), \
             patch.object(llm_client_module.requests, "post", side_effect=post):
            result = client.json("IntentRouterAgent", "router", {"request": "def"})

        self.assertEqual(result, {"intent": "EXPLAIN_CONCEPT", "language": "python", "topic": "def"})
        self.assertEqual(sent_keys, ["gemini-key-a", "gemini-key-b"])
        self.assertEqual(cooled[0][0], "gemini-key-a")
        self.assertEqual(succeeded, ["gemini-key-b"])
        self.assertEqual([item["status"] for item in admin_logs], ["FAILED", "SUCCESS"])
        self.assertEqual([item["status_code"] for item in admin_logs], [503, 200])
        self.assertTrue(all(item["update_key_stats"] is False for item in admin_logs))
        self.assertTrue(all(item["prompt_sample"].startswith("[IntentRouterAgent]") for item in admin_logs))
        self.assertTrue(llm_client_module._provider_available("GEMINI"))

    def test_all_transient_gemini_keys_are_tried_before_groq(self):
        pool = AIKeyPoolManager()
        pool._provider_pools["GEMINI"] = ["gemini-key-a", "gemini-key-b"]
        pool._provider_pools["GROQ"] = ["groq-key-a"]
        pool._last_fetch_time = time.time()
        sent_keys = []

        def cool(key, provider, cooldown_seconds, error_msg):
            with pool._lock:
                pool._cooldown_map[key] = time.time() + cooldown_seconds

        pool.mark_key_temporarily_unavailable = cool
        pool.report_key_success = lambda key: None
        responses = [
            FakeProviderResponse(503),
            FakeProviderResponse(503),
            FakeProviderResponse(200, {"id": "groq-response", "model": "llama-3.3-70b-versatile", "usage": {"total_tokens": 12}, "choices": [{"message": {"content": '{"intent":"EXPLAIN_CONCEPT","language":"python","topic":"def"}'}}]}),
        ]

        def post(url, *args, **kwargs):
            headers = kwargs["headers"]
            sent_keys.append(headers.get("x-goog-api-key") or headers.get("Authorization"))
            return responses.pop(0)

        with llm_client_module._provider_lock:
            llm_client_module._provider_blocked_until.pop("GEMINI", None)
            llm_client_module._provider_blocked_until.pop("GROQ", None)
        client = PipelineLLMClient(timeout_seconds=30)
        with patch.dict(os.environ, {"ADAPTIVE_PROVIDER": ""}, clear=False), \
             patch.object(llm_client_module, "key_pool", pool), \
             patch.object(client, "_model", side_effect=lambda provider, *args: "gemini-3.8-flash" if provider == "GEMINI" else "llama-3.3-70b-versatile"), \
             patch.object(llm_client_module.requests, "post", side_effect=post):
            result = client.json("IntentRouterAgent", "router", {"request": "def"})

        self.assertEqual(result["topic"], "def")
        self.assertEqual(sent_keys, ["gemini-key-a", "gemini-key-b", "Bearer groq-key-a"])
        self.assertFalse(llm_client_module._provider_available("GEMINI"))
        with llm_client_module._provider_lock:
            llm_client_module._provider_blocked_until.pop("GEMINI", None)

    def test_oversized_request_skips_sibling_keys_and_preserves_fallback_budget(self):
        pool = AIKeyPoolManager()
        pool._provider_pools["GROQ"] = ["groq-key-a", "groq-key-b"]
        pool._provider_pools["OPENROUTER"] = ["openrouter-key-a"]
        pool._last_fetch_time = time.time()
        sent_keys = []
        responses = [
            FakeProviderResponse(413),
            FakeProviderResponse(200, {"id": "fallback-response", "model": "meta-llama/llama-3.3-70b-instruct",
                "usage": {"total_tokens": 20}, "choices": [{"message": {"content": '{"reply":"ok"}'}}]}),
        ]

        def post(url, *args, **kwargs):
            sent_keys.append(kwargs["headers"].get("Authorization"))
            return responses.pop(0)

        with llm_client_module._provider_lock:
            llm_client_module._provider_blocked_until.pop("GROQ", None)
            llm_client_module._provider_blocked_until.pop("OPENROUTER", None)
        client = PipelineLLMClient(timeout_seconds=30)
        model = lambda provider, *args: "llama-3.3-70b-versatile" if provider == "GROQ" else "meta-llama/llama-3.3-70b-instruct"
        with patch.dict(os.environ, {"ADAPTIVE_PROVIDER": ""}, clear=False), \
             patch.object(llm_client_module, "key_pool", pool), \
             patch.object(client, "_model", side_effect=model), \
             patch.object(llm_client_module.requests, "post", side_effect=post):
            result = client.json("ExplanationTutorAgent", "theory", {"context": "large"})

        self.assertEqual(result, {"reply": "ok"})
        self.assertEqual(sent_keys, ["Bearer groq-key-a", "Bearer openrouter-key-a"])
        self.assertEqual([call.get("http_status") for call in client.calls], [413, 200])
        self.assertEqual(client._failed_keys("GROQ"), [])

    def test_failed_key_is_not_retried_later_in_the_same_pipeline_run(self):
        pool = AIKeyPoolManager()
        pool._provider_pools["GEMINI"] = ["gemini-key-a", "gemini-key-b"]
        pool._last_fetch_time = time.time()
        sent_keys = []
        responses = [
            FakeProviderResponse(503),
            FakeProviderResponse(200, {"responseId": "good-first", "modelVersion": "gemini-3.8-flash", "usageMetadata": {"totalTokenCount": 9}, "candidates": [{"content": {"parts": [{"text": '{"intent":"EXPLAIN_CONCEPT","language":"python","topic":"def"}'}]}}]}),
            FakeProviderResponse(200, {"responseId": "good-second", "modelVersion": "gemini-3.8-flash", "usageMetadata": {"totalTokenCount": 9}, "candidates": [{"content": {"parts": [{"text": '{"intent":"EXPLAIN_CONCEPT","language":"python","topic":"def"}'}]}}]}),
        ]

        def post(*args, **kwargs):
            sent_keys.append(kwargs["headers"].get("x-goog-api-key"))
            return responses.pop(0)

        with llm_client_module._provider_lock:
            llm_client_module._provider_blocked_until.pop("GEMINI", None)
        client = PipelineLLMClient(timeout_seconds=30)
        with patch.dict(os.environ, {"ADAPTIVE_PROVIDER": "GEMINI"}, clear=False), \
             patch.object(llm_client_module, "key_pool", pool), \
             patch.object(client, "_model", return_value="gemini-3.8-flash"), \
             patch.object(llm_client_module.requests, "post", side_effect=post):
            client.json("IntentRouterAgent", "router", {"request": "def"})
            client.json("IntentRouterAgent", "router", {"request": "def again"})

        self.assertEqual(sent_keys, ["gemini-key-a", "gemini-key-b", "gemini-key-b"])

    def test_all_key_outage_is_not_replayed_by_a_later_stage(self):
        pool = AIKeyPoolManager()
        pool._provider_pools["GEMINI"] = ["gemini-key-a", "gemini-key-b"]
        pool._provider_pools["GROQ"] = ["groq-key-a"]
        pool._last_fetch_time = time.time()
        sent_keys = []
        responses = [
            FakeProviderResponse(503),
            FakeProviderResponse(503),
            FakeProviderResponse(200, {"id": "groq-response", "model": "llama-3.3-70b-versatile", "usage": {"total_tokens": 9}, "choices": [{"message": {"content": '{"intent":"EXPLAIN_CONCEPT","language":"python","topic":"def"}'}}]}),
        ]

        def post(url, *args, **kwargs):
            headers = kwargs["headers"]
            sent_keys.append(headers.get("x-goog-api-key") or headers.get("Authorization"))
            return responses.pop(0)

        with llm_client_module._provider_lock:
            llm_client_module._provider_blocked_until.pop("GEMINI", None)
            llm_client_module._provider_blocked_until.pop("GROQ", None)
        client = PipelineLLMClient(timeout_seconds=30)
        model = lambda provider, *args: "gemini-3.8-flash" if provider == "GEMINI" else "llama-3.3-70b-versatile"
        with patch.object(llm_client_module, "key_pool", pool), \
             patch.object(client, "_model", side_effect=model), \
             patch.object(llm_client_module.requests, "post", side_effect=post):
            with patch.dict(os.environ, {"ADAPTIVE_PROVIDER": "GEMINI"}, clear=False):
                with self.assertRaises(PipelineError):
                    client.json("ExerciseGeneratorAgent", "generator", {"request": "for"})
            with patch.dict(os.environ, {"ADAPTIVE_PROVIDER": ""}, clear=False):
                result = client.json("CriticEvaluatorAgent", "critic", {"request": "for"})

        self.assertEqual(result["topic"], "def")
        self.assertEqual(sent_keys, ["gemini-key-a", "gemini-key-b", "Bearer groq-key-a"])
        self.assertTrue(any(call.get("error_code") == "PROVIDER_SKIPPED_RUN_HEALTH" for call in client.calls))

    def test_stage_budget_is_shared_by_keys_and_reserves_provider_time(self):
        self.assertEqual(stage_budget_seconds("CriticEvaluatorAgent"), 110)
        self.assertEqual(stage_budget_seconds("ExplanationTutorAgent"), 90)
        self.assertLessEqual(fair_attempt_timeout("CriticEvaluatorAgent", 110, 11, 3), 9)
        self.assertEqual(fair_attempt_timeout("CriticEvaluatorAgent", 110, 2, 3, preferred=True), 28)

    def test_large_gemini_pool_yields_to_groq_after_stage_attempt_limit(self):
        pool = AIKeyPoolManager()
        pool._provider_pools["GEMINI"] = [f"gemini-key-{index}" for index in range(5)]
        pool._provider_pools["GROQ"] = ["groq-key-a"]
        pool._last_fetch_time = time.time()
        sent_keys = []
        responses = [
            FakeProviderResponse(503), FakeProviderResponse(503), FakeProviderResponse(503),
            FakeProviderResponse(200, {"id": "groq-response", "model": "llama-3.3-70b-versatile",
                "usage": {"total_tokens": 9}, "choices": [{"message": {"content":
                '{"intent":"EXPLAIN_CONCEPT","language":"python","topic":"PY-LIST-02"}'}}]}),
        ]

        def post(url, *args, **kwargs):
            headers = kwargs["headers"]
            sent_keys.append(headers.get("x-goog-api-key") or headers.get("Authorization"))
            return responses.pop(0)

        with llm_client_module._provider_lock:
            llm_client_module._provider_blocked_until.pop("GEMINI", None)
            llm_client_module._provider_blocked_until.pop("GROQ", None)
        client = PipelineLLMClient(timeout_seconds=30)
        model = lambda provider, *args: "gemini-3.8-flash" if provider == "GEMINI" else "llama-3.3-70b-versatile"
        with patch.dict(os.environ, {"ADAPTIVE_PROVIDER": ""}, clear=False), \
             patch.object(llm_client_module, "key_pool", pool), \
             patch.object(client, "_model", side_effect=model), \
             patch.object(llm_client_module.requests, "post", side_effect=post):
            result = client.json("ExerciseGeneratorAgent", "generator", {"request": "list slicing"})

        self.assertEqual(result["topic"], "PY-LIST-02")
        self.assertEqual(len(sent_keys), 4)
        self.assertEqual(len(set(sent_keys[:3])), 3)
        self.assertTrue(all(key.startswith("gemini-key-") for key in sent_keys[:3]))
        self.assertEqual(sent_keys[-1], "Bearer groq-key-a")
        self.assertTrue(any(call.get("error_code") == "PROVIDER_ATTEMPT_LIMIT_REACHED" for call in client.calls))

    def test_theory_repair_prompt_is_bounded_but_keeps_contract_and_source_ids(self):
        source_ids = [f"source-{index}" for index in range(3)]
        context = {
            "specification": {"target_concept": "CPP-VECTOR-01", "user_request": "x" * 8000,
                "required_constructs": ["vector"], "forbidden_constructs": ["array"]},
            "concept": {"description": "c" * 8000},
            "sources": [{"id": source_id, "sha256": "hash", "excerpt": "s" * 9000} for source_id in source_ids],
            "exercise": {**copy.deepcopy(DRAFT), "problem_statement": "p" * 9000, "reference_solution": "r" * 9000},
            "previous_theory": "t" * 12000,
        }
        request = compact_explanation_request("CPP-VECTOR-01", "Vector", "cpp", "q" * 4000, context,
            {**REVIEW, "feedback": "f" * 6000, "evidence": ["e" * 3000] * 10})

        self.assertLessEqual(len(json.dumps(request, ensure_ascii=False)), MAX_EXPLANATION_INPUT_CHARS)
        self.assertEqual([source["id"] for source in request["context"]["sources"]], source_ids)
        self.assertEqual(request["context"]["specification"]["target_concept"], "CPP-VECTOR-01")

    def test_groq_model_policy_ignores_reasoning_configuration_and_cache(self):
        client = PipelineLLMClient(timeout_seconds=30)
        models = FakeProviderResponse(200, {"data": [{"id": "openai/gpt-oss-120b"}, {"id": "llama-3.3-70b-versatile"}]})
        with llm_client_module._provider_lock:
            original = llm_client_module._provider_model_cache.get("GROQ")
            llm_client_module._provider_model_cache["GROQ"] = "openai/gpt-oss-120b"
        try:
            with patch.dict(os.environ, {"ADAPTIVE_GROQ_MODEL": "openai/gpt-oss-120b", "ADAPTIVE_MODEL": ""}, clear=False), \
                 patch.object(llm_client_module.requests, "get", return_value=models):
                self.assertEqual(client._model("GROQ", "groq-key-a"), "llama-3.3-70b-versatile")
        finally:
            with llm_client_module._provider_lock:
                if original is None:
                    llm_client_module._provider_model_cache.pop("GROQ", None)
                else:
                    llm_client_module._provider_model_cache["GROQ"] = original

    def test_groq_uses_live_structured_alternative_only_when_llama_is_unavailable(self):
        client = PipelineLLMClient(timeout_seconds=30)
        models = FakeProviderResponse(200, {"data": [{"id": "openai/gpt-oss-120b"}, {"id": "qwen/qwen3.8-27b"}]})
        with llm_client_module._provider_lock:
            original = llm_client_module._provider_model_cache.pop("GROQ", None)
        try:
            with patch.dict(os.environ, {"ADAPTIVE_GROQ_MODEL": "", "ADAPTIVE_MODEL": ""}, clear=False), \
                 patch.object(llm_client_module.requests, "get", return_value=models):
                self.assertEqual(client._model("GROQ", "groq-key-a"), "qwen/qwen3.8-27b")
        finally:
            with llm_client_module._provider_lock:
                llm_client_module._provider_model_cache.pop("GROQ", None)
                if original is not None:
                    llm_client_module._provider_model_cache["GROQ"] = original

    def test_groq_allowlist_keeps_llama_first_over_a_safe_environment_override(self):
        client = PipelineLLMClient(timeout_seconds=30)
        models = FakeProviderResponse(200, {"data": [{"id": "qwen/qwen3.8-27b"}, {"id": "llama-3.3-70b-versatile"}]})
        with patch.dict(os.environ, {"ADAPTIVE_GROQ_MODEL": "qwen/qwen3.8-27b", "ADAPTIVE_MODEL": ""}, clear=False), \
             patch.object(llm_client_module.requests, "get", return_value=models):
            self.assertEqual(client._model("GROQ", "groq-key-a"), "llama-3.3-70b-versatile")

    def test_while_not_greeting(self):
        self.assertEqual(IntentRouterAgent().route("Tạo bài tập về while trong Python").intent,"REQUEST_ADAPTIVE_EXERCISE")
        self.assertEqual(IntentRouterAgent().route("Xin chào, tạo bài tập Python").intent,"REQUEST_ADAPTIVE_EXERCISE")
        self.assertEqual(IntentRouterAgent().route("Cho bài SQL về SELECT").language,"sql")

    def test_followup_preserves_concept(self):
        r=IntentRouterAgent().route("Bài dễ hơn",{"language":"javascript","last_concept_id":"JS-FUNC-01"})
        self.assertEqual(r.topic,"JS-FUNC-01")
        self.assertEqual(r.language,"javascript")

    def test_explanation_followup_preserves_concept(self):
        route=IntentRouterAgent().route('Giải thích thêm lý thuyết',{'language':'python','last_concept_id':'PY-LOOP-01'})
        self.assertEqual(route.intent,'EXPLAIN_CONCEPT')
        self.assertEqual(route.topic,'PY-LOOP-01')

    def test_spec_keeps_constraints(self):
        r=IntentRouterAgent().route("Tạo bài tập Python dùng while, không dùng for và không dùng sum")
        spec=AdaptiveExercisePlanner().plan_exercise(r,"u")
        self.assertIn("while",spec.required_constructs)
        self.assertEqual(set(spec.forbidden_constructs),{"for","sum"})
        self.assertIn("không dùng",spec.user_request)

    def test_cold_start_explicit_is_diagnostic(self):
        r=IntentRouterAgent().route("Tạo bài SQL về SELECT")
        spec=AdaptiveExercisePlanner().plan_exercise(r,"u")
        self.assertEqual(spec.language,"sql")
        self.assertEqual(spec.mode,"diagnostic")
        self.assertEqual(spec.execution["dialect"],"sqlite")
        self.assertIsNone(spec.learner_evidence["mastery"])

    def test_cpp_spec_matches_real_program_entrypoint(self):
        spec=AdaptiveExercisePlanner().plan_exercise(IntentRouterAgent().route('Tạo bài C++ dùng while'),'u')
        self.assertEqual(spec.execution['mode'],'stdio')
        self.assertEqual(spec.execution['entrypoint'],'main')
        self.assertEqual(spec.execution['comparator'],'text')
        self.assertEqual(len(spec.target_sub_skills),1)

    def test_function_contract_distinguishes_a_list_argument_from_many_arguments(self):
        spec=AdaptiveExercisePlanner().plan_exercise(IntentRouterAgent().route('Tạo bài Python'),'u')
        draft=copy.deepcopy(DRAFT)
        draft['reference_solution']='def solution(lines):\n    return len(lines)'
        draft['starter_code']='def solution(lines):\n    # TODO\n    pass'
        for i,tc in enumerate(draft['test_cases']):
            tc.update(arguments=[[f'line-{i}', f'value-{i}']], call_style='single', expected_output='2')
        passed, errors=SchemaValidator.validate(draft,spec)
        self.assertTrue(passed, errors)
        draft['test_cases'][0]['call_style']='spread'
        self.assertTrue(SchemaValidator.validate(draft,spec)[0])

    def test_function_contract_rejects_ambiguous_legacy_input(self):
        spec=AdaptiveExercisePlanner().plan_exercise(IntentRouterAgent().route('Tạo bài Python'),'u')
        draft=copy.deepcopy(DRAFT)
        draft['test_cases'][0].pop('arguments')
        draft['test_cases'][0].pop('call_style')
        draft['test_cases'][0]['input']='[1]'
        passed, errors=SchemaValidator.validate(draft,spec)
        self.assertFalse(passed)
        self.assertTrue(any('input không được dùng' in error for error in errors))

    def test_preflight_detects_the_trace_signature_mismatch(self):
        spec=AdaptiveExercisePlanner().plan_exercise(IntentRouterAgent().route('Tạo bài Python'),'u')
        draft=copy.deepcopy(DRAFT)
        draft['reference_solution']='def solution(lines):\n    return len(lines)'
        for tc in draft['test_cases']:
            tc.update(arguments=['my_var = 10', 'InvalidName = 5', 'another_one=3', 'temp = 0'], call_style='spread')
        passed, errors=AstConstraintValidator.validate(draft, spec)
        self.assertFalse(passed)
        self.assertTrue(any('INVOCATION_ARITY_MISMATCH' in error for error in errors))

    def test_provider_error_taxonomy_is_stable(self):
        response=requests.Response()
        response.status_code=429
        error=requests.HTTPError(response=response)
        self.assertEqual(classify_provider_error(error), 'PROVIDER_RATE_LIMITED')
        self.assertEqual(classify_provider_error(requests.Timeout()), 'PROVIDER_TIMEOUT')

    def test_run_deadline_stops_before_recording_noop_provider_attempts(self):
        pool = AIKeyPoolManager()
        pool._provider_pools["GEMINI"] = ["gemini-key-a", "gemini-key-b"]
        pool._last_fetch_time = time.time()
        client = PipelineLLMClient(timeout_seconds=0)
        with patch.dict(os.environ, {"ADAPTIVE_PROVIDER": "GEMINI"}, clear=False), \
             patch.object(llm_client_module, "key_pool", pool):
            with self.assertRaises(PipelineError) as error:
                client.json("IntentRouterAgent", "router", {"request": "def"})
        self.assertEqual(error.exception.code, "RUN_DEADLINE_EXCEEDED")
        self.assertEqual(len(client.calls), 1)

    def test_provider_json_transport_wrapper_is_not_treated_as_a_fallback(self):
        self.assertEqual(parse_provider_json('```json\n{"approved": true}\n```'), {"approved": True})
        with self.assertRaises(ValueError):
            parse_provider_json('{"approved" true}')

    def test_rate_limited_key_cools_without_reviving_or_blocking_other_key(self):
        pool=AIKeyPoolManager()
        pool._provider_pools["GROQ"]=["key-a","key-b"]
        pool._last_fetch_time=time.time()
        first=pool.lease_key_for_provider("GROQ")
        second=pool.lease_key_for_provider("GROQ",[first])
        self.assertEqual({first,second},{"key-a","key-b"})
        pool.release_key(first)
        pool.release_key(second)
        with pool._lock:
            pool._cooldown_map["key-a"]=time.time()+60
            pool._cooldown_map["key-b"]=time.time()+60
        self.assertEqual(pool.get_available_keys_for_provider("GROQ"),[])

    def test_retry_after_header_is_bounded_and_recordable(self):
        response=requests.Response()
        response.headers["Retry-After"]="42"
        self.assertEqual(retry_after_seconds(response),42)

    def test_unknown_topic_does_not_fallback(self):
        r=IntentRouterAgent().route("Tạo bài Python")
        r.topic="not-existing-concept"
        with self.assertRaises(ValueError): AdaptiveExercisePlanner().plan_exercise(r,"u")

    def test_schema_rejects_duplicates_and_missing_hidden(self):
        draft=copy.deepcopy(DRAFT)
        draft["test_cases"][1]=copy.deepcopy(draft["test_cases"][0])
        self.assertFalse(SchemaValidator.validate(draft)[0])
        draft=copy.deepcopy(DRAFT)
        for tc in draft["test_cases"]:tc["is_hidden"]=False
        self.assertFalse(SchemaValidator.validate(draft)[0])

    def test_schema_feedback_identifies_invalid_nested_json(self):
        spec=AdaptiveExercisePlanner().plan_exercise(IntentRouterAgent().route('Tạo bài SQL SELECT ORDER BY'),'u')
        self.assertTrue(spec.execution['ordered'])
        draft=copy.deepcopy(DRAFT)
        for index,tc in enumerate(draft['test_cases']):
            tc['fixture_sql']=f'CREATE TABLE t(x); INSERT INTO t VALUES ({index});'
            tc['expected_output']="[['Lan']]"
        passed,errors=SchemaValidator.validate(draft,spec)
        self.assertFalse(passed)
        self.assertTrue(any('test_cases[0].expected_output' in error for error in errors))
        draft=copy.deepcopy(DRAFT)
        draft['starter_code']=draft['reference_solution']
        self.assertFalse(SchemaValidator.validate(draft)[0])

    def test_critic_rejection_cannot_be_overridden(self):
        client=Client()
        client.json=lambda *args: {**REVIEW,"is_approved":False,"score":.99}
        spec=AdaptiveExercisePlanner().plan_exercise(IntentRouterAgent().route("Tạo bài Python"),"u")
        self.assertFalse(CriticEvaluatorAgent(client).evaluate_content("theory",DRAFT,spec)["is_approved"])

    def test_compatibility_only_rejection_repairs_theory_not_verified_exercise(self):
        client=Client()
        client.json=lambda *args: {**REVIEW, "is_approved":False, "compatibility_approved":False,
            "feedback_target":"BOTH", "feedback":"Lý thuyết chưa gắn rõ với yêu cầu của bài tập đã kiểm thử."}
        spec=AdaptiveExercisePlanner().plan_exercise(IntentRouterAgent().route("Tạo bài Python"),"u")
        review=CriticEvaluatorAgent(client).evaluate_content("theory",DRAFT,spec)
        self.assertFalse(review["is_approved"])
        self.assertEqual(review["feedback_target"],"THEORY")

    def test_theory_only_repair_reuses_sandbox_verified_exercise(self):
        class RepairsTheory(Client):
            def __init__(self):
                super().__init__()
                self.critic_calls=0
            def json(self,stage,system,data):
                if stage=="CriticEvaluatorAgent":
                    self.calls.append(dict(stage=stage,provider="TEST_DOUBLE",status="SUCCEEDED"))
                    self.critic_calls+=1
                    if self.critic_calls==1:
                        return {**REVIEW, "is_approved":False, "compatibility_approved":False,
                            "feedback_target":"BOTH", "feedback":"Cần đồng bộ phần áp dụng với bài tập đã kiểm thử."}
                    return copy.deepcopy(REVIEW)
                return super().json(stage,system,data)
        class CountingSandbox(Sandbox):
            calls=0
            @staticmethod
            def validate(draft,spec,timeout=40):
                CountingSandbox.calls+=1
                return Sandbox.validate(draft,spec,timeout)

        client=RepairsTheory()
        result=AdaptiveLearningOrchestrator(lambda:client,CountingSandbox).process_turn(
            "u",[{"sender":"USER","content":"Tạo bài Python"}])

        self.assertEqual(result["status"],"SUCCEEDED")
        self.assertEqual(client.exercise_calls,1)
        self.assertEqual(CountingSandbox.calls,1)
        self.assertEqual([call["stage"] for call in client.calls],[
            "ExerciseGeneratorAgent","ExplanationTutorAgent","CriticEvaluatorAgent",
            "ExplanationTutorAgent","CriticEvaluatorAgent",
        ])

    def test_success_has_stage_evidence(self):
        events=[]
        result=AdaptiveLearningOrchestrator(Client,Sandbox).process_turn("u",[{"sender":"USER","content":"Tạo bài Python"}],event_callback=events.append)
        self.assertEqual(result["status"],"SUCCEEDED")
        self.assertFalse(result["fallback_used"])
        self.assertTrue(all(r.get("ended_at") and r.get("input_hash") for r in result["agent_traces"]))
        self.assertEqual(result["agent_traces"][-1]["agent"],"PublicationGate")
        self.assertEqual(result["exercise"]["artifact_hash"],digest({k:v for k,v in result["exercise"].items() if k!="artifact_hash"}))

    def test_explicit_vector_request_waits_for_prerequisite_confirmation(self):
        result=AdaptiveLearningOrchestrator(Client,Sandbox).process_turn(
            "u",[{"sender":"USER","content":"Tạo bài tập vector trong C++"}],learner_context={"states":{},"language":"cpp"})

        self.assertEqual(result["status"],"AWAITING_CONFIRMATION")
        self.assertIsNone(result["exercise"])
        self.assertEqual(result["pending_confirmation"]["target_concept_id"],"CPP-VECTOR-01")
        self.assertEqual(result["readiness"]["recommended_path"][-1],"CPP-VECTOR-01")
        self.assertIn("CPP-ARRAY-01",result["readiness"]["prerequisite_gaps"])
        self.assertEqual([record["agent"] for record in result["agent_traces"]],[
            "IntentRouterAgent","PrerequisiteAdvisorAgent",
        ])

    def test_confirmed_vector_request_keeps_target_and_adapts_to_readiness(self):
        vector_draft=copy.deepcopy(DRAFT)
        vector_draft.update(
            title="Tính tổng phần tử trong vector",
            problem_statement=("Đọc số nguyên n và n phần tử, lưu toàn bộ dữ liệu bằng std::vector<int>, "
                "sau đó tính tổng và in kết quả. Bài tập bắt buộc sử dụng vector thay cho mảng tĩnh."),
            quick_theory="std::vector quản lý dãy động; push_back thêm phần tử và range-for giúp duyệt an toàn.",
            starter_code="#include <iostream>\n#include <vector>\nint main() { /* TODO */ return 0; }",
            reference_solution=("#include <iostream>\n#include <vector>\nusing namespace std;\n"
                "int main(){int n,x,sum=0;cin>>n;vector<int> values;while(n--){cin>>x;values.push_back(x);}"
                "for(int value:values)sum+=value;cout<<sum;return 0;}"),
            test_cases=[dict(input=f"{count}\n"+" ".join(str(value) for value in values)+"\n",
                expected_output=str(sum(values)),is_hidden=index>=2,category="boundary" if index in (1,3) else "normal",
                explanation="Kiểm tra tổng các phần tử vector.")
                for index,(count,values) in enumerate([(3,[1,2,3]),(1,[0]),(2,[-2,5]),(4,[1,1,1,1])])],
        )
        class VectorClient(Client):
            def json(self,stage,system,data):
                if stage=="ExerciseGeneratorAgent":
                    self.calls.append(dict(stage=stage,provider="TEST_DOUBLE",status="SUCCEEDED"))
                    self.exercise_calls+=1
                    return copy.deepcopy(vector_draft)
                return super().json(stage,system,data)

        pending={"type":"PREREQUISITE_OVERRIDE","target_concept_id":"CPP-VECTOR-01",
            "target_concept_name":"std::vector và dữ liệu hai chiều động","language":"cpp"}
        client=VectorClient()
        result=AdaptiveLearningOrchestrator(lambda:client,Sandbox).process_turn(
            "u",[{"sender":"USER","content":"Vẫn tạo bài vector cho tôi"}],
            learner_context={"states":{},"language":"cpp","pending_confirmation":pending})

        self.assertEqual(result["status"],"SUCCEEDED")
        self.assertEqual(result["exercise"]["concept_id"],"CPP-VECTOR-01")
        self.assertEqual(result["exercise"]["difficulty"],"EASY")
        self.assertTrue(result["exercise"]["spec_snapshot"]["learner_evidence"]["forced_prerequisite_override"])
        self.assertIn("vector",result["exercise"]["spec_snapshot"]["required_constructs"])

    def test_verified_checkpoint_retries_only_critic(self):
        original=AdaptiveLearningOrchestrator(Client,Sandbox).process_turn("u",[{"sender":"USER","content":"Tạo bài Python"}],trace_id="trace_checkpoint")
        client=Client()
        sequence_offset=max(record["sequence"] for record in original["agent_traces"])
        resumed=AdaptiveLearningOrchestrator(lambda:client,Sandbox).process_turn("u",[{"sender":"USER","content":"Tạo bài Python"}],
            trace_id="trace_checkpoint",resume_report=original,run_attempt=2,sequence_offset=sequence_offset)
        agents=[record["agent"] for record in resumed["agent_traces"]]
        self.assertEqual(resumed["status"],"SUCCEEDED")
        self.assertEqual(agents,["ResumeCheckpointAgent","CriticEvaluatorAgent","PublicationGate"])
        self.assertEqual([call["stage"] for call in client.calls],["CriticEvaluatorAgent"])
        self.assertTrue(all(record["run_attempt"]==2 and record["sequence"]>sequence_offset for record in resumed["agent_traces"]))

    def test_exercise_repair_generates_deferred_theory_before_critic(self):
        class FailsOnce:
            calls=0
            @classmethod
            def validate(cls,*args):
                cls.calls+=1
                return (cls.calls>1,[] if cls.calls>1 else ["first candidate failed"],[])
        client=Client()
        result=AdaptiveLearningOrchestrator(lambda:client,FailsOnce).process_turn("u",[{"sender":"USER","content":"Tạo bài Python"}])
        self.assertEqual(result["status"],"SUCCEEDED")
        self.assertEqual([call["stage"] for call in client.calls],["ExerciseGeneratorAgent","ExerciseGeneratorAgent","ExplanationTutorAgent","CriticEvaluatorAgent"])

    def test_verified_candidate_with_missing_theory_resumes_without_regenerating_exercise(self):
        original=AdaptiveLearningOrchestrator(Client,Sandbox).process_turn("u",[{"sender":"USER","content":"Tạo bài Python"}],trace_id="trace_missing_theory")
        checkpoint=copy.deepcopy(original)
        checkpoint["agent_traces"]=[record for record in checkpoint["agent_traces"] if record["agent"]!="ExplanationTutorAgent"]
        client=Client()
        resumed=AdaptiveLearningOrchestrator(lambda:client,Sandbox).process_turn("u",[{"sender":"USER","content":"Tạo bài Python"}],
            trace_id="trace_missing_theory",resume_report=checkpoint,run_attempt=2,
            sequence_offset=max(record["sequence"] for record in checkpoint["agent_traces"]))
        self.assertEqual(resumed["status"],"SUCCEEDED")
        self.assertEqual([call["stage"] for call in client.calls],["ExplanationTutorAgent","CriticEvaluatorAgent"])
        self.assertFalse(any(record["agent"]=="ExerciseGeneratorAgent" for record in resumed["agent_traces"]))

    def test_resume_repairs_theory_against_verified_exercise(self):
        original=AdaptiveLearningOrchestrator(Client,Sandbox).process_turn(
            "u",[{"sender":"USER","content":"Tạo bài Python"}],trace_id="trace_resume_theory_repair")
        class ResumeRepairClient(Client):
            def __init__(self):
                super().__init__()
                self.critic_calls=0
            def json(self,stage,system,data):
                if stage=="CriticEvaluatorAgent":
                    self.calls.append(dict(stage=stage,provider="TEST_DOUBLE",status="SUCCEEDED"))
                    self.critic_calls+=1
                    if self.critic_calls==1:
                        return {**REVIEW, "is_approved":False, "compatibility_approved":False,
                            "feedback_target":"BOTH", "feedback":"Lý thuyết cũ chưa đồng bộ với candidate hiện tại."}
                    return copy.deepcopy(REVIEW)
                return super().json(stage,system,data)

        client=ResumeRepairClient()
        resumed=AdaptiveLearningOrchestrator(lambda:client,Sandbox).process_turn(
            "u",[{"sender":"USER","content":"Tạo bài Python"}],trace_id="trace_resume_theory_repair",
            resume_report=original,run_attempt=2,
            sequence_offset=max(record["sequence"] for record in original["agent_traces"]))

        self.assertEqual(resumed["status"],"SUCCEEDED")
        self.assertEqual([call["stage"] for call in client.calls],[
            "CriticEvaluatorAgent","ExplanationTutorAgent","CriticEvaluatorAgent",
        ])
        self.assertFalse(any(record["agent"]=="ExerciseGeneratorAgent" for record in resumed["agent_traces"]))

    def test_failed_sandbox_never_publishes(self):
        class Broken:
            @staticmethod
            def validate(*args): raise PipelineError("SANDBOX_UNAVAILABLE")
        result=AdaptiveLearningOrchestrator(Client,Broken).process_turn("u",[{"sender":"USER","content":"Tạo bài Python"}])
        self.assertEqual(result["status"],"FAILED")
        self.assertIsNone(result["exercise"])
        self.assertTrue(any(r["agent"]=="SandboxValidator" and r["status"]=="FAILED" for r in result["agent_traces"]))

    def test_repair_limit_does_not_make_template(self):
        class Reject:
            @staticmethod
            def validate(*args):return False,["mismatch"],[]
        client=Client()
        result=AdaptiveLearningOrchestrator(lambda:client,Reject).process_turn("u",[{"sender":"USER","content":"Tạo bài Python"}])
        self.assertEqual(client.exercise_calls,3)
        self.assertEqual(result["error"]["code"],"REPAIR_LIMIT_REACHED")
        self.assertIsNone(result["exercise"])

    def test_provider_failure_is_retained(self):
        class Broken(Client):
            def json(self,*args):raise PipelineError("NO_PROVIDER_KEY")
        result=AdaptiveLearningOrchestrator(Broken,Sandbox).process_turn("u",[{"sender":"USER","content":"Tạo bài Python"}])
        self.assertEqual(result["status"],"FAILED")
        self.assertTrue(any(r["status"]=="FAILED" for r in result["agent_traces"]))

    def test_no_exec_fallback_without_specification(self):
        self.assertFalse(SandboxValidator.validate({"language":"javascript","reference_solution":"INVALID"})[0])

if __name__=="__main__": unittest.main()
