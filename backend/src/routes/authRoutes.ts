import { Router } from "express";
import { register, verifyOtp, resendOtp, login } from "../controllers/authController";

const router = Router();

// POST /api/auth/register (Gửi OTP qua email)
router.post('/register', register);

// POST /api/auth/verify-otp (Xác thực OTP và tạo tài khoản)
router.post('/verify-otp', verifyOtp);

// POST /api/auth/resend-otp (Gửi lại OTP)
router.post('/resend-otp', resendOtp);

// POST /api/auth/login
router.post('/login', login);

export default router;
