import { Router } from "express";
import {
    getPracticeProblems,
    getPracticeProblemBySlug,
    runPracticeCode,
    submitPracticeCode,
    getPracticeSubmissions,
    getLeaderboard
} from "../controllers/practiceController";
import { authenticateToken, optionalAuthenticateToken } from "../middlewares/auth";

const router = Router();

// Lấy danh sách bài tập luyện tập chuyên sâu
router.get('/practice/problems', optionalAuthenticateToken, getPracticeProblems);

// Lấy thông tin chi tiết bài tập luyện tập qua slug
router.get('/practice/problems/:slug', getPracticeProblemBySlug);

// Chạy code test thử bài tập tự do
router.post('/practice/compiler/run', runPracticeCode);

// Nộp bài tập luyện tập tự do
router.post('/practice/problems/:id/submit', authenticateToken, submitPracticeCode);

// Lấy lịch sử nộp bài luyện tập
router.get('/practice/problems/:id/submissions', authenticateToken, getPracticeSubmissions);

// Bảng xếp hạng học viên
router.get('/practice/leaderboard', getLeaderboard);

export default router;
