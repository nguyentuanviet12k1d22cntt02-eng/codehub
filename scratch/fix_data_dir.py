import sys
import os

APP_FILE = r"d:\Project\LearnPython\ai-service\app\agents\adaptive_agent_orchestrator.py"
CORE_FILE = r"d:\Project\LearnPython\ai-service\core\adaptive_agent_orchestrator.py"

for filepath in [APP_FILE, CORE_FILE]:
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    old_load = """    def _load_all_graphs(self) -> Dict[str, Any]:
        base_ai_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        data_dir = os.path.join(base_ai_dir, "data")"""

    new_load = """    def _get_data_dir(self) -> str:
        current_dir = os.path.dirname(os.path.abspath(__file__))
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
        data_dir = self._get_data_dir()"""

    if old_load in content:
        content = content.replace(old_load, new_load, 1)

    # Also update _load_skill_graph
    old_sg = """    def _load_skill_graph(self) -> Dict[str, Any]:
        base_ai_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        graph_path = os.path.join(base_ai_dir, "data", "skill_graph.json")
        if not os.path.exists(graph_path):
            graph_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "skill_graph.json")"""

    new_sg = """    def _load_skill_graph(self) -> Dict[str, Any]:
        data_dir = self._get_data_dir()
        graph_path = os.path.join(data_dir, "skill_graph.json")
        if not os.path.exists(graph_path):
            graph_path = os.path.join(data_dir, "pythonSkillGraph.json")"""

    if old_sg in content:
        content = content.replace(old_sg, new_sg, 1)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Updated {filepath}")
