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
    const isJs = /javascript|js\b/i.test(title);

    // Dynamic Gradient and Shadow per Language
    const heroBg = isCpp
        ? 'bg-gradient-to-br from-[#0B2948] to-[#0089C9] shadow-[0_12px_36px_-8px_rgba(0,137,201,0.4)] border-sky-400/25'
        : isSql
        ? 'bg-gradient-to-br from-[#003366] to-[#00758F] shadow-[0_12px_36px_-8px_rgba(0,117,143,0.35)] border-teal-400/25'
        : isJs
        ? 'bg-gradient-to-br from-[#F7DF1E] to-[#FFE94A] shadow-[0_16px_40px_-10px_rgba(247,223,30,0.45)] border border-[#D9B800]'
        : 'bg-gradient-to-br from-[#306998] to-[#4B8BBE] shadow-[0_10px_30px_-10px_rgba(48,105,152,0.35)] border-sky-400/20';

    return (
        <div className={`relative overflow-hidden rounded-[24px] ${heroBg} p-6 sm:p-8 md:p-10 border transition-all duration-300`}>
            {/* Background Decorative Lighting */}
            <div className={`absolute -top-24 -right-24 w-72 h-72 rounded-full blur-2xl pointer-events-none ${isCpp ? 'bg-[#0089C9]/25' : isSql ? 'bg-[#00758F]/20' : isJs ? 'bg-white/40' : 'bg-[#4B8BBE]/20'}`} />
            <div className={`absolute -bottom-20 -left-20 w-60 h-60 rounded-full blur-xl pointer-events-none ${isCpp ? 'bg-[#0B2948]/60' : isSql ? 'bg-[#003366]/60' : isJs ? 'bg-[#FFE94A]/70' : 'bg-[#306998]/40'}`} />

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

            {/* SQL Code Background Watermark */}
            {isSql && (
                <div className="absolute right-36 top-1/2 -translate-y-1/2 opacity-15 font-mono text-[11px] text-teal-100 pointer-events-none select-none hidden xl:block leading-5 tracking-tight">
                    <div>SELECT course_id, title</div>
                    <div>FROM relational_db</div>
                    <div className="text-teal-200">WHERE status = 'ACTIVE'</div>
                    <div className="pl-3 text-[#F29111]">ORDER BY created_at DESC;</div>
                </div>
            )}

            {/* JavaScript Code Background Watermark */}
            {isJs && (
                <div className="absolute right-36 top-1/2 -translate-y-1/2 opacity-15 font-mono text-[11px] text-[#111111] pointer-events-none select-none hidden xl:block leading-5 tracking-tight font-semibold">
                    <div>const v8Engine = new V8Engine();</div>
                    <div>const runAsync = async () =&gt; &#123;</div>
                    <div className="text-[#1F2937] pl-3">const res = await fetch('/api');</div>
                    <div className="pl-3 text-[#111111] font-bold">console.log("ES6+ Modern JS");</div>
                    <div>&#125;;</div>
                </div>
            )}

            {/* Python Code Background Watermark */}
            {!isCpp && !isSql && !isJs && (
                <div className="absolute right-36 top-1/2 -translate-y-1/2 opacity-15 font-mono text-[11px] text-sky-100 pointer-events-none select-none hidden xl:block leading-5 tracking-tight">
                    <div>def main() -&gt; None:</div>
                    <div className="pl-3 text-sky-200">dataset = [x for x in range(100)]</div>
                    <div className="pl-3 text-[#FFE873]">print(f"Python 3: &#123;len(dataset)&#125;")</div>
                    <div>if __name__ == '__main__': main()</div>
                </div>
            )}

            <div className="relative z-10 flex items-center justify-between gap-6">
                {/* Left Content */}
                <div className="flex flex-col gap-3.5 max-w-2xl text-left">
                    {/* Badge Level */}
                    <div className="flex flex-wrap items-center gap-2">
                        {isJs ? (
                            <>
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-black bg-[#111111] text-[#F7DF1E] px-3.5 py-1 rounded-full border border-black/80 tracking-wider uppercase shadow-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#F7DF1E] animate-pulse" />
                                    JS ES6+
                                </span>

                                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold bg-[#111111]/90 text-white px-3 py-1 rounded-full border border-black/20 tracking-wider uppercase shadow-xs">
                                    <Sparkles className="w-3 h-3 text-[#F7DF1E]" />
                                    <span>CẤP ĐỘ: {level || 'BASIC'}</span>
                                </span>

                                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold bg-[#1F2937]/90 text-white px-3 py-1 rounded-full border border-black/20 tracking-wide">
                                    <Terminal className="w-3 h-3 text-[#F7DF1E]" />
                                    <span>V8 Engine • Modern Syntax</span>
                                </span>
                            </>
                        ) : (
                            <>
                                <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold text-white px-3 py-1 rounded-full border tracking-wider uppercase shadow-xs backdrop-blur-md ${
                                    isCpp
                                        ? 'bg-sky-500/25 border-sky-300/35 text-sky-100'
                                        : isSql
                                        ? 'bg-[#003366]/60 border-teal-400/30 text-teal-100'
                                        : 'bg-[#24292E]/60 border-[#FFE873]/30 text-[#FFE873]'
                                }`}>
                                    <Sparkles className={`w-3 h-3 ${isCpp ? 'text-cyan-300' : isSql ? 'text-[#F29111]' : 'text-[#FFE873]'}`} />
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
                                        <>
                                            <Terminal className="w-3 h-3 text-[#FFE873]" />
                                            <span>Python 3 Core &amp; Data</span>
                                        </>
                                    )}
                                </span>

                                {isCpp && (
                                    <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-200 bg-cyan-950/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-cyan-400/20">
                                        <Cpu className="w-3 h-3 text-cyan-300" />
                                        <span>Hệ thống &amp; Thuật toán</span>
                                    </span>
                                )}
                            </>
                        )}
                    </div>

                    {/* Course Title */}
                    <h1 className={`text-2xl sm:text-3xl md:text-[32px] font-black leading-tight tracking-tight m-0 ${
                        isJs ? 'text-[#111111]' : 'text-white drop-shadow-xs'
                    }`}>
                        {title}
                    </h1>

                    {/* Stats List */}
                    <div className="flex flex-wrap items-center gap-2.5 pt-1">
                        {isJs ? (
                            <>
                                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#111111] bg-white px-3 py-1.5 rounded-xl border border-black/10 shadow-xs">
                                    <Star className="w-3.5 h-3.5 text-[#D9B800] fill-[#D9B800]" />
                                    <span>5.0 (Đánh giá)</span>
                                </div>
                                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#111111] bg-white px-3 py-1.5 rounded-xl border border-black/10 shadow-xs">
                                    <Users className="w-3.5 h-3.5 text-[#1F2937]" />
                                    <span>120 học viên</span>
                                </div>
                                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#111111] bg-white px-3 py-1.5 rounded-xl border border-black/10 shadow-xs">
                                    <Clock className="w-3.5 h-3.5 text-[#1F2937]" />
                                    <span>{totalDuration} phút</span>
                                </div>
                            </>
                        ) : (
                            <>
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
                            </>
                        )}
                    </div>
                </div>

                {/* Right Visual Emblem */}
                <div className="hidden sm:flex flex-col items-center justify-center shrink-0">
                    <div className={`w-24 h-24 md:w-28 md:h-28 rounded-2xl flex items-center justify-center relative group transition-all duration-300 ${
                        isCpp
                            ? 'backdrop-blur-md border border-sky-400/35 bg-gradient-to-b from-[#0B2948]/70 to-[#0089C9]/40 shadow-2xl shadow-sky-950/70'
                            : isSql
                            ? 'backdrop-blur-md border border-teal-400/35 bg-gradient-to-b from-[#003366]/70 to-[#00758F]/40 shadow-2xl shadow-teal-950/70'
                            : isJs
                            ? 'bg-[#111111] border-2 border-black shadow-[0_12px_32px_rgba(0,0,0,0.35)]'
                            : 'backdrop-blur-md border border-sky-400/30 bg-gradient-to-b from-[#306998]/70 to-[#4B8BBE]/40 shadow-2xl shadow-blue-950/60'
                    }`}>
                        <div className={`absolute inset-0 rounded-2xl transition-opacity ${
                            isCpp
                                ? 'opacity-50 group-hover:opacity-100 bg-gradient-to-tr from-[#0B2948]/30 to-[#0089C9]/30'
                                : isSql
                                ? 'opacity-50 group-hover:opacity-100 bg-gradient-to-tr from-[#003366]/30 to-[#00758F]/30'
                                : isJs
                                ? 'opacity-20 group-hover:opacity-30 bg-gradient-to-tr from-[#FFE94A] to-transparent pointer-events-none'
                                : 'opacity-50 group-hover:opacity-100 bg-gradient-to-tr from-[#306998]/30 to-[#4B8BBE]/30'
                        }`} />

                        {isCpp ? (
                            /* C++ Authentic Hexagonal Shield Emblem */
                            <svg className="w-16 h-16 md:w-18 md:h-18 relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] transform group-hover:scale-110 transition-transform duration-300" viewBox="0 0 128 128" fill="none">
                                <defs>
                                    <linearGradient id="cpp-shield" x1="20" y1="10" x2="108" y2="118" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#0089C9" />
                                        <stop offset="0.5" stopColor="#054A78" />
                                        <stop offset="1" stopColor="#0B2948" />
                                    </linearGradient>
                                    <linearGradient id="cpp-plus1" x1="0" y1="0" x2="1" y2="1">
                                        <stop stopColor="#67E8F9" />
                                        <stop offset="1" stopColor="#0089C9" />
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
                            /* SQL Database Emblem (Deep Blue #003366 & #00758F with subtle #F29111 accent) */
                            <svg className="w-14 h-14 md:w-16 md:h-16 relative z-10 drop-shadow-md transform group-hover:scale-105 transition-transform duration-300" viewBox="0 0 128 128" fill="none">
                                <ellipse cx="64" cy="32" rx="42" ry="18" fill="#00758F" />
                                <path d="M22 32 V64 C22 74 41 82 64 82 C87 82 106 74 106 64 V32" fill="#003366" />
                                <ellipse cx="64" cy="64" rx="42" ry="18" fill="#008EA8" />
                                <path d="M22 64 V96 C22 106 41 114 64 114 C87 114 106 106 106 96 V64" fill="#002244" />
                                <ellipse cx="64" cy="96" rx="42" ry="18" fill="#00758F" />
                                <circle cx="92" cy="32" r="3.5" fill="#F29111" />
                            </svg>
                        ) : isJs ? (
                            /* JavaScript Official Logo in Dark High-Contrast Frame */
                            <div className="relative group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_4px_16px_rgba(247,223,30,0.5)]">
                                <svg className="w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden shadow-inner" viewBox="0 0 630 630" fill="none">
                                    <rect width="630" height="630" rx="72" fill="#F7DF1E" />
                                    <path d="m423.2 492.19c12.69 20.72 29.2 35.95 58.4 35.95 24.53 0 40.2-12.26 40.2-29.2 0-20.3-16.1-27.49-43.1-39.3l-14.8-6.35c-42.72-18.2-71.1-41-71.1-89.2 0-44.4 33.83-78.2 86.7-78.2 37.64 0 64.7 13.1 84.2 47.4l-46.1 29.6c-10.15-18.2-21.1-25.39-38.1-25.39-17.3 0-28.3 11-28.3 25.4 0 17.7 11 24.96 36.4 35.94l14.8 6.34c50.3 21.57 78.7 43.56 78.7 93 0 53.3-41.87 82.5-98.1 82.5-54.98 0-90.5-26.2-107.88-60.5zm-209.13 5.13c9.3 16.5 17.76 30.45 38.1 30.45 19.46 0 31.72-7.61 31.72-37.2v-201.3h59.2v202.1c0 61.3-35.94 89.2-88.4 89.2-47.4 0-74.85-24.53-88.81-54.075z" fill="#111111" />
                                </svg>
                            </div>
                        ) : (
                            /* Python Snake Emblem (Authentic Blue #306998 & Yellow #FFE873) */
                            <svg className="w-14 h-14 md:w-16 md:h-16 relative z-10 drop-shadow-md transform group-hover:scale-105 transition-transform duration-300" viewBox="0 0 128 128" fill="none">
                                <path d="M63.02 5.03c-28.75 0-26.97 12.47-26.97 12.47l.03 12.91h27.37v3.87H25.32C12.47 34.28 0 49.33 0 63.8c0 14.47 11.23 27.54 25.32 27.54h8.33v-11.83c0-13.48 11.66-25.31 25.34-25.31h27.17V34.28c0-13.23-11.45-29.25-23.14-29.25zm-14.7 9.07a4.27 4.27 0 1 1 0 8.53 4.27 4.27 0 0 1 0-8.53z" fill="url(#py-blue)" />
                                <path d="M64.98 122.97c28.75 0 26.97-12.47 26.97-12.47l-.03-12.91H64.55v-3.87h38.13c12.85 0 25.32-15.05 25.32-29.52 0-14.47-11.23-27.54-25.32-27.54h-8.33v11.83c0 13.48-11.66 25.31-25.34 25.31H42.84v19.92c0 13.23 11.45 29.25 23.14 29.25zm14.7-9.07a4.27 4.27 0 1 1 0-8.53 4.27 4.27 0 0 1 0 8.53z" fill="url(#py-yellow)" />
                                <defs>
                                    <linearGradient id="py-blue" x1="0" y1="5" x2="90" y2="90" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#4B8BBE" />
                                        <stop offset="1" stopColor="#306998" />
                                    </linearGradient>
                                    <linearGradient id="py-yellow" x1="40" y1="40" x2="128" y2="123" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#FFE873" />
                                        <stop offset="1" stopColor="#FFD43B" />
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




