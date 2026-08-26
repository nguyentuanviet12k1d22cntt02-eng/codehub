import type React from "react";
import { useState, useEffect } from "react";
import { authService } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";

const Register: React.FC = () => {
    // Step 1: Input registration info
    // Step 2: Input 6-digit OTP code sent to email
    const [step, setStep] = useState<1 | 2>(1);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [isSuccessMessage, setIsSuccessMessage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const navigate = useNavigate();

    // Countdown timer for resend OTP
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    // Handle Step 1: Submit Form & Send OTP
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setIsSuccessMessage(false);

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
            if (data.requireOtp) {
                setStep(2);
                setIsSuccessMessage(true);
                setMessage(data.message || `Mã xác thực 6 số đã được gửi tới ${email}`);
                setCountdown(60); // 60s cooldown for resend
            } else {
                setIsSuccessMessage(true);
                setMessage(data.message || 'Đăng ký tài khoản thành công!');
                setTimeout(() => navigate('/login'), 1500);
            }
        } catch (error: any) {
            setIsSuccessMessage(false);
            setMessage(error.response?.data?.message || 'Có lỗi xảy ra trong quá trình đăng ký');
        } finally {
            setLoading(false);
        }
    };

    // Handle Step 2: Verify 6-digit OTP
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setIsSuccessMessage(false);

        const cleanOtp = otp.trim();
        if (cleanOtp.length !== 6) {
            setMessage('Vui lòng nhập đúng 6 chữ số mã xác thực!');
            return;
        }

        setLoading(true);
        try {
            const data = await authService.verifyOtp({ email, otp: cleanOtp });
            setIsSuccessMessage(true);
            setMessage(data.message || 'Đăng ký và xác thực tài khoản thành công! Đang chuyển hướng...');
            setTimeout(() => navigate('/login'), 1800);
        } catch (error: any) {
            setIsSuccessMessage(false);
            setMessage(error.response?.data?.message || 'Mã xác thực không chính xác hoặc đã hết hạn');
        } finally {
            setLoading(false);
        }
    };

    // Handle Resend OTP
    const handleResendOtp = async () => {
        if (countdown > 0) return;
        setMessage('');
        setIsSuccessMessage(false);
        setLoading(true);
        try {
            const data = await authService.resendOtp({ email });
            setIsSuccessMessage(true);
            setMessage(data.message || 'Đã gửi lại mã xác thực mới vào email của bạn!');
            setCountdown(60);
        } catch (error: any) {
            setIsSuccessMessage(false);
            setMessage(error.response?.data?.message || 'Lỗi khi gửi lại mã xác thực');
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
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider">
                        {step === 1 ? 'Đăng ký tài khoản' : 'Xác thực Email'}
                    </h2>
                    <p className="text-sm text-[#8e8e93] mt-1">
                        {step === 1
                            ? 'Gia nhập MCODE để khám phá thế giới lập trình Python.'
                            : `Nhập mã xác thực 6 số đã được gửi tới ${email}`}
                    </p>
                </div>

                {/* STEP 1: Registration Form */}
                {step === 1 && (
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
                                isSuccessMessage
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
                            {loading ? 'Đang gửi mã xác thực...' : 'Tiếp tục (Gửi mã xác thực)'}
                        </button>
                    </form>
                )}

                {/* STEP 2: 6-Digit OTP Verification Form */}
                {step === 2 && (
                    <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4 text-left">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-semibold text-[#8e8e93] uppercase tracking-wider text-center">
                                Nhập 6 chữ số mã xác thực
                            </label>
                            <input
                                type="text"
                                maxLength={6}
                                placeholder="000000"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                className="bg-[#16161a] border border-white/10 focus:border-[#c084fc] text-white rounded-xl px-4 py-3.5 text-center text-2xl font-mono tracking-[8px] font-bold focus:outline-none transition-colors w-full"
                                required
                                autoFocus
                                disabled={loading}
                            />
                        </div>

                        {message && (
                            <div className={`border text-xs px-4 py-3 rounded-lg text-center mt-1 ${
                                isSuccessMessage
                                    ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                            }`}>
                                {message}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={loading || otp.length !== 6}
                            className="bg-white hover:bg-[#f3f3f3] text-black font-bold py-3.5 rounded-lg transition-colors cursor-pointer active:scale-[0.98] disabled:opacity-50 text-sm mt-2 w-full"
                        >
                            {loading ? 'Đang xác thực...' : 'Xác nhận & Hoàn tất đăng ký'}
                        </button>

                        <div className="flex items-center justify-between text-xs text-[#8e8e93] mt-2 pt-2 border-t border-white/5">
                            <button
                                type="button"
                                onClick={() => {
                                    setStep(1);
                                    setMessage('');
                                    setOtp('');
                                }}
                                className="hover:text-white transition-colors"
                            >
                                Quay lại sửa thông tin
                            </button>

                            <button
                                type="button"
                                disabled={countdown > 0 || loading}
                                onClick={handleResendOtp}
                                className={`font-semibold transition-colors ${
                                    countdown > 0 ? 'text-[#8e8e93] cursor-not-allowed' : 'text-[#c084fc] hover:underline cursor-pointer'
                                }`}
                            >
                                {countdown > 0 ? `Gửi lại mã (${countdown}s)` : 'Gửi lại mã OTP'}
                            </button>
                        </div>
                    </form>
                )}

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