import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { API_BASE_URL } from '../../config/api';

export interface SubmitProgress {
    state: 'queued' | 'running';
    /** Submissions that were queued before this one (approximate). */
    ahead: number;
}

const POLL_FIRST_MS = 800;
const POLL_MAX_MS = 2500;
const MAX_WAIT_MS = 3 * 60 * 1000;
const MAX_POLL_FAILURES = 5;

const sleep = (ms: number, signal?: AbortSignal) => new Promise<void>((resolve, reject) => {
    if (signal?.aborted) { reject(new axios.CanceledError()); return; }
    const timer = setTimeout(() => { signal?.removeEventListener('abort', onAbort); resolve(); }, ms);
    const onAbort = () => { clearTimeout(timer); reject(new axios.CanceledError()); };
    signal?.addEventListener('abort', onAbort, { once: true });
});

function failure<T>(message: string, config: AxiosRequestConfig, status: number, data: T): AxiosError<T> {
    const response = { data, status, statusText: '', headers: {}, config } as AxiosResponse<T>;
    return new AxiosError<T>(message, 'ERR_BAD_RESPONSE', config as never, undefined, response);
}

/**
 * Submits for grading without holding one long HTTP request open: the backend answers 202 with a job id
 * and this helper polls for the result. An older backend that answers 200 directly still works.
 * Errors are shaped like axios errors so existing `catch` blocks keep working.
 */
export async function submitWithPolling<T>(
    url: string,
    body: unknown,
    config: AxiosRequestConfig,
    onProgress?: (progress: SubmitProgress) => void,
): Promise<{ data: T }> {
    const signal = config.signal as AbortSignal | undefined;
    const first = await axios.post(url, body, { ...config, params: { ...(config.params ?? {}), async: 1 } });
    if (first.status !== 202 || !first.data?.jobId) return { data: first.data as T };

    const jobUrl = `${API_BASE_URL}/api/auth/submission-jobs/${encodeURIComponent(first.data.jobId)}`;
    onProgress?.({ state: 'queued', ahead: Number(first.data.ahead) || 0 });
    const started = Date.now();
    let delay = POLL_FIRST_MS;
    let failures = 0;
    for (;;) {
        await sleep(delay, signal);
        delay = Math.min(POLL_MAX_MS, Math.round(delay * 1.4));
        if (Date.now() - started > MAX_WAIT_MS) {
            throw failure('Hết thời gian chờ chấm bài. Vui lòng thử nộp lại.', config, 504, { error: 'Hết thời gian chờ chấm bài. Vui lòng thử nộp lại.' });
        }
        let poll: AxiosResponse;
        try {
            poll = await axios.get(jobUrl, { headers: config.headers, signal });
        } catch (error) {
            if (axios.isCancel(error)) throw error;
            const status = axios.isAxiosError(error) ? error.response?.status : undefined;
            // 404 (restart) and auth failures will not fix themselves; network blips may.
            if (status === 404 || status === 401 || status === 403 || ++failures >= MAX_POLL_FAILURES) throw error;
            continue;
        }
        failures = 0;
        if (poll.data.state !== 'done') {
            onProgress?.({ state: poll.data.state, ahead: Number(poll.data.ahead) || 0 });
            continue;
        }
        if (poll.data.statusCode >= 400) {
            const message = poll.data.body?.error || 'Lỗi trong quá trình chấm bài.';
            throw failure(message, config, poll.data.statusCode, poll.data.body);
        }
        return { data: poll.data.body as T };
    }
}
