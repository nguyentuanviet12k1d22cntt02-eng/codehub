"""Real provider + EC2 replay of the two diagnosed failures. No learner data/writes."""
import copy
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from app.agents.adaptive_exercise_planner import AdaptiveExercisePlanner
from app.agents.exercise_generator_agent import ExerciseGeneratorAgent
from app.contracts.routing import RoutingDecision
from app.pipeline.llm_client import PipelineLLMClient
from app.pipeline.problem_statement import format_statement
from app.validation.schema_validator import SchemaValidator
from app.validation.ast_constraint_validator import AstConstraintValidator
from app.validation.sandbox_validator import SandboxValidator


def main():
    route = RoutingDecision(intent="REQUEST_ADAPTIVE_EXERCISE", language="python", topic="PY-FLOW-03",
        topic_match="matched", user_text="Tạo 1 bài tập for range tính tổng số chẵn bằng Python", required_constructs=["for"])
    spec = AdaptiveExercisePlanner().plan_exercise(route, "isolated-repair-qa", "PY-FLOW-03",
        {"force_prerequisite_override": True})
    draft = {
        "title": "Tổng số chẵn trong khoảng",
        "problem_statement": "## Mô tả\nTính tổng các số chẵn trong khoảng từ a đến b, kể cả hai đầu mút. "
                             "Chương trình phải sử dụng vòng lặp for.\n\n## Input\nMột dòng chứa hai số nguyên a và b."
                             "\n\n## Output\nMột số nguyên là tổng các số chẵn trong khoảng đã cho.",
        "quick_theory": "Vòng lặp for duyệt các giá trị của range để cộng dồn các số thỏa điều kiện.",
        "starter_code": "# TODO: đọc hai số nguyên, dùng for và in kết quả",
        "reference_solution": "a, b = map(int, input().split())\ntong = 0\nfor i in range(a, b + 1):\n    if i % 2 == 0:\n        tong += i\nprint(tong)",
        "test_cases": [{"input": text, "expected_output": expected, "is_hidden": index >= 2,
                        "category": "boundary" if index in (1, 2) else "normal",
                        "explanation": "Tính tổng các số chẵn trong khoảng."}
                       for index, (text, expected) in enumerate([("1 5\n", "6"), ("2 2\n", "2"),
                                                               ("1 1\n", "0"), ("10 20\n", "75")])],
        "hints": {"scaffold_1_conceptual": "Cộng các số thỏa điều kiện vào biến tổng.",
                  "scaffold_2_syntax": "Dùng for với range để duyệt khoảng.",
                  "scaffold_3_pseudocode": "Đọc khoảng, duyệt và cộng số chẵn, in tổng."},
        "constraints": ["1 <= a <= b <= 1000"], "common_pitfall_warning": "Khoảng bao gồm cả b.",
        "statement_format_version": 2,
    }
    draft["problem_statement"] = format_statement(draft, "stdio")
    assert SchemaValidator.validate(draft, spec)[0]
    assert AstConstraintValidator.validate(draft, spec)[0]
    passed, errors, cases = SandboxValidator.validate(draft, spec, 60)
    assert not passed and [case["case_index"] for case in cases if not case["passed"]] == [4]
    client = PipelineLLMClient(timeout_seconds=300)
    generator = ExerciseGeneratorAgent(client)
    fixed = generator.generate(spec, {"validation_stage": "SandboxValidator", "errors": errors, "test_results": cases}, draft)
    assert fixed["test_cases"][3]["expected_output"].strip() == "90"
    assert fixed["reference_solution"] == draft["reference_solution"]
    assert fixed["problem_statement"] == draft["problem_statement"]
    assert [case["input"] for case in fixed["test_cases"]] == [case["input"] for case in draft["test_cases"]]
    assert SchemaValidator.validate(fixed, spec)[0]
    assert AstConstraintValidator.validate(fixed, spec)[0]
    passed, errors, cases = SandboxValidator.validate(fixed, spec, 60)
    assert passed and all(case["executed"] and case["image"] == "aws-docker" for case in cases)
    short = copy.deepcopy(fixed)
    short["problem_statement"] = short["problem_statement"].replace(
        "Tính tổng các số chẵn trong khoảng từ a đến b, kể cả hai đầu mút. Chương trình phải sử dụng vòng lặp for.",
        "Tính tổng các số chẵn từ a đến b, gồm hai đầu mút, bằng vòng lặp for.")
    passed, errors = SchemaValidator.validate(short, spec)
    assert not passed
    assert errors == ["Mô tả cần 2–4 câu ngắn, chỉ nêu nhiệm vụ lập trình."]
    repaired = generator.generate(spec, {"validation_stage": "SchemaValidator", "errors": errors}, short)
    assert SchemaValidator.validate(repaired, spec)[0]
    assert repaired["reference_solution"] == fixed["reference_solution"]
    assert repaired["test_cases"] == fixed["test_cases"]
    wording = copy.deepcopy(fixed)
    wording["problem_statement"] = wording["problem_statement"].replace(
        "Chương trình phải sử dụng vòng lặp for.", "In kết quả tính được ra màn hình.")
    passed, errors = SchemaValidator.validate(wording, spec)
    assert not passed and errors == ["Đề bài phải nói rõ học viên cần luyện vòng lặp for."]
    wording_fixed = generator.generate(spec, {"validation_stage": "SchemaValidator", "errors": errors}, wording)
    assert SchemaValidator.validate(wording_fixed, spec)[0]
    assert wording_fixed["reference_solution"] == fixed["reference_solution"]
    assert wording_fixed["test_cases"] == fixed["test_cases"]
    print(json.dumps({"status": "PASSED", "expected_output_repair": "verified_on_ec2", "ec2_cases": len(cases),
                      "statement_repair": "schema_passed_code_and_tests_unchanged",
                      "missing_for_wording_repair": "schema_passed_code_and_tests_unchanged", "calls": [
                          {key: call.get(key) for key in ("provider", "model", "status", "error_code", "duration_ms")}
                          for call in client.calls]}, ensure_ascii=False))


if __name__ == "__main__":
    main()
