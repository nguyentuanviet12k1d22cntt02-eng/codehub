"""Audited, synthetic-only PAL-Net contract for JavaScript and C++ pilots.

The pilot models in this module are deliberately separate from the production
serving registry.  They are trained only on simulated outcomes over real
catalogue exercises and must never be described as evidence of learner impact.
"""

from __future__ import annotations

import csv
import hashlib
import json
import math
import random
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path
from typing import Mapping, Sequence

import numpy as np
import torch
from torch import nn

from app.knowledge_tracing.benchmark.models import GraphLayer


SERVICE_ROOT = Path(__file__).resolve().parents[2]
DATA_ROOT = SERVICE_ROOT / "data" / "synthetic_pilot_multilingual"
RUNS_ROOT = SERVICE_ROOT / "outputs" / "multilingual_synthetic_pilot"
ACTIVE_RUN_PATH = RUNS_ROOT / "active.json"
SUPPORTED_LANGUAGES = ("JAVASCRIPT", "CPP")
PAL_FEATURE_NAMES = (
    "log_prior_target_exposures", "prior_target_accuracy",
    "log_prior_total_exposures", "prior_global_accuracy",
    "target_difficulty_over_3", "causal_prereq_mastery_proxy",
)


@dataclass(frozen=True)
class PilotEvent:
    user_id: str
    step_index: int
    skill_id: str
    difficulty: int
    is_correct: int


@dataclass(frozen=True)
class PlannedTarget:
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


def normalize_language(language: str) -> str:
    value = str(language or "").upper()
    if value == "JS":
        value = "JAVASCRIPT"
    if value not in SUPPORTED_LANGUAGES:
        raise ValueError("Unsupported multilingual synthetic pilot language")
    return value


def language_key(language: str) -> str:
    return "javascript" if normalize_language(language) == "JAVASCRIPT" else "cpp"


def graph_path_for(language: str) -> Path:
    return SERVICE_ROOT / "data" / f"{language_key(language)}SkillGraph.json"


def history_path_for(language: str) -> Path:
    return DATA_ROOT / f"{language_key(language)}_history.csv"


def metadata_path_for(language: str) -> Path:
    return DATA_ROOT / f"{language_key(language)}_metadata.json"


def sha256_file(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def graph_contract(language: str) -> tuple[tuple[str, ...], np.ndarray, dict[str, tuple[str, ...]]]:
    graph = json.loads(graph_path_for(language).read_text(encoding="utf-8"))
    skill_ids = tuple(str(skill["id"]) for skill in graph["skills"])
    if not skill_ids or len(skill_ids) != len(set(skill_ids)):
        raise ValueError("Invalid skill vocabulary")
    index = {skill_id: position for position, skill_id in enumerate(skill_ids)}
    adjacency = np.zeros((len(skill_ids), len(skill_ids)), dtype=np.float32)
    prerequisites: dict[str, list[str]] = {skill_id: [] for skill_id in skill_ids}
    for edge in graph.get("edges", []):
        source, target = str(edge.get("source", "")), str(edge.get("target", ""))
        if source not in index or target not in index:
            raise ValueError("Graph edge references an unknown skill")
        adjacency[index[source], index[target]] = 1.0
        adjacency[index[target], index[source]] = 1.0
        prerequisites[target].append(source)
    return skill_ids, adjacency, {key: tuple(sorted(value)) for key, value in prerequisites.items()}


def load_history(language: str, path: Path | None = None) -> dict[str, tuple[PilotEvent, ...]]:
    skill_ids, _, _ = graph_contract(language)
    valid_skills = set(skill_ids)
    source_path = path or history_path_for(language)
    grouped: dict[str, list[PilotEvent]] = {}
    with source_path.open("r", encoding="utf-8-sig", newline="") as source:
        reader = csv.DictReader(source)
        required = {"user_id", "step_index", "skill_id", "difficulty", "is_correct"}
        if not required <= set(reader.fieldnames or ()):
            raise ValueError("Synthetic multilingual history schema is invalid")
        for row in reader:
            event = PilotEvent(
                user_id=str(row["user_id"]), step_index=int(row["step_index"]),
                skill_id=str(row["skill_id"]), difficulty=int(row["difficulty"]),
                is_correct=int(row["is_correct"]),
            )
            if (not event.user_id or event.skill_id not in valid_skills or
                    event.difficulty not in (1, 2, 3) or event.is_correct not in (0, 1)):
                raise ValueError("Synthetic multilingual history contains an invalid event")
            grouped.setdefault(event.user_id, []).append(event)
    if not grouped:
        raise ValueError("Synthetic multilingual history is empty")
    sequences: dict[str, tuple[PilotEvent, ...]] = {}
    for user_id, events in grouped.items():
        ordered = tuple(sorted(events, key=lambda item: item.step_index))
        if [event.step_index for event in ordered] != list(range(1, len(ordered) + 1)):
            raise ValueError("Synthetic multilingual history has non-contiguous steps")
        sequences[user_id] = ordered
    return sequences


def causal_proxy(history: Sequence[PilotEvent], prerequisites: Sequence[str]) -> float:
    if not prerequisites:
        return 1.0
    values: list[float] = []
    for skill_id in prerequisites:
        outcomes = [event.is_correct for event in history if event.skill_id == skill_id]
        if not outcomes:
            values.append(0.0)
            continue
        weights = [0.95 ** (len(outcomes) - 1 - index) for index in range(len(outcomes))]
        values.append(sum(weight * outcome for weight, outcome in zip(weights, outcomes)) / sum(weights))
    return sum(values) / len(values)


def pal_features(
    history: Sequence[PilotEvent], target: PlannedTarget | PilotEvent, skill_ids: Sequence[str],
) -> tuple[int, np.ndarray, np.ndarray]:
    index = {skill_id: position for position, skill_id in enumerate(skill_ids)}
    counts = np.zeros(len(skill_ids), dtype=np.float32)
    corrects = np.zeros(len(skill_ids), dtype=np.float32)
    for event in history:
        counts[index[event.skill_id]] += 1
        corrects[index[event.skill_id]] += event.is_correct
    target_index = index[target.skill_id]
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


def build_pal_samples(
    sequences: Mapping[str, Sequence[PilotEvent]], skill_ids: Sequence[str],
    prerequisites: Mapping[str, Sequence[str]],
) -> list[PALSample]:
    samples: list[PALSample] = []
    for user_id, events in sorted(sequences.items()):
        history: list[PilotEvent] = []
        for event in events:
            target = PlannedTarget(event.skill_id, event.difficulty, causal_proxy(history, prerequisites[event.skill_id]))
            skill, summary, mastery = pal_features(history, target, skill_ids)
            samples.append(PALSample(user_id, event.step_index, skill, summary, mastery, event.is_correct))
            history.append(event)
    return samples


class MultiLanguagePALNet(nn.Module):
    """The small graph PAL-Net architecture used exclusively by the pilot."""

    def __init__(self, num_skills: int, skill_dim: int = 16, history_dim: int = 16):
        super().__init__()
        self.num_skills = num_skills
        self.node_features = nn.Parameter(torch.randn(num_skills, skill_dim) * 0.05)
        self.gcn1 = GraphLayer(skill_dim)
        self.gcn2 = GraphLayer(skill_dim)
        self.q_linear = nn.Linear(skill_dim, skill_dim)
        self.k_linear = nn.Linear(skill_dim, skill_dim)
        self.history_encoder = nn.Sequential(nn.Linear(len(PAL_FEATURE_NAMES), history_dim), nn.ReLU())
        self.predictor = nn.Sequential(nn.Linear(skill_dim * 2 + history_dim, 32), nn.ReLU(), nn.Linear(32, 1))

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
        context = torch.bmm(attention, skill_embeddings.unsqueeze(0) * mastery.unsqueeze(2)).squeeze(1)
        history_embedding = self.history_encoder(summary)
        return self.predictor(torch.cat((target_embeddings, history_embedding, context), dim=1)).squeeze(1)


def split_users(sequences: Mapping[str, Sequence[PilotEvent]], seed: int) -> dict[str, tuple[str, ...]]:
    users = sorted(sequences)
    if len(users) < 15:
        raise ValueError("Need at least 15 simulated learners for the multilingual pilot")
    randomizer = random.Random(seed)
    randomizer.shuffle(users)
    validation_size = max(1, round(len(users) * 0.2))
    test_size = max(1, round(len(users) * 0.2))
    return {
        "train": tuple(sorted(users[:len(users) - validation_size - test_size])),
        "validation": tuple(sorted(users[len(users) - validation_size - test_size:len(users) - test_size])),
        "test": tuple(sorted(users[len(users) - test_size:])),
    }


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


def load_active_run(language: str) -> tuple[Path, dict]:
    normalized = normalize_language(language)
    manifest = json.loads(ACTIVE_RUN_PATH.read_text(encoding="utf-8"))
    selected = manifest.get("languages", {}).get(normalized)
    if not isinstance(selected, dict):
        raise ValueError("No active multilingual pilot run")
    run_id = selected.get("run_id")
    if not isinstance(run_id, str) or not run_id.startswith(normalized.lower() + "_"):
        raise ValueError("Active multilingual pilot run ID is invalid")
    run_root = (RUNS_ROOT / normalized.lower() / run_id).resolve()
    if run_root.parent != (RUNS_ROOT / normalized.lower()).resolve():
        raise ValueError("Active multilingual pilot run escapes its output directory")
    return run_root, selected


@lru_cache(maxsize=len(SUPPORTED_LANGUAGES))
def load_multilingual_pilot(language: str):
    normalized = normalize_language(language)
    run_root, manifest = load_active_run(normalized)
    report = json.loads((run_root / "report.json").read_text(encoding="utf-8"))
    checkpoint = torch.load(run_root / "palnet_pilot.pt", map_location="cpu", weights_only=True)
    skill_ids, adjacency, prerequisites = graph_contract(normalized)
    if (
        manifest.get("dataset_sha256") != report.get("dataset_sha256")
        or manifest.get("graph_sha256") != report.get("graph_sha256")
        or checkpoint.get("language") != normalized
        or checkpoint.get("dataset_sha256") != report.get("dataset_sha256")
        or checkpoint.get("graph_sha256") != report.get("graph_sha256")
        or tuple(checkpoint.get("skill_ids", ())) != skill_ids
        or tuple(checkpoint.get("feature_names", ())) != PAL_FEATURE_NAMES
        or not checkpoint.get("synthetic_pilot_only")
        or not _matches_expected_hash(history_path_for(normalized), str(report.get("dataset_sha256")))
        or not _matches_expected_hash(graph_path_for(normalized), str(report.get("graph_sha256")))
    ):
        raise ValueError("Multilingual pilot artifact, data, or graph mismatch")
    model = MultiLanguagePALNet(len(skill_ids))
    model.load_state_dict(checkpoint["model_state_dict"], strict=True)
    model.eval()
    return model, skill_ids, torch.from_numpy(adjacency), prerequisites, report
