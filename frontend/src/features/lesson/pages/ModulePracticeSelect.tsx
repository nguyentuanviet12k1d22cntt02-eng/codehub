import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authService } from '../../../services/authService';
import AppNavbar from '../../../components/AppNavbar';
import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';
import { getModulePracticeRecommendation, type ModulePracticeRecommendation } from '../services/modulePracticeRecommendation';

interface DBLesson {
    id: string;
    lessonId: string;
    title: string;
    codingExercises?: any[];
}

const ModulePracticeSelect: React.FC = () => {
    const { moduleId, lessonId } = useParams<{ moduleId: string, lessonId: string }>();
    const navigate = useNavigate();

    const [lesson, setLesson] = useState<DBLesson | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [recommendation, setRecommendation] = useState<ModulePracticeRecommendation | null>(null);
    const [completionStatus, setCompletionStatus] = useState<{
        easy: { total: number; completed: number };
        medium: { total: number; completed: number };
        hard: { total: number; completed: number };
    }>({
        easy: { total: 0, completed: 0 },
        medium: { total: 0, completed: 0 },
        hard: { total: 0, completed: 0 }
    });

    useEffect(() => {
        const fetchDetails = async () => {
            if (!lessonId) return;
            setLoading(true);
            setError('');
            setRecommendation(null);
            setCompletionStatus({
                easy: { total: 0, completed: 0 },
                medium: { total: 0, completed: 0 },
                hard: { total: 0, completed: 0 },
            });
            try {
                const data = await authService.getLessonDetail(lessonId);
                setLesson(data);
                const suggestion = await getModulePracticeRecommendation(lessonId)
                    .catch((): ModulePracticeRecommendation => ({ mode: 'MANUAL', reason: 'LOCAL_MODEL_UNAVAILABLE' }));
                const validSuggestion: ModulePracticeRecommendation = suggestion.mode === 'PALNET_SYNTHETIC_LOCAL_PILOT' &&
                    !data.codingExercises?.some((ex: any) => ex.id === suggestion.exerciseId)
                    ? { mode: 'MANUAL', reason: 'EXERCISE_NOT_IN_LESSON' } : suggestion;
                setRecommendation(validSuggestion);

                if (validSuggestion.mode === 'MANUAL' && validSuggestion.reason !== 'NO_VERIFIED_EXERCISES' &&
                    data.codingExercises && data.codingExercises.length > 0) {
                    const easyExs = data.codingExercises.filter((ex: any) => ex.difficulty === 'EASY');
                    const mediumExs = data.codingExercises.filter((ex: any) => ex.difficulty === 'MEDIUM');
                    const hardExs = data.codingExercises.filter((ex: any) => ex.difficulty === 'HARD');

                    const token = localStorage.getItem('token');
                    let easyDone = 0;
                    let mediumDone = 0;
                    let hardDone = 0;

                    if (token) {
                        await Promise.all(
                            data.codingExercises.map(async (ex: any) => {
                                try {
                                    const resSub = await axios.get(`${API_BASE_URL}/api/auth/exercises/${ex.id}/submissions`, {
                                        headers: { Authorization: `Bearer ${token}` }
                                    });
                                    const hasPassed = resSub.data.some((sub: any) => sub.status === 'PASSED');
                                    if (hasPassed) {
                                        if (ex.difficulty === 'EASY') easyDone++;
                                        else if (ex.difficulty === 'MEDIUM') mediumDone++;
                                        else if (ex.difficulty === 'HARD') hardDone++;
                                    }
                                } catch (e) {
                                    console.error('Lỗi khi tải lịch sử nộp bài bài tập:', ex.id, e);
                                }
                            })
                        );
                    }

                    setCompletionStatus({
                        easy: { total: easyExs.length, completed: easyDone },
                        medium: { total: mediumExs.length, completed: mediumDone },
                        hard: { total: hardExs.length, completed: hardDone }
                    });
                }
            } catch (err: any) {
                console.error(err);
                setError('Không thể tải thông tin bài tập ôn tập của Module.');
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [lessonId]);

    if (loading) {
        return (
            <div className="bg-bg-primary text-text-primary min-h-screen flex items-center justify-center font-sans">
                <div className="flex flex-col items-center gap-4" role="status" aria-live="polite">
                    <div className="w-10 h-10 border-4 border-accent-custom border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
                    <span className="text-xs text-text-tertiary">Đang tải thông tin các bài tập...</span>
                </div>
            </div>
        );
    }

    if (error || !lesson) {
        return (
            <div className="bg-bg-primary text-text-primary min-h-screen flex items-center justify-center font-sans">
                <div className="text-center flex flex-col gap-4">
                    <span className="text-sm text-rose-400">{error || 'Không tìm thấy thông tin bài tập ôn tập.'}</span>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="bg-bg-tertiary hover:bg-bg-tertiary/80 text-text-primary px-4 py-2 rounded-lg text-xs font-semibold border border-border-custom"
                    >
                        Quay lại Dashboard
                    </button>
                </div>
            </div>
        );
    }
    return (
        <div className="bg-bg-primary text-text-primary min-h-screen font-sans transition-colors duration-200">
            {/* Header navbar đồng bộ */}
            <AppNavbar />

            {/* Breadcrumb điều hướng */}
            <div className="flex items-center flex-wrap gap-2 px-6 py-4 md:px-10 text-xs text-text-tertiary border-b border-border-custom bg-bg-secondary/40">
                <Link to="/dashboard" className="hover:text-text-primary transition-colors no-underline">Dashboard</Link>
                <span className="text-text-tertiary/50">&rarr;</span>
                <span className="text-text-primary font-medium">{lesson.title}</span>
            </div>

            {/* Body content */}
            <main className="max-w-[1240px] mx-auto px-6 py-12 md:px-10 box-border flex flex-col gap-10">
                <section className="text-left flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-extrabold text-accent-custom uppercase tracking-wider bg-accent-bg px-2 py-0.5 rounded border border-accent-border">
                            Luyện tập tổng hợp
                        </span>
                        <span className="text-xs text-text-tertiary">{moduleId ? moduleId.replace('MOD-', 'Module ') : 'Module'}</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-text-primary m-0">
                        {lesson.title}
                    </h1>
                    <p className="text-text-secondary text-sm md:text-base max-w-[800px] leading-relaxed m-0">
                        {recommendation?.mode === 'PALNET_SYNTHETIC_LOCAL_PILOT'
                            ? 'PAL-Net chọn một bài luyện tập từ lịch sử làm bài của bạn. Mức độ khó vẫn mô tả độ khó của từng bài.'
                            : 'Chọn bài luyện tập của module. Gợi ý PAL-Net hiện chỉ khả dụng cho các bài Python đã được kiểm chứng trong thử nghiệm local.'}
                    </p>
                </section>

                {recommendation?.mode === 'PALNET_SYNTHETIC_LOCAL_PILOT' && (
                    <section className="rounded-2xl border border-accent-border bg-accent-bg/40 p-6 md:p-8 text-left flex flex-col md:flex-row md:items-center gap-6" aria-label="Bài tập được gợi ý">
                        <div className="flex-1">
                            <span className="text-[11px] font-extrabold uppercase tracking-wider text-accent-custom">Bài phù hợp tiếp theo · Thử nghiệm local</span>
                            <h2 className="text-xl md:text-2xl font-black text-text-primary mt-2 mb-2">{recommendation.title}</h2>
                            <p className="text-sm text-text-secondary m-0">
                                Mức {recommendation.difficulty === 'EASY' ? 'Dễ' : recommendation.difficulty === 'MEDIUM' ? 'Khá' : 'Khó'} · PAL-Net dùng các lần làm bài trước để đề xuất mức luyện tập.
                            </p>
                            <p className="text-xs text-text-tertiary mt-3 mb-0">Kết quả này dùng checkpoint mô phỏng để thử giao diện local.</p>
                        </div>
                        <button
                            onClick={() => navigate(`/practice/${lessonId}?adaptive=1&exerciseId=${encodeURIComponent(recommendation.exerciseId)}`)}
                            className="bg-accent-custom hover:bg-accent-hover text-white dark:text-[#030303] px-6 py-3 rounded-xl font-bold text-sm border-none cursor-pointer shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-custom"
                        >
                            Làm bài được gợi ý →
                        </button>
                    </section>
                )}

                {recommendation?.mode === 'COMPLETE' && (
                    <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-sm text-emerald-400 m-0" role="status">
                        Bạn đã hoàn thành các bài tập được kiểm chứng của module này.
                    </p>
                )}

                {recommendation?.mode === 'MANUAL' && recommendation.reason === 'NO_VERIFIED_EXERCISES' && (
                    <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 text-sm text-amber-400 m-0" role="status">
                        Bộ bài tổng hợp này cần được cập nhật testcase trước khi PAL-Net có thể đề xuất bài trên local.
                    </p>
                )}

                {recommendation?.mode === 'MANUAL' && recommendation.reason === 'LOCAL_MODEL_UNAVAILABLE' && (
                    <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 text-sm text-amber-400 m-0" role="status">
                        PAL-Net local chưa sẵn sàng. Bạn vẫn có thể chọn bài theo mức độ khó bên dưới.
                    </p>
                )}

                {/* Difficulty Tiers section */}
                {recommendation?.mode === 'MANUAL' && recommendation.reason !== 'NO_VERIFIED_EXERCISES' &&
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* DỄ */}
                    <div className="bg-bg-secondary border border-border-custom rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 hover:border-emerald-500/30 group shadow-sm text-left">
                        <div className="flex flex-col gap-5">
                            <div className="flex justify-between items-center">
                                <span className="text-2xl">🛡️</span>
                                <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded border text-emerald-400 bg-emerald-400/10 border-emerald-500/20">
                                    DỄ (EASY)
                                </span>
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-text-primary m-0 group-hover:text-emerald-400 transition-colors">
                                    Thực hành cơ bản
                                </h3>
                                <p className="text-xs text-text-secondary mt-2.5 leading-relaxed">
                                    Kiểm tra các kỹ năng lập trình cơ bản, cú pháp cốt lõi và các bài toán thực hành nền tảng của module này.
                                </p>
                            </div>
                            {/* Progress bar */}
                            <div className="flex flex-col gap-2 bg-bg-primary border border-border-custom p-4 rounded-xl font-mono text-xs">
                                <div className="flex justify-between">
                                    <span className="text-text-tertiary">Đã hoàn thành:</span>
                                    <span className="font-bold text-emerald-400">{completionStatus.easy.completed}/{completionStatus.easy.total} bài</span>
                                </div>
                                <div className="w-full bg-border-custom h-1.5 rounded-full overflow-hidden">
                                    <div
                                        className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                                        style={{ width: `${completionStatus.easy.total > 0 ? (completionStatus.easy.completed / completionStatus.easy.total) * 100 : 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate(`/practice/${lessonId}?difficulty=EASY`)}
                            className="w-full bg-emerald-600 text-white font-extrabold text-xs py-3 rounded-xl hover:bg-emerald-500 transition-all cursor-pointer border-none mt-6 active:scale-95 duration-200"
                        >
                            Bắt đầu giải bài →
                        </button>
                    </div>

                    {/* KHÁ */}
                    <div className="bg-bg-secondary border border-border-custom rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 hover:border-amber-500/30 group shadow-sm text-left">
                        <div className="flex flex-col gap-5">
                            <div className="flex justify-between items-center">
                                <span className="text-2xl">⚔️</span>
                                <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded border text-amber-400 bg-amber-400/10 border-amber-500/20">
                                    KHÁ (MEDIUM)
                                </span>
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-text-primary m-0 group-hover:text-amber-400 transition-colors">
                                    Ứng dụng tư duy
                                </h3>
                                <p className="text-xs text-text-secondary mt-2.5 leading-relaxed">
                                    Đòi hỏi phân tích dữ liệu phức tạp hơn thông qua việc lồng ghép logic, vận dụng các cấu trúc kết hợp để giải các bài toán thực tế.
                                </p>
                            </div>
                            {/* Progress bar */}
                            <div className="flex flex-col gap-2 bg-bg-primary border border-border-custom p-4 rounded-xl font-mono text-xs">
                                <div className="flex justify-between">
                                    <span className="text-text-tertiary">Đã hoàn thành:</span>
                                    <span className="font-bold text-amber-400">{completionStatus.medium.completed}/{completionStatus.medium.total} bài</span>
                                </div>
                                <div className="w-full bg-border-custom h-1.5 rounded-full overflow-hidden">
                                    <div
                                        className="bg-amber-500 h-full rounded-full transition-all duration-300"
                                        style={{ width: `${completionStatus.medium.total > 0 ? (completionStatus.medium.completed / completionStatus.medium.total) * 100 : 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate(`/practice/${lessonId}?difficulty=MEDIUM`)}
                            className="w-full bg-amber-600 text-white font-extrabold text-xs py-3 rounded-xl hover:bg-amber-500 transition-all cursor-pointer border-none mt-6 active:scale-95 duration-200"
                        >
                            Bắt đầu giải bài →
                        </button>
                    </div>

                    {/* KHÓ */}
                    <div className="bg-bg-secondary border border-border-custom rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 hover:border-rose-500/30 group shadow-sm text-left">
                        <div className="flex flex-col gap-5">
                            <div className="flex justify-between items-center">
                                <span className="text-2xl">🔥</span>
                                <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded border text-rose-400 bg-rose-400/10 border-rose-500/20">
                                    KHÓ (HARD)
                                </span>
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-text-primary m-0 group-hover:text-rose-400 transition-colors">
                                    Thử thách nâng cao
                                </h3>
                                <p className="text-xs text-text-secondary mt-2.5 leading-relaxed">
                                    Thử thách giải quyết các thuật toán tối ưu hóa, cấu trúc dữ liệu nâng cao hoặc lập trình hướng đối tượng có độ phức tạp cao hơn.
                                </p>
                            </div>
                            {/* Progress bar */}
                            <div className="flex flex-col gap-2 bg-bg-primary border border-border-custom p-4 rounded-xl font-mono text-xs">
                                <div className="flex justify-between">
                                    <span className="text-text-tertiary">Đã hoàn thành:</span>
                                    <span className="font-bold text-rose-400">{completionStatus.hard.completed}/{completionStatus.hard.total} bài</span>
                                </div>
                                <div className="w-full bg-border-custom h-1.5 rounded-full overflow-hidden">
                                    <div
                                        className="bg-rose-500 h-full rounded-full transition-all duration-300"
                                        style={{ width: `${completionStatus.hard.total > 0 ? (completionStatus.hard.completed / completionStatus.hard.total) * 100 : 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate(`/practice/${lessonId}?difficulty=HARD`)}
                            className="w-full bg-rose-600 text-white font-extrabold text-xs py-3 rounded-xl hover:bg-rose-500 transition-all cursor-pointer border-none mt-6 active:scale-95 duration-200"
                        >
                            Bắt đầu giải bài →
                        </button>
                    </div>
                </section>}

                {/* Back button */}
                <div className="border-t border-border-custom pt-8 flex">
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-bg-tertiary hover:bg-bg-tertiary/80 border border-border-custom text-text-primary text-xs font-semibold px-5 py-2.5 rounded-xl cursor-pointer active:scale-95 transition-all"
                    >
                        &larr; Quay lại học trình
                    </button>
                </div>
            </main>
        </div>
    );
};

export default ModulePracticeSelect;
