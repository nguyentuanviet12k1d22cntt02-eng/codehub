import math
import re
from app.agents.intent_router_agent import folded
from app.contracts.specification import ExerciseSpecification
from app.services.knowledge_graph_service import KnowledgeGraphService


class AdaptiveExercisePlanner:
    def __init__(self, kg_service=None, learner_service=None, history_service=None):
        self.kg = kg_service or KnowledgeGraphService()
        self.learner_service = learner_service

    def plan_exercise(self, routing, user_id, explicit_concept_id=None, learner_context=None):
        ctx = learner_context or {}
        states = ctx.get("states", {})
        if not states and self.learner_service:
            states = {cid: {"mastery": score, "attempts": 1} for cid, score in self.learner_service.get_user_mastery_map(user_id).items()}
        concepts = [
            concept for concept in self.kg.list_all_concepts(routing.language)
            if concept.get("content_status", "PUBLISHED") == "PUBLISHED"
        ]
        if not concepts:
            raise ValueError("Không có đồ thị tri thức cho ngôn ngữ yêu cầu")
        requested = explicit_concept_id or self.kg.resolve_concept_by_topic(routing.language, routing.topic)
        if (explicit_concept_id or routing.topic) and not requested:
            raise ValueError("Chưa xác định được chủ đề trong đồ thị; cần làm rõ yêu cầu")
        if requested and not any(concept["id"] == requested for concept in concepts):
            raise ValueError("Chủ đề đã có trong đồ thị nhưng học liệu kiểm định chưa được phát hành")
        recent = ctx.get("recent_exercises", [])

        def prerequisite_is_ready(concept_id):
            state = states.get(concept_id, {})
            attempts = int(state.get("attempts", 0))
            confidence = float(state.get("confidence", 1 - math.exp(-attempts / 3)))
            return attempts > 0 and float(state.get("mastery", 0)) >= .6 and confidence >= .25

        if requested:
            cid, selection = requested, "explicit"
        else:
            eligible = [c for c in concepts if all(prerequisite_is_ready(p) for p in self.kg.get_prerequisites(routing.language, c["id"]))]
            if not eligible:
                eligible = [c for c in concepts if not self.kg.get_prerequisites(routing.language, c["id"])]
            if not eligible:
                raise ValueError("Đồ thị không có kỹ năng khởi đầu hợp lệ")
            cid = min(eligible, key=lambda c: (states.get(c["id"], {}).get("mastery", .4) + (.12 if c["id"] in recent[:2] else 0), concepts.index(c)))["id"]
            selection = "adaptive"
        concept = self.kg.get_concept(routing.language, cid)
        if not concept:
            raise ValueError("Concept không thuộc ngôn ngữ đã chọn")
        state = states.get(cid, {})
        attempts = int(state.get("attempts", 0))
        mastery = min(1., max(0., float(state.get("mastery", .4))))
        prereqs = self.kg.get_prerequisites(routing.language, cid)
        gaps = [p for p in prereqs if not prerequisite_is_ready(p)]
        difficulty = "EASY" if mastery < .5 or not attempts else "MEDIUM" if mastery < .8 else "HARD"
        mode = "diagnostic" if not attempts else "progression"
        if routing.difficulty_request == "easier" or state.get("failure_streak", 0) >= 3:
            difficulty, mode = "EASY", "remediation"
        elif routing.difficulty_request == "harder":
            levels = ["EASY", "MEDIUM", "HARD", "CHALLENGE"]
            previous = ctx.get("last_difficulty", difficulty)
            difficulty = levels[min(3, levels.index(previous) + 1)] if previous in levels else "HARD"
        text = folded(routing.user_text)
        required, forbidden = [], []
        for construct in ["while", "for", "sum", "lambda", "class", "recursion", "sort", "sorted"]:
            if re.search(r"(?:khong|cam|tranh)(?:\s+duoc)?(?:\s+su dung|\s+dung)?\s+`?" + construct + r"\b", text):
                forbidden.append(construct)
            elif re.search(r"(?:dung|su dung|bat buoc|ve)\s+`?" + construct + r"\b", text):
                required.append(construct)
        if routing.topic in ("while", "for") and routing.topic not in forbidden:
            required.append(routing.topic)
        execution = {"mode": "stdio" if routing.language == "cpp" else "sql" if routing.language == "sql" else "function", "entrypoint": "main" if routing.language == "cpp" else "query" if routing.language == "sql" else "solution", "comparator": "text" if routing.language == "cpp" else "json"}
        if routing.language in ("python", "javascript"):
            # The generator chooses this explicitly on every test case.  The
            # value here declares that a call style is mandatory, not a
            # default the runner may silently infer.
            execution["call_style_required"] = True
        if routing.language == "sql":
            execution.update(dialect="sqlite", ordered=bool(re.search(r'order\s+by|sap xep|thu tu', text)))
        focus = [f'Áp dụng {c} đúng yêu cầu và xử lý trường hợp biên.' for c in dict.fromkeys(required)]
        sub_skills = focus or self.kg.get_sub_skills(routing.language, cid)[:1 if difficulty == 'EASY' else 2]
        return ExerciseSpecification(target_concept=cid, concept_title=concept.get("name", cid),
            language=routing.language, difficulty=difficulty, mode=mode, selection_mode=selection,
            user_request=routing.user_text, execution=execution, prerequisites=prereqs,
            learning_objectives=sub_skills,
            target_sub_skills=sub_skills,
            required_constructs=list(dict.fromkeys(required)), forbidden_constructs=forbidden,
            recent_errors=ctx.get("recent_errors", [])[:3],
            test_constraints={"min_cases": 4, "max_cases": 8, "require_hidden_case": True, "require_boundary_case": True, "max_execution_time_ms": 3000},
            learner_evidence={"mastery": mastery if attempts else None, "attempts": attempts,
                "confidence": state.get("confidence") if attempts else None,
                "prerequisite_gaps": gaps, "policy": "evidence_policy_v4"},
            reasoning=("Bám sát chủ đề được yêu cầu. " if selection == "explicit" else "Chọn kỹ năng đủ điều kiện tiên quyết và cần luyện. ") + ("Chưa đủ bằng chứng: dùng bài chẩn đoán." if not attempts else f"Dựa trên {attempts} lượt làm đã lưu; mastery {mastery:.2f}."),
            trace_id=routing.trace_id)
