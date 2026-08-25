import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../ThemeToggle';

interface CourseDetailHeaderProps {
    courseTitle: string;
    username: string;
    onLogout: () => void;
}

export const CourseDetailHeader: React.FC<CourseDetailHeaderProps> = ({
    courseTitle,
    username,
    onLogout,
}) => {
    const navigate = useNavigate();

    return (
        <>
            {/* Header đồng bộ */}
            <header className="flex justify-between items-center px-6 py-4 md:px-10 border-b border-border-custom bg-bg-secondary/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-200">
                <div className="flex items-center gap-2">
                    <span
                        className="text-2xl font-bold tracking-tight text-text-primary cursor-pointer no-underline"
                        onClick={() => navigate('/dashboard')}
                    >
                        MCODE
                    </span>
                    <span className="text-[9px] font-bold bg-accent-bg text-accent-custom px-1.5 py-0.5 rounded border border-accent-border tracking-wider uppercase">
                        SQL & PYTHON
                    </span>
                </div>
                <nav className="hidden md:flex gap-8">
                    <Link to="/dashboard" className="text-accent-custom font-semibold no-underline text-[13px] tracking-[0.8px]">
                        Dashboard
                    </Link>
                    <Link to="/practice-arena" className="text-text-tertiary hover:text-text-primary no-underline text-[13px] font-medium tracking-[0.8px] transition-colors duration-200">
                        Luyện tập
                    </Link>
                </nav>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent-custom text-white dark:text-[#030303] flex items-center justify-center font-bold text-sm">
                            {username.substring(0, 1).toUpperCase()}
                        </div>
                        <span className="text-sm font-semibold text-text-primary hidden sm:inline">{username}</span>
                        <button
                            className="text-xs text-text-tertiary hover:text-text-primary bg-transparent border border-border-custom hover:border-text-tertiary rounded-full px-3 py-1.5 cursor-pointer transition-colors"
                            onClick={onLogout}
                        >
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </header>

            {/* Breadcrumb điều hướng */}
            <div className="flex items-center flex-wrap gap-2 px-6 py-4 md:px-10 text-xs text-text-tertiary border-b border-border-custom bg-bg-secondary/40">
                <Link to="/dashboard" className="hover:text-text-primary transition-colors no-underline">Dashboard</Link>
                <span className="text-text-tertiary/50">&rarr;</span>
                <span className="hover:text-text-primary transition-colors no-underline">Khóa học</span>
                <span className="text-text-tertiary/50">&rarr;</span>
                <span className="text-text-primary font-medium">{courseTitle}</span>
            </div>
        </>
    );
};
