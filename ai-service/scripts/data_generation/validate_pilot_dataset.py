import os
import json
import pandas as pd
import numpy as np

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CSV_PATH = os.path.join(BASE_DIR, "data", "synthetic_pilot_learners.csv")
META_PATH = os.path.join(BASE_DIR, "data", "synthetic_pilot_10_learners_metadata.json")

def run_validation():
    df = pd.read_csv(CSV_PATH)
    with open(META_PATH, "r", encoding="utf-8") as f:
        meta = json.load(f)
        
    print("=" * 60)
    print("       STEP 4: SYNTHETIC DATASET VALIDATION REPORT       ")
    print("=" * 60)
    
    # 1. Dataset-level Summary
    total_learners = df["user_id"].nunique()
    total_interactions = len(df)
    n_skills = df["skill_id"].nunique()
    n_items = df["item_id"].nunique()
    overall_correct = df["is_correct"].sum()
    overall_acc = df["is_correct"].mean()
    overall_err = 1.0 - overall_acc
    
    print("\n--- 1. DATASET-LEVEL SUMMARY ---")
    print(f"Total learners:        {total_learners}")
    print(f"Total interactions:    {total_interactions}")
    print(f"Interactions/learner:  min={df.groupby('user_id').size().min()}, max={df.groupby('user_id').size().max()}, mean={df.groupby('user_id').size().mean():.1f}")
    print(f"Total skills:          {n_skills} ({list(df['skill_id'].unique())})")
    print(f"Total items:           {n_items}")
    print(f"Overall Correct rate:  {overall_acc:.3f} ({overall_correct}/{total_interactions})")
    print(f"Overall Incorrect rate:{overall_err:.3f} ({total_interactions - overall_correct}/{total_interactions})")
    
    print("\nDifficulty Distribution:")
    diff_counts = df["difficulty"].value_counts().sort_index()
    for d, cnt in diff_counts.items():
        sub_acc = df[df["difficulty"] == d]["is_correct"].mean()
        print(f"  Difficulty {d}: {cnt:3d} ({cnt/total_interactions*100:.1f}%) | Acc: {sub_acc:.3f}")
        
    print("\nPersona Distribution:")
    persona_counts = df.groupby("persona_group")["user_id"].nunique()
    for p, cnt in persona_counts.items():
        p_ints = len(df[df["persona_group"] == p])
        p_acc = df[df["persona_group"] == p]["is_correct"].mean()
        print(f"  {p:12s}: {cnt} learners ({p_ints:3d} interactions, {p_ints/total_interactions*100:.1f}%) | Acc: {p_acc:.3f}")

    # 2. Learner-level Metrics
    print("\n--- 2. LEARNER-LEVEL METRICS ---")
    print(f"{'User ID':<18} {'Persona':<12} {'N_ints':<8} {'Acc':<8} {'Mean Att':<10} {'Mean Time(s)':<14} {'Acc 1st Half':<14} {'Acc 2nd Half':<14}")
    print("-" * 100)
    for uid, grp in df.groupby("user_id", sort=False):
        grp = grp.sort_values(by="step_index")
        persona = grp["persona_group"].iloc[0]
        n_ints = len(grp)
        acc = grp["is_correct"].mean()
        mean_att = grp["attempts_count"].mean()
        mean_time = grp["time_taken_seconds"].mean()
        
        half = n_ints // 2
        acc_1st = grp.iloc[:half]["is_correct"].mean()
        acc_2nd = grp.iloc[half:]["is_correct"].mean()
        
        print(f"{uid:<18} {persona:<12} {n_ints:<8} {acc:<8.3f} {mean_att:<10.2f} {mean_time:<14.1f} {acc_1st:<14.3f} {acc_2nd:<14.3f}")

    # 3. Trajectory-level Checks
    print("\n--- 3. TRAJECTORY-LEVEL CHECKS ---")
    # Check Novelty drop (first attempt at a skill vs later attempts)
    novel_df = df.groupby(["user_id", "skill_id"]).first()
    non_novel_df = df[~df.index.isin(novel_df.index)]
    print(f"First Encounter with a Skill Acc: {novel_df['is_correct'].mean():.3f}")
    print(f"Subsequent Practice with Skill Acc: {non_novel_df['is_correct'].mean():.3f}")
    print(f"Practice Gain (Diff):              {non_novel_df['is_correct'].mean() - novel_df['is_correct'].mean():+.3f}")

    # Check attempts count breakdown
    few_corr = len(df[(df["attempts_count"] <= 2) & (df["is_correct"] == 1)])
    many_corr = len(df[(df["attempts_count"] >= 3) & (df["is_correct"] == 1)])
    few_inc = len(df[(df["attempts_count"] <= 2) & (df["is_correct"] == 0)])
    many_inc = len(df[(df["attempts_count"] >= 3) & (df["is_correct"] == 0)])
    print("\nAttempts Count Matrix:")
    print(f"  Few attempts (<=2) + Correct:   {few_corr:3d} ({few_corr/total_interactions*100:.1f}%)")
    print(f"  Many attempts (>=3) + Correct:  {many_corr:3d} ({many_corr/total_interactions*100:.1f}%) [Trial-and-Error Success]")
    print(f"  Few attempts (<=2) + Incorrect: {few_inc:3d} ({few_inc/total_interactions*100:.1f}%) [Quick abandon/fail]")
    print(f"  Many attempts (>=3) + Incorrect:{many_inc:3d} ({many_inc/total_interactions*100:.1f}%) [Struggling Failure]")

    # 4. Artifact Inspection & Sanity Checks
    print("\n--- 4. ARTIFACT & SANITY CHECKS ---")
    # Non-positive time
    bad_time = (df["time_taken_seconds"] <= 0).sum()
    print(f"Non-positive time values:        {bad_time} (Pass: {bad_time == 0})")
    
    # Step index monotonic
    step_check = all(grp["step_index"].is_monotonic_increasing for _, grp in df.groupby("user_id"))
    print(f"Step index monotonically increasing: {step_check}")
    
    # Timestamps strictly increasing
    time_order_check = True
    for uid, grp in df.groupby("user_id"):
        ts_series = pd.to_datetime(grp["timestamp"])
        if not ts_series.is_monotonic_increasing:
            time_order_check = False
            break
    print(f"Timestamps strictly increasing:  {time_order_check}")
    
    # Prerequisite proxy range check
    prereq_range = (df["prereq_mastery_proxy"].min() >= 0.0) and (df["prereq_mastery_proxy"].max() <= 1.0)
    print(f"Prereq proxy in [0.0, 1.0]:      {prereq_range} (min={df['prereq_mastery_proxy'].min()}, max={df['prereq_mastery_proxy'].max()})")
    
    # Provenance check
    print(f"Provenance in metadata:          {meta.get('provenance') is not None}")

if __name__ == "__main__":
    run_validation()
