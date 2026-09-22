import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import axios from 'axios';
import { stripQuizSectionFromMarkdown } from '../../../utils/quizParser';
import { LessonContentRenderer } from '../../lesson/components/lesson/LessonContentRenderer';
import { API_BASE_URL } from '../../../config/api';

interface Quiz {
    id: string;
    question: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctOption: 'A' | 'B' | 'C' | 'D';
    explanation: string;
}

interface TestCase {
    id: string;
    input: string;
    expectedOutput: string;
    isHidden: boolean;
}

interface Exercise {
    id: string;
    title: string;
    difficulty: string;
    problemDescription: string;
    starterCode: string;
    solutionCode?: string;
    language?: string;
    testCases: TestCase[];
}

interface Lesson {
    id: string;
    orderIndex: number;
    title: string;
    targetSkillId: string;
    theoryContent: string;
    isCompleted: boolean;
    quizzes: Quiz[];
    exercise?: Exercise;
}

interface PersonalizedLessonViewerProps {
    lesson: Lesson;
    token: string;
    onLessonCompleted?: () => void;
}

export function cleanChineseArtifacts(text: any): any {
    if (!text || typeof text !== 'string') return text;
    return text
        .replace(/在这里写代码|在此处编写代码|在下方编写代码|在下方写代码|请在此处编写代码/g, 'Viết mã tại đây')
        .replace(/写代码|编写代码/g, 'Viết mã')
        .replace(/你的代码/g, 'Mã của bạn')
        .replace(/代码/g, 'mã nguồn')
        .replace(/输入/g, 'Đầu vào')
        .replace(/输出/g, 'Đầu ra')
        .replace(/[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/g, '');
}

function getStandardizedTheory(lesson: Lesson): string {
    // Show the actual generated/curated lesson, without fabricated execution traces or solutions.
    return stripQuizSectionFromMarkdown(lesson.theoryContent || '');
}

export const PersonalizedLessonViewer: React.FC<PersonalizedLessonViewerProps> = ({
    lesson,
    token,
    onLessonCompleted
}) => {
    const [activeTab, setActiveTab] = useState<'THEORY' | 'QUIZ' | 'PRACTICE'>('THEORY');
    
    // Quiz States
    const [quizAnswers, setQuizAnswers] = useState<{ [quizId: string]: 'A' | 'B' | 'C' | 'D' }>({});
    const [quizResults, setQuizResults] = useState<{ [quizId: string]: { isCorrect: boolean; explanation: string } }>({});
    
    // Language detection for Editor & Code
    const rawLang = String(lesson.exercise?.language || '').toUpperCase();
    const isCpp = rawLang === 'CPP' || rawLang.includes('C++') || (lesson.exercise?.starterCode && /#include\s*<|std::/i.test(lesson.exercise.starterCode));
    const isJs = !isCpp && (rawLang === 'JAVASCRIPT' || rawLang.includes('JS') || (lesson.exercise?.starterCode && /console\.log|function\s*\(|let\s+|const\s+/i.test(lesson.exercise.starterCode)));
    const monacoLang = rawLang === 'SQL' ? 'sql' : isCpp ? 'cpp' : (isJs ? 'javascript' : 'python');
    const fileLabel = rawLang === 'SQL' ? 'solution.sql (SQLite)' : isCpp ? 'solution.cpp (C++17)' : (isJs ? 'solution.js (Node.js)' : 'solution.py (Python 3)');
    const defaultStarter = isCpp 
        ? '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Code của bạn tại đây\n    return 0;\n}'
        : (isJs ? '// Viết code JavaScript tại đây\n' : 'def solution():\n    pass');

    // Practice States
    const [code, setCode] = useState<string>(lesson.exercise?.starterCode || defaultStarter);
    const [submittingCode, setSubmittingCode] = useState<boolean>(false);
    const [executionOutput, setExecutionOutput] = useState<any>(null);

    React.useEffect(() => {
        if (lesson.exercise?.starterCode) {
            setCode(lesson.exercise.starterCode);
        } else {
            setCode(defaultStarter);
        }
        setExecutionOutput(null);
    }, [lesson.exercise?.id, lesson.exercise?.starterCode, defaultStarter]);

    const handleSelectQuizOption = (quizId: string, option: 'A' | 'B' | 'C' | 'D') => {
        setQuizAnswers(prev => ({ ...prev, [quizId]: option }));
    };

    const handleCheckQuiz = async (quizId: string) => {
        const selectedOption = quizAnswers[quizId];
        if (!selectedOption) return;

        try {
            const res = await axios.post(
                `${API_BASE_URL}/api/learning-path/submit-quiz`,
                { quizId, selectedOption },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                setQuizResults(prev => ({
                    ...prev,
                    [quizId]: {
                        isCorrect: res.data.isCorrect,
                        explanation: res.data.explanation
                    }
                }));
            }
        } catch (e) {
            console.error('Quiz submit error:', e);
        }
    };

    const handleSubmitExercise = async () => {
        if (!lesson.exercise) return;
        setSubmittingCode(true);
        setExecutionOutput(null);

        try {
            const res = await axios.post(
                `${API_BASE_URL}/api/learning-path/submit-exercise`,
                {
                    exerciseId: lesson.exercise.id,
                    submissionId: crypto.randomUUID(),
                    code
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                setExecutionOutput(res.data);
                if (res.data.isPassed) {
                    // Mastery is updated once by the server from the verified submission.
                    if (onLessonCompleted) {
                        onLessonCompleted();
                    }
                }
            }
        } catch (e: any) {
            console.error('Exercise submit error:', e);
            setExecutionOutput({
                isPassed: false,
                error: e.response?.data?.error || 'Lỗi khi nộp bài thực hành'
            });
        } finally {
            setSubmittingCode(false);
        }
    };

    const resolvedTheory = getStandardizedTheory(lesson);

    return (
        <div className="rounded-2xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-200">
            {/* Header Navigation Tabs - Clean, Bright, Non-AI-Slop */}
            <div className="flex flex-wrap items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-[#080C14] px-6 py-3.5 gap-4">
                <div className="inline-flex p-1 bg-slate-200/70 dark:bg-[#121826] rounded-xl gap-1">
                    <button
                        onClick={() => setActiveTab('THEORY')}
                        className={`px-4 py-2 rounded-lg font-bold text-xs tracking-wide transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                            activeTab === 'THEORY'
                                ? 'bg-white dark:bg-blue-600 text-blue-700 dark:text-white shadow-sm font-extrabold'
                                : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50'
                        }`}
                    >
                        <span>📖 1. Nội Dung Bài Học</span>
                    </button>
                    
                    {Array.isArray(lesson.quizzes) && lesson.quizzes.length > 0 && (
                        <button
                            onClick={() => setActiveTab('QUIZ')}
                            className={`px-4 py-2 rounded-lg font-bold text-xs tracking-wide transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                                activeTab === 'QUIZ'
                                    ? 'bg-white dark:bg-blue-600 text-blue-700 dark:text-white shadow-sm font-extrabold'
                                    : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50'
                            }`}
                        >
                            <span>❓ 2. Trắc Nghiệm ({lesson.quizzes.length})</span>
                        </button>
                    )}

                    {lesson.exercise && (
                        <button
                            onClick={() => setActiveTab('PRACTICE')}
                            className={`px-4 py-2 rounded-lg font-bold text-xs tracking-wide transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                                activeTab === 'PRACTICE'
                                    ? 'bg-white dark:bg-emerald-600 text-emerald-700 dark:text-white shadow-sm font-extrabold'
                                    : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50'
                            }`}
                        >
                            <span>⚡ {Array.isArray(lesson.quizzes) && lesson.quizzes.length > 0 ? '3.' : '2.'} Thực Hành Lập Trình</span>
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-cyan-400 bg-slate-100 dark:bg-cyan-950/40 px-3 py-1 rounded-full border border-slate-300 dark:border-cyan-500/30">
                        {lesson.targetSkillId}
                    </span>
                </div>
            </div>

            {/* TAB 1: Nội Dung Bài Học Chuẩn (LessonContentRenderer v1.0 Standard) */}
            {activeTab === 'THEORY' && (
                <div className="p-6 sm:p-10 bg-white dark:bg-[#0f172a] text-slate-800 dark:text-slate-100">
                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* Standard Textbook Lesson Renderer */}
                        <div className="select-text">
                            <LessonContentRenderer content={resolvedTheory} />
                        </div>

                        {/* Bottom Action Button */}
                        <div className="pt-8 mt-8 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                            <button
                                onClick={() => setActiveTab(Array.isArray(lesson.quizzes) && lesson.quizzes.length > 0 ? 'QUIZ' : 'PRACTICE')}
                                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold tracking-wide shadow-sm transition-all duration-200 hover:shadow active:scale-[0.99] cursor-pointer"
                            >
                                <span>{Array.isArray(lesson.quizzes) && lesson.quizzes.length > 0 ? 'Tiếp Tục: Làm Trắc Nghiệm Củng Cố' : 'Bắt Đầu Thực Hành Lập Trình'}</span>
                                <span>➔</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: Trắc Nghiệm Củng Cố */}
            {activeTab === 'QUIZ' && (
                <div className="p-6 sm:p-8 bg-slate-50/60 dark:bg-[#080C14] max-h-[75vh] overflow-y-auto space-y-6">
                    {lesson.quizzes.map((q, idx) => {
                        const result = quizResults[q.id];
                        const selected = quizAnswers[q.id];

                        return (
                            <div key={q.id} className="bg-white dark:bg-[#0E1422] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
                                <div className="flex items-start gap-3">
                                    <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-xs font-mono font-bold shrink-0">
                                        CÂU {idx + 1}
                                    </span>
                                    <div className="text-sm md:text-base font-bold text-slate-800 dark:text-white leading-snug flex-1">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {q.question}
                                        </ReactMarkdown>
                                    </div>
                                </div>

                                {/* Options */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                                    {(['A', 'B', 'C', 'D'] as const).map(optKey => {
                                        const optionText = q[`option${optKey}` as keyof Quiz] as string;
                                        if (!optionText) return null;

                                        const isSelected = selected === optKey;
                                        return (
                                            <button
                                                key={optKey}
                                                onClick={() => handleSelectQuizOption(q.id, optKey)}
                                                className={`p-3.5 rounded-xl border text-left text-xs md:text-sm font-medium transition-all duration-150 flex items-center gap-3 cursor-pointer ${
                                                    isSelected
                                                        ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 font-semibold shadow-sm'
                                                        : 'border-slate-200 dark:border-slate-700/60 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:border-slate-400 hover:bg-slate-50'
                                                }`}
                                            >
                                                <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                                                    isSelected
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300'
                                                }`}>
                                                    {optKey}
                                                </span>
                                                <span className="flex-1">{optionText}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Action & Result */}
                                <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-4">
                                    <button
                                        onClick={() => handleCheckQuiz(q.id)}
                                        disabled={!selected}
                                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-bold tracking-wide shadow-sm transition-all cursor-pointer"
                                    >
                                        Kiểm Tra Đáp Án
                                    </button>

                                    {result && (
                                        <span className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
                                            result.isCorrect
                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                                        }`}>
                                            {result.isCorrect ? '✓ CHÍNH XÁC' : '✗ CHƯA CHÍNH XÁC'}
                                        </span>
                                    )}
                                </div>

                                {result && (
                                    <div className="mt-3 p-4 bg-slate-50 dark:bg-[#0A0D15] border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-700 dark:text-gray-300 leading-relaxed space-y-1">
                                        <p className="font-bold text-blue-700 dark:text-cyan-400 flex items-center gap-1.5">
                                            💡 Giải thích chi tiết:
                                        </p>
                                        <p className="pl-4 border-l-2 border-blue-400">
                                            {result.explanation}
                                        </p>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {lesson.exercise && (
                        <div className="pt-4 flex justify-end">
                            <button
                                onClick={() => setActiveTab('PRACTICE')}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold tracking-wide shadow-sm transition-all cursor-pointer"
                            >
                                <span>Chuyển Sang Thực Hành Lập Trình</span>
                                <span>➔</span>
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* TAB 3: Thực Hành Code (Clean Sandbox) */}
            {activeTab === 'PRACTICE' && lesson.exercise && (
                <div className="p-6 sm:p-8 bg-slate-50/40 dark:bg-[#080C14] space-y-6">
                    {/* Problem Description Card - Crisp White / High Contrast */}
                    <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
                            <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                                <span>💻</span> {lesson.exercise.title}
                            </h3>
                            <span className={`text-[11px] font-bold uppercase px-3 py-1 rounded-full border ${
                                lesson.exercise.difficulty === 'EASY'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : lesson.exercise.difficulty === 'HARD'
                                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                                {lesson.exercise.difficulty}
                            </span>
                        </div>

                        <div className="text-slate-800 dark:text-slate-200 leading-relaxed text-sm">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    h1: ({ ...props }) => <h1 className="text-base font-bold text-slate-900 dark:text-white mt-4 mb-2 border-b pb-1" {...props} />,
                                    h2: ({ ...props }) => <h2 className="text-sm font-bold text-slate-900 dark:text-white mt-3 mb-2" {...props} />,
                                    h3: ({ ...props }) => <h3 className="text-xs font-bold text-slate-900 dark:text-white mt-3 mb-1.5" {...props} />,
                                    p: ({ ...props }) => <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed mb-3" {...props} />,
                                    ul: ({ ...props }) => <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-200 text-sm mb-3 pl-2" {...props} />,
                                    ol: ({ ...props }) => <ol className="list-decimal list-inside space-y-1 text-slate-700 dark:text-slate-200 text-sm mb-3 pl-2" {...props} />,
                                    li: ({ ...props }) => <li className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed" {...props} />,
                                    code: ({ className, children, ...props }) => {
                                        const contentStr = String(children || '');
                                        const hasNewline = contentStr.includes('\n');
                                        return !hasNewline ? (
                                            <code className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-emerald-300 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded font-mono text-xs font-semibold mx-0.5" {...props}>
                                                {children}
                                            </code>
                                        ) : (
                                            <pre className="p-3 my-2 bg-slate-900 text-emerald-300 rounded-lg overflow-x-auto text-xs font-mono">
                                                <code className={className} {...props}>
                                                    {children}
                                                </code>
                                            </pre>
                                        );
                                    }
                                }}
                            >
                                {lesson.exercise.problemDescription}
                            </ReactMarkdown>
                        </div>

                        {/* Test Cases Preview */}
                        {lesson.exercise.testCases && lesson.exercise.testCases.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                        🧪 Test Cases Kiểm Thử ({lesson.exercise.testCases.length} kịch bản):
                                    </span>
                                    <span className="text-[10px] text-slate-500 font-mono bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded">
                                        {lesson.exercise.testCases.filter(t => t.isHidden).length} Test case ẩn
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                    {lesson.exercise.testCases.map((tc, tcIdx) => (
                                        <div key={tc.id || tcIdx} className="bg-slate-50 dark:bg-[#131b2e] p-3 rounded-lg border border-slate-200 dark:border-slate-700/60 font-mono text-xs space-y-1">
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-700 dark:text-cyan-400 font-bold text-[11px]">Kịch Bản #{tcIdx + 1}</span>
                                                {tc.isHidden ? (
                                                    <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[10px]">Ẩn</span>
                                                ) : (
                                                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">Công Khai</span>
                                                )}
                                            </div>
                                            <div className="text-slate-800 dark:text-slate-200 break-all text-[11px]">
                                                <span className="text-slate-500 font-sans">Đầu vào:</span> <span className="font-semibold">{tc.input}</span>
                                            </div>
                                            {!tc.isHidden && (
                                                <div className="text-slate-800 dark:text-slate-200 break-all text-[11px]">
                                                    <span className="text-slate-500 font-sans">Kỳ vọng:</span> <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{tc.expectedOutput}</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Monaco Editor Container - Clean Frame */}
                    <div className="rounded-xl border border-slate-300 dark:border-slate-700 overflow-hidden shadow-sm bg-[#1e1e1e]">
                        <div className="bg-[#252526] px-5 py-2.5 border-b border-[#333333] flex justify-between items-center select-none">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                                <span className="ml-2 text-xs font-mono font-semibold text-slate-300">{fileLabel}</span>
                            </div>
                            <button
                                onClick={handleSubmitExercise}
                                disabled={submittingCode}
                                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold tracking-wide shadow-sm transition-all cursor-pointer"
                            >
                                {submittingCode ? (
                                    <>
                                        <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin inline-block" />
                                        <span>Đang Chấm...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>🚀 Nộp Bài Thực Hành</span>
                                    </>
                                )}
                            </button>
                        </div>

                        <Editor
                            height="340px"
                            language={monacoLang}
                            theme="vs-dark"
                            value={code}
                            onChange={(val) => setCode(val || '')}
                            options={{
                                fontSize: 13,
                                fontFamily: "'Fira Code', 'Geist Mono', Consolas, monospace",
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                padding: { top: 14, bottom: 14 }
                            }}
                        />
                    </div>

                    {/* Test Execution Output */}
                    {executionOutput && (
                        <div className={`p-5 rounded-xl border transition-all ${
                            executionOutput.isPassed
                                ? 'bg-emerald-50/80 dark:bg-[#090E18] border-emerald-300 dark:border-emerald-500/40 shadow-sm'
                                : 'bg-rose-50/80 dark:bg-[#090E18] border-rose-300 dark:border-rose-500/40 shadow-sm'
                        }`}>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
                                    <h4 className={`font-bold text-sm md:text-base flex items-center gap-2 ${
                                        executionOutput.isPassed ? 'text-emerald-800 dark:text-emerald-400' : 'text-rose-800 dark:text-rose-400'
                                    }`}>
                                        {executionOutput.isPassed ? '🎉 HOÀN THÀNH: VƯỢT QUA 100% TEST CASES!' : '❌ KẾT QUẢ: CHƯA ĐẠT CHUẨN'}
                                    </h4>
                                    <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${
                                        executionOutput.isPassed 
                                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                                            : 'bg-rose-100 text-rose-800 border-rose-300'
                                    }`}>
                                        Điểm: {executionOutput.score || 0}/100
                                    </span>
                                </div>

                                {executionOutput.error && (
                                    <div className="p-3 bg-rose-100/70 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-500/30 rounded-lg text-xs text-rose-800 dark:text-rose-300 font-mono">
                                        {executionOutput.error}
                                    </div>
                                )}

                                {executionOutput.results && (
                                    <div className="space-y-2.5 pt-1">
                                        {executionOutput.results.map((res: any, i: number) => (
                                            <div key={i} className={`text-xs p-3.5 rounded-lg border font-mono transition-all ${
                                                res.passed 
                                                    ? 'bg-white dark:bg-[#0e1726] border-emerald-300 dark:border-emerald-500/30 text-slate-800 dark:text-slate-200' 
                                                    : 'bg-white dark:bg-[#180e14] border-rose-300 dark:border-rose-500/40 text-slate-800 dark:text-slate-200'
                                            }`}>
                                                <div className="flex justify-between items-center mb-1.5">
                                                    <span className="font-bold text-slate-800 dark:text-cyan-300">
                                                        Testcase #{i + 1}
                                                    </span>
                                                    <span className={`font-mono font-bold text-[11px] px-2.5 py-0.5 rounded border ${
                                                        res.passed
                                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                            : 'bg-rose-50 text-rose-700 border-rose-200'
                                                    }`}>
                                                        {res.passed ? 'PASSED ✓' : 'FAILED ✗'}
                                                    </span>
                                                </div>

                                                <div className="space-y-1 text-[11px]">
                                                    <div>
                                                        <span className="text-slate-500 font-sans">Đầu vào: </span>
                                                        <code className="text-slate-900 dark:text-yellow-300 bg-slate-100 dark:bg-white/5 px-1.5 py-0.5 rounded font-bold">{res.input}</code>
                                                    </div>
                                                    <div>
                                                        <span className="text-slate-500 font-sans">Kỳ vọng: </span>
                                                        <code className="text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-white/5 px-1.5 py-0.5 rounded font-bold">{res.expectedOutput}</code>
                                                    </div>
                                                    <div>
                                                        <span className="text-slate-500 font-sans">Thực tế: </span>
                                                        <code className={res.passed ? "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-white/5 px-1.5 py-0.5 rounded font-bold" : "text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-white/5 px-1.5 py-0.5 rounded font-bold"}>
                                                            {res.actualOutput || '(Rỗng)'}
                                                        </code>
                                                    </div>
                                                    {res.errorMessage && (
                                                        <div className="mt-1.5 p-2 bg-rose-100 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-500/30 rounded text-rose-800 dark:text-rose-300 break-all">
                                                            Lỗi: {res.errorMessage}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PersonalizedLessonViewer;
