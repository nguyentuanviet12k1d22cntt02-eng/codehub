"""Regression for PY-SET-01 when prerequisite loops are not verified."""

import subprocess
import sys
import unittest
from unittest.mock import patch

from app.agents.adaptive_exercise_planner import AdaptiveExercisePlanner
from app.agents.exercise_generator_agent import ExerciseGeneratorAgent
from app.agents.prerequisite_advisor_agent import PrerequisiteAdvisorAgent
from app.contracts.routing import RoutingDecision
from app.services.knowledge_graph_service import KnowledgeGraphService
from app.orchestrator.adaptive_learning_orchestrator import AdaptiveLearningOrchestrator
from app.validation.ast_constraint_validator import AstConstraintValidator
from app.validation.schema_validator import SchemaValidator


SOURCE = "left = set(input().split())\nright = set(input().split())\nprint(len(left & right))"
DRAFT = {
    "title": "Đếm số từ chung bằng phép giao tập hợp",
    "problem_statement": ("## Mô tả\nĐọc hai dòng chứa các từ cách nhau bằng dấu cách. "
                          "In số từ khác nhau xuất hiện ở cả hai dòng; từ lặp chỉ tính một lần. "
                          "Nếu một dòng rỗng, kết quả là 0.\n\n"
                          "## Input\nHai dòng văn bản gồm các từ ngăn cách bằng dấu cách.\n\n"
                          "## Output\nMột số nguyên là số từ chung khác nhau."),
    "quick_theory": "set loại các từ trùng; phép & lấy các phần tử chung của hai tập hợp.",
    "starter_code": "left = set(input().split())\nright = set(input().split())\n# TODO: in số từ chung",
    "reference_solution": SOURCE,
    "test_cases": [
        {"input": "meo cho meo\ncho ga\n", "expected_output": "1", "is_hidden": False,
         "category": "normal", "explanation": "Một từ chung là cho."},
        {"input": "a b\nc d\n", "expected_output": "0", "is_hidden": False,
         "category": "normal", "explanation": "Hai tập hợp không giao nhau."},
        {"input": "\n\n", "expected_output": "0", "is_hidden": True,
         "category": "boundary", "explanation": "Hai dòng trống tạo hai tập rỗng."},
        {"input": "x x y z\ny x x\n", "expected_output": "2", "is_hidden": True,
         "category": "normal", "explanation": "Từ lặp không làm tăng kích thước giao."},
    ],
    "hints": {"scaffold_1_conceptual": "Tạo tập hợp từ mỗi dòng để loại trùng.",
              "scaffold_2_syntax": "Dùng toán tử & để lấy phần giao.",
              "scaffold_3_pseudocode": "Đọc hai tập từ, giao chúng, in kích thước."},
    "constraints": ["Phân biệt chữ hoa và chữ thường."],
    "common_pitfall_warning": "Không đếm một từ lặp nhiều lần.",
}


def beginner_set_spec():
    graph = KnowledgeGraphService()
    routing = RoutingDecision(intent="REQUEST_ADAPTIVE_EXERCISE", language="python",
                              topic="PY-SET-01", topic_match="matched",
                              user_text="Vẫn tạo bài Tập hợp duy nhất (Set) cho tôi")
    readiness = PrerequisiteAdvisorAgent(graph).assess("python", "PY-SET-01", {"states": {}})
    return AdaptiveExercisePlanner(graph).plan_exercise(routing, "learner", "PY-SET-01", {
        "states": {}, "readiness_assessment": readiness, "force_prerequisite_override": True})


class SetGenerationRegressionTests(unittest.TestCase):
    def test_beginner_plan_gives_compatible_set_target(self):
        spec = beginner_set_spec()
        self.assertEqual(spec.execution["mode"], "stdio")
        self.assertTrue({"for", "while", "function", "class"} <= set(spec.forbidden_constructs))
        self.assertIn("input().split()", spec.target_sub_skills[0])
        self.assertIn("phép giao", spec.target_sub_skills[0])

    def test_generator_gets_specific_first_try_and_repair_guidance(self):
        class Capture:
            payload = None
            def json(self, stage, system, payload):
                self.payload = payload
                return DRAFT
        client = Capture()
        generator = ExerciseGeneratorAgent(client)
        generator.generate(beginner_set_spec())
        first = " ".join(client.payload["generation_guidance"])
        self.assertIn("set(input().split())", first)
        self.assertIn("list comprehension", first)
        generator.generate(beginner_set_spec(), {"errors": ["Đặc tả cấm dùng vòng lặp for"]}, DRAFT)
        self.assertIn("Lần trước bị từ chối", " ".join(client.payload["generation_guidance"]))

    def test_regression_candidate_passes_static_checks_and_expected_outputs(self):
        spec = beginner_set_spec()
        self.assertTrue(SchemaValidator.validate(DRAFT, spec)[0])
        self.assertTrue(AstConstraintValidator.validate(DRAFT, spec)[0])
        for case in DRAFT["test_cases"]:
            execution = subprocess.run([sys.executable, "-c", SOURCE], input=case["input"],
                                       text=True, capture_output=True, timeout=1, check=True)
            self.assertEqual(execution.stdout.strip(), case["expected_output"])

    def test_comprehension_is_rejected_with_actionable_feedback(self):
        broken = {**DRAFT, "reference_solution": "data = input().split()\npoints = [int(x) for x in data]\nprint(len(set(points)))"}
        passed, errors = AstConstraintValidator.validate(broken, beginner_set_spec())
        self.assertFalse(passed)
        self.assertIn("comprehension", " ".join(errors))
        self.assertIn("set(input().split())", " ".join(errors))

    def test_pipeline_repairs_set_comprehension_and_publishes_only_verified_candidate(self):
        class SetRouter:
            def __init__(self, *_):
                pass
            def exact_catalog_exercise(self, *_):
                return None
            def has_conflicting_topic_choices(self, *_):
                return False
            def route(self, user_text, context=None, trace_id=None):
                return RoutingDecision(intent="REQUEST_ADAPTIVE_EXERCISE", language="python",
                    topic="PY-SET-01", topic_match="matched", confirm_prerequisite_override=True,
                    user_text=user_text, trace_id=trace_id)

        class SetClient:
            generation_calls = 0
            def __init__(self):
                self.calls = []
            def remaining(self):
                return 60
            def json(self, stage, system, payload):
                self.calls.append({"stage": stage, "provider": "TEST_DOUBLE", "status": "SUCCEEDED"})
                if stage == "ExerciseGeneratorAgent":
                    self.generation_calls += 1
                    self_guidance = " ".join(payload["generation_guidance"])
                    assert "set(input().split())" in self_guidance
                    if self.generation_calls == 1:
                        return {**DRAFT, "reference_solution":
                            "data = input().split()\npoints = [int(x) for x in data]\nprint(len(set(points)))"}
                    assert "Lần trước bị từ chối" in self_guidance
                    assert payload["previous_draft"] is None
                    return DRAFT
                if stage == "ExplanationTutorAgent":
                    return {"reply": ("Tập hợp loại phần tử lặp. Phép & lấy các phần tử chung; "
                                      "len đếm số phần tử sau khi giao hai tập hợp từ. ") * 10, "source_ids": []}
                if stage == "CriticEvaluatorAgent":
                    return {"is_approved": True, "theory_approved": True, "exercise_approved": True,
                            "compatibility_approved": True, "score": .9, "feedback_target": "NONE",
                            "feedback": "Bài Set và lý thuyết phù hợp.", "evidence": ["Nghiệm mẫu dùng phép giao tập hợp"],
                            "theory_feedback": None, "exercise_feedback": None}
                raise AssertionError(stage)

        class VerifiedSandbox:
            @staticmethod
            def validate(draft, spec, timeout=40):
                assert draft["reference_solution"] == SOURCE
                assert spec.execution["mode"] == "stdio"
                return True, [], [{"passed": True, "executed": True, "is_hidden": case["is_hidden"]}
                                  for case in draft["test_cases"]]

        client = SetClient()
        pending = {"type": "PREREQUISITE_OVERRIDE", "language": "python",
                   "target_concept_id": "PY-SET-01", "exercise_count": 4,
                   "original_user_request": "Tạo 4 bài tập về Set trong Python"}
        with patch("app.orchestrator.adaptive_learning_orchestrator.IntentRouterAgent", SetRouter):
            report = AdaptiveLearningOrchestrator(lambda: client, VerifiedSandbox).process_turn(
                "learner", [{"sender": "USER", "content": "Vẫn tạo bài Set cho tôi"}],
                learner_context={"states": {}, "language": "python", "pending_confirmation": pending})
        self.assertEqual(report["status"], "SUCCEEDED", report.get("error"))
        self.assertEqual(report["exercise_count"], 4)
        self.assertNotIn("Tạo bài tiếp theo", report["suggested_options"])
        self.assertEqual(client.generation_calls, 2)
        self.assertTrue(any(record["agent"] == "ConstraintValidator" and record["status"] == "REJECTED"
                            for record in report["agent_traces"]))
        self.assertTrue(any(record["agent"] == "PublicationGate" and record["status"] == "SUCCEEDED"
                            for record in report["agent_traces"]))


if __name__ == "__main__":
    unittest.main()
