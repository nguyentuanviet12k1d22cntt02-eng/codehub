"""Kiểm tra tính nhất quán và khả năng chạy của nội dung Python Module 3."""

from __future__ import annotations

import contextlib
import io
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SEED_PATH = ROOT / "backend/prisma/seed/seed_course_data.json"
LESSON_DIR = ROOT / "docs/Dữ liệu nội dung bài học/Python/Cấu trúc bài học/Chapter 05"
PRACTICE_DIR = ROOT / "docs/Dữ liệu nội dung bài học/Python/modules/module3"

EXPECTED_LESSONS = [
    ("LS-03.01", "Lesson 3.1: Tại sao cần vòng lặp?", "Lession1.md", ["LS-02.04"], 3),
    ("LS-03.02", "Lesson 3.2: Tư duy vòng lặp", "Lession2.md", ["LS-03.01"], 3),
    ("LS-03.03", "Lesson 3.3: Vòng lặp for và range()", "Lession3.md", ["LS-03.02"], 3),
    ("LS-03.04", "Lesson 3.4: Vòng lặp while và điều kiện dừng", "Lession4.md", ["LS-03.03"], 3),
    ("LS-03.05", "Lesson 3.5: Điều khiển vòng lặp với break và continue", "Lession5.md", ["LS-03.04"], 2),
    ("LS-03.06", "Lesson 3.6: Kết hợp vòng lặp với if", "Lession6.md", ["LS-03.05"], 3),
    ("LS-03.07", "Lesson 3.7: Vòng lặp lồng nhau", "Lession7.md", ["LS-03.06"], 2),
    ("LS-03.08", "Lesson 3.8: Luyện tập tổng hợp và mini project", "Lession8.md", ["LS-03.07"], 2),
]


def normalized(text: str) -> str:
    return text.replace("\r\n", "\n").strip()


def assert_equal(actual: object, expected: object, message: str) -> None:
    if actual != expected:
        raise AssertionError(f"{message}: nhận {actual!r}, cần {expected!r}")


def run_exercise(lesson_id: str, exercise: dict[str, object]) -> int:
    solution = str(exercise["solutionCode"])
    tests = exercise.get("testCases", [])
    if not tests:
        raise AssertionError(f"{lesson_id}/{exercise['title']} chưa có test case")

    for index, case in enumerate(tests, start=1):
        stdin = io.StringIO(str(case["input"]))
        stdout = io.StringIO()
        scope = {"__name__": "__main__"}
        try:
            with contextlib.redirect_stdout(stdout), contextlib.redirect_stderr(io.StringIO()):
                original_input = __builtins__.input
                __builtins__.input = lambda _prompt="": stdin.readline().rstrip("\n")
                try:
                    exec(compile(solution, f"{lesson_id}/{exercise['title']}", "exec"), scope)
                finally:
                    __builtins__.input = original_input
        except SystemExit:
            pass

        actual = normalized(stdout.getvalue())
        expected = normalized(str(case["expectedOutput"]))
        assert_equal(
            actual,
            expected,
            f"Sai test {index} của {lesson_id}/{exercise['title']}",
        )
    return len(tests)


def main() -> None:
    seed = json.loads(SEED_PATH.read_text(encoding="utf-8-sig"))
    module = next(item for item in seed if item["moduleId"] == "MOD-03")
    chapter = next(item for item in module["chapters"] if item["chapterId"] == "CH-05")

    lessons = sorted(chapter["lessons"], key=lambda lesson: lesson["orderIndex"])
    regular_lessons = [lesson for lesson in lessons if ".MP" not in lesson["lessonId"]]
    assert_equal(len(regular_lessons), 8, "Module 3 phải có 8 bài lý thuyết")

    lesson_by_id = {lesson["lessonId"]: lesson for lesson in lessons}
    exercise_count = 0
    test_count = 0

    for order_index, (lesson_id, title, filename, prerequisites, expected_exercise_count) in enumerate(EXPECTED_LESSONS, start=1):
        lesson = lesson_by_id[lesson_id]
        assert_equal(lesson["orderIndex"], order_index, f"Sai thứ tự {lesson_id}")
        assert_equal(lesson["title"], title, f"Sai tiêu đề {lesson_id}")

        document = (LESSON_DIR / filename).read_text(encoding="utf-8-sig")
        assert_equal(normalized(lesson["content"]), normalized(document), f"Nội dung seed lệch tài liệu {lesson_id}")
        assert f'lessonId: "{lesson_id}"' in document, f"Frontmatter sai lessonId tại {filename}"
        prerequisite_text = json.dumps(prerequisites, ensure_ascii=False)
        assert f"prerequisites: {prerequisite_text}" in document, f"Sai điều kiện tiên quyết tại {filename}"

        exercises = lesson.get("codingExercises", [])
        assert_equal(len(exercises), expected_exercise_count, f"Sai số lượng bài luyện sau {lesson_id}")
        for exercise in exercises:
            exercise_count += 1
            test_count += run_exercise(lesson_id, exercise)

    practice_specs = [
        ("LS-03.MP_FOR", "btFor.md", 15),
        ("LS-03.MP_WHILE", "btWhile.md", 15),
    ]
    for lesson_id, filename, expected_count in practice_specs:
        lesson = lesson_by_id[lesson_id]
        document = (PRACTICE_DIR / filename).read_text(encoding="utf-8-sig")
        assert_equal(normalized(lesson["content"]), normalized(document), f"Nội dung seed lệch tài liệu {lesson_id}")
        exercises = lesson.get("codingExercises", [])
        assert_equal(len(exercises), expected_count, f"Sai số lượng bài tập {lesson_id}")

        titles = [str(exercise["title"]) for exercise in exercises]
        assert_equal(len(titles), len(set(titles)), f"Trùng tên bài tập trong {lesson_id}")
        for exercise in exercises:
            exercise_count += 1
            test_count += run_exercise(lesson_id, exercise)

    graph_paths = [
        ROOT / "ai-service/data/skill_graph.json",
        ROOT / "ai-service/data/pythonSkillGraph.json",
        ROOT / "backend/src/infrastructure/data/pythonSkillGraph.json",
        ROOT / "frontend/src/data/pythonSkillGraph.json",
    ]
    graphs = [json.loads(path.read_text(encoding="utf-8-sig")) for path in graph_paths]
    for graph in graphs[1:]:
        assert_equal(graph, graphs[0], "Các bản sao skill graph không đồng bộ")

    expected_skill_map = {
        "LS-03.01": "PY-FLOW-03",
        "LS-03.02": "PY-FLOW-03",
        "LS-03.03": "PY-FLOW-03",
        "LS-03.04": "PY-FLOW-02",
        "LS-03.05": "PY-FLOW-04",
        "LS-03.06": "PY-FLOW-01",
        "LS-03.07": "PY-FLOW-03",
        "LS-03.08": "PY-FLOW-03",
    }
    for lesson_id, skill_id in expected_skill_map.items():
        assert_equal(graphs[0]["lesson_mappings"][lesson_id], skill_id, f"Sai ánh xạ kỹ năng {lesson_id}")

    print(
        f"OK: 8 lessons in sequence; {exercise_count} exercises; "
        f"{test_count} test cases passed; 4 skill graphs synchronized."
    )


if __name__ == "__main__":
    main()
