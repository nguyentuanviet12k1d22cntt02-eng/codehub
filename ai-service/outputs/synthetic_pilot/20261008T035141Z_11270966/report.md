# Synthetic pilot: technical-feasibility result

This is an offline test on **synthetic data**, not evidence of learning benefit or production readiness.

## Inputs and gate

- CSV: 386 interactions from 10 learners, 12 columns. SHA-256: `11270966a595c9557f961d35029422b874762d483f6618dbf808f63551135260`.
- The CSV was not regenerated or edited. Generator parameters were unchanged. The metadata `persona_breakdown` counting bug was corrected without changing interaction rows.
- Feature gate: **PASS for this offline pilot pipeline**. Seven isolated pilot tests passed; five existing benchmark-contract tests also passed.
- Fixed curriculum graph supplies the six known skill IDs and prerequisite edges. No vocabulary or scaler is fitted from validation/test users.
- Learner-level split: 6 train, 2 validation, 2 test. Persona labels are used only to stratify the split and report composition; they are not model inputs.
- Current-step correctness, submission count, completion time, hint use and persona are excluded from the model input. The prerequisite proxy is independently recomputed from earlier interactions and checked against every CSV row.
- Training and offline next-step inference call the same DKT token encoder and PAL-Net feature extractor. The first event of each learner is context only; both models are scored on steps 2 onward. Earlier observed outcomes of a held-out learner are available only for later predictions of that same learner.

## Held-out test (2 learners, 68 scored interactions)

| Model | AUC | Accuracy at 0.5 | Log loss | Brier |
| --- | ---: | ---: | ---: | ---: |
| Train-rate baseline | 0.500 | 0.559 | 0.689 | 0.248 |
| DKT | 0.505 | 0.456 | 0.711 | 0.259 |
| Profile-free PAL-Net pilot variant | 0.619 | 0.603 | 0.674 | 0.240 |

The small, single synthetic split makes all model comparisons unstable. DKT did not beat the baseline here. The PAL-Net variant did better on this split, but this is not a defensible claim of generalization to real learners.

The saved `.pt` files were reloaded with strict state-dict checks and produced finite next-step probabilities. They are labeled `pilot_only` and were **not** placed in the production serving registry or deployed.

For complete metrics, split IDs and configuration, see `report.json` in this directory. To reproduce the gate and offline run from `ai-service/`, use `python -m unittest tests.test_synthetic_pilot_gate` and `python scripts/run_synthetic_pilot.py --train --epochs 8`. A rerun creates a new timestamped output directory.
