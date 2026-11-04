import { createHash } from 'crypto';
import { effectiveArtifact } from '../adaptive/contentVersioning';
import { specificationSchema, draftSchema } from '../adaptive/adaptive.contracts';
import { Buffer } from 'buffer';

export type ExecutionMode = 'stdio' | 'function';
export type ComparatorType = 'text' | 'json';
export type CallStyle = 'single' | 'spread';

export interface ResolvedTestCase {
    id?: string;
    input?: string;
    arguments?: any[];
    callStyle?: CallStyle;
    expectedOutput: string;
    isHidden: boolean;
}

export interface ResolvedContract {
    exerciseId: string;
    language: 'PYTHON';
    mode: ExecutionMode;
    entrypoint: string;
    comparator: ComparatorType;
    requiredConstructs: string[];
    forbiddenConstructs: string[];
    testCases: ResolvedTestCase[];
    provenance: {
        source: 'ADAPTIVE_RUN_ARTIFACT';
        traceId: string;
        pathId: string;
        ownerUserId: string;
        specSnapshotSha256?: string;
    };
}

export type ContractResolutionResult =
    | { status: 'RESOLVED'; contract: ResolvedContract }
    | { status: 'NEEDS_CONTRACT'; reason: string }
    | { status: 'CONTRACT_INVALID'; reason: string }
    | { status: 'STORAGE_ERROR'; error: string }
    | { status: 'FORBIDDEN_OWNER_MISMATCH'; error: string }
    | { status: 'EXERCISE_NOT_FOUND'; error: string };

/**
 * Resolves the authoritative execution contract for a personalized exercise.
 * 
 * Rules:
 * 1. Must verify owner authorization: personalized_paths.user_id === authenticatedUserId
 * 2. Join adaptive_generation_runs with same path_id, user_id, and exercise_id.
 *    Client-supplied artifact IDs are never trusted.
 * 3. Never guess mode from function name or JSON input format.
 * 4. Legacy exercises without an authorized artifact return NEEDS_CONTRACT.
 * 5. Invalid metadata returns CONTRACT_INVALID; DB failures return STORAGE_ERROR.
 */
export async function resolveExerciseContract(
    prismaClient: any, exerciseId: string, authenticatedUserId: string
): Promise<ContractResolutionResult> {
    if (!exerciseId || !authenticatedUserId) {
        return { status: 'NEEDS_CONTRACT', reason: 'Thiếu thông tin exerciseId hoặc userId' };
    }
    let exercise: any;
    try {
        exercise = await prismaClient.personalizedExercise.findUnique({
            where: { id: exerciseId },
            include: { lesson: { include: { path: { select: { id: true, userId: true } } } }, testCases: true }
        });
    } catch (error: any) {
        return { status: 'STORAGE_ERROR', error: 'Lỗi truy vấn bài tập: ' + error.message };
    }
    if (!exercise) return { status: 'EXERCISE_NOT_FOUND', error: 'Bài tập không tồn tại' };
    const pathId = exercise.lesson?.path?.id;
    if (!pathId || exercise.lesson?.path?.userId !== authenticatedUserId) {
        return { status: 'FORBIDDEN_OWNER_MISMATCH', error: 'Không thể truy cập hoặc giải quyết hợp đồng bài tập của người khác' };
    }
    let runs: any[];
    try {
        runs = await prismaClient.$queryRawUnsafe(
            'SELECT trace_id, user_id, path_id, exercise_id, artifact FROM adaptive_generation_runs WHERE path_id = $1::uuid AND user_id = $2::uuid AND exercise_id = $3::uuid ORDER BY created_at DESC LIMIT 1',
            pathId, authenticatedUserId, exerciseId
        );
    } catch (error: any) {
        return { status: 'STORAGE_ERROR', error: 'Lỗi truy vấn bảng adaptive_generation_runs: ' + error.message };
    }
    if (!runs?.length || runs[0]?.artifact == null) {
        return { status: 'NEEDS_CONTRACT', reason: 'Bài tập legacy không có artifact hoặc hợp đồng thi hành được chứng thực' };
    }
    const invalid = (reason: string): ContractResolutionResult => ({ status: 'CONTRACT_INVALID', reason });
    const run = runs[0];
    let art = run.artifact;
    if (run.user_id !== authenticatedUserId || run.path_id !== pathId) {
        return { status: 'FORBIDDEN_OWNER_MISMATCH', error: 'Không thể truy cập hoặc giải quyết hợp đồng bài tập của người khác' };
    }
    if (!art || typeof art !== 'object' || Array.isArray(art)) return invalid('Artifact không phải object hợp lệ');
    if (exercise.id !== exerciseId || run.exercise_id !== exerciseId || art.exercise_id !== exerciseId) {
        return invalid('Exercise ID không nhất quán giữa exercise, run và artifact');
    }
    if (typeof run.trace_id !== 'string' || !run.trace_id || art.trace_id !== run.trace_id) {
        return invalid('Trace ID không nhất quán giữa run và artifact');
    }
    if (exercise.language !== 'PYTHON' || typeof art.language !== 'string' || art.language.toLowerCase() !== 'python') {
        return invalid('Ngôn ngữ exercise/artifact phải là Python');
    }
    try { art = effectiveArtifact(art); }
    catch (error: any) { return invalid(error.message); }
    // Reuse adaptive schemas; only schema-defined defaults are permitted.
    const parsedSpec = specificationSchema.safeParse(art.spec_snapshot);
    const parsedExecution = specificationSchema.shape.execution.safeParse(art.execution);
    const parsedDraft = draftSchema.safeParse(art);
    if (!parsedSpec.success || !parsedExecution.success || !parsedDraft.success) {
        return invalid('Artifact/spec/testcase không đáp ứng schema của adaptive grading');
    }
    const spec = parsedSpec.data, execution = parsedExecution.data, draft = parsedDraft.data;
    if (spec.language !== 'python' || (execution.mode !== 'stdio' && execution.mode !== 'function')) {
        return invalid('Contract không thuộc chế độ chấm Python được hỗ trợ');
    }
    for (const field of ['mode', 'entrypoint', 'comparator'] as const) {
        if (execution[field] !== spec.execution[field]) return invalid('Execution ' + field + ' không nhất quán giữa spec và artifact');
    }
    for (const [index, tc] of draft.test_cases.entries()) {
        if (execution.mode === 'function') {
            if (tc.input != null || !Array.isArray(tc.arguments) ||
                (tc.call_style !== 'single' && tc.call_style !== 'spread') ||
                (tc.call_style === 'single' && tc.arguments.length !== 1)) {
                return invalid('Testcase ' + index + ' vi phạm function arguments/call_style contract');
            }
        } else if (typeof tc.input !== 'string' || tc.arguments != null || tc.call_style != null) {
            return invalid('Testcase ' + index + ' vi phạm stdio input contract');
        }
    }
    const canonical = (value: any): any => Array.isArray(value) ? value.map(canonical)
        : value && typeof value === 'object'
            ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value;
    return {
        status: 'RESOLVED',
        contract: {
            exerciseId, language: 'PYTHON', mode: execution.mode, entrypoint: execution.entrypoint,
            comparator: execution.comparator,
            requiredConstructs: spec.required_constructs,
            forbiddenConstructs: spec.forbidden_constructs,
            testCases: draft.test_cases.map((tc, index) => ({
                id: exerciseId + '-' + index,
                input: execution.mode === 'stdio' ? tc.input! : JSON.stringify(tc.arguments),
                arguments: tc.arguments ?? undefined,
                callStyle: execution.mode === 'function' ? tc.call_style! : undefined,
                expectedOutput: tc.expected_output,
                isHidden: tc.is_hidden
            })),
            provenance: {
                source: 'ADAPTIVE_RUN_ARTIFACT', traceId: run.trace_id, pathId: run.path_id,
                ownerUserId: run.user_id,
                specSnapshotSha256: createHash('sha256').update(JSON.stringify(canonical(spec))).digest('hex')
            }
        }
    };
}



/**
 * Builds the Python execution payload based on the resolved contract.
 * - For stdio: Enforces AST constraints; preserves raw input including newlines/spaces on stdin.
 * - For function: Enforces AST constraints; deserializes JSON arguments faithfully with json.loads.
 */
export function buildPythonExecutionPayload(
    userCode: string,
    testCase: ResolvedTestCase,
    contract: ResolvedContract
): { codeToRun: string; stdinData: string } {
    const rawCodeBase64 = Buffer.from(userCode, 'utf8').toString('base64');
    const reqConstructsJson = JSON.stringify(contract.requiredConstructs || []);
    const forbConstructsJson = JSON.stringify(contract.forbiddenConstructs || []);

    if (contract.mode === 'stdio') {
        const harness = `import sys, ast, base64

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# 1. Parse and validate syntax
_raw_code = base64.b64decode("${rawCodeBase64}").decode("utf-8")
try:
    _tree = ast.parse(_raw_code, filename="<submission>")
except SyntaxError as _err:
    raise

# 2. Check AST constructs if specified
_found = set()

def _is_empty_iter(iter_node):
    if isinstance(iter_node, (ast.List, ast.Tuple, ast.Set)) and len(iter_node.elts) == 0:
        return True
    if isinstance(iter_node, ast.Dict) and len(iter_node.keys) == 0:
        return True
    if isinstance(iter_node, ast.Call) and isinstance(iter_node.func, ast.Name) and iter_node.func.id == "range":
        if len(iter_node.args) == 1 and isinstance(iter_node.args[0], ast.Constant) and iter_node.args[0].value == 0:
            return True
    return False

for _node in ast.walk(_tree):
    if isinstance(_node, (ast.For, ast.AsyncFor, ast.comprehension)):
        if hasattr(_node, 'iter') and not _is_empty_iter(_node.iter):
            _found.add("for")
        elif not hasattr(_node, 'iter'):
            _found.add("for")
    elif isinstance(_node, ast.While):
        _found.add("while")
    elif isinstance(_node, (ast.FunctionDef, ast.AsyncFunctionDef)):
        _found.add("function")
        _found.add("def:" + _node.name)
    elif isinstance(_node, ast.ClassDef):
        _found.add("class")
        _found.add("class:" + _node.name)
    elif isinstance(_node, ast.Lambda):
        _found.add("lambda")
    elif isinstance(_node, ast.Name) and isinstance(_node.ctx, ast.Load):
        _found.add("read:" + _node.id)
    elif isinstance(_node, ast.Call):
        if isinstance(_node.func, ast.Name):
            _found.add("call:" + _node.func.id)
        elif isinstance(_node.func, ast.Attribute):
            _found.add("call:" + _node.func.attr)

_req_list = ${reqConstructsJson}
_target_fns = set()
for _r in _req_list:
    for _alt in _r.split("|"):
        if _alt.startswith("def:"):
            _target_fns.add(_alt[4:])

_fn_nodes = [n for n in ast.walk(_tree) if isinstance(n, (ast.FunctionDef, ast.AsyncFunctionDef))]
if not _target_fns:
    _reachable = set()
    _call_graph = {}
    for _fn in _fn_nodes:
        _call_graph[_fn.name] = set(c.func.id for c in ast.walk(_fn) if isinstance(c, ast.Call) and isinstance(c.func, ast.Name))
    _queue = [c.func.id for _n in _tree.body if not isinstance(_n, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef))
              for c in ast.walk(_n) if isinstance(c, ast.Call) and isinstance(c.func, ast.Name)]
    while _queue:
        _curr = _queue.pop(0)
        if _curr not in _reachable:
            _reachable.add(_curr)
            if _curr in _call_graph:
                _queue.extend(_call_graph[_curr])
    for _fn in _fn_nodes:
        if _fn.name in _reachable:
            if any(isinstance(n, ast.Call) and isinstance(n.func, ast.Name) and n.func.id == _fn.name for n in ast.walk(_fn)):
                _found.add("recursion")
else:
    for _fn in _fn_nodes:
        if _fn.name in _target_fns:
            if any(isinstance(n, ast.Call) and isinstance(n.func, ast.Name) and n.func.id == _fn.name for n in ast.walk(_fn)):
                _found.add("recursion")

for _req in ${reqConstructsJson}:
    if "|" in _req:
        if not any(_alt in _found for _alt in _req.split("|")):
            raise ValueError("CONSTRAINT_REQUIRED:" + _req)
    elif _req not in _found:
        raise ValueError("CONSTRAINT_REQUIRED:" + _req)

for _forb in ${forbConstructsJson}:
    if _forb in _found:
        raise ValueError("CONSTRAINT_FORBIDDEN:" + _forb)

_scope = {"__name__": "__main__"}
exec(compile(_tree, "<submission>", "exec"), _scope, _scope)
`;

        return {
            codeToRun: harness,
            stdinData: testCase.input !== undefined ? testCase.input : ''
        };
    }

    // Function mode: Canonical adaptive function execution harness
    const entrypoint = contract.entrypoint || 'solution';
    const callStyle = testCase.callStyle || 'single';
    const rawArgs = testCase.arguments || [];
    const argsJsonBase64 = Buffer.from(JSON.stringify(rawArgs), 'utf8').toString('base64');

    const harness = `import sys, json, io, ast, base64

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# 1. Parse and validate syntax
_raw_code = base64.b64decode("${rawCodeBase64}").decode("utf-8")
try:
    _tree = ast.parse(_raw_code, filename="<submission>")
except SyntaxError as _err:
    raise

# 2. Check AST constructs if specified
_found = set()

def _is_empty_iter(iter_node):
    if isinstance(iter_node, (ast.List, ast.Tuple, ast.Set)) and len(iter_node.elts) == 0:
        return True
    if isinstance(iter_node, ast.Dict) and len(iter_node.keys) == 0:
        return True
    if isinstance(iter_node, ast.Call) and isinstance(iter_node.func, ast.Name) and iter_node.func.id == "range":
        if len(iter_node.args) == 1 and isinstance(iter_node.args[0], ast.Constant) and iter_node.args[0].value == 0:
            return True
    return False

for _node in ast.walk(_tree):
    if isinstance(_node, (ast.For, ast.AsyncFor, ast.comprehension)):
        if hasattr(_node, 'iter') and not _is_empty_iter(_node.iter):
            _found.add("for")
        elif not hasattr(_node, 'iter'):
            _found.add("for")
    elif isinstance(_node, ast.While):
        _found.add("while")
    elif isinstance(_node, (ast.FunctionDef, ast.AsyncFunctionDef)):
        _found.add("function")
        _found.add("def:" + _node.name)
    elif isinstance(_node, ast.ClassDef):
        _found.add("class")
        _found.add("class:" + _node.name)
    elif isinstance(_node, ast.Lambda):
        _found.add("lambda")
    elif isinstance(_node, ast.Name) and isinstance(_node.ctx, ast.Load):
        _found.add("read:" + _node.id)
    elif isinstance(_node, ast.Call):
        if isinstance(_node.func, ast.Name):
            _found.add("call:" + _node.func.id)
        elif isinstance(_node.func, ast.Attribute):
            _found.add("call:" + _node.func.attr)

_req_list = ${reqConstructsJson}
_target_fns = set()
for _r in _req_list:
    for _alt in _r.split("|"):
        if _alt.startswith("def:"):
            _target_fns.add(_alt[4:])
_target_fns.add(${JSON.stringify(entrypoint)})

_fn_nodes = [n for n in ast.walk(_tree) if isinstance(n, (ast.FunctionDef, ast.AsyncFunctionDef))]
for _fn in _fn_nodes:
    if _fn.name in _target_fns:
        if any(isinstance(n, ast.Call) and isinstance(n.func, ast.Name) and n.func.id == _fn.name for n in ast.walk(_fn)):
            _found.add("recursion")

for _req in ${reqConstructsJson}:
    if "|" in _req:
        if not any(_alt in _found for _alt in _req.split("|")):
            raise ValueError("CONSTRAINT_REQUIRED:" + _req)
    elif _req not in _found:
        raise ValueError("CONSTRAINT_REQUIRED:" + _req)

for _forb in ${forbConstructsJson}:
    if _forb in _found:
        raise ValueError("CONSTRAINT_FORBIDDEN:" + _forb)

# 3. Deserialize JSON arguments faithfully
_args_json = base64.b64decode("${argsJsonBase64}").decode("utf-8")
_args = json.loads(_args_json)
_style = ${JSON.stringify(callStyle)}

if not isinstance(_args, list):
    raise ValueError("ARGUMENTS_MUST_BE_ARRAY")
if _style not in ("spread", "single"):
    raise ValueError("CALL_STYLE_REQUIRED")
if _style == "single" and len(_args) != 1:
    raise ValueError("SINGLE_CALL_REQUIRES_ONE_ARGUMENT")

_scope = {"__name__": "__main__"}
_stdout = sys.stdout
sys.stdout = io.StringIO()
try:
    exec(compile(_tree, "<submission>", "exec"), _scope, _scope)
    _entry = ${JSON.stringify(entrypoint)}
    if _entry not in _scope:
        raise ValueError(f"ENTRYPOINT_NOT_FOUND:{_entry}")
    _fn = _scope[_entry]
    _value = _fn(*_args) if _style == "spread" else _fn(_args[0])
finally:
    sys.stdout = _stdout

print(json.dumps(_value, ensure_ascii=False, allow_nan=False))
`;

    return {
        codeToRun: harness,
        stdinData: ''
    };
}
