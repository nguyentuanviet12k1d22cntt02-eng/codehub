import { Router } from "express";
import { register, login } from "../controllers/controller";
import dotenv from 'dotenv';
import { getCourses, getCourseById, getLessonById, completeLesson } from "../controllers/courseController";
import { runCodeDynamic, submitExercise, getSubmissions } from "../controllers/exerciseController";
import {
    getPracticeProblems,
    getPracticeProblemBySlug,
    runPracticeCode,
    submitPracticeCode,
    getPracticeSubmissions,
    getLeaderboard
} from "../controllers/practiceController";
import { authenticateToken, optionalAuthenticateToken } from "../middlewares/auth";

dotenv.config();
const router = Router();

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

router.get('/dashboard', getCourses);
router.get('/course/:id', getCourseById);
router.get('/lesson/:id', getLessonById);

// Bài học & Bài tập thực hành
router.post('/lessons/:id/complete', authenticateToken, completeLesson);
router.post('/compiler/run', runCodeDynamic);
router.post('/exercises/:id/submit', authenticateToken, submitExercise);
router.get('/exercises/:id/submissions', authenticateToken, getSubmissions);

// Phân hệ Luyện tập Thuật toán Độc lập (Practice Platform)
router.get('/practice/problems', optionalAuthenticateToken, getPracticeProblems);
router.get('/practice/problems/:slug', getPracticeProblemBySlug);
router.post('/practice/compiler/run', runPracticeCode);
router.post('/practice/problems/:id/submit', authenticateToken, submitPracticeCode);
router.get('/practice/problems/:id/submissions', authenticateToken, getPracticeSubmissions);
router.get('/practice/leaderboard', getLeaderboard);

export default router;