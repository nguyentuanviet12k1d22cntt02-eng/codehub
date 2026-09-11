import React, { useState } from 'react';
import type { BlockType } from '../types';

interface StudioFormattingToolbarProps {
    isDarkTheme: boolean;
    activeHeadingLevel?: 'H1' | 'H2' | 'H3' | 'P';
    onChangeHeadingLevel?: (level: 'H1' | 'H2' | 'H3') => void;
    onApplyFormat: (command: string, value?: string) => void;
    onInsertBlock?: (type: BlockType) => void;
}

export const StudioFormattingToolbar: React.FC<StudioFormattingToolbarProps> = ({
    isDarkTheme,
    activeHeadingLevel = 'H2',
    onChangeHeadingLevel,
    onApplyFormat,
    onInsertBlock
}) => {
    const [headingMenuOpen, setHeadingMenuOpen] = useState(false);
    const [fontSizeMenuOpen, setFontSizeMenuOpen] = useState(false);
    const [currentFontSize, setCurrentFontSize] = useState('14px');

    const handleCommand = (cmd: string, val?: string) => {
        onApplyFormat(cmd, val);
    };

    return (
        <div className={`border rounded-xl px-4 py-2 flex items-center justify-between select-none shadow-sm relative z-30 transition-colors ${
            isDarkTheme ? 'bg-[#121217] border-white/10 text-white/80' : 'bg-white border-slate-200 text-slate-700'
        }`}>
            <div className="flex items-center gap-1 md:gap-1.5 flex-wrap">
                {/* 1. Heading Level Dropdown */}
                <div className="relative">
                    <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => { setHeadingMenuOpen(!headingMenuOpen); setFontSizeMenuOpen(false); }}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                            isDarkTheme
                                ? 'bg-white/5 hover:bg-white/10 text-white'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                        }`}
                    >
                        <span>{activeHeadingLevel}</span>
                        <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {headingMenuOpen && (
                        <div className={`absolute top-8 left-0 mt-1 w-28 rounded-xl border shadow-xl py-1 z-50 text-xs font-semibold ${
                            isDarkTheme ? 'bg-[#181820] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'
                        }`}>
                            <button
                                type="button"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => { onChangeHeadingLevel?.('H1'); setHeadingMenuOpen(false); }}
                                className="w-full text-left px-3 py-1.5 hover:bg-purple-50 hover:text-purple-600 font-extrabold"
                            >
                                H1 (Lớn)
                            </button>
                            <button
                                type="button"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => { onChangeHeadingLevel?.('H2'); setHeadingMenuOpen(false); }}
                                className="w-full text-left px-3 py-1.5 hover:bg-purple-50 hover:text-purple-600 font-bold"
                            >
                                H2 (Vừa)
                            </button>
                            <button
                                type="button"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => { onChangeHeadingLevel?.('H3'); setHeadingMenuOpen(false); }}
                                className="w-full text-left px-3 py-1.5 hover:bg-purple-50 hover:text-purple-600 font-semibold"
                            >
                                H3 (Nhỏ)
                            </button>
                        </div>
                    )}
                </div>

                {/* 1.5 Font Size Dropdown for Selected Text */}
                <div className="relative">
                    <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => { setFontSizeMenuOpen(!fontSizeMenuOpen); setHeadingMenuOpen(false); }}
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
                            isDarkTheme
                                ? 'bg-white/5 hover:bg-white/10 text-white'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                        }`}
                        title="Đổi cỡ chữ cho phần văn bản đang bôi đen"
                    >
                        <span>{currentFontSize}</span>
                        <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {fontSizeMenuOpen && (
                        <div className={`absolute top-8 left-0 mt-1 w-32 rounded-xl border shadow-xl py-1 z-50 text-xs font-semibold ${
                            isDarkTheme ? 'bg-[#181820] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'
                        }`}>
                            {[
                                { label: '12px (Nhỏ)', val: '12px' },
                                { label: '14px (Chuẩn)', val: '14px' },
                                { label: '16px (Vừa)', val: '16px' },
                                { label: '18px (Lớn)', val: '18px' },
                                { label: '20px (Rất lớn)', val: '20px' },
                                { label: '24px (Tiêu đề)', val: '24px' }
                            ].map((item) => (
                                <button
                                    key={item.val}
                                    type="button"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => {
                                        setCurrentFontSize(item.val);
                                        handleCommand('fontSize', item.val);
                                        setFontSizeMenuOpen(false);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div className={`h-4 w-[1px] mx-1 ${isDarkTheme ? 'bg-white/10' : 'bg-slate-200'}`} />

                {/* 2. Bold */}
                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleCommand('bold')}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-extrabold transition-colors ${
                        isDarkTheme ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-100 text-slate-800'
                    }`}
                    title="In đậm (Ctrl+B)"
                >
                    B
                </button>

                {/* 3. Italic */}
                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleCommand('italic')}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs italic font-serif transition-colors ${
                        isDarkTheme ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-100 text-slate-800'
                    }`}
                    title="In nghiêng (Ctrl+I)"
                >
                    I
                </button>

                {/* 4. Underline */}
                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleCommand('underline')}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs underline font-semibold transition-colors ${
                        isDarkTheme ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-100 text-slate-800'
                    }`}
                    title="Gạch chân (Ctrl+U)"
                >
                    U
                </button>

                {/* 5. Strikethrough */}
                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleCommand('strikeThrough')}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs line-through font-semibold transition-colors ${
                        isDarkTheme ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-100 text-slate-800'
                    }`}
                    title="Gạch ngang"
                >
                    S
                </button>

                {/* 6. Inline Code */}
                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleCommand('code')}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg font-mono text-xs transition-colors ${
                        isDarkTheme ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-100 text-slate-800'
                    }`}
                    title="Đoạn mã (Code)"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <polyline points="16 18 22 12 16 6" />
                        <polyline points="8 6 2 12 8 18" />
                    </svg>
                </button>

                {/* 7. Link */}
                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                        const url = prompt('Nhập liên kết URL:');
                        if (url) handleCommand('createLink', url);
                    }}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs transition-colors ${
                        isDarkTheme ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-100 text-slate-800'
                    }`}
                    title="Chèn liên kết"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                </button>

                {/* 8. Image */}
                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => onInsertBlock?.('image')}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs transition-colors ${
                        isDarkTheme ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-100 text-slate-800'
                    }`}
                    title="Chèn hình ảnh"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                    </svg>
                </button>

                {/* 9. Table */}
                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => onInsertBlock?.('table')}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs transition-colors ${
                        isDarkTheme ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-100 text-slate-800'
                    }`}
                    title="Chèn bảng"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
                    </svg>
                </button>

                {/* Divider */}
                <div className={`h-4 w-[1px] mx-1 ${isDarkTheme ? 'bg-white/10' : 'bg-slate-200'}`} />

                {/* 10. Bullet List */}
                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleCommand('insertUnorderedList')}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs transition-colors ${
                        isDarkTheme ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-100 text-slate-800'
                    }`}
                    title="Danh sách dấu chấm (Bullet List)"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <line x1="9" y1="6" x2="20" y2="6" />
                        <line x1="9" y1="12" x2="20" y2="12" />
                        <line x1="9" y1="18" x2="20" y2="18" />
                        <circle cx="4" cy="6" r="1.5" fill="currentColor" />
                        <circle cx="4" cy="12" r="1.5" fill="currentColor" />
                        <circle cx="4" cy="18" r="1.5" fill="currentColor" />
                    </svg>
                </button>

                {/* 11. Numbered List */}
                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleCommand('insertOrderedList')}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs transition-colors ${
                        isDarkTheme ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-100 text-slate-800'
                    }`}
                    title="Danh sách số thứ tự (Numbered List)"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <line x1="10" y1="6" x2="21" y2="6" />
                        <line x1="10" y1="12" x2="21" y2="12" />
                        <line x1="10" y1="18" x2="21" y2="18" />
                        <path d="M4 6h1v4M4 10h2M4 14h2l-2 2h2v2M4 22h2" strokeWidth="1.5" />
                    </svg>
                </button>

                {/* Divider */}
                <div className={`h-4 w-[1px] mx-1 ${isDarkTheme ? 'bg-white/10' : 'bg-slate-200'}`} />

                {/* 12. Align Left */}
                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleCommand('justifyLeft')}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs transition-colors ${
                        isDarkTheme ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-100 text-slate-800'
                    }`}
                    title="Căn trái"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <line x1="4" y1="6" x2="20" y2="6" />
                        <line x1="4" y1="12" x2="14" y2="12" />
                        <line x1="4" y1="18" x2="18" y2="18" />
                    </svg>
                </button>

                {/* 13. Align Center */}
                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleCommand('justifyCenter')}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs transition-colors ${
                        isDarkTheme ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-100 text-slate-800'
                    }`}
                    title="Căn giữa"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <line x1="4" y1="6" x2="20" y2="6" />
                        <line x1="7" y1="12" x2="17" y2="12" />
                        <line x1="5" y1="18" x2="19" y2="18" />
                    </svg>
                </button>

                {/* 14. Align Right */}
                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleCommand('justifyRight')}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs transition-colors ${
                        isDarkTheme ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-100 text-slate-800'
                    }`}
                    title="Căn phải"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <line x1="4" y1="6" x2="20" y2="6" />
                        <line x1="10" y1="12" x2="20" y2="12" />
                        <line x1="6" y1="18" x2="20" y2="18" />
                    </svg>
                </button>
            </div>

            <span className={`text-[11px] font-medium hidden sm:inline ${isDarkTheme ? 'text-white/40' : 'text-slate-400'}`}>
                WYSIWYG Editor
            </span>
        </div>
    );
};
