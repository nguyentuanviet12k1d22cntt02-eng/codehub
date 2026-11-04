"""Alias preserving the existing LLM module API and patchable client globals."""
import sys
from app.llm.pipeline import client as _implementation
sys.modules[__name__] = _implementation
