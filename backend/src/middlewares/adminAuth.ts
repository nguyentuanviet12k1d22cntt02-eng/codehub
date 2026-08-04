import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { AuthenticatedRequest } from './auth';

interface JwtPayload {
    id?: string;
    userId?: string;
    role: string;
}

export const authenticateAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Không có token xác thực' });
        }

        const secret = process.env.JWT_SECRET || 'mykey';
        const decoded = jwt.verify(token, secret) as JwtPayload;

        const targetId = decoded.id || decoded.userId;
        if (!targetId) {
            return res.status(401).json({ message: 'Token không hợp lệ (thiếu ID người dùng)' });
        }

        const user = await prisma.user.findUnique({
            where: { id: targetId },
            select: { id: true, username: true, email: true, role: true }
        });

        if (!user) {
            return res.status(401).json({ message: 'User không tồn tại' });
        }

        if (user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Bạn không có quyền truy cập trang này' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
};
