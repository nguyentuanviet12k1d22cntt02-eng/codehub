import React, { useState, useRef, useEffect } from 'react';
import { AgentEvidencePanel, type PipelineSummary } from './AgentEvidencePanel';
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
    PlusCircle,
    Sparkles,
    BookOpen,
    AlertTriangle,
    Code2,
    CheckCircle2
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
        intent?: string;
        agentTraces?: any[];
        pipeline?: PipelineSummary;
        exercise?: {
            title: string;
            exercise_id?: string;
            concept_id?: string;
            concept_name?: string;
            language?: string;
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
    currentAgentStep?: {
        agent?: string;
        title?: string;
        desc?: string;
        icon?: string;
        step?: string;
    } | null;
}

export const cleanLatexAndArtifacts = (text: any): any => {
    if (!text || typeof text !== 'string') return text;
    return text
        .replace(/\$\s*\\rightarrow\s*\$/g, '→')
        .replace(/\\rightarrow/g, '→')
        .replace(/\$\s*\\Rightarrow\s*\$/g, '⇒')
        .replace(/\\Rightarrow/g, '⇒')
        .replace(/\$\s*\\le\s*\$/g, '≤')
        .replace(/\\le/g, '≤')
        .replace(/\$\s*\\ge\s*\$/g, '≥')
        .replace(/\\ge/g, '≥')
        .replace(/\$\s*\\neq\s*\$/g, '≠')
        .replace(/\\neq/g, '≠')
        .replace(/在这里写代码|在此处编写代码|在下方编写代码|在下方写代码|请在此处编写代码/g, 'Viết mã tại đây')
        .replace(/写代码|编写代码/g, 'Viết mã')
        .replace(/你的代码/g, 'Mã của bạn')
        .replace(/代码/g, 'mã nguồn')
        .replace(/输入/g, 'Đầu vào')
        .replace(/输出/g, 'Đầu ra')
        .replace(/[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/g, '');
};

export const cleanChineseArtifacts = cleanLatexAndArtifacts;

export const normalizeCodeLanguage = (lang?: string, codeSnippet?: string): string => {
    const raw = (lang || '').toLowerCase();
    if (raw.includes('c++') || raw.includes('cpp') || raw === 'c') return 'cpp';
    if (raw.includes('js') || raw.includes('javascript') || raw.includes('ts') || raw.includes('typescript')) return 'javascript';
    if (raw.includes('sql')) return 'sql';
    if (codeSnippet && /#include\s*<|using\s+namespace\s+std|std::/i.test(codeSnippet)) return 'cpp';
    if (codeSnippet && /console\.log|function\s*\(|let\s+|const\s+/i.test(codeSnippet)) return 'javascript';
    return 'python';
};

// Custom Terminal Code Block with Line Numbers & Copy Button
const CodeBlock: React.FC<{ language: string; value: string }> = ({ language, value }) => {
    const [copied, setCopied] = useState(false);
    const cleanedValue = cleanChineseArtifacts(value);

    const handleCopy = () => {
        navigator.clipboard.writeText(cleanedValue);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const lines = cleanedValue.replace(/\n$/, '').split('\n');

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
                    {lines.map((_: string, i: number) => (
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

const AGENT_THEMES: Record<string, { bg: string; badge: string; border: string }> = {
    IntentRouterAgent: {
        bg: 'from-blue-50/90 to-indigo-50/90',
        badge: 'bg-blue-100 text-blue-800 border-blue-300',
        border: 'border-blue-300'
    },
    KnowledgeRetrievalAgent: {
        bg: 'from-emerald-50/90 to-teal-50/90',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        border: 'border-emerald-300'
    },
    AdaptiveExercisePlanner: {
        bg: 'from-purple-50/90 to-indigo-50/90',
        badge: 'bg-purple-100 text-purple-800 border-purple-300',
        border: 'border-purple-300'
    },
    ExplanationTutorAgent: {
        bg: 'from-amber-50/90 to-orange-50/90',
        badge: 'bg-amber-100 text-amber-800 border-amber-300',
        border: 'border-amber-300'
    },
    ExerciseGeneratorAgent: {
        bg: 'from-cyan-50/90 to-sky-50/90',
        badge: 'bg-cyan-100 text-cyan-800 border-cyan-300',
        border: 'border-cyan-300'
    },
    DeterministicValidators: {
        bg: 'from-slate-50/90 to-zinc-50/90',
        badge: 'bg-slate-100 text-slate-800 border-slate-300',
        border: 'border-slate-300'
    },
    CriticEvaluatorAgent: {
        bg: 'from-rose-50/90 to-pink-50/90',
        badge: 'bg-rose-100 text-rose-800 border-rose-300',
        border: 'border-rose-300'
    },
    DeliveryAgent: {
        bg: 'from-teal-50/90 to-emerald-50/90',
        badge: 'bg-teal-100 text-teal-800 border-teal-300',
        border: 'border-teal-300'
    }
};

export const AITutorChat: React.FC<AITutorChatProps> = ({
    sessionId: _sessionId,
    messages,
    onSendMessage,
    onConfirmPath,
    onStartExercise,
    onBack,
    onNewChat,
    loading,
    currentAgentStep
}) => {
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading, currentAgentStep]);

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
                                <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} min-w-0 max-w-[85%]`}>
                                    <div
                                        className={`w-full min-w-0 max-w-full p-4 rounded-2xl text-[13.5px] leading-relaxed shadow-xs ${
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
                                                                language={match ? match[1] : normalizeCodeLanguage(undefined, codeString)}
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
                                                {cleanLatexAndArtifacts(msg.content)}
                                            </ReactMarkdown>
                                        </div>

                                        {!isUser && meta?.agentTraces && meta.agentTraces.length > 0 && (
                                            <AgentEvidencePanel records={meta.agentTraces} pipeline={meta.pipeline} />
                                        )}

                                        {/* Embedded Adaptive Exercise Card */}
                                        {meta?.exercise && (
                                            <div className="mt-4 p-4 bg-[#F8FAFC] border-2 border-emerald-500/30 rounded-2xl space-y-3.5 shadow-xs">
                                                {/* Header Badges */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                                                            <Sparkles className="w-3 h-3 text-emerald-600" />
                                                            Bài Tập Thích Ứng
                                                        </span>
                                                        {meta.exercise.language && (
                                                            <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200 font-mono">
                                                                {meta.exercise.language}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-amber-500 font-semibold flex items-center gap-1">
                                                        {'⭐'.repeat(meta.exercise.difficulty_stars || 1)}
                                                        <span className="text-slate-500 text-[11px] ml-1">
                                                            {meta.exercise.difficulty_stars === 1 ? 'Cơ bản' : meta.exercise.difficulty_stars === 3 ? 'Nâng cao' : 'Vừa sức'}
                                                        </span>
                                                    </span>
                                                </div>

                                                {/* Title & Topic */}
                                                <div>
                                                    <h4 className="text-sm font-extrabold text-slate-900 leading-snug">
                                                        {cleanLatexAndArtifacts(meta.exercise.title)}
                                                    </h4>
                                                    {meta.exercise.concept_name && (
                                                        <span className="text-xs text-blue-600 font-medium">
                                                            Chủ đề: {cleanLatexAndArtifacts(meta.exercise.concept_name)}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Section 1: Nội dung cơ sở tri thức trọng tâm (Knowledge Base) */}
                                                {meta.exercise.quick_theory && (
                                                    <div className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs space-y-1">
                                                        <div className="flex items-center gap-1.5 font-bold text-emerald-700 text-xs">
                                                            <BookOpen className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                                            <span>Cơ sở tri thức trọng tâm:</span>
                                                        </div>
                                                        <p className="leading-relaxed text-slate-700 pl-5">
                                                            {cleanLatexAndArtifacts(meta.exercise.quick_theory)}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Pitfall Warning */}
                                                {meta.exercise.common_pitfall_warning && (
                                                    <div className="text-xs text-amber-900 bg-amber-50/90 p-2.5 rounded-xl border border-amber-200/80 flex items-start gap-2">
                                                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                                        <div className="leading-relaxed">
                                                            <span className="font-bold text-amber-800">Lưu ý cạm bẫy: </span>
                                                            {cleanLatexAndArtifacts(meta.exercise.common_pitfall_warning)}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Section 2: Nội dung thử thách đã tạo (Created Content / Problem Statement) */}
                                                {meta.exercise.problem_statement && (
                                                    <div className="text-xs text-slate-800 bg-blue-50/40 p-3 rounded-xl border border-blue-100/90 shadow-xs space-y-2">
                                                        <div className="flex items-center gap-1.5 font-bold text-blue-800 text-xs">
                                                            <Code2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                                            <span>Yêu cầu thử thách đã tạo:</span>
                                                        </div>
                                                        <div className="leading-relaxed text-slate-700 whitespace-pre-line pl-5">
                                                            {cleanLatexAndArtifacts(meta.exercise.problem_statement)}
                                                        </div>

                                                        {/* Sample Input & Output if provided */}
                                                        {(meta.exercise.sample_input || meta.exercise.sample_output) && (
                                                            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono pl-5">
                                                                {meta.exercise.sample_input && (
                                                                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                                                                        <span className="text-slate-400 font-sans font-medium text-[10px] block mb-0.5">Đầu vào mẫu:</span>
                                                                        <span className="text-slate-800">{cleanLatexAndArtifacts(meta.exercise.sample_input)}</span>
                                                                    </div>
                                                                )}
                                                                {meta.exercise.sample_output && (
                                                                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                                                                        <span className="text-slate-400 font-sans font-medium text-[10px] block mb-0.5">Đầu ra kỳ vọng:</span>
                                                                        <span className="text-emerald-700 font-bold">{cleanLatexAndArtifacts(meta.exercise.sample_output)}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* Test cases count */}
                                                        {meta.exercise.test_cases && meta.exercise.test_cases.length > 0 && (
                                                            <div className="pl-5 pt-0.5 flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                                                <span>Có {meta.exercise.test_cases.length} test công khai. Test ẩn được giữ trên hệ thống chấm bài.</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Action Button: Open Code Editor */}
                                                <div className="pt-1">
                                                    <button
                                                        onClick={() =>
                                                            onStartExercise
                                                                ? onStartExercise(meta.exercise)
                                                                : onConfirmPath()
                                                        }
                                                        disabled={loading}
                                                        className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:opacity-95 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                                                    >
                                                        🚀 Mở Code Editor Thực Hành Ngay (Nạp sẵn mã khung & Test cases)
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
                                                    {cleanLatexAndArtifacts(meta.previewData.title)}
                                                </h4>
                                                <p className="text-xs text-slate-600 leading-relaxed">
                                                    {cleanLatexAndArtifacts(meta.previewData.description)}
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

                    {/* Dynamic Real-Time Multi-Agent Execution Telemetry */}
                    {loading && (
                        <div className="flex items-start gap-3 animate-fade-in">
                            <div className="mt-1 shrink-0">
                                <RobotAvatar size={34} />
                            </div>
                            <div className="bg-white border border-slate-200/90 rounded-2xl rounded-tl-none p-4 shadow-sm max-w-[85%] space-y-3">
                                {/* Header with Real-Time Pipeline Status */}
                                <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2.5">
                                    <div className="flex items-center gap-2">
                                        <span className="relative flex h-2.5 w-2.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
                                        </span>
                                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                                            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                                            Tác Tử Đang Xử Lý Thời Gian Thực
                                        </span>
                                    </div>
                                    {currentAgentStep?.step && (
                                        <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded-full">
                                            {currentAgentStep.step}
                                        </span>
                                    )}
                                </div>

                                {/* Active Agent Card (Live from Python backend) */}
                                {(() => {
                                    const agentName = currentAgentStep?.agent || 'AdaptiveOrchestrator';
                                    const theme = AGENT_THEMES[agentName] || {
                                        bg: 'from-blue-50/80 to-indigo-50/80',
                                        badge: 'bg-blue-100 text-blue-800 border-blue-200',
                                        border: 'border-blue-200'
                                    };
                                    const icon = currentAgentStep?.icon || '⚡';
                                    const title = currentAgentStep?.title || (loading ? 'Đang kết nối tới Hệ thống Đa Tác Tử...' : 'Đang xử lý...');
                                    const desc = currentAgentStep?.desc || 'Đang điều phối các tác tử chuyên biệt để phân tích và chuẩn bị câu trả lời...';

                                    return (
                                        <div className={`p-3.5 rounded-xl border ${theme.border} bg-gradient-to-r ${theme.bg} transition-all duration-300 shadow-xs`}>
                                            <div className="flex items-center justify-between gap-2 mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg">{icon}</span>
                                                    <span className="text-xs font-bold text-slate-900">
                                                        {title}
                                                    </span>
                                                </div>
                                                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${theme.badge}`}>
                                                    {agentName}
                                                </span>
                                            </div>
                                            <p className="text-[12px] text-slate-600 leading-relaxed font-normal">
                                                {desc}
                                            </p>
                                        </div>
                                    );
                                })()}
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
