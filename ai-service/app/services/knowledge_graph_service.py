import os
import json
import unicodedata
from typing import Dict, List, Any, Optional

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA_DIR = os.path.join(BASE_DIR, "data")
PROJECT_ROOT = os.path.dirname(BASE_DIR)
LESSON_CONTENT_DIRS = {
    "python": os.path.join(PROJECT_ROOT, "docs", "Dữ liệu nội dung bài học", "Python"),
    "javascript": os.path.join(PROJECT_ROOT, "docs", "Dữ liệu nội dung bài học", "JS"),
    "cpp": os.path.join(PROJECT_ROOT, "docs", "Dữ liệu nội dung bài học", "C++"),
}


TOPIC_ALIASES = {
    "python": {
        "keyerror": "PY-DICT-02",
        "dictionary comprehension": "PY-DICT-03",
        "dict comprehension": "PY-DICT-03",
        "list comprehension": "PY-LIST-03",
        "f string": "PY-STRING-02",
        "fstring": "PY-STRING-02",
        "dictionary": "PY-DICT-01",
        "dict": "PY-DICT-01",
        "tu dien": "PY-DICT-01",
        "key value": "PY-DICT-01",
        "list": "PY-LIST-01",
        "array": "PY-LIST-01",
        "danh sach": "PY-LIST-01",
        "mang": "PY-LIST-01",
        "tuple": "PY-TUPLE-01",
        "set": "PY-SET-01",
        "tap hop": "PY-SET-01",
        "string": "PY-STRING-01",
        "chuoi": "PY-STRING-01",
        "while": "PY-FLOW-02",
        "for": "PY-FLOW-03",
        "loop": "PY-FLOW-03",
        "vong lap": "PY-FLOW-03",
        "condition": "PY-FLOW-01",
        "if else": "PY-FLOW-01",
        "dieu kien": "PY-FLOW-01",
        "function": "PY-FUNC-01",
        "def": "PY-FUNC-01",
        "ham": "PY-FUNC-01",
        "exception": "PY-EXC-01",
        "try except": "PY-EXC-01",
        "ngoai le": "PY-EXC-01",
        "file": "PY-IO-01",
        "tep": "PY-IO-01",
        "module": "PY-MODULE-01",
        "import": "PY-MODULE-01",
        "oop": "PY-OOP-01",
        "class": "PY-OOP-01",
        "huong doi tuong": "PY-OOP-01",
        "casting": "PY-BASICS-02",
        "ep kieu": "PY-BASICS-02",
        "operator": "PY-BASICS-03",
        "toan tu": "PY-BASICS-03",
        "variable": "PY-BASICS-01",
        "bien": "PY-BASICS-01",
    },
    "javascript": {
        "foreach": "JS-ARRAY-HOF-01",
        "for each": "JS-ARRAY-HOF-01",
        "higher order array": "JS-ARRAY-HOF-01",
        "map filter reduce": "JS-ARRAY-HOF-01",
        "filter": "JS-ARRAY-HOF-01",
        "reduce": "JS-ARRAY-HOF-01",
        "map": "JS-ARRAY-HOF-01",
        "destructuring": "JS-DESTRUCT-01",
        "spread rest": "JS-SPREADREST-01",
        "prototype": "JS-PROTO-01",
        "closure": "JS-CLOSURE-01",
        "hoisting": "JS-EXEC-01",
        "arrow function": "JS-ARROW-01",
        "arrow": "JS-ARROW-01",
        "set map": "JS-SETMAP-01",
        "dictionary": "JS-OBJECT-01",
        "key value": "JS-OBJECT-01",
        "object": "JS-OBJECT-01",
        "array": "JS-ARRAY-01",
        "mang": "JS-ARRAY-01",
        "string": "JS-STRING-01",
        "chuoi": "JS-STRING-01",
        "function": "JS-FUNC-01",
        "ham": "JS-FUNC-01",
        "scope": "JS-SCOPE-01",
        "this": "JS-THIS-01",
        "class": "JS-CLASS-01",
        "oop": "JS-CLASS-01",
        "error": "JS-ERROR-01",
        "exception": "JS-ERROR-01",
        "module": "JS-MODULE-01",
        "loop": "JS-LOOP-01",
        "vong lap": "JS-LOOP-01",
        "condition": "JS-COND-01",
        "dieu kien": "JS-COND-01",
        "coercion": "JS-COERCE-01",
        "ep kieu": "JS-COERCE-01",
        "type": "JS-TYPE-01",
        "kieu du lieu": "JS-TYPE-01",
        "variable": "JS-VAR-01",
        "bien": "JS-VAR-01",
    },
    "cpp": {
        "smart pointer": "CPP-SMARTPTR-01",
        "unordered map": "CPP-CACHE-01",
        "backtracking": "CPP-BACKTRACK-01",
        "quay lui": "CPP-BACKTRACK-01",
        "recursion": "CPP-RECUR-01",
        "de quy": "CPP-RECUR-01",
        "bitwise": "CPP-BITWISE-01",
        "pointer": "CPP-PTR-01",
        "con tro": "CPP-PTR-01",
        "vector": "CPP-VECTOR-01",
        "array": "CPP-ARRAY-01",
        "mang": "CPP-ARRAY-01",
        "matrix": "CPP-MATRIX-01",
        "ma tran": "CPP-MATRIX-01",
        "string": "CPP-STRING-01",
        "chuoi": "CPP-STRING-01",
        "struct": "CPP-STRUCT-01",
        "enum": "CPP-ENUMVAR-01",
        "variant": "CPP-ENUMVAR-01",
        "hash": "CPP-CACHE-01",
        "map": "CPP-CACHE-01",
        "algorithm": "CPP-BUILD-01",
        "iterator": "CPP-BUILD-01",
        "file": "CPP-FILE-01",
        "stream": "CPP-FILE-01",
        "exception": "CPP-EXC-01",
        "function": "CPP-FUNC-01",
        "ham": "CPP-FUNC-01",
        "loop": "CPP-LOOP-01",
        "vong lap": "CPP-LOOP-01",
        "condition": "CPP-COND-01",
        "dieu kien": "CPP-COND-01",
        "type": "CPP-TYPE-01",
        "kieu du lieu": "CPP-TYPE-01",
        "syntax": "CPP-SYNTAX-01",
        "cu phap": "CPP-SYNTAX-01",
        "input output": "CPP-SYNTAX-01",
    },
    "sql": {
        "group by": "SQL-AGG-01",
        "order by": "SQL-SORT-01",
        "primary key": "SQL-RDBMS-01",
        "foreign key": "SQL-RDBMS-01",
        "inner join": "SQL-JOIN-01",
        "left join": "SQL-JOIN-01",
        "join": "SQL-JOIN-01",
        "aggregate": "SQL-AGG-01",
        "count": "SQL-AGG-01",
        "sum": "SQL-AGG-01",
        "avg": "SQL-AGG-01",
        "sort": "SQL-SORT-01",
        "limit": "SQL-SORT-01",
        "where": "SQL-WHERE-01",
        "filter": "SQL-WHERE-01",
        "and or not": "SQL-LOGIC-01",
        "logic": "SQL-LOGIC-01",
        "select": "SQL-DQL-01",
        "distinct": "SQL-DQL-01",
        "alias": "SQL-DQL-01",
        "database": "SQL-RDBMS-01",
        "rdbms": "SQL-RDBMS-01",
        "table": "SQL-RDBMS-01",
    },
}


def _fold_topic(value: str) -> str:
    value = value.lower().replace("đ", "d")
    value = "".join(c for c in unicodedata.normalize("NFD", value) if unicodedata.category(c) != "Mn")
    return " ".join("".join(c if c.isascii() and c.isalnum() else " " for c in value).split())


def lesson_frontmatter_value(content: str, key: str) -> Optional[str]:
    """Read one simple YAML frontmatter scalar without matching user text."""
    for line in content[:1200].splitlines():
        name, separator, value = line.partition(":")
        if separator and name.strip() == key:
            value = value.strip()
            if len(value) >= 2 and value[0] == value[-1] and value[0] in ('"', "'"):
                return value[1:-1]
            return value
    return None


class KnowledgeGraphService:
    """
    Service quản lý Tri thức khách quan (Knowledge Graph) của các môn học.
    ĐẢM BẢO TÍNH BẤT BIẾN:
    - Tuyệt đối không lưu hoặc trộn trạng thái cá nhân người học vào đồ thị này.
    - Cung cấp các truy vấn đồ thị DAG: concepts, prerequisites, downstream, associated errors.
    """
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(KnowledgeGraphService, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self, data_dir: Optional[str] = None):
        if getattr(self, "_initialized", False):
            return
        self.data_dir = data_dir or DATA_DIR
        self.graphs: Dict[str, Dict[str, Any]] = {}
        self.concept_index: Dict[str, Dict[str, Dict[str, Any]]] = {}
        self.prereq_graph: Dict[str, Dict[str, List[str]]] = {}
        self.downstream_graph: Dict[str, Dict[str, List[str]]] = {}
        self.topic_index: Dict[str, Dict[str, str]] = {}
        self.lesson_code_index: Dict[str, Dict[str, str]] = {}
        self.lesson_title_index: Dict[str, Dict[str, str]] = {}
        self.lesson_catalog_index: Dict[str, Dict[str, Dict[str, List[str]]]] = {}
        
        self._load_graphs()
        self._initialized = True

    def _normalize_lang(self, language: Optional[str]) -> str:
        if not language:
            return "python"
        lang = language.strip().lower()
        if "c++" in lang or "cpp" in lang:
            return "cpp"
        if "js" in lang or "javascript" in lang:
            return "javascript"
        if "sql" in lang:
            return "sql"
        return "python"

    def _load_graphs(self):
        files_map = {
            "python": "pythonSkillGraph.json",
            "cpp": "cppSkillGraph.json",
            "javascript": "javascriptSkillGraph.json",
            "sql": "sqlSkillGraph.json"
        }

        for lang, fname in files_map.items():
            fpath = os.path.join(self.data_dir, fname)
            if not os.path.exists(fpath):
                # Fallback check
                continue
            try:
                with open(fpath, "r", encoding="utf-8") as f:
                    gdata = json.load(f)
                    self.graphs[lang] = gdata
                    self._build_indices(lang, gdata)
            except Exception as e:
                print(f"[KnowledgeGraphService] Lỗi khi nạp {fname}: {e}")

    def _build_indices(self, lang: str, gdata: Dict[str, Any]):
        self.concept_index[lang] = {}
        self.prereq_graph[lang] = {}
        self.downstream_graph[lang] = {}
        self.topic_index[lang] = {}
        self.lesson_code_index[lang] = {}
        self.lesson_title_index[lang] = {}
        self.lesson_catalog_index[lang] = {}

        # 1. Index skills
        for skill in gdata.get("skills", []):
            cid = skill.get("id") or skill.get("concept_id")
            if not cid:
                continue
            self.concept_index[lang][cid] = skill
            self.prereq_graph[lang][cid] = list(skill.get("prerequisites", []))
            self.downstream_graph[lang][cid] = []

            # Index keywords and names to help resolve topic
            name_lower = _fold_topic(skill.get("name") or "")
            topic_id = _fold_topic(skill.get("topic_id") or "")
            
            self.topic_index[lang][cid.lower()] = cid
            self.topic_index[lang][name_lower] = cid
            if topic_id:
                self.topic_index[lang][topic_id] = cid

        # 2. Build DAG edges
        for edge in gdata.get("edges", []):
            src = edge.get("source")
            tgt = edge.get("target")
            if src and tgt:
                # src is prerequisite of tgt
                if tgt in self.prereq_graph[lang] and src not in self.prereq_graph[lang][tgt]:
                    self.prereq_graph[lang][tgt].append(src)
                if src in self.downstream_graph[lang] and tgt not in self.downstream_graph[lang][src]:
                    self.downstream_graph[lang][src].append(tgt)

        # Every published course lesson is a first-class Tutor entry point.
        # Graph-owned title mappings cover Python; JavaScript and C++ titles
        # are loaded from their versioned lesson front matter so adding a new
        # lesson does not require maintaining a second, incomplete keyword
        # list in the router.
        lesson_mappings = {
            str(code): str(concept_id)
            for code, concept_id in gdata.get("lesson_mappings", {}).items()
            if str(concept_id) in self.concept_index[lang]
        }
        self.lesson_code_index[lang] = {
            code.upper(): concept_id for code, concept_id in lesson_mappings.items()
        }
        for lesson_code, concept_id in lesson_mappings.items():
            self.lesson_catalog_index[lang].setdefault(concept_id, {"codes": [], "titles": []})["codes"].append(lesson_code)

        def register_title(title: Any, concept_id: str) -> None:
            normalized = _fold_topic(str(title))
            if not normalized or concept_id not in self.concept_index[lang]:
                return
            existing = self.lesson_title_index[lang].get(normalized)
            # A repeated C++ lesson document is valid only when it resolves
            # to the same graph skill. Keep the first stable match otherwise.
            if existing is None or existing == concept_id:
                self.lesson_title_index[lang][normalized] = concept_id
                titles = self.lesson_catalog_index[lang].setdefault(concept_id, {"codes": [], "titles": []})["titles"]
                if str(title) not in titles:
                    titles.append(str(title))

        for title, concept_id in gdata.get("lesson_title_mappings", {}).items():
            register_title(title, str(concept_id))
        for lesson_code, title in self._lesson_titles_from_content(lang):
            concept_id = lesson_mappings.get(lesson_code)
            if concept_id:
                register_title(title, concept_id)

    @staticmethod
    def _lesson_titles_from_content(language: str) -> List[tuple[str, str]]:
        """Read only lesson IDs/titles from local, versioned course content."""
        root = LESSON_CONTENT_DIRS.get(language)
        if not root or not os.path.isdir(root):
            return []
        titles: List[tuple[str, str]] = []
        for directory, _, filenames in os.walk(root):
            for filename in filenames:
                if not filename.lower().endswith((".md", ".txt")):
                    continue
                path = os.path.join(directory, filename)
                try:
                    with open(path, "r", encoding="utf-8-sig") as source:
                        content = source.read()
                except OSError:
                    continue
                lesson_id = lesson_frontmatter_value(content, "lessonId")
                title = lesson_frontmatter_value(content, "title")
                if not lesson_id or not title:
                    continue
                titles.append((lesson_id, title))
        return titles

    def list_all_concepts(self, language: str) -> List[Dict[str, Any]]:
        lang = self._normalize_lang(language)
        return list(self.concept_index.get(lang, {}).values())

    def get_concept(self, language: str, concept_id: str) -> Optional[Dict[str, Any]]:
        lang = self._normalize_lang(language)
        if not concept_id:
            return None
        return self.concept_index.get(lang, {}).get(concept_id)

    def get_prerequisites(self, language: str, concept_id: str) -> List[str]:
        lang = self._normalize_lang(language)
        return self.prereq_graph.get(lang, {}).get(concept_id, [])

    def get_downstream(self, language: str, concept_id: str) -> List[str]:
        lang = self._normalize_lang(language)
        return self.downstream_graph.get(lang, {}).get(concept_id, [])

    def get_sub_skills(self, language: str, concept_id: str) -> List[str]:
        concept = self.get_concept(language, concept_id)
        if not concept:
            return []
        
        sub_skills = []
        # Extract from learning_objectives or scope
        for obj in concept.get("learning_objectives", []):
            if isinstance(obj, str):
                # Take key phrase without cutting words mid-way
                clean_obj = obj.split(":")[0].strip() if ":" in obj else obj.strip()
                if clean_obj:
                    sub_skills.append(clean_obj)
        
        if not sub_skills and concept.get("scope"):
            sub_skills = [s.strip() for s in concept["scope"].split(",") if s.strip()]

        if not sub_skills:
            sub_skills = ["syntax", "logic", "edge_cases"]

        return sub_skills

    def get_associated_errors(self, language: str, concept_id: str) -> List[str]:
        concept = self.get_concept(language, concept_id)
        if not concept:
            return []
        return concept.get("associated_errors", [])

    def resolve_concept_by_topic(self, language: str, topic: Optional[str]) -> Optional[str]:
        lang = self._normalize_lang(language)
        if not topic:
            return None

        topic_raw = topic.strip()
        direct_id = topic_raw.upper()
        if direct_id in self.concept_index.get(lang, {}):
            return direct_id
        lesson_concept = self.lesson_code_index.get(lang, {}).get(direct_id)
        if lesson_concept:
            return lesson_concept
        topic_clean = _fold_topic(topic_raw)
        titled_concept = self.lesson_title_index.get(lang, {}).get(topic_clean)
        if titled_concept:
            return titled_concept

        # Resolve the course's compound List lesson before applying generic
        # matching.  This also canonicalizes an LLM response such as
        # "slicing list mutable" to the graph-owned concept ID.
        if lang == "python":
            is_list_topic = any(marker in topic_clean for marker in ("list", "array", "danh sách", "danh sach", "mảng", "mang"))
            is_slicing_or_mutable = any(marker in topic_clean for marker in ("slice", "slicing", "mutable", "tham chiếu", "tham chieu", "bản sao", "ban sao"))
            if is_list_topic and is_slicing_or_mutable and "PY-LIST-02" in self.concept_index.get(lang, {}):
                return "PY-LIST-02"

        # Generic array is a Python List in the curriculum.  The former
        # synonym table omitted the literal word "array", leaving a Router
        # result that could never be resolved by the Planner.
        if lang == "python" and topic_clean == "array" and "PY-LIST-01" in self.concept_index.get(lang, {}):
            return "PY-LIST-01"

        # The aliases are curriculum-owned. Broad requests deliberately map
        # to the foundation concept of that topic instead of whichever skill
        # happens to appear first in the JSON file.
        aliases = TOPIC_ALIASES.get(lang, {})
        if topic_clean in aliases and aliases[topic_clean] in self.concept_index.get(lang, {}):
            return aliases[topic_clean]
        # Direct normalized name/topic match in index.
        if topic_clean in self.topic_index.get(lang, {}):
            return self.topic_index[lang][topic_clean]

        return None

    def resolve_concept_from_text(self, language: str, user_text: Optional[str]) -> Optional[str]:
        """Resolve an exact course title embedded in a natural-language request.

        Exact title matches have precedence over broad aliases such as
        ``function`` or ``array``. This lets the Tutor support every versioned
        lesson in the three course languages without making the LLM invent a
        graph ID.
        """
        lang = self._normalize_lang(language)
        if not user_text:
            return None
        normalized_text = _fold_topic(user_text)
        for title, concept_id in sorted(
            self.lesson_title_index.get(lang, {}).items(), key=lambda item: len(item[0]), reverse=True,
        ):
            if len(title) >= 4 and f" {title} " in f" {normalized_text} ":
                return concept_id
        return None

    def get_remediation_candidates(self, language: str, concept_id: str, failed_sub_skills: Optional[List[str]] = None) -> List[str]:
        """
        Tìm các concept ứng viên cho Remediation:
        1. Ưu tiên concept tiên quyết (prerequisites) trực tiếp nếu học viên hổng nền tảng.
        2. Nếu prerequisites đã ổn hoặc không có, trả về chính concept_id với sub-skill hẹp hơn.
        """
        prereqs = self.get_prerequisites(language, concept_id)
        candidates = []
        if prereqs:
            candidates.extend(prereqs)
        candidates.append(concept_id)
        return candidates

    def find_root_gap(self, language: str, target_concept_id: str, user_mastery_map: Dict[str, float]) -> Optional[str]:
        """
        Thuật toán Backtracking tìm Cognitive Root Gap:
        Duyệt ngược từ target_concept theo các cạnh DAG prerequisites;
        Node tiên quyết nào có mastery < 0.60 sâu nhất thì đó chính là Root Cognitive Gap.
        """
        lang = self._normalize_lang(language)
        visited_depth: Dict[str, int] = {}
        queue = [(target_concept_id, 0)]
        observed_gaps = []

        while queue:
            current, depth = queue.pop(0)
            if current in visited_depth and visited_depth[current] >= depth:
                continue
            visited_depth[current] = depth
            if current in user_mastery_map and float(user_mastery_map[current]) < 0.60:
                observed_gaps.append((depth, float(user_mastery_map[current]), current))
            for prerequisite in sorted(self.get_prerequisites(lang, current)):
                queue.append((prerequisite, depth + 1))

        if not observed_gaps:
            return None
        # Deepest prerequisite first; ties prefer the lower mastery and then a stable concept id.
        return sorted(observed_gaps, key=lambda item: (-item[0], item[1], item[2]))[0][2]
