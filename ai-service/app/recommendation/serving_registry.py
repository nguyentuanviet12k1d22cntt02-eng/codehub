"""Fail-closed serving checkpoint validation, separate from research artifacts."""

from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass
from pathlib import Path
from typing import Optional


@dataclass(frozen=True)
class ModelReadiness:
    ready: bool
    reason: str
    model_version: Optional[str] = None
    checkpoint_path: Optional[Path] = None


def checkpoint_metadata_matches(
    checkpoint: object, *, language: str, graph_version: str,
    mapping_version: str, skill_ids: tuple[str, ...], model_version: str,
) -> bool:
    """Require metadata inside the weights to match the deployment manifest."""
    return isinstance(checkpoint, dict) and all((
        checkpoint.get("num_skills") == len(skill_ids),
        checkpoint.get("skill_ids") == list(skill_ids),
        checkpoint.get("language") == language,
        checkpoint.get("graph_version") == graph_version,
        checkpoint.get("mapping_version") == mapping_version,
        checkpoint.get("model_version") == model_version,
        isinstance(checkpoint.get("model_state_dict"), dict),
    ))


def inspect_serving_model(
    registry_path: Path, *, language: str, graph_version: str,
    mapping_version: str, skill_ids: tuple[str, ...],
) -> ModelReadiness:
    """Require a language-scoped evaluated artifact and exact graph identity.

    A checksum/manifest check is necessary but not proof of model quality.
    The registry is deployment-owned; never accept its path from a request.
    """
    try:
        registry = json.loads(registry_path.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return ModelReadiness(False, "REGISTRY_UNAVAILABLE")
    if not isinstance(registry, dict):
        return ModelReadiness(False, "REGISTRY_INVALID")
    if registry.get("schemaVersion") != "palnet-serving-registry/1.0.0":
        return ModelReadiness(False, "REGISTRY_VERSION_MISMATCH")
    models = registry.get("models")
    if not isinstance(models, dict):
        return ModelReadiness(False, "REGISTRY_INVALID")
    entry = models.get(language)
    if not isinstance(entry, dict):
        return ModelReadiness(False, "NO_SERVING_CHECKPOINT")
    if entry.get("language") != language or entry.get("trainingDomain") != "LEARNPYTHON":
        return ModelReadiness(False, "DOMAIN_MISMATCH")
    if entry.get("evaluationStatus") != "VALIDATED":
        return ModelReadiness(False, "MODEL_NOT_VALIDATED")
    if entry.get("mappingStatus") != "VERIFIED":
        return ModelReadiness(False, "MAPPING_NOT_VERIFIED")
    if entry.get("graphVersion") != graph_version or entry.get("mappingVersion") != mapping_version:
        return ModelReadiness(False, "VERSION_MISMATCH")
    if entry.get("skillIds") != list(skill_ids):
        return ModelReadiness(False, "SKILL_GRAPH_MISMATCH")
    model_version = entry.get("modelVersion")
    if not isinstance(model_version, str) or not model_version:
        return ModelReadiness(False, "MODEL_VERSION_MISSING")
    relative = entry.get("checkpoint")
    if not isinstance(relative, str) or not relative:
        return ModelReadiness(False, "CHECKPOINT_PATH_INVALID")
    checkpoint = (registry_path.parent / relative).resolve()
    serving_root = registry_path.parent.resolve()
    if not checkpoint.is_relative_to(serving_root) or checkpoint.suffix not in {".pt", ".pth"}:
        return ModelReadiness(False, "CHECKPOINT_PATH_INVALID")
    if not checkpoint.is_file():
        return ModelReadiness(False, "CHECKPOINT_MISSING")
    try:
        checksum = hashlib.sha256(checkpoint.read_bytes()).hexdigest()
    except OSError:
        return ModelReadiness(False, "CHECKPOINT_UNREADABLE")
    if checksum != entry.get("sha256"):
        return ModelReadiness(False, "CHECKPOINT_CHECKSUM_MISMATCH")
    return ModelReadiness(True, "READY", model_version, checkpoint)
