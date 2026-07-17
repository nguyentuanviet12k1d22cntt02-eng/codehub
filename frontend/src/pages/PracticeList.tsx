import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ThemeToggle } from '../components/ThemeToggle';
import { getInitialTheme } from '../utils/themeHelper';

interface Tag {
    id: string;
    name: string;
    slug: string;
}

interface Problem {
    id: string;
    title: string;
    slug: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    tags: Tag[];
    status: 'PASSED' | 'FAILED' | 'NOT_ATTEMPTED';
}

interface LeaderboardEntry {
    rank: number;
    username: string;
    avatarUrl: string | null;
    score: number;
    solvedCount: number;
    lastSolvedAt: string;
}

const PracticeList: React.FC = () => {
    const navigate = useNavigate();
    const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(getInitialTheme());
    const [username, setUsername] = useState<string>('Học viên');
    const [activeView, setActiveView] = useState<'problems' | 'leaderboard'>('problems');

    // Filter states
    const [search, setSearch] = useState<string>('');
    const [difficulty, setDifficulty] = useState<string>('');
    const [selectedTag, setSelectedTag] = useState<string>('');
    const [status, setStatus] = useState<string>('');

    // Data states
    const [problems, setProblems] = useState<Problem[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [leaderboardLoading, setLeaderboardLoading] = useState<boolean>(false);

    useEffect(() => {
        const handleThemeChange = () => {
            setCurrentTheme(getInitialTheme());
        };
        window.addEventListener('theme-change', handleThemeChange);
        return () => window.removeEventListener('theme-change', handleThemeChange);
    }, []);

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

    // Fetch problems and tags
    const fetchProblems = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const params: any = {};
            if (difficulty) params.difficulty = difficulty;
            if (selectedTag) params.tag = selectedTag;
            if (status) params.status = status;
            if (search) params.search = search;

            const response = await axios.get('http://localhost:3000/api/auth/practice/problems', {
                headers,
                params
            });
            setProblems(response.data.problems);
            setTags(response.data.tags);
        } catch (err) {
            console.error('Lỗi khi fetch bài tập:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch leaderboard
    const fetchLeaderboard = async () => {
        setLeaderboardLoading(true);
        try {
            const response = await axios.get('http://localhost:3000/api/auth/practice/leaderboard');
            setLeaderboard(response.data);
        } catch (err) {
            console.error('Lỗi khi fetch bảng xếp hạng:', err);
        } finally {
            setLeaderboardLoading(false);
        }
    };

    useEffect(() => {
        if (activeView === 'problems') {
            fetchProblems();
        } else {
            fetchLeaderboard();
        }
    }, [activeView, difficulty, selectedTag, status, search]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="bg-bg-primary text-text-primary min-h-screen w-full relative overflow-hidden flex flex-col font-sans select-none transition-colors duration-200">
            {/* Header */}
            <header className="flex justify-between items-center px-6 py-4 md:px-10 border-b border-border-custom bg-bg-secondary/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-200">
                <div className="flex items-center gap-2">
                    <span
                        className="text-2xl font-bold tracking-tight text-text-primary cursor-pointer no-underline"
                        onClick={() => navigate('/dashboard')}
                    >
                        MCODE
                    </span>
                    <span className="text-[9px] font-bold bg-accent-bg text-accent-custom px-1.5 py-0.5 rounded border border-accent-border tracking-wider uppercase">
                        ARENA
                    </span>
                </div>
                <nav className="hidden md:flex gap-8">
                    <Link to="/dashboard" className="text-text-tertiary hover:text-text-primary no-underline text-[13px] font-medium tracking-[0.8px] transition-colors duration-200">
                        Dashboard
                    </Link>
                    <Link to="/practice-arena" className="text-accent-custom font-semibold no-underline text-[13px] tracking-[0.8px]">
                        Đấu trường Luyện tập
                    </Link>
                </nav>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent-bg border border-accent-border flex items-center justify-center text-[13px] font-bold text-accent-custom uppercase">
                            {username.substring(0, 2)}
                        </div>
                        <span className="hidden sm:inline text-xs font-semibold text-text-secondary">{username}</span>
                        <button
                            onClick={handleLogout}
                            className="bg-bg-tertiary hover:bg-red-500 hover:text-white px-3 py-1.5 rounded border border-border-custom text-[11px] font-bold text-text-secondary transition-all duration-200 cursor-pointer"
                        >
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 flex flex-col gap-6">
                {/* Banner & Tab Switcher */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-bg-secondary p-6 rounded-2xl border border-border-custom shadow-sm relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-64 h-64 bg-accent-color/5 rounded-full filter blur-3xl pointer-events-none"></div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight mb-2">Đấu trường Luyện tập Thuật toán</h1>
                        <p className="text-text-tertiary text-sm max-w-xl">
                            Giải các thử thách giải thuật độc lập hỗ trợ Python, JS, C++ và C. Tích lũy điểm để thăng hạng trên bảng xếp hạng học viên.
                        </p>
                    </div>
                    <div className="flex bg-bg-primary p-1 rounded-lg border border-border-custom self-start md:self-auto">
                        <button
                            onClick={() => setActiveView('problems')}
                            className={`px-4 py-2 rounded-md text-xs font-bold transition-all duration-200 cursor-pointer ${
                                activeView === 'problems'
                                    ? 'bg-bg-secondary text-accent-custom shadow-sm border border-border-custom'
                                    : 'text-text-tertiary hover:text-text-primary'
                            }`}
                        >
                            Thử thách (Problems)
                        </button>
                        <button
                            onClick={() => setActiveView('leaderboard')}
                            className={`px-4 py-2 rounded-md text-xs font-bold transition-all duration-200 cursor-pointer ${
                                activeView === 'leaderboard'
                                    ? 'bg-bg-secondary text-accent-custom shadow-sm border border-border-custom'
                                    : 'text-text-tertiary hover:text-text-primary'
                            }`}
                        >
                            Bảng xếp hạng (Leaderboard)
                        </button>
                    </div>
                </div>

                {activeView === 'problems' ? (
                    /* VIEW 1: Problems List with Filters */
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Filters Sidebar */}
                        <div className="w-full lg:w-64 flex flex-col gap-5 shrink-0">
                            <div className="bg-bg-secondary p-5 rounded-2xl border border-border-custom shadow-sm flex flex-col gap-4">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-text-tertiary">Tìm kiếm</h3>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Tên bài tập..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full bg-bg-primary border border-border-custom rounded-lg px-3 py-2 text-xs text-text-primary outline-none focus:border-accent-custom transition-all"
                                    />
                                </div>

                                <div className="border-t border-border-custom my-1"></div>

                                <h3 className="text-xs font-bold uppercase tracking-wider text-text-tertiary">Độ khó</h3>
                                <div className="flex flex-col gap-2">
                                    {['', 'EASY', 'MEDIUM', 'HARD'].map((diff) => (
                                        <button
                                            key={diff}
                                            onClick={() => setDifficulty(diff)}
                                            className={`text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                                difficulty === diff
                                                    ? 'bg-accent-bg text-accent-custom border border-accent-border/30'
                                                    : 'hover:bg-bg-tertiary text-text-secondary'
                                            }`}
                                        >
                                            {diff === '' ? 'Tất cả độ khó' : diff === 'EASY' ? 'Dễ (Easy)' : diff === 'MEDIUM' ? 'Trung bình (Medium)' : 'Khó (Hard)'}
                                        </button>
                                    ))}
                                </div>

                                <div className="border-t border-border-custom my-1"></div>

                                <h3 className="text-xs font-bold uppercase tracking-wider text-text-tertiary">Trạng thái</h3>
                                <div className="flex flex-col gap-2">
                                    {['', 'PASSED', 'FAILED', 'NOT_ATTEMPTED'].map((st) => (
                                        <button
                                            key={st}
                                            onClick={() => setStatus(st)}
                                            className={`text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                                status === st
                                                    ? 'bg-accent-bg text-accent-custom border border-accent-border/30'
                                                    : 'hover:bg-bg-tertiary text-text-secondary'
                                            }`}
                                        >
                                            {st === '' ? 'Tất cả trạng thái' : st === 'PASSED' ? 'Đã giải thành công' : st === 'FAILED' ? 'Nộp bài bị lỗi' : 'Chưa thử sức'}
                                        </button>
                                    ))}
                                </div>

                                <div className="border-t border-border-custom my-1"></div>

                                <h3 className="text-xs font-bold uppercase tracking-wider text-text-tertiary">Chuyên đề (Tags)</h3>
                                <div className="flex flex-wrap gap-1.5">
                                    <button
                                        onClick={() => setSelectedTag('')}
                                        className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border transition-all ${
                                            selectedTag === ''
                                                ? 'bg-accent-custom text-white border-accent-custom'
                                                : 'bg-bg-primary text-text-secondary border-border-custom hover:border-text-tertiary'
                                        }`}
                                    >
                                        Tất cả
                                    </button>
                                    {tags.map((tag) => (
                                        <button
                                            key={tag.id}
                                            onClick={() => setSelectedTag(tag.slug)}
                                            className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border transition-all ${
                                                selectedTag === tag.slug
                                                    ? 'bg-accent-custom text-white border-accent-custom'
                                                    : 'bg-bg-primary text-text-secondary border-border-custom hover:border-text-tertiary'
                                            }`}
                                        >
                                            {tag.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Problems List Grid */}
                        <div className="flex-1 flex flex-col gap-4">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center p-20 bg-bg-secondary rounded-2xl border border-border-custom">
                                    <div className="w-8 h-8 border-4 border-accent-custom border-t-transparent rounded-full animate-spin mb-4"></div>
                                    <span className="text-xs text-text-tertiary font-medium">Đang tải danh sách bài tập...</span>
                                </div>
                            ) : problems.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-20 bg-bg-secondary rounded-2xl border border-border-custom text-center">
                                    <span className="text-3xl mb-2">🔍</span>
                                    <h3 className="text-sm font-bold mb-1">Không tìm thấy bài tập nào</h3>
                                    <p className="text-xs text-text-tertiary max-w-xs">Hãy thử thay đổi điều kiện bộ lọc hoặc nhập từ khóa tìm kiếm khác.</p>
                                </div>
                            ) : (
                                problems.map((problem) => (
                                    <div
                                        key={problem.id}
                                        className="bg-bg-secondary p-5 rounded-2xl border border-border-custom hover:border-accent-custom/50 shadow-sm hover:shadow transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                                    >
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2.5">
                                                {problem.status === 'PASSED' && (
                                                    <span className="text-green-500 text-xs font-bold bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20 flex items-center gap-1">
                                                        ✓ Đã giải
                                                    </span>
                                                )}
                                                {problem.status === 'FAILED' && (
                                                    <span className="text-red-500 text-xs font-bold bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 flex items-center gap-1">
                                                        ✗ Thử sức lỗi
                                                    </span>
                                                )}
                                                <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border ${
                                                    problem.difficulty === 'EASY'
                                                        ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                        : problem.difficulty === 'MEDIUM'
                                                        ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                                        : 'bg-red-500/10 text-red-500 border-red-500/20'
                                                }`}>
                                                    {problem.difficulty}
                                                </span>
                                            </div>
                                            <Link
                                                to={`/practice-arena/${problem.slug}`}
                                                className="text-base font-bold text-text-primary hover:text-accent-custom no-underline transition-colors"
                                            >
                                                {problem.title}
                                            </Link>
                                            <div className="flex flex-wrap gap-1.5 mt-1">
                                                {problem.tags.map((tag) => (
                                                    <span
                                                        key={tag.id}
                                                        className="text-[9px] font-bold text-text-tertiary bg-bg-primary border border-border-custom px-2 py-0.5 rounded uppercase tracking-wider"
                                                    >
                                                        {tag.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/practice-arena/${problem.slug}`)}
                                            className="self-start sm:self-auto bg-bg-primary hover:bg-accent-custom hover:text-white px-5 py-2.5 rounded-xl border border-border-custom group-hover:border-accent-custom text-xs font-bold text-text-secondary transition-all cursor-pointer"
                                        >
                                            Thử tài giải thuật →
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ) : (
                    /* VIEW 2: Leaderboard Table */
                    <div className="bg-bg-secondary rounded-2xl border border-border-custom shadow-sm overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-border-custom flex justify-between items-center bg-bg-tertiary/20">
                            <div>
                                <h2 className="text-base font-bold">Xếp hạng Thách đấu MCODE</h2>
                                <p className="text-text-tertiary text-xs mt-1">Điểm tích lũy: Easy = 10, Medium = 30, Hard = 50. Người nộp sớm hơn xếp trên khi bằng điểm.</p>
                            </div>
                        </div>

                        {leaderboardLoading ? (
                            <div className="flex flex-col items-center justify-center p-20">
                                <div className="w-8 h-8 border-4 border-accent-custom border-t-transparent rounded-full animate-spin mb-4"></div>
                                <span className="text-xs text-text-tertiary font-medium">Đang tải bảng xếp hạng...</span>
                            </div>
                        ) : leaderboard.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-20 text-center">
                                <span className="text-3xl mb-2">🏆</span>
                                <h3 className="text-sm font-bold mb-1">Chưa có ai giải thành công bài tập nào</h3>
                                <p className="text-xs text-text-tertiary max-w-xs">Hãy là người đầu tiên giải được các bài toán thuật toán và đứng đầu bảng xếp hạng!</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-border-custom text-xs font-bold text-text-tertiary uppercase tracking-wider bg-bg-tertiary/30">
                                            <th className="py-4 px-6 text-center w-16">Hạng</th>
                                            <th className="py-4 px-6">Học viên</th>
                                            <th className="py-4 px-6 text-center">Số bài đã giải</th>
                                            <th className="py-4 px-6 text-center">Điểm tích lũy</th>
                                            <th className="py-4 px-6 text-right">Lần cuối vượt qua</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {leaderboard.map((entry) => (
                                            <tr
                                                key={entry.rank}
                                                className={`border-b border-border-custom text-sm font-medium hover:bg-bg-tertiary/20 transition-all ${
                                                    entry.rank === 1
                                                        ? 'bg-yellow-500/5'
                                                        : entry.rank === 2
                                                        ? 'bg-slate-400/5'
                                                        : entry.rank === 3
                                                        ? 'bg-amber-600/5'
                                                        : ''
                                                }`}
                                            >
                                                <td className="py-4 px-6 text-center font-bold">
                                                    {entry.rank === 1 ? (
                                                        <span className="text-xl">🏆</span>
                                                    ) : entry.rank === 2 ? (
                                                        <span className="text-xl">🥈</span>
                                                    ) : entry.rank === 3 ? (
                                                        <span className="text-xl">🥉</span>
                                                    ) : (
                                                        entry.rank
                                                    )}
                                                </td>
                                                <td className="py-4 px-6 flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-accent-bg border border-accent-border flex items-center justify-center text-xs font-bold text-accent-custom uppercase">
                                                        {entry.username.substring(0, 2)}
                                                    </div>
                                                    <span className="font-bold text-text-primary">{entry.username}</span>
                                                </td>
                                                <td className="py-4 px-6 text-center font-bold text-text-secondary">{entry.solvedCount}</td>
                                                <td className="py-4 px-6 text-center">
                                                    <span className="bg-accent-bg text-accent-custom font-extrabold px-3 py-1 rounded-full border border-accent-border text-xs">
                                                        {entry.score} pts
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-right text-xs text-text-tertiary">
                                                    {new Date(entry.lastSolvedAt).toLocaleString('vi-VN')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default PracticeList;
