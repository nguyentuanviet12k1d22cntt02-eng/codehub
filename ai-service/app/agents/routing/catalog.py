import re
import uuid
from app.contracts.routing import RoutingDecision
from app.pipeline.llm_client import PipelineError
from app.services.knowledge_graph_service import _fold_topic

from .context import _mentioned_languages


class RoutingCatalogMixin:

    def verified_batch_continuation(self, user_text, context, concept_id, language, trace_id):
        """Reuse the backend-validated batch target without another provider call."""
        if context.get("batch_continuation") is not True:
            return None
        index = context.get("batch_index")
        selected_language = language or context.get("language")
        concept = self.kg.get_concept(selected_language, concept_id)
        if (not isinstance(index, int) or isinstance(index, bool) or not 2 <= index <= 5
                or selected_language not in self.ALLOWED_CONSTRUCTS or not concept
                or concept.get("content_status", "PUBLISHED") != "PUBLISHED"):
            raise PipelineError("ROUTING_TARGET_INVALID", "Lượt tiếp tục bộ bài thiếu chủ đề đã xác minh.")
        return RoutingDecision(
            intent="REQUEST_ADAPTIVE_EXERCISE", language=selected_language,
            topic=concept_id, topic_match="matched", topic_evidence=[],
            requested_topic=None, language_confirmed=True,
            selection_mode="explicit", user_text=user_text, trace_id=trace_id,
        )

    def has_conflicting_topic_choices(self, user_text, language):
        """Detect a small, explicit class of multi-topic requests before planning."""
        if language not in self.ALLOWED_CONSTRUCTS:
            return False
        folded = _fold_topic(user_text)
        match = re.search(
            r"\bbai(?: tap| thuc hanh)?(?: ve)? (.+?) (?:trong|bang|voi) (?:python|javascript|js|cpp|sql)\b",
            folded,
        )
        if not match:
            return False
        topic_text = match.group(1)
        if self.kg.resolve_concept_by_topic(language, topic_text):
            return False
        choices = re.split(r" (?:va|hoac|hay) ", topic_text)
        if len(choices) < 2:
            return False
        concepts = {self.kg.resolve_concept_by_topic(language, choice) for choice in choices}
        concepts.discard(None)
        return len(concepts) > 1

    def exact_catalog_exercise(self, user_text, context=None, trace_id=None):
        """Route only an unambiguous exercise request to a published concept.

        This deliberately narrow path does not infer a language, interpret
        constraints, or replace the LLM for conversational/compound requests.
        It prevents a provider outage from blocking an exact catalog lookup.
        """
        ctx = context or {}
        if ctx.get("pending_confirmation") or ctx.get("target_concept_id"):
            return None
        folded = _fold_topic(user_text)
        match = re.fullmatch(
            r"(?:hay )?(?:tao(?: giup)?(?: cho toi)?|cho toi|toi muon tao|"
            r"minh muon tao|em muon tao) "
            r"(?:(?:\d+|mot|hai|ba|bon|tu|nam) )?"
            r"bai (?:tap|thuc hanh) (?:ve )?"
            r"(?P<topic>.+?) (?:trong|bang|voi) "
            r"(?P<language>python|javascript|js|cpp|sql)", folded,
        )
        if not match or len(_mentioned_languages(user_text)) != 1:
            return None
        language = {"js": "javascript"}.get(match["language"], match["language"])
        if _mentioned_languages(user_text) != {language}:
            return None
        topic_phrase = match["topic"]
        original_topic = re.search(
            r"\bbài\s+(?:tập|thực\s+hành)\s+(?:về\s+)?"
            r"(?P<topic>.+?)\s+(?:trong|bằng|với)\s+"
            r"(?:python|javascript|js|cpp|sql)\s*[.!?]*$",
            user_text, re.IGNORECASE,
        )
        if not original_topic or _fold_topic(original_topic["topic"]) != topic_phrase:
            return None
        concept_id = self.kg.resolve_concept_by_topic(language, topic_phrase)
        concept = self.kg.get_concept(language, concept_id) if concept_id else None
        if not concept or concept.get("content_status", "PUBLISHED") != "PUBLISHED":
            return None
        return RoutingDecision(
            intent="REQUEST_ADAPTIVE_EXERCISE", language=language,
            topic=concept_id, topic_match="matched", topic_evidence=[original_topic["topic"]],
            requested_topic=None, language_confirmed=True,
            selection_mode="explicit", user_text=user_text,
            trace_id=trace_id or f"trace_{uuid.uuid4().hex}",
        )
