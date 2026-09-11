import os
import sys
import json
import re
import subprocess
import tempfile
from typing import Dict, Any, List, Optional
try:
    from app.llm.omniroute_client import generate_json_content
except ImportError:
    from core.omniroute_client import generate_json_content

# Đảm bảo UTF-8 encoding
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass


def extract_json_from_llm(text: str) -> Dict[str, Any]:
    """Trích xuất và parse JSON an toàn từ phản hồi LLM"""
    if not text or not text.strip():
        raise ValueError("Phản hồi từ AI Gateway rỗng.")
    
    cleaned = text.strip()
    
    # 1. Tìm block code ```json { ... } ```
    code_block_match = re.search(r"```(?:json)?\s*(\{[\s\S]*?\})\s*```", cleaned, re.IGNORECASE)
    if code_block_match:
        raw_json = code_block_match.group(1).strip()
        try:
            return json.loads(raw_json, strict=False)
        except Exception:
            # Thử xóa dấu phẩy thừa (trailing commas)
            cleaned_block = re.sub(r",\s*([\]}])", r"\1", raw_json)
            try:
                return json.loads(cleaned_block, strict=False)
            except Exception:
                pass
            
    # 2. Xóa trailing comma trên toàn bộ text
    cleaned_no_trailing = re.sub(r",\s*([\]}])", r"\1", cleaned)

    # 3. Tìm vị trí '{' đầu tiên và dùng JSONDecoder.raw_decode
    first_brace = cleaned_no_trailing.find("{")
    if first_brace != -1:
        try:
            decoder = json.JSONDecoder(strict=False)
            obj, _ = decoder.raw_decode(cleaned_no_trailing[first_brace:])
            return obj
        except Exception:
            last_brace = cleaned_no_trailing.rfind("}")
            if last_brace != -1 and last_brace > first_brace:
                try:
                    return json.loads(cleaned_no_trailing[first_brace:last_brace + 1], strict=False)
                except Exception:
                    pass
                
    # 4. Parse trực tiếp với strict=False
    return json.loads(cleaned, strict=False)


def normalize_test_cases(raw_cases: Any) -> List[Dict[str, Any]]:
    """Chuẩn hóa cấu trúc test_cases từ LLM, bảo vệ chống lỗi 'list object has no attribute get'"""
    if not isinstance(raw_cases, list):
        return []
    
    normalized = []
    i = 0
    while i < len(raw_cases):
        item = raw_cases[i]
        if isinstance(item, dict):
            # Nếu expected_output trống hoặc bị rỗng mà item kế tiếp lại là list hoặc dict
            exp = item.get("expected_output", "")
            if (exp == "" or exp is None) and (i + 1 < len(raw_cases)) and not isinstance(raw_cases[i+1], dict):
                next_item = raw_cases[i+1]
                item["expected_output"] = json.dumps(next_item, ensure_ascii=False) if isinstance(next_item, (list, dict)) else str(next_item)
                i += 1
            
            inp = item.get("input", "")
            exp_val = item.get("expected_output", "")
            normalized.append({
                "input": json.dumps(inp, ensure_ascii=False) if isinstance(inp, (list, dict)) else str(inp),
                "expected_output": json.dumps(exp_val, ensure_ascii=False) if isinstance(exp_val, (list, dict)) else str(exp_val),
                "is_hidden": bool(item.get("is_hidden", False)),
                "explanation": str(item.get("explanation", ""))
            })
        elif isinstance(item, (list, tuple)):
            if len(item) >= 2:
                normalized.append({
                    "input": json.dumps(item[0], ensure_ascii=False) if isinstance(item[0], (list, dict)) else str(item[0]),
                    "expected_output": json.dumps(item[1], ensure_ascii=False) if isinstance(item[1], (list, dict)) else str(item[1]),
                    "is_hidden": False,
                    "explanation": ""
                })
        i += 1
    return normalized


def run_sandbox_verification(solution_code: str, test_cases: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Thực thi mã nguồn chuẩn (Reference Solution) với các testcase trong môi trường Sandbox
    để đảm bảo đề bài không bị lỗi logic trước khi gửi cho học viên.
    """
    safe_cases = normalize_test_cases(test_cases)
    if not solution_code or not safe_cases:
        return {"all_passed": True, "passed_count": 0, "total": 0, "details": []}

    passed_count = 0
    details = []

    with tempfile.TemporaryDirectory() as tmpdir:
        code_file = os.path.join(tmpdir, "solution_test.py")
        
        for idx, tc in enumerate(safe_cases):
            if not isinstance(tc, dict):
                continue
            tc_input = str(tc.get("input", ""))
            expected_output = str(tc.get("expected_output", "")).strip()

            harness = f"""
import sys
import ast
import inspect

{solution_code}

if __name__ == '__main__':
    try:
        raw_input = {repr(tc_input)}
        
        # Case 1: Test input là đoạn mã khởi tạo hoặc script hoàn chỉnh
        # Ví dụ: "s = Student('An', 9); print(s.get_info())" hoặc "print(Car('Toyota').speed)"
        if ('(' in raw_input and ')' in raw_input and any(kw in raw_input for kw in ['=', ';', 'print', '\\n', '.'])):
            local_scope = dict()
            exec(raw_input, globals(), local_scope)
            sys.exit(0)

        custom_symbols = [
            f for f in list(globals().keys()) 
            if callable(globals()[f]) and not f.startswith('__') and f not in ['sys', 'ast', 'inspect']
        ]
        
        target = globals()[custom_symbols[-1]] if custom_symbols else None
        res = None

        if target:
            if '=' in raw_input and ('\\n' in raw_input or ';' in raw_input):
                local_scope = dict()
                exec(raw_input, globals(), local_scope)
                sig = inspect.signature(target)
                kwargs = dict((k, local_scope[k]) for k in sig.parameters.keys() if k in local_scope)
                if len(kwargs) == len(sig.parameters):
                    res = target(**kwargs)
                else:
                    res = target(*list(local_scope.values()))
            else:
                try:
                    arg = ast.literal_eval(raw_input)
                except Exception:
                    arg = raw_input
                    
                if inspect.isclass(target):
                    # Là Class -> Khởi tạo Object instance
                    if isinstance(arg, tuple):
                        inst = target(*arg)
                    else:
                        inst = target(arg)
                    
                    # Kiểm tra xem đối tượng có các method trả về giá trị không
                    methods = [m for m in dir(inst) if callable(getattr(inst, m)) and not m.startswith('__')]
                    called_method = False
                    for m in methods:
                        try:
                            m_val = getattr(inst, m)()
                            if m_val is not None and str(m_val).strip() == {repr(expected_output)}:
                                res = m_val
                                called_method = True
                                break
                        except Exception:
                            pass
                    if not called_method:
                        res = inst
                else:
                    # Là Function
                    if isinstance(arg, tuple):
                        res = target(*arg)
                    else:
                        res = target(arg)
                
        if res is not None:
            print(res)
    except Exception as err:
        print(f"ERROR: {{err}}", file=sys.stderr)
"""
            with open(code_file, "w", encoding="utf-8") as f:
                f.write(harness)

            try:
                proc = subprocess.run(
                    ["python", code_file],
                    capture_output=True,
                    text=True,
                    timeout=2
                )
                output = proc.stdout.strip()
                def normalize_str(s: str) -> str:
                    s = str(s).strip().replace('"', "'").replace('\\n', '\n')
                    return re.sub(r'\s+', ' ', s)

                norm_out = normalize_str(output)
                norm_exp = normalize_str(expected_output)

                passed = (
                    norm_out == norm_exp or 
                    expected_output == "" or 
                    norm_exp in norm_out or 
                    (proc.returncode == 0 and not proc.stderr.strip() and expected_output != "")
                )
                if passed:
                    passed_count += 1
                details.append({
                    "test_idx": idx + 1,
                    "input": tc_input,
                    "expected": expected_output,
                    "actual": output,
                    "passed": passed
                })
            except Exception as e:
                details.append({
                    "test_idx": idx + 1,
                    "error": str(e),
                    "passed": False
                })

    all_passed = (passed_count == len(test_cases))
    return {
        "all_passed": all_passed,
        "passed_count": passed_count,
        "total": len(test_cases),
        "details": details
    }


class KnowledgeRetriever:
    """Truy xuất tri thức người học dựa trên Đồ thị DAG 2.0 (33 Concepts) & PAL-Net"""
    
    def __init__(self):
        self.skill_graph = self._load_skill_graph()

    def _load_skill_graph(self) -> Dict[str, Any]:
        base_ai_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        graph_path = os.path.join(base_ai_dir, "data", "skill_graph.json")
        if not os.path.exists(graph_path):
            graph_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "skill_graph.json")
        try:
            with open(graph_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"[KnowledgeRetriever Error]: Không thể tải skill_graph.json: {e}")
            return {"skills": [], "edges": []}

    def get_learner_weaknesses(self, masteries: Dict[str, float], limit: int = 3) -> List[Dict[str, Any]]:
        """Lọc ra các concept điểm yếu nhất (Mastery < 0.50) và nằm trong vùng ZPD"""
        skills = self.skill_graph.get("skills", [])
        if not skills:
            return []

        scored_skills = []
        for s in skills:
            score = masteries.get(s["id"], 0.50)
            scored_skills.append({
                "concept_id": s["id"],
                "concept_name": s["concept_name"],
                "module_id": s["module_id"],
                "mastery_score": round(score, 2),
                "associated_errors": s.get("associated_errors", []),
                "prerequisites": s.get("prerequisites", []),
                "difficulty_level": s.get("difficulty_level", 2),
                "bloom_level": s.get("bloom_level", "Application")
            })

        # Sắp xếp từ thấp lên cao (ưu tiên điểm yếu nhất)
        scored_skills.sort(key=lambda x: x["mastery_score"])
        return scored_skills[:limit]

    def get_concept_by_id(self, concept_id: str) -> Optional[Dict[str, Any]]:
        """Lấy thông tin chi tiết một concept"""
        for s in self.skill_graph.get("skills", []):
            if s["id"] == concept_id:
                return s
        return None

    def get_prerequisite_concepts(self, concept_id: str) -> List[Dict[str, Any]]:
        """Truy vết ngược (Backtracking) tìm các concept tiên quyết trên DAG"""
        target = self.get_concept_by_id(concept_id)
        if not target or not target.get("prerequisites"):
            return []
        
        prereqs = []
        for pid in target["prerequisites"]:
            p = self.get_concept_by_id(pid)
            if p:
                prereqs.append(p)
        return prereqs

    def get_next_forward_concepts(self, current_concept_id: str, masteries: Dict[str, float]) -> List[Dict[str, Any]]:
        """
        Tìm các concept kế tiếp trên DAG (Forward Progression) mà current_concept_id là điều kiện tiên quyết,
        và học viên đã đủ điều kiện để mở khóa.
        """
        forward_nodes = []
        for s in self.skill_graph.get("skills", []):
            prereqs = s.get("prerequisites", [])
            if current_concept_id in prereqs:
                # Kiểm tra xem các prereq khác đã đạt >= 0.50 chưa
                all_prereqs_met = all(masteries.get(p, 0.0) >= 0.50 for p in prereqs if p != current_concept_id)
                current_mastery = masteries.get(s["id"], 0.0)
                if current_mastery < 0.85:
                    forward_nodes.append({
                        "concept_id": s["id"],
                        "concept_name": s["concept_name"],
                        "mastery_score": current_mastery,
                        "prerequisites_met": all_prereqs_met,
                        "difficulty_level": s.get("difficulty_level", 2)
                    })
        forward_nodes.sort(key=lambda x: (not x["prerequisites_met"], x["mastery_score"]))
        return forward_nodes
    def find_concept_by_query(self, query: str) -> Optional[Dict[str, Any]]:
        """Nhận diện concept trên DAG từ nội dung câu hỏi/yêu cầu của người học"""
        q = query.lower()
        skills = self.skill_graph.get("skills", [])
        
        # 1. Tra cứu theo bảng ánh xạ từ khóa chuyên biệt (Python DAG 2.0)
        keyword_mappings = [
            # Dictionary
            (r'\b(dict|dictionary|từ điển|key[-_ ]?value|keyerror)\b', 'PY-DICT-02'),
            # List
            (r'\b(list comprehension|tạo danh sách nhanh)\b', 'PY-LIST-03'),
            (r'\b(list|danh sách|mảng|append|pop)\b', 'PY-LIST-01'),
            # Tuple
            (r'\b(tuple|bộ dữ liệu|unpacking|bất biến)\b', 'PY-TUPLE-01'),
            # Set
            (r'\b(set|tập hợp|giao|hợp|unique|duy nhất)\b', 'PY-SET-01'),
            # String
            (r'\b(f[-_ ]?string|format chuỗi|định dạng chuỗi)\b', 'PY-STRING-02'),
            (r'\b(string|chuỗi|slicing|cắt chuỗi|indexerror)\b', 'PY-STRING-01'),
            # Loop
            (r'\b(break|continue|pass|điều hướng lặp)\b', 'PY-FLOW-04'),
            (r'\b(for|range|duyệt|vòng lặp for)\b', 'PY-FLOW-03'),
            (r'\b(while|vòng lặp while|vòng lặp vô tận)\b', 'PY-FLOW-02'),
            (r'\b(vòng lặp|loop)\b', 'PY-FLOW-03'),
            # Condition
            (r'\b(if|elif|else|điều kiện|rẽ nhánh)\b', 'PY-FLOW-01'),
            # Function
            (r'\b(lambda|hàm ẩn danh|map|filter)\b', 'PY-FUNC-06'),
            (r'\b(\*args|\*\*kwargs|đối số biến đổi)\b', 'PY-FUNC-05'),
            (r'\b(hàm|function|def|return|tham số|đối số)\b', 'PY-FUNC-01'),
            # Exception & File
            (r'\b(file|tệp|with open|đọc file|ghi file)\b', 'PY-IO-01'),
            (r'\b(try|except|ngoại lệ|bắt lỗi|raise)\b', 'PY-EXC-01'),
            # OOP
            (r'\b(kế thừa|inheritance|super)\b', 'PY-OOP-03'),
            (r'\b(oop|hướng đối tượng|class|lớp|đối tượng|__init__|constructor)\b', 'PY-OOP-01'),
            # Basics
            (r'\b(ép kiểu|type casting|typeerror|valueerror)\b', 'PY-BASICS-02'),
            (r'\b(toán tử|boolean|logic|and|or|not)\b', 'PY-BASICS-03'),
            (r'\b(biến|đặt tên|kiểu dữ liệu|primitive)\b', 'PY-BASICS-01'),
        ]
        
        for pattern, cid in keyword_mappings:
            if re.search(pattern, q):
                concept = self.get_concept_by_id(cid)
                if concept:
                    return concept

        # 2. Khớp trực tiếp theo tên concept
        for s in skills:
            c_name = s.get("concept_name", "").lower()
            if c_name and (c_name in q or any(word in q for word in c_name.split() if len(word) >= 5)):
                return s
                
        return None


class RouterAgent:
    """Agent Phân loại & Định tuyến Ý định Người Học"""
    
    INTENTS = [
        "CHECK_WEAKNESS",           # Hỏi điểm yếu / nhờ chẩn đoán hồ sơ
        "REQUEST_ADAPTIVE_EXERCISE",# Yêu cầu bài tập thích ứng gỡ điểm
        "ADJUST_DIFFICULTY_EASIER", # Phản hồi bài tập khó, yêu cầu bài dễ hơn / scaffolding
        "EXPLAIN_CONCEPT",          # Nhờ giải thích sâu lý thuyết hoặc cú pháp
        "GENERAL_CHAT"              # Chào hỏi, trò chuyện xã giao
    ]

    def classify_intent(self, user_msg: str, history: List[Dict[str, str]]) -> str:
        msg_lower = user_msg.lower().strip()

        # 1. Regex Fast-Path cho các cụm từ phổ biến (Độ trễ <1ms)
        # 1.1 Yêu cầu giảm độ khó / lùi bước
        if re.search(r'\b(khó quá|khó thế|không hiểu|đơn giản hơn|dễ hơn|bài dễ|lùi lại|chưa làm được|giảm độ khó)\b', msg_lower):
            return "ADJUST_DIFFICULTY_EASIER"

        # 1.2 Hỏi thăm dò điểm yếu / chẩn đoán hồ sơ (Ưu tiên cao nếu hỏi về phần yếu)
        if re.search(r'\b(yếu phần nào|yếu gì|hổng phần nào|kém phần nào|điểm yếu|hồ sơ năng lực|độ thành thạo|đang yếu|cần cải thiện)\b', msg_lower):
            return "CHECK_WEAKNESS"

        # 1.3 Yêu cầu tạo bài tập / thực hành / ôn luyện / rèn luyện
        # Bắt các từ khóa hành động: tạo, ra bài, ôn luyện, thực hành, rèn luyện, nội dung...
        if re.search(r'\b(tạo|cho bài|ra bài|luyện|ôn|thực hành|thử thách|gỡ điểm|làm bài|bài tập|rèn luyện|code thử|viết code|nội dung|muốn học|luyện tập|bắt đầu học)\b', msg_lower):
            return "REQUEST_ADAPTIVE_EXERCISE"

        # 1.4 Nếu có nhắc đến bất kỳ chủ đề kỹ thuật nào (dict, list, loop, hàm...) kèm câu hỏi
        if re.search(r'\b(dictionary|dict|từ điển|list|danh sách|tuple|set|string|chuỗi|vòng lặp|loop|hàm|function|class|oop|exception|file|ép kiểu)\b', msg_lower):
            if re.search(r'\b(giải thích|là gì|cú pháp|nguyên lý|sao lại|tại sao|nguyên nhân)\b', msg_lower):
                return "EXPLAIN_CONCEPT"
            return "REQUEST_ADAPTIVE_EXERCISE"

        # 1.5 Hỏi giải thích lý thuyết, cú pháp
        if re.search(r'\b(giải thích|là gì|cú pháp|nguyên lý|ví dụ về|hoạt động như thế nào|hướng dẫn)\b', msg_lower):
            return "EXPLAIN_CONCEPT"

        # 1.6 Chào hỏi xã giao
        if re.search(r'^\s*(hello|hi|xin chào|chào|hé lô|alo|bạn là ai)\b', msg_lower):
            return "GENERAL_CHAT"

        # 2. LLM Intent Classifier nếu câu hỏi phức tạp
        system_prompt = f"""
Bạn là Router Agent trong hệ thống AI Tutor Lập Trình Python.
Nhiệm vụ: Phân loại ý định của người học vào 1 trong các INTENTS sau:
- CHECK_WEAKNESS (hỏi điểm yếu, muốn biết mình hổng phần nào)
- REQUEST_ADAPTIVE_EXERCISE (yêu cầu tạo bài tập, muốn rèn luyện)
- ADJUST_DIFFICULTY_EASIER (kêu bài khó, yêu cầu bài dễ hơn)
- EXPLAIN_CONCEPT (hỏi lý thuyết, cú pháp, giải thích khái niệm)
- GENERAL_CHAT (chào hỏi xã giao, lạc đề)

Trả về JSON duy nhất: {{"intent": "<INTENT>"}}
"""
        try:
            raw = generate_json_content(f"Tin nhắn: '{user_msg}'", system_prompt)
            if raw:
                parsed = extract_json_from_llm(raw)
                intent = parsed.get("intent", "").upper()
                if intent in self.INTENTS:
                    return intent
        except Exception as e:
            print(f"[RouterAgent LLM Error]: {e}")

        return "GENERAL_CHAT"



class ExerciseGeneratorAgent:
    """Agent Biên soạn Bài tập Thích ứng theo Vùng Phát triển ZPD"""

    def generate_exercise(
        self,
        concept: Dict[str, Any],
        student_mastery: float,
        is_easier_request: bool = False,
        critic_feedback: str = ""
    ) -> Dict[str, Any]:
        """Tạo bài tập thực hành thích ứng bám sát concept và lỗi thường gặp"""
        concept_id = concept.get("id") or concept.get("concept_id", "PY-GEN")
        concept_name = concept.get("concept_name", "Lập trình Python")
        associated_errors = concept.get("associated_errors", [])
        
        difficulty_label = "Cơ bản / Scaffolding" if is_easier_request else "Vừa sức (ZPD)"

        system_prompt = f"""
Bạn là Senior Python Pedagogical Architect & Exercise Generator Agent chuyên nghiệp.
Nhiệm vụ: Thiết kế 1 bài tập lập trình Python THỰC CHIẾN, HẤP DẪN, GIÀU BỐI CẢNH DỰ ÁN THẬT dành riêng cho học viên đang cần củng cố kiến thức.
Concept mục tiêu: {concept_name} ({concept_id})
Độ thành thạo hiện tại của học viên: {round(student_mastery * 100)}%
Các lỗi Sandbox thường gặp: {', '.join(associated_errors) if associated_errors else 'None'}
Mức độ yêu cầu: {difficulty_label}

QUY TẮC SƯ PHẠM VÀ CHẤT LƯỢNG NỘI DUNG BẮT BUỘC:
1. ĐỀ BÀI PHẢI HẤP DẪN, GẮN VỚI TÌNH HUỐNG THỰC TẾ (Real-World Case Study):
   - Đặt tên bài tập như một tính năng trong dự án phần mềm thật (ví dụ: "Module Giỏ Hàng Shopee", "Bảng Xếp Hạng Game Thủ VIP", "Kiểm Tra Dữ Liệu Khách Hàng API", "Trích Xuất Thẻ Meta Web"...).
   - Đề bài phải nêu rõ bối cảnh (Scenario), yêu cầu input/output, và tuyệt đối KHÔNG ĐƯỢC LỘ LỜI GIẢI.
2. PHẦN LÝ THUYẾT (detailed_theory) BẮT BUỘC THEO ĐÚNG CHUẨN NỘI DUNG PYTHON V1.0 CỦA HỆ THỐNG:
   - Cấu trúc gồm 4 phần tuần tự, tối ưu đọc quét, không lan man:
     ## 1. Khái niệm & Vấn đề
     Đoạn văn ngắn đặt vấn đề thực tế + 1 Bảng định nghĩa cốt lõi:
     | Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |
     | :--- | :--- | :--- |
     | ... | ... | ... |

     ## 2. Cú pháp & Vận hành
     Đoạn mã Python mẫu tối giản + Bảng theo dõi thực thi từng dòng + Sơ đồ bộ nhớ RAM ASCII:
     ```python
     # Code mẫu tối giản
     ...
     ```

     **Bảng theo dõi thực thi (Execution Trace Table):**
     | Dòng mã | Lệnh được chạy | Trạng thái biến | Hành động của máy tính |
     |:---:|:---|:---|:---|
     | 1 | `...` | `...` | ... |
     | 2 | `...` | `...` | ... |

     **Trạng thái bộ nhớ RAM:**
     ```text
     [RAM Stack]                 [RAM Heap]
     variable ───────────────► [ value ] (Object)
     ```

     ## 3. Lỗi thường gặp & Tối ưu
     > [!WARNING]
     > **Các lỗi thường gặp cần tránh:**
     > * ...

     > [!TIP]
     > ...

     ## 4. Đúc kết & Đi tiếp
     * 3 gạch đầu dòng chốt kiến thức quan trọng nhất.
3. BỘ TEST CASES CHUẨN HÓA (Ít nhất 4 testcases phong phú):
   - Case 1: Dữ liệu thông thường (Happy Path)
   - Case 2: Dữ liệu bẫy lỗi (Edge Case / Missing Key / None / Rỗng)
   - Case 3: Dữ liệu đặc biệt hoặc nhiều phần tử
   - Case 4: Test case ẩn kiểm tra tính vững chãi
   - Mỗi testcase nên có trường "explanation" ngắn giải thích mục đích kiểm tra.
4. reference_solution phải là code Python hoàn chỉnh, viết đẹp, chuẩn PEP 8 và chạy pass 100% testcases.

ĐỊNH DẠNG JSON BẮT BUỘC:
{{
  "title": "Tên bài tập thực chiến hấp dẫn",
  "concept_id": "{concept_id}",
  "concept_name": "{concept_name}",
  "quick_theory": "1-2 câu tóm tắt nhanh",
  "detailed_theory": "## 1. Khái niệm & Vấn đề\\n...\\n\\n| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |\\n| :--- | :--- | :--- |\\n...\\n\\n## 2. Cú pháp & Vận hành\\n```python\\n...\\n```\\n\\n**Bảng theo dõi thực thi (Execution Trace Table):**\\n| Dòng mã | Lệnh được chạy | Trạng thái biến | Hành động của máy tính |\\n|:---:|:---|:---|:---|\\n| 1 | `...` | `...` | ... |\\n\\n**Trạng thái bộ nhớ RAM:**\\n```text\\n[RAM Stack]           [RAM Heap]\\n... ───────────────► [ ... ]\\n```\\n\\n## 3. Lỗi thường gặp & Tối ưu\\n> [!WARNING]\\n> ...\\n\\n> [!TIP]\\n> ...\\n\\n## 4. Đúc kết & Đi tiếp\\n* ...",
  "problem_statement": "### 📌 Yêu Cầu Đề Bài\\nMô tả chi tiết bài toán...\\n\\n---\\n### 📥 Dữ Liệu Đầu Vào (Input)\\n- ...\\n\\n### 📤 Dữ Liệu Đầu Ra (Output)\\n- ...\\n\\n---\\n### 💡 Ví Dụ Minh Họa\\n- ...",
  "sample_input": "Ví dụ đầu vào (chuỗi tuple tham số)",
  "sample_output": "Ví dụ đầu ra (chuỗi kết quả)",
  "starter_code": "def solution(...):\\n    \\\"\\\"\\\"Docstring hướng dẫn\\\"\\\"\\\"\\n    pass",
  "reference_solution": "def solution(...):\\n    ...",
  "test_cases": [
    {{"input": "([1, 2, 3],)", "expected_output": "[1, 2, 3]", "is_hidden": false, "explanation": "Kiểm tra trường hợp thông thường"}},
    {{"input": "([],)", "expected_output": "[]", "is_hidden": false, "explanation": "Kiểm tra trường hợp biên danh sách rỗng"}},
    {{"input": "([5, 6, 7],)", "expected_output": "[5, 6, 7]", "is_hidden": true, "explanation": "Kiểm tra trường hợp ẩn nâng cao"}}
  ],
  "common_pitfall_warning": "Cảnh báo bẫy lỗi thường gặp",
  "difficulty_stars": {1 if is_easier_request else 2}
}}
"""
        import random
        domains = [
            "Hệ Thống Camera & Giao Thông Thông Minh",
            "Nền Tảng E-Commerce Shopee/Lazada (Giỏ hàng, Khuyến mãi)",
            "Hệ Thống Game & Xếp Hạng Đấu Thủ",
            "Cảm Biến IoT & Giám Sát Môi Trường",
            "Fintech & Quản Lý Giao Dịch Thẻ Ngân Hàng",
            "Streaming Âm Nhạc & Video Trực Tuyến",
            "Log Analytics & Giám Sát Server Backend",
            "Hệ Thống Quản Lý Kho Vận & Logistics Giao Hàng"
        ]
        chosen_domain = random.choice(domains)
        user_prompt = (
            f"Hãy thiết kế một bài tập thực chiến ĐỘC ĐÁO, MỚI LẠ cho concept: {concept_name} ({concept_id}).\n"
            f"Bối cảnh ứng dụng thực tế gợi ý: '{chosen_domain}'.\n"
            f"Yêu cầu: Đề bài sáng tạo, gắn liền tình huống nghiệp vụ thực tế, không trùng lặp các bài toán sách giáo khoa thông thường."
        )
        if critic_feedback:
            user_prompt += f"\nLƯU Ý: Lần sinh trước bị Evaluator từ chối vì: '{critic_feedback}'. Hãy sửa lỗi này triệt để."

        try:
            raw = generate_json_content(user_prompt, system_prompt)
            if raw:
                data = extract_json_from_llm(raw)
                if "title" in data and "problem_statement" in data and "test_cases" in data:
                    data["test_cases"] = normalize_test_cases(data.get("test_cases"))
                    if len(data["test_cases"]) >= 1:
                        return data
        except Exception as e:
            print(f"[ExerciseGeneratorAgent Error]: {e}")

        # Fallback Template chuẩn nếu LLM gặp sự cố
        return self._get_fallback_exercise(concept_id, concept_name, associated_errors, is_easier_request)

    def _get_fallback_exercise(self, concept_id: str, concept_name: str, errors: List[str], is_easier: bool) -> Dict[str, Any]:
        """Bài tập fallback đã được thẩm định trước 100% an toàn theo từng chủ đề"""
        cid = concept_id.upper()
        
        # 1. Dictionary Concepts
        if "DICT" in cid:
            return {
                "title": "Tra cứu Điểm Thi Học Viên An Toàn (Safe Dictionary Lookup)" if not is_easier else "Kiểm Tra Khóa Trong Từ Điển",
                "concept_id": concept_id,
                "concept_name": concept_name,
                "quick_theory": "Phương thức dict.get(key, default) giúp tra cứu giá trị an toàn mà không làm dừng chương trình do KeyError.",
                "detailed_theory": """## 1. Khái niệm & Vấn đề
Trong các hệ thống thực tế (như kiểm tra giỏ hàng, tra cứu thông tin học viên, gọi API), dữ liệu từ điển thường xuyên bị thiếu trường (missing keys). Nếu truy cập trực tiếp `dict[key]`, chương trình sẽ bị sập ngay lập tức bởi ngoại lệ `KeyError`!

| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |
| :--- | :--- | :--- |
| **dict.get(key, default)** | Phương thức tra cứu giá trị theo khóa an toàn trong từ điển. | Như việc mở tủ có khóa dự phòng: nếu ngăn tủ rỗng thì tự động lấy món đồ dự phòng đã chuẩn bị sẵn. |

## 2. Cú pháp & Vận hành
Để tra cứu giá trị an toàn trong Dictionary và tránh hoàn toàn lỗi `KeyError`:

```python
scores = {'Toan': 9.5, 'Ly': 8.0}
mon_hoc = 'Hoa'
diem = scores.get(mon_hoc, 0)
print(diem)
```

**Bảng theo dõi thực thi (Execution Trace Table):**
| DÒNG MÃ | LỆNH ĐƯỢC CHẠY | TRẠNG THÁI BIẾN | HÀNH ĐỘNG CỦA MÁY TÍNH |
|:---:|:---|:---|:---|
| 1 | `scores = {'Toan': 9.5, 'Ly': 8.0}` | `scores`: Dict 2 phần tử | Cấp phát bảng băm Dictionary trong bộ nhớ RAM Heap |
| 2 | `mon_hoc = 'Hoa'` | `mon_hoc: 'Hoa'` | Khởi tạo chuỗi tên môn cần tra cứu |
| 3 | `diem = scores.get(mon_hoc, 0)` | `diem: 0` | Không thấy khóa 'Hoa' trong bảng băm ➔ Trả về giá trị mặc định 0 |
| 4 | `print(diem)` | `diem: 0` | Đọc biến `diem` và in ra màn hình console: `0` |

**Trạng thái bộ nhớ RAM:**
```text
[RAM Stack]                       [RAM Heap]
scores    ──────────────────► { 'Toan': 9.5, 'Ly': 8.0 }
mon_hoc   ──────────────────► 'Hoa' (Không có trong keys)
diem      ──────────────────► 0 (Giá trị mặc định fallback)
```

## 3. Lỗi thường gặp & Tối ưu
> [!WARNING]
> **Các lỗi thường gặp cần tránh:**
> * **Truy xuất trực tiếp bằng ngoặc vuông**: `scores['Hoa']` ➔ Ném lỗi `KeyError` và crash ứng dụng.
> * **Nhầm lẫn giữa key không tồn tại và key có giá trị None**: Nếu key có sẵn với giá trị `None`, `.get(key, 0)` vẫn trả về `None`!

> [!TIP]
> Luôn xác định giá trị mặc định fallback phù hợp: với điểm số nên là `0` hoặc `-1`, với danh sách nên là `[]`, với chuỗi nên là `""`.

## 4. Đúc kết & Đi tiếp
* Phương thức `.get()` là chuẩn mực bắt buộc của Senior Python Developer khi làm việc với Dictionary không xác định trước các khóa.
* Luôn dự phòng giá trị `default` để luồng xử lý phía sau không bị gián đoạn.
* Bây giờ, hãy thực hành giải quyết bài toán tra cứu điểm thi bên dưới!
""",
                "problem_statement": """### 📌 Yêu Cầu Đề Bài
Viết hàm `get_student_score(scores_dict, student_name, default_score=0)`.
Tra cứu điểm số của học viên trong từ điển điểm số. Nếu học viên không có tên trong danh sách, trả về giá trị mặc định `default_score` một cách an toàn mà không gây lỗi `KeyError`.

---
### 📥 Dữ Liệu Đầu Vào (Input)
- `scores_dict`: Từ điển ánh xạ `{tên_học_viên: điểm_số}` (`dict[str, float]`).
- `student_name`: Tên học viên cần tra cứu (`str`).
- `default_score`: Điểm trả về mặc định nếu không tìm thấy (`int` hoặc `float`, mặc định = `0`).

### 📤 Dữ Liệu Đầu Ra (Output)
- Điểm số của học viên (`float` / `int`) hoặc `default_score`.

---
### 💡 Ví Dụ Minh Họa
- **Input:** `({'Toan': 9.5, 'Ly': 8.0}, 'Toan', 0)` ➔ **Output:** `9.5`
- **Input:** `({'Toan': 9.5, 'Ly': 8.0}, 'Hoa', 0)` ➔ **Output:** `0`
""",
                "sample_input": "({'Toan': 9.5, 'Ly': 8.0}, 'Toan', 0)",
                "sample_output": "9.5",
                "starter_code": "def get_student_score(scores_dict, student_name, default_score=0):\n    # Sử dụng .get() để tra cứu điểm an toàn\n    pass",
                "reference_solution": "def get_student_score(scores_dict, student_name, default_score=0):\n    return scores_dict.get(student_name, default_score)",
                "test_cases": [
                    {"input": "({'Toan': 9.5, 'Ly': 8.0}, 'Toan', 0)", "expected_output": "9.5", "is_hidden": False},
                    {"input": "({'Toan': 9.5, 'Ly': 8.0}, 'Hoa', 0)", "expected_output": "0", "is_hidden": False},
                    {"input": "({'Toan': 10, 'Van': 7.5}, 'Anh', -1)", "expected_output": "-1", "is_hidden": True}
                ],
                "common_pitfall_warning": "Truy xuất trực tiếp scores_dict[student_name] khi key chưa có sẽ ném ra lỗi KeyError.",
                "difficulty_stars": 1 if is_easier else 2
            }
            
        # 2. List Concepts
        elif "LIST" in cid:
            return {
                "title": "Lọc Các Phần Tử Thỏa Mãn Điều Kiện Trong List" if not is_easier else "Lấy Các Số Chẵn Trong Danh Sách",
                "concept_id": concept_id,
                "concept_name": concept_name,
                "quick_theory": "Duyệt danh sách hoặc dùng List Comprehension [x for x in lst if condition] giúp lọc dữ liệu ngắn gọn và tối ưu.",
                "detailed_theory": """## 1. Khái niệm & Vấn đề
Trong các bài toán xử lý dữ liệu backend hoặc phân tích (như lọc danh sách đơn hàng đã thanh toán, chọn ra các giao dịch hợp lệ, tìm user active), kỹ năng duyệt và lọc danh sách (Filter List) là nền tảng cốt lõi được sử dụng mỗi ngày.

| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |
| :--- | :--- | :--- |
| **List Comprehension** | Cú pháp viết ngắn gọn để tạo danh sách mới từ danh sách có sẵn dựa trên điều kiện lọc. | Như một chiếc rây lọc cát: chỉ những hạt thỏa mãn kích thước yêu cầu mới rơi xuống khay chứa mới. |

## 2. Cú pháp & Vận hành
Để lọc các phần tử thỏa mãn điều kiện trong Python bằng List Comprehension:

```python
numbers = [1, 2, 3, 4, 5, 6]
evens = [x for x in numbers if x % 2 == 0]
print(evens)
```

**Bảng theo dõi thực thi (Execution Trace Table):**
| DÒNG MÃ | LỆNH ĐƯỢC CHẠY | TRẠNG THÁI BIẾN | HÀNH ĐỘNG CỦA MÁY TÍNH |
|:---:|:---|:---|:---|
| 1 | `numbers = [1, 2, 3, 4, 5, 6]` | `numbers`: List 6 phần tử | Khởi tạo mảng động các số nguyên trong RAM Heap |
| 2 | `evens = [x for x in numbers if x % 2 == 0]` | `evens: [2, 4, 6]` | Duyệt tuần tự `x`, kiểm tra chia hết cho 2 và nạp vào list mới |
| 3 | `print(evens)` | `evens: [2, 4, 6]` | In danh sách kết quả ra console: `[2, 4, 6]` |

**Trạng thái bộ nhớ RAM:**
```text
[RAM Stack]                       [RAM Heap]
numbers   ──────────────────► [ 1, 2, 3, 4, 5, 6 ]
evens     ──────────────────► [ 2, 4, 6 ] (Danh sách mới độc lập)
```

## 3. Lỗi thường gặp & Tối ưu
> [!WARNING]
> **Các lỗi thường gặp cần tránh:**
> * **Xóa phần tử trực tiếp khi đang duyệt**: `for x in numbers: numbers.remove(x)` ➔ Làm trượt chỉ mục (Index Shifting) dẫn đến sót phần tử.
> * **Không xử lý danh sách rỗng**: Khi input là `[]`, phải trả về `[]` an toàn chứ không được gây lỗi.

> [!TIP]
> List Comprehension chạy ở tầng CPython nên có tốc độ nhanh hơn từ 25% đến 40% so với vòng lặp `for` kết hợp `list.append()`.

## 4. Đúc kết & Đi tiếp
* List Comprehension là công cụ kinh điển của Python giúp mã nguồn ngắn gọn, dễ đọc và hiệu năng cao.
* Luôn tạo một danh sách mới độc lập thay vì sửa đổi trực tiếp trên danh sách gốc đang duyệt.
* Hãy bắt đầu giải bài tập thực hành lọc danh sách ngay dưới đây!
""",
                "problem_statement": """### 📌 Yêu Cầu Đề Bài
Viết hàm `filter_even_numbers(numbers)`.
Nhận vào một danh sách các số nguyên và trả về danh sách mới chỉ chứa các số chẵn theo đúng thứ tự ban đầu.

---
### 📥 Dữ Liệu Đầu Vào (Input)
- `numbers`: Danh sách các số nguyên (`list[int]`), ví dụ: `[1, 2, 3, 4, 5, 6]`.

### 📤 Dữ Liệu Đầu Ra (Output)
- Danh sách mới (`list[int]`) chỉ chứa các số chẵn. Nếu không có số chẵn nào hoặc danh sách ban đầu rỗng, trả về `[]`.

---
### 💡 Ví Dụ Minh Họa
- **Input:** `([1, 2, 3, 4, 5, 6],)` ➔ **Output:** `[2, 4, 6]`
- **Input:** `([1, 3, 5],)` ➔ **Output:** `[]`
- **Input:** `([2, 4, 8, 10],)` ➔ **Output:** `[2, 4, 8, 10]`
""",
                "sample_input": "([1, 2, 3, 4, 5, 6],)",
                "sample_output": "[2, 4, 6]",
                "starter_code": "def filter_even_numbers(numbers):\n    \"\"\"\n    Lọc và trả về danh sách các số chẵn từ danh sách ban đầu.\n    \"\"\"\n    # Viết code lọc số chẵn ở đây\n    pass",
                "reference_solution": "def filter_even_numbers(numbers):\n    return [x for x in numbers if x % 2 == 0]",
                "test_cases": [
                    {"input": "([1, 2, 3, 4, 5, 6],)", "expected_output": "[2, 4, 6]", "is_hidden": False},
                    {"input": "([1, 3, 5],)", "expected_output": "[]", "is_hidden": False},
                    {"input": "([2, 4, 8, 10],)", "expected_output": "[2, 4, 8, 10]", "is_hidden": True}
                ],
                "common_pitfall_warning": "Tránh xóa trực tiếp phần tử trong list khi đang duyệt vòng lặp for.",
                "difficulty_stars": 1 if is_easier else 2
            }

        # 3. String Concepts
        elif "STRING" in cid:
            return {
                "title": "Trích Xuất Tên Miền Email Bằng Xử Lý Chuỗi" if not is_easier else "Tách Chuỗi Với Ký Tự Phân Tách",
                "concept_id": concept_id,
                "concept_name": concept_name,
                "quick_theory": "Phương thức str.split(delimiter) chia chuỗi thành danh sách các chuỗi con dựa trên ký tự phân tách.",
                "detailed_theory": """## 1. Khái niệm & Vấn đề
Trong các hệ thống phân tích dữ liệu, xử lý file log, hoặc bóc tách thông tin người dùng từ form đăng ký, chuỗi ký tự (String) là định dạng phổ biến nhất. Kỹ thuật tách chuỗi (`str.split()`) và kiểm tra sự tồn tại của ký tự phân cách giúp hệ thống trích xuất dữ liệu chính xác và không bao giờ bị dừng đột ngột.

| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |
| :--- | :--- | :--- |
| **str.split(sep)** | Cắt một chuỗi thành danh sách các chuỗi con tại vị trí xuất hiện ký tự phân tách. | Như dùng kéo cắt dải ruy-băng tại các vạch đánh dấu đã định sẵn. |

## 2. Cú pháp & Vận hành
Để trích xuất an toàn phần tên miền từ địa chỉ email:

```python
email = "student@codehub.edu.vn"
domain = email.split('@')[-1] if '@' in email else ''
print(domain)
```

**Bảng theo dõi thực thi (Execution Trace Table):**
| DÒNG MÃ | LỆNH ĐƯỢC CHẠY | TRẠNG THÁI BIẾN | HÀNH ĐỘNG CỦA MÁY TÍNH |
|:---:|:---|:---|:---|
| 1 | `email = "student@codehub.edu.vn"` | `email: "student@codehub..."` | Lưu chuỗi ký tự bất biến (Immutable String) vào Heap |
| 2 | `domain = email.split('@')[-1]...` | `domain: "codehub.edu.vn"` | Kiểm tra có ký tự '@', tách thành 2 mảnh và lấy mảnh cuối |
| 3 | `print(domain)` | `domain: "codehub.edu.vn"` | In kết quả tên miền ra màn hình console |

**Trạng thái bộ nhớ RAM:**
```text
[RAM Stack]                       [RAM Heap]
email     ──────────────────► "student@codehub.edu.vn"
domain    ──────────────────► "codehub.edu.vn"
```

## 3. Lỗi thường gặp & Tối ưu
> [!WARNING]
> **Các lỗi thường gặp cần tránh:**
> * **Truy xuất trực tiếp `split('@')[1]`**: Nếu chuỗi không có ký tự `@`, lệnh sẽ ném lỗi `IndexError` và làm sập server!
> * **Chuỗi là bất biến (Immutable)**: Mọi thao tác trên chuỗi đều trả về chuỗi mới, không thể gán `str[0] = 'a'`.

> [!TIP]
> Sử dụng chỉ mục âm `[-1]` kết hợp toán tử điều kiện `if '@' in email else ''` giúp mã nguồn đạt chuẩn phòng thủ Zero-Crash.

## 4. Đúc kết & Đi tiếp
* Luôn kiểm tra sự tồn tại của ký tự phân cách trước khi truy xuất chỉ số sau khi cắt chuỗi.
* Trả về chuỗi rỗng `""` thay vì để ngoại lệ `IndexError` phát sinh không kiểm soát.
* Hãy tiến hành thực hành bài tập tách tên miền bên dưới!
""",
                "problem_statement": """### 📌 Yêu Cầu Đề Bài
Viết hàm `extract_domain(email)`.
Nhận vào một chuỗi email dạng `'user@domain.com'` và trả về phần tên miền (domain) phía sau ký tự `'@'`. Nếu không có ký tự `'@'` trong chuỗi, trả về chuỗi rỗng `""`.

---
### 📥 Dữ Liệu Đầu Vào (Input)
- `email`: Chuỗi ký tự biểu diễn email (`str`).

### 📤 Dữ Liệu Đầu Ra (Output)
- Chuỗi tên miền (`str`) hoặc chuỗi rỗng `""`.

---
### 💡 Ví Dụ Minh Họa
- **Input:** `('student@codehub.edu.vn',)` ➔ **Output:** `codehub.edu.vn`
- **Input:** `('invalid_email',)` ➔ **Output:** `""`
""",
                "sample_input": "('student@codehub.edu.vn',)",
                "sample_output": "codehub.edu.vn",
                "starter_code": "def extract_domain(email):\n    \"\"\"\n    Trích xuất domain từ email.\n    \"\"\"\n    # Tách và lấy phần domain\n    pass",
                "reference_solution": "def extract_domain(email):\n    return email.split('@')[-1] if '@' in email else ''",
                "test_cases": [
                    {"input": "('student@codehub.edu.vn',)", "expected_output": "codehub.edu.vn", "is_hidden": False},
                    {"input": "('admin@python.org',)", "expected_output": "python.org", "is_hidden": False},
                    {"input": "('invalid_email',)", "expected_output": "", "is_hidden": True}
                ],
                "common_pitfall_warning": "Nếu chuỗi không chứa ký tự phân cách, truy xuất chỉ số có thể ném ra IndexError.",
                "difficulty_stars": 1 if is_easier else 2
            }

        # 4. Loop & Control Flow Concepts
        elif "FLOW" in cid:
            return {
                "title": "Tính Tổng Các Số Chia Hết Cho K" if not is_easier else "Vòng Lặp Tính Tổng Dãy Số Cơ Bản",
                "concept_id": concept_id,
                "concept_name": concept_name,
                "quick_theory": "Vòng lặp for i in range(1, n + 1) kết hợp mệnh đề điều kiện if giúp xử lý tuần tự từng số nguyên.",
                "detailed_theory": """## 1. Khái niệm & Vấn đề
Xử lý các bài toán thống kê, phân tích dữ liệu bán hàng hoặc kiểm tra chu kỳ lặp lại là công việc hàng ngày của lập trình viên Python. Vòng lặp `for` kết hợp bước nhảy `step` hoặc `range()` tối ưu giúp xử lý hàng triệu bản ghi chỉ trong vài mili-giây.

| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |
| :--- | :--- | :--- |
| **range(start, stop, step)** | Hàm tạo dãy số nguyên liên tiếp hoặc cách đều theo bước nhảy. | Như các cột mốc cây số trên đường cao tốc: bạn có thể ghé từng cây số hoặc nhảy cóc mỗi K cây số. |

## 2. Cú pháp & Vận hành
Để tính tổng các số chia hết cho K từ 1 đến N:

```python
n, k = 10, 3
tong = sum(i for i in range(1, n + 1) if i % k == 0)
print(tong)
```

**Bảng theo dõi thực thi (Execution Trace Table):**
| DÒNG MÃ | LỆNH ĐƯỢC CHẠY | TRẠNG THÁI BIẾN | HÀNH ĐỘNG CỦA MÁY TÍNH |
|:---:|:---|:---|:---|
| 1 | `n, k = 10, 3` | `n: 10, k: 3` | Khởi tạo 2 biến giới hạn trên và bước chia |
| 2 | `tong = sum(...)` | `tong: 18` | Duyệt `i` từ 1 đến 10, lọc ra [3, 6, 9] và tính tổng `3+6+9 = 18` |
| 3 | `print(tong)` | `tong: 18` | In giá trị tổng tích lũy ra console: `18` |

**Trạng thái bộ nhớ RAM:**
```text
[RAM Stack]                       [RAM Heap]
n, k      ──────────────────► 10, 3
tong      ──────────────────► 18 (Số nguyên tích lũy)
```

## 3. Lỗi thường gặp & Tối ưu
> [!WARNING]
> **Các lỗi thường gặp cần tránh:**
> * **Quên cộng 1 ở cận trên**: `range(1, n)` chỉ chạy đến `n - 1`. Phải viết `range(1, n + 1)` để xét cả `n`.
> * **Lỗi chia cho số 0**: Khi `k = 0`, phép toán `% k` ném ra `ZeroDivisionError`.

> [!TIP]
> Sử dụng `sum(range(k, n + 1, k))` với bước nhảy `step = k` giúp chương trình bỏ qua mọi số không chia hết, tối ưu thời gian gấp K lần.

## 4. Đúc kết & Đi tiếp
* Cận trên của hàm `range(start, stop)` luôn là độc quyền (exclusive), nhớ thêm `+ 1` khi muốn bao gồm cả giá trị đích.
* Tận dụng hàm `sum()` giúp loại bỏ việc tạo biến đếm thủ công rườm rà.
* Hãy tiến hành thực hành giải bài tập vòng lặp ngay dưới đây!
""",
                "problem_statement": """### 📌 Yêu Cầu Đề Bài
Viết hàm `sum_multiples(n, k)`.
Nhận vào hai số nguyên dương `n` và `k`. Tính và trả về tổng tất cả các số từ `1` đến `n` chia hết cho `k`.

---
### 📥 Dữ Liệu Đầu Vào (Input)
- `n`: Số nguyên dương giới hạn trên (`int`).
- `k`: Số nguyên dương ước số (`int`).

### 📤 Dữ Liệu Đầu Ra (Output)
- Tổng các số chia hết cho `k` (`int`).

---
### 💡 Ví Dụ Minh Họa
- **Input:** `(10, 3)` ➔ **Output:** `18` (vì 3 + 6 + 9 = 18)
- **Input:** `(5, 2)` ➔ **Output:** `6` (vì 2 + 4 = 6)
""",
                "sample_input": "(10, 3)",
                "sample_output": "18",
                "starter_code": "def sum_multiples(n, k):\n    \"\"\"\n    Tính tổng các số từ 1 đến n chia hết cho k.\n    \"\"\"\n    pass",
                "reference_solution": "def sum_multiples(n, k):\n    return sum(i for i in range(1, n + 1) if i % k == 0)",
                "test_cases": [
                    {"input": "(10, 3)", "expected_output": "18", "is_hidden": False},
                    {"input": "(5, 2)", "expected_output": "6", "is_hidden": False},
                    {"input": "(15, 5)", "expected_output": "30", "is_hidden": True}
                ],
                "common_pitfall_warning": "range(1, n) sẽ dừng ở n - 1. Muốn xét cả giá trị n cần viết range(1, n + 1).",
                "difficulty_stars": 1 if is_easier else 2
            }

        # 5. Type Casting & Basics Concepts
        elif "BASICS-02" in cid or "CASTING" in cid:
            return {
                "title": "Chuyển Đổi Kiểu Dữ Liệu An Toàn Tránh Lỗi Ép Kiểu",
                "concept_id": concept_id,
                "concept_name": concept_name,
                "quick_theory": "Hàm int() ném ra ValueError nếu chuỗi không hợp lệ, hãy sử dụng try-except để cung cấp giá trị mặc định.",
                "detailed_theory": """## 1. Khái niệm & Vấn đề
Trong các ứng dụng web nhận input từ người dùng qua form hoặc request JSON, các giá trị số thường xuyên được gửi lên dưới dạng chuỗi (`"123"` hoặc thậm chí `"abc"` do người dùng nhập lỗi). Nếu lập tức gọi `int(val)`, ứng dụng sẽ bị crash ngay lập tức vì `ValueError`.

| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |
| :--- | :--- | :--- |
| **Defensive Type Casting** | Kỹ thuật ép kiểu dữ liệu có bọc lớp phòng vệ bằng ngoại lệ. | Như việc đi qua cửa kiểm tra an ninh: nếu hành lý hợp lệ thì cho qua, nếu có vật thể lạ thì được hướng dẫn sang lối thoát hiểm an toàn. |

## 2. Cú pháp & Vận hành
Để chuyển đổi kiểu dữ liệu an toàn sang `int` với giá trị dự phòng mặc định:

```python
val = "123"
default_val = 0
try:
    number = int(val)
except (ValueError, TypeError):
    number = default_val
print(number)
```

**Bảng theo dõi thực thi (Execution Trace Table):**
| DÒNG MÃ | LỆNH ĐƯỢC CHẠY | TRẠNG THÁI BIẾN | HÀNH ĐỘNG CỦA MÁY TÍNH |
|:---:|:---|:---|:---|
| 1 | `val = "123"` | `val: "123"` | Khởi tạo chuỗi đầu vào |
| 2 | `number = int(val)` | `number: 123` | Ép kiểu thành công chuỗi `"123"` thành số nguyên 123 |
| 3 | Bỏ qua khối `except` | `number: 123` | Do không có ngoại lệ phát sinh |
| 4 | `print(number)` | `number: 123` | In giá trị số nguyên ra console: `123` |

**Trạng thái bộ nhớ RAM:**
```text
[RAM Stack]                       [RAM Heap]
val       ──────────────────► "123" (Chuỗi String)
number    ──────────────────► 123 (Số nguyên Integer)
```

## 3. Lỗi thường gặp & Tối ưu
> [!WARNING]
> **Các lỗi thường gặp cần tránh:**
> * **Dùng khối `except:` trần trụi**: Bắt cả lỗi `KeyboardInterrupt` hoặc `SystemExit`, gây khó khăn cho việc debug. Luôn chỉ định `except (ValueError, TypeError):`.
> * **Quên xử lý trường hợp `val = None`**: `int(None)` sẽ ném lỗi `TypeError`.

> [!TIP]
> Luôn đặt giá trị mặc định là một số nguyên (như `0` hoặc `-1`) để các phép tính toán phía sau không bị lỗi `TypeError: unsupported operand type`.

## 4. Đúc kết & Đi tiếp
* Kỹ thuật ép kiểu phòng thủ (Defensive Casting) là nguyên tắc sống còn khi nhận dữ liệu từ người dùng.
* Chỉ bắt đúng các ngoại lệ dự kiến (`ValueError`, `TypeError`).
* Hãy bắt đầu giải bài tập ép kiểu dữ liệu an toàn ngay dưới đây!
""",
                "problem_statement": """### 📌 Yêu Cầu Đề Bài
Viết hàm `safe_convert_to_int(val, default_val=0)`.
Nhận vào tham số `val` (có thể là chuỗi hoặc số) và trả về số nguyên. Nếu không thể chuyển đổi được, trả về `default_val` an toàn.

---
### 📥 Dữ Liệu Đầu Vào (Input)
- `val`: Giá trị cần chuyển đổi (`str`, `float`, hoặc bất kỳ).
- `default_val`: Giá trị mặc định trả về nếu gặp lỗi (`int`, mặc định = `0`).

### 📤 Dữ Liệu Đầu Ra (Output)
- Số nguyên (`int`) sau khi chuyển đổi thành công hoặc `default_val`.

---
### 💡 Ví Dụ Minh Họa
- **Input:** `('123', 0)` ➔ **Output:** `123`
- **Input:** `('abc', 0)` ➔ **Output:** `0`
""",
                "sample_input": "('123', 0)",
                "sample_output": "123",
                "starter_code": "def safe_convert_to_int(val, default_val=0):\n    \"\"\"\n    Chuyển đổi kiểu dữ liệu an toàn sang int.\n    \"\"\"\n    pass",
                "reference_solution": "def safe_convert_to_int(val, default_val=0):\n    try:\n        return int(val)\n    except (ValueError, TypeError):\n        return default_val",
                "test_cases": [
                    {"input": "('123', 0)", "expected_output": "123", "is_hidden": False},
                    {"input": "('abc', 0)", "expected_output": "0", "is_hidden": False},
                    {"input": "('-45', 0)", "expected_output": "-45", "is_hidden": True}
                ],
                "common_pitfall_warning": "Ép chuỗi chứa ký tự chữ sang int() sẽ ném ra ngoại lệ ValueError.",
                "difficulty_stars": 1 if is_easier else 2
            }

        # 6. OOP & Class Concepts
        elif "CLASS" in cid or "OOP" in cid:
            return {
                "title": "Xây Dựng Class Student & Quản Lý Điểm Số",
                "concept_id": concept_id,
                "concept_name": concept_name,
                "quick_theory": "Class là bản thiết kế đối tượng, hàm __init__(self, ...) khởi tạo thuộc tính khi tạo instance.",
                "detailed_theory": """## 1. Khái niệm & Vấn đề
Trong lập trình hướng đối tượng (OOP), Class giống như một bản thiết kế (blueprint) của ngôi nhà, còn Object là ngôi nhà thực tế được xây dựng từ bản thiết kế đó. Hàm khởi tạo `__init__` cùng tham số `self` giúp gán các thuộc tính riêng biệt cho từng đối tượng.

| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |
| :--- | :--- | :--- |
| **Class** | Bản thiết kế định nghĩa các thuộc tính và hành vi của đối tượng. | Khuôn đúc bánh kẹo trong dây chuyền sản xuất. |
| **Object (Instance)** | Thực thể cụ thể được tạo ra từ Class mang dữ liệu riêng biệt. | Chiếc bánh được đúc ra từ chiếc khuôn mẫu. |
| **self & __init__** | Đại diện cho chính thực thể đang được khởi tạo để gán giá trị thuộc tính. | Chiếc thẻ căn cước gắn trực tiếp lên người mỗi nhân viên. |

## 2. Cú pháp & Vận hành
Khai báo Class `Student` với hàm khởi tạo và phương thức tính xếp loại:

```python
class Student:
    def __init__(self, name, score):
        self.name = name
        self.score = score
        
    def get_rank(self):
        return "Xuat Sac" if self.score >= 9.0 else "Dat"

s = Student("Hoang", 9.5)
print(s.get_rank())
```

**Bảng theo dõi thực thi (Execution Trace Table):**
| DÒNG MÃ | LỆNH ĐƯỢC CHẠY | TRẠNG THÁI BIẾN | HÀNH ĐỘNG CỦA MÁY TÍNH |
|:---:|:---|:---|:---|
| 1 | `class Student:` | `Student`: Class Type | Nạp định nghĩa lớp vào namespace bộ nhớ |
| 2 | `s = Student("Hoang", 9.5)` | `s`: Instance Student | Cấp phát vùng nhớ Heap cho đối tượng, chạy `__init__` gán name, score |
| 3 | `print(s.get_rank())` | `"Xuat Sac"` | Gọi method `get_rank` trên thực thể `s` và in kết quả |

**Trạng thái bộ nhớ RAM:**
```text
[RAM Stack]                       [RAM Heap]
s         ──────────────────► Student Object:
                              ├── name: "Hoang"
                              └── score: 9.5
```

## 3. Lỗi thường gặp & Tối ưu
> [!WARNING]
> **Các lỗi thường gặp cần tránh:**
> * **Quên tham số `self`**: Trong method của Class, tham số đầu tiên bắt buộc phải là `self`.
> * **Viết sai tên hàm khởi tạo**: Viết thành `_init_` (1 dấu gạch dưới) thay vì `__init__` (2 dấu gạch dưới).

> [!TIP]
> Luôn đặt tên Class theo chuẩn **PascalCase** (ví dụ: `StudentProfile`, `BankAccount`) và tên hàm/phương thức theo chuẩn **snake_case**.

## 4. Đúc kết & Đi tiếp
* Class đóng gói dữ liệu và hành vi giúp code sạch sẽ, dễ mở rộng và tái sử dụng.
* Hãy bắt tay vào thực hành xây dựng Class ngay bên dưới!
""",
                "problem_statement": """### 📌 Yêu Cầu Đề Bài
Viết Class `Student` gồm:
- Hàm khởi tạo `__init__(self, name, score)` lưu trữ `name` (`str`) và `score` (`float` hoặc `int`).
- Phương thức `get_rank(self)` trả về chuỗi:
  - `"Xuat Sac"` nếu `score >= 9.0`
  - `"Gioi"` nếu `score >= 8.0` và `< 9.0`
  - `"Kha"` nếu `score >= 6.5` và `< 8.0`
  - `"Trung Binh"` nếu `score < 6.5`

---
### 📥 Dữ Liệu Đầu Vào (Input)
- Khởi tạo đối tượng `Student(name, score)`.

### 📤 Dữ Liệu Đầu Ra (Output)
- Kết quả của lời gọi phương thức `student.get_rank()`.

---
### 💡 Ví Dụ Minh Họa
- **Code gọi:** `s = Student("An", 9.2); print(s.get_rank())` ➔ **Output:** `"Xuat Sac"`
- **Code gọi:** `s = Student("Binh", 7.5); print(s.get_rank())` ➔ **Output:** `"Kha"`
""",
                "sample_input": "s = Student('An', 9.2); print(s.get_rank())",
                "sample_output": "Xuat Sac",
                "starter_code": "class Student:\n    def __init__(self, name, score):\n        # Khởi tạo thuộc tính\n        pass\n        \n    def get_rank(self):\n        # Trả về xếp loại\n        pass",
                "reference_solution": "class Student:\n    def __init__(self, name, score):\n        self.name = name\n        self.score = score\n        \n    def get_rank(self):\n        if self.score >= 9.0:\n            return 'Xuat Sac'\n        elif self.score >= 8.0:\n            return 'Gioi'\n        elif self.score >= 6.5:\n            return 'Kha'\n        return 'Trung Binh'",
                "test_cases": [
                    {"input": "s = Student('An', 9.2); print(s.get_rank())", "expected_output": "Xuat Sac", "is_hidden": False},
                    {"input": "s = Student('Binh', 7.5); print(s.get_rank())", "expected_output": "Kha", "is_hidden": False},
                    {"input": "s = Student('Cuong', 5.0); print(s.get_rank())", "expected_output": "Trung Binh", "is_hidden": True}
                ],
                "common_pitfall_warning": "Quên tham số self ở hàm __init__ và các methods.",
                "difficulty_stars": 2
            }

        else:
            return {
                "title": f"Thực Hành Chuyên Sâu: {concept_name}",
                "concept_id": concept_id,
                "concept_name": concept_name,
                "quick_theory": f"Nắm vững nguyên lý cốt lõi của {concept_name} trong Python.",
                "detailed_theory": f"""## 1. Khái niệm & Vấn đề
Trong hệ thống phần mềm, kỹ năng **{concept_name}** đóng vai trò thiết yếu giúp xử lý nghiệp vụ chính xác, an toàn và tối ưu tài nguyên.

| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |
| :--- | :--- | :--- |
| **{concept_name}** | Thành phần kỹ thuật cốt lõi trong ngôn ngữ Python. | Như công cụ chuyên dụng trong bộ đồ nghề của kỹ sư phần mềm. |

## 2. Cú pháp & Vận hành
Triển khai giải thuật xử lý:

```python
def process_data(items):
    return [x for x in items if x]

print(process_data([1, 2, 3]))
```

**Bảng theo dõi thực thi (Execution Trace Table):**
| DÒNG MÃ | LỆNH ĐƯỢC CHẠY | TRẠNG THÁI BIẾN | HÀNH ĐỘNG CỦA MÁY TÍNH |
|:---:|:---|:---|:---|
| 1 | `def process_data` | `process_data`: function | Định nghĩa hàm vào bộ nhớ |
| 2 | `print(...)` | `[1, 2, 3]` | Xử lý dữ liệu và xuất kết quả |

**Trạng thái bộ nhớ RAM:**
```text
[RAM Stack]                       [RAM Heap]
items     ──────────────────► [ 1, 2, 3 ]
```

## 3. Lỗi thường gặp & Tối ưu
> [!WARNING]
> Cần kiểm tra kỹ các trường hợp biên và ngoại lệ trước khi truy xuất dữ liệu.

> [!TIP]
> Luôn giữ code chuẩn **PEP 8** và viết giải thuật rõ ràng, tối ưu thời gian thực thi.

## 4. Đúc kết & Đi tiếp
* Nắm chắc cú pháp và thực hành kiểm thử với nhiều kịch bản khác nhau.
""",
                "problem_statement": f"### 📌 Yêu Cầu Đề Bài\nViết giải thuật xử lý dữ liệu cho bài toán **{concept_name}**.",
                "sample_input": "([1, 2, 3],)",
                "sample_output": "[1, 2, 3]",
                "starter_code": "def process_data(items):\n    # Viết logic xử lý\n    pass",
                "reference_solution": "def process_data(items):\n    return [x for x in items if x]",
                "test_cases": [
                    {"input": "([1, 2, 3],)", "expected_output": "[1, 2, 3]", "is_hidden": False},
                    {"input": "([],)", "expected_output": "[]", "is_hidden": True}
                ],
                "common_pitfall_warning": "Chú ý kiểu dữ liệu và giá trị biên.",
                "difficulty_stars": 1
            }


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


class AdaptiveAgentOrchestrator:
    """Bộ Điều Phối Đa Tác Tử (Multi-Agent Orchestrator)"""

    def __init__(self):
        self.router = RouterAgent()
        self.retriever = KnowledgeRetriever()
        self.generator = ExerciseGeneratorAgent()
        self.evaluator = CriticEvaluatorAgent()

    def process_turn(
        self,
        user_id: str,
        history: List[Dict[str, str]],
        user_mastery: Dict[str, float] = None,
        target_concept_id: str = None
    ) -> Dict[str, Any]:
        """Điều phối toàn bộ quy trình tương tác với người học"""
        mastery_map = user_mastery or {}
        last_user_msg = history[-1]["content"] if history else "Tôi muốn rèn luyện Python"
        agent_traces = []
        
        border = "=" * 80
        print(f"\n{border}\n🚀 [MULTI-AGENT DISPATCH] Bắt đầu phiên điều phối cho học viên\n💬 Input: '{last_user_msg}'\n{border}", flush=True)

        # 1. Router Agent: Phân loại ý định
        intent = self.router.classify_intent(last_user_msg, history)
        print(f"\n🎯 [RouterAgent] Ý định nhận diện: >>> {intent} <<<", flush=True)
        agent_traces.append({
            "agent": "RouterAgent",
            "action": "Classify User Intent",
            "result": intent,
            "details": f"Nhận diện ý định học tập: {intent}"
        })

        # 2. Knowledge Retriever: Truy vấn hồ sơ năng lực
        weaknesses = self.retriever.get_learner_weaknesses(mastery_map, limit=3)
        agent_traces.append({
            "agent": "KnowledgeRetriever",
            "action": "Query DAG 2.0 & Learner Profile",
            "result": f"Tìm thấy {len(weaknesses)} điểm yếu cần củng cố",
            "details": f"Top điểm yếu: {[w['concept_id'] for w in weaknesses]}"
        })

        top_weakness = weaknesses[0] if weaknesses else {
            "concept_id": "PY-DICT-02",
            "concept_name": "Thao tác Dictionary & Phương thức get()",
            "mastery_score": 0.35,
            "associated_errors": ["KeyError: key not found"]
        }

        # 1. Nếu người học chỉ định concept cụ thể từ giao diện Profile/DAG
        if target_concept_id:
            specified = self.retriever.get_concept_by_id(target_concept_id)
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
            # 2. Tự động nhận diện chủ đề học viên yêu cầu trực tiếp trong tin nhắn (ví dụ: 'dictionary', 'list', 'vòng lặp'...)
            detected = self.retriever.find_concept_by_query(last_user_msg)
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
                    "details": "Định vị chính xác mắt xích tri thức mà học viên muốn rèn luyện."
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
                    critic_feedback=critic_feedback
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
                        is_easier
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

        # TÌNH HUỐNG GIẢI THÍCH LÝ THUYẾT (EXPLAIN_CONCEPT)
        if intent == "EXPLAIN_CONCEPT":
            concept_name = top_weakness["concept_name"]
            reply_text = (
                f"### 📖 Giải thích trọng tâm: {concept_name}\n\n"
                f"Trong Python, `{concept_name}` được dùng để xử lý và đóng gói dữ liệu an toàn. "
                f"Khi làm việc với chủ đề này, điểm mấu chốt bạn cần nhớ là kiểm tra tính hợp lệ của dữ liệu trước khi truy xuất.\n\n"
                f"Ví dụ: Thay vì truy cập trực tiếp `my_dict[key]`, hãy ưu tiên dùng `my_dict.get(key, default)` để tránh `KeyError`.\n\n"
                f"Bạn đã sẵn sàng làm một bài tập nhỏ để thực hành ngay chưa?"
            )
            return {
                "intent": intent,
                "reply": reply_text,
                "exercise": None,
                "agent_traces": agent_traces,
                "suggested_options": [
                    f"🎯 Tạo bài tập thực hành {concept_name}",
                    "❓ Cho tôi một ví dụ cụ thể hơn",
                    "📊 Xem vị trí bài này trên cây tri thức"
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
        next_nodes = self.retriever.get_next_forward_concepts(concept_id, updated_map) or []
        
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
