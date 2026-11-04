import * as acorn from 'acorn';
import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export interface CodeConstraintConfig {
    requireComment?: boolean;
    requiredKeywords?: string[];
    forbiddenKeywords?: string[];
    requiredFunctions?: string[];
    requiredClasses?: string[];
    customErrorMessage?: string;
    noGlobalLeakInFunctions?: boolean;
    requiredConstructs?: string[];
    forbiddenConstructs?: string[];
}

export interface AnalysisResult {
    infrastructureError?: boolean;
    isValid: boolean;
    error: string | null;
    warnings: string[];
}

export class StaticCodeAnalyzer {
    // Danh sách biến môi trường / hàm toàn cục chuẩn của JS không coi là biến rò rỉ (leak)
    private static readonly JS_BUILTINS = new Set([
        'console', 'Math', 'Number', 'String', 'Boolean', 'Array', 'Object', 'Date',
        'RegExp', 'JSON', 'Promise', 'Error', 'TypeError', 'RangeError', 'SyntaxError',
        'ReferenceError', 'parseInt', 'parseFloat', 'isNaN', 'isFinite', 'undefined',
        'NaN', 'Infinity', 'process', 'require', 'module', 'exports', 'fs', '__dirname',
        '__filename', 'Buffer', 'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval',
        'Set', 'Map', 'WeakSet', 'WeakMap', 'Symbol', 'BigInt', 'Intl'
    ]);

    /**
     * Phân tích mã nguồn toàn diện cho bài tập nộp
     */
    public static analyze(
        code: string,
        language: string,
        problemDescription: string = '',
        exerciseTitle: string = ''
    ): AnalysisResult {
        const config = this.extractConstraints(problemDescription);

        // 1. Phân tích theo từng ngôn ngữ
        if (language === 'JAVASCRIPT') {
            return this.analyzeJavaScript(code, config, problemDescription, exerciseTitle);
        }

        if (language === 'PYTHON') {
            return this.analyzePython(code, config, problemDescription, exerciseTitle);
        }

        if (language === 'CPP' || language === 'C') {
            return this.analyzeCpp(code, config, problemDescription, exerciseTitle);
        }

        return { isValid: true, error: null, warnings: [] };
    }

    /**
     * Trích xuất cấu hình CONSTRAINTS từ mô tả bài tập
     */
    private static extractConstraints(problemDescription: string): CodeConstraintConfig {
        const match = /<!--\s*CONSTRAINTS:\s*(\{[\s\S]*?\})\s*-->/.exec(problemDescription || '');
        if (match) {
            try {
                return JSON.parse(match[1]);
            } catch (e) {
                console.error('[StaticCodeAnalyzer] Lỗi parse JSON constraints:', e);
            }
        }
        return {};
    }

    /**
     * Phân tích tĩnh JavaScript bằng AST (Acorn)
     */
    public static analyzeJavaScript(
        code: string,
        config: CodeConstraintConfig,
        problemDescription: string = '',
        exerciseTitle: string = ''
    ): AnalysisResult {
        const warnings: string[] = [];
        let ast: any;

        try {
            ast = acorn.parse(code, { ecmaVersion: 'latest', sourceType: 'module' });
        } catch {
            try {
                ast = acorn.parse(code, { ecmaVersion: 'latest', sourceType: 'script' });
            } catch (err: any) {
                return {
                    isValid: false,
                    error: `Lỗi cú pháp JavaScript (SyntaxError): ${err.message}`,
                    warnings: []
                };
            }
        }

        // 1. Quét các biến / hàm / lớp được khai báo ở phạm vi toàn cục (Program level)
        const globalVars = new Set<string>();
        const globalFunctions = new Set<string>();
        const globalClasses = new Set<string>();
        let hasTryCatch = false;
        const throwClasses = new Set<string>();

        for (const node of ast.body) {
            if (node.type === 'VariableDeclaration') {
                for (const decl of node.declarations) {
                    if (decl.id && decl.id.type === 'Identifier') {
                        globalVars.add(decl.id.name);
                    }
                }
            } else if (node.type === 'FunctionDeclaration' && node.id) {
                globalFunctions.add(node.id.name);
            } else if (node.type === 'ClassDeclaration' && node.id) {
                globalClasses.add(node.id.name);
            }
        }

        // Hàm đệ quy duyệt cây AST với theo dõi ngữ cảnh node cha
        const walk = (node: any, parent: any, visitor: (node: any, parent: any) => void) => {
            if (!node || typeof node !== 'object') return;
            visitor(node, parent);
            for (const key of Object.keys(node)) {
                if (key === 'parent') continue;
                const child = node[key];
                if (Array.isArray(child)) {
                    for (const c of child) {
                        if (c && typeof c === 'object') walk(c, node, visitor);
                    }
                } else if (child && typeof child === 'object') {
                    walk(child, node, visitor);
                }
            }
        };

        // Quét tìm try...catch và throw expressions trên toàn bộ code
        walk(ast, null, (node) => {
            if (node.type === 'TryStatement') {
                hasTryCatch = true;
            }
            if (node.type === 'ThrowStatement' && node.argument) {
                if (node.argument.type === 'NewExpression' && node.argument.callee && node.argument.callee.name) {
                    throwClasses.add(node.argument.callee.name);
                }
            }
        });

        // 2. Kiểm tra chi tiết từng hàm (FunctionDeclaration, FunctionExpression, ArrowFunction, Method)
        let scopeError: string | null = null;

        const extractParamNames = (pattern: any): string[] => {
            if (!pattern) return [];
            if (pattern.type === 'Identifier') return [pattern.name];
            if (pattern.type === 'AssignmentPattern') return extractParamNames(pattern.left);
            if (pattern.type === 'RestElement') return extractParamNames(pattern.argument);
            if (pattern.type === 'ObjectPattern') {
                const names: string[] = [];
                for (const prop of pattern.properties) {
                    if (prop.type === 'Property') {
                        names.push(...extractParamNames(prop.value));
                    } else if (prop.type === 'RestElement') {
                        names.push(...extractParamNames(prop.argument));
                    }
                }
                return names;
            }
            if (pattern.type === 'ArrayPattern') {
                const names: string[] = [];
                for (const el of pattern.elements) {
                    if (el) names.push(...extractParamNames(el));
                }
                return names;
            }
            return [];
        };

        const checkFunction = (funcNode: any, funcName: string) => {
            if (scopeError) return;

            const params: string[] = [];
            for (const p of funcNode.params) {
                params.push(...extractParamNames(p));
            }

            // Nếu hàm không nhận tham số, bỏ qua kiểm tra tham số
            if (params.length === 0) return;

            // Thu thập các biến local khai báo bên trong hàm này
            const localVars = new Set<string>(params);
            walk(funcNode.body, funcNode, (n) => {
                if (n === funcNode.body) return;
                // Không lấy biến của hàm con lồng nhau
                if (n.type === 'FunctionDeclaration' || n.type === 'FunctionExpression' || n.type === 'ArrowFunctionExpression') {
                    if (n.id && n.id.type === 'Identifier') localVars.add(n.id.name);
                    return;
                }
                if (n.type === 'VariableDeclaration') {
                    for (const decl of n.declarations) {
                        if (decl.id && decl.id.type === 'Identifier') {
                            localVars.add(decl.id.name);
                        }
                    }
                }
                if (n.type === 'CatchClause' && n.param && n.param.type === 'Identifier') {
                    localVars.add(n.param.name);
                }
            });

            // Thu thập tất cả các Identifier thực tế được ĐỌC/SỬ DỤNG trong thân hàm
            const usedIdentifiers = new Set<string>();
            const globalReferenced = new Set<string>();

            walk(funcNode.body, funcNode, (n, parent) => {
                // Không đi vào thân hàm lồng nhau
                if (n !== funcNode.body && (n.type === 'FunctionDeclaration' || n.type === 'FunctionExpression' || n.type === 'ArrowFunctionExpression')) {
                    return;
                }

                if (n.type === 'Identifier') {
                    // Bỏ qua nếu là tên thuộc tính không tính toán (ví dụ: obj.age -> 'age' là property, không phải biến 'age')
                    if (parent && parent.type === 'MemberExpression' && parent.property === n && !parent.computed) {
                        return;
                    }
                    // Bỏ qua nếu là key của ObjectExpression không tính toán (ví dụ: { age: 18 } -> 'age' là key)
                    if (parent && parent.type === 'Property' && parent.key === n && !parent.computed) {
                        return;
                    }
                    // Bỏ qua nếu là biến đang được khai báo trong VariableDeclarator (ví dụ: const age = 10 -> 'age' đang khai báo)
                    if (parent && parent.type === 'VariableDeclarator' && parent.id === n) {
                        return;
                    }
                    // Bỏ qua nếu là tên hàm trong FunctionDeclaration
                    if (parent && parent.type === 'FunctionDeclaration' && parent.id === n) {
                        return;
                    }

                    const name = n.name;
                    usedIdentifiers.add(name);

                    // Kiểm tra xem đây có phải biến toàn cục do người dùng khai báo không
                    if (
                        !localVars.has(name) &&
                        globalVars.has(name) &&
                        !this.JS_BUILTINS.has(name) &&
                        !globalClasses.has(name) &&
                        !globalFunctions.has(name)
                    ) {
                        globalReferenced.add(name);
                    }
                }
            });

            // 2.1 Kiểm tra tham số không được sử dụng
            const unusedParams = params.filter(p => !p.startsWith('_') && !usedIdentifiers.has(p));

            if (unusedParams.length > 0) {
                if (globalReferenced.size > 0) {
                    // Trực diện trường hợp: hàm nhận 'ag' nhưng dùng 'age' toàn cục
                    const leaked = Array.from(globalReferenced).join(', ');
                    scopeError = `Lỗi logic phạm vi (Scope): Hàm '${funcName}' nhận tham số '${unusedParams.join(', ')}' nhưng lại truy cập trực tiếp biến toàn cục '${leaked}'. Bạn bắt buộc phải thao tác và tính toán dựa trên tham số được truyền vào hàm!`;
                } else {
                    scopeError = `Lỗi cấu trúc hàm: Hàm '${funcName}' khai báo tham số '${unusedParams.join(', ')}' nhưng hoàn toàn không sử dụng tham số này trong thân hàm.`;
                }
            } else if (globalReferenced.size > 0 && config.noGlobalLeakInFunctions === true) {
                // Tham số có dùng, nhưng vẫn đọc trực tiếp biến toàn cục bên trong hàm khi yêu cầu cô lập tuyệt đối
                const leaked = Array.from(globalReferenced).join(', ');
                scopeError = `Lỗi cấu trúc hàm: Hàm '${funcName}' đang đọc trực tiếp biến toàn cục '${leaked}'. Hãy truyền tất cả dữ liệu cần thiết qua tham số của hàm để đảm bảo tính độc lập.`;
            }
        };

        walk(ast, null, (node) => {
            if (node.type === 'FunctionDeclaration' && node.id) {
                checkFunction(node, node.id.name);
            } else if (
                node.type === 'VariableDeclarator' &&
                node.id &&
                node.id.type === 'Identifier' &&
                node.init &&
                (node.init.type === 'ArrowFunctionExpression' || node.init.type === 'FunctionExpression')
            ) {
                checkFunction(node.init, node.id.name);
            } else if (node.type === 'MethodDefinition' && node.key && node.key.type === 'Identifier') {
                checkFunction(node.value, node.key.name);
            }
        });

        if (scopeError) {
            return { isValid: false, error: scopeError, warnings };
        }

        // 3. Kiểm tra các ràng buộc kỹ thuật đặc thù của đề bài
        const desc = (problemDescription + ' ' + exerciseTitle).toLowerCase();

        // 3.1 Yêu cầu về Custom Error Class (ví dụ ValidationError)
        if (desc.includes('validationerror') || desc.includes('custom error')) {
            let hasValidErrorClass = false;
            walk(ast, null, (node) => {
                if (
                    node.type === 'ClassDeclaration' &&
                    node.id &&
                    node.id.name === 'ValidationError' &&
                    node.superClass &&
                    node.superClass.name === 'Error'
                ) {
                    hasValidErrorClass = true;
                }
            });

            if (!hasValidErrorClass) {
                return {
                    isValid: false,
                    error: "Đề bài yêu cầu bạn phải định nghĩa lớp lỗi tùy chỉnh kế thừa từ Error: `class ValidationError extends Error`.",
                    warnings
                };
            }

            if (!throwClasses.has('ValidationError')) {
                return {
                    isValid: false,
                    error: "Đề bài yêu cầu bạn phải ném lỗi thông qua câu lệnh `throw new ValidationError(...)`.",
                    warnings
                };
            }

            if (!hasTryCatch) {
                return {
                    isValid: false,
                    error: "Đề bài yêu cầu bạn phải sử dụng khối `try...catch` để bắt lỗi khi gọi hàm.",
                    warnings
                };
            }
        }

        // 3.2 Kiểm tra từ khóa bắt buộc
        if (config.requiredKeywords && config.requiredKeywords.length > 0) {
            for (const kw of config.requiredKeywords) {
                const trimmed = kw.trim();
                if (!trimmed) continue;
                const kwRegex = new RegExp(trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
                if (!kwRegex.test(code)) {
                    return {
                        isValid: false,
                        error: config.customErrorMessage || `Mã nguồn bắt buộc phải sử dụng cú pháp/từ khóa: \`${trimmed}\`.`,
                        warnings
                    };
                }
            }
        }

        // 3.3 Kiểm tra từ khóa cấm
        if (config.forbiddenKeywords && config.forbiddenKeywords.length > 0) {
            const cleanCode = code.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
            for (const kw of config.forbiddenKeywords) {
                const trimmed = kw.trim();
                if (!trimmed) continue;
                const kwRegex = new RegExp(trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
                if (kwRegex.test(cleanCode)) {
                    return {
                        isValid: false,
                        error: config.customErrorMessage || `Đề bài cấm sử dụng cú pháp/hàm: \`${trimmed}\`.`,
                        warnings
                    };
                }
            }
        }

        return { isValid: true, error: null, warnings };
    }

    /**
     * Phân tích tĩnh Python bằng AST của Python
     */
    public static analyzePython(
        code: string,
        config: CodeConstraintConfig,
        problemDescription: string = '',
        exerciseTitle: string = ''
    ): AnalysisResult {
        const warnings: string[] = [];

        // Chạy kiểm tra AST nhanh bằng script Python nội bộ
        const pythonScript = `
import ast, json, sys

code = sys.stdin.buffer.read().decode('utf-8')

try:
    tree = ast.parse(code)
except SyntaxError as e:
    print(json.dumps({"error": f"Lỗi cú pháp Python (SyntaxError): {e.msg} tại dòng {e.lineno}"}))
    sys.exit(0)

req_constructs = json.loads(sys.argv[1]) if len(sys.argv) > 1 else []
forb_constructs = json.loads(sys.argv[2]) if len(sys.argv) > 2 else []

if req_constructs or forb_constructs:
    found = set()
    def is_empty_iter(iter_node):
        if isinstance(iter_node, (ast.List, ast.Tuple, ast.Set)) and len(iter_node.elts) == 0:
            return True
        if isinstance(iter_node, ast.Dict) and len(iter_node.keys) == 0:
            return True
        if isinstance(iter_node, ast.Call) and isinstance(iter_node.func, ast.Name) and iter_node.func.id == "range":
            if len(iter_node.args) == 1 and isinstance(iter_node.args[0], ast.Constant) and iter_node.args[0].value == 0:
                return True
        return False

    for node in ast.walk(tree):
        if isinstance(node, (ast.For, ast.AsyncFor, ast.comprehension)):
            if hasattr(node, 'iter') and not is_empty_iter(node.iter):
                found.add("for")
            elif not hasattr(node, 'iter'):
                found.add("for")
        elif isinstance(node, ast.While):
            if not (isinstance(node.test, ast.Constant) and not bool(node.test.value)):
                found.add("while")
        elif isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            found.add("function")
            found.add("def:" + node.name)
        elif isinstance(node, ast.ClassDef):
            found.add("class")
            found.add("class:" + node.name)
        elif isinstance(node, ast.Lambda):
            found.add("lambda")
        elif isinstance(node, ast.Name) and isinstance(node.ctx, ast.Load):
            found.add("read:" + node.id)
        elif isinstance(node, ast.Call):
            if isinstance(node.func, ast.Name):
                found.add("call:" + node.func.id)
            elif isinstance(node.func, ast.Attribute):
                found.add("call:" + node.func.attr)

    target_fns = set()
    for r in req_constructs:
        for alt in r.split("|"):
            if alt.startswith("def:"):
                target_fns.add(alt[4:])

    fn_nodes = [n for n in ast.walk(tree) if isinstance(n, (ast.FunctionDef, ast.AsyncFunctionDef))]
    if not target_fns:
        reachable = set()
        call_graph = {}
        for fn in fn_nodes:
            call_graph[fn.name] = set(c.func.id for c in ast.walk(fn) if isinstance(c, ast.Call) and isinstance(c.func, ast.Name))
        queue = [c.func.id for n in tree.body if not isinstance(n, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef))
                 for c in ast.walk(n) if isinstance(c, ast.Call) and isinstance(c.func, ast.Name)]
        while queue:
            curr = queue.pop(0)
            if curr not in reachable:
                reachable.add(curr)
                if curr in call_graph:
                    queue.extend(call_graph[curr])
        for fn in fn_nodes:
            if fn.name in reachable:
                if any(isinstance(n, ast.Call) and isinstance(n.func, ast.Name) and n.func.id == fn.name for n in ast.walk(fn)):
                    found.add("recursion")
    else:
        for fn in fn_nodes:
            if fn.name in target_fns:
                if any(isinstance(n, ast.Call) and isinstance(n.func, ast.Name) and n.func.id == fn.name for n in ast.walk(fn)):
                    found.add("recursion")

    for req in req_constructs:
        if "|" in req:
            if not any(alt in found for alt in req.split("|")):
                print(json.dumps({"error": f"CONSTRAINT_REQUIRED:{req}"}))
                sys.exit(0)
        elif req not in found:
            print(json.dumps({"error": f"CONSTRAINT_REQUIRED:{req}"}))
            sys.exit(0)

    for forb in forb_constructs:
        if forb in found:
            print(json.dumps({"error": f"CONSTRAINT_FORBIDDEN:{forb}"}))
            sys.exit(0)

global_vars = set()
for node in tree.body:
    if isinstance(node, ast.Assign):
        for target in node.targets:
            if isinstance(target, ast.Name):
                global_vars.add(target.id)

scope_error = None
for node in tree.body:
    if isinstance(node, ast.FunctionDef):
        params = [arg.arg for arg in node.args.args]
        if not params:
            continue
        
        body_names = set()
        for child in ast.walk(node):
            if isinstance(child, ast.Name) and isinstance(child.ctx, ast.Load):
                body_names.add(child.id)
                
        unused = [p for p in params if p not in body_names and not p.startswith('_')]
        leaked_globals = [g for g in global_vars if g in body_names and g not in params]
        
        if unused:
            if leaked_globals:
                scope_error = f"Lỗi logic phạm vi (Scope): Hàm '{node.name}' nhận tham số '{', '.join(unused)}' nhưng lại truy cập trực tiếp biến toàn cục '{', '.join(leaked_globals)}'. Bạn bắt buộc phải thao tác trên tham số của hàm!"
            else:
                scope_error = f"Lỗi cấu trúc hàm: Hàm '{node.name}' khai báo tham số '{', '.join(unused)}' nhưng không sử dụng trong thân hàm."
            break

if scope_error:
    print(json.dumps({"error": scope_error}))
else:
    print(json.dumps({"error": None}))
`;

        try {
            const pythonCmd = fs.existsSync(path.join(process.cwd(), '.venv/Scripts/python.exe'))
                ? path.join(process.cwd(), '.venv/Scripts/python.exe')
                : 'python';
            const proc = spawnSync(pythonCmd, ['-I', '-X', 'utf8', '-c', pythonScript, JSON.stringify(config.requiredConstructs || []), JSON.stringify(config.forbiddenConstructs || [])], {
                input: code,
                encoding: 'utf-8',
                env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
                timeout: 3000
            });

            if (proc.error || proc.status !== 0 || !proc.stdout) {
                return { isValid: false, error: "AST_ANALYZER_UNAVAILABLE", warnings, infrastructureError: true };
            }
            if (proc.status === 0 && proc.stdout) {
                const res = JSON.parse(proc.stdout.trim());
                if (res.error) {
                    return { isValid: false, error: res.error, warnings };
                }
            }
        } catch (e) {
            return { isValid: false, error: 'AST_ANALYZER_UNAVAILABLE', warnings, infrastructureError: true };
        }

        // Kiểm tra từ khóa bắt buộc / cấm
        if (config.requiredKeywords && config.requiredKeywords.length > 0) {
            for (const kw of config.requiredKeywords) {
                const trimmed = kw.trim();
                if (!trimmed) continue;
                const kwRegex = new RegExp(trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
                if (!kwRegex.test(code)) {
                    return {
                        isValid: false,
                        error: config.customErrorMessage || `Mã nguồn bắt buộc phải sử dụng cú pháp/từ khóa: \`${trimmed}\`.`,
                        warnings
                    };
                }
            }
        }

        if (config.forbiddenKeywords && config.forbiddenKeywords.length > 0) {
            const cleanCode = code.replace(/#.*$/gm, '').replace(/'''[\s\S]*?'''/g, '').replace(/"""[\s\S]*?"""/g, '');
            for (const kw of config.forbiddenKeywords) {
                const trimmed = kw.trim();
                if (!trimmed) continue;
                const kwRegex = new RegExp(trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
                if (kwRegex.test(cleanCode)) {
                    return {
                        isValid: false,
                        error: config.customErrorMessage || `Đề bài cấm sử dụng cú pháp/hàm: \`${trimmed}\`.`,
                        warnings
                    };
                }
            }
        }

        return { isValid: true, error: null, warnings };
    }

    /**
     * Phân tích tĩnh C++
     */
    public static analyzeCpp(
        code: string,
        config: CodeConstraintConfig,
        problemDescription: string = '',
        exerciseTitle: string = ''
    ): AnalysisResult {
        const warnings: string[] = [];

        // Kiểm tra từ khóa bắt buộc
        if (config.requiredKeywords && config.requiredKeywords.length > 0) {
            for (const kw of config.requiredKeywords) {
                const trimmed = kw.trim();
                if (!trimmed) continue;
                const kwRegex = new RegExp(trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
                if (!kwRegex.test(code)) {
                    return {
                        isValid: false,
                        error: config.customErrorMessage || `Mã nguồn bắt buộc phải sử dụng cú pháp/từ khóa: \`${trimmed}\`.`,
                        warnings
                    };
                }
            }
        }

        // Kiểm tra từ khóa cấm
        if (config.forbiddenKeywords && config.forbiddenKeywords.length > 0) {
            const cleanCode = code.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
            for (const kw of config.forbiddenKeywords) {
                const trimmed = kw.trim();
                if (!trimmed) continue;
                const kwRegex = new RegExp(trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
                if (kwRegex.test(cleanCode)) {
                    return {
                        isValid: false,
                        error: config.customErrorMessage || `Đề bài cấm sử dụng cú pháp/hàm: \`${trimmed}\`.`,
                        warnings
                    };
                }
            }
        }

        return { isValid: true, error: null, warnings };
    }
}
