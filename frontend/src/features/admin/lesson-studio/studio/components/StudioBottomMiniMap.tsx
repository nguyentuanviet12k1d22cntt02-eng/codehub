import React from 'react';
import type { BlockType, LessonBlock } from '../types';

interface StudioBottomMiniMapProps {
    blocks: LessonBlock[];
    selectedBlockId: string;
    isDarkTheme: boolean;
    onSelectBlock: (id: string) => void;
    onAddBlock: (type: BlockType) => void;
}

export const StudioBottomMiniMap: React.FC<StudioBottomMiniMapProps> = ({
    blocks,
    selectedBlockId,
    isDarkTheme,
    onSelectBlock,
    onAddBlock
}) => {
    return (
        <div className={`h-14 px-6 flex items-center justify-between text-xs flex-shrink-0 z-20 border-t shadow-sm ${
            isDarkTheme ? 'bg-[#121217] border-white/10' : 'bg-white border-slate-200'
        }`}>
            <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-5xl">
                <span className={`text-[11px] font-bold uppercase tracking-wider whitespace-nowrap mr-2 ${
                    isDarkTheme ? 'text-white/50' : 'text-slate-500'
                }`}>
                    Cấu trúc bài học:
                </span>

                {blocks.map((b, idx) => {
                    const isSelected = selectedBlockId === b.id;
                    return (
                        <React.Fragment key={b.id}>
                            <button
                                onClick={() => onSelectBlock(b.id)}
                                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                                    isSelected
                                        ? 'bg-purple-600 text-white shadow-sm ring-2 ring-purple-300'
                                        : isDarkTheme
                                            ? 'bg-white/5 hover:bg-white/10 text-white/70'
                                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                                }`}
                            >
                                <span>
                                    {b.type === 'heading' ? `H Tiêu đề (${b.headingLevel || 'H2'})` :
                                     b.type === 'paragraph' ? '¶ Đoạn văn' :
                                     b.type === 'code' ? `</> Khối mã (${b.language || 'SQL'})` :
                                     b.type === 'output' ? '▶ Kết quả (Output)' :
                                     b.type === 'explanation' ? '💡 Giải thích' :
                                     b.type === 'exercise' ? '✎ Bài tập' :
                                     b.type}
                                </span>
                            </button>
                            {idx < blocks.length - 1 && (
                                <span className={`text-[11px] ${isDarkTheme ? 'text-white/30' : 'text-slate-400'}`}>&gt;</span>
                            )}
                        </React.Fragment>
                    );
                })}

                <button
                    onClick={() => onAddBlock('paragraph')}
                    className="px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-all ml-2 shadow-sm"
                >
                    + Thêm khối
                </button>
            </div>

            <div className={`text-xs whitespace-nowrap hidden lg:block ${
                isDarkTheme ? 'text-white/40' : 'text-slate-500'
            }`}>
                Tổng cộng: <strong className={isDarkTheme ? 'text-white' : 'text-slate-900'}>{blocks.length}</strong> khối nội dung
            </div>
        </div>
    );
};
