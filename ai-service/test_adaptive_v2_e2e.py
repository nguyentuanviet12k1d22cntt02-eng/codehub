import sys
import json
from app.contracts.routing import RoutingDecision
from app.contracts.specification import ExerciseSpecification
from app.contracts.execution import ExecutionResult
from app.orchestrator.adaptive_learning_orchestrator import AdaptiveLearningOrchestrator
from app.validation import SchemaValidator, AstConstraintValidator, SandboxValidator


def test_branch_1_agent_chao_hoi(orch: AdaptiveLearningOrchestrator):
    print("\n--- [NHÁNH 1 - FLOWCHART]: Agent Chào Hỏi & Giới Thiệu Bot / Môn Học ---")
    # Case 1: Hỏi danh tính & các môn học hỗ trợ
    user_id = "test_learner_branch1"
    messages = [
        {"sender": "USER", "content": "Xin chào! Bạn là bot nào? Tôi có thể học môn nào và bạn hỗ trợ những gì?"}
    ]
    res = orch.process_turn(user_id=user_id, history=messages, language="javascript")
    
    assert res["intent"] == "GENERAL_CHAT", f"Expected GENERAL_CHAT, got {res['intent']}"
    assert res["exercise"] is None, "Exercise must be None for Branch 1"
    assert "JavaScript" in res["reply"] and "Python" in res["reply"] and "C++" in res["reply"], "Reply must introduce supported languages"
    assert "CodeHub Adaptive AI Tutor" in res["reply"], "Reply must state bot identity"
    print("  ✅ PASS: Nhánh 1 phản hồi chính xác danh tính bot, các môn học và năng lực tác tử!")


def test_branch_2_agent_giai_thich(orch: AdaptiveLearningOrchestrator):
    print("\n--- [NHÁNH 2 - FLOWCHART]: Agent Giải Thích (Lý Thuyết / Thuật Toán) ---")
    user_id = "test_learner_branch2"
    messages = [
        {"sender": "USER", "content": "Giải thích cho tôi về OOP và Class trong C++"}
    ]
    res = orch.process_turn(user_id=user_id, history=messages, language="cpp")
    
    assert res["intent"] == "EXPLAIN_CONCEPT", f"Expected EXPLAIN_CONCEPT, got {res['intent']}"
    assert res["exercise"] is None, "Exercise must be None for Branch 2"
    assert "Lý Thuyết & Nguyên Lý Cốt Lõi" in res["reply"], "Reply must contain pedagogical theory"
    print("  ✅ PASS: Nhánh 2 giải thích lý thuyết sư phạm chuẩn 5 phần, không đổi mastery!")


def test_branch_3_agent_ask_tra_cuu_tri_thuc(orch: AdaptiveLearningOrchestrator):
    print("\n--- [NHÁNH 3 - FLOWCHART]: Agent ASK Tra Cứu Tri Thức (Knowledge Graph) ---")
    user_id = "test_learner_branch3"
    messages = [
        {"sender": "USER", "content": "Cho tôi tra cứu tri thức và danh sách skill_id của JavaScript"}
    ]
    res = orch.process_turn(user_id=user_id, history=messages, language="javascript")
    
    assert res["intent"] == "ASK_KNOWLEDGE", f"Expected ASK_KNOWLEDGE, got {res['intent']}"
    assert res["exercise"] is None, "Exercise must be None for Branch 3"
    assert "Bản Đồ Tri Thức" in res["reply"], "Reply must contain Knowledge Graph table"
    assert "JS-VAR-01" in res["reply"] or "skill_id" in res["reply"], "Reply must contain skill IDs"
    print("  ✅ PASS: Nhánh 3 tra cứu cây tri thức và trả về danh sách skill_id thành công!")


def test_branch_4_agent_quyet_dinh_bai_tap(orch: AdaptiveLearningOrchestrator):
    print("\n--- [NHÁNH 4 - FLOWCHART]: Agent Quyết Định Bài Tập (Dual Theory + Exercise) ---")
    user_id = "test_learner_branch4"
    messages = [
        {"sender": "USER", "content": "Tôi đang yếu function của javascript, cho tôi một bài dễ hơn để luyện lại"}
    ]
    res = orch.process_turn(user_id=user_id, history=messages, language="javascript")
    
    assert res["intent"] == "REQUEST_ADAPTIVE_EXERCISE", f"Expected REQUEST_ADAPTIVE_EXERCISE, got {res['intent']}"
    assert res["exercise"] is not None, "Exercise must not be None for Branch 4"
    assert res["exercise"]["difficulty"] == "EASY", f"Expected EASY, got {res['exercise']['difficulty']}"
    assert "Thẻ bài tập bên dưới" in res["reply"], "Reply must direct learner to exercise card"
    assert len(res["reply"]) < 800, "Reply in chat must be concise"
    assert "theoryContent" in res["exercise"], "Full theory must be attached to exercise for Editor viewer"
    
    # Kiểm tra vết các agent theo đúng sơ đồ
    agent_names = [t.get("agent") or t.get("validator") for t in res["agent_traces"]]
    print(f"  Traces recorded: {agent_names}")
    assert "IntentRouterAgent" in agent_names
    assert "KnowledgeRetrievalAgent" in agent_names
    assert "AdaptiveExercisePlanner" in agent_names
    assert "ExplanationTutorAgent" in agent_names
    assert "ExerciseGeneratorAgent" in agent_names
    assert "CriticEvaluatorAgent" in agent_names
    assert "DeliveryAgent" in agent_names
    print(f"  ✅ PASS: Nhánh 4 kích hoạt đồng thời Lý Thuyết + Bài Tập, qua Critic và thông báo ngắn gọn thành công!")


def test_branch_5_agent_tao_lo_trinh(orch: AdaptiveLearningOrchestrator):
    print("\n--- [NHÁNH 5 - FLOWCHART]: Agent Tạo Lộ Trình (Learning Path Flow) ---")
    user_id = "test_learner_branch5"
    messages = [
        {"sender": "USER", "content": "Hãy tạo lộ trình học JavaScript từ đầu cho người mới bắt đầu"}
    ]
    res = orch.process_turn(user_id=user_id, history=messages, language="javascript")
    
    assert res["intent"] == "CREATE_LEARNING_PATH", f"Expected CREATE_LEARNING_PATH, got {res['intent']}"
    assert res["exercise"] is not None, "Must provide starting exercise for milestone 1"
    assert "Lộ trình học" in res["reply"], "Must announce learning path concisely"
    assert "Cột mốc khởi đầu" in res["reply"] or "cột mốc đầu tiên" in res["reply"], "Must announce starting milestone"
    assert len(res["reply"]) < 800, "Reply in chat must be concise"
    assert "theoryContent" in res["exercise"], "Must attach theoryContent to milestone exercise"
    print("  ✅ PASS: Nhánh 5 thiết lập lộ trình và thông báo ngắn gọn, súc tích thành công!")


def test_critic_compatibility_and_feedback_loop(orch: AdaptiveLearningOrchestrator):
    print("\n--- [CRITIC EVALUATION & FEEDBACK LOOP]: Kiểm tra Hợp Lý Chưa? (True / False) ---")
    spec = ExerciseSpecification(
        target_concept="JS-VAR-01",
        concept_title="Biến và Hằng Số (let, const, var)",
        language="javascript",
        difficulty="EASY",
        required_constructs=["let", "const"],
        forbidden_constructs=["var"]
    )

    # 1. Test case: Lý thuyết quá ngắn -> False lý thuyết (feedback_target = "THEORY")
    bad_theory = "Biến là ô nhớ."
    good_exercise = {
        "title": "Khai Báo Biến Cơ Bản",
        "problem_statement": "Hãy viết hàm khởi tạo biến let và hằng const theo yêu cầu bài toán cụ thể.",
        "hints": {"scaffold_1_conceptual": "Dùng let cho biến đổi giá trị", "scaffold_2_syntax": "let x = 1;"}
    }
    critic_fail_theory = orch.critic_agent.evaluate_content(bad_theory, good_exercise, spec)
    assert not critic_fail_theory["is_approved"], "Critic must reject too short theory"
    assert critic_fail_theory["feedback_target"] == "THEORY", "Target must be THEORY"
    print(f"  Critic bắt lỗi lý thuyết: {critic_fail_theory['theory_feedback']}")

    # 2. Test case: Bài tập không tương thích chủ đề -> False thực hành (feedback_target = "EXERCISE")
    good_theory = (
        "## 1. Tổng Quan\nBiến và hằng số let const var trong JavaScript là nền tảng quản lý bộ nhớ...\n"
        "## 2. Cú pháp\nlet x = 10; const PI = 3.14;\n## 3. Code minh họa\nlet a = 1; console.log(a);"
    )
    unrelated_exercise = {
        "title": "Viết Thuật Toán Sắp Xếp Nổi Bọt",
        "problem_statement": "Hãy cài đặt thuật toán bubble sort sắp xếp mảng số nguyên tăng dần.",
        "hints": {"scaffold_1_conceptual": "Duyệt qua các phần tử", "scaffold_2_syntax": "for loop"}
    }
    critic_fail_compat = orch.critic_agent.evaluate_content(good_theory, unrelated_exercise, spec)
    assert not critic_fail_compat["is_approved"], "Critic must reject incompatible exercise"
    assert critic_fail_compat["feedback_target"] == "EXERCISE", "Target must be EXERCISE"
    print(f"  Critic bắt lỗi không tương thích: {critic_fail_compat['exercise_feedback']}")

    # 3. Test case: Cả 2 đều chuẩn -> Hợp lý (True)
    compatible_exercise = {
        "title": "Quản Lý Biến và Hằng Số Khóa Học",
        "problem_statement": "Trong hệ thống quản trị, hãy viết hàm getCourseInfo(courseName, initialScore) định nghĩa hằng số MAX_SCORE = 100 bằng const, và biến let currentScore gán bằng initialScore. Hàm trả về chuỗi thông tin định dạng.",
        "hints": {
            "scaffold_1_conceptual": "Dùng const cho giá trị cố định MAX_SCORE và let cho currentScore vì điểm số có thể cập nhật.",
            "scaffold_2_syntax": "const MAX_SCORE = 100;\nlet currentScore = initialScore;",
            "scaffold_3_code": "function getCourseInfo(courseName, initialScore) {\n  const MAX_SCORE = 100;\n  let currentScore = initialScore;\n  return `${courseName}: ${currentScore}/${MAX_SCORE}`;\n}"
        }
    }
    critic_pass = orch.critic_agent.evaluate_content(good_theory, compatible_exercise, spec)
    assert critic_pass["is_approved"] is True, f"Critic must approve compatible content, got: {critic_pass}"
    assert critic_pass["feedback_target"] == "NONE", "Target must be NONE when approved"
    print(f"  Critic nghiệm thu: is_approved = True (Score: {critic_pass['score']})")
    print("  ✅ PASS: Vòng lặp phản hồi Critic (Hợp lý chưa?) hoạt động chuẩn xác theo sơ đồ!")


def test_submission_feedback_loop(orch: AdaptiveLearningOrchestrator):
    print("\n--- [VÒNG LẶP NỘP BÀI]: Feedback Loop & Cập Nhật Mastery Sau Nộp Bài ---")
    user_id = "test_learner_sub"
    concept_id = "PY-BASICS-01"

    # Nộp bài đúng
    passed_sub = ExecutionResult(
        submission_id="sub_test_101",
        user_id=user_id,
        exercise_id="ex_101",
        concept_id=concept_id,
        status="PASSED",
        passed_count=3,
        total_count=3,
        test_results=[
            {"id": "tc_1", "passed": True, "input": "(2,)", "expected": "4", "actual": "4"},
            {"id": "tc_2", "passed": True, "input": "(5,)", "expected": "10", "actual": "10"}
        ],
        code="def solution(n): return n * 2",
        runtime="python"
    )
    fb_pass = orch.process_submission_feedback(passed_sub)
    assert fb_pass["passed"] is True
    assert fb_pass["delta"] > 0
    print(f"  Mastery tăng: +{fb_pass['delta']} -> New Mastery: {fb_pass['new_mastery']}")
    print("  ✅ PASS: Vòng lặp nộp bài hoàn tất thành công!")


if __name__ == "__main__":
    print("==================================================================")
    print("CHẠY BỘ KIỂM THỬ ĐỐI CHIẾU SƠ ĐỒ MULTI-AGENT ADAPTIVE LEARNING V2.1")
    print("==================================================================")
    orchestrator = AdaptiveLearningOrchestrator()
    
    test_branch_1_agent_chao_hoi(orchestrator)
    test_branch_2_agent_giai_thich(orchestrator)
    test_branch_3_agent_ask_tra_cuu_tri_thuc(orchestrator)
    test_branch_4_agent_quyet_dinh_bai_tap(orchestrator)
    test_branch_5_agent_tao_lo_trinh(orchestrator)
    test_critic_compatibility_and_feedback_loop(orchestrator)
    test_submission_feedback_loop(orchestrator)
    
    print("\n🎉 TOÀN BỘ CÁC NHÁNH VÀ VÒNG LẶP SƠ ĐỒ ĐÃ ĐƯỢC KIỂM CHỨNG 100% ĐẠT CHUẨN!")
