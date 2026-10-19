from __future__ import annotations

import os
import unittest

os.environ["GRADER_API_TOKEN"] = "unit-test-token-" + "x" * 32

from fastapi.testclient import TestClient

from app import main
from app.models import ExecuteResponse


class FakeExecutor:
    def readiness(self):
        return True, []

    def execute(self, payload, request_id):
        return ExecuteResponse.model_validate({
            "requestId": request_id,
            "provider": "aws-docker",
            "language": payload.language.value,
            "results": [{
                "stdout": "ok\n",
                "stderr": "",
                "status": "SUCCESS",
                "runtimeMs": 3,
            } for _ in payload.inputs],
        })


class ApiTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.original_executor = main.executor
        main.executor = FakeExecutor()
        cls.client = TestClient(main.app)

    @classmethod
    def tearDownClass(cls) -> None:
        main.executor = cls.original_executor

    def test_requires_bearer_token(self) -> None:
        response = self.client.post("/v1/execute", json={
            "language": "PYTHON", "sourceCode": "print(1)", "inputs": [""],
        })
        self.assertEqual(response.status_code, 401)

    def test_returns_one_result_per_input(self) -> None:
        response = self.client.post(
            "/v1/execute",
            headers={
                "Authorization": f"Bearer {os.environ['GRADER_API_TOKEN']}",
                "X-Request-ID": "unit-test-request-001",
            },
            json={
                "language": "CPP",
                "sourceCode": "#include <iostream>\nint main(){return 0;}",
                "inputs": ["a", "b"],
                "timeoutMs": 1000,
                "memoryKb": 65536,
            },
        )
        self.assertEqual(response.status_code, 200, response.text)
        payload = response.json()
        self.assertEqual(payload["requestId"], "unit-test-request-001")
        self.assertEqual(payload["provider"], "aws-docker")
        self.assertEqual(len(payload["results"]), 2)


if __name__ == "__main__":
    unittest.main()
