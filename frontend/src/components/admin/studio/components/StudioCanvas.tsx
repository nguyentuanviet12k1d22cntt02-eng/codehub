import React from 'react';
import { Droppable, Draggable, type DroppableProvided, type DraggableProvided } from '@hello-pangea/dnd';
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
    onInsertBlockAt
}) => {
    return (
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

                {/* Droppable Blocks Canvas */}
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
