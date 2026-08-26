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
        <div className={`relative my-1 h-3 flex items-center justify-center transition-all ${
            isOpen ? 'z-40 opacity-100' : 'group/insert hover:h-6 opacity-0 hover:opacity-100 z-10'
        }`}>
            {/* Thin divider line appearing on hover */}
            <div className={`absolute inset-x-4 top-1/2 -translate-y-1/2 h-[1px] ${
                isDarkTheme ? 'bg-purple-500/40' : 'bg-purple-300'
            }`} />

            {/* Floating small round (+) button */}
            <button
                type="button"
                onClick={onToggle}
                className={`relative z-10 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm transition-all transform hover:scale-125 ${
                    isOpen ? 'bg-purple-700 ring-2 ring-purple-300 scale-110' : 'bg-purple-600 hover:bg-purple-500'
                }`}
                title="Chèn khối ở đây"
            >
                +
            </button>

            {/* Popover Menu with Block Choices */}
            {isOpen && (
                <div className={`absolute top-6 z-50 border rounded-xl p-2.5 shadow-xl flex flex-wrap gap-1.5 max-w-md justify-center animate-in fade-in zoom-in-95 duration-150 ${
                    isDarkTheme ? 'bg-[#181820] border-white/15 text-white' : 'bg-white border-slate-200 text-slate-800 shadow-purple-500/10'
                }`}>
                    <button
                        type="button"
                        onClick={() => onInsertBlockAt('heading', index)}
                        className={`px-2 py-1 border rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                            isDarkTheme ? 'bg-white/5 border-white/10 text-white hover:bg-purple-600/20' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300'
                        }`}
                    >
                        <span className="text-purple-600 font-bold">H</span> Tiêu đề
                    </button>
                    <button
                        type="button"
                        onClick={() => onInsertBlockAt('paragraph', index)}
                        className={`px-2 py-1 border rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                            isDarkTheme ? 'bg-white/5 border-white/10 text-white hover:bg-purple-600/20' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300'
                        }`}
                    >
                        <span className="text-purple-600 font-bold">¶</span> Đoạn văn
                    </button>
                    <button
                        type="button"
                        onClick={() => onInsertBlockAt('code', index)}
                        className={`px-2 py-1 border rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                            isDarkTheme ? 'bg-white/5 border-white/10 text-white hover:bg-purple-600/20' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300'
                        }`}
                    >
                        <span className="text-purple-600 font-bold">&lt;/&gt;</span> Mã code
                    </button>
                    <button
                        type="button"
                        onClick={() => onInsertBlockAt('explanation', index)}
                        className={`px-2 py-1 border rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                            isDarkTheme ? 'bg-white/5 border-white/10 text-white hover:bg-amber-600/20' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300'
                        }`}
                    >
                        <span>💡</span> Giải thích
                    </button>
                    <button
                        type="button"
                        onClick={() => onInsertBlockAt('table', index)}
                        className={`px-2 py-1 border rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                            isDarkTheme ? 'bg-white/5 border-white/10 text-white hover:bg-sky-600/20' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-300'
                        }`}
                    >
                        <span>▦</span> Bảng SQL
                    </button>
                    <button
                        type="button"
                        onClick={() => onInsertBlockAt('exercise', index)}
                        className={`px-2 py-1 border rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                            isDarkTheme ? 'bg-white/5 border-white/10 text-white hover:bg-indigo-600/20' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300'
                        }`}
                    >
                        <span>✎</span> Bài tập
                    </button>
                    <button
                        type="button"
                        onClick={() => onInsertBlockAt('divider', index)}
                        className={`px-2 py-1 border rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                            isDarkTheme ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                    >
                        <span>—</span> Đường kẻ
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 text-xs px-1.5"
                    >
                        ✕
                    </button>
                </div>
            )}
        </div>
    );
};
