import hashlib
import unittest
from unittest.mock import MagicMock, patch

from app.services import skill_graph_source as source


class SkillGraphSourceTests(unittest.TestCase):
    def setUp(self):
        source.clear_cache()
        self.addCleanup(source.clear_cache)

    def test_backend_response_is_used_and_cached(self):
        response = MagicMock(ok=True)
        response.json.return_value = {"success": True, "data": {"version": "9.9", "skills": []}, "sha256": "abc"}
        with patch.object(source.requests, "get", return_value=response) as get:
            self.assertEqual(source.load_skill_graph_with_sha("js"), ({"version": "9.9", "skills": []}, "abc"))
            self.assertEqual(source.load_skill_graph("javascript")["version"], "9.9")
        self.assertEqual(get.call_count, 1)
        self.assertEqual(get.call_args.kwargs["params"], {"language": "JAVASCRIPT"})

    def test_falls_back_to_seed_file_when_backend_is_down(self):
        with patch.object(source.requests, "get", side_effect=source.requests.ConnectionError("down")):
            graph, sha = source.load_skill_graph_with_sha("python")
        seed = source.seed_path("python").read_bytes()
        self.assertEqual(sha, hashlib.sha256(seed).hexdigest())
        self.assertTrue(graph["skills"])

    def test_language_aliases(self):
        self.assertEqual(source.normalize_language("C++"), "cpp")
        self.assertEqual(source.normalize_language("JS"), "javascript")
        self.assertEqual(source.normalize_language(None), "python")


if __name__ == "__main__":
    unittest.main()
