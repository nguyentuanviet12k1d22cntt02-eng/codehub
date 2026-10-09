from __future__ import annotations

import os
import unittest
from types import SimpleNamespace
from unittest.mock import patch

from fastapi.testclient import TestClient

from app.api.module_practice_pilot import load_local_pilot
from app.knowledge_tracing.pilot import predict_next_pal
from main import app


class LocalModulePracticePilotTest(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)
        self.body = {
            "history": [{"skill_id": "PY-FLOW-01", "is_correct": 1}],
            "candidates": [
                {"id": "easy", "skill_id": "PY-FLOW-02", "difficulty": 1},
                {"id": "medium", "skill_id": "PY-FLOW-02", "difficulty": 2},
            ],
        }

    def test_local_gate_and_causal_scoring_match_training_encoder(self):
        with patch.dict(os.environ, {"PALNET_LOCAL_PILOT": "0"}):
            self.assertEqual(self.client.post("/local-pilot/module-practice/score", json=self.body).status_code, 503)
        with patch.dict(os.environ, {"PALNET_LOCAL_PILOT": "1"}):
            response = self.client.post("/local-pilot/module-practice/score", json=self.body)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["engine"], "PALNET_SYNTHETIC_LOCAL_PILOT")
        model, adjacency, prerequisites = load_local_pilot()
        history = [SimpleNamespace(skill_id="PY-FLOW-01", is_correct=1)]
        for score, difficulty in zip(response.json()["scores"], (1, 2)):
            expected = predict_next_pal(model, history, "PY-FLOW-02", difficulty, prerequisites, adjacency)
            self.assertAlmostEqual(score["predicted_correctness"], expected, places=5)

    def test_local_pilot_is_enabled_without_extra_environment_setup(self):
        with patch.dict(os.environ, {"PALNET_LOCAL_PILOT": "1"}):
            del os.environ["PALNET_LOCAL_PILOT"]
            response = self.client.post("/local-pilot/module-practice/score", json=self.body)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["engine"], "PALNET_SYNTHETIC_LOCAL_PILOT")

    def test_non_loopback_client_cannot_use_default_enabled_pilot(self):
        remote_client = TestClient(app, client=("192.0.2.1", 50000))
        with patch.dict(os.environ, {"PALNET_LOCAL_PILOT": "1"}):
            del os.environ["PALNET_LOCAL_PILOT"]
            response = remote_client.post("/local-pilot/module-practice/score", json=self.body)
        self.assertEqual(response.status_code, 403)

    def test_unknown_skill_rejected(self):
        body = dict(self.body, candidates=[{"id": "bad", "skill_id": "PY-STRING-01", "difficulty": 1}])
        with patch.dict(os.environ, {"PALNET_LOCAL_PILOT": "1"}):
            response = self.client.post("/local-pilot/module-practice/score", json=body)
        self.assertEqual(response.status_code, 422)


if __name__ == "__main__":
    unittest.main()
