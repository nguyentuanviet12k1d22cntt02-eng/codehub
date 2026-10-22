import os
import unittest
from unittest.mock import patch

import requests

from app.pipeline.llm_client import PipelineError
from app.validation.sandbox_validator import SandboxValidator, backend_base_url


class StubSpec:
    def model_dump(self):
        return {"language": "python"}


class SandboxBackendUrlTests(unittest.TestCase):
    def test_uses_key_pool_backend_origin_instead_of_localhost(self):
        with patch.dict(os.environ, {
            "BACKEND_INTERNAL_URL": "https://backend.example.com/api/internal/ai-keys",
            "ADAPTIVE_BACKEND_URL": "",
            "ADAPTIVE_INTERNAL_SECRET": "test-secret",
        }):
            with patch("app.validation.sandbox_validator.requests.post") as post:
                post.return_value.json.return_value = {
                    "status": "EXECUTED", "passed": True,
                    "test_results": [{"passed": True, "executed": True}], "errors": [],
                }
                passed, errors, cases = SandboxValidator.validate(
                    {"test_cases": [{}]}, StubSpec(), timeout=5
                )
                self.assertTrue(passed)
                self.assertEqual(errors, [])
                self.assertEqual(len(cases), 1)
                self.assertEqual(post.call_args.args[0],
                    "https://backend.example.com/api/internal/adaptive/validate")

    def test_explicit_sandbox_backend_takes_priority(self):
        with patch.dict(os.environ, {
            "ADAPTIVE_BACKEND_URL": "https://sandbox.example.com/",
            "BACKEND_INTERNAL_URL": "https://backend.example.com/api/internal/ai-keys",
        }):
            self.assertEqual(backend_base_url(), "https://sandbox.example.com")

    def test_remote_http_url_is_rejected(self):
        with patch.dict(os.environ, {"ADAPTIVE_BACKEND_URL": "http://backend.example.com"}):
            with self.assertRaises(PipelineError) as caught:
                backend_base_url()
            self.assertEqual(caught.exception.code, "SANDBOX_BACKEND_URL_INVALID")

    def test_connection_failure_has_actionable_error(self):
        with patch.dict(os.environ, {
            "ADAPTIVE_BACKEND_URL": "https://backend.example.com",
            "ADAPTIVE_INTERNAL_SECRET": "test-secret",
        }):
            with patch("app.validation.sandbox_validator.requests.post", side_effect=requests.ConnectionError()):
                with self.assertRaises(PipelineError) as caught:
                    SandboxValidator.validate({"test_cases": [{}]}, StubSpec(), timeout=5)
                self.assertEqual(caught.exception.code, "SANDBOX_BACKEND_UNREACHABLE")

    def test_infrastructure_failure_keeps_provider_diagnostics_in_admin_details(self):
        with patch.dict(os.environ, {
            "ADAPTIVE_BACKEND_URL": "https://backend.example.com",
            "ADAPTIVE_INTERNAL_SECRET": "test-secret",
        }):
            with patch("app.validation.sandbox_validator.requests.post") as post:
                post.return_value.json.return_value = {
                    "status": "INFRA_ERROR", "error": "Isolated sandbox unavailable",
                    "test_results": [{"status": "INFRA_ERROR", "image": "AWS_DOCKER",
                                      "stderr": "AWS_DOCKER_HTTP_503"}],
                }
                with self.assertRaises(PipelineError) as caught:
                    SandboxValidator.validate({"test_cases": [{}]}, StubSpec(), timeout=5)
                self.assertEqual(caught.exception.code, "SANDBOX_UNAVAILABLE")
                self.assertEqual(caught.exception.details, {
                    "provider": "AWS_DOCKER", "provider_error": "AWS_DOCKER_HTTP_503",
                })


if __name__ == "__main__":
    unittest.main()
