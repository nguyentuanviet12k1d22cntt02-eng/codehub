"""Loopback-only PAL-Net pilot scores for local module-practice experiments."""

from __future__ import annotations

import json
import math
import os
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


router = APIRouter(prefix="/local-pilot/module-practice", tags=["local-pilot"])
SERVICE_ROOT = Path(__file__).resolve().parents[2]
RUN_ROOT = SERVICE_ROOT / "outputs" / "synthetic_pilot" / "20261008T065624Z_40969384"


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
    history: list[HistoryEvent]
    candidates: list[Candidate]


@lru_cache(maxsize=1)
def load_local_pilot():
    """Pin the local demo to its audited data, graph, features, and weights."""
    report = json.loads((RUN_ROOT / "report.json").read_text(encoding="utf-8"))
    checkpoint = torch.load(RUN_ROOT / "palnet_pilot.pt", map_location="cpu", weights_only=True)
    if (not checkpoint.get("pilot_only")
            or checkpoint.get("dataset_sha256") != report.get("dataset_sha256")
            or checkpoint.get("skill_ids") != PILOT_SKILLS
            or checkpoint.get("feature_names") != PAL_FEATURE_NAMES
            or sha256_file(SERVICE_ROOT / "data" / "synthetic_pilot_learners.csv") != report.get("dataset_sha256")
            or sha256_file(SERVICE_ROOT / "data" / "skill_graph.json") != report.get("graph_sha256")):
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
    if not request.client or request.client.host not in {"127.0.0.1", "::1", "testclient"}:
        raise HTTPException(status_code=403, detail="LOCAL_PILOT_LOOPBACK_ONLY")
    if not body.candidates or len(body.candidates) > 100 or len(body.history) > 500:
        raise HTTPException(status_code=422, detail="PILOT_REQUEST_SIZE_INVALID")
    if (any(event.skill_id not in PILOT_SKILLS for event in body.history)
            or any(candidate.skill_id not in PILOT_SKILLS for candidate in body.candidates)
            or len({candidate.id for candidate in body.candidates}) != len(body.candidates)):
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
        "dataset_sha256": checkpoint_hash(),
        "scores": [
            {"id": candidate.id, "predicted_correctness": round(float(probability), 6)}
            for candidate, probability in zip(body.candidates, probabilities)
        ],
    }


def checkpoint_hash() -> str:
    return json.loads((RUN_ROOT / "report.json").read_text(encoding="utf-8"))["dataset_sha256"]
