import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
    ChevronLeft,
    Copy,
    Check,
    Send,
    Paperclip,
    MoreVertical,
    CheckCheck,
    Layers,
    PlusCircle
} from 'lucide-react';
import { RobotAvatar, UserAvatar, RobotStandingMascot } from './AITutorIllustrations';

export interface ChatMessage {
    id?: string;
    sender: 'USER' | 'AI_TUTOR';
    content: string;
    timestamp?: string;
    metadata?: {
        step?: string;
        suggestedOptions?: string[];
        exercise?: {
            title: string;
            concept_id?: string;
            concept_name?: string;
            quick_theory?: string;
            problem_statement?: string;
            sample_input?: string;
            sample_output?: string;
            starter_code?: string;
            reference_solution?: string;
            common_pitfall_warning?: string;
            difficulty_stars?: number;
            test_cases?: any[];
        };
        previewData?: {
            title: string;
            description: string;
            target_skills: any[];
            lessons_count: number;
            components: any[];
        };
    };
}

interface AITutorChatProps {
    sessionId: string;
    messages: ChatMessage[];
    onSendMessage: (text: string) => void;
    onConfirmPath: () => void;
    onStartExercise?: (exercise: any) => void;
    onBack?: () => void;
    onNewChat?: () => void;
    loading: boolean;
}

// Custom Terminal Code Block with Line Numbers & Copy Button
const CodeBlock: React.FC<{ language: string; value: string }> = ({ language, value }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const lines = value.replace(/\n$/, '').split('\n');

    return (
        <div className="my-3 rounded-xl overflow-hidden bg-[#1E293B] border border-slate-700/60 shadow-md">
            {/* Terminal Top Bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#16202E] border-b border-slate-700/60 text-xs text-slate-400 font-mono">
                <div className="flex items-center gap-2">
                    <span className="text-slate-300 font-semibold lowercase tracking-wide">
                        {language || 'python'}
                    </span>
                </div>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer text-xs"
                    title="Sao chép mã"
                >
                    {copied ? (
                        <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-sans">Đã chép</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="font-sans">Copy</span>
                        </>
                    )}
                </button>
            </div>

            {/* Code Content with Line Numbers */}
            <div className="p-3 overflow-x-auto flex text-xs font-mono leading-relaxed">
                <div className="select-none pr-3 text-right text-slate-500 border-r border-slate-700/50 mr-3 min-w-[22px]">
                    {lines.map((_, i) => (
                        <div key={i}>{i + 1}</div>
                    ))}
                </div>
                <pre className="text-slate-100 flex-1 overflow-x-auto whitespace-pre font-mono">
                    <code>{value}</code>
                </pre>
            </div>
        </div>
    );
};

export const AITutorChat: React.FC<AITutorChatProps> = ({
    sessionId: _sessionId,
    messages,
    onSendMessage,
    onConfirmPath,
    onStartExercise,
    onBack,
    onNewChat,
    loading
}) => {
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    const handleSend = () => {
        if (!inputText.trim() || loading) return;
        onSendMessage(inputText.trim());
        setInputText('');
    };

    const getFormattedTime = (timestamp?: string) => {
        if (!timestamp) {
            const now = new Date();
            return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        }
        try {
            const d = new Date(timestamp);
            return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
        } catch {
            return '14:32';
        }
    };

    return (
        <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm flex flex-col h-full transition-all">
            {/* Header Bar */}
            <div className="px-5 py-3.5 bg-white border-b border-slate-100 flex items-center justify-between z-10 shrink-0">
                <div className="flex items-center gap-3">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer mr-0.5"
                            title="Quay lại"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                    )}
                    <RobotAvatar size={42} showOnline={true} />
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                                AI Tutor
                            </h3>
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Online
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">
                            Luôn sẵn sàng hỗ trợ bạn học lập trình! 💙
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                    {onNewChat && (
                        <button
                            onClick={onNewChat}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-slate-600 hover:text-blue-600 text-xs font-semibold transition-all cursor-pointer shadow-xs"
                            title="Bắt đầu cuộc trò chuyện mới"
                        >
                            <PlusCircle className="w-3.5 h-3.5 text-blue-500" />
                            <span>Đoạn chat mới</span>
                        </button>
                    )}
                    <button
                        onClick={() => {
                            if (messages.length > 0) {
                                const text = messages.map(m => `${m.sender}: ${m.content}`).join('\n\n');
                                navigator.clipboard.writeText(text);
                                alert('Đã sao chép nội dung cuộc trò chuyện!');
                            }
                        }}
                        className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
                        title="Sao chép cuộc trò chuyện"
                    >
                        <Layers className="w-4 h-4" />
                    </button>
                    <button
                        className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
                        title="Tùy chọn"
                    >
                        <MoreVertical className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Middle Area: Centered Mascot when empty OR Message Stream when active */}
            {messages.length === 0 ? (
                <div className="flex-1 flex items-center justify-center p-6 bg-[#FAFBFD] overflow-y-auto">
                    <RobotStandingMascot onSelectStarter={onSendMessage} />
                </div>
            ) : (
                <div className="flex-1 p-5 overflow-y-auto space-y-6 bg-[#FAFBFD]">
                    {messages.map((msg, index) => {
                        const isUser = msg.sender === 'USER';
                        const meta = msg.metadata;
                        const timeStr = getFormattedTime(msg.timestamp);

                        return (
                            <div
                                key={index}
                                className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                            >
                                {/* AI Avatar on left */}
                                {!isUser && (
                                    <div className="mt-0.5 shrink-0">
                                        <RobotAvatar size={34} />
                                    </div>
                                )}

                                {/* Message Bubble Container */}
                                <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[85%]`}>
                                    <div
                                        className={`p-4 rounded-2xl text-[13.5px] leading-relaxed shadow-xs ${
                                            isUser
                                                ? 'bg-[#EFF6FF] border border-blue-100/90 text-slate-800 rounded-tr-none'
                                                : 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-none'
                                        }`}
                                    >
                                        {/* Markdown Body */}
                                        <div className="markdown-content prose prose-sm max-w-none text-slate-800">
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    code({ node, className, children, ...props }: any) {
                                                        const match = /language-(\w+)/.exec(className || '');
                                                        const codeString = String(children).replace(/\n$/, '');
                                                        const isInline = !match && !codeString.includes('\n');

                                                        if (isInline) {
                                                            return (
                                                                <code
                                                                    className="bg-blue-50 text-blue-700 font-mono text-xs px-1.5 py-0.5 rounded border border-blue-200/60 font-semibold"
                                                                    {...props}
                                                                >
                                                                    {children}
                                                                </code>
                                                            );
                                                        }

                                                        return (
                                                            <CodeBlock
                                                                language={match ? match[1] : 'python'}
                                                                value={codeString}
                                                            />
                                                        );
                                                    },
                                                    p({ children }) {
                                                        return <p className="mb-2 last:mb-0">{children}</p>;
                                                    },
                                                    ul({ children }) {
                                                        return <ul className="my-2 space-y-1 list-disc pl-5 text-slate-700">{children}</ul>;
                                                    },
                                                    ol({ children }) {
                                                        return <ol className="my-2 space-y-1 list-decimal pl-5 text-slate-700">{children}</ol>;
                                                    },
                                                    li({ children }) {
                                                        return <li className="leading-relaxed">{children}</li>;
                                                    },
                                                    strong({ children }) {
                                                        return <strong className="font-bold text-slate-900">{children}</strong>;
                                                    }
                                                }}
                                            >
                                                {msg.content}
                                            </ReactMarkdown>
                                        </div>

                                        {/* Embedded Adaptive Exercise Card */}
                                        {meta?.exercise && (
                                            <div className="mt-4 p-4 bg-[#F8FAFC] border-2 border-emerald-500/30 rounded-2xl space-y-3 shadow-xs">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                                                        🎯 Thử Thách Thích Ứng ZPD
                                                    </span>
                                                    <span className="text-xs text-amber-500 font-semibold flex items-center gap-1">
                                                        {'⭐'.repeat(meta.exercise.difficulty_stars || 1)}
                                                        <span className="text-slate-500 text-[11px] ml-1">
                                                            {meta.exercise.difficulty_stars === 1 ? 'Cơ bản' : 'Vừa sức'}
                                                        </span>
                                                    </span>
                                                </div>

                                                <div>
                                                    <h4 className="text-sm font-extrabold text-slate-900">
                                                        {meta.exercise.title}
                                                    </h4>
                                                    {meta.exercise.concept_name && (
                                                        <span className="text-xs text-blue-600 font-medium">
                                                            Chủ đề: {meta.exercise.concept_name}
                                                        </span>
                                                    )}
                                                </div>

                                                {meta.exercise.quick_theory && (
                                                    <div className="text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200">
                                                        <strong className="text-emerald-600">💡 Lý thuyết cốt lõi:</strong>{' '}
                                                        {meta.exercise.quick_theory}
                                                    </div>
                                                )}

                                                {meta.exercise.common_pitfall_warning && (
                                                    <div className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                                                        <strong className="text-amber-600">⚠️ Lưu ý bẫy lỗi:</strong>{' '}
                                                        {meta.exercise.common_pitfall_warning}
                                                    </div>
                                                )}

                                                {meta.exercise.starter_code && (
                                                    <div className="space-y-1">
                                                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                                                            Mã khung gợi ý (Starter Code):
                                                        </div>
                                                        <CodeBlock
                                                            language="python"
                                                            value={meta.exercise.starter_code}
                                                        />
                                                    </div>
                                                )}

                                                <div className="pt-2">
                                                    <button
                                                        onClick={() =>
                                                            onStartExercise
                                                                ? onStartExercise(meta.exercise)
                                                                : onConfirmPath()
                                                        }
                                                        disabled={loading}
                                                        className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:opacity-95 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                                                    >
                                                        🚀 Mở Code Editor Thực Hành Ngay
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Embedded Learning Path Pipeline Card */}
                                        {meta?.previewData && (
                                            <div className="mt-4 p-4 bg-white border-2 border-blue-500/30 rounded-2xl space-y-3 shadow-xs">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200">
                                                        Phác Thảo Pipeline Lộ Trình
                                                    </span>
                                                    <span className="text-xs text-slate-500 font-semibold">
                                                        {meta.previewData.lessons_count} Bài Học Thích Ứng
                                                    </span>
                                                </div>

                                                <h4 className="text-sm font-extrabold text-slate-900">
                                                    {meta.previewData.title}
                                                </h4>
                                                <p className="text-xs text-slate-600 leading-relaxed">
                                                    {meta.previewData.description}
                                                </p>

                                                <div className="pt-1 flex flex-wrap gap-1.5">
                                                    {Array.isArray(meta.previewData.components) &&
                                                        meta.previewData.components.map((comp: any, cIdx: number) => {
                                                            const label =
                                                                typeof comp === 'string'
                                                                    ? comp
                                                                    : comp?.title || comp?.name || comp?.description || JSON.stringify(comp);
                                                            return (
                                                                <span
                                                                    key={cIdx}
                                                                    className="text-[11px] bg-slate-50 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 font-medium"
                                                                >
                                                                    ✓ {label}
                                                                </span>
                                                            );
                                                        })}
                                                </div>

                                                <div className="pt-2">
                                                    <button
                                                        onClick={onConfirmPath}
                                                        disabled={loading}
                                                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                                                    >
                                                        🚀 Chốt Lộ Trình & Bắt Đầu Học Ngay
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Timestamp and status */}
                                    <div
                                        className={`flex items-center gap-1 mt-1 text-[11px] ${
                                            isUser ? 'text-blue-400 justify-end' : 'text-slate-400 justify-start pl-1'
                                        }`}
                                    >
                                        <span>{timeStr}</span>
                                        {isUser && <CheckCheck className="w-3.5 h-3.5 text-blue-500 inline" />}
                                    </div>

                                    {/* Quick Option Chips from AI */}
                                    {meta?.suggestedOptions && meta.suggestedOptions.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 pt-2">
                                            {meta.suggestedOptions.map((opt: string, oIdx: number) => {
                                                const isStartExerciseChip = /bắt đầu làm bài|code editor/i.test(opt);
                                                const isConfirmChip = /chốt lộ trình|bắt đầu học/i.test(opt);
                                                return (
                                                    <button
                                                        key={oIdx}
                                                        onClick={() => {
                                                            if (isStartExerciseChip && meta?.exercise && onStartExercise) {
                                                                onStartExercise(meta.exercise);
                                                            } else if (isConfirmChip) {
                                                                onConfirmPath();
                                                            } else {
                                                                onSendMessage(opt);
                                                            }
                                                        }}
                                                        className={`text-xs px-3 py-1.5 rounded-full transition-all font-medium cursor-pointer shadow-xs ${
                                                            isStartExerciseChip
                                                                ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:opacity-90 border-none'
                                                                : isConfirmChip
                                                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:opacity-90 border-none'
                                                                : 'bg-white hover:bg-blue-50 hover:border-blue-300 border border-slate-200 text-slate-700 hover:text-blue-700'
                                                        }`}
                                                    >
                                                        {opt}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* User Avatar on right */}
                                {isUser && (
                                    <div className="mt-0.5 shrink-0">
                                        <UserAvatar size={34} />
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* AI Thinking Animation */}
                    {loading && (
                        <div className="flex items-start gap-3 animate-fade-in">
                            <RobotAvatar size={34} />
                            <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-none p-4 shadow-xs flex items-center gap-3">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
                                <span className="text-xs text-slate-600 font-medium">
                                    AI Tutor đang suy nghĩ và chuẩn bị nội dung học cho bạn...
                                </span>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            )}

            {/* Bottom Floating-Style Input Bar */}
            <div className="p-4 bg-white border-t border-slate-100 shrink-0">
                <div className="flex items-center gap-2 bg-[#F8FAFC] border border-slate-200/90 rounded-2xl px-3 py-1.5 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all shadow-xs">
                    {/* Attachment button */}
                    <button
                        type="button"
                        className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Đính kèm tài liệu"
                    >
                        <Paperclip className="w-4 h-4" />
                    </button>

                    {/* Input Field */}
                    <input
                        type="text"
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        disabled={loading}
                        placeholder="Nhập câu hỏi của bạn..."
                        className="flex-1 bg-transparent py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none disabled:opacity-60"
                    />

                    {/* Send Button */}
                    <button
                        type="button"
                        onClick={handleSend}
                        disabled={!inputText.trim() || loading}
                        className="w-9 h-9 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-40 text-white flex items-center justify-center transition-all shadow-sm cursor-pointer shrink-0"
                        title="Gửi câu hỏi"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};
