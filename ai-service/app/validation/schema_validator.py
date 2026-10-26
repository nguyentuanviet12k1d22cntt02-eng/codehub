import ast
import json
import re
from app.pipeline.contracts import ExerciseDraft
from app.pipeline.problem_statement import validate_statement, validate_task_wording


class SchemaValidator:
    @classmethod
    def validate(cls, exercise_data, spec=None):
        try:
            draft = ExerciseDraft.model_validate(exercise_data)
        except Exception as exc:
            return False, [str(exc)[:1600]]
        errors = []
        if draft.statement_format_version == 2:
            errors.extend(validate_statement(draft, spec.execution.get("mode", "stdio") if spec else "stdio"))
        tests = draft.test_cases
        if draft.starter_code.strip() == draft.reference_solution.strip():
            errors.append("starter_code trùng reference_solution. Starter phải là khung TODO, không chứa nghiệm mẫu.")
        if not any(t.is_hidden for t in tests) or not any(not t.is_hidden for t in tests):
            errors.append("Cần cả test công khai và test ẩn")
        if not any(t.category == "boundary" for t in tests):
            errors.append("Thiếu test dữ liệu biên")
        signatures = [(json.dumps(t.arguments, ensure_ascii=False, sort_keys=True, default=str), t.input, t.fixture_sql) for t in tests]
        if len(set(signatures)) != len(signatures):
            errors.append("Test bị lặp đầu vào/fixture")
        if spec:
            errors.extend(validate_task_wording(draft, spec))
            if spec.language == "python" and spec.learner_evidence.get("avoid_function_syntax"):
                for field in ("starter_code", "reference_solution"):
                    try:
                        tree = ast.parse(getattr(draft, field))
                    except SyntaxError:
                        continue  # The syntax validator reports the exact location.
                    if any(isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.Lambda))
                           for node in ast.walk(tree)):
                        errors.append(f"{field} đòi hỏi hàm khi học viên chưa học hàm; dùng chương trình stdin/stdout.")
            if spec.learner_evidence.get("avoid_function_syntax"):
                descriptions = [draft.problem_statement, draft.quick_theory, *draft.constraints,
                                *draft.hints.model_dump().values()]
                if any(re.search(r"\bsolution\s*\(|\bdef\s+\w+\s*\(|\bfunction\s+\w+\s*\(", text)
                       for text in descriptions):
                    errors.append("Đề hoặc gợi ý đòi hỏi khai báo hàm khi học viên chưa học hàm.")
            for index, tc in enumerate(tests):
                if spec.execution.get("mode") == "function":
                    if tc.input is not None:
                        errors.append(f"test_cases[{index}].input không được dùng cho function; hãy dùng arguments có kiểu dữ liệu.")
                    if not isinstance(tc.arguments, list):
                        errors.append(f"test_cases[{index}].arguments phải là JSON array.")
                    if tc.call_style not in ("spread", "single"):
                        errors.append(f"test_cases[{index}].call_style phải là spread hoặc single.")
                    elif tc.call_style == "single" and len(tc.arguments or []) != 1:
                        errors.append(f"test_cases[{index}].call_style=single yêu cầu đúng một arguments.")
                elif tc.arguments is not None or tc.call_style is not None:
                    errors.append(f"test_cases[{index}] chỉ function mới được có arguments/call_style.")
                elif not isinstance(tc.input, str):
                    errors.append(f"test_cases[{index}].input phải là chuỗi cho stdio hoặc SQL.")
                if spec.execution.get("comparator") == "json":
                    try:
                        expected = json.loads(tc.expected_output)
                        if spec.language == "sql" and (not isinstance(expected, list) or any(not isinstance(row, list) for row in expected)):
                            errors.append(f"test_cases[{index}].expected_output của SQL phải là JSON mảng các hàng.")
                    except (ValueError, TypeError):
                        errors.append(f'test_cases[{index}].expected_output không phải JSON hợp lệ: {tc.expected_output[:120]!r}. '
                                      'Dùng nháy kép JSON: [["Lan"]], tuyệt đối không dùng dạng Python [[\'Lan\']].')
                if spec.language == "sql" and not tc.fixture_sql:
                    errors.append(f"test_cases[{index}].fixture_sql: mỗi SQL test cần fixture riêng.")
            if len(tests) < spec.test_constraints.get("min_cases", 4):
                errors.append("Chưa đủ số test theo đặc tả")
        return not errors, errors
