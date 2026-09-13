import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../../../../components/ThemeToggle';
import UserMenuDropdown from '../../../../components/UserMenuDropdown';
import { ChevronRight, Home, BookOpen, Code2 } from 'lucide-react';

interface CourseDetailHeaderProps {
    courseTitle: string;
    username?: string;
    onLogout?: () => void;
}

export const CourseDetailHeader: React.FC<CourseDetailHeaderProps> = ({
    courseTitle,
}) => {
    const navigate = useNavigate();

    return (
        <div className="sticky top-0 z-50 w-full bg-white/90 dark:bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-200/70 dark:border-slate-800/80 transition-colors duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            {/* Header chính */}
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6 md:px-8 h-15 flex items-center justify-between">
                {/* Logo & Badge */}
                <div className="flex items-center gap-3">
                    <div
                        className="flex items-center gap-2.5 cursor-pointer select-none group"
                        onClick={() => navigate('/dashboard')}
                    >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform ${
                            /c\+\+/i.test(courseTitle)
                                ? 'bg-gradient-to-tr from-[#0B2948] to-[#0089C9] text-white shadow-sky-500/25'
                                : /sql/i.test(courseTitle)
                                ? 'bg-gradient-to-tr from-[#003366] to-[#00758F] text-white shadow-teal-500/25'
                                : /javascript|js\b/i.test(courseTitle)
                                ? 'bg-[#111111] text-[#F7DF1E] font-black border border-black shadow-xs'
                                : 'bg-gradient-to-tr from-[#306998] to-[#4B8BBE] text-white shadow-sky-500/20'
                        }`}>
                            <Code2 className="w-4.5 h-4.5" />
                        </div>
                        <span className="text-xl font-extrabold tracking-tight text-[#172033] dark:text-white">
                            MCODE
                        </span>
                    </div>

                    {/c\+\+/i.test(courseTitle) ? (
                        <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 px-2.5 py-0.5 rounded-full border border-sky-200/60 dark:border-sky-800/60 tracking-wider uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0089C9] animate-pulse" />
                            C++ MODERN
                        </span>
                    ) : /sql/i.test(courseTitle) ? (
                        <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-bold text-[#00758F] dark:text-teal-300 bg-[#F4F6F9] dark:bg-slate-900 px-2.5 py-0.5 rounded-full border border-[#00758F]/30 dark:border-teal-800/60 tracking-wider uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F29111] animate-pulse" />
                            SQL DATABASE
                        </span>
                    ) : /javascript|js\b/i.test(courseTitle) ? (
                        <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-black text-[#F7DF1E] bg-[#111111] px-2.5 py-0.5 rounded-full border border-black tracking-wider uppercase shadow-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F7DF1E] animate-pulse" />
                            JS ES6+
                        </span>
                    ) : (
                        <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-bold text-[#306998] dark:text-[#FFE873] bg-sky-50 dark:bg-slate-900 px-2.5 py-0.5 rounded-full border border-[#306998]/30 dark:border-sky-800/60 tracking-wider uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FFE873] animate-pulse" />
                            PYTHON CORE
                        </span>
                    )}
                </div>

                {/* Navigation Links */}
                <nav className="hidden md:flex items-center gap-1 bg-slate-100/60 dark:bg-slate-800/40 p-1 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                    <Link
                        to="/dashboard"
                        className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-700/80 shadow-xs no-underline transition-all"
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/practice-arena"
                        className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-[#172033] dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/40 no-underline transition-all"
                    >
                        Luyện tập
                    </Link>
                </nav>

                {/* Theme & User Profile */}
                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <UserMenuDropdown />
                </div>
            </div>

            {/* Breadcrumb điều hướng hiện đại */}
            <div className={`${
                /sql/i.test(courseTitle)
                    ? 'bg-[#F4F6F9]/90'
                    : /javascript|js\b/i.test(courseTitle)
                    ? 'bg-[#FFFDF2]/90'
                    : 'bg-[#F8FAFC]/90'
            } dark:bg-[#0D121F]/90 border-t border-slate-200/50 dark:border-slate-800/50 px-4 sm:px-6 md:px-8 py-2.5`}>
                <div className="max-w-[1240px] mx-auto flex items-center flex-wrap gap-1.5 text-[12px] text-slate-500 dark:text-slate-400">
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-1 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors no-underline font-medium"
                    >
                        <Home className="w-3.5 h-3.5" />
                        <span>Dashboard</span>
                    </Link>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" />
                    <span className="flex items-center gap-1 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors no-underline font-medium">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Khóa học</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" />
                    <span className="text-[#172033] dark:text-white font-semibold truncate max-w-[260px] sm:max-w-md">
                        {courseTitle}
                    </span>
                </div>
            </div>
        </div>
    );
};

