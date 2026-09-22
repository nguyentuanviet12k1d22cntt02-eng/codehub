import json
import os
import requests
from app.pipeline.runtime import signed_headers
from app.pipeline.llm_client import PipelineError


class SandboxValidator:
    """Delegate to the same strict Docker harness used by the backend grader."""
    @classmethod
    def validate(cls, exercise_data, spec=None, timeout=40):
        if spec is None:
            return False, ["EXECUTION_SPEC_REQUIRED"], []
        body = json.dumps({"exercise": exercise_data, "specification": spec.model_dump()}, ensure_ascii=False)
        base = os.getenv("ADAPTIVE_BACKEND_URL", "http://127.0.0.1:3000").rstrip("/")
        try:
            response = requests.post(base + "/api/internal/adaptive/validate", data=body.encode(), headers=signed_headers(body), timeout=timeout)
            response.raise_for_status()
            result = response.json()
            if result.get("status") == "INFRA_ERROR":
                raise PipelineError("SANDBOX_UNAVAILABLE", result.get("error", "Sandbox unavailable"))
            cases = result.get("test_results", [])
            passed = result.get("passed") is True and len(cases) == len(exercise_data["test_cases"]) and all(t.get("passed") is True and t.get("executed") is True for t in cases)
            return passed, result.get("errors", []), cases
        except PipelineError:
            raise
        except Exception as exc:
            raise PipelineError("SANDBOX_UNAVAILABLE", "Không nhận được bằng chứng chạy mã từ Docker runner") from exc
