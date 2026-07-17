import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-[#030303] text-white min-h-screen w-full relative overflow-hidden flex flex-col font-sans select-none">
            {/* Background Spotlight Glow */}
            <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[80%] bg-[radial-gradient(circle,rgba(120,119,198,0.12)_0%,rgba(120,119,198,0.05)_40%,transparent_70%)] pointer-events-none z-1"></div>

            {/* Navigation Header */}
            <header className="flex justify-between items-center px-6 py-5 md:px-20 md:py-6 relative z-10">
                <Link to="/" className="text-2xl font-bold tracking-tight text-white no-underline">MCODE</Link>
                <nav className="hidden md:flex gap-8">
                    <a href="#company" className="text-[#8e8e93] hover:text-white no-underline text-[13px] font-medium tracking-[0.8px] transition-colors duration-200">COMPANY</a>
                    <a href="#features" className="text-[#8e8e93] hover:text-white no-underline text-[13px] font-medium tracking-[0.8px] transition-colors duration-200">FEATURES</a>
                    <a href="#resources" className="text-[#8e8e93] hover:text-white no-underline text-[13px] font-medium tracking-[0.8px] transition-colors duration-200">RESOURCES</a>
                    <a href="#docs" className="text-[#8e8e93] hover:text-white no-underline text-[13px] font-medium tracking-[0.8px] transition-colors duration-200">DOCS</a>
                </nav>
                <button 
                    className="bg-[#e5e5ea] hover:bg-white text-black px-6 py-2 rounded-full text-[13px] font-semibold tracking-[0.5px] transition-all duration-200 border-none cursor-pointer hover:-translate-y-[1px]"
                    onClick={() => navigate('/login')}
                >
                    SIGNING
                </button>
            </header>

            {/* Hero Section */}
            <main className="flex-1 flex flex-col lg:flex-row items-center justify-between px-6 pb-20 md:px-20 max-w-[1400px] mx-auto w-full relative z-5 gap-10 lg:gap-10">
                {/* Left Column (Text & Actions) */}
                <div className="flex-1 flex flex-col justify-center max-w-full lg:max-w-[600px] text-center lg:text-left items-center lg:items-start">
                    {/* Glowing Badge */}
                    <div className="self-center lg:self-start mb-6">
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[rgba(170,59,255,0.05)] border border-[rgba(170,59,255,0.25)] hover:border-[rgba(170,59,255,0.5)] text-[#c084fc] text-[11px] font-semibold tracking-[1.5px] uppercase shadow-[0_0_15px_rgba(170,59,255,0.1)] hover:shadow-[0_0_20px_rgba(170,59,255,0.2)] transition-all duration-300">
                            INTRODUCING <span className="ml-1.5 text-xs">Δ</span>
                        </div>
                    </div>

                    {/* Heading */}
                    <h1 className="text-4xl md:text-6xl lg:text-[72px] font-extrabold leading-[1.05] tracking-[-2px] text-white mt-0 mb-6 max-w-[700px] uppercase text-center lg:text-left">
                        EMAIL FOR<br />
                        DEVELOPERS
                    </h1>

                    {/* Subtitle */}
                    <p className="text-base md:text-lg leading-relaxed text-[#8e8e93] max-w-[500px] mb-10 text-center lg:text-left mx-auto lg:mx-0">
                        the best way to reach humans instead of spam folders, 
                        clever transactional and marketing emails at scale.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-5 items-center w-full max-w-[320px] sm:max-w-full mx-auto lg:mx-0 justify-center lg:justify-start">
                        <button 
                            className="bg-transparent text-[#c084fc] border border-[rgba(192,132,252,0.3)] hover:border-[rgba(192,132,252,0.6)] hover:bg-[rgba(192,132,252,0.08)] px-7 py-3 rounded-full text-[15px] font-semibold no-underline inline-flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer w-full sm:w-auto"
                            onClick={() => navigate('/login')}
                        >
                            Documentation <span className="ml-1">&gt;</span>
                        </button>
                        <button 
                            className="bg-[#e5e5ea] hover:bg-white text-black border-none px-7 py-3 rounded-full text-[15px] font-semibold no-underline inline-flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer hover:-translate-y-[1px] w-full sm:w-auto"
                            onClick={() => navigate('/register')}
                        >
                            Get started <span className="ml-1">&gt;</span>
                        </button>
                    </div>
                </div>

                {/* Right Column (3D Spline Viewer) */}
                <div className="flex-1.2 flex justify-center items-center h-[300px] md:h-[400px] lg:h-[550px] w-full relative mt-5 lg:mt-0">
                    <div className="w-full h-full flex justify-center items-center relative">
                        <spline-viewer url="https://prod.spline.design/rtzHBheO7pCZk83A/scene.splinecode" className="w-full h-full border-none"></spline-viewer>
                        {/* Mask to cover Spline watermark */}
                        <div className="absolute bottom-2 right-2 w-[165px] h-[55px] bg-[#030303] z-[100] cursor-default"></div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;
