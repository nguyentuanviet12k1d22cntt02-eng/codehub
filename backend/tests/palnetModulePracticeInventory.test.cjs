const test = require('node:test');
const assert = require('node:assert/strict');
const { inspectExercise, reconcile, duplicates, sourceCatalog } = require('../scripts/audit_palnet_module_practice.cjs');
const sample = () => ({ id: 'id1', title: 'Example', difficulty: 'EASY',
  problemDescription: 'Print a value', starterCode: '', solutionCode: 'print(1)',
  testCases: [{ id: 't1', input: '', expectedOutput: '1\n', isHidden: false },
    { id: 't2', input: 'a', expectedOutput: '1\n', isHidden: true }] });
const row = (e = sample(), bankCode = 'LS-01.MP') => inspectExercise(e,
  { sourceKey: 'LS-01.MP:001', bankCode, moduleCode: 'MOD-01' });

test('comparison ignores testcase IDs/order but detects hidden flags and duplicate multiplicity', () => {
  const a = sample(), b = sample(); b.testCases.reverse(); b.testCases[0].id = 'new';
  assert.equal(row(a).contentVersion, row(b).contentVersion);
  b.testCases[0].isHidden = false;
  assert.notEqual(row(a).contentVersion, row(b).contentVersion);
  b.testCases = [...a.testCases, a.testCases[0]];
  assert.notEqual(row(a).contentVersion, row(b).contentVersion);
});
test('hash comparison preserves exact whitespace; grading equivalence is not assumed', () => {
  const a = sample(), b = sample(); b.testCases[0].expectedOutput = '1';
  const diff = reconcile([row(a)], [row(b)])[0];
  assert.equal(diff.status, 'CONTENT_DRIFT');
  assert.deepEqual(diff.changedFields, ['testCases']);
});
test('same title with different ID is not auto-matched; DB-only rows stay in denominator', () => {
  const b = sample(); b.id = 'id2';
  const diff = reconcile([row()], [row(b)]);
  assert.deepEqual(diff.map(r => r.status), ['MISSING_IN_DB', 'DB_ONLY']);
  assert.deepEqual(diff[0].possibleTitleMatchIds, ['id2']);
});
test('misplaced ID is reported rather than accepted', () => {
  assert.equal(reconcile([row()], [row(sample(), 'LS-04.MP')])[0].status, 'WRONG_BANK');
  assert.equal(reconcile([row()], [row()])[0].status, 'MATCHED');
});
test('hash-only export does not certify structural clear rows, blanks or reference execution', () => {
  const e = sample(), r = row(e);
  assert.equal(r.structuralStatus, 'STRUCTURAL_CLEAR');
  assert.equal(r.recommendationEligibility, 'NOT_CERTIFIED_P0_ONLY');
  assert.equal(r.mapping.primarySkillId, null);
  assert.equal(r.sandboxValidation, 'NOT_RUN_P1_PENDING');
  assert.ok(!JSON.stringify(r).includes('print(1)'));
  assert.ok(!JSON.stringify(r).includes('Print a value'));
  e.testCases[0].expectedOutput = '';
  assert.ok(row(e).structuralIssues.includes('BLANK_EXPECTED_OUTPUT_REVIEW'));
  e.solutionCode = ''; e.testCases = [];
  assert.deepEqual(row(e).structuralIssues, ['MISSING_REFERENCE_SOLUTION', 'MISSING_TESTCASES']);
});
test('duplicates and empty banks are retained', () => {
  assert.deepEqual(duplicates([row(), row()], 'exerciseId'), [{ value: 'id1', count: 2 }]);
  const banks = sourceCatalog([{ moduleId: 'MOD-01', title: 'M1', chapters: [{ lessons: [
    { lessonId: 'LS-01.01' }, { lessonId: 'LS-01.MP', id: 'lesson1' },
  ] }] }], {});
  assert.equal(banks.length, 1); assert.equal(banks[0].items.length, 0);
});
