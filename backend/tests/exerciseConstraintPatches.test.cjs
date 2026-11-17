// Nhóm B/C (audit 2026-11-16): ràng buộc bổ sung theo ID bài, bỏ chú thích khi dò từ khóa, luật cứng theo ID,
// làm rõ đề cho bài bị model r03 ghim. Lời giải mẫu của cả 322 bài vẫn phải qua mọi ràng buộc.
const test = require('node:test'), assert = require('node:assert/strict'), path = require('node:path');
process.env.TS_NODE_PROJECT = path.resolve(__dirname, '../tsconfig.json');
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://unused@127.0.0.1:1/unused';
require('ts-node/register/transpile-only');
const { StaticCodeAnalyzer, stripPythonComments, describeConstraintError } = require('../src/infrastructure/analysis/staticCodeAnalyzer');
const { CONSTRAINT_PATCHES, STATEMENT_CLARIFICATIONS, constraintPatchFor, learnerStatement } = require('../src/modules/exercises/exerciseContentPatches');
const { parseAndValidateConstraints, legacyRuleKey } = require('../src/modules/exercises/exerciseController');
const seed = require('../prisma/seed/seed_course_data.json');
const runtime = require('../src/infrastructure/data/pythonModulePracticeRuntime.r03.json');

const exercises = [];
for (const m of seed) for (const c of m.chapters) for (const l of c.lessons) for (const e of l.codingExercises) exercises.push({ ...e, lessonCode: l.lessonId });
const byId = new Map(exercises.map(e => [e.id, e]));
const pinned = new Set(runtime.rows.map(r => r.exercise_id));

function grade(e, code) {
  const ast = StaticCodeAnalyzer.analyze(code, 'PYTHON', e.problemDescription || '', e.title, constraintPatchFor(e.id));
  if (ast.infrastructureError) throw Error('AST_ANALYZER_UNAVAILABLE');
  if (!ast.isValid) return ast.error;
  return parseAndValidateConstraints(e.problemDescription || '', legacyRuleKey(e.id, e.title), code, 'PYTHON');
}
const hardcode = e => 'print(' + JSON.stringify(e.testCases[0].expectedOutput.replace(/\n$/, '')) + ')\n';

test('mọi ID được vá đều có thật; vá ràng buộc chỉ dành cho bài bị ghim', () => {
  for (const id of [...Object.keys(CONSTRAINT_PATCHES), ...Object.keys(STATEMENT_CLARIFICATIONS)]) {
    assert.ok(byId.has(id), 'không có bài ' + id);
    assert.ok(pinned.has(id), 'bài không bị ghim thì sửa thẳng trong seed: ' + byId.get(id).title);
  }
});

test('lời giải mẫu của toàn bộ 322 bài qua mọi ràng buộc (kể cả ràng buộc mới)', () => {
  const failed = [];
  for (const e of exercises) {
    if (!e.solutionCode) continue;
    const error = grade(e, e.solutionCode);
    if (error) failed.push(`${e.lessonCode} ${e.title}: ${error}`);
  }
  assert.deepEqual(failed, []);
});

test('C1/C2: in cứng đáp số không còn qua ở các bài được vá', () => {
  const passed = [];
  for (const [id, patch] of Object.entries(CONSTRAINT_PATCHES)) {
    if (!(patch.requiredConstructs || []).length) continue; // vá chỉ để cấm cấu trúc (B9) không nhằm chặn in cứng
    const e = byId.get(id);
    if (!grade(e, hardcode(e))) passed.push(e.title);
  }
  assert.deepEqual(passed, []);
});

// Bài trong bài học (không bị ghim): ràng buộc mới nằm ngay trong đề ở seed.
const SEED_FIXED = [
  '32491a11-d42b-4dc7-9ac6-be35dc1b2db8', '8b237e85-69f8-40a0-b1fe-3d0621ef032a', '383447c7-7547-4e1e-932c-a9cbb00cc633',
  'c10e0400-0fd6-4b03-9401-2c0308b27436', '05a6d342-487c-4bb9-ad8c-f042eded7cf7', '81d29cc1-71c5-4d71-aec6-645b85086660',
  '45f369df-dc38-452c-9f52-4239497f4d28', '69f6e527-867e-490e-bdd6-7c2a3a49da5f', '0bd771f1-8b93-48d4-a210-600f83a54f61',
  'e64a265d-efaa-4075-846b-8c8d659d06ff', '433ae635-89f7-45f0-bfc6-f4651b99f66e', 'fc8db2c9-c0d5-4551-b23c-16eeeecaa9f3',
  '8506d952-cc7d-475d-bf58-8c966b44ba9b', '7044d2d9-69c3-49a4-ad93-0437c47e8456', '7f2bd6d3-13e7-4700-bbeb-d87dbee8ed6d',
  '38cb13cb-f0ca-4531-9cc9-0b6c33763788', '815ea08d-5cf6-4909-864b-acc1835ed3ec', 'af45a695-e853-4a9e-abf0-41d9bad774aa',
  'a3c33496-a583-472e-a8e9-2a5aeb9f5c31',
];

test('C1/C2 bài trong bài học: in cứng đáp số không còn qua, bài không bị model ghim', () => {
  const passed = [];
  for (const id of SEED_FIXED) {
    const e = byId.get(id);
    assert.ok(e && !pinned.has(id), id);
    if (!grade(e, hardcode(e))) passed.push(e.title);
  }
  assert.deepEqual(passed, []);
});

test('C2: bài vòng lặp/global/class viết sai cách bị từ chối', () => {
  const g = id => byId.get(id);
  assert.match(grade(g('69f6e527-867e-490e-bdd6-7c2a3a49da5f'), 'n = int(input())\nwhile n:\n    print(n)\n    n -= 1\n'), /`for`/);
  assert.match(grade(g('fc8db2c9-c0d5-4551-b23c-16eeeecaa9f3'), 'status = "OFF"\ndef turn_on():\n    pass\nturn_on()\nprint("ON")\n'), /global/);
  assert.match(grade(g('a3c33496-a583-472e-a8e9-2a5aeb9f5c31'), 'class Vehicle: pass\nclass ElectricCar: pass\nprint("Tesla")\n'), /super|show_brand/);
});

test('B13: tiêu đề đã sửa và luật cứng của bài vẫn chạy', () => {
  const e = byId.get('9bfc2ca5-9217-4e36-93f8-a1deabc52d46');
  assert.equal(e.title, 'Tính toán chia lấy dư pizza');
  assert.ok(grade(e, 'print(1)\n'), 'luật biến so_tien_moi_nguoi phải còn hiệu lực');
});

test('C3: viết từ khóa bắt buộc trong chú thích không được tính', () => {
  const e = exercises.find(x => x.title === 'Bắt lỗi chia cho 0');
  const config = JSON.parse(/<!--\s*CONSTRAINTS:\s*(\{[\s\S]*?\})\s*-->/.exec(e.problemDescription)[1]);
  assert.ok((config.requiredKeywords || []).length > 0);
  const commented = hardcode(e) + '# ' + config.requiredKeywords.join(' ') + '\n';
  assert.ok(grade(e, commented), 'từ khóa trong chú thích vẫn được tính');
  assert.equal(grade(e, e.solutionCode), null);
});

test('stripPythonComments bỏ chú thích nhưng giữ chuỗi có dấu #', () => {
  assert.equal(stripPythonComments('x = "a # b"  # try\nprint(x) # except'), 'x = "a # b"  \nprint(x) ');
  assert.equal(stripPythonComments("s = '''# try\n'''\n# raise"), "s = '''# try\n'''\n");
  assert.equal(stripPythonComments('s = "it\\"s # ok"'), 's = "it\\"s # ok"');
});

test('B9: dùng [::-1] bị từ chối, dùng reverse() vẫn đạt', () => {
  const e = byId.get('b7806a4c-e837-44a6-a83e-b2a6dae09dfe');
  assert.match(grade(e, 'a = list(map(int, input().split()))\nprint(a[::-1])\n'), /\[::-1\]/);
  assert.equal(grade(e, e.solutionCode), null);
});

test('C2 global/nonlocal/raise/try/continue được nhận diện trên AST', () => {
  const analyze = (code, requiredConstructs) => StaticCodeAnalyzer.analyze(code, 'PYTHON', '', '', { requiredConstructs });
  assert.equal(analyze('x = 0\ndef f():\n    global x\n    x += 1\nf()\n', ['global']).isValid, true);
  assert.equal(analyze('def f():\n    pass\nf()\nprint(1)\n', ['global']).isValid, false);
  assert.equal(analyze('def o():\n    n = 0\n    def i():\n        nonlocal n\n        n += 1\n    i()\no()\n', ['nonlocal']).isValid, true);
  assert.equal(analyze('try:\n    raise ValueError("x")\nexcept ValueError:\n    pass\n', ['try', 'raise', 'except:ValueError']).isValid, true);
  assert.equal(analyze('for i in range(3):\n    if i == 1:\n        continue\n    print(i)\n', ['continue']).isValid, true);
});

test('thông báo vi phạm là câu tiếng Việt, không phải mã kỹ thuật', () => {
  assert.match(describeConstraintError('CONSTRAINT_REQUIRED:while'), /vòng lặp `while`/);
  assert.match(describeConstraintError('CONSTRAINT_FORBIDDEN:slice:reverse'), /không cho phép/);
  assert.match(describeConstraintError('CONSTRAINT_REQUIRED:call:issubset|call:issuperset'), /issubset\(\)`.*hoặc/);
  assert.equal(describeConstraintError('Lỗi khác'), 'Lỗi khác');
});

test('C4: luật cứng theo ID vẫn chạy khi đổi tiêu đề bài', () => {
  const e = exercises.find(x => x.id === '9bfc2ca5-9217-4e36-93f8-a1deabc52d46');
  assert.ok(parseAndValidateConstraints('', legacyRuleKey(e.id, 'Tiêu đề mới bất kỳ'), 'print(1)\n', 'PYTHON'));
});

test('làm rõ đề + ví dụ tự sinh chỉ thêm vào bản cho học viên', () => {
  const b1 = byId.get('b39ac033-804f-45d5-b2c9-41cb59e3d6e2');
  const shown = learnerStatement(b1);
  assert.ok(shown.startsWith(b1.problemDescription));
  assert.match(shown, /Làm rõ đề:.*Số dư không đủ/);
  const noExample = { id: 'x', problemDescription: 'In các số từ 1 đến n.', testCases: [{ input: '3\n', expectedOutput: '1\n2\n3\n', isHidden: false }, { input: '9\n', expectedOutput: 'bí mật', isHidden: true }] };
  const generated = learnerStatement(noExample);
  assert.match(generated, /### Ví dụ\n\*\*Input\*\*\n```text\n3\n```\n\*\*Output\*\*\n```text\n1\n2\n3\n```/);
  assert.ok(!generated.includes('bí mật'));
  assert.equal(learnerStatement({ id: 'y', problemDescription: '### Ví dụ\nđã có', testCases: noExample.testCases }), '### Ví dụ\nđã có');
});
