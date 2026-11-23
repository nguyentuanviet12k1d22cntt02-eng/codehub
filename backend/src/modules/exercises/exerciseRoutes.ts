import { Router } from "express";
import { runCodeDynamic, submitExercise, getSubmissions } from "./exerciseController";
import { getSubmissionJob, startSubmissionJob, wantsAsync } from "../submissions/asyncSubmissionJobs";
import { authenticateToken } from "../../shared/middleware/auth";

const router = Router();

// Chạy code động trong sandbox Docker EC2
router.post('/compiler/run', runCodeDynamic);

// Nộp bài tập trong bài học
router.post('/exercises/:id/submit', authenticateToken, (req, res, next) => (
    wantsAsync(req) ? void startSubmissionJob(req, res, submitExercise) : submitExercise(req, res, next)
));

// Kết quả chấm của lượt nộp bất đồng bộ (dùng chung cho bài học và luyện tập)
router.get('/submission-jobs/:jobId', authenticateToken, getSubmissionJob);

// Lấy lịch sử nộp bài tập bài học
router.get('/exercises/:id/submissions', authenticateToken, getSubmissions);

export default router;
