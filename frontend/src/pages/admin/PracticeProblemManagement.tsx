import { useEffect, useState } from 'react';
import { adminApi } from '../../services/adminApi';

export default function PracticeProblemManagement() {
    const [problems, setProblems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
    const [filters, setFilters] = useState({ difficulty: '' });

    useEffect(() => {
        loadProblems();
    }, [pagination.page, filters]);

    const loadProblems = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getAllPracticeProblems({
                page: pagination.page,
                limit: pagination.limit,
                difficulty: filters.difficulty || undefined
            });
            setProblems(data.problems);
            setPagination(prev => ({ ...prev, ...data.pagination }));
        } catch (error) {
            console.error('Failed to load problems:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Bạn có chắc muốn xóa bài tập "${title}"?`)) return;

        try {
            await adminApi.deletePracticeProblem(id);
            alert('Xóa problem thành công');
            loadProblems();
        } catch (error) {
            alert('Lỗi khi xóa problem');
        }
    };

    return (
        <div className="flex flex-col gap-8 w-full max-w-[1240px] mx-auto text-left select-none animate-fadeIn">
            {/* Header Block */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col gap-1 text-left">
                    <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Kho Bài tập</h1>
                    <p className="text-text-tertiary text-sm">Quản lý và cập nhật kho bài tập Luyện tập trong Đấu trường sinh tử học thuật.</p>
                </div>
            </div>

            {/* Filters Section */}
            <div className="bg-bg-secondary border border-border-custom rounded-2xl p-5 shadow-sm hover:border-border-custom/80 transition-all duration-300">
                <div className="flex flex-wrap gap-4 items-stretch">
                    <div className="w-full sm:w-48">
                        <select
                            className="w-full bg-bg-primary text-text-primary border border-border-custom rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-accent-custom cursor-pointer transition-all"
                            value={filters.difficulty}
                            onChange={(e) => setFilters({ difficulty: e.target.value })}
                        >
                            <option value="">Tất cả Độ khó</option>
                            <option value="EASY">Dễ (EASY)</option>
                            <option value="MEDIUM">Trung bình (MEDIUM)</option>
                            <option value="HARD">Khó (HARD)</option>
                        </select>
                    </div>

                    <button
                        onClick={() => setPagination({ ...pagination, page: 1 })}
                        className="px-6 py-2.5 bg-bg-tertiary hover:bg-bg-tertiary/80 text-text-primary text-xs font-bold rounded-xl border border-border-custom transition-all active:scale-[0.98] cursor-pointer"
                    >
                        Lọc bài tập
                    </button>
                </div>
            </div>

            {/* Problems Table Card */}
            <div className="bg-bg-secondary border border-border-custom rounded-2xl p-6 shadow-sm overflow-hidden flex flex-col gap-6">
                <div className="overflow-x-auto rounded-xl border border-border-custom/50">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="w-8 h-8 border-3 border-accent-custom border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-xs font-bold text-text-tertiary tracking-wider animate-pulse">ĐANG TẢI KHO BÀI TẬP...</span>
                        </div>
                    ) : (
                        <>
                            <table className="min-w-full divide-y divide-border-custom bg-transparent text-left">
                                <thead className="bg-bg-tertiary/30">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">Tiêu đề bài tập</th>
                                        <th className="px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">Tên Slug (Đường dẫn)</th>
                                        <th className="px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">Độ khó</th>
                                        <th className="px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider text-center">Số Test Cases</th>
                                        <th className="px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider text-center">Lượt nộp bài</th>
                                        <th className="px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-custom/50 divide-dashed">
                                    {problems.map((problem) => (
                                        <tr key={problem.id} className="hover:bg-bg-tertiary/20 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap text-[13px] font-bold text-text-primary group-hover:text-accent-custom transition-colors">{problem.title}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-[13px] text-text-tertiary font-mono select-all">{problem.slug}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2.5 py-1 text-[10px] font-black rounded-lg border tracking-wider ${getDifficultyBadgeStyle(problem.difficulty)}`}>
                                                    {problem.difficulty}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-mono font-bold text-text-secondary">{problem._count.testCases}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-mono font-bold text-text-secondary">{problem._count.submissions}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-xs">
                                                <button
                                                    onClick={() => handleDelete(problem.id, problem.title)}
                                                    className="text-red-400 hover:text-red-500 bg-transparent border-0 cursor-pointer p-0 text-xs flex items-center gap-1.5 font-semibold"
                                                >
                                                    <i className="fa-solid fa-trash-can"></i> Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination controls */}
                            <div className="pt-4 flex justify-between items-center text-xs font-semibold border-t border-border-custom/50">
                                <span className="text-text-tertiary">
                                    Hiển thị trang <strong className="text-text-primary">{pagination.page}</strong> / {pagination.totalPages || 1} (Tổng số {pagination.total} bài tập)
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
