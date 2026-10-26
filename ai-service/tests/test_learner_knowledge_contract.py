"""Exercise contracts must not make the grading harness a hidden prerequisite."""
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.agents.adaptive_exercise_planner import AdaptiveExercisePlanner
from app.agents.critic_evaluator_agent import CriticEvaluatorAgent
from app.contracts.routing import RoutingDecision
from app.validation.schema_validator import SchemaValidator
from app.validation.ast_constraint_validator import AstConstraintValidator


def route(language, topic, user_text="Tạo bài thực hành"):
    return RoutingDecision(intent="REQUEST_ADAPTIVE_EXERCISE", language=language,
                           topic=topic, user_text=user_text)


def stdio_draft(code="score = float(input())\nif score >= 8:\n    print('Giỏi')\nelse:\n    print('Khác')"):
    return {
        "title": "Phân loại điểm thi bằng điều kiện",
        "problem_statement": "Đọc một điểm thi từ đầu vào rồi in ra Giỏi khi điểm từ 8 trở lên, "
                             "nếu không thì in Khác. Chỉ dùng câu lệnh điều kiện if/else và print.",
        "quick_theory": "Câu lệnh if/else chọn một trong hai nhánh dựa trên điều kiện.",
        "starter_code": "score = float(input())\n# Viết if/else ở đây",
        "reference_solution": code,
        "test_cases": [
            {"input": value, "expected_output": expected, "is_hidden": index >= 2,
             "category": "boundary" if index == 2 else "normal", "explanation": "Kiểm tra nhánh điều kiện."}
            for index, (value, expected) in enumerate((("9", "Giỏi"), ("4", "Khác"),
                                                        ("8", "Giỏi"), ("7", "Khác")))
        ],
        "hints": {"scaffold_1_conceptual": "So sánh điểm với 8.",
                  "scaffold_2_syntax": "Dùng if và else để chọn nhánh.",
                  "scaffold_3_pseudocode": "Đọc điểm, so sánh rồi in kết quả."},
        "constraints": ["Không dùng hàm tự định nghĩa."],
        "common_pitfall_warning": "Nhớ dấu hai chấm và thụt lề."
    }


class LearnerKnowledgeContractTests(unittest.TestCase):
    def test_unlearned_functions_do_not_leak_into_if_else_exercise(self):
        spec = AdaptiveExercisePlanner().plan_exercise(route("python", "PY-FLOW-01"), "learner",
            learner_context={"states": {"PY-BASICS-03": {"mastery": .8, "attempts": 4, "confidence": .7}}})
        self.assertEqual(spec.execution["mode"], "stdio")
        self.assertEqual(spec.execution["comparator"], "text")
        self.assertTrue(spec.learner_evidence["avoid_function_syntax"])
        self.assertTrue({"for", "while", "function", "class"}.issubset(spec.forbidden_constructs))
        self.assertTrue(SchemaValidator.validate(stdio_draft(), spec)[0])
        invalid = stdio_draft("def solution(score):\n    return 'Giỏi'")
        passed, errors = SchemaValidator.validate(invalid, spec)
        self.assertFalse(passed)
        self.assertTrue(any("chưa học hàm" in error for error in errors))
        loop_draft = stdio_draft("score = float(input())\nfor item in range(1):\n    print(score)")
        self.assertFalse(AstConstraintValidator.validate(loop_draft, spec)[0])
        invalid_description = stdio_draft()
        invalid_description["problem_statement"] += " Hãy viết hàm solution(score)."
        self.assertFalse(SchemaValidator.validate(invalid_description, spec)[0])
        review = CriticEvaluatorAgent(client=object()).evaluate_content(
            "Ví dụ:\n```python\ndef solution(score):\n    return score\n```", stdio_draft(), spec)
        self.assertEqual(review["feedback_target"], "THEORY")

    def test_function_lesson_or_evidence_can_use_function_contract(self):
        planner = AdaptiveExercisePlanner()
        function_lesson = planner.plan_exercise(route("python", "PY-FUNC-01"), "learner")
        self.assertEqual(function_lesson.execution["mode"], "function")
        experienced = planner.plan_exercise(route("python", "PY-FLOW-01"), "learner",
            learner_context={"states": {"PY-FUNC-01": {"mastery": .8, "attempts": 4, "confidence": .7}}})
        self.assertEqual(experienced.execution["mode"], "function")

    def test_javascript_early_topic_uses_stdio_but_hof_remains_function_topic(self):
        planner = AdaptiveExercisePlanner()
        self.assertEqual(planner.plan_exercise(route("javascript", "JS-COND-01"), "learner")
                         .execution["mode"], "stdio")
        self.assertEqual(planner.plan_exercise(route("javascript", "JS-ARRAY-HOF-01"), "learner")
                         .execution["mode"], "function")

    def test_named_cpp_for_loop_cannot_be_replaced_with_while(self):
        spec = AdaptiveExercisePlanner().plan_exercise(
            route("cpp", "CPP-LOOP-01", "Tạo bài tập vòng lặp For trong C++"), "learner")
        self.assertIn("for", spec.required_constructs)
        self.assertIn("while", spec.forbidden_constructs)
        self.assertEqual(spec.difficulty, "EASY")
        draft = {"reference_solution": "int main(){ while (false) {} }",
                 "starter_code": "int main(){ /* TODO */ }"}
        passed, errors = AstConstraintValidator.validate(draft, spec)
        self.assertFalse(passed)
        self.assertTrue(any("for" in error for error in errors))
        self.assertTrue(any("while" in error for error in errors))
        draft["reference_solution"] = "int main(){ for (int i=0;i<3;i++) {} }"
        draft["starter_code"] = "int main(){ while (false) {} }"
        self.assertFalse(AstConstraintValidator.validate(draft, spec)[0])
        draft["starter_code"] = "int main(){ /* TODO */ }"
        self.assertTrue(AstConstraintValidator.validate(draft, spec)[0])
        described = stdio_draft()
        described["problem_statement"] = (
            "Đọc một số nguyên từ bàn phím, xử lý dữ liệu theo đúng yêu cầu của bài tập "
            "và sử dụng while để in kết quả cuối cùng ra màn hình.")
        described["constraints"] = ["Bài tập vòng lặp for."]
        self.assertTrue(any("dù đặc tả cấm" in error for error in SchemaValidator.validate(described, spec)[1]))
        described["problem_statement"] = (
            "Đọc một số nguyên từ bàn phím, xử lý dữ liệu theo đúng yêu cầu của bài tập "
            "và dùng for để in kết quả cuối cùng. Không được sử dụng while.")
        self.assertTrue(SchemaValidator.validate(described, spec)[0])

    def test_loop_method_is_only_locked_when_specific_syntax_is_named(self):
        planner = AdaptiveExercisePlanner()
        generic = planner.plan_exercise(route("cpp", "CPP-LOOP-01", "Tạo bài tập về vòng lặp C++"), "learner")
        self.assertNotIn("for", generic.required_constructs)
        self.assertNotIn("while", generic.forbidden_constructs)
        named = planner.plan_exercise(route("javascript", "JS-LOOP-01", "Luyện vòng lặp while trong JavaScript"), "learner")
        self.assertIn("while", named.required_constructs)
        self.assertIn("for", named.forbidden_constructs)


if __name__ == "__main__":
    unittest.main()
