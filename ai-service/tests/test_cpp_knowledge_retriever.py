import sys
import unittest
from pathlib import Path

SERVICE_ROOT = Path(__file__).resolve().parents[1]
if str(SERVICE_ROOT) not in sys.path:
    sys.path.insert(0, str(SERVICE_ROOT))

from app.agents.adaptive_agent_orchestrator import KnowledgeRetriever as ActiveKnowledgeRetriever
from core.adaptive_agent_orchestrator import KnowledgeRetriever as FallbackKnowledgeRetriever


class CppKnowledgeRetrieverTests(unittest.TestCase):
    query_expectations = {
        "std::vector và reserve": "CPP-VECTOR-01",
        "regex trong C++": "CPP-FILE-01",
        "unordered_map": "CPP-CACHE-01",
        "N-Queens quay lui": "CPP-BACKTRACK-01",
        "unique_ptr theo RAII": "CPP-SMARTPTR-01",
        "bitmask": "CPP-BITWISE-01",
    }

    def test_active_and_fallback_retrievers_use_the_same_cpp_graph(self):
        for retriever_type in (ActiveKnowledgeRetriever, FallbackKnowledgeRetriever):
            retriever = retriever_type()
            self.assertEqual(len(retriever.get_skill_graph("CPP")["skills"]), 21)
            for query, expected_skill in self.query_expectations.items():
                concept = retriever.find_concept_by_query(query, language="CPP")
                self.assertIsNotNone(concept, query)
                self.assertEqual(concept["id"], expected_skill, query)

    def test_next_concept_uses_cpp_edges_in_the_active_service(self):
        retriever = ActiveKnowledgeRetriever()
        next_nodes = retriever.get_next_forward_concepts("CPP-VECTOR-01", {}, language="CPP")
        next_ids = {node["concept_id"] for node in next_nodes}
        self.assertIn("CPP-BUILD-01", next_ids)
        self.assertTrue(next_ids)
        self.assertTrue(all(skill_id.startswith("CPP-") for skill_id in next_ids))

    def test_topics_absent_from_the_curriculum_are_not_fabricated_as_cpp_skills(self):
        retriever = ActiveKnowledgeRetriever()
        self.assertIsNone(retriever.find_concept_by_query("đa hình virtual destructor trong OOP C++", language="CPP"))


if __name__ == "__main__":
    unittest.main()
