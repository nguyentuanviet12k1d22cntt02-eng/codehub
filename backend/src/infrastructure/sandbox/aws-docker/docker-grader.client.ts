import { randomUUID } from 'crypto';
import { ExecuteResult, SupportedLanguage } from '../sandbox.types';

const SUPPORTED = new Set<SupportedLanguage>(['PYTHON', 'JAVASCRIPT', 'C', 'CPP']);

function baseUrl(): string {
    const raw = process.env.AWS_DOCKER_GRADER_URL;
    if (!raw) throw new Error('AWS_DOCKER_GRADER_URL_MISSING');
    const url = new URL(raw);
    const localHttp = url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname);
    if (url.protocol !== 'https:' && !localHttp) throw new Error('AWS_DOCKER_GRADER_URL_INVALID');
    if (url.username || url.password || url.search || url.hash) throw new Error('AWS_DOCKER_GRADER_URL_INVALID');
    return url.toString().replace(/\/$/, '');
}

function token(): string {
    const value = process.env.AWS_DOCKER_GRADER_TOKEN || '';
    if (value.length < 32) throw new Error('AWS_DOCKER_GRADER_TOKEN_INVALID');
    return value;
}

export function awsDockerConfigurationReady(): boolean {
    try { baseUrl(); token(); return true; }
    catch { return false; }
}

function parseResult(value: unknown): ExecuteResult {
    if (!value || typeof value !== 'object') throw new Error('AWS_DOCKER_RESPONSE_INVALID');
    const item = value as Record<string, unknown>;
    if (!['SUCCESS', 'TIMEOUT', 'ERROR'].includes(String(item.status))
        || typeof item.stdout !== 'string' || typeof item.stderr !== 'string'
        || !Number.isFinite(item.runtimeMs) || Number(item.runtimeMs) < 0) {
        throw new Error('AWS_DOCKER_RESPONSE_INVALID');
    }
    const allowedFailures = ['COMPILE_ERROR', 'RUNTIME_ERROR', 'OUTPUT_LIMIT_EXCEEDED', 'INTERNAL_ERROR'];
    const failureType = item.failureType == null ? undefined : String(item.failureType);
    if (failureType && !allowedFailures.includes(failureType)) throw new Error('AWS_DOCKER_RESPONSE_INVALID');
    return {
        stdout: item.stdout.slice(0, 128000),
        stderr: item.stderr.slice(0, 128000),
        status: item.status as ExecuteResult['status'],
        runtimeMs: Math.round(Number(item.runtimeMs)),
        failureType: failureType as ExecuteResult['failureType'],
        provider: 'aws-docker',
    };
}

// The grader answers 429 when its queue is full and 502/503/504 while it restarts or is overloaded.
// Retrying a few times with a short backoff hides those moments from learners. A request that
// timed out while running (AbortError) is never retried, so a slow program cannot double the load.
const RETRYABLE_STATUS = new Set([429, 502, 503, 504]);

function retryBaseMs(): number {
    const raw = Number(process.env.AWS_DOCKER_RETRY_BASE_MS);
    return Number.isFinite(raw) && raw >= 0 ? raw : 1000;
}

function retryAfterMs(response: Response, fallbackMs: number): number {
    const header = Number(response.headers?.get?.('retry-after'));
    return Number.isFinite(header) && header > 0 ? Math.min(header * 1000, 5000) : fallbackMs;
}

async function postWithRetry(url: string, init: RequestInit, deadlineMs: number, attempts = 3): Promise<Response> {
    for (let attempt = 1; ; attempt++) {
        const backoff = retryBaseMs() * 2 ** (attempt - 1);
        try {
            const response = await fetch(url, { ...init, signal: AbortSignal.timeout(deadlineMs) });
            if (!RETRYABLE_STATUS.has(response.status) || attempt >= attempts) return response;
            await new Promise(resolve => setTimeout(resolve, retryAfterMs(response, backoff)));
        } catch (error) {
            const name = (error as Error)?.name;
            const networkFailure = name !== 'AbortError' && name !== 'TimeoutError';
            if (!networkFailure || attempt >= attempts) throw error;
            await new Promise(resolve => setTimeout(resolve, backoff));
        }
    }
}

export async function executeAwsDockerBatch(
    sourceCode: string,
    language: SupportedLanguage,
    inputs: string[],
    timeoutMs: number,
    options: { memoryKb?: number } = {},
): Promise<ExecuteResult[]> {
    if (!SUPPORTED.has(language)) throw new Error(`AWS_DOCKER_LANGUAGE_UNSUPPORTED:${language}`);
    if (!sourceCode.trim() || Buffer.byteLength(sourceCode, 'utf8') > 50000) throw new Error('AWS_DOCKER_SOURCE_SIZE_INVALID');
    if (!inputs.length || inputs.length > 50 || inputs.some(input => Buffer.byteLength(input, 'utf8') > 65536)) {
        throw new Error('AWS_DOCKER_INPUT_SIZE_INVALID');
    }
    const requestId = randomUUID();
    const deadlineMs = Math.min(90000, Math.max(15000, inputs.length * (timeoutMs + 1000) + 12000));
    const body = JSON.stringify({
        language,
        sourceCode,
        inputs,
        timeoutMs: Math.max(500, Math.min(10000, timeoutMs)),
        memoryKb: Math.max(65536, Math.min(262144, options.memoryKb || 128000)),
    });
    const response = await postWithRetry(baseUrl() + '/v1/execute', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token()}`,
            'Content-Type': 'application/json',
            'X-Request-ID': requestId,
        },
        body,
    }, deadlineMs);
    if (!response.ok) throw new Error(`AWS_DOCKER_HTTP_${response.status}`);
    const payload = await response.json() as Record<string, unknown>;
    if (payload.requestId !== requestId || payload.provider !== 'aws-docker' || !Array.isArray(payload.results)) {
        throw new Error('AWS_DOCKER_RESPONSE_INVALID');
    }
    if (payload.results.length !== inputs.length) throw new Error('AWS_DOCKER_RESULT_COUNT_INVALID');
    return payload.results.map(parseResult);
}
