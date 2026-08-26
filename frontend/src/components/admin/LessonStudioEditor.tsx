import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
    DragDropContext,
    Droppable,
    Draggable,
    type DropResult,
    type DroppableProvided,
    type DraggableProvided
} from '@hello-pangea/dnd';

export type BlockType =
    | 'heading'
    | 'paragraph'
    | 'list'
    | 'callout'
    | 'note'
    | 'divider'
    | 'code'
    | 'output'
    | 'explanation'
    | 'exercise'
    | 'quiz'
    | 'theory'
    | 'table'
    | 'erd'
    | 'image'
    | 'video';

export interface LessonBlock {
    id: string;
    type: BlockType;
    title?: string;
    content: string;
    headingLevel?: 'H1' | 'H2' | 'H3';
    language?: string;
    showLineNumbers?: boolean;
    allowCopy?: boolean;
    theme?: 'Dark' | 'Light';
    fontSize?: string;
    // Table / Output
    tableHeaders?: string[];
    tableRows?: string[][];
    tableNote?: string;
    // Callout / Explanation
    calloutType?: 'info' | 'tip' | 'warning' | 'explanation';
    // Exercise
    solutionCode?: string;
    isSolutionVisible?: boolean;
    // Advanced
    htmlId?: string;
    internalNote?: string;
}

interface LessonStudioEditorProps {
    lesson: any;
    onSave: (updatedLesson: any) => Promise<void>;
    onClose: () => void;
}

// Helper to create default block by type
const createDefaultBlock = (type: BlockType, id: string): LessonBlock => {
    switch (type) {
        case 'heading':
            return {
                id,
                type: 'heading',
                headingLevel: 'H2',
                title: '1. Tiêu đề mục bài học',
                content: 'Nhập nội dung giải thích chi tiết cho mục này...'
            };
        case 'paragraph':
            return {
                id,
                type: 'paragraph',
                content: 'Nhập nội dung đoạn văn lý thuyết tại đây...'
            };
        case 'code':
            return {
                id,
                type: 'code',
                language: 'Python',
                showLineNumbers: true,
                allowCopy: true,
                theme: 'Dark',
                fontSize: '14px',
                content: '# Viết code minh họa tại đây\nprint("Hello, World!")'
            };
        case 'output':
        case 'table':
            return {
                id,
                type: 'output',
                title: 'Kết quả (ví dụ)',
                tableHeaders: ['id', 'name', 'age'],
                tableRows: [
                    ['1', 'An', '20'],
                    ['2', 'Bình', '21']
                ],
                tableNote: 'Kết quả trả về 2 dòng.',
                content: ''
            };
        case 'explanation':
        case 'callout':
            return {
                id,
                type: 'explanation',
                title: 'Giải thích',
                calloutType: 'explanation',
                content: '• Ý 1: Điểm cốt lõi\n• Ý 2: Cú pháp cần nhớ\n• Ý 3: Mẹo thực hành'
            };
        case 'exercise':
            return {
                id,
                type: 'exercise',
                title: 'Bài tập vận dụng',
                content: 'Mô tả yêu cầu bài tập cho học viên thực hành...',
                solutionCode: '# Lời giải mẫu\nprint("Xong")',
                isSolutionVisible: false
            };
        case 'divider':
            return {
                id,
                type: 'divider',
                content: '---'
            };
        default:
            return {
                id,
                type,
                content: 'Nội dung khối mới...'
            };
    }
};

// Convert Markdown string to initial structured blocks
const parseMarkdownToBlocks = (markdown: string, lessonTitle: string): LessonBlock[] => {
    let cleanMarkdown = (markdown || '').trim();

    // Strip YAML frontmatter if present (e.g. --- \n lessonId: ... \n title: ... \n ---)
    if (cleanMarkdown.startsWith('---')) {
        const endIdx = cleanMarkdown.indexOf('---', 3);
        if (endIdx !== -1) {
            cleanMarkdown = cleanMarkdown.substring(endIdx + 3).trim();
        }
    }

    if (!cleanMarkdown) {
        return [
            {
                id: 'b-1',
                type: 'heading',
                headingLevel: 'H2',
                title: lessonTitle || '1. Giới thiệu bài học',
                content: 'Nhập nội dung giới thiệu bài học tại đây...'
            },
            {
                id: 'b-2',
                type: 'code',
                language: 'Python',
                showLineNumbers: true,
                allowCopy: true,
                theme: 'Dark',
                fontSize: '14px',
                content: '# Viết code minh họa tại đây\nprint("Hello, World!")'
            }
        ];
    }

    const blocks: LessonBlock[] = [];
    const lines = cleanMarkdown.split('\n');
    let currentText: string[] = [];
    let inCode = false;
    let codeLang = 'Python';
    let codeLines: string[] = [];

    let blockCounter = 1;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.startsWith('```')) {
            if (!inCode) {
                if (currentText.length > 0) {
                    const textJoined = currentText.join('\n').trim();
                    if (textJoined) {
                        blocks.push({
                            id: `b-${blockCounter++}`,
                            type: 'paragraph',
                            content: textJoined
                        });
                    }
                    currentText = [];
                }
                inCode = true;
                codeLang = line.replace('```', '').trim() || 'Python';
                codeLines = [];
            } else {
                inCode = false;
                blocks.push({
                    id: `b-${blockCounter++}`,
                    type: 'code',
                    language: codeLang.toUpperCase() === 'SQL' ? 'SQL' : 'Python',
                    showLineNumbers: true,
                    allowCopy: true,
                    theme: 'Dark',
                    fontSize: '14px',
                    content: codeLines.join('\n')
                });
                codeLines = [];
            }
            continue;
        }

        if (inCode) {
            codeLines.push(line);
            continue;
        }

        if (line.startsWith('# ') || line.startsWith('## ') || line.startsWith('### ')) {
            if (currentText.length > 0) {
                const textJoined = currentText.join('\n').trim();
                if (textJoined) {
                    blocks.push({
                        id: `b-${blockCounter++}`,
                        type: 'paragraph',
                        content: textJoined
                    });
                }
                currentText = [];
            }

            const level: 'H1' | 'H2' | 'H3' = line.startsWith('### ') ? 'H3' : line.startsWith('## ') ? 'H2' : 'H1';
            const title = line.replace(/^#{1,3}\s+/, '').trim();
            blocks.push({
                id: `b-${blockCounter++}`,
                type: 'heading',
                headingLevel: level,
                title: title,
                content: ''
            });
            continue;
        }

        currentText.push(line);
    }

    if (currentText.length > 0) {
        const textJoined = currentText.join('\n').trim();
        if (textJoined) {
            blocks.push({
                id: `b-${blockCounter++}`,
                type: 'paragraph',
                content: textJoined
            });
        }
    }

    return blocks.length > 0 ? blocks : [
        {
            id: 'b-init',
            type: 'paragraph',
            content: cleanMarkdown
        }
    ];
};

// Convert blocks back to structured Markdown for saving
const convertBlocksToMarkdown = (blocks: LessonBlock[]): string => {
    return blocks.map(b => {
        switch (b.type) {
            case 'heading': {
                const prefix = b.headingLevel === 'H1' ? '# ' : b.headingLevel === 'H3' ? '### ' : '## ';
                return `${prefix}${b.title || ''}\n\n${b.content || ''}`.trim();
            }
            case 'paragraph':
            case 'theory':
                return b.content;
            case 'list':
                return b.content;
            case 'code':
                return `\`\`\`${(b.language || 'python').toLowerCase()}\n${b.content}\n\`\`\``;
            case 'callout':
            case 'explanation':
            case 'note':
                return `> [!NOTE]\n> **${b.title || 'Lưu ý'}**\n> ${b.content.replace(/\n/g, '\n> ')}`;
            case 'table':
            case 'output': {
                if (b.tableHeaders && b.tableRows) {
                    const headerLine = `| ${b.tableHeaders.join(' | ')} |`;
                    const separatorLine = `| ${b.tableHeaders.map(() => '---').join(' | ')} |`;
                    const rowsLines = b.tableRows.map(r => `| ${r.join(' | ')} |`).join('\n');
                    const noteText = b.tableNote ? `\n\n*${b.tableNote}*` : '';
                    return `${headerLine}\n${separatorLine}\n${rowsLines}${noteText}`;
                }
                return b.content;
            }
            case 'exercise':
                return `### ${b.title || 'Bài tập vận dụng'}\n${b.content}${b.solutionCode ? `\n\n<details><summary>Xem đáp án</summary>\n\n\`\`\`python\n${b.solutionCode}\n\`\`\`\n</details>` : ''}`;
            case 'divider':
                return `---`;
            default:
                return b.content;
        }
    }).join('\n\n');
};

export const LessonStudioEditor: React.FC<LessonStudioEditorProps> = ({ lesson, onSave, onClose }) => {
    const [title, setTitle] = useState(lesson.title || '');
    const [lessonIdCode, setLessonIdCode] = useState(lesson.lessonId || '');
    const [objective, setObjective] = useState(lesson.objective || '');
    const [difficulty, setDifficulty] = useState(lesson.difficulty || 'EASY');
    const [durationMinutes, setDurationMinutes] = useState(lesson.durationMinutes || 15);
    const [blocks, setBlocks] = useState<LessonBlock[]>(() => parseMarkdownToBlocks(lesson.content || '', lesson.title || ''));
    const [selectedBlockId, setSelectedBlockId] = useState<string>(blocks[0]?.id || '');
    const [searchBlockQuery, setSearchBlockQuery] = useState('');
    const [isSaved, setIsSaved] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [history, setHistory] = useState<LessonBlock[][]>([blocks]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [previewMode, setPreviewMode] = useState(false);
    const [isDarkTheme, setIsDarkTheme] = useState(false); // Default to crisp LIGHT theme
    const [insertMenuOpenIndex, setInsertMenuOpenIndex] = useState<number | null>(null);

    const activeBlock = blocks.find(b => b.id === selectedBlockId) || blocks[0];

    // Push state to history for undo/redo
    const updateBlocksWithHistory = (newBlocks: LessonBlock[]) => {
        setBlocks(newBlocks);
        setIsSaved(false);
        const newHist = history.slice(0, historyIndex + 1);
        newHist.push(newBlocks);
        setHistory(newHist);
        setHistoryIndex(newHist.length - 1);
    };

    const handleUndo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            setBlocks(history[historyIndex - 1]);
        }
    };

    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            setBlocks(history[historyIndex + 1]);
        }
    };

    // Add Block to end
    const handleAddBlock = (type: BlockType) => {
        const newId = `block-${Date.now()}`;
        const newBlock: LessonBlock = createDefaultBlock(type, newId);
        const newBlocks = [...blocks, newBlock];
        updateBlocksWithHistory(newBlocks);
        setSelectedBlockId(newId);
    };

    // Insert Block at specific index (directly below block #index)
    const handleInsertBlockAt = (type: BlockType, index: number) => {
        const newId = `block-${Date.now()}`;
        const newBlock: LessonBlock = createDefaultBlock(type, newId);
        const newBlocks = [...blocks];
        newBlocks.splice(index + 1, 0, newBlock);
        updateBlocksWithHistory(newBlocks);
        setSelectedBlockId(newId);
        setInsertMenuOpenIndex(null);
    };

    // Update active block
    const handleUpdateActiveBlock = (fields: Partial<LessonBlock>) => {
        if (!activeBlock) return;
        const newBlocks = blocks.map(b => b.id === activeBlock.id ? { ...b, ...fields } : b);
        updateBlocksWithHistory(newBlocks);
    };

    // Delete active block
    const handleDeleteBlock = (id: string) => {
        if (blocks.length <= 1) {
            alert('Bài học phải có ít nhất 1 khối nội dung.');
            return;
        }
        const newBlocks = blocks.filter(b => b.id !== id);
        updateBlocksWithHistory(newBlocks);
        setSelectedBlockId(newBlocks[0].id);
    };

    // Drag and drop reordering
    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const items = Array.from(blocks);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        updateBlocksWithHistory(items);
    };

    // Save All
    const handleSaveAll = async () => {
        setIsSaving(true);
        try {
            const finalMarkdown = convertBlocksToMarkdown(blocks);
            await onSave({
                ...lesson,
                title,
                lessonId: lessonIdCode,
                objective,
                difficulty,
                durationMinutes,
                content: finalMarkdown
            });
            setIsSaved(true);
        } finally {
            setIsSaving(false);
        }
    };

    return createPortal(
        <div className={`fixed inset-0 top-0 left-0 w-screen h-screen z-[99999] flex flex-col font-sans select-none overflow-hidden transition-colors ${
            isDarkTheme ? 'bg-[#0c0c10] text-white' : 'bg-[#f8fafc] text-slate-900'
        }`}>
            {/* 1. TOP NAVIGATION BAR */}
            <div className={`h-16 px-6 flex items-center justify-between flex-shrink-0 z-20 border-b shadow-sm ${
                isDarkTheme ? 'bg-[#121217] border-white/10' : 'bg-white border-slate-200'
            }`}>
                {/* Left Brand & Breadcrumb */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={onClose}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                            isDarkTheme
                                ? 'border-white/10 bg-white/5 hover:bg-white/10 text-white/80'
                                : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                        }`}
                    >
                        &larr; Quay lại danh sách
                    </button>
                    <div className={`h-4 w-[1px] ${isDarkTheme ? 'bg-white/10' : 'bg-slate-200'}`} />
                    <span className={`text-xs font-medium ${isDarkTheme ? 'text-white/50' : 'text-slate-500'}`}>
                        Nền tảng học lập trình / Admin / Soạn bài học
                    </span>
                </div>

                {/* Center Editable Title */}
                <div className="flex items-center gap-2 max-w-md w-full justify-center">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            setIsSaved(false);
                        }}
                        className={`border rounded-lg px-3 py-1.5 text-xs md:text-sm font-bold text-center w-full focus:outline-none transition-all ${
                            isDarkTheme
                                ? 'bg-white/5 hover:bg-white/10 focus:bg-[#181820] border-white/10 focus:border-purple-500 text-white'
                                : 'bg-slate-50 hover:bg-slate-100/80 focus:bg-white border-slate-300 focus:border-purple-600 text-slate-900 shadow-inner'
                        }`}
                        placeholder="Nhập tiêu đề bài học..."
                    />
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2.5">
                    {/* Theme Toggle (Sáng / Tối) */}
                    <button
                        onClick={() => setIsDarkTheme(!isDarkTheme)}
                        className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 ${
                            isDarkTheme
                                ? 'border-white/10 bg-white/5 hover:bg-white/10 text-white/80'
                                : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                        }`}
                        title="Chuyển đổi giao diện Sáng / Tối"
                    >
                        <span>{isDarkTheme ? '🌙 Tối' : '☀️ Sáng'}</span>
                    </button>

                    {/* Status badge */}
                    <div className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                        isSaved
                            ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                            : 'text-amber-700 bg-amber-50 border-amber-200'
                    }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isSaved ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                        {isSaved ? 'Đã lưu' : 'Có thay đổi chưa lưu'}
                    </div>

                    {/* Undo / Redo */}
                    <div className={`flex items-center rounded-lg border p-0.5 ${
                        isDarkTheme ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                    }`}>
                        <button
                            onClick={handleUndo}
                            disabled={historyIndex === 0}
                            className={`px-2 py-1 text-xs disabled:opacity-30 ${isDarkTheme ? 'text-white/70 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
                            title="Hoàn tác (Undo)"
                        >
                            ↺
                        </button>
                        <button
                            onClick={handleRedo}
                            disabled={historyIndex >= history.length - 1}
                            className={`px-2 py-1 text-xs disabled:opacity-30 ${isDarkTheme ? 'text-white/70 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
                            title="Làm lại (Redo)"
                        >
                            ↻
                        </button>
                    </div>

                    {/* Preview Button */}
                    <button
                        onClick={() => setPreviewMode(!previewMode)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                            previewMode
                                ? 'bg-purple-600 text-white border-purple-500'
                                : isDarkTheme
                                    ? 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10'
                                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-sm'
                        }`}
                    >
                        {previewMode ? 'Sửa bài' : 'Xem thử'}
                    </button>

                    {/* Save Draft */}
                    <button
                        onClick={handleSaveAll}
                        disabled={isSaving}
                        className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg border transition-colors ${
                            isDarkTheme
                                ? 'border-white/10 bg-white/5 hover:bg-white/10 text-white'
                                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm'
                        }`}
                    >
                        Lưu nháp
                    </button>

                    {/* Publish CTA */}
                    <button
                        onClick={handleSaveAll}
                        disabled={isSaving}
                        className="text-xs font-bold px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-600/20 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isSaving ? 'Đang lưu...' : 'Xuất bản'}
                    </button>
                </div>
            </div>

            {/* 2. 3-COLUMN MAIN WORKSPACE */}
            <div className="flex-1 flex overflow-hidden">
                {/* 1. LEFT SIDEBAR: THÊM KHỐI (KÉO THẢ / CLICK) */}
                <div className={`w-64 border-r p-4 flex flex-col gap-4 overflow-y-auto flex-shrink-0 ${
                    isDarkTheme ? 'bg-[#121217] border-white/10' : 'bg-white border-slate-200'
                }`}>
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <span className={`text-[11px] font-bold uppercase tracking-wider ${
                            isDarkTheme ? 'text-white/60' : 'text-slate-700'
                        }`}>
                            Thêm Khối (Kéo thả)
                        </span>
                    </div>

                    {/* Search */}
                    <div>
                        <input
                            type="text"
                            placeholder="Tìm kiếm khối..."
                            value={searchBlockQuery}
                            onChange={(e) => setSearchBlockQuery(e.target.value)}
                            className={`w-full border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-purple-500 transition-colors ${
                                isDarkTheme
                                    ? 'bg-[#181820] border-white/10 text-white placeholder-white/40'
                                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                            }`}
                        />
                    </div>

                    {/* Groups */}
                    <div className="space-y-4 text-left">
                        {/* Group 1: CƠ BẢN */}
                        <div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider block mb-2 ${
                                isDarkTheme ? 'text-white/40' : 'text-slate-400'
                            }`}>
                                Cơ bản
                            </span>
                            <div className="grid grid-cols-3 gap-1.5">
                                <button
                                    onClick={() => handleAddBlock('heading')}
                                    className={`p-2 border rounded-xl flex flex-col items-center gap-1 transition-all ${
                                        isDarkTheme
                                            ? 'bg-[#181820] hover:bg-purple-600/20 border-white/5 hover:border-purple-500/40 text-white/80'
                                            : 'bg-slate-50 hover:bg-purple-50 border-slate-200 hover:border-purple-300 text-slate-700 hover:text-purple-700 shadow-sm'
                                    }`}
                                >
                                    <span className="font-bold text-sm text-purple-600">H</span>
                                    <span className="text-[10px] font-semibold">Tiêu đề</span>
                                </button>
                                <button
                                    onClick={() => handleAddBlock('paragraph')}
                                    className={`p-2 border rounded-xl flex flex-col items-center gap-1 transition-all ${
                                        isDarkTheme
                                            ? 'bg-[#181820] hover:bg-purple-600/20 border-white/5 hover:border-purple-500/40 text-white/80'
                                            : 'bg-slate-50 hover:bg-purple-50 border-slate-200 hover:border-purple-300 text-slate-700 hover:text-purple-700 shadow-sm'
                                    }`}
                                >
                                    <span className="font-bold text-sm text-purple-600">¶</span>
                                    <span className="text-[10px] font-semibold">Đoạn văn</span>
                                </button>
                                <button
                                    onClick={() => handleAddBlock('list')}
                                    className={`p-2 border rounded-xl flex flex-col items-center gap-1 transition-all ${
                                        isDarkTheme
                                            ? 'bg-[#181820] hover:bg-purple-600/20 border-white/5 hover:border-purple-500/40 text-white/80'
                                            : 'bg-slate-50 hover:bg-purple-50 border-slate-200 hover:border-purple-300 text-slate-700 hover:text-purple-700 shadow-sm'
                                    }`}
                                >
                                    <span className="font-bold text-sm text-purple-600">≡</span>
                                    <span className="text-[10px] font-semibold">Danh sách</span>
                                </button>
                                <button
                                    onClick={() => handleAddBlock('callout')}
                                    className={`p-2 border rounded-xl flex flex-col items-center gap-1 transition-all ${
                                        isDarkTheme
                                            ? 'bg-[#181820] hover:bg-purple-600/20 border-white/5 hover:border-purple-500/40 text-white/80'
                                            : 'bg-slate-50 hover:bg-amber-50 border-slate-200 hover:border-amber-300 text-slate-700 hover:text-amber-700 shadow-sm'
                                    }`}
                                >
                                    <span className="font-bold text-sm text-amber-500">💡</span>
                                    <span className="text-[10px] font-semibold">Callout</span>
                                </button>
                                <button
                                    onClick={() => handleAddBlock('note')}
                                    className={`p-2 border rounded-xl flex flex-col items-center gap-1 transition-all ${
                                        isDarkTheme
                                            ? 'bg-[#181820] hover:bg-purple-600/20 border-white/5 hover:border-purple-500/40 text-white/80'
                                            : 'bg-slate-50 hover:bg-sky-50 border-slate-200 hover:border-sky-300 text-slate-700 hover:text-sky-700 shadow-sm'
                                    }`}
                                >
                                    <span className="font-bold text-sm text-sky-500">📝</span>
                                    <span className="text-[10px] font-semibold">Ghi chú</span>
                                </button>
                                <button
                                    onClick={() => handleAddBlock('divider')}
                                    className={`p-2 border rounded-xl flex flex-col items-center gap-1 transition-all ${
                                        isDarkTheme
                                            ? 'bg-[#181820] hover:bg-purple-600/20 border-white/5 hover:border-purple-500/40 text-white/80'
                                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-slate-300 text-slate-700 shadow-sm'
                                    }`}
                                >
                                    <span className="font-bold text-sm text-slate-400">—</span>
                                    <span className="text-[10px] font-semibold">Đường kẻ</span>
                                </button>
                            </div>
                        </div>

                        {/* Group 2: NỘI DUNG LẬP TRÌNH */}
                        <div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider block mb-2 ${
                                isDarkTheme ? 'text-white/40' : 'text-slate-400'
                            }`}>
                                Nội dung lập trình
                            </span>
                            <div className="grid grid-cols-3 gap-1.5">
                                <button
                                    onClick={() => handleAddBlock('code')}
                                    className={`p-2 border rounded-xl flex flex-col items-center gap-1 transition-all ${
                                        isDarkTheme
                                            ? 'bg-[#181820] hover:bg-purple-600/20 border-white/5 hover:border-purple-500/40 text-white/80'
                                            : 'bg-slate-50 hover:bg-purple-50 border-slate-200 hover:border-purple-300 text-slate-700 hover:text-purple-700 shadow-sm'
                                    }`}
                                >
                                    <span className="font-mono font-bold text-xs text-purple-600">&lt;/&gt;</span>
                                    <span className="text-[10px] font-semibold">Khối mã</span>
                                </button>
                                <button
                                    onClick={() => handleAddBlock('output')}
                                    className={`p-2 border rounded-xl flex flex-col items-center gap-1 transition-all ${
                                        isDarkTheme
                                            ? 'bg-[#181820] hover:bg-purple-600/20 border-white/5 hover:border-purple-500/40 text-white/80'
                                            : 'bg-slate-50 hover:bg-sky-50 border-slate-200 hover:border-sky-300 text-slate-700 hover:text-sky-700 shadow-sm'
                                    }`}
                                >
                                    <span className="font-bold text-xs text-sky-500">▶</span>
                                    <span className="text-[10px] font-semibold">Kết quả</span>
                                </button>
                                <button
                                    onClick={() => handleAddBlock('explanation')}
                                    className={`p-2 border rounded-xl flex flex-col items-center gap-1 transition-all ${
                                        isDarkTheme
                                            ? 'bg-[#181820] hover:bg-purple-600/20 border-white/5 hover:border-purple-500/40 text-white/80'
                                            : 'bg-slate-50 hover:bg-amber-50 border-slate-200 hover:border-amber-300 text-slate-700 hover:text-amber-700 shadow-sm'
                                    }`}
                                >
                                    <span className="font-bold text-xs text-amber-500">ℹ</span>
                                    <span className="text-[10px] font-semibold">Giải thích</span>
                                </button>
                                <button
                                    onClick={() => handleAddBlock('exercise')}
                                    className={`p-2 border rounded-xl flex flex-col items-center gap-1 transition-all ${
                                        isDarkTheme
                                            ? 'bg-[#181820] hover:bg-purple-600/20 border-white/5 hover:border-purple-500/40 text-white/80'
                                            : 'bg-slate-50 hover:bg-emerald-50 border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 shadow-sm'
                                    }`}
                                >
                                    <span className="font-bold text-xs text-emerald-500">✎</span>
                                    <span className="text-[10px] font-semibold">Bài tập</span>
                                </button>
                                <button
                                    onClick={() => handleAddBlock('quiz')}
                                    className={`p-2 border rounded-xl flex flex-col items-center gap-1 transition-all ${
                                        isDarkTheme
                                            ? 'bg-[#181820] hover:bg-purple-600/20 border-white/5 hover:border-purple-500/40 text-white/80'
                                            : 'bg-slate-50 hover:bg-rose-50 border-slate-200 hover:border-rose-300 text-slate-700 hover:text-rose-700 shadow-sm'
                                    }`}
                                >
                                    <span className="font-bold text-xs text-rose-500">?</span>
                                    <span className="text-[10px] font-semibold">Quiz</span>
                                </button>
                                <button
                                    onClick={() => handleAddBlock('theory')}
                                    className={`p-2 border rounded-xl flex flex-col items-center gap-1 transition-all ${
                                        isDarkTheme
                                            ? 'bg-[#181820] hover:bg-purple-600/20 border-white/5 hover:border-purple-500/40 text-white/80'
                                            : 'bg-slate-50 hover:bg-indigo-50 border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 shadow-sm'
                                    }`}
                                >
                                    <span className="font-bold text-xs text-indigo-500">📖</span>
                                    <span className="text-[10px] font-semibold">Lý thuyết</span>
                                </button>
                            </div>
                        </div>

                        {/* Group 3: DỮ LIỆU & SQL */}
                        <div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider block mb-2 ${
                                isDarkTheme ? 'text-white/40' : 'text-slate-400'
                            }`}>
                                Dữ liệu & SQL
                            </span>
                            <div className="grid grid-cols-3 gap-1.5">
                                <button
                                    onClick={() => handleAddBlock('table')}
                                    className={`p-2 border rounded-xl flex flex-col items-center gap-1 transition-all ${
                                        isDarkTheme
                                            ? 'bg-[#181820] hover:bg-purple-600/20 border-white/5 hover:border-purple-500/40 text-white/80'
                                            : 'bg-slate-50 hover:bg-purple-50 border-slate-200 hover:border-purple-300 text-slate-700 hover:text-purple-700 shadow-sm'
                                    }`}
                                >
                                    <span className="font-bold text-xs text-purple-600">▦</span>
                                    <span className="text-[10px] font-semibold">Bảng</span>
                                </button>
                                <button
                                    onClick={() => handleAddBlock('erd')}
                                    className={`p-2 border rounded-xl flex flex-col items-center gap-1 transition-all ${
                                        isDarkTheme
                                            ? 'bg-[#181820] hover:bg-purple-600/20 border-white/5 hover:border-purple-500/40 text-white/80'
                                            : 'bg-slate-50 hover:bg-indigo-50 border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 shadow-sm'
                                    }`}
                                >
                                    <span className="font-bold text-xs text-indigo-500">☍</span>
                                    <span className="text-[10px] font-semibold">Sơ đồ ERD</span>
                                </button>
                                <button
                                    onClick={() => handleAddBlock('output')}
                                    className={`p-2 border rounded-xl flex flex-col items-center gap-1 transition-all ${
                                        isDarkTheme
                                            ? 'bg-[#181820] hover:bg-purple-600/20 border-white/5 hover:border-purple-500/40 text-white/80'
                                            : 'bg-slate-50 hover:bg-emerald-50 border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 shadow-sm'
                                    }`}
                                >
                                    <span className="font-bold text-xs text-emerald-500">🗄</span>
                                    <span className="text-[10px] font-semibold">Kết quả SQL</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tip at bottom */}
                    <div className={`mt-auto pt-4 border-t text-[11px] leading-relaxed ${
                        isDarkTheme ? 'border-white/5 text-white/40' : 'border-slate-100 text-slate-500'
                    }`}>
                        Bấm vào khối để thêm hoặc kéo thả để đổi thứ tự trực quan.
                    </div>
                </div>

                {/* 2. CENTER CANVAS: SOẠN THẢO TRỰC QUAN */}
                <div className={`flex-1 p-6 overflow-y-auto flex justify-center ${
                    isDarkTheme ? 'bg-[#09090c]' : 'bg-[#f1f5f9]'
                }`}>
                    <div className="w-full max-w-4xl space-y-4">
                        {/* Top Formatting Ribbon */}
                        <div className={`border rounded-xl p-2.5 flex items-center justify-between select-none shadow-sm ${
                            isDarkTheme ? 'bg-[#121217] border-white/10 text-white/70' : 'bg-white border-slate-200 text-slate-700'
                        }`}>
                            <div className="flex items-center gap-1.5 text-xs">
                                <span className={`font-semibold px-2 py-1 rounded ${isDarkTheme ? 'bg-white/5' : 'bg-slate-100 text-slate-800'}`}>
                                    H2 ▾
                                </span>
                                <div className={`h-4 w-[1px] ${isDarkTheme ? 'bg-white/10' : 'bg-slate-200'}`} />
                                <span className={`font-bold px-2 py-0.5 rounded cursor-pointer ${isDarkTheme ? 'hover:bg-white/10' : 'hover:bg-slate-100'}`}>B</span>
                                <span className={`italic font-serif px-2 py-0.5 rounded cursor-pointer ${isDarkTheme ? 'hover:bg-white/10' : 'hover:bg-slate-100'}`}>I</span>
                                <span className={`underline px-2 py-0.5 rounded cursor-pointer ${isDarkTheme ? 'hover:bg-white/10' : 'hover:bg-slate-100'}`}>U</span>
                                <span className={`line-through px-2 py-0.5 rounded cursor-pointer ${isDarkTheme ? 'hover:bg-white/10' : 'hover:bg-slate-100'}`}>S</span>
                                <div className={`h-4 w-[1px] ${isDarkTheme ? 'bg-white/10' : 'bg-slate-200'}`} />
                                <span className={`font-mono text-xs px-2 py-0.5 rounded cursor-pointer ${isDarkTheme ? 'hover:bg-white/10' : 'hover:bg-slate-100'}`}>&lt;/&gt;</span>
                                <span className={`px-2 py-0.5 rounded cursor-pointer ${isDarkTheme ? 'hover:bg-white/10' : 'hover:bg-slate-100'}`}>🔗</span>
                                <span className={`px-2 py-0.5 rounded cursor-pointer ${isDarkTheme ? 'hover:bg-white/10' : 'hover:bg-slate-100'}`}>🖼️</span>
                                <span className={`px-2 py-0.5 rounded cursor-pointer ${isDarkTheme ? 'hover:bg-white/10' : 'hover:bg-slate-100'}`}>▦</span>
                            </div>
                            <span className={`text-[11px] font-medium ${isDarkTheme ? 'text-white/40' : 'text-slate-400'}`}>
                                Studio Block Editor
                            </span>
                        </div>

                        {/* Drag & Drop Blocks Container */}
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="lesson-blocks-droppable">
                                {(provided: DroppableProvided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="space-y-4"
                                    >
                                        {blocks.map((block, index) => {
                                            const isSelected = selectedBlockId === block.id;

                                            return (
                                                <Draggable key={block.id} draggableId={block.id} index={index}>
                                                    {(providedDraggable: DraggableProvided) => (
                                                        <div
                                                            ref={providedDraggable.innerRef}
                                                            {...providedDraggable.draggableProps}
                                                            className="space-y-2"
                                                        >
                                                            {/* Main Block Card */}
                                                            <div
                                                                onClick={() => setSelectedBlockId(block.id)}
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
                                                                                handleDeleteBlock(block.id);
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
                                                                                onChange={(e) => handleUpdateActiveBlock({ title: e.target.value })}
                                                                                className={`w-full bg-transparent text-lg md:text-xl font-extrabold border-none focus:outline-none ${
                                                                                    isDarkTheme ? 'text-white placeholder-white/30' : 'text-slate-900 placeholder-slate-400'
                                                                                }`}
                                                                                placeholder="1. Tiêu đề mục"
                                                                            />
                                                                            <textarea
                                                                                rows={2}
                                                                                value={block.content || ''}
                                                                                onChange={(e) => handleUpdateActiveBlock({ content: e.target.value })}
                                                                                className={`w-full bg-transparent text-xs leading-relaxed border-none focus:outline-none resize-none ${
                                                                                    isDarkTheme ? 'text-white/70 placeholder-white/30' : 'text-slate-600 placeholder-slate-400'
                                                                                }`}
                                                                                placeholder="Nhập mô tả chi tiết cho tiêu đề này..."
                                                                            />
                                                                        </div>
                                                                    )}

                                                                    {/* 2. PARAGRAPH BLOCK */}
                                                                    {block.type === 'paragraph' && (
                                                                        <textarea
                                                                            rows={3}
                                                                            value={block.content || ''}
                                                                            onChange={(e) => handleUpdateActiveBlock({ content: e.target.value })}
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
                                                                                onChange={(e) => handleUpdateActiveBlock({ content: e.target.value })}
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
                                                                                                            handleUpdateActiveBlock({ tableHeaders: newHeaders });
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
                                                                                                                handleUpdateActiveBlock({ tableRows: newRows });
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
                                                                                    onChange={(e) => handleUpdateActiveBlock({ tableNote: e.target.value })}
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
                                                                                        handleUpdateActiveBlock({ tableRows: newRows });
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
                                                                                    onChange={(e) => handleUpdateActiveBlock({ title: e.target.value })}
                                                                                    className={`bg-transparent font-bold text-xs focus:outline-none w-full ${
                                                                                        isDarkTheme ? 'text-amber-300' : 'text-amber-900'
                                                                                    }`}
                                                                                />
                                                                            </div>
                                                                            <textarea
                                                                                rows={4}
                                                                                value={block.content || ''}
                                                                                onChange={(e) => handleUpdateActiveBlock({ content: e.target.value })}
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
                                                                                    onChange={(e) => handleUpdateActiveBlock({ title: e.target.value })}
                                                                                    className={`bg-transparent font-bold text-xs focus:outline-none w-full ${
                                                                                        isDarkTheme ? 'text-indigo-300' : 'text-indigo-900'
                                                                                    }`}
                                                                                />
                                                                            </div>
                                                                            <textarea
                                                                                rows={2}
                                                                                value={block.content || ''}
                                                                                onChange={(e) => handleUpdateActiveBlock({ content: e.target.value })}
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
                                                                                    onClick={() => handleUpdateActiveBlock({ isSolutionVisible: !block.isSolutionVisible })}
                                                                                    className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1.5"
                                                                                >
                                                                                    <span>👁</span>
                                                                                    <span>{block.isSolutionVisible ? 'Ẩn đáp án' : 'Xem đáp án'}</span>
                                                                                </button>

                                                                                {block.isSolutionVisible && (
                                                                                    <textarea
                                                                                        rows={3}
                                                                                        value={block.solutionCode || ''}
                                                                                        onChange={(e) => handleUpdateActiveBlock({ solutionCode: e.target.value })}
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

                                                            {/* Inline Insert Bar Directly Below This Block */}
                                                            <div className="relative group/insert py-1 flex items-center justify-center">
                                                                <div className={`absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] transition-colors ${
                                                                    isDarkTheme ? 'bg-white/5 group-hover/insert:bg-purple-500/40' : 'bg-slate-200 group-hover/insert:bg-purple-300'
                                                                }`} />
                                                                
                                                                <div className="relative z-10 flex items-center gap-1">
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setInsertMenuOpenIndex(insertMenuOpenIndex === index ? null : index);
                                                                        }}
                                                                        className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full border shadow-sm transition-all ${
                                                                            insertMenuOpenIndex === index
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
                                                                {insertMenuOpenIndex === index && (
                                                                    <div className={`absolute top-9 z-30 border rounded-2xl p-3 shadow-2xl flex flex-wrap gap-2 max-w-lg justify-center animate-in fade-in zoom-in-95 duration-150 ${
                                                                        isDarkTheme ? 'bg-[#181820] border-white/15' : 'bg-white border-slate-200 shadow-purple-500/10'
                                                                    }`}>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleInsertBlockAt('heading', index)}
                                                                            className={`px-2.5 py-1.5 border rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all ${
                                                                                isDarkTheme ? 'bg-white/5 border-white/10 text-white hover:bg-purple-600/20' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300'
                                                                            }`}
                                                                        >
                                                                            <span className="text-purple-600 font-bold">H</span> Tiêu đề
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleInsertBlockAt('paragraph', index)}
                                                                            className={`px-2.5 py-1.5 border rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all ${
                                                                                isDarkTheme ? 'bg-white/5 border-white/10 text-white hover:bg-purple-600/20' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300'
                                                                            }`}
                                                                        >
                                                                            <span className="text-purple-600 font-bold">¶</span> Đoạn văn
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleInsertBlockAt('code', index)}
                                                                            className={`px-2.5 py-1.5 border rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all ${
                                                                                isDarkTheme ? 'bg-white/5 border-white/10 text-white hover:bg-purple-600/20' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300'
                                                                            }`}
                                                                        >
                                                                            <span className="text-purple-600 font-bold">&lt;/&gt;</span> Khối mã
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleInsertBlockAt('explanation', index)}
                                                                            className={`px-2.5 py-1.5 border rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all ${
                                                                                isDarkTheme ? 'bg-white/5 border-white/10 text-white hover:bg-amber-600/20' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300'
                                                                            }`}
                                                                        >
                                                                            <span>💡</span> Giải thích
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleInsertBlockAt('table', index)}
                                                                            className={`px-2.5 py-1.5 border rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all ${
                                                                                isDarkTheme ? 'bg-white/5 border-white/10 text-white hover:bg-sky-600/20' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-300'
                                                                            }`}
                                                                        >
                                                                            <span>▦</span> Bảng SQL
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleInsertBlockAt('exercise', index)}
                                                                            className={`px-2.5 py-1.5 border rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all ${
                                                                                isDarkTheme ? 'bg-white/5 border-white/10 text-white hover:bg-indigo-600/20' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300'
                                                                            }`}
                                                                        >
                                                                            <span>✎</span> Bài tập
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleInsertBlockAt('divider', index)}
                                                                            className={`px-2.5 py-1.5 border rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all ${
                                                                                isDarkTheme ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                                                                            }`}
                                                                        >
                                                                            <span>—</span> Đường kẻ
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => setInsertMenuOpenIndex(null)}
                                                                            className="text-slate-400 hover:text-slate-600 text-xs px-2"
                                                                        >
                                                                            ✕
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            );
                                        })}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>
                </div>

                {/* 3. RIGHT SIDEBAR: CÀI ĐẶT KHỐI (BLOCK PROPERTIES) */}
                <div className={`w-72 border-l p-5 flex flex-col gap-5 overflow-y-auto flex-shrink-0 text-left ${
                    isDarkTheme ? 'bg-[#121217] border-white/10' : 'bg-white border-slate-200'
                }`}>
                    {/* General Lesson Properties */}
                    <div className={`space-y-3 pb-4 border-b ${isDarkTheme ? 'border-white/5' : 'border-slate-200'}`}>
                        <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                            isDarkTheme ? 'text-white/40' : 'text-slate-500'
                        }`}>
                            Thông tin bài học
                        </span>
                        <div>
                            <label className={`block text-[11px] font-semibold mb-1 ${isDarkTheme ? 'text-white/50' : 'text-slate-600'}`}>
                                Mã bài (Lesson ID)
                            </label>
                            <input
                                type="text"
                                value={lessonIdCode}
                                onChange={(e) => { setLessonIdCode(e.target.value); setIsSaved(false); }}
                                className={`w-full border rounded-lg px-2.5 py-1.5 text-xs font-mono focus:outline-none ${
                                    isDarkTheme ? 'bg-[#181820] border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                                }`}
                                placeholder="LS-01.01"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className={`block text-[11px] font-semibold mb-1 ${isDarkTheme ? 'text-white/50' : 'text-slate-600'}`}>
                                    Độ khó
                                </label>
                                <select
                                    value={difficulty}
                                    onChange={(e) => { setDifficulty(e.target.value); setIsSaved(false); }}
                                    className={`w-full border rounded-lg px-2 py-1.5 text-xs focus:outline-none ${
                                        isDarkTheme ? 'bg-[#181820] border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                                    }`}
                                >
                                    <option value="EASY">Dễ</option>
                                    <option value="MEDIUM">Vừa</option>
                                    <option value="HARD">Khó</option>
                                </select>
                            </div>
                            <div>
                                <label className={`block text-[11px] font-semibold mb-1 ${isDarkTheme ? 'text-white/50' : 'text-slate-600'}`}>
                                    Thời lượng
                                </label>
                                <input
                                    type="number"
                                    value={durationMinutes}
                                    onChange={(e) => { setDurationMinutes(Number(e.target.value)); setIsSaved(false); }}
                                    className={`w-full border rounded-lg px-2 py-1.5 text-xs focus:outline-none ${
                                        isDarkTheme ? 'bg-[#181820] border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                                    }`}
                                />
                            </div>
                        </div>
                        <div>
                            <label className={`block text-[11px] font-semibold mb-1 ${isDarkTheme ? 'text-white/50' : 'text-slate-600'}`}>
                                Mục tiêu bài học
                            </label>
                            <textarea
                                rows={2}
                                value={objective}
                                onChange={(e) => { setObjective(e.target.value); setIsSaved(false); }}
                                className={`w-full border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none resize-none ${
                                    isDarkTheme ? 'bg-[#181820] border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                                }`}
                                placeholder="Mục tiêu bài học..."
                            />
                        </div>
                    </div>

                    <div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${
                            isDarkTheme ? 'text-white/40' : 'text-slate-500'
                        }`}>
                            CÀI ĐẶT KHỐI
                        </span>
                        <h4 className={`text-sm font-bold flex items-center gap-2 ${
                            isDarkTheme ? 'text-white' : 'text-slate-900'
                        }`}>
                            <span>{activeBlock?.type === 'code' ? '</> Khối mã' : activeBlock?.type === 'heading' ? 'H Tiêu đề' : activeBlock?.type}</span>
                            {activeBlock?.language && <span className="text-xs text-purple-600">({activeBlock.language})</span>}
                        </h4>
                    </div>

                    {/* Dynamic settings based on block type */}
                    {activeBlock?.type === 'code' && (
                        <div className="space-y-4">
                            <div>
                                <label className={`block text-xs font-semibold mb-1.5 ${isDarkTheme ? 'text-white/70' : 'text-slate-700'}`}>
                                    Ngôn ngữ
                                </label>
                                <select
                                    value={activeBlock.language || 'SQL'}
                                    onChange={(e) => handleUpdateActiveBlock({ language: e.target.value })}
                                    className={`w-full border rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:border-purple-500 ${
                                        isDarkTheme ? 'bg-[#181820] border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                                    }`}
                                >
                                    <option value="SQL">SQL</option>
                                    <option value="Python">Python</option>
                                    <option value="JavaScript">JavaScript</option>
                                    <option value="HTML">HTML / CSS</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className={`text-xs font-medium ${isDarkTheme ? 'text-white/80' : 'text-slate-700'}`}>
                                    Hiển thị số dòng
                                </span>
                                <input
                                    type="checkbox"
                                    checked={activeBlock.showLineNumbers ?? true}
                                    onChange={(e) => handleUpdateActiveBlock({ showLineNumbers: e.target.checked })}
                                    className="accent-purple-600 cursor-pointer w-4 h-4"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <span className={`text-xs font-medium ${isDarkTheme ? 'text-white/80' : 'text-slate-700'}`}>
                                    Cho phép copy code
                                </span>
                                <input
                                    type="checkbox"
                                    checked={activeBlock.allowCopy ?? true}
                                    onChange={(e) => handleUpdateActiveBlock({ allowCopy: e.target.checked })}
                                    className="accent-purple-600 cursor-pointer w-4 h-4"
                                />
                            </div>
                        </div>
                    )}

                    {/* Common Appearance Settings */}
                    <div className={`space-y-3 pt-3 border-t ${isDarkTheme ? 'border-white/5' : 'border-slate-200'}`}>
                        <span className={`text-xs font-bold block ${isDarkTheme ? 'text-white/60' : 'text-slate-700'}`}>
                            Giao diện
                        </span>
                        <div>
                            <label className={`block text-[11px] font-semibold mb-1 ${isDarkTheme ? 'text-white/50' : 'text-slate-600'}`}>
                                Chủ đề
                            </label>
                            <select
                                value={activeBlock?.theme || 'Dark'}
                                onChange={(e) => handleUpdateActiveBlock({ theme: e.target.value as any })}
                                className={`w-full border rounded-lg px-3 py-1.5 text-xs focus:outline-none ${
                                    isDarkTheme ? 'bg-[#181820] border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                                }`}
                            >
                                <option value="Dark">Dark</option>
                                <option value="Light">Light</option>
                            </select>
                        </div>
                        <div>
                            <label className={`block text-[11px] font-semibold mb-1 ${isDarkTheme ? 'text-white/50' : 'text-slate-600'}`}>
                                Kích thước chữ
                            </label>
                            <select
                                value={activeBlock?.fontSize || '14px'}
                                onChange={(e) => handleUpdateActiveBlock({ fontSize: e.target.value })}
                                className={`w-full border rounded-lg px-3 py-1.5 text-xs focus:outline-none ${
                                    isDarkTheme ? 'bg-[#181820] border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                                }`}
                            >
                                <option value="12px">12px (Nhỏ)</option>
                                <option value="14px">14px (Chuẩn)</option>
                                <option value="16px">16px (Lớn)</option>
                            </select>
                        </div>
                    </div>

                    {/* Advanced Settings */}
                    <div className={`space-y-3 pt-3 border-t ${isDarkTheme ? 'border-white/5' : 'border-slate-200'}`}>
                        <span className={`text-xs font-bold block ${isDarkTheme ? 'text-white/60' : 'text-slate-700'}`}>
                            Nâng cao
                        </span>
                        <div>
                            <label className={`block text-[11px] font-semibold mb-1 ${isDarkTheme ? 'text-white/50' : 'text-slate-600'}`}>
                                ID (HTML)
                            </label>
                            <input
                                type="text"
                                value={activeBlock?.htmlId || ''}
                                onChange={(e) => handleUpdateActiveBlock({ htmlId: e.target.value })}
                                placeholder={`block-${activeBlock?.id || 'id'}`}
                                className={`w-full border rounded-lg px-3 py-1.5 text-xs font-mono focus:outline-none ${
                                    isDarkTheme ? 'bg-[#181820] border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                                }`}
                            />
                        </div>
                        <div>
                            <label className={`block text-[11px] font-semibold mb-1 ${isDarkTheme ? 'text-white/50' : 'text-slate-600'}`}>
                                Ghi chú nội bộ
                            </label>
                            <textarea
                                rows={2}
                                value={activeBlock?.internalNote || ''}
                                onChange={(e) => handleUpdateActiveBlock({ internalNote: e.target.value })}
                                placeholder="Ghi chú thêm cho khối..."
                                className={`w-full border rounded-lg px-3 py-1.5 text-xs focus:outline-none resize-none ${
                                    isDarkTheme ? 'bg-[#181820] border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                                }`}
                            />
                        </div>
                    </div>

                    {/* Delete Action Button */}
                    <div className={`mt-auto pt-4 border-t ${isDarkTheme ? 'border-white/10' : 'border-slate-200'}`}>
                        <button
                            type="button"
                            onClick={() => activeBlock && handleDeleteBlock(activeBlock.id)}
                            className="w-full py-2 rounded-lg border border-rose-300 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors shadow-sm"
                        >
                            Xóa khối này
                        </button>
                    </div>
                </div>
            </div>

            {/* 3. BOTTOM BAR: CẤU TRÚC BÀI HỌC (BREADCRUMB / MINI-MAP) */}
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
                                    onClick={() => setSelectedBlockId(b.id)}
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
                        onClick={() => handleAddBlock('paragraph')}
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
        </div>,
        document.body
    );
};
