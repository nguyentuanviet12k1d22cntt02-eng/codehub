import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import axios from 'axios';
import {
    BookOpen,
    Code2,
    HelpCircle,
    Sparkles,
    Play,
    RotateCcw,
    CheckCircle2,
    XCircle,
    Copy,
    Check,
    Lightbulb,
    Terminal,
    Target,
    Clock,
    ChevronRight,
    FileCode
} from 'lucide-react';
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
    
    // Practice Sub-tab state
    const [practiceSubTab, setPracticeSubTab] = useState<'SPEC' | 'TESTCASES' | 'HINTS'>('SPEC');
    const [copiedInputIdx, setCopiedInputIdx] = useState<number | null>(null);

    // Language detection for Editor & Code
    const rawLang = String(lesson.exercise?.language || '').toUpperCase();
    const isCpp = rawLang === 'CPP' || rawLang.includes('C++') || (lesson.exercise?.starterCode && /#include\s*<|std::/i.test(lesson.exercise.starterCode));
    const isJs = !isCpp && (rawLang === 'JAVASCRIPT' || rawLang.includes('JS') || (lesson.exercise?.starterCode && /console\.log|function\s*\(|let\s+|const\s+/i.test(lesson.exercise.starterCode)));
    const monacoLang = rawLang === 'SQL' ? 'sql' : isCpp ? 'cpp' : (isJs ? 'javascript' : 'python');
    const fileLabel = rawLang === 'SQL' ? 'solution.sql' : isCpp ? 'solution.cpp (C++17)' : (isJs ? 'solution.js' : 'solution.py');
    const defaultStarter = isCpp 
        ? '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Nhập dữ liệu và cài đặt giải thuật tại đây:\n    \n    return 0;\n}'
        : (isJs ? '// Viết code JavaScript tại đây\n' : 'def solution():\n    pass');

    // Practice States
    const [code, setCode] = useState<string>(lesson.exercise?.starterCode || defaultStarter);
    const [submittingCode, setSubmittingCode] = useState<boolean>(false);
    const [executionOutput, setExecutionOutput] = useState<any>(null);
    const [activeTestCaseTab, setActiveTestCaseTab] = useState<number>(0);

    useEffect(() => {
        if (lesson.exercise?.starterCode) {
            setCode(lesson.exercise.starterCode);
        } else {
            setCode(defaultStarter);
        }
        setExecutionOutput(null);
        setActiveTestCaseTab(0);
    }, [lesson.exercise?.id, lesson.exercise?.starterCode, defaultStarter]);

    const handleResetCode = () => {
        if (window.confirm('Bạn có chắc muốn khôi phục lại mã nguồn ban đầu?')) {
            setCode(lesson.exercise?.starterCode || defaultStarter);
            setExecutionOutput(null);
        }
    };

    const handleCopyInput = (inputVal: string, idx: number) => {
        navigator.clipboard.writeText(inputVal);
        setCopiedInputIdx(idx);
        setTimeout(() => setCopiedInputIdx(null), 1800);
    };

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
                    if (onLessonCompleted) {
                        onLessonCompleted();
                    }
                }
            }
        } catch (e: any) {
            console.error('Exercise submit error:', e);
            setExecutionOutput({
                isPassed: false,
                error: e.response?.data?.error || 'Lỗi khi nộp bài thực hành lên máy chủ chấm'
            });
        } finally {
            setSubmittingCode(false);
        }
    };

    const resolvedTheory = getStandardizedTheory(lesson);

    return (
        <div className="w-full rounded-[28px] bg-white dark:bg-[#0B0F19] border border-slate-200/80 dark:border-white/10 shadow-[0_24px_70px_-42px_rgba(15,23,42,0.65)] overflow-hidden transition-colors duration-200">
            <div className="flex flex-col 2xl:flex-row 2xl:items-center 2xl:justify-between border-b border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#090D15] px-3 sm:px-5 py-3 gap-3">
                <div role="tablist" aria-label="Các phần của bài học" className="flex w-full 2xl:w-auto gap-1.5 overflow-x-auto rounded-2xl bg-slate-100 dark:bg-white/[0.045] p-1.5">
                    <button
                        type="button"
                        role="tab"
                        aria-selected={activeTab === 'THEORY'}
                        onClick={() => setActiveTab('THEORY')}
                        className={`min-h-11 shrink-0 px-4 sm:px-5 py-2 rounded-xl font-bold text-xs tracking-wide transition-all duration-200 flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                            activeTab === 'THEORY'
                                ? 'bg-white dark:bg-blue-600 text-blue-700 dark:text-white shadow-sm ring-1 ring-slate-200/70 dark:ring-blue-400/20'
                                : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/70 dark:hover:bg-white/[0.06]'
                        }`}
                    >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>1. Lý Thuyết Bài Học</span>
                    </button>
                    
                    {Array.isArray(lesson.quizzes) && lesson.quizzes.length > 0 && (
                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeTab === 'QUIZ'}
                            onClick={() => setActiveTab('QUIZ')}
                            className={`min-h-11 shrink-0 px-4 sm:px-5 py-2 rounded-xl font-bold text-xs tracking-wide transition-all duration-200 flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                                activeTab === 'QUIZ'
                                    ? 'bg-white dark:bg-blue-600 text-blue-700 dark:text-white shadow-sm ring-1 ring-slate-200/70 dark:ring-blue-400/20'
                                    : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/70 dark:hover:bg-white/[0.06]'
                            }`}
                        >
                            <HelpCircle className="w-3.5 h-3.5" />
                            <span>2. Trắc Nghiệm ({lesson.quizzes.length})</span>
                        </button>
                    )}

                    {lesson.exercise && (
                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeTab === 'PRACTICE'}
                            onClick={() => setActiveTab('PRACTICE')}
                            className={`min-h-11 shrink-0 px-4 sm:px-5 py-2 rounded-xl font-bold text-xs tracking-wide transition-all duration-200 flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                                activeTab === 'PRACTICE'
                                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                                    : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/70 dark:hover:bg-white/[0.06]'
                            }`}
                        >
                            <Code2 className="w-3.5 h-3.5" />
                            <span>{Array.isArray(lesson.quizzes) && lesson.quizzes.length > 0 ? '3.' : '2.'} Thực Hành Lập Trình</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                        </button>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-2 px-1 sm:px-0">
                    {lesson.exercise && (
                        <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                            lesson.exercise.difficulty === 'EASY'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30'
                                : lesson.exercise.difficulty === 'HARD'
                                ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-500/30'
                                : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-500/30'
                        }`}>
                            {lesson.exercise.difficulty === 'EASY' ? 'Cấp Độ: Dễ' : lesson.exercise.difficulty === 'HARD' ? 'Cấp Độ: Khó' : 'Cấp Độ: Trung Bình'}
                        </span>
                    )}

                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-700 dark:text-cyan-300 bg-blue-50 dark:bg-cyan-950/40 px-3 py-1 rounded-full border border-blue-200 dark:border-cyan-500/30 flex items-center gap-1.5">
                        <Target className="w-3 h-3 text-blue-600 dark:text-cyan-400" />
                        <span>{lesson.targetSkillId}</span>
                    </span>
                </div>
            </div>

            {/* TAB 1: Nội Dung Bài Học Chuẩn - High-Contrast Editorial Style */}
            {activeTab === 'THEORY' && (
                <div role="tabpanel" className="p-4 sm:p-7 lg:p-10 xl:p-12 bg-white dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100">
                    <div className="w-full space-y-10">
                        {/* Hero Header Card */}
                        <div className="relative overflow-hidden p-6 sm:p-8 lg:p-10 rounded-[28px] bg-[radial-gradient(circle_at_top_right,_rgba(14,165,233,0.18),_transparent_36%),linear-gradient(135deg,_#eff6ff_0%,_#f8fafc_48%,_#ecfeff_100%)] dark:bg-[radial-gradient(circle_at_top_right,_rgba(14,165,233,0.16),_transparent_35%),linear-gradient(135deg,_#0c1830_0%,_#0e1422_52%,_#082f36_100%)] border border-blue-100/90 dark:border-blue-400/15">
                            <div className="relative z-10 max-w-5xl space-y-5">
                                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-blue-700 dark:text-cyan-300">
                                <span className="inline-flex items-center gap-1.5 bg-white/80 dark:bg-white/10 px-3 py-1.5 rounded-full border border-blue-200/70 dark:border-white/10 shadow-sm">
                                    <Sparkles className="w-3 h-3" />
                                    <span>AI Adaptive Curriculum</span>
                                </span>
                                <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-gray-300 bg-white/60 dark:bg-white/[0.06] px-3 py-1.5 rounded-full border border-white/70 dark:border-white/10">
                                    <Clock className="w-3 h-3" />
                                    <span>Thời lượng ước tính: 15 phút</span>
                                </span>
                            </div>

                            <h2 className="text-3xl sm:text-4xl lg:text-[44px] leading-[1.08] font-black text-slate-950 dark:text-white tracking-[-0.035em]">
                                {lesson.title}
                            </h2>

                            <p className="max-w-4xl text-sm sm:text-base text-slate-600 dark:text-gray-300 leading-7">
                                Bài học này được AI tổng hợp và tinh chỉnh theo hồ sơ năng lực của bạn nhằm củng cố vững chắc kỹ năng <strong>{lesson.targetSkillId}</strong> trước khi bước vào phần thực hành code.
                            </p>
                            </div>
                            <div aria-hidden="true" className="absolute -right-16 -bottom-24 h-64 w-64 rounded-full border-[42px] border-blue-200/30 dark:border-cyan-400/10" />
                        </div>

                        {/* Standard Textbook Lesson Content */}
                        <div className="select-text w-full rounded-[24px] border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0D121D] px-5 py-3 sm:px-8 sm:py-5 lg:px-10 lg:py-6 shadow-[0_18px_50px_-42px_rgba(15,23,42,0.5)]">
                            <LessonContentRenderer content={resolvedTheory} />
                        </div>

                        {/* Bottom Action Button */}
                        <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
                            <div className="text-xs text-slate-500 dark:text-gray-400 flex items-center gap-1.5 font-medium">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                <span>Đọc kỹ lý thuyết sẽ giúp bạn hoàn thành bài tập thực hành nhanh gấp 2 lần!</span>
                            </div>

                            <button
                                onClick={() => setActiveTab(Array.isArray(lesson.quizzes) && lesson.quizzes.length > 0 ? 'QUIZ' : 'PRACTICE')}
                                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold tracking-wide shadow-md shadow-blue-500/20 transition-all duration-200 hover:shadow-lg active:scale-[0.99] cursor-pointer"
                            >
                                <span>{Array.isArray(lesson.quizzes) && lesson.quizzes.length > 0 ? 'Làm Trắc Nghiệm Củng Cố' : 'Chuyển Sang Thực Hành Lập Trình'}</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: Trắc Nghiệm Củng Cố */}
            {activeTab === 'QUIZ' && (
                <div role="tabpanel" className="p-4 sm:p-7 lg:p-10 bg-slate-50/60 dark:bg-[#080C14] space-y-6">
                    <div className="w-full space-y-6">
                        <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-500/20 text-xs text-blue-900 dark:text-blue-300 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 shrink-0 text-blue-600 dark:text-cyan-400" />
                            <span>Hãy hoàn thành các câu hỏi nhanh bên dưới để kiểm tra mức độ nắm vững lý thuyết của bạn.</span>
                        </div>

                        {lesson.quizzes.map((q, idx) => {
                            const result = quizResults[q.id];
                            const selected = quizAnswers[q.id];

                            return (
                                <div key={q.id} className="bg-white dark:bg-[#0E1422] border border-slate-200/80 dark:border-white/10 rounded-2xl p-6 shadow-xs space-y-4">
                                    <div className="flex items-start gap-3">
                                        <span className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200/70 dark:border-blue-500/20 text-xs font-mono font-bold shrink-0">
                                            CÂU {idx + 1}
                                        </span>
                                        <div className="text-sm md:text-base font-bold text-slate-900 dark:text-white leading-snug flex-1">
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
                                                    className={`p-4 rounded-xl border text-left text-xs md:text-sm font-medium transition-all duration-150 flex items-center gap-3 cursor-pointer ${
                                                        isSelected
                                                            ? 'border-blue-600 bg-blue-50/90 dark:bg-blue-950/50 text-blue-900 dark:text-blue-300 font-semibold shadow-xs'
                                                            : 'border-slate-200/80 dark:border-white/10 bg-white dark:bg-white/[0.03] text-slate-700 dark:text-slate-300 hover:border-blue-300 hover:bg-slate-50 dark:hover:bg-white/[0.06]'
                                                    }`}
                                                >
                                                    <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                                                        isSelected
                                                            ? 'bg-blue-600 text-white shadow-xs'
                                                            : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300'
                                                    }`}>
                                                        {optKey}
                                                    </span>
                                                    <span className="flex-1 leading-snug">{optionText}</span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Action & Result */}
                                    <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-4">
                                        <button
                                            onClick={() => handleCheckQuiz(q.id)}
                                            disabled={!selected}
                                            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-bold tracking-wide shadow-xs transition-all cursor-pointer"
                                        >
                                            Kiểm Tra Đáp Án
                                        </button>

                                        {result && (
                                            <span className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
                                                result.isCorrect
                                                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30'
                                                    : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30'
                                            }`}>
                                                {result.isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                                <span>{result.isCorrect ? 'CHÍNH XÁC!' : 'CHƯA CHÍNH XÁC'}</span>
                                            </span>
                                        )}
                                    </div>

                                    {result && (
                                        <div className="mt-3 p-4 bg-slate-50 dark:bg-[#070B14] border border-slate-200/80 dark:border-white/10 rounded-xl text-xs text-slate-700 dark:text-gray-300 leading-relaxed space-y-1">
                                            <p className="font-bold text-blue-700 dark:text-cyan-400 flex items-center gap-1.5">
                                                💡 Giải thích chi tiết:
                                            </p>
                                            <p className="pl-3 border-l-2 border-blue-500">
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
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold tracking-wide shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                                >
                                    <span>Bắt Đầu Thực Hành Lập Trình Ngay</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TAB 3: Giao diện Thực Hành Lập Trình (Pro Coding Studio - Side-by-Side Split View) */}
            {activeTab === 'PRACTICE' && lesson.exercise && (
                <div role="tabpanel" className="p-3 sm:p-5 lg:p-7 bg-slate-100/50 dark:bg-[#070A12]">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                        {/* LEFT COLUMN: Problem Specification & Testcases (5 Columns) */}
                        <div className="lg:col-span-5 space-y-4">
                            <div className="bg-white dark:bg-[#0D121F] border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-xs overflow-hidden">
                                {/* Problem Spec Header */}
                                <div className="p-5 border-b border-slate-200/80 dark:border-white/10 space-y-2">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-cyan-400">
                                            <span className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10">
                                                <Code2 className="w-4 h-4" />
                                            </span>
                                            <span className="uppercase tracking-wider">Bài Tập Thực Hành</span>
                                        </div>
                                        <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                                            lesson.exercise.difficulty === 'EASY'
                                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30'
                                                : lesson.exercise.difficulty === 'HARD'
                                                ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-500/30'
                                                : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-500/30'
                                        }`}>
                                            {lesson.exercise.difficulty}
                                        </span>
                                    </div>
                                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                                        {lesson.exercise.title}
                                    </h3>
                                </div>

                                {/* Sub Tabs Selector: Spec / Test Cases / Hints */}
                                <div className="flex items-center border-b border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.02] px-4 gap-2">
                                    <button
                                        onClick={() => setPracticeSubTab('SPEC')}
                                        className={`py-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                                            practiceSubTab === 'SPEC'
                                                ? 'border-blue-600 text-blue-600 dark:border-cyan-400 dark:text-cyan-300'
                                                : 'border-transparent text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white'
                                        }`}
                                    >
                                        Mô Tả Đề Bài
                                    </button>
                                    <button
                                        onClick={() => setPracticeSubTab('TESTCASES')}
                                        className={`py-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                                            practiceSubTab === 'TESTCASES'
                                                ? 'border-blue-600 text-blue-600 dark:border-cyan-400 dark:text-cyan-300'
                                                : 'border-transparent text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white'
                                        }`}
                                    >
                                        Testcases ({lesson.exercise.testCases?.length || 0})
                                    </button>
                                    <button
                                        onClick={() => setPracticeSubTab('HINTS')}
                                        className={`py-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1 ${
                                            practiceSubTab === 'HINTS'
                                                ? 'border-blue-600 text-blue-600 dark:border-cyan-400 dark:text-cyan-300'
                                                : 'border-transparent text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white'
                                        }`}
                                    >
                                        <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                                        <span>Gợi Ý AI</span>
                                    </button>
                                </div>

                                {/* Sub Tab Content with Independent Scroll */}
                                <div className="p-5 max-h-[620px] overflow-y-auto space-y-4">
                                    {practiceSubTab === 'SPEC' && (
                                        <div className="space-y-4 text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
                                            {/* Rendered Markdown Problem Description */}
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    h1: ({ ...props }) => <h1 className="text-base font-bold text-slate-900 dark:text-white mt-3 mb-1.5 border-b pb-1" {...props} />,
                                                    h2: ({ ...props }) => <h2 className="text-sm font-bold text-slate-900 dark:text-white mt-3 mb-1.5 text-blue-700 dark:text-cyan-400" {...props} />,
                                                    h3: ({ ...props }) => <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-gray-300 mt-3 mb-1" {...props} />,
                                                    p: ({ ...props }) => <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mb-2.5" {...props} />,
                                                    ul: ({ ...props }) => <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300 mb-3" {...props} />,
                                                    ol: ({ ...props }) => <ol className="list-decimal pl-5 space-y-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300 mb-3" {...props} />,
                                                    li: ({ ...props }) => <li className="leading-relaxed" {...props} />,
                                                    code: ({ className, children, ...props }) => {
                                                        const contentStr = String(children || '');
                                                        const hasNewline = contentStr.includes('\n');
                                                        return !hasNewline ? (
                                                            <code className="bg-slate-100 dark:bg-white/[0.08] text-blue-700 dark:text-cyan-300 border border-slate-200/80 dark:border-white/10 px-1.5 py-0.5 rounded font-mono text-xs font-semibold" {...props}>
                                                                {children}
                                                            </code>
                                                        ) : (
                                                            <div className="my-2 rounded-xl bg-slate-900 border border-slate-800 p-3 text-emerald-400 font-mono text-xs overflow-x-auto">
                                                                <code className={className} {...props}>
                                                                    {children}
                                                                </code>
                                                            </div>
                                                        );
                                                    }
                                                }}
                                            >
                                                {cleanChineseArtifacts(lesson.exercise.problemDescription)}
                                            </ReactMarkdown>

                                            {/* Quick Examples Highlight Box */}
                                            {lesson.exercise.testCases && lesson.exercise.testCases.length > 0 && (
                                                <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-white/10 space-y-3">
                                                    <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                                                        <span className="flex items-center gap-1.5">
                                                            <Terminal className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                                                            <span>Ví Dụ Minh Họa (Example):</span>
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-2.5">
                                                        {lesson.exercise.testCases.slice(0, 2).map((tc, idx) => (
                                                            <div key={idx} className="bg-slate-50 dark:bg-[#080D18] rounded-xl border border-slate-200/80 dark:border-white/10 p-3.5 space-y-2 text-xs font-mono">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="font-bold text-slate-700 dark:text-cyan-400 font-sans text-[11px]">
                                                                        Ví Dụ #{idx + 1}
                                                                    </span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleCopyInput(tc.input, idx)}
                                                                        className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] text-slate-600 dark:text-gray-400 hover:text-blue-600 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 transition-colors"
                                                                        title="Sao chép đầu vào"
                                                                    >
                                                                        {copiedInputIdx === idx ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                                                        <span>{copiedInputIdx === idx ? 'Đã chép' : 'Sao chép Input'}</span>
                                                                    </button>
                                                                </div>

                                                                <div className="space-y-1.5">
                                                                    <div className="p-2 rounded bg-white dark:bg-[#111726] border border-slate-200/70 dark:border-white/5">
                                                                        <span className="text-slate-400 block text-[10px] font-sans font-medium mb-0.5">Đầu vào (Input):</span>
                                                                        <span className="text-slate-900 dark:text-yellow-300 font-bold whitespace-pre-wrap">{tc.input || '(Trống)'}</span>
                                                                    </div>
                                                                    <div className="p-2 rounded bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-500/20">
                                                                        <span className="text-emerald-600/80 dark:text-emerald-400/80 block text-[10px] font-sans font-medium mb-0.5">Đầu ra kỳ vọng (Output):</span>
                                                                        <span className="text-emerald-800 dark:text-emerald-300 font-bold whitespace-pre-wrap">{tc.expectedOutput || '(Trống)'}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {practiceSubTab === 'TESTCASES' && (
                                        <div className="space-y-3">
                                            <p className="text-xs text-slate-600 dark:text-gray-400">
                                                Hệ thống bao gồm <strong>{lesson.exercise.testCases.length} bộ testcases</strong> (bao gồm các trường hợp thông thường và test case biên).
                                            </p>

                                            <div className="space-y-2.5">
                                                {lesson.exercise.testCases.map((tc, tcIdx) => (
                                                    <div key={tc.id || tcIdx} className="bg-slate-50 dark:bg-[#0E1526] p-3.5 rounded-xl border border-slate-200/80 dark:border-white/10 font-mono text-xs space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-slate-800 dark:text-cyan-300 font-bold font-sans text-xs">
                                                                Testcase #{tcIdx + 1}
                                                            </span>
                                                            {tc.isHidden ? (
                                                                <span className="text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-200 dark:border-amber-500/20 text-[10px] font-bold">
                                                                    🔒 Test Ẩn
                                                                </span>
                                                            ) : (
                                                                <span className="text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-500/20 text-[10px] font-bold">
                                                                    Công Khai
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="space-y-1.5 text-[11px]">
                                                            <div className="p-2 rounded bg-white dark:bg-[#141C30] border border-slate-200/70 dark:border-white/5">
                                                                <span className="text-slate-400 block text-[10px] font-sans font-medium">Input:</span>
                                                                <span className="text-slate-900 dark:text-yellow-300 font-bold whitespace-pre-wrap">{tc.input || '(Trống)'}</span>
                                                            </div>
                                                            {!tc.isHidden ? (
                                                                <div className="p-2 rounded bg-white dark:bg-[#141C30] border border-slate-200/70 dark:border-white/5">
                                                                    <span className="text-slate-400 block text-[10px] font-sans font-medium">Expected Output:</span>
                                                                    <span className="text-emerald-700 dark:text-emerald-300 font-bold whitespace-pre-wrap">{tc.expectedOutput || '(Trống)'}</span>
                                                                </div>
                                                            ) : (
                                                                <p className="text-[10px] text-slate-400 italic font-sans">
                                                                    * Kịch bản ẩn nhằm kiểm tra tính tổng quát của thuật toán.
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {practiceSubTab === 'HINTS' && (
                                        <div className="space-y-4">
                                            <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-500/20 space-y-2 text-xs">
                                                <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300">
                                                    <Lightbulb className="w-4 h-4 text-amber-600" />
                                                    <span>Gợi ý phương pháp giải quyết</span>
                                                </div>
                                                <p className="text-amber-800 dark:text-amber-200/90 leading-relaxed">
                                                    Đọc kỹ các ràng buộc đầu vào (ví dụ: n &le; 0). Đảm bảo chương trình xử lý đúng các trường hợp đặc biệt không in ra dữ liệu rác.
                                                </p>
                                            </div>

                                            <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-500/20 space-y-2 text-xs">
                                                <div className="flex items-center gap-2 font-bold text-blue-900 dark:text-blue-300">
                                                    <Target className="w-4 h-4 text-blue-600" />
                                                    <span>Kỹ thuật trọng tâm</span>
                                                </div>
                                                <p className="text-blue-800 dark:text-blue-200/90 leading-relaxed">
                                                    Vận dụng vòng lặp theo đúng cú pháp chuẩn đã học ở Tab 1. Kiểm tra kỹ bước tăng biến đếm để tránh lặp vô hạn.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Code IDE & Test Execution Runner (7 Columns) */}
                        <div className="lg:col-span-7 space-y-4">
                            {/* Monaco Editor Container */}
                            <div className="rounded-2xl border border-slate-300/80 dark:border-white/10 overflow-hidden shadow-sm bg-[#1e1e1e]">
                                {/* IDE Top Action Bar */}
                                <div className="bg-[#18181b] px-4 py-2.5 border-b border-[#27272a] flex flex-wrap justify-between items-center gap-3 select-none">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-rose-500/90 inline-block" />
                                        <span className="w-3 h-3 rounded-full bg-amber-500/90 inline-block" />
                                        <span className="w-3 h-3 rounded-full bg-emerald-500/90 inline-block" />
                                        <div className="flex items-center gap-1.5 ml-2 text-xs font-mono font-bold text-slate-300 bg-white/10 px-2.5 py-1 rounded-md">
                                            <FileCode className="w-3.5 h-3.5 text-blue-400" />
                                            <span>{fileLabel}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={handleResetCode}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
                                            title="Khôi phục lại mã nguồn ban đầu"
                                        >
                                            <RotateCcw className="w-3.5 h-3.5" />
                                            <span>Làm lại</span>
                                        </button>

                                        <button
                                            onClick={handleSubmitExercise}
                                            disabled={submittingCode}
                                            className="inline-flex items-center gap-2 px-5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white text-xs font-bold tracking-wide shadow-md shadow-emerald-500/20 transition-all cursor-pointer active:scale-95"
                                        >
                                            {submittingCode ? (
                                                <>
                                                    <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin inline-block" />
                                                    <span>Đang Chấm...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Play className="w-3.5 h-3.5 fill-current" />
                                                    <span>Nộp Bài & Chấm Điểm</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <Editor
                                    height="430px"
                                    language={monacoLang}
                                    theme="vs-dark"
                                    value={code}
                                    onChange={(val) => setCode(val || '')}
                                    options={{
                                        fontSize: 13.5,
                                        fontFamily: "'Fira Code', 'Geist Mono', Consolas, monospace",
                                        minimap: { enabled: false },
                                        scrollBeyondLastLine: false,
                                        automaticLayout: true,
                                        padding: { top: 14, bottom: 14 },
                                        lineNumbers: 'on',
                                        renderLineHighlight: 'all'
                                    }}
                                />
                            </div>

                            {/* Test Execution Output Console */}
                            <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0D121F] shadow-xs overflow-hidden">
                                <div className="px-5 py-3 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between bg-slate-50/70 dark:bg-white/[0.02]">
                                    <div className="flex items-center gap-2">
                                        <Terminal className="w-4 h-4 text-slate-600 dark:text-cyan-400" />
                                        <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white">
                                            Bảng Kết Quả Chấm & Console
                                        </span>
                                    </div>

                                    {executionOutput && (
                                        <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${
                                            executionOutput.isPassed
                                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/30'
                                                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-300 dark:border-rose-500/30'
                                        }`}>
                                            Điểm số: {executionOutput.score || 0}/100
                                        </span>
                                    )}
                                </div>

                                <div className="p-5">
                                    {!executionOutput ? (
                                        <div className="py-8 text-center text-slate-400 dark:text-gray-500 space-y-2">
                                            <Terminal className="w-8 h-8 mx-auto opacity-50" />
                                            <p className="text-xs font-medium">
                                                Nhấn nút <strong className="text-emerald-600 dark:text-emerald-400">"Nộp Bài & Chấm Điểm"</strong> để chạy mã với môi trường Docker Sandbox.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {/* Top Banner Status */}
                                            <div className={`p-4 rounded-xl border flex items-center justify-between ${
                                                executionOutput.isPassed
                                                    ? 'bg-emerald-50/90 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-200'
                                                    : 'bg-rose-50/90 dark:bg-rose-950/30 border-rose-300 dark:border-rose-500/30 text-rose-800 dark:text-rose-200'
                                            }`}>
                                                <div className="flex items-center gap-2.5">
                                                    {executionOutput.isPassed ? (
                                                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                                    ) : (
                                                        <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                                                    )}
                                                    <div>
                                                        <h4 className="font-bold text-sm">
                                                            {executionOutput.isPassed
                                                                ? '🎉 HOÀN THÀNH XUẤT SẮC: VƯỢT QUA 100% TEST CASES!'
                                                                : '❌ CHƯA ĐẠT CHUẨN: MỘT SỐ TESTCASES BỊ SAI HOẶC LỖI THỰC THI'}
                                                        </h4>
                                                        <p className="text-xs opacity-80">
                                                            {executionOutput.isPassed
                                                                ? 'Hệ thống đã tự động ghi nhận hoàn thành bài tập vào tiến độ lộ trình.'
                                                                : 'Hãy rà soát kỹ bảng so sánh Input, Kỳ vọng và Kết quả thực tế bên dưới.'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Execution Global Error (if compile error) */}
                                            {executionOutput.error && (
                                                <div className="p-4 bg-rose-950/80 border border-rose-500/40 rounded-xl text-xs text-rose-200 font-mono whitespace-pre-wrap space-y-1">
                                                    <span className="font-bold text-rose-400 flex items-center gap-1.5 font-sans">
                                                        ⚠️ Thông báo lỗi biên dịch / thời gian chạy:
                                                    </span>
                                                    <div>{executionOutput.error}</div>
                                                </div>
                                            )}

                                            {/* Detailed Testcases Comparison */}
                                            {executionOutput.results && executionOutput.results.length > 0 && (
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-white/10 pb-2 overflow-x-auto">
                                                        {executionOutput.results.map((res: any, i: number) => (
                                                            <button
                                                                key={i}
                                                                onClick={() => setActiveTestCaseTab(i)}
                                                                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                                                                    activeTestCaseTab === i
                                                                        ? res.passed
                                                                            ? 'bg-emerald-600 text-white shadow-xs'
                                                                            : 'bg-rose-600 text-white shadow-xs'
                                                                        : res.passed
                                                                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30'
                                                                        : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30'
                                                                }`}
                                                            >
                                                                {res.passed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                                                <span>Test #{i + 1}</span>
                                                            </button>
                                                        ))}
                                                    </div>

                                                    {/* Selected Testcase View */}
                                                    {(() => {
                                                        const activeRes = executionOutput.results[activeTestCaseTab] || executionOutput.results[0];
                                                        if (!activeRes) return null;

                                                        return (
                                                            <div className="bg-slate-50 dark:bg-[#070B14] p-4 rounded-xl border border-slate-200/80 dark:border-white/10 font-mono text-xs space-y-3">
                                                                <div className="flex justify-between items-center">
                                                                    <span className="font-bold text-slate-800 dark:text-cyan-300 font-sans text-xs">
                                                                        Chi Tiết Testcase #{activeTestCaseTab + 1}
                                                                    </span>
                                                                    <span className={`font-mono font-bold text-[11px] px-2.5 py-0.5 rounded border ${
                                                                        activeRes.passed
                                                                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30'
                                                                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-500/30'
                                                                    }`}>
                                                                        {activeRes.passed ? 'PASSED ✓' : 'FAILED ✗'}
                                                                    </span>
                                                                </div>

                                                                <div className="space-y-2 text-[11px]">
                                                                    <div className="p-2.5 rounded-lg bg-white dark:bg-[#121929] border border-slate-200/70 dark:border-white/5">
                                                                        <span className="text-slate-400 block font-sans text-[10px] font-medium mb-1">Đầu vào (Input):</span>
                                                                        <span className="text-slate-900 dark:text-yellow-300 font-bold whitespace-pre-wrap">{activeRes.input || '(Trống)'}</span>
                                                                    </div>

                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                                        <div className="p-2.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/30">
                                                                            <span className="text-emerald-700 dark:text-emerald-400 block font-sans text-[10px] font-medium mb-1">Kết quả kỳ vọng (Expected):</span>
                                                                            <span className="text-emerald-900 dark:text-emerald-300 font-bold whitespace-pre-wrap">{activeRes.expectedOutput || '(Trống)'}</span>
                                                                        </div>

                                                                        <div className={`p-2.5 rounded-lg border ${
                                                                            activeRes.passed
                                                                                ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-500/30'
                                                                                : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-300 dark:border-rose-500/40'
                                                                        }`}>
                                                                            <span className={activeRes.passed ? "text-emerald-700 dark:text-emerald-400 block font-sans text-[10px] font-medium mb-1" : "text-rose-700 dark:text-rose-400 block font-sans text-[10px] font-medium mb-1"}>
                                                                                Kết quả thực tế (Actual):
                                                                            </span>
                                                                            <span className={activeRes.passed ? "text-emerald-900 dark:text-emerald-300 font-bold whitespace-pre-wrap" : "text-rose-900 dark:text-rose-300 font-bold whitespace-pre-wrap"}>
                                                                                {activeRes.actualOutput || '(Rỗng)'}
                                                                            </span>
                                                                        </div>
                                                                    </div>

                                                                    {activeRes.errorMessage && (
                                                                        <div className="p-2.5 bg-rose-100/80 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-500/30 rounded-lg text-rose-800 dark:text-rose-300 whitespace-pre-wrap">
                                                                            Chi tiết lỗi: {activeRes.errorMessage}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PersonalizedLessonViewer;
