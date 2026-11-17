// Nhóm D: test ẩn bổ sung loại được lời giải sai mà bộ test cũ cho qua; lời giải mẫu qua hết.
const test = require('node:test'), assert = require('node:assert/strict'), path = require('node:path');
const { spawnSync } = require('node:child_process');
process.env.TS_NODE_PROJECT = path.resolve(__dirname, '../tsconfig.json');
require('ts-node/register/transpile-only');
const { EXTRA_TESTCASES } = require('../src/modules/exercises/exerciseExtraTestcases');
const { extraTestcasesFor } = require('../src/modules/exercises/exerciseContentPatches');
const { matchCoursePythonOutput } = require('../src/modules/adaptive/pythonOutputPolicy');
const seed = require('../prisma/seed/seed_course_data.json');
const runtime = require('../src/infrastructure/data/pythonModulePracticeRuntime.r03.json');

const exercises = new Map();
for (const m of seed) for (const c of m.chapters) for (const l of c.lessons) for (const e of l.codingExercises) exercises.set(e.id, { ...e, lessonCode: l.lessonId });
const pinned = new Set(runtime.rows.map(r => r.exercise_id));
const python = ['python', 'python3', 'py'].find(cmd => spawnSync(cmd, ['--version']).status === 0);
const passesAll = (id, code, cases) => cases.every(tc => {
  const run = spawnSync(python, ['-I', '-X', 'utf8', '-c', code], { input: tc.input, encoding: 'utf8' });
  return run.status === 0 && matchCoursePythonOutput(id, run.stdout, tc.expectedOutput);
});
const allCases = id => [...exercises.get(id).testCases, ...extraTestcasesFor(id)];

test('test bổ sung chỉ cho bài bị ghim, đều ẩn, ID không trùng DB', () => {
  for (const [id, cases] of Object.entries(EXTRA_TESTCASES)) {
    assert.ok(pinned.has(id), id);
    assert.ok(cases.length > 0 && cases.every(tc => tc.isHidden === true));
    const existing = new Set(exercises.get(id).testCases.map(tc => tc.input));
    assert.ok(cases.every(tc => !existing.has(tc.input)), 'trùng input với test trong DB: ' + id);
    assert.deepEqual(extraTestcasesFor(id).map(tc => tc.id), cases.map((_, i) => `${id}:extra:${i + 1}`));
  }
  assert.deepEqual(extraTestcasesFor('khong-co'), []);
});

test('lời giải mẫu qua toàn bộ test cũ + test bổ sung', { skip: !python && 'không có Python' }, () => {
  for (const id of Object.keys(EXTRA_TESTCASES)) assert.ok(passesAll(id, exercises.get(id).solutionCode, allCases(id)), exercises.get(id).title);
});

// Lời giải sai từng qua bộ test cũ (audit nhóm D) nay phải trượt.
const WRONG = {
  'cc3b3941-aa81-47e0-8e6a-2358a1a08a69': 'def la_so_nguyen_to(n):\n    return n == 2 or (n > 1 and n % 2 == 1)\nprint(la_so_nguyen_to(int(input())))\n',
  'd4f8f603-d8b7-44ef-b6d2-86a729ba1956': 'nums = list(map(int, input().split()))\nk = int(input())\nprint(nums[-k:] + nums[:-k] if k else nums)\n',
  '1bf893c8-ce12-4770-9764-1ee296c28016': 'import sys\nfor line in sys.stdin:\n    if int(line) == 1234:\n        print("DUNG")\n        break\nelse:\n    print("KHOA")\n', // không giới hạn 3 lần
  '3baeca09-ecb0-4053-98e9-a42f49b39824': 's = float(input())\nk = float(input())\nt = input().strip() == "True"\nif (s >= 50000000 and t) or (k > 500 and t):\n    print("Rủi ro Cao")\nelif (10000000 <= s < 50000000 and t) or (100 < k <= 500 and t):\n    print("Rủi ro Trung bình")\nelse:\n    print("Giao dịch An toàn")\n',
  '348c1adc-93e5-470c-872b-de593bc010c3': 't = float(input())\nn = int(input())\nv = input().strip() == "True"\nif t >= 5000000:\n    print(f"Tổng tiền sau giảm giá 20%: {t * 0.8} VND (Siêu giảm giá)")\nelif t >= 2000000:\n    print(f"Tổng tiền sau giảm giá 10%: {t * 0.9} VND (Giảm giá đặc biệt)")\nelif v:\n    print(f"Tổng tiền sau giảm giá 5%: {t * 0.95} VND (Giảm giá cho thành viên)")\nelse:\n    print(f"Không có giảm giá. Tổng tiền: {t} VND")\n',
  '06a574af-d994-4c55-a3d0-3d322745c21b': 't = int(input())\ng = input().strip()\nprint("Có thể xem phim" if g == "hài hước" or (g == "kinh dị" and t >= 18) else "Không thể xem phim")\n',
};

test('lời giải sai từng lọt qua nay bị test bổ sung loại', { skip: !python && 'không có Python' }, () => {
  for (const [id, code] of Object.entries(WRONG)) {
    const e = exercises.get(id);
    assert.ok(passesAll(id, code, e.testCases), 'mẫu sai phải từng qua bộ test cũ: ' + e.title);
    assert.ok(!passesAll(id, code, allCases(id)), 'mẫu sai vẫn qua sau khi bổ sung: ' + e.title);
  }
});
