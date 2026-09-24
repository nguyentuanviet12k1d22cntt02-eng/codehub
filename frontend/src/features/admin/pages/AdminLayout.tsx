import { useEffect, useMemo, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    BarChart3,
    BookCopy,
    BookOpenCheck,
    ChevronDown,
    ChevronLeft,
    CircleHelp,
    ClipboardCheck,
    Code2,
    ExternalLink,
    KeyRound,
    LayoutDashboard,
    LibraryBig,
    LogOut,
    Menu,
    PanelLeftOpen,
    UsersRound,
    X,
} from 'lucide-react';
import { ThemeToggle } from '../../../components/ThemeToggle';

interface AdminUser {
    fullName?: string;
    username?: string;
    email?: string;
    role?: string;
}

interface NavigationItem {
    to: string;
    label: string;
    icon: typeof LayoutDashboard;
    matches: (pathname: string) => boolean;
}

const primaryNavigation: NavigationItem[] = [
    {
        to: '/admin',
        label: 'Tổng quan',
        icon: LayoutDashboard,
        matches: (pathname) => pathname === '/admin',
    },
    {
        to: '/admin/analytics',
        label: 'Phân tích dữ liệu',
        icon: BarChart3,
        matches: (pathname) => pathname === '/admin/analytics',
    },
    {
        to: '/admin/users',
        label: 'Quản lý học viên',
        icon: UsersRound,
        matches: (pathname) => pathname.startsWith('/admin/users'),
    },
];

const learningNavigation: NavigationItem[] = [
    {
        to: '/admin/curriculum',
        label: 'Nội dung & bài tập',
        icon: BookOpenCheck,
        matches: (pathname) => pathname.startsWith('/admin/curriculum'),
    },
    {
        to: '/admin/courses',
        label: 'Danh mục khóa học',
        icon: LibraryBig,
        matches: (pathname) => pathname === '/admin/courses',
    },
    {
        to: '/admin/practice-problems',
        label: 'Ngân hàng câu hỏi',
        icon: CircleHelp,
        matches: (pathname) => pathname === '/admin/practice-problems',
    },
];

const operationsNavigation: NavigationItem[] = [
    {
        to: '/admin/submissions',
        label: 'Duyệt bài nộp',
        icon: ClipboardCheck,
        matches: (pathname) => pathname.startsWith('/admin/submissions'),
    },
    {
        to: '/admin/ai-keys',
        label: 'Hồ chứa AI Keys',
        icon: KeyRound,
        matches: (pathname) => pathname.startsWith('/admin/ai-keys'),
    },
];

const pageMeta = [
    { match: (path: string) => path === '/admin', title: 'Tổng quan vận hành', eyebrow: 'Command center' },
    { match: (path: string) => path === '/admin/analytics', title: 'Phân tích dữ liệu', eyebrow: 'Learning intelligence' },
    { match: (path: string) => path.startsWith('/admin/users/'), title: 'Hồ sơ học viên', eyebrow: 'Learner profile' },
    { match: (path: string) => path === '/admin/users', title: 'Quản lý học viên', eyebrow: 'User operations' },
    { match: (path: string) => path.startsWith('/admin/curriculum'), title: 'Nội dung & bài tập', eyebrow: 'Curriculum studio' },
    { match: (path: string) => path === '/admin/courses', title: 'Danh mục khóa học', eyebrow: 'Course catalog' },
    { match: (path: string) => path === '/admin/practice-problems', title: 'Ngân hàng câu hỏi', eyebrow: 'Practice library' },
    { match: (path: string) => path.startsWith('/admin/submissions'), title: 'Duyệt bài nộp', eyebrow: 'Submission review' },
    { match: (path: string) => path.startsWith('/admin/ai-keys'), title: 'Hồ chứa AI Keys', eyebrow: 'AI infrastructure' },
];

export default function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState<AdminUser | null>(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isLearningOpen, setIsLearningOpen] = useState(true);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            navigate('/login');
            return;
        }

        const parsedUser = JSON.parse(userData) as AdminUser;
        // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate the authenticated administrator once on mount
        setUser(parsedUser);
        if (parsedUser.role !== 'ADMIN') {
            alert('Bạn không có quyền truy cập trang này');
            navigate('/');
        }
    }, [navigate]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- close the mobile drawer after route navigation
        setIsMobileSidebarOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const originalBg = document.body.style.backgroundColor;
        document.body.style.backgroundColor = 'var(--bg-primary)';
        return () => {
            document.body.style.backgroundColor = originalBg;
        };
    }, []);

    const currentPage = useMemo(
        () => pageMeta.find((item) => item.match(location.pathname)) || pageMeta[0],
        [location.pathname]
    );

    const displayName = user?.fullName || user?.username || 'Quản trị viên';
    const initialLetter = displayName.charAt(0).toUpperCase();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!user) return null;

    return (
        <div className="admin-modern min-h-screen bg-bg-primary font-sans text-text-primary selection:bg-accent-custom/20">
            {isMobileSidebarOpen && (
                <button
                    type="button"
                    className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsMobileSidebarOpen(false)}
                    aria-label="Đóng menu quản trị"
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-indigo-100 bg-[linear-gradient(180deg,#ffffff_0%,#fafaff_48%,#f1f5ff_100%)] text-slate-700 shadow-[16px_0_50px_-38px_rgba(79,70,229,0.38)] transition-all duration-300 dark:border-white/8 dark:bg-[linear-gradient(180deg,#101321_0%,#121628_55%,#111827_100%)] dark:text-slate-200 lg:z-30 ${
                    isSidebarCollapsed ? 'lg:w-[88px]' : 'lg:w-[280px]'
                } ${isMobileSidebarOpen ? 'w-[280px] translate-x-0' : 'w-[280px] -translate-x-full lg:translate-x-0'}`}
            >
                <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-indigo-100/80 px-5 dark:border-white/8">
                    <button
                        type="button"
                        onClick={() => navigate('/admin')}
                        className={`group flex items-center gap-3 rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${isSidebarCollapsed ? 'lg:mx-auto' : ''}`}
                        aria-label="Về trang tổng quan quản trị"
                    >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-950/35">
                            <Code2 className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <span className={isSidebarCollapsed ? 'lg:hidden' : ''}>
                            <span className="block text-[15px] font-black leading-none tracking-[-0.02em] text-slate-950 dark:text-white">MCODE</span>
                            <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-300">Admin console</span>
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsMobileSidebarOpen(false)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-violet-50 hover:text-violet-700 dark:text-slate-400 dark:hover:bg-white/8 dark:hover:text-white lg:hidden"
                        aria-label="Đóng menu"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <nav className="admin-sidebar-scroll flex-1 overflow-y-auto px-3 py-5" aria-label="Điều hướng quản trị">
                    <NavigationGroup
                        label="Không gian làm việc"
                        items={primaryNavigation}
                        pathname={location.pathname}
                        collapsed={isSidebarCollapsed}
                    />

                    <div className="my-5 h-px bg-indigo-100/80 dark:bg-white/8" />

                    <div>
                        <button
                            type="button"
                            onClick={() => setIsLearningOpen((open) => !open)}
                            className={`mb-2 flex w-full items-center justify-between px-3 text-[9px] font-extrabold uppercase tracking-[0.18em] text-slate-400 transition-colors hover:text-violet-700 dark:text-slate-500 dark:hover:text-slate-300 ${isSidebarCollapsed ? 'lg:justify-center' : ''}`}
                            aria-expanded={isLearningOpen}
                        >
                            <span className={isSidebarCollapsed ? 'lg:hidden' : ''}>Học liệu</span>
                            <BookCopy className={`hidden h-4 w-4 ${isSidebarCollapsed ? 'lg:block' : ''}`} aria-hidden="true" />
                            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isLearningOpen ? '' : '-rotate-90'} ${isSidebarCollapsed ? 'lg:hidden' : ''}`} aria-hidden="true" />
                        </button>
                        {(isLearningOpen || isSidebarCollapsed) && (
                            <div className="space-y-1">
                                {learningNavigation.map((item) => (
                                    <NavigationLink
                                        key={item.to}
                                        item={item}
                                        active={item.matches(location.pathname)}
                                        collapsed={isSidebarCollapsed}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="my-5 h-px bg-indigo-100/80 dark:bg-white/8" />

                    <NavigationGroup
                        label="Vận hành hệ thống"
                        items={operationsNavigation}
                        pathname={location.pathname}
                        collapsed={isSidebarCollapsed}
                    />
                </nav>

                <div className="shrink-0 border-t border-indigo-100/80 p-3 dark:border-white/8">
                    <div className={`mb-2 rounded-2xl border border-indigo-100 bg-white/80 p-3 shadow-sm dark:border-white/8 dark:bg-white/[0.045] ${isSidebarCollapsed ? 'lg:flex lg:justify-center lg:p-2' : ''}`}>
                        <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-black text-white shadow-md">
                                {initialLetter}
                            </span>
                            <span className={`min-w-0 flex-1 ${isSidebarCollapsed ? 'lg:hidden' : ''}`}>
                                <span className="block truncate text-xs font-bold text-slate-900 dark:text-white">{displayName}</span>
                                <span className="mt-1 flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-300">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                    Quản trị viên
                                </span>
                            </span>
                        </div>
                    </div>

                    <div className={`grid gap-1 ${isSidebarCollapsed ? 'lg:justify-items-center' : ''}`}>
                        <Link
                            to="/dashboard"
                            className={`flex min-h-10 items-center gap-3 rounded-xl px-3 text-xs font-semibold text-slate-500 transition-colors hover:bg-white hover:text-violet-700 dark:text-slate-400 dark:hover:bg-white/8 dark:hover:text-white ${isSidebarCollapsed ? 'lg:w-11 lg:justify-center lg:px-0' : ''}`}
                            title="Về trang học viên"
                        >
                            <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
                            <span className={isSidebarCollapsed ? 'lg:hidden' : ''}>Về trang học viên</span>
                        </Link>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className={`flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50 hover:text-rose-700 dark:text-rose-300 dark:hover:bg-rose-500/10 dark:hover:text-rose-200 ${isSidebarCollapsed ? 'lg:w-11 lg:justify-center lg:px-0' : ''}`}
                            title="Đăng xuất"
                        >
                            <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
                            <span className={isSidebarCollapsed ? 'lg:hidden' : ''}>Đăng xuất</span>
                        </button>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setIsSidebarCollapsed((collapsed) => !collapsed)}
                    className="absolute -right-3 top-24 hidden h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-md transition-colors hover:text-violet-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 lg:flex"
                    aria-label={isSidebarCollapsed ? 'Mở rộng thanh điều hướng' : 'Thu gọn thanh điều hướng'}
                    title={isSidebarCollapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
                >
                    {isSidebarCollapsed ? <PanelLeftOpen className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
                </button>
            </aside>

            <div className={`min-h-screen transition-[padding] duration-300 ${isSidebarCollapsed ? 'lg:pl-[88px]' : 'lg:pl-[280px]'}`}>
                <header className="sticky top-0 z-20 border-b border-indigo-100/70 bg-white/82 shadow-[0_10px_32px_-30px_rgba(79,70,229,0.4)] backdrop-blur-xl dark:border-white/8 dark:bg-bg-primary/88">
                    <div className="flex h-[76px] items-center justify-between gap-4 px-4 sm:px-6 xl:px-8">
                        <div className="flex min-w-0 items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setIsMobileSidebarOpen(true)}
                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border-custom bg-bg-secondary text-text-secondary shadow-sm hover:text-accent-custom focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-custom lg:hidden"
                                aria-label="Mở menu quản trị"
                            >
                                <Menu className="h-5 w-5" />
                            </button>
                            <div className="min-w-0">
                                <p className="truncate text-[9px] font-extrabold uppercase tracking-[0.18em] text-accent-custom">{currentPage.eyebrow}</p>
                                <h1 className="mt-1 truncate text-[17px] font-extrabold tracking-[-0.02em] text-text-primary">{currentPage.title}</h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300 sm:flex">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                Hệ thống hoạt động
                            </div>
                            <ThemeToggle />
                            <div className="hidden h-8 w-px bg-border-custom sm:block" />
                            <div className="hidden items-center gap-2.5 sm:flex">
                                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-bg text-xs font-black text-accent-custom">{initialLetter}</span>
                                <div className="hidden text-left xl:block">
                                    <p className="max-w-36 truncate text-xs font-bold text-text-primary">{displayName}</p>
                                    <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-text-tertiary">Administrator</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="admin-content min-h-[calc(100vh-76px)] px-4 py-6 sm:px-6 sm:py-7 xl:px-8 xl:py-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

function NavigationGroup({
    label,
    items,
    pathname,
    collapsed,
}: {
    label: string;
    items: NavigationItem[];
    pathname: string;
    collapsed: boolean;
}) {
    return (
        <div>
            <p className={`mb-2 px-3 text-[9px] font-extrabold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500 ${collapsed ? 'lg:text-center lg:text-[0]' : ''}`}>
                {collapsed ? '•' : label}
            </p>
            <div className="space-y-1">
                {items.map((item) => (
                    <NavigationLink key={item.to} item={item} active={item.matches(pathname)} collapsed={collapsed} />
                ))}
            </div>
        </div>
    );
}

function NavigationLink({ item, active, collapsed }: { item: NavigationItem; active: boolean; collapsed: boolean }) {
    const Icon = item.icon;
    return (
        <Link
            to={item.to}
            title={collapsed ? item.label : undefined}
            className={`group relative flex min-h-11 items-center gap-3 rounded-xl px-3 text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
                active
                    ? 'border border-violet-200/80 bg-gradient-to-r from-violet-100 to-indigo-50 text-violet-800 shadow-sm shadow-violet-200/30 dark:border-white/8 dark:from-white/10 dark:to-white/5 dark:text-white dark:shadow-inner dark:shadow-white/5'
                    : 'border border-transparent text-slate-600 hover:border-indigo-100 hover:bg-white/80 hover:text-violet-700 dark:text-slate-400 dark:hover:border-transparent dark:hover:bg-white/[0.055] dark:hover:text-slate-100'
            } ${collapsed ? 'lg:justify-center lg:px-0' : ''}`}
        >
            {active && <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-violet-600 dark:bg-violet-400" aria-hidden="true" />}
            <Icon className={`h-[18px] w-[18px] shrink-0 ${active ? 'text-violet-700 dark:text-violet-300' : 'text-slate-400 group-hover:text-violet-600 dark:text-slate-500 dark:group-hover:text-slate-300'}`} aria-hidden="true" />
            <span className={collapsed ? 'lg:hidden' : ''}>{item.label}</span>
        </Link>
    );
}
