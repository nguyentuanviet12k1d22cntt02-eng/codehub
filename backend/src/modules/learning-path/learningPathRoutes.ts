import { Router } from 'express';
import { authenticateToken } from '../../shared/middleware/auth';
import { getMyPaths, getPathById, submitQuizAnswer, getChatSessions, deleteChatSession } from './learningPath.controller';
import { startChat,replyChat,startChatStream,replyChatStream,startExercise,submitExercise,
    retiredMastery,generatePath,confirmPath,reportRun,getSession } from '../adaptive/adaptive.controller';

const router=Router();
router.use(authenticateToken);
router.post('/generate',generatePath);
router.get('/my-paths',getMyPaths);
router.get('/:pathId',getPathById);
router.post('/submit-quiz',submitQuizAnswer);
router.post('/submit-exercise',submitExercise);
router.post('/chat/start',startChat);
router.post('/chat/start-stream',startChatStream);
router.post('/chat/reply',replyChat);
router.post('/chat/reply-stream',replyChatStream);
router.post('/chat/confirm',confirmPath);
router.get('/chat/sessions',getChatSessions);
router.get('/chat/session/:sessionId',getSession);
router.delete('/chat/session/:sessionId',deleteChatSession);
router.post('/adaptive/start-exercise',startExercise);
router.post('/adaptive/update-mastery',retiredMastery);
router.get('/adaptive/runs/:traceId',reportRun);
export default router;
