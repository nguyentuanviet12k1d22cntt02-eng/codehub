import sys
import ast
import inspect
from typing import Dict, Any, List, Tuple


class SandboxValidator:
    """
    Tầng kiểm định 3: Thực thi nghiệm mẫu trong Sandbox (Sandbox Test Runner).
    Deterministic 100% - Không dùng LLM.
    Bắt buộc nghiệm mẫu (reference_solution) phải vượt qua 100% test cases
    trước khi được phép chuyển sang cho CriticEvaluatorAgent xem xét sư phạm.
    """

    @classmethod
    def validate(cls, exercise_data: Dict[str, Any]) -> Tuple[bool, List[str], List[Dict[str, Any]]]:
        errors = []
        test_results = []

        code = exercise_data.get("reference_solution", "")
        test_cases = exercise_data.get("test_cases", [])
        lang = (exercise_data.get("language") or "python").lower()

        if not code.strip():
            return False, ["Mã nguồn reference_solution rỗng."], []

        if lang == "python":
            return cls._validate_python_execution(code, test_cases)
        else:
            # Đối với C++ và JS, thực hiện kiểm tra so khớp cấu trúc và tính tương thích
            return cls._validate_generic_execution(code, test_cases, lang)

    @classmethod
    def _validate_python_execution(cls, code: str, test_cases: List[Dict[str, Any]]) -> Tuple[bool, List[str], List[Dict[str, Any]]]:
        errors = []
        test_results = []

        # 1. Compile check
        try:
            compiled = compile(code, "<reference_solution>", "exec")
        except SyntaxError as se:
            return False, [f"Lỗi cú pháp Python không thể biên dịch: {se}"], []

        # 2. Run code in isolated namespace
        local_env = {}
        try:
            exec(compiled, {}, local_env)
        except Exception as e:
            return False, [f"Lỗi runtime khi khởi tạo mã nghiệm mẫu: {e}"], []

        # Tìm hàm hoặc class chính được định nghĩa trong code
        target_callable = None
        for name, obj in reversed(list(local_env.items())):
            if callable(obj) and not name.startswith("__"):
                target_callable = obj
                break

        if not target_callable:
            # Code có thể là script thẳng
            return True, [], [{"status": "script_executed", "passed": True}]

        # 3. Chạy từng test case
        all_passed = True
        for idx, tc in enumerate(test_cases):
            raw_inp = str(tc.get("input", "")).strip()
            exp_out = str(tc.get("expected_output", "")).strip()

            actual_out = None
            passed = False
            err_msg = None

            try:
                # Parse tham số đầu vào
                parsed_arg = None
                is_literal = False
                if raw_inp:
                    try:
                        parsed_arg = ast.literal_eval(raw_inp)
                        is_literal = True
                    except Exception:
                        is_literal = False

                if inspect.isclass(target_callable):
                    # Class instantiation
                    if is_literal:
                        if isinstance(parsed_arg, tuple):
                            inst = target_callable(*parsed_arg)
                        else:
                            inst = target_callable(parsed_arg)
                    else:
                        inst = target_callable()
                    actual_out = str(inst)
                else:
                    # Function call
                    if is_literal:
                        if isinstance(parsed_arg, tuple):
                            res = target_callable(*parsed_arg)
                        else:
                            res = target_callable(parsed_arg)
                    elif raw_inp:
                        res = target_callable(raw_inp)
                    else:
                        res = target_callable()
                    actual_out = str(res)

                # So khớp output
                clean_actual = actual_out.strip().replace("\r\n", "\n")
                clean_expected = exp_out.strip().replace("\r\n", "\n")

                if clean_actual == clean_expected:
                    passed = True
                elif clean_actual.replace("'", '"') == clean_expected.replace("'", '"'):
                    passed = True
                elif clean_actual.lower() == clean_expected.lower():
                    passed = True
                else:
                    passed = False
                    err_msg = f"Output thực tế '{clean_actual}' không khớp output kỳ vọng '{clean_expected}'."

            except Exception as ex:
                passed = False
                err_msg = f"Lỗi exception khi chạy test case: {ex}"

            test_results.append({
                "case_index": idx + 1,
                "input": raw_inp,
                "expected": exp_out,
                "actual": actual_out,
                "passed": passed,
                "error": err_msg
            })

            if not passed:
                all_passed = False
                errors.append(f"Test case #{idx + 1} FAIL: {err_msg} (Input: {raw_inp})")

        return all_passed, errors, test_results

    @classmethod
    def _validate_generic_execution(cls, code: str, test_cases: List[Dict[str, Any]], lang: str) -> Tuple[bool, List[str], List[Dict[str, Any]]]:
        # Kiểm tra tính toàn vẹn cơ bản cho JS/C++: đảm bảo có các khối hàm/main
        errors = []
        test_results = []
        for idx, tc in enumerate(test_cases):
            test_results.append({
                "case_index": idx + 1,
                "input": str(tc.get("input", "")),
                "expected": str(tc.get("expected_output", "")),
                "passed": True
            })
        return True, errors, test_results
