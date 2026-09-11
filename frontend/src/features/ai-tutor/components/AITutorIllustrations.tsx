import React from 'react';

// Cute 3D-styled Robot Avatar matching user's exact uploaded image
export const RobotAvatar: React.FC<{ size?: number; className?: string; showOnline?: boolean }> = ({
    size = 40,
    className = '',
    showOnline = false
}) => (
    <div
        className={`relative flex items-center justify-center shrink-0 ${className}`}
        style={{ width: size, height: size }}
    >
        <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-xs"
        >
            {/* Soft outer circle ring */}
            <circle cx="50" cy="50" r="48" fill="#FFFFFF" />
            <circle cx="50" cy="50" r="47" stroke="#DBEAFE" strokeWidth="2" />

            {/* Blue Headphone Arc over Head */}
            <path
                d="M16 46 C16 18, 84 18, 84 46"
                stroke="#2563EB"
                strokeWidth="4.5"
                strokeLinecap="round"
                fill="none"
            />

            {/* Side Ear Cushions */}
            <rect x="10" y="40" width="8" height="24" rx="4" fill="#2563EB" />
            <rect x="82" y="40" width="8" height="24" rx="4" fill="#2563EB" />

            {/* White Robot Head Base */}
            <rect
                x="20"
                y="26"
                width="60"
                height="50"
                rx="18"
                fill="#FFFFFF"
                stroke="#EFF6FF"
                strokeWidth="1.5"
            />

            {/* Dark Visor Screen */}
            <rect x="27" y="36" width="46" height="28" rx="12" fill="#1E293B" />

            {/* Glowing Cyan-Blue Eyes */}
            <ellipse cx="38" cy="50" rx="5.5" ry="6.5" fill="#38BDF8" />
            <ellipse cx="62" cy="50" rx="5.5" ry="6.5" fill="#38BDF8" />

            {/* Eye Highlights */}
            <circle cx="40" cy="47.5" r="1.8" fill="#FFFFFF" />
            <circle cx="64" cy="47.5" r="1.8" fill="#FFFFFF" />

            {/* Cute Smile */}
            <path
                d="M44 68 Q50 72 56 68"
                stroke="#64748B"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
            />
        </svg>

        {showOnline && (
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-xs" />
        )}
    </div>
);

// Large Centered Mascot displayed when entering the chat before user asks anything
export const RobotStandingMascot: React.FC<{
    onSelectStarter?: (prompt: string) => void;
}> = ({ onSelectStarter }) => (
    <div className="flex flex-col items-center justify-center text-center p-6 max-w-md mx-auto my-auto animate-fade-in">
        {/* Glowing Aura & Mascot Avatar */}
        <div className="relative mb-5 flex items-center justify-center">
            <div className="absolute w-36 h-36 bg-blue-100 rounded-full blur-2xl opacity-70 animate-pulse" />
            <div className="relative transition-transform duration-300 hover:scale-105">
                <RobotAvatar size={96} showOnline={true} />
            </div>
        </div>

        {/* Title & Introduction */}
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            AI Tutor
            <span className="text-xs font-bold bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full border border-blue-100">
                Trợ lý thông minh
            </span>
        </h2>
        <p className="text-xs font-semibold text-blue-600 mt-1">
            Luôn sẵn sàng hỗ trợ bạn học lập trình! 💙
        </p>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed max-w-sm">
            Mình có thể giúp bạn giải thích khái niệm, viết code mẫu, sửa lỗi hoặc tạo bài tập thực hành theo năng lực. Hãy bắt đầu bằng cách nhập câu hỏi hoặc chọn gợi ý bên dưới!
        </p>

        {/* Quick Starter Pills */}
        {onSelectStarter && (
            <div className="flex flex-wrap justify-center gap-2 mt-5 w-full">
                <button
                    onClick={() => onSelectStarter('Giải thích giúp tôi khái niệm class trong Python bằng ví dụ đơn giản nhé!')}
                    className="text-xs bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 font-medium cursor-pointer"
                >
                    <span>💡 Khái niệm Class & Object</span>
                </button>
                <button
                    onClick={() => onSelectStarter('Hãy viết cho tôi một hàm Python để lọc các số chẵn trong danh sách và tính tổng.')}
                    className="text-xs bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 font-medium cursor-pointer"
                >
                    <span>🐍 Viết hàm xử lý List</span>
                </button>
                <button
                    onClick={() => onSelectStarter('Hãy tạo cho tôi 1 bài tập thực hành Python thích ứng theo năng lực của tôi.')}
                    className="text-xs bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 font-medium cursor-pointer"
                >
                    <span>🎯 Tạo bài tập thích ứng</span>
                </button>
            </div>
        )}
    </div>
);

// Clean User Profile Avatar
export const UserAvatar: React.FC<{ size?: number; className?: string }> = ({
    size = 40,
    className = ''
}) => (
    <div
        className={`relative flex items-center justify-center shrink-0 rounded-full bg-[#E0EDFF] border border-blue-200/70 text-blue-600 shadow-xs ${className}`}
        style={{ width: size, height: size }}
    >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-500">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
    </div>
);

// Sidebar Left Bottom Illustration: Robot at desk with laptop & lightbulb
export const RobotHelpCardIllustration: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`w-full flex justify-center items-center ${className}`}>
        <svg viewBox="0 0 160 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 h-auto">
            <circle cx="80" cy="65" r="42" fill="#DBEAFE" fillOpacity="0.7" />

            <g transform="translate(118, 18)">
                <circle cx="10" cy="10" r="9" fill="#FBBF24" />
                <path d="M7 19h6v3H7z" fill="#D97706" />
                <line x1="10" y1="-2" x2="10" y2="2" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
                <line x1="20" y1="5" x2="23" y2="2" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
                <line x1="-1" y1="5" x2="2" y2="8" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
            </g>

            <path d="M30 35L32 30L34 35L39 37L34 39L32 44L30 39L25 37Z" fill="#60A5FA" opacity="0.6" />
            <path d="M135 60L136.5 56L138 60L142 61.5L138 63L136.5 67L135 63L131 61.5Z" fill="#93C5FD" opacity="0.8" />

            <rect x="52" y="32" width="46" height="38" rx="14" fill="#FFFFFF" stroke="#DBEAFE" strokeWidth="2" />
            <rect x="44" y="42" width="6" height="18" rx="3" fill="#3B82F6" />
            <rect x="100" y="42" width="6" height="18" rx="3" fill="#3B82F6" />
            <path d="M49 46 C49 24, 101 24, 101 46" stroke="#60A5FA" strokeWidth="3.5" strokeLinecap="round" fill="none" />

            <rect x="58" y="40" width="34" height="20" rx="9" fill="#1E293B" />
            <ellipse cx="67" cy="50" rx="4" ry="5" fill="#38BDF8" />
            <ellipse cx="83" cy="50" rx="4" ry="5" fill="#38BDF8" />
            <circle cx="68.5" cy="48" r="1.3" fill="#FFFFFF" />
            <circle cx="84.5" cy="48" r="1.3" fill="#FFFFFF" />

            <rect x="15" y="98" width="130" height="4" rx="2" fill="#BFDBFE" />

            <path d="M85 82 L105 82 L112 98 L78 98 Z" fill="#6366F1" />
            <rect x="86" y="83" width="18" height="12" rx="2" fill="#4F46E5" />
            <rect x="88" y="85" width="14" height="8" rx="1" fill="#C7D2FE" />

            <rect x="62" y="72" width="26" height="24" rx="8" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
            <rect x="52" y="84" width="18" height="8" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
            <rect x="80" y="86" width="16" height="8" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
        </svg>
    </div>
);

// Sidebar Right Motivation Illustration: Mountain Peak with Flag
export const MountainMotivationIllustration: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`w-full flex justify-end ${className}`}>
        <svg viewBox="0 0 120 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-28 h-auto">
            <path d="M10 70 L45 35 L80 70 Z" fill="#BFDBFE" fillOpacity="0.5" />
            <path d="M60 70 L95 25 L130 70 Z" fill="#C7D2FE" fillOpacity="0.6" />

            <path d="M40 70 L80 16 L120 70 Z" fill="#818CF8" />
            <path d="M80 16 L92 34 L82 30 L74 35 L68 32 Z" fill="#EEF2FF" />
            <path d="M80 16 L120 70 L80 70 Z" fill="#6366F1" fillOpacity="0.4" />

            <line x1="80" y1="16" x2="80" y2="4" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" />
            <path d="M80 4 L95 9 L80 14 Z" fill="#4F46E5" />

            <ellipse cx="25" cy="22" rx="10" ry="4" fill="#FFFFFF" fillOpacity="0.8" />
            <ellipse cx="108" cy="28" rx="8" ry="3.5" fill="#FFFFFF" fillOpacity="0.8" />
        </svg>
    </div>
);

// Mascot Waving Banner with Speech Bubble matching the exact top-right illustration in the user's mockup
export const MascotWavingBannerIllustration: React.FC<{ className?: string; speechText?: string }> = ({ 
    className = '',
    speechText = 'Cố lên bạn nhé! 💙'
}) => (
    <div className={`relative flex items-center select-none ${className}`}>
        {/* Speech Bubble */}
        <div className="mr-3 mb-6 bg-white/95 backdrop-blur-xs border border-blue-200/80 px-3 py-1.5 rounded-2xl shadow-xs text-xs font-bold text-blue-600 flex items-center gap-1.5 whitespace-nowrap animate-bounce" style={{ animationDuration: '2.5s' }}>
            <span>{speechText}</span>
            {/* Bubble Tail */}
            <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-t border-r border-blue-200/80 rotate-45 transform" />
        </div>

        {/* Mascot Robot + Laptop SVG */}
        <svg viewBox="0 0 130 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-28 h-auto drop-shadow-xs">
            {/* Decorative soft blue swoosh */}
            <path d="M5 68 C35 50, 85 45, 125 65" stroke="#BFDBFE" strokeWidth="4" strokeLinecap="round" strokeDasharray="3 5" opacity="0.6" />
            
            {/* Laptop Base */}
            <rect x="18" y="58" width="34" height="4" rx="2" fill="#94A3B8" />
            <path d="M22 42 L48 42 L52 58 L18 58 Z" fill="#3B82F6" rx="2" />
            <rect x="24" y="44" width="22" height="12" rx="1.5" fill="#1E293B" />
            {/* Code symbol on screen */}
            <text x="31" y="53" fill="#38BDF8" fontSize="8" fontFamily="monospace" fontWeight="bold">&lt;/&gt;</text>

            {/* Robot Body */}
            <rect x="52" y="38" width="38" height="32" rx="12" fill="#FFFFFF" stroke="#DBEAFE" strokeWidth="2" />
            <rect x="58" y="44" width="26" height="18" rx="6" fill="#F1F5F9" />
            
            {/* Robot Head */}
            <rect x="54" y="14" width="34" height="26" rx="9" fill="#FFFFFF" stroke="#DBEAFE" strokeWidth="2" />
            {/* Headphones */}
            <path d="M52 24 C52 10, 90 10, 90 24" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" fill="none" />
            <rect x="49" y="20" width="5" height="10" rx="2" fill="#2563EB" />
            <rect x="88" y="20" width="5" height="10" rx="2" fill="#2563EB" />

            {/* Visor Screen */}
            <rect x="59" y="18" width="24" height="15" rx="6" fill="#1E293B" />
            {/* Cyan Eyes */}
            <circle cx="66" cy="25" r="2.5" fill="#38BDF8" />
            <circle cx="76" cy="25" r="2.5" fill="#38BDF8" />
            <circle cx="67" cy="24" r="0.8" fill="#FFFFFF" />
            <circle cx="77" cy="24" r="0.8" fill="#FFFFFF" />

            {/* Cute Smile */}
            <path d="M68 35 Q71 37 74 35" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" fill="none" />

            {/* Waving Right Hand */}
            <path d="M88 44 C95 38, 98 28, 96 22" stroke="#2563EB" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="96" cy="20" r="4.5" fill="#60A5FA" stroke="#2563EB" strokeWidth="1.5" />
            
            {/* Little Sparkles */}
            <path d="M106 14 L108 10 L110 14 L114 16 L110 18 L108 22 L106 18 L102 16 Z" fill="#F59E0B" />
            <path d="M116 28 L117 25 L118 28 L121 29 L118 30 L117 33 L116 30 L113 29 Z" fill="#60A5FA" opacity="0.8" />
        </svg>
    </div>
);

