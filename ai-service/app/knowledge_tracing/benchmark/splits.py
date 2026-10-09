from __future__ import annotations

import hashlib
from datetime import datetime, timezone
from typing import Mapping, Sequence

from .data import Event


def _stable_key(seed: int, namespace: str, user_id: int) -> str:
    return hashlib.sha256(f"{seed}:{namespace}:{user_id}".encode("utf-8")).hexdigest()


def create_split_manifest(
    sequences: Mapping[int, Sequence[Event]],
    *,
    dataset_sha256: str,
    seed: int = 20261005,
    test_fraction: float = 0.20,
    n_folds: int = 5,
    generated_at_utc: str | None = None,
) -> dict:
    """Create a deterministic learner holdout plus event-balanced group folds."""
    if not 0.0 < test_fraction < 1.0:
        raise ValueError("test_fraction must be between zero and one")
    if n_folds < 2:
        raise ValueError("n_folds must be at least two")
    users = sorted(sequences)
    if len(users) <= n_folds:
        raise ValueError("Not enough learners for the requested folds")

    ranked_users = sorted(users, key=lambda user_id: _stable_key(seed, "holdout", user_id))
    test_count = int(round(len(users) * test_fraction))
    test_users = sorted(ranked_users[:test_count])
    test_set = set(test_users)
    dev_users = [user_id for user_id in users if user_id not in test_set]

    fold_users: list[list[int]] = [[] for _ in range(n_folds)]
    fold_scored_counts = [0 for _ in range(n_folds)]
    dev_ranked = sorted(
        dev_users,
        key=lambda user_id: (
            -sum(event.is_scored_event for event in sequences[user_id]),
            _stable_key(seed, "fold", user_id),
        ),
    )
    for user_id in dev_ranked:
        fold_index = min(
            range(n_folds),
            key=lambda index: (
                fold_scored_counts[index],
                len(fold_users[index]),
                index,
            ),
        )
        fold_users[fold_index].append(user_id)
        fold_scored_counts[fold_index] += sum(
            event.is_scored_event for event in sequences[user_id]
        )

    timestamp = generated_at_utc or datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    manifest = {
        "schema_version": "kt-user-split-manifest/1.0.0",
        "protocol_version": "palnet-research-protocol/1.0.0",
        "created_at_utc": timestamp,
        "dataset_sha256": dataset_sha256,
        "seed": seed,
        "strategy": {
            "final_test": "stable seeded ranking of user_id; 20% learner holdout",
            "development": "5-fold event-balanced GroupKFold by user_id",
            "train_users_for_fold": "all development users except that fold's validation users",
        },
        "test_fraction": test_fraction,
        "n_folds": n_folds,
        "counts": {
            "all_users": len(users),
            "development_users": len(dev_users),
            "final_test_users": len(test_users),
            "all_history_events": sum(len(events) for events in sequences.values()),
            "all_scored_events": sum(
                event.is_scored_event
                for events in sequences.values()
                for event in events
            ),
        },
        "development_user_ids": sorted(dev_users),
        "final_test_user_ids": test_users,
        "folds": [
            {
                "fold": index,
                "validation_user_ids": sorted(user_ids),
                "validation_users": len(user_ids),
                "validation_scored_events": fold_scored_counts[index],
            }
            for index, user_ids in enumerate(fold_users)
        ],
        "final_test_status": "SEALED_NOT_EVALUATED",
    }
    assert_split_manifest(manifest)
    return manifest


def assert_split_manifest(manifest: Mapping) -> None:
    dev_users = set(manifest["development_user_ids"])
    test_users = set(manifest["final_test_user_ids"])
    if not dev_users or not test_users or dev_users & test_users:
        raise ValueError("Development and final-test learners must be non-empty and disjoint")

    fold_union: set[int] = set()
    for fold in manifest["folds"]:
        validation_users = set(fold["validation_user_ids"])
        if not validation_users or not validation_users <= dev_users:
            raise ValueError("Every validation fold must be a non-empty development subset")
        if fold_union & validation_users:
            raise ValueError("Validation learners occur in more than one fold")
        fold_union.update(validation_users)
    if fold_union != dev_users:
        raise ValueError("Validation folds must partition all development learners")


def users_for_fold(manifest: Mapping, fold_index: int) -> tuple[set[int], set[int]]:
    dev_users = set(manifest["development_user_ids"])
    matching = [fold for fold in manifest["folds"] if fold["fold"] == fold_index]
    if len(matching) != 1:
        raise ValueError(f"Unknown fold: {fold_index}")
    validation_users = set(matching[0]["validation_user_ids"])
    return dev_users - validation_users, validation_users
