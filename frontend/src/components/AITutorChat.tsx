import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export interface ChatMessage {
    id?: string;
    sender: 'USER' | 'AI_TUTOR';
    content: string;
    metadata?: {
        step?: 'CLARIFY' | 'PREVIEW';
        suggestedOptions?: string[];
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
    loading: boolean;
}

export const AITutorChat: React.FC<AITutorChatProps> = ({
    sessionId,
    messages,
    onSendMessage,
    onConfirmPath,
    loading
}) => {
    const [inputText, setInputText] = useState('');

    const handleSend = () => {
        if (!inputText.trim() || loading) return;
        onSendMessage(inputText.trim());
        setInputText('');
    };

    return (
        <div className="bg-[#161B22] border border-[#30363D] rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[550px]">
            {/* Header */}
            <div className="bg-[#0D1117] px-6 py-4 border-b border-[#30363D] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <h3 className="text-sm font-bold text-white tracking-wide">
                        🤖 AI Tutor (PAL-Net Socratic Dialogue)
                    </h3>
                </div>
                <span className="text-[11px] text-gray-400 font-mono">
                    Session #{sessionId.slice(-6)}
                </span>
            </div>

            {/* Message Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#0D1117]/60">
                {messages.map((msg, index) => {
                    const isUser = msg.sender === 'USER';
                    const meta = msg.metadata;

                    return (
                        <div
                            key={index}
                            className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-2`}
                        >
                            <div
                                className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                                    isUser
                                        ? 'bg-[#1F6FE5] text-white rounded-br-none shadow-md'
                                        : 'bg-[#161B22] text-gray-200 border border-[#30363D] rounded-bl-none shadow-lg'
                                }`}
                            >
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {msg.content}
                                </ReactMarkdown>

                                {/* Pipeline Preview Card inside AI Message */}
                                {meta?.previewData && (
                                    <div className="mt-4 p-4 bg-[#0D1117] border border-[#58A6FF]/40 rounded-xl space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#1F6FE5]/20 text-[#58A6FF] px-2 py-0.5 rounded border border-[#1F6FE5]/30">
                                                Phác Thảo Pipeline Lộ Trình
                                            </span>
                                            <span className="text-xs text-gray-400 font-semibold">
                                                {meta.previewData.lessons_count} Bài Học Thích Ứng
                                            </span>
                                        </div>

                                        <h4 className="text-base font-extrabold text-white">
                                            {meta.previewData.title}
                                        </h4>
                                        <p className="text-xs text-gray-300">
                                            {meta.previewData.description}
                                        </p>

                                         <div className="pt-2 flex flex-wrap gap-2">
                                             {Array.isArray(meta.previewData.components) && meta.previewData.components.map((comp: any, cIdx: number) => {
                                                 const label = typeof comp === 'string' ? comp : (comp?.title || comp?.name || comp?.description || JSON.stringify(comp));
                                                 return (
                                                     <span key={cIdx} className="text-[11px] bg-[#21262D] text-gray-300 px-2 py-1 rounded border border-[#30363D]">
                                                         ✓ {label}
                                                     </span>
                                                 );
                                             })}
                                         </div>

                                        <div className="pt-3">
                                            <button
                                                onClick={onConfirmPath}
                                                disabled={loading}
                                                className="w-full bg-gradient-to-r from-[#238636] to-[#2EA043] hover:opacity-90 disabled:opacity-50 text-white font-black py-2.5 rounded-lg text-xs uppercase tracking-wider transition-all shadow-xl flex items-center justify-center gap-2"
                                            >
                                                🚀 Chốt Lộ Trình & Bắt Đầu Học Ngay
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Suggested Option Chips */}
                            {meta?.suggestedOptions && meta.suggestedOptions.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {meta.suggestedOptions.map((opt: string, oIdx: number) => {
                                        const isConfirmChip = /chốt lộ trình|bắt đầu học/i.test(opt);
                                        return (
                                            <button
                                                key={oIdx}
                                                onClick={() => {
                                                    if (isConfirmChip) {
                                                        onConfirmPath();
                                                    } else {
                                                        onSendMessage(opt);
                                                    }
                                                }}
                                                className={`text-xs px-3 py-1.5 rounded-full transition-all text-left font-bold ${
                                                    isConfirmChip
                                                        ? 'bg-gradient-to-r from-[#238636] to-[#2EA043] text-white hover:opacity-90 shadow-md border-none'
                                                        : 'bg-[#1F242C] hover:bg-[#1F6FE5]/20 hover:border-[#58A6FF] border border-[#30363D] text-[#58A6FF]'
                                                }`}
                                            >
                                                {opt}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}

                {loading && (
                    <div className="flex items-center gap-2 text-xs text-gray-400 italic">
                        <span className="w-2 h-2 rounded-full bg-[#58A6FF] animate-ping" />
                        AI Tutor đang suy nghĩ và phân tích tri thức PAL-Net...
                    </div>
                )}
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-[#161B22] border-t border-[#30363D] flex gap-3">
                <input
                    type="text"
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="Nhập phản hồi hoặc yêu cầu điều chỉnh của bạn..."
                    className="flex-1 bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#58A6FF]"
                />
                <button
                    onClick={handleSend}
                    disabled={!inputText.trim() || loading}
                    className="bg-[#1F6FE5] hover:bg-[#388BFD] disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all"
                >
                    Gửi ⬆
                </button>
            </div>
        </div>
    );
};
