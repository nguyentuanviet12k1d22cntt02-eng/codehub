import torch
import torch.nn as nn
import numpy as np

class GCNLayer(nn.Module):
    def __init__(self, in_features, out_features):
        super(GCNLayer, self).__init__()
        self.linear = nn.Linear(in_features, out_features)
        
    def forward(self, x, adj):
        # x shape: [num_nodes, in_features]
        # adj shape: [num_nodes, num_nodes]
        support = self.linear(x)
        out = torch.matmul(adj, support)
        return torch.relu(out)

class PALNet(nn.Module):
    def __init__(self, num_skills, skill_dim=16, learner_dim=16, hidden_dim=32):
        super(PALNet, self).__init__()
        self.num_skills = num_skills
        self.skill_dim = skill_dim
        self.learner_dim = learner_dim
        
        # Trainable initial node features
        self.node_features = nn.Parameter(torch.randn(num_skills, skill_dim))
        
        # GCN for Knowledge Graph
        self.gcn1 = GCNLayer(skill_dim, skill_dim)
        self.gcn2 = GCNLayer(skill_dim, skill_dim)
        
        # Learner Profile Encoder
        self.profile_embedding = nn.Embedding(3, 8) # 0: STRUGGLING, 1: AVERAGE, 2: EXCELLENT
        self.learner_fc = nn.Sequential(
            nn.Linear(num_skills * 2 + 8, learner_dim),
            nn.ReLU(),
            nn.Linear(learner_dim, learner_dim)
        )
        
        # Attention Mechanism
        self.q_linear = nn.Linear(skill_dim, skill_dim)
        self.k_linear = nn.Linear(skill_dim, skill_dim)
        
        # Final prediction layer
        # Inputs: target skill embedding (skill_dim) + learner embedding (learner_dim) + attention context (skill_dim)
        self.predictor = nn.Sequential(
            nn.Linear(skill_dim * 2 + learner_dim, hidden_dim),
            nn.ReLU(),
            nn.Dropout(0.1),
            nn.Linear(hidden_dim, 1),
            nn.Sigmoid()
        )
        
    def _normalize_adj(self, adj):
        # adj size: [num_skills, num_skills]
        adj_tilde = adj + torch.eye(self.num_skills, device=adj.device)
        deg = torch.sum(adj_tilde, dim=1)
        deg_inv_sqrt = torch.pow(deg, -0.5)
        deg_inv_sqrt[torch.isinf(deg_inv_sqrt)] = 0.0
        d_mat = torch.diag(deg_inv_sqrt)
        adj_norm = torch.matmul(torch.matmul(d_mat, adj_tilde), d_mat)
        return adj_norm

    def forward(self, target_kc_idx, learner_stats, profile_idx, raw_masteries, adj):
        """
        Args:
            target_kc_idx: int or long Tensor of shape [batch_size] -> target skill to predict
            learner_stats: float Tensor of shape [batch_size, num_skills * 2] -> attempts and correct counts
            profile_idx: long Tensor of shape [batch_size] -> profile group index (0, 1, 2)
            raw_masteries: float Tensor of shape [batch_size, num_skills] -> student performance weights (EMA / raw correctness)
            adj: float Tensor of shape [num_skills, num_skills] -> Graph Adjacency Matrix
        """
        batch_size = target_kc_idx.size(0)
        
        # Normalize adjacency matrix
        adj_norm = self._normalize_adj(adj) # [num_skills, num_skills]
        
        # Graph convolution for KCs embeddings
        # self.node_features: [num_skills, skill_dim]
        h1 = self.gcn1(self.node_features, adj_norm) # [num_skills, skill_dim]
        skill_embeddings = self.gcn2(h1, adj_norm) # [num_skills, skill_dim]
        
        # Extract target KC embeddings
        # target_kc_idx: [batch_size]
        target_embeddings = skill_embeddings[target_kc_idx] # [batch_size, skill_dim]
        
        # Learner representation
        prof_emb = self.profile_embedding(profile_idx) # [batch_size, 8]
        learner_input = torch.cat([learner_stats, prof_emb], dim=1) # [batch_size, num_skills * 2 + 8]
        learner_emb = self.learner_fc(learner_input) # [batch_size, learner_dim]
        
        # Attention weight computation
        # Query: [batch_size, skill_dim]
        q = self.q_linear(target_embeddings).unsqueeze(1) # [batch_size, 1, skill_dim]
        # Keys: [num_skills, skill_dim] -> repeat for batch size: [batch_size, num_skills, skill_dim]
        k = self.k_linear(skill_embeddings).unsqueeze(0).expand(batch_size, -1, -1)
        
        # Attention scores: dot product
        # q: [batch_size, 1, skill_dim], k.transpose(1, 2): [batch_size, skill_dim, num_skills]
        # attn_scores: [batch_size, 1, num_skills]
        attn_scores = torch.bmm(q, k.transpose(1, 2)) / np.sqrt(self.skill_dim)
        attn_weights = torch.softmax(attn_scores, dim=2) # [batch_size, 1, num_skills]
        
        # Multiply attention with raw masteries & skill embeddings
        # raw_masteries: [batch_size, num_skills] -> [batch_size, num_skills, 1]
        # skill_embeddings: [num_skills, skill_dim] -> [batch_size, num_skills, skill_dim]
        expanded_skills = skill_embeddings.unsqueeze(0).expand(batch_size, -1, -1)
        weighted_skills = expanded_skills * raw_masteries.unsqueeze(2) # [batch_size, num_skills, skill_dim]
        
        # Context vector: [batch_size, 1, num_skills] x [batch_size, num_skills, skill_dim] -> [batch_size, 1, skill_dim]
        context = torch.bmm(attn_weights, weighted_skills).squeeze(1) # [batch_size, skill_dim]
        
        # Final output
        combined = torch.cat([target_embeddings, learner_emb, context], dim=1) # [batch_size, skill_dim + learner_dim + skill_dim]
        out_prob = self.predictor(combined).squeeze(1) # [batch_size]
        
        return out_prob
