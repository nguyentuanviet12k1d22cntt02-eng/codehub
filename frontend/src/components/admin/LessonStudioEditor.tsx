import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { DragDropContext, type DropResult } from '@hello-pangea/dnd';

import type { BlockType, LessonBlock } from './studio/types';
import { createDefaultBlock, parseMarkdownToBlocks, convertBlocksToMarkdown } from './studio/utils';
import { StudioTopBar } from './studio/components/StudioTopBar';
import { StudioSidebarPalette } from './studio/components/StudioSidebarPalette';
import { StudioCanvas } from './studio/components/StudioCanvas';
import { StudioBlockProperties } from './studio/components/StudioBlockProperties';
import { StudioBottomMiniMap } from './studio/components/StudioBottomMiniMap';

export * from './studio/types';

interface LessonStudioEditorProps {
    lesson: any;
    onSave: (updatedLesson: any) => Promise<void>;
    onClose: () => void;
}

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

    // Delete block
    const handleDeleteBlock = (id: string) => {
        if (blocks.length <= 1) {
            alert('Bài học phải có ít nhất 1 khối nội dung.');
            return;
        }
        const newBlocks = blocks.filter(b => b.id !== id);
        updateBlocksWithHistory(newBlocks);
        setSelectedBlockId(newBlocks[0].id);
    };

    // Drag and drop handler (handles both sidebar -> canvas insertion & internal reordering)
    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        // 1. Drag from Sidebar Palette -> Center Canvas
        if (result.source.droppableId === 'sidebar-palette') {
            if (result.destination.droppableId === 'lesson-blocks-droppable') {
                const blockType = result.draggableId.replace('sidebar-', '') as BlockType;
                const newId = `block-${Date.now()}`;
                const newBlock = createDefaultBlock(blockType, newId);
                const newBlocks = [...blocks];
                newBlocks.splice(result.destination.index, 0, newBlock);
                updateBlocksWithHistory(newBlocks);
                setSelectedBlockId(newId);
            }
            return;
        }

        // 2. Reordering inside Center Canvas
        if (result.source.droppableId === 'lesson-blocks-droppable' && result.destination.droppableId === 'lesson-blocks-droppable') {
            const items = Array.from(blocks);
            const [reorderedItem] = items.splice(result.source.index, 1);
            items.splice(result.destination.index, 0, reorderedItem);
            updateBlocksWithHistory(items);
        }
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
        <DragDropContext onDragEnd={onDragEnd}>
            <div className={`fixed inset-0 top-0 left-0 w-screen h-screen z-[99999] flex flex-col font-sans select-none overflow-hidden transition-colors ${
                isDarkTheme ? 'bg-[#0c0c10] text-white' : 'bg-[#f8fafc] text-slate-900'
            }`}>
                {/* 1. TOP NAVIGATION BAR */}
                <StudioTopBar
                    title={title}
                    setTitle={setTitle}
                    isSaved={isSaved}
                    isSaving={isSaving}
                    isDarkTheme={isDarkTheme}
                    setIsDarkTheme={setIsDarkTheme}
                    historyIndex={historyIndex}
                    historyLength={history.length}
                    onUndo={handleUndo}
                    onRedo={handleRedo}
                    previewMode={previewMode}
                    setPreviewMode={setPreviewMode}
                    onSaveAll={handleSaveAll}
                    onClose={onClose}
                />

                {/* 2. 3-COLUMN MAIN WORKSPACE */}
                <div className="flex-1 flex overflow-hidden">
                    {/* 2.1 LEFT SIDEBAR: THÊM KHỐI (KÉO THẢ / CLICK) */}
                    <StudioSidebarPalette
                        searchBlockQuery={searchBlockQuery}
                        setSearchBlockQuery={setSearchBlockQuery}
                        isDarkTheme={isDarkTheme}
                        onAddBlock={handleAddBlock}
                    />

                    {/* 2.2 CENTER CANVAS: SOẠN THẢO TRỰC QUAN */}
                    <StudioCanvas
                        blocks={blocks}
                        selectedBlockId={selectedBlockId}
                        isDarkTheme={isDarkTheme}
                        insertMenuOpenIndex={insertMenuOpenIndex}
                        setInsertMenuOpenIndex={setInsertMenuOpenIndex}
                        onSelectBlock={setSelectedBlockId}
                        onDeleteBlock={handleDeleteBlock}
                        onUpdateActiveBlock={handleUpdateActiveBlock}
                        onInsertBlockAt={handleInsertBlockAt}
                    />

                    {/* 2.3 RIGHT SIDEBAR: CÀI ĐẶT KHỐI (BLOCK & LESSON PROPERTIES) */}
                    <StudioBlockProperties
                        lessonIdCode={lessonIdCode}
                        setLessonIdCode={setLessonIdCode}
                        difficulty={difficulty}
                        setDifficulty={setDifficulty}
                        durationMinutes={durationMinutes}
                        setDurationMinutes={setDurationMinutes}
                        objective={objective}
                        setObjective={setObjective}
                        activeBlock={activeBlock}
                        isDarkTheme={isDarkTheme}
                        setIsSaved={setIsSaved}
                        onUpdateActiveBlock={handleUpdateActiveBlock}
                        onDeleteBlock={handleDeleteBlock}
                    />
                </div>

                {/* 3. BOTTOM BAR: CẤU TRÚC BÀI HỌC (BREADCRUMB / MINI-MAP) */}
                <StudioBottomMiniMap
                    blocks={blocks}
                    selectedBlockId={selectedBlockId}
                    isDarkTheme={isDarkTheme}
                    onSelectBlock={setSelectedBlockId}
                    onAddBlock={handleAddBlock}
                />
            </div>
        </DragDropContext>,
        document.body
    );
};
