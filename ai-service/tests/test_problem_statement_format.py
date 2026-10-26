"""The displayed example must be derived from, not independent of, public tests."""

import copy
import sys
import unittest
from pathlib import Path
from types import SimpleNamespace

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.agents.exercise_generator_agent import ExerciseGeneratorAgent
from app.pipeline.problem_statement import format_statement, validate_statement
from app.pipeline.contracts import ExerciseDraft
from app.validation.schema_validator import SchemaValidator


def draft():
    return {
        "title": "Đếm từ chung",
        "problem_statement": "## Mô tả\nĐọc hai dòng chứa các từ. In số từ khác nhau xuất hiện ở cả hai dòng.\n\n"
                             "## Input\nHai dòng văn bản, mỗi dòng gồm các từ cách nhau bởi dấu cách.\n\n"
                             "## Output\nMột số nguyên là số từ chung khác nhau.",
        "quick_theory": "Tập hợp loại bỏ các từ lặp và cho phép lấy phần giao.",
        "starter_code": "# TODO: đọc hai dòng và in kết quả",
        "reference_solution": "a=set(input().split())\nb=set(input().split())\nprint(len(a & b))",
        "test_cases": [
            {"input": "a b a\nb c\n", "expected_output": "1", "is_hidden": False,
             "category": "normal", "explanation": "Một từ chung."},
            {"input": "x y\nz\n", "expected_output": "0", "is_hidden": False,
             "category": "normal", "explanation": "Không có từ chung."},
            {"input": "\n\n", "expected_output": "0", "is_hidden": True,
             "category": "boundary", "explanation": "Hai dòng trống."},
            {"input": "p p\np\n", "expected_output": "1", "is_hidden": True,
             "category": "normal", "explanation": "Từ lặp không tính thêm."},
        ],
        "hints": {"scaffold_1_conceptual": "Tìm các từ chung.",
                  "scaffold_2_syntax": "Có thể dùng tập hợp.",
                  "scaffold_3_pseudocode": "Đọc dữ liệu, lấy giao, in kích thước."},
        "constraints": [],
        "common_pitfall_warning": "Từ lặp chỉ tính một lần.",
    }


class ProblemStatementFormatTests(unittest.TestCase):
    def test_example_is_public_test_not_model_prose(self):
        value = draft()
        value["problem_statement"] += "\n\n## Ví dụ\nInput: sai\nOutput: sai"
        value["problem_statement"] = format_statement(value, "stdio")
        value["statement_format_version"] = 2
        self.assertIn("a b a\nb c", value["problem_statement"])
        self.assertIn("**Output**\n```text\n1", value["problem_statement"])
        self.assertNotIn("Input: sai", value["problem_statement"])
        self.assertTrue(SchemaValidator.validate(value)[0])

    def test_missing_sections_and_edited_example_are_rejected(self):
        value = draft()
        value["statement_format_version"] = 2
        self.assertFalse(SchemaValidator.validate(value)[0])
        value["problem_statement"] = format_statement(value, "stdio").replace("```text\n1\n```", "```text\n2\n```")
        self.assertTrue(any("Ví dụ Input/Output" in error for error in SchemaValidator.validate(value)[1]))

    def test_constraints_only_when_supplied(self):
        value = draft()
        self.assertNotIn("## Ràng buộc", format_statement(value, "stdio"))
        value["constraints"] = ["Phân biệt chữ hoa và chữ thường."]
        value["problem_statement"] = format_statement(value, "stdio")
        value["statement_format_version"] = 2
        self.assertIn("## Ràng buộc", value["problem_statement"])
        self.assertTrue(SchemaValidator.validate(value)[0])

    def test_function_example_preserves_typed_arguments(self):
        value = draft()
        value["test_cases"][0].pop("input")
        value["test_cases"][0]["arguments"] = [[1, 2, 3], 2]
        value["test_cases"][0]["call_style"] = "spread"
        value["test_cases"][0]["expected_output"] = "[2,3,4]"
        value["problem_statement"] = format_statement(value, "function")
        value["statement_format_version"] = 2
        self.assertIn("[[1,2,3],2]", value["problem_statement"])
        self.assertIn("[2,3,4]", value["problem_statement"])
        self.assertEqual([], validate_statement(ExerciseDraft.model_validate(value), "function"))

    def test_sql_example_uses_the_public_fixture_and_expected_rows(self):
        value = draft()
        value["test_cases"][0]["fixture_sql"] = "CREATE TABLE items(x); INSERT INTO items VALUES (1);"
        value["test_cases"][0]["expected_output"] = "[[1]]"
        value["problem_statement"] = format_statement(value, "sql")
        value["statement_format_version"] = 2
        self.assertIn("CREATE TABLE items(x)", value["problem_statement"])
        self.assertIn("**Output**\n```text\n[[1]]", value["problem_statement"])
        self.assertEqual([], validate_statement(ExerciseDraft.model_validate(value), "sql"))

    def test_generator_marks_every_new_draft_for_validation(self):
        class Client:
            def json(self, *_args):
                return copy.deepcopy(draft())

        spec = SimpleNamespace(language="python", execution={"mode": "stdio"},
                               forbidden_constructs=[], target_concept="PY-SET-01",
                               learner_evidence={}, model_dump=lambda: {})
        generated = ExerciseGeneratorAgent(Client()).generate(spec)
        self.assertEqual(generated["statement_format_version"], 2)
        self.assertTrue(SchemaValidator.validate(generated)[0])

    def test_structured_generation_renders_two_sentences_and_public_example(self):
        class Client:
            def json(self, _stage, _system, payload):
                schema = payload["output_schema"]["properties"]["problem_statement"]
                self_schema = schema["properties"]["description_sentences"]
                assert (self_schema["minItems"], self_schema["maxItems"]) == (2, 4)
                return {**draft(), "problem_statement": {
                    "description_sentences": ["Đọc hai dòng chứa các từ.", "In số từ chung khác nhau."],
                    "input": "Hai dòng gồm các từ cách nhau bằng dấu cách.",
                    "output": "Một số nguyên là số từ chung khác nhau."}}

        spec = SimpleNamespace(language="python", execution={"mode": "stdio"},
                               forbidden_constructs=[], target_concept="PY-SET-01",
                               learner_evidence={}, model_dump=lambda: {})
        generated = ExerciseGeneratorAgent(Client()).generate(spec)
        self.assertIsInstance(generated["problem_statement"], str)
        self.assertTrue(SchemaValidator.validate(generated)[0])

    def test_one_sentence_is_still_rejected_not_padded_or_silently_accepted(self):
        value = draft()
        value["problem_statement"] = {
            "description_sentences": ["Đọc hai dòng và in số từ chung khác nhau."],
            "input": "Hai dòng chứa các từ.", "output": "Số từ chung khác nhau."}
        value["problem_statement"] = format_statement(value, "stdio")
        self.assertFalse(SchemaValidator.validate(value)[0])


if __name__ == "__main__":
    unittest.main()
