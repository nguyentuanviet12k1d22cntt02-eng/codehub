import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ThemeToggle } from '../../components/ThemeToggle';

export default function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState<any>(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isLessonsOpen, setIsLessonsOpen] = useState(true);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);

            if (parsedUser.role !== 'ADMIN') {
                alert('Bạn không có quyền truy cập trang này');
                navigate('/');
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    // Force body background to theme color
    useEffect(() => {
        const originalBg = document.body.style.backgroundColor;
        document.body.style.backgroundColor = 'var(--bg-primary)';
        return () => {
            document.body.style.backgroundColor = originalBg;
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!user) return null;

    const displayName = user.fullName || user.username || 'Nguyễn Minh Nhật';
    const initialLetter = (displayName.charAt(0) || 'N').toUpperCase();

    return (
        <div className="flex min-h-screen bg-bg-primary text-text-primary font-sans selection:bg-accent-custom/30 selection:text-text-primary transition-colors duration-200 relative">
            {/* Sidebar fixed to the left viewport boundary */}
            <aside
                className={`${
                    isSidebarCollapsed ? 'w-20' : 'w-72'
                } bg-bg-secondary border-r border-border-custom flex flex-col justify-between z-20 fixed left-0 top-0 h-screen select-none transition-all duration-300 overflow-y-auto scrollbar-thin shadow-sm`}
            >
                <div className="flex-shrink-0">
                    {/* Header Logo */}
                    <div className="p-5 flex items-center justify-between">
                        {!isSidebarCollapsed && (
                            <div
                                onClick={() => navigate('/admin')}
                                className="flex items-center gap-3 cursor-pointer group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-black text-white text-lg shadow-md shadow-indigo-500/20">
                                    M
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="text-sm font-black tracking-tight text-slate-900 dark:text-white leading-none">
                                        MCODE
                                    </span>
                                    <span className="text-xs font-extrabold tracking-wider text-slate-800 dark:text-slate-200 leading-tight mt-0.5">
                                        CRM
                                    </span>
                                </div>
                            </div>
                        )}

                        {isSidebarCollapsed && (
                            <div
                                onClick={() => navigate('/admin')}
                                className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-black text-white text-lg shadow-md shadow-indigo-500/20 cursor-pointer"
                            >
                                M
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                            className="w-7 h-7 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-all shadow-xs"
                            title={isSidebarCollapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
                        >
                            <svg
                                className={`w-3.5 h-3.5 transition-transform duration-300 ${
                                    isSidebarCollapsed ? 'rotate-180' : ''
                                }`}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="px-3.5 py-2 space-y-1 flex flex-col text-left">
                        {/* 1. Dashboard */}
                        <SidebarLink
                            to="/admin"
                            active={location.pathname === '/admin'}
                            icon={
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                    <rect x="3" y="12" width="6" height="8" rx="1" />
                                    <rect x="9" y="8" width="6" height="12" rx="1" />
                                    <rect x="15" y="4" width="6" height="16" rx="1" />
                                </svg>
                            }
                            collapsed={isSidebarCollapsed}
                        >
                            Dashboard
                        </SidebarLink>

                        {/* 2. Analytics */}
                        <SidebarLink
                            to="/admin/analytics"
                            active={location.pathname === '/admin/analytics'}
                            icon={
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                                </svg>
                            }
                            collapsed={isSidebarCollapsed}
                        >
                            Analytics
                        </SidebarLink>

                        {/* 3. Học viên */}
                        <SidebarLink
                            to="/admin/users"
                            active={location.pathname.startsWith('/admin/users')}
                            badge="1,248"
                            icon={
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            }
                            collapsed={isSidebarCollapsed}
                        >
                            Học viên
                        </SidebarLink>

                        {/* 4. Bài học (Accordion Group) */}
                        <div className="space-y-1">
                            <button
                                type="button"
                                onClick={() => setIsLessonsOpen(!isLessonsOpen)}
                                className={`w-full px-3.5 py-2.5 rounded-xl flex items-center justify-between text-xs font-semibold tracking-normal transition-all text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 ${
                                    isLessonsOpen ? 'text-indigo-600 dark:text-indigo-400 font-bold' : ''
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <svg className="w-4 h-4 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                        <rect x="3" y="3" width="7" height="7" rx="1" />
                                        <rect x="14" y="3" width="7" height="7" rx="1" />
                                        <rect x="14" y="14" width="7" height="7" rx="1" />
                                        <rect x="3" y="14" width="7" height="7" rx="1" />
                                    </svg>
                                    {!isSidebarCollapsed && <span>Bài học</span>}
                                </div>
                                {!isSidebarCollapsed && (
                                    <svg
                                        className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
                                            isLessonsOpen ? '' : 'rotate-180'
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                                    </svg>
                                )}
                            </button>

                            {/* Submenu for Bài học: Clean indented list items with hover effects */}
                            {isLessonsOpen && !isSidebarCollapsed && (
                                <div className="pl-6 pr-1 py-1 space-y-0.5 border-l border-slate-200/80 dark:border-white/10 ml-4 my-1">
                                    {/* 1. Nội dung & Bài tập */}
                                    <Link
                                        to="/admin/curriculum"
                                        className={`block px-3 py-2 rounded-xl text-xs font-semibold transition-all no-underline ${
                                            location.pathname.startsWith('/admin/curriculum')
                                                ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold'
                                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/5'
                                        }`}
                                    >
                                        Nội dung & Bài tập
                                    </Link>

                                    {/* 2. Danh mục */}
                                    <Link
                                        to="/admin/courses"
                                        className={`block px-3 py-2 rounded-xl text-xs font-semibold transition-all no-underline ${
                                            location.pathname === '/admin/courses'
                                                ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold'
                                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/5'
                                        }`}
                                    >
                                        Danh mục
                                    </Link>

                                    {/* 3. Ngân hàng câu hỏi */}
                                    <Link
                                        to="/admin/practice-problems"
                                        className={`block px-3 py-2 rounded-xl text-xs font-semibold transition-all no-underline ${
                                            location.pathname === '/admin/practice-problems'
                                                ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold'
                                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/5'
                                        }`}
                                    >
                                        Ngân hàng câu hỏi
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* 5. Submit review */}
                        <SidebarLink
                            to="/admin/submissions"
                            active={location.pathname.startsWith('/admin/submissions')}
                            icon={
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                    <line x1="22" y1="2" x2="11" y2="13" />
                                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                </svg>
                            }
                            collapsed={isSidebarCollapsed}
                        >
                            Submit review
                        </SidebarLink>
                    </nav>
                </div>

                {/* Footer Section in Sidebar */}
                <div className="p-4 border-t border-border-custom space-y-2 text-left bg-bg-secondary transition-colors duration-200 flex-shrink-0">
                    {/* User Profile Card */}
                    {!isSidebarCollapsed ? (
                        <div className="px-3.5 py-3 rounded-2xl flex items-center gap-3 bg-[#f8f9fc] dark:bg-[#161622] border border-slate-200/80 dark:border-white/5 mb-3 transition-colors duration-200">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-extrabold text-white text-sm shadow-sm select-none flex-shrink-0">
                                {initialLetter}
                            </div>
                            <div className="flex flex-col text-left overflow-hidden min-w-0 flex-1">
                                <span className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                                    {displayName}
                                </span>
                                <span className="text-[11px] text-sky-600 dark:text-sky-400 font-semibold flex items-center gap-1.5 mt-0.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                                    Quản trị viên
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="w-9 h-9 mx-auto rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-extrabold text-white text-sm shadow-sm mb-3">
                            {initialLetter}
                        </div>
                    )}

                    {/* Cài đặt hệ thống / Theme Toggle */}
                    <div className="flex items-center justify-between px-2">
                        <Link
                            to="/dashboard"
                            className="px-2 py-1.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-2.5 text-xs font-semibold transition-all no-underline"
                        >
                            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="3" />
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                            </svg>
                            {!isSidebarCollapsed && <span>Cài đặt hệ thống</span>}
                        </Link>
                        {!isSidebarCollapsed && <ThemeToggle />}
                    </div>

                    {/* Đăng xuất */}
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-2 py-2 rounded-xl text-rose-500/90 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 flex items-center gap-2.5 text-xs font-bold tracking-wide transition-all cursor-pointer bg-transparent"
                    >
                        <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        {!isSidebarCollapsed && <span>Đăng xuất</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area shifted to the right */}
            <main
                className={`flex-1 min-h-screen relative overflow-hidden z-10 flex flex-col transition-all duration-300 ${
                    isSidebarCollapsed ? 'pl-20' : 'pl-72'
                }`}
            >
                <div className="p-6 md:p-8 flex-1 box-border">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

interface SidebarLinkProps {
    to: string;
    active: boolean;
    icon: React.ReactNode;
    badge?: string;
    collapsed?: boolean;
    children: React.ReactNode;
}

function SidebarLink({ to, active, icon, badge, collapsed, children }: SidebarLinkProps) {
    return (
        <Link
            to={to}
            className={`px-3.5 py-2.5 rounded-xl flex items-center justify-between text-xs font-semibold tracking-normal transition-all no-underline ${
                active
                    ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'
            }`}
        >
            <div className="flex items-center gap-3">
                <span className={`transition-colors ${active ? 'text-purple-600 dark:text-purple-400' : 'text-slate-500 dark:text-slate-400'}`}>
                    {icon}
                </span>
                {!collapsed && <span>{children}</span>}
            </div>
            {!collapsed && badge && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
                    {badge}
                </span>
            )}
        </Link>
    );
}
