import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { stripQuizSectionFromMarkdown } from '../../utils/quizParser';

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

                        return (
                            <div className="my-5 rounded-xl border border-border-custom bg-[#0d1117] overflow-hidden shadow-sm">
                                {match && (
                                    <div className="px-4 py-1.5 bg-[#161b22] border-b border-white/10 text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
                                        <span>{match[1]}</span>
                                    </div>
                                )}
                                <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed font-mono text-slate-200 select-text m-0 whitespace-pre">
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                </pre>
                            </div>
                        );
                    },
                    table: ({ ...props }) => (
                        <div className="overflow-x-auto w-full border border-border-custom rounded-xl my-6 transition-colors duration-200">
                            <table className="w-full text-sm text-left border-collapse" {...props} />
                        </div>
                    ),
                    thead: ({ ...props }) => <thead className="bg-bg-tertiary border-b border-border-custom" {...props} />,
                    tbody: ({ ...props }) => <tbody className="divide-y divide-border-custom" {...props} />,
                    tr: ({ ...props }) => <tr className="hover:bg-bg-tertiary/40 transition-colors" {...props} />,
                    th: ({ ...props }) => <th className="p-3.5 font-semibold text-text-primary border-r border-border-custom last:border-r-0 text-xs tracking-wider uppercase bg-bg-tertiary" {...props} />,
                    td: ({ ...props }) => <td className="p-3.5 text-text-secondary border-r border-border-custom/50 last:border-r-0 text-sm leading-relaxed" {...props} />,
                    details: ({ ...props }) => <details className="my-5 p-4 rounded-xl border border-border-custom bg-bg-secondary text-sm transition-all" {...props} />,
                    summary: ({ ...props }) => <summary className="font-semibold text-text-primary cursor-pointer select-none hover:text-accent-custom transition-colors" {...props} />
                }}
            >
                {cleanedContent}
            </ReactMarkdown>
        </div>
    );
};
