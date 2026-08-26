import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { sendVerificationOtp } from '../services/emailService';

// Đảm bảo JWT_SECRET bắt buộc phải có
if (!process.env.JWT_SECRET) {
    throw new Error('FATAL: JWT_SECRET environment variable is missing!');
}
const JWT_SECRET = process.env.JWT_SECRET;

// In-memory store for pending OTP registrations
interface PendingRegistration {
    username: string;
    email: string;
    hashedPassword: string;
    role: 'STUDENT' | 'TEACHER' | 'ADMIN';
    otp: string;
    expiresAt: number;
}

const pendingRegistrations = new Map<string, PendingRegistration>();

// Clean expired registrations every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [email, data] of pendingRegistrations.entries()) {
        if (data.expiresAt < now) {
            pendingRegistrations.delete(email);
        }
    }
}, 5 * 60 * 1000);

// Định nghĩa Schema validate đầu vào bằng Zod
const RegisterSchema = z.object({
    username: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),
    email: z.string().email('Email không đúng định dạng'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    role: z.enum(['STUDENT', 'TEACHER', 'ADMIN']).default('STUDENT'),
});

const VerifyOtpSchema = z.object({
    email: z.string().email('Email không hợp lệ'),
    otp: z.string().length(6, 'Mã xác thực phải gồm đúng 6 chữ số'),
});

const LoginSchema = z.object({
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(1, 'Mật khẩu không được để trống'),
});

// 1. Controller gửi OTP đăng ký tài khoản
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const parsedData = RegisterSchema.parse(req.body);
        const { username, password, email, role } = parsedData;
        const normalizedEmail = email.toLowerCase().trim();

        // Kiểm tra email hoặc username đã tồn tại chưa
        const userExists = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: normalizedEmail },
                    { username }
                ]
            }
        });

        if (userExists) {
            if (userExists.email.toLowerCase() === normalizedEmail) {
                res.status(400).json({ message: 'Địa chỉ email này đã được đăng ký tài khoản.' });
                return;
            }
            res.status(400).json({ message: 'Tên đăng nhập này đã được sử dụng.' });
            return;
        }

        // Tạo mã OTP 6 số ngẫu nhiên
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Mã hóa mật khẩu trước khi lưu tạm
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Lưu vào bộ nhớ tạm (hiệu lực 10 phút)
        pendingRegistrations.set(normalizedEmail, {
            username,
            email: normalizedEmail,
            hashedPassword,
            role: role || 'STUDENT',
            otp,
            expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
        });

        // Gửi email chứa mã OTP
        const emailSent = await sendVerificationOtp(normalizedEmail, otp, username);
        if (!emailSent) {
            pendingRegistrations.delete(normalizedEmail);
            res.status(500).json({
                message: 'Không thể gửi email chứa mã xác thực. Vui lòng kiểm tra lại địa chỉ email hoặc thử lại sau ít phút.'
            });
            return;
        }

        res.status(200).json({
            success: true,
            requireOtp: true,
            email: normalizedEmail,
            message: `Mã xác thực 6 số đã được gửi tới ${normalizedEmail}. Vui lòng kiểm tra hòm thư của bạn.`
        });
    } catch (error) {
        console.error("DEBUG REGISTER ERROR:", error);
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: error.issues[0].message });
            return;
        }
        res.status(500).json({ message: (error as any).message || 'Có lỗi xảy ra trong quá trình đăng ký' });
    }
};

// 2. Controller xác thực mã OTP và kích hoạt tài khoản
export const verifyOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, otp } = VerifyOtpSchema.parse(req.body);
        const normalizedEmail = email.toLowerCase().trim();

        const pending = pendingRegistrations.get(normalizedEmail);

        if (!pending) {
            res.status(400).json({ message: 'Mã xác thực không tồn tại hoặc đã hết hạn. Vui lòng thực hiện đăng ký lại.' });
            return;
        }

        if (Date.now() > pending.expiresAt) {
            pendingRegistrations.delete(normalizedEmail);
            res.status(400).json({ message: 'Mã xác thực đã hết hạn. Vui lòng bấm gửi lại mã.' });
            return;
        }

        if (pending.otp !== otp.trim()) {
            res.status(400).json({ message: 'Mã xác thực không chính xác. Vui lòng kiểm tra lại.' });
            return;
        }

        // Tạo người dùng chính thức trong Database
        await prisma.user.create({
            data: {
                username: pending.username,
                email: pending.email,
                password: pending.hashedPassword,
                role: pending.role,
            }
        });

        // Xóa khỏi danh sách tạm
        pendingRegistrations.delete(normalizedEmail);

        res.status(201).json({
            success: true,
            message: 'Tạo tài khoản và xác thực email thành công! Bạn có thể đăng nhập ngay.'
        });
    } catch (error) {
        console.error("DEBUG VERIFY OTP ERROR:", error);
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: error.issues[0].message });
            return;
        }
        res.status(500).json({ message: (error as any).message || 'Có lỗi xảy ra khi xác thực' });
    }
};

// 3. Controller gửi lại mã OTP
export const resendOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ message: 'Email là bắt buộc' });
            return;
        }

        const normalizedEmail = String(email).toLowerCase().trim();
        const pending = pendingRegistrations.get(normalizedEmail);

        if (!pending) {
            res.status(400).json({ message: 'Không tìm thấy yêu cầu đăng ký cho email này. Vui lòng đăng ký lại.' });
            return;
        }

        // Tạo OTP mới
        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        pending.otp = newOtp;
        pending.expiresAt = Date.now() + 10 * 60 * 1000;
        pendingRegistrations.set(normalizedEmail, pending);

        const emailSent = await sendVerificationOtp(normalizedEmail, newOtp, pending.username);
        if (!emailSent) {
            res.status(500).json({ message: 'Lỗi khi gửi lại email xác thực' });
            return;
        }

        res.status(200).json({
            success: true,
            message: `Mã xác thực mới đã được gửi tới ${normalizedEmail}`
        });
    } catch (error) {
        res.status(500).json({ message: (error as any).message || 'Có lỗi xảy ra khi gửi lại OTP' });
    }
};

// Controller đăng nhập
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // 1. Validate dữ liệu đầu vào
        const parsedData = LoginSchema.parse(req.body);
        const { email, password } = parsedData;

        // 2. Tìm người dùng
        const user = await prisma.user.findFirst({
            where: { email }
        });

        // 3. So sánh mật khẩu (Sử dụng thông báo chung để bảo mật)
        const invalidCredentialsMessage = 'Tài khoản hoặc mật khẩu không chính xác';

        if (!user) {
            res.status(400).json({ message: invalidCredentialsMessage });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: invalidCredentialsMessage });
            return;
        }

        // 4. Tạo JWT
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '30d' }
        );

        // 5. Trả về Token thống nhất dưới key 'token'
        res.status(200).json({
            message: 'Đăng nhập thành công',
            token
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: error.issues[0].message });
            return;
        }
        next(error);
    }
};
