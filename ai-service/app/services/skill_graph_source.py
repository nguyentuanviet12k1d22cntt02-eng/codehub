"""Skill graphs are read-only content owned by the backend database.

Lookup order: process cache -> backend API -> the repository seed file (local development and tests).
The AI service no longer keeps its own copy of the graph JSON files.
"""
from __future__ import annotations

import hashlib
import json
import os
import threading
import time
from pathlib import Path
from typing import Any
from urllib.parse import urlsplit

import requests

REPO_ROOT = Path(__file__).resolve().parents[3]
SEED_DIR = REPO_ROOT / "backend" / "src" / "infrastructure" / "data"
_FILES = {
    "python": "pythonSkillGraph.json",
    "javascript": "javascriptSkillGraph.json",
    "cpp": "cppSkillGraph.json",
    "sql": "sqlSkillGraph.json",
}
_API_LANGUAGE = {"python": "PYTHON", "javascript": "JAVASCRIPT", "cpp": "CPP", "sql": "SQL"}
_cache: dict[str, tuple[dict[str, Any], str]] = {}
_lock = threading.Lock()


def normalize_language(language: str | None) -> str:
    lang = (language or "python").strip().lower()
    if "c++" in lang or lang == "cpp":
        return "cpp"
    if lang in ("js", "javascript"):
        return "javascript"
    if lang == "sql":
        return "sql"
    return "python"


def seed_path(language: str | None) -> Path:
    """Path of the repository seed copy (used by offline tools, tests and as a last resort)."""
    return SEED_DIR / _FILES[normalize_language(language)]


def _backend_origin() -> str:
    configured = os.getenv("ADAPTIVE_BACKEND_URL") or os.getenv("BACKEND_INTERNAL_URL")
    if not configured:
        return "http://127.0.0.1:3000"  # Local development only.
    parsed = urlsplit(configured.strip())
    if parsed.scheme not in ("http", "https") or not parsed.hostname or parsed.username or parsed.password:
        raise ValueError("Backend URL for skill graphs is invalid")
    return f"{parsed.scheme}://{parsed.netloc}"


def _fetch_from_backend(language: str, attempts: int = 3, timeout: float = 15.0) -> tuple[dict[str, Any], str] | None:
    origin = _backend_origin()
    url = f"{origin}/api/recommendations/skill-graph"
    if urlsplit(origin).hostname in ("127.0.0.1", "localhost"):
        attempts = 1  # A local backend is either up or not; do not wait.
    for attempt in range(attempts):
        try:
            response = requests.get(url, params={"language": _API_LANGUAGE[language]}, timeout=timeout)
            if response.ok:
                body = response.json()
                if body.get("success") and isinstance(body.get("data"), dict) and body.get("sha256"):
                    return body["data"], str(body["sha256"])
        except (requests.RequestException, ValueError):
            pass
        if attempt < attempts - 1:
            time.sleep(2.0)
    return None


def _read_seed(language: str) -> tuple[dict[str, Any], str] | None:
    path = seed_path(language)
    if not path.exists():
        return None
    raw = path.read_bytes()
    return json.loads(raw.decode("utf-8")), hashlib.sha256(raw).hexdigest()


def load_skill_graph_with_sha(language: str | None) -> tuple[dict[str, Any], str] | None:
    """Return (graph, sha256 of the stored bytes) or None when neither source is available."""
    key = normalize_language(language)
    with _lock:
        if key in _cache:
            return _cache[key]
    found = _fetch_from_backend(key) or _read_seed(key)
    if found:
        with _lock:
            _cache[key] = found
    return found


def load_skill_graph(language: str | None) -> dict[str, Any] | None:
    found = load_skill_graph_with_sha(language)
    return found[0] if found else None


def clear_cache() -> None:
    with _lock:
        _cache.clear()
