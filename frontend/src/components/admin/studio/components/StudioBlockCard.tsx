import React from 'react';
import type { DraggableProvided } from '@hello-pangea/dnd';
import { RichTextEditable } from './RichTextEditable';
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
    // 1px pure dashed border with crisp 3px corner radius and NO solid lines
    const getCardStyle = () => {
        if (isDarkTheme) {
            if (isSelected) return 'bg-[#14141c] border border-dashed border-purple-400';
            return 'bg-[#121217] border border-dashed border-white/15 hover:border-white/25';
        }

        if (isSelected) {
            return 'bg-white border border-dashed border-purple-500';
        }

        switch (block.type) {
            case 'code':
            case 'iframe':
                return 'bg-[#181822] border border-dashed border-slate-700 text-white';
            case 'output':
            case 'sql_output':
            case 'table':
                return 'bg-white border border-dashed border-sky-300/90 text-slate-800';
            case 'explanation':
            case 'callout':
            case 'note':
                return 'bg-[#fffdf5] border border-dashed border-amber-300/90 text-slate-800';
            case 'exercise':
                return 'bg-[#f8faff] border border-dashed border-indigo-300/90 text-slate-900';
            case 'heading':
                return 'bg-white border border-dashed border-purple-300/80 text-slate-900';
            default:
                return 'bg-white border border-dashed border-slate-300 hover:border-slate-400 text-slate-800';
        }
    };

    // Helper functions for Table editing
    const handleAddRow = () => {
        const newRows = [...(block.tableRows || [])];
        const colCount = block.tableHeaders?.length || 3;
        newRows.push(Array(colCount).fill(''));
        onUpdateActiveBlock({ tableRows: newRows });
    };

    const handleAddColumn = () => {
        const headers = [...(block.tableHeaders || ['col1', 'col2'])];
        headers.push(`col${headers.length + 1}`);
        const rows = (block.tableRows || []).map(r => [...r, '']);
        onUpdateActiveBlock({ tableHeaders: headers, tableRows: rows });
    };

    const handleDeleteRow = (rIdx: number) => {
        const newRows = (block.tableRows || []).filter((_, idx) => idx !== rIdx);
        onUpdateActiveBlock({ tableRows: newRows });
    };

    const handleDeleteColumn = (cIdx: number) => {
        if ((block.tableHeaders?.length || 0) <= 1) return;
        const newHeaders = (block.tableHeaders || []).filter((_, idx) => idx !== cIdx);
        const newRows = (block.tableRows || []).map(r => r.filter((_, idx) => idx !== cIdx));
        onUpdateActiveBlock({ tableHeaders: newHeaders, tableRows: newRows });
    };

    return (
        <div
            onClick={onSelect}
            className={`rounded-[3px] transition-colors relative group ${getCardStyle()}`}
        >
            {/* Top Block Header: NO solid divider line beneath it */}
            <div className="px-3 pt-2.5 pb-1 flex items-center justify-between">
                {/* Left: Drag Handle & Title */}
                <div className="flex items-center gap-2">
                    <div
                        {...providedDraggable.dragHandleProps}
                        className={`cursor-grab active:cursor-grabbing flex items-center ${
                            block.type === 'code' && !isDarkTheme
                                ? 'text-slate-500 hover:text-white'
                                : isDarkTheme
                                    ? 'text-white/40 hover:text-white'
                                    : 'text-slate-400 hover:text-slate-700'
                        }`}
                        title="Kéo để thay đổi vị trí"
                    >
                        <span className="font-mono text-xs tracking-tighter select-none">:::</span>
                    </div>

                    {/* Block Title in Header */}
                    {block.type === 'code' && (
                        <span className="text-xs font-bold text-slate-300 font-mono">
                            {block.language || 'SQL'}
                        </span>
                    )}
                    {block.type === 'iframe' && (
                        <span className="text-xs font-bold text-slate-300 font-mono">
                            Iframe nhúng
                        </span>
                    )}
                    {(block.type === 'output' || block.type === 'sql_output' || block.type === 'table') && (
                        <span className="text-xs font-bold text-slate-800">
                            {block.title || 'Kết quả (ví dụ)'}
                        </span>
                    )}
                    {(block.type === 'explanation' || block.type === 'callout' || block.type === 'note') && (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                            <span>💡</span>
                            <span>{block.title || 'Giải thích'}</span>
                        </div>
                    )}
                    {block.type === 'exercise' && (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
                            <span>✎</span>
                            <span>{block.title || 'Bài tập vận dụng'}</span>
                        </div>
                    )}
                    {block.type === 'heading' && (
                        <span className="text-xs font-semibold text-purple-700">
                            {block.headingLevel || 'H2'} • Tiêu đề
                        </span>
                    )}
                    {block.type === 'paragraph' && (
                        <span className={`text-[11px] font-medium ${isDarkTheme ? 'text-white/40' : 'text-slate-400'}`}>
                            Đoạn văn #{index + 1}
                        </span>
                    )}
                </div>

                {/* Right: Pill Badge & Delete Action */}
                <div className="flex items-center gap-1.5">
                    {/* Badge Pill with 2px corner */}
                    <span className={`text-[10px] px-2 py-0.5 rounded-[2px] font-semibold ${
                        block.type === 'code' || block.type === 'iframe'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-dashed border-emerald-500/30'
                            : block.type === 'output' || block.type === 'sql_output' || block.type === 'table'
                                ? 'bg-sky-50 text-sky-700 border border-dashed border-sky-300/80'
                                : block.type === 'explanation' || block.type === 'callout'
                                    ? 'bg-amber-50 text-amber-800 border border-dashed border-amber-300/80'
                                    : block.type === 'exercise'
                                        ? 'bg-indigo-50 text-indigo-700 border border-dashed border-indigo-200/80'
                                        : 'bg-slate-100 text-slate-700 border border-dashed border-slate-300'
                    }`}>
                        {block.type === 'code' ? `Khối mã (${block.language || 'SQL'})` :
                         block.type === 'iframe' ? 'Iframe nhúng' :
                         block.type === 'sql_output' ? 'Kết quả SQL' :
                         block.type === 'output' ? 'Kết quả (Output)' :
                         block.type === 'table' ? 'Bảng (Table)' :
                         block.type === 'explanation' ? 'Giải thích' :
                         block.type === 'exercise' ? 'Bài tập (Exercise)' :
                         block.type === 'heading' ? 'Tiêu đề' :
                         'Đoạn văn'}
                    </span>

                    {/* Quick Delete */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                        className="text-slate-400 hover:text-rose-500 text-xs px-1 rounded-[2px] transition-colors"
                        title="Xóa khối"
                    >
                        ✕
                    </button>
                </div>
            </div>

            {/* Block Body Content */}
            <div className="px-3.5 pb-3 pt-1 text-left space-y-2">
                {/* 1. HEADING BLOCK */}
                {block.type === 'heading' && (
                    <div className="space-y-1.5">
                        <input
                            type="text"
                            value={block.title || ''}
                            onChange={(e) => onUpdateActiveBlock({ title: e.target.value })}
                            className={`w-full bg-transparent text-lg md:text-xl font-extrabold border-none focus:outline-none ${
                                isDarkTheme ? 'text-white placeholder-white/30' : 'text-slate-900 placeholder-slate-400'
                            }`}
                            placeholder="1. Tiêu đề mục..."
                        />
                        <RichTextEditable
                            value={block.content || ''}
                            onChange={(val) => onUpdateActiveBlock({ content: val })}
                            placeholder="Nhập mô tả chi tiết..."
                            className="text-xs"
                            isDarkTheme={isDarkTheme}
                        />
                    </div>
                )}

                {/* 2. PARAGRAPH / LIST BLOCK */}
                {(block.type === 'paragraph' || block.type === 'list' || block.type === 'theory') && (
                    <RichTextEditable
                        value={block.content || ''}
                        onChange={(val) => onUpdateActiveBlock({ content: val })}
                        placeholder="Nhập nội dung đoạn văn..."
                        className="text-xs"
                        isDarkTheme={isDarkTheme}
                    />
                )}

                {/* 3. CODE / IFRAME BLOCK */}
                {(block.type === 'code' || block.type === 'iframe') && (
                    <div className="font-mono text-xs text-emerald-300">
                        <textarea
                            rows={Math.max(3, (block.content || '').split('\n').length)}
                            value={block.content || ''}
                            onChange={(e) => onUpdateActiveBlock({ content: e.target.value })}
                            className="w-full bg-transparent text-xs font-mono text-emerald-300 border-none focus:outline-none resize-none leading-relaxed"
                            placeholder={block.type === 'iframe' ? '<iframe src="..."></iframe>' : 'SELECT id, name FROM students;'}
                        />
                    </div>
                )}

                {/* 4. TABLE / OUTPUT BLOCK WITH FULL RICHTEXT FORMATTING */}
                {(block.type === 'output' || block.type === 'table' || block.type === 'sql_output') && (
                    <div className="space-y-2">
                        <div className={`overflow-x-auto rounded-[3px] border border-dashed ${
                            isDarkTheme ? 'border-white/10' : 'border-slate-200'
                        }`}>
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className={`font-bold ${
                                        isDarkTheme ? 'bg-white/5 text-white' : 'bg-slate-50/90 text-slate-800'
                                    }`}>
                                        {block.tableHeaders?.map((th, thIdx) => (
                                            <th key={thIdx} className={`p-2 border-r border-b border-dashed last:border-r-0 relative group/th ${
                                                isDarkTheme ? 'border-white/10' : 'border-slate-200'
                                            }`}>
                                                <div className="flex items-center justify-between gap-1">
                                                    <div className="flex-1">
                                                        <RichTextEditable
                                                            value={th}
                                                            onChange={(val) => {
                                                                const newHeaders = [...(block.tableHeaders || [])];
                                                                newHeaders[thIdx] = val;
                                                                onUpdateActiveBlock({ tableHeaders: newHeaders });
                                                            }}
                                                            placeholder="Cột"
                                                            className={`font-bold text-center min-h-[1.5rem] ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}
                                                            isDarkTheme={isDarkTheme}
                                                        />
                                                    </div>
                                                    {(block.tableHeaders?.length || 0) > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteColumn(thIdx)}
                                                            className="opacity-0 group-hover/th:opacity-100 text-slate-400 hover:text-rose-500 text-[10px] px-1 transition-opacity"
                                                            title="Xóa cột này"
                                                        >
                                                            ✕
                                                        </button>
                                                    )}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className={isDarkTheme ? 'text-white/80' : 'text-slate-700'}>
                                    {block.tableRows?.map((row, rIdx) => (
                                        <tr key={rIdx} className={`group/tr ${isDarkTheme ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50'}`}>
                                            {row.map((cell, cIdx) => (
                                                <td key={cIdx} className={`p-2 border-r border-b border-dashed last:border-r-0 relative ${
                                                    isDarkTheme ? 'border-white/10' : 'border-slate-200'
                                                }`}>
                                                    <div className="flex items-center justify-between gap-1">
                                                        <div className="flex-1">
                                                            <RichTextEditable
                                                                value={cell}
                                                                onChange={(val) => {
                                                                    const newRows = [...(block.tableRows || [])];
                                                                    newRows[rIdx][cIdx] = val;
                                                                    onUpdateActiveBlock({ tableRows: newRows });
                                                                }}
                                                                placeholder="Dữ liệu"
                                                                className={`text-center min-h-[1.5rem] ${isDarkTheme ? 'text-white/80' : 'text-slate-800'}`}
                                                                isDarkTheme={isDarkTheme}
                                                            />
                                                        </div>
                                                        {cIdx === row.length - 1 && (block.tableRows?.length || 0) > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteRow(rIdx)}
                                                                className="opacity-0 group-hover/tr:opacity-100 text-slate-400 hover:text-rose-500 text-[10px] px-1 transition-opacity"
                                                                title="Xóa dòng này"
                                                            >
                                                                ✕
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Table Note & Table Controls */}
                        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] pt-1">
                            <div className="flex-1 min-w-[200px]">
                                <RichTextEditable
                                    value={block.tableNote || ''}
                                    onChange={(val) => onUpdateActiveBlock({ tableNote: val })}
                                    placeholder="→ Ghi chú kết quả (ví dụ: Kết quả trả về 2 dòng)..."
                                    className={`text-xs italic min-h-[1.5rem] ${isDarkTheme ? 'text-white/50' : 'text-slate-500'}`}
                                    isDarkTheme={isDarkTheme}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={handleAddColumn}
                                    className="text-sky-600 hover:text-sky-700 hover:underline text-xs font-semibold px-2 py-0.5 rounded border border-dashed border-sky-300 bg-sky-50/50"
                                >
                                    + Thêm cột
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAddRow}
                                    className="text-purple-600 hover:text-purple-700 hover:underline text-xs font-semibold px-2 py-0.5 rounded border border-dashed border-purple-300 bg-purple-50/50"
                                >
                                    + Thêm dòng
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 5. EXPLANATION / CALLOUT BLOCK */}
                {(block.type === 'explanation' || block.type === 'callout' || block.type === 'note') && (
                    <RichTextEditable
                        value={block.content || ''}
                        onChange={(val) => onUpdateActiveBlock({ content: val })}
                        placeholder="• SELECT: chọn các cột...&#10;• FROM: chỉ định bảng..."
                        className={`text-xs ${isDarkTheme ? 'text-white/80' : 'text-slate-800'}`}
                        isDarkTheme={isDarkTheme}
                    />
                )}

                {/* 6. EXERCISE BLOCK */}
                {block.type === 'exercise' && (
                    <div className="space-y-2">
                        <RichTextEditable
                            value={block.content || ''}
                            onChange={(val) => onUpdateActiveBlock({ content: val })}
                            placeholder="Mô tả yêu cầu bài tập..."
                            className={`text-xs ${isDarkTheme ? 'text-white/80' : 'text-slate-800'}`}
                            isDarkTheme={isDarkTheme}
                        />

                        <div className="pt-1.5 space-y-1.5">
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
                                    className="w-full bg-[#181822] p-2.5 rounded-[3px] font-mono text-xs text-emerald-300 border border-dashed border-slate-700 focus:outline-none"
                                    placeholder="Mã giải mẫu..."
                                />
                            )}
                        </div>
                    </div>
                )}

                {/* 7. DIVIDER */}
                {block.type === 'divider' && (
                    <div className="py-1">
                        <hr className={`border-dashed ${isDarkTheme ? 'border-white/10' : 'border-slate-300'}`} />
                    </div>
                )}
            </div>
        </div>
    );
};
