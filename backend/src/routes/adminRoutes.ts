import { Router } from 'express';
import {
    getDashboardStats,
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    resetUserPassword,
    getAllCoursesAdmin,
    deleteCourse,
    getAllSubmissions,
    getAllPracticeProblemsAdmin,
    deletePracticeProblem,
    getSystemActivity,
    getCurriculumTreeAdmin,
    getAllLessonsAdmin,
    getLessonDetailAdmin,
    createLessonAdmin,
    updateLessonAdmin,
    deleteLessonAdmin,
    getExercisesByLessonAdmin,
    createExerciseAdmin,
    updateExerciseAdmin,
    deleteExerciseAdmin,
    getTestCasesByExerciseAdmin,
    createTestCaseAdmin,
    updateTestCaseAdmin,
    deleteTestCaseAdmin,
    getQuizzesByLessonAdmin,
    createQuizQuestionAdmin,
    updateQuizQuestionAdmin,
    deleteQuizQuestionAdmin
} from '../controllers/adminController';
import {
    getUserGrowthStats,
    getSubmissionStats,
    getCourseEngagement,
    getTopPerformers,
    getSystemHealth
} from '../controllers/adminAnalyticsController';
import { authenticateAdmin } from '../middlewares/adminAuth';

const router = Router();

// Tất cả routes đều yêu cầu admin authentication
router.use(authenticateAdmin);

// ============ DASHBOARD ============
router.get('/dashboard/stats', getDashboardStats);
router.get('/dashboard/activity', getSystemActivity);

// ============ ANALYTICS ============
router.get('/analytics/user-growth', getUserGrowthStats);
router.get('/analytics/submissions', getSubmissionStats);
router.get('/analytics/course-engagement', getCourseEngagement);
router.get('/analytics/top-performers', getTopPerformers);
router.get('/analytics/system-health', getSystemHealth);

// ============ USER MANAGEMENT ============
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.post('/users/:id/reset-password', resetUserPassword);

// ============ COURSE MANAGEMENT ============
router.get('/courses', getAllCoursesAdmin);
router.delete('/courses/:id', deleteCourse);

// ============ SUBMISSION MANAGEMENT ============
router.get('/submissions', getAllSubmissions);

// ============ PRACTICE PROBLEM MANAGEMENT ============
router.get('/practice-problems', getAllPracticeProblemsAdmin);
router.delete('/practice-problems/:id', deletePracticeProblem);

// ============ CURRICULUM & LESSONS ============
router.get('/curriculum-tree', getCurriculumTreeAdmin);
router.get('/lessons', getAllLessonsAdmin);
router.get('/lessons/:id', getLessonDetailAdmin);
router.post('/lessons', createLessonAdmin);
router.put('/lessons/:id', updateLessonAdmin);
router.delete('/lessons/:id', deleteLessonAdmin);

// ============ CODING EXERCISES ============
router.get('/exercises', getExercisesByLessonAdmin);
router.post('/exercises', createExerciseAdmin);
router.put('/exercises/:id', updateExerciseAdmin);
router.delete('/exercises/:id', deleteExerciseAdmin);

// ============ TEST CASES ============
router.get('/exercises/:exerciseId/testcases', getTestCasesByExerciseAdmin);
router.post('/testcases', createTestCaseAdmin);
router.put('/testcases/:id', updateTestCaseAdmin);
router.delete('/testcases/:id', deleteTestCaseAdmin);

// ============ QUIZZES & OPTIONS ============
router.get('/quizzes', getQuizzesByLessonAdmin);
router.post('/quizzes', createQuizQuestionAdmin);
router.put('/quizzes/:id', updateQuizQuestionAdmin);
router.delete('/quizzes/:id', deleteQuizQuestionAdmin);

export default router;
