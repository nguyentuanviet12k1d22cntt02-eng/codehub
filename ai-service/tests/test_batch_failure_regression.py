import copy
import os
import time
import unittest
from unittest.mock import patch
from tests.test_pipeline_v3 import Client, Sandbox, STDIO_DRAFT, REVIEW, FakeProviderResponse
import app.pipeline.llm_client as llm_client_module
from app.agents.intent_router_agent import IntentRouterAgent
from app.agents.exercise_generator_agent import ExerciseGeneratorAgent
from app.agents.adaptive_exercise_planner import AdaptiveExercisePlanner
from app.contracts.routing import RoutingDecision
from app.agents.critic_evaluator_agent import CriticEvaluatorAgent
from app.orchestrator.adaptive_learning_orchestrator import AdaptiveLearningOrchestrator
from app.pipeline.llm_client import PipelineLLMClient, stage_budget_seconds, stage_call_timeout
from app.llm.key_pool_manager import AIKeyPoolManager


class BatchFailureRegressionTests(unittest.TestCase):
    def test_verified_batch_continuation_avoids_router_provider(self):
        class UnavailableClient:
            def json(self, *_args):
                raise AssertionError('A verified continuation must not use the router provider')
        router = IntentRouterAgent(UnavailableClient())
        context = {'batch_continuation': True, 'batch_index': 2, 'language': 'python'}
        route = router.verified_batch_continuation('Tạo 1 bài khác', context, 'PY-FLOW-03', 'python', 'trace_test')
        self.assertEqual((route.intent, route.topic, route.language),
                         ('REQUEST_ADAPTIVE_EXERCISE', 'PY-FLOW-03', 'python'))
        with self.assertRaises(Exception):
            router.verified_batch_continuation('Tạo 1 bài khác',
                {**context, 'batch_index': 6}, 'PY-FLOW-03', 'python', 'trace_test')

    def test_for_batch_positions_require_different_skills_without_functions(self):
        router = IntentRouterAgent()
        for index, marker in ((1, 'for item'), (2, 'bước nhảy'), (3, 'tổng số'),
                              (4, 'đảo ngược'), (5, 'phép nhân')):
            with self.subTest(index=index):
                route = RoutingDecision(intent='REQUEST_ADAPTIVE_EXERCISE', language='python',
                    topic='PY-FLOW-03', topic_match='matched', user_text='Tạo 1 bài thực hành khác')
                spec = AdaptiveExercisePlanner(router.kg).plan_exercise(route, 'u', 'PY-FLOW-03',
                    {'batch_continuation': index > 1, 'batch_index': index, 'batch_total': 4,
                     'force_prerequisite_override': True})
                guidance = ' '.join(ExerciseGeneratorAgent._generation_guidance(spec, None))
                self.assertIn(marker, guidance)
                self.assertTrue(spec.learner_evidence['avoid_function_syntax'])
                self.assertEqual(spec.learner_evidence['batch_total'], 4)
                self.assertNotEqual(spec.target_sub_skills, [])
                self.assertIn('range' if index > 1 else 'trực tiếp', spec.target_sub_skills[0])

    def test_critic_reviews_one_artifact_in_a_multi_exercise_batch(self):
        class Capture:
            system = None
            def json(self, stage, system, data):
                self.system = system
                return copy.deepcopy(REVIEW)
        route = RoutingDecision(intent='REQUEST_ADAPTIVE_EXERCISE', language='python',
            topic='PY-FLOW-03', topic_match='matched', user_text='Tạo 4 bài vòng lặp')
        spec = AdaptiveExercisePlanner().plan_exercise(route, 'u', 'PY-FLOW-03',
            {'batch_index': 1, 'batch_total': 4})
        capture = Capture()
        CriticEvaluatorAgent(capture).evaluate_content('Một ví dụ ngắn.', STDIO_DRAFT, spec)
        self.assertIn('đúng MỘT bài', capture.system)

    def test_python_blank_line_fixture_is_not_sent_as_eof(self):
        class DraftClient:
            def json(self, *_args):
                return {**copy.deepcopy(STDIO_DRAFT), 'reference_solution':
                    'text = input()\nfor ch in text:\n    print(ch)',
                    'test_cases': [{**copy.deepcopy(STDIO_DRAFT['test_cases'][0]),
                        'input': '', 'expected_output': ''}]}
        route = RoutingDecision(intent='REQUEST_ADAPTIVE_EXERCISE', language='python',
            topic='PY-FLOW-03', topic_match='matched', user_text='Tạo 4 bài vòng lặp')
        spec = AdaptiveExercisePlanner().plan_exercise(route, 'u', 'PY-FLOW-03',
            {'batch_index': 1, 'batch_total': 4})
        draft = ExerciseGeneratorAgent(DraftClient()).generate(spec)
        self.assertEqual(draft['test_cases'][0]['input'], '\n')

    def test_missing_ec2_configuration_fails_before_generating_an_exercise(self):
        class NoGeneration(Client):
            def json(self, stage, system, data):
                if stage == 'ExerciseGeneratorAgent':
                    raise AssertionError('Do not generate when EC2 sandbox is unconfigured')
                return super().json(stage, system, data)
        report = AdaptiveLearningOrchestrator(NoGeneration, Sandbox).process_turn(
            'u', [{'sender': 'USER', 'content': 'Tạo 4 bài Python'}],
            learner_context={'sandbox_configured': False})
        self.assertEqual(report['error']['code'], 'SANDBOX_CONFIGURATION_REQUIRED')
        self.assertFalse(any(step['agent'] == 'ExerciseGeneratorAgent' for step in report['agent_traces']))

    def test_router_allows_a_real_fallback_provider_window(self):
        self.assertGreaterEqual(stage_budget_seconds('IntentRouterAgent'), 40)
        self.assertGreaterEqual(stage_call_timeout('IntentRouterAgent'), 10)

    def test_router_timeout_is_not_divided_by_unusable_extra_keys(self):
        pool = AIKeyPoolManager()
        pool._provider_pools['GEMINI'] = [f'qa-key-{index}' for index in range(8)]
        pool._last_fetch_time = time.time()
        client = PipelineLLMClient(timeout_seconds=30)
        response = FakeProviderResponse(200, {'responseId': 'qa-response',
            'candidates': [{'content': {'parts': [{'text': '{"ok":true}'}]}}]})
        with patch.dict(os.environ, {'ADAPTIVE_PROVIDER': 'GEMINI'}, clear=False), \
             patch.object(llm_client_module, 'key_pool', pool), \
             patch.object(client, '_model', return_value='gemini-3.8-flash'), \
             patch.object(llm_client_module.requests, 'post', return_value=response):
            self.assertEqual(client.json('IntentRouterAgent', 'router', {'request': 'set'}), {'ok': True})
        self.assertGreaterEqual(client.calls[0]['deadline_ms'], 9000)

    def test_explicit_set_request_routes_without_provider_and_keeps_quantity(self):
        class UnavailableClient:
            def json(self, *_args):
                raise AssertionError('Unambiguous catalog request must not call a provider')
        router = IntentRouterAgent(UnavailableClient())
        for request in ('Hãy tạo cho tôi bài tập set trong Python',
                        'Tạo 4 bài tập về Tập hợp bằng Python'):
            with self.subTest(request=request):
                route = router.route(request)
                self.assertEqual(route.intent, 'REQUEST_ADAPTIVE_EXERCISE')
                self.assertEqual(route.language, 'python')
                self.assertEqual(route.topic, 'PY-SET-01')
                self.assertTrue(route.language_confirmed)
                self.assertEqual(route.user_text, request)
                self.assertIn(route.topic_evidence[0], request)

    def test_all_content_agents_budget_only_the_keys_they_can_try(self):
        for stage in ("ExerciseGeneratorAgent", "ExplanationTutorAgent", "CriticEvaluatorAgent"):
            with self.subTest(stage=stage):
                pool = AIKeyPoolManager()
                pool._provider_pools["GEMINI"] = [f"qa-key-{index}" for index in range(13)]
                pool._last_fetch_time = time.time()
                client = PipelineLLMClient(timeout_seconds=300)
                response = FakeProviderResponse(200, {"responseId": "qa-content-response",
                    "candidates": [{"content": {"parts": [{"text": '{"ok":true}'}]}}]})
                with patch.dict(os.environ, {"ADAPTIVE_PROVIDER": "GEMINI"}, clear=False), \
                     patch.object(llm_client_module, "key_pool", pool), \
                     patch.object(client, "_model", return_value="gemini-3.8-flash"), \
                     patch.object(llm_client_module.requests, "post", return_value=response):
                    self.assertEqual(client.json(stage, "content", {"request": "for"}), {"ok": True})
                self.assertGreaterEqual(client.calls[0]["deadline_ms"], (stage_call_timeout(stage) - 1) * 1000)

    def test_large_pools_do_not_shrink_the_last_content_provider_to_five_seconds(self):
        import requests
        pool = AIKeyPoolManager()
        for provider in ("GEMINI", "GROQ", "OPENROUTER", "INCEPTION"):
            pool._provider_pools[provider] = [f"qa-{provider}-{index}" for index in range(12)]
        pool._last_fetch_time = time.time()
        elapsed = [1000.0]
        def post(url, **_kwargs):
            if "inceptionlabs" in url:
                elapsed[0] += 2
                return FakeProviderResponse(200, {"id": "qa-inception", "choices": [
                    {"message": {"content": '{"ok":true}'}}]})
            if "openrouter" in url:
                elapsed[0] += 8
                raise requests.Timeout()
            elapsed[0] += 1
            return FakeProviderResponse(429)
        with patch.dict(os.environ, {"ADAPTIVE_PROVIDER": ""}, clear=False), \
             patch.dict(llm_client_module._provider_blocked_until, {}, clear=True), \
             patch.object(llm_client_module, "key_pool", pool), \
             patch.object(llm_client_module.time, "monotonic", side_effect=lambda: elapsed[0]), \
             patch.object(pool, "mark_key_exhausted"), patch.object(pool, "mark_key_temporarily_unavailable"), \
             patch.object(pool, "report_key_success"), patch.object(pool, "log_call_async"), \
             patch.object(llm_client_module.requests, "post", side_effect=post):
            client = PipelineLLMClient(timeout_seconds=300)
            with patch.object(client, "_model", return_value="qa-model"):
                self.assertEqual(client.json("ExplanationTutorAgent", "theory", {}), {"ok": True})
        final = [call for call in client.calls if call["provider"] == "INCEPTION" and call["status"] == "SUCCEEDED"]
        self.assertEqual(len(final), 1)
        self.assertGreaterEqual(final[0]["deadline_ms"], 15000)

    def test_practice_feedback_preserves_fallback_after_a_slow_provider(self):
        import requests
        pool = AIKeyPoolManager()
        for provider in ("GEMINI", "GROQ", "OPENROUTER", "INCEPTION"):
            pool._provider_pools[provider] = [f"qa-{provider}-{index}" for index in range(12)]
        pool._last_fetch_time = time.time()
        elapsed = [1000.0]
        def post(url, **_kwargs):
            if "googleapis" in url:
                elapsed[0] += 1
                return FakeProviderResponse(429)
            if "inceptionlabs" in url:
                elapsed[0] += 1
                return FakeProviderResponse(200, {"id": "qa-feedback", "choices": [
                    {"message": {"content": '{"ok":true}'}}]})
            elapsed[0] += 8
            raise requests.Timeout()
        with patch.dict(os.environ, {"ADAPTIVE_PROVIDER": ""}, clear=False), \
             patch.dict(llm_client_module._provider_blocked_until, {}, clear=True), \
             patch.object(llm_client_module, "key_pool", pool), \
             patch.object(llm_client_module.time, "monotonic", side_effect=lambda: elapsed[0]), \
             patch.object(pool, "mark_key_exhausted"), patch.object(pool, "mark_key_temporarily_unavailable"), \
             patch.object(pool, "report_key_success"), patch.object(pool, "log_call_async"), \
             patch.object(llm_client_module.requests, "post", side_effect=post):
            client = PipelineLLMClient(timeout_seconds=26)
            with patch.object(client, "_model", return_value="qa-model"):
                self.assertEqual(client.json("PracticeFeedbackAgent", "feedback", {}), {"ok": True})
        slow = [call for call in client.calls if call["provider"] == "GROQ" and call["status"] == "FAILED"]
        self.assertEqual(len(slow), 1, "Do not spend the entire 25s on two slow sibling keys")
        self.assertTrue(any(call.get("error_code") == "PROVIDER_WINDOW_EXHAUSTED" for call in client.calls))
        self.assertEqual(client.calls[-1]["provider"], "INCEPTION")
        self.assertLess(elapsed[0] - 1000, 25)

    def test_compound_request_does_not_bypass_provider(self):
        router = IntentRouterAgent()
        self.assertIsNone(router.exact_catalog_exercise('Tạo bài tập set và list trong Python'))
        self.assertIsNone(router.exact_catalog_exercise('Tạo bài tập set không dùng for trong Python'))
        self.assertIsNone(router.exact_catalog_exercise('Tạo bài tập set trong JavaScript'))
        self.assertIsNone(router.exact_catalog_exercise('Tạo bài tập set trong Python',
            {'pending_confirmation': {'type': 'LEARNING_MODE_SELECTION'}}))

    def test_exact_prerequisite_button_does_not_need_a_provider(self):
        router = IntentRouterAgent()
        concept = router.kg.get_concept('python', 'PY-SET-01')
        pending = {'type': 'PREREQUISITE_OVERRIDE', 'language': 'python',
                   'target_concept_id': 'PY-SET-01', 'exercise_count': 4,
                   'original_user_request': 'Tạo 4 bài tập Set bằng Python'}
        route = router.route(f"Vẫn tạo bài {concept['name']} cho tôi", {'pending_confirmation': pending})
        self.assertTrue(route.confirm_prerequisite_override)
        self.assertEqual(route.topic, 'PY-SET-01')
        self.assertEqual(route.user_text, pending['original_user_request'])

    def test_text_critic_contract_rechecks_false_json_requirement(self):
        original = AdaptiveLearningOrchestrator(Client, Sandbox).process_turn(
            'u', [{'sender': 'USER', 'content': 'Tạo 1 bài Python'}])
        from app.contracts.specification import ExerciseSpecification
        spec = ExerciseSpecification.model_validate(original['exercise']['spec_snapshot'])
        class Critic:
            calls = []
            def json(self, stage, system, payload):
                self.calls.append(payload)
                if len(self.calls) == 1:
                    return {**REVIEW, 'is_approved': False, 'exercise_approved': False,
                            'feedback_target': 'EXERCISE', 'feedback': 'expected_output cần bọc thành JSON string.'}
                return copy.deepcopy(REVIEW)
        critic = Critic()
        reviewed = CriticEvaluatorAgent(critic).evaluate_content('Nội dung đúng.', STDIO_DRAFT, spec, True)
        self.assertTrue(reviewed['is_approved'])
        self.assertEqual(len(critic.calls), 2)
        self.assertTrue(all('Không parse JSON' in c['expected_output_contract'] for c in critic.calls))

    def test_exhausted_run_saves_candidate_and_retries_sandbox_with_full_budget(self):
        class Expiring(Client):
            def remaining(self):
                return 3.5 if self.exercise_calls else 300
        class CountingSandbox(Sandbox):
            budgets = []
            @staticmethod
            def validate(draft, spec, timeout=40):
                CountingSandbox.budgets.append(timeout)
                return Sandbox.validate(draft, spec, timeout)
        history = [{'sender': 'USER', 'content': 'Tạo 4 bài Python'}]
        first = AdaptiveLearningOrchestrator(Expiring, CountingSandbox).process_turn('u', history)
        self.assertEqual(first['error']['code'], 'RUN_DEADLINE_EXCEEDED')
        self.assertEqual(first['exercise_count'], 4)
        self.assertEqual(CountingSandbox.budgets, [])
        client = Client()
        second = AdaptiveLearningOrchestrator(lambda: client, CountingSandbox).process_turn(
            'u', history, resume_report=first, run_attempt=2)
        self.assertEqual(second['status'], 'SUCCEEDED', second.get('error'))
        self.assertEqual(client.exercise_calls, 0)
        self.assertEqual(second['exercise_count'], 4)
        self.assertGreaterEqual(CountingSandbox.budgets[0], 30)


if __name__ == '__main__':
    unittest.main()
