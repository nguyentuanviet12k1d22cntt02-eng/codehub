const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
require('ts-node/register/transpile-only');

const { parseInteractionTelemetry } = require('../src/modules/learning-events/interactionTelemetry');
const { buildGradingDiagnostics } = require('../src/modules/learning-events/interactionErrorClassifier');

test('interaction telemetry accepts bounded values and rejects polluted values', () => {
  const openedAt = new Date(Date.now() - 2_000).toISOString();
  assert.deepEqual(parseInteractionTelemetry({
    sessionId: 'session-1', openedAt, activeTimeSeconds: 120, hintCount: 2,
  }), {
    sessionId: 'session-1', openedAt: new Date(openedAt), activeTimeSeconds: 120, hintCount: 2,
  });
  assert.deepEqual(parseInteractionTelemetry({
    sessionId: '', openedAt: 'invalid', activeTimeSeconds: -1, hintCount: 1001,
  }), {
    sessionId: null, openedAt: null, activeTimeSeconds: null, hintCount: 0,
  });
});

test('migration covers every durable graded-attempt source and backfills history', () => {
  const migration = fs.readFileSync(path.join(__dirname,
    '../prisma/migrations/20261009120000_learning_interaction_event_log/migration.sql'), 'utf8');
  for (const source of [
    'COURSE_SUBMISSION', 'PRACTICE_SUBMISSION', 'PRETEST_ANSWER',
    'ROADMAP_QUIZ', 'ROADMAP_PRACTICAL', 'ADAPTIVE_SUBMISSION',
  ]) assert.match(migration, new RegExp(`'${source}'`));
  assert.match(migration, /ENABLE ROW LEVEL SECURITY/);
  assert.match(migration, /UNIQUE \("source_type", "source_record_id"\)/);
  assert.match(migration, /Backfill existing graded records/);
});

test('grading diagnostics classify trusted execution failures for training', () => {
  const base = {
    language: 'PYTHON',
    allPassed: false,
    astResult: { isValid: true, error: null },
    testResults: [{ passed: false }],
  };

  assert.deepEqual(buildGradingDiagnostics({
    ...base,
    executionResults: [{
      status: 'ERROR', stdout: '', runtimeMs: 5,
      stderr: '[Lỗi biên dịch PYTHON] File "/tmp/main.py", line 1\nSyntaxError: invalid syntax',
    }],
  }), {
    errorType: 'SYNTAX_ERROR',
    errorSummary: '[Lỗi biên dịch PYTHON] File "<path>", line 1 SyntaxError: invalid syntax',
    testsPassed: 0,
    testsTotal: 1,
  });

  assert.equal(buildGradingDiagnostics({
    ...base,
    executionResults: [{ status: 'TIMEOUT', stdout: '', stderr: '', runtimeMs: 5000 }],
  }).errorType, 'TIMEOUT');

  assert.equal(buildGradingDiagnostics({
    ...base,
    language: 'CPP',
    executionResults: [{
      status: 'ERROR', stdout: '', runtimeMs: 0,
      stderr: '[Lỗi biên dịch CPP] solution.cpp:1:2: error: expected ; before }',
    }],
  }).errorType, 'COMPILE_ERROR');

  assert.equal(buildGradingDiagnostics({
    ...base,
    executionResults: [{
      status: 'ERROR', stdout: '', runtimeMs: 5,
      stderr: 'Traceback: ZeroDivisionError: division by zero',
    }],
  }).errorType, 'RUNTIME_ERROR');

  assert.equal(buildGradingDiagnostics({
    ...base,
    executionResults: [{ status: 'SUCCESS', stdout: 'wrong', stderr: '', runtimeMs: 5 }],
  }).errorType, 'WRONG_OUTPUT');

  assert.equal(buildGradingDiagnostics({
    ...base,
    astResult: { isValid: false, error: 'Missing required loop' },
    executionResults: [{ status: 'SUCCESS', stdout: 'ok', stderr: '', runtimeMs: 5 }],
    testResults: [{ passed: true }],
  }).errorType, 'AST_VALIDATION_ERROR');
});
