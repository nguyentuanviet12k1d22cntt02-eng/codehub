import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, BookOpen, BarChart3, Globe, Award, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface CourseSidebarProps {
    courseTitle?: string;
    firstLessonId?: string;
    totalDuration: number;
    totalLessons: number;
    level: string;
}

export const CourseSidebar: React.FC<CourseSidebarProps> = ({
    courseTitle,
    firstLessonId,
    totalDuration,
    totalLessons,
    level,
}) => {
    const navigate = useNavigate();
    const isCpp = /c\+\+/i.test(courseTitle || '');
    const isSql = /sql/i.test(courseTitle || '');
    const isJs = /javascript|js\b/i.test(courseTitle || '');

    return (
        <div className="w-full lg:w-[320px] xl:w-[340px] shrink-0 lg:sticky lg:top-[88px] self-start">
            <div className={`bg-white dark:bg-[#151D2E] rounded-[24px] p-6 sm:p-7 flex flex-col gap-6 shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-all ${
                isJs
                    ? 'border border-[#E5E7EB] dark:border-slate-800'
                    : 'border border-slate-200/80 dark:border-slate-800'
            }`}>
                {/* Price & Badge */}
                <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800/80">
                    <div className="flex flex-col">
                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                            Học phí khóa học
                        </span>
                        <span className="text-xl font-black text-[#111111] dark:text-white mt-0.5">
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
                    className={`w-full py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer text-sm select-none group ${
                        isCpp
                            ? 'bg-gradient-to-r from-[#0B2948] to-[#0089C9] hover:from-[#081F37] hover:to-[#007AB3] text-white font-bold border-none shadow-lg shadow-sky-600/30'
                            : isSql
                            ? 'bg-gradient-to-r from-[#003366] to-[#00758F] hover:from-[#00274D] hover:to-[#006277] text-white font-bold border-none shadow-lg shadow-teal-500/25'
                            : isJs
                            ? 'bg-[#F7DF1E] hover:bg-[#FFE94A] text-[#111111] font-black border border-[#D9B800] shadow-[0_4px_20px_rgba(247,223,30,0.4)]'
                            : 'bg-gradient-to-r from-[#306998] to-[#4B8BBE] hover:from-[#28577E] hover:to-[#3E74A1] text-white font-bold border-none shadow-lg shadow-[#306998]/25'
                    }`}
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
                <div className={`p-3.5 rounded-xl border flex flex-col gap-2 ${
                    isJs
                        ? 'bg-[#FFFDF2] dark:bg-slate-900/50 border-[#F7DF1E]/40 dark:border-slate-800/60'
                        : 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800/60'
                }`}>
                    <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-[#111111] dark:text-slate-200">
                            Tiến độ học tập
                        </span>
                        <span className={`font-black ${
                            isCpp
                                ? 'text-sky-600 dark:text-sky-400'
                                : isSql
                                ? 'text-[#00758F] dark:text-teal-400'
                                : isJs
                                ? 'text-[#111111] dark:text-[#FFE94A]'
                                : 'text-[#306998] dark:text-[#FFE873]'
                        }`}>
                            0% hoàn thành
                        </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div className={`h-full rounded-full w-[4%] ${
                            isCpp
                                ? 'bg-gradient-to-r from-[#0B2948] to-[#0089C9]'
                                : isSql
                                ? 'bg-gradient-to-r from-[#003366] to-[#00758F]'
                                : isJs
                                ? 'bg-[#F7DF1E]'
                                : 'bg-gradient-to-r from-[#306998] to-[#4B8BBE]'
                        }`} />
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        {isCpp ? 'Chưa bắt đầu • Sẵn sàng học C++ Bài 1' : isSql ? 'Chưa bắt đầu • Sẵn sàng học SQL Bài 1' : isJs ? 'Chưa bắt đầu • Sẵn sàng học JavaScript Bài 1' : 'Chưa bắt đầu • Sẵn sàng học Python Bài 1'}
                    </span>
                </div>

                {/* Course Metadata List */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/40">
                        <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
                            <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                                isJs
                                    ? 'bg-[#FFFDF2] text-[#111111] border border-[#F7DF1E]/40'
                                    : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                            }`}>
                                <Clock className="w-3.5 h-3.5" />
                            </div>
                            <span>Thời lượng</span>
                        </div>
                        <span className="text-xs font-bold text-[#111111] dark:text-white">
                            {totalDuration} phút
                        </span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/40">
                        <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
                            <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                                isJs
                                    ? 'bg-[#FFFDF2] text-[#111111] border border-[#F7DF1E]/40'
                                    : isSql
                                    ? 'bg-teal-50 dark:bg-teal-950/60 text-[#00758F] dark:text-teal-400'
                                    : isCpp
                                    ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400'
                                    : 'bg-blue-50 dark:bg-blue-950/60 text-[#306998] dark:text-[#FFE873]'
                            }`}>
                                <BookOpen className="w-3.5 h-3.5" />
                            </div>
                            <span>Số bài học</span>
                        </div>
                        <span className="text-xs font-bold text-[#111111] dark:text-white">
                            {totalLessons} bài học
                        </span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/40">
                        <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
                            <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                                isJs
                                    ? 'bg-[#FFFDF2] text-[#111111] border border-[#F7DF1E]/40'
                                    : isSql
                                    ? 'bg-amber-50 dark:bg-amber-950/60 text-[#F29111] dark:text-amber-400'
                                    : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                            }`}>
                                <BarChart3 className="w-3.5 h-3.5" />
                            </div>
                            <span>Cấp độ học</span>
                        </div>
                        <span className="text-xs font-bold text-[#111111] dark:text-white">
                            {level}
                        </span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/40">
                        <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
                            <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                                isJs
                                    ? 'bg-[#FFFDF2] text-[#111111] border border-[#F7DF1E]/40'
                                    : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                            }`}>
                                <Globe className="w-3.5 h-3.5" />
                            </div>
                            <span>Hình thức</span>
                        </div>
                        <span className="text-xs font-bold text-[#111111] dark:text-white">
                            Học trực tuyến
                        </span>
                    </div>

                    <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
                            <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                                isJs
                                    ? 'bg-[#FFFDF2] text-[#111111] border border-[#F7DF1E]/40'
                                    : isSql
                                    ? 'bg-teal-50 dark:bg-teal-950/60 text-[#00758F] dark:text-teal-400'
                                    : isCpp
                                    ? 'bg-sky-50 dark:bg-sky-950/60 text-[#0089C9] dark:text-sky-400'
                                    : 'bg-blue-50 dark:bg-blue-950/60 text-[#306998] dark:text-[#FFE873]'
                            }`}>
                                <Award className="w-3.5 h-3.5" />
                            </div>
                            <span>Chứng nhận</span>
                        </div>
                        <span className="text-xs font-bold text-[#111111] dark:text-white">
                            Cấp chứng chỉ
                        </span>
                    </div>
                </div>

                {/* Footer Assurance */}
                <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800/60">
                    <ShieldCheck className={`w-4 h-4 shrink-0 ${isJs ? 'text-[#D9B800]' : isCpp ? 'text-[#0089C9]' : isSql ? 'text-[#F29111]' : 'text-[#306998]'}`} />
                    <span>Học tương tác với Trình biên dịch Code trực tuyến & AI Tutor</span>
                </div>
            </div>
        </div>
    );
};

