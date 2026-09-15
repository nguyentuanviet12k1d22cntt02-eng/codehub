import uuid
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from .specification import ExerciseSpecification


class ExerciseTestCase(BaseModel):
    id: Optional[str] = Field(default=None)
    input: str = Field(default="", description="Tham số đầu vào hoặc dòng lệnh test")
    expected_output: str = Field(..., description="Kết quả kỳ vọng dạng chuỗi chuẩn hóa")
    is_hidden: bool = Field(default=False, description="Test case ẩn để chấm điểm chống gian lận")
    explanation: Optional[str] = Field(default=None, description="Giải thích lý do test case này")


class ExerciseScaffoldHints(BaseModel):
    scaffold_1_conceptual: str = Field(..., description="Gợi ý định hướng giải thuật / logic")
    scaffold_2_syntax: str = Field(..., description="Gợi ý cấu trúc cú pháp / hàm cần gọi")
    scaffold_3_pseudocode: str = Field(..., description="Gợi ý mã giả từng bước")


class AdaptiveExerciseModel(BaseModel):
    """
    Cấu trúc bài tập thích ứng hoàn chỉnh do ExerciseGeneratorAgent sinh ra và đã qua kiểm định 4 lớp.
    """
    exercise_id: str = Field(
        default_factory=lambda: f"ex_{uuid.uuid4().hex[:10]}",
        description="Mã định danh duy nhất của bài tập"
    )
    title: str = Field(..., description="Tiêu đề bài tập ngắn gọn, rõ ràng")
    concept_id: str = Field(..., description="Khái niệm mục tiêu")
    concept_name: str = Field(..., description="Tên khái niệm hiển thị")
    language: str = Field(default="python", description="Ngôn ngữ lập trình")
    difficulty: str = Field(default="MEDIUM", description="Độ khó: EASY, MEDIUM, HARD, CHALLENGE")
    difficulty_stars: int = Field(default=2, ge=1, le=4)
    mode: str = Field(default="progression")
    problem_statement: str = Field(..., description="Mô tả đề bài chi tiết kèm ví dụ I/O cụ thể")
    quick_theory: str = Field(..., description="Lý thuyết cốt lõi ngắn gọn (2-3 câu)")
    starter_code: str = Field(..., description="Mã nguồn khởi tạo cho học viên viết tiếp")
    reference_solution: str = Field(..., description="Nghiệm mẫu tham chiếu chuẩn xác tuyệt đối")
    test_cases: List[ExerciseTestCase] = Field(..., description="Danh sách tối thiểu 3-5 test cases")
    hints: Optional[ExerciseScaffoldHints] = Field(default=None, description="Gợi ý 3 tầng")
    constraints: List[str] = Field(default_factory=list, description="Các ràng buộc kỹ thuật")
    common_pitfall_warning: Optional[str] = Field(default=None, description="Cảnh báo bẫy lập trình thường gặp")
    detailed_theory: Optional[str] = Field(default=None, description="Lý thuyết chi tiết mở rộng kèm bảng Trace")
    spec_snapshot: Optional[ExerciseSpecification] = Field(
        default=None,
        description="Bản chụp ExerciseSpecification mà bài tập này được sinh ra từ đó (để giải thích quyết định)"
    )
    trace_id: str = Field(
        default_factory=lambda: f"trace_{uuid.uuid4().hex[:12]}",
        description="Mã truy vết phân tán"
    )
