import { useEffect, useState } from 'react';
import { adminApi } from '../../services/adminApi';

interface DashboardStats {
    overview: {
        totalUsers: number;
        totalCourses: number;
        totalLessons: number;
        totalSubmissions: number;
        totalPracticeProblems: number;
    };
    recentUsers: any[];
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

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedCourseId, setSelectedCourseId] = useState<string>('all');
    const [selectedConceptId, setSelectedConceptId] = useState<string>('KC_VAR');

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getDashboardStats();
            setStats(data);
        } catch (error) {
            console.error('Failed to load stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 bg-bg-secondary text-text-primary rounded-2xl border border-border-custom transition-colors duration-200">
                <div className="w-12 h-12 border-4 border-accent-custom border-t-transparent rounded-full animate-spin shadow-[0_0_15px_var(--accent-border)]"></div>
                <div className="text-xs font-black text-accent-custom tracking-widest animate-pulse">KHỞI TẠO KHÔNG GIAN BÁO CÁO...</div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 bg-bg-secondary text-text-primary rounded-2xl border border-rose-500/25 transition-colors duration-200">
                <div className="text-5xl text-rose-500"><i className="fa-solid fa-triangle-exclamation"></i></div>
                <div className="text-sm font-black text-rose-500 uppercase tracking-widest">Không thể khởi dựng dữ liệu thống kê</div>
                <button
                    onClick={loadStats}
                    className="px-6 py-3 bg-gradient-to-r from-accent-custom to-accent-hover text-xs font-bold rounded-xl shadow-lg shadow-accent-custom/20 hover:opacity-90 active:scale-95 transition-all cursor-pointer text-white border-0"
                >
                    Tải lại dữ liệu
                </button>
            </div>
        );
    }

    // Process variables for charts representation
    const submissionsByStatus = stats.charts.submissionsByStatus;
    const passedCount = submissionsByStatus.find(s => s.status === 'PASSED')?.count || 0;
    const failedCount = submissionsByStatus.find(s => s.status === 'FAILED')?.count || 0;
    const pendingCount = submissionsByStatus.find(s => s.status === 'PENDING')?.count || 0;
    const totalSubmissions = passedCount + failedCount + pendingCount || stats.overview.totalSubmissions || 1;

    const passerPercent = Math.round((passedCount / totalSubmissions) * 100);

    // Filter calculations for Course/Topic specific rates
    let displayPassed = passedCount;
    let displayFailed = failedCount;
    let displayTotal = passedCount + failedCount;

    if (selectedCourseId !== 'all') {
        const found = stats.charts.courseSubmissionsStats?.find(c => c.id === selectedCourseId);
        if (found) {
            displayPassed = found.stats.passed;
            displayFailed = found.stats.failed;
            displayTotal = found.stats.passed + found.stats.failed;
        } else {
            displayPassed = 0;
            displayFailed = 0;
            displayTotal = 0;
        }
    }

    const displayPassPercent = displayTotal > 0 ? Math.round((displayPassed / displayTotal) * 100) : 0;
    const displayFailPercent = displayTotal > 0 ? Math.round((displayFailed / displayTotal) * 100) : 0;

    // Filter calculations for Concept Mastery Report (Passed: score >= 75%)
    const selectedConcept = stats.charts.conceptPassReport?.find(c => c.id === selectedConceptId) || {
        id: selectedConceptId,
        name: 'Chủ đề kiến thức',
        passed: 0,
        failed: 0,
        total: 1
    };

    const conceptPassed = selectedConcept.passed;
    const conceptFailed = selectedConcept.failed;
    const conceptTotal = selectedConcept.total || 1;

    const conceptPassedPercent = Math.round((conceptPassed / conceptTotal) * 100);
    const conceptFailedPercent = Math.round((conceptFailed / conceptTotal) * 100);

    return (
        <div className="flex flex-col gap-6 w-full max-w-[1280px] mx-auto text-left select-none animate-fadeIn bg-bg-secondary text-text-primary p-5 sm:p-7 rounded-[26px] border border-border-custom shadow-sm relative overflow-hidden transition-colors duration-200">
            {/* Background neon glows */}
            <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(139,92,246,0.06)_0%,transparent_70%)] pointer-events-none z-0"></div>
            <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(6,182,212,0.04)_0%,transparent_70%)] pointer-events-none z-0"></div>

            {/* Dashboard Header Title */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 z-10 sticky top-0 bg-bg-secondary/85 backdrop-blur-md py-2 border-b border-border-custom transition-colors duration-200">
                <div className="flex flex-col gap-0.5 text-left">
                    <h1 className="text-xl font-extrabold tracking-wider text-text-primary uppercase">MCODE Analytics Workspace</h1>
                    <p className="text-[11px] text-accent-custom font-bold uppercase tracking-widest">Hệ thống phân tích & hoạt động học thuật thông minh</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={loadStats}
                        className="px-4 py-2 bg-bg-tertiary hover:bg-bg-tertiary/80 border border-border-custom text-xs font-bold rounded-xl text-text-secondary hover:text-text-primary transition-all cursor-pointer active:scale-95"
                    >
                        <i className="fa-solid fa-arrows-rotate mr-1.5"></i> Làm mới bộ nhớ
                    </button>
                    <div className="text-[10px] font-black bg-[#06b6d4]/10 text-[#06b6d4] px-3.5 py-1.5 rounded-full border border-[#06b6d4]/20 flex items-center gap-1.5 uppercase shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#06b6d4] inline-block animate-ping"></span>
                        LIVE SYNC
                    </div>
                </div>
            </div>

            {/* Grid layout from reference image */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 z-10">
                {/* Left region: Top metrics and main Concept Mastery Bar Chart */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    {/* Top highlights badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        {/* Purple gradient card */}
                        <div className="bg-gradient-to-br from-accent-custom to-accent-hover rounded-3xl p-5 text-white shadow-xl shadow-accent-custom/10 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 relative overflow-hidden group">
                            <div className="absolute right-[-10px] top-[-10px] w-20 h-20 bg-white/5 rounded-full blur-xl group-hover:scale-125 transition-transform"></div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-purple-100">Lượt nộp bài (Lessons)</span>
                            <div className="flex items-baseline gap-1 mt-4">
                                <span className="text-3xl font-black font-mono tracking-tighter">{stats.overview.totalSubmissions.toLocaleString()}</span>
                                <span className="text-[10px] uppercase font-bold text-purple-200">lần</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-1 mt-3 overflow-hidden">
                                <div className="bg-white h-full w-[70%]" />
                            </div>
                        </div>

                        {/* Cyan gradient card */}
                        <div className="bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-3xl p-5 text-white shadow-xl shadow-cyan-500/10 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 relative overflow-hidden group">
                            <div className="absolute right-[-10px] top-[-10px] w-20 h-20 bg-white/5 rounded-full blur-xl group-hover:scale-125 transition-transform"></div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-100">Học sinh đăng ký</span>
                            <div className="flex items-baseline gap-1 mt-4">
                                <span className="text-3xl font-black font-mono tracking-tighter">{stats.overview.totalUsers.toLocaleString()}</span>
                                <span className="text-[10px] uppercase font-bold text-cyan-200">user</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-1 mt-3 overflow-hidden">
                                <div className="bg-white h-full w-[85%]" />
                            </div>
                        </div>

                        {/* Neon solid styling card */}
                        <div className="bg-bg-tertiary rounded-3xl p-5 border border-border-custom flex flex-row items-center justify-between hover:scale-[1.02] transition-transform duration-300 transition-colors duration-200">
                            <div className="flex flex-col gap-1 text-left">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-accent-custom">Hiệu suất đúng</span>
                                <span className="text-3xl font-black text-text-primary font-mono tracking-tighter">{passerPercent}%</span>
                            </div>
                            <div className="flex flex-col gap-1.5 items-end text-right">
                                <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md whitespace-nowrap">
                                    Passed: {passedCount}
                                </span>
                                <span className="text-[10px] text-rose-500 font-bold bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-md whitespace-nowrap">
                                    Failed: {failedCount}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* NEW CONCEPT MASTERY EVALUATION BAR CHART SECTION (Replaces Wave chart) */}
                    <div className="bg-bg-secondary border border-border-custom rounded-[32px] p-6 shadow-sm flex flex-col gap-6 relative overflow-hidden group transition-colors duration-200">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex flex-col gap-0.5 text-left">
                                <h3 className="text-xs font-black text-text-primary uppercase tracking-widest">Đánh giá chuẩn đạt chủ đề kiến thức</h3>
                                <span className="text-[10px] text-accent-custom font-semibold uppercase">Độ thông thạo trên 75% trên đồ thị tri thức của học viên</span>
                            </div>
                            <div>
                                <select
                                    className="bg-bg-primary text-text-secondary border border-border-custom rounded-xl px-3 py-2 text-[11px] font-bold outline-none focus:border-accent-custom cursor-pointer shadow-sm transition-colors duration-200"
                                    value={selectedConceptId}
                                    onChange={(e) => setSelectedConceptId(e.target.value)}
                                >
                                    {stats.charts.conceptPassReport?.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Bar Representation for Concept Pass / Fail ratio */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center bg-bg-primary/55 border border-border-custom rounded-2xl p-6 transition-colors duration-200">

                            {/* Visual Bars Container */}
                            <div className="flex justify-around items-end h-56 px-4 bg-bg-tertiary/40 rounded-xl relative border border-border-custom/50 pt-4">
                                <div className="absolute left-3 top-3 text-[9px] text-text-tertiary font-semibold uppercase tracking-wider">
                                    tổng số học viên đánh giá: {conceptTotal}
                                </div>

                                {/* Column 1: Vượt qua (Passed >= 75%) */}
                                <div className="flex flex-col items-center gap-3.5 group select-none w-24">
                                    <div className="relative w-12 bg-bg-secondary rounded-t-2xl h-[150px] flex items-end overflow-hidden border border-border-custom shadow-inner">
                                        <div
                                            className="w-full bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-xl transition-all duration-700 ease-out group-hover:opacity-95 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                                            style={{ height: `${conceptPassedPercent}%` }}
                                        />
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 font-mono">{conceptPassed} Học viên</span>
                                        <span className="text-[8px] font-bold text-text-primary uppercase tracking-wider mt-0.5 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-md">
                                            Vượt qua ({conceptPassedPercent}%)
                                        </span>
                                    </div>
                                </div>

                                {/* Column 2: Chưa đạt (Failed < 75%) */}
                                <div className="flex flex-col items-center gap-3.5 group select-none w-24">
                                    <div className="relative w-12 bg-bg-secondary rounded-t-2xl h-[150px] flex items-end overflow-hidden border border-border-custom shadow-inner">
                                        <div
                                            className="w-full bg-gradient-to-t from-rose-500 to-pink-500 rounded-t-xl transition-all duration-700 ease-out group-hover:opacity-95 shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                                            style={{ height: `${conceptFailedPercent}%` }}
                                        />
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <span className="text-[11px] font-black text-rose-600 dark:text-rose-450 font-mono">{conceptFailed} Học viên</span>
                                        <span className="text-[8px] font-bold text-text-primary uppercase tracking-wider mt-0.5 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded-md">
                                            Chưa đạt ({conceptFailedPercent}%)
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Descriptive Metrics Card */}
                            <div className="flex flex-col gap-4 text-left">
                                <div className="p-4 bg-bg-tertiary rounded-2xl border border-border-custom flex flex-col gap-2">
                                    <span className="text-[9px] text-accent-custom font-black uppercase tracking-widest">Tiêu chí phân cấp lý thuyết</span>
                                    <p className="text-[11px] text-text-secondary leading-relaxed">
                                        Học viên được xác định là <strong className="text-emerald-555">Vượt qua</strong> thành phần kiến thức nếu Chỉ số thông thạo dự đoán bởi mô phỏng AI (DKT/BKT/PAL-Net) đạt từ <strong className="text-text-primary">75% trở lên</strong>.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3.5 text-xs font-semibold">
                                    <div className="p-3 bg-bg-secondary rounded-xl border border-border-custom flex flex-col gap-0.5">
                                        <span className="text-[8px] text-emerald-500 uppercase font-black font-mono">Tỷ lệ pass</span>
                                        <span className="text-lg font-black text-emerald-500 font-mono tracking-tighter">{conceptPassedPercent}%</span>
                                    </div>
                                    <div className="p-3 bg-bg-secondary rounded-xl border border-border-custom flex flex-col gap-0.5">
                                        <span className="text-[8px] text-rose-500 uppercase font-black font-mono">Tỷ lệ chưa đạt</span>
                                        <span className="text-lg font-black text-rose-500 font-mono tracking-tighter">{conceptFailedPercent}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Right region: Double small wave and vertical column graph */}
                <div className="flex flex-col gap-6">
                    {/* Tiny dual-wave area performance chart */}
                    <div className="bg-bg-secondary border border-border-custom rounded-[32px] p-5 shadow-sm flex flex-col gap-4 relative overflow-hidden group transition-colors duration-200">
                        <div className="flex justify-between items-center text-left">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black tracking-wider text-text-primary uppercase">Cân bằng giải bài</span>
                                <span className="text-[9px] text-[#ff1f0a] dark:text-[#ff9f0a] font-bold uppercase">Passed vs Failed</span>
                            </div>
                            <span className="text-lg font-black text-emerald-500 font-mono tracking-tighter">+{passerPercent}%</span>
                        </div>

                        {/* Small wave SVG */}
                        <div className="w-full h-24 overflow-visible">
                            <svg className="w-full h-full overflow-visible" viewBox="0 0 200 80" preserveAspectRatio="none">
                                <path
                                    d="M 0,80 Q 25,20 50,60 T 100,30 T 150,70 T 200,20"
                                    fill="none"
                                    stroke="url(#smallWaveGrad)"
                                    strokeWidth="3.5"
                                    strokeLinecap="round"
                                />
                                <defs>
                                    <linearGradient id="smallWaveGrad" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="var(--color-accent-custom)" />
                                        <stop offset="50%" stopColor="#d946ef" />
                                        <stop offset="100%" stopColor="#06b6d4" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <div className="text-[9px] text-accent-custom font-bold uppercase tracking-wider text-center border-t border-border-custom pt-2 select-all">
                            TỔNG QUAN TỶ LỆ CHÍNH XÁC LỜI GIẢI MÃ NGUỒN
                        </div>
                    </div>

                    {/* Dynamic Vertical Bar Chart */}
                    <div className="bg-bg-secondary border border-border-custom rounded-[32px] p-6 shadow-sm flex flex-col gap-6 transition-colors duration-200">
                        <h3 className="text-xs font-black text-text-primary uppercase tracking-widest text-left">Bài nộp (Phân phối theo hoạt động)</h3>
                        <div className="flex justify-between items-end h-[155px] px-2">
                            <VerticalBar value={stats.overview.totalLessons * 1.5} label="Cơ bản" color="from-emerald-400 to-teal-500 shadow-emerald-450/15" />
                            <VerticalBar value={stats.overview.totalPracticeProblems * 0.8} label="Đấu trường" color="from-cyan-400 to-indigo-500 shadow-cyan-455/15" />
                            <VerticalBar value={stats.overview.totalCourses * 10} label="Khóa học" color="from-fuchsia-500 to-purple-600 shadow-fuchsia-545/15" />
                            <VerticalBar value={stats.overview.totalUsers * 0.6} label="Hoạt động" color="from-[#ff9f0a] to-[#ffb03a] shadow-amber-545/15" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Dynamic Course/Topic Filter Donut & Student list */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 z-10">
                {/* 1. Dynamic Course Filter & Progress rings layout */}
                <div className="bg-bg-secondary border border-border-custom rounded-[32px] p-6 shadow-sm flex flex-col gap-5 justify-between transition-colors duration-200">
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center text-left">
                            <h3 className="text-xs font-black text-text-primary uppercase tracking-widest">Đánh giá theo chủ đề</h3>
                        </div>
                        {/* Course Filter Dropdown styling */}
                        <div>
                            <select
                                className="w-full bg-bg-primary text-xs font-bold text-text-secondary border border-border-custom rounded-xl px-3.5 py-2.5 outline-none hover:border-accent-custom transition-all cursor-pointer shadow-inner transition-colors duration-200"
                                value={selectedCourseId}
                                onChange={(e) => setSelectedCourseId(e.target.value)}
                            >
                                <option value="all">Tất cả các chủ đề học</option>
                                {stats.charts.courseSubmissionsStats?.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {displayTotal === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 gap-1.5 text-center">
                            <span className="text-3xl text-text-tertiary animate-bounce"><i className="fa-solid fa-inbox"></i></span>
                            <span className="text-[10px] text-accent-custom font-bold uppercase tracking-wider">Chưa có lượt nộp bài</span>
                            <span className="text-[9px] text-[#ff9f0a]/80 font-medium">Chọn chủ đề khác để phân tích tỷ lệ</span>
                        </div>
                    ) : (
                        <div className="flex items-center justify-around py-2">
                            {/* Circle Donut Ring for selecting course */}
                            <div className="relative w-28 h-28 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                    {/* Base track */}
                                    <circle cx="50" cy="50" r="40" className="stroke-bg-primary" strokeWidth="9" fill="transparent" />
                                    {/* Passed slice */}
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        className="stroke-accent-custom"
                                        strokeWidth="9"
                                        fill="transparent"
                                        strokeDasharray="251.2"
                                        strokeDashoffset={251.2 - (251.2 * displayPassPercent) / 100}
                                        strokeLinecap="round"
                                    />
                                    {/* Failed track layer */}
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="31"
                                        className="stroke-bg-primary"
                                        strokeWidth="7"
                                        fill="transparent"
                                    />
                                    {/* Failed slice inner ring */}
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="31"
                                        className="stroke-cyan-500 dark:stroke-cyan-400"
                                        strokeWidth="7"
                                        fill="transparent"
                                        strokeDasharray="194.7"
                                        strokeDashoffset={194.7 - (194.7 * displayFailPercent) / 100}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center select-none font-bold">
                                    <span className="text-base font-black text-text-primary font-mono">{displayPassPercent}%</span>
                                    <span className="text-[7px] text-accent-custom font-bold uppercase tracking-wider">Đúng hạn</span>
                                </div>
                            </div>

                            {/* Circular indicators details */}
                            <div className="flex flex-col gap-2 text-left text-xs font-semibold">
                                <div className="flex flex-col">
                                    <span className="text-[9px] text-accent-custom font-bold uppercase tracking-wide">Hoàn thành (Đúng)</span>
                                    <span className="text-xs font-black text-text-primary font-mono">{displayPassPercent}% ({displayPassed} bài)</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[9px] text-cyan-500 dark:text-cyan-400 font-bold uppercase tracking-wide">Chưa đúng (Lỗi)</span>
                                    <span className="text-xs font-black text-text-primary font-mono">{displayFailPercent}% ({displayFailed} bài)</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 2. Registered Users list (Glassmorphism layout) */}
                <div className="lg:col-span-2 bg-bg-secondary border border-border-custom rounded-[32px] p-6 shadow-sm flex flex-col justify-between gap-5 relative overflow-hidden group transition-colors duration-200">
                    <div className="flex justify-between items-center text-left">
                        <div className="flex flex-col">
                            <h3 className="text-xs font-black text-text-primary uppercase tracking-widest">Học viên mới hoạt động</h3>
                            <span className="text-[10px] text-accent-custom font-bold uppercase">Cộng đồng lập trình MCODE Python</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-border-custom bg-bg-primary/45 backdrop-blur-sm transition-colors duration-200 font-medium">
                        <table className="min-w-full divide-y divide-border-custom text-left border-collapse">
                            <thead>
                                <tr className="bg-bg-tertiary select-none">
                                    <th className="px-5 py-3.5 text-[9px] font-black text-accent-custom uppercase tracking-wider">Học viên</th>
                                    <th className="px-5 py-3.5 text-[9px] font-black text-accent-custom uppercase tracking-wider">Email</th>
                                    <th className="px-5 py-3.5 text-[9px] font-black text-accent-custom uppercase tracking-wider">Quyền</th>
                                    <th className="px-5 py-3.5 text-[9px] font-black text-accent-custom uppercase tracking-wider">Thời gian gia nhập</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-custom/50">
                                {stats.recentUsers.slice(0, 4).map((user) => (
                                    <tr key={user.id} className="hover:bg-bg-tertiary/30 transition-colors">
                                        <td className="px-5 py-3 whitespace-nowrap">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-accent-custom to-accent-hover text-white flex items-center justify-center font-bold text-xs uppercase shadow-md shadow-accent-custom/10">
                                                    {user.username.substring(0, 1).toUpperCase()}
                                                </div>
                                                <span className="text-xs font-bold text-text-primary select-all">{user.username}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 whitespace-nowrap text-xs text-text-secondary select-all">{user.email}</td>
                                        <td className="px-5 py-3 whitespace-nowrap">
                                            <span className={`px-2 py-0.5 text-[9px] font-black rounded-md border tracking-wider ${getRoleColorBadge(user.role)}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 whitespace-nowrap text-[10px] text-text-tertiary font-mono">
                                            {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface VerticalBarProps {
    value: number;
    label: string;
    color: string;
}

function VerticalBar({ value, label, color }: VerticalBarProps) {
    const fixedHeight = Math.min(Math.max((value / 120) * 100, 15), 100);

    return (
        <div className="flex flex-col items-center gap-3.5 group select-none">
            <div className="relative w-8 bg-bg-primary rounded-t-xl h-[120px] flex items-end overflow-hidden border border-border-custom shadow-inner">
                <div
                    className={`w-full bg-gradient-to-t ${color} rounded-t-lg transition-all duration-700 ease-out group-hover:opacity-90 shadow-sm`}
                    style={{ height: `${fixedHeight}%` }}
                />
            </div>
            <div className="flex flex-col items-center">
                <span className="text-[9px] font-bold text-text-primary font-mono select-all">{value}</span>
                <span className="text-[8px] font-bold text-text-tertiary uppercase tracking-wide mt-0.5">{label}</span>
            </div>
        </div>
    );
}

function getRoleColorBadge(role: string) {
    switch (role) {
        case 'ADMIN':
            return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
        case 'TEACHER':
            return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        default:
            return 'bg-emerald-500/10 text-emerald-500 border-emerald-555/20';
    }
}
