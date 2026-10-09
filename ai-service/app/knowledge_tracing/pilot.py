"""Causal, offline-only feature contract for the ten-learner synthetic pilot.

This module does not promote checkpoints to the production serving registry.
"""

from __future__ import annotations

import csv
import hashlib
import json
import math
import random
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Mapping, Sequence

import numpy as np
import torch
from torch import nn
from torch.utils.data import Dataset

from app.knowledge_tracing.benchmark.models import GraphLayer


PILOT_SKILLS = (
    "PY-BASICS-01", "PY-BASICS-02", "PY-BASICS-03",
    "PY-FLOW-01", "PY-FLOW-02", "PY-FLOW-03",
)
PILOT_COLUMNS = (
    "user_id", "persona_group", "step_index", "timestamp", "skill_id",
    "item_id", "difficulty", "is_correct", "attempts_count",
    "time_taken_seconds", "hint_used", "prereq_mastery_proxy",
)
PAL_FEATURE_NAMES = (
    "log_prior_target_exposures", "prior_target_accuracy",
    "log_prior_total_exposures", "prior_global_accuracy",
    "target_difficulty_over_3", "causal_prereq_mastery_proxy",
)
FORBIDDEN_CURRENT_FIELDS = (
    "persona_group", "is_correct", "attempts_count",
    "time_taken_seconds", "hint_used",
)
EXPECTED_PREREQS = {
    "PY-BASICS-01": (),
    "PY-BASICS-02": ("PY-BASICS-01",),
    "PY-BASICS-03": ("PY-BASICS-01",),
    "PY-FLOW-01": ("PY-BASICS-03",),
    "PY-FLOW-02": ("PY-FLOW-01",),
    "PY-FLOW-03": ("PY-FLOW-01",),
}
SKILL_TO_INDEX = {skill: index for index, skill in enumerate(PILOT_SKILLS)}


@dataclass(frozen=True)
class PilotEvent:
    user_id: str
    persona_group: str
    step_index: int
    timestamp: datetime
    skill_id: str
    item_id: str
    difficulty: int
    is_correct: int
    attempts_count: int
    time_taken_seconds: float
    hint_used: int
    prereq_mastery_proxy: float


@dataclass(frozen=True)
class PlannedTarget:
    """Only fields available before the learner attempts the next item."""

    skill_id: str
    difficulty: int
    prereq_mastery_proxy: float


@dataclass(frozen=True)
class PALSample:
    user_id: str
    step_index: int
    target_skill: int
    summary: np.ndarray
    mastery: np.ndarray
    label: int


def sha256_file(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def load_pilot(path: Path) -> dict[str, tuple[PilotEvent, ...]]:
    grouped: dict[str, list[PilotEvent]] = {}
    with path.open("r", encoding="utf-8-sig", newline="") as source:
        reader = csv.DictReader(source)
        if tuple(reader.fieldnames or ()) != PILOT_COLUMNS:
            raise ValueError("Pilot CSV schema or column order has changed")
        for row in reader:
            event = PilotEvent(
                user_id=row["user_id"],
                persona_group=row["persona_group"],
                step_index=int(row["step_index"]),
                timestamp=datetime.fromisoformat(row["timestamp"]),
                skill_id=row["skill_id"],
                item_id=row["item_id"],
                difficulty=int(row["difficulty"]),
                is_correct=int(row["is_correct"]),
                attempts_count=int(row["attempts_count"]),
                time_taken_seconds=float(row["time_taken_seconds"]),
                hint_used=int(row["hint_used"]),
                prereq_mastery_proxy=float(row["prereq_mastery_proxy"]),
            )
            if not event.user_id or not event.item_id or event.skill_id not in SKILL_TO_INDEX:
                raise ValueError(f"Invalid learner/item/skill at CSV step {event.step_index}")
            if event.difficulty not in (1, 2, 3) or event.is_correct not in (0, 1):
                raise ValueError(f"Invalid difficulty/outcome at {event.user_id}:{event.step_index}")
            if (event.attempts_count < 1 or event.time_taken_seconds <= 0
                    or not math.isfinite(event.time_taken_seconds)
                    or event.hint_used not in (0, 1, 2)
                    or not 0 <= event.prereq_mastery_proxy <= 1):
                raise ValueError(f"Invalid pilot value at {event.user_id}:{event.step_index}")
            grouped.setdefault(event.user_id, []).append(event)
    if not grouped:
        raise ValueError("Pilot CSV is empty")
    result: dict[str, tuple[PilotEvent, ...]] = {}
    for user_id, events in grouped.items():
        ordered = sorted(events, key=lambda event: event.step_index)
        if [event.step_index for event in ordered] != list(range(1, len(ordered) + 1)):
            raise ValueError(f"Non-contiguous/duplicate steps for {user_id}")
        if len({event.persona_group for event in ordered}) != 1:
            raise ValueError(f"Persona changes within {user_id}")
        if any(left.timestamp >= right.timestamp for left, right in zip(ordered, ordered[1:])):
            raise ValueError(f"Timestamps are not strictly increasing for {user_id}")
        result[user_id] = tuple(ordered)
    return result


def load_fixed_graph(path: Path) -> tuple[np.ndarray, dict[str, tuple[str, ...]]]:
    graph = json.loads(path.read_text(encoding="utf-8"))
    known = {skill["id"] for skill in graph["skills"]}
    if not set(PILOT_SKILLS) <= known:
        raise ValueError("Pilot skill absent from fixed curriculum graph")
    prereqs: dict[str, list[str]] = {skill: [] for skill in PILOT_SKILLS}
    adjacency = np.zeros((len(PILOT_SKILLS), len(PILOT_SKILLS)), dtype=np.float32)
    for edge in graph["edges"]:
        source, target = edge["source"], edge["target"]
        if source in SKILL_TO_INDEX and target in SKILL_TO_INDEX:
            prereqs[target].append(source)
            left, right = SKILL_TO_INDEX[source], SKILL_TO_INDEX[target]
            adjacency[left, right] = adjacency[right, left] = 1.0
    fixed = {skill: tuple(sorted(values)) for skill, values in prereqs.items()}
    if fixed != EXPECTED_PREREQS:
        raise ValueError("Fixed curriculum graph differs from pilot prerequisite DAG")
    return adjacency, fixed


def causal_proxy(history: Sequence[PilotEvent], prerequisites: Sequence[str]) -> float:
    if not prerequisites:
        return 1.0
    scores = []
    for skill in prerequisites:
        outcomes = [event.is_correct for event in history if event.skill_id == skill]
        if not outcomes:
            scores.append(0.0)
            continue
        weights = [0.95 ** (len(outcomes) - 1 - index) for index in range(len(outcomes))]
        scores.append(sum(w * outcome for w, outcome in zip(weights, outcomes)) / sum(weights))
    return sum(scores) / len(scores)


def pal_features(history: Sequence[PilotEvent], target: PilotEvent | PlannedTarget) -> tuple[int, np.ndarray, np.ndarray]:
    """Use only prior outcomes and pre-attempt target metadata."""
    counts = np.zeros(len(PILOT_SKILLS), dtype=np.float32)
    corrects = np.zeros(len(PILOT_SKILLS), dtype=np.float32)
    for event in history:
        index = SKILL_TO_INDEX[event.skill_id]
        counts[index] += 1
        corrects[index] += event.is_correct
    target_index = SKILL_TO_INDEX[target.skill_id]
    target_count = float(counts[target_index])
    total_count = float(counts.sum())
    summary = np.asarray((
        math.log1p(target_count),
        float(corrects[target_index] / target_count) if target_count else 0.5,
        math.log1p(total_count),
        float(corrects.sum() / total_count) if total_count else 0.5,
        target.difficulty / 3.0,
        target.prereq_mastery_proxy,
    ), dtype=np.float32)
    mastery = ((corrects + 1.0) / (counts + 2.0)).astype(np.float32)
    return target_index, summary, mastery


def build_pal_samples(sequences: Mapping[str, Sequence[PilotEvent]]) -> list[PALSample]:
    samples = []
    for user_id, events in sorted(sequences.items()):
        history: list[PilotEvent] = []
        for event in events:
            target, summary, mastery = pal_features(history, event)
            samples.append(PALSample(user_id, event.step_index, target, summary, mastery, event.is_correct))
            history.append(event)
    return samples


def history_tokens(history: Sequence[PilotEvent]) -> list[int]:
    return [SKILL_TO_INDEX[event.skill_id] + event.is_correct * len(PILOT_SKILLS) for event in history]


class PilotDKTDataset(Dataset):
    """Predict t >= 2 from interactions strictly before t."""

    def __init__(self, sequences: Mapping[str, Sequence[PilotEvent]], user_ids: Sequence[str]):
        self.rows = []
        for user_id in sorted(user_ids):
            events = sequences[user_id]
            if len(events) < 2:
                raise ValueError(f"DKT needs at least two events for {user_id}")
            self.rows.append((
                torch.tensor(history_tokens(events[:-1]), dtype=torch.long),
                torch.tensor([SKILL_TO_INDEX[event.skill_id] for event in events[1:]], dtype=torch.long),
                torch.tensor([event.is_correct for event in events[1:]], dtype=torch.float32),
                tuple(f"{user_id}:{event.step_index}" for event in events[1:]),
                user_id,
            ))

    def __len__(self) -> int:
        return len(self.rows)

    def __getitem__(self, index: int):
        return self.rows[index]


class PilotPALNet(nn.Module):
    """Small graph KT model with no synthetic persona input."""

    def __init__(self, num_skills: int, skill_dim: int = 16, history_dim: int = 16):
        super().__init__()
        self.num_skills = num_skills
        self.node_features = nn.Parameter(torch.randn(num_skills, skill_dim) * 0.05)
        self.gcn1 = GraphLayer(skill_dim)
        self.gcn2 = GraphLayer(skill_dim)
        self.q_linear = nn.Linear(skill_dim, skill_dim)
        self.k_linear = nn.Linear(skill_dim, skill_dim)
        self.history_encoder = nn.Sequential(nn.Linear(len(PAL_FEATURE_NAMES), history_dim), nn.ReLU())
        self.predictor = nn.Sequential(
            nn.Linear(skill_dim * 2 + history_dim, 32), nn.ReLU(),
            nn.Linear(32, 1),
        )

    def forward(self, targets: torch.Tensor, summary: torch.Tensor,
                mastery: torch.Tensor, adjacency: torch.Tensor) -> torch.Tensor:
        graph = adjacency + torch.eye(self.num_skills, device=adjacency.device)
        degree = graph.sum(dim=1).clamp_min(1e-7).pow(-0.5)
        graph = degree[:, None] * graph * degree[None, :]
        skill_embeddings = self.gcn2(self.gcn1(self.node_features, graph), graph)
        target_embeddings = skill_embeddings[targets]
        queries = self.q_linear(target_embeddings).unsqueeze(1)
        keys = self.k_linear(skill_embeddings).unsqueeze(0).expand(len(targets), -1, -1)
        attention = torch.softmax(torch.bmm(queries, keys.transpose(1, 2)) / math.sqrt(keys.shape[-1]), dim=2)
        weighted_skills = skill_embeddings.unsqueeze(0) * mastery.unsqueeze(2)
        context = torch.bmm(attention, weighted_skills).squeeze(1)
        history_embedding = self.history_encoder(summary)
        return self.predictor(torch.cat((target_embeddings, history_embedding, context), dim=1)).squeeze(1)


@torch.no_grad()
def predict_next_dkt(model: nn.Module, history: Sequence[PilotEvent], target_skill: str) -> float:
    """Offline next-step inference uses the exact training token encoder."""
    if not history:
        raise ValueError("DKT pilot does not predict the first interaction")
    model.eval()
    tokens = torch.tensor([history_tokens(history)], dtype=torch.long)
    logit = model(tokens)[0, -1, SKILL_TO_INDEX[target_skill]]
    return float(torch.sigmoid(logit))


@torch.no_grad()
def predict_next_pal(model: PilotPALNet, history: Sequence[PilotEvent],
                     target_skill: str, difficulty: int,
                     prerequisites: Mapping[str, Sequence[str]],
                     adjacency: torch.Tensor) -> float:
    """Offline next-step inference shares pal_features with training."""
    model.eval()
    target = PlannedTarget(target_skill, difficulty, round(causal_proxy(history, prerequisites[target_skill]), 4))
    skill, summary, mastery = pal_features(history, target)
    logit = model(
        torch.tensor([skill], dtype=torch.long),
        torch.tensor(summary[None, :]),
        torch.tensor(mastery[None, :]),
        adjacency,
    )[0]
    return float(torch.sigmoid(logit))


def split_users(sequences: Mapping[str, Sequence[PilotEvent]], seed: int = 20261008) -> dict[str, tuple[str, ...]]:
    """Fixed-size, persona-stratified user split; persona is never a model input."""
    by_persona: dict[str, list[str]] = {}
    for user_id, events in sequences.items():
        by_persona.setdefault(events[0].persona_group, []).append(user_id)
    expected = {"P-STRUGGLE": 10, "P-AVERAGE": 10, "P-FAST": 10, "P-ERRATIC": 10}
    if {name: len(users) for name, users in by_persona.items()} != expected:
        raise ValueError("Pilot learner composition changed; revisit the split")
    randomizer = random.Random(seed)
    for users in by_persona.values():
        users.sort()
        randomizer.shuffle(users)
    train, validation, test = [], [], []
    for users in by_persona.values():
        train.extend(users[:6])
        validation.extend(users[6:8])
        test.extend(users[8:])
    result = {"train": tuple(sorted(train)), "validation": tuple(sorted(validation)), "test": tuple(sorted(test))}
    sets = [set(users) for users in result.values()]
    if any(left & right for index, left in enumerate(sets) for right in sets[index + 1:]):
        raise AssertionError("Learner split overlap")
    if set().union(*sets) != set(sequences):
        raise AssertionError("Learner split does not cover pilot")
    return result


def audit_pilot(csv_path: Path, metadata_path: Path, graph_path: Path) -> dict:
    """Fail closed before any model is constructed or trained."""
    sequences = load_pilot(csv_path)
    adjacency, prerequisites = load_fixed_graph(graph_path)
    metadata = json.loads(metadata_path.read_text(encoding="utf-8"))
    events = [event for rows in sequences.values() for event in rows]
    counts: dict[str, int] = {}
    for rows in sequences.values():
        persona = rows[0].persona_group
        counts[persona] = counts.get(persona, 0) + 1
        history: list[PilotEvent] = []
        for event in rows:
            expected = round(causal_proxy(history, prerequisites[event.skill_id]), 4)
            if abs(expected - event.prereq_mastery_proxy) > 0.000051:
                raise ValueError(f"Non-causal/inconsistent proxy at {event.user_id}:{event.step_index}")
            history.append(event)
    if (metadata.get("total_learners") != len(sequences)
            or metadata.get("total_interactions") != len(events)
            or metadata.get("persona_breakdown") != counts):
        raise ValueError("Pilot metadata does not reconcile to CSV")
    split = split_users(sequences)
    samples = build_pal_samples(sequences)
    if len(samples) != len(events) or not np.isfinite(adjacency).all():
        raise AssertionError("Feature extraction failed")
    if set(PAL_FEATURE_NAMES) & set(FORBIDDEN_CURRENT_FIELDS):
        raise AssertionError("Forbidden target-time feature in PAL-Net contract")
    return {
        "status": "PASS",
        "dataset_sha256": sha256_file(csv_path),
        "graph_sha256": sha256_file(graph_path),
        "learners": len(sequences),
        "interactions": len(events),
        "persona_learners": counts,
        "split_user_ids": split,
        "model_feature_names": PAL_FEATURE_NAMES,
        "dkt_evaluated_steps": len(events) - len(sequences),
    }
