from __future__ import annotations

import os
import unittest
from types import SimpleNamespace
from unittest.mock import patch

from fastapi import HTTPException
from fastapi.testclient import TestClient

from app.api.module_practice_pilot import ScoreRequest, load_local_pilot, score_module_practice
from app.knowledge_tracing.pilot import predict_next_pal
from app.knowledge_tracing.multilingual_pilot import load_multilingual_pilot
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

    def test_non_loopback_client_is_blocked_when_remote_access_is_disabled(self):
        with patch.dict(os.environ, {"PALNET_LOCAL_PILOT": "1", "PALNET_ALLOW_REMOTE": "0"}):
            del os.environ["PALNET_LOCAL_PILOT"]
            with self.assertRaises(HTTPException) as raised:
                score_module_practice(
                    ScoreRequest(**self.body),
                    SimpleNamespace(client=SimpleNamespace(host="192.0.2.1")),
                )
        self.assertEqual(raised.exception.status_code, 403)

    def test_unknown_skill_rejected(self):
        body = dict(self.body, candidates=[{"id": "bad", "skill_id": "PY-STRING-01", "difficulty": 1}])
        with patch.dict(os.environ, {"PALNET_LOCAL_PILOT": "1"}):
            response = self.client.post("/local-pilot/module-practice/score", json=body)
        self.assertEqual(response.status_code, 422)

    def test_javascript_and_cpp_use_their_own_activated_pilot_artifacts(self):
        cases = (
            ("JAVASCRIPT", "JS-VAR-01", "JS-TYPE-01"),
            ("CPP", "CPP-SYNTAX-01", "CPP-TYPE-01"),
        )
        for language, observed_skill, candidate_skill in cases:
            with self.subTest(language=language), patch.dict(os.environ, {"PALNET_LOCAL_PILOT": "1"}):
                response = self.client.post("/local-pilot/module-practice/score", json={
                    "language": language,
                    "history": [{"skill_id": observed_skill, "is_correct": 1}],
                    "candidates": [{"id": "next", "skill_id": candidate_skill, "difficulty": 2}],
                })
            self.assertEqual(response.status_code, 200)
            payload = response.json()
            self.assertEqual(payload["engine"], "PALNET_SYNTHETIC_MULTILINGUAL_PILOT")
            self.assertEqual(payload["language"], language)
            self.assertEqual(len(payload["scores"]), 1)
            _, skill_ids, _, _, report = load_multilingual_pilot(language)
            self.assertIn(candidate_skill, skill_ids)
            self.assertEqual(payload["dataset_sha256"], report["dataset_sha256"])


if __name__ == "__main__":
    unittest.main()
