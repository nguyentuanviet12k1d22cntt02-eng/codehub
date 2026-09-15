import uuid
from datetime import datetime, timezone
from typing import List, Optional
from pydantic import BaseModel, Field


class LearnerState(BaseModel):
    """
    Trạng thái năng lực của một học viên đối với một Concept cụ thể.
    Lớp dữ liệu này hoàn toàn độc lập với Knowledge Graph (không lưu trạng thái vào KG).
    """
    user_id: str = Field(
        ...,
        description="Mã học viên"
    )
    concept_id: str = Field(
        ...,
        description="Mã concept (ví dụ: JS-FUNC-01, CPP-OOP-01, PY-LOOPS-01)"
    )
    mastery: float = Field(
        default=0.40,
        ge=0.0,
        le=1.0,
        description="Độ thành thạo hiện tại (0.0 đến 1.0)"
    )
    confidence: float = Field(
        default=0.50,
        ge=0.0,
        le=1.0,
        description="Độ tin cậy của ước lượng mastery (dựa trên số lượng mẫu dữ liệu)"
    )
    attempts: int = Field(
        default=0,
        description="Tổng số lần nộp bài cho concept này"
    )
    correct_count: int = Field(
        default=0,
        description="Số lần làm đúng"
    )
    wrong_count: int = Field(
        default=0,
        description="Số lần làm sai"
    )
    last_attempt_at: Optional[str] = Field(
        default=None,
        description="Thời điểm làm bài gần nhất"
    )
    current_streak: int = Field(
        default=0,
        description="Chuỗi đúng liên tiếp hiện tại (âm nếu sai liên tiếp)"
    )
    recent_error_ids: List[str] = Field(
        default_factory=list,
        description="Danh sách ID các lỗi gần đây học viên mắc phải trên concept này"
    )


class MasteryEvent(BaseModel):
    """
    Sự kiện cập nhật Mastery theo chính sách tất định (Deterministic Mastery Policy).
    Đảm bảo 100% tính minh bạch và truy vết lý do thay đổi điểm năng lực.
    """
    event_id: str = Field(
        default_factory=lambda: f"mevt_{uuid.uuid4().hex[:10]}",
        description="Mã sự kiện thay đổi mastery"
    )
    user_id: str = Field(
        ...,
        description="Mã học viên"
    )
    concept_id: str = Field(
        ...,
        description="Mã concept bị cập nhật"
    )
    previous_mastery: float = Field(
        ...,
        description="Mức mastery trước khi cập nhật"
    )
    delta: float = Field(
        ...,
        description="Mức tăng/giảm (+/-)"
    )
    new_mastery: float = Field(
        ...,
        description="Mức mastery mới sau cập nhật (kẹp trong khoảng [0.05, 1.0])"
    )
    reason: str = Field(
        ...,
        description="Lý do cập nhật: EXERCISE_PASSED, ATTRIBUTED_ERROR_PENALTY, REPEATED_FAILURE, etc."
    )
    evidence_ids: List[str] = Field(
        default_factory=list,
        description="Danh sách ID bằng chứng (submission_id, error_id, test_case_id)"
    )
    policy_version: str = Field(
        default="mastery_policy_v2.1",
        description="Phiên bản quy tắc tính điểm năng lực"
    )
    created_at: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat(),
        description="Thời điểm phát sinh sự kiện"
    )
    trace_id: str = Field(
        default_factory=lambda: f"trace_{uuid.uuid4().hex[:12]}",
        description="Mã truy vết phân tán"
    )
