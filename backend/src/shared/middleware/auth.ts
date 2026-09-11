import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        username: string;
        email?: string;
        role: string;
    };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Không tìm thấy token xác thực' });
        return;
    }

    try {
        const secret = process.env.JWT_SECRET || 'secret';
        const decoded = jwt.verify(token, secret) as any;
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
        return;
    }
};

export const optionalAuthenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        next();
        return;
    }

    try {
        const secret = process.env.JWT_SECRET || 'secret';
        const decoded = jwt.verify(token, secret) as any;
        req.user = decoded;
        next();
    } catch (err) {
        // Continue even if token is invalid, but don't set req.user
        next();
    }
};
