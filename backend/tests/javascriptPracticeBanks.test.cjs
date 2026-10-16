const assert = require('node:assert/strict');
const test = require('node:test');
const vm = require('node:vm');
require('ts-node/register/transpile-only');

const { javascriptModules, javascriptPracticeBanks } = require('../scripts/seed_javascript_practice_banks');

const normalize = (value) => value.replace(/\r\n/g, '\n').trimEnd();

function runSolution(source, input) {
  const lines = [];
  vm.runInNewContext(source, {
    require: (name) => {
      if (name !== 'fs') throw new Error(`Unexpected module: ${name}`);
      return { readFileSync: () => input };
    },
    console: { log: (...values) => lines.push(values.join(' ')) },
  }, { timeout: 200 });
  return `${lines.join('\n')}\n`;
}

test('every JavaScript basic and advanced module has a balanced 30-question practice bank', () => {
  assert.equal(javascriptModules.length, 14);
  for (const spec of javascriptModules) {
    const bank = javascriptPracticeBanks[spec.code];
    assert.equal(bank.length, 30, spec.code);
    assert.deepEqual(bank.reduce((counts, exercise) => {
      counts[exercise.difficulty] = (counts[exercise.difficulty] || 0) + 1;
      return counts;
    }, {}), { EASY: 10, MEDIUM: 10, HARD: 10 }, spec.code);
    assert.equal(new Set(bank.map((exercise) => exercise.title)).size, 30, spec.code);
    for (const exercise of bank) {
      assert.ok(exercise.problemDescription.length > 120, `${spec.code}: description`);
      assert.ok(exercise.starterCode.includes('fs'), `${spec.code}: starter`);
      assert.ok(exercise.solutionCode.includes('fs'), `${spec.code}: solution`);
      assert.equal(exercise.testCases.length, 3, `${spec.code}: testcase count`);
      assert.equal(exercise.testCases.filter((testCase) => !testCase.isHidden).length, 1, `${spec.code}: visible testcase`);
    }
  }
});

test('all JavaScript reference solutions pass every generated testcase', () => {
  for (const spec of javascriptModules) {
    for (const exercise of javascriptPracticeBanks[spec.code]) {
      for (const testCase of exercise.testCases) {
        assert.equal(normalize(runSolution(exercise.solutionCode, testCase.input)), normalize(testCase.expectedOutput),
          `${spec.code}: ${exercise.title}; input=${JSON.stringify(testCase.input)}`);
      }
    }
  }
});
