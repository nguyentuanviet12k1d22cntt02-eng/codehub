import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import UserMenuDropdown from '../../../components/UserMenuDropdown';
import { KnowledgeGraphTree } from '../../adaptive-learning/components/KnowledgeGraphTree';
import type { SupportedLanguage } from '../../adaptive-learning/components/KnowledgeGraphTree';
import pythonSkillGraph from '../../../data/pythonSkillGraph.json';
import javascriptSkillGraph from '../../../data/javascriptSkillGraph.json';
import cppSkillGraph from '../../../data/cppSkillGraph.json';
import sqlSkillGraph from '../../../data/sqlSkillGraph.json';
import { 
    AlertTriangle,
    Home,
    BookOpen,
    Compass,
    Code2,
    Award,
    Search,
    Bell,
    Layers
} from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';

interface UserMasteryData {
    success: boolean;
    language?: string;
    student_meta: {
        username: string;
        email: string;
        profile: 'STRUGGLING' | 'AVERAGE' | 'EXCELLENT';
    };
    mastery: {
        'PAL-Net': Record<string, number>;
    };
    stats: {
        lessons_completed: number;
        practice_completed: number;
        streak_days: number;
        total_actions: number;
    };
}

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('PYTHON');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [data, setData] = useState<UserMasteryData | null>(null);
    const [masteryCache, setMasteryCache] = useState<Partial<Record<SupportedLanguage, UserMasteryData>>>({});
    const [activeModel, setActiveModel] = useState<'PAL-Net'>('PAL-Net');
    const [topSearch, setTopSearch] = useState<string>('');

    useEffect(() => {
        const fetchMastery = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            // If already cached, switch instantly!
            if (masteryCache[selectedLanguage]) {
                setData(masteryCache[selectedLanguage]!);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE_URL}/api/auth/user-mastery`, {
                    params: { language: selectedLanguage },
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(response.data);
                setMasteryCache(prev => ({
                    ...prev,
                    [selectedLanguage]: response.data
                }));
            } catch (err: any) {
                console.error(err);
                setError('Không thể tải thông tin tri thức người học.');
            } finally {
                setLoading(false);
            }
        };

        fetchMastery();
    }, [navigate, selectedLanguage, masteryCache]);

    // Resolve active skill graph for overall score calculation
    const activeGraph = useMemo(() => {
        switch (selectedLanguage) {
            case 'JAVASCRIPT': return javascriptSkillGraph;
            case 'CPP': return cppSkillGraph;
            case 'SQL': return sqlSkillGraph;
            case 'PYTHON':
            default: return pythonSkillGraph;
        }
    }, [selectedLanguage]);

    const skillsList = useMemo(() => activeGraph.skills || [], [activeGraph]);
    const currentModelMasteries = useMemo(() => {
        return data?.mastery?.[activeModel] || {};
    }, [data, activeModel]);

    const overallScore = useMemo(() => {
        if (!skillsList.length) return 0.32;
        const total = skillsList.reduce((acc: number, s: any) => acc + (currentModelMasteries[s.id] ?? 0.5), 0);
        return Math.max(0.32, total / skillsList.length);
    }, [skillsList, currentModelMasteries]);

    if (error && !data) {
        return (
            <div className="bg-[#F4F7FC] text-slate-800 min-h-screen flex flex-col items-center justify-center p-6 text-center font-sans">
                <AlertTriangle className="w-12 h-12 text-amber-500 mb-3 animate-pulse" />
                <h2 className="text-xl font-bold mb-2 text-slate-900">Đã xảy ra lỗi</h2>
                <p className="text-sm text-slate-500 mb-6">{error || 'Không tìm thấy thông tin cấu hình học viên.'}</p>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
                >
                    Quay về Trang chủ
                </button>
            </div>
        );
    }

    const student_meta = data?.student_meta || {
        username: 'Nguyễn Tuấn Việt',
        email: '',
        profile: 'AVERAGE' as const
    };
    const stats = data?.stats || {
        lessons_completed: 0,
        practice_completed: 0,
        streak_days: 3,
        total_actions: 0
    };

    return (
        <div className="bg-[#F4F7FC] text-slate-800 min-h-screen flex flex-col font-sans antialiased selection:bg-blue-500 selection:text-white">
            
            {/* ========================================================================= */}
            {/* TOP NAVIGATION BAR MATCHING THE EXACT PYLEARN DESIGN MOCKUP              */}
            {/* ========================================================================= */}
            <header className="flex justify-between items-center px-6 py-2.5 border-b border-slate-200/90 bg-white sticky top-0 z-50 shadow-2xs">
                
                {/* Left: PyLearn Logo & Subtitle */}
                <div 
                    className="flex items-center gap-2.5 cursor-pointer select-none group"
                    onClick={() => navigate('/dashboard')}
                >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xs p-1.5">
                        {/* Python Icon */}
                        <svg viewBox="0 0 128 128" fill="none" className="w-full h-full">
                            <path d="M63.5 12C36.2 12 37.8 23.8 37.8 23.8L37.9 36H64.4V39.7H27.3C27.3 39.7 12 37.9 12 65.5C12 93.1 25.3 92 25.3 92H34.4V79.2C34.4 79.2 33.9 63.8 49.6 63.8H76.2C76.2 63.8 90.7 64.3 90.7 50.1V24.3C90.7 24.3 92.8 12 63.5 12ZM50.8 20.3C53.7 20.3 56 22.6 56 25.5C56 28.4 53.7 30.7 50.8 30.7C47.9 30.7 45.6 28.4 45.6 25.5C45.6 22.6 47.9 20.3 50.8 20.3Z" fill="#FFFFFF" />
                            <path d="M64.5 116C91.8 116 90.2 104.2 90.2 104.2L90.1 92H63.6V88.3H100.7C100.7 88.3 116 90.1 116 62.5C116 34.9 102.7 36 102.7 36H93.6V48.8C93.6 48.8 94.1 64.2 78.4 64.2H51.8C51.8 64.2 37.3 63.7 37.3 77.9V103.7C37.3 103.7 35.2 116 64.5 116ZM77.2 107.7C74.3 107.7 72 105.4 72 102.5C72 99.6 74.3 97.3 77.2 97.3C80.1 97.3 82.4 99.6 82.4 102.5C82.4 105.4 80.1 107.7 77.2 107.7Z" fill="#FBBF24" />
                        </svg>
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-base font-extrabold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                                PyLearn
                            </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium m-0 -mt-0.5 whitespace-nowrap">
                            Học Python - Kiến tạo tương lai
                        </p>
                    </div>
                </div>
                
                {/* Center: Main App Nav Items with Active State */}
                <nav className="hidden xl:flex items-center gap-7">
                    <Link 
                        to="/dashboard" 
                        className="text-slate-600 hover:text-blue-600 no-underline text-xs font-semibold tracking-wide transition-colors flex items-center gap-1.5 py-2"
                    >
                        <Home className="w-4 h-4 text-slate-400" />
                        <span>Trang chủ</span>
                    </Link>

                    <Link 
                        to="/" 
                        className="text-slate-600 hover:text-blue-600 no-underline text-xs font-semibold tracking-wide transition-colors flex items-center gap-1.5 py-2"
                    >
                        <BookOpen className="w-4 h-4 text-slate-400" />
                        <span>Khóa học</span>
                    </Link>

                    <Link 
                        to="/personalized-path" 
                        className="text-slate-600 hover:text-blue-600 no-underline text-xs font-semibold tracking-wide transition-colors flex items-center gap-1.5 py-2"
                    >
                        <Compass className="w-4 h-4 text-slate-400" />
                        <span>Lộ trình học</span>
                    </Link>

                    {/* Active Tab: Bản đồ tri thức */}
                    <Link 
                        to="/profile" 
                        className="text-blue-600 font-bold no-underline text-xs tracking-wide flex items-center gap-1.5 relative py-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600"
                    >
                        <Layers className="w-4 h-4 text-blue-600" />
                        <span>Bản đồ tri thức</span>
                    </Link>

                    <Link 
                        to="/practice-arena" 
                        className="text-slate-600 hover:text-blue-600 no-underline text-xs font-semibold tracking-wide transition-colors flex items-center gap-1.5 py-2"
                    >
                        <Code2 className="w-4 h-4 text-slate-400" />
                        <span>Luyện tập</span>
                    </Link>

                    <Link 
                        to="/quiz/1" 
                        className="text-slate-600 hover:text-blue-600 no-underline text-xs font-semibold tracking-wide transition-colors flex items-center gap-1.5 py-2"
                    >
                        <Award className="w-4 h-4 text-slate-400" />
                        <span>Chứng chỉ</span>
                    </Link>
                </nav>

                {/* Right: Search Bar, Bell Notifications, User Profile */}
                <div className="flex items-center gap-3">
                    
                    {/* Top Search Bar */}
                    <div className="relative hidden md:block w-56 lg:w-64">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text"
                            placeholder="Tìm kiếm bài học, khái niệm..."
                            value={topSearch}
                            onChange={(e) => setTopSearch(e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-2xs"
                        />
                    </div>

                    {/* Notification Bell */}
                    <button 
                        className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Thông báo"
                    >
                        <Bell className="w-4 h-4" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
                    </button>

                    {/* User Profile Menu Dropdown */}
                    <UserMenuDropdown />
                </div>
            </header>

            {/* ========================================================================= */}
            {/* MAIN INTERACTIVE DAG KNOWLEDGE GRAPH EXPERIENCE                           */}
            {/* ========================================================================= */}
            <main className="flex-1 flex flex-col w-full max-w-[1850px] mx-auto p-4 md:p-6 overflow-hidden">
                <KnowledgeGraphTree
                    userMastery={currentModelMasteries}
                    activeLanguage={selectedLanguage}
                    onLanguageChange={setSelectedLanguage}
                    isLoading={loading}
                    activeModel={activeModel}
                    onModelChange={setActiveModel}
                    overallScore={overallScore}
                    streakDays={stats.streak_days}
                    studentMeta={student_meta}
                    stats={stats}
                    isFullPage={true}
                />
            </main>
        </div>
    );
};

export default Profile;
