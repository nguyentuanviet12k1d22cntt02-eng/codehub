from .skill_graph_source import load_skill_graph
from .knowledge_graph.aliases import TOPIC_ALIASES, _fold_topic
from .knowledge_graph.lesson_catalog import lesson_frontmatter_value, lesson_titles_from_content
from .knowledge_graph.indexing import KnowledgeGraphIndexingMixin
from .knowledge_graph.queries import KnowledgeGraphQueriesMixin
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


class KnowledgeGraphService(KnowledgeGraphIndexingMixin, KnowledgeGraphQueriesMixin):
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
        self._custom_data_dir = data_dir is not None
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
        # Stay uninitialised when no graph could be loaded so the next construction retries.
        self._initialized = bool(self.graphs)

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
        languages = ["python", "cpp", "javascript", "sql"]
        for lang in languages:
            try:
                if self._custom_data_dir:
                    fpath = os.path.join(self.data_dir, f"{lang}SkillGraph.json")
                    if not os.path.exists(fpath):
                        continue
                    with open(fpath, "r", encoding="utf-8") as f:
                        gdata = json.load(f)
                else:
                    gdata = load_skill_graph(lang)
                    if not gdata:
                        continue
                self.graphs[lang] = gdata
                self._build_indices(lang, gdata)
            except Exception as e:
                print(f"[KnowledgeGraphService] Lỗi khi nạp đồ thị {lang}: {e}")

    @staticmethod
    def _lesson_titles_from_content(language: str) -> List[tuple[str, str]]:
        return lesson_titles_from_content(language, LESSON_CONTENT_DIRS)
