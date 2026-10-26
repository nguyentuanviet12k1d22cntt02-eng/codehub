"""Deterministic practice-exercise quantity parsing (never delegated to an LLM)."""

import re
import unicodedata

MAX_EXERCISES = 5
_WORDS = {"mot": 1, "hai": 2, "ba": 3, "bon": 4, "tu": 4,
          "nam": 5, "sau": 6, "bay": 7, "tam": 8, "chin": 9, "muoi": 10}


def _fold(value):
    normalized = unicodedata.normalize("NFD", value.casefold())
    return "".join(char for char in normalized if unicodedata.category(char) != "Mn").replace("đ", "d")


def requested_exercise_count(text, standalone=False):
    """Return explicit quantity, None when absent, and 0 for a stated zero."""
    folded = _fold(str(text or "")).strip()
    token = r"(?:\d+|mot|hai|ba|bon|tu|nam|sau|bay|tam|chin|muoi)"
    match = re.search(rf"\b({token})\s+(?:bai\s*tap|bai\s*thuc\s*hanh|bai)\b", folded)
    if not match and standalone:
        match = re.fullmatch(rf"({token})(?:\s+bai(?:\s*tap|\s*thuc\s*hanh)?)?", folded)
    if not match:
        return None
    value = match.group(1)
    if value.isdigit():
        significant = value.lstrip("0") or "0"
        return int(significant) if len(significant) <= 6 else MAX_EXERCISES + 1
    return _WORDS[value]


def is_count_selection_reply(text):
    """A quantity answer, not a new exercise request with its own topic."""
    folded = _fold(str(text or "")).strip()
    token = r"(?:\d+|mot|hai|ba|bon|tu|nam|sau|bay|tam|chin|muoi)"
    return bool(re.fullmatch(
        rf"(?:(?:toi chon|chon|cho toi|tao cho toi)\s+)?{token}"
        rf"(?:\s+bai(?:\s+tap|\s+thuc\s+hanh)?)?"
        rf"(?:\s+(?:nhe|nha|di|thoi))?", folded))
