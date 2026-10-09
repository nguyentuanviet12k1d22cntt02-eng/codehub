from __future__ import annotations

import copy
import json
import random
import time
from dataclasses import asdict
from pathlib import Path
from typing import Iterable, Mapping, Sequence

import numpy as np
import torch
from torch import nn
from torch.nn.utils.rnn import pad_sequence
from torch.utils.data import DataLoader, Dataset, TensorDataset

from .data import Event, HistoryFeatures, iter_events
from .metrics import binary_metrics
from .models import (
    BKTModel,
    ConstantRateModel,
    DKTModel,
    PALNetBenchmarkModel,
    SkillRateModel,
)


def set_reproducible_seed(seed: int) -> None:
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.use_deterministic_algorithms(True, warn_only=True)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)


class DKTSequenceDataset(Dataset):
    def __init__(
        self,
        sequences: Mapping[int, Sequence[Event]],
        user_ids: Iterable[int],
        skill_to_index: Mapping[int, int],
    ):
        self.rows: list[tuple[torch.Tensor, torch.Tensor, torch.Tensor, tuple[str, ...], int]] = []
        num_skills = len(skill_to_index)
        for user_id in sorted(user_ids):
            events = sequences[user_id]
            skill_indices = [skill_to_index[event.skill_id] for event in events]
            tokens = [skill + event.correct * num_skills for skill, event in zip(skill_indices, events)]
            self.rows.append(
                (
                    torch.tensor(tokens[:-1], dtype=torch.long),
                    torch.tensor(skill_indices[1:], dtype=torch.long),
                    torch.tensor([event.correct for event in events[1:]], dtype=torch.float32),
                    tuple(event.event_id for event in events[1:]),
                    user_id,
                )
            )

    def __len__(self) -> int:
        return len(self.rows)

    def __getitem__(self, index: int):
        return self.rows[index]


def collate_dkt(batch):
    tokens, targets, labels, event_ids, user_ids = zip(*batch)
    lengths = torch.tensor([len(value) for value in tokens], dtype=torch.long)
    return (
        pad_sequence(tokens, batch_first=True),
        pad_sequence(targets, batch_first=True),
        pad_sequence(labels, batch_first=True),
        torch.arange(int(lengths.max()))[None, :] < lengths[:, None],
        event_ids,
        user_ids,
    )


def _save_checkpoint(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    torch.save(payload, path)


def _write_json(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def train_dkt(
    sequences: Mapping[int, Sequence[Event]],
    train_users: set[int],
    validation_users: set[int],
    skills: Sequence[int],
    config: Mapping,
    output_dir: Path,
    seed: int,
    *,
    fixed_epochs: int | None = None,
) -> dict:
    set_reproducible_seed(seed)
    device = torch.device(config.get("device", "cpu"))
    skill_to_index = {skill_id: index for index, skill_id in enumerate(skills)}
    train_dataset = DKTSequenceDataset(sequences, train_users, skill_to_index)
    validation_dataset = DKTSequenceDataset(sequences, validation_users, skill_to_index)
    generator = torch.Generator().manual_seed(seed)
    train_loader = DataLoader(
        train_dataset,
        batch_size=int(config["batch_size"]),
        shuffle=True,
        generator=generator,
        collate_fn=collate_dkt,
    )
    validation_loader = DataLoader(
        validation_dataset,
        batch_size=int(config["batch_size"]),
        shuffle=False,
        collate_fn=collate_dkt,
    )
    model = DKTModel(
        len(skills),
        embedding_dim=int(config["embedding_dim"]),
        hidden_dim=int(config["hidden_dim"]),
        dropout=float(config["dropout"]),
    ).to(device)
    optimizer = torch.optim.Adam(
        model.parameters(),
        lr=float(config["learning_rate"]),
        weight_decay=float(config["weight_decay"]),
    )
    criterion = nn.BCEWithLogitsLoss(reduction="none")
    best_loss = float("inf")
    best_state = None
    patience_left = int(config["early_stopping_patience"])
    log: list[dict] = []

    if fixed_epochs is not None and fixed_epochs <= 0:
        raise ValueError("fixed_epochs must be positive")
    total_epochs = fixed_epochs if fixed_epochs is not None else int(config["max_epochs"])

    for epoch in range(1, total_epochs + 1):
        model.train()
        train_loss_sum = 0.0
        train_events = 0
        for tokens, targets, labels, mask, _, _ in train_loader:
            tokens, targets, labels, mask = (
                tokens.to(device),
                targets.to(device),
                labels.to(device),
                mask.to(device),
            )
            optimizer.zero_grad()
            all_logits = model(tokens)
            logits = all_logits.gather(2, targets.unsqueeze(-1)).squeeze(-1)
            losses = criterion(logits, labels)
            loss = losses[mask].mean()
            loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), 5.0)
            optimizer.step()
            train_loss_sum += float(losses[mask].sum().detach().cpu())
            train_events += int(mask.sum())

        epoch_record = {
            "epoch": epoch,
            "train_log_loss": train_loss_sum / train_events,
        }
        if fixed_epochs is None:
            validation = evaluate_dkt(model, validation_loader, device, include_predictions=False)
            validation_loss = float(validation["metrics"]["log_loss"])
            epoch_record["validation_log_loss"] = validation_loss
            if validation_loss < best_loss - 1e-6:
                best_loss = validation_loss
                best_state = copy.deepcopy(model.state_dict())
                patience_left = int(config["early_stopping_patience"])
            else:
                patience_left -= 1
        log.append(epoch_record)
        if fixed_epochs is None and patience_left <= 0:
            break

    if fixed_epochs is not None:
        best_state = copy.deepcopy(model.state_dict())

    if best_state is None:
        raise RuntimeError("DKT training did not produce a checkpoint")
    model.load_state_dict(best_state)
    result = evaluate_dkt(model, validation_loader, device, include_predictions=True)
    _save_checkpoint(
        output_dir / "checkpoint.pt",
        {
            "model": "dkt_lstm",
            "state_dict": best_state,
            "skills": list(skills),
            "config": dict(config),
            "seed": seed,
            "selection_mode": "fixed_epochs" if fixed_epochs is not None else "validation_log_loss",
            "trained_epochs": len(log),
            "best_validation_log_loss": None if fixed_epochs is not None else best_loss,
        },
    )
    _write_json(output_dir / "train_log.json", {"epochs": log})
    result["train_log"] = log
    return result


def evaluate_dkt(
    model: DKTModel,
    loader: DataLoader,
    device: torch.device,
    *,
    include_predictions: bool,
) -> dict:
    model.eval()
    labels_output: list[np.ndarray] = []
    probabilities_output: list[np.ndarray] = []
    event_output: list[str] = []
    user_output: list[int] = []
    started = time.perf_counter()
    with torch.no_grad():
        for tokens, targets, labels, mask, event_ids, user_ids in loader:
            tokens, targets = tokens.to(device), targets.to(device)
            logits = model(tokens).gather(2, targets.unsqueeze(-1)).squeeze(-1)
            probabilities = torch.sigmoid(logits).cpu()
            labels_output.append(labels[mask].numpy())
            probabilities_output.append(probabilities[mask].numpy())
            if include_predictions:
                for row, length in enumerate(mask.sum(dim=1).tolist()):
                    event_output.extend(event_ids[row][:length])
                    user_output.extend([int(user_ids[row])] * length)
    elapsed = time.perf_counter() - started
    labels_array = np.concatenate(labels_output)
    probabilities_array = np.concatenate(probabilities_output)
    return {
        "event_ids": tuple(event_output),
        "user_ids": np.asarray(user_output, dtype=np.int64),
        "labels": labels_array,
        "probabilities": probabilities_array,
        "metrics": binary_metrics(labels_array, probabilities_array),
        "inference_seconds": elapsed,
    }


def train_palnet(
    features: HistoryFeatures,
    train_users: set[int],
    validation_users: set[int],
    adjacency: np.ndarray,
    config: Mapping,
    output_dir: Path,
    seed: int,
    *,
    model_name: str,
    use_graph: bool,
    use_history: bool,
    fixed_epochs: int | None = None,
) -> dict:
    set_reproducible_seed(seed)
    device = torch.device(config.get("device", "cpu"))
    train_mask = np.isin(features.user_ids, np.fromiter(train_users, dtype=np.int64))
    validation_mask = np.isin(features.user_ids, np.fromiter(validation_users, dtype=np.int64))

    def dataset(mask: np.ndarray) -> TensorDataset:
        return TensorDataset(
            torch.from_numpy(features.skill_indices[mask]),
            torch.from_numpy(features.summary[mask]),
            torch.from_numpy(features.mastery[mask].astype(np.float32)),
            torch.from_numpy(features.labels[mask]),
        )

    generator = torch.Generator().manual_seed(seed)
    train_loader = DataLoader(
        dataset(train_mask),
        batch_size=int(config["batch_size"]),
        shuffle=True,
        generator=generator,
    )
    validation_loader = DataLoader(
        dataset(validation_mask),
        batch_size=int(config["batch_size"]),
        shuffle=False,
    )
    model = PALNetBenchmarkModel(
        adjacency.shape[0],
        skill_dim=int(config["skill_dim"]),
        history_dim=int(config["history_dim"]),
        hidden_dim=int(config["hidden_dim"]),
        dropout=float(config["dropout"]),
        use_graph=use_graph,
        use_history=use_history,
    ).to(device)
    adjacency_tensor = torch.from_numpy(adjacency).to(device)
    optimizer = torch.optim.Adam(
        model.parameters(),
        lr=float(config["learning_rate"]),
        weight_decay=float(config["weight_decay"]),
    )
    criterion = nn.BCEWithLogitsLoss()
    best_loss = float("inf")
    best_state = None
    patience_left = int(config["early_stopping_patience"])
    log: list[dict] = []

    if fixed_epochs is not None and fixed_epochs <= 0:
        raise ValueError("fixed_epochs must be positive")
    total_epochs = fixed_epochs if fixed_epochs is not None else int(config["max_epochs"])

    for epoch in range(1, total_epochs + 1):
        model.train()
        train_loss_sum = 0.0
        train_events = 0
        for targets, summary, mastery, labels in train_loader:
            targets, summary, mastery, labels = (
                targets.to(device),
                summary.to(device),
                mastery.to(device),
                labels.to(device),
            )
            optimizer.zero_grad()
            logits = model(targets, summary, mastery, adjacency_tensor)
            loss = criterion(logits, labels)
            loss.backward()
            optimizer.step()
            train_loss_sum += float(loss.detach().cpu()) * len(labels)
            train_events += len(labels)

        epoch_record = {
            "epoch": epoch,
            "train_log_loss": train_loss_sum / train_events,
        }
        if fixed_epochs is None:
            validation = evaluate_palnet(
                model,
                validation_loader,
                adjacency_tensor,
                device,
            )
            validation_loss = float(validation["metrics"]["log_loss"])
            epoch_record["validation_log_loss"] = validation_loss
            if validation_loss < best_loss - 1e-6:
                best_loss = validation_loss
                best_state = copy.deepcopy(model.state_dict())
                patience_left = int(config["early_stopping_patience"])
            else:
                patience_left -= 1
        log.append(epoch_record)
        if fixed_epochs is None and patience_left <= 0:
            break

    if fixed_epochs is not None:
        best_state = copy.deepcopy(model.state_dict())

    if best_state is None:
        raise RuntimeError(f"{model_name} training did not produce a checkpoint")
    model.load_state_dict(best_state)
    result = evaluate_palnet(model, validation_loader, adjacency_tensor, device)
    validation_indices = np.flatnonzero(validation_mask)
    result.update(
        {
            "event_ids": tuple(features.event_ids[index] for index in validation_indices),
            "user_ids": features.user_ids[validation_mask],
            "labels": features.labels[validation_mask],
        }
    )
    _save_checkpoint(
        output_dir / "checkpoint.pt",
        {
            "model": model_name,
            "state_dict": best_state,
            "config": dict(config),
            "seed": seed,
            "use_graph": use_graph,
            "use_history": use_history,
            "selection_mode": "fixed_epochs" if fixed_epochs is not None else "validation_log_loss",
            "trained_epochs": len(log),
            "best_validation_log_loss": None if fixed_epochs is not None else best_loss,
        },
    )
    _write_json(output_dir / "train_log.json", {"epochs": log})
    result["train_log"] = log
    return result


def evaluate_palnet(
    model: PALNetBenchmarkModel,
    loader: DataLoader,
    adjacency: torch.Tensor,
    device: torch.device,
) -> dict:
    model.eval()
    probabilities: list[np.ndarray] = []
    labels_output: list[np.ndarray] = []
    started = time.perf_counter()
    with torch.no_grad():
        for targets, summary, mastery, labels in loader:
            logits = model(
                targets.to(device),
                summary.to(device),
                mastery.to(device),
                adjacency,
            )
            probabilities.append(torch.sigmoid(logits).cpu().numpy())
            labels_output.append(labels.numpy())
    elapsed = time.perf_counter() - started
    labels_array = np.concatenate(labels_output)
    probabilities_array = np.concatenate(probabilities)
    return {
        "probabilities": probabilities_array,
        "metrics": binary_metrics(labels_array, probabilities_array),
        "inference_seconds": elapsed,
    }


def run_classical_model(
    model_name: str,
    sequences: Mapping[int, Sequence[Event]],
    train_users: set[int],
    validation_users: set[int],
    config: Mapping,
) -> dict:
    train_events = tuple(iter_events(sequences, train_users))
    validation_events = tuple(iter_events(sequences, validation_users))
    if model_name == "global_rate":
        model = ConstantRateModel.fit(train_events, **config)
        started = time.perf_counter()
        probabilities = model.predict(validation_events)
        inference_seconds = time.perf_counter() - started
        parameters = {"probability": model.probability}
        event_ids = tuple(event.event_id for event in validation_events if event.is_scored_event)
        labels = np.asarray(
            [event.correct for event in validation_events if event.is_scored_event],
            dtype=np.float32,
        )
    elif model_name == "skill_rate":
        model = SkillRateModel.fit(train_events, **config)
        started = time.perf_counter()
        probabilities = model.predict(validation_events)
        inference_seconds = time.perf_counter() - started
        parameters = {
            "global_probability": model.global_probability,
            "probabilities": {str(key): value for key, value in model.probabilities.items()},
        }
        event_ids = tuple(event.event_id for event in validation_events if event.is_scored_event)
        labels = np.asarray(
            [event.correct for event in validation_events if event.is_scored_event],
            dtype=np.float32,
        )
    elif model_name == "bkt":
        model = BKTModel.fit(sequences, train_users, **config)
        started = time.perf_counter()
        event_ids, labels, probabilities = model.predict_sequences(sequences, validation_users)
        inference_seconds = time.perf_counter() - started
        parameters = {
            **asdict(model.parameters),
            "initial_by_skill": {
                str(key): value for key, value in model.parameters.initial_by_skill.items()
            },
        }
    else:
        raise ValueError(f"Unknown classical model: {model_name}")
    users_by_event = {
        event.event_id: event.user_id
        for event in validation_events
        if event.is_scored_event
    }
    return {
        "event_ids": event_ids,
        "user_ids": np.asarray([users_by_event[event_id] for event_id in event_ids]),
        "labels": labels,
        "probabilities": probabilities,
        "metrics": binary_metrics(labels, probabilities),
        "parameters": parameters,
        "inference_seconds": inference_seconds,
    }
