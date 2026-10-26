import { useEffect, useRef } from 'react';
import { Check, Code2, LoaderCircle } from 'lucide-react';
import { API_BASE_URL } from '../../../config/api';
import type { AdaptiveRunReport, PipelineSummary } from './AgentEvidencePanel';

export const isPendingPipeline = (status?: string) =>
    ['WAITING_PROVIDER', 'RUNNING', 'AWAITING_AGENT_APPROVAL'].includes(status || '');

export function TutorProcessing({ total, completed = 0, title, pipeline, polling = false, onSettled }: {
    total?: number;
    completed?: number;
    title?: string;
    pipeline?: PipelineSummary;
    polling?: boolean;
    onSettled?: (traceId: string, report: AdaptiveRunReport) => void;
}) {
    const callback = useRef(onSettled);
    useEffect(() => { callback.current = onSettled; }, [onSettled]);
    useEffect(() => {
        if (!polling || !pipeline?.trace_id || !isPendingPipeline(pipeline.status)) return;
        const controller = new AbortController();
        let timer: ReturnType<typeof setTimeout>;
        const poll = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/learning-path/adaptive/runs/${encodeURIComponent(pipeline.trace_id)}`,
                    { signal: controller.signal, headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
                if (response.ok) {
                    const report = (await response.json()).data as AdaptiveRunReport;
                    if (!controller.signal.aborted && report && !isPendingPipeline(report.status)) {
                        callback.current?.(pipeline.trace_id, report);
                        return;
                    }
                }
            } catch { /* A temporary connection failure keeps the same response frame. */ }
            if (!controller.signal.aborted) timer = setTimeout(poll, 5000);
        };
        void poll();
        return () => { controller.abort(); clearTimeout(timer); };
    }, [polling, pipeline?.trace_id, pipeline?.status]);

    const count = total ? Math.min(total, Math.max(0, completed)) : 0;
    const waiting = pipeline?.status === 'WAITING_PROVIDER';
    return <div role="status" aria-live="polite" aria-atomic="true" data-testid="tutor-processing"
        className="relative w-full min-w-0 overflow-hidden py-2 sm:min-w-80">
        <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Code2 className="h-5 w-5" aria-hidden="true" />
                <LoaderCircle className="absolute inset-1 h-10 w-10 animate-spin text-blue-300 motion-reduce:animate-none" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-900">{total ? `Đang chuẩn bị ${total} bài thực hành` : 'Đang chuẩn bị phản hồi'}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    {waiting ? 'Đang kết nối lại, yêu cầu của bạn vẫn được giữ.' : total && count === total ? 'Đang lưu bộ bài để bạn bắt đầu luyện tập…' : title || 'Đang đọc yêu cầu và chuẩn bị nội dung phù hợp với bạn…'}
                </p>
            </div>
            {total && <span className="shrink-0 text-xs font-semibold tabular-nums text-blue-700">{count}/{total}</span>}
        </div>
        <div className="mt-4 flex gap-1.5" aria-hidden="true">
            {total ? Array.from({ length: total }, (_, index) => <div key={index}
                className={`flex h-6 flex-1 items-center justify-center rounded-md ${index < count ? 'bg-emerald-100 text-emerald-700' : index === count ? 'animate-pulse bg-blue-100 motion-reduce:animate-none' : 'bg-slate-100'}`}>
                {index < count && <Check className="h-3 w-3" />}
            </div>) : [0, 1, 2, 3].map(index => <span key={index}
                style={{ animationDelay: `${index * 180}ms` }} className="h-1.5 flex-1 animate-pulse rounded-full bg-blue-200 motion-reduce:animate-none" />)}
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-slate-500">{total
            ? 'Kết quả sẽ xuất hiện tại đây khi toàn bộ bài đã được kiểm tra.'
            : 'Bạn không cần gửi lại yêu cầu. Kết quả sẽ cập nhật ngay trong khung này.'}</p>
    </div>;
}
