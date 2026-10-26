"""Offline checks for selecting and capping practice-exercise quantity."""

import unittest

from tests.test_pipeline_v3 import Client, Sandbox, fixture_route
from app.orchestrator.adaptive_learning_orchestrator import AdaptiveLearningOrchestrator
from app.pipeline.exercise_count import requested_exercise_count, is_count_selection_reply


class ExerciseCountTests(unittest.TestCase):
    def test_quantity_parser(self):
        self.assertEqual(requested_exercise_count("Tạo 3 bài tập Python"), 3)
        self.assertEqual(requested_exercise_count("Tạo năm bài thực hành"), 5)
        self.assertEqual(requested_exercise_count("9 bài"), 9)
        self.assertEqual(requested_exercise_count("2 bài", standalone=True), 2)
        self.assertEqual(requested_exercise_count("0 bài", standalone=True), 0)
        self.assertEqual(requested_exercise_count("Tạo " + "9" * 5000 + " bài"), 6)
        self.assertIsNone(requested_exercise_count("Tạo bài Python"))
        self.assertTrue(is_count_selection_reply("4 bài"))
        self.assertFalse(is_count_selection_reply("Tạo 4 bài tập set trong Python"))

    def test_missing_quantity_asks_before_generation(self):
        client = Client()
        report = AdaptiveLearningOrchestrator(lambda: client, Sandbox).process_turn(
            "u", [{"sender": "USER", "content": "Tạo bài tập về biến trong Python"}])
        self.assertEqual(report["status"], "AWAITING_CONFIRMATION")
        self.assertEqual(report["pending_confirmation"]["type"], "EXERCISE_COUNT_SELECTION")
        self.assertEqual(report["pending_confirmation"]["target_concept_id"], "PY-BASICS-01")
        self.assertEqual(report["suggested_options"], [f"{number} bài" for number in range(1, 6)])
        self.assertNotIn("exercise_count", report)
        self.assertEqual(client.exercise_calls, 0)

    def test_explicit_set_without_quantity_asks_without_provider(self):
        class UnavailableClient:
            def __init__(self):
                self.calls = []
            def json(self, *_):
                raise AssertionError("Câu hỏi số lượng không cần gọi provider")

        report = AdaptiveLearningOrchestrator(UnavailableClient, Sandbox).process_turn(
            "u", [{"sender": "USER", "content": "Hãy tạo cho tôi bài tập set trong Python"}])
        self.assertEqual(report["status"], "AWAITING_CONFIRMATION")
        self.assertEqual(report["pending_confirmation"]["type"], "EXERCISE_COUNT_SELECTION")
        self.assertEqual(report["pending_confirmation"]["target_concept_id"], "PY-SET-01")
        self.assertEqual(report["agent_traces"][0]["method"], "PUBLISHED_CATALOG_EXACT")
        self.assertIsNone(report["exercise"])

        next_report = AdaptiveLearningOrchestrator(UnavailableClient, Sandbox).process_turn(
            "u", [{"sender": "USER", "content": "4 bài"}],
            learner_context={"pending_confirmation": report["pending_confirmation"], "states": {}})
        self.assertEqual(next_report["status"], "AWAITING_CONFIRMATION")
        self.assertEqual(next_report["pending_confirmation"]["type"], "PREREQUISITE_OVERRIDE")
        self.assertEqual(next_report["pending_confirmation"]["exercise_count"], 4)
        self.assertTrue(next_report["pending_confirmation"]["exercise_count_confirmed"])

    def test_count_reply_preserves_original_request(self):
        pending = {"type": "EXERCISE_COUNT_SELECTION", "language": "python",
                   "target_concept_id": "PY-BASICS-01", "original_user_request": "Tạo bài tập về biến trong Python"}
        second = AdaptiveLearningOrchestrator(Client, Sandbox).process_turn(
            "u", [{"sender": "USER", "content": "2 bài"}],
            learner_context={"pending_confirmation": pending})
        self.assertEqual(second["status"], "SUCCEEDED")
        self.assertEqual(second["exercise_count"], 2)
        self.assertEqual(second["exercise"]["language"], "python")

    def test_new_request_replaces_pending_quantity_question(self):
        pending = {"type": "EXERCISE_COUNT_SELECTION", "language": "python",
                   "target_concept_id": "PY-SET-01",
                   "original_user_request": "Tạo bài tập set trong Python"}
        report = AdaptiveLearningOrchestrator(Client, Sandbox).process_turn(
            "u", [{"sender": "USER", "content": "Tạo 2 bài tập về biến trong Python"}],
            learner_context={"pending_confirmation": pending, "states": {}})
        self.assertEqual(report["status"], "SUCCEEDED")
        self.assertEqual(report["exercise_count"], 2)
        self.assertEqual(report["exercise"]["concept_id"], "PY-BASICS-01")

    def test_explicit_quantity_and_maximum(self):
        for request, expected in (("Tạo 1 bài tập về biến trong Python", 1),
                                  ("Tạo 3 bài tập về biến trong Python", 3),
                                  ("Tạo 9 bài tập về biến trong Python", 5)):
            with self.subTest(request=request):
                report = AdaptiveLearningOrchestrator(Client, Sandbox).process_turn(
                    "u", [{"sender": "USER", "content": request}])
                self.assertEqual(report["status"], "SUCCEEDED")
                self.assertEqual(report["exercise_count"], expected)
                if expected > 1:
                    self.assertNotIn("Tạo bài tiếp theo", report["suggested_options"])
                if expected == 5:
                    self.assertIn("tối đa 5 bài", report["reply"])

    def test_topic_survives_quantity_selection(self):
        pending = {"type": "EXERCISE_COUNT_SELECTION", "language": "python",
                   "target_concept_id": "PY-FLOW-02",
                   "original_user_request": "Tạo bài tập về while trong Python"}
        second = AdaptiveLearningOrchestrator(Client, Sandbox).process_turn(
            "u", [{"sender": "USER", "content": "3 bài"}],
            learner_context={"pending_confirmation": pending,
                             "language": "python", "states": {}})
        self.assertEqual(second["status"], "AWAITING_CONFIRMATION")
        self.assertEqual(second["pending_confirmation"]["type"], "PREREQUISITE_OVERRIDE")
        self.assertEqual(second["pending_confirmation"]["target_concept_id"], "PY-FLOW-02")
        self.assertEqual(second["pending_confirmation"]["exercise_count"], 3)
        self.assertTrue(second["pending_confirmation"]["exercise_count_confirmed"])

    def test_old_implicit_quantity_does_not_count_as_confirmation(self):
        tutor = AdaptiveLearningOrchestrator(Client, Sandbox)
        topic_name = tutor.kg.get_concept("python", "PY-SET-01")["name"]
        pending = {"type": "PREREQUISITE_OVERRIDE", "language": "python",
                   "target_concept_id": "PY-SET-01", "exercise_count": 4,
                   "original_user_request": "Tạo bài tập về Set trong Python"}
        report = tutor.process_turn(
            "u", [{"sender": "USER", "content": f"Vẫn tạo bài {topic_name} cho tôi"}],
            learner_context={"pending_confirmation": pending, "states": {}})
        self.assertEqual(report["status"], "AWAITING_CONFIRMATION")
        self.assertEqual(report["pending_confirmation"]["type"], "EXERCISE_COUNT_SELECTION")
        self.assertNotIn("exercise_count", report)
        self.assertIsNone(report["exercise"])

    def test_selected_quantity_survives_prerequisite_confirmation(self):
        tutor = AdaptiveLearningOrchestrator(Client, Sandbox)
        topic_name = tutor.kg.get_concept("python", "PY-FLOW-02")["name"]
        pending = {"type": "PREREQUISITE_OVERRIDE", "language": "python",
                   "target_concept_id": "PY-FLOW-02", "exercise_count": 3,
                   "exercise_count_confirmed": True,
                   "original_user_request": "Tạo bài tập về while trong Python"}
        report = tutor.process_turn(
            "u", [{"sender": "USER", "content": f"Vẫn tạo bài {topic_name} cho tôi"}],
            learner_context={"pending_confirmation": pending, "states": {}})
        self.assertNotEqual(report.get("pending_confirmation", {}).get("type"), "EXERCISE_COUNT_SELECTION")
        self.assertEqual(report["exercise_count"], 3)

    def test_clear_adaptive_request_with_count_does_not_ask_extra_question(self):
        client = Client()
        report = AdaptiveLearningOrchestrator(lambda: client, Sandbox).process_turn(
            "u", [{"sender": "USER", "content": "Tạo 2 bài Python"}])
        self.assertEqual(report["status"], "SUCCEEDED")
        self.assertEqual(report["exercise_count"], 2)
        self.assertEqual(client.exercise_calls, 1)

    def test_low_confidence_route_asks_instead_of_generating(self):
        class UncertainClient(Client):
            def json(self, stage, system, data):
                if stage == "IntentRouterAgent":
                    return {**fixture_route(data), "confidence": .4}
                if stage == "ClarificationAgent":
                    return {"question": "Bạn xác nhận muốn luyện chủ đề dictionary trong Python?",
                            "suggested_options": []}
                return super().json(stage, system, data)

        client = UncertainClient()
        report = AdaptiveLearningOrchestrator(lambda: client, Sandbox).process_turn(
            "u", [{"sender": "USER", "content": "Tạo bài Python về dictionary"}])
        self.assertEqual(report["status"], "AWAITING_CONFIRMATION")
        self.assertEqual(report["pending_confirmation"]["type"], "ROUTING_CLARIFICATION")
        self.assertEqual(client.exercise_calls, 0)

    def test_two_different_topics_ask_even_if_router_chose_one(self):
        class OneTopicClient(Client):
            def json(self, stage, system, data):
                if stage == "IntentRouterAgent":
                    return {"intent": "REQUEST_ADAPTIVE_EXERCISE", "language": "python",
                            "topic": "PY-SET-01", "topic_match": "matched",
                            "requested_topic": None, "topic_evidence": ["set"],
                            "difficulty_request": "auto", "required_constructs": [],
                            "forbidden_constructs": [], "ordered_output": False,
                            "confirm_prerequisite_override": False}
                if stage == "ClarificationAgent":
                    return {"question": "Bạn muốn luyện Set hay List trong Python?",
                            "suggested_options": []}
                return super().json(stage, system, data)

        client = OneTopicClient()
        report = AdaptiveLearningOrchestrator(lambda: client, Sandbox).process_turn(
            "u", [{"sender": "USER", "content": "Tạo 2 bài tập set hoặc list trong Python"}])
        self.assertEqual(report["status"], "AWAITING_CONFIRMATION")
        self.assertEqual(report["pending_confirmation"]["type"], "ROUTING_CLARIFICATION")
        self.assertIsNone(report["exercise"])
        self.assertEqual(client.exercise_calls, 0)

        followup = AdaptiveLearningOrchestrator(lambda: client, Sandbox).process_turn(
            "u", [{"sender": "USER", "content": "Python"}],
            learner_context={"pending_confirmation": {
                "type": "ROUTING_CLARIFICATION", "original_intent": "REQUEST_ADAPTIVE_EXERCISE",
                "original_user_request": "Tạo 2 bài tập set hoặc list"}, "states": {}})
        self.assertEqual(followup["status"], "AWAITING_CONFIRMATION")
        self.assertEqual(followup["pending_confirmation"]["type"], "ROUTING_CLARIFICATION")
        self.assertIsNone(followup["exercise"])


if __name__ == "__main__":
    unittest.main()
