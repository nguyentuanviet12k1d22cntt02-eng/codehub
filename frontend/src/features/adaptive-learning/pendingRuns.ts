/**
 * Mở lại phiên khi một run vẫn đang chạy (vd học viên tải lại trang giữa lúc sinh bài): backend chỉ lưu tin nhắn của
 * AI Tutor khi run kết thúc, nên thêm một tin nhắn chờ tạm có `pipeline.trace_id`. TutorProcessing sẽ tự hỏi trạng thái
 * run và cập nhật tin nhắn này khi xong.
 */
export interface ActiveRun { trace_id: string; status: string }

export function withPendingRuns<T extends { sender: string; content: string; timestamp?: string; metadata?: any }>(
    messages: T[], activeRuns: unknown,
): T[] {
    if (!Array.isArray(activeRuns) || !activeRuns.length) return messages;
    const known = new Set(messages.map(message => message.metadata?.pipeline?.trace_id).filter(Boolean));
    const placeholders = activeRuns
        .filter((run: any): run is ActiveRun => typeof run?.trace_id === 'string' && ['RUNNING', 'WAITING_PROVIDER'].includes(run?.status)
            && !known.has(run.trace_id))
        .map(run => ({ sender: 'AI_TUTOR', content: '', timestamp: new Date().toISOString(),
            metadata: { pipeline: { trace_id: run.trace_id, status: run.status } } }) as unknown as T);
    return placeholders.length ? [...messages, ...placeholders] : messages;
}
