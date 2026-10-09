import hashlib
import json
import re
import unittest
from collections import defaultdict, deque
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
SOURCE_GRAPH = ROOT / "curriculum/cppSkillGraph.json"
RUNTIME_GRAPHS = [
    ROOT / "frontend/src/data/cppSkillGraph.json",
    ROOT / "backend/src/infrastructure/data/cppSkillGraph.json",
    ROOT / "ai-service/data/cppSkillGraph.json",
]
CPP_CONTENT_ROOT = ROOT / "docs/Dữ liệu nội dung bài học/C++"


class CppKnowledgeGraphIntegrityTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.graph = json.loads(SOURCE_GRAPH.read_text(encoding="utf-8"))

    def test_all_runtime_copies_match_the_canonical_graph(self):
        source_hash = hashlib.sha256(SOURCE_GRAPH.read_bytes()).hexdigest()
        for runtime_path in RUNTIME_GRAPHS:
            self.assertEqual(
                hashlib.sha256(runtime_path.read_bytes()).hexdigest(),
                source_hash,
                f"Bản runtime C++ lệch dữ liệu chuẩn: {runtime_path}",
            )

    def test_graph_is_a_dag_and_prerequisites_match_edges(self):
        skills = self.graph["skills"]
        skill_ids = [skill["id"] for skill in skills]
        self.assertEqual(len(skill_ids), len(set(skill_ids)))
        skill_id_set = set(skill_ids)
        outgoing = defaultdict(set)
        incoming = defaultdict(set)
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
            self.assertEqual(set(skill["prerequisites"]), incoming[skill["id"]])

        queue = deque(sorted(skill_id for skill_id, degree in indegree.items() if degree == 0))
        visited = 0
        while queue:
            source = queue.popleft()
            visited += 1
            for target in sorted(outgoing[source]):
                indegree[target] -= 1
                if indegree[target] == 0:
                    queue.append(target)
        self.assertEqual(visited, len(skill_ids), "Đồ thị C++ có chu trình")

    def test_every_source_lesson_is_mapped_once_with_valid_supporting_skills(self):
        lesson_ids = set()
        for content_path in CPP_CONTENT_ROOT.rglob("Lesson_*.md"):
            text = content_path.read_text(encoding="utf-8-sig")
            lesson_match = re.search(r'^lessonId:\s*"?([^"\n]+)"?\s*$', text, re.MULTILINE)
            self.assertIsNotNone(lesson_match, f"Thiếu lessonId: {content_path}")
            lesson_ids.add(lesson_match.group(1))

        self.assertEqual(len(lesson_ids), 48)
        self.assertEqual(lesson_ids, set(self.graph["lesson_mappings"]))
        self.assertEqual(lesson_ids, set(self.graph["detailed_lesson_mappings"]))
        self.assertEqual(lesson_ids, set(self.graph["multi_skill_lesson_mappings"]))

        skill_ids = {skill["id"] for skill in self.graph["skills"]}
        for lesson_id in lesson_ids:
            detailed = self.graph["detailed_lesson_mappings"][lesson_id]
            self.assertEqual(detailed["primary"], self.graph["lesson_mappings"][lesson_id])
            self.assertIn(detailed["primary"], skill_ids)
            self.assertTrue(set(detailed["supporting"]) <= skill_ids)
            self.assertIn(detailed["primary"], self.graph["multi_skill_lesson_mappings"][lesson_id])
            self.assertTrue(set(self.graph["multi_skill_lesson_mappings"][lesson_id]) <= skill_ids)

        published_skills = {
            skill["id"] for skill in self.graph["skills"]
            if skill.get("content_status") == "PUBLISHED"
        }
        self.assertTrue(published_skills <= set(self.graph["lesson_mappings"].values()))

    def test_lessons_with_previously_wrong_semantics_target_the_taught_skill(self):
        mappings = self.graph["lesson_mappings"]
        self.assertEqual(mappings["CPP-03.05"], "CPP-LOOP-01")
        self.assertEqual(mappings["CPP-04.05"], "CPP-RECUR-01")
        self.assertEqual(mappings["CPP-05.03"], "CPP-ARRAY-01")
        self.assertEqual(mappings["CPP2-02.01"], "CPP-VECTOR-01")
        self.assertEqual(mappings["CPP2-03.02"], "CPP-FILE-01")
        self.assertEqual(mappings["CPP2-05.01"], "CPP-BUILD-01")
        self.assertEqual(mappings["CPP2-06.01"], "CPP-BITWISE-01")

    def test_document_prerequisites_follow_the_skill_dag_and_text_mirrors_match(self):
        outgoing = defaultdict(set)
        for edge in self.graph["edges"]:
            outgoing[edge["source"]].add(edge["target"])

        def is_reachable(source, target):
            if source == target:
                return True
            queue = deque([source])
            visited = set()
            while queue:
                current = queue.popleft()
                if current in visited:
                    continue
                visited.add(current)
                for next_skill in outgoing[current]:
                    if next_skill == target:
                        return True
                    queue.append(next_skill)
            return False

        lesson_skill = self.graph["lesson_mappings"]
        for content_path in CPP_CONTENT_ROOT.rglob("Lesson_*.md"):
            content = content_path.read_text(encoding="utf-8-sig")
            lesson_match = re.search(r'^lessonId:\s*"?([^"\n]+)"?\s*$', content, re.MULTILINE)
            self.assertIsNotNone(lesson_match, f"Thiếu lessonId: {content_path}")
            lesson_id = lesson_match.group(1)
            prerequisites_match = re.search(r'^prerequisites:\s*\[([^\]]*)\]\s*$', content, re.MULTILINE)
            prerequisites = re.findall(r'"([^"]+)"', prerequisites_match.group(1)) if prerequisites_match else []

            text_mirror = content_path.with_suffix(".txt")
            self.assertTrue(text_mirror.exists(), f"Thiếu bản .txt: {content_path}")
            self.assertEqual(content_path.read_bytes(), text_mirror.read_bytes(), f"Bản .txt lệch Markdown: {content_path}")

            for prerequisite in prerequisites:
                self.assertIn(prerequisite, lesson_skill, f"Điều kiện tiên quyết không tồn tại: {lesson_id} -> {prerequisite}")
                self.assertTrue(
                    is_reachable(lesson_skill[prerequisite], lesson_skill[lesson_id]),
                    f"Điều kiện tiên quyết không dẫn tới kỹ năng đích: {prerequisite} -> {lesson_id}",
                )

            for code_fence in re.findall(r"```cpp\r?\n([\s\S]*?)```", content):
                self.assertNotRegex(
                    code_fence,
                    r'"[^"\r\n]*\r?\n"',
                    f"Ví dụ C++ có chuỗi literal xuống dòng sai cú pháp: {content_path}",
                )


if __name__ == "__main__":
    unittest.main()
