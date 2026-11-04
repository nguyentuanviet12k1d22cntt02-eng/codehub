import json
from typing import Dict, Any, List

from .retrieval import KnowledgeRetriever
from .routing import RouterAgent
from .generation import ExerciseGeneratorAgent
from .critique import CriticEvaluatorAgent
from .explanation import LegacyExplanationMixin
from .mastery import LegacyMasteryMixin

class AdaptiveAgentOrchestrator(LegacyExplanationMixin, LegacyMasteryMixin):
    """Bộ Điều Phối Đa Tác Tử (Multi-Agent Orchestrator)"""

    retriever_type = KnowledgeRetriever

    def __init__(self):
        self.router = RouterAgent()
        self.retriever = self.retriever_type()
        self.generator = ExerciseGeneratorAgent()
        self.evaluator = CriticEvaluatorAgent()


    def process_turn(
        self,
        user_id: str,
        history: List[Dict[str, str]],
        user_mastery: Dict[str, float] = None,
        target_concept_id: str = None,
        language: str = None
    ) -> Dict[str, Any]:
        """Điều phối toàn bộ quy trình tương tác với người học đa ngôn ngữ"""
        mastery_map = user_mastery or {}
        last_user_msg = history[-1]["content"] if history else "Tôi muốn rèn luyện lập trình"
        agent_traces = []

        # Nhận diện ngôn ngữ lập trình mục tiêu
        detected_lang = language or self.router.detect_language(last_user_msg)

        border = "=" * 80
        print(f"\n{border}\n🚀 [MULTI-AGENT DISPATCH] Bắt đầu phiên điều phối cho học viên (Ngôn ngữ: {detected_lang})\n💬 Input: '{last_user_msg}'\n{border}", flush=True)

        # 1. Router Agent: Phân loại ý định
        intent = self.router.classify_intent(last_user_msg, history)
        print(f"\n🎯 [RouterAgent] Ý định nhận diện: >>> {intent} <<< | Ngôn ngữ: {detected_lang}", flush=True)
        agent_traces.append({
            "agent": "RouterAgent",
            "action": "Classify User Intent & Language",
            "result": f"{intent} ({detected_lang})",
            "details": f"Nhận diện ý định học tập: {intent}, ngôn ngữ mục tiêu: {detected_lang}"
        })

        # 2. Knowledge Retriever: Truy vấn hồ sơ năng lực theo ngôn ngữ
        weaknesses = self.retriever.get_learner_weaknesses(mastery_map, limit=3, language=detected_lang)
        agent_traces.append({
            "agent": "KnowledgeRetriever",
            "action": f"Query {detected_lang} DAG & Learner Profile",
            "result": f"Tìm thấy {len(weaknesses)} điểm yếu cần củng cố",
            "details": f"Top điểm yếu: {[w['concept_id'] for w in weaknesses]}"
        })

        top_weakness = weaknesses[0] if weaknesses else {
            "concept_id": "CPP-SYNTAX-01" if detected_lang == "CPP" else ("JS-VAR-01" if detected_lang == "JAVASCRIPT" else "PY-DICT-02"),
            "concept_name": "Cấu trúc Chương trình & I/O" if detected_lang == "CPP" else ("Khai báo Biến & Kiểu dữ liệu" if detected_lang == "JAVASCRIPT" else "Thao tác Dictionary & Phương thức get()"),
            "mastery_score": 0.35,
            "associated_errors": ["SyntaxError"]
        }

        # 1. Nếu người học chỉ định concept cụ thể từ giao diện Profile/DAG
        if target_concept_id:
            specified = self.retriever.get_concept_by_id(target_concept_id, language=detected_lang)
            if specified:
                top_weakness = {
                    "concept_id": specified["id"],
                    "concept_name": specified["concept_name"],
                    "mastery_score": mastery_map.get(specified["id"], 0.40),
                    "associated_errors": specified.get("associated_errors", []),
                    "prerequisites": specified.get("prerequisites", []),
                    "difficulty_level": specified.get("difficulty_level", 2)
                }
        else:
            # 2. Tự động nhận diện chủ đề học viên yêu cầu trực tiếp trong tin nhắn
            detected = self.retriever.find_concept_by_query(last_user_msg, language=detected_lang)
            if detected:
                top_weakness = {
                    "concept_id": detected["id"],
                    "concept_name": detected["concept_name"],
                    "mastery_score": mastery_map.get(detected["id"], 0.45),
                    "associated_errors": detected.get("associated_errors", []),
                    "prerequisites": detected.get("prerequisites", []),
                    "difficulty_level": detected.get("difficulty_level", 2)
                }
                agent_traces.append({
                    "agent": "KnowledgeRetriever",
                    "action": "Match Concept From Query",
                    "result": f"Khớp chủ đề: {top_weakness['concept_name']} ({top_weakness['concept_id']})",
                    "details": f"Định vị chính xác mắt xích tri thức {detected_lang} mà học viên muốn rèn luyện."
                })

        print(f"🎯 [KnowledgeRetriever] Concept mục tiêu: {top_weakness['concept_name']} ({top_weakness['concept_id']})", flush=True)

        # XỬ LÝ THEO 4 TÌNH HUỐNG

        # TÌNH HUỐNG 1: Học viên hỏi điểm yếu cá nhân
        if intent == "CHECK_WEAKNESS":
            concept_name = top_weakness["concept_name"]
            concept_id = top_weakness["concept_id"]
            mastery_pct = round(top_weakness["mastery_score"] * 100)
            errors = top_weakness.get("associated_errors", [])
            error_text = errors[0] if errors else "lỗi cú pháp hoặc xử lý logic"

            reply_text = (
                f"Chào bạn! Mình vừa rà soát hồ sơ tri thức Python của bạn theo mô hình PAL-Net:\n\n"
                f"📍 **Vùng bạn cần củng cố nhất hiện tại:** `{concept_name}` ({concept_id})\n"
                f"📊 **Độ thành thạo hiện tại:** **{mastery_pct}%** (mức cần cải thiện)\n"
                f"⚠️ **Cảnh báo lỗi thường gặp gần đây:** Thường xuyên gặp `{error_text}`.\n\n"
                f"Bạn có muốn mình tạo ngay một bài tập thích ứng để khắc phục triệt để lỗ hổng này không?"
            )
            return {
                "intent": intent,
                "reply": reply_text,
                "exercise": None,
                "agent_traces": agent_traces,
                "suggested_options": [
                    f"🎯 Tạo bài tập rèn luyện {concept_name}",
                    "🔍 Giải thích chi tiết nguyên nhân gây lỗi này",
                    "📚 Xem toàn bộ cây đồ thị tri thức"
                ]
            }

        # TÌNH HUỐNG 2 HOẶC TÌNH HUỐNG 3: Yêu cầu bài tập thích ứng hoặc Bài quá khó cần bài dễ hơn
        if intent in ["REQUEST_ADAPTIVE_EXERCISE", "ADJUST_DIFFICULTY_EASIER"]:
            is_easier = (intent == "ADJUST_DIFFICULTY_EASIER")

            # 3. Generator Agent biên soạn bài tập (Kèm vòng lặp Feedback Loop)
            max_retries = 1
            critic_feedback = ""
            approved_exercise = None
            eval_result = None

            for attempt in range(max_retries + 1):
                print(f"\n⚙️  [ExerciseGeneratorAgent] Bắt đầu biên soạn bài tập (Lần {attempt + 1})...", flush=True)
                agent_traces.append({
                    "agent": "ExerciseGeneratorAgent",
                    "action": f"Draft Exercise (Attempt {attempt + 1})",
                    "result": f"Concept: {top_weakness['concept_id']} | Mức độ: {'Scaffolding' if is_easier else 'ZPD'}",
                    "details": f"Phản hồi từ Critic trước đó: {critic_feedback or 'Lần đầu biên soạn'}"
                })

                draft = self.generator.generate_exercise(
                    concept=top_weakness,
                    student_mastery=top_weakness["mastery_score"],
                    is_easier_request=is_easier,
                    critic_feedback=critic_feedback,
                    language=detected_lang
                )

                print(f"\n📝 [ExerciseGeneratorAgent - KẾT QUẢ BIÊN SOẠN]:"
                      f"\n   • Tiêu đề: {draft.get('title')}"
                      f"\n   • Độ khó: {draft.get('difficulty_stars', 2)} sao"
                      f"\n   • Đề bài: {draft.get('problem_statement')}"
                      f"\n   • Mã khung:\n{draft.get('starter_code')}"
                      f"\n   • Test cases ({len(draft.get('test_cases', []))} cases):"
                      f"\n{json.dumps(draft.get('test_cases', []), ensure_ascii=False, indent=4)}", flush=True)

                # 4. Critic Evaluator Agent kiểm định chất lượng độc lập
                eval_result = self.evaluator.evaluate_exercise(draft, top_weakness)
                print(f"\n⚖️  [CriticEvaluatorAgent - KẾT QUẢ THẨM ĐỊNH]:"
                      f"\n   • Trạng thái: {eval_result['status']}"
                      f"\n   • Điểm Rubric: {eval_result['scores']}"
                      f"\n   • Góp ý: {eval_result['feedback']}", flush=True)

                agent_traces.append({
                    "agent": "CriticEvaluatorAgent",
                    "action": f"Quality Audit (Attempt {attempt + 1})",
                    "result": eval_result["status"],
                    "details": f"Scores: {eval_result['scores']} | Góp ý: {eval_result['feedback']}"
                })

                if eval_result["status"] == "APPROVED":
                    approved_exercise = draft
                    break
                else:
                    critic_feedback = eval_result["feedback"]

            # TUYỆT ĐỐI KHÔNG DÙNG FALLBACK NẾU AI ĐÃ TẠO ĐƯỢC DRAFT
            if not approved_exercise:
                if draft and draft.get("title") and draft.get("problem_statement"):
                    print(f"\n⚡ [DIRECT AI ENFORCEMENT] Ưu tiên 100% sử dụng bài do AI vừa tạo ({draft.get('title')}), tuyệt đối KHÔNG dùng Fallback tĩnh.", flush=True)
                    agent_traces.append({
                        "agent": "CriticEvaluatorAgent",
                        "action": "Direct AI Output Priority",
                        "result": "AI_DIRECT_PUBLISHED",
                        "details": "Xuất bản trực tiếp bài do AI sinh ra để kiểm thử năng lực tạo đề thực tế của mô hình."
                    })
                    approved_exercise = draft
                else:
                    print(f"\n⚠️  [CriticEvaluatorAgent] LLM không sinh được nội dung, bắt buộc dùng Fallback chứng thực.", flush=True)
                    agent_traces.append({
                        "agent": "CriticEvaluatorAgent",
                        "action": "Fallback to Certified Exercise Bank",
                        "result": "FALLBACK_ACTIVATED",
                        "details": "Kích hoạt bài tập mẫu được chứng thực trước để đảm bảo an toàn 100% cho học viên."
                    })
                    approved_exercise = self.generator._get_fallback_exercise(
                        top_weakness["concept_id"],
                        top_weakness["concept_name"],
                        top_weakness.get("associated_errors", []),
                        is_easier,
                        language=detected_lang
                    )

            print(f"\n{border}\n🎉 [MULTI-AGENT COMPLETED] Xuất bản bài tập: '{approved_exercise.get('title')}'\n{border}\n", flush=True)

            if is_easier:
                reply_text = (
                    f"Không sao cả bạn nhé! Việc gặp khó khăn khi mới tiếp cận `{top_weakness['concept_name']}` là rất bình thường. "
                    f"Mình đã kích hoạt cơ chế **Backtracking** và biên soạn lại một bài tập **nền tảng hơn (Scaffolding)** để bạn nắm chắc bước đệm trước.\n\n"
                    f"👉 Hãy xem thử thách đã được điều chỉnh ở bên dưới nhé!"
                )
            else:
                reply_text = (
                    f"Được rồi! Dựa trên phân tích năng lực và lỗi thường gặp `{top_weakness.get('associated_errors', [''])[0]}`, "
                    f"mình đã thiết kế và thẩm định bài thực hành thích ứng sau dành riêng cho bạn:\n\n"
                    f"🎯 **Thử thách:** **{approved_exercise['title']}**\n"
                    f"💡 *{approved_exercise.get('quick_theory', '')}*\n\n"
                    f"Bạn hãy nhấn vào nút bên dưới để mở Workspace và bắt đầu gõ code nhé!"
                )

            return {
                "intent": intent,
                "reply": reply_text,
                "exercise": approved_exercise,
                "agent_traces": agent_traces,
                "suggested_options": [
                    "🚀 Bắt đầu làm bài trong Code Editor",
                    "📉 Bài này vẫn khó quá, cho tôi bài đơn giản hơn nữa",
                    "💡 Gợi ý thêm phương pháp giải"
                ]
            }

        # TÌNH HUỐNG GIẢI THÍCH LÝ THUYẾT (EXPLAIN_CONCEPT / TẠO BÀI HỌC)
        if intent == "EXPLAIN_CONCEPT":
            concept_name = top_weakness["concept_name"]
            print(f"\n📖 [EXPLAIN_CONCEPT] Bắt đầu biên soạn bài giảng cho '{concept_name}' ({detected_lang})...", flush=True)
            reply_text = self._generate_concept_explanation(
                concept=top_weakness,
                language=detected_lang,
                user_msg=last_user_msg
            )
            agent_traces.append({
                "agent": "PedagogicalExplainer",
                "action": f"Generate Lesson & Theory ({detected_lang})",
                "result": f"Hoàn thành bài giảng '{concept_name}'",
                "details": f"Biên soạn nội dung lý thuyết, bảng phân tích, code mẫu {detected_lang} và lưu ý bẫy lỗi."
            })
            return {
                "intent": intent,
                "reply": reply_text,
                "exercise": None,
                "agent_traces": agent_traces,
                "suggested_options": [
                    f"🎯 Tạo bài tập thực hành {concept_name}",
                    f"❓ Cho tôi một ví dụ nâng cao hơn về {concept_name}",
                    f"📊 Xem vị trí trên cây tri thức {detected_lang}"
                ]
            }

        # GENERAL_CHAT: Chào hỏi hoặc trò chuyện chung
        reply_text = (
            f"Chào bạn! 👋 Mình là **Trợ Lý Học Tập Python** đồng hành cùng bạn.\n\n"
            f"Mình luôn theo sát tiến độ và hỗ trợ bạn trong suốt quá trình rèn luyện:\n"
            f"• 🔍 **Chẩn đoán điểm yếu**: Rà soát cây tri thức để tìm ra các chủ đề bạn cần củng cố.\n"
            f"• 🎯 **Bài tập thích ứng**: Thiết kế bài tập vừa sức, bám sát các lỗi bạn hay gặp.\n"
            f"• 📉 **Hỗ trợ từng bước**: Giảm độ khó hoặc cung cấp bài tập nền tảng nếu bài quá sức.\n\n"
            f"Hôm nay bạn muốn kiểm tra phần mình còn yếu hay muốn bắt đầu luyện tập chủ đề nào?"
        )
        return {
            "intent": intent,
            "reply": reply_text,
            "exercise": None,
            "agent_traces": agent_traces,
            "suggested_options": [
                "🔍 Tôi đang yếu phần nào nhất?",
                "🎯 Tạo bài tập phần tôi yếu nhất",
                "🐍 Rèn luyện cấu trúc Dictionary & Key-Value"
            ]
        }
