import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    BookOpenCheck,
    Check,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    CircleHelp,
    ClipboardCheck,
    Copy,
    FileText,
    FolderOpen,
    GraduationCap,
    Grid2X2,
    Layers3,
    List,
    LoaderCircle,
    Pencil,
    Plus,
    RefreshCw,
    Search,
    Sparkles,
    Trash2,
    X,
} from 'lucide-react';
import { API_BASE_URL } from '../../../config/api';
import { LessonStudioEditor } from '../../../features/admin/lesson-studio/LessonStudioEditor';

interface LessonSummary {
    id: string;
    title: string;
    lessonId: string;
    difficulty: string;
    orderIndex: number;
    isFree: boolean;
    _count: {
        codingExercises: number;
        quizQuestions: number;
    };
}

interface ChapterNode {
    id: string;
    title: string;
    orderIndex: number;
    lessons: LessonSummary[];
}

interface ModuleNode {
    id: string;
    title: string;
    orderIndex: number;
    chapters: ChapterNode[];
}

interface CourseNode {
    id: string;
    title: string;
    level?: string;
    modules: ModuleNode[];
}

interface LessonDetail {
    id: string;
    chapterId: string;
    lessonId: string;
    title: string;
    difficulty: string;
    durationMinutes: number;
    content: string;
    objective: string;
    keyKnowledge: string;
    orderIndex: number;
    isFree: boolean;
}

interface LessonRow extends LessonDetail {
    createdAt?: string;
    updatedAt?: string;
    chapter?: {
        id: string;
        title: string;
        module: {
            id: string;
            title: string;
            course: {
                id: string;
                title: string;
            };
        };
    };
    _count?: {
        codingExercises: number;
        quizQuestions: number;
    };
}

type ViewMode = 'table' | 'grid';
type SortOption = 'id_asc' | 'id_desc' | 'newest' | 'oldest' | 'title';

const numberFormatter = new Intl.NumberFormat('vi-VN');

export default function CurriculumManagement() {
    const [tree, setTree] = useState<CourseNode[]>([]);
    const [lessons, setLessons] = useState<LessonRow[]>([]);
    const [treeLoading, setTreeLoading] = useState(true);
    const [lessonsLoading, setLessonsLoading] = useState(false);

    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [selectedModuleId, setSelectedModuleId] = useState('');
    const [selectedChapterId, setSelectedChapterId] = useState('ALL');
    const [contentTypeFilter, setContentTypeFilter] = useState('ALL');
    const [difficultyFilter, setDifficultyFilter] = useState('ALL');
    const [accessFilter, setAccessFilter] = useState('ALL');
    const [viewMode, setViewMode] = useState<ViewMode>('table');
    const [pageSize, setPageSize] = useState(12);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState<SortOption>('id_asc');

    const [editingLesson, setEditingLesson] = useState<LessonDetail | null>(null);
    const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<LessonRow | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const showToast = useCallback((message: string) => {
        setToastMessage(message);
        window.setTimeout(() => setToastMessage(''), 3500);
    }, []);

    const getAuthHeaders = useCallback(() => {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };
    }, []);

    const fetchTree = useCallback(async () => {
        try {
            setTreeLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/admin/curriculum-tree`, {
                headers: getAuthHeaders(),
            });
            const data: unknown = await response.json();
            if (!Array.isArray(data)) {
                setTree([]);
                showToast('Không thể tải cấu trúc chương trình');
                return;
            }

            const courses = data as CourseNode[];
            setTree(courses);
            setSelectedCourseId((currentCourseId) => {
                if (courses.some((course) => course.id === currentCourseId)) return currentCourseId;
                return courses[0]?.id ?? '';
            });
        } catch (error) {
            console.error('Failed to load curriculum tree:', error);
            showToast('Lỗi kết nối khi tải cấu trúc chương trình');
        } finally {
            setTreeLoading(false);
        }
    }, [getAuthHeaders, showToast]);

    const fetchLessons = useCallback(async () => {
        if (!selectedCourseId) {
            setLessons([]);
            return;
        }

        try {
            setLessonsLoading(true);
            const params = new URLSearchParams();
            if (selectedChapterId !== 'ALL') params.set('chapterId', selectedChapterId);
            else if (selectedModuleId) params.set('moduleId', selectedModuleId);
            else params.set('courseId', selectedCourseId);

            const response = await fetch(`${API_BASE_URL}/api/admin/lessons?${params.toString()}`, {
                headers: getAuthHeaders(),
            });
            const data: unknown = await response.json();
            setLessons(Array.isArray(data) ? data as LessonRow[] : []);
        } catch (error) {
            console.error('Failed to load lessons:', error);
            setLessons([]);
            showToast('Lỗi kết nối khi tải danh sách bài học');
        } finally {
            setLessonsLoading(false);
        }
    }, [getAuthHeaders, selectedChapterId, selectedCourseId, selectedModuleId, showToast]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- load the curriculum once when this page mounts
        void fetchTree();
    }, [fetchTree]);

    const currentCourse = tree.find((course) => course.id === selectedCourseId);
    const currentCourseModules = currentCourse?.modules ?? [];
    const currentModule = currentCourseModules.find((module) => module.id === selectedModuleId);
    const currentModuleChapters = currentModule?.chapters ?? [];

    useEffect(() => {
        if (!selectedCourseId) return;
        const course = tree.find((item) => item.id === selectedCourseId);
        const moduleExists = course?.modules.some((module) => module.id === selectedModuleId);
        if (!moduleExists) {
            // eslint-disable-next-line react-hooks/set-state-in-effect -- synchronize the module selection after course data changes
            setSelectedModuleId(course?.modules[0]?.id ?? '');
            setSelectedChapterId('ALL');
        }
    }, [selectedCourseId, selectedModuleId, tree]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- refresh the lesson collection for the active curriculum scope
        void fetchLessons();
    }, [fetchLessons]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- filtered collections always restart from their first page
        setCurrentPage(1);
    }, [accessFilter, contentTypeFilter, difficultyFilter, searchKeyword, selectedChapterId, selectedCourseId, selectedModuleId, sortBy]);

    const curriculumStats = useMemo(() => {
        let modules = 0;
        let chapters = 0;
        let lessonCount = 0;
        let exerciseCount = 0;
        let quizCount = 0;

        tree.forEach((course) => {
            modules += course.modules.length;
            course.modules.forEach((module) => {
                chapters += module.chapters.length;
                module.chapters.forEach((chapter) => {
                    lessonCount += chapter.lessons.length;
                    chapter.lessons.forEach((lesson) => {
                        exerciseCount += lesson._count.codingExercises;
                        quizCount += lesson._count.quizQuestions;
                    });
                });
            });
        });

        return { courses: tree.length, modules, chapters, lessons: lessonCount, exercises: exerciseCount, quizzes: quizCount };
    }, [tree]);

    const filteredLessons = useMemo(() => {
        const keyword = searchKeyword.trim().toLocaleLowerCase('vi');
        const list = lessons.filter((lesson) => {
            const matchesKeyword =
                !keyword ||
                lesson.title?.toLocaleLowerCase('vi').includes(keyword) ||
                lesson.lessonId?.toLowerCase().includes(keyword) ||
                lesson.objective?.toLocaleLowerCase('vi').includes(keyword);
            const isModulePractice = Boolean(lesson.lessonId?.includes('.MP'));
            const matchesType =
                contentTypeFilter === 'ALL' ||
                (contentTypeFilter === 'LESSON' && !isModulePractice) ||
                (contentTypeFilter === 'PRACTICE' && isModulePractice);
            const normalizedDifficulty = normalizeDifficulty(lesson.difficulty);
            const matchesDifficulty = difficultyFilter === 'ALL' || normalizedDifficulty === difficultyFilter;
            const matchesAccess =
                accessFilter === 'ALL' ||
                (accessFilter === 'FREE' && lesson.isFree) ||
                (accessFilter === 'ENROLLED' && !lesson.isFree);
            return matchesKeyword && matchesType && matchesDifficulty && matchesAccess;
        });

        return list.sort((left, right) => {
            if (sortBy === 'id_asc') return (left.lessonId || '').localeCompare(right.lessonId || '', undefined, { numeric: true });
            if (sortBy === 'id_desc') return (right.lessonId || '').localeCompare(left.lessonId || '', undefined, { numeric: true });
            if (sortBy === 'title') return (left.title || '').localeCompare(right.title || '', 'vi');
            if (sortBy === 'oldest') return (left.orderIndex || 0) - (right.orderIndex || 0);
            return (right.orderIndex || 0) - (left.orderIndex || 0);
        });
    }, [accessFilter, contentTypeFilter, difficultyFilter, lessons, searchKeyword, sortBy]);

    const totalPages = Math.max(1, Math.ceil(filteredLessons.length / pageSize));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const paginatedLessons = filteredLessons.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);

    const createNewLesson = () => {
        const defaultChapterId = selectedChapterId !== 'ALL'
            ? selectedChapterId
            : currentModuleChapters[0]?.id ?? '';
        if (!defaultChapterId) {
            showToast('Hãy chọn học phần có ít nhất một chương trước khi tạo bài học');
            return;
        }
        setEditingLesson({
            id: '',
            chapterId: defaultChapterId,
            lessonId: `LS-${Date.now().toString().slice(-6)}`,
            title: 'Bài học mới',
            difficulty: 'EASY',
            durationMinutes: 15,
            content: '# 1. Lý thuyết cốt lõi\n\nNội dung lý thuyết...\n\n# 2. Cú pháp & Code mẫu\n\n```python\nprint("Hello")\n```',
            objective: 'Mục tiêu bài học...',
            keyKnowledge: '',
            orderIndex: lessons.length + 1,
            isFree: false,
        });
        setIsLessonModalOpen(true);
    };

    const openLesson = (lesson: LessonRow) => {
        setEditingLesson(lesson);
        setIsLessonModalOpen(true);
    };

    const handleDuplicateLesson = async (lesson: LessonRow) => {
        try {
            const payload = {
                ...lesson,
                id: undefined,
                lessonId: `${lesson.lessonId || 'LS'}-COPY`,
                title: `${lesson.title} (Bản sao)`,
                orderIndex: (lesson.orderIndex || 0) + 1,
            };
            const response = await fetch(`${API_BASE_URL}/api/admin/lessons`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                showToast('Không thể nhân bản bài học');
                return;
            }
            showToast('Đã nhân bản bài học');
            await Promise.all([fetchLessons(), fetchTree()]);
        } catch (error) {
            console.error('Failed to duplicate lesson:', error);
            showToast('Lỗi kết nối khi nhân bản bài học');
        }
    };

    const handleDeleteLesson = async () => {
        if (!deleteTarget) return;
        try {
            setDeleting(true);
            const response = await fetch(`${API_BASE_URL}/api/admin/lessons/${deleteTarget.id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });
            if (!response.ok) {
                showToast('Không thể xóa bài học');
                return;
            }
            setDeleteTarget(null);
            showToast('Đã xóa bài học');
            await Promise.all([fetchLessons(), fetchTree()]);
        } catch (error) {
            console.error('Failed to delete lesson:', error);
            showToast('Lỗi kết nối khi xóa bài học');
        } finally {
            setDeleting(false);
        }
    };

    const resetFilters = () => {
        setSearchKeyword('');
        setContentTypeFilter('ALL');
        setDifficultyFilter('ALL');
        setAccessFilter('ALL');
    };

    const selectedScopeLabel = selectedChapterId !== 'ALL'
        ? currentModuleChapters.find((chapter) => chapter.id === selectedChapterId)?.title
        : currentModule?.title;

    const metricCards = [
        { label: 'Khóa học', value: curriculumStats.courses, hint: 'Danh mục đang quản lý', icon: GraduationCap, tone: 'violet' as const },
        { label: 'Cấu trúc nội dung', value: curriculumStats.lessons, hint: `${curriculumStats.modules} học phần · ${curriculumStats.chapters} chương`, icon: BookOpenCheck, tone: 'sky' as const },
        { label: 'Bài tập lập trình', value: curriculumStats.exercises, hint: 'Gắn với các bài học', icon: ClipboardCheck, tone: 'emerald' as const },
        { label: 'Câu hỏi kiểm tra', value: curriculumStats.quizzes, hint: 'Câu hỏi trắc nghiệm', icon: CircleHelp, tone: 'amber' as const },
    ];

    return (
        <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-6 pb-10 text-left text-text-primary">
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-[60] flex max-w-sm items-center gap-3 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-xs font-bold text-white shadow-2xl">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    {toastMessage}
                </div>
            )}

            <section className="relative overflow-hidden rounded-[28px] border border-violet-100 bg-[linear-gradient(120deg,#ffffff_0%,#f5f3ff_54%,#ecfeff_100%)] px-5 py-6 shadow-[0_20px_60px_-42px_rgba(79,70,229,0.45)] dark:border-white/10 dark:bg-[linear-gradient(120deg,#111522_0%,#18172b_58%,#102129_100%)] sm:px-7">
                <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-cyan-300/20 blur-3xl dark:bg-cyan-500/10" aria-hidden="true" />
                <div className="relative flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-300">
                            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-500/15">
                                <Layers3 className="h-3.5 w-3.5" aria-hidden="true" />
                            </span>
                            Curriculum workspace
                        </div>
                        <h2 className="text-2xl font-black tracking-[-0.04em] text-slate-950 dark:text-white sm:text-[28px]">
                            Nội dung và bài tập
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                            Tổ chức giáo trình theo khóa học, học phần và chương; chỉnh sửa bài học trong một không gian thống nhất.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => void Promise.all([fetchTree(), fetchLessons()])}
                            className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-violet-200 bg-white/85 px-4 text-sm font-bold text-violet-700 shadow-sm transition hover:border-violet-300 hover:bg-white dark:border-violet-500/20 dark:bg-white/5 dark:text-violet-300"
                        >
                            <RefreshCw className={`h-4 w-4 ${treeLoading || lessonsLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
                            Làm mới
                        </button>
                        <button
                            type="button"
                            onClick={createNewLesson}
                            className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-bold text-white shadow-lg shadow-violet-600/20 transition hover:-translate-y-0.5 hover:bg-violet-700"
                        >
                            <Plus className="h-4 w-4" aria-hidden="true" />
                            Tạo bài học
                        </button>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Tổng quan nội dung">
                {metricCards.map((card) => (
                    <MetricCard key={card.label} {...card} />
                ))}
            </section>

            <section className="grid min-h-[680px] grid-cols-1 gap-5 xl:grid-cols-12">
                <aside className="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_18px_48px_-38px_rgba(15,23,42,0.45)] dark:border-white/10 dark:bg-bg-secondary xl:col-span-3">
                    <div className="border-b border-slate-100 p-5 dark:border-white/8">
                        <SectionHeader icon={FolderOpen} title="Cấu trúc chương trình" description="Chọn phạm vi nội dung cần quản lý" />
                        <label className="mt-5 block">
                            <span className="mb-2 block text-[9px] font-extrabold uppercase tracking-[0.14em] text-text-tertiary">Khóa học</span>
                            <div className="relative">
                                <select
                                    value={selectedCourseId}
                                    onChange={(event) => {
                                        setSelectedCourseId(event.target.value);
                                        setSelectedModuleId('');
                                        setSelectedChapterId('ALL');
                                    }}
                                    className="min-h-11 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2 pl-3 pr-9 text-xs font-bold text-text-primary outline-none transition focus:border-violet-500 dark:border-white/10 dark:bg-bg-tertiary"
                                >
                                    {tree.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            </div>
                        </label>
                    </div>

                    <div className="admin-sidebar-scroll max-h-[590px] overflow-y-auto p-3">
                        {treeLoading ? (
                            <div className="flex min-h-48 items-center justify-center">
                                <LoaderCircle className="h-6 w-6 animate-spin text-violet-600" />
                            </div>
                        ) : currentCourseModules.length === 0 ? (
                            <EmptyState message="Khóa học chưa có học phần." compact />
                        ) : (
                            <div className="space-y-2">
                                {currentCourseModules.map((module) => {
                                    const active = selectedModuleId === module.id;
                                    const moduleLessonCount = module.chapters.reduce((total, chapter) => total + chapter.lessons.length, 0);
                                    return (
                                        <div key={module.id} className={`rounded-2xl border transition ${active ? 'border-violet-200 bg-violet-50/60 dark:border-violet-500/20 dark:bg-violet-500/5' : 'border-transparent'}`}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedModuleId(module.id);
                                                    setSelectedChapterId('ALL');
                                                }}
                                                className="flex w-full cursor-pointer items-start gap-3 rounded-2xl p-3 text-left"
                                            >
                                                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${active ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-300'}`}>
                                                    <Layers3 className="h-4 w-4" />
                                                </span>
                                                <span className="min-w-0 flex-1">
                                                    <span className="block text-xs font-extrabold leading-5 text-text-primary">{module.title}</span>
                                                    <span className="mt-1 block text-[10px] text-text-tertiary">{module.chapters.length} chương · {moduleLessonCount} bài học</span>
                                                </span>
                                            </button>
                                            {active && (
                                                <div className="space-y-1 px-3 pb-3 pl-[60px]">
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedChapterId('ALL')}
                                                        className={`block w-full cursor-pointer rounded-lg px-2.5 py-2 text-left text-[11px] font-bold transition ${selectedChapterId === 'ALL' ? 'bg-white text-violet-700 shadow-sm dark:bg-white/8 dark:text-violet-300' : 'text-text-tertiary hover:bg-white/70 hover:text-text-primary dark:hover:bg-white/5'}`}
                                                    >
                                                        Tất cả chương
                                                    </button>
                                                    {module.chapters.map((chapter) => (
                                                        <button
                                                            type="button"
                                                            key={chapter.id}
                                                            onClick={() => setSelectedChapterId(chapter.id)}
                                                            className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-[11px] font-semibold transition ${selectedChapterId === chapter.id ? 'bg-white text-violet-700 shadow-sm dark:bg-white/8 dark:text-violet-300' : 'text-text-tertiary hover:bg-white/70 hover:text-text-primary dark:hover:bg-white/5'}`}
                                                        >
                                                            <span className="line-clamp-2">{chapter.title}</span>
                                                            <span className="shrink-0 rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] dark:bg-white/8">{chapter.lessons.length}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </aside>

                <div className="flex min-w-0 flex-col gap-4 xl:col-span-9">
                    <article className="rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-[0_18px_48px_-38px_rgba(15,23,42,0.45)] dark:border-white/10 dark:bg-bg-secondary sm:p-5">
                        <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
                            <div className="min-w-0">
                                <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-violet-600 dark:text-violet-300">Phạm vi đang chọn</p>
                                <h3 className="mt-1 truncate text-base font-black text-text-primary">{selectedScopeLabel || currentCourse?.title || 'Kho nội dung'}</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <ViewToggle mode={viewMode} onChange={setViewMode} />
                                <select
                                    value={sortBy}
                                    onChange={(event) => setSortBy(event.target.value as SortOption)}
                                    className="min-h-10 cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-text-secondary outline-none focus:border-violet-500 dark:border-white/10 dark:bg-bg-tertiary"
                                    aria-label="Sắp xếp danh sách"
                                >
                                    <option value="id_asc">Mã tăng dần</option>
                                    <option value="id_desc">Mã giảm dần</option>
                                    <option value="newest">Thứ tự mới nhất</option>
                                    <option value="oldest">Thứ tự cũ nhất</option>
                                    <option value="title">Tên A–Z</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(220px,1.5fr)_repeat(3,minmax(130px,.65fr))_auto]">
                            <div className="relative">
                                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="search"
                                    value={searchKeyword}
                                    onChange={(event) => setSearchKeyword(event.target.value)}
                                    placeholder="Tìm tên, mã hoặc mục tiêu bài học..."
                                    className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs font-semibold text-text-primary outline-none transition focus:border-violet-500 dark:border-white/10 dark:bg-bg-tertiary"
                                />
                            </div>
                            <FilterSelect value={contentTypeFilter} onChange={setContentTypeFilter} label="Loại nội dung">
                                <option value="ALL">Mọi nội dung</option>
                                <option value="LESSON">Bài học</option>
                                <option value="PRACTICE">Bài thực hành</option>
                            </FilterSelect>
                            <FilterSelect value={difficultyFilter} onChange={setDifficultyFilter} label="Độ khó">
                                <option value="ALL">Mọi độ khó</option>
                                <option value="EASY">Dễ</option>
                                <option value="MEDIUM">Trung bình</option>
                                <option value="HARD">Khó</option>
                            </FilterSelect>
                            <FilterSelect value={accessFilter} onChange={setAccessFilter} label="Quyền truy cập">
                                <option value="ALL">Mọi phạm vi</option>
                                <option value="FREE">Miễn phí</option>
                                <option value="ENROLLED">Trong khóa học</option>
                            </FilterSelect>
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-text-tertiary transition hover:border-violet-200 hover:text-violet-700 dark:border-white/10 dark:bg-white/5"
                                title="Đặt lại bộ lọc"
                            >
                                <RefreshCw className="h-4 w-4" />
                                <span className="xl:hidden 2xl:inline">Đặt lại</span>
                            </button>
                        </div>

                        <div className="mt-4 flex flex-col justify-between gap-3 border-t border-slate-100 pt-4 dark:border-white/8 sm:flex-row sm:items-center">
                            <p className="text-xs text-text-tertiary">
                                <strong className="text-text-primary">{numberFormatter.format(filteredLessons.length)}</strong> bài học phù hợp
                            </p>
                            <label className="flex items-center gap-2 text-[11px] font-semibold text-text-tertiary">
                                Hiển thị
                                <select
                                    value={pageSize}
                                    onChange={(event) => {
                                        setPageSize(Number(event.target.value));
                                        setCurrentPage(1);
                                    }}
                                    className="cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 font-bold text-text-primary outline-none dark:border-white/10 dark:bg-bg-tertiary"
                                >
                                    <option value={12}>12</option>
                                    <option value={24}>24</option>
                                    <option value={48}>48</option>
                                </select>
                                mục
                            </label>
                        </div>
                    </article>

                    <article className="min-h-[450px] overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_18px_48px_-38px_rgba(15,23,42,0.45)] dark:border-white/10 dark:bg-bg-secondary">
                        {lessonsLoading ? (
                            <div className="flex min-h-[450px] flex-col items-center justify-center gap-3">
                                <LoaderCircle className="h-7 w-7 animate-spin text-violet-600" />
                                <p className="text-xs font-bold text-text-tertiary">Đang tải nội dung...</p>
                            </div>
                        ) : paginatedLessons.length === 0 ? (
                            <div className="flex min-h-[450px] items-center justify-center">
                                <EmptyState message="Không có bài học phù hợp với phạm vi và bộ lọc hiện tại." />
                            </div>
                        ) : viewMode === 'table' ? (
                            <LessonTable
                                lessons={paginatedLessons}
                                page={safeCurrentPage}
                                pageSize={pageSize}
                                onOpen={openLesson}
                                onDuplicate={(lesson) => void handleDuplicateLesson(lesson)}
                                onDelete={setDeleteTarget}
                            />
                        ) : (
                            <LessonGrid
                                lessons={paginatedLessons}
                                onOpen={openLesson}
                                onDuplicate={(lesson) => void handleDuplicateLesson(lesson)}
                                onDelete={setDeleteTarget}
                            />
                        )}

                        <Pagination
                            currentPage={safeCurrentPage}
                            totalPages={totalPages}
                            totalItems={filteredLessons.length}
                            pageSize={pageSize}
                            onPageChange={setCurrentPage}
                        />
                    </article>
                </div>
            </section>

            {deleteTarget && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Xóa bài học">
                    <div className="w-full max-w-md rounded-[24px] border border-white/50 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#131827]">
                        <div className="flex items-start justify-between gap-4">
                            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
                                <Trash2 className="h-5 w-5" />
                            </span>
                            <button type="button" onClick={() => setDeleteTarget(null)} className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 dark:hover:bg-white/5" aria-label="Đóng">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <h3 className="mt-5 text-lg font-black text-text-primary">Xóa bài học?</h3>
                        <p className="mt-2 text-sm leading-6 text-text-secondary">
                            “{deleteTarget.title}” cùng bài tập và câu hỏi liên quan sẽ bị xóa khỏi chương trình.
                        </p>
                        <div className="mt-6 flex gap-3">
                            <button type="button" onClick={() => setDeleteTarget(null)} className="min-h-11 flex-1 cursor-pointer rounded-xl border border-slate-200 text-sm font-bold text-text-secondary transition hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5">Hủy</button>
                            <button type="button" onClick={() => void handleDeleteLesson()} disabled={deleting} className="inline-flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-rose-600 text-sm font-bold text-white transition hover:bg-rose-700 disabled:opacity-50">
                                {deleting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                Xóa bài học
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isLessonModalOpen && editingLesson && (
                <LessonStudioEditor
                    lesson={editingLesson}
                    onSave={async (updatedLesson) => {
                        const isEdit = Boolean(updatedLesson.id);
                        const effectiveChapterId =
                            updatedLesson.chapterId ||
                            (selectedChapterId !== 'ALL' ? selectedChapterId : currentModuleChapters[0]?.id);
                        if (!effectiveChapterId) {
                            showToast('Hãy chọn chương cho bài học');
                            return;
                        }

                        try {
                            const response = await fetch(
                                isEdit
                                    ? `${API_BASE_URL}/api/admin/lessons/${updatedLesson.id}`
                                    : `${API_BASE_URL}/api/admin/lessons`,
                                {
                                    method: isEdit ? 'PUT' : 'POST',
                                    headers: getAuthHeaders(),
                                    body: JSON.stringify({ ...updatedLesson, chapterId: effectiveChapterId }),
                                }
                            );
                            if (!response.ok) {
                                const body = await response.json();
                                showToast(body.message || 'Không thể lưu bài học');
                                return;
                            }
                            setIsLessonModalOpen(false);
                            showToast(isEdit ? 'Đã cập nhật bài học' : 'Đã tạo bài học mới');
                            await Promise.all([fetchLessons(), fetchTree()]);
                        } catch (error) {
                            console.error('Failed to save lesson:', error);
                            showToast('Lỗi kết nối khi lưu bài học');
                        }
                    }}
                    onClose={() => setIsLessonModalOpen(false)}
                />
            )}
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
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${styles[tone]}`}>
                    <Icon className="h-5 w-5" />
                </span>
            </div>
        </article>
    );
}

function SectionHeader({ icon: Icon, title, description }: { icon: typeof FolderOpen; title: string; description: string }) {
    return (
        <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                <Icon className="h-[18px] w-[18px]" />
            </span>
            <div>
                <h3 className="text-sm font-extrabold text-text-primary">{title}</h3>
                <p className="mt-1 text-[11px] text-text-tertiary">{description}</p>
            </div>
        </div>
    );
}

function FilterSelect({ value, onChange, label, children }: { value: string; onChange: (value: string) => void; label: string; children: React.ReactNode }) {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                aria-label={label}
                className="min-h-11 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2 pl-3 pr-9 text-xs font-bold text-text-secondary outline-none transition focus:border-violet-500 dark:border-white/10 dark:bg-bg-tertiary"
            >
                {children}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        </div>
    );
}

function ViewToggle({ mode, onChange }: { mode: ViewMode; onChange: (mode: ViewMode) => void }) {
    return (
        <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-white/10 dark:bg-bg-tertiary">
            <button type="button" onClick={() => onChange('table')} className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition ${mode === 'table' ? 'bg-white text-violet-700 shadow-sm dark:bg-white/10 dark:text-violet-300' : 'text-slate-400'}`} aria-label="Xem dạng bảng">
                <List className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => onChange('grid')} className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition ${mode === 'grid' ? 'bg-white text-violet-700 shadow-sm dark:bg-white/10 dark:text-violet-300' : 'text-slate-400'}`} aria-label="Xem dạng lưới">
                <Grid2X2 className="h-4 w-4" />
            </button>
        </div>
    );
}

function LessonTable({ lessons, page, pageSize, onOpen, onDuplicate, onDelete }: { lessons: LessonRow[]; page: number; pageSize: number; onOpen: (lesson: LessonRow) => void; onDuplicate: (lesson: LessonRow) => void; onDelete: (lesson: LessonRow) => void }) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-[980px]">
                <thead>
                    <tr>
                        <th className="px-5 py-3.5 text-left">Nội dung</th>
                        <th className="px-5 py-3.5 text-left">Vị trí</th>
                        <th className="px-5 py-3.5 text-center">Học liệu</th>
                        <th className="px-5 py-3.5 text-left">Độ khó</th>
                        <th className="px-5 py-3.5 text-left">Truy cập</th>
                        <th className="px-5 py-3.5 text-left">Cập nhật</th>
                        <th className="px-5 py-3.5 text-right">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {lessons.map((lesson, index) => (
                        <tr key={lesson.id} className="border-t border-slate-100 dark:border-white/5">
                            <td className="px-5 py-4">
                                <button type="button" onClick={() => onOpen(lesson)} className="group flex max-w-sm cursor-pointer items-start gap-3 text-left">
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700 transition group-hover:bg-violet-100 dark:bg-violet-500/10 dark:text-violet-300">
                                        {lesson.lessonId?.includes('.MP') ? <Sparkles className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                                    </span>
                                    <span className="min-w-0">
                                        <span className="block truncate text-xs font-extrabold text-text-primary group-hover:text-violet-700">{lesson.title}</span>
                                        <span className="mt-1 block font-mono text-[10px] font-bold text-violet-600 dark:text-violet-300">
                                            {lesson.lessonId || `#${(page - 1) * pageSize + index + 1}`}
                                        </span>
                                        {lesson.objective && <span className="mt-1 block truncate text-[10px] text-text-tertiary">{lesson.objective}</span>}
                                    </span>
                                </button>
                            </td>
                            <td className="px-5 py-4">
                                <p className="max-w-56 truncate text-xs font-bold text-text-secondary">{lesson.chapter?.module.title || '—'}</p>
                                <p className="mt-1 max-w-56 truncate text-[10px] text-text-tertiary">{lesson.chapter?.title || '—'}</p>
                            </td>
                            <td className="px-5 py-4 text-center">
                                <div className="inline-flex items-center gap-2">
                                    <CountBadge icon={ClipboardCheck} value={lesson._count?.codingExercises ?? 0} label="bài tập" />
                                    <CountBadge icon={CircleHelp} value={lesson._count?.quizQuestions ?? 0} label="câu hỏi" />
                                </div>
                            </td>
                            <td className="px-5 py-4"><DifficultyBadge difficulty={lesson.difficulty} /></td>
                            <td className="px-5 py-4"><AccessBadge isFree={lesson.isFree} /></td>
                            <td className="px-5 py-4 text-[10px] font-medium text-text-tertiary">{lesson.updatedAt ? new Date(lesson.updatedAt).toLocaleDateString('vi-VN') : '—'}</td>
                            <td className="px-5 py-4">
                                <div className="flex justify-end gap-1.5">
                                    <ActionButton label="Chỉnh sửa" onClick={() => onOpen(lesson)}><Pencil className="h-4 w-4" /></ActionButton>
                                    <ActionButton label="Nhân bản" onClick={() => onDuplicate(lesson)}><Copy className="h-4 w-4" /></ActionButton>
                                    <ActionButton label="Xóa" danger onClick={() => onDelete(lesson)}><Trash2 className="h-4 w-4" /></ActionButton>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function LessonGrid({ lessons, onOpen, onDuplicate, onDelete }: { lessons: LessonRow[]; onOpen: (lesson: LessonRow) => void; onDuplicate: (lesson: LessonRow) => void; onDelete: (lesson: LessonRow) => void }) {
    return (
        <div className="grid gap-4 p-4 sm:grid-cols-2 2xl:grid-cols-3">
            {lessons.map((lesson) => (
                <article key={lesson.id} className="group rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition hover:-translate-y-0.5 hover:border-violet-200 hover:bg-white hover:shadow-lg dark:border-white/8 dark:bg-white/[0.025] dark:hover:bg-white/5">
                    <div className="flex items-start justify-between gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                            {lesson.lessonId?.includes('.MP') ? <Sparkles className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                        </span>
                        <div className="flex gap-1">
                            <ActionButton label="Nhân bản" onClick={() => onDuplicate(lesson)}><Copy className="h-4 w-4" /></ActionButton>
                            <ActionButton label="Xóa" danger onClick={() => onDelete(lesson)}><Trash2 className="h-4 w-4" /></ActionButton>
                        </div>
                    </div>
                    <button type="button" onClick={() => onOpen(lesson)} className="mt-4 block w-full cursor-pointer text-left">
                        <p className="font-mono text-[10px] font-bold text-violet-600 dark:text-violet-300">{lesson.lessonId || 'Chưa có mã'}</p>
                        <h4 className="mt-2 line-clamp-2 text-sm font-extrabold leading-5 text-text-primary group-hover:text-violet-700">{lesson.title}</h4>
                        <p className="mt-2 line-clamp-2 min-h-10 text-[11px] leading-5 text-text-tertiary">{lesson.objective || 'Chưa có mô tả mục tiêu bài học.'}</p>
                    </button>
                    <div className="mt-4 flex flex-wrap gap-2">
                        <DifficultyBadge difficulty={lesson.difficulty} />
                        <AccessBadge isFree={lesson.isFree} />
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-slate-200/70 pt-4 text-[10px] text-text-tertiary dark:border-white/8">
                        <span>{lesson._count?.codingExercises ?? 0} bài tập · {lesson._count?.quizQuestions ?? 0} câu hỏi</span>
                        <span>{lesson.updatedAt ? new Date(lesson.updatedAt).toLocaleDateString('vi-VN') : '—'}</span>
                    </div>
                </article>
            ))}
        </div>
    );
}

function CountBadge({ icon: Icon, value, label }: { icon: typeof ClipboardCheck; value: number; label: string }) {
    return (
        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-[9px] font-bold text-slate-600 dark:bg-white/5 dark:text-slate-300" title={label}>
            <Icon className="h-3 w-3" /> {value}
        </span>
    );
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
    const normalized = normalizeDifficulty(difficulty);
    const config = {
        EASY: { label: 'Dễ', className: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300' },
        MEDIUM: { label: 'Trung bình', className: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300' },
        HARD: { label: 'Khó', className: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300' },
    }[normalized];
    return <span className={`inline-flex rounded-full border px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.08em] ${config.className}`}>{config.label}</span>;
}

function AccessBadge({ isFree }: { isFree: boolean }) {
    return isFree
        ? <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.08em] text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-300">Miễn phí</span>
        : <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.08em] text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">Trong khóa</span>;
}

function ActionButton({ label, danger = false, onClick, children }: { label: string; danger?: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border transition focus-visible:outline-none focus-visible:ring-2 ${danger ? 'border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100 focus-visible:ring-rose-500 dark:border-rose-500/15 dark:bg-rose-500/10 dark:text-rose-300' : 'border-slate-200 bg-white text-slate-500 hover:border-violet-200 hover:text-violet-700 focus-visible:ring-violet-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300'}`}
            aria-label={label}
            title={label}
        >
            {children}
        </button>
    );
}

function Pagination({ currentPage, totalPages, totalItems, pageSize, onPageChange }: { currentPage: number; totalPages: number; totalItems: number; pageSize: number; onPageChange: (page: number) => void }) {
    const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalItems);
    const pageNumbers = Array.from({ length: Math.min(totalPages, 5) }, (_, index) => {
        if (totalPages <= 5) return index + 1;
        const first = Math.min(Math.max(currentPage - 2, 1), totalPages - 4);
        return first + index;
    });

    return (
        <div className="flex flex-col justify-between gap-3 border-t border-slate-100 px-5 py-4 dark:border-white/8 sm:flex-row sm:items-center">
            <p className="text-xs text-text-tertiary">Hiển thị <strong className="text-text-primary">{start}–{end}</strong> trong {numberFormatter.format(totalItems)} kết quả</p>
            <div className="flex items-center gap-1.5">
                <button type="button" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)} className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-violet-200 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10" aria-label="Trang trước">
                    <ChevronLeft className="h-4 w-4" />
                </button>
                {pageNumbers.map((page) => (
                    <button type="button" key={page} onClick={() => onPageChange(page)} className={`h-9 min-w-9 cursor-pointer rounded-lg px-2 text-xs font-black transition ${page === currentPage ? 'bg-violet-600 text-white shadow-sm' : 'border border-slate-200 text-text-secondary hover:border-violet-200 hover:text-violet-700 dark:border-white/10'}`}>
                        {page}
                    </button>
                ))}
                <button type="button" disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)} className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-violet-200 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10" aria-label="Trang sau">
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

function EmptyState({ message, compact = false }: { message: string; compact?: boolean }) {
    return (
        <div className={`flex items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-5 text-center text-xs font-semibold text-text-tertiary dark:border-white/10 dark:bg-white/[0.025] ${compact ? 'min-h-32' : 'm-5 min-h-40'}`}>
            {message}
        </div>
    );
}

function normalizeDifficulty(difficulty?: string): 'EASY' | 'MEDIUM' | 'HARD' {
    const value = (difficulty || 'EASY').toUpperCase();
    if (value === 'HARD' || value === 'KHÓ' || value === 'KHO') return 'HARD';
    if (value === 'MEDIUM' || value === 'TRUNG BÌNH' || value === 'TRUNGBINH') return 'MEDIUM';
    return 'EASY';
}
