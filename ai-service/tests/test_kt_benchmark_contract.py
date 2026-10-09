from __future__ import annotations

import sys
import unittest
from pathlib import Path

import numpy as np


SERVICE_ROOT = Path(__file__).resolve().parents[1]
if str(SERVICE_ROOT) not in sys.path:
    sys.path.insert(0, str(SERVICE_ROOT))

from app.knowledge_tracing.benchmark.data import (  # noqa: E402
    Event,
    build_association_graph,
    build_history_features,
)
from app.knowledge_tracing.benchmark.metrics import (  # noqa: E402
    binary_metrics,
    select_f1_threshold,
)
from app.knowledge_tracing.benchmark.splits import (  # noqa: E402
    assert_split_manifest,
    create_split_manifest,
    users_for_fold,
)


def make_sequence(user_id: int, labels=(0, 1, 0), skills=(10, 20, 10)):
    return tuple(
        Event(
            event_id=f"event-{user_id}-{index}",
            user_id=user_id,
            order_id=user_id * 100 + index,
            problem_id=user_id * 1000 + index,
            skill_id=skills[index],
            correct=label,
            sequence_index=index,
            is_scored_event=int(index > 0),
        )
        for index, label in enumerate(labels)
    )


class KnowledgeTracingBenchmarkContractTest(unittest.TestCase):
    def test_user_split_is_reproducible_disjoint_and_partitions_development(self):
        sequences = {user_id: make_sequence(user_id) for user_id in range(1, 21)}
        first = create_split_manifest(
            sequences,
            dataset_sha256="a" * 64,
            seed=20261005,
            test_fraction=0.2,
            n_folds=5,
            generated_at_utc="fixed",
        )
        second = create_split_manifest(
            sequences,
            dataset_sha256="a" * 64,
            seed=20261005,
            test_fraction=0.2,
            n_folds=5,
            generated_at_utc="fixed",
        )
        self.assertEqual(first, second)
        assert_split_manifest(first)
        test_users = set(first["final_test_user_ids"])
        for fold_index in range(5):
            train_users, validation_users = users_for_fold(first, fold_index)
            self.assertFalse(train_users & validation_users)
            self.assertFalse((train_users | validation_users) & test_users)

    def test_current_label_is_not_present_in_its_history_features(self):
        original = {1: make_sequence(1, labels=(0, 1, 0))}
        changed = {1: make_sequence(1, labels=(0, 0, 0))}
        original_features = build_history_features(original, (10, 20))
        changed_features = build_history_features(changed, (10, 20))
        np.testing.assert_array_equal(original_features.summary[0], changed_features.summary[0])
        np.testing.assert_array_equal(original_features.mastery[0], changed_features.mastery[0])
        self.assertNotEqual(original_features.labels[0], changed_features.labels[0])
        self.assertFalse(np.array_equal(original_features.summary[1], changed_features.summary[1]))

    def test_association_graph_ignores_validation_users(self):
        sequences = {
            1: make_sequence(1, skills=(10, 20, 10)),
            2: make_sequence(2, skills=(10, 20, 10)),
        }
        changed_validation = {
            1: sequences[1],
            2: make_sequence(2, skills=(20, 30, 20)),
        }
        first = build_association_graph(sequences, (10, 20, 30), {1})
        second = build_association_graph(changed_validation, (10, 20, 30), {1})
        np.testing.assert_array_equal(first, second)

    def test_metric_contract_handles_ties_and_reports_all_secondary_metrics(self):
        labels = np.asarray([0, 0, 1, 1])
        probabilities = np.asarray([0.1, 0.4, 0.4, 0.9])
        metrics = binary_metrics(labels, probabilities)
        self.assertAlmostEqual(metrics["auc_roc"], 0.875)
        self.assertEqual(metrics["events"], 4)
        self.assertIn("brier", metrics)
        self.assertIn("ece_equal_count_10", metrics)

    def test_f1_threshold_selection_matches_brute_force(self):
        labels = np.asarray([0, 1, 0, 1, 1, 0])
        probabilities = np.asarray([0.1, 0.8, 0.4, 0.8, 0.55, 0.2])
        selected = select_f1_threshold(labels, probabilities)
        candidates = np.unique(np.concatenate(([0.0], probabilities)))
        scores = {
            float(threshold): binary_metrics(
                labels,
                probabilities,
                f1_threshold=float(threshold),
            )["f1"]
            for threshold in candidates
        }
        expected = min(
            threshold for threshold, score in scores.items() if score == max(scores.values())
        )
        self.assertEqual(selected, expected)


if __name__ == "__main__":
    unittest.main()
