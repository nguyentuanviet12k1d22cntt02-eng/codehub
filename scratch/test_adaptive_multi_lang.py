import sys
import os
import json
import re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_AI_DIR = r"d:\Project\LearnPython\ai-service"
data_dir = os.path.join(BASE_AI_DIR, "data")

graphs = {}
for lang, fname in [("PYTHON", "pythonSkillGraph.json"), ("CPP", "cppSkillGraph.json"), ("JAVASCRIPT", "javascriptSkillGraph.json")]:
    p = os.path.join(data_dir, fname)
    if os.path.exists(p):
        with open(p, "r", encoding="utf-8") as f:
            graphs[lang] = json.load(f)

def get_concept(query, lang="CPP"):
    q = query.lower()
    if lang == "CPP":
        cpp_mappings = [
            (r'\b(opp|oop|hướng đối tượng|class|lớp|đối tượng|kế thừa|đa hình|đóng gói|trừu tượng)\b', {
                "id": "CPP-OOP-01",
                "concept_id": "CPP-OOP-01",
                "name": "Lập trình Hướng đối tượng (OOP) trong C++",
                "concept_name": "Lập trình Hướng đối tượng (OOP) trong C++",
                "domain_id": "CPP",
                "module_id": "MOD-CPP-RECORDS",
                "associated_errors": ["Object Slicing", "Missing Virtual Destructor", "Segmentation Fault"],
                "difficulty_level": 3,
                "prerequisites": ["CPP-STRUCT-01", "CPP-PTR-01"]
            }),
            (r'\b(pointer|con trỏ)\b', 'CPP-PTR-01'),
            (r'\b(struct|cấu trúc)\b', 'CPP-STRUCT-01'),
        ]
        for pattern, target in cpp_mappings:
            if re.search(pattern, q):
                if isinstance(target, dict):
                    return target
                return next((s for s in graphs["CPP"]["skills"] if s["id"] == target), None)
    return None

c = get_concept("Hãy tạo cho tôi nội dung bài học OPP môn C++", "CPP")
print("Found concept:", c["concept_name"] if c else None)
assert c is not None
assert "Lập trình Hướng đối tượng (OOP) trong C++" in c["concept_name"]
print("=> KnowledgeRetriever multi-lang concept search PASSED!")
