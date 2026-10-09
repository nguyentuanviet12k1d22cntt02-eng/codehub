"""Read-only, fail-closed pilot against the LearnPython database.

This is an operator diagnostic, not a serving endpoint. It never writes a
roadmap or promotes the provisional lesson mapping to VERIFIED.
"""

from __future__ import annotations

import argparse
import csv
import json
import math
import os
import sys
from collections import Counter
from pathlib import Path
from uuid import UUID

import psycopg2
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "ai-service"))

from app.recommendation.lesson_eligibility import (  # noqa: E402
    ContractVersions, LearnerDecisionState, LessonCandidate, evaluate_lesson,
)
from app.recommendation.lesson_policy import (  # noqa: E402
    AssessmentProof, SkillEvidence, choose_lesson,
)

MAPPING = ROOT / "docs/research/palnet/lesson_skill_mapping.v0.1.csv"
GRAPH = ROOT / "backend/src/infrastructure/data/pythonSkillGraph.json"
POLICY_VERSION = "palnet-lesson-policy/1.0.0"
MAPPING_VERSION = "lesson-skill-mapping/1.0.0"
REVIEW_MAPPING_VERSION = "lesson-skill-mapping/0.1.0-review"


def mapping_rows() -> list[dict[str, str]]:
    with MAPPING.open(encoding="utf-8-sig", newline="") as handle:
        return list(csv.DictReader(handle))


def pretest_evidence(rows: list[tuple], *, user_id: str, language: str,
                     goal_id: str, graph_version: str) -> tuple[SkillEvidence, ...]:
    """Score distinct question families only; secondary skills earn no credit."""
    independent: dict[tuple[str, str], tuple[float, float, bool]] = {}
    weights = {"CONCEPT": 1.0, "TRACING": 1.25, "BUG_HUNTING": 1.25, "PRACTICAL": 2.0}
    for question_id, family_id, skill_id, kind, score in rows:
        if kind not in weights or not isinstance(score, (float, int)) or not math.isfinite(score) or not 0 <= score <= 1:
            continue
        key = (skill_id, family_id or str(question_id))
        independent.setdefault(key, (float(score), weights[kind], kind == "PRACTICAL"))
    grouped: dict[str, list[tuple[float, float, bool]]] = {}
    for (skill_id, _), value in independent.items():
        grouped.setdefault(skill_id, []).append(value)
    result = []
    for skill_id, items in grouped.items():
        total_weight = sum(weight for _, weight, _ in items)
        mastery = sum(score * weight for score, weight, _ in items) / total_weight
        confidence = 1 - 0.4 ** len(items)
        result.append(SkillEvidence(
            skill_id=skill_id, user_id=user_id, language=language,
            goal_id=goal_id, graph_version=graph_version, source="PRETEST",
            score=mastery, confidence=confidence, evidence_count=len(items),
            satisfies_prerequisite=(mastery >= 0.75 and confidence >= 0.70
                                    and any(application for _, _, application in items)),
        ))
    return tuple(sorted(result, key=lambda item: item.skill_id))


def goal_skills(goal_id: str, graph_version: str) -> frozenset[str]:
    graph = json.loads(GRAPH.read_text(encoding="utf-8"))
    if graph.get("version") != graph_version:
        raise ValueError("GRAPH_VERSION_MISMATCH")
    # Goal definitions are owned by the backend; this pilot mirrors the locked
    # Python goal/module sets only for a read-only audit.
    goal_modules = {
        "GOAL_PY_BASICS": {"MOD-BASICS", "MOD-FLOW"},
        "GOAL_PY_DATA": {"MOD-BASICS", "MOD-FLOW", "MOD-COLLECTIONS"},
        "GOAL_PY_FOUNDATION": {"MOD-BASICS", "MOD-FLOW", "MOD-COLLECTIONS", "MOD-FUNC", "MOD-EXC-IO"},
        "GOAL_PY_FULL": {"MOD-BASICS", "MOD-FLOW", "MOD-COLLECTIONS", "MOD-FUNC", "MOD-EXC-IO", "MOD-OOP"},
    }
    if goal_id not in goal_modules:
        raise ValueError("GOAL_NOT_SUPPORTED_BY_PILOT")
    skills = {row["id"]: row for row in graph["skills"]}
    closure = {skill_id for skill_id, row in skills.items() if row["module_id"] in goal_modules[goal_id]}
    pending = list(closure)
    while pending:
        for prior in skills[pending.pop()].get("prerequisites", []):
            if prior not in skills:
                raise ValueError("GRAPH_PREREQUISITE_MISSING")
            if prior not in closure:
                closure.add(prior)
                pending.append(prior)
    return frozenset(closure)


def connect_read_only():
    load_dotenv(ROOT / "backend/.env", override=False)
    if not os.getenv("DATABASE_URL"):
        raise RuntimeError("DATABASE_URL_NOT_CONFIGURED")
    connection = psycopg2.connect(os.environ["DATABASE_URL"], connect_timeout=3,
                                  options="-c statement_timeout=2500")
    connection.set_session(readonly=True, autocommit=False)
    return connection


def audit(connection) -> dict:
    required = ["learner_surveys", "pretest_assessments", "pretest_attempts",
                "pretest_question_snapshots", "pretest_answers", "submissions",
                "lessons", "lesson_progress", "roadmaps", "roadmap_items"]
    rows = mapping_rows()
    with connection.cursor() as cursor:
        cursor.execute("SELECT name, to_regclass('public.' || name) IS NOT NULL FROM unnest(%s::text[]) AS name", (required,))
        missing = [name for name, exists in cursor.fetchall() if not exists]
        if missing:
            return {"status": "DB_SCHEMA_NOT_READY", "missingTables": missing,
                    "mappingReviewRows": len(rows), "servingReady": False}
        cursor.execute("SELECT count(*) FROM learner_surveys WHERE is_draft = false")
        finalized_surveys = cursor.fetchone()[0]
        cursor.execute("SELECT count(*) FROM pretest_assessments")
        assessments = cursor.fetchone()[0]
        cursor.execute("SELECT count(*) FROM pretest_answers WHERE is_answered = true AND score BETWEEN 0 AND 1")
        scored_answers = cursor.fetchone()[0]
        cursor.execute("""SELECT language::text, count(*), count(DISTINCT user_id)
                          FROM submissions WHERE status = 'PASSED' GROUP BY language""")
        submission_rows = cursor.fetchall()
        passed = {language: count for language, count, _ in submission_rows}
        passed_learners = {language: count for language, _, count in submission_rows}
        cursor.execute("SELECT count(*) FROM lessons WHERE lesson_id IS NOT NULL")
        catalog_lessons = cursor.fetchone()[0]
        cursor.execute("SELECT count(*) FROM roadmaps")
        roadmaps = cursor.fetchone()[0]
        cursor.execute("SELECT lesson_id, title FROM lessons WHERE lesson_id = ANY(%s::text[])",
                       ([row["lesson_id"] for row in rows],))
        catalog_rows = cursor.fetchall()
    catalog_by_id: dict[str, list[str]] = {}
    for lesson_id, title in catalog_rows:
        catalog_by_id.setdefault(lesson_id, []).append(title)
    exact_matches = sum(catalog_by_id.get(row["lesson_id"]) == [row["lesson_title"]] for row in rows)
    return {
        "status": "AUDIT_COMPLETE", "servingReady": False,
        "finalizedSurveys": finalized_surveys,
        "pretestAssessments": assessments, "scoredPretestAnswers": scored_answers,
        "passedSubmissionsByLanguage": passed, "catalogLessonsWithStableId": catalog_lessons,
        "learnersWithPassedSubmissionsByLanguage": passed_learners,
        "roadmaps": roadmaps, "mappingReviewRows": len(rows),
        "catalogExactIdTitleMatches": exact_matches,
        "catalogMissingDuplicateOrTitleConflicts": len(rows) - exact_matches,
        "verifiedMappingRows": sum(row["mapping_status"] == "VERIFIED" for row in rows),
        "blockers": ["NO_VERIFIED_MAPPING", "NO_VERIFIED_CATALOG_LANGUAGE", "NO_IN_DOMAIN_SERVING_CHECKPOINT"],
        "note": "Passed submissions are counted, not converted to skill evidence without verified mapping.",
    }


def inspect_assessment(connection, assessment_id: str) -> dict:
    UUID(assessment_id)
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT a.user_id::text, a.language::text, a.goal_id, a.graph_version,
                   t.status::text, s.is_draft
            FROM pretest_assessments a
            JOIN pretest_attempts t ON t.id = a.attempt_id
            JOIN learner_surveys s ON s.id = t.survey_id
            WHERE a.id = %s AND a.user_id = t.user_id AND a.language = t.language
              AND a.goal_id = t.goal_id AND a.graph_version = t.graph_version
              AND s.user_id = a.user_id AND s.language = a.language AND s.goal_id = a.goal_id
        """, (assessment_id,))
        assessment = cursor.fetchone()
        if not assessment:
            return {"status": "ASSESSMENT_NOT_FOUND_OR_SCOPE_MISMATCH", "recommendation": None}
        user_id, language, goal_id, graph_version, status, is_draft = assessment
        if language != "PYTHON" or status not in {"SUBMITTED", "TIMED_OUT"} or is_draft:
            return {"status": "ASSESSMENT_NOT_FINALIZED_OR_UNSUPPORTED", "recommendation": None}
        closure = goal_skills(goal_id, graph_version)
        cursor.execute("""
            SELECT q.id::text, q.question_family_id, q.primary_skill_id,
                   q.question_type::text, ans.score
            FROM pretest_assessments a
            JOIN pretest_question_snapshots q ON q.attempt_id = a.attempt_id
            JOIN pretest_answers ans ON ans.attempt_id = a.attempt_id AND ans.question_snapshot_id = q.id
            WHERE a.id = %s AND ans.is_answered = true AND q.source = 'CURATED_VALIDATED'
            ORDER BY q.order_index
        """, (assessment_id,))
        answers = cursor.fetchall()
        cursor.execute("""
            SELECT l.id::text, l.lesson_id, l.title, c.status::text,
                   coalesce(p.is_completed, false)
            FROM lessons l
            JOIN chapters ch ON ch.id = l.chapter_id
            JOIN modules m ON m.id = ch.module_id
            JOIN courses c ON c.id = m.course_id
            LEFT JOIN lesson_progress p ON p.lesson_id = l.id AND p.user_id = %s
            WHERE l.lesson_id = ANY(%s::text[])
        """, (user_id, [row["lesson_id"] for row in mapping_rows()] ))
        catalog = cursor.fetchall()
        cursor.execute("""
            SELECT l.lesson_id FROM submissions sub
            JOIN coding_exercises ex ON ex.id = sub.exercise_id
            JOIN lessons l ON l.id = ex.lesson_id
            WHERE sub.user_id = %s AND sub.language = %s::"ProgrammingLanguage"
              AND sub.status = 'PASSED'
        """, (user_id, language))
        passed_lesson_ids = {row[0] for row in cursor.fetchall() if row[0]}
        cursor.execute("""
            SELECT ri.learning_status::text FROM roadmap_items ri
            JOIN roadmaps r ON r.id = ri.roadmap_id
            WHERE r.user_id = %s AND r.language = %s::"ProgrammingLanguage"
              AND r.goal_id = %s AND r.status = 'ACTIVE'
              AND ri.learning_status IN ('AVAILABLE', 'IN_PROGRESS')
        """, (user_id, language, goal_id))
        open_count = len(cursor.fetchall())

    evidence = tuple(item for item in pretest_evidence(
        answers, user_id=user_id, language=language, goal_id=goal_id,
        graph_version=graph_version) if item.skill_id in closure)
    by_stable_id: dict[str, list[tuple]] = {}
    for row in catalog:
        by_stable_id.setdefault(row[1], []).append(row)
    completed = frozenset(row[1] for row in catalog if row[4] and row[1])
    rows = mapping_rows()
    candidates = []
    for order, row in enumerate(rows):
        matches = by_stable_id.get(row["lesson_id"], [])
        # Course has no language field. Exact ID and title can be inspected,
        # but cannot certify the catalog's language or publication/QC state.
        catalog_match = len(matches) == 1 and matches[0][2] == row["lesson_title"]
        candidates.append(LessonCandidate(
            lesson_id=row["lesson_id"], language=row["language"],
            goal_ids=frozenset({goal_id}) if row["primary_skill_id"] in closure else frozenset(),
            primary_skill_id=row["primary_skill_id"],
            secondary_skill_ids=frozenset(filter(None, row["secondary_skill_ids"].split("|"))),
            prerequisite_lesson_ids=frozenset(filter(None, row["prerequisite_lesson_ids"].split("|"))),
            release_status="UNKNOWN", content_validation_status="UNVERIFIED",
            mapping_status=row["mapping_status"] if catalog_match else "CATALOG_MISMATCH",
            policy_version=POLICY_VERSION, mapping_version=REVIEW_MAPPING_VERSION,
            graph_version=row["graph_version"], curriculum_order=order,
        ))
    versions = ContractVersions(POLICY_VERSION, MAPPING_VERSION, graph_version)
    state = LearnerDecisionState(
        language=language, goal_id=goal_id, assessment_id=assessment_id,
        goal_skill_ids=closure, completed_lesson_ids=completed,
        satisfied_skill_ids=frozenset(item.skill_id for item in evidence if item.satisfies_prerequisite),
        open_lesson_ids=frozenset(f"open-{index}" for index in range(open_count)),
    )
    exclusions = Counter(reason for candidate in candidates
                         for reason in evaluate_lesson(candidate, state, versions).exclusion_reasons)
    if open_count > 1:
        return {"status": "ROADMAP_HAS_MULTIPLE_OPEN_ITEMS", "recommendation": None,
                "openRoadmapItems": open_count}
    decision = choose_lesson(
        user_id=user_id, state=state, versions=versions,
        assessment=AssessmentProof(assessment_id, user_id, language, goal_id, graph_version, True),
        candidates=tuple(candidates), evidence=evidence,
    )
    return {
        "status": decision.status, "mode": "SHADOW_READ_ONLY",
        "recommendation": None if decision.recommendation is None else decision.recommendation.lesson_id,
        "eligibleLessonIds": list(decision.eligible_lesson_ids),
        "language": language, "goalId": goal_id, "graphVersion": graph_version,
        "verifiedPretestSkills": len(evidence), "scoredPretestAnswers": len(answers),
        "passedSubmissionLessonCountUnmapped": len(passed_lesson_ids),
        "catalogRowsMatchedByIdAndTitle": sum(len(by_stable_id.get(row["lesson_id"], [])) == 1
                                           and by_stable_id[row["lesson_id"]][0][2] == row["lesson_title"] for row in rows),
        "openRoadmapItems": open_count, "candidateExclusionCounts": dict(exclusions),
        "servingReady": False,
        "note": "No roadmap mutation; provisional mapping and unverified catalog are never promoted.",
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--audit", action="store_true", help="Aggregate real DB readiness counts, no personal IDs")
    mode.add_argument("--assessment-id", help="Inspect one finalized assessment, without writing a roadmap")
    args = parser.parse_args()
    try:
        with connect_read_only() as connection:
            result = audit(connection) if args.audit else inspect_assessment(connection, args.assessment_id)
        print(json.dumps(result, ensure_ascii=False, sort_keys=True))
        return 0 if result["status"] in {"AUDIT_COMPLETE", "NO_ELIGIBLE_LESSON"} else 2
    except (psycopg2.Error, RuntimeError, ValueError) as exc:
        # Never print database URLs, SQL parameters or exception text.
        print(json.dumps({"status": "PILOT_UNAVAILABLE", "errorType": type(exc).__name__,
                          "servingReady": False}))
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
