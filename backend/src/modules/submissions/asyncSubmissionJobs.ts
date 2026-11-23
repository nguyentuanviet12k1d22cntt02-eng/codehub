import type { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';

/**
 * Runs an existing submit handler in the background so the HTTP request returns at once (202) and the
 * browser polls for the result. The handler is reused unchanged: it writes its answer to a recording
 * response object instead of the socket. Jobs live in memory for a short time; a backend restart loses
 * them, in which case the client is told to submit again (nothing was saved until grading finished).
 */
type SubmitHandler = (req: any, res: Response, next: NextFunction) => Promise<void> | void;

export type JobState = 'queued' | 'running' | 'done';

interface Job {
    id: string;
    userId: string;
    state: JobState;
    createdAt: number;
    finishedAt?: number;
    statusCode?: number;
    body?: unknown;
}

const jobs = new Map<string, Job>();
const RESULT_TTL_MS = 10 * 60 * 1000;
const MAX_ACTIVE_PER_USER = 2;
const MAX_ACTIVE_TOTAL = 200;
const MAX_CONCURRENT_HANDLERS = Number(process.env.SUBMISSION_HANDLER_CONCURRENCY) || 8;

let runningHandlers = 0;
const waiting: Array<() => void> = [];

function sweep(now = Date.now()): void {
    for (const [id, job] of jobs) {
        if (job.state === 'done' && now - (job.finishedAt ?? now) > RESULT_TTL_MS) jobs.delete(id);
    }
}
setInterval(sweep, 60_000).unref();

const activeJobs = (userId?: string): Job[] =>
    [...jobs.values()].filter(job => job.state !== 'done' && (userId === undefined || job.userId === userId));

function recordingResponse(onFinish: (statusCode: number, body: unknown) => void): Response {
    let statusCode = 200;
    const res: any = {
        statusCode,
        headersSent: false,
        status(code: number) { statusCode = code; res.statusCode = code; return res; },
        json(body: unknown) { onFinish(statusCode, body); return res; },
        setHeader() { return res; },
        set() { return res; },
    };
    return res as Response;
}

async function acquireHandlerSlot(): Promise<void> {
    if (runningHandlers < MAX_CONCURRENT_HANDLERS) { runningHandlers++; return; }
    await new Promise<void>(resolve => waiting.push(resolve));
}

function releaseHandlerSlot(): void {
    const next = waiting.shift();
    if (next) next(); else runningHandlers--;
}

export function wantsAsync(req: Request): boolean {
    return req.query?.async === '1' || req.query?.async === 'true';
}

/** Starts the job and answers 202. Returns false (after answering) when the caller must slow down. */
export function startSubmissionJob(req: any, res: Response, handler: SubmitHandler): boolean {
    const userId = req.user?.id as string | undefined;
    if (!userId) { res.status(401).json({ error: 'Người dùng chưa đăng nhập' }); return false; }
    if (activeJobs(userId).length >= MAX_ACTIVE_PER_USER || activeJobs().length >= MAX_ACTIVE_TOTAL) {
        res.status(429).json({ code: 'SUBMISSION_QUEUE_BUSY', error: 'Bạn đang có bài đang chấm hoặc hệ thống đang bận. Vui lòng đợi kết quả rồi nộp lại.' });
        return false;
    }

    const job: Job = { id: randomUUID(), userId, state: 'queued', createdAt: Date.now() };
    jobs.set(job.id, job);
    const ahead = activeJobs().length - 1;
    res.status(202).json({ success: true, jobId: job.id, state: job.state, ahead });

    const finish = (statusCode: number, body: unknown) => {
        if (job.state === 'done') return;
        job.state = 'done';
        job.statusCode = statusCode;
        job.body = body;
        job.finishedAt = Date.now();
    };
    void (async () => {
        await acquireHandlerSlot();
        job.state = 'running';
        try {
            const recorder = recordingResponse(finish);
            await handler(req, recorder, (error?: unknown) => {
                if (error) {
                    console.error('[SubmissionJob] handler error:', error);
                    finish(500, { error: 'Lỗi trong quá trình chấm bài.' });
                }
            });
            // A handler that returned without answering must not leave the browser polling forever.
            finish(500, { error: 'Lỗi trong quá trình chấm bài.' });
        } catch (error) {
            console.error('[SubmissionJob] handler crashed:', error);
            finish(500, { error: 'Lỗi trong quá trình chấm bài.' });
        } finally {
            releaseHandlerSlot();
        }
    })();
    return true;
}

export function getSubmissionJob(req: any, res: Response): void {
    const job = jobs.get(String(req.params.jobId));
    if (!job || job.userId !== req.user?.id) {
        res.status(404).json({ code: 'JOB_NOT_FOUND', error: 'Không tìm thấy lượt chấm (có thể máy chủ vừa khởi động lại). Vui lòng nộp lại.' });
        return;
    }
    if (job.state !== 'done') {
        const ahead = [...jobs.values()].filter(other => other.state !== 'done' && other.createdAt < job.createdAt).length;
        res.status(200).json({ success: true, state: job.state, ahead });
        return;
    }
    res.status(200).json({ success: true, state: 'done', statusCode: job.statusCode, body: job.body });
}

export function resetSubmissionJobsForTests(): void {
    jobs.clear();
    waiting.length = 0;
    runningHandlers = 0;
}
