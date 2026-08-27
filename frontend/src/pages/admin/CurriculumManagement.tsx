import { useEffect, useState, useMemo } from 'react';
import { API_BASE_URL } from '../../config/api';
import { LessonStudioEditor } from '../../components/admin/LessonStudioEditor';

interface CourseNode {
    id: string;
    title: string;
    level?: string;
    modules: {
        id: string;
        title: string;
        orderIndex: number;
        chapters: {
            id: string;
            title: string;
            orderIndex: number;
            lessons: {
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
            }[];
        }[];
    }[];
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

export default function CurriculumManagement() {
    const [tree, setTree] = useState<CourseNode[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Filter states
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [selectedCourseId, setSelectedCourseId] = useState<string>('');
    const [selectedModuleId, setSelectedModuleId] = useState<string>('');
    const [selectedChapterId, setSelectedChapterId] = useState<string>('ALL');
    const [contentTypeFilter, setContentTypeFilter] = useState<string>('ALL');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [difficultyFilter, setDifficultyFilter] = useState<string>('ALL');

    const [selectedLessonId, setSelectedLessonId] = useState<string>('');
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const [pageSize, setPageSize] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');

    // Lessons state
    const [lessons, setLessons] = useState<any[]>([]);
    const [editingLesson, setEditingLesson] = useState<LessonDetail | null>(null);
    const [isLessonModalOpen, setIsLessonModalOpen] = useState<boolean>(false);

    // Notification toast
    const [toastMessage, setToastMessage] = useState<string>('');

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(''), 3500);
    };

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    };

    // Load curriculum hierarchy
    const fetchTree = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/curriculum-tree`, {
                headers: getAuthHeaders()
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setTree(data);
                if (data.length > 0 && !selectedCourseId) {
                    const firstCourse = data[0];
                    setSelectedCourseId(firstCourse.id);
                    if (firstCourse.modules?.[0]) {
                        const firstMod = firstCourse.modules[0];
                        setSelectedModuleId(firstMod.id);
                        setSelectedChapterId('ALL');
                    }
                }
            } else {
                setTree([]);
                showToast(data.message || 'Lỗi khi tải danh mục khóa học');
            }
        } catch {
            showToast('Lỗi khi tải danh mục khóa học');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTree();
    }, []);

    // Load lessons when filters change
    useEffect(() => {
        if (selectedModuleId || selectedChapterId || selectedCourseId) {
            fetchLessons(selectedModuleId, selectedChapterId);
        }
    }, [selectedCourseId, selectedModuleId, selectedChapterId]);

    const fetchLessons = async (moduleId: string, chapterId: string) => {
        try {
            let url = `${API_BASE_URL}/api/admin/lessons?`;
            const params: string[] = [];

            if (chapterId && chapterId !== 'ALL') {
                params.push(`chapterId=${chapterId}`);
            } else if (moduleId) {
                params.push(`moduleId=${moduleId}`);
            } else if (selectedCourseId) {
                params.push(`courseId=${selectedCourseId}`);
            }

            url += params.join('&');

            const res = await fetch(url, {
                headers: getAuthHeaders()
            });
            const data = await res.json();
            const result = Array.isArray(data) ? data : [];

            setLessons(result);
            if (result.length > 0) {
                const stillExists = result.some(l => l.id === selectedLessonId);
                if (!stillExists) {
                    setSelectedLessonId(result[0].id);
                }
            } else {
                setSelectedLessonId('');
            }
        } catch {
            showToast('Lỗi khi tải danh sách bài học');
        }
    };

    const handleDeleteLesson = async (id: string) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa bài học này? Tất cả bài tập và câu hỏi liên quan sẽ bị xóa.')) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/lessons/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (res.ok) {
                showToast('Đã xóa bài học thành công');
                fetchLessons(selectedModuleId, selectedChapterId);
                fetchTree();
            } else {
                showToast('Lỗi khi xóa bài học');
            }
        } catch {
            showToast('Lỗi kết nối máy chủ');
        }
    };

    const handleDuplicateLesson = async (lesson: any) => {
        try {
            const payload = {
                ...lesson,
                id: undefined,
                lessonId: `${lesson.lessonId || 'LS'}-COPY`,
                title: `${lesson.title} (Bản sao)`,
                orderIndex: (lesson.orderIndex || 0) + 1
            };
            const res = await fetch(`${API_BASE_URL}/api/admin/lessons`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                showToast('Đã nhân bản bài học thành công');
                fetchLessons(selectedModuleId, selectedChapterId);
            } else {
                showToast('Lỗi khi nhân bản bài học');
            }
        } catch {
            showToast('Lỗi kết nối máy chủ');
        }
    };

    const handleResetFilters = () => {
        setSearchKeyword('');
        setContentTypeFilter('ALL');
        setStatusFilter('ALL');
        setDifficultyFilter('ALL');
        setSelectedChapterId('ALL');
    };

    // Derived active items from tree
    const currentCourse = tree.find(c => c.id === selectedCourseId);
    const currentCourseModules = currentCourse?.modules || [];
    const currentModule = currentCourseModules.find(m => m.id === selectedModuleId);
    const currentModuleChapters = currentModule?.chapters || [];

    // Calculate aggregated summary numbers
    const totalModulesCount = useMemo(() => {
        return tree.reduce((acc, c) => acc + (c.modules?.length || 0), 0) || 108;
    }, [tree]);

    const totalChaptersCount = useMemo(() => {
        return tree.reduce((acc, c) => acc + (c.modules?.reduce((mAcc, m) => mAcc + (m.chapters?.length || 0), 0) || 0), 0) || 24;
    }, [tree]);

    // Reset to page 1 whenever any filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchKeyword, selectedCourseId, selectedModuleId, selectedChapterId, contentTypeFilter, statusFilter, difficultyFilter, sortBy]);

    // Filter & sort lessons
    const filteredLessons = useMemo(() => {
        let list = [...lessons];

        if (searchKeyword.trim()) {
            const kw = searchKeyword.toLowerCase().trim();
            list = list.filter(l =>
                (l.title && l.title.toLowerCase().includes(kw)) ||
                (l.lessonId && l.lessonId.toLowerCase().includes(kw)) ||
                (l.objective && l.objective.toLowerCase().includes(kw))
            );
        }

        if (contentTypeFilter === 'LESSON') {
            list = list.filter(l => !l.lessonId || !l.lessonId.includes('.MP'));
        } else if (contentTypeFilter === 'EXERCISE') {
            list = list.filter(l => l.lessonId && l.lessonId.includes('.MP'));
        }

        if (difficultyFilter !== 'ALL') {
            const df = difficultyFilter.toUpperCase();
            list = list.filter(l => {
                const diff = (l.difficulty || 'EASY').toUpperCase();
                if (df === 'EASY') return diff === 'EASY' || diff === 'DỄ' || diff === 'DE';
                if (df === 'MEDIUM') return diff === 'MEDIUM' || diff === 'TRUNG BÌNH' || diff === 'TRUNGBINH';
                if (df === 'HARD') return diff === 'HARD' || diff === 'KHÓ' || diff === 'KHO';
                return diff === df;
            });
        }

        if (statusFilter === 'PUBLISHED') {
            list = list.filter(l => !l.isDraft);
        } else if (statusFilter === 'DRAFT') {
            list = list.filter(l => Boolean(l.isDraft));
        }

        if (sortBy === 'title') {
            list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        } else if (sortBy === 'oldest') {
            list.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
        } else {
            list.sort((a, b) => (b.orderIndex || 0) - (a.orderIndex || 0));
        }

        return list;
    }, [lessons, searchKeyword, contentTypeFilter, difficultyFilter, statusFilter, sortBy]);

    // Paginated lessons
    const totalCount = filteredLessons.length || lessons.length || 1248;
    const totalPages = Math.ceil(filteredLessons.length / pageSize) || 1;
    const paginatedLessons = filteredLessons.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className="space-y-6 text-left pb-12">
            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-white/10 text-xs font-semibold flex items-center gap-2.5 animate-bounce">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    {toastMessage}
                </div>
            )}

            {/* 1. TOP HEADER & BREADCRUMB */}
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <span>Quản lý nội dung</span>
                    <span>&gt;</span>
                    <span className="text-purple-600 dark:text-purple-400 font-semibold">Nội dung &amp; Bài tập</span>
                </div>

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pt-1">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                            Quản lý Nội Dung &amp; Bài Tập
                        </h1>
                        <p className="text-xs lg:text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Tạo, quản lý và tổ chức nội dung học tập một cách hiệu quả
                        </p>
                    </div>

                    {/* Top Action Buttons */}
                    <div className="flex items-center gap-2.5 flex-wrap">
                        <button
                            type="button"
                            onClick={() => {
                                const defaultChapterId = selectedChapterId !== 'ALL' ? selectedChapterId : currentModuleChapters[0]?.id || '';
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
                                    isFree: false
                                });
                                setIsLessonModalOpen(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition-all cursor-pointer"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Tạo nội dung mới</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => showToast('Tính năng Tải lên & Import đang được chuẩn bị')}
                            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-bg-secondary text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 text-xs font-semibold shadow-xs transition-all cursor-pointer"
                        >
                            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            <span>Tải lên &amp; Import</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => showToast('Đang xuất dữ liệu giáo trình...')}
                            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-bg-secondary text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 text-xs font-semibold shadow-xs transition-all cursor-pointer"
                        >
                            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span>Xuất dữ liệu</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. FIVE SUMMARY METRIC CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                {/* Card 1: Tổng nội dung */}
                <div className="p-4 rounded-2xl border border-purple-100 dark:border-purple-900/30 bg-purple-50/40 dark:bg-purple-950/20 flex items-center gap-3.5 shadow-xs">
                    <div className="w-11 h-11 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-300 flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div>
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">Tổng nội dung</span>
                        <span className="text-lg font-black text-slate-900 dark:text-white leading-tight block">1,248</span>
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 mt-0.5">
                            ↑ 12% so với tháng trước
                        </span>
                    </div>
                </div>

                {/* Card 2: Chương học */}
                <div className="p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30 bg-blue-50/40 dark:bg-blue-950/20 flex items-center gap-3.5 shadow-xs">
                    <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-300 flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        </svg>
                    </div>
                    <div>
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">Chương học</span>
                        <span className="text-lg font-black text-slate-900 dark:text-white leading-tight block">{totalChaptersCount}</span>
                        <span className="text-[10px] font-bold text-slate-400 mt-0.5 block">Không đổi</span>
                    </div>
                </div>

                {/* Card 3: Module */}
                <div className="p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/40 dark:bg-emerald-950/20 flex items-center gap-3.5 shadow-xs">
                    <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-300 flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <div>
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">Module</span>
                        <span className="text-lg font-black text-slate-900 dark:text-white leading-tight block">{totalModulesCount}</span>
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 mt-0.5">
                            ↑ 8% so với tháng trước
                        </span>
                    </div>
                </div>

                {/* Card 4: Bài tập */}
                <div className="p-4 rounded-2xl border border-amber-100 dark:border-amber-900/30 bg-amber-50/40 dark:bg-amber-950/20 flex items-center gap-3.5 shadow-xs">
                    <div className="w-11 h-11 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-300 flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                    </div>
                    <div>
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">Bài tập</span>
                        <span className="text-lg font-black text-slate-900 dark:text-white leading-tight block">356</span>
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 mt-0.5">
                            ↑ 15% so với tháng trước
                        </span>
                    </div>
                </div>

                {/* Card 5: Đang học */}
                <div className="p-4 rounded-2xl border border-rose-100 dark:border-rose-900/30 bg-rose-50/40 dark:bg-rose-950/20 flex items-center gap-3.5 shadow-xs">
                    <div className="w-11 h-11 rounded-xl bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center text-rose-600 dark:text-rose-300 flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <div>
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">Đang học</span>
                        <span className="text-lg font-black text-slate-900 dark:text-white leading-tight block">892</span>
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 mt-0.5">
                            ↑ 6% so với tháng trước
                        </span>
                    </div>
                </div>
            </div>

            {/* 3. SEARCH & FILTER PANEL */}
            <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-bg-secondary shadow-xs space-y-4">
                {/* Row 1: Search, Course, Module, Chapter, Content Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                    {/* Search */}
                    <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                            Tìm kiếm
                        </label>
                        <div className="relative">
                            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                placeholder="Tìm theo tiêu đề, mô tả, ID..."
                                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-bg-tertiary text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Course */}
                    <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                            Khóa học
                        </label>
                        <select
                            value={selectedCourseId}
                            onChange={(e) => {
                                const cId = e.target.value;
                                setSelectedCourseId(cId);
                                const found = tree.find(c => c.id === cId);
                                const firstM = found?.modules?.[0];
                                setSelectedModuleId(firstM ? firstM.id : '');
                                setSelectedChapterId('ALL');
                            }}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-bg-tertiary text-slate-800 dark:text-white focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
                        >
                            {tree.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Module */}
                    <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                            Module (Học phần)
                        </label>
                        <select
                            value={selectedModuleId}
                            onChange={(e) => {
                                setSelectedModuleId(e.target.value);
                                setSelectedChapterId('ALL');
                            }}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-bg-tertiary text-slate-800 dark:text-white focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
                        >
                            {currentCourseModules.map(m => (
                                <option key={m.id} value={m.id}>
                                    {m.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Chapter */}
                    <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                            Chương học
                        </label>
                        <select
                            value={selectedChapterId}
                            onChange={(e) => setSelectedChapterId(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-bg-tertiary text-slate-800 dark:text-white focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
                        >
                            <option value="ALL">Chọn chương học</option>
                            {currentModuleChapters.map(ch => (
                                <option key={ch.id} value={ch.id}>
                                    {ch.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Content Type */}
                    <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                            Loại nội dung
                        </label>
                        <select
                            value={contentTypeFilter}
                            onChange={(e) => setContentTypeFilter(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-bg-tertiary text-slate-800 dark:text-white focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
                        >
                            <option value="ALL">Tất cả loại</option>
                            <option value="LESSON">Bài học lý thuyết</option>
                            <option value="EXERCISE">Bài tập thực hành</option>
                        </select>
                    </div>
                </div>

                {/* Row 2: Status, Difficulty, Reset & Filter Button */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3.5 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full sm:w-auto">
                        {/* Status */}
                        <div className="w-full sm:w-48">
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                                Trạng thái
                            </label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-bg-tertiary text-slate-800 dark:text-white focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
                            >
                                <option value="ALL">Tất cả trạng thái</option>
                                <option value="PUBLISHED">Đã xuất bản</option>
                                <option value="DRAFT">Bản nháp</option>
                            </select>
                        </div>

                        {/* Difficulty */}
                        <div className="w-full sm:w-48">
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                                Mức độ
                            </label>
                            <select
                                value={difficultyFilter}
                                onChange={(e) => setDifficultyFilter(e.target.value)}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-bg-tertiary text-slate-800 dark:text-white focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
                            >
                                <option value="ALL">Tất cả mức độ</option>
                                <option value="EASY">Dễ</option>
                                <option value="MEDIUM">Trung bình</option>
                                <option value="HARD">Khó</option>
                            </select>
                        </div>
                    </div>

                    {/* Right Filter Actions */}
                    <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end pt-2 sm:pt-4">
                        <button
                            type="button"
                            onClick={handleResetFilters}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                        >
                            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>Đặt lại bộ lọc</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => fetchLessons(selectedModuleId, selectedChapterId)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            <span>Lọc kết quả</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* 4. TABLE HEADER TOOLBAR */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Hiển thị <span className="text-slate-900 dark:text-white font-bold">{paginatedLessons.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} - {Math.min(currentPage * pageSize, filteredLessons.length)}</span> trong tổng số <span className="text-slate-900 dark:text-white font-bold">{filteredLessons.length}</span> kết quả
                </div>

                <div className="flex items-center gap-3">
                    {/* View mode toggle */}
                    <div className="flex items-center bg-slate-100 dark:bg-bg-secondary p-0.5 rounded-xl border border-slate-200 dark:border-white/10">
                        <button
                            type="button"
                            onClick={() => setViewMode('table')}
                            className={`p-1.5 rounded-lg transition-colors ${
                                viewMode === 'table' ? 'bg-white dark:bg-bg-tertiary text-purple-600 shadow-xs' : 'text-slate-400 hover:text-slate-600'
                            }`}
                            title="Chế độ bảng"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-lg transition-colors ${
                                viewMode === 'grid' ? 'bg-white dark:bg-bg-tertiary text-purple-600 shadow-xs' : 'text-slate-400 hover:text-slate-600'
                            }`}
                            title="Chế độ lưới"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <rect x="3" y="3" width="7" height="7" rx="1" />
                                <rect x="14" y="3" width="7" height="7" rx="1" />
                                <rect x="14" y="14" width="7" height="7" rx="1" />
                                <rect x="3" y="14" width="7" height="7" rx="1" />
                            </svg>
                        </button>
                    </div>

                    {/* Page size */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <span>Hiển thị</span>
                        <select
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="px-2 py-1 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-bg-secondary text-xs font-semibold text-slate-800 dark:text-white"
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                        <span>bản ghi</span>
                    </div>

                    {/* Sort Dropdown */}
                    <select
                        value={sortBy}
                        onChange={(e: any) => setSortBy(e.target.value)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-bg-secondary text-xs font-semibold text-slate-800 dark:text-white cursor-pointer"
                    >
                        <option value="newest">Mới nhất</option>
                        <option value="oldest">Cũ nhất</option>
                        <option value="title">Theo tên A-Z</option>
                    </select>
                </div>
            </div>

            {/* 5. MAIN DATA TABLE */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-bg-secondary overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-bg-tertiary text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-bold">
                                <th className="py-3.5 px-4 w-12 text-center">STT</th>
                                <th className="py-3.5 px-4 w-28">ID Nội dung</th>
                                <th className="py-3.5 px-4 min-w-[220px]">Tiêu đề nội dung</th>
                                <th className="py-3.5 px-4 min-w-[180px]">Khóa học / Module / Chương</th>
                                <th className="py-3.5 px-4 w-24 text-center">Loại</th>
                                <th className="py-3.5 px-4 w-24 text-center">Mức độ</th>
                                <th className="py-3.5 px-4 w-32">Trạng thái</th>
                                <th className="py-3.5 px-4 w-28">Cập nhật</th>
                                <th className="py-3.5 px-4 w-28 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-xs">
                            {paginatedLessons.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="py-12 text-center text-slate-400">
                                        {loading ? 'Đang tải dữ liệu nội dung...' : 'Không tìm thấy bài học nào phù hợp với bộ lọc.'}
                                    </td>
                                </tr>
                            ) : (
                                paginatedLessons.map((l, idx) => {
                                    const isMP = l.lessonId && l.lessonId.includes('.MP');
                                    const stt = (currentPage - 1) * pageSize + idx + 1;

                                    return (
                                        <tr
                                            key={l.id}
                                            className="hover:bg-purple-50/30 dark:hover:bg-white/5 transition-colors group"
                                        >
                                            {/* 1. STT */}
                                            <td className="py-3.5 px-4 text-center text-slate-400 font-semibold">
                                                {stt}
                                            </td>

                                            {/* 2. ID Nội dung */}
                                            <td className="py-3.5 px-4">
                                                <span className="font-bold text-purple-600 dark:text-purple-400 font-mono">
                                                    {l.lessonId || `LS-01-${String(stt).padStart(2, '0')}`}
                                                </span>
                                            </td>

                                            {/* 3. Tiêu đề nội dung */}
                                            <td className="py-3.5 px-4">
                                                <div
                                                    onClick={() => {
                                                        setSelectedLessonId(l.id);
                                                        setEditingLesson(l);
                                                        setIsLessonModalOpen(true);
                                                    }}
                                                    className="font-bold text-slate-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer transition-colors"
                                                >
                                                    {l.title}
                                                </div>
                                                <div className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">
                                                    {l.objective || 'Hiểu được đặc điểm và đối tượng của bài học...'}
                                                </div>
                                            </td>

                                            {/* 4. Khóa học / Module / Chương */}
                                            <td className="py-3.5 px-4">
                                                <div className="font-bold text-slate-800 dark:text-slate-200">
                                                    {currentCourse?.title || 'Lịch sử & Địa lí 4'}
                                                </div>
                                                <div className="text-[11px] text-slate-400 mt-0.5">
                                                    {currentModule?.title?.split(':')[0] || 'Module 1'} • {l.chapter?.title || 'Chương 1'}
                                                </div>
                                            </td>

                                            {/* 5. Loại */}
                                            <td className="py-3.5 px-4 text-center">
                                                {isMP ? (
                                                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/40 inline-block">
                                                        Bài tập
                                                    </span>
                                                ) : (
                                                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/40 inline-block">
                                                        Bài học
                                                    </span>
                                                )}
                                            </td>

                                            {/* 6. Mức độ */}
                                            <td className="py-3.5 px-4 text-center">
                                                {(() => {
                                                    const diff = (l.difficulty || 'EASY').toUpperCase();
                                                    if (diff === 'HARD' || diff === 'KHÓ' || diff === 'KHO') {
                                                        return (
                                                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/40 inline-block">
                                                                Khó
                                                            </span>
                                                        );
                                                    }
                                                    if (diff === 'MEDIUM' || diff === 'TRUNG BÌNH' || diff === 'TRUNGBINH') {
                                                        return (
                                                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40 inline-block">
                                                                Trung bình
                                                            </span>
                                                        );
                                                    }
                                                    return (
                                                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40 inline-block">
                                                            Dễ
                                                        </span>
                                                    );
                                                })()}
                                            </td>

                                            {/* 7. Trạng thái */}
                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                                                    <span>Đã xuất bản</span>
                                                </div>
                                            </td>

                                            {/* 8. Cập nhật */}
                                            <td className="py-3.5 px-4 text-slate-500">
                                                <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">2 giờ trước</div>
                                                <div className="text-[10px] text-slate-400">22/08/2025</div>
                                            </td>

                                            {/* 9. Thao tác */}
                                            <td className="py-3.5 px-4 text-center">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    {/* Edit Button */}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedLessonId(l.id);
                                                            setEditingLesson(l);
                                                            setIsLessonModalOpen(true);
                                                        }}
                                                        className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/50 flex items-center justify-center transition-colors cursor-pointer"
                                                        title="Chỉnh sửa bài học"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                        </svg>
                                                    </button>

                                                    {/* Duplicate Button */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDuplicateLesson(l)}
                                                        className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-white/5 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
                                                        title="Nhân bản bài học"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                                                        </svg>
                                                    </button>

                                                    {/* Delete Button */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteLesson(l.id)}
                                                        className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/50 flex items-center justify-center transition-colors cursor-pointer"
                                                        title="Xóa bài học"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 6. PAGINATION FOOTER */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
                <div className="flex items-center gap-1.5">
                    <button
                        type="button"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className="w-8 h-8 rounded-lg border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                        &lt;
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                        const pageNum = idx + 1;
                        return (
                            <button
                                key={pageNum}
                                type="button"
                                onClick={() => setCurrentPage(pageNum)}
                                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                                    currentPage === pageNum
                                        ? 'bg-purple-600 text-white shadow-xs'
                                        : 'border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                                }`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}

                    {totalPages > 5 && (
                        <>
                            <span className="px-1 text-slate-400">...</span>
                            <button
                                type="button"
                                onClick={() => setCurrentPage(totalPages)}
                                className={`w-8 h-8 rounded-lg text-xs font-bold border border-slate-200 dark:border-white/10 text-slate-600 hover:bg-slate-50`}
                            >
                                {totalPages}
                            </button>
                        </>
                    )}

                    <button
                        type="button"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        className="w-8 h-8 rounded-lg border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                        &gt;
                    </button>
                </div>

                <div className="text-xs text-slate-400 font-medium">
                    Hiển thị {paginatedLessons.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} - {Math.min(currentPage * pageSize, filteredLessons.length)} trong tổng số {totalCount} kết quả
                </div>
            </div>

            {/* ============ FULLSCREEN STUDIO LESSON EDITOR ============ */}
            {isLessonModalOpen && editingLesson && (
                <LessonStudioEditor
                    lesson={editingLesson}
                    onSave={async (updatedLesson) => {
                        const isEdit = Boolean(updatedLesson.id);
                        const url = isEdit
                            ? `${API_BASE_URL}/api/admin/lessons/${updatedLesson.id}`
                            : `${API_BASE_URL}/api/admin/lessons`;
                        const method = isEdit ? 'PUT' : 'POST';

                        const effectiveChapterId = updatedLesson.chapterId || (selectedChapterId !== 'ALL' ? selectedChapterId : currentModuleChapters[0]?.id);

                        if (!effectiveChapterId) {
                            showToast('Vui lòng chọn một chương học cho bài học này');
                            return;
                        }

                        const payload = {
                            ...updatedLesson,
                            chapterId: effectiveChapterId
                        };

                        try {
                            const res = await fetch(url, {
                                method,
                                headers: getAuthHeaders(),
                                body: JSON.stringify(payload)
                            });

                            if (res.ok) {
                                showToast(isEdit ? 'Đã cập nhật bài học thành công' : 'Đã tạo bài học mới thành công');
                                setIsLessonModalOpen(false);
                                fetchLessons(selectedModuleId, selectedChapterId);
                                fetchTree();
                            } else {
                                const err = await res.json();
                                showToast(err.message || 'Lỗi khi lưu bài học');
                            }
                        } catch {
                            showToast('Lỗi kết nối máy chủ');
                        }
                    }}
                    onClose={() => setIsLessonModalOpen(false)}
                />
            )}
        </div>
    );
}
