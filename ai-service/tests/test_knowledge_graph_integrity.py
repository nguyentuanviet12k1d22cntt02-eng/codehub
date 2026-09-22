import hashlib
import json
import re
import unittest
from collections import defaultdict, deque
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
GRAPH_PATHS = [
    ROOT / "ai-service/data/pythonSkillGraph.json",
    ROOT / "ai-service/data/skill_graph.json",
    ROOT / "backend/src/infrastructure/data/pythonSkillGraph.json",
    ROOT / "frontend/src/data/pythonSkillGraph.json",
]


class KnowledgeGraphIntegrityTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.graph = json.loads(GRAPH_PATHS[0].read_text(encoding="utf-8"))

    def test_all_runtime_copies_are_identical(self):
        hashes = {
            hashlib.sha256(path.read_bytes()).hexdigest()
            for path in GRAPH_PATHS
        }
        self.assertEqual(len(hashes), 1, "Các bản sao graph đã lệch nhau")

    def test_graph_is_a_valid_dag_and_prerequisites_match_edges(self):
        skills = self.graph["skills"]
        skill_ids = [skill["id"] for skill in skills]
        self.assertEqual(len(skill_ids), len(set(skill_ids)))
        skill_id_set = set(skill_ids)
        incoming = defaultdict(set)
        outgoing = defaultdict(set)
        indegree = {skill_id: 0 for skill_id in skill_ids}

        for edge in self.graph["edges"]:
            source, target = edge["source"], edge["target"]
            self.assertIn(source, skill_id_set)
            self.assertIn(target, skill_id_set)
            self.assertNotIn(target, outgoing[source], f"Cạnh trùng {source} -> {target}")
            outgoing[source].add(target)
            incoming[target].add(source)
            indegree[target] += 1

        for skill in skills:
            self.assertEqual(set(skill.get("prerequisites", [])), incoming[skill["id"]])

        queue = deque(sorted(skill_id for skill_id, degree in indegree.items() if degree == 0))
        visited = 0
        while queue:
            source = queue.popleft()
            visited += 1
            for target in sorted(outgoing[source]):
                indegree[target] -= 1
                if indegree[target] == 0:
                    queue.append(target)
        self.assertEqual(visited, len(skill_ids), "Graph có chu trình")

    def test_mappings_reference_real_skills_and_real_content(self):
        skill_ids = {skill["id"] for skill in self.graph["skills"]}
        mapped_skill_ids = set(self.graph["lesson_mappings"].values())
        mapped_skill_ids.update(self.graph["lesson_title_mappings"].values())
        mapped_skill_ids.update(self.graph["practice_problem_mappings"].values())
        for skill_ids_for_lesson in self.graph.get("multi_skill_lesson_mappings", {}).values():
            mapped_skill_ids.update(skill_ids_for_lesson)
        self.assertTrue(mapped_skill_ids <= skill_ids)

        published_skill_ids = {
            skill["id"] for skill in self.graph["skills"]
            if skill.get("content_status", "PUBLISHED") == "PUBLISHED"
        }
        self.assertFalse(published_skill_ids - mapped_skill_ids, "Kỹ năng PUBLISHED chưa có học liệu")

        content_dir = ROOT / "docs/Dữ liệu nội dung bài học/Python/Cấu trúc bài học"
        lesson_ids = set()
        lesson_titles = set()

        def unquote(value):
            value = value.strip()
            if len(value) >= 2 and value[0] == value[-1] and value[0] in {'"', "'"}:
                return value[1:-1]
            return value

        for path in content_dir.rglob("*"):
            if path.suffix.lower() not in {".md", ".txt"}:
                continue
            text = path.read_text(encoding="utf-8-sig")
            lesson_match = re.search(r'^lessonId:\s*(.+)$', text, re.MULTILINE)
            title_match = re.search(r'^title:\s*(.+)$', text, re.MULTILINE)
            if lesson_match:
                lesson_ids.add(unquote(lesson_match.group(1)))
            if title_match:
                lesson_titles.add(unquote(title_match.group(1)))

        self.assertFalse(lesson_ids - set(self.graph["lesson_mappings"]))
        self.assertFalse(lesson_titles - set(self.graph["lesson_title_mappings"]))

        seed = json.loads((ROOT / "backend/prisma/seed/seed_course_data.json").read_text(encoding="utf-8"))
        seeded_titles = set()

        def collect(value):
            if isinstance(value, dict):
                if value.get("lessonId") and value.get("title"):
                    seeded_titles.add(value["title"])
                for child in value.values():
                    collect(child)
            elif isinstance(value, list):
                for child in value:
                    collect(child)

        collect(seed)
        self.assertFalse(seeded_titles - set(self.graph["lesson_title_mappings"]))

    def test_unpublished_skills_are_explicit(self):
        valid_statuses = {"PUBLISHED", "PLANNED"}
        for skill in self.graph["skills"]:
            self.assertIn(skill.get("content_status", "PUBLISHED"), valid_statuses)


if __name__ == "__main__":
    unittest.main()
