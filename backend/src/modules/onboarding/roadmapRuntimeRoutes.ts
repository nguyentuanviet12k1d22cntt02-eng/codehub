import { Router, Response } from 'express';
import { AuthenticatedRequest, authenticateToken } from '../../shared/middleware/auth';
import { roadmapRuntimeService } from './roadmapRuntimeService';

const router = Router();
router.use(authenticateToken);

function respondError(res: Response, error: any): void {
  const message = error?.message ?? 'Không thể xử lý lộ trình.';
  const code = message.split(':', 1)[0];
  const status = code === 'FORBIDDEN' ? 403 : code.endsWith('NOT_FOUND') ? 404
    : code.startsWith('INVALID_') ? 400
      : /UNAVAILABLE|REVIEW_REQUIRED|VERSION_MISMATCH/.test(code) ? 503 : 409;
  res.status(status).json({ code, error: message });
}

function user(req: AuthenticatedRequest, res: Response): string | null {
  if (req.user?.id) return req.user.id;
  res.status(401).json({ code: 'UNAUTHORIZED', error: 'Cần đăng nhập.' });
  return null;
}

router.post('/', async (req: AuthenticatedRequest, res) => {
  const userId = user(req, res);
  if (!userId) return;
  try {
    const roadmap = await roadmapRuntimeService.create(userId, req.body?.assessmentId);
    res.status(201).json(roadmap);
  } catch (error) { respondError(res, error); }
});

router.get('/latest', async (req: AuthenticatedRequest, res) => {
  const userId = user(req, res);
  if (!userId) return;
  try {
    const roadmap = await roadmapRuntimeService.getLatest(userId);
    if (!roadmap) {
      return res.status(404).json({ code: 'ROADMAP_NOT_FOUND', error: 'Chưa có lộ trình nào.' });
    }
    res.json(roadmap);
  } catch (error) { respondError(res, error); }
});

router.get('/:id', async (req: AuthenticatedRequest, res) => {
  const userId = user(req, res);
  if (!userId) return;
  try { res.json(await roadmapRuntimeService.get(userId, req.params.id as string)); }
  catch (error) { respondError(res, error); }
});

router.post('/:id/sync', async (req: AuthenticatedRequest, res) => {
  const userId = user(req, res);
  if (!userId) return;
  try { res.json(await roadmapRuntimeService.sync(userId, req.params.id as string)); }
  catch (error) { respondError(res, error); }
});

export default router;
