import React, { useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    BrainCircuit,
    Code2,
    LayoutDashboard,
    Map,
    Menu,
    Network,
    Trophy,
    X,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import UserMenuDropdown from './UserMenuDropdown';
import { decodeToken } from '../utils/authHelper';

export const navItems = [
    { to: '/dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { to: '/roadmap', label: 'Lộ trình', icon: Map },
    { to: '/personalized-path', label: 'Luyện tập AI', icon: BrainCircuit },
    { to: '/practice-arena', label: 'Đấu trường', icon: Trophy },
    { to: '/profile', label: 'Tri thức', icon: Network },
];

interface AppNavbarProps {
    className?: string;
}

export const AppNavbar: React.FC<AppNavbarProps> = ({ className = '' }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const token = useMemo(() => localStorage.getItem('token'), []);
    const authenticatedUser = useMemo(() => (token ? decodeToken(token) : null), [token]);
    const role = authenticatedUser?.role || 'STUDENT';

    const isItemActive = (to: string) => {
        if (to === '/dashboard') {
            return location.pathname === '/dashboard';
        }
        return location.pathname === to || location.pathname.startsWith(`${to}/`);
    };

    return (
        <header className={`sticky top-0 z-50 border-b border-border-custom bg-bg-secondary/85 backdrop-blur-xl transition-colors duration-200 ${className}`}>
            <div className="mx-auto flex h-[72px] w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Brand Logo */}
                <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="group flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-custom focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary cursor-pointer"
                    aria-label="Về trang tổng quan MCODE"
                >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/20 transition-transform duration-200 group-hover:-rotate-3">
                        <Code2 className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="text-left">
                        <span className="block text-[17px] font-extrabold leading-none tracking-[-0.03em] text-text-primary">MCODE</span>
                        <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.2em] text-text-tertiary">Learning Lab</span>
                    </span>
                </button>

                {/* Center Floating Pill Menu */}
                <nav className="hidden items-center gap-1 rounded-2xl border border-border-custom bg-bg-primary/60 p-1.5 xl:flex shadow-xs" aria-label="Điều hướng chính">
                    {navItems.map(({ to, label, icon: Icon }) => {
                        const active = isItemActive(to);
                        return (
                            <Link
                                key={to}
                                to={to}
                                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-custom ${
                                    active
                                        ? 'bg-bg-secondary text-accent-custom shadow-sm ring-1 ring-border-custom'
                                        : 'text-text-tertiary hover:bg-bg-secondary hover:text-text-primary'
                                }`}
                            >
                                <Icon className="h-4 w-4" aria-hidden="true" />
                                {label}
                            </Link>
                        );
                    })}
                    {role === 'ADMIN' && (
                        <Link
                            to="/admin"
                            className="rounded-xl px-3.5 py-2 text-xs font-bold text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/10"
                        >
                            Quản trị
                        </Link>
                    )}
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <UserMenuDropdown />
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen((open) => !open)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-custom bg-bg-secondary text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-custom xl:hidden cursor-pointer"
                        aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
                        aria-expanded={mobileMenuOpen}
                    >
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer Navigation */}
            {mobileMenuOpen && (
                <nav className="border-t border-border-custom bg-bg-secondary px-4 py-3 xl:hidden" aria-label="Điều hướng trên thiết bị di động">
                    <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-2 sm:grid-cols-3">
                        {navItems.map(({ to, label, icon: Icon }) => {
                            const active = isItemActive(to);
                            return (
                                <Link
                                    key={to}
                                    to={to}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex min-h-11 items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold ${
                                        active
                                            ? 'bg-accent-bg text-accent-custom font-bold'
                                            : 'bg-bg-primary text-text-secondary hover:text-text-primary'
                                    }`}
                                >
                                    <Icon className="h-4 w-4" aria-hidden="true" />
                                    {label}
                                </Link>
                            );
                        })}
                        {role === 'ADMIN' && (
                            <Link
                                to="/admin"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex min-h-11 items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold text-rose-600 bg-rose-50/50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20"
                            >
                                Quản trị
                            </Link>
                        )}
                    </div>
                </nav>
            )}
        </header>
    );
};

export default AppNavbar;
