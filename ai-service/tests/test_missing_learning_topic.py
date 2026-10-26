"""Replay the missing-topic router result observed in the Set chat trace."""

import unittest

from app.agents.intent_router_agent import IntentRouterAgent
from app.orchestrator.adaptive_learning_orchestrator import AdaptiveLearningOrchestrator
from app.pipeline.llm_client import PipelineError


class MissingTopicClient:
    def __init__(self, **changes):
        self.calls = []
        self.changes = changes

    def json(self, stage, _system, _payload):
        if stage != "IntentRouterAgent":
            raise AssertionError(f"Unexpected LLM stage: {stage}")
        self.calls.append({"stage": stage})
        return {
            "intent": "CLARIFY_LEARNING_MODE", "language": "python",
            "topic": None, "topic_match": "unspecified", "requested_topic": None,
            "topic_evidence": ["Set"], "difficulty_request": "auto",
            "required_constructs": [], "forbidden_constructs": [],
            "ordered_output": False, "confirm_prerequisite_override": False,
            **self.changes,
        }


class MissingLearningTopicTests(unittest.TestCase):
    def test_set_trace_recovers_topic_and_asks_for_learning_mode(self):
        client = MissingTopicClient()
        request = "Tôi muốn học Set trong python"
        result = AdaptiveLearningOrchestrator(client_factory=lambda: client).process_turn(
            "test-user", [{"sender": "USER", "content": request}],
            language="python", learner_context={"states": {}},
        )
        self.assertEqual(result["status"], "AWAITING_CONFIRMATION")
        self.assertEqual(result["pending_confirmation"]["type"], "LEARNING_MODE_SELECTION")
        self.assertEqual(result["pending_confirmation"]["target_concept_id"], "PY-SET-01")
        self.assertEqual(result["pending_confirmation"]["original_user_request"], request)
        self.assertEqual(result["suggested_options"], ["Học lý thuyết", "Làm bài thực hành"])
        self.assertEqual(len(client.calls), 1)
        output = result["agent_traces"][0]["output"]
        self.assertEqual((output["topic"], output["topic_match"]), ("PY-SET-01", "matched"))

    def test_exact_subject_recovers_without_model_evidence_or_with_unmatched(self):
        for changes in ({"topic_evidence": []},
                        {"topic_match": "unmatched", "requested_topic": "Set"}):
            with self.subTest(changes=changes):
                route = IntentRouterAgent(MissingTopicClient(**changes)).route(
                    "Tôi muốn học Set trong python")
                self.assertEqual(route.topic, "PY-SET-01")
                self.assertEqual(route.topic_evidence, ["Set"])

    def test_recovery_uses_language_specific_aliases_and_original_quotes(self):
        cases = [
            ("Tôi muốn học Tập hợp trong Python!", "python", "PY-SET-01", "Tập hợp"),
            ("Toi muon hoc Set trong python", "python", "PY-SET-01", "Set"),
            ("Mình muốn học về Dictionary bằng Python", "python", "PY-DICT-01", "Dictionary"),
            ("Tôi muốn học object trong JavaScript", "javascript", "JS-OBJECT-01", "object"),
            ("Tôi muốn học vector trong C++", "cpp", "CPP-VECTOR-01", "vector"),
        ]
        for request, language, expected, quote in cases:
            with self.subTest(request=request):
                route = IntentRouterAgent(MissingTopicClient(language=language, topic_evidence=[])).route(request)
                self.assertEqual(route.topic, expected)
                self.assertEqual(route.topic_evidence, [quote])
                self.assertTrue(route.language_confirmed)

    def test_missing_language_is_clarified_before_recovering_set(self):
        route = IntentRouterAgent(MissingTopicClient()).route("Tôi muốn học Set", {
            "language": "python", "language_source": "default",
        })
        self.assertIsNone(route.topic)
        self.assertIsNone(route.language)
        self.assertFalse(route.language_confirmed)

    def test_language_followup_recovers_original_study_subject(self):
        route = IntentRouterAgent(MissingTopicClient(topic_evidence=[])).route("Python", {
            "pending_confirmation": {"type": "ROUTING_CLARIFICATION",
                "original_user_request": "Tôi muốn học Set",
                "original_intent": "CLARIFY_LEARNING_MODE"},
        })
        self.assertEqual(route.topic, "PY-SET-01")
        self.assertEqual(route.user_text, "Tôi muốn học Set")

    def test_compound_negated_and_unknown_subjects_do_not_select_set(self):
        for subject in ("Set và List", "Set hoặc List", "không phải Set", "Set nâng cao quuxzz"):
            with self.subTest(subject=subject):
                route = IntentRouterAgent(MissingTopicClient()).route(f"Tôi muốn học {subject} trong Python")
                self.assertIsNone(route.topic)
                self.assertEqual(route.topic_match, "unmatched")

    def test_unpublished_topic_cannot_be_recovered(self):
        route = IntentRouterAgent(MissingTopicClient(topic_evidence=["dictionary comprehension"])).route(
            "Tôi muốn học dictionary comprehension trong Python")
        self.assertIsNone(route.topic)
        self.assertEqual(route.topic_match, "unmatched")

    def test_recovery_does_not_hide_fabricated_model_evidence(self):
        with self.assertRaises(PipelineError) as caught:
            IntentRouterAgent(MissingTopicClient(topic_evidence=["Dictionary"])).route(
                "Tôi muốn học Set trong Python")
        self.assertEqual(caught.exception.code, "ROUTING_TARGET_UNSUPPORTED")

    def test_general_python_request_asks_for_topic_without_unrelated_suggestions(self):
        client = MissingTopicClient(topic_evidence=[])
        result = AdaptiveLearningOrchestrator(client_factory=lambda: client).process_turn(
            "test-user", [{"sender": "USER", "content": "Tôi muốn học lập trình python"}],
            learner_context={"states": {}},
        )
        self.assertEqual(result["status"], "AWAITING_CONFIRMATION")
        self.assertEqual(result["pending_confirmation"]["type"], "ROUTING_CLARIFICATION")
        self.assertIn("chủ đề cụ thể nào trong Python", result["reply"])
        self.assertEqual(result["suggested_options"], [])
        self.assertEqual([step["agent"] for step in result["agent_traces"]],
                         ["IntentRouterAgent", "ClarificationAgent"])

    def test_mode_selection_retains_recovered_topic_without_rerouting(self):
        client = MissingTopicClient()
        tutor = AdaptiveLearningOrchestrator(client_factory=lambda: client)
        first = tutor.process_turn("test-user", [
            {"sender": "USER", "content": "Tôi muốn học Set trong Python"}],
            learner_context={"states": {}},
        )
        route = IntentRouterAgent(client).route("Làm bài thực hành", {
            "pending_confirmation": first["pending_confirmation"],
        })
        self.assertEqual((route.intent, route.topic), ("REQUEST_ADAPTIVE_EXERCISE", "PY-SET-01"))
        self.assertEqual(len(client.calls), 1)

    def test_topic_clarification_uses_latest_subject_after_general_python_request(self):
        for followup in ("Set", "Tôi muốn học Set trong python"):
            with self.subTest(followup=followup):
                client = MissingTopicClient(topic_evidence=[])
                tutor = AdaptiveLearningOrchestrator(client_factory=lambda: client)
                first = tutor.process_turn("test-user", [
                    {"sender": "USER", "content": "Tôi muốn học lập trình python"}],
                    learner_context={"states": {}},
                )
                second = tutor.process_turn("test-user", [
                    {"sender": "USER", "content": followup}],
                    learner_context={"pending_confirmation": first["pending_confirmation"], "states": {}},
                )
                self.assertEqual(second["status"], "AWAITING_CONFIRMATION")
                self.assertEqual(second["pending_confirmation"]["type"], "LEARNING_MODE_SELECTION")
                self.assertEqual(second["pending_confirmation"]["target_concept_id"], "PY-SET-01")
                self.assertEqual(second["suggested_options"], ["Học lý thuyết", "Làm bài thực hành"])


if __name__ == "__main__":
    unittest.main()
