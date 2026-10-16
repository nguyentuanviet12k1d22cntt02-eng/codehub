"""Loopback-only PAL-Net pilot scores for local module-practice experiments."""

from __future__ import annotations

import hashlib
import json
import math
import os
import re
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

import numpy as np
import torch
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field

from app.knowledge_tracing.pilot import (
    PAL_FEATURE_NAMES, PILOT_SKILLS, PilotPALNet, PlannedTarget,
    causal_proxy, load_fixed_graph, pal_features, sha256_file,
)
from app.knowledge_tracing.multilingual_pilot import (
    PlannedTarget as MultiLanguagePlannedTarget,
    causal_proxy as multilingual_causal_proxy,
    load_multilingual_pilot,
    normalize_language as normalize_multilingual_language,
    pal_features as multilingual_pal_features,
)


router = APIRouter(prefix="/local-pilot/module-practice", tags=["local-pilot"])
SERVICE_ROOT = Path(__file__).resolve().parents[2]
PILOT_RUNS_ROOT = SERVICE_ROOT / "outputs" / "synthetic_pilot"
ACTIVE_RUN_PATH = PILOT_RUNS_ROOT / "active.json"


def _matches_expected_hash(path: Path, expected: str) -> bool:
    if not path.exists():
        return False
    raw = path.read_bytes()
    candidates = {
        hashlib.sha256(raw).hexdigest(),
        hashlib.sha256(raw.replace(b"\r\n", b"\n")).hexdigest(),
        hashlib.sha256(raw.replace(b"\r\n", b"\n").replace(b"\n", b"\r\n")).hexdigest(),
    }
    return expected in candidates


@dataclass(frozen=True)
class ObservedOutcome:
    skill_id: str
    is_correct: int


class HistoryEvent(BaseModel):
    skill_id: str
    is_correct: int = Field(ge=0, le=1)


class Candidate(BaseModel):
    id: str = Field(min_length=1)
    skill_id: str
    difficulty: int = Field(ge=1, le=3)


class ScoreRequest(BaseModel):
    language: str = "PYTHON"
    history: list[HistoryEvent]
    candidates: list[Candidate]


def load_active_run() -> tuple[Path, dict]:
    """Resolve the explicitly activated, reproducible synthetic-pilot run."""
    manifest = json.loads(ACTIVE_RUN_PATH.read_text(encoding="utf-8"))
    run_id = manifest.get("run_id")
    if not isinstance(run_id, str) or not re.fullmatch(r"\d{8}T\d{6}Z_[0-9a-f]{8}", run_id):
        raise ValueError("Active pilot manifest has an invalid run ID")
    run_root = (PILOT_RUNS_ROOT / run_id).resolve()
    if run_root.parent != PILOT_RUNS_ROOT.resolve():
        raise ValueError("Active pilot run must remain inside the pilot output directory")
    return run_root, manifest


@lru_cache(maxsize=1)
def load_local_pilot():
    """Pin the local demo to its audited data, graph, features, and weights."""
    run_root, manifest = load_active_run()
    report = json.loads((run_root / "report.json").read_text(encoding="utf-8"))
    checkpoint = torch.load(run_root / "palnet_pilot.pt", map_location="cpu", weights_only=True)
    if (manifest.get("dataset_sha256") != report.get("dataset_sha256")
            or manifest.get("graph_sha256") != report.get("graph_sha256")
            or not checkpoint.get("pilot_only")
            or checkpoint.get("dataset_sha256") != report.get("dataset_sha256")
            or checkpoint.get("skill_ids") != PILOT_SKILLS
            or checkpoint.get("feature_names") != PAL_FEATURE_NAMES
            or not _matches_expected_hash(SERVICE_ROOT / "data" / "synthetic_pilot_learners.csv", str(report.get("dataset_sha256")))
            or not _matches_expected_hash(SERVICE_ROOT / "data" / "skill_graph.json", str(report.get("graph_sha256")))):
        raise ValueError("Pilot artifact, dataset, or curriculum graph mismatch")
    adjacency, prerequisites = load_fixed_graph(SERVICE_ROOT / "data" / "skill_graph.json")
    model = PilotPALNet(len(PILOT_SKILLS))
    model.load_state_dict(checkpoint["model_state_dict"], strict=True)
    model.eval()
    return model, torch.from_numpy(adjacency), prerequisites


@router.post("/score")
def score_module_practice(body: ScoreRequest, request: Request):
    # The local UI should work with the ordinary `uvicorn main:app --reload --port 8000`
    # command. Keep an explicit opt-out and the loopback-only request check below.
    if os.environ.get("PALNET_LOCAL_PILOT", "1") != "1":
        raise HTTPException(status_code=503, detail="LOCAL_PILOT_DISABLED")
    if os.environ.get("PALNET_ALLOW_REMOTE", "1") != "1":
        if not request.client or request.client.host not in {"127.0.0.1", "::1", "testclient"}:
            raise HTTPException(status_code=403, detail="LOCAL_PILOT_LOOPBACK_ONLY")
    if not body.candidates or len(body.candidates) > 100 or len(body.history) > 500:
        raise HTTPException(status_code=422, detail="PILOT_REQUEST_SIZE_INVALID")
    language = str(body.language or "PYTHON").upper()
    if language == "JS":
        language = "JAVASCRIPT"
    if language not in {"PYTHON", "JAVASCRIPT", "CPP"}:
        raise HTTPException(status_code=422, detail="PILOT_LANGUAGE_INVALID")
    if len({candidate.id for candidate in body.candidates}) != len(body.candidates):
        raise HTTPException(status_code=422, detail="PILOT_SKILL_OR_CANDIDATE_INVALID")
    if language == "PYTHON":
        return _score_python_pilot(body)
    return _score_multilingual_pilot(body, language)


def _score_python_pilot(body: ScoreRequest):
    if (any(event.skill_id not in PILOT_SKILLS for event in body.history)
            or any(candidate.skill_id not in PILOT_SKILLS for candidate in body.candidates)):
        raise HTTPException(status_code=422, detail="PILOT_SKILL_OR_CANDIDATE_INVALID")
    try:
        model, adjacency, prerequisites = load_local_pilot()
    except (OSError, ValueError, RuntimeError, KeyError) as exc:
        raise HTTPException(status_code=503, detail="PILOT_CHECKPOINT_UNAVAILABLE") from exc

    history = tuple(ObservedOutcome(item.skill_id, item.is_correct) for item in body.history)
    targets = []
    summaries = []
    masteries = []
    for candidate in body.candidates:
        proxy = round(causal_proxy(history, prerequisites[candidate.skill_id]), 4)
        target = PlannedTarget(candidate.skill_id, candidate.difficulty, proxy)
        skill, summary, mastery = pal_features(history, target)
        targets.append(skill)
        summaries.append(summary)
        masteries.append(mastery)
    with torch.no_grad():
        logits = model(
            torch.tensor(targets, dtype=torch.long),
            torch.from_numpy(np.stack(summaries)),
            torch.from_numpy(np.stack(masteries)),
            adjacency,
        )
        probabilities = torch.sigmoid(logits).tolist()
    if not all(math.isfinite(probability) for probability in probabilities):
        raise HTTPException(status_code=503, detail="PILOT_SCORE_INVALID")
    return {
        "engine": "PALNET_SYNTHETIC_LOCAL_PILOT",
        "language": "PYTHON",
        "dataset_sha256": checkpoint_hash(),
        "scores": [
            {"id": candidate.id, "predicted_correctness": round(float(probability), 6)}
            for candidate, probability in zip(body.candidates, probabilities)
        ],
    }


def _score_multilingual_pilot(body: ScoreRequest, language: str):
    """Score only against the activated synthetic artifact for this language."""
    try:
        normalized_language = normalize_multilingual_language(language)
        model, skill_ids, adjacency, prerequisites, report = load_multilingual_pilot(normalized_language)
    except (OSError, ValueError, RuntimeError, KeyError) as exc:
        raise HTTPException(status_code=503, detail="PILOT_CHECKPOINT_UNAVAILABLE") from exc
    known_skills = set(skill_ids)
    if (any(event.skill_id not in known_skills for event in body.history)
            or any(candidate.skill_id not in known_skills for candidate in body.candidates)):
        raise HTTPException(status_code=422, detail="PILOT_SKILL_OR_CANDIDATE_INVALID")
    history = tuple(ObservedOutcome(item.skill_id, item.is_correct) for item in body.history)
    targets = []
    summaries = []
    masteries = []
    for candidate in body.candidates:
        proxy = round(multilingual_causal_proxy(history, prerequisites[candidate.skill_id]), 4)
        target = MultiLanguagePlannedTarget(candidate.skill_id, candidate.difficulty, proxy)
        skill, summary, mastery = multilingual_pal_features(history, target, skill_ids)
        targets.append(skill)
        summaries.append(summary)
        masteries.append(mastery)
    with torch.no_grad():
        logits = model(
            torch.tensor(targets, dtype=torch.long),
            torch.from_numpy(np.stack(summaries)),
            torch.from_numpy(np.stack(masteries)),
            adjacency,
        )
        probabilities = torch.sigmoid(logits).tolist()
    if not all(math.isfinite(probability) for probability in probabilities):
        raise HTTPException(status_code=503, detail="PILOT_SCORE_INVALID")
    return {
        "engine": "PALNET_SYNTHETIC_MULTILINGUAL_PILOT",
        "language": normalized_language,
        "dataset_sha256": str(report["dataset_sha256"]),
        "graph_sha256": str(report["graph_sha256"]),
        "scores": [
            {"id": candidate.id, "predicted_correctness": round(float(probability), 6)}
            for candidate, probability in zip(body.candidates, probabilities)
        ],
    }


def checkpoint_hash() -> str:
    _, manifest = load_active_run()
    return str(manifest["dataset_sha256"])
