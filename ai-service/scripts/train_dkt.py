import os
import sys
import json
import torch
import torch.nn as nn
import torch.optim as optim
import pandas as pd
from torch.utils.data import Dataset, DataLoader

# Ensure core directory is in target
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

from core.dkt import DKTModel, prepare_dkt_sequence

DATA_PATH = os.path.join(BASE_DIR, "data", "mock_user_history.csv")
SKILL_PATH = os.path.join(BASE_DIR, "data", "skill_graph.json")
OUT_MODEL_PATH = os.path.join(BASE_DIR, "data", "dkt_model.pth")

class DKTDataset(Dataset):
    def __init__(self, df, kc_to_idx, num_skills):
        self.sequences = []
        self.max_len = 0
        
        # Sort by user and timestamp
        df_sorted = df.sort_values(by=["user_id", "timestamp"])
        
        for user_id, group in df_sorted.groupby("user_id"):
            kc_list = group["kc_id"].tolist()
            correct_list = group["correct"].tolist()
            
            if len(kc_list) < 2:
                continue
                
            # Get integer indices for targeted KCs
            kc_idx_list = [kc_to_idx[kc] for kc in kc_list]
            
            # Prepare DKT interaction tokens
            tokens = prepare_dkt_sequence(kc_list, correct_list, num_skills, kc_to_idx)
            
            # x is the sequence of inputs (1 ... T-1)
            x = tokens[:-1]
            
            # target_kc is the sequence of skills attempted next (2 ... T)
            target_kc = kc_idx_list[1:]
            
            # target_correct is the sequence of labels (2 ... T)
            target_correct = correct_list[1:]
            
            self.sequences.append((x, target_kc, target_correct))
            self.max_len = max(self.max_len, len(x))
            
    def __len__(self):
        return len(self.sequences)
        
    def __getitem__(self, idx):
        return self.sequences[idx]

def collate_fn(batch, num_skills):
    # Padding sequences manually
    batch_size = len(batch)
    lengths = [len(x[0]) for x in batch]
    max_len = max(lengths)
    
    padded_x = torch.zeros(batch_size, max_len, dtype=torch.long)
    padded_target_kc = torch.zeros(batch_size, max_len, dtype=torch.long)
    padded_target_correct = torch.zeros(batch_size, max_len, dtype=torch.float)
    masks = torch.zeros(batch_size, max_len, dtype=torch.float)
    
    for i, (x, target_kc, target_correct) in enumerate(batch):
        seq_len = len(x)
        padded_x[i, :seq_len] = torch.tensor(x, dtype=torch.long)
        padded_target_kc[i, :seq_len] = torch.tensor(target_kc, dtype=torch.long)
        padded_target_correct[i, :seq_len] = torch.tensor(target_correct, dtype=torch.float)
        masks[i, :seq_len] = 1.0
        
    return padded_x, padded_target_kc, padded_target_correct, masks

def main():
    if not os.path.exists(DATA_PATH) or not os.path.exists(SKILL_PATH):
        print("Required CSV or JSON skill tree not found.")
        return
        
    with open(SKILL_PATH, "r", encoding="utf-8") as f:
        skill_graph = json.load(f)
        
    skills = [s["id"] for s in skill_graph["skills"]]
    num_skills = len(skills)
    kc_to_idx = {kc: idx for idx, kc in enumerate(skills)}
    
    df = pd.read_csv(DATA_PATH)
    
    dataset = DKTDataset(df, kc_to_idx, num_skills)
    # Custom collate fn passing num_skills
    loader = DataLoader(
        dataset, 
        batch_size=16, 
        shuffle=True, 
        collate_fn=lambda b: collate_fn(b, num_skills)
    )
    
    print(f"Dataset created with {len(dataset)} student logs.")
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Training on device: {device}")
    
    model = DKTModel(num_skills, embedding_dim=16, hidden_dim=32).to(device)
    optimizer = optim.Adam(model.parameters(), lr=0.01)
    criterion = nn.BCELoss(reduction='none')
    
    num_epochs = 20
    model.train()
    
    for epoch in range(num_epochs):
        epoch_loss = 0.0
        total_predictions = 0
        correct_predictions = 0
        
        for padded_x, padded_target_kc, padded_target_correct, masks in loader:
            padded_x = padded_x.to(device)
            padded_target_kc = padded_target_kc.to(device)
            padded_target_correct = padded_target_correct.to(device)
            masks = masks.to(device)
            
            optimizer.zero_grad()
            # preds shape: [batch_size, seq_len, num_skills]
            preds = model(padded_x)
            
            # Extract target predictions corresponding to the next attempted skill at each timestep
            # Gather along last dimension: values of padded_target_kc indicate the index of of interest
            # Note: padded_target_kc size is [batch, seq_len], we add a dimension to gather
            selected_preds = preds.gather(2, padded_target_kc.unsqueeze(2)).squeeze(2) # [batch_size, seq_len]
            
            # Loss calculation masked for padded timesteps
            batch_loss = criterion(selected_preds, padded_target_correct)
            masked_loss = batch_loss * masks
            loss = masked_loss.sum() / masks.sum()
            
            loss.backward()
            optimizer.step()
            
            epoch_loss += loss.item() * masks.sum().item()
            total_predictions += masks.sum().item()
            
            # Accuracy metric
            binary_preds = (selected_preds >= 0.5).float()
            correct_predictions += ((binary_preds == padded_target_correct) * masks).sum().item()
            
        avg_loss = epoch_loss / total_predictions
        accuracy = correct_predictions / total_predictions
        print(f"Epoch {epoch+1:02d}/{num_epochs:02d} | Loss: {avg_loss:.4f} | Accuracy: {accuracy:.4f}")
        
    print(f"Saving DKT model weights to {OUT_MODEL_PATH}...")
    torch.save({
        'model_state_dict': model.state_dict(),
        'num_skills': num_skills,
        'kc_to_idx': kc_to_idx
    }, OUT_MODEL_PATH)
    print("DKT model training complete.")

if __name__ == "__main__":
    main()
