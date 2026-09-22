import ast
import re
from typing import Dict, Any, List, Tuple
from app.contracts.specification import ExerciseSpecification


class AstConstraintValidator:
    """
    Tầng kiểm định 2: Phân tích AST & Ràng buộc cú pháp (AST & Constraint Validator).
    Deterministic 100% - Không dùng LLM.
    Kiểm tra nghiệm mẫu (reference_solution) và mã khởi tạo (starter_code) có thỏa mãn
    required_constructs và forbidden_constructs trong ExerciseSpecification hay không.
    """

    @classmethod
    def validate(cls, exercise_data: Dict[str, Any], spec: ExerciseSpecification) -> Tuple[bool, List[str]]:
        errors = []
        code = exercise_data.get("reference_solution", "")
        lang = spec.language.lower()

        if not code.strip():
            return False, ["reference_solution không có mã nguồn."]

        # 1. Kiểm tra bằng Python AST nếu ngôn ngữ là Python
        if lang == "python":
            cls._validate_python_ast(code, spec, errors)
            cls._validate_python_invocation_contract(code, exercise_data, spec, errors)
        elif lang == "javascript":
            cls._validate_js_constructs(code, spec, errors)
        elif lang == "cpp":
            cls._validate_cpp_constructs(code, spec, errors)

        is_valid = len(errors) == 0
        return is_valid, errors

    @classmethod
    def _validate_python_ast(cls, code: str, spec: ExerciseSpecification, errors: List[str]):
        try:
            tree = ast.parse(code)
        except SyntaxError as e:
            errors.append(f"Nghiệm mẫu reference_solution bị lỗi cú pháp Python (SyntaxError): {e.msg} ở dòng {e.lineno}.")
            return

        has_func = any(isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)) for node in ast.walk(tree))
        has_class = any(isinstance(node, ast.ClassDef) for node in ast.walk(tree))
        has_for = any(isinstance(node, ast.For) for node in ast.walk(tree))
        has_while = any(isinstance(node, ast.While) for node in ast.walk(tree))
        has_return = any(isinstance(node, ast.Return) for node in ast.walk(tree))
        has_lambda = any(isinstance(node, ast.Lambda) for node in ast.walk(tree))
        has_global = any(isinstance(node, ast.Global) for node in ast.walk(tree))

        # Kiểm tra Required Constructs
        for req in spec.required_constructs:
            r = req.lower().strip()
            if r in ("function", "def") and not has_func:
                errors.append("Đặc tả bài tập yêu cầu định nghĩa hàm (def/function), nhưng reference_solution không có.")
            elif r == "class" and not has_class:
                errors.append("Đặc tả bài tập yêu cầu định nghĩa lớp (class OOP), nhưng reference_solution không có.")
            elif r in ("for", "loop") and not has_for:
                errors.append("Đặc tả bài tập yêu cầu dùng vòng lặp 'for', nhưng reference_solution không có.")
            elif r == "while" and not has_while:
                errors.append("Đặc tả bài tập yêu cầu dùng vòng lặp 'while', nhưng reference_solution không có.")
            elif r == "return" and not has_return:
                errors.append("Đặc tả bài tập yêu cầu hàm phải có lệnh 'return' giá trị, nhưng reference_solution không có.")
            elif r == "parameter":
                # Kiểm tra hàm có nhận tham số không
                param_found = False
                for node in ast.walk(tree):
                    if isinstance(node, ast.FunctionDef) and len(node.args.args) > 0:
                        param_found = True
                        break
                if not param_found:
                    errors.append("Đặc tả bài tập yêu cầu hàm phải nhận tham số (parameters), nhưng hàm không có tham số nào.")

        # Kiểm tra Forbidden Constructs
        for forb in spec.forbidden_constructs:
            f = forb.lower().strip()
            if f == "class" and has_class:
                errors.append("Đặc tả cấm dùng 'class' (bài tập ở cấp độ cơ bản), nhưng reference_solution lại dùng class.")
            elif f == "lambda" and has_lambda:
                errors.append("Đặc tả cấm dùng biểu thức 'lambda', nhưng reference_solution lại dùng lambda.")
            elif f == "global" and has_global:
                errors.append("Đặc tả cấm dùng từ khóa 'global', nhưng reference_solution lại dùng global.")

    @classmethod
    def _validate_python_invocation_contract(cls, code: str, exercise_data: Dict[str, Any], spec: ExerciseSpecification, errors: List[str]):
        """Catch an incompatible function signature before a Docker execution.

        This is deliberately a preflight check only.  Docker remains the
        execution authority, but a known mismatch is returned as a precise
        repair instruction instead of a generic runtime failure.
        """
        if spec.execution.get("mode") != "function":
            return
        try:
            tree = ast.parse(code)
        except SyntaxError:
            return
        entrypoint = spec.execution.get("entrypoint", "solution")
        function = next((node for node in tree.body if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)) and node.name == entrypoint), None)
        if not function:
            errors.append(f"INVOCATION_ENTRYPOINT_NOT_FOUND:{entrypoint}")
            return
        positional = list(function.args.posonlyargs) + list(function.args.args)
        minimum = len(positional) - len(function.args.defaults)
        maximum = None if function.args.vararg else len(positional)
        for index, test in enumerate(exercise_data.get("test_cases", [])):
            arguments = test.get("arguments")
            style = test.get("call_style")
            if not isinstance(arguments, list) or style not in ("spread", "single"):
                continue
            supplied = len(arguments) if style == "spread" else 1
            if supplied < minimum or (maximum is not None and supplied > maximum):
                errors.append(
                    f"INVOCATION_ARITY_MISMATCH:test_cases[{index}] {style} truyền {supplied} đối số, "
                    f"nhưng {entrypoint} nhận {minimum}" + (f"..{maximum}" if maximum != minimum else "") + "."
                )

    @classmethod
    def _validate_js_constructs(cls, code: str, spec: ExerciseSpecification, errors: List[str]):
        has_func = bool(re.search(r"\bfunction\b|\=\>\s*\{?", code))
        has_class = bool(re.search(r"\bclass\s+\w+", code))
        has_for = bool(re.search(r"\bfor\s*\(", code))
        has_while = bool(re.search(r"\bwhile\s*\(", code))
        has_return = bool(re.search(r"\breturn\b", code))

        for req in spec.required_constructs:
            r = req.lower().strip()
            if r in ("function", "def") and not has_func:
                errors.append("Đặc tả yêu cầu dùng 'function', nhưng code JS không có định nghĩa hàm.")
            elif r == "class" and not has_class:
                errors.append("Đặc tả yêu cầu dùng 'class ES6', nhưng code JS không có class.")
            elif r in ("for", "loop") and not has_for:
                errors.append("Đặc tả yêu cầu dùng vòng lặp 'for', nhưng code JS không có.")
            elif r == "return" and not has_return:
                errors.append("Đặc tả yêu cầu hàm phải có 'return', nhưng code JS không có.")

        for forb in spec.forbidden_constructs:
            f = forb.lower().strip()
            if f == "class" and has_class:
                errors.append("Đặc tả cấm dùng 'class', nhưng code JS lại chứa class.")
            elif f == "var" and re.search(r"\bvar\s+\w+", code):
                errors.append("Đặc tả cấm dùng 'var' (ưu tiên let/const), nhưng code JS lại dùng var.")

    @classmethod
    def _validate_cpp_constructs(cls, code: str, spec: ExerciseSpecification, errors: List[str]):
        has_class = bool(re.search(r"\bclass\s+\w+|\bstruct\s+\w+", code))
        has_func = bool(re.search(r"\w+\s+\w+\s*\([^)]*\)\s*\{", code))

        for req in spec.required_constructs:
            r = req.lower().strip()
            if r == "class" and not has_class:
                errors.append("Đặc tả yêu cầu dùng 'class/struct' trong C++, nhưng code không có.")

        for forb in spec.forbidden_constructs:
            f = forb.lower().strip()
            if f == "pointer" and re.search(r"\*\s*\w+|\w+\s*\*", code):
                errors.append("Đặc tả cấm dùng con trỏ thô (raw pointer), nhưng code C++ chứa dấu '*'.")
