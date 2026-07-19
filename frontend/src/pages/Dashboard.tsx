import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { CourseCard } from '../components/CourseCard';
import { ThemeToggle } from '../components/ThemeToggle';


// Helper decode JWT
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

interface DBLocationCourse {
    id: string,
    title: string,
    description: string,
    level: string
    thumbnail?: string
}


import { useQuery } from '@tanstack/react-query';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>('Học viên');

    // Sử dụng useQuery để tự động gọi API, lưu cache và phục hồi dữ liệu tức thì
    const { data: courses = [], isLoading } = useQuery<DBLocationCourse[]>({
        queryKey: ['courses'],
        queryFn: authService.getCourses,
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = decodeToken(token);
            if (decoded && decoded.username) {
                setUsername(decoded.username);
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);




    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

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
                    <Link to="/practice-arena" className="text-text-tertiary hover:text-text-primary no-underline text-[13px] font-medium tracking-[0.8px] transition-colors duration-200">
                        Đấu trường Luyện tập
                    </Link>
                    <a href="#settings" className="text-text-tertiary hover:text-text-primary no-underline text-[13px] font-medium tracking-[0.8px] transition-colors duration-200">
                        Cài đặt
                    </a>
                </nav>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent-custom text-white dark:text-bg-primary flex items-center justify-center font-bold text-sm">
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

            {/* Main Content */}
            <main className="flex-1 px-6 py-8 md:px-10 md:py-10 max-w-[1200px] mx-auto w-full box-border flex flex-col gap-10">
                {/* Greeting */}
                <section className="flex flex-col gap-1 text-left">
                    <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Chào mừng quay lại, {username}!</h1>
                    <p className="text-text-tertiary text-sm">Hôm nay bạn đã sẵn sàng nâng cấp kỹ năng Python chưa?</p>
                </section>

                {/* Section: Chỉ số học tập (được đưa lên đầu) */}
                <section className="mb-6">
                    <div className="flex flex-col md:flex-row gap-5">
                        <div className="flex-1 bg-bg-secondary border border-border-custom rounded-xl p-5 md:px-6 md:py-5 flex flex-col gap-2 text-left hover:border-text-tertiary/20 hover:bg-bg-tertiary/20 transition-all duration-200">
                            <span className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider">Học liên tục (Streak)</span>
                            <span className="text-2xl font-bold text-[#ff9f0a]">🔥 5 ngày</span>
                        </div>
                        <div className="flex-1 bg-bg-secondary border border-border-custom rounded-xl p-5 md:px-6 md:py-5 flex flex-col gap-2 text-left hover:border-text-tertiary/20 hover:bg-bg-tertiary/20 transition-all duration-200">
                            <span className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider">Bài học đã hoàn thành</span>
                            <span className="text-2xl font-bold text-text-primary">📚 3 bài</span>
                        </div>
                        <div className="flex-1 bg-bg-secondary border border-border-custom rounded-xl p-5 md:px-6 md:py-5 flex flex-col gap-2 text-left hover:border-text-tertiary/20 hover:bg-bg-tertiary/20 transition-all duration-200">
                            <span className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider">Tổng thời gian tự học</span>
                            <span className="text-2xl font-bold text-text-primary">⏱️ 2.5 giờ</span>
                        </div>
                    </div>
                </section>

                {/* Section: Khóa học dành cho bạn */}
                <section>
                    <h3 className="text-lg font-bold text-text-primary text-left mb-5">Dành cho bạn</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {isLoading ? (
                            <div className="col-span-full text-center py-12 text-text-tertiary">
                                <span className="animate-pulse">Đang tải danh sách khóa học...</span>
                            </div>
                        ) : courses.length > 0 ? (
                            courses.map((course) => (
                                <CourseCard
                                    key={course.id}
                                    course={course}
                                    onClick={() => navigate(`/course/${course.id}`)}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 text-text-tertiary">
                                Không tìm thấy khóa học nào.
                            </div>
                        )}
                    </div>
                </section>


            </main>
        </div>
    );
};

export default Dashboard;
