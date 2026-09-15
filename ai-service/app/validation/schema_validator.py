from typing import Dict, Any, List, Tuple
from app.utils.sanitizer import contains_cjk


class SchemaValidator:
    """
    Tầng kiểm định 1: Kiểm tra tính toàn vẹn của cấu trúc JSON bài tập (Schema Validator).
    Deterministic 100% - Không dùng LLM.
    """

    REQUIRED_FIELDS = [
        "title",
        "problem_statement",
        "starter_code",
        "reference_solution",
        "test_cases"
    ]

    @classmethod
    def validate(cls, exercise_data: Dict[str, Any]) -> Tuple[bool, List[str]]:
        errors = []

        if not isinstance(exercise_data, dict):
            return False, ["Dữ liệu bài tập phải là một đối tượng JSON (dictionary)."]

        # 1. Kiểm tra các trường bắt buộc
        for field in cls.REQUIRED_FIELDS:
            val = exercise_data.get(field)
            if val is None or (isinstance(val, str) and not val.strip()):
                errors.append(f"Thiếu trường bắt buộc hoặc giá trị rỗng: '{field}'.")

        # 2. Kiểm tra định dạng test_cases
        test_cases = exercise_data.get("test_cases")
        if not isinstance(test_cases, list) or len(test_cases) < 2:
            errors.append("Trường 'test_cases' phải là danh sách có tối thiểu 2 test cases.")
        else:
            for idx, tc in enumerate(test_cases):
                if not isinstance(tc, dict):
                    errors.append(f"Test case #{idx + 1} phải là một dictionary.")
                    continue
                if "expected_output" not in tc or tc["expected_output"] is None:
                    errors.append(f"Test case #{idx + 1} thiếu trường 'expected_output'.")

        # 3. Kiểm tra độ dài hợp lệ
        statement = exercise_data.get("problem_statement", "")
        if len(statement) < 20:
            errors.append("Trường 'problem_statement' quá ngắn (dưới 20 ký tự), thiếu tính sư phạm.")

        # 4. Kiểm tra ngôn ngữ: Tuyệt đối không được chứa ký tự tiếng Trung (CJK)
        for field in ["title", "problem_statement", "starter_code", "reference_solution", "quick_theory"]:
            val = exercise_data.get(field, "")
            if isinstance(val, str) and contains_cjk(val):
                errors.append(f"Trường '{field}' chứa ký tự tiếng Trung hoặc ngoại ngữ không hợp lệ. Toàn bộ nội dung và chú thích code bắt buộc phải dùng 100% tiếng Việt.")

        is_valid = len(errors) == 0
        return is_valid, errors

