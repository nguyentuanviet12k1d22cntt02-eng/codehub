import unittest
import hashlib
import hmac
import json
import os
import time
from unittest.mock import patch

from fastapi.testclient import TestClient
from pipeline_server import app

from app.pipeline.practice_feedback import PracticeFeedbackRequest, generate_practice_feedback
from app.pipeline.llm_client import PipelineLLMClient, PipelineError
from app.pipeline import llm_client as llm_client_module
from app.llm.key_pool_manager import AIKeyPoolManager
from tests.test_pipeline_v3 import FakeProviderResponse


class FakeClient:
    def __init__(self, response):
        self.response = response
        self.call = None

    def json(self, stage, system, data, *, validate_response=None):
        self.call = (stage, system, data)
        return validate_response(self.response) if validate_response else self.response


class PracticeFeedbackTests(unittest.TestCase):
    def request(self, passed=False):
        return PracticeFeedbackRequest(
            code="for c in input():\n    print(c)", language="python", title="Duyệt ký tự",
            problem_statement="In từng ký tự trên một dòng.", concept_name="Vòng lặp for",
            required_constructs=["for"], forbidden_constructs=["while"], passed=passed,
            result_status="EXECUTED", errors=["Test #1: SUCCESS OUTPUT_MISMATCH"],
            public_tests=[{"passed": False, "status": "SUCCESS", "input": "abc",
                           "expected": "a\nb\nc", "actual": "", "stderr": ""}],
            hidden_failed_count=1,
        )

    def test_model_reads_current_code_and_public_evidence(self):
        client = FakeClient({"title": "Xem lại đầu ra", "reason": "Chương trình chưa in đúng kết quả.",
                             "hint": "Kiểm tra lệnh in trong vòng lặp.", "line": 2,
                             "line_evidence": "print(c)", "confidence": "high"})
        result = generate_practice_feedback(self.request(), client)
        self.assertEqual(result["line"], 2)
        self.assertEqual(result["source"], "AI")
        self.assertEqual(client.call[0], "PracticeFeedbackAgent")
        self.assertEqual(client.call[2]["code"], "for c in input():\n    print(c)")

    def test_harness_or_invalid_line_is_not_shown_as_student_line(self):
        client = FakeClient({"title": "Kiểm tra lại", "reason": "Kết quả chưa đúng.",
                             "hint": "Thử đầu vào công khai.", "line": 24})
        self.assertIsNone(generate_practice_feedback(self.request(), client)["line"])
        self.assertIsNone(generate_practice_feedback(self.request(passed=True), client)["line"])

    def test_uncertain_unmatched_or_hidden_only_logic_line_is_not_annotated(self):
        for extra in ({}, {"confidence": "low", "line_evidence": "print(c)"},
                      {"confidence": "high", "line_evidence": "missing_code"}):
            result = generate_practice_feedback(self.request(), FakeClient({"title": "Xem kết quả",
                "reason": "Kết quả chưa đúng.", "hint": "Kiểm tra thao tác xuất dữ liệu.", "line": 2, **extra}))
            self.assertIsNone(result["line"])
        request = self.request().model_copy(update={"public_tests": []})
        result = generate_practice_feedback(request, FakeClient({"title": "Xem kết quả",
            "reason": "Kết quả chưa đúng.", "hint": "Kiểm tra thao tác xuất dữ liệu.", "line": 2,
            "confidence": "high", "line_evidence": "print(c)"}))
        self.assertIsNone(result["line"])

    def test_syntax_and_runtime_never_call_logic_model(self):
        request = self.request()
        request.public_tests[0].status = "RUNTIME_ERROR"
        client = FakeClient({})
        with self.assertRaisesRegex(ValueError, "LOGIC_EXECUTION_REQUIRED"):
            generate_practice_feedback(request, client)
        self.assertIsNone(client.call)

    def test_no_fabricated_feedback_on_invalid_provider_output(self):
        with self.assertRaises(ValueError):
            generate_practice_feedback(self.request(), FakeClient({"title": "Sai"}))
        with self.assertRaises(ValueError):
            generate_practice_feedback(self.request(), FakeClient({"title": "Sai", "reason": "```python",
                                                                   "hint": "Sửa lại", "line": 1}))

    def test_hint_rejects_translated_function_calls_and_full_replacement_lines(self):
        for hint in ("Thay pass bằng lệnh in(ch).", "Thay pass bằng print(ch).", "Viết console.log(ch).",
                     "Thay dòng này bằng std::cout << ch;"):
            with self.subTest(hint=hint), self.assertRaisesRegex(ValueError, "CODE_IN_HINT"):
                generate_practice_feedback(self.request(), FakeClient({"title": "Thiếu đầu ra",
                    "reason": "Thân vòng lặp chưa xuất kết quả.", "hint": hint, "line": 2}))
        result = generate_practice_feedback(self.request(), FakeClient({"title": "Thiếu đầu ra",
            "reason": "Lệnh pass không in ký tự ra màn hình.",
            "hint": "Hãy thêm thao tác xuất từng ký tự ngay trong thân vòng lặp.", "line": 2}))
        self.assertEqual(result["source"], "AI")

    def test_feedback_over_two_sentences_is_rejected(self):
        with self.assertRaisesRegex(ValueError, "SENTENCE_COUNT"):
            generate_practice_feedback(self.request(), FakeClient({"title": "Nhận xét",
                "reason": "Câu một. Câu hai. Câu ba. Câu bốn.", "hint": "Câu năm.", "line": None}))

    def test_correct_submission_without_fix_hint_preserves_the_models_own_sentences(self):
        reason = "Bạn đã duyệt từng ký tự đúng yêu cầu bằng for. Kết quả khớp các test công khai."
        result = generate_practice_feedback(self.request(passed=True), FakeClient({
            "title": "Chính xác", "reason": reason, "hint": None, "line": None}))
        self.assertEqual(result["reason"] + " " + result["hint"], reason)
        self.assertEqual(result["source"], "AI")
        with self.assertRaises(ValueError):
            generate_practice_feedback(self.request(passed=False), FakeClient({
                "title": "Chưa đúng", "reason": reason, "hint": None, "line": None}))

    def test_recorded_live_hint_preserves_prose_but_removes_appended_solution_example(self):
        result = generate_practice_feedback(self.request(), FakeClient({
            "title": "Thiếu đầu ra", "reason": "Thân vòng lặp chưa in kết quả.",
            "hint": "Thay câu lệnh pass bằng câu lệnh in ký tự, ví dụ print(ch).", "line": 2}))
        self.assertEqual(result["hint"], "Thay câu lệnh pass bằng câu lệnh in ký tự.")
        self.assertEqual(result["source"], "AI")

    def provider_contract(self, responses):
        pool = AIKeyPoolManager()
        pool._provider_pools = {"GROQ": ["groq-a", "groq-b"], "INCEPTION": ["inception-a"]}
        pool._last_fetch_time = time.time()
        sent, logs, succeeded, cooled = [], [], [], []
        pool.log_call_async = lambda **kwargs: logs.append(kwargs)
        pool.report_key_success = lambda key: succeeded.append(key)
        pool.mark_key_temporarily_unavailable = lambda *args, **kwargs: cooled.append(args)
        client = PipelineLLMClient(timeout_seconds=26)

        def post(url, **kwargs):
            sent.append(kwargs["headers"]["Authorization"])
            return FakeProviderResponse(200, {"id": "qa-contract", "usage": {"total_tokens": 10},
                "choices": [{"message": {"content": json.dumps(responses.pop(0), ensure_ascii=False)}}]})

        context = (patch.dict(os.environ, {"ADAPTIVE_PROVIDER": ""}),
                   patch.object(llm_client_module, "key_pool", pool),
                   patch.object(llm_client_module, "_provider_blocked_until", {}),
                   patch.object(client, "_model", return_value="qa-model"),
                   patch.object(llm_client_module.requests, "post", side_effect=post))
        return client, sent, logs, succeeded, cooled, context

    def test_content_rejection_uses_next_provider_inside_same_budget_without_cooling_keys(self):
        # Exact content contract failure observed in the real browser submission.
        invalid = {"title": "In từng ký tự", "reason": "Chương trình không in ra từng ký tự. Bạn đã bỏ qua thao tác in.",
                   "hint": "Thử thêm lệnh print(ch) vào trong vòng lặp for", "line": 2}
        valid = {"title": "Thiếu đầu ra", "reason": "Lệnh pass không in ký tự ra màn hình.",
                 "hint": "Hãy thêm thao tác xuất ký tự ngay trong thân vòng lặp.", "line": 2}
        client, sent, logs, succeeded, cooled, context = self.provider_contract([invalid, valid])
        with context[0], context[1], context[2], context[3], context[4]:
            deadline = client.deadline
            result = generate_practice_feedback(self.request(), client)
        self.assertEqual(result["hint"], valid["hint"])
        self.assertEqual(client.deadline, deadline, "Content validation must not reset the run budget")
        self.assertEqual(sent, ["Bearer groq-a", "Bearer inception-a"], "Do not retry sibling keys for content")
        self.assertEqual([item["status"] for item in logs], ["FAILED", "SUCCESS"])
        self.assertIn("PROVIDER_CONTRACT_INVALID", logs[0]["error_message"])
        self.assertIn("CODE_IN_HINT", logs[0]["error_message"])
        self.assertEqual(succeeded, ["inception-a"])
        self.assertEqual(cooled, [], "Content failure is not a bad credential or provider outage")
        self.assertEqual(client._failed_keys("GROQ"), [])

    def test_all_content_rejections_fail_closed_without_fake_feedback(self):
        invalid = {"title": "Thiếu đầu ra", "reason": "Chưa có kết quả.", "hint": "Viết print(ch).", "line": 2}
        client, sent, logs, succeeded, cooled, context = self.provider_contract([invalid, invalid])
        with context[0], context[1], context[2], context[3], context[4]:
            with self.assertRaises(PipelineError) as caught:
                generate_practice_feedback(self.request(), client)
        self.assertEqual(caught.exception.code, "PROVIDER_CONTRACT_INVALID")
        self.assertEqual(len(sent), 2)
        self.assertTrue(all(item["status"] == "FAILED" for item in logs))
        self.assertEqual(succeeded, [])
        self.assertEqual(cooled, [])

    def test_signed_service_route_returns_real_feedback_and_rejects_unsigned(self):
        body = json.dumps(self.request().model_dump()).encode()
        timestamp = str(int(time.time()))
        secret = "practice-test-secret"
        signature = hmac.new(secret.encode(), timestamp.encode() + b"." + body, hashlib.sha256).hexdigest()
        client = TestClient(app)
        with patch.dict(os.environ, {"ADAPTIVE_INTERNAL_SECRET": secret}), patch(
            "app.api.adaptive.generate_practice_feedback",
            return_value={"source": "AI", "title": "Xem đầu ra", "reason": "Chưa in đúng.", "hint": "Kiểm tra print.", "line": 2},
        ) as model:
            response = client.post("/pal-net/practice-feedback", content=body,
                                   headers={"X-Adaptive-Time": timestamp, "X-Adaptive-Signature": signature})
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.json()["guidance"]["source"], "AI")
            self.assertEqual(model.call_args.args[0].code, self.request().code)
            self.assertEqual(client.post("/pal-net/practice-feedback", content=body).status_code, 401)


if __name__ == "__main__":
    unittest.main()
