import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../config/prisma';

// Đảm bảo JWT_SECRET bắt buộc phải có
if (!process.env.JWT_SECRET) {
    throw new Error('FATAL: JWT_SECRET environment variable is missing!');
}
const JWT_SECRET = process.env.JWT_SECRET;

// Định nghĩa Schema validate đầu vào bằng Zod
const RegisterSchema = z.object({
    username: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),
    email: z.string().email('Email không đúng định dạng'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    role: z.enum(['STUDENT', 'TEACHER', 'ADMIN']).default('STUDENT'),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
});

const LoginSchema = z.object({
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(1, 'Mật khẩu không được để trống'),
});

// Controller đăng ký tài khoản
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // 1. Validate dữ liệu đầu vào
        const parsedData = RegisterSchema.parse(req.body);
        const { username, password, email, role, gender } = parsedData;

        // 2. Kiểm tra email tồn tại chưa
        const userExists = await prisma.user.findUnique({
            where: { email }
        });

        if (userExists) {
            res.status(400).json({ message: 'Tài khoản email đã tồn tại' });
            return;
        }

        // 3. Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Lưu user vào DB
        await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role,
                gender,
            }
        });

        res.status(201).json({ message: "Tạo tài khoản thành công" });
    } catch (error) {
        console.error("DEBUG REGISTER ERROR:", error);
        if (error instanceof z.ZodError) {
            // Trả về chi tiết lỗi validate cho Client
            res.status(400).json({ message: error.issues[0].message });
            return;
        }
        res.status(500).json({ message: (error as any).message || 'Có lỗi xảy ra trong quá trình đăng ký' });
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
