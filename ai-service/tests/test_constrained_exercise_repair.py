"""Recorded failure shapes; these local test doubles are not live QA evidence."""

import copy
import unittest
from types import SimpleNamespace
from app.agents.exercise_generator_agent import ExerciseGeneratorAgent
from app.agents.exercise_repair_agent import repair_strategy
from app.orchestrator.adaptive_learning_orchestrator import AdaptiveLearningOrchestrator
from app.pipeline.llm_client import PipelineError
from app.pipeline.problem_statement import format_statement, sections
from app.validation.schema_validator import SchemaValidator
from tests.test_pipeline_v3 import Client, STDIO_DRAFT


def spec():
    data = {"language": "python", "target_concept": "PY-BASICS-03", "execution": {"mode": "stdio"},
            "required_constructs": [], "forbidden_constructs": [], "learner_evidence": {}, "test_constraints": {}}
    result = SimpleNamespace(**data)
    result.model_dump = lambda: {key: value for key, value in vars(result).items() if key != "model_dump"}
    return result


def candidate():
    value = copy.deepcopy(STDIO_DRAFT)
    value["problem_statement"] = format_statement(value, "stdio")
    value["statement_format_version"] = 2
    return value


def mismatch_feedback(value):
    cases = [{"case_index": index + 1, "status": "SUCCESS", "executed": True,
              "passed": index != 3, "input": case["input"], "expected": case["expected_output"],
              "actual": "-2" if index == 3 else case["expected_output"], "is_hidden": case["is_hidden"]}
             for index, case in enumerate(value["test_cases"])]
    return {"validation_stage": "SandboxValidator", "passed": False,
            "errors": ["Test #4: SUCCESS OUTPUT_MISMATCH"], "test_results": cases}


class ConstrainedRepairTests(unittest.TestCase):
    def test_live_regression_missing_for_in_wording_does_not_regenerate_task(self):
        value = candidate()
        target = spec()
        target.target_concept = "PY-FLOW-03"
        target.required_constructs = ["for"]
        value["reference_solution"] = "n=int(input())\nresult=0\nfor _ in range(2):\n    result+=n\nprint(result)"
        original = copy.deepcopy(value)
        feedback = {"validation_stage": "SchemaValidator", "errors": SchemaValidator.validate(value, target)[1]}
        self.assertEqual(feedback["errors"], ["Đề bài phải nói rõ học viên cần luyện vòng lặp for."])
        self.assertEqual(repair_strategy(value, feedback, target), "STATEMENT_ONLY")
        class Editor:
            def json(self, *_args):
                return {"diagnosis": "Mã dùng for nhưng đề quên nêu kỹ thuật bắt buộc.", "title": value["title"],
                        "problem_statement": {"description_sentences": ["Đọc một số nguyên n.",
                            "Dùng vòng lặp for để tính và in giá trị gấp đôi của n."],
                            "input": "Một số nguyên n.", "output": "Số nguyên gấp đôi n."}}
        fixed = ExerciseGeneratorAgent(Editor()).generate(target, feedback, value)
        self.assertTrue(SchemaValidator.validate(fixed, target)[0])
        self.assertEqual(fixed["reference_solution"], original["reference_solution"])
        self.assertEqual(fixed["test_cases"], original["test_cases"])

    def test_statement_repair_cannot_replace_code_or_tests(self):
        value = candidate()
        value["problem_statement"] = value["problem_statement"].replace(
            "Đọc một số nguyên n từ đầu vào chuẩn. In giá trị gấp đôi của n, kể cả khi n âm hoặc bằng không.",
            "Đọc một số nguyên và in giá trị gấp đôi.")
        original = copy.deepcopy(value)
        feedback = {"validation_stage": "SchemaValidator", "errors": SchemaValidator.validate(value)[1]}
        self.assertEqual(repair_strategy(value, feedback, spec()), "STATEMENT_ONLY")

        class Editor:
            def json(self, _stage, _system, payload):
                assert "reference_solution" not in payload
                assert "test_cases" not in payload
                return {"diagnosis": "Mô tả trước chỉ có một câu thay vì hai câu.", "title": value["title"],
                        "problem_statement": {"description_sentences": ["Đọc một số nguyên n.", "In giá trị gấp đôi của n."],
                                              "input": "Một số nguyên n.", "output": "Số nguyên gấp đôi n."}}

        fixed = ExerciseGeneratorAgent(Editor()).generate(spec(), feedback, value)
        self.assertTrue(SchemaValidator.validate(fixed)[0])
        self.assertEqual(value, original)
        for key in value:
            if key not in ("title", "problem_statement"):
                self.assertEqual(fixed[key], value[key], key)

    def test_expected_repair_preserves_task_source_and_every_input(self):
        value = candidate()
        value["test_cases"][3]["expected_output"] = "-3"

        class Editor:
            def json(self, _stage, _system, payload):
                assert payload["failed_tests"][0]["case_index"] == 4
                return {"diagnosis": "Test số âm tính sai: nhân âm một với hai bằng âm hai.",
                        "action": "test_expectations", "expected_outputs": [
                            {"case_index": 4, "expected_output": "-2", "explanation": "Âm một nhân hai bằng âm hai."}]}

        fixed = ExerciseGeneratorAgent(Editor()).generate(spec(), mismatch_feedback(value), value)
        self.assertEqual(fixed["reference_solution"], value["reference_solution"])
        self.assertEqual(fixed["problem_statement"], value["problem_statement"])
        self.assertEqual(fixed["test_cases"][:3], value["test_cases"][:3])
        self.assertEqual(fixed["test_cases"][3]["input"], value["test_cases"][3]["input"])
        self.assertEqual(fixed["test_cases"][3]["expected_output"], "-2")

    def test_public_expected_repair_refreshes_example_without_altering_task(self):
        value = candidate()
        feedback = mismatch_feedback(value)
        for item in feedback["test_results"]:
            item["passed"] = item["case_index"] != 1
        class Editor:
            def json(self, *_args):
                return {"diagnosis": "Đáp án công khai tính sai phép nhân đã nêu trong đề.",
                        "action": "test_expectations", "expected_outputs": [
                            {"case_index": 1, "expected_output": "2\n", "explanation": "Một nhân hai bằng hai."}]}
        fixed = ExerciseGeneratorAgent(Editor()).generate(spec(), feedback, value)
        self.assertEqual(sections(fixed["problem_statement"])["Mô tả"], sections(value["problem_statement"])["Mô tả"])
        self.assertTrue(SchemaValidator.validate(fixed)[0])

    def test_out_of_scope_duplicate_and_mixed_repairs_are_rejected(self):
        value = candidate()
        patch = {"diagnosis": "Đáp án của test thứ tư không khớp phép nhân trong đề.",
                 "action": "test_expectations", "expected_outputs": [
                     {"case_index": 4, "expected_output": "-9", "explanation": "Đáp án đang được sửa."}]}
        invalid = [{**patch, "problem_statement": "Bài toán khác"},
                   {**patch, "reference_solution": "print(0)"},
                   {**patch, "expected_outputs": [patch["expected_outputs"][0]] * 2},
                   {**patch, "expected_outputs": [{**patch["expected_outputs"][0], "case_index": 1}]},
                   {**patch, "action": "cannot_repair"}]
        for response in invalid:
            with self.subTest(response=response):
                class Editor:
                    def json(self, *_args):
                        return response
                with self.assertRaises(PipelineError) as error:
                    ExerciseGeneratorAgent(Editor()).generate(spec(), mismatch_feedback(value), value)
                self.assertEqual(error.exception.code, "REPAIR_SCOPE_INVALID")

    def test_infrastructure_failure_is_not_reclassified_as_bad_expected(self):
        value = candidate()
        feedback = mismatch_feedback(value)
        feedback["test_results"][3].update(status="INFRA_ERROR", executed=False)
        self.assertEqual(repair_strategy(value, feedback, spec()), "GENERATE")

    def test_full_workflow_revalidates_narrow_patch_before_publication(self):
        self._workflow(expected="-2", success=True)

    def test_same_failed_narrow_repair_stops_instead_of_repeating(self):
        self._workflow(expected="-4", success=False)

    def test_final_error_identifies_critic_not_an_earlier_validator(self):
        from tests.test_pipeline_v3 import Sandbox, REVIEW
        class Rejected(Client):
            def json(self, stage, system, data):
                if stage == "CriticEvaluatorAgent":
                    return {**REVIEW, "is_approved": False, "exercise_approved": False,
                            "feedback_target": "EXERCISE", "feedback": "Test biên không khớp với phạm vi Input của đề."}
                return super().json(stage, system, data)
        report = AdaptiveLearningOrchestrator(Rejected, Sandbox).process_turn(
            "qa", [{"sender": "USER", "content": "Tạo 1 bài Python"}])
        self.assertEqual(report["error"]["code"], "REPAIR_LIMIT_REACHED")
        self.assertEqual(report["error"]["details"]["failed_stage"], "CriticEvaluatorAgent")
        self.assertIsNone(report["exercise"])

    def _workflow(self, expected, success):
        class RepairClient(Client):
            def json(self, stage, system, data):
                if stage == "ExerciseGeneratorAgent":
                    self.exercise_calls += 1
                    self.calls.append({"stage": stage, "status": "SUCCEEDED", "provider": "TEST_DOUBLE"})
                    if self.exercise_calls == 1:
                        value = candidate()
                        value["test_cases"][3]["expected_output"] = "-3"
                        return value
                    assert self.exercise_calls == 2
                    assert "failed_tests" in data
                    return {"diagnosis": "Đáp án test số âm sai phép nhân trong đề.", "action": "test_expectations",
                            "expected_outputs": [{"case_index": 4, "expected_output": expected,
                                                  "explanation": "Tính lại tích của số âm và hai."}]}
                return super().json(stage, system, data)

        class Sandbox:
            invocations = 0
            @staticmethod
            def validate(value, _spec, timeout=40):
                Sandbox.invocations += 1
                check = mismatch_feedback(value)
                passed = value["test_cases"][3]["expected_output"] == "-2"
                if passed:
                    for item in check["test_results"]:
                        item["passed"] = True
                return passed, [] if passed else check["errors"], check["test_results"]

        client = RepairClient()
        report = AdaptiveLearningOrchestrator(lambda: client, Sandbox).process_turn(
            "qa", [{"sender": "USER", "content": "Tạo 1 bài Python"}])
        self.assertEqual(client.exercise_calls, 2)
        self.assertEqual(Sandbox.invocations, 2)
        gates = [step for step in report["agent_traces"] if step["agent"] == "PublicationGate"]
        if success:
            self.assertEqual(report["status"], "SUCCEEDED", report.get("error"))
            self.assertEqual(len(gates), 1)
            self.assertEqual(report["exercise"]["test_cases"][3]["expected_output"], "-2")
        else:
            self.assertEqual(report["error"]["code"], "REPAIR_NOT_RESOLVED")
            self.assertEqual(gates, [])
            self.assertIsNone(report["exercise"])


if __name__ == "__main__":
    unittest.main()
