import type React from "react";

export interface Course {
    id: string;
    title: string;
    description: string;
    level?: string;
    rating?: string;
    students?: string;
    duration?: string;
    lessonsCount?: number;
}

interface CourseCardProps {
    course: Course;
    onClick?: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onClick }) => {
    // Danh sách các gradient đẹp mắt
    const gradients = [
        'from-[#c084fc] to-[#6366f1]', // Tím - Indigo
        'from-[#ff9f0a] to-[#ff3b30]', // Cam - Đỏ
        'from-[#00d2ff] to-[#0066ff]', // Xanh dương - Cyan
        'from-[#30d158] to-[#00a86b]', // Xanh lá - Emerald
    ];
    // Chọn gradient cố định dựa trên độ dài của tiêu đề khóa học để không bị thay đổi ngẫu nhiên mỗi lần render
    const gradientIndex = course.title.length % gradients.length;
    const bannerGradient = gradients[gradientIndex];
    return (
        <div
            className="bg-bg-secondary border border-border-custom rounded-2xl overflow-hidden hover:border-text-tertiary/20 transition-all duration-200 cursor-pointer flex flex-col text-left hover:-translate-y-1 shadow-sm"
            onClick={onClick}
        >
            {/* Banner đầu thẻ với gradient */}
            <div className={`h-[140px] p-6 flex flex-col justify-end text-white bg-gradient-to-br ${bannerGradient} relative`}>
                <div className="font-bold text-lg leading-tight uppercase line-clamp-1">{course.title}</div>
                <div className="text-xs text-white/85 mt-1 line-clamp-1">{course.description}</div>
            </div>
            {/* Thông tin chi tiết bên dưới */}
            <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                    <h4 className="font-bold text-sm text-text-primary line-clamp-2 mb-2">{course.title}</h4>
                    <div className="text-xs text-[#ff9f0a] font-semibold mb-2">Miễn phí</div>
                    <div className="flex items-center gap-1 text-xs text-text-tertiary mb-3">
                        <span className="text-[#ffcc00]">⭐⭐⭐⭐⭐</span>
                        <span className="text-[11px] ml-1">{course.rating || '5.0'}</span>
                    </div>
                </div>
                {/* Các chỉ số phụ */}
                <div className="flex justify-between border-t border-border-custom pt-3 text-[10px] text-text-tertiary">
                    <span className="flex items-center gap-1">👤 {course.students || '39'}</span>
                    <span className="flex items-center gap-1">▶ {course.lessonsCount || '5'} bài học</span>
                    <span className="flex items-center gap-1">🕒 {course.duration || '1h10p'}</span>
                </div>
            </div>
        </div>
    );
}