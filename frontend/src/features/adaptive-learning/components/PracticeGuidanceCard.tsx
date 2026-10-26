import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { GripHorizontal, Lightbulb, Minus, Sparkles, X } from 'lucide-react';
import { RabbitMascot } from './RabbitMascot';
import './PracticeGuidanceCard.css';
import type { PracticeGuidance } from './practiceGuidanceResult';
export type { PracticeGuidance } from './practiceGuidanceResult';

interface Props {
    guidance?: PracticeGuidance | null;
    submitting: boolean;
    analyzing: boolean;
    analysisError: boolean;
    error?: string;
    exerciseTitle: string;
    stale?: boolean;
}

export function PracticeGuidanceCard({ guidance, submitting, analyzing, analysisError, error, exerciseTitle, stale = false }: Props) {
    const [view, setView] = useState<'expanded' | 'minimized' | 'closed'>(
        guidance || submitting || analyzing || error || analysisError ? 'expanded' : 'minimized',
    );
    const [position, setPosition] = useState<{ x: number; y: number } | null>(null);

    const panelId = useId();
    const labelId = useId();
    const dockRef = useRef<HTMLDivElement>(null);
    const panel = useRef<HTMLElement>(null);
    const launcher = useRef<HTMLButtonElement>(null);
    const minimizeButton = useRef<HTMLButtonElement>(null);

    const isDraggingRef = useRef(false);
    const hasDraggedRef = useRef(false);
    const dragStartRef = useRef({ mouseX: 0, mouseY: 0, elementX: 0, elementY: 0 });

    const mood = submitting || analyzing || (guidance?.tone === 'thinking') ? 'thinking'
        : guidance?.tone === 'success' ? 'success' : 'idle';
    const title = submitting ? 'Đang chấm bài làm…'
        : guidance?.title
        || (analyzing ? 'Đang phân tích bài làm...'
        : error ? 'Chưa thể chấm bài lúc này'
        : analysisError ? 'Kết quả chấm đã có bên dưới'
        : 'Bạn đồng hành khi luyện tập');

    const collapse = (next: 'minimized' | 'closed') => {
        setView(next);
        window.requestAnimationFrame(() => launcher.current?.focus({ preventScroll: true }));
    };
    const expand = () => {
        setView('expanded');
        window.requestAnimationFrame(() => minimizeButton.current?.focus({ preventScroll: true }));
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        // Do not drag if clicking on interactive controls (buttons, links, inputs)
        if ((e.target as HTMLElement).closest('button, a, input, textarea')) return;

        const dock = dockRef.current;
        if (!dock) return;

        const rect = dock.getBoundingClientRect();
        isDraggingRef.current = true;
        hasDraggedRef.current = false;
        dragStartRef.current = {
            mouseX: e.clientX,
            mouseY: e.clientY,
            elementX: rect.left,
            elementY: rect.top,
        };

        const handlePointerMove = (ev: PointerEvent) => {
            if (!isDraggingRef.current) return;
            const dx = ev.clientX - dragStartRef.current.mouseX;
            const dy = ev.clientY - dragStartRef.current.mouseY;

            if (!hasDraggedRef.current && Math.hypot(dx, dy) > 4) {
                hasDraggedRef.current = true;
                dock.setAttribute('data-dragging', 'true');
            }

            if (hasDraggedRef.current) {
                ev.preventDefault();
                const width = dock.offsetWidth || 340;
                const height = dock.offsetHeight || 260;
                const newX = Math.max(8, Math.min(window.innerWidth - width - 8, dragStartRef.current.elementX + dx));
                const newY = Math.max(8, Math.min(window.innerHeight - height - 8, dragStartRef.current.elementY + dy));
                setPosition({ x: newX, y: newY });
            }
        };

        const handlePointerUp = () => {
            isDraggingRef.current = false;
            dock.removeAttribute('data-dragging');
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
            window.removeEventListener('pointercancel', handlePointerUp);
        };

        window.addEventListener('pointermove', handlePointerMove, { passive: false });
        window.addEventListener('pointerup', handlePointerUp);
        window.addEventListener('pointercancel', handlePointerUp);
    };

    const handleLauncherClick = () => {
        if (hasDraggedRef.current) {
            hasDraggedRef.current = false;
            return;
        }
        expand();
    };

    useEffect(() => {
        if (view !== 'expanded') return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && !event.defaultPrevented && panel.current?.contains(document.activeElement)) {
                event.preventDefault();
                setView('minimized');
                window.requestAnimationFrame(() => launcher.current?.focus({ preventScroll: true }));
            }
        };
        const onFocus = (event: FocusEvent) => {
            if (!(event.target instanceof HTMLElement) || panel.current?.contains(event.target)) return;
            const overlay = panel.current?.getBoundingClientRect();
            const target = event.target.getBoundingClientRect();
            if (overlay && target.width && target.height && target.left >= overlay.left && target.right <= overlay.right
                && target.top >= overlay.top && target.bottom <= overlay.bottom) setView('minimized');
        };
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('focusin', onFocus);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('focusin', onFocus);
        };
    }, [view]);

    const isAnalyzing = submitting || (analyzing && !guidance);

    const content = <div
        ref={dockRef}
        className="practice-guide-dock"
        data-state={view}
        onPointerDown={handlePointerDown}
        style={position ? {
            left: `${position.x}px`,
            top: `${position.y}px`,
            right: 'auto',
            bottom: 'auto',
        } : undefined}
    >
        {view === 'expanded' ? (
            <section
                ref={panel}
                id={panelId}
                className={`practice-guide practice-guide--frameless practice-guide--${mood}`}
                data-source={guidance?.source}
                data-loading={isAnalyzing ? 'true' : undefined}
                aria-labelledby={labelId}
                aria-busy={isAnalyzing ? 'true' : 'false'}
            >
                {/* 1. Khung hiển thị phía trên Mascot (Thought Cloud hoặc Speech Card) */}
                {isAnalyzing ? (
                    /* Trạng thái 1: Đang phân tích - Thought Cloud */
                    <div className="practice-thought-cloud-container">
                        <div className="practice-thought-cloud">
                            <div className="practice-speech-card__top-bar">
                                <span className="practice-thought-cloud__drag-hint">
                                    <GripHorizontal size={14} aria-hidden="true" />
                                    <span>Kéo di chuyển</span>
                                </span>
                                <div className="practice-speech-card__actions">
                                    <button ref={minimizeButton} type="button" onClick={() => collapse('minimized')} className="practice-speech-card__icon-btn" aria-label="Thu gọn gợi ý" title="Thu gọn gợi ý"><Minus size={14} aria-hidden="true" /></button>
                                    <button type="button" onClick={() => collapse('closed')} className="practice-speech-card__icon-btn" aria-label="Đóng gợi ý" title="Đóng gợi ý"><X size={14} aria-hidden="true" /></button>
                                </div>
                            </div>
                            <div className="practice-thought-cloud__bubble">
                                <span className="practice-thought-cloud__icon" aria-hidden="true">💭</span>
                                <span className="practice-thought-cloud__text">Đang phân tích</span>
                                <span className="practice-thought-cloud__dots">
                                    <span className="dot dot-1">.</span>
                                    <span className="dot dot-2">.</span>
                                    <span className="dot dot-3">.</span>
                                </span>
                            </div>
                            <p className="practice-thought-cloud__sub">
                                {submitting ? 'Đang kiểm tra mã vừa nộp và đối chiếu kết quả…' : 'Đang đọc mã và phân tích lỗi logic bằng AI…'}
                            </p>
                            <div className="practice-thought-cloud__tails" aria-hidden="true">
                                <span className="tail-dot tail-1" />
                                <span className="tail-dot tail-2" />
                                <span className="tail-dot tail-3" />
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Trạng thái 2: Hoàn tất phân tích - Speech Card trực tiếp trên Mascot */
                    <div className="practice-speech-card-container">
                        <div className="practice-speech-card">
                            <div className="practice-speech-card__top-bar">
                                <div className="practice-speech-card__badges">
                                    <GripHorizontal size={14} className="practice-speech-card__drag-icon" aria-hidden="true" />
                                    <span className={`practice-speech-card__status-badge practice-speech-card__status-badge--${guidance?.tone === 'success' ? 'success' : 'alert'}`}>
                                        {guidance?.tone === 'success' ? 'Hoàn thành tốt' : 'Kết quả chưa khớp'}
                                    </span>
                                    <span className="practice-guide__eyebrow">
                                        {submitting ? 'Đang kiểm tra' : stale ? 'Lần nộp trước' : guidance?.source === 'AI' ? 'Nhận xét AI' : guidance ? 'Từ kết quả chấm' : 'Sẵn sàng hỗ trợ'}
                                    </span>
                                </div>
                                <div className="practice-speech-card__actions">
                                    <button ref={minimizeButton} type="button" onClick={() => collapse('minimized')} className="practice-speech-card__icon-btn" aria-label="Thu gọn gợi ý" title="Thu gọn gợi ý"><Minus size={14} aria-hidden="true" /></button>
                                    <button type="button" onClick={() => collapse('closed')} className="practice-speech-card__icon-btn" aria-label="Đóng gợi ý" title="Đóng gợi ý"><X size={14} aria-hidden="true" /></button>
                                </div>
                            </div>

                            <div className="practice-guide__heading">
                                <h3 id={labelId}>{title}</h3>
                                {!submitting && !stale && guidance?.location && <span className="practice-guide__location">{guidance.location}</span>}
                            </div>

                            {stale && guidance && (
                                <p className="practice-guide__stale">Bạn đang sửa mã. Gợi ý này dựa trên lần nộp trước; nộp lại để cập nhật.</p>
                            )}

                            <div className="practice-speech-card__content">
                                {guidance ? (
                                    <>
                                        <p className="practice-speech-card__reason">{guidance.reason}</p>
                                        <div className="practice-guide__hint practice-speech-card__hint">
                                            <Lightbulb size={17} className="practice-speech-card__hint-icon" aria-hidden="true" />
                                            <div className="practice-speech-card__hint-body">
                                                <span className="practice-speech-card__hint-label">
                                                    {guidance.tone === 'success' ? 'Ghi nhớ' : 'Lời giải thích trọng tâm'}
                                                </span>
                                                <p className="practice-speech-card__hint-text">{guidance.hint}</p>
                                            </div>
                                        </div>
                                        {analyzing && <p className="practice-guide__status" role="status">Đang phân tích thêm bằng AI…</p>}
                                    </>
                                ) : error ? (
                                    <p className="practice-speech-card__reason">Máy chấm chưa trả kết quả hợp lệ. Đây là lỗi dịch vụ, chưa thể kết luận bài làm sai; mã của bạn vẫn được giữ nguyên.</p>
                                ) : analysisError ? (
                                    <p className="practice-speech-card__reason">Chưa nhận được nhận xét bổ sung. Hãy đối chiếu testcase công khai đầu tiên chưa đạt với Input, Output của đề; không cần nộp lại chỉ để đọc kết quả chấm.</p>
                                ) : (
                                    <p className="practice-speech-card__reason">Hãy tự giải <strong>{exerciseTitle}</strong>. Sau khi nộp, mình sẽ chỉ ra chỗ cần xem lại mà không đưa sẵn lời giải.</p>
                                )}
                            </div>

                            {/* Speech Bubble Arrow pointing down to Mascot */}
                            <div className="practice-speech-card__tail" aria-hidden="true" />
                        </div>
                    </div>
                )}

                {/* 2. Mascot tự do ở trung tâm bên dưới, có thể kéo để di chuyển */}
                <div
                    className="practice-guide__mascot-wrapper practice-guide__mascot-wrapper--interactive"
                    data-analyzing={isAnalyzing ? 'true' : undefined}
                    title="Kéo để di chuyển trợ giảng"
                >
                    <RabbitMascot mood={mood} />
                </div>
            </section>
        ) : (
            /* Launcher Mascot khi thu gọn: Cũng có thể kéo di chuyển hoặc click để mở */
            <button
                ref={launcher}
                type="button"
                className={`practice-guide-launcher practice-guide-launcher--mascot practice-guide-launcher--${mood}`}
                data-compact={view === 'closed' ? 'true' : undefined}
                onClick={handleLauncherClick}
                aria-label="Mở gợi ý theo bài làm"
                aria-expanded="false"
                title="Nhấn để mở gợi ý hoặc kéo để di chuyển"
            >
                <div className="practice-launcher-mascot" aria-hidden="true">
                    <img
                        src={`${import.meta.env?.BASE_URL || '/'}mascots/rabbit/${isAnalyzing ? 'thinking' : 'explaining'}.png`}
                        alt=""
                        width="84"
                        height="84"
                        className="practice-launcher-mascot__img"
                        draggable={false}
                    />
                    <div className="practice-launcher-mascot__shadow" />
                </div>
                <div className="practice-launcher-mascot__bubble" aria-hidden="true">
                    <Sparkles size={13} className="practice-launcher-mascot__sparkle" />
                    <span>Gợi ý</span>
                    {(submitting || analyzing || guidance) && <span className="practice-guide-launcher__dot" />}
                </div>
            </button>
        )}
    </div>;

    return typeof document === 'undefined' ? content : createPortal(content, document.body);
}
