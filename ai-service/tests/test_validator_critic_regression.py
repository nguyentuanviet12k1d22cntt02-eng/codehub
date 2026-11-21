"""Regression tests from the 2026-11-21 production run (practice batch of 5 List exercises).

L1: ``starter_code`` with fill-in blanks (``items = ``) was rejected as a syntax error
    of the reference solution, three repair turns in a row.
L2: the independent Critic rejected position 1 of a batch because user_request said
    "5 bài tập" while one artifact was reviewed.
"""
import unittest

from app.agents.critic_evaluator_agent import CriticEvaluatorAgent
from app.contracts.specification import ExerciseSpecification
from app.validation.ast_constraint_validator import AstConstraintValidator

REFERENCE = "items = input().split()\nvalue = input()\nitems.append(value)\nprint(' '.join(items))"


def list_spec(**kwargs):
    return ExerciseSpecification(target_concept="PY-LIST-01", language="python",
                                 forbidden_constructs=["for", "while"], **kwargs)


class StarterCodeTests(unittest.TestCase):
    def validate(self, starter, reference=REFERENCE):
        return AstConstraintValidator.validate({"reference_solution": reference, "starter_code": starter},
                                               list_spec())

    def test_fill_in_blanks_are_not_a_syntax_error(self):
        starter = "# Đọc danh sách\nitems = \n\n# Đọc giá trị\nvalue = \n\n# In kết quả\n"
        ok, errors = self.validate(starter)
        self.assertTrue(ok, errors)

    def test_incomplete_starter_still_rejects_a_forbidden_loop(self):
        ok, errors = self.validate("items = \nfor x in items:\n    pass\n")
        self.assertFalse(ok)
        self.assertTrue(any("Mã khung dùng 'for'" in e for e in errors), errors)

    def test_loop_word_inside_a_comment_or_string_is_allowed(self):
        starter = "items = \n# không dùng for hay while\nmsg = 'for while'\n"
        ok, errors = self.validate(starter)
        self.assertTrue(ok, errors)

    def test_complete_starter_keeps_the_full_ast_check(self):
        ok, errors = self.validate("items = input().split()\nwhile True:\n    break\n")
        self.assertFalse(ok)
        self.assertTrue(any("while" in e for e in errors), errors)

    def test_a_broken_reference_is_still_reported(self):
        ok, errors = self.validate("items = \n", reference="items = input().split(\n")
        self.assertFalse(ok)
        self.assertTrue(any("reference_solution" in e for e in errors), errors)
        self.assertFalse(any(e.startswith("starter_code:") for e in errors), errors)


class CriticBatchViewTests(unittest.TestCase):
    def view(self, request, **evidence):
        spec = ExerciseSpecification(target_concept="PY-LIST-01", user_request=request, learner_evidence=evidence)
        return CriticEvaluatorAgent._critic_spec(spec)

    def test_quantity_is_replaced_by_the_batch_position(self):
        data = self.view("Cho tôi 5 bài tập về List trong Python", batch_total=5, batch_index=1)
        self.assertNotIn("5 bài", data["user_request"])
        self.assertIn("bài 1/5", data["user_request"])
        self.assertIn("List", data["user_request"])

    def test_word_quantities_are_replaced_too(self):
        data = self.view("cho mình năm bài tập về list", batch_total=5, batch_index=3)
        self.assertNotIn("năm bài", data["user_request"])
        self.assertIn("bài 3/5", data["user_request"])

    def test_single_exercise_request_is_untouched(self):
        request = "Cho tôi 1 bài tập về List"
        self.assertEqual(self.view(request)["user_request"], request)
        self.assertEqual(self.view(request, batch_total=1)["user_request"], request)

    def test_original_spec_is_not_mutated(self):
        spec = ExerciseSpecification(target_concept="PY-LIST-01", user_request="5 bài tập List",
                                     learner_evidence={"batch_total": 5, "batch_index": 2})
        CriticEvaluatorAgent._critic_spec(spec)
        self.assertEqual(spec.user_request, "5 bài tập List")

    def test_critic_receives_the_sanitized_request(self):
        seen = {}

        class FakeClient:
            def json(self, name, prompt, payload):
                seen["request"] = payload["specification"]["user_request"]
                return {"is_approved": True, "theory_approved": True, "exercise_approved": True,
                        "compatibility_approved": True, "score": 0.95, "feedback_target": "NONE",
                        "feedback": "Bài tập đạt yêu cầu.", "evidence": ["Đã đối chiếu đặc tả."]}

        spec = ExerciseSpecification(target_concept="PY-LIST-01", user_request="Cho tôi 5 bài tập về List",
                                     execution={"comparator": "text"},
                                     learner_evidence={"batch_total": 5, "batch_index": 1})
        review = CriticEvaluatorAgent(FakeClient()).evaluate_content("Lý thuyết", {"title": "x"}, spec)
        self.assertTrue(review["is_approved"])
        self.assertNotIn("5 bài", seen["request"])


if __name__ == "__main__":
    unittest.main()
