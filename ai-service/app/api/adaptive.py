import json
import queue
import threading
from typing import Any
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from app.pipeline.runtime import verify_signature
from app.orchestrator.adaptive_learning_orchestrator import AdaptiveLearningOrchestrator

router = APIRouter()
slots = threading.BoundedSemaphore(4)
MAX_ADAPTIVE_REQUEST_BYTES = 150000


class AdaptiveRequest(BaseModel):
    user_id: str
    session_id: str | None = None
    messages: list[dict[str, Any]] = Field(default_factory=list, max_length=30)
    language: str | None = None
    target_concept_id: str | None = None
    learner_context: dict[str, Any] = Field(default_factory=dict)
    trace_id: str | None = None
    # Internal-only checkpoint supplied by the backend retry worker.  It is
    # never accepted from browser payloads because this endpoint requires the
    # signed backend request.
    resume_report: dict[str, Any] | None = None
    run_attempt: int = Field(default=1, ge=1, le=3)
    sequence_offset: int = Field(default=0, ge=0, le=500)


async def parse_request(request):
    raw = await request.body()
    if len(raw) > MAX_ADAPTIVE_REQUEST_BYTES:
        raise HTTPException(413, "Adaptive request payload is too large")
    if not verify_signature(raw, request.headers.get("X-Adaptive-Time"), request.headers.get("X-Adaptive-Signature")):
        raise HTTPException(401, "Invalid internal request signature")
    return AdaptiveRequest.model_validate_json(raw)


def run(payload, callback=None):
    return AdaptiveLearningOrchestrator().process_turn(user_id=payload.user_id, history=payload.messages,
        language=payload.language, target_concept_id=payload.target_concept_id, learner_context=payload.learner_context,
        trace_id=payload.trace_id, event_callback=callback, resume_report=payload.resume_report,
        run_attempt=payload.run_attempt, sequence_offset=payload.sequence_offset)


@router.post("/pal-net/adaptive-tutor-agent")
@router.post("/pal-net/adaptive-tutor-agent-v2")
async def adaptive(request: Request):
    payload = await parse_request(request)
    if not slots.acquire(blocking=False):
        raise HTTPException(429, "Pipeline capacity reached")
    try:
        from starlette.concurrency import run_in_threadpool
        return {"success": True, "data": await run_in_threadpool(run, payload)}
    finally:
        slots.release()


@router.post("/pal-net/adaptive-tutor-agent/stream")
async def stream(request: Request):
    payload = await parse_request(request)
    if not slots.acquire(blocking=False):
        raise HTTPException(429, "Pipeline capacity reached")
    events = queue.Queue()
    def worker():
        try:
            result = run(payload, events.put)
            events.put({"type": "complete", "data": result})
        except Exception:
            events.put({"type": "error", "error": "PIPELINE_WORKER_FAILED", "trace_id": payload.trace_id})
        finally:
            events.put(None)
            slots.release()
    threading.Thread(target=worker, daemon=True).start()
    def chunks():
        while True:
            try:
                event = events.get(timeout=10)
            except queue.Empty:
                yield ": heartbeat\n\n"
                continue
            if event is None:
                return
            yield "data: " + json.dumps(event, ensure_ascii=False, default=str) + "\n\n"
    return StreamingResponse(chunks(), media_type="text/event-stream", headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})
