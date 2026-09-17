import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    Search, 
    Play, 
    Rocket, 
    ArrowRight, 
    FolderGit2, 
    Code2, 
    User, 
    Clock, 
    TrendingUp, 
    Sparkles, 
    ChevronRight,
    BookOpen,
    Users
} from 'lucide-react';

// Custom web component declaration for TypeScript
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'spline-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { url?: string }, HTMLElement>;
        }
    }
}

const Home: React.FC = () => {
    const navigate = useNavigate();

    const scrollToFeatures = () => {
        const element = document.getElementById('features');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="bg-[#060913] text-white min-h-screen w-full relative overflow-x-hidden flex flex-col font-sans select-none">
            {/* Background Ambient Spotlights */}
            <div className="absolute top-[-15%] right-[-5%] w-[65vw] h-[65vw] max-w-[900px] max-h-[900px] bg-[radial-gradient(circle,rgba(79,70,229,0.18)_0%,rgba(59,130,246,0.1)_35%,transparent_70%)] pointer-events-none z-0"></div>
            <div className="absolute top-[15%] left-[-10%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] bg-[radial-gradient(circle,rgba(168,85,247,0.14)_0%,rgba(147,51,234,0.06)_40%,transparent_70%)] pointer-events-none z-0"></div>

            {/* Navigation Header */}
            <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#060913]/75 border-b border-white/[0.06] transition-all">
                <div className="max-w-[1440px] mx-auto flex justify-between items-center px-6 py-4 md:px-12">
                    {/* Brand Logo */}
                    <Link 
                        to="/" 
                        className="text-2xl font-black tracking-[1.5px] text-white no-underline flex items-center gap-1 hover:opacity-90 transition-opacity"
                    >
                        MCODE
                    </Link>

                    {/* Navigation Menu */}
                    <nav className="hidden lg:flex items-center gap-8">
                        <div className="relative py-2">
                            <span className="text-white text-[13px] font-bold tracking-[0.8px] cursor-pointer">
                                TRANG CHỦ
                            </span>
                            <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-400 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.8)]"></span>
                        </div>
                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="text-[#94a3b8] hover:text-white text-[13px] font-semibold tracking-[0.8px] transition-colors duration-200 bg-transparent border-none cursor-pointer"
                        >
                            KHÓA HỌC
                        </button>
                        <button 
                            onClick={scrollToFeatures}
                            className="text-[#94a3b8] hover:text-white text-[13px] font-semibold tracking-[0.8px] transition-colors duration-200 bg-transparent border-none cursor-pointer"
                        >
                            TÍNH NĂNG
                        </button>
                        <button 
                            onClick={scrollToFeatures}
                            className="text-[#94a3b8] hover:text-white text-[13px] font-semibold tracking-[0.8px] transition-colors duration-200 bg-transparent border-none cursor-pointer"
                        >
                            TÀI LIỆU
                        </button>
                        <button 
                            onClick={scrollToFeatures}
                            className="text-[#94a3b8] hover:text-white text-[13px] font-semibold tracking-[0.8px] transition-colors duration-200 bg-transparent border-none cursor-pointer"
                        >
                            VỀ CHÚNG TÔI
                        </button>
                        <button 
                            onClick={scrollToFeatures}
                            className="text-[#94a3b8] hover:text-white text-[13px] font-semibold tracking-[0.8px] transition-colors duration-200 bg-transparent border-none cursor-pointer"
                        >
                            DOCS
                        </button>
                    </nav>

                    {/* Header Action Buttons */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        {/* Search Icon Button */}
                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="w-9 h-9 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer"
                            title="Tìm kiếm"
                        >
                            <Search className="w-4 h-4" />
                        </button>

                        {/* Sign In Button */}
                        <button 
                            className="bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700/80 hover:border-slate-500 px-5 py-2 rounded-full text-[13px] font-semibold tracking-[0.3px] transition-all duration-200 cursor-pointer"
                            onClick={() => navigate('/login')}
                        >
                            Đăng nhập
                        </button>

                        {/* Sign Up Button */}
                        <button 
                            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white border-none px-6 py-2 rounded-full text-[13px] font-semibold tracking-[0.3px] shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:shadow-[0_0_28px_rgba(99,102,241,0.75)] transition-all duration-200 cursor-pointer transform hover:-translate-y-[1px]"
                            onClick={() => navigate('/register')}
                        >
                            Đăng ký
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Hero Section */}
            <main className="flex-1 max-w-[1440px] mx-auto w-full px-6 md:px-12 pt-8 pb-10 lg:pt-14 lg:pb-16 relative z-10 flex flex-col justify-between">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">
                    
                    {/* Left Column: Heading, Subtitle & CTAs */}
                    <div className="lg:col-span-6 flex flex-col justify-center text-center lg:text-left items-center lg:items-start z-10">
                        {/* Sparkle Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-950/40 border border-violet-500/30 text-violet-300 text-xs font-semibold tracking-wide shadow-[0_0_15px_rgba(168,85,247,0.15)] mb-6 hover:border-violet-500/50 transition-all">
                            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                            <span>Nền tảng học lập trình thế hệ mới</span>
                        </div>

                        {/* Hero Headline */}
                        <h1 className="text-4xl sm:text-6xl xl:text-[70px] font-black tracking-[-1px] leading-[1.06] text-white uppercase mt-0 mb-6">
                            EMAIL FOR <br />
                            <span className="bg-gradient-to-r from-[#38bdf8] via-[#818cf8] to-[#c084fc] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(99,102,241,0.45)]">
                                DEVELOPERS
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-base sm:text-lg text-slate-300/90 leading-relaxed max-w-[500px] mb-9 font-normal">
                            Cách tốt nhất để con người tiếp cận thế giới lập trình là thông qua những dự án thực tế – thay vì chỉ là lý thuyết.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 items-center w-full max-w-[400px] sm:max-w-full justify-center lg:justify-start">
                            {/* Primary Action Button */}
                            <button 
                                className="group w-full sm:w-auto bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a855f7] hover:from-[#4f46e5] hover:to-[#9333ea] text-white border-none px-8 py-3.5 rounded-full text-[15px] font-bold shadow-[0_4px_25px_rgba(139,92,246,0.5)] hover:shadow-[0_4px_35px_rgba(139,92,246,0.7)] inline-flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5"
                                onClick={() => navigate('/register')}
                            >
                                <span>Bắt đầu học ngay</span>
                                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                            </button>

                            {/* Secondary Action Button */}
                            <button 
                                className="w-full sm:w-auto bg-slate-900/70 hover:bg-slate-800 text-white border border-slate-700/80 hover:border-slate-500 px-7 py-3.5 rounded-full text-[15px] font-semibold inline-flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer"
                                onClick={scrollToFeatures}
                            >
                                <Play className="w-4 h-4 fill-white text-white" />
                                <span>Tìm hiểu thêm</span>
                            </button>
                        </div>
                    </div>

                    {/* Right Column: 3D Robot Character + 3 Floating UI Groups (Triangular Composition - Behind Robot) */}
                    <div className="lg:col-span-6 relative flex justify-center items-center h-[420px] sm:h-[500px] lg:h-[580px] w-full">
                        
                        {/* AURA / BACKLIGHT GLOW – Tọa độ ngay sau lưng robot, đẩy robot nổi bật hẳn về phía trước */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[420px] h-[340px] sm:h-[420px] bg-[radial-gradient(circle,rgba(99,102,241,0.22)_0%,rgba(56,189,248,0.12)_40%,transparent_70%)] blur-3xl pointer-events-none z-[1]"></div>
                        <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] bg-black/50 rounded-full blur-2xl pointer-events-none z-[2]"></div>

                        {/* 1. VÙNG CODE CARD – Phía sau bên trái robot (Layer z-[5] bị đầu robot che khuất một góc) */}
                        <div className="absolute top-5 sm:top-8 left-2 sm:left-6 lg:left-10 z-[5] animate-float hidden sm:block pointer-events-auto">
                            <div className="hero-code-card rounded-2xl p-4 sm:p-5 w-[220px] sm:w-[250px] scale-[0.93] sm:scale-100 opacity-90 hover:opacity-100 select-none cursor-default">
                                <div className="font-mono text-[11px] sm:text-xs leading-relaxed text-slate-200">
                                    <div>
                                        <span className="text-[#38bdf8] font-bold">const</span> <span className="text-white font-semibold">learn</span> = (<span className="text-[#38bdf8]">level</span>) =&gt; &#123;
                                    </div>
                                    <div className="pl-4 py-0.5">
                                        <span className="text-[#38bdf8] font-bold">return</span> <span className="text-[#4ade80]">"Better</span>
                                    </div>
                                    <div className="pl-6">
                                        <span className="text-[#4ade80]">Developer"</span>;
                                    </div>
                                    <div className="text-white">&#125;;</div>
                                </div>
                            </div>
                        </div>

                        {/* 2. VÙNG “REAL PROJECTS / REAL SKILLS” – Nằm TRÊN lớp robot (Layer z-20) nổi bật ở góc dưới bên trái */}
                        <div className="absolute top-[50%] sm:top-[52%] lg:top-[54%] left-2 sm:left-6 lg:left-8 z-20 animate-float-delayed pointer-events-auto">
                            <div className="hero-project-badge rounded-[16px] px-4 py-3 sm:px-4.5 sm:py-3.5 flex items-center gap-3.5 scale-[0.95] sm:scale-100 opacity-100 select-none cursor-default">
                                {/* Blue Glowing Folder Icon */}
                                <div className="w-10 h-10 rounded-[12px] bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.4)] shrink-0">
                                    <FolderGit2 className="w-5 h-5 text-blue-400" />
                                </div>
                                <div className="text-left">
                                    <div className="text-xs sm:text-[13px] font-bold text-white tracking-wide leading-tight">Real Projects</div>
                                    <div className="text-[11px] text-sky-300 font-medium leading-tight mt-0.5">Real Skills</div>
                                </div>
                            </div>
                        </div>

                        {/* 3. VÙNG ACTION PILLS – Phía sau bên phải robot (Layer z-[5] luồn ra từ sau vai robot) */}
                        <div className="absolute top-5 sm:top-8 right-2 sm:right-6 lg:right-10 z-[5] animate-float pointer-events-auto">
                            <div className="hero-action-pills flex flex-col gap-2.5 scale-[0.93] sm:scale-100 opacity-90 hover:opacity-100 select-none">
                                {/* Pill 1: Learn (Purple) */}
                                <div className="hero-pill translate-x-0 bg-gradient-to-r from-violet-600/90 to-purple-600/90 border border-violet-400/30 text-white px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full flex items-center gap-2.5 shadow-[0_4px_16px_rgba(139,92,246,0.3)] cursor-pointer">
                                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                        <Code2 className="w-3.5 h-3.5 text-white" />
                                    </div>
                                    <span className="font-semibold text-white text-[13px] tracking-wide">Learn</span>
                                </div>

                                {/* Pill 2: Practice (Blue) */}
                                <div className="hero-pill translate-x-2 bg-gradient-to-r from-blue-600/90 to-indigo-600/90 border border-blue-400/30 text-white px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full flex items-center gap-2.5 shadow-[0_4px_16px_rgba(59,130,246,0.3)] cursor-pointer">
                                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                        <Play className="w-3.5 h-3.5 fill-white text-white" />
                                    </div>
                                    <span className="font-semibold text-white text-[13px] tracking-wide">Practice</span>
                                </div>

                                {/* Pill 3: Build (Green) */}
                                <div className="hero-pill translate-x-3 bg-gradient-to-r from-emerald-600/90 to-teal-600/90 border border-emerald-400/30 text-white px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full flex items-center gap-2.5 shadow-[0_4px_16px_rgba(16,185,129,0.3)] cursor-pointer">
                                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                        <TrendingUp className="w-3.5 h-3.5 text-white" />
                                    </div>
                                    <span className="font-semibold text-white text-[13px] tracking-wide">Build</span>
                                </div>

                                {/* Pill 4: Grow (Orange/Yellow) */}
                                <div className="hero-pill translate-x-1 bg-gradient-to-r from-amber-500/90 to-orange-500/90 border border-amber-400/30 text-white px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full flex items-center gap-2.5 shadow-[0_4px_16px_rgba(245,158,11,0.3)] cursor-pointer">
                                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                        <Users className="w-3.5 h-3.5 text-white" />
                                    </div>
                                    <span className="font-semibold text-white text-[13px] tracking-wide">Grow</span>
                                </div>
                            </div>
                        </div>

                        {/* Center Spline Viewer Canvas (Robot 3D NỔI BẬT Ở TIỀN CẢNH - Layer z-10) */}
                        <div className="w-full h-full relative flex items-center justify-center pointer-events-none z-10">
                            <spline-viewer 
                                url="https://prod.spline.design/rtzHBheO7pCZk83A/scene.splinecode" 
                                className="w-full h-full border-none pointer-events-none"
                            ></spline-viewer>
                            
                            {/* Watermark Mask */}
                            <div className="absolute bottom-1 right-1 w-[165px] h-[55px] bg-[#060913] z-30 cursor-default pointer-events-none"></div>
                        </div>

                    </div>
                </div>
            </main>

            {/* Bottom Fluid Wave & 4-Column Feature Bar Container */}
            <div id="features" className="w-full relative z-20 mt-auto pt-6 pb-12">
                
                {/* Ambient Wave Graphic at the Bottom */}
                <div className="w-full overflow-hidden leading-none pointer-events-none absolute bottom-0 left-0 right-0 z-0 opacity-40">
                    <svg className="w-full h-24 sm:h-32 text-indigo-900/30" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M0,0 C150,90 350,-40 500,60 C650,160 900,10 1200,40 L1200,120 L0,120 Z" fill="currentColor"></path>
                    </svg>
                </div>

                {/* 4-Column Floating Bento Card (Dark Glassmorphic Theme) */}
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
                    <div className="bg-[#0b1224]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),_0_0_35px_rgba(79,70,229,0.08)] rounded-[28px] p-6 sm:p-8 lg:p-9 text-white">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.06]">
                            
                            {/* Feature 1: Học qua dự án thực tế */}
                            <div className="group flex items-start gap-4 pt-4 sm:pt-0 sm:px-4 first:pl-0">
                                <div className="w-12 h-12 rounded-2xl bg-violet-600/15 border border-violet-500/30 text-violet-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(139,92,246,0.15)] group-hover:border-violet-500/50 group-hover:scale-105 transition-all duration-200">
                                    <Code2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-base mb-1 tracking-wide group-hover:text-violet-300 transition-colors">
                                        Học qua dự án thực tế
                                    </h3>
                                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed m-0 font-normal">
                                        Xây dựng sản phẩm thật, rèn kỹ năng thực chiến, không chỉ là lý thuyết.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 2: Lộ trình cá nhân hóa */}
                            <div className="group flex items-start gap-4 pt-4 sm:pt-0 sm:px-4">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-600/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.15)] group-hover:border-emerald-500/50 group-hover:scale-105 transition-all duration-200">
                                    <User className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-base mb-1 tracking-wide group-hover:text-emerald-300 transition-colors">
                                        Lộ trình cá nhân hóa
                                    </h3>
                                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed m-0 font-normal">
                                        Phù hợp với trình độ và mục tiêu của từng học viên.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 3: Học mọi lúc, mọi nơi */}
                            <div className="group flex items-start gap-4 pt-4 sm:pt-0 sm:px-4">
                                <div className="w-12 h-12 rounded-2xl bg-blue-600/15 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.15)] group-hover:border-blue-500/50 group-hover:scale-105 transition-all duration-200">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-base mb-1 tracking-wide group-hover:text-blue-300 transition-colors">
                                        Học mọi lúc, mọi nơi
                                    </h3>
                                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed m-0 font-normal">
                                        Linh hoạt thời gian, học trên mọi thiết bị.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 4: Cộng đồng hỗ trợ 24/7 */}
                            <div className="group flex items-start gap-4 pt-4 sm:pt-0 sm:px-4 last:pr-0">
                                <div className="w-12 h-12 rounded-2xl bg-fuchsia-600/15 border border-fuchsia-500/30 text-fuchsia-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(217,70,239,0.15)] group-hover:border-fuchsia-500/50 group-hover:scale-105 transition-all duration-200">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-base mb-1 tracking-wide group-hover:text-fuchsia-300 transition-colors">
                                        Cộng đồng hỗ trợ 24/7
                                    </h3>
                                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed m-0 font-normal">
                                        Luôn theo sát xu hướng, trang bị kỹ năng cho tương lai.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Home;
