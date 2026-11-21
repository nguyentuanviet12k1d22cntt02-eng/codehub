from app.contracts.specification import ExerciseSpecification
from app.agents.adaptive_exercise_planner import AdaptiveExercisePlanner
from app.agents.exercise_generator_agent import ExerciseGeneratorAgent
from app.agents.exercise_repair_agent import repair_strategy
from app.agents.critic_evaluator_agent import CriticEvaluatorAgent
from app.agents.explanation_tutor_agent import ExplanationTutorAgent
from app.agents.prerequisite_advisor_agent import PrerequisiteAdvisorAgent
from app.pipeline.grounding import GroundingService
from app.pipeline.llm_client import PipelineError
from app.pipeline.runtime import digest
from app.pipeline.exercise_count import MAX_EXERCISES
from app.validation.schema_validator import SchemaValidator
from app.validation.ast_constraint_validator import AstConstraintValidator

class GenerationFlowMixin:
    def _generate_turn(self, turn, client, user_id, user_text, context, routing, target_concept_id, requested_count, trace_id):
        result, stage = turn.result, turn.stage
        if context.get("sandbox_configured") is False:
            return result("FAILED", "Môi trường chấm bài EC2 Docker chưa được cấu hình trên backend. "
                    "Quản trị viên cần thiết lập AWS_DOCKER_GRADER_URL và AWS_DOCKER_GRADER_TOKEN rồi khởi động lại backend; chưa có bài nào được phát hành.",
                error={"code": "SANDBOX_CONFIGURATION_REQUIRED", "message": "Thiếu cấu hình EC2 Docker sandbox trên backend."})

        planner_context = context
        if turn.intent == "REQUEST_ADAPTIVE_EXERCISE":
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

        if turn.intent == "REQUEST_ADAPTIVE_EXERCISE":
            batch_total = context.get("batch_total") if context.get("batch_continuation") is True else turn.exercise_count
            if isinstance(batch_total, int) and 1 < batch_total <= MAX_EXERCISES:
                batch_index = context.get("batch_index") if context.get("batch_continuation") is True else 1
                planner_context = {**planner_context, "batch_index": batch_index, "batch_total": batch_total}

        spec = stage("AdaptiveExercisePlanner", "RULE_POLICY", {"routing": routing.model_dump(), "learner_context": planner_context},
            lambda: AdaptiveExercisePlanner(self.kg).plan_exercise(routing, user_id, target_concept_id, planner_context),
            hydrate=ExerciseSpecification.model_validate)
        turn.spec = spec
        grounding = stage("KnowledgeRetrievalService", "LOCAL_GRAPH_AND_FILES", {"language": spec.language, "concept_id": spec.target_concept},
            lambda: GroundingService().retrieve(spec, self.kg))
        spec.source_refs = [{"id": s["id"], "sha256": s["sha256"]} for s in grounding["sources"]]
        theory, draft = None, None
        feedback = (turn.resume_report or {}).get("repair_feedback")
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
                # A draft that uses a forbidden construct (e.g. a loop the
                # learner has not studied) is the wrong task design, not a
                # typo to patch in place. Start fresh so the prior draft
                # cannot anchor the next generation to the same pattern.
                repair_errors = feedback.get("errors", []) if isinstance(feedback, dict) else []
                forbidden_violation = any("Đặc tả cấm" in str(error) or "đòi hỏi hàm" in str(error)
                                          for error in repair_errors)
                fresh_set_repair = (spec.target_concept == "PY-SET-01"
                    and {"for", "while"} <= set(spec.forbidden_constructs)
                    and any("SyntaxError" in str(error) for error in repair_errors))
                content_rejection = isinstance(feedback, dict) and feedback.get("feedback_target") in ("EXERCISE", "BOTH")
                previous_draft = None if forbidden_violation or fresh_set_repair or content_rejection else draft
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
                # Run both static checks before repairing, so one repair turn
                # sees every known defect instead of fixing wording first and
                # discovering a forbidden construct only on the next turn.
                syntax = None
                if isinstance(draft, dict) and isinstance(draft.get("reference_solution"), str):
                    def syntax_check():
                        passed, errors = AstConstraintValidator.validate(draft, spec)
                        return {"passed": passed, "errors": errors, "scope": "python_ast_or_language_tokens"}
                    syntax = stage("ConstraintValidator", "STATIC_ANALYSIS", {"reference_solution": draft["reference_solution"], "specification": spec.model_dump()}, syntax_check, attempt)
                if not schema["passed"] or (syntax is not None and not syntax["passed"]):
                    failed_stage = "SchemaValidator" if not schema["passed"] else "ConstraintValidator"
                    combined = {**(syntax or {}), **schema} if failed_stage == "SchemaValidator" else dict(syntax)
                    combined["passed"] = False
                    combined["errors"] = list(schema["errors"]) + list((syntax or {}).get("errors", []))
                    feedback, repair_target = rejected(failed_stage, combined), "EXERCISE"
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
            prefix = "Bài khởi đầu cho lộ trình" if turn.intent == "CREATE_LEARNING_PATH" else "Bài tập"
            cap_note = " Mình giới hạn tối đa 5 bài cho mỗi yêu cầu." if requested_count > MAX_EXERCISES else ""
            return result("SUCCEEDED", f"{prefix} **{artifact['title']}** đã qua kiểm thử và thẩm định. {spec.reasoning}{cap_note}", artifact,
                exercise_count=turn.exercise_count,
                suggested_options=[] if turn.exercise_count > 1 else ["Cho tôi bài dễ hơn", "Giải thích thêm lý thuyết", "Tạo bài tiếp theo"])
        raise PipelineError("REPAIR_LIMIT_REACHED", "Các bước kiểm định chưa đạt sau tối đa 3 lượt sửa; xem dẫn chứng từng lượt.",
                            last_validation_failure or {})
