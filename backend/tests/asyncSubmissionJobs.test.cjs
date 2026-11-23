// Async submission jobs: 202 at once, result by polling, per-user isolation and limits.
const test = require('node:test');
const assert = require('node:assert/strict');
process.env.NODE_ENV = 'test';
const jobs = require('../dist/modules/submissions/asyncSubmissionJobs');

function fakeRes() {
    const res = { code: 200, body: undefined };
    res.status = c => { res.code = c; return res; };
    res.json = b => { res.body = b; return res; };
    return res;
}
const wait = ms => new Promise(r => setTimeout(r, ms));
const req = (userId, query = {}, params = {}) => ({ user: { id: userId }, query, params, body: {} });
const poll = (userId, jobId) => { const res = fakeRes(); jobs.getSubmissionJob(req(userId, {}, { jobId }), res); return res; };

test('wantsAsync reads the async query flag', () => {
    assert.equal(jobs.wantsAsync({ query: { async: '1' } }), true);
    assert.equal(jobs.wantsAsync({ query: {} }), false);
});

test('answers 202 immediately and exposes the finished result to its owner only', async () => {
    jobs.resetSubmissionJobsForTests();
    let release;
    const gate = new Promise(r => { release = r; });
    const res = fakeRes();
    assert.equal(jobs.startSubmissionJob(req('u1'), res, async (_q, out) => { await gate; out.status(200).json({ success: true, allPassed: true }); }), true);
    assert.equal(res.code, 202);
    assert.ok(res.body.jobId);
    await wait(10);
    assert.equal(poll('u1', res.body.jobId).body.state, 'running');
    assert.equal(poll('u2', res.body.jobId).code, 404);
    release();
    await wait(20);
    const done = poll('u1', res.body.jobId);
    assert.equal(done.body.state, 'done');
    assert.equal(done.body.statusCode, 200);
    assert.deepEqual(done.body.body, { success: true, allPassed: true });
});

test('handler errors and silent handlers end as a 500 result instead of hanging', async () => {
    jobs.resetSubmissionJobsForTests();
    const failing = fakeRes();
    jobs.startSubmissionJob(req('u1'), failing, async (_q, _r, next) => next(new Error('boom')));
    const silent = fakeRes();
    jobs.startSubmissionJob(req('u2'), silent, async () => {});
    await wait(30);
    for (const [user, res] of [['u1', failing], ['u2', silent]]) {
        const out = poll(user, res.body.jobId);
        assert.equal(out.body.state, 'done');
        assert.equal(out.body.statusCode, 500);
    }
});

test('a learner cannot queue more than two unfinished submissions', async () => {
    jobs.resetSubmissionJobsForTests();
    const never = new Promise(() => {});
    const handler = async () => never;
    assert.equal(jobs.startSubmissionJob(req('u1'), fakeRes(), handler), true);
    assert.equal(jobs.startSubmissionJob(req('u1'), fakeRes(), handler), true);
    const third = fakeRes();
    assert.equal(jobs.startSubmissionJob(req('u1'), third, handler), false);
    assert.equal(third.code, 429);
    assert.equal(jobs.startSubmissionJob(req('u2'), fakeRes(), handler), true);
});

test('unknown jobs and anonymous callers are rejected', () => {
    jobs.resetSubmissionJobsForTests();
    assert.equal(poll('u1', 'missing').code, 404);
    const anon = fakeRes();
    assert.equal(jobs.startSubmissionJob({ query: {}, params: {} }, anon, async () => {}), false);
    assert.equal(anon.code, 401);
});
