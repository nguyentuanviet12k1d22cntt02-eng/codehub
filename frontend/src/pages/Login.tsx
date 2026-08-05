import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await authService.login({ email, password });

            if (data.token) {
                localStorage.setItem('token', data.token);
                let role = 'STUDENT';
                try {
                    // Decode base64 payload of JWT
                    const base64Url = data.token.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    }).join(''));
                    localStorage.setItem('user', jsonPayload);
                    const userObj = JSON.parse(jsonPayload);
                    role = userObj.role || 'STUDENT';
                } catch (e) {
                    console.error("Failed to parse token payload", e);
                }

                if (role === 'ADMIN') {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            } else {
                setError('Không nhận được mã xác thực hợp lệ');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Lỗi kết nối máy chủ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#030303] text-white min-h-screen w-full relative overflow-hidden flex flex-col justify-center items-center font-sans px-4 select-none">
            {/* Background Glow */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[60%] bg-[radial-gradient(circle,rgba(120,119,198,0.1)_0%,transparent_70%)] pointer-events-none z-1"></div>

            {/* Container Box */}
            <div className="w-full max-w-[420px] bg-[#0b0b0e] border border-white/5 rounded-2xl p-8 md:p-10 relative z-10 shadow-2xl">
                {/* Header/Logo */}
                <div className="text-center mb-8">
                    <span className="text-2xl font-bold tracking-tight text-white block mb-2 cursor-pointer" onClick={() => navigate('/')}>MCODE</span>
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider">Đăng Nhập</h2>
                    <p className="text-sm text-[#8e8e93] mt-1">Chào mừng quay lại! Đăng nhập để tiếp tục học.</p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="flex flex-col gap-5 text-left">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-semibold text-[#8e8e93] uppercase tracking-wider">Email</label>
                        <input
                            type="email"
                            placeholder="name@domain.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-[#16161a] border border-white/5 focus:border-[#c084fc]/50 text-white rounded-lg px-4 py-3 text-sm focus:outline-none transition-colors w-full"
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
                            className="bg-[#16161a] border border-white/5 focus:border-[#c084fc]/50 text-white rounded-lg px-4 py-3 text-sm focus:outline-none transition-colors w-full"
                            required
                            disabled={loading}
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-lg text-center mt-2">
                            ⚠️ {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-white hover:bg-[#f3f3f3] text-black font-bold py-3.5 rounded-lg transition-colors cursor-pointer active:scale-[0.98] disabled:opacity-50 text-sm mt-4 w-full"
                    >
                        {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                    </button>
                </form>

                {/* Footer Link */}
                <p className="text-sm text-[#8e8e93] text-center mt-8">
                    Chưa có tài khoản?{' '}
                    <Link to="/register" className="text-[#c084fc] hover:underline font-medium">
                        Đăng ký tại đây
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
