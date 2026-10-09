const test = require('node:test');
const assert = require('node:assert/strict');
require('ts-node/register/transpile-only');
const { buildPretestProfile } = require('../src/modules/onboarding/pretestProfile');

const scope = {
  userId: 'learner-a', language: 'PYTHON', goalId: 'GOAL_PY_BASICS',
  graphVersion: '2.1', status: 'SUBMITTED',
};

function answer(id, skill, type, score, overrides = {}) {
  return {
    ...scope, questionSnapshotId: id, questionFamilyId: `family-${id}`,
    primarySkillId: skill, questionType: type, source: 'CURATED_VALIDATED',
    isAnswered: score !== null, score,
    gradingMethod: score === null ? null : type === 'PRACTICAL' ? 'RUNNER_VERIFIED' : 'OBJECTIVE_VERIFIED',
    scoredAt: score === null ? null : '2026-10-06T00:00:00.000Z', ...overrides,
  };
}

test('two independent objective answers produce developing; blank remains unknown', () => {
  const result = buildPretestProfile(scope, [
    answer('q1', 'PY-BASICS-01', 'CONCEPT', 1),
    answer('q2', 'PY-BASICS-01', 'CONCEPT', 0),
    answer('q3', 'PY-BASICS-03', 'CONCEPT', null),
  ]);
  assert.equal(result.skills['PY-BASICS-01'].masteryScore, 0.5);
  assert.equal(result.skills['PY-BASICS-01'].confidence, 0.84);
  assert.equal(result.skills['PY-BASICS-01'].status, 'DEVELOPING');
  assert.equal(result.skills['PY-BASICS-03'].status, 'UNKNOWN');
  assert.equal(result.skills['PY-BASICS-03'].masteryScore, null);
  assert.equal(result.answeredQuestions, 2);
  assert.equal(result.unansweredQuestions, 1);
});

test('application evidence and independent second answer can establish proficient', () => {
  const result = buildPretestProfile(scope, [
    answer('q1', 'PY-FLOW-01', 'CONCEPT', 1),
    answer('q2', 'PY-FLOW-01', 'PRACTICAL', 1),
  ]);
  assert.equal(result.skills['PY-FLOW-01'].status, 'PROFICIENT');
  assert.equal(result.skills['PY-FLOW-01'].hasApplicationEvidence, true);
  const failed = buildPretestProfile(scope, [answer('q3', 'PY-FLOW-03', 'PRACTICAL', 0)]);
  assert.equal(failed.skills['PY-FLOW-03'].status, 'NEEDS_FOUNDATION');
});

test('duplicate family, wrong scope and unverified runner are rejected', () => {
  const first = answer('q1', 'PY-FLOW-01', 'CONCEPT', 1);
  assert.throws(() => buildPretestProfile(scope, [first,
    answer('q2', 'PY-FLOW-01', 'TRACING', 1, { questionFamilyId: first.questionFamilyId })]),
  /PRETEST_EVIDENCE_INVALID/);
  assert.throws(() => buildPretestProfile(scope, [answer('q2', 'PY-FLOW-01', 'CONCEPT', 1,
    { language: 'JAVASCRIPT' })]), /PRETEST_EVIDENCE_SCOPE_MISMATCH/);
  assert.throws(() => buildPretestProfile(scope, [answer('q3', 'PY-FLOW-01', 'PRACTICAL', 0,
    { gradingMethod: 'INFRASTRUCTURE_FAILURE' })]), /PRETEST_GRADING_UNVERIFIED/);
  assert.throws(() => buildPretestProfile(scope, [answer('q4', 'PY-FLOW-01', 'CONCEPT', 0.5)]),
    /PRETEST_OBJECTIVE_SCORE_INVALID/);
});

test('graph mismatch and ungraded answer cannot produce a profile', () => {
  assert.throws(() => buildPretestProfile({ ...scope, graphVersion: 'old' }, []), /GRAPH_VERSION_MISMATCH/);
  assert.throws(() => buildPretestProfile(scope, [answer('q1', 'PY-FLOW-01', 'CONCEPT', null,
    { isAnswered: true })]), /PRETEST_SCORE_INVALID/);
});
