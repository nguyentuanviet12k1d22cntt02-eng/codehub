"""Versioned advisory inference for the Python70 PAL-Net model (R02, trained on v4-T).

This is an explicitly authorized SYNTHETIC_EXPLORATORY integration, not a
promotion through the separately validated legacy serving registry.
"""
from __future__ import annotations
from datetime import datetime
from functools import lru_cache
import hashlib
import json
import math
import os
from pathlib import Path
import threading
import torch
from torch import nn

ROOT = Path(__file__).resolve().parents[2]
# R02: huấn luyện trên dữ liệu v4-T (2026-11-16). Bundle R01 nằm ở models/python70-advisory, giữ nguyên để hoàn nguyên.
BUNDLE = ROOT / "models" / "python70-advisory-r02"
FEATURE_VERSION = "python70-causal-feedback/1.0"
POLICY_VERSION = "palnet-correctness-order/1.0"
_slots = threading.BoundedSemaphore(2)

def digest(raw: bytes) -> str:
    return hashlib.sha256(raw).hexdigest()

class GraphLayer(nn.Module):
    def __init__(self, size: int):
        super().__init__()
        self.linear = nn.Linear(size, size)
    def forward(self, hidden, adjacency):
        return torch.relu(adjacency @ self.linear(hidden))

class Python70PAL(nn.Module):
    """State-dict-compatible implementation; architecture is frozen with R01 and reused by R02."""
    def __init__(self, skills: int):
        super().__init__()
        self.node_features = nn.Parameter(torch.zeros(skills, 16))
        self.gcn1, self.gcn2 = GraphLayer(16), GraphLayer(16)
        self.history_encoder = nn.Sequential(nn.Linear(5, 16), nn.ReLU(), nn.Linear(16, 16), nn.ReLU())
        self.predictor = nn.Sequential(nn.Linear(48, 32), nn.ReLU(), nn.Dropout(.1), nn.Linear(32, 1))
    def forward(self, target, summary, rates, adjacency):
        matrix = adjacency + torch.eye(len(adjacency), device=adjacency.device)
        degree = matrix.sum(1).clamp_min(1e-7).pow(-.5)
        normalized = degree[:, None] * matrix * degree[None, :]
        hidden = self.gcn2(self.gcn1(self.node_features, normalized), normalized)
        history = self.history_encoder(summary)
        context = (rates / rates.sum(1, keepdim=True).clamp_min(1e-7)) @ hidden
        return self.predictor(torch.cat([hidden[target], history, context], 1)).squeeze(1)

def metadata():
    raw = (BUNDLE / "manifest.json").read_bytes()
    manifest = json.loads(raw)
    if (manifest.get("schemaVersion") != "palnet-python70-advisory/1.0"
            or manifest.get("evaluationStatus") != "SYNTHETIC_EXPLORATORY"
            or manifest.get("deploymentMode") != "ADVISORY"
            or manifest.get("featureVersion") != FEATURE_VERSION
            or manifest.get("language") != "PYTHON"):
        raise ValueError("MODEL_CONTRACT_INVALID")
    # Paths are deployment-owned constants, never received from the caller.
    weights = (BUNDLE / "checkpoint.pt").read_bytes()
    graph_raw = (BUNDLE / "graph.json").read_bytes()
    if digest(weights) != manifest["checkpointSha256"] or digest(graph_raw) != manifest["graphSha256"]:
        raise ValueError("MODEL_INTEGRITY_MISMATCH")
    return manifest, digest(raw)

@lru_cache(maxsize=2)
def load(manifest_sha: str):
    manifest, actual_sha = metadata()
    if manifest_sha != actual_sha:
        raise ValueError("MODEL_CHANGED_DURING_LOAD")
    checkpoint = torch.load(BUNDLE / "checkpoint.pt", map_location="cpu", weights_only=True)
    skills = checkpoint.get("skills")
    if (checkpoint.get("model") != "palnet" or checkpoint.get("architecture") != "python70-causal-adapter/1.0"
            or skills != manifest["skillIds"]
            or checkpoint.get("seed") != manifest["trainingSeed"]
            or checkpoint.get("source_seal_sha256") != manifest["sourceSealSha256"]
            or checkpoint.get("source_dataset_run_id") != manifest["dataRunId"]):
        raise ValueError("CHECKPOINT_METADATA_MISMATCH")
    graph = json.loads((BUNDLE / "graph.json").read_text(encoding="utf8"))
    if graph["version"] != manifest["graphVersion"] or [s["id"] for s in graph["skills"]] != skills:
        raise ValueError("GRAPH_IDENTITY_MISMATCH")
    index = {s: i for i, s in enumerate(skills)}
    adjacency = torch.zeros((len(skills), len(skills)), dtype=torch.float32)
    for edge in graph["edges"]:
        a, b = index[edge["source"]], index[edge["target"]]
        adjacency[a, b] = adjacency[b, a] = 1
    model = Python70PAL(len(skills))
    model.load_state_dict(checkpoint["state_dict"], strict=True)
    model.eval()
    return model, adjacency, index

def history_features(history, cutoff: datetime, skills: dict):
    """Match R01 ordering, Laplace rates, EMA and postpass exclusion."""
    counts = [0] * len(skills)
    corrects = [0] * len(skills)
    ema = [.5] * len(skills)
    seen, solved, used = set(), set(), []
    ordered = sorted(history, key=lambda e: (e.feedback_ready_at, e.event_id))
    for e in ordered:
        if e.event_id in seen:
            raise ValueError("DUPLICATE_FEEDBACK")
        seen.add(e.event_id)
        if e.feedback_ready_at >= cutoff or e.skill_id not in skills:
            raise ValueError("FEEDBACK_SCOPE_OR_CUTOFF_INVALID")
        pair = (e.item_id, e.content_version)
        if pair in solved:
            continue
        k = skills[e.skill_id]
        counts[k] += 1
        corrects[k] += int(e.correct)
        ema[k] = .7 * ema[k] + .3 * int(e.correct)
        used.append(e)
        if e.correct:
            solved.add(pair)
    total, successes = sum(counts), sum(corrects)
    summaries = []
    for k in range(len(skills)):
        n = counts[k]
        summaries.append([math.log1p(n), corrects[k] / n if n else .5, ema[k],
                          math.log1p(total), successes / total if total else .5])
    return torch.tensor(summaries, dtype=torch.float32), torch.tensor(
        [(c+1)/(n+2) for c,n in zip(corrects,counts)], dtype=torch.float32), used

def runtime_status():
    try:
        if os.getenv("PALNET_RUNTIME_ENABLED", "true").lower() != "true":
            return {"available": False, "reason": "MODEL_DISABLED"}
        manifest, manifest_sha = metadata()
        load(manifest_sha)
        return {"available": True, "deploymentMode": "ADVISORY",
                "modelVersion": manifest["modelVersion"], "evaluationStatus": "SYNTHETIC_EXPLORATORY"}
    except (OSError, ValueError, RuntimeError, KeyError):
        return {"available": False, "reason": "PALNET_UNAVAILABLE"}

def infer(payload):
    if os.getenv("PALNET_RUNTIME_ENABLED", "true").lower() != "true":
        raise ValueError("MODEL_DISABLED")
    manifest, manifest_sha = metadata()
    if payload.graph_version != manifest["graphVersion"] or payload.graph_sha256 != manifest["graphSha256"]:
        raise ValueError("GRAPH_VERSION_MISMATCH")
    model, adjacency, skills = load(manifest_sha)
    if any(k not in skills for k in payload.target_skill_ids):
        raise ValueError("UNKNOWN_TARGET_SKILL")
    summaries, rates, used = history_features(payload.history, payload.cutoff, skills)
    common = dict(model_version=manifest["modelVersion"], checkpoint_sha256=manifest["checkpointSha256"],
                  graph_sha256=manifest["graphSha256"], feature_version=FEATURE_VERSION,
                  policy_version=POLICY_VERSION, evaluation_status="SYNTHETIC_EXPLORATORY",
                  history_count=len(used), cutoff=payload.cutoff.isoformat())
    if not used:
        return dict(status="FALLBACK", reason="NO_VERIFIED_CODE_HISTORY", probabilities={}, **common)
    if not _slots.acquire(blocking=False):
        raise ValueError("MODEL_BUSY")
    try:
        target = torch.tensor([skills[k] for k in payload.target_skill_ids], dtype=torch.long)
        with torch.inference_mode():
            prediction = torch.sigmoid(model(target, summaries[target], rates.repeat(len(target), 1), adjacency))
        return dict(status="READY", reason=None,
                    probabilities=dict(zip(payload.target_skill_ids, prediction.tolist())), **common)
    finally:
        _slots.release()

