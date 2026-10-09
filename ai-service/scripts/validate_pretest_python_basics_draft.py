"""Technical-only check of the quarantined Python Basics pre-test draft.

Never promotes items into the serving bank. Content validity and runner QC
still require independent review before any learner can see these questions.
"""

from __future__ import annotations

import ast
import hashlib
import json
import subprocess
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DRAFT = ROOT / "backend/src/infrastructure/data/pretestBank.pythonBasics.draft.json"
GRAPH = ROOT / "backend/src/infrastructure/data/pythonSkillGraph.json"
QUOTA = {"CONCEPT": 3, "TRACING": 4, "BUG_HUNTING": 2, "PRACTICAL": 3}
GATEWAYS = {"PY-BASICS-01", "PY-BASICS-03", "PY-STRING-02", "PY-FLOW-01", "PY-FLOW-03"}
ALLOWED_AST = {
    ast.Module, ast.Assign, ast.AugAssign, ast.Expr, ast.If, ast.For,
    ast.While, ast.Continue, ast.Call, ast.Name, ast.Constant,
    ast.BinOp, ast.UnaryOp, ast.Subscript, ast.Slice,
    ast.Compare, ast.Load, ast.Store, ast.Add, ast.Sub, ast.Mult,
    ast.Mod, ast.Eq, ast.GtE, ast.Lt, ast.USub,
}
ALLOWED_CALLS = {"print", "input", "int", "range"}


def run_small_python(code: str, input_text: str = "") -> tuple[int, str]:
    """Run only this draft's restricted beginner syntax in an isolated process."""
    tree = ast.parse(code)
    for node in ast.walk(tree):
        if type(node) not in ALLOWED_AST:
            raise ValueError(f"DISALLOWED_SYNTAX:{type(node).__name__}")
        if isinstance(node, ast.Call) and (
            not isinstance(node.func, ast.Name) or node.func.id not in ALLOWED_CALLS
        ):
            raise ValueError("DISALLOWED_CALL")
    completed = subprocess.run(
        [sys.executable, "-I", "-c", code], input=input_text,
        text=True, capture_output=True, timeout=1.0, check=False,
    )
    return completed.returncode, completed.stdout


def validate_draft() -> dict:
    raw = DRAFT.read_bytes()
    data = json.loads(raw)
    graph = json.loads(GRAPH.read_text(encoding="utf-8"))
    issues: list[str] = []
    if (data.get("schemaVersion") != "learnpython-pretest-bank-draft/1.0.0"
        or data.get("language") != "PYTHON" or data.get("graphVersion") != graph.get("version")
        or data.get("goalId") != "GOAL_PY_BASICS" or data.get("servingEligible") is not False
        or data.get("reviewStatus") != "REVIEW_REQUIRED"):
        issues.append("DRAFT_SCOPE_INVALID")
    items = data.get("items", [])
    if not isinstance(items, list):
        items = []
        issues.append("ITEMS_NOT_ARRAY")
    counts = Counter(item.get("questionType") for item in items)
    if {kind: counts[kind] for kind in QUOTA} != QUOTA or len(items) != 12:
        issues.append("BLUEPRINT_MISMATCH")
    ids = [item.get("id") for item in items]
    families = [item.get("questionFamilyId") for item in items]
    if len(set(ids)) != len(items) or len(set(families)) != len(items):
        issues.append("DUPLICATE_ID_OR_FAMILY")
    goal_skills = {row["id"] for row in graph["skills"] if row["module_id"] in {"MOD-BASICS", "MOD-FLOW"}}
    primary_skills = {item.get("primarySkillId") for item in items}
    if not GATEWAYS.issubset(primary_skills):
        issues.append("GATEWAY_COVERAGE_MISSING")
    technical_cases = 0
    wrong_solutions_caught = 0
    for item in items:
        item_id = str(item.get("id", "UNKNOWN"))
        if item.get("primarySkillId") not in goal_skills or any(
            skill not in goal_skills for skill in item.get("secondarySkillIds", [])
        ):
            issues.append(f"{item_id}:SKILL_OUTSIDE_GOAL")
        if not item.get("prompt") or not item.get("sourceRefs"):
            issues.append(f"{item_id}:MISSING_AUTHORING_CONTEXT")
        kind = item.get("questionType")
        if kind != "PRACTICAL":
            options = item.get("options", [])
            keys = [option.get("key") for option in options]
            if len(options) != 4 or len(set(keys)) != 4 or keys.count(item.get("correctOption")) != 1:
                issues.append(f"{item_id}:ANSWER_KEY_INVALID")
                correct_text = None
            else:
                correct_text = next(option["text"] for option in options
                                    if option["key"] == item["correctOption"])
            if not item.get("rationale"):
                issues.append(f"{item_id}:RATIONALE_MISSING")
            code = item.get("traceCode") if kind == "TRACING" else item.get("fixedCode")
            if code:
                try:
                    exit_code, output = run_small_python(code)
                    technical_cases += 1
                    if exit_code != 0 or output != item.get("expectedStdout"):
                        issues.append(f"{item_id}:EXPECTED_OUTPUT_MISMATCH")
                    if kind == "TRACING" and correct_text != output.strip():
                        issues.append(f"{item_id}:ANSWER_KEY_OUTPUT_MISMATCH")
                    if kind == "BUG_HUNTING" and (not isinstance(correct_text, str) or correct_text not in code):
                        issues.append(f"{item_id}:FIX_NOT_IN_REFERENCE")
                except (SyntaxError, ValueError, subprocess.TimeoutExpired):
                    issues.append(f"{item_id}:CODE_NOT_VALIDATED")
        else:
            cases = item.get("testCases", [])
            if len(cases) < 3 or not any(not case.get("isHidden") for case in cases) or not any(
                case.get("isHidden") for case in cases
            ):
                issues.append(f"{item_id}:TEST_COVERAGE_INSUFFICIENT")
            if item.get("runnerSpec", {}).get("mode") != "STDIN_STDOUT":
                issues.append(f"{item_id}:RUNNER_SPEC_INVALID")
            wrong_caught = False
            for case in cases:
                try:
                    exit_code, output = run_small_python(item["referenceSolution"], case["input"])
                    technical_cases += 1
                    if exit_code != 0 or output != case["expectedStdout"]:
                        issues.append(f"{item_id}:REFERENCE_FAILED")
                    wrong_code, wrong_output = run_small_python(item["knownIncorrectSolution"], case["input"])
                    if wrong_code != 0 or wrong_output != case["expectedStdout"]:
                        wrong_caught = True
                except (KeyError, SyntaxError, ValueError, subprocess.TimeoutExpired):
                    issues.append(f"{item_id}:RUNNER_CHECK_FAILED")
            if wrong_caught:
                wrong_solutions_caught += 1
            else:
                issues.append(f"{item_id}:KNOWN_WRONG_SOLUTION_NOT_CAUGHT")
    return {
        "status": "DRAFT_TECHNICAL_CHECK_PASSED" if not issues else "DRAFT_TECHNICAL_CHECK_FAILED",
        "draftSha256": hashlib.sha256(raw).hexdigest(),
        "questionCount": len(items),
        "byType": {kind: counts[kind] for kind in QUOTA},
        "gatewaySkillsCovered": len(GATEWAYS & primary_skills),
        "goalSkillsCovered": len(goal_skills & primary_skills),
        "technicalCasesPassed": technical_cases if not issues else None,
        "knownWrongSolutionsCaught": wrong_solutions_caught,
        "contentApproved": False,
        "servingEligible": False,
        "issues": issues,
    }


if __name__ == "__main__":
    result = validate_draft()
    print(json.dumps(result, ensure_ascii=False, sort_keys=True))
    raise SystemExit(0 if result["status"] == "DRAFT_TECHNICAL_CHECK_PASSED" else 1)
