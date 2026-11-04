import { readFileSync, existsSync } from 'fs';
import path from 'path';

export interface PythonFileCase {
    __pythonFileCase: '1.0';
    stdin: string;
    files: Record<string, string>;
    expectedFiles: Record<string, string>;
    preserveInputFiles: true;
}
const fields = ['__pythonFileCase', 'stdin', 'files', 'expectedFiles', 'preserveInputFiles'].sort();
const bytes = (s: string) => Buffer.byteLength(s, 'utf8');

/** Reserved server-owned testcase envelope; ordinary stdin retains its meaning. */
export function parsePythonFileCase(input: string): PythonFileCase | null {
    if (!input.includes('"__pythonFileCase"')) return null;
    let value: any;
    try { value = JSON.parse(input); } catch { throw new Error('PYTHON_FILE_CASE_INVALID_JSON'); }
    if (!value || typeof value !== 'object' || !Object.hasOwn(value, '__pythonFileCase')) return null;
    if (bytes(input) > 65536 || JSON.stringify(Object.keys(value).sort()) !== JSON.stringify(fields)
        || value.__pythonFileCase !== '1.0' || value.preserveInputFiles !== true
        || typeof value.stdin !== 'string' || bytes(value.stdin) > 16000) {
        throw new Error('PYTHON_FILE_CASE_INVALID_SCHEMA');
    }
    let total = bytes(value.stdin);
    for (const name of ['files', 'expectedFiles']) {
        const files = value[name];
        if (!files || typeof files !== 'object' || Array.isArray(files) || Object.keys(files).length > 8) {
            throw new Error('PYTHON_FILE_CASE_INVALID_FILES');
        }
        for (const [filename, content] of Object.entries(files)) {
            if (filename.length > 64 || !/^[A-Za-z0-9_-]+(?:\.[A-Za-z0-9_-]+)+$/.test(filename)
                || typeof content !== 'string' || bytes(content) > 16000) {
                throw new Error('PYTHON_FILE_CASE_INVALID_PATH_OR_SIZE');
            }
            total += bytes(content);
        }
    }
    if (total > 48000) throw new Error('PYTHON_FILE_CASE_TOO_LARGE');
    return value as PythonFileCase;
}

export function preparePythonFileExecution(code: string, input: string, timeoutMs: number): { code: string; input: string } | null {
    const fileCase = parsePythonFileCase(input);
    if (!fileCase) return null;
    const deployed = path.join(__dirname, 'python', 'file_case.runner.py');
    const source = path.join(__dirname, '..', '..', '..', 'src', 'infrastructure', 'sandbox', 'python', 'file_case.runner.py');
    const payload = JSON.stringify({ code, fileCase, timeoutSeconds: Math.max(.1, Math.min(9.5, timeoutMs / 1000 - .25)) });
    if (bytes(code) > 50000 || bytes(payload) > 65536) throw new Error('PYTHON_FILE_CASE_PAYLOAD_TOO_LARGE');
    return { code: readFileSync(existsSync(deployed) ? deployed : source, 'utf8'), input: payload };
}
