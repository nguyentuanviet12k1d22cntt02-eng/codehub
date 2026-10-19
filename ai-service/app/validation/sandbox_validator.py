import json
import os
import requests
from urllib.parse import urlsplit
from app.pipeline.runtime import signed_headers
from app.pipeline.llm_client import PipelineError


def backend_base_url():
    """Use the same backend origin as the AI key pool when no dedicated URL is set."""
    configured = os.getenv("ADAPTIVE_BACKEND_URL") or os.getenv("BACKEND_INTERNAL_URL")
    if not configured:
        return "http://127.0.0.1:3000"  # Local development only.
    parsed = urlsplit(configured.strip())
    if parsed.scheme not in ("https", "http") or not parsed.hostname or parsed.username or parsed.password:
        raise PipelineError("SANDBOX_BACKEND_URL_INVALID", "Địa chỉ backend sandbox không hợp lệ")
    if parsed.scheme != "https" and parsed.hostname not in ("localhost", "127.0.0.1"):
        raise PipelineError("SANDBOX_BACKEND_URL_INVALID", "Backend sandbox từ xa phải dùng HTTPS")
    return f"{parsed.scheme}://{parsed.netloc}"


class SandboxValidator:
    """Delegate generated-code verification to the backend's configured isolated sandbox."""
    @classmethod
    def validate(cls, exercise_data, spec=None, timeout=40):
        if spec is None:
            return False, ["EXECUTION_SPEC_REQUIRED"], []
        body = json.dumps({"exercise": exercise_data, "specification": spec.model_dump()}, ensure_ascii=False)
        base = backend_base_url()
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
        except requests.HTTPError as exc:
            if exc.response is not None and exc.response.status_code == 401:
                raise PipelineError("SANDBOX_AUTH_FAILED", "AI service và backend chưa dùng cùng secret xác thực nội bộ") from exc
            raise PipelineError("SANDBOX_BACKEND_HTTP_ERROR", "Backend sandbox trả lỗi HTTP") from exc
        except requests.ConnectionError as exc:
            raise PipelineError("SANDBOX_BACKEND_UNREACHABLE", "AI service không kết nối được backend sandbox; kiểm tra ADAPTIVE_BACKEND_URL hoặc BACKEND_INTERNAL_URL") from exc
        except requests.Timeout as exc:
            raise PipelineError("SANDBOX_BACKEND_TIMEOUT", "Backend sandbox không trả kết quả trong thời hạn") from exc
        except Exception as exc:
            raise PipelineError("SANDBOX_UNAVAILABLE", "Không nhận được bằng chứng chạy mã từ sandbox") from exc
