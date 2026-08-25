import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const kcNames: Record<string, string> = {
    'KC_VAR': 'Biến & Kiểu dữ liệu',
    'KC_COND': 'Câu lệnh rẽ nhánh (if/else)',
    'KC_LOOP': 'Vòng lặp (for/while)',
    'KC_LIST': 'Cấu trúc Danh sách (List)',
    'KC_DICT': 'Từ điển và Tập hợp (Dict/Set)',
    'KC_FUNC': 'Hàm & Đóng gói Module',
    'KC_OOP': 'Lập trình Hướng đối tượng'
};

interface RecommendItem {
    id: string;
    type: 'LESSON_EXERCISE' | 'PRACTICE_PROBLEM';
    title: string;
    kc_id: string;
    predicted_mastery: number;
    zpd_score: number;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    lesson_id?: string;
    slug?: string;
}

const AdaptivePractice: React.FC = () => {
    const navigate = useNavigate();
    const [selectedAlgo, setSelectedAlgo] = useState<string>('PAL-Net');
    const [recommendations, setRecommendations] = useState<RecommendItem[]>([]);
    const [username, setUsername] = useState<string>('Học viên');
    const [loading, setLoading] = useState<boolean>(true);
    const [engineName, setEngineName] = useState<string>('');

    // Decode token to get username
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const decoded = JSON.parse(atob(base64));
                if (decoded && decoded.username) {
                    setUsername(decoded.username);
                }
            } catch (e) {
                console.error(e);
            }
        }
    }, []);

    // Filters state
    const [filterType, setFilterType] = useState<'ALL' | 'LESSON_EXERCISE' | 'PRACTICE_PROBLEM'>('ALL');
    const [filterDifficulty, setFilterDifficulty] = useState<'ALL' | 'EASY' | 'MEDIUM' | 'HARD'>('ALL');

    const fetchRecommendations = async (algoName: string) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            // Fetch 15 recommendations for a full training library
            const response = await axios.get(`${API_BASE_URL}/api/auth/recommendations?algo=${algoName}&limit=15`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data && response.data.success) {
                setRecommendations(response.data.data || []);
                setEngineName(response.data.engine || algoName);
            }
        } catch (err) {
            console.error("Error fetching adaptive practice: ", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecommendations(selectedAlgo);
    }, [selectedAlgo]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleRecClick = (item: RecommendItem) => {
        if (item.type === 'LESSON_EXERCISE' && item.lesson_id) {
            navigate(`/practice/${item.lesson_id}`);
        } else if (item.type === 'PRACTICE_PROBLEM' && item.slug) {
            navigate(`/practice-arena/${item.slug}`);
        }
    };

    // Filtered Recommendations list
    const filteredRecs = recommendations.filter(item => {
        const matchesType = filterType === 'ALL' || item.type === filterType;
        const matchesDiff = filterDifficulty === 'ALL' || item.difficulty === filterDifficulty;
        return matchesType && matchesDiff;
    });

    return (
        <div className="bg-bg-primary text-text-primary min-h-screen font-sans transition-colors duration-200">
            {/* Header navbar */}
            <header className="flex justify-between items-center px-6 py-4 md:px-10 border-b border-border-custom bg-bg-secondary sticky top-0 z-50 transition-colors duration-200">
                <div className="flex items-center gap-3">
                    <span
                        className="text-2xl font-extrabold tracking-tight text-text-primary cursor-pointer hover:opacity-85 no-underline"
                        onClick={() => navigate('/dashboard')}
                    >
                        MCODE
                    </span>
                    <span className="text-[9px] font-bold bg-accent-bg text-accent-custom px-1.5 py-0.5 rounded border border-accent-border tracking-wider uppercase">
                        PYTHON
                    </span>
                </div>
                <nav className="hidden md:flex gap-8">
                    <Link to="/dashboard" className="text-text-tertiary hover:text-text-primary no-underline text-[13px] font-semibold tracking-[0.8px] transition-colors">
                        Dashboard
                    </Link>
                    <Link to="/adaptive-practice" className="text-accent-custom font-semibold no-underline text-[13px] tracking-[0.8px]">
                        Rèn luyện thích ứng
                    </Link>
                    <Link to="/practice-arena" className="text-text-tertiary hover:text-text-primary no-underline text-[13px] font-semibold tracking-[0.8px] transition-colors">
                        Đấu trường Luyện tập
                    </Link>
                    <Link to="/profile" className="text-text-tertiary hover:text-text-primary no-underline text-[13px] font-semibold tracking-[0.8px] transition-colors">
                        Tri thức cá nhân
                    </Link>
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

            {/* Dashboard body */}
            <main className="max-w-[1240px] mx-auto px-6 py-8 md:px-10 md:py-12 box-border flex flex-col gap-8">

                {/* Intro Section */}
                <section className="text-left flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-black tracking-tight text-text-primary m-0">Đề xuất rèn luyện cá nhân hóa</h1>
                            <span className="text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded tracking-wider">
                                {engineName === 'FALLBACK_RULE_BASED' ? '⚖️ Base Rules fallback' : `🧠 AI Engine: ${engineName}`}
                            </span>
                        </div>
                        <p className="text-text-tertiary text-sm m-0">
                            Rèn luyện theo Vùng Phát triển Gần nhất (ZPD) dựa trên tri thức hiện tại của bạn để tối ưu thời gian học.
                        </p>
                    </div>

                    {/* Engine selection controller */}
                    <div className="flex items-center gap-3 bg-bg-secondary p-1.5 rounded-xl border border-border-custom text-xs font-semibold self-stretch md:self-auto justify-between">
                        <span className="text-text-tertiary pl-2">Chọn mô hình:</span>
                        <select
                            value={selectedAlgo}
                            onChange={(e) => setSelectedAlgo(e.target.value)}
                            className="bg-bg-primary text-text-primary border border-border-custom rounded-lg px-3 py-1.5 outline-none focus:border-accent-custom cursor-pointer"
                        >
                            <option value="PAL-Net">PAL-Net (Khuyên dùng)</option>
                            <option value="BKT">Bayesian (BKT)</option>
                            <option value="DKT">Deep Network (DKT)</option>
                        </select>
                    </div>
                </section>

                {/* Filter and control bar */}
                <section className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-bg-secondary rounded-2xl border border-border-custom gap-4 text-left">
                    {/* Left filters */}
                    <div className="flex flex-wrap gap-4 text-xs">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-text-tertiary uppercase">Loại thử thách</span>
                            <div className="flex bg-bg-primary p-1 rounded-lg border border-border-custom">
                                <button
                                    onClick={() => setFilterType('ALL')}
                                    className={`px-3 py-1.5 rounded-md font-semibold cursor-pointer transition-all ${filterType === 'ALL' ? 'bg-bg-secondary text-accent-custom shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
                                >
                                    Tất cả
                                </button>
                                <button
                                    onClick={() => setFilterType('LESSON_EXERCISE')}
                                    className={`px-3 py-1.5 rounded-md font-semibold cursor-pointer transition-all ${filterType === 'LESSON_EXERCISE' ? 'bg-bg-secondary text-accent-custom shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
                                >
                                    Bài học chính khóa
                                </button>
                                <button
                                    onClick={() => setFilterType('PRACTICE_PROBLEM')}
                                    className={`px-3 py-1.5 rounded-md font-semibold cursor-pointer transition-all ${filterType === 'PRACTICE_PROBLEM' ? 'bg-bg-secondary text-accent-custom shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
                                >
                                    Đấu trường rèn luyện
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-text-tertiary uppercase">Độ khó</span>
                            <div className="flex bg-bg-primary p-1 rounded-lg border border-border-custom">
                                {['ALL', 'EASY', 'MEDIUM', 'HARD'].map(diff => (
                                    <button
                                        key={diff}
                                        onClick={() => setFilterDifficulty(diff as any)}
                                        className={`px-3 py-1.5 rounded-md font-semibold cursor-pointer transition-all uppercase ${filterDifficulty === diff ? 'bg-bg-secondary text-accent-custom shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
                                    >
                                        {diff === 'ALL' ? 'Tất cả' : diff}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="text-xs text-text-tertiary shrink-0">
                        Hiển thị <strong>{filteredRecs.length}</strong> / <strong>{recommendations.length}</strong> đề xuất rèn luyện
                    </div>
                </section>

                {/* Recommendations grid */}
                <section>
                    {loading ? (
                        <div className="py-24 text-center">
                            <div className="w-10 h-10 border-4 border-accent-custom border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <span className="text-text-tertiary text-sm font-semibold">Mô hình AI đang định vị tri thức của bạn...</span>
                        </div>
                    ) : filteredRecs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                            {filteredRecs.map((item) => {
                                const difficultyColor =
                                    item.difficulty === 'EASY' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-500/20' :
                                        item.difficulty === 'MEDIUM' ? 'text-amber-400 bg-amber-400/10 border-amber-500/20' :
                                            'text-rose-400 bg-rose-400/10 border-rose-500/20';

                                const typeLabel = item.type === 'LESSON_EXERCISE' ? 'BÀI HỌC CHÍNH KHÓA' : 'ĐẤU TRƯỜNG TỰ DO';
                                const typeColor = item.type === 'LESSON_EXERCISE' ? 'text-[#c084fc] bg-[#c084fc]/10 border-[#c084fc]/20' : 'text-blue-400 bg-blue-400/10 border-blue-500/20';

                                return (
                                    <div
                                        key={item.id}
                                        className="bg-bg-secondary hover:bg-bg-secondary/70 border border-border-custom hover:border-text-tertiary/20 rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 group gap-5 shadow-sm"
                                    >
                                        <div className="flex flex-col gap-3.5">
                                            {/* Labels status */}
                                            <div className="flex flex-wrap gap-2 text-[9px] font-black tracking-wider uppercase">
                                                <span className={`px-2 py-0.5 rounded border ${typeColor}`}>{typeLabel}</span>
                                                <span className={`px-2 py-0.5 rounded border ${difficultyColor}`}>{item.difficulty}</span>
                                            </div>

                                            {/* Problem Title */}
                                            <h3 className="text-base font-extrabold text-text-primary group-hover:text-accent-custom leading-snug m-0 transition-colors duration-200">
                                                {item.title}
                                            </h3>

                                            {/* Concept component */}
                                            <div className="flex flex-col gap-1 text-[11px] text-text-secondary mt-1">
                                                <span className="font-bold text-text-tertiary">Kỹ năng mục tiêu:</span>
                                                <span className="font-semibold">{kcNames[item.kc_id] || item.kc_id}</span>
                                            </div>

                                            {/* Stats predictions bar */}
                                            <div className="bg-bg-primary rounded-xl p-3 border border-border-custom flex justify-between items-center text-xs font-mono">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-[9px] text-text-tertiary uppercase font-bold">Thâm niên độ thạo</span>
                                                    <span className="font-extrabold text-[#ff9f0a]">{Math.round(item.predicted_mastery * 1000) / 10}%</span>
                                                </div>
                                                <div className="flex flex-col gap-0.5 items-end">
                                                    <span className="text-[9px] text-text-tertiary uppercase font-bold">Chỉ số ZPD</span>
                                                    <span className="font-extrabold text-accent-custom">{Math.round(item.zpd_score * 100) / 100}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action link */}
                                        <button
                                            onClick={() => handleRecClick(item)}
                                            className="w-full bg-[#1c1c1e] dark:bg-white text-white dark:text-black font-extrabold text-xs py-3 rounded-xl hover:bg-accent-custom hover:text-white dark:hover:bg-accent-custom dark:hover:text-white transition-all cursor-pointer border border-border-custom"
                                        >
                                            Bắt đầu giải thử thách →
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-24 bg-bg-secondary rounded-2xl border border-border-custom text-center text-text-tertiary text-sm flex flex-col items-center justify-center gap-3">
                            <span className="text-3xl">🏅</span>
                            <span>Không có đề xuất nào phù hợp với bộ lọc hiện tại của bạn.</span>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default AdaptivePractice;
