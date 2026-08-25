import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { authService } from '../services/authService';
import { ThemeToggle } from '../components/ThemeToggle';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface DBQuizOption {
    id: string;
    key: string;
    text: string;
}

interface DBQuizQuestion {
    id: string;
    question: string;
    level?: string;
    orderIndex: number;
    options: DBQuizOption[];
}

interface QuestionResult {
    questionId: string;
    selectedKey: string;
    correctKey: string;
    isCorrect: boolean;
    explanation: string;
}

const Quiz: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // 1. Tải thông tin bài học
    const { data: lesson, isLoading: loadingLesson } = useQuery({
        queryKey: ['lesson', id],
        queryFn: () => authService.getLessonDetail(id!),
        enabled: !!id,
    });

    // 2. Tải danh sách câu hỏi trắc nghiệm từ Database
    const { data: quizData, isLoading: loadingQuiz, error } = useQuery({
        queryKey: ['lesson-quiz', id],
        queryFn: () => authService.getLessonQuiz(id!),
        enabled: !!id,
    });

    const questions: DBQuizQuestion[] = quizData?.questions || [];

    const [currentIdx, setCurrentIdx] = useState<number>(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState<boolean>(false);
    const [currentResult, setCurrentResult] = useState<QuestionResult | null>(null);
    const [score, setScore] = useState<number>(0);
    const [isCompleted, setIsCompleted] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const isLoading = loadingLesson || loadingQuiz;

    if (isLoading) {
        return (
            <div className="bg-bg-primary text-text-primary min-h-screen flex items-center justify-center font-sans">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-accent-custom border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs text-text-tertiary">Đang tải câu hỏi trắc nghiệm từ Database...</span>
                </div>
            </div>
        );
    }

    if (error || !lesson) {
        return (
            <div className="bg-bg-primary text-text-primary min-h-screen flex flex-col items-center justify-center gap-4 font-sans">
                <span className="text-sm text-rose-400">Không tìm thấy thông tin bài học</span>
                <Link to="/dashboard" className="text-xs text-accent-custom hover:underline">Quay lại Dashboard</Link>
            </div>
        );
    }

    // Nếu bài học chưa có câu hỏi trong CSDL
    if (questions.length === 0) {
        return (
            <div className="bg-bg-primary text-text-primary min-h-screen flex flex-col font-sans transition-colors duration-200">
                <header className="h-14 border-b border-border-custom bg-bg-secondary px-6 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <span className="text-xl font-bold tracking-tight text-text-primary cursor-pointer" onClick={() => navigate('/dashboard')}>
                            MCODE
                        </span>
                        <div className="h-4 w-[1px] bg-border-custom"></div>
                        <span className="text-xs text-text-tertiary font-medium">Trắc nghiệm: {lesson.title}</span>
                    </div>
                    <ThemeToggle />
                </header>
                <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <div className="bg-bg-secondary border border-border-custom p-8 rounded-2xl max-w-md w-full flex flex-col items-center gap-4 shadow-sm">
                        <span className="text-4xl">📝</span>
                        <h2 className="text-lg font-bold text-text-primary">Chưa có câu hỏi trắc nghiệm</h2>
                        <p className="text-xs text-text-secondary">Bài học này hiện chưa có câu hỏi trắc nghiệm được lưu trong Database.</p>
                        <div className="flex gap-3 mt-2 w-full">
                            <button
                                onClick={() => navigate(`/lesson/${id}`)}
                                className="flex-1 py-2.5 px-4 bg-bg-tertiary hover:bg-bg-tertiary/80 text-text-primary rounded-xl text-xs font-semibold border border-border-custom transition-all"
                            >
                                Đọc lại lý thuyết
                            </button>
                            {lesson.codingExercises && lesson.codingExercises.length > 0 ? (
                                <button
                                    onClick={() => navigate(`/practice/${id}`)}
                                    className="flex-1 py-2.5 px-4 bg-accent-custom hover:bg-accent-hover text-white rounded-xl text-xs font-semibold border-none transition-all shadow"
                                >
                                    Làm bài thực hành ➔
                                </button>
                            ) : (
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="flex-1 py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold border-none transition-all shadow"
                                >
                                    Quay lại Dashboard
                                </button>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    const currentQuestion = questions[currentIdx];
    const progressPercent = ((currentIdx + 1) / questions.length) * 100;

    const handleSelectOption = (key: string) => {
        if (isAnswered) return;
        setSelectedOption(key);
    };

    const handleCheckAnswer = async () => {
        if (!selectedOption || isAnswered || isSubmitting) return;

        setIsSubmitting(true);
        try {
            // Gửi câu trả lời lên server để chấm bảo mật từ Database
            const res = await authService.submitLessonQuiz(id!, {
                [currentQuestion.id]: selectedOption
            });

            const result = res.results.find((r: QuestionResult) => r.questionId === currentQuestion.id);
            if (result) {
                setCurrentResult(result);
                setIsAnswered(true);
                if (result.isCorrect) {
                    setScore(prev => prev + 1);
                }
            }
        } catch (err) {
            console.error('Lỗi khi chấm bài trắc nghiệm:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNextQuestion = () => {
        if (currentIdx < questions.length - 1) {
            setCurrentIdx(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
            setCurrentResult(null);
        } else {
            setIsCompleted(true);
        }
    };

    const handleRestartQuiz = () => {
        setCurrentIdx(0);
        setSelectedOption(null);
        setIsAnswered(false);
        setCurrentResult(null);
        setScore(0);
        setIsCompleted(false);
    };

    const handleFinishLesson = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `http://localhost:3000/api/auth/lessons/${id}/complete`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            queryClient.invalidateQueries();
            if (lesson.nextLessonId) {
                navigate(`/lesson/${lesson.nextLessonId}`);
            } else {
                navigate('/dashboard');
            }
        } catch (e) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="bg-bg-primary text-text-primary min-h-screen flex flex-col font-sans select-none transition-colors duration-200">
            {/* Header */}
            <header className="h-14 border-b border-border-custom bg-bg-secondary px-6 md:px-12 flex justify-between items-center shrink-0 sticky top-0 z-50 transition-colors duration-200">
                <div className="flex items-center gap-3">
                    <span
                        className="text-xl font-bold tracking-tight text-text-primary cursor-pointer hover:text-accent-custom transition-colors"
                        onClick={() => navigate('/dashboard')}
                    >
                        MCODE
                    </span>
                    <div className="h-4 w-[1px] bg-border-custom"></div>
                    <button
                        onClick={() => navigate(`/lesson/${id}`)}
                        className="text-xs text-text-tertiary hover:text-text-primary bg-transparent border-none cursor-pointer flex items-center gap-1 transition-colors"
                    >
                        <span>←</span> <span className="hidden sm:inline">Quay lại lý thuyết:</span> <span className="font-semibold text-text-primary truncate max-w-[200px] sm:max-w-xs">{lesson.title}</span>
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <Link
                        to="/dashboard"
                        className="text-xs text-text-secondary hover:text-text-primary no-underline transition-colors px-3 py-1.5 rounded-lg hover:bg-bg-tertiary border border-border-custom"
                    >
                        Dashboard
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 max-w-4xl w-full mx-auto">
                {!isCompleted ? (
                    <div className="w-full flex flex-col gap-6">
                        {/* Progress Bar & Header Meta */}
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-accent-custom tracking-wider uppercase">
                                    Câu hỏi {currentIdx + 1} / {questions.length}
                                </span>
                                <span className="text-text-tertiary">
                                    Điểm số: <strong className="text-emerald-400">{score}</strong> / {questions.length}
                                </span>
                            </div>
                            <div className="w-full h-2 bg-bg-tertiary rounded-full overflow-hidden border border-border-custom/50">
                                <div
                                    className="h-full bg-accent-custom transition-all duration-300 rounded-full"
                                    style={{ width: `${progressPercent}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Question Card */}
                        <div className="bg-bg-secondary border border-border-custom p-6 sm:p-8 rounded-2xl shadow-sm flex flex-col gap-6 transition-colors duration-200">
                            <div className="flex flex-col gap-3">
                                {currentQuestion.level && (
                                    <span className="text-[11px] font-bold px-2.5 py-1 bg-accent-bg text-accent-custom border border-accent-border rounded-lg w-fit">
                                        {currentQuestion.level}
                                    </span>
                                )}
                                <div className="text-text-primary select-text">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        rehypePlugins={[rehypeRaw]}
                                        components={{
                                            p: ({ node, ...props }) => (
                                                <p className="text-sm sm:text-base font-medium leading-relaxed mb-3 last:mb-0 text-text-primary" {...props} />
                                            ),
                                            strong: ({ node, ...props }) => <strong className="font-bold text-text-primary" {...props} />,
                                            em: ({ node, ...props }) => <em className="italic text-text-secondary" {...props} />,
                                            ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-2.5 text-xs sm:text-sm text-text-secondary flex flex-col gap-1" {...props} />,
                                            ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-2.5 text-xs sm:text-sm text-text-secondary flex flex-col gap-1" {...props} />,
                                            li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                                            code: ({ node, className, children, ...props }) => {
                                                const contentStr = String(children || '');
                                                const hasNewline = contentStr.includes('\n');
                                                const match = /language-(\w+)/.exec(className || '');
                                                const isInline = !match && !hasNewline;

                                                return isInline ? (
                                                    <code className="bg-accent-bg text-accent-custom border border-accent-border px-1.5 py-0.5 rounded font-mono text-xs font-semibold mx-0.5" {...props}>
                                                        {children}
                                                    </code>
                                                ) : (
                                                    <div className="my-2.5 rounded-xl overflow-hidden border border-border-custom bg-pre-bg shadow-sm">
                                                        {match && (
                                                            <div className="bg-bg-tertiary/70 border-b border-border-custom px-3.5 py-1 flex items-center justify-between text-[11px] font-mono text-text-tertiary">
                                                                <span className="font-bold uppercase tracking-wider text-accent-custom">{match[1]}</span>
                                                            </div>
                                                        )}
                                                        <pre className="p-3.5 overflow-x-auto text-xs sm:text-sm font-mono text-text-primary leading-relaxed">
                                                            <code className={className} {...props}>
                                                                {children}
                                                            </code>
                                                        </pre>
                                                    </div>
                                                );
                                            },
                                            table: ({ node, ...props }) => (
                                                <div className="overflow-x-auto w-full border border-border-custom rounded-xl my-2 shadow-xs bg-bg-primary/40">
                                                    <table className="w-full text-xs text-left border-collapse" {...props} />
                                                </div>
                                            ),
                                            thead: ({ node, ...props }) => <thead className="bg-bg-tertiary border-b border-border-custom font-semibold text-text-primary text-[11px] uppercase tracking-wider" {...props} />,
                                            tbody: ({ node, ...props }) => <tbody className="divide-y divide-border-custom/50 text-[11px] sm:text-xs" {...props} />,
                                            tr: ({ node, ...props }) => <tr className="hover:bg-bg-tertiary/40 transition-colors" {...props} />,
                                            th: ({ node, ...props }) => <th className="px-3 py-2 font-bold text-text-primary border-r border-border-custom/60 last:border-r-0" {...props} />,
                                            td: ({ node, ...props }) => <td className="px-3 py-1.5 text-text-secondary border-r border-border-custom/40 last:border-r-0 font-medium" {...props} />
                                        }}
                                    >
                                        {currentQuestion.question}
                                    </ReactMarkdown>
                                </div>
                            </div>

                            {/* Options List */}
                            <div className="flex flex-col gap-3">
                                {currentQuestion.options.map((opt) => {
                                    const isSelected = selectedOption === opt.key;
                                    const isCorrect = currentResult && opt.key === currentResult.correctKey;
                                    const isWrongSelected = currentResult && isSelected && !currentResult.isCorrect;

                                    let optionStyle = "bg-bg-tertiary/40 border-border-custom text-text-primary hover:border-accent-custom/50 hover:bg-bg-tertiary/80";

                                    if (isAnswered && currentResult) {
                                        if (isCorrect) {
                                            optionStyle = "bg-emerald-500/15 border-emerald-500 text-emerald-400 font-semibold shadow-sm";
                                        } else if (isWrongSelected) {
                                            optionStyle = "bg-rose-500/15 border-rose-500 text-rose-400 font-semibold shadow-sm";
                                        } else {
                                            optionStyle = "bg-bg-tertiary/20 border-border-custom/40 text-text-tertiary opacity-60";
                                        }
                                    } else if (isSelected) {
                                        optionStyle = "bg-accent-bg border-accent-custom text-accent-custom font-semibold shadow-sm";
                                    }

                                    return (
                                        <button
                                            key={opt.id}
                                            disabled={isAnswered}
                                            onClick={() => handleSelectOption(opt.key)}
                                            className={`p-4 rounded-xl border text-left transition-all duration-200 flex items-start gap-3 cursor-pointer disabled:cursor-default ${optionStyle}`}
                                        >
                                            <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 border ${
                                                isAnswered && isCorrect
                                                    ? 'bg-emerald-500 text-white border-emerald-600'
                                                    : isAnswered && isWrongSelected
                                                    ? 'bg-rose-500 text-white border-rose-600'
                                                    : isSelected
                                                    ? 'bg-accent-custom text-white dark:text-[#030303] border-accent-custom'
                                                    : 'bg-bg-secondary text-text-tertiary border-border-custom'
                                            }`}>
                                                {opt.key}
                                            </span>
                                            <div className="text-xs sm:text-sm leading-relaxed select-text flex-1">
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    rehypePlugins={[rehypeRaw]}
                                                    components={{
                                                        p: ({ node, ...props }) => <span className="leading-relaxed" {...props} />,
                                                        code: ({ node, children, ...props }) => {
                                                            const codeStr = String(children || '');
                                                            const isSqlOrLong = codeStr.length > 20 || /\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|JOIN|GROUP\s+BY|ORDER\s+BY)\b/i.test(codeStr);

                                                            return isSqlOrLong ? (
                                                                <span className="font-mono text-xs sm:text-[13px] text-text-primary bg-bg-tertiary/70 border border-border-custom px-3 py-1.5 rounded-lg block w-full overflow-x-auto my-0.5 leading-relaxed">
                                                                    {children}
                                                                </span>
                                                            ) : (
                                                                <code className="bg-bg-secondary text-accent-custom border border-border-custom px-1.5 py-0.5 rounded font-mono text-xs font-semibold mx-0.5" {...props}>
                                                                    {children}
                                                                </code>
                                                            );
                                                        }
                                                    }}
                                                >
                                                    {opt.text}
                                                </ReactMarkdown>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Explanation Box */}
                            {isAnswered && currentResult && (
                                <div className={`p-4 rounded-xl border flex flex-col gap-1.5 transition-all duration-300 ${
                                    currentResult.isCorrect
                                        ? 'bg-emerald-500/10 border-emerald-500/30'
                                        : 'bg-rose-500/10 border-rose-500/30'
                                }`}>
                                    <div className="flex items-center gap-1.5 font-bold text-xs">
                                        {currentResult.isCorrect ? (
                                            <span className="text-emerald-400">CHÍNH XÁC</span>
                                        ) : (
                                            <span className="text-rose-400">CHƯA CHÍNH XÁC — Đáp án đúng là {currentResult.correctKey}</span>
                                        )}
                                    </div>
                                    <div className="text-xs text-text-secondary leading-relaxed m-0 select-text">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            rehypePlugins={[rehypeRaw]}
                                            components={{
                                                p: ({ node, ...props }) => <p className="m-0 leading-relaxed" {...props} />,
                                                code: ({ node, ...props }) => (
                                                    <code className="bg-bg-secondary text-accent-custom border border-border-custom px-1.5 py-0.5 rounded font-mono text-[11px] font-semibold mx-0.5" {...props} />
                                                ),
                                                strong: ({ node, ...props }) => <strong className="font-bold text-text-primary" {...props} />
                                            }}
                                        >
                                            {currentResult.explanation}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            )}

                            {/* Action Button */}
                            <div className="flex justify-end pt-2">
                                {!isAnswered ? (
                                    <button
                                        disabled={!selectedOption || isSubmitting}
                                        onClick={handleCheckAnswer}
                                        className="bg-accent-custom hover:bg-accent-hover text-white dark:text-[#030303] px-6 py-3 rounded-xl text-xs font-bold cursor-pointer active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed border-none shadow"
                                    >
                                        {isSubmitting ? 'Đang kiểm tra...' : 'Kiểm tra đáp án'}
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleNextQuestion}
                                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl text-xs font-bold cursor-pointer active:scale-95 transition-all border-none shadow animate-pulse"
                                    >
                                        {currentIdx < questions.length - 1 ? 'Câu tiếp theo ➔' : 'Xem kết quả tổng kết ➔'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Completion Summary View */
                    <div className="bg-bg-secondary border border-border-custom p-8 rounded-3xl max-w-lg w-full flex flex-col items-center text-center gap-6 shadow-md transition-colors duration-200">
                        <div className="w-16 h-16 bg-accent-bg border border-accent-border rounded-2xl flex items-center justify-center font-bold text-accent-custom text-xl shadow-inner">
                            {Math.round((score / questions.length) * 100)}%
                        </div>

                        <div className="flex flex-col gap-2">
                            <h2 className="text-xl sm:text-2xl font-black text-text-primary">
                                {score === questions.length
                                    ? 'Hoàn thành xuất sắc 100%'
                                    : score >= questions.length / 2
                                    ? 'Hoàn thành bài trắc nghiệm'
                                    : 'Cần ôn lại lý thuyết thêm'}
                            </h2>
                            <p className="text-xs text-text-secondary">
                                Bạn đã trả lời đúng <strong className="text-emerald-400 font-bold text-sm">{score}</strong> trên tổng số <strong className="text-text-primary font-bold text-sm">{questions.length}</strong> câu hỏi củng cố.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 w-full mt-2">
                            {lesson.codingExercises && lesson.codingExercises.length > 0 ? (
                                <button
                                    onClick={() => navigate(`/practice/${id}`)}
                                    className="w-full py-3.5 bg-accent-custom hover:bg-accent-hover text-white dark:text-[#030303] rounded-xl text-xs font-bold border-none transition-all shadow-md flex items-center justify-center gap-2"
                                >
                                    <span>Chuyển sang làm bài tập thực hành code</span>
                                    <span>➔</span>
                                </button>
                            ) : (
                                <button
                                    onClick={handleFinishLesson}
                                    className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold border-none transition-all shadow-md flex items-center justify-center gap-2"
                                >
                                    <span>{lesson.nextLessonId ? 'Bài học tiếp theo ➔' : 'Hoàn thành bài học'}</span>
                                </button>
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={handleRestartQuiz}
                                    className="flex-1 py-2.5 bg-bg-tertiary hover:bg-bg-tertiary/80 text-text-primary rounded-xl text-xs font-semibold border border-border-custom transition-all"
                                >
                                    Làm lại trắc nghiệm
                                </button>
                                <button
                                    onClick={() => navigate(`/lesson/${id}`)}
                                    className="flex-1 py-2.5 bg-bg-tertiary hover:bg-bg-tertiary/80 text-text-primary rounded-xl text-xs font-semibold border border-border-custom transition-all"
                                >
                                    Đọc lại lý thuyết
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Quiz;
