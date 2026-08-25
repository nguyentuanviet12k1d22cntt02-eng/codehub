import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ThemeToggle } from '../ThemeToggle';

interface PracticeHeaderProps {
    lessonTitle: string;
}

export const PracticeHeader: React.FC<PracticeHeaderProps> = ({ lessonTitle }) => {
    const navigate = useNavigate();

    return (
        <header className="flex justify-between items-center px-6 py-3 border-b border-border-custom bg-bg-secondary shrink-0 transition-colors duration-200">
            <div className="flex items-center gap-4">
                <span
                    className="text-xl font-bold tracking-tight text-text-primary cursor-pointer hover:text-accent-custom transition-colors"
                    onClick={() => navigate('/dashboard')}
                >
                    MCODE
                </span>
                <div className="h-4 w-[1px] bg-border-custom"></div>
                <span className="text-xs text-text-tertiary font-medium">
                    Bài học: <span className="text-text-primary font-semibold">{lessonTitle}</span>
                </span>
            </div>

            <div className="flex items-center gap-4">
                <ThemeToggle />
                <Link
                    to="/dashboard"
                    className="text-xs text-text-secondary hover:text-text-primary no-underline transition-colors px-3 py-1.5 rounded-lg hover:bg-bg-tertiary border border-border-custom"
                >
                    Quay lại Dashboard
                </Link>
            </div>
        </header>
    );
};
