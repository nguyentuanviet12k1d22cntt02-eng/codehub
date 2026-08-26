import React, { useState, useRef } from 'react';

interface StudioCodeEditorProps {
    code: string;
    language: string;
    onChangeCode: (newCode: string) => void;
    onChangeLanguage: (newLang: string) => void;
    isDarkTheme?: boolean;
}

const SUPPORTED_LANGUAGES = [
    { id: 'SQL', label: 'SQL', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
    { id: 'Python', label: 'Python', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    { id: 'JavaScript', label: 'JavaScript', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' },
    { id: 'TypeScript', label: 'TypeScript', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
    { id: 'HTML', label: 'HTML', color: 'text-orange-400 bg-orange-500/10 border-orange-500/30' },
    { id: 'CSS', label: 'CSS', color: 'text-sky-400 bg-sky-500/10 border-sky-500/30' },
    { id: 'JSON', label: 'JSON', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    { id: 'Bash', label: 'Bash', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
    { id: 'C++', label: 'C++', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' },
    { id: 'Java', label: 'Java', color: 'text-red-400 bg-red-500/10 border-red-500/30' },
];

export const StudioCodeEditor: React.FC<StudioCodeEditorProps> = ({
    code,
    language = 'SQL',
    onChangeCode,
    onChangeLanguage
}) => {
    const [copied, setCopied] = useState(false);
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const lines = (code || '').split('\n');
    const lineCount = Math.max(1, lines.length);

    const currentLangConfig = SUPPORTED_LANGUAGES.find(
        l => l.id.toLowerCase() === (language || 'SQL').toLowerCase()
    ) || { id: language || 'SQL', label: language || 'SQL', color: 'text-slate-300 bg-slate-500/10 border-slate-500/30' };

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

    return (
        <div className="w-full rounded-[4px] bg-[#12131a] border border-slate-800 shadow-md overflow-hidden text-slate-200 text-xs font-mono select-text transition-all">
            {/* Top Editor Header */}
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#1a1b24] border-b border-slate-800/80 select-none">
                {/* Left: Language Badge & Selector */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsLangMenuOpen(!isLangMenuOpen);
                        }}
                        className={`flex items-center gap-1.5 px-2 py-0.5 rounded-[3px] border text-[11px] font-bold uppercase tracking-wider transition-colors hover:brightness-125 ${currentLangConfig.color}`}
                        title="Đổi ngôn ngữ lập trình"
                    >
                        <span>{currentLangConfig.label}</span>
                        <svg className="w-2.5 h-2.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Language Dropdown Menu */}
                    {isLangMenuOpen && (
                        <div className="absolute top-7 left-0 mt-1 w-36 bg-[#1e202c] border border-slate-700 rounded-lg shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100 max-h-56 overflow-y-auto">
                            {SUPPORTED_LANGUAGES.map((lang) => (
                                <button
                                    key={lang.id}
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onChangeLanguage(lang.id);
                                        setIsLangMenuOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-700/50 transition-colors ${
                                        lang.id.toLowerCase() === currentLangConfig.id.toLowerCase()
                                            ? 'text-white font-bold bg-purple-600/20'
                                            : 'text-slate-300'
                                    }`}
                                >
                                    <span>{lang.label}</span>
                                    {lang.id.toLowerCase() === currentLangConfig.id.toLowerCase() && (
                                        <span className="text-purple-400 font-bold">✓</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Quick actions */}
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>{lineCount} {lineCount > 1 ? 'dòng' : 'dòng'}</span>

                    {/* Copy Button */}
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="p-1 hover:text-white hover:bg-white/10 rounded transition-colors"
                        title={copied ? 'Đã sao chép!' : 'Sao chép mã'}
                    >
                        {copied ? (
                            <span className="text-emerald-400 font-bold">✓</span>
                        ) : (
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Code Body with Real Line Numbers */}
            <div className="flex items-stretch bg-[#12131a] relative">
                {/* Left Gutter: Line Numbers */}
                <div className="w-9 py-2.5 bg-[#0e0f14] border-r border-slate-800/60 text-right pr-2 select-none text-slate-600 text-[12px] font-mono leading-[22px] flex-shrink-0">
                    {Array.from({ length: lineCount }).map((_, idx) => (
                        <div key={idx}>{idx + 1}</div>
                    ))}
                </div>

                {/* Right: Interactive Code Textarea */}
                <div className="flex-1 p-2.5 relative overflow-hidden">
                    <textarea
                        ref={textareaRef}
                        rows={lineCount}
                        value={code || ''}
                        onChange={(e) => onChangeCode(e.target.value)}
                        onKeyDown={handleKeyDown}
                        spellCheck={false}
                        autoCapitalize="off"
                        autoComplete="off"
                        autoCorrect="off"
                        className="w-full bg-transparent text-[12.5px] font-mono leading-[22px] text-emerald-300 placeholder-slate-600 border-none outline-none focus:outline-none focus:ring-0 resize-none whitespace-pre overflow-x-auto selection:bg-purple-600/40"
                        placeholder={`// Nhập mã nguồn ${currentLangConfig.label} tại đây...`}
                    />
                </div>
            </div>
        </div>
    );
};
