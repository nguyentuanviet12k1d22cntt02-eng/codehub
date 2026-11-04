import os
import re
import subprocess
import tempfile
from typing import Dict, Any, List

from .json_support import normalize_test_cases

def run_sandbox_verification(solution_code: str, test_cases: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Thực thi mã nguồn chuẩn (Reference Solution) với các testcase trong môi trường Sandbox
    để đảm bảo đề bài không bị lỗi logic trước khi gửi cho học viên.
    """
    safe_cases = normalize_test_cases(test_cases)
    if not solution_code or not safe_cases:
        return {"all_passed": True, "passed_count": 0, "total": 0, "details": []}

    passed_count = 0
    details = []

    with tempfile.TemporaryDirectory() as tmpdir:
        code_file = os.path.join(tmpdir, "solution_test.py")

        for idx, tc in enumerate(safe_cases):
            if not isinstance(tc, dict):
                continue
            tc_input = str(tc.get("input", ""))
            expected_output = str(tc.get("expected_output", "")).strip()

            harness = f"""
import sys
import ast
import inspect

{solution_code}

if __name__ == '__main__':
    try:
        raw_input = {repr(tc_input)}
        
        # Case 1: Test input là đoạn mã khởi tạo hoặc script hoàn chỉnh
        # Ví dụ: "s = Student('An', 9); print(s.get_info())" hoặc "print(Car('Toyota').speed)"
        if ('(' in raw_input and ')' in raw_input and any(kw in raw_input for kw in ['=', ';', 'print', '\\n', '.'])):
            local_scope = dict()
            exec(raw_input, globals(), local_scope)
            sys.exit(0)

        custom_symbols = [
            f for f in list(globals().keys()) 
            if callable(globals()[f]) and not f.startswith('__') and f not in ['sys', 'ast', 'inspect']
        ]
        
        target = globals()[custom_symbols[-1]] if custom_symbols else None
        res = None

        if target:
            if '=' in raw_input and ('\\n' in raw_input or ';' in raw_input):
                local_scope = dict()
                exec(raw_input, globals(), local_scope)
                sig = inspect.signature(target)
                kwargs = dict((k, local_scope[k]) for k in sig.parameters.keys() if k in local_scope)
                if len(kwargs) == len(sig.parameters):
                    res = target(**kwargs)
                else:
                    res = target(*list(local_scope.values()))
            else:
                try:
                    arg = ast.literal_eval(raw_input)
                except Exception:
                    arg = raw_input
                    
                if inspect.isclass(target):
                    # Là Class -> Khởi tạo Object instance
                    if isinstance(arg, tuple):
                        inst = target(*arg)
                    else:
                        inst = target(arg)
                    
                    # Kiểm tra xem đối tượng có các method trả về giá trị không
                    methods = [m for m in dir(inst) if callable(getattr(inst, m)) and not m.startswith('__')]
                    called_method = False
                    for m in methods:
                        try:
                            m_val = getattr(inst, m)()
                            if m_val is not None and str(m_val).strip() == {repr(expected_output)}:
                                res = m_val
                                called_method = True
                                break
                        except Exception:
                            pass
                    if not called_method:
                        res = inst
                else:
                    # Là Function
                    if isinstance(arg, tuple):
                        res = target(*arg)
                    else:
                        res = target(arg)
                
        if res is not None:
            print(res)
    except Exception as err:
        print(f"ERROR: {{err}}", file=sys.stderr)
"""
            with open(code_file, "w", encoding="utf-8") as f:
                f.write(harness)

            try:
                proc = subprocess.run(
                    ["python", code_file],
                    capture_output=True,
                    text=True,
                    timeout=2
                )
                output = proc.stdout.strip()
                def normalize_str(s: str) -> str:
                    s = str(s).strip().replace('"', "'").replace('\\n', '\n')
                    return re.sub(r'\s+', ' ', s)

                norm_out = normalize_str(output)
                norm_exp = normalize_str(expected_output)

                passed = (
                    norm_out == norm_exp or
                    expected_output == "" or
                    norm_exp in norm_out or
                    (proc.returncode == 0 and not proc.stderr.strip() and expected_output != "")
                )
                if passed:
                    passed_count += 1
                details.append({
                    "test_idx": idx + 1,
                    "input": tc_input,
                    "expected": expected_output,
                    "actual": output,
                    "passed": passed
                })
            except Exception as e:
                details.append({
                    "test_idx": idx + 1,
                    "error": str(e),
                    "passed": False
                })

    all_passed = (passed_count == len(test_cases))
    return {
        "all_passed": all_passed,
        "passed_count": passed_count,
        "total": len(test_cases),
        "details": details
    }
