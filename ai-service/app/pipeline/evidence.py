import threading
import time
import uuid
from datetime import datetime, timezone
from app.pipeline.runtime import digest


def now():
    return datetime.now(timezone.utc).isoformat()


class EvidenceRecorder:
    def __init__(self, trace_id, callback=None, client=None, run_attempt=1, sequence_offset=0):
        self.trace_id = trace_id
        self.callback = callback
        self.client = client
        self.run_attempt = max(1, int(run_attempt or 1))
        self.sequence_offset = max(0, int(sequence_offset or 0))
        self.records = []
        self.lock = threading.Lock()

    def emit(self, payload):
        if self.callback:
            self.callback(payload)

    def step(self, agent, method, inputs, work, attempt=1):
        stage_attempt = int(attempt)
        record = {"id": str(uuid.uuid4()), "trace_id": self.trace_id, "agent": agent, "method": method,
                  "attempt": stage_attempt, "stage_attempt": stage_attempt, "run_attempt": self.run_attempt,
                  "status": "RUNNING", "started_at": now(), "input": inputs, "input_hash": digest(inputs)}
        with self.lock:
            record["sequence"] = self.sequence_offset + len(self.records) + 1
            self.records.append(record)
        self.emit({"type": "agent_step", "agent": agent, "title": agent, "step": "RUNNING", "trace_id": self.trace_id, "record": dict(record)})
        start = time.monotonic()
        try:
            value = work()
            output = value.model_dump() if hasattr(value, "model_dump") else value
            record.update(status="SUCCEEDED", output=output, output_hash=digest(output))
            if isinstance(output, dict) and (output.get("approved") is False or output.get("is_approved") is False or output.get("passed") is False):
                record["status"] = "REJECTED"
            return value
        except Exception as exc:
            record.update(status="FAILED", error={"code": getattr(exc, "code", "STAGE_FAILED"), "message": str(exc)[:1000]})
            raise
        finally:
            record.update(ended_at=now(), duration_ms=round((time.monotonic() - start) * 1000))
            if self.client:
                record["model_calls"] = [c for c in self.client.calls if c["stage"] == agent and c not in [x for r in self.records if r is not record for x in r.get("model_calls", [])]]
            self.emit({"type": "agent_step", "agent": agent, "title": agent, "step": record["status"], "trace_id": self.trace_id, "record": dict(record)})
