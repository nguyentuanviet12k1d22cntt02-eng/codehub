import { Router } from "express";
import { getRecommendations, getUserMastery } from "../controllers/recommendationController";
import { authenticateToken } from "../middlewares/auth";

const router = Router();

// Gợi ý bài học thích ứng qua PAL-Net / BKT / DKT
router.get('/recommendations', authenticateToken, getRecommendations);

// Lấy năng lực của người dùng theo KCs
router.get('/user-mastery', authenticateToken, getUserMastery);

export default router;
