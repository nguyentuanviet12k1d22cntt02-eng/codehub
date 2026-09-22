import uuid
from typing import Optional, Literal
from pydantic import BaseModel, Field

class RoutingDecision(BaseModel):
    intent: Literal["GENERAL_CHAT", "EXPLAIN_CONCEPT", "ASK_KNOWLEDGE", "REQUEST_ADAPTIVE_EXERCISE", "CREATE_LEARNING_PATH", "CHECK_WEAKNESS"]
    language: Literal["python", "javascript", "cpp", "sql"]
    topic: Optional[str] = Field(...)
    difficulty_request: Literal["easier", "same", "harder", "auto"] = "auto"
    mode: Literal["remediation", "progression", "diagnostic"] = "progression"
    selection_mode: Literal["adaptive", "explicit"] = "adaptive"
    confidence: float = Field(default=1.0, ge=0, le=1)
    user_text: str = ""
    trace_id: str = Field(default_factory=lambda: f"trace_{uuid.uuid4().hex}")
