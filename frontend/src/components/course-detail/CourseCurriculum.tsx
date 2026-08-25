import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { DBModule } from './types';

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
        <div className="bg-bg-secondary border border-border-custom rounded-2xl p-6 md:p-8 flex flex-col gap-6 shadow-sm">
            <h3 className="text-lg font-bold text-text-primary m-0 border-b border-border-custom pb-3">
                Nội dung học tập
            </h3>
            <div className="flex flex-col gap-6">
                {modules.map((module, mIndex) => {
                    const isExpanded = expandedModules[module.id] !== false; // Mặc định mở rộng

                    return (
                        <div key={module.id} className="flex flex-col gap-4">
                            {/* Tiêu đề Module */}
                            <div
                                onClick={() => toggleModule(module.id)}
                                className="bg-bg-tertiary border border-border-custom rounded-xl p-4 flex flex-col gap-2 hover:bg-bg-tertiary/70 cursor-pointer transition-colors duration-200 select-none group"
                            >
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-extrabold text-accent-custom uppercase tracking-wider bg-accent-bg px-2 py-0.5 rounded border border-accent-border">
                                        Phân môn {mIndex + 1}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-text-tertiary font-medium">
                                            {module.chapters.length} Chương • {module.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0)} Bài học
                                        </span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={2.5}
                                            stroke="currentColor"
                                            className={`w-3.5 h-3.5 text-text-tertiary transition-transform duration-200 group-hover:text-text-primary ${isExpanded ? 'rotate-180' : ''}`}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                        </svg>
                                    </div>
                                </div>
                                <h4 className="text-base font-bold text-text-primary m-0 mt-1">{module.title}</h4>
                            </div>

                            {/* Danh sách các Chương trong Module */}
                            {isExpanded && (
                                <div className="flex flex-col gap-4 pl-2 md:pl-4 border-l border-border-custom transition-all duration-300">
                                    {module.chapters.map((chapter, cIndex) => {
                                        const normalLessons = chapter.lessons.filter(l => l.lessonId && !l.lessonId.includes('.MP'));
                                        return (
                                            <div key={chapter.id} className="border border-border-custom rounded-xl overflow-hidden bg-bg-secondary animate-fadeIn">
                                                <div className="bg-bg-tertiary px-5 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-border-custom">
                                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                                        <span className="text-[10px] font-extrabold text-text-tertiary uppercase tracking-wider">
                                                            Chương {mIndex + 1}.{cIndex + 1}
                                                        </span>
                                                        <span className="font-bold text-sm text-text-primary">{chapter.title}</span>
                                                    </div>
                                                    <span className="text-[10px] text-text-tertiary font-medium">{normalLessons.length} bài học</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    {normalLessons.map((lesson) => (
                                                        <div
                                                            key={lesson.id}
                                                            className="px-5 py-3.5 flex justify-between items-center hover:bg-bg-tertiary/50 cursor-pointer transition-colors border-b border-border-custom last:border-b-0"
                                                            onClick={() => navigate(`/lesson/${lesson.id}`)}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                {lesson.isCompleted ? (
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-[18px] h-[18px] text-[#30d158] shrink-0">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                                    </svg>
                                                                ) : (
                                                                    <span className="text-text-tertiary text-xs">💻</span>
                                                                )}
                                                                <span className="text-xs md:text-sm text-text-secondary hover:text-text-primary transition-colors font-medium">
                                                                    {lesson.title}
                                                                </span>
                                                            </div>
                                                            <span className="text-[10px] md:text-xs text-text-tertiary">
                                                                {lesson.durationMinutes ? `${lesson.durationMinutes} phút` : 'Chưa đặt thời lượng'}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* Nút Làm bài tập ôn luyện của Module nếu có */}
                                    {(() => {
                                        const practiceLessons = module.chapters
                                            .flatMap((ch) => ch.lessons)
                                            .filter((l) => l.lessonId && l.lessonId.includes('.MP'));
                                        if (practiceLessons.length === 0) return null;
                                        const modName = module.title.split(':')[0] || 'Module';
                                        return (
                                            <div className="mt-2 flex flex-col gap-4">
                                                {practiceLessons.map((practiceLesson) => {
                                                    const isFor = practiceLesson.title.includes("For");
                                                    const isWhile = practiceLesson.title.includes("While");
                                                    const topicLabel = isFor ? "For" : isWhile ? "While" : modName;
                                                    return (
                                                        <div
                                                            key={practiceLesson.id}
                                                            className="p-5 bg-gradient-to-r from-accent-custom/10 to-indigo-500/10 border border-accent-custom/20 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:border-accent-custom/40 duration-200"
                                                        >
                                                            <div className="flex flex-col gap-1 select-text">
                                                                <span className="text-[10px] font-extrabold text-accent-custom uppercase tracking-wider bg-accent-bg px-2 py-0.5 rounded border border-accent-border self-start">
                                                                    Luyện tập tổng hợp: {topicLabel}
                                                                </span>
                                                                <h5 className="text-sm md:text-base font-extrabold text-[#9896f1] dark:text-[#a5b4fc] m-0 mt-1.5">
                                                                    {practiceLesson.title}
                                                                </h5>
                                                                <p className="text-xs text-text-tertiary m-0 mt-1 max-w-[500px] leading-relaxed">
                                                                    {practiceLesson.objective || `Kiểm tra và củng cố toàn bộ kiến thức đã học trong ${modName}.`}
                                                                </p>
                                                            </div>
                                                            <button
                                                                onClick={() => navigate(`/module-practice/${module.id}/${practiceLesson.id}`)}
                                                                className="bg-accent-custom hover:bg-accent-hover text-white dark:text-[#030303] px-5 py-3 rounded-xl text-xs font-bold cursor-pointer transition-all duration-200 active:scale-95 border-none shadow-lg shadow-accent-custom/10 flex items-center gap-2 whitespace-nowrap self-stretch md:self-auto justify-center"
                                                            >
                                                                <span>Làm bài tập ôn luyện {topicLabel}</span>
                                                                <span>&rarr;</span>
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
