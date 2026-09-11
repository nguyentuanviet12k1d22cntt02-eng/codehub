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
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
                            <Code2 className="w-4.5 h-4.5" />
                        </div>
                        <span className="text-xl font-extrabold tracking-tight text-[#172033] dark:text-white">
                            MCODE
                        </span>
                    </div>
                    <span className="hidden sm:inline-flex items-center text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-full border border-blue-200/60 dark:border-blue-800/60 tracking-wider uppercase">
                        SQL & PYTHON
                    </span>
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
            <div className="bg-[#F8FAFC]/90 dark:bg-[#0D121F]/90 border-t border-slate-200/50 dark:border-slate-800/50 px-4 sm:px-6 md:px-8 py-2.5">
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

