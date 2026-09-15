import sys
import os

APP_FILE = r"d:\Project\LearnPython\ai-service\app\agents\adaptive_agent_orchestrator.py"
CORE_FILE = r"d:\Project\LearnPython\ai-service\core\adaptive_agent_orchestrator.py"

for filepath in [APP_FILE, CORE_FILE]:
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    old_snippet = """        try:
            raw = generate_json_content(f"Yêu cầu từ học viên: '{user_msg}'. Hãy biên soạn bài giảng chi tiết.", system_prompt)
            if raw and len(raw.strip()) > 200:
                return raw.strip()
        except Exception as e:"""

    new_snippet = """        try:
            raw = generate_json_content(f"Yêu cầu từ học viên: '{user_msg}'. Hãy biên soạn bài giảng chi tiết.", system_prompt)
            if raw and len(raw.strip()) > 200:
                raw_str = raw.strip()
                if raw_str.startswith("{"):
                    try:
                        parsed = extract_json_from_llm(raw_str)
                        if isinstance(parsed, dict):
                            md_lines = []
                            if "title" in parsed:
                                md_lines.append(f"# 📖 {parsed['title']}\\n")
                            for k, v in parsed.items():
                                if k in ["title", "course_code"]:
                                    continue
                                header_name = k.replace("_", " ").title()
                                if isinstance(v, str):
                                    md_lines.append(f"## {header_name}\\n{v}\\n")
                                elif isinstance(v, dict):
                                    md_lines.append(f"## {header_name}")
                                    for sk, sv in v.items():
                                        sub_title = sk.replace("_", " ").title()
                                        if isinstance(sv, str):
                                            md_lines.append(f"### {sub_title}\\n{sv}\\n")
                                        elif isinstance(sv, list):
                                            md_lines.append(f"### {sub_title}")
                                            for itm in sv:
                                                if isinstance(itm, dict):
                                                    md_lines.append("- " + ", ".join(f"**{ik}**: {iv}" for ik, iv in itm.items()))
                                                else:
                                                    md_lines.append(f"- {itm}")
                                            md_lines.append("")
                            if md_lines:
                                return "\\n".join(md_lines)
                    except Exception:
                        pass
                return raw_str
        except Exception as e:"""

    if old_snippet in content:
        content = content.replace(old_snippet, new_snippet, 1)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Updated {filepath}")
