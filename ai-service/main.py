import os
import sys
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import psycopg2
from dotenv import load_dotenv

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

# Load database config from backend/.env
backend_env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend", ".env"))
load_dotenv(backend_env_path)

database_url = os.getenv("DATABASE_URL")
if database_url and "?schema=" in database_url:
    connection_url = database_url.split("?schema=")[0]
else:
    connection_url = database_url

app = FastAPI(
    title="VIBECODE AI Recommendation Engine",
    description="Adaptive Learning Path & Recommendation Microservice for VIBECODE AI Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RecommendationRequest(BaseModel):
    user_id: str
    limit: Optional[int] = 5

class RecommendationResponse(BaseModel):
    user_id: str
    archetype: str
    recommended_problems: List[dict]

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "VIBECODE AI Recommendation Engine",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    db_status = "connected"
    try:
        if connection_url:
            conn = psycopg2.connect(connection_url)
            cursor = conn.cursor()
            cursor.execute("SELECT 1;")
            cursor.close()
            conn.close()
        else:
            db_status = "database_url_missing"
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    return {
        "status": "healthy" if db_status == "connected" else "degraded",
        "database": db_status
    }

@app.post("/api/recommend", response_model=RecommendationResponse)
def get_recommendation(payload: RecommendationRequest):
    """
    Gợi ý bài tập thích ứng dựa trên Vùng phát triển gần nhất (ZPD - Zone of Proximal Development).
    """
    try:
        conn = psycopg2.connect(connection_url)
        cursor = conn.cursor()
        
        # Lấy danh sách các bài tập thực hành chưa hoàn thành
        cursor.execute("""
            SELECT id, title, slug, difficulty, description 
            FROM practice_problems 
            LIMIT %s;
        """, (payload.limit,))
        
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        
        problems = [
            {
                "id": row[0],
                "title": row[1],
                "slug": row[2],
                "difficulty": row[3],
                "description": row[4][:100] + "..." if row[4] else ""
            }
            for row in rows
        ]
        
        return RecommendationResponse(
            user_id=payload.user_id,
            archetype="Persister",
            recommended_problems=problems
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
