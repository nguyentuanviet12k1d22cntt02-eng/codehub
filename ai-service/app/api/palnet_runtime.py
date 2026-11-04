"""Signed internal PAL-Net advisory API; never accepts browser-supplied grades."""
import hashlib
from datetime import datetime
import re
from typing import Literal
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field, ConfigDict, StrictBool, field_validator
from starlette.concurrency import run_in_threadpool
from app.pipeline.runtime import verify_signature, signed_headers
from app.recommendation.python70_runtime import infer
from app.api.palnet_module_contract import PredictionRequestV2
from app.recommendation.module_practice_runtime import infer as infer_module, ContractError

router = APIRouter(prefix="/internal/palnet", tags=["PAL-Net advisory"])
class Feedback(BaseModel):
    model_config = ConfigDict(extra="forbid")
    event_id: str = Field(min_length=1, max_length=100)
    item_id: str = Field(min_length=1, max_length=100)
    content_version: str = Field(pattern=r"^python-content-v1:[a-f0-9]{64}$")
    skill_id: str = Field(pattern=r"^PY-[A-Z0-9-]+$", max_length=60)
    correct: StrictBool
    feedback_ready_at: datetime
    @field_validator("feedback_ready_at")
    @classmethod
    def aware(cls, value):
        if value.tzinfo is None:
            raise ValueError("Timezone required")
        return value
class PredictionRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    schema_version: Literal["palnet-advisory-request/1.0"]
    request_id: str = Field(min_length=1, max_length=100)
    user_id: str = Field(min_length=1, max_length=100)
    language: Literal["PYTHON"]
    goal_id: Literal["GOAL_PY_BASICS"]
    graph_version: Literal["2.1"]
    graph_sha256: str = Field(pattern=r"^[a-f0-9]{64}$")
    cutoff: datetime
    target_skill_ids: list[str] = Field(min_length=1, max_length=35)
    history: list[Feedback] = Field(max_length=2000)
    @field_validator("cutoff")
    @classmethod
    def aware(cls, value):
        if value.tzinfo is None:
            raise ValueError("Timezone required")
        return value
    @field_validator("target_skill_ids")
    @classmethod
    def unique(cls, value):
        if len(value) != len(set(value)):
            raise ValueError("Duplicate skill")
        return value

@router.post("/predict")
async def predict(request: Request):
    raw = bytearray()
    async for chunk in request.stream():
        if len(raw) + len(chunk) > 1_000_000:
            raise HTTPException(413, "PAYLOAD_TOO_LARGE")
        raw.extend(chunk)
    body = bytes(raw)
    if not verify_signature(body, request.headers.get("X-Adaptive-Time"), request.headers.get("X-Adaptive-Signature")):
        raise HTTPException(401, "INVALID_INTERNAL_SIGNATURE")
    try:
        import json
        data = json.loads(body)
        if not isinstance(data, dict):raise ValueError('Invalid object')
        payload = PredictionRequestV2.model_validate(data) if data.get('schema_version') == 'palnet-advisory-request/2.0' else PredictionRequest.model_validate(data)
    except ValueError:
        raise HTTPException(422, "INVALID_PREDICTION_CONTRACT")
    try:
        result = await run_in_threadpool(infer_module if isinstance(payload, PredictionRequestV2) else infer, payload)
    except ContractError:
        raise HTTPException(422, "INVALID_MODULE_PRACTICE_CONTRACT")
    except (OSError, ValueError, RuntimeError, KeyError):
        # Do not return filesystem paths, checkpoint contents or user history.
        raise HTTPException(503, "PALNET_UNAVAILABLE")
    result.update(request_id=payload.request_id, user_id=payload.user_id,
                  input_sha256=hashlib.sha256(body).hexdigest())
    from starlette.responses import Response
    import json
    serialized = json.dumps(result, ensure_ascii=False, separators=(",", ":"))
    return Response(serialized, media_type="application/json", headers=signed_headers(serialized))

