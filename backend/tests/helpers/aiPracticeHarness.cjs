/**
 * Harness kiểm thử API "Luyện tập với AI" ở mức tích hợp, chạy hoàn toàn trên máy:
 *  - PostgreSQL tạm (initdb trong thư mục tạm của hệ điều hành, xoá khi xong) + `prisma db push`;
 *  - AI service giả nói đúng giao thức SSE của `/pal-net/adaptive-tutor-agent/stream`, kịch bản do test đặt;
 *  - grader EC2 giả nói đúng giao thức `/v1/execute`, chạy harness Python thật của backend bằng python cục bộ.
 * Không kết nối DB, AI hay grader thật. Mọi URL đều là loopback; harness từ chối chạy nếu DATABASE_URL không phải DB tạm.
 */
const fs = require('node:fs'), os = require('node:os'), path = require('node:path'), http = require('node:http'), net = require('node:net');
const crypto = require('node:crypto');
const { spawn, spawnSync } = require('node:child_process');

const BACKEND = path.resolve(__dirname, '..', '..');
const ARTIFACT_FIXTURE = path.join(BACKEND, 'src/content/candidate-content-t19-ascii.json');

function findPgBin() {
  const candidates = [process.env.PG_BIN, 'C:\\Program Files\\PostgreSQL\\18\\bin', 'C:\\Program Files\\PostgreSQL\\17\\bin', 'C:\\Program Files\\PostgreSQL\\16\\bin', '/usr/lib/postgresql/16/bin', '/usr/bin']
    .filter(Boolean);
  const exe = process.platform === 'win32' ? 'pg_ctl.exe' : 'pg_ctl';
  return candidates.find(dir => fs.existsSync(path.join(dir, exe))) || null;
}

async function freePort() {
  const server = net.createServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  await new Promise(resolve => server.close(resolve));
  return port;
}

function run(cmd, args, options = {}) {
  const result = spawnSync(cmd, args, { encoding: 'utf8', windowsHide: true, timeout: 120000, ...options });
  if (result.status !== 0) throw new Error(`${path.basename(cmd)} failed: ${String(result.error || '')} ${(result.stderr || result.stdout || '').slice(-800)}`);
  return result;
}

/** PostgreSQL tạm: trả về { url, stop() }. */
async function startDatabase() {
  const bin = findPgBin();
  if (!bin) return null;
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-practice-pg-'));
  const port = await freePort();
  const exe = name => path.join(bin, process.platform === 'win32' ? name + '.exe' : name);
  run(exe('initdb'), ['-D', path.join(dir, 'data'), '-U', 'aitest', '-A', 'trust', '-E', 'UTF8', '--no-locale']);
  // timezone=UTC như DB Production (múi giờ khác làm Prisma raw đọc lệch timestamptz).
  // stdio 'ignore': postgres kế thừa handle của pg_ctl; nếu để pipe, spawnSync chờ mãi không trả về.
  run(exe('pg_ctl'), ['-D', path.join(dir, 'data'), '-o', `-p ${port} -h 127.0.0.1 -c fsync=off -c synchronous_commit=off -c timezone=UTC -c log_timezone=UTC`, '-l', path.join(dir, 'pg.log'), '-w', 'start'],
    { stdio: 'ignore' });
  const stop = () => {
    spawnSync(exe('pg_ctl'), ['-D', path.join(dir, 'data'), '-m', 'immediate', 'stop'], { windowsHide: true });
    fs.rmSync(dir, { recursive: true, force: true });
  };
  try {
    run(exe('createdb'), ['-h', '127.0.0.1', '-p', String(port), '-U', 'aitest', 'ai_practice_test']);
    const url = `postgresql://aitest@127.0.0.1:${port}/ai_practice_test`;
    // prisma.config.ts nạp backend/.env bằng dotenv; biến môi trường đặt ở đây luôn được ưu tiên.
    run(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['prisma', 'db', 'push'],
      { cwd: BACKEND, env: { ...process.env, DATABASE_URL: url }, shell: process.platform === 'win32' });
    // `db push` không tạo DEFAULT ở mức DB cho @updatedAt; migration thật có. Bổ sung để khớp Production.
    run(exe('psql'), ['-h', '127.0.0.1', '-p', String(port), '-U', 'aitest', '-d', 'ai_practice_test', '-v', 'ON_ERROR_STOP=1', '-c',
      'ALTER TABLE "platform_feature_settings" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP, ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP']);
    return { url, port, stop };
  } catch (error) { stop(); throw error; }
}

/** Bảo đảm prisma đang trỏ đúng DB tạm trước khi ghi bất cứ thứ gì. */
async function assertTemporaryDatabase(prisma, port) {
  const [row] = await prisma.$queryRawUnsafe("SELECT current_user AS role, current_database() AS db, current_setting('port') AS port");
  if (row.role !== 'aitest' || row.db !== 'ai_practice_test' || String(row.port) !== String(port)) throw new Error('NOT_THE_TEMPORARY_DATABASE');
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => { try { resolve({ raw: Buffer.concat(chunks), json: JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}') }); } catch (e) { reject(e); } });
    req.on('error', reject);
  });
}

/** Grader EC2 giả: chạy đúng mã nguồn backend gửi (harness Python của backend) bằng python cục bộ. */
async function startFakeGrader(token) {
  const python = process.env.PYTHON || (process.platform === 'win32' ? 'python' : 'python3');
  const state = { mode: 'ok', calls: 0, requests: [] };
  const execOne = (source, input, timeoutMs) => new Promise(resolve => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-practice-grader-'));
    const file = path.join(dir, 'main.py');
    fs.writeFileSync(file, source, 'utf8');
    const started = Date.now();
    const child = spawn(python, ['-I', '-B', '-X', 'utf8', file], { cwd: dir, windowsHide: true });
    let stdout = '', stderr = '', done = false;
    const finish = (status, failureType) => {
      if (done) return; done = true;
      fs.rmSync(dir, { recursive: true, force: true });
      resolve({ status, stdout: stdout.slice(0, 128000), stderr: stderr.slice(0, 128000), runtimeMs: Date.now() - started, ...(failureType ? { failureType } : {}) });
    };
    const timer = setTimeout(() => { child.kill(); finish('TIMEOUT'); }, timeoutMs);
    child.stdout.on('data', d => { stdout += d; if (stdout.length > 200000) { child.kill(); clearTimeout(timer); finish('ERROR', 'OUTPUT_LIMIT_EXCEEDED'); } });
    child.stderr.on('data', d => { stderr += d; });
    child.on('close', code => { clearTimeout(timer); finish(code === 0 ? 'SUCCESS' : 'ERROR', code === 0 ? undefined : 'RUNTIME_ERROR'); });
    child.stdin.end(input);
  });
  const server = http.createServer(async (req, res) => {
    try {
      const { json } = await readJson(req);
      state.calls++; state.requests.push({ language: json.language, inputs: json.inputs.length });
      if (req.headers.authorization !== 'Bearer ' + token) { res.writeHead(401).end(); return; }
      if (state.mode === 'down') { res.writeHead(503).end(); return; }
      if (json.language !== 'PYTHON') { res.writeHead(400).end(); return; }
      const results = [];
      for (const input of json.inputs) results.push(await execOne(json.sourceCode, input, json.timeoutMs));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ requestId: req.headers['x-request-id'], provider: 'aws-docker', results }));
    } catch { res.writeHead(500).end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return { url: `http://127.0.0.1:${server.address().port}`, state, close: () => new Promise(r => server.close(r)) };
}

let sequence = 0;
/** Bản ghi một bước agent theo đúng dạng AI service phát qua SSE. */
function agentRecord(agent, status, output = {}, extra = {}) {
  sequence++;
  const now = new Date().toISOString();
  return { id: 'rec_' + crypto.randomUUID().replace(/-/g, ''), sequence, agent, method: extra.method || 'LLM', status, attempt: 1, stage_attempt: 1,
    run_attempt: 1, started_at: now, ended_at: now, duration_ms: 5, output, output_hash: crypto.createHash('sha256').update(JSON.stringify(output)).digest('hex') };
}

/** Artifact đã kiểm định: lấy từ artifact thật của dự án, đổi ID/trace để không trùng bản gốc. */
function verifiedArtifact(traceId, overrides = {}) {
  const base = JSON.parse(fs.readFileSync(ARTIFACT_FIXTURE, 'utf8'));
  delete base.content_version; delete base.provenance;
  // AI service gán qc_status='VERIFIED' cho mọi bài qua PublicationGate (_verified_artifact); fixture gốc mang nhãn ứng viên cục bộ.
  const artifact = { ...base, qc_status: 'VERIFIED', exercise_id: crypto.randomUUID(), trace_id: traceId, spec_snapshot: { ...base.spec_snapshot, trace_id: traceId }, ...overrides };
  artifact.artifact_hash = crypto.createHash('sha256').update(JSON.stringify(artifact)).digest('hex');
  return artifact;
}

const reports = {
  /** Trả lời hội thoại, không sinh bài. */
  chat(request, reply, extra = {}) {
    const traces = [agentRecord('IntentRouterAgent', 'SUCCEEDED', { intent: extra.intent || 'GENERAL_CHAT', language: request.language || null, language_confirmed: !!request.language })];
    return { trace_id: request.trace_id, schema_version: '4.0', status: 'SUCCEEDED', intent: extra.intent || 'GENERAL_CHAT', reply,
      exercise: null, agent_traces: traces, suggested_options: extra.suggested_options || [], pending_confirmation: extra.pending_confirmation || null, fallback_used: false };
  },
  /** Một bài đã qua PublicationGate. */
  exercise(request, extra = {}) {
    const artifact = verifiedArtifact(request.trace_id, extra.artifact || {});
    const traces = [
      agentRecord('IntentRouterAgent', 'SUCCEEDED', { intent: 'REQUEST_ADAPTIVE_EXERCISE', language: 'python', language_confirmed: true }),
      agentRecord('AdaptiveExercisePlanner', 'SUCCEEDED', { target_concept: artifact.concept_id }),
      agentRecord('ExerciseGeneratorAgent', 'SUCCEEDED', { title: artifact.title }),
      agentRecord('SandboxValidator', 'SUCCEEDED', { passed: true }, { method: 'DETERMINISTIC' }),
      ...(extra.withoutGate ? [] : [agentRecord('PublicationGate', 'SUCCEEDED', { approved: true, artifact_hash: artifact.artifact_hash }, { method: 'DETERMINISTIC_GATE' })]),
    ];
    return { trace_id: request.trace_id, schema_version: '4.0', status: extra.status || 'SUCCEEDED', intent: 'REQUEST_ADAPTIVE_EXERCISE',
      reply: 'Bài tập đã sẵn sàng.', exercise: artifact, exercise_count: extra.count || 1, agent_traces: traces, suggested_options: [], pending_confirmation: null, fallback_used: false };
  },
  /** Lỗi provider có thể thử lại. */
  providerError(request, code = 'PROVIDER_TIMEOUT') {
    return { trace_id: request.trace_id, schema_version: '4.0', status: 'FAILED', intent: 'REQUEST_ADAPTIVE_EXERCISE', reply: 'Provider lỗi.',
      exercise: null, agent_traces: [agentRecord('ExerciseGeneratorAgent', 'FAILED', { error: code })], error: { code, message: code }, fallback_used: false };
  },
};

/**
 * AI service giả. Mỗi request lấy một handler trong hàng đợi `state.queue` (hoặc `state.fallback`).
 * Handler nhận request đã parse, trả về { httpStatus?, events?, report?, delayMs?, hang?, beforeComplete? }.
 */
async function startFakeAI(verifyInternal) {
  const state = { queue: [], fallback: null, requests: [], badSignatures: 0 };
  const server = http.createServer(async (req, res) => {
    let body;
    try { body = await readJson(req); } catch { res.writeHead(400).end(); return; }
    if (!verifyInternal(body.raw, String(req.headers['x-adaptive-time'] || ''), String(req.headers['x-adaptive-signature'] || ''))) {
      state.badSignatures++; res.writeHead(401).end(); return;
    }
    const request = body.json;
    state.requests.push(request);
    const handler = state.queue.shift() || state.fallback;
    const plan = handler ? await handler(request) : { report: reports.chat(request, 'Xin chào!') };
    if (plan.httpStatus) { res.writeHead(plan.httpStatus).end(); return; }
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' });
    const write = event => { if (!res.destroyed) res.write('data: ' + JSON.stringify(event) + '\n\n'); };
    const report = plan.report;
    for (const record of plan.events || report?.agent_traces || []) { write({ type: 'agent_step', record }); }
    if (plan.delayMs) await new Promise(r => setTimeout(r, plan.delayMs));
    if (plan.hang) return; // không bao giờ gửi complete
    if (plan.streamError) { write({ type: 'error', error: plan.streamError, trace_id: request.trace_id }); res.end(); return; }
    if (plan.endWithoutComplete) { res.end(); return; }
    write({ type: 'complete', data: report });
    res.end();
  });
  server.keepAliveTimeout = 1;
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return { url: `http://127.0.0.1:${server.address().port}`, state, close: () => { server.closeAllConnections?.(); return new Promise(r => server.close(r)); } };
}

/** Gọi endpoint SSE, gom các event `data:` cho tới khi luồng đóng (hoặc dừng sớm theo `abortAfter`). */
async function sse(base, pathName, token, body, { abortAfter } = {}) {
  const controller = new AbortController();
  const response = await fetch(base + pathName, { method: 'POST', signal: controller.signal,
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }, body: JSON.stringify(body) });
  if (!(response.headers.get('content-type') || '').includes('text/event-stream')) {
    return { status: response.status, json: await response.json().catch(() => null), events: [] };
  }
  const events = []; const decoder = new TextDecoder(); let buffer = '', aborted = false;
  try {
    for await (const chunk of response.body) {
      buffer += decoder.decode(chunk, { stream: true });
      let index;
      while ((index = buffer.indexOf('\n\n')) >= 0) {
        const frame = buffer.slice(0, index); buffer = buffer.slice(index + 2);
        const data = frame.split('\n').filter(l => l.startsWith('data: ')).map(l => l.slice(6)).join('\n');
        if (data) events.push(JSON.parse(data));
        // Đóng kết nối như trình duyệt đóng tab. Thoát vòng lặp có thể ném AbortError nên đánh dấu trước.
        if (abortAfter && abortAfter(events.at(-1))) { aborted = true; controller.abort(); return { status: response.status, events, aborted }; }
      }
    }
  } catch (error) { if (error.name !== 'AbortError') throw error; }
  return { status: response.status, events, aborted, complete: events.find(e => e.type === 'complete') };
}

async function waitFor(check, timeoutMs = 10000, stepMs = 100) {
  const end = Date.now() + timeoutMs;
  for (;;) {
    const value = await check();
    if (value) return value;
    if (Date.now() > end) throw new Error('WAIT_TIMEOUT');
    await new Promise(r => setTimeout(r, stepMs));
  }
}

module.exports = { startDatabase, assertTemporaryDatabase, startFakeGrader, startFakeAI, reports, verifiedArtifact, agentRecord, sse, waitFor, findPgBin };
