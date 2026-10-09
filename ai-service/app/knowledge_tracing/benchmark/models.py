from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable, Mapping, Sequence

import numpy as np
import torch
from torch import nn

from .data import Event


EPSILON = 1e-7


@dataclass(frozen=True, slots=True)
class ConstantRateModel:
    probability: float

    @classmethod
    def fit(cls, events: Iterable[Event], alpha: float = 1.0, beta: float = 1.0):
        labels = [event.correct for event in events if event.is_scored_event]
        if not labels:
            raise ValueError("Cannot fit a rate model without scored events")
        probability = (sum(labels) + alpha) / (len(labels) + alpha + beta)
        return cls(float(probability))

    def predict(self, events: Sequence[Event]) -> np.ndarray:
        return np.full(
            sum(event.is_scored_event for event in events),
            self.probability,
            dtype=np.float64,
        )


@dataclass(frozen=True, slots=True)
class SkillRateModel:
    global_probability: float
    probabilities: Mapping[int, float]

    @classmethod
    def fit(cls, events: Iterable[Event], alpha: float = 1.0, beta: float = 1.0):
        correct: dict[int, int] = {}
        total: dict[int, int] = {}
        global_correct = 0
        global_total = 0
        for event in events:
            if not event.is_scored_event:
                continue
            correct[event.skill_id] = correct.get(event.skill_id, 0) + event.correct
            total[event.skill_id] = total.get(event.skill_id, 0) + 1
            global_correct += event.correct
            global_total += 1
        if not global_total:
            raise ValueError("Cannot fit a rate model without scored events")
        global_probability = (global_correct + alpha) / (global_total + alpha + beta)
        probabilities = {
            skill_id: (correct[skill_id] + alpha) / (count + alpha + beta)
            for skill_id, count in total.items()
        }
        return cls(float(global_probability), probabilities)

    def predict(self, events: Sequence[Event]) -> np.ndarray:
        return np.asarray(
            [
                self.probabilities.get(event.skill_id, self.global_probability)
                for event in events
                if event.is_scored_event
            ],
            dtype=np.float64,
        )


@dataclass(frozen=True, slots=True)
class BKTParameters:
    initial_by_skill: Mapping[int, float]
    learn: float
    guess: float
    slip: float


class BKTModel:
    """Classic no-forgetting BKT with train-only maximum-likelihood grid selection."""

    def __init__(self, parameters: BKTParameters):
        self.parameters = parameters

    @staticmethod
    def _posterior(mastery: float, correct: int, guess: float, slip: float) -> float:
        if correct:
            numerator = mastery * (1.0 - slip)
            denominator = numerator + (1.0 - mastery) * guess
        else:
            numerator = mastery * slip
            denominator = numerator + (1.0 - mastery) * (1.0 - guess)
        return numerator / max(denominator, EPSILON)

    @classmethod
    def fit(
        cls,
        sequences: Mapping[int, Sequence[Event]],
        train_user_ids: Iterable[int],
        *,
        learn_grid: Sequence[float],
        guess_grid: Sequence[float],
        slip_grid: Sequence[float],
        alpha: float = 1.0,
        beta: float = 1.0,
    ) -> "BKTModel":
        train_users = sorted(train_user_ids)
        first_correct: dict[int, int] = {}
        first_total: dict[int, int] = {}
        for user_id in train_users:
            seen_skills: set[int] = set()
            for event in sequences[user_id]:
                if event.skill_id in seen_skills:
                    continue
                seen_skills.add(event.skill_id)
                first_correct[event.skill_id] = first_correct.get(event.skill_id, 0) + event.correct
                first_total[event.skill_id] = first_total.get(event.skill_id, 0) + 1
        all_correct = sum(first_correct.values())
        all_total = sum(first_total.values())
        fallback = (all_correct + alpha) / (all_total + alpha + beta)
        initial = {
            skill_id: (first_correct[skill_id] + alpha) / (count + alpha + beta)
            for skill_id, count in first_total.items()
        }

        best: tuple[float, float, float, float] | None = None
        for learn in learn_grid:
            for guess in guess_grid:
                for slip in slip_grid:
                    negative_log_likelihood = 0.0
                    for user_id in train_users:
                        mastery: dict[int, float] = {}
                        for event in sequences[user_id]:
                            current = mastery.get(
                                event.skill_id,
                                initial.get(event.skill_id, fallback),
                            )
                            probability = current * (1.0 - slip) + (1.0 - current) * guess
                            probability = min(max(probability, EPSILON), 1.0 - EPSILON)
                            if event.is_scored_event:
                                negative_log_likelihood -= (
                                    event.correct * np.log(probability)
                                    + (1 - event.correct) * np.log(1.0 - probability)
                                )
                            posterior = cls._posterior(current, event.correct, guess, slip)
                            mastery[event.skill_id] = posterior + (1.0 - posterior) * learn
                    candidate = (negative_log_likelihood, learn, guess, slip)
                    if best is None or candidate < best:
                        best = candidate
        if best is None:
            raise ValueError("BKT parameter grid is empty")
        _, learn, guess, slip = best
        initial_with_fallback = dict(initial)
        initial_with_fallback[-1] = fallback
        return cls(BKTParameters(initial_with_fallback, learn, guess, slip))

    def predict_sequences(
        self,
        sequences: Mapping[int, Sequence[Event]],
        user_ids: Iterable[int],
    ) -> tuple[tuple[str, ...], np.ndarray, np.ndarray]:
        event_ids: list[str] = []
        labels: list[int] = []
        predictions: list[float] = []
        params = self.parameters
        fallback = params.initial_by_skill[-1]
        for user_id in sorted(user_ids):
            mastery: dict[int, float] = {}
            for event in sequences[user_id]:
                current = mastery.get(
                    event.skill_id,
                    params.initial_by_skill.get(event.skill_id, fallback),
                )
                probability = current * (1.0 - params.slip) + (1.0 - current) * params.guess
                if event.is_scored_event:
                    event_ids.append(event.event_id)
                    labels.append(event.correct)
                    predictions.append(probability)
                posterior = self._posterior(current, event.correct, params.guess, params.slip)
                mastery[event.skill_id] = posterior + (1.0 - posterior) * params.learn
        return (
            tuple(event_ids),
            np.asarray(labels, dtype=np.float32),
            np.asarray(predictions, dtype=np.float64),
        )


class DKTModel(nn.Module):
    def __init__(
        self,
        num_skills: int,
        embedding_dim: int = 32,
        hidden_dim: int = 64,
        dropout: float = 0.2,
    ):
        super().__init__()
        self.num_skills = num_skills
        self.interaction_embedding = nn.Embedding(num_skills * 2, embedding_dim)
        self.lstm = nn.LSTM(embedding_dim, hidden_dim, batch_first=True)
        self.dropout = nn.Dropout(dropout)
        self.output = nn.Linear(hidden_dim, num_skills)

    def forward(self, interaction_tokens: torch.Tensor) -> torch.Tensor:
        embedded = self.interaction_embedding(interaction_tokens)
        hidden, _ = self.lstm(embedded)
        return self.output(self.dropout(hidden))


class GraphLayer(nn.Module):
    def __init__(self, dimension: int):
        super().__init__()
        self.linear = nn.Linear(dimension, dimension)

    def forward(self, values: torch.Tensor, adjacency: torch.Tensor) -> torch.Tensor:
        return torch.relu(adjacency @ self.linear(values))


class PALNetBenchmarkModel(nn.Module):
    """PAL-Net benchmark variant without simulator-provided learner profiles."""

    def __init__(
        self,
        num_skills: int,
        skill_dim: int = 32,
        history_dim: int = 32,
        hidden_dim: int = 64,
        dropout: float = 0.2,
        *,
        use_graph: bool = True,
        use_history: bool = True,
    ):
        super().__init__()
        self.num_skills = num_skills
        self.use_graph = use_graph
        self.use_history = use_history
        self.node_features = nn.Parameter(torch.randn(num_skills, skill_dim) * 0.05)
        self.gcn1 = GraphLayer(skill_dim)
        self.gcn2 = GraphLayer(skill_dim)
        self.history_encoder = nn.Sequential(
            nn.Linear(5, history_dim),
            nn.ReLU(),
            nn.Linear(history_dim, history_dim),
            nn.ReLU(),
        )
        input_dim = skill_dim + history_dim + skill_dim
        self.predictor = nn.Sequential(
            nn.Linear(input_dim, hidden_dim),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(hidden_dim, 1),
        )

    def _skill_embeddings(self, adjacency: torch.Tensor) -> torch.Tensor:
        if not self.use_graph:
            return self.node_features
        identity = torch.eye(self.num_skills, device=adjacency.device)
        with_self = adjacency + identity
        degree = with_self.sum(dim=1).clamp_min(EPSILON).pow(-0.5)
        normalized = degree[:, None] * with_self * degree[None, :]
        return self.gcn2(self.gcn1(self.node_features, normalized), normalized)

    def forward(
        self,
        target_skills: torch.Tensor,
        history_summary: torch.Tensor,
        mastery: torch.Tensor,
        adjacency: torch.Tensor,
    ) -> torch.Tensor:
        skill_embeddings = self._skill_embeddings(adjacency)
        targets = skill_embeddings[target_skills]
        if self.use_history:
            history = self.history_encoder(history_summary)
            weights = mastery / mastery.sum(dim=1, keepdim=True).clamp_min(EPSILON)
            context = weights @ skill_embeddings
        else:
            history = torch.zeros(
                (target_skills.shape[0], self.history_encoder[0].out_features),
                device=target_skills.device,
            )
            context = torch.zeros_like(targets)
        return self.predictor(torch.cat([targets, history, context], dim=1)).squeeze(1)
