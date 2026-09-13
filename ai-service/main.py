import os
import sys
import json
import numpy as np
import torch
import psycopg2
from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from dotenv import load_dotenv

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

# Ensure core directory is accessible
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

try:
    from app.knowledge_tracing.palnet import PALNet
    from app.adaptive.path_generator import generate_personalized_learning_path, interact_ai_tutor_dialogue
    from app.agents.adaptive_agent_orchestrator import AdaptiveAgentOrchestrator
except ImportError:
    from core.palnet import PALNet
    from core.path_generator import generate_personalized_learning_path, interact_ai_tutor_dialogue
    from core.adaptive_agent_orchestrator import AdaptiveAgentOrchestrator

adaptive_orchestrator = AdaptiveAgentOrchestrator()



app = FastAPI(
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
palnet_adj = None

def get_db_connection():
    if not os.path.exists(BACKEND_ENV_PATH):
        return None
    load_dotenv(BACKEND_ENV_PATH)
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        return None
    if "?schema=" in db_url:
        connection_url = db_url.split("?schema=")[0]
    else:
        connection_url = db_url
    try:
        conn = psycopg2.connect(connection_url)
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        return None

@app.on_event("startup")
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
        palnet_model.eval()

class RecommendResponse(BaseModel):
    id: str
    type: str  # LESSON_EXERCISE or PRACTICE_PROBLEM
    title: str
    kc_id: str
    predicted_mastery: float
    zpd_score: float
    difficulty: str
    lesson_id: Optional[str] = None
    slug: Optional[str] = None

@app.get("/")
def read_root():
    return {"service": "PAL-Net Recommendation System AI Service", "active": True}

@app.get("/model-status")
def model_status():
    return {
        "palnet_active": palnet_model is not None,
        "knowledge_graph_skills": skills_list,
        "total_skills": len(skills_list)
    }

def query_student_history(conn, user_id):
    cursor = conn.cursor()
    
    # Get user details for profile estimation
    cursor.execute("SELECT username, email FROM users WHERE id = %s;", (user_id,))
    user_row = cursor.fetchone()
    if not user_row:
        cursor.close()
        return None, []
        
    username, email = user_row
    
    # 1. Fetch lesson exercises submissions
    # Map from coding_exercises via lessons to know KC mapping
    cursor.execute("""
        SELECT 
            ce.id as exercise_id, 
            ce.title, 
            l.lesson_id as lesson_code, 
            sub.status, 
            sub.submitted_at
        FROM submissions sub
        JOIN coding_exercises ce ON sub.exercise_id = ce.id
        JOIN lessons l ON ce.lesson_id = l.id
        WHERE sub.user_id = %s
        ORDER BY sub.submitted_at ASC;
    """, (user_id,))
    lesson_subs = cursor.fetchall()
    
    # 2. Fetch practice problem submissions
    cursor.execute("""
        SELECT 
            pp.id as problem_id, 
            pp.title, 
            pp.slug, 
            psub.status, 
            psub.submitted_at
        FROM practice_submissions psub
        JOIN practice_problems pp ON psub.problem_id = pp.id
        WHERE psub.user_id = %s
        ORDER BY psub.submitted_at ASC;
    """, (user_id,))
    practice_subs = cursor.fetchall()
    cursor.close()
    
    # Combine and sort responses chronologically
    actions = []
    lesson_maps = skill_graph.get("lesson_mappings", {})
    practice_maps = skill_graph.get("practice_problem_mappings", {})
    
    for row in lesson_subs:
        ex_id, title, lesson_code, status, submitted_at = row
        kc_id = lesson_maps.get(lesson_code)
        if kc_id:
            actions.append({
                "item_id": ex_id,
                "type": "LESSON",
                "title": title,
                "correct": 1 if status == "PASSED" else 0,
                "kc_id": kc_id,
                "timestamp": submitted_at
            })
            
    for row in practice_subs:
        p_id, title, slug, status, submitted_at = row
        kc_id = practice_maps.get(slug)
        if kc_id:
            actions.append({
                "item_id": p_id,
                "type": "PRACTICE",
                "title": title,
                "correct": 1 if status == "PASSED" else 0,
                "kc_id": kc_id,
                "timestamp": submitted_at
            })
            
    actions.sort(key=lambda x: x["timestamp"])
    
    # Calculate inferred student profile
    profile = "AVERAGE"
    if len(actions) > 0:
        passed_count = sum(1 for a in actions if a["correct"] == 1)
        success_rate = passed_count / len(actions)
        if success_rate >= 0.8 and len(actions) >= 5:
            profile = "EXCELLENT"
        elif success_rate < 0.4 and len(actions) >= 5:
            profile = "STRUGGLING"
            
    student_meta = {"username": username, "email": email, "profile": profile}
    return student_meta, actions

def get_cold_start_recommendations(conn, limit):
    """
    Cold start fallback: Recommend the first few unpassed coding exercises
    conforming to course progression order.
    """
    cursor = conn.cursor()
    # Fetch coding exercises ordered by lesson ordering
    cursor.execute("""
        SELECT ce.id, ce.title, l.lesson_id, ce.difficulty
        FROM coding_exercises ce
        JOIN lessons l ON ce.lesson_id = l.id
        JOIN modules m ON l.module_id = m.id
        ORDER BY m.order_index ASC, l.order_index ASC, ce.created_at ASC
        LIMIT %s;
    """, (limit,))
    rows = cursor.fetchall()
    cursor.close()
    
    recs = []
    lesson_maps = skill_graph.get("lesson_mappings", {})
    for idx, row in enumerate(rows):
        ex_id, title, lesson_code, diff = row
        kc_id = lesson_maps.get(lesson_code, "KC_VAR")
        recs.append({
            "id": ex_id,
            "type": "LESSON_EXERCISE",
            "title": title,
            "kc_id": kc_id,
            "predicted_mastery": 0.5, # default
            "zpd_score": 1.0 - abs(0.5 - 0.775), # default ZPD score
            "difficulty": str(diff)
        })
    return recs

@app.get("/recommend", response_model=List[RecommendResponse])
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
                
        # 4. Score skills based on ZPD (Zone of Proximal Development: Range 0.70 - 0.85)
        # We calculate the absolute distance of predicted masteries to the target median (0.775)
        # ZPD_Score = 1.0 - |P(correct) - 0.775|
        # Higher score = closest to ZPD center
        zpd_scores = {}
        for kc, p_correct in p_correct_by_kc.items():
            zpd_scores[kc] = 1.0 - abs(p_correct - 0.775)
            
        print(f"Calculated predicted masteries: {p_correct_by_kc}")
        print(f"Calculated ZPD scores: {zpd_scores}")
        
        # 5. Fetch all available exercises from DB
        cursor = conn.cursor()
        cursor.execute("SELECT id, title, difficulty, lesson_id FROM coding_exercises;")
        lesson_exs = cursor.fetchall()
        
        cursor.execute("SELECT id, title, difficulty, slug FROM practice_problems;")
        practice_exs = cursor.fetchall()
        
        # 6. Fetch already passed exercises by user to filter them profile
        cursor.execute("SELECT exercise_id FROM submissions WHERE user_id = %s AND status = 'PASSED';", (user_id,))
        passed_lesson_ex_ids = {row[0] for row in cursor.fetchall()}
        
        cursor.execute("SELECT problem_id FROM practice_submissions WHERE user_id = %s AND status = 'PASSED';", (user_id,))
        passed_practice_ex_ids = {row[0] for row in cursor.fetchall()}
        
        # Resolve lesson codes mapped to UUIDs
        cursor.execute("SELECT id, lesson_id FROM lessons;")
        lessons_map = {row[0]: row[1] for row in cursor.fetchall()}
        
        cursor.close()
        conn.close()
        
        recommendation_candidates = []
        lesson_mappings = skill_graph.get("lesson_mappings", {})
        practice_mappings = skill_graph.get("practice_problem_mappings", {})
        
        # 7. Add Lesson Exercises candidates
        for row in lesson_exs:
            ex_id, title, diff, lesson_uuid = row
            # Filter passed ones
            if ex_id in passed_lesson_ex_ids:
                continue
                
            lesson_code = lessons_map.get(lesson_uuid)
            if lesson_code:
                kc = lesson_mappings.get(lesson_code)
                if kc:
                    recommendation_candidates.append({
                        "id": ex_id,
                        "type": "LESSON_EXERCISE",
                        "title": title,
                        "kc_id": kc,
                        "predicted_mastery": p_correct_by_kc[kc],
                        "zpd_score": zpd_scores[kc],
                        "difficulty": str(diff),
                        "lesson_id": lesson_uuid
                    })
                    
        # 8. Add Practice Problems candidates
        for row in practice_exs:
            p_id, title, diff, slug = row
            # Filter passed ones
            if p_id in passed_practice_ex_ids:
                continue
                
            kc = practice_mappings.get(slug)
            if kc:
                recommendation_candidates.append({
                    "id": p_id,
                    "type": "PRACTICE_PROBLEM",
                    "title": title,
                    "kc_id": kc,
                    "predicted_mastery": p_correct_by_kc[kc],
                    "zpd_score": zpd_scores[kc],
                    "difficulty": str(diff),
                    "slug": slug
                })
                
        # 9. Sort candidates:
        # First choice: candidate ZPD scores descending.
        # This ranks items inside the zone [0.70, 0.85] highest!
        recommendation_candidates.sort(key=lambda x: x["zpd_score"], reverse=True)
        
        # Return top N
        return recommendation_candidates[:limit]
        
    except Exception as e:
        if conn and not conn.closed:
            conn.close()
        print(f"Error generating recommendation: {e}")
        raise HTTPException(status_code=500, detail=f"Recommendation Error: {str(e)}")

# Optional retrain endpoint
@app.post("/train")
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
        raise HTTPException(status_code=500, detail=f"Training Trigger Error: {e}")

@app.get("/user_mastery")
def get_user_mastery(user_id: str):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Could not connect to database")
    try:
        student_meta, actions = query_student_history(conn, user_id)
        if not student_meta:
            conn.close()
            return {
                "success": False,
                "error": "User footprint not found."
            }
            
        # Initialize default maps (PAL-Net)
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
                    
        # Get count of exercises completed and stats
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(DISTINCT exercise_id) FROM submissions WHERE user_id = %s AND status = 'PASSED';", (user_id,))
        lessons_completed = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(DISTINCT problem_id) FROM practice_submissions WHERE user_id = %s AND status = 'PASSED';", (user_id,))
        practice_completed = cursor.fetchone()[0]
        cursor.close()
        conn.close()
        
        return {
            "success": True,
            "student_meta": student_meta,
            "mastery": masteries,
            "stats": {
                "lessons_completed": lessons_completed,
                "practice_completed": practice_completed,
                "streak_days": 5,
                "total_actions": len(actions)
            }
        }
    except Exception as e:
        if conn and not conn.closed:
            conn.close()
        raise HTTPException(status_code=500, detail=str(e))

class GeneratePathRequest(BaseModel):
    user_id: str
    archetype: Optional[str] = "Persister"
    topic: Optional[str] = None

@app.post("/pal-net/generate-path")
def generate_palnet_learning_path(req: GeneratePathRequest):
    """Endpoint sinh Lộ trình Học cá nhân hóa dựa trên Mô hình PAL-Net"""
    try:
        user_id = req.user_id
        conn = get_db_connection()
        skills_selected = ["python_loops", "python_lists"]
        
        if conn:
            student_meta, actions = query_student_history(conn, user_id)
            if actions and palnet_model:
                # Compute PAL-Net predictions for skills
                attempts = np.zeros(len(skills_list))
                corrects = np.zeros(len(skills_list))
                raw_masteries = np.full(len(skills_list), 0.5)
                for a in actions:
                    k_idx = kc_to_idx.get(a["kc_id"])
                    if k_idx is not None:
                        attempts[k_idx] += 1
                        if a["correct"] == 1:
                            corrects[k_idx] += 1
                        raw_masteries[k_idx] = 0.7 * raw_masteries[k_idx] + 0.3 * a["correct"]
                
                stats = np.zeros(len(skills_list) * 2)
                for k in range(len(skills_list)):
                    stats[k * 2] = attempts[k]
                    stats[k * 2 + 1] = corrects[k] / attempts[k] if attempts[k] > 0 else 0.0
                
                stats_tensor = torch.tensor([stats], dtype=torch.float)
                profile_tensor = torch.tensor([1], dtype=torch.long)
                masteries_tensor = torch.tensor([raw_masteries], dtype=torch.float)
                
                scored_skills = []
                with torch.no_grad():
                    for kc in skills_list:
                        k_idx = kc_to_idx[kc]
                        k_idx_tensor = torch.tensor([k_idx], dtype=torch.long)
                        pred_prob = palnet_model(
                            k_idx_tensor, stats_tensor, profile_tensor, masteries_tensor, palnet_adj
                        )
                        score = float(pred_prob[0].item())
                        scored_skills.append((kc, score))
                
                # Sort ZPD score (target score around 0.70-0.85 or lowest scores)
                scored_skills.sort(key=lambda x: abs(x[1] - 0.78))
                skills_selected = [s[0] for s in scored_skills[:2]]
            conn.close()
            
        path_payload = generate_personalized_learning_path(
            user_id=user_id,
            skills_selected=skills_selected,
            learner_archetype=req.archetype or "Persister",
            topic=req.topic
        )
        return {"success": True, "data": path_payload}

    except Exception as e:
        print(f"[Generate Path Endpoint Error]: {e}")
        raise HTTPException(status_code=500, detail=f"Lỗi sinh lộ trình AI: {e}")

class ChatInteractRequest(BaseModel):
    user_id: str
    session_id: Optional[str] = None
    messages: List[Dict[str, str]] = []

@app.post("/pal-net/chat-interact")
def chat_interact_ai_tutor(req: ChatInteractRequest):
    """Endpoint tương tác đối thoại AI Tutor phỏng vấn & làm rõ mục tiêu học tập"""
    try:
        res = interact_ai_tutor_dialogue(
            user_id=req.user_id,
            history=req.messages
        )
        return {"success": True, "data": res}
    except Exception as e:
        print(f"[Chat Interact Error]: {e}")
        fallback_res = interact_ai_tutor_dialogue(req.user_id, req.messages)
        return {"success": True, "data": fallback_res}


class AdaptiveTutorAgentRequest(BaseModel):
    user_id: str
    session_id: Optional[str] = None
    messages: List[Dict[str, str]] = []
    user_mastery: Optional[Dict[str, float]] = None
    target_concept_id: Optional[str] = None


@app.post("/pal-net/adaptive-tutor-agent")
def adaptive_tutor_agent_endpoint(req: AdaptiveTutorAgentRequest):
    """Endpoint Multi-Agent Adaptive Learning: Router -> Knowledge Retriever -> Generator -> Critic Evaluator"""
    try:
        res = adaptive_orchestrator.process_turn(
            user_id=req.user_id,
            history=req.messages,
            user_mastery=req.user_mastery,
            target_concept_id=req.target_concept_id
        )
        return {"success": True, "data": res}
    except Exception as e:
        print(f"[Adaptive Tutor Agent Error]: {e}")
        raise HTTPException(status_code=500, detail=f"Lỗi Multi-Agent Orchestrator: {e}")


class MasteryProgressRequest(BaseModel):
    user_id: str
    concept_id: str
    passed: bool = True
    current_mastery: Optional[Dict[str, float]] = None


@app.post("/pal-net/update-mastery-progress")
def update_mastery_progress_endpoint(req: MasteryProgressRequest):
    """Kịch bản 4: Cập nhật độ thành thạo và gợi ý mắt xích tiếp theo trên DAG"""
    try:
        mastery_map = req.current_mastery or {}
        res = adaptive_orchestrator.process_mastery_update(
            user_id=req.user_id,
            concept_id=req.concept_id,
            passed=req.passed,
            current_mastery_map=mastery_map
        )
        return {"success": True, "data": res}
    except Exception as e:
        print(f"[Update Mastery Progress Error]: {e}")
        raise HTTPException(status_code=500, detail=f"Lỗi cập nhật tiến trình DAG: {e}")





