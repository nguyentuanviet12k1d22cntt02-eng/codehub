import sys
import unittest
from dataclasses import replace
from pathlib import Path


sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.recommendation.lesson_eligibility import (  # noqa: E402
    ContractVersions,
    EligibilityContractViolation,
    LearnerDecisionState,
    LessonCandidate,
    eligible_lessons,
    evaluate_lesson,
)


VERSIONS = ContractVersions(
    policy_version="palnet-lesson-policy/1.0.0",
    mapping_version="lesson-skill-mapping/1.0.0",
    graph_version="2.1",
)


class LessonEligibilityContractTests(unittest.TestCase):
    def setUp(self):
        self.state = LearnerDecisionState(
            language="PYTHON",
            goal_id="GOAL_PY_BASICS",
            assessment_id="assessment-1",
            goal_skill_ids=frozenset({"PY-BASICS-01", "PY-FLOW-01"}),
            completed_lesson_ids=frozenset({"LS-01.01"}),
            satisfied_skill_ids=frozenset({"PY-BASICS-01"}),
        )
        self.valid = LessonCandidate(
            lesson_id="LS-02.02",
            language="PYTHON",
            goal_ids=frozenset({"GOAL_PY_BASICS"}),
            primary_skill_id="PY-FLOW-01",
            prerequisite_lesson_ids=frozenset({"LS-01.01"}),
            prerequisite_skill_ids=frozenset({"PY-BASICS-01"}),
            policy_version=VERSIONS.policy_version,
            mapping_version=VERSIONS.mapping_version,
            graph_version=VERSIONS.graph_version,
            curriculum_order=2,
        )

    def test_candidate_set_excludes_wrong_language_unmet_prerequisite_and_completed(self):
        candidates = [
            self.valid,
            replace(self.valid, lesson_id="JS-01.01", language="JAVASCRIPT"),
            replace(
                self.valid,
                lesson_id="LS-02.03",
                prerequisite_skill_ids=frozenset({"PY-FLOW-01"}),
            ),
            replace(self.valid, lesson_id="LS-01.01"),
        ]

        result = eligible_lessons(candidates, self.state, VERSIONS)

        self.assertEqual([lesson.lesson_id for lesson in result], ["LS-02.02"])
        self.assertTrue(all(lesson.language == self.state.language for lesson in result))
        self.assertTrue(
            all(
                lesson.prerequisite_skill_ids.issubset(self.state.satisfied_skill_ids)
                for lesson in result
            )
        )
        self.assertTrue(
            all(lesson.lesson_id not in self.state.completed_lesson_ids for lesson in result)
        )

    def test_unverified_mapping_and_version_mismatch_fail_closed(self):
        unverified = replace(self.valid, mapping_status="REVIEW_REQUIRED")
        stale = replace(self.valid, lesson_id="LS-02.03", graph_version="2.0")

        self.assertEqual(eligible_lessons([unverified, stale], self.state, VERSIONS), ())
        self.assertIn(
            "MAPPING_NOT_VERIFIED",
            evaluate_lesson(unverified, self.state, VERSIONS).exclusion_reasons,
        )
        self.assertIn(
            "GRAPH_VERSION_MISMATCH",
            evaluate_lesson(stale, self.state, VERSIONS).exclusion_reasons,
        )

    def test_existing_open_item_blocks_reselection(self):
        state = replace(self.state, open_lesson_ids=frozenset({"LS-02.02"}))
        self.assertEqual(eligible_lessons([self.valid], state, VERSIONS), ())

    def test_multiple_open_items_are_a_contract_violation(self):
        state = replace(
            self.state,
            open_lesson_ids=frozenset({"LS-02.02", "LS-02.03"}),
        )
        with self.assertRaisesRegex(
            EligibilityContractViolation, "ROADMAP_HAS_MULTIPLE_OPEN_ITEMS"
        ):
            eligible_lessons([self.valid], state, VERSIONS)


if __name__ == "__main__":
    unittest.main()

