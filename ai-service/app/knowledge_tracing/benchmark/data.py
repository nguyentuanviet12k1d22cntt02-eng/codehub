from __future__ import annotations

import csv
import gzip
import hashlib
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, Iterator, Mapping, Sequence

import numpy as np


@dataclass(frozen=True, slots=True)
class Event:
    event_id: str
    user_id: int
    order_id: int
    problem_id: int
    skill_id: int
    correct: int
    sequence_index: int
    is_scored_event: int


@dataclass(frozen=True, slots=True)
class HistoryFeatures:
    event_ids: tuple[str, ...]
    user_ids: np.ndarray
    skill_indices: np.ndarray
    labels: np.ndarray
    summary: np.ndarray
    mastery: np.ndarray


def sha256_file(path: Path, chunk_size: int = 1024 * 1024) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        while chunk := handle.read(chunk_size):
            digest.update(chunk)
    return digest.hexdigest()


def _open_csv(path: Path):
    if path.suffix == ".gz":
        return gzip.open(path, "rt", encoding="utf-8", newline="")
    return path.open("r", encoding="utf-8", newline="")


def load_event_sequences(
    path: Path,
    expected_sha256: str | None = None,
) -> dict[int, tuple[Event, ...]]:
    """Load G1 events and validate the ordering/scoring contract."""
    if expected_sha256 and sha256_file(path) != expected_sha256:
        raise ValueError(f"Event artifact checksum mismatch: {path}")

    required = {
        "event_id",
        "user_id",
        "order_id",
        "problem_id",
        "skill_id",
        "correct",
        "sequence_index",
        "is_scored_event",
    }
    sequences: dict[int, list[Event]] = {}
    seen_event_ids: set[str] = set()
    closed_users: set[int] = set()
    active_user: int | None = None
    previous_order_key: tuple[int, int, str] | None = None

    with _open_csv(path) as handle:
        reader = csv.DictReader(handle)
        missing = required.difference(reader.fieldnames or ())
        if missing:
            raise ValueError(f"Event artifact is missing columns: {sorted(missing)}")

        for row_number, row in enumerate(reader, start=2):
            try:
                event = Event(
                    event_id=row["event_id"],
                    user_id=int(row["user_id"]),
                    order_id=int(row["order_id"]),
                    problem_id=int(row["problem_id"]),
                    skill_id=int(row["skill_id"]),
                    correct=int(row["correct"]),
                    sequence_index=int(row["sequence_index"]),
                    is_scored_event=int(row["is_scored_event"]),
                )
            except (KeyError, TypeError, ValueError) as exc:
                raise ValueError(f"Invalid event row {row_number}") from exc

            if event.correct not in (0, 1) or event.is_scored_event not in (0, 1):
                raise ValueError(f"Non-binary value at row {row_number}")
            if not event.event_id or event.event_id in seen_event_ids:
                raise ValueError(f"Missing or duplicate event_id at row {row_number}")
            seen_event_ids.add(event.event_id)

            if active_user != event.user_id:
                if active_user is not None:
                    closed_users.add(active_user)
                if event.user_id in closed_users:
                    raise ValueError(f"User {event.user_id} is not stored contiguously")
                active_user = event.user_id
                previous_order_key = None

            user_events = sequences.setdefault(event.user_id, [])
            if event.sequence_index != len(user_events):
                raise ValueError(f"Non-contiguous sequence_index at row {row_number}")
            expected_scored = int(event.sequence_index > 0)
            if event.is_scored_event != expected_scored:
                raise ValueError(f"Scoring flag violates G1 contract at row {row_number}")

            order_key = (event.order_id, event.problem_id, event.event_id)
            if previous_order_key is not None and order_key <= previous_order_key:
                raise ValueError(f"Within-user ordering is not strictly increasing at row {row_number}")
            previous_order_key = order_key
            user_events.append(event)

    if not sequences:
        raise ValueError("Event artifact is empty")
    if any(len(events) < 2 for events in sequences.values()):
        raise ValueError("Every learner must retain at least two events")
    return {user_id: tuple(events) for user_id, events in sequences.items()}


def skill_vocabulary(sequences: Mapping[int, Sequence[Event]]) -> tuple[int, ...]:
    return tuple(sorted({event.skill_id for events in sequences.values() for event in events}))


def iter_events(
    sequences: Mapping[int, Sequence[Event]],
    user_ids: Iterable[int],
    *,
    scored_only: bool = False,
) -> Iterator[Event]:
    for user_id in sorted(user_ids):
        for event in sequences[user_id]:
            if not scored_only or event.is_scored_event:
                yield event


def build_history_features(
    sequences: Mapping[int, Sequence[Event]],
    skills: Sequence[int],
    user_ids: Iterable[int] | None = None,
) -> HistoryFeatures:
    """Build features strictly from events preceding each scored event."""
    skill_to_index = {skill_id: index for index, skill_id in enumerate(skills)}
    selected_users = sorted(sequences if user_ids is None else user_ids)
    event_ids: list[str] = []
    output_users: list[int] = []
    targets: list[int] = []
    labels: list[int] = []
    summaries: list[np.ndarray] = []
    masteries: list[np.ndarray] = []

    for user_id in selected_users:
        attempts = np.zeros(len(skills), dtype=np.float32)
        corrects = np.zeros(len(skills), dtype=np.float32)
        ema = np.full(len(skills), 0.5, dtype=np.float32)
        total_attempts = 0.0
        total_corrects = 0.0

        for event in sequences[user_id]:
            target = skill_to_index[event.skill_id]
            if event.is_scored_event:
                target_attempts = attempts[target]
                target_rate = (
                    corrects[target] / target_attempts if target_attempts else 0.5
                )
                global_rate = total_corrects / total_attempts if total_attempts else 0.5
                summaries.append(
                    np.asarray(
                        [
                            np.log1p(target_attempts),
                            target_rate,
                            ema[target],
                            np.log1p(total_attempts),
                            global_rate,
                        ],
                        dtype=np.float32,
                    )
                )
                smoothed_mastery = (corrects + 1.0) / (attempts + 2.0)
                masteries.append(smoothed_mastery.astype(np.float16, copy=False))
                event_ids.append(event.event_id)
                output_users.append(user_id)
                targets.append(target)
                labels.append(event.correct)

            attempts[target] += 1.0
            corrects[target] += float(event.correct)
            ema[target] = 0.7 * ema[target] + 0.3 * float(event.correct)
            total_attempts += 1.0
            total_corrects += float(event.correct)

    return HistoryFeatures(
        event_ids=tuple(event_ids),
        user_ids=np.asarray(output_users, dtype=np.int64),
        skill_indices=np.asarray(targets, dtype=np.int64),
        labels=np.asarray(labels, dtype=np.float32),
        summary=np.stack(summaries).astype(np.float32, copy=False),
        mastery=np.stack(masteries).astype(np.float16, copy=False),
    )


def build_association_graph(
    sequences: Mapping[int, Sequence[Event]],
    skills: Sequence[int],
    train_user_ids: Iterable[int],
    *,
    top_k: int = 8,
) -> np.ndarray:
    """Create an undirected transition-association graph from train users only."""
    skill_to_index = {skill_id: index for index, skill_id in enumerate(skills)}
    counts = np.zeros((len(skills), len(skills)), dtype=np.float32)
    for user_id in sorted(train_user_ids):
        events = sequences[user_id]
        for previous, current in zip(events, events[1:]):
            left = skill_to_index[previous.skill_id]
            right = skill_to_index[current.skill_id]
            if left == right:
                continue
            counts[left, right] += 1.0
            counts[right, left] += 1.0

    if top_k > 0 and top_k < len(skills):
        keep = np.zeros_like(counts, dtype=bool)
        for row_index, row in enumerate(counts):
            candidates = np.flatnonzero(row > 0)
            ranked = sorted(candidates, key=lambda index: (-row[index], int(index)))[:top_k]
            keep[row_index, ranked] = True
        counts = np.where(keep | keep.T, counts, 0.0)

    return np.log1p(counts).astype(np.float32, copy=False)
