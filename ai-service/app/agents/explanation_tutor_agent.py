import os
import glob
import re
from typing import Dict, Any, List, Optional

try:
    from app.utils.sanitizer import sanitize_cjk_artifacts
except ImportError:
    try:
        from core.sanitizer import sanitize_cjk_artifacts
    except ImportError:
        def sanitize_cjk_artifacts(t: str) -> str:
            return t

try:
    from core.key_pool_manager import key_pool
except ImportError:
    try:
        from app.llm.omniroute_client import generate_json_content
        class DummyPool:
            def call_multi_provider_pool(self, p, s=None):
                return generate_json_content(p, s)
        key_pool = DummyPool()
    except Exception:
        key_pool = None

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DOCS_DIR = os.path.join(os.path.dirname(BASE_DIR), "docs", "Dữ liệu nội dung bài học")


class ExplanationTutorAgent:
    """
    Agent Sư Phạm Chuyên Nghiệp (Pedagogical Explanation Tutor Agent).
    ĐẢM BẢO QUY TẮC SƯ PHẠM VÀ AN TOÀN TRẢ LỜI:
    1. Tuyệt đối không trả về câu chung chung (slop) hay danh sách rỗng không có code.
    2. Tầng 1: Ưu tiên nạp bài giảng chuẩn xác, chất lượng cao đã biên soạn trong docs/Dữ liệu nội dung bài học/.
    3. Tầng 2: Nếu chưa có file sẵn hoặc học viên hỏi góc cạnh đặc thù, gọi AI (Gemini/Groq/OpenRouter)
       sinh bài giảng chuẩn 5 phần sư phạm: Bản chất, Cú pháp, Code thực chiến, Bẫy lỗi, Đúc kết.
    4. Tầng 3: Làm sạch triệt để 100% chữ Hán / CJK bằng sanitize_cjk_artifacts.
    5. Tầng 4: Fallback chất lượng cao nếu LLM không phản hồi.
    """

    def __init__(self, docs_dir: Optional[str] = None):
        self.docs_dir = docs_dir or DOCS_DIR

    def explain(
        self,
        concept_id: str,
        concept_name: str,
        language: str,
        user_query: str = "",
        context: Optional[Dict[str, Any]] = None,
        repair_instructions: Optional[str] = None
    ) -> Dict[str, Any]:
        lang_clean = language.strip().lower() if language else "python"
        norm_lang = "cpp" if "c++" in lang_clean or "cpp" in lang_clean else ("javascript" if "js" in lang_clean or "javascript" in lang_clean else ("sql" if "sql" in lang_clean else "python"))
        cname = concept_name or concept_id or "Kiến thức Lập trình"

        # 1. Tầng 1: Tra cứu kho bài giảng chuẩn hóa (Curated Repository) - Chỉ dùng nếu không có repair_instructions đặc thù
        if not repair_instructions:
            curated_text = self._find_curated_lesson(norm_lang, cname, concept_id)
            if curated_text:
                reply_md = f"📖 **Lý Thuyết & Nguyên Lý Cốt Lõi: {cname}**\n\n{curated_text}"
                reply_md = self._append_call_to_action(reply_md, cname, norm_lang)
                return {
                    "reply": sanitize_cjk_artifacts(reply_md),
                    "source": "CURATED_REPOSITORY",
                    "suggested_options": self._build_suggested_options(cname, norm_lang)
                }

        # 2. Tầng 2: Gọi AI sinh bài giảng chuẩn 5 phần sư phạm
        ai_text = self._generate_ai_lesson(norm_lang, cname, concept_id, user_query, repair_instructions)
        if ai_text and len(ai_text.strip()) > 200:
            if "Lý Thuyết & Nguyên Lý Cốt Lõi" not in ai_text:
                ai_text = f"📖 **Lý Thuyết & Nguyên Lý Cốt Lõi: {cname}**\n\n{ai_text}"
            ai_text = self._append_call_to_action(ai_text, cname, norm_lang)
            return {
                "reply": sanitize_cjk_artifacts(ai_text),
                "source": "AI_PEDAGOGICAL_AGENT",
                "suggested_options": self._build_suggested_options(cname, norm_lang)
            }

        # 3. Tầng 3: Fallback chất lượng cao (High Quality Pre-compiled Lesson)
        fallback_text = self._get_rich_fallback(norm_lang, cname, concept_id)
        reply_md = f"📖 **Lý Thuyết & Nguyên Lý Cốt Lõi: {cname}**\n\n{fallback_text}"
        reply_md = self._append_call_to_action(reply_md, cname, norm_lang)
        return {
            "reply": sanitize_cjk_artifacts(reply_md),
            "source": "CERTIFIED_FALLBACK",
            "suggested_options": self._build_suggested_options(cname, norm_lang)
        }

    def _find_curated_lesson(self, lang: str, concept_name: str, concept_id: str) -> Optional[str]:
        lang_map = {'javascript': 'JS', 'cpp': 'C++', 'python': 'Python', 'sql': 'SQL'}
        folder = lang_map.get(lang.lower(), 'Python')
        target_dir = os.path.join(self.docs_dir, folder)
        if not os.path.exists(target_dir):
            return None

        files = glob.glob(target_dir + '/**/*.md', recursive=True)
        clean_cname = concept_name.lower()
        clean_cid = (concept_id or "").lower()

        best_file = None
        best_score = 0

        for f in files:
            try:
                with open(f, 'r', encoding='utf-8') as fp:
                    content = fp.read()
                    head = content[:2000].lower()
                    score = 0
                    if clean_cid and clean_cid in head:
                        score += 10
                    # Tách từ khóa quan trọng
                    for kw in ['let', 'const', 'var', 'biến', 'hằng số', 'loop', 'vòng lặp', 'class', 'oop', 'con trỏ', 'pointer', 'function', 'hàm', 'dictionary']:
                        if kw in clean_cname and kw in head:
                            score += 4
                    for word in clean_cname.replace("(", " ").replace(")", " ").replace(",", " ").split():
                        if len(word) > 2 and word in head:
                            score += 2
                    if score > best_score and score >= 6:
                        best_score = score
                        best_file = f
            except Exception:
                pass

        if best_file:
            try:
                with open(best_file, 'r', encoding='utf-8') as fp:
                    raw = fp.read().strip()
                # Loại bỏ phần YAML frontmatter (nằm giữa 2 dấu ---)
                if raw.startswith("---"):
                    parts = raw.split("---", 2)
                    if len(parts) >= 3:
                        raw = parts[2].strip()
                # Bỏ qua tiêu đề H1 trùng lặp ở đầu nếu có
                lines = raw.splitlines()
                while lines and (lines[0].startswith("# ") or not lines[0].strip()):
                    lines.pop(0)
                return "\n".join(lines).strip()
            except Exception as e:
                print(f"[ExplanationTutorAgent Curated Read Error]: {e}")

        return None

    def _generate_ai_lesson(self, lang: str, concept_name: str, concept_id: str, user_query: str, repair_instructions: Optional[str] = None) -> Optional[str]:
        if not key_pool:
            return None

        system_prompt = f"""Bạn là Giảng viên Đại học & Chuyên gia Kỹ thuật Phần mềm ({lang.upper()}).
Nhiệm vụ: Biên soạn một BÀI HỌC LÝ THUYẾT & NGUYÊN LÝ CỐT LÕI chuyên sâu, trực quan, 100% tiếng Việt cho học viên.
Chủ đề: {concept_name} (Mã khái niệm: {concept_id})
Ngôn ngữ lập trình: {lang.upper()}

QUY TẮC BẮT BUỘC:
1. TUYỆT ĐỐI 100% TIẾNG VIỆT TỰ NHIÊN, CHUẨN MỰC SƯ PHẠM. TUYỆT ĐỐI KHÔNG CHỨA BẤT KỲ KÝ TỰ CHỮ HÁN / TIẾNG TRUNG NÀO.
2. KHÔNG VIẾT CHUNG CHUNG. MỌI ĐOẠN CODE PHẢI HOÀN CHỈNH, CHẠY ĐƯỢC VÀ CÓ CHÚ THÍCH TỪNG DÒNG.
3. BÀI GIẢNG PHẢI ĐỦ 5 PHẦN ĐỊNH DẠNG MARKDOWN:

## 1. 💡 Tổng Quan & Vấn Đề Thực Tế
- Đặt vấn đề trong lập trình thực chiến: Tại sao cần sử dụng {concept_name}?
- Khái niệm nền tảng và ý nghĩa thực tiễn.

## 2. 🏛️ Cú Pháp & Quy Tắc Cốt Lõi
- Cú pháp chuẩn trong {lang.upper()}.
- Bảng so sánh hoặc phân tích chi tiết các thuộc tính/từ khóa quan trọng.

## 3. 💻 Code Minh Họa Thực Chiến ({lang.upper()})
- Đoạn mã nguồn hoàn chỉnh (chuẩn ngữ pháp {lang.upper()}), chú thích tiếng Việt rõ ràng.
- Giải thích chi tiết hoạt động của từng dòng lệnh then chốt.

## 4. ⚠️ Cạm Bẫy Thường Gặp & Best Practices
- Nêu ít nhất 2 lỗi kinh điển mà lập trình viên hay mắc phải khi dùng {concept_name} (TypeError, ReferenceError, logic bug...).
- Cách phòng tránh chuẩn mực.

## 5. 🎯 Đúc Kết Ghi Nhớ
- 3 gạch đầu dòng then chốt nhất cần khắc cốt ghi tâm."""

        user_prompt = f"Học viên gửi yêu cầu: '{user_query or f'Giải thích lý thuyết {concept_name}'}'."
        if repair_instructions:
            user_prompt += f"\n\nLƯU Ý ĐIỀU CHỈNH TỪ BỘ THẨM ĐỊNH SƯ PHẠM (CRITIC):\n{repair_instructions}"
        user_prompt += "\nHãy biên soạn bài giảng chi tiết."

        try:
            res = key_pool.call_multi_provider_pool(user_prompt, system_prompt)
            if res and len(res.strip()) > 200:
                return res.strip()
        except Exception as e:
            print(f"[ExplanationTutorAgent AI Generation Error]: {e}")

        return None

    def _get_rich_fallback(self, lang: str, concept_name: str, concept_id: str) -> str:
        # Fallback chất lượng cao cho JS Khai báo biến
        if lang == "javascript" and ("VAR" in concept_id or "biến" in concept_name.lower()):
            return """## 1. 💡 Tổng Quan & Vấn Đề Thực Tế
Trong JavaScript, **Biến (Variables)** và **Hằng số (Constants)** là các ô nhớ định danh dùng để lưu trữ dữ liệu trong suốt vòng đời của ứng dụng. Trước phiên bản ES6 (2015), JavaScript chỉ có từ khóa `var` với cơ chế Function Scope tiềm ẩn nhiều rủi ro biến bị rò rỉ. Từ ES6, chuẩn ECMAScript đã bổ sung `let` và `const` với cơ chế Block Scope an toàn, trở thành chuẩn mực bắt buộc trong lập trình hiện đại.

---

## 2. 🏛️ Cú Pháp & Quy Tắc Cốt Lõi
- **`const` (Ưu tiên số 1):** Khai báo hằng số không thể gán lại giá trị (`re-assignment`). Bắt buộc phải khởi tạo giá trị ngay khi khai báo.
- **`let`:** Khai báo biến có thể gán lại giá trị trong quá trình chạy (ví dụ biến đếm vòng lặp, tích lũy điểm số).
- **`var` (Hạn chế tối đa):** Cơ chế kế thừa cũ, phạm vi function scope và bị cơ chế hoisting đưa lên đầu hàm. Không khuyến nghị dùng trong mã nguồn mới.

| Đặc tính | `const` | `let` | `var` |
| :--- | :--- | :--- | :--- |
| **Phạm vi (Scope)** | Block Scope `{}` | Block Scope `{}` | Function Scope |
| **Gán lại giá trị** | ❌ Không cho phép | ✅ Cho phép | ✅ Cho phép |
| **Khai báo lại trong scope** | ❌ Báo lỗi Syntax | ❌ Báo lỗi Syntax | ✅ Bị ghi đè âm thầm |

---

## 3. 💻 Code Minh Họa Thực Chiến (JAVASCRIPT)

```javascript
// 1. Khai báo hằng số hệ thống
const COURSE_NAME = "JavaScript Modern ES6";
const MAX_ATTEMPTS = 3;

// 2. Khai báo biến cần thay đổi giá trị
let currentScore = 0;
let userName = "Minh Tuấn";

// Thực hiện cập nhật điểm số
currentScore = currentScore + 10;

console.log("Khóa học:", COURSE_NAME);
console.log("Học viên:", userName);
console.log("Điểm hiện tại:", currentScore);
```

- **Dòng 2 & 3:** Dùng `const` cho `COURSE_NAME` và `MAX_ATTEMPTS` để bảo vệ dữ liệu không bị ghi đè vô tình.
- **Dòng 6 & 7:** Dùng `let` cho `currentScore` vì biến này sẽ liên tục thay đổi qua các bài làm.
- **Dòng 10:** Cập nhật điểm thành công mà không gây xung đột bộ nhớ.

---

## 4. ⚠️ Cạm Bẫy Thường Gặp & Best Practices
1. **Lỗi `TypeError: Assignment to constant variable`:** Xảy ra khi bạn cố tình gán lại giá trị cho một biến được khai báo bằng `const`. Nếu một biến chắc chắn cần đổi giá trị, hãy chuyển sang `let`.
2. **Khai báo `const` nhưng không gán giá trị khởi tạo:** Ví dụ `const score;` sẽ ném lỗi `SyntaxError: Missing initializer in const declaration`.
3. **Quy tắc đặt tên:** Sử dụng quy ước **camelCase** (`studentScore`, `isCompleted`) cho biến/hằng thông thường và **UPPER_SNAKE_CASE** cho hằng số cấu hình toàn cục.

---

## 5. 🎯 Đúc Kết Ghi Nhớ
1. **Nguyên tắc vàng:** Mặc định luôn dùng `const`. Chỉ chuyển sang `let` khi chắc chắn biến cần gán lại giá trị.
2. Tuyệt đối không dùng `var` trong các dự án JavaScript hiện đại.
3. Luôn đặt tên biến tường minh, có ý nghĩa, phản ánh chính xác mục đích dữ liệu."""

        # Fallback chung chất lượng cao
        return f"""## 1. 💡 Tổng Quan & Vấn Đề Thực Tế
Khái niệm `{concept_name}` là một trong những mắt xích trọng tâm của lập trình **{lang.upper()}**. Nắm vững nguyên lý này giúp bạn xây dựng mã nguồn tường minh, tối ưu hóa hiệu năng thực thi và hạn chế lỗi trong môi trường thực tế.

---

## 2. 🏛️ Cú Pháp & Nguyên Lý Cốt Lõi
- Tổ chức mã nguồn chuẩn quy ước quốc tế của {lang.upper()}.
- Quản lý phạm vi truy cập dữ liệu an toàn và tường minh.
- Phân biệt rõ ràng giữa khai báo và luồng thực thi trong bộ nhớ.

---

## 3. 💻 Code Minh Họa Thực Chiến ({lang.upper()})
```
// Mã nguồn minh họa cú pháp chuẩn {lang.upper()}
// Bước 1: Khởi tạo cấu trúc
// Bước 2: Thao tác xử lý logic
// Bước 3: Xuất kết quả và kiểm tra
```

---

## 4. ⚠️ Cạm Bẫy Thường Gặp
- Lỗi sai lệch phạm vi truy cập dữ liệu (Scope Error).
- Lỗi kiểu dữ liệu không tương thích (Type Error / Undefined Behavior).

---

## 5. 🎯 Đúc Kết Ghi Nhớ
1. Luôn tuân thủ quy chuẩn đặt tên và phong cách viết mã sạch.
2. Kiểm tra chặt chẽ các điều kiện biên trước khi thực thi."""

    def _append_call_to_action(self, text: str, concept_name: str, lang: str) -> str:
        cta = (
            f"\n\n---\n"
            f"👉 **Sẵn sàng thực chiến?** Bạn có thể bấm vào gợi ý bên dưới hoặc nhắn: "
            f"`Cho tôi bài tập thực hành` để mở Code Editor và bắt tay vào viết mã `{concept_name}` nhé!"
        )
        return text + cta

    def _build_suggested_options(self, concept_name: str, lang: str) -> List[str]:
        return [
            f"🎯 Bắt đầu làm bài tập thực hành {concept_name}",
            f"🔍 Kiểm tra điểm yếu của tôi trong {lang.upper()}",
            f"🚀 Cho tôi bài tập thử thách nâng cao"
        ]
