import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ThemeToggle } from '../components/ThemeToggle';
import { AITutorChat, type ChatMessage } from '../components/AITutorChat';

const QUICK_SUGGESTIONS = [
    { label: '🐍 Vòng Lặp & Duyệt Mảng Python', prompt: 'Tôi muốn học về Vòng lặp For và Duyệt Mảng trong Python vì dạo này hay bị sai lỗi index.' },
    { label: '📊 Xử Lý Chuỗi & Slicing', prompt: 'Tôi muốn học Kỹ thuật Xử lý Chuỗi và Slicing trong Python.' },
    { label: '⚡ Thuật Toán Tìm Cực Trị', prompt: 'Tôi muốn học Thuật toán Tìm phần tử lớn nhất/nhỏ nhất và Tối ưu bộ nhớ.' },
    { label: '🌐 Lập Trình Hướng Đối Tượng', prompt: 'Tôi muốn học Lập trình Hướng đối tượng OOP trong Python.' }
];

const PersonalizedPath: React.FC = () => {
    const navigate = useNavigate();
    const [token, setToken] = useState<string>('');
    const [role, setRole] = useState<string>('STUDENT');

    // KodeKloud Interactive Chat States
    const [userPromptInput, setUserPromptInput] = useState<string>('');
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [chatLoading, setChatLoading] = useState<boolean>(false);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
            navigate('/login');
            return;
        }
        setToken(storedToken);

        try {
            const payload = JSON.parse(atob(storedToken.split('.')[1]));
            if (payload.role) setRole(payload.role);
        } catch (e) {
            console.error('Token payload decode error:', e);
        }
    }, [navigate]);

    // Start Interactive Chat Session (KodeKloud Style)
    const handleStartChatSession = async (goalText?: string) => {
        const promptToUse = goalText || userPromptInput;
        if (!promptToUse.trim() || chatLoading) return;

        setChatLoading(true);
        try {
            const res = await axios.post(
                'http://localhost:3000/api/learning-path/chat/start',
                { goal: promptToUse },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                console.log('🤖 [AI TUTOR CHAT START RESPONSE FROM GEMINI]:', res.data);
                setActiveSessionId(res.data.sessionId);
                setChatMessages(res.data.messages || []);
                setUserPromptInput('');
            }
        } catch (e: any) {
            console.error('Start chat error:', e);
            alert('Lỗi khởi tạo đối thoại AI Tutor: ' + (e.response?.data?.error || e.message));
        } finally {
            setChatLoading(false);
        }
    };

    // Reply Chat Message
    const handleSendChatMessage = async (msgText: string) => {
        if (!activeSessionId || chatLoading) return;

        setChatLoading(true);
        try {
            const res = await axios.post(
                'http://localhost:3000/api/learning-path/chat/reply',
                { sessionId: activeSessionId, content: msgText },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                console.log('🤖 [AI TUTOR CHAT REPLY RESPONSE FROM GEMINI]:', res.data);
                setChatMessages(prev => [
                    ...prev,
                    res.data.userMessage,
                    res.data.aiMessage
                ]);
            }
        } catch (e: any) {
            console.error('Reply chat error:', e);
        } finally {
            setChatLoading(false);
        }
    };

    // Confirm and Build Final Path -> Redirect to Workspace Page!
    const handleConfirmPath = async () => {
        if (!activeSessionId || chatLoading) return;

        setChatLoading(true);
        try {
            const res = await axios.post(
                'http://localhost:3000/api/learning-path/chat/confirm',
                { sessionId: activeSessionId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success && res.data.data?.id) {
                console.log('🚀 [FULL GENERATED PATH & EXERCISES CREATED BY GEMINI AI]:', res.data.data);
                navigate(`/personalized-path/${res.data.data.id}`);
            }
        } catch (e: any) {
            console.error('Confirm path error:', e);
            alert('Lỗi chốt lộ trình: ' + (e.response?.data?.error || e.message));
        } finally {
            setChatLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0D1117] text-gray-100 font-sans flex flex-col justify-between">
            {/* Header Navigation */}
            <header className="border-b border-[#30363D] bg-[#161B22] sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-xl font-bold text-white tracking-tight">VIBECODE<span className="text-[#58A6FF]">AI</span></span>
                        <span className="text-[10px] font-bold bg-[#1F6FE5]/20 text-[#58A6FF] px-2 py-0.5 rounded border border-[#1F6FE5]/40 tracking-wider">
                            AI TUTOR BETA
                        </span>
                    </div>

                    <nav className="hidden md:flex gap-8">
                        <Link to="/dashboard" className="text-gray-400 hover:text-white no-underline text-xs font-semibold tracking-wider">
                            Dashboard
                        </Link>
                        <Link to="/personalized-path" className="text-[#58A6FF] font-semibold no-underline text-xs tracking-wider">
                            🚀 Lộ Trình Cá Nhân Hóa
                        </Link>
                        <Link to="/adaptive-practice" className="text-gray-400 hover:text-white no-underline text-xs font-semibold tracking-wider">
                            Rèn Luyện Thích Ứng
                        </Link>
                        <Link to="/practice-arena" className="text-gray-400 hover:text-white no-underline text-xs font-semibold tracking-wider">
                            Đấu Trường Luyện Tập
                        </Link>
                        <Link to="/profile" className="text-gray-400 hover:text-white no-underline text-xs font-semibold tracking-wider">
                            Tri Thức Cá Nhân
                        </Link>
                        {role === 'ADMIN' && (
                            <Link to="/admin" className="text-rose-400 hover:text-rose-300 no-underline text-xs font-bold tracking-wider">
                                Trang Quản Trị
                            </Link>
                        )}
                    </nav>

                    <ThemeToggle />
                </div>
            </header>

            {/* KodeKloud Style Hero Prompt & Interactive Dialogue Section */}
            <main className="max-w-7xl mx-auto px-6 py-10 w-full flex-1 flex flex-col justify-center">
                <div className="text-center max-w-3xl mx-auto space-y-4 pt-2">
                    <span className="text-xs font-bold bg-[#1F6FE5]/20 text-[#58A6FF] px-3.5 py-1 rounded-full border border-[#1F6FE5]/30 uppercase tracking-widest">
                        🖥️ Hands-on Learning. On Demand
                    </span>
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                        Learn Any Python & PAL-Net Concept <br />
                        <span className="text-[#58A6FF]">With Real Hands-on Practice</span>
                    </h1>
                    <p className="text-xs md:text-sm text-gray-400 max-w-xl mx-auto">
                        No generic chatting. No endless videos. Just focused, practical learning with live Docker labs.
                    </p>

                    {/* Prominent Input Bar */}
                    <div className="pt-4">
                        <div className={`bg-[#161B22] border rounded-2xl p-2 flex items-center shadow-2xl transition-all ${
                            chatLoading ? 'border-[#58A6FF] ring-2 ring-[#58A6FF]/20' : 'border-[#30363D] focus-within:border-[#58A6FF]'
                        }`}>
                            <input
                                type="text"
                                value={userPromptInput}
                                onChange={e => setUserPromptInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleStartChatSession()}
                                disabled={chatLoading}
                                placeholder="I want to learn... (Tôi muốn học về Vòng lặp For và Duyệt Mảng Python)"
                                className="flex-1 bg-transparent px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none disabled:opacity-60"
                            />
                            <button
                                onClick={() => handleStartChatSession()}
                                disabled={!userPromptInput.trim() || chatLoading}
                                className="bg-[#1F6FE5] hover:bg-[#388BFD] disabled:opacity-50 text-white font-bold p-3 rounded-xl transition-all shadow-lg flex items-center justify-center min-w-[44px]"
                            >
                                {chatLoading ? (
                                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin inline-block" />
                                ) : (
                                    '⬆'
                                )}
                            </button>
                        </div>

                        {/* Quick Suggestion Skill Chips */}
                        <div className="flex flex-wrap items-center justify-center gap-2 pt-4 text-xs">
                            <span className="text-gray-500 font-semibold mr-1">Explore Topics:</span>
                            {QUICK_SUGGESTIONS.map((chip, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleStartChatSession(chip.prompt)}
                                    disabled={chatLoading}
                                    className="bg-[#161B22] hover:bg-[#1F6FE5]/20 hover:border-[#58A6FF] border border-[#30363D] text-gray-300 hover:text-white px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 font-medium disabled:opacity-50"
                                >
                                    {chip.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* KodeKloud Style AI Tutor Loading State Card */}
                {chatLoading && !activeSessionId && (
                    <div className="max-w-xl mx-auto w-full pt-8 animate-fade-in">
                        <div className="bg-[#161B22] border border-[#58A6FF]/40 rounded-2xl p-6 shadow-2xl flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#1F6FE5] to-[#58A6FF] flex items-center justify-center text-2xl shadow-lg animate-pulse">
                                ✨
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#58A6FF] flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                                    VIBECODE AI TUTOR
                                </span>
                                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                    Analyzing your question & computing PAL-Net matrix...
                                    <span className="animate-pulse">|</span>
                                </h4>
                                <p className="text-xs text-gray-400">
                                    Đang kết nối Gemini LLM & phân tích tri thức vùng ZPD...
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Interactive AI Tutor Chat Dialogue Box */}
                {activeSessionId && (
                    <div className="max-w-4xl mx-auto w-full pt-8 space-y-3">
                        <div className="flex justify-between items-center">
                            <h2 className="text-sm font-bold text-white flex items-center gap-2">
                                💬 Phiên Tương Tác AI Tutor Đối Thoại
                            </h2>
                            <button
                                onClick={() => setActiveSessionId(null)}
                                className="text-xs text-gray-400 hover:text-white underline"
                            >
                                ✖ Hủy Đối Thoại
                            </button>
                        </div>
                        <AITutorChat
                            sessionId={activeSessionId}
                            messages={chatMessages}
                            onSendMessage={handleSendChatMessage}
                            onConfirmPath={handleConfirmPath}
                            loading={chatLoading}
                        />
                    </div>
                )}
            </main>

            {/* Simple Footer */}
            <footer className="border-t border-[#30363D] bg-[#161B22] py-4 text-center text-xs text-gray-500">
                VIBECODE AI System © 2026 — PAL-Net & OmniRoute Adaptive Learning Engine
            </footer>
        </div>
    );
};

export default PersonalizedPath;
