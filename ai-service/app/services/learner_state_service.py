from typing import Dict, List, Optional, Any
from datetime import datetime, timezone
from app.contracts.mastery import LearnerState, MasteryEvent
from app.contracts.execution import ErrorEvent


class LearnerStateService:
    """
    Service quản lý Trạng thái người học (Learner State).
    ĐỘC LẬP HOÀN TOÀN với Knowledge Graph.
    Theo dõi: mastery, confidence, attempts, streaks, recent errors.
    """
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(LearnerStateService, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if getattr(self, "_initialized", False):
            return
        # In-memory storage: user_id -> concept_id -> LearnerState
        self._store: Dict[str, Dict[str, LearnerState]] = {}
        # Historical events: user_id -> List[MasteryEvent]
        self._events: Dict[str, List[MasteryEvent]] = {}
        self._initialized = True

    def get_learner_state(self, user_id: str, concept_id: str, default_mastery: float = 0.40) -> LearnerState:
        if user_id not in self._store:
            self._store[user_id] = {}
        
        if concept_id not in self._store[user_id]:
            self._store[user_id][concept_id] = LearnerState(
                user_id=user_id,
                concept_id=concept_id,
                mastery=default_mastery,
                confidence=0.50,
                attempts=0,
                correct_count=0,
                wrong_count=0,
                current_streak=0,
                recent_error_ids=[]
            )
        return self._store[user_id][concept_id]

    def set_user_mastery_batch(self, user_id: str, mastery_dict: Dict[str, float]):
        """Khởi tạo hoặc đồng bộ hàng loạt mastery từ hệ thống bên ngoài (ví dụ backend)"""
        if user_id not in self._store:
            self._store[user_id] = {}
        for cid, score in mastery_dict.items():
            st = self.get_learner_state(user_id, cid, default_mastery=float(score))
            st.mastery = float(score)

    def get_user_mastery_map(self, user_id: str) -> Dict[str, float]:
        if user_id not in self._store:
            return {}
        return {cid: state.mastery for cid, state in self._store[user_id].items()}

    def get_all_states(self, user_id: str) -> List[LearnerState]:
        if user_id not in self._store:
            return []
        return list(self._store[user_id].values())

    def apply_mastery_event(self, event: MasteryEvent) -> LearnerState:
        """Cập nhật LearnerState theo MasteryEvent phát sinh từ MasteryUpdater"""
        state = self.get_learner_state(event.user_id, event.concept_id)
        state.mastery = event.new_mastery
        state.attempts += 1
        state.last_attempt_at = event.created_at

        if event.delta > 0:
            state.correct_count += 1
            state.current_streak = state.current_streak + 1 if state.current_streak >= 0 else 1
            # Tăng confidence vì có thêm bằng chứng thực tế
            state.confidence = min(1.0, round(state.confidence + 0.05, 2))
        else:
            state.wrong_count += 1
            state.current_streak = state.current_streak - 1 if state.current_streak <= 0 else -1

        # Lưu sự kiện vào lịch sử để audit và truy vết
        if event.user_id not in self._events:
            self._events[event.user_id] = []
        self._events[event.user_id].append(event)

        return state

    def record_error(self, user_id: str, concept_id: str, error_id: str):
        state = self.get_learner_state(user_id, concept_id)
        if error_id not in state.recent_error_ids:
            state.recent_error_ids.append(error_id)
            if len(state.recent_error_ids) > 10:
                state.recent_error_ids.pop(0)

    def get_weakest_concepts(self, user_id: str, top_k: int = 3) -> List[LearnerState]:
        states = self.get_all_states(user_id)
        if not states:
            return []
        # Sort by lowest mastery first
        sorted_states = sorted(states, key=lambda s: (s.mastery, -s.wrong_count))
        return sorted_states[:top_k]

    def get_audit_trail(self, user_id: str, concept_id: Optional[str] = None) -> List[MasteryEvent]:
        events = self._events.get(user_id, [])
        if concept_id:
            return [e for e in events if e.concept_id == concept_id]
        return events
