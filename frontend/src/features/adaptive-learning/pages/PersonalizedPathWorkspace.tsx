import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
    ArrowLeft,
    Sparkles,
    Layers,
    CheckCircle2,
    Play,
    BookOpen,
    Compass,
    Trophy
} from 'lucide-react';
import { ThemeToggle } from '../../../components/ThemeToggle';
import { PersonalizedLessonViewer } from '../components/PersonalizedLessonViewer';
import { API_BASE_URL } from '../../../config/api';

export const PersonalizedPathWorkspace: React.FC = () => {
    const { pathId } = useParams<{ pathId: string }>();
    const navigate = useNavigate();
    const [token, setToken] = useState<string>('');
    const [pathDetail, setPathDetail] = useState<any>(null);
    const [activeLesson, setActiveLesson] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
            navigate('/login');
            return;
        }
        setToken(storedToken);

        if (pathId) {
            fetchPathDetail(pathId, storedToken);
        }
    }, [pathId, navigate]);

    const fetchPathDetail = async (id: string, authToken: string, isSilent: boolean = false) => {
        if (!isSilent) setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/api/learning-path/${id}`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            if (res.data.success) {
                console.log("📚 [WORKSPACE LOADED FULL PATH DATA]:", res.data.data);
                setPathDetail(res.data.data);
                if (res.data.data.lessons?.length > 0) {
                    setActiveLesson((prev: any) => {
                        if (!prev) return res.data.data.lessons[0];
                        const found = res.data.data.lessons.find((l: any) => l.id === prev.id);
                        if (!found) return res.data.data.lessons[0];
                        return {
                            ...found,
                            exercise: found.exercise || prev.exercise
                        };
                    });
                }
            }
        } catch (e) {
            console.error('Fetch path detail error:', e);
        } finally {
            if (!isSilent) setLoading(false);
        }
    };

    const lessons = pathDetail?.lessons || [];
    const completedCount = lessons.filter((l: any) => l.isCompleted).length;
    const totalCount = lessons.length;
    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return (
        <div className="min-h-screen bg-slate-100/70 dark:bg-[#06080D] text-slate-900 dark:text-gray-100 font-sans transition-colors duration-200">
            <header className="border-b border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#090D15]/90 backdrop-blur-xl sticky top-0 z-50 transition-colors duration-200">
                <div className="w-full px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between gap-4">
                    {/* Left: Breadcrumbs & Navigation */}
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                        <Link 
                            to="/personalized-path" 
                            className="group flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-all bg-slate-100/90 dark:bg-white/[0.06] hover:bg-blue-50 dark:hover:bg-blue-500/10 border border-slate-200/80 dark:border-white/10 px-3 py-1.5 rounded-full shrink-0 shadow-xs"
                        >
                            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                            <span className="hidden sm:inline">AI Tutor</span>
                        </Link>

                        <span className="text-slate-300 dark:text-gray-700 select-none">/</span>

                        <div className="flex items-center gap-2 min-w-0">
                            <span className="p-1 rounded-md bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                                <Compass className="w-4 h-4" />
                            </span>
                            <div className="min-w-0">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-600 dark:text-gray-400 block leading-tight">
                                    Lộ Trình Cá Nhân Hóa
                                </span>
                                <h1 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate tracking-tight">
                                    {pathDetail?.title || 'Không Gian Thực Hành Lộ Trình Thích Ứng'}
                                </h1>
                            </div>
                        </div>
                    </div>

                    {/* Right: Stats, Actions & Theme */}
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        {/* Skill Profile Score Pill */}
                        <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/90 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-500/20">
                            <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-cyan-400 animate-pulse" />
                            <span className="text-[11px] font-mono font-bold text-blue-700 dark:text-cyan-300">
                                {typeof pathDetail?.palNetAvgScore === 'number'
                                    ? `Đánh giá đầu vào: ${(pathDetail.palNetAvgScore * 100).toFixed(0)}%`
                                    : 'Khởi tạo theo mục tiêu'}
                            </span>
                        </div>

                        <ThemeToggle />
                    </div>
                </div>
            </header>

            <main className="w-full px-3 sm:px-5 lg:px-8 py-4 sm:py-6 lg:py-8">
                {loading ? (
                    <div className="text-center py-32 space-y-4">
                        <div className="relative w-14 h-14 mx-auto">
                            <div className="w-14 h-14 rounded-full border-3 border-blue-200 dark:border-blue-500/20 border-t-blue-600 dark:border-t-blue-400 animate-spin" />
                            <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400 absolute inset-0 m-auto animate-pulse" />
                        </div>
                        <p className="text-sm font-semibold tracking-wide text-slate-600 dark:text-gray-300">
                            Đang tải cấu trúc bài học và chuẩn bị không gian lập trình AI...
                        </p>
                    </div>
                ) : !pathDetail ? (
                    <div className="text-center py-20 p-8 bg-white dark:bg-[#0D121F] border border-slate-200 dark:border-white/10 rounded-2xl max-w-xl mx-auto shadow-sm space-y-5">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-medium text-slate-700 dark:text-gray-300">
                            Không tìm thấy dữ liệu lộ trình học tập này hoặc bạn không có quyền truy cập.
                        </p>
                        <Link
                            to="/personalized-path"
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold tracking-wide transition-all shadow-md shadow-blue-500/20"
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Tạo Lộ Trình Mới Với AI Tutor</span>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-5 lg:space-y-6">
                        <section className="rounded-[24px] border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0B0F19] p-4 sm:p-5 shadow-[0_18px_50px_-38px_rgba(15,23,42,0.55)]">
                            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20 shrink-0">
                                        <Layers className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-sm font-extrabold tracking-tight text-slate-950 dark:text-white">Lộ trình của bạn</h2>
                                            <span className="rounded-full bg-slate-100 dark:bg-white/[0.07] px-2.5 py-1 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                                                {lessons.length} bài học
                                            </span>
                                        </div>
                                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Chọn một bài để chuyển nhanh giữa các nội dung.</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/70 dark:border-white/10 px-4 py-2.5 min-w-[240px]">
                                    <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="mb-1.5 flex items-center justify-between text-[11px] font-bold">
                                            <span className="text-slate-700 dark:text-slate-300">{completedCount}/{totalCount} hoàn thành</span>
                                            <span className="text-blue-600 dark:text-blue-400">{progressPercent}%</span>
                                        </div>
                                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                                            <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-[width] duration-500" style={{ width: `${progressPercent}%` }} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory">
                                {lessons.map((les: any, idx: number) => {
                                    const isActive = activeLesson?.id === les.id;
                                    return (
                                        <button
                                            key={les.id}
                                            type="button"
                                            onClick={() => setActiveLesson(les)}
                                            aria-current={isActive ? 'step' : undefined}
                                            className={`group min-w-[260px] flex-1 snap-start rounded-2xl border p-3.5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                                                isActive
                                                    ? 'border-blue-500 bg-blue-50/80 dark:border-blue-400/60 dark:bg-blue-500/10 shadow-sm'
                                                    : 'border-slate-200 bg-slate-50/70 hover:border-blue-300 hover:bg-white dark:border-white/10 dark:bg-white/[0.025] dark:hover:border-blue-500/40 dark:hover:bg-white/[0.05]'
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold ${
                                                    les.isCompleted
                                                        ? 'bg-emerald-500 text-white'
                                                        : isActive
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 dark:bg-white/10 dark:text-slate-300 dark:ring-white/10'
                                                }`}>
                                                    {les.isCompleted ? <CheckCircle2 className="w-4 h-4" /> : isActive ? <Play className="w-3.5 h-3.5 fill-current" /> : idx + 1}
                                                </span>
                                                <span className="min-w-0 flex-1">
                                                    <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-blue-600 dark:text-blue-400">{les.targetSkillId || `Bài ${idx + 1}`}</span>
                                                    <span className="mt-1 block text-sm font-bold leading-snug text-slate-900 dark:text-white line-clamp-2">{les.title}</span>
                                                </span>
                                                {les.isCompleted && <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Xong</span>}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        <div className="w-full">
                            {activeLesson ? (
                                <PersonalizedLessonViewer
                                    lesson={activeLesson}
                                    token={token}
                                    onLessonCompleted={() => fetchPathDetail(pathId!, token, true)}
                                />
                            ) : (
                                <div className="p-16 rounded-2xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-white/10 text-center text-slate-500 dark:text-gray-400 shadow-sm space-y-3">
                                    <BookOpen className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
                                    <p className="text-sm font-semibold text-slate-700 dark:text-gray-300">
                                        Vui lòng chọn một bài học trong lộ trình để bắt đầu học tập.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default PersonalizedPathWorkspace;
