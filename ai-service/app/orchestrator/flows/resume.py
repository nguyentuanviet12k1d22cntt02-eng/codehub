from app.contracts.specification import ExerciseSpecification
from app.agents.critic_evaluator_agent import CriticEvaluatorAgent
from app.agents.explanation_tutor_agent import ExplanationTutorAgent
from app.pipeline.llm_client import PipelineError
from app.pipeline.runtime import digest
from app.pipeline.exercise_count import MAX_EXERCISES, requested_exercise_count
from app.validation.schema_validator import SchemaValidator
from app.validation.ast_constraint_validator import AstConstraintValidator


class ResumeFlowMixin:

    @staticmethod
    def _stage_output(report, agent):
        records = report.get("agent_traces", []) if isinstance(report, dict) else []
        for record in reversed(records):
            if record.get("agent") == agent and record.get("status") == "SUCCEEDED" and isinstance(record.get("output"), dict):
                return record["output"]
        return None

    def _resume_verified_candidate(self, report, trace_id, evidence, client, intent, result, user_text, context):
        """Resume the current statically valid draft, running any missing sandbox checks."""
        try:
            if report.get("rejected_current_candidate") is True:
                return None
            pending = context.get("pending_confirmation") if isinstance(context, dict) else None
            original_count = requested_exercise_count(pending.get("original_user_request", "")) if isinstance(pending, dict) else None
            explicit_count = requested_exercise_count(user_text, standalone=True)
            if (intent == "REQUEST_ADAPTIVE_EXERCISE" and explicit_count is None
                    and original_count is None
                    and not (isinstance(pending, dict) and pending.get("exercise_count_confirmed") is True)):
                return None
            spec_data = self._stage_output(report, "AdaptiveExercisePlanner")
            draft = self._stage_output(report, "ExerciseGeneratorAgent")
            theory = self._stage_output(report, "ExplanationTutorAgent")
            schema = self._stage_output(report, "SchemaValidator")
            constraints = self._stage_output(report, "ConstraintValidator")
            sandbox = self._stage_output(report, "SandboxValidator")
            if not all((spec_data, draft, schema and schema.get("passed"), constraints and constraints.get("passed"))):
                return None
            spec = ExerciseSpecification.model_validate(spec_data)
            if not SchemaValidator.validate(draft, spec)[0] or not AstConstraintValidator.validate(draft, spec)[0]:
                return None
            grounding = self._stage_output(report, "KnowledgeRetrievalService")
            previous_review = self._stage_output(report, "CriticEvaluatorAgent")
            if (previous_review and not previous_review.get("is_approved")
                    and previous_review.get("feedback_target") in ("EXERCISE", "BOTH")):
                return None
            if theory is None and not isinstance(grounding, dict):
                return None
            if not sandbox or not sandbox.get("passed"):
                def run_tests():
                    budget = self._sandbox_budget(draft, spec)
                    if client.remaining() < budget:
                        raise PipelineError("RUN_DEADLINE_EXCEEDED", "Chưa đủ thời gian chạy kiểm thử bản nháp đã lưu.")
                    passed, errors, tests = self.sandbox.validate(draft, spec, budget)
                    return {"passed": passed, "errors": errors, "test_results": tests, "harness_version": "adaptive_harness_v4"}
                sandbox = evidence.step("SandboxValidator", "ISOLATED_SANDBOX",
                    {"draft": draft, "specification": spec.model_dump(), "resumed": True}, run_tests)
                if not sandbox["passed"]:
                    return None
            evidence.step("ResumeCheckpointAgent", "DURABLE_STAGE_REUSE", {"prior_trace_id": report.get("trace_id"), "artifact_candidate_hash": digest(draft), "theory_reused": theory is not None},
                lambda: {"resumed_from": "SandboxValidator", "schema_passed": True, "constraint_passed": True, "sandbox_passed": True, "theory_reused": theory is not None})
            if theory is None:
                theory = evidence.step("ExplanationTutorAgent", "LLM", {"specification": spec.model_dump(), "grounding": grounding, "resumed": True},
                    lambda: ExplanationTutorAgent(client).explain(spec.target_concept, spec.concept_title, spec.language, user_text,
                        {"specification": spec.model_dump(), **grounding, "exercise": draft}), 1)
            review = evidence.step("CriticEvaluatorAgent", "LLM", {"theory": theory, "draft": draft, "specification": spec.model_dump(), "resumed": True},
                lambda: CriticEvaluatorAgent(client).evaluate_content(theory["reply"], draft, spec, verified_contract=True), 1)
            # A checkpoint can contain a verified exercise paired with an
            # earlier theory version (for example when a repair call timed
            # out). Repair that smaller artifact in place instead of failing
            # every durable retry on the same compatibility finding.
            for repair_attempt in range(2, 4):
                if review["is_approved"] or review["feedback_target"] != "THEORY" or not isinstance(grounding, dict):
                    break
                previous_theory = theory
                theory = evidence.step("ExplanationTutorAgent", "LLM",
                    {"specification": spec.model_dump(), "grounding": grounding, "exercise": draft,
                     "feedback": review, "previous_theory": previous_theory, "resumed": True},
                    lambda: ExplanationTutorAgent(client).explain(
                        spec.target_concept, spec.concept_title, spec.language, user_text,
                        {"specification": spec.model_dump(), **grounding, "exercise": draft,
                         "previous_theory": previous_theory}, review), repair_attempt)
                review = evidence.step("CriticEvaluatorAgent", "LLM",
                    {"theory": theory, "draft": draft, "specification": spec.model_dump(), "resumed": True},
                    lambda: CriticEvaluatorAgent(client).evaluate_content(theory["reply"], draft, spec, verified_contract=True), repair_attempt)
            if not review["is_approved"]:
                if review["feedback_target"] in ("EXERCISE", "BOTH"):
                    # The verified checkpoint itself needs replacement. Let
                    # the normal bounded workflow create and validate a fresh
                    # candidate in this same run instead of persisting a dead
                    # checkpoint across retries.
                    return None
                return result("FAILED", "Pipeline dừng tại bước chưa đạt. Bạn có thể xem dẫn chứng và lỗi cụ thể bên dưới.",
                    error={"code": "CRITIC_REJECTED_AFTER_RESUME", "message": review.get("feedback", "Critic chưa duyệt candidate đã lưu.")})
            artifact = self._verified_artifact(draft, spec, theory, trace_id)
            evidence.step("PublicationGate", "DETERMINISTIC_GATE", {"artifact_hash": artifact["artifact_hash"], "resumed": True},
                lambda: {"approved": True, "validation_attempt": "resumed", "critic_score": review["score"], "artifact_hash": artifact["artifact_hash"]})
            prefix = "Bài khởi đầu cho lộ trình" if intent == "CREATE_LEARNING_PATH" else "Bài tập"
            count = (explicit_count if explicit_count is not None else
                     original_count if original_count is not None else
                     (pending.get("exercise_count") if isinstance(pending, dict) else None) or
                     report.get("exercise_count") or 1)
            count = min(MAX_EXERCISES, count) if intent == "REQUEST_ADAPTIVE_EXERCISE" else 1
            return result("SUCCEEDED", f"{prefix} **{artifact['title']}** đã qua kiểm thử và thẩm định.", artifact,
                exercise_count=count,
                suggested_options=[] if count > 1 else ["Cho tôi bài dễ hơn", "Giải thích thêm lý thuyết", "Tạo bài tiếp theo"])
        except Exception:
            raise
