/**
 * Kiểm thử tích hợp API "Luyện tập với AI" (giai đoạn 1 của docs/plans/KE_HOACH_KIEM_THU_LUYEN_TAP_AI_2026-11-16.md).
 * Backend thật (router /api/learning-path + Prisma + PostgreSQL tạm); AI service và grader EC2 là bản giả có kịch bản.
 * Mã ID trong tên test khớp ma trận kịch bản trong kế hoạch.
 *
 * Chạy: node --test tests/aiPracticeApi.integration.cjs   (cần PostgreSQL cục bộ: PG_BIN hoặc C:\Program Files\PostgreSQL\<ver>\bin)
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const path = require('node:path');
const H = require('./helpers/aiPracticeHarness.cjs');

const ctx = {};
const skip = H.findPgBin() ? false : 'Không tìm thấy PostgreSQL cục bộ (đặt PG_BIN)';

test.before(async () => {
  if (skip) return;
  ctx.db = await H.startDatabase();
  const graderToken = crypto.randomBytes(24).toString('hex');
  Object.assign(process.env, {
    DATABASE_URL: ctx.db.url, ADAPTIVE_INTERNAL_SECRET: crypto.randomBytes(32).toString('hex'),
    JWT_SECRET: crypto.randomBytes(32).toString('hex'), SANDBOX_PROVIDER: 'AWS_DOCKER', AWS_DOCKER_GRADER_TOKEN: graderToken,
    TS_NODE_PROJECT: path.join(__dirname, '..', 'tsconfig.json'),
  });
  ctx.grader = await H.startFakeGrader(graderToken);
  process.env.AWS_DOCKER_GRADER_URL = ctx.grader.url;
  require('ts-node/register/transpile-only');
  const { verifyInternal } = require('../src/modules/adaptive/adaptiveEvidence');
  ctx.ai = await H.startFakeAI(verifyInternal);
  process.env.AI_SERVICE_URL = ctx.ai.url;
  const express = require('express');
  ctx.jwt = require('jsonwebtoken');
  ctx.prisma = require('../src/infrastructure/database/prisma').prisma;
  await H.assertTemporaryDatabase(ctx.prisma, ctx.db.port);
  ctx.tutor = require('../src/modules/ai-tutor/tutorAvailability');
  ctx.retry = require('../src/modules/adaptive/adaptiveRetryWorker');
  const app = express();
  app.use(express.json({ limit: '2mb' }));
  app.use('/api/learning-path', require('../src/modules/learning-path/learningPathRoutes').default);
  await new Promise(resolve => { ctx.server = app.listen(0, '127.0.0.1', resolve); });
  ctx.base = `http://127.0.0.1:${ctx.server.address().port}`;
  const users = {};
  for (const [key, role] of [['a', 'STUDENT'], ['b', 'STUDENT'], ['admin', 'ADMIN']]) {
    const user = await ctx.prisma.user.create({ data: { username: 'ai-test-' + key + '-' + crypto.randomUUID().slice(0, 8),
      email: key + '-' + crypto.randomUUID().slice(0, 8) + '@example.invalid', password: 'login-disabled', role } });
    users[key] = { ...user, token: ctx.jwt.sign({ id: user.id, username: user.username, role }, process.env.JWT_SECRET, { expiresIn: '1h' }) };
  }
  ctx.users = users;
  await ctx.tutor.setTutorAvailability(true, users.admin.id);
});

// Mỗi test tự đặt kịch bản AI; một test hỏng giữa chừng không được để lại handler cho test sau.
test.beforeEach(() => { if (ctx.ai) ctx.ai.state.queue.length = 0; });

test.after(async () => {
  if (skip) return;
  await new Promise(r => ctx.server?.close(r));
  await ctx.ai?.close(); await ctx.grader?.close();
  await ctx.prisma?.$disconnect().catch(() => {});
  ctx.db?.stop();
});

// ---------- tiện ích ----------
const api = async (method, url, user, body) => {
  const response = await fetch(ctx.base + '/api/learning-path' + url, { method,
    headers: { 'Content-Type': 'application/json', ...(user ? { Authorization: 'Bearer ' + user.token } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body) });
  return { status: response.status, json: await response.json().catch(() => null) };
};
const start = (user, goal = 'Cho tôi một bài tập Python về vòng lặp while', opts) => H.sse(ctx.base, '/api/learning-path/chat/start-stream', user.token, { goal }, opts);
const reply = (user, sessionId, content, extra = {}, opts) => H.sse(ctx.base, '/api/learning-path/chat/reply-stream', user.token, { sessionId, content, ...extra }, opts);
const queue = (...handlers) => ctx.ai.state.queue.push(...handlers);
const run = async traceId => (await ctx.prisma.$queryRawUnsafe('SELECT * FROM adaptive_generation_runs WHERE trace_id=$1', traceId))[0];
async function exerciseSession(user) {
  queue(request => ({ report: H.reports.exercise(request) }));
  const response = await start(user);
  assert.equal(response.status, 200);
  const done = response.complete;
  assert.ok(done && done.exercise, 'phải có bài sau khi pipeline hoàn tất');
  return { sessionId: done.sessionId, traceId: done.pipeline.trace_id, exerciseId: done.exercise.exercise_id, events: response.events, done };
}
async function publishedExercise(user) {
  const s = await exerciseSession(user);
  const published = await api('POST', '/adaptive/start-exercise', user, { exercise_id: s.exerciseId });
  assert.equal(published.status, 200);
  const stored = await run(s.traceId);
  return { ...s, pathId: published.json.pathId, artifact: stored.artifact };
}
const submit = (user, exerciseId, code, submissionId = crypto.randomUUID()) =>
  api('POST', '/submit-exercise', user, { submissionId, exerciseId, code }).then(r => ({ ...r, submissionId }));

// ---------- A. Truy cập, phân quyền, khóa ----------
test('A01 thiếu token → 401; token sai/hết hạn → 403; không tạo dữ liệu', { skip }, async () => {
  const before = await ctx.prisma.pathChatSession.count();
  for (const [method, url] of [['GET', '/chat/sessions'], ['POST', '/chat/start-stream'], ['POST', '/submit-exercise'], ['GET', '/adaptive/runs/trace_abcdefgh']]) {
    assert.equal((await api(method, url, null, method === 'POST' ? { goal: 'x' } : undefined)).status, 401, url);
  }
  const forged = { token: ctx.jwt.sign({ id: ctx.users.a.id, role: 'STUDENT' }, 'wrong-secret') };
  const expired = { token: ctx.jwt.sign({ id: ctx.users.a.id, role: 'STUDENT', exp: Math.floor(Date.now() / 1000) - 60 }, process.env.JWT_SECRET) };
  assert.equal((await api('GET', '/chat/sessions', forged)).status, 403);
  assert.equal((await api('GET', '/chat/sessions', expired)).status, 403);
  assert.equal(await ctx.prisma.pathChatSession.count(), before);
});

test('A02 học viên B không đọc, xóa hay trả lời được phiên chat của A', { skip }, async () => {
  queue(request => ({ report: H.reports.chat(request, 'Chào A') }));
  const a = await start(ctx.users.a, 'Xin chào');
  const sessionId = a.complete.sessionId;
  assert.equal((await api('GET', '/chat/session/' + sessionId, ctx.users.b)).status, 404);
  assert.equal((await api('DELETE', '/chat/session/' + sessionId, ctx.users.b)).status, 404);
  const asB = await reply(ctx.users.b, sessionId, 'chen ngang');
  assert.equal(asB.status, 404);
  const own = await api('GET', '/chat/session/' + sessionId, ctx.users.a);
  assert.equal(own.status, 200);
  assert.equal(own.json.session.messages.length, 2, 'phiên của A còn nguyên');
  assert.ok(!(await api('GET', '/chat/sessions', ctx.users.b)).json?.data?.some?.(s => s.id === sessionId));
});

test('A03 báo cáo trace: B không xem được của A; học viên không xem được bản đầy đủ', { skip }, async () => {
  const s = await exerciseSession(ctx.users.a);
  assert.equal((await api('GET', '/adaptive/runs/' + s.traceId, ctx.users.b)).status, 404);
  assert.equal((await api('GET', '/adaptive/runs/' + s.traceId + '?full=true', ctx.users.a)).status, 403);
  assert.equal((await api('GET', '/adaptive/runs/' + s.traceId, ctx.users.a)).status, 200);
});

test('A04 B không nộp bài vào bài tập của A', { skip }, async () => {
  const p = await publishedExercise(ctx.users.a);
  const before = ctx.grader.state.calls;
  const r = await submit(ctx.users.b, p.exerciseId, p.artifact.reference_solution);
  assert.equal(r.status, 409);
  assert.equal(ctx.grader.state.calls, before, 'không gọi grader');
});

test('A05/A06 Admin khóa AI Tutor → 423 ở mọi lối vào; mở lại dùng được ngay', { skip }, async () => {
  queue(request => ({ report: H.reports.chat(request, 'ok') }));
  const open = await start(ctx.users.a, 'Xin chào');
  await ctx.tutor.setTutorAvailability(false, ctx.users.admin.id);
  try {
    const requestsBefore = ctx.ai.state.requests.length;
    assert.equal((await start(ctx.users.a, 'Xin chào')).status, 423);
    assert.equal((await reply(ctx.users.a, open.complete.sessionId, 'tiếp')).status, 423);
    assert.equal((await api('POST', '/chat/continue-agent-stream', ctx.users.a, { traceId: open.complete.pipeline.trace_id })).status, 423);
    const availability = await api('GET', '/ai-tutor/availability', ctx.users.a);
    assert.equal(availability.status, 200);
    assert.equal(JSON.stringify(availability.json).includes('false'), true);
    assert.equal(ctx.ai.state.requests.length, requestsBefore, 'không request nào tới AI khi đang khóa');
  } finally { await ctx.tutor.setTutorAvailability(true, ctx.users.admin.id); }
  queue(request => ({ report: H.reports.chat(request, 'mở lại') }));
  assert.equal((await start(ctx.users.a, 'Xin chào')).status, 200);
});

test('A07 khóa giữa lúc một run đang chạy: run đó vẫn hoàn tất', { skip }, async () => {
  queue(request => ({ report: H.reports.exercise(request), delayMs: 1200 }));
  const pending = start(ctx.users.a);
  await H.waitFor(() => ctx.ai.state.queue.length === 0, 5000, 20);
  await ctx.tutor.setTutorAvailability(false, ctx.users.admin.id);
  try {
    const response = await pending;
    assert.equal(response.complete?.pipeline?.status, 'SUCCEEDED');
  } finally { await ctx.tutor.setTutorAvailability(true, ctx.users.admin.id); }
});

// ---------- B. Hội thoại ----------
test('B14 tin nhắn rỗng hoặc 6.001 ký tự → 400; đúng 6.000 ký tự được xử lý', { skip }, async () => {
  assert.equal((await start(ctx.users.a, '   ')).status, 400);
  assert.equal((await start(ctx.users.a, 'a'.repeat(6001))).status, 400);
  queue(request => ({ report: H.reports.chat(request, 'Đã nhận') }));
  assert.equal((await start(ctx.users.a, 'a'.repeat(6000))).status, 200);
});

test('B16 gửi tin thứ hai khi lượt trước của cùng phiên chưa xong → 409; lượt đầu vẫn hoàn tất', { skip }, async () => {
  queue(request => ({ report: H.reports.chat(request, 'Lượt 1') }));
  const first = await start(ctx.users.a, 'Xin chào');
  const sessionId = first.complete.sessionId;
  queue(request => ({ report: H.reports.chat(request, 'Lượt 2'), delayMs: 1000 }));
  const slow = reply(ctx.users.a, sessionId, 'câu hỏi chậm');
  await H.waitFor(() => ctx.ai.state.queue.length === 0, 5000, 20);
  const second = await reply(ctx.users.a, sessionId, 'gửi chen');
  assert.equal(second.status, 409);
  assert.equal((await slow).complete?.aiMessage?.content, 'Lượt 2');
  queue(request => ({ report: H.reports.chat(request, 'Lượt 3') }));
  assert.equal((await reply(ctx.users.a, sessionId, 'sau khi xong')).complete?.aiMessage?.content, 'Lượt 3', 'khóa phiên đã được nhả');
});

test('B04/B05 câu hỏi chọn ngôn ngữ được giữ: trả lời "C++" làm request tiếp theo mang language=cpp', { skip }, async () => {
  queue(request => ({ report: H.reports.chat(request, 'Bạn muốn dùng ngôn ngữ nào?', { intent: 'REQUEST_ADAPTIVE_EXERCISE',
    pending_confirmation: { type: 'ROUTING_CLARIFICATION', original_user_request: 'cho tôi bài tập về mảng' }, suggested_options: ['Python', 'JavaScript', 'C++', 'SQL'] }) }));
  const first = await start(ctx.users.a, 'cho tôi bài tập về mảng');
  assert.deepEqual(first.complete.aiMessage.metadata.suggestedOptions, ['Python', 'JavaScript', 'C++', 'SQL']);
  queue(request => ({ report: H.reports.chat(request, 'Đã chọn C++') }));
  await reply(ctx.users.a, first.complete.sessionId, 'C++');
  const sent = ctx.ai.state.requests.at(-1);
  assert.equal(sent.language, 'cpp');
  assert.equal(sent.learner_context.pending_confirmation.type, 'ROUTING_CLARIFICATION');
  assert.equal(sent.messages.at(-1).content, 'C++');
});

// ---------- C. Sinh và phát hành bài ----------
test('C01 một bài: stream có từng bước, bài trả về không lộ lời giải/test ẩn, phát hành ra lộ trình', { skip }, async () => {
  const s = await exerciseSession(ctx.users.a);
  assert.equal(s.events[0].type, 'session_created');
  assert.ok(s.events.filter(e => e.type === 'agent_step').length >= 4);
  const exercise = s.done.exercise;
  assert.equal(exercise.reference_solution, undefined);
  assert.ok(exercise.test_cases.every(t => t.is_hidden === false));
  const stored = await run(s.traceId);
  const hidden = stored.artifact.test_cases.filter(t => t.is_hidden);
  assert.ok(hidden.length > 0);
  const wire = JSON.stringify(s.events);
  // So nguyên văn lời giải (dòng lẻ như "i = 0" cũng có trong starter code nên không dùng được).
  assert.ok(!wire.includes(JSON.stringify(stored.artifact.reference_solution).slice(1, -1)), 'không có lời giải mẫu trên luồng SSE');
  assert.ok(!wire.includes('reference_solution'));
  const published = await api('POST', '/adaptive/start-exercise', ctx.users.a, { exercise_id: s.exerciseId });
  assert.equal(published.status, 200);
  const pathView = await api('GET', '/' + published.json.pathId, ctx.users.a);
  assert.equal(pathView.status, 200);
  const lessonExercise = pathView.json.data.lessons[0].exercise;
  assert.equal(lessonExercise.solutionCode, undefined);
  assert.ok(lessonExercise.testCases.every(t => !t.isHidden));
  assert.equal((await api('GET', '/' + published.json.pathId, ctx.users.b)).status, 404);
});

test('C11 báo cáo trace của học viên không chứa lời giải mẫu hay output test ẩn', { skip }, async () => {
  const s = await exerciseSession(ctx.users.a);
  const report = await api('GET', '/adaptive/runs/' + s.traceId, ctx.users.a);
  const stored = await run(s.traceId);
  const text = JSON.stringify(report.json);
  assert.ok(!text.includes('reference_solution'));
  for (const t of stored.artifact.test_cases.filter(t => t.is_hidden)) assert.ok(!text.includes(JSON.stringify(t.input).slice(1, -1)) || t.input.length < 4, 'input ẩn bị lộ');
});

test('C08 bấm "Bắt đầu làm bài" hai lần đồng thời → một lộ trình duy nhất', { skip }, async () => {
  const s = await exerciseSession(ctx.users.a);
  const before = await ctx.prisma.personalizedPath.count({ where: { userId: ctx.users.a.id } });
  const [x, y] = await Promise.all([1, 2].map(() => api('POST', '/adaptive/start-exercise', ctx.users.a, { exercise_id: s.exerciseId })));
  assert.equal(x.status, 200); assert.equal(y.status, 200);
  assert.equal(x.json.pathId, y.json.pathId);
  assert.equal(await ctx.prisma.personalizedPath.count({ where: { userId: ctx.users.a.id } }), before + 1);
});

test('C09/C10 không phát hành được bài chưa kiểm định; xác nhận phiên chưa có bài → 409', { skip }, async () => {
  assert.equal((await api('POST', '/adaptive/start-exercise', ctx.users.a, { exercise_id: crypto.randomUUID() })).status, 409);
  queue(request => ({ report: H.reports.chat(request, 'chỉ trò chuyện') }));
  const chat = await start(ctx.users.a, 'Xin chào');
  assert.equal((await api('POST', '/chat/confirm', ctx.users.a, { sessionId: chat.complete.sessionId })).status, 409);
  assert.equal((await api('POST', '/adaptive/start-exercise', ctx.users.a, { exercise_id: 'khong-phai-uuid' })).status, 400);
});

test('C-GATE bài thiếu PublicationGate hoặc sai trace_id không bao giờ được lưu thành bài', { skip }, async () => {
  queue(request => ({ report: H.reports.exercise(request, { withoutGate: true }) }));
  const noGate = await start(ctx.users.a);
  assert.equal(noGate.complete.pipeline.status, 'FAILED');
  assert.equal(noGate.complete.exercise, null);
  const stored = await run(noGate.complete.pipeline.trace_id);
  assert.equal(stored.artifact, null);
  assert.equal(stored.exercise_id, null);
  queue(request => ({ report: { ...H.reports.exercise(request), trace_id: 'trace_' + 'x'.repeat(32) } }));
  const mismatch = await start(ctx.users.a);
  assert.equal(mismatch.complete.pipeline.status, 'FAILED');
  assert.equal((await run(mismatch.complete.pipeline.trace_id)).artifact, null);
});

test('C03 chuỗi 3 bài: chỉ phát hành khi đủ 3 bài đã kiểm định, cùng khái niệm và ngôn ngữ', { skip }, async () => {
  queue(request => ({ report: H.reports.exercise(request, { count: 3 }) }));
  const parent = await start(ctx.users.a, 'Cho tôi 3 bài Python về while');
  const parentTrace = parent.complete.pipeline.trace_id, sessionId = parent.complete.sessionId;
  assert.match(parent.complete.aiMessage.content, /Đang tạo 3 bài/);
  const parentRun = await run(parentTrace);
  const early = await api('POST', '/adaptive/start-exercise', ctx.users.a, { exercise_id: parentRun.exercise_id });
  assert.equal(early.status, 409, 'chưa đủ bài thì không phát hành');
  for (const index of [2, 3]) {
    queue(request => ({ report: H.reports.exercise(request, { count: 3, artifact: { title: 'Bài ' + index } }) }));
    const next = await reply(ctx.users.a, sessionId, 'Tiếp tục', { batchParentTraceId: parentTrace, batchIndex: index,
      target_concept_id: parentRun.artifact.concept_id, language: parentRun.artifact.language });
    assert.equal(next.complete.pipeline.status, 'SUCCEEDED', 'bài ' + index);
  }
  const published = await api('POST', '/adaptive/start-exercise', ctx.users.a, { exercise_id: parentRun.exercise_id });
  assert.equal(published.status, 200);
  assert.equal(published.json.exerciseCount, 3);
  const pathView = await api('GET', '/' + published.json.pathId, ctx.users.a);
  assert.equal(pathView.json.data.lessons[0].practiceExercises.length, 3);
  assert.ok(pathView.json.data.lessons[0].practiceExercises.every(e => e.testCases.every(t => !t.isHidden) && e.solutionCode === undefined));
  const session = await api('GET', '/chat/session/' + sessionId, ctx.users.a);
  assert.equal(session.json.session.messages.filter(m => m.sender === 'USER').length, 1, 'lượt nối tiếp không tạo tin nhắn người dùng mới');
  assert.equal(session.json.session.messages.at(-1).metadata.practiceBatch.status, 'READY');
});

test('C03b lượt nối tiếp sai khái niệm hoặc sai chỉ số bị từ chối', { skip }, async () => {
  queue(request => ({ report: H.reports.exercise(request, { count: 2 }) }));
  const parent = await start(ctx.users.a);
  const parentRun = await run(parent.complete.pipeline.trace_id);
  const base = { batchParentTraceId: parentRun.trace_id, target_concept_id: parentRun.artifact.concept_id, language: 'python' };
  assert.equal((await reply(ctx.users.a, parent.complete.sessionId, 'x', { ...base, batchIndex: 3 })).status, 400);
  assert.equal((await reply(ctx.users.a, parent.complete.sessionId, 'x', { ...base, batchIndex: 2, target_concept_id: 'PY-OOP-01' })).status, 400);
  assert.equal((await reply(ctx.users.b, parent.complete.sessionId, 'x', { ...base, batchIndex: 2 })).status, 404);
});

test('C04 chuỗi 3 bài hỏng ở bài 2: batch-failed báo 1/3, không phát hành', { skip }, async () => {
  queue(request => ({ report: H.reports.exercise(request, { count: 3 }) }));
  const parent = await start(ctx.users.a);
  const traceId = parent.complete.pipeline.trace_id;
  queue(request => ({ report: H.reports.providerError(request, 'REPAIR_LIMIT_REACHED') }));
  const parentRun = await run(traceId);
  await reply(ctx.users.a, parent.complete.sessionId, 'Tiếp tục', { batchParentTraceId: traceId, batchIndex: 2,
    target_concept_id: parentRun.artifact.concept_id, language: 'python' });
  const failed = await api('POST', '/adaptive/batch-failed', ctx.users.a, { parentTraceId: traceId });
  assert.equal(failed.status, 200);
  assert.deepEqual([failed.json.completedCount, failed.json.expectedCount], [1, 3]);
  assert.equal((await api('POST', '/adaptive/start-exercise', ctx.users.a, { exercise_id: parentRun.exercise_id })).status, 409);
  const session = await api('GET', '/chat/session/' + parent.complete.sessionId, ctx.users.a);
  assert.equal(session.json.session.messages.at(-1).metadata.practiceBatch.status, 'FAILED');
});

// ---------- E. Nộp và chấm ----------
test('E01 nộp lời giải đúng → đạt 100 điểm, lộ trình hoàn thành', { skip }, async () => {
  const p = await publishedExercise(ctx.users.a);
  const r = await submit(ctx.users.a, p.exerciseId, p.artifact.reference_solution);
  assert.equal(r.status, 200, JSON.stringify(r.json));
  assert.equal(r.json.isPassed, true);
  assert.equal(r.json.score, 100);
  const lesson = await ctx.prisma.personalizedLesson.findFirst({ where: { pathId: p.pathId } });
  assert.equal(lesson.isCompleted, true);
});

test('E02 nộp sai: test công khai hiện output thật, test ẩn chỉ hiện Hidden/Mismatch', { skip }, async () => {
  const p = await publishedExercise(ctx.users.a);
  // Bài yêu cầu dùng while (spec required_constructs) nên lời giải sai vẫn phải có while để chạm tới phần so output.
  const r = await submit(ctx.users.a, p.exerciseId, 's = input()\ni = 0\nwhile i < 0:\n    i += 1\nprint(0)\n');
  assert.equal(r.status, 200);
  assert.equal(r.json.isPassed, false);
  const hidden = r.json.results.filter(t => t.is_hidden);
  assert.ok(hidden.length > 0);
  for (const t of hidden) {
    assert.equal(t.input, 'Hidden'); assert.equal(t.expectedOutput, 'Hidden');
    assert.ok(['Passed', 'Mismatch'].includes(t.actualOutput));
    assert.equal(t.stderr, undefined); assert.equal(t.errorMessage, undefined);
  }
  assert.ok(r.json.results.some(t => !t.is_hidden && t.actualOutput === '0'), JSON.stringify(r.json.results.filter(t => !t.is_hidden).slice(0, 2)));
  assert.ok(r.json.guidance, 'có gợi ý dựa trên bằng chứng ngay khi chấm');
});

test('E02b Python thiếu cấu trúc bắt buộc/dùng cấu trúc cấm: báo vi phạm dễ hiểu, không lộ traceback harness', { skip }, async () => {
  const p = await publishedExercise(ctx.users.a);
  const calls = ctx.grader.state.calls;
  // Không có while (bắt buộc) và có for (bị cấm): mã học viên không được chạy, báo cả hai vi phạm.
  const r = await submit(ctx.users.a, p.exerciseId, 's = input()\nfor ch in s:\n    pass\nprint(0)\n');
  assert.equal(r.status, 200);
  assert.equal(r.json.isPassed, false);
  assert.equal(r.json.status, 'CONSTRAINT_VIOLATION');
  assert.deepEqual(r.json.results, [], 'không trả testcase nào, giống bài JavaScript');
  assert.equal(ctx.grader.state.calls - calls, 1, 'dừng ngay sau lần chạy đầu, không chạy hết các test');
  const body = JSON.stringify(r.json);
  for (const leak of ['Traceback', '__LEARNER_CONSTRAINT__', 'ValueError', '<submission>']) assert.ok(!body.includes(leak), leak + ' lọt ra học viên: ' + body.slice(Math.max(0, body.indexOf(leak) - 150), body.indexOf(leak) + 80));
  assert.equal(r.json.guidance.analysisKind, 'constraint');
  assert.match(r.json.guidance.title, /while/);
  const stored = (await ctx.prisma.$queryRawUnsafe('SELECT status, result FROM adaptive_submissions WHERE submission_id=$1::uuid', r.submissionId))[0];
  assert.equal(stored.status, 'FAILED');
  assert.deepEqual(stored.result.errors, ['CONSTRAINT_REQUIRED:while', 'CONSTRAINT_FORBIDDEN:for']);
});

test('E03 lỗi cú pháp và lỗi runtime được chấm trượt, không làm hỏng server', { skip }, async () => {
  const p = await publishedExercise(ctx.users.a);
  for (const code of ['s = input(\nprint(s)\n', 's = input()\nprint(1/0)\n']) {
    const r = await submit(ctx.users.a, p.exerciseId, code);
    assert.equal(r.status, 200, code);
    assert.equal(r.json.isPassed, false);
    assert.equal(r.json.success, true, 'lỗi của học viên không phải lỗi hệ thống');
  }
});

test('E07 gửi lại cùng submissionId → trả kết quả cũ, không chấm lại', { skip }, async () => {
  const p = await publishedExercise(ctx.users.a);
  const first = await submit(ctx.users.a, p.exerciseId, p.artifact.reference_solution);
  const calls = ctx.grader.state.calls;
  const again = await submit(ctx.users.a, p.exerciseId, p.artifact.reference_solution, first.submissionId);
  assert.equal(again.status, 200);
  assert.equal(again.json.isPassed, true);
  assert.equal(ctx.grader.state.calls, calls);
  // Cùng ID nhưng code khác: không được chấm lại hay ghi đè kết quả cũ.
  const other = await submit(ctx.users.a, p.exerciseId, 'print(1)\n', first.submissionId);
  assert.equal(ctx.grader.state.calls, calls, 'không chấm code khác dưới ID cũ');
  assert.ok(other.status === 409 || other.json?.isPassed === true, JSON.stringify({ status: other.status, json: other.json }));
  const stored = await ctx.prisma.$queryRawUnsafe('SELECT status FROM adaptive_submissions WHERE submission_id=$1::uuid', first.submissionId);
  assert.equal(stored[0].status, 'PASSED');
});

test('E09 code rỗng hoặc dài hơn 20.000 ký tự → 400, không gọi grader', { skip }, async () => {
  const p = await publishedExercise(ctx.users.a);
  const calls = ctx.grader.state.calls;
  assert.equal((await submit(ctx.users.a, p.exerciseId, '')).status, 400);
  assert.equal((await submit(ctx.users.a, p.exerciseId, '#'.repeat(20001))).status, 400);
  assert.equal(ctx.grader.state.calls, calls);
});

test('E10 grader EC2 sập → 503 GRADER_UNAVAILABLE, không tính là trượt; grader lên lại thì chấm bình thường', { skip }, async () => {
  const p = await publishedExercise(ctx.users.a);
  ctx.grader.state.mode = 'down';
  let r;
  try { r = await submit(ctx.users.a, p.exerciseId, p.artifact.reference_solution); }
  finally { ctx.grader.state.mode = 'ok'; }
  assert.equal(r.status, 503);
  assert.equal(r.json.error, 'GRADER_UNAVAILABLE');
  assert.equal(r.json.isPassed, false);
  const events = await ctx.prisma.$queryRawUnsafe('SELECT COUNT(*)::int AS n FROM adaptive_mastery_events WHERE submission_id=$1::uuid', r.submissionId);
  assert.equal(events[0].n, 0, 'lượt lỗi hạ tầng không cập nhật năng lực');
  const ok = await submit(ctx.users.a, p.exerciseId, p.artifact.reference_solution);
  assert.equal(ok.json.isPassed, true);
});

// ---------- F. Gợi ý sau nộp ----------
test('F04 phân tích lượt nộp của người khác → 404; ID sai định dạng → 400', { skip }, async () => {
  const p = await publishedExercise(ctx.users.a);
  const r = await submit(ctx.users.a, p.exerciseId, 'print(0)\n');
  assert.equal((await api('POST', '/practice-guidance', ctx.users.b, { submissionId: r.submissionId })).status, 404);
  assert.equal((await api('POST', '/practice-guidance', ctx.users.a, { submissionId: 'abc' })).status, 400);
});

// ---------- G. Lỗi hạ tầng và phục hồi ----------
test('G01 provider timeout → WAITING_PROVIDER, xếp lịch thử lại, báo rõ cho học viên', { skip }, async () => {
  queue(request => ({ report: H.reports.providerError(request, 'PROVIDER_TIMEOUT') }));
  const r = await start(ctx.users.a);
  assert.equal(r.complete.pipeline.status, 'WAITING_PROVIDER');
  assert.match(r.complete.aiMessage.content, /tự thử lại/);
  const stored = await run(r.complete.pipeline.trace_id);
  assert.equal(stored.status, 'WAITING_PROVIDER');
  assert.equal(stored.retry_count, 1);
  assert.ok(new Date(stored.next_attempt_at) > new Date());
});

test('G01b worker thử lại thành công thì cập nhật đúng tin nhắn cũ; hết lượt thì dừng', { skip }, async () => {
  queue(request => ({ report: H.reports.providerError(request, 'PROVIDER_RATE_LIMITED') }));
  const r = await start(ctx.users.a);
  const traceId = r.complete.pipeline.trace_id;
  await ctx.prisma.$executeRawUnsafe("UPDATE adaptive_generation_runs SET next_attempt_at=now()-interval '1 second' WHERE trace_id=$1", traceId);
  queue(request => ({ report: H.reports.exercise(request) }));
  await ctx.retry.retryAdaptiveRuns();
  const stored = await run(traceId);
  assert.equal(stored.status, 'SUCCEEDED');
  const session = await api('GET', '/chat/session/' + r.complete.sessionId, ctx.users.a);
  const tutor = session.json.session.messages.filter(m => m.sender === 'AI_TUTOR');
  assert.equal(tutor.length, 1, 'không tạo tin nhắn trùng');
  assert.equal(tutor[0].metadata.pipeline.status, 'SUCCEEDED');
  // G11: run đã thử đủ 3 lần không được lấy lại nữa
  queue(request => ({ report: H.reports.providerError(request, 'PROVIDER_TIMEOUT') }));
  const exhausted = await start(ctx.users.a);
  const exhaustedTrace = exhausted.complete.pipeline.trace_id;
  await ctx.prisma.$executeRawUnsafe("UPDATE adaptive_generation_runs SET retry_count=3,next_attempt_at=now()-interval '1 second' WHERE trace_id=$1", exhaustedTrace);
  const requests = ctx.ai.state.requests.length;
  await ctx.retry.retryAdaptiveRuns();
  assert.equal(ctx.ai.state.requests.length, requests, 'không gọi AI cho run đã hết lượt');
  assert.equal((await run(exhaustedTrace)).status, 'WAITING_PROVIDER');
});

test('G03 AI service sập (503) → FAILED rõ ràng, nhả khóa phiên', { skip }, async () => {
  queue(() => ({ httpStatus: 503 }));
  const r = await start(ctx.users.a);
  assert.equal(r.status, 200);
  assert.equal(r.complete.pipeline.status, 'FAILED');
  assert.match(r.complete.aiMessage.content, /dừng trước khi hoàn thành/);
  queue(request => ({ report: H.reports.chat(request, 'đã hồi phục') }));
  const next = await reply(ctx.users.a, r.complete.sessionId, 'thử lại');
  assert.equal(next.complete?.aiMessage?.content, 'đã hồi phục', 'phiên không bị kẹt khóa');
});

test('G04 AI service đầy luồng (429) → báo bận, giữ yêu cầu, worker tự chạy lại và ra bài', { skip }, async () => {
  queue(() => ({ httpStatus: 429 }));
  const r = await start(ctx.users.a);
  assert.equal(r.status, 200);
  assert.equal(r.complete.pipeline.status, 'WAITING_PROVIDER');
  assert.equal(r.complete.pipeline.error.code, 'AI_SERVICE_BUSY');
  assert.match(r.complete.aiMessage.content, /đang xử lý nhiều yêu cầu cùng lúc/);
  assert.doesNotMatch(r.complete.aiMessage.content, /dừng trước khi hoàn thành/);
  const traceId = r.complete.pipeline.trace_id;
  const waiting = await run(traceId);
  assert.equal(waiting.status, 'WAITING_PROVIDER');
  assert.equal(waiting.retry_count, 1);
  const delay = (new Date(waiting.next_attempt_at) - Date.now()) / 1000;
  assert.ok(delay > 20 && delay <= 31, 'thử lại sau khoảng 30 giây, thực tế ' + delay);
  // Lượt thử lại đầu vẫn gặp 429 → tiếp tục chờ, chưa thất bại.
  await ctx.prisma.$executeRawUnsafe("UPDATE adaptive_generation_runs SET next_attempt_at=now()-interval '1 second' WHERE trace_id=$1", traceId);
  queue(() => ({ httpStatus: 429 }));
  await ctx.retry.retryAdaptiveRuns();
  const still = await run(traceId);
  assert.equal(still.status, 'WAITING_PROVIDER');
  assert.equal(still.retry_count, 2);
  // AI rảnh trở lại → run hoàn tất, tin nhắn cũ được cập nhật thành bài.
  await ctx.prisma.$executeRawUnsafe("UPDATE adaptive_generation_runs SET next_attempt_at=now()-interval '1 second' WHERE trace_id=$1", traceId);
  queue(request => ({ report: H.reports.exercise(request) }));
  await ctx.retry.retryAdaptiveRuns();
  assert.equal((await run(traceId)).status, 'SUCCEEDED');
  const session = await api('GET', '/chat/session/' + r.complete.sessionId, ctx.users.a);
  const tutor = session.json.session.messages.filter(m => m.sender === 'AI_TUTOR');
  assert.equal(tutor.length, 1);
  assert.equal(tutor[0].metadata.step, 'EXERCISE_READY');
  queue(request => ({ report: H.reports.chat(request, 'phiên vẫn dùng được') }));
  assert.equal((await reply(ctx.users.a, r.complete.sessionId, 'tiếp')).complete?.aiMessage?.content, 'phiên vẫn dùng được');
});

test('G04b AI bận mãi qua 3 lần thử → kết thúc FAILED, không thử vô hạn', { skip }, async () => {
  queue(() => ({ httpStatus: 429 }));
  const r = await start(ctx.users.a);
  const traceId = r.complete.pipeline.trace_id;
  for (let attempt = 0; attempt < 3; attempt++) {
    await ctx.prisma.$executeRawUnsafe("UPDATE adaptive_generation_runs SET next_attempt_at=now()-interval '1 second' WHERE trace_id=$1", traceId);
    queue(() => ({ httpStatus: 429 }));
    await ctx.retry.retryAdaptiveRuns();
  }
  const final = await run(traceId);
  assert.equal(final.status, 'FAILED');
  assert.equal(final.report.error.code, 'AI_SERVICE_BUSY');
  const requests = ctx.ai.state.requests.length;
  await ctx.prisma.$executeRawUnsafe("UPDATE adaptive_generation_runs SET next_attempt_at=now()-interval '1 second' WHERE trace_id=$1", traceId);
  await ctx.retry.retryAdaptiveRuns();
  assert.equal(ctx.ai.state.requests.length, requests, 'không gọi lại sau khi đã kết thúc');
});

test('G-STREAM AI báo lỗi giữa chừng hoặc đóng luồng không có complete → FAILED, giữ các bước đã chạy', { skip }, async () => {
  queue(request => ({ report: H.reports.exercise(request), streamError: 'PIPELINE_WORKER_FAILED' }));
  const a = await start(ctx.users.a);
  assert.equal(a.complete.pipeline.status, 'FAILED');
  assert.ok((await run(a.complete.pipeline.trace_id)).report.agent_traces.length >= 4, 'các bước đã lưu');
  queue(request => ({ report: H.reports.exercise(request), endWithoutComplete: true }));
  const b = await start(ctx.users.a);
  assert.equal(b.complete.pipeline.status, 'FAILED');
  assert.equal(b.complete.pipeline.error.code, 'TRANSPORT_OR_STORAGE_ERROR');
});

test('G05 học viên đóng tab giữa lúc sinh bài: run vẫn hoàn tất và lưu, mở lại thấy kết quả', { skip }, async () => {
  queue(request => ({ report: H.reports.exercise(request), delayMs: 1500 }));
  const r = await start(ctx.users.a, 'Cho tôi một bài tập Python về while', { abortAfter: e => e.type === 'agent_step' });
  assert.equal(r.aborted, true, JSON.stringify({ status: r.status, json: r.json, events: r.events?.map(e => e.type) }));
  const created = r.events.find(e => e.type === 'session_created');
  const stored = await H.waitFor(async () => { const row = await run(created.trace_id); return row.status === 'SUCCEEDED' ? row : null; }, 15000);
  assert.ok(stored.artifact);
  const session = await H.waitFor(async () => {
    const s = await api('GET', '/chat/session/' + created.sessionId, ctx.users.a);
    return s.json.session.messages.some(m => m.sender === 'AI_TUTOR') ? s : null;
  }, 10000);
  assert.equal(session.json.session.messages.at(-1).metadata.step, 'EXERCISE_READY');
  queue(request => ({ report: H.reports.chat(request, 'tiếp tục được') }));
  assert.equal((await reply(ctx.users.a, created.sessionId, 'tiếp')).complete?.aiMessage?.content, 'tiếp tục được');
});

test('K04 backend luôn ký request nội bộ; AI giả không nhận request sai chữ ký nào trong cả bộ test', { skip }, async () => {
  assert.equal(ctx.ai.state.badSignatures, 0);
  assert.ok(ctx.ai.state.requests.length > 20);
});
