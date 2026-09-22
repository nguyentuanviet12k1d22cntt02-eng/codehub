"""Lightweight entrypoint for the exercise pipeline; PAL-Net weights are not required."""
from fastapi import FastAPI
from app.api.adaptive import router

app = FastAPI(title="Adaptive exercise pipeline", version="4.0")
app.include_router(router)

@app.get("/health")
def health():
    return {"status": "ready", "pipeline_version": "4.0", "fallback_enabled": False}
