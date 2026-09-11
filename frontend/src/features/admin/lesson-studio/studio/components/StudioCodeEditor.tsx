import React, { useState, useRef } from 'react';

interface StudioCodeEditorProps {
    code: string;
    language: string;
    onChangeCode: (newCode: string) => void;
    onChangeLanguage: (newLang: string) => void;
    isDarkTheme?: boolean;
}

const SUPPORTED_LANGUAGES = ['Python', 'SQL', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'JSON', 'Bash', 'C++', 'Java'];

const escapeHtml = (str: string): string => {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};

// Single-pass Tokenizer with robust inline styles (immune to .prose overrides)
export const tokenizeAndHighlight = (rawCode: string, lang: string = 'Python'): string => {
    if (!rawCode) return '&nbsp;';
    const l = (lang || 'Python').toUpperCase();

    // Keywords and builtins definition
    const pythonKeywords = new Set(['def', 'class', 'import', 'from', 'return', 'if', 'elif', 'else', 'for', 'while', 'in', 'try', 'except', 'finally', 'with', 'as', 'pass', 'break', 'continue', 'lambda', 'yield', 'raise', 'assert', 'async', 'await', 'True', 'False', 'None', 'not', 'and', 'or', 'is', 'global', 'nonlocal']);
    const pythonBuiltins = new Set(['print', 'len', 'range', 'input', 'str', 'int', 'float', 'list', 'dict', 'set', 'tuple', 'open', 'type', 'sum', 'min', 'max', 'enumerate', 'zip', 'isinstance', 'sorted', 'abs', 'round', 'map', 'filter', 'all', 'any']);

    const sqlKeywords = new Set(['SELECT', 'FROM', 'WHERE', 'ORDER', 'BY', 'GROUP', 'HAVING', 'INSERT', 'INTO', 'UPDATE', 'DELETE', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'ON', 'AS', 'AND', 'OR', 'NOT', 'IN', 'LIKE', 'ASC', 'DESC', 'LIMIT', 'OFFSET', 'VALUES', 'SET', 'CREATE', 'DROP', 'ALTER', 'TABLE', 'PRIMARY', 'KEY', 'FOREIGN', 'NULL', 'DISTINCT', 'UNION', 'ALL', 'EXISTS', 'BETWEEN', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END']);

    const jsKeywords = new Set(['const', 'let', 'var', 'function', 'return', 'if', 'else', 'switch', 'case', 'break', 'for', 'while', 'do', 'import', 'export', 'default', 'class', 'extends', 'new', 'this', 'async', 'await', 'try', 'catch', 'finally', 'throw', 'typeof', 'instanceof', 'true', 'false', 'null', 'undefined']);
    const jsBuiltins = new Set(['console', 'log', 'document', 'window', 'Math', 'JSON', 'Promise', 'Array', 'Object', 'String', 'Number', 'fetch', 'setTimeout', 'setInterval']);

    let regex: RegExp;
    if (l === 'SQL') {
        regex = /(--[^\n]*|\/\*[\s\S]*?\*\/)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|(\b\d+(?:\.\d+)?\b)|(\b[a-zA-Z_][a-zA-Z0-9_]*\b)|([^\s\w])/g;
    } else if (l === 'PYTHON') {
        regex = /(#[^\n]*)|(f?'''[\s\S]*?'''|f?"""[\s\S]*?"""|f?'(?:[^'\\]|\\.)*'|f?"(?:[^"\\]|\\.)*")|(\b\d+(?:\.\d+)?\b)|(\b[a-zA-Z_][a-zA-Z0-9_]*\b)|([^\s\w])/g;
    } else {
        regex = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|(`(?:[^`\\]|\\.)*`|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|(\b\d+(?:\.\d+)?\b)|(\b[a-zA-Z_][a-zA-Z0-9_]*\b)|([^\s\w])/g;
    }

    let lastIndex = 0;
    let htmlResult = '';
    let match: RegExpExecArray | null;

    while ((match = regex.exec(rawCode)) !== null) {
        if (match.index > lastIndex) {
            htmlResult += escapeHtml(rawCode.substring(lastIndex, match.index));
        }

        const [full, comment, stringLit, numberLit, word, operator] = match;

        if (comment) {
            htmlResult += `<span style="color: #64748b; font-style: italic;">${escapeHtml(comment)}</span>`;
        } else if (stringLit) {
            htmlResult += `<span style="color: #4ade80; font-weight: 500;">${escapeHtml(stringLit)}</span>`;
        } else if (numberLit) {
            htmlResult += `<span style="color: #38bdf8; font-weight: 500;">${escapeHtml(numberLit)}</span>`;
        } else if (word) {
            if (l === 'SQL') {
                if (sqlKeywords.has(word.toUpperCase())) {
                    htmlResult += `<span style="color: #f43f5e; font-weight: 700;">${escapeHtml(word)}</span>`;
                } else {
                    htmlResult += `<span style="color: #f8fafc;">${escapeHtml(word)}</span>`;
                }
            } else if (l === 'PYTHON') {
                if (pythonKeywords.has(word)) {
                    htmlResult += `<span style="color: #f59e0b; font-weight: 700;">${escapeHtml(word)}</span>`;
                } else if (pythonBuiltins.has(word)) {
                    htmlResult += `<span style="color: #c084fc; font-weight: 600;">${escapeHtml(word)}</span>`;
                } else {
                    htmlResult += `<span style="color: #f8fafc;">${escapeHtml(word)}</span>`;
                }
            } else {
                if (jsKeywords.has(word)) {
                    htmlResult += `<span style="color: #38bdf8; font-weight: 700;">${escapeHtml(word)}</span>`;
                } else if (jsBuiltins.has(word)) {
                    htmlResult += `<span style="color: #facc15; font-weight: 600;">${escapeHtml(word)}</span>`;
                } else {
                    htmlResult += `<span style="color: #f8fafc;">${escapeHtml(word)}</span>`;
                }
            }
        } else if (operator) {
            htmlResult += `<span style="color: #94a3b8;">${escapeHtml(operator)}</span>`;
        } else {
            htmlResult += escapeHtml(full);
        }

        lastIndex = regex.lastIndex;
    }

    if (lastIndex < rawCode.length) {
        htmlResult += escapeHtml(rawCode.substring(lastIndex));
    }

    return htmlResult;
};

export const StudioCodeEditor: React.FC<StudioCodeEditorProps> = ({
    code,
    language = 'Python',
    onChangeCode,
    onChangeLanguage
}) => {
    const [copied, setCopied] = useState(false);
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const preRef = useRef<HTMLPreElement>(null);

    const lines = (code || '').split('\n');
    const lineCount = Math.max(1, lines.length);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Tab key indent handling
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = e.currentTarget.selectionStart;
            const end = e.currentTarget.selectionEnd;
            const newCode = code.substring(0, start) + '    ' + code.substring(end);
            onChangeCode(newCode);

            setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
                }
            }, 0);
        }
    };

    const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
        if (preRef.current) {
            preRef.current.scrollTop = e.currentTarget.scrollTop;
            preRef.current.scrollLeft = e.currentTarget.scrollLeft;
        }
    };

    return (
        <div className="w-full rounded-[6px] bg-[#12131a] border border-[#222430] shadow-md overflow-hidden text-slate-200 text-xs font-mono select-text transition-all">
            {/* Minimalist Dark Top Bar */}
            <div className="flex items-center justify-between px-3.5 py-2 bg-[#171822] border-b border-[#222430] select-none">
                {/* Left: Clean Language Identifier */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsLangMenuOpen(!isLangMenuOpen);
                        }}
                        className="flex items-center gap-1.5 text-slate-300 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors"
                        title="Bấm để đổi ngôn ngữ"
                    >
                        <span>{language || 'Python'}</span>
                        <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Language Dropdown Menu */}
                    {isLangMenuOpen && (
                        <div className="absolute top-7 left-0 mt-1 w-36 bg-[#1a1c26] border border-slate-700 rounded-md shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100 max-h-56 overflow-y-auto">
                            {SUPPORTED_LANGUAGES.map((lang) => (
                                <button
                                    key={lang}
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onChangeLanguage(lang);
                                        setIsLangMenuOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-700/50 transition-colors ${
                                        lang.toUpperCase() === (language || 'Python').toUpperCase()
                                            ? 'text-amber-400 font-bold bg-white/5'
                                            : 'text-slate-300'
                                    }`}
                                >
                                    <span>{lang}</span>
                                    {lang.toUpperCase() === (language || 'Python').toUpperCase() && (
                                        <span className="text-amber-400 font-bold">✓</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Minimalist Action Icons */}
                <div className="flex items-center gap-2.5 text-slate-400">
                    {/* Copy Button */}
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="hover:text-white transition-colors"
                        title={copied ? 'Đã sao chép!' : 'Sao chép mã'}
                    >
                        {copied ? (
                            <span className="text-emerald-400 font-bold text-[11px]">✓</span>
                        ) : (
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                        )}
                    </button>

                    {/* Expand icon */}
                    <button
                        type="button"
                        className="hover:text-white transition-colors"
                        title="Toàn màn hình"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                        </svg>
                    </button>

                    {/* More icon */}
                    <button
                        type="button"
                        className="hover:text-white transition-colors"
                        title="Tùy chọn"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="12" cy="5" r="1" fill="currentColor" />
                            <circle cx="12" cy="12" r="1" fill="currentColor" />
                            <circle cx="12" cy="19" r="1" fill="currentColor" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Code Body with Real Line Numbers & Real-Time Syntax Highlighting */}
            <div className="flex items-stretch bg-[#12131a] pb-3 pt-2">
                {/* Left Gutter: Line Numbers */}
                <div className="w-8 pl-3.5 select-none text-slate-600 text-[13px] font-mono leading-[22px] flex-shrink-0 text-left">
                    {Array.from({ length: lineCount }).map((_, idx) => (
                        <div key={idx}>{idx + 1}</div>
                    ))}
                </div>

                {/* Right: Code Area with Layered Syntax Highlighting */}
                <div className="flex-1 pl-3 pr-4 relative min-h-[1.5rem]">
                    {/* Layer 1: Highlighted Code Pre */}
                    <pre
                        ref={preRef}
                        dangerouslySetInnerHTML={{ __html: tokenizeAndHighlight(code, language) }}
                        className="w-full m-0 p-0 font-mono text-[13px] leading-[22px] whitespace-pre pointer-events-none overflow-hidden select-none"
                    />

                    {/* Layer 2: Transparent Textarea for Typing */}
                    <textarea
                        ref={textareaRef}
                        rows={lineCount}
                        value={code || ''}
                        onChange={(e) => onChangeCode(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onScroll={handleScroll}
                        spellCheck={false}
                        autoCapitalize="off"
                        autoComplete="off"
                        autoCorrect="off"
                        className="absolute inset-0 pl-3 pr-4 m-0 bg-transparent text-transparent caret-white font-mono text-[13px] leading-[22px] border-none outline-none focus:outline-none focus:ring-0 resize-none whitespace-pre overflow-hidden selection:bg-purple-600/40"
                        placeholder=""
                    />
                </div>
            </div>
        </div>
    );
};
