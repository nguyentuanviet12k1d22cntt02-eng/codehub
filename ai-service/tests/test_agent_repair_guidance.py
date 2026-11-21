"""Repair guidance for the two agent failures seen in the last 7 days of runs.

trace_5296435f43ab415fa73e68780777bd29: three drafts in a row used a function
for a learner without function evidence (the old draft was fed back each time).
trace_1d24de907fe2475cab4606f634c7e627: the statement-only repair stayed too long.
"""
import unittest

from app.agents.exercise_generator_agent import STATEMENT_LIMITS, ExerciseGeneratorAgent
from tests.test_list_generation_regression import DRAFT, beginner_list_spec

FUNCTION_ERROR = "reference_solution đòi hỏi hàm khi học viên chưa học hàm; dùng chương trình stdin/stdout."
LENGTH_ERROR = "Phần lời của đề quá dài; ưu tiên khoảng 50–100 từ, trừ dữ liệu ví dụ cần thiết."


class Capture:
    payload = None
    system = None

    def json(self, stage, system, payload):
        self.payload, self.system = payload, system
        return DRAFT


class RepairGuidanceTests(unittest.TestCase):
    def test_function_rejection_gets_explicit_sequential_program_guidance(self):
        client = Capture()
        ExerciseGeneratorAgent(client).generate(beginner_list_spec(), {"errors": [FUNCTION_ERROR]})
        guidance = " ".join(client.payload["generation_guidance"])
        self.assertIn("không def", guidance)
        self.assertIn("Không bám theo bản nháp cũ", guidance)

    def test_length_rejection_states_the_validator_word_limits(self):
        client = Capture()
        ExerciseGeneratorAgent(client).generate(beginner_list_spec(), {"errors": [LENGTH_ERROR]})
        self.assertIn(STATEMENT_LIMITS, client.payload["generation_guidance"])
        self.assertIn("≤ 85 từ", STATEMENT_LIMITS)

    def test_first_attempt_prompt_states_the_hard_limits(self):
        self.assertIn("tổng tên+mô tả+input+output+constraints ≤ 130 từ", ExerciseGeneratorAgent.SYSTEM_PROMPT)

    def test_statement_only_repair_prompt_states_the_hard_limits(self):
        from app.agents import exercise_repair_agent
        import inspect
        self.assertIn("mô tả ≤ 85 từ", inspect.getsource(exercise_repair_agent.ExerciseRepairAgent.repair))


class FunctionRejectionPipelineTests(unittest.TestCase):
    def test_function_draft_is_regenerated_without_the_old_draft(self):
        from unittest.mock import patch
        from app.contracts.routing import RoutingDecision
        from app.orchestrator.adaptive_learning_orchestrator import AdaptiveLearningOrchestrator
        from tests.test_list_generation_regression import SOURCE

        class Router:
            def __init__(self, *_): pass
            def exact_catalog_exercise(self, *_): return None
            def has_conflicting_topic_choices(self, *_): return False
            def route(self, user_text, context=None, trace_id=None):
                return RoutingDecision(intent="REQUEST_ADAPTIVE_EXERCISE", language="python", topic="PY-LIST-01",
                                       topic_match="matched", confirm_prerequisite_override=True,
                                       user_text=user_text, trace_id=trace_id)

        function_source = "def solution():\n    items = input().split()\n    print(' '.join(items))\nsolution()"

        class LLM:
            generations = 0
            second_payload = None
            def __init__(self): self.calls = []
            def remaining(self): return 60
            def json(self, stage, system, payload):
                self.calls.append({"stage": stage, "provider": "TEST_DOUBLE", "status": "SUCCEEDED"})
                if stage == "ExerciseGeneratorAgent":
                    self.generations += 1
                    if self.generations == 1:
                        return {**DRAFT, "reference_solution": function_source}
                    self.second_payload = payload
                    return DRAFT
                if stage == "ExplanationTutorAgent":
                    return {"reply": "Danh sách lưu nhiều phần tử theo thứ tự; insert chèn phần tử vào vị trí chỉ định. " * 10,
                            "source_ids": []}
                if stage == "CriticEvaluatorAgent":
                    return {"is_approved": True, "theory_approved": True, "exercise_approved": True,
                            "compatibility_approved": True, "score": .9, "feedback_target": "NONE",
                            "feedback": "Bài List và lý thuyết phù hợp.", "evidence": ["Nghiệm mẫu dùng insert"], "theory_feedback": None, "exercise_feedback": None}
                raise AssertionError(stage)

        class Sandbox:
            @staticmethod
            def validate(draft, spec, timeout=40):
                assert draft["reference_solution"] == SOURCE
                return True, [], [{"passed": True, "executed": True, "is_hidden": c["is_hidden"]} for c in draft["test_cases"]]

        llm = LLM()
        pending = {"type": "PREREQUISITE_OVERRIDE", "language": "python", "target_concept_id": "PY-LIST-01",
                   "exercise_count": 1, "exercise_count_confirmed": True, "original_user_request": "học List"}
        with patch("app.orchestrator.flows.routing.IntentRouterAgent", Router):
            report = AdaptiveLearningOrchestrator(lambda: llm, Sandbox).process_turn(
                "learner", [{"sender": "USER", "content": "Vẫn tạo bài List cho tôi"}],
                learner_context={"states": {}, "language": "python", "pending_confirmation": pending})
        self.assertEqual(report["status"], "SUCCEEDED", report.get("error"))
        self.assertEqual(llm.generations, 2)
        self.assertIsNone(llm.second_payload["previous_draft"])
        self.assertIn("không def", " ".join(llm.second_payload["generation_guidance"]))


class GroundingBudgetTests(unittest.TestCase):
    def test_generator_sends_two_short_excerpts_by_default(self):
        client = Capture()
        sources = [{"id": f"s{i}", "excerpt": "x" * 5000} for i in range(4)]
        ExerciseGeneratorAgent(client).generate(beginner_list_spec(), grounding={"sources": sources})
        materials = client.payload["learning_materials"]
        self.assertEqual([m["id"] for m in materials], ["s0", "s1"])
        self.assertTrue(all(len(m["excerpt"]) == 1800 for m in materials))

    def test_budget_is_configurable_within_bounds(self):
        import os
        from unittest.mock import patch
        from app.agents.exercise_generator_agent import grounding_budget
        with patch.dict(os.environ, {"ADAPTIVE_GROUNDING_SOURCES": "3", "ADAPTIVE_GROUNDING_EXCERPT_CHARS": "9999"}):
            self.assertEqual(grounding_budget(), (3, 3000))
        with patch.dict(os.environ, {"ADAPTIVE_GROUNDING_SOURCES": "bad", "ADAPTIVE_GROUNDING_EXCERPT_CHARS": "10"}):
            self.assertEqual(grounding_budget(), (2, 500))


if __name__ == "__main__":
    unittest.main()
