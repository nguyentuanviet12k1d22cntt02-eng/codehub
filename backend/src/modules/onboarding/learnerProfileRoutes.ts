import { Router } from 'express';
import { authenticateToken } from '../../shared/middleware/auth';
import { pretestRuntimeController } from './pretestRuntimeController';

const router = Router();
router.get('/', authenticateToken, (req, res) => pretestRuntimeController.getProfile(req, res));

export default router;
