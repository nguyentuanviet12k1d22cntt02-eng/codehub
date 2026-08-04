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
    getSystemActivity
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

export default router;
