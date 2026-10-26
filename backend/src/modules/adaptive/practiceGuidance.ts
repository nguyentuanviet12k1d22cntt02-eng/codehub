import { internalHeaders } from './adaptiveEvidence';
import { canAnalyzeLogic, logicDiagnostic, sandboxSyntax, type PracticeDiagnostic } from './practiceDiagnostics';

export interface PracticeGuidance {
    tone: 'success' | 'thinking';
    title: string;
    location?: string;
    reason: string;
    hint: string;
    source: 'AI' | 'EVIDENCE';
    analysisKind?: 'syntax' | 'runtime' | 'constraint' | 'logic' | 'success' | 'system';
    diagnostic?: PracticeDiagnostic;
}

/** A broken exercise contract or sandbox is not evidence that the learner is wrong. */
export function isGraderFailure(result: any): boolean {
    if (['INFRA_ERROR', 'CONTRACT_VIOLATION'].includes(result?.status)) return true;
    const errors: string[] = Array.isArray(result?.errors) ? result.errors.map(String) : [];
    if (errors.some(error => /^(?:TEST_\d+_|UNSUPPORTED_CONSTRAINT|SQL_CONSTRAINT_REQUIRES_SQL_POLICY|SANDBOX_)/.test(error))) return true;
    return (Array.isArray(result?.test_results) ? result.test_results : [])
        .some((item: any) => item?.status === 'INFRA_ERROR' || /(?:ARGUMENTS_MUST_BE_ARRAY|CALL_STYLE_REQUIRED|SINGLE_CALL_REQUIRES_ONE_ARGUMENT)/.test(String(item?.stderr || '')));
}

/** Never transmit hidden test inputs, expected outputs, actual outputs or stderr to the model. */
export function practiceAnalysisInput(code: string, result: any, run: any) {
    const spec = run.artifact?.spec_snapshot || {};
    const publicTests = (Array.isArray(result?.test_results) ? result.test_results : [])
        .filter((item: any) => item?.is_hidden === false)
        .sort((a: any, b: any) => Number(a.passed === true) - Number(b.passed === true))
        .slice(0, 3)
        .map((item: any) => ({
            passed: item.passed === true,
            status: String(item.status || '').slice(0, 32),
            input: String(item.input ?? '').slice(0, 500),
            expected: String(item.expected ?? '').slice(0, 500),
            actual: String(item.actual ?? '').slice(0, 500),
            stderr: String(item.stderr ?? '').slice(0, 800),
        }));
    const tests = Array.isArray(result?.test_results) ? result.test_results : [];
    return {
        code: code.slice(0, 20000),
        language: String(run.artifact?.language || spec.language || '').slice(0, 32),
        title: String(run.artifact?.title || '').slice(0, 160),
        problem_statement: String(run.artifact?.problem_statement || '').slice(0, 5000),
        concept_name: String(run.artifact?.concept_name || '').slice(0, 160),
        required_constructs: Array.isArray(spec.required_constructs) ? spec.required_constructs.slice(0, 12) : [],
        forbidden_constructs: Array.isArray(spec.forbidden_constructs) ? spec.forbidden_constructs.slice(0, 12) : [],
        passed: result.passed === true,
        result_status: String(result.status || '').slice(0, 48),
        errors: (Array.isArray(result.errors) ? result.errors : []).map(String).slice(0, 5).map((error: string) => error.slice(0, 240)),
        public_tests: publicTests,
        hidden_failed_count: tests.filter((item: any) => item?.is_hidden === true && item?.passed === false).length,
    };
}

/** Only learner filenames can identify a source line; /work/main.py is the harness. */
function learnerLocation(stderr: string, code: string, syntaxError: boolean): string | undefined {
    const pattern = /File "<submission>", line (\d+)|(?:^|\s)(?:\/[^\s:]+\/)?main\.cpp:(\d+)(?::\d+)?|(?:submission|student)\.js:(\d+)(?::\d+)?/gm;
    const matches = [...stderr.matchAll(pattern)];
    const last = matches.at(-1);
    const line = Number(last?.[1] || last?.[2] || last?.[3]
        || (syntaxError ? /File "<unknown>", line (\d+)/.exec(stderr)?.[1] : undefined));
    return Number.isInteger(line) && line >= 1 && line <= code.split(/\r?\n/).length ? `Dòng ${line}` : undefined;
}

/** Deterministic interpretation of THIS result, never a simulated model answer.
 * Hidden evidence is deliberately unavailable here, including its stderr.
 */
export function evidencePracticeGuidance(code: string, result: any, run: any): PracticeGuidance {
    const analysisKind = isGraderFailure(result) ? 'system' : result?.passed === true ? 'success'
        : canAnalyzeLogic(result) ? 'logic' : result?.status === 'CONSTRAINT_VIOLATION' ? 'constraint' : 'runtime';
    const reply = (title: string, reason: string, hint: string, location?: string): PracticeGuidance => ({
        source: 'EVIDENCE', tone: 'thinking', analysisKind, title, reason, hint, ...(location ? { location } : {}),
    });
    if (isGraderFailure(result)) return reply('Máy chấm đang gặp sự cố',
        'Hệ thống chấm chưa chạy hoặc kiểm tra bài hợp lệ; kết quả này không chứng minh mã của bạn sai.',
        'Giữ nguyên mã và thử chấm lại khi dịch vụ sẵn sàng.');
    const syntax = sandboxSyntax(code,result);
    if (syntax) return { ...reply('Cần sửa cú pháp trước', syntax.reason, syntax.hint,
        syntax.diagnostic ? `Dòng ${syntax.diagnostic.line}` : undefined), analysisKind:'syntax', diagnostic:syntax.diagnostic };
    const tests = Array.isArray(result?.test_results) ? result.test_results : [];
    const publicFailed = tests.filter((test: any) => test?.is_hidden === false && test?.passed === false);
    const diagnostics = [...(Array.isArray(result?.errors) ? result.errors.map(String) : []),
        ...publicFailed.map((test: any) => String(test.stderr || ''))].join('\n');
    const spec = run?.artifact?.spec_snapshot || {};
    const constraint = /CONSTRAINT_(REQUIRED|FORBIDDEN):([A-Za-z_][\w.]{0,60})/.exec(diagnostics);
    if (constraint) {
        const construct = constraint[2];
        const confirmed = constraint[1] === 'REQUIRED' ? spec.required_constructs : spec.forbidden_constructs;
        if (Array.isArray(confirmed) && confirmed.includes(construct)) return constraint[1] === 'REQUIRED'
            ? reply(`Cần sử dụng ${construct}`, `Bộ kiểm tra chưa tìm thấy cấu trúc ${construct} mà bài hiện tại yêu cầu.`,
                `Kiểm tra phần xử lý chính và tự triển khai bằng ${construct}; chỉ ghi trong chú thích không được tính.`)
            : reply(`Không dùng ${construct} trong bài này`, `Bộ kiểm tra phát hiện cấu trúc ${construct}, trong khi bài hiện tại không cho phép dùng cấu trúc này.`,
                'Đối chiếu yêu cầu đề và đổi phần xử lý đó sang kiến thức đang luyện.');
    }
    if (result?.passed === true) return { ...reply('Bạn đã hoàn thành bài này!',
        `Mã vừa nộp đã vượt qua ${tests.length} testcase của bài hiện tại.`,
        'Bạn có thể tự giải thích lại cách xử lý đầu vào và kết quả để củng cố kiến thức.'), tone: 'success' };
    const failed = publicFailed[0];
    if (failed) {
        const stderr = String(failed.stderr || '');
        const status = String(failed.status || '');
        const testLabel = Number.isInteger(failed.case_index) ? `Test công khai #${failed.case_index}` : 'Test công khai';
        if (/TIMEOUT|TIME_LIMIT/.test(status)) return reply('Chương trình chưa kết thúc kịp',
            `${testLabel} vượt giới hạn thời gian thực thi.`,
            'Kiểm tra điều kiện dừng và cách cập nhật biến trong vòng lặp trước khi tối ưu thêm.');
        if (/MEMORY_LIMIT/.test(status)) return reply('Chương trình vượt giới hạn bộ nhớ',
            `${testLabel} dùng quá bộ nhớ cho phép.`, 'Kiểm tra kích thước dữ liệu đang lưu và tránh tạo bản sao không cần thiết.');
        if (status !== 'SUCCESS') {
            const syntax = /(?:SyntaxError|IndentationError|TabError|error:)/.test(stderr);
            const location = learnerLocation(stderr, code, syntax);
            const known = /\b(SyntaxError|IndentationError|TabError|NameError|ReferenceError|TypeError|IndexError|KeyError|ZeroDivisionError|ValueError|RangeError|OperationalError)\b/.exec(stderr)?.[1];
            const explanations: Record<string, string> = {
                SyntaxError: 'Mã chưa đúng cú pháp nên chương trình chưa chạy được.',
                IndentationError: 'Mức thụt đầu dòng không hợp lệ nên Python chưa xác định được khối lệnh.',
                TabError: 'Mã trộn tab và dấu cách không nhất quán ở phần thụt đầu dòng.',
                NameError: 'Chương trình đang sử dụng tên biến hoặc hàm chưa được định nghĩa tại thời điểm chạy.',
                ReferenceError: 'Chương trình đang truy cập tên chưa được khai báo hoặc chưa sẵn sàng.',
                TypeError: 'Một phép toán hoặc lời gọi đang nhận kiểu dữ liệu không phù hợp.',
                IndexError: 'Chương trình truy cập vị trí nằm ngoài phạm vi của dãy.',
                KeyError: 'Chương trình truy cập khóa không tồn tại trong dữ liệu.',
                ZeroDivisionError: 'Phép chia gặp mẫu số bằng không.',
                ValueError: 'Giá trị đang xử lý không phù hợp với phép chuyển đổi hoặc thao tác được gọi.',
                RangeError: 'Một giá trị vượt phạm vi mà thao tác hiện tại cho phép.',
                OperationalError: 'Câu truy vấn không thực thi được với dữ liệu của bài hiện tại.',
            };
            return reply(syntax ? 'Cần sửa cú pháp trước' : 'Chương trình gặp lỗi khi chạy',
                `${testLabel}${known ? ` (${known})` : ''}: ${known ? explanations[known] : 'Chi tiết lỗi có trong bảng kết quả bên dưới.'}`,
                location ? `Đối chiếu ${location.toLowerCase()} với thông báo lỗi và kiểm tra biểu thức ở đó trước.`
                    : 'Đối chiếu thông báo lỗi với mã vừa nộp; chưa đủ bằng chứng để xác định chính xác dòng lỗi.', location);
        }
        const expected = String(failed.expected ?? '').replace(/\r\n/g, '\n').trimEnd();
        const actual = String(failed.actual ?? '').replace(/\r\n/g, '\n').trimEnd();
        if (!actual && expected) return reply('Chưa có kết quả đầu ra',
            `${testLabel} cần đầu ra nhưng mã vừa nộp chưa tạo ra kết quả.`,
            spec.execution?.mode === 'function' ? 'Kiểm tra giá trị trả về của hàm và các nhánh có thể kết thúc mà chưa trả kết quả.'
                : 'Kiểm tra lệnh xuất kết quả có được thực thi với dữ liệu của test này hay không.');
        const textComparator = spec.execution?.comparator === 'text';
        if (textComparator && actual !== expected && actual.trim().split(/\s+/).join(' ') === expected.trim().split(/\s+/).join(' ')) {
            return reply('Sai định dạng đầu ra', `${testLabel} có cùng nội dung nhưng khác khoảng trắng hoặc cách xuống dòng so với yêu cầu.`,
                'Đối chiếu số dòng và dấu phân cách ở phần kỳ vọng; không thêm lời nhắc vào output.');
        }
        return reply('Kết quả chưa khớp', `${testLabel} chạy xong nhưng kết quả thực tế khác kết quả kỳ vọng.`,
            'Lần theo giá trị biến với đầu vào của test công khai đầu tiên bị sai và tìm bước bắt đầu cho kết quả khác.');
    }
    const hiddenFailed = tests.filter((test: any) => test?.is_hidden === true && test?.passed === false).length;
    if (hiddenFailed) return reply('Còn trường hợp chưa xử lý đúng',
        `${hiddenFailed} test ẩn chưa đạt; dữ liệu riêng của các test này không được tiết lộ.`,
        'Tự kiểm tra các giá trị biên theo ràng buộc đề; chưa đủ bằng chứng công khai để kết luận một lỗi cụ thể.');
    return reply('Cần đối chiếu kết quả chấm', 'Kết quả hiện tại chưa có bằng chứng công khai đủ để xác định nguyên nhân sai.',
        'Đối chiếu mã vừa nộp với Input, Output và các cấu trúc bắt buộc trong đề trước khi thử lại.');
}

export const practiceAITimeoutMs = 28000;

/** AI enrichment is optional. A provider outage must not discard grading evidence. */
export async function requestPracticeGuidance(code: string, result: any, run: any, timeoutMs = practiceAITimeoutMs): Promise<PracticeGuidance> {
    const fallback = evidencePracticeGuidance(code, result, run);
    if (!canAnalyzeLogic(result)) return fallback;
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
        const deadline = new Promise<never>((_, reject) => {
            timer = setTimeout(() => { controller.abort(); reject(Error('PRACTICE_AI_TIMEOUT')); }, timeoutMs);
        });
        const work = async (): Promise<PracticeGuidance> => {
            const body = JSON.stringify(practiceAnalysisInput(code, result, run));
            const response = await fetch((process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000') + '/pal-net/practice-feedback', {
                method: 'POST', headers: internalHeaders(body), body, signal: controller.signal,
            });
            if (!response.ok) throw Error('PRACTICE_AI_UNAVAILABLE');
            const payload: any = await response.json();
            const candidate = payload?.guidance;
            if (!candidate || candidate.source !== 'AI' || ['title', 'reason', 'hint'].some(key =>
                typeof candidate[key] !== 'string' || !candidate[key].trim() || candidate[key].includes('```')))
                throw Error('PRACTICE_AI_INVALID');
            if (candidate.reason.length > 180 || candidate.hint.length > 160
                || (candidate.reason + ' ' + candidate.hint).split(/(?<=[.!?])\s+/).filter((part:string)=>part.trim()).length > 2)
                throw Error('PRACTICE_AI_TOO_VERBOSE');
            const diagnostic = logicDiagnostic(code,result,candidate);
            return {
                tone: 'thinking', source: 'AI', analysisKind:'logic',
                title: candidate.title.slice(0, 90), reason: candidate.reason.slice(0, 340), hint: candidate.hint.slice(0, 240),
                ...(diagnostic ? { location: `Dòng ${diagnostic.line}`, diagnostic } : {}),
            };
        };
        return await Promise.race([work(), deadline]);
    } catch {
        return fallback;
    } finally {
        clearTimeout(timer);
    }
}
