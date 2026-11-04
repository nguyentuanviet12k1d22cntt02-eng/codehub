from typing import Dict, Any


class LegacyMasteryMixin:

    def process_mastery_update(
        self,
        user_id: str,
        concept_id: str,
        passed: bool,
        current_mastery_map: Dict[str, float]
    ) -> Dict[str, Any]:
        """
        Kịch bản 4: Cập nhật độ thành thạo và gợi ý mắt xích tiếp theo trên đồ thị DAG
        """
        concept = self.retriever.get_concept_by_id(concept_id) or {"id": concept_id, "concept_name": concept_id}
        concept_name = concept.get("concept_name", concept_id)
        old_score = current_mastery_map.get(concept_id, 0.40)

        # Công thức cập nhật thích ứng: Nếu pass tăng +0.25 (tối đa 1.0), nếu fail giảm -0.10 (tối thiểu 0.1)
        if passed:
            new_score = min(1.0, round(old_score + 0.25, 2))
        else:
            new_score = max(0.1, round(old_score - 0.10, 2))

        updated_map = dict(current_mastery_map)
        updated_map[concept_id] = new_score

        # Truy vấn các concept mở khóa tiếp theo trên DAG
        concept_language = (
            "CPP" if concept_id.startswith("CPP-")
            else "JAVASCRIPT" if concept_id.startswith("JS-")
            else "PYTHON"
        )
        next_nodes = self.retriever.get_next_forward_concepts(concept_id, updated_map, language=concept_language) or []

        agent_traces = [
            {
                "agent": "CriticEvaluatorAgent",
                "action": "Verify Submission in Sandbox",
                "result": "PASSED_100%" if passed else "TESTCASES_FAILED",
                "details": f"Học viên đã nộp bài giải concept {concept_id}"
            },
            {
                "agent": "KnowledgeRetriever",
                "action": "Update Mastery & DAG Traversal",
                "result": f"{int(old_score*100)}% -> {int(new_score*100)}%",
                "details": f"Gợi ý {len(next_nodes)} concept tiếp theo trên DAG"
            }
        ]

        if passed:
            next_concept_name = next_nodes[0]["concept_name"] if next_nodes else "Cấu trúc dữ liệu nâng cao"
            reply_text = (
                f"🎉 **Chúc mừng bạn!** Bạn đã giải đúng 100% testcases của bài tập `{concept_name}`.\n\n"
                f"📈 **Chỉ số năng lực:** Độ thành thạo `{concept_name}` đã tăng từ **{int(old_score*100)}%** lên **{int(new_score*100)}%**.\n"
                f"🚀 **Bước tiếp theo trên lộ trình:** Dựa trên đồ thị tri thức DAG, mắt xích mở khóa tiếp theo cho bạn là `{next_concept_name}`."
            )
        else:
            reply_text = (
                f"Bài nộp chưa vượt qua toàn bộ testcases. Độ thành thạo hiện tại: {int(new_score*100)}%.\n"
                f"Đừng nản lòng! Bạn có thể xem gợi ý hoặc yêu cầu bài tập nền tảng hơn."
            )

        return {
            "concept_id": concept_id,
            "concept_name": concept_name,
            "old_mastery": old_score,
            "new_mastery": new_score,
            "passed": passed,
            "next_recommendations": next_nodes,
            "reply": reply_text,
            "agent_traces": agent_traces
        }
