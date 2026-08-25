import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../config/api';

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

interface CodingExercise {
    id: string;
    lessonId: string;
    title: string;
    difficulty: string;
    problemDescription: string;
    starterCode: string;
    solutionCode: string;
    testCases: TestCase[];
    _count?: { submissions: number };
}

interface TestCase {
    id: string;
    exerciseId: string;
    input: string;
    expectedOutput: string;
    isHidden: boolean;
}

interface QuizOption {
    id?: string;
    key: string;
    text: string;
    isCorrect: boolean;
}

interface QuizQuestion {
    id: string;
    lessonId: string;
    question: string;
    explanation: string;
    level: string;
    orderIndex: number;
    options: QuizOption[];
}

export default function CurriculumManagement() {
    const [activeTab, setActiveTab] = useState<'lessons' | 'exercises' | 'quizzes'>('lessons');
    const [tree, setTree] = useState<CourseNode[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Selected hierarchy state
    const [selectedCourseId, setSelectedCourseId] = useState<string>('');
    const [selectedChapterId, setSelectedChapterId] = useState<string>('');
    const [selectedLessonId, setSelectedLessonId] = useState<string>('');

    // Lessons state
    const [lessons, setLessons] = useState<any[]>([]);
    const [editingLesson, setEditingLesson] = useState<LessonDetail | null>(null);
    const [isLessonModalOpen, setIsLessonModalOpen] = useState<boolean>(false);

    // Exercises state
    const [exercises, setExercises] = useState<CodingExercise[]>([]);
    const [editingExercise, setEditingExercise] = useState<any>(null);
    const [isExerciseModalOpen, setIsExerciseModalOpen] = useState<boolean>(false);

    // Test cases state
    const [selectedExerciseForTC, setSelectedExerciseForTC] = useState<CodingExercise | null>(null);
    const [editingTC, setEditingTC] = useState<any>(null);
    const [isTCModalOpen, setIsTCModalOpen] = useState<boolean>(false);

    // Quizzes state
    const [quizzes, setQuizzes] = useState<QuizQuestion[]>([]);
    const [editingQuiz, setEditingQuiz] = useState<any>(null);
    const [isQuizModalOpen, setIsQuizModalOpen] = useState<boolean>(false);

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
                    setSelectedCourseId(data[0].id);
                    if (data[0].modules?.[0]?.chapters?.[0]) {
                        setSelectedChapterId(data[0].modules[0].chapters[0].id);
                        if (data[0].modules[0].chapters[0].lessons?.[0]) {
                            setSelectedLessonId(data[0].modules[0].chapters[0].lessons[0].id);
                        }
                    }
                }
            } else {
                setTree([]);
                showToast(data.message || 'Lỗi khi tải danh mục khóa học');
            }
        } catch (err: any) {
            showToast('Lỗi khi tải danh mục khóa học');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTree();
    }, []);

    // Load lessons when chapter changes
    useEffect(() => {
        if (selectedChapterId) {
            fetchLessons(selectedChapterId);
        }
    }, [selectedChapterId]);

    // Load exercises and quizzes when lesson changes
    useEffect(() => {
        if (selectedLessonId) {
            fetchExercises(selectedLessonId);
            fetchQuizzes(selectedLessonId);
        }
    }, [selectedLessonId]);

    const fetchLessons = async (chapterId: string) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/lessons?chapterId=${chapterId}`, {
                headers: getAuthHeaders()
            });
            const data = await res.json();
            setLessons(data);
            if (data.length > 0 && !selectedLessonId) {
                setSelectedLessonId(data[0].id);
            }
        } catch (err: any) {
            showToast('Lỗi khi tải danh sách bài học');
        }
    };

    const fetchExercises = async (lessonId: string) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/exercises?lessonId=${lessonId}`, {
                headers: getAuthHeaders()
            });
            const data = await res.json();
            setExercises(data);
            if (data.length > 0) {
                setSelectedExerciseForTC(data[0]);
            } else {
                setSelectedExerciseForTC(null);
            }
        } catch (err: any) {
            showToast('Lỗi khi tải bài tập tự luận');
        }
    };

    const fetchQuizzes = async (lessonId: string) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/quizzes?lessonId=${lessonId}`, {
                headers: getAuthHeaders()
            });
            const data = await res.json();
            setQuizzes(data);
        } catch (err: any) {
            showToast('Lỗi khi tải câu hỏi trắc nghiệm');
        }
    };

    // ============ LESSON ACTIONS ============
    const handleSaveLesson = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingLesson) return;

        try {
            const isEdit = Boolean(editingLesson.id);
            const url = isEdit
                ? `${API_BASE_URL}/api/admin/lessons/${editingLesson.id}`
                : `${API_BASE_URL}/api/admin/lessons`;
            const method = isEdit ? 'PUT' : 'POST';

            const payload = {
                ...editingLesson,
                chapterId: selectedChapterId
            };

            const res = await fetch(url, {
                method,
                headers: getAuthHeaders(),
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                showToast(isEdit ? 'Đã cập nhật bài học thành công' : 'Đã tạo bài học mới thành công');
                setIsLessonModalOpen(false);
                fetchLessons(selectedChapterId);
                fetchTree();
            } else {
                const err = await res.json();
                showToast(err.message || 'Lỗi khi lưu bài học');
            }
        } catch (err: any) {
            showToast('Lỗi kết nối máy chủ');
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
                fetchLessons(selectedChapterId);
                fetchTree();
            } else {
                showToast('Lỗi khi xóa bài học');
            }
        } catch (err: any) {
            showToast('Lỗi kết nối máy chủ');
        }
    };

    // ============ CODING EXERCISE ACTIONS ============
    const handleSaveExercise = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingExercise) return;

        try {
            const isEdit = Boolean(editingExercise.id);
            const url = isEdit
                ? `${API_BASE_URL}/api/admin/exercises/${editingExercise.id}`
                : `${API_BASE_URL}/api/admin/exercises`;
            const method = isEdit ? 'PUT' : 'POST';

            const payload = {
                ...editingExercise,
                lessonId: selectedLessonId
            };

            const res = await fetch(url, {
                method,
                headers: getAuthHeaders(),
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                showToast(isEdit ? 'Đã cập nhật bài tập thành công' : 'Đã tạo bài tập mới thành công');
                setIsExerciseModalOpen(false);
                fetchExercises(selectedLessonId);
            } else {
                const err = await res.json();
                showToast(err.message || 'Lỗi khi lưu bài tập');
            }
        } catch (err: any) {
            showToast('Lỗi kết nối máy chủ');
        }
    };

    const handleDeleteExercise = async (id: string) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa bài tập này?')) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/exercises/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (res.ok) {
                showToast('Đã xóa bài tập thành công');
                fetchExercises(selectedLessonId);
            } else {
                showToast('Lỗi khi xóa bài tập');
            }
        } catch (err: any) {
            showToast('Lỗi kết nối máy chủ');
        }
    };

    // ============ TEST CASE ACTIONS ============
    const handleSaveTestCase = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTC || !selectedExerciseForTC) return;

        try {
            const isEdit = Boolean(editingTC.id);
            const url = isEdit
                ? `${API_BASE_URL}/api/admin/testcases/${editingTC.id}`
                : `${API_BASE_URL}/api/admin/testcases`;
            const method = isEdit ? 'PUT' : 'POST';

            const payload = {
                ...editingTC,
                exerciseId: selectedExerciseForTC.id
            };

            const res = await fetch(url, {
                method,
                headers: getAuthHeaders(),
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                showToast(isEdit ? 'Đã cập nhật Test Case thành công' : 'Đã tạo Test Case mới thành công');
                setIsTCModalOpen(false);
                fetchExercises(selectedLessonId);
            } else {
                const err = await res.json();
                showToast(err.message || 'Lỗi khi lưu Test Case');
            }
        } catch (err: any) {
            showToast('Lỗi kết nối máy chủ');
        }
    };

    const handleDeleteTestCase = async (id: string) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa Test Case này?')) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/testcases/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (res.ok) {
                showToast('Đã xóa Test Case thành công');
                fetchExercises(selectedLessonId);
            } else {
                showToast('Lỗi khi xóa Test Case');
            }
        } catch (err: any) {
            showToast('Lỗi kết nối máy chủ');
        }
    };

    // ============ QUIZ ACTIONS ============
    const handleSaveQuiz = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingQuiz) return;

        try {
            const isEdit = Boolean(editingQuiz.id);
            const url = isEdit
                ? `${API_BASE_URL}/api/admin/quizzes/${editingQuiz.id}`
                : `${API_BASE_URL}/api/admin/quizzes`;
            const method = isEdit ? 'PUT' : 'POST';

            const payload = {
                ...editingQuiz,
                lessonId: selectedLessonId
            };

            const res = await fetch(url, {
                method,
                headers: getAuthHeaders(),
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                showToast(isEdit ? 'Đã cập nhật câu hỏi trắc nghiệm thành công' : 'Đã tạo câu hỏi mới thành công');
                setIsQuizModalOpen(false);
                fetchQuizzes(selectedLessonId);
            } else {
                const err = await res.json();
                showToast(err.message || 'Lỗi khi lưu câu hỏi');
            }
        } catch (err: any) {
            showToast('Lỗi kết nối máy chủ');
        }
    };

    const handleDeleteQuiz = async (id: string) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa câu hỏi trắc nghiệm này?')) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/quizzes/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (res.ok) {
                showToast('Đã xóa câu hỏi thành công');
                fetchQuizzes(selectedLessonId);
            } else {
                showToast('Lỗi khi xóa câu hỏi');
            }
        } catch (err: any) {
            showToast('Lỗi kết nối máy chủ');
        }
    };

    const currentCourse = tree.find(c => c.id === selectedCourseId);
    const allChapters = currentCourse?.modules.flatMap(m => m.chapters) || [];
    const currentChapter = allChapters.find(ch => ch.id === selectedChapterId);
    const currentLesson = lessons.find(l => l.id === selectedLessonId);

    return (
        <div className="space-y-6 text-left">
            {/* Header Title */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-bg-secondary p-6 rounded-2xl border border-border-custom shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary tracking-tight">
                        Quản Lý Nội Dung & Bài Tập
                    </h1>
                    <p className="text-sm text-text-secondary mt-1">
                        {loading ? 'Đang đồng bộ dữ liệu khóa học...' : 'Hệ thống biên soạn bài học, bài tập tự luận, quản lý test cases và câu hỏi trắc nghiệm.'}
                    </p>
                </div>

                {/* Main Tabs */}
                <div className="flex items-center bg-bg-tertiary p-1 rounded-xl border border-border-custom">
                    <button
                        onClick={() => setActiveTab('lessons')}
                        className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                            activeTab === 'lessons'
                                ? 'bg-accent-custom text-white shadow-sm'
                                : 'text-text-secondary hover:text-text-primary'
                        }`}
                    >
                        Bài Học & Lý Thuyết
                    </button>
                    <button
                        onClick={() => setActiveTab('exercises')}
                        className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                            activeTab === 'exercises'
                                ? 'bg-accent-custom text-white shadow-sm'
                                : 'text-text-secondary hover:text-text-primary'
                        }`}
                    >
                        Bài Tập Tự Luận & Test Cases
                    </button>
                    <button
                        onClick={() => setActiveTab('quizzes')}
                        className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                            activeTab === 'quizzes'
                                ? 'bg-accent-custom text-white shadow-sm'
                                : 'text-text-secondary hover:text-text-primary'
                        }`}
                    >
                        Trắc Nghiệm (Quizzes)
                    </button>
                </div>
            </div>

            {/* Filter Hierarchy Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-bg-secondary p-4 rounded-xl border border-border-custom">
                {/* Course Select */}
                <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                        Khóa học
                    </label>
                    <select
                        value={selectedCourseId}
                        onChange={(e) => {
                            const cId = e.target.value;
                            setSelectedCourseId(cId);
                            const foundCourse = tree.find(c => c.id === cId);
                            const firstChapter = foundCourse?.modules[0]?.chapters[0];
                            if (firstChapter) {
                                setSelectedChapterId(firstChapter.id);
                            } else {
                                setSelectedChapterId('');
                                setSelectedLessonId('');
                            }
                        }}
                        className="w-full bg-bg-tertiary border border-border-custom rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-custom"
                    >
                        {tree.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.title} {c.level ? `(${c.level})` : ''}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Chapter Select */}
                <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                        Chương học
                    </label>
                    <select
                        value={selectedChapterId}
                        onChange={(e) => setSelectedChapterId(e.target.value)}
                        className="w-full bg-bg-tertiary border border-border-custom rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-custom"
                    >
                        {allChapters.map(ch => (
                            <option key={ch.id} value={ch.id}>
                                {ch.title}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Lesson Select */}
                <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                        Bài học đang chọn
                    </label>
                    <select
                        value={selectedLessonId}
                        onChange={(e) => setSelectedLessonId(e.target.value)}
                        className="w-full bg-bg-tertiary border border-border-custom rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-custom"
                    >
                        {lessons.map(l => (
                            <option key={l.id} value={l.id}>
                                {l.lessonId ? `[${l.lessonId}] ` : ''}{l.title}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* TAB 1: LESSONS MANAGEMENT */}
            {activeTab === 'lessons' && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="text-sm font-semibold text-text-secondary">
                            Danh sách bài học trong chương: <span className="text-text-primary">{currentChapter?.title || 'Chưa chọn'}</span>
                        </div>
                        <button
                            onClick={() => {
                                setEditingLesson({
                                    id: '',
                                    chapterId: selectedChapterId,
                                    lessonId: `LS-${Date.now().toString().slice(-6)}`,
                                    title: '',
                                    difficulty: 'EASY',
                                    durationMinutes: 10,
                                    content: '# 1. Lý thuyết cốt lõi\n\nNội dung lý thuyết...\n\n# 2. Cú pháp & Code mẫu\n\n```python\nprint("Hello")\n```',
                                    objective: '',
                                    keyKnowledge: '',
                                    orderIndex: lessons.length + 1,
                                    isFree: false
                                });
                                setIsLessonModalOpen(true);
                            }}
                            className="bg-accent-custom hover:bg-accent-hover text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
                        >
                            Tạo Bài Học Mới
                        </button>
                    </div>

                    <div className="bg-bg-secondary rounded-2xl border border-border-custom overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-border-custom bg-bg-tertiary text-text-secondary text-xs uppercase tracking-wider">
                                        <th className="p-4 font-semibold">STT</th>
                                        <th className="p-4 font-semibold">Mã Bài</th>
                                        <th className="p-4 font-semibold">Tiêu Đề Bài Học</th>
                                        <th className="p-4 font-semibold">Độ Khó</th>
                                        <th className="p-4 font-semibold">Thời Lượng</th>
                                        <th className="p-4 font-semibold">Bài Tập / Quiz</th>
                                        <th className="p-4 font-semibold text-right">Thao Tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-custom text-sm">
                                    {lessons.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="p-8 text-center text-text-secondary">
                                                Chưa có bài học nào trong chương này.
                                            </td>
                                        </tr>
                                    ) : (
                                        lessons.map((l, idx) => (
                                            <tr
                                                key={l.id}
                                                className={`hover:bg-bg-tertiary/50 transition-colors ${
                                                    selectedLessonId === l.id ? 'bg-accent-custom/5 font-medium' : ''
                                                }`}
                                            >
                                                <td className="p-4 text-text-secondary">{l.orderIndex || idx + 1}</td>
                                                <td className="p-4 font-mono text-xs text-accent-custom font-bold">
                                                    {l.lessonId || 'N/A'}
                                                </td>
                                                <td className="p-4 text-text-primary">
                                                    <div className="font-semibold">{l.title}</div>
                                                    <div className="text-xs text-text-secondary truncate max-w-md">
                                                        {l.objective || 'Chưa có mục tiêu'}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`text-[11px] px-2 py-0.5 rounded font-semibold border ${
                                                        l.difficulty === 'EASY'
                                                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                                            : l.difficulty === 'MEDIUM'
                                                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                                                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                                                    }`}>
                                                        {l.difficulty || 'EASY'}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-text-secondary">{l.durationMinutes || 10} phút</td>
                                                <td className="p-4 text-xs text-text-secondary font-mono">
                                                    {l._count?.codingExercises || 0} bài tập / {l._count?.quizQuestions || 0} quiz
                                                </td>
                                                <td className="p-4 text-right space-x-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedLessonId(l.id);
                                                            setEditingLesson(l);
                                                            setIsLessonModalOpen(true);
                                                        }}
                                                        className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border-custom hover:bg-bg-tertiary text-text-primary transition-colors"
                                                    >
                                                        Chỉnh Sửa
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteLesson(l.id)}
                                                        className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors"
                                                    >
                                                        Xóa
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: CODING EXERCISES & TEST CASES MANAGEMENT */}
            {activeTab === 'exercises' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column: Exercises List (5 cols) */}
                    <div className="lg:col-span-5 space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-sm font-semibold text-text-primary">
                                Danh Sách Bài Tập ({exercises.length})
                            </h2>
                            <button
                                onClick={() => {
                                    setEditingExercise({
                                        id: '',
                                        lessonId: selectedLessonId,
                                        title: '',
                                        difficulty: 'EASY',
                                        problemDescription: 'Mô tả bài toán ở đây...',
                                        starterCode: '# Viết code của bạn ở đây\n',
                                        solutionCode: 'print("Hello, World!")'
                                    });
                                    setIsExerciseModalOpen(true);
                                }}
                                className="bg-accent-custom hover:bg-accent-hover text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                            >
                                Thêm Bài Tập
                            </button>
                        </div>

                        <div className="space-y-3">
                            {exercises.length === 0 ? (
                                <div className="p-8 text-center text-text-secondary bg-bg-secondary rounded-2xl border border-border-custom">
                                    Bài học này chưa có bài tập tự luận nào.
                                </div>
                            ) : (
                                exercises.map(ex => (
                                    <div
                                        key={ex.id}
                                        onClick={() => setSelectedExerciseForTC(ex)}
                                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                                            selectedExerciseForTC?.id === ex.id
                                                ? 'bg-bg-secondary border-accent-custom shadow-md'
                                                : 'bg-bg-secondary border-border-custom hover:border-accent-border'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="font-semibold text-sm text-text-primary">
                                                {ex.title}
                                            </div>
                                            <span className={`text-[10px] px-2 py-0.5 rounded font-semibold border ${
                                                ex.difficulty === 'EASY'
                                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                                    : ex.difficulty === 'MEDIUM'
                                                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                                                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                                            }`}>
                                                {ex.difficulty}
                                            </span>
                                        </div>

                                        <p className="text-xs text-text-secondary mt-1.5 line-clamp-2">
                                            {ex.problemDescription}
                                        </p>

                                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-border-custom text-xs">
                                            <span className="text-text-secondary font-mono">
                                                {ex.testCases?.length || 0} Test Cases
                                            </span>
                                            <div className="space-x-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditingExercise(ex);
                                                        setIsExerciseModalOpen(true);
                                                    }}
                                                    className="px-2.5 py-1 rounded border border-border-custom hover:bg-bg-tertiary text-text-primary text-xs font-semibold"
                                                >
                                                    Sửa Đề
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteExercise(ex.id);
                                                    }}
                                                    className="px-2.5 py-1 rounded border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 text-xs font-semibold"
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right Column: Test Cases Management for selected exercise (7 cols) */}
                    <div className="lg:col-span-7 space-y-4">
                        {selectedExerciseForTC ? (
                            <>
                                <div className="flex justify-between items-center bg-bg-secondary p-4 rounded-xl border border-border-custom">
                                    <div>
                                        <div className="text-xs text-text-secondary uppercase tracking-wider font-semibold">
                                            Test Cases Của Bài Tập
                                        </div>
                                        <div className="text-sm font-bold text-text-primary mt-0.5">
                                            {selectedExerciseForTC.title}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setEditingTC({
                                                id: '',
                                                exerciseId: selectedExerciseForTC.id,
                                                input: '',
                                                expectedOutput: '',
                                                isHidden: false
                                            });
                                            setIsTCModalOpen(true);
                                        }}
                                        className="bg-accent-custom hover:bg-accent-hover text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                                    >
                                        Thêm Test Case
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {selectedExerciseForTC.testCases?.length === 0 ? (
                                        <div className="p-8 text-center text-text-secondary bg-bg-secondary rounded-2xl border border-border-custom">
                                            Bài tập này chưa có Test Case nào. Vui lòng bấm Thêm Test Case.
                                        </div>
                                    ) : (
                                        selectedExerciseForTC.testCases?.map((tc, index) => (
                                            <div
                                                key={tc.id}
                                                className="bg-bg-secondary p-4 rounded-xl border border-border-custom space-y-3"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold text-text-primary">
                                                            Test Case #{index + 1}
                                                        </span>
                                                        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold border ${
                                                            tc.isHidden
                                                                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                                                                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                                        }`}>
                                                            {tc.isHidden ? 'Test Ẩn' : 'Test Công Khai'}
                                                        </span>
                                                    </div>
                                                    <div className="space-x-2">
                                                        <button
                                                            onClick={() => {
                                                                setEditingTC(tc);
                                                                setIsTCModalOpen(true);
                                                            }}
                                                            className="text-xs font-semibold px-2.5 py-1 rounded border border-border-custom hover:bg-bg-tertiary text-text-primary"
                                                        >
                                                            Chỉnh Sửa
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteTestCase(tc.id)}
                                                            className="text-xs font-semibold px-2.5 py-1 rounded border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"
                                                        >
                                                            Xóa
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                                    <div>
                                                        <span className="text-text-secondary font-semibold block mb-1">
                                                            Đầu vào (Input / Stdin):
                                                        </span>
                                                        <pre className="bg-bg-tertiary p-2.5 rounded-lg border border-border-custom font-mono text-text-primary whitespace-pre-wrap max-h-28 overflow-y-auto">
                                                            {tc.input ? tc.input : '<Không có input>'}
                                                        </pre>
                                                    </div>
                                                    <div>
                                                        <span className="text-text-secondary font-semibold block mb-1">
                                                            Kết quả mong đợi (Expected Output):
                                                        </span>
                                                        <pre className="bg-bg-tertiary p-2.5 rounded-lg border border-border-custom font-mono text-text-primary whitespace-pre-wrap max-h-28 overflow-y-auto">
                                                            {tc.expectedOutput}
                                                        </pre>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="p-12 text-center text-text-secondary bg-bg-secondary rounded-2xl border border-border-custom">
                                Hãy chọn một bài tập ở cột bên trái để quản lý các Test Cases.
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TAB 3: QUIZZES MANAGEMENT */}
            {activeTab === 'quizzes' && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="text-sm font-semibold text-text-secondary">
                            Câu hỏi trắc nghiệm của bài học: <span className="text-text-primary">{currentLesson?.title || 'Chưa chọn'}</span>
                        </div>
                        <button
                            onClick={() => {
                                setEditingQuiz({
                                    id: '',
                                    lessonId: selectedLessonId,
                                    question: '',
                                    explanation: '',
                                    level: 'EASY',
                                    orderIndex: quizzes.length + 1,
                                    options: [
                                        { key: 'A', text: '', isCorrect: true },
                                        { key: 'B', text: '', isCorrect: false },
                                        { key: 'C', text: '', isCorrect: false },
                                        { key: 'D', text: '', isCorrect: false }
                                    ]
                                });
                                setIsQuizModalOpen(true);
                            }}
                            className="bg-accent-custom hover:bg-accent-hover text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
                        >
                            Thêm Câu Hỏi Trắc Nghiệm
                        </button>
                    </div>

                    <div className="space-y-4">
                        {quizzes.length === 0 ? (
                            <div className="p-8 text-center text-text-secondary bg-bg-secondary rounded-2xl border border-border-custom">
                                Bài học này chưa có câu hỏi trắc nghiệm nào.
                            </div>
                        ) : (
                            quizzes.map((q, idx) => (
                                <div
                                    key={q.id}
                                    className="bg-bg-secondary p-5 rounded-2xl border border-border-custom space-y-4 shadow-sm"
                                >
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <span className="text-xs font-bold text-accent-custom mr-2">
                                                Câu {q.orderIndex || idx + 1}:
                                            </span>
                                            <span className="text-sm font-semibold text-text-primary">
                                                {q.question}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <button
                                                onClick={() => {
                                                    setEditingQuiz(q);
                                                    setIsQuizModalOpen(true);
                                                }}
                                                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border-custom hover:bg-bg-tertiary text-text-primary"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() => handleDeleteQuiz(q.id)}
                                                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </div>

                                    {/* Options Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                        {q.options?.map(opt => (
                                            <div
                                                key={opt.key}
                                                className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 ${
                                                    opt.isCorrect
                                                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-semibold'
                                                        : 'bg-bg-tertiary border-border-custom text-text-secondary'
                                                }`}
                                            >
                                                <span className="w-5 h-5 rounded-full flex items-center justify-center border font-bold text-[11px]">
                                                    {opt.key}
                                                </span>
                                                <span className="flex-1">{opt.text}</span>
                                                {opt.isCorrect && (
                                                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600">
                                                        Đáp án đúng
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {q.explanation && (
                                        <div className="p-3 bg-bg-tertiary rounded-xl border border-border-custom text-xs text-text-secondary">
                                            <span className="font-semibold text-text-primary">Giải thích: </span>
                                            {q.explanation}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* ============ MODAL: EDIT LESSON ============ */}
            {isLessonModalOpen && editingLesson && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-bg-secondary w-full max-w-3xl rounded-2xl border border-border-custom shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                        <div className="p-5 border-b border-border-custom flex justify-between items-center">
                            <h3 className="font-bold text-base text-text-primary">
                                {editingLesson.id ? 'Chỉnh Sửa Bài Học' : 'Tạo Bài Học Mới'}
                            </h3>
                            <button
                                onClick={() => setIsLessonModalOpen(false)}
                                className="text-text-secondary hover:text-text-primary text-sm font-semibold"
                            >
                                Đóng
                            </button>
                        </div>

                        <form onSubmit={handleSaveLesson} className="p-6 overflow-y-auto space-y-4 flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                                        Tiêu đề bài học *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={editingLesson.title}
                                        onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })}
                                        className="w-full bg-bg-tertiary border border-border-custom rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-custom"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                                        Mã bài học (VD: LS-01.01)
                                    </label>
                                    <input
                                        type="text"
                                        value={editingLesson.lessonId}
                                        onChange={(e) => setEditingLesson({ ...editingLesson, lessonId: e.target.value })}
                                        className="w-full bg-bg-tertiary border border-border-custom rounded-lg px-3 py-2 text-sm font-mono text-text-primary focus:outline-none focus:border-accent-custom"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                                        Độ khó
                                    </label>
                                    <select
                                        value={editingLesson.difficulty}
                                        onChange={(e) => setEditingLesson({ ...editingLesson, difficulty: e.target.value })}
                                        className="w-full bg-bg-tertiary border border-border-custom rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-custom"
                                    >
                                        <option value="EASY">Dễ (EASY)</option>
                                        <option value="MEDIUM">Trung bình (MEDIUM)</option>
                                        <option value="HARD">Nâng cao (HARD)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                                        Thời lượng (phút)
                                    </label>
                                    <input
                                        type="number"
                                        value={editingLesson.durationMinutes}
                                        onChange={(e) => setEditingLesson({ ...editingLesson, durationMinutes: Number(e.target.value) })}
                                        className="w-full bg-bg-tertiary border border-border-custom rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-custom"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                                        Thứ tự hiển thị
                                    </label>
                                    <input
                                        type="number"
                                        value={editingLesson.orderIndex}
                                        onChange={(e) => setEditingLesson({ ...editingLesson, orderIndex: Number(e.target.value) })}
                                        className="w-full bg-bg-tertiary border border-border-custom rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-custom"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-text-secondary mb-1">
                                    Mục tiêu bài học (Objective)
                                </label>
                                <input
                                    type="text"
                                    value={editingLesson.objective || ''}
                                    onChange={(e) => setEditingLesson({ ...editingLesson, objective: e.target.value })}
                                    className="w-full bg-bg-tertiary border border-border-custom rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-custom"
                                    placeholder="Nắm vững câu lệnh in ra màn hình..."
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-text-secondary mb-1">
                                    Nội dung lý thuyết Markdown (Theory Content)
                                </label>
                                <textarea
                                    rows={10}
                                    value={editingLesson.content || ''}
                                    onChange={(e) => setEditingLesson({ ...editingLesson, content: e.target.value })}
                                    className="w-full bg-bg-tertiary border border-border-custom rounded-lg p-3 text-xs font-mono text-text-primary focus:outline-none focus:border-accent-custom"
                                    placeholder="Soạn thảo lý thuyết bài học theo định dạng Markdown..."
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-border-custom">
                                <button
                                    type="button"
                                    onClick={() => setIsLessonModalOpen(false)}
                                    className="px-4 py-2 rounded-lg border border-border-custom text-text-primary text-xs font-semibold hover:bg-bg-tertiary"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 rounded-lg bg-accent-custom hover:bg-accent-hover text-white text-xs font-semibold shadow-sm"
                                >
                                    Lưu Bài Học
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ============ MODAL: EDIT CODING EXERCISE ============ */}
            {isExerciseModalOpen && editingExercise && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-bg-secondary w-full max-w-3xl rounded-2xl border border-border-custom shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                        <div className="p-5 border-b border-border-custom flex justify-between items-center">
                            <h3 className="font-bold text-base text-text-primary">
                                {editingExercise.id ? 'Chỉnh Sửa Bài Tập Tự Luận' : 'Thêm Bài Tập Mới'}
                            </h3>
                            <button
                                onClick={() => setIsExerciseModalOpen(false)}
                                className="text-text-secondary hover:text-text-primary text-sm font-semibold"
                            >
                                Đóng
                            </button>
                        </div>

                        <form onSubmit={handleSaveExercise} className="p-6 overflow-y-auto space-y-4 flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                                        Tiêu đề bài tập *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={editingExercise.title}
                                        onChange={(e) => setEditingExercise({ ...editingExercise, title: e.target.value })}
                                        className="w-full bg-bg-tertiary border border-border-custom rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-custom"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                                        Độ khó
                                    </label>
                                    <select
                                        value={editingExercise.difficulty}
                                        onChange={(e) => setEditingExercise({ ...editingExercise, difficulty: e.target.value })}
                                        className="w-full bg-bg-tertiary border border-border-custom rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-custom"
                                    >
                                        <option value="EASY">Dễ (EASY)</option>
                                        <option value="MEDIUM">Trung bình (MEDIUM)</option>
                                        <option value="HARD">Nâng cao (HARD)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-text-secondary mb-1">
                                    Mô tả đề bài chi tiết (Problem Description)
                                </label>
                                <textarea
                                    rows={4}
                                    value={editingExercise.problemDescription || ''}
                                    onChange={(e) => setEditingExercise({ ...editingExercise, problemDescription: e.target.value })}
                                    className="w-full bg-bg-tertiary border border-border-custom rounded-lg p-3 text-xs text-text-primary focus:outline-none focus:border-accent-custom"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                                        Mã khởi tạo (Starter Code)
                                    </label>
                                    <textarea
                                        rows={6}
                                        value={editingExercise.starterCode || ''}
                                        onChange={(e) => setEditingExercise({ ...editingExercise, starterCode: e.target.value })}
                                        className="w-full bg-bg-tertiary border border-border-custom rounded-lg p-3 text-xs font-mono text-text-primary focus:outline-none focus:border-accent-custom"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                                        Mã giải mẫu (Solution Code)
                                    </label>
                                    <textarea
                                        rows={6}
                                        value={editingExercise.solutionCode || ''}
                                        onChange={(e) => setEditingExercise({ ...editingExercise, solutionCode: e.target.value })}
                                        className="w-full bg-bg-tertiary border border-border-custom rounded-lg p-3 text-xs font-mono text-text-primary focus:outline-none focus:border-accent-custom"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-border-custom">
                                <button
                                    type="button"
                                    onClick={() => setIsExerciseModalOpen(false)}
                                    className="px-4 py-2 rounded-lg border border-border-custom text-text-primary text-xs font-semibold hover:bg-bg-tertiary"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 rounded-lg bg-accent-custom hover:bg-accent-hover text-white text-xs font-semibold shadow-sm"
                                >
                                    Lưu Bài Tập
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ============ MODAL: EDIT TEST CASE ============ */}
            {isTCModalOpen && editingTC && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-bg-secondary w-full max-w-xl rounded-2xl border border-border-custom shadow-2xl flex flex-col overflow-hidden">
                        <div className="p-5 border-b border-border-custom flex justify-between items-center">
                            <h3 className="font-bold text-base text-text-primary">
                                {editingTC.id ? 'Chỉnh Sửa Test Case' : 'Thêm Test Case Mới'}
                            </h3>
                            <button
                                onClick={() => setIsTCModalOpen(false)}
                                className="text-text-secondary hover:text-text-primary text-sm font-semibold"
                            >
                                Đóng
                            </button>
                        </div>

                        <form onSubmit={handleSaveTestCase} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-text-secondary mb-1">
                                    Đầu vào (Input / Stdin)
                                </label>
                                <textarea
                                    rows={4}
                                    value={editingTC.input || ''}
                                    onChange={(e) => setEditingTC({ ...editingTC, input: e.target.value })}
                                    className="w-full bg-bg-tertiary border border-border-custom rounded-lg p-3 text-xs font-mono text-text-primary focus:outline-none focus:border-accent-custom"
                                    placeholder="Ví dụ: 153 hoặc 5 (mỗi giá trị một dòng nếu cần nhiều input)"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-text-secondary mb-1">
                                    Kết quả mong đợi (Expected Output) *
                                </label>
                                <textarea
                                    rows={4}
                                    required
                                    value={editingTC.expectedOutput || ''}
                                    onChange={(e) => setEditingTC({ ...editingTC, expectedOutput: e.target.value })}
                                    className="w-full bg-bg-tertiary border border-border-custom rounded-lg p-3 text-xs font-mono text-text-primary focus:outline-none focus:border-accent-custom"
                                    placeholder="Ví dụ: YES hoặc 120 (chính xác từng ký tự và ngắt dòng)"
                                />
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="isHiddenCheck"
                                    checked={editingTC.isHidden}
                                    onChange={(e) => setEditingTC({ ...editingTC, isHidden: e.target.checked })}
                                    className="rounded border-border-custom text-accent-custom focus:ring-accent-custom"
                                />
                                <label htmlFor="isHiddenCheck" className="text-xs font-medium text-text-primary cursor-pointer select-none">
                                    Đặt làm Test Case Ẩn (Không hiển thị chi tiết khi học viên làm bài)
                                </label>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-border-custom">
                                <button
                                    type="button"
                                    onClick={() => setIsTCModalOpen(false)}
                                    className="px-4 py-2 rounded-lg border border-border-custom text-text-primary text-xs font-semibold hover:bg-bg-tertiary"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 rounded-lg bg-accent-custom hover:bg-accent-hover text-white text-xs font-semibold shadow-sm"
                                >
                                    Lưu Test Case
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ============ MODAL: EDIT QUIZ ============ */}
            {isQuizModalOpen && editingQuiz && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-bg-secondary w-full max-w-2xl rounded-2xl border border-border-custom shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                        <div className="p-5 border-b border-border-custom flex justify-between items-center">
                            <h3 className="font-bold text-base text-text-primary">
                                {editingQuiz.id ? 'Chỉnh Sửa Câu Hỏi Trắc Nghiệm' : 'Thêm Câu Hỏi Mới'}
                            </h3>
                            <button
                                onClick={() => setIsQuizModalOpen(false)}
                                className="text-text-secondary hover:text-text-primary text-sm font-semibold"
                            >
                                Đóng
                            </button>
                        </div>

                        <form onSubmit={handleSaveQuiz} className="p-6 overflow-y-auto space-y-4 flex-1">
                            <div>
                                <label className="block text-xs font-semibold text-text-secondary mb-1">
                                    Nội dung câu hỏi *
                                </label>
                                <textarea
                                    rows={3}
                                    required
                                    value={editingQuiz.question}
                                    onChange={(e) => setEditingQuiz({ ...editingQuiz, question: e.target.value })}
                                    className="w-full bg-bg-tertiary border border-border-custom rounded-lg p-3 text-sm text-text-primary focus:outline-none focus:border-accent-custom"
                                    placeholder="Đoạn code nào sau đây sẽ in ra màn hình mà không báo lỗi?..."
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="block text-xs font-semibold text-text-secondary">
                                    Các phương án lựa chọn (Chọn 1 phương án là đáp án đúng):
                                </label>
                                {editingQuiz.options?.map((opt: QuizOption, index: number) => (
                                    <div key={opt.key} className="flex items-center gap-3 bg-bg-tertiary p-2.5 rounded-xl border border-border-custom">
                                        <input
                                            type="radio"
                                            name="correctOptionRadio"
                                            checked={opt.isCorrect}
                                            onChange={() => {
                                                const updated = editingQuiz.options.map((o: QuizOption, i: number) => ({
                                                    ...o,
                                                    isCorrect: i === index
                                                }));
                                                setEditingQuiz({ ...editingQuiz, options: updated });
                                            }}
                                            className="text-accent-custom focus:ring-accent-custom cursor-pointer"
                                        />
                                        <span className="w-6 h-6 rounded-lg bg-bg-secondary border border-border-custom flex items-center justify-center font-bold text-xs">
                                            {opt.key}
                                        </span>
                                        <input
                                            type="text"
                                            required
                                            value={opt.text}
                                            onChange={(e) => {
                                                const updated = [...editingQuiz.options];
                                                updated[index].text = e.target.value;
                                                setEditingQuiz({ ...editingQuiz, options: updated });
                                            }}
                                            placeholder={`Nội dung phương án ${opt.key}...`}
                                            className="flex-1 bg-transparent text-xs text-text-primary focus:outline-none"
                                        />
                                    </div>
                                ))}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-text-secondary mb-1">
                                    Giải thích chi tiết (Hiển thị sau khi học viên trả lời)
                                </label>
                                <textarea
                                    rows={2}
                                    value={editingQuiz.explanation || ''}
                                    onChange={(e) => setEditingQuiz({ ...editingQuiz, explanation: e.target.value })}
                                    className="w-full bg-bg-tertiary border border-border-custom rounded-lg p-3 text-xs text-text-primary focus:outline-none focus:border-accent-custom"
                                    placeholder="Giải thích tại sao đáp án này là đúng..."
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-border-custom">
                                <button
                                    type="button"
                                    onClick={() => setIsQuizModalOpen(false)}
                                    className="px-4 py-2 rounded-lg border border-border-custom text-text-primary text-xs font-semibold hover:bg-bg-tertiary"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 rounded-lg bg-accent-custom hover:bg-accent-hover text-white text-xs font-semibold shadow-sm"
                                >
                                    Lưu Câu Hỏi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 bg-slate-900 text-white text-xs font-medium px-4 py-3 rounded-xl shadow-xl border border-slate-700 z-50 animate-fade-in">
                    {toastMessage}
                </div>
            )}
        </div>
    );
}
