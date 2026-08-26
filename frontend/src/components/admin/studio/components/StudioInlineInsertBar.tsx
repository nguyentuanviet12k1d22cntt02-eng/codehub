import React from 'react';
import type { BlockType } from '../types';

interface StudioInlineInsertBarProps {
    index: number;
    isOpen: boolean;
    isDarkTheme: boolean;
    onToggle: (e: React.MouseEvent) => void;
    onClose: () => void;
    onInsertBlockAt: (type: BlockType, index: number) => void;
}

export const StudioInlineInsertBar: React.FC<StudioInlineInsertBarProps> = ({
    index,
    isOpen,
    isDarkTheme,
    onToggle,
    onClose,
    onInsertBlockAt
}) => {
    return (
        <div className="relative group/insert py-1 flex items-center justify-center">
            <div className={`absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] transition-colors ${
                isDarkTheme ? 'bg-white/5 group-hover/insert:bg-purple-500/40' : 'bg-slate-200 group-hover/insert:bg-purple-300'
            }`} />
            
            <div className="relative z-10 flex items-center gap-1">
                <button
                    type="button"
                    onClick={onToggle}
                    className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full border shadow-sm transition-all ${
                        isOpen
                            ? 'bg-purple-600 text-white border-purple-600 ring-2 ring-purple-200'
                            : isDarkTheme
                                ? 'bg-[#181820] text-purple-400 border-white/10 hover:bg-purple-600/20 hover:border-purple-500'
                                : 'bg-white text-purple-600 border-slate-200 hover:border-purple-400 hover:shadow-md'
                    }`}
                >
                    <span className="w-3.5 h-3.5 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs leading-none font-bold">+</span>
                    <span>Chèn khối ở đây</span>
                </button>
            </div>

            {/* Popover Menu with Block Choices */}
            {isOpen && (
                <div className={`absolute top-9 z-30 border rounded-2xl p-3 shadow-2xl flex flex-wrap gap-2 max-w-lg justify-center animate-in fade-in zoom-in-95 duration-150 ${
                    isDarkTheme ? 'bg-[#181820] border-white/15' : 'bg-white border-slate-200 shadow-purple-500/10'
                }`}>
                    <button
                        type="button"
                        onClick={() => onInsertBlockAt('heading', index)}
                        className={`px-2.5 py-1.5 border rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all ${
                            isDarkTheme ? 'bg-white/5 border-white/10 text-white hover:bg-purple-600/20' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300'
                        }`}
                    >
                        <span className="text-purple-600 font-bold">H</span> Tiêu đề
                    </button>
                    <button
                        type="button"
                        onClick={() => onInsertBlockAt('paragraph', index)}
                        className={`px-2.5 py-1.5 border rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all ${
                            isDarkTheme ? 'bg-white/5 border-white/10 text-white hover:bg-purple-600/20' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300'
                        }`}
                    >
                        <span className="text-purple-600 font-bold">¶</span> Đoạn văn
                    </button>
                    <button
                        type="button"
                        onClick={() => onInsertBlockAt('code', index)}
                        className={`px-2.5 py-1.5 border rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all ${
                            isDarkTheme ? 'bg-white/5 border-white/10 text-white hover:bg-purple-600/20' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300'
                        }`}
                    >
                        <span className="text-purple-600 font-bold">&lt;/&gt;</span> Khối mã
                    </button>
                    <button
                        type="button"
                        onClick={() => onInsertBlockAt('explanation', index)}
                        className={`px-2.5 py-1.5 border rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all ${
                            isDarkTheme ? 'bg-white/5 border-white/10 text-white hover:bg-amber-600/20' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300'
                        }`}
                    >
                        <span>💡</span> Giải thích
                    </button>
                    <button
                        type="button"
                        onClick={() => onInsertBlockAt('table', index)}
                        className={`px-2.5 py-1.5 border rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all ${
                            isDarkTheme ? 'bg-white/5 border-white/10 text-white hover:bg-sky-600/20' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-300'
                        }`}
                    >
                        <span>▦</span> Bảng SQL
                    </button>
                    <button
                        type="button"
                        onClick={() => onInsertBlockAt('exercise', index)}
                        className={`px-2.5 py-1.5 border rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all ${
                            isDarkTheme ? 'bg-white/5 border-white/10 text-white hover:bg-indigo-600/20' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300'
                        }`}
                    >
                        <span>✎</span> Bài tập
                    </button>
                    <button
                        type="button"
                        onClick={() => onInsertBlockAt('divider', index)}
                        className={`px-2.5 py-1.5 border rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all ${
                            isDarkTheme ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                    >
                        <span>—</span> Đường kẻ
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 text-xs px-2"
                    >
                        ✕
                    </button>
                </div>
            )}
        </div>
    );
};
