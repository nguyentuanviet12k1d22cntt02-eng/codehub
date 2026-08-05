import { useEffect, useState } from 'react';
import { adminApi } from '../../services/adminApi';

export default function SubmissionManagement() {
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
    const [filters, setFilters] = useState({ status: '' });

    useEffect(() => {
        loadSubmissions();
    }, [pagination.page, filters]);

    const loadSubmissions = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getAllSubmissions({
                page: pagination.page,
                limit: pagination.limit,
                status: filters.status || undefined
            });
            setSubmissions(data.submissions);
            setPagination(prev => ({ ...prev, ...data.pagination }));
        } catch (error) {
            console.error('Failed to load submissions:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 w-full max-w-[1240px] mx-auto text-left select-none animate-fadeIn">
            {/* Header Block */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col gap-1 text-left">
                    <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Submissions</h1>
                    <p className="text-text-tertiary text-sm">Giám sát và kiểm tra mã nguồn, thời gian xử lý và trạng thái nộp bài thi đấu của học viên.</p>
                </div>
            </div>

            {/* Filters Section */}
            <div className="bg-bg-secondary border border-border-custom rounded-2xl p-5 shadow-sm hover:border-border-custom/80 transition-all duration-300">
                <div className="flex flex-wrap gap-4 items-stretch">
                    <div className="w-full sm:w-48">
                        <select
                            className="w-full bg-bg-primary text-text-primary border border-border-custom rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-accent-custom cursor-pointer transition-all"
                            value={filters.status}
                            onChange={(e) => setFilters({ status: e.target.value })}
                        >
                            <option value="">Tất cả Trạng thái</option>
                            <option value="PASSED">Chính xác (PASSED)</option>
                            <option value="FAILED">Sai kết quả (FAILED)</option>
                            <option value="PENDING">Đang chờ chấm (PENDING)</option>
                        </select>
                    </div>

                    <button
                        onClick={() => setPagination({ ...pagination, page: 1 })}
                        className="px-6 py-2.5 bg-bg-tertiary hover:bg-bg-tertiary/80 text-text-primary text-xs font-bold rounded-xl border border-border-custom transition-all active:scale-[0.98] cursor-pointer"
                    >
                        Lọc kết quả
                    </button>
                </div>
            </div>

            {/* Submissions Table Card */}
            <div className="bg-bg-secondary border border-border-custom rounded-2xl p-6 shadow-sm overflow-hidden flex flex-col gap-6">
                <div className="overflow-x-auto rounded-xl border border-border-custom/50">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="w-8 h-8 border-3 border-accent-custom border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-xs font-bold text-text-tertiary tracking-wider animate-pulse">ĐANG TẢI BÀI NỘP...</span>
                        </div>
                    ) : (
                        <>
                            <table className="min-w-full divide-y divide-border-custom bg-transparent text-left">
                                <thead className="bg-bg-tertiary/30">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">Học sinh</th>
                                        <th className="px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">Tên Bài tập</th>
                                        <th className="px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">Độ khó</th>
                                        <th className="px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">Ngôn ngữ</th>
                                        <th className="px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">Trạng thái</th>
                                        <th className="px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">Runtime (Thời gian chạy)</th>
                                        <th className="px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">Thời gian nộp</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-custom/50 divide-dashed">
                                    {submissions.map((submission) => (
                                        <tr key={submission.id} className="hover:bg-bg-tertiary/20 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap text-[13px] font-bold text-text-primary">{submission.user.username}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-[13px] font-bold text-text-secondary">{submission.exercise.title}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2.5 py-1 text-[10px] font-black rounded-lg border tracking-wider ${getDifficultyBadgeStyle(submission.exercise.difficulty)}`}>
                                                    {submission.exercise.difficulty}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-[13px] text-text-tertiary font-mono">{submission.language}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2.5 py-1 text-[10px] font-black rounded-lg border tracking-wider ${getStatusBadgeStyle(submission.status)}`}>
                                                    {submission.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-text-secondary">
                                                {submission.runtime ? `${submission.runtime} ms` : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-xs text-text-tertiary">
                                                {new Date(submission.submittedAt).toLocaleString('vi-VN')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination controls */}
                            <div className="pt-4 flex justify-between items-center text-xs font-semibold border-t border-border-custom/50">
                                <span className="text-text-tertiary">
                                    Hiển thị trang <strong className="text-text-primary">{pagination.page}</strong> / {pagination.totalPages || 1} (Tổng số {pagination.total} lượt nộp bài)
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

function getDifficultyBadgeStyle(difficulty: string) {
    switch (difficulty) {
        case 'EASY':
            return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
        case 'MEDIUM':
            return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
        case 'HARD':
            return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
        default:
            return 'bg-bg-tertiary text-text-secondary border-border-custom/50';
    }
}

function getStatusBadgeStyle(status: string) {
    switch (status) {
        case 'PASSED':
            return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
        case 'FAILED':
            return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
        case 'PENDING':
            return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
        default:
            return 'bg-bg-tertiary text-text-secondary border-border-custom/55';
    }
}
