from app.contracts.routing import RoutingDecision
from app.agents.intent_router_agent import IntentRouterAgent
from app.pipeline.llm_client import PipelineError
from app.pipeline.exercise_count import MAX_EXERCISES, requested_exercise_count, is_count_selection_reply

class RoutingFlowMixin:
    def _route_turn(self, turn, client, user_id, user_text, context, target_concept_id, language, trace_id):
        result, stage, clarify = turn.result, turn.stage, turn.clarify
        count_pending = context.get("pending_confirmation")
        if isinstance(count_pending, dict) and count_pending.get("type") == "EXERCISE_COUNT_SELECTION":
            if not is_count_selection_reply(user_text):
                # A fresh request replaces the unfinished quantity choice.
                context = {**context, "pending_confirmation": None}
            elif not requested_exercise_count(user_text, standalone=True):
                turn.intent = "REQUEST_ADAPTIVE_EXERCISE"
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
        turn.intent = routing.intent
        pending_route = context.get("pending_confirmation")
        topic_choice_text = user_text
        if (isinstance(pending_route, dict) and pending_route.get("type") == "ROUTING_CLARIFICATION"
                and user_text.strip().casefold() in {"python", "javascript", "js", "c++", "cpp", "sql"}
                and isinstance(pending_route.get("original_user_request"), str)):
            topic_choice_text = f"{pending_route['original_user_request']} trong {routing.language or ''}"
        if (turn.intent == "REQUEST_ADAPTIVE_EXERCISE" and not context.get("batch_continuation")
                and router.has_conflicting_topic_choices(topic_choice_text, routing.language)):
            return clarify("routing_conflict", routing)
        if turn.intent not in ("GENERAL_CHAT", "OUT_OF_SCOPE") and target_concept_id and (routing.topic != target_concept_id or routing.topic_match != "matched"):
            raise PipelineError("ROUTING_TARGET_MISMATCH", "Mã chủ đề yêu cầu không khớp kết quả định tuyến.")
        if turn.intent not in ("GENERAL_CHAT", "OUT_OF_SCOPE") and context.get("language") and context["language"] != routing.language:
            context = {**context, "language": routing.language, "states": {},
                       "recent_exercises": [], "last_concept_id": None, "last_difficulty": None}
        learning_intents = {"REQUEST_ADAPTIVE_EXERCISE", "EXPLAIN_CONCEPT", "CLARIFY_LEARNING_MODE", "CREATE_LEARNING_PATH"}
        unclear_language = turn.intent in learning_intents and not routing.language_confirmed
        unclear_topic = (turn.intent in learning_intents and routing.topic_match == "unmatched") or (
            turn.intent in {"EXPLAIN_CONCEPT", "CLARIFY_LEARNING_MODE"}
            and routing.topic_match == "unspecified")
        uncertain_route = turn.intent in learning_intents and routing.confidence < .7
        if unclear_language or unclear_topic or uncertain_route:
            reason = ("language_and_topic" if unclear_language and unclear_topic else
                      "language" if unclear_language else "topic" if unclear_topic else "routing_conflict")
            return clarify(reason, routing)
        if turn.intent == "CLARIFY_LEARNING_MODE":
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
        turn.exercise_count = None if turn.intent == "REQUEST_ADAPTIVE_EXERCISE" else 1
        requested_count = None if turn.intent == "REQUEST_ADAPTIVE_EXERCISE" else 1
        if turn.intent == "REQUEST_ADAPTIVE_EXERCISE":
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
            turn.exercise_count = min(raw_count, MAX_EXERCISES)
        return routing, context, requested_count
