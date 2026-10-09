import { Router } from "express";
import { getCourses, getCourseById, getLessonById, completeLesson, getLessonQuiz, submitLessonQuiz } from "./courseController";
import { authenticateToken, optionalAuthenticateToken } from "../../shared/middleware/auth";
import { getModulePracticeRecommendation } from "./modulePracticeRecommendation";

const router = Router();

// Lấy danh sách khóa học (Dashboard)
router.get('/dashboard', getCourses);

// Lấy chi tiết khóa học
router.get('/course/:id', optionalAuthenticateToken, getCourseById);

// Lấy chi tiết bài học
router.get('/lesson/:id', getLessonById);
router.get('/module-practice/:id/recommendation', authenticateToken, getModulePracticeRecommendation);

// Lấy danh sách câu hỏi trắc nghiệm của bài học
router.get('/lesson/:id/quiz', getLessonQuiz);

// Nộp bài trắc nghiệm chấm điểm
router.post('/lesson/:id/quiz/submit', authenticateToken, submitLessonQuiz);

// Đánh dấu hoàn thành bài học
router.post('/lessons/:id/complete', authenticateToken, completeLesson);

export default router;
