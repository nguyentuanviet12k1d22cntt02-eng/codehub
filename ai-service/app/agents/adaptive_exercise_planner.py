import math
import re
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
        # The Router normalizes a recognized topic to a graph-owned concept ID.
        # Do not let an unverified free-text label reach the planning policy:
        # every explicit query below must address one concrete course concept.
        requested = explicit_concept_id or (
            routing.topic if self.kg.get_concept(routing.language, routing.topic) else None
        )
        if (explicit_concept_id or routing.topic) and not requested:
            raise ValueError("Chưa ánh xạ được yêu cầu vào mã concept đã phát hành; cần làm rõ chủ đề")
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
        readiness = ctx.get("readiness_assessment", {}) if isinstance(ctx.get("readiness_assessment", {}), dict) else {}
        prerequisite_score = min(1., max(0., float(readiness.get("readiness_score", mastery))))
        forced_override = bool(ctx.get("force_prerequisite_override") and requested)
        ability_score = min(mastery, prerequisite_score) if forced_override else mastery
        difficulty = "EASY" if ability_score < .5 or not attempts else "MEDIUM" if ability_score < .8 else "HARD"
        mode = "remediation" if forced_override and readiness.get("prerequisite_gaps") else "diagnostic" if not attempts else "progression"
        if routing.difficulty_request == "easier" or state.get("failure_streak", 0) >= 3:
            difficulty, mode = "EASY", "remediation"
        elif routing.difficulty_request == "harder":
            levels = ["EASY", "MEDIUM", "HARD", "CHALLENGE"]
            previous = ctx.get("last_difficulty", difficulty)
            difficulty = levels[min(3, levels.index(previous) + 1)] if previous in levels else "HARD"
        required = list(routing.required_constructs)
        forbidden = list(routing.forbidden_constructs)
        # The graph groups several loop syntaxes into one C++/JS concept. A
        # learner naming one syntax is still asking to practise that syntax,
        # even when the router only returns the broader concept ID.
        loop_concepts = {"python": {"PY-FLOW-02", "PY-FLOW-03"},
                         "javascript": {"JS-LOOP-01"}, "cpp": {"CPP-LOOP-01"}}
        if cid in loop_concepts.get(routing.language, set()):
            evidence = " ".join([routing.user_text, *routing.topic_evidence]).casefold()
            named_for = bool(re.search(r"\bfor\b", evidence)) or cid == "PY-FLOW-03"
            named_while = bool(re.search(r"\bwhile\b", evidence)) or cid == "PY-FLOW-02"
            if named_for and not named_while and "for" not in forbidden:
                required.append("for")
                forbidden.append("while")
            elif named_while and not named_for and "while" not in forbidden:
                required.append("while")
                forbidden.append("for")
        if cid == "CPP-VECTOR-01" and "vector" not in forbidden:
            required.append("vector")
        function_concept = {"python": "PY-FUNC-01", "javascript": "JS-FUNC-01"}.get(routing.language)
        function_ready = bool(function_concept and prerequisite_is_ready(function_concept))
        function_lesson = bool(function_concept and (
            cid.startswith(function_concept.split("-01")[0])
            or cid in {"JS-ARROW-01", "JS-CLOSURE-01", "JS-ARRAY-HOF-01"}))
        construct_lessons = {
            "python": {"for": "PY-FLOW-03", "while": "PY-FLOW-02",
                       "function": "PY-FUNC-01", "class": "PY-OOP-01"},
            "javascript": {"for": "JS-LOOP-01", "while": "JS-LOOP-01",
                           "function": "JS-FUNC-01", "class": "JS-CLASS-01"},
        }.get(routing.language, {})
        for construct, lesson_id in construct_lessons.items():
            is_target = cid == lesson_id or (construct == "function" and function_lesson)
            if not is_target and not prerequisite_is_ready(lesson_id) and construct not in required:
                forbidden.append(construct)
        forbidden = list(dict.fromkeys(forbidden))
        # A function-shaped grading API is not a learning objective. Until the
        # learner has evidence for functions, only a function lesson itself may
        # require them; earlier concepts use the already-supported stdio runner.
        use_function = routing.language in ("python", "javascript") and (function_ready or function_lesson)
        execution_mode = "sql" if routing.language == "sql" else "function" if use_function else "stdio"
        execution = {"mode": execution_mode,
                     "entrypoint": "query" if execution_mode == "sql" else "solution" if use_function else "main",
                     "comparator": "json" if execution_mode in ("sql", "function") else "text"}
        if use_function:
            # The generator chooses this explicitly on every test case.  The
            # value here declares that a call style is mandatory, not a
            # default the runner may silently infer.
            execution["call_style_required"] = True
        if routing.language == "sql":
            execution.update(dialect="sqlite", ordered=routing.ordered_output)
        focus = [f'Áp dụng {c} đúng yêu cầu và xử lý trường hợp biên.' for c in dict.fromkeys(required)]
        sub_skills = focus or self.kg.get_sub_skills(routing.language, cid)[:1 if difficulty == 'EASY' else 2]
        if cid == "PY-FLOW-03" and isinstance(ctx.get("batch_index"), int):
            batch_focus = {
                1: "Duyệt trực tiếp từng ký tự trong chuỗi bằng for item in sequence; xử lý cả chuỗi rỗng.",
                2: "Dùng for với range(start, stop, step) để tạo dãy số có bước nhảy.",
                3: "Dùng for với range() và biến tích lũy để tính tổng một dãy số.",
                4: "Dùng for với range() chỉ số giảm dần để duyệt chuỗi ngược và tạo chuỗi đảo ngược.",
                5: "Dùng for với range() và biến tích lũy phép nhân để tính tích một dãy số.",
            }
            if ctx["batch_index"] in batch_focus:
                sub_skills = [batch_focus[ctx["batch_index"]]]
        if cid == "PY-SET-01" and {"for", "while"} <= set(forbidden):
            sub_skills = [
                "Chuyển danh sách từ do input().split() tạo ra thành set để loại trùng, "
                "rồi dùng ít nhất một phép giao (&), hợp (|) hoặc hiệu (-) trên hai tập hợp từ."
            ]
        if forced_override and readiness.get("prerequisite_gaps"):
            reasoning = (
                f"Học viên xác nhận tiếp tục chủ đề yêu cầu dù mức sẵn sàng tiên quyết hiện tại là "
                f"{round(prerequisite_score * 100)}%; tạo bài EASY có scaffold và không đổi concept."
            )
        else:
            reasoning = (("Bám sát chủ đề được yêu cầu. " if selection == "explicit" else
                          "Chọn kỹ năng đủ điều kiện tiên quyết và cần luyện. ") +
                         ("Chưa đủ bằng chứng: dùng bài chẩn đoán." if not attempts else
                          f"Dựa trên {attempts} lượt làm đã lưu; mastery {mastery:.2f}."))
        learner_evidence = {"mastery": mastery if attempts else None, "attempts": attempts,
            "confidence": state.get("confidence") if attempts else None,
            "prerequisite_gaps": readiness.get("prerequisite_gaps", gaps), "policy": "evidence_policy_v4",
            "prerequisite_readiness": prerequisite_score,
            "prerequisite_evidence_coverage": readiness.get("evidence_coverage"),
            "forced_prerequisite_override": forced_override,
            "function_ready": function_ready,
            "function_is_target": function_lesson,
            "avoid_function_syntax": bool(function_concept and not function_ready and not function_lesson),
            "unlearned_constructs": [name for name in construct_lessons if name in forbidden],
            "batch_index": ctx.get("batch_index"),
            "batch_total": ctx.get("batch_total")}
        return ExerciseSpecification(target_concept=cid, concept_title=concept.get("name", cid),
            language=routing.language, difficulty=difficulty, mode=mode, selection_mode=selection,
            user_request=routing.user_text, execution=execution, prerequisites=prereqs,
            learning_objectives=sub_skills,
            target_sub_skills=sub_skills,
            required_constructs=list(dict.fromkeys(required)), forbidden_constructs=forbidden,
            recent_errors=ctx.get("recent_errors", [])[:3],
            test_constraints={"min_cases": 4, "max_cases": 8, "require_hidden_case": True, "require_boundary_case": True, "max_execution_time_ms": 3000},
            learner_evidence=learner_evidence,
            reasoning=reasoning,
            trace_id=routing.trace_id)
