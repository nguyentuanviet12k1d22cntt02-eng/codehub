/**
 * Stack E2E "Luyện tập với AI" (giai đoạn 2, docs/plans/KE_HOACH_KIEM_THU_LUYEN_TAP_AI_2026-11-16.md).
 *
 * Backend thật (src/app.ts đầy đủ) + frontend thật (Vite) + PostgreSQL tạm; AI service và grader là bản giả có kịch bản.
 * Không nạp backend/.env: tiến trình chạy trong thư mục tạm và tự đặt mọi biến môi trường; harness từ chối nếu Prisma
 * không trỏ đúng DB tạm.
 *
 *   node tests/e2e/aiPracticeE2EStack.cjs <thư mục ghi stack.json>
 *
 * Kịch bản AI theo nội dung tin nhắn cuối của học viên:
 *   chứa "3 bài"      → bài 1/3 của chuỗi; các lượt nối tiếp (batch_index) → bài 2, 3
 *   chứa "bài"         → 1 bài đã qua PublicationGate (stream các bước, ~4 s)
 *   chứa "CHẬM"        → như trên nhưng ~25 s (dùng cho G05 tải lại/đóng tab)
 *   chứa "BẬN"         → HTTP 429 (AI đầy luồng)
 *   chứa "HỎNG"        → run FAILED không thử lại
 *   còn lại            → trả lời hội thoại, lặp lại nguyên văn tin nhắn (để kiểm hiển thị K03)
 * Cổng điều khiển: GET /state, POST /tutor?on=0|1, POST /grader?mode=ok|down, POST /shutdown (dừng sạch cả DB tạm)
 */
const fs = require('node:fs'), os = require('node:os'), path = require('node:path'), crypto = require('node:crypto'), http = require('node:http');
const { spawn } = require('node:child_process');
const BACKEND = path.resolve(__dirname, '../..'), FRONTEND = path.resolve(BACKEND, '../frontend');
const H = require(path.join(BACKEND, 'tests/helpers/aiPracticeHarness.cjs'));
const outDir = path.resolve(process.argv[2] || os.tmpdir());
const free = () => new Promise(r => { const s = require('node:net').createServer(); s.listen(0, '127.0.0.1', () => { const p = s.address().port; s.close(() => r(p)); }); });

(async () => {
  const work = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-e2e-cwd-'));
  process.chdir(work); // không có .env ở đây → dotenv của app.ts không nạp cấu hình thật
  const db = await H.startDatabase();
  const graderToken = crypto.randomBytes(24).toString('hex');
  const backendPort = await free(), frontendPort = await free(), controlPort = await free();
  Object.assign(process.env, {
    DATABASE_URL: db.url, ADAPTIVE_INTERNAL_SECRET: crypto.randomBytes(32).toString('hex'), JWT_SECRET: crypto.randomBytes(32).toString('hex'),
    SANDBOX_PROVIDER: 'AWS_DOCKER', AWS_DOCKER_GRADER_TOKEN: graderToken, PORT: String(backendPort), NODE_ENV: 'test',
    TS_NODE_PROJECT: path.join(BACKEND, 'tsconfig.json'),
  });
  const grader = await H.startFakeGrader(graderToken);
  process.env.AWS_DOCKER_GRADER_URL = grader.url;
  require(path.join(BACKEND, 'node_modules/ts-node')).register({ transpileOnly: true, project: path.join(BACKEND, 'tsconfig.json') });
  const { verifyInternal } = require(path.join(BACKEND, 'src/modules/adaptive/adaptiveEvidence'));
  const ai = await H.startFakeAI(verifyInternal);
  process.env.AI_SERVICE_URL = ai.url;
  const { prisma } = require(path.join(BACKEND, 'src/infrastructure/database/prisma'));
  await H.assertTemporaryDatabase(prisma, db.port);
  const tutor = require(path.join(BACKEND, 'src/modules/ai-tutor/tutorAvailability'));

  const lastUser = req => [...(req.messages || [])].reverse().find(m => m.sender === 'USER')?.content || '';
  ai.state.fallback = async req => {
    const text = lastUser(req);
    if (/BẬN/.test(text)) return { httpStatus: 429 };
    if (/HỎNG/.test(text)) return { report: { ...H.reports.providerError(req, 'SCHEMA_VALIDATION_FAILED'), reply: 'Không tạo được bài lần này.' } };
    if (req.batch_parent_trace_id) return { report: H.reports.exercise(req), delayMs: 3000 };
    if (/3 bài/.test(text)) return { report: H.reports.exercise(req, { count: 3 }), delayMs: 3000 };
    if (/CHẬM/.test(text)) return { report: H.reports.exercise(req), delayMs: 25000 };
    if (/bài/i.test(text)) return { report: H.reports.exercise(req), delayMs: 4000 };
    return { report: H.reports.chat(req, 'Bạn vừa gửi: ' + text) };
  };

  require(path.join(BACKEND, 'src/app.ts')); // lắng nghe PORT và bật retry worker như production
  const bcrypt = require(path.join(BACKEND, 'node_modules/bcryptjs'));
  const users = [];
  for (const [key, role] of [['hocvien', 'STUDENT'], ['admin', 'ADMIN']]) {
    const password = crypto.randomBytes(9).toString('base64url');
    const email = `e2e-${key}-${crypto.randomUUID().slice(0, 6)}@example.invalid`;
    await prisma.user.create({ data: { username: `e2e_${key}_${crypto.randomUUID().slice(0, 6)}`, email, role, password: await bcrypt.hash(password, 10) } });
    users.push({ key, role, email, password });
  }
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  await tutor.setTutorAvailability(true, admin.id);

  const vite = spawn(process.execPath, [path.join(FRONTEND, 'node_modules/vite/bin/vite.js'), '--host', '127.0.0.1', '--port', String(frontendPort), '--strictPort'],
    { cwd: FRONTEND, env: { ...process.env, VITE_API_URL: `http://127.0.0.1:${backendPort}`, DATABASE_URL: '' }, stdio: ['ignore', 'pipe', 'pipe'] });
  vite.stdout.on('data', d => process.stdout.write('[vite] ' + d)); vite.stderr.on('data', d => process.stderr.write('[vite] ' + d));

  const control = http.createServer(async (req, res) => {
    const u = new URL(req.url, 'http://x'), json = (s, v) => { res.writeHead(s, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(v, null, 1)); };
    try {
      if (u.pathname === '/tutor') { await tutor.setTutorAvailability(u.searchParams.get('on') === '1', admin.id); return json(200, { tutor: u.searchParams.get('on') === '1' }); }
      if (u.pathname === '/grader') { grader.state.mode = u.searchParams.get('mode') === 'down' ? 'down' : 'ok'; return json(200, { grader: grader.state.mode }); }
      if (u.pathname === '/state') {
        const runs = await prisma.$queryRawUnsafe("SELECT trace_id, status, retry_count, session_id, path_id IS NOT NULL AS published, request->>'batch_index' AS batch_index FROM adaptive_generation_runs ORDER BY created_at");
        const paths = await prisma.$queryRawUnsafe('SELECT COUNT(*)::int AS n FROM personalized_paths').catch(() => [{ n: null }]);
        const submissions = await prisma.$queryRawUnsafe('SELECT status, COUNT(*)::int AS n FROM adaptive_submissions GROUP BY status');
        return json(200, { aiRequests: ai.state.requests.length, badSignatures: ai.state.badSignatures, graderCalls: grader.state.calls, graderMode: grader.state.mode,
          runs, paths: paths[0]?.n, submissions });
      }
      if (u.pathname === '/shutdown') { json(200, { stopping: true }); setTimeout(stop, 100); return; }
      json(404, {});
    } catch (e) { json(500, { error: e.message }); }
  });
  let stopping = false;
  // Dừng sạch: tắt Vite, máy chủ giả, rồi pg_ctl stop cụm PostgreSQL tạm (tránh tiến trình mồ côi).
  const stop = async () => { if (stopping) return; stopping = true; try { vite.kill(); } catch {} control.close(); await ai.close(); await grader.close();
    await prisma.$disconnect().catch(() => {}); db.stop(); process.exit(0); };
  await new Promise(r => control.listen(controlPort, '127.0.0.1', r));
  const info = { frontend: `http://127.0.0.1:${frontendPort}`, backend: `http://127.0.0.1:${backendPort}`, control: `http://127.0.0.1:${controlPort}`, users };
  fs.writeFileSync(path.join(outDir, 'stack.json'), JSON.stringify(info, null, 1));
  console.log('E2E_STACK_READY', JSON.stringify({ frontend: info.frontend, backend: info.backend, control: info.control }));

  process.on('SIGINT', stop); process.on('SIGTERM', stop);
})().catch(e => { console.error('E2E_STACK_FAILED', e); process.exit(1); });
