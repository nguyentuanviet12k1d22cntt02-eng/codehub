import json
import re
import unittest
from pathlib import Path

from app.agents.adaptive_exercise_planner import AdaptiveExercisePlanner
from app.agents.intent_router_agent import IntentRouterAgent
from app.pipeline.grounding import GroundingService
from app.orchestrator.adaptive_learning_orchestrator import AdaptiveLearningOrchestrator
from app.services.knowledge_graph_service import KnowledgeGraphService, TOPIC_ALIASES


ROOT = Path(__file__).resolve().parents[2]
GRAPH_FILES = {
    "python": ROOT / "ai-service/data/pythonSkillGraph.json",
    "javascript": ROOT / "ai-service/data/javascriptSkillGraph.json",
    "cpp": ROOT / "ai-service/data/cppSkillGraph.json",
    "sql": ROOT / "ai-service/data/sqlSkillGraph.json",
}
CONTENT_DIRS = {
    "python": ROOT / "docs/Dữ liệu nội dung bài học/Python",
    "javascript": ROOT / "docs/Dữ liệu nội dung bài học/JS",
    "cpp": ROOT / "docs/Dữ liệu nội dung bài học/C++",
    "sql": ROOT / "docs/Dữ liệu nội dung bài học/SQL",
}


class FailingClient:
    def json(self, *args, **kwargs):
        raise AssertionError("Yêu cầu rõ ràng không được gọi LLM router")


class ConflictingClient:
    def json(self, *args, **kwargs):
        return {"intent": "EXPLAIN_CONCEPT", "language": "javascript", "topic": "JS-OBJECT-01"}


class NeverCalledClient:
    def __init__(self):
        self.calls = []

    def json(self, *args, **kwargs):
        raise AssertionError("Yêu cầu làm rõ chế độ học không được gọi LLM")


class UnknownTopicClient:
    def __init__(self):
        self.calls = []

    def json(self, *args, **kwargs):
        return {
            "intent": "CLARIFY_LEARNING_MODE",
            "language": "javascript",
            "topic": "chu de khong ton tai",
        }


class RouterConceptConsistencyTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.kg = KnowledgeGraphService()

    def test_generic_topics_resolve_to_curriculum_foundations(self):
        cases = [
            ("python", "dict", "PY-DICT-01"),
            ("python", "dictionary", "PY-DICT-01"),
            ("javascript", "object", "JS-OBJECT-01"),
            ("cpp", "vector", "CPP-VECTOR-01"),
            ("sql", "join", "SQL-JOIN-01"),
        ]
        for language, topic, expected in cases:
            with self.subTest(language=language, topic=topic):
                self.assertEqual(self.kg.resolve_concept_by_topic(language, topic), expected)

    def test_generic_learning_request_asks_for_theory_or_practice(self):
        routing = IntentRouterAgent(FailingClient(), self.kg).route("Tôi muốn học Dictionary trong Python")
        self.assertEqual(routing.intent, "CLARIFY_LEARNING_MODE")
        self.assertEqual(routing.topic, "PY-DICT-01")

        result = AdaptiveLearningOrchestrator(client_factory=NeverCalledClient).process_turn(
            "test-user",
            [{"sender": "USER", "content": "Tôi muốn học Dictionary trong Python"}],
            learner_context={"states": {}},
        )
        self.assertEqual(result["status"], "AWAITING_CONFIRMATION")
        self.assertEqual(result["suggested_options"], ["Học lý thuyết", "Làm bài thực hành"])
        self.assertEqual(result["pending_confirmation"]["target_concept_id"], "PY-DICT-01")

    def test_foreach_resolves_to_the_javascript_higher_order_array_lesson(self):
        router = IntentRouterAgent(FailingClient(), self.kg)
        routing = router.route("Tôi muốn học forEach trong JavaScript")
        self.assertEqual(routing.intent, "CLARIFY_LEARNING_MODE")
        self.assertEqual(routing.topic, "JS-ARRAY-HOF-01")

        result = AdaptiveLearningOrchestrator(client_factory=NeverCalledClient).process_turn(
            "test-user",
            [{"sender": "USER", "content": "Tôi muốn học forEach trong JavaScript"}],
            learner_context={"states": {}},
        )
        self.assertEqual(result["status"], "AWAITING_CONFIRMATION")
        self.assertEqual(result["pending_confirmation"]["target_concept_id"], "JS-ARRAY-HOF-01")

    def test_unknown_learning_topic_requests_clarification_instead_of_failing_pipeline(self):
        result = AdaptiveLearningOrchestrator(client_factory=UnknownTopicClient).process_turn(
            "test-user",
            [{"sender": "USER", "content": "Tôi muốn học quuxzz trong JavaScript"}],
            language="javascript",
            learner_context={"states": {}},
        )
        self.assertEqual(result["status"], "AWAITING_CONFIRMATION")
        self.assertIsNone(result.get("error"))
        self.assertIn("chưa ghép được tên chủ đề", result["reply"])
        self.assertTrue(result["suggested_options"])

    def test_learning_mode_buttons_preserve_the_selected_concept(self):
        pending = {
            "type": "LEARNING_MODE_SELECTION",
            "target_concept_id": "PY-DICT-01",
            "target_concept_name": "Cú pháp Key-Value & Điều kiện Hashable của Key",
            "language": "python",
        }
        router = IntentRouterAgent(FailingClient(), self.kg)
        theory = router.route("Học lý thuyết", {"pending_confirmation": pending})
        practice = router.route("Làm bài thực hành", {"pending_confirmation": pending})
        self.assertEqual((theory.intent, theory.topic), ("EXPLAIN_CONCEPT", "PY-DICT-01"))
        self.assertEqual((practice.intent, practice.topic), ("REQUEST_ADAPTIVE_EXERCISE", "PY-DICT-01"))

    def test_standalone_luyen_routes_without_llm_and_keeps_title_in_sync(self):
        cases = [
            ("Tôi muốn luyện Dictionary trong Python", "python", "PY-DICT-01"),
            ("Tôi muốn luyện object trong JavaScript", "javascript", "JS-OBJECT-01"),
            ("Tôi muốn luyện vector trong C++", "cpp", "CPP-VECTOR-01"),
            ("Tôi muốn luyện WHERE trong SQL", "sql", "SQL-WHERE-01"),
        ]
        router = IntentRouterAgent(FailingClient(), self.kg)
        planner = AdaptiveExercisePlanner(self.kg)
        for text, language, expected in cases:
            with self.subTest(text=text):
                routing = router.route(text)
                self.assertEqual(routing.intent, "REQUEST_ADAPTIVE_EXERCISE")
                self.assertEqual(routing.language, language)
                self.assertEqual(routing.topic, expected)
                spec = planner.plan_exercise(routing, "test-user")
                self.assertEqual(spec.target_concept, expected)
                self.assertEqual(spec.concept_title, self.kg.get_concept(language, expected)["name"])

    def test_llm_cannot_override_a_topic_extracted_from_user_text(self):
        routing = IntentRouterAgent(ConflictingClient(), self.kg).route("Dictionary nhé")
        self.assertEqual(routing.language, "python")
        self.assertEqual(routing.topic, "PY-DICT-01")

    def test_every_alias_points_to_a_real_concept_in_its_language(self):
        for language, aliases in TOPIC_ALIASES.items():
            concept_ids = {concept["id"] for concept in self.kg.list_all_concepts(language)}
            with self.subTest(language=language):
                self.assertFalse(set(aliases.values()) - concept_ids)

    def test_grounding_uses_lesson_mapping_before_keyword_similarity(self):
        cases = [
            ("Tôi muốn luyện Dictionary trong Python", "LS-06.02"),
            ("Tôi muốn luyện object trong JavaScript", "JS2-09.01"),
            ("Tôi muốn luyện vector trong C++", "CPP2-02.01"),
            ("Tôi muốn luyện WHERE trong SQL", "SQL-02.03"),
        ]
        router = IntentRouterAgent(FailingClient(), self.kg)
        planner = AdaptiveExercisePlanner(self.kg)
        for text, expected_lesson_id in cases:
            with self.subTest(text=text):
                spec = planner.plan_exercise(router.route(text), "test-user")
                grounding = GroundingService().retrieve(spec, self.kg)
                lesson_sources = [source for source in grounding["sources"] if source.get("lesson_id")]
                self.assertTrue(lesson_sources)
                self.assertEqual(lesson_sources[0]["lesson_id"], expected_lesson_id)

    def test_sql_topics_without_lesson_content_are_not_published(self):
        for concept_id in ("SQL-SORT-01", "SQL-AGG-01", "SQL-JOIN-01"):
            with self.subTest(concept_id=concept_id):
                self.assertEqual(self.kg.get_concept("sql", concept_id).get("content_status"), "PLANNED")

    def test_all_graph_references_and_lesson_mappings_are_valid(self):
        for language, graph_path in GRAPH_FILES.items():
            graph = json.loads(graph_path.read_text(encoding="utf-8"))
            concept_ids = {skill["id"] for skill in graph["skills"]}
            references = set(graph.get("lesson_mappings", {}).values())
            references.update(graph.get("practice_problem_mappings", {}).values())
            mapped_concepts = set(graph.get("lesson_mappings", {}).values())
            for lesson_concept_ids in graph.get("multi_skill_lesson_mappings", {}).values():
                mapped_concepts.update(lesson_concept_ids)
            for skill in graph["skills"]:
                references.update(skill.get("prerequisites", []))
            for edge in graph.get("edges", []):
                references.update((edge["source"], edge["target"]))
            self.assertFalse(references - concept_ids, language)
            published_concepts = {
                skill["id"] for skill in graph["skills"]
                if skill.get("content_status", "PUBLISHED") == "PUBLISHED"
            }
            self.assertFalse(
                published_concepts - mapped_concepts,
                f"{language}: concept PUBLISHED chưa có bài học thật",
            )

            lesson_sources = {}
            lesson_titles = {}
            lesson_prerequisites = []
            for path in CONTENT_DIRS[language].rglob("*"):
                if path.suffix.lower() not in {".md", ".txt"}:
                    continue
                text = path.read_text(encoding="utf-8-sig")
                match = re.search(r'^lessonId:\s*["\']?([^"\'\r\n]+)', text, re.MULTILINE)
                if match:
                    lesson_id = match.group(1).strip()
                    lesson_sources.setdefault(lesson_id, set()).add(path.with_suffix(""))
                    title_match = re.search(r'^title:\s*(.+)$', text, re.MULTILINE)
                    if title_match:
                        title = title_match.group(1).strip()
                        if len(title) >= 2 and title[0] == title[-1] and title[0] in {'"', "'"}:
                            title = title[1:-1]
                        lesson_titles[lesson_id] = title
                    prerequisites_match = re.search(r'^prerequisites:\s*\[([^\]]*)\]', text, re.MULTILINE)
                    if prerequisites_match:
                        prerequisite_ids = re.findall(r'["\']([^"\']+)["\']', prerequisites_match.group(1))
                        lesson_prerequisites.extend((lesson_id, prerequisite_id) for prerequisite_id in prerequisite_ids)
            duplicate_lessons = {
                lesson_id: stems for lesson_id, stems in lesson_sources.items() if len(stems) > 1
            }
            self.assertFalse(duplicate_lessons, f"{language}: trùng lessonId ở các bài khác nhau")
            self.assertFalse(set(lesson_sources) - set(graph.get("lesson_mappings", {})), language)
            unresolved_prerequisites = [
                f"{lesson_id}->{prerequisite_id}"
                for lesson_id, prerequisite_id in lesson_prerequisites
                if prerequisite_id not in lesson_sources
            ]
            self.assertFalse(unresolved_prerequisites, f"{language}: prerequisite bài học không tồn tại")
            for lesson_id, title in lesson_titles.items():
                if graph.get("lesson_title_mappings"):
                    self.assertEqual(
                        graph["lesson_mappings"][lesson_id],
                        graph["lesson_title_mappings"].get(title),
                        f"{language}: {lesson_id} và tiêu đề đang trỏ tới hai concept khác nhau",
                    )

    def test_every_mapped_lesson_code_and_title_is_routable_in_three_languages(self):
        router = IntentRouterAgent(FailingClient(), self.kg)
        display_names = {"python": "Python", "javascript": "JavaScript", "cpp": "C++"}
        for language in ("python", "javascript", "cpp"):
            graph = json.loads(GRAPH_FILES[language].read_text(encoding="utf-8"))
            for lesson_code, concept_id in graph["lesson_mappings"].items():
                with self.subTest(language=language, lesson_code=lesson_code):
                    self.assertEqual(self.kg.resolve_concept_by_topic(language, lesson_code), concept_id)

            for path in CONTENT_DIRS[language].rglob("*"):
                if path.suffix.lower() not in {".md", ".txt"}:
                    continue
                text = path.read_text(encoding="utf-8-sig")
                lesson_match = re.search(r'^lessonId:\s*["\']?([^"\'\r\n]+)', text, re.MULTILINE)
                title_match = re.search(r'^title:\s*(.+)$', text, re.MULTILINE)
                if not lesson_match or not title_match:
                    continue
                lesson_code = lesson_match.group(1).strip()
                title = title_match.group(1).strip()
                if len(title) >= 2 and title[0] == title[-1] and title[0] in {'"', "'"}:
                    title = title[1:-1]
                expected = graph["lesson_mappings"][lesson_code]
                with self.subTest(language=language, title=title):
                    routing = router.route(f"Tôi muốn học {title} trong {display_names[language]}")
                    self.assertEqual(routing.topic, expected)


if __name__ == "__main__":
    unittest.main()
