from __future__ import annotations

import argparse
import csv
import gzip
import json
import math
import platform
import sys
from dataclasses import dataclass
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np


SERVICE_ROOT = Path(__file__).resolve().parents[1]
REPO_ROOT = SERVICE_ROOT.parent
if str(SERVICE_ROOT) not in sys.path:
    sys.path.insert(0, str(SERVICE_ROOT))

from app.knowledge_tracing.benchmark.data import sha256_file  # noqa: E402
from app.knowledge_tracing.benchmark.metrics import binary_metrics  # noqa: E402
from scripts.summarize_kt_development import (  # noqa: E402
    EXPECTED_MODELS,
    event_label_digest,
    read_predictions,
)


METRICS = (
    "auc_roc",
    "accuracy_at_0_5",
    "rmse",
    "f1",
    "log_loss",
    "brier",
    "ece_equal_count_10",
)
SEED = 20261005
REPLICATES = 2000
RUN_ID = "final-g2-20261005T182731Z"
DATA_ROOT = SERVICE_ROOT / "data/external/assistments_2009_2010"
RUN_ROOT = SERVICE_ROOT / "artifacts/knowledge_tracing/assistments_g2" / RUN_ID
REPORT_PATH = REPO_ROOT / "docs/research/palnet/assistments_g3_report.md"
FIGURE_ROOT = REPO_ROOT / "docs/research/palnet/figures"
OUTPUT_PATH = DATA_ROOT / "g3_final_analysis.json"


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def relative(path: Path) -> str:
    return path.relative_to(REPO_ROOT).as_posix()


@dataclass
class WeightedMetrics:
    labels: np.ndarray
    probabilities: np.ndarray
    threshold: float

    def __post_init__(self) -> None:
        self.labels = np.asarray(self.labels, dtype=np.int8)
        self.probabilities = np.clip(np.asarray(self.probabilities, dtype=np.float64), 1e-7, 1 - 1e-7)
        self.correct_at_half = ((self.probabilities >= 0.5) == self.labels).astype(np.float64)
        self.predicted_f1 = self.probabilities >= self.threshold
        self.squared_error = (self.probabilities - self.labels) ** 2
        self.log_terms = -(
            self.labels * np.log(self.probabilities)
            + (1 - self.labels) * np.log1p(-self.probabilities)
        )
        self.order = np.argsort(self.probabilities, kind="mergesort")
        sorted_p = self.probabilities[self.order]
        self.tie_starts = np.r_[0, np.flatnonzero(np.diff(sorted_p)) + 1]

    def calculate(self, weights: np.ndarray) -> dict[str, float | None]:
        weights = np.asarray(weights, dtype=np.float64)
        n = float(weights.sum())
        positive = float(np.dot(weights, self.labels))
        negative = n - positive
        true_positive = float(np.dot(weights, self.predicted_f1 & (self.labels == 1)))
        false_positive = float(np.dot(weights, self.predicted_f1 & (self.labels == 0)))
        false_negative = positive - true_positive
        brier = float(np.dot(weights, self.squared_error) / n)

        sorted_weights = weights[self.order]
        sorted_labels = self.labels[self.order]
        positive_by_tie = np.add.reduceat(sorted_weights * sorted_labels, self.tie_starts)
        negative_by_tie = np.add.reduceat(sorted_weights * (1 - sorted_labels), self.tie_starts)
        auc = None
        if positive and negative:
            prior_negative = np.cumsum(negative_by_tie) - negative_by_tie
            auc = float(np.dot(positive_by_tie, prior_negative + negative_by_tie / 2) / (positive * negative))

        # Equal-count bins on the expanded learner bootstrap sample. A repeated learner
        # contributes all of their events once per draw, including at bin boundaries.
        cumulative_count = np.r_[0, np.cumsum(sorted_weights)]
        cumulative_label = np.r_[0, np.cumsum(sorted_weights * sorted_labels)]
        cumulative_probability = np.r_[0, np.cumsum(sorted_weights * self.probabilities[self.order])]
        count = int(n)
        boundaries = np.array(
            [(count // 10) * i + min(i, count % 10) for i in range(11)],
            dtype=np.float64,
        )
        locations = np.searchsorted(cumulative_count, boundaries, side="right") - 1
        locations = np.clip(locations, 0, len(sorted_weights) - 1)
        partial = boundaries - cumulative_count[locations]
        label_at_boundary = cumulative_label[locations] + partial * sorted_labels[locations]
        probability_at_boundary = (
            cumulative_probability[locations]
            + partial * self.probabilities[self.order][locations]
        )
        ece = float(np.abs(np.diff(label_at_boundary) - np.diff(probability_at_boundary)).sum() / n)

        denominator = 2 * true_positive + false_positive + false_negative
        return {
            "auc_roc": auc,
            "accuracy_at_0_5": float(np.dot(weights, self.correct_at_half) / n),
            "rmse": math.sqrt(brier),
            "f1": float(2 * true_positive / denominator) if denominator else 0.0,
            "log_loss": float(np.dot(weights, self.log_terms) / n),
            "brier": brier,
            "ece_equal_count_10": ece,
        }


def percentile_ci(values: list[float]) -> list[float]:
    return [float(value) for value in np.percentile(values, [2.5, 97.5])]


def holm_adjust(raw_p: dict[str, float]) -> dict[str, float]:
    ordered = sorted(raw_p, key=raw_p.get)
    adjusted = {}
    running = 0.0
    for index, name in enumerate(ordered):
        running = max(running, (len(ordered) - index) * raw_p[name])
        adjusted[name] = min(1.0, running)
    return adjusted


def load_checked_inputs() -> tuple[dict, dict, dict, tuple[str, ...], np.ndarray, np.ndarray, dict]:
    result_path = DATA_ROOT / "g2_final_test_result.json"
    record = read_json(DATA_ROOT / "g2_final_test_run_record.json")
    result = read_json(result_path)
    split_path = DATA_ROOT / "g2_split_manifest.json"
    config_path = SERVICE_ROOT / "configs/knowledge_tracing/assistments_g2.json"
    lock_path = DATA_ROOT / "g2_selected_config_lock.json"
    development_path = DATA_ROOT / "g2_development_summary.json"
    data_path = DATA_ROOT / "processed/main_events.csv.gz"
    expected_hashes = {
        result_path: record["final_result_sha256"],
        RUN_ROOT / "run_manifest.json": record["artifact_manifest_sha256"],
        split_path: record["split_manifest_sha256_before_evaluation"],
        config_path: record["config_sha256"],
        lock_path: record["lock_sha256_before_evaluation"],
        data_path: record["dataset_sha256"],
    }
    for path, expected in expected_hashes.items():
        if sha256_file(path) != expected:
            raise ValueError(f"Locked artifact checksum mismatch: {path}")
    if record["status"] != "COMPLETED_EVALUATED_ONCE" or result["run_id"] != RUN_ID:
        raise ValueError("Final run identity/status mismatch")
    if result["event_label_sha256"] != "644ff165e92cf61d9b3daeb588cb569e0ba938cbe2e81ec46f83de9a8624402b":
        raise ValueError("Unexpected locked event-label digest")
    if sha256_file(development_path) != read_json(lock_path)["development_summary_sha256"]:
        raise ValueError("Development summary checksum mismatch")

    lock = read_json(lock_path)
    split = read_json(split_path)
    if set(lock["models_to_evaluate_once_on_final_test"]) != set(EXPECTED_MODELS):
        raise ValueError("Locked model set differs from expected seven models")
    expected_users = set(split["final_test_user_ids"])
    reference: tuple[tuple[str, ...], np.ndarray, np.ndarray] | None = None
    predictions = {}
    provenance = {}
    result_by_model = {row["model"]: row for row in result["results"]}
    for model in EXPECTED_MODELS:
        model_dir = RUN_ROOT / model
        path = model_dir / "final_test_predictions.csv.gz"
        event_ids, users, labels, probabilities = read_predictions(path)
        if event_label_digest(event_ids, labels) != result["event_label_sha256"]:
            raise ValueError(f"Prediction event-label mismatch: {model}")
        if not set(users) <= expected_users or len(set(users)) != result["test_users"]:
            raise ValueError(f"Prediction user split mismatch: {model}")
        if reference is None:
            reference = (event_ids, users, labels)
        elif event_ids != reference[0] or not np.array_equal(users, reference[1]) or not np.array_equal(labels, reference[2]):
            raise ValueError(f"Prediction alignment mismatch: {model}")
        threshold = float(lock["selected_f1_thresholds"][model])
        calculated = binary_metrics(labels, probabilities, f1_threshold=threshold)
        replay_delta = {}
        for name in METRICS:
            replay_delta[name] = float(calculated[name] - result_by_model[model]["metrics"][name])
            tolerance = 5.1e-6 if model == "bkt" and name == "auc_roc" else 1e-9
            if not math.isclose(calculated[name], result_by_model[model]["metrics"][name], rel_tol=0, abs_tol=tolerance):
                raise ValueError(f"Published final metric mismatch: {model}/{name}")
        predictions[model] = probabilities
        provenance[model] = {
            "prediction_path": relative(path),
            "prediction_sha256": sha256_file(path),
            "result_path": relative(model_dir / "result.json"),
            "result_sha256": sha256_file(model_dir / "result.json"),
            "checkpoint_or_parameters_path": relative(model_dir / ("checkpoint.pt" if model in {"dkt_lstm", "palnet", "palnet_no_graph", "palnet_no_history"} else "parameters.json")),
            "checkpoint_or_parameters_sha256": sha256_file(model_dir / ("checkpoint.pt" if model in {"dkt_lstm", "palnet", "palnet_no_graph", "palnet_no_history"} else "parameters.json")),
            "saved_prediction_minus_original_final_metric": replay_delta,
        }
    assert reference is not None
    return result, lock, read_json(development_path), *reference, predictions, provenance


def read_event_metadata(event_ids: tuple[str, ...], users: np.ndarray, labels: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    requested = set(event_ids)
    metadata: dict[str, tuple[int, int, int, int]] = {}
    path = DATA_ROOT / "processed/main_events.csv.gz"
    with gzip.open(path, "rt", encoding="utf-8", newline="") as handle:
        for row in csv.DictReader(handle):
            if row["event_id"] in requested:
                metadata[row["event_id"]] = (
                    int(row["skill_id"]), int(row["sequence_index"]), int(row["correct"]), int(row["user_id"])
                )
    if len(metadata) != len(event_ids):
        raise ValueError("Missing final event metadata in locked G1 artifact")
    if any(metadata[event_id][2] != label for event_id, label in zip(event_ids, labels, strict=True)):
        raise ValueError("G1 label differs from final prediction label")
    if any(metadata[event_id][3] != user for event_id, user in zip(event_ids, users, strict=True)):
        raise ValueError("G1 user differs from final prediction user")
    return (
        np.asarray([metadata[event_id][0] for event_id in event_ids], dtype=np.int64),
        np.asarray([metadata[event_id][1] for event_id in event_ids], dtype=np.int64),
    )


def reliability_rows(labels: np.ndarray, probabilities: np.ndarray) -> list[dict]:
    rows = []
    for index, indices in enumerate(np.array_split(np.argsort(probabilities, kind="mergesort"), 10), start=1):
        rows.append({
            "bin": index,
            "events": len(indices),
            "mean_probability": float(probabilities[indices].mean()),
            "fraction_correct": float(labels[indices].mean()),
        })
    return rows


def subgroup_metrics(labels: np.ndarray, predictions: dict, lock: dict, mask: np.ndarray) -> dict:
    return {
        model: binary_metrics(labels[mask], probabilities[mask], f1_threshold=float(lock["selected_f1_thresholds"][model]))
        for model, probabilities in predictions.items()
    }


def roc_points(labels: np.ndarray, probabilities: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    order = np.argsort(-probabilities, kind="mergesort")
    y = labels[order]
    p = probabilities[order]
    ends = np.r_[np.flatnonzero(np.diff(p)) + 1, len(p)] - 1
    true_positive = np.r_[0, np.cumsum(y)[ends]]
    false_positive = np.r_[0, (ends + 1) - np.cumsum(y)[ends]]
    return false_positive / (len(y) - y.sum()), true_positive / y.sum()


def save_figures(labels: np.ndarray, predictions: dict, reliability: dict) -> dict:
    FIGURE_ROOT.mkdir(parents=True, exist_ok=True)
    figure, axis = plt.subplots(figsize=(7.5, 6))
    for model, probabilities in predictions.items():
        x, y = roc_points(labels, probabilities)
        axis.plot(x, y, label=model, linewidth=1.5)
    axis.plot([0, 1], [0, 1], "k--", linewidth=0.8)
    axis.set(xlabel="False positive rate", ylabel="True positive rate", title="ASSISTments final test ROC")
    axis.legend(fontsize=8, loc="lower right")
    figure.tight_layout()
    roc_path = FIGURE_ROOT / "assistments_g3_roc.png"
    figure.savefig(roc_path, dpi=180)
    plt.close(figure)

    figure, axis = plt.subplots(figsize=(7.5, 6))
    for model, rows in reliability.items():
        axis.plot([row["mean_probability"] for row in rows], [row["fraction_correct"] for row in rows], marker="o", markersize=3, label=model)
    axis.plot([0, 1], [0, 1], "k--", linewidth=0.8)
    axis.set(xlim=(0, 1), ylim=(0, 1), xlabel="Mean predicted probability", ylabel="Fraction correct", title="ASSISTments final test reliability (10 equal-count bins)")
    axis.legend(fontsize=8, loc="upper left")
    figure.tight_layout()
    calibration_path = FIGURE_ROOT / "assistments_g3_calibration.png"
    figure.savefig(calibration_path, dpi=180)
    plt.close(figure)
    return {"roc": relative(roc_path), "calibration": relative(calibration_path)}


def analyze() -> dict:
    result, lock, development, event_ids, users, labels, predictions, provenance = load_checked_inputs()
    skills, sequence_indices = read_event_metadata(event_ids, users, labels)
    user_ids, user_indices = np.unique(users, return_inverse=True)
    user_event_counts = np.bincount(user_indices)
    median_history = float(np.median(user_event_counts))
    rng = np.random.default_rng(SEED)
    calculators = {
        model: WeightedMetrics(labels, probabilities, float(lock["selected_f1_thresholds"][model]))
        for model, probabilities in predictions.items()
    }
    estimates = {model: calculator.calculate(np.ones(len(labels))) for model, calculator in calculators.items()}
    samples = {model: {metric: [] for metric in METRICS} for model in EXPECTED_MODELS}
    for _ in range(REPLICATES):
        drawn = rng.integers(len(user_ids), size=len(user_ids))
        multiplicity = np.bincount(drawn, minlength=len(user_ids))
        weights = multiplicity[user_indices]
        for model, calculator in calculators.items():
            row = calculator.calculate(weights)
            for metric in METRICS:
                if row[metric] is not None:
                    samples[model][metric].append(row[metric])
    if any(len(samples[model]["auc_roc"]) != REPLICATES for model in EXPECTED_MODELS):
        raise ValueError("A bootstrap replicate lacked both classes; AUC CI unavailable")

    confidence_intervals = {
        model: {metric: percentile_ci(samples[model][metric]) for metric in METRICS}
        for model in EXPECTED_MODELS
    }
    pairs = [("palnet", other) for other in EXPECTED_MODELS if other != "palnet"]
    comparisons = {}
    raw_p = {}
    for first, second in pairs:
        differences = np.asarray(samples[first]["auc_roc"]) - np.asarray(samples[second]["auc_roc"])
        name = f"{first}_minus_{second}"
        comparisons[name] = {
            "first": first,
            "second": second,
            "metric": "auc_roc",
            "effect": float(estimates[first]["auc_roc"] - estimates[second]["auc_roc"]),
            "percentile_95_ci": percentile_ci(differences.tolist()),
            "bootstrap_sign_p_two_sided": min(1.0, 2 * min(
                (int(np.count_nonzero(differences <= 0)) + 1) / (REPLICATES + 1),
                (int(np.count_nonzero(differences >= 0)) + 1) / (REPLICATES + 1),
            )),
        }
        if second in {"palnet_no_graph", "palnet_no_history"}:
            raw_p[name] = comparisons[name]["bootstrap_sign_p_two_sided"]
    for name, adjusted in holm_adjust(raw_p).items():
        comparisons[name]["holm_adjusted_p_rq2_family"] = adjusted

    short_users = user_ids[user_event_counts <= median_history]
    short_mask = np.isin(users, short_users)
    history_groups = {
        "short_at_or_below_median": {
            "users": int(len(short_users)), "events": int(short_mask.sum()),
            "metrics": subgroup_metrics(labels, predictions, lock, short_mask),
        },
        "long_above_median": {
            "users": int(len(user_ids) - len(short_users)), "events": int((~short_mask).sum()),
            "metrics": subgroup_metrics(labels, predictions, lock, ~short_mask),
        },
    }
    skill_counts = sorted(zip(*np.unique(skills, return_counts=True)), key=lambda row: (-row[1], row[0]))
    by_skill = []
    for skill, count in skill_counts:
        mask = skills == skill
        if count < 100:
            continue
        by_skill.append({
            "skill_id": int(skill), "events": int(count), "correct_rate": float(labels[mask].mean()),
            "metrics": subgroup_metrics(labels, predictions, lock, mask),
        })
    error_groups = {}
    for model, probabilities in predictions.items():
        predicted = probabilities >= 0.5
        error_groups[model] = {
            "true_positive": int(np.count_nonzero(predicted & (labels == 1))),
            "true_negative": int(np.count_nonzero(~predicted & (labels == 0))),
            "false_positive": int(np.count_nonzero(predicted & (labels == 0))),
            "false_negative": int(np.count_nonzero(~predicted & (labels == 1))),
            "early_event_error_rate_sequence_index_1_to_5": float((predicted[sequence_indices <= 5] != labels[sequence_indices <= 5]).mean()),
            "late_event_error_rate_sequence_index_above_20": float((predicted[sequence_indices > 20] != labels[sequence_indices > 20]).mean()),
        }
    reliability = {model: reliability_rows(labels, probabilities) for model, probabilities in predictions.items()}
    figures = save_figures(labels, predictions, reliability)
    payload = {
        "schema_version": "kt-final-analysis/1.0.0",
        "run_id": RUN_ID,
        "protocol_version": result["protocol_version"],
        "scope": "READ_ONLY_ANALYSIS_OF_SAVED_FINAL_PREDICTIONS",
        "bootstrap": {"unit": "user_id", "replicates": REPLICATES, "seed": SEED, "ci": "percentile_2.5_97.5", "auc_comparison_p": "two-sided bootstrap sign tail with plus-one correction", "holm_family": ["palnet_minus_palnet_no_graph", "palnet_minus_palnet_no_history"]},
        "sample": {"users": len(user_ids), "events": len(labels), "label_0": int((labels == 0).sum()), "label_1": int(labels.sum()), "positive_rate": float(labels.mean()), "majority_class_accuracy": float(max(labels.mean(), 1 - labels.mean())), "median_scored_events_per_user": median_history},
        "final_metrics": estimates,
        "confidence_intervals": confidence_intervals,
        "paired_auc_comparisons": comparisons,
        "development_fold_mean_sample_std": {row["model"]: row["fold_mean_and_sample_std"] for row in development["models"]},
        "history_groups": history_groups,
        "skill_groups_min_100_events": by_skill,
        "error_groups_at_threshold_0_5": error_groups,
        "reliability_equal_count_10": reliability,
        "figures": figures,
        "figure_sha256": {name: sha256_file(REPO_ROOT / path) for name, path in figures.items()},
        "provenance": {
            "final_result_path": relative(DATA_ROOT / "g2_final_test_result.json"),
            "final_result_sha256": sha256_file(DATA_ROOT / "g2_final_test_result.json"),
            "run_record_path": relative(DATA_ROOT / "g2_final_test_run_record.json"),
            "run_record_sha256": sha256_file(DATA_ROOT / "g2_final_test_run_record.json"),
            "config_path": relative(SERVICE_ROOT / "configs/knowledge_tracing/assistments_g2.json"),
            "config_sha256": result["config_sha256"],
            "split_path": relative(DATA_ROOT / "g2_split_manifest.json"),
            "split_sha256": result["split_manifest_sha256_before_evaluation"],
            "dataset_path": relative(DATA_ROOT / "processed/main_events.csv.gz"),
            "dataset_sha256": result["dataset_sha256"],
            "development_summary_path": relative(DATA_ROOT / "g2_development_summary.json"),
            "development_summary_sha256": sha256_file(DATA_ROOT / "g2_development_summary.json"),
            "config_lock_path": relative(DATA_ROOT / "g2_selected_config_lock.json"),
            "config_lock_sha256": result["lock_sha256_before_evaluation"],
            "event_label_sha256": result["event_label_sha256"],
            "model_artifacts": provenance,
            "analysis_script_path": relative(Path(__file__)),
            "analysis_script_sha256": sha256_file(Path(__file__)),
            "latency_path": relative(DATA_ROOT / "g3_latency.json") if (DATA_ROOT / "g3_latency.json").exists() else None,
            "latency_sha256": sha256_file(DATA_ROOT / "g3_latency.json") if (DATA_ROOT / "g3_latency.json").exists() else None,
            "python": platform.python_version(),
            "numpy": np.__version__,
            "matplotlib": matplotlib.__version__,
        },
    }
    write_json(OUTPUT_PATH, payload)
    return payload


def format_metric(value: float | None) -> str:
    return "NA" if value is None else f"{value:.4f}"


def write_report(payload: dict) -> None:
    latency_path = DATA_ROOT / "g3_latency.json"
    latency = read_json(latency_path) if latency_path.exists() else None
    if latency is not None and (latency["run_id"] != RUN_ID or latency["provenance"]["dataset_sha256"] != payload["provenance"]["dataset_sha256"]):
        raise ValueError("Latency benchmark provenance mismatch")
    names = {
        "global_rate": "Global rate", "skill_rate": "Skill rate", "bkt": "BKT",
        "dkt_lstm": "DKT-LSTM", "palnet": "PAL-Net",
        "palnet_no_graph": "PAL-Net không graph", "palnet_no_history": "PAL-Net không history",
    }
    lines = [
        "# Giai đoạn 3 — Phân tích benchmark Knowledge Tracing",
        "",
        f"Run final duy nhất: `{RUN_ID}`; protocol `{payload['protocol_version']}`. Phân tích đọc prediction đã lưu của 769 learner và 38.553 event. Bootstrap 2.000 lần theo learner, seed 20261005, CI percentile 95%. Mỗi lần rút learner, toàn bộ event của learner đó được lấy với cùng bội số. Không huấn luyện hay chọn lại cấu hình.",
        "",
        "## Kết quả test cuối và CI 95%",
        "",
        "Accuracy dùng ngưỡng 0,5; F1 dùng ngưỡng OOF development khóa trước test. ECE dùng 10 bin đồng số lượng. Nhãn đúng chiếm " + f"{payload['sample']['positive_rate']:.2%}" + "; baseline dự đoán lớp đa số có Accuracy " + f"{payload['sample']['majority_class_accuracy']:.4f}" + ".",
        "",
        "| Mô hình | AUC [CI 95%] | Accuracy | RMSE | F1 | Log loss | Brier | ECE |",
        "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
    ]
    for model in EXPECTED_MODELS:
        m = payload["final_metrics"][model]
        lo, hi = payload["confidence_intervals"][model]["auc_roc"]
        lines.append(f"| {names[model]} | {m['auc_roc']:.4f} [{lo:.4f}, {hi:.4f}] | {m['accuracy_at_0_5']:.4f} | {m['rmse']:.4f} | {m['f1']:.4f} | {m['log_loss']:.4f} | {m['brier']:.4f} | {m['ece_equal_count_10']:.4f} |")
    lines += [
        "",
        "| Mô hình | CI Accuracy | CI RMSE | CI F1 | CI log loss | CI Brier | CI ECE |",
        "| --- | ---: | ---: | ---: | ---: | ---: | ---: |",
    ]
    for model in EXPECTED_MODELS:
        ci = payload["confidence_intervals"][model]
        def interval(name: str) -> str:
            lo, hi = ci[name]
            return f"[{lo:.4f}, {hi:.4f}]"
        lines.append(f"| {names[model]} | {interval('accuracy_at_0_5')} | {interval('rmse')} | {interval('f1')} | {interval('log_loss')} | {interval('brier')} | {interval('ece_equal_count_10')} |")
    lines += [
        "",
        "Accuracy lớp đa số là mốc diễn giải, không thay cho baseline xác suất global rate. Xác suất trong CSV G2 được ghi với 12 chữ số có nghĩa; khi phát lại, AUC BKT thấp hơn kết quả tính trực tiếp lúc final test 0,00000503 do một số xác suất trở thành đồng hạng. CI ở đây dùng CSV đã lưu; số gốc G2 được giữ nguyên trong result và sai khác từng metric được ghi trong JSON.",
        "",
        "## Năm fold development (trung bình ± sample SD)",
        "",
        "| Mô hình | AUC | Accuracy | RMSE | F1 | Brier |",
        "| --- | ---: | ---: | ---: | ---: | ---: |",
    ]
    for model in EXPECTED_MODELS:
        stats = payload["development_fold_mean_sample_std"][model]
        def ms(name: str) -> str:
            return f"{stats[name]['mean']:.4f} ± {stats[name]['sample_std']:.4f}"
        lines.append(f"| {names[model]} | {ms('auc_roc')} | {ms('accuracy_at_0_5')} | {ms('rmse')} | {ms('f1')} | {ms('brier')} |")
    lines += [
        "",
        "## Chênh lệch AUC cặp trên cùng learner",
        "",
        "Dấu dương nghĩa là PAL-Net đầy đủ cao hơn mô hình so sánh. CI lấy từ cùng 2.000 mẫu bootstrap learner. Hai kiểm định ablation tạo một family Holm; p hai phía là tỷ lệ dấu bootstrap với hiệu chỉnh cộng một. Các cặp baseline khác trình bày effect/CI mô tả, không điều chỉnh nhiều phép thử.",
        "",
        "| So với PAL-Net đầy đủ | ΔAUC [CI 95%] | p bootstrap | p Holm (RQ2) |",
        "| --- | ---: | ---: | ---: |",
    ]
    for model in EXPECTED_MODELS:
        if model == "palnet":
            continue
        row = payload["paired_auc_comparisons"][f"palnet_minus_{model}"]
        lo, hi = row["percentile_95_ci"]
        p_holm = row.get("holm_adjusted_p_rq2_family")
        lines.append(f"| {names[model]} | {row['effect']:+.4f} [{lo:+.4f}, {hi:+.4f}] | {row['bootstrap_sign_p_two_sided']:.4f} | {'—' if p_holm is None else f'{p_holm:.4f}'} |")
    lines += [
        "",
        "## Phân tích lỗi và phân nhóm (hậu kiểm mô tả)",
        "",
        f"Median số event được chấm/người học ở test là {payload['sample']['median_scored_events_per_user']:.0f}. Nhóm ngắn gồm learner có số event ≤ median; nhóm dài có số event > median. Phân nhóm dùng độ dài chuỗi toàn bộ để mô tả, không được dùng làm đặc trưng dự đoán tại event.",
        "",
        "| Nhóm | Learner | Event | AUC PAL-Net | AUC DKT | AUC không graph |",
        "| --- | ---: | ---: | ---: | ---: | ---: |",
    ]
    for key, title in (("short_at_or_below_median", "Lịch sử ngắn"), ("long_above_median", "Lịch sử dài")):
        group = payload["history_groups"][key]
        lines.append(f"| {title} | {group['users']} | {group['events']} | {format_metric(group['metrics']['palnet']['auc_roc'])} | {format_metric(group['metrics']['dkt_lstm']['auc_roc'])} | {format_metric(group['metrics']['palnet_no_graph']['auc_roc'])} |")
    lines += [
        "",
        "| Kỹ năng phổ biến | Event | Tỷ lệ đúng | AUC PAL-Net | AUC DKT |",
        "| ---: | ---: | ---: | ---: | ---: |",
    ]
    for row in payload["skill_groups_min_100_events"][:10]:
        lines.append(f"| {row['skill_id']} | {row['events']} | {row['correct_rate']:.4f} | {format_metric(row['metrics']['palnet']['auc_roc'])} | {format_metric(row['metrics']['dkt_lstm']['auc_roc'])} |")
    lines += [
        "",
        "| Mô hình | False positive | False negative | Lỗi event 1–5 | Lỗi event >20 |",
        "| --- | ---: | ---: | ---: | ---: |",
    ]
    for model in EXPECTED_MODELS:
        row = payload["error_groups_at_threshold_0_5"][model]
        lines.append(f"| {names[model]} | {row['false_positive']} | {row['false_negative']} | {row['early_event_error_rate_sequence_index_1_to_5']:.4f} | {row['late_event_error_rate_sequence_index_above_20']:.4f} |")
    lines += [
        "",
        "Phân tích theo mọi kỹ năng có ít nhất 100 event và confusion matrix đầy đủ nằm trong JSON. Các nhóm nhỏ và biểu đồ không dùng để chọn lại model hoặc ngưỡng.",
        "",
        "## ROC và calibration",
        "",
        "![ROC ASSISTments](figures/assistments_g3_roc.png)",
        "",
        "![Calibration ASSISTments](figures/assistments_g3_calibration.png)",
        "",
        "Các điểm calibration là trung bình xác suất và tỷ lệ đúng trong 10 bin đồng số lượng; ECE là tổng sai lệch có trọng số. Một ECE thấp không chứng minh tác động học tập của chính sách gợi ý bài.",
        "",
        "## Độ trễ suy luận trên cùng máy",
        "",
    ]
    if latency is None:
        lines += ["Chưa có `g3_latency.json`; chạy `python ai-service/scripts/benchmark_kt_latency.py`, rồi chạy lại script phân tích để thêm bảng này.", ""]
    else:
        lines += [
            f"Thiết bị CPU `{latency['processor']}` ({latency['operating_system']}); PyTorch `{latency['torch']}`, {latency['torch_num_threads']} thread. Mẫu gồm {latency['provenance']['sample_users']} learner development và {latency['provenance']['sample_scored_events']} event được chấm, dùng chung cho bảy model. Có {next(iter(latency['results'].values()))['warmup_runs']} warm-up và {next(iter(latency['results'].values()))['timed_repeats']} lần đo/model. Input, checkpoint và graph được chuẩn bị trước phép đo; thời gian model-only là median. DKT và BKT xử lý theo chuỗi người học; các model còn lại xử lý event. BKT bao gồm cập nhật trạng thái tuần tự. CPU không cần đồng bộ GPU.",
            "",
            "| Mô hình | Batch size (đơn vị) | Tải model và chuẩn bị input (s) | Model-only median (ms/1.000 event) |",
            "| --- | ---: | ---: | ---: |",
        ]
        for model in EXPECTED_MODELS:
            row = latency["results"][model]
            lines.append(f"| {names[model]} | {row['batch_size']} ({row['batch_unit']}) | {row['input_preparation_seconds']:.4f} | {row['model_only_ms_per_1000_scored_events']:.4f} |")
        lines += [
            "",
            f"Đọc dữ liệu và chuẩn bị phần dùng chung mất {latency['provenance']['common_data_preparation_seconds']:.4f} s, nằm ngoài thời gian model-only. `g3_latency.json` lưu cả 10 lần đo, phần cứng, phiên bản thư viện và checksum checkpoint. Số đo này dành cho so sánh triển khai kỹ thuật trên máy hiện tại; batch và tính toán khác nhau giữa kiến trúc.",
            "",
        ]
    lines += [
        "## Tái lập và giới hạn",
        "",
        "Chạy `python ai-service/scripts/benchmark_kt_latency.py` rồi `python ai-service/scripts/analyze_kt_final.py` từ gốc repo. Script phân tích kiểm tra SHA-256 của data, split, config, lock, development summary và final result; đối chiếu event ID, user ID, label và metric của cả bảy prediction trước khi xuất JSON, hình và báo cáo. Mỗi checkpoint/parameters và prediction có checksum riêng trong JSON. Phiên bản Python, NumPy, Matplotlib cũng được lưu.",
        "",
        "Dữ liệu là bài toán ASSISTments 2009–2010; không suy ra chất lượng chọn bài trong LearnPython. Đồ thị dùng quan hệ chuyển tiếp kỹ năng thống kê, không phải prerequisite được chuyên gia xác nhận. So sánh subgroup là hậu kiểm và không có CI riêng. Các CI bootstrap phản ánh biến thiên người học trong test đã khóa, không bao gồm biến thiên do train seed, dataset khác hoặc domain shift.",
        "",
    ]
    REPORT_PATH.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Reproduce G3 analysis from saved one-time G2 final predictions")
    parser.parse_args()
    payload = analyze()
    write_report(payload)
    print(json.dumps({"run_id": RUN_ID, "users": payload["sample"]["users"], "events": payload["sample"]["events"], "bootstrap_replicates": REPLICATES, "analysis": str(OUTPUT_PATH), "report": str(REPORT_PATH)}, indent=2))


if __name__ == "__main__":
    main()
