import hashlib
import hmac
import json
import os
import time
from pathlib import Path
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT.parent / "backend" / ".env", override=False)


def secret():
    value = os.getenv("ADAPTIVE_INTERNAL_SECRET") or os.getenv("JWT_SECRET")
    if not value:
        raise RuntimeError("ADAPTIVE_INTERNAL_SECRET_OR_JWT_SECRET_REQUIRED")
    return value


def signed_headers(body):
    timestamp = str(int(time.time()))
    signature = hmac.new(secret().encode(), (timestamp + "." + body).encode(), hashlib.sha256).hexdigest()
    return {"Content-Type": "application/json", "X-Adaptive-Time": timestamp, "X-Adaptive-Signature": signature}


def verify_signature(body, timestamp, signature):
    try:
        if abs(time.time() - int(timestamp)) > 120:
            return False
        expected = hmac.new(secret().encode(), timestamp.encode() + b"." + body, hashlib.sha256).hexdigest()
        return hmac.compare_digest(expected, signature)
    except (ValueError, TypeError, RuntimeError):
        return False


def digest(value):
    return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"), default=str).encode()).hexdigest()
