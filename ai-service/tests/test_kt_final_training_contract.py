from __future__ import annotations

import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import numpy as np


SERVICE_ROOT = Path(__file__).resolve().parents[1]
if str(SERVICE_ROOT) not in sys.path:
    sys.path.insert(0, str(SERVICE_ROOT))

from app.knowledge_tracing.benchmark.data import Event, build_history_features  # noqa: E402
from app.knowledge_tracing.benchmark.training import train_dkt, train_palnet  # noqa: E402


def sequence(user_id: int) -> tuple[Event, ...]:
    return tuple(
        Event(
            event_id=f"event-{user_id}-{index}",
            user_id=user_id,
            order_id=user_id * 10 + index,
            problem_id=user_id * 100 + index,
            skill_id=(10, 20, 10)[index],
            correct=(0, 1, 1)[index],
            sequence_index=index,
            is_scored_event=int(index > 0),
        )
        for index in range(3)
    )


class FinalTrainingContractTest(unittest.TestCase):
    def test_fixed_epoch_dkt_does_not_select_on_final_labels(self):
        sequences = {1: sequence(1), 2: sequence(2)}
        evaluation = {
            "event_ids": ("event-2-1", "event-2-2"),
            "user_ids": np.asarray([2, 2]),
            "labels": np.asarray([1, 1], dtype=np.float32),
            "probabilities": np.asarray([0.5, 0.5]),
            "metrics": {"log_loss": 1.0},
            "inference_seconds": 0.0,
        }
        config = {
            "device": "cpu",
            "batch_size": 1,
            "embedding_dim": 2,
            "hidden_dim": 2,
            "dropout": 0.0,
            "learning_rate": 0.001,
            "weight_decay": 0.0,
            "max_epochs": 9,
            "early_stopping_patience": 1,
        }
        with tempfile.TemporaryDirectory() as directory, patch(
            "app.knowledge_tracing.benchmark.training.evaluate_dkt",
            return_value=evaluation,
        ) as evaluate:
            result = train_dkt(
                sequences,
                {1},
                {2},
                (10, 20),
                config,
                Path(directory),
                7,
                fixed_epochs=2,
            )
        self.assertEqual(evaluate.call_count, 1)
        self.assertEqual(len(result["train_log"]), 2)
        self.assertNotIn("validation_log_loss", result["train_log"][0])

    def test_fixed_epoch_palnet_does_not_select_on_final_labels(self):
        sequences = {1: sequence(1), 2: sequence(2)}
        features = build_history_features(sequences, (10, 20), {1, 2})
        evaluation = {
            "probabilities": np.asarray([0.5, 0.5]),
            "metrics": {"log_loss": 1.0},
            "inference_seconds": 0.0,
        }
        config = {
            "device": "cpu",
            "batch_size": 2,
            "skill_dim": 2,
            "history_dim": 2,
            "hidden_dim": 2,
            "dropout": 0.0,
            "learning_rate": 0.001,
            "weight_decay": 0.0,
            "max_epochs": 9,
            "early_stopping_patience": 1,
        }
        with tempfile.TemporaryDirectory() as directory, patch(
            "app.knowledge_tracing.benchmark.training.evaluate_palnet",
            return_value=evaluation,
        ) as evaluate:
            result = train_palnet(
                features,
                {1},
                {2},
                np.eye(2, dtype=np.float32),
                config,
                Path(directory),
                7,
                model_name="palnet",
                use_graph=True,
                use_history=True,
                fixed_epochs=2,
            )
        self.assertEqual(evaluate.call_count, 1)
        self.assertEqual(len(result["train_log"]), 2)
        self.assertNotIn("validation_log_loss", result["train_log"][0])


if __name__ == "__main__":
    unittest.main()
