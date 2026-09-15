import json
import re
import uuid
from typing import Dict, Any, Optional
from app.contracts.routing import RoutingDecision

try:
    from app.llm.omniroute_client import generate_json_content
except ImportError:
    try:
        from core.omniroute_client import generate_json_content
    except ImportError:
        def generate_json_content(prompt: str, system_prompt: str = None) -> str:
            return None


class IntentRouterAgent:
    """
    Agent định tuyến ý định người học.
    ĐẢM BẢO QUY TẮC:
    - Chỉ phân loại intent + trích xuất topic/language/difficulty/mode/confidence.
    - Không sinh bài tập, không quyết định mastery, không trả lời prose ngoài JSON.
    - Có cơ chế deterministic pattern matching fallback cực nhanh (<5ms).
    """

    SYSTEM_PROMPT = """Bạn là IntentRouterAgent chuyên nghiệp thuộc hệ thống Multi-Agent Adaptive Learning.
Nhiệm vụ duy nhất của bạn là phân tích câu nói của người dùng và trả về DUY NHẤT một JSON hợp lệ tuân thủ schema sau:

{
  "intent": "GENERAL_CHAT | EXPLAIN_CONCEPT | ASK_KNOWLEDGE | REQUEST_ADAPTIVE_EXERCISE | CREATE_LEARNING_PATH | CHECK_WEAKNESS",
  "language": "python | cpp | javascript | sql",
  "topic": "chuỗi tên chủ đề/khái niệm hoặc null",
  "difficulty_request": "easier | same | harder | auto",
  "mode": "remediation | progression | diagnostic",
  "confidence": 0.95
}

Quy tắc phân loại:
1. GENERAL_CHAT: Chào hỏi, câu hỏi về danh tính bot ("bạn là ai", "bot nào"), câu hỏi về các môn học có thể học ("tôi có thể học môn nào", "hệ thống hỗ trợ ngôn ngữ gì"), cảm ơn, giao tiếp tổng quát.
2. EXPLAIN_CONCEPT: Khi người dùng yêu cầu giải thích sâu về một lý thuyết, nguyên lý hoặc thuật toán cụ thể ("giải thích closure", "OOP là gì", "nguyên lý quicksort", "hoạt động của con trỏ").
3. ASK_KNOWLEDGE: Khi người dùng muốn tra cứu cây tri thức, xem danh sách skill_id, liệt kê các chủ đề/khái niệm trong một ngôn ngữ ("tra cứu tri thức JS", "danh sách kỹ năng C++", "trong Python có những skill_id nào").
4. REQUEST_ADAPTIVE_EXERCISE: Khi người dùng muốn làm bài tập, xin bài thực hành, viết code, xin bài dễ hơn/khó hơn, rèn luyện một chủ đề cụ thể.
5. CREATE_LEARNING_PATH: Khi người dùng yêu cầu xây dựng lộ trình học tập, tạo toàn bộ khóa học hoặc tạo bài học có cấu trúc cho một ngôn ngữ/chủ đề ("tạo lộ trình học JS", "lập kế hoạch học Python từ đầu", "tạo bài học về hướng đối tượng").
6. CHECK_WEAKNESS: Khi người dùng hỏi về điểm yếu, lỗ hổng kiến thức, xem mình kém phần nào nhất.

LƯU Ý QUAN TRỌNG: TUYỆT ĐỐI KHÔNG VIẾT LỜI DẪN, KHÔNG BÌNH LUẬN, CHỈ TRẢ VỀ DUY NHẤT CHUỖI JSON HỢP LỆ."""

    def __init__(self):
        pass

    def route(self, user_text: str, context: Optional[Dict[str, Any]] = None, trace_id: Optional[str] = None) -> RoutingDecision:
        t_id = trace_id or f"trace_{uuid.uuid4().hex[:12]}"
        ctx = context or {}
        default_lang = ctx.get("language") or "python"

        # 1. Deterministic Rule Matching (Fast Path)
        deterministic_decision = self._rule_based_routing(user_text, default_lang, t_id)
        if deterministic_decision and deterministic_decision.confidence >= 0.90:
            return deterministic_decision

        # 2. LLM Classification (Deep Path)
        prompt = f"""Ngữ cảnh: Ngôn ngữ mặc định: {default_lang}
Tin nhắn của người dùng: "{user_text}"

Hãy trả về JSON RoutingDecision:"""

        try:
            raw_response = generate_json_content(prompt, self.SYSTEM_PROMPT)
            if raw_response:
                parsed = self._clean_and_parse_json(raw_response)
                if parsed and "intent" in parsed:
                    lang = parsed.get("language") or default_lang
                    norm_lang = "cpp" if "c++" in lang.lower() or "cpp" in lang.lower() else ("javascript" if "js" in lang.lower() or "javascript" in lang.lower() else ("sql" if "sql" in lang.lower() else "python"))
                    
                    return RoutingDecision(
                        intent=parsed.get("intent", "GENERAL_CHAT"),
                        language=norm_lang,
                        topic=parsed.get("topic"),
                        difficulty_request=parsed.get("difficulty_request", "auto"),
                        mode=parsed.get("mode", "progression"),
                        confidence=float(parsed.get("confidence", 0.85)),
                        user_text=user_text,
                        trace_id=t_id
                    )
        except Exception as e:
            print(f"[IntentRouterAgent LLM Warning]: {e}")

        # 3. Fallback to rule-based result if LLM failed
        return deterministic_decision or RoutingDecision(
            intent="GENERAL_CHAT",
            language=default_lang,
            topic=None,
            difficulty_request="auto",
            mode="progression",
            confidence=0.50,
            user_text=user_text,
            trace_id=t_id
        )

    def _rule_based_routing(self, text: str, default_lang: str, trace_id: str) -> Optional[RoutingDecision]:
        lower = text.lower().strip()

        # Phát hiện ngôn ngữ
        lang = default_lang
        if "c++" in lower or "cpp" in lower:
            lang = "cpp"
        elif "javascript" in lower or "js" in lower:
            lang = "javascript"
        elif "python" in lower:
            lang = "python"
        elif "sql" in lower:
            lang = "sql"

        # 1. Branch 1: General Greetings & Identity/Capability Questions
        if any(g in lower for g in ["chào", "hello", "hi", "hey", "cảm ơn", "bạn là ai", "bot nào", "học môn nào", "môn học nào", "hỗ trợ ngôn ngữ nào", "hỗ trợ gì", "bạn làm được gì"]):
            return RoutingDecision(
                intent="GENERAL_CHAT",
                language=lang,
                topic=None,
                difficulty_request="auto",
                mode="progression",
                confidence=0.98,
                user_text=text,
                trace_id=trace_id
            )

        # 2. Branch 5: Agent tạo lộ trình (Create Learning Path / Course Syllabus)
        if any(kw in lower for kw in ["lộ trình", "tạo lộ trình", "kế hoạch học", "bắt đầu học", "khóa học", "khoá học", "curriculum", "learning path", "tạo bài học"]):
            return RoutingDecision(
                intent="CREATE_LEARNING_PATH",
                language=lang,
                topic=self._extract_topic(lower),
                difficulty_request="auto",
                mode="progression",
                confidence=0.95,
                user_text=text,
                trace_id=trace_id
            )

        # 3. Branch 3: Agent ASK tra cứu tri thức (Knowledge Graph Retrieval)
        if any(kw in lower for kw in ["tra cứu tri thức", "tra cứu kiến thức", "danh sách skill", "danh sách kỹ năng", "skill_id", "cây tri thức", "bản đồ tri thức", "knowledge graph", "có những chủ đề nào", "có những bài nào trong", "các concept"]):
            return RoutingDecision(
                intent="ASK_KNOWLEDGE",
                language=lang,
                topic=self._extract_topic(lower),
                difficulty_request="auto",
                mode="diagnostic",
                confidence=0.95,
                user_text=text,
                trace_id=trace_id
            )

        # 4. Diagnostic: Check Weakness
        if any(kw in lower for kw in ["yếu phần nào", "kém phần nào", "điểm yếu", "lỗ hổng", "chưa vững", "hổng kiến thức"]):
            return RoutingDecision(
                intent="CHECK_WEAKNESS",
                language=lang,
                topic=self._extract_topic(lower),
                difficulty_request="auto",
                mode="diagnostic",
                confidence=0.95,
                user_text=text,
                trace_id=trace_id
            )

        # 5. Branch 4: Agent quyết định bài tập (Request Adaptive Exercise)
        if any(kw in lower for kw in ["bài tập", "luyện tập", "thực hành", "cho tôi bài", "tạo bài", "bài dễ hơn", "bài khó hơn", "thử thách", "làm bài"]):
            diff = "auto"
            mode = "progression"
            if any(e in lower for e in ["dễ hơn", "đơn giản hơn", "dễ nhất", "cơ bản"]):
                diff = "easier"
                mode = "remediation"
            elif any(h in lower for h in ["khó hơn", "nâng cao", "thử thách"]):
                diff = "harder"
                mode = "progression"

            if "yếu" in lower or "hổng" in lower or "lại" in lower:
                mode = "remediation"

            return RoutingDecision(
                intent="REQUEST_ADAPTIVE_EXERCISE",
                language=lang,
                topic=self._extract_topic(lower),
                difficulty_request=diff,
                mode=mode,
                confidence=0.95,
                user_text=text,
                trace_id=trace_id
            )

        # 6. Branch 2: Agent giải thích (Explain Concept / Pure Theory)
        if any(kw in lower for kw in ["giải thích", "là gì", "nguyên lý", "như thế nào", "cách hoạt động", "lý thuyết", "dạy tôi", "hướng dẫn"]):
            return RoutingDecision(
                intent="EXPLAIN_CONCEPT",
                language=lang,
                topic=self._extract_topic(lower),
                difficulty_request="auto",
                mode="progression",
                confidence=0.92,
                user_text=text,
                trace_id=trace_id
            )

        return None

    def _extract_topic(self, text: str) -> Optional[str]:
        topics = [
            ("variable", ["biến", "hằng số", "variable", "const", "let", "var", "kiểu dữ liệu"]),
            ("function", ["function", "hàm", "arrow function", "tham số", "parameter"]),
            ("loop", ["loop", "vòng lặp", "for", "while"]),
            ("oop", ["oop", "hướng đối tượng", "class", "lớp", "constructor", "kế thừa", "polymorphism", "encapsulation"]),
            ("pointer", ["pointer", "con trỏ", "reference", "tham chiếu"]),
            ("dictionary", ["dict", "dictionary", "từ điển", "key-value", "object"]),
            ("array", ["mảng", "array", "list", "danh sách", "vector"]),
            ("string", ["chuỗi", "string", "xâu"]),
            ("recursion", ["đệ quy", "recursion"]),
            ("closure", ["closure", "bao đóng"]),
            ("error_handling", ["try catch", "ngoại lệ", "exception", "xử lý lỗi"])
        ]
        for topic_key, keywords in topics:
            if any(kw in text for kw in keywords):
                return topic_key
        return None

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
