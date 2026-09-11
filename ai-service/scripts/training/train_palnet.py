import os
import sys
import json
import torch
import torch.nn as nn
import torch.optim as optim
import pandas as pd
import numpy as np
from torch.utils.data import Dataset, DataLoader

# Ensure core directory is in target
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

from core.palnet import PALNet

DATA_PATH = os.path.join(BASE_DIR, "data", "mock_user_history.csv")
SKILL_PATH = os.path.join(BASE_DIR, "data", "skill_graph.json")
OUT_MODEL_PATH = os.path.join(BASE_DIR, "data", "palnet_model.pth")

class PALNetDataset(Dataset):
    def __init__(self, df, kc_to_idx, num_skills):
        self.samples = []
        
        # Sort by user and timestamp
        df_sorted = df.sort_values(by=["user_id", "timestamp"])
        
        profile_map = {"STRUGGLING": 0, "AVERAGE": 1, "EXCELLENT": 2}
        
        for user_id, group in df_sorted.groupby("user_id"):
            profile_str = group["profile"].iloc[0]
            profile_idx = profile_map.get(profile_str, 1)
            
            # Initialize running states for this user
            attempts = np.zeros(num_skills)
            corrects = np.zeros(num_skills)
            raw_masteries = np.full(num_skills, 0.5) # start at 0.5
            
            kc_list = group["kc_id"].tolist()
            correct_list = group["correct"].tolist()
            
            for t in range(len(kc_list)):
                target_kc = kc_list[t]
                target_kc_idx = kc_to_idx[target_kc]
                target_correct = correct_list[t]
                
                # We save the features *before* updating with the current interaction
                stats = np.zeros(num_skills * 2)
                for k in range(num_skills):
                    stats[k * 2] = attempts[k]
                    stats[k * 2 + 1] = corrects[k] / attempts[k] if attempts[k] > 0 else 0.0
                    
                self.samples.append({
                    "target_kc_idx": target_kc_idx,
                    "learner_stats": stats.copy(),
                    "profile_idx": profile_idx,
                    "raw_masteries": raw_masteries.copy(),
                    "label": float(target_correct)
                })
                
                # Update running states with the current interaction outcomes
                attempts[target_kc_idx] += 1
                if target_correct == 1:
                    corrects[target_kc_idx] += 1
                    
                # Update raw masteries via EMA (exponential moving average)
                alpha = 0.3
                raw_masteries[target_kc_idx] = (1 - alpha) * raw_masteries[target_kc_idx] + alpha * target_correct
                
    def __len__(self):
        return len(self.samples)
        
    def __getitem__(self, idx):
        s = self.samples[idx]
        return (
            torch.tensor(s["target_kc_idx"], dtype=torch.long),
            torch.tensor(s["learner_stats"], dtype=torch.float),
            torch.tensor(s["profile_idx"], dtype=torch.long),
            torch.tensor(s["raw_masteries"], dtype=torch.float),
            torch.tensor(s["label"], dtype=torch.float)
        )

def main():
    if not os.path.exists(DATA_PATH) or not os.path.exists(SKILL_PATH):
        print("Required CSV or JSON skill graph files not found.")
        return
        
    with open(SKILL_PATH, "r", encoding="utf-8") as f:
        skill_graph = json.load(f)
        
    skills = [s["id"] for s in skill_graph["skills"]]
    num_skills = len(skills)
    kc_to_idx = {kc: idx for idx, kc in enumerate(skills)}
    
    # 1. Build AJD matrix
    adj = torch.zeros(num_skills, num_skills)
    for edge in skill_graph["edges"]:
        u = kc_to_idx[edge["source"]]
        v = kc_to_idx[edge["target"]]
        adj[u, v] = 1.0
        adj[v, u] = 1.0 # Symmetric graph convolution
        
    df = pd.read_csv(DATA_PATH)
    dataset = PALNetDataset(df, kc_to_idx, num_skills)
    
    # Train-test split
    train_size = int(0.8 * len(dataset))
    val_size = len(dataset) - train_size
    train_dataset, val_dataset = torch.utils.data.random_split(dataset, [train_size, val_size])
    
    train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=32, shuffle=False)
    
    print(f"PAL-Net dataset count: {len(dataset)} examples. Train: {train_size}, Val: {val_size}")
    
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Training on: {device}")
    
    model = PALNet(num_skills, skill_dim=16, learner_dim=16, hidden_dim=32).to(device)
    optimizer = optim.Adam(model.parameters(), lr=0.005, weight_decay=1e-5)
    criterion = nn.BCELoss()
    
    num_epochs = 15
    adj_tensor = adj.to(device)
    
    for epoch in range(num_epochs):
        model.train()
        train_loss = 0.0
        correct = 0
        total = 0
        
        for kcs, stats, profiles, masteries, labels in train_loader:
            kcs = kcs.to(device)
            stats = stats.to(device)
            profiles = profiles.to(device)
            masteries = masteries.to(device)
            labels = labels.to(device)
            
            optimizer.zero_grad()
            preds = model(kcs, stats, profiles, masteries, adj_tensor)
            
            loss = criterion(preds, labels)
            loss.backward()
            optimizer.step()
            
            train_loss += loss.item() * len(labels)
            binary_preds = (preds >= 0.5).float()
            correct += (binary_preds == labels).sum().item()
            total += len(labels)
            
        train_acc = correct / total
        train_loss /= total
        
        # Validation Loop
        model.eval()
        val_loss = 0.0
        val_correct = 0
        val_total = 0
        
        with torch.no_grad():
            for kcs, stats, profiles, masteries, labels in val_loader:
                kcs = kcs.to(device)
                stats = stats.to(device)
                profiles = profiles.to(device)
                masteries = masteries.to(device)
                labels = labels.to(device)
                
                preds = model(kcs, stats, profiles, masteries, adj_tensor)
                loss = criterion(preds, labels)
                
                val_loss += loss.item() * len(labels)
                binary_preds = (preds >= 0.5).float()
                val_correct += (binary_preds == labels).sum().item()
                val_total += len(labels)
                
        val_acc = val_correct / val_total
        val_loss /= val_total
        
        print(f"Epoch {epoch+1:02d}/{num_epochs:02d} | Train Loss: {train_loss:.4f} | Train Acc: {train_acc:.4f} | Val Loss: {val_loss:.4f} | Val Acc: {val_acc:.4f}")
        
    print(f"Saving PAL-Net weights to {OUT_MODEL_PATH}...")
    torch.save({
        'model_state_dict': model.state_dict(),
        'num_skills': num_skills,
        'kc_to_idx': kc_to_idx,
        'adj': adj
    }, OUT_MODEL_PATH)
    print("PAL-Net model training complete.")

if __name__ == "__main__":
    main()
