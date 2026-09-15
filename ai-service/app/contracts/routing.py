import uuid
from typing import Optional
from pydantic import BaseModel, Field


class RoutingDecision(BaseModel):
    """
    Contract chuẩn hóa định tuyến ý định người học từ IntentRouterAgent.
    Không được sinh bài, không được quyết định mastery, chỉ phân loại intent và trích xuất ngữ cảnh.
    """
    intent: str = Field(
        ...,
        description="Loại ý định: GENERAL_CHAT, EXPLAIN_CONCEPT, ASK_KNOWLEDGE, REQUEST_ADAPTIVE_EXERCISE, CREATE_LEARNING_PATH, CHECK_WEAKNESS"
    )
    language: str = Field(
        default="python",
        description="Ngôn ngữ lập trình mục tiêu: python, cpp, javascript, sql"
    )
    topic: Optional[str] = Field(
        default=None,
        description="Chủ đề trích xuất từ câu hỏi (ví dụ: function, loop, pointer, oop, dictionary)"
    )
    difficulty_request: str = Field(
        default="auto",
        description="Yêu cầu độ khó từ người dùng: easier, same, harder, auto"
    )
    mode: str = Field(
        default="progression",
        description="Chế độ học tập: remediation (khắc phục điểm yếu), progression (tiến trình), diagnostic (chẩn đoán)"
    )
    confidence: float = Field(
        default=1.0,
        ge=0.0,
        le=1.0,
        description="Độ tin cậy của bộ phân loại (0.0 đến 1.0)"
    )
    user_text: str = Field(
        default="",
        description="Văn bản gốc từ người dùng"
    )
    trace_id: str = Field(
        default_factory=lambda: f"trace_{uuid.uuid4().hex[:12]}",
        description="Mã truy vết phân tán cho toàn bộ request lifecycle"
    )
