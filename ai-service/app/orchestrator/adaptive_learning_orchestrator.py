from .flows.turn_context import TurnContext
from .flows.routing import RoutingFlowMixin
from .flows.non_exercise import NonExerciseFlowMixin, simple_chat_reply
from .flows.generation import GenerationFlowMixin
from .flows.resume import ResumeFlowMixin
import uuid
from app.contracts.specification import ExerciseSpecification
from app.contracts.routing import RoutingDecision
from app.agents.intent_router_agent import IntentRouterAgent
from app.agents.clarification_agent import ClarificationAgent
from app.agents.adaptive_exercise_planner import AdaptiveExercisePlanner
from app.agents.exercise_generator_agent import ExerciseGeneratorAgent
from app.agents.exercise_repair_agent import repair_strategy
from app.agents.critic_evaluator_agent import CriticEvaluatorAgent
from app.agents.explanation_tutor_agent import ExplanationTutorAgent
from app.agents.prerequisite_advisor_agent import PrerequisiteAdvisorAgent
from app.services.knowledge_graph_service import KnowledgeGraphService
from app.pipeline.grounding import GroundingService
from app.pipeline.llm_client import PipelineLLMClient, PipelineError
from app.pipeline.evidence import EvidenceRecorder, now
from app.pipeline.runtime import digest
from app.pipeline.exercise_count import MAX_EXERCISES, requested_exercise_count, is_count_selection_reply
from app.validation.schema_validator import SchemaValidator
from app.validation.ast_constraint_validator import AstConstraintValidator
from app.validation.sandbox_validator import SandboxValidator


class AdaptiveLearningOrchestrator(RoutingFlowMixin, NonExerciseFlowMixin, GenerationFlowMixin, ResumeFlowMixin):
    """One bounded workflow for every generated exercise; no legacy/template fallback."""
    def __init__(self, client_factory=PipelineLLMClient, sandbox=SandboxValidator):
        self.client_factory = client_factory
        self.sandbox = sandbox
        self.kg = KnowledgeGraphService()

    def process_turn(self, user_id, history, user_mastery=None, target_concept_id=None,
                     language=None, event_callback=None, learner_context=None, trace_id=None, resume_report=None,
                     run_attempt=1, sequence_offset=0, review_mode=False):
        trace_id = trace_id or f"trace_{uuid.uuid4().hex}"
        client = self.client_factory()
        evidence = EvidenceRecorder(trace_id, event_callback, client, run_attempt=run_attempt, sequence_offset=sequence_offset)
        started_at = now()
        context = learner_context or {}
        user_text = next((m.get("content", "") for m in reversed(history) if m.get("sender", "").upper() in ("USER", "HUMAN")), "")
        turn = TurnContext(trace_id, evidence, started_at, user_text, resume_report, review_mode)
        result, stage, clarify = turn.result, turn.stage, turn.clarify


        try:
            if resume_report and not review_mode:
                resumed = self._resume_verified_candidate(resume_report, trace_id, evidence, client, turn.intent, result, user_text, context)
                if resumed is not None:
                    return resumed
            routed = self._route_turn(turn, client, user_id, user_text, context, target_concept_id, language, trace_id)
            if isinstance(routed, dict):
                return routed
            routing, context, requested_count = routed
            response = self._handle_non_exercise(turn, client, user_id, user_text, context, routing, target_concept_id)
            if response is not None:
                return response
            return self._generate_turn(turn, client, user_id, user_text, context, routing, target_concept_id, requested_count, trace_id)
        except Exception as exc:
            if getattr(exc, "code", None) == "REPAIR_LIMIT_REACHED":
                title = turn.spec.concept_title if turn.spec is not None else "cùng chủ đề"
                return result("FAILED", "AI chưa tạo được bài mới vượt qua toàn bộ kiểm thử và thẩm định sau 3 lần. "
                    "Chưa phát hành bài; bạn có thể yêu cầu tạo một bài mới khác.",
                    suggested_options=[f"Tạo bài tập mới về {title}"],
                    error={"code": exc.code, "message": str(exc)[:1000], "details": getattr(exc, "details", {})})
            return result("FAILED", "Pipeline dừng tại bước chưa đạt. Bạn có thể xem dẫn chứng và lỗi cụ thể bên dưới.",
                error={"code": getattr(exc, "code", "PIPELINE_FAILED"), "message": str(exc)[:1000], "details": getattr(exc, "details", {})})

    @staticmethod
    def _sandbox_budget(draft, spec):
        per_case = 13 if spec.language == "cpp" else 9
        return min(90, 15 + len(draft.get("test_cases", [])) * per_case)


    @staticmethod
    def _verified_artifact(draft, spec, theory, trace_id):
        artifact = {**draft, "exercise_id": str(uuid.uuid4()), "language": spec.language,
            "concept_id": spec.target_concept, "concept_name": spec.concept_title,
            "difficulty": spec.difficulty, "difficulty_stars": ["EASY", "MEDIUM", "HARD", "CHALLENGE"].index(spec.difficulty) + 1,
            "execution": spec.execution, "spec_snapshot": spec.model_dump(), "trace_id": trace_id,
            "theoryContent": theory["reply"], "qc_status": "VERIFIED", "harness_version": "adaptive_harness_v4"}
        artifact["artifact_hash"] = digest(artifact)
        return artifact
