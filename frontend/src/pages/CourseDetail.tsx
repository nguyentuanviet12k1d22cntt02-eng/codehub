import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { ThemeToggle } from '../components/ThemeToggle';


// Giải mã JWT để hiển thị Header đồng bộ
const decodeToken = (token: string) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
};

interface DBLesson {
    id: string;
    lessonId?: string;
    title: string;
    durationMinutes: number | null;
    isFree: boolean;
    isCompleted?: boolean;
    objective?: string | null;
}

interface DBChapter {
    id: string;
    title: string;
    lessons: DBLesson[];
}

interface DBModule {
    id: string;
    title: string;
    chapters: DBChapter[];
}

interface DBCourse {
    id: string;
    title: string;
    description: string | null;
    level: string;
    modules: DBModule[];
}

import { useQuery } from '@tanstack/react-query';

const CourseDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>('Học viên');
    const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

    const toggleModule = (moduleId: string) => {
        setExpandedModules(prev => ({
            ...prev,
            [moduleId]: prev[moduleId] === false ? true : false
        }));
    };

    // Sử dụng useQuery để quản lý nạp dữ liệu và cache thông tin chi tiết khóa học
    const { data: course, isLoading, error } = useQuery<DBCourse>({
        queryKey: ['course', id],
        queryFn: () => authService.getCourseDetail(id!),
        enabled: !!id, // Chỉ chạy query khi có id khóa học
    });

    useEffect(() => {
        // Đồng bộ người dùng từ Token
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = decodeToken(token);
            if (decoded && decoded.username) {
                setUsername(decoded.username);
            }
        }
    }, [id, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    if (isLoading) {
        return (
            <div className="text-text-primary text-center py-24 bg-bg-primary min-h-screen flex items-center justify-center">
                <span className="text-lg">Đang tải thông tin khóa học...</span>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="text-text-primary text-center py-24 bg-bg-primary min-h-screen flex flex-col justify-center items-center gap-4">
                <p className="text-rose-400">⚠️ {error ? (error as any).response?.data?.message || error.message : 'Không tìm thấy khóa học yêu cầu'}</p>
                <button
                    className="bg-accent-custom hover:bg-accent-hover text-white dark:bg-white dark:text-black px-5 py-2 rounded-lg text-sm font-semibold cursor-pointer active:scale-95 transition-transform"
                    onClick={() => navigate('/dashboard')}
                >
                    Quay lại Dashboard
                </button>
            </div>
        );
    }

    // Tính tổng số bài học và tổng thời lượng thực tế từ các modules & chapters & lessons
    const totalLessons = course.modules.reduce((sum, mod) =>
        sum + mod.chapters.reduce((cSum, ch) => cSum + ch.lessons.length, 0)
        , 0);
    const totalDuration = course.modules.reduce((sum, mod) =>
        sum + mod.chapters.reduce((cSum, ch) =>
            cSum + ch.lessons.reduce((lSum, l) => lSum + (l.durationMinutes || 0), 0)
            , 0)
        , 0);

    // Một số mục tiêu mặc định nếu chưa có cấu hình trong db
    const defaultObjectives = [
        'Hiểu sâu kiến thức cốt lõi và tư duy lập trình chuyên nghiệp.',
        'Thực hành trực tiếp thông qua các bài tập tương tác ngay trên hệ thống.',
        'Thiết lập môi trường phát triển dự án thực tế trên máy cá nhân.',
        'Sẵn sàng áp dụng kiến thức vào công việc hoặc sản phẩm cá nhân.'
    ];

    return (
        <div className="bg-bg-primary text-text-primary min-h-screen w-full relative overflow-hidden flex flex-col font-sans select-none transition-colors duration-200">
            {/* Header đồng bộ */}
            <header className="flex justify-between items-center px-6 py-4 md:px-10 border-b border-border-custom bg-bg-secondary/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-200">
                <div className="flex items-center gap-2">
                    <span
                        className="text-2xl font-bold tracking-tight text-text-primary cursor-pointer no-underline"
                        onClick={() => navigate('/dashboard')}
                    >
                        MCODE
                    </span>
                    <span className="text-[9px] font-bold bg-accent-bg text-accent-custom px-1.5 py-0.5 rounded border border-accent-border tracking-wider uppercase">
                        PYTHON
                    </span>
                </div>
                <nav className="hidden md:flex gap-8">
                    <Link to="/dashboard" className="text-accent-custom font-semibold no-underline text-[13px] tracking-[0.8px]">
                        Dashboard
                    </Link>
                    <a href="#courses" className="text-text-tertiary hover:text-text-primary no-underline text-[13px] font-medium tracking-[0.8px] transition-colors duration-200">
                        Khóa học
                    </a>
                    <a href="#practice" className="text-text-tertiary hover:text-text-primary no-underline text-[13px] font-medium tracking-[0.8px] transition-colors duration-200">
                        Luyện tập
                    </a>
                    <a href="#settings" className="text-text-tertiary hover:text-text-primary no-underline text-[13px] font-medium tracking-[0.8px] transition-colors duration-200">
                        Cài đặt
                    </a>
                </nav>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent-custom text-white dark:text-[#030303] flex items-center justify-center font-bold text-sm">
                            {username.substring(0, 1).toUpperCase()}
                        </div>
                        <span className="text-sm font-semibold text-text-primary hidden sm:inline">{username}</span>
                        <button
                            className="text-xs text-text-tertiary hover:text-text-primary bg-transparent border border-border-custom hover:border-text-tertiary rounded-full px-3 py-1.5 cursor-pointer transition-colors"
                            onClick={handleLogout}
                        >
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </header>

            {/* Breadcrumb điều hướng */}
            <div className="flex items-center flex-wrap gap-2 px-6 py-4 md:px-10 text-xs text-text-tertiary border-b border-border-custom bg-bg-secondary/40">
                <Link to="/dashboard" className="hover:text-text-primary transition-colors no-underline">Dashboard</Link>
                <span className="text-text-tertiary/50">&rarr;</span>
                <span className="hover:text-text-primary transition-colors no-underline">Khóa học</span>
                <span className="text-text-tertiary/50">&rarr;</span>
                <span className="text-text-primary font-medium">{course.title}</span>
            </div>

            {/* Main content */}
            <main className="flex-1 px-6 py-8 md:px-10 max-w-[1200px] mx-auto w-full box-border flex flex-col lg:flex-row gap-8 text-left">
                {/* Cột trái: Nội dung giới thiệu */}
                <div className="flex-1 flex flex-col gap-8 lg:max-w-[70%] w-full">
                    {/* Course Hero Banner */}
                    <div className="rounded-2xl p-6 md:p-10 flex flex-col gap-3 relative overflow-hidden bg-gradient-to-br from-[#c084fc] to-[#6366f1]">
                        <span className="self-start text-[10px] font-bold bg-white/15 text-white px-2 py-0.5 rounded border border-white/20 tracking-wider uppercase">
                            {course.level}
                        </span>
                        <h1 className="text-2xl md:text-4xl font-extrabold leading-tight text-white m-0">
                            {course.title}
                        </h1>
                        <div className="flex flex-wrap gap-4 text-xs text-white/90 font-medium mt-2">
                            <span>⭐ 5.0 (Đánh giá)</span>
                            <span>👥 120 học viên</span>
                            <span>🕒 {totalDuration} phút</span>
                        </div>
                    </div>

                    {/* Section 1: Tổng quan */}
                    <div className="bg-bg-secondary border border-border-custom rounded-2xl p-6 md:p-8 flex flex-col gap-4">
                        <h3 className="text-lg font-bold text-text-primary m-0">Tổng quan khóa học</h3>
                        <p className="text-sm text-text-secondary leading-relaxed m-0">
                            {course.description || 'Khóa học cung cấp lộ trình bài bản giúp bạn nhanh chóng nắm bắt các kiến thức lập trình cơ bản và nâng cao để áp dụng trực tiếp vào công việc.'}
                        </p>
                    </div>

                    {/* Section 2: Mục tiêu khóa học */}
                    <div className="bg-bg-secondary border border-border-custom rounded-2xl p-6 md:p-8 flex flex-col gap-4">
                        <h3 className="text-lg font-bold text-text-primary m-0">Mục tiêu của khóa học</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {defaultObjectives.map((obj, index) => (
                                <div key={index} className="flex items-start gap-2.5 text-sm text-text-secondary leading-normal">
                                    <span className="text-[#30d158] font-bold">✓</span>
                                    <span>{obj}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 3: Danh sách bài học */}
                    <div className="bg-bg-secondary border border-border-custom rounded-2xl p-6 md:p-8 flex flex-col gap-6">
                        <h3 className="text-lg font-bold text-text-primary m-0 border-b border-border-custom pb-3">Nội dung học tập</h3>
                        <div className="flex flex-col gap-8">
                            {course.modules.map((module, mIndex) => {
                                const isExpanded = expandedModules[module.id] !== false; // mặc định là mở rộng (true)
                                return (
                                    <div key={module.id} className="flex flex-col gap-4">
                                        {/* Tiêu đề Module (Click để Thu gọn/Mở rộng) */}
                                        <div
                                            onClick={() => toggleModule(module.id)}
                                            className="bg-bg-tertiary border border-border-custom rounded-xl p-4 flex flex-col gap-2 hover:bg-bg-tertiary/70 cursor-pointer transition-colors duration-200 select-none group"
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-extrabold text-accent-custom uppercase tracking-wider bg-accent-bg px-2 py-0.5 rounded border border-accent-border">
                                                    Phân môn {mIndex + 1}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-text-tertiary font-medium">
                                                        {module.chapters.length} Chương • {module.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0)} Bài học
                                                    </span>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={2.5}
                                                        stroke="currentColor"
                                                        className={`w-3.5 h-3.5 text-text-tertiary transition-transform duration-200 group-hover:text-text-primary ${isExpanded ? 'rotate-180' : ''}`}
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <h4 className="text-base font-bold text-text-primary m-0 mt-1">{module.title}</h4>
                                        </div>

                                        {/* Danh sách các Chương trong Module (Chỉ hiển thị khi expanded) */}
                                        {isExpanded && (
                                            <div className="flex flex-col gap-4 pl-2 md:pl-4 border-l border-border-custom transition-all duration-300">
                                                {module.chapters.map((chapter, cIndex) => {
                                                    const normalLessons = chapter.lessons.filter(l => l.lessonId && !l.lessonId.includes('.MP'));
                                                    return (
                                                        <div key={chapter.id} className="border border-border-custom rounded-xl overflow-hidden bg-bg-secondary animate-fadeIn">
                                                            <div className="bg-bg-tertiary px-5 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-border-custom">
                                                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                                                    <span className="text-[10px] font-extrabold text-text-tertiary uppercase tracking-wider">Chương {mIndex + 1}.{cIndex + 1}</span>
                                                                    <span className="font-bold text-sm text-text-primary">{chapter.title}</span>
                                                                </div>
                                                                <span className="text-[10px] text-text-tertiary font-medium">{normalLessons.length} bài học</span>
                                                            </div>
                                                            <div className="flex flex-col">
                                                                {normalLessons.map((lesson) => (
                                                                    <div
                                                                        key={lesson.id}
                                                                        className="px-5 py-3.5 flex justify-between items-center hover:bg-bg-tertiary/50 cursor-pointer transition-colors border-b border-border-custom last:border-b-0"
                                                                        onClick={() => navigate(`/lesson/${lesson.id}`)}
                                                                    >
                                                                        <div className="flex items-center gap-3">
                                                                            {lesson.isCompleted ? (
                                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-[18px] h-[18px] text-[#30d158] shrink-0">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                                                </svg>
                                                                            ) : (
                                                                                <span className="text-text-tertiary text-xs">💻</span>
                                                                            )}
                                                                            <span className="text-xs md:text-sm text-text-secondary hover:text-text-primary transition-colors">{lesson.title}</span>
                                                                        </div>
                                                                        <span className="text-[10px] md:text-xs text-text-tertiary">
                                                                            {lesson.durationMinutes ? `${lesson.durationMinutes} phút` : 'Chưa đặt thời lượng'}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    );
                                                })}

                                                {/* Nút Làm bài tập ôn luyện của Module nếu có */}
                                                {(() => {
                                                    const practiceLessons = module.chapters
                                                        .flatMap((ch) => ch.lessons)
                                                        .filter((l) => l.lessonId && l.lessonId.includes('.MP'));
                                                    if (practiceLessons.length === 0) return null;
                                                    const modName = module.title.split(':')[0] || 'Module';
                                                    return (
                                                        <div className="mt-4 flex flex-col gap-4">
                                                            {practiceLessons.map((practiceLesson) => {
                                                                const isFor = practiceLesson.title.includes("For");
                                                                const isWhile = practiceLesson.title.includes("While");
                                                                const topicLabel = isFor ? "For" : isWhile ? "While" : modName;
                                                                return (
                                                                    <div
                                                                        key={practiceLesson.id}
                                                                        className="p-5 bg-gradient-to-r from-accent-custom/10 to-indigo-500/10 border border-accent-custom/20 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:border-accent-custom/40 duration-200"
                                                                    >
                                                                        <div className="flex flex-col gap-1 select-text">
                                                                            <span className="text-[10px] font-extrabold text-accent-custom uppercase tracking-wider bg-accent-bg px-2 py-0.5 rounded border border-accent-border self-start">
                                                                                Luyện tập tổng hợp: {topicLabel}
                                                                            </span>
                                                                            <h5 className="text-sm md:text-base font-extrabold text-[#9896f1] dark:text-[#a5b4fc] m-0 mt-1.5">
                                                                                {practiceLesson.title}
                                                                            </h5>
                                                                            <p className="text-xs text-text-tertiary m-0 mt-1 max-w-[500px] leading-relaxed">
                                                                                {practiceLesson.objective || `Kiểm tra và củng cố toàn bộ kiến thức đã học trong ${modName}.`}
                                                                            </p>
                                                                        </div>
                                                                        <button
                                                                            onClick={() => navigate(`/module-practice/${module.id}/${practiceLesson.id}`)}
                                                                            className="bg-accent-custom hover:bg-accent-hover text-white dark:text-[#030303] px-5 py-3 rounded-xl text-xs font-bold cursor-pointer transition-all duration-200 active:scale-95 border-none shadow-lg shadow-accent-custom/10 flex items-center gap-2 whitespace-nowrap self-stretch md:self-auto justify-center"
                                                                        >
                                                                            <span>Làm bài tập ôn luyện {topicLabel}</span>
                                                                            <span>&rarr;</span>
                                                                        </button>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Cột phải: Sticky Sidebar */}
                <div className="w-full lg:w-[30%] lg:sticky lg:top-[90px] self-start">
                    <div className="bg-bg-secondary border border-border-custom rounded-2xl p-6 flex flex-col gap-6">
                        <div className="flex justify-between items-center border-b border-border-custom pb-4">
                            <span className="text-xs text-text-tertiary">Giá khóa học:</span>
                            <span className="text-xl font-bold text-[#ff9f0a]">Miễn phí</span>
                        </div>

                        <button
                            className="bg-accent-custom hover:bg-accent-hover text-white dark:bg-white dark:text-black font-bold py-3.5 rounded-xl transition-all duration-200 cursor-pointer active:scale-[0.98] text-sm text-center flex items-center justify-center gap-2 border-none w-full"
                            onClick={() => {
                                const firstLessonId = course?.modules?.[0]?.chapters?.[0]?.lessons?.[0]?.id;
                                if (firstLessonId) {
                                    navigate(`/lesson/${firstLessonId}`);
                                } else {
                                    navigate('/dashboard');
                                }
                            }}
                        >
                            Bắt đầu học ngay &rarr;
                        </button>

                        <div className="flex flex-col gap-3.5">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-text-tertiary">Thời lượng:</span>
                                <span className="text-text-primary font-medium">{totalDuration} phút</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-text-tertiary">Số bài học:</span>
                                <span className="text-text-primary font-medium">{totalLessons} bài</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-text-tertiary">Cấp độ học:</span>
                                <span className="text-text-primary font-medium">{course.level}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-text-tertiary">Hình thức:</span>
                                <span className="text-text-primary font-medium">Học trực tuyến</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CourseDetail;
