/** Manual QC on the product BatchCodeRunner, Docker-only. Not a learner API.
 * Run after reviewers have identified the exact draft SHA-256. */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
require('ts-node/register/transpile-only');
const { BatchCodeRunner } = require('../src/infrastructure/sandbox/batch/batch.runner');

const root = path.resolve(__dirname, '../..');
const draftFile = path.join(root, 'backend/src/infrastructure/data/pretestBank.pythonBasics.draft.json');
const runnerFile = path.join(root, 'backend/src/infrastructure/sandbox/batch/batch.runner.ts');
const sha256 = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');

function dockerMetadata() {
  let serverVersion;
  let imageId;
  try {
    serverVersion = execFileSync('docker', ['info', '--format', '{{.ServerVersion}}'], {
      encoding: 'utf8', timeout: 3000, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
  } catch {
    throw new Error('DOCKER_DAEMON_UNAVAILABLE');
  }
  try {
    imageId = execFileSync('docker', ['image', 'inspect', 'python:3.10-alpine', '--format', '{{.Id}}'], {
      encoding: 'utf8', timeout: 3000, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
  } catch {
    throw new Error('DOCKER_IMAGE_UNAVAILABLE');
  }
  if (!serverVersion || !imageId) throw new Error('RUNNER_IMAGE_OR_DAEMON_UNAVAILABLE');
  return { serverVersion, imageId };
}

async function main() {
  const expectedDraftSha256 = process.argv[2]?.toLowerCase();
  if (!/^[a-f0-9]{64}$/.test(expectedDraftSha256 || '')) {
    throw new Error('USAGE: node scripts/verify_python_basics_runner.cjs <reviewed-draft-sha256>');
  }
  const raw = fs.readFileSync(draftFile);
  const draftSha256 = sha256(raw);
  if (draftSha256 !== expectedDraftSha256) throw new Error('DRAFT_SHA_MISMATCH');
  const draft = JSON.parse(raw.toString('utf8'));
  if (draft.schemaVersion !== 'learnpython-pretest-bank-draft/1.0.0'
    || draft.language !== 'PYTHON' || draft.graphVersion !== '2.1'
    || draft.goalId !== 'GOAL_PY_BASICS' || draft.servingEligible !== false) {
    throw new Error('DRAFT_SCOPE_INVALID');
  }
  const practicals = draft.items.filter((item) => item.questionType === 'PRACTICAL');
  if (practicals.length !== 3) throw new Error('PRACTICAL_BLUEPRINT_INVALID');
  const docker = dockerMetadata(); // Stops before any code runs if isolated runtime is unavailable.
  const runner = new BatchCodeRunner();
  const details = [];
  for (const item of practicals) {
    if (!item.referenceSolution || !item.knownIncorrectSolution || !Array.isArray(item.testCases)
      || item.testCases.length < 3 || item.runnerSpec?.language !== 'PYTHON'
      || item.runnerSpec?.mode !== 'STDIN_STDOUT') throw new Error(`${item.id}:DRAFT_ITEM_INVALID`);
    const inputs = item.testCases.map((testCase) => testCase.input);
    const options = { strictIsolation: true, timeoutMs: 1000, compileTimeoutMs: 10000, memoryLimit: '128m' };
    const reference = await runner.run(item.referenceSolution, 'PYTHON', inputs, options);
    const incorrect = await runner.run(item.knownIncorrectSolution, 'PYTHON', inputs, options);
    const referencePassed = reference.filter((result, index) => result.status === 'SUCCESS'
      && result.stdout === item.testCases[index].expectedStdout).length;
    const incorrectCaught = incorrect.filter((result, index) => result.status !== 'SUCCESS'
      || result.stdout !== item.testCases[index].expectedStdout).length;
    details.push({
      questionId: item.id,
      testCases: item.testCases.length,
      hiddenCases: item.testCases.filter((testCase) => testCase.isHidden).length,
      referencePassed,
      incorrectCaught,
      passed: referencePassed === item.testCases.length && incorrectCaught > 0,
    });
  }
  const report = {
    status: details.every((item) => item.passed) ? 'RUNNER_QC_PASSED' : 'RUNNER_QC_FAILED',
    draftSha256,
    runnerSourceSha256: sha256(fs.readFileSync(runnerFile)),
    dockerServerVersion: docker.serverVersion,
    dockerImage: 'python:3.10-alpine',
    dockerImageId: docker.imageId,
    strictIsolation: true,
    fallbackToLocalAllowed: false,
    cases: details,
    testedAt: new Date().toISOString(),
  };
  report.evidenceDigest = sha256(JSON.stringify(report));
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (report.status !== 'RUNNER_QC_PASSED') process.exitCode = 1;
}

main().catch((error) => {
  process.stdout.write(`${JSON.stringify({ status: 'RUNNER_QC_UNAVAILABLE', reason: error.message })}\n`);
  process.exitCode = 2;
});
