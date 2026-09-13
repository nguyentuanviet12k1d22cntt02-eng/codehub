import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { DBModule } from './types';
import {
    ChevronDown,
    CheckCircle2,
    PlayCircle,
    Clock,
    Sparkles,
    Terminal,
    ArrowRight,
    BookOpen
} from 'lucide-react';

interface CourseCurriculumProps {
    modules: DBModule[];
    courseTitle?: string;
}

export const CourseCurriculum: React.FC<CourseCurriculumProps> = ({ modules, courseTitle }) => {
    const navigate = useNavigate();
    const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
    const isCpp = /c\+\+/i.test(courseTitle || '');
    const isSql = /sql/i.test(courseTitle || '');
    const isJs = /javascript|js\b/i.test(courseTitle || '');

    const toggleModule = (moduleId: string) => {
        setExpandedModules(prev => ({
            ...prev,
            [moduleId]: prev[moduleId] === false ? true : false
        }));
    };

    return (
        <div className="flex flex-col gap-5">
            {/* Section Header */}
            <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                        isCpp
                            ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border-sky-100 dark:border-sky-900/40'
                            : isSql
                            ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border-teal-100 dark:border-teal-900/40'
                            : isJs
                            ? 'bg-[#FFFDF2] text-[#111111] border-[#F7DF1E]'
                            : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/40'
                    }`}>
                        <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-[#111111] dark:text-white m-0">
                            Nội dung học tập
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 m-0">
                            Lộ trình từng bước từ căn bản đến nâng cao
                        </p>
                    </div>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    isCpp
                        ? 'text-sky-700 dark:text-sky-300 bg-sky-100/70 dark:bg-sky-950/70 border border-sky-200/60 dark:border-sky-800/60'
                        : isJs
                        ? 'text-[#111111] bg-[#FFFDF2] border border-[#F7DF1E]/50 font-bold'
                        : 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800'
                }`}>
                    {modules.length} Phân môn {isCpp ? '• Chuẩn C++17' : isJs ? '• Chuẩn JavaScript ES6+' : ''}
                </span>
            </div>

            {/* List of Modules */}
            <div className="flex flex-col gap-5">
                {modules.map((module, mIndex) => {
                    const isExpanded = expandedModules[module.id] !== false; // Mặc định mở rộng

                    // Tính toán số lượng bài học và tiến độ hoàn thành trong module
                    const totalModuleLessons = module.chapters.reduce(
                        (sum, ch) => sum + ch.lessons.filter(l => !l.lessonId?.includes('.MP')).length,
                        0
                    );
                    const completedLessonsCount = module.chapters.reduce(
                        (sum, ch) => sum + ch.lessons.filter(l => l.isCompleted && !l.lessonId?.includes('.MP')).length,
                        0
                    );
                    const progressPercent = totalModuleLessons > 0
                        ? Math.round((completedLessonsCount / totalModuleLessons) * 100)
                        : 0;

                    return (
                        <div
                            key={module.id}
                            className={`rounded-[24px] overflow-hidden transition-all duration-200 ${
                                isExpanded
                                    ? isCpp
                                        ? 'border-2 border-[#0089C9] shadow-sm'
                                        : isSql
                                        ? 'border-2 border-[#00758F] shadow-sm'
                                        : isJs
                                        ? 'border-2 border-[#F7DF1E] shadow-[0_4px_20px_rgba(247,223,30,0.15)]'
                                        : 'border-2 border-[#306998] shadow-sm'
                                    : isJs
                                    ? 'border border-[#E5E7EB] dark:border-slate-800 hover:border-[#F7DF1E] shadow-[0_2px_10px_rgba(0,0,0,0.03)]'
                                    : isCpp
                                    ? 'border border-[#E5E7EB] dark:border-slate-800 hover:border-[#0089C9]'
                                    : isSql
                                    ? 'border border-[#E5E7EB] dark:border-slate-800 hover:border-[#00758F]'
                                    : 'border border-[#E5E7EB] dark:border-slate-800 hover:border-[#306998]'
                            }`}
                        >
                            {/* MODULE HEADER BAR */}
                            <div
                                className={`p-5 sm:p-6 transition-colors flex flex-col gap-3 cursor-pointer select-none group ${
                                    isExpanded
                                        ? isCpp
                                            ? 'bg-sky-50/40 dark:bg-sky-950/20'
                                            : isSql
                                            ? 'bg-teal-50/40 dark:bg-teal-950/20'
                                            : isJs
                                            ? 'bg-[#FFFDF2] dark:bg-slate-900/40'
                                            : 'bg-sky-50/40 dark:bg-sky-950/20'
                                        : 'bg-white dark:bg-[#151D2E] hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                                }`}
                                onClick={() => toggleModule(module.id)}
                            >
                                <div className="flex justify-between items-center">
                                    {/* Badge Phân môn */}
                                    <span className={`inline-flex items-center gap-1.5 text-[11px] px-3 py-0.5 rounded-full border uppercase tracking-wide ${
                                        isCpp
                                            ? 'text-sky-700 dark:text-sky-300 bg-sky-100/80 dark:bg-sky-950/80 border-sky-200/70 dark:border-sky-800/60 font-bold'
                                            : isSql
                                            ? 'text-[#00758F] dark:text-teal-300 bg-teal-100/70 dark:bg-teal-950/70 border-teal-200/70 dark:border-teal-800/60 font-bold'
                                            : isJs
                                            ? 'text-[#F7DF1E] bg-[#111111] border-black font-black shadow-xs'
                                            : 'text-[#306998] dark:text-sky-300 bg-sky-100/70 dark:bg-sky-950/70 border-sky-200/70 dark:border-sky-800/60 font-bold'
                                    }`}>
                                        Phân môn {mIndex + 1}
                                    </span>

                                    {/* Chapters count & Accordion Chevron */}
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:inline-block">
                                            {module.chapters.length} Chương • {totalModuleLessons} Bài học
                                        </span>
                                        <div className="w-7 h-7 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center border border-[#E5E7EB] dark:border-slate-700/60 shadow-2xs group-hover:scale-105 transition-transform">
                                            <ChevronDown
                                                className={`w-4 h-4 text-slate-500 dark:text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Module Title */}
                                <h4 className={`text-base sm:text-lg font-black text-[#111111] dark:text-white m-0 tracking-tight transition-colors ${
                                    isCpp
                                        ? 'group-hover:text-[#0089C9] dark:group-hover:text-sky-400'
                                        : isSql
                                        ? 'group-hover:text-[#00758F] dark:group-hover:text-teal-400'
                                        : isJs
                                        ? 'group-hover:text-[#D9B800] dark:group-hover:text-[#FFE94A]'
                                        : 'group-hover:text-[#306998] dark:group-hover:text-sky-400'
                                }`}>
                                    {module.title}
                                </h4>

                                {/* Module Progress Bar */}
                                <div className="flex items-center gap-3 pt-0.5">
                                    <div className="flex-1 h-1.5 rounded-full bg-[#E5E7EB] dark:bg-slate-800 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${
                                                isCpp
                                                    ? 'bg-gradient-to-r from-[#0B2948] to-[#0089C9]'
                                                    : isSql
                                                    ? 'bg-gradient-to-r from-[#003366] to-[#00758F]'
                                                    : isJs
                                                    ? 'bg-[#F7DF1E]'
                                                    : 'bg-gradient-to-r from-[#306998] to-[#4B8BBE]'
                                            }`}
                                            style={{ width: `${progressPercent}%` }}
                                        />
                                    </div>
                                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 shrink-0">
                                        {completedLessonsCount}/{totalModuleLessons} bài ({progressPercent}%)
                                    </span>
                                </div>
                            </div>

                            {/* CHAPTERS & LESSONS CONTAINER */}
                            {isExpanded && (
                                <div className="p-4 sm:p-6 flex flex-col gap-4 bg-white dark:bg-[#151D2E]">
                                    {module.chapters.map((chapter, cIndex) => {
                                        const normalLessons = chapter.lessons.filter(
                                            l => l.lessonId && !l.lessonId.includes('.MP')
                                        );

                                        return (
                                            <div
                                                key={chapter.id}
                                                className={`rounded-2xl overflow-hidden bg-white dark:bg-[#111827] shadow-2xs ${
                                                    isJs
                                                        ? 'border border-[#E5E7EB] dark:border-slate-800'
                                                        : 'border border-slate-200/70 dark:border-slate-800/80'
                                                }`}
                                            >
                                                {/* CHAPTER HEADER */}
                                                <div className={`px-4 sm:px-5 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5 border-b ${
                                                    isJs
                                                        ? 'bg-[#FFFDF2]/80 dark:bg-slate-900/50 border-[#E5E7EB] dark:border-slate-800/60'
                                                        : 'bg-slate-50/80 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-800/60'
                                                }`}>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-[10px] px-2 py-0.5 rounded uppercase tracking-wide ${
                                                            isJs
                                                                ? 'bg-[#111111] text-[#F7DF1E] font-black border border-black'
                                                                : 'text-slate-600 dark:text-slate-300 bg-slate-200/70 dark:bg-slate-800 font-bold border border-slate-300/50 dark:border-slate-700/50'
                                                        }`}>
                                                            Chương {mIndex + 1}.{cIndex + 1}
                                                        </span>
                                                        <span className="font-bold text-sm text-[#111111] dark:text-white">
                                                            {chapter.title}
                                                        </span>
                                                    </div>
                                                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                                                        {normalLessons.length} bài học
                                                    </span>
                                                </div>

                                                {/* LESSONS LIST */}
                                                <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800/50">
                                                    {normalLessons.map((lesson) => (
                                                        <div
                                                            key={lesson.id}
                                                            className={`px-4 sm:px-5 py-3 flex items-center justify-between cursor-pointer transition-colors group ${
                                                                isJs ? 'hover:bg-[#FFFDF2] dark:hover:bg-slate-900/50' : 'hover:bg-blue-50/40 dark:hover:bg-blue-950/20'
                                                            }`}
                                                            onClick={() => navigate(`/lesson/${lesson.id}`)}
                                                        >
                                                            {/* Status Icon & Title */}
                                                            <div className="flex items-center gap-3 min-w-0 pr-3">
                                                                {lesson.isCompleted ? (
                                                                    <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-500 flex items-center justify-center shrink-0">
                                                                        <CheckCircle2 className="w-4 h-4" />
                                                                    </div>
                                                                ) : (
                                                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${
                                                                        isJs
                                                                            ? 'bg-[#FFFDF2] text-[#111111] border border-[#F7DF1E]/60 group-hover:bg-[#F7DF1E]'
                                                                            : 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
                                                                    }`}>
                                                                        <PlayCircle className="w-4 h-4" />
                                                                    </div>
                                                                )}
                                                                <span className={`text-xs sm:text-[13px] font-medium transition-colors truncate ${
                                                                    isJs
                                                                        ? 'text-[#1F2937] dark:text-slate-200 group-hover:text-[#D9B800] dark:group-hover:text-[#FFE94A]'
                                                                        : 'text-[#172033] dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                                                                }`}>
                                                                    {lesson.title}
                                                                </span>
                                                            </div>

                                                            {/* Duration Tag */}
                                                            <div className="flex items-center gap-1.5 shrink-0 text-slate-400 dark:text-slate-500 text-[11px] font-medium">
                                                                <Clock className="w-3 h-3 text-slate-300 dark:text-slate-600" />
                                                                <span>
                                                                    {lesson.durationMinutes ? `${lesson.durationMinutes} phút` : '15 phút'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* MODULE PRACTICE CTA CARD (BÀI TẬP TỔNG HỢP) */}
                                    {(() => {
                                        const practiceLessons = module.chapters
                                            .flatMap((ch) => ch.lessons)
                                            .filter((l) => l.lessonId && l.lessonId.includes('.MP'));
                                        if (practiceLessons.length === 0) return null;
                                        const modName = module.title.split(':')[0] || 'Module';

                                        return (
                                            <div className="mt-2 flex flex-col gap-3.5">
                                                {practiceLessons.map((practiceLesson) => {
                                                    const isFor = practiceLesson.title.includes("For");
                                                    const isWhile = practiceLesson.title.includes("While");
                                                    const topicLabel = isFor ? "For" : isWhile ? "While" : modName;

                                                    return (
                                                        <div
                                                            key={practiceLesson.id}
                                                            className={`p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all relative overflow-hidden ${
                                                                isJs
                                                                    ? 'bg-[#111111] text-white border-2 border-[#F7DF1E] shadow-[0_6px_24px_rgba(247,223,30,0.15)]'
                                                                    : isCpp
                                                                    ? 'bg-gradient-to-r from-sky-50/90 via-slate-50/70 to-blue-50/90 dark:from-sky-950/30 dark:via-slate-900/25 dark:to-blue-950/30 border border-sky-200/80 dark:border-sky-800/60 shadow-sm hover:shadow-md'
                                                                    : isSql
                                                                    ? 'bg-gradient-to-r from-teal-50/90 via-slate-50/70 to-cyan-50/90 dark:from-teal-950/30 dark:via-slate-900/25 dark:to-cyan-950/30 border border-teal-200/80 dark:border-teal-800/60 shadow-sm hover:shadow-md'
                                                                    : 'bg-gradient-to-r from-sky-50/90 via-slate-50/70 to-blue-50/90 dark:from-sky-950/30 dark:via-slate-900/25 dark:to-blue-950/30 border border-sky-200/80 dark:border-sky-800/60 shadow-sm hover:shadow-md'
                                                            }`}
                                                        >
                                                            {/* Left Content */}
                                                            <div className="flex items-start gap-3.5 select-text">
                                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 hidden sm:flex shadow-md ${
                                                                    isJs
                                                                        ? 'bg-[#F7DF1E] text-[#111111]'
                                                                        : isCpp
                                                                        ? 'bg-gradient-to-tr from-[#0B2948] to-[#0089C9] text-white shadow-sky-500/20'
                                                                        : isSql
                                                                        ? 'bg-gradient-to-tr from-[#003366] to-[#00758F] text-white shadow-teal-500/20'
                                                                        : 'bg-gradient-to-tr from-[#306998] to-[#4B8BBE] text-white shadow-sky-500/20'
                                                                }`}>
                                                                    <Terminal className="w-5 h-5" />
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wide self-start ${
                                                                        isJs
                                                                            ? 'text-[#111111] bg-[#F7DF1E] border border-yellow-400'
                                                                            : isCpp
                                                                            ? 'text-sky-700 dark:text-sky-300 bg-sky-100/80 dark:bg-sky-950/70 border border-sky-200 dark:border-sky-800/60 font-bold'
                                                                            : isSql
                                                                            ? 'text-[#00758F] dark:text-teal-300 bg-teal-100/80 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800/60 font-bold'
                                                                            : 'text-[#306998] dark:text-sky-300 bg-sky-100/80 dark:bg-sky-950/70 border border-sky-200 dark:border-sky-800/60 font-bold'
                                                                    }`}>
                                                                        <Sparkles className={`w-3 h-3 ${isJs ? 'text-[#111111]' : isCpp ? 'text-[#0089C9]' : isSql ? 'text-[#F29111]' : 'text-[#FFE873]'}`} />
                                                                        <span>Luyện tập tổng hợp: {topicLabel}</span>
                                                                    </span>
                                                                    <h5 className={`text-sm sm:text-base font-bold m-0 mt-0.5 ${isJs ? 'text-white' : 'text-[#111111] dark:text-white'}`}>
                                                                        {practiceLesson.title}
                                                                    </h5>
                                                                    <p className={`text-xs m-0 leading-relaxed max-w-lg ${
                                                                        isJs ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'
                                                                    }`}>
                                                                        {practiceLesson.objective || `Kiểm tra và củng cố toàn bộ kiến thức đã học trong ${modName}.`}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {/* CTA Button */}
                                                            <button
                                                                onClick={() => navigate(`/module-practice/${module.id}/${practiceLesson.id}`)}
                                                                className={`font-black px-5 py-3 rounded-xl text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all active:scale-95 whitespace-nowrap self-stretch sm:self-auto justify-center border-none group ${
                                                                    isJs
                                                                        ? 'bg-[#F7DF1E] hover:bg-[#FFE94A] text-[#111111] shadow-[0_4px_16px_rgba(247,223,30,0.35)]'
                                                                        : isCpp
                                                                        ? 'bg-gradient-to-r from-[#0B2948] to-[#0089C9] hover:from-[#081F37] hover:to-[#007AB3] text-white shadow-sky-500/20'
                                                                        : isSql
                                                                        ? 'bg-gradient-to-r from-[#003366] to-[#00758F] hover:from-[#00274D] hover:to-[#006277] text-white shadow-teal-500/20'
                                                                        : 'bg-gradient-to-r from-[#306998] to-[#4B8BBE] hover:from-[#28577E] hover:to-[#3E74A1] text-white shadow-sky-500/20'
                                                                }`}
                                                            >
                                                                <span>Làm bài tập ôn luyện {topicLabel}</span>
                                                                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        );
                                    })()}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

