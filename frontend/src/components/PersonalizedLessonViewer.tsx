import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import axios from 'axios';

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
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden shadow-2xl">
            {/* Header Navigation Tabs */}
            <div className="flex border-b border-[#30363D] bg-[#0D1117] px-6 pt-4 gap-4">
                <button
                    onClick={() => setActiveTab('THEORY')}
                    className={`pb-3 px-4 font-semibold text-sm transition-colors border-b-2 ${
                        activeTab === 'THEORY'
                            ? 'border-[#58A6FF] text-[#58A6FF]'
                            : 'border-transparent text-gray-400 hover:text-white'
                    }`}
                >
                    📖 1. Lý Thuyết Cá Nhân Hóa
                </button>
                <button
                    onClick={() => setActiveTab('QUIZ')}
                    className={`pb-3 px-4 font-semibold text-sm transition-colors border-b-2 ${
                        activeTab === 'QUIZ'
                            ? 'border-[#58A6FF] text-[#58A6FF]'
                            : 'border-transparent text-gray-400 hover:text-white'
                    }`}
                >
                    ❓ 2. Trắc Nghiệm Củng Cố ({lesson.quizzes?.length || 0})
                </button>
                {lesson.exercise && (
                    <button
                        onClick={() => setActiveTab('PRACTICE')}
                        className={`pb-3 px-4 font-semibold text-sm transition-colors border-b-2 ${
                            activeTab === 'PRACTICE'
                                ? 'border-[#58A6FF] text-[#58A6FF]'
                                : 'border-transparent text-gray-400 hover:text-white'
                        }`}
                    >
                        ⚡ 3. Thực Hành Lập Trình Cách Ly
                    </button>
                )}
            </div>

            {/* Tab 1: Theory Markdown */}
            {activeTab === 'THEORY' && (
                <div className="p-8 text-gray-200 leading-relaxed max-h-[70vh] overflow-y-auto prose prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {lesson.theoryContent}
                    </ReactMarkdown>
                    <div className="mt-8 pt-6 border-t border-[#30363D] flex justify-end">
                        <button
                            onClick={() => setActiveTab('QUIZ')}
                            className="bg-[#238636] hover:bg-[#2EA043] text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-lg"
                        >
                            Chuyển Sang Bài Trắc Nghiệm ➔
                        </button>
                    </div>
                </div>
            )}

            {/* Tab 2: MCQ Quizzes */}
            {activeTab === 'QUIZ' && (
                <div className="p-8 max-h-[70vh] overflow-y-auto space-y-8">
                    {lesson.quizzes.map((q, idx) => {
                        const result = quizResults[q.id];
                        const selected = quizAnswers[q.id];

                        return (
                            <div key={q.id} className="bg-[#0D1117] border border-[#30363D] p-6 rounded-xl space-y-4">
                                <h4 className="text-base font-bold text-white flex items-center gap-2">
                                    <span className="bg-[#1F6FE5] text-white text-xs px-2.5 py-1 rounded-full">
                                        Câu {idx + 1}
                                    </span>
                                    {q.question}
                                </h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                                    {(['A', 'B', 'C', 'D'] as const).map(optKey => {
                                        const optText = q[`option${optKey}` as keyof Quiz] as string;
                                        const isSelected = selected === optKey;

                                        return (
                                            <button
                                                key={optKey}
                                                onClick={() => handleSelectQuizOption(q.id, optKey)}
                                                className={`text-left p-3.5 rounded-lg border transition-all text-sm flex items-center gap-3 ${
                                                    isSelected
                                                        ? 'border-[#58A6FF] bg-[#1F6FE5]/10 text-white font-medium'
                                                        : 'border-[#30363D] bg-[#161B22] text-gray-300 hover:border-gray-500'
                                                }`}
                                            >
                                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                                    isSelected ? 'bg-[#1F6FE5] text-white' : 'bg-[#21262D] text-gray-400'
                                                }`}>
                                                    {optKey}
                                                </span>
                                                {optText}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="flex items-center justify-between pt-3">
                                    <button
                                        disabled={!selected}
                                        onClick={() => handleCheckQuiz(q.id)}
                                        className="bg-[#1F6FE5] disabled:opacity-50 hover:bg-[#388BFD] text-white px-4 py-2 rounded-lg text-xs font-bold tracking-wide"
                                    >
                                        Kiểm Tra Đáp Án
                                    </button>

                                    {result && (
                                        <span className={`text-xs font-bold px-3 py-1 rounded ${
                                            result.isCorrect ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                        }`}>
                                            {result.isCorrect ? '✓ CHÍNH XÁC!' : '❌ CHƯA ĐÚNG'}
                                        </span>
                                    )}
                                </div>

                                {result && (
                                    <div className="mt-3 p-4 bg-[#161B22] border border-[#30363D] rounded-lg text-xs text-gray-300 leading-relaxed">
                                        <p className="font-bold text-[#58A6FF] mb-1">💡 Giải thích chi tiết:</p>
                                        {result.explanation}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {lesson.exercise && (
                        <div className="pt-4 flex justify-end">
                            <button
                                onClick={() => setActiveTab('PRACTICE')}
                                className="bg-[#238636] hover:bg-[#2EA043] text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-lg"
                            >
                                Chuyển Sang Bài Tập Lập Trình ➔
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Tab 3: Practical Coding Exercise */}
            {activeTab === 'PRACTICE' && lesson.exercise && (
                <div className="p-6 space-y-6">
                    <div className="bg-[#0D1117] border border-[#30363D] p-5 rounded-xl">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-bold text-white">{lesson.exercise.title}</h3>
                            <span className="text-xs font-bold px-2.5 py-1 rounded bg-[#238636]/20 text-[#3FB950] border border-[#238636]/40">
                                {lesson.exercise.difficulty}
                            </span>
                        </div>
                        <div className="prose prose-invert max-w-none text-sm text-gray-300">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {lesson.exercise.problemDescription}
                            </ReactMarkdown>
                        </div>
                    </div>

                    <div className="border border-[#30363D] rounded-xl overflow-hidden">
                        <div className="bg-[#0D1117] px-4 py-2 border-b border-[#30363D] flex justify-between items-center">
                            <span className="text-xs font-bold text-gray-400">🐍 Python Code Editor (Monaco)</span>
                            <button
                                onClick={handleSubmitExercise}
                                disabled={submittingCode}
                                className="bg-[#238636] hover:bg-[#2EA043] text-white px-5 py-1.5 rounded text-xs font-bold transition-all shadow disabled:opacity-50"
                            >
                                {submittingCode ? '⏳ Đang Chạy Docker Sandbox...' : '🚀 Nộp Bài Thực Hành'}
                            </button>
                        </div>
                        <Editor
                            height="280px"
                            language="python"
                            theme="vs-dark"
                            value={code}
                            onChange={(val) => setCode(val || '')}
                            options={{
                                fontSize: 13,
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                automaticLayout: true
                            }}
                        />
                    </div>

                    {/* Execution Output */}
                    {executionOutput && (
                        <div className={`p-4 rounded-xl border ${
                            executionOutput.isPassed
                                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                                : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                        }`}>
                            <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                                {executionOutput.isPassed ? '🎉 KẾT QUẢ: KHỚP 100% TEST CASES!' : '❌ KẾT QUẢ: CHƯA ĐẠT CHUẨN'}
                            </h4>
                            {executionOutput.results && (
                                <div className="space-y-2 mt-3">
                                    {executionOutput.results.map((res: any, i: number) => (
                                        <div key={i} className="text-xs p-2.5 bg-[#0D1117] rounded border border-[#30363D] flex justify-between items-center">
                                            <span>Testcase #{i + 1}: Input <code>{res.input}</code></span>
                                            <span className={res.passed ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                                                {res.passed ? 'PASSED ✓' : 'FAILED ✗'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
