import uuid
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from app.contracts.mastery import MasteryEvent
from app.contracts.attribution import ConceptAttribution
from app.services.learner_state_service import LearnerStateService


class MasteryUpdater:
    """
    Bộ cập nhật độ thành thạo (Mastery Updater).
    QUY TẮC HIẾN PHÁP (Constitutional Rule):
    - Hoàn toàn tất định (Deterministic 100%), không dùng LLM đoán điểm.
    - Cập nhật điểm năng lực phải có policy_version và evidence_ids để kiểm toán 100%.
    - Nếu confidence < 0.60: TUYỆT ĐỐI KHÔNG GIẢM MASTERY MẠNH.
    """

    POLICY_VERSION = "mastery_policy_v2.1"

    def __init__(self, learner_service: Optional[LearnerStateService] = None):
        self.learner_service = learner_service or LearnerStateService()

    def update_mastery(
        self,
        user_id: str,
        concept_id: str,
        passed: bool,
        attribution: Optional[ConceptAttribution] = None,
        difficulty: str = "MEDIUM",
        evidence_ids: Optional[List[str]] = None,
        trace_id: Optional[str] = None
    ) -> MasteryEvent:
        t_id = trace_id or f"trace_{uuid.uuid4().hex[:12]}"
        ev_ids = list(evidence_ids or [])
        if attribution:
            ev_ids.append(attribution.error_id)
            ev_ids.append(attribution.submission_id)

        # Lấy state hiện tại
        current_state = self.learner_service.get_learner_state(user_id, concept_id)
        prev_mastery = current_state.mastery

        if passed:
            # 1. Học viên giải đúng bài tập
            diff_multiplier = {
                "EASY": 0.08,
                "MEDIUM": 0.10,
                "HARD": 0.12,
                "CHALLENGE": 0.15
            }.get(difficulty.upper(), 0.10)

            delta = diff_multiplier
            new_mastery = min(1.0, round(prev_mastery + delta, 2))
            reason = "EXERCISE_PASSED"

        else:
            # 2. Học viên giải sai / gặp lỗi
            confidence = attribution.selected.confidence if (attribution and attribution.selected) else 0.50

            if confidence >= 0.60:
                # Độ tin cậy cao: Giảm nhẹ điểm năng lực và ghi nhận điểm yếu
                delta = -round(0.05 * confidence, 2)
                new_mastery = max(0.05, round(prev_mastery + delta, 2))
                reason = f"ATTRIBUTED_ERROR_PENALTY (Confidence: {confidence})"

                if attribution and attribution.error_id:
                    self.learner_service.record_error(user_id, concept_id, attribution.error_id)
            else:
                # Độ tin cậy thấp (< 0.60): KHÔNG giảm điểm mạnh để tránh phạt oan học viên
                delta = 0.0
                new_mastery = prev_mastery
                reason = f"LOW_CONFIDENCE_ERROR_OBSERVED (Confidence: {confidence}, No Mastery Penalty)"

        # Tạo MasteryEvent
        event = MasteryEvent(
            event_id=f"mevt_{uuid.uuid4().hex[:10]}",
            user_id=user_id,
            concept_id=concept_id,
            previous_mastery=prev_mastery,
            delta=delta,
            new_mastery=new_mastery,
            reason=reason,
            evidence_ids=ev_ids,
            policy_version=self.POLICY_VERSION,
            created_at=datetime.now(timezone.utc).isoformat(),
            trace_id=t_id
        )

        # Cập nhật trực tiếp vào LearnerState
        self.learner_service.apply_mastery_event(event)

        return event
