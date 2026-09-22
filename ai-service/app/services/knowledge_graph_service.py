import os
import json
from typing import Dict, List, Any, Optional

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA_DIR = os.path.join(BASE_DIR, "data")


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

        # 1. Index skills
        for skill in gdata.get("skills", []):
            cid = skill.get("id") or skill.get("concept_id")
            if not cid:
                continue
            self.concept_index[lang][cid] = skill
            self.prereq_graph[lang][cid] = list(skill.get("prerequisites", []))
            self.downstream_graph[lang][cid] = []

            # Index keywords and names to help resolve topic
            name_lower = (skill.get("name") or "").lower()
            scope_lower = (skill.get("scope") or "").lower()
            topic_id = (skill.get("topic_id") or "").lower()
            
            self.topic_index[lang][cid.lower()] = cid
            self.topic_index[lang][name_lower] = cid
            if topic_id:
                self.topic_index[lang][topic_id] = cid

            # Parse keywords in scope
            for kw in scope_lower.replace(",", " ").replace("/", " ").split():
                if len(kw) > 3:
                    self.topic_index[lang][kw] = cid

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

        topic_clean = topic.strip().lower()

        # Direct match in index
        if topic_clean in self.topic_index.get(lang, {}):
            return self.topic_index[lang][topic_clean]

        # Substring match across all skills
        best_match = None
        for cid, skill in self.concept_index.get(lang, {}).items():
            name = (skill.get("name") or "").lower()
            scope = (skill.get("scope") or "").lower()
            if topic_clean in name or topic_clean in cid.lower() or topic_clean in scope:
                return cid

        # Common synonym dictionary
        synonyms = {
            "function": ["func", "hàm", "arrow", "parameter"],
            "loop": ["for", "while", "vòng lặp", "lặp"],
            "array": ["list", "mảng", "danh sách"],
            "dict": ["dictionary", "từ điển", "object", "map"],
            "oop": ["class", "hướng đối tượng", "lớp", "constructor", "kế thừa"],
            "pointer": ["con trỏ", "reference", "địa chỉ", "tham chiếu"]
        }
        for syn_key, kw_list in synonyms.items():
            if any(kw in topic_clean for kw in kw_list):
                for cid, skill in self.concept_index.get(lang, {}).items():
                    c_name = (skill.get("name") or "").lower()
                    if any(kw in c_name or kw in cid.lower() for kw in kw_list):
                        return cid

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
