import { Router } from 'express';
import { authenticateToken } from '../../shared/middleware/auth';
import { onboardingController } from './onboardingController';

const router = Router();

// Route lấy danh sách mục tiêu và module có thể gọi công khai hoặc khi đã đăng nhập
router.get('/goals', (req, res) => onboardingController.getGoals(req, res));

// Các route bên dưới bắt buộc phải có token xác thực
router.use(authenticateToken);

router.post('/survey', (req, res) => onboardingController.submitSurvey(req, res));
router.get('/survey', (req, res) => onboardingController.getLatestSurvey(req, res));
router.get('/survey/:id', (req, res) => onboardingController.getSurveyById(req, res));
router.get('/pretest-readiness/:surveyId', (req, res) => onboardingController.getPretestReadiness(req, res));

export default router;
