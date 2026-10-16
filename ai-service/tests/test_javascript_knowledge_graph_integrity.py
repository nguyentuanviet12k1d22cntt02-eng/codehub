import hashlib
import json
import unittest
from collections import defaultdict, deque
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "ai-service/data/javascriptSkillGraph.json"
COPIES = [
    ROOT / "backend/src/infrastructure/data/javascriptSkillGraph.json",
    ROOT / "frontend/src/data/javascriptSkillGraph.json",
]


class JavascriptKnowledgeGraphIntegrityTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.graph = json.loads(SOURCE.read_text(encoding="utf-8"))

    def test_runtime_copies_and_historical_snapshot(self):
        current_hash = hashlib.sha256(SOURCE.read_bytes()).hexdigest()
        for path in COPIES:
            self.assertEqual(hashlib.sha256(path.read_bytes()).hexdigest(), current_hash)
        snapshot = ROOT / "ai-service/data/synthetic_history_real_items/javascriptSkillGraph.v3.0.0.json"
        metadata = json.loads((snapshot.parent / "javascript_metadata.json").read_text(encoding="utf-8"))
        self.assertEqual(hashlib.sha256(snapshot.read_bytes()).hexdigest(), metadata["graph_sha256"])

    def test_dag_mappings_and_prerequisites(self):
        graph = self.graph
        ids = [skill["id"] for skill in graph["skills"]]
        self.assertEqual(len(ids), len(set(ids)))
        incoming = defaultdict(set)
        outgoing = defaultdict(set)
        indegree = dict.fromkeys(ids, 0)
        for edge in graph["edges"]:
            source, target = edge["source"], edge["target"]
            self.assertIn(source, indegree)
            self.assertIn(target, indegree)
            self.assertNotIn(target, outgoing[source])
            outgoing[source].add(target)
            incoming[target].add(source)
            indegree[target] += 1
        for skill in graph["skills"]:
            self.assertEqual(set(skill["prerequisites"]), incoming[skill["id"]])
        queue = deque(skill_id for skill_id, degree in indegree.items() if degree == 0)
        visited = 0
        while queue:
            source = queue.popleft()
            visited += 1
            for target in outgoing[source]:
                indegree[target] -= 1
                if indegree[target] == 0:
                    queue.append(target)
        self.assertEqual(visited, len(ids))
        self.assertEqual(set(graph["lesson_mappings"]), set(graph["detailed_lesson_mappings"]))
        self.assertTrue(set(graph["lesson_mappings"].values()) <= set(ids))

    def test_curricular_relations(self):
        edges = {(edge["source"], edge["target"]) for edge in self.graph["edges"]}
        self.assertIn(("JS-TYPE-01", "JS-RUNTIME-01"), edges)
        self.assertIn(("JS-TYPE-01", "JS-STRING-01"), edges)
        self.assertIn(("JS-FUNC-01", "JS-EXEC-01"), edges)
        self.assertIn(("JS-EXEC-01", "JS-SCOPE-01"), edges)
        self.assertNotIn(("JS-SCOPE-01", "JS-EXEC-01"), edges)
        self.assertEqual(self.graph["lesson_mappings"]["JS2-11.01"], "JS-EXEC-01")
        self.assertEqual(self.graph["lesson_mappings"]["JS2-11.02"], "JS-SCOPE-01")


if __name__ == "__main__":
    unittest.main()
