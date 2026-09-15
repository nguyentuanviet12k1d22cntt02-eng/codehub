import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class ExecutionResult(BaseModel):
    """
    Kết quả thực thi code học viên từ Sandbox/Runner.
    """
    submission_id: str = Field(
        ...,
        description="Mã phiên nộp bài"
    )
    user_id: Optional[str] = Field(
        default=None,
        description="Mã học viên"
    )
    exercise_id: Optional[str] = Field(
        default=None,
        description="Mã bài tập"
    )
    concept_id: Optional[str] = Field(
        default=None,
        description="Mã concept bài tập được giao"
    )
    status: str = Field(
        ...,
        description="Trạng thái: PASSED, WRONG_ANSWER, COMPILE_ERROR, RUNTIME_ERROR, TIMEOUT, CONSTRAINT_VIOLATION"
    )
    passed_count: int = Field(
        default=0,
        description="Số lượng test case vượt qua"
    )
    total_count: int = Field(
        default=0,
        description="Tổng số test case"
    )
    test_results: List[Dict[str, Any]] = Field(
        default_factory=list,
        description="Chi tiết từng test case: id, input, expected, actual, passed, error"
    )
    code: str = Field(
        default="",
        description="Mã nguồn học viên nộp"
    )
    runtime: str = Field(
        default="python",
        description="Môi trường chạy: python, cpp, javascript, sql"
    )
    raw_error: Optional[str] = Field(
        default=None,
        description="Thông báo lỗi thô từ compiler/interpreter stderr"
    )
    trace_id: str = Field(
        default_factory=lambda: f"trace_{uuid.uuid4().hex[:12]}",
        description="Mã truy vết phân tán"
    )


class ErrorEvent(BaseModel):
    """
    Sự kiện lỗi đã được chuẩn hóa bởi ErrorAnalyzer từ ExecutionResult.
    Chuẩn hóa taxonomy lỗi thống nhất giữa Python, C++, JavaScript.
    """
    error_id: str = Field(
        default_factory=lambda: f"err_{uuid.uuid4().hex[:10]}",
        description="Mã định danh duy nhất của lỗi"
    )
    submission_id: str = Field(
        ...,
        description="Mã phiên nộp bài"
    )
    normalized_type: str = Field(
        ...,
        description="Loại lỗi chuẩn hóa: SYNTAX_ERROR, TYPE_ERROR, LOGIC_ERROR, RUNTIME_ERROR, CONSTRAINT_VIOLATION, TIMEOUT"
    )
    sub_type: Optional[str] = Field(
        default=None,
        description="Phân loại lỗi chi tiết (ví dụ: NameError, TypeError, IndexOutOfBounds, SegmentFault, SyntaxError)"
    )
    message: str = Field(
        ...,
        description="Thông điệp lỗi đã tinh lọc, thân thiện với học viên"
    )
    test_case_id: Optional[str] = Field(
        default=None,
        description="ID của test case đầu tiên bị fail"
    )
    code_location: Optional[str] = Field(
        default=None,
        description="Vị trí dòng code hoặc hàm gây ra lỗi (ví dụ: 'line 14, in calculate_average')"
    )
    code_excerpt: Optional[str] = Field(
        default=None,
        description="Đoạn mã ngắn chứa lỗi"
    )
    severity: str = Field(
        default="MEDIUM",
        description="Mức độ nghiêm trọng: HIGH (compile/syntax chặn thực thi), MEDIUM (sai logic test case), LOW (cảnh báo style/hiệu năng)"
    )
    created_at: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat(),
        description="Thời điểm phát sinh lỗi"
    )
    trace_id: str = Field(
        default_factory=lambda: f"trace_{uuid.uuid4().hex[:12]}",
        description="Mã truy vết phân tán"
    )
