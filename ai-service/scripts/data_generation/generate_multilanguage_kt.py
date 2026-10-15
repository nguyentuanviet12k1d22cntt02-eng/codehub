"""Generate synthetic learning histories over real product exercises.

Exercise IDs, titles, lesson codes and difficulties come from the product database.
Learners, outcomes, times, mistakes and trajectories remain simulated; they are not
product telemetry.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import math
import random
from collections import Counter, defaultdict
from datetime import datetime, timedelta
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "data" / "synthetic_history_real_items"
CATALOG_ROOT = ROOT / "data" / "real_exercise_catalog"
GRAPHS = {
    "python": ROOT / "data" / "pythonSkillGraph.json",
    "javascript": ROOT / "data" / "javascriptSkillGraph.json",
    "cpp": ROOT / "data" / "cppSkillGraph.json",
}
FIELDS = (
    "user_id", "persona_group", "step_index", "timestamp", "language",
    "skill_id", "item_id", "item_title", "lesson_code", "item_source",
    "difficulty", "is_correct", "attempt_index", "time_taken_seconds",
    "error_type", "prereq_mastery_proxy",
)
PERSONAS = {
    "NEW": {"ability": -0.80, "learning": 0.35, "persistence": 0.63},
    "STEADY": {"ability": -0.30, "learning": 0.53, "persistence": 0.85},
    "TRIAL_ERROR": {"ability": 0.05, "learning": 0.39, "persistence": 0.75},
    "FAST": {"ability": 0.75, "learning": 0.62, "persistence": 0.68},
    "RETURNING": {"ability": 0.30, "learning": 0.44, "persistence": 0.78},
}
LANGUAGE_MISTAKES = {
    "python": {"PY-BASICS-02": "TYPE_ERROR", "PY-FLOW-02": "TIMEOUT",
               "PY-DICT-02": "KEY_ERROR", "PY-STRING-01": "INDEX_ERROR"},
    "javascript": {"JS-COERCE-01": "COERCION_ERROR", "JS-SCOPE-01": "SCOPE_ERROR",
                   "JS-EXEC-01": "HOISTING_ERROR", "JS-CLOSURE-01": "CLOSURE_ERROR",
                   "JS-THIS-01": "THIS_BINDING_ERROR", "JS-ARRAY-HOF-01": "ARRAY_METHOD_ERROR"},
    "cpp": {"CPP-TYPE-01": "TYPE_ERROR", "CPP-PTR-01": "POINTER_ERROR",
            "CPP-MEM-01": "LIFETIME_ERROR", "CPP-VECTOR-01": "BOUNDS_ERROR",
            "CPP-BUILD-01": "ITERATOR_ERROR", "CPP-SMARTPTR-01": "OWNERSHIP_ERROR"},
}


def ordered_graph(path: Path) -> tuple[list[str], dict[str, tuple[str, ...]], dict]:
    graph = json.loads(path.read_text(encoding="utf-8"))
    ids = [skill["id"] for skill in graph["skills"]]
    if len(ids) != len(set(ids)):
        raise ValueError("Duplicate skill ID")
    parents: dict[str, list[str]] = {skill: [] for skill in ids}
    for edge in graph["edges"]:
        if edge["source"] not in parents or edge["target"] not in parents:
            raise ValueError("Graph edge references unknown skill")
        parents[edge["target"]].append(edge["source"])
    remaining = set(ids)
    order: list[str] = []
    while remaining:
        ready = [skill for skill in ids if skill in remaining and set(parents[skill]) <= set(order)]
        if not ready:
            raise ValueError("Skill graph contains a cycle")
        order.extend(ready)
        remaining.difference_update(ready)
    return order, {skill: tuple(parents[skill]) for skill in ids}, graph


def prior_mastery(history: list[dict], skill: str) -> float:
    outcomes = [row["is_correct"] for row in history if row["skill_id"] == skill]
    return (sum(outcomes) + 1) / (len(outcomes) + 2) if outcomes else 0.35


def load_real_catalog(language: str) -> tuple[Path, dict, dict[str, list[dict]]]:
    path = CATALOG_ROOT / f"{language}_items.json"
    catalog = json.loads(path.read_text(encoding="utf-8"))
    if catalog.get("language") != language or catalog.get("data_origin") != "REAL_PRODUCT_CATALOG":
        raise ValueError(f"Invalid real exercise catalog: {path}")
    items_by_skill: dict[str, list[dict]] = defaultdict(list)
    seen_ids: set[str] = set()
    for item in catalog.get("items", []):
        required = ("item_id", "item_title", "lesson_code", "item_source", "difficulty", "skill_ids")
        if any(key not in item for key in required) or item["item_id"] in seen_ids:
            raise ValueError(f"Invalid or duplicate catalog item in {path}")
        if item["item_source"] != "CODING_EXERCISE_DB" or item["difficulty"] not in (1, 2, 3):
            raise ValueError(f"Unsupported catalog item in {path}")
        seen_ids.add(item["item_id"])
        for skill in item["skill_ids"]:
            items_by_skill[str(skill)].append(item)
    if not items_by_skill:
        raise ValueError(f"Catalog has no skill-mapped items: {path}")
    return path, catalog, dict(items_by_skill)


def project_parents(
    order: list[str], parents: dict[str, tuple[str, ...]], covered: set[str],
) -> dict[str, tuple[str, ...]]:
    """Connect a covered skill to its nearest covered graph ancestors."""
    cache: dict[str, tuple[str, ...]] = {}

    def nearest(skill: str) -> tuple[str, ...]:
        if skill in cache:
            return cache[skill]
        result: list[str] = []
        for parent in parents[skill]:
            if parent in covered:
                result.append(parent)
            else:
                result.extend(nearest(parent))
        cache[skill] = tuple(dict.fromkeys(result))
        return cache[skill]

    return {skill: nearest(skill) for skill in order if skill in covered}


def generate_learner(
    language: str, learner_number: int, persona: str, order: list[str],
    parents: dict[str, tuple[str, ...]], items_by_skill: dict[str, list[dict]],
    rng: random.Random,
) -> list[dict]:
    cfg = PERSONAS[persona]
    user_id = f"syn_{language}_{persona.lower()}_{learner_number:02d}"
    ability = rng.gauss(cfg["ability"], 0.32)
    learning = max(0.15, rng.gauss(cfg["learning"], 0.08))
    misconception = {skill: rng.uniform(0.25, 0.75) for skill in rng.sample(order, k=4)}
    history: list[dict] = []
    exposure: Counter[str] = Counter()
    last_seen: dict[str, datetime] = {}
    current = datetime(2026, 1, 5, 8, 0) + timedelta(days=rng.randrange(0, 30), hours=rng.randrange(0, 9))
    session_length = rng.randrange(6, 12)
    # Python's graph has 35 skills; the smaller JS/C++ graphs need fewer steps.
    total_steps = rng.randrange(92, 121) if language == "python" else rng.randrange(48, 71)
    retry_item: tuple[str, dict, int] | None = None

    for step in range(1, total_steps + 1):
        if step > 1 and (step - 1) % session_length == 0:
            current += timedelta(days=rng.choice((1, 1, 2, 3, 5, 8)), hours=rng.randrange(0, 5))
            session_length = rng.randrange(6, 12)

        if retry_item is not None:
            skill, item, attempt_index = retry_item
            retry_item = None
        else:
            seen = [skill for skill in order if exposure[skill] > 0]
            frontier = [skill for skill in order if exposure[skill] == 0 and all(exposure[parent] > 0 for parent in parents[skill])]
            if seen and (not frontier or rng.random() < 0.27):
                skill = rng.choice(seen[-min(9, len(seen)):])
            elif frontier:
                skill = rng.choice(frontier[:min(4, len(frontier))])
            else:
                skill = order[0]
            item = rng.choice(items_by_skill[skill])
            attempt_index = 1

        difficulty = int(item["difficulty"])

        prior = [prior_mastery(history, parent) for parent in parents[skill]]
        prereq_proxy = sum(prior) / len(prior) if prior else 1.0
        days_away = (current - last_seen[skill]).total_seconds() / 86400 if skill in last_seen else 0.0
        forgetting = min(0.65, 0.16 * math.log1p(days_away)) if exposure[skill] else 0.0
        transfer = 0.26 if persona == "RETURNING" and skill in order[:max(3, len(order) // 4)] else 0.0
        retry_gain = 0.40 if attempt_index > 1 else 0.0
        score = (
            ability + transfer + learning * math.log1p(exposure[skill]) + retry_gain
            - 0.43 * (difficulty - 1) - 0.23 * (exposure[skill] == 0)
            - forgetting - misconception.get(skill, 0.0)
        )
        probability = min(0.89, max(0.12, 0.08 + 0.84 / (1 + math.exp(-score))))
        correct = int(rng.random() < probability)
        if correct:
            error = "NONE"
        else:
            error = rng.choices(
                (LANGUAGE_MISTAKES[language].get(skill, "WRONG_ANSWER"), "WRONG_ANSWER", "SYNTAX_ERROR"),
                weights=(5, 3, 2), k=1,
            )[0]
        base_seconds = 32 + 28 * difficulty + 16 * (exposure[skill] == 0)
        seconds = max(8, round(rng.lognormvariate(math.log(base_seconds), 0.38), 1))
        if persona == "STEADY":
            seconds = round(seconds * 1.18, 1)
        if persona == "FAST":
            seconds = round(seconds * 0.78, 1)
        current += timedelta(seconds=seconds + rng.randrange(15, 85))
        row = {
            "user_id": user_id, "persona_group": persona, "step_index": step,
            "timestamp": current.isoformat(), "language": language, "skill_id": skill,
            "item_id": item["item_id"], "item_title": item["item_title"],
            "lesson_code": item["lesson_code"], "item_source": item["item_source"],
            "difficulty": difficulty, "is_correct": correct, "attempt_index": attempt_index,
            "time_taken_seconds": seconds,
            "error_type": error, "prereq_mastery_proxy": round(prereq_proxy, 4),
        }
        history.append(row)
        exposure[skill] += 1
        last_seen[skill] = current
        if not correct and attempt_index < 3 and rng.random() < cfg["persistence"]:
            retry_item = (skill, item, attempt_index + 1)
    return history


def generate(language: str, seed: int = 20261013, learners_per_persona: int = 12) -> tuple[Path, Path]:
    if learners_per_persona < 4:
        raise ValueError("Need at least four learners per persona for grouped splits")
    graph_path = GRAPHS[language]
    full_order, graph_parents, graph = ordered_graph(graph_path)
    catalog_path, catalog, items_by_skill = load_real_catalog(language)
    unknown_skills = set(items_by_skill).difference(full_order)
    if unknown_skills:
        raise ValueError(f"Catalog references unknown skills: {sorted(unknown_skills)}")
    order = [skill for skill in full_order if skill in items_by_skill]
    parents = project_parents(full_order, graph_parents, set(order))
    if not order:
        raise ValueError(f"No graph skills have real exercises for {language}")
    rng = random.Random(seed + {"python": 0, "javascript": 1, "cpp": 2}[language])
    rows = [
        row
        for persona in PERSONAS
        for learner in range(1, learners_per_persona + 1)
        for row in generate_learner(language, learner, persona, order, parents, items_by_skill, rng)
    ]
    OUTPUT.mkdir(parents=True, exist_ok=True)
    csv_path = OUTPUT / f"{language}_history.csv"
    metadata_path = OUTPUT / f"{language}_metadata.json"
    with csv_path.open("w", encoding="utf-8", newline="") as target:
        writer = csv.DictWriter(target, fieldnames=FIELDS)
        writer.writeheader()
        writer.writerows(rows)
    metadata = {
        "schema_version": "synthetic-history-real-items/1.0", "language": language,
        "data_origin": "SYNTHETIC_HISTORY_REAL_ITEMS", "real_learner_data": False,
        "real_exercise_data": True,
        "purpose": "Offline BKT/DKT/PAL-Net pipeline comparison; not evidence of learner benefit",
        "source_graph": graph_path.name, "graph_version": graph.get("version"),
        "graph_sha256": hashlib.sha256(graph_path.read_bytes()).hexdigest(),
        "source_catalog": catalog_path.name,
        "catalog_schema_version": catalog["schema_version"],
        "catalog_sha256": hashlib.sha256(catalog_path.read_bytes()).hexdigest(),
        "dataset_sha256": hashlib.sha256(csv_path.read_bytes()).hexdigest(),
        "seed": seed, "learners": learners_per_persona * len(PERSONAS),
        "interactions": len(rows), "skills_in_graph": len(full_order),
        "skills_with_real_items": len(order),
        "skills_observed": len({row["skill_id"] for row in rows}),
        "catalog_items": len(catalog["items"]),
        "items_observed": len({row["item_id"] for row in rows}),
        "persona_counts": {persona: learners_per_persona for persona in PERSONAS},
        "field_notes": {
            "item_id": "Actual CodingExercise UUID exported read-only from the product database",
            "item_title": "Actual CodingExercise title from the product database",
            "lesson_code": "Actual stable lesson code from the product database",
            "item_source": "CODING_EXERCISE_DB means the item exists in the product database",
            "error_type": "Simulated mistake category; not inferred from source code or actual submissions",
            "prereq_mastery_proxy": "Pre-attempt estimate from earlier rows only; not true mastery",
            "attempt_index": "Simulated repeated attempt on the same real catalog item",
        },
        "limitations": [
            "Learner identities, histories, outcomes, time and error types are simulated",
            "Behavioral parameters are assumptions rather than estimates from real users",
            "Curriculum order follows the graph, but prerequisite mastery is not used to generate correctness",
            "No hint interaction is simulated because the product does not expose a hint action",
            "Real exercise IDs do not make the simulated histories real telemetry",
            "These results cannot establish pedagogical efficacy or production readiness",
        ],
    }
    metadata_path.write_text(json.dumps(metadata, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return csv_path, metadata_path


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--language", choices=(*GRAPHS, "all"), default="all")
    parser.add_argument("--seed", type=int, default=20261013)
    args = parser.parse_args()
    for language in GRAPHS if args.language == "all" else (args.language,):
        csv_path, metadata_path = generate(language, seed=args.seed)
        print(f"{language}: {csv_path} | {metadata_path}")


if __name__ == "__main__":
    main()
