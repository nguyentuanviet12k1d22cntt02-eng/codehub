"""Dẫn chứng chủ đề có chữ chung chung ở đầu ("câu lệnh", "viết", "bài tập về") vẫn phải khớp học liệu.

Lỗi tìm thấy khi chạy thử AI thật trên Production (2026-11-17): yêu cầu "Cho tôi 1 bài tập Python mức trung bình
về câu lệnh if-elif-else" bị IntentRouterAgent từ chối (ROUTING_TARGET_UNSUPPORTED) rồi chuyển thành câu hỏi
"Mình chưa chắc đã hiểu đúng yêu cầu", kể cả khi học viên trả lời lại rõ ràng.
"""

import unittest

from app.agents.intent_router_agent import IntentRouterAgent, _evidence_core
from app.pipeline.llm_client import PipelineError
from app.services.knowledge_graph.aliases import _fold_topic


def decision(topic, evidence, requested):
    return {
        "intent": "REQUEST_ADAPTIVE_EXERCISE", "language": "python", "topic": topic, "topic_match": "matched",
        "requested_topic": requested, "topic_evidence": evidence, "difficulty_request": "auto",
        "required_constructs": [], "forbidden_constructs": [], "ordered_output": False,
        "confirm_prerequisite_override": False,
    }


class FixedClient:
    def __init__(self, value):
        self.value = value

    def json(self, stage, system, payload):
        return self.value


class RouterTopicEvidenceTests(unittest.TestCase):
    def test_filler_words_at_start_are_removed_only_at_start(self):
        fold = lambda text: _evidence_core(_fold_topic(text))
        self.assertEqual(fold("câu lệnh if-elif-else"), "if elif else")
        self.assertEqual(fold("viết hàm"), "ham")
        self.assertEqual(fold("bài tập về list"), "list")
        self.assertEqual(fold("vòng lặp for"), "vong lap for")
        self.assertEqual(fold("câu lệnh"), "")
        self.assertEqual(fold("về"), "")

    def test_if_elif_else_request_routes_to_conditionals(self):
        request = "Cho tôi 1 bài tập Python mức trung bình về câu lệnh if-elif-else"
        route = IntentRouterAgent(FixedClient(decision("PY-FLOW-01", ["câu lệnh if-elif-else"], "câu lệnh if-elif-else"))).route(request)
        self.assertEqual(route.topic, "PY-FLOW-01")

    def test_write_function_request_routes_to_functions(self):
        request = "Cho tôi 1 bài tập Python mức trung bình về viết hàm"
        route = IntentRouterAgent(FixedClient(decision("PY-FUNC-01", ["viết hàm"], "viết hàm"))).route(request)
        self.assertEqual(route.topic, "PY-FUNC-01")

    def test_stripping_filler_does_not_allow_a_wrong_topic(self):
        # "câu lệnh for" không được gán vào chủ đề if-elif-else chỉ vì đã bỏ chữ "câu lệnh".
        request = "Cho tôi 1 bài tập Python về câu lệnh for"
        with self.assertRaises(PipelineError) as raised:
            IntentRouterAgent(FixedClient(decision("PY-FLOW-01", ["câu lệnh for"], "câu lệnh for"))).route(request)
        self.assertEqual(raised.exception.code, "ROUTING_TARGET_UNSUPPORTED")

    def test_evidence_made_only_of_filler_is_rejected(self):
        request = "Cho tôi 1 bài tập Python về câu lệnh"
        with self.assertRaises(PipelineError):
            IntentRouterAgent(FixedClient(decision("PY-FLOW-01", ["câu lệnh"], "câu lệnh"))).route(request)


if __name__ == "__main__":
    unittest.main()
