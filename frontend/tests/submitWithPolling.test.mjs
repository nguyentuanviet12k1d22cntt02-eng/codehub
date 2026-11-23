// Async grading: 202 + polling, old 200 backend, error shape and cancellation.
import assert from 'node:assert/strict';
import http from 'node:http';
import { createServer } from 'vite';

let pollsBeforeDone = 2, finalStatus = 200, postMode = 'async', polls = 0, lastQuery = '';
const api = http.createServer((req, res) => {
    const json = (code, body) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(body)); };
    if (req.method === 'POST') {
        lastQuery = req.url.split('?')[1] || '';
        req.resume();
        if (postMode === 'sync') return json(200, { success: true, allPassed: true, via: 'sync' });
        polls = 0;
        return json(202, { success: true, jobId: 'job-1', state: 'queued', ahead: 3 });
    }
    if (req.url.startsWith('/api/auth/submission-jobs/job-1')) {
        if (++polls <= pollsBeforeDone) return json(200, { success: true, state: 'running', ahead: 0 });
        return json(200, { success: true, state: 'done', statusCode: finalStatus, body: finalStatus === 200 ? { success: true, allPassed: true, via: 'async' } : { error: 'Lỗi chấm' } });
    }
    json(404, { error: 'JOB_NOT_FOUND' });
});
await new Promise(resolve => api.listen(0, '127.0.0.1', resolve));
process.env.VITE_API_URL = `http://127.0.0.1:${api.address().port}`;

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
try {
    const { submitWithPolling } = await server.ssrLoadModule('/src/features/practice/submitWithPolling.ts');
    const url = `${process.env.VITE_API_URL}/api/auth/exercises/e1/submit`;

    const seen = [];
    const done = await submitWithPolling(url, { code: 'x' }, { headers: {} }, p => seen.push(p));
    assert.equal(done.data.via, 'async');
    assert.match(lastQuery, /async=1/);
    assert.deepEqual(seen[0], { state: 'queued', ahead: 3 });
    assert.ok(seen.some(p => p.state === 'running'));

    postMode = 'sync';
    assert.equal((await submitWithPolling(url, {}, { headers: {} })).data.via, 'sync');

    postMode = 'async'; finalStatus = 500;
    await assert.rejects(() => submitWithPolling(url, {}, { headers: {} }), err => err.response?.status === 500 && err.response.data.error === 'Lỗi chấm');

    finalStatus = 200; pollsBeforeDone = 50;
    const controller = new AbortController();
    const pending = submitWithPolling(url, {}, { headers: {}, signal: controller.signal });
    setTimeout(() => controller.abort(), 300);
    await assert.rejects(() => pending, err => err.code === 'ERR_CANCELED' || err.name === 'CanceledError');
} finally {
    await server.close();
    api.close();
}
console.log('submitWithPolling ok');
