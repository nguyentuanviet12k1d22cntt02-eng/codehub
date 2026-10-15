"""Contracts for the self-contained notebook training workflow."""

from __future__ import annotations

import csv
import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
LANGUAGES = ("python", "javascript", "cpp")
DATA_ROOT = ROOT / "data" / "synthetic_history_real_items"
CATALOG_ROOT = ROOT / "data" / "real_exercise_catalog"
NOTEBOOK_ROOT = ROOT / "notebooks"
OUTPUT_ROOT = ROOT / "outputs" / "notebook_fair_kt"


class NotebookTrainingContractTests(unittest.TestCase):
    def test_real_items_and_simulated_history_are_labeled_correctly(self):
        for language in LANGUAGES:
            with self.subTest(language=language):
                metadata = json.loads(
                    (DATA_ROOT / f"{language}_metadata.json").read_text(encoding="utf-8")
                )
                catalog = json.loads(
                    (CATALOG_ROOT / f"{language}_items.json").read_text(encoding="utf-8")
                )
                item_ids = {item["item_id"] for item in catalog["items"]}
                self.assertTrue(metadata["real_exercise_data"])
                self.assertFalse(metadata["real_learner_data"])
                with (DATA_ROOT / f"{language}_history.csv").open(
                    encoding="utf-8", newline=""
                ) as handle:
                    rows = list(csv.DictReader(handle))
                self.assertTrue(rows)
                self.assertTrue(all(row["item_id"] in item_ids for row in rows))
                self.assertTrue(all(not row["item_id"].startswith("SYN-") for row in rows))

    def test_training_is_visible_and_executed_in_each_notebook(self):
        forbidden = ("train_one", "train_multilanguage_kt", "benchmark.training")
        required = (
            "class BKTModel",
            "def train_bkt",
            "class DKTModel",
            "def train_dkt",
            "class PALNet",
            "def train_pal",
            "Training BKT trực tiếp trong notebook",
            "Training DKT trực tiếp trong notebook",
            "Training PAL-Net trực tiếp trong notebook",
        )
        for language in LANGUAGES:
            with self.subTest(language=language):
                notebook = json.loads(
                    (NOTEBOOK_ROOT / f"train_{language}_models.ipynb").read_text(encoding="utf-8")
                )
                source = "\n".join(
                    "".join(cell.get("source", []))
                    for cell in notebook["cells"]
                    if cell.get("cell_type") == "code"
                )
                for marker in required:
                    self.assertIn(marker, source)
                for marker in forbidden:
                    self.assertNotIn(marker, source)

    def test_artifacts_confirm_notebook_training_and_common_test_labels(self):
        for language in LANGUAGES:
            for seed in (20261013, 20261014, 20261015):
                with self.subTest(language=language, seed=seed):
                    run = OUTPUT_ROOT / language / f"seed_{seed}"
                    report = json.loads((run / "report.json").read_text(encoding="utf-8"))
                    bkt = json.loads((run / "bkt_parameters.json").read_text(encoding="utf-8"))
                    dkt = json.loads((run / "dkt" / "train_log.json").read_text(encoding="utf-8"))
                    pal = json.loads((run / "palnet" / "train_log.json").read_text(encoding="utf-8"))
                    self.assertTrue(report["trained_in_notebook"])
                    self.assertTrue(bkt["trained_in_notebook"])
                    self.assertTrue(dkt["trained_in_notebook"])
                    self.assertTrue(pal["trained_in_notebook"])
                    with (run / "test_predictions.csv").open(encoding="utf-8", newline="") as handle:
                        rows = list(csv.DictReader(handle))
                    self.assertTrue(rows)
                    self.assertEqual(
                        set(rows[0]), {"event_id", "label", "BKT", "DKT", "PAL-Net"}
                    )


if __name__ == "__main__":
    unittest.main()
