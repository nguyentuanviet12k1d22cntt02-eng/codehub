import React from 'react';
import { Droppable, Draggable, type DroppableProvided, type DraggableProvided } from '@hello-pangea/dnd';
import { StudioFormattingToolbar } from './StudioFormattingToolbar';
import { StudioBlockCard } from './StudioBlockCard';
import { StudioInlineInsertBar } from './StudioInlineInsertBar';
import type { BlockType, LessonBlock } from '../types';

interface StudioCanvasProps {
    blocks: LessonBlock[];
    selectedBlockId: string;
    isDarkTheme: boolean;
    insertMenuOpenIndex: number | null;
    setInsertMenuOpenIndex: (index: number | null) => void;
    onSelectBlock: (id: string) => void;
    onDeleteBlock: (id: string) => void;
    onUpdateActiveBlock: (fields: Partial<LessonBlock>) => void;
    onInsertBlockAt: (type: BlockType, index: number) => void;
    onAddBlock: (type: BlockType) => void;
}

export const StudioCanvas: React.FC<StudioCanvasProps> = ({
    blocks,
    selectedBlockId,
    isDarkTheme,
    insertMenuOpenIndex,
    setInsertMenuOpenIndex,
    onSelectBlock,
    onDeleteBlock,
    onUpdateActiveBlock,
    onInsertBlockAt,
    onAddBlock
}) => {
    const activeBlock = blocks.find(b => b.id === selectedBlockId);

    const handleApplyFormat = (command: string, value?: string) => {
        if (command === 'code') {
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const selectedText = range.toString();
                if (selectedText) {
                    const codeNode = document.createElement('code');
                    codeNode.style.backgroundColor = 'rgba(147, 51, 234, 0.1)';
                    codeNode.style.color = '#7e22ce';
                    codeNode.style.padding = '2px 5px';
                    codeNode.style.borderRadius = '4px';
                    codeNode.style.fontFamily = 'monospace';
                    codeNode.textContent = selectedText;
                    range.deleteContents();
                    range.insertNode(codeNode);
                }
            }
            return;
        }

        document.execCommand(command, false, value);
    };

    const handleChangeHeadingLevel = (level: 'H1' | 'H2' | 'H3') => {
        if (activeBlock) {
            if (activeBlock.type === 'heading') {
                onUpdateActiveBlock({ headingLevel: level });
            } else {
                onUpdateActiveBlock({ type: 'heading', headingLevel: level, title: activeBlock.title || activeBlock.content });
            }
        }
    };

    const handleInsertBlockFromToolbar = (type: BlockType) => {
        const activeIndex = blocks.findIndex(b => b.id === selectedBlockId);
        if (activeIndex >= 0) {
            onInsertBlockAt(type, activeIndex);
        } else {
            onAddBlock(type);
        }
    };

    return (
        <div className={`flex-1 p-6 overflow-y-auto flex justify-center ${
            isDarkTheme ? 'bg-[#09090c]' : 'bg-[#f1f5f9]'
        }`}>
            <div className="w-full max-w-4xl space-y-4">
                {/* 1. TOP FUNCTIONAL FORMATTING TOOLBAR MATCHING SCREENSHOT */}
                <StudioFormattingToolbar
                    isDarkTheme={isDarkTheme}
                    activeHeadingLevel={activeBlock?.type === 'heading' ? (activeBlock.headingLevel || 'H2') : 'H2'}
                    onChangeHeadingLevel={handleChangeHeadingLevel}
                    onApplyFormat={handleApplyFormat}
                    onInsertBlock={handleInsertBlockFromToolbar}
                />

                {/* 2. DROPPABLE LESSON BLOCKS CANVAS */}
                <Droppable droppableId="lesson-blocks-droppable">
                    {(provided: DroppableProvided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-4 min-h-[300px]"
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
                                                <StudioBlockCard
                                                    block={block}
                                                    index={index}
                                                    isSelected={isSelected}
                                                    isDarkTheme={isDarkTheme}
                                                    providedDraggable={providedDraggable}
                                                    onSelect={() => onSelectBlock(block.id)}
                                                    onDelete={() => onDeleteBlock(block.id)}
                                                    onUpdateActiveBlock={onUpdateActiveBlock}
                                                />

                                                {/* Inline Insert Bar Directly Below This Block */}
                                                <StudioInlineInsertBar
                                                    index={index}
                                                    isOpen={insertMenuOpenIndex === index}
                                                    isDarkTheme={isDarkTheme}
                                                    onToggle={(e) => {
                                                        e.stopPropagation();
                                                        setInsertMenuOpenIndex(insertMenuOpenIndex === index ? null : index);
                                                    }}
                                                    onClose={() => setInsertMenuOpenIndex(null)}
                                                    onInsertBlockAt={onInsertBlockAt}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                );
                            })}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        </div>
    );
};
