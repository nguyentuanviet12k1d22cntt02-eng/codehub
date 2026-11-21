import json
import os
import time
import requests
from .errors import PipelineError

GEMINI_THINKING_ALLOWANCE = 1024


def gemini_generation_config(model, output_limit):
    """Gemini 3 Flash thinks by default and its thinking tokens count toward
    maxOutputTokens: with a 900-token Critic limit the JSON was cut after
    ~85 characters. Use a low thinking level and reserve room for it."""
    config = {"temperature": .25, "maxOutputTokens": output_limit, "responseMimeType": "application/json"}
    model = (model or "").lower()
    if model.startswith("gemini-3") and "lite" not in model:
        level = os.getenv("ADAPTIVE_GEMINI_THINKING_LEVEL", "low").strip().lower()
        if level in ("low", "medium", "high"):
            config["thinkingConfig"] = {"thinkingLevel": level}
        config["maxOutputTokens"] = output_limit + GEMINI_THINKING_ALLOWANCE
    return config


def completion_truncated(provider, result):
    """Whether the provider stopped because it ran out of output tokens."""
    try:
        if provider == "GEMINI":
            return result["candidates"][0].get("finishReason") == "MAX_TOKENS"
        return result["choices"][0].get("finish_reason") == "length"
    except (KeyError, IndexError, TypeError, AttributeError):
        return False


def response_text(response):
    """Small, safe excerpt of an error body (used to recognise model overload)."""
    if response is None:
        return ""
    try:
        text = getattr(response, "text", None)
        if isinstance(text, str):
            return text[:2000]
        return json.dumps(response.json(), ensure_ascii=False)[:2000]
    except Exception:
        return ""


def request_completion(provider, model, key, system, prompt, output_limit, read_timeout):
    if provider == "GEMINI":
        payload = {"system_instruction": {"parts": [{"text": system}]}, "contents": [{"role": "user", "parts": [{"text": prompt}]}], "generationConfig": gemini_generation_config(model, output_limit)}
        response = requests.post(f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent", headers={"x-goog-api-key": key}, json=payload, timeout=(min(4, read_timeout), read_timeout), stream=True)
    else:
        base = {"GROQ": "https://api.groq.com/openai/v1", "OPENROUTER": "https://openrouter.ai/api/v1", "INCEPTION": "https://api.inceptionlabs.ai/v1", "OPENAI": "https://api.openai.com/v1"}[provider]
        payload = {"model": model, "messages": [{"role": "system", "content": system}, {"role": "user", "content": prompt}], "temperature": .25, "max_tokens": output_limit}
        if provider != "INCEPTION":
            payload["response_format"] = {"type": "json_object"}
        response = requests.post(base + "/chat/completions", headers={"Authorization": "Bearer " + key}, json=payload, timeout=(min(4, read_timeout), read_timeout), stream=True)
    return response

def read_completion(response, call_deadline, remaining):
    body = bytearray()
    for chunk in response.iter_content(chunk_size=8192):
        if time.monotonic() > call_deadline:
            raise PipelineError("PROVIDER_DEADLINE_EXCEEDED")
        body.extend(chunk)
        if len(body) > 1000000:
            raise PipelineError("PROVIDER_RESPONSE_TOO_LARGE")
    remaining()
    if time.monotonic() > call_deadline:
        raise PipelineError("PROVIDER_DEADLINE_EXCEEDED")
    result = json.loads(body)
    return result
