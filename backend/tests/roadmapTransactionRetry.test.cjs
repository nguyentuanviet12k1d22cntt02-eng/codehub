const test = require('node:test');
const assert = require('node:assert/strict');
require('ts-node/register/transpile-only');
const { withRoadmapTransactionRetry } = require('../src/modules/onboarding/roadmapTransactionRetry');

test('retries transient Prisma P2034 conflicts and returns the successful result', async () => {
  let calls = 0;
  const result = await withRoadmapTransactionRetry(async () => {
    calls += 1;
    if (calls < 3) throw Object.assign(new Error('write conflict'), { code: 'P2034' });
    return 'ok';
  }, { maxRetries: 3, baseDelayMs: 0 });
  assert.equal(result, 'ok');
  assert.equal(calls, 3);
});

test('fails with a Vietnamese recovery message after retry budget is exhausted', async () => {
  await assert.rejects(
    withRoadmapTransactionRetry(async () => {
      throw Object.assign(new Error('deadlock'), { code: 'P2034' });
    }, { maxRetries: 1, baseDelayMs: 0 }),
    /ROADMAP_SYNC_BUSY: Tiến độ đang được cập nhật/,
  );
});

test('does not retry a non-transaction error', async () => {
  let calls = 0;
  await assert.rejects(withRoadmapTransactionRetry(async () => {
    calls += 1;
    throw new Error('validation failed');
  }, { baseDelayMs: 0 }), /validation failed/);
  assert.equal(calls, 1);
});
