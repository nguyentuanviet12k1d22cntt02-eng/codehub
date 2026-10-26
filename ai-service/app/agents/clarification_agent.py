class ClarificationAgent:
    """Ask one safe, focused question without depending on an LLM provider."""

    LANGUAGE_OPTIONS = ["Python", "JavaScript", "C++", "SQL"]
    LANGUAGE_NAMES = {"python": "Python", "javascript": "JavaScript",
                      "cpp": "C++", "sql": "SQL"}

    def __init__(self, client=None):
        # Keep the constructor compatible with existing orchestration callers.
        self.client = client

    def ask(self, request, reason, routing, catalog):
        if reason == "language":
            return {"question": "Bạn muốn dùng ngôn ngữ lập trình nào?",
                    "suggested_options": list(self.LANGUAGE_OPTIONS)}
        if reason == "language_and_topic":
            return {"question": "Bạn muốn học chủ đề nào và bằng ngôn ngữ lập trình nào?",
                    "suggested_options": list(self.LANGUAGE_OPTIONS)}
        if reason == "topic":
            language = self.LANGUAGE_NAMES.get(getattr(routing, "language", None))
            question = (f"Bạn muốn học chủ đề cụ thể nào trong {language}?" if language else
                        "Bạn muốn học chủ đề lập trình cụ thể nào?")
            return {"question": question, "suggested_options": []}
        language = self.LANGUAGE_NAMES.get(getattr(routing, "language", None))
        question = (f"Mình chưa chắc đã hiểu đúng yêu cầu. Bạn muốn luyện chủ đề cụ thể nào trong {language}?"
                    if language else
                    "Mình chưa chắc đã hiểu đúng yêu cầu. Bạn muốn học chủ đề nào, bằng ngôn ngữ nào?")
        return {"question": question, "suggested_options": []}
