import React from 'react';
import { 
    ArrowLeft, 
    FileText, 
    Code2, 
    HelpCircle, 
    Sun, 
    Moon, 
    RotateCcw, 
    RotateCw, 
    Eye, 
    Save, 
    Send,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';

interface StudioTopBarProps {
    title: string;
    setTitle: (title: string) => void;
    activeTab: 'content' | 'exercises' | 'quizzes';
    setActiveTab: (tab: 'content' | 'exercises' | 'quizzes') => void;
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
    activeTab,
    setActiveTab,
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
                    className={`text-xs font-semibold px-3 py-1.5 rounded-[4px] border transition-colors flex items-center gap-1.5 cursor-pointer ${
                        isDarkTheme
                            ? 'border-white/10 bg-white/5 hover:bg-white/10 text-white/80'
                            : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Quay lại danh sách</span>
                </button>
                <div className={`h-4 w-[1px] ${isDarkTheme ? 'bg-white/10' : 'bg-slate-200'}`} />
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`border rounded-[4px] px-3 py-1.5 text-xs font-bold w-48 md:w-64 focus:outline-none transition-all ${
                        isDarkTheme
                            ? 'bg-white/5 hover:bg-white/10 focus:bg-[#181820] border-white/10 focus:border-purple-500 text-white'
                            : 'bg-slate-50 hover:bg-slate-100/80 focus:bg-white border-slate-300 focus:border-purple-600 text-slate-900 shadow-inner'
                    }`}
                    placeholder="Nhập tiêu đề bài học..."
                />
            </div>

            {/* Center Mode Switcher Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-white/5 p-1 rounded-[5px] border border-slate-200 dark:border-white/10">
                <button
                    type="button"
                    onClick={() => setActiveTab('content')}
                    className={`px-3 py-1.5 rounded-[4px] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        activeTab === 'content'
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Soạn nội dung</span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab('exercises')}
                    className={`px-3 py-1.5 rounded-[4px] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        activeTab === 'exercises'
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Bài tập &amp; Test Cases</span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab('quizzes')}
                    className={`px-3 py-1.5 rounded-[4px] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        activeTab === 'quizzes'
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Trắc nghiệm</span>
                </button>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
                {/* Theme Toggle */}
                <button
                    onClick={() => setIsDarkTheme(!isDarkTheme)}
                    className={`text-xs font-semibold px-2.5 py-1.5 rounded-[4px] border transition-colors flex items-center gap-1.5 cursor-pointer ${
                        isDarkTheme
                            ? 'border-white/10 bg-white/5 hover:bg-white/10 text-white/80'
                            : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                    title="Chuyển đổi giao diện Sáng / Tối"
                >
                    {isDarkTheme ? (
                        <>
                            <Moon className="w-3.5 h-3.5 text-purple-400" />
                            <span>Tối</span>
                        </>
                    ) : (
                        <>
                            <Sun className="w-3.5 h-3.5 text-amber-500" />
                            <span>Sáng</span>
                        </>
                    )}
                </button>

                {/* Status badge */}
                <div className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-[4px] border ${
                    isSaved
                        ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                        : 'text-amber-700 bg-amber-50 border-amber-200'
                }`}>
                    {isSaved ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                    )}
                    <span>{isSaved ? 'Đã lưu' : 'Chưa lưu'}</span>
                </div>

                {/* Undo / Redo */}
                <div className={`flex items-center rounded-[4px] border p-0.5 ${
                    isDarkTheme ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                }`}>
                    <button
                        onClick={onUndo}
                        disabled={historyIndex === 0}
                        className={`p-1.5 rounded-[2px] disabled:opacity-30 cursor-pointer ${isDarkTheme ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'}`}
                        title="Hoàn tác (Undo)"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={onRedo}
                        disabled={historyIndex >= historyLength - 1}
                        className={`p-1.5 rounded-[2px] disabled:opacity-30 cursor-pointer ${isDarkTheme ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'}`}
                        title="Làm lại (Redo)"
                    >
                        <RotateCw className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Preview Button */}
                <button
                    onClick={() => setPreviewMode(!previewMode)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-[4px] border transition-colors flex items-center gap-1.5 cursor-pointer ${
                        previewMode
                            ? 'bg-purple-600 text-white border-purple-500'
                            : isDarkTheme
                                ? 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-xs'
                    }`}
                >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{previewMode ? 'Sửa bài' : 'Xem thử'}</span>
                </button>

                {/* Save Draft */}
                <button
                    onClick={onSaveAll}
                    disabled={isSaving}
                    className={`text-xs font-semibold px-3.5 py-1.5 rounded-[4px] border transition-colors flex items-center gap-1.5 cursor-pointer ${
                        isDarkTheme
                            ? 'border-white/10 bg-white/5 hover:bg-white/10 text-white'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-xs'
                    }`}
                >
                    <Save className="w-3.5 h-3.5" />
                    <span>Lưu nháp</span>
                </button>

                {/* Publish CTA */}
                <button
                    onClick={onSaveAll}
                    disabled={isSaving}
                    className="text-xs font-bold px-4 py-2 rounded-[4px] bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-600/20 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSaving ? 'Đang lưu...' : 'Xuất bản'}</span>
                </button>
            </div>
        </div>
    );
};
