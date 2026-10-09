from __future__ import annotations

import sys
import unittest
from pathlib import Path

import numpy as np


SERVICE_ROOT = Path(__file__).resolve().parents[1]
if str(SERVICE_ROOT) not in sys.path:
    sys.path.insert(0, str(SERVICE_ROOT))

from app.knowledge_tracing.benchmark.metrics import binary_metrics  # noqa: E402
from scripts.analyze_kt_final import METRICS, WeightedMetrics, holm_adjust  # noqa: E402


class G3AnalysisContractTest(unittest.TestCase):
    def test_learner_multiplicity_matches_expanded_events_for_all_metrics(self):
        labels = np.asarray([0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0], dtype=np.int8)
        probabilities = np.asarray([0.03, 0.95, 0.83, 0.29, 0.11, 0.73, 0.37, 0.69, 0.91, 0.43, 0.57, 0.17])
        # Three learners, four events each; a draw of users [0, 0, 2].
        weights = np.asarray([2] * 4 + [0] * 4 + [1] * 4)
        repeated = np.repeat(np.arange(len(labels)), weights)
        weighted = WeightedMetrics(labels, probabilities, 0.4).calculate(weights)
        expanded = binary_metrics(labels[repeated], probabilities[repeated], f1_threshold=0.4)
        for name in METRICS:
            self.assertAlmostEqual(weighted[name], expanded[name], places=12, msg=name)

    def test_holm_step_down_is_monotone_and_bounded(self):
        adjusted = holm_adjust({"a": 0.04, "b": 0.01, "c": 0.03})
        self.assertEqual(adjusted, {"b": 0.03, "c": 0.06, "a": 0.06})


if __name__ == "__main__":
    unittest.main()
