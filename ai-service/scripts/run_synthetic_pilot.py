"""Offline technical-feasibility run for the audited synthetic pilot only.

No checkpoint from this script is eligible for the production serving registry.
"""

from __future__ import annotations

import argparse
import copy
import json
import math
import sys
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
import torch
from torch import nn
from torch.utils.data import DataLoader, TensorDataset

SERVICE_ROOT = Path(__file__).resolve().parents[1]
if str(SERVICE_ROOT) not in sys.path:
    sys.path.insert(0, str(SERVICE_ROOT))

from app.knowledge_tracing.benchmark.metrics import binary_metrics  # noqa: E402
from app.knowledge_tracing.benchmark.models import DKTModel  # noqa: E402
from app.knowledge_tracing.benchmark.training import collate_dkt  # noqa: E402
from app.knowledge_tracing.pilot import (  # noqa: E402
    PAL_FEATURE_NAMES,
    PILOT_SKILLS,
    PilotDKTDataset,
    PilotPALNet,
    audit_pilot,
    build_pal_samples,
    load_fixed_graph,
    load_pilot,
    sha256_file,
)

CSV_PATH = SERVICE_ROOT / "data" / "synthetic_pilot_learners.csv"
META_PATH = SERVICE_ROOT / "data" / "synthetic_pilot_10_learners_metadata.json"
GRAPH_PATH = SERVICE_ROOT / "data" / "skill_graph.json"


def pal_tensors(samples, users: tuple[str, ...]) -> TensorDataset:
    selected = [sample for sample in samples if sample.user_id in users and sample.step_index >= 2]
    if not selected:
        raise ValueError("No scored PAL-Net pilot samples")
    return TensorDataset(
        torch.tensor([sample.target_skill for sample in selected], dtype=torch.long),
        torch.tensor(np.stack([sample.summary for sample in selected]), dtype=torch.float32),
        torch.tensor(np.stack([sample.mastery for sample in selected]), dtype=torch.float32),
        torch.tensor([sample.label for sample in selected], dtype=torch.float32),
    )


@torch.no_grad()
def evaluate_dkt(model: DKTModel, loader: DataLoader) -> tuple[np.ndarray, np.ndarray]:
    model.eval()
    labels_out: list[np.ndarray] = []
    probabilities_out: list[np.ndarray] = []
    for tokens, targets, labels, mask, _, _ in loader:
        logits = model(tokens).gather(2, targets.unsqueeze(-1)).squeeze(-1)
        labels_out.append(labels[mask].numpy())
        probabilities_out.append(torch.sigmoid(logits[mask]).numpy())
    return np.concatenate(labels_out), np.concatenate(probabilities_out)


@torch.no_grad()
def evaluate_pal(model: PilotPALNet, loader: DataLoader,
                 adjacency: torch.Tensor) -> tuple[np.ndarray, np.ndarray]:
    model.eval()
    labels_out: list[np.ndarray] = []
    probabilities_out: list[np.ndarray] = []
    for targets, summary, mastery, labels in loader:
        labels_out.append(labels.numpy())
        probabilities_out.append(torch.sigmoid(model(targets, summary, mastery, adjacency)).numpy())
    return np.concatenate(labels_out), np.concatenate(probabilities_out)


def train_dkt(sequences, split, epochs: int, seed: int):
    torch.manual_seed(seed)
    train = DataLoader(PilotDKTDataset(sequences, split["train"]), batch_size=4,
                       shuffle=True, generator=torch.Generator().manual_seed(seed),
                       collate_fn=collate_dkt)
    validation = DataLoader(PilotDKTDataset(sequences, split["validation"]),
                            batch_size=2, collate_fn=collate_dkt)
    test = DataLoader(PilotDKTDataset(sequences, split["test"]),
                      batch_size=2, collate_fn=collate_dkt)
    model = DKTModel(len(PILOT_SKILLS), embedding_dim=16, hidden_dim=32, dropout=0.1)
    optimizer = torch.optim.Adam(model.parameters(), lr=0.005)
    criterion = nn.BCEWithLogitsLoss(reduction="none")
    best_loss = math.inf
    best_state = None
    best_epoch = None
    for epoch in range(1, epochs + 1):
        model.train()
        for tokens, targets, labels, mask, _, _ in train:
            optimizer.zero_grad()
            logits = model(tokens).gather(2, targets.unsqueeze(-1)).squeeze(-1)
            loss = criterion(logits, labels)[mask].mean()
            loss.backward()
            optimizer.step()
        val_labels, val_probabilities = evaluate_dkt(model, validation)
        val_loss = binary_metrics(val_labels, val_probabilities)["log_loss"]
        if val_loss < best_loss:
            best_loss, best_epoch = val_loss, epoch
            best_state = copy.deepcopy(model.state_dict())
    assert best_state is not None
    model.load_state_dict(best_state)
    val_labels, val_probabilities = evaluate_dkt(model, validation)
    test_labels, test_probabilities = evaluate_dkt(model, test)
    return model, best_epoch, (val_labels, val_probabilities), (test_labels, test_probabilities)


def train_pal(samples, split, adjacency: torch.Tensor, epochs: int, seed: int):
    torch.manual_seed(seed + 1)
    train = DataLoader(pal_tensors(samples, split["train"]), batch_size=32,
                       shuffle=True, generator=torch.Generator().manual_seed(seed + 1))
    validation = DataLoader(pal_tensors(samples, split["validation"]), batch_size=128)
    test = DataLoader(pal_tensors(samples, split["test"]), batch_size=128)
    model = PilotPALNet(len(PILOT_SKILLS))
    optimizer = torch.optim.Adam(model.parameters(), lr=0.005)
    criterion = nn.BCEWithLogitsLoss()
    best_loss = math.inf
    best_state = None
    best_epoch = None
    for epoch in range(1, epochs + 1):
        model.train()
        for targets, summary, mastery, labels in train:
            optimizer.zero_grad()
            loss = criterion(model(targets, summary, mastery, adjacency), labels)
            loss.backward()
            optimizer.step()
        val_labels, val_probabilities = evaluate_pal(model, validation, adjacency)
        val_loss = binary_metrics(val_labels, val_probabilities)["log_loss"]
        if val_loss < best_loss:
            best_loss, best_epoch = val_loss, epoch
            best_state = copy.deepcopy(model.state_dict())
    assert best_state is not None
    model.load_state_dict(best_state)
    val_labels, val_probabilities = evaluate_pal(model, validation, adjacency)
    test_labels, test_probabilities = evaluate_pal(model, test, adjacency)
    return model, best_epoch, (val_labels, val_probabilities), (test_labels, test_probabilities)


def run_training(gate: dict, epochs: int, seed: int, output_root: Path) -> Path:
    sequences = load_pilot(CSV_PATH)
    adjacency_array, _ = load_fixed_graph(GRAPH_PATH)
    adjacency = torch.tensor(adjacency_array)
    split = gate["split_user_ids"]
    samples = build_pal_samples(sequences)
    dkt_model, dkt_epoch, dkt_val, dkt_test = train_dkt(sequences, split, epochs, seed)
    pal_model, pal_epoch, pal_val, pal_test = train_pal(samples, split, adjacency, epochs, seed)
    train_labels = np.asarray(
        [sample.label for sample in samples if sample.user_id in split["train"] and sample.step_index >= 2],
        dtype=np.float32,
    )
    baseline_probability = float((train_labels.sum() + 1) / (len(train_labels) + 2))
    if not np.array_equal(dkt_test[0], pal_test[0]):
        # DKT batches are user/step ordered, while PAL samples are also user/step ordered.
        raise AssertionError("DKT and PAL-Net test targets are not aligned")
    report = {
        "purpose": "synthetic pilot technical feasibility only; not learner efficacy",
        "dataset_type": "SYNTHETIC",
        "interpretation_limit": "Forty simulated learners; test metrics are descriptive, not evidence of real-world model benefit",
        "serving_eligible": False,
        "dataset_sha256": gate["dataset_sha256"],
        "graph_sha256": gate["graph_sha256"],
        "seed": seed,
        "max_epochs": epochs,
        "split_user_ids": split,
        "scored_policy": "t>=2 for all models; held-out learner history is observed only before each predicted step",
        "model_features": {"DKT": "shifted prior skill/outcome tokens + current target skill",
                           "PAL-Net": PAL_FEATURE_NAMES},
        "baseline_train_rate": baseline_probability,
        "validation": {
            "baseline": binary_metrics(dkt_val[0], np.full(len(dkt_val[0]), baseline_probability)),
            "DKT": binary_metrics(*dkt_val),
            "PAL-Net": binary_metrics(*pal_val),
        },
        "test": {
            "baseline": binary_metrics(dkt_test[0], np.full(len(dkt_test[0]), baseline_probability)),
            "DKT": binary_metrics(*dkt_test),
            "PAL-Net": binary_metrics(*pal_test),
        },
        "selected_epoch": {"DKT": dkt_epoch, "PAL-Net": pal_epoch},
    }
    if sha256_file(CSV_PATH) != gate["dataset_sha256"]:
        raise RuntimeError("Pilot CSV changed during training")
    run_id = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ") + "_" + gate["dataset_sha256"][:8]
    output_dir = output_root / run_id
    output_dir.mkdir(parents=True, exist_ok=False)
    torch.save({"pilot_only": True, "model_state_dict": dkt_model.state_dict(),
                "skill_ids": PILOT_SKILLS, "dataset_sha256": gate["dataset_sha256"]},
               output_dir / "dkt_pilot.pt")
    torch.save({"pilot_only": True, "model_state_dict": pal_model.state_dict(),
                "skill_ids": PILOT_SKILLS, "feature_names": PAL_FEATURE_NAMES,
                "dataset_sha256": gate["dataset_sha256"]}, output_dir / "palnet_pilot.pt")
    (output_dir / "report.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    return output_dir


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--train", action="store_true", help="Run offline training after the gate passes")
    parser.add_argument("--epochs", type=int, default=8)
    parser.add_argument("--seed", type=int, default=20261008)
    parser.add_argument("--output-root", type=Path, default=SERVICE_ROOT / "outputs" / "synthetic_pilot")
    args = parser.parse_args()
    if args.epochs < 1:
        parser.error("--epochs must be positive")
    torch.set_num_threads(1)
    gate = audit_pilot(CSV_PATH, META_PATH, GRAPH_PATH)
    print(json.dumps({"feature_gate": gate}, indent=2))
    if args.train:
        output_dir = run_training(gate, args.epochs, args.seed, args.output_root)
        print(json.dumps({"offline_run": str(output_dir), "serving_eligible": False}))


if __name__ == "__main__":
    main()
