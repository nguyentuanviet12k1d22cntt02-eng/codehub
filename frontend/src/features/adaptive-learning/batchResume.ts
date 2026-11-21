/**
 * Quy tắc tiếp tục một bộ bài thực hành (nhiều bài) bị dừng giữa chừng, ví dụ khi trang
 * được tải lại. Không có I/O, để kiểm thử độc lập; PersonalizedPath gọi API và React state.
 */

/** GET /adaptive/batch/:traceId — tiến độ của một bộ bài nhiều bài. */
export interface BatchResumeStatus {
    rootTraceId: string;
    published: boolean;
    pathId: string | null;
    expectedCount: number;
    completedCount: number;
    running: boolean;
    nextIndex: number | null;
    nextIndexFailures: number;
    titles: (string | null)[];
    exercise: { exercise_id: string; title: string; concept_id: string; concept_name?: string; language: string };
}

/** Một vị trí đã lỗi chừng này lần thì không tự thử lại mỗi lần tải trang. */
export const MAX_POSITION_FAILURES = 2;

export interface BatchPlan {
    total: number;
    done: Set<number>;
    titles: string[];
    /** Vị trí cần tạo, theo thứ tự (2..total, bỏ các vị trí đã xong). */
    remaining: number[];
    /** Vị trí kế tiếp đã lỗi quá số lần cho phép: đánh dấu bộ thất bại thay vì thử tiếp. */
    exhausted: boolean;
}

/** Kế hoạch cho một bộ bài: từ trạng thái backend (khi tiếp tục) hoặc từ bài 1 vừa tạo xong. */
export function planBatch(expectedCount: number, firstTitle: string, status?: BatchResumeStatus): BatchPlan {
    const total = Math.min(5, Math.max(1, Number(expectedCount) || 1));
    const done = new Set<number>(status
        ? status.titles.map((title, index) => (title ? index + 1 : 0)).filter(Boolean)
        : [1]);
    const titles = status
        ? status.titles.filter((title): title is string => Boolean(title))
        : [String(firstTitle || '')];
    const remaining: number[] = [];
    for (let index = 2; index <= total; index++) if (!done.has(index)) remaining.push(index);
    const exhausted = Boolean(status && status.nextIndexFailures >= MAX_POSITION_FAILURES);
    return { total, done, titles, remaining: exhausted ? [] : remaining, exhausted };
}

/** Bộ bài nào trong đoạn chat cần tự tiếp tục (thẻ còn GENERATING và chưa được xử lý). */
export function batchToResume(
    messages: { metadata?: { practiceBatch?: { status?: string; rootTraceId?: string } } }[],
    alreadyResuming: ReadonlySet<string>,
): string | null {
    const rootTraceId = messages.find(message => message.metadata?.practiceBatch?.status === 'GENERATING')
        ?.metadata?.practiceBatch?.rootTraceId;
    return rootTraceId && !alreadyResuming.has(rootTraceId) ? rootTraceId : null;
}

/** Có cần chạy vòng tạo bài không (bộ đã phát hành thì không). */
export function shouldResume(status: BatchResumeStatus | undefined): status is BatchResumeStatus {
    return Boolean(status && !status.published);
}

/**
 * Lỗi nào không được làm hỏng thẻ bộ bài:
 * - đang tiếp tục mà lỗi trước khi kịp chạy (ví dụ đọc trạng thái thất bại) → giữ nguyên thẻ;
 * - 409 trong lúc tạo bộ bài → tab khác đang làm tiếp, không đánh dấu thất bại.
 */
export function isQuietBatchError(resuming: boolean, batchStarted: boolean, httpStatus?: number): boolean {
    return (resuming && !batchStarted) || (batchStarted && httpStatus === 409);
}
