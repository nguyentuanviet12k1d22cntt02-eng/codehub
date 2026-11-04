from typing import Dict, Any, List

from .json_support import generate_json_content, sanitize_exercise_object, extract_json_from_llm, normalize_test_cases
from .fallbacks.cpp import cpp_fallback
from .fallbacks.python_collections import branch_0, branch_1, branch_2
from .fallbacks.python_basics import branch_3, branch_4
from .fallbacks.python_oop import branch_5, default_fallback

class ExerciseGeneratorAgent:
    """Agent Biên soạn Bài tập Thích ứng theo Vùng Phát triển ZPD"""

    def generate_exercise(
        self,
        concept: Dict[str, Any],
        student_mastery: float,
        is_easier_request: bool = False,
        critic_feedback: str = "",
        language: str = "PYTHON"
    ) -> Dict[str, Any]:
        """Tạo bài tập thực hành thích ứng bám sát concept và lỗi thường gặp theo ngôn ngữ"""
        concept_id = concept.get("id") or concept.get("concept_id", "GEN")
        concept_name = concept.get("concept_name", "Lập trình")
        associated_errors = concept.get("associated_errors", [])
        lang = (language or "PYTHON").upper()

        difficulty_label = "Cơ bản / Scaffolding" if is_easier_request else "Vừa sức (ZPD)"

        system_prompt = f"""
Bạn là Senior {lang} Pedagogical Architect & Exercise Generator Agent chuyên nghiệp.
Nhiệm vụ: Thiết kế 1 bài tập lập trình {lang} THỰC CHIẾN, HẤP DẪN, GIÀU BỐI CẢNH DỰ ÁN THẬT dành riêng cho học viên đang cần củng cố kiến thức.
Mã khung (starter_code) và reference_solution PHẢI VIẾT BẰNG NGÔN NGỮ {lang} CHUẨN MỰC.
Concept mục tiêu: {concept_name} ({concept_id})
Độ thành thạo hiện tại của học viên: {round(student_mastery * 100)}%
Các lỗi Sandbox thường gặp: {', '.join(associated_errors) if associated_errors else 'None'}
Mức độ yêu cầu: {difficulty_label}

QUY ĐỊNH NGÔN NGỮ BẮT BUỘC (CRITICAL LANGUAGE REQUIREMENT):
- TOÀN BỘ tiêu đề, mô tả đề bài, lý thuyết, giải thích, cảnh báo bẫy lỗi và ĐẶC BIỆT LÀ TẤT CẢ CÁC CHÚ THÍCH (COMMENTS) TRONG CODE (starter_code, reference_solution) BẮT BUỘC 100% PHẢI DÙNG TIẾNG VIỆT HOẶC TỪ KHÓA LẬP TRÌNH TIẾNG ANH.
- NGHIÊM CẤM TUYỆT ĐỐI XUẤT HIỆN BẤT KỲ KÝ TỰ TIẾNG TRUNG (CHINESE / CJK) NÀO NHƯ: "写代码", "代码", "在这里写代码", "输入", "输出"!
- Nếu cần chú thích nơi học viên viết mã, BẮT BUỘC dùng tiếng Việt: "// Viết mã tại đây" hoặc "// Viết code của bạn ở đây".

QUY TẮC SƯ PHẠM VÀ CHẤT LƯỢNG NỘI DUNG BẮT BUỘC:
1. ĐỀ BÀI PHẢI HẤP DẪN, GẮN VỚI TÌNH HUỐNG THỰC TẾ (Real-World Case Study):
   - Đặt tên bài tập như một tính năng trong dự án phần mềm thật (ví dụ: "Module Giỏ Hàng Shopee", "Bảng Xếp Hạng Game Thủ VIP", "Kiểm Tra Dữ Liệu Khách Hàng API", "Trích Xuất Thẻ Meta Web"...).
   - Đề bài phải nêu rõ bối cảnh (Scenario), yêu cầu input/output, và tuyệt đối KHÔNG ĐƯỢC LỘ LỜI GIẢI.
2. PHẦN LÝ THUYẾT (detailed_theory) BẮT BUỘC THEO ĐÚNG CHUẨN NỘI DUNG PYTHON V1.0 CỦA HỆ THỐNG:
   - Cấu trúc gồm 4 phần tuần tự, tối ưu đọc quét, không lan man:
     ## 1. Khái niệm & Vấn đề
     Đoạn văn ngắn đặt vấn đề thực tế + 1 Bảng định nghĩa cốt lõi:
     | Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |
     | :--- | :--- | :--- |
     | ... | ... | ... |

     ## 2. Cú pháp & Vận hành
     Đoạn mã Python mẫu tối giản + Bảng theo dõi thực thi từng dòng + Sơ đồ bộ nhớ RAM ASCII:
     ```python
     # Code mẫu tối giản
     ...
     ```

     **Bảng theo dõi thực thi (Execution Trace Table):**
     | Dòng mã | Lệnh được chạy | Trạng thái biến | Hành động của máy tính |
     |:---:|:---|:---|:---|
     | 1 | `...` | `...` | ... |
     | 2 | `...` | `...` | ... |

     **Trạng thái bộ nhớ RAM:**
     ```text
     [RAM Stack]                 [RAM Heap]
     variable ───────────────► [ value ] (Object)
     ```

     ## 3. Lỗi thường gặp & Tối ưu
     > [!WARNING]
     > **Các lỗi thường gặp cần tránh:**
     > * ...

     > [!TIP]
     > ...

     ## 4. Đúc kết & Đi tiếp
     * 3 gạch đầu dòng chốt kiến thức quan trọng nhất.
3. BỘ TEST CASES CHUẨN HÓA (Ít nhất 4 testcases phong phú):
   - Case 1: Dữ liệu thông thường (Happy Path)
   - Case 2: Dữ liệu bẫy lỗi (Edge Case / Missing Key / None / Rỗng)
   - Case 3: Dữ liệu đặc biệt hoặc nhiều phần tử
   - Case 4: Test case ẩn kiểm tra tính vững chãi
   - Mỗi testcase nên có trường "explanation" ngắn giải thích mục đích kiểm tra.
4. reference_solution phải là code Python hoàn chỉnh, viết đẹp, chuẩn PEP 8 và chạy pass 100% testcases.

ĐỊNH DẠNG JSON BẮT BUỘC:
{{
  "title": "Tên bài tập thực chiến hấp dẫn",
  "concept_id": "{concept_id}",
  "concept_name": "{concept_name}",
  "quick_theory": "1-2 câu tóm tắt nhanh",
  "detailed_theory": "## 1. Khái niệm & Vấn đề\\n...\\n\\n| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |\\n| :--- | :--- | :--- |\\n...\\n\\n## 2. Cú pháp & Vận hành\\n```python\\n...\\n```\\n\\n**Bảng theo dõi thực thi (Execution Trace Table):**\\n| Dòng mã | Lệnh được chạy | Trạng thái biến | Hành động của máy tính |\\n|:---:|:---|:---|:---|\\n| 1 | `...` | `...` | ... |\\n\\n**Trạng thái bộ nhớ RAM:**\\n```text\\n[RAM Stack]           [RAM Heap]\\n... ───────────────► [ ... ]\\n```\\n\\n## 3. Lỗi thường gặp & Tối ưu\\n> [!WARNING]\\n> ...\\n\\n> [!TIP]\\n> ...\\n\\n## 4. Đúc kết & Đi tiếp\\n* ...",
  "problem_statement": "### 📌 Yêu Cầu Đề Bài\\nMô tả chi tiết bài toán...\\n\\n---\\n### 📥 Dữ Liệu Đầu Vào (Input)\\n- ...\\n\\n### 📤 Dữ Liệu Đầu Ra (Output)\\n- ...\\n\\n---\\n### 💡 Ví Dụ Minh Họa\\n- ...",
  "sample_input": "Ví dụ đầu vào (chuỗi tuple tham số)",
  "sample_output": "Ví dụ đầu ra (chuỗi kết quả)",
  "starter_code": "def solution(...):\\n    \\\"\\\"\\\"Docstring hướng dẫn\\\"\\\"\\\"\\n    pass",
  "reference_solution": "def solution(...):\\n    ...",
  "test_cases": [
    {{"input": "([1, 2, 3],)", "expected_output": "[1, 2, 3]", "is_hidden": false, "explanation": "Kiểm tra trường hợp thông thường"}},
    {{"input": "([],)", "expected_output": "[]", "is_hidden": false, "explanation": "Kiểm tra trường hợp biên danh sách rỗng"}},
    {{"input": "([5, 6, 7],)", "expected_output": "[5, 6, 7]", "is_hidden": true, "explanation": "Kiểm tra trường hợp ẩn nâng cao"}}
  ],
  "common_pitfall_warning": "Cảnh báo bẫy lỗi thường gặp",
  "difficulty_stars": {1 if is_easier_request else 2}
}}
"""
        import random
        domains = [
            "Hệ Thống Camera & Giao Thông Thông Minh",
            "Nền Tảng E-Commerce Shopee/Lazada (Giỏ hàng, Khuyến mãi)",
            "Hệ Thống Game & Xếp Hạng Đấu Thủ",
            "Cảm Biến IoT & Giám Sát Môi Trường",
            "Fintech & Quản Lý Giao Dịch Thẻ Ngân Hàng",
            "Streaming Âm Nhạc & Video Trực Tuyến",
            "Log Analytics & Giám Sát Server Backend",
            "Hệ Thống Quản Lý Kho Vận & Logistics Giao Hàng"
        ]
        chosen_domain = random.choice(domains)
        user_prompt = (
            f"Hãy thiết kế một bài tập thực chiến ĐỘC ĐÁO, MỚI LẠ cho concept: {concept_name} ({concept_id}).\n"
            f"Bối cảnh ứng dụng thực tế gợi ý: '{chosen_domain}'.\n"
            f"Yêu cầu: Đề bài sáng tạo, gắn liền tình huống nghiệp vụ thực tế, không trùng lặp các bài toán sách giáo khoa thông thường."
        )
        if critic_feedback:
            user_prompt += f"\nLƯU Ý: Lần sinh trước bị Evaluator từ chối vì: '{critic_feedback}'. Hãy sửa lỗi này triệt để."

        try:
            raw = generate_json_content(user_prompt, system_prompt)
            if raw:
                data = extract_json_from_llm(raw)
                if "title" in data and "problem_statement" in data and "test_cases" in data:
                    data = sanitize_exercise_object(data)
                    data["test_cases"] = normalize_test_cases(data.get("test_cases"))
                    if len(data["test_cases"]) >= 1:
                        return data
        except Exception as e:
            print(f"[ExerciseGeneratorAgent Error]: {e}")

        # Fallback Template chuẩn nếu LLM gặp sự cố
        return self._get_fallback_exercise(concept_id, concept_name, associated_errors, is_easier_request, language=lang)

    def _get_fallback_exercise(self, concept_id: str, concept_name: str, errors: List[str], is_easier: bool, language: str = "PYTHON") -> Dict[str, Any]:
        """Bài tập fallback đã được thẩm định trước 100% an toàn theo từng chủ đề"""
        cid = concept_id.upper()
        lang = (language or "PYTHON").upper()
        if lang in ['CPP', 'C++'] or cid.startswith('CPP'):
            return cpp_fallback(concept_id, concept_name, errors, is_easier, language)
        if 'DICT' in cid:
            return branch_0(concept_id, concept_name, errors, is_easier, language)
        elif 'LIST' in cid:
            return branch_1(concept_id, concept_name, errors, is_easier, language)
        elif 'STRING' in cid:
            return branch_2(concept_id, concept_name, errors, is_easier, language)
        elif 'FLOW' in cid:
            return branch_3(concept_id, concept_name, errors, is_easier, language)
        elif 'BASICS-02' in cid or 'CASTING' in cid:
            return branch_4(concept_id, concept_name, errors, is_easier, language)
        elif 'CLASS' in cid or 'OOP' in cid:
            return branch_5(concept_id, concept_name, errors, is_easier, language)
        else:
            return default_fallback(concept_id, concept_name, errors, is_easier, language)
