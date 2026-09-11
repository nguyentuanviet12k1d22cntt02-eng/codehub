import sys
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)

from core.adaptive_agent_orchestrator import (
    RouterAgent,
    KnowledgeRetriever,
    ExerciseGeneratorAgent,
    CriticEvaluatorAgent,
    AdaptiveAgentOrchestrator
)

def test_router_agent():
    print("\n--- 1. Testing RouterAgent ---")
    router = RouterAgent()
    
    test_cases = [
        ("Hiện tại tôi đang bị yếu phần nào của Python vậy AI?", "CHECK_WEAKNESS"),
        ("Hãy tạo cho tôi bài tập rèn luyện chủ đề mà tôi đang yếu nhất.", "REQUEST_ADAPTIVE_EXERCISE"),
        ("Bài này khó quá, tôi không hiểu cách làm, cho tôi bài đơn giản hơn đi", "ADJUST_DIFFICULTY_EASIER"),
        ("Giải thích cho tôi nguyên lý của Dictionary trong Python", "EXPLAIN_CONCEPT"),
        ("Xin chào bạn, bạn khỏe không?", "GENERAL_CHAT"),
    ]
    
    for msg, expected in test_cases:
        detected = router.classify_intent(msg, [{"sender": "USER", "content": msg}])
        print(f"Query: '{msg}' => Detected: {detected} (Expected: {expected})")
        assert detected == expected, f"Expected {expected}, got {detected}"
    print("=> RouterAgent tests PASSED!")

def test_knowledge_retriever():
    print("\n--- 2. Testing KnowledgeRetriever ---")
    retriever = KnowledgeRetriever()
    assert len(retriever.skill_graph.get("skills", [])) == 33, "Should have 33 skills in DAG"
    
    sample_mastery = {
        "PY-DICT-02": 0.32,
        "PY-FLOW-01": 0.45,
        "PY-LIST-01": 0.85,
        "PY-BASICS-01": 0.90
    }
    
    weaknesses = retriever.get_learner_weaknesses(sample_mastery, limit=3)
    print(f"Top weaknesses detected: {[w['concept_id'] for w in weaknesses]}")
    assert weaknesses[0]["concept_id"] == "PY-DICT-02", "Weakest should be PY-DICT-02"
    assert weaknesses[0]["mastery_score"] == 0.32
    print("=> KnowledgeRetriever tests PASSED!")

def test_exercise_generator_and_evaluator():
    print("\n--- 3. Testing Exercise Generator & Evaluator ---")
    retriever = KnowledgeRetriever()
    generator = ExerciseGeneratorAgent()
    evaluator = CriticEvaluatorAgent()
    
    concept = retriever.get_concept_by_id("PY-DICT-02")
    assert concept is not None, "Concept PY-DICT-02 should exist"
    
    # 1. Test standard generation / fallback
    exercise = generator._get_fallback_exercise(concept["id"], concept["concept_name"], concept.get("associated_errors", []), False)
    assert "test_cases" in exercise
    assert "reference_solution" in exercise
    
    # 2. Test evaluator
    eval_result = evaluator.evaluate_exercise(exercise, concept)
    print(f"Evaluator status: {eval_result['status']}")
    print(f"Scores: {eval_result['scores']}")
    print(f"Sandbox verification: {eval_result['sandbox_verification']}")
    assert eval_result["status"] == "APPROVED", "Pre-certified fallback exercise must be APPROVED"
    assert eval_result["sandbox_verification"]["all_passed"] is True, "Testcases must pass"
    print("=> Exercise Generator & Evaluator tests PASSED!")

def test_end_to_end_orchestrator():
    print("\n--- 4. Testing End-to-End Orchestrator (4 Scenarios) ---")
    orchestrator = AdaptiveAgentOrchestrator()
    
    user_mastery = {
        "PY-DICT-02": 0.32,
        "PY-FLOW-01": 0.42,
        "PY-LIST-01": 0.85
    }
    
    # Scenario 1: Check Weakness
    res1 = orchestrator.process_turn(
        user_id="test_user_01",
        history=[{"sender": "USER", "content": "Tôi đang bị hổng phần nào nhất vậy bạn?"}],
        user_mastery=user_mastery
    )
    print(f"\n[Scenario 1 - Weakness Check]:")
    print(f"Intent: {res1['intent']}")
    print(f"Traces: {[t['agent'] + ' -> ' + t['action'] for t in res1['agent_traces']]}")
    print(f"Reply sample: {res1['reply'][:120]}...")
    assert res1['intent'] == "CHECK_WEAKNESS"
    assert "PY-DICT-02" in res1['reply'] or "Dictionary" in res1['reply']
    
    # Scenario 2: Request Adaptive Exercise
    res2 = orchestrator.process_turn(
        user_id="test_user_01",
        history=[{"sender": "USER", "content": "Tạo bài tập rèn luyện cho phần tôi yếu nhất đi"}],
        user_mastery=user_mastery
    )
    print(f"\n[Scenario 2 - Request Exercise]:")
    print(f"Intent: {res2['intent']}")
    print(f"Exercise title: {res2['exercise']['title']}")
    print(f"Exercise concept: {res2['exercise']['concept_id']}")
    print(f"Test cases count: {len(res2['exercise']['test_cases'])}")
    assert res2['intent'] == "REQUEST_ADAPTIVE_EXERCISE"
    assert res2['exercise'] is not None
    
    # Scenario 3: Adjust Difficulty (Easier / Scaffolding)
    res3 = orchestrator.process_turn(
        user_id="test_user_01",
        history=[
            {"sender": "USER", "content": "Tạo bài tập cho tôi"},
            {"sender": "AI_TUTOR", "content": "Đây là bài tập tra cứu Dictionary..."},
            {"sender": "USER", "content": "Bài này khó quá, cho tôi bài đơn giản hơn đi"}
        ],
        user_mastery=user_mastery
    )
    print(f"\n[Scenario 3 - Adjust Difficulty Easier]:")
    print(f"Intent: {res3['intent']}")
    print(f"Exercise title: {res3['exercise']['title']}")
    print(f"Difficulty stars: {res3['exercise'].get('difficulty_stars')}")
    assert res3['intent'] == "ADJUST_DIFFICULTY_EASIER"
    assert res3['exercise'] is not None
    assert res3['exercise'].get('difficulty_stars', 2) <= 1
    
    # Scenario 4: Mastery Update & DAG Progression
    res4 = orchestrator.process_mastery_update(
        user_id="test_user_01",
        concept_id="PY-DICT-02",
        passed=True,
        current_mastery_map=user_mastery
    )
    print(f"\n[Scenario 4 - Mastery Update & DAG Progression]:")
    print(f"Concept: {res4['concept_name']} ({res4['concept_id']})")
    print(f"Mastery change: {int(res4['old_mastery']*100)}% -> {int(res4['new_mastery']*100)}%")
    print(f"Next recommendations: {[r['concept_name'] for r in res4['next_recommendations']]}")
    print(f"Reply sample: {res4['reply'][:120]}...")
    assert res4['passed'] is True
    assert res4['new_mastery'] > res4['old_mastery']
    
    print("\n=> ALL 4 SCENARIOS TESTED & VERIFIED SUCCESSFULLY!")

if __name__ == '__main__':
    test_router_agent()
    test_knowledge_retriever()
    test_exercise_generator_and_evaluator()
    test_end_to_end_orchestrator()
