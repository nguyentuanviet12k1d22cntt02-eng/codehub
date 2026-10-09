import hashlib
import json
import sys
import tempfile
import unittest
from dataclasses import replace
from pathlib import Path


sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.recommendation.lesson_eligibility import (  # noqa: E402
    ContractVersions, LearnerDecisionState, LessonCandidate,
)
from app.recommendation.lesson_policy import (  # noqa: E402
    AssessmentProof, CorrectnessSignal, SkillEvidence, choose_lesson,
    POLICY_CURRICULUM, POLICY_NEW, POLICY_WEAK, POLICY_ZPD,
)
from app.recommendation.serving_registry import (  # noqa: E402
    checkpoint_metadata_matches, inspect_serving_model,
)


V = ContractVersions("palnet-lesson-policy/1.0.0", "lesson-skill-mapping/1.0.0", "2.1")


class LessonPolicyG4Tests(unittest.TestCase):
    def setUp(self):
        self.state = LearnerDecisionState(
            language="PYTHON", goal_id="G", assessment_id="A",
            goal_skill_ids=frozenset({"S1", "S2", "S0"}),
            completed_lesson_ids=frozenset({"L0"}),
            satisfied_skill_ids=frozenset({"S0"}),
        )
        self.assessment = AssessmentProof("A", "U", "PYTHON", "G", "2.1", True)
        common = dict(language="PYTHON", goal_ids=frozenset({"G"}),
                      prerequisite_lesson_ids=frozenset({"L0"}),
                      policy_version=V.policy_version, mapping_version=V.mapping_version,
                      graph_version=V.graph_version)
        self.lessons = (
            LessonCandidate("L1", primary_skill_id="S1", curriculum_order=1, **common),
            LessonCandidate("L2", primary_skill_id="S2", curriculum_order=2, **common),
        )

    def evidence(self, skill, score, **kw):
        return SkillEvidence(skill, "U", "PYTHON", "G", "2.1", "PRETEST",
                             score, .8, 2, **kw)

    def decide(self, **kw):
        assessment = kw.pop("assessment", self.assessment)
        return choose_lesson(user_id="U", state=self.state, versions=V,
                             assessment=assessment, candidates=self.lessons, **kw)

    def test_no_evidence_prefers_verified_diagnostic_and_never_invents_mastery(self):
        diagnostic = replace(self.lessons[1], is_diagnostic=True)
        result = choose_lesson(user_id="U", state=self.state, versions=V,
                               assessment=self.assessment,
                               candidates=(self.lessons[0], diagnostic))
        self.assertEqual(result.recommendation.lesson_id, "L2")
        self.assertEqual(result.fallback, "DIAGNOSTIC_FIRST")
        self.assertIsNone(result.recommendation.confidence)
        self.assertIsNone(result.recommendation.predicted_correctness)
        self.assertEqual(self.decide().recommendation.lesson_id, "L1")

    def test_only_same_user_language_goal_graph_verified_evidence_counts(self):
        wrong = replace(self.evidence("S2", 0), language="JAVASCRIPT")
        valid = self.evidence("S1", .9)
        result = self.decide(evidence=(wrong, valid), requested_policy=POLICY_WEAK)
        self.assertEqual(result.recommendation.lesson_id, "L1")
        self.assertEqual(result.recommendation.evidence_sources, ("PRETEST",))
        self.assertIsNone(result.recommendation.model_version)

    def test_prerequisite_requires_scoped_proof_not_only_caller_set(self):
        gated = replace(self.lessons[0], prerequisite_skill_ids=frozenset({"S0"}))
        result = choose_lesson(user_id="U", state=self.state, versions=V,
                               assessment=self.assessment, candidates=(gated,))
        self.assertEqual(result.status, "NO_ELIGIBLE_LESSON")
        proof = self.evidence("S0", .9, satisfies_prerequisite=True)
        result = choose_lesson(user_id="U", state=self.state, versions=V,
                               assessment=self.assessment, candidates=(gated,), evidence=(proof,))
        self.assertEqual(result.recommendation.lesson_id, "L1")

    def test_prerequisite_only_evidence_is_not_weak_target_evidence(self):
        proof = self.evidence("S0", .9, satisfies_prerequisite=True)
        result = self.decide(evidence=(proof,), requested_policy=POLICY_WEAK)
        self.assertEqual(result.recommendation.effective_policy, POLICY_CURRICULUM)
        self.assertEqual(result.fallback, "NO_VERIFIED_SKILL_EVIDENCE")
        self.assertIsNone(result.recommendation.confidence)

    def test_wrong_assessment_and_open_roadmap_do_not_select(self):
        bad = replace(self.assessment, user_id="someone-else")
        self.assertEqual(self.decide(assessment=bad).status, "ASSESSMENT_NOT_VERIFIED")
        state = replace(self.state, open_lesson_ids=frozenset({"L1"}))
        result = choose_lesson(user_id="U", state=state, versions=V,
                               assessment=self.assessment, candidates=self.lessons)
        self.assertEqual(result.status, "NO_ELIGIBLE_LESSON")

    def test_policy_comparison_and_signal_scope(self):
        signals = (CorrectnessSignal("S1", "U", "PYTHON", "G", "2.1", "m1", .2),
                   CorrectnessSignal("S2", "U", "PYTHON", "G", "2.1", "m1", .78))
        evidence = (self.evidence("S1", .1), self.evidence("S2", .8))
        self.assertEqual(self.decide(evidence=evidence, requested_policy=POLICY_CURRICULUM).recommendation.lesson_id, "L1")
        self.assertEqual(self.decide(evidence=evidence, requested_policy=POLICY_WEAK).recommendation.lesson_id, "L1")
        self.assertEqual(self.decide(evidence=evidence, signals=signals, requested_policy=POLICY_ZPD,
                                     serving_model_version="m1").recommendation.lesson_id, "L2")
        new = self.decide(evidence=evidence, signals=signals, requested_policy=POLICY_NEW,
                          serving_model_version="m1")
        self.assertEqual(new.recommendation.model_version, "m1")
        self.assertEqual(new.recommendation.effective_policy, POLICY_NEW)
        stale = tuple(replace(s, graph_version="2.0") for s in signals)
        result = self.decide(evidence=evidence, signals=stale, serving_model_version="m1")
        self.assertEqual(result.fallback, "NO_COMPLETE_VALIDATED_IN_DOMAIN_SIGNALS")
        self.assertIsNone(result.recommendation.model_version)
        other_user = tuple(replace(s, user_id="another-user") for s in signals)
        result = self.decide(evidence=evidence, signals=other_user, serving_model_version="m1")
        self.assertIsNone(result.recommendation.predicted_correctness)

    def test_wrong_language_goal_mapping_or_completion_never_returned(self):
        invalid = (
            replace(self.lessons[0], lesson_id="L3", language="CPP"),
            replace(self.lessons[0], lesson_id="L4", goal_ids=frozenset({"OTHER"})),
            replace(self.lessons[0], lesson_id="L5", mapping_status="REVIEW_REQUIRED"),
            replace(self.lessons[0], lesson_id="L0"),
            replace(self.lessons[0], lesson_id="L6", release_status="DRAFT"),
        )
        result = choose_lesson(user_id="U", state=self.state, versions=V,
                               assessment=self.assessment, candidates=invalid)
        self.assertEqual(result.status, "NO_ELIGIBLE_LESSON")


class ServingRegistryTests(unittest.TestCase):
    def test_checkpoint_internal_metadata_must_match(self):
        metadata = dict(num_skills=2, skill_ids=["S1", "S2"], language="PYTHON",
                        graph_version="2.1", mapping_version=V.mapping_version,
                        model_version="m1", model_state_dict={})
        args = dict(language="PYTHON", graph_version="2.1",
                    mapping_version=V.mapping_version, skill_ids=("S1", "S2"), model_version="m1")
        self.assertTrue(checkpoint_metadata_matches(metadata, **args))
        self.assertFalse(checkpoint_metadata_matches(metadata | {"graph_version": "2.0"}, **args))
        self.assertFalse(checkpoint_metadata_matches(metadata | {"skill_ids": ["S2", "S1"]}, **args))

    def test_missing_mismatch_and_validated_manifest(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            registry = root / "registry.json"
            checkpoint = root / "python.pt"
            checkpoint.write_bytes(b"safe-test-placeholder")
            entry = dict(language="PYTHON", trainingDomain="LEARNPYTHON",
                         evaluationStatus="VALIDATED", mappingStatus="VERIFIED", graphVersion="2.1",
                         mappingVersion=V.mapping_version, skillIds=["S1", "S2"],
                         modelVersion="m1", checkpoint="python.pt",
                         sha256=hashlib.sha256(checkpoint.read_bytes()).hexdigest())
            registry.write_text(json.dumps({"schemaVersion": "palnet-serving-registry/1.0.0",
                                            "models": {}}), encoding="utf-8")
            args = dict(language="PYTHON", graph_version="2.1",
                        mapping_version=V.mapping_version, skill_ids=("S1", "S2"))
            self.assertEqual(inspect_serving_model(registry, **args).reason, "NO_SERVING_CHECKPOINT")
            for change, expected in [({"trainingDomain": "ASSISTMENTS"}, "DOMAIN_MISMATCH"),
                                     ({"mappingStatus": "REVIEW_REQUIRED"}, "MAPPING_NOT_VERIFIED"),
                                     ({"graphVersion": "2.0"}, "VERSION_MISMATCH"),
                                     ({"skillIds": ["S2", "S1"]}, "SKILL_GRAPH_MISMATCH"),
                                     ({"sha256": "bad"}, "CHECKPOINT_CHECKSUM_MISMATCH")]:
                registry.write_text(json.dumps({"schemaVersion": "palnet-serving-registry/1.0.0",
                                                "models": {"PYTHON": entry | change}}), encoding="utf-8")
                self.assertEqual(inspect_serving_model(registry, **args).reason, expected)
            registry.write_text(json.dumps({"schemaVersion": "palnet-serving-registry/1.0.0",
                                            "models": {"PYTHON": entry}}), encoding="utf-8")
            self.assertTrue(inspect_serving_model(registry, **args).ready)


if __name__ == "__main__":
    unittest.main()
