from __future__ import annotations

import asyncio
import hmac
import logging
import re
import uuid

from fastapi import FastAPI, Header, HTTPException, Request, status
from fastapi.responses import JSONResponse

from .config import Settings
from .executor import DockerExecutor, GraderInfrastructureError
from .models import ExecuteRequest, ExecuteResponse, HealthResponse


logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger("grader-service")
settings = Settings.from_env()
executor = DockerExecutor(settings)
slots = asyncio.Semaphore(settings.max_concurrency)
pending_lock = asyncio.Lock()
pending_requests = 0
app = FastAPI(
    title="LearnPython AWS Docker Grader",
    version="1.0.0",
    docs_url=None,
    redoc_url=None,
    openapi_url=None,
)


def _authorize(authorization: str | None) -> None:
    if len(settings.api_token) < 32 or settings.api_token.startswith("replace-with-"):
        raise HTTPException(status_code=503, detail="Grader authentication is not configured")
    prefix = "Bearer "
    if not authorization or not authorization.startswith(prefix):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
    if not hmac.compare_digest(authorization[len(prefix):], settings.api_token):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")


@app.exception_handler(GraderInfrastructureError)
async def infrastructure_error_handler(_request: Request, exc: GraderInfrastructureError) -> JSONResponse:
    logger.error("grader infrastructure failure: %s", exc)
    return JSONResponse(status_code=503, content={"detail": "Grading infrastructure is unavailable"})


@app.get("/health/live", response_model=HealthResponse)
async def live() -> HealthResponse:
    return HealthResponse(status="ok")


@app.get("/health/ready", response_model=HealthResponse, response_model_by_alias=True)
async def ready() -> HealthResponse:
    available, missing = await asyncio.to_thread(executor.readiness)
    if not available:
        raise HTTPException(status_code=503, detail={"status": "not_ready", "missingImages": missing})
    return HealthResponse(status="ready", docker="ok", missingImages=[])


@app.post("/v1/execute", response_model=ExecuteResponse, response_model_by_alias=True)
async def execute(
    payload: ExecuteRequest,
    authorization: str | None = Header(default=None),
    x_request_id: str | None = Header(default=None),
) -> ExecuteResponse:
    global pending_requests
    _authorize(authorization)
    request_id = x_request_id if x_request_id and re.fullmatch(r"[A-Za-z0-9_.-]{8,80}", x_request_id) else str(uuid.uuid4())
    async with pending_lock:
        if pending_requests >= settings.max_concurrency + settings.max_queue:
            raise HTTPException(status_code=429, detail="Grading queue is full")
        pending_requests += 1
    acquired = False
    try:
        try:
            await asyncio.wait_for(slots.acquire(), timeout=settings.queue_timeout_seconds)
            acquired = True
        except TimeoutError as exc:
            raise HTTPException(status_code=429, detail="Grading queue is full") from exc
        logger.info("request=%s language=%s tests=%d", request_id, payload.language.value, len(payload.inputs))
        return await asyncio.to_thread(executor.execute, payload, request_id)
    finally:
        if acquired:
            slots.release()
        async with pending_lock:
            pending_requests -= 1

