import React from 'react';
import { Droppable, Draggable, type DroppableProvided, type DraggableProvided } from '@hello-pangea/dnd';
import { paletteCategories } from '../paletteConfig';
import type { BlockType, PaletteItem } from '../types';

interface StudioSidebarPaletteProps {
    searchBlockQuery: string;
    setSearchBlockQuery: (val: string) => void;
    isDarkTheme: boolean;
    onAddBlock: (type: BlockType) => void;
}

export const StudioSidebarPalette: React.FC<StudioSidebarPaletteProps> = ({
    searchBlockQuery,
    setSearchBlockQuery,
    isDarkTheme,
    onAddBlock
}) => {
    // Flatten palette items for search & draggable indexing
    let flattenedPaletteItems: PaletteItem[] = [];
    paletteCategories.forEach(cat => {
        cat.items.forEach(item => {
            if (!searchBlockQuery || item.label.toLowerCase().includes(searchBlockQuery.toLowerCase()) || item.type.toLowerCase().includes(searchBlockQuery.toLowerCase())) {
                flattenedPaletteItems.push(item);
            }
        });
    });

    return (
        <div className={`w-80 border-r p-4 flex flex-col gap-4 overflow-y-auto flex-shrink-0 ${
            isDarkTheme ? 'bg-[#121217] border-white/10' : 'bg-white border-slate-200'
        }`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <span className={`text-xs font-extrabold uppercase tracking-wider ${
                    isDarkTheme ? 'text-white' : 'text-slate-900'
                }`}>
                    THÊM KHỐI (KÉO THẢ)
                </span>
            </div>

            {/* Search Input with Icon (3px border radius) */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Tìm kiếm khối..."
                    value={searchBlockQuery}
                    onChange={(e) => setSearchBlockQuery(e.target.value)}
                    className={`w-full border rounded-[3px] pl-3 pr-9 py-2 text-xs focus:outline-none focus:border-purple-500 transition-colors shadow-sm ${
                        isDarkTheme
                            ? 'bg-[#181820] border-white/10 text-white placeholder-white/40'
                            : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                    }`}
                />
                <svg className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
            </div>

            {/* Droppable Palette for Drag-and-Drop */}
            <Droppable droppableId="sidebar-palette" isDropDisabled={true}>
                {(paletteProvided: DroppableProvided) => (
                    <div
                        ref={paletteProvided.innerRef}
                        {...paletteProvided.droppableProps}
                        className="space-y-4 text-left"
                    >
                        {paletteCategories.map((category, catIdx) => {
                            const filteredItems = category.items.filter(item =>
                                !searchBlockQuery ||
                                item.label.toLowerCase().includes(searchBlockQuery.toLowerCase()) ||
                                item.type.toLowerCase().includes(searchBlockQuery.toLowerCase())
                            );

                            if (filteredItems.length === 0) return null;

                            return (
                                <div key={catIdx} className="space-y-2">
                                    <span className={`text-[11px] font-extrabold uppercase tracking-wider block ${
                                        isDarkTheme ? 'text-white/60' : 'text-slate-800'
                                    }`}>
                                        {category.title}
                                    </span>

                                    <div className="grid grid-cols-3 gap-2">
                                        {filteredItems.map((item, itemIdx) => {
                                            const globalIndex = flattenedPaletteItems.findIndex(i => i.type === item.type && i.label === item.label);

                                            return (
                                                <Draggable
                                                    key={`${item.type}-${item.label}`}
                                                    draggableId={`sidebar-${item.type}`}
                                                    index={globalIndex >= 0 ? globalIndex : itemIdx}
                                                >
                                                    {(itemProvided: DraggableProvided) => (
                                                        <div
                                                            ref={itemProvided.innerRef}
                                                            {...itemProvided.draggableProps}
                                                            {...itemProvided.dragHandleProps}
                                                            onClick={() => onAddBlock(item.type)}
                                                            className={`p-2.5 border rounded-[3px] shadow-none flex flex-col items-center justify-center gap-1.5 cursor-grab active:cursor-grabbing select-none transition-colors ${
                                                                isDarkTheme
                                                                    ? 'bg-[#181820] hover:bg-purple-600/20 border-white/10 hover:border-purple-500 text-white'
                                                                    : 'bg-white hover:bg-purple-50/60 border-slate-200 hover:border-purple-400 text-slate-800 hover:text-purple-700'
                                                            }`}
                                                        >
                                                            <div className="w-6 h-6 flex items-center justify-center">
                                                                {item.icon}
                                                            </div>
                                                            <span className="text-[10px] font-semibold text-center leading-tight line-clamp-1">
                                                                {item.label}
                                                            </span>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                        {paletteProvided.placeholder}
                    </div>
                )}
            </Droppable>

            {/* Bottom Instruction Help Box (3px border radius) */}
            <div className="mt-auto pt-4 border-t border-slate-100">
                <div className={`border rounded-[3px] p-3 text-left space-y-1.5 shadow-none ${
                    isDarkTheme ? 'bg-[#181820] border-white/10' : 'bg-slate-50/90 border-slate-200/80'
                }`}>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <span className="text-purple-600 text-sm">⬡</span>
                        <span className={isDarkTheme ? 'text-white/80' : 'text-slate-700'}>
                            Kéo thả khối vào nội dung bài học
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <span className="text-purple-600 text-sm">👆</span>
                        <span className={isDarkTheme ? 'text-white/80' : 'text-slate-700'}>
                            Sắp xếp lại bằng cách kéo thả khối
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
