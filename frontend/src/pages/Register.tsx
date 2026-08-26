import type React from "react";
import { useState } from "react";
import { authService } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');

        if (password !== confirmPassword) {
            setMessage('Mật khẩu xác nhận không khớp!');
            return;
        }

        if (password.length < 6) {
            setMessage('Mật khẩu phải có ít nhất 6 ký tự!');
            return;
        }

        setLoading(true);
        try {
            const data = await authService.register({ username, password, email, role: 'STUDENT' });
            setMessage(data.message || 'Đăng ký tài khoản thành công!');
            setTimeout(() => navigate('/login'), 1500);
        } catch (error: any) {
            setMessage(error.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#030303] text-white min-h-screen w-full relative overflow-hidden flex flex-col justify-center items-center font-sans px-4 py-12 select-none">
            {/* Background Glow */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[60%] bg-[radial-gradient(circle,rgba(120,119,198,0.1)_0%,transparent_70%)] pointer-events-none z-1"></div>

            {/* Container Box */}
            <div className="w-full max-w-[440px] bg-[#0b0b0e] border border-white/5 rounded-2xl p-8 md:p-10 relative z-10 shadow-2xl">
                {/* Header/Logo */}
                <div className="text-center mb-8">
                    <span className="text-2xl font-bold tracking-tight text-white block mb-2 cursor-pointer" onClick={() => navigate('/')}>MCODE</span>
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider">Đăng ký tài khoản</h2>
                    <p className="text-sm text-[#8e8e93] mt-1">Gia nhập MCODE để khám phá thế giới lập trình Python.</p>
                </div>

                {/* Form */}
                <form onSubmit={handleRegister} className="flex flex-col gap-4 text-left">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-semibold text-[#8e8e93] uppercase tracking-wider">Tên đăng nhập</label>
                        <input
                            type="text"
                            placeholder="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="bg-[#16161a] border border-white/5 focus:border-[#c084fc]/50 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-colors w-full"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-semibold text-[#8e8e93] uppercase tracking-wider">Email</label>
                        <input
                            type="email"
                            placeholder="name@domain.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-[#16161a] border border-white/5 focus:border-[#c084fc]/50 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-colors w-full"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-semibold text-[#8e8e93] uppercase tracking-wider">Mật khẩu</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-[#16161a] border border-white/5 focus:border-[#c084fc]/50 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-colors w-full"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-semibold text-[#8e8e93] uppercase tracking-wider">Xác nhận mật khẩu</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="bg-[#16161a] border border-white/5 focus:border-[#c084fc]/50 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-colors w-full"
                            required
                            disabled={loading}
                        />
                    </div>

                    {message && (
                        <div className={`border text-xs px-4 py-3 rounded-lg text-center mt-2 ${
                            message.includes('thành công') 
                            ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                            : 'bg-red-500/10 border-red-500/20 text-red-400'
                        }`}>
                            {message}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="bg-white hover:bg-[#f3f3f3] text-black font-bold py-3.5 rounded-lg transition-colors cursor-pointer active:scale-[0.98] disabled:opacity-50 text-sm mt-3 w-full"
                    >
                        {loading ? 'Đang xử lý...' : 'Đăng ký'}
                    </button>
                </form>

                {/* Footer Link */}
                <p className="text-sm text-[#8e8e93] text-center mt-8">
                    Đã có tài khoản?{' '}
                    <Link to="/login" className="text-[#c084fc] hover:underline font-medium">
                        Đăng nhập ngay
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;