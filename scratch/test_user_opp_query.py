import sys
import os
import json

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_AI_DIR = r"d:\Project\LearnPython\ai-service"
sys.path.insert(0, BASE_AI_DIR)

from app.agents.adaptive_agent_orchestrator import AdaptiveAgentOrchestrator

orchestrator = AdaptiveAgentOrchestrator()

user_query = "Hãy tạo cho tôi nội dung bài học OPP môn C++"

print(f"\n==========================================")
print(f"Testing User Query: '{user_query}'")
print(f"==========================================")

res = orchestrator.process_turn(
    user_id="test_user_cplusplus",
    history=[{"sender": "USER", "content": user_query}],
    user_mastery={}
)

print(f"\n>>> RESULT:")
print(f"Intent: {res['intent']}")
print(f"Reply Preview (first 500 chars):\n{res['reply'][:500]}")
print(f"Suggested Options: {res['suggested_options']}")

assert res['intent'] == "EXPLAIN_CONCEPT"
assert "C++" in res['reply'] or "Lập trình Hướng đối tượng" in res['reply']
print("\n=> SUCCESS: User query correctly recognized as C++ OOP Lesson/Explanation!")
