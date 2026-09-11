import React from 'react';
import type { LessonBlock } from '../types';

interface StudioBlockPropertiesProps {
    lessonIdCode: string;
    setLessonIdCode: (val: string) => void;
    difficulty: string;
    setDifficulty: (val: string) => void;
    durationMinutes: number;
    setDurationMinutes: (val: number) => void;
    objective: string;
    setObjective: (val: string) => void;
    activeBlock: LessonBlock | undefined;
    isDarkTheme: boolean;
    setIsSaved: (val: boolean) => void;
    onUpdateActiveBlock: (fields: Partial<LessonBlock>) => void;
    onDeleteBlock: (id: string) => void;
}

export const StudioBlockProperties: React.FC<StudioBlockPropertiesProps> = ({
    lessonIdCode,
    setLessonIdCode,
    difficulty,
    setDifficulty,
    durationMinutes,
    setDurationMinutes,
    objective,
    setObjective,
    activeBlock,
    isDarkTheme,
    setIsSaved,
    onUpdateActiveBlock,
    onDeleteBlock
}) => {
    return (
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
                            onChange={(e) => onUpdateActiveBlock({ language: e.target.value })}
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
                            onChange={(e) => onUpdateActiveBlock({ showLineNumbers: e.target.checked })}
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
                            onChange={(e) => onUpdateActiveBlock({ allowCopy: e.target.checked })}
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
                        onChange={(e) => onUpdateActiveBlock({ theme: e.target.value as any })}
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
                        onChange={(e) => onUpdateActiveBlock({ fontSize: e.target.value })}
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
                        onChange={(e) => onUpdateActiveBlock({ htmlId: e.target.value })}
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
                        onChange={(e) => onUpdateActiveBlock({ internalNote: e.target.value })}
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
                    onClick={() => activeBlock && onDeleteBlock(activeBlock.id)}
                    className="w-full py-2 rounded-lg border border-rose-300 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors shadow-sm"
                >
                    Xóa khối này
                </button>
            </div>
        </div>
    );
};
