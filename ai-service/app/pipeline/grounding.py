import hashlib
from pathlib import Path
from app.pipeline.runtime import ROOT, digest
from app.services.knowledge_graph_service import _fold_topic, lesson_frontmatter_value


class GroundingService:
    def retrieve(self, spec, kg):
        concept = kg.get_concept(spec.language, spec.target_concept)
        folder = ROOT.parent / "docs" / "Dữ liệu nội dung bài học" / {"python": "Python", "javascript": "JS", "cpp": "C++", "sql": "SQL"}[spec.language]
        keywords = [k for k in _fold_topic(spec.concept_title or "").split() if len(k) > 3]
        lesson_mappings = kg.graphs.get(spec.language, {}).get("lesson_mappings", {})
        mapped_lesson_ids = {
            lesson_id for lesson_id, concept_id in lesson_mappings.items()
            if concept_id == spec.target_concept
        }
        for lesson_id, concept_ids in kg.graphs.get(spec.language, {}).get("multi_skill_lesson_mappings", {}).items():
            if spec.target_concept in concept_ids:
                mapped_lesson_ids.add(lesson_id)
        exact_sources = {}
        ranked = []
        paths = []
        if folder.exists():
            paths = list(folder.rglob("*.md")) + list(folder.rglob("*.txt"))
        for path in paths:
            content = path.read_text(encoding="utf-8-sig")
            head = _fold_topic(content[:5000])
            lesson_id = lesson_frontmatter_value(content, "lessonId")
            if lesson_id in mapped_lesson_ids:
                candidate = (100 + sum(1 for k in keywords if k in head), path, content, lesson_id)
                previous = exact_sources.get(lesson_id)
                if previous is None or (previous[1].suffix.lower() != ".md" and path.suffix.lower() == ".md"):
                    exact_sources[lesson_id] = candidate
                continue
            score = 20 if spec.target_concept.lower() in head else sum(1 for k in keywords if k in head)
            if score >= 2:
                ranked.append((score, path, content, lesson_id))
        selected = list(exact_sources.values()) if exact_sources else ranked
        sources = []
        for score, path, content, lesson_id in sorted(selected, key=lambda r: (-r[0], str(r[1])))[:2]:
            source = {"id": str(path.relative_to(ROOT.parent)).replace("\\", "/"), "sha256": hashlib.sha256(content.encode()).hexdigest(), "excerpt": content[:4500], "match_score": score}
            if lesson_id:
                source["lesson_id"] = lesson_id
            sources.append(source)
        graph_file = {"python": "python", "javascript": "javascript", "cpp": "cpp", "sql": "sql"}[spec.language] + "SkillGraph.json"
        sources.insert(0, {"id": "ai-service/data/" + graph_file + "#" + spec.target_concept, "sha256": digest(concept), "excerpt": concept})
        return {"concept": concept, "sources": sources, "retrieval_method": "local_graph_and_keyword_search"}
