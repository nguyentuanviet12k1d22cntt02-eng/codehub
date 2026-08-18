import os
import json
import requests
from dotenv import load_dotenv

# Load backend/env if exists
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACKEND_ENV = os.path.join(os.path.dirname(BASE_DIR), "backend", ".env")
if os.path.exists(BACKEND_ENV):
    load_dotenv(BACKEND_ENV)

OMNIROUTE_URL = os.getenv("OMNIROUTE_URL", "http://localhost:20128/v1/chat/completions")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", os.getenv("GOOGLE_API_KEY", ""))
GEMINI_API_KEYS_ENV = os.getenv("GEMINI_API_KEYS", "")

# Key Pool for rotation
API_KEY_POOL = [k.strip() for k in GEMINI_API_KEYS_ENV.split(",") if k.strip()]
if GEMINI_API_KEY and GEMINI_API_KEY not in API_KEY_POOL:
    API_KEY_POOL.append(GEMINI_API_KEY)

_current_key_idx = 0

def get_next_gemini_key():
    global _current_key_idx, API_KEY_POOL
    if os.path.exists(BACKEND_ENV):
        load_dotenv(BACKEND_ENV, override=True)
    
    key_env = os.getenv("GEMINI_API_KEY", os.getenv("GOOGLE_API_KEY", ""))
    pool = [k.strip() for k in os.getenv("GEMINI_API_KEYS", "").split(",") if k.strip()]
    if key_env and key_env not in pool:
        pool.append(key_env)
        
    if not pool:
        return None
    key = pool[_current_key_idx % len(pool)]
    _current_key_idx += 1
    return key


OMNIROUTE_API_KEY = os.getenv("OMNIROUTE_API_KEY", "")

def call_omniroute_gateway(prompt: str, system_prompt: str = None) -> str:
    """Attempt call to OmniRoute Proxy Gateway at localhost:20128"""
    headers = {"Content-Type": "application/json"}
    if OMNIROUTE_API_KEY:
        headers["Authorization"] = f"Bearer {OMNIROUTE_API_KEY}"
        
    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    messages.append({"role": "user", "content": prompt})

    # Models supported in OmniRoute (đa nhà cung cấp: Gemini, Groq, OpenRouter)
    models_to_try = [
        "gemini/gemini-2.5-flash",
        "gemini/gemini-2.5-pro",
        "gemini/gemini-3.7-flash",
        "groq/llama-3.3-70b-versatile",
        "groq/llama3-70b-8192",
        "openrouter/meta-llama/llama-3.3-70b-instruct:free",
        "openrouter/google/gemini-2.0-flash-exp:free",
        "openrouter/auto"
    ]
    
    for model_name in models_to_try:
        payload = {
            "model": model_name,
            "messages": messages,
            "temperature": 0.7,
            "stream": False,
            "response_format": {"type": "json_object"}
        }
        
        try:
            response = requests.post(OMNIROUTE_URL, json=payload, headers=headers, timeout=70.0)
            if response.status_code == 200:
                data = response.json()
                content = data["choices"][0]["message"]["content"]
                if content:
                    return content
            else:
                print(f"[OmniRoute] Model {model_name} response status {response.status_code}: {response.text[:120]}")
        except Exception as e:
            print(f"[OmniRoute] Gateway call error on {model_name}: {e}")
    return None

def call_direct_gemini_api(prompt: str, system_prompt: str = None) -> str:
    """Direct call to Google Gemini REST API with API Key rotation"""
    if not API_KEY_POOL or not any(k.strip() for k in API_KEY_POOL):
        print("[Gemini API] No valid API Key configured in GEMINI_API_KEY environment variable.")
        return None

    attempts = max(1, len(API_KEY_POOL))
    for _ in range(attempts):
        key = get_next_gemini_key()
        if not key:
            break
        
        models_to_try = ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-3.7-flash", "gemini-3.5-flash"]
        full_text = prompt
        if system_prompt:
            full_text = f"{system_prompt}\n\n{prompt}"
            
        payload = {
            "contents": [{
                "parts": [{"text": full_text}]
            }],
            "generationConfig": {
                "temperature": 0.7,
                "responseMimeType": "application/json"
            }
        }
        
        headers = {"Content-Type": "application/json"}

        for model_name in models_to_try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={key}"
            try:
                res = requests.post(url, json=payload, headers=headers, timeout=70.0)
                if res.status_code == 200:
                    result = res.json()
                    text = result["candidates"][0]["content"]["parts"][0]["text"]
                    return text
                elif res.status_code in (429, 403):
                    print(f"[Gemini API Key Rotation] Key hit quota/limit ({res.status_code}) on model {model_name}.")
                    continue
                else:
                    print(f"[Gemini API Error] Model {model_name} Status {res.status_code}: {res.text[:120]}")
            except Exception as e:
                print(f"[Gemini API Request Error on {model_name}]: {e}")

            
    return None


def generate_json_content(prompt: str, system_prompt: str = None) -> str:
    """Primary LLM Content Generator using OmniRoute -> Direct Gemini -> Fallback"""
    # 1. Try OmniRoute Gateway
    res = call_omniroute_gateway(prompt, system_prompt)
    if res:
        return res
        
    # 2. Try Direct Gemini API with Key Pool Rotation
    res = call_direct_gemini_api(prompt, system_prompt)
    if res:
        return res

    return None
