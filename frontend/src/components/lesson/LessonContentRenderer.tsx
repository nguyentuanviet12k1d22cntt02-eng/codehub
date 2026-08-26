import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { stripQuizSectionFromMarkdown } from '../../utils/quizParser';
import { tokenizeAndHighlight } from '../admin/studio/components/StudioCodeEditor';

interface LessonContentRendererProps {
    content: string;
}

const stripFrontmatter = (content: string) => {
    if (!content) return '';
    return content.replace(/^---\s*[\s\S]*?---\s*/, '');
};

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

// Student View Code Block with dark matte terminal theme, copy button, line numbers and syntax highlighting
const StudentCodeBlockView: React.FC<{ code: string; language: string }> = ({ code, language }) => {
    const [copied, setCopied] = useState(false);
    const lines = (code || '').replace(/\n$/, '').split('\n');
    const lineCount = Math.max(1, lines.length);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="my-5 rounded-[6px] bg-[#12131a] border border-[#222430] shadow-md overflow-hidden text-slate-200 text-xs font-mono select-text transition-all not-prose">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-3.5 py-2 bg-[#171822] border-b border-[#222430] select-none">
                <span className="text-slate-300 text-xs font-semibold uppercase tracking-wider">
                    {language || 'Python'}
                </span>
                <div className="flex items-center gap-2 text-slate-400">
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="hover:text-white transition-colors p-1"
                        title={copied ? 'Đã sao chép!' : 'Sao chép mã'}
                    >
                        {copied ? (
                            <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                                <span>✓</span> Đã chép
                            </span>
                        ) : (
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Code Body with Line Numbers & Syntax Highlighting */}
            <div className="flex items-stretch bg-[#12131a] pb-3 pt-2">
                {/* Left Gutter: Line Numbers */}
                <div className="w-8 pl-3.5 select-none text-slate-600 text-[13px] font-mono leading-[22px] flex-shrink-0 text-left">
                    {Array.from({ length: lineCount }).map((_, idx) => (
                        <div key={idx}>{idx + 1}</div>
                    ))}
                </div>

                {/* Right: Code Area with Syntax Highlighting */}
                <div className="flex-1 pl-3 pr-4 overflow-x-auto">
                    <pre
                        dangerouslySetInnerHTML={{ __html: tokenizeAndHighlight(code, language) }}
                        className="w-full m-0 p-0 font-mono text-[13px] leading-[22px] text-slate-100 whitespace-pre overflow-x-auto select-text"
                    />
                </div>
            </div>
        </div>
    );
};

export const LessonContentRenderer: React.FC<LessonContentRendererProps> = ({ content }) => {
    const cleanedContent = stripQuizSectionFromMarkdown(stripFrontmatter(content || ''));

    return (
        <div className="select-text prose max-w-none text-[15px] leading-7">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                    h1: ({ ...props }) => <h1 className="text-2xl font-bold text-text-primary mt-10 mb-4 tracking-tight" {...props} />,
                    h2: ({ ...props }) => <h2 className="text-xl font-bold text-text-primary mt-10 mb-4 pb-2 border-b border-border-custom tracking-tight" {...props} />,
                    h3: ({ ...props }) => <h3 className="text-base sm:text-lg font-semibold text-text-primary mt-8 mb-3 tracking-tight" {...props} />,
                    p: ({ ...props }) => <p className="text-[15px] text-text-secondary mb-4 leading-relaxed" {...props} />,
                    ul: ({ ...props }) => <ul className="list-disc pl-5 mb-5 text-[15px] text-text-secondary flex flex-col gap-1.5" {...props} />,
                    ol: ({ ...props }) => <ol className="list-decimal pl-5 mb-5 text-[15px] text-text-secondary flex flex-col gap-1.5" {...props} />,
                    li: ({ ...props }) => <li className="text-[15px] text-text-secondary" {...props} />,
                    strong: ({ ...props }) => <strong className="font-semibold text-text-primary" {...props} />,
                    hr: ({ ...props }) => <hr className="my-8 border-border-custom" {...props} />,
                    blockquote: ({ children }) => {
                        const textContent = getReactTextContent(children);
                        const isNote = textContent.includes('[!NOTE]');
                        const isWarning = textContent.includes('[!WARNING]') || textContent.includes('[!CAUTION]');
                        const isTip = textContent.includes('[!TIP]') || textContent.includes('[!IMPORTANT]');

                        let icon = '📌';
                        let typeLabel = 'Ghi chú';
                        let borderClass = 'border-l-4 border-blue-500 bg-blue-500/5 text-text-secondary';

                        if (isNote) {
                            icon = 'ℹ️';
                            typeLabel = 'Lưu ý';
                            borderClass = 'border-l-4 border-sky-500 bg-sky-500/5 text-text-secondary';
                        } else if (isWarning) {
                            icon = '⚠️';
                            typeLabel = 'Cảnh báo quan trọng';
                            borderClass = 'border-l-4 border-amber-500 bg-amber-500/5 text-text-secondary';
                        } else if (isTip) {
                            icon = '💡';
                            typeLabel = 'Mẹo & Thực hành tốt';
                            borderClass = 'border-l-4 border-emerald-500 bg-emerald-500/5 text-text-secondary';
                        }

                        const cleaned = cleanAlertPrefix(children);

                        if (isNote || isWarning || isTip) {
                            return (
                                <div className={`p-4 rounded-r-xl my-6 text-left transition-colors duration-200 ${borderClass}`}>
                                    <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider mb-2 text-text-primary">
                                        <span>{icon}</span>
                                        <span>{typeLabel}</span>
                                    </div>
                                    <div className="text-sm leading-relaxed text-text-secondary">
                                        {cleaned}
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <blockquote className="border-l-4 border-border-custom pl-4 py-1.5 my-4 text-text-tertiary italic text-left text-sm">
                                {children}
                            </blockquote>
                        );
                    },
                    code: ({ className, children, ...props }) => {
                        const contentStr = String(children || '');
                        const hasNewline = contentStr.includes('\n');
                        const match = /language-(\w+)/.exec(className || '');
                        const isInline = !match && !hasNewline;

                        if (isInline) {
                            return (
                                <code className="font-mono text-[13px] bg-bg-tertiary text-text-primary px-1.5 py-0.5 rounded border border-border-custom font-medium" {...props}>
                                    {children}
                                </code>
                            );
                        }

                        const lang = match ? match[1] : 'Python';
                        return <StudentCodeBlockView code={contentStr} language={lang} />;
                    },
                    table: ({ ...props }) => (
                        <div className="overflow-x-auto w-full border border-border-custom rounded-xl my-6 transition-colors duration-200">
                            <table className="w-full text-sm border-collapse" {...props} />
                        </div>
                    ),
                    thead: ({ ...props }) => <thead className="bg-bg-tertiary border-b border-border-custom" {...props} />,
                    tbody: ({ ...props }) => <tbody className="divide-y divide-border-custom" {...props} />,
                    tr: ({ ...props }) => <tr className="hover:bg-bg-tertiary/40 transition-colors" {...props} />,
                    th: ({ style, ...props }: any) => (
                        <th
                            className="p-3.5 font-semibold text-text-primary border-r border-border-custom last:border-r-0 text-xs tracking-wider uppercase bg-bg-tertiary"
                            style={style}
                            {...props}
                        />
                    ),
                    td: ({ style, ...props }: any) => (
                        <td
                            className="p-3.5 text-text-secondary border-r border-border-custom/50 last:border-r-0 text-sm leading-relaxed"
                            style={style}
                            {...props}
                        />
                    ),
                    details: ({ ...props }) => <details className="my-5 p-4 rounded-xl border border-border-custom bg-bg-secondary text-sm transition-all" {...props} />,
                    summary: ({ ...props }) => <summary className="font-semibold text-text-primary cursor-pointer select-none hover:text-accent-custom transition-colors" {...props} />
                }}
            >
                {cleanedContent}
            </ReactMarkdown>
        </div>
    );
};
