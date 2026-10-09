from __future__ import annotations

import argparse
import csv
import gzip
import hashlib
import json
import math
import statistics
import sys
from datetime import datetime, timezone
from pathlib import Path

import numpy as np


SERVICE_ROOT = Path(__file__).resolve().parents[1]
if str(SERVICE_ROOT) not in sys.path:
    sys.path.insert(0, str(SERVICE_ROOT))

from app.knowledge_tracing.benchmark.data import sha256_file  # noqa: E402
from app.knowledge_tracing.benchmark.metrics import (  # noqa: E402
    binary_metrics,
    select_f1_threshold,
)


EXPECTED_MODELS = (
    "global_rate",
    "skill_rate",
    "bkt",
    "dkt_lstm",
    "palnet",
    "palnet_no_graph",
    "palnet_no_history",
)
EXPECTED_FOLDS = tuple(range(5))


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def portable_path(path: Path) -> str:
    try:
        return path.relative_to(SERVICE_ROOT).as_posix()
    except ValueError:
        return str(path)


def read_predictions(path: Path):
    event_ids: list[str] = []
    user_ids: list[int] = []
    labels: list[int] = []
    probabilities: list[float] = []
    with gzip.open(path, "rt", encoding="utf-8", newline="") as handle:
        for row in csv.DictReader(handle):
            event_ids.append(row["event_id"])
            user_ids.append(int(row["user_id"]))
            labels.append(int(row["label"]))
            probabilities.append(float(row["probability"]))
    return (
        tuple(event_ids),
        np.asarray(user_ids, dtype=np.int64),
        np.asarray(labels, dtype=np.int8),
        np.asarray(probabilities, dtype=np.float64),
    )


def event_label_digest(event_ids: tuple[str, ...], labels: np.ndarray) -> str:
    digest = hashlib.sha256()
    for event_id, label in zip(event_ids, labels, strict=True):
        digest.update(f"{event_id},{int(label)}\n".encode("utf-8"))
    return digest.hexdigest()


def summarize(
    run_manifest_paths: list[Path],
    config_path: Path,
    split_path: Path,
) -> tuple[dict, dict]:
    runs = [read_json(path) for path in run_manifest_paths]
    for run in runs:
        if run["scope"] != "DEVELOPMENT_CV_ONLY":
            raise ValueError("Only development CV runs may be summarized")
        if run["final_test_status"] != "SEALED_NOT_EVALUATED":
            raise ValueError("Final test must remain sealed")

    predictions: dict[tuple[int, str], tuple] = {}
    for manifest_path, run in zip(run_manifest_paths, runs, strict=True):
        for record in run["results"]:
            key = (int(record["fold"]), record["model"])
            if key in predictions:
                raise ValueError(f"Duplicate fold/model result: {key}")
            prediction_path = (
                manifest_path.parent
                / f"fold_{key[0]}"
                / key[1]
                / "validation_predictions.csv.gz"
            )
            predictions[key] = read_predictions(prediction_path)

    expected = {(fold, model) for fold in EXPECTED_FOLDS for model in EXPECTED_MODELS}
    if set(predictions) != expected:
        missing = sorted(expected.difference(predictions))
        extra = sorted(set(predictions).difference(expected))
        raise ValueError(f"Incomplete development matrix; missing={missing}, extra={extra}")

    reference_by_fold: dict[int, str] = {}
    for fold in EXPECTED_FOLDS:
        for model in EXPECTED_MODELS:
            event_ids, _, labels, _ = predictions[(fold, model)]
            digest = event_label_digest(event_ids, labels)
            if fold in reference_by_fold and digest != reference_by_fold[fold]:
                raise ValueError(f"Event/label mismatch in fold {fold}, model {model}")
            reference_by_fold[fold] = digest

    model_summaries = []
    selected_thresholds: dict[str, float] = {}
    for model in EXPECTED_MODELS:
        all_labels = np.concatenate([predictions[(fold, model)][2] for fold in EXPECTED_FOLDS])
        all_probabilities = np.concatenate(
            [predictions[(fold, model)][3] for fold in EXPECTED_FOLDS]
        )
        threshold = select_f1_threshold(all_labels, all_probabilities)
        selected_thresholds[model] = threshold
        fold_metrics = [
            binary_metrics(
                predictions[(fold, model)][2],
                predictions[(fold, model)][3],
                f1_threshold=threshold,
            )
            for fold in EXPECTED_FOLDS
        ]
        numeric_metric_names = (
            "auc_roc",
            "accuracy_at_0_5",
            "rmse",
            "f1",
            "log_loss",
            "brier",
            "ece_equal_count_10",
        )
        mean_std = {
            name: {
                "mean": float(statistics.mean(row[name] for row in fold_metrics)),
                "sample_std": float(statistics.stdev(row[name] for row in fold_metrics)),
            }
            for name in numeric_metric_names
        }
        model_summaries.append(
            {
                "model": model,
                "selected_f1_threshold_from_oof_validation": threshold,
                "oof_metrics": binary_metrics(
                    all_labels,
                    all_probabilities,
                    f1_threshold=threshold,
                ),
                "fold_metrics": fold_metrics,
                "fold_mean_and_sample_std": mean_std,
            }
        )

    config = read_json(config_path)
    neural_epochs: dict[str, int] = {}
    for model in ("dkt_lstm", "palnet", "palnet_no_graph", "palnet_no_history"):
        best_epochs = []
        for fold in EXPECTED_FOLDS:
            owner_manifest = next(
                path
                for path, run in zip(run_manifest_paths, runs, strict=True)
                if any(
                    int(record["fold"]) == fold and record["model"] == model
                    for record in run["results"]
                )
            )
            log = read_json(
                owner_manifest.parent / f"fold_{fold}" / model / "train_log.json"
            )["epochs"]
            best_epochs.append(
                min(log, key=lambda row: row["validation_log_loss"])["epoch"]
            )
        neural_epochs[model] = int(math.ceil(statistics.median(best_epochs)))

    now = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    summary = {
        "schema_version": "kt-development-summary/1.0.0",
        "created_at_utc": now,
        "protocol_version": config["protocol_version"],
        "scope": "DEVELOPMENT_CV_ONLY",
        "final_test_status": "SEALED_NOT_EVALUATED",
        "source_runs": [
            {"path": portable_path(path), "sha256": sha256_file(path)}
            for path in run_manifest_paths
        ],
        "fold_event_label_sha256": {
            str(fold): digest for fold, digest in reference_by_fold.items()
        },
        "models": model_summaries,
    }
    lock = {
        "schema_version": "kt-selected-config-lock/1.0.0",
        "locked_at_utc": now,
        "status": "LOCKED_BEFORE_FINAL_TEST",
        "protocol_version": config["protocol_version"],
        "config_sha256": sha256_file(config_path),
        "split_manifest_sha256": sha256_file(split_path),
        "development_summary_sha256": None,
        "models_to_evaluate_once_on_final_test": list(EXPECTED_MODELS),
        "selected_f1_thresholds": selected_thresholds,
        "final_training_epochs_from_cv_median_best_epoch": neural_epochs,
        "calibration": "identity/no post-hoc calibration",
        "final_test_status": "AWAITING_RESEARCH_OWNER_SIGN_OFF",
        "required_before_final_test": [
            "research owner names the protocol version and explicitly authorizes the first final-test run",
            "lock file is updated with the development summary checksum",
            "one immutable final-test run id is recorded",
        ],
    }
    return summary, lock


def main() -> None:
    parser = argparse.ArgumentParser(description="Validate and summarize complete KT development CV runs")
    parser.add_argument("--run-manifest", type=Path, action="append", required=True)
    parser.add_argument(
        "--config",
        type=Path,
        default=SERVICE_ROOT / "configs/knowledge_tracing/assistments_g2.json",
    )
    parser.add_argument(
        "--split-manifest",
        type=Path,
        default=SERVICE_ROOT
        / "data/external/assistments_2009_2010/g2_split_manifest.json",
    )
    parser.add_argument("--summary-output", type=Path, required=True)
    parser.add_argument("--lock-output", type=Path, required=True)
    args = parser.parse_args()
    run_paths = [path.resolve() for path in args.run_manifest]
    summary, lock = summarize(
        run_paths,
        args.config.resolve(),
        args.split_manifest.resolve(),
    )
    write_json(args.summary_output.resolve(), summary)
    lock["development_summary_sha256"] = sha256_file(args.summary_output.resolve())
    write_json(args.lock_output.resolve(), lock)
    print(args.summary_output.resolve())
    print(args.lock_output.resolve())


if __name__ == "__main__":
    main()
