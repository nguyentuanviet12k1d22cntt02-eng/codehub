const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const test = require('node:test');
require('ts-node/register/transpile-only');
const { exercisesData } = require('../prisma/seed/exercises_data');
const { verifiedPracticeCandidates } = require('../dist/modules/courses/modulePracticeRecommendation');

const normalize = (value) => value.replace(/\r\n/g, '\n').trimEnd();

test('pilot maps the reviewed local bank and excludes two out-of-vocabulary items', () => {
  assert.equal(verifiedPracticeCandidates('LS-01.MP', exercisesData['LS-01.MP']).length, 30);
  assert.equal(verifiedPracticeCandidates('LS-02.MP', exercisesData['LS-02.MP']).length, 28);
  assert.equal(verifiedPracticeCandidates('LS-03.MP_FOR', exercisesData['LS-03.MP_FOR']).length, 15);
  assert.equal(verifiedPracticeCandidates('LS-03.MP_WHILE', exercisesData['LS-03.MP_WHILE']).length, 15);
});

function runPython(code, input) {
  return new Promise((resolve, reject) => {
    const child = spawn('python', ['-c', code], {
      env: { ...process.env, PYTHONIOENCODING: 'utf-8' }, timeout: 2000,
    });
    let stdout = '';
    let stderr = '';
    child.stdout.setEncoding('utf8').on('data', (chunk) => { stdout += chunk; });
    child.stderr.setEncoding('utf8').on('data', (chunk) => { stderr += chunk; });
    child.on('error', reject);
    child.on('close', (status, signal) => resolve({ status, signal, stdout, stderr }));
    child.stdin.end(input);
  });
}

for (const [lessonId, expectedCases] of Object.entries({
  'LS-01.MP': 120,
  'LS-02.MP': 122,
  'LS-03.MP_FOR': 17,
  'LS-03.MP_WHILE': 17,
})) {
  test(`${lessonId} solutions pass ${expectedCases} seed testcases`, async () => {
    const cases = [];
    const exercises = exercisesData[lessonId];
    assert.ok(exercises.length > 0, `${lessonId} has no vetted candidates`);
    for (const exercise of exercises) {
      for (const sample of exercise.testCases) {
        cases.push({ lessonId, exercise, sample });
      }
    }
    assert.equal(cases.length, expectedCases);
    let cursor = 0;
    await Promise.all(Array.from({ length: 8 }, async () => {
      while (cursor < cases.length) {
        const { exercise, sample } = cases[cursor++];
        const result = await runPython(exercise.solutionCode, sample.input);
        assert.equal(result.status, 0,
          `${lessonId}: ${exercise.title}; signal=${result.signal}; stderr=${result.stderr}`);
        assert.equal(normalize(result.stdout), normalize(sample.expectedOutput),
          `${lessonId}: ${exercise.title}; input=${JSON.stringify(sample.input)}`);
      }
    }));
  });
}
