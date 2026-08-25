import React from 'react';

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
            <div className="bg-bg-secondary border border-border-custom rounded-2xl p-6 md:p-8 flex flex-col gap-4 shadow-sm">
                <h3 className="text-lg font-bold text-text-primary m-0">Tổng quan khóa học</h3>
                <p className="text-sm text-text-secondary leading-relaxed m-0">
                    {description || 'Khóa học cung cấp lộ trình bài bản giúp bạn nhanh chóng nắm bắt các kiến thức lập trình cơ bản và nâng cao để áp dụng trực tiếp vào công việc.'}
                </p>
            </div>

            {/* Section 2: Mục tiêu khóa học */}
            <div className="bg-bg-secondary border border-border-custom rounded-2xl p-6 md:p-8 flex flex-col gap-4 shadow-sm">
                <h3 className="text-lg font-bold text-text-primary m-0">Mục tiêu của khóa học</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {defaultObjectives.map((obj, index) => (
                        <div key={index} className="flex items-start gap-2.5 text-sm text-text-secondary leading-normal">
                            <span className="text-[#30d158] font-bold">✓</span>
                            <span>{obj}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
