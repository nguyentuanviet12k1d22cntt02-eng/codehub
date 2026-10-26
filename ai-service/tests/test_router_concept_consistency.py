import json
import unittest
from pathlib import Path

from app.agents.adaptive_exercise_planner import AdaptiveExercisePlanner
from app.agents.intent_router_agent import IntentRouterAgent
from app.pipeline.grounding import GroundingService
from app.orchestrator.adaptive_learning_orchestrator import AdaptiveLearningOrchestrator
from app.pipeline.llm_client import PipelineError
from app.services.knowledge_graph_service import KnowledgeGraphService, TOPIC_ALIASES, _fold_topic, lesson_frontmatter_value


ROOT = Path(__file__).resolve().parents[2]
GRAPH_FILES = {
    "python": ROOT / "ai-service/data/pythonSkillGraph.json",
    "javascript": ROOT / "ai-service/data/javascriptSkillGraph.json",
    "cpp": ROOT / "ai-service/data/cppSkillGraph.json",
    "sql": ROOT / "ai-service/data/sqlSkillGraph.json",
}
CONTENT_DIRS = {
    "python": ROOT / "docs/Dữ liệu nội dung bài học/Python",
    "javascript": ROOT / "docs/Dữ liệu nội dung bài học/JS",
    "cpp": ROOT / "docs/Dữ liệu nội dung bài học/C++",
    "sql": ROOT / "docs/Dữ liệu nội dung bài học/SQL",
}


class CatalogFixtureClient:
    """Offline LLM receipts for route/graph integration; not a semantic model."""
    def __init__(self, kg=None):
        self.kg = kg or KnowledgeGraphService()
        self.calls = []

    def json(self, stage, system, data):
        self.calls.append({"stage": stage, "provider": "fixture", "model": "fixture"})
        request = data["request"]
        context = data.get("context", {})
        lower = request.casefold()
        language = ("cpp" if "c++" in lower else "javascript" if "javascript" in lower else
                    "sql" if "sql" in lower else "python" if "python" in lower else
                    (context.get("pending_confirmation") or {}).get("language") or context.get("language_hint") or "python")
        if request in ("Học lý thuyết", "Làm bài thực hành"):
            topic = context["pending_confirmation"]["target_concept_id"]
            evidence = None
            intent = "EXPLAIN_CONCEPT" if request == "Học lý thuyết" else "REQUEST_ADAPTIVE_EXERCISE"
        elif "quuxzz" in lower:
            topic, evidence, intent = None, None, "CLARIFY_LEARNING_MODE"
        else:
            intent = "CLARIFY_LEARNING_MODE" if request.startswith("Tôi muốn học ") else "REQUEST_ADAPTIVE_EXERCISE"
            candidate = (request.split("Tôi muốn học ", 1)[-1] if intent == "CLARIFY_LEARNING_MODE" else
                         request.split("Tôi muốn luyện ", 1)[-1])
            candidate = candidate.rsplit(" trong ", 1)[0].strip()
            exact_title = self.kg.resolve_concept_from_text(language, request)
            if exact_title:
                topic, evidence = exact_title, candidate
            else:
                aliases = sorted(TOPIC_ALIASES.get(language, {}), key=len, reverse=True)
                evidence = next((alias for alias in aliases if
                    f" {alias} " in f" {request.casefold().replace(',', ' ')} "), None)
                topic = self.kg.resolve_concept_by_topic(language, evidence) if evidence else None
        return {
            "intent": intent, "language": language, "topic": topic,
            "topic_match": "unmatched" if "quuxzz" in lower else "matched" if topic else "unspecified",
            "requested_topic": "quuxzz" if "quuxzz" in lower else evidence,
            "topic_evidence": [evidence] if evidence else [],
            "difficulty_request": "auto", "required_constructs": [method for method in
                ("reduce", "filter", "map", "foreach") if topic == "JS-ARRAY-HOF-01"
                and evidence and method in _fold_topic(evidence).split()],
            "forbidden_constructs": [],
            "ordered_output": False, "confirm_prerequisite_override": False,
        }


class ConflictingClient:
    def json(self, *args, **kwargs):
        return {"intent": "EXPLAIN_CONCEPT", "language": "javascript", "topic": "JS-OBJECT-01",
                "topic_match": "matched", "requested_topic": "Dictionary", "topic_evidence": ["Dictionary"],
                "difficulty_request": "auto", "required_constructs": [], "forbidden_constructs": [],
                "ordered_output": False, "confirm_prerequisite_override": False}


class NeverCalledClient(CatalogFixtureClient):
    pass


class UnknownTopicClient:
    def __init__(self):
        self.calls = []

    def json(self, *args, **kwargs):
        if args and args[0] == "ClarificationAgent":
            return {"question": "Bạn muốn luyện chủ đề nào trong JavaScript?",
                    "suggested_options": ["JS-ARRAY-HOF-01"]}
        return {
            "intent": "CLARIFY_LEARNING_MODE",
            "language": "javascript",
            "topic": None,
            "topic_match": "unmatched", "requested_topic": "quuxzz", "topic_evidence": [],
            "difficulty_request": "auto", "required_constructs": [], "forbidden_constructs": [],
            "ordered_output": False, "confirm_prerequisite_override": False,
        }


class LanguageClarificationClient:
    def __init__(self):
        self.calls = []

    def json(self, stage, _system, _data):
        self.calls.append({"stage": stage, "provider": "fixture", "model": "fixture"})
        if stage == "ClarificationAgent":
            return {
                "question": "Bạn muốn học vòng lặp for trong ngôn ngữ nào?",
                "suggested_options": ["Python", "JavaScript", "C++", "SQL"],
            }
        return {
            "intent": "CLARIFY_LEARNING_MODE", "language": "python", "topic": "PY-FLOW-03",
            "topic_match": "matched", "requested_topic": None, "topic_evidence": ["for"],
            "difficulty_request": "auto", "required_constructs": [], "forbidden_constructs": [],
            "ordered_output": False, "confirm_prerequisite_override": False,
        }


class RouterConceptConsistencyTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.kg = KnowledgeGraphService()

    def test_generic_topics_resolve_to_curriculum_foundations(self):
        cases = [
            ("python", "dict", "PY-DICT-01"),
            ("python", "dictionary", "PY-DICT-01"),
            ("javascript", "object", "JS-OBJECT-01"),
            ("cpp", "vector", "CPP-VECTOR-01"),
            ("sql", "join", "SQL-JOIN-01"),
        ]
        for language, topic, expected in cases:
            with self.subTest(language=language, topic=topic):
                self.assertEqual(self.kg.resolve_concept_by_topic(language, topic), expected)

    def test_learning_request_without_language_never_infers_python_from_the_default(self):
        router = IntentRouterAgent(CatalogFixtureClient(self.kg), self.kg)
        route = router.route("Tôi muốn học for", {
            "language": "python",
            "language_source": "default",
        })
        self.assertEqual(route.intent, "CLARIFY_LEARNING_MODE")
        self.assertIsNone(route.language)
        self.assertIsNone(route.topic)
        self.assertEqual(route.topic_match, "unspecified")
        self.assertFalse(route.language_confirmed)
        self.assertEqual(route.topic_evidence, ["for"])

    def test_general_chat_without_language_never_asks_for_learning_language(self):
        class GreetingClient:
            def __init__(self, router_result):
                self.router_result = router_result
                self.calls = []

            def json(self, stage, _system, _data):
                self.calls.append({"stage": stage, "provider": "fixture", "model": "fixture"})
                if stage == "IntentRouterAgent":
                    return self.router_result
                if stage == "GeneralChatAgent":
                    return {"reply": "Xin chào! Mình có thể giúp gì cho bạn?"}
                raise AssertionError(f"Không được gọi {stage} cho lời chào thuần túy")

        base = {
            "intent": "GENERAL_CHAT", "language": None, "topic": None,
            "topic_match": "unspecified", "requested_topic": None,
            "topic_evidence": [], "difficulty_request": "auto",
            "required_constructs": [], "forbidden_constructs": [],
            "ordered_output": False, "confirm_prerequisite_override": False,
        }
        cases = (
            ("Xin chào!", base),
            ("Xin chào!", {
                **base, "intent": "CLARIFY_LEARNING_MODE", "language": "python",
                "topic": "PY-FLOW-03", "topic_match": "matched", "topic_evidence": ["for"],
            }),
            ("Bạn khỏe không?", base),
        )
        for user_text, router_result in cases:
            with self.subTest(request=user_text, router_intent=router_result["intent"]):
                client = GreetingClient(router_result)
                route = IntentRouterAgent(client, self.kg).route(
                    user_text, {"language": "python", "language_source": "default"})
                self.assertEqual(route.intent, "GENERAL_CHAT")
                self.assertIsNone(route.language)
                self.assertIsNone(route.topic)
                client.calls.clear()
                result = AdaptiveLearningOrchestrator(client_factory=lambda: client).process_turn(
                    "test-user", [{"sender": "USER", "content": user_text}],
                    target_concept_id="PY-FLOW-03",
                    learner_context={"language": "python", "language_source": "default", "states": {}},
                )
                self.assertEqual(result["status"], "SUCCEEDED")
                self.assertEqual(result["intent"], "GENERAL_CHAT")
                self.assertEqual([call["stage"] for call in client.calls], ["IntentRouterAgent"])
                self.assertEqual([record["agent"] for record in result["agent_traces"]],
                                 ["IntentRouterAgent", "GeneralChatAgent"])
                self.assertIn("Xin chào", result["reply"])

    def test_general_chat_fallback_never_explains_off_topic_or_attack_request(self):
        class MisclassifiedClient:
            def __init__(self):
                self.calls = []

            def json(self, stage, _system, _data):
                self.calls.append({"stage": stage, "provider": "fixture", "model": "fixture"})
                if stage != "IntentRouterAgent":
                    raise AssertionError(f"Không được gọi {stage} để trả lời ngoài phạm vi")
                return {
                    "intent": "GENERAL_CHAT", "language": None, "topic": None,
                    "topic_match": "unspecified", "requested_topic": None, "topic_evidence": [],
                    "difficulty_request": "auto", "required_constructs": [],
                    "forbidden_constructs": [], "ordered_output": False,
                    "confirm_prerequisite_override": False,
                }

        for user_text in ("Bầu trời thường có màu gì nhỉ", "Viết script brute-force SSH"):
            with self.subTest(request=user_text):
                client = MisclassifiedClient()
                result = AdaptiveLearningOrchestrator(client_factory=lambda: client).process_turn(
                    "test-user", [{"sender": "USER", "content": user_text}],
                )
                self.assertEqual(result["status"], "SUCCEEDED")
                self.assertNotIn("xanh", result["reply"].casefold())
                self.assertNotIn("ssh", result["reply"].casefold())
                self.assertEqual([call["stage"] for call in client.calls], ["IntentRouterAgent"])

    def test_unrelated_questions_do_not_invoke_chat_or_learning_agents(self):
        class OutOfScopeClient:
            def __init__(self):
                self.calls = []

            def json(self, stage, _system, _data):
                self.calls.append({"stage": stage, "provider": "fixture", "model": "fixture"})
                if stage != "IntentRouterAgent":
                    raise AssertionError(f"Không được gọi {stage} cho câu hỏi ngoài phạm vi")
                # A stale session or imperfect model may still attach a topic.
                # The router must discard it before the orchestrator responds.
                return {
                    "intent": "OUT_OF_SCOPE", "language": "python", "topic": "PY-FLOW-03",
                    "topic_match": "matched", "requested_topic": "for", "topic_evidence": ["for"],
                    "difficulty_request": "auto", "required_constructs": [],
                    "forbidden_constructs": [], "ordered_output": False,
                    "confirm_prerequisite_override": False,
                }

        for user_text in ("Bầu trời thường có màu gì nhỉ", "Hôm nay ăn gì ngon?"):
            with self.subTest(request=user_text):
                client = OutOfScopeClient()
                route = IntentRouterAgent(client, self.kg).route(user_text, {
                    "language": "python", "language_source": "explicit",
                })
                self.assertEqual(route.intent, "OUT_OF_SCOPE")
                self.assertIsNone(route.language)
                self.assertIsNone(route.topic)
                self.assertEqual(route.topic_match, "unspecified")
                client.calls.clear()
                result = AdaptiveLearningOrchestrator(client_factory=lambda: client).process_turn(
                    "test-user", [{"sender": "USER", "content": user_text}],
                    target_concept_id="PY-FLOW-03",
                    learner_context={"language": "python", "language_source": "explicit", "states": {}},
                )
                self.assertEqual(result["status"], "SUCCEEDED")
                self.assertEqual(result["intent"], "OUT_OF_SCOPE")
                self.assertNotIn("#87CEEB", result["reply"])
                self.assertNotIn("bầu trời", result["reply"].casefold())
                self.assertEqual([call["stage"] for call in client.calls], ["IntentRouterAgent"])

    def test_greeting_with_learning_request_still_asks_for_missing_language(self):
        result = AdaptiveLearningOrchestrator(client_factory=LanguageClarificationClient).process_turn(
            "test-user", [{"sender": "USER", "content": "Xin chào, tôi muốn học for"}],
            learner_context={"language": "python", "language_source": "default", "states": {}},
        )
        self.assertEqual(result["status"], "AWAITING_CONFIRMATION")
        self.assertEqual([record["agent"] for record in result["agent_traces"]], [
            "IntentRouterAgent", "ClarificationAgent",
        ])

    def test_ambiguous_language_goes_to_clarification_before_any_learning_stage(self):
        result = AdaptiveLearningOrchestrator(client_factory=LanguageClarificationClient).process_turn(
            "test-user", [{"sender": "USER", "content": "Tôi muốn học for"}],
            learner_context={"language": "python", "language_source": "default", "states": {}},
        )
        self.assertEqual(result["status"], "AWAITING_CONFIRMATION")
        self.assertEqual([record["agent"] for record in result["agent_traces"]], [
            "IntentRouterAgent", "ClarificationAgent",
        ])
        self.assertIsNone(result["pending_confirmation"]["language"])
        self.assertEqual(result["suggested_options"], ["Python", "JavaScript", "C++", "SQL"])

    def test_language_answer_does_not_silently_choose_theory_for_if_else(self):
        class ModeDriftClient:
            def __init__(self):
                self.calls = []

            def json(self, stage, _system, data):
                self.calls.append({"stage": stage, "provider": "fixture", "model": "fixture"})
                if stage == "ClarificationAgent":
                    return {"question": "Bạn muốn học if-else bằng ngôn ngữ lập trình nào?",
                            "suggested_options": ["Python", "JavaScript", "C++", "SQL"]}
                if stage == "IntentRouterAgent":
                    # Reproduce the unwanted model drift to EXPLAIN_CONCEPT.
                    return {
                        "intent": "EXPLAIN_CONCEPT",
                        "language": None if "Người học bổ sung" in data["request"] else "python",
                        "topic": "PY-FLOW-01",
                        "topic_match": "matched", "requested_topic": None,
                        "topic_evidence": ["if-else"], "difficulty_request": "auto",
                        "required_constructs": [], "forbidden_constructs": [],
                        "ordered_output": False, "confirm_prerequisite_override": False,
                    }
                raise AssertionError(f"Không được biên soạn lý thuyết khi chưa chọn cách học: {stage}")

        client = ModeDriftClient()
        orchestrator = AdaptiveLearningOrchestrator(client_factory=lambda: client)
        first = orchestrator.process_turn(
            "test-user", [{"sender": "USER", "content": "Tôi muốn học if-else"}],
            learner_context={"language": "python", "language_source": "default", "states": {}},
        )
        self.assertEqual(first["status"], "AWAITING_CONFIRMATION")
        self.assertEqual(first["pending_confirmation"]["original_intent"], "CLARIFY_LEARNING_MODE")
        self.assertEqual(first["suggested_options"], ["Python", "JavaScript", "C++", "SQL"])

        client.calls.clear()
        second = orchestrator.process_turn(
            "test-user", [{"sender": "USER", "content": "Tôi muốn học if-else"},
                          {"sender": "AI_TUTOR", "content": first["reply"]},
                          {"sender": "USER", "content": "Python"}],
            learner_context={"language": "python", "language_source": "explicit",
                             "pending_confirmation": first["pending_confirmation"], "states": {}},
        )
        self.assertEqual(second["status"], "AWAITING_CONFIRMATION")
        self.assertEqual(second["intent"], "CLARIFY_LEARNING_MODE")
        self.assertEqual(second["pending_confirmation"]["type"], "LEARNING_MODE_SELECTION")
        self.assertEqual(second["pending_confirmation"]["language"], "python")
        self.assertEqual(second["pending_confirmation"]["target_concept_id"], "PY-FLOW-01")
        self.assertEqual(second["pending_confirmation"]["original_user_request"], "Tôi muốn học if-else")
        self.assertEqual(second["suggested_options"], ["Học lý thuyết", "Làm bài thực hành"])
        self.assertEqual([call["stage"] for call in client.calls], ["IntentRouterAgent"])

        direct = IntentRouterAgent(client, self.kg).route("Tôi muốn học if-else trong Python")
        self.assertEqual((direct.intent, direct.language, direct.topic),
                         ("CLARIFY_LEARNING_MODE", "python", "PY-FLOW-01"))

        explicit_theory = IntentRouterAgent(client, self.kg).route("Python", {
            "pending_confirmation": {"type": "ROUTING_CLARIFICATION",
                "original_user_request": "Tôi muốn học lý thuyết if-else",
                "original_intent": "EXPLAIN_CONCEPT"},
        })
        self.assertEqual(explicit_theory.intent, "EXPLAIN_CONCEPT")

        class OutsideClient:
            def json(self, *_args):
                return {"intent": "OUT_OF_SCOPE", "language": None, "topic": None,
                        "topic_match": "unspecified", "requested_topic": None,
                        "topic_evidence": [], "difficulty_request": "auto",
                        "required_constructs": [], "forbidden_constructs": [],
                        "ordered_output": False, "confirm_prerequisite_override": False}

        outside = IntentRouterAgent(OutsideClient(), self.kg).route("Tôi muốn học nấu ăn")
        self.assertEqual(outside.intent, "OUT_OF_SCOPE")

    def test_generic_learning_request_asks_for_theory_or_practice(self):
        routing = IntentRouterAgent(CatalogFixtureClient(self.kg), self.kg).route("Tôi muốn học Dictionary trong Python")
        self.assertEqual(routing.intent, "CLARIFY_LEARNING_MODE")
        self.assertEqual(routing.topic, "PY-DICT-01")

        result = AdaptiveLearningOrchestrator(client_factory=NeverCalledClient).process_turn(
            "test-user",
            [{"sender": "USER", "content": "Tôi muốn học Dictionary trong Python"}],
            learner_context={"states": {}},
        )
        self.assertEqual(result["status"], "AWAITING_CONFIRMATION")
        self.assertEqual(result["suggested_options"], ["Học lý thuyết", "Làm bài thực hành"])
        self.assertEqual(result["pending_confirmation"]["target_concept_id"], "PY-DICT-01")

    def test_foreach_resolves_to_the_javascript_higher_order_array_lesson(self):
        router = IntentRouterAgent(CatalogFixtureClient(self.kg), self.kg)
        routing = router.route("Tôi muốn học forEach trong JavaScript")
        self.assertEqual(routing.intent, "CLARIFY_LEARNING_MODE")
        self.assertEqual(routing.topic, "JS-ARRAY-HOF-01")

        result = AdaptiveLearningOrchestrator(client_factory=NeverCalledClient).process_turn(
            "test-user",
            [{"sender": "USER", "content": "Tôi muốn học forEach trong JavaScript"}],
            learner_context={"states": {}},
        )
        self.assertEqual(result["status"], "AWAITING_CONFIRMATION")
        self.assertEqual(result["pending_confirmation"]["target_concept_id"], "JS-ARRAY-HOF-01")

    def test_unknown_learning_topic_requests_clarification_instead_of_failing_pipeline(self):
        result = AdaptiveLearningOrchestrator(client_factory=UnknownTopicClient).process_turn(
            "test-user",
            [{"sender": "USER", "content": "Tôi muốn học quuxzz trong JavaScript"}],
            language="javascript",
            learner_context={"states": {}},
        )
        self.assertEqual(result["status"], "AWAITING_CONFIRMATION")
        self.assertIsNone(result.get("error"))
        self.assertIn("chủ đề cụ thể nào trong JavaScript", result["reply"])
        self.assertEqual(result["suggested_options"], [])

    def test_learning_mode_buttons_preserve_the_selected_concept(self):
        pending = {
            "type": "LEARNING_MODE_SELECTION",
            "target_concept_id": "PY-DICT-01",
            "target_concept_name": "Cú pháp Key-Value & Điều kiện Hashable của Key",
            "language": "python",
        }
        router = IntentRouterAgent(CatalogFixtureClient(self.kg), self.kg)
        theory = router.route("Học lý thuyết", {"pending_confirmation": pending})
        practice = router.route("Làm bài thực hành", {"pending_confirmation": pending})
        self.assertEqual((theory.intent, theory.topic), ("EXPLAIN_CONCEPT", "PY-DICT-01"))
        self.assertEqual((practice.intent, practice.topic), ("REQUEST_ADAPTIVE_EXERCISE", "PY-DICT-01"))

    def test_cpp_theory_selection_keeps_confirmed_language_without_rerouting(self):
        pending = {
            "type": "LEARNING_MODE_SELECTION", "target_concept_id": "CPP-LOOP-01",
            "language": "cpp", "original_user_request": "Tôi muốn học For",
            "required_constructs": [], "forbidden_constructs": [], "ordered_output": False,
        }

        class TheoryClient:
            def __init__(self):
                self.calls = []

            def json(self, stage, _system, data):
                self.calls.append({"stage": stage, "provider": "fixture", "model": "fixture"})
                if stage == "IntentRouterAgent":
                    raise AssertionError("Lựa chọn đã xác nhận không cần router LLM chạy lại")
                if stage == "ExplanationTutorAgent":
                    assert data["language"] == "cpp"
                    assert data["concept_id"] == "CPP-LOOP-01"
                    return {"reply": "Vòng lặp for trong C++ giúp lặp có kiểm soát. " * 16,
                            "source_ids": []}
                raise AssertionError(f"Không chờ thêm xác nhận từ {stage}")

        client = TheoryClient()
        route = IntentRouterAgent(client, self.kg).route("Học lý thuyết", {
            "language": "cpp", "language_source": "explicit", "pending_confirmation": pending,
        })
        self.assertEqual((route.intent, route.language, route.topic),
                         ("EXPLAIN_CONCEPT", "cpp", "CPP-LOOP-01"))
        self.assertTrue(route.language_confirmed)
        self.assertEqual(route.user_text, "Tôi muốn học For")
        practice = IntentRouterAgent(client, self.kg).route("Làm bài thực hành", {
            "pending_confirmation": pending,
        })
        self.assertEqual((practice.intent, practice.language, practice.topic),
                         ("REQUEST_ADAPTIVE_EXERCISE", "cpp", "CPP-LOOP-01"))
        recovered = IntentRouterAgent(client, self.kg).route("C++", {
            "pending_confirmation": {**pending, "resumed_mode_choice": "học lý thuyết"},
        })
        self.assertEqual((recovered.intent, recovered.language, recovered.topic),
                         ("EXPLAIN_CONCEPT", "cpp", "CPP-LOOP-01"))
        self.assertFalse(client.calls)

        result = AdaptiveLearningOrchestrator(client_factory=lambda: client).process_turn(
            "test-user", [{"sender": "USER", "content": "Học lý thuyết"}],
            learner_context={"language": "cpp", "language_source": "explicit",
                             "pending_confirmation": pending, "states": {}},
        )
        self.assertEqual(result["status"], "SUCCEEDED")
        self.assertEqual(result["intent"], "EXPLAIN_CONCEPT")
        self.assertEqual(result["agent_traces"][0]["method"], "CONFIRMED_SELECTION")
        self.assertEqual([call["stage"] for call in client.calls], ["ExplanationTutorAgent"])
        self.assertNotIn("ngôn ngữ lập trình nào", result["reply"])

    def test_standalone_luyen_uses_catalog_llm_and_keeps_title_in_sync(self):
        cases = [
            ("Tôi muốn luyện Dictionary trong Python", "python", "PY-DICT-01"),
            ("Tôi muốn luyện object trong JavaScript", "javascript", "JS-OBJECT-01"),
            ("Tôi muốn luyện vector trong C++", "cpp", "CPP-VECTOR-01"),
            ("Tôi muốn luyện WHERE trong SQL", "sql", "SQL-WHERE-01"),
        ]
        router = IntentRouterAgent(CatalogFixtureClient(self.kg), self.kg)
        planner = AdaptiveExercisePlanner(self.kg)
        for text, language, expected in cases:
            with self.subTest(text=text):
                routing = router.route(text)
                self.assertEqual(routing.intent, "REQUEST_ADAPTIVE_EXERCISE")
                self.assertEqual(routing.language, language)
                self.assertEqual(routing.topic, expected)
                spec = planner.plan_exercise(routing, "test-user")
                self.assertEqual(spec.target_concept, expected)
                self.assertEqual(spec.concept_title, self.kg.get_concept(language, expected)["name"])

    def test_llm_cannot_override_explicit_language(self):
        with self.assertRaises(PipelineError) as caught:
            IntentRouterAgent(ConflictingClient(), self.kg).route("Dictionary trong Python nhé")
        self.assertEqual(caught.exception.code, "ROUTING_LANGUAGE_MISMATCH")

    def test_every_alias_points_to_a_real_concept_in_its_language(self):
        for language, aliases in TOPIC_ALIASES.items():
            concept_ids = {concept["id"] for concept in self.kg.list_all_concepts(language)}
            with self.subTest(language=language):
                self.assertFalse(set(aliases.values()) - concept_ids)

    def test_grounding_uses_lesson_mapping_before_keyword_similarity(self):
        cases = [
            ("Tôi muốn luyện Dictionary trong Python", "LS-06.02"),
            ("Tôi muốn luyện object trong JavaScript", "JS2-09.01"),
            ("Tôi muốn luyện vector trong C++", "CPP2-02.01"),
            ("Tôi muốn luyện WHERE trong SQL", "SQL-02.03"),
        ]
        router = IntentRouterAgent(CatalogFixtureClient(self.kg), self.kg)
        planner = AdaptiveExercisePlanner(self.kg)
        for text, expected_lesson_id in cases:
            with self.subTest(text=text):
                spec = planner.plan_exercise(router.route(text), "test-user")
                grounding = GroundingService().retrieve(spec, self.kg)
                lesson_sources = [source for source in grounding["sources"] if source.get("lesson_id")]
                self.assertTrue(lesson_sources)
                self.assertEqual(lesson_sources[0]["lesson_id"], expected_lesson_id)

    def test_sql_topics_without_lesson_content_are_not_published(self):
        for concept_id in ("SQL-SORT-01", "SQL-AGG-01", "SQL-JOIN-01"):
            with self.subTest(concept_id=concept_id):
                self.assertEqual(self.kg.get_concept("sql", concept_id).get("content_status"), "PLANNED")

    def test_all_graph_references_and_lesson_mappings_are_valid(self):
        for language, graph_path in GRAPH_FILES.items():
            graph = json.loads(graph_path.read_text(encoding="utf-8"))
            concept_ids = {skill["id"] for skill in graph["skills"]}
            references = set(graph.get("lesson_mappings", {}).values())
            references.update(graph.get("practice_problem_mappings", {}).values())
            mapped_concepts = set(graph.get("lesson_mappings", {}).values())
            for lesson_concept_ids in graph.get("multi_skill_lesson_mappings", {}).values():
                mapped_concepts.update(lesson_concept_ids)
            for skill in graph["skills"]:
                references.update(skill.get("prerequisites", []))
            for edge in graph.get("edges", []):
                references.update((edge["source"], edge["target"]))
            self.assertFalse(references - concept_ids, language)
            published_concepts = {
                skill["id"] for skill in graph["skills"]
                if skill.get("content_status", "PUBLISHED") == "PUBLISHED"
            }
            self.assertFalse(
                published_concepts - mapped_concepts,
                f"{language}: concept PUBLISHED chưa có bài học thật",
            )

            lesson_sources = {}
            lesson_titles = {}
            lesson_prerequisites = []
            for path in CONTENT_DIRS[language].rglob("*"):
                if path.suffix.lower() not in {".md", ".txt"}:
                    continue
                text = path.read_text(encoding="utf-8-sig")
                lesson_id = lesson_frontmatter_value(text, "lessonId")
                if lesson_id:
                    lesson_sources.setdefault(lesson_id, set()).add(path.with_suffix(""))
                    title = lesson_frontmatter_value(text, "title")
                    if title:
                        lesson_titles[lesson_id] = title
                    prerequisites = lesson_frontmatter_value(text, "prerequisites")
                    if prerequisites and prerequisites.startswith("[") and prerequisites.endswith("]"):
                        prerequisite_ids = [part.strip().strip('"\'') for part in prerequisites[1:-1].split(",") if part.strip()]
                        lesson_prerequisites.extend((lesson_id, prerequisite_id) for prerequisite_id in prerequisite_ids)
            duplicate_lessons = {
                lesson_id: stems for lesson_id, stems in lesson_sources.items() if len(stems) > 1
            }
            self.assertFalse(duplicate_lessons, f"{language}: trùng lessonId ở các bài khác nhau")
            self.assertFalse(set(lesson_sources) - set(graph.get("lesson_mappings", {})), language)
            unresolved_prerequisites = [
                f"{lesson_id}->{prerequisite_id}"
                for lesson_id, prerequisite_id in lesson_prerequisites
                if prerequisite_id not in lesson_sources
            ]
            self.assertFalse(unresolved_prerequisites, f"{language}: prerequisite bài học không tồn tại")
            for lesson_id, title in lesson_titles.items():
                if graph.get("lesson_title_mappings"):
                    self.assertEqual(
                        graph["lesson_mappings"][lesson_id],
                        graph["lesson_title_mappings"].get(title),
                        f"{language}: {lesson_id} và tiêu đề đang trỏ tới hai concept khác nhau",
                    )

    def test_every_mapped_lesson_code_and_title_is_routable_in_three_languages(self):
        router = IntentRouterAgent(CatalogFixtureClient(self.kg), self.kg)
        display_names = {"python": "Python", "javascript": "JavaScript", "cpp": "C++"}
        for language in ("python", "javascript", "cpp"):
            graph = json.loads(GRAPH_FILES[language].read_text(encoding="utf-8"))
            for lesson_code, concept_id in graph["lesson_mappings"].items():
                with self.subTest(language=language, lesson_code=lesson_code):
                    self.assertEqual(self.kg.resolve_concept_by_topic(language, lesson_code), concept_id)

            for path in CONTENT_DIRS[language].rglob("*"):
                if path.suffix.lower() not in {".md", ".txt"}:
                    continue
                text = path.read_text(encoding="utf-8-sig")
                lesson_code = lesson_frontmatter_value(text, "lessonId")
                title = lesson_frontmatter_value(text, "title")
                if not lesson_code or not title:
                    continue
                expected = graph["lesson_mappings"][lesson_code]
                with self.subTest(language=language, title=title):
                    if self.kg.get_concept(language, expected).get("content_status") == "PLANNED":
                        continue
                    routing = router.route(f"Tôi muốn học {title} trong {display_names[language]}")
                    self.assertEqual(routing.topic, expected)


if __name__ == "__main__":
    unittest.main()
