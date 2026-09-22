import hashlib
import re
from pathlib import Path
from app.agents.intent_router_agent import folded
from app.pipeline.runtime import ROOT, digest


class GroundingService:
    def retrieve(self, spec, kg):
        concept = kg.get_concept(spec.language, spec.target_concept)
        folder = ROOT.parent / "docs" / "Dữ liệu nội dung bài học" / {"python": "Python", "javascript": "JS", "cpp": "C++", "sql": "SQL"}[spec.language]
        keywords = [k for k in re.split(r"\W+", folded(spec.concept_title or "")) if len(k) > 3]
        ranked = []
        for path in folder.rglob("*.md") if folder.exists() else []:
            content = path.read_text(encoding="utf-8-sig")
            head = folded(content[:5000])
            score = 20 if spec.target_concept.lower() in head else sum(1 for k in keywords if k in head)
            if score >= 2:
                ranked.append((score, path, content))
        sources = []
        for score, path, content in sorted(ranked, key=lambda r: (-r[0], str(r[1])))[:2]:
            sources.append({"id": str(path.relative_to(ROOT.parent)).replace("\\", "/"), "sha256": hashlib.sha256(content.encode()).hexdigest(), "excerpt": content[:4500], "match_score": score})
        graph_file = {"python": "python", "javascript": "javascript", "cpp": "cpp", "sql": "sql"}[spec.language] + "SkillGraph.json"
        sources.insert(0, {"id": "ai-service/data/" + graph_file + "#" + spec.target_concept, "sha256": digest(concept), "excerpt": concept})
        return {"concept": concept, "sources": sources, "retrieval_method": "local_graph_and_keyword_search"}
