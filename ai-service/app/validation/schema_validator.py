import json
from app.pipeline.contracts import ExerciseDraft


class SchemaValidator:
    @classmethod
    def validate(cls, exercise_data, spec=None):
        try:
            draft = ExerciseDraft.model_validate(exercise_data)
        except Exception as exc:
            return False, [str(exc)[:1600]]
        errors = []
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
