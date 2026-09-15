from typing import Optional, List, Dict, Any
from app.contracts.routing import RoutingDecision
from app.contracts.specification import ExerciseSpecification
from app.services.knowledge_graph_service import KnowledgeGraphService
from app.services.learner_state_service import LearnerStateService
from app.services.learning_history_service import LearningHistoryService


class AdaptiveExercisePlanner:
    """
    Bộ lập kế hoạch thích ứng trung tâm (Adaptive Exercise Planner).
    TUÂN THỦ QUY TẮC:
    - Chỉ phát hành ExerciseSpecification JSON.
    - Không viết mã nguồn hoặc đề bài hoàn chỉnh (việc đó là của Generator).
    - Áp dụng ma trận chính sách sư phạm thích ứng (Adaptive Policy Matrix) theo Mục 10.
    """

    def __init__(
        self,
        kg_service: Optional[KnowledgeGraphService] = None,
        learner_service: Optional[LearnerStateService] = None,
        history_service: Optional[LearningHistoryService] = None
    ):
        self.kg = kg_service or KnowledgeGraphService()
        self.learner_service = learner_service or LearnerStateService()
        self.history_service = history_service or LearningHistoryService()

    def plan_exercise(
        self,
        routing: RoutingDecision,
        user_id: str,
        explicit_concept_id: Optional[str] = None
    ) -> ExerciseSpecification:
        language = routing.language
        trace_id = routing.trace_id

        # 1. Xác định Concept mục tiêu
        target_concept = explicit_concept_id
        if not target_concept:
            target_concept = self.kg.resolve_concept_by_topic(language, routing.topic)

        # Lấy thông tin chi tiết concept từ Knowledge Graph
        concept_info = self.kg.get_concept(language, target_concept) or {}
        concept_title = concept_info.get("name") or concept_info.get("concept_name") or target_concept
        prereqs = self.kg.get_prerequisites(language, target_concept)
        all_sub_skills = self.kg.get_sub_skills(language, target_concept)

        # 2. Truy vấn Trạng thái Người học (Learner State) & Lịch sử
        learner_state = self.learner_service.get_learner_state(user_id, target_concept)
        mastery = learner_state.mastery
        is_repeated_fail = self.history_service.is_remediation_forced(user_id, target_concept)
        recent_submissions = self.history_service.get_recent_submissions(user_id, limit=3)
        recent_errors_list = [s.raw_error for s in recent_submissions if s.raw_error and s.concept_id == target_concept]

        # 3. Áp dụng Ma trận Chính sách Thích ứng (Adaptive Policy Matrix - Mục 10)
        mode = routing.mode
        difficulty = "MEDIUM"
        reasoning = ""
        chosen_sub_skills = list(all_sub_skills)

        # 3.1. Nếu lặp lỗi >= 3 lần: Bắt buộc kích hoạt chế độ Remediation
        if is_repeated_fail or mode == "remediation" or routing.difficulty_request == "easier":
            mode = "remediation"
            difficulty = "EASY"

            # Nếu điểm năng lực quá thấp (< 0.40), chẩn đoán xem có hổng nền tảng không
            if mastery < 0.40 and prereqs:
                user_mastery_map = self.learner_service.get_user_mastery_map(user_id)
                root_gap = self.kg.find_root_gap(language, target_concept, user_mastery_map)
                if root_gap != target_concept:
                    # Chuyển hướng ôn tập về Root Cognitive Gap
                    target_concept = root_gap
                    concept_info = self.kg.get_concept(language, target_concept) or {}
                    concept_title = concept_info.get("name") or target_concept
                    prereqs = self.kg.get_prerequisites(language, target_concept)
                    all_sub_skills = self.kg.get_sub_skills(language, target_concept)
                    reasoning = f"Phát hiện lỗ hổng nền tảng tại concept tiên quyết '{concept_title}'. Hệ thống kích hoạt vi lộ trình khắc phục (Remediation) trước khi tiếp tục."
                else:
                    reasoning = f"Học viên có độ thành thạo thấp ({round(mastery*100)}%) tại '{concept_title}'. Tạo bài tập Remediation cấp độ EASY tập trung kỹ năng căn bản."
            else:
                reasoning = f"Học viên yêu cầu bài tập dễ hơn hoặc gặp lỗi lặp lại. Giảm độ phức tạp xuống EASY để củng cố kỹ năng con."

            # Thu hẹp sub-skills cho bài Remediation (chỉ tập trung 1-2 kỹ năng cốt lõi)
            chosen_sub_skills = all_sub_skills[:2] if len(all_sub_skills) >= 2 else all_sub_skills

        # 3.2. Chế độ Tiến trình (Progression) dựa trên Mastery
        elif routing.difficulty_request == "harder" or mastery >= 0.85:
            difficulty = "HARD" if mastery < 0.90 else "CHALLENGE"
            mode = "progression"
            reasoning = f"Học viên đã làm chủ tốt concept '{concept_title}' (Mastery: {round(mastery*100)}%). Đưa ra bài tập tích hợp cấp độ {difficulty} có bẫy dữ liệu biên."
            chosen_sub_skills = all_sub_skills
        elif mastery >= 0.70:
            difficulty = "HARD" if routing.difficulty_request == "harder" else "MEDIUM"
            mode = "progression"
            reasoning = f"Học viên đạt độ thành thạo khá ({round(mastery*100)}%). Tạo bài tập liên kết đa kỹ năng cấp độ {difficulty}."
            chosen_sub_skills = all_sub_skills[:3] if len(all_sub_skills) >= 3 else all_sub_skills
        else: # 0.40 <= mastery < 0.70
            difficulty = "MEDIUM"
            mode = "progression"
            reasoning = f"Học viên đang trong vùng phát triển gần nhất (ZPD, Mastery: {round(mastery*100)}%). Tạo bài tập rèn luyện tiêu chuẩn cấp độ MEDIUM."
            chosen_sub_skills = all_sub_skills[:2] if len(all_sub_skills) >= 2 else all_sub_skills

        # 4. Xác định Ràng buộc Kỹ thuật (Required & Forbidden Constructs)
        req_constructs, forb_constructs = self._determine_syntax_constraints(language, target_concept, difficulty, mode)

        # 5. Đóng gói ExerciseSpecification
        return ExerciseSpecification(
            target_concept=target_concept,
            concept_title=concept_title,
            language=language,
            target_sub_skills=chosen_sub_skills,
            difficulty=difficulty,
            mode=mode,
            prerequisites=prereqs,
            required_constructs=req_constructs,
            forbidden_constructs=forb_constructs,
            recent_errors=recent_errors_list[:3],
            test_constraints={
                "min_cases": 4,
                "max_execution_time_ms": 5000,
                "require_hidden_case": True
            },
            reasoning=reasoning,
            trace_id=trace_id
        )

    def _determine_syntax_constraints(
        self,
        language: str,
        concept_id: str,
        difficulty: str,
        mode: str
    ) -> (List[str], List[str]):
        cid = concept_id.upper()
        req: List[str] = []
        forb: List[str] = []

        if "FUNC" in cid or "FUNCTION" in cid:
            if language == "javascript":
                req.append("function")
                if mode == "remediation":
                    forb.extend(["class", "closure", "prototype"])
            elif language == "python":
                req.append("def")
                if mode == "remediation":
                    forb.extend(["class", "lambda"])
            elif language == "cpp":
                req.append("return")

        elif "OOP" in cid or "CLASS" in cid:
            req.extend(["class"])
            if language == "python":
                req.append("__init__")
            elif language == "cpp":
                req.append("public")
            elif language == "javascript":
                req.append("constructor")
            forb.append("global")

        elif "LOOP" in cid or "CONTROL" in cid:
            req.append("for" if "FOR" in cid else "while" if "WHILE" in cid else "for")

        elif "DICT" in cid or "OBJECT" in cid:
            if language == "python":
                req.append("{")
            elif language == "javascript":
                req.append("{")

        return req, forb
