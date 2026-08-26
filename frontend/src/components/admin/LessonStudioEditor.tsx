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

// Convert Markdown string to initial structured blocks
const parseMarkdownToBlocks = (markdown: string, lessonTitle: string): LessonBlock[] => {
    if (!markdown || markdown.trim() === '') {
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
    const lines = markdown.split('\n');
    let currentText: string[] = [];
    let inCode = false;
    let codeLang = 'Python';
    let codeLines: string[] = [];

    let blockCounter = 1;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.startsWith('```')) {
            if (!inCode) {
                // Flush text before code
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
            // Flush text before heading
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

        if (line.startsWith('> [!NOTE]') || line.startsWith('> [!TIP]') || line.startsWith('> [!WARNING]') || line.startsWith('> ')) {
            currentText.push(line);
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
            content: markdown
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

    // Add Block
    const handleAddBlock = (type: BlockType) => {
        const newId = `block-${Date.now()}`;
        let newBlock: LessonBlock = {
            id: newId,
            type,
            content: ''
        };

        switch (type) {
            case 'heading':
                newBlock = {
                    id: newId,
                    type: 'heading',
                    headingLevel: 'H2',
                    title: 'Tiêu đề mục mới',
                    content: 'Nội dung giải thích chi tiết cho mục này...'
                };
                break;
            case 'paragraph':
                newBlock = {
                    id: newId,
                    type: 'paragraph',
                    content: 'Nhập nội dung đoạn văn lý thuyết tại đây...'
                };
                break;
            case 'code':
                newBlock = {
                    id: newId,
                    type: 'code',
                    language: 'SQL',
                    showLineNumbers: true,
                    allowCopy: true,
                    theme: 'Dark',
                    fontSize: '14px',
                    content: 'SELECT id, name, age\nFROM students\nWHERE age > 18\nORDER BY age ASC;'
                };
                break;
            case 'output':
            case 'table':
                newBlock = {
                    id: newId,
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
                break;
            case 'explanation':
            case 'callout':
                newBlock = {
                    id: newId,
                    type: 'explanation',
                    title: 'Giải thích',
                    calloutType: 'explanation',
                    content: '• SELECT: chọn các cột cần hiển thị.\n• FROM: chỉ định bảng dữ liệu.\n• WHERE: điều kiện lọc dữ liệu.\n• ORDER BY: sắp xếp kết quả.'
                };
                break;
            case 'exercise':
                newBlock = {
                    id: newId,
                    type: 'exercise',
                    title: 'Bài tập 1',
                    content: 'Viết câu lệnh SQL để lấy ra danh sách sinh viên có tuổi lớn hơn 20, hiển thị các cột: id, name, age và sắp xếp theo age giảm dần.',
                    solutionCode: 'SELECT id, name, age\nFROM students\nWHERE age > 20\nORDER BY age DESC;',
                    isSolutionVisible: false
                };
                break;
            case 'divider':
                newBlock = {
                    id: newId,
                    type: 'divider',
                    content: '---'
                };
                break;
            default:
                newBlock = {
                    id: newId,
                    type,
                    content: 'Nội dung khối mới...'
                };
        }

        const newBlocks = [...blocks, newBlock];
        updateBlocksWithHistory(newBlocks);
        setSelectedBlockId(newId);
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
        <div className="fixed inset-0 top-0 left-0 w-screen h-screen z-[99999] bg-[#0c0c10] text-white flex flex-col font-sans select-none overflow-hidden">
            {/* TOP NAVIGATION BAR */}
            <div className="h-16 bg-[#121217] border-b border-white/10 px-6 flex items-center justify-between flex-shrink-0 z-20">
                {/* Left Brand & Breadcrumb */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={onClose}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-white/80"
                    >
                        &larr; Quay lại danh sách
                    </button>
                    <div className="h-4 w-[1px] bg-white/10" />
                    <span className="text-xs text-white/50 font-medium">Nền tảng học lập trình / Admin / Soạn bài học</span>
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
                        className="bg-white/5 hover:bg-white/10 focus:bg-[#181820] border border-white/10 focus:border-purple-500 rounded-lg px-3 py-1.5 text-xs md:text-sm font-bold text-white text-center w-full focus:outline-none transition-all"
                        placeholder="Nhập tiêu đề bài học..."
                    />
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    {/* Status badge */}
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        {isSaved ? 'Đã lưu' : 'Có thay đổi chưa lưu'}
                    </div>

                    {/* Undo / Redo */}
                    <div className="flex items-center bg-white/5 rounded-lg border border-white/10 p-0.5">
                        <button
                            onClick={handleUndo}
                            disabled={historyIndex === 0}
                            className="px-2 py-1 text-xs text-white/70 hover:text-white disabled:opacity-30"
                            title="Hoàn tác (Undo)"
                        >
                            ↺
                        </button>
                        <button
                            onClick={handleRedo}
                            disabled={historyIndex >= history.length - 1}
                            className="px-2 py-1 text-xs text-white/70 hover:text-white disabled:opacity-30"
                            title="Làm lại (Redo)"
                        >
                            ↻
                        </button>
                    </div>

                    {/* Preview Button */}
                    <button
                        onClick={() => setPreviewMode(!previewMode)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                            previewMode ? 'bg-purple-600 text-white border-purple-500' : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10'
                        }`}
                    >
                        {previewMode ? 'Sửa bài' : 'Xem thử'}
                    </button>

                    {/* Save Draft */}
                    <button
                        onClick={handleSaveAll}
                        disabled={isSaving}
                        className="text-xs font-semibold px-3.5 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-colors"
                    >
                        Lưu nháp
                    </button>

                    {/* Publish CTA */}
                    <button
                        onClick={handleSaveAll}
                        disabled={isSaving}
                        className="text-xs font-bold px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/20 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isSaving ? 'Đang lưu...' : 'Xuất bản'}
                    </button>
                </div>
            </div>

            {/* 3-COLUMN MAIN WORKSPACE */}
            <div className="flex-1 flex overflow-hidden">
                {/* 1. LEFT SIDEBAR: THÊM KHỐI (KÉO THẢ / CLICK) */}
                <div className="w-64 bg-[#121217] border-r border-white/10 p-4 flex flex-col gap-4 overflow-y-auto flex-shrink-0">
                    {/* Search */}
                    <div>
                        <input
                            type="text"
                            placeholder="Tìm kiếm khối..."
                            value={searchBlockQuery}
                            onChange={(e) => setSearchBlockQuery(e.target.value)}
                            className="w-full bg-[#181820] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                        />
                    </div>

                    {/* Groups */}
                    <div className="space-y-4 text-left">
                        {/* Group 1: CƠ BẢN */}
                        <div>
                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider block mb-2">
                                Cơ bản
                            </span>
                            <div className="grid grid-cols-3 gap-1.5">
                                <button
                                    onClick={() => handleAddBlock('heading')}
                                    className="p-2 bg-[#181820] hover:bg-purple-600/20 hover:border-purple-500/40 border border-white/5 rounded-lg flex flex-col items-center gap-1 transition-all"
                                >
                                    <span className="font-bold text-sm text-purple-400">H</span>
                                    <span className="text-[10px] text-white/80">Tiêu đề</span>
                                </button>
                                <button
                                    onClick={() => handleAddBlock('paragraph')}
                                    className="p-2 bg-[#181820] hover:bg-purple-600/20 hover:border-purple-500/40 border border-white/5 rounded-lg flex flex-col items-center gap-1 transition-all"
                                >
                                    <span className="font-bold text-sm text-purple-400">¶</span>
                                    <span className="text-[10px] text-white/80">Đoạn văn</span>
                                </button>
                                <button
                                    onClick={() => handleAddBlock('list')}
                                    className="p-2 bg-[#181820] hover:bg-purple-600/20 hover:border-purple-500/40 border border-white/5 rounded-lg flex flex-col items-center gap-1 transition-all"
                                >
                                    <span className="font-bold text-sm text-purple-400">≡</span>
                                    <span className="text-[10px] text-white/80">Danh sách</span>
                                </button>
                                <button
                                    onClick={() => handleAddBlock('callout')}
                                    className="p-2 bg-[#181820] hover:bg-purple-600/20 hover:border-purple-500/40 border border-white/5 rounded-lg flex flex-col items-center gap-1 transition-all"
                                >
                                    <span className="font-bold text-sm text-amber-400">💡</span>
                                    <span className="text-[10px] text-white/80">Callout</span>
                                </button>
                                <button
                                    onClick={() => handleAddBlock('note')}
                                    className="p-2 bg-[#181820] hover:bg-purple-600/20 hover:border-purple-500/40 border border-white/5 rounded-lg flex flex-col items-center gap-1 transition-all"
                                >
                                    <span className="font-bold text-sm text-sky-400">📝</span>
                                    <span className="text-[10px] text-white/80">Ghi chú</span>
                                </button>
                                <button
                                    onClick={() => handleAddBlock('divider')}
                                    className="p-2 bg-[#181820] hover:bg-purple-600/20 hover:border-purple-500/40 border border-white/5 rounded-lg flex flex-col items-center gap-1 transition-all"
                                >
                                    <span className="font-bold text-sm text-white/60">—</span>
                                    <span className="text-[10px] text-white/80">Đường kẻ</span>
                                </button>
                            </div>
                        </div>

                        {/* Group 2: NỘI DUNG LẬP TRÌNH */}
                        <div>
                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider block mb-2">
                                Nội dung lập trình
                            </span>
                            <div className="grid grid-cols-3 gap-1.5">
                                <button
                                    onClick={() => handleAddBlock('code')}
                                    className="p-2 bg-[#181820] hover:bg-purple-600/20 hover:border-purple-500/40 border border-white/5 rounded-lg flex flex-col items-center gap-1 transition-all"
                                >
                                    <span className="font-mono font-bold text-xs text-purple-400">&lt;/&gt;</span>
                                    <span className="text-[10px] text-white/80">Khối mã</span>
                                </button>
                                <button
                                    onClick={() => handleAddBlock('output')}
                                    className="p-2 bg-[#181820] hover:bg-purple-600/20 hover:border-purple-500/40 border border-white/5 rounded-lg flex flex-col items-center gap-1 transition-all"
                                >
                                    <span className="font-bold text-xs text-sky-400">▶</span>
                                    <span className="text-[10px] text-white/80">Kết quả</span>
                                </button>
                                <button
                                    onClick={() => handleAddBlock('explanation')}
                                    className="p-2 bg-[#181820] hover:bg-purple-600/20 hover:border-purple-500/40 border border-white/5 rounded-lg flex flex-col items-center gap-1 transition-all"
                                >
                                    <span className="font-bold text-xs text-amber-400">ℹ</span>
                                    <span className="text-[10px] text-white/80">Giải thích</span>
                                </button>
                                <button
                                    onClick={() => handleAddBlock('exercise')}
                                    className="p-2 bg-[#181820] hover:bg-purple-600/20 hover:border-purple-500/40 border border-white/5 rounded-lg flex flex-col items-center gap-1 transition-all"
                                >
                                    <span className="font-bold text-xs text-emerald-400">✎</span>
                                    <span className="text-[10px] text-white/80">Bài tập</span>
                                </button>
                                <button
                                    onClick={() => handleAddBlock('quiz')}
                                    className="p-2 bg-[#181820] hover:bg-purple-600/20 hover:border-purple-500/40 border border-white/5 rounded-lg flex flex-col items-center gap-1 transition-all"
                                >
                                    <span className="font-bold text-xs text-rose-400">?</span>
                                    <span className="text-[10px] text-white/80">Quiz</span>
                                </button>
                                <button
                                    onClick={() => handleAddBlock('theory')}
                                    className="p-2 bg-[#181820] hover:bg-purple-600/20 hover:border-purple-500/40 border border-white/5 rounded-lg flex flex-col items-center gap-1 transition-all"
                                >
                                    <span className="font-bold text-xs text-indigo-400">📖</span>
                                    <span className="text-[10px] text-white/80">Lý thuyết</span>
                                </button>
                            </div>
                        </div>

                        {/* Group 3: DỮ LIỆU & SQL */}
                        <div>
                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider block mb-2">
                                Dữ liệu & SQL
                            </span>
                            <div className="grid grid-cols-3 gap-1.5">
                                <button
                                    onClick={() => handleAddBlock('table')}
                                    className="p-2 bg-[#181820] hover:bg-purple-600/20 hover:border-purple-500/40 border border-white/5 rounded-lg flex flex-col items-center gap-1 transition-all"
                                >
                                    <span className="font-bold text-xs text-purple-400">▦</span>
                                    <span className="text-[10px] text-white/80">Bảng</span>
                                </button>
                                <button
                                    onClick={() => handleAddBlock('erd')}
                                    className="p-2 bg-[#181820] hover:bg-purple-600/20 hover:border-purple-500/40 border border-white/5 rounded-lg flex flex-col items-center gap-1 transition-all"
                                >
                                    <span className="font-bold text-xs text-indigo-400">☍</span>
                                    <span className="text-[10px] text-white/80">Sơ đồ ERD</span>
                                </button>
                                <button
                                    onClick={() => handleAddBlock('output')}
                                    className="p-2 bg-[#181820] hover:bg-purple-600/20 hover:border-purple-500/40 border border-white/5 rounded-lg flex flex-col items-center gap-1 transition-all"
                                >
                                    <span className="font-bold text-xs text-emerald-400">🗄</span>
                                    <span className="text-[10px] text-white/80">Kết quả SQL</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tip at bottom */}
                    <div className="mt-auto pt-4 border-t border-white/5 text-[11px] text-white/40 leading-relaxed">
                        Bấm vào khối để thêm hoặc kéo thả để đổi thứ tự trực quan.
                    </div>
                </div>

                {/* 2. CENTER CANVAS: SOẠN THẢO TRỰC QUAN */}
                <div className="flex-1 bg-[#09090c] p-6 overflow-y-auto flex justify-center">
                    <div className="w-full max-w-4xl space-y-4">
                        {/* Top Formatting Ribbon */}
                        <div className="bg-[#121217] border border-white/10 rounded-xl p-2 flex items-center justify-between select-none shadow-sm">
                            <div className="flex items-center gap-1.5 text-xs text-white/70">
                                <span className="font-semibold px-2 py-1 bg-white/5 rounded">H2 ▾</span>
                                <div className="h-4 w-[1px] bg-white/10" />
                                <span className="font-bold px-2 py-0.5 hover:bg-white/10 rounded cursor-pointer">B</span>
                                <span className="italic font-serif px-2 py-0.5 hover:bg-white/10 rounded cursor-pointer">I</span>
                                <span className="underline px-2 py-0.5 hover:bg-white/10 rounded cursor-pointer">U</span>
                                <span className="line-through px-2 py-0.5 hover:bg-white/10 rounded cursor-pointer">S</span>
                                <div className="h-4 w-[1px] bg-white/10" />
                                <span className="font-mono text-xs px-2 py-0.5 hover:bg-white/10 rounded cursor-pointer">&lt;/&gt;</span>
                                <span className="px-2 py-0.5 hover:bg-white/10 rounded cursor-pointer">🔗</span>
                                <span className="px-2 py-0.5 hover:bg-white/10 rounded cursor-pointer">🖼️</span>
                                <span className="px-2 py-0.5 hover:bg-white/10 rounded cursor-pointer">▦</span>
                            </div>
                            <span className="text-[11px] text-white/40">Studio Block Editor</span>
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
                                                            onClick={() => setSelectedBlockId(block.id)}
                                                            className={`bg-[#121217] rounded-2xl border transition-all relative overflow-hidden group ${
                                                                isSelected
                                                                    ? 'border-purple-500 shadow-xl shadow-purple-500/5 ring-1 ring-purple-500/50'
                                                                    : 'border-white/10 hover:border-white/20'
                                                            }`}
                                                        >
                                                            {/* Top Block Header bar */}
                                                            <div className="px-4 py-2.5 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
                                                                {/* Drag Handle */}
                                                                <div
                                                                    {...providedDraggable.dragHandleProps}
                                                                    className="cursor-grab active:cursor-grabbing text-white/40 hover:text-white flex items-center gap-2"
                                                                >
                                                                    <span className="font-mono text-xs tracking-tighter">:::</span>
                                                                    <span className="text-[11px] font-semibold text-white/60">
                                                                        Khối #{index + 1}
                                                                    </span>
                                                                </div>

                                                                {/* Block Type Badge */}
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                                                        block.type === 'heading' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                                                                        block.type === 'code' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                                        block.type === 'output' || block.type === 'table' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' :
                                                                        block.type === 'exercise' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                                                                        'bg-amber-500/10 text-amber-400 border border-amber-500/20'
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
                                                                        className="text-white/30 hover:text-rose-400 text-xs px-1.5 py-0.5 rounded transition-colors"
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
                                                                            className="w-full bg-transparent text-lg md:text-xl font-extrabold text-white border-none focus:outline-none placeholder-white/30"
                                                                            placeholder="1. SELECT và FROM là gì?"
                                                                        />
                                                                        <textarea
                                                                            rows={2}
                                                                            value={block.content || ''}
                                                                            onChange={(e) => handleUpdateActiveBlock({ content: e.target.value })}
                                                                            className="w-full bg-transparent text-xs text-white/70 leading-relaxed border-none focus:outline-none resize-none placeholder-white/30"
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
                                                                        className="w-full bg-transparent text-xs text-white/80 leading-relaxed border-none focus:outline-none resize-y placeholder-white/30"
                                                                        placeholder="Nhập đoạn văn lý thuyết..."
                                                                    />
                                                                )}

                                                                {/* 3. CODE BLOCK */}
                                                                {block.type === 'code' && (
                                                                    <div className="bg-[#0e0e13] rounded-xl border border-white/10 p-4 font-mono text-xs text-emerald-400 overflow-x-auto relative">
                                                                        <div className="flex justify-between items-center text-[10px] text-white/40 mb-2 border-b border-white/5 pb-1">
                                                                            <span>{block.language || 'SQL'}</span>
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
                                                                            <div className="text-xs font-bold text-white/80">
                                                                                {block.title}
                                                                            </div>
                                                                        )}

                                                                        <div className="overflow-x-auto rounded-xl border border-white/10">
                                                                            <table className="w-full text-left text-xs border-collapse">
                                                                                <thead>
                                                                                    <tr className="bg-white/5 border-b border-white/10 text-white font-bold">
                                                                                        {block.tableHeaders?.map((th, thIdx) => (
                                                                                            <th key={thIdx} className="p-3 border-r border-white/10 last:border-r-0">
                                                                                                <input
                                                                                                    type="text"
                                                                                                    value={th}
                                                                                                    onChange={(e) => {
                                                                                                        const newHeaders = [...(block.tableHeaders || [])];
                                                                                                        newHeaders[thIdx] = e.target.value;
                                                                                                        handleUpdateActiveBlock({ tableHeaders: newHeaders });
                                                                                                    }}
                                                                                                    className="bg-transparent font-bold text-white text-center w-full focus:outline-none"
                                                                                                />
                                                                                            </th>
                                                                                        ))}
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody className="divide-y divide-white/5 text-white/80">
                                                                                    {block.tableRows?.map((row, rIdx) => (
                                                                                        <tr key={rIdx} className="hover:bg-white/[0.02]">
                                                                                            {row.map((cell, cIdx) => (
                                                                                                <td key={cIdx} className="p-3 border-r border-white/10 last:border-r-0">
                                                                                                    <input
                                                                                                        type="text"
                                                                                                        value={cell}
                                                                                                        onChange={(e) => {
                                                                                                            const newRows = [...(block.tableRows || [])];
                                                                                                            newRows[rIdx][cIdx] = e.target.value;
                                                                                                            handleUpdateActiveBlock({ tableRows: newRows });
                                                                                                        }}
                                                                                                        className="bg-transparent text-white/80 text-center w-full focus:outline-none"
                                                                                                    />
                                                                                                </td>
                                                                                            ))}
                                                                                        </tr>
                                                                                    ))}
                                                                                </tbody>
                                                                            </table>
                                                                        </div>

                                                                        <div className="flex justify-between items-center text-[11px] text-white/50 pt-1">
                                                                            <input
                                                                                type="text"
                                                                                value={block.tableNote || ''}
                                                                                onChange={(e) => handleUpdateActiveBlock({ tableNote: e.target.value })}
                                                                                className="bg-transparent text-white/40 text-xs italic focus:outline-none w-2/3"
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
                                                                                className="text-purple-400 hover:underline text-xs font-semibold"
                                                                            >
                                                                                + Thêm dòng
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* 5. EXPLANATION / CALLOUT BLOCK */}
                                                                {(block.type === 'explanation' || block.type === 'callout' || block.type === 'note') && (
                                                                    <div className="bg-amber-500/[0.04] border border-amber-500/20 rounded-xl p-4 space-y-2">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-amber-400 font-bold">💡</span>
                                                                            <input
                                                                                type="text"
                                                                                value={block.title || 'Giải thích'}
                                                                                onChange={(e) => handleUpdateActiveBlock({ title: e.target.value })}
                                                                                className="bg-transparent font-bold text-xs text-amber-300 focus:outline-none w-full"
                                                                            />
                                                                        </div>
                                                                        <textarea
                                                                            rows={4}
                                                                            value={block.content || ''}
                                                                            onChange={(e) => handleUpdateActiveBlock({ content: e.target.value })}
                                                                            className="w-full bg-transparent text-xs text-white/80 leading-relaxed border-none focus:outline-none resize-none"
                                                                            placeholder="• Ý 1\n• Ý 2..."
                                                                        />
                                                                    </div>
                                                                )}

                                                                {/* 6. EXERCISE BLOCK */}
                                                                {block.type === 'exercise' && (
                                                                    <div className="bg-indigo-500/[0.04] border border-indigo-500/20 rounded-xl p-4 space-y-3">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-indigo-400 font-bold">✎</span>
                                                                            <input
                                                                                type="text"
                                                                                value={block.title || 'Bài tập 1'}
                                                                                onChange={(e) => handleUpdateActiveBlock({ title: e.target.value })}
                                                                                className="bg-transparent font-bold text-xs text-indigo-300 focus:outline-none w-full"
                                                                            />
                                                                        </div>
                                                                        <textarea
                                                                            rows={2}
                                                                            value={block.content || ''}
                                                                            onChange={(e) => handleUpdateActiveBlock({ content: e.target.value })}
                                                                            className="w-full bg-transparent text-xs text-white/80 leading-relaxed border-none focus:outline-none resize-none"
                                                                            placeholder="Mô tả yêu cầu bài tập..."
                                                                        />

                                                                        <div className="pt-2 border-t border-indigo-500/10 space-y-2">
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => handleUpdateActiveBlock({ isSolutionVisible: !block.isSolutionVisible })}
                                                                                className="text-xs text-indigo-400 font-bold hover:underline flex items-center gap-1.5"
                                                                            >
                                                                                <span>👁</span>
                                                                                <span>{block.isSolutionVisible ? 'Ẩn đáp án' : 'Xem đáp án'}</span>
                                                                            </button>

                                                                            {block.isSolutionVisible && (
                                                                                <textarea
                                                                                    rows={3}
                                                                                    value={block.solutionCode || ''}
                                                                                    onChange={(e) => handleUpdateActiveBlock({ solutionCode: e.target.value })}
                                                                                    className="w-full bg-[#0a0a0f] p-3 rounded-lg font-mono text-xs text-emerald-400 border border-white/10 focus:outline-none"
                                                                                    placeholder="Mã giải mẫu..."
                                                                                />
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* 7. DIVIDER */}
                                                                {block.type === 'divider' && (
                                                                    <div className="py-2">
                                                                        <hr className="border-white/10" />
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
                <div className="w-72 bg-[#121217] border-l border-white/10 p-5 flex flex-col gap-5 overflow-y-auto flex-shrink-0 text-left">
                    {/* General Lesson Properties */}
                    <div className="space-y-3 pb-4 border-b border-white/5">
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider block">
                            Thông tin bài học
                        </span>
                        <div>
                            <label className="block text-[11px] text-white/50 mb-1">Mã bài (Lesson ID)</label>
                            <input
                                type="text"
                                value={lessonIdCode}
                                onChange={(e) => { setLessonIdCode(e.target.value); setIsSaved(false); }}
                                className="w-full bg-[#181820] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none"
                                placeholder="LS-01.01"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-[11px] text-white/50 mb-1">Độ khó</label>
                                <select
                                    value={difficulty}
                                    onChange={(e) => { setDifficulty(e.target.value); setIsSaved(false); }}
                                    className="w-full bg-[#181820] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none"
                                >
                                    <option value="EASY">Dễ</option>
                                    <option value="MEDIUM">Vừa</option>
                                    <option value="HARD">Khó</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[11px] text-white/50 mb-1">Thời lượng</label>
                                <input
                                    type="number"
                                    value={durationMinutes}
                                    onChange={(e) => { setDurationMinutes(Number(e.target.value)); setIsSaved(false); }}
                                    className="w-full bg-[#181820] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[11px] text-white/50 mb-1">Mục tiêu bài học</label>
                            <textarea
                                rows={2}
                                value={objective}
                                onChange={(e) => { setObjective(e.target.value); setIsSaved(false); }}
                                className="w-full bg-[#181820] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none resize-none"
                                placeholder="Mục tiêu bài học..."
                            />
                        </div>
                    </div>

                    <div>
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider block mb-1">
                            CÀI ĐẶT KHỐI
                        </span>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <span>{activeBlock?.type === 'code' ? '</> Khối mã' : activeBlock?.type === 'heading' ? 'H Tiêu đề' : activeBlock?.type}</span>
                            {activeBlock?.language && <span className="text-xs text-purple-400">({activeBlock.language})</span>}
                        </h4>
                    </div>

                    {/* Dynamic settings based on block type */}
                    {activeBlock?.type === 'code' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-white/70 mb-1.5">Ngôn ngữ</label>
                                <select
                                    value={activeBlock.language || 'SQL'}
                                    onChange={(e) => handleUpdateActiveBlock({ language: e.target.value })}
                                    className="w-full bg-[#181820] border border-white/10 rounded-lg px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-purple-500"
                                >
                                    <option value="SQL">SQL</option>
                                    <option value="Python">Python</option>
                                    <option value="JavaScript">JavaScript</option>
                                    <option value="HTML">HTML / CSS</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-xs text-white/80">Hiển thị số dòng</span>
                                <input
                                    type="checkbox"
                                    checked={activeBlock.showLineNumbers ?? true}
                                    onChange={(e) => handleUpdateActiveBlock({ showLineNumbers: e.target.checked })}
                                    className="accent-purple-500 cursor-pointer w-4 h-4"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-xs text-white/80">Cho phép copy code</span>
                                <input
                                    type="checkbox"
                                    checked={activeBlock.allowCopy ?? true}
                                    onChange={(e) => handleUpdateActiveBlock({ allowCopy: e.target.checked })}
                                    className="accent-purple-500 cursor-pointer w-4 h-4"
                                />
                            </div>
                        </div>
                    )}

                    {/* Common Appearance Settings */}
                    <div className="space-y-3 pt-3 border-t border-white/5">
                        <span className="text-xs font-bold text-white/60 block">Giao diện</span>
                        <div>
                            <label className="block text-[11px] text-white/50 mb-1">Chủ đề</label>
                            <select
                                value={activeBlock?.theme || 'Dark'}
                                onChange={(e) => handleUpdateActiveBlock({ theme: e.target.value as any })}
                                className="w-full bg-[#181820] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                            >
                                <option value="Dark">Dark</option>
                                <option value="Light">Light</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[11px] text-white/50 mb-1">Kích thước chữ</label>
                            <select
                                value={activeBlock?.fontSize || '14px'}
                                onChange={(e) => handleUpdateActiveBlock({ fontSize: e.target.value })}
                                className="w-full bg-[#181820] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                            >
                                <option value="12px">12px (Nhỏ)</option>
                                <option value="14px">14px (Chuẩn)</option>
                                <option value="16px">16px (Lớn)</option>
                            </select>
                        </div>
                    </div>

                    {/* Advanced Settings */}
                    <div className="space-y-3 pt-3 border-t border-white/5">
                        <span className="text-xs font-bold text-white/60 block">Nâng cao</span>
                        <div>
                            <label className="block text-[11px] text-white/50 mb-1">ID (HTML)</label>
                            <input
                                type="text"
                                value={activeBlock?.htmlId || ''}
                                onChange={(e) => handleUpdateActiveBlock({ htmlId: e.target.value })}
                                placeholder={`block-${activeBlock?.id || 'id'}`}
                                className="w-full bg-[#181820] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] text-white/50 mb-1">Ghi chú nội bộ</label>
                            <textarea
                                rows={2}
                                value={activeBlock?.internalNote || ''}
                                onChange={(e) => handleUpdateActiveBlock({ internalNote: e.target.value })}
                                placeholder="Ghi chú thêm cho khối..."
                                className="w-full bg-[#181820] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none resize-none"
                            />
                        </div>
                    </div>

                    {/* Delete Action Button */}
                    <div className="mt-auto pt-4 border-t border-white/10">
                        <button
                            type="button"
                            onClick={() => activeBlock && handleDeleteBlock(activeBlock.id)}
                            className="w-full py-2 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-bold transition-colors"
                        >
                            Xóa khối này
                        </button>
                    </div>
                </div>
            </div>

            {/* 4. BOTTOM BAR: CẤU TRÚC BÀI HỌC (BREADCRUMB / MINI-MAP) */}
            <div className="h-14 bg-[#121217] border-t border-white/10 px-6 flex items-center justify-between text-xs flex-shrink-0 z-20">
                <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-5xl">
                    <span className="text-[11px] font-bold text-white/50 uppercase tracking-wider whitespace-nowrap mr-2">
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
                                            ? 'bg-purple-600 text-white shadow-sm'
                                            : 'bg-white/5 hover:bg-white/10 text-white/70'
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
                                    <span className="text-white/30 text-[11px]">&gt;</span>
                                )}
                            </React.Fragment>
                        );
                    })}

                    <button
                        onClick={() => handleAddBlock('paragraph')}
                        className="px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/30 transition-all ml-2"
                    >
                        + Thêm khối
                    </button>
                </div>

                <div className="text-xs text-white/40 whitespace-nowrap hidden lg:block">
                    Tổng cộng: <strong className="text-white">{blocks.length}</strong> khối nội dung
                </div>
            </div>
        </div>,
        document.body
    );
};
