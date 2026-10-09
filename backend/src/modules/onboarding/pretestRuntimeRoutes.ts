import { Router } from 'express';
import { authenticateToken } from '../../shared/middleware/auth';
import { pretestRuntimeController } from './pretestRuntimeController';

const router = Router();
router.use(authenticateToken);
router.post('/', (req, res) => pretestRuntimeController.create(req, res));
router.get('/assessments/:id', (req, res) => pretestRuntimeController.getAssessment(req, res));
router.get('/:id', (req, res) => pretestRuntimeController.get(req, res));
router.put('/:id/answers', (req, res) => pretestRuntimeController.saveAnswer(req, res));
router.post('/:id/submit', (req, res) => pretestRuntimeController.submit(req, res));

export default router;
