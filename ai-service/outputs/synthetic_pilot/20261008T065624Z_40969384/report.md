# Synthetic pilot: DKT / PAL-Net train-test run

## Scope

- Dataset: 40 simulated learners, 1,552 interactions; 10 learners per persona.
- Split by learner (no learner overlap): 24 train / 8 validation / 8 test.
- Scored only steps `t >= 2`; each held-out prediction uses that learner's prior history.
- Training: maximum 8 epochs; selected by validation log loss (DKT epoch 8, PAL-Net epoch 5).
- Dataset SHA-256: `40969384fe86f98d5f32a96d48cb7a873119c6350ff989598d3f982301391fbf`.
- Checkpoints are explicitly `pilot_only`; neither is eligible for production serving.

## Test results

| Model | Events | ROC-AUC | Accuracy | Log loss | Brier |
|---|---:|---:|---:|---:|---:|
| Train-rate baseline | 309 | 0.500 | 0.560 | 0.688 | 0.247 |
| DKT | 309 | 0.592 | 0.570 | 0.679 | 0.243 |
| PAL-Net | 309 | 0.637 | 0.621 | 0.663 | 0.235 |

Test labels: 173 correct and 136 incorrect. PAL-Net was better than the constant train-rate baseline on the reported ranking and probability metrics. DKT improved ROC-AUC and log loss over baseline, while its accuracy gain was small. These are descriptive results from one synthetic split and one seed, not evidence of real-world learning benefit or a reliable model ranking.

## Verification

- Feature/data gate: PASS; 40 learners and expected persona counts; chronological and feature constraints checked before training.
- Checkpoint reload: PASS for both DKT and PAL-Net using strict state-dict loading; offline forward inference returned finite probabilities.
- Checkpoint files: `dkt_pilot.pt`, `palnet_pilot.pt`.
- Full metrics, split IDs, and provenance: `report.json`.

## Verdict

The 40-learner synthetic experiment completed and is usable as a technical train/validation/test pipeline demonstration. It is still a small synthetic pilot: do not present it as validation of educational effectiveness, and do not deploy these checkpoints. A defensible model-comparison claim would need real/appropriately licensed data, repeated learner-level splits or cross-validation, and uncertainty estimates.
