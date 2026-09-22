import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
    Activity,
    ArrowRight,
    BookOpen,
    BrainCircuit,
    CheckCircle2,
    ChevronRight,
    Code2,
    Flame,
    GraduationCap,
    LayoutDashboard,
    Menu,
    Network,
    Route,
    ShieldCheck,
    Sparkles,
    Target,
    Trophy,
    X,
    Zap,
} from 'lucide-react';
import { authService } from '../../../services/authService';
import { CourseCard } from '../../course/components/CourseCard';
import { ThemeToggle } from '../../../components/ThemeToggle';
import UserMenuDropdown from '../../../components/UserMenuDropdown';
import { API_BASE_URL } from '../../../config/api';

const decodeToken = (token: string) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((character) => `%${(`00${character.charCodeAt(0).toString(16)}`).slice(-2)}`)
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
};

interface DBLocationCourse {
    id: string;
    title: string;
    description: string;
    level: string;
    thumbnail?: string;
}

interface LearningEvidenceStats {
    streak_days: number;
    lessons_completed: number;
    practice_completed: number;
    total_actions: number;
    observed_skills: number;
    total_skills: number;
}

interface RecommendationItem {
    id: string;
    type: 'LESSON_EXERCISE' | 'PRACTICE_PROBLEM' | string;
    lesson_id?: string;
    slug?: string;
    title: string;
    difficulty?: 'EASY' | 'MEDIUM' | 'HARD' | string;
    kc_id?: string;
    predicted_mastery?: number;
    zpd_score?: number;
}

const kcNames: Record<string, string> = {
    KC_VAR: 'Biến & Kiểu dữ liệu',
    KC_COND: 'Câu lệnh rẽ nhánh',
    KC_LOOP: 'Vòng lặp for / while',
    KC_LIST: 'Cấu trúc danh sách',
    KC_DICT: 'Từ điển và tập hợp',
    KC_FUNC: 'Hàm và module',
    KC_OOP: 'Lập trình hướng đối tượng',
};

const navItems = [
    { to: '/dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { to: '/personalized-path', label: 'Lộ trình', icon: Route },
    { to: '/adaptive-practice', label: 'Luyện tập AI', icon: BrainCircuit },
    { to: '/practice-arena', label: 'Đấu trường', icon: Trophy },
    { to: '/profile', label: 'Tri thức', icon: Network },
];

const difficultyStyles: Record<string, { label: string; className: string }> = {
    EASY: {
        label: 'Cơ bản',
        className: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300',
    },
    MEDIUM: {
        label: 'Trung bình',
        className: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300',
    },
    HARD: {
        label: 'Nâng cao',
        className: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300',
    },
};

const formatPercent = (value?: number) => (
    typeof value === 'number' && Number.isFinite(value)
        ? `${Math.round(value * 1000) / 10}%`
        : 'Chưa đủ dữ liệu'
);

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
    const [recsLoading, setRecsLoading] = useState(true);
    const [serviceEngine, setServiceEngine] = useState('');
    const [learningStats, setLearningStats] = useState<LearningEvidenceStats | null>(null);
    const selectedAlgo = 'PAL-Net';
    const token = useMemo(() => localStorage.getItem('token'), []);
    const authenticatedUser = useMemo(() => token ? decodeToken(token) : null, [token]);
    const username = authenticatedUser?.username || 'Học viên';
    const role = authenticatedUser?.role || 'STUDENT';

    const { data: courses = [], isLoading } = useQuery<DBLocationCourse[]>({
        queryKey: ['courses'],
        queryFn: authService.getCourses,
    });

    const fetchRecommendations = useCallback(async (algoName: string) => {
        setRecsLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/auth/recommendations?algo=${algoName}&limit=3`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.data?.success) {
                setRecommendations(response.data.data || []);
                setServiceEngine(response.data.engine || algoName);
            }
        } catch (error) {
            console.error('Error fetching recommendations: ', error);
        } finally {
            setRecsLoading(false);
        }
    }, [token]);

    const fetchLearningStats = useCallback(async (authToken: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/auth/user-mastery`, {
                params: { language: 'PYTHON' },
                headers: { Authorization: `Bearer ${authToken}` },
            });
            setLearningStats(response.data?.stats || null);
        } catch (error) {
            console.error('Error fetching verified learning statistics:', error);
            setLearningStats(null);
        }
    }, []);

    const completedLessons = learningStats
        ? learningStats.lessons_completed + learningStats.practice_completed
        : null;

    const skillProgress = useMemo(() => {
        if (!learningStats || learningStats.total_skills <= 0) return null;
        return Math.min(100, Math.round((learningStats.observed_skills / learningStats.total_skills) * 100));
    }, [learningStats]);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect -- data is loaded once when the authenticated dashboard mounts
        fetchRecommendations(selectedAlgo);
        fetchLearningStats(token);
    }, [fetchLearningStats, fetchRecommendations, navigate, token, selectedAlgo]);

    const handleRecClick = (item: RecommendationItem) => {
        if (item.type === 'LESSON_EXERCISE' && item.lesson_id) {
            navigate(`/practice/${item.lesson_id}`);
        } else if (item.type === 'PRACTICE_PROBLEM' && item.slug) {
            navigate(`/practice-arena/${item.slug}`);
        }
    };

    const statCards = [
        {
            label: 'Chuỗi học tập',
            value: learningStats ? `${learningStats.streak_days} ngày` : '—',
            helper: 'Giữ nhịp học mỗi ngày',
            icon: Flame,
            iconClass: 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300',
        },
        {
            label: 'Bài đã hoàn thành',
            value: completedLessons !== null ? `${completedLessons} bài` : '—',
            helper: 'Lý thuyết và thực hành',
            icon: CheckCircle2,
            iconClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300',
        },
        {
            label: 'Kỹ năng có dữ liệu',
            value: learningStats ? `${learningStats.observed_skills}/${learningStats.total_skills}` : '—',
            helper: 'Được xác minh từ hoạt động thật',
            icon: Target,
            iconClass: 'bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300',
        },
    ];

    return (
        <div className="dashboard-shell min-h-screen bg-bg-primary text-text-primary transition-colors duration-200">
            <header className="sticky top-0 z-50 border-b border-border-custom bg-bg-secondary/85 backdrop-blur-xl">
                <div className="mx-auto flex h-[72px] w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard')}
                        className="group flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-custom focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary"
                        aria-label="Về trang tổng quan MCODE"
                    >
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/20 transition-transform duration-200 group-hover:-rotate-3">
                            <Code2 className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <span className="text-left">
                            <span className="block text-[17px] font-extrabold leading-none tracking-[-0.03em]">MCODE</span>
                            <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.2em] text-text-tertiary">Learning Lab</span>
                        </span>
                    </button>

                    <nav className="hidden items-center gap-1 rounded-2xl border border-border-custom bg-bg-primary/60 p-1.5 xl:flex" aria-label="Điều hướng chính">
                        {navItems.map(({ to, label, icon: Icon }) => (
                            <Link
                                key={to}
                                to={to}
                                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-custom ${
                                    to === '/dashboard'
                                        ? 'bg-bg-secondary text-accent-custom shadow-sm ring-1 ring-border-custom'
                                        : 'text-text-tertiary hover:bg-bg-secondary hover:text-text-primary'
                                }`}
                            >
                                <Icon className="h-4 w-4" aria-hidden="true" />
                                {label}
                            </Link>
                        ))}
                        {role === 'ADMIN' && (
                            <Link
                                to="/admin"
                                className="rounded-xl px-3.5 py-2 text-xs font-bold text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/10"
                            >
                                Quản trị
                            </Link>
                        )}
                    </nav>

                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <UserMenuDropdown />
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen((open) => !open)}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-custom bg-bg-secondary text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-custom xl:hidden"
                            aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
                            aria-expanded={mobileMenuOpen}
                        >
                            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {mobileMenuOpen && (
                    <nav className="border-t border-border-custom bg-bg-secondary px-4 py-3 xl:hidden" aria-label="Điều hướng trên thiết bị di động">
                        <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-2 sm:grid-cols-3">
                            {navItems.map(({ to, label, icon: Icon }) => (
                                <Link
                                    key={to}
                                    to={to}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex min-h-11 items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold ${
                                        to === '/dashboard'
                                            ? 'bg-accent-bg text-accent-custom'
                                            : 'bg-bg-primary text-text-secondary hover:text-text-primary'
                                    }`}
                                >
                                    <Icon className="h-4 w-4" aria-hidden="true" />
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </nav>
                )}
            </header>

            <main className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col gap-7 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
                <section className="grid gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.7fr)]">
                    <div className="dashboard-hero relative isolate overflow-hidden rounded-[28px] border border-indigo-300/20 bg-[#17113f] px-6 py-7 text-white shadow-[0_24px_70px_-34px_rgba(79,70,229,0.75)] sm:px-8 sm:py-9 lg:px-10">
                        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-violet-500/30 blur-3xl" aria-hidden="true" />
                        <div className="absolute -bottom-28 right-20 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" aria-hidden="true" />
                        <div className="absolute right-8 top-8 hidden h-32 w-32 rounded-full border border-white/10 lg:block" aria-hidden="true">
                            <div className="absolute inset-4 rounded-full border border-dashed border-white/20" />
                            <Sparkles className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-violet-200" />
                        </div>

                        <div className="relative max-w-2xl">
                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-violet-100 backdrop-blur-md">
                                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                                Không gian học tập cá nhân
                            </div>
                            <h1 className="max-w-xl text-3xl font-extrabold leading-tight tracking-[-0.04em] sm:text-4xl lg:text-[42px]">
                                Chào {username}, hôm nay mình học gì tiếp?
                            </h1>
                            <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100/80 sm:text-[15px]">
                                Tiếp tục lộ trình Python dựa trên dữ liệu học tập đã được xác minh và những kỹ năng bạn cần ưu tiên nhất.
                            </p>
                            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={() => navigate('/personalized-path')}
                                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#2f246b] shadow-lg shadow-black/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#17113f] motion-reduce:transform-none"
                                >
                                    Xem lộ trình của tôi
                                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate('/adaptive-practice')}
                                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-md transition-all duration-200 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                >
                                    <Zap className="h-4 w-4" aria-hidden="true" />
                                    Luyện tập thích ứng
                                </button>
                            </div>
                        </div>
                    </div>

                    <aside className="flex flex-col justify-between rounded-[28px] border border-border-custom bg-bg-secondary p-6 shadow-[0_20px_60px_-42px_rgba(15,23,42,0.5)] sm:p-7">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-text-tertiary">Độ phủ kỹ năng</p>
                                <h2 className="mt-2 text-xl font-extrabold tracking-tight text-text-primary">Tiến trình Python</h2>
                            </div>
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-bg text-accent-custom">
                                <Activity className="h-5 w-5" aria-hidden="true" />
                            </span>
                        </div>

                        <div className="my-6 flex items-center gap-5">
                            <div
                                className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full p-[9px]"
                                style={{
                                    background: skillProgress === null
                                        ? 'conic-gradient(var(--border-color) 0 100%)'
                                        : `conic-gradient(var(--accent-color) 0 ${skillProgress}%, var(--border-color) ${skillProgress}% 100%)`,
                                }}
                                role="img"
                                aria-label={skillProgress === null ? 'Chưa có dữ liệu tiến trình' : `Đã có dữ liệu cho ${skillProgress}% kỹ năng`}
                            >
                                <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-bg-secondary">
                                    <span className="text-2xl font-extrabold tracking-tight text-text-primary">{skillProgress === null ? '—' : `${skillProgress}%`}</span>
                                    <span className="text-[10px] font-semibold text-text-tertiary">đã quan sát</span>
                                </div>
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-text-primary">
                                    {learningStats ? `${learningStats.observed_skills} kỹ năng có bằng chứng` : 'Đang tổng hợp dữ liệu'}
                                </p>
                                <p className="mt-1.5 text-xs leading-5 text-text-tertiary">
                                    Chỉ số được tính từ bài học và bài thực hành bạn đã thực sự hoàn thành.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => navigate('/profile')}
                            className="flex min-h-11 w-full items-center justify-between rounded-xl border border-border-custom bg-bg-primary px-4 py-3 text-left text-xs font-bold text-text-secondary transition-colors hover:border-accent-border hover:text-accent-custom focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-custom"
                        >
                            Xem bản đồ tri thức
                            <ChevronRight className="h-4 w-4" aria-hidden="true" />
                        </button>
                    </aside>
                </section>

                <section className="grid gap-4 sm:grid-cols-3" aria-label="Chỉ số học tập">
                    {statCards.map(({ label, value, helper, icon: Icon, iconClass }) => (
                        <article
                            key={label}
                            className="group flex items-center gap-4 rounded-2xl border border-border-custom bg-bg-secondary p-5 shadow-[0_16px_40px_-34px_rgba(15,23,42,0.65)] transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-border hover:shadow-[0_20px_48px_-34px_rgba(79,70,229,0.45)] motion-reduce:transform-none"
                        >
                            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconClass}`}>
                                <Icon className="h-5 w-5" aria-hidden="true" />
                            </span>
                            <div className="min-w-0">
                                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-tertiary">{label}</p>
                                <p className="mt-1 text-xl font-extrabold tracking-tight text-text-primary">{value}</p>
                                <p className="mt-0.5 truncate text-[11px] text-text-tertiary">{helper}</p>
                            </div>
                        </article>
                    ))}
                </section>

                <section className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(290px,0.65fr)]">
                    <div className="rounded-[28px] border border-border-custom bg-bg-secondary p-5 shadow-[0_20px_60px_-44px_rgba(15,23,42,0.6)] sm:p-7">
                        <div className="mb-6 flex flex-col gap-4 border-b border-border-custom pb-5 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <div className="mb-2 flex items-center gap-2 text-accent-custom">
                                    <BrainCircuit className="h-4 w-4" aria-hidden="true" />
                                    <span className="text-[10px] font-extrabold uppercase tracking-[0.16em]">AI Learning Coach</span>
                                </div>
                                <h2 className="text-xl font-extrabold tracking-[-0.025em] text-text-primary sm:text-2xl">Ưu tiên học tập dành cho bạn</h2>
                                <p className="mt-1.5 text-xs leading-5 text-text-tertiary">Các đề xuất được xếp hạng theo vùng phát triển gần nhất của bạn.</p>
                            </div>
                            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-accent-border bg-accent-bg px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-accent-custom">
                                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                                {serviceEngine || 'Đang kết nối'}
                            </span>
                        </div>

                        {recsLoading ? (
                            <div className="grid gap-3" aria-label="Đang tải gợi ý học tập">
                                {[0, 1, 2].map((item) => (
                                    <div key={item} className="animate-pulse rounded-2xl border border-border-custom bg-bg-primary p-5">
                                        <div className="h-3 w-24 rounded-full bg-bg-tertiary" />
                                        <div className="mt-4 h-4 w-2/3 rounded-full bg-bg-tertiary" />
                                        <div className="mt-3 h-3 w-1/2 rounded-full bg-bg-tertiary" />
                                    </div>
                                ))}
                            </div>
                        ) : recommendations.length > 0 ? (
                            <div className="grid gap-3">
                                {recommendations.map((item, index) => {
                                    const difficulty = difficultyStyles[item.difficulty || ''] || {
                                        label: item.difficulty || 'Chưa phân loại',
                                        className: 'border-border-custom bg-bg-tertiary text-text-secondary',
                                    };
                                    const typeLabel = item.type === 'LESSON_EXERCISE' ? 'Bài học chính' : 'Thử thách thực hành';

                                    return (
                                        <article
                                            key={item.id}
                                            className="group grid gap-4 rounded-2xl border border-border-custom bg-bg-primary/55 p-4 transition-all duration-200 hover:border-accent-border hover:bg-accent-bg/30 sm:grid-cols-[44px_minmax(0,1fr)_auto] sm:items-center sm:p-5"
                                        >
                                            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-border-custom bg-bg-secondary text-sm font-extrabold text-accent-custom shadow-sm">
                                                {String(index + 1).padStart(2, '0')}
                                            </span>

                                            <div className="min-w-0">
                                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                                    <span className="rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300">
                                                        {typeLabel}
                                                    </span>
                                                    <span className={`rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] ${difficulty.className}`}>
                                                        {difficulty.label}
                                                    </span>
                                                </div>
                                                <h3 className="text-sm font-extrabold leading-5 text-text-primary transition-colors group-hover:text-accent-custom sm:text-[15px]">{item.title}</h3>
                                                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-text-tertiary">
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <Target className="h-3.5 w-3.5" aria-hidden="true" />
                                                        {item.kc_id ? (kcNames[item.kc_id] || item.kc_id) : 'Kỹ năng tổng hợp'}
                                                    </span>
                                                    <span>Độ thạo dự kiến: <strong className="font-bold text-text-secondary">{formatPercent(item.predicted_mastery)}</strong></span>
                                                    {typeof item.zpd_score === 'number' && (
                                                        <span>ZPD: <strong className="font-bold text-accent-custom">{Math.round(item.zpd_score * 100) / 100}</strong></span>
                                                    )}
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => handleRecClick(item)}
                                                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-text-primary px-4 py-2.5 text-xs font-bold text-bg-secondary transition-all duration-200 hover:bg-accent-custom hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-custom focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary"
                                            >
                                                Học ngay
                                                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                                            </button>
                                        </article>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center rounded-2xl border border-dashed border-border-custom bg-bg-primary px-6 py-10 text-center">
                                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                                    <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
                                </span>
                                <h3 className="mt-4 text-sm font-extrabold text-text-primary">Bạn đã hoàn thành các bài đang có</h3>
                                <p className="mt-1 max-w-sm text-xs leading-5 text-text-tertiary">Khám phá đấu trường luyện tập để tiếp tục thử thách kỹ năng của mình.</p>
                                <button
                                    type="button"
                                    onClick={() => navigate('/practice-arena')}
                                    className="mt-4 text-xs font-bold text-accent-custom hover:underline"
                                >
                                    Mở đấu trường
                                </button>
                            </div>
                        )}
                    </div>

                    <aside className="rounded-[28px] border border-border-custom bg-bg-secondary p-5 shadow-[0_20px_60px_-44px_rgba(15,23,42,0.6)] sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-tertiary">Truy cập nhanh</p>
                                <h2 className="mt-1 text-lg font-extrabold text-text-primary">Tiếp tục hành trình</h2>
                            </div>
                            <GraduationCap className="h-6 w-6 text-accent-custom" aria-hidden="true" />
                        </div>

                        <div className="mt-5 grid gap-2.5">
                            {[
                                { to: '/personalized-path', label: 'Lộ trình cá nhân', note: 'Học theo mục tiêu', icon: Route },
                                { to: '/adaptive-practice', label: 'Luyện tập thích ứng', note: 'Bài tập vừa sức', icon: BrainCircuit },
                                { to: '/practice-arena', label: 'Đấu trường code', note: 'Rèn kỹ năng thực chiến', icon: Code2 },
                            ].map(({ to, label, note, icon: Icon }) => (
                                <Link
                                    key={to}
                                    to={to}
                                    className="group flex min-h-16 items-center gap-3 rounded-2xl border border-border-custom bg-bg-primary px-3.5 py-3 transition-all duration-200 hover:border-accent-border hover:bg-accent-bg/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-custom"
                                >
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-bg-secondary text-text-secondary shadow-sm transition-colors group-hover:text-accent-custom">
                                        <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block text-xs font-extrabold text-text-primary">{label}</span>
                                        <span className="mt-0.5 block text-[10px] text-text-tertiary">{note}</span>
                                    </span>
                                    <ChevronRight className="h-4 w-4 text-text-tertiary transition-transform group-hover:translate-x-0.5 group-hover:text-accent-custom motion-reduce:transform-none" aria-hidden="true" />
                                </Link>
                            ))}
                        </div>

                        <div className="mt-5 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 p-5 text-white">
                            <div className="flex items-center gap-2 text-violet-100">
                                <Activity className="h-4 w-4" aria-hidden="true" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.13em]">Dữ liệu xác minh</span>
                            </div>
                            <p className="mt-3 text-2xl font-extrabold">{learningStats ? learningStats.total_actions : '—'}</p>
                            <p className="mt-1 text-xs leading-5 text-violet-100/80">hoạt động học tập đang góp phần cá nhân hóa trải nghiệm của bạn.</p>
                        </div>
                    </aside>
                </section>

                <section id="courses" className="pb-8">
                    <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="mb-2 flex items-center gap-2 text-accent-custom">
                                <BookOpen className="h-4 w-4" aria-hidden="true" />
                                <span className="text-[10px] font-extrabold uppercase tracking-[0.16em]">Thư viện khóa học</span>
                            </div>
                            <h2 className="text-xl font-extrabold tracking-[-0.025em] text-text-primary sm:text-2xl">Khóa học dành cho bạn</h2>
                            <p className="mt-1 text-xs text-text-tertiary">Chọn một khóa học và tiếp tục xây nền tảng lập trình vững chắc.</p>
                        </div>
                        <span className="text-xs font-semibold text-text-tertiary">{isLoading ? 'Đang tải' : `${courses.length} khóa học`}</span>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        {isLoading ? (
                            [0, 1, 2, 3].map((item) => (
                                <div key={item} className="animate-pulse overflow-hidden rounded-2xl border border-border-custom bg-bg-secondary">
                                    <div className="h-44 bg-bg-tertiary" />
                                    <div className="space-y-3 p-5">
                                        <div className="h-3 w-20 rounded-full bg-bg-tertiary" />
                                        <div className="h-5 w-4/5 rounded-full bg-bg-tertiary" />
                                        <div className="h-3 w-full rounded-full bg-bg-tertiary" />
                                    </div>
                                </div>
                            ))
                        ) : courses.length > 0 ? (
                            courses.map((course) => (
                                <CourseCard
                                    key={course.id}
                                    course={course}
                                    onClick={() => navigate(`/course/${course.id}`)}
                                />
                            ))
                        ) : (
                            <div className="col-span-full rounded-2xl border border-dashed border-border-custom bg-bg-secondary py-12 text-center text-sm text-text-tertiary">
                                Chưa có khóa học nào được xuất bản.
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;
