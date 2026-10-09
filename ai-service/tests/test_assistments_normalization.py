import csv
import gzip
import importlib.util
import json
import tempfile
import unittest
from pathlib import Path


MODULE_PATH = (
    Path(__file__).resolve().parents[1]
    / "scripts"
    / "normalize_assistments_2009_2010.py"
)
SPEC = importlib.util.spec_from_file_location("assistments_normalizer", MODULE_PATH)
normalizer = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(normalizer)


FIELDNAMES = [
    "",
    "order_id",
    "user_id",
    "problem_id",
    "original",
    "correct",
    "skill_id",
    "attempt_count",
    "hint_count",
]


class AssistmentsNormalizationTests(unittest.TestCase):
    def _write_fixture(self, path: Path) -> None:
        rows = [
            # User 10: two valid events with a tied order_id; problem_id breaks tie.
            ["1", "100", "10", "20", "1", "1", "3", "1", "0"],
            ["2", "100", "10", "19", "1", "0", "4", "5", "3"],
            # Duplicate student-problem: later order is removed.
            ["3", "101", "10", "20", "1", "0", "3", "2", "1"],
            # User 11 is removed because only one eligible event remains.
            ["4", "200", "11", "30", "1", "1", "5", "1", "0"],
            # Mutually exclusive early filters.
            ["5", "300", "12", "40", "1", "2", "6", "1", "0"],
            ["6", "301", "12", "41", "0", "1", "6", "1", "0"],
            ["7", "302", "12", "42", "1", "1", "NA", "1", "0"],
            ["8", "303", "10", "43", "1", "1", "6_7", "1", "0"],
            ["9", "", "12", "44", "1", "1", "6", "1", "0"],
            # User 13 supplies another retained two-event sequence.
            ["10", "400", "13", "50", "1", "1", "8", "1", "0"],
            ["11", "401", "13", "51", "1", "0", "8", "1", "0"],
        ]
        with path.open("w", encoding="utf-8", newline="") as handle:
            writer = csv.writer(handle, lineterminator="\n")
            writer.writerow(FIELDNAMES)
            writer.writerows(rows)

    def _run(self, root: Path, suffix: str = ""):
        source = root / "source.csv"
        output = root / f"main{suffix}.csv.gz"
        multiskill_output = root / f"multiskill{suffix}.csv.gz"
        manifest = root / f"manifest{suffix}.json"
        report = root / f"report{suffix}.json"
        result = normalizer.normalize_dataset(
            input_path=source,
            output_path=output,
            multiskill_output_path=multiskill_output,
            manifest_path=manifest,
            report_path=report,
            retrieved_at="2026-10-06",
            generated_at="2026-10-06T00:00:00Z",
        )
        with gzip.open(output, "rt", encoding="utf-8", newline="") as handle:
            rows = list(csv.DictReader(handle))
        with gzip.open(
            multiskill_output, "rt", encoding="utf-8", newline=""
        ) as handle:
            multiskill_rows = list(csv.DictReader(handle))
        return result, rows, multiskill_rows, output, manifest, report

    def test_filters_orders_and_marks_only_events_with_history_as_scored(self):
        with tempfile.TemporaryDirectory() as temporary_directory:
            root = Path(temporary_directory)
            self._write_fixture(root / "source.csv")
            manifest, rows, multiskill_rows, _, _, report_path = self._run(root)

            self.assertEqual([row["user_id"] for row in rows], ["10", "10", "13", "13"])
            self.assertEqual([row["problem_id"] for row in rows[:2]], ["19", "20"])
            self.assertEqual([row["sequence_index"] for row in rows], ["0", "1", "0", "1"])
            self.assertEqual([row["is_scored_event"] for row in rows], ["0", "1", "0", "1"])
            self.assertTrue(all(row["correct"] in {"0", "1"} for row in rows))
            self.assertEqual(len({row["event_id"] for row in rows}), len(rows))

            counts = manifest["counts"]
            self.assertEqual(counts["source_rows"], 11)
            self.assertEqual(counts["rows_duplicate_student_problem"], 1)
            self.assertEqual(counts["rows_removed_short_sequence"], 1)
            self.assertEqual(counts["rows_multi_skill"], 1)
            self.assertEqual(counts["main_history_events"], 4)
            self.assertEqual(counts["main_scored_events"], 2)
            self.assertEqual(counts["order_id_tie_groups"], 1)
            encoded_multi_skill_rows = [
                row for row in multiskill_rows if row["problem_id"] == "43"
            ]
            self.assertEqual(len(encoded_multi_skill_rows), 1)
            self.assertEqual(
                json.loads(encoded_multi_skill_rows[0]["skill_ids"]), ["6", "7"]
            )
            self.assertEqual(
                manifest["counts"]["multiskill_events_with_multiple_skills"], 1
            )
            self.assertEqual(
                json.loads(report_path.read_text(encoding="utf-8"))["counts"], counts
            )

    def test_output_is_byte_deterministic_for_the_same_source(self):
        with tempfile.TemporaryDirectory() as temporary_directory:
            root = Path(temporary_directory)
            self._write_fixture(root / "source.csv")
            first, _, _, first_output, _, _ = self._run(root, "-first")
            second, _, _, second_output, _, _ = self._run(root, "-second")

            self.assertEqual(
                normalizer.sha256_file(first_output),
                normalizer.sha256_file(second_output),
            )
            self.assertEqual(
                first["artifacts"]["main_events"]["sha256"],
                second["artifacts"]["main_events"]["sha256"],
            )

    def test_current_answer_and_post_answer_fields_are_not_features(self):
        normalizer.assert_no_current_answer_in_features()
        for forbidden in normalizer.ANSWER_DERIVED_SOURCE_COLUMNS:
            self.assertNotIn(forbidden, normalizer.MODEL_FEATURE_COLUMNS)
        with self.assertRaisesRegex(ValueError, "CURRENT_ANSWER_FEATURE_LEAKAGE"):
            normalizer.assert_no_current_answer_in_features(("skill_id", "correct"))

    def test_pinned_checksum_mismatch_aborts_before_outputs(self):
        with tempfile.TemporaryDirectory() as temporary_directory:
            root = Path(temporary_directory)
            source = root / "source.csv"
            self._write_fixture(source)
            output = root / "main.csv.gz"
            with self.assertRaisesRegex(ValueError, "SOURCE_CHECKSUM_MISMATCH"):
                normalizer.normalize_dataset(
                    input_path=source,
                    output_path=output,
                    multiskill_output_path=root / "multiskill.csv.gz",
                    manifest_path=root / "manifest.json",
                    report_path=root / "report.json",
                    retrieved_at="2026-10-06",
                    expected_sha256="0" * 64,
                )
            self.assertFalse(output.exists())


if __name__ == "__main__":
    unittest.main()
