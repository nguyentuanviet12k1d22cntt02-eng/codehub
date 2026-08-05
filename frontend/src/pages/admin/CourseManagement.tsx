import { useEffect, useState } from 'react';
import { adminApi } from '../../services/adminApi';

export default function CourseManagement() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
    const [filters, setFilters] = useState({ level: '', status: '' });

    useEffect(() => {
        loadCourses();
    }, [pagination.page, filters]);

    const loadCourses = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getAllCourses({
                page: pagination.page,
                limit: pagination.limit,
                level: filters.level || undefined,
                status: filters.status || undefined
            });
            setCourses(data.courses);
            setPagination(prev => ({ ...prev, ...data.pagination }));
        } catch (error) {
            console.error('Failed to load courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Bạn có chắc muốn xóa khóa học "${title}"? Tất cả modules, chapters, lessons liên quan sẽ bị xóa vĩnh viễn.`)) return;

        try {
            await adminApi.deleteCourse(id);
            alert('Xóa course thành công');
            loadCourses();
        } catch (error) {
            alert('Lỗi khi xóa course');
        }
    };

    return (
        <div className="flex flex-col gap-8 w-full max-w-[1240px] mx-auto text-left select-none animate-fadeIn">
            {/* Header Block */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col gap-1 text-left">
                    <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Quản lý Khóa học</h1>
                    <p className="text-text-tertiary text-sm">Cập nhật và sắp xếp lộ trình học tập Python, theo dõi số lượng mô-đun và lượt đăng ký.</p>
                </div>
            </div>

            {/* Filters Section */}
            <div className="bg-bg-secondary border border-border-custom rounded-2xl p-5 shadow-sm hover:border-border-custom/80 transition-all duration-300">
                <div className="flex flex-wrap gap-4 items-stretch">
                    <div className="w-full sm:w-48">
                        <select
                            className="w-full bg-bg-primary text-text-primary border border-border-custom rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-accent-custom cursor-pointer transition-all"
                            value={filters.level}
                            onChange={(e) => setFilters({ ...filters, level: e.target.value })}
                        >
                            <option value="">Tất cả Cấp độ</option>
                            <option value="BASIC">Cơ bản (BASIC)</option>
                            <option value="INTERMEDIATE">Trung cấp (INTERMEDIATE)</option>
                            <option value="ADVANCED">Nâng cao (ADVANCED)</option>
                        </select>
                    </div>

                    <div className="w-full sm:w-48">
                        <select
                            className="w-full bg-bg-primary text-text-primary border border-border-custom rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-accent-custom cursor-pointer transition-all"
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        >
                            <option value="">Tất cả Trạng thái</option>
                            <option value="DRAFT">Bản nháp (DRAFT)</option>
                            <option value="PUBLISHED">Công khai (PUBLISHED)</option>
                        </select>
                    </div>

                    <button
                        onClick={() => setPagination({ ...pagination, page: 1 })}
                        className="px-6 py-2.5 bg-bg-tertiary hover:bg-bg-tertiary/80 text-text-primary text-xs font-bold rounded-xl border border-border-custom transition-all active:scale-[0.98] cursor-pointer"
                    >
                        Áp dụng Bộ lọc
                    </button>
                </div>
            </div>

            {/* Courses Table Card */}
            <div className="bg-bg-secondary border border-border-custom rounded-2xl p-6 shadow-sm overflow-hidden flex flex-col gap-6">
                <div className="overflow-x-auto rounded-xl border border-border-custom/50">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="w-8 h-8 border-3 border-accent-custom border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-xs font-bold text-text-tertiary tracking-wider animate-pulse">ĐANG TẢI KHÓA HỌC...</span>
                        </div>
                    ) : (
                        <>
                            <table className="min-w-full divide-y divide-border-custom bg-transparent text-left">
                                <thead className="bg-bg-tertiary/30">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">Khóa học</th>
                                        <th className="px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">Cấp độ</th>
                                        <th className="px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">Trạng thái</th>
                                        <th className="px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">Người tạo</th>
                                        <th className="px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider text-center">Số học phần</th>
                                        <th className="px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider text-center">Gia nhập học viên</th>
                                        <th className="px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-custom/50 divide-dashed">
                                    {courses.map((course) => (
                                        <tr key={course.id} className="hover:bg-bg-tertiary/20 transition-colors group">
                                            <td className="px-6 py-4 max-w-sm">
                                                <div className="flex flex-col text-left gap-0.5">
                                                    <span className="text-[13px] font-bold text-text-primary group-hover:text-accent-custom transition-colors">{course.title}</span>
                                                    {course.description && (
                                                        <span className="text-[11px] text-text-tertiary truncate max-w-xs">{course.description}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2.5 py-1 text-[10px] font-black rounded-lg border tracking-wider ${getLevelBadgeStyle(course.level)}`}>
                                                    {course.level}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2.5 py-1 text-[10px] font-black rounded-lg border tracking-wider ${getStatusBadgeStyle(course.status)}`}>
                                                    {course.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-[13px] text-text-secondary font-semibold">{course.creator.username}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-mono font-bold text-text-secondary">{course._count.modules}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-mono font-bold text-text-secondary">{course._count.enrollments}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-xs">
                                                <button
                                                    onClick={() => handleDelete(course.id, course.title)}
                                                    className="text-red-400 hover:text-red-500 bg-transparent border-0 cursor-pointer p-0 text-xs flex items-center gap-1.5 font-semibold"
                                                >
                                                    <i className="fa-solid fa-trash-can"></i> Xóa Vĩnh Viễn
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination controls */}
                            <div className="pt-4 flex justify-between items-center text-xs font-semibold border-t border-border-custom/50">
                                <span className="text-text-tertiary">
                                    Hiển thị trang <strong className="text-text-primary">{pagination.page}</strong> / {pagination.totalPages || 1} (Tổng số {pagination.total} khóa học)
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
        </div>
    );
}

function getLevelBadgeStyle(level: string) {
    switch (level) {
        case 'BASIC':
            return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
        case 'INTERMEDIATE':
            return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
        case 'ADVANCED':
            return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
        default:
            return 'bg-bg-tertiary text-text-secondary border-border-custom/50';
    }
}

function getStatusBadgeStyle(status: string) {
    switch (status) {
        case 'PUBLISHED':
            return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
        case 'DRAFT':
            return 'bg-bg-tertiary text-text-tertiary border-border-custom/60';
        default:
            return 'bg-bg-tertiary text-text-secondary border-border-custom/50';
    }
}
