"""Auditable lesson-only policies; inputs must come from a trusted server adapter."""

from __future__ import annotations

from dataclasses import dataclass, replace
from typing import Optional, Tuple

from .lesson_eligibility import (
    ContractVersions, LearnerDecisionState, LessonCandidate, eligible_lessons,
)


POLICY_CURRICULUM = "CURRICULUM_ORDER"
POLICY_WEAK = "WEAK_SKILL"
POLICY_ZPD = "ZPD_0775"
POLICY_NEW = "EVIDENCE_ZPD_V1"
POLICIES = frozenset({POLICY_CURRICULUM, POLICY_WEAK, POLICY_ZPD, POLICY_NEW})
VERIFIED_SOURCES = frozenset({"PRETEST", "PASSED_SUBMISSION", "GRADED_SUBMISSION"})


@dataclass(frozen=True)
class AssessmentProof:
    assessment_id: str
    user_id: str
    language: str
    goal_id: str
    graph_version: str
    verified: bool


@dataclass(frozen=True)
class SkillEvidence:
    skill_id: str
    user_id: str
    language: str
    goal_id: str
    graph_version: str
    source: str
    score: float
    confidence: float
    evidence_count: int
    satisfies_prerequisite: bool = False


@dataclass(frozen=True)
class CorrectnessSignal:
    skill_id: str
    user_id: str
    language: str
    goal_id: str
    graph_version: str
    model_version: str
    probability: float


@dataclass(frozen=True)
class LessonRecommendation:
    lesson_id: str
    target_skill_ids: Tuple[str, ...]
    reason_codes: Tuple[str, ...]
    evidence_sources: Tuple[str, ...]
    confidence: Optional[float]
    predicted_correctness: Optional[float]
    score: Optional[float]
    model_version: Optional[str]
    policy_version: str
    graph_version: str
    mapping_version: str
    effective_policy: str


@dataclass(frozen=True)
class LessonDecision:
    status: str
    fallback: Optional[str]
    recommendation: Optional[LessonRecommendation]
    eligible_lesson_ids: Tuple[str, ...]


def choose_lesson(
    *, user_id: str, state: LearnerDecisionState, versions: ContractVersions,
    assessment: AssessmentProof, candidates: Tuple[LessonCandidate, ...],
    evidence: Tuple[SkillEvidence, ...] = (),
    signals: Tuple[CorrectnessSignal, ...] = (),
    requested_policy: str = POLICY_NEW,
    serving_model_version: Optional[str] = None,
) -> LessonDecision:
    """Choose only at roadmap creation; never infer mastery from missing evidence.

    The adapter owns authentication, persisted completion/roadmap state and graph
    closure. Only a validated in-domain serving model may set serving_model_version.
    """
    if requested_policy not in POLICIES:
        raise ValueError("UNKNOWN_POLICY")
    if not user_id.strip() or not assessment.verified or (
        assessment.assessment_id != state.assessment_id
        or assessment.user_id != user_id
        or assessment.language != state.language
        or assessment.goal_id != state.goal_id
        or assessment.graph_version != versions.graph_version
    ):
        return LessonDecision("ASSESSMENT_NOT_VERIFIED", None, None, ())

    valid_evidence = {}
    for item in evidence:
        if (
            item.user_id == user_id and item.language == state.language
            and item.goal_id == state.goal_id
            and item.graph_version == versions.graph_version
            and item.skill_id in state.goal_skill_ids
            and item.source in VERIFIED_SOURCES
            and item.evidence_count > 0
            and 0 <= item.score <= 1 and 0 <= item.confidence <= 1
        ):
            prior = valid_evidence.get(item.skill_id)
            if prior is None or (item.evidence_count, item.confidence) > (prior.evidence_count, prior.confidence):
                valid_evidence[item.skill_id] = item

    # Prerequisite satisfaction must be backed by scoped verified evidence.
    proven_skills = frozenset(
        skill for skill, item in valid_evidence.items() if item.satisfies_prerequisite
    )
    checked_state = replace(state, satisfied_skill_ids=state.satisfied_skill_ids & proven_skills)
    eligible = eligible_lessons(candidates, checked_state, versions)
    candidate_ids = tuple(item.lesson_id for item in eligible)
    if not eligible:
        return LessonDecision("NO_ELIGIBLE_LESSON", None, None, candidate_ids)
    has_target_evidence = any(item.primary_skill_id in valid_evidence for item in eligible)

    scoped_signals = {}
    if serving_model_version:
        scoped_signals = {
            item.skill_id: item for item in signals
            if item.user_id == user_id and item.language == state.language
            and item.goal_id == state.goal_id and item.graph_version == versions.graph_version
            and item.model_version == serving_model_version
            and item.skill_id in state.goal_skill_ids and 0 <= item.probability <= 1
        }

    effective = requested_policy
    fallback = None
    if requested_policy in {POLICY_NEW, POLICY_ZPD} and not all(
        item.primary_skill_id in scoped_signals for item in eligible
    ):
        effective = POLICY_WEAK if has_target_evidence else POLICY_CURRICULUM
        fallback = "NO_COMPLETE_VALIDATED_IN_DOMAIN_SIGNALS"
    if effective == POLICY_WEAK and not has_target_evidence:
        effective = POLICY_CURRICULUM
        fallback = "NO_VERIFIED_SKILL_EVIDENCE"

    def rank(item: LessonCandidate) -> tuple:
        proof = valid_evidence.get(item.primary_skill_id)
        signal = scoped_signals.get(item.primary_skill_id)
        if effective == POLICY_CURRICULUM:
            return (0.0, -item.curriculum_order, item.lesson_id)
        if effective == POLICY_WEAK:
            value = (1 - proof.score) * proof.confidence if proof else -1.0
        elif effective == POLICY_ZPD:
            value = 1 - abs(signal.probability - 0.775) if signal else -1.0
        else:
            # Score is a ranking heuristic, NOT measured learning gain.
            # Unobserved skills cannot receive a fabricated weakness score.
            weakness = (1 - proof.score) * proof.confidence if proof else 0.0
            zpd = 1 - abs(signal.probability - 0.775) if signal else 0.0
            confidence = proof.confidence if proof else 0.0
            difficulty_fit = 1 - abs(item.difficulty - signal.probability) if signal and item.difficulty is not None and 0 <= item.difficulty <= 1 else 0.0
            value = .4 * weakness + .35 * zpd + .15 * confidence + .1 * difficulty_fit
        return (value, -item.curriculum_order, item.lesson_id)

    # With no evidence, select a verified diagnostic lesson before ordinary order.
    pool = eligible
    if not has_target_evidence:
        diagnostic = tuple(item for item in eligible if item.is_diagnostic)
        if diagnostic:
            pool = diagnostic
            fallback = "DIAGNOSTIC_FIRST"
    chosen = min(pool, key=lambda item: (-rank(item)[0], item.curriculum_order, item.lesson_id))
    proof = valid_evidence.get(chosen.primary_skill_id)
    signal = scoped_signals.get(chosen.primary_skill_id)
    reasons = ("VERIFIED_DIAGNOSTIC",) if chosen.is_diagnostic and not has_target_evidence else (effective,)
    recommendation = LessonRecommendation(
        lesson_id=chosen.lesson_id,
        target_skill_ids=(chosen.primary_skill_id, *sorted(chosen.secondary_skill_ids)),
        reason_codes=reasons,
        evidence_sources=(proof.source,) if proof else (),
        confidence=proof.confidence if proof else None,
        predicted_correctness=signal.probability if signal else None,
        score=rank(chosen)[0] if effective != POLICY_CURRICULUM else None,
        model_version=serving_model_version if signal else None,
        policy_version=versions.policy_version,
        graph_version=versions.graph_version,
        mapping_version=versions.mapping_version,
        effective_policy=effective,
    )
    return LessonDecision("READY", fallback, recommendation, candidate_ids)
