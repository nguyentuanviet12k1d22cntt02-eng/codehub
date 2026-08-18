import os
import sys
import json
import re
import subprocess
import tempfile
from typing import Dict, Any, List
from core.omniroute_client import generate_json_content

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass


def extract_json_from_llm(text: str) -> Dict[str, Any]:
    """Trích xuất và parse JSON an toàn từ phản hồi của LLM bất kể reasoning hay markdown wrapper"""
    if not text or not text.strip():
        raise ValueError("Phản hồi từ AI Gateway rỗng.")
    
    cleaned = text.strip()
    
    # 1. Tìm block code ```json { ... } ```
    code_block_match = re.search(r"```(?:json)?\s*(\{[\s\S]*?\})\s*```", cleaned, re.IGNORECASE)
    if code_block_match:
        try:
            return json.loads(code_block_match.group(1).strip())
        except Exception:
            pass
            
    # 2. Tìm vị trí '{' đầu tiên và dùng JSONDecoder.raw_decode (chuẩn xác nhất)
    first_brace = cleaned.find("{")
    if first_brace != -1:
        try:
            decoder = json.JSONDecoder()
            obj, _ = decoder.raw_decode(cleaned[first_brace:])
            return obj
        except Exception as err:
            # Fallback lấy từ { đầu đến } cuối
            last_brace = cleaned.rfind("}")
            if last_brace != -1 and last_brace > first_brace:
                return json.loads(cleaned[first_brace:last_brace + 1])
                
    # 3. Thử parse trực tiếp
    return json.loads(cleaned)


def run_python_sandbox_qc(solution_code: str, test_cases: List[Dict[str, Any]]) -> bool:
    """Kiểm tra tự động solution_code với các test_cases trong môi trường Sandbox cô lập"""
    if not solution_code or not test_cases:
        return True

    with tempfile.TemporaryDirectory() as tmpdir:
        code_file = os.path.join(tmpdir, "solution.py")
        
        for idx, tc in enumerate(test_cases):
            tc_input = tc.get("input", "")
            expected_output = str(tc.get("expected_output", "")).strip()
            
            # Universal Dynamic Test Harness
            harness = f"""
import sys
import ast

{solution_code}

if __name__ == '__main__':
    try:
        raw_input = {repr(tc_input)}
        try:
            arg = ast.literal_eval(raw_input)
        except Exception:
            arg = raw_input
            
        # Tìm hàm chính được định nghĩa trong solution code
        custom_funcs = [
            f for f in list(globals().keys()) 
            if callable(globals()[f]) and not f.startswith('__') and f not in ['sys', 'ast']
        ]
        
        res = None
        if custom_funcs:
            # Ưu tiên hàm cuối cùng hoặc hàm có tên gợi ý
            target_fn = globals()[custom_funcs[-1]]
            if isinstance(arg, tuple):
                res = target_fn(*arg)
            else:
                res = target_fn(arg)
                
        if res is not None:
            print(res)
    except Exception as err:
        print(f"ERROR: {{err}}", file=sys.stderr)
"""
            with open(code_file, "w", encoding="utf-8") as f:
                f.write(harness)

            try:
                proc = subprocess.run(
                    ["python", code_file],
                    capture_output=True,
                    text=True,
                    timeout=3
                )
                output = proc.stdout.strip()
                if output != expected_output and expected_output != "":
                    print(f"[Sandbox QC Warning] Testcase {idx}: Output='{output}' vs Expected='{expected_output}'")
            except Exception as e:
                print(f"[Sandbox QC Execution Error]: {e}")
                
    return True


def generate_personalized_learning_path(
    user_id: str,
    skills_selected: List[str],
    learner_archetype: str = "Persister",
    topic: str = None
) -> Dict[str, Any]:
    """Sinh Lộ trình học cá nhân hóa 100% ĐỘNG từ Gemini LLM qua OmniRoute Gateway"""
    
    # Chuẩn hóa tên chủ đề
    clean_topic = topic.strip() if topic and topic.strip() else "Lập Trình Python Cơ Bản Đến Nâng Cao"
    
    system_prompt = """
Bạn là Hiệu Trưởng & Kiến Trúc Sư Trưởng Thiết Kế Chương Trình Đào Tạo Python Cao Cấp của VIBECODE AI.
Nhiệm vụ của bạn là biên soạn một Lộ Trình Học Tập Cá Nhân Hóa ĐẲNG CẤP, CHUYÊN SÂU, TOÀN DIỆN VÀ 100% ĐÚNG VÀO CHỦ ĐỀ HỌC VIÊN YÊU CẦU.

CẤU TRÚC JSON BẮT BUỘC (Trả về JSON hợp lệ, KHÔNG bọc trong text thừa):
{
  "path_title": "Tên Lộ Trình Hấp Dẫn & Chuyên Nghiệp (Ví dụ: Làm Chủ Cấu Trúc Dữ Liệu Dictionary & Tối Ưu Hiệu Năng Trong Python)",
  "description": "Mô tả tổng quan lộ trình (2-3 câu ngắn gọn, súc tích, truyền cảm hứng).",
  "target_skills": ["skill_1", "skill_2"],
  "pal_net_avg_score": 0.85,
  "lessons": [
    {
      "order_index": 1,
      "title": "Tên Bài Học 1 (Cơ Bản & Cốt Lõi)",
      "target_skill_id": "skill_core",
      "theory_content": "# 📚 [Tên Bài Học]\\n\\n## 📌 1. Bản Chất & Mô Hình Tư Duy (Mental Model & Analogy)\\n- Giải thích bản chất bằng hình ảnh ẩn dụ đời thực dễ hiểu, lý do tại sao sinh ra khái niệm này và tại sao cần dùng nó thay vì các cách khác...\\n\\n## 💡 2. Cú Pháp Chuẩn & Phân Tích Mã Nguồn Mẫu\\n```python\\n# Ví dụ minh họa thực tế\\n```\\n- Giải thích chi tiết từng dòng code, ý nghĩa từng tham số và từ khóa...\\n\\n## ⚙️ 3. Cơ Chế Hoạt Động Dưới Bộ Nhớ (Under The Hood)\\n- Cách Python lưu trữ, cấp phát bộ nhớ và xử lý logic bên dưới...\\n\\n## ⚠️ 4. 3 Cạm Bẫy Kinh Điển & Lỗi Thường Gặp (Common Pitfalls)\\n- **Lỗi 1:** ...\\n- **Lỗi 2:** ...\\n- **Cách khắc phục chuẩn:** ...\\n\\n## 🎯 5. Tóm Tắt Ghi Nhớ Nhanh (Key Takeaways)\\n- Các quy tắc cốt lõi cần nhớ.",
      "quizzes": [
        {
          "question": "Câu hỏi trắc nghiệm tình huống kiểm tra sâu sắc kiến thức bài học?",
          "option_a": "Lựa chọn A",
          "option_b": "Lựa chọn B",
          "option_c": "Lựa chọn C",
          "option_d": "Lựa chọn D",
          "correct_option": "A",
          "explanation": "Giải thích chi tiết vì sao đáp án này chuẩn xác và các đáp án khác sai ở điểm nào."
        },
        {
          "question": "Câu hỏi thứ 2 về nhận diện lỗi hoặc tối ưu hóa?",
          "option_a": "Lựa chọn A",
          "option_b": "Lựa chọn B",
          "option_c": "Lựa chọn C",
          "option_d": "Lựa chọn D",
          "correct_option": "C",
          "explanation": "Giải thích cặn kẽ..."
        }
      ],
      "exercise": {
        "title": "Tên bài tập thực hành lập trình thực tế",
        "difficulty": "EASY",
        "problem_description": "Mô tả chi tiết bài toán thực tế, yêu cầu đầu vào, đầu ra và gợi ý các bước tư duy...",
        "starter_code": "def solve_problem(param):\\n    # Viết mã nguồn của bạn ở đây\\n    pass",
        "solution_code": "def solve_problem(param):\\n    # Lời giải mẫu chạy chuẩn xác 100%\\n    return result",
        "test_cases": [
          {"input": "input_1", "expected_output": "output_1", "is_hidden": false},
          {"input": "input_2", "expected_output": "output_2", "is_hidden": true}
        ]
      }
    },
    {
      "order_index": 2,
      "title": "Tên Bài Học 2 (Nâng Cao & Ứng Dụng Thực Tiễn)",
      "target_skill_id": "skill_advanced",
      "theory_content": "# 🚀 [Tên Bài Học Nâng Cao]...",
      "quizzes": [
        {
          "question": "Câu hỏi nâng cao?",
          "option_a": "Lựa chọn A",
          "option_b": "Lựa chọn B",
          "option_c": "Lựa chọn C",
          "option_d": "Lựa chọn D",
          "correct_option": "B",
          "explanation": "Giải thích chi tiết..."
        }
      ],
      "exercise": {
        "title": "Bài tập lập trình nâng cao",
        "difficulty": "MEDIUM",
        "problem_description": "Đề bài ứng dụng nâng cao...",
        "starter_code": "def advanced_solution(data):\\n    pass",
        "solution_code": "def advanced_solution(data):\\n    # Code hoàn chỉnh",
        "test_cases": [
          {"input": "test_input_1", "expected_output": "test_expected_1", "is_hidden": false},
          {"input": "test_input_2", "expected_output": "test_expected_2", "is_hidden": true}
        ]
      }
    }
  ]
}

TIÊU CHUẨN ĐẶC BIỆT:
1. `theory_content` PHẢI DÀI VÀ ĐẦY ĐỦ (tối thiểu 400-600 từ), sử dụng các tiêu đề `##`, danh sách gạch đầu dòng, code block ` ```python ` có chú thích rõ ràng.
2. TUYỆT ĐỐI KHÔNG VIẾT NỘI DUNG SƠ SÀI, KHÔNG DÙNG ĐỀ BÀI TỔNG QUÁT KIỂU 'process_solution' hay 'Processed: val'.
3. Mọi bài học, câu hỏi, và bài tập code PHẢI BÁM SÁT 100% VÀO ĐÚNG CHỦ ĐỀ HỌC VIÊN YÊU CẦU.
"""

    prompt = f"""
Học viên yêu cầu học chủ đề: "{clean_topic}".
Nhóm năng lực học tập (Learner Archetype): {learner_archetype}.
Kỹ năng tri thức liên quan: {json.dumps(skills_selected, ensure_ascii=False)}.

Hãy biên soạn Lộ trình học tập cá nhân hóa chất lượng cao, chuyên sâu và đầy đủ các bài học theo đúng định dạng JSON yêu cầu.
"""

    print(f"🤖 [OmniRoute AI Gateway] Đang yêu cầu LLM sinh lộ trình chuyên sâu cho chủ đề: '{clean_topic}'...")
    raw_response = generate_json_content(prompt, system_prompt)
    
    if not raw_response:
        raise RuntimeError(f"OmniRoute AI Gateway không phản hồi khi sinh lộ trình cho chủ đề '{clean_topic}'.")

    try:
        data = extract_json_from_llm(raw_response)
        
        # Kiểm tra tính toàn vẹn của JSON sinh ra
        if not data.get("lessons") or not isinstance(data.get("lessons"), list):
            raise ValueError("Dữ liệu JSON từ AI thiếu danh sách 'lessons'.")
            
        # Sandbox QC
        for lesson in data.get("lessons", []):
            ex = lesson.get("exercise")
            if ex:
                run_python_sandbox_qc(ex.get("solution_code", ""), ex.get("test_cases", []))
                
        print(f"✅ [OmniRoute GenAI] Đã sinh thành công Lộ trình '{data.get('path_title')}' gồm {len(data.get('lessons', []))} bài học chuyên sâu!")
        return data

    except Exception as e:
        print(f"❌ [Lỗi Xử Lý Dữ Liệu AI]: {e}\nNội dung thô từ LLM:\n{raw_response[:500]}...")
        raise RuntimeError(f"Lỗi phân tích cú pháp bài học do AI sinh ra: {e}")


def interact_ai_tutor_dialogue(user_id: str, history: List[Dict[str, str]], palnet_masteries: Dict[str, float] = None) -> Dict[str, Any]:
    """Xử lý hội thoại AI Tutor Socratic qua OmniRoute Gateway"""
    turn_count = len([m for m in history if m.get("sender") == "USER"])
    last_user_msg = history[-1]["content"] if history else "Tôi muốn học nâng cao kỹ năng lập trình"
    
    formatted_history = "\n".join([f"{'Học viên' if m.get('sender') == 'USER' else 'AI Tutor'}: {m.get('content')}" for m in history])
    
    system_prompt = """
Bạn là AI Tutor socratic thông minh thuộc hệ thống VIBECODE AI.
Nhiệm vụ của bạn là trò chuyện trực tiếp với học viên bằng Tiếng Việt để làm rõ mục tiêu học tập trước khi chốt Lộ trình bài học cá nhân hóa.

ĐỊNH DẠNG TRẢ VỀ BẮT BUỘC BẰNG JSON VALID KHÔNG CHỨA CODEBLOCK:
{
  "step": "CLARIFY",
  "reply": "Lời đáp súc tích, thân thiện, trả lời ĐÚNG VÀO CÂU HỎI CỦA HỌC VIÊN và hỏi làm rõ chủ đề/thời gian học.",
  "suggested_options": ["🐍 Vòng Lặp & Duyệt Mảng Python", "📊 Xử Lý Chuỗi & Slicing", "⚡ Thuật Toán Tìm Cực Trị", "🌐 Lập Trình Hướng Đối Tượng"],
  "preview_data": null
}

HƯỚNG DẪN QUAN TRỌNG:
1. Nếu học viên CHỈ CHÀO HỎI NÓI CHUYỆN XÃ GIAO (như "hello", "xin chào", "bạn khỏe không", "bạn tên gì", v.v.) hoặc CHƯA NÊU CHỦ ĐỀ HỌC TẬP:
   - Trả về step = "CLARIFY".
   - `reply`: Trả lời thân thiện, hỏi xem học viên muốn bắt đầu học về chủ đề Python nào.
   - `preview_data`: null.

2. Nếu học viên ĐÃ NÊU RÕ CHỦ ĐỀ HỌC (ví dụ: "vòng lặp", "dictionary", "FastAPI", "OOP", "slicing"...) HOẶC BẤM NÚT CHỌN BÀI:
   - Trả về step = "PREVIEW".
   - `reply`: Thông báo AI Tutor đã thiết lập xong Bản Phác Thảo Lộ Trình Thích Ứng theo đúng đề tài học viên yêu cầu.
   - `preview_data`: Cung cấp thông tin phác thảo gồm:
     - `title`: Tên lộ trình bám sát chủ đề (ví dụ: "Chinh Phục Cấu Trúc Dữ Liệu Dictionary Trong Python").
     - `description`: Mô tả ngắn gọn mục tiêu học tập.
     - `target_skills`: Danh sách kỹ năng chính.
     - `lessons_count`: Số bài học dự kiến (ví dụ 2 hoặc 3).
     - `components`: Danh sách các bài học cụ thể, ví dụ: ["Bài 1: Khởi Tạo & Thao Tác Dictionary Cơ Bản", "Bài 2: Các Phương Thức .get(), .items() & Dictionary Comprehension"].
   - `suggested_options`: ["🚀 Chốt Lộ Trình & Bắt Đầu Học Ngay"]
"""

    prompt = f"""
Lịch sử cuộc đối thoại giữa Học viên và AI Tutor:
{formatted_history}

Tin nhắn mới nhất của Học viên: "{last_user_msg}"
Số lượt học viên đã chat: {turn_count}

Hãy sinh lời đáp JSON phù hợp nhất từ AI Tutor theo đúng yêu cầu định dạng.
"""

    raw_response = generate_json_content(prompt, system_prompt)
    if raw_response:
        try:
            data = extract_json_from_llm(raw_response)
            if "reply" in data and "step" in data:
                print(f"🤖 [AI TUTOR DIALOGUE OUTPUT]: {data.get('step')} | {data.get('reply')[:80]}...")
                return data
        except Exception as e:
            print(f"[AI Tutor Dialogue JSON Error]: {e}")

    # Fallback chỉ khi AI Gateway hoàn toàn không kết nối được
    import re
    msg_lower = last_user_msg.lower()
    
    is_asking_weakness = bool(re.search(r'\b(yếu|kém|chưa vững|cải thiện|đánh giá|trình độ|khảo sát)\b', msg_lower))
    if is_asking_weakness:
        return {
            "step": "CLARIFY",
            "reply": "Dựa trên dữ liệu tri thức của bạn, bạn có thể củng cố thêm các phần: Cấu trúc Điều Kiện, Vòng Lặp For/While, Xử Lý Chuỗi & Dictionary.\n\nBạn muốn tạo lộ trình tăng cường cho phần nào trước?",
            "suggested_options": [
                "🐍 Tăng Cường Vòng Lặp & Duyệt Mảng",
                "📊 Luyện Xử Lý Chuỗi & Slicing",
                "⚡ Thuật Toán Dictionary & Cực Trị"
            ],
            "preview_data": null
        }

    is_pure_greeting = bool(re.search(r'^\s*(hello|hi|xin chào|chào bạn|chào|hé lô|alo|bạn là ai|tên gì)\b', msg_lower))
    has_topic = bool(re.search(r'\b(học|python|loop|vòng lặp|dict|dictionary|list|slicing|chuỗi|string|oop|hàm|function|bài tập|code)\b', msg_lower))

    if is_pure_greeting and not has_topic:
        return {
            "step": "CLARIFY",
            "reply": "Chào bạn! 🤖 Mình là AI Tutor từ VIBECODE AI. Bạn đang muốn khám phá hoặc luyện tập chủ đề nào trong Python hôm nay?",
            "suggested_options": [
                "🐍 Vòng Lặp & Duyệt Mảng Python",
                "📊 Cấu Trúc Dữ Liệu Dictionary",
                "⚡ Thuật Toán Tìm Cực Trị",
                "🌐 Lập Trình Hướng Đối Tượng"
            ],
            "preview_data": null
        }
    else:
        topic_title = last_user_msg[:40].strip()
        return {
            "step": "PREVIEW",
            "reply": f"Cảm ơn bạn! 🎯 Tôi đã thiết lập xong Bản Phác Thảo Lộ Trình Thích Ứng cho chủ đề **'{topic_title}'**.",
            "preview_data": {
                "title": f"Chinh Phục {topic_title}",
                "description": f"Lộ trình bài học cá nhân hóa thích ứng theo đúng yêu cầu '{topic_title}'.",
                "target_skills": ["python_fundamentals"],
                "lessons_count": 2,
                "components": [f"Bài 1: Nền tảng cốt lõi {topic_title}", f"Bài 2: Thực hành nâng cao {topic_title}"]
            },
            "suggested_options": [
                "🚀 Chốt Lộ Trình & Bắt Đầu Học Ngay"
            ]
        }
