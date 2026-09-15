from typing import Dict, List, Optional
from app.contracts.execution import ExecutionResult, ErrorEvent


class LearningHistoryService:
    """
    Service theo dõi lịch sử làm bài và phát hiện lỗi lặp lại.
    Đầu vào cho AdaptiveExercisePlanner xác định khi nào cần ép buộc chế độ Remediation.
    """
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(LearningHistoryService, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if getattr(self, "_initialized", False):
            return
        # user_id -> List[ExecutionResult]
        self._submissions: Dict[str, List[ExecutionResult]] = {}
        # user_id -> List[ErrorEvent]
        self._errors: Dict[str, List[ErrorEvent]] = {}
        self._initialized = True

    def record_submission(self, user_id: str, result: ExecutionResult):
        if user_id not in self._submissions:
            self._submissions[user_id] = []
        self._submissions[user_id].append(result)

    def record_error_event(self, user_id: str, error: ErrorEvent):
        if user_id not in self._errors:
            self._errors[user_id] = []
        self._errors[user_id].append(error)

    def get_recent_submissions(self, user_id: str, limit: int = 5) -> List[ExecutionResult]:
        return self._submissions.get(user_id, [])[-limit:]

    def get_recent_errors(self, user_id: str, limit: int = 5) -> List[ErrorEvent]:
        return self._errors.get(user_id, [])[-limit:]

    def count_repeated_errors(self, user_id: str, concept_id: Optional[str] = None, normalized_type: Optional[str] = None) -> int:
        """Đếm số lần lặp lại cùng một loại lỗi trong 5 lần nộp bài gần nhất"""
        recent_errs = self.get_recent_errors(user_id, limit=5)
        count = 0
        for err in recent_errs:
            match_type = True
            if normalized_type and err.normalized_type != normalized_type:
                match_type = False
            if match_type:
                count += 1
        return count

    def is_remediation_forced(self, user_id: str, concept_id: str) -> bool:
        """Quy tắc Mục 10: Lặp cùng một lỗi hoặc làm sai >= 3 lần thì ép buộc Remediation"""
        recent_subs = self.get_recent_submissions(user_id, limit=4)
        concept_fails = [
            s for s in recent_subs 
            if s.concept_id == concept_id and s.status != 'PASSED'
        ]
        return len(concept_fails) >= 3
