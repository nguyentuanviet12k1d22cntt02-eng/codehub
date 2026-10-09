import math
import re


class PrerequisiteAdvisorAgent:
    """Deterministically assess whether a requested concept is learnable now."""

    MASTERY_THRESHOLD = 0.60
    CONFIDENCE_THRESHOLD = 0.25

    def __init__(self, knowledge_graph):
        self.kg = knowledge_graph

    @staticmethod
    def is_override_confirmation(user_text, pending_confirmation=None):
        if not isinstance(pending_confirmation, dict) or not pending_confirmation.get("target_concept_id"):
            return False
        text = " ".join(str(user_text or "").lower().split())
        patterns = (
            r"\btoi van muon\b", r"\bmình vẫn muốn\b", r"\btôi vẫn muốn\b",
            r"\bvan (?:tao|hoc|tiep tuc)\b", r"\bvẫn (?:tạo|học|tiếp tục)\b",
            r"\bbo qua (?:de xuat|tien quyet)\b", r"\bbỏ qua (?:đề xuất|tiên quyết)\b",
            r"^(?:van |vẫn )?tiep tuc(?: di)?$", r"^(?:vẫn )?tiếp tục(?: đi)?$",
        )
        return any(re.search(pattern, text) for pattern in patterns)

    def assess(self, language, target_concept_id, learner_context=None):
        context = learner_context or {}
        states = context.get("states", {}) if isinstance(context.get("states", {}), dict) else {}
        target = self.kg.get_concept(language, target_concept_id)
        if not target:
            raise ValueError("Concept mục tiêu không tồn tại trong đồ thị tri thức")

        # Traverse the complete prerequisite chain. Deeper foundations are
        # recommended first, then lower mastery and stable concept ID.
        depths = {}
        queue = [(concept_id, 1) for concept_id in self.kg.get_prerequisites(language, target_concept_id)]
        while queue:
            concept_id, depth = queue.pop(0)
            if concept_id in depths and depths[concept_id] >= depth:
                continue
            depths[concept_id] = depth
            queue.extend((parent, depth + 1) for parent in self.kg.get_prerequisites(language, concept_id))

        statuses = []
        for concept_id, depth in depths.items():
            concept = self.kg.get_concept(language, concept_id) or {"name": concept_id}
            state = states.get(concept_id, {}) if isinstance(states.get(concept_id, {}), dict) else {}
            attempts = max(0, int(state.get("attempts", 0) or 0))
            mastery = min(1.0, max(0.0, float(state.get("mastery", 0) or 0))) if attempts else None
            confidence = min(1.0, max(0.0, float(
                state.get("confidence", 1 - math.exp(-attempts / 3)) or 0
            ))) if attempts else None
            ready = bool(attempts and mastery >= self.MASTERY_THRESHOLD and confidence >= self.CONFIDENCE_THRESHOLD)
            statuses.append({
                "concept_id": concept_id,
                "concept_name": concept.get("name", concept_id),
                "depth": depth,
                "direct": depth == 1,
                "attempts": attempts,
                "mastery": mastery,
                "confidence": confidence,
                "ready": ready,
            })

        target_state = states.get(target_concept_id, {}) if isinstance(states.get(target_concept_id, {}), dict) else {}
        target_attempts = max(0, int(target_state.get("attempts", 0) or 0))
        target_mastery = min(1.0, max(0.0, float(target_state.get("mastery", 0) or 0))) if target_attempts else None
        target_confidence = min(1.0, max(0.0, float(
            target_state.get("confidence", 1 - math.exp(-target_attempts / 3)) or 0
        ))) if target_attempts else None
        target_ready = bool(
            target_attempts and target_mastery >= self.MASTERY_THRESHOLD
            and target_confidence >= self.CONFIDENCE_THRESHOLD
        )
        direct_statuses = [status for status in statuses if status["direct"]]
        direct_gaps = [status for status in direct_statuses if not status["ready"]]
        readiness = (1.0 if not direct_statuses else
                     sum((status["mastery"] or 0.0) for status in direct_statuses) / len(direct_statuses))
        evidence_coverage = (1.0 if not direct_statuses else
                             sum(status["attempts"] > 0 for status in direct_statuses) / len(direct_statuses))
        if target_ready:
            readiness = max(readiness, target_mastery)
        ready = target_ready or not direct_gaps
        gaps = [] if ready else [status for status in statuses if not status["ready"]]
        priority = sorted(gaps, key=lambda status: (-status["depth"], status["mastery"] or 0.0, status["concept_id"]))

        return {
            "target_concept_id": target_concept_id,
            "target_concept_name": target.get("name", target_concept_id),
            "language": language,
            "ready": ready,
            "readiness_score": round(readiness, 4),
            "readiness_percent": round(readiness * 100),
            "evidence_coverage": round(evidence_coverage, 4),
            "target_state": {
                "attempts": target_attempts,
                "mastery": target_mastery,
                "confidence": target_confidence,
                "ready": target_ready,
            },
            "prerequisite_statuses": sorted(statuses, key=lambda status: (-status["depth"], status["concept_id"])),
            "prerequisite_gaps": [status["concept_id"] for status in priority],
            "recommended_concept_id": priority[0]["concept_id"] if priority else None,
            "recommended_concept_name": priority[0]["concept_name"] if priority else None,
            "recommended_path": [status["concept_id"] for status in priority] + [target_concept_id],
            "policy": "prerequisite_readiness_v1",
        }
