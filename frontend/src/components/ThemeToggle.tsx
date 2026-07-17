import React, { useState, useEffect } from 'react';
import { getInitialTheme, applyTheme } from '../utils/themeHelper';

export const ThemeToggle: React.FC = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme());

    useEffect(() => {
        // Đồng bộ theme ban đầu
        setTheme(getInitialTheme());
    }, []);

    const toggleTheme = () => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
        setTheme(nextTheme);
        // Dispatch custom event để các component khác đồng bộ (nếu cần re-render)
        window.dispatchEvent(new Event('theme-change'));
    };

    return (
        <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-8 h-8 rounded-full border border-border-custom hover:bg-bg-tertiary text-text-secondary hover:text-text-primary transition-all duration-200 cursor-pointer focus:outline-none"
            title={theme === 'dark' ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
        >
            {theme === 'dark' ? (
                // Icon Mặt trời (Sun) cho chế độ tối -> sáng
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3v2.25m0 13.5V21M5.036 5.036l1.591 1.591m8.727 8.727l1.591 1.591M3 12h2.25m13.5 0H21M5.036 18.964l1.591-1.591M17.364 6.636l-1.591 1.591M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z"
                    />
                </svg>
            ) : (
                // Icon Mặt trăng (Moon) cho chế độ sáng -> tối
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                    />
                </svg>
            )}
        </button>
    );
};
