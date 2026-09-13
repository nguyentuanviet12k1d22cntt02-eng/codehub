import React from 'react';
import { BookOpen, Target, Check } from 'lucide-react';

interface CourseOverviewProps {
    description: string | null;
    courseTitle?: string;
}

export const CourseOverview: React.FC<CourseOverviewProps> = ({ description, courseTitle }) => {
    const isCpp = /c\+\+/i.test(courseTitle || '');
    const isSql = /sql/i.test(courseTitle || '');
    const isJs = /javascript|js\b/i.test(courseTitle || '');

    const defaultObjectives = isCpp ? [
        'Hiểu sâu bản chất 4 giai đoạn biên dịch, cấu trúc chương trình C++17 và quản trị dữ liệu chặt chẽ.',
        'Làm chủ cấu trúc rẽ nhánh, vòng lặp và chuyên đề giải thuật số học (Số nguyên tố, GCD, Palindrome, Fibonacci).',
        'Nắm vững cơ chế phân rã hàm, truyền tham chiếu (&), tham chiếu hằng (const &) và đệ quy.',
        'Thao tác mảng 1 chiều, mảng 2 chiều, chuỗi std::string, vector động và hoàn thiện Game Cờ Caro.'
    ] : isSql ? [
        'Hiểu sâu kiến trúc cơ sở dữ liệu quan hệ, bảng, khóa chính và khóa ngoại.',
        'Làm chủ kỹ thuật truy vấn dữ liệu từ cơ bản đến phức tạp (SELECT, WHERE, JOIN, GROUP BY).',
        'Thực hành chuẩn hóa cơ sở dữ liệu, tối ưu hóa câu truy vấn và đánh chỉ mục (Index).',
        'Sẵn sàng quản trị và xử lý dữ liệu quy mô lớn trong môi trường doanh nghiệp.'
    ] : isJs ? [
        'Làm chủ cú pháp JavaScript hiện đại ES6+ (let/const, Arrow function, Destructuring, Spread/Rest).',
        'Hiểu sâu cơ chế thực thi của JS Engine: Call Stack, Event Loop, Scope Chain và Closures.',
        'Thao tác mảng, Object nâng cao, xử lý bất đồng bộ chuyên sâu với Promise và async/await.',
        'Thực chiến lập trình hướng đối tượng (OOP Class, Prototype) và tư duy cấu trúc dữ liệu ứng dụng.'
    ] : [
        'Hiểu sâu kiến thức cốt lõi và tư duy lập trình/truy vấn chuyên nghiệp.',
        'Thực hành trực tiếp thông qua các bài tập tương tác ngay trên hệ thống.',
        'Thiết lập môi trường phát triển dự án thực tế trên máy cá nhân.',
        'Sẵn sàng áp dụng kiến thức vào công việc hoặc sản phẩm cá nhân.'
    ];

    return (
        <div className="flex flex-col gap-6">
            {/* Section 1: Tổng quan */}
            <div className={`bg-white dark:bg-[#151D2E] rounded-[24px] p-6 md:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all ${
                isJs
                    ? 'border border-[#E5E7EB] dark:border-slate-800'
                    : 'border border-slate-200/80 dark:border-slate-800'
            }`}>
                <div className="flex items-center gap-3 mb-4">
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
                    <h3 className="text-lg font-black text-[#111111] dark:text-white m-0">
                        Tổng quan khóa học
                    </h3>
                </div>
                <p className="text-sm text-[#1F2937] dark:text-slate-300 leading-relaxed m-0 font-normal">
                    {description || 'Khóa học cung cấp lộ trình bài bản giúp bạn nhanh chóng nắm bắt các kiến thức lập trình cơ bản và nâng cao để áp dụng trực tiếp vào công việc.'}
                </p>
            </div>

            {/* Section 2: Mục tiêu khóa học */}
            <div className={`bg-white dark:bg-[#151D2E] rounded-[24px] p-6 md:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all ${
                isJs
                    ? 'border border-[#E5E7EB] dark:border-slate-800'
                    : 'border border-slate-200/80 dark:border-slate-800'
            }`}>
                <div className="flex items-center gap-3 mb-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                        isCpp
                            ? 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 border-cyan-100 dark:border-cyan-900/40'
                            : isSql
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40'
                            : isJs
                            ? 'bg-[#FFFDF2] text-[#111111] border-[#F7DF1E]'
                            : 'bg-sky-50 dark:bg-sky-950/60 text-[#306998] dark:text-[#FFE873] border-sky-100 dark:border-sky-900/40'
                    }`}>
                        <Target className="w-4 h-4" />
                    </div>
                    <h3 className="text-lg font-black text-[#111111] dark:text-white m-0">
                        Mục tiêu của khóa học
                    </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {defaultObjectives.map((obj, index) => (
                        <div
                            key={index}
                            className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all ${
                                isJs
                                    ? 'bg-[#FFFDF2] dark:bg-slate-900/40 border-[#F7DF1E]/30 hover:border-[#F7DF1E]'
                                    : 'bg-slate-50/80 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800/60 hover:bg-slate-50'
                            }`}
                        >
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-xs ${
                                isJs
                                    ? 'bg-[#F7DF1E] text-[#111111]'
                                    : 'bg-emerald-100/90 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                            }`}>
                                <Check className="w-3 h-3 stroke-[2.5]" />
                            </div>
                            <span className="text-xs md:text-sm text-[#1F2937] dark:text-slate-300 font-medium leading-relaxed">
                                {obj}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

