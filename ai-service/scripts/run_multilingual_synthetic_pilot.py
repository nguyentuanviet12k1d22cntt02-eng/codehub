"""Create reproducible, synthetic-only JavaScript/C++ PAL-Net pilot artifacts.

The resulting checkpoints are for the module-practice pilot API only.  They
are explicitly excluded from the production serving registry.
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
from app.knowledge_tracing.multilingual_pilot import (  # noqa: E402
    ACTIVE_RUN_PATH, DATA_ROOT, PAL_FEATURE_NAMES, RUNS_ROOT, SUPPORTED_LANGUAGES,
    MultiLanguagePALNet, build_pal_samples, graph_contract, history_path_for,
    language_key, load_history, metadata_path_for, sha256_file, split_users,
)
from scripts.data_generation.generate_multilanguage_kt import generate  # noqa: E402


def tensors(samples, users: tuple[str, ...]) -> TensorDataset:
    selected = [sample for sample in samples if sample.user_id in users and sample.step_index >= 2]
    if not selected:
        raise ValueError("No scored samples for this pilot split")
    return TensorDataset(
        torch.tensor([sample.target_skill for sample in selected], dtype=torch.long),
        torch.tensor(np.stack([sample.summary for sample in selected]), dtype=torch.float32),
        torch.tensor(np.stack([sample.mastery for sample in selected]), dtype=torch.float32),
        torch.tensor([sample.label for sample in selected], dtype=torch.float32),
    )


@torch.no_grad()
def evaluate(model: MultiLanguagePALNet, loader: DataLoader, adjacency: torch.Tensor) -> tuple[np.ndarray, np.ndarray]:
    labels: list[np.ndarray] = []
    probabilities: list[np.ndarray] = []
    model.eval()
    for targets, summary, mastery, target in loader:
        labels.append(target.numpy())
        probabilities.append(torch.sigmoid(model(targets, summary, mastery, adjacency)).numpy())
    return np.concatenate(labels), np.concatenate(probabilities)


def train(samples, split: dict[str, tuple[str, ...]], adjacency: torch.Tensor, epochs: int, seed: int):
    torch.manual_seed(seed)
    train_loader = DataLoader(tensors(samples, split["train"]), batch_size=128, shuffle=True,
                              generator=torch.Generator().manual_seed(seed))
    validation_loader = DataLoader(tensors(samples, split["validation"]), batch_size=256)
    test_loader = DataLoader(tensors(samples, split["test"]), batch_size=256)
    model = MultiLanguagePALNet(adjacency.shape[0])
    optimizer = torch.optim.Adam(model.parameters(), lr=0.005)
    criterion = nn.BCEWithLogitsLoss()
    best_loss, best_epoch, best_state = math.inf, 0, None
    for epoch in range(1, epochs + 1):
        model.train()
        for targets, summary, mastery, labels in train_loader:
            optimizer.zero_grad()
            loss = criterion(model(targets, summary, mastery, adjacency), labels)
            loss.backward()
            optimizer.step()
        validation = evaluate(model, validation_loader, adjacency)
        validation_loss = binary_metrics(*validation)["log_loss"]
        if validation_loss < best_loss:
            best_loss, best_epoch, best_state = validation_loss, epoch, copy.deepcopy(model.state_dict())
    if best_state is None:
        raise RuntimeError("Pilot training did not produce a checkpoint")
    model.load_state_dict(best_state)
    return model, best_epoch, evaluate(model, validation_loader, adjacency), evaluate(model, test_loader, adjacency)


def run_language(language: str, seed: int, epochs: int) -> dict:
    key = language_key(language)
    DATA_ROOT.mkdir(parents=True, exist_ok=True)
    csv_path, generated_metadata_path = generate(key, seed=seed, output_root=DATA_ROOT)
    if csv_path != history_path_for(language) or generated_metadata_path != metadata_path_for(language):
        raise RuntimeError("Generated multilingual pilot paths do not match serving contract")
    sequences = load_history(language, csv_path)
    skill_ids, adjacency_array, prerequisites = graph_contract(language)
    samples = build_pal_samples(sequences, skill_ids, prerequisites)
    split = split_users(sequences, seed)
    adjacency = torch.from_numpy(adjacency_array)
    model, best_epoch, validation, test = train(samples, split, adjacency, epochs, seed)
    train_labels = np.asarray([sample.label for sample in samples if sample.user_id in split["train"] and sample.step_index >= 2])
    baseline = float((train_labels.sum() + 1) / (len(train_labels) + 2))
    dataset_sha256, graph_sha256 = sha256_file(csv_path), sha256_file(Path(SERVICE_ROOT / "data" / f"{key}SkillGraph.json"))
    run_id = f"{language.lower()}_{datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')}_{dataset_sha256[:8]}"
    run_root = RUNS_ROOT / language.lower() / run_id
    run_root.mkdir(parents=True, exist_ok=False)
    report = {
        "purpose": "synthetic multilingual pilot technical feasibility only; not learner efficacy or production readiness",
        "serving_eligible": False,
        "language": language,
        "dataset_type": "SYNTHETIC_HISTORY_REAL_ITEMS",
        "dataset_sha256": dataset_sha256,
        "graph_sha256": graph_sha256,
        "seed": seed,
        "max_epochs": epochs,
        "selected_epoch": best_epoch,
        "skill_ids": list(skill_ids),
        "feature_names": list(PAL_FEATURE_NAMES),
        "split_user_ids": split,
        "validation": {
            "baseline": binary_metrics(validation[0], np.full(len(validation[0]), baseline)),
            "PAL-Net": binary_metrics(*validation),
        },
        "test": {
            "baseline": binary_metrics(test[0], np.full(len(test[0]), baseline)),
            "PAL-Net": binary_metrics(*test),
        },
        "limitations": [
            "Outcomes and learner trajectories are simulated, even though exercise identifiers come from the product catalog.",
            "This artifact is excluded from the production serving registry and does not establish pedagogical efficacy.",
        ],
    }
    torch.save({
        "synthetic_pilot_only": True,
        "language": language,
        "model_state_dict": model.state_dict(),
        "skill_ids": list(skill_ids),
        "feature_names": list(PAL_FEATURE_NAMES),
        "dataset_sha256": dataset_sha256,
        "graph_sha256": graph_sha256,
    }, run_root / "palnet_pilot.pt")
    (run_root / "report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return {"run_id": run_id, "dataset_sha256": dataset_sha256, "graph_sha256": graph_sha256}


def activate(results: dict[str, dict]) -> None:
    existing = {"schema_version": "multilingual-synthetic-pilot-active-runs/1.0", "languages": {}}
    if ACTIVE_RUN_PATH.exists():
        existing = json.loads(ACTIVE_RUN_PATH.read_text(encoding="utf-8"))
    existing.setdefault("languages", {}).update(results)
    ACTIVE_RUN_PATH.parent.mkdir(parents=True, exist_ok=True)
    temporary = ACTIVE_RUN_PATH.with_suffix(".json.tmp")
    temporary.write_text(json.dumps(existing, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    temporary.replace(ACTIVE_RUN_PATH)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--language", choices=(*SUPPORTED_LANGUAGES, "ALL"), default="ALL")
    parser.add_argument("--seed", type=int, default=20261016)
    parser.add_argument("--epochs", type=int, default=12)
    parser.add_argument("--activate", action="store_true")
    args = parser.parse_args()
    if args.epochs < 1:
        parser.error("--epochs must be positive")
    torch.set_num_threads(1)
    languages = SUPPORTED_LANGUAGES if args.language == "ALL" else (args.language,)
    results = {language: run_language(language, args.seed, args.epochs) for language in languages}
    if args.activate:
        activate(results)
    print(json.dumps({"runs": results, "active": args.activate, "serving_eligible": False}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
