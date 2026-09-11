import { Router } from 'express';
import { authenticateToken } from '../../shared/middleware/auth';
import {
    generatePersonalizedPath,
    getMyPaths,
    getPathById,
    submitQuizAnswer,
    submitExerciseCode,
    startChatSession,
    replyChatMessage,
    confirmAndBuildPath,
    startAdaptiveExerciseFromChat,
    updateAdaptiveMastery,
    getChatSessions,
    getChatSessionById,
    deleteChatSession
} from './learningPath.controller';

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
router.get('/chat/sessions', getChatSessions);
router.get('/chat/session/:sessionId', getChatSessionById);
router.delete('/chat/session/:sessionId', deleteChatSession);

// Adaptive Learning Multi-Agent Routes
router.post('/adaptive/start-exercise', startAdaptiveExerciseFromChat);
router.post('/adaptive/update-mastery', updateAdaptiveMastery);

export default router;

