from typing import Dict, Any

from .aliases import _fold_topic

class KnowledgeGraphIndexingMixin:

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
