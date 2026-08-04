import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminApi } from '../../services/adminApi';

export default function UserDetail() {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        role: '',
        gender: ''
    });

    useEffect(() => {
        if (id) loadUser();
    }, [id]);

    const loadUser = async () => {
        try {
            const data = await adminApi.getUserById(id!);
            setUser(data);
            setFormData({
                username: data.username,
                email: data.email,
                role: data.role,
                gender: data.gender || ''
            });
        } catch (error) {
            console.error('Failed to load user:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await adminApi.updateUser(id!, formData);
            alert('Cập nhật thành công');
            setEditMode(false);
            loadUser();
        } catch (error) {
            alert('Lỗi khi cập nhật');
        }
    };

    if (loading) return <div className="text-center py-12">Đang tải...</div>;
    if (!user) return <div className="text-center py-12">Không tìm thấy user</div>;

    return (
        <div className="flex flex-col gap-6 w-full max-w-[1240px] mx-auto text-left select-none animate-fadeIn">
            <div className="mb-2">
                <Link to="/admin/users" className="text-accent-custom hover:text-accent-hover no-underline text-xs flex items-center gap-1.5 font-bold mb-4 cursor-pointer">
                    <i className="fa-solid fa-arrow-left"></i> Quay lại danh sách
                </Link>
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Chi tiết Học viên: {user.username}</h1>
                    <button
                        onClick={() => setEditMode(!editMode)}
                        className="px-4 py-2 bg-gradient-to-r from-accent-custom to-accent-hover text-white text-xs font-bold rounded-xl hover:shadow-[0_0_15px_var(--accent-border)] transition-all duration-200 active:scale-[0.98] cursor-pointer"
                    >
                        {editMode ? (
                            <><i className="fa-solid fa-xmark mr-1.5"></i> Hủy</>
                        ) : (
                            <><i className="fa-solid fa-pen-to-square mr-1.5"></i> Chỉnh sửa</>
                        )}
                    </button>
                </div>
            </div>

            {/* User Info */}
            <div className="bg-bg-secondary border border-border-custom rounded-2xl p-6 shadow-sm transition-colors duration-200">
                <h2 className="text-lg font-black text-text-primary mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-circle-user text-accent-custom"></i> Thông tin cơ bản
                </h2>
                {editMode ? (
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">Username</label>
                                <input
                                    type="text"
                                    className="bg-bg-primary text-text-primary border border-border-custom rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-accent-custom transition-all"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">Email</label>
                                <input
                                    type="email"
                                    className="bg-bg-primary text-text-primary border border-border-custom rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-accent-custom transition-all"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">Role</label>
                                <select
                                    className="bg-bg-primary text-text-primary border border-border-custom rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-accent-custom cursor-pointer transition-all"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="STUDENT">Student</option>
                                    <option value="TEACHER">Teacher</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">Gender</label>
                                <select
                                    className="bg-bg-primary text-text-primary border border-border-custom rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-accent-custom cursor-pointer transition-all"
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                >
                                    <option value="">Không chọn</option>
                                    <option value="MALE">Nam</option>
                                    <option value="FEMALE">Nữ</option>
                                    <option value="OTHER">Khác</option>
                                </select>
                            </div>
                        </div>
                        <div className="pt-2">
                            <button type="submit" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-md">
                                <i className="fa-solid fa-floppy-disk mr-1.5"></i> Lưu thay đổi
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <InfoRow label="Username" value={user.username} />
                        <InfoRow label="Email" value={user.email} />
                        <InfoRow label="Role" value={<RoleBadge role={user.role} />} />
                        <InfoRow label="Gender" value={user.gender || 'N/A'} />
                        <InfoRow label="Ngày tạo" value={new Date(user.createdAt).toLocaleDateString('vi-VN')} />
                        <InfoRow label="Cập nhật" value={new Date(user.updatedAt).toLocaleDateString('vi-VN')} />
                    </div>
                )}
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-2">
                <StatBox title="Enrollments" value={user._count.enrollments} icon={<i className="fa-solid fa-graduation-cap"></i>} />
                <StatBox title="Submissions" value={user._count.submissions} icon={<i className="fa-solid fa-file-code"></i>} />
                <StatBox title="Practice Subs" value={user._count.practiceSubmissions} icon={<i className="fa-solid fa-laptop-code"></i>} />
                <StatBox title="Progress" value={user._count.lessonProgress} icon={<i className="fa-solid fa-bars-progress"></i>} />
            </div>

            {/* Enrollments */}
            <div className="bg-bg-secondary border border-border-custom rounded-2xl p-6 shadow-sm transition-colors duration-200">
                <h2 className="text-lg font-black text-text-primary mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-book-open text-accent-custom"></i> Khóa học đã đăng ký ({user.enrollments.length})
                </h2>
                {user.enrollments.length > 0 ? (
                    <div className="space-y-3">
                        {user.enrollments.map((enrollment: any) => (
                            <div key={enrollment.id} className="flex justify-between items-center border-b border-border-custom pb-3 last:border-b-0 last:pb-0">
                                <div>
                                    <p className="font-bold text-text-primary text-sm">{enrollment.course.title}</p>
                                    <p className="text-xs text-text-tertiary">Level: {enrollment.course.level}</p>
                                </div>
                                <p className="text-xs text-text-tertiary">
                                    {new Date(enrollment.enrolledAt).toLocaleDateString('vi-VN')}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-text-tertiary text-xs font-semibold">Chưa đăng ký khóa học nào</p>
                )}
            </div>

            {/* Recent Submissions */}
            <div className="bg-bg-secondary border border-border-custom rounded-2xl p-6 shadow-sm transition-colors duration-200">
                <h2 className="text-lg font-black text-text-primary mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-paper-plane text-accent-custom"></i> Submissions gần đây
                </h2>
                {user.submissions.length > 0 ? (
                    <div className="space-y-3">
                        {user.submissions.map((submission: any) => (
                            <div key={submission.id} className="flex justify-between items-center border-b border-border-custom pb-3 last:border-b-0 last:pb-0">
                                <div className="text-left">
                                    <p className="font-bold text-text-primary text-sm">{submission.exercise.title}</p>
                                    <p className="text-xs text-text-tertiary">
                                        Difficulty: {submission.exercise.difficulty} | Language: {submission.language}
                                    </p>
                                </div>
                                <div className="text-right flex flex-col gap-1 items-end">
                                    <StatusBadge status={submission.status} />
                                    <p className="text-xs text-text-tertiary mt-1">
                                        {new Date(submission.submittedAt).toLocaleDateString('vi-VN')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-text-tertiary text-xs font-semibold">Chưa có submission nào</p>
                )}
            </div>

            {/* Certificates */}
            {user.certificates.length > 0 && (
                <div className="bg-bg-secondary border border-border-custom rounded-2xl p-6 shadow-sm transition-colors duration-200">
                    <h2 className="text-lg font-black text-text-primary mb-4 flex items-center gap-2">
                        <i className="fa-solid fa-award text-accent-custom"></i> Chứng chỉ ({user.certificates.length})
                    </h2>
                    <div className="space-y-3">
                        {user.certificates.map((cert: any) => (
                            <div key={cert.id} className="flex justify-between items-center border-b border-border-custom pb-3 last:border-b-0 last:pb-0">
                                <p className="font-bold text-text-primary text-xs">{cert.course.title}</p>
                                <p className="text-xs text-text-tertiary">
                                    {new Date(cert.issuedAt).toLocaleDateString('vi-VN')}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

interface InfoRowProps {
    label: string;
    value: React.ReactNode;
}

function InfoRow({ label, value }: InfoRowProps) {
    return (
        <div className="flex flex-col gap-0.5 border-b border-border-custom/40 pb-2.5 last:border-0 last:pb-0">
            <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">{label}</span>
            <span className="text-sm font-bold text-text-secondary">{value}</span>
        </div>
    );
}

interface StatBoxProps {
    title: string;
    value: number;
    icon: React.ReactNode;
}

function StatBox({ title, value, icon }: StatBoxProps) {
    return (
        <div className="bg-bg-secondary border border-border-custom rounded-2xl p-5 shadow-sm flex items-center justify-between transition-colors duration-200">
            <div className="flex flex-col gap-1.5 text-left">
                <span className="text-text-tertiary text-[11px] font-bold uppercase tracking-wider">{title}</span>
                <span className="text-3xl font-black text-text-primary">{value}</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-accent-bg text-accent-custom border border-accent-border/20 flex items-center justify-center text-lg shadow-sm">
                {icon}
            </div>
        </div>
    );
}

function RoleBadge({ role }: { role: string }) {
    const colors = {
        ADMIN: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
        TEACHER: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        STUDENT: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
    };
    return <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black border ${colors[role as keyof typeof colors]}`}>{role}</span>;
}

function StatusBadge({ status }: { status: string }) {
    const colors = {
        PASSED: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        FAILED: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
        PENDING: 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    };
    return <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black border ${colors[status as keyof typeof colors]}`}>{status}</span>;
}
