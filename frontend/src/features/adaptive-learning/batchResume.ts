/**
 * Theo dõi một bộ bài thực hành (nhiều bài). Backend tự tạo các bài 2..N và tự phát hành
 * bộ bài (exerciseBatchWorker), kể cả khi không còn tab nào mở; trình duyệt chỉ hỏi tiến độ
 * qua GET /adaptive/batch/:traceId và hiển thị. Không có I/O ở đây, để kiểm thử độc lập.
 */

/** GET /adaptive/batch/:traceId — tiến độ của một bộ bài nhiều bài. */
export interface BatchStatus {
    rootTraceId: string;
    /** Trạng thái thẻ bộ bài; backend cũ chưa có trường này. */
    state?: 'GENERATING' | 'READY' | 'FAILED';
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

/** Bao lâu hỏi tiến độ một lần. */
export const BATCH_POLL_MS = 4000;

type BatchMessage = { metadata?: { practiceBatch?: { status?: string; rootTraceId?: string } } };

/** Bộ bài đang tạo (thẻ GENERATING) trong đoạn chat, cần theo dõi tiến độ. */
export function batchToWatch(messages: BatchMessage[]): string | null {
    return messages.find(message => message.metadata?.practiceBatch?.status === 'GENERATING')
        ?.metadata?.practiceBatch?.rootTraceId || null;
}

export type BatchPollOutcome =
    | { kind: 'ready'; pathId: string }
    | { kind: 'failed' }
    | { kind: 'progress'; completedCount: number; expectedCount: number };

/** Kết quả một lần hỏi tiến độ: đã phát hành → mở bộ bài; thất bại → tải lại đoạn chat; còn lại → cập nhật thẻ. */
export function batchPollOutcome(status: BatchStatus): BatchPollOutcome {
    if (status.published && status.pathId) return { kind: 'ready', pathId: status.pathId };
    if (status.state === 'FAILED') return { kind: 'failed' };
    const expectedCount = Math.min(5, Math.max(1, Number(status.expectedCount) || 1));
    const completedCount = Math.min(expectedCount, Math.max(0, Number(status.completedCount) || 0));
    return { kind: 'progress', completedCount, expectedCount };
}
