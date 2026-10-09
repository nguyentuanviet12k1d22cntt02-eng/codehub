import os
import sys
import json
import torch
from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional, Dict
from pathlib import Path
from app.recommendation.serving_registry import checkpoint_metadata_matches, inspect_serving_model
from app.knowledge_tracing.palnet import PALNet

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

# Ensure core directory is accessible
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = FastAPI(
    title="PAL-Net Recommendation AI Service",
    description="Microservice AI gợi ý bài tập thích ứng dựa trên Mạng nơ-ron đồ thị PALNet",
    version="1.0"
)

# Load configuration and models during startup
SKILL_GRAPH_PATH = os.path.join(BASE_DIR, "data", "skill_graph.json")
SERVING_REGISTRY_PATH = Path(BASE_DIR) / "models" / "serving" / "registry.json"

# Global state
skill_graph = {}
skills_list = []
kc_to_idx = {}
idx_to_kc = {}
palnet_model = None
palnet_adj = None
palnet_readiness = "NOT_LOADED"
palnet_model_version = None

@app.on_event("startup")
def startup_event():
    global skill_graph, skills_list, kc_to_idx, idx_to_kc, palnet_model, palnet_adj, palnet_readiness, palnet_model_version

    palnet_model = None
    palnet_adj = None
    palnet_model_version = None
    palnet_readiness = "GRAPH_UNAVAILABLE"
    skill_graph = {}
    skills_list = []
    kc_to_idx = {}
    idx_to_kc = {}
    
    # 1. Load skill graph
    print("Loading skill graph config...")
    if os.path.exists(SKILL_GRAPH_PATH):
        with open(SKILL_GRAPH_PATH, "r", encoding="utf-8") as f:
            skill_graph = json.load(f)
        skills_list = [s["id"] for s in skill_graph["skills"]]
        kc_to_idx = {kc: idx for idx, kc in enumerate(skills_list)}
        idx_to_kc = {idx: kc for idx, kc in enumerate(skills_list)}
        print(f"Loaded {len(skills_list)} Knowledge Components.")
    else:
        print("Error: skill_graph.json not found!")
    if not skills_list:
        palnet_readiness = "GRAPH_UNAVAILABLE"
        return
        
    # 2. Load PAL-Net Model weights & Build Adjacency Matrix
    num_skills = len(skills_list)
    print("Loading PAL-Net model & constructing DAG adjacency matrix...")
    palnet_adj = torch.zeros(num_skills, num_skills)
    for edge in skill_graph.get("edges", []):
        src = edge.get("source")
        tgt = edge.get("target")
        if src in kc_to_idx and tgt in kc_to_idx:
            u = kc_to_idx[src]
            v = kc_to_idx[tgt]
            palnet_adj[u, v] = 1.0
            palnet_adj[v, u] = 1.0 # Symmetric graph convolution

    readiness = inspect_serving_model(
        SERVING_REGISTRY_PATH,
        language="PYTHON",
        graph_version=str(skill_graph.get("version", "")),
        mapping_version="lesson-skill-mapping/1.0.0",
        skill_ids=tuple(skills_list),
    )
    palnet_readiness = readiness.reason
    if readiness.ready:
        try:
            device = torch.device("cpu")
            checkpoint = torch.load(readiness.checkpoint_path, map_location=device, weights_only=True)
            if not checkpoint_metadata_matches(
                checkpoint, language="PYTHON", graph_version=str(skill_graph.get("version", "")),
                mapping_version="lesson-skill-mapping/1.0.0",
                skill_ids=tuple(skills_list), model_version=readiness.model_version,
            ):
                palnet_readiness = "CHECKPOINT_METADATA_MISMATCH"
            else:
                loaded = PALNet(num_skills=num_skills, skill_dim=16, learner_dim=16, hidden_dim=32)
                loaded.load_state_dict(checkpoint["model_state_dict"], strict=True)
                loaded.eval()
                palnet_model = loaded
                palnet_model_version = readiness.model_version
                palnet_readiness = "READY"
                print("Validated serving PAL-Net checkpoint loaded.")
        except Exception as e:
            print(f"Error loading PAL-Net model: {e}")
            palnet_readiness = "CHECKPOINT_LOAD_FAILED"
    else:
        print(f"PAL-Net not ready: {palnet_readiness}; using named rule fallback upstream.")

@app.get("/")
def read_root():
    return {"service": "PAL-Net Recommendation System AI Service", "active": True}

@app.get("/model-status")
def model_status():
    return {
        "palnet_active": palnet_model is not None,
        "readiness": palnet_readiness,
        "model_version": palnet_model_version,
        "fallback": "FALLBACK_RULE_BASED",
        "lesson_policy_status": "NOT_ACTIVE",
        "knowledge_graph_skills": skills_list,
        "total_skills": len(skills_list)
    }

@app.get("/recommend")
def recommend(
    user_id: str,
    algo: str = Query(default="PAL-Net"),
    limit: int = Query(default=5, ge=1, le=20),
):
    """Retired exercise endpoint; backend retains its named existing-rule fallback."""
    raise HTTPException(status_code=410, detail={
        "code": "LEGACY_EXERCISE_RECOMMENDER_RETIRED",
        "fallback": "FALLBACK_RULE_BASED",
    })


@app.post("/train")
def trigger_training(model_type: str = Query(default="PAL-Net")):
    """Mock-data training must never promote a serving checkpoint."""
    raise HTTPException(
        status_code=410,
        detail="LEGACY_TRAINING_RETIRED_USE_VALIDATED_IN_DOMAIN_PIPELINE",
    )


@app.get("/user_mastery")
def get_user_mastery(user_id: str):
    """The backend provides language-scoped evidence-based mastery."""
    raise HTTPException(status_code=410, detail="USE_BACKEND_EVIDENCE_BASED_MASTERY")


class GeneratePathRequest(BaseModel):
    user_id: str
    archetype: Optional[str] = "Persister"
    topic: Optional[str] = None

@app.post("/pal-net/generate-path")
def generate_palnet_learning_path(req: GeneratePathRequest):
    """Retired: generation must use the audited adaptive V3 workflow."""
    raise HTTPException(
        status_code=410,
        detail="LEGACY_PIPELINE_RETIRED_USE_ADAPTIVE_V3",
    )

class ChatInteractRequest(BaseModel):
    user_id: str
    session_id: Optional[str] = None
    messages: List[Dict[str, str]] = []

@app.post("/pal-net/chat-interact")
def chat_interact_ai_tutor(req: ChatInteractRequest):
    """Retired: chat routing must use the audited adaptive V3 workflow."""
    raise HTTPException(
        status_code=410,
        detail="LEGACY_PIPELINE_RETIRED_USE_ADAPTIVE_V3",
    )


# Audited adaptive workflow. Legacy V1 generation/mastery endpoints are intentionally removed.
from app.api.adaptive import router as adaptive_pipeline_router
app.include_router(adaptive_pipeline_router)
from app.api.module_practice_pilot import router as module_practice_pilot_router
app.include_router(module_practice_pilot_router)
