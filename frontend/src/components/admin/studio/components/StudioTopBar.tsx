import React from 'react';

interface StudioTopBarProps {
    title: string;
    setTitle: (title: string) => void;
    isSaved: boolean;
    isSaving: boolean;
    isDarkTheme: boolean;
    setIsDarkTheme: (val: boolean) => void;
    historyIndex: number;
    historyLength: number;
    onUndo: () => void;
    onRedo: () => void;
    previewMode: boolean;
    setPreviewMode: (val: boolean) => void;
    onSaveAll: () => Promise<void>;
    onClose: () => void;
}

export const StudioTopBar: React.FC<StudioTopBarProps> = ({
    title,
    setTitle,
    isSaved,
    isSaving,
    isDarkTheme,
    setIsDarkTheme,
    historyIndex,
    historyLength,
    onUndo,
    onRedo,
    previewMode,
    setPreviewMode,
    onSaveAll,
    onClose
}) => {
    return (
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
                    onChange={(e) => setTitle(e.target.value)}
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
                        onClick={onUndo}
                        disabled={historyIndex === 0}
                        className={`px-2 py-1 text-xs disabled:opacity-30 ${isDarkTheme ? 'text-white/70 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
                        title="Hoàn tác (Undo)"
                    >
                        ↺
                    </button>
                    <button
                        onClick={onRedo}
                        disabled={historyIndex >= historyLength - 1}
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
                    onClick={onSaveAll}
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
                    onClick={onSaveAll}
                    disabled={isSaving}
                    className="text-xs font-bold px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-600/20 transition-all active:scale-95 disabled:opacity-50"
                >
                    {isSaving ? 'Đang lưu...' : 'Xuất bản'}
                </button>
            </div>
        </div>
    );
};
