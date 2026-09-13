with open('ai-service/main.py', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Imports
old_imports = """try:
    from app.knowledge_tracing.bkt import BKTModel
    from app.knowledge_tracing.dkt import DKTModel, prepare_dkt_sequence
    from app.knowledge_tracing.palnet import PALNet
    from app.adaptive.path_generator import generate_personalized_learning_path, interact_ai_tutor_dialogue
    from app.agents.adaptive_agent_orchestrator import AdaptiveAgentOrchestrator
except ImportError:
    from core.bkt import BKTModel
    from core.dkt import DKTModel, prepare_dkt_sequence
    from core.palnet import PALNet
    from core.path_generator import generate_personalized_learning_path, interact_ai_tutor_dialogue
    from core.adaptive_agent_orchestrator import AdaptiveAgentOrchestrator"""

new_imports = """try:
    from app.knowledge_tracing.palnet import PALNet
    from app.adaptive.path_generator import generate_personalized_learning_path, interact_ai_tutor_dialogue
    from app.agents.adaptive_agent_orchestrator import AdaptiveAgentOrchestrator
except ImportError:
    from core.palnet import PALNet
    from core.path_generator import generate_personalized_learning_path, interact_ai_tutor_dialogue
    from core.adaptive_agent_orchestrator import AdaptiveAgentOrchestrator"""

assert old_imports in content, "old_imports not found"
content = content.replace(old_imports, new_imports)

# 2. FastAPI title & desc
old_app = """app = FastAPI(
    title="PAL-Net Recommendation AI Service",
    description="Microservice AI gợi ý bài tập thích ứng dựa trên BKT, DKT và PAL-Net",
    version="1.0"
)

# Load configuration and models during startup
SKILL_GRAPH_PATH = os.path.join(BASE_DIR, "data", "skill_graph.json")
BKT_PARAMS_PATH = os.path.join(BASE_DIR, "data", "bkt_parameters.json")
DKT_MODEL_PATH = os.path.join(BASE_DIR, "models", "dkt_model.pth") if os.path.exists(os.path.join(BASE_DIR, "models", "dkt_model.pth")) else os.path.join(BASE_DIR, "data", "dkt_model.pth")
PALNET_MODEL_PATH = os.path.join(BASE_DIR, "models", "palnet_model.pth") if os.path.exists(os.path.join(BASE_DIR, "models", "palnet_model.pth")) else os.path.join(BASE_DIR, "data", "palnet_model.pth")
BACKEND_ENV_PATH = os.path.join(os.path.dirname(BASE_DIR), "backend", ".env")

# Global state
skill_graph = {}
skills_list = []
kc_to_idx = {}
idx_to_kc = {}
bkt_model = None
dkt_model = None
palnet_model = None
palnet_adj = None"""

new_app = """app = FastAPI(
    title="PAL-Net Recommendation AI Service",
    description="Microservice AI gợi ý bài tập thích ứng dựa trên Mạng nơ-ron đồ thị PALNet",
    version="1.0"
)

# Load configuration and models during startup
SKILL_GRAPH_PATH = os.path.join(BASE_DIR, "data", "skill_graph.json")
PALNET_MODEL_PATH = os.path.join(BASE_DIR, "models", "palnet_model.pth") if os.path.exists(os.path.join(BASE_DIR, "models", "palnet_model.pth")) else os.path.join(BASE_DIR, "data", "palnet_model.pth")
BACKEND_ENV_PATH = os.path.join(os.path.dirname(BASE_DIR), "backend", ".env")

# Global state
skill_graph = {}
skills_list = []
kc_to_idx = {}
idx_to_kc = {}
palnet_model = None
palnet_adj = None"""

assert old_app in content, "old_app not found"
content = content.replace(old_app, new_app)

# 3. startup_event
old_startup = """@app.on_event("startup")
def startup_event():
    global skill_graph, skills_list, kc_to_idx, idx_to_kc, bkt_model, dkt_model, palnet_model, palnet_adj
    
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
        
    # 2. Init BKT Model
    print("Loading BKT parameters...")
    bkt_model = BKTModel()
    if os.path.exists(BKT_PARAMS_PATH):
        bkt_model.load(BKT_PARAMS_PATH)
        print("BKT parameters loaded from disk.")
    
    # Đảm bảo 100% concepts trong cây tri thức mới đều có tham số BKT
    for kc in skills_list:
        if kc not in bkt_model.params:
            bkt_model.params[kc] = {"p_l0": 0.40, "p_t": 0.15, "p_s": 0.10, "p_g": 0.20}
    print(f"BKT active for {len(bkt_model.params)} concepts.")
            
    # 3. Load DKT Model weights
    print("Loading DKT model...")
    num_skills = len(skills_list)
    if os.path.exists(DKT_MODEL_PATH):
        try:
            device = torch.device("cpu")
            checkpoint = torch.load(DKT_MODEL_PATH, map_location=device, weights_only=False)
            if checkpoint.get('num_skills') == num_skills:
                dkt_model = DKTModel(num_skills=checkpoint['num_skills'], embedding_dim=16, hidden_dim=32)
                dkt_model.load_state_dict(checkpoint['model_state_dict'])
                dkt_model.eval()
                print("DKT Model loaded successfully.")
            else:
                print(f"DKT checkpoint num_skills ({checkpoint.get('num_skills')}) mismatch with skills_list ({num_skills}). Initializing calibrated DKT model.")
                dkt_model = DKTModel(num_skills=num_skills, embedding_dim=16, hidden_dim=32)
                dkt_model.eval()
        except Exception as e:
            print(f"Error loading DKT model: {e}")
            dkt_model = DKTModel(num_skills=num_skills, embedding_dim=16, hidden_dim=32)
            dkt_model.eval()
    else:
        print("DKT model initialized for current skill set.")
        dkt_model = DKTModel(num_skills=num_skills, embedding_dim=16, hidden_dim=32)
        dkt_model.eval()
        
    # 4. Load PAL-Net Model weights & Build Adjacency Matrix
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

    if os.path.exists(PALNET_MODEL_PATH):
        try:
            device = torch.device("cpu")
            checkpoint = torch.load(PALNET_MODEL_PATH, map_location=device, weights_only=False)
            if checkpoint.get('num_skills') == num_skills:
                palnet_model = PALNet(num_skills=num_skills, skill_dim=16, learner_dim=16, hidden_dim=32)
                palnet_model.load_state_dict(checkpoint['model_state_dict'])
                palnet_model.eval()
                print("PAL-Net Model weights loaded successfully.")
            else:
                print(f"PAL-Net checkpoint num_skills ({checkpoint.get('num_skills')}) mismatch with DAG ({num_skills}). Initializing calibrated PAL-Net model.")
                palnet_model = PALNet(num_skills=num_skills, skill_dim=16, learner_dim=16, hidden_dim=32)
                palnet_model.eval()
        except Exception as e:
            print(f"Error loading PAL-Net model: {e}")
            palnet_model = PALNet(num_skills=num_skills, skill_dim=16, learner_dim=16, hidden_dim=32)
            palnet_model.eval()
    else:
        print("PAL-Net model initialized for current DAG skill set.")
        palnet_model = PALNet(num_skills=num_skills, skill_dim=16, learner_dim=16, hidden_dim=32)
        palnet_model.eval()"""

new_startup = """@app.on_event("startup")
def startup_event():
    global skill_graph, skills_list, kc_to_idx, idx_to_kc, palnet_model, palnet_adj
    
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

    if os.path.exists(PALNET_MODEL_PATH):
        try:
            device = torch.device("cpu")
            checkpoint = torch.load(PALNET_MODEL_PATH, map_location=device, weights_only=False)
            if checkpoint.get('num_skills') == num_skills:
                palnet_model = PALNet(num_skills=num_skills, skill_dim=16, learner_dim=16, hidden_dim=32)
                palnet_model.load_state_dict(checkpoint['model_state_dict'])
                palnet_model.eval()
                print("PAL-Net Model weights loaded successfully.")
            else:
                print(f"PAL-Net checkpoint num_skills ({checkpoint.get('num_skills')}) mismatch with DAG ({num_skills}). Initializing calibrated PAL-Net model.")
                palnet_model = PALNet(num_skills=num_skills, skill_dim=16, learner_dim=16, hidden_dim=32)
                palnet_model.eval()
        except Exception as e:
            print(f"Error loading PAL-Net model: {e}")
            palnet_model = PALNet(num_skills=num_skills, skill_dim=16, learner_dim=16, hidden_dim=32)
            palnet_model.eval()
    else:
        print("PAL-Net model initialized for current DAG skill set.")
        palnet_model = PALNet(num_skills=num_skills, skill_dim=16, learner_dim=16, hidden_dim=32)
        palnet_model.eval()"""

assert old_startup in content, "old_startup not found"
content = content.replace(old_startup, new_startup)

# 4. model-status and get_p_correct_bkt
old_status = """@app.get("/model-status")
def model_status():
    return {
        "bkt_active": len(bkt_model.params) > 0 if bkt_model else False,
        "dkt_active": dkt_model is not None,
        "palnet_active": palnet_model is not None,
        "knowledge_graph_skills": skills_list,
        "total_skills": len(skills_list)
    }

def get_p_correct_bkt(masteries, kc):
    p = bkt_model.params.get(kc, {"p_l0": 0.40, "p_t": 0.15, "p_s": 0.10, "p_g": 0.20})
    m = masteries.get(kc, p["p_l0"])
    return m * (1.0 - p["p_s"]) + (1.0 - m) * p["p_g"]"""

new_status = """@app.get("/model-status")
def model_status():
    return {
        "palnet_active": palnet_model is not None,
        "knowledge_graph_skills": skills_list,
        "total_skills": len(skills_list)
    }"""

assert old_status in content, "old_status not found"
content = content.replace(old_status, new_status)

# 5. recommend endpoint signature and inference block
import re
recommend_block_pattern = r'@app\.get\("/recommend", response_model=List\[RecommendResponse\]\)\ndef recommend\(.*?# 4\. Score skills based on ZPD'

recommend_replacement = """@app.get("/recommend", response_model=List[RecommendResponse])
def recommend(
    user_id: str,
    algo: str = Query(default="PAL-Net"),
    limit: int = Query(default=5, ge=1, le=20)
):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Could not connect to database")
        
    try:
        # 1. Fetch student history
        student_meta, actions = query_student_history(conn, user_id)
        if not student_meta:
            # User doesn't exist: return cold-start recs
            return get_cold_start_recommendations(conn, limit)
            
        # 2. Cold-start check (fewer than 2 submissions):
        if len(actions) < 2:
            print(f"Cold-start recommendation triggered for {user_id}")
            recs = get_cold_start_recommendations(conn, limit)
            conn.close()
            return recs
            
        # 3. Calculate mastery scores per skill using PAL-Net (GCN & Attention)
        num_skills = len(skills_list)
        p_correct_by_kc = {}
        
        if palnet_model is None:
            raise HTTPException(status_code=503, detail="PAL-Net Model is currently offline. Train the model first.")
            
        profile_map = {"STRUGGLING": 0, "AVERAGE": 1, "EXCELLENT": 2}
        profile_idx_val = profile_map[student_meta["profile"]]
        
        # Cumulative user stats
        attempts = np.zeros(num_skills)
        corrects = np.zeros(num_skills)
        raw_masteries = np.full(num_skills, 0.5)
        
        for a in actions:
            k_idx = kc_to_idx[a["kc_id"]]
            attempts[k_idx] += 1
            if a["correct"] == 1:
                corrects[k_idx] += 1
            # EMA update
            raw_masteries[k_idx] = 0.7 * raw_masteries[k_idx] + 0.3 * a["correct"]
            
        stats = np.zeros(num_skills * 2)
        for k in range(num_skills):
            stats[k * 2] = attempts[k]
            stats[k * 2 + 1] = corrects[k] / attempts[k] if attempts[k] > 0 else 0.0
            
        # Forward pass through model for each skill
        stats_tensor = torch.tensor([stats], dtype=torch.float)
        profile_tensor = torch.tensor([profile_idx_val], dtype=torch.long)
        masteries_tensor = torch.tensor([raw_masteries], dtype=torch.float)
        adj_tensor = palnet_adj
        
        with torch.no_grad():
            for kc in skills_list:
                k_idx = kc_to_idx[kc]
                k_idx_tensor = torch.tensor([k_idx], dtype=torch.long)
                # Predict correctness probability
                pred_prob = palnet_model(
                    k_idx_tensor, stats_tensor, profile_tensor, masteries_tensor, adj_tensor
                )
                p_correct_by_kc[kc] = float(pred_prob[0].item())
                
        # 4. Score skills based on ZPD"""

match = re.search(recommend_block_pattern, content, flags=re.DOTALL)
assert match is not None, "recommend_block_pattern not matched"
content = content[:match.start()] + recommend_replacement + content[match.end():]

# 6. /train endpoint
old_train = """@app.post("/train")
def trigger_training(model_type: str = Query(default="all", regex="^(all|BKT|DKT|PAL-Net)$")):
    try:
        # Trigger scripts asynchronously or sub-processed
        import subprocess
        results = {}
        
        scripts_to_run = []
        if model_type in ["all", "BKT"]:
            scripts_to_run.append(("BKT", "scripts/train_bkt.py"))
        if model_type in ["all", "DKT"]:
            scripts_to_run.append(("DKT", "scripts/train_dkt.py"))
        if model_type in ["all", "PAL-Net"]:
            scripts_to_run.append(("PAL-Net", "scripts/train_palnet.py"))
            
        for name, script in scripts_to_run:
            print(f"Triggering training script: {script}")
            p = subprocess.run([sys.executable, script], capture_output=True, text=True, cwd=BASE_DIR)
            if p.returncode == 0:
                results[name] = "Success"
            else:
                results[name] = f"Failed (Code {p.returncode}): {p.stderr}"
                
        # Reload models after successful training
        startup_event()
        
        return {"status": "Training cycle complete", "details": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Training Trigger Error: {e}")"""

new_train = """@app.post("/train")
def trigger_training(model_type: str = Query(default="PAL-Net")):
    try:
        import subprocess
        results = {}
        script = "scripts/train_palnet.py"
        print(f"Triggering training script: {script}")
        p = subprocess.run([sys.executable, script], capture_output=True, text=True, cwd=BASE_DIR)
        if p.returncode == 0:
            results["PAL-Net"] = "Success"
        else:
            results["PAL-Net"] = f"Failed (Code {p.returncode}): {p.stderr}"
            
        startup_event()
        return {"status": "Training cycle complete", "details": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Training Trigger Error: {e}")"""

assert old_train in content, "old_train not found"
content = content.replace(old_train, new_train)

# 7. /user_mastery endpoint
old_mastery_pattern = r'# Initialize default maps\s+masteries = \{.*?# Get count of exercises completed and stats'
new_mastery = """# Initialize default maps (PAL-Net)
        masteries = {
            "PAL-Net": {kc: 0.50 for kc in skills_list}
        }
        
        # PAL-Net GCN & Attention inference
        if len(actions) >= 2 and palnet_model is not None:
            profile_map = {"STRUGGLING": 0, "AVERAGE": 1, "EXCELLENT": 2}
            profile_idx_val = profile_map[student_meta["profile"]]
            attempts = np.zeros(len(skills_list))
            corrects = np.zeros(len(skills_list))
            raw_masteries = np.full(len(skills_list), 0.5)
            for a in actions:
                k_idx = kc_to_idx[a["kc_id"]]
                attempts[k_idx] += 1
                if a["correct"] == 1:
                    corrects[k_idx] += 1
                raw_masteries[k_idx] = 0.7 * raw_masteries[k_idx] + 0.3 * a["correct"]
            stats = np.zeros(len(skills_list) * 2)
            for k in range(len(skills_list)):
                stats[k * 2] = attempts[k]
                stats[k * 2 + 1] = corrects[k] / attempts[k] if attempts[k] > 0 else 0.0
            stats_tensor = torch.tensor([stats], dtype=torch.float)
            profile_tensor = torch.tensor([profile_idx_val], dtype=torch.long)
            masteries_tensor = torch.tensor([raw_masteries], dtype=torch.float)
            with torch.no_grad():
                for kc in skills_list:
                    k_idx = kc_to_idx[kc]
                    k_idx_tensor = torch.tensor([k_idx], dtype=torch.long)
                    pred_prob = palnet_model(
                        k_idx_tensor, stats_tensor, profile_tensor, masteries_tensor, palnet_adj
                    )
                    masteries["PAL-Net"][kc] = float(pred_prob[0].item())
                    
        # Get count of exercises completed and stats"""

match_m = re.search(old_mastery_pattern, content, flags=re.DOTALL)
assert match_m is not None, "old_mastery_pattern not matched"
content = content[:match_m.start()] + new_mastery + content[match_m.end():]

with open('ai-service/main.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("ai-service/main.py updated successfully!")
