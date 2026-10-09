import os
import json
import random
import datetime
import numpy as np
import pandas as pd

# Set fixed seed for reproducibility while ensuring realistic variance
np.random.seed(42)
random.seed(42)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUTPUT_CSV_PATH = os.path.join(BASE_DIR, "data", "synthetic_pilot_learners.csv")
OUTPUT_META_PATH = os.path.join(BASE_DIR, "data", "synthetic_pilot_10_learners_metadata.json")

# 1. Skill DAG Structure from LearnPython / MCODE
SKILL_DAG = {
    "PY-BASICS-01": {"name": "Cú pháp & Biến", "prereqs": []},
    "PY-BASICS-02": {"name": "Ép kiểu & Kiểu dữ liệu", "prereqs": ["PY-BASICS-01"]},
    "PY-BASICS-03": {"name": "Toán tử số học & Logic", "prereqs": ["PY-BASICS-01"]},
    "PY-FLOW-01":   {"name": "Điều kiện if-elif-else", "prereqs": ["PY-BASICS-03"]},
    "PY-FLOW-02":   {"name": "Vòng lặp while", "prereqs": ["PY-FLOW-01"]},
    "PY-FLOW-03":   {"name": "Vòng lặp for & range", "prereqs": ["PY-FLOW-01"]}
}

# Items pool per skill
ITEM_POOL = {
    "PY-BASICS-01": [
        {"item_id": "IT-B01-01", "difficulty": 1},
        {"item_id": "IT-B01-02", "difficulty": 1},
        {"item_id": "IT-B01-03", "difficulty": 1},
        {"item_id": "IT-B01-04", "difficulty": 2},
    ],
    "PY-BASICS-02": [
        {"item_id": "IT-B02-01", "difficulty": 1},
        {"item_id": "IT-B02-02", "difficulty": 2},
        {"item_id": "IT-B02-03", "difficulty": 2},
        {"item_id": "IT-B02-04", "difficulty": 3},
    ],
    "PY-BASICS-03": [
        {"item_id": "IT-B03-01", "difficulty": 1},
        {"item_id": "IT-B03-02", "difficulty": 2},
        {"item_id": "IT-B03-03", "difficulty": 2},
        {"item_id": "IT-B03-04", "difficulty": 3},
    ],
    "PY-FLOW-01": [
        {"item_id": "IT-F01-01", "difficulty": 2},
        {"item_id": "IT-F01-02", "difficulty": 2},
        {"item_id": "IT-F01-03", "difficulty": 2},
        {"item_id": "IT-F01-04", "difficulty": 3},
    ],
    "PY-FLOW-02": [
        {"item_id": "IT-F02-01", "difficulty": 2},
        {"item_id": "IT-F02-02", "difficulty": 3},
        {"item_id": "IT-F02-03", "difficulty": 3},
        {"item_id": "IT-F02-04", "difficulty": 3},
    ],
    "PY-FLOW-03": [
        {"item_id": "IT-F03-01", "difficulty": 2},
        {"item_id": "IT-F03-02", "difficulty": 2},
        {"item_id": "IT-F03-03", "difficulty": 3},
        {"item_id": "IT-F03-04", "difficulty": 3},
    ]
}

# 2. Persona Specifications (Calibrated Parameters strictly maintained)
PERSONA_CONFIGS = {
    "P-STRUGGLE": {
        "theta_mu": -0.4, "theta_sigma": 0.15,
        "beta": 0.45, "eta_novel": 0.8, "w_prereq": 1.2, "alpha_diff": 0.8,
        "w_hint": 0.6, "s": 0.10, "g": 0.12,
        "base_inspect": 60.0, "novel_boost": 50.0, "per_att": 35.0, "sigma_time": 0.25,
        "hint_prob": 0.60
    },
    "P-AVERAGE": {
        "theta_mu": 0.1, "theta_sigma": 0.15,
        "beta": 0.50, "eta_novel": 0.6, "w_prereq": 0.8, "alpha_diff": 0.6,
        "w_hint": 0.4, "s": 0.12, "g": 0.15,
        "base_inspect": 20.0, "novel_boost": 15.0, "per_att": 15.0, "sigma_time": 0.20,
        "hint_prob": 0.25
    },
    "P-FAST": {
        "theta_mu": 1.2, "theta_sigma": 0.15,
        "beta": 0.85, "eta_novel": 0.3, "w_prereq": 0.4, "alpha_diff": 0.4,
        "w_hint": 0.2, "s": 0.05, "g": 0.08,
        "base_inspect": 12.0, "novel_boost": 8.0, "per_att": 10.0, "sigma_time": 0.15,
        "hint_prob": 0.05
    },
    "P-ERRATIC": {
        "theta_mu": -0.2, "theta_sigma": 0.40,
        "beta": 0.05, "eta_novel": 0.2, "w_prereq": 0.1, "alpha_diff": 0.5,
        "w_hint": 0.0, "s": 0.25, "g": 0.25,
        "base_inspect": 5.0, "novel_boost": 2.0, "per_att": 4.0, "sigma_time": 0.35,
        "hint_prob": 0.0
    }
}

# Expanded cohort: 10 learners per persona. Persona generation parameters stay unchanged.
LEARNER_ROSTER = [
    {
        "user_id": f"syn_{prefix}_{learner_index:02d}",
        "persona": persona,
        "n_target": min_n + ((learner_index * 7 + persona_index * 3) % (max_n - min_n + 1)),
    }
    for persona_index, (persona, prefix, min_n, max_n) in enumerate((
        ("P-STRUGGLE", "struggle", 35, 45),
        ("P-AVERAGE", "average", 35, 45),
        ("P-FAST", "fast", 30, 40),
        ("P-ERRATIC", "erratic", 35, 45),
    ))
    for learner_index in range(1, 11)
]

def calculate_prereq_mastery_proxy(history_before_t, prereqs, decay_gamma=0.95):
    """
    Causal computation: strictly using interactions before step t.
    """
    if not prereqs:
        return 1.0
        
    mastery_scores = []
    for p in prereqs:
        p_acts = [h["is_correct"] for h in history_before_t if h["skill_id"] == p]
        if len(p_acts) == 0:
            mastery_scores.append(0.0)
        else:
            n = len(p_acts)
            weights = [decay_gamma ** (n - 1 - i) for i in range(n)]
            weighted_score = sum(w * c for w, c in zip(weights, p_acts)) / sum(weights)
            mastery_scores.append(weighted_score)
            
    return float(np.mean(mastery_scores))

def sample_attempts_count(persona, is_correct, difficulty, z_latent):
    if persona == "P-FAST":
        if is_correct == 1:
            return int(np.random.choice([1, 2, 3], p=[0.85, 0.12, 0.03]))
        else:
            return int(np.random.choice([1, 2, 3], p=[0.60, 0.30, 0.10]))

    elif persona == "P-ERRATIC":
        return int(np.random.choice([1, 2, 3], p=[0.75, 0.20, 0.05]))

    elif persona == "P-AVERAGE":
        if is_correct == 1:
            p_quick = 0.50 if difficulty == 1 else (0.25 if difficulty == 2 else 0.10)
            if np.random.rand() < p_quick:
                return int(np.random.choice([1, 2], p=[0.70, 0.30]))
            else:
                return int(np.clip(np.random.poisson(lam=3.5) + 1, 3, 7))
        else:
            if np.random.rand() < 0.35:
                return int(np.random.choice([1, 2], p=[0.60, 0.40]))
            else:
                return int(np.clip(np.random.poisson(lam=3.0) + 1, 3, 6))

    elif persona == "P-STRUGGLE":
        if is_correct == 1:
            if difficulty == 1 and z_latent > -0.2:
                return int(np.random.choice([1, 2, 3], p=[0.50, 0.35, 0.15]))
            else:
                return int(np.clip(np.random.poisson(lam=2.5) + 1, 2, 5))
        else:
            if np.random.rand() < 0.50:
                return int(np.random.choice([1, 2], p=[0.65, 0.35]))
            else:
                return int(np.clip(np.random.poisson(lam=2.2) + 1, 3, 5))

def sample_time_taken(cfg, difficulty, attempts, is_novel):
    diff_mult = 1.0 + 0.35 * (difficulty - 1)
    novel_add = cfg["novel_boost"] if is_novel else 0.0
    expected_mean = (cfg["base_inspect"] + novel_add + cfg["per_att"] * attempts) * diff_mult
    mu_log = np.log(expected_mean)
    sampled = float(np.random.lognormal(mu_log, cfg["sigma_time"]))
    return max(5.0, round(sampled, 1))

def generate_trajectory(learner_meta, base_datetime):
    user_id = learner_meta["user_id"]
    persona = learner_meta["persona"]
    n_target = learner_meta["n_target"]
    cfg = PERSONA_CONFIGS[persona]
    
    # Sample individual ability around persona mean
    theta_u = float(np.random.normal(cfg["theta_mu"], cfg["theta_sigma"]))
    
    curriculum = [
        "PY-BASICS-01", "PY-BASICS-02", "PY-BASICS-03",
        "PY-FLOW-01", "PY-FLOW-02", "PY-FLOW-03"
    ]
    
    history = []
    skill_practice_count = {sk: 0 for sk in curriculum}
    curr_time = base_datetime
    
    curr_skill_idx = 0
    items_in_curr_skill = 0
    
    for step in range(1, n_target + 1):
        # Progress along curriculum
        skill_id = curriculum[curr_skill_idx]
        prereqs = SKILL_DAG[skill_id]["prereqs"]
        
        # Select item from pool
        item_pool = ITEM_POOL[skill_id]
        item_obj = item_pool[items_in_curr_skill % len(item_pool)]
        item_id = item_obj["item_id"]
        difficulty = item_obj["difficulty"]
        
        # 1. Causal Prerequisite Mastery Proxy (strictly t' < t)
        prereq_proxy = calculate_prereq_mastery_proxy(history, prereqs)
        
        # 2. Practice and Novelty
        n_practice = skill_practice_count[skill_id]
        is_novel = (n_practice == 0)
        
        # 3. Hint usage
        hint_used = 0
        if np.random.rand() < cfg["hint_prob"]:
            hint_used = 1 if np.random.rand() < 0.75 else 2
            
        # 4. Latent performance score z
        ability = theta_u + cfg["beta"] * np.log(1 + n_practice)
        delta_diff = cfg["alpha_diff"] * (difficulty - 1)
        delta_novel = cfg["eta_novel"] if is_novel else 0.0
        delta_prereq = cfg["w_prereq"] * max(0.0, 0.7 - prereq_proxy)
        delta_hint = cfg["w_hint"] * min(hint_used, 2)
        
        z = ability - delta_diff - delta_novel - delta_prereq + delta_hint
        p_base = 1.0 / (1.0 + np.exp(-z))
        p_correct = cfg["g"] + (1.0 - cfg["g"] - cfg["s"]) * p_base
        
        # Sample binary outcome
        is_correct = 1 if np.random.rand() < p_correct else 0
        
        # 5. Conditional attempts and time
        attempts_count = sample_attempts_count(persona, is_correct, difficulty, z)
        time_taken = sample_time_taken(cfg, difficulty, attempts_count, is_novel)
        
        # Advance timestamp
        curr_time = curr_time + datetime.timedelta(seconds=time_taken + random.uniform(15, 60))
        # Add intermittent session break
        if step % 10 == 0:
            curr_time = curr_time + datetime.timedelta(hours=random.uniform(1.5, 4.0))
            
        record = {
            "user_id": user_id,
            "persona_group": persona,
            "step_index": step,
            "timestamp": curr_time.isoformat(),
            "skill_id": skill_id,
            "item_id": item_id,
            "difficulty": difficulty,
            "is_correct": is_correct,
            "attempts_count": attempts_count,
            "time_taken_seconds": time_taken,
            "hint_used": hint_used,
            "prereq_mastery_proxy": round(prereq_proxy, 4)
        }
        history.append(record)
        skill_practice_count[skill_id] += 1
        items_in_curr_skill += 1
        
        # Shift to next skill when practiced enough or target distribution
        min_practice = 5 if persona == "P-FAST" else (6 if persona == "P-AVERAGE" else 7)
        if items_in_curr_skill >= min_practice and curr_skill_idx < len(curriculum) - 1:
            curr_skill_idx += 1
            items_in_curr_skill = 0
            
    return history

def main():
    all_interactions = []
    base_time = datetime.datetime(2026, 10, 1, 8, 0, 0)
    
    for learner_meta in LEARNER_ROSTER:
        # Give each learner a slightly staggered starting time
        learner_start = base_time + datetime.timedelta(hours=random.uniform(0, 12))
        traj = generate_trajectory(learner_meta, learner_start)
        all_interactions.extend(traj)
        
    df = pd.DataFrame(all_interactions)
    df.to_csv(OUTPUT_CSV_PATH, index=False)
    print(f"Generated {len(df)} interactions across {len(LEARNER_ROSTER)} learners to {OUTPUT_CSV_PATH}")
    
    metadata = {
        "dataset_name": "LearnPython Synthetic Pilot Interaction Dataset (40 Learners)",
        "version": "2.0",
        "generated_at": datetime.datetime.now().isoformat(),
        "total_learners": len(LEARNER_ROSTER),
        "total_interactions": len(df),
        "provenance": {
            "DATA_TYPE": "SYNTHETIC",
            "SOURCE_OF_BEHAVIORAL_TEMPLATES": "Hân (Struggling template) / Thịnh (Average trial-and-error template)",
            "SOURCE_OF_PARAMETERS": "Synthetic assumptions calibrated by simulation",
            "REAL_LEARNER_DATA": "NOT USED AS TRAINING DATA",
            "PURPOSE": "Synthetic technical feasibility / pipeline validation / DKT & PAL-Net architecture check"
        },
        "persona_breakdown": {
            p: int(df.loc[df["persona_group"] == p, "user_id"].nunique())
            for p in df["persona_group"].unique()
        }
    }
    with open(OUTPUT_META_PATH, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2, ensure_ascii=False)
    print(f"Saved metadata to {OUTPUT_META_PATH}")

if __name__ == "__main__":
    main()
