from __future__ import annotations

import argparse
import csv
import gzip
import hashlib
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

import numpy as np


SERVICE_ROOT = Path(__file__).resolve().parents[1]
if str(SERVICE_ROOT) not in sys.path:
    sys.path.insert(0, str(SERVICE_ROOT))

from app.knowledge_tracing.benchmark.data import (  # noqa: E402
    build_association_graph,
    build_history_features,
    load_event_sequences,
    sha256_file,
    skill_vocabulary,
)
from app.knowledge_tracing.benchmark.splits import (  # noqa: E402
    assert_split_manifest,
    create_split_manifest,
    users_for_fold,
)
from app.knowledge_tracing.benchmark.metrics import (  # noqa: E402
    binary_metrics,
    select_f1_threshold,
)
from app.knowledge_tracing.benchmark.training import (  # noqa: E402
    run_classical_model,
    train_dkt,
    train_palnet,
)


ALL_MODELS = (
    "global_rate",
    "skill_rate",
    "bkt",
    "dkt_lstm",
    "palnet",
    "palnet_no_graph",
    "palnet_no_history",
)


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def resolve_service_path(value: str) -> Path:
    path = Path(value)
    return path if path.is_absolute() else SERVICE_ROOT / path


def load_inputs(config_path: Path):
    config = read_json(config_path)
    data_manifest_path = resolve_service_path(config["data_manifest_path"])
    data_manifest = read_json(data_manifest_path)
    event_path = resolve_service_path(config["event_path"])
    expected_sha256 = data_manifest["artifacts"]["main_events"]["sha256"]
    sequences = load_event_sequences(event_path, expected_sha256)
    expected_users = data_manifest["counts"]["main_learners"]
    expected_events = data_manifest["counts"]["main_history_events"]
    if len(sequences) != expected_users or sum(map(len, sequences.values())) != expected_events:
        raise ValueError("Loaded G1 counts do not match the data manifest")
    return config, data_manifest, sequences, expected_sha256


def prepare(config_path: Path, *, force: bool = False) -> Path:
    config, _, sequences, dataset_sha256 = load_inputs(config_path)
    split_path = resolve_service_path(config["split_manifest_path"])
    if split_path.exists() and not force:
        existing = read_json(split_path)
        assert_split_manifest(existing)
        if existing["dataset_sha256"] != dataset_sha256 or existing["seed"] != config["seed"]:
            raise ValueError("Existing split manifest does not match config; use --force deliberately")
        return split_path
    split = create_split_manifest(
        sequences,
        dataset_sha256=dataset_sha256,
        seed=int(config["seed"]),
        test_fraction=float(config["split"]["final_test_fraction"]),
        n_folds=int(config["split"]["development_folds"]),
    )
    write_json(split_path, split)
    return split_path


def _prediction_digest(event_ids: tuple[str, ...], labels: np.ndarray) -> str:
    digest = hashlib.sha256()
    for event_id, label in zip(event_ids, labels, strict=True):
        digest.update(f"{event_id},{int(label)}\n".encode("utf-8"))
    return digest.hexdigest()


def _write_predictions(path: Path, result: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with gzip.open(path, "wt", encoding="utf-8", newline="") as handle:
        writer = csv.writer(handle)
        writer.writerow(("event_id", "user_id", "label", "probability"))
        for row in zip(
            result["event_ids"],
            result["user_ids"],
            result["labels"],
            result["probabilities"],
            strict=True,
        ):
            writer.writerow((row[0], int(row[1]), int(row[2]), f"{float(row[3]):.12g}"))


def run_development(
    config_path: Path,
    *,
    models: tuple[str, ...],
    folds: tuple[int, ...],
    run_id: str,
) -> Path:
    unknown_models = set(models).difference(ALL_MODELS)
    if unknown_models:
        raise ValueError(f"Unknown models: {sorted(unknown_models)}")
    config, _, sequences, dataset_sha256 = load_inputs(config_path)
    split_path = resolve_service_path(config["split_manifest_path"])
    split = read_json(split_path)
    assert_split_manifest(split)
    if split["dataset_sha256"] != dataset_sha256:
        raise ValueError("Split manifest and dataset checksum do not match")
    if split["final_test_status"] != "SEALED_NOT_EVALUATED":
        raise ValueError("Development command requires a sealed final test")

    allowed_folds = set(range(int(split["n_folds"])))
    if not folds or not set(folds) <= allowed_folds:
        raise ValueError(f"Folds must be a non-empty subset of {sorted(allowed_folds)}")

    output_root = resolve_service_path(config["artifact_root"]) / run_id
    if output_root.exists():
        raise FileExistsError(f"Run directory already exists: {output_root}")
    output_root.mkdir(parents=True)
    skills = skill_vocabulary(sequences)
    features = None
    if any(model.startswith("palnet") for model in models):
        features = build_history_features(
            sequences,
            skills,
            split["development_user_ids"],
        )

    summary = {
        "schema_version": "kt-development-run/1.0.0",
        "run_id": run_id,
        "created_at_utc": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "protocol_version": config["protocol_version"],
        "dataset_sha256": dataset_sha256,
        "config_sha256": sha256_file(config_path),
        "split_manifest_sha256": sha256_file(split_path),
        "scope": "DEVELOPMENT_CV_ONLY",
        "final_test_status": "SEALED_NOT_EVALUATED",
        "models": list(models),
        "folds": list(folds),
        "results": [],
    }

    for fold_index in folds:
        train_users, validation_users = users_for_fold(split, fold_index)
        association = build_association_graph(
            sequences,
            skills,
            train_users,
            top_k=int(config["models"]["palnet"]["association_graph_top_k"]),
        )
        graph_path = output_root / f"fold_{fold_index}" / "association_graph.npy"
        graph_path.parent.mkdir(parents=True, exist_ok=True)
        np.save(graph_path, association, allow_pickle=False)
        graph_sha256 = sha256_file(graph_path)
        reference_digest = None

        for model_name in models:
            model_dir = output_root / f"fold_{fold_index}" / model_name
            model_dir.mkdir(parents=True, exist_ok=True)
            model_seed = int(config["seed"]) + fold_index
            if model_name in ("global_rate", "skill_rate", "bkt"):
                result = run_classical_model(
                    model_name,
                    sequences,
                    train_users,
                    validation_users,
                    config["models"][model_name],
                )
                write_json(model_dir / "parameters.json", result["parameters"])
            elif model_name == "dkt_lstm":
                result = train_dkt(
                    sequences,
                    train_users,
                    validation_users,
                    skills,
                    config["models"]["dkt_lstm"],
                    model_dir,
                    model_seed,
                )
            else:
                if features is None:
                    raise RuntimeError("PAL-Net history features were not built")
                use_graph = model_name != "palnet_no_graph"
                use_history = model_name != "palnet_no_history"
                result = train_palnet(
                    features,
                    train_users,
                    validation_users,
                    association,
                    config["models"]["palnet"],
                    model_dir,
                    model_seed,
                    model_name=model_name,
                    use_graph=use_graph,
                    use_history=use_history,
                )

            validation_threshold = select_f1_threshold(
                result["labels"],
                result["probabilities"],
            )
            result["metrics"] = binary_metrics(
                result["labels"],
                result["probabilities"],
                f1_threshold=validation_threshold,
            )

            digest = _prediction_digest(result["event_ids"], result["labels"])
            if reference_digest is None:
                reference_digest = digest
            elif digest != reference_digest:
                raise RuntimeError(
                    f"Model {model_name} did not score the same event/label pairs in fold {fold_index}"
                )
            _write_predictions(model_dir / "validation_predictions.csv.gz", result)
            model_record = {
                "fold": fold_index,
                "model": model_name,
                "seed": model_seed,
                "train_users": len(train_users),
                "validation_users": len(validation_users),
                "event_label_sha256": digest,
                "association_graph_sha256": graph_sha256 if use_graph_for(model_name) else None,
                "metrics": result["metrics"],
            }
            if "inference_seconds" in result:
                model_record["inference_seconds"] = result["inference_seconds"]
            write_json(model_dir / "result.json", model_record)
            summary["results"].append(model_record)
            write_json(output_root / "run_manifest.json", summary)
    return output_root / "run_manifest.json"


def _validate_final_gate(
    *,
    config: dict,
    config_path: Path,
    split: dict,
    split_path: Path,
    lock: dict,
    lock_path: Path,
    authorization: dict,
    run_id: str,
) -> None:
    protocol_version = config["protocol_version"]
    if not all(
        payload.get("protocol_version") == protocol_version
        for payload in (split, lock, authorization)
    ):
        raise ValueError("Protocol version mismatch at the final-test gate")
    if authorization.get("schema_version") != "kt-final-test-authorization/1.0.0":
        raise ValueError("Unsupported final-test authorization schema")
    if authorization.get("status") != "AUTHORIZED":
        raise ValueError("Final-test authorization is not active")
    if authorization.get("signatory_role") != "research_owner":
        raise ValueError("Final test must be authorized by the research owner")
    if authorization.get("authorized_run_id") != run_id:
        raise ValueError("Run ID does not match the authorized one-time run")
    if sha256_file(config_path) != authorization.get("config_sha256"):
        raise ValueError("Config checksum does not match the authorization")
    if sha256_file(lock_path) != authorization.get("lock_sha256"):
        raise ValueError("Config-lock checksum does not match the authorization")
    if sha256_file(split_path) != authorization.get("split_manifest_sha256"):
        raise ValueError("Split checksum does not match the authorization")
    if lock.get("config_sha256") != authorization.get("config_sha256"):
        raise ValueError("Config lock does not identify the authorized config")
    if lock.get("split_manifest_sha256") != authorization.get("split_manifest_sha256"):
        raise ValueError("Config lock does not identify the authorized split")
    development_summary_path = split_path.parent / "g2_development_summary.json"
    if sha256_file(development_summary_path) != lock.get("development_summary_sha256"):
        raise ValueError("Development summary changed after configuration lock")
    if lock.get("development_summary_sha256") != authorization.get(
        "development_summary_sha256"
    ):
        raise ValueError("Authorization does not identify the locked development summary")
    if lock.get("status") != "LOCKED_BEFORE_FINAL_TEST":
        raise ValueError("Selected configuration is not locked before final test")
    if lock.get("final_test_status") != "AWAITING_RESEARCH_OWNER_SIGN_OFF":
        raise ValueError("Config lock is not in its preregistered pre-test state")
    if tuple(lock.get("models_to_evaluate_once_on_final_test", ())) != ALL_MODELS:
        raise ValueError("Locked final-test model matrix is incomplete or reordered")
    if split.get("final_test_status") != "SEALED_NOT_EVALUATED":
        raise ValueError("Final-test split is not sealed and unevaluated")
    if config.get("final_test", {}).get("status") != "SEALED_NOT_EVALUATED":
        raise ValueError("Config is not the sealed pre-evaluation config")
    if config.get("final_test", {}).get("evaluation_enabled") is not False:
        raise ValueError("Authorized runner requires the immutable disabled pre-test config")
    locked_epochs = lock.get("final_training_epochs_from_cv_median_best_epoch", {})
    expected_epochs = {
        "dkt_lstm": int(config["models"]["dkt_lstm"]["max_epochs"]),
        "palnet": int(config["models"]["palnet"]["max_epochs"]),
        "palnet_no_graph": int(config["models"]["palnet"]["max_epochs"]),
        "palnet_no_history": int(config["models"]["palnet"]["max_epochs"]),
    }
    if locked_epochs != expected_epochs:
        raise ValueError("Locked final training epochs do not match the preregistered budget")
    thresholds = lock.get("selected_f1_thresholds", {})
    if set(thresholds) != set(ALL_MODELS) or any(
        not 0.0 <= float(threshold) <= 1.0 for threshold in thresholds.values()
    ):
        raise ValueError("Locked F1 thresholds are incomplete or invalid")
    if lock.get("calibration") != "identity/no post-hoc calibration":
        raise ValueError("Final-test calibration differs from the locked configuration")


def run_final_test(
    config_path: Path,
    *,
    lock_path: Path,
    authorization_path: Path,
    run_id: str,
    reason: str,
) -> Path:
    config, _, sequences, dataset_sha256 = load_inputs(config_path)
    split_path = resolve_service_path(config["split_manifest_path"])
    split = read_json(split_path)
    lock = read_json(lock_path)
    authorization = read_json(authorization_path)
    assert_split_manifest(split)
    if split["dataset_sha256"] != dataset_sha256:
        raise ValueError("Split manifest and dataset checksum do not match")
    if reason.strip() != authorization.get("reason"):
        raise ValueError("Run reason does not match the signed authorization")
    _validate_final_gate(
        config=config,
        config_path=config_path,
        split=split,
        split_path=split_path,
        lock=lock,
        lock_path=lock_path,
        authorization=authorization,
        run_id=run_id,
    )

    final_result_path = resolve_service_path(authorization["final_result_path"])
    run_record_path = resolve_service_path(authorization["run_record_path"])
    output_root = resolve_service_path(config["artifact_root"]) / run_id
    protected_paths = (final_result_path, run_record_path, output_root)
    existing = [str(path) for path in protected_paths if path.exists()]
    if existing:
        raise FileExistsError(
            "One-time final-test guard found existing output; refusing to run: "
            + ", ".join(existing)
        )

    started_at = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    run_record = {
        "schema_version": "kt-final-test-run-record/1.0.0",
        "run_id": run_id,
        "status": "RUNNING",
        "reason": reason.strip(),
        "started_at_utc": started_at,
        "protocol_version": config["protocol_version"],
        "authorization_sha256": sha256_file(authorization_path),
        "config_sha256": sha256_file(config_path),
        "lock_sha256_before_evaluation": sha256_file(lock_path),
        "split_manifest_sha256_before_evaluation": sha256_file(split_path),
        "dataset_sha256": dataset_sha256,
        "attempt": 1,
    }
    write_json(run_record_path, run_record)
    output_root.mkdir(parents=True)

    development_users = set(map(int, split["development_user_ids"]))
    final_test_users = set(map(int, split["final_test_user_ids"]))
    if not development_users or not final_test_users or development_users & final_test_users:
        raise ValueError("Development and final-test users must be non-empty and disjoint")

    skills = skill_vocabulary(sequences)
    all_benchmark_users = development_users | final_test_users
    features = build_history_features(sequences, skills, all_benchmark_users)
    association = build_association_graph(
        sequences,
        skills,
        development_users,
        top_k=int(config["models"]["palnet"]["association_graph_top_k"]),
    )
    graph_path = output_root / "association_graph.npy"
    np.save(graph_path, association, allow_pickle=False)
    graph_sha256 = sha256_file(graph_path)

    summary = {
        "schema_version": "kt-final-test-result/1.0.0",
        "run_id": run_id,
        "created_at_utc": started_at,
        "protocol_version": config["protocol_version"],
        "scope": "FINAL_TEST_ONCE",
        "final_test_status": "EVALUATION_IN_PROGRESS",
        "reason": reason.strip(),
        "dataset_sha256": dataset_sha256,
        "config_sha256": sha256_file(config_path),
        "lock_sha256_before_evaluation": sha256_file(lock_path),
        "split_manifest_sha256_before_evaluation": sha256_file(split_path),
        "authorization_sha256": sha256_file(authorization_path),
        "association_graph_sha256": graph_sha256,
        "graph_train_scope": "development_users_only",
        "train_users": len(development_users),
        "test_users": len(final_test_users),
        "models": list(ALL_MODELS),
        "results": [],
    }
    artifact_manifest_path = output_root / "run_manifest.json"
    write_json(artifact_manifest_path, summary)
    reference_digest = None
    model_seed = int(config["seed"])

    try:
        for model_name in ALL_MODELS:
            model_dir = output_root / model_name
            model_dir.mkdir(parents=True)
            if model_name in ("global_rate", "skill_rate", "bkt"):
                result = run_classical_model(
                    model_name,
                    sequences,
                    development_users,
                    final_test_users,
                    config["models"][model_name],
                )
                write_json(model_dir / "parameters.json", result["parameters"])
                trained_epochs = None
            elif model_name == "dkt_lstm":
                trained_epochs = int(
                    lock["final_training_epochs_from_cv_median_best_epoch"][model_name]
                )
                result = train_dkt(
                    sequences,
                    development_users,
                    final_test_users,
                    skills,
                    config["models"]["dkt_lstm"],
                    model_dir,
                    model_seed,
                    fixed_epochs=trained_epochs,
                )
            else:
                trained_epochs = int(
                    lock["final_training_epochs_from_cv_median_best_epoch"][model_name]
                )
                result = train_palnet(
                    features,
                    development_users,
                    final_test_users,
                    association,
                    config["models"]["palnet"],
                    model_dir,
                    model_seed,
                    model_name=model_name,
                    use_graph=use_graph_for(model_name),
                    use_history=model_name != "palnet_no_history",
                    fixed_epochs=trained_epochs,
                )

            locked_threshold = float(lock["selected_f1_thresholds"][model_name])
            result["metrics"] = binary_metrics(
                result["labels"],
                result["probabilities"],
                f1_threshold=locked_threshold,
            )
            digest = _prediction_digest(result["event_ids"], result["labels"])
            if reference_digest is None:
                reference_digest = digest
            elif digest != reference_digest:
                raise RuntimeError(
                    f"Model {model_name} did not score the same final-test event/label pairs"
                )
            _write_predictions(model_dir / "final_test_predictions.csv.gz", result)
            model_record = {
                "model": model_name,
                "seed": model_seed,
                "train_users": len(development_users),
                "test_users": len(final_test_users),
                "trained_epochs": trained_epochs,
                "selection_mode": (
                    "fixed_epochs_from_locked_cv" if trained_epochs is not None else "train_only_fit"
                ),
                "event_label_sha256": digest,
                "association_graph_sha256": graph_sha256 if use_graph_for(model_name) else None,
                "metrics": result["metrics"],
                "inference_seconds": result.get("inference_seconds"),
            }
            write_json(model_dir / "result.json", model_record)
            summary["results"].append(model_record)
            write_json(artifact_manifest_path, summary)
    except Exception:
        run_record["status"] = "FAILED_TECHNICAL_NO_RETUNING_ALLOWED"
        run_record["failed_at_utc"] = datetime.now(timezone.utc).isoformat().replace(
            "+00:00", "Z"
        )
        run_record["completed_models"] = [row["model"] for row in summary["results"]]
        write_json(run_record_path, run_record)
        raise

    summary["final_test_status"] = "EVALUATED_ONCE"
    summary["completed_at_utc"] = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    summary["event_label_sha256"] = reference_digest
    write_json(artifact_manifest_path, summary)
    write_json(final_result_path, summary)
    run_record["status"] = "COMPLETED_EVALUATED_ONCE"
    run_record["completed_at_utc"] = summary["completed_at_utc"]
    run_record["final_result_sha256"] = sha256_file(final_result_path)
    run_record["artifact_manifest_sha256"] = sha256_file(artifact_manifest_path)
    write_json(run_record_path, run_record)
    return final_result_path


def use_graph_for(model_name: str) -> bool:
    return model_name in ("palnet", "palnet_no_history")


def parse_indices(value: str) -> tuple[int, ...]:
    return tuple(int(part.strip()) for part in value.split(",") if part.strip())


def parse_models(value: str) -> tuple[str, ...]:
    return tuple(part.strip() for part in value.split(",") if part.strip())


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Leakage-safe ASSISTments KT benchmark with an authorization-gated final test."
    )
    parser.add_argument(
        "--config",
        type=Path,
        default=SERVICE_ROOT / "configs/knowledge_tracing/assistments_g2.json",
    )
    subparsers = parser.add_subparsers(dest="command", required=True)
    prepare_parser = subparsers.add_parser("prepare", help="Create and validate the sealed user split")
    prepare_parser.add_argument("--force", action="store_true")
    dev_parser = subparsers.add_parser("dev", help="Run development folds only")
    dev_parser.add_argument("--models", type=parse_models, default=ALL_MODELS)
    dev_parser.add_argument("--folds", type=parse_indices, default=(0, 1, 2, 3, 4))
    dev_parser.add_argument(
        "--run-id",
        default=datetime.now(timezone.utc).strftime("dev-%Y%m%dT%H%M%SZ"),
    )
    final_parser = subparsers.add_parser(
        "final",
        help="Run the authorization-gated held-out final test exactly once",
    )
    final_parser.add_argument(
        "--lock",
        type=Path,
        default=SERVICE_ROOT
        / "data/external/assistments_2009_2010/g2_selected_config_lock.json",
    )
    final_parser.add_argument("--authorization", type=Path, required=True)
    final_parser.add_argument("--run-id", required=True)
    final_parser.add_argument("--reason", required=True)
    args = parser.parse_args()
    config_path = args.config.resolve()
    if args.command == "prepare":
        print(prepare(config_path, force=args.force))
    elif args.command == "dev":
        print(
            run_development(
                config_path,
                models=args.models,
                folds=args.folds,
                run_id=args.run_id,
            )
        )
    elif args.command == "final":
        print(
            run_final_test(
                config_path,
                lock_path=args.lock.resolve(),
                authorization_path=args.authorization.resolve(),
                run_id=args.run_id,
                reason=args.reason,
            )
        )


if __name__ == "__main__":
    main()
