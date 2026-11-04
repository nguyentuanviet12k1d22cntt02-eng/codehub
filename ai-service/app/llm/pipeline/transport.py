import json
import time
import requests
from .errors import PipelineError

def request_completion(provider, model, key, system, prompt, output_limit, read_timeout):
    if provider == "GEMINI":
        payload = {"system_instruction": {"parts": [{"text": system}]}, "contents": [{"role": "user", "parts": [{"text": prompt}]}], "generationConfig": {"temperature": .25, "maxOutputTokens": output_limit, "responseMimeType": "application/json"}}
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
