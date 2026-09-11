import { Router } from "express";
import { getRecommendations, getUserMastery, getSkillGraph } from "./recommendationController";
import { authenticateToken } from "../../shared/middleware/auth";

const router = Router();

// Gợi ý bài học thích ứng qua PAL-Net / BKT / DKT
router.get('/recommendations', authenticateToken, getRecommendations);

// Lấy năng lực của người dùng theo KCs
router.get('/user-mastery', authenticateToken, getUserMastery);

// Lấy toàn bộ cây đồ thị tri thức DAG và siêu dữ liệu
router.get('/skill-graph', getSkillGraph);

export default router;
