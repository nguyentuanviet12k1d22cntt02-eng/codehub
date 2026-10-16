const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { SandboxService } = require('../dist/infrastructure/sandbox/sandbox.service');
const { runExercise } = require('../dist/modules/adaptive/adaptiveRunner');

function withJudge0Mock(output, action) {
    const previousFetch = global.fetch;
    const sent = [];
    global.fetch = async (_url, init) => {
        if (init.method === 'POST') {
            sent.push(JSON.parse(init.body));
            return {ok: true, json: async () => ({token: 'a'.repeat(36)})};
        }
        return {ok: true, json: async () => ({status: {id: 3}, stdout: output, stderr: null, time: '0.01'})};
    };
    return Promise.resolve().then(() => action(sent)).finally(() => {
        global.fetch = previousFetch;
    });
}

test('all supported submissions use Judge0 without a provider switch', async () => {
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

test('Judge0 outage fails closed and never executes locally', async () => {
    await withJudge0Mock('unused', async () => {
        global.fetch = async () => ({ok: false, status: 503});
        await assert.rejects(() => new SandboxService().execute('print(1)', 'PYTHON'), /JUDGE0_HTTP_503/);
    });
});

test('local Docker and process runners are absent from the execution path', () => {
    const backendRoot = path.resolve(__dirname, '..');
    const activeSources = [
        'src/infrastructure/sandbox/sandbox.service.ts',
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
