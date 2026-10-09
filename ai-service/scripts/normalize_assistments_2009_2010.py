"""Normalize the corrected ASSISTments 2009-2010 Skill Builder dataset.

The raw and normalized event files stay outside Git. The generated manifest and
report contain only schema, policy, checksums, and aggregate counts.
"""

from __future__ import annotations

import argparse
import csv
import gzip
import hashlib
import io
import json
import sqlite3
import tempfile
from math import ceil
from statistics import median
from datetime import datetime, timezone
from decimal import Decimal, InvalidOperation
from pathlib import Path
from typing import Iterable, Mapping, Sequence


POLICY_VERSION = "assistments-2009-2010-normalization/1.0.0"
DEFAULT_SOURCE_ENCODING = "cp1252"
OFFICIAL_PAGE_URL = (
    "https://sites.google.com/site/assistmentsdata/home/2009-2010-assistment-data/"
    "skill-builder-data-2009-2010"
)
OFFICIAL_FILE_URL = (
    "https://drive.google.com/file/d/1NNXHFRxcArrU0ZJSb9BIL56vmUt5FhlE/"
    "view?usp=sharing"
)
REQUIRED_SOURCE_COLUMNS = (
    "user_id",
    "order_id",
    "problem_id",
    "original",
    "correct",
    "skill_id",
)
NORMALIZED_COLUMNS = (
    "event_id",
    "user_id",
    "order_id",
    "problem_id",
    "skill_id",
    "correct",
    "sequence_index",
    "is_scored_event",
)
MULTISKILL_COLUMNS = (
    "event_id",
    "user_id",
    "order_id",
    "problem_id",
    "skill_ids",
    "skill_count",
    "correct",
    "sequence_index",
    "is_scored_event",
)
MODEL_FEATURE_COLUMNS = (
    "problem_id",
    "skill_id",
    "sequence_index",
)
LABEL_COLUMN = "correct"
ANSWER_DERIVED_SOURCE_COLUMNS = (
    "correct",
    "attempt_count",
    "ms_first_response",
    "hint_count",
    "hint_total",
    "overlap_time",
    "answer_id",
    "answer_text",
    "first_action",
    "bottom_hint",
    "opportunity",
    "opportunity_original",
)
MISSING_TOKENS = frozenset(("", "na", "nan", "none", "null"))


def assert_no_current_answer_in_features(
    feature_columns: Sequence[str] = MODEL_FEATURE_COLUMNS,
) -> None:
    """Fail if any current-event answer field is declared as a model feature."""

    forbidden = {LABEL_COLUMN, *ANSWER_DERIVED_SOURCE_COLUMNS}
    leaked = sorted(set(feature_columns).intersection(forbidden))
    if leaked:
        raise ValueError(f"CURRENT_ANSWER_FEATURE_LEAKAGE:{','.join(leaked)}")


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def _integer_identifier(value: object) -> str | None:
    text = "" if value is None else str(value).strip()
    if text.lower() in MISSING_TOKENS:
        return None
    try:
        number = Decimal(text)
    except InvalidOperation:
        return None
    if not number.is_finite() or number != number.to_integral_value() or number < 0:
        return None
    return str(int(number))


def _binary_value(value: object) -> int | None:
    normalized = _integer_identifier(value)
    if normalized not in {"0", "1"}:
        return None
    return int(normalized)


def _skill_ids(value: object) -> tuple[str, ...] | None:
    text = "" if value is None else str(value).strip()
    if text.lower() in MISSING_TOKENS:
        return None
    parts = tuple(_integer_identifier(part) for part in text.split("_"))
    if not parts or any(part is None for part in parts):
        return None
    return tuple(dict.fromkeys(part for part in parts if part is not None))


def _event_id(
    source_sha256: str,
    source_row_number: int,
    user_id: str,
    order_id: str,
    problem_id: str,
) -> str:
    identity = (
        f"{source_sha256}|{source_row_number}|{user_id}|{order_id}|{problem_id}"
    )
    return "assist09_" + hashlib.sha256(identity.encode("utf-8")).hexdigest()[:32]


def _create_schema(connection: sqlite3.Connection) -> None:
    connection.executescript(
        """
        PRAGMA journal_mode = OFF;
        PRAGMA synchronous = OFF;
        PRAGMA temp_store = FILE;

        CREATE TABLE candidates (
            source_row_number INTEGER PRIMARY KEY,
            event_id TEXT NOT NULL UNIQUE,
            user_id TEXT NOT NULL,
            user_id_number INTEGER NOT NULL,
            order_id TEXT NOT NULL,
            order_id_number INTEGER NOT NULL,
            problem_id TEXT NOT NULL,
            problem_id_number INTEGER NOT NULL,
            skill_id TEXT NOT NULL,
            correct INTEGER NOT NULL CHECK (correct IN (0, 1))
        );

        CREATE TABLE multiskill_candidates (
            source_row_number INTEGER PRIMARY KEY,
            event_id TEXT NOT NULL UNIQUE,
            user_id TEXT NOT NULL,
            user_id_number INTEGER NOT NULL,
            order_id TEXT NOT NULL,
            order_id_number INTEGER NOT NULL,
            problem_id TEXT NOT NULL,
            problem_id_number INTEGER NOT NULL,
            skill_ids TEXT NOT NULL,
            skill_count INTEGER NOT NULL CHECK (skill_count >= 1),
            correct INTEGER NOT NULL CHECK (correct IN (0, 1))
        );
        """
    )


def _insert_candidates(
    connection: sqlite3.Connection,
    input_path: Path,
    source_sha256: str,
    source_encoding: str,
) -> tuple[dict[str, int], list[str]]:
    counts = {
        "source_rows": 0,
        "rows_invalid_identifiers": 0,
        "rows_invalid_correct": 0,
        "rows_non_original_or_invalid_original": 0,
        "rows_missing_or_invalid_skill": 0,
        "rows_multi_skill": 0,
        "rows_single_skill_candidates": 0,
    }
    batch: list[tuple[object, ...]] = []
    multiskill_batch: list[tuple[object, ...]] = []

    with input_path.open("r", encoding=source_encoding, newline="") as source:
        reader = csv.DictReader(source)
        source_columns = list(reader.fieldnames or ())
        missing_columns = sorted(set(REQUIRED_SOURCE_COLUMNS) - set(source_columns))
        if missing_columns:
            raise ValueError(
                "MISSING_REQUIRED_SOURCE_COLUMNS:" + ",".join(missing_columns)
            )

        for source_row_number, row in enumerate(reader, start=1):
            counts["source_rows"] += 1
            user_id = _integer_identifier(row.get("user_id"))
            order_id = _integer_identifier(row.get("order_id"))
            problem_id = _integer_identifier(row.get("problem_id"))
            if user_id is None or order_id is None or problem_id is None:
                counts["rows_invalid_identifiers"] += 1
                continue

            correct = _binary_value(row.get("correct"))
            if correct is None:
                counts["rows_invalid_correct"] += 1
                continue

            original = _binary_value(row.get("original"))
            if original != 1:
                counts["rows_non_original_or_invalid_original"] += 1
                continue

            skill_ids = _skill_ids(row.get("skill_id"))
            if skill_ids is None:
                counts["rows_missing_or_invalid_skill"] += 1
                continue

            event_id = _event_id(
                source_sha256,
                source_row_number,
                user_id,
                order_id,
                problem_id,
            )
            base_values = (
                source_row_number,
                event_id,
                user_id,
                int(user_id),
                order_id,
                int(order_id),
                problem_id,
                int(problem_id),
            )
            multiskill_batch.append(
                (
                    *base_values,
                    json.dumps(skill_ids, separators=(",", ":")),
                    len(skill_ids),
                    correct,
                )
            )
            if len(multiskill_batch) >= 10_000:
                connection.executemany(
                    "INSERT INTO multiskill_candidates VALUES "
                    "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    multiskill_batch,
                )
                multiskill_batch.clear()

            if len(skill_ids) != 1:
                counts["rows_multi_skill"] += 1
                continue

            batch.append(
                (
                    *base_values,
                    skill_ids[0],
                    correct,
                )
            )
            counts["rows_single_skill_candidates"] += 1

            if len(batch) >= 10_000:
                connection.executemany(
                    "INSERT INTO candidates VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    batch,
                )
                batch.clear()

    if batch:
        connection.executemany(
            "INSERT INTO candidates VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", batch
        )
    if multiskill_batch:
        connection.executemany(
            "INSERT INTO multiskill_candidates VALUES "
            "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            multiskill_batch,
        )
    connection.commit()
    return counts, source_columns


def _prepare_main_events(
    connection: sqlite3.Connection, counts: dict[str, int]
) -> None:
    connection.executescript(
        """
        CREATE INDEX candidates_student_problem
            ON candidates(user_id_number, problem_id_number);

        CREATE TABLE deduplicated AS
        SELECT source_row_number, event_id, user_id, user_id_number,
               order_id, order_id_number, problem_id, problem_id_number,
               skill_id, correct
        FROM (
            SELECT candidates.*,
                   ROW_NUMBER() OVER (
                       PARTITION BY user_id, problem_id
                       ORDER BY order_id_number, problem_id_number, event_id
                   ) AS duplicate_rank
            FROM candidates
        ) ranked
        WHERE duplicate_rank = 1;

        CREATE INDEX deduplicated_order
            ON deduplicated(
                user_id_number, order_id_number, problem_id_number, event_id
            );

        CREATE TABLE eligible_learners AS
        SELECT user_id, COUNT(*) AS event_count
        FROM deduplicated
        GROUP BY user_id
        HAVING COUNT(*) >= 2;

        CREATE UNIQUE INDEX eligible_learner_id ON eligible_learners(user_id);

        CREATE INDEX multiskill_candidates_student_problem
            ON multiskill_candidates(user_id_number, problem_id_number);

        CREATE TABLE multiskill_deduplicated AS
        SELECT source_row_number, event_id, user_id, user_id_number,
               order_id, order_id_number, problem_id, problem_id_number,
               skill_ids, skill_count, correct
        FROM (
            SELECT multiskill_candidates.*,
                   ROW_NUMBER() OVER (
                       PARTITION BY user_id, problem_id
                       ORDER BY order_id_number, problem_id_number, event_id
                   ) AS duplicate_rank
            FROM multiskill_candidates
        ) ranked
        WHERE duplicate_rank = 1;

        CREATE INDEX multiskill_deduplicated_order
            ON multiskill_deduplicated(
                user_id_number, order_id_number, problem_id_number, event_id
            );

        CREATE TABLE multiskill_eligible_learners AS
        SELECT user_id, COUNT(*) AS event_count
        FROM multiskill_deduplicated
        GROUP BY user_id
        HAVING COUNT(*) >= 2;

        CREATE UNIQUE INDEX multiskill_eligible_learner_id
            ON multiskill_eligible_learners(user_id);
        """
    )
    candidate_count = connection.execute("SELECT COUNT(*) FROM candidates").fetchone()[0]
    deduplicated_count = connection.execute(
        "SELECT COUNT(*) FROM deduplicated"
    ).fetchone()[0]
    learner_count = connection.execute(
        "SELECT COUNT(DISTINCT user_id) FROM deduplicated"
    ).fetchone()[0]
    eligible_learner_count = connection.execute(
        "SELECT COUNT(*) FROM eligible_learners"
    ).fetchone()[0]
    short_sequence_rows = connection.execute(
        """
        SELECT COALESCE(SUM(event_count), 0)
        FROM (
            SELECT COUNT(*) AS event_count
            FROM deduplicated
            GROUP BY user_id
            HAVING COUNT(*) < 2
        ) short_sequences
        """
    ).fetchone()[0]
    tie_groups, tie_rows = connection.execute(
        """
        SELECT COUNT(*), COALESCE(SUM(tie_count), 0)
        FROM (
            SELECT COUNT(*) AS tie_count
            FROM deduplicated d
            JOIN eligible_learners e USING (user_id)
            GROUP BY d.user_id, d.order_id
            HAVING COUNT(*) > 1
        ) ties
        """
    ).fetchone()
    multiskill_candidate_count = connection.execute(
        "SELECT COUNT(*) FROM multiskill_candidates"
    ).fetchone()[0]
    multiskill_deduplicated_count = connection.execute(
        "SELECT COUNT(*) FROM multiskill_deduplicated"
    ).fetchone()[0]
    multiskill_learner_count = connection.execute(
        "SELECT COUNT(DISTINCT user_id) FROM multiskill_deduplicated"
    ).fetchone()[0]
    multiskill_eligible_learner_count = connection.execute(
        "SELECT COUNT(*) FROM multiskill_eligible_learners"
    ).fetchone()[0]
    multiskill_short_sequence_rows = connection.execute(
        """
        SELECT COALESCE(SUM(event_count), 0)
        FROM (
            SELECT COUNT(*) AS event_count
            FROM multiskill_deduplicated
            GROUP BY user_id
            HAVING COUNT(*) < 2
        ) short_sequences
        """
    ).fetchone()[0]
    main_sequence_lengths = [
        row[0]
        for row in connection.execute(
            "SELECT event_count FROM eligible_learners ORDER BY event_count"
        )
    ]
    multiskill_sequence_lengths = [
        row[0]
        for row in connection.execute(
            "SELECT event_count FROM multiskill_eligible_learners "
            "ORDER BY event_count"
        )
    ]

    def sequence_summary(prefix: str, lengths: list[int]) -> dict[str, int | float]:
        if not lengths:
            return {}
        return {
            f"{prefix}_sequence_min": lengths[0],
            f"{prefix}_sequence_median": median(lengths),
            f"{prefix}_sequence_p90_nearest_rank": lengths[ceil(0.9 * len(lengths)) - 1],
            f"{prefix}_sequence_max": lengths[-1],
        }

    counts.update(
        {
            "rows_duplicate_student_problem": candidate_count - deduplicated_count,
            "learners_after_deduplication": learner_count,
            "learners_removed_short_sequence": learner_count
            - eligible_learner_count,
            "rows_removed_short_sequence": short_sequence_rows,
            "order_id_tie_groups": tie_groups,
            "rows_in_order_id_ties": tie_rows,
            "multiskill_rows_candidates": multiskill_candidate_count,
            "multiskill_rows_duplicate_student_problem": (
                multiskill_candidate_count - multiskill_deduplicated_count
            ),
            "multiskill_learners_after_deduplication": multiskill_learner_count,
            "multiskill_learners_removed_short_sequence": (
                multiskill_learner_count - multiskill_eligible_learner_count
            ),
            "multiskill_rows_removed_short_sequence": (
                multiskill_short_sequence_rows
            ),
        }
    )
    counts.update(sequence_summary("main", main_sequence_lengths))
    counts.update(sequence_summary("multiskill", multiskill_sequence_lengths))


def _write_deterministic_gzip(
    connection: sqlite3.Connection,
    output_path: Path,
    counts: dict[str, int],
) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    temporary_output = output_path.with_name(output_path.name + ".tmp")
    users: set[str] = set()
    skills: set[str] = set()
    problems: set[str] = set()
    labels = {0: 0, 1: 0}
    scored_labels = {0: 0, 1: 0}
    previous_user: str | None = None
    previous_order_key: tuple[int, int, str] | None = None
    sequence_index = -1
    emitted_rows = 0

    query = """
        SELECT d.event_id, d.user_id, d.order_id, d.order_id_number,
               d.problem_id, d.problem_id_number, d.skill_id, d.correct
        FROM deduplicated d
        JOIN eligible_learners e USING (user_id)
        ORDER BY d.user_id_number, d.order_id_number,
                 d.problem_id_number, d.event_id
    """

    try:
        with temporary_output.open("wb") as binary_output:
            with gzip.GzipFile(
                fileobj=binary_output, mode="wb", filename="", mtime=0
            ) as compressed_output:
                with io.TextIOWrapper(
                    compressed_output, encoding="utf-8", newline=""
                ) as text_output:
                    writer = csv.DictWriter(
                        text_output,
                        fieldnames=NORMALIZED_COLUMNS,
                        lineterminator="\n",
                    )
                    writer.writeheader()
                    for (
                        event_id,
                        user_id,
                        order_id,
                        order_id_number,
                        problem_id,
                        problem_id_number,
                        skill_id,
                        correct,
                    ) in connection.execute(query):
                        order_key = (order_id_number, problem_id_number, event_id)
                        if user_id != previous_user:
                            previous_user = user_id
                            previous_order_key = None
                            sequence_index = 0
                            users.add(user_id)
                        else:
                            sequence_index += 1
                        if previous_order_key is not None and order_key <= previous_order_key:
                            raise AssertionError("NON_INCREASING_NORMALIZED_ORDER")
                        previous_order_key = order_key

                        writer.writerow(
                            {
                                "event_id": event_id,
                                "user_id": user_id,
                                "order_id": order_id,
                                "problem_id": problem_id,
                                "skill_id": skill_id,
                                "correct": correct,
                                "sequence_index": sequence_index,
                                "is_scored_event": int(sequence_index > 0),
                            }
                        )
                        emitted_rows += 1
                        skills.add(skill_id)
                        problems.add(problem_id)
                        labels[correct] += 1
                        if sequence_index > 0:
                            scored_labels[correct] += 1
        temporary_output.replace(output_path)
    finally:
        if temporary_output.exists():
            temporary_output.unlink()

    counts.update(
        {
            "main_history_events": emitted_rows,
            "main_scored_events": emitted_rows - len(users),
            "main_learners": len(users),
            "main_skills": len(skills),
            "main_problems": len(problems),
            "main_label_0": labels[0],
            "main_label_1": labels[1],
            "main_scored_label_0": scored_labels[0],
            "main_scored_label_1": scored_labels[1],
        }
    )


def _write_multiskill_gzip(
    connection: sqlite3.Connection,
    output_path: Path,
    counts: dict[str, int],
) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    temporary_output = output_path.with_name(output_path.name + ".tmp")
    users: set[str] = set()
    skills: set[str] = set()
    labels = {0: 0, 1: 0}
    scored_labels = {0: 0, 1: 0}
    previous_user: str | None = None
    previous_order_key: tuple[int, int, str] | None = None
    sequence_index = -1
    emitted_rows = 0
    emitted_multi_skill_rows = 0

    query = """
        SELECT d.event_id, d.user_id, d.order_id, d.order_id_number,
               d.problem_id, d.problem_id_number, d.skill_ids,
               d.skill_count, d.correct
        FROM multiskill_deduplicated d
        JOIN multiskill_eligible_learners e USING (user_id)
        ORDER BY d.user_id_number, d.order_id_number,
                 d.problem_id_number, d.event_id
    """

    try:
        with temporary_output.open("wb") as binary_output:
            with gzip.GzipFile(
                fileobj=binary_output, mode="wb", filename="", mtime=0
            ) as compressed_output:
                with io.TextIOWrapper(
                    compressed_output, encoding="utf-8", newline=""
                ) as text_output:
                    writer = csv.DictWriter(
                        text_output,
                        fieldnames=MULTISKILL_COLUMNS,
                        lineterminator="\n",
                    )
                    writer.writeheader()
                    for (
                        event_id,
                        user_id,
                        order_id,
                        order_id_number,
                        problem_id,
                        problem_id_number,
                        skill_ids_json,
                        skill_count,
                        correct,
                    ) in connection.execute(query):
                        order_key = (order_id_number, problem_id_number, event_id)
                        if user_id != previous_user:
                            previous_user = user_id
                            previous_order_key = None
                            sequence_index = 0
                            users.add(user_id)
                        else:
                            sequence_index += 1
                        if previous_order_key is not None and order_key <= previous_order_key:
                            raise AssertionError("NON_INCREASING_MULTISKILL_ORDER")
                        previous_order_key = order_key

                        writer.writerow(
                            {
                                "event_id": event_id,
                                "user_id": user_id,
                                "order_id": order_id,
                                "problem_id": problem_id,
                                "skill_ids": skill_ids_json,
                                "skill_count": skill_count,
                                "correct": correct,
                                "sequence_index": sequence_index,
                                "is_scored_event": int(sequence_index > 0),
                            }
                        )
                        emitted_rows += 1
                        emitted_multi_skill_rows += int(skill_count > 1)
                        skills.update(json.loads(skill_ids_json))
                        labels[correct] += 1
                        if sequence_index > 0:
                            scored_labels[correct] += 1
        temporary_output.replace(output_path)
    finally:
        if temporary_output.exists():
            temporary_output.unlink()

    counts.update(
        {
            "multiskill_history_events": emitted_rows,
            "multiskill_scored_events": emitted_rows - len(users),
            "multiskill_learners": len(users),
            "multiskill_unique_skills": len(skills),
            "multiskill_events_with_multiple_skills": emitted_multi_skill_rows,
            "multiskill_label_0": labels[0],
            "multiskill_label_1": labels[1],
            "multiskill_scored_label_0": scored_labels[0],
            "multiskill_scored_label_1": scored_labels[1],
        }
    )


def _write_json(path: Path, payload: Mapping[str, object]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary_path = path.with_name(path.name + ".tmp")
    temporary_path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    temporary_path.replace(path)


def _manifest_relative_path(path: Path, manifest_path: Path) -> str:
    try:
        return path.resolve().relative_to(manifest_path.parent.resolve()).as_posix()
    except ValueError:
        return str(path.resolve())


def normalize_dataset(
    input_path: Path,
    output_path: Path,
    multiskill_output_path: Path,
    manifest_path: Path,
    report_path: Path,
    retrieved_at: str,
    expected_sha256: str | None = None,
    generated_at: str | None = None,
    source_encoding: str = DEFAULT_SOURCE_ENCODING,
) -> dict[str, object]:
    """Normalize one pinned raw file and return the generated manifest."""

    assert_no_current_answer_in_features()
    if not input_path.is_file():
        raise FileNotFoundError(input_path)
    source_sha256 = sha256_file(input_path)
    if expected_sha256 and source_sha256.lower() != expected_sha256.lower():
        raise ValueError(
            f"SOURCE_CHECKSUM_MISMATCH:expected={expected_sha256.lower()}:"
            f"actual={source_sha256.lower()}"
        )

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(
        prefix="assistments-normalize-",
        suffix=".sqlite3",
        dir=output_path.parent,
        delete=False,
    ) as database_file:
        database_path = Path(database_file.name)

    try:
        connection = sqlite3.connect(database_path)
        try:
            _create_schema(connection)
            counts, source_columns = _insert_candidates(
                connection, input_path, source_sha256, source_encoding
            )
            _prepare_main_events(connection, counts)
            _write_deterministic_gzip(connection, output_path, counts)
            _write_multiskill_gzip(connection, multiskill_output_path, counts)
        finally:
            connection.close()
    finally:
        if database_path.exists():
            database_path.unlink()

    normalized_sha256 = sha256_file(output_path)
    multiskill_sha256 = sha256_file(multiskill_output_path)
    generation_time = generated_at or datetime.now(timezone.utc).isoformat().replace(
        "+00:00", "Z"
    )
    report = {
        "schema_version": "assistments-normalization-report/1.0.0",
        "policy_version": POLICY_VERSION,
        "counts": counts,
        "ordering": ["order_id", "problem_id", "event_id"],
        "duplicate_identity": ["user_id", "problem_id"],
        "short_sequence_policy": (
            "Remove learners with fewer than two eligible events; retain the first "
            "event of remaining learners as unscored history initialization."
        ),
        "multi_skill_policy": (
            "Exclude collapsed multi-skill rows from the main dataset. Preserve one "
            "row with a JSON skill-id array in the extension; never expand one answer "
            "into multiple events."
        ),
    }
    _write_json(report_path, report)

    manifest = {
        "schema_version": "assistments-data-manifest/1.0.0",
        "dataset": "ASSISTments 2009-2010 Skill Builder corrected collapsed",
        "generated_at_utc": generation_time,
        "source": {
            "official_page_url": OFFICIAL_PAGE_URL,
            "official_file_url": OFFICIAL_FILE_URL,
            "file_name": input_path.name,
            "retrieved_at": retrieved_at,
            "size_bytes": input_path.stat().st_size,
            "sha256": source_sha256,
            "encoding": source_encoding,
            "source_columns": source_columns,
        },
        "usage_conditions": {
            "official_instruction": (
                "Publications using the dataset must include the precise official "
                "dataset page URL and cite the ASSISTments reference listed there."
            ),
            "license_status": (
                "No explicit license was displayed on the official dataset page at "
                "retrieval; raw data is not committed or redistributed by this repo."
            ),
            "redistribution_policy": "raw-and-normalized-event-files-gitignored",
        },
        "normalization": {
            "policy_version": POLICY_VERSION,
            "script": "ai-service/scripts/normalize_assistments_2009_2010.py",
            "required_source_columns": list(REQUIRED_SOURCE_COLUMNS),
            "output_columns": list(NORMALIZED_COLUMNS),
            "multiskill_output_columns": list(MULTISKILL_COLUMNS),
            "model_feature_columns": list(MODEL_FEATURE_COLUMNS),
            "label_column": LABEL_COLUMN,
            "excluded_from_model_features": list(
                ANSWER_DERIVED_SOURCE_COLUMNS
            ),
            "grouping_columns": ["user_id"],
            "ordering_only_columns": ["order_id", "event_id"],
            "filters_in_order": [
                "valid user_id/order_id/problem_id",
                "binary correct",
                "original == 1",
                "exactly one numeric skill_id",
                "first row by order_id/problem_id/event_id per user_id/problem_id",
                "at least two remaining events per learner",
            ],
            "within_learner_order": ["order_id", "problem_id", "event_id"],
            "sequence_index_base": 0,
            "scoring_policy": "sequence_index > 0",
            "no_current_answer_in_features": True,
        },
        "artifacts": {
            "main_events": {
                "path": _manifest_relative_path(output_path, manifest_path),
                "format": "csv.gz",
                "size_bytes": output_path.stat().st_size,
                "sha256": normalized_sha256,
            },
            "multiskill_events": {
                "path": _manifest_relative_path(
                    multiskill_output_path, manifest_path
                ),
                "format": "csv.gz",
                "skill_ids_encoding": "JSON array in one event row",
                "size_bytes": multiskill_output_path.stat().st_size,
                "sha256": multiskill_sha256,
            },
            "normalization_report": {
                "path": _manifest_relative_path(report_path, manifest_path)
            },
        },
        "counts": counts,
    }
    _write_json(manifest_path, manifest)
    return manifest


def _default_paths() -> tuple[Path, Path, Path, Path, Path]:
    service_root = Path(__file__).resolve().parents[1]
    dataset_root = service_root / "data" / "external" / "assistments_2009_2010"
    return (
        dataset_root / "raw" / "skill_builder_data_corrected_collapsed.csv",
        dataset_root / "processed" / "main_events.csv.gz",
        dataset_root / "processed" / "multiskill_events.csv.gz",
        dataset_root / "data_manifest.json",
        dataset_root / "normalization_report.json",
    )


def parse_args(argv: Iterable[str] | None = None) -> argparse.Namespace:
    (
        default_input,
        default_output,
        default_multiskill_output,
        default_manifest,
        default_report,
    ) = _default_paths()
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, default=default_input)
    parser.add_argument("--output", type=Path, default=default_output)
    parser.add_argument(
        "--multiskill-output", type=Path, default=default_multiskill_output
    )
    parser.add_argument("--manifest", type=Path, default=default_manifest)
    parser.add_argument("--report", type=Path, default=default_report)
    parser.add_argument(
        "--retrieved-at",
        required=True,
        help="ISO date or timestamp recorded when the raw file was retrieved.",
    )
    parser.add_argument(
        "--expected-sha256",
        help="Optional pinned checksum; normalization aborts on mismatch.",
    )
    parser.add_argument(
        "--source-encoding",
        default=DEFAULT_SOURCE_ENCODING,
        help="Raw CSV encoding (observed official corrected file: cp1252).",
    )
    return parser.parse_args(argv)


def main(argv: Iterable[str] | None = None) -> int:
    args = parse_args(argv)
    manifest = normalize_dataset(
        input_path=args.input,
        output_path=args.output,
        multiskill_output_path=args.multiskill_output,
        manifest_path=args.manifest,
        report_path=args.report,
        retrieved_at=args.retrieved_at,
        expected_sha256=args.expected_sha256,
        source_encoding=args.source_encoding,
    )
    print(json.dumps(manifest["counts"], sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
