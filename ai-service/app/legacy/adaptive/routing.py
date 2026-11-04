import re
from typing import Dict, List

from .json_support import generate_json_content, extract_json_from_llm

class RouterAgent:
    """Agent Phân loại & Định tuyến Ý định Người Học"""

    INTENTS = [
        "CHECK_WEAKNESS",           # Hỏi điểm yếu / nhờ chẩn đoán hồ sơ
        "REQUEST_ADAPTIVE_EXERCISE",# Yêu cầu bài tập thích ứng gỡ điểm
        "ADJUST_DIFFICULTY_EASIER", # Phản hồi bài tập khó, yêu cầu bài dễ hơn / scaffolding
        "EXPLAIN_CONCEPT",          # Nhờ giải thích sâu lý thuyết hoặc cú pháp
        "GENERAL_CHAT"              # Chào hỏi, trò chuyện xã giao
    ]

    def detect_language(self, user_msg: str) -> str:
        """Nhận diện ngôn ngữ lập trình mục tiêu từ tin nhắn"""
        msg_lower = user_msg.lower()
        if re.search(r'(c\+\+|cpp|\bc plus plus\b|\bc cộng cộng\b|\bc cong cong\b|\bmôn c\+\+\b)', msg_lower):
            return "CPP"
        if re.search(r'\b(javascript|js|node|nodejs|ecmascript)\b', msg_lower):
            return "JAVASCRIPT"
        if re.search(r'\b(sql|database|csdl|truy vấn|query)\b', msg_lower):
            return "SQL"
        if re.search(r'\b(python|py)\b', msg_lower):
            return "PYTHON"
        return "PYTHON"

    def classify_intent(self, user_msg: str, history: List[Dict[str, str]]) -> str:
        msg_lower = user_msg.lower().strip()

        # 1. Regex Fast-Path cho các cụm từ phổ biến (Độ trễ <1ms)
        # 1.1 Yêu cầu giảm độ khó / lùi bước
        if re.search(r'\b(khó quá|khó thế|không hiểu|đơn giản hơn|dễ hơn|bài dễ|lùi lại|chưa làm được|giảm độ khó)\b', msg_lower):
            return "ADJUST_DIFFICULTY_EASIER"

        # 1.2 Yêu cầu bài giảng, nội dung bài học, lý thuyết, giải thích (Đặc biệt bắt "nội dung bài học")
        if re.search(r'\b(nội dung bài học|bài học|bài giảng|giáo trình|lý thuyết|giải thích|nguyên lý|cú pháp|là gì|dạy tôi|hướng dẫn học)\b', msg_lower):
            return "EXPLAIN_CONCEPT"

        # 1.3 Hỏi thăm dò điểm yếu / chẩn đoán hồ sơ
        if re.search(r'\b(yếu phần nào|yếu gì|hổng phần nào|kém phần nào|điểm yếu|hồ sơ năng lực|độ thành thạo|cần cải thiện)\b', msg_lower) or (
            re.search(r'\b(đang yếu)\b', msg_lower) and not re.search(r'\b(tạo|cho bài|ra bài|luyện|bài tập)\b', msg_lower)
        ):
            return "CHECK_WEAKNESS"

        # 1.4 Yêu cầu tạo bài tập / thực hành / ôn luyện / rèn luyện
        if re.search(r'\b(tạo|cho bài|ra bài|luyện|ôn|thực hành|thử thách|gỡ điểm|làm bài|bài tập|rèn luyện|code thử|viết code|muốn học|luyện tập|bắt đầu học)\b', msg_lower):
            return "REQUEST_ADAPTIVE_EXERCISE"

        # 1.5 Nếu có nhắc đến bất kỳ chủ đề kỹ thuật nào (dict, list, loop, hàm, oop, opp...) kèm câu hỏi
        if re.search(r'\b(dictionary|dict|từ điển|list|danh sách|tuple|set|string|chuỗi|vòng lặp|loop|hàm|function|class|oop|opp|exception|file|ép kiểu|con trỏ|pointer|vector)\b', msg_lower):
            if re.search(r'\b(giải thích|là gì|cú pháp|nguyên lý|sao lại|tại sao|nguyên nhân)\b', msg_lower):
                return "EXPLAIN_CONCEPT"
            return "REQUEST_ADAPTIVE_EXERCISE"

        # 1.6 Hỏi giải thích lý thuyết, cú pháp
        if re.search(r'\b(giải thích|là gì|cú pháp|nguyên lý|ví dụ về|hoạt động như thế nào|hướng dẫn)\b', msg_lower):
            return "EXPLAIN_CONCEPT"

        # 1.7 Chào hỏi xã giao
        if re.search(r'^\s*(hello|hi|xin chào|chào|hé lô|alo|bạn là ai)\b', msg_lower):
            return "GENERAL_CHAT"

        # 2. LLM Intent Classifier nếu câu hỏi phức tạp
        system_prompt = f"""
Bạn là Router Agent trong hệ thống AI Tutor Lập Trình Đa Ngôn Ngữ.
Nhiệm vụ: Phân loại ý định của người học vào 1 trong các INTENTS sau:
- CHECK_WEAKNESS (hỏi điểm yếu, muốn biết mình hổng phần nào)
- REQUEST_ADAPTIVE_EXERCISE (yêu cầu tạo bài tập, muốn rèn luyện)
- ADJUST_DIFFICULTY_EASIER (kêu bài khó, yêu cầu bài dễ hơn)
- EXPLAIN_CONCEPT (hỏi lý thuyết, cú pháp, giải thích khái niệm, yêu cầu nội dung bài học)
- GENERAL_CHAT (chào hỏi xã giao, lạc đề)

Trả về JSON duy nhất: {{"intent": "<INTENT>"}}
"""
        try:
            raw = generate_json_content(f"Tin nhắn: '{user_msg}'", system_prompt)
            if raw:
                parsed = extract_json_from_llm(raw)
                intent = parsed.get("intent", "").upper()
                if intent in self.INTENTS:
                    return intent
        except Exception as e:
            print(f"[RouterAgent LLM Error]: {e}")

        return "GENERAL_CHAT"
