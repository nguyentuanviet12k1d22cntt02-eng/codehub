import React, { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Search, 
    CheckCircle2, 
    Sparkles, 
    ArrowRight, 
    Layers, 
    ZoomIn, 
    ZoomOut, 
    X, 
    Code2, 
    BookOpen, 
    Flame, 
    Target, 
    Copy, 
    Check, 
    Clock,
    Info,
    Play,
    SlidersHorizontal,
    GraduationCap,
    BarChart2,
    Compass
} from 'lucide-react';
import defaultSkillGraph from '../../../data/pythonSkillGraph.json';
import { MascotWavingBannerIllustration } from '../../ai-tutor/components/AITutorIllustrations';

export interface KnowledgeGraphTreeProps {
    userMastery: Record<string, number>;
    activeModel: 'PAL-Net' | 'BKT' | 'DKT';
    onModelChange?: (model: 'PAL-Net' | 'BKT' | 'DKT') => void;
    overallScore: number;
    streakDays?: number;
    studentMeta?: {
        username: string;
        email: string;
        profile: 'STRUGGLING' | 'AVERAGE' | 'EXCELLENT';
    };
    stats?: {
        lessons_completed: number;
        practice_completed: number;
        streak_days: number;
        total_actions: number;
    };
    isFullPage?: boolean;
}

// 5 Main Stages matching the user's mockup image
const STAGE_METADATA: Record<number, { title: string; subtitle: string; tag: string }> = {
    0: { title: 'Cơ bản & Nền tảng', subtitle: 'Biến, Kiểu dữ liệu, Toán tử, Chuỗi', tag: 'STAGE 1' },
    1: { title: 'Luồng điều khiển', subtitle: 'Mệnh đề if, Vòng lặp For/While', tag: 'STAGE 2' },
    2: { title: 'Cấu trúc dữ liệu', subtitle: 'List, Tuple, Dict, Set, Comp', tag: 'STAGE 3' },
    3: { title: 'Hàm & Phạm vi', subtitle: 'Def, Lambda, Scope, Generator', tag: 'STAGE 4' },
    4: { title: 'Ngoại lệ & File I/O', subtitle: 'Try/Except, Đọc/Ghi tệp tin', tag: 'STAGE 5' },
    5: { title: 'Hướng đối tượng (OOP)', subtitle: 'Class, Kế thừa, Đa hình, Magic', tag: 'STAGE 6' },
};

// Topic Filter pills matching user's image
const TOPIC_PILLS = [
    { id: 'ALL', label: 'Tất cả' },
    { id: 'MOD-BASICS', label: 'Cơ bản & Làm quen' },
    { id: 'TOPIC-CASTING', label: 'Biến, Kiểu dữ liệu' },
    { id: 'MOD-FLOW', label: 'Cấu trúc điều khiển' },
    { id: 'MOD-FUNC', label: 'Hàm' },
    { id: 'MOD-COLLECTIONS', label: 'Danh sách & Bộ' },
    { id: 'TOPIC-STRING', label: 'Chuỗi ký tự' },
    { id: 'MOD-EXC-IO', label: 'Tệp tin' },
    { id: 'TOPIC-SCOPE', label: 'Thư viện' },
    { id: 'MOD-OOP', label: 'Hướng đối tượng' },
    { id: 'ADVANCED', label: 'Nâng cao' },
];

// Rich Python code examples for concepts to display in the inspector code block
const CONCEPT_CODE_SNIPPETS: Record<string, { lines: { text: string; comment?: string }[]; time: string }> = {
    'PY-BASICS-01': {
        time: '30 phút',
        lines: [
            { text: '# Khởi tạo biến và kiểu dữ liệu', comment: '' },
            { text: 'ho_ten = "Nguyễn Tuấn Việt"', comment: '# Kiểu str' },
            { text: 'tuoi = 21', comment: '# Kiểu int' },
            { text: 'diem_tb = 8.75', comment: '# Kiểu float' },
            { text: 'is_active = True', comment: '# Kiểu bool' },
            { text: '', comment: '' },
            { text: 'print(f"Xin chào {ho_ten}, tuổi: {tuoi}")', comment: '# f-string' }
        ]
    },
    'PY-BASICS-02': {
        time: '45 phút',
        lines: [
            { text: '# Các kiểu dữ liệu cơ bản', comment: '' },
            { text: 'ten = "Python"', comment: '# chuỗi' },
            { text: 'tuoi = 18', comment: '# số nguyên' },
            { text: 'diem = 9.5', comment: '# số thực' },
            { text: 'la_hoc_sinh = True', comment: '# boolean' },
            { text: '', comment: '' },
            { text: 'print(ten, tuoi, diem, la_hoc_sinh)', comment: '' }
        ]
    },
    'PY-BASICS-03': {
        time: '35 phút',
        lines: [
            { text: '# Toán tử số học và logic', comment: '' },
            { text: 'a, b = 10, 3', comment: '' },
            { text: 'tong = a + b', comment: '# 13' },
            { text: 'chia_lay_du = a % b', comment: '# 1' },
            { text: 'luy_thua = a ** b', comment: '# 1000' },
            { text: 'dieu_kien = (a > 5) and (b < 10)', comment: '# True' },
            { text: 'print("Kết quả:", tong, dieu_kien)', comment: '' }
        ]
    },
    'PY-STRING-01': {
        time: '40 phút',
        lines: [
            { text: '# Indexing & Slicing trên Chuỗi', comment: '' },
            { text: 's = "Python Mastery"', comment: '' },
            { text: 'first_char = s[0]', comment: '# \'P\'' },
            { text: 'sub = s[0:6]', comment: '# \'Python\'' },
            { text: 'reversed_s = s[::-1]', comment: '# Đảo ngược chuỗi' },
            { text: 'print("Chuỗi con:", sub, reversed_s)', comment: '' }
        ]
    },
    'PY-FLOW-01': {
        time: '40 phút',
        lines: [
            { text: '# Cấu trúc điều kiện if - elif - else', comment: '' },
            { text: 'diem = 8.5', comment: '' },
            { text: 'if diem >= 8.5:', comment: '' },
            { text: '    xep_loai = "Giỏi"', comment: '' },
            { text: 'elif diem >= 6.5:', comment: '' },
            { text: '    xep_loai = "Khá"', comment: '' },
            { text: 'else:', comment: '' },
            { text: '    xep_loai = "Trung bình"', comment: '' },
            { text: 'print(f"Xếp loại: {xep_loai}")', comment: '' }
        ]
    },
    'PY-FLOW-03': {
        time: '45 phút',
        lines: [
            { text: '# Vòng lặp for ... in range()', comment: '' },
            { text: 'tong_chan = 0', comment: '' },
            { text: 'for i in range(1, 11):', comment: '# 1 đến 10' },
            { text: '    if i % 2 == 0:', comment: '' },
            { text: '        tong_chan += i', comment: '' },
            { text: 'print(f"Tổng số chẵn 1..10: {tong_chan}")', comment: '# 30' }
        ]
    },
    'PY-LIST-01': {
        time: '50 phút',
        lines: [
            { text: '# Thao tác CRUD trên List', comment: '' },
            { text: 'playlist = ["Song A", "Song B"]', comment: '' },
            { text: 'playlist.append("Song C")', comment: '# Thêm cuối' },
            { text: 'playlist.insert(0, "Song VIP")', comment: '# Chèn đầu' },
            { text: 'playlist.remove("Song B")', comment: '# Xóa phần tử' },
            { text: 'print("Hàng đợi nhạc:", playlist)', comment: '' }
        ]
    }
};

export const KnowledgeGraphTree: React.FC<KnowledgeGraphTreeProps> = ({
    userMastery,
    activeModel,
    onModelChange,
    overallScore,
    streakDays = 3,
    studentMeta,
    stats: _stats,
    isFullPage: _isFullPage = true
}) => {
    const navigate = useNavigate();
    const [graphData] = useState<any>(defaultSkillGraph);
    const [selectedTopicPill, setSelectedTopicPill] = useState<string>('ALL');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedConceptId, setSelectedConceptId] = useState<string>('PY-BASICS-02');
    const [zoomLevel, setZoomLevel] = useState<number>(1);
    const [copiedSyntax, setCopiedSyntax] = useState<boolean>(false);
    const [isExecuting, setIsExecuting] = useState<boolean>(false);
    const [executionOutput, setExecutionOutput] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Danh sách skills/concepts
    const allSkills = useMemo(() => graphData.skills || [], [graphData]);
    const allEdges = useMemo(() => graphData.edges || [], [graphData]);

    // Map skill ID to concept object
    const skillMap = useMemo(() => {
        const map = new Map<string, any>();
        allSkills.forEach((s: any) => map.set(s.id, s));
        return map;
    }, [allSkills]);

    // Active concept being inspected in the Right Drawer
    const activeConcept = useMemo(() => {
        return skillMap.get(selectedConceptId) || allSkills[1] || allSkills[0] || null;
    }, [skillMap, selectedConceptId, allSkills]);

    // Filter skills theo module/topic pill & search
    const filteredSkills = useMemo(() => {
        return allSkills.filter((skill: any) => {
            let matchesFilter = true;
            if (selectedTopicPill !== 'ALL') {
                if (selectedTopicPill.startsWith('MOD-')) {
                    matchesFilter = skill.module_id === selectedTopicPill;
                } else if (selectedTopicPill.startsWith('TOPIC-')) {
                    matchesFilter = skill.topic_id === selectedTopicPill;
                } else if (selectedTopicPill === 'ADVANCED') {
                    matchesFilter = skill.difficulty_level >= 3 || skill.module_id === 'MOD-OOP';
                }
            }
            const query = searchQuery.trim().toLowerCase();
            const matchesSearch = !query || 
                skill.concept_id.toLowerCase().includes(query) ||
                skill.concept_name.toLowerCase().includes(query) ||
                (skill.associated_errors || []).some((err: string) => err.toLowerCase().includes(query));
            
            return matchesFilter && matchesSearch;
        });
    }, [allSkills, selectedTopicPill, searchQuery]);

    // Trạng thái mastery của concept (Matching Mockup 4 Legends: Đang học, Đã hoàn thành, Chưa mở khóa, Đề xuất)
    const getConceptStatus = (skillId: string) => {
        const score = userMastery[skillId] ?? 0.53;
        const pct = Math.round(score * 100);
        
        if (score >= 0.75) {
            return {
                status: 'COMPLETED',
                legend: 'COMPLETED',
                label: 'Đã hoàn thành',
                badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
                iconColor: 'bg-blue-600 text-white',
                dotColor: 'bg-blue-600',
                ringColor: '#2563EB',
                border: 'border-blue-200 hover:border-blue-400',
                pct
            };
        } else if (score >= 0.50) {
            return {
                status: 'IN_PROGRESS',
                legend: 'IN_PROGRESS',
                label: '⚡ Đang rèn luyện (ZPD)',
                badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
                iconColor: 'bg-emerald-500 text-white',
                dotColor: 'bg-emerald-500',
                ringColor: '#10B981',
                border: 'border-slate-200 hover:border-blue-400',
                pct
            };
        } else if (score >= 0.35) {
            return {
                status: 'RECOMMENDED',
                legend: 'RECOMMENDED',
                label: '🟣 Đề xuất tiếp theo',
                badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
                iconColor: 'bg-purple-600 text-white',
                dotColor: 'bg-purple-600',
                ringColor: '#8B5CF6',
                border: 'border-purple-200 hover:border-purple-400',
                pct
            };
        } else {
            return {
                status: 'LOCKED',
                legend: 'LOCKED',
                label: 'Chưa mở khóa',
                badgeBg: 'bg-slate-100 text-slate-500 border-slate-200',
                iconColor: 'bg-slate-300 text-slate-600',
                dotColor: 'bg-slate-400',
                ringColor: '#CBD5E1',
                border: 'border-slate-200 hover:border-slate-300 opacity-80',
                pct
            };
        }
    };

    // Phân nhóm 5 Stages chuẩn hóa
    const stageGroups = useMemo(() => {
        const moduleOrder: Record<string, number> = {
            'MOD-BASICS': 0,
            'MOD-FLOW': 1,
            'MOD-COLLECTIONS': 2,
            'MOD-FUNC': 3,
            'MOD-EXC-IO': 4,
            'MOD-OOP': 5
        };
        const groups: Record<number, any[]> = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [] };
        filteredSkills.forEach((skill: any) => {
            const stage = moduleOrder[skill.module_id] ?? 0;
            groups[stage].push(skill);
        });
        return groups;
    }, [filteredSkills]);

    // Layout tọa độ cho từng node (Grid phân tầng khoa học)
    const nodeLayout = useMemo(() => {
        const positions = new Map<string, { x: number; y: number; stage: number }>();
        const colWidth = 295;
        const rowHeight = 125;
        const startX = 25;
        const startY = 110;

        Object.keys(stageGroups).forEach((stageStr) => {
            const stage = Number(stageStr);
            const skillsInStage = stageGroups[stage] || [];
            skillsInStage.forEach((skill: any, idx: number) => {
                positions.set(skill.id, {
                    x: startX + stage * colWidth,
                    y: startY + idx * rowHeight,
                    stage
                });
            });
        });

        return positions;
    }, [stageGroups]);

    // Cạnh liên kết trên đồ thị (SVG Bezier)
    const visibleEdges = useMemo(() => {
        return allEdges.filter((edge: any) => {
            return nodeLayout.has(edge.source) && nodeLayout.has(edge.target);
        });
    }, [allEdges, nodeLayout]);

    // Concept kế tiếp đề xuất
    const recommendedNextConcept = useMemo(() => {
        if (!activeConcept) return null;
        const outgoing = allEdges.filter((e: any) => e.source === activeConcept.id);
        if (outgoing.length > 0) {
            return skillMap.get(outgoing[0].target) || null;
        }
        // Fallback: lấy bài tiếp theo trong danh sách
        const idx = allSkills.findIndex((s: any) => s.id === activeConcept.id);
        if (idx >= 0 && idx + 1 < allSkills.length) {
            return allSkills[idx + 1];
        }
        return null;
    }, [activeConcept, allEdges, skillMap, allSkills]);

    // Lấy snippet code ví dụ cho concept hiện tại
    const currentCodeSnippet = useMemo(() => {
        if (!activeConcept) return null;
        return CONCEPT_CODE_SNIPPETS[activeConcept.id] || {
            time: '45 phút',
            lines: [
                { text: `# Ví dụ minh họa: ${activeConcept.concept_name}`, comment: '' },
                { text: `def execute_${activeConcept.concept_id.toLowerCase().replace(/-/g, '_')}():`, comment: '# Khởi tạo' },
                { text: `    status = "Mastered"`, comment: '# Trạng thái' },
                { text: `    print(f"Hoàn thành kiến thức {status}")`, comment: '' },
                { text: ``, comment: '' },
                { text: `execute_${activeConcept.concept_id.toLowerCase().replace(/-/g, '_')}()`, comment: '' }
            ]
        };
    }, [activeConcept]);

    // Xử lý sao chép code
    const handleCopyCode = () => {
        if (!currentCodeSnippet) return;
        const rawCode = currentCodeSnippet.lines.map(l => l.text + (l.comment ? `  ${l.comment}` : '')).join('\n');
        navigator.clipboard.writeText(rawCode);
        setCopiedSyntax(true);
        setTimeout(() => setCopiedSyntax(false), 2000);
    };

    // Chạy thử code mô phỏng
    const handleRunCode = () => {
        setIsExecuting(true);
        setExecutionOutput(null);
        setTimeout(() => {
            setIsExecuting(false);
            if (activeConcept.id === 'PY-BASICS-02') {
                setExecutionOutput('Python 18 9.5 True\n>>> Chương trình kết thúc với mã 0 (0.04s)');
            } else {
                setExecutionOutput(`[Output thành công]: Thực thi mẫu ${activeConcept.concept_name}\n>>> Kết quả kiểm tra đạt tiêu chuẩn.`);
            }
        }, 600);
    };

    // Điều hướng học tập thích ứng
    const handleStartPractice = () => {
        if (!activeConcept) return;
        navigate('/personalized-path', {
            state: { 
                initialPrompt: `Tôi muốn luyện tập chuyên sâu về chủ đề ${activeConcept.concept_name} (${activeConcept.concept_id}) trong Python`,
                targetConceptId: activeConcept.concept_id 
            }
        });
    };

    return (
        <div className="w-full flex-1 flex flex-col font-sans bg-[#F4F7FC] text-slate-800 antialiased selection:bg-blue-500 selection:text-white pb-6">
            
            {/* ========================================================================= */}
            {/* 1. STUDENT IDENTITY & OVERALL STATS HERO CARD (Header Card)              */}
            {/* ========================================================================= */}
            <div className="bg-white rounded-2xl p-4 md:p-5 shadow-xs border border-slate-200/80 mb-3.5 flex flex-wrap items-center justify-between gap-4">
                {/* Left: User Avatar & Persona */}
                <div className="flex items-center gap-3.5 min-w-[280px]">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center text-white shadow-xs p-2.5 shrink-0">
                        {/* Python Double Snake Emblem */}
                        <svg viewBox="0 0 128 128" fill="none" className="w-full h-full">
                            <path d="M63.5 12C36.2 12 37.8 23.8 37.8 23.8L37.9 36H64.4V39.7H27.3C27.3 39.7 12 37.9 12 65.5C12 93.1 25.3 92 25.3 92H34.4V79.2C34.4 79.2 33.9 63.8 49.6 63.8H76.2C76.2 63.8 90.7 64.3 90.7 50.1V24.3C90.7 24.3 92.8 12 63.5 12ZM50.8 20.3C53.7 20.3 56 22.6 56 25.5C56 28.4 53.7 30.7 50.8 30.7C47.9 30.7 45.6 28.4 45.6 25.5C45.6 22.6 47.9 20.3 50.8 20.3Z" fill="#F8FAFC" />
                            <path d="M64.5 116C91.8 116 90.2 104.2 90.2 104.2L90.1 92H63.6V88.3H100.7C100.7 88.3 116 90.1 116 62.5C116 34.9 102.7 36 102.7 36H93.6V48.8C93.6 48.8 94.1 64.2 78.4 64.2H51.8C51.8 64.2 37.3 63.7 37.3 77.9V103.7C37.3 103.7 35.2 116 64.5 116ZM77.2 107.7C74.3 107.7 72 105.4 72 102.5C72 99.6 74.3 97.3 77.2 97.3C80.1 97.3 82.4 99.6 82.4 102.5C82.4 105.4 80.1 107.7 77.2 107.7Z" fill="#FBBF24" />
                        </svg>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight m-0">
                                {studentMeta?.username || 'Nguyễn Tuấn Việt'}
                            </h2>
                            <span className="text-[11px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">
                                Học viên
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium m-0 mt-0.5">
                            Hành trình trở thành Backend Developer với Python
                        </p>
                    </div>
                </div>

                {/* Middle: 4 Key Statistics Columns */}
                <div className="flex items-center gap-6 lg:gap-8 flex-wrap">
                    {/* Stat 1: Khóa học đang học */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                            <BookOpen className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <span className="text-[11px] text-slate-500 font-medium block">Khóa học đang học</span>
                            <span className="text-xs md:text-sm font-extrabold text-slate-900 block">
                                Python Cơ bản
                            </span>
                        </div>
                    </div>

                    {/* Stat 2: Tiến độ tổng */}
                    <div className="flex flex-col justify-center min-w-[120px]">
                        <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-[11px] text-slate-500 font-medium">Tiến độ tổng</span>
                            <span className="text-xs font-extrabold text-blue-600">
                                {Math.max(32, Math.round(overallScore * 100))}%
                            </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full transition-all duration-500" 
                                style={{ width: `${Math.max(32, Math.round(overallScore * 100))}%` }}
                            />
                        </div>
                    </div>

                    {/* Stat 3: Streak hôm nay */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 border border-amber-100 flex items-center justify-center shrink-0">
                            <Flame className="w-5 h-5 text-amber-500 fill-amber-500/20" />
                        </div>
                        <div>
                            <span className="text-[11px] text-slate-500 font-medium block">Streak hôm nay</span>
                            <span className="text-xs md:text-sm font-extrabold text-slate-900 block">
                                {streakDays || 3} ngày
                            </span>
                        </div>
                    </div>

                    {/* Stat 4: Tổng thời gian học */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
                            <Clock className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <span className="text-[11px] text-slate-500 font-medium block">Tổng thời gian học</span>
                            <span className="text-xs md:text-sm font-extrabold text-slate-900 block">
                                12 giờ 45 phút
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right: Cute Mascot Banner Illustration */}
                <div className="hidden xl:flex items-center shrink-0 pl-2">
                    <MascotWavingBannerIllustration speechText="Cố lên bạn nhé! 💙" />
                </div>
            </div>

            {/* ========================================================================= */}
            {/* 2. TOPIC FILTER PILLS BAR & SEARCH INPUT                                  */}
            {/* ========================================================================= */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3.5">
                {/* Horizontal Scrollable Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none text-xs">
                    {TOPIC_PILLS.map((pill) => {
                        const isSelected = selectedTopicPill === pill.id;
                        return (
                            <button
                                key={pill.id}
                                onClick={() => setSelectedTopicPill(pill.id)}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer shadow-xs flex items-center gap-1.5 ${
                                    isSelected
                                        ? 'bg-blue-600 text-white font-bold shadow-blue-500/20 shadow-sm'
                                        : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                            >
                                {pill.id === 'ALL' && <Layers className="w-3.5 h-3.5" />}
                                <span>{pill.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Search Bar + Settings Filter Button */}
                <div className="flex items-center gap-2 min-w-[260px] sm:w-80">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Tìm concept hoặc bài học..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-slate-200/90 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 shadow-xs transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                    <button 
                        className="p-2 rounded-xl bg-white border border-slate-200/90 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-xs cursor-pointer transition-all"
                        title="Bộ lọc nâng cao"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* ========================================================================= */}
            {/* 3. MAIN WORKSPACE: INTERACTIVE CANVAS + SLIDE-OUT DETAIL DRAWER           */}
            {/* ========================================================================= */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs flex-1 flex flex-col overflow-hidden min-h-[660px]">
                
                {/* 3.1 Canvas Top Header: Title & 4 Color Status Legends */}
                <div className="px-6 py-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-white z-10">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Layers className="w-4 h-4 text-blue-600" />
                        </div>
                        <h3 className="text-sm font-extrabold text-slate-900 m-0 flex items-center gap-1.5">
                            Bản đồ tri thức Python
                            <span title="Đồ thị tri thức định hướng thích ứng cá nhân hóa theo vùng nhận thức (ZPD).">
                                <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                            </span>
                        </h3>
                    </div>

                    {/* 4 Status Legends matching user's image */}
                    <div className="flex items-center gap-5 text-xs text-slate-600 font-medium">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                            <span>Đang học</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-blue-100" />
                            <span>Đã hoàn thành</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-slate-400 ring-4 ring-slate-100" />
                            <span>Chưa mở khóa</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 ring-4 ring-purple-100" />
                            <span>Đề xuất tiếp theo</span>
                        </div>
                    </div>
                </div>

                {/* 3.2 Split View: Left Graph Canvas & Right Detail Drawer */}
                <div className="relative flex-1 flex overflow-hidden">
                    
                    {/* Visual Canvas Area */}
                    <div 
                        ref={containerRef}
                        className="flex-1 overflow-auto p-6 relative bg-[#FAFBFD] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px]"
                    >
                        <div 
                            className="relative transition-transform duration-200 origin-top-left pb-16"
                            style={{ 
                                transform: `scale(${zoomLevel})`,
                                minWidth: selectedTopicPill === 'ALL' ? '1800px' : '900px',
                                minHeight: '920px'
                            }}
                        >
                            {/* Stage Headers on Top of Canvas */}
                            <div className="absolute top-0 left-0 w-full pointer-events-none z-10">
                                {Object.entries(STAGE_METADATA).map(([stageNum, meta]) => {
                                    const s = Number(stageNum);
                                    const count = (stageGroups[s] || []).length;
                                    if (count === 0 && selectedTopicPill !== 'ALL') return null;
                                    return (
                                        <div 
                                            key={s} 
                                            style={{ 
                                                position: 'absolute', 
                                                left: `${25 + s * 295}px`, 
                                                top: '8px', 
                                                width: '260px' 
                                            }}
                                            className="bg-white/90 backdrop-blur-xs p-3 rounded-xl border border-slate-200/70 shadow-2xs flex flex-col gap-0.5 select-none"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase tracking-wider">
                                                    {meta.tag}
                                                </span>
                                                <span className="text-[10px] font-semibold text-slate-400">
                                                    {count} bài học
                                                </span>
                                            </div>
                                            <h4 className="text-xs font-bold text-slate-900 truncate m-0 mt-1">
                                                {meta.title}
                                            </h4>
                                            <p className="text-[10px] text-slate-500 truncate m-0">
                                                {meta.subtitle}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* SVG Prerequisite Connecting Curves (Bezier) */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                                <defs>
                                    <linearGradient id="curveGradDefault" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#CBD5E1" stopOpacity="0.6" />
                                        <stop offset="100%" stopColor="#94A3B8" stopOpacity="0.8" />
                                    </linearGradient>
                                    <linearGradient id="curveGradActive" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.9" />
                                        <stop offset="100%" stopColor="#2563EB" stopOpacity="1" />
                                    </linearGradient>
                                    <marker id="dotArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                                        <path d="M0,0 L0,6 L6,3 z" fill="#94A3B8" />
                                    </marker>
                                    <marker id="dotArrowActive" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                                        <path d="M0,0 L0,6 L6,3 z" fill="#2563EB" />
                                    </marker>
                                </defs>

                                {visibleEdges.map((edge: any, idx: number) => {
                                    const srcPos = nodeLayout.get(edge.source);
                                    const tgtPos = nodeLayout.get(edge.target);
                                    if (!srcPos || !tgtPos) return null;

                                    const x1 = srcPos.x + 260; // Mép phải card nguồn
                                    const y1 = srcPos.y + 44;
                                    const x2 = tgtPos.x;       // Mép trái card đích
                                    const y2 = tgtPos.y + 44;
                                    
                                    const isConnectedToSelected = 
                                        edge.source === selectedConceptId || edge.target === selectedConceptId;

                                    const dx = Math.max(30, (x2 - x1) * 0.5);
                                    const pathD = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

                                    return (
                                        <path
                                            key={`${edge.source}-${edge.target}-${idx}`}
                                            d={pathD}
                                            fill="none"
                                            stroke={isConnectedToSelected ? 'url(#curveGradActive)' : 'url(#curveGradDefault)'}
                                            strokeWidth={isConnectedToSelected ? 2.5 : 1.5}
                                            markerEnd={isConnectedToSelected ? 'url(#dotArrowActive)' : 'url(#dotArrow)'}
                                            strokeDasharray={isConnectedToSelected ? undefined : '4 3'}
                                            className="transition-all duration-300"
                                        />
                                    );
                                })}
                            </svg>

                            {/* Concept Nodes Grid */}
                            <div className="relative z-10">
                                {filteredSkills.map((skill: any) => {
                                    const pos = nodeLayout.get(skill.id);
                                    if (!pos) return null;

                                    const { label, ringColor, pct } = getConceptStatus(skill.id);
                                    const isSelected = selectedConceptId === skill.id;
                                    const hasError = (skill.associated_errors || []).length > 0;
                                    const primaryError = hasError ? skill.associated_errors[0].split(':')[0] : null;

                                    return (
                                        <div
                                            key={skill.id}
                                            onClick={() => setSelectedConceptId(skill.id)}
                                            style={{
                                                position: 'absolute',
                                                left: `${pos.x}px`,
                                                top: `${pos.y}px`,
                                                width: '260px'
                                            }}
                                            className={`group rounded-xl p-3 bg-white border transition-all duration-200 cursor-pointer select-none shadow-xs ${
                                                isSelected 
                                                    ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md scale-[1.02] z-20' 
                                                    : 'border-slate-200/90 hover:border-blue-300 hover:shadow-sm'
                                            }`}
                                        >
                                            {/* Top Row: Concept ID with Icon + Error Tag */}
                                            <div className="flex items-center justify-between gap-2 mb-1.5">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-5 h-5 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                                        <Code2 className="w-3 h-3 text-blue-600" />
                                                    </div>
                                                    <span className="text-[10px] font-mono font-bold text-slate-500 tracking-wider">
                                                        {skill.concept_id}
                                                    </span>
                                                </div>

                                                {primaryError && (
                                                    <span className="inline-flex items-center gap-1 text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200">
                                                        {primaryError}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Middle Row: Concept Title */}
                                            <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors m-0">
                                                {skill.concept_name}
                                            </h4>

                                            {/* Bottom Row: Status Badge + Donut Percentage Ring */}
                                            <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-100">
                                                <span className="text-[10px] font-medium text-amber-600 truncate">
                                                    {label}
                                                </span>

                                                {/* Donut Progress Ring */}
                                                <div className="relative w-7 h-7 flex-shrink-0 flex items-center justify-center">
                                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                                        <path
                                                            className="text-slate-100"
                                                            strokeWidth="3.5"
                                                            stroke="currentColor"
                                                            fill="none"
                                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                        />
                                                        <path
                                                            strokeDasharray={`${pct}, 100`}
                                                            strokeWidth="3.5"
                                                            strokeLinecap="round"
                                                            stroke={ringColor}
                                                            fill="none"
                                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                        />
                                                    </svg>
                                                    <span className="absolute text-[8px] font-bold font-mono text-slate-700">
                                                        {pct}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* ========================================================================= */}
                    {/* 3.3 SLIDE-OUT CONCEPT DETAIL DRAWER (Right Inspector Panel)                */}
                    {/* ========================================================================= */}
                    {activeConcept && (
                        <div className="w-[360px] lg:w-[400px] border-l border-slate-200/90 bg-white p-5 flex flex-col justify-between overflow-y-auto shadow-lg z-20 transition-all shrink-0">
                            <div className="space-y-4">
                                
                                {/* Header: Status Pill + Concept ID + Close Button */}
                                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-full">
                                            Đang học
                                        </span>
                                        <span className="text-xs text-slate-400 font-semibold">
                                            Bài học • {activeConcept.concept_id}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setSelectedConceptId('')}
                                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                                        title="Đóng bảng chi tiết"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Concept Title */}
                                <div>
                                    <h3 className="text-base font-extrabold text-slate-900 tracking-tight m-0">
                                        {activeConcept.concept_name}
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed m-0">
                                        {activeConcept.description}
                                    </p>
                                </div>

                                {/* 3-Column Metrics Card: Độ khó | Thời lượng | Tiến độ */}
                                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                                    {/* Độ khó */}
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-100/70 text-emerald-600 flex items-center justify-center shrink-0">
                                            <BarChart2 className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-slate-400 block font-medium">Độ khó</span>
                                            <span className="text-xs font-bold text-slate-800">
                                                {activeConcept.difficulty_level <= 1 ? 'Dễ' : activeConcept.difficulty_level === 2 ? 'Vừa sức' : 'Nâng cao'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Thời lượng */}
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-blue-100/70 text-blue-600 flex items-center justify-center shrink-0">
                                            <Clock className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-slate-400 block font-medium">Thời lượng</span>
                                            <span className="text-xs font-bold text-slate-800">
                                                {currentCodeSnippet?.time || '45 phút'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Tiến độ */}
                                    <div className="flex flex-col justify-center">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] text-slate-400 font-medium">Tiến độ</span>
                                            <span className="text-[11px] font-bold text-blue-600">
                                                {Math.round((userMastery[activeConcept.id] ?? 0.53) * 100)}%
                                            </span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
                                            <div 
                                                className="h-full bg-blue-600 rounded-full" 
                                                style={{ width: `${Math.round((userMastery[activeConcept.id] ?? 0.53) * 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Mục tiêu học tập với Green Checkmarks */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                                        <Target className="w-4 h-4 text-emerald-600" />
                                        <span>Mục tiêu học tập</span>
                                    </div>
                                    <div className="space-y-1.5">
                                        {(activeConcept.learning_objectives || [
                                            `Hiểu rõ bản chất lý thuyết của ${activeConcept.concept_name}`,
                                            'Phân biệt cách áp dụng trong các bài toán thực tế',
                                            'Thực hành viết mã và bắt các lỗi thường gặp'
                                        ]).map((obj: string, i: number) => (
                                            <div key={i} className="flex items-start gap-2 text-xs text-slate-600 leading-snug">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                                <span>{obj}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Ví dụ minh họa: Code Block Box with Line Numbers & "▶ Chạy thử" */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                                            <Code2 className="w-4 h-4 text-blue-600" />
                                            <span>Ví dụ minh họa</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-mono text-slate-400">python</span>
                                            <button
                                                onClick={handleCopyCode}
                                                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                                                title="Sao chép mã"
                                            >
                                                {copiedSyntax ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Code Block Container */}
                                    <div className="bg-[#1E293B] rounded-xl p-3 text-[11px] font-mono text-slate-200 overflow-x-auto shadow-inner border border-slate-800">
                                        {currentCodeSnippet?.lines.map((line, idx) => (
                                            <div key={idx} className="flex gap-3 leading-relaxed">
                                                <span className="text-slate-500 select-none w-4 text-right">{idx + 1}</span>
                                                <div className="flex-1">
                                                    <span className={
                                                        line.text.startsWith('#') 
                                                            ? 'text-slate-400 italic' 
                                                            : line.text.includes('"') 
                                                            ? 'text-emerald-300' 
                                                            : 'text-sky-300'
                                                    }>
                                                        {line.text}
                                                    </span>
                                                    {line.comment && (
                                                        <span className="text-slate-500 ml-2 italic">
                                                            {line.comment}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Button "Chạy thử" */}
                                    <div className="flex items-center justify-between gap-2 pt-1">
                                        <button
                                            onClick={handleRunCode}
                                            disabled={isExecuting}
                                            className="px-4 py-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer disabled:opacity-50"
                                        >
                                            <Play className="w-3.5 h-3.5 fill-current text-sky-400" />
                                            <span>{isExecuting ? 'Đang chạy...' : 'Chạy thử'}</span>
                                        </button>

                                        <button
                                            onClick={handleStartPractice}
                                            className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-blue-200/80"
                                        >
                                            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                                            <span>Học với AI Tutor</span>
                                        </button>
                                    </div>

                                    {/* Execution Simulation Output */}
                                    {executionOutput && (
                                        <div className="p-2.5 rounded-xl bg-slate-900 text-emerald-400 text-[10px] font-mono whitespace-pre-wrap border border-slate-800 animate-fadeIn">
                                            {executionOutput}
                                        </div>
                                    )}
                                </div>

                                {/* Section: Bài học tiếp theo (Đề xuất) */}
                                {recommendedNextConcept && (
                                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                                        <span className="text-[11px] font-bold text-purple-700 block">
                                            Bài học tiếp theo (Đề xuất)
                                        </span>
                                        <div 
                                            onClick={() => setSelectedConceptId(recommendedNextConcept.id)}
                                            className="p-3 rounded-xl bg-purple-50/80 hover:bg-purple-100/90 border border-purple-200 flex items-center justify-between transition-all cursor-pointer group shadow-2xs"
                                        >
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0">
                                                    <Compass className="w-4 h-4" />
                                                </div>
                                                <div className="min-w-0">
                                                    <span className="text-xs font-bold text-slate-900 group-hover:text-purple-700 transition-colors block truncate">
                                                        {recommendedNextConcept.concept_id} {recommendedNextConcept.concept_name}
                                                    </span>
                                                    <span className="text-[10px] text-purple-600 font-semibold block">
                                                        Tiến độ: 40%
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="w-7 h-7 rounded-lg bg-white text-purple-600 flex items-center justify-center shrink-0 border border-purple-200 group-hover:bg-purple-600 group-hover:text-white transition-all">
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* 3.4 Canvas Bottom Bar: Lộ trình hiện tại + Zoom Controls + Mini-Map preview */}
                <div className="px-6 py-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-white z-10 flex-wrap gap-2">
                    
                    {/* Left: Lộ trình học */}
                    <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-slate-800">
                            Lộ trình học: <strong className="text-blue-600 font-bold">Python Cơ bản</strong>
                        </span>
                    </div>

                    {/* Center: Zoom Controls */}
                    <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200/80 shadow-2xs">
                        <button
                            onClick={() => setZoomLevel(prev => Math.max(prev - 0.1, 0.6))}
                            className="p-1 rounded-lg hover:bg-white text-slate-600 cursor-pointer transition-colors"
                            title="Thu nhỏ canvas"
                        >
                            <ZoomOut className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[11px] font-bold font-mono px-2 text-slate-700">
                            {Math.round(zoomLevel * 100)}%
                        </span>
                        <button
                            onClick={() => setZoomLevel(prev => Math.min(prev + 0.1, 1.4))}
                            className="p-1 rounded-lg hover:bg-white text-slate-600 cursor-pointer transition-colors"
                            title="Phóng to canvas"
                        >
                            <ZoomIn className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={() => setZoomLevel(1)}
                            className="px-2 py-0.5 rounded-lg hover:bg-white text-slate-600 cursor-pointer transition-colors text-[10px] font-semibold"
                            title="Vừa màn hình"
                        >
                            100%
                        </button>
                    </div>

                    {/* Right: Cognitive Engine Model Switcher & Mini-Map Overview */}
                    <div className="flex items-center gap-3">
                        {onModelChange && (
                            <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-200/80 text-[11px] font-semibold">
                                <span className="text-[10px] text-slate-400 px-1.5 uppercase font-mono">Engine</span>
                                {(
                                    [
                                        { id: 'PAL-Net', label: 'PAL-Net' },
                                        { id: 'BKT', label: 'BKT' },
                                        { id: 'DKT', label: 'DKT' }
                                    ] as const
                                ).map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => onModelChange(item.id)}
                                        className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                                            activeModel === item.id
                                                ? 'bg-blue-600 text-white font-bold shadow-xs'
                                                : 'text-slate-500 hover:text-slate-800'
                                        }`}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Mini-map Box matching image */}
                        <div className="hidden sm:flex items-center justify-center w-14 h-8 bg-blue-50/80 border border-blue-200 rounded-lg p-1" title="Mini-map">
                            <div className="flex gap-0.5 items-center">
                                <span className="w-1.5 h-3 bg-blue-400 rounded-xs" />
                                <span className="w-1.5 h-4 bg-emerald-500 rounded-xs" />
                                <span className="w-1.5 h-3 bg-purple-400 rounded-xs" />
                                <span className="w-1.5 h-5 bg-blue-600 rounded-xs" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KnowledgeGraphTree;
