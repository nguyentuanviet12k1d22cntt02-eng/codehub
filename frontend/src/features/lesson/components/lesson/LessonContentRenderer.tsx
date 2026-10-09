import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Check, Copy, Info, Lightbulb, Quote, TriangleAlert } from 'lucide-react';
import { stripQuizSectionFromMarkdown } from '../../../../utils/quizParser';
import { tokenizeAndHighlight } from '../../../../features/admin/lesson-studio/studio/components/StudioCodeEditor';

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
        <div className="not-prose my-7 rounded-2xl bg-[#0B1020] border border-slate-700/70 shadow-[0_18px_45px_-24px_rgba(15,23,42,0.9)] overflow-hidden text-slate-200 text-xs font-mono select-text transition-all">
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 bg-[#11182A] border-b border-slate-700/70 select-none">
                <span className="text-slate-300 text-[11px] font-bold uppercase tracking-[0.16em] font-mono">
                    {language || 'Python'}
                </span>
                <button
                    type="button"
                    onClick={handleCopy}
                    aria-label={copied ? 'Đã sao chép mã' : 'Sao chép mã'}
                    className="inline-flex min-h-9 items-center gap-2 rounded-lg px-3 text-[11px] font-semibold text-slate-400 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 transition-colors"
                >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
                </button>
            </div>

            {/* Code Body with Real Line Numbers & Real-Time Syntax Highlighting */}
            <div className="flex items-stretch bg-[#0B1020] py-4">
                {/* Left Gutter: Line Numbers */}
                <div className="w-11 pl-4 select-none text-slate-600 text-[13px] font-mono leading-6 flex-shrink-0 text-left">
                    {Array.from({ length: lineCount }).map((_, idx) => (
                        <div key={idx}>{idx + 1}</div>
                    ))}
                </div>

                {/* Right: Code Area with Syntax Highlighting */}
                <div className="flex-1 pl-3 pr-5 overflow-x-auto">
                    <pre
                        dangerouslySetInnerHTML={{ __html: tokenizeAndHighlight(code, language) }}
                        style={{
                            padding: '0 !important',
                            margin: '0 !important',
                            background: 'transparent !important',
                            border: 'none !important',
                            boxShadow: 'none !important'
                        }}
                        className="w-full !p-0 !m-0 !bg-transparent !border-0 !shadow-none font-mono text-[13px] sm:text-sm leading-6 text-slate-100 whitespace-pre overflow-x-auto select-text"
                    />
                </div>
            </div>
        </div>
    );
};

const sanitizeMathAndFormatting = (markdown: string): string => {
    if (!markdown) return '';
    return markdown
        // Replace LaTeX multiplications, divisions, plusminus, inequalities
        .replace(/\\times/g, '×')
        .replace(/\\div/g, '÷')
        .replace(/\\pm/g, '±')
        .replace(/\\le\b|\\leq\b/g, '≤')
        .replace(/\\ge\b|\\geq\b/g, '≥')
        .replace(/\\approx/g, '≈')
        .replace(/\\neq/g, '≠')
        .replace(/\\cdot/g, '·')
        .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
        .replace(/\\sqrt/g, '√')
        // Superscripts
        .replace(/10\^\{?18\}?/g, '10¹⁸')
        .replace(/10\^\{?9\}?/g, '10⁹')
        .replace(/10\^\{?6\}?/g, '10⁶')
        .replace(/10\^\{?5\}?/g, '10⁵')
        .replace(/2\^\{?31\}?/g, '2³¹')
        .replace(/2\^\{?63\}?/g, '2⁶³')
        // Strip single $ delimiters around inline math expressions
        .replace(/\$([^\$\n]+)\$/g, '$1');
};

export const LessonContentRenderer: React.FC<LessonContentRendererProps> = ({ content }) => {
    const cleanedContent = sanitizeMathAndFormatting(stripQuizSectionFromMarkdown(stripFrontmatter(content || '')));

    return (
        <div className="select-text prose prose-slate dark:prose-invert max-w-none text-[16px] leading-8">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                    h1: ({ ...props }) => <h1 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white mt-10 mb-6 tracking-[-0.03em] leading-tight" {...props} />,
                    h2: ({ ...props }) => <h2 className="text-2xl sm:text-[28px] font-extrabold text-slate-950 dark:text-white mt-12 mb-5 pb-3 border-b border-slate-200 dark:border-white/10 tracking-[-0.025em]" {...props} />,
                    h3: ({ ...props }) => <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-9 mb-3 tracking-tight" {...props} />,
                    p: ({ ...props }) => <p className="text-[15px] sm:text-base text-slate-700 dark:text-slate-300 mb-5 leading-7 sm:leading-8" {...props} />,
                    ul: ({ ...props }) => <ul className="list-disc pl-6 mb-6 text-[15px] sm:text-base text-slate-700 dark:text-slate-300 flex flex-col gap-2 marker:text-blue-500" {...props} />,
                    ol: ({ ...props }) => <ol className="list-decimal pl-6 mb-6 text-[15px] sm:text-base text-slate-700 dark:text-slate-300 flex flex-col gap-2 marker:font-bold marker:text-blue-600" {...props} />,
                    li: ({ ...props }) => <li className="text-[15px] sm:text-base text-slate-700 dark:text-slate-300 pl-1 leading-7" {...props} />,
                    strong: ({ ...props }) => <strong className="font-bold text-slate-950 dark:text-white" {...props} />,
                    hr: ({ ...props }) => <hr className="my-10 border-slate-200 dark:border-white/10" {...props} />,
                    blockquote: ({ children }) => {
                        const textContent = getReactTextContent(children);
                        const isNote = textContent.includes('[!NOTE]');
                        const isWarning = textContent.includes('[!WARNING]') || textContent.includes('[!CAUTION]');
                        const isTip = textContent.includes('[!TIP]') || textContent.includes('[!IMPORTANT]');

                        let AlertIcon = Quote;
                        let typeLabel = 'Ghi chú';
                        let borderClass = 'border-blue-200 bg-blue-50/70 text-blue-950 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-100';

                        if (isNote) {
                            AlertIcon = Info;
                            typeLabel = 'Lưu ý';
                            borderClass = 'border-sky-200 bg-sky-50/70 text-sky-950 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-100';
                        } else if (isWarning) {
                            AlertIcon = TriangleAlert;
                            typeLabel = 'Cảnh báo quan trọng';
                            borderClass = 'border-amber-200 bg-amber-50/80 text-amber-950 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-100';
                        } else if (isTip) {
                            AlertIcon = Lightbulb;
                            typeLabel = 'Mẹo & Thực hành tốt';
                            borderClass = 'border-emerald-200 bg-emerald-50/80 text-emerald-950 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-100';
                        }

                        const cleaned = cleanAlertPrefix(children);

                        if (isNote || isWarning || isTip) {
                            return (
                                <div className={`p-5 rounded-2xl border my-7 text-left transition-colors duration-200 ${borderClass}`}>
                                    <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-[0.12em] mb-2.5">
                                        <AlertIcon aria-hidden="true" className="w-4 h-4" />
                                        <span>{typeLabel}</span>
                                    </div>
                                    <div className="text-sm sm:text-[15px] leading-7">
                                        {cleaned}
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <blockquote className="border-l-4 border-blue-400 dark:border-blue-500 pl-5 py-2 my-6 text-slate-600 dark:text-slate-400 italic text-left text-sm sm:text-base">
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
                                <code className="font-mono text-[13px] bg-slate-100 dark:bg-white/[0.08] text-blue-700 dark:text-cyan-300 px-1.5 py-0.5 rounded-md border border-slate-200 dark:border-white/10 font-semibold" {...props}>
                                    {children}
                                </code>
                            );
                        }

                        const lang = match ? match[1] : 'Python';
                        return <StudentCodeBlockView code={contentStr} language={lang} />;
                    },
                    table: ({ ...props }) => (
                        <div className="overflow-x-auto w-full border border-slate-200 dark:border-white/10 rounded-2xl my-7 transition-colors duration-200 shadow-sm">
                            <table className="w-full text-sm border-collapse" {...props} />
                        </div>
                    ),
                    thead: ({ ...props }) => <thead className="bg-slate-100 dark:bg-white/[0.06] border-b border-slate-200 dark:border-white/10" {...props} />,
                    tbody: ({ ...props }) => <tbody className="divide-y divide-slate-200 dark:divide-white/10" {...props} />,
                    tr: ({ ...props }) => <tr className="hover:bg-slate-50 dark:hover:bg-white/[0.035] transition-colors" {...props} />,
                    th: ({ style, ...props }: any) => (
                        <th
                            className="p-4 font-bold text-slate-900 dark:text-white border-r border-slate-200 dark:border-white/10 last:border-r-0 text-xs tracking-wider uppercase bg-slate-100 dark:bg-white/[0.06]"
                            style={style}
                            {...props}
                        />
                    ),
                    td: ({ style, ...props }: any) => (
                        <td
                            className="p-4 text-slate-700 dark:text-slate-300 border-r border-slate-200/70 dark:border-white/10 last:border-r-0 text-sm leading-relaxed"
                            style={style}
                            {...props}
                        />
                    ),
                    details: ({ ...props }) => <details className="my-6 p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] text-sm transition-all" {...props} />,
                    summary: ({ ...props }) => <summary className="font-bold text-slate-900 dark:text-white cursor-pointer select-none hover:text-blue-600 dark:hover:text-blue-400 transition-colors" {...props} />,
                    img: ({ src, alt, ...props }: any) => (
                        <figure className="my-8 flex flex-col items-center not-prose">
                            <img
                                src={src}
                                alt={alt}
                                loading="lazy"
                                className="rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-md max-w-full h-auto object-cover max-h-[480px] transition-transform duration-200 hover:scale-[1.01]"
                                {...props}
                            />
                            {alt && (
                                <figcaption className="mt-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 text-center font-medium italic">
                                    📸 {alt}
                                </figcaption>
                            )}
                        </figure>
                    )
                }}
            >
                {cleanedContent}
            </ReactMarkdown>
        </div>
    );
};
