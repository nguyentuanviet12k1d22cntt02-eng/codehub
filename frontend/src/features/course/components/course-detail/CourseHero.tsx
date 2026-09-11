import React from 'react';
import { Star, Users, Clock, Sparkles } from 'lucide-react';

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
        <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#7C5CFC] p-6 sm:p-8 md:p-10 shadow-[0_10px_30px_-10px_rgba(37,99,235,0.3)] border border-white/15">
            {/* Background Decorative Circles */}
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-indigo-500/20 blur-xl pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between gap-6">
                {/* Left Content */}
                <div className="flex flex-col gap-3.5 max-w-2xl">
                    {/* Badge Level */}
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/25 tracking-wider uppercase shadow-xs">
                            <Sparkles className="w-3 h-3 text-amber-300" />
                            <span>CẤP ĐỘ: {level || 'BASIC'}</span>
                        </span>
                        <span className="text-[11px] font-semibold text-white/80 bg-black/20 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                            Khóa học thực chiến
                        </span>
                    </div>

                    {/* Course Title */}
                    <h1 className="text-2xl sm:text-3xl md:text-[32px] font-extrabold text-white leading-tight tracking-tight m-0 drop-shadow-xs">
                        {title}
                    </h1>

                    {/* Stats List */}
                    <div className="flex flex-wrap items-center gap-2.5 pt-1">
                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/15 shadow-xs">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            <span>5.0 (Đánh giá)</span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-white/95 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/15 shadow-xs">
                            <Users className="w-3.5 h-3.5 text-blue-200" />
                            <span>120 học viên</span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-white/95 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/15 shadow-xs">
                            <Clock className="w-3.5 h-3.5 text-indigo-200" />
                            <span>{totalDuration} phút</span>
                        </div>
                    </div>
                </div>

                {/* Right Visual Emblem */}
                <div className="hidden sm:flex flex-col items-center justify-center shrink-0">
                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl shadow-blue-900/30 flex items-center justify-center relative group">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-400/20 to-amber-300/20 opacity-50 group-hover:opacity-100 transition-opacity" />
                        <svg className="w-14 h-14 md:w-16 md:h-16 relative z-10 drop-shadow-md transform group-hover:scale-105 transition-transform duration-300" viewBox="0 0 128 128" fill="none">
                            <path d="M63.02 5.03c-28.75 0-26.97 12.47-26.97 12.47l.03 12.91h27.37v3.87H25.32C12.47 34.28 0 49.33 0 63.8c0 14.47 11.23 27.54 25.32 27.54h8.33v-11.83c0-13.48 11.66-25.31 25.34-25.31h27.17V34.28c0-13.23-11.45-29.25-23.14-29.25zm-14.7 9.07a4.27 4.27 0 1 1 0 8.53 4.27 4.27 0 0 1 0-8.53z" fill="url(#py-blue)" />
                            <path d="M64.98 122.97c28.75 0 26.97-12.47 26.97-12.47l-.03-12.91H64.55v-3.87h38.13c12.85 0 25.32-15.05 25.32-29.52 0-14.47-11.23-27.54-25.32-27.54h-8.33v11.83c0 13.48-11.66 25.31-25.34 25.31H42.84v19.92c0 13.23 11.45 29.25 23.14 29.25zm14.7-9.07a4.27 4.27 0 1 1 0-8.53 4.27 4.27 0 0 1 0 8.53z" fill="url(#py-yellow)" />
                            <defs>
                                <linearGradient id="py-blue" x1="0" y1="5" x2="90" y2="90" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#93C5FD" />
                                    <stop offset="1" stopColor="#3B82F6" />
                                </linearGradient>
                                <linearGradient id="py-yellow" x1="40" y1="40" x2="128" y2="123" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#FDE047" />
                                    <stop offset="1" stopColor="#F59E0B" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

