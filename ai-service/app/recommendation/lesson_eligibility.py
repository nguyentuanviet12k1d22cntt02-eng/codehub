"""Deterministic PAL-Net lesson eligibility contract.

This module deliberately does not score or rank lessons.  It is the safety
boundary that runs before any learned or rule-based policy may see candidates.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import FrozenSet, Iterable, Optional, Tuple


VERIFIED_MAPPING_STATUS = "VERIFIED"
PUBLISHED_RELEASE_STATUS = "PUBLISHED"
VALIDATED_CONTENT_STATUS = "VALIDATED"


class EligibilityContractViolation(ValueError):
    """Raised when persisted roadmap state violates a product invariant."""


@dataclass(frozen=True)
class ContractVersions:
    policy_version: str
    mapping_version: str
    graph_version: str


@dataclass(frozen=True)
class LearnerDecisionState:
    language: str
    goal_id: str
    assessment_id: str
    goal_skill_ids: FrozenSet[str]
    completed_lesson_ids: FrozenSet[str] = frozenset()
    satisfied_skill_ids: FrozenSet[str] = frozenset()
    open_lesson_ids: FrozenSet[str] = frozenset()


@dataclass(frozen=True)
class LessonCandidate:
    lesson_id: str
    language: str
    goal_ids: FrozenSet[str]
    primary_skill_id: str
    secondary_skill_ids: FrozenSet[str] = frozenset()
    prerequisite_lesson_ids: FrozenSet[str] = frozenset()
    prerequisite_skill_ids: FrozenSet[str] = frozenset()
    release_status: str = PUBLISHED_RELEASE_STATUS
    content_validation_status: str = VALIDATED_CONTENT_STATUS
    mapping_status: str = VERIFIED_MAPPING_STATUS
    policy_version: str = ""
    mapping_version: str = ""
    graph_version: str = ""
    curriculum_order: int = 0
    is_diagnostic: bool = False
    difficulty: Optional[float] = None


@dataclass(frozen=True)
class EligibilityEvaluation:
    lesson_id: str
    eligible: bool
    exclusion_reasons: Tuple[str, ...]


def evaluate_lesson(
    candidate: LessonCandidate,
    state: LearnerDecisionState,
    versions: ContractVersions,
) -> EligibilityEvaluation:
    """Evaluate one lesson using only pre-decision state."""

    reasons = []
    if candidate.language != state.language:
        reasons.append("WRONG_LANGUAGE")
    if state.goal_id not in candidate.goal_ids:
        reasons.append("OUTSIDE_GOAL")
    if candidate.primary_skill_id not in state.goal_skill_ids:
        reasons.append("PRIMARY_SKILL_OUTSIDE_GOAL_CLOSURE")
    if not candidate.secondary_skill_ids.issubset(state.goal_skill_ids):
        reasons.append("SECONDARY_SKILL_OUTSIDE_GOAL_CLOSURE")
    if candidate.lesson_id in state.completed_lesson_ids:
        reasons.append("ALREADY_COMPLETED")
    if not candidate.prerequisite_lesson_ids.issubset(state.completed_lesson_ids):
        reasons.append("UNMET_LESSON_PREREQUISITE")
    if not candidate.prerequisite_skill_ids.issubset(state.satisfied_skill_ids):
        reasons.append("UNMET_SKILL_PREREQUISITE")
    if candidate.release_status != PUBLISHED_RELEASE_STATUS:
        reasons.append("LESSON_NOT_PUBLISHED")
    if candidate.content_validation_status != VALIDATED_CONTENT_STATUS:
        reasons.append("CONTENT_NOT_VALIDATED")
    if candidate.mapping_status != VERIFIED_MAPPING_STATUS:
        reasons.append("MAPPING_NOT_VERIFIED")
    if candidate.policy_version != versions.policy_version:
        reasons.append("POLICY_VERSION_MISMATCH")
    if candidate.mapping_version != versions.mapping_version:
        reasons.append("MAPPING_VERSION_MISMATCH")
    if candidate.graph_version != versions.graph_version:
        reasons.append("GRAPH_VERSION_MISMATCH")
    return EligibilityEvaluation(candidate.lesson_id, not reasons, tuple(reasons))


def eligible_lessons(
    candidates: Iterable[LessonCandidate],
    state: LearnerDecisionState,
    versions: ContractVersions,
) -> Tuple[LessonCandidate, ...]:
    """Return the stable, curriculum-ordered candidate set for a new decision.

    Policy v1 makes a lesson decision only while creating a roadmap.  An
    existing open item therefore blocks a second decision instead of being
    silently re-ranked.  More than one open item is corrupt state.
    """

    if len(state.open_lesson_ids) > 1:
        raise EligibilityContractViolation("ROADMAP_HAS_MULTIPLE_OPEN_ITEMS")
    if state.open_lesson_ids or not state.assessment_id.strip():
        return ()

    unique = {}
    for candidate in candidates:
        if candidate.lesson_id in unique:
            raise EligibilityContractViolation(
                f"DUPLICATE_LESSON_CANDIDATE:{candidate.lesson_id}"
            )
        unique[candidate.lesson_id] = candidate

    eligible = [
        candidate
        for candidate in unique.values()
        if evaluate_lesson(candidate, state, versions).eligible
    ]
    return tuple(sorted(eligible, key=lambda item: (item.curriculum_order, item.lesson_id)))

