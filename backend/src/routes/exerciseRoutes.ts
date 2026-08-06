import { Router } from "express";
import { runCodeDynamic, submitExercise, getSubmissions } from "../controllers/exerciseController";
import { authenticateToken } from "../middlewares/auth";

const router = Router();

// Chạy code động trong Sandbox (Docker)
router.post('/compiler/run', runCodeDynamic);

// Nộp bài tập trong bài học
router.post('/exercises/:id/submit', authenticateToken, submitExercise);

// Lấy lịch sử nộp bài tập bài học
router.get('/exercises/:id/submissions', authenticateToken, getSubmissions);

export default router;
