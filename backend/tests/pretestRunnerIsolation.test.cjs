const test = require('node:test');
const assert = require('node:assert/strict');
require('ts-node/register/transpile-only');
const { BatchCodeRunner } = require('../src/infrastructure/sandbox/batch/batch.runner');
const { setDockerDaemonStatus } = require('../src/infrastructure/sandbox/utils/docker.utils');

test('Pre-test QC never falls back to local Python without Docker', async () => {
  setDockerDaemonStatus(false);
  await assert.rejects(
    new BatchCodeRunner().run('print(1)', 'PYTHON', [''], { strictIsolation: true }),
    /RUNNER_UNAVAILABLE/,
  );
  setDockerDaemonStatus(false);
});
