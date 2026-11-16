"""Bundle R02 của PAL-Net lộ trình Python: toàn vẹn, đúng nguồn dữ liệu v4-T, suy luận được qua runtime."""
import hashlib
import json
import os
import types
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path
from unittest.mock import patch

import torch

from app.recommendation import python70_runtime as rt

ROOT = Path(__file__).resolve().parents[1]
MODEL_VERSION = "python70-r02-s20261102-advisory-v1"
CHECKPOINT_SHA256 = "db460b5c17a155e0bdd68d8c6a7c19eb23707c6d68957dad6ddcee03540af20a"


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


class Python70R02BundleTest(unittest.TestCase):
    def test_runtime_points_to_r02_and_keeps_r01_for_rollback(self):
        self.assertEqual(rt.BUNDLE, ROOT / "models" / "python70-advisory-r02")
        old = json.loads((ROOT / "models/python70-advisory/manifest.json").read_text(encoding="utf-8"))
        self.assertEqual(old["modelVersion"], "python70-r01-s20261102-advisory-v1")
        self.assertEqual(sha(ROOT / "models/python70-advisory/checkpoint.pt"), old["checkpointSha256"])

    def test_manifest_pins_checkpoint_graph_and_v4_data(self):
        manifest, _ = rt.metadata()
        self.assertEqual(manifest["modelVersion"], MODEL_VERSION)
        self.assertEqual(manifest["checkpointSha256"], CHECKPOINT_SHA256)
        self.assertEqual(sha(rt.BUNDLE / "checkpoint.pt"), CHECKPOINT_SHA256)
        self.assertEqual(manifest["dataRunId"], "syn-py70-v4-20261106-0128e5469e-T")
        self.assertEqual(manifest["evaluationStatus"], "SYNTHETIC_EXPLORATORY")
        self.assertEqual(manifest["deploymentMode"], "ADVISORY")
        # Cùng đồ thị 2.1 với R01, nên backend không cần đổi graph.
        self.assertEqual(sha(rt.BUNDLE / "graph.json"), sha(ROOT / "models/python70-advisory/graph.json"))

    def test_checkpoint_loads_strictly_with_35_skills(self):
        manifest, manifest_sha = rt.metadata()
        model, adjacency, skills = rt.load(manifest_sha)
        self.assertEqual(list(skills), manifest["skillIds"])
        self.assertEqual(len(skills), 35)
        self.assertEqual(tuple(adjacency.shape), (35, 35))
        self.assertFalse(model.training)

    def test_inference_returns_probabilities_and_cold_start_fallback(self):
        manifest, _ = rt.metadata()
        cutoff = datetime(2026, 11, 16, tzinfo=timezone.utc)
        event = lambda i, skill, ok: types.SimpleNamespace(
            event_id=f"e{i}", item_id=f"item{i}", content_version="v", skill_id=skill, correct=ok,
            feedback_ready_at=cutoff - timedelta(minutes=10 - i))
        targets = ["PY-BASICS-03", "PY-FLOW-03", "PY-OOP-01"]
        payload = lambda history: types.SimpleNamespace(
            graph_version=manifest["graphVersion"], graph_sha256=manifest["graphSha256"],
            target_skill_ids=targets, history=history, cutoff=cutoff)
        with patch.dict(os.environ, {"PALNET_RUNTIME_ENABLED": "true"}):
            strong = rt.infer(payload([event(i, "PY-BASICS-03", True) for i in range(5)]))
            weak = rt.infer(payload([event(i, "PY-BASICS-03", False) for i in range(5)]))
            cold = rt.infer(payload([]))
        self.assertEqual(strong["status"], "READY")
        self.assertEqual(strong["model_version"], MODEL_VERSION)
        self.assertEqual(strong["checkpoint_sha256"], CHECKPOINT_SHA256)
        self.assertEqual(set(strong["probabilities"]), set(targets))
        for value in list(strong["probabilities"].values()) + list(weak["probabilities"].values()):
            self.assertTrue(0.0 <= value <= 1.0)
        # Lịch sử toàn đúng phải cho xác suất cao hơn lịch sử toàn sai ở mọi kỹ năng đích.
        for skill in targets:
            self.assertGreater(strong["probabilities"][skill], weak["probabilities"][skill])
        self.assertEqual(cold["status"], "FALLBACK")
        self.assertEqual(cold["reason"], "NO_VERIFIED_CODE_HISTORY")

    def test_disabled_flag_still_selects_rules(self):
        with patch.dict(os.environ, {"PALNET_RUNTIME_ENABLED": "false"}):
            self.assertEqual(rt.runtime_status(), {"available": False, "reason": "MODEL_DISABLED"})


if __name__ == "__main__":
    unittest.main()
