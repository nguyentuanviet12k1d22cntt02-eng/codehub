import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class CandidateAttribution(BaseModel):
    concept: str = Field(
        ...,
        description="Mã concept ứng viên gây ra lỗi (ví dụ: JS-FUNC-01, JS-BASICS-01)"
    )
    sub_skill: Optional[str] = Field(
        default=None,
        description="Kỹ năng con ứng viên (ví dụ: parameters, scope, recursion)"
    )
    confidence: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Độ tin cậy xác suất quy kết lỗi vào concept này (0.0 đến 1.0)"
    )


class ConceptAttribution(BaseModel):
    """
    Contract quy kết lỗi về concept/sub-skill từ Concept Attribution Service.
    Không được cập nhật mastery trực tiếp; chỉ tạo attribution event.
    """
    error_id: str = Field(
        ...,
        description="Mã lỗi ErrorEvent được quy kết"
    )
    submission_id: str = Field(
        ...,
        description="Mã phiên nộp bài"
    )
    candidates: List[CandidateAttribution] = Field(
        default_factory=list,
        description="Danh sách các concept/sub-skill ứng viên được xếp hạng theo confidence"
    )
    selected: Optional[CandidateAttribution] = Field(
        default=None,
        description="Ứng viên có điểm confidence cao nhất được chọn (hoặc None nếu unresolved)"
    )
    evidence: str = Field(
        default="",
        description="Bằng chứng suy luận quy kết (ví dụ: 'Code sử dụng biến ngoài phạm vi hàm dẫn đến rò rỉ scope')"
    )
    model_version: str = Field(
        default="concept_attr_v2.1",
        description="Phiên bản mô hình quy kết"
    )
    created_at: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat(),
        description="Thời điểm quy kết"
    )
    trace_id: str = Field(
        default_factory=lambda: f"trace_{uuid.uuid4().hex[:12]}",
        description="Mã truy vết phân tán"
    )
