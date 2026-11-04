from __future__ import annotations
import time
from dataclasses import asdict
from typing import Mapping, Sequence
import numpy as np
from ..data import Event, iter_events
from ..metrics import binary_metrics
from ..models import BKTModel, ConstantRateModel, SkillRateModel


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
