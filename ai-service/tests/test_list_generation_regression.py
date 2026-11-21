"""Regression for PY-LIST-01 when prerequisite loops are not verified.

Live trace trace_dc7855263fe94144a3b97561949700c2 (2026-11-21) failed with
REPAIR_LIMIT_REACHED: every draft read "n, then n lines" with a for loop,
the repair kept the old draft, and the loop error surfaced one turn late.
"""

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


SOURCE = "items = input().split()\npos = int(input())\nitems.insert(pos, input())\nprint(' '.join(items))"
LOOP_SOURCE = ("n = int(input())\npoints = []\nfor _ in range(n):\n    points.append(input())\n"
               "points.insert(int(input()), input())\nprint(' '.join(points))")
DRAFT = {
    "title": "Chèn một phần tử vào danh sách bằng insert",
    "problem_statement": ("## Mô tả\nĐọc một danh sách các từ trên một dòng. "
                          "Chèn một từ mới vào vị trí cho trước rồi in danh sách kết quả.\n\n"
                          "## Input\nDòng 1 là các từ cách nhau bằng dấu cách. Dòng 2 là vị trí k. Dòng 3 là từ cần chèn.\n\n"
                          "## Output\nMột dòng gồm các từ của danh sách sau khi chèn, cách nhau bằng dấu cách."),
    "quick_theory": "Phương thức insert(k, x) chèn x vào trước phần tử đang ở vị trí k của danh sách.",
    "starter_code": "items = input().split()\npos = int(input())\n# TODO: chèn từ mới vào vị trí pos rồi in danh sách",
    "reference_solution": SOURCE,
    "test_cases": [
        {"input": "a b c\n1\nx\n", "expected_output": "a x b c", "is_hidden": False,
         "category": "normal", "explanation": "Chèn x vào vị trí 1."},
        {"input": "meo cho\n0\nga\n", "expected_output": "ga meo cho", "is_hidden": False,
         "category": "normal", "explanation": "Chèn vào đầu danh sách."},
        {"input": "\n0\nz\n", "expected_output": "z", "is_hidden": True,
         "category": "boundary", "explanation": "Danh sách rỗng chỉ còn từ vừa chèn."},
        {"input": "a b\n2\nc\n", "expected_output": "a b c", "is_hidden": True,
         "category": "normal", "explanation": "Chèn vào cuối danh sách."},
    ],
    "hints": {"scaffold_1_conceptual": "Danh sách đọc từ một dòng bằng split.",
              "scaffold_2_syntax": "Dùng items.insert(pos, value).",
              "scaffold_3_pseudocode": "Đọc danh sách, đọc vị trí, chèn từ, in danh sách."},
    "constraints": ["0 <= k <= số phần tử của danh sách."],
    "common_pitfall_warning": "Nhớ chuyển vị trí k sang số nguyên trước khi chèn.",
}


def beginner_list_spec(batch_index=None):
    graph = KnowledgeGraphService()
    routing = RoutingDecision(intent="REQUEST_ADAPTIVE_EXERCISE", language="python",
                              topic="PY-LIST-01", topic_match="matched",
                              user_text="Vẫn tạo bài Thao tác CRUD trên List (Danh sách) cho tôi")
    readiness = PrerequisiteAdvisorAgent(graph).assess("python", "PY-LIST-01", {"states": {}})
    context = {"states": {}, "readiness_assessment": readiness, "force_prerequisite_override": True}
    if batch_index:
        context.update(batch_index=batch_index, batch_total=5)
    return AdaptiveExercisePlanner(graph).plan_exercise(routing, "learner", "PY-LIST-01", context)


class Capture:
    payload = None
    def json(self, stage, system, payload):
        self.payload = payload
        return DRAFT


class ListGenerationRegressionTests(unittest.TestCase):
    def test_beginner_plan_reads_list_from_one_line_and_varies_by_batch(self):
        spec = beginner_list_spec(batch_index=1)
        self.assertEqual(spec.execution["mode"], "stdio")
        self.assertTrue({"for", "while", "function", "class"} <= set(spec.forbidden_constructs))
        self.assertIn("input().split()", spec.target_sub_skills[0])
        focuses = {beginner_list_spec(batch_index=i).target_sub_skills[0] for i in range(1, 6)}
        self.assertEqual(len(focuses), 5)

    def test_generator_guidance_forbids_n_then_n_lines_format(self):
        client = Capture()
        ExerciseGeneratorAgent(client).generate(beginner_list_spec())
        guidance = " ".join(client.payload["generation_guidance"])
        self.assertIn("MỘT dòng", guidance)
        self.assertIn("BÀI LIST", guidance)
        self.assertNotIn("BÀI SET", guidance)

    def test_for_repair_guidance_is_not_set_specific_for_list(self):
        client = Capture()
        ExerciseGeneratorAgent(client).generate(
            beginner_list_spec(), {"errors": ["Đặc tả cấm dùng vòng lặp for, nhưng reference_solution lại dùng for."]})
        guidance = " ".join(client.payload["generation_guidance"])
        self.assertIn("Lần trước bị từ chối", guidance)
        self.assertNotIn("phép toán tập hợp", guidance)

    def test_regression_candidate_passes_static_checks_and_expected_outputs(self):
        spec = beginner_list_spec()
        self.assertTrue(SchemaValidator.validate(DRAFT, spec)[0], SchemaValidator.validate(DRAFT, spec)[1])
        self.assertTrue(AstConstraintValidator.validate(DRAFT, spec)[0])
        for case in DRAFT["test_cases"]:
            execution = subprocess.run([sys.executable, "-c", SOURCE], input=case["input"],
                                       text=True, capture_output=True, timeout=5, check=True)
            self.assertEqual(execution.stdout.strip(), case["expected_output"])

    def test_pipeline_reports_all_static_errors_and_regenerates_without_old_draft(self):
        class ListRouter:
            def __init__(self, *_):
                pass
            def exact_catalog_exercise(self, *_):
                return None
            def has_conflicting_topic_choices(self, *_):
                return False
            def route(self, user_text, context=None, trace_id=None):
                return RoutingDecision(intent="REQUEST_ADAPTIVE_EXERCISE", language="python",
                    topic="PY-LIST-01", topic_match="matched", confirm_prerequisite_override=True,
                    user_text=user_text, trace_id=trace_id)

        class ListClient:
            generation_calls = 0
            second_feedback = None
            def __init__(self):
                self.calls = []
            def remaining(self):
                return 60
            def json(self, stage, system, payload):
                self.calls.append({"stage": stage, "provider": "TEST_DOUBLE", "status": "SUCCEEDED"})
                if stage == "ExerciseGeneratorAgent":
                    self.generation_calls += 1
                    if self.generation_calls == 1:
                        # Schema defect (starter equals reference) AND a forbidden loop.
                        return {**DRAFT, "reference_solution": LOOP_SOURCE, "starter_code": LOOP_SOURCE}
                    self.second_feedback = payload["feedback"]
                    assert payload["previous_draft"] is None
                    return DRAFT
                if stage == "ExplanationTutorAgent":
                    return {"reply": ("Danh sách lưu nhiều phần tử theo thứ tự. Phương thức insert chèn "
                                      "phần tử vào vị trí chỉ định trong danh sách. ") * 10, "source_ids": []}
                if stage == "CriticEvaluatorAgent":
                    return {"is_approved": True, "theory_approved": True, "exercise_approved": True,
                            "compatibility_approved": True, "score": .9, "feedback_target": "NONE",
                            "feedback": "Bài List và lý thuyết phù hợp.", "evidence": ["Nghiệm mẫu dùng insert"],
                            "theory_feedback": None, "exercise_feedback": None}
                raise AssertionError(stage)

        class VerifiedSandbox:
            @staticmethod
            def validate(draft, spec, timeout=40):
                assert draft["reference_solution"] == SOURCE
                return True, [], [{"passed": True, "executed": True, "is_hidden": case["is_hidden"]}
                                  for case in draft["test_cases"]]

        client = ListClient()
        pending = {"type": "PREREQUISITE_OVERRIDE", "language": "python",
                   "target_concept_id": "PY-LIST-01", "exercise_count": 1, "exercise_count_confirmed": True,
                   "original_user_request": "tôi muốn học List trong python"}
        with patch("app.orchestrator.flows.routing.IntentRouterAgent", ListRouter):
            report = AdaptiveLearningOrchestrator(lambda: client, VerifiedSandbox).process_turn(
                "learner", [{"sender": "USER", "content": "Vẫn tạo bài Thao tác CRUD trên List (Danh sách) cho tôi"}],
                learner_context={"states": {}, "language": "python", "pending_confirmation": pending})
        self.assertEqual(report["status"], "SUCCEEDED", report.get("error"))
        self.assertEqual(client.generation_calls, 2)
        errors = " ".join(client.second_feedback["errors"])
        self.assertIn("starter_code trùng reference_solution", errors)
        self.assertIn("vòng lặp for", errors)


if __name__ == "__main__":
    unittest.main()
