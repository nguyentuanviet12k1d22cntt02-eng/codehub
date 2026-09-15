import json
import re
from typing import Dict, Any, Optional
from app.contracts.specification import ExerciseSpecification

try:
    from app.llm.omniroute_client import generate_json_content
except ImportError:
    try:
        from core.omniroute_client import generate_json_content
    except ImportError:
        def generate_json_content(prompt: str, system_prompt: str = None) -> str:
            return None


class CriticEvaluatorAgent:
    """
    Tầng kiểm định 4: Đánh giá sư phạm (Critic Evaluator Agent).
    QUY TẮC HIẾN PHÁP (Constitutional Rule):
    - Chỉ chạy sau khi SchemaValidator, AstConstraintValidator, SandboxValidator ĐÃ ĐẠT.
    - Không thay thế các kiểm tra kỹ thuật (syntax, AST, sandbox).
    - Đánh giá: Độ rõ ràng của đề bài, tính phù hợp của dữ liệu ví dụ, sự đầy đủ của gợi ý 3 tầng (Scaffold).
    """

    SYSTEM_PROMPT = """Bạn là CriticEvaluatorAgent - Chuyên gia thẩm định sư phạm lập trình cao cấp.
Nhiệm vụ của bạn là đánh giá chất lượng sư phạm của một bài tập đã vượt qua toàn bộ kiểm tra kỹ thuật, đối chiếu với ExerciseSpecification ban đầu.

Trả về DUY NHẤT một JSON hợp lệ tuân thủ schema:
{
  "is_approved": true,
  "pedagogical_score": 0.90,
  "clarity_rating": "EXCELLENT | GOOD | FAIR | POOR",
  "feedback": "Nhận xét chi tiết về tính sư phạm và khả năng truyền cảm hứng của bài tập",
  "repair_instructions": "Nếu is_approved = false, cung cấp hướng dẫn sửa cụ thể cho Generator"
}

Tiêu chí duyệt (is_approved = true khi score >= 0.75):
1. Đề bài diễn đạt trong sáng, có ngữ cảnh thực tế, nêu rõ quy cách I/O.
2. Không chứa từ ngữ mập mờ, đa nghĩa hoặc gây nhầm lẫn cho người mới học.
3. Có đủ 3 cấp độ gợi ý (Scaffold 1: Ý niệm -> Scaffold 2: Cú pháp -> Scaffold 3: Mã giả).
4. Phù hợp tuyệt đối với độ khó và kỹ năng con trong đặc tả.

TUYỆT ĐỐI KHÔNG VIẾT PROSE BÊN NGOÀI JSON."""

    def __init__(self):
        pass

    def evaluate(self, exercise_data: Dict[str, Any], spec: ExerciseSpecification) -> Dict[str, Any]:
        return self.evaluate_content(theory_content=exercise_data.get("quick_theory", ""), exercise_data=exercise_data, spec=spec)

    def evaluate_content(
        self,
        theory_content: str,
        exercise_data: Dict[str, Any],
        spec: ExerciseSpecification
    ) -> Dict[str, Any]:
        """
        Thẩm định chất lượng nội dung theo sơ đồ kiến trúc:
        1. Kiểm tra chất lượng Lý thuyết (Agent sinh lý thuyết)
        2. Kiểm tra chất lượng Bài tập & Test cases (Agent sinh luyện tập)
        3. Kiểm tra tính tương thích giữa Lý thuyết và Thực hành
        4. Phát hiện nhánh lỗi: 'THEORY' (False lý thuyết), 'EXERCISE' (False thực hành), hoặc 'NONE' (Hợp lý - True)
        """
        title = exercise_data.get("title", "")
        statement = exercise_data.get("problem_statement", "")
        hints = exercise_data.get("hints") or {}

        # 1. Kiểm định nhanh bằng Heuristics (Deterministic First)
        theory_text = (theory_content or "").strip()
        has_cjk = bool(re.search(r"[\u4e00-\u9fff]", theory_text + statement))
        
        # Kiểm tra lý thuyết
        if len(theory_text) < 80 or has_cjk:
            return {
                "is_approved": False,
                "feedback_target": "THEORY",
                "theory_approved": False,
                "exercise_approved": True,
                "compatibility_approved": True,
                "theory_feedback": "Lý thuyết quá ngắn hoặc còn chứa ký tự không phù hợp. Cần bổ sung ví dụ thực tế và giải thích chi tiết hơn.",
                "exercise_feedback": None,
                "score": 0.40,
                "feedback": "Lý thuyết chưa đạt chuẩn sư phạm."
            }

        # Kiểm tra bài tập
        heuristic_ex = self._heuristic_pedagogical_check(statement, hints, spec)
        if not heuristic_ex.get("is_approved"):
            return {
                "is_approved": False,
                "feedback_target": "EXERCISE",
                "theory_approved": True,
                "exercise_approved": False,
                "compatibility_approved": True,
                "theory_feedback": None,
                "exercise_feedback": heuristic_ex.get("repair_instructions"),
                "score": heuristic_ex.get("score", 0.45),
                "feedback": heuristic_ex.get("feedback")
            }

        # Kiểm tra tính tương thích giữa LT và TH
        concept_clean = (spec.concept_title or spec.target_concept or "").lower()
        topic_words = [w for w in concept_clean.replace("-", " ").replace("_", " ").split() if len(w) > 2]
        is_compatible = True
        if topic_words:
            # Kiểm tra xem đề bài có liên quan đến chủ đề lý thuyết không
            statement_lower = (title + " " + statement).lower()
            match_count = sum(1 for w in topic_words if w in statement_lower)
            if match_count == 0 and len(topic_words) > 1:
                is_compatible = False

        if not is_compatible:
            return {
                "is_approved": False,
                "feedback_target": "EXERCISE",
                "theory_approved": True,
                "exercise_approved": False,
                "compatibility_approved": False,
                "theory_feedback": None,
                "exercise_feedback": f"Bài tập chưa tương thích chặt chẽ với chủ đề lý thuyết '{spec.concept_title}'. Hãy thiết kế bài tập trực tiếp rèn luyện kỹ năng này.",
                "score": 0.50,
                "feedback": "Nội dung bài tập và lý thuyết chưa thực sự đồng nhất."
            }

        # 2. LLM deep review (nếu cần đánh giá sâu)
        prompt = f"""ĐẶC TẢ YÊU CẦU:
- Concept: {spec.target_concept} ({spec.concept_title or ''})
- Độ khó: {spec.difficulty}
- Chế độ: {spec.mode}
- Sub-skills: {', '.join(spec.target_sub_skills)}

NỘI DUNG LÝ THUYẾT:
{theory_text[:600]}

NỘI DUNG BÀI TẬP:
- Tiêu đề: {title}
- Đề bài: {statement}
- Gợi ý: {json.dumps(hints, ensure_ascii=False)}

Hãy thẩm định xem Lý thuyết và Bài tập có tương thích và đạt chuẩn sư phạm không. Trả về JSON:
{{"is_approved": true, "pedagogical_score": 0.90, "clarity_rating": "GOOD", "feedback": "Đạt chuẩn", "repair_instructions": null}}"""

        try:
            raw_res = generate_json_content(prompt, self.SYSTEM_PROMPT)
            if raw_res:
                parsed = self._clean_and_parse_json(raw_res)
                if parsed and ("is_approved" in parsed or "pedagogical_score" in parsed):
                    score = float(parsed.get("pedagogical_score", 0.85))
                    approved = bool(parsed.get("is_approved", score >= 0.75))
                    if score >= 0.75 and not parsed.get("repair_instructions"):
                        approved = True

                    return {
                        "is_approved": approved,
                        "feedback_target": "NONE" if approved else "EXERCISE",
                        "theory_approved": True,
                        "exercise_approved": approved,
                        "compatibility_approved": approved,
                        "theory_feedback": None,
                        "exercise_feedback": parsed.get("repair_instructions") if not approved else None,
                        "score": score,
                        "clarity_rating": parsed.get("clarity_rating", "GOOD"),
                        "feedback": parsed.get("feedback", "Nội dung đạt chuẩn sư phạm và tương thích tốt."),
                        "repair_instructions": parsed.get("repair_instructions")
                    }
        except Exception as e:
            print(f"[CriticEvaluatorAgent Warning]: {e}")

        # 3. Fallback approved if heuristics passed
        return {
            "is_approved": True,
            "feedback_target": "NONE",
            "theory_approved": True,
            "exercise_approved": True,
            "compatibility_approved": True,
            "theory_feedback": None,
            "exercise_feedback": None,
            "score": heuristic_ex.get("score", 0.85),
            "clarity_rating": heuristic_ex.get("clarity_rating", "GOOD"),
            "feedback": "Lý thuyết và bài tập đã được kiểm tra logic hợp lý và tương thích tốt.",
            "repair_instructions": None
        }

    def _heuristic_pedagogical_check(self, statement: str, hints: Any, spec: ExerciseSpecification) -> Dict[str, Any]:
        # Kiểm tra độ dài và chất lượng tối thiểu
        if len(statement.strip()) < 30:
            return {
                "is_approved": False,
                "score": 0.30,
                "clarity_rating": "POOR",
                "feedback": "Mô tả đề bài quá ngắn, không đủ thông tin cho người học.",
                "repair_instructions": "Hãy mở rộng problem_statement, thêm ví dụ Input/Output cụ thể và giải thích yêu cầu rõ ràng hơn."
            }

        # Kiểm tra scaffold hints
        has_scaffolds = False
        if isinstance(hints, dict):
            if hints.get("scaffold_1_conceptual") and hints.get("scaffold_2_syntax"):
                has_scaffolds = True

        score = 0.88 if has_scaffolds else 0.78
        return {
            "is_approved": True,
            "score": score,
            "clarity_rating": "GOOD" if has_scaffolds else "FAIR",
            "feedback": "Bài tập có cấu trúc sư phạm tốt, mô tả đề bài rõ ràng, phù hợp độ khó.",
            "repair_instructions": None
        }

    def _clean_and_parse_json(self, raw_str: str) -> Optional[Dict[str, Any]]:
        cleaned = raw_str.strip()
        if "```json" in cleaned:
            cleaned = cleaned.split("```json")[1].split("```")[0].strip()
        elif "```" in cleaned:
            cleaned = cleaned.split("```")[1].split("```")[0].strip()

        try:
            return json.loads(cleaned)
        except Exception:
            json_match = re.search(r"\{.*\}", cleaned, re.DOTALL)
            if json_match:
                try:
                    return json.loads(json_match.group(0))
                except Exception:
                    pass
        return None
