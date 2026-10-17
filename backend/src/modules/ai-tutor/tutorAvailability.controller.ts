import { Response } from 'express';
import { AuthenticatedRequest } from '../../shared/middleware/auth';
import { getTutorAvailability, setTutorAvailability } from './tutorAvailability';

export async function getLearnerTutorAvailability(_req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const availability = await getTutorAvailability();
        res.json({ success: true, ...availability });
    } catch {
        res.status(503).json({ success: false, error: 'AI_TUTOR_STATUS_UNAVAILABLE' });
    }
}

export async function getAdminTutorAvailability(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (req.user?.role !== 'ADMIN') {
        res.status(403).json({ success: false, message: 'Chỉ quản trị viên mới được thay đổi trạng thái AI Tutor.' });
        return;
    }
    try {
        const availability = await getTutorAvailability();
        res.json({ success: true, availability });
    } catch {
        res.status(503).json({ success: false, message: 'Không tải được trạng thái AI Tutor.' });
    }
}

export async function updateAdminTutorAvailability(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (req.user?.role !== 'ADMIN') {
        res.status(403).json({ success: false, message: 'Chỉ quản trị viên mới được thay đổi trạng thái AI Tutor.' });
        return;
    }
    if (typeof req.body?.enabled !== 'boolean') {
        res.status(400).json({ success: false, message: 'Trạng thái enabled phải là kiểu boolean.' });
        return;
    }
    try {
        const availability = await setTutorAvailability(req.body.enabled, req.user.id);
        res.json({ success: true, availability });
    } catch {
        res.status(503).json({ success: false, message: 'Không cập nhật được trạng thái AI Tutor.' });
    }
}
