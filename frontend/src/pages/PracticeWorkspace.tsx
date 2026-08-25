import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import axios from 'axios';
import { ThemeToggle } from '../components/ThemeToggle';
import { getInitialTheme } from '../utils/themeHelper';
import { API_BASE_URL } from '../config/api';

interface TestCaseResult {
    id: string;
    input: string;
    expectedOutput: string;
    actualOutput: string;
    passed: boolean;
    isHidden: boolean;
}

interface ProblemDetail {
    id: string;
    title: string;
    slug: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    description: string;
    starterCodes: {
        PYTHON?: string;
        JAVASCRIPT?: string;
        CPP?: string;
        C?: string;
    };
    testCases: {
        id: string;
        input: string;
        expectedOutput: string;
        isHidden: boolean;
    }[];
}

interface Submission {
    id: string;
    language: string;
    status: 'PENDING' | 'PASSED' | 'FAILED';
    runtime: number | null;
    submittedAt: string;
    code: string;
}

const PracticeWorkspace: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(getInitialTheme());

    // Data States
    const [problem, setProblem] = useState<ProblemDetail | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<'PYTHON' | 'JAVASCRIPT' | 'CPP' | 'C'>('PYTHON');
    const [code, setCode] = useState<string>('');
    const [customInput, setCustomInput] = useState<string>('');
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    // UI States
    const [activeLeftTab, setActiveLeftTab] = useState<'desc' | 'submissions'>('desc');
    const [activeTerminalTab, setActiveTerminalTab] = useState<'console' | 'results'>('console');
    const [selectedSubmissionCode, setSelectedSubmissionCode] = useState<string | null>(null);

    // Grading States
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [consoleOutput, setConsoleOutput] = useState<string>('Bấm "Chạy thử" để xem đầu ra của testcase tùy chỉnh...');
    const [testcaseResults, setTestCaseResults] = useState<TestCaseResult[]>([]);
    const [submitStats, setSubmitStats] = useState<{
        runtimeMs: number;
        runtimeBeats: number;
        distribution: { range: string; count: number }[];
    } | null>(null);
    const [allPassed, setAllPassed] = useState<boolean>(false);

    useEffect(() => {
        const handleThemeChange = () => {
            setCurrentTheme(getInitialTheme());
        };
        window.addEventListener('theme-change', handleThemeChange);
        return () => window.removeEventListener('theme-change', handleThemeChange);
    }, []);

    // Fetch problem details
    useEffect(() => {
        const fetchProblem = async () => {
            if (!slug) return;
            setLoading(true);
            setError('');
            setSubmitStats(null);
            setTestCaseResults([]);
            setConsoleOutput('Bấm "Chạy thử" để xem đầu ra của testcase tùy chỉnh...');
            
            try {
                const response = await axios.get(`${API_BASE_URL}/api/auth/practice/problems/${slug}`);
                const data = response.data;
                setProblem(data);
                
                // Set default language & starter code
                setSelectedLanguage('PYTHON');
                setCode(data.starterCodes.PYTHON || '# Viết code của bạn ở đây');
                
                if (data.testCases && data.testCases.length > 0) {
                    setCustomInput(data.testCases[0].input);
                }
            } catch (err: any) {
                console.error(err);
                setError('Không thể tải bài tập này. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchProblem();
    }, [slug]);

    // Fetch submissions log when tab changed
    const fetchSubmissions = async () => {
        if (!problem) return;
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const response = await axios.get(`${API_BASE_URL}/api/auth/practice/problems/${problem.id}/submissions`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSubmissions(response.data);
        } catch (err) {
            console.error('Lỗi khi tải lịch sử bài nộp:', err);
        }
    };

    useEffect(() => {
        if (activeLeftTab === 'submissions' && problem) {
            fetchSubmissions();
        }
    }, [activeLeftTab, problem]);

    // Switch starter code when language changes
    const handleLanguageChange = (lang: 'PYTHON' | 'JAVASCRIPT' | 'CPP' | 'C') => {
        setSelectedLanguage(lang);
        if (problem && problem.starterCodes) {
            setCode(problem.starterCodes[lang] || '');
        }
    };

    // Run custom input
    const handleRunCode = async () => {
        if (!code.trim()) {
            setConsoleOutput('Lỗi: Mã nguồn rỗng!');
            return;
        }
        setIsRunning(true);
        setConsoleOutput('Đang biên dịch và thực thi code trong môi trường sandbox Docker...');
        setActiveTerminalTab('console');

        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/practice/compiler/run`, {
                code,
                language: selectedLanguage,
                input: customInput
            });
            setIsRunning(false);
            
            if (response.data.success) {
                setConsoleOutput(`[stdout]\n${response.data.output}\n\n[Thực thi thành công]`);
            } else {
                setConsoleOutput(`[stderr/error]\n${response.data.output}\n\n[Thực thi gặp lỗi]`);
            }
        } catch (err: any) {
            setIsRunning(false);
            setConsoleOutput(`Lỗi chấm bài: ${err.message}`);
        }
    };

    // Submit solution against all test cases
    const handleSubmitCode = async () => {
        if (!code.trim()) return;
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Bạn cần đăng nhập để nộp bài!');
            navigate('/login');
            return;
        }

        setIsSubmitting(true);
        setSubmitStats(null);
        setTestCaseResults([]);
        setActiveTerminalTab('results');

        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/auth/practice/problems/${problem?.id}/submit`,
                { code, language: selectedLanguage },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setIsSubmitting(false);
            setAllPassed(response.data.allPassed);
            setTestCaseResults(response.data.results);

            if (response.data.allPassed) {
                setSubmitStats({
                    runtimeMs: response.data.runtimeMs,
                    runtimeBeats: response.data.runtimeBeats,
                    distribution: response.data.distribution
                });
                // Refresh submissions if on submissions tab
                if (activeLeftTab === 'submissions') {
                    fetchSubmissions();
                }
            }
        } catch (err: any) {
            setIsSubmitting(false);
            alert(`Lỗi hệ thống khi nộp bài: ${err.message}`);
        }
    };

    const getMonacoLanguage = (lang: string) => {
        switch (lang) {
            case 'PYTHON': return 'python';
            case 'JAVASCRIPT': return 'javascript';
            case 'CPP': return 'cpp';
            case 'C': return 'c';
            default: return 'python';
        }
    };

    if (loading) {
        return (
            <div className="bg-bg-primary text-text-primary min-h-screen flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-4 border-accent-custom border-t-transparent rounded-full animate-spin mb-4"></div>
                <span className="text-sm font-semibold text-text-secondary">Đang tải không gian code...</span>
            </div>
        );
    }

    if (error || !problem) {
        return (
            <div className="bg-bg-primary text-text-primary min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <span className="text-4xl mb-4">⚠️</span>
                <h2 className="text-xl font-bold mb-2">Đã xảy ra lỗi</h2>
                <p className="text-sm text-text-tertiary mb-6 max-w-sm">{error || 'Không tìm thấy bài tập.'}</p>
                <button
                    onClick={() => navigate('/practice-arena')}
                    className="bg-accent-custom hover:bg-accent-hover text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                    Quay lại Đấu trường
                </button>
            </div>
        );
    }

    return (
        <div className="bg-bg-primary text-text-primary min-h-screen h-screen flex flex-col font-sans select-none overflow-hidden transition-colors duration-200">
            {/* Top Workspace Header */}
            <header className="flex justify-between items-center px-6 py-3 border-b border-border-custom bg-bg-secondary shrink-0 transition-colors duration-200">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/practice-arena')}
                        className="bg-bg-tertiary hover:bg-bg-primary border border-border-custom p-2 rounded-lg text-text-secondary transition-all cursor-pointer flex items-center justify-center"
                        title="Quay lại"
                    >
                        ←
                    </button>
                    <span className="text-sm font-bold tracking-tight text-text-primary max-w-xs truncate">{problem.title}</span>
                    <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border ${
                        problem.difficulty === 'EASY'
                            ? 'bg-green-500/10 text-green-500 border-green-500/20'
                            : problem.difficulty === 'MEDIUM'
                            ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                            : 'bg-red-500/10 text-red-500 border-red-500/20'
                    }`}>
                        {problem.difficulty}
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <Link
                        to="/practice-arena"
                        className="bg-accent-bg hover:bg-accent-custom hover:text-white px-4 py-2 rounded-xl border border-accent-border text-xs font-bold text-accent-custom transition-all no-underline"
                    >
                        Đấu trường
                    </Link>
                </div>
            </header>

            {/* Split Panel workspace */}
            <main className="flex-1 overflow-hidden p-2">
                <PanelGroup direction="horizontal">
                    {/* Left Panel: Description & Submissions */}
                    <Panel defaultSize={40} minSize={30} className="bg-bg-secondary rounded-xl border border-border-custom flex flex-col overflow-hidden mr-1 transition-colors duration-200">
                        {/* Tab Switcher */}
                        <div className="flex border-b border-border-custom bg-bg-tertiary/10 p-1.5 gap-1 shrink-0">
                            <button
                                onClick={() => {
                                    setActiveLeftTab('desc');
                                    setSelectedSubmissionCode(null);
                                }}
                                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    activeLeftTab === 'desc' && !selectedSubmissionCode
                                        ? 'bg-bg-secondary text-accent-custom shadow-sm border border-border-custom'
                                        : 'text-text-tertiary hover:text-text-primary'
                                }`}
                            >
                                Đề bài (Description)
                            </button>
                            <button
                                onClick={() => setActiveLeftTab('submissions')}
                                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    activeLeftTab === 'submissions' || selectedSubmissionCode
                                        ? 'bg-bg-secondary text-accent-custom shadow-sm border border-border-custom'
                                        : 'text-text-tertiary hover:text-text-primary'
                                }`}
                            >
                                Lịch sử nộp (Submissions)
                            </button>
                        </div>

                        {/* Left Tab content scrollable */}
                        <div className="flex-1 overflow-y-auto p-6 prose prose-slate max-w-none prose-sm dark:prose-invert">
                            {selectedSubmissionCode ? (
                                <div className="flex flex-col gap-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-sm font-bold text-text-primary">Mã nguồn đã nộp</h3>
                                        <button
                                            onClick={() => setSelectedSubmissionCode(null)}
                                            className="bg-bg-tertiary hover:bg-bg-primary px-3 py-1 rounded text-xs font-bold text-text-secondary border border-border-custom cursor-pointer"
                                        >
                                            Quay lại danh sách
                                        </button>
                                    </div>
                                    <pre className="bg-pre-bg p-4 rounded-xl border border-border-custom overflow-x-auto text-xs font-mono select-text text-text-secondary">
                                        <code>{selectedSubmissionCode}</code>
                                    </pre>
                                </div>
                            ) : activeLeftTab === 'desc' ? (
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[rehypeRaw]}
                                    components={{
                                        details: ({ node, ...props }) => <details className="my-3 p-3.5 rounded-xl border border-border-custom bg-bg-tertiary/40 text-xs md:text-sm transition-all" {...props} />,
                                        summary: ({ node, ...props }) => <summary className="font-semibold text-text-primary hover:text-accent-custom cursor-pointer select-none transition-colors mb-2" {...props} />
                                    }}
                                >
                                    {problem.description}
                                </ReactMarkdown>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    <h3 className="text-sm font-bold text-text-primary">Lịch sử bài giải của bạn</h3>
                                    {submissions.length === 0 ? (
                                        <div className="text-center py-10">
                                            <span className="text-2xl block mb-2">📋</span>
                                            <span className="text-xs text-text-tertiary">Bạn chưa từng nộp bài giải cho bài tập này.</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-2.5">
                                            {submissions.map((sub) => (
                                                <div
                                                    key={sub.id}
                                                    className="bg-bg-primary p-4 rounded-xl border border-border-custom flex flex-col gap-3 shadow-sm hover:border-accent-custom transition-all"
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border ${
                                                                sub.status === 'PASSED'
                                                                    ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                                    : 'bg-red-500/10 text-red-500 border-red-500/20'
                                                            }`}>
                                                                {sub.status === 'PASSED' ? 'Chấp nhận (Passed)' : 'Thất bại (Failed)'}
                                                            </span>
                                                            <span className="text-[10px] font-bold text-text-tertiary uppercase bg-bg-secondary px-1.5 py-0.5 rounded border border-border-custom">
                                                                {sub.language}
                                                            </span>
                                                        </div>
                                                        <span className="text-[10px] text-text-tertiary">
                                                            {new Date(sub.submittedAt).toLocaleString('vi-VN')}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span className="text-text-secondary font-medium">
                                                            Thời gian chạy: <strong className="text-text-primary">{sub.runtime ? `${sub.runtime.toFixed(1)} ms` : 'N/A'}</strong>
                                                        </span>
                                                        <button
                                                            onClick={() => setSelectedSubmissionCode(sub.code)}
                                                            className="text-accent-custom hover:underline font-bold text-xs bg-transparent border-none cursor-pointer"
                                                        >
                                                            Xem code đã viết →
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

                    <PanelResizeHandle className="w-1.5 hover:w-2 bg-transparent hover:bg-accent-custom/30 transition-all cursor-col-resize rounded" />

                    {/* Right Panel: Code Editor & Terminal */}
                    <Panel defaultSize={60} minSize={40} className="flex flex-col h-full ml-1">
                        <PanelGroup direction="vertical">
                            {/* Top part: Code Editor */}
                            <Panel defaultSize={60} minSize={30} className="bg-bg-secondary rounded-xl border border-border-custom flex flex-col overflow-hidden mb-1 transition-colors duration-200">
                                {/* Editor Header / Configs */}
                                <div className="flex justify-between items-center px-4 py-2 border-b border-border-custom bg-bg-tertiary/10 shrink-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-text-tertiary">Ngôn ngữ:</span>
                                        <select
                                            value={selectedLanguage}
                                            onChange={(e) => handleLanguageChange(e.target.value as any)}
                                            className="bg-bg-primary text-text-primary text-xs font-bold border border-border-custom rounded px-2.5 py-1.5 outline-none focus:border-accent-custom cursor-pointer"
                                        >
                                            <option value="PYTHON">Python</option>
                                            <option value="JAVASCRIPT">JavaScript (Node)</option>
                                            <option value="CPP">C++ (GCC)</option>
                                            <option value="C">C (GCC)</option>
                                        </select>
                                    </div>
                                    <button
                                        onClick={() => handleLanguageChange(selectedLanguage)}
                                        className="text-[10px] font-bold text-text-tertiary hover:text-red-500 bg-transparent border-none cursor-pointer"
                                        title="Đặt lại code ban đầu"
                                    >
                                        Reset Code ↺
                                    </button>
                                </div>

                                {/* Monaco Editor body */}
                                <div className="flex-1 w-full relative min-h-0">
                                    <Editor
                                        height="100%"
                                        language={getMonacoLanguage(selectedLanguage)}
                                        theme={currentTheme === 'dark' ? 'vs-dark' : 'light'}
                                        value={code}
                                        onChange={(val) => setCode(val || '')}
                                        options={{
                                            fontSize: 13,
                                            minimap: { enabled: false },
                                            automaticLayout: true,
                                            fontFamily: "'Fira Code', 'Courier New', monospace",
                                            lineHeight: 20
                                        }}
                                    />
                                </div>
                            </Panel>

                            <PanelResizeHandle className="h-1.5 hover:h-2 bg-transparent hover:bg-accent-custom/30 transition-all cursor-row-resize rounded" />

                            {/* Bottom part: Run console & grading results */}
                            <Panel defaultSize={40} minSize={20} className="bg-bg-secondary rounded-xl border border-border-custom flex flex-col overflow-hidden mt-1 transition-colors duration-200">
                                {/* Terminal Tabs */}
                                <div className="flex border-b border-border-custom bg-bg-tertiary/15 px-4 shrink-0 justify-between items-center">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setActiveTerminalTab('console')}
                                            className={`py-2 px-3 border-b-2 text-xs font-bold transition-all cursor-pointer ${
                                                activeTerminalTab === 'console'
                                                    ? 'border-accent-custom text-accent-custom'
                                                    : 'border-transparent text-text-tertiary hover:text-text-primary'
                                            }`}
                                        >
                                            Nhập đầu vào (Console Input)
                                        </button>
                                        <button
                                            onClick={() => setActiveTerminalTab('results')}
                                            className={`py-2 px-3 border-b-2 text-xs font-bold transition-all cursor-pointer ${
                                                activeTerminalTab === 'results'
                                                    ? 'border-accent-custom text-accent-custom'
                                                    : 'border-transparent text-text-tertiary hover:text-text-primary'
                                            }`}
                                        >
                                            Kết quả chấm (Testcases)
                                        </button>
                                    </div>
                                </div>

                                {/* Terminal panel contents */}
                                <div className="flex-1 overflow-y-auto p-5 font-mono text-xs">
                                    {activeTerminalTab === 'console' ? (
                                        <div className="flex flex-col gap-4 h-full">
                                            <div className="flex flex-col gap-2">
                                                <span className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">Dữ liệu đầu vào tùy chỉnh (Standard Input):</span>
                                                <textarea
                                                    value={customInput}
                                                    onChange={(e) => setCustomInput(e.target.value)}
                                                    rows={4}
                                                    placeholder="Nhập stdin tại đây..."
                                                    className="w-full bg-bg-primary text-text-primary border border-border-custom rounded-xl p-3 font-mono text-xs outline-none focus:border-accent-custom transition-all"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <span className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">Đầu ra thực thi (Standard Output / Error):</span>
                                                <pre className="bg-bg-primary border border-border-custom rounded-xl p-3.5 whitespace-pre-wrap overflow-x-auto text-[11px] text-text-secondary leading-5 min-h-[80px]">
                                                    {consoleOutput}
                                                </pre>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-4">
                                            {isSubmitting ? (
                                                <div className="flex flex-col items-center justify-center py-10">
                                                    <div className="w-7 h-7 border-3 border-accent-custom border-t-transparent rounded-full animate-spin mb-3"></div>
                                                    <span className="text-xs text-text-tertiary">MCODE Sandbox đang chấm toàn bộ testcase ẩn...</span>
                                                </div>
                                            ) : testcaseResults.length === 0 ? (
                                                <div className="text-center py-10 text-text-tertiary">
                                                    Bạn chưa bấm Nộp bài. Hãy kiểm thử mã nguồn trên toàn bộ testcase.
                                                </div>
                                            ) : (
                                                <div className="flex flex-col gap-4">
                                                    {/* Submit outcome banner */}
                                                    <div className={`p-4 rounded-xl border flex flex-col gap-1.5 ${
                                                        allPassed
                                                            ? 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20'
                                                            : 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20'
                                                    }`}>
                                                        <h4 className="font-extrabold text-sm flex items-center gap-1.5">
                                                            {allPassed ? '🎉 Chấp nhận bài giải (Accepted)' : '❌ Lỗi kết quả nộp bài (Wrong Answer)'}
                                                        </h4>
                                                        <p className="text-[11px] font-medium opacity-90">
                                                            {allPassed
                                                                ? `Chúc mừng! Code của bạn đã vượt qua tất cả ${testcaseResults.length} testcase.`
                                                                : `Code của bạn chỉ đạt ${testcaseResults.filter(r => r.passed).length}/${testcaseResults.length} testcases. Vui lòng kiểm tra lại.`
                                                            }
                                                        </p>
                                                    </div>

                                                    {/* Beats and Chart details */}
                                                    {allPassed && submitStats && (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-bg-primary p-4 rounded-xl border border-border-custom">
                                                            <div className="flex flex-col gap-2">
                                                                <h4 className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">Hiệu năng thực thi</h4>
                                                                <div className="flex flex-col gap-1.5">
                                                                    <div className="text-xs text-text-secondary">
                                                                        Thời gian chạy trung bình: <strong className="text-text-primary">{submitStats.runtimeMs.toFixed(1)} ms</strong>
                                                                    </div>
                                                                    <div className="text-xs text-text-secondary">
                                                                        Nhanh hơn <strong className="text-accent-custom">{submitStats.runtimeBeats.toFixed(1)}%</strong> các bài giải {selectedLanguage} khác.
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col gap-2">
                                                                <h4 className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">Phân phối thời gian chạy (Runtime Chart)</h4>
                                                                <div className="flex flex-col gap-1.5">
                                                                    {submitStats.distribution.map(bucket => {
                                                                        const maxCount = Math.max(...submitStats.distribution.map(d => d.count), 1);
                                                                        const widthPercent = (bucket.count / maxCount) * 100;
                                                                        // Check if my runtime falls into this bucket
                                                                        const rt = submitStats.runtimeMs;
                                                                        let isMyBucket = false;
                                                                        if (bucket.range === '80ms+' && rt >= 80) isMyBucket = true;
                                                                        else {
                                                                            const rangeVals = bucket.range.replace('ms', '').split('-');
                                                                            if (rangeVals.length === 2) {
                                                                                const min = parseInt(rangeVals[0], 10);
                                                                                const max = parseInt(rangeVals[1], 10);
                                                                                if (rt >= min && rt < max) isMyBucket = true;
                                                                            }
                                                                        }

                                                                        return (
                                                                            <div key={bucket.range} className="flex items-center gap-2 text-[10px]">
                                                                                <span className="w-16 text-text-tertiary font-medium">{bucket.range}</span>
                                                                                <div className="flex-1 bg-bg-secondary h-3.5 rounded border border-border-custom relative overflow-hidden">
                                                                                    <div
                                                                                        className={`h-full rounded-l transition-all duration-300 ${
                                                                                            isMyBucket ? 'bg-accent-custom' : 'bg-accent-color/25'
                                                                                        }`}
                                                                                        style={{ width: `${Math.max(4, widthPercent)}%` }}
                                                                                    ></div>
                                                                                    {isMyBucket && (
                                                                                        <span className="absolute inset-y-0 right-2 flex items-center text-[8px] font-black text-accent-custom">Của bạn</span>
                                                                                    )}
                                                                                </div>
                                                                                <span className="w-6 text-right text-text-tertiary font-bold">{bucket.count}</span>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Detailed Testcase Results */}
                                                    <div className="flex flex-col gap-3">
                                                        <h4 className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">Chi tiết Testcases:</h4>
                                                        {testcaseResults.map((tc, idx) => (
                                                            <div
                                                                key={tc.id}
                                                                className="bg-bg-primary p-3 rounded-lg border border-border-custom flex flex-col gap-2.5"
                                                            >
                                                                <div className="flex justify-between items-center">
                                                                    <span className="font-bold text-[11px] text-text-secondary">
                                                                        Testcase #{idx + 1} {tc.isHidden && <span className="text-[9px] font-extrabold text-accent-custom bg-accent-bg px-1 rounded uppercase tracking-wider ml-1">Ẩn (Hidden)</span>}
                                                                    </span>
                                                                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                                                                        tc.passed
                                                                            ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                                            : 'bg-red-500/10 text-red-500 border-red-500/20'
                                                                    }`}>
                                                                        {tc.passed ? 'Đạt' : 'Sai'}
                                                                    </span>
                                                                </div>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                                                                    <div className="flex flex-col gap-1">
                                                                        <span className="text-text-tertiary">Đầu vào (Input):</span>
                                                                        <pre className="bg-bg-secondary p-2 rounded border border-border-custom font-mono text-[10px] whitespace-pre-wrap max-h-20 overflow-y-auto text-text-secondary leading-4">
                                                                            {tc.input}
                                                                        </pre>
                                                                    </div>
                                                                    <div className="flex flex-col gap-1">
                                                                        <span className="text-text-tertiary">Kết quả mong đợi (Expected):</span>
                                                                        <pre className="bg-bg-secondary p-2 rounded border border-border-custom font-mono text-[10px] whitespace-pre-wrap max-h-20 overflow-y-auto text-text-secondary leading-4">
                                                                            {tc.expectedOutput}
                                                                        </pre>
                                                                    </div>
                                                                    <div className="flex flex-col gap-1 md:col-span-2">
                                                                        <span className="text-text-tertiary">Kết quả thực tế (Actual Output):</span>
                                                                        <pre className="bg-bg-secondary p-2 rounded border border-border-custom font-mono text-[10px] whitespace-pre-wrap max-h-24 overflow-y-auto text-text-secondary leading-4">
                                                                            {tc.actualOutput || '[Rỗng]'}
                                                                        </pre>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Terminal Actions bar */}
                                <div className="border-t border-border-custom px-5 py-3 bg-bg-tertiary/10 flex justify-between items-center shrink-0">
                                    <span className="text-[10px] text-text-tertiary font-bold uppercase tracking-wider">
                                        Status: {isRunning ? 'Running...' : isSubmitting ? 'Grading...' : 'Idle'}
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleRunCode}
                                            disabled={isRunning || isSubmitting}
                                            className="bg-bg-primary hover:bg-bg-tertiary text-text-primary px-4 py-2 rounded-xl border border-border-custom text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                                        >
                                            Chạy thử (Run)
                                        </button>
                                        <button
                                            onClick={handleSubmitCode}
                                            disabled={isRunning || isSubmitting}
                                            className="bg-accent-custom hover:bg-accent-hover text-white px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                                        >
                                            Nộp bài (Submit)
                                        </button>
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

export default PracticeWorkspace;
