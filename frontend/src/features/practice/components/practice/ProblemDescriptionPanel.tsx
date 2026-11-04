import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import type { ExerciseMock, SubmissionItem } from './types';

function markdownAttributes<T extends {node?:unknown}>(props:T){
    const {node,...attributes}=props;
    void node; // ReactMarkdown AST metadata is not a DOM attribute.
    return attributes;
}

interface ProblemDescriptionPanelProps {
    lessonId: string;
    isBusy?: boolean;
    adaptiveMode: boolean;
    exercises: ExerciseMock[];
    currentExerciseIdx: number;
    exercise: ExerciseMock | null;
    completedExercises: Record<string, boolean>;
    activeLeftTab: 'desc' | 'submissions';
    submissions: SubmissionItem[];
    onSelectExercise: (index: number) => void;
    onTabChange: (tab: 'desc' | 'submissions') => void;
    onRestoreCode: (code: string) => void;
}

export const ProblemDescriptionPanel: React.FC<ProblemDescriptionPanelProps> = ({
    lessonId,
    isBusy=false,
    adaptiveMode,
    exercises,
    currentExerciseIdx,
    exercise,
    completedExercises,
    activeLeftTab,
    submissions,
    onSelectExercise,
    onTabChange,
    onRestoreCode
}) => {
    const navigate = useNavigate();

    return (
        <div className="bg-bg-secondary rounded-xl border border-border-custom flex flex-col overflow-hidden h-full mr-1 transition-colors duration-200">
            {/* Tabs cột trái */}
            <div className="flex justify-between items-center border-b border-border-custom bg-bg-tertiary shrink-0 px-2 transition-colors duration-200">
                <button
                    className="text-xs text-accent-custom hover:text-accent-hover bg-transparent border-none cursor-pointer py-2.5 px-2 font-semibold flex items-center gap-1 transition-colors"
                    onClick={() => {
                        if (window.history.length > 1) {
                            navigate(-1);
                        } else {
                            navigate(`/lesson/${lessonId}`);
                        }
                    }}
                >
                    <span>←</span> Quay lại
                </button>

                <div className="flex gap-1">
                    {exercise && (
                        <button
                            className={`px-3 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                                activeLeftTab === 'desc'
                                    ? 'border-accent-custom text-text-primary bg-bg-secondary/10'
                                    : 'border-transparent text-text-tertiary hover:text-text-primary'
                            }`}
                            onClick={() => onTabChange('desc')}
                        >
                            Đề bài bài tập
                        </button>
                    )}
                    <button
                        className={`px-3 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                            activeLeftTab === 'submissions'
                                ? 'border-accent-custom text-text-primary bg-bg-secondary/10'
                                : 'border-transparent text-text-tertiary hover:text-text-primary'
                        }`}
                        onClick={() => onTabChange('submissions')}
                    >
                        Lịch sử nộp bài
                    </button>
                </div>
            </div>

            {/* Nội dung cột trái */}
            <div className="flex-1 overflow-y-auto p-5 text-sm leading-relaxed text-left select-text">
                {activeLeftTab === 'desc' && exercise ? (
                    <div className="flex flex-col gap-4">
                        {/* Selector các bài tập con */}
                        {!adaptiveMode && exercises.length > 1 && (
                            <div className="flex flex-wrap gap-1.5 p-1 bg-bg-tertiary border border-border-custom rounded-xl select-none mb-1">
                                {exercises.map((ex, index) => {
                                    const isSelected = index === currentExerciseIdx;
                                    const isExCompleted = completedExercises[ex.id];
                                    return (
                                        <button
                                            key={ex.id}
                                            className={`flex-1 min-w-[75px] py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all border-none cursor-pointer text-center flex items-center justify-center gap-1 ${
                                                isSelected
                                                    ? 'bg-accent-custom text-white dark:text-[#030303] shadow'
                                                    : 'bg-transparent text-text-tertiary hover:text-text-primary'
                                            }`}
                                            disabled={isBusy}
                                            onClick={() => onSelectExercise(index)}
                                        >
                                            <span>Bài {index + 1}</span>
                                            {isExCompleted && <span className="text-emerald-500 font-extrabold text-xs">✓</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {adaptiveMode && (
                            <div className="text-xs font-semibold text-accent-custom" aria-label="Bài tập được đề xuất">
                                Bài tập được đề xuất cho bạn
                            </div>
                        )}

                        {/* Tiêu đề & Độ khó */}
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-bold text-text-primary m-0">{exercise.title}</h2>
                            <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                                    exercise.difficulty === 'EASY'
                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                        : exercise.difficulty === 'MEDIUM'
                                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                }`}
                            >
                                {exercise.difficulty}
                            </span>
                        </div>
                        <hr className="border-border-custom my-1" />

                        {/* Markdown Renderer */}
                        <div className="select-text">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                                components={{
                                    h3: (props) => <h3 className="text-sm font-bold text-text-primary mt-4 mb-2 flex items-center gap-1.5" {...markdownAttributes(props)} />,
                                    h4: (props) => <h4 className="text-xs font-bold text-text-primary mt-3 mb-1" {...markdownAttributes(props)} />,
                                    blockquote: (props) => <blockquote className="border-l-4 border-accent-custom bg-accent-bg/40 pl-3 py-1.5 my-2.5 rounded-r text-xs text-text-secondary" {...markdownAttributes(props)} />,
                                    ul: (props) => <ul className="list-disc pl-5 mb-3 text-xs md:text-sm text-text-secondary flex flex-col gap-1" {...markdownAttributes(props)} />,
                                    li: (props) => <li className="mb-0.5" {...markdownAttributes(props)} />,
                                    details: (props) => <details className="my-3 p-3.5 rounded-xl border border-border-custom bg-bg-tertiary/40 text-xs md:text-sm transition-all" {...markdownAttributes(props)} />,
                                    summary: (props) => <summary className="font-semibold text-text-primary hover:text-accent-custom cursor-pointer select-none transition-colors mb-2" {...markdownAttributes(props)} />,
                                    code: ({ className, children, ...props }) => {
                                        const contentStr = String(children || '');
                                        const hasNewline = contentStr.includes('\n');
                                        const match = /language-(\w+)/.exec(className || '');
                                        const isInline = !match && !hasNewline;

                                        return isInline ? (
                                            <code className="bg-accent-bg text-accent-custom border border-accent-border px-1.5 py-0.5 rounded font-mono text-[11px] md:text-xs" {...markdownAttributes(props)}>
                                                {children}
                                            </code>
                                        ) : (
                                            <pre className="bg-pre-bg border border-border-custom p-3 rounded-lg overflow-x-auto text-[11px] md:text-xs font-mono my-3 text-text-secondary select-text">
                                                <code className={className} {...markdownAttributes(props)}>
                                                    {children}
                                                </code>
                                            </pre>
                                        );
                                    },
                                    table: (props) => (
                                        <div className="overflow-x-auto w-full border border-border-custom rounded-xl my-4">
                                            <table className="w-full text-xs text-left border-collapse" {...markdownAttributes(props)} />
                                        </div>
                                    ),
                                    thead: (props) => <thead className="bg-bg-tertiary border-b border-border-custom" {...markdownAttributes(props)} />,
                                    tbody: (props) => <tbody className="divide-y divide-border-custom" {...markdownAttributes(props)} />,
                                    tr: (props) => <tr className="hover:bg-bg-tertiary/30" {...markdownAttributes(props)} />,
                                    th: (props) => <th className="p-2.5 font-semibold text-text-primary border-r border-border-custom last:border-r-0" {...markdownAttributes(props)} />,
                                    td: (props) => <td className="p-2.5 text-text-secondary border-r border-border-custom/50 last:border-r-0" {...markdownAttributes(props)} />
                                }}
                            >
                                {(exercise.problemDescription || '').replace(/<!--\s*CONSTRAINTS:[\s\S]*?-->/g, '').trim()}
                            </ReactMarkdown>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        <h3 className="text-sm font-bold text-text-primary mb-1">Lịch sử nộp bài</h3>
                        {submissions.length === 0 ? (
                            <div className="text-text-tertiary text-center py-10 text-xs">
                                Chưa có bài nộp nào được ghi nhận.
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-1">
                                {submissions.map((sub) => (
                                    <div key={sub.id} className="bg-bg-tertiary border border-border-custom p-3 rounded-xl flex flex-col gap-2 transition-colors duration-200 hover:border-accent-custom/40">
                                        <div className="flex justify-between items-center">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                                sub.status === 'PASSED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                                            }`}>
                                                {sub.status === 'PASSED' ? 'THÀNH CÔNG' : 'THẤT BẠI'}
                                            </span>
                                            <span className="text-[10px] text-text-tertiary">
                                                {new Date(sub.submittedAt).toLocaleString('vi-VN')}
                                            </span>
                                        </div>
                                        <div className="text-xs text-text-secondary flex justify-between items-center">
                                            <span>Thời gian chạy: <span className="font-semibold text-text-primary">{sub.runtime ? `${sub.runtime}ms` : 'N/A'}</span></span>
                                            <button
                                                onClick={() => onRestoreCode(sub.code)}
                                                className="text-[10px] bg-bg-secondary hover:bg-border-custom text-accent-custom hover:text-accent-hover px-2.5 py-1 rounded border border-border-custom transition-all"
                                            >
                                                Khôi phục Code
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
