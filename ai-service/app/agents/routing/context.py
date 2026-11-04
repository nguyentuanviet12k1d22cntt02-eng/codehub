import re
import uuid
from app.contracts.routing import RoutingDecision
from app.pipeline.llm_client import PipelineError
from app.services.knowledge_graph_service import _fold_topic

def _mentioned_languages(value):
    words = set(_fold_topic(value).split())
    found = {language for language, names in {
        "python": {"python"}, "javascript": {"javascript", "js"},
        "cpp": {"cpp"}, "sql": {"sql"},
    }.items() if words.intersection(names)}
    if "c++" in value.casefold():
        found.add("cpp")
    return found

def _open_ended_learning_request(value):
    """A request to study a topic is not consent to theory or exercise mode."""
    folded = _fold_topic(value)
    prefixes = ("toi muon hoc ", "minh muon hoc ", "em muon hoc ",
                "muon hoc ", "toi can hoc ", "minh can hoc ", "em can hoc ")
    if not folded.startswith(prefixes):
        return False
    explicit_modes = ("ly thuyet", "thuc hanh", "bai tap", "luyen tap",
                      "giai thich", "tao bai", "cho bai")
    return not any(phrase in folded for phrase in explicit_modes)

def _language_only_reply(value):
    return _fold_topic(value) in {"python", "javascript", "js", "c", "cpp", "sql"} and len(_mentioned_languages(value)) == 1


class RoutingContextMixin:

    def _confirmed_learning_mode(self, user_text, pending, trace_id):
        if not isinstance(pending, dict) or pending.get("type") != "LEARNING_MODE_SELECTION":
            return None
        selected_text = user_text
        resumed_choice = pending.get("resumed_mode_choice")
        if (isinstance(resumed_choice, str) and
                _mentioned_languages(user_text) == {pending.get("language")} and
                _fold_topic(user_text) in {"python", "javascript", "js", "c", "cpp", "sql"}):
            selected_text = resumed_choice
        intent = {"hoc ly thuyet": "EXPLAIN_CONCEPT",
                  "lam bai thuc hanh": "REQUEST_ADAPTIVE_EXERCISE"}.get(_fold_topic(selected_text))
        if not intent:
            return None
        language = pending.get("language")
        topic = pending.get("target_concept_id")
        if not isinstance(language, str) or language not in self.ALLOWED_CONSTRUCTS or not isinstance(topic, str):
            raise PipelineError("ROUTING_TARGET_INVALID", "Thiếu ngôn ngữ hoặc chủ đề của lựa chọn học tập đã lưu.")
        concept = self.kg.get_concept(language, topic)
        if not concept or concept.get("content_status", "PUBLISHED") != "PUBLISHED":
            raise PipelineError("ROUTING_TARGET_INVALID", "Chủ đề đã xác nhận không còn trong học liệu đã phát hành.")
        required = pending.get("required_constructs") or []
        forbidden = pending.get("forbidden_constructs") or []
        ordered = pending.get("ordered_output", False)
        if (not isinstance(required, list) or not isinstance(forbidden, list)
                or not all(isinstance(item, str) for item in [*required, *forbidden])
                or (set(required) | set(forbidden)) - self.ALLOWED_CONSTRUCTS[language]
                or set(required) & set(forbidden)
                or not isinstance(ordered, bool) or (ordered and language != "sql")):
            raise PipelineError("ROUTING_SCHEMA_INVALID", "Ràng buộc của lựa chọn học tập đã lưu không hợp lệ.")
        original = pending.get("original_user_request")
        return RoutingDecision(
            intent=intent, language=language, topic=topic, topic_match="matched",
            requested_topic=None, topic_evidence=[], required_constructs=required,
            forbidden_constructs=forbidden, ordered_output=ordered,
            confirm_prerequisite_override=False, language_confirmed=True,
            selection_mode="explicit", user_text=original if isinstance(original, str) and original.strip() else user_text,
            trace_id=trace_id or f"trace_{uuid.uuid4().hex}",
        )

    def _recover_learning_topic(self, decision, user_text, available, subject_only=False):
        """Recover only a complete, exact study subject from the published catalog.

        Matching the entire subject avoids picking one word from a compound,
        negated or unknown topic. Language has already been verified by caller.
        Existing model evidence still goes through the normal quote checks.
        """
        if decision.intent != "CLARIFY_LEARNING_MODE" or decision.topic is not None:
            return decision
        match = re.fullmatch(
            r"(?:(?:tôi|toi|mình|minh|em)\s+)?(?:muốn|muon|cần|can)\s+"
            r"(?:học|hoc)\s+(?:(?:về|ve)\s+)?(?P<topic>.+?)"
            r"(?:\s+(?:trong|bằng|bang|với|voi)\s+"
            r"(?:python|javascript|js|c\+\+|cpp|sql))?[.!?]*",
            user_text.strip(), re.IGNORECASE,
        )
        subject = match["topic"].strip() if match else user_text.strip() if subject_only else None
        if subject:
            concept_id = self.kg.resolve_concept_by_topic(decision.language, subject)
            if concept_id in available:
                return decision.model_copy(update={
                    "topic": concept_id, "topic_match": "matched",
                    "requested_topic": subject,
                    "topic_evidence": decision.topic_evidence or [subject],
                })
        if decision.topic_match == "unspecified" and decision.topic_evidence:
            return decision.model_copy(update={
                "topic_match": "unmatched",
                "requested_topic": ", ".join(decision.topic_evidence),
            })
        return decision
