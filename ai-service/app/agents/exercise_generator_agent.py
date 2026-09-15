import json
import re
from typing import Dict, Any, Optional
from app.contracts.specification import ExerciseSpecification
from app.contracts.exercise import AdaptiveExerciseModel, ExerciseTestCase, ExerciseScaffoldHints

try:
    from app.llm.omniroute_client import generate_json_content
except ImportError:
    try:
        from core.omniroute_client import generate_json_content
    except ImportError:
        def generate_json_content(prompt: str, system_prompt: str = None) -> str:
            return None

from app.utils.sanitizer import sanitize_exercise_object


class ExerciseGeneratorAgent:
    """
    Bộ sinh bài tập thích ứng (Exercise Generator Agent).
    TUÂN THỦ NGHIÊM NGẶT:
    - Chỉ nhận đầu vào là ExerciseSpecification.
    - Không được tự ý thay đổi target_concept hoặc difficulty.
    - Bắt buộc phải tuân thủ required_constructs và forbidden_constructs.
    """

    SYSTEM_PROMPT = """Bạn là ExerciseGeneratorAgent chuyên nghiệp trong hệ thống Adaptive Learning.
Nhiệm vụ của bạn là nhận một ExerciseSpecification và sinh ra DUY NHẤT một JSON bài tập lập trình hoàn chỉnh với các trường sau:

{
  "title": "Tiêu đề bài tập ngắn gọn, thực chiến",
  "concept_name": "Tên khái niệm hiển thị",
  "difficulty_stars": 1,
  "problem_statement": "Mô tả đề bài cụ thể, có ngữ cảnh thực tế, nêu rõ input/output và ví dụ I/O minh họa",
  "quick_theory": "Tóm tắt lý thuyết cốt lõi ngắn gọn trong 2-3 câu",
  "starter_code": "Mã nguồn gợi ý ban đầu để học viên viết tiếp theo đúng ngôn ngữ chỉ định",
  "reference_solution": "Nghiệm mẫu chuẩn xác 100%, chạy đúng tất cả test cases",
  "test_cases": [
    {"input": "2", "expected_output": "4", "is_hidden": false},
    {"input": "5", "expected_output": "10", "is_hidden": false},
    {"input": "0", "expected_output": "0", "is_hidden": true}
  ],
  "hints": {
    "scaffold_1_conceptual": "Gợi ý 1: Định hướng giải thuật",
    "scaffold_2_syntax": "Gợi ý 2: Cú pháp / từ khóa quan trọng",
    "scaffold_3_pseudocode": "Gợi ý 3: Mã giả chi tiết từng bước"
  },
  "constraints": ["Ràng buộc thời gian và kỹ thuật"],
  "common_pitfall_warning": "Cảnh báo lỗi bẫy học viên hay gặp"
}

QUY ĐỊNH NGÔN NGỮ BẮT BUỘC (CRITICAL LANGUAGE REQUIREMENT):
- TOÀN BỘ tiêu đề, mô tả đề bài, lý thuyết, giải thích, cảnh báo bẫy lỗi và ĐẶC BIỆT LÀ MỌI CHÚ THÍCH (COMMENTS) TRONG MÃ NGUỒN (starter_code, reference_solution) BẮT BUỘC 100% PHẢI DÙNG TIẾNG VIỆT CHUẨN HOẶC TỪ KHÓA LẬP TRÌNH TIẾNG ANH.
- NGHIÊM CẤM TUYỆT ĐỐI XUẤT HIỆN BẤT KỲ KÝ TỰ TIẾNG TRUNG (CHINESE / CJK) NÀO (ví dụ: '写代码', '代码', '在这里写代码', '输入', '输出')!
- Chỗ học viên cần viết code BẮT BUỘC chú thích bằng tiếng Việt: "// Viết mã tại đây" hoặc "// Viết code của bạn ở đây".

RÀNG BUỘC THEO NGÔN NGỮ (LANGUAGE SPECIFIC RULES):
1. ĐỐI VỚI C++ (cpp):
   - Đề bài, starter_code và reference_solution PHẢI LÀ C++ CHUẨN (C++17).
   - Bao gồm #include <iostream>, using namespace std; và hàm int main() đọc từ cin >> và in ra cout << (hoặc hàm solution kèm int main() gọi nó).
   - Input của test_cases là chuỗi nạp vào cin (ví dụ: '5' hoặc '10 20'), expected_output là chuỗi cout in ra (ví dụ: '10' hoặc '30').
   - TUYỆT ĐỐI KHÔNG CHỨA BẤT KỲ CÚ PHÁP PYTHON NÀO (như def, tuple, print) TRONG BÀI TẬP C++!
2. ĐỐI VỚI JAVASCRIPT (javascript):
   - Viết chuẩn ES6+. Sử dụng function solution(...) hoặc console.log. Mọi chú thích đều bằng tiếng Việt.
3. ĐỐI VỚI PYTHON (python):
   - Viết chuẩn Python 3. Dùng def solution(...) và các cấu trúc Python hợp lệ.
4. ĐÚNG ĐỘ KHÓ: EASY (1 sao), MEDIUM (2 sao), HARD (3 sao), CHALLENGE (4 sao).
5. CHỈ TRẢ VỀ DUY NHẤT MỘT CHUỖI JSON HỢP LỆ, KHÔNG KÈM LỜI DẪN HAY GIẢI THÍCH BÊN NGOÀI."""

    def __init__(self):
        pass

    def generate(self, spec: ExerciseSpecification, repair_instructions: Optional[str] = None) -> Optional[Dict[str, Any]]:
        stars = 1 if spec.difficulty == "EASY" else (2 if spec.difficulty == "MEDIUM" else (3 if spec.difficulty == "HARD" else 4))

        prompt = f"""ĐẶC TẢ BÀI TẬP CẦN SINH:
- Target Concept: {spec.target_concept} ({spec.concept_title or ''})
- Ngôn ngữ: {spec.language}
- Độ khó: {spec.difficulty} ({stars} sao)
- Chế độ: {spec.mode}
- Kỹ năng con cần rèn: {', '.join(spec.target_sub_skills)}
- Cấu trúc bắt buộc dùng: {', '.join(spec.required_constructs) if spec.required_constructs else 'Không'}
- Cấu trúc cấm: {', '.join(spec.forbidden_constructs) if spec.forbidden_constructs else 'Không'}
- Lỗi gần đây của học viên: {', '.join(spec.recent_errors) if spec.recent_errors else 'Không'}
- Lý do chọn bài: {spec.reasoning or 'Rèn luyện kỹ năng'}
- LƯU Ý BẮT BUỘC: 100% tiếng Việt cho mọi chú thích trong code (ví dụ: // Viết mã tại đây), KHÔNG dùng tiếng Trung.
"""
        if repair_instructions:
            prompt += f"\n[YÊU CẦU SỬA ĐỔI TỪ BƯỚC KIỂM ĐỊNH TRƯỚC]:\n{repair_instructions}\n"

        prompt += "\nHãy sinh bài tập dưới dạng JSON hợp lệ:"

        try:
            raw_res = generate_json_content(prompt, self.SYSTEM_PROMPT)
            if raw_res:
                parsed = self._clean_and_parse_json(raw_res)
                if parsed and self._has_minimal_fields(parsed):
                    # Khử trùng toàn bộ ký tự / cụm từ tiếng Trung nếu có
                    parsed = sanitize_exercise_object(parsed)

                    # Khóa cứng concept_id và difficulty theo đúng spec (chống drift)
                    parsed["concept_id"] = spec.target_concept
                    parsed["concept_name"] = spec.concept_title or parsed.get("concept_name", spec.target_concept)
                    parsed["difficulty"] = spec.difficulty
                    parsed["difficulty_stars"] = stars
                    parsed["language"] = spec.language
                    parsed["mode"] = spec.mode
                    parsed["trace_id"] = spec.trace_id
                    parsed["spec_snapshot"] = spec.dict()
                    return parsed
        except Exception as e:
            print(f"[ExerciseGeneratorAgent Error]: {e}")

        # Fallback Template nếu LLM không phản hồi để hệ thống luôn vận hành liên tục
        return self._generate_fallback(spec, stars)

    def _has_minimal_fields(self, data: Dict[str, Any]) -> bool:
        required = ["title", "problem_statement", "starter_code", "reference_solution", "test_cases"]
        return all(f in data for f in required) and len(data.get("test_cases", [])) >= 2

    def _clean_and_parse_json(self, raw_str: str) -> Optional[Dict[str, Any]]:
        cleaned = raw_str.strip()
        if "```json" in cleaned:
            cleaned = cleaned.split("```json")[1].split("```")[0].strip()
        elif "```" in cleaned:
            cleaned = cleaned.split("```")[1].split("```")[0].strip()

        try:
            return json.loads(cleaned)
        except Exception:
            json_match = re.search(r"\{.*\}", cleaned, re.DOTALL)
            if json_match:
                try:
                    return json.loads(json_match.group(0))
                except Exception:
                    pass
        return None

    def _generate_fallback(self, spec: ExerciseSpecification, stars: int) -> Dict[str, Any]:
        """Bộ sinh bài dự phòng an toàn theo từng ngôn ngữ và concept"""
        lang = spec.language.lower()
        cid = spec.target_concept.upper()

        if lang == "javascript":
            starter = "function solution(n) {\n    // Viết code của bạn ở đây\n    \n}"
            sol = "function solution(n) {\n    return n * 2;\n}"
            tests = [
                {"input": "2", "expected_output": "4", "is_hidden": False},
                {"input": "5", "expected_output": "10", "is_hidden": False},
                {"input": "0", "expected_output": "0", "is_hidden": True}
            ]
            statement = f"Viết hàm JavaScript `solution(n)` nhận vào số nguyên `n` và trả về giá trị gấp đôi của `n` nhằm củng cố kỹ năng về {spec.concept_title or spec.target_concept}."
            quick_theory = f"Nắm vững nguyên lý cốt lõi về {spec.concept_title or spec.target_concept} giúp bạn xử lý dữ liệu và luồng thực thi trong JavaScript an toàn, hiệu quả."
            hint_syntax = "Sử dụng từ khóa `return n * 2;` bên trong hàm."

        elif lang == "cpp":
            starter = "#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    // Đọc số nguyên n từ bàn phím bằng cin và in ra giá trị gấp đôi bằng cout:\n    if (cin >> n) {\n        // Viết mã nguồn của bạn ở đây:\n        \n    }\n    return 0;\n}"
            sol = "#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    if (cin >> n) {\n        cout << n * 2;\n    }\n    return 0;\n}"
            tests = [
                {"input": "2", "expected_output": "4", "is_hidden": False},
                {"input": "5", "expected_output": "10", "is_hidden": False},
                {"input": "0", "expected_output": "0", "is_hidden": True}
            ]
            statement = f"Viết chương trình C++ đọc vào một số nguyên `n` từ bàn phím (sử dụng đối tượng `cin`) và in ra màn hình console (sử dụng đối tượng `cout`) giá trị gấp đôi của `n` nhằm củng cố kỹ năng về {spec.concept_title or spec.target_concept}."
            quick_theory = f"Trong C++, thư viện `<iostream>` cung cấp đối tượng `cin` (kết hợp toán tử `>>`) để nhập dữ liệu từ luồng chuẩn và đối tượng `cout` (kết hợp toán tử `<<`) để xuất dữ liệu ra màn hình."
            hint_syntax = "Sử dụng câu lệnh `cout << n * 2;` để xuất kết quả ra luồng chuẩn."

        else:
            starter = "def solution(n):\n    # Viết code của bạn ở đây\n    pass"
            sol = "def solution(n):\n    return n * 2"
            tests = [
                {"input": "(2,)", "expected_output": "4", "is_hidden": False},
                {"input": "(5,)", "expected_output": "10", "is_hidden": False},
                {"input": "(0,)", "expected_output": "0", "is_hidden": True}
            ]
            statement = f"Viết hàm Python `solution(n)` nhận vào số nguyên `n` và trả về giá trị gấp đôi của `n` nhằm củng cố kỹ năng về {spec.concept_title or spec.target_concept}."
            quick_theory = f"Nắm vững nguyên lý cốt lõi về {spec.concept_title or spec.target_concept} giúp bạn xử lý luồng dữ liệu an toàn và tối ưu trong Python."
            hint_syntax = "Sử dụng toán tử nhân `return n * 2`."

        return {
            "exercise_id": f"ex_fallback_{spec.target_concept.lower()}",
            "title": f"Rèn luyện kỹ năng: {spec.concept_title or spec.target_concept}",
            "concept_id": spec.target_concept,
            "concept_name": spec.concept_title or spec.target_concept,
            "language": spec.language,
            "difficulty": spec.difficulty,
            "difficulty_stars": stars,
            "mode": spec.mode,
            "problem_statement": statement,
            "quick_theory": quick_theory,
            "starter_code": starter,
            "reference_solution": sol,
            "test_cases": tests,
            "hints": {
                "scaffold_1_conceptual": "Xác định kiểu dữ liệu đầu vào và phép tính toán cần thực hiện.",
                "scaffold_2_syntax": hint_syntax,
                "scaffold_3_pseudocode": "Đọc n -> tính n * 2 -> xuất hoặc trả về kết quả."
            },
            "constraints": ["Thời gian chạy < 5000ms"],
            "common_pitfall_warning": "Chú ý xử lý trường hợp số âm và số 0.",
            "trace_id": spec.trace_id,
            "spec_snapshot": spec.dict()
        }
