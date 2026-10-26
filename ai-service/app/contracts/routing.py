import uuid
from typing import Optional, Literal
from pydantic import BaseModel, ConfigDict, Field

class RoutingDecision(BaseModel):
    model_config = ConfigDict(extra="forbid", strict=True)
    intent: Literal["GENERAL_CHAT", "OUT_OF_SCOPE", "CLARIFY_LEARNING_MODE", "EXPLAIN_CONCEPT", "ASK_KNOWLEDGE", "REQUEST_ADAPTIVE_EXERCISE", "CREATE_LEARNING_PATH", "CHECK_WEAKNESS"]
    # A language is intentionally absent until the learner explicitly states
    # one or a non-default session context establishes it.  The router must
    # never turn the application's default Python preference into user intent.
    language: Optional[Literal["python", "javascript", "cpp", "sql"]] = Field(...)
    topic: Optional[str] = Field(...)
    topic_match: Literal["matched", "unmatched", "unspecified"] = "unspecified"
    requested_topic: Optional[str] = None
    topic_evidence: list[str] = Field(default_factory=list)
    required_constructs: list[str] = Field(default_factory=list)
    forbidden_constructs: list[str] = Field(default_factory=list)
    ordered_output: bool = False
    confirm_prerequisite_override: bool = False
    language_confirmed: bool = True
    difficulty_request: Literal["easier", "same", "harder", "auto"] = "auto"
    mode: Literal["remediation", "progression", "diagnostic"] = "progression"
    selection_mode: Literal["adaptive", "explicit"] = "adaptive"
    confidence: float = Field(default=1.0, ge=0, le=1)
    user_text: str = ""
    trace_id: str = Field(default_factory=lambda: f"trace_{uuid.uuid4().hex}")
