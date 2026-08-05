import torch
import torch.nn as nn
import numpy as np

class DKTModel(nn.Module):
    def __init__(self, num_skills, embedding_dim=32, hidden_dim=64):
        super(DKTModel, self).__init__()
        self.num_skills = num_skills
        self.hidden_dim = hidden_dim
        
        # 0 is padding, 1..num_skills are failure tokens, num_skills+1..2*num_skills are success tokens
        self.input_dim = num_skills * 2 + 1
        self.embedding = nn.Embedding(self.input_dim, embedding_dim, padding_idx=0)
        
        self.lstm = nn.LSTM(embedding_dim, hidden_dim, batch_first=True)
        self.fc = nn.Linear(hidden_dim, num_skills)
        
    def forward(self, x):
        # x shape: [batch_size, seq_len]
        embeds = self.embedding(x)
        # lstm_out shape: [batch_size, seq_len, hidden_dim]
        lstm_out, _ = self.lstm(embeds)
        # logits shape: [batch_size, seq_len, num_skills]
        logits = self.fc(lstm_out)
        preds = torch.sigmoid(logits)
        return preds

def prepare_dkt_sequence(kc_list, correct_list, num_skills, kc_to_idx):
    """
    Encode sequence of interactions (KC, correct) to tokens:
    - padding: 0
    - incorrect (correct=0) on skill k: index k + 1 (1 to num_skills)
    - correct (correct=1) on skill k: index k + num_skills + 1 (num_skills+1 to 2*num_skills)
    """
    seq_len = len(kc_list)
    tokens = []
    
    for i in range(seq_len):
        kc = kc_list[i]
        correct = correct_list[i]
        kc_idx = kc_to_idx.get(kc)
        if kc_idx is None:
            continue
            
        if correct == 1:
            token = kc_idx + num_skills + 1
        else:
            token = kc_idx + 1
        tokens.append(token)
        
    return tokens
