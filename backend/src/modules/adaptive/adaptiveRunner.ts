import { spawn } from 'child_process';
import { randomUUID, createHash } from 'crypto';
import { parse } from 'acorn';
import { Draft, Specification, CaseResult, draftSchema, specificationSchema } from './adaptive.contracts';

const VERSION = 'adaptive_harness_v4';
const MAX_OUTPUT = 128000;
const MAX_CONCURRENT_RUNS = 2;
let active = 0;
const waiting: (() => void)[] = [];

async function slot<T>(work: () => Promise<T>): Promise<T> {
    if (waiting.length >= 24) throw new Error('RUNNER_CAPACITY_EXCEEDED');
    if (active >= MAX_CONCURRENT_RUNS) await new Promise<void>(resolve => waiting.push(resolve));
    else active++;
    try { return await work(); }
    finally {
        const next = waiting.shift();
        if (next) next(); else active--;
    }
}

export function equalOutput(actual: string, expected: string, spec: Specification): boolean {
    if (spec.execution.comparator === 'text') return actual.replace(/\r\n/g, '\n').trimEnd() === expected.replace(/\r\n/g, '\n').trimEnd();
    const canonical = (value: any): any => Array.isArray(value) ? value.map(canonical)
        : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(k => [k, canonical(value[k])])) : value;
    try {
        let a = canonical(JSON.parse(actual)), e = canonical(JSON.parse(expected));
        if (spec.language === 'sql' && !spec.execution.ordered) {
            a = a.map((row: any) => JSON.stringify(row)).sort();
            e = e.map((row: any) => JSON.stringify(row)).sort();
        }
        return JSON.stringify(a) === JSON.stringify(e);
    } catch { return false; }
}

const PYTHON = `import sys,json,io,ast,sqlite3
p=json.loads(sys.stdin.read())
code=p["code"]; spec=p["specification"]; tc=p["test"]
if spec["language"]=="sql":
    db=sqlite3.connect(":memory:")
    db.executescript(tc.get("fixture_sql") or p.get("fixture_sql") or "")
    db.set_authorizer(lambda action,*args: sqlite3.SQLITE_DENY if action in (sqlite3.SQLITE_ATTACH,sqlite3.SQLITE_DETACH,sqlite3.SQLITE_PRAGMA) else sqlite3.SQLITE_OK)
    rows=db.execute(code).fetchall()
    print(json.dumps(rows,ensure_ascii=False,allow_nan=False))
else:
    tree=ast.parse(code)
    found=set()
    kinds={ast.For:"for",ast.AsyncFor:"for",ast.While:"while",ast.ClassDef:"class",ast.Lambda:"lambda",ast.FunctionDef:"function",ast.AsyncFunctionDef:"function"}
    for node in ast.walk(tree):
        for cls,name in kinds.items():
            if isinstance(node,cls): found.add(name)
        if isinstance(node,ast.Call):
            if isinstance(node.func,ast.Name): found.add(node.func.id)
            if isinstance(node.func,ast.Attribute): found.add(node.func.attr)
    for fn in [n for n in ast.walk(tree) if isinstance(n,(ast.FunctionDef,ast.AsyncFunctionDef))]:
        if any(isinstance(n,ast.Call) and isinstance(n.func,ast.Name) and n.func.id==fn.name for n in ast.walk(fn)):
            found.add("recursion")
    for required in spec.get("required_constructs",[]):
        if required not in found: raise ValueError("CONSTRAINT_REQUIRED:"+required)
    for forbidden in spec.get("forbidden_constructs",[]):
        if forbidden in found: raise ValueError("CONSTRAINT_FORBIDDEN:"+forbidden)
    scope={"__name__":"__main__"}
    if spec["execution"]["mode"]=="function":
        args=tc.get("arguments")
        style=tc.get("call_style")
        if not isinstance(args,list): raise ValueError("ARGUMENTS_MUST_BE_ARRAY")
        if style not in ("spread","single"): raise ValueError("CALL_STYLE_REQUIRED")
        if style=="single" and len(args)!=1: raise ValueError("SINGLE_CALL_REQUIRES_ONE_ARGUMENT")
        stdout=sys.stdout
        sys.stdout=io.StringIO()
        try:
            exec(compile(tree,"<submission>","exec"),scope,scope)
            fn=scope[spec["execution"]["entrypoint"]]
            value=fn(*args) if style=="spread" else fn(args[0])
        finally: sys.stdout=stdout
        print(json.dumps(value,ensure_ascii=False,allow_nan=False))
    else:
        sys.stdin=io.StringIO(tc["input"])
        exec(compile(tree,"<submission>","exec"),scope,scope)
`;

const JAVASCRIPT = `const fs = require('fs'), vm = require('vm');
const p = JSON.parse(fs.readFileSync(0, 'utf8'));
if (p.specification.execution.mode === 'function') {
    const args = p.test.arguments;
    const style = p.test.call_style;
    if (!Array.isArray(args)) throw Error('ARGUMENTS_MUST_BE_ARRAY');
    if (!['spread', 'single'].includes(style)) throw Error('CALL_STYLE_REQUIRED');
    if (style === 'single' && args.length !== 1) throw Error('SINGLE_CALL_REQUIRES_ONE_ARGUMENT');
    const context = vm.createContext({console: {log() {}, error() {}}, args});
    vm.runInContext(p.code, context, {timeout: 2000});
    const fn = vm.runInContext(p.specification.execution.entrypoint, context);
    if (typeof fn !== 'function') throw Error('ENTRYPOINT_NOT_FOUND');
    Promise.resolve(style === 'spread' ? fn(...args) : fn(args[0])).then(value => {
        if (value === undefined) throw Error('UNDEFINED_RESULT');
        process.stdout.write(JSON.stringify(value));
    }).catch(error => {console.error(error.message); process.exitCode=1;});
} else {
    fs.writeFileSync('/tmp/main.js', p.code);
    const result = require('child_process').spawnSync(process.execPath, ['/tmp/main.js'], {input: p.test.input, encoding:'utf8', timeout:2500, maxBuffer:128000});
    process.stdout.write(result.stdout || '');
    process.stderr.write(result.stderr || '');
    process.exitCode = result.status || (result.error ? 1 : 0);
}
`;

export function staticConstraints(code: string, spec: Specification): string[] {
    const found = new Set<string>();
    if (spec.language === 'javascript') {
        try {
            const tree: any = parse(code, {ecmaVersion:'latest', sourceType:'script'});
            const visit = (node: any) => {
                if (!node || typeof node !== 'object') return;
                const mapping: Record<string,string> = {ForStatement:'for',ForOfStatement:'for',ForInStatement:'for',WhileStatement:'while',DoWhileStatement:'while',ClassDeclaration:'class',FunctionDeclaration:'function',ArrowFunctionExpression:'function',FunctionExpression:'function'};
                if (mapping[node.type]) found.add(mapping[node.type]);
                if (node.type === 'CallExpression') {
                    if (node.callee.type === 'Identifier') found.add(node.callee.name);
                    if (node.callee.type === 'MemberExpression') found.add(node.callee.property.name);
                }
                Object.values(node).forEach(v => Array.isArray(v) ? v.forEach(visit) : visit(v));
            };
            visit(tree);
        } catch { return ['JAVASCRIPT_SYNTAX_ERROR']; }
    } else if (spec.language === 'cpp') {
        const stripped = code.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, ' ');
        for (const name of [...spec.required_constructs, ...spec.forbidden_constructs]) {
            if (!/^[A-Za-z_]\w*$/.test(name)) return ['UNSUPPORTED_CONSTRAINT'];
            if (new RegExp('\\b' + name + '\\b').test(stripped)) found.add(name);
        }
    } else if (spec.language === 'python') return []; // Enforced on AST inside the container.
    else if (spec.required_constructs.length || spec.forbidden_constructs.length) return ['SQL_CONSTRAINT_REQUIRES_SQL_POLICY'];
    return [...spec.required_constructs.filter(c => !found.has(c)).map(c => 'CONSTRAINT_REQUIRED:' + c),
        ...spec.forbidden_constructs.filter(c => found.has(c)).map(c => 'CONSTRAINT_FORBIDDEN:' + c)];
}

export function sandboxInput(code: string, draft: Draft, spec: Specification, index: number) {
    const tc=draft.test_cases[index];
    return {code,specification:{language:spec.language,execution:spec.execution,required_constructs:spec.required_constructs,forbidden_constructs:spec.forbidden_constructs},
        test:{input:tc.input,arguments:tc.arguments,call_style:tc.call_style,fixture_sql:tc.fixture_sql},fixture_sql:draft.fixture_sql};
}

export function executionTimeoutMs(language: string): number {
    // Docker startup on Windows can take several seconds even for a constant
    // result. This is a wall-clock harness allowance; it is not a fallback
    // and does not relax the container's resource limits.
    return language === 'cpp' ? 12000 : 8000;
}

function testContractErrors(draft: Draft, spec: Specification): string[] {
    const functionMode = spec.execution.mode === 'function';
    const errors: string[] = [];
    draft.test_cases.forEach((tc, index) => {
        if (functionMode) {
            if (tc.input != null) errors.push(`TEST_${index + 1}_FUNCTION_INPUT_FORBIDDEN`);
            if (!Array.isArray(tc.arguments)) errors.push(`TEST_${index + 1}_ARGUMENTS_REQUIRED`);
            if (!['spread', 'single'].includes(tc.call_style || '')) errors.push(`TEST_${index + 1}_CALL_STYLE_REQUIRED`);
            if (tc.call_style === 'single' && tc.arguments?.length !== 1) errors.push(`TEST_${index + 1}_SINGLE_REQUIRES_ONE_ARGUMENT`);
        } else if (typeof tc.input !== 'string' || tc.arguments != null || tc.call_style != null) {
            errors.push(`TEST_${index + 1}_STDIO_OR_SQL_INPUT_REQUIRED`);
        }
    });
    return errors;
}

function executeCase(code: string, draft: Draft, spec: Specification, index: number): Promise<CaseResult> {
    const tc = draft.test_cases[index];
    const displayInput = tc.input ?? JSON.stringify(tc.arguments);
    const image = spec.language === 'cpp' ? (process.env.ADAPTIVE_CPP_IMAGE || 'gcc:12')
        : spec.language === 'javascript' ? (process.env.ADAPTIVE_JS_IMAGE || 'node:20-alpine')
        : (process.env.ADAPTIVE_PYTHON_IMAGE || 'python:3.11-alpine');
    const name = 'adaptive-' + randomUUID();
    const args = ['run','--rm','--pull=never','-i','--name',name,'--network','none','--read-only',
        '--cap-drop=ALL','--security-opt','no-new-privileges','--pids-limit','64','--memory',spec.language === 'cpp' ? '512m' : '128m',
        '--cpus','1','--user','65534:65534','--tmpfs','/tmp:rw,exec,nosuid,size=128m',image];
    let input = JSON.stringify(sandboxInput(code,draft,spec,index));
    if (spec.language === 'cpp') {
        const source = Buffer.from(code).toString('base64'), stdin = Buffer.from(tc.input || '').toString('base64');
        args.push('sh','-c', "printf '%s' '" + source + "' | base64 -d > /tmp/main.cpp && g++ -std=c++17 -O0 /tmp/main.cpp -o /tmp/program && printf '%s' '" + stdin + "' | base64 -d | /tmp/program");
        input = '';
    } else if (spec.language === 'javascript') args.push('node','-e',JAVASCRIPT);
    else args.push('python','-I','-c',PYTHON);
    return new Promise(resolve => {
        const start = performance.now();
        const child = spawn('docker', args, {windowsHide:true, stdio:'pipe'});
        let stdout = '', stderr = '', status = '', finished = false;
        const timeoutMs = executionTimeoutMs(spec.language);
        const cleanup = () => { const p = spawn('docker',['rm','-f',name],{windowsHide:true,stdio:'ignore'}); p.on('error',()=>{}); };
        const finish = (exitCode: number | null, infrastructure = false) => {
            if (finished) return;
            finished = true;
            clearTimeout(timer);
            const state = infrastructure || exitCode === 125 || exitCode === 127 ? 'INFRA_ERROR'
                : status || (exitCode === 0 ? 'SUCCESS' : stderr.includes('CONSTRAINT_') ? 'CONSTRAINT_VIOLATION' : 'RUNTIME_ERROR');
            resolve({case_index:index+1,is_hidden:tc.is_hidden,category:tc.category,input:displayInput,expected:tc.expected_output,
                actual:stdout.trimEnd(),stderr,passed:state==='SUCCESS' && equalOutput(stdout.trimEnd(),tc.expected_output,spec),
                executed:state!=='INFRA_ERROR',status:state,runtime_ms:Math.round(performance.now()-start),image,harness_version:VERSION});
        };
        const timer = setTimeout(() => {status='TIMEOUT'; child.kill(); cleanup(); finish(null);},timeoutMs);
        child.stdout.on('data', data => {stdout+=data.toString(); if(stdout.length>MAX_OUTPUT){stdout=stdout.slice(0,MAX_OUTPUT);status='OUTPUT_LIMIT';child.kill();cleanup();}});
        child.stderr.on('data', data => {stderr+=data.toString(); if(stderr.length>MAX_OUTPUT){stderr=stderr.slice(0,MAX_OUTPUT);status='OUTPUT_LIMIT';child.kill();cleanup();}});
        child.on('error', () => {stderr='DOCKER_NOT_AVAILABLE'; finish(null,true);});
        child.on('close', code => finish(code));
        child.stdin.on('error',()=>{});
        child.stdin.end(input);
    });
}

export async function runExercise(rawDraft: unknown, rawSpec: unknown, code?: string) {
    const draft = draftSchema.parse(rawDraft), spec = specificationSchema.parse(rawSpec);
    if ((spec.language === 'cpp' && spec.execution.mode !== 'stdio') || (spec.language === 'sql' && (spec.execution.mode !== 'sql' || spec.execution.dialect !== 'sqlite'))
        || (['python','javascript'].includes(spec.language) && !['function','stdio'].includes(spec.execution.mode))) throw Error('EXECUTION_MODE_MISMATCH');
    const source = code ?? draft.reference_solution;
    if (!source.trim() || source.length > 20000) throw Error('SOURCE_SIZE_INVALID');
    const contractErrors = testContractErrors(draft, spec);
    if (contractErrors.length) return {passed:false,status:'CONTRACT_VIOLATION',errors:contractErrors,test_results:[],harness_version:VERSION};
    const errors = staticConstraints(source, spec);
    if (errors.length) return {passed:false,status:'CONSTRAINT_VIOLATION',errors,test_results:[],harness_version:VERSION};
    return slot(async () => {
        const test_results: CaseResult[] = [];
        for (let i=0;i<draft.test_cases.length;i++) {
            const result = await executeCase(source,draft,spec,i);
            test_results.push(result);
            if (result.status === 'INFRA_ERROR') return {passed:false,status:'INFRA_ERROR',error:'Docker daemon or configured image is unavailable',errors:['DOCKER_UNAVAILABLE'],test_results,harness_version:VERSION};
        }
        return {passed:test_results.every(t=>t.passed),status:'EXECUTED',test_results,
            errors:test_results.filter(t=>!t.passed).map(t=>'Test #'+t.case_index+': '+t.status+(t.status==='SUCCESS' ? ' OUTPUT_MISMATCH' : '')),
            source_hash:createHash('sha256').update(source).digest('hex'),harness_version:VERSION};
    });
}
