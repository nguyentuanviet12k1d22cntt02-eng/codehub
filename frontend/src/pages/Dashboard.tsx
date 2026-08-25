import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { CourseCard } from '../components/CourseCard';
import { ThemeToggle } from '../components/ThemeToggle';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

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
    id: string;
    title: string;
    description: string;
    level: string;
    thumbnail?: string;
}

const kcNames: Record<string, string> = {
    'KC_VAR': 'Biến & Kiểu dữ liệu',
    'KC_COND': 'Câu lệnh rẽ nhánh (if/else)',
    'KC_LOOP': 'Vòng lặp (for/while)',
    'KC_LIST': 'Cấu trúc Danh sách (List)',
    'KC_DICT': 'Từ điển và Tập hợp (Dict/Set)',
    'KC_FUNC': 'Hàm & Đóng gói Module',
    'KC_OOP': 'Lập trình Hướng đối tượng'
};

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>('Học viên');
    const [role, setRole] = useState<string>('STUDENT');
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [recsLoading, setRecsLoading] = useState<boolean>(true);
    const [selectedAlgo, setSelectedAlgo] = useState<string>('PAL-Net');
    const [serviceEngine, setServiceEngine] = useState<string>('');

    // Sử dụng useQuery để tự động gọi API, lưu cache và phục hồi dữ liệu tức thì
    const { data: courses = [], isLoading } = useQuery<DBLocationCourse[]>({
        queryKey: ['courses'],
        queryFn: authService.getCourses,
    });

    const fetchRecommendations = async (algoName: string) => {
        setRecsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/api/auth/recommendations?algo=${algoName}&limit=3`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data && response.data.success) {
                setRecommendations(response.data.data || []);
                setServiceEngine(response.data.engine || algoName);
            }
        } catch (err) {
            console.error("Error fetching recommendations: ", err);
        } finally {
            setRecsLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = decodeToken(token);
            if (decoded && decoded.username) {
                setUsername(decoded.username);
            }
            if (decoded && decoded.role) {
                setRole(decoded.role);
            }
            fetchRecommendations(selectedAlgo);
        } else {
            navigate('/login');
        }
    }, [navigate, selectedAlgo]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const handleRecClick = (item: any) => {
        if (item.type === 'LESSON_EXERCISE' && item.lesson_id) {
            navigate(`/practice/${item.lesson_id}`);
        } else if (item.type === 'PRACTICE_PROBLEM' && item.slug) {
            navigate(`/practice-arena/${item.slug}`);
        }
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
                    <Link to="/personalized-path" className="text-text-tertiary hover:text-text-primary no-underline text-[13px] font-semibold tracking-[0.8px] transition-colors duration-200">
                        🚀 Lộ trình Cá Nhân Hóa
                    </Link>
                    <Link to="/adaptive-practice" className="text-text-tertiary hover:text-text-primary no-underline text-[13px] font-semibold tracking-[0.8px] transition-colors duration-200">
                        Rèn luyện thích ứng
                    </Link>

                    <Link to="/practice-arena" className="text-text-tertiary hover:text-text-primary no-underline text-[13px] font-semibold tracking-[0.8px] transition-colors duration-200">
                        Đấu trường Luyện tập
                    </Link>
                    <Link to="/profile" className="text-text-tertiary hover:text-text-primary no-underline text-[13px] font-semibold tracking-[0.8px] transition-colors duration-200">
                        Tri thức cá nhân
                    </Link>
                    {role === 'ADMIN' && (
                        <Link to="/admin" className="text-rose-400 hover:text-rose-300 no-underline text-[13px] font-bold tracking-[0.8px] transition-colors duration-200">
                            Trang quản trị
                        </Link>
                    )}
                </nav>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <div className="flex items-center gap-3">
                        <div
                            title="Xem thông tin cá nhân"
                            className="w-8 h-8 rounded-full bg-accent-custom text-white dark:text-bg-primary flex items-center justify-center font-bold text-sm cursor-pointer hover:opacity-85 transition-opacity"
                            onClick={() => navigate('/profile')}
                        >
                            {username.substring(0, 1).toUpperCase()}
                        </div>
                        <span
                            title="Xem thông tin cá nhân"
                            className="text-sm font-semibold text-text-primary hidden sm:inline cursor-pointer hover:text-accent-custom transition-colors"
                            onClick={() => navigate('/profile')}
                        >
                            {username}
                        </span>
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

                {/* Section: Chỉ số học tập */}
                <section className="mb-2">
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

                {/* Section: AI Personalized Recommender */}
                <section className="bg-bg-secondary border border-border-custom rounded-2xl p-6 md:p-8 flex flex-col gap-6 text-left hover:border-accent-custom/20 transition-all duration-300">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border-custom pb-4 text-left">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <h3 className="text-xl font-extrabold text-text-primary m-0">🎯 Gợi ý học tập thích ứng (AI Recommender)</h3>
                                <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${serviceEngine === 'FALLBACK_RULE_BASED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-accent-bg text-accent-custom border-accent-border'} uppercase tracking-wider`}>
                                    {serviceEngine === 'FALLBACK_RULE_BASED' ? '🔒 RULE FALLBACK' : `🧠 ENGINE: ${serviceEngine}`}
                                </span>
                            </div>
                            <p className="text-xs text-text-tertiary m-0">Đề xuất thử thách phù hợp nhất dựa trên vùng phát triển gần nhất (ZPD Zone) của bạn.</p>
                        </div>

                        {/* Selector Algorithm */}
                        <div className="flex items-center gap-2.5">
                            <span className="text-xs font-semibold text-text-secondary select-none">Thuật toán:</span>
                            <select
                                className="bg-bg-primary text-text-primary text-xs font-semibold border border-border-custom rounded-lg px-3 py-1.5 focus:outline-none focus:border-accent-custom cursor-pointer transition-colors duration-200"
                                value={selectedAlgo}
                                onChange={(e) => setSelectedAlgo(e.target.value)}
                            >
                                <option value="PAL-Net">PAL-Net (Khuyên dùng)</option>
                                <option value="BKT">BKT (Thời gian thực)</option>
                                <option value="DKT">DKT (Mạng LSTM)</option>
                            </select>
                        </div>
                    </div>

                    {recsLoading ? (
                        <div className="py-12 text-center text-text-tertiary">
                            <span className="animate-pulse">AI đang phân tích tiến trình học tập của bạn...</span>
                        </div>
                    ) : recommendations.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {recommendations.map((item) => {
                                const difficultyColor =
                                    item.difficulty === 'EASY' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-500/20' :
                                        item.difficulty === 'MEDIUM' ? 'text-amber-400 bg-amber-400/10 border-amber-500/20' :
                                            'text-rose-400 bg-rose-400/10 border-rose-500/20';

                                const typeLabel = item.type === 'LESSON_EXERCISE' ? 'BÀI HỌC CHÍNH' : 'ĐẤU TRƯỜNG';
                                const typeColor = item.type === 'LESSON_EXERCISE' ? 'text-[#c084fc] bg-[#c084fc]/10 border-[#c084fc]/20' : 'text-blue-400 bg-blue-400/10 border-blue-500/20';

                                return (
                                    <div
                                        key={item.id}
                                        className="bg-bg-tertiary/20 hover:bg-bg-tertiary/60 border border-border-custom hover:border-text-tertiary/20 rounded-xl p-5 flex flex-col gap-4 justify-between transition-all duration-200 group"
                                    >
                                        <div className="flex flex-col gap-3">
                                            {/* Badges */}
                                            <div className="flex items-center flex-wrap gap-2 text-[9px] font-bold tracking-wider">
                                                <span className={`px-2 py-0.5 rounded border ${typeColor}`}>{typeLabel}</span>
                                                <span className={`px-2 py-0.5 rounded border ${difficultyColor}`}>{item.difficulty}</span>
                                            </div>

                                            {/* Title */}
                                            <h4 className="text-sm font-bold text-text-primary group-hover:text-accent-custom leading-snug m-0 transition-colors duration-200">
                                                {item.title}
                                            </h4>

                                            {/* Skill Component description */}
                                            <div className="flex flex-col gap-1 text-[11px] text-text-secondary mt-1">
                                                <span className="font-semibold text-text-tertiary">Kỹ năng mục tiêu:</span>
                                                <span>{kcNames[item.kc_id] || item.kc_id}</span>
                                            </div>

                                            {/* AI predictions progress stats */}
                                            <div className="bg-bg-primary/50 rounded-lg p-2.5 mt-1 border border-border-custom/50 flex justify-between items-center text-xs font-mono">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-[10px] text-text-tertiary uppercase">Độ thạo AI dự kiến</span>
                                                    <span className="font-bold text-[#ff9f0a]">{Math.round(item.predicted_mastery * 1000) / 10}%</span>
                                                </div>
                                                <div className="flex flex-col gap-0.5 items-end">
                                                    <span className="text-[10px] text-text-tertiary uppercase">Điểm ZPD</span>
                                                    <span className="font-bold text-accent-custom">{Math.round(item.zpd_score * 100) / 100}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            className="w-full bg-[#1c1c1e] dark:bg-white text-white dark:text-black font-semibold text-xs py-2 rounded-lg hover:bg-accent-custom hover:text-white dark:hover:bg-accent-custom dark:hover:text-white transition-all cursor-pointer border border-border-custom"
                                            onClick={() => handleRecClick(item)}
                                        >
                                            Thực hành ngay &rarr;
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-8 text-center text-text-tertiary text-sm">
                            🎉 Bạn đã hoàn thành xuất sắc tất cả các bài tập có sẵn trên hệ thống! Ghé thăm lại sau nhé.
                        </div>
                    )}
                </section>

                {/* Section: Khóa học dành cho bạn */}
                <section id="courses">
                    <h3 className="text-lg font-bold text-text-primary text-left mb-5 font-sans">Khóa học dành cho bạn</h3>
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
