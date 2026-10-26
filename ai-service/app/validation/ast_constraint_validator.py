import ast
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

        # A forbidden technique in the learner-facing starter is as harmful as
        # one in the hidden reference solution. Required constructs are checked
        # only in the reference: the starter must leave work for the learner.
        starter = exercise_data.get("starter_code", "")
        if starter.strip() and spec.forbidden_constructs:
            starter_spec = spec.model_copy(update={"required_constructs": []})
            starter_errors: List[str] = []
            if lang == "python":
                cls._validate_python_ast(starter, starter_spec, starter_errors)
            elif lang == "javascript":
                cls._validate_js_constructs(starter, starter_spec, starter_errors)
            elif lang == "cpp":
                cls._validate_cpp_constructs(starter, starter_spec, starter_errors)
            errors.extend(f"starter_code: {error}" for error in starter_errors)

        is_valid = len(errors) == 0
        return is_valid, errors

    @classmethod
    def _code_tokens(cls, code: str) -> List[str]:
        """Scan identifiers and punctuation while ignoring comments and literals."""
        tokens = []
        index = 0
        while index < len(code):
            char = code[index]
            following = code[index:index + 2]
            if char.isspace():
                index += 1
            elif following == "//":
                index = code.find("\n", index + 2)
                if index < 0:
                    break
            elif following == "/*":
                end = code.find("*/", index + 2)
                index = len(code) if end < 0 else end + 2
            elif char in ('"', "'", "`"):
                quote = char
                index += 1
                while index < len(code):
                    if code[index] == "\\":
                        index += 2
                    elif code[index] == quote:
                        index += 1
                        break
                    else:
                        index += 1
            elif char.isalpha() or char == "_":
                end = index + 1
                while end < len(code) and (code[end].isalnum() or code[end] == "_"):
                    end += 1
                tokens.append(code[index:end])
                index = end
            else:
                tokens.append(char)
                index += 1
        return tokens

    @staticmethod
    def _has_sequence(tokens: List[str], *items: str) -> bool:
        return any(tokens[index:index + len(items)] == list(items)
                   for index in range(len(tokens) - len(items) + 1))

    @classmethod
    def _validate_python_ast(cls, code: str, spec: ExerciseSpecification, errors: List[str]):
        try:
            tree = ast.parse(code)
        except SyntaxError as e:
            errors.append(f"Nghiệm mẫu reference_solution bị lỗi cú pháp Python (SyntaxError): {e.msg} ở dòng {e.lineno}.")
            return

        has_func = any(isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)) for node in ast.walk(tree))
        has_class = any(isinstance(node, ast.ClassDef) for node in ast.walk(tree))
        has_comprehension = any(isinstance(node, ast.comprehension) for node in ast.walk(tree))
        has_for = has_comprehension or any(isinstance(node, (ast.For, ast.AsyncFor)) for node in ast.walk(tree))
        has_while = any(isinstance(node, ast.While) for node in ast.walk(tree))
        has_return = any(isinstance(node, ast.Return) for node in ast.walk(tree))
        has_lambda = any(isinstance(node, ast.Lambda) for node in ast.walk(tree))
        has_global = any(isinstance(node, ast.Global) for node in ast.walk(tree))
        calls = {node.func.id for node in ast.walk(tree)
                 if isinstance(node, ast.Call) and isinstance(node.func, ast.Name)}
        methods = {node.func.attr for node in ast.walk(tree)
                   if isinstance(node, ast.Call) and isinstance(node.func, ast.Attribute)}

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
            elif r == "lambda" and not has_lambda:
                errors.append("Đặc tả yêu cầu lambda, nhưng reference_solution không có.")
            elif r in ("sum", "sorted") and r not in calls:
                errors.append(f"Đặc tả yêu cầu dùng {r}, nhưng reference_solution không có.")
            elif r == "sort" and "sort" not in methods:
                errors.append("Đặc tả yêu cầu dùng sort, nhưng reference_solution không có.")
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
            elif f in ("function", "def") and has_func:
                errors.append("Đặc tả cấm tự định nghĩa hàm khi học viên chưa học hàm.")
            elif f == "lambda" and has_lambda:
                errors.append("Đặc tả cấm dùng biểu thức 'lambda', nhưng reference_solution lại dùng lambda.")
            elif f == "global" and has_global:
                errors.append("Đặc tả cấm dùng từ khóa 'global', nhưng reference_solution lại dùng global.")
            elif f == "for" and has_for:
                detail = " (list/set/dict comprehension cũng là for)" if has_comprehension else ""
                errors.append(f"Đặc tả cấm dùng vòng lặp for{detail}, nhưng reference_solution lại dùng for."
                              + (" Với bài Set, dùng set(input().split()) trên dữ liệu từ và phép toán tập hợp, không dùng comprehension."
                                 if spec.target_concept == "PY-SET-01" else ""))
            elif f == "while" and has_while:
                errors.append("Đặc tả cấm dùng vòng lặp while, nhưng reference_solution lại dùng while.")
            elif f in ("sum", "sorted") and f in calls:
                errors.append(f"Đặc tả cấm dùng {f}, nhưng reference_solution lại dùng {f}.")
            elif f == "sort" and "sort" in methods:
                errors.append("Đặc tả cấm dùng sort, nhưng reference_solution lại dùng sort.")

    @classmethod
    def _validate_python_invocation_contract(cls, code: str, exercise_data: Dict[str, Any], spec: ExerciseSpecification, errors: List[str]):
        """Catch an incompatible function signature before EC2 Docker execution.

        This preflight returns a precise repair instruction instead of a
        generic runtime failure from the isolated grader.
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
        tokens = cls._code_tokens(code)
        has_func = "function" in tokens or cls._has_sequence(tokens, "=", ">")
        has_class = "class" in tokens
        has_for = cls._has_sequence(tokens, "for", "(")
        has_while = cls._has_sequence(tokens, "while", "(")
        has_return = "return" in tokens
        method_calls = {name for name in ("reduce", "filter", "map", "forEach")
                        if cls._has_sequence(tokens, ".", name, "(")}

        for req in spec.required_constructs:
            r = req.lower().strip()
            if r in ("function", "def") and not has_func:
                errors.append("Đặc tả yêu cầu dùng 'function', nhưng code JS không có định nghĩa hàm.")
            elif r == "class" and not has_class:
                errors.append("Đặc tả yêu cầu dùng 'class ES6', nhưng code JS không có class.")
            elif r in ("for", "loop") and not has_for:
                errors.append("Đặc tả yêu cầu dùng vòng lặp 'for', nhưng code JS không có.")
            elif r == "while" and not has_while:
                errors.append("Đặc tả yêu cầu dùng vòng lặp 'while', nhưng code JS không có.")
            elif r == "return" and not has_return:
                errors.append("Đặc tả yêu cầu hàm phải có 'return', nhưng code JS không có.")
            elif r in ("reduce", "filter", "map", "foreach") and ("forEach" if r == "foreach" else r) not in method_calls:
                errors.append(f"Đặc tả yêu cầu dùng phương thức {r}, nhưng code JS không có.")

        for forb in spec.forbidden_constructs:
            f = forb.lower().strip()
            if f == "class" and has_class:
                errors.append("Đặc tả cấm dùng 'class', nhưng code JS lại chứa class.")
            elif f == "function" and has_func:
                errors.append("Đặc tả cấm tự định nghĩa function khi học viên chưa học hàm.")
            elif f == "var" and "var" in tokens:
                errors.append("Đặc tả cấm dùng 'var' (ưu tiên let/const), nhưng code JS lại dùng var.")
            elif f == "for" and has_for:
                errors.append("Đặc tả cấm dùng vòng lặp for, nhưng code JS lại dùng for.")
            elif f == "while" and has_while:
                errors.append("Đặc tả cấm dùng vòng lặp while, nhưng code JS lại dùng while.")
            elif f in ("reduce", "filter", "map", "foreach") and ("forEach" if f == "foreach" else f) in method_calls:
                errors.append(f"Đặc tả cấm dùng phương thức {f}, nhưng code JS lại dùng {f}.")

    @classmethod
    def _validate_cpp_constructs(cls, code: str, spec: ExerciseSpecification, errors: List[str]):
        tokens = cls._code_tokens(code)
        has_class = "class" in tokens or "struct" in tokens
        has_vector = cls._has_sequence(tokens, "vector", "<") or cls._has_sequence(tokens, "#", "include", "<", "vector", ">")
        has_for = cls._has_sequence(tokens, "for", "(")
        has_while = cls._has_sequence(tokens, "while", "(")
        def calls(method):
            return (cls._has_sequence(tokens, ".", method, "(") or
                    cls._has_sequence(tokens, ":", ":", method, "(") or
                    cls._has_sequence(tokens, "-", ">", method, "("))

        has_iterator = ("iterator" in tokens or "const_iterator" in tokens or
                        (any(calls(method) for method in ("begin", "cbegin")) and
                         any(calls(method) for method in ("end", "cend"))))

        for req in spec.required_constructs:
            r = req.lower().strip()
            if r == "class" and not has_class:
                errors.append("Đặc tả yêu cầu dùng 'class/struct' trong C++, nhưng code không có.")
            elif r == "vector" and not has_vector:
                errors.append("Đặc tả yêu cầu dùng std::vector trong C++, nhưng reference_solution không có vector.")
            elif r == "iterator" and not has_iterator:
                errors.append("Đặc tả yêu cầu dùng iterator trong C++, nhưng reference_solution không có iterator hoặc begin/end.")
            elif r == "for" and not has_for:
                errors.append("Đặc tả yêu cầu dùng for trong C++, nhưng reference_solution không có.")
            elif r == "while" and not has_while:
                errors.append("Đặc tả yêu cầu dùng while trong C++, nhưng reference_solution không có.")

        for forb in spec.forbidden_constructs:
            f = forb.lower().strip()
            if f == "pointer" and "*" in tokens:
                errors.append("Đặc tả cấm dùng con trỏ thô (raw pointer), nhưng code C++ chứa dấu '*'.")
            elif f == "iterator" and has_iterator:
                errors.append("Đặc tả cấm dùng iterator trong C++, nhưng reference_solution lại dùng iterator hoặc begin/end.")
            elif f == "for" and has_for:
                errors.append("Đặc tả cấm dùng for trong C++, nhưng reference_solution lại dùng for.")
            elif f == "while" and has_while:
                errors.append("Đặc tả cấm dùng while trong C++, nhưng reference_solution lại dùng while.")
