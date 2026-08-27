import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { getInitialTheme } from '../utils/themeHelper';
import { API_BASE_URL } from '../config/api';

import type { ExerciseMock, TestCaseMock, SubmitStats, SubmissionItem } from '../components/practice/types';
import { PracticeHeader } from '../components/practice/PracticeHeader';
import { ProblemDescriptionPanel } from '../components/practice/ProblemDescriptionPanel';
import { CodeEditorPanel } from '../components/practice/CodeEditorPanel';
import { TerminalPanel } from '../components/practice/TerminalPanel';

const Practice: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(getInitialTheme());

    useEffect(() => {
        const handleThemeChange = () => {
            setCurrentTheme(getInitialTheme());
        };
        window.addEventListener('theme-change', handleThemeChange);
        return () => window.removeEventListener('theme-change', handleThemeChange);
    }, []);

    // 1. Quản trị Dữ liệu Bài học & Bài tập
    const [lesson, setLesson] = useState<any>(null);
    const [exercises, setExercises] = useState<any[]>([]);
    const [currentExerciseIdx, setCurrentExerciseIdx] = useState<number>(0);
    const [exercise, setExercise] = useState<ExerciseMock | null>(null);
    const [code, setCode] = useState<string>('');
    const [customInput, setCustomInput] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    // 2. Quản trị Trạng thái UI & Tabs
    const [activeLeftTab, setActiveLeftTab] = useState<'desc' | 'submissions'>('desc');
    const [activeTerminalTab, setActiveTerminalTab] = useState<'console' | 'testcase'>('console');

    // 3. Quản trị Tiến trình Chạy/Nộp bài
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [consoleOutput, setConsoleOutput] = useState<string>('Bấm "Chạy thử" để xem kết quả đầu ra tại đây...');
    const [testcaseResults, setTestCaseResults] = useState<TestCaseMock[]>([]);
    const [isCompleted, setIsCompleted] = useState<boolean>(false);
    const [userCodes, setUserCodes] = useState<Record<string, string>>({});
    const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});

    // 4. Quản trị Thống kê Xếp hạng & Lịch sử nộp bài
    const [submitStats, setSubmitStats] = useState<SubmitStats | null>(null);
    const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);

    // Tải dữ liệu bài học từ API
    useEffect(() => {
        const fetchLessonData = async () => {
            if (!id) return;
            setLoading(true);
            setError('');
            setIsCompleted(false);
            setTestCaseResults([]);
            setConsoleOutput('Bấm "Chạy thử" để xem kết quả đầu ra tại đây...');
            setSubmitStats(null);
            setSubmissions([]);
            setCompletedExercises({});

            try {
                const data = await authService.getLessonDetail(id);
                setLesson(data);

                if (data.codingExercises && data.codingExercises.length > 0) {
                    setExercises(data.codingExercises);
                    setCurrentExerciseIdx(0);

                    const initialCodes: Record<string, string> = {};
                    data.codingExercises.forEach((ex: any) => {
                        initialCodes[ex.id] = ex.starterCode || '# Viết code Python của bạn ở đây\n';
                    });
                    setUserCodes(initialCodes);

                    const firstEx = data.codingExercises[0];
                    setExercise({
                        id: firstEx.id,
                        title: firstEx.title,
                        difficulty: firstEx.difficulty,
                        problemDescription: firstEx.problemDescription,
                        starterCode: firstEx.starterCode || '# Viết code Python của bạn ở đây\n',
                        testCases: firstEx.testCases || []
                    });
                    setCode(firstEx.starterCode || '# Viết code Python của bạn ở đây\n');

                    if (firstEx.testCases && firstEx.testCases.length > 0) {
                        setCustomInput(firstEx.testCases[0].input || '');
                    } else {
                        setCustomInput('');
                    }

                    // Tải trạng thái hoàn thành bài nộp
                    const token = localStorage.getItem('token');
                    if (token) {
                        const compStatus: Record<string, boolean> = {};
                        await Promise.all(
                            data.codingExercises.map(async (ex: any) => {
                                try {
                                    const resSub = await axios.get(`${API_BASE_URL}/api/auth/exercises/${ex.id}/submissions`, {
                                        headers: { Authorization: `Bearer ${token}` }
                                    });
                                    const hasPassed = resSub.data.some((sub: any) => sub.status === 'PASSED');
                                    compStatus[ex.id] = hasPassed;
                                } catch (e) {
                                    console.error('Lỗi khi lấy lịch sử bài nộp cho bài tập:', ex.id, e);
                                }
                            })
                        );
                        setCompletedExercises(compStatus);

                        const allExPassed = data.codingExercises.every((ex: any) => compStatus[ex.id]);
                        if (allExPassed) {
                            setIsCompleted(true);
                        }
                    }
                } else {
                    setExercises([]);
                    setCurrentExerciseIdx(0);
                    setExercise(null);
                    setCode('');
                    setCustomInput('');
                }

                setActiveLeftTab('desc');
            } catch (err: any) {
                console.error('Lỗi khi fetch thông tin bài học:', err);
                setError('Không thể tải dữ liệu bài học. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchLessonData();
    }, [id]);

    const selectExercise = (idx: number) => {
        if (idx < 0 || idx >= exercises.length) return;

        if (exercise) {
            setUserCodes(prev => ({ ...prev, [exercise.id]: code }));
        }

        const nextEx = exercises[idx];
        setCurrentExerciseIdx(idx);
        setExercise({
            id: nextEx.id,
            title: nextEx.title,
            difficulty: nextEx.difficulty,
            problemDescription: nextEx.problemDescription,
            starterCode: nextEx.starterCode || '# Viết code Python của bạn ở đây\n',
            testCases: nextEx.testCases || []
        });

        const savedCode = userCodes[nextEx.id] !== undefined
            ? userCodes[nextEx.id]
            : (nextEx.starterCode || '# Viết code Python của bạn ở đây\n');
        setCode(savedCode);

        setConsoleOutput('Bấm "Chạy thử" để xem kết quả đầu ra tại đây...');
        setTestCaseResults([]);
        setSubmitStats(null);
        setActiveLeftTab('desc');
        setActiveTerminalTab('console');

        if (nextEx.testCases && nextEx.testCases.length > 0) {
            setCustomInput(nextEx.testCases[0].input || '');
        } else {
            setCustomInput('');
        }
    };

    const handleCodeChange = (newVal: string) => {
        setCode(newVal);
        if (exercise) {
            setUserCodes(prev => ({ ...prev, [exercise.id]: newVal }));
        }
    };

    const fetchSubmissions = async () => {
        if (!exercise) return;
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/api/auth/exercises/${exercise.id}/submissions`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSubmissions(response.data);
        } catch (err) {
            console.error('Lỗi khi tải lịch sử nộp bài:', err);
        }
    };

    useEffect(() => {
        if (activeLeftTab === 'submissions' && exercise) {
            fetchSubmissions();
        }
    }, [activeLeftTab, exercise]);

    const handleRunCode = async () => {
        if (!code.trim()) {
            setConsoleOutput('Lỗi: Mã nguồn không được để trống!');
            return;
        }
        setIsRunning(true);
        setConsoleOutput('Đang chạy code trong môi trường sandbox...');
        setActiveTerminalTab('console');

        try {
            const isSql = lesson?.lessonId?.startsWith('SQL-') || /SELECT|FROM/i.test(code);
            const response = await axios.post(`${API_BASE_URL}/api/auth/compiler/run`, {
                code,
                input: customInput,
                language: isSql ? 'SQL' : 'PYTHON'
            });
            setIsRunning(false);
            if (response.data.success) {
                setConsoleOutput(`[stdout]\n${response.data.output}\n\n[Thực thi hoàn tất]`);
            } else {
                setConsoleOutput(`[stderr/error]\n${response.data.output}\n\n[Thực thi gặp lỗi]`);
            }
        } catch (err: any) {
            setIsRunning(false);
            setConsoleOutput(`Lỗi hệ thống biên dịch: ${err.message}`);
        }
    };

    const handleSubmitCode = async () => {
        if (!exercise) return;
        if (!code.trim()) {
            setConsoleOutput('Lỗi: Mã nguồn không được để trống!');
            return;
        }
        setIsSubmitting(true);
        setActiveTerminalTab('console');
        setConsoleOutput('Đang gửi bài và chạy kiểm tra trên server...');
        setSubmitStats(null);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${API_BASE_URL}/api/auth/exercises/${exercise.id}/submit`,
                { code },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setIsSubmitting(false);

            if (response.data.success) {
                const { allPassed, results, runtimeMs, runtimeBeats, distribution, message } = response.data;
                setTestCaseResults(results);

                if (allPassed) {
                    queryClient.invalidateQueries();
                    const updatedCompleted = { ...completedExercises, [exercise.id]: true };
                    setCompletedExercises(updatedCompleted);

                    setSubmitStats({ runtimeMs, runtimeBeats, distribution });

                    const allPassedLesson = exercises.every(ex => updatedCompleted[ex.id]);
                    if (allPassedLesson) {
                        setIsCompleted(true);
                        setConsoleOutput(`🎉 Tuyệt vời! Bạn đã vượt qua tất cả các bài tập trong bài học này.\nTrạng thái bài học: HOÀN THÀNH`);
                    } else {
                        setConsoleOutput(`🎉 Tuyệt vời! Bạn đã vượt qua tất cả ${results.length}/${results.length} testcases của bài tập này.\nHãy tiếp tục hoàn thành các bài tập còn lại!`);
                    }

                    if (activeLeftTab === 'submissions') {
                        fetchSubmissions();
                    }
                } else {
                    setSubmitStats(null);
                    const updatedCompleted = { ...completedExercises, [exercise.id]: false };
                    setCompletedExercises(updatedCompleted);
                    setIsCompleted(false);
                    if (message) {
                        setConsoleOutput(`❌ [Lỗi ràng buộc cú pháp]: ${message}`);
                    } else {
                        setConsoleOutput(`❌ Kết quả: Vượt qua ${results.filter((r: any) => r.passed).length}/${results.length} testcases. Vui lòng kiểm tra lại logic.`);
                    }
                }
            } else {
                setSubmitStats(null);
                const updatedCompleted = { ...completedExercises, [exercise.id]: false };
                setCompletedExercises(updatedCompleted);
                setIsCompleted(false);
                setConsoleOutput(`❌ Lỗi biên dịch/thực thi:\n${response.data.output || 'Không xác định'}`);
            }
        } catch (err: any) {
            setIsSubmitting(false);
            setSubmitStats(null);
            if (err.response?.status === 401 || err.response?.status === 403) {
                setConsoleOutput('❌ Lỗi chấm bài: Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại để tiếp tục.');
            } else {
                setConsoleOutput(`Lỗi chấm bài: ${err.response?.data?.error || err.message}`);
            }
        }
    };

    const handleCompleteWithoutExercise = () => {
        setIsCompleted(true);
        setConsoleOutput('🎉 Chúc mừng! Bạn đã hoàn thành học phần lý thuyết bài học này.\nTrạng thái bài học: HOÀN THÀNH');
    };

    if (loading) {
        return (
            <div className="bg-bg-primary text-text-primary min-h-screen flex items-center justify-center font-sans">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-accent-custom border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs text-text-tertiary">Đang tải dữ liệu bài học...</span>
                </div>
            </div>
        );
    }

    if (error || !lesson) {
        return (
            <div className="bg-bg-primary text-text-primary min-h-screen flex items-center justify-center font-sans">
                <div className="text-center flex flex-col gap-4">
                    <span className="text-sm text-rose-400">{error || 'Không tìm thấy thông tin bài học.'}</span>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="bg-bg-tertiary hover:bg-bg-tertiary/80 text-text-primary px-4 py-2 rounded-lg text-xs font-semibold border border-border-custom"
                    >
                        Quay lại Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const isSql = lesson?.lessonId?.startsWith('SQL-') || /SELECT|FROM/i.test(code);

    return (
        <div className="bg-bg-primary text-text-primary min-h-screen flex flex-col font-sans select-none overflow-hidden h-screen transition-colors duration-200">
            {/* 1. Header Component */}
            <PracticeHeader lessonTitle={lesson.title} />

            {/* 2. Split Panels Container */}
            <main className="flex-1 overflow-hidden p-2">
                <PanelGroup direction="horizontal">
                    {/* Cột Trái: Đề bài & Lịch sử nộp bài */}
                    <Panel defaultSize={35} minSize={25}>
                        <ProblemDescriptionPanel
                            lessonId={id || ''}
                            exercises={exercises}
                            currentExerciseIdx={currentExerciseIdx}
                            exercise={exercise}
                            completedExercises={completedExercises}
                            activeLeftTab={activeLeftTab}
                            submissions={submissions}
                            onSelectExercise={selectExercise}
                            onTabChange={setActiveLeftTab}
                            onRestoreCode={setCode}
                        />
                    </Panel>

                    {/* Thanh kéo chia chiều rộng */}
                    <PanelResizeHandle className="w-1.5 hover:w-2 bg-transparent hover:bg-accent-custom/30 transition-all cursor-col-resize rounded" />

                    {/* Cột Phải: Code Editor (trên) & Terminal Output (dưới) */}
                    <Panel defaultSize={65} minSize={40} className="flex flex-col h-full ml-1">
                        <PanelGroup direction="vertical">
                            {/* Khung Editor */}
                            <Panel defaultSize={65} minSize={30}>
                                <CodeEditorPanel
                                    isSql={isSql}
                                    currentTheme={currentTheme}
                                    code={code}
                                    exercise={exercise}
                                    onCodeChange={handleCodeChange}
                                    onResetCode={() => exercise && setCode(exercise.starterCode)}
                                />
                            </Panel>

                            {/* Thanh kéo chia chiều cao */}
                            <PanelResizeHandle className="h-1.5 hover:h-2 bg-transparent hover:bg-accent-custom/30 transition-all cursor-row-resize rounded" />

                            {/* Khung Terminal & Console Output */}
                            <Panel defaultSize={35} minSize={20}>
                                <TerminalPanel
                                    activeTerminalTab={activeTerminalTab}
                                    consoleOutput={consoleOutput}
                                    submitStats={submitStats}
                                    testcaseResults={testcaseResults}
                                    customInput={customInput}
                                    exercise={exercise}
                                    exercisesCount={exercises.length}
                                    currentExerciseIdx={currentExerciseIdx}
                                    completedExercises={completedExercises}
                                    isCompleted={isCompleted}
                                    nextLessonId={lesson?.nextLessonId}
                                    isRunning={isRunning}
                                    isSubmitting={isSubmitting}
                                    onTabChange={setActiveTerminalTab}
                                    onCustomInputChange={setCustomInput}
                                    onRunCode={handleRunCode}
                                    onSubmitCode={handleSubmitCode}
                                    onNextExercise={() => selectExercise(currentExerciseIdx + 1)}
                                    onCompleteWithoutExercise={handleCompleteWithoutExercise}
                                />
                            </Panel>
                        </PanelGroup>
                    </Panel>
                </PanelGroup>
            </main>
        </div>
    );
};

export default Practice;
