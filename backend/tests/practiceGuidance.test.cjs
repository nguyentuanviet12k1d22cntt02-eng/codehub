const test = require('node:test');
const assert = require('node:assert/strict');
const { evidencePracticeGuidance, isGraderFailure, practiceAnalysisInput, requestPracticeGuidance } = require('../dist/modules/adaptive/practiceGuidance');
const { publicGrading, analyzePracticeSubmission } = require('../dist/modules/adaptive/adaptive.controller');

const run = { artifact: { title: 'Duyệt ký tự', concept_name: 'Vòng lặp for', language: 'python',
    problem_statement: 'In từng ký tự.', spec_snapshot: { required_constructs: ['for'], forbidden_constructs: ['while'], execution: { mode: 'stdio', comparator: 'text' } } } };

test('only public test evidence and this submission code reach AI', () => {
    const input = practiceAnalysisInput('for c in input():\n print(c)', {
        passed: false, status: 'EXECUTED', errors: ['Test #1: OUTPUT_MISMATCH'], test_results: [
            { is_hidden: false, passed: false, status: 'SUCCESS', input: 'abc', expected: 'a\nb\nc', actual: '', stderr: '' },
            { is_hidden: true, passed: false, status: 'SUCCESS', input: 'SECRET_INPUT', expected: 'SECRET_EXPECTED', actual: 'SECRET_ACTUAL', stderr: 'SECRET_ERROR' },
        ],
    }, run);
    assert.equal(input.code, 'for c in input():\n print(c)');
    assert.equal(input.required_constructs[0], 'for');
    assert.equal(input.hidden_failed_count, 1);
    assert.equal(JSON.stringify(input).includes('SECRET_'), false);
});

test('grader contract and sandbox errors are not learner failures', () => {
    assert.equal(isGraderFailure({ status: 'CONTRACT_VIOLATION', errors: ['TEST_1_ARGUMENTS_REQUIRED'] }), true);
    assert.equal(isGraderFailure({ status: 'INFRA_ERROR' }), true);
    assert.equal(isGraderFailure({ status: 'EXECUTED', test_results: [{ status: 'INFRA_ERROR' }] }), true);
    assert.equal(isGraderFailure({ status: 'CONSTRAINT_VIOLATION', errors: ['CONSTRAINT_REQUIRED:for'] }), false);
    assert.equal(isGraderFailure({ status: 'EXECUTED', test_results: [{ status: 'RUNTIME_ERROR', stderr: 'ValueError: CONSTRAINT_REQUIRED:for' }] }), false);
});

test('grading immediately includes evidence feedback without claiming it came from AI', () => {
    const response = publicGrading({ status: 'EXECUTED', passed: false, submission_id: 's1', test_results: [
        { case_index: 1, is_hidden: false, passed: false, input: 'abc', expected: 'a\nb\nc', actual: '', status: 'SUCCESS' },
        { case_index: 2, is_hidden: true, passed: false, input: 'PRIVATE_IN', expected: 'PRIVATE_EXPECTED', actual: 'PRIVATE_ACTUAL', status: 'SUCCESS' },
    ] }, 'print(1)', run);
    assert.equal(response.guidance.source, 'EVIDENCE');
    assert.match(response.guidance.title, /đầu ra/);
    assert.equal(response.submission_id, 's1');
    assert.equal(JSON.stringify(response).includes('PRIVATE_'), false);
    const broken = publicGrading({ status: 'CONTRACT_VIOLATION', passed: false,
        errors: ['TEST_1_ARGUMENTS_REQUIRED'], test_results: [] }, 'print(1)', run);
    assert.equal(broken.success, false);
    assert.equal(broken.error, 'GRADER_UNAVAILABLE');
    assert.match(broken.guidance.reason, /không chứng minh mã của bạn sai/);
});

test('AI feedback is tied to real source and rejects a fake model response', async () => {
    const previousFetch = global.fetch;
    process.env.ADAPTIVE_INTERNAL_SECRET = 'test-secret';
    try {
        global.fetch = async (_url, options) => {
            const payload = JSON.parse(options.body);
            assert.equal(payload.code, 'print(1)');
            assert.match(options.headers['X-Adaptive-Signature'], /^[a-f0-9]{64}$/);
            return { ok: true, json: async () => ({ guidance: {
                source: 'AI', title: 'Sai kết quả', reason: 'Lệnh in chưa dùng dữ liệu đầu vào.',
                hint: 'Kiểm tra giá trị truyền vào print.', line: 1, line_evidence:'print(1)',confidence:'high',
            } }) };
        };
        const guidance = await requestPracticeGuidance('print(1)', failedResult(), run);
        assert.equal(guidance.location, 'Dòng 1');
        assert.equal(guidance.source, 'AI');
        global.fetch = async () => ({ ok: true, json: async () => ({ guidance: { title: 'fake' } }) });
        assert.equal((await requestPracticeGuidance('print(1)', { passed: false }, run)).source, 'EVIDENCE');
    } finally {
        global.fetch = previousFetch;
    }
});

const failedResult = (overrides = {}, testOverrides = {}) => ({ passed: false, status: 'EXECUTED', errors: [],
    test_results: [{ case_index: 1, is_hidden: false, passed: false, status: 'SUCCESS',
        input: 'ab', expected: 'a\nb', actual: 'ab', stderr: '', ...testOverrides }], ...overrides });

test('all public failure types and success have concrete nonempty feedback', () => {
    for (const [caseResult, title] of [
        [failedResult({}, {actual: ''}), /đầu ra/],
        [failedResult({}, {actual: 'a b'}), /định dạng/],
        [failedResult(), /chưa khớp/],
        [failedResult({}, {status: 'TIMEOUT'}), /kết thúc kịp/],
        [failedResult({}, {status: 'MEMORY_LIMIT_EXCEEDED'}), /bộ nhớ/],
        [failedResult({}, {status: 'RUNTIME_ERROR', stderr: 'NameError: name x is not defined'}), /khi chạy/],
        [failedResult({}, {status: 'RUNTIME_ERROR', stderr: 'SyntaxError: invalid syntax'}), /cú pháp/],
        [failedResult({passed: true}, {passed: true}), /hoàn thành/],
    ]) {
        const guidance = evidencePracticeGuidance('for c in input():\n print(c)', caseResult, run);
        assert.equal(guidance.source, 'EVIDENCE');
        assert.match(guidance.title, title);
        assert.ok(guidance.reason.length > 10 && guidance.hint.length > 10);
    }
});

test('constraint feedback is confirmed against the current exercise, not a harness line', () => {
    const missing = evidencePracticeGuidance('pass', failedResult({}, {status: 'RUNTIME_ERROR',
        stderr: 'File "/work/main.py", line 24\nValueError: CONSTRAINT_REQUIRED:for'}), run);
    assert.match(missing.title, /for/);
    assert.equal(missing.location, undefined);
    const forbidden = evidencePracticeGuidance('while True: pass', {status:'CONSTRAINT_VIOLATION', errors:['CONSTRAINT_FORBIDDEN:while']}, run);
    assert.match(forbidden.reason, /while/);
    const unknown = evidencePracticeGuidance('pass', {status:'CONSTRAINT_VIOLATION', errors:['CONSTRAINT_REQUIRED:SECRET_CONSTRUCT']}, run);
    assert.equal(JSON.stringify(unknown).includes('SECRET_CONSTRUCT'), false);
});

test('only student traceback lines within the submitted source are shown', () => {
    for (const [stderr, location] of [
        ['File "/work/main.py", line 24\nFile "<submission>", line 2\nNameError: x', 'Dòng 2'],
        ['File "<unknown>", line 1\nSyntaxError: invalid syntax', 'Dòng 1'],
        ['File "/work/main.py", line 1\nNameError: x', undefined],
        ['main.cpp:2:3: error: expected ;', 'Dòng 2'],
        ['student.js:2:8\nReferenceError: x', 'Dòng 2'],
        ['File "<submission>", line 200\nNameError: x', undefined],
    ]) assert.equal(evidencePracticeGuidance('x\ny', failedResult({}, {status: 'RUNTIME_ERROR', stderr}), run).location, location);
});

test('hidden-only failures never disclose private input output errors or a guessed line', () => {
    const result = failedResult({test_results:[{is_hidden: true, passed: false, status:'RUNTIME_ERROR',
        input:'PRIVATE_INPUT', expected:'PRIVATE_EXPECTED', actual:'PRIVATE_ACTUAL', stderr:'File "<submission>", line 1\nPRIVATE_ERROR'}]});
    const guidance = evidencePracticeGuidance('print(1)', result, run);
    assert.match(guidance.reason, /1 test ẩn/);
    assert.equal(guidance.location, undefined);
    assert.equal(JSON.stringify(guidance).includes('PRIVATE_'), false);
});

test('failing public evidence is selected even after three passing tests', () => {
    const result = failedResult();
    result.test_results.unshift(...Array.from({length:4}, () => ({is_hidden:false, passed:true})));
    assert.equal(practiceAnalysisInput('pass', result, run).public_tests[0].passed, false);
});

test('AI unavailable, overloaded, malformed or too slow always preserves this result', async () => {
    const previousFetch = global.fetch;
    process.env.ADAPTIVE_INTERNAL_SECRET = 'test-secret';
    try {
        for (const fetcher of [
            async () => { throw Error('ECONNREFUSED'); },
            async () => ({ok:false, status:429}),
            async () => ({ok:false, status:503}),
            async () => ({ok:true, json:async()=>{throw Error('invalid JSON');}}),
            async () => ({ok:true, json:async()=>({guidance:{source:'AI',title:' ',reason:'',hint:''}})}),
            () => new Promise(() => {}),
            async () => ({ok:true, json:()=>new Promise(()=>{})}),
        ]) {
            global.fetch = fetcher;
            const started = Date.now();
            const guidance = await requestPracticeGuidance('pass', failedResult({}, {actual:''}), run, 20);
            assert.equal(guidance.source, 'EVIDENCE');
            assert.match(guidance.title, /đầu ra/);
            assert.ok(Date.now() - started < 1000);
        }
    } finally { global.fetch = previousFetch; }
});

test('a grader outage returns a system diagnosis without calling a model', async () => {
    const previousFetch = global.fetch;
    try {
        global.fetch = () => { throw Error('Must not call AI for grader outage'); };
        const guidance = await requestPracticeGuidance('print(1)', {status:'INFRA_ERROR',passed:false}, run);
        assert.equal(guidance.source, 'EVIDENCE');
        assert.match(guidance.reason, /không chứng minh/);
    } finally { global.fetch = previousFetch; }
});

test('JSON output is not diagnosed as mere text whitespace', () => {
    const jsonRun = {artifact:{spec_snapshot:{execution:{comparator:'json'}}}};
    assert.doesNotMatch(evidencePracticeGuidance('pass', failedResult({}, {actual:'a b'}), jsonRun).title, /định dạng/);
});

test('analysis controller keeps ownership checks and returns feedback for AI and grader outages', async () => {
    const repo = require('../dist/modules/adaptive/adaptiveRepository');
    const previous = {getSubmission:repo.getSubmissionForGuidance,getRun:repo.getRunForExercise,fetch:global.fetch};
    const submissionId = '33333333-3333-4333-8333-333333333333';
    const req = {body:{submissionId},user:{id:'owner'}};
    const res = () => ({statusCode:200,status(code){this.statusCode=code;return this;},json(body){this.body=body;return this;}});
    try {
        repo.getSubmissionForGuidance = async (id,owner) => {
            assert.equal(id,submissionId); assert.equal(owner,'owner');
            return {code:'pass',result:failedResult({}, {actual:''}),status:'FAILED',trace_id:'same',exercise_id:'exercise'};
        };
        repo.getRunForExercise = async (_id,owner) => {assert.equal(owner,'owner');return {...run,trace_id:'same'};};
        global.fetch = async () => {throw Error('AI offline');};
        const fallback = res(); await analyzePracticeSubmission(req,fallback);
        assert.equal(fallback.statusCode,200);
        assert.equal(fallback.body.submissionId,submissionId);
        assert.equal(fallback.body.guidance.source,'EVIDENCE');
        repo.getSubmissionForGuidance = async () => ({code:'pass',status:'INFRA_ERROR',result:{status:'INFRA_ERROR'},trace_id:'same'});
        const system = res(); await analyzePracticeSubmission(req,system);
        assert.equal(system.statusCode,200);
        assert.match(system.body.guidance.reason,/không chứng minh/);
        repo.getSubmissionForGuidance = async () => null;
        const missing = res(); await analyzePracticeSubmission(req,missing);
        assert.equal(missing.statusCode,404);
        assert.equal(missing.body.guidance,undefined);
        const invalid = res(); await analyzePracticeSubmission({body:{submissionId:'bad'},user:{id:'owner'}},invalid);
        assert.equal(invalid.statusCode,400);
    } finally {
        repo.getSubmissionForGuidance = previous.getSubmission;
        repo.getRunForExercise = previous.getRun;
        global.fetch = previous.fetch;
    }
});
