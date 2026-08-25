import { Router } from "express";
import { getCourses, getCourseById, getLessonById, completeLesson, getLessonQuiz, submitLessonQuiz } from "../controllers/courseController";
import { authenticateToken, optionalAuthenticateToken } from "../middlewares/auth";

const router = Router();

// Lấy danh sách khóa học (Dashboard)
router.get('/dashboard', getCourses);

// Lấy chi tiết khóa học
router.get('/course/:id', optionalAuthenticateToken, getCourseById);

// Lấy chi tiết bài học
router.get('/lesson/:id', getLessonById);

// Lấy danh sách câu hỏi trắc nghiệm của bài học
router.get('/lesson/:id/quiz', getLessonQuiz);

// Nộp bài trắc nghiệm chấm điểm
router.post('/lesson/:id/quiz/submit', submitLessonQuiz);

// Đánh dấu hoàn thành bài học
router.post('/lessons/:id/complete', authenticateToken, completeLesson);

export default router;
