"""Focused offline checks for catalog based AI Tutor routing."""

import json
import unittest

from app.agents.adaptive_exercise_planner import AdaptiveExercisePlanner
from app.agents.clarification_agent import ClarificationAgent
from app.agents.exercise_generator_agent import ExerciseGeneratorAgent
from app.agents.intent_router_agent import IntentRouterAgent
from app.orchestrator.adaptive_learning_orchestrator import AdaptiveLearningOrchestrator
from app.pipeline.llm_client import PipelineError
from app.contracts.specification import ExerciseSpecification
from app.validation.ast_constraint_validator import AstConstraintValidator


def response(**changes):
    value = {
        "intent": "REQUEST_ADAPTIVE_EXERCISE",
        "language": "javascript",
        "topic": "JS-ARRAY-HOF-01",
        "topic_match": "matched",
        "requested_topic": "reduce, filter",
        "topic_evidence": ["reduce", "filter"],
        "difficulty_request": "auto",
        "required_constructs": ["reduce", "filter"],
        "forbidden_constructs": [],
        "ordered_output": False,
        "confirm_prerequisite_override": False,
    }
    value.update(changes)
    return value


class FixedClient:
    def __init__(self, value):
        self.value = value
        self.payload = None
        self.calls = []

    def json(self, stage, system, payload):
        assert stage == "IntentRouterAgent"
        self.payload = payload
        return self.value


class CatalogRoutingTests(unittest.TestCase):
    def test_reduce_filter_order_routes_to_published_array_methods(self):
        client = FixedClient(response())
        route = IntentRouterAgent(client).route("hãy tạo cho tôi bài tập về reduce, filter trong javascript")
        self.assertEqual(route.topic, "JS-ARRAY-HOF-01")
        self.assertEqual(route.selection_mode, "explicit")
        self.assertEqual(AdaptiveExercisePlanner().plan_exercise(route, "user").target_concept, route.topic)
        self.assertEqual(route.required_constructs, ["reduce", "filter"])
        item = next(item for item in client.payload["published_concepts"]["javascript"]
                    if item["id"] == route.topic)
        self.assertIn("filter", item["scope"])
        self.assertIn("reduce", item["scope"])

    def test_reduce_filter_pipeline_preserves_target_before_generation(self):
        result = AdaptiveLearningOrchestrator(client_factory=lambda: FixedClient(response())).process_turn(
            "user", [{"sender": "USER", "content": "hãy tạo cho tôi bài tập về reduce, filter trong javascript"}],
            language="javascript", learner_context={"states": {}},
        )
        self.assertEqual(result["status"], "AWAITING_CONFIRMATION")
        self.assertEqual(result["pending_confirmation"]["target_concept_id"], "JS-ARRAY-HOF-01")
        self.assertEqual(result["pending_confirmation"]["required_constructs"], ["reduce", "filter"])
        self.assertIsNone(result["exercise"])

    def test_prerequisite_confirmation_preserves_original_methods(self):
        pending = {
            "type": "PREREQUISITE_OVERRIDE", "target_concept_id": "JS-ARRAY-HOF-01",
            "language": "javascript", "original_user_request": "Tạo bài reduce, filter trong JavaScript",
            "required_constructs": ["reduce", "filter"], "forbidden_constructs": ["for"],
            "ordered_output": False,
        }
        client = FixedClient(response(topic_evidence=[], requested_topic=None,
            required_constructs=[], confirm_prerequisite_override=True))
        route = IntentRouterAgent(client).route("Vẫn tạo bài cho tôi", {"pending_confirmation": pending})
        spec = AdaptiveExercisePlanner().plan_exercise(route, "user", learner_context={"force_prerequisite_override": True})
        self.assertEqual(spec.user_request, pending["original_user_request"])
        self.assertEqual(spec.required_constructs, ["reduce", "filter"])
        self.assertIn("for", spec.forbidden_constructs)
        self.assertTrue({"while", "class"} <= set(spec.forbidden_constructs))

    def test_explicit_confirmation_expands_pending_array_methods_without_overwrite(self):
        pending = {
            "type": "PREREQUISITE_OVERRIDE", "target_concept_id": "JS-ARRAY-HOF-01",
            "language": "javascript", "original_user_request": "Tôi muốn học filter trong JavaScript",
            "required_constructs": ["filter"], "forbidden_constructs": [],
            "ordered_output": False,
        }
        request = "Vẫn tạo 1 bài Phương thức Mảng Bậc cao (Higher-Order Methods: map, filter, reduce) cho tôi"
        client = FixedClient(response(
            topic_evidence=["Phương thức Mảng Bậc cao", "map, filter, reduce"],
            requested_topic=None, required_constructs=["map", "filter", "reduce"],
            confirm_prerequisite_override=True,
        ))

        route = IntentRouterAgent(client).route(request, {"pending_confirmation": pending})

        self.assertEqual(route.user_text, request)
        self.assertEqual(route.required_constructs, ["map", "filter", "reduce"])

    def test_unique_full_catalog_title_confirms_javascript_without_asking_again(self):
        request = "Vẫn tạo 1 bài Phương thức Mảng Bậc cao (Higher-Order Methods: map, filter, reduce) cho tôi"
        client = FixedClient(response(
            topic_evidence=["Phương thức Mảng Bậc cao", "map", "filter", "reduce"],
            requested_topic=None, required_constructs=["map", "filter", "reduce"],
        ))

        route = IntentRouterAgent(client).route(request, {
            "language": "python", "language_source": "default",
        })

        self.assertEqual(route.language, "javascript")
        self.assertEqual(route.topic, "JS-ARRAY-HOF-01")
        self.assertTrue(route.language_confirmed)
        self.assertEqual(route.selection_mode, "explicit")

        result = AdaptiveLearningOrchestrator(client_factory=lambda: FixedClient(client.value)).process_turn(
            "user", [{"sender": "USER", "content": request}],
            learner_context={"language": "python", "language_source": "default", "states": {}},
        )
        self.assertEqual(result["status"], "AWAITING_CONFIRMATION")
        self.assertEqual(result["pending_confirmation"]["type"], "PREREQUISITE_OVERRIDE")
        self.assertEqual(result["pending_confirmation"]["target_concept_id"], "JS-ARRAY-HOF-01")

    def test_default_python_hint_asks_language_then_uses_followup_topic(self):
        class ClarifyingClient:
            def __init__(self):
                self.calls = []
                self.requests = []

            def json(self, stage, system, payload):
                self.calls.append({"stage": stage, "provider": "fixture", "model": "fixture"})
                if stage == "ClarificationAgent":
                    return {"question": "Bạn muốn làm bài tập bằng ngôn ngữ nào?",
                            "suggested_options": ["Python", "JavaScript", "C++", "SQL"]}
                self.requests.append(payload)
                if "iterator" in payload["request"]:
                    return response(language="cpp", topic="CPP-BUILD-01", topic_evidence=["iterator"],
                                    requested_topic="iterator", required_constructs=[])
                return response(language="python", topic=None, topic_match="unspecified",
                                requested_topic=None, topic_evidence=[], required_constructs=[])

        client = ClarifyingClient()
        tutor = AdaptiveLearningOrchestrator(client_factory=lambda: client)
        first = tutor.process_turn("user", [{"sender": "USER", "content": "Tạo 1 bài tập"}],
            learner_context={"language": "python", "language_source": "default", "states": {}})
        self.assertEqual(first["status"], "AWAITING_CONFIRMATION")
        self.assertEqual(first["pending_confirmation"]["type"], "ROUTING_CLARIFICATION")
        self.assertEqual(first["suggested_options"], ["Python", "JavaScript", "C++", "SQL"])
        self.assertEqual([call["stage"] for call in client.calls], ["IntentRouterAgent"])
        self.assertEqual([record["agent"] for record in first["agent_traces"]],
                         ["IntentRouterAgent", "ClarificationAgent"])
        self.assertLess(len(json.dumps(client.requests[0], ensure_ascii=False).encode("utf-8")), 16000)

        second = tutor.process_turn("user", [{"sender": "USER", "content": "iterator trong C++"}],
            learner_context={"language": "python", "language_source": "default", "states": {},
                             "pending_confirmation": first["pending_confirmation"]})
        self.assertEqual(second["status"], "AWAITING_CONFIRMATION")
        self.assertEqual(second["pending_confirmation"]["target_concept_id"], "CPP-BUILD-01")
        self.assertIn("Tạo 1 bài tập", client.requests[-1]["request"])
        self.assertIn("iterator trong C++", client.requests[-1]["request"])

    def test_explicit_cpp_iterator_does_not_ask_language_again(self):
        client = FixedClient(response(language="cpp", topic="CPP-BUILD-01",
            requested_topic="iterator", topic_evidence=["iterator"], required_constructs=[]))
        result = AdaptiveLearningOrchestrator(client_factory=lambda: client).process_turn(
            "user", [{"sender": "USER", "content": "Hãy tạo 1 bài tập iterator trong C++"}],
            learner_context={"language": "python", "language_source": "default", "states": {}})
        self.assertEqual(result["status"], "AWAITING_CONFIRMATION")
        self.assertEqual(result["pending_confirmation"]["type"], "PREREQUISITE_OVERRIDE")
        self.assertEqual(result["pending_confirmation"]["target_concept_id"], "CPP-BUILD-01")

    def test_live_trace_cpp_iterator_construct_is_accepted_end_to_end(self):
        client = FixedClient(response(language="cpp", topic="CPP-BUILD-01",
            requested_topic="iterator", topic_evidence=["iterator"],
            required_constructs=["iterator"]))
        result = AdaptiveLearningOrchestrator(client_factory=lambda: client).process_turn(
            "user", [{"sender": "USER", "content": "Hãy tạo 1 bài tập iterator trong C++"}],
            learner_context={"language": "python", "language_source": "default", "states": {}})
        self.assertEqual(result["status"], "AWAITING_CONFIRMATION")
        self.assertEqual(result["pending_confirmation"]["target_concept_id"], "CPP-BUILD-01")
        self.assertEqual(result["pending_confirmation"]["required_constructs"], ["iterator"])
        self.assertEqual(list(client.payload["published_concepts"]), ["cpp"])
        self.assertIn("iterator", client.payload["allowed_constructs"]["cpp"])

    def test_iterator_repair_uses_small_cpp_catalog(self):
        class Client:
            def __init__(self):
                self.payloads = []

            def json(self, stage, system, payload):
                self.payloads.append(payload)
                return response(language="cpp", topic="CPP-LOOP-01" if len(self.payloads) == 1 else "CPP-BUILD-01",
                    requested_topic="iterator", topic_evidence=["iterator"], required_constructs=[])

        client = Client()
        route = IntentRouterAgent(client).route("Hãy tạo bài tập iterator trong C++")
        self.assertEqual(route.topic, "CPP-BUILD-01")
        self.assertEqual(len(client.payloads), 2)
        self.assertEqual(list(client.payloads[0]["published_concepts"]), ["cpp"])
        self.assertLess(len(json.dumps(client.payloads[0], ensure_ascii=False).encode("utf-8")), 12000)
        self.assertEqual(client.payloads[1]["repair_feedback"]["rejected_code"], "ROUTING_TARGET_UNSUPPORTED")

    def test_invalid_difficulty_is_repaired_once_without_accepting_null(self):
        class Client:
            def __init__(self):
                self.payloads = []

            def json(self, stage, system, payload):
                self.payloads.append(payload)
                return response(language="cpp", topic="CPP-BUILD-01", requested_topic="iterator",
                    topic_evidence=["iterator"], required_constructs=[],
                    difficulty_request=None if len(self.payloads) == 1 else "auto")

        client = Client()
        route = IntentRouterAgent(client).route("Hãy tạo bài tập iterator trong C++")
        self.assertEqual(route.difficulty_request, "auto")
        self.assertEqual(client.payloads[1]["repair_feedback"]["invalid_fields"][0]["field"], "difficulty_request")

    def test_invalid_cpp_construct_repair_identifies_bad_value(self):
        class Client:
            def __init__(self):
                self.payloads = []

            def json(self, stage, system, payload):
                self.payloads.append(payload)
                return response(language="cpp", topic="CPP-BUILD-01", requested_topic="iterator",
                    topic_evidence=["iterator"],
                    required_constructs=["iterators"] if len(self.payloads) == 1 else ["iterator"])

        client = Client()
        route = IntentRouterAgent(client).route("Hãy tạo bài tập iterator trong C++")
        self.assertEqual(route.required_constructs, ["iterator"])
        self.assertEqual(client.payloads[1]["repair_feedback"]["invalid_constructs"], ["iterators"])
        self.assertIn("iterator", client.payloads[1]["repair_feedback"]["allowed_constructs"])

    def test_language_only_answer_resumes_original_iterator_request(self):
        class Client:
            def __init__(self):
                self.calls = []

            def json(self, stage, system, payload):
                self.calls.append({"stage": stage, "provider": "fixture", "model": "fixture"})
                if stage == "ClarificationAgent":
                    return {"question": "Bạn muốn làm bài iterator bằng ngôn ngữ nào?",
                            "suggested_options": ["C++"]}
                self.assert_request = payload["request"]
                return response(language="cpp", topic="CPP-BUILD-01",
                    requested_topic="iterator", topic_evidence=["iterator"], required_constructs=[])

        client = Client()
        tutor = AdaptiveLearningOrchestrator(client_factory=lambda: client)
        first = tutor.process_turn("user", [{"sender": "USER", "content": "Tạo 1 bài tập iterator"}],
            learner_context={"language": "python", "language_source": "default", "states": {}})
        self.assertEqual(first["pending_confirmation"]["type"], "ROUTING_CLARIFICATION")
        second = tutor.process_turn("user", [{"sender": "USER", "content": "C++"}],
            learner_context={"language": "python", "language_source": "default", "states": {},
                             "pending_confirmation": first["pending_confirmation"]})
        self.assertEqual(second["pending_confirmation"]["type"], "PREREQUISITE_OVERRIDE")
        self.assertEqual(second["pending_confirmation"]["target_concept_id"], "CPP-BUILD-01")
        self.assertIn("Tạo 1 bài tập iterator", client.assert_request)
        self.assertIn("C++", client.assert_request)

    def test_conflict_question_never_relies_on_provider_suggestions(self):
        class Client:
            def json(self, stage, system, payload):
                raise AssertionError("Câu hỏi làm rõ không cần gọi provider")

        answer = ClarificationAgent(Client()).ask("Tạo bài reduce", "routing_conflict", None,
            {"javascript": [{"id": "JS-ARRAY-HOF-01", "name": "Phương thức mảng"}]})
        self.assertEqual(answer["suggested_options"], [])
        self.assertIn("chủ đề", answer["question"])

    def test_wrong_topic_cannot_use_reduce_as_evidence(self):
        client = FixedClient(response(topic="JS-VAR-01"))
        with self.assertRaises(PipelineError) as caught:
            IntentRouterAgent(client).route("hãy tạo cho tôi bài tập về reduce, filter trong javascript")
        self.assertEqual(caught.exception.code, "ROUTING_TARGET_UNSUPPORTED")

    def test_named_array_methods_must_be_required(self):
        client = FixedClient(response(required_constructs=[]))
        with self.assertRaises(PipelineError) as caught:
            IntentRouterAgent(client).route("Tạo bài reduce, filter trong JavaScript")
        self.assertEqual(caught.exception.code, "ROUTING_SCHEMA_INVALID")

    def test_conflicting_router_evidence_asks_instead_of_publishing(self):
        class Client(FixedClient):
            def json(self, stage, system, payload):
                self.calls.append({"stage": stage, "provider": "fixture", "model": "fixture"})
                if stage == "ClarificationAgent":
                    return {"question": "Bạn xác nhận muốn bài về reduce và filter trong JavaScript chứ?",
                            "suggested_options": ["JavaScript"]}
                return self.value

        client = Client(response(topic="JS-VAR-01"))
        result = AdaptiveLearningOrchestrator(client_factory=lambda: client).process_turn(
            "user", [{"sender": "USER", "content": "Tạo bài reduce, filter trong JavaScript"}],
            language="javascript", learner_context={"states": {}})
        self.assertEqual(result["status"], "AWAITING_CONFIRMATION")
        self.assertEqual(result["pending_confirmation"]["type"], "ROUTING_CLARIFICATION")
        self.assertIsNone(result["exercise"])
        self.assertEqual([call["stage"] for call in client.calls],
                         ["IntentRouterAgent", "IntentRouterAgent"])
        self.assertEqual(result["agent_traces"][-1]["method"], "RULE_POLICY")

    def test_unknown_topic_requests_clarification_before_generation(self):
        value = response(topic=None, topic_match="unmatched", requested_topic="quuxzz", topic_evidence=[])

        class Client(FixedClient):
            def __init__(self):
                super().__init__(value)
                self.stages = []

            def json(self, stage, system, payload):
                self.stages.append(stage)
                if stage == "ClarificationAgent":
                    return {"question": "Bạn muốn luyện chủ đề nào trong JavaScript?",
                            "suggested_options": ["JS-ARRAY-HOF-01"]}
                return super().json(stage, system, payload)

        client = Client()
        result = AdaptiveLearningOrchestrator(client_factory=lambda: client).process_turn(
            "user", [{"sender": "USER", "content": "Tạo bài về quuxzz trong JavaScript"}],
            language="javascript", learner_context={"states": {}},
        )
        self.assertEqual(result["status"], "AWAITING_CONFIRMATION")
        self.assertEqual(client.stages, ["IntentRouterAgent"])
        self.assertEqual(result["agent_traces"][-1]["agent"], "ClarificationAgent")
        self.assertIsNone(result["exercise"])

    def test_explicit_concept_must_be_published_in_selected_language(self):
        client = FixedClient(response(topic="PY-LIST-01", topic_evidence=["reduce"]))
        with self.assertRaises(PipelineError) as caught:
            IntentRouterAgent(client).route("bài reduce trong javascript")
        self.assertEqual(caught.exception.code, "ROUTING_TARGET_INVALID")

    def test_explicit_language_cannot_be_changed_by_model(self):
        client = FixedClient(response())
        with self.assertRaises(PipelineError) as caught:
            IntentRouterAgent(client).route("Hãy tạo bài về reduce trong Python")
        self.assertEqual(caught.exception.code, "ROUTING_LANGUAGE_MISMATCH")

    def test_missing_router_fields_fail_closed(self):
        client = FixedClient({"intent": "REQUEST_ADAPTIVE_EXERCISE", "language": "javascript", "topic": "JS-ARRAY-HOF-01"})
        with self.assertRaises(PipelineError) as caught:
            IntentRouterAgent(client).route("bài reduce trong javascript")
        self.assertEqual(caught.exception.code, "ROUTING_SCHEMA_INVALID")

    def test_constraints_are_structured_not_parsed_from_request(self):
        client = FixedClient(response(language="python", topic="PY-FLOW-02", requested_topic="while",
            topic_evidence=["while"], required_constructs=["while"], forbidden_constructs=["for", "sum"]))
        route = IntentRouterAgent(client).route("Tạo bài Python dùng while, không dùng for và sum")
        spec = AdaptiveExercisePlanner().plan_exercise(route, "user")
        self.assertEqual(spec.required_constructs, ["while"])
        self.assertEqual(spec.forbidden_constructs[:2], ["for", "sum"])
        self.assertTrue({"function", "class"} <= set(spec.forbidden_constructs))

    def test_generator_receives_selected_lesson_content(self):
        route = IntentRouterAgent(FixedClient(response())).route("Tạo bài reduce, filter trong JavaScript")
        spec = AdaptiveExercisePlanner().plan_exercise(route, "user")
        client = FixedClient({})
        client.json = lambda stage, system, payload: setattr(client, "payload", payload) or {}
        ExerciseGeneratorAgent(client).generate(spec, grounding={"sources": [
            {"id": "lesson/array.md", "lesson_id": "JS-09", "excerpt": "filter lọc; reduce tổng hợp."}
        ]})
        self.assertEqual(client.payload["specification"]["target_concept"], "JS-ARRAY-HOF-01")
        self.assertEqual(client.payload["learning_materials"][0]["lesson_id"], "JS-09")
        self.assertIn("reduce", client.payload["learning_materials"][0]["excerpt"])

    def test_constraint_checker_ignores_comments_and_checks_real_syntax(self):
        js_spec = ExerciseSpecification(target_concept="JS-LOOP-01", language="javascript",
            required_constructs=["while"], forbidden_constructs=["for", "var"])
        passed, errors = AstConstraintValidator.validate({"reference_solution":
            "// for (let i=0; i<3; i++) {}\nfunction solution(n) { while (n > 0) n--; return n; }"}, js_spec)
        self.assertTrue(passed, errors)
        passed, errors = AstConstraintValidator.validate({"reference_solution":
            "function solution(n) { for (let i=0; i<n; i++) {} return n; }"}, js_spec)
        self.assertFalse(passed)
        self.assertTrue(any("for" in error for error in errors))

        methods_spec = ExerciseSpecification(target_concept="JS-ARRAY-HOF-01", language="javascript",
            required_constructs=["filter", "reduce"])
        passed, errors = AstConstraintValidator.validate({"reference_solution":
            "function solution(xs) { return xs.filter(x => x > 0).reduce((a, x) => a + x, 0); }"}, methods_spec)
        self.assertTrue(passed, errors)
        passed, errors = AstConstraintValidator.validate({"reference_solution":
            "function solution(xs) { return xs.filter(x => x > 0); }"}, methods_spec)
        self.assertFalse(passed)
        self.assertTrue(any("reduce" in error for error in errors))

        py_spec = ExerciseSpecification(target_concept="PY-FLOW-02", language="python",
            forbidden_constructs=["for", "sum"])
        passed, errors = AstConstraintValidator.validate({"reference_solution":
            "def solution(nums):\n    return sum(x for x in nums)"}, py_spec)
        self.assertFalse(passed)
        self.assertTrue(any("sum" in error for error in errors))

    def test_cpp_iterator_constraint_checks_reference_solution(self):
        spec = ExerciseSpecification(target_concept="CPP-BUILD-01", language="cpp",
            required_constructs=["iterator"])
        passed, errors = AstConstraintValidator.validate({"reference_solution":
            "// iterator is required\nint main() { return 0; }"}, spec)
        self.assertFalse(passed)
        self.assertTrue(any("iterator" in error for error in errors))

        passed, errors = AstConstraintValidator.validate({"reference_solution":
            "int main() { std::vector<int> values{1,2}; "
            "for (auto it = values.begin(); it != values.end(); ++it) { std::cout << *it; } }"}, spec)
        self.assertTrue(passed, errors)


if __name__ == "__main__":
    unittest.main()
