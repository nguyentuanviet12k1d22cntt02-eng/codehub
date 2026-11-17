from app.contracts.specification import ExerciseSpecification
from app.agents.adaptive_exercise_planner import AdaptiveExercisePlanner
from app.agents.explanation_tutor_agent import ExplanationTutorAgent
from app.pipeline.grounding import GroundingService

def simple_chat_reply(user_text):
    """Keep social chat brief and incapable of answering off-topic questions."""
    lowered = user_text.casefold()
    if any(word in lowered for word in ("cảm ơn", "cám ơn", "thank")):
        return {"reply": "Rất vui được giúp bạn! Khi cần, mình có thể tạo bài tập hoặc giải đáp ngắn về lập trình."}
    return {"reply": "Xin chào! Mình có thể tạo bài tập và giải đáp ngắn về lập trình. Bạn muốn bắt đầu với chủ đề nào?"}

class NonExerciseFlowMixin:
    def _handle_non_exercise(self, turn, client, user_id, user_text, context, routing, target_concept_id):
        result, stage = turn.result, turn.stage
        if turn.intent in ("GENERAL_CHAT", "OUT_OF_SCOPE", "EXPLAIN_CONCEPT", "ASK_KNOWLEDGE", "CHECK_WEAKNESS"):
            if turn.intent == "OUT_OF_SCOPE":
                return result("SUCCEEDED", "Mình chỉ hỗ trợ tạo bài tập và giải đáp ngắn về lập trình. Bạn muốn luyện chủ đề lập trình nào?")
            if turn.intent == "CHECK_WEAKNESS":
                data = stage("LearnerStateService", "DATABASE_SNAPSHOT", {"language": routing.language},
                    lambda: {"states": context.get("states", {}), "source": "PostgreSQL"})
                reply = "Chưa có đủ bằng chứng làm bài để kết luận điểm yếu."
                observed = [(cid, s) for cid, s in data["states"].items() if s.get("attempts", 0) > 0 and self.kg.get_concept(routing.language, cid)]
                if observed:
                    weakest = sorted(observed, key=lambda p: p[1]["mastery"])[:3]
                    reply = "Các kỹ năng cần củng cố theo kết quả đã lưu:\n" + "\n".join(f"- {(self.kg.get_concept(routing.language, cid) or {}).get('name', cid)} ({cid}): {s['mastery']:.0%}, {s['attempts']} lượt làm." for cid, s in weakest)
                return result("SUCCEEDED", reply)
            if turn.intent == "ASK_KNOWLEDGE":
                concepts = stage("KnowledgeRetrievalService", "LOCAL_GRAPH", {"language": routing.language},
                    lambda: self.kg.list_all_concepts(routing.language))
                return result("SUCCEEDED", "\n".join(f"- **{c['id']}**: {c.get('name', '')}" for c in concepts))
            if turn.intent == "GENERAL_CHAT":
                response = stage("GeneralChatAgent", "RULE_POLICY", {"request": user_text},
                    lambda: simple_chat_reply(user_text))
                return result("SUCCEEDED", response["reply"])
            spec = stage("AdaptiveExercisePlanner", "RULE_POLICY", {"routing": routing.model_dump()},
                lambda: AdaptiveExercisePlanner(self.kg).plan_exercise(routing, user_id, target_concept_id, context),
                hydrate=ExerciseSpecification.model_validate)
            turn.spec = spec
            grounding = stage("KnowledgeRetrievalService", "LOCAL_GRAPH_AND_FILES", {"concept_id": spec.target_concept},
                lambda: GroundingService().retrieve(spec, self.kg))
            theory = stage("ExplanationTutorAgent", "LLM", {"specification": spec.model_dump(), "grounding": grounding},
                lambda: ExplanationTutorAgent(client).explain(spec.target_concept, spec.concept_title, spec.language, user_text, {"specification": spec.model_dump(), **grounding}))
            return result("SUCCEEDED", theory["reply"])
