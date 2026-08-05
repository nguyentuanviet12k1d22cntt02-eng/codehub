import numpy as np
import json
from scipy.optimize import minimize

class BKTModel:
    def __init__(self):
        self.params = {} # kc_id -> {p_l0, p_t, p_s, p_g}
        
    def _sequence_log_likelihood(self, obs, p_l0, p_t, p_s, p_g):
        log_like = 0.0
        mastery = p_l0
        for o in obs:
            p_correct = mastery * (1.0 - p_s) + (1.0 - mastery) * p_g
            p_obs = p_correct if o == 1 else (1.0 - p_correct)
            
            log_like += np.log(max(p_obs, 1e-9))
            
            # Bayes update
            if o == 1:
                m_updated = (mastery * (1.0 - p_s)) / max(p_correct, 1e-9)
            else:
                m_updated = (mastery * p_s) / max(1.0 - p_correct, 1e-9)
                
            # Transition
            mastery = m_updated + (1.0 - m_updated) * p_t
            
        return log_like

    def _negative_log_likelihood(self, theta, sequences):
        p_l0, p_t, p_s, p_g = theta
        total_nll = 0.0
        for seq in sequences:
            total_nll -= self._sequence_log_likelihood(seq, p_l0, p_t, p_s, p_g)
        return total_nll

    def fit_skill(self, sequences, init_params=[0.5, 0.1, 0.1, 0.2]):
        bounds = [(0.01, 0.95), (0.01, 0.50), (0.01, 0.30), (0.01, 0.40)]
        res = minimize(
            self._negative_log_likelihood, 
            x0=init_params, 
            args=(sequences,), 
            method='L-BFGS-B', 
            bounds=bounds
        )
        return res.x

    def fit(self, df):
        # Sort by user_id and timestamp
        df_sorted = df.sort_values(by=["user_id", "timestamp"])
        
        self.params = {}
        for kc_id, group in df_sorted.groupby("kc_id"):
            user_seqs = []
            for user_id, u_group in group.groupby("user_id"):
                user_seqs.append([int(x) for x in u_group["correct"].tolist()])
                
            print(f"Training BKT for skill: {kc_id} over {len(user_seqs)} sequences...")
            p_l0, p_t, p_s, p_g = self.fit_skill(user_seqs)
            self.params[kc_id] = {
                "p_l0": float(p_l0),
                "p_t": float(p_t),
                "p_s": float(p_s),
                "p_g": float(p_g)
            }
            print(f"  Result: p_l0={p_l0:.4f}, p_t={p_t:.4f}, p_s={p_s:.4f}, p_g={p_g:.4f}")

    def predict_mastery(self, obs, skill):
        if skill not in self.params:
            return 0.5
        
        p = self.params[skill]
        mastery = p["p_l0"]
        for o in obs:
            p_correct = mastery * (1.0 - p["p_s"]) + (1.0 - mastery) * p["p_g"]
            if o == 1:
                m_updated = (mastery * (1.0 - p["p_s"])) / max(p_correct, 1e-9)
            else:
                m_updated = (mastery * p["p_s"]) / max(1.0 - p_correct, 1e-9)
            mastery = m_updated + (1.0 - m_updated) * p["p_t"]
        return mastery

    def save(self, filepath):
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(self.params, f, indent=4)

    def load(self, filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            self.params = json.load(f)
