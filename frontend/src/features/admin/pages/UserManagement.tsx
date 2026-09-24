import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Activity,
    AlertTriangle,
    BookOpenCheck,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Eye,
    GraduationCap,
    KeyRound,
    LoaderCircle,
    Mail,
    RefreshCw,
    Search,
    ShieldCheck,
    Trash2,
    UserRound,
    UserRoundPlus,
    UsersRound,
    X,
} from 'lucide-react';
import { adminApi } from '../../../features/admin/services/adminApi';

interface ManagedUser {
    id: string;
    username: string;
    email: string;
    role: 'STUDENT' | 'TEACHER' | 'ADMIN';
    gender?: 'MALE' | 'FEMALE' | 'OTHER' | null;
    avatarUrl?: string | null;
    createdAt: string;
    _count: {
        enrollments: number;
        submissions: number;
        practiceSubmissions: number;
    };
}

interface PaginationState {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface UserTarget {
    id: string;
    username: string;
}

const numberFormatter = new Intl.NumberFormat('vi-VN');

export default function UserManagement() {
    const [users, setUsers] = useState<ManagedUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState<PaginationState>({ page: 1, limit: 10, total: 0, totalPages: 0 });
    const [filters, setFilters] = useState({ role: '', search: '' });
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<UserTarget | null>(null);
    const [resetTarget, setResetTarget] = useState<UserTarget | null>(null);
    const [newPassword, setNewPassword] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const loadUsers = useCallback(async () => {
        try {
            setLoading(true);
            const data = await adminApi.getAllUsers({
                page: pagination.page,
                limit: pagination.limit,
                role: filters.role || undefined,
                search: filters.search || undefined,
            });
            setUsers(data.users);
            setPagination((current) => ({ ...current, ...data.pagination }));
        } catch (error) {
            console.error('Failed to load users:', error);
        } finally {
            setLoading(false);
        }
    }, [filters.role, filters.search, pagination.limit, pagination.page]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch the current page when filters or pagination change
        void loadUsers();
    }, [loadUsers]);

    const pageStats = useMemo(() => {
        const students = users.filter((user) => user.role === 'STUDENT').length;
        const enrollments = users.reduce((total, user) => total + user._count.enrollments, 0);
        const activities = users.reduce(
            (total, user) => total + user._count.submissions + user._count.practiceSubmissions,
            0
        );
        return { students, enrollments, activities };
    }, [users]);

    const updateFilter = (key: 'role' | 'search', value: string) => {
        setFilters((current) => ({ ...current, [key]: value }));
        setPagination((current) => ({ ...current, page: 1 }));
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            setActionLoading(true);
            await adminApi.deleteUser(deleteTarget.id);
            setDeleteTarget(null);
            await loadUsers();
        } catch (error) {
            console.error('Failed to delete user:', error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!resetTarget || !newPassword.trim()) return;
        try {
            setActionLoading(true);
            await adminApi.resetUserPassword(resetTarget.id, newPassword);
            setResetTarget(null);
            setNewPassword('');
        } catch (error) {
            console.error('Failed to reset password:', error);
        } finally {
            setActionLoading(false);
        }
    };

    const summaryCards = [
        {
            label: 'Tài khoản theo bộ lọc',
            value: pagination.total,
            hint: 'Tổng kết quả phù hợp',
            icon: UsersRound,
            tone: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
        },
        {
            label: 'Học viên ở trang này',
            value: pageStats.students,
            hint: `${users.length} tài khoản đang hiển thị`,
            icon: GraduationCap,
            tone: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
        },
        {
            label: 'Lượt đăng ký khóa học',
            value: pageStats.enrollments,
            hint: 'Trong trang hiện tại',
            icon: BookOpenCheck,
            tone: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
        },
        {
            label: 'Hoạt động luyện tập',
            value: pageStats.activities,
            hint: 'Bài học và bài luyện tập',
            icon: Activity,
            tone: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
        },
    ];

    return (
        <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-6 text-left text-text-primary">
            <section className="relative overflow-hidden rounded-[28px] border border-violet-100 bg-[linear-gradient(120deg,#ffffff_0%,#f5f3ff_54%,#ecfeff_100%)] px-5 py-6 shadow-[0_20px_60px_-42px_rgba(79,70,229,0.45)] dark:border-white/10 dark:bg-[linear-gradient(120deg,#111522_0%,#18172b_58%,#102129_100%)] sm:px-7">
                <div className="absolute -right-14 -top-16 h-48 w-48 rounded-full bg-sky-300/20 blur-3xl dark:bg-sky-500/10" aria-hidden="true" />
                <div className="relative flex flex-col justify-between gap-5 md:flex-row md:items-center">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-300">
                            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-500/15">
                                <UsersRound className="h-3.5 w-3.5" aria-hidden="true" />
                            </span>
                            Learner intelligence
                        </div>
                        <h2 className="text-2xl font-black tracking-[-0.04em] text-slate-950 dark:text-white sm:text-[28px]">
                            Quản lý học viên và tri thức
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                            Theo dõi tài khoản, hoạt động học tập và mở hồ sơ năng lực dựa trên bằng chứng của từng học viên.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 self-start rounded-xl bg-violet-600 px-5 text-sm font-bold text-white shadow-lg shadow-violet-600/20 transition hover:-translate-y-0.5 hover:bg-violet-700 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 md:self-auto"
                    >
                        <UserRoundPlus className="h-4 w-4" aria-hidden="true" />
                        Tạo học viên
                    </button>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Tóm tắt học viên">
                {summaryCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <article key={card.label} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_16px_42px_-34px_rgba(15,23,42,0.45)] dark:border-white/10 dark:bg-bg-secondary">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs font-bold text-text-tertiary">{card.label}</p>
                                    <p className="mt-3 text-3xl font-black tracking-[-0.05em] text-text-primary">{numberFormatter.format(card.value)}</p>
                                    <p className="mt-2 text-[11px] font-medium text-text-tertiary">{card.hint}</p>
                                </div>
                                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${card.tone}`}>
                                    <Icon className="h-5 w-5" aria-hidden="true" />
                                </span>
                            </div>
                        </article>
                    );
                })}
            </section>

            <section className="rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-[0_18px_48px_-38px_rgba(15,23,42,0.45)] dark:border-white/10 dark:bg-bg-secondary sm:p-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                        <input
                            type="search"
                            value={filters.search}
                            onChange={(event) => updateFilter('search', event.target.value)}
                            placeholder="Tìm theo tên đăng nhập hoặc email..."
                            className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-medium text-text-primary outline-none transition placeholder:text-slate-400 hover:border-violet-200 focus:border-violet-500 focus:bg-white dark:border-white/10 dark:bg-bg-tertiary"
                        />
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <select
                            value={filters.role}
                            onChange={(event) => updateFilter('role', event.target.value)}
                            className="min-h-11 cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-text-secondary outline-none transition hover:border-violet-200 focus:border-violet-500 dark:border-white/10 dark:bg-bg-tertiary"
                            aria-label="Lọc theo vai trò"
                        >
                            <option value="">Tất cả vai trò</option>
                            <option value="STUDENT">Học viên</option>
                            <option value="TEACHER">Giảng viên</option>
                            <option value="ADMIN">Quản trị viên</option>
                        </select>
                        <button
                            type="button"
                            onClick={() => void loadUsers()}
                            className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 text-sm font-bold text-violet-700 transition hover:bg-violet-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300"
                        >
                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
                            Làm mới
                        </button>
                    </div>
                </div>
            </section>

            <section className="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_18px_48px_-38px_rgba(15,23,42,0.45)] dark:border-white/10 dark:bg-bg-secondary">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 dark:border-white/8 sm:px-6">
                    <div>
                        <h3 className="text-sm font-extrabold text-text-primary">Danh sách tài khoản</h3>
                        <p className="mt-1 text-[11px] text-text-tertiary">Chọn “Hồ sơ tri thức” để xem dữ liệu cá nhân chi tiết.</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-extrabold text-slate-600 dark:bg-white/5 dark:text-slate-300">
                        Trang {pagination.page}/{pagination.totalPages || 1}
                    </span>
                </div>

                {loading ? (
                    <div className="flex min-h-72 flex-col items-center justify-center gap-3">
                        <LoaderCircle className="h-7 w-7 animate-spin text-violet-600" aria-hidden="true" />
                        <p className="text-xs font-bold text-text-tertiary">Đang tải danh sách học viên...</p>
                    </div>
                ) : users.length === 0 ? (
                    <div className="flex min-h-72 flex-col items-center justify-center gap-3 px-5 text-center">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-white/5">
                            <Search className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <div>
                            <p className="text-sm font-extrabold text-text-primary">Không tìm thấy tài khoản</p>
                            <p className="mt-1 text-xs text-text-tertiary">Hãy thay đổi từ khóa hoặc bộ lọc vai trò.</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="hidden overflow-x-auto md:block">
                            <table className="min-w-[980px]">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3.5 text-left">Học viên</th>
                                        <th className="px-6 py-3.5 text-left">Vai trò</th>
                                        <th className="px-6 py-3.5 text-center">Khóa học</th>
                                        <th className="px-6 py-3.5 text-center">Hoạt động</th>
                                        <th className="px-6 py-3.5 text-left">Ngày tham gia</th>
                                        <th className="px-6 py-3.5 text-right">Quản lý</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => {
                                        const activityCount = user._count.submissions + user._count.practiceSubmissions;
                                        return (
                                            <tr key={user.id} className="border-t border-slate-100 dark:border-white/5">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <UserAvatar user={user} />
                                                        <div className="min-w-0">
                                                            <p className="truncate text-xs font-extrabold text-text-primary">{user.username}</p>
                                                            <p className="mt-1 flex items-center gap-1.5 truncate text-[11px] text-text-tertiary">
                                                                <Mail className="h-3 w-3 shrink-0" aria-hidden="true" />
                                                                {user.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4"><RoleBadge role={user.role} /></td>
                                                <td className="px-6 py-4 text-center text-sm font-black text-text-primary">{user._count.enrollments}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <p className="text-sm font-black text-text-primary">{activityCount}</p>
                                                    <p className="mt-1 text-[9px] uppercase tracking-[0.1em] text-text-tertiary">lượt nộp</p>
                                                </td>
                                                <td className="px-6 py-4 text-xs font-medium text-text-tertiary">
                                                    {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <Link
                                                            to={`/admin/users/${user.id}`}
                                                            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-violet-50 px-3 text-[11px] font-extrabold text-violet-700 transition hover:bg-violet-100 dark:bg-violet-500/10 dark:text-violet-300"
                                                        >
                                                            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                                                            Hồ sơ tri thức
                                                        </Link>
                                                        <IconButton label="Đặt lại mật khẩu" onClick={() => setResetTarget({ id: user.id, username: user.username })}>
                                                            <KeyRound className="h-4 w-4" aria-hidden="true" />
                                                        </IconButton>
                                                        <IconButton label="Xóa tài khoản" danger onClick={() => setDeleteTarget({ id: user.id, username: user.username })}>
                                                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                                                        </IconButton>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="grid gap-3 p-4 md:hidden">
                            {users.map((user) => (
                                <article key={user.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-white/8 dark:bg-white/[0.025]">
                                    <div className="flex items-start gap-3">
                                        <UserAvatar user={user} />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-extrabold text-text-primary">{user.username}</p>
                                            <p className="mt-1 truncate text-xs text-text-tertiary">{user.email}</p>
                                            <div className="mt-2"><RoleBadge role={user.role} /></div>
                                        </div>
                                    </div>
                                    <div className="mt-4 grid grid-cols-2 gap-2">
                                        <MiniStat label="Khóa học" value={user._count.enrollments} />
                                        <MiniStat label="Lượt nộp" value={user._count.submissions + user._count.practiceSubmissions} />
                                    </div>
                                    <div className="mt-4 flex gap-2">
                                        <Link
                                            to={`/admin/users/${user.id}`}
                                            className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 px-3 text-xs font-bold text-white"
                                        >
                                            <Eye className="h-4 w-4" aria-hidden="true" />
                                            Hồ sơ tri thức
                                        </Link>
                                        <IconButton label="Đặt lại mật khẩu" onClick={() => setResetTarget({ id: user.id, username: user.username })}>
                                            <KeyRound className="h-4 w-4" />
                                        </IconButton>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </>
                )}

                <div className="flex flex-col justify-between gap-3 border-t border-slate-100 px-5 py-4 dark:border-white/8 sm:flex-row sm:items-center sm:px-6">
                    <p className="text-xs text-text-tertiary">
                        Tổng cộng <strong className="text-text-primary">{numberFormatter.format(pagination.total)}</strong> tài khoản phù hợp
                    </p>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setPagination((current) => ({ ...current, page: current.page - 1 }))}
                            disabled={pagination.page <= 1}
                            className="inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-text-secondary transition hover:border-violet-200 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/5"
                        >
                            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                            Trang trước
                        </button>
                        <button
                            type="button"
                            onClick={() => setPagination((current) => ({ ...current, page: current.page + 1 }))}
                            disabled={pagination.page >= pagination.totalPages || pagination.totalPages === 0}
                            className="inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-text-secondary transition hover:border-violet-200 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/5"
                        >
                            Trang sau
                            <ChevronRight className="h-4 w-4" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </section>

            {showCreateModal && (
                <CreateUserModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        setShowCreateModal(false);
                        void loadUsers();
                    }}
                />
            )}

            {resetTarget && (
                <ActionModal
                    title="Đặt lại mật khẩu"
                    description={`Tạo mật khẩu mới cho tài khoản “${resetTarget.username}”.`}
                    icon={KeyRound}
                    onClose={() => {
                        setResetTarget(null);
                        setNewPassword('');
                    }}
                >
                    <label className="block text-[11px] font-extrabold uppercase tracking-[0.12em] text-text-tertiary" htmlFor="new-password">
                        Mật khẩu mới
                    </label>
                    <input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-text-primary outline-none focus:border-violet-500 dark:border-white/10 dark:bg-bg-tertiary"
                        autoFocus
                    />
                    <button
                        type="button"
                        onClick={() => void handleResetPassword()}
                        disabled={!newPassword.trim() || actionLoading}
                        className="mt-5 inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-bold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {actionLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                        Xác nhận đổi mật khẩu
                    </button>
                </ActionModal>
            )}

            {deleteTarget && (
                <ActionModal
                    title="Xóa tài khoản"
                    description={`Tài khoản “${deleteTarget.username}” và dữ liệu liên quan sẽ bị xóa khỏi hệ thống.`}
                    icon={AlertTriangle}
                    danger
                    onClose={() => setDeleteTarget(null)}
                >
                    <button
                        type="button"
                        onClick={() => void handleDelete()}
                        disabled={actionLoading}
                        className="mt-2 inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 text-sm font-bold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {actionLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        Xóa tài khoản
                    </button>
                </ActionModal>
            )}
        </div>
    );
}

function UserAvatar({ user }: { user: ManagedUser }) {
    if (user.avatarUrl) {
        return <img src={user.avatarUrl} alt="" className="h-10 w-10 shrink-0 rounded-xl object-cover" />;
    }
    return (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-black uppercase text-white shadow-sm">
            {user.username.charAt(0)}
        </span>
    );
}

function RoleBadge({ role }: { role: ManagedUser['role'] }) {
    const styles = {
        ADMIN: 'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300',
        TEACHER: 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-300',
        STUDENT: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300',
    };
    const labels = { ADMIN: 'Quản trị viên', TEACHER: 'Giảng viên', STUDENT: 'Học viên' };
    return (
        <span className={`inline-flex rounded-full border px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.1em] ${styles[role]}`}>
            {labels[role]}
        </span>
    );
}

function IconButton({
    label,
    danger = false,
    onClick,
    children,
}: {
    label: string;
    danger?: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border transition focus-visible:outline-none focus-visible:ring-2 ${
                danger
                    ? 'border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100 focus-visible:ring-rose-500 dark:border-rose-500/15 dark:bg-rose-500/10 dark:text-rose-300'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-violet-200 hover:text-violet-700 focus-visible:ring-violet-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300'
            }`}
            aria-label={label}
            title={label}
        >
            {children}
        </button>
    );
}

function MiniStat({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-xl bg-white p-3 dark:bg-white/5">
            <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-text-tertiary">{label}</p>
            <p className="mt-1 text-lg font-black text-text-primary">{numberFormatter.format(value)}</p>
        </div>
    );
}

function ActionModal({
    title,
    description,
    icon: Icon,
    danger = false,
    onClose,
    children,
}: {
    title: string;
    description: string;
    icon: typeof KeyRound;
    danger?: boolean;
    onClose: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={title}>
            <div className="w-full max-w-md rounded-[24px] border border-white/50 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#131827]">
                <div className="flex items-start justify-between gap-4">
                    <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${danger ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300' : 'bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300'}`}>
                        <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <button type="button" onClick={onClose} className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 dark:hover:bg-white/5" aria-label="Đóng">
                        <X className="h-4 w-4" />
                    </button>
                </div>
                <h3 className="mt-5 text-lg font-black text-text-primary">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-text-secondary">{description}</p>
                <div className="mt-5">{children}</div>
            </div>
        </div>
    );
}

function CreateUserModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'STUDENT',
        gender: 'MALE',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            setIsSubmitting(true);
            await adminApi.createUser(formData);
            onSuccess();
        } catch (error) {
            console.error('Failed to create user:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Tạo học viên mới">
            <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-[26px] border border-white/50 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#131827] sm:p-7">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                            <UserRoundPlus className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <div>
                            <h3 className="text-lg font-black text-text-primary">Tạo học viên mới</h3>
                            <p className="mt-1 text-xs text-text-tertiary">Khởi tạo tài khoản và phân quyền truy cập.</p>
                        </div>
                    </div>
                    <button type="button" onClick={onClose} className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 dark:hover:bg-white/5" aria-label="Đóng">
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <FormField label="Tên đăng nhập" icon={UserRound}>
                        <input
                            required
                            value={formData.username}
                            onChange={(event) => setFormData((current) => ({ ...current, username: event.target.value }))}
                            className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-text-primary outline-none focus:border-violet-500 dark:border-white/10 dark:bg-bg-tertiary"
                        />
                    </FormField>
                    <FormField label="Email" icon={Mail}>
                        <input
                            required
                            type="email"
                            value={formData.email}
                            onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                            className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-text-primary outline-none focus:border-violet-500 dark:border-white/10 dark:bg-bg-tertiary"
                        />
                    </FormField>
                    <FormField label="Mật khẩu khởi tạo" icon={KeyRound}>
                        <input
                            required
                            type="password"
                            value={formData.password}
                            onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
                            className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-text-primary outline-none focus:border-violet-500 dark:border-white/10 dark:bg-bg-tertiary"
                        />
                    </FormField>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField label="Vai trò" icon={ShieldCheck}>
                            <select
                                value={formData.role}
                                onChange={(event) => setFormData((current) => ({ ...current, role: event.target.value }))}
                                className="min-h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-text-primary outline-none focus:border-violet-500 dark:border-white/10 dark:bg-bg-tertiary"
                            >
                                <option value="STUDENT">Học viên</option>
                                <option value="TEACHER">Giảng viên</option>
                                <option value="ADMIN">Quản trị viên</option>
                            </select>
                        </FormField>
                        <FormField label="Giới tính" icon={UserRound}>
                            <select
                                value={formData.gender}
                                onChange={(event) => setFormData((current) => ({ ...current, gender: event.target.value }))}
                                className="min-h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-text-primary outline-none focus:border-violet-500 dark:border-white/10 dark:bg-bg-tertiary"
                            >
                                <option value="MALE">Nam</option>
                                <option value="FEMALE">Nữ</option>
                                <option value="OTHER">Khác</option>
                            </select>
                        </FormField>
                    </div>
                    <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row">
                        <button type="button" onClick={onClose} className="min-h-11 flex-1 cursor-pointer rounded-xl border border-slate-200 text-sm font-bold text-text-secondary transition hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5">
                            Hủy
                        </button>
                        <button type="submit" disabled={isSubmitting} className="inline-flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-violet-600 text-sm font-bold text-white transition hover:bg-violet-700 disabled:opacity-50">
                            {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <UserRoundPlus className="h-4 w-4" />}
                            Tạo tài khoản
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function FormField({
    label,
    icon: Icon,
    children,
}: {
    label: string;
    icon: typeof UserRound;
    children: React.ReactNode;
}) {
    return (
        <label className="block">
            <span className="mb-2 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.12em] text-text-tertiary">
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {label}
            </span>
            {children}
        </label>
    );
}
