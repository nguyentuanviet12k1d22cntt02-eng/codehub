"""Legacy API compatibility; implementation lives in app.legacy.adaptive."""
from app.legacy.adaptive.json_support import extract_json_from_llm, normalize_test_cases, generate_json_content, sanitize_exercise_object
from app.legacy.adaptive.sandbox import run_sandbox_verification
from app.legacy.adaptive.retrieval import KnowledgeRetriever as _KnowledgeRetriever
from app.legacy.adaptive.routing import RouterAgent
from app.legacy.adaptive.generation import ExerciseGeneratorAgent
from app.legacy.adaptive.critique import CriticEvaluatorAgent
from app.legacy.adaptive.orchestrator import AdaptiveAgentOrchestrator as _AdaptiveAgentOrchestrator

class KnowledgeRetriever(_KnowledgeRetriever):
    _source_file = __file__

class AdaptiveAgentOrchestrator(_AdaptiveAgentOrchestrator):
    retriever_type = KnowledgeRetriever
