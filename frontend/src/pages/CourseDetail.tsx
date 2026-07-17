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
    title: string;
    durationMinutes: number | null;
    isFree: boolean;
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

const CourseDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>('Học viên');
    const [course, setCourse] = useState<DBCourse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Đồng bộ người dùng từ Token
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = decodeToken(token);
            if (decoded && decoded.username) {
                setUsername(decoded.username);
            }
        }

        // Gọi API lấy chi tiết khóa học bằng ID
        const fetchCourseDetail = async () => {
            try {
                setLoading(true);
                setError('');
                if (!id) return;
                
                const data = await authService.getCourseDetail(id);
                setCourse(data);
            } catch (err: any) {
                console.error("Lỗi tải chi tiết khóa học:", err);
                setError(err.response?.data?.message || 'Không thể tải thông tin khóa học');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCourseDetail();
        }
    }, [id, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    if (loading) {
        return (
            <div className="text-text-primary text-center py-24 bg-bg-primary min-h-screen flex items-center justify-center">
                <span className="text-lg">Đang tải thông tin khóa học...</span>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="text-text-primary text-center py-24 bg-bg-primary min-h-screen flex flex-col justify-center items-center gap-4">
                <p className="text-rose-400">⚠️ {error || 'Không tìm thấy khóa học yêu cầu'}</p>
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
                            {course.modules.map((module, mIndex) => (
                                <div key={module.id} className="flex flex-col gap-4">
                                    {/* Tiêu đề Module */}
                                    <div className="bg-bg-tertiary border border-border-custom rounded-xl p-4 flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-extrabold text-accent-custom uppercase tracking-wider bg-accent-bg px-2 py-0.5 rounded border border-accent-border">
                                                Phân mô {mIndex + 1}
                                            </span>
                                            <span className="text-xs text-text-tertiary font-medium">
                                                {module.chapters.length} Chương • {module.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0)} Bài học
                                            </span>
                                        </div>
                                        <h4 className="text-base font-bold text-text-primary m-0 mt-1">{module.title}</h4>
                                    </div>

                                    {/* Danh sách các Chương trong Module */}
                                    <div className="flex flex-col gap-4 pl-2 md:pl-4 border-l border-border-custom">
                                        {module.chapters.map((chapter, cIndex) => (
                                            <div key={chapter.id} className="border border-border-custom rounded-xl overflow-hidden bg-bg-secondary">
                                                <div className="bg-bg-tertiary px-5 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-border-custom">
                                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                                        <span className="text-[10px] font-extrabold text-text-tertiary uppercase tracking-wider">Chương {mIndex + 1}.{cIndex + 1}</span>
                                                        <span className="font-bold text-sm text-text-primary">{chapter.title}</span>
                                                    </div>
                                                    <span className="text-[10px] text-text-tertiary font-medium">{chapter.lessons.length} bài học</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    {chapter.lessons.map((lesson) => (
                                                        <div 
                                                            key={lesson.id} 
                                                            className="px-5 py-3.5 flex justify-between items-center hover:bg-bg-tertiary/50 cursor-pointer transition-colors border-b border-border-custom last:border-b-0" 
                                                            onClick={() => navigate(`/lesson/${lesson.id}`)}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-text-tertiary text-xs">💻</span>
                                                                <span className="text-xs md:text-sm text-text-secondary hover:text-text-primary transition-colors">{lesson.title}</span>
                                                            </div>
                                                            <span className="text-[10px] md:text-xs text-text-tertiary">
                                                                {lesson.durationMinutes ? `${lesson.durationMinutes} phút` : 'Chưa đặt thời lượng'}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
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
