import re
import uuid
from datetime import datetime, timezone
from typing import Optional
from app.contracts.execution import ExecutionResult, ErrorEvent


class ErrorAnalyzer:
    """
    Service phân tích và chuẩn hóa lỗi (Error Analyzer).
    Chuẩn hóa lỗi biên dịch/runtime/test failure từ Python, C++, JavaScript
    thành ErrorEvent có cùng taxonomy thống nhất.
    """

    @classmethod
    def analyze(cls, exec_result: ExecutionResult) -> Optional[ErrorEvent]:
        # Nếu đã pass thì không có ErrorEvent
        if exec_result.status == "PASSED":
            return None

        status = exec_result.status
        raw_err = (exec_result.raw_error or "").strip()
        runtime = exec_result.runtime.lower()
        sub_id = exec_result.submission_id
        t_id = exec_result.trace_id

        norm_type = "LOGIC_ERROR"
        sub_type = "WrongAnswer"
        message = "Kết quả chạy thực tế không khớp với kết quả kỳ vọng của test case."
        test_case_id = None
        code_location = None
        code_excerpt = None
        severity = "MEDIUM"

        # 1. Tìm test case đầu tiên bị fail nếu có
        for tc in exec_result.test_results:
            if not tc.get("passed"):
                test_case_id = tc.get("id") or str(tc.get("case_index", ""))
                if tc.get("error"):
                    raw_err = raw_err or tc["error"]
                break

        # 2. Phân loại theo status và raw_error
        if status == "TIMEOUT":
            norm_type = "TIMEOUT"
            sub_type = "ExecutionTimeout"
            message = "Chương trình chạy vượt quá thời gian cho phép (5000ms), có thể do vòng lặp vô tận."
            severity = "HIGH"

        elif status == "CONSTRAINT_VIOLATION":
            norm_type = "CONSTRAINT_VIOLATION"
            sub_type = "SyntaxConstraintMismatch"
            message = raw_err or "Mã nguồn vi phạm ràng buộc kỹ thuật của đề bài."
            severity = "HIGH"

        elif status == "COMPILE_ERROR" or (raw_err and any(k in raw_err for k in ["SyntaxError", "IndentationError", "expected ';'", "was not declared in this scope"])):
            norm_type = "SYNTAX_ERROR"
            sub_type = cls._extract_syntax_subtype(raw_err, runtime)
            message = cls._format_friendly_syntax_error(raw_err, runtime)
            code_location = cls._extract_code_location(raw_err)
            severity = "HIGH"

        elif status == "RUNTIME_ERROR" or (raw_err and any(k in raw_err for k in ["ZeroDivisionError", "IndexError", "TypeError", "NameError", "AttributeError", "KeyError", "ReferenceError", "segmentation fault"])):
            norm_type = "RUNTIME_ERROR"
            sub_type = cls._extract_runtime_subtype(raw_err, runtime)
            message = cls._format_friendly_runtime_error(raw_err, runtime)
            code_location = cls._extract_code_location(raw_err)
            severity = "MEDIUM"

        else:
            # Logic error: output mismatch
            norm_type = "LOGIC_ERROR"
            sub_type = "MismatchOutput"
            if exec_result.test_results:
                failed_tc = next((t for t in exec_result.test_results if not t.get("passed")), None)
                if failed_tc:
                    exp = failed_tc.get("expected")
                    act = failed_tc.get("actual")
                    message = f"Kết quả chưa khớp: Kỳ vọng '{exp}', nhưng nhận được '{act}'."

        return ErrorEvent(
            error_id=f"err_{uuid.uuid4().hex[:10]}",
            submission_id=sub_id,
            normalized_type=norm_type,
            sub_type=sub_type,
            message=message,
            test_case_id=test_case_id,
            code_location=code_location,
            code_excerpt=code_excerpt,
            severity=severity,
            created_at=datetime.now(timezone.utc).isoformat(),
            trace_id=t_id
        )

    @classmethod
    def _extract_syntax_subtype(cls, raw: str, runtime: str) -> str:
        if "IndentationError" in raw:
            return "IndentationError"
        if "SyntaxError" in raw:
            return "SyntaxError"
        if "expected" in raw:
            return "MissingToken"
        return "CompileError"

    @classmethod
    def _extract_runtime_subtype(cls, raw: str, runtime: str) -> str:
        common_types = [
            "ZeroDivisionError", "IndexError", "TypeError", "NameError",
            "AttributeError", "KeyError", "RecursionError", "ReferenceError",
            "RangeError", "segmentation fault"
        ]
        for t in common_types:
            if t.lower() in raw.lower():
                return t
        return "GeneralRuntimeError"

    @classmethod
    def _extract_code_location(cls, raw: str) -> Optional[str]:
        # Bắt "line 12" hoặc "line: 12"
        match = re.search(r"line\s*[:\s]?\s*(\d+)", raw, re.IGNORECASE)
        if match:
            return f"Dòng {match.group(1)}"
        return None

    @classmethod
    def _format_friendly_syntax_error(cls, raw: str, runtime: str) -> str:
        if "IndentationError" in raw:
            return "Lỗi thụt lề (IndentationError): Vui lòng kiểm tra các khối lệnh con sau dấu ':'."
        if "SyntaxError" in raw:
            return "Lỗi cú pháp (SyntaxError): Kiểm tra đóng/mở ngoặc, dấu nháy hoặc dấu hai chấm."
        return f"Lỗi biên dịch: {raw[:150]}"

    @classmethod
    def _format_friendly_runtime_error(cls, raw: str, runtime: str) -> str:
        if "NameError" in raw:
            return "Lỗi tên biến/hàm chưa định nghĩa (NameError): Bạn đang gọi một biến hoặc hàm trước khi khai báo."
        if "TypeError" in raw:
            return "Lỗi kiểu dữ liệu (TypeError): Phép toán hoặc tham số truyền vào không khớp kiểu yêu cầu."
        if "IndexError" in raw:
            return "Lỗi vượt quá kích thước mảng/chuỗi (IndexError): Chỉ số truy cập nằm ngoài phạm vi."
        if "ZeroDivisionError" in raw:
            return "Lỗi chia cho số 0 (ZeroDivisionError): Hãy kiểm tra điều kiện mẫu số trước khi chia."
        return f"Lỗi thời gian chạy (Runtime): {raw[:150]}"
