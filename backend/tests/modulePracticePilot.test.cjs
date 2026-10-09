const assert = require('node:assert/strict');
const test = require('node:test');
const {
  skillForPractice, verifiedPracticeCandidates, selectPracticeCandidate,
} = require('../dist/modules/courses/modulePracticeRecommendation');

test('module-practice mapping is limited to the six trained Python skills', () => {
  assert.equal(skillForPractice('LS-03.MP_FOR', 'In lời chào N lần'), 'PY-FLOW-03');
  assert.equal(skillForPractice('LS-03.MP_WHILE', 'Đếm từ 1 đến N bằng while'), 'PY-FLOW-02');
  assert.equal(skillForPractice('LS-04.MP', 'Đảo ngược chuỗi'), null);
});

test('placeholder grading content is excluded before adaptive selection', () => {
  const fixture = (title, solutionCode, testCases) => ({
    id: title, title, difficulty: 'EASY', problemDescription: 'Nhập a b và in tổng',
    solutionCode, testCases,
  });
  const candidates = verifiedPracticeCandidates('LS-01.MP', [
    fixture('Tính tổng hai số', 'val_0 = input()\nprint("Tổng")', [{ input: 'a b', expectedOutput: 'Tổng' }]),
    fixture('Tính tổng hai số', 'a,b=map(int,input().split());print(a+b)', [
      { input: '1 2', expectedOutput: '3' }, { input: '2 3', expectedOutput: '5' },
      { input: '3 4', expectedOutput: '7' },
    ]),
  ]);
  assert.equal(candidates.length, 1);
});

test('pilot score selects easier work after failure and advances after success', () => {
  const candidates = ['EASY', 'MEDIUM', 'HARD'].map((difficulty, index) => ({
    id: difficulty, title: difficulty, difficulty, skill_id: 'PY-FLOW-01', level: index + 1,
  }));
  const scores = candidates.map(({ id }) => ({ id, predicted_correctness: 0.65 }));
  assert.equal(selectPracticeCandidate(candidates, scores, []).candidate.id, 'EASY');
  assert.equal(selectPracticeCandidate(candidates, scores, [
    { skill_id: 'PY-FLOW-01', is_correct: 0 },
  ]).candidate.id, 'EASY');
  assert.equal(selectPracticeCandidate(candidates, scores, [
    { skill_id: 'PY-FLOW-01', is_correct: 1 },
    { skill_id: 'PY-FLOW-01', is_correct: 1 },
  ]).candidate.id, 'HARD');
});
