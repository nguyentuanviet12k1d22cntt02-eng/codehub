import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import axios from 'axios';
import { authService } from '../services/authService';
import { ThemeToggle } from '../components/ThemeToggle';
import { getInitialTheme } from '../utils/themeHelper';

interface TestCaseMock {
    id: string;
    input: string;
    expectedOutput: string;
    actualOutput?: string;
    passed?: boolean;
}

interface ExerciseMock {
    id: string;
    title: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    problemDescription: string;
    starterCode: string;
    testCases: TestCaseMock[];
}



const getReactTextContent = (node: any): string => {
    if (!node) return '';
    if (typeof node === 'string') return node;
    if (Array.isArray(node)) return node.map(getReactTextContent).join('');
    if (node.props && node.props.children) return getReactTextContent(node.props.children);
    return '';
};

const cleanAlertPrefix = (node: any): any => {
    if (!node) return node;
    if (typeof node === 'string') {
        return node
            .replace('[!NOTE]', '')
            .replace('[!WARNING]', '')
            .replace('[!TIP]', '')
            .replace('[!IMPORTANT]', '')
            .trim();
    }
    if (Array.isArray(node)) {
        return node.map(cleanAlertPrefix);
    }
    if (node.props && node.props.children) {
        return React.cloneElement(node, {
            ...node.props,
            children: cleanAlertPrefix(node.props.children)
        });
    }
    return node;
};

const Practice: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(getInitialTheme());

    useEffect(() => {
        const handleThemeChange = () => {
            setCurrentTheme(getInitialTheme());
        };
        window.addEventListener('theme-change', handleThemeChange);
        return () => window.removeEventListener('theme-change', handleThemeChange);
    }, []);

    // 1. Các State quản trị dữ liệu bài học & bài tập từ API
    const [lesson, setLesson] = useState<any>(null);
    const [exercise, setExercise] = useState<ExerciseMock | null>(null);
    const [code, setCode] = useState<string>('');
    const [customInput, setCustomInput] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    // 2. Các State quản trị UI
    const [activeLeftTab, setActiveLeftTab] = useState<'desc' | 'submissions'>('desc');
    const [activeTerminalTab, setActiveTerminalTab] = useState<'console' | 'testcase'>('console');
    
    // State chạy/nộp bài
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [consoleOutput, setConsoleOutput] = useState<string>('Bấm "Chạy thử" để xem kết quả đầu ra tại đây...');
    const [testcaseResults, setTestCaseResults] = useState<TestCaseMock[]>([]);
    const [isCompleted, setIsCompleted] = useState<boolean>(false);

    // State thống kê xếp hạng & lịch sử nộp bài
    const [submitStats, setSubmitStats] = useState<{
        runtimeMs: number;
        runtimeBeats: number;
        distribution: { range: string; count: number }[];
    } | null>(null);
    const [submissions, setSubmissions] = useState<any[]>([]);

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

            try {
                const data = await authService.getLessonDetail(id);
                setLesson(data);
                
                if (data.codingExercises && data.codingExercises.length > 0) {
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
                } else {
                    setExercise(null);
                    setCode('');
                    setCustomInput('');
                }
                
                // Mặc định luôn cho học thuyết trước
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

    const fetchSubmissions = async () => {
        if (!exercise) return;
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3000/api/auth/exercises/${exercise.id}/submissions`, {
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

    // 3. Logic xử lý gửi code chạy thử
    const handleRunCode = async () => {
        if (!code.trim()) {
            setConsoleOutput('Lỗi: Mã nguồn không được để trống!');
            return;
        }
        setIsRunning(true);
        setConsoleOutput('Đang chạy code trong môi trường sandbox...');
        setActiveTerminalTab('console');

        try {
            const response = await axios.post('http://localhost:3000/api/auth/compiler/run', {
                code,
                input: customInput
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

    // 4. Logic xử lý nộp bài chấm tất cả testcases
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
                `http://localhost:3000/api/auth/exercises/${exercise.id}/submit`,
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
                    setIsCompleted(true);
                    setSubmitStats({ runtimeMs, runtimeBeats, distribution });
                    setConsoleOutput(`🎉 Tuyệt vời! Bạn đã vượt qua tất cả ${results.length}/${results.length} testcases.\nTrạng thái bài học: HOÀN THÀNH`);
                    // Cập nhật lại lịch sử nộp bài nếu đang ở tab đó
                    if (activeLeftTab === 'submissions') {
                        fetchSubmissions();
                    }
                } else {
                    setSubmitStats(null);
                    setConsoleOutput(`❌ Kết quả: Vượt qua ${results.filter((r: any) => r.passed).length}/${results.length} testcases. ${message || 'Vui lòng kiểm tra lại logic.'}`);
                }
            } else {
                setSubmitStats(null);
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

    return (
        <div className="bg-bg-primary text-text-primary min-h-screen flex flex-col font-sans select-none overflow-hidden h-screen transition-colors duration-200">
            {/* Header */}
            <header className="flex justify-between items-center px-6 py-3 border-b border-border-custom bg-bg-secondary shrink-0 transition-colors duration-200">
                <div className="flex items-center gap-4">
                    <span 
                        className="text-xl font-bold tracking-tight text-text-primary cursor-pointer"
                        onClick={() => navigate('/dashboard')}
                    >
                        MCODE
                    </span>
                    <div className="h-4 w-[1px] bg-border-custom"></div>
                    <span className="text-xs text-text-tertiary font-medium">
                        Bài học: <span className="text-text-primary font-semibold">{lesson.title}</span>
                    </span>
                </div>
                
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <Link 
                        to="/dashboard" 
                        className="text-xs text-text-secondary hover:text-text-primary no-underline transition-colors px-3 py-1.5 rounded-lg hover:bg-bg-tertiary border border-border-custom"
                    >
                        Quay lại Dashboard
                    </Link>
                </div>
            </header>

            {/* Split Panels Container */}
            <main className="flex-1 overflow-hidden p-2">
                <PanelGroup direction="horizontal">
                    {/* Cột Trái: Đề bài & Lý thuyết */}
                    <Panel defaultSize={35} minSize={25} className="bg-bg-secondary rounded-xl border border-border-custom flex flex-col overflow-hidden mr-1 transition-colors duration-200">
                        {/* Tabs cột trái */}
                        <div className="flex justify-between items-center border-b border-border-custom bg-bg-tertiary shrink-0 px-2 transition-colors duration-200">
                            <button 
                                className="text-xs text-accent-custom hover:text-accent-hover bg-transparent border-none cursor-pointer py-2.5 px-2 font-semibold flex items-center gap-1 transition-colors"
                                onClick={() => navigate(`/lesson/${id}`)}
                            >
                                <span>←</span> Quay lại học lý thuyết
                            </button>
                            
                            <div className="flex gap-1">
                                {exercise && (
                                    <button 
                                        className={`px-3 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                                            activeLeftTab === 'desc' 
                                                ? 'border-accent-custom text-text-primary bg-bg-secondary/10' 
                                                : 'border-transparent text-text-tertiary hover:text-text-primary'
                                        }`}
                                        onClick={() => setActiveLeftTab('desc')}
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
                                    onClick={() => setActiveLeftTab('submissions')}
                                >
                                    Lịch sử nộp bài
                                </button>
                            </div></div>

                        {/* Nội dung cột trái */}
                        <div className="flex-1 overflow-y-auto p-5 text-sm leading-relaxed text-left select-text">
                            {activeLeftTab === 'desc' && exercise ? (
                                <div className="flex flex-col gap-4">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-lg font-bold text-text-primary m-0">{exercise.title}</h2>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                                            exercise.difficulty === 'EASY' 
                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                                : exercise.difficulty === 'MEDIUM'
                                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                        }`}>
                                            {exercise.difficulty}
                                        </span>
                                    </div>
                                    <hr className="border-border-custom my-1" />
                                    <div className="select-text">
                                        <ReactMarkdown
                                             remarkPlugins={[remarkGfm]}
                                            components={{
                                                h3: ({ node, ...props }) => <h3 className="text-sm font-bold text-text-primary mt-4 mb-2" {...props} />,
                                                 p: ({ node, ...props }) => <p className="text-xs md:text-sm text-text-secondary mb-2.5 leading-relaxed" {...props} />,
                                                 ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-3 text-xs md:text-sm text-text-secondary flex flex-col gap-1" {...props} />,
                                                 li: ({ node, ...props }) => <li className="mb-0.5" {...props} />,
                                                 code: ({ node, className, children, ...props }) => {
                                                     const contentStr = String(children || '');
                                                     const hasNewline = contentStr.includes('\n');
                                                     const match = /language-(\w+)/.exec(className || '');
                                                     const isInline = !match && !hasNewline;

                                                     return isInline ? (
                                                         <code className="bg-accent-bg text-accent-custom border border-accent-border px-1.5 py-0.5 rounded font-mono text-[11px] md:text-xs" {...props}>
                                                             {children}
                                                         </code>
                                                     ) : (
                                                         <pre className="bg-pre-bg border border-border-custom p-3 rounded-lg overflow-x-auto text-[11px] md:text-xs font-mono my-3 text-text-secondary select-text">
                                                             <code className={className} {...props}>
                                                                 {children}
                                                             </code>
                                                         </pre>
                                                     );
                                                 },
                                                 table: ({ node, ...props }) => (
                                                     <div className="overflow-x-auto w-full border border-border-custom rounded-xl my-4">
                                                         <table className="w-full text-xs text-left border-collapse" {...props} />
                                                     </div>
                                                 ),
                                                 thead: ({ node, ...props }) => <thead className="bg-bg-tertiary border-b border-border-custom" {...props} />,
                                                 tbody: ({ node, ...props }) => <tbody className="divide-y divide-border-custom" {...props} />,
                                                 tr: ({ node, ...props }) => <tr className="hover:bg-bg-tertiary/30" {...props} />,
                                                 th: ({ node, ...props }) => <th className="p-2.5 font-semibold text-text-primary border-r border-border-custom last:border-r-0" {...props} />,
                                                 td: ({ node, ...props }) => <td className="p-2.5 text-text-secondary border-r border-border-custom/50 last:border-r-0" {...props} />
                                             }}
                                         >
                                             {exercise.problemDescription}
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
                                            {submissions.map((sub: any) => (
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
                                                            onClick={() => setCode(sub.code)}
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
                    </Panel>

                    {/* Thanh kéo chia chiều rộng */}
                    <PanelResizeHandle className="w-1.5 hover:w-2 bg-transparent hover:bg-accent-custom/30 transition-all cursor-col-resize rounded" />

                    {/* Cột Phải: Code Editor (trên) & Terminal Output (dưới) */}
                    <Panel defaultSize={65} minSize={40} className="flex flex-col h-full ml-1">
                        <PanelGroup direction="vertical">
                            {/* Khung Editor */}
                            <Panel defaultSize={65} minSize={30} className="bg-bg-secondary rounded-xl border border-border-custom flex flex-col overflow-hidden mb-1 transition-colors duration-200">
                                <div className="bg-bg-tertiary border-b border-border-custom px-4 py-2 flex justify-between items-center shrink-0 transition-colors duration-200">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold bg-accent-bg text-accent-custom px-1.5 py-0.5 rounded border border-accent-border tracking-wider">
                                            PYTHON 3
                                        </span>
                                    </div>
                                    {exercise && (
                                        <button 
                                            className="text-xs text-text-tertiary hover:text-text-primary bg-transparent border-none cursor-pointer"
                                            onClick={() => setCode(exercise.starterCode)}
                                        >
                                            🔄 Reset Code
                                        </button>
                                    )}
                                </div>
                                
                                <div className="flex-1 w-full overflow-hidden pt-2 bg-bg-primary">
                                    <Editor
                                        height="100%"
                                        language="python"
                                        theme={currentTheme === 'dark' ? 'vs-dark' : 'light'}
                                        value={code}
                                        onChange={(val) => setCode(val || '')}
                                        options={{
                                            fontSize: 14,
                                            minimap: { enabled: false },
                                            scrollBeyondLastLine: false,
                                            automaticLayout: true,
                                            cursorBlinking: 'smooth',
                                            formatOnPaste: true,
                                            tabSize: 4
                                        }}
                                    />
                                </div>
                            </Panel>

                            {/* Thanh kéo chia chiều cao */}
                            <PanelResizeHandle className="h-1.5 hover:h-2 bg-transparent hover:bg-accent-custom/30 transition-all cursor-row-resize rounded" />

                            {/* Khung Terminal & Console Output */}
                            <Panel defaultSize={35} minSize={20} className="bg-bg-secondary rounded-xl border border-border-custom flex flex-col overflow-hidden mt-1 transition-colors duration-200">
                                {/* Tabs Terminal */}
                                <div className="flex justify-between items-center border-b border-border-custom bg-bg-tertiary px-4 shrink-0 transition-colors duration-200">
                                    <div className="flex">
                                        <button 
                                            className={`py-2 px-3 text-xs font-semibold border-b-2 transition-all ${
                                                activeTerminalTab === 'console' 
                                                    ? 'border-accent-custom text-text-primary bg-bg-secondary/10' 
                                                    : 'border-transparent text-text-tertiary hover:text-text-primary'
                                            }`}
                                            onClick={() => setActiveTerminalTab('console')}
                                        >
                                            Bảng điều khiển
                                        </button>
                                        <button 
                                            className={`py-2 px-3 text-xs font-semibold border-b-2 transition-all ${
                                                activeTerminalTab === 'testcase' 
                                                    ? 'border-accent-custom text-text-primary bg-bg-secondary/10' 
                                                    : 'border-transparent text-text-tertiary hover:text-text-primary'
                                            }`}
                                            onClick={() => setActiveTerminalTab('testcase')}
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
                                                        <span className="text-[10px] text-text-tertiary font-bold uppercase tracking-wider">Kết quả xếp hạng (LeetCode Stats):</span>
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
                                                        <span className="text-[9px] text-text-tertiary font-semibold">Phân phối thời gian chạy của cộng đồng (Runtime Distribution):</span>
                                                        <div className="h-20 flex items-end justify-between gap-1 border-b border-border-custom pb-0.5 pt-2">
                                                            {submitStats.distribution.map((bar) => {
                                                                const maxCount = Math.max(...submitStats.distribution.map(d => d.count)) || 1;
                                                                const heightPercent = (bar.count / maxCount) * 100;
                                                                
                                                                const isUserBucket = (
                                                                    (submitStats.runtimeMs <= 20 && bar.range === '10-20ms') ||
                                                                    (submitStats.runtimeMs > 20 && submitStats.runtimeMs <= 30 && bar.range === '20-30ms') ||
                                                                    (submitStats.runtimeMs > 30 && submitStats.runtimeMs <= 40 && bar.range === '30-40ms') ||
                                                                    (submitStats.runtimeMs > 40 && submitStats.runtimeMs <= 50 && bar.range === '40-50ms') ||
                                                                    (submitStats.runtimeMs > 50 && submitStats.runtimeMs <= 60 && bar.range === '50-60ms') ||
                                                                    (submitStats.runtimeMs > 60 && submitStats.runtimeMs <= 70 && bar.range === '60-70ms') ||
                                                                    (submitStats.runtimeMs > 70 && submitStats.runtimeMs <= 80 && bar.range === '70-80ms') ||
                                                                    (submitStats.runtimeMs > 80 && bar.range === '80ms+')
                                                                );

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
                                                    <span className="text-text-tertiary font-bold border-b border-border-custom pb-1">Kết quả kiểm tra chi tiết:</span>
                                                    {testcaseResults.map((tc, index) => (
                                                        <div key={tc.id} className="bg-bg-secondary border border-border-custom p-2 rounded-lg flex flex-col gap-1.5">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-text-primary font-semibold">Testcase {index + 1}</span>
                                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                                                    tc.passed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                                                                }`}>
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
                                                     onChange={(e) => setCustomInput(e.target.value)}
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
                                                 onClick={handleRunCode}
                                                 disabled={isRunning || isSubmitting}
                                             >
                                                 {isRunning ? 'Đang chạy...' : 'Chạy thử'}
                                             </button>
                                         )}
                                         {isCompleted && lesson?.nextLessonId ? (
                                             <button 
                                                 className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-lg text-xs font-bold cursor-pointer active:scale-95 transition-all animate-pulse border-none font-sans"
                                                 onClick={() => navigate(`/lesson/${lesson.nextLessonId}`)}
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
                                                 onClick={handleSubmitCode}
                                                 disabled={isRunning || isSubmitting}
                                             >
                                                 {isSubmitting ? 'Đang nộp...' : 'Nộp bài'}
                                             </button>
                                         ) : (
                                             <button 
                                                 className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-lg text-xs font-bold cursor-pointer active:scale-95 transition-all border-none font-sans"
                                                 onClick={handleCompleteWithoutExercise}
                                             >
                                                 Hoàn thành
                                             </button>
                                         )}
                                     </div>
                                </div>
                            </Panel>
                        </PanelGroup>
                    </Panel>
                </PanelGroup>
            </main>
        </div>
    );
};

export default Practice;
