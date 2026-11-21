"""Test plan reviews/exercise-generation-test-2026-11-21, group A gaps (A4, A9, A14).

The other group-A cases are covered by existing tests; the plan file maps each
case to its test.
"""
import unittest

from app.agents.adaptive_exercise_planner import AdaptiveExercisePlanner
from app.agents.exercise_generator_agent import ExerciseGeneratorAgent
from app.agents.prerequisite_advisor_agent import PrerequisiteAdvisorAgent
from app.contracts.routing import RoutingDecision
from app.contracts.specification import ExerciseSpecification
from app.services.knowledge_graph_service import KnowledgeGraphService
from app.validation.ast_constraint_validator import AstConstraintValidator
from tests.test_list_generation_regression import DRAFT


def beginner_spec(concept):
    graph = KnowledgeGraphService()
    routing = RoutingDecision(intent="REQUEST_ADAPTIVE_EXERCISE", language="python", topic=concept,
                              topic_match="matched", user_text=f"Vẫn tạo bài {concept} cho tôi")
    readiness = PrerequisiteAdvisorAgent(graph).assess("python", concept, {"states": {}})
    return AdaptiveExercisePlanner(graph).plan_exercise(routing, "learner", concept, {
        "states": {}, "readiness_assessment": readiness, "force_prerequisite_override": True})


class Capture:
    payload = None

    def json(self, stage, system, payload):
        self.payload = payload
        return DRAFT


def guidance_for(spec, feedback=None):
    client = Capture()
    ExerciseGeneratorAgent(client).generate(spec, feedback)
    return " ".join(client.payload["generation_guidance"])


class A4NoLoopGuidanceByTopic(unittest.TestCase):
    def test_other_topic_gets_the_generic_one_line_guidance_only(self):
        spec = beginner_spec("PY-DICT-01")
        self.assertTrue({"for", "while"} <= set(spec.forbidden_constructs))
        guidance = guidance_for(spec)
        self.assertIn("NGƯỜI HỌC CHƯA HỌC VÒNG LẶP", guidance)
        self.assertNotIn("BÀI LIST", guidance)
        self.assertNotIn("BÀI SET", guidance)

    def test_set_keeps_its_own_guidance_without_the_generic_one(self):
        guidance = guidance_for(beginner_spec("PY-SET-01"))
        self.assertIn("BÀI SET", guidance)
        self.assertNotIn("NGƯỜI HỌC CHƯA HỌC VÒNG LẶP", guidance)

    def test_learner_who_knows_loops_gets_no_no_loop_guidance(self):
        spec = beginner_spec("PY-LIST-01").model_copy(update={"forbidden_constructs": ["class"]})
        self.assertNotIn("CHƯA HỌC VÒNG LẶP", guidance_for(spec))


class A9CriticRejectionRegenerates(unittest.TestCase):
    def test_content_rejection_asks_for_a_new_task_not_a_patch(self):
        guidance = guidance_for(beginner_spec("PY-LIST-01"), {
            "feedback_target": "EXERCISE", "exercise_feedback": "Bài không luyện insert.", "errors": []})
        self.assertIn("Đổi hẳn bài toán", guidance)


def spec_for(language, required=(), forbidden=()):
    return ExerciseSpecification.model_validate({
        **beginner_spec("PY-LIST-01").model_dump(), "language": language,
        "required_constructs": list(required), "forbidden_constructs": list(forbidden)})


class A14OtherLanguageConstructs(unittest.TestCase):
    def check(self, language, code, required=(), forbidden=()):
        return AstConstraintValidator.validate({"reference_solution": code}, spec_for(language, required, forbidden))

    def test_javascript_forbidden_for_and_function(self):
        ok, errors = self.check("javascript", "const a = [1, 2];\nfor (let i = 0; i < 2; i++) console.log(a[i]);", forbidden=["for"])
        self.assertFalse(ok)
        self.assertIn("for", " ".join(errors))
        ok, _ = self.check("javascript", "const twice = (n) => n * 2;", forbidden=["function"])
        self.assertFalse(ok, "an arrow function is still a function")
        ok, _ = self.check("javascript", "// for (x) in a comment\nconsole.log('for (')", forbidden=["for"])
        self.assertTrue(ok, "comments and strings are not code")

    def test_javascript_required_method(self):
        ok, _ = self.check("javascript", "console.log([1, 2].map(x => x * 2));", required=["map"])
        self.assertTrue(ok)
        ok, _ = self.check("javascript", "console.log([1, 2]);", required=["reduce"])
        self.assertFalse(ok)

    def test_cpp_vector_iterator_and_pointer_rules(self):
        vector_code = "#include <vector>\nint main(){ std::vector<int> v{1}; return v.size(); }"
        self.assertTrue(self.check("cpp", vector_code, required=["vector"])[0])
        self.assertFalse(self.check("cpp", "int main(){ int a[2]; return 0; }", required=["vector"])[0])
        self.assertFalse(self.check("cpp", "int main(){ int x=1; int* p=&x; return *p; }", forbidden=["pointer"])[0])
        iterator_code = "#include <vector>\nint main(){ std::vector<int> v; for (auto it = v.begin(); it != v.end(); ++it){} }"
        self.assertFalse(self.check("cpp", iterator_code, forbidden=["iterator"])[0])
        self.assertFalse(self.check("cpp", "int main(){ while (true) break; }", forbidden=["while"])[0])

    def test_python_rejects_syntax_errors_with_the_line(self):
        ok, errors = self.check("python", "items = input().split(\nprint(items)")
        self.assertFalse(ok)
        self.assertIn("SyntaxError", errors[0])


if __name__ == "__main__":
    unittest.main()
