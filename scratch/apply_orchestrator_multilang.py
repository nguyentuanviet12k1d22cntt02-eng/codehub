import sys
import os
import re

APP_FILE = r"d:\Project\LearnPython\ai-service\app\agents\adaptive_agent_orchestrator.py"
CORE_FILE = r"d:\Project\LearnPython\ai-service\core\adaptive_agent_orchestrator.py"

with open(APP_FILE, "r", encoding="utf-8") as f:
    content = f.read()

# 1. KnowledgeRetriever
old_kr = """class KnowledgeRetriever:
    \"\"\"Truy xuất tri thức người học dựa trên Đồ thị DAG 2.0 (33 Concepts) & PAL-Net\"\"\"
    
    def __init__(self):
        self.skill_graph = self._load_skill_graph()

    def _load_skill_graph(self) -> Dict[str, Any]:"""

new_kr = """class KnowledgeRetriever:
    \"\"\"Truy xuất tri thức người học đa ngôn ngữ dựa trên Đồ thị DAG & PAL-Net\"\"\"
    
    def __init__(self):
        self.graphs = self._load_all_graphs()
        self.skill_graph = self.graphs.get("PYTHON", {"skills": [], "edges": []})

    def _load_all_graphs(self) -> Dict[str, Any]:
        base_ai_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        data_dir = os.path.join(base_ai_dir, "data")
        graphs = {}
        file_map = [
            ("PYTHON", "pythonSkillGraph.json"),
            ("CPP", "cppSkillGraph.json"),
            ("JAVASCRIPT", "javascriptSkillGraph.json"),
            ("SQL", "sqlSkillGraph.json")
        ]
        for lang, fname in file_map:
            p = os.path.join(data_dir, fname)
            if not os.path.exists(p) and lang == "PYTHON":
                p = os.path.join(data_dir, "skill_graph.json")
            if os.path.exists(p):
                try:
                    with open(p, "r", encoding="utf-8") as f:
                        graphs[lang] = json.load(f)
                except Exception as e:
                    print(f"[KnowledgeRetriever Error]: Không thể tải {fname}: {e}")
        if "PYTHON" not in graphs:
            graphs["PYTHON"] = {"skills": [], "edges": []}
        return graphs

    def get_skill_graph(self, language: str = "PYTHON") -> Dict[str, Any]:
        l = (language or "PYTHON").upper()
        if l in ["JS", "JAVASCRIPT"]:
            return self.graphs.get("JAVASCRIPT", self.skill_graph)
        elif l in ["CPP", "C++"]:
            return self.graphs.get("CPP", self.skill_graph)
        elif l in ["SQL"]:
            return self.graphs.get("SQL", self.skill_graph)
        return self.graphs.get("PYTHON", self.skill_graph)

    def _load_skill_graph(self) -> Dict[str, Any]:"""

assert old_kr in content, "old_kr not found"
content = content.replace(old_kr, new_kr, 1)

# 2. get_learner_weaknesses
old_gw = """    def get_learner_weaknesses(self, masteries: Dict[str, float], limit: int = 3) -> List[Dict[str, Any]]:
        \"\"\"Lọc ra các concept điểm yếu nhất (Mastery < 0.50) và nằm trong vùng ZPD\"\"\"
        skills = self.skill_graph.get("skills", [])"""

new_gw = """    def get_learner_weaknesses(self, masteries: Dict[str, float], limit: int = 3, language: str = "PYTHON") -> List[Dict[str, Any]]:
        \"\"\"Lọc ra các concept điểm yếu nhất (Mastery < 0.50) và nằm trong vùng ZPD theo ngôn ngữ\"\"\"
        graph = self.get_skill_graph(language)
        skills = graph.get("skills", [])
        if not skills:
            skills = self.skill_graph.get("skills", [])"""

assert old_gw in content, "old_gw not found"
content = content.replace(old_gw, new_gw, 1)

# 3. get_concept_by_id
old_gc = """    def get_concept_by_id(self, concept_id: str) -> Optional[Dict[str, Any]]:
        \"\"\"Lấy thông tin chi tiết một concept\"\"\"
        for s in self.skill_graph.get("skills", []):
            if s["id"] == concept_id:
                return s
        return None"""

new_gc = """    def get_concept_by_id(self, concept_id: str, language: str = None) -> Optional[Dict[str, Any]]:
        \"\"\"Lấy thông tin chi tiết một concept theo ngôn ngữ hoặc trên tất cả các graph\"\"\"
        if language:
            g = self.get_skill_graph(language)
            for s in g.get("skills", []):
                if s.get("id") == concept_id:
                    return s
        for g in self.graphs.values():
            for s in g.get("skills", []):
                if s.get("id") == concept_id:
                    return s
        return None"""

assert old_gc in content, "old_gc not found"
content = content.replace(old_gc, new_gc, 1)

# 4. find_concept_by_query
old_fc_start = "    def find_concept_by_query(self, query: str) -> Optional[Dict[str, Any]]:"
old_fc_end = "        return None\n\n\nclass RouterAgent:"

fc_idx1 = content.find(old_fc_start)
fc_idx2 = content.find(old_fc_end, fc_idx1)
assert fc_idx1 != -1 and fc_idx2 != -1, "find_concept_by_query bounds not found"

new_fc = """    def find_concept_by_query(self, query: str, language: str = "PYTHON") -> Optional[Dict[str, Any]]:
        \"\"\"Nhận diện concept trên DAG từ nội dung câu hỏi/yêu cầu của người học theo ngôn ngữ\"\"\"
        q = query.lower()
        lang = (language or "PYTHON").upper()
        graph = self.get_skill_graph(lang)
        skills = graph.get("skills", [])

        # 1. Tra cứu từ khóa chuyên biệt theo từng ngôn ngữ
        if lang in ["CPP", "C++"]:
            cpp_mappings = [
                # OOP / OPP trong C++ (Bắt cả lỗi gõ nhầm OPP và OOP)
                (r'\\b(opp|oop|hướng đối tượng|class|lớp|đối tượng|kế thừa|đa hình|đóng gói|trừu tượng|virtual|override|constructor|destructor|encapsulation|polymorphism|inheritance)\\b', {
                    "id": "CPP-OOP-01",
                    "concept_id": "CPP-OOP-01",
                    "name": "Lập trình Hướng đối tượng (OOP) trong C++",
                    "concept_name": "Lập trình Hướng đối tượng (OOP) trong C++",
                    "domain_id": "CPP",
                    "module_id": "MOD-CPP-RECORDS",
                    "stage": 3,
                    "tier": 3,
                    "associated_errors": ["Object Slicing", "Missing Virtual Destructor", "Segmentation Fault", "Access Violation"],
                    "difficulty_level": 3,
                    "prerequisites": ["CPP-STRUCT-01", "CPP-PTR-01"]
                }),
                (r'\\b(smart pointer|unique_ptr|shared_ptr|weak_ptr|raii)\\b', 'CPP-SMARTPTR-01'),
                (r'\\b(pointer|con trỏ|địa chỉ|toán tử trỏ|\\*ptr|&var)\\b', 'CPP-PTR-01'),
                (r'\\b(bộ nhớ|stack|heap|phân vùng bộ nhớ|new|delete)\\b', 'CPP-MEM-01'),
                (r'\\b(struct|cấu trúc|memory layout|padding|alignment)\\b', 'CPP-STRUCT-01'),
                (r'\\b(vector|std::vector|mảng động)\\b', 'CPP-VECTOR-01'),
                (r'\\b(string|chuỗi|std::string)\\b', 'CPP-STRING-01'),
                (r'\\b(ma trận|mảng 2d|2d array|ma trận 2 chiều)\\b', 'CPP-MATRIX-01'),
                (r'\\b(mảng|array|mảng tĩnh)\\b', 'CPP-ARRAY-01'),
                (r'\\b(đệ quy|recursion|ngăn xếp gọi|call stack)\\b', 'CPP-RECUR-01'),
                (r'\\b(quay lui|backtrack|n quân hậu|tổ hợp)\\b', 'CPP-BACKTRACK-01'),
                (r'\\b(file|tệp|đọc file|ghi file|binary file|ifstream|ofstream)\\b', 'CPP-FILE-01'),
                (r'\\b(ngoại lệ|exception|try|catch|throw|std::exception)\\b', 'CPP-EXC-01'),
                (r'\\b(biên dịch|build|header|include|đa tệp|multi-file)\\b', 'CPP-BUILD-01'),
                (r'\\b(cache|tối ưu|bộ nhớ đệm|cache locality)\\b', 'CPP-CACHE-01'),
                (r'\\b(hàm|function|nạp chồng|overload|tham chiếu|reference)\\b', 'CPP-FUNC-01'),
                (r'\\b(vòng lặp|loop|for|while|do while)\\b', 'CPP-LOOP-01'),
                (r'\\b(rẽ nhánh|if|else|switch|điều kiện)\\b', 'CPP-COND-01'),
                (r'\\b(kiểu dữ liệu|ép kiểu|static_cast|primitive)\\b', 'CPP-TYPE-01'),
                (r'\\b(nhập xuất|cin|cout|iostream|cú pháp)\\b', 'CPP-SYNTAX-01'),
            ]
            for pattern, target in cpp_mappings:
                if re.search(pattern, q):
                    if isinstance(target, dict):
                        return target
                    concept = self.get_concept_by_id(target, language="CPP")
                    if concept:
                        return concept

        elif lang in ["JS", "JAVASCRIPT"]:
            js_mappings = [
                (r'\\b(opp|oop|class|lớp|prototype|kế thừa|constructor|this)\\b', 'JS-CLASS-01'),
                (r'\\b(object|đối tượng|key-value|phương thức object)\\b', 'JS-OBJECT-01'),
                (r'\\b(promise|async|await|bất đồng bộ|asynchronous)\\b', 'JS-ASYNC-01'),
                (r'\\b(closure|lexical scope|bao đóng)\\b', 'JS-CLOSURE-01'),
                (r'\\b(event loop|microtask|macrotask|hàng đợi sự kiện)\\b', 'JS-EVENTLOOP-01'),
                (r'\\b(mảng|array|map|filter|reduce|forEach)\\b', 'JS-ARRAY-01'),
                (r'\\b(hàm|function|arrow function|callback)\\b', 'JS-FUNC-01'),
                (r'\\b(biến|var|let|const|hoisting|scope)\\b', 'JS-VAR-01'),
                (r'\\b(kiểu dữ liệu|type|typeof|primitive|truthy|falsy)\\b', 'JS-TYPE-01'),
                (r'\\b(toán tử|operator|so sánh|strict equality|===)\\b', 'JS-OP-01'),
                (r'\\b(rẽ nhánh|if|else|switch|ternary)\\b', 'JS-COND-01'),
                (r'\\b(vòng lặp|loop|for|while|for of|for in)\\b', 'JS-LOOP-01'),
                (r'\\b(destructuring|spread|rest|toán tử rải)\\b', 'JS-ES6-01'),
                (r'\\b(module|import|export|commonjs|esmodule)\\b', 'JS-MODULE-01'),
                (r'\\b(lỗi|error|try|catch|finally|throw)\\b', 'JS-ERROR-01'),
            ]
            for pattern, target in js_mappings:
                if re.search(pattern, q):
                    concept = self.get_concept_by_id(target, language="JAVASCRIPT")
                    if concept:
                        return concept

        else: # PYTHON
            keyword_mappings = [
                # Dictionary
                (r'\\b(dict|dictionary|từ điển|key[-_ ]?value|keyerror)\\b', 'PY-DICT-02'),
                # List
                (r'\\b(list comprehension|tạo danh sách nhanh)\\b', 'PY-LIST-03'),
                (r'\\b(list|danh sách|mảng|append|pop)\\b', 'PY-LIST-01'),
                # Tuple
                (r'\\b(tuple|bộ dữ liệu|unpacking|bất biến)\\b', 'PY-TUPLE-01'),
                # Set
                (r'\\b(set|tập hợp|giao|hợp|unique|duy nhất)\\b', 'PY-SET-01'),
                # String
                (r'\\b(f[-_ ]?string|format chuỗi|định dạng chuỗi)\\b', 'PY-STRING-02'),
                (r'\\b(string|chuỗi|slicing|cắt chuỗi|indexerror)\\b', 'PY-STRING-01'),
                # Loop
                (r'\\b(break|continue|pass|điều hướng lặp)\\b', 'PY-FLOW-04'),
                (r'\\b(for|range|duyệt|vòng lặp for)\\b', 'PY-FLOW-03'),
                (r'\\b(while|vòng lặp while|vòng lặp vô tận)\\b', 'PY-FLOW-02'),
                (r'\\b(vòng lặp|loop)\\b', 'PY-FLOW-03'),
                # Condition
                (r'\\b(if|elif|else|điều kiện|rẽ nhánh)\\b', 'PY-FLOW-01'),
                # Function
                (r'\\b(lambda|hàm ẩn danh|map|filter)\\b', 'PY-FUNC-06'),
                (r'\\b(\\*args|\\*\\*kwargs|đối số biến đổi)\\b', 'PY-FUNC-05'),
                (r'\\b(hàm|function|def|return|tham số|đối số)\\b', 'PY-FUNC-01'),
                # Exception & File
                (r'\\b(file|tệp|with open|đọc file|ghi file)\\b', 'PY-IO-01'),
                (r'\\b(try|except|ngoại lệ|bắt lỗi|raise)\\b', 'PY-EXC-01'),
                # OOP (Bắt cả opp gõ nhầm)
                (r'\\b(kế thừa|inheritance|super)\\b', 'PY-OOP-03'),
                (r'\\b(opp|oop|hướng đối tượng|class|lớp|đối tượng|__init__|constructor)\\b', 'PY-OOP-01'),
                # Basics
                (r'\\b(ép kiểu|type casting|typeerror|valueerror)\\b', 'PY-BASICS-02'),
                (r'\\b(toán tử|boolean|logic|and|or|not)\\b', 'PY-BASICS-03'),
                (r'\\b(biến|đặt tên|kiểu dữ liệu|primitive)\\b', 'PY-BASICS-01'),
            ]
            for pattern, cid in keyword_mappings:
                if re.search(pattern, q):
                    concept = self.get_concept_by_id(cid, language="PYTHON")
                    if concept:
                        return concept

        # 2. Khớp trực tiếp theo tên concept trong đồ thị hiện hành
        for s in skills:
            c_name = s.get("concept_name", "").lower()
            if c_name and (c_name in q or any(word in q for word in c_name.split() if len(word) >= 5)):
                return s
                
        return None"""

content = content[:fc_idx1] + new_fc + content[fc_idx2 + len("        return None"):]

# 5. RouterAgent classify_intent
old_ra_start = "class RouterAgent:"
old_ra_end = "class ExerciseGeneratorAgent:"

ra_idx1 = content.find(old_ra_start)
ra_idx2 = content.find(old_ra_end, ra_idx1)
assert ra_idx1 != -1 and ra_idx2 != -1, "RouterAgent bounds not found"

new_ra = """class RouterAgent:
    \"\"\"Agent Phân loại & Định tuyến Ý định Người Học\"\"\"
    
    INTENTS = [
        "CHECK_WEAKNESS",           # Hỏi điểm yếu / nhờ chẩn đoán hồ sơ
        "REQUEST_ADAPTIVE_EXERCISE",# Yêu cầu bài tập thích ứng gỡ điểm
        "ADJUST_DIFFICULTY_EASIER", # Phản hồi bài tập khó, yêu cầu bài dễ hơn / scaffolding
        "EXPLAIN_CONCEPT",          # Nhờ giải thích sâu lý thuyết hoặc cú pháp
        "GENERAL_CHAT"              # Chào hỏi, trò chuyện xã giao
    ]

    def detect_language(self, user_msg: str) -> str:
        \"\"\"Nhận diện ngôn ngữ lập trình mục tiêu từ tin nhắn\"\"\"
        msg_lower = user_msg.lower()
        if re.search(r'(c\\+\\+|cpp|\\bc plus plus\\b|\\bc cộng cộng\\b|\\bc cong cong\\b|\\bmôn c\\+\\+\\b)', msg_lower):
            return "CPP"
        if re.search(r'\\b(javascript|js|node|nodejs|ecmascript)\\b', msg_lower):
            return "JAVASCRIPT"
        if re.search(r'\\b(sql|database|csdl|truy vấn|query)\\b', msg_lower):
            return "SQL"
        if re.search(r'\\b(python|py)\\b', msg_lower):
            return "PYTHON"
        return "PYTHON"

    def classify_intent(self, user_msg: str, history: List[Dict[str, str]]) -> str:
        msg_lower = user_msg.lower().strip()

        # 1. Regex Fast-Path cho các cụm từ phổ biến (Độ trễ <1ms)
        # 1.1 Yêu cầu giảm độ khó / lùi bước
        if re.search(r'\\b(khó quá|khó thế|không hiểu|đơn giản hơn|dễ hơn|bài dễ|lùi lại|chưa làm được|giảm độ khó)\\b', msg_lower):
            return "ADJUST_DIFFICULTY_EASIER"

        # 1.2 Yêu cầu bài giảng, nội dung bài học, lý thuyết, giải thích (Đặc biệt bắt "nội dung bài học")
        if re.search(r'\\b(nội dung bài học|bài học|bài giảng|giáo trình|lý thuyết|giải thích|nguyên lý|cú pháp|là gì|dạy tôi|hướng dẫn học)\\b', msg_lower):
            return "EXPLAIN_CONCEPT"

        # 1.3 Hỏi thăm dò điểm yếu / chẩn đoán hồ sơ
        if re.search(r'\\b(yếu phần nào|yếu gì|hổng phần nào|kém phần nào|điểm yếu|hồ sơ năng lực|độ thành thạo|cần cải thiện)\\b', msg_lower) or (
            re.search(r'\\b(đang yếu)\\b', msg_lower) and not re.search(r'\\b(tạo|cho bài|ra bài|luyện|bài tập)\\b', msg_lower)
        ):
            return "CHECK_WEAKNESS"

        # 1.4 Yêu cầu tạo bài tập / thực hành / ôn luyện / rèn luyện
        if re.search(r'\\b(tạo|cho bài|ra bài|luyện|ôn|thực hành|thử thách|gỡ điểm|làm bài|bài tập|rèn luyện|code thử|viết code|muốn học|luyện tập|bắt đầu học)\\b', msg_lower):
            return "REQUEST_ADAPTIVE_EXERCISE"

        # 1.5 Nếu có nhắc đến bất kỳ chủ đề kỹ thuật nào (dict, list, loop, hàm, oop, opp...) kèm câu hỏi
        if re.search(r'\\b(dictionary|dict|từ điển|list|danh sách|tuple|set|string|chuỗi|vòng lặp|loop|hàm|function|class|oop|opp|exception|file|ép kiểu|con trỏ|pointer|vector)\\b', msg_lower):
            if re.search(r'\\b(giải thích|là gì|cú pháp|nguyên lý|sao lại|tại sao|nguyên nhân)\\b', msg_lower):
                return "EXPLAIN_CONCEPT"
            return "REQUEST_ADAPTIVE_EXERCISE"

        # 1.6 Hỏi giải thích lý thuyết, cú pháp
        if re.search(r'\\b(giải thích|là gì|cú pháp|nguyên lý|ví dụ về|hoạt động như thế nào|hướng dẫn)\\b', msg_lower):
            return "EXPLAIN_CONCEPT"

        # 1.7 Chào hỏi xã giao
        if re.search(r'^\\s*(hello|hi|xin chào|chào|hé lô|alo|bạn là ai)\\b', msg_lower):
            return "GENERAL_CHAT"

        # 2. LLM Intent Classifier nếu câu hỏi phức tạp
        system_prompt = f\"\"\"
Bạn là Router Agent trong hệ thống AI Tutor Lập Trình Đa Ngôn Ngữ.
Nhiệm vụ: Phân loại ý định của người học vào 1 trong các INTENTS sau:
- CHECK_WEAKNESS (hỏi điểm yếu, muốn biết mình hổng phần nào)
- REQUEST_ADAPTIVE_EXERCISE (yêu cầu tạo bài tập, muốn rèn luyện)
- ADJUST_DIFFICULTY_EASIER (kêu bài khó, yêu cầu bài dễ hơn)
- EXPLAIN_CONCEPT (hỏi lý thuyết, cú pháp, giải thích khái niệm, yêu cầu nội dung bài học)
- GENERAL_CHAT (chào hỏi xã giao, lạc đề)

Trả về JSON duy nhất: {{"intent": "<INTENT>"}}
\"\"\"
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

"""

content = content[:ra_idx1] + new_ra + content[ra_idx2:]

# 6. ExerciseGeneratorAgent
old_gen_snippet = """    def generate_exercise(
        self,
        concept: Dict[str, Any],
        student_mastery: float,
        is_easier_request: bool = False,
        critic_feedback: str = ""
    ) -> Dict[str, Any]:
        \"\"\"Tạo bài tập thực hành thích ứng bám sát concept và lỗi thường gặp\"\"\"
        concept_id = concept.get("id") or concept.get("concept_id", "PY-GEN")
        concept_name = concept.get("concept_name", "Lập trình Python")
        associated_errors = concept.get("associated_errors", [])
        
        difficulty_label = "Cơ bản / Scaffolding" if is_easier_request else "Vừa sức (ZPD)"

        system_prompt = f\"\"\"
Bạn là Senior Python Pedagogical Architect & Exercise Generator Agent chuyên nghiệp."""

new_gen_snippet = """    def generate_exercise(
        self,
        concept: Dict[str, Any],
        student_mastery: float,
        is_easier_request: bool = False,
        critic_feedback: str = "",
        language: str = "PYTHON"
    ) -> Dict[str, Any]:
        \"\"\"Tạo bài tập thực hành thích ứng bám sát concept và lỗi thường gặp theo ngôn ngữ\"\"\"
        concept_id = concept.get("id") or concept.get("concept_id", "GEN")
        concept_name = concept.get("concept_name", "Lập trình")
        associated_errors = concept.get("associated_errors", [])
        lang = (language or "PYTHON").upper()
        
        difficulty_label = "Cơ bản / Scaffolding" if is_easier_request else "Vừa sức (ZPD)"

        system_prompt = f\"\"\"
Bạn là Senior {lang} Pedagogical Architect & Exercise Generator Agent chuyên nghiệp.
Nhiệm vụ: Thiết kế 1 bài tập lập trình {lang} THỰC CHIẾN, HẤP DẪN, GIÀU BỐI CẢNH DỰ ÁN THẬT dành riêng cho học viên.
Mã khung (starter_code) và reference_solution PHẢI VIẾT BẰNG NGÔN NGỮ {lang} CHUẨN MỰC."""

assert old_gen_snippet in content, "old_gen_snippet not found"
content = content.replace(old_gen_snippet, new_gen_snippet, 1)

old_gen_fb_call = """        # Fallback Template chuẩn nếu LLM gặp sự cố
        return self._get_fallback_exercise(concept_id, concept_name, associated_errors, is_easier_request)"""

new_gen_fb_call = """        # Fallback Template chuẩn nếu LLM gặp sự cố
        return self._get_fallback_exercise(concept_id, concept_name, associated_errors, is_easier_request, language=lang)"""

assert old_gen_fb_call in content, "old_gen_fb_call not found"
content = content.replace(old_gen_fb_call, new_gen_fb_call, 1)

old_fb_def = """    def _get_fallback_exercise(self, concept_id: str, concept_name: str, errors: List[str], is_easier: bool) -> Dict[str, Any]:
        \"\"\"Bài tập fallback đã được thẩm định trước 100% an toàn theo từng chủ đề\"\"\"
        cid = concept_id.upper()
        
        # 1. Dictionary Concepts"""

new_fb_def = """    def _get_fallback_exercise(self, concept_id: str, concept_name: str, errors: List[str], is_easier: bool, language: str = "PYTHON") -> Dict[str, Any]:
        \"\"\"Bài tập fallback đã được thẩm định trước 100% an toàn theo từng chủ đề\"\"\"
        cid = concept_id.upper()
        lang = (language or "PYTHON").upper()
        
        # 0. C++ Fallbacks
        if lang in ["CPP", "C++"] or cid.startswith("CPP"):
            return {
                "title": "Hệ Thống Quản Lý Tài Khoản Ngân Hàng (C++ Bank Account OOP)" if not is_easier else "Khởi Tạo Lớp Đối Tượng Cơ Bản C++",
                "concept_id": concept_id,
                "concept_name": concept_name,
                "quick_theory": "Sử dụng Class, Access Specifiers (public/private), Constructor để đóng gói dữ liệu an toàn trong C++.",
                "detailed_theory": \"\"\"## 1. Khái niệm & Vấn đề\\nLập trình hướng đối tượng (OOP) trong C++ giúp mô hình hóa thực thể với thuộc tính private và phương thức public.\\n\\n## 2. Cú pháp & Vận hành\\n```cpp\\nclass BankAccount {\\nprivate:\\n    double balance;\\npublic:\\n    BankAccount(double init) : balance(init) {}\\n    void deposit(double m) { balance += m; }\\n    double getBalance() const { return balance; }\\n};\\n```\\n\\n## 3. Lỗi thường gặp\\n> [!WARNING]\\n> Không để thuộc tính trạng thái ở phạm vi public!\\n\\n## 4. Đúc kết\\n* Luôn dùng constructor để khởi tạo giá trị ban đầu.\"\"\",
                "problem_statement": \"\"\"### 📌 Yêu Cầu Đề Bài\\nĐịnh nghĩa class `BankAccount` với thuộc tính private `balance` (số dư) và các phương thức `deposit(double amount)`, `withdraw(double amount)`, `getBalance()`.\\n\\n---\\n### 📥 Dữ Liệu Đầu Vào\\n- Lệnh thao tác nạp/rút tiền.\\n\\n### 📤 Dữ Liệu Đầu Ra\\n- Số dư tài khoản sau thao tác.\"\"\",
                "sample_input": "deposit 100, withdraw 30",
                "sample_output": "70",
                "starter_code": "#include <iostream>\\n#include <string>\\nusing namespace std;\\n\\nclass BankAccount {\\nprivate:\\n    double balance;\\npublic:\\n    BankAccount(double initialBalance = 0.0) : balance(initialBalance) {}\\n    \\n    void deposit(double amount) {\\n        // Viết mã nạp tiền\\n    }\\n    \\n    bool withdraw(double amount) {\\n        // Viết mã rút tiền\\n        return false;\\n    }\\n    \\n    double getBalance() const {\\n        return balance;\\n    }\\n};\\n",
                "reference_solution": "#include <iostream>\\nusing namespace std;\\nclass BankAccount {\\nprivate:\\n    double balance;\\npublic:\\n    BankAccount(double initialBalance = 0.0) : balance(initialBalance) {}\\n    void deposit(double amount) { balance += amount; }\\n    bool withdraw(double amount) { if(amount <= balance) { balance -= amount; return true; } return false; }\\n    double getBalance() const { return balance; }\\n};\\n",
                "test_cases": [
                    {"input": "100 deposit, 30 withdraw", "expected_output": "70", "is_hidden": False, "explanation": "Rút tiền hợp lệ"},
                    {"input": "50 deposit, 100 withdraw", "expected_output": "50", "is_hidden": True, "explanation": "Rút vượt số dư thất bại"}
                ],
                "common_pitfall_warning": "Không được để thuộc tính balance ở phạm vi public; luôn kiểm tra điều kiện rút tiền để tránh số dư âm.",
                "difficulty_stars": 1 if is_easier else 2
            }
        
        # 1. Dictionary Concepts"""

assert old_fb_def in content, "old_fb_def not found"
content = content.replace(old_fb_def, new_fb_def, 1)

# 7. AdaptiveAgentOrchestrator
old_orch_pt_start = "    def process_turn("
old_orch_pt_sig = """    def process_turn(
        self,
        user_id: str,
        history: List[Dict[str, str]],
        user_mastery: Dict[str, float] = None,
        target_concept_id: str = None
    ) -> Dict[str, Any]:"""

new_orch_pt = """    def _generate_concept_explanation(self, concept: Dict[str, Any], language: str, user_msg: str) -> str:
        \"\"\"Biên soạn bài giảng chi tiết, chuẩn sư phạm cho concept và ngôn ngữ được yêu cầu\"\"\"
        concept_name = concept.get("concept_name", "Khái niệm Lập trình")
        concept_id = concept.get("concept_id") or concept.get("id", "")
        lang = (language or "PYTHON").upper()
        
        # 1. Thử gọi LLM sinh bài giảng chất lượng cao
        system_prompt = f\"\"\"Bạn là Giáo sư Khoa học Máy tính & Giảng viên Cao cấp Lập trình {lang}.
Nhiệm vụ: Soạn một bài giảng lý thuyết chuẩn mực, trực quan, chuyên sâu nhưng dễ hiểu cho học viên về:
Chủ đề: {concept_name} (Mã: {concept_id})
Ngôn ngữ: {lang}

Yêu cầu định dạng Markdown gồm 5 phần chuẩn sư phạm:
## 1. 💡 Tổng Quan & Bản Chất Vấn Đề
- Đặt vấn đề trong thế giới thực và lý do tại sao phải dùng {concept_name}.
- Bảng phân tích thuật ngữ cốt lõi (Thuật ngữ | Định nghĩa | Ý nghĩa thực tế).

## 2. 🏛️ Các Đặc Tính / Nguyên Lý Cốt Lõi
- Phân tích chi tiết các nguyên lý nền tảng (ví dụ với OOP C++: Đóng gói Encapsulation, Kế thừa Inheritance, Đa hình Polymorphism, Trừu tượng Abstraction).

## 3. 💻 Cú Pháp & Ví Dụ Minh Họa Code Thực Chiến ({lang})
- Đoạn mã nguồn hoàn chỉnh, viết đẹp chuẩn {lang} hiện đại (có chú thích rõ ràng).
- Bảng giải thích chi tiết hoạt động của từng dòng lệnh quan trọng.

## 4. ⚠️ Bẫy Lỗi Thường Gặp & Lưu Ý Sống Còn
- Cảnh báo ít nhất 2 lỗi kinh điển khi lập trình {lang} với chủ đề này (ví dụ: memory leak, dangling pointer, undefined behavior...).

## 5. 🎯 Đúc Kết & Thử Thách Vận Dụng
- 3 gạch đầu dòng then chốt.
- 1 câu hỏi/thử thách nhỏ để học viên tự luyện tập.
\"\"\"
        try:
            raw = generate_json_content(f"Yêu cầu từ học viên: '{user_msg}'. Hãy biên soạn bài giảng chi tiết.", system_prompt)
            if raw and len(raw.strip()) > 200:
                return raw.strip()
        except Exception as e:
            print(f"[_generate_concept_explanation LLM Error]: {e}")

        # 2. Fallback chất lượng cao cho C++ OOP nếu LLM chưa phản hồi
        if lang in ["CPP", "C++"] and ("OOP" in concept_id or "STRUCT" in concept_id or "oop" in concept_name.lower()):
            return \"\"\"## 1. 💡 Tổng Quan & Bản Chất Vấn Đề
Trong kỹ nghệ phần mềm C++, **Lập trình Hướng Đối Tượng (Object-Oriented Programming - OOP)** là phương pháp luận mô hình hóa thế giới thực thành các **Đối tượng (Objects)** gồm hai thành phần cốt lõi:
- **Thuộc tính (State / Attributes):** Dữ liệu lưu trữ trạng thái của đối tượng.
- **Hành vi (Behavior / Methods):** Các hàm thao tác trên dữ liệu đó.

| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ thực tế |
| :--- | :--- | :--- |
| **Class (Lớp)** | Bản thiết kế (Blueprint) định nghĩa cấu trúc dữ liệu và hành vi. | Bản vẽ kỹ thuật của một chiếc ô tô. |
| **Object (Đối tượng)** | Thực thể cụ thể (Instance) được cấp phát bộ nhớ từ Class. | Chiếc xe hơi Toyota lăn bánh trên đường. |
| **Encapsulation** | Đóng gói dữ liệu và ẩn giấu chi tiết cài đặt qua `private`. | Vỏ động cơ xe hơi: người lái chỉ đạp ga chứ không sờ trực tiếp buồng đốt. |

---

## 2. 🏛️ 4 Trụ Cột Cốt Lõi Của OOP Trong C++
1. **Tính Đóng Gói (Encapsulation):** Bảo vệ dữ liệu bằng các phạm vi truy cập (`private`, `protected`, `public`), chỉ cho phép thay đổi qua Getter/Setter hợp lệ.
2. **Tính Trừu Tượng (Abstraction):** Ẩn giấu sự phức tạp của hệ thống, chỉ cung cấp giao diện (Interface / Pure Virtual Function `= 0`) cho bên ngoài.
3. **Tính Kế Thừa (Inheritance):** Tái sử dụng mã nguồn, cho phép lớp con kế thừa thuộc tính và phương thức của lớp cha (`class Car : public Vehicle`).
4. **Tính Đa Hình (Polymorphism):** Cùng một thông điệp (hàm) nhưng các đối tượng thuộc lớp khác nhau sẽ phản ứng khác nhau qua cơ chế `virtual` và `override`.

---

## 3. 💻 Cú Pháp & Code Minh Họa Thực Chiến (C++17/20)
```cpp
#include <iostream>
#include <string>
#include <memory>
#include <vector>

// 1. Base Class: Lớp trừu tượng (Interface)
class Employee {
private:
    std::string name;
    int id;

protected:
    double baseSalary;

public:
    Employee(std::string empName, int empId, double salary)
        : name(std::move(empName)), id(empId), baseSalary(salary) {}

    virtual ~Employee() = default; // QUAN TRỌNG: Virtual Destructor chống Memory Leak

    // Pure Virtual Function -> Tính Trừu tượng & Đa hình
    virtual double calculateBonus() const = 0;

    void displayInfo() const {
        std::cout << "[" << id << "] " << name << " - Luong CB: " << baseSalary << " USD\\n";
    }
};

// 2. Derived Class: Lớp con kế thừa
class SoftwareEngineer : public Employee {
private:
    int bugsFixed;

public:
    SoftwareEngineer(std::string name, int id, double salary, int bugs)
        : Employee(std::move(name), id, salary), bugsFixed(bugs) {}

    // Ghi đè phương thức đa hình với override
    double calculateBonus() const override {
        return baseSalary * 0.15 + (bugsFixed * 10.0);
    }
};

int main() {
    // Sử dụng Smart Pointer std::unique_ptr (RAII) để quản lý bộ nhớ an toàn
    std::vector<std::unique_ptr<Employee>> team;
    team.push_back(std::make_unique<SoftwareEngineer>("Nguyen Van A", 101, 2000.0, 45));

    for (const auto& member : team) {
        member->displayInfo();
        std::cout << "=> Thuong cuoi nam: " << member->calculateBonus() << " USD\\n";
    }

    return 0;
}
```

---

## 4. ⚠️ Bẫy Lỗi Thường Gặp Trong C++ OOP
> [!WARNING]
> **1. Quên khai báo Virtual Destructor (`virtual ~Base()`)**:
> Khi xóa đối tượng lớp con thông qua con trỏ lớp cha (`delete basePtr`), nếu destructor không phải là `virtual`, destructor của lớp con sẽ KHÔNG được gọi ➔ Gây rò rỉ bộ nhớ nghiêm trọng (Memory Leak)!

> [!WARNING]
> **2. Hiện tượng Cắt gọt Đối tượng (Object Slicing)**:
> Xảy ra khi truyền đối tượng bằng giá trị (Pass-by-value) thay vì truyền bằng tham chiếu (`const Base&`) hoặc con trỏ (`Base*`). Phần dữ liệu riêng của lớp con sẽ bị "cắt gọt" hoàn toàn, làm mất tính đa hình.

---

## 5. 🎯 Đúc Kết & Thử Thách Vận Dụng
* **Quy tắc vàng:** Luôn dùng `virtual` cho Destructor của Base Class và dùng từ khóa `override` ở Derived Class để trình biên dịch phát hiện lỗi sai chữ ký hàm.
* **Thử thách nhỏ:** Hãy thử tạo thêm lớp `ProjectManager` kế thừa từ `Employee` với công thức thưởng là `baseSalary * 0.20 + projectsCompleted * 100.0`.\"\"\"

        # Fallback chung
        return f\"\"\"### 📖 Nội Dung Bài Học: {concept_name} ({lang})

Chào bạn! Khái niệm `{concept_name}` là một trong những mắt xích then chốt trong chương trình lập trình {lang}.

#### 1. Trọng tâm kiến thức:
- Hiểu rõ cú pháp, cách thức khai báo và tổ chức mã nguồn chuẩn của {lang}.
- Tối ưu hóa cách cấp phát bộ nhớ và luồng thực thi.
- Phòng tránh các bẫy lỗi biên dịch và lỗi thời gian chạy (Runtime Error).

Bạn muốn mình tạo một bài tập thực hành thích ứng về `{concept_name}` để bạn bắt tay vào gõ code ngay không?\"\"\"

    def process_turn(
        self,
        user_id: str,
        history: List[Dict[str, str]],
        user_mastery: Dict[str, float] = None,
        target_concept_id: str = None,
        language: str = None
    ) -> Dict[str, Any]:
        \"\"\"Điều phối toàn bộ quy trình tương tác với người học đa ngôn ngữ\"\"\"
        mastery_map = user_mastery or {}
        last_user_msg = history[-1]["content"] if history else "Tôi muốn rèn luyện lập trình"
        agent_traces = []
        
        # Nhận diện ngôn ngữ lập trình mục tiêu
        detected_lang = language or self.router.detect_language(last_user_msg)
        
        border = "=" * 80
        print(f"\\n{border}\\n🚀 [MULTI-AGENT DISPATCH] Bắt đầu phiên điều phối cho học viên (Ngôn ngữ: {detected_lang})\\n💬 Input: '{last_user_msg}'\\n{border}", flush=True)

        # 1. Router Agent: Phân loại ý định
        intent = self.router.classify_intent(last_user_msg, history)
        print(f"\\n🎯 [RouterAgent] Ý định nhận diện: >>> {intent} <<< | Ngôn ngữ: {detected_lang}", flush=True)
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
                })"""

old_block_end = """                agent_traces.append({
                    "agent": "KnowledgeRetriever",
                    "action": "Match Concept From Query",
                    "result": f"Khớp chủ đề: {top_weakness['concept_name']} ({top_weakness['concept_id']})",
                    "details": "Định vị chính xác mắt xích tri thức mà học viên muốn rèn luyện."
                })"""

pt_idx1 = content.find(old_orch_pt_sig)
pt_idx2 = content.find(old_block_end, pt_idx1)
assert pt_idx1 != -1 and pt_idx2 != -1, "process_turn block bounds not found"
content = content[:pt_idx1] + new_orch_pt + content[pt_idx2 + len(old_block_end):]

# 8. Update generator call inside process_turn
old_call_gen = """                draft = self.generator.generate_exercise(
                    concept=top_weakness,
                    student_mastery=top_weakness["mastery_score"],
                    is_easier_request=is_easier,
                    critic_feedback=critic_feedback
                )"""

new_call_gen = """                draft = self.generator.generate_exercise(
                    concept=top_weakness,
                    student_mastery=top_weakness["mastery_score"],
                    is_easier_request=is_easier,
                    critic_feedback=critic_feedback,
                    language=detected_lang
                )"""

assert old_call_gen in content, "old_call_gen not found"
content = content.replace(old_call_gen, new_call_gen, 1)

# 9. Update fallback call inside process_turn
old_call_fb = """                    approved_exercise = self.generator._get_fallback_exercise(
                        top_weakness["concept_id"],
                        top_weakness["concept_name"],
                        top_weakness.get("associated_errors", []),
                        is_easier
                    )"""

new_call_fb = """                    approved_exercise = self.generator._get_fallback_exercise(
                        top_weakness["concept_id"],
                        top_weakness["concept_name"],
                        top_weakness.get("associated_errors", []),
                        is_easier,
                        language=detected_lang
                    )"""

assert old_call_fb in content, "old_call_fb not found"
content = content.replace(old_call_fb, new_call_fb, 1)

# 10. Update EXPLAIN_CONCEPT handler
old_explain = """        # TÌNH HUỐNG GIẢI THÍCH LÝ THUYẾT (EXPLAIN_CONCEPT)
        if intent == "EXPLAIN_CONCEPT":
            concept_name = top_weakness["concept_name"]
            reply_text = (
                f"### 📖 Giải thích trọng tâm: {concept_name}\\n\\n"
                f"Trong Python, `{concept_name}` được dùng để xử lý và đóng gói dữ liệu an toàn. "
                f"Khi làm việc với chủ đề này, điểm mấu chốt bạn cần nhớ là kiểm tra tính hợp lệ của dữ liệu trước khi truy xuất.\\n\\n"
                f"Ví dụ: Thay vì truy cập trực tiếp `my_dict[key]`, hãy ưu tiên dùng `my_dict.get(key, default)` để tránh `KeyError`.\\n\\n"
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
            }"""

new_explain = """        # TÌNH HUỐNG GIẢI THÍCH LÝ THUYẾT (EXPLAIN_CONCEPT / TẠO BÀI HỌC)
        if intent == "EXPLAIN_CONCEPT":
            concept_name = top_weakness["concept_name"]
            print(f"\\n📖 [EXPLAIN_CONCEPT] Bắt đầu biên soạn bài giảng cho '{concept_name}' ({detected_lang})...", flush=True)
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
            }"""

assert old_explain in content, "old_explain not found"
content = content.replace(old_explain, new_explain, 1)

with open(APP_FILE, "w", encoding="utf-8") as f:
    f.write(content)
print(f"Successfully patched {APP_FILE}")

with open(CORE_FILE, "w", encoding="utf-8") as f:
    f.write(content)
print(f"Successfully patched {CORE_FILE}")
