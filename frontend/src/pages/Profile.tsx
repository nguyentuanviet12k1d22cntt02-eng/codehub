import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';
import UserMenuDropdown from '../components/UserMenuDropdown';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const kcNames: Record<string, string> = {
    'KC_VAR': 'Biến & Kiểu dữ liệu (Variables)',
    'KC_COND': 'Câu lệnh rẽ nhánh (Conditionals)',
    'KC_LOOP': 'Vòng lặp (Loops & Iterations)',
    'KC_LIST': 'Cấu trúc Danh sách (Lists)',
    'KC_DICT': 'Từ điển và Tập hợp (Dict/Sets)',
    'KC_FUNC': 'Hàm & Đóng gói Module (Functions)',
    'KC_OOP': 'Lập trình Hướng đối tượng (OOP)'
};

const kcDescriptions: Record<string, string> = {
    'KC_VAR': 'Cú pháp cơ bản, biến số, toán tử số học và gán dữ liệu.',
    'KC_COND': 'Mệnh đề điều kiện logic if, elif, else và biểu thức so sánh.',
    'KC_LOOP': 'Điều khiển dòng lặp for, while, break, continue.',
    'KC_LIST': 'Thao tác chỉ mục, thêm sửa xóa phần tử, duyệt và cắt mảng.',
    'KC_DICT': 'Khóa giá trị, ánh xạ dữ liệu nhanh, tập hợp không lặp.',
    'KC_FUNC': 'Định nghĩa hàm def, đối số truyền vào, giá trị trả về, kiểm thử.',
    'KC_OOP': 'Định nghĩa class, kế thừa, tính đóng gói và đa hình.'
};

interface UserMasteryData {
    success: boolean;
    student_meta: {
        username: string;
        email: string;
        profile: 'STRUGGLING' | 'AVERAGE' | 'EXCELLENT';
    };
    mastery: {
        'PAL-Net': Record<string, number>;
        'BKT': Record<string, number>;
        'DKT': Record<string, number>;
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
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [data, setData] = useState<UserMasteryData | null>(null);
    const [activeModel, setActiveModel] = useState<'PAL-Net' | 'BKT' | 'DKT'>('PAL-Net');
    const [selectedNodeId, setSelectedNodeId] = useState<string>('KC_VAR');

    useEffect(() => {
        const fetchMastery = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE_URL}/api/auth/user-mastery`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(response.data);
            } catch (err: any) {
                console.error(err);
                setError('Không thể tải thông tin tri thức người học.');
            } finally {
                setLoading(false);
            }
        };

        fetchMastery();
    }, [navigate]);

    if (loading) {
        return (
            <div className="bg-bg-primary text-text-primary min-h-screen flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-4 border-accent-custom border-t-transparent rounded-full animate-spin mb-4"></div>
                <div className="text-sm font-semibold text-text-secondary">Đang tính toán ma trận tri thức AI...</div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="bg-bg-primary text-text-primary min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <span className="text-4xl mb-4">⚠️</span>
                <h2 className="text-xl font-bold mb-2">Đã xảy ra lỗi</h2>
                <p className="text-sm text-text-tertiary mb-6">{error || 'Không tìm thấy thông tin cấu hình học viên.'}</p>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-accent-custom hover:bg-accent-hover text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                    Quay về Dashboard
                </button>
            </div>
        );
    }

    const { student_meta, mastery, stats } = data;
    const currentModelMasteries = mastery[activeModel] || {};

    // Calculate overall mastery average
    const kcs = Object.keys(kcNames);
    const overallScore = kcs.length > 0
        ? kcs.reduce((acc, kc) => acc + (currentModelMasteries[kc] || 0), 0) / kcs.length
        : 0;

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
                    <Link to="/adaptive-practice" className="text-text-tertiary hover:text-text-primary no-underline text-[13px] font-semibold tracking-[0.8px] transition-colors">
                        Rèn luyện thích ứng
                    </Link>
                    <Link to="/practice-arena" className="text-text-tertiary hover:text-text-primary no-underline text-[13px] font-semibold tracking-[0.8px] transition-colors">
                        Đấu trường Luyện tập
                    </Link>
                    <Link to="/profile" className="text-accent-custom font-semibold no-underline text-[13px] tracking-[0.8px]">
                        Tri thức cá nhân
                    </Link>
                </nav>
                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <UserMenuDropdown />
                </div>
            </header>

            {/* Content area */}
            <main className="max-w-[1240px] mx-auto px-6 py-8 md:px-10 md:py-12 box-border flex flex-col gap-10">

                {/* Visual Intro Banner */}
                <section className="bg-gradient-to-r from-accent-bg to-transparent rounded-3xl p-6 md:p-10 border border-accent-border/30 text-left flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex flex-col gap-2.5">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-black text-text-primary m-0">Hồ sơ năng lực học tập</h1>
                            <span className={`text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full border ${student_meta.profile === 'EXCELLENT'
                                ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                : student_meta.profile === 'AVERAGE'
                                    ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                    : 'bg-red-500/10 text-red-500 border-red-500/20'
                                }`}>
                                {student_meta.profile === 'EXCELLENT' ? 'Xuất sắc' : student_meta.profile === 'AVERAGE' ? 'Trung bình' : 'Yếu thế'}
                            </span>
                        </div>
                        <p className="text-text-secondary text-sm m-0 max-w-xl leading-relaxed">
                            Mô hình PAL-Net phân tích lịch sử tương tác và ghi nhận xác suất làm đúng của bạn trên các Concept (KC) để vẽ nên bản đồ tri thức tối ưu.
                        </p>
                    </div>

                    <div className="flex gap-4 self-stretch md:self-auto">
                        <div className="bg-bg-secondary border border-border-custom p-4 rounded-2xl flex-1 md:flex-initial text-center flex flex-col justify-center min-w-[110px]">
                            <span className="text-xs text-text-tertiary uppercase font-bold tracking-wide">Luyện tập</span>
                            <span className="text-xl font-extrabold text-accent-custom mt-1">✓ {stats.practice_completed} bài</span>
                        </div>
                        <div className="bg-bg-secondary border border-border-custom p-4 rounded-2xl flex-1 md:flex-initial text-center flex flex-col justify-center min-w-[110px]">
                            <span className="text-xs text-text-tertiary uppercase font-bold tracking-wide">Bài học</span>
                            <span className="text-xl font-extrabold text-text-primary mt-1">📚 {stats.lessons_completed} bài</span>
                        </div>
                    </div>
                </section>

                {/* Cognitive Knowledge Graph (Đồ thị tri thức) */}
                <section className="bg-bg-secondary border border-border-custom rounded-3xl p-6 md:p-8 flex flex-col gap-6 text-left shadow-sm relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-64 h-64 bg-accent-custom/5 rounded-full filter blur-3xl pointer-events-none"></div>

                    <div className="flex flex-col gap-1 z-10">
                        <h2 className="text-xl font-black text-text-primary m-0 flex items-center gap-2">
                            📊 Đồ thị tri thức thích ứng (Cognitive Skill Map)
                        </h2>
                        <p className="text-text-secondary text-xs m-0">
                            Bản đồ trực quan hóa liên kết logic giữa các chủ đề. Màu sắc hiển thị mức độ làm chủ của bạn theo mô hình: <strong className="text-accent-custom">{activeModel} Engine</strong>.
                        </p>
                    </div>

                    <div className="bg-bg-primary rounded-2xl border border-border-custom p-4 md:p-6 overflow-x-auto relative flex justify-center items-center z-10 transition-colors duration-200">
                        <div className="min-w-[850px] w-full flex justify-center">
                            <svg className="w-full h-auto select-none" viewBox="0 0 860 220" style={{ maxWidth: '860px' }}>
                                {/* Defs for arrows */}
                                <defs>
                                    <marker id="arrow" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="var(--text-tertiary)" opacity="0.4" />
                                    </marker>
                                </defs>

                                {/* Render Connection Edges */}
                                {[
                                    { from: 'KC_VAR', to: 'KC_COND' },
                                    { from: 'KC_COND', to: 'KC_LOOP' },
                                    { from: 'KC_LOOP', to: 'KC_LIST' },
                                    { from: 'KC_LOOP', to: 'KC_DICT' },
                                    { from: 'KC_LIST', to: 'KC_FUNC' },
                                    { from: 'KC_DICT', to: 'KC_FUNC' },
                                    { from: 'KC_FUNC', to: 'KC_OOP' }
                                ].map((edge, idx) => {
                                    const nodesList = [
                                        { id: 'KC_VAR', x: 80, y: 110 },
                                        { id: 'KC_COND', x: 220, y: 110 },
                                        { id: 'KC_LOOP', x: 360, y: 110 },
                                        { id: 'KC_LIST', x: 500, y: 60 },
                                        { id: 'KC_DICT', x: 500, y: 160 },
                                        { id: 'KC_FUNC', x: 640, y: 110 },
                                        { id: 'KC_OOP', x: 780, y: 110 }
                                    ];
                                    const fromNode = nodesList.find(n => n.id === edge.from)!;
                                    const toNode = nodesList.find(n => n.id === edge.to)!;
                                    const isHighlighted = selectedNodeId === edge.from || selectedNodeId === edge.to;

                                    const dx = toNode.x - fromNode.x;
                                    const cx1 = fromNode.x + dx * 0.4;
                                    const cy1 = fromNode.y;
                                    const cx2 = fromNode.x + dx * 0.6;
                                    const cy2 = toNode.y;

                                    return (
                                        <g key={`edge-${idx}`}>
                                            {isHighlighted && (
                                                <path
                                                    d={`M ${fromNode.x} ${fromNode.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${toNode.x} ${toNode.y}`}
                                                    fill="none"
                                                    stroke="var(--accent-custom)"
                                                    strokeWidth="4"
                                                    opacity="0.3"
                                                    className="transition-all duration-300"
                                                />
                                            )}
                                            <path
                                                d={`M ${fromNode.x} ${fromNode.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${toNode.x} ${toNode.y}`}
                                                fill="none"
                                                stroke={isHighlighted ? "var(--accent-custom)" : "currentColor"}
                                                strokeWidth="2"
                                                opacity={isHighlighted ? "0.8" : "0.25"}
                                                className="text-text-tertiary transition-all duration-300"
                                                markerEnd="url(#arrow)"
                                            />
                                        </g>
                                    );
                                })}

                                {/* Render Nodes */}
                                {[
                                    { id: 'KC_VAR', label: 'Biến & Kiểu dữ liệu', x: 80, y: 110, shortLabel: 'Variables' },
                                    { id: 'KC_COND', label: 'Cấu trúc rẽ nhánh', x: 220, y: 110, shortLabel: 'Conditionals' },
                                    { id: 'KC_LOOP', label: 'Vòng lặp (Loops)', x: 360, y: 110, shortLabel: 'Loops' },
                                    { id: 'KC_LIST', label: 'Cấu trúc Danh sách', x: 500, y: 60, shortLabel: 'Lists' },
                                    { id: 'KC_DICT', label: 'Từ điển & Tập hợp', x: 500, y: 160, shortLabel: 'Dict & Set' },
                                    { id: 'KC_FUNC', label: 'Hàm & Đóng gói', x: 640, y: 110, shortLabel: 'Functions' },
                                    { id: 'KC_OOP', label: 'Hướng đối tượng', x: 780, y: 110, shortLabel: 'OOP' }
                                ].map((node) => {
                                    const value = currentModelMasteries[node.id] ?? 0.5;
                                    const percentage = Math.round(value * 100);
                                    const isSelected = selectedNodeId === node.id;

                                    let nodeColor = 'text-red-500';
                                    let glowColor = 'rgba(239, 68, 68, 0.4)';
                                    if (value >= 0.75) {
                                        nodeColor = 'text-green-500';
                                        glowColor = 'rgba(34, 197, 94, 0.4)';
                                    } else if (value >= 0.50) {
                                        nodeColor = 'text-yellow-500';
                                        glowColor = 'rgba(234, 179, 8, 0.4)';
                                    }

                                    return (
                                        <g
                                            key={node.id}
                                            transform={`translate(${node.x}, ${node.y})`}
                                            className="cursor-pointer group"
                                            onClick={() => setSelectedNodeId(node.id)}
                                        >
                                            {/* Selected dotted outline circle */}
                                            {isSelected && (
                                                <circle
                                                    r="29"
                                                    fill="none"
                                                    stroke="var(--accent-custom)"
                                                    strokeWidth="2"
                                                    strokeDasharray="4 2"
                                                    className="animate-spin"
                                                    style={{ animationDuration: '6s' }}
                                                />
                                            )}

                                            <circle
                                                r="24"
                                                fill="var(--bg-secondary)"
                                                className="transition-all duration-200"
                                            />

                                            <circle
                                                r="22"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth={isSelected ? "4" : "2.5"}
                                                className={`${nodeColor} transition-all duration-200 group-hover:scale-105`}
                                                style={{ filter: isSelected ? `drop-shadow(0 0 6px ${glowColor})` : 'none' }}
                                            />

                                            <text
                                                textAnchor="middle"
                                                dy=".3em"
                                                className="font-mono font-black text-[11px] fill-text-primary pointer-events-none"
                                            >
                                                {percentage}%
                                            </text>

                                            <text
                                                x="0"
                                                y={node.y > 100 ? "38" : "-32"}
                                                textAnchor="middle"
                                                className={`text-[10px] uppercase tracking-wider font-extrabold transition-colors pointer-events-none ${isSelected ? 'fill-accent-custom' : 'fill-text-secondary group-hover:fill-text-primary'}`}
                                            >
                                                {node.shortLabel}
                                            </text>
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>
                    </div>

                    {/* Explanatory node descriptor card */}
                    <div className="bg-bg-primary rounded-2xl border border-border-custom p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 z-10 transition-colors duration-200">
                        {(() => {
                            const nodesDetails = [
                                { id: 'KC_VAR', label: 'Biến & Kiểu dữ liệu', shortLabel: 'Variables' },
                                { id: 'KC_COND', label: 'Cấu trúc điều kiện rẽ nhánh', shortLabel: 'Conditionals' },
                                { id: 'KC_LOOP', label: 'Vòng lặp (Loops)', shortLabel: 'Loops' },
                                { id: 'KC_LIST', label: 'Cấu trúc Danh sách (Lists)', shortLabel: 'Lists' },
                                { id: 'KC_DICT', label: 'Từ điển và Tập hợp (Dict/Sets)', shortLabel: 'Dict & Set' },
                                { id: 'KC_FUNC', label: 'Hàm và Đóng gói Module', shortLabel: 'Functions' },
                                { id: 'KC_OOP', label: 'Lập trình Hướng đối tượng (OOP)', shortLabel: 'OOP' }
                            ];
                            const activeNode = nodesDetails.find(n => n.id === selectedNodeId)!;
                            const value = currentModelMasteries[selectedNodeId] ?? 0.5;
                            const percentage = Math.round(value * 100);
                            let statusText = 'Cần cải thiện (Yếu)';
                            let labelStyle = 'bg-red-500/10 text-red-500 border-red-500/20';
                            if (value >= 0.75) {
                                statusText = 'Đã nắm vững (Tốt)';
                                labelStyle = 'bg-green-500/10 text-green-500 border-green-500/20';
                            } else if (value >= 0.5) {
                                statusText = 'Đang phát triển (Trung bình)';
                                labelStyle = 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
                            }

                            return (
                                <>
                                    <div className="flex flex-col gap-2 text-left">
                                        <div className="flex items-center gap-2.5 flex-wrap">
                                            <span className="text-[10px] font-black text-accent-custom bg-accent-bg px-2 py-0.5 rounded border border-accent-border uppercase tracking-wider">
                                                {selectedNodeId}
                                            </span>
                                            <h3 className="text-base font-extrabold text-text-primary m-0">
                                                {activeNode.label}
                                            </h3>
                                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${labelStyle}`}>
                                                {statusText} • {percentage}%
                                            </span>
                                        </div>
                                        <p className="text-xs text-text-secondary m-0 leading-relaxed max-w-2xl">
                                            {kcDescriptions[selectedNodeId] || ''} Lộ trình rèn luyện gợi ý sẽ tự động tối ưu các bài tập thuộc vùng kiến thức này để kéo điểm số mục tiêu của bạn lên cao hơn.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => navigate('/adaptive-practice')}
                                        className="bg-accent-custom hover:bg-accent-hover text-white text-xs font-extrabold px-5 py-3 rounded-xl transition-all cursor-pointer shadow-sm hover:shadow active:scale-95 shrink-0 border-none duration-150"
                                    >
                                        Rèn luyện thích ứng ngay &rarr;
                                    </button>
                                </>
                            );
                        })()}
                    </div>
                </section>

                {/* Grid Layout layout for charts & detailed tables */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left: Overall mastery stats and algorithm selectors */}
                    <div className="lg:col-span-1 flex flex-col gap-6">
                        <div className="bg-bg-secondary border border-border-custom rounded-2xl p-6 text-left flex flex-col gap-5">
                            <h3 className="text-base font-extrabold text-text-primary m-0">Thuật toán đánh giá</h3>

                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => setActiveModel('PAL-Net')}
                                    className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${activeModel === 'PAL-Net'
                                        ? 'bg-accent-bg border-accent-custom text-accent-custom shadow-sm'
                                        : 'bg-bg-primary border-border-custom text-text-secondary hover:border-text-tertiary'
                                        }`}
                                >
                                    <span className="text-xs font-black">PAL-Net Model</span>
                                    <span className="text-[10px] opacity-80">Phối hợp đặc trưng đồ thị tri thức và EMA giải bài.</span>
                                </button>

                                <button
                                    onClick={() => setActiveModel('BKT')}
                                    className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${activeModel === 'BKT'
                                        ? 'bg-accent-bg border-accent-custom text-accent-custom shadow-sm'
                                        : 'bg-bg-primary border-border-custom text-text-secondary hover:border-text-tertiary'
                                        }`}
                                >
                                    <span className="text-xs font-black">Bayesian Knowledge Tracing (BKT)</span>
                                    <span className="text-[10px] opacity-80">Lọc Bayes chuẩn cập nhật xác suất nắm vững theo chuỗi học.</span>
                                </button>

                                <button
                                    onClick={() => setActiveModel('DKT')}
                                    className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${activeModel === 'DKT'
                                        ? 'bg-accent-bg border-accent-custom text-accent-custom shadow-sm'
                                        : 'bg-bg-primary border-border-custom text-text-secondary hover:border-text-tertiary'
                                        }`}
                                >
                                    <span className="text-xs font-black">Deep Knowledge Tracing (DKT)</span>
                                    <span className="text-[10px] opacity-80">Mạng dây thần kinh LSTM dự đoán xu hướng học dài hạn.</span>
                                </button>
                            </div>

                            <hr className="border-border-custom my-1" />

                            <div className="text-center pt-2 flex flex-col items-center">
                                <span className="text-xs text-text-tertiary uppercase font-bold tracking-wide">Trình độ trung bình ({activeModel})</span>
                                <div className="relative w-28 h-28 flex items-center justify-center mt-4">
                                    {/* Simple Circular Progress Bar using SVG */}
                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--border-custom)" strokeWidth="8" />
                                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--accent-custom)" strokeWidth="8"
                                            strokeDasharray={251.2}
                                            strokeDashoffset={251.2 * (1 - overallScore)}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute flex flex-col items-center">
                                        <span className="text-2xl font-black text-text-primary">{(overallScore * 100).toFixed(0)}%</span>
                                        <span className="text-[9px] text-[#ff9f0a] font-bold mt-0.5">⭐ Mastery</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: KC Mastery Progress breakdown items */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <div className="bg-bg-secondary border border-border-custom rounded-2xl p-6 md:p-8 text-left flex flex-col gap-6">
                            <div className="flex justify-between items-center border-b border-border-custom pb-4">
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-lg font-black text-text-primary m-0">Chi tiết ma trận tri thức</h3>
                                    <p className="text-xs text-text-tertiary m-0">Xác suất thành thạo lý thuyết và thực hành trên từng kỹ năng.</p>
                                </div>
                                <span className="text-xs font-bold text-accent-custom bg-accent-bg border border-accent-border/30 px-3 py-1 rounded-lg">
                                    {activeModel} Engine
                                </span>
                            </div>

                            <div className="flex flex-col gap-5">
                                {kcs.map((kc) => {
                                    const value = currentModelMasteries[kc] ?? 0.5;
                                    const percentage = Math.round(value * 100);
                                    let statusColor = 'bg-red-500';
                                    let textColor = 'text-red-500';
                                    if (value >= 0.75) {
                                        statusColor = 'bg-green-500';
                                        textColor = 'text-green-500';
                                    } else if (value >= 0.50) {
                                        statusColor = 'bg-yellow-500';
                                        textColor = 'text-yellow-500';
                                    }

                                    return (
                                        <div key={kc} className="flex flex-col gap-2">
                                            <div className="flex justify-between items-start">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black text-text-primary">{kcNames[kc]}</span>
                                                    <span className="text-[10px] text-text-tertiary mt-0.5">{kcDescriptions[kc]}</span>
                                                </div>
                                                <span className={`text-xs font-bold ${textColor}`}>{percentage}%</span>
                                            </div>
                                            <div className="w-full bg-bg-primary h-3 rounded-full overflow-hidden border border-border-custom select-none">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-500 ${statusColor}`}
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="bg-bg-primary border border-border-custom rounded-xl p-4 flex gap-3 text-xs leading-relaxed text-text-secondary mt-2">
                                <span className="text-base">💡</span>
                                <p className="m-0">
                                    <strong>Gợi ý:</strong> Bạn có thể bắt đầu tăng độ thông hiểu các kỹ năng có điểm dưới <strong>75%</strong> bằng cách bấm vào trang <strong>Rèn luyện thích ứng</strong> để làm thử thách AI tối ưu thích hợp.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;
