import { useEffect, useState } from 'react';
import { adminApi } from '../../services/adminApi';
import { Link } from 'react-router-dom';

export default function UserManagement() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
    const [filters, setFilters] = useState({ role: '', search: '' });
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        loadUsers();
    }, [pagination.page, filters]);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getAllUsers({
                page: pagination.page,
                limit: pagination.limit,
                role: filters.role || undefined,
                search: filters.search || undefined
            });
            setUsers(data.users);
            setPagination(prev => ({ ...prev, ...data.pagination }));
        } catch (error) {
            console.error('Failed to load users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, username: string) => {
        if (!confirm(`Bạn có chắc muốn xóa user "${username}"?`)) return;

        try {
            await adminApi.deleteUser(id);
            alert('Xóa user thành công');
            loadUsers();
        } catch (error) {
            alert('Lỗi khi xóa user');
        }
    };

    const handleResetPassword = async (id: string, username: string) => {
        const newPassword = prompt(`Nhập mật khẩu mới cho user "${username}":`);
        if (!newPassword) return;

        try {
            await adminApi.resetUserPassword(id, newPassword);
            alert('Reset mật khẩu thành công');
        } catch (error) {
            alert('Lỗi khi reset mật khẩu');
        }
    };

    return (
        <div className="flex flex-col gap-8 w-full max-w-[1240px] mx-auto text-left select-none animate-fadeIn">
            {/* Header Block */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col gap-1 text-left">
                    <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Quản lý Học viên</h1>
                    <p className="text-text-tertiary text-sm">Xem chi tiết thông tin, đặt lại mật khẩu, phân chia vai trò hoặc xóa tài khoản học viên.</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-5 py-3 bg-gradient-to-r from-accent-custom to-accent-hover text-white text-xs font-bold rounded-xl hover:shadow-lg hover:shadow-accent-custom/20 transition-all duration-200 active:scale-[0.98] cursor-pointer"
                >
                    + Tạo Học viên Mới
                </button>
            </div>

            {/* Filters Section */}
            <div className="bg-bg-secondary border border-border-custom rounded-2xl p-5 shadow-sm hover:border-border-custom/80 transition-all duration-300">
                <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                    <div className="flex-1 relative flex items-center">
                        <span className="absolute left-4 text-text-tertiary text-sm"><i className="fa-solid fa-magnifying-glass"></i></span>
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên đăng nhập hoặc email..."
                            className="w-full bg-bg-primary text-text-primary border border-border-custom rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-accent-custom focus:ring-1 focus:ring-accent-custom/30 transition-all"
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        />
                    </div>

                    <div className="w-full sm:w-48">
                        <select
                            className="w-full bg-bg-primary text-text-primary border border-border-custom rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-accent-custom cursor-pointer transition-all"
                            value={filters.role}
                            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                        >
                            <option value="">Tất cả Vai trò</option>
                            <option value="STUDENT">Học viên (STUDENT)</option>
                            <option value="TEACHER">Giáo viên (TEACHER)</option>
                            <option value="ADMIN">Quản trị viên (ADMIN)</option>
                        </select>
                    </div>

                    <button
                        onClick={() => setPagination({ ...pagination, page: 1 })}
                        className="px-6 py-2.5 bg-bg-tertiary hover:bg-bg-tertiary/80 text-text-primary text-xs font-bold rounded-xl border border-border-custom transition-all active:scale-[0.98] cursor-pointer"
                    >
                        Tải lại danh sách
                    </button>
                </div>
            </div>

            {/* Users Table Card */}
            <div className="bg-bg-secondary border border-border-custom rounded-2xl p-6 shadow-sm overflow-hidden flex flex-col gap-6">
                <div className="overflow-x-auto rounded-xl border border-border-custom/50">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="w-8 h-8 border-3 border-accent-custom border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-xs font-bold text-text-tertiary tracking-wider animate-pulse">ĐANG TẢI DANH SÁCH...</span>
                        </div>
                    ) : (
                        <>
                            <table className="min-w-full divide-y divide-border-custom bg-transparent text-left">
                                <thead className="bg-bg-tertiary/30">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">Học viên</th>
                                        <th className="px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">Vai trò</th>
                                        <th className="px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider text-center">Khóa đăng ký</th>
                                        <th className="px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider text-center">Số bài nộp</th>
                                        <th className="px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">Gia nhập</th>
                                        <th className="px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-custom/50 divide-dashed">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-bg-tertiary/20 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-accent-bg text-accent-custom flex items-center justify-center font-bold text-xs uppercase border border-accent-border/20 group-hover:scale-105 transition-transform">
                                                        {user.username.substring(0, 1).toUpperCase()}
                                                    </div>
                                                    <span className="text-[13px] font-bold text-text-primary">{user.username}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-[13px] text-text-secondary select-all">{user.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2.5 py-1 text-[10px] font-black rounded-lg border tracking-wider ${getRoleBadgeStyle(user.role)}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-mono font-bold text-text-secondary">{user._count.enrollments}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-mono font-bold text-text-secondary">
                                                {user._count.submissions + user._count.practiceSubmissions}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-xs text-text-tertiary">
                                                {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-xs">
                                                <div className="flex items-center gap-3 font-semibold">
                                                    <Link
                                                        to={`/admin/users/${user.id}`}
                                                        className="text-accent-custom hover:text-accent-hover no-underline text-xs flex items-center gap-1.5"
                                                    >
                                                        <i className="fa-solid fa-circle-info"></i> Chi tiết
                                                    </Link>
                                                    <button
                                                        onClick={() => handleResetPassword(user.id, user.username)}
                                                        className="text-[#ff9f0a] hover:text-[#ffb03a] bg-transparent border-0 cursor-pointer p-0 text-xs flex items-center gap-1.5 font-semibold whitespace-nowrap"
                                                    >
                                                        <i className="fa-solid fa-key"></i> Reset PW
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user.id, user.username)}
                                                        className="text-red-400 hover:text-red-500 bg-transparent border-0 cursor-pointer p-0 text-xs flex items-center gap-1.5 font-semibold"
                                                    >
                                                        <i className="fa-solid fa-trash-can"></i> Xóa
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination controls */}
                            <div className="pt-4 flex justify-between items-center text-xs font-semibold border-t border-border-custom/50">
                                <span className="text-text-tertiary">
                                    Hiển thị trang <strong className="text-text-primary">{pagination.page}</strong> / {pagination.totalPages || 1} (Tổng số {pagination.total} học viên)
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                                        disabled={pagination.page === 1}
                                        className="px-4 py-2 border border-border-custom rounded-xl disabled:opacity-40 transition-all font-bold text-text-secondary hover:bg-bg-tertiary/50 hover:text-text-primary active:scale-[0.97] cursor-pointer"
                                    >
                                        &larr; Trang trước
                                    </button>
                                    <button
                                        onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                                        disabled={pagination.page === pagination.totalPages || pagination.totalPages === 0}
                                        className="px-4 py-2 border border-border-custom rounded-xl disabled:opacity-40 transition-all font-bold text-text-secondary hover:bg-bg-tertiary/50 hover:text-text-primary active:scale-[0.97] cursor-pointer"
                                    >
                                        Trang sau &rarr;
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Create New User Modal */}
            {showCreateModal && (
                <CreateUserModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        setShowCreateModal(false);
                        loadUsers();
                    }}
                />
            )}
        </div>
    );
}

function CreateUserModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'STUDENT',
        gender: 'MALE'
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await adminApi.createUser(formData);
            alert('Tạo học viên thành công');
            onSuccess();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Lỗi khi tạo user');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 box-border">
            <div className="bg-bg-secondary border border-border-custom rounded-2xl p-6 w-full max-w-md shadow-2xl relative animate-zoomIn flex flex-col gap-6 text-left">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-black text-text-primary">Tạo Học viên Mới</h2>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 rounded-full bg-bg-tertiary text-text-tertiary hover:text-text-primary border border-border-custom/50 flex items-center justify-center font-bold cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">Tên đăng nhập (Username)</label>
                        <input
                            type="text"
                            required
                            className="bg-bg-primary text-text-primary border border-border-custom focus:border-accent-custom rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none transition-colors"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">Hòm thư Email</label>
                        <input
                            type="email"
                            required
                            className="bg-bg-primary text-text-primary border border-border-custom focus:border-accent-custom rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none transition-colors"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">Mật khẩu khởi tạo</label>
                        <input
                            type="password"
                            required
                            className="bg-bg-primary text-text-primary border border-border-custom focus:border-accent-custom rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none transition-colors"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1 flex flex-col gap-1.5">
                            <label className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">Vai trò</label>
                            <select
                                className="bg-bg-primary text-text-primary border border-border-custom rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none cursor-pointer"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="STUDENT">Student</option>
                                <option value="TEACHER">Teacher</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>

                        <div className="flex-1 flex flex-col gap-1.5">
                            <label className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">Giới tính</label>
                            <select
                                className="bg-bg-primary text-text-primary border border-border-custom rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none cursor-pointer"
                                value={formData.gender}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            >
                                <option value="MALE">Nam (Male)</option>
                                <option value="FEMALE">Nữ (Female)</option>
                                <option value="OTHER">Khác (Other)</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 font-bold text-xs">
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={onClose}
                            className="flex-1 border border-border-custom hover:bg-bg-tertiary rounded-xl py-3.5 transition-colors cursor-pointer text-text-secondary active:scale-[0.98]"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-accent-custom hover:bg-accent-hover text-white rounded-xl py-3.5 transition-all shadow-md cursor-pointer active:scale-[0.98] disabled:opacity-50"
                        >
                            {isSubmitting ? 'Đang tạo...' : 'Tạo Học viên'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function getRoleBadgeStyle(role: string) {
    switch (role) {
        case 'ADMIN':
            return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
        case 'TEACHER':
            return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
        default:
            return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    }
}
