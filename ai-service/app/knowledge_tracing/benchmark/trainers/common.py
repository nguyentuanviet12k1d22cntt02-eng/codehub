from __future__ import annotations
import json
import random
from pathlib import Path
from typing import Iterable, Mapping, Sequence
import numpy as np
import torch
from torch.nn.utils.rnn import pad_sequence
from torch.utils.data import Dataset
from ..data import Event

def set_reproducible_seed(seed: int) -> None:
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.use_deterministic_algorithms(True, warn_only=True)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)

class DKTSequenceDataset(Dataset):
    def __init__(
        self,
        sequences: Mapping[int, Sequence[Event]],
        user_ids: Iterable[int],
        skill_to_index: Mapping[int, int],
    ):
        self.rows: list[tuple[torch.Tensor, torch.Tensor, torch.Tensor, tuple[str, ...], int]] = []
        num_skills = len(skill_to_index)
        for user_id in sorted(user_ids):
            events = sequences[user_id]
            skill_indices = [skill_to_index[event.skill_id] for event in events]
            tokens = [skill + event.correct * num_skills for skill, event in zip(skill_indices, events)]
            self.rows.append(
                (
                    torch.tensor(tokens[:-1], dtype=torch.long),
                    torch.tensor(skill_indices[1:], dtype=torch.long),
                    torch.tensor([event.correct for event in events[1:]], dtype=torch.float32),
                    tuple(event.event_id for event in events[1:]),
                    user_id,
                )
            )

    def __len__(self) -> int:
        return len(self.rows)

    def __getitem__(self, index: int):
        return self.rows[index]

def collate_dkt(batch):
    tokens, targets, labels, event_ids, user_ids = zip(*batch)
    lengths = torch.tensor([len(value) for value in tokens], dtype=torch.long)
    return (
        pad_sequence(tokens, batch_first=True),
        pad_sequence(targets, batch_first=True),
        pad_sequence(labels, batch_first=True),
        torch.arange(int(lengths.max()))[None, :] < lengths[:, None],
        event_ids,
        user_ids,
    )

def _save_checkpoint(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    torch.save(payload, path)

def _write_json(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n", encoding="utf-8")
