from __future__ import annotations

import math

import numpy as np


def _validate(labels: np.ndarray, probabilities: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    labels = np.asarray(labels, dtype=np.int8)
    probabilities = np.asarray(probabilities, dtype=np.float64)
    if labels.ndim != 1 or probabilities.ndim != 1 or len(labels) != len(probabilities):
        raise ValueError("labels and probabilities must be aligned one-dimensional arrays")
    if not len(labels) or not np.isin(labels, (0, 1)).all():
        raise ValueError("labels must be a non-empty binary array")
    if not np.isfinite(probabilities).all():
        raise ValueError("probabilities must be finite")
    return labels, np.clip(probabilities, 1e-7, 1.0 - 1e-7)


def roc_auc(labels: np.ndarray, probabilities: np.ndarray) -> float | None:
    labels, probabilities = _validate(labels, probabilities)
    positives = int(labels.sum())
    negatives = len(labels) - positives
    if not positives or not negatives:
        return None
    order = np.argsort(probabilities, kind="mergesort")
    sorted_probabilities = probabilities[order]
    ranks = np.empty(len(labels), dtype=np.float64)
    start = 0
    while start < len(labels):
        end = start + 1
        while end < len(labels) and sorted_probabilities[end] == sorted_probabilities[start]:
            end += 1
        ranks[order[start:end]] = (start + 1 + end) / 2.0
        start = end
    positive_rank_sum = ranks[labels == 1].sum()
    return float(
        (positive_rank_sum - positives * (positives + 1) / 2.0)
        / (positives * negatives)
    )


def f1_score(labels: np.ndarray, probabilities: np.ndarray, threshold: float) -> float:
    labels, probabilities = _validate(labels, probabilities)
    predictions = probabilities >= threshold
    true_positives = int(np.logical_and(predictions, labels == 1).sum())
    false_positives = int(np.logical_and(predictions, labels == 0).sum())
    false_negatives = int(np.logical_and(~predictions, labels == 1).sum())
    denominator = 2 * true_positives + false_positives + false_negatives
    return float(2 * true_positives / denominator) if denominator else 0.0


def select_f1_threshold(labels: np.ndarray, probabilities: np.ndarray) -> float:
    labels, probabilities = _validate(labels, probabilities)
    order = np.argsort(-probabilities, kind="mergesort")
    sorted_labels = labels[order]
    sorted_probabilities = probabilities[order]
    cumulative_true_positives = np.cumsum(sorted_labels)
    total_positives = int(labels.sum())
    best_score = -1.0
    best_threshold = 0.0
    end = 0
    while end < len(labels):
        next_end = end + 1
        while (
            next_end < len(labels)
            and sorted_probabilities[next_end] == sorted_probabilities[end]
        ):
            next_end += 1
        true_positives = int(cumulative_true_positives[next_end - 1])
        predicted_positives = next_end
        score_denominator = predicted_positives + total_positives
        score = 2.0 * true_positives / score_denominator if score_denominator else 0.0
        threshold = float(sorted_probabilities[end])
        if score > best_score or (score == best_score and threshold < best_threshold):
            best_score = score
            best_threshold = threshold
        end = next_end

    all_positive_score = 2.0 * total_positives / (len(labels) + total_positives)
    if all_positive_score >= best_score:
        return 0.0
    return best_threshold


def expected_calibration_error(
    labels: np.ndarray,
    probabilities: np.ndarray,
    bins: int = 10,
) -> float:
    labels, probabilities = _validate(labels, probabilities)
    total = len(labels)
    error = 0.0
    for indices in np.array_split(np.argsort(probabilities, kind="mergesort"), bins):
        if not len(indices):
            continue
        error += len(indices) / total * abs(
            float(labels[indices].mean()) - float(probabilities[indices].mean())
        )
    return float(error)


def binary_metrics(
    labels: np.ndarray,
    probabilities: np.ndarray,
    *,
    f1_threshold: float = 0.5,
) -> dict[str, float | int | None]:
    labels, probabilities = _validate(labels, probabilities)
    predictions = probabilities >= 0.5
    residual = probabilities - labels
    log_loss = -np.mean(
        labels * np.log(probabilities) + (1 - labels) * np.log(1.0 - probabilities)
    )
    return {
        "events": len(labels),
        "label_0": int((labels == 0).sum()),
        "label_1": int((labels == 1).sum()),
        "auc_roc": roc_auc(labels, probabilities),
        "accuracy_at_0_5": float((predictions == labels).mean()),
        "rmse": float(math.sqrt(np.mean(residual**2))),
        "f1": f1_score(labels, probabilities, f1_threshold),
        "f1_threshold": float(f1_threshold),
        "log_loss": float(log_loss),
        "brier": float(np.mean(residual**2)),
        "ece_equal_count_10": expected_calibration_error(labels, probabilities, bins=10),
    }
