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

/**
 * Khóa ký JWT. Không bao giờ dùng giá trị dự phòng đoán được: thiếu cấu hình thì từ chối mọi token
 * (trước đây dùng 'secret'/'mykey', ai biết chuỗi đó đều tự ký được token hợp lệ).
 */
export function jwtSecret(): string | null {
    const secret = process.env.JWT_SECRET;
    return typeof secret === 'string' && secret.length > 0 ? secret : null;
}

let missingSecretLogged = false;
export function authNotConfigured(res: Response): void {
    if (!missingSecretLogged) {
        missingSecretLogged = true;
        console.error('[auth] JWT_SECRET chưa được cấu hình; mọi yêu cầu cần xác thực bị từ chối.');
    }
    res.status(503).json({ message: 'Máy chủ chưa sẵn sàng xác thực. Vui lòng thử lại sau.', error: 'AUTH_NOT_CONFIGURED' });
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Không tìm thấy token xác thực' });
        return;
    }

    const secret = jwtSecret();
    if (!secret) {
        authNotConfigured(res);
        return;
    }

    try {
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

    const secret = jwtSecret();
    if (!secret) {
        // Không xác thực được thì coi như khách, tuyệt đối không tin token.
        next();
        return;
    }

    try {
        const decoded = jwt.verify(token, secret) as any;
        req.user = decoded;
        next();
    } catch (err) {
        // Continue even if token is invalid, but don't set req.user
        next();
    }
};
