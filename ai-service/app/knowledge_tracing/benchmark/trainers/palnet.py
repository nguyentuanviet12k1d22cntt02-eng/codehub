from __future__ import annotations
import copy
import time
from pathlib import Path
from typing import Mapping
import numpy as np
import torch
from torch import nn
from torch.utils.data import DataLoader, TensorDataset
from ..data import HistoryFeatures
from ..metrics import binary_metrics
from ..models import PALNetBenchmarkModel

from .common import set_reproducible_seed, _save_checkpoint, _write_json

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
