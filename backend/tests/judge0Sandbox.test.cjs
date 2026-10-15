const test = require('node:test');
const assert = require('node:assert/strict');
const { SandboxService } = require('../dist/infrastructure/sandbox/sandbox.service');
const { runExercise } = require('../dist/modules/adaptive/adaptiveRunner');

function withJudge0Mock(output, action) {
    const previous = {
        fetch: global.fetch,
        provider: process.env.SANDBOX_PROVIDER,
        local: process.env.ALLOW_LOCAL_SANDBOX,
        nodeEnv: process.env.NODE_ENV
    };
    const sent = [];
    process.env.SANDBOX_PROVIDER = 'judge0';
    process.env.ALLOW_LOCAL_SANDBOX = 'false';
    process.env.NODE_ENV = 'production';
    global.fetch = async (url, init) => {
        if (init.method === 'POST') {
            sent.push(JSON.parse(init.body));
            return {ok: true, json: async () => ({token: 'a'.repeat(36)})};
        }
        return {ok: true, json: async () => ({status: {id: 3}, stdout: output, stderr: null, time: '0.01'})};
    };
    return Promise.resolve().then(() => action(sent)).finally(() => {
        global.fetch = previous.fetch;
        for (const [name, value] of [
            ['SANDBOX_PROVIDER', previous.provider], ['ALLOW_LOCAL_SANDBOX', previous.local], ['NODE_ENV', previous.nodeEnv]
        ]) {
            if (value === undefined) delete process.env[name]; else process.env[name] = value;
        }
    });
}

test('regular exercise submissions use isolated Judge0 for every supported language', async () => {
    await withJudge0Mock('ok\n', async sent => {
        const service = new SandboxService();
        for (const [language, id] of [['PYTHON', 92], ['JAVASCRIPT', 93], ['CPP', 105], ['C', 50], ['SQL', 92]]) {
            const result = await service.executeBatch('print("ok")', language, ['input']);
            assert.equal(result[0].status, 'SUCCESS');
            assert.equal(sent.at(-1).language_id, id);
            assert.equal(sent.at(-1).enable_network, false);
            assert.ok(sent.at(-1).memory_limit <= 128000);
            if (language === 'SQL') {
                assert.equal(sent.at(-1).stdin, 'print("ok")');
                assert.match(sent.at(-1).source_code, /sqlite3\.connect\(':memory:'\)/);
            }
        }
        assert.equal(sent.length, 5);
    });
});

test('AI reference solution is verified remotely without sending hidden answers', async () => {
    await withJudge0Mock('2\n', async sent => {
        const spec = {language: 'python', target_concept: 'PY-DICT-01', difficulty: 'EASY',
            execution: {mode: 'function', entrypoint: 'solution', comparator: 'json', call_style_required: true},
            required_constructs: [], forbidden_constructs: []};
        const draft = {reference_solution: 'def solution(n): return n', starter_code: '',
            test_cases: Array.from({length: 4}, () => ({arguments: [2], call_style: 'spread',
                expected_output: '2', is_hidden: true, category: 'normal', explanation: 'test'}))};
        const result = await runExercise(draft, spec);
        assert.equal(result.passed, true);
        assert.equal(result.test_results.length, 4);
        assert.ok(result.test_results.every(item => item.executed));
        assert.ok(sent.every(item => !item.stdin.includes('expected_output')));
        assert.ok(sent.every(item => item.language_id === 92));
    });
});

test('production rejects direct execution when remote sandbox is not configured', async () => {
    const previous = {provider: process.env.SANDBOX_PROVIDER, nodeEnv: process.env.NODE_ENV};
    delete process.env.SANDBOX_PROVIDER;
    process.env.NODE_ENV = 'production';
    try {
        await assert.rejects(() => new SandboxService().execute('print(1)', 'PYTHON'), /RUNNER_UNAVAILABLE/);
    } finally {
        if (previous.provider === undefined) delete process.env.SANDBOX_PROVIDER;
        else process.env.SANDBOX_PROVIDER = previous.provider;
        if (previous.nodeEnv === undefined) delete process.env.NODE_ENV;
        else process.env.NODE_ENV = previous.nodeEnv;
    }
});

test('Judge0 outage never falls back to local execution', async () => {
    await withJudge0Mock('unused', async () => {
        global.fetch = async () => ({ok: false, status: 503});
        await assert.rejects(() => new SandboxService().execute('print(1)', 'PYTHON'), /JUDGE0_HTTP_503/);
    });
});

test('SQL cannot use the legacy in-process runner without Judge0', async () => {
    const previous = {provider: process.env.SANDBOX_PROVIDER, nodeEnv: process.env.NODE_ENV,
        local: process.env.ALLOW_LOCAL_SANDBOX};
    delete process.env.SANDBOX_PROVIDER;
    process.env.NODE_ENV = 'development';
    delete process.env.ALLOW_LOCAL_SANDBOX;
    try {
        await assert.rejects(() => new SandboxService().execute('SELECT 1', 'SQL'), /RUNNER_UNAVAILABLE/);
    } finally {
        for (const [name, value] of [['SANDBOX_PROVIDER', previous.provider], ['NODE_ENV', previous.nodeEnv],
            ['ALLOW_LOCAL_SANDBOX', previous.local]]) {
            if (value === undefined) delete process.env[name]; else process.env[name] = value;
        }
    }
});
