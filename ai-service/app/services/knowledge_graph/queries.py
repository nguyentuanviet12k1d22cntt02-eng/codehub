from typing import Dict, List, Any, Optional

from .aliases import TOPIC_ALIASES, _fold_topic

class KnowledgeGraphQueriesMixin:

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
