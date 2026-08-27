import React from 'react';
import { Droppable, Draggable, type DroppableProvided, type DraggableProvided } from '@hello-pangea/dnd';
import { StudioFormattingToolbar } from './StudioFormattingToolbar';
import { StudioBlockCard } from './StudioBlockCard';
import type { BlockType, LessonBlock } from '../types';

interface StudioCanvasProps {
    blocks: LessonBlock[];
    selectedBlockId: string;
    isDarkTheme: boolean;
    insertMenuOpenIndex?: number | null;
    setInsertMenuOpenIndex?: (index: number | null) => void;
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
    onSelectBlock,
    onDeleteBlock,
    onUpdateActiveBlock,
    onInsertBlockAt,
    onAddBlock
}) => {
    const activeBlock = blocks.find(b => b.id === selectedBlockId);

    const handleApplyFormat = (command: string, value?: string) => {
        if (command === 'fontSize') {
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                if (!range.collapsed) {
                    let container: Node | null = range.commonAncestorContainer;
                    if (container && container.nodeType === Node.TEXT_NODE) {
                        container = container.parentElement;
                    }
                    const activeEditable = (container as HTMLElement)?.closest('[contenteditable="true"]') as HTMLElement;
                    if (activeEditable) {
                        const span = document.createElement('span');
                        span.style.fontSize = value || '16px';
                        try {
                            span.appendChild(range.extractContents());
                            range.insertNode(span);
                            selection.removeAllRanges();
                            const newRange = document.createRange();
                            newRange.selectNodeContents(span);
                            selection.addRange(newRange);
                        } catch (err) {
                            console.error('Error applying font size:', err);
                        }
                        activeEditable.dispatchEvent(new Event('input', { bubbles: true }));
                        return;
                    }
                }
            }
            return;
        }

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

        if (command === 'justifyLeft' || command === 'justifyCenter' || command === 'justifyRight') {
            const selection = window.getSelection();
            if (selection && selection.anchorNode) {
                let targetEl = selection.anchorNode as HTMLElement;
                if (targetEl.nodeType === Node.TEXT_NODE) {
                    targetEl = targetEl.parentElement as HTMLElement;
                }
                const alignTarget = targetEl?.closest('[contenteditable="true"]') as HTMLElement;
                if (alignTarget) {
                    const alignValue = command === 'justifyCenter' ? 'center' : command === 'justifyRight' ? 'right' : 'left';
                    const innerAlignDiv = targetEl.closest('div[align], div[style*="text-align"]') as HTMLElement;

                    if (innerAlignDiv && alignTarget.contains(innerAlignDiv)) {
                        if (alignValue === 'left') {
                            innerAlignDiv.removeAttribute('align');
                            innerAlignDiv.style.textAlign = '';
                        } else {
                            innerAlignDiv.setAttribute('align', alignValue);
                        }
                    } else if (alignValue !== 'left') {
                        document.execCommand(command, false, value);
                    } else {
                        document.execCommand('justifyLeft', false, value);
                    }

                    alignTarget.dispatchEvent(new Event('input', { bubbles: true }));
                    return;
                }
            }
        }

        document.execCommand(command, false, value);

        // Immediately notify active contenteditable
        const sel = window.getSelection();
        if (sel && sel.anchorNode) {
            let tEl = sel.anchorNode as HTMLElement;
            if (tEl.nodeType === Node.TEXT_NODE) {
                tEl = tEl.parentElement as HTMLElement;
            }
            const activeEditable = tEl?.closest('[contenteditable="true"]') as HTMLElement;
            if (activeEditable) {
                activeEditable.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }
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
        <div className={`flex-1 flex flex-col overflow-hidden ${
            isDarkTheme ? 'bg-[#09090c]' : 'bg-[#f1f5f9]'
        }`}>
            {/* 1. STICKY TOP TOOLBAR: CỐ ĐỊNH KHI CUỘN NỘI DUNG */}
            <div className={`px-6 py-2.5 border-b flex justify-center flex-shrink-0 z-30 shadow-sm backdrop-blur-md ${
                isDarkTheme ? 'bg-[#121217]/95 border-white/10' : 'bg-white/95 border-slate-200'
            }`}>
                <div className="w-full max-w-4xl">
                    <StudioFormattingToolbar
                        isDarkTheme={isDarkTheme}
                        activeHeadingLevel={activeBlock?.type === 'heading' ? (activeBlock.headingLevel || 'H2') : 'H2'}
                        onChangeHeadingLevel={handleChangeHeadingLevel}
                        onApplyFormat={handleApplyFormat}
                        onInsertBlock={handleInsertBlockFromToolbar}
                    />
                </div>
            </div>

            {/* 2. SCROLLABLE LESSON BLOCKS CANVAS */}
            <div className="flex-1 p-6 overflow-y-auto flex justify-center">
                <div className="w-full max-w-4xl">
                    <Droppable droppableId="lesson-blocks-droppable">
                        {(provided: DroppableProvided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="space-y-[3px] min-h-[300px]"
                            >
                                {blocks.map((block, index) => {
                                    const isSelected = selectedBlockId === block.id;

                                    return (
                                        <Draggable key={block.id} draggableId={block.id} index={index}>
                                            {(providedDraggable: DraggableProvided) => (
                                                <div
                                                    ref={providedDraggable.innerRef}
                                                    {...providedDraggable.draggableProps}
                                                    className="relative"
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
        </div>
    );
};
