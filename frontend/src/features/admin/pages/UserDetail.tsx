import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    Activity,
    ArrowLeft,
    Award,
    BarChart3,
    BookOpenCheck,
    CheckCircle2,
    ChevronDown,
    Clock3,
    Code2,
    Flame,
    GraduationCap,
    Layers3,
    LoaderCircle,
    Mail,
    Pencil,
    RefreshCw,
    Save,
    Search,
    ShieldCheck,
    Sparkles,
    Target,
    TrendingUp,
    UserRound,
    X,
    XCircle,
} from 'lucide-react';
import { adminApi } from '../../../features/admin/services/adminApi';
import pythonSkillGraph from '../../../data/pythonSkillGraph.json';
import javascriptSkillGraph from '../../../data/javascriptSkillGraph.json';
import cppSkillGraph from '../../../data/cppSkillGraph.json';
import sqlSkillGraph from '../../../data/sqlSkillGraph.json';

type SupportedLanguage = 'PYTHON' | 'JAVASCRIPT' | 'CPP' | 'SQL';
type KnowledgeFilter = 'ALL' | 'MASTERED' | 'DEVELOPING' | 'NEEDS_SUPPORT' | 'UNOBSERVED';

interface MasteryEvidence {
    mastery: number;
    confidence: number;
    attempts: number;
    passed: number;
    failed: number;
    evidence_weight: number;
    source: 'COURSE_SANDBOX' | 'ADAPTIVE_SANDBOX' | 'MIXED_VERIFIED';
    last_assessed_at: string | null;
}

interface MasteryProfile {
    language: SupportedLanguage;
    student_meta: {
        username: string;
        email: string;
        profile: 'NEW' | 'STRUGGLING' | 'AVERAGE' | 'EXCELLENT';
    };
    mastery: {
        'Evidence-Based': Record<string, number>;
    };
    evidence: Record<string, MasteryEvidence>;
    stats: {
        lessons_completed: number;
        practice_completed: number;
        streak_days: number;
        total_actions: number;
        total_evidence_weight: number;
        observed_skills: number;
        total_skills: number;
        overall_mastery: number | null;
    };
    model_metadata: {
        engine: string;
        confidence_definition: string;
    };
}

interface Enrollment {
    id: string;
    enrolledAt: string;
    course: {
        id: string;
        title: string;
        level: string;
    };
}

interface Submission {
    id: string;
    status: 'PASSED' | 'FAILED' | 'PENDING';
    language: string;
    submittedAt: string;
    exercise: {
        title: string;
        difficulty: string;
    };
}

interface PracticeSubmission {
    id: string;
    status: 'PASSED' | 'FAILED' | 'PENDING';
    language: string;
    submittedAt: string;
    problem: {
        title: string;
        difficulty: string;
    };
}

interface LearnerDetail {
    id: string;
    username: string;
    email: string;
    role: 'STUDENT' | 'TEACHER' | 'ADMIN';
    gender?: 'MALE' | 'FEMALE' | 'OTHER' | null;
    avatarUrl?: string | null;
    createdAt: string;
    updatedAt: string;
    enrollments: Enrollment[];
    submissions: Submission[];
    practiceSubmissions: PracticeSubmission[];
    lessonProgress: Array<{
        id: string;
        isCompleted: boolean;
        score?: number | null;
        updatedAt: string;
        lesson: {
            id: string;
            title: string;
            difficulty?: string | null;
        };
    }>;
    certificates: Array<{
        id: string;
        issuedAt: string;
        course: { title: string };
    }>;
    _count: {
        enrollments: number;
        submissions: number;
        practiceSubmissions: number;
        lessonProgress: number;
    };
    masteryProfile: MasteryProfile;
}

interface SkillDefinition {
    id: string;
    name: string;
    module_id: string;
}

interface ModuleDefinition {
    id: string;
    name: string;
}

interface SkillGraph {
    skills: SkillDefinition[];
    modules: ModuleDefinition[];
}

const graphByLanguage: Record<SupportedLanguage, SkillGraph> = {
    PYTHON: pythonSkillGraph as SkillGraph,
    JAVASCRIPT: javascriptSkillGraph as SkillGraph,
    CPP: cppSkillGraph as SkillGraph,
    SQL: sqlSkillGraph as SkillGraph,
};

const languageLabels: Record<SupportedLanguage, string> = {
    PYTHON: 'Python',
    JAVASCRIPT: 'JavaScript',
    CPP: 'C++',
    SQL: 'SQL',
};

const numberFormatter = new Intl.NumberFormat('vi-VN');

export default function UserDetail() {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<LearnerDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('PYTHON');
    const [knowledgeSearch, setKnowledgeSearch] = useState('');
    const [knowledgeFilter, setKnowledgeFilter] = useState<KnowledgeFilter>('ALL');
    const [showAllSkills, setShowAllSkills] = useState(false);
    const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ username: '', email: '', role: '', gender: '' });
    const [saving, setSaving] = useState(false);

    const loadUser = useCallback(async () => {
        if (!id) return;
        try {
            setLoading(true);
            setError('');
            const data = await adminApi.getUserById(id, selectedLanguage);
            setUser(data);
            setFormData({
                username: data.username,
                email: data.email,
                role: data.role,
                gender: data.gender || '',
            });
        } catch (loadError) {
            console.error('Failed to load user:', loadError);
            setError('Không thể tải hồ sơ học viên.');
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, [id, selectedLanguage]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch the selected learner and language profile
        void loadUser();
    }, [loadUser]);

    const knowledgeData = useMemo(() => {
        if (!user) return null;
        const graph = graphByLanguage[selectedLanguage];
        const evidence = user.masteryProfile?.evidence ?? {};
        const skills = graph.skills.map((skill) => {
            const skillEvidence = evidence[skill.id];
            return {
                ...skill,
                evidence: skillEvidence ?? null,
                mastery: skillEvidence ? skillEvidence.mastery : null,
            };
        });

        const observedSkills = skills.filter((skill) => skill.mastery !== null);
        const mastered = observedSkills.filter((skill) => (skill.mastery ?? 0) >= 0.75).length;
        const developing = observedSkills.filter((skill) => (skill.mastery ?? 0) >= 0.5 && (skill.mastery ?? 0) < 0.75).length;
        const needsSupport = observedSkills.filter((skill) => (skill.mastery ?? 0) < 0.5).length;
        const unobserved = skills.length - observedSkills.length;

        const filteredSkills = skills.filter((skill) => {
            const matchesSearch =
                !knowledgeSearch.trim() ||
                skill.name.toLocaleLowerCase('vi').includes(knowledgeSearch.trim().toLocaleLowerCase('vi')) ||
                skill.id.toLowerCase().includes(knowledgeSearch.trim().toLowerCase());
            const matchesFilter =
                knowledgeFilter === 'ALL' ||
                (knowledgeFilter === 'MASTERED' && skill.mastery !== null && skill.mastery >= 0.75) ||
                (knowledgeFilter === 'DEVELOPING' && skill.mastery !== null && skill.mastery >= 0.5 && skill.mastery < 0.75) ||
                (knowledgeFilter === 'NEEDS_SUPPORT' && skill.mastery !== null && skill.mastery < 0.5) ||
                (knowledgeFilter === 'UNOBSERVED' && skill.mastery === null);
            return matchesSearch && matchesFilter;
        });

        const moduleAnalytics = graph.modules.map((module) => {
            const moduleSkills = skills.filter((skill) => skill.module_id === module.id);
            const observed = moduleSkills.filter((skill) => skill.mastery !== null);
            const average = observed.length > 0
                ? observed.reduce((total, skill) => total + (skill.mastery ?? 0), 0) / observed.length
                : null;
            return {
                id: module.id,
                name: module.name,
                total: moduleSkills.length,
                observed: observed.length,
                average,
            };
        });

        const selectedSkill = skills.find((skill) => skill.id === selectedSkillId) ?? observedSkills[0] ?? skills[0] ?? null;
        const averageConfidence = observedSkills.length > 0
            ? observedSkills.reduce((total, skill) => total + (skill.evidence?.confidence ?? 0), 0) / observedSkills.length
            : null;

        return {
            skills,
            filteredSkills,
            selectedSkill,
            moduleAnalytics,
            mastered,
            developing,
            needsSupport,
            unobserved,
            observedCount: observedSkills.length,
            averageConfidence,
        };
    }, [knowledgeFilter, knowledgeSearch, selectedLanguage, selectedSkillId, user]);

    const recentActivity = useMemo(() => {
        if (!user) return [];
        const courseItems = user.submissions.map((submission) => ({
            id: `course-${submission.id}`,
            title: submission.exercise.title,
            kind: 'Bài tập khóa học',
            difficulty: submission.exercise.difficulty,
            language: submission.language,
            status: submission.status,
            submittedAt: submission.submittedAt,
        }));
        const practiceItems = user.practiceSubmissions.map((submission) => ({
            id: `practice-${submission.id}`,
            title: submission.problem.title,
            kind: 'Luyện tập tự do',
            difficulty: submission.problem.difficulty,
            language: submission.language,
            status: submission.status,
            submittedAt: submission.submittedAt,
        }));
        return [...courseItems, ...practiceItems]
            .sort((left, right) => new Date(right.submittedAt).getTime() - new Date(left.submittedAt).getTime())
            .slice(0, 10);
    }, [user]);

    const outcomeStats = useMemo(() => {
        const passed = recentActivity.filter((item) => item.status === 'PASSED').length;
        const failed = recentActivity.filter((item) => item.status === 'FAILED').length;
        const pending = recentActivity.filter((item) => item.status === 'PENDING').length;
        const total = recentActivity.length;
        return {
            passed,
            failed,
            pending,
            total,
            passPercent: total > 0 ? Math.round((passed / total) * 100) : 0,
            failPercent: total > 0 ? Math.round((failed / total) * 100) : 0,
            pendingPercent: total > 0 ? Math.round((pending / total) * 100) : 0,
        };
    }, [recentActivity]);

    const handleUpdate = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!id) return;
        try {
            setSaving(true);
            await adminApi.updateUser(id, formData);
            setEditMode(false);
            await loadUser();
        } catch (updateError) {
            console.error('Failed to update user:', updateError);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="mx-auto flex min-h-[68vh] w-full max-w-[1480px] items-center justify-center">
                <div className="flex flex-col items-center gap-4 rounded-3xl border border-violet-100 bg-white px-10 py-9 shadow-sm dark:border-white/10 dark:bg-bg-secondary">
                    <LoaderCircle className="h-8 w-8 animate-spin text-violet-600" aria-hidden="true" />
                    <p className="text-sm font-extrabold text-text-primary">Đang phân tích hồ sơ học viên...</p>
                </div>
            </div>
        );
    }

    if (!user || !knowledgeData) {
        return (
            <div className="mx-auto flex min-h-[68vh] w-full max-w-[1480px] items-center justify-center">
                <div className="max-w-md rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-sm dark:border-rose-500/20 dark:bg-bg-secondary">
                    <XCircle className="mx-auto h-10 w-10 text-rose-500" aria-hidden="true" />
                    <h2 className="mt-4 text-lg font-black text-text-primary">Không mở được hồ sơ</h2>
                    <p className="mt-2 text-sm text-text-secondary">{error || 'Không tìm thấy học viên này.'}</p>
                    <Link to="/admin/users" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-bold text-white">
                        <ArrowLeft className="h-4 w-4" /> Quay lại danh sách
                    </Link>
                </div>
            </div>
        );
    }

    const overallMastery = user.masteryProfile?.stats.overall_mastery ?? null;
    const profile = user.masteryProfile?.student_meta.profile ?? 'NEW';
    const visibleSkills = showAllSkills ? knowledgeData.filteredSkills : knowledgeData.filteredSkills.slice(0, 8);

    return (
        <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-6 text-left text-text-primary">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <Link to="/admin/users" className="inline-flex w-fit items-center gap-2 text-xs font-bold text-text-tertiary transition hover:text-violet-700">
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Quay lại danh sách học viên
                </Link>
                <div className="flex flex-wrap gap-2">
                    <select
                        value={selectedLanguage}
                        onChange={(event) => {
                            setSelectedLanguage(event.target.value as SupportedLanguage);
                            setSelectedSkillId(null);
                        }}
                        className="min-h-10 cursor-pointer rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-text-secondary outline-none transition hover:border-violet-300 focus:border-violet-500 dark:border-white/10 dark:bg-bg-secondary"
                        aria-label="Ngôn ngữ hồ sơ tri thức"
                    >
                        {(Object.keys(languageLabels) as SupportedLanguage[]).map((language) => (
                            <option key={language} value={language}>{languageLabels[language]}</option>
                        ))}
                    </select>
                    <button
                        type="button"
                        onClick={() => void loadUser()}
                        className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-3 text-xs font-bold text-violet-700 transition hover:bg-violet-100 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300"
                    >
                        <RefreshCw className="h-4 w-4" aria-hidden="true" />
                        Làm mới
                    </button>
                    <button
                        type="button"
                        onClick={() => setEditMode(true)}
                        className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-xl bg-violet-600 px-4 text-xs font-bold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700"
                    >
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                        Chỉnh sửa hồ sơ
                    </button>
                </div>
            </div>

            <section className="relative overflow-hidden rounded-[28px] border border-violet-100 bg-[linear-gradient(120deg,#ffffff_0%,#f5f3ff_54%,#ecfeff_100%)] p-6 shadow-[0_20px_60px_-42px_rgba(79,70,229,0.45)] dark:border-white/10 dark:bg-[linear-gradient(120deg,#111522_0%,#18172b_58%,#102129_100%)] sm:p-7">
                <div className="absolute -right-14 -top-16 h-52 w-52 rounded-full bg-cyan-300/20 blur-3xl dark:bg-cyan-500/10" aria-hidden="true" />
                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt="" className="h-20 w-20 rounded-[22px] object-cover shadow-lg" />
                        ) : (
                            <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[22px] bg-gradient-to-br from-violet-500 to-indigo-600 text-2xl font-black uppercase text-white shadow-xl shadow-violet-600/20">
                                {user.username.charAt(0)}
                            </span>
                        )}
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-2xl font-black tracking-[-0.04em] text-slate-950 dark:text-white sm:text-[28px]">{user.username}</h2>
                                <RoleBadge role={user.role} />
                            </div>
                            <p className="mt-2 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                <Mail className="h-4 w-4" aria-hidden="true" />
                                {user.email}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-bold">
                                <span className="rounded-full border border-white bg-white/75 px-3 py-1.5 text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                                    Tham gia {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                                </span>
                                <span className={`rounded-full border px-3 py-1.5 ${profileStyle(profile)}`}>
                                    {profileLabel(profile)}
                                </span>
                                <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-300">
                                    {languageLabels[selectedLanguage]}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[500px]">
                        <HeroStat label="Mastery" value={overallMastery === null ? '—' : `${Math.round(overallMastery * 100)}%`} icon={Target} />
                        <HeroStat label="Kỹ năng có bằng chứng" value={knowledgeData.observedCount} icon={Layers3} />
                        <HeroStat label="Tổng hành động" value={user.masteryProfile?.stats.total_actions ?? 0} icon={Activity} />
                        <HeroStat label="Chuỗi học" value={`${user.masteryProfile?.stats.streak_days ?? 0} ngày`} icon={Flame} />
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard label="Khóa học đã đăng ký" value={user._count.enrollments} hint="Khóa học đang theo dõi" icon={GraduationCap} tone="violet" />
                <MetricCard label="Bài học đã ghi nhận" value={user._count.lessonProgress} hint="Tiến độ bài học" icon={BookOpenCheck} tone="sky" />
                <MetricCard label="Bài nộp khóa học" value={user._count.submissions} hint="Bài tập trong khóa học" icon={Code2} tone="emerald" />
                <MetricCard label="Bài luyện tập" value={user._count.practiceSubmissions} hint="Hoạt động luyện tập tự do" icon={BarChart3} tone="amber" />
            </section>

            <section className="grid grid-cols-1 gap-5 xl:grid-cols-12">
                <article className="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_18px_48px_-38px_rgba(15,23,42,0.45)] dark:border-white/10 dark:bg-bg-secondary xl:col-span-8">
                    <div className="border-b border-slate-100 p-5 dark:border-white/8 sm:p-6">
                        <SectionHeader icon={Layers3} title="Hồ sơ tri thức cá nhân" description="Mỗi điểm số đều đi kèm bằng chứng từ bài chạy kiểm thử" />
                        <div className="mt-5 flex flex-col gap-3 lg:flex-row">
                            <div className="relative flex-1">
                                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                                <input
                                    type="search"
                                    value={knowledgeSearch}
                                    onChange={(event) => setKnowledgeSearch(event.target.value)}
                                    placeholder="Tìm kỹ năng hoặc mã kiến thức..."
                                    className="min-h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs font-semibold text-text-primary outline-none focus:border-violet-500 dark:border-white/10 dark:bg-bg-tertiary"
                                />
                            </div>
                            <div className="relative">
                                <select
                                    value={knowledgeFilter}
                                    onChange={(event) => setKnowledgeFilter(event.target.value as KnowledgeFilter)}
                                    className="min-h-10 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2 pl-3 pr-9 text-xs font-bold text-text-secondary outline-none focus:border-violet-500 dark:border-white/10 dark:bg-bg-tertiary lg:w-auto"
                                    aria-label="Lọc trạng thái kỹ năng"
                                >
                                    <option value="ALL">Tất cả kỹ năng</option>
                                    <option value="MASTERED">Đã vững ≥ 75%</option>
                                    <option value="DEVELOPING">Đang phát triển</option>
                                    <option value="NEEDS_SUPPORT">Cần hỗ trợ</option>
                                    <option value="UNOBSERVED">Chưa đánh giá</option>
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-3 p-4 sm:p-5">
                        {visibleSkills.length > 0 ? visibleSkills.map((skill) => (
                            <button
                                type="button"
                                key={skill.id}
                                onClick={() => setSelectedSkillId(skill.id)}
                                className={`group w-full cursor-pointer rounded-2xl border p-4 text-left transition ${
                                    knowledgeData.selectedSkill?.id === skill.id
                                        ? 'border-violet-300 bg-violet-50/70 shadow-sm dark:border-violet-500/30 dark:bg-violet-500/8'
                                        : 'border-slate-100 bg-slate-50/60 hover:border-violet-200 hover:bg-white dark:border-white/5 dark:bg-white/[0.025] dark:hover:bg-white/5'
                                }`}
                            >
                                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="truncate text-xs font-extrabold text-text-primary">{skill.name}</p>
                                            <KnowledgeBadge mastery={skill.mastery} />
                                        </div>
                                        <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-text-tertiary">{skill.id}</p>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-5 text-xs">
                                        <div>
                                            <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-text-tertiary">Số lần thử</p>
                                            <p className="mt-1 font-black text-text-primary">{skill.evidence?.attempts ?? 0}</p>
                                        </div>
                                        <div className="min-w-16 text-right">
                                            <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-text-tertiary">Mastery</p>
                                            <p className="mt-1 font-black text-text-primary">{skill.mastery === null ? '—' : `${Math.round(skill.mastery * 100)}%`}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200/70 dark:bg-white/8">
                                    <div
                                        className={`h-full rounded-full transition-[width] duration-500 ${masteryBarClass(skill.mastery)}`}
                                        style={{ width: skill.mastery === null ? '0%' : `${Math.round(skill.mastery * 100)}%` }}
                                    />
                                </div>
                            </button>
                        )) : (
                            <EmptyState message="Không có kỹ năng phù hợp với bộ lọc." />
                        )}

                        {knowledgeData.filteredSkills.length > 8 && (
                            <button
                                type="button"
                                onClick={() => setShowAllSkills((current) => !current)}
                                className="min-h-11 cursor-pointer rounded-xl border border-dashed border-violet-200 bg-violet-50/60 text-xs font-bold text-violet-700 transition hover:bg-violet-100 dark:border-violet-500/20 dark:bg-violet-500/5 dark:text-violet-300"
                            >
                                {showAllSkills ? 'Thu gọn danh sách' : `Xem toàn bộ ${knowledgeData.filteredSkills.length} kỹ năng`}
                            </button>
                        )}
                    </div>
                </article>

                <div className="flex flex-col gap-5 xl:col-span-4">
                    <article className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_48px_-38px_rgba(15,23,42,0.45)] dark:border-white/10 dark:bg-bg-secondary sm:p-6">
                        <SectionHeader icon={Target} title="Tổng quan năng lực" description="Chỉ tính các kỹ năng đã có bằng chứng" />
                        <div className="mt-6 flex flex-col items-center">
                            <MasteryDonut value={overallMastery} />
                            <div className="mt-6 grid w-full grid-cols-2 gap-2">
                                <KnowledgeCount label="Đã vững" value={knowledgeData.mastered} tone="emerald" />
                                <KnowledgeCount label="Đang phát triển" value={knowledgeData.developing} tone="sky" />
                                <KnowledgeCount label="Cần hỗ trợ" value={knowledgeData.needsSupport} tone="rose" />
                                <KnowledgeCount label="Chưa đánh giá" value={knowledgeData.unobserved} tone="slate" />
                            </div>
                            <div className="mt-5 w-full rounded-2xl bg-slate-50 p-4 dark:bg-white/[0.03]">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-semibold text-text-secondary">Độ tin cậy trung bình</span>
                                    <span className="font-black text-text-primary">
                                        {knowledgeData.averageConfidence === null ? '—' : `${Math.round(knowledgeData.averageConfidence * 100)}%`}
                                    </span>
                                </div>
                                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/8">
                                    <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-sky-400" style={{ width: knowledgeData.averageConfidence === null ? '0%' : `${Math.round(knowledgeData.averageConfidence * 100)}%` }} />
                                </div>
                            </div>
                        </div>
                    </article>

                    <article className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_48px_-38px_rgba(15,23,42,0.45)] dark:border-white/10 dark:bg-bg-secondary sm:p-6">
                        <SectionHeader icon={Sparkles} title="Chi tiết bằng chứng" description="Kỹ năng đang được chọn" />
                        {knowledgeData.selectedSkill ? (
                            <div className="mt-5">
                                <p className="text-sm font-extrabold leading-6 text-text-primary">{knowledgeData.selectedSkill.name}</p>
                                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.1em] text-violet-600 dark:text-violet-300">{knowledgeData.selectedSkill.id}</p>
                                {knowledgeData.selectedSkill.evidence ? (
                                    <div className="mt-5 grid grid-cols-2 gap-2">
                                        <EvidenceStat label="Đã đạt" value={knowledgeData.selectedSkill.evidence.passed} icon={CheckCircle2} tone="emerald" />
                                        <EvidenceStat label="Chưa đạt" value={knowledgeData.selectedSkill.evidence.failed} icon={XCircle} tone="rose" />
                                        <EvidenceStat label="Lần thử" value={knowledgeData.selectedSkill.evidence.attempts} icon={Activity} tone="violet" />
                                        <EvidenceStat label="Tin cậy" value={`${Math.round(knowledgeData.selectedSkill.evidence.confidence * 100)}%`} icon={ShieldCheck} tone="sky" />
                                    </div>
                                ) : (
                                    <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-xs leading-5 text-text-tertiary dark:border-white/10 dark:bg-white/[0.025]">
                                        Chưa có bài làm đã kiểm thử cho kỹ năng này. Hệ thống không gán điểm mặc định.
                                    </div>
                                )}
                                {knowledgeData.selectedSkill.evidence?.last_assessed_at && (
                                    <p className="mt-4 flex items-center gap-2 text-[10px] font-medium text-text-tertiary">
                                        <Clock3 className="h-3.5 w-3.5" />
                                        Đánh giá gần nhất {new Date(knowledgeData.selectedSkill.evidence.last_assessed_at).toLocaleString('vi-VN')}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <EmptyState message="Chưa có kỹ năng để hiển thị." />
                        )}
                    </article>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-5 xl:grid-cols-12">
                <article className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_48px_-38px_rgba(15,23,42,0.45)] dark:border-white/10 dark:bg-bg-secondary sm:p-6 xl:col-span-7">
                    <SectionHeader icon={TrendingUp} title="Năng lực theo chặng kiến thức" description={`Trung bình các kỹ năng đã quan sát trong ${languageLabels[selectedLanguage]}`} />
                    <div className="mt-6 space-y-5">
                        {knowledgeData.moduleAnalytics.map((module) => (
                            <div key={module.id}>
                                <div className="mb-2 flex items-center justify-between gap-4">
                                    <div className="min-w-0">
                                        <p className="truncate text-xs font-bold text-text-secondary" title={module.name}>{module.name}</p>
                                        <p className="mt-1 text-[9px] text-text-tertiary">{module.observed}/{module.total} kỹ năng có bằng chứng</p>
                                    </div>
                                    <span className="shrink-0 text-xs font-black text-text-primary">{module.average === null ? '—' : `${Math.round(module.average * 100)}%`}</span>
                                </div>
                                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
                                    <div className="h-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-400" style={{ width: module.average === null ? '0%' : `${Math.round(module.average * 100)}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </article>

                <article className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_48px_-38px_rgba(15,23,42,0.45)] dark:border-white/10 dark:bg-bg-secondary sm:p-6 xl:col-span-5">
                    <SectionHeader icon={BarChart3} title="Kết quả hoạt động gần đây" description={`Tổng hợp ${outcomeStats.total} lượt nộp được API trả về`} />
                    <div className="mt-7 grid items-center gap-7 sm:grid-cols-[150px_1fr] xl:grid-cols-1 2xl:grid-cols-[150px_1fr]">
                        <OutcomeDonut stats={outcomeStats} />
                        <div className="space-y-3">
                            <OutcomeLegend label="Đã đạt" value={outcomeStats.passed} percent={outcomeStats.passPercent} color="bg-emerald-500" />
                            <OutcomeLegend label="Chưa đạt" value={outcomeStats.failed} percent={outcomeStats.failPercent} color="bg-rose-400" />
                            <OutcomeLegend label="Đang chờ" value={outcomeStats.pending} percent={outcomeStats.pendingPercent} color="bg-amber-400" />
                        </div>
                    </div>
                </article>
            </section>

            <section className="grid grid-cols-1 gap-5 xl:grid-cols-12">
                <article className="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_18px_48px_-38px_rgba(15,23,42,0.45)] dark:border-white/10 dark:bg-bg-secondary xl:col-span-7">
                    <div className="border-b border-slate-100 p-5 dark:border-white/8 sm:p-6">
                        <SectionHeader icon={Activity} title="Dòng hoạt động gần đây" description="Bài tập khóa học và luyện tập tự do" />
                    </div>
                    {recentActivity.length > 0 ? (
                        <div className="divide-y divide-slate-100 dark:divide-white/5">
                            {recentActivity.slice(0, 7).map((item) => (
                                <div key={item.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                                    <div className="flex min-w-0 items-start gap-3">
                                        <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${statusIconStyle(item.status)}`}>
                                            {item.status === 'PASSED' ? <CheckCircle2 className="h-4 w-4" /> : item.status === 'FAILED' ? <XCircle className="h-4 w-4" /> : <Clock3 className="h-4 w-4" />}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="truncate text-xs font-extrabold text-text-primary">{item.title}</p>
                                            <p className="mt-1 text-[10px] text-text-tertiary">{item.kind} · {item.language} · {difficultyLabel(item.difficulty)}</p>
                                        </div>
                                    </div>
                                    <div className="flex shrink-0 items-center justify-between gap-3 pl-12 sm:justify-end sm:pl-0">
                                        <StatusBadge status={item.status} />
                                        <span className="text-[10px] font-medium text-text-tertiary">{new Date(item.submittedAt).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState message="Học viên chưa có hoạt động nộp bài." />
                    )}
                </article>

                <article className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_48px_-38px_rgba(15,23,42,0.45)] dark:border-white/10 dark:bg-bg-secondary sm:p-6 xl:col-span-5">
                    <SectionHeader icon={GraduationCap} title="Khóa học đang theo dõi" description={`${user.enrollments.length} khóa học đã đăng ký`} />
                    {user.enrollments.length > 0 ? (
                        <div className="mt-5 space-y-3">
                            {user.enrollments.map((enrollment) => (
                                <div key={enrollment.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-white/5 dark:bg-white/[0.025]">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <p className="truncate text-xs font-extrabold text-text-primary">{enrollment.course.title}</p>
                                            <p className="mt-1 text-[10px] font-semibold text-text-tertiary">{courseLevelLabel(enrollment.course.level)}</p>
                                        </div>
                                        <span className="shrink-0 rounded-full bg-violet-100 px-2.5 py-1 text-[9px] font-extrabold text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                                            {new Date(enrollment.enrolledAt).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState message="Học viên chưa đăng ký khóa học." />
                    )}
                    {user.certificates.length > 0 && (
                        <div className="mt-5 border-t border-slate-100 pt-5 dark:border-white/8">
                            <p className="flex items-center gap-2 text-xs font-extrabold text-text-primary">
                                <Award className="h-4 w-4 text-amber-500" />
                                Chứng chỉ đã nhận
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {user.certificates.map((certificate) => (
                                    <span key={certificate.id} className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[10px] font-bold text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
                                        {certificate.course.title}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </article>
            </section>

            {editMode && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Chỉnh sửa hồ sơ học viên">
                    <div className="w-full max-w-xl rounded-[26px] border border-white/50 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#131827] sm:p-7">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                                    <Pencil className="h-5 w-5" />
                                </span>
                                <div>
                                    <h3 className="text-lg font-black text-text-primary">Chỉnh sửa hồ sơ</h3>
                                    <p className="mt-1 text-xs text-text-tertiary">Cập nhật thông tin tài khoản và quyền truy cập.</p>
                                </div>
                            </div>
                            <button type="button" onClick={() => setEditMode(false)} className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 dark:hover:bg-white/5" aria-label="Đóng">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <form onSubmit={handleUpdate} className="mt-6 grid gap-4 sm:grid-cols-2">
                            <EditField label="Tên đăng nhập" icon={UserRound}>
                                <input value={formData.username} onChange={(event) => setFormData((current) => ({ ...current, username: event.target.value }))} className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-text-primary outline-none focus:border-violet-500 dark:border-white/10 dark:bg-bg-tertiary" />
                            </EditField>
                            <EditField label="Email" icon={Mail}>
                                <input type="email" value={formData.email} onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))} className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-text-primary outline-none focus:border-violet-500 dark:border-white/10 dark:bg-bg-tertiary" />
                            </EditField>
                            <EditField label="Vai trò" icon={ShieldCheck}>
                                <select value={formData.role} onChange={(event) => setFormData((current) => ({ ...current, role: event.target.value }))} className="min-h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-text-primary outline-none focus:border-violet-500 dark:border-white/10 dark:bg-bg-tertiary">
                                    <option value="STUDENT">Học viên</option>
                                    <option value="TEACHER">Giảng viên</option>
                                    <option value="ADMIN">Quản trị viên</option>
                                </select>
                            </EditField>
                            <EditField label="Giới tính" icon={UserRound}>
                                <select value={formData.gender} onChange={(event) => setFormData((current) => ({ ...current, gender: event.target.value }))} className="min-h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-text-primary outline-none focus:border-violet-500 dark:border-white/10 dark:bg-bg-tertiary">
                                    <option value="">Không xác định</option>
                                    <option value="MALE">Nam</option>
                                    <option value="FEMALE">Nữ</option>
                                    <option value="OTHER">Khác</option>
                                </select>
                            </EditField>
                            <div className="flex flex-col-reverse gap-3 pt-3 sm:col-span-2 sm:flex-row">
                                <button type="button" onClick={() => setEditMode(false)} className="min-h-11 flex-1 cursor-pointer rounded-xl border border-slate-200 text-sm font-bold text-text-secondary transition hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5">Hủy</button>
                                <button type="submit" disabled={saving} className="inline-flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-violet-600 text-sm font-bold text-white transition hover:bg-violet-700 disabled:opacity-50">
                                    {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    Lưu thay đổi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function SectionHeader({ icon: Icon, title, description }: { icon: typeof Activity; title: string; description: string }) {
    return (
        <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
            </span>
            <div>
                <h3 className="text-sm font-extrabold text-text-primary">{title}</h3>
                <p className="mt-1 text-[11px] text-text-tertiary">{description}</p>
            </div>
        </div>
    );
}

function HeroStat({ label, value, icon: Icon }: { label: string; value: string | number; icon: typeof Target }) {
    return (
        <div className="rounded-2xl border border-white/80 bg-white/70 p-3 shadow-sm backdrop-blur-sm dark:border-white/8 dark:bg-white/5">
            <Icon className="h-4 w-4 text-violet-600 dark:text-violet-300" aria-hidden="true" />
            <p className="mt-3 text-lg font-black text-slate-950 dark:text-white">{typeof value === 'number' ? numberFormatter.format(value) : value}</p>
            <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">{label}</p>
        </div>
    );
}

function MetricCard({ label, value, hint, icon: Icon, tone }: { label: string; value: number; hint: string; icon: typeof GraduationCap; tone: 'violet' | 'sky' | 'emerald' | 'amber' }) {
    const styles = {
        violet: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
        sky: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
        emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
        amber: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
    };
    return (
        <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_16px_42px_-34px_rgba(15,23,42,0.45)] dark:border-white/10 dark:bg-bg-secondary">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-bold text-text-tertiary">{label}</p>
                    <p className="mt-3 text-3xl font-black tracking-[-0.05em] text-text-primary">{numberFormatter.format(value)}</p>
                    <p className="mt-2 text-[11px] text-text-tertiary">{hint}</p>
                </div>
                <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${styles[tone]}`}><Icon className="h-5 w-5" /></span>
            </div>
        </article>
    );
}

function MasteryDonut({ value }: { value: number | null }) {
    const percent = value === null ? 0 : Math.round(value * 100);
    return (
        <div className="relative flex h-40 w-40 items-center justify-center rounded-full" style={{ background: value === null ? 'conic-gradient(#e2e8f0 0 100%)' : `conic-gradient(#6366f1 0 ${percent}%, #e9eaf5 ${percent}% 100%)` }}>
            <div className="flex h-[116px] w-[116px] flex-col items-center justify-center rounded-full bg-white shadow-inner dark:bg-bg-secondary">
                <span className="text-3xl font-black tracking-[-0.05em] text-text-primary">{value === null ? '—' : `${percent}%`}</span>
                <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.12em] text-text-tertiary">{value === null ? 'Chưa có dữ liệu' : 'Mastery tổng'}</span>
            </div>
        </div>
    );
}

function KnowledgeCount({ label, value, tone }: { label: string; value: number; tone: 'emerald' | 'sky' | 'rose' | 'slate' }) {
    const styles = {
        emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/8 dark:text-emerald-300',
        sky: 'bg-sky-50 text-sky-700 dark:bg-sky-500/8 dark:text-sky-300',
        rose: 'bg-rose-50 text-rose-700 dark:bg-rose-500/8 dark:text-rose-300',
        slate: 'bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-300',
    };
    return (
        <div className={`rounded-xl p-3 ${styles[tone]}`}>
            <p className="text-lg font-black">{numberFormatter.format(value)}</p>
            <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.08em]">{label}</p>
        </div>
    );
}

function EvidenceStat({ label, value, icon: Icon, tone }: { label: string; value: string | number; icon: typeof Activity; tone: 'emerald' | 'rose' | 'violet' | 'sky' }) {
    const styles = {
        emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/8 dark:text-emerald-300',
        rose: 'bg-rose-50 text-rose-700 dark:bg-rose-500/8 dark:text-rose-300',
        violet: 'bg-violet-50 text-violet-700 dark:bg-violet-500/8 dark:text-violet-300',
        sky: 'bg-sky-50 text-sky-700 dark:bg-sky-500/8 dark:text-sky-300',
    };
    return (
        <div className={`rounded-xl p-3 ${styles[tone]}`}>
            <Icon className="h-3.5 w-3.5" />
            <p className="mt-2 text-lg font-black text-text-primary">{value}</p>
            <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.08em]">{label}</p>
        </div>
    );
}

function OutcomeDonut({ stats }: { stats: { total: number; passPercent: number; failPercent: number; pendingPercent: number } }) {
    return (
        <div className="mx-auto">
            <div className="relative flex h-36 w-36 items-center justify-center rounded-full" style={{ background: stats.total > 0 ? `conic-gradient(#10b981 0 ${stats.passPercent}%, #fb7185 ${stats.passPercent}% ${stats.passPercent + stats.failPercent}%, #fbbf24 ${stats.passPercent + stats.failPercent}% 100%)` : 'conic-gradient(#e2e8f0 0 100%)' }}>
                <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white shadow-inner dark:bg-bg-secondary">
                    <span className="text-2xl font-black text-text-primary">{stats.total}</span>
                    <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.1em] text-text-tertiary">Lượt gần đây</span>
                </div>
            </div>
        </div>
    );
}

function OutcomeLegend({ label, value, percent, color }: { label: string; value: number; percent: number; color: string }) {
    return (
        <div>
            <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-semibold text-text-secondary"><span className={`h-2.5 w-2.5 rounded-full ${color}`} />{label}</span>
                <span className="font-black text-text-primary">{value} · {percent}%</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/5"><div className={`h-full rounded-full ${color}`} style={{ width: `${percent}%` }} /></div>
        </div>
    );
}

function EditField({ label, icon: Icon, children }: { label: string; icon: typeof UserRound; children: React.ReactNode }) {
    return (
        <label className="block">
            <span className="mb-2 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.12em] text-text-tertiary"><Icon className="h-3.5 w-3.5" />{label}</span>
            {children}
        </label>
    );
}

function RoleBadge({ role }: { role: LearnerDetail['role'] }) {
    const styles = {
        ADMIN: 'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300',
        TEACHER: 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-300',
        STUDENT: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300',
    };
    const labels = { ADMIN: 'Quản trị viên', TEACHER: 'Giảng viên', STUDENT: 'Học viên' };
    return <span className={`rounded-full border px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.1em] ${styles[role]}`}>{labels[role]}</span>;
}

function KnowledgeBadge({ mastery }: { mastery: number | null }) {
    if (mastery === null) return <span className="rounded-full bg-slate-100 px-2 py-1 text-[8px] font-extrabold uppercase tracking-[0.08em] text-slate-500 dark:bg-white/5 dark:text-slate-400">Chưa đánh giá</span>;
    if (mastery >= 0.75) return <span className="rounded-full bg-emerald-100 px-2 py-1 text-[8px] font-extrabold uppercase tracking-[0.08em] text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">Đã vững</span>;
    if (mastery >= 0.5) return <span className="rounded-full bg-sky-100 px-2 py-1 text-[8px] font-extrabold uppercase tracking-[0.08em] text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">Đang phát triển</span>;
    return <span className="rounded-full bg-rose-100 px-2 py-1 text-[8px] font-extrabold uppercase tracking-[0.08em] text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">Cần hỗ trợ</span>;
}

function StatusBadge({ status }: { status: Submission['status'] }) {
    const styles = {
        PASSED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
        FAILED: 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300',
        PENDING: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
    };
    const labels = { PASSED: 'Đã đạt', FAILED: 'Chưa đạt', PENDING: 'Đang chờ' };
    return <span className={`rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.08em] ${styles[status]}`}>{labels[status]}</span>;
}

function EmptyState({ message }: { message: string }) {
    return <div className="m-5 flex min-h-28 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-5 text-center text-xs font-semibold text-text-tertiary dark:border-white/10 dark:bg-white/[0.025]">{message}</div>;
}

function masteryBarClass(mastery: number | null) {
    if (mastery === null) return 'bg-slate-300';
    if (mastery >= 0.75) return 'bg-gradient-to-r from-emerald-400 to-teal-500';
    if (mastery >= 0.5) return 'bg-gradient-to-r from-sky-400 to-blue-500';
    return 'bg-gradient-to-r from-rose-400 to-pink-500';
}

function statusIconStyle(status: Submission['status']) {
    if (status === 'PASSED') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300';
    if (status === 'FAILED') return 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300';
    return 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300';
}

function profileLabel(profile: MasteryProfile['student_meta']['profile']) {
    const labels = { NEW: 'Hồ sơ mới', STRUGGLING: 'Cần hỗ trợ', AVERAGE: 'Đang phát triển', EXCELLENT: 'Nổi bật' };
    return labels[profile];
}

function profileStyle(profile: MasteryProfile['student_meta']['profile']) {
    if (profile === 'EXCELLENT') return 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300';
    if (profile === 'STRUGGLING') return 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300';
    if (profile === 'AVERAGE') return 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-300';
    return 'border-slate-200 bg-slate-50 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300';
}

function difficultyLabel(difficulty: string) {
    if (difficulty === 'EASY') return 'Dễ';
    if (difficulty === 'HARD') return 'Khó';
    return 'Trung bình';
}

function courseLevelLabel(level: string) {
    if (level === 'BASIC') return 'Cơ bản';
    if (level === 'ADVANCED') return 'Nâng cao';
    return 'Trung cấp';
}
