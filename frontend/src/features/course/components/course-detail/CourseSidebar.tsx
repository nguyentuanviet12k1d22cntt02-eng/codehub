import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, BookOpen, BarChart3, Globe, Award, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface CourseSidebarProps {
    firstLessonId?: string;
    totalDuration: number;
    totalLessons: number;
    level: string;
}

export const CourseSidebar: React.FC<CourseSidebarProps> = ({
    firstLessonId,
    totalDuration,
    totalLessons,
    level,
}) => {
    const navigate = useNavigate();

    return (
        <div className="w-full lg:w-[320px] xl:w-[340px] shrink-0 lg:sticky lg:top-[88px] self-start">
            <div className="bg-white dark:bg-[#151D2E] border border-slate-200/80 dark:border-slate-800 rounded-[20px] p-6 sm:p-7 flex flex-col gap-6 shadow-[0_4px_24px_-4px_rgba(23,32,51,0.06)] transition-all">
                {/* Price & Badge */}
                <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800/80">
                    <div className="flex flex-col">
                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                            Học phí khóa học
                        </span>
                        <span className="text-xl font-extrabold text-[#172033] dark:text-white mt-0.5">
                            Miễn phí
                        </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200/70 dark:border-emerald-800/60 uppercase tracking-wide">
                        <Sparkles className="w-3 h-3 text-emerald-500" />
                        <span>Trọn đời</span>
                    </span>
                </div>

                {/* Primary CTA Button */}
                <button
                    className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-[#7C5CFC] hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer text-sm border-none select-none group"
                    onClick={() => {
                        if (firstLessonId) {
                            navigate(`/lesson/${firstLessonId}`);
                        } else {
                            navigate('/dashboard');
                        }
                    }}
                >
                    <span>Bắt đầu học ngay</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Progress Indicator */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60 flex flex-col gap-2">
                    <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                            Tiến độ học tập
                        </span>
                        <span className="font-bold text-blue-600 dark:text-blue-400">
                            0% hoàn thành
                        </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full w-[4%]" />
                    </div>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">
                        Chưa bắt đầu • Sẵn sàng học bài 1
                    </span>
                </div>

                {/* Course Metadata List */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/40">
                        <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
                            <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                <Clock className="w-3.5 h-3.5" />
                            </div>
                            <span>Thời lượng</span>
                        </div>
                        <span className="text-xs font-semibold text-[#172033] dark:text-white">
                            {totalDuration} phút
                        </span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/40">
                        <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
                            <div className="w-6 h-6 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                                <BookOpen className="w-3.5 h-3.5" />
                            </div>
                            <span>Số bài học</span>
                        </div>
                        <span className="text-xs font-semibold text-[#172033] dark:text-white">
                            {totalLessons} bài học
                        </span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/40">
                        <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
                            <div className="w-6 h-6 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                                <BarChart3 className="w-3.5 h-3.5" />
                            </div>
                            <span>Cấp độ học</span>
                        </div>
                        <span className="text-xs font-semibold text-[#172033] dark:text-white">
                            {level}
                        </span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/40">
                        <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
                            <div className="w-6 h-6 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                <Globe className="w-3.5 h-3.5" />
                            </div>
                            <span>Hình thức</span>
                        </div>
                        <span className="text-xs font-semibold text-[#172033] dark:text-white">
                            Học trực tuyến
                        </span>
                    </div>

                    <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
                            <div className="w-6 h-6 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                                <Award className="w-3.5 h-3.5" />
                            </div>
                            <span>Chứng nhận</span>
                        </div>
                        <span className="text-xs font-semibold text-[#172033] dark:text-white">
                            Cấp chứng chỉ
                        </span>
                    </div>
                </div>

                {/* Footer Assurance */}
                <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800/60">
                    <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>Học tương tác với Trình biên dịch Code trực tuyến & AI Tutor</span>
                </div>
            </div>
        </div>
    );
};

