import uuid
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class ExerciseSpecification(BaseModel):
    """
    Contract đặc tả bài tập từ AdaptiveExercisePlanner gửi sang ExerciseGeneratorAgent.
    Bộ sinh bài (Generator) bắt buộc phải tuân thủ nghiêm ngặt đặc tả này:
    - Không được tự đổi target_concept
    - Không được tự ý thay đổi difficulty
    - Không được vi phạm forbidden_constructs và phải thỏa mãn required_constructs
    """
    target_concept: str = Field(
        ...,
        description="Mã node kiến thức mục tiêu trên Knowledge Graph (ví dụ: JS-FUNC-01, CPP-OOP-01, PY-DICT-01)"
    )
    concept_title: Optional[str] = Field(
        default=None,
        description="Tên khái niệm hiển thị"
    )
    language: str = Field(
        default="python",
        description="Ngôn ngữ lập trình"
    )
    target_sub_skills: List[str] = Field(
        default_factory=list,
        description="Danh sách kỹ năng con trọng tâm cần rèn luyện (ví dụ: ['parameters', 'scope'])"
    )
    difficulty: str = Field(
        default="MEDIUM",
        description="Mức độ khó: EASY, MEDIUM, HARD, CHALLENGE"
    )
    mode: str = Field(
        default="progression",
        description="Chế độ học: remediation, progression, diagnostic"
    )
    prerequisites: List[str] = Field(
        default_factory=list,
        description="Danh sách concept tiên quyết"
    )
    required_constructs: List[str] = Field(
        default_factory=list,
        description="Các cấu trúc bắt buộc phải dùng (ví dụ: ['function', 'parameter'], ['class', 'constructor'])"
    )
    forbidden_constructs: List[str] = Field(
        default_factory=list,
        description="Các cấu trúc bị cấm (ví dụ: ['closure', 'class'], ['pointer'], ['lambda'])"
    )
    recent_errors: List[str] = Field(
        default_factory=list,
        description="Các lỗi học viên gần đây hay mắc phải cần né hoặc cần luyện khắc phục"
    )
    test_constraints: Dict[str, Any] = Field(
        default_factory=dict,
        description="Ràng buộc về test case: min_cases, max_execution_time_ms, memory_limit_mb"
    )
    reasoning: Optional[str] = Field(
        default=None,
        description="Giải thích sư phạm vì sao Planner chọn bài tập này cho học viên này"
    )
    trace_id: str = Field(
        default_factory=lambda: f"trace_{uuid.uuid4().hex[:12]}",
        description="Mã truy vết phân tán xuyên suốt pipeline"
    )
