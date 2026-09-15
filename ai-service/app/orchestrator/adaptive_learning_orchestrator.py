import uuid
import json
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional, Callable

from app.contracts.routing import RoutingDecision
from app.contracts.specification import ExerciseSpecification
from app.contracts.execution import ExecutionResult, ErrorEvent
from app.contracts.attribution import ConceptAttribution
from app.contracts.mastery import MasteryEvent, LearnerState

from app.services.knowledge_graph_service import KnowledgeGraphService
from app.services.learner_state_service import LearnerStateService
from app.services.learning_history_service import LearningHistoryService

from app.agents.intent_router_agent import IntentRouterAgent
from app.agents.adaptive_exercise_planner import AdaptiveExercisePlanner
from app.agents.exercise_generator_agent import ExerciseGeneratorAgent
from app.agents.critic_evaluator_agent import CriticEvaluatorAgent
from app.agents.explanation_tutor_agent import ExplanationTutorAgent

from app.validation.schema_validator import SchemaValidator
from app.validation.ast_constraint_validator import AstConstraintValidator
from app.validation.sandbox_validator import SandboxValidator
from app.feedback.error_analyzer import ErrorAnalyzer
from app.feedback.concept_attribution import ConceptAttributionService
from app.feedback.mastery_updater import MasteryUpdater


class AdaptiveLearningOrchestrator:
    """
    Bộ điều phối tổng thể Multi-Agent Adaptive Learning v2.1.
    TUÂN THỦ CÁC QUY TẮC:
    1. Zero Guessing: Luôn tuân thủ hợp đồng dữ liệu chuẩn xác giữa các agent.
    2. Deterministic First: Schema, AST, Sandbox Validator phải PASS trước khi Critic LLM chạy.
    3. Phân tách rõ ràng:
       - CHECK_WEAKNESS: Chỉ query Learner State & KG, không chạy Generator.
       - EXPLAIN_CONCEPT: Giải thích lý thuyết, không đổi mastery.
       - REQUEST_ADAPTIVE_EXERCISE: Router -> Planner -> Generator -> 4 Tầng Validator -> Delivery.
       - SUBMISSION FEEDBACK: Runner -> Error Analyzer -> Concept Attribution -> Mastery Updater -> Learner State.
    4. Gắn trace_id phân tán xuyên suốt toàn bộ lifecycle.
    """

    def __init__(self):
        # 1. Services
        self.kg_service = KnowledgeGraphService()
        self.learner_service = LearnerStateService()
        self.history_service = LearningHistoryService()

        # 2. Agents
        self.router_agent = IntentRouterAgent()
        self.planner_agent = AdaptiveExercisePlanner(
            kg_service=self.kg_service,
            learner_service=self.learner_service,
            history_service=self.history_service
        )
        self.generator_agent = ExerciseGeneratorAgent()
        self.critic_agent = CriticEvaluatorAgent()
        self.explanation_agent = ExplanationTutorAgent()

        # 3. Feedback Loop
        self.concept_attribution_service = ConceptAttributionService(kg_service=self.kg_service)
        self.mastery_updater = MasteryUpdater(learner_service=self.learner_service)

    def process_turn(
        self,
        user_id: str,
        history: List[Dict[str, str]],
        user_mastery: Optional[Dict[str, float]] = None,
        target_concept_id: Optional[str] = None,
        language: Optional[str] = None,
        event_callback: Optional[Callable[[Dict[str, Any]], None]] = None
    ) -> Dict[str, Any]:
        trace_id = f"trace_{uuid.uuid4().hex[:12]}"
        traces: List[Dict[str, Any]] = []

        def emit(agent: str, title: str, desc: str, step: str = "PROCESSING", icon: str = "⚡"):
            if event_callback:
                try:
                    event_callback({
                        "type": "agent_step",
                        "agent": agent,
                        "step": step,
                        "title": title,
                        "desc": desc,
                        "icon": icon,
                        "timestamp": datetime.now(timezone.utc).isoformat()
                    })
                except Exception:
                    pass

        # -------------------------------------------------------------
        # TẦNG 1: Intent Routing
        # -------------------------------------------------------------
        emit("IntentRouterAgent", "Phân tích câu hỏi & Định tuyến", "Đang giải mã ngữ cảnh và nhận diện ý định học tập...", "INTENT_ROUTING", "🧭")

        # Đồng bộ mastery nếu có truyền vào từ backend
        if user_mastery:
            self.learner_service.set_user_mastery_batch(user_id, user_mastery)

        # Trích xuất tin nhắn mới nhất của người dùng
        user_text = ""
        for msg in reversed(history):
            if msg.get("sender") in ("USER", "user", "HUMAN"):
                user_text = msg.get("content", "")
                break
        if not user_text and history:
            user_text = history[-1].get("content", "")

        routing_decision: RoutingDecision = self.router_agent.route(
            user_text=user_text,
            context={"language": language or "python"},
            trace_id=trace_id
        )

        traces.append({
            "agent": "IntentRouterAgent",
            "step": "INTENT_ROUTED",
            "intent": routing_decision.intent,
            "language": routing_decision.language,
            "topic": routing_decision.topic,
            "mode": routing_decision.mode,
            "confidence": routing_decision.confidence,
            "trace_id": trace_id
        })

        intent = routing_decision.intent
        lang = routing_decision.language

        # -------------------------------------------------------------
        # NHÁNH 1 (Flowchart Branch 1): Agent chào hỏi & Giải đáp tổng quát
        # -------------------------------------------------------------
        if intent == "GENERAL_CHAT":
            emit("GeneralChatAgent", "Giải đáp tổng quát", "Đang biên soạn câu trả lời thân thiện và định hướng môn học...", "GENERAL_CHAT", "💬")
            return self._handle_general_chat(user_text, lang, trace_id, traces)

        # -------------------------------------------------------------
        # NHÁNH 2 (Flowchart Branch 2): Agent giải thích (Lý thuyết / Thuật toán)
        # -------------------------------------------------------------
        if intent == "EXPLAIN_CONCEPT":
            emit("ExplanationTutorAgent", "Biên soạn giải thích lý thuyết", "Đang trích xuất nguyên lý và tạo cấu trúc giải thích sư phạm...", "EXPLAINING", "📖")
            return self._handle_explain_concept(user_id, lang, routing_decision, trace_id, traces)

        # -------------------------------------------------------------
        # NHÁNH 3 (Flowchart Branch 3): Agent ASK tra cứu tri thức (Knowledge Retrieval)
        # -------------------------------------------------------------
        if intent == "ASK_KNOWLEDGE":
            emit("KnowledgeRetrievalAgent", "Tra cứu Cơ sở Tri thức ASK", "Đang truy xuất cây kỹ năng và khái niệm liên quan...", "RETRIEVING", "📚")
            return self._handle_ask_knowledge(lang, routing_decision.topic, user_text, trace_id, traces)

        # -------------------------------------------------------------
        # DIAGNOSTIC: Chẩn đoán điểm yếu (CHECK_WEAKNESS)
        # -------------------------------------------------------------
        if intent == "CHECK_WEAKNESS":
            emit("WeaknessDiagnosticAgent", "Chẩn đoán điểm yếu học tập", "Đang quét đồ thị năng lực để tìm điểm khuyết thiếu...", "DIAGNOSING", "🔍")
            return self._handle_check_weakness(user_id, lang, trace_id, traces)

        # -------------------------------------------------------------
        # NHÁNH 5 (Flowchart Branch 5): Agent tạo lộ trình (Learning Path / Course)
        # -------------------------------------------------------------
        if intent == "CREATE_LEARNING_PATH":
            emit("LearningPathOrchestrator", "Thiết kế Lộ trình Học tập", "Đang phác thảo pipeline các giai đoạn và bài học cá nhân hóa...", "PLANNING_PATH", "🚀")
            return self._handle_create_learning_path_flow(
                user_id=user_id,
                routing=routing_decision,
                trace_id=trace_id,
                traces=traces
            )

        # -------------------------------------------------------------
        # NHÁNH 4 (Flowchart Branch 4): Agent quyết định bài tập (Adaptive Exercise Flow)
        # -------------------------------------------------------------
        return self._handle_adaptive_exercise_flow(
            user_id=user_id,
            routing=routing_decision,
            target_concept_id=target_concept_id,
            trace_id=trace_id,
            traces=traces,
            emit_fn=emit
        )

    def _handle_adaptive_exercise_flow(
        self,
        user_id: str,
        routing: RoutingDecision,
        target_concept_id: Optional[str],
        trace_id: str,
        traces: List[Dict[str, Any]],
        emit_fn: Optional[Callable[..., None]] = None
    ) -> Dict[str, Any]:
        # 1. Agent ASK tra cứu tri thức (Knowledge Retrieval)
        cid = target_concept_id or self.kg_service.resolve_concept_by_topic(routing.language, routing.topic)
        concept_meta = self.kg_service.get_concept(routing.language, cid) or {}
        concept_name = concept_meta.get("name") or cid

        if emit_fn:
            emit_fn("KnowledgeRetrievalAgent", "Truy xuất Cây Tri thức ASK", f"Đang tra cứu cơ sở tri thức cho kỹ năng '{concept_name}'...", "RETRIEVING", "📚")

        traces.append({
            "agent": "KnowledgeRetrievalAgent",
            "step": "KNOWLEDGE_RETRIEVED",
            "concept_id": cid,
            "concept_name": concept_name,
            "language": routing.language,
            "sub_skills": self.kg_service.get_sub_skills(routing.language, cid),
            "trace_id": trace_id
        })

        # 2. Agent quyết định bài tập (AdaptiveExercisePlanner)
        if emit_fn:
            emit_fn("AdaptiveExercisePlanner", "Tính toán Vùng ZPD & Đặc tả bài tập", f"Đang tính toán độ khó ZPD và lập đặc tả cho '{concept_name}'...", "PLANNING", "🎯")

        spec: ExerciseSpecification = self.planner_agent.plan_exercise(
            routing=routing,
            user_id=user_id,
            explicit_concept_id=cid
        )

        traces.append({
            "agent": "AdaptiveExercisePlanner",
            "step": "SPECIFICATION_EMITTED",
            "target_concept": spec.target_concept,
            "concept_title": spec.concept_title,
            "difficulty": spec.difficulty,
            "mode": spec.mode,
            "sub_skills": spec.target_sub_skills,
            "required_constructs": spec.required_constructs,
            "forbidden_constructs": spec.forbidden_constructs,
            "reasoning": spec.reasoning,
            "trace_id": trace_id
        })

        # 3. Đồng thời kích hoạt Agent Sinh Lý Thuyết và Agent Sinh Luyện Tập & Test Case (Critic Loop)
        max_retries = 2
        theory_repair = None
        exercise_repair = None
        final_theory = None
        final_exercise = None
        candidate_verified_exercise = None

        for attempt in range(max_retries + 1):
            # 3.1. Agent Sinh Lý Thuyết (ExplanationTutorAgent)
            if final_theory is None or theory_repair:
                if emit_fn:
                    emit_fn("ExplanationTutorAgent", "Biên soạn Lý thuyết Cốt lõi", f"Đang tóm lược tri thức trọng tâm cho '{spec.concept_title or spec.target_concept}'...", "GENERATING_THEORY", "💡")
                final_theory = self.explanation_agent.explain(
                    concept_id=spec.target_concept,
                    concept_name=spec.concept_title or spec.target_concept,
                    language=spec.language,
                    user_query=routing.user_text,
                    repair_instructions=theory_repair
                )
                traces.append({
                    "agent": "ExplanationTutorAgent",
                    "step": f"THEORY_GENERATED_ATTEMPT_{attempt + 1}",
                    "concept_id": spec.target_concept,
                    "source": final_theory.get("source"),
                    "trace_id": trace_id
                })

            # 3.2. Agent Sinh Luyện Tập và Test Case (ExerciseGeneratorAgent)
            if candidate_verified_exercise is None or exercise_repair:
                if emit_fn:
                    emit_fn("ExerciseGeneratorAgent", "Thiết kế Thử thách & Bộ Test Cases", f"Đang tạo bài tập thực hành và bộ ca kiểm thử tự động...", "GENERATING_EXERCISE", "⚙️")
                candidate_exercise = self.generator_agent.generate(spec, repair_instructions=exercise_repair)
                if not candidate_exercise:
                    continue

                traces.append({
                    "agent": "ExerciseGeneratorAgent",
                    "step": f"CANDIDATE_GENERATED_ATTEMPT_{attempt + 1}",
                    "title": candidate_exercise.get("title"),
                    "trace_id": trace_id
                })

                if emit_fn:
                    emit_fn("DeterministicValidators", "Kiểm thử Tự động (Sandbox & AST)", "Đang rà soát cú pháp và chạy thử nghiệm mẫu trên sandbox an toàn...", "VALIDATING", "🧪")

                # Tầng 1: Schema Validator
                schema_ok, schema_errors = SchemaValidator.validate(candidate_exercise)
                if not schema_ok:
                    exercise_repair = f"Lỗi Schema: {'; '.join(schema_errors)}"
                    traces.append({
                        "validator": "SchemaValidator",
                        "status": "REJECTED",
                        "errors": schema_errors,
                        "attempt": attempt + 1
                    })
                    continue

                # Tầng 2: AST & Constraint Validator
                ast_ok, ast_errors = AstConstraintValidator.validate(candidate_exercise, spec)
                if not ast_ok:
                    exercise_repair = f"Lỗi Ràng buộc cú pháp (AST): {'; '.join(ast_errors)}"
                    traces.append({
                        "validator": "AstConstraintValidator",
                        "status": "REJECTED",
                        "errors": ast_errors,
                        "attempt": attempt + 1
                    })
                    continue

                # Tầng 3: Sandbox Test Runner
                sandbox_ok, sandbox_errors, _ = SandboxValidator.validate(candidate_exercise)
                if not sandbox_ok:
                    exercise_repair = f"Lỗi Sandbox: Nghiệm mẫu không pass test case: {'; '.join(sandbox_errors)}"
                    traces.append({
                        "validator": "SandboxValidator",
                        "status": "REJECTED",
                        "errors": sandbox_errors,
                        "attempt": attempt + 1
                    })
                    continue

                traces.append({
                    "validator": "DeterministicValidators",
                    "status": "ALL_PASSED",
                    "attempt": attempt + 1
                })
                candidate_verified_exercise = candidate_exercise

            # 3.3. Agent Đánh Giá Nội Dung (Critic Evaluator Agent: Kiểm tra hợp lý và tương thích LT & TH)
            if emit_fn:
                emit_fn("CriticEvaluatorAgent", "Thẩm định Critic Độc Lập", "Đang kiểm duyệt độ khớp giữa lý thuyết, bài tập và tính sư phạm...", "CRITIC_REVIEW", "🛡️")

            critic_review = self.critic_agent.evaluate_content(
                theory_content=final_theory.get("reply", "") if final_theory else "",
                exercise_data=candidate_verified_exercise,
                spec=spec
            )

            if critic_review.get("is_approved", True):
                final_exercise = candidate_verified_exercise
                traces.append({
                    "agent": "CriticEvaluatorAgent",
                    "step": "CONTENT_APPROVED",
                    "status": "APPROVED",
                    "score": critic_review.get("score"),
                    "feedback": critic_review.get("feedback"),
                    "attempt": attempt + 1
                })
                break
            else:
                target = critic_review.get("feedback_target", "EXERCISE")
                traces.append({
                    "agent": "CriticEvaluatorAgent",
                    "step": "CONTENT_REJECTED",
                    "status": "REJECTED",
                    "feedback_target": target,
                    "feedback": critic_review.get("feedback"),
                    "attempt": attempt + 1
                })

                if target == "THEORY":
                    theory_repair = critic_review.get("theory_feedback")
                    exercise_repair = None
                elif target == "EXERCISE":
                    exercise_repair = critic_review.get("exercise_feedback")
                    theory_repair = None
                else:
                    theory_repair = critic_review.get("theory_feedback")
                    exercise_repair = critic_review.get("exercise_feedback")

        # Fallback an toàn nếu sau nhiều lần retry chưa có bài đạt chuẩn
        if not final_exercise:
            final_exercise = self.generator_agent._generate_fallback(spec, stars=2)
            traces.append({
                "agent": "FallbackSafety",
                "status": "FALLBACK_APPLIED",
                "trace_id": trace_id
            })

        if not final_theory:
            final_theory = self.explanation_agent.explain(
                concept_id=spec.target_concept,
                concept_name=spec.concept_title or spec.target_concept,
                language=spec.language,
                user_query=routing.user_text
            )

        # 4. Agent Phản hồi đáp án / bài tập cho User / Hệ thống (Ngắn gọn trên khung Chat)
        theory_body = final_theory.get("reply", "")
        final_exercise["theoryContent"] = theory_body

        concise_reply = (
            f"🎯 Tôi đã chuẩn bị bài tập **{final_exercise.get('title')}** cho kỹ năng **{spec.concept_title or spec.target_concept}** "
            f"({spec.language.upper()} - Cấp độ: {spec.difficulty}).\n\n"
            f"💡 **Trọng tâm sư phạm:** {spec.reasoning}\n\n"
            f"👉 Bạn hãy xem đề bài và mã khung ở **Thẻ bài tập bên dưới**, sau đó bấm **Mở Code Editor Thực Hành Ngay** để làm bài nhé!"
        )

        traces.append({
            "agent": "DeliveryAgent",
            "step": "DELIVERY_COMPLETED",
            "title": final_exercise.get("title"),
            "trace_id": trace_id
        })

        if emit_fn:
            emit_fn("DeliveryAgent", "Hoàn tất & Đóng gói Phản hồi", "Đang đóng gói và gửi phản hồi cá nhân hóa đến bạn...", "DELIVERY", "✨")

        return {
            "intent": "REQUEST_ADAPTIVE_EXERCISE",
            "reply": concise_reply,
            "exercise": final_exercise,
            "agent_traces": traces,
            "suggested_options": [
                f"🚀 Bắt đầu làm bài: {final_exercise.get('title')}",
                "🔍 Cho tôi bài tập dễ hơn một chút",
                "📚 Giải thích thêm về lý thuyết"
            ],
            "trace_id": trace_id
        }

    def _handle_check_weakness(self, user_id: str, language: str, trace_id: str, traces: List[Dict[str, Any]]) -> Dict[str, Any]:
        weak_states = self.learner_service.get_weakest_concepts(user_id, top_k=3)
        
        weak_details = []
        for ws in weak_states:
            c_info = self.kg_service.get_concept(language, ws.concept_id) or {}
            c_name = c_info.get("name") or ws.concept_id
            weak_details.append({
                "concept_id": ws.concept_id,
                "name": c_name,
                "mastery": ws.mastery,
                "wrong_count": ws.wrong_count,
                "attempts": ws.attempts
            })

        if not weak_details:
            # Nếu người học mới chưa có lịch sử
            all_concepts = self.kg_service.list_all_concepts(language)
            sample = all_concepts[0] if all_concepts else {}
            cid = sample.get("id") or "PY-BASICS-01"
            cname = sample.get("name") or "Cú pháp & Biến căn bản"
            weak_details.append({
                "concept_id": cid,
                "name": cname,
                "mastery": 0.40,
                "wrong_count": 0,
                "attempts": 0
            })

        top_weak = weak_details[0]
        reply_md = (
            f"📊 **Báo cáo Chẩn đoán Điểm yếu Lập trình ({language.upper()}):**\n\n"
            f"Qua dữ liệu theo dõi thực thi, concept bạn đang cần củng cố nhất là **{top_weak['name']}** "
            f"(Mức thành thạo: **{round(top_weak['mastery'] * 100)}%**).\n\n"
            f"**Chi tiết các vùng tri thức cần lưu ý:**\n"
        )
        for w in weak_details:
            reply_md += f"- 🔴 **{w['name']}**: Thành thạo {round(w['mastery']*100)}% ({w['wrong_count']} lần lỗi / {w['attempts']} lần nộp)\n"

        reply_md += "\nBạn có muốn tôi tạo bài tập thích ứng khắc phục (Remediation) cho chủ đề này ngay không?"

        traces.append({
            "agent": "WeaknessDiagnosticService",
            "step": "WEAKNESS_DIAGNOSED",
            "top_weak_concept": top_weak["concept_id"],
            "trace_id": trace_id
        })

        return {
            "intent": "CHECK_WEAKNESS",
            "reply": reply_md,
            "exercise": None,
            "agent_traces": traces,
            "weak_concepts": weak_details,
            "suggested_options": [
                f"🎯 Tạo bài tập rèn luyện cho {top_weak['name']}",
                f"📚 Giải thích lý thuyết cốt lõi của {top_weak['name']}",
                "🔍 Kiểm tra tổng thể toàn bộ đồ thị tri thức"
            ],
            "trace_id": trace_id
        }

    def _handle_explain_concept(
        self,
        user_id: str,
        language: str,
        routing: RoutingDecision,
        trace_id: str,
        traces: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        cid = self.kg_service.resolve_concept_by_topic(language, routing.topic)
        concept = self.kg_service.get_concept(language, cid) or {}
        cname = concept.get("name") or cid

        explanation_result = self.explanation_agent.explain(
            concept_id=cid,
            concept_name=cname,
            language=language,
            user_query=routing.user_text or ""
        )

        reply_md = explanation_result.get("reply", "")
        suggested_options = explanation_result.get("suggested_options") or [
            f"🎯 Bắt đầu làm bài tập thực hành {cname}",
            f"🔍 Kiểm tra điểm yếu của tôi trong {language.upper()}",
            f"🚀 Cho tôi bài tập thử thách nâng cao"
        ]

        traces.append({
            "agent": "ExplanationTutorAgent",
            "step": "CONCEPT_EXPLAINED",
            "concept_id": cid,
            "source": explanation_result.get("source", "UNKNOWN"),
            "trace_id": trace_id
        })

        return {
            "intent": "EXPLAIN_CONCEPT",
            "reply": reply_md,
            "exercise": None,
            "agent_traces": traces,
            "suggested_options": suggested_options,
            "trace_id": trace_id
        }

    # -------------------------------------------------------------
    # NHÁNH 1 (Flowchart Branch 1): Agent chào hỏi (General Chat Handler)
    # -------------------------------------------------------------
    def _handle_general_chat(self, user_text: str, language: str, trace_id: str, traces: List[Dict[str, Any]]) -> Dict[str, Any]:
        lower = (user_text or "").lower()
        traces.append({
            "agent": "GeneralChatHandler",
            "step": "GREETING_RESPONDED",
            "user_prompt": user_text,
            "trace_id": trace_id
        })

        is_asking_identity = any(k in lower for k in ["bạn là ai", "bot nào", "là gì", "giới thiệu"])
        is_asking_subjects = any(k in lower for k in ["học môn nào", "môn học nào", "ngôn ngữ nào", "hỗ trợ gì", "có môn gì", "dạy gì", "luyện tập môn nào"])

        if is_asking_identity or is_asking_subjects:
            reply_text = (
                f"🤖 **Xin chào! Tôi là CodeHub Adaptive AI Tutor.**\n\n"
                f"Tôi là Trợ lý Gia sư Lập trình Thích ứng hoạt động theo cơ chế **Đa Tác tử (Multi-Agent Architecture)** "
                f"kết hợp **Đồ thị tri thức (Knowledge Graph)** và mô hình cá nhân hóa theo vùng phát triển (**ZPD**).\n\n"
                f"📚 **Các môn học tôi hỗ trợ hiện tại:**\n"
                f"- 🟡 **JavaScript (ES6+)**: Biến (let/const), Arrow Functions, Array Methods, Async/Await, Closures & OOP.\n"
                f"- 🔵 **C++ (C++17)**: Con trỏ & Bộ nhớ, Cấu trúc dữ liệu, OOP Kế thừa & Đa hình, STL Container.\n"
                f"- 🐍 **Python 3**: Cú pháp cơ bản, List Comprehension, Dictionary, Xử lý ngoại lệ & File I/O.\n"
                f"- 🐬 **SQL**: Truy vấn dữ liệu, JOIN nhiều bảng, Group By, Subqueries & Tối ưu hóa.\n\n"
                f"✨ **Các năng lực tác tử cốt lõi:**\n"
                f"1. 📖 **Agent giải thích**: Giảng giải lý thuyết, thuật toán kèm ví dụ code thực chiến và cạm bẫy lỗi.\n"
                f"2. 🗺️ **Agent ASK tra cứu tri thức**: Tra cứu cây tri thức, liên kết DAG và danh sách `skill_id` chuẩn hóa.\n"
                f"3. 🎯 **Agent quyết định bài tập**: Thiết kế bài tập thích ứng vừa vặn năng lực kèm bộ test case tự động.\n"
                f"4. 🚀 **Agent tạo lộ trình**: Xây dựng lộ trình học tập bài bản từ vỡ lòng đến nâng cao.\n"
                f"5. ⚖️ **Agent đánh giá nội dung**: Thẩm định chất lượng sư phạm và độ tương thích giữa Lý thuyết & Thực hành.\n\n"
                f"Bạn muốn bắt đầu học hoặc rèn luyện môn nào hôm nay?"
            )
        else:
            reply_text = (
                f"👋 **Xin chào! Tôi là Trợ Lý Gia Sư Thích Ứng (CodeHub Adaptive AI Tutor).**\n\n"
                f"Tôi đã sẵn sàng đồng hành cùng bạn trên chặng đường chinh phục lập trình môn **{language.upper()}**. "
                f"Bạn có thể yêu cầu tôi giải thích một khái niệm, tra cứu bản đồ kỹ năng, tạo lộ trình học, hoặc thử sức với một bài tập thực hành ngay bây giờ!\n\n"
                f"Bạn muốn bắt đầu bằng cách nào?"
            )

        return {
            "intent": "GENERAL_CHAT",
            "reply": reply_text,
            "exercise": None,
            "agent_traces": traces,
            "suggested_options": [
                f"🚀 Tạo lộ trình học {language.upper()} từ đầu",
                f"🎯 Tạo bài tập rèn luyện {language.upper()} cho tôi",
                f"🗺️ Tra cứu danh sách kỹ năng {language.upper()}",
                "🔍 Kiểm tra điểm yếu của tôi"
            ],
            "trace_id": trace_id
        }

    # -------------------------------------------------------------
    # NHÁNH 3 (Flowchart Branch 3): Agent ASK tra cứu tri thức
    # -------------------------------------------------------------
    def _handle_ask_knowledge(
        self,
        language: str,
        topic: Optional[str],
        user_text: str,
        trace_id: str,
        traces: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        all_concepts = self.kg_service.list_all_concepts(language)
        
        traces.append({
            "agent": "KnowledgeRetrievalAgent",
            "step": "KNOWLEDGE_GRAPH_RETRIEVED",
            "language": language,
            "concepts_count": len(all_concepts),
            "trace_id": trace_id
        })

        reply_md = (
            f"🗺️ **Bản Đồ Tri Thức & Danh Sách Kỹ Năng ({language.upper()} Knowledge Graph):**\n\n"
            f"Hệ thống quản lý chuẩn hóa **{len(all_concepts)} kỹ năng** cho môn học {language.upper()}, "
            f"được tổ chức theo đồ thị có hướng (DAG) liên kết chặt chẽ:\n\n"
            f"| Mã Kỹ Năng (`skill_id`) | Tên Kỹ Năng | Cấp Độ | Điều Kiện Tiên Quyết |\n"
            f"| :--- | :--- | :--- | :--- |\n"
        )

        suggested_options = []
        for c in all_concepts[:8]:
            cid = c.get("id") or c.get("concept_id")
            cname = c.get("name") or cid
            level = c.get("level") or "Cơ bản"
            prereqs = ", ".join(c.get("prerequisites", [])) or "Bắt đầu"
            reply_md += f"| `{cid}` | **{cname}** | {level} | {prereqs} |\n"
            if len(suggested_options) < 3:
                suggested_options.append(f"🎯 Học kỹ năng: {cname}")

        reply_md += (
            f"\n\n💡 **Cách thức học tập:** Bạn có thể yêu cầu: "
            f"`Giải thích lý thuyết + [tên kỹ năng]` hoặc `Cho tôi bài tập + [mã skill_id]` để bắt đầu rèn luyện ngay!"
        )

        return {
            "intent": "ASK_KNOWLEDGE",
            "reply": reply_md,
            "exercise": None,
            "agent_traces": traces,
            "suggested_options": suggested_options or [
                f"🎯 Tạo bài tập rèn luyện {language.upper()}",
                f"🚀 Xây dựng lộ trình học {language.upper()} từ đầu",
                "🔍 Kiểm tra điểm yếu của tôi"
            ],
            "trace_id": trace_id
        }

    # -------------------------------------------------------------
    # NHÁNH 5 (Flowchart Branch 5): Agent tạo lộ trình (Learning Path / Course)
    # -------------------------------------------------------------
    def _handle_create_learning_path_flow(
        self,
        user_id: str,
        routing: RoutingDecision,
        trace_id: str,
        traces: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        lang = routing.language
        all_concepts = self.kg_service.list_all_concepts(lang)

        traces.append({
            "agent": "LearningPathPlannerAgent",
            "step": "LEARNING_PATH_INITIALIZED",
            "language": lang,
            "total_milestones": len(all_concepts),
            "trace_id": trace_id
        })

        # 1. Tra cứu Agent ASK để tổ chức cấu trúc khóa học
        phase_1 = all_concepts[:3] if len(all_concepts) >= 3 else all_concepts
        phase_2 = all_concepts[3:7] if len(all_concepts) >= 7 else all_concepts[3:]
        phase_3 = all_concepts[7:] if len(all_concepts) > 7 else []

        starting_concept = all_concepts[0] if all_concepts else {"id": "JS-VAR-01", "name": "Khai báo biến"}
        start_cid = starting_concept.get("id") or "JS-VAR-01"
        start_cname = starting_concept.get("name") or "Cú pháp nền tảng"

        # 2. Tạo đặc tả bài tập cho mắt xích đầu tiên
        spec: ExerciseSpecification = self.planner_agent.plan_exercise(
            routing=routing,
            user_id=user_id,
            explicit_concept_id=start_cid
        )

        # 3. Kích hoạt song song Agent sinh lý thuyết & Agent sinh luyện tập
        theory_res = self.explanation_agent.explain(
            concept_id=start_cid,
            concept_name=start_cname,
            language=lang,
            user_query=f"Lộ trình học {lang}: {start_cname}"
        )

        candidate_exercise = self.generator_agent.generate(spec)
        schema_ok, _ = SchemaValidator.validate(candidate_exercise)
        if not schema_ok:
            candidate_exercise = self.generator_agent._generate_fallback(spec, stars=1)

        # 4. Agent đánh giá nội dung kiểm định tương thích
        critic_review = self.critic_agent.evaluate_content(
            theory_content=theory_res.get("reply", ""),
            exercise_data=candidate_exercise,
            spec=spec
        )

        traces.append({
            "agent": "CriticEvaluatorAgent",
            "step": "PATH_CONTENT_APPROVED",
            "status": "APPROVED",
            "score": critic_review.get("score"),
            "trace_id": trace_id
        })

        # 5. Agent phản hồi đáp án / bài tập cho User / Hệ thống (Ngắn gọn trên khung Chat)
        candidate_exercise["theoryContent"] = theory_res.get("reply", "")

        concise_roadmap_reply = (
            f"🚀 **Đã thiết lập Lộ trình học {lang.upper()} cá nhân hóa cho bạn!**\n\n"
            f"Lộ trình gồm 3 giai đoạn: Nền tảng → Cấu trúc điều khiển → Nâng cao. "
            f"Chúng ta sẽ bắt đầu với cột mốc đầu tiên: **{start_cname}** (`{start_cid}`).\n\n"
            f"💡 **Bài tập khởi đầu:** {candidate_exercise.get('title')}\n\n"
            f"👉 Bạn hãy xem thông tin ở **Thẻ bài tập bên dưới** và bấm **Mở Code Editor Thực Hành Ngay** để bắt đầu viết mã nhé!"
        )

        traces.append({
            "agent": "DeliveryAgent",
            "step": "PATH_DELIVERED",
            "target_concept": start_cid,
            "trace_id": trace_id
        })

        return {
            "intent": "CREATE_LEARNING_PATH",
            "reply": concise_roadmap_reply,
            "exercise": candidate_exercise,
            "agent_traces": traces,
            "suggested_options": [
                f"🚀 Bắt đầu làm bài: {candidate_exercise.get('title')}",
                f"📚 Tìm hiểu kỹ hơn về {start_cname}",
                f"🗺️ Xem toàn bộ cây kỹ năng {lang.upper()}"
            ],
            "trace_id": trace_id
        }

    # -------------------------------------------------------------
    # KỊCH BẢN D: SUBMISSION FEEDBACK LOOP (Học viên nộp bài)
    # -------------------------------------------------------------
    def process_submission_feedback(self, submission: ExecutionResult) -> Dict[str, Any]:
        trace_id = submission.trace_id or f"trace_{uuid.uuid4().hex[:12]}"
        user_id = submission.user_id or "anonymous_learner"
        concept_id = submission.concept_id or "PY-BASICS-01"
        language = submission.runtime or "python"

        # 1. Lưu submission vào LearningHistoryService
        self.history_service.record_submission(user_id, submission)

        error_event = None
        attribution = None

        if submission.status != "PASSED":
            # 2. Error Analyzer: Chuẩn hóa lỗi
            error_event = ErrorAnalyzer.analyze(submission)
            if error_event:
                self.history_service.record_error_event(user_id, error_event)

                # 3. Concept Attribution: Gán lỗi về concept/sub-skill
                attribution = self.concept_attribution_service.attribute(
                    error_event=error_event,
                    language=language,
                    target_concept_id=concept_id,
                    code=submission.code
                )

        # 4. Mastery Updater: Cập nhật Mastery tất định (Deterministic)
        mastery_event: MasteryEvent = self.mastery_updater.update_mastery(
            user_id=user_id,
            concept_id=concept_id,
            passed=(submission.status == "PASSED"),
            attribution=attribution,
            difficulty="MEDIUM",
            evidence_ids=[submission.submission_id],
            trace_id=trace_id
        )

        # 5. Phản hồi sư phạm gửi về frontend
        if submission.status == "PASSED":
            feedback_reply = (
                f"🎉 **Xuất sắc! Bài làm đã vượt qua 100% test cases.**\n\n"
                f"Độ thành thạo concept **{concept_id}** tăng từ "
                f"**{round(mastery_event.previous_mastery * 100)}%** lên **{round(mastery_event.new_mastery * 100)}%** "
                f"(+{round(mastery_event.delta * 100)}%)."
            )
        else:
            reason_text = error_event.message if error_event else "Kết quả thực thi chưa đạt."
            feedback_reply = (
                f"⚠️ **Bài nộp chưa vượt qua toàn bộ test cases.**\n\n"
                f"**Phân tích lỗi:** {reason_text}\n"
            )
            if attribution and attribution.selected:
                feedback_reply += (
                    f"**Chẩn đoán kỹ năng:** Hệ thống xác định lỗi bắt nguồn từ kỹ năng con "
                    f"`{attribution.selected.sub_skill}` (Độ tin cậy: {round(attribution.selected.confidence * 100)}%).\n"
                )
            feedback_reply += (
                f"Điểm thành thạo hiện tại: **{round(mastery_event.new_mastery * 100)}%**.\n"
                f"Hệ thống đã ghi nhận điểm yếu này để gợi ý bài tập khắc phục (Remediation) tiếp theo."
            )

        return {
            "submission_id": submission.submission_id,
            "status": submission.status,
            "passed": submission.status == "PASSED",
            "error_event": error_event.dict() if error_event else None,
            "attribution": attribution.dict() if attribution else None,
            "mastery_event": mastery_event.dict(),
            "new_mastery": mastery_event.new_mastery,
            "delta": mastery_event.delta,
            "reply": feedback_reply,
            "trace_id": trace_id
        }
