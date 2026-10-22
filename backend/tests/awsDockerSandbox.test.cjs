// Regression checks for the single EC2 Docker execution path.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
process.env.NODE_ENV = 'test';
const { SandboxService } = require('../dist/infrastructure/sandbox/sandbox.service');
const { runExercise } = require('../dist/modules/adaptive/adaptiveRunner');

function withAwsDockerMock(output, action) {
    const previous = {fetch: global.fetch, provider: process.env.SANDBOX_PROVIDER,
        url: process.env.AWS_DOCKER_GRADER_URL, token: process.env.AWS_DOCKER_GRADER_TOKEN};
    process.env.SANDBOX_PROVIDER = 'AWS_DOCKER';
    process.env.AWS_DOCKER_GRADER_URL = 'https://47.128.81.75';
    process.env.AWS_DOCKER_GRADER_TOKEN = 't'.repeat(48);
    const sent = [];
    global.fetch = async (url, init) => {
        assert.equal(url, 'https://47.128.81.75/v1/execute');
        const payload = JSON.parse(init.body);
        sent.push(payload);
        return {ok: true, json: async () => ({requestId: init.headers['X-Request-ID'],
            provider: 'aws-docker', language: payload.language,
            results: payload.inputs.map(() => ({stdout: output, stderr: '', status: 'SUCCESS', runtimeMs: 4}))})};
    };
    return Promise.resolve().then(() => action(sent)).finally(() => {
        global.fetch = previous.fetch;
        for (const [key, value] of [['SANDBOX_PROVIDER', previous.provider], ['AWS_DOCKER_GRADER_URL', previous.url], ['AWS_DOCKER_GRADER_TOKEN', previous.token]]) {
            if (value === undefined) delete process.env[key]; else process.env[key] = value;
        }
    });
}

test('SQL uses the Python/SQLite wrapper on AWS Docker', async () => {
    await withAwsDockerMock('ok\n', async sent => {
        const service = new SandboxService();
        const result = await service.executeBatch('SELECT 1', 'SQL', ['input']);
        assert.equal(result[0].status, 'SUCCESS');
        assert.equal(sent.length, 1);
        assert.equal(sent[0].language, 'PYTHON');
        assert.deepEqual(sent[0].inputs, ['SELECT 1']);
        assert.match(sent[0].sourceCode, /sqlite3\.connect\(':memory:'\)/);
    });
});

test('AWS Docker is the default provider and never sends hidden expected output', async () => {
    const previous = {
        fetch: global.fetch,
        provider: process.env.SANDBOX_PROVIDER,
        url: process.env.AWS_DOCKER_GRADER_URL,
        token: process.env.AWS_DOCKER_GRADER_TOKEN,
    };
    delete process.env.SANDBOX_PROVIDER;
    process.env.AWS_DOCKER_GRADER_URL = 'https://47.128.81.75';
    process.env.AWS_DOCKER_GRADER_TOKEN = 't'.repeat(48);
    let sent;
    global.fetch = async (url, init) => {
        assert.equal(url, 'https://47.128.81.75/v1/execute');
        assert.equal(init.headers.Authorization, `Bearer ${'t'.repeat(48)}`);
        sent = JSON.parse(init.body);
        return {
            ok: true,
            json: async () => ({
                requestId: init.headers['X-Request-ID'], provider: 'aws-docker', language: 'PYTHON',
                results: sent.inputs.map((_input, index) => ({
                    stdout: `${index}\n`, stderr: '', status: 'SUCCESS', runtimeMs: 4,
                })),
            }),
        };
    };
    try {
        const service = new SandboxService();
        const results = await service.executeBatch('print(input())', 'PYTHON', ['a', 'b'], {timeoutMs: 1500});
        assert.equal(results.length, 2);
        assert.ok(results.every(result => result.provider === 'aws-docker'));
        assert.deepEqual(sent.inputs, ['a', 'b']);
        assert.equal(sent.sourceCode, 'print(input())');
        assert.equal(JSON.stringify(sent).includes('expectedOutput'), false);
        assert.equal(JSON.stringify(sent).includes('expected_output'), false);
    } finally {
        global.fetch = previous.fetch;
        for (const [key, value] of [['SANDBOX_PROVIDER', previous.provider], ['AWS_DOCKER_GRADER_URL', previous.url], ['AWS_DOCKER_GRADER_TOKEN', previous.token]]) {
            if (value === undefined) delete process.env[key]; else process.env[key] = value;
        }
    }
});

test('AWS Docker provider refuses plaintext traffic to a remote host', async () => {
    const previousProvider = process.env.SANDBOX_PROVIDER;
    const previousUrl = process.env.AWS_DOCKER_GRADER_URL;
    const previousToken = process.env.AWS_DOCKER_GRADER_TOKEN;
    process.env.SANDBOX_PROVIDER = 'AWS_DOCKER';
    process.env.AWS_DOCKER_GRADER_URL = 'http://47.128.81.75:8080';
    process.env.AWS_DOCKER_GRADER_TOKEN = 't'.repeat(48);
    try {
        await assert.rejects(
            () => new SandboxService().execute('print(1)', 'PYTHON'),
            /AWS_DOCKER_GRADER_URL_INVALID/,
        );
    } finally {
        if (previousProvider === undefined) delete process.env.SANDBOX_PROVIDER; else process.env.SANDBOX_PROVIDER = previousProvider;
        if (previousUrl === undefined) delete process.env.AWS_DOCKER_GRADER_URL; else process.env.AWS_DOCKER_GRADER_URL = previousUrl;
        if (previousToken === undefined) delete process.env.AWS_DOCKER_GRADER_TOKEN; else process.env.AWS_DOCKER_GRADER_TOKEN = previousToken;
    }
});

test('AI Multi-Agent reference solution is verified by AWS Docker', async () => {
    const previous = {
        fetch: global.fetch,
        provider: process.env.SANDBOX_PROVIDER,
        url: process.env.AWS_DOCKER_GRADER_URL,
        token: process.env.AWS_DOCKER_GRADER_TOKEN,
    };
    process.env.SANDBOX_PROVIDER = 'AWS_DOCKER';
    process.env.AWS_DOCKER_GRADER_URL = 'https://47.128.81.75';
    process.env.AWS_DOCKER_GRADER_TOKEN = 't'.repeat(48);
    const sent = [];
    global.fetch = async (url, init) => {
        assert.equal(url, 'https://47.128.81.75/v1/execute');
        const payload = JSON.parse(init.body);
        sent.push(payload);
        return {
            ok: true,
            json: async () => ({
                requestId: init.headers['X-Request-ID'],
                provider: 'aws-docker',
                language: payload.language,
                results: payload.inputs.map(() => ({
                    stdout: '2\n', stderr: '', status: 'SUCCESS', runtimeMs: 4,
                })),
            }),
        };
    };
    try {
        const spec = {language: 'python', target_concept: 'PY-DICT-01', difficulty: 'EASY',
            execution: {mode: 'function', entrypoint: 'solution', comparator: 'json', call_style_required: true},
            required_constructs: [], forbidden_constructs: []};
        const draft = {reference_solution: 'def solution(n): return n', starter_code: '',
            test_cases: Array.from({length: 4}, () => ({arguments: [2], call_style: 'spread',
                expected_output: '2', is_hidden: true, category: 'normal', explanation: 'test'}))};
        const result = await runExercise(draft, spec);
        assert.equal(result.passed, true);
        assert.equal(result.test_results.length, 4);
        assert.ok(result.test_results.every(item => item.executed && item.image === 'aws-docker'));
        assert.equal(sent.length, 4);
        assert.ok(sent.every(item => item.language === 'PYTHON'));
        assert.ok(sent.every(item => !JSON.stringify(item).includes('expected_output')));
    } finally {
        global.fetch = previous.fetch;
        for (const [key, value] of [['SANDBOX_PROVIDER', previous.provider], ['AWS_DOCKER_GRADER_URL', previous.url], ['AWS_DOCKER_GRADER_TOKEN', previous.token]]) {
            if (value === undefined) delete process.env[key]; else process.env[key] = value;
        }
    }
});

test('all languages reject a legacy Judge0 setting', async () => {
    const previousProvider = process.env.SANDBOX_PROVIDER;
    process.env.SANDBOX_PROVIDER = 'JUDGE0';
    try {
        const service = new SandboxService();
        for (const language of ['PYTHON', 'JAVASCRIPT', 'C', 'CPP', 'SQL']) {
            await assert.rejects(() => service.execute('print(1)', language),
                /SANDBOX_PROVIDER_MUST_BE_AWS_DOCKER/);
        }
    } finally {
        if (previousProvider === undefined) delete process.env.SANDBOX_PROVIDER;
        else process.env.SANDBOX_PROVIDER = previousProvider;
    }
});

test('SQL Docker outage fails closed and never executes locally', async () => {
    await withAwsDockerMock('unused', async () => {
        global.fetch = async () => ({ok: false, status: 503});
        await assert.rejects(() => new SandboxService().execute('select 1', 'SQL'), /AWS_DOCKER_HTTP_503/);
    });
});

test('local Docker and process runners are absent from the execution path', () => {
    const backendRoot = path.resolve(__dirname, '..');
    const activeSources = [
        'src/infrastructure/sandbox/sandbox.service.ts',
        'src/infrastructure/sandbox/aws-docker/docker-grader.client.ts',
        'src/infrastructure/queue/queueService.ts',
        'src/modules/adaptive/adaptiveRunner.ts',
    ].map(file => fs.readFileSync(path.join(backendRoot, file), 'utf8')).join('\n');
    assert.doesNotMatch(activeSources, /spawn\s*\(\s*['"]docker|runCodeInDocker|BatchCodeRunner|ALLOW_LOCAL_SANDBOX/);
    for (const removed of [
        'src/infrastructure/sandbox/batch/batch.runner.ts',
        'src/infrastructure/sandbox/python/python.runner.ts',
        'src/infrastructure/sandbox/js/js.runner.ts',
        'src/infrastructure/sandbox/cpp/cpp.runner.ts',
        'src/infrastructure/sandbox/utils/docker.utils.ts',
    ]) {
        assert.equal(fs.existsSync(path.join(backendRoot, removed)), false, removed);
    }
});
