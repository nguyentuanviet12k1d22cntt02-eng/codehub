from __future__ import annotations

import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from pydantic import ValidationError

from app.models import ExecuteRequest


ROOT = Path(__file__).resolve().parents[1]
RUNNER = ROOT / "runners" / "common" / "runner.py"


class RequestContractTests(unittest.TestCase):
    def test_accepts_supported_bounded_request(self) -> None:
        request = ExecuteRequest.model_validate({
            "language": "PYTHON",
            "sourceCode": "print(input())",
            "inputs": ["hello"],
            "timeoutMs": 1000,
            "memoryKb": 65536,
        })
        self.assertEqual(request.language.value, "PYTHON")

    def test_rejects_oversized_source_and_unknown_fields(self) -> None:
        with self.assertRaises(ValidationError):
            ExecuteRequest.model_validate({
                "language": "PYTHON",
                "sourceCode": "x" * 50001,
                "inputs": [""],
                "secretExpectedOutput": "must-not-cross-boundary",
            })


class RunnerContractTests(unittest.TestCase):
    def run_runner(self, source: str, inputs: list[str]) -> dict:
        with tempfile.TemporaryDirectory(dir=ROOT) as directory:
            work = Path(directory) / "work"
            work.mkdir()
            request_path = Path(directory) / "request.json"
            request_path.write_text(json.dumps({
                "language": "PYTHON",
                "source_code": source,
                "inputs": inputs,
                "timeout_ms": 1000,
                "memory_kb": 65536,
                "output_limit_bytes": 16384,
            }), encoding="utf-8")
            env = {**os.environ, "GRADER_WORK_DIR": str(work)}
            completed = subprocess.run(
                [sys.executable, str(RUNNER), str(request_path)],
                capture_output=True,
                text=True,
                timeout=4,
                env=env,
                check=False,
            )
            self.assertEqual(completed.returncode, 0, completed.stderr)
            return json.loads(completed.stdout)

    def test_compiles_once_and_returns_ordered_results(self) -> None:
        payload = self.run_runner("print(input()[::-1])", ["abc\n", "xyz\n"])
        self.assertEqual([item["stdout"].strip() for item in payload["results"]], ["cba", "zyx"])
        self.assertTrue(all(item["status"] == "SUCCESS" for item in payload["results"]))

    def test_syntax_error_is_compile_error_for_every_input(self) -> None:
        payload = self.run_runner("def broken(:\n    pass", ["a", "b"])
        self.assertEqual(len(payload["results"]), 2)
        self.assertTrue(all(item["failureType"] == "COMPILE_ERROR" for item in payload["results"]))

    def test_output_limit_has_a_specific_failure_type(self) -> None:
        payload = self.run_runner("print('x' * 20000)", [""])
        item = payload["results"][0]
        self.assertEqual(item["status"], "ERROR")
        self.assertEqual(item["failureType"], "OUTPUT_LIMIT_EXCEEDED")
        self.assertLessEqual(len(item["stdout"].encode("utf-8")), 16384)


if __name__ == "__main__":
    unittest.main()
