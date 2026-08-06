import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth';
import {
    generatePersonalizedPath,
    getMyPaths,
    getPathById,
    submitQuizAnswer,
    submitExerciseCode,
    startChatSession,
    replyChatMessage,
    confirmAndBuildPath
} from '../controllers/learningPath.controller';

const router = Router();

router.use(authenticateToken);

router.post('/generate', generatePersonalizedPath);
router.get('/my-paths', getMyPaths);
router.get('/:pathId', getPathById);
router.post('/submit-quiz', submitQuizAnswer);
router.post('/submit-exercise', submitExerciseCode);

// Chat Interactive Routes (KodeKloud AI Tutor Style)
router.post('/chat/start', startChatSession);
router.post('/chat/reply', replyChatMessage);
router.post('/chat/confirm', confirmAndBuildPath);

export default router;

