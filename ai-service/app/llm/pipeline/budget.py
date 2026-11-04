import os

def stage_output_limit(stage):
    """Keep calls within provider quota; these are ceilings, not fallback content."""
    defaults = {
        "ExerciseGeneratorAgent": 4000,
        "ExplanationTutorAgent": 2200,
        "CriticEvaluatorAgent": 900,
        "GeneralChatAgent": 900,
        "ClarificationAgent": 700,
        "PracticeFeedbackAgent": 650,
    }
    configured = os.getenv("ADAPTIVE_" + stage.upper() + "_MAX_TOKENS")
    try:
        requested = int(configured or defaults.get(stage, 1400))
    except ValueError:
        requested = defaults.get(stage, 1400)
    return max(400, min(requested, 4000))

def stage_call_timeout(stage):
    """Use a bounded stage budget that permits a real non-streaming JSON reply."""
    defaults = {
        "ExerciseGeneratorAgent": 35,
        "ExplanationTutorAgent": 28,
        "CriticEvaluatorAgent": 28,
        "GeneralChatAgent": 20,
        "ClarificationAgent": 20,
        "PracticeFeedbackAgent": 14,
        "IntentRouterAgent": 10,
    }
    configured = os.getenv("ADAPTIVE_" + stage.upper() + "_CALL_TIMEOUT_SECONDS") or os.getenv("ADAPTIVE_PROVIDER_CALL_TIMEOUT_SECONDS")
    try:
        requested = int(configured or defaults.get(stage, 25))
    except ValueError:
        requested = defaults.get(stage, 25)
    return max(5, min(requested, 45))

def stage_budget_seconds(stage):
    """One real time budget for a whole LLM stage, not one budget per key."""
    defaults = {
        "ExerciseGeneratorAgent": 150,
        "ExplanationTutorAgent": 90,
        "CriticEvaluatorAgent": 110,
        "GeneralChatAgent": 40,
        "IntentRouterAgent": 45,
        "ClarificationAgent": 30,
        "PracticeFeedbackAgent": 25,
    }
    configured = os.getenv("ADAPTIVE_" + stage.upper() + "_STAGE_BUDGET_SECONDS")
    try:
        requested = int(configured or defaults.get(stage, 45))
    except ValueError:
        requested = defaults.get(stage, 45)
    return max(minimum_real_attempt_seconds(stage), min(requested, 180))

def minimum_real_attempt_seconds(stage):
    """Below this window a provider cannot receive a meaningful live call."""
    defaults = {
        "ExerciseGeneratorAgent": 5,
        "ExplanationTutorAgent": 5,
        "CriticEvaluatorAgent": 5,
        "GeneralChatAgent": 5,
        "IntentRouterAgent": 5,
    }
    return defaults.get(stage, 5)

def fair_attempt_timeout(stage, remaining_stage_seconds, candidate_count,
                         fallback_provider_count, preferred=False):
    """Allocate a live attempt without starving later providers.

    A previously successful key may use the normal call limit.  Unknown keys
    share the current stage budget, while retaining a minimum real attempt
    for each remaining provider.  No response is invented when the budget is
    insufficient; the caller records STAGE_BUDGET_EXHAUSTED and lets the
    durable retry continue later.
    """
    normal = min(stage_call_timeout(stage), remaining_stage_seconds)
    if preferred:
        return normal
    minimum = minimum_real_attempt_seconds(stage)
    reserved = minimum * max(0, fallback_provider_count)
    fair_share = (remaining_stage_seconds - reserved) / max(1, candidate_count)
    return max(1, min(normal, max(minimum, fair_share)))

def provider_attempt_limit(stage):
    """Bound sibling-key retries so another provider gets a real chance.

    A 5xx can be key-specific, so more than one key is still tried.  Large key
    pools must not consume the entire stage on the same model and payload.
    """
    defaults = {
        "ExerciseGeneratorAgent": 3,
        "ExplanationTutorAgent": 3,
        "CriticEvaluatorAgent": 3,
        "GeneralChatAgent": 2,
        "IntentRouterAgent": 2,
        "ClarificationAgent": 2,
        "PracticeFeedbackAgent": 2,
    }
    configured = os.getenv("ADAPTIVE_" + stage.upper() + "_MAX_ATTEMPTS_PER_PROVIDER")
    try:
        requested = int(configured or defaults.get(stage, 3))
    except ValueError:
        requested = defaults.get(stage, 3)
    return max(1, min(requested, 8))
