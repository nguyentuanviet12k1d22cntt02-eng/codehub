import os
from typing import List, Optional

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

def lesson_titles_from_content(language: str, content_dirs) -> List[tuple[str, str]]:
    """Read only lesson IDs/titles from local, versioned course content."""
    root = content_dirs.get(language)
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
