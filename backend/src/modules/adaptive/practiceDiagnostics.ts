export interface PracticeDiagnostic {
    kind: 'syntax' | 'logic';
    line: number;
    column?: number;
    endLine?: number;
    endColumn?: number;
    message: string;
    source: 'SANDBOX' | 'AI';
}

export function syntaxExplanation(message: string, sourceLine = '', column?: number): [string, string] {
    if (/unterminated.*string|EOL while scanning string/.test(message)) {
        const quote = column ? sourceLine[column - 1] : '';
        return [`Thiếu dấu ${quote === '"' || quote === "'" ? quote : 'nháy'} để đóng chuỗi.`, 'Đóng chuỗi trước khi kết thúc câu lệnh.'];
    }
    if (/expected ':'/.test(message)) return ['Thiếu dấu : ở cuối câu lệnh.', 'Thêm dấu hai chấm trước khối lệnh thụt vào.'];
    if (/expected an indented block/.test(message)) return ['Thiếu khối lệnh thụt vào sau câu lệnh này.', 'Thụt vào nhất quán cho các lệnh thuộc khối.'];
    if (/unexpected indent/.test(message)) return ['Dòng này bị thụt vào khi không có khối lệnh tương ứng.', 'Đối chiếu mức thụt đầu dòng với khối lệnh bao quanh.'];
    if (/unindent|inconsistent use of tabs/.test(message)) return ['Thụt đầu dòng không nhất quán trong cùng khối lệnh.', 'Dùng cùng mức thụt và không trộn tab với dấu cách.'];
    if (/was never closed|Unexpected end of input/.test(message)) return ['Một dấu ngoặc hoặc khối lệnh chưa được đóng.', 'Kiểm tra cặp dấu mở và đóng ở vị trí được báo.'];
    if (/unmatched|does not match/.test(message)) return ['Dấu đóng không khớp với dấu mở tương ứng.', 'Kiểm tra lại cặp ngoặc tại vị trí này.'];
    if (/expected.*[;].*before/.test(message)) return ['Trình biên dịch đang chờ dấu ; trước vị trí này.', 'Kiểm tra dấu kết thúc câu lệnh ngay trước vị trí được báo.'];
    if (/missing \)/.test(message)) return ['Thiếu dấu ) để đóng lời gọi hoặc biểu thức.', 'Kiểm tra cặp ngoặc mở và đóng.'];
    return ['Cú pháp tại vị trí được báo chưa hợp lệ.', 'Kiểm tra dấu nháy, dấu ngoặc và dấu kết thúc câu lệnh tại đây.'];
}

/** Parse only failed PUBLIC sandbox stderr; never ask a model to infer syntax coordinates. */
export function sandboxSyntax(code: string, result: any): { reason: string; hint: string; diagnostic?: PracticeDiagnostic } | null {
    const lines = code.split(/\r?\n/);
    for (const test of Array.isArray(result?.test_results) ? result.test_results : []) {
        if (test?.is_hidden !== false || test?.passed !== false || test?.status === 'SUCCESS' || test?.status === 'INFRA_ERROR') continue;
        const stderr = String(test.stderr || '');
        let line: number | undefined, column: number | undefined, endLine: number | undefined, endColumn: number | undefined;
        let message = '';
        const metadata = /^__LEARNER_SYNTAX__(\{[^\n]+\})\s*$/m.exec(stderr);
        if (metadata) {
            try {
                const raw = JSON.parse(metadata[1]);
                if (typeof raw.message !== 'string') continue;
                message = raw.message;
                line = raw.line; endLine = raw.end_line;
                // Python offsets count code points; Monaco columns count UTF-16 units.
                const utf16 = (row: number, offset: number) => Number.isInteger(row) && lines[row - 1] !== undefined && Number.isInteger(offset) && offset >= 1
                    ? Array.from(lines[row - 1]).slice(0, offset - 1).join('').length + 1 : undefined;
                column = utf16(raw.line, raw.column); endColumn = utf16(raw.end_line, raw.end_column);
            } catch { /* Legacy stderr below remains usable if the metadata is malformed. */ }
        }
        if (!message) {
            const python = /(?:SyntaxError|IndentationError|TabError):\s*([^\n]+)/.exec(stderr);
            const cpp = /(?:^|\n)(?:[^\n]*[/\\])?main\.cpp:(\d+):(\d+):\s*(?:fatal )?error:\s*([^\n]+)/.exec(stderr);
            const js = /(?:^|\n)(?:[^\n]*[/\\])?(?:main|submission|student)\.js:(\d+)(?::(\d+))?\s*\n/.exec(stderr);
            const jsMessage = /(?:^|\n)SyntaxError:\s*([^\n]+)/.exec(stderr);
            if (python && !js) {
                message = python[1];
                const positions = [...stderr.matchAll(/File "<(?:submission|unknown)>", line (\d+)/g)];
                line = Number(positions.at(-1)?.[1]);
            } else if (cpp) {
                [line, column] = [Number(cpp[1]), Number(cpp[2])]; message = cpp[3];
            } else if (jsMessage) {
                message = jsMessage[1]; line = Number(js?.[1]); column = js?.[2] ? Number(js[2]) : undefined;
                if (js && !column) {
                    const caret = /^([^\S\n]*)\^/m.exec(stderr.slice(js.index + js[0].length));
                    if (caret && !caret[1].includes('\t')) column = caret[1].length + 1;
                }
            } else continue;
        }
        const validLine = Number.isInteger(line) && line! >= 1 && line! <= lines.length;
        const validColumn = validLine && Number.isInteger(column) && column! >= 1 && column! <= lines[line! - 1].length + 1;
        const [reason, hint] = syntaxExplanation(message, validLine ? lines[line! - 1] : '', validColumn ? column : undefined);
        return { reason, hint, ...(validLine ? { diagnostic: {
            kind: 'syntax', source: 'SANDBOX', line: line!, message: `${reason} ${hint}`,
            ...(validColumn ? { column } : {}),
            ...(Number.isInteger(endLine) && endLine! >= line! && endLine! <= lines.length && Number.isInteger(endColumn)
                && endColumn! >= 1 && endColumn! <= lines[endLine! - 1].length + 1 ? { endLine, endColumn } : {}),
        } as PracticeDiagnostic } : {}) };
    }
    return null;
}

export function canAnalyzeLogic(result: any): boolean {
    const tests = Array.isArray(result?.test_results) ? result.test_results : [];
    return result?.passed === false && result?.status === 'EXECUTED' && tests.length > 0
        && tests.every((test: any) => test?.status === 'SUCCESS') && tests.some((test: any) => test?.passed === false);
}

/** Model confidence alone is insufficient: require an exact non-comment source span and public failure. */
export function logicDiagnostic(code: string, result: any, candidate: any): PracticeDiagnostic | undefined {
    if (!canAnalyzeLogic(result) || !result.test_results.some((test: any) => test?.is_hidden === false && test?.passed === false)) return;
    const line = candidate?.line, excerpt = candidate?.line_evidence;
    const sourceLine = Number.isInteger(line) ? code.split(/\r?\n/)[line - 1] : undefined;
    if (!sourceLine || candidate.confidence !== 'high' || typeof excerpt !== 'string' || !excerpt.trim()
        || /^\s*(?:#|\/\/|\/\*|\*)/.test(sourceLine) || sourceLine.indexOf(excerpt) < 0 || sourceLine.indexOf(excerpt) !== sourceLine.lastIndexOf(excerpt)) return;
    return { kind: 'logic', source: 'AI', line, column: sourceLine.indexOf(excerpt) + 1,
        endLine: line, endColumn: sourceLine.indexOf(excerpt) + excerpt.length + 1,
        message: `${candidate.reason} ${candidate.hint}` };
}
