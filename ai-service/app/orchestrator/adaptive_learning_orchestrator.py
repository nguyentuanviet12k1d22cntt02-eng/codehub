import uuid
from app.contracts.specification import ExerciseSpecification
from app.agents.intent_router_agent import IntentRouterAgent
from app.agents.adaptive_exercise_planner import AdaptiveExercisePlanner
from app.agents.exercise_generator_agent import ExerciseGeneratorAgent
from app.agents.critic_evaluator_agent import CriticEvaluatorAgent
from app.agents.explanation_tutor_agent import ExplanationTutorAgent
from app.services.knowledge_graph_service import KnowledgeGraphService
from app.pipeline.grounding import GroundingService
from app.pipeline.llm_client import PipelineLLMClient, PipelineError
from app.pipeline.evidence import EvidenceRecorder, now
from app.pipeline.runtime import digest
from app.validation.schema_validator import SchemaValidator
from app.validation.ast_constraint_validator import AstConstraintValidator
from app.validation.sandbox_validator import SandboxValidator


class AdaptiveLearningOrchestrator:
    """One bounded workflow for every generated exercise; no legacy/template fallback."""
    def __init__(self, client_factory=PipelineLLMClient, sandbox=SandboxValidator):
        self.client_factory = client_factory
        self.sandbox = sandbox
        self.kg = KnowledgeGraphService()

    def process_turn(self, user_id, history, user_mastery=None, target_concept_id=None,
                     language=None, event_callback=None, learner_context=None, trace_id=None, resume_report=None,
                     run_attempt=1, sequence_offset=0):
        trace_id = trace_id or f"trace_{uuid.uuid4().hex}"
        client = self.client_factory()
        evidence = EvidenceRecorder(trace_id, event_callback, client, run_attempt=run_attempt, sequence_offset=sequence_offset)
        started_at = now()
        context = learner_context or {}
        user_text = next((m.get("content", "") for m in reversed(history) if m.get("sender", "").upper() in ("USER", "HUMAN")), "")
        intent = (resume_report or {}).get("intent")

        def result(status, reply, exercise=None, **extra):
            return {"trace_id": trace_id, "schema_version": "4.0", "status": status, "intent": intent,
                    "reply": reply, "exercise": exercise, "agent_traces": evidence.records,
                    "started_at": started_at, "ended_at": now(), "fallback_used": False, **extra}

        try:
            if resume_report:
                resumed = self._resume_verified_candidate(resume_report, trace_id, evidence, client, intent, result, user_text)
                if resumed is not None:
                    return resumed
            routing = evidence.step("IntentRouterAgent", "RULES_OR_LLM", {"request": user_text, "language": language, "last_concept_id": context.get("last_concept_id")},
                lambda: IntentRouterAgent(client).route(user_text, {**context, "language": language or context.get("language", "python")}, trace_id))
            intent = routing.intent
            if intent in ("GENERAL_CHAT", "EXPLAIN_CONCEPT", "ASK_KNOWLEDGE", "CHECK_WEAKNESS"):
                if intent == "CHECK_WEAKNESS":
                    data = evidence.step("LearnerStateService", "DATABASE_SNAPSHOT", {"language": routing.language},
                        lambda: {"states": context.get("states", {}), "source": "PostgreSQL"})
                    reply = "Chưa có đủ bằng chứng làm bài để kết luận điểm yếu."
                    observed = [(cid, s) for cid, s in data["states"].items() if s.get("attempts", 0) > 0 and self.kg.get_concept(routing.language, cid)]
                    if observed:
                        weakest = sorted(observed, key=lambda p: p[1]["mastery"])[:3]
                        reply = "Các kỹ năng cần củng cố theo kết quả đã lưu:\n" + "\n".join(f"- {cid}: {s['mastery']:.0%}, {s['attempts']} lượt làm." for cid, s in weakest)
                    return result("SUCCEEDED", reply)
                if intent == "ASK_KNOWLEDGE":
                    concepts = evidence.step("KnowledgeRetrievalService", "LOCAL_GRAPH", {"language": routing.language},
                        lambda: self.kg.list_all_concepts(routing.language))
                    return result("SUCCEEDED", "\n".join(f"- **{c['id']}**: {c.get('name', '')}" for c in concepts))
                if intent == "GENERAL_CHAT":
                    response = evidence.step("GeneralChatAgent", "LLM", {"request": user_text},
                        lambda: client.json("GeneralChatAgent", 'Bạn là trợ lý học lập trình Mcode. Trả JSON {"reply":"câu trả lời tiếng Việt"}. Trả lời đúng câu hỏi, định hướng học Python/JS/C++/SQL; không tự tạo bài tập.', {"request": user_text}))
                    return result("SUCCEEDED", response["reply"])
                spec = evidence.step("AdaptiveExercisePlanner", "RULE_POLICY", {"routing": routing.model_dump()},
                    lambda: AdaptiveExercisePlanner(self.kg).plan_exercise(routing, user_id, target_concept_id, context))
                grounding = evidence.step("KnowledgeRetrievalService", "LOCAL_GRAPH_AND_FILES", {"concept_id": spec.target_concept},
                    lambda: GroundingService().retrieve(spec, self.kg))
                theory = evidence.step("ExplanationTutorAgent", "LLM", {"specification": spec.model_dump(), "grounding": grounding},
                    lambda: ExplanationTutorAgent(client).explain(spec.target_concept, spec.concept_title, spec.language, user_text, {"specification": spec.model_dump(), **grounding}))
                return result("SUCCEEDED", theory["reply"])

            spec = evidence.step("AdaptiveExercisePlanner", "RULE_POLICY", {"routing": routing.model_dump(), "learner_context": context},
                lambda: AdaptiveExercisePlanner(self.kg).plan_exercise(routing, user_id, target_concept_id, context))
            grounding = evidence.step("KnowledgeRetrievalService", "LOCAL_GRAPH_AND_FILES", {"language": spec.language, "concept_id": spec.target_concept},
                lambda: GroundingService().retrieve(spec, self.kg))
            spec.source_refs = [{"id": s["id"], "sha256": s["sha256"]} for s in grounding["sources"]]
            theory, draft, feedback = None, None, None
            repair_target = "BOTH"
            generator, explainer, critic = ExerciseGeneratorAgent(client), ExplanationTutorAgent(client), CriticEvaluatorAgent(client)

            for attempt in range(1, 4):
                client.remaining()
                def make_theory():
                    return evidence.step("ExplanationTutorAgent", "LLM",
                        {"specification": spec.model_dump(), "grounding": grounding, "feedback": feedback, "previous_theory": theory},
                        lambda: explainer.explain(spec.target_concept, spec.concept_title, spec.language, user_text,
                            {"specification": spec.model_dump(), **grounding, "previous_theory": theory}, feedback), attempt)
                def make_exercise():
                    return evidence.step("ExerciseGeneratorAgent", "LLM",
                        {"specification": spec.model_dump(), "feedback": feedback, "previous_draft": draft},
                        lambda: generator.generate(spec, feedback, draft), attempt)
                if repair_target in ("BOTH", "EXERCISE"):
                    draft = make_exercise()

                def schema_check():
                    passed, errors = SchemaValidator.validate(draft, spec)
                    return {"passed": passed, "errors": errors, "schema_version": "4.0"}
                schema = evidence.step("SchemaValidator", "PYDANTIC_AND_RULES", {"draft": draft, "specification": spec.model_dump()}, schema_check, attempt)
                if not schema["passed"]:
                    feedback, repair_target = schema, "EXERCISE"
                    continue
                def syntax_check():
                    passed, errors = AstConstraintValidator.validate(draft, spec)
                    return {"passed": passed, "errors": errors, "scope": "python_ast_or_language_tokens"}
                syntax = evidence.step("ConstraintValidator", "STATIC_ANALYSIS", {"reference_solution": draft["reference_solution"], "specification": spec.model_dump()}, syntax_check, attempt)
                if not syntax["passed"]:
                    feedback, repair_target = syntax, "EXERCISE"
                    continue
                def run_tests():
                    passed, errors, tests = self.sandbox.validate(draft, spec, min(90, client.remaining()))
                    return {"passed": passed, "errors": errors, "test_results": tests, "harness_version": "adaptive_harness_v4"}
                validation = evidence.step("SandboxValidator", "DOCKER_EXECUTION", {"draft": draft, "specification": spec.model_dump()}, run_tests, attempt)
                if not validation["passed"]:
                    feedback, repair_target = validation, "EXERCISE"
                    continue
                # Generate/revise theory only after the candidate source has
                # passed the deterministic checks. This prevents simultaneous
                # high-token calls from exhausting the same provider key.
                # A failed exercise repair leaves `repair_target` as EXERCISE,
                # but theory has not been generated yet because it is deferred
                # until the deterministic candidate checks pass.
                if theory is None or repair_target in ("BOTH", "THEORY"):
                    theory = make_theory()
                review = evidence.step("CriticEvaluatorAgent", "LLM", {"theory": theory, "draft": draft, "specification": spec.model_dump()},
                    lambda: critic.evaluate_content(theory["reply"], draft, spec), attempt)
                if not review["is_approved"]:
                    feedback, repair_target = review, review["feedback_target"]
                    continue
                artifact = self._verified_artifact(draft, spec, theory, trace_id)
                evidence.step("PublicationGate", "DETERMINISTIC_GATE", {"artifact_hash": artifact["artifact_hash"]},
                    lambda: {"approved": True, "validation_attempt": attempt, "critic_score": review["score"], "artifact_hash": artifact["artifact_hash"]})
                prefix = "Bài khởi đầu cho lộ trình" if intent == "CREATE_LEARNING_PATH" else "Bài tập"
                return result("SUCCEEDED", f"{prefix} **{artifact['title']}** đã qua kiểm thử và thẩm định. {spec.reasoning}", artifact,
                    suggested_options=["Cho tôi bài dễ hơn", "Giải thích thêm lý thuyết", "Tạo bài tiếp theo"])
            raise PipelineError("REPAIR_LIMIT_REACHED", "Các bước kiểm định chưa đạt sau 3 bản sinh; xem dẫn chứng từng lượt.")
        except Exception as exc:
            return result("FAILED", "Pipeline dừng tại bước chưa đạt. Bạn có thể xem dẫn chứng và lỗi cụ thể bên dưới.",
                error={"code": getattr(exc, "code", "PIPELINE_FAILED"), "message": str(exc)[:1000], "details": getattr(exc, "details", {})})

    @staticmethod
    def _stage_output(report, agent):
        records = report.get("agent_traces", []) if isinstance(report, dict) else []
        for record in reversed(records):
            if record.get("agent") == agent and record.get("status") == "SUCCEEDED" and isinstance(record.get("output"), dict):
                return record["output"]
        return None

    @staticmethod
    def _verified_artifact(draft, spec, theory, trace_id):
        artifact = {**draft, "exercise_id": str(uuid.uuid4()), "language": spec.language,
            "concept_id": spec.target_concept, "concept_name": spec.concept_title,
            "difficulty": spec.difficulty, "difficulty_stars": ["EASY", "MEDIUM", "HARD", "CHALLENGE"].index(spec.difficulty) + 1,
            "execution": spec.execution, "spec_snapshot": spec.model_dump(), "trace_id": trace_id,
            "theoryContent": theory["reply"], "qc_status": "VERIFIED", "harness_version": "adaptive_harness_v4"}
        artifact["artifact_hash"] = digest(artifact)
        return artifact

    def _resume_verified_candidate(self, report, trace_id, evidence, client, intent, result, user_text):
        """Resume only from a stored candidate that already passed sandbox.

        It can reuse theory and resume at Critic, or generate the missing
        theory against the verified candidate. Returning None deliberately
        starts a fresh real generation for incomplete checkpoints; it never
        fabricates a draft or validation.
        """
        try:
            spec_data = self._stage_output(report, "AdaptiveExercisePlanner")
            draft = self._stage_output(report, "ExerciseGeneratorAgent")
            theory = self._stage_output(report, "ExplanationTutorAgent")
            schema = self._stage_output(report, "SchemaValidator")
            constraints = self._stage_output(report, "ConstraintValidator")
            sandbox = self._stage_output(report, "SandboxValidator")
            if not all((spec_data, draft, theory, schema and schema.get("passed"), constraints and constraints.get("passed"), sandbox and sandbox.get("passed"))):
                if not all((spec_data, draft, schema and schema.get("passed"), constraints and constraints.get("passed"), sandbox and sandbox.get("passed"))):
                    return None
            spec = ExerciseSpecification.model_validate(spec_data)
            grounding = self._stage_output(report, "KnowledgeRetrievalService")
            if theory is None and not isinstance(grounding, dict):
                return None
            evidence.step("ResumeCheckpointAgent", "DURABLE_STAGE_REUSE", {"prior_trace_id": report.get("trace_id"), "artifact_candidate_hash": digest(draft), "theory_reused": theory is not None},
                lambda: {"resumed_from": "SandboxValidator", "schema_passed": True, "constraint_passed": True, "sandbox_passed": True, "theory_reused": theory is not None})
            if theory is None:
                theory = evidence.step("ExplanationTutorAgent", "LLM", {"specification": spec.model_dump(), "grounding": grounding, "resumed": True},
                    lambda: ExplanationTutorAgent(client).explain(spec.target_concept, spec.concept_title, spec.language, user_text,
                        {"specification": spec.model_dump(), **grounding}), 1)
            review = evidence.step("CriticEvaluatorAgent", "LLM", {"theory": theory, "draft": draft, "specification": spec.model_dump(), "resumed": True},
                lambda: CriticEvaluatorAgent(client).evaluate_content(theory["reply"], draft, spec), 1)
            if not review["is_approved"]:
                return result("FAILED", "Pipeline dừng tại bước chưa đạt. Bạn có thể xem dẫn chứng và lỗi cụ thể bên dưới.",
                    error={"code": "CRITIC_REJECTED_AFTER_RESUME", "message": review.get("feedback", "Critic chưa duyệt candidate đã lưu.")})
            artifact = self._verified_artifact(draft, spec, theory, trace_id)
            evidence.step("PublicationGate", "DETERMINISTIC_GATE", {"artifact_hash": artifact["artifact_hash"], "resumed": True},
                lambda: {"approved": True, "validation_attempt": "resumed", "critic_score": review["score"], "artifact_hash": artifact["artifact_hash"]})
            prefix = "Bài khởi đầu cho lộ trình" if intent == "CREATE_LEARNING_PATH" else "Bài tập"
            return result("SUCCEEDED", f"{prefix} **{artifact['title']}** đã qua kiểm thử và thẩm định.", artifact,
                suggested_options=["Cho tôi bài dễ hơn", "Giải thích thêm lý thuyết", "Tạo bài tiếp theo"])
        except Exception:
            raise
