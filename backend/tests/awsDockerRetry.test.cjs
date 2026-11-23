// The grader client retries brief overloads (429/502/503/504, network errors) and never repeats a timed-out run.
const test = require('node:test');
const assert = require('node:assert/strict');
process.env.NODE_ENV = 'test';
process.env.AWS_DOCKER_RETRY_BASE_MS = '1';
const { executeAwsDockerBatch } = require('../dist/infrastructure/sandbox/aws-docker/docker-grader.client');

function withMock(handler, action) {
    const previous = { fetch: global.fetch, url: process.env.AWS_DOCKER_GRADER_URL, token: process.env.AWS_DOCKER_GRADER_TOKEN };
    process.env.AWS_DOCKER_GRADER_URL = 'https://52.77.97.225';
    process.env.AWS_DOCKER_GRADER_TOKEN = 't'.repeat(48);
    let calls = 0;
    global.fetch = async (url, init) => handler(++calls, init);
    return Promise.resolve(action()).finally(() => {
        global.fetch = previous.fetch;
        for (const [key, value] of [['AWS_DOCKER_GRADER_URL', previous.url], ['AWS_DOCKER_GRADER_TOKEN', previous.token]]) {
            if (value === undefined) delete process.env[key]; else process.env[key] = value;
        }
    }).then(() => calls);
}

const ok = init => ({
    ok: true, status: 200, headers: new Headers(),
    json: async () => ({
        requestId: init.headers['X-Request-ID'], provider: 'aws-docker',
        results: [{ status: 'SUCCESS', stdout: '1\n', stderr: '', runtimeMs: 5 }],
    }),
});
const status = code => ({ ok: false, status: code, headers: new Headers(), json: async () => ({}) });
const run = () => executeAwsDockerBatch('print(1)', 'PYTHON', [''], 1000);

test('a queue-full answer is retried and then succeeds', async () => {
    const calls = await withMock(
        (n, init) => (n < 3 ? status(429) : ok(init)),
        async () => assert.equal((await run())[0].stdout, '1\n'),
    );
    assert.equal(calls, 3);
});

test('a network failure is retried', async () => {
    const calls = await withMock(
        (n, init) => { if (n === 1) throw new TypeError('fetch failed'); return ok(init); },
        async () => assert.equal((await run())[0].status, 'SUCCESS'),
    );
    assert.equal(calls, 2);
});

test('retries stop after three attempts and report the HTTP status', async () => {
    const calls = await withMock(() => status(503), async () => {
        await assert.rejects(run, /AWS_DOCKER_HTTP_503/);
    });
    assert.equal(calls, 3);
});

test('client errors and timed-out runs are not retried', async () => {
    let calls = await withMock(() => status(401), async () => {
        await assert.rejects(run, /AWS_DOCKER_HTTP_401/);
    });
    assert.equal(calls, 1);
    calls = await withMock(() => { const e = new Error('timeout'); e.name = 'TimeoutError'; throw e; }, async () => {
        await assert.rejects(run, /timeout/);
    });
    assert.equal(calls, 1);
});
