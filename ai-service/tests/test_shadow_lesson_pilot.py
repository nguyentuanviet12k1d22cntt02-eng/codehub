"""Fast, database-free checks for the read-only real-data pilot adapter."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))

from shadow_lesson_pilot import goal_skills, mapping_rows, pretest_evidence


def test_pretest_deduplicates_question_family_and_never_credits_secondary_skill():
    rows = [
        ("q1", "family-a", "PY-BASICS-01", "CONCEPT", 1.0),
        ("q2", "family-a", "PY-BASICS-01", "CONCEPT", 0.0),
    ]
    result = pretest_evidence(rows, user_id="u", language="PYTHON",
                              goal_id="GOAL_PY_BASICS", graph_version="2.1")
    assert len(result) == 1
    assert result[0].score == 1.0
    assert result[0].evidence_count == 1
    assert round(result[0].confidence, 2) == 0.60
    assert not result[0].satisfies_prerequisite


def test_pretest_requires_application_and_confidence_for_prerequisite():
    rows = [
        ("q1", "family-a", "PY-BASICS-01", "CONCEPT", 0.0),
        ("q2", "family-b", "PY-BASICS-01", "PRACTICAL", 1.0),
    ]
    result = pretest_evidence(rows, user_id="u", language="PYTHON",
                              goal_id="GOAL_PY_BASICS", graph_version="2.1")
    assert len(result) == 1
    assert round(result[0].score, 3) == 0.667
    assert round(result[0].confidence, 2) == 0.84
    assert not result[0].satisfies_prerequisite
    rows[0] = ("q1", "family-a", "PY-BASICS-01", "CONCEPT", 0.5)
    result = pretest_evidence(rows, user_id="u", language="PYTHON",
                              goal_id="GOAL_PY_BASICS", graph_version="2.1")
    assert round(result[0].score, 3) == 0.833
    assert result[0].satisfies_prerequisite


def test_bad_score_is_excluded_and_goal_is_locked_to_graph_version():
    result = pretest_evidence([("q", None, "PY-BASICS-01", "PRACTICAL", float("nan"))],
                              user_id="u", language="PYTHON", goal_id="GOAL_PY_BASICS",
                              graph_version="2.1")
    assert result == ()
    assert "PY-BASICS-01" in goal_skills("GOAL_PY_BASICS", "2.1")
    try:
        goal_skills("GOAL_PY_BASICS", "wrong-version")
    except ValueError as error:
        assert str(error) == "GRAPH_VERSION_MISMATCH"
    else:
        raise AssertionError("mismatched graph accepted")


def test_review_mapping_cannot_be_promoted_by_pilot():
    rows = mapping_rows()
    assert rows
    assert all(row["mapping_status"] != "VERIFIED" for row in rows)
