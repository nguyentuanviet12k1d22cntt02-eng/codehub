import React from 'react';
import type { DraggableProvided } from '@hello-pangea/dnd';
import type { LessonBlock } from '../types';

interface StudioBlockCardProps {
    block: LessonBlock;
    index: number;
    isSelected: boolean;
    isDarkTheme: boolean;
    providedDraggable: DraggableProvided;
    onSelect: () => void;
    onDelete: () => void;
    onUpdateActiveBlock: (fields: Partial<LessonBlock>) => void;
}

export const StudioBlockCard: React.FC<StudioBlockCardProps> = ({
    block,
    index,
    isSelected,
    isDarkTheme,
    providedDraggable,
    onSelect,
    onDelete,
    onUpdateActiveBlock
}) => {
    return (
        <div
            onClick={onSelect}
            className={`rounded-2xl border transition-all relative overflow-hidden group ${
                isDarkTheme
                    ? isSelected
                        ? 'bg-[#121217] border-purple-500 shadow-xl shadow-purple-500/5 ring-1 ring-purple-500/50'
                        : 'bg-[#121217] border-white/10 hover:border-white/20'
                    : isSelected
                        ? 'bg-white border-purple-500 shadow-lg ring-2 ring-purple-200'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
            }`}
        >
            {/* Top Block Header bar */}
            <div className={`px-4 py-2.5 border-b flex items-center justify-between ${
                isDarkTheme
                    ? 'bg-white/[0.02] border-white/5'
                    : 'bg-slate-50/80 border-slate-100'
            }`}>
                {/* Drag Handle */}
                <div
                    {...providedDraggable.dragHandleProps}
                    className={`cursor-grab active:cursor-grabbing flex items-center gap-2 ${
                        isDarkTheme ? 'text-white/40 hover:text-white' : 'text-slate-400 hover:text-slate-700'
                    }`}
                >
                    <span className="font-mono text-xs tracking-tighter">:::</span>
                    <span className={`text-[11px] font-semibold ${isDarkTheme ? 'text-white/60' : 'text-slate-600'}`}>
                        Khối #{index + 1}
                    </span>
                </div>

                {/* Block Type Badge */}
                <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        block.type === 'heading' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                        block.type === 'code' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                        block.type === 'output' || block.type === 'table' ? 'bg-sky-100 text-sky-700 border border-sky-200' :
                        block.type === 'exercise' ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' :
                        'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                        {block.type === 'heading' ? 'Tiêu đề + Đoạn văn' :
                         block.type === 'code' ? `Khối mã (${block.language || 'SQL'})` :
                         block.type === 'output' ? 'Kết quả (Output)' :
                         block.type === 'exercise' ? 'Bài tập (Exercise)' :
                         block.type === 'explanation' ? 'Giải thích' :
                         block.type}
                    </span>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                        className="text-slate-400 hover:text-rose-600 text-xs px-1.5 py-0.5 rounded transition-colors"
                        title="Xóa khối này"
                    >
                        ✕
                    </button>
                </div>
            </div>

            {/* Block Body Interactive Content */}
            <div className="p-5 text-left space-y-3">
                {/* 1. HEADING BLOCK */}
                {block.type === 'heading' && (
                    <div className="space-y-2">
                        <input
                            type="text"
                            value={block.title || ''}
                            onChange={(e) => onUpdateActiveBlock({ title: e.target.value })}
                            className={`w-full bg-transparent text-lg md:text-xl font-extrabold border-none focus:outline-none ${
                                isDarkTheme ? 'text-white placeholder-white/30' : 'text-slate-900 placeholder-slate-400'
                            }`}
                            placeholder="1. Tiêu đề mục"
                        />
                        <textarea
                            rows={2}
                            value={block.content || ''}
                            onChange={(e) => onUpdateActiveBlock({ content: e.target.value })}
                            className={`w-full bg-transparent text-xs leading-relaxed border-none focus:outline-none resize-none ${
                                isDarkTheme ? 'text-white/70 placeholder-white/30' : 'text-slate-600 placeholder-slate-400'
                            }`}
                            placeholder="Nhập mô tả chi tiết cho tiêu đề này..."
                        />
                    </div>
                )}

                {/* 2. PARAGRAPH / LIST BLOCK */}
                {(block.type === 'paragraph' || block.type === 'list') && (
                    <textarea
                        rows={3}
                        value={block.content || ''}
                        onChange={(e) => onUpdateActiveBlock({ content: e.target.value })}
                        className={`w-full bg-transparent text-xs leading-relaxed border-none focus:outline-none resize-y ${
                            isDarkTheme ? 'text-white/80 placeholder-white/30' : 'text-slate-700 placeholder-slate-400'
                        }`}
                        placeholder="Nhập đoạn văn lý thuyết..."
                    />
                )}

                {/* 3. CODE BLOCK */}
                {block.type === 'code' && (
                    <div className="bg-[#1e1e2e] rounded-xl border border-slate-700/60 p-4 font-mono text-xs text-emerald-400 overflow-x-auto relative shadow-inner">
                        <div className="flex justify-between items-center text-[10px] text-slate-400 mb-2 border-b border-slate-700 pb-1">
                            <span className="font-bold text-purple-400">{block.language || 'SQL'}</span>
                            <span>{block.showLineNumbers ? 'Line numbers: ON' : ''}</span>
                        </div>
                        <textarea
                            rows={Math.max(4, (block.content || '').split('\n').length)}
                            value={block.content || ''}
                            onChange={(e) => onUpdateActiveBlock({ content: e.target.value })}
                            className="w-full bg-transparent text-xs font-mono text-emerald-300 border-none focus:outline-none resize-none leading-relaxed"
                            placeholder="SELECT id, name FROM table;"
                        />
                    </div>
                )}

                {/* 4. TABLE / OUTPUT BLOCK */}
                {(block.type === 'output' || block.type === 'table') && (
                    <div className="space-y-2">
                        {block.title && (
                            <div className={`text-xs font-bold ${isDarkTheme ? 'text-white/80' : 'text-slate-800'}`}>
                                {block.title}
                            </div>
                        )}

                        <div className={`overflow-x-auto rounded-xl border ${
                            isDarkTheme ? 'border-white/10' : 'border-slate-200'
                        }`}>
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className={`border-b font-bold ${
                                        isDarkTheme ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                                    }`}>
                                        {block.tableHeaders?.map((th, thIdx) => (
                                            <th key={thIdx} className={`p-3 border-r last:border-r-0 ${
                                                isDarkTheme ? 'border-white/10' : 'border-slate-200'
                                            }`}>
                                                <input
                                                    type="text"
                                                    value={th}
                                                    onChange={(e) => {
                                                        const newHeaders = [...(block.tableHeaders || [])];
                                                        newHeaders[thIdx] = e.target.value;
                                                        onUpdateActiveBlock({ tableHeaders: newHeaders });
                                                    }}
                                                    className={`bg-transparent font-bold text-center w-full focus:outline-none ${
                                                        isDarkTheme ? 'text-white' : 'text-slate-900'
                                                    }`}
                                                />
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className={`divide-y ${
                                    isDarkTheme ? 'divide-white/5 text-white/80' : 'divide-slate-200 text-slate-700'
                                }`}>
                                    {block.tableRows?.map((row, rIdx) => (
                                        <tr key={rIdx} className={isDarkTheme ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50'}>
                                            {row.map((cell, cIdx) => (
                                                <td key={cIdx} className={`p-3 border-r last:border-r-0 ${
                                                    isDarkTheme ? 'border-white/10' : 'border-slate-200'
                                                }`}>
                                                    <input
                                                        type="text"
                                                        value={cell}
                                                        onChange={(e) => {
                                                            const newRows = [...(block.tableRows || [])];
                                                            newRows[rIdx][cIdx] = e.target.value;
                                                            onUpdateActiveBlock({ tableRows: newRows });
                                                        }}
                                                        className={`bg-transparent text-center w-full focus:outline-none ${
                                                            isDarkTheme ? 'text-white/80' : 'text-slate-800'
                                                        }`}
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-between items-center text-[11px] pt-1">
                            <input
                                type="text"
                                value={block.tableNote || ''}
                                onChange={(e) => onUpdateActiveBlock({ tableNote: e.target.value })}
                                className={`bg-transparent text-xs italic focus:outline-none w-2/3 ${
                                    isDarkTheme ? 'text-white/40' : 'text-slate-500'
                                }`}
                                placeholder="→ Kết quả trả về 2 dòng."
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    const newRows = [...(block.tableRows || [])];
                                    const colCount = block.tableHeaders?.length || 3;
                                    newRows.push(Array(colCount).fill(''));
                                    onUpdateActiveBlock({ tableRows: newRows });
                                }}
                                className="text-purple-600 hover:underline text-xs font-semibold"
                            >
                                + Thêm dòng
                            </button>
                        </div>
                    </div>
                )}

                {/* 5. EXPLANATION / CALLOUT BLOCK */}
                {(block.type === 'explanation' || block.type === 'callout' || block.type === 'note') && (
                    <div className={`rounded-xl p-4 space-y-2 border ${
                        isDarkTheme
                            ? 'bg-amber-500/[0.04] border-amber-500/20 text-white/80'
                            : 'bg-[#fffbeb] border-[#fde68a] text-[#92400e]'
                    }`}>
                        <div className="flex items-center gap-2">
                            <span className="font-bold">💡</span>
                            <input
                                type="text"
                                value={block.title || 'Giải thích'}
                                onChange={(e) => onUpdateActiveBlock({ title: e.target.value })}
                                className={`bg-transparent font-bold text-xs focus:outline-none w-full ${
                                    isDarkTheme ? 'text-amber-300' : 'text-amber-900'
                                }`}
                            />
                        </div>
                        <textarea
                            rows={4}
                            value={block.content || ''}
                            onChange={(e) => onUpdateActiveBlock({ content: e.target.value })}
                            className={`w-full bg-transparent text-xs leading-relaxed border-none focus:outline-none resize-none ${
                                isDarkTheme ? 'text-white/80' : 'text-amber-900'
                            }`}
                            placeholder="• Ý 1\n• Ý 2..."
                        />
                    </div>
                )}

                {/* 6. EXERCISE BLOCK */}
                {block.type === 'exercise' && (
                    <div className={`rounded-xl p-4 space-y-3 border ${
                        isDarkTheme
                            ? 'bg-indigo-500/[0.04] border-indigo-500/20 text-white/80'
                            : 'bg-[#eef2ff] border-[#c7d2fe] text-[#3730a3]'
                    }`}>
                        <div className="flex items-center gap-2">
                            <span className="font-bold">✎</span>
                            <input
                                type="text"
                                value={block.title || 'Bài tập 1'}
                                onChange={(e) => onUpdateActiveBlock({ title: e.target.value })}
                                className={`bg-transparent font-bold text-xs focus:outline-none w-full ${
                                    isDarkTheme ? 'text-indigo-300' : 'text-indigo-900'
                                }`}
                            />
                        </div>
                        <textarea
                            rows={2}
                            value={block.content || ''}
                            onChange={(e) => onUpdateActiveBlock({ content: e.target.value })}
                            className={`w-full bg-transparent text-xs leading-relaxed border-none focus:outline-none resize-none ${
                                isDarkTheme ? 'text-white/80' : 'text-indigo-900'
                            }`}
                            placeholder="Mô tả yêu cầu bài tập..."
                        />

                        <div className={`pt-2 border-t space-y-2 ${
                            isDarkTheme ? 'border-indigo-500/10' : 'border-indigo-200'
                        }`}>
                            <button
                                type="button"
                                onClick={() => onUpdateActiveBlock({ isSolutionVisible: !block.isSolutionVisible })}
                                className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1.5"
                            >
                                <span>👁</span>
                                <span>{block.isSolutionVisible ? 'Ẩn đáp án' : 'Xem đáp án'}</span>
                            </button>

                            {block.isSolutionVisible && (
                                <textarea
                                    rows={3}
                                    value={block.solutionCode || ''}
                                    onChange={(e) => onUpdateActiveBlock({ solutionCode: e.target.value })}
                                    className="w-full bg-[#1e1e2e] p-3 rounded-lg font-mono text-xs text-emerald-300 border border-slate-700 focus:outline-none shadow-inner"
                                    placeholder="Mã giải mẫu..."
                                />
                            )}
                        </div>
                    </div>
                )}

                {/* 7. DIVIDER */}
                {block.type === 'divider' && (
                    <div className="py-2">
                        <hr className={isDarkTheme ? 'border-white/10' : 'border-slate-200'} />
                    </div>
                )}
            </div>
        </div>
    );
};
