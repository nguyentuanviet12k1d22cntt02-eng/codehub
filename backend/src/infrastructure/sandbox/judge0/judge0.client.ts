import { SupportedLanguage, ExecuteResult } from '../sandbox.types';

const LANGUAGE_IDS: Partial<Record<SupportedLanguage, number>> = {
    PYTHON: 92, JAVASCRIPT: 93, CPP: 105, C: 50
};
const MAX_OUTPUT = 128000;
const POLL_INTERVAL_MS = 450;

function baseUrl(): string {
    const url = new URL(process.env.JUDGE0_BASE_URL || 'https://ce.judge0.com');
    if (url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname))) {
        throw new Error('JUDGE0_URL_INVALID');
    }
    return url.toString().replace(/\/$/, '');
}

function headers(): Record<string, string> {
    return {
        'Content-Type': 'application/json',
        ...(process.env.JUDGE0_API_KEY ? {'X-Auth-Token': process.env.JUDGE0_API_KEY} : {})
    };
}

async function jsonRequest(url: string, init: RequestInit, deadline: number): Promise<any> {
    const remaining = deadline - Date.now();
    if (remaining <= 0) throw new Error('JUDGE0_DEADLINE_EXCEEDED');
    const response = await fetch(url, {...init, signal: AbortSignal.timeout(Math.min(remaining, 12000))});
    if (!response.ok) throw new Error(`JUDGE0_HTTP_${response.status}`);
    return response.json();
}

function decodeOutput(val: any): string {
    if (!val || typeof val !== 'string') return '';
    try {
        const buf = Buffer.from(val, 'base64');
        if (buf.toString('base64') === val.trim()) {
            return buf.toString('utf8');
        }
    } catch {}
    return String(val);
}

/** One independent Judge0 submission per testcase; no source is executed by the backend. */
export async function executeJudge0(
    sourceCode: string, language: SupportedLanguage, stdin: string, timeoutMs: number,
    options: {memoryKb?: number; languageId?: number} = {}
): Promise<ExecuteResult> {
    const languageId = options.languageId ?? LANGUAGE_IDS[language];
    if (!languageId) throw new Error(`JUDGE0_LANGUAGE_UNSUPPORTED:${language}`);
    if (sourceCode.length > 20000 || stdin.length > 64000) throw new Error('JUDGE0_INPUT_TOO_LARGE');
    const deadline = Date.now() + Math.max(15000, timeoutMs + 18000);
    const base = baseUrl();
    const submitted = await jsonRequest(base + '/submissions?base64_encoded=false&wait=false', {
        method: 'POST', headers: headers(), body: JSON.stringify({
            source_code: sourceCode, language_id: languageId, stdin,
            cpu_time_limit: Math.max(1, Math.ceil(timeoutMs / 1000)),
            wall_time_limit: Math.max(2, Math.ceil(timeoutMs / 1000) + 1),
            memory_limit: options.memoryKb || 128000,
            max_processes_and_or_threads: 16,
            max_file_size: 1024,
            enable_network: false
        })
    }, deadline);
    if (typeof submitted.token !== 'string' || !/^[a-zA-Z0-9-]{20,80}$/.test(submitted.token)) {
        throw new Error('JUDGE0_TOKEN_INVALID');
    }
    let result: any;
    do {
        await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL_MS));
        result = await jsonRequest(base + '/submissions/' + submitted.token + '?base64_encoded=true', {
            method: 'GET', headers: headers()
        }, deadline);
    } while ([1, 2].includes(result?.status?.id));
    const statusId = Number(result?.status?.id);
    if (!Number.isInteger(statusId) || statusId >= 13) throw new Error('JUDGE0_RUNNER_UNAVAILABLE');
    const stdout = decodeOutput(result.stdout).slice(0, MAX_OUTPUT);
    const stderr = (decodeOutput(result.stderr) || decodeOutput(result.compile_output) || decodeOutput(result.message)).slice(0, MAX_OUTPUT);
    const time = Number(result.time);
    return {
        stdout,
        stderr,
        status: statusId === 5 ? 'TIMEOUT' : statusId === 3 ? 'SUCCESS' : 'ERROR',
        runtimeMs: Number.isFinite(time) && time >= 0 ? Math.round(time * 1000) : 0
    };
}
