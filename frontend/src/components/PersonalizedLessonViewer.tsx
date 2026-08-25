import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import axios from 'axios';
import { stripQuizSectionFromMarkdown } from '../utils/quizParser';

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
    solutionCode: string;
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

export const PersonalizedLessonViewer: React.FC<PersonalizedLessonViewerProps> = ({
    lesson,
    token,
    onLessonCompleted
}) => {
    const [activeTab, setActiveTab] = useState<'THEORY' | 'QUIZ' | 'PRACTICE'>('THEORY');
    
    // Quiz States
    const [quizAnswers, setQuizAnswers] = useState<{ [quizId: string]: 'A' | 'B' | 'C' | 'D' }>({});
    const [quizResults, setQuizResults] = useState<{ [quizId: string]: { isCorrect: boolean; explanation: string } }>({});
    
    // Practice States
    const [code, setCode] = useState<string>(lesson.exercise?.starterCode || 'def solution():\n    pass');
    const [submittingCode, setSubmittingCode] = useState<boolean>(false);
    const [executionOutput, setExecutionOutput] = useState<any>(null);

    const handleSelectQuizOption = (quizId: string, option: 'A' | 'B' | 'C' | 'D') => {
        setQuizAnswers(prev => ({ ...prev, [quizId]: option }));
    };

    const handleCheckQuiz = async (quizId: string) => {
        const selectedOption = quizAnswers[quizId];
        if (!selectedOption) return;

        try {
            const res = await axios.post(
                'http://localhost:3000/api/learning-path/submit-quiz',
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
                'http://localhost:3000/api/learning-path/submit-exercise',
                {
                    exerciseId: lesson.exercise.id,
                    code
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                setExecutionOutput(res.data);
                if (res.data.isPassed && onLessonCompleted) {
                    onLessonCompleted();
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

    return (
        <div className="p-1 rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 shadow-2xl backdrop-blur-2xl">
            <div className="bg-[#0B0F19]/95 rounded-[calc(1rem-2px)] overflow-hidden border border-white/5">
                
                {/* Header Navigation Tabs - High-End Floating Island */}
                <div className="flex flex-wrap items-center justify-between border-b border-white/10 bg-[#080C14]/90 px-6 py-4 gap-4">
                    <div className="inline-flex p-1 bg-[#121826] rounded-xl border border-white/10 gap-1 shadow-inner">
                        <button
                            onClick={() => setActiveTab('THEORY')}
                            className={`px-4 py-2 rounded-lg font-bold text-xs tracking-wide transition-all duration-300 flex items-center gap-2 ${
                                activeTab === 'THEORY'
                                    ? 'bg-gradient-to-r from-[#1F6FE5] to-[#388BFD] text-white shadow-lg shadow-blue-500/20'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <span>📚 1. Lý Thuyết Chuyên Sâu</span>
                        </button>
                        
                        <button
                            onClick={() => setActiveTab('QUIZ')}
                            className={`px-4 py-2 rounded-lg font-bold text-xs tracking-wide transition-all duration-300 flex items-center gap-2 ${
                                activeTab === 'QUIZ'
                                    ? 'bg-gradient-to-r from-[#1F6FE5] to-[#388BFD] text-white shadow-lg shadow-blue-500/20'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <span>❓ 2. Trắc Nghiệm ({lesson.quizzes?.length || 0})</span>
                        </button>

                        {lesson.exercise && (
                            <button
                                onClick={() => setActiveTab('PRACTICE')}
                                className={`px-4 py-2 rounded-lg font-bold text-xs tracking-wide transition-all duration-300 flex items-center gap-2 ${
                                    activeTab === 'PRACTICE'
                                        ? 'bg-gradient-to-r from-[#238636] to-[#2EA043] text-white shadow-lg shadow-emerald-500/20'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <span>⚡ 3. Thực Hành Code</span>
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-500/30">
                            {lesson.targetSkillId}
                        </span>
                    </div>
                </div>

                {/* TAB 1: Lý Thuyết Chuyên Sâu */}
                {activeTab === 'THEORY' && (
                    <div className="p-8 space-y-6">
                        <div className="max-h-[68vh] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                            <article className="prose prose-invert max-w-none 
                                prose-headings:font-bold prose-headings:tracking-tight 
                                prose-h1:text-2xl prose-h1:text-white prose-h1:border-b prose-h1:border-white/10 prose-h1:pb-3 prose-h1:mb-6
                                prose-h2:text-lg prose-h2:text-cyan-400 prose-h2:mt-8 prose-h2:mb-4
                                prose-p:text-gray-300 prose-p:leading-relaxed prose-p:text-sm
                                prose-ul:text-gray-300 prose-li:text-sm
                                prose-strong:text-white prose-strong:font-bold
                                prose-code:text-emerald-300 prose-code:bg-white/[0.06] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:before:content-none prose-code:after:content-none
                                prose-pre:bg-[#070A10] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl prose-pre:p-5 prose-pre:shadow-xl
                                prose-blockquote:border-l-4 prose-blockquote:border-cyan-500 prose-blockquote:bg-cyan-950/20 prose-blockquote:p-4 prose-blockquote:rounded-r-xl prose-blockquote:text-cyan-200"
                            >
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {stripQuizSectionFromMarkdown(lesson.theoryContent)}
                                </ReactMarkdown>
                            </article>
                        </div>

                        {/* Island CTA Button */}
                        <div className="pt-6 border-t border-white/10 flex justify-end">
                            <button
                                onClick={() => setActiveTab('QUIZ')}
                                className="group relative inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-[#1F6FE5] to-[#388BFD] hover:opacity-95 text-white text-xs font-black tracking-wider uppercase shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <span>Tiếp Tục: Làm Trắc Nghiệm Củng Cố</span>
                                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs group-hover:translate-x-1 transition-transform">
                                    ➔
                                </span>
                            </button>
                        </div>
                    </div>
                )}

                {/* TAB 2: Trắc Nghiệm Củng Cố */}
                {activeTab === 'QUIZ' && (
                    <div className="p-8 max-h-[72vh] overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-white/10">
                        {lesson.quizzes.map((q, idx) => {
                            const result = quizResults[q.id];
                            const selected = quizAnswers[q.id];

                            return (
                                <div key={q.id} className="p-1 rounded-2xl bg-white/[0.02] border border-white/10 shadow-lg">
                                    <div className="bg-[#0E1422] p-6 rounded-xl space-y-4">
                                        <div className="flex items-start gap-3">
                                            <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-mono font-bold shrink-0">
                                                CÂU {idx + 1}
                                            </span>
                                            <div className="text-sm md:text-base font-bold text-white leading-snug flex-1">
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    components={{
                                                        p: ({ node, ...props }) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
                                                        code: ({ node, className, children, ...props }) => {
                                                            const contentStr = String(children || '');
                                                            const hasNewline = contentStr.includes('\n');
                                                            const match = /language-(\w+)/.exec(className || '');
                                                            const isInline = !match && !hasNewline;

                                                            return isInline ? (
                                                                <code className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-1.5 py-0.5 rounded font-mono text-xs font-semibold mx-0.5" {...props}>
                                                                    {children}
                                                                </code>
                                                            ) : (
                                                                <pre className="p-3 my-2 bg-[#060911] border border-white/10 rounded-xl overflow-x-auto text-xs font-mono text-cyan-200">
                                                                    <code className={className} {...props}>
                                                                        {children}
                                                                    </code>
                                                                </pre>
                                                            );
                                                        }
                                                    }}
                                                >
                                                    {q.question}
                                                </ReactMarkdown>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                                            {(['A', 'B', 'C', 'D'] as const).map(optKey => {
                                                const optText = q[`option${optKey}` as keyof Quiz] as string;
                                                const isSelected = selected === optKey;

                                                return (
                                                    <button
                                                        key={optKey}
                                                        onClick={() => handleSelectQuizOption(q.id, optKey)}
                                                        className={`text-left p-4 rounded-xl border transition-all duration-200 text-xs md:text-sm flex items-center gap-3.5 group ${
                                                            isSelected
                                                                ? 'border-cyan-500 bg-cyan-950/30 text-white font-semibold shadow-lg shadow-cyan-500/10'
                                                                : 'border-white/10 bg-[#121826] text-gray-300 hover:border-white/30 hover:bg-white/[0.04]'
                                                        }`}
                                                    >
                                                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 transition-all ${
                                                            isSelected
                                                                ? 'bg-cyan-500 text-black shadow-md'
                                                                : 'bg-white/10 text-gray-400 group-hover:text-white'
                                                        }`}>
                                                            {optKey}
                                                        </span>
                                                        <span className="leading-snug">{optText}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                            <button
                                                disabled={!selected}
                                                onClick={() => handleCheckQuiz(q.id)}
                                                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 disabled:opacity-40 text-white text-xs font-bold tracking-wide shadow-md transition-all active:scale-[0.98]"
                                            >
                                                Kiểm Tra Đáp Án
                                            </button>

                                            {result && (
                                                <span className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
                                                    result.isCorrect
                                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                                                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                                                }`}>
                                                    {result.isCorrect ? '✓ CHÍNH XÁC 100%' : '✗ CHƯA CHÍNH XÁC'}
                                                </span>
                                            )}
                                        </div>

                                        {result && (
                                            <div className="mt-3 p-4 bg-[#0A0D15] border border-white/10 rounded-xl text-xs text-gray-300 leading-relaxed space-y-1">
                                                <p className="font-bold text-cyan-400 flex items-center gap-1.5">
                                                    💡 Giải thích chi tiết:
                                                </p>
                                                <p className="text-gray-300 pl-4 border-l-2 border-cyan-500/50">
                                                    {result.explanation}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {lesson.exercise && (
                            <div className="pt-4 flex justify-end">
                                <button
                                    onClick={() => setActiveTab('PRACTICE')}
                                    className="group relative inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-[#238636] to-[#2EA043] hover:opacity-95 text-white text-xs font-black tracking-wider uppercase shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <span>Chuyển Sang Thực Hành Lập Trình</span>
                                    <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs group-hover:translate-x-1 transition-transform">
                                        ➔
                                    </span>
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 3: Thực Hành Code */}
                {activeTab === 'PRACTICE' && lesson.exercise && (
                    <div className="p-8 space-y-6">
                        {/* Problem Card */}
                        <div className="p-1 rounded-2xl bg-white/[0.02] border border-white/10">
                            <div className="bg-[#0E1422] p-6 rounded-xl space-y-3">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                                        <span>💻</span> {lesson.exercise.title}
                                    </h3>
                                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                                        lesson.exercise.difficulty === 'EASY'
                                            ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
                                            : lesson.exercise.difficulty === 'HARD'
                                            ? 'bg-rose-950/40 text-rose-300 border-rose-500/40'
                                            : 'bg-amber-950/40 text-amber-300 border-amber-500/40'
                                    }`}>
                                        {lesson.exercise.difficulty}
                                    </span>
                                </div>
                                <div className="prose prose-invert max-w-none text-xs md:text-sm text-gray-300 leading-relaxed">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {lesson.exercise.problemDescription}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>

                        {/* Monaco Editor Container */}
                        <div className="rounded-2xl border border-white/10 overflow-hidden shadow-2xl bg-[#080C14]">
                            <div className="bg-[#0D121F] px-5 py-3 border-b border-white/10 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                                    <span className="ml-2 text-xs font-mono font-bold text-gray-400">solution.py (Python 3.12 Sandbox)</span>
                                </div>
                                <button
                                    onClick={handleSubmitExercise}
                                    disabled={submittingCode}
                                    className="group relative inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#238636] to-[#2EA043] hover:opacity-90 disabled:opacity-40 text-white text-xs font-black tracking-wider uppercase shadow-lg transition-all active:scale-[0.98]"
                                >
                                    {submittingCode ? (
                                        <>
                                            <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin inline-block" />
                                            <span>Đang Chấm Điểm...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>🚀 Nộp Bài Thực Hành</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            <Editor
                                height="320px"
                                language="python"
                                theme="vs-dark"
                                value={code}
                                onChange={(val) => setCode(val || '')}
                                options={{
                                    fontSize: 14,
                                    fontFamily: "'Fira Code', 'Geist Mono', Consolas, monospace",
                                    minimap: { enabled: false },
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true,
                                    padding: { top: 16, bottom: 16 }
                                }}
                            />
                        </div>

                        {/* Test Execution Output */}
                        {executionOutput && (
                            <div className={`p-1 rounded-2xl border transition-all ${
                                executionOutput.isPassed
                                    ? 'bg-gradient-to-b from-emerald-500/10 to-transparent border-emerald-500/40 shadow-xl shadow-emerald-950/40'
                                    : 'bg-gradient-to-b from-rose-500/10 to-transparent border-rose-500/40 shadow-xl shadow-rose-950/40'
                            }`}>
                                <div className="p-5 rounded-xl bg-[#090E18] space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className={`font-black text-sm flex items-center gap-2 ${
                                            executionOutput.isPassed ? 'text-emerald-400' : 'text-rose-400'
                                        }`}>
                                            {executionOutput.isPassed ? '🎉 HOÀN THÀNH: VƯỢT QUA 100% TEST CASES!' : '❌ KẾT QUẢ: CHƯA ĐẠT CHUẨN'}
                                        </h4>
                                        <span className="text-xs font-mono font-bold text-gray-400">
                                            Điểm: {executionOutput.score || 0}/100
                                        </span>
                                    </div>

                                    {executionOutput.results && (
                                        <div className="space-y-2 pt-2">
                                            {executionOutput.results.map((res: any, i: number) => (
                                                <div key={i} className="text-xs p-3 bg-[#0E1422] rounded-xl border border-white/10 flex justify-between items-center">
                                                    <span className="text-gray-300 font-mono">
                                                        Testcase #{i + 1}: <code className="text-cyan-300 bg-white/5 px-1.5 py-0.5 rounded">{res.input}</code>
                                                    </span>
                                                    <span className={`font-mono font-bold text-xs px-2.5 py-1 rounded-lg ${
                                                        res.passed
                                                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                                    }`}>
                                                        {res.passed ? 'PASSED ✓' : 'FAILED ✗'}
                                                    </span>
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
        </div>
    );
};

export default PersonalizedLessonViewer;
