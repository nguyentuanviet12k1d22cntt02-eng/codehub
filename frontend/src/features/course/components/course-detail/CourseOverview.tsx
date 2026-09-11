import React from 'react';
import { BookOpen, Target, Check } from 'lucide-react';

interface CourseOverviewProps {
    description: string | null;
}

export const CourseOverview: React.FC<CourseOverviewProps> = ({ description }) => {
    const defaultObjectives = [
        'Hiểu sâu kiến thức cốt lõi và tư duy lập trình/truy vấn chuyên nghiệp.',
        'Thực hành trực tiếp thông qua các bài tập tương tác ngay trên hệ thống.',
        'Thiết lập môi trường phát triển dự án thực tế trên máy cá nhân.',
        'Sẵn sàng áp dụng kiến thức vào công việc hoặc sản phẩm cá nhân.'
    ];

    return (
        <div className="flex flex-col gap-6">
            {/* Section 1: Tổng quan */}
            <div className="bg-white dark:bg-[#151D2E] border border-slate-200/80 dark:border-slate-800 rounded-[20px] p-6 md:p-8 shadow-[0_4px_20px_-4px_rgba(23,32,51,0.05)] transition-all">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/40">
                        <BookOpen className="w-4 h-4" />
                    </div>
                    <h3 className="text-lg font-bold text-[#172033] dark:text-white m-0">
                        Tổng quan khóa học
                    </h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed m-0 font-normal">
                    {description || 'Khóa học cung cấp lộ trình bài bản giúp bạn nhanh chóng nắm bắt các kiến thức lập trình cơ bản và nâng cao để áp dụng trực tiếp vào công việc.'}
                </p>
            </div>

            {/* Section 2: Mục tiêu khóa học */}
            <div className="bg-white dark:bg-[#151D2E] border border-slate-200/80 dark:border-slate-800 rounded-[20px] p-6 md:p-8 shadow-[0_4px_20px_-4px_rgba(23,32,51,0.05)] transition-all">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-100 dark:border-purple-900/40">
                        <Target className="w-4 h-4" />
                    </div>
                    <h3 className="text-lg font-bold text-[#172033] dark:text-white m-0">
                        Mục tiêu của khóa học
                    </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {defaultObjectives.map((obj, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 transition-all hover:bg-slate-50 dark:hover:bg-slate-900/60"
                        >
                            <div className="w-5 h-5 rounded-full bg-emerald-100/90 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                                <Check className="w-3 h-3 stroke-[2.5]" />
                            </div>
                            <span className="text-xs md:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                                {obj}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

