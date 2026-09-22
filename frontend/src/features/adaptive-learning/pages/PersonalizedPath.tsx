import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
    Home,
    BookOpen,
    MessageSquare,
    Code2,
    FileText,
    Trophy,
    ChevronRight,
    Lightbulb,
    Wrench,
    CheckCircle2,
    HelpCircle,
    Menu,
    X,
    History,
    Trash2
} from 'lucide-react';
import { API_BASE_URL } from '../../../config/api';
import { AITutorChat, type ChatMessage } from '../../ai-tutor/components/AITutorChat';
import {
    RobotAvatar,
    RobotHelpCardIllustration,
    MountainMotivationIllustration
} from '../../../features/ai-tutor/components/AITutorIllustrations';

const QUICK_PROMPTS = [
    {
        label: 'Giải thích khái niệm trong Python',
        prompt: 'Giải thích giúp tôi khái niệm class trong Python bằng ví dụ đơn giản nhé!'
    },
    {
        label: 'Viết code theo yêu cầu',
        prompt: 'Hãy viết cho tôi một hàm Python để lọc các số chẵn trong danh sách và tính tổng.'
    },
    {
        label: 'Sửa lỗi trong đoạn code',
        prompt: 'Tôi đang gặp lỗi IndexError: list index out of range trong Python, hãy giải thích nguyên nhân và hướng dẫn cách sửa.'
    },
    {
        label: 'Tạo bài tập tương tự',
        prompt: 'Hãy tạo cho tôi một bài tập thực hành tương tự về Lập trình hướng đối tượng OOP trong Python.'
    }
];

interface ChatSessionItem {
    id: string;
    initialGoal: string;
    isFinalized: boolean;
    createdPathId?: string;
    createdAt: string;
    updatedAt: string;
    lastMessage?: {
        id: string;
        content: string;
        sender: string;
        createdAt: string;
    };
}

const PersonalizedPath: React.FC = () => {
    const navigate = useNavigate();
    const [token, setToken] = useState<string>('');

    // Interactive Chat States: Always start clean with Mascot standing in the center
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [chatLoading, setChatLoading] = useState<boolean>(false);
    const [currentAgentStep, setCurrentAgentStep] = useState<{
        agent?: string;
        title?: string;
        desc?: string;
        icon?: string;
        step?: string;
    } | null>(null);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

    // Chat History States
    const [chatSessions, setChatSessions] = useState<ChatSessionItem[]>([]);
    const [historyLoading, setHistoryLoading] = useState<boolean>(false);

    const handleNewChat = () => {
        setActiveSessionId(null);
        setChatMessages([]);
        setCurrentAgentStep(null);
        sessionStorage.removeItem('vibecode_ai_tutor_session');
    };

    const fetchChatSessions = async (authToken?: string) => {
        const t = authToken || token;
        if (!t) return;
        setHistoryLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/api/learning-path/chat/sessions`, {
                headers: { Authorization: `Bearer ${t}` }
            });
            if (res.data.success) {
                setChatSessions(res.data.sessions || []);
            }
        } catch (e) {
            console.error('Fetch chat sessions error:', e);
        } finally {
            setHistoryLoading(false);
        }
    };

    const handleSelectSession = async (sessionId: string) => {
        if (sessionId === activeSessionId && chatMessages.length > 0) return;
        setChatLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/api/learning-path/chat/session/${sessionId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success && res.data.session) {
                setActiveSessionId(sessionId);
                sessionStorage.setItem('vibecode_ai_tutor_session', sessionId);
                setChatMessages(res.data.session.messages || []);
                setMobileSidebarOpen(false);
            }
        } catch (e: any) {
            console.error('Load session error:', e);
            alert('Lỗi tải đoạn chat: ' + (e.response?.data?.error || e.message));
        } finally {
            setChatLoading(false);
        }
    };

    const handleDeleteSession = async (e: React.MouseEvent, sessionId: string) => {
        e.stopPropagation();
        if (!window.confirm('Bạn có chắc muốn xóa đoạn chat này không?')) return;
        try {
            const res = await axios.delete(`${API_BASE_URL}/api/learning-path/chat/session/${sessionId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setChatSessions(prev => prev.filter(s => s.id !== sessionId));
                if (activeSessionId === sessionId) {
                    handleNewChat();
                }
            }
        } catch (e: any) {
            console.error('Delete session error:', e);
            alert('Lỗi xóa đoạn chat: ' + (e.response?.data?.error || e.message));
        }
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
            navigate('/login');
            return;
        }
        setToken(storedToken);
        fetchChatSessions(storedToken);
    }, [navigate]);

    // Send or Start Interactive Chat Session (Real-Time SSE Streaming from AI Multi-Agent Pipeline)
    const handleSendMessage = async (msgText: string) => {
        if (!msgText.trim() || chatLoading) return;

        const currentSession = activeSessionId;
        const authToken = token || localStorage.getItem('token');

        // Optimistically append user message
        const optimisticUserMsg: ChatMessage = {
            sender: 'USER',
            content: msgText,
            timestamp: new Date().toISOString()
        };
        setChatMessages(prev => [...prev, optimisticUserMsg]);
        setChatLoading(true);
        setCurrentAgentStep(null);

        try {
            const url = !currentSession
                ? `${API_BASE_URL}/api/learning-path/chat/start-stream`
                : `${API_BASE_URL}/api/learning-path/chat/reply-stream`;

            const body = !currentSession
                ? JSON.stringify({ goal: msgText })
                : JSON.stringify({ sessionId: currentSession, content: msgText });

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`
                },
                body
            });

            if (!response.ok || !response.body) {
                throw new Error(`Máy chủ phản hồi lỗi (${response.status}): ${response.statusText}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            let completed = false;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const parts = buffer.split('\n\n');
                buffer = parts.pop() || '';

                for (const part of parts) {
                    const trimmed = part.trim();
                    if (!trimmed.startsWith('data: ')) continue;
                    try {
                        const data = JSON.parse(trimmed.slice(6));
                        if (data.type === 'session_created' && data.sessionId) {
                            setActiveSessionId(data.sessionId);
                            sessionStorage.setItem('vibecode_ai_tutor_session', data.sessionId);
                        } else if (data.type === 'agent_step') {
                            setCurrentAgentStep({
                                agent: data.agent,
                                title: data.title,
                                desc: data.desc,
                                icon: data.icon,
                                step: data.step
                            });
                        } else if (data.type === 'complete') {
                            completed = true;
                            if (data.messages) {
                                setChatMessages(data.messages);
                            } else if (data.aiMessage) {
                                setChatMessages(prev => [
                                    ...prev.filter(m => m !== optimisticUserMsg),
                                    data.userMessage,
                                    data.aiMessage
                                ]);
                            }
                            setCurrentAgentStep(null);
                            fetchChatSessions(authToken || undefined);
                        } else if (data.type === 'error') {
                            throw new Error(data.error || 'Lỗi xử lý luồng AI');
                        }
                    } catch (pe) {
                        throw pe;
                    }
                }
            }

            // Flush remaining buffer if any
            if (buffer.trim().startsWith('data: ')) {
                try {
                    const data = JSON.parse(buffer.trim().slice(6));
                    if (data.type === 'error') throw new Error(data.error || 'Lỗi xử lý luồng AI');
                    if (data.type === 'complete') {
                        completed = true;
                        if (data.messages) {
                            setChatMessages(data.messages);
                        } else if (data.aiMessage) {
                            setChatMessages(prev => [
                                ...prev.filter(m => m !== optimisticUserMsg),
                                data.userMessage,
                                data.aiMessage
                            ]);
                        }
                        setCurrentAgentStep(null);
                        fetchChatSessions(authToken || undefined);
                    }
                } catch (error) {
                    throw error;
                }
            }
            if (!completed) throw new Error('Luồng kết thúc trước khi nhận được báo cáo hoàn chỉnh');
        } catch (e: any) {
            console.error('Chat stream error:', e);
            const errorMsg: ChatMessage = {
                sender: 'AI_TUTOR',
                content: `Xin lỗi bạn, kết nối tới AI Tutor tạm thời gián đoạn: ${e.message || 'Không có phản hồi'}. Bạn vui lòng thử lại nhé!`,
                timestamp: new Date().toISOString()
            };
            setChatMessages(prev => [...prev, errorMsg]);
        } finally {
            setCurrentAgentStep(null);
            setChatLoading(false);
        }
    };

    // Confirm and Build Final Path -> Redirect to Workspace Page
    const handleConfirmPath = async () => {
        if (!activeSessionId || chatLoading) return;

        setChatLoading(true);
        try {
            const res = await axios.post(
                `${API_BASE_URL}/api/learning-path/chat/confirm`,
                { sessionId: activeSessionId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success && res.data.data?.id) {
                navigate(`/personalized-path/${res.data.data.id}`);
            }
        } catch (e: any) {
            console.error('Confirm path error:', e);
            alert('Lỗi chốt lộ trình: ' + (e.response?.data?.error || e.message));
        } finally {
            setChatLoading(false);
        }
    };

    // Start Adaptive Exercise Directly in Code Editor
    const handleStartExercise = async (exercise: any) => {
        if (!exercise) return;
        setChatLoading(true);
        try {
            const res = await axios.post(
                `${API_BASE_URL}/api/learning-path/adaptive/start-exercise`,
                { exercise_id: exercise.exercise_id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success && res.data.pathId) {
                navigate(`/personalized-path/${res.data.pathId}`);
            }
        } catch (e: any) {
            console.error('Start adaptive exercise error:', e);
            alert('Lỗi mở trình soạn thảo bài tập: ' + (e.response?.data?.error || e.message));
        } finally {
            setChatLoading(false);
        }
    };

    // Quick Tool Action triggers
    const handleToolClick = (toolName: string) => {
        switch (toolName) {
            case 'exercise':
                handleSendMessage('Hãy tạo cho tôi 1 bài tập thực hành Python thích ứng theo năng lực của tôi.');
                break;
            case 'check_code':
                handleSendMessage('Hãy giúp tôi kiểm tra đoạn code sau đây, tìm lỗi và tối ưu hiệu năng:');
                break;
            case 'theory':
                handleSendMessage('Hãy tóm tắt ngắn gọn lý thuyết cốt lõi và các điểm ngữ pháp cần nhớ trong bài học này.');
                break;
            case 'qa':
                handleSendMessage('Tôi có thắc mắc cần bạn giải đáp nhanh về cách hoạt động của Python.');
                break;
        }
    };

    return (
        <div className="h-screen w-screen bg-[#F0F4F9] text-slate-800 font-sans flex flex-col overflow-hidden select-text">
            {/* Top Bar on Mobile */}
            <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between z-20 shrink-0">
                <div className="flex items-center gap-2.5">
                    <RobotAvatar size={34} />
                    <div>
                        <h1 className="text-sm font-extrabold text-slate-900">AI Tutor</h1>
                        <p className="text-[10px] text-slate-500">Tiến bộ mỗi ngày</p>
                    </div>
                </div>
                <button
                    onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                    {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Main 3-Column Layout Container */}
            <div className="flex-1 flex overflow-hidden p-3 lg:p-4 gap-4 max-w-[1700px] w-full mx-auto">
                {/* 1. LEFT SIDEBAR COLUMN (~240px) */}
                <aside
                    className={`fixed inset-y-0 left-0 z-30 w-64 bg-white lg:bg-transparent lg:static lg:w-[230px] xl:w-[250px] flex flex-col shrink-0 p-4 lg:p-0 transition-transform duration-300 ease-in-out ${
                        mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
                    }`}
                >
                    {/* Branding Header */}
                    <div className="flex items-center gap-3 px-2 py-3">
                        <RobotAvatar size={42} showOnline={false} />
                        <div>
                            <h2 className="text-base font-extrabold text-slate-900 tracking-tight leading-tight">
                                AI Tutor
                            </h2>
                            <p className="text-[11px] text-slate-500 font-medium">
                                Học đúng cách - Tiến bộ mỗi ngày
                            </p>
                        </div>
                    </div>

                    {/* Navigation & Chat History Container (Scrollable) */}
                    <div className="mt-3 flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin flex flex-col">
                        {/* Navigation Menu */}
                        <nav className="space-y-1 px-1 shrink-0">
                            <Link
                                to="/dashboard"
                                className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-slate-600 hover:bg-white/80 hover:text-slate-900 transition-colors"
                            >
                                <Home className="w-4 h-4 text-slate-500" />
                                <span>Trang chủ</span>
                            </Link>

                            <Link
                                to="/personalized-path"
                                className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-slate-600 hover:bg-white/80 hover:text-slate-900 transition-colors"
                            >
                                <BookOpen className="w-4 h-4 text-slate-500" />
                                <span>Lộ trình học</span>
                            </Link>

                            {/* Active AI Chat Tab */}
                            <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100/80 shadow-xs">
                                <MessageSquare className="w-4 h-4 text-blue-600" />
                                <span>AI Chat</span>
                            </div>

                            <Link
                                to="/practice-arena"
                                className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-slate-600 hover:bg-white/80 hover:text-slate-900 transition-colors"
                            >
                                <Code2 className="w-4 h-4 text-slate-500" />
                                <span>Bài tập</span>
                            </Link>

                            <Link
                                to="/adaptive-practice"
                                className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-slate-600 hover:bg-white/80 hover:text-slate-900 transition-colors"
                            >
                                <FileText className="w-4 h-4 text-slate-500" />
                                <span>Tài liệu</span>
                            </Link>

                            <Link
                                to="/profile"
                                className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-slate-600 hover:bg-white/80 hover:text-slate-900 transition-colors"
                            >
                                <Trophy className="w-4 h-4 text-slate-500" />
                                <span>Thành tích</span>
                            </Link>
                        </nav>

                        {/* Chat History Section */}
                        <div className="pt-2 px-1 border-t border-slate-200/80 flex-1 flex flex-col min-h-0">
                            <div className="flex items-center justify-between px-2.5 py-1.5 text-xs font-bold text-slate-700">
                                <div className="flex items-center gap-1.5">
                                    <History className="w-3.5 h-3.5 text-blue-600" />
                                    <span>Lịch sử trò chuyện</span>
                                </div>
                                <span className="text-[10px] font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                                    {chatSessions.length}
                                </span>
                            </div>

                            {historyLoading && chatSessions.length === 0 ? (
                                <div className="text-[11px] text-slate-400 px-3 py-2 italic flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                                    Đang tải...
                                </div>
                            ) : chatSessions.length === 0 ? (
                                <p className="text-[11px] text-slate-400 px-3 py-2 italic">
                                    Chưa có đoạn chat nào được lưu.
                                </p>
                            ) : (
                                <div className="space-y-1 mt-1 overflow-y-auto pr-0.5 flex-1 max-h-[220px]">
                                    {chatSessions.map((s) => {
                                        const isActive = s.id === activeSessionId;
                                        return (
                                            <div
                                                key={s.id}
                                                onClick={() => handleSelectSession(s.id)}
                                                className={`group w-full px-2.5 py-2 rounded-xl text-left text-xs transition-all cursor-pointer flex items-center justify-between gap-1.5 ${
                                                    isActive
                                                        ? 'bg-blue-50/90 text-blue-700 font-bold border border-blue-200/80 shadow-xs'
                                                        : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 border border-transparent'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                                    <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                                                    <span className="truncate block font-medium" title={s.initialGoal}>
                                                        {s.initialGoal || 'Cuộc trò chuyện'}
                                                    </span>
                                                </div>

                                                <button
                                                    onClick={(e) => handleDeleteSession(e, s.id)}
                                                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer text-slate-400 shrink-0"
                                                    title="Xóa đoạn chat"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Left Bottom Support Card */}
                    <div className="mt-auto pt-4">
                        <div className="bg-gradient-to-b from-[#EFF4FE] to-[#DBEAFE]/90 border border-blue-100/90 rounded-3xl p-4 text-center shadow-xs space-y-2">
                            <h4 className="font-extrabold text-blue-950 text-xs tracking-tight">
                                Bạn cần hỗ trợ gì hôm nay?
                            </h4>
                            <p className="text-[11px] text-slate-600 leading-snug">
                                Hãy nói cho AI biết, mình sẽ giúp bạn học hiệu quả hơn!
                            </p>
                            <div className="pt-1">
                                <RobotHelpCardIllustration />
                            </div>
                        </div>
                    </div>
                </aside>

                {/* 2. CENTER COLUMN: MAIN CHAT INTERACTION (flex-1) */}
                <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
                    <AITutorChat
                        sessionId={activeSessionId || 'default'}
                        messages={chatMessages}
                        onSendMessage={handleSendMessage}
                        onConfirmPath={handleConfirmPath}
                        onStartExercise={handleStartExercise}
                        onBack={() => navigate('/dashboard')}
                        onNewChat={handleNewChat}
                        loading={chatLoading}
                        currentAgentStep={currentAgentStep}
                    />
                </main>

                {/* 3. RIGHT COLUMN: WIDGETS & TOOLS (~280px - 310px) */}
                <aside className="hidden xl:flex flex-col w-[290px] 2xl:w-[310px] shrink-0 space-y-3.5 overflow-y-auto pr-0.5">
                    {/* Card 1: Currently Learning */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 space-y-2.5">
                        <div className="flex items-center justify-between text-blue-600 font-bold text-xs">
                            <div className="flex items-center gap-1.5">
                                <BookOpen className="w-4 h-4 text-blue-600" />
                                <span>Đang học</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-blue-400" />
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-extrabold text-slate-900">
                                    Python Cơ Bản
                                </h3>
                                <span className="text-xs text-slate-400 font-semibold">
                                    3/8 bài
                                </span>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2">
                                <div
                                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                                    style={{ width: '37.5%' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Quick Prompts */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 space-y-2.5">
                        <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                            <Lightbulb className="w-4 h-4 text-amber-500" />
                            <span>Gợi ý nhanh</span>
                        </div>

                        <div className="space-y-1.5">
                            {QUICK_PROMPTS.map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSendMessage(item.prompt)}
                                    disabled={chatLoading}
                                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/60 text-slate-700 hover:text-blue-700 text-xs font-medium flex items-center justify-between transition-all cursor-pointer shadow-xs disabled:opacity-50 text-left"
                                >
                                    <span className="truncate pr-1">{item.label}</span>
                                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Card 3: Support Tools (2x2 Grid) */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 space-y-2.5">
                        <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                            <Wrench className="w-4 h-4 text-blue-600" />
                            <span>Công cụ hỗ trợ</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            {/* Tạo bài tập */}
                            <button
                                onClick={() => handleToolClick('exercise')}
                                disabled={chatLoading}
                                className="bg-[#E8F8F0] hover:bg-[#DCFCE7] text-[#16A34A] border border-[#DCFCE7] p-3 rounded-xl flex flex-col gap-1.5 transition-all cursor-pointer font-bold text-xs shadow-xs text-left"
                            >
                                <Code2 className="w-4 h-4 text-emerald-600" />
                                <span>Tạo bài tập</span>
                            </button>

                            {/* Kiểm tra code */}
                            <button
                                onClick={() => handleToolClick('check_code')}
                                disabled={chatLoading}
                                className="bg-[#F3E8FF] hover:bg-[#EDE9FE] text-[#9333EA] border border-[#F3E8FF] p-3 rounded-xl flex flex-col gap-1.5 transition-all cursor-pointer font-bold text-xs shadow-xs text-left"
                            >
                                <CheckCircle2 className="w-4 h-4 text-purple-600" />
                                <span>Kiểm tra code</span>
                            </button>

                            {/* Tóm tắt lý thuyết */}
                            <button
                                onClick={() => handleToolClick('theory')}
                                disabled={chatLoading}
                                className="bg-[#E0F2FE] hover:bg-[#BAE6FD] text-[#0284C7] border border-[#E0F2FE] p-3 rounded-xl flex flex-col gap-1.5 transition-all cursor-pointer font-bold text-xs shadow-xs text-left"
                            >
                                <FileText className="w-4 h-4 text-sky-600" />
                                <span>Tóm tắt lý thuyết</span>
                            </button>

                            {/* Hỏi đáp nhanh */}
                            <button
                                onClick={() => handleToolClick('qa')}
                                disabled={chatLoading}
                                className="bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#D97706] border border-[#FEF3C7] p-3 rounded-xl flex flex-col gap-1.5 transition-all cursor-pointer font-bold text-xs shadow-xs text-left"
                            >
                                <HelpCircle className="w-4 h-4 text-amber-600" />
                                <span>Hỏi đáp nhanh</span>
                            </button>
                        </div>
                    </div>

                    {/* Card 4: Motivation Card */}
                    <div className="bg-gradient-to-br from-[#EEF2FF] to-[#E0E7FF] border border-indigo-100/90 rounded-2xl p-4 relative overflow-hidden shadow-xs">
                        <h4 className="font-extrabold text-slate-900 text-xs">
                            Học không khó, <br />
                            chỉ cần đúng phương pháp!
                        </h4>
                        <p className="text-[11px] text-slate-600 mt-1 max-w-[190px] leading-relaxed">
                            Cùng AI Tutor chinh phục mục tiêu của bạn nhé! 💪
                        </p>
                        <div className="pt-2 flex justify-end">
                            <MountainMotivationIllustration />
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default PersonalizedPath;
