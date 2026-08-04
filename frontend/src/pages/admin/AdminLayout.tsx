import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ThemeToggle } from '../../components/ThemeToggle';

export default function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState<any>(null);

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

    // Force body background to theme color to prevent white space leaks at the bottom of the viewport
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

    return (
        <div className="flex min-h-screen bg-bg-primary text-text-primary font-sans selection:bg-accent-custom/30 selection:text-text-primary transition-colors duration-200 relative">
            {/* Background Glows matching the futuristic dashboard */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(139,92,246,0.05)_0%,transparent_70%)] pointer-events-none z-0"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(6,182,212,0.03)_0%,transparent_70%)] pointer-events-none z-0"></div>

            {/* Sidebar fixed to the left viewport boundary to prevent scrolling bugs */}
            <aside className="w-64 bg-bg-secondary border-r border-border-custom flex flex-col justify-between z-20 fixed left-0 top-0 h-screen select-none transition-colors duration-200 overflow-y-auto scrollbar-thin">
                <div className="flex-shrink-0">
                    {/* Header Logo */}
                    <div className="p-6 border-b border-border-custom flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <span
                                onClick={() => navigate('/dashboard')}
                                className="text-xl font-black tracking-widest text-text-primary cursor-pointer hover:text-accent-custom transition-colors uppercase"
                            >
                                MCODE CRM
                            </span>
                            <span className="text-[8px] font-black bg-accent-custom/10 text-accent-custom px-2 py-0.5 rounded border border-accent-border tracking-widest uppercase">
                                PRO
                            </span>
                        </div>
                        <ThemeToggle />
                    </div>

                    {/* Navigation Menu */}
                    <nav className="p-4 py-6 space-y-2 flex flex-col text-left">
                        <NavLink to="/admin" active={location.pathname === '/admin'} icon={<i className="fa-solid fa-chart-simple"></i>}>Dashboard</NavLink>
                        <NavLink to="/admin/analytics" active={location.pathname === '/admin/analytics'} icon={<i className="fa-solid fa-chart-line"></i>}>Analytics</NavLink>

                        <div className="pt-4 pb-2 px-4 text-[9px] font-black text-accent-custom/70 uppercase tracking-widest font-mono">
                            Management
                        </div>

                        <NavLink to="/admin/users" active={location.pathname.startsWith('/admin/users')} icon={<i className="fa-solid fa-user-group"></i>} badge="1.4k">Học Viên</NavLink>
                        <NavLink to="/admin/courses" active={location.pathname.startsWith('/admin/courses')} icon={<i className="fa-solid fa-book-open"></i>} badge="Active">Khóa Học</NavLink>
                        <NavLink to="/admin/submissions" active={location.pathname.startsWith('/admin/submissions')} icon={<i className="fa-solid fa-paper-plane"></i>}>Submissions</NavLink>
                        <NavLink to="/admin/practice-problems" active={location.pathname.startsWith('/admin/practice-problems')} icon={<i className="fa-solid fa-laptop-code"></i>} badge="Hot">Bài Tập</NavLink>
                    </nav>
                </div>

                {/* Footer Section in Sidebar */}
                <div className="p-4 border-t border-border-custom space-y-2 text-left bg-bg-secondary transition-colors duration-200 flex-shrink-0">
                    <div className="px-4 py-3 rounded-2xl flex items-center gap-3.5 bg-bg-tertiary border border-border-custom mb-3 transition-colors duration-200">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-accent-custom to-accent-hover flex items-center justify-center font-black text-white text-xs select-none">
                            {user.username.substring(0, 1).toUpperCase()}
                        </div>
                        <div className="flex flex-col text-left overflow-hidden">
                            <span className="text-xs font-black text-text-primary truncate max-w-[120px]">{user.username}</span>
                            <span className="text-[9px] text-[#06b6d4] font-black uppercase tracking-wider flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#06b6d4] inline-block animate-pulse"></span>
                                Online
                            </span>
                        </div>
                    </div>

                    <NavLink to="/dashboard" active={false} icon={<i className="fa-solid fa-house"></i>}>Về trang chủ</NavLink>
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-rose-500/10 text-rose-500/90 hover:text-rose-500 flex items-center gap-3 text-xs font-bold tracking-wide transition-all border border-transparent hover:border-rose-500/20 active:scale-[0.98] cursor-pointer bg-transparent"
                    >
                        <span className="text-sm w-4 text-center"><i className="fa-solid fa-right-from-bracket"></i></span>
                        <span>Đăng xuất</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area shifted to the right to accommodate the fixed sidebar */}
            <main className="flex-1 min-h-screen relative overflow-hidden z-10 flex flex-col pl-64 transition-colors duration-200">
                <div className="p-6 md:p-8 flex-1 box-border">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

interface NavLinkProps {
    to: string;
    active: boolean;
    icon: React.ReactNode;
    badge?: string;
    children: React.ReactNode;
}

function NavLink({ to, active, icon, badge, children }: NavLinkProps) {
    return (
        <Link
            to={to}
            className={`px-4 py-3 rounded-xl flex items-center justify-between text-xs font-bold tracking-wide transition-all border select-none no-underline ${active
                ? 'bg-accent-bg text-accent-custom border-accent-border/40 shadow-[0_0_15px_var(--accent-border)]'
                : 'text-text-secondary hover:text-text-primary bg-transparent border-transparent hover:bg-bg-tertiary'
                }`}
        >
            <div className="flex items-center gap-3">
                <span className={`text-sm w-4 text-center transition-transform ${active ? 'scale-110' : 'opacity-70'}`}>{icon}</span>
                <span>{children}</span>
            </div>
            {badge && (
                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${active
                    ? 'bg-accent-custom text-white'
                    : 'bg-bg-tertiary text-accent-custom border border-accent-border/30'
                    }`}>
                    {badge}
                </span>
            )}
        </Link>
    );
}
