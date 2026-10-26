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


def simple_chat_reply(user_text):
    """Keep social chat brief and incapable of answering off-topic questions."""
    lowered = user_text.casefold()
    if any(word in lowered for word in ("cảm ơn", "cám ơn", "thank")):
        return {"reply": "Rất vui được giúp bạn! Khi cần, mình có thể tạo bài tập hoặc giải đáp ngắn về lập trình."}
    return {"reply": "Xin chào! Mình có thể tạo bài tập và giải đáp ngắn về lập trình. Bạn muốn bắt đầu với chủ đề nào?"}


class AdaptiveLearningOrchestrator:
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
        intent = (resume_report or {}).get("intent")
        exercise_count = None
        prior_records = list((resume_report or {}).get("agent_traces", [])) if review_mode else []
        reusable_records = [record for record in prior_records
                            if record.get("status") in ("SUCCEEDED", "REJECTED") and "output" in record]
        reuse_cursor = 0

        def result(status, reply, exercise=None, **extra):
            return {"trace_id": trace_id, "schema_version": "4.0", "status": status, "intent": intent,
                    "reply": reply, "exercise": exercise,
                    "agent_traces": [*prior_records, *evidence.records] if review_mode else evidence.records,
                    "started_at": (resume_report or {}).get("started_at", started_at),
                    "ended_at": now(), "fallback_used": False,
                    **({"exercise_count": exercise_count} if exercise_count is not None else {}), **extra}

        def stage(agent, method, inputs, work, attempt=1, hydrate=None):
            """Reuse a legacy checkpoint when present, then continue without a review pause."""
            nonlocal reuse_cursor
            if review_mode and reuse_cursor < len(reusable_records):
                record = reusable_records[reuse_cursor]
                if record.get("agent") != agent or int(record.get("stage_attempt", record.get("attempt", 1))) != int(attempt):
                    raise PipelineError(
                        "REVIEW_CHECKPOINT_MISMATCH",
                        f"Checkpoint mong đợi {record.get('agent')} nhưng pipeline yêu cầu {agent}.",
                    )
                reuse_cursor += 1
                value = record.get("output")
                return hydrate(value) if hydrate else value
            value = evidence.step(agent, method, inputs, work, attempt)
            return value

        def clarify(reason, routing=None):
            source_text = routing.user_text if routing is not None else user_text
            selected_language = routing.language if routing is not None else None
            question = stage("ClarificationAgent", "RULE_POLICY", {
                "request": source_text, "reason": reason,
                "routing": routing.model_dump() if routing is not None else None},
                lambda: ClarificationAgent().ask(source_text, reason, routing, {}))
            return result("AWAITING_CONFIRMATION", question["question"],
                pending_confirmation={"type": "ROUTING_CLARIFICATION",
                    "original_user_request": source_text,
                    "original_intent": routing.intent if routing is not None else None,
                    "language": selected_language if routing is not None and routing.language_confirmed else None,
                    "requested_topic": routing.requested_topic if routing is not None else None},
                suggested_options=question["suggested_options"])

        try:
            if resume_report and not review_mode:
                resumed = self._resume_verified_candidate(resume_report, trace_id, evidence, client, intent, result, user_text, context)
                if resumed is not None:
                    return resumed
            count_pending = context.get("pending_confirmation")
            if isinstance(count_pending, dict) and count_pending.get("type") == "EXERCISE_COUNT_SELECTION":
                if not is_count_selection_reply(user_text):
                    # A fresh request replaces the unfinished quantity choice.
                    context = {**context, "pending_confirmation": None}
                elif not requested_exercise_count(user_text, standalone=True):
                    intent = "REQUEST_ADAPTIVE_EXERCISE"
                    return result("AWAITING_CONFIRMATION", "Bạn muốn tạo bao nhiêu bài tập thực hành? Chọn từ 1 đến 5 bài.",
                        pending_confirmation=count_pending,
                        suggested_options=[f"{number} bài" for number in range(1, MAX_EXERCISES + 1)])
            try:
                pending_mode = context.get("pending_confirmation")
                confirmed_mode = (isinstance(pending_mode, dict) and pending_mode.get("type") == "LEARNING_MODE_SELECTION"
                    and (user_text.strip().casefold() in ("học lý thuyết", "làm bài thực hành")
                         or pending_mode.get("resumed_mode_choice") in ("học lý thuyết", "làm bài thực hành")))
                pending_concept = self.kg.get_concept(pending_mode.get("language"), pending_mode.get("target_concept_id")) if isinstance(pending_mode, dict) and pending_mode.get("type") == "PREREQUISITE_OVERRIDE" else None
                confirmed_prerequisite = bool(pending_concept and user_text.strip().casefold() == f"Vẫn tạo bài {pending_concept.get('name', '')} cho tôi".casefold())
                router = IntentRouterAgent(client, self.kg)
                batch_route = (router.verified_batch_continuation(user_text, context, target_concept_id,
                    language, trace_id) if context.get("batch_continuation") is True else None)
                exact_exercise = batch_route or router.exact_catalog_exercise(user_text, {**context, "target_concept_id": target_concept_id}, trace_id)
                routing_method = ("VERIFIED_BATCH_CONTINUATION" if batch_route is not None else
                                  "CONFIRMED_SELECTION" if confirmed_mode or confirmed_prerequisite else
                                  "PUBLISHED_CATALOG_EXACT" if exact_exercise is not None else "LLM_WITH_PUBLISHED_CATALOG")
                routing = stage("IntentRouterAgent", routing_method, {"request": user_text, "language": language,
                    "last_concept_id": context.get("last_concept_id"), "pending_confirmation": context.get("pending_confirmation"),
                    "target_concept_id": target_concept_id},
                    lambda: exact_exercise or router.route(user_text, {**context,
                        "language": language or (context.get("language") if context.get("language_source") != "default" else None),
                        "target_concept_id": target_concept_id}, trace_id), hydrate=RoutingDecision.model_validate)
            except PipelineError as routing_error:
                if routing_error.code in {"ROUTING_TARGET_UNSUPPORTED", "ROUTING_TARGET_INVALID", "ROUTING_LANGUAGE_MISMATCH"}:
                    return clarify("routing_conflict")
                raise
            intent = routing.intent
            pending_route = context.get("pending_confirmation")
            topic_choice_text = user_text
            if (isinstance(pending_route, dict) and pending_route.get("type") == "ROUTING_CLARIFICATION"
                    and user_text.strip().casefold() in {"python", "javascript", "js", "c++", "cpp", "sql"}
                    and isinstance(pending_route.get("original_user_request"), str)):
                topic_choice_text = f"{pending_route['original_user_request']} trong {routing.language or ''}"
            if (intent == "REQUEST_ADAPTIVE_EXERCISE" and not context.get("batch_continuation")
                    and router.has_conflicting_topic_choices(topic_choice_text, routing.language)):
                return clarify("routing_conflict", routing)
            if intent not in ("GENERAL_CHAT", "OUT_OF_SCOPE") and target_concept_id and (routing.topic != target_concept_id or routing.topic_match != "matched"):
                raise PipelineError("ROUTING_TARGET_MISMATCH", "Mã chủ đề yêu cầu không khớp kết quả định tuyến.")
            if intent not in ("GENERAL_CHAT", "OUT_OF_SCOPE") and context.get("language") and context["language"] != routing.language:
                context = {**context, "language": routing.language, "states": {},
                           "recent_exercises": [], "last_concept_id": None, "last_difficulty": None}
            learning_intents = {"REQUEST_ADAPTIVE_EXERCISE", "EXPLAIN_CONCEPT", "CLARIFY_LEARNING_MODE", "CREATE_LEARNING_PATH"}
            unclear_language = intent in learning_intents and not routing.language_confirmed
            unclear_topic = (intent in learning_intents and routing.topic_match == "unmatched") or (
                intent in {"EXPLAIN_CONCEPT", "CLARIFY_LEARNING_MODE"}
                and routing.topic_match == "unspecified")
            uncertain_route = intent in learning_intents and routing.confidence < .7
            if unclear_language or unclear_topic or uncertain_route:
                reason = ("language_and_topic" if unclear_language and unclear_topic else
                          "language" if unclear_language else "topic" if unclear_topic else "routing_conflict")
                return clarify(reason, routing)
            if intent == "CLARIFY_LEARNING_MODE":
                concept_id = routing.topic
                concept = self.kg.get_concept(routing.language, concept_id)
                if not concept:
                    return clarify("topic", routing)
                pending_confirmation = {
                    "type": "LEARNING_MODE_SELECTION",
                    "target_concept_id": concept_id,
                    "target_concept_name": concept.get("name", concept_id),
                    "language": routing.language,
                    "original_user_request": routing.user_text,
                    "required_constructs": routing.required_constructs,
                    "forbidden_constructs": routing.forbidden_constructs,
                    "ordered_output": routing.ordered_output,
                }
                return result(
                    "AWAITING_CONFIRMATION",
                    f"Bạn muốn bắt đầu chủ đề **{concept.get('name', concept_id)}** theo cách nào?",
                    pending_confirmation=pending_confirmation,
                    suggested_options=["Học lý thuyết", "Làm bài thực hành"],
                )
            exercise_count = None if intent == "REQUEST_ADAPTIVE_EXERCISE" else 1
            requested_count = None if intent == "REQUEST_ADAPTIVE_EXERCISE" else 1
            if intent == "REQUEST_ADAPTIVE_EXERCISE":
                pending = context.get("pending_confirmation")
                selecting_count = isinstance(pending, dict) and pending.get("type") == "EXERCISE_COUNT_SELECTION"
                current_count = requested_exercise_count(user_text, standalone=selecting_count)
                pending_count = pending.get("exercise_count") if isinstance(pending, dict) else None
                original_count = requested_exercise_count(pending.get("original_user_request", "")) if isinstance(pending, dict) else None
                # Older confirmations stored an implicit quantity. Trust a
                # saved quantity only when the learner actually selected it.
                if (isinstance(pending, dict) and pending.get("type") == "PREREQUISITE_OVERRIDE"
                        and original_count is None and pending.get("exercise_count_confirmed") is not True):
                    pending_count = None
                raw_count = (current_count if current_count is not None else
                             original_count if original_count is not None else pending_count)
                if raw_count is None or raw_count < 1:
                    return result("AWAITING_CONFIRMATION", "Bạn muốn tạo bao nhiêu bài tập thực hành? Chọn từ 1 đến 5 bài.",
                        pending_confirmation={"type": "EXERCISE_COUNT_SELECTION", "language": routing.language,
                            "target_concept_id": target_concept_id or routing.topic,
                            "original_user_request": routing.user_text,
                            "required_constructs": routing.required_constructs,
                            "forbidden_constructs": routing.forbidden_constructs,
                            "ordered_output": routing.ordered_output},
                        suggested_options=[f"{number} bài" for number in range(1, MAX_EXERCISES + 1)])
                requested_count = raw_count
                exercise_count = min(raw_count, MAX_EXERCISES)
            if intent in ("GENERAL_CHAT", "OUT_OF_SCOPE", "EXPLAIN_CONCEPT", "ASK_KNOWLEDGE", "CHECK_WEAKNESS"):
                if intent == "OUT_OF_SCOPE":
                    return result("SUCCEEDED", "Mình chỉ hỗ trợ tạo bài tập và giải đáp ngắn về lập trình. Bạn muốn luyện chủ đề lập trình nào?")
                if intent == "CHECK_WEAKNESS":
                    data = stage("LearnerStateService", "DATABASE_SNAPSHOT", {"language": routing.language},
                        lambda: {"states": context.get("states", {}), "source": "PostgreSQL"})
                    reply = "Chưa có đủ bằng chứng làm bài để kết luận điểm yếu."
                    observed = [(cid, s) for cid, s in data["states"].items() if s.get("attempts", 0) > 0 and self.kg.get_concept(routing.language, cid)]
                    if observed:
                        weakest = sorted(observed, key=lambda p: p[1]["mastery"])[:3]
                        reply = "Các kỹ năng cần củng cố theo kết quả đã lưu:\n" + "\n".join(f"- {cid}: {s['mastery']:.0%}, {s['attempts']} lượt làm." for cid, s in weakest)
                    return result("SUCCEEDED", reply)
                if intent == "ASK_KNOWLEDGE":
                    concepts = stage("KnowledgeRetrievalService", "LOCAL_GRAPH", {"language": routing.language},
                        lambda: self.kg.list_all_concepts(routing.language))
                    return result("SUCCEEDED", "\n".join(f"- **{c['id']}**: {c.get('name', '')}" for c in concepts))
                if intent == "GENERAL_CHAT":
                    response = stage("GeneralChatAgent", "RULE_POLICY", {"request": user_text},
                        lambda: simple_chat_reply(user_text))
                    return result("SUCCEEDED", response["reply"])
                spec = stage("AdaptiveExercisePlanner", "RULE_POLICY", {"routing": routing.model_dump()},
                    lambda: AdaptiveExercisePlanner(self.kg).plan_exercise(routing, user_id, target_concept_id, context),
                    hydrate=ExerciseSpecification.model_validate)
                grounding = stage("KnowledgeRetrievalService", "LOCAL_GRAPH_AND_FILES", {"concept_id": spec.target_concept},
                    lambda: GroundingService().retrieve(spec, self.kg))
                theory = stage("ExplanationTutorAgent", "LLM", {"specification": spec.model_dump(), "grounding": grounding},
                    lambda: ExplanationTutorAgent(client).explain(spec.target_concept, spec.concept_title, spec.language, user_text, {"specification": spec.model_dump(), **grounding}))
                return result("SUCCEEDED", theory["reply"])

            if context.get("sandbox_configured") is False:
                return result("FAILED", "Môi trường chấm bài EC2 Docker chưa được cấu hình trên backend. "
                    "Quản trị viên cần thiết lập AWS_DOCKER_GRADER_URL và AWS_DOCKER_GRADER_TOKEN rồi khởi động lại backend; chưa có bài nào được phát hành.",
                    error={"code": "SANDBOX_CONFIGURATION_REQUIRED", "message": "Thiếu cấu hình EC2 Docker sandbox trên backend."})

            planner_context = context
            if intent == "REQUEST_ADAPTIVE_EXERCISE":
                requested_concept = target_concept_id or routing.topic
                if requested_concept:
                    advisor = PrerequisiteAdvisorAgent(self.kg)
                    readiness = stage("PrerequisiteAdvisorAgent", "KNOWLEDGE_GRAPH_AND_LEARNER_STATE",
                        {"language": routing.language, "target_concept_id": requested_concept,
                         "learner_state_count": len(context.get("states", {}))},
                        lambda: advisor.assess(routing.language, requested_concept, context))
                    pending = context.get("pending_confirmation")
                    force_override = ((routing.confirm_prerequisite_override
                        and isinstance(pending, dict)
                        and pending.get("target_concept_id") == requested_concept)
                        or (context.get("batch_continuation") is True
                            and context.get("last_concept_id") == requested_concept))
                    if not readiness["ready"] and not force_override:
                        lines = [
                            f"Bạn đang muốn học **{readiness['target_concept_name']}** (`{requested_concept}`).",
                            f"Mức sẵn sàng theo bằng chứng hiện có: **{readiness['readiness_percent']}%** "
                            f"(độ phủ bằng chứng {round(readiness['evidence_coverage'] * 100)}%).",
                            "",
                            "Các kiến thức tiên quyết cần ưu tiên:",
                        ]
                        for item in readiness["prerequisite_statuses"]:
                            measure = (f"mastery {item['mastery']:.0%}, confidence {item['confidence']:.0%}"
                                       if item["attempts"] else "chưa có kết quả làm bài đã kiểm chứng")
                            marker = "✓" if item["ready"] else "•"
                            lines.append(f"- {marker} **{item['concept_name']}** (`{item['concept_id']}`): {measure}.")
                        recommended_id = readiness.get("recommended_concept_id")
                        recommended_name = readiness.get("recommended_concept_name")
                        lines.extend(["", f"Đề xuất ưu tiên: **{recommended_name}** (`{recommended_id}`).",
                            "Bạn có thể học phần nền tảng trước, hoặc xác nhận vẫn tiếp tục để mình tạo bài đúng chủ đề yêu cầu ở mức EASY và tăng scaffold."])
                        pending_confirmation = {
                            "type": "PREREQUISITE_OVERRIDE",
                            "target_concept_id": requested_concept,
                            "target_concept_name": readiness["target_concept_name"],
                            "language": routing.language,
                            "original_user_request": routing.user_text,
                            "required_constructs": routing.required_constructs,
                            "forbidden_constructs": routing.forbidden_constructs,
                            "ordered_output": routing.ordered_output,
                            "exercise_count": requested_count,
                            "exercise_count_confirmed": True,
                            "readiness_score": readiness["readiness_score"],
                            "recommended_concept_id": recommended_id,
                        }
                        return result("AWAITING_CONFIRMATION", "\n".join(lines),
                            readiness=readiness, pending_confirmation=pending_confirmation,
                            suggested_options=[
                                f"Tạo bài {recommended_id} trước",
                                f"Vẫn tạo bài {readiness['target_concept_name']} cho tôi",
                            ])
                    planner_context = {**context, "readiness_assessment": readiness,
                                       "force_prerequisite_override": force_override}

            if intent == "REQUEST_ADAPTIVE_EXERCISE":
                batch_total = context.get("batch_total") if context.get("batch_continuation") is True else exercise_count
                if isinstance(batch_total, int) and 1 < batch_total <= MAX_EXERCISES:
                    batch_index = context.get("batch_index") if context.get("batch_continuation") is True else 1
                    planner_context = {**planner_context, "batch_index": batch_index, "batch_total": batch_total}

            spec = stage("AdaptiveExercisePlanner", "RULE_POLICY", {"routing": routing.model_dump(), "learner_context": planner_context},
                lambda: AdaptiveExercisePlanner(self.kg).plan_exercise(routing, user_id, target_concept_id, planner_context),
                hydrate=ExerciseSpecification.model_validate)
            grounding = stage("KnowledgeRetrievalService", "LOCAL_GRAPH_AND_FILES", {"language": spec.language, "concept_id": spec.target_concept},
                lambda: GroundingService().retrieve(spec, self.kg))
            spec.source_refs = [{"id": s["id"], "sha256": s["sha256"]} for s in grounding["sources"]]
            theory, draft = None, None
            feedback = (resume_report or {}).get("repair_feedback")
            if not isinstance(feedback, dict) or feedback.get("feedback_target") not in ("EXERCISE", "BOTH"):
                feedback = None
            repair_target = "BOTH"
            current_repair_strategy = "GENERATE"
            last_failure_key = None
            last_validation_failure = None
            generator, explainer, critic = ExerciseGeneratorAgent(client), ExplanationTutorAgent(client), CriticEvaluatorAgent(client)

            def rejected(stage_name, check):
                nonlocal last_failure_key, last_validation_failure
                failure = {"validation_stage": stage_name, **check}
                key = digest({"stage": stage_name, "errors": check.get("errors", [])})
                last_validation_failure = {"failed_stage": stage_name, "errors": check.get("errors", [])}
                if key == last_failure_key and current_repair_strategy != "GENERATE":
                    raise PipelineError("REPAIR_NOT_RESOLVED",
                        "Bản sửa có giới hạn không khắc phục được lỗi đã xác định; đã dừng để tránh lặp lại.",
                        {**last_validation_failure, "repair_strategy": current_repair_strategy})
                last_failure_key = key
                return failure

            for attempt in range(1, 4):
                client.remaining()
                def make_theory():
                    return stage("ExplanationTutorAgent", "LLM",
                        {"specification": spec.model_dump(), "grounding": grounding, "exercise": draft,
                         "feedback": feedback, "previous_theory": theory},
                        lambda: explainer.explain(spec.target_concept, spec.concept_title, spec.language, user_text,
                            {"specification": spec.model_dump(), **grounding, "exercise": draft,
                             "previous_theory": theory}, feedback), attempt)
                def make_exercise():
                    nonlocal current_repair_strategy
                    # A numeric Set draft that needs a forbidden comprehension
                    # is the wrong beginner task, not a typo to patch in place.
                    # Start a fresh word-set task so the prior draft cannot
                    # anchor the next generation to the same invalid pattern.
                    repair_errors = feedback.get("errors", []) if isinstance(feedback, dict) else []
                    fresh_set_repair = (spec.target_concept == "PY-SET-01"
                        and {"for", "while"} <= set(spec.forbidden_constructs)
                        and any("vòng lặp for" in str(error) or "SyntaxError" in str(error)
                                for error in repair_errors))
                    content_rejection = isinstance(feedback, dict) and feedback.get("feedback_target") in ("EXERCISE", "BOTH")
                    previous_draft = None if fresh_set_repair or content_rejection else draft
                    current_repair_strategy = repair_strategy(previous_draft, feedback, spec)
                    return stage("ExerciseGeneratorAgent", "LLM",
                        {"specification": spec.model_dump(), "feedback": feedback, "previous_draft": previous_draft,
                         "repair_strategy": current_repair_strategy},
                        lambda: generator.generate(spec, feedback, previous_draft, grounding), attempt)
                candidate_changed = draft is None or repair_target in ("BOTH", "EXERCISE")
                if candidate_changed:
                    draft = make_exercise()
                    theory = None
                    def schema_check():
                        passed, errors = SchemaValidator.validate(draft, spec)
                        return {"passed": passed, "errors": errors, "schema_version": "4.0"}
                    schema = stage("SchemaValidator", "PYDANTIC_AND_RULES", {"draft": draft, "specification": spec.model_dump()}, schema_check, attempt)
                    if not schema["passed"]:
                        feedback, repair_target = rejected("SchemaValidator", schema), "EXERCISE"
                        continue
                    def syntax_check():
                        passed, errors = AstConstraintValidator.validate(draft, spec)
                        return {"passed": passed, "errors": errors, "scope": "python_ast_or_language_tokens"}
                    syntax = stage("ConstraintValidator", "STATIC_ANALYSIS", {"reference_solution": draft["reference_solution"], "specification": spec.model_dump()}, syntax_check, attempt)
                    if not syntax["passed"]:
                        feedback, repair_target = rejected("ConstraintValidator", syntax), "EXERCISE"
                        continue
                    def run_tests():
                        # Preserve a useful execution window instead of sending a
                        # request with the last 2-3 seconds of an exhausted LLM run.
                        budget = self._sandbox_budget(draft, spec)
                        if client.remaining() < budget:
                            raise PipelineError("RUN_DEADLINE_EXCEEDED", "Đã lưu bản nháp để tiếp tục kiểm thử với đủ thời gian.")
                        passed, errors, tests = self.sandbox.validate(draft, spec, budget)
                        return {"passed": passed, "errors": errors, "test_results": tests, "harness_version": "adaptive_harness_v4"}
                    validation = stage("SandboxValidator", "ISOLATED_SANDBOX", {"draft": draft, "specification": spec.model_dump()}, run_tests, attempt)
                    if not validation["passed"]:
                        feedback, repair_target = rejected("SandboxValidator", validation), "EXERCISE"
                        continue
                # Generate/revise theory only after the candidate source has
                # passed the deterministic checks. This prevents simultaneous
                # high-token calls from exhausting the same provider key.
                # A failed exercise repair leaves `repair_target` as EXERCISE,
                # but theory has not been generated yet because it is deferred
                # until the deterministic candidate checks pass.
                if theory is None or repair_target in ("BOTH", "THEORY"):
                    theory = make_theory()
                review = stage("CriticEvaluatorAgent", "LLM", {"theory": theory, "draft": draft, "specification": spec.model_dump()},
                    lambda: critic.evaluate_content(theory["reply"], draft, spec, verified_contract=True), attempt)
                if not review["is_approved"]:
                    last_validation_failure = {"failed_stage": "CriticEvaluatorAgent",
                        "feedback_target": review["feedback_target"], "feedback": review.get("feedback"),
                        "exercise_feedback": review.get("exercise_feedback"),
                        "theory_feedback": review.get("theory_feedback")}
                    feedback, repair_target = review, review["feedback_target"]
                    continue
                artifact = self._verified_artifact(draft, spec, theory, trace_id)
                stage("PublicationGate", "DETERMINISTIC_GATE", {"artifact_hash": artifact["artifact_hash"]},
                    lambda: {"approved": True, "validation_attempt": attempt, "critic_score": review["score"], "artifact_hash": artifact["artifact_hash"]})
                prefix = "Bài khởi đầu cho lộ trình" if intent == "CREATE_LEARNING_PATH" else "Bài tập"
                cap_note = " Mình giới hạn tối đa 5 bài cho mỗi yêu cầu." if requested_count > MAX_EXERCISES else ""
                return result("SUCCEEDED", f"{prefix} **{artifact['title']}** đã qua kiểm thử và thẩm định. {spec.reasoning}{cap_note}", artifact,
                    exercise_count=exercise_count,
                    suggested_options=[] if exercise_count > 1 else ["Cho tôi bài dễ hơn", "Giải thích thêm lý thuyết", "Tạo bài tiếp theo"])
            raise PipelineError("REPAIR_LIMIT_REACHED", "Các bước kiểm định chưa đạt sau tối đa 3 lượt sửa; xem dẫn chứng từng lượt.",
                                last_validation_failure or {})
        except Exception as exc:
            if getattr(exc, "code", None) == "REPAIR_LIMIT_REACHED":
                title = spec.concept_title if "spec" in locals() else "cùng chủ đề"
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
