import { useEffect, useMemo, useState } from 'react';
import {
    Activity,
    BookOpenCheck,
    CheckCircle2,
    CircleHelp,
    ClipboardCheck,
    Clock3,
    Layers3,
    LibraryBig,
    LoaderCircle,
    RefreshCw,
    Target,
    TriangleAlert,
    UsersRound,
} from 'lucide-react';
import { adminApi } from '../../../features/admin/services/adminApi';

interface RecentUser {
    id: string;
    username: string;
    email: string;
    role: string;
    createdAt: string;
}

interface DashboardStats {
    overview: {
        totalUsers: number;
        totalCourses: number;
        totalLessons: number;
        totalSubmissions: number;
        totalPracticeProblems: number;
    };
    recentUsers: RecentUser[];
    charts: {
        usersByRole: { role: string; count: number }[];
        coursesByLevel: { level: string; count: number }[];
        submissionsByStatus: { status: string; count: number }[];
        courseSubmissionsStats: {
            id: string;
            title: string;
            stats: {
                total: number;
                passed: number;
                failed: number;
                pending: number;
            };
        }[];
        conceptPassReport: {
            id: string;
            name: string;
            passed: number;
            failed: number;
            total: number;
        }[];
    };
}

const numberFormatter = new Intl.NumberFormat('vi-VN');

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedCourseId, setSelectedCourseId] = useState('all');
    const [selectedConceptId, setSelectedConceptId] = useState('KC_VAR');

    const loadStats = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getDashboardStats();
            setStats(data);
        } catch (error) {
            console.error('Failed to load stats:', error);
            setStats(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch dashboard data once when the page mounts
        void loadStats();
    }, []);

    const dashboardData = useMemo(() => {
        if (!stats) return null;

        const statusCount = (status: string) =>
            stats.charts.submissionsByStatus.find((item) => item.status === status)?.count ?? 0;
        const globalPassed = statusCount('PASSED');
        const globalFailed = statusCount('FAILED');
        const globalPending = statusCount('PENDING');
        const globalTotal = globalPassed + globalFailed + globalPending;
        const selectedCourse =
            selectedCourseId === 'all'
                ? null
                : stats.charts.courseSubmissionsStats.find((course) => course.id === selectedCourseId);

        const passed = selectedCourse?.stats.passed ?? globalPassed;
        const failed = selectedCourse?.stats.failed ?? globalFailed;
        const pending = selectedCourse?.stats.pending ?? globalPending;
        const total = selectedCourse?.stats.total ?? passed + failed + pending;
        const selectedConcept =
            stats.charts.conceptPassReport.find((concept) => concept.id === selectedConceptId) ??
            stats.charts.conceptPassReport[0] ??
            null;

        const percent = (value: number, base: number) =>
            base > 0 ? Math.round((value / base) * 100) : 0;

        return {
            passed,
            failed,
            pending,
            total,
            globalPassPercent: percent(globalPassed, globalTotal),
            passPercent: percent(passed, total),
            failPercent: percent(failed, total),
            pendingPercent: percent(pending, total),
            selectedConcept,
            conceptPassPercent: selectedConcept ? percent(selectedConcept.passed, selectedConcept.total) : 0,
            conceptFailPercent: selectedConcept ? percent(selectedConcept.failed, selectedConcept.total) : 0,
            coursePerformance: [...stats.charts.courseSubmissionsStats]
                .sort((a, b) => b.stats.total - a.stats.total)
                .slice(0, 5),
        };
    }, [selectedConceptId, selectedCourseId, stats]);

    if (loading) {
        return (
            <div className="mx-auto flex min-h-[68vh] w-full max-w-[1480px] items-center justify-center">
                <div className="flex flex-col items-center gap-4 rounded-3xl border border-violet-100 bg-white px-10 py-9 text-center shadow-[0_20px_60px_-38px_rgba(79,70,229,0.4)] dark:border-white/10 dark:bg-bg-secondary">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
                        <LoaderCircle className="h-7 w-7 animate-spin" aria-hidden="true" />
                    </span>
                    <div>
                        <p className="text-sm font-extrabold text-text-primary">Đang tổng hợp dữ liệu</p>
                        <p className="mt-1 text-xs text-text-tertiary">Vui lòng chờ trong giây lát.</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!stats || !dashboardData) {
        return (
            <div className="mx-auto flex min-h-[68vh] w-full max-w-[1480px] items-center justify-center">
                <div className="flex max-w-md flex-col items-center gap-4 rounded-3xl border border-rose-200 bg-white px-8 py-9 text-center shadow-sm dark:border-rose-500/20 dark:bg-bg-secondary">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
                        <TriangleAlert className="h-7 w-7" aria-hidden="true" />
                    </span>
                    <div>
                        <p className="text-base font-extrabold text-text-primary">Chưa tải được dữ liệu tổng quan</p>
                        <p className="mt-1 text-sm leading-6 text-text-secondary">Kết nối dữ liệu có thể đang gián đoạn. Hãy thử tải lại.</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => void loadStats()}
                        className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-bold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                    >
                        <RefreshCw className="h-4 w-4" aria-hidden="true" />
                        Tải lại dữ liệu
                    </button>
                </div>
            </div>
        );
    }

    const metricCards = [
        {
            label: 'Tổng học viên',
            value: stats.overview.totalUsers,
            hint: 'Tài khoản trong hệ thống',
            icon: UsersRound,
            iconClass: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
            accentClass: 'from-violet-500 to-indigo-500',
        },
        {
            label: 'Khóa học',
            value: stats.overview.totalCourses,
            hint: `${numberFormatter.format(stats.overview.totalLessons)} bài học đang quản lý`,
            icon: LibraryBig,
            iconClass: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
            accentClass: 'from-sky-400 to-cyan-500',
        },
        {
            label: 'Lượt nộp bài',
            value: stats.overview.totalSubmissions,
            hint: `${numberFormatter.format(stats.overview.totalPracticeProblems)} bài luyện tập`,
            icon: ClipboardCheck,
            iconClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
            accentClass: 'from-emerald-400 to-teal-500',
        },
        {
            label: 'Tỷ lệ vượt qua',
            value: `${dashboardData.globalPassPercent}%`,
            hint: 'Trên toàn bộ lượt nộp',
            icon: Target,
            iconClass: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
            accentClass: 'from-amber-400 to-orange-500',
        },
    ];

    return (
        <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-6 text-left text-text-primary">
            <section className="relative overflow-hidden rounded-[28px] border border-violet-100 bg-[linear-gradient(120deg,#ffffff_0%,#f5f3ff_58%,#ecfeff_100%)] px-5 py-6 shadow-[0_20px_60px_-42px_rgba(79,70,229,0.45)] dark:border-white/10 dark:bg-[linear-gradient(120deg,#111522_0%,#18172b_58%,#102129_100%)] sm:px-7">
                <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-cyan-300/20 blur-3xl dark:bg-cyan-500/10" aria-hidden="true" />
                <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-violet-300/25 blur-3xl dark:bg-violet-500/10" aria-hidden="true" />
                <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-300">
                            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-500/15">
                                <Activity className="h-3.5 w-3.5" aria-hidden="true" />
                            </span>
                            Dữ liệu vận hành
                        </div>
                        <h2 className="text-2xl font-black tracking-[-0.04em] text-slate-950 dark:text-white sm:text-[28px]">
                            Bức tranh tổng quan hôm nay
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                            Theo dõi học viên, học liệu và chất lượng bài nộp trong một bố cục thống nhất, dễ đọc.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => void loadStats()}
                        className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 self-start rounded-xl border border-violet-200 bg-white/90 px-4 text-sm font-bold text-violet-700 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:border-violet-400/20 dark:bg-white/5 dark:text-violet-200 sm:self-auto"
                    >
                        <RefreshCw className="h-4 w-4" aria-hidden="true" />
                        Làm mới
                    </button>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Chỉ số tổng quan">
                {metricCards.map((metric) => {
                    const Icon = metric.icon;
                    return (
                        <article
                            key={metric.label}
                            className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_16px_42px_-34px_rgba(15,23,42,0.45)] transition duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-[0_22px_52px_-34px_rgba(79,70,229,0.35)] dark:border-white/10 dark:bg-bg-secondary"
                        >
                            <span className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${metric.accentClass}`} aria-hidden="true" />
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs font-bold text-text-tertiary">{metric.label}</p>
                                    <p className="mt-3 text-3xl font-black tracking-[-0.05em] text-text-primary">
                                        {typeof metric.value === 'number' ? numberFormatter.format(metric.value) : metric.value}
                                    </p>
                                    <p className="mt-2 text-[11px] font-medium text-text-tertiary">{metric.hint}</p>
                                </div>
                                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${metric.iconClass}`}>
                                    <Icon className="h-5 w-5" aria-hidden="true" />
                                </span>
                            </div>
                        </article>
                    );
                })}
            </section>

            <section className="grid grid-cols-1 gap-5 xl:grid-cols-12">
                <article className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_48px_-38px_rgba(15,23,42,0.45)] dark:border-white/10 dark:bg-bg-secondary sm:p-6 xl:col-span-7">
                    <SectionHeader
                        icon={ClipboardCheck}
                        title="Chất lượng bài nộp"
                        description="Tỷ lệ theo trạng thái xử lý thực tế"
                    >
                        <select
                            value={selectedCourseId}
                            onChange={(event) => setSelectedCourseId(event.target.value)}
                            className="min-h-10 max-w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 outline-none transition hover:border-violet-300 focus:border-violet-500 dark:border-white/10 dark:bg-bg-tertiary dark:text-text-primary"
                            aria-label="Lọc thống kê theo khóa học"
                        >
                            <option value="all">Tất cả khóa học</option>
                            {stats.charts.courseSubmissionsStats.map((course) => (
                                <option key={course.id} value={course.id}>{course.title}</option>
                            ))}
                        </select>
                    </SectionHeader>

                    <div className="mt-7 grid items-center gap-8 md:grid-cols-[180px_1fr]">
                        <div className="mx-auto">
                            <div
                                className="relative flex h-40 w-40 items-center justify-center rounded-full"
                                style={{
                                    background: dashboardData.total > 0
                                        ? `conic-gradient(#10b981 0 ${dashboardData.passPercent}%, #fb7185 ${dashboardData.passPercent}% ${dashboardData.passPercent + dashboardData.failPercent}%, #fbbf24 ${dashboardData.passPercent + dashboardData.failPercent}% 100%)`
                                        : 'conic-gradient(#e2e8f0 0 100%)',
                                }}
                                role="img"
                                aria-label={`Tỷ lệ bài vượt qua ${dashboardData.passPercent}%`}
                            >
                                <div className="flex h-[116px] w-[116px] flex-col items-center justify-center rounded-full bg-white shadow-inner dark:bg-bg-secondary">
                                    <span className="text-3xl font-black tracking-[-0.05em] text-text-primary">{dashboardData.passPercent}%</span>
                                    <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-text-tertiary">Vượt qua</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/5" aria-hidden="true">
                                <span className="bg-emerald-500" style={{ width: `${dashboardData.passPercent}%` }} />
                                <span className="bg-rose-400" style={{ width: `${dashboardData.failPercent}%` }} />
                                <span className="bg-amber-400" style={{ width: `${dashboardData.pendingPercent}%` }} />
                            </div>
                            <div className="mt-5 grid gap-3 sm:grid-cols-3">
                                <StatusCard icon={CheckCircle2} label="Đã đạt" value={dashboardData.passed} percent={dashboardData.passPercent} tone="emerald" />
                                <StatusCard icon={CircleHelp} label="Chưa đạt" value={dashboardData.failed} percent={dashboardData.failPercent} tone="rose" />
                                <StatusCard icon={Clock3} label="Đang chờ" value={dashboardData.pending} percent={dashboardData.pendingPercent} tone="amber" />
                            </div>
                            <p className="mt-5 text-xs leading-5 text-text-tertiary">
                                Tổng cộng <strong className="text-text-primary">{numberFormatter.format(dashboardData.total)}</strong> lượt nộp trong phạm vi đang chọn.
                            </p>
                        </div>
                    </div>
                </article>

                <article className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_48px_-38px_rgba(15,23,42,0.45)] dark:border-white/10 dark:bg-bg-secondary sm:p-6 xl:col-span-5">
                    <SectionHeader
                        icon={Layers3}
                        title="Kho nội dung"
                        description="Quy mô học liệu đang được quản lý"
                    />
                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <InventoryCard icon={LibraryBig} label="Khóa học" value={stats.overview.totalCourses} tone="violet" />
                        <InventoryCard icon={BookOpenCheck} label="Bài học" value={stats.overview.totalLessons} tone="sky" />
                        <InventoryCard icon={CircleHelp} label="Bài luyện tập" value={stats.overview.totalPracticeProblems} tone="emerald" />
                        <InventoryCard icon={UsersRound} label="Người dùng" value={stats.overview.totalUsers} tone="amber" />
                    </div>

                    <div className="mt-5 rounded-2xl bg-slate-50 p-4 dark:bg-white/[0.035]">
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-text-tertiary">Phân bổ vai trò</p>
                        <div className="mt-3 space-y-3">
                            {stats.charts.usersByRole.map((item) => {
                                const percent = stats.overview.totalUsers > 0
                                    ? Math.round((item.count / stats.overview.totalUsers) * 100)
                                    : 0;
                                return (
                                    <div key={item.role}>
                                        <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
                                            <span className="font-semibold text-text-secondary">{roleLabel(item.role)}</span>
                                            <span className="font-extrabold text-text-primary">{numberFormatter.format(item.count)}</span>
                                        </div>
                                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-200/70 dark:bg-white/8">
                                            <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-sky-400" style={{ width: `${percent}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </article>
            </section>

            <section className="grid grid-cols-1 gap-5 xl:grid-cols-12">
                <article className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_48px_-38px_rgba(15,23,42,0.45)] dark:border-white/10 dark:bg-bg-secondary sm:p-6 xl:col-span-7">
                    <SectionHeader
                        icon={Target}
                        title="Mức độ thông thạo kiến thức"
                        description="Đánh giá theo chủ đề với ngưỡng đạt 75%"
                    >
                        <select
                            value={dashboardData.selectedConcept?.id ?? ''}
                            onChange={(event) => setSelectedConceptId(event.target.value)}
                            className="min-h-10 max-w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 outline-none transition hover:border-violet-300 focus:border-violet-500 dark:border-white/10 dark:bg-bg-tertiary dark:text-text-primary"
                            aria-label="Chọn chủ đề kiến thức"
                        >
                            {stats.charts.conceptPassReport.map((concept) => (
                                <option key={concept.id} value={concept.id}>{concept.name}</option>
                            ))}
                        </select>
                    </SectionHeader>

                    {dashboardData.selectedConcept ? (
                        <div className="mt-7">
                            <div className="rounded-2xl border border-violet-100 bg-[linear-gradient(120deg,#fafaff,#f3f9ff)] p-5 dark:border-white/8 dark:bg-[linear-gradient(120deg,rgba(139,92,246,.08),rgba(14,165,233,.05))]">
                                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                                    <div>
                                        <p className="text-xs font-bold text-violet-600 dark:text-violet-300">Chủ đề đang xem</p>
                                        <h3 className="mt-1.5 text-lg font-extrabold text-text-primary">{dashboardData.selectedConcept.name}</h3>
                                    </div>
                                    <p className="text-sm font-semibold text-text-secondary">
                                        {numberFormatter.format(dashboardData.selectedConcept.total)} học viên được đánh giá
                                    </p>
                                </div>

                                <div className="mt-6 flex h-5 w-full overflow-hidden rounded-full bg-white shadow-inner dark:bg-white/5">
                                    <div
                                        className="flex h-full items-center justify-center bg-gradient-to-r from-emerald-400 to-teal-500 text-[9px] font-black text-white transition-[width] duration-500"
                                        style={{ width: `${dashboardData.conceptPassPercent}%` }}
                                    >
                                        {dashboardData.conceptPassPercent >= 15 ? `${dashboardData.conceptPassPercent}%` : ''}
                                    </div>
                                    <div
                                        className="flex h-full items-center justify-center bg-gradient-to-r from-rose-400 to-pink-500 text-[9px] font-black text-white transition-[width] duration-500"
                                        style={{ width: `${dashboardData.conceptFailPercent}%` }}
                                    >
                                        {dashboardData.conceptFailPercent >= 15 ? `${dashboardData.conceptFailPercent}%` : ''}
                                    </div>
                                </div>

                                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                    <div className="rounded-xl border border-emerald-200/70 bg-white/80 p-4 dark:border-emerald-500/20 dark:bg-white/5">
                                        <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-emerald-600 dark:text-emerald-300">Đạt chuẩn</p>
                                        <p className="mt-2 text-2xl font-black text-text-primary">{numberFormatter.format(dashboardData.selectedConcept.passed)}</p>
                                        <p className="mt-1 text-xs text-text-tertiary">{dashboardData.conceptPassPercent}% tổng số đánh giá</p>
                                    </div>
                                    <div className="rounded-xl border border-rose-200/70 bg-white/80 p-4 dark:border-rose-500/20 dark:bg-white/5">
                                        <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-rose-600 dark:text-rose-300">Cần củng cố</p>
                                        <p className="mt-2 text-2xl font-black text-text-primary">{numberFormatter.format(dashboardData.selectedConcept.failed)}</p>
                                        <p className="mt-1 text-xs text-text-tertiary">{dashboardData.conceptFailPercent}% tổng số đánh giá</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <EmptyState message="Chưa có dữ liệu đánh giá chủ đề." />
                    )}
                </article>

                <article className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_48px_-38px_rgba(15,23,42,0.45)] dark:border-white/10 dark:bg-bg-secondary sm:p-6 xl:col-span-5">
                    <SectionHeader
                        icon={Activity}
                        title="Hiệu suất theo khóa học"
                        description="Xếp theo tổng lượt nộp bài"
                    />
                    {dashboardData.coursePerformance.length > 0 ? (
                        <div className="mt-6 space-y-5">
                            {dashboardData.coursePerformance.map((course) => {
                                const percent = course.stats.total > 0
                                    ? Math.round((course.stats.passed / course.stats.total) * 100)
                                    : 0;
                                return (
                                    <div key={course.id}>
                                        <div className="mb-2 flex items-center justify-between gap-4">
                                            <p className="min-w-0 truncate text-xs font-bold text-text-secondary" title={course.title}>{course.title}</p>
                                            <span className="shrink-0 text-xs font-black text-text-primary">{percent}%</span>
                                        </div>
                                        <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
                                            <div className="h-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-400" style={{ width: `${percent}%` }} />
                                        </div>
                                        <p className="mt-1.5 text-[10px] text-text-tertiary">
                                            {numberFormatter.format(course.stats.passed)}/{numberFormatter.format(course.stats.total)} lượt đạt
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <EmptyState message="Chưa có lượt nộp theo khóa học." />
                    )}
                </article>
            </section>

            <section className="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_18px_48px_-38px_rgba(15,23,42,0.45)] dark:border-white/10 dark:bg-bg-secondary">
                <div className="flex flex-col justify-between gap-3 border-b border-slate-100 px-5 py-5 dark:border-white/8 sm:flex-row sm:items-center sm:px-6">
                    <SectionHeader
                        icon={UsersRound}
                        title="Học viên mới"
                        description="Những tài khoản được tạo gần đây"
                    />
                    <span className="inline-flex w-fit items-center rounded-full bg-violet-50 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                        {stats.recentUsers.length} tài khoản gần nhất
                    </span>
                </div>

                {stats.recentUsers.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-[720px]">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3.5 text-left">Học viên</th>
                                    <th className="px-6 py-3.5 text-left">Email</th>
                                    <th className="px-6 py-3.5 text-left">Vai trò</th>
                                    <th className="px-6 py-3.5 text-left">Ngày tham gia</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentUsers.slice(0, 6).map((user) => (
                                    <tr key={user.id} className="border-t border-slate-100 dark:border-white/5">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-black uppercase text-white shadow-sm">
                                                    {user.username.charAt(0)}
                                                </span>
                                                <span className="text-xs font-bold text-text-primary">{user.username}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-text-secondary">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex rounded-full border px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.1em] ${roleBadgeClass(user.role)}`}>
                                                {roleLabel(user.role)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-medium text-text-tertiary">
                                            {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <EmptyState message="Chưa có học viên mới." />
                )}
            </section>
        </div>
    );
}

function SectionHeader({
    icon: Icon,
    title,
    description,
    children,
}: {
    icon: typeof Activity;
    title: string;
    description: string;
    children?: React.ReactNode;
}) {
    return (
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                    <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                </span>
                <div>
                    <h3 className="text-sm font-extrabold text-text-primary">{title}</h3>
                    <p className="mt-1 text-[11px] text-text-tertiary">{description}</p>
                </div>
            </div>
            {children}
        </div>
    );
}

function StatusCard({
    icon: Icon,
    label,
    value,
    percent,
    tone,
}: {
    icon: typeof CheckCircle2;
    label: string;
    value: number;
    percent: number;
    tone: 'emerald' | 'rose' | 'amber';
}) {
    const styles = {
        emerald: 'border-emerald-100 bg-emerald-50/70 text-emerald-700 dark:border-emerald-500/15 dark:bg-emerald-500/8 dark:text-emerald-300',
        rose: 'border-rose-100 bg-rose-50/70 text-rose-700 dark:border-rose-500/15 dark:bg-rose-500/8 dark:text-rose-300',
        amber: 'border-amber-100 bg-amber-50/70 text-amber-700 dark:border-amber-500/15 dark:bg-amber-500/8 dark:text-amber-300',
    };

    return (
        <div className={`rounded-xl border p-3 ${styles[tone]}`}>
            <div className="flex items-center gap-2">
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span className="text-[10px] font-extrabold uppercase tracking-[0.1em]">{label}</span>
            </div>
            <p className="mt-2 text-lg font-black text-text-primary">{numberFormatter.format(value)}</p>
            <p className="mt-0.5 text-[10px] font-bold">{percent}% tổng số</p>
        </div>
    );
}

function InventoryCard({
    icon: Icon,
    label,
    value,
    tone,
}: {
    icon: typeof LibraryBig;
    label: string;
    value: number;
    tone: 'violet' | 'sky' | 'emerald' | 'amber';
}) {
    const styles = {
        violet: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
        sky: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
        emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
        amber: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
    };

    return (
        <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 dark:border-white/5 dark:bg-white/[0.035]">
            <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${styles[tone]}`}>
                <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <p className="mt-4 text-2xl font-black tracking-[-0.04em] text-text-primary">{numberFormatter.format(value)}</p>
            <p className="mt-1 text-[11px] font-semibold text-text-tertiary">{label}</p>
        </div>
    );
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="mt-6 flex min-h-32 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-5 text-center text-xs font-semibold text-text-tertiary dark:border-white/10 dark:bg-white/[0.025]">
            {message}
        </div>
    );
}

function roleLabel(role: string) {
    if (role === 'ADMIN') return 'Quản trị viên';
    if (role === 'TEACHER') return 'Giảng viên';
    return 'Học viên';
}

function roleBadgeClass(role: string) {
    if (role === 'ADMIN') {
        return 'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300';
    }
    if (role === 'TEACHER') {
        return 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-300';
    }
    return 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300';
}
