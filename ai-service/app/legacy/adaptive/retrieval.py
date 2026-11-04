from pathlib import Path
import os
import json
import re
from typing import Dict, Any, List, Optional


class KnowledgeRetriever:
    """Truy xuất tri thức người học đa ngôn ngữ dựa trên Đồ thị DAG & PAL-Net"""

    _source_file = str(Path(__file__).resolve().parents[2] / "agents" / "adaptive_agent_orchestrator.py")

    def __init__(self):
        self.graphs = self._load_all_graphs()
        self.skill_graph = self.graphs.get("PYTHON", {"skills": [], "edges": []})

    def _get_data_dir(self) -> str:
        current_dir = os.path.dirname(os.path.abspath(self._source_file))
        possible_dirs = [
            os.path.join(current_dir, "..", "..", "data"),
            os.path.join(current_dir, "..", "data"),
            os.path.join(current_dir, "data"),
            os.path.join(os.getcwd(), "ai-service", "data"),
            os.path.join(os.getcwd(), "data"),
        ]
        for d in possible_dirs:
            if os.path.exists(d) and os.path.isdir(d):
                return os.path.abspath(d)
        return os.path.abspath(os.path.join(current_dir, "..", "data"))

    def _load_all_graphs(self) -> Dict[str, Any]:
        data_dir = self._get_data_dir()
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

    def _load_skill_graph(self) -> Dict[str, Any]:
        data_dir = self._get_data_dir()
        graph_path = os.path.join(data_dir, "skill_graph.json")
        if not os.path.exists(graph_path):
            graph_path = os.path.join(data_dir, "pythonSkillGraph.json")
        try:
            with open(graph_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"[KnowledgeRetriever Error]: Không thể tải skill_graph.json: {e}")
            return {"skills": [], "edges": []}

    def get_learner_weaknesses(self, masteries: Dict[str, float], limit: int = 3, language: str = "PYTHON") -> List[Dict[str, Any]]:
        """Lọc ra các concept điểm yếu nhất (Mastery < 0.50) và nằm trong vùng ZPD theo ngôn ngữ"""
        graph = self.get_skill_graph(language)
        skills = graph.get("skills", [])
        if not skills:
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

    def get_concept_by_id(self, concept_id: str, language: str = None) -> Optional[Dict[str, Any]]:
        """Lấy thông tin chi tiết một concept theo ngôn ngữ hoặc trên tất cả các graph"""
        if language:
            g = self.get_skill_graph(language)
            for s in g.get("skills", []):
                if s.get("id") == concept_id:
                    return s
        for g in self.graphs.values():
            for s in g.get("skills", []):
                if s.get("id") == concept_id:
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

    def get_next_forward_concepts(
        self,
        current_concept_id: str,
        masteries: Dict[str, float],
        language: str = None,
    ) -> List[Dict[str, Any]]:
        """
        Tìm các concept kế tiếp trên DAG (Forward Progression) mà current_concept_id là điều kiện tiên quyết,
        và học viên đã đủ điều kiện để mở khóa.
        """
        resolved_language = language
        if not resolved_language:
            resolved_language = (
                "CPP" if current_concept_id.startswith("CPP-")
                else "JAVASCRIPT" if current_concept_id.startswith("JS-")
                else "PYTHON"
            )
        forward_nodes = []
        for s in self.get_skill_graph(resolved_language).get("skills", []):
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
    def find_concept_by_query(self, query: str, language: str = "PYTHON") -> Optional[Dict[str, Any]]:
        """Nhận diện concept trên DAG từ nội dung câu hỏi/yêu cầu của người học theo ngôn ngữ"""
        q = query.lower()
        lang = (language or "PYTHON").upper()
        graph = self.get_skill_graph(lang)
        skills = graph.get("skills", [])

        # 1. Tra cứu từ khóa chuyên biệt theo từng ngôn ngữ
        if lang in ["CPP", "C++"]:
            cpp_mappings = [
                (r'\b(smart pointer|unique_ptr|shared_ptr|weak_ptr|raii)\b', 'CPP-SMARTPTR-01'),
                (r'\b(bitwise|bitmask|phép toán bit|dịch bit|\bxor\b|\band\b|\bor\b)\b', 'CPP-BITWISE-01'),
                (r'\b(unordered_map|unordered_set|std::map|std::set|bảng băm|hash table|container kết hợp)\b', 'CPP-CACHE-01'),
                (r'\b(std::sort|binary_search|<algorithm>|thuật toán stl|iterator)\b', 'CPP-BUILD-01'),
                (r'\b(string_view|stringstream|std::regex|regex|biểu thức chính quy|tách từ)\b', 'CPP-FILE-01'),
                (r'\b(pointer|con trỏ|danh sách liên kết|linked list|forward_list|địa chỉ|toán tử trỏ|\*ptr|&var)\b', 'CPP-PTR-01'),
                (r'\b(phạm vi|scope|vòng đời|lifetime|shadowing|sao chép)\b', 'CPP-MEM-01'),
                (r'\b(struct|cấu trúc|memory layout|padding|alignment|std::pair|std::tuple|structured binding)\b', 'CPP-STRUCT-01'),
                (r'\b(vector|std::vector|mảng động)\b', 'CPP-VECTOR-01'),
                (r'\b(string|chuỗi|std::string)\b', 'CPP-STRING-01'),
                (r'\b(ma trận|mảng 2d|2d array|ma trận 2 chiều)\b', 'CPP-MATRIX-01'),
                (r'\b(mảng|array|mảng tĩnh)\b', 'CPP-ARRAY-01'),
                (r'\b(đệ quy|recursion|ngăn xếp gọi|call stack)\b', 'CPP-RECUR-01'),
                (r'\b(quay lui|backtrack|n quân hậu|tổ hợp)\b', 'CPP-BACKTRACK-01'),
                (r'\b(ngoại lệ|exception|try|catch|throw|std::exception)\b', 'CPP-EXC-01'),
                (r'\b(hàm|function|nạp chồng|overload|tham chiếu|reference)\b', 'CPP-FUNC-01'),
                (r'\b(vòng lặp|loop|for|while|do while)\b', 'CPP-LOOP-01'),
                (r'\b(rẽ nhánh|if|else|switch|điều kiện)\b', 'CPP-COND-01'),
                (r'\b(kiểu dữ liệu|ép kiểu|static_cast|primitive)\b', 'CPP-TYPE-01'),
                (r'\b(nhập xuất|cin|cout|iostream|cú pháp)\b', 'CPP-SYNTAX-01'),
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
                (r'\b(opp|oop|class|lớp|prototype|kế thừa|constructor|this)\b', 'JS-CLASS-01'),
                (r'\b(object|đối tượng|key-value|phương thức object)\b', 'JS-OBJECT-01'),
                (r'\b(promise|async|await|bất đồng bộ|asynchronous)\b', 'JS-ASYNC-01'),
                (r'\b(closure|lexical scope|bao đóng)\b', 'JS-CLOSURE-01'),
                (r'\b(event loop|microtask|macrotask|hàng đợi sự kiện)\b', 'JS-EVENTLOOP-01'),
                (r'\b(mảng|array|map|filter|reduce|forEach)\b', 'JS-ARRAY-01'),
                (r'\b(hàm|function|arrow function|callback)\b', 'JS-FUNC-01'),
                (r'\b(biến|var|let|const|hoisting|scope)\b', 'JS-VAR-01'),
                (r'\b(kiểu dữ liệu|type|typeof|primitive|truthy|falsy)\b', 'JS-TYPE-01'),
                (r'\b(toán tử|operator|so sánh|strict equality|===)\b', 'JS-OP-01'),
                (r'\b(rẽ nhánh|if|else|switch|ternary)\b', 'JS-COND-01'),
                (r'\b(vòng lặp|loop|for|while|for of|for in)\b', 'JS-LOOP-01'),
                (r'\b(destructuring|spread|rest|toán tử rải)\b', 'JS-ES6-01'),
                (r'\b(module|import|export|commonjs|esmodule)\b', 'JS-MODULE-01'),
                (r'\b(lỗi|error|try|catch|finally|throw)\b', 'JS-ERROR-01'),
            ]
            for pattern, target in js_mappings:
                if re.search(pattern, q):
                    concept = self.get_concept_by_id(target, language="JAVASCRIPT")
                    if concept:
                        return concept

        else: # PYTHON
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
                # OOP (Bắt cả opp gõ nhầm)
                (r'\b(kế thừa|inheritance|super)\b', 'PY-OOP-03'),
                (r'\b(opp|oop|hướng đối tượng|class|lớp|đối tượng|__init__|constructor)\b', 'PY-OOP-01'),
                # Basics
                (r'\b(ép kiểu|type casting|typeerror|valueerror)\b', 'PY-BASICS-02'),
                (r'\b(toán tử|boolean|logic|and|or|not)\b', 'PY-BASICS-03'),
                (r'\b(biến|đặt tên|kiểu dữ liệu|primitive)\b', 'PY-BASICS-01'),
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

        return None
