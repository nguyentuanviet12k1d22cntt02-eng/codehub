import uuid
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from app.contracts.execution import ErrorEvent
from app.contracts.attribution import ConceptAttribution, CandidateAttribution
from app.services.knowledge_graph_service import KnowledgeGraphService


class ConceptAttributionService:
    """
    Service quy kết lỗi về Khái niệm và Kỹ năng con (Concept Attribution Service).
    Gán ErrorEvent cho các node ứng viên trên đồ thị Knowledge Graph theo độ tin cậy.
    KHÔNG cập nhật mastery tại đây; chỉ tạo Attribution Event.
    """

    def __init__(self, kg_service: Optional[KnowledgeGraphService] = None):
        self.kg = kg_service or KnowledgeGraphService()

    def attribute(
        self,
        error_event: ErrorEvent,
        language: str,
        target_concept_id: str,
        code: Optional[str] = None
    ) -> ConceptAttribution:
        candidates: List[CandidateAttribution] = []
        evidence = ""

        # Lấy thông tin concept mục tiêu và các concept tiên quyết
        concept_info = self.kg.get_concept(language, target_concept_id) or {}
        prereqs = self.kg.get_prerequisites(language, target_concept_id)
        sub_skills = self.kg.get_sub_skills(language, target_concept_id)
        associated_errors = self.kg.get_associated_errors(language, target_concept_id)

        err_type = error_event.normalized_type
        sub_type = error_event.sub_type or ""

        # 1. Heuristic Attribution Matching
        # Nếu lỗi thuộc associated_errors của chính concept mục tiêu
        is_direct_match = any(
            ae.lower() in sub_type.lower() or ae.lower() in error_event.message.lower() 
            for ae in associated_errors
        )

        if is_direct_match or err_type in ("LOGIC_ERROR", "CONSTRAINT_VIOLATION"):
            # Lỗi trực tiếp trên concept đang rèn luyện
            chosen_sub = sub_skills[0] if sub_skills else "general_logic"
            if "parameter" in error_event.message.lower() or "argument" in error_event.message.lower():
                chosen_sub = "parameters"
            elif "return" in error_event.message.lower():
                chosen_sub = "return_value"

            candidates.append(CandidateAttribution(
                concept=target_concept_id,
                sub_skill=chosen_sub,
                confidence=0.85
            ))

            # Prerequisite nhận phần xác suất còn lại
            if prereqs:
                candidates.append(CandidateAttribution(
                    concept=prereqs[0],
                    sub_skill="prerequisite_foundation",
                    confidence=0.15
                ))

            evidence = f"Lỗi '{sub_type}' liên quan trực tiếp đến kỹ năng '{chosen_sub}' của concept '{target_concept_id}'."

        elif err_type == "SYNTAX_ERROR":
            # Lỗi cú pháp cơ bản thường rơi vào kiến thức nền tảng (prerequisite) hoặc concept hiện tại
            candidates.append(CandidateAttribution(
                concept=target_concept_id,
                sub_skill="syntax_structure",
                confidence=0.70
            ))
            if prereqs:
                candidates.append(CandidateAttribution(
                    concept=prereqs[0],
                    sub_skill="basic_syntax",
                    confidence=0.30
                ))
            evidence = f"Lỗi cú pháp biên dịch ({sub_type}) khi triển khai logic bài tập."

        elif err_type == "RUNTIME_ERROR":
            if sub_type in ("NameError", "ReferenceError") and prereqs:
                # Có thể do chưa nắm rõ khai báo biến ở node tiên quyết
                candidates.append(CandidateAttribution(
                    concept=prereqs[0],
                    sub_skill="variable_declaration_scope",
                    confidence=0.65
                ))
                candidates.append(CandidateAttribution(
                    concept=target_concept_id,
                    sub_skill="scope_usage",
                    confidence=0.35
                ))
                evidence = f"Lỗi {sub_type}: Biến/hàm chưa được khai báo hoặc rò rỉ scope, truy ngược về node tiên quyết '{prereqs[0]}'."
            else:
                candidates.append(CandidateAttribution(
                    concept=target_concept_id,
                    sub_skill=sub_skills[0] if sub_skills else "runtime_handling",
                    confidence=0.80
                ))
                evidence = f"Ngoại lệ runtime ({sub_type}) phát sinh trong thân hàm xử lý."

        else: # TIMEOUT or UNRESOLVED
            candidates.append(CandidateAttribution(
                concept=target_concept_id,
                sub_skill="termination_condition",
                confidence=0.55
            ))
            evidence = "Thời gian thực thi vượt ngưỡng, nghi ngờ vòng lặp vô hạn hoặc giải thuật quá chậm."

        # Chọn ứng viên có confidence cao nhất
        selected = max(candidates, key=lambda c: c.confidence) if candidates else None

        return ConceptAttribution(
            error_id=error_event.error_id,
            submission_id=error_event.submission_id,
            candidates=candidates,
            selected=selected,
            evidence=evidence,
            model_version="concept_attr_v2.1",
            created_at=datetime.now(timezone.utc).isoformat(),
            trace_id=error_event.trace_id
        )
