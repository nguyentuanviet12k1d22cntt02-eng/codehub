import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserMenuDropdownProps {
    className?: string;
}

export default function UserMenuDropdown({ className = '' }: UserMenuDropdownProps) {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const userRaw = localStorage.getItem('user');
    const user = userRaw ? JSON.parse(userRaw) : null;
    const username = user?.username || 'Tài khoản';
    const isAdmin = user?.role === 'ADMIN';

    // Click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!user) {
        return (
            <div className={`flex items-center gap-2 ${className}`}>
                <button
                    onClick={() => navigate('/login')}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border-custom hover:bg-bg-tertiary text-text-primary transition-colors"
                >
                    Đăng nhập
                </button>
            </div>
        );
    }

    return (
        <div className={`relative flex items-center gap-3 ${className}`} ref={dropdownRef}>
            {/* Quick Admin Shortcut Button if user is Admin */}
            {isAdmin && (
                <button
                    onClick={() => navigate('/admin')}
                    className="hidden sm:inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-lg bg-accent-custom/10 text-accent-custom border border-accent-border hover:bg-accent-custom hover:text-white transition-all shadow-sm"
                >
                    Trang Admin
                </button>
            )}

            {/* User Avatar & Name Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-bg-tertiary border border-transparent hover:border-border-custom transition-all text-left focus:outline-none"
            >
                <div className="w-8 h-8 rounded-full bg-accent-custom text-white dark:text-bg-primary flex items-center justify-center font-bold text-sm select-none shadow-sm">
                    {username.substring(0, 1).toUpperCase()}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-bold text-text-primary truncate max-w-[130px]">
                        {username}
                    </span>
                    {isAdmin && (
                        <span className="text-[9px] font-extrabold text-accent-custom uppercase tracking-wider">
                            Quản trị viên
                        </span>
                    )}
                </div>
                <svg
                    className={`w-3.5 h-3.5 text-text-secondary transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-bg-secondary rounded-2xl border border-border-custom shadow-xl py-2 z-50 animate-fade-in text-left">
                    {/* User Header Info in Dropdown */}
                    <div className="px-4 py-2.5 border-b border-border-custom mb-1">
                        <div className="text-xs font-bold text-text-primary truncate">
                            {username}
                        </div>
                        <div className="text-[11px] text-text-secondary truncate mt-0.5">
                            {user.email || ''}
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="px-1.5 space-y-0.5">
                        {/* Profile Item */}
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                navigate('/profile');
                            }}
                            className="w-full text-left px-3 py-2 text-xs font-semibold rounded-xl text-text-primary hover:bg-bg-tertiary transition-colors flex items-center justify-between"
                        >
                            <span>Trang cá nhân</span>
                            <span className="text-[10px] text-text-secondary">Profile</span>
                        </button>

                        {/* Admin Item (Only for Admin role) */}
                        {isAdmin && (
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    navigate('/admin');
                                }}
                                className="w-full text-left px-3 py-2 text-xs font-semibold rounded-xl text-accent-custom hover:bg-accent-custom/10 transition-colors flex items-center justify-between"
                            >
                                <span>Trang Quản Trị</span>
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-accent-custom/20 text-accent-custom font-bold">
                                    ADMIN
                                </span>
                            </button>
                        )}

                        <div className="border-t border-border-custom my-1"></div>

                        {/* Logout Item */}
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                handleLogout();
                            }}
                            className="w-full text-left px-3 py-2 text-xs font-semibold rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center justify-between"
                        >
                            <span>Đăng xuất</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
