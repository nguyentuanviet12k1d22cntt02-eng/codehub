from app.agents.clarification_agent import ClarificationAgent
from app.pipeline.llm_client import PipelineError
from app.pipeline.evidence import now

class TurnContext:
    """Per-turn result/evidence state; it never outlives one process_turn call."""
    def __init__(self, trace_id, evidence, started_at, user_text, resume_report, review_mode):
        self.trace_id = trace_id
        self.evidence = evidence
        self.started_at = started_at
        self.user_text = user_text
        self.resume_report = resume_report
        self.review_mode = review_mode
        self.intent = (resume_report or {}).get("intent")
        self.exercise_count = None
        self.prior_records = list((resume_report or {}).get("agent_traces", [])) if review_mode else []
        self.reusable_records = [record for record in self.prior_records
                                if record.get("status") in ("SUCCEEDED", "REJECTED") and "output" in record]
        self.reuse_cursor = 0
        self.spec = None

    def result(self, status, reply, exercise=None, **extra):
        return {"trace_id": self.trace_id, "schema_version": "4.0", "status": status, "intent": self.intent,
                "reply": reply, "exercise": exercise,
                "agent_traces": [*self.prior_records, *self.evidence.records] if self.review_mode else self.evidence.records,
                "started_at": (self.resume_report or {}).get("started_at", self.started_at),
                "ended_at": now(), "fallback_used": False,
                **({"exercise_count": self.exercise_count} if self.exercise_count is not None else {}), **extra}

    def stage(self, agent, method, inputs, work, attempt=1, hydrate=None):
        """Reuse a legacy checkpoint when present, then continue without a review pause."""
        if self.review_mode and self.reuse_cursor < len(self.reusable_records):
            record = self.reusable_records[self.reuse_cursor]
            if record.get("agent") != agent or int(record.get("stage_attempt", record.get("attempt", 1))) != int(attempt):
                raise PipelineError(
                    "REVIEW_CHECKPOINT_MISMATCH",
                    f"Checkpoint mong đợi {record.get('agent')} nhưng pipeline yêu cầu {agent}.",
                )
            self.reuse_cursor += 1
            value = record.get("output")
            return hydrate(value) if hydrate else value
        value = self.evidence.step(agent, method, inputs, work, attempt)
        return value

    def clarify(self, reason, routing=None):
        source_text = routing.user_text if routing is not None else self.user_text
        selected_language = routing.language if routing is not None else None
        question = self.stage("ClarificationAgent", "RULE_POLICY", {
            "request": source_text, "reason": reason,
            "routing": routing.model_dump() if routing is not None else None},
            lambda: ClarificationAgent().ask(source_text, reason, routing, {}))
        return self.result("AWAITING_CONFIRMATION", question["question"],
            pending_confirmation={"type": "ROUTING_CLARIFICATION",
                "original_user_request": source_text,
                "original_intent": routing.intent if routing is not None else None,
                "language": selected_language if routing is not None and routing.language_confirmed else None,
                "requested_topic": routing.requested_topic if routing is not None else None},
            suggested_options=question["suggested_options"])
