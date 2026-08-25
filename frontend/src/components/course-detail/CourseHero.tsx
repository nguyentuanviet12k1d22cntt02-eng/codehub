import React from 'react';

interface CourseHeroProps {
    title: string;
    level: string;
    totalDuration: number;
}

export const CourseHero: React.FC<CourseHeroProps> = ({
    title,
    level,
    totalDuration,
}) => {
    return (
        <div className="rounded-2xl p-6 md:p-10 flex flex-col gap-3 relative overflow-hidden bg-gradient-to-br from-[#c084fc] to-[#6366f1] shadow-md">
            <span className="self-start text-[10px] font-bold bg-white/15 text-white px-2.5 py-0.5 rounded-md border border-white/20 tracking-wider uppercase backdrop-blur-sm">
                {level}
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold leading-tight text-white m-0 tracking-tight">
                {title}
            </h1>
            <div className="flex flex-wrap gap-4 text-xs text-white/90 font-medium mt-2">
                <span>⭐ 5.0 (Đánh giá)</span>
                <span>👥 120 học viên</span>
                <span>🕒 {totalDuration} phút</span>
            </div>
        </div>
    );
};
