const test = require('node:test');
const assert = require('node:assert/strict');
require('ts-node/register/transpile-only');
const { evaluatePretestBank, loadPretestBank } = require('../src/modules/onboarding/pretestBankGate');
const { onboardingService } = require('../src/modules/onboarding/onboardingService');

function approved(id, skill, questionType) {
  return {
    id, language: 'PYTHON', goalId: 'GOAL_PY_BASICS', graphVersion: '2.1',
    bankVersion: 'test/1.0.0', questionVersion: 'test-v1', questionFamilyId: id,
    primarySkillId: skill, questionType, difficulty: 1, prompt: `Question ${id}`,
    source: 'CURATED_VALIDATED', reviewStatus: 'APPROVED',
    reviewers: ['reviewer-a', 'reviewer-b'], validationReportSha256: 'a'.repeat(64),
    options: questionType === 'PRACTICAL' ? undefined : [{ key: 'A', text: 'A' }, { key: 'B', text: 'B' }],
    correctAnswerHash: questionType === 'PRACTICAL' ? undefined : 'c'.repeat(64),
    runnerSpec: questionType === 'PRACTICAL'
      ? { language: 'PYTHON', mode: 'STDIN_STDOUT', timeLimitMs: 1000 } : undefined,
    testCases: questionType === 'PRACTICAL'
      ? [{ input: '1\n', expectedStdout: '1\n', isHidden: true }] : undefined,
    testCasesSha256: questionType === 'PRACTICAL' ? 'd'.repeat(64) : undefined,
    runnerValidationSha256: questionType === 'PRACTICAL' ? 'b'.repeat(64) : undefined,
  };
}

test('reviewed Python basics bank is ready for attempt creation', () => {
  const result = evaluatePretestBank('PYTHON', 'GOAL_PY_BASICS', loadPretestBank());
  assert.equal(result.status, 'BANK_READY_FOR_ATTEMPT_IMPLEMENTATION');
  assert.equal(result.requiredQuestions, 12);
  assert.deepEqual(result.missingByType, { CONCEPT: 0, TRACING: 0, BUG_HUNTING: 0, PRACTICAL: 0 });
  assert.equal(result.attemptCreationAvailable, true);
});

test('goal listing exposes only goals backed by an approved pre-test bank', () => {
  const pythonGoals = onboardingService.getGoals('PYTHON').goals;
  assert.equal(pythonGoals.find(goal => goal.goalId === 'GOAL_PY_BASICS').pretestAvailable, true);
  assert.equal(pythonGoals.find(goal => goal.goalId === 'GOAL_PY_DATA').pretestAvailable, false);
  assert.equal(pythonGoals.find(goal => goal.goalId === 'GOAL_PY_FOUNDATION').pretestAvailable, false);
  assert.equal(pythonGoals.find(goal => goal.goalId === 'GOAL_PY_FULL').pretestAvailable, false);
});

test('complete reviewed fixture passes authoring gate and can issue attempt', () => {
  const skills = ['PY-BASICS-01', 'PY-BASICS-03', 'PY-STRING-02', 'PY-FLOW-01', 'PY-FLOW-03'];
  const types = ['CONCEPT', 'CONCEPT', 'CONCEPT', 'TRACING', 'TRACING', 'TRACING', 'TRACING',
    'BUG_HUNTING', 'BUG_HUNTING', 'PRACTICAL', 'PRACTICAL', 'PRACTICAL'];
  const bank = types.map((type, index) => approved(`q${index}`, skills[index % skills.length], type));
  const result = evaluatePretestBank('PYTHON', 'GOAL_PY_BASICS', bank);
  assert.equal(result.status, 'BANK_READY_FOR_ATTEMPT_IMPLEMENTATION');
  assert.deepEqual(result.missingGatewaySkills, []);
  assert.equal(result.attemptCreationAvailable, true);
  bank[11].questionFamilyId = bank[10].questionFamilyId;
  assert.equal(evaluatePretestBank('PYTHON', 'GOAL_PY_BASICS', bank).status, 'PRETEST_UNAVAILABLE');
});

test('wrong language and unreviewed content never count', () => {
  const bank = [approved('q1', 'PY-BASICS-01', 'CONCEPT'), approved('q2', 'PY-BASICS-01', 'CONCEPT')];
  bank[0].language = 'JAVASCRIPT';
  bank[1].reviewers = ['only-one'];
  const result = evaluatePretestBank('PYTHON', 'GOAL_PY_BASICS', bank);
  assert.equal(result.availableByType.CONCEPT, 0);
  assert.equal(result.rejectedBankItems, 2);
});

test('the same reviewer with different casing or whitespace is not independent review', () => {
  const item = approved('q1', 'PY-BASICS-01', 'CONCEPT');
  item.reviewers = ['Reviewer-A', ' reviewer-a '];
  const result = evaluatePretestBank('PYTHON', 'GOAL_PY_BASICS', [item]);
  assert.equal(result.availableByType.CONCEPT, 0);
  assert.equal(result.rejectedBankItems, 1);
});

test('selector finds a valid alternative when greedy gateway choice would block a later gateway', () => {
  const gateways = ['PY-BASICS-01', 'PY-BASICS-03', 'PY-STRING-02', 'PY-FLOW-01', 'PY-FLOW-03'];
  const bank = [
    approved('a-trace', gateways[0], 'TRACING'),
    approved('z-concept', gateways[0], 'CONCEPT'),
    ...gateways.slice(1).map((skill, index) => approved(`gateway-${index}`, skill, 'TRACING')),
    ...Array.from({ length: 2 }, (_, index) => approved(`concept-${index}`, 'PY-BASICS-02', 'CONCEPT')),
    ...Array.from({ length: 2 }, (_, index) => approved(`bug-${index}`, 'PY-FLOW-02', 'BUG_HUNTING')),
    ...Array.from({ length: 3 }, (_, index) => approved(`practice-${index}`, 'PY-FLOW-04', 'PRACTICAL')),
  ];
  const result = evaluatePretestBank('PYTHON', 'GOAL_PY_BASICS', bank);
  assert.equal(result.status, 'BANK_READY_FOR_ATTEMPT_IMPLEMENTATION');
  assert.deepEqual(result.missingGatewaySkills, []);
  assert.equal(result.selectionConflict, false);
});

test('duplicate question IDs and mutually exclusive families fail closed', () => {
  const skills = ['PY-BASICS-01', 'PY-BASICS-03', 'PY-STRING-02', 'PY-FLOW-01', 'PY-FLOW-03'];
  const types = ['CONCEPT', 'CONCEPT', 'CONCEPT', 'TRACING', 'TRACING', 'TRACING', 'TRACING',
    'BUG_HUNTING', 'BUG_HUNTING', 'PRACTICAL', 'PRACTICAL', 'PRACTICAL'];
  const bank = types.map((type, index) => approved(`q${index}`, skills[index % skills.length], type));
  bank.push({ ...approved('q0', 'PY-BASICS-02', 'CONCEPT') });
  assert.equal(evaluatePretestBank('PYTHON', 'GOAL_PY_BASICS', bank).status, 'PRETEST_UNAVAILABLE');
  bank.pop();
  bank[11].questionFamilyId = bank[10].questionFamilyId;
  const result = evaluatePretestBank('PYTHON', 'GOAL_PY_BASICS', bank);
  assert.equal(result.status, 'PRETEST_UNAVAILABLE');
  assert.equal(result.selectionConflict, true);
});
