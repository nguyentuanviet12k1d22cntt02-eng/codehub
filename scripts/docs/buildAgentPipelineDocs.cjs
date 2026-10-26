// Mechanical source snapshot. No application imports, .env reads, or network calls.
const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');
const root = path.resolve(__dirname, '../..');
const target = path.join(root, 'docs/LUONG_HOAT_DONG_VA_MA_NGUON_CUSTOM_CAC_AGENT.md');
const marker = '<!-- BEGIN GENERATED AGENT SOURCE SNAPSHOT -->';
const normalize = value => value.replace(/\r\n/g, '\n');
const sha256 = value => createHash('sha256').update(value).digest('hex');

function list(directory, extensions) {
    return fs.readdirSync(path.join(root, directory), { withFileTypes: true }).flatMap(item => {
        const relative = directory + '/' + item.name;
        if (item.isDirectory() && !['__pycache__', 'node_modules', '.venv', 'venv'].includes(item.name))
            return list(relative, extensions);
        return item.isFile() && extensions.includes(path.extname(item.name)) ? [relative] : [];
    }).sort();
}

const groups = [
    ['Điểm vào, API và điều phối hiện tại', [
        'ai-service/pipeline_server.py', 'ai-service/main.py', 'ai-service/app/api/adaptive.py',
        ...list('ai-service/app/orchestrator', ['.py']),
    ]],
    ['Toàn bộ agent hiện tại và helper trực tiếp',
        list('ai-service/app/agents', ['.py']).filter(file => !file.endsWith('/adaptive_agent_orchestrator.py'))],
    ['Hợp đồng dữ liệu, pipeline và validator', [
        ...list('ai-service/app/contracts', ['.py']), ...list('ai-service/app/pipeline', ['.py']),
        ...list('ai-service/app/validation', ['.py']),
    ]],
    ['Đồ thị, trạng thái, lịch sử và pool key', [
        ...list('ai-service/app/services', ['.py']), 'ai-service/app/llm/key_pool_manager.py',
    ]],
    ['Backend điều phối, lưu trữ, retry, chấm bài và feedback', [
        ...list('backend/src/modules/adaptive', ['.ts']),
        'backend/src/modules/learning-path/learningPathRoutes.ts',
        'backend/src/modules/learning-path/learningPath.controller.ts',
        'backend/src/modules/recommendations/recommendationController.ts',
        ...list('backend/src/modules/ai-tutor', ['.ts']), ...list('backend/src/modules/ai-keys', ['.ts']),
    ]],
    ['Sandbox và mã thực thi cô lập', [
        ...list('backend/src/infrastructure/sandbox', ['.ts', '.py']),
        ...list('grader-service/app', ['.py']), 'grader-service/runners/common/runner.py',
    ]],
    ['Giao diện nối trực tiếp vào luồng agent và diagnostics', [
        ...['AITutorChat.tsx', 'AgentEvidencePanel.tsx', 'TutorProcessing.tsx']
            .map(file => 'frontend/src/features/ai-tutor/components/' + file),
        ...['PersonalizedPath.tsx', 'PersonalizedPathWorkspace.tsx', 'AdaptivePractice.tsx']
            .map(file => 'frontend/src/features/adaptive-learning/pages/' + file),
        ...['PersonalizedLessonViewer.tsx', 'PracticeCodeEditor.tsx', 'PracticeCodeEditor.css',
            'PracticeGuidanceCard.tsx', 'PracticeGuidanceCard.css', 'practiceGuidanceResult.ts', 'editorDiagnostics.ts']
            .map(file => 'frontend/src/features/adaptive-learning/components/' + file),
    ]],
    ['Agent và client legacy / tương thích, không phải đường API adaptive hiện tại', [
        'ai-service/core/adaptive_agent_orchestrator.py', 'ai-service/app/agents/adaptive_agent_orchestrator.py',
        'ai-service/app/llm/omniroute_client.py', 'ai-service/core/omniroute_client.py',
    ]],
    ['Kiểm thử hồi quy liên quan, không tự chạy khi sinh tài liệu', [
        ...['test_missing_learning_topic.py', 'test_router_concept_consistency.py', 'test_llm_catalog_routing.py',
            'test_pipeline_v3.py', 'test_constrained_exercise_repair.py', 'test_set_generation_regression.py',
            'test_problem_statement_format.py', 'test_exercise_count.py', 'test_batch_failure_regression.py',
            'test_learner_knowledge_contract.py', 'test_practice_feedback.py', 'test_adaptive_agent.py']
            .map(file => 'ai-service/tests/' + file),
        ...['adaptive.test.cjs', 'awsDockerSandbox.test.cjs', 'practiceGuidance.test.cjs', 'practiceDiagnostics.test.cjs']
            .map(file => 'backend/tests/' + file),
        ...['practiceGuidance.test.mjs', 'editorDiagnostics.test.mjs', 'tutorResponse.test.mjs']
            .map(file => 'frontend/tests/' + file),
        'frontend/tests/practice-guidance.browser.html',
        ...list('grader-service/tests', ['.py']),
    ]],
    ['Công cụ tái tạo và kiểm tra tài liệu', ['scripts/docs/buildAgentPipelineDocs.cjs']],
];

const seen = new Set();
const entries = groups.flatMap(([group, files], groupIndex) => files.map(file => {
    if (seen.has(file)) throw Error('Duplicate source: ' + file);
    seen.add(file);
    const absolute = path.resolve(root, file);
    if (!absolute.startsWith(root + path.sep) || !fs.statSync(absolute).isFile()) throw Error('Invalid source: ' + file);
    const raw = fs.readFileSync(absolute);
    const content = normalize(raw.toString('utf8'));
    return { group, groupIndex, file, content, bytes: raw.length, hash: sha256(raw),
        normalizedHash: sha256(content), lines: content ? content.split('\n').length - (content.endsWith('\n') ? 1 : 0) : 0,
        anchor: 'source-' + sha256(file).slice(0, 12) };
}));
const agents = list('ai-service/app/agents', ['.py']);
if (agents.some(file => !seen.has(file))) throw Error('An agent is absent from the source manifest');
for (const entry of entries) {
    if (/(?:AIza[0-9A-Za-z_-]{35}|sk-(?:proj-|or-v1-)?[0-9A-Za-z_-]{35,}|gsk_[0-9A-Za-z]{35,})/.test(entry.content))
        throw Error('Review possible embedded credential before documenting: ' + entry.file);
}

const output = [marker, '', '# Phần B — Bản chụp toàn văn mã nguồn', '',
    'Code giữ nguyên nội dung và chỉ chuẩn hóa CRLF thành LF trong Markdown. SHA-256 gốc tính trên byte của file; hash LF đối chiếu nội dung nhúng. File tích hợp có thể chứa thêm nghiệp vụ/nhánh cũ ngoài phần agent đang được giải thích; có mặt trong phụ lục không đồng nghĩa mọi hàm đều đang được route gọi.', '',
    `Tổng cộng **${entries.length} file**, **${entries.reduce((n, item) => n + item.lines, 0)} dòng**, **${entries.reduce((n, item) => n + item.bytes, 0)} byte nguồn**. Bao gồm toàn bộ ${agents.length} file Python trong app/agents, kể cả __init__ và bản legacy.`, '',
    '## B.1. Manifest đối chiếu file', '', '| Nhóm | File / mở code | Dòng | SHA-256 byte gốc |', '| --- | --- | ---: | --- |'];
for (const entry of entries)
    output.push(`| ${entry.groupIndex + 1} | [${entry.file}](#${entry.anchor}) | ${entry.lines} | \`${entry.hash}\` |`);

output.push('', '## B.2. Dữ liệu catalog mà pipeline đọc', '',
    'Graph là nguồn dữ liệu, không phải agent. Bảng ghi inventory/hash; alias và resolver có nguyên code trong KnowledgeGraphService. Không sao chép kho bài giảng hoặc dữ liệu huấn luyện vào phụ lục code.', '',
    '| Ngôn ngữ | File | Skill | Lesson mapping | SHA-256 |', '| --- | --- | ---: | ---: | --- |');
for (const language of ['python', 'javascript', 'cpp', 'sql']) {
    const file = 'ai-service/data/' + language + 'SkillGraph.json';
    const raw = fs.readFileSync(path.join(root, file));
    const graph = JSON.parse(raw.toString('utf8').replace(/^\uFEFF/, ''));
    output.push(`| ${language} | ${file} | ${(graph.skills || []).length} | ${Object.keys(graph.lesson_mappings || {}).length} | \`${sha256(raw)}\` |`);
}

output.push('', '## B.3. Chỉ mục mã lỗi và biến cấu hình trong nguồn', '',
    'Chỉ mục cơ học để tra cứu; có thể gồm fixture và nhánh tương thích. Quy tắc phát sinh/khôi phục từng mã nằm trong file nguồn; không phải mọi mã đều retryable.', '');
const identifiers = (pattern, content) => [...new Set([...content.matchAll(pattern)].map(match => match[1]))].sort();
for (const entry of entries.filter(item => item.groupIndex < 6)) {
    const errors = identifiers(/(?:PipelineError\(|(?:throw\s+(?:new\s+)?Error|raise\s+(?:ValueError|RuntimeError))\()\s*["']([A-Z][A-Z0-9_]+)["']/g, entry.content);
    const env = identifiers(/os\.(?:getenv|environ\.get)\(\s*["']([A-Z][A-Z0-9_]+)["']/g,
        entry.content.replace(/process\.env\.([A-Z][A-Z0-9_]+)/g, "os.getenv('$1')"));
    if (errors.length || env.length) output.push(`### ${entry.file}`, '',
        errors.length ? 'Mã lỗi: ' + errors.map(value => '`' + value + '`').join(', ') + '.' : 'Không có literal mã lỗi khớp bộ quét.', '',
        env.length ? 'Biến môi trường: ' + env.map(value => '`' + value + '`').join(', ') + '.' : 'Không có biến môi trường literal khớp bộ quét.', '');
}
output.push('Tên động: `ADAPTIVE_<STAGE>_MAX_TOKENS`, `ADAPTIVE_<STAGE>_CALL_TIMEOUT_SECONDS`, `ADAPTIVE_<STAGE>_STAGE_BUDGET_SECONDS`, `ADAPTIVE_<STAGE>_MAX_ATTEMPTS_PER_PROVIDER`, `ADAPTIVE_<PROVIDER>_MODEL`. Xem PipelineLLMClient để có cách ghép chính xác.', '', '## B.4. Toàn văn từng file', '');

function codeBlock(entry) {
    const lengths = [...entry.content.matchAll(/`+/g)].map(match => match[0].length + 1);
    const fence = '`'.repeat(Math.max(4, ...lengths));
    const language = ({ '.py': 'python', '.ts': 'typescript', '.tsx': 'tsx', '.cjs': 'javascript', '.mjs': 'javascript', '.css': 'css', '.html': 'html' })[path.extname(entry.file)] || 'text';
    return fence + language + '\n' + entry.content + '\n' + fence;
}
for (let index = 0; index < groups.length; index++) {
    output.push(`### Nhóm ${index + 1}: ${groups[index][0]}`, '');
    for (const entry of entries.filter(item => item.groupIndex === index))
        output.push(`<a id="${entry.anchor}"></a>`, '', '<details>', `<summary>${entry.file} — ${entry.lines} dòng</summary>`, '',
            `SHA-256 byte gốc: \`${entry.hash}\`. SHA-256 LF: \`${entry.normalizedHash}\`.`, '', codeBlock(entry), '', '</details>', '');
}
output.push('<!-- END GENERATED AGENT SOURCE SNAPSHOT -->', '');
const current = normalize(fs.readFileSync(target, 'utf8'));
const markerIndex = current.indexOf(marker);
if (markerIndex < 0) throw Error('Missing generated-source marker');
const expected = current.slice(0, markerIndex).trimEnd() + '\n\n' + output.join('\n');
if (process.argv.includes('--check')) {
    if (current !== expected) throw Error('Source appendix is stale; run the builder without --check');
    for (const entry of entries)
        if (!current.includes(codeBlock(entry))) throw Error('Incomplete source: ' + entry.file);
    console.log(JSON.stringify({ status: 'VERIFIED', files: entries.length, agentFiles: agents.length,
        sourceLines: entries.reduce((n, entry) => n + entry.lines, 0), documentBytes: Buffer.byteLength(current) }));
} else {
    fs.writeFileSync(target, expected, 'utf8');
    console.log(JSON.stringify({ status: 'GENERATED', files: entries.length, documentBytes: Buffer.byteLength(expected) }));
}
