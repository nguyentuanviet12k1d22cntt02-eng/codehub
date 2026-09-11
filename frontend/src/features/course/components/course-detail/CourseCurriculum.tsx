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
}

export const CourseCurriculum: React.FC<CourseCurriculumProps> = ({ modules }) => {
    const navigate = useNavigate();
    const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

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
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/40">
                        <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-[#172033] dark:text-white m-0">
                            Nội dung học tập
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 m-0">
                            Lộ trình từng bước từ căn bản đến nâng cao
                        </p>
                    </div>
                </div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                    {modules.length} Phân môn
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
                            className="bg-white dark:bg-[#151D2E] border border-slate-200/80 dark:border-slate-800 rounded-[20px] shadow-[0_4px_20px_-4px_rgba(23,32,51,0.05)] overflow-hidden transition-all"
                        >
                            {/* MODULE CARD HEADER */}
                            <div
                                onClick={() => toggleModule(module.id)}
                                className="bg-[#F8FAFC]/90 dark:bg-[#0E1524]/90 p-5 sm:p-6 border-b border-slate-200/60 dark:border-slate-800/60 flex flex-col gap-3 cursor-pointer hover:bg-slate-100/60 dark:hover:bg-slate-800/40 transition-colors select-none group"
                            >
                                <div className="flex justify-between items-center">
                                    {/* Badge Phân môn */}
                                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-700 dark:text-blue-300 bg-blue-100/70 dark:bg-blue-950/70 px-3 py-0.5 rounded-full border border-blue-200/70 dark:border-blue-800/60 uppercase tracking-wide">
                                        Phân môn {mIndex + 1}
                                    </span>

                                    {/* Chapters count & Accordion Chevron */}
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:inline-block">
                                            {module.chapters.length} Chương • {totalModuleLessons} Bài học
                                        </span>
                                        <div className="w-7 h-7 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center border border-slate-200/60 dark:border-slate-700/60 shadow-2xs group-hover:scale-105 transition-transform">
                                            <ChevronDown
                                                className={`w-4 h-4 text-slate-500 dark:text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Module Title */}
                                <h4 className="text-base sm:text-lg font-bold text-[#172033] dark:text-white m-0 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {module.title}
                                </h4>

                                {/* Module Progress Bar */}
                                <div className="flex items-center gap-3 pt-0.5">
                                    <div className="flex-1 h-1.5 rounded-full bg-slate-200/80 dark:bg-slate-800 overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-500 to-[#7C5CFC] rounded-full transition-all duration-500"
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
                                                className="border border-slate-200/70 dark:border-slate-800/80 rounded-xl overflow-hidden bg-white dark:bg-[#111827] shadow-2xs"
                                            >
                                                {/* CHAPTER HEADER */}
                                                <div className="bg-slate-50/80 dark:bg-slate-900/50 px-4 sm:px-5 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5 border-b border-slate-200/60 dark:border-slate-800/60">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-slate-200/70 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-300/50 dark:border-slate-700/50 uppercase tracking-wide">
                                                            Chương {mIndex + 1}.{cIndex + 1}
                                                        </span>
                                                        <span className="font-bold text-sm text-[#172033] dark:text-white">
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
                                                            className="px-4 sm:px-5 py-3 flex items-center justify-between hover:bg-blue-50/40 dark:hover:bg-blue-950/20 cursor-pointer transition-colors group"
                                                            onClick={() => navigate(`/lesson/${lesson.id}`)}
                                                        >
                                                            {/* Status Icon & Title */}
                                                            <div className="flex items-center gap-3 min-w-0 pr-3">
                                                                {lesson.isCompleted ? (
                                                                    <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-500 flex items-center justify-center shrink-0">
                                                                        <CheckCircle2 className="w-4 h-4" />
                                                                    </div>
                                                                ) : (
                                                                    <div className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                                                        <PlayCircle className="w-4 h-4" />
                                                                    </div>
                                                                )}
                                                                <span className="text-xs sm:text-[13px] font-medium text-[#172033] dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
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
                                                            className="p-5 sm:p-6 bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-purple-50/90 dark:from-blue-950/30 dark:via-indigo-950/25 dark:to-purple-950/30 border border-blue-200/80 dark:border-indigo-800/60 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
                                                        >
                                                            {/* Left Content */}
                                                            <div className="flex items-start gap-3.5 select-text">
                                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-[#7C5CFC] flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0 mt-0.5 hidden sm:flex">
                                                                    <Terminal className="w-5 h-5" />
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-[#7C5CFC] dark:text-purple-300 bg-purple-100/80 dark:bg-purple-950/70 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800/60 uppercase tracking-wide self-start">
                                                                        <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                                                                        <span>Luyện tập tổng hợp: {topicLabel}</span>
                                                                    </span>
                                                                    <h5 className="text-sm sm:text-base font-bold text-[#172033] dark:text-white m-0 mt-0.5">
                                                                        {practiceLesson.title}
                                                                    </h5>
                                                                    <p className="text-xs text-slate-500 dark:text-slate-400 m-0 leading-relaxed max-w-lg">
                                                                        {practiceLesson.objective || `Kiểm tra và củng cố toàn bộ kiến thức đã học trong ${modName}.`}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {/* CTA Button */}
                                                            <button
                                                                onClick={() => navigate(`/module-practice/${module.id}/${practiceLesson.id}`)}
                                                                className="bg-gradient-to-r from-blue-600 to-[#7C5CFC] hover:from-blue-700 hover:to-purple-700 text-white font-bold px-5 py-3 rounded-xl text-xs sm:text-sm shadow-md shadow-indigo-500/20 flex items-center gap-2 cursor-pointer transition-all active:scale-95 whitespace-nowrap self-stretch sm:self-auto justify-center border-none group"
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

