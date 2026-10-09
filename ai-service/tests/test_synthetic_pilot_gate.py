from __future__ import annotations

import sys
import unittest
import json
import tempfile
from dataclasses import replace
from pathlib import Path

import numpy as np
import torch

SERVICE_ROOT = Path(__file__).resolve().parents[1]
if str(SERVICE_ROOT) not in sys.path:
    sys.path.insert(0, str(SERVICE_ROOT))

from app.knowledge_tracing.benchmark.models import DKTModel  # noqa: E402
from app.knowledge_tracing.benchmark.training import collate_dkt  # noqa: E402
from app.knowledge_tracing.pilot import (  # noqa: E402
    PAL_FEATURE_NAMES,
    PILOT_SKILLS,
    PilotDKTDataset,
    PilotPALNet,
    audit_pilot,
    build_pal_samples,
    load_fixed_graph,
    load_pilot,
    pal_features,
    predict_next_dkt,
    predict_next_pal,
    sha256_file,
    split_users,
)

CSV = SERVICE_ROOT / "data" / "synthetic_pilot_learners.csv"
META = SERVICE_ROOT / "data" / "synthetic_pilot_10_learners_metadata.json"
GRAPH = SERVICE_ROOT / "data" / "skill_graph.json"


class SyntheticPilotGateTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        torch.set_num_threads(1)
        cls.sequences = load_pilot(CSV)
        cls.adjacency, cls.prerequisites = load_fixed_graph(GRAPH)

    def test_full_gate_and_source_immutability(self):
        original_hash = sha256_file(CSV)
        gate = audit_pilot(CSV, META, GRAPH)
        self.assertEqual(gate["status"], "PASS")
        self.assertEqual(gate["learners"], 40)
        self.assertGreater(gate["interactions"], 1400)
        self.assertEqual(gate["dkt_evaluated_steps"], gate["interactions"] - 40)
        self.assertEqual(sha256_file(CSV), original_hash)

    def test_gate_rejects_incorrect_persona_metadata(self):
        metadata = json.loads(META.read_text(encoding="utf-8"))
        metadata["persona_breakdown"]["P-AVERAGE"] = 2
        with tempfile.TemporaryDirectory() as temporary:
            bad_metadata = Path(temporary) / "metadata.json"
            bad_metadata.write_text(json.dumps(metadata), encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "metadata does not reconcile"):
                audit_pilot(CSV, bad_metadata, GRAPH)

    def test_split_is_deterministic_disjoint_and_complete(self):
        split = split_users(self.sequences)
        self.assertEqual(split, split_users(self.sequences))
        self.assertEqual(tuple(len(split[name]) for name in ("train", "validation", "test")), (24, 8, 8))
        self.assertEqual(set(split["train"]) | set(split["validation"]) | set(split["test"]), set(self.sequences))
        self.assertFalse(set(split["train"]) & set(split["validation"]))
        self.assertFalse(set(split["train"]) & set(split["test"]))
        self.assertFalse(set(split["validation"]) & set(split["test"]))

    def test_current_outcome_attempts_time_hint_and_persona_are_not_features(self):
        events = self.sequences["syn_average_01"]
        target = events[1]
        changed = replace(target, is_correct=1 - target.is_correct,
                          attempts_count=999, time_taken_seconds=9999.0,
                          hint_used=2, persona_group="UNAVAILABLE")
        original_features = pal_features(events[:1], target)
        changed_features = pal_features(events[:1], changed)
        self.assertEqual(original_features[0], changed_features[0])
        np.testing.assert_array_equal(original_features[1], changed_features[1])
        np.testing.assert_array_equal(original_features[2], changed_features[2])
        self.assertFalse(any(field in PAL_FEATURE_NAMES for field in
                             ("persona_group", "is_correct", "attempts_count",
                              "time_taken_seconds", "hint_used")))
        prior_changed = replace(events[0], is_correct=1 - events[0].is_correct)
        self.assertFalse(np.array_equal(pal_features((prior_changed,), target)[1], original_features[1]))

    def test_dkt_shift_uses_only_prior_outcomes(self):
        events = self.sequences["syn_average_01"]
        dataset = PilotDKTDataset(self.sequences, ("syn_average_01",))
        tokens, targets, labels, event_ids, _ = dataset[0]
        self.assertEqual(len(tokens), len(events) - 1)
        self.assertEqual(int(tokens[0]), 6)  # prior skill 0, correct 1, K=6
        self.assertEqual(event_ids[0], "syn_average_01:2")
        self.assertEqual(float(labels[0]), float(events[1].is_correct))
        self.assertEqual(int(targets[0]), 0)
        changed = dict(self.sequences)
        changed["syn_average_01"] = (events[0], replace(events[1], is_correct=0), *events[2:])
        altered_tokens, _, altered_labels, _, _ = PilotDKTDataset(changed, ("syn_average_01",))[0]
        self.assertEqual(int(altered_tokens[0]), int(tokens[0]))
        self.assertNotEqual(float(altered_labels[0]), float(labels[0]))
        self.assertNotEqual(int(altered_tokens[1]), int(tokens[1]))  # only next prediction changes

    def test_padding_mask_excludes_padded_labels(self):
        dataset = PilotDKTDataset(self.sequences, ("syn_average_01", "syn_fast_01"))
        _, _, _, mask, _, _ = collate_dkt([dataset[0], dataset[1]])
        expected = len(self.sequences["syn_average_01"]) + len(self.sequences["syn_fast_01"]) - 2
        self.assertEqual(int(mask.sum()), expected)
        self.assertEqual(tuple(mask.shape), (2, 44))

    def test_training_and_offline_inference_share_exact_encoders(self):
        events = self.sequences["syn_average_01"]
        adjacency = torch.tensor(self.adjacency)
        dkt = DKTModel(len(PILOT_SKILLS), embedding_dim=16, hidden_dim=32, dropout=0.0)
        pal = PilotPALNet(len(PILOT_SKILLS))
        dkt_dataset = PilotDKTDataset(self.sequences, ("syn_average_01",))
        tokens, targets, _, _, _ = dkt_dataset[0]
        with torch.no_grad():
            dkt.eval()
            expected_dkt = float(torch.sigmoid(dkt(tokens[:1][None, :])[0, -1, targets[0]]))
        self.assertAlmostEqual(predict_next_dkt(dkt, events[:1], events[1].skill_id), expected_dkt, places=6)
        sample = next(sample for sample in build_pal_samples(self.sequences)
                      if sample.user_id == "syn_average_01" and sample.step_index == 2)
        with torch.no_grad():
            pal.eval()
            expected_pal = float(torch.sigmoid(pal(
                torch.tensor([sample.target_skill]),
                torch.tensor(sample.summary[None, :]),
                torch.tensor(sample.mastery[None, :]),
                adjacency,
            )[0]))
        self.assertAlmostEqual(
            predict_next_pal(pal, events[:1], events[1].skill_id, events[1].difficulty,
                             self.prerequisites, adjacency),
            expected_pal, places=6,
        )
        later = next(event for event in events if event.step_index >= 2
                     and event.prereq_mastery_proxy < 1.0)
        later_history = events[:later.step_index - 1]
        later_sample = next(sample for sample in build_pal_samples(self.sequences)
                            if sample.user_id == later.user_id and sample.step_index == later.step_index)
        with torch.no_grad():
            expected_later = float(torch.sigmoid(pal(
                torch.tensor([later_sample.target_skill]),
                torch.tensor(later_sample.summary[None, :]),
                torch.tensor(later_sample.mastery[None, :]),
                adjacency,
            )[0]))
        self.assertAlmostEqual(
            predict_next_pal(pal, later_history, later.skill_id, later.difficulty,
                             self.prerequisites, adjacency),
            expected_later, places=6,
        )


if __name__ == "__main__":
    unittest.main()
