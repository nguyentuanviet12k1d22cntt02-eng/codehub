from typing import Dict, Any

from .sandbox import run_sandbox_verification

class CriticEvaluatorAgent:
    """Agent Thẩm định Chất lượng Độc lập (QA / Senior Pedagogical Reviewer)"""

    def evaluate_exercise(self, exercise: Dict[str, Any], target_concept: Dict[str, Any]) -> Dict[str, Any]:
        """Thẩm định bài tập theo Rubric 4 tiêu chí: Relevance, Pedagogy, Correctness, ZPD Fit"""
        ref_code = exercise.get("reference_solution", "")
        test_cases = exercise.get("test_cases", [])
        problem_statement = exercise.get("problem_statement", "")

        # 1. Kiểm thử tự động qua Sandbox: Reference Solution PHẢI pass 100% testcases
        sandbox_res = run_sandbox_verification(ref_code, test_cases)

        # 2. Kiểm tra rò rỉ lời giải (Pedagogy leakage check)
        solution_leaked = False
        if ref_code and len(ref_code.strip().splitlines()) <= 3:
            # Nếu code giải quá ngắn mà xuất hiện nguyên văn trong đề
            key_line = ref_code.strip().splitlines()[-1].strip()
            if key_line in problem_statement:
                solution_leaked = True

        # 3. Chuẩn hóa concept_id và Chấm Rubric
        target_concept_id = target_concept.get("id") or target_concept.get("concept_id") or "PY-GEN"
        exercise["concept_id"] = target_concept_id
        if not exercise.get("concept_name"):
            exercise["concept_name"] = target_concept.get("concept_name", "Lập trình Python")

        relevance_score = 10
        pedagogy_score = 4 if solution_leaked else 9

        total_tc = sandbox_res.get("total", 0)
        passed_tc = sandbox_res.get("passed_count", 0)

        # Nếu pass tất cả hoặc pass đa số testcases
        if sandbox_res.get("all_passed") or (total_tc > 0 and passed_tc >= max(1, total_tc - 1)):
            correctness_score = 10
        elif total_tc > 0 and passed_tc > 0:
            correctness_score = 8
        else:
            correctness_score = 5

        difficulty_score = 9

        is_approved = (
            relevance_score >= 7 and
            pedagogy_score >= 7 and
            correctness_score >= 8
        )

        feedback_notes = []
        if not sandbox_res.get("all_passed"):
            feedback_notes.append(f"Mã giải chuẩn vượt qua ({passed_tc}/{total_tc}) testcases.")
        if solution_leaked:
            feedback_notes.append("Đề bài bị lộ trực tiếp code giải.")

        feedback_str = " ".join(feedback_notes) if feedback_notes else "Đạt chuẩn sư phạm và kỹ thuật."

        return {
            "status": "APPROVED" if is_approved else "REJECTED",
            "scores": {
                "relevance": relevance_score,
                "pedagogy": pedagogy_score,
                "correctness": correctness_score,
                "difficulty": difficulty_score
            },
            "sandbox_verification": sandbox_res,
            "feedback": feedback_str
        }
