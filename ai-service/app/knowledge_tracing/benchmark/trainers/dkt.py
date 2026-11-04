from __future__ import annotations
import copy
import time
from pathlib import Path
from typing import Mapping, Sequence
import numpy as np
import torch
from torch import nn
from torch.utils.data import DataLoader
from ..data import Event
from ..metrics import binary_metrics
from ..models import DKTModel

from .common import set_reproducible_seed, DKTSequenceDataset, collate_dkt, _save_checkpoint, _write_json

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
