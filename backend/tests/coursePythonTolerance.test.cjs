// A8/A9: hai bài LS-01.MP có đáp số số thực, đề không quy định làm tròn. Cách chấm chấp nhận sai số dấu phẩy động,
// không đổi nội dung bài (được model r03 ghim). Các bài khác vẫn so chuỗi chặt như trước.
const test = require('node:test'), assert = require('node:assert/strict'), path = require('node:path');
const { spawnSync } = require('node:child_process');
process.env.TS_NODE_PROJECT = path.resolve(__dirname, '../tsconfig.json');
require('ts-node/register/transpile-only');
const { matchCoursePythonOutput, matchNumericOutput, NUMERIC_TOLERANCE_EXERCISES } = require('../src/modules/adaptive/pythonOutputPolicy');
const seed = require('../prisma/seed/seed_course_data.json');

const A8 = '45c415d2-ab5e-4b3f-a75c-e82622ba3eeb', A9 = 'c087d75a-97f8-4065-9330-c99dd4ac4390';
function findExercise(id) {
  const stack = [seed];
  while (stack.length) {
    const node = stack.pop();
    if (node && typeof node === 'object') {
      if (node.id === id && Array.isArray(node.testCases)) return node;
      stack.push(...Object.values(node));
    }
  }
  throw Error('missing ' + id);
}
const python = ['python', 'python3', 'py'].find(cmd => spawnSync(cmd, ['--version']).status === 0);

test('chỉ đúng 2 bài A8/A9 được so số có sai số', () => {
  assert.deepEqual(Object.keys(NUMERIC_TOLERANCE_EXERCISES).sort(), [A8, A9].sort());
  for (const id of [A8, A9]) assert.equal(findExercise(id).testCases.length > 0, true);
});

test('A8: lệch dấu phẩy động hoặc khác cách viết số vẫn đạt; sai thật vẫn trượt', () => {
  for (const ok of ['7.9', '7.8999999999999995\n', '7.90', '7.9000000001']) assert.equal(matchCoursePythonOutput(A8, ok, '7.9\n'), true, ok);
  for (const bad of ['7.8', '7.91', '7.9\n0', 'Điểm: 7.9', '', 'nan']) assert.equal(matchCoursePythonOutput(A8, bad, '7.9\n'), false, bad);
});

test('A9: int() cắt 1679999.99… thành 1679999 vẫn đạt; sai thật vẫn trượt', () => {
  assert.equal(matchCoursePythonOutput(A9, '1679999\n', '1680000\n'), true);
  assert.equal(matchCoursePythonOutput(A9, '1680000.0', '1680000\n'), true);
  for (const bad of ['1679998', '1350000', '1680000 VND', '168000']) assert.equal(matchCoursePythonOutput(A9, bad, '1680000\n'), false, bad);
});

test('bài khác vẫn so chặt như trước (không nới sai số)', () => {
  assert.equal(matchCoursePythonOutput('00000000-0000-0000-0000-000000000000', '7.8999999999999995', '7.9'), false);
  assert.equal(matchCoursePythonOutput('00000000-0000-0000-0000-000000000000', '7.9\r\n', '7.9\n'), true);
  assert.equal(matchCoursePythonOutput('00000000-0000-0000-0000-000000000000', 'x 7.9', '7.9'), false);
});

test('so từng dòng: dòng chữ phải khớp chính xác, số dòng phải bằng nhau', () => {
  assert.equal(matchNumericOutput('Tong:\n7.8999999999999995', 'Tong:\n7.9', 1e-6), true);
  assert.equal(matchNumericOutput('tong:\n7.9', 'Tong:\n7.9', 1e-6), false);
  assert.equal(matchNumericOutput('7.9\n7.9', '7.9', 1e-6), false);
});

test('chạy Python thật: mọi cách viết đúng đề đều qua toàn bộ testcase của seed', { skip: !python && 'không có Python' }, () => {
  const solutions = {
    [A8]: [
      'bt = float(input())\ngk = float(input())\nck = float(input())\nprint(bt * 0.2 + gk * 0.3 + ck * 0.5)\n',
      'bt = float(input())\ngk = float(input())\nck = float(input())\nprint(ck * 0.5 + gk * 0.3 + bt * 0.2)\n',
      'bt = float(input())\ngk = float(input())\nck = float(input())\nprint(round(0.2 * bt + 0.3 * gk + 0.5 * ck, 2))\n',
      'bt = float(input())\ngk = float(input())\nck = float(input())\nprint(f"{(bt * 2 + gk * 3 + ck * 5) / 10:.2f}")\n',
    ],
    [A9]: [
      'd = float(input())\nr = float(input())\nc = float(input())\ng = int(input())\nprint(int(2 * (d + r) * c * g))\n',
      'd = float(input())\nr = float(input())\nc = float(input())\ng = int(input())\nprint(int(2 * (d * c + r * c) * g))\n',
      'd = float(input())\nr = float(input())\nc = float(input())\ng = int(input())\nprint(int((2 * d * c + 2 * r * c) * g))\n',
      'd = float(input())\nr = float(input())\nc = float(input())\ng = int(input())\nprint(round(2 * (d + r) * c * g))\n',
    ],
  };
  for (const [id, codes] of Object.entries(solutions)) {
    for (const code of codes) for (const tc of findExercise(id).testCases) {
      const run = spawnSync(python, ['-I', '-c', code], { input: tc.input, encoding: 'utf8' });
      assert.equal(run.status, 0, run.stderr);
      assert.equal(matchCoursePythonOutput(id, run.stdout, tc.expectedOutput), true, `${id} ${JSON.stringify(code)} ${JSON.stringify(tc.input)} → ${JSON.stringify(run.stdout)}`);
    }
  }
});
