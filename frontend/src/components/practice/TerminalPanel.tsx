import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { ExerciseMock, SubmitStats, TestCaseMock } from './types';

interface TerminalPanelProps {
    activeTerminalTab: 'console' | 'testcase';
    consoleOutput: string;
    submitStats: SubmitStats | null;
    testcaseResults: TestCaseMock[];
    customInput: string;
    exercise: ExerciseMock | null;
    exercisesCount: number;
    currentExerciseIdx: number;
    completedExercises: Record<string, boolean>;
    isCompleted: boolean;
    nextLessonId?: string | null;
    isRunning: boolean;
    isSubmitting: boolean;
    onTabChange: (tab: 'console' | 'testcase') => void;
    onCustomInputChange: (val: string) => void;
    onRunCode: () => void;
    onSubmitCode: () => void;
    onNextExercise: () => void;
    onCompleteWithoutExercise: () => void;
}

export const TerminalPanel: React.FC<TerminalPanelProps> = ({
    activeTerminalTab,
    consoleOutput,
    submitStats,
    testcaseResults,
    customInput,
    exercise,
    exercisesCount,
    currentExerciseIdx,
    completedExercises,
    isCompleted,
    nextLessonId,
    isRunning,
    isSubmitting,
    onTabChange,
    onCustomInputChange,
    onRunCode,
    onSubmitCode,
    onNextExercise,
    onCompleteWithoutExercise
}) => {
    const navigate = useNavigate();

    return (
        <div className="bg-bg-secondary rounded-xl border border-border-custom flex flex-col overflow-hidden h-full mt-1 transition-colors duration-200">
            {/* Tabs Terminal */}
            <div className="flex justify-between items-center border-b border-border-custom bg-bg-tertiary px-4 shrink-0 transition-colors duration-200">
                <div className="flex">
                    <button
                        className={`py-2 px-3 text-xs font-semibold border-b-2 transition-all ${
                            activeTerminalTab === 'console'
                                ? 'border-accent-custom text-text-primary bg-bg-secondary/10'
                                : 'border-transparent text-text-tertiary hover:text-text-primary'
                        }`}
                        onClick={() => onTabChange('console')}
                    >
                        Bảng điều khiển
                    </button>
                    <button
                        className={`py-2 px-3 text-xs font-semibold border-b-2 transition-all ${
                            activeTerminalTab === 'testcase'
                                ? 'border-accent-custom text-text-primary bg-bg-secondary/10'
                                : 'border-transparent text-text-tertiary hover:text-text-primary'
                        }`}
                        onClick={() => onTabChange('testcase')}
                    >
                        Dữ liệu Testcase
                    </button>
                </div>
            </div>

            {/* Nội dung Tab Terminal */}
            <div className="flex-1 overflow-y-auto p-4 font-mono text-xs text-left bg-pre-bg transition-colors duration-200">
                {activeTerminalTab === 'console' ? (
                    <div className="flex flex-col gap-2">
                        {/* Hiển thị stdout / lỗi */}
                        <pre className="whitespace-pre-wrap leading-relaxed text-text-secondary m-0 select-text">
                            {consoleOutput}
                        </pre>

                        {/* Hiển thị biểu đồ phân phối Leetcode Beats */}
                        {submitStats && (
                            <div className="mt-3 bg-bg-secondary/60 border border-border-custom rounded-xl p-3.5 flex flex-col gap-3 transition-colors duration-200">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] text-text-tertiary font-bold uppercase tracking-wider">
                                        Kết quả xếp hạng (LeetCode Stats):
                                    </span>
                                    <div className="flex items-baseline gap-5 mt-1 font-sans">
                                        <div>
                                            <span className="text-[10px] text-text-tertiary">Thời gian chạy:</span>
                                            <div className="text-lg font-black text-emerald-400">{submitStats.runtimeMs} ms</div>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-text-tertiary">Độ hiệu quả:</span>
                                            <div className="text-lg font-black text-accent-custom">Nhanh hơn {submitStats.runtimeBeats}%</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Biểu đồ phân phối */}
                                <div className="flex flex-col gap-1.5 mt-1">
                                    <span className="text-[9px] text-text-tertiary font-semibold">
                                        Phân phối thời gian chạy của cộng đồng (Runtime Distribution):
                                    </span>
                                    <div className="h-20 flex items-end justify-between gap-1 border-b border-border-custom pb-0.5 pt-2">
                                        {submitStats.distribution.map((bar) => {
                                            const maxCount = Math.max(...submitStats.distribution.map((d) => d.count)) || 1;
                                            const heightPercent = (bar.count / maxCount) * 100;

                                            const isUserBucket =
                                                (submitStats.runtimeMs <= 20 && bar.range === '10-20ms') ||
                                                (submitStats.runtimeMs > 20 && submitStats.runtimeMs <= 30 && bar.range === '20-30ms') ||
                                                (submitStats.runtimeMs > 30 && submitStats.runtimeMs <= 40 && bar.range === '30-40ms') ||
                                                (submitStats.runtimeMs > 40 && submitStats.runtimeMs <= 50 && bar.range === '40-50ms') ||
                                                (submitStats.runtimeMs > 50 && submitStats.runtimeMs <= 60 && bar.range === '50-60ms') ||
                                                (submitStats.runtimeMs > 60 && submitStats.runtimeMs <= 70 && bar.range === '60-70ms') ||
                                                (submitStats.runtimeMs > 70 && submitStats.runtimeMs <= 80 && bar.range === '70-80ms') ||
                                                (submitStats.runtimeMs > 80 && bar.range === '80ms+');

                                            return (
                                                <div key={bar.range} className="flex-1 flex flex-col items-center gap-0.5 group relative h-full justify-end">
                                                    <div
                                                        style={{ height: `${Math.max(10, heightPercent)}%` }}
                                                        className={`w-full rounded-t transition-all duration-300 ${
                                                            isUserBucket
                                                                ? 'bg-accent-custom shadow-lg shadow-accent-custom/30'
                                                                : 'bg-text-tertiary/10 group-hover:bg-text-tertiary/30'
                                                        }`}
                                                    />
                                                    {/* Tooltip */}
                                                    <div className="absolute bottom-full mb-1 bg-bg-primary border border-border-custom px-2 py-0.5 rounded text-[8px] text-text-primary opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                                        {bar.count} bài ({bar.range})
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="flex justify-between text-[7px] text-text-tertiary mt-0.5 px-0.5 font-sans">
                                        <span>10ms</span>
                                        <span>30ms</span>
                                        <span>50ms</span>
                                        <span>70ms</span>
                                        <span>90ms+</span>
                                    </div>
                                    <div className="text-[9px] text-text-tertiary italic mt-1 flex items-center gap-1.5 justify-center font-sans">
                                        <span className="w-2 h-2 bg-accent-custom rounded-sm inline-block"></span>
                                        <span>Bài nộp của bạn ({submitStats.runtimeMs}ms)</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Hiển thị chi tiết testcase kết quả nếu có */}
                        {testcaseResults.length > 0 && (
                            <div className="mt-3 flex flex-col gap-2">
                                <span className="text-text-tertiary font-bold border-b border-border-custom pb-1">
                                    Kết quả kiểm tra chi tiết:
                                </span>
                                {testcaseResults.map((tc, index) => (
                                    <div key={tc.id} className="bg-bg-secondary border border-border-custom p-2 rounded-lg flex flex-col gap-1.5">
                                        <div className="flex justify-between items-center">
                                            <span className="text-text-primary font-semibold">Testcase {index + 1}</span>
                                            <span
                                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                                    tc.passed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                                                }`}
                                            >
                                                {tc.passed ? 'PASSED' : 'FAILED'}
                                            </span>
                                        </div>
                                        <div className="text-[10px] text-text-tertiary font-mono">
                                            <div>Input: <code className="text-text-primary">{tc.input || 'Không có'}</code></div>
                                            <div>Expected: <code className="text-emerald-400">{tc.expectedOutput}</code></div>
                                            <div>Actual: <code className={tc.passed ? 'text-emerald-400' : 'text-rose-400'}>{tc.actualOutput || 'N/A'}</code></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col gap-3 font-sans">
                        <div className="flex flex-col gap-1">
                            <span className="text-text-tertiary">Custom Input (Nhập dữ liệu kiểm thử):</span>
                            <textarea
                                className="bg-bg-secondary border border-border-custom rounded-lg p-2.5 text-text-primary outline-none focus:border-accent-custom/50 resize-none font-mono"
                                rows={3}
                                value={customInput}
                                onChange={(e) => onCustomInputChange(e.target.value)}
                            />
                        </div>
                        <div className="text-[11px] text-text-tertiary/80 leading-normal">
                            * Dữ liệu Custom Input sẽ được cấp vào hàm <code>input()</code> của chương trình khi bấm nút "Chạy thử".
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom action buttons */}
            <div className="border-t border-border-custom bg-bg-secondary px-4 py-3 flex justify-between items-center shrink-0 transition-colors duration-200">
                <span className="text-[10px] text-text-tertiary font-sans">
                    Nhấn Nộp bài để kiểm tra toàn bộ testcases
                </span>
                <div className="flex gap-2">
                    {exercise && (
                        <button
                            className="bg-bg-tertiary hover:bg-bg-tertiary/85 text-text-primary border border-border-custom px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer active:scale-95 transition-all disabled:opacity-50 font-sans"
                            onClick={onRunCode}
                            disabled={isRunning || isSubmitting}
                        >
                            {isRunning ? 'Đang chạy...' : 'Chạy thử'}
                        </button>
                    )}
                    {exercise && completedExercises[exercise.id] && currentExerciseIdx < exercisesCount - 1 && (
                        <button
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-lg text-xs font-bold cursor-pointer active:scale-95 transition-all border-none font-sans"
                            onClick={onNextExercise}
                        >
                            Bài tập tiếp theo →
                        </button>
                    )}
                    {isCompleted && nextLessonId ? (
                        <button
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-lg text-xs font-bold cursor-pointer active:scale-95 transition-all animate-pulse border-none font-sans"
                            onClick={() => navigate(`/lesson/${nextLessonId}`)}
                        >
                            Bài học tiếp theo →
                        </button>
                    ) : isCompleted ? (
                        <button
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-lg text-xs font-bold cursor-pointer active:scale-95 transition-all border-none font-sans"
                            onClick={() => navigate('/dashboard')}
                        >
                            Quay lại Dashboard 🎉
                        </button>
                    ) : exercise ? (
                        <button
                            className="bg-accent-custom hover:bg-accent-hover text-white dark:text-[#030303] px-5 py-2 rounded-lg text-xs font-bold cursor-pointer active:scale-95 transition-all disabled:opacity-50 border-none font-sans"
                            onClick={onSubmitCode}
                            disabled={isRunning || isSubmitting}
                        >
                            {isSubmitting ? 'Đang nộp...' : 'Nộp bài'}
                        </button>
                    ) : (
                        <button
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-lg text-xs font-bold cursor-pointer active:scale-95 transition-all border-none font-sans"
                            onClick={onCompleteWithoutExercise}
                        >
                            Hoàn thành
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
