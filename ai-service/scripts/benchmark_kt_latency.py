from __future__ import annotations

import argparse
import json
import platform
import statistics
import sys
import time
from pathlib import Path

import numpy as np
import torch
from torch.utils.data import DataLoader, TensorDataset


SERVICE_ROOT = Path(__file__).resolve().parents[1]
if str(SERVICE_ROOT) not in sys.path:
    sys.path.insert(0, str(SERVICE_ROOT))

from app.knowledge_tracing.benchmark.data import (  # noqa: E402
    build_history_features,
    iter_events,
    load_event_sequences,
    sha256_file,
    skill_vocabulary,
)
from app.knowledge_tracing.benchmark.models import (  # noqa: E402
    BKTModel,
    BKTParameters,
    ConstantRateModel,
    DKTModel,
    PALNetBenchmarkModel,
    SkillRateModel,
)
from app.knowledge_tracing.benchmark.training import DKTSequenceDataset, collate_dkt  # noqa: E402


RUN_ID = "final-g2-20261005T182731Z"
RUN_ROOT = SERVICE_ROOT / "artifacts/knowledge_tracing/assistments_g2" / RUN_ID
DATA_ROOT = SERVICE_ROOT / "data/external/assistments_2009_2010"
OUTPUT_PATH = DATA_ROOT / "g3_latency.json"
MODELS = ("global_rate", "skill_rate", "bkt", "dkt_lstm", "palnet", "palnet_no_graph", "palnet_no_history")


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def prepare_functions(sample_users: int) -> tuple[dict, dict, dict]:
    common_started = time.perf_counter()
    record = read_json(DATA_ROOT / "g2_final_test_run_record.json")
    if record["status"] != "COMPLETED_EVALUATED_ONCE":
        raise ValueError("Final checkpoint run was not completed")
    split = read_json(DATA_ROOT / "g2_split_manifest.json")
    if sha256_file(DATA_ROOT / "g2_split_manifest.json") != record["split_manifest_sha256_before_evaluation"]:
        raise ValueError("Split checksum mismatch")
    data_path = DATA_ROOT / "processed/main_events.csv.gz"
    sequences = load_event_sequences(data_path, record["dataset_sha256"])
    user_ids = sorted(split["development_user_ids"])[:sample_users]
    if len(user_ids) != sample_users or set(user_ids) & set(split["final_test_user_ids"]):
        raise ValueError("Latency sample is not contained in development users")
    subset = {user_id: sequences[user_id] for user_id in user_ids}
    scored_events = sum(event.is_scored_event for events in subset.values() for event in events)
    events = tuple(iter_events(subset, set(user_ids)))
    skills = skill_vocabulary(sequences)
    skill_to_index = {skill_id: index for index, skill_id in enumerate(skills)}
    features = build_history_features(subset, skills)
    adjacency = torch.from_numpy(np.load(RUN_ROOT / "association_graph.npy")).float()
    common_preparation_seconds = time.perf_counter() - common_started
    functions = {}
    preparation_seconds = {}
    metadata = {}

    for model_name in MODELS:
        started = time.perf_counter()
        model_dir = RUN_ROOT / model_name
        if model_name in {"global_rate", "skill_rate", "bkt"}:
            parameters = read_json(model_dir / "parameters.json")
            if model_name == "global_rate":
                model = ConstantRateModel(float(parameters["probability"]))
                functions[model_name] = lambda model=model: model.predict(events)
            elif model_name == "skill_rate":
                model = SkillRateModel(
                    float(parameters["global_probability"]),
                    {int(key): float(value) for key, value in parameters["probabilities"].items()},
                )
                functions[model_name] = lambda model=model: model.predict(events)
            else:
                model = BKTModel(BKTParameters(
                    {int(key): float(value) for key, value in parameters["initial_by_skill"].items()},
                    float(parameters["learn"]), float(parameters["guess"]), float(parameters["slip"]),
                ))
                functions[model_name] = lambda model=model: model.predict_sequences(subset, user_ids)[2]
            metadata[model_name] = {"batch_size": sample_users if model_name == "bkt" else len(events), "batch_unit": "learner_sequence" if model_name == "bkt" else "history_event", "model_artifact_sha256": sha256_file(model_dir / "parameters.json")}
        elif model_name == "dkt_lstm":
            checkpoint_path = model_dir / "checkpoint.pt"
            checkpoint = torch.load(checkpoint_path, map_location="cpu", weights_only=True)
            if checkpoint["model"] != model_name or checkpoint["skills"] != list(skills):
                raise ValueError("DKT checkpoint/skill vocabulary mismatch")
            config = checkpoint["config"]
            model = DKTModel(len(skills), int(config["embedding_dim"]), int(config["hidden_dim"]), float(config["dropout"]))
            model.load_state_dict(checkpoint["state_dict"])
            model.eval()
            dataset = DKTSequenceDataset(subset, user_ids, skill_to_index)
            batches = [
                (tokens, targets)
                for tokens, targets, _, _, _, _ in DataLoader(dataset, batch_size=int(config["batch_size"]), shuffle=False, collate_fn=collate_dkt)
            ]
            def dkt_infer(model=model, batches=batches):
                with torch.inference_mode():
                    return [torch.sigmoid(model(tokens).gather(2, targets.unsqueeze(-1)).squeeze(-1)) for tokens, targets in batches]
            functions[model_name] = dkt_infer
            metadata[model_name] = {"batch_size": int(config["batch_size"]), "batch_unit": "learner_sequence", "model_artifact_sha256": sha256_file(checkpoint_path)}
        else:
            checkpoint_path = model_dir / "checkpoint.pt"
            checkpoint = torch.load(checkpoint_path, map_location="cpu", weights_only=True)
            if checkpoint["model"] != model_name:
                raise ValueError(f"PAL-Net checkpoint mismatch: {model_name}")
            config = checkpoint["config"]
            model = PALNetBenchmarkModel(
                len(skills), int(config["skill_dim"]), int(config["history_dim"]),
                int(config["hidden_dim"]), float(config["dropout"]),
                use_graph=bool(checkpoint["use_graph"]), use_history=bool(checkpoint["use_history"]),
            )
            model.load_state_dict(checkpoint["state_dict"])
            model.eval()
            tensors = TensorDataset(
                torch.from_numpy(features.skill_indices),
                torch.from_numpy(features.summary),
                torch.from_numpy(features.mastery.astype(np.float32)),
            )
            batches = list(DataLoader(tensors, batch_size=int(config["batch_size"]), shuffle=False))
            def palnet_infer(model=model, batches=batches, adjacency=adjacency):
                with torch.inference_mode():
                    return [torch.sigmoid(model(targets, summary, mastery, adjacency)) for targets, summary, mastery in batches]
            functions[model_name] = palnet_infer
            metadata[model_name] = {"batch_size": int(config["batch_size"]), "batch_unit": "scored_event", "model_artifact_sha256": sha256_file(checkpoint_path)}
        preparation_seconds[model_name] = time.perf_counter() - started
    return functions, preparation_seconds, {"sample_users": sample_users, "sample_scored_events": scored_events, "common_data_preparation_seconds": common_preparation_seconds, "models": metadata, "dataset_sha256": record["dataset_sha256"], "split_sha256": record["split_manifest_sha256_before_evaluation"], "config_sha256": record["config_sha256"], "latency_script_sha256": sha256_file(Path(__file__))}


def run(sample_users: int, warmup: int, repeats: int) -> dict:
    if sample_users <= 0 or warmup < 1 or repeats < 2:
        raise ValueError("sample-users must be positive, warmup >=1, repeats >=2")
    torch.set_num_threads(4)
    functions, preparation_seconds, provenance = prepare_functions(sample_users)
    rows = {}
    for name in MODELS:
        function = functions[name]
        for _ in range(warmup):
            function()
        durations = []
        for _ in range(repeats):
            started = time.perf_counter()
            function()
            durations.append(time.perf_counter() - started)
        rows[name] = {
            "input_preparation_seconds": preparation_seconds[name],
            "warmup_runs": warmup,
            "timed_repeats": repeats,
            "model_only_seconds_by_repeat": durations,
            "model_only_median_seconds": float(statistics.median(durations)),
            "model_only_ms_per_1000_scored_events": float(statistics.median(durations) * 1e6 / provenance["sample_scored_events"]),
            **provenance["models"][name],
        }
    payload = {
        "schema_version": "kt-latency/1.0.0",
        "run_id": RUN_ID,
        "scope": "DEVELOPMENT_USERS_ONLY_FINAL_CHECKPOINT_INFERENCE",
        "device": "cpu",
        "torch_num_threads": torch.get_num_threads(),
        "processor": platform.processor(),
        "machine": platform.machine(),
        "operating_system": platform.platform(),
        "python": platform.python_version(),
        "numpy": np.__version__,
        "torch": torch.__version__,
        "timing": "perf_counter; prepared tensors/events and loaded weights outside repeat; CPU no synchronization needed",
        "provenance": provenance,
        "results": rows,
    }
    OUTPUT_PATH.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    return payload


def main() -> None:
    parser = argparse.ArgumentParser(description="Benchmark locked G2 models on development learner inputs")
    parser.add_argument("--sample-users", type=int, default=256)
    parser.add_argument("--warmup", type=int, default=2)
    parser.add_argument("--repeats", type=int, default=10)
    arguments = parser.parse_args()
    payload = run(arguments.sample_users, arguments.warmup, arguments.repeats)
    print(json.dumps({"output": str(OUTPUT_PATH), "users": payload["provenance"]["sample_users"], "events": payload["provenance"]["sample_scored_events"]}, indent=2))


if __name__ == "__main__":
    main()
