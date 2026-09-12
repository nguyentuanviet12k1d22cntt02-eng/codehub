import React from 'react';
import { Star, Users, Clock, Sparkles, Terminal, Cpu, Database } from 'lucide-react';

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
    const isCpp = /c\+\+/i.test(title);
    const isSql = /sql/i.test(title);

    // Dynamic Gradient and Shadow per Language
    const heroBg = isCpp
        ? 'bg-gradient-to-br from-[#0B1E38] via-[#004482] to-[#0284C7] shadow-[0_12px_36px_-8px_rgba(2,132,199,0.4)] border-sky-400/25'
        : isSql
        ? 'bg-gradient-to-br from-[#0B1727] via-[#0C4A6E] to-[#0D9488] shadow-[0_12px_36px_-8px_rgba(13,148,136,0.35)] border-teal-400/25'
        : 'bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#7C5CFC] shadow-[0_10px_30px_-10px_rgba(37,99,235,0.3)] border-white/15';

    return (
        <div className={`relative overflow-hidden rounded-[20px] ${heroBg} p-6 sm:p-8 md:p-10 border transition-all duration-300`}>
            {/* Background Decorative Lighting */}
            <div className={`absolute -top-24 -right-24 w-72 h-72 rounded-full blur-2xl pointer-events-none ${isCpp ? 'bg-sky-400/25' : isSql ? 'bg-teal-400/20' : 'bg-white/10'}`} />
            <div className={`absolute -bottom-20 -left-20 w-60 h-60 rounded-full blur-xl pointer-events-none ${isCpp ? 'bg-blue-600/30' : isSql ? 'bg-cyan-600/25' : 'bg-indigo-500/20'}`} />

            {/* C++ Code Background Watermark */}
            {isCpp && (
                <div className="absolute right-36 top-1/2 -translate-y-1/2 opacity-15 font-mono text-[11px] text-sky-200 pointer-events-none select-none hidden xl:block leading-5 tracking-tight">
                    <div>#include &lt;iostream&gt;</div>
                    <div>#include &lt;vector&gt;</div>
                    <div className="text-sky-300">template &lt;typename T&gt;</div>
                    <div>int main() &#123;</div>
                    <div className="pl-3 text-cyan-200">std::cout &lt;&lt; "C++17 Fast &amp; Modern";</div>
                    <div className="pl-3">return 0;</div>
                    <div>&#125;</div>
                </div>
            )}

            <div className="relative z-10 flex items-center justify-between gap-6">
                {/* Left Content */}
                <div className="flex flex-col gap-3.5 max-w-2xl text-left">
                    {/* Badge Level */}
                    <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold text-white px-3 py-1 rounded-full border tracking-wider uppercase shadow-xs backdrop-blur-md ${
                            isCpp
                                ? 'bg-sky-500/25 border-sky-300/35 text-sky-100'
                                : isSql
                                ? 'bg-teal-500/25 border-teal-300/35 text-teal-100'
                                : 'bg-white/20 border-white/25'
                        }`}>
                            <Sparkles className={`w-3 h-3 ${isCpp ? 'text-cyan-300' : 'text-amber-300'}`} />
                            <span>CẤP ĐỘ: {level || 'BASIC'}</span>
                        </span>

                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-white/90 bg-black/25 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                            {isCpp ? (
                                <>
                                    <Terminal className="w-3 h-3 text-sky-300" />
                                    <span>Chuẩn C++17 Hiện Đại</span>
                                </>
                            ) : isSql ? (
                                <>
                                    <Database className="w-3 h-3 text-teal-300" />
                                    <span>T-SQL / Relational DB</span>
                                </>
                            ) : (
                                <span>Khóa học thực chiến</span>
                            )}
                        </span>

                        {isCpp && (
                            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-200 bg-cyan-950/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-cyan-400/20">
                                <Cpu className="w-3 h-3 text-cyan-300" />
                                <span>Hệ thống &amp; Thuật toán</span>
                            </span>
                        )}
                    </div>

                    {/* Course Title */}
                    <h1 className="text-2xl sm:text-3xl md:text-[32px] font-extrabold text-white leading-tight tracking-tight m-0 drop-shadow-xs">
                        {title}
                    </h1>

                    {/* Stats List */}
                    <div className="flex flex-wrap items-center gap-2.5 pt-1">
                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-black/25 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/15 shadow-xs">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            <span>5.0 (Đánh giá)</span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-white/95 bg-black/25 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/15 shadow-xs">
                            <Users className="w-3.5 h-3.5 text-sky-200" />
                            <span>120 học viên</span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-white/95 bg-black/25 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/15 shadow-xs">
                            <Clock className="w-3.5 h-3.5 text-sky-200" />
                            <span>{totalDuration} phút</span>
                        </div>
                    </div>
                </div>

                {/* Right Visual Emblem */}
                <div className="hidden sm:flex flex-col items-center justify-center shrink-0">
                    <div className={`w-24 h-24 md:w-28 md:h-28 rounded-2xl backdrop-blur-md border shadow-2xl flex items-center justify-center relative group transition-all duration-300 ${
                        isCpp
                            ? 'bg-gradient-to-b from-sky-500/20 to-[#003B6F]/60 border-sky-400/35 shadow-sky-950/70'
                            : isSql
                            ? 'bg-gradient-to-b from-teal-500/20 to-slate-900/60 border-teal-400/35 shadow-teal-950/70'
                            : 'bg-white/10 border-white/20 shadow-blue-900/30'
                    }`}>
                        <div className={`absolute inset-0 rounded-2xl opacity-50 group-hover:opacity-100 transition-opacity ${
                            isCpp
                                ? 'bg-gradient-to-tr from-cyan-400/25 to-sky-300/25'
                                : isSql
                                ? 'bg-gradient-to-tr from-teal-400/25 to-emerald-300/25'
                                : 'bg-gradient-to-tr from-blue-400/20 to-amber-300/20'
                        }`} />

                        {isCpp ? (
                            /* C++ Authentic Hexagonal Shield Emblem */
                            <svg className="w-16 h-16 md:w-18 md:h-18 relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] transform group-hover:scale-110 transition-transform duration-300" viewBox="0 0 128 128" fill="none">
                                <defs>
                                    <linearGradient id="cpp-shield" x1="20" y1="10" x2="108" y2="118" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#0284C7" />
                                        <stop offset="0.5" stopColor="#00599C" />
                                        <stop offset="1" stopColor="#003366" />
                                    </linearGradient>
                                    <linearGradient id="cpp-plus1" x1="0" y1="0" x2="1" y2="1">
                                        <stop stopColor="#67E8F9" />
                                        <stop offset="1" stopColor="#0284C7" />
                                    </linearGradient>
                                    <linearGradient id="cpp-plus2" x1="0" y1="0" x2="1" y2="1">
                                        <stop stopColor="#BAE6FD" />
                                        <stop offset="1" stopColor="#38BDF8" />
                                    </linearGradient>
                                    <filter id="cpp-glow" x="-20%" y="-20%" width="140%" height="140%">
                                        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#38BDF8" floodOpacity="0.6"/>
                                    </filter>
                                </defs>

                                {/* Hexagon Shield */}
                                <polygon points="64,10 114,38 114,90 64,118 14,90 14,38" fill="url(#cpp-shield)" stroke="#38BDF8" strokeWidth="2.5" strokeOpacity="0.8"/>
                                {/* Top facet highlight */}
                                <polygon points="64,10 114,38 64,64 14,38" fill="#ffffff" fillOpacity="0.14"/>
                                {/* Right facet shadow */}
                                <polygon points="64,64 114,38 114,90 64,118" fill="#000000" fillOpacity="0.2"/>

                                {/* Bold White Letter 'C' */}
                                <path d="M56 42 C40 42 30 51 30 64 C30 77 40 86 56 86 C64 86 70 82 73 78 L66 70 C64 72 60 74 56 74 C47 74 42 69 42 64 C42 59 47 54 56 54 C60 54 64 56 66 58 L73 50 C70 46 64 42 56 42 Z" fill="#FFFFFF" filter="url(#cpp-glow)"/>

                                {/* First '+' Sign */}
                                <path d="M78 57 H84 V51 H89 V57 H95 V62 H89 V68 H84 V62 H78 Z" fill="url(#cpp-plus1)"/>
                                
                                {/* Second '+' Sign */}
                                <path d="M96 66 H102 V60 H107 V66 H113 V71 H107 V77 H102 V71 H96 Z" fill="url(#cpp-plus2)"/>
                            </svg>
                        ) : isSql ? (
                            /* SQL Database Emblem */
                            <svg className="w-14 h-14 md:w-16 md:h-16 relative z-10 drop-shadow-md transform group-hover:scale-105 transition-transform duration-300" viewBox="0 0 128 128" fill="none">
                                <ellipse cx="64" cy="32" rx="42" ry="18" fill="#2DD4BF" />
                                <path d="M22 32 V64 C22 74 41 82 64 82 C87 82 106 74 106 64 V32" fill="#0D9488" />
                                <ellipse cx="64" cy="64" rx="42" ry="18" fill="#14B8A6" />
                                <path d="M22 64 V96 C22 106 41 114 64 114 C87 114 106 106 106 96 V64" fill="#0F766E" />
                                <ellipse cx="64" cy="96" rx="42" ry="18" fill="#0D9488" />
                            </svg>
                        ) : (
                            /* Python Snake Emblem */
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
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

