"""Regression for PY-DICT-01 when loops are not verified (production, 2026-11-21).

A 3-exercise Dictionary batch stopped at 2/3: position 3 failed REPAIR_LIMIT_REACHED
(too few test cases, `for` used twice although forbidden, one wrong expected_output).
PY-DICT-01 had no loop-free guidance, unlike PY-LIST-01.
"""
import subprocess
import sys
import unittest

from app.agents.adaptive_exercise_planner import AdaptiveExercisePlanner
from app.agents.exercise_generator_agent import ExerciseGeneratorAgent
from app.agents.prerequisite_advisor_agent import PrerequisiteAdvisorAgent
from app.contracts.routing import RoutingDecision
from app.services.knowledge_graph_service import KnowledgeGraphService
from app.validation.ast_constraint_validator import AstConstraintValidator

SOURCE = "k1, v1 = input().split()\nk2, v2 = input().split()\nd = {k1: v1, k2: v2}\nkey = input()\nprint(d[key])"


def beginner_dict_spec(batch_index=None):
    graph = KnowledgeGraphService()
    routing = RoutingDecision(intent="REQUEST_ADAPTIVE_EXERCISE", language="python", topic="PY-DICT-01",
                              topic_match="matched", user_text="Vẫn tạo bài Cú pháp Key-Value cho tôi")
    readiness = PrerequisiteAdvisorAgent(graph).assess("python", "PY-DICT-01", {"states": {}})
    context = {"states": {}, "readiness_assessment": readiness, "force_prerequisite_override": True}
    if batch_index:
        context.update(batch_index=batch_index, batch_total=5)
    return AdaptiveExercisePlanner(graph).plan_exercise(routing, "learner", "PY-DICT-01", context)


class Capture:
    payload = None

    def json(self, stage, system, payload):
        self.payload = payload
        return {}


class DictGenerationRegressionTests(unittest.TestCase):
    def test_plan_forbids_loops_and_varies_focus_by_batch_position(self):
        spec = beginner_dict_spec(batch_index=1)
        self.assertTrue({"for", "while"} <= set(spec.forbidden_constructs))
        self.assertIn("cố định", spec.target_sub_skills[0])
        focuses = {beginner_dict_spec(batch_index=i).target_sub_skills[0] for i in range(1, 6)}
        self.assertEqual(len(focuses), 5)

    def test_generator_guidance_describes_a_fixed_size_loop_free_dictionary(self):
        client = Capture()
        try:
            ExerciseGeneratorAgent(client).generate(beginner_dict_spec())
        except Exception:
            pass
        guidance = " ".join(client.payload["generation_guidance"])
        self.assertIn("BÀI DICTIONARY", guidance)
        self.assertIn("CỐ ĐỊNH", guidance)
        self.assertIn("4 test_cases", guidance)
        self.assertNotIn("BÀI LIST", guidance)

    def test_reference_without_loops_passes_the_constraint_check(self):
        spec = beginner_dict_spec()
        draft = {"reference_solution": SOURCE,
                 "starter_code": "k1, v1 = input().split()\nk2, v2 = input().split()\nd = \nkey = input()\n"}
        ok, errors = AstConstraintValidator.validate(draft, spec)
        self.assertTrue(ok, errors)
        out = subprocess.run([sys.executable, "-c", SOURCE], input="a 1\nb 2\nb\n", text=True,
                             capture_output=True, timeout=5, check=True).stdout.strip()
        self.assertEqual(out, "2")

    def test_loop_in_reference_is_still_rejected(self):
        spec = beginner_dict_spec()
        draft = {"reference_solution": "d = {}\nfor i in range(2):\n    k, v = input().split()\n    d[k] = v\nprint(d)",
                 "starter_code": "d = {}\n"}
        ok, errors = AstConstraintValidator.validate(draft, spec)
        self.assertFalse(ok)
        self.assertTrue(any("for" in e for e in errors), errors)

    def test_list_and_set_guidance_are_unchanged(self):
        for concept, marker in (("PY-LIST-01", "BÀI LIST"), ("PY-SET-01", "BÀI SET")):
            spec = beginner_dict_spec().model_copy(update={"target_concept": concept})
            client = Capture()
            try:
                ExerciseGeneratorAgent(client).generate(spec)
            except Exception:
                pass
            guidance = " ".join(client.payload["generation_guidance"])
            self.assertIn(marker, guidance)
            self.assertNotIn("BÀI DICTIONARY", guidance)


if __name__ == "__main__":
    unittest.main()
