import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../ThemeToggle';

interface LessonHeaderProps {
    lessonTitle: string;
}

export const LessonHeader: React.FC<LessonHeaderProps> = ({ lessonTitle }) => {
    const navigate = useNavigate();

    return (
        <header className="h-14 border-b border-border-custom bg-bg-secondary px-6 md:px-12 flex justify-between items-center shrink-0 sticky top-0 z-50 transition-colors duration-200">
            <div className="flex items-center gap-3">
                <span
                    className="text-xl font-bold tracking-tight text-text-primary cursor-pointer hover:text-accent-custom transition-colors"
                    onClick={() => navigate('/dashboard')}
                >
                    MCODE
                </span>
                <div className="h-4 w-[1px] bg-border-custom"></div>
                <span className="text-xs text-text-tertiary font-medium truncate max-w-xs sm:max-w-md">
                    Lý thuyết bài học: <span className="text-text-primary font-semibold">{lessonTitle}</span>
                </span>
            </div>

            <div className="flex items-center gap-4">
                <ThemeToggle />
                <Link
                    to="/dashboard"
                    className="text-xs text-text-secondary hover:text-text-primary no-underline transition-colors px-3 py-1.5 rounded-lg hover:bg-bg-tertiary border border-border-custom flex items-center gap-1.5"
                >
                    <span>Quay lại Dashboard</span>
                </Link>
            </div>
        </header>
    );
};
