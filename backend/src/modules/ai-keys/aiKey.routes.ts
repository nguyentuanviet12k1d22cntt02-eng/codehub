import { Router } from 'express';
import { authenticateAdmin } from '../../shared/middleware/adminAuth';
import {
    getAllKeys,
    createBulkKeys,
    toggleKeyStatus,
    deleteKey,
    testKey,
    getActiveKeysInternal,
    reportKeyUsageInternal,
    getCallLogs,
    recordCallLogInternal
} from './aiKey.controller';

// 1. Router dành cho trang Admin (Bảo vệ bằng authenticateAdmin)
export const aiKeyAdminRouter = Router();
aiKeyAdminRouter.use(authenticateAdmin);

aiKeyAdminRouter.get('/', getAllKeys);
aiKeyAdminRouter.get('/logs', getCallLogs);
aiKeyAdminRouter.post('/bulk', createBulkKeys);
aiKeyAdminRouter.put('/:id/toggle', toggleKeyStatus);
aiKeyAdminRouter.delete('/:id', deleteKey);
aiKeyAdminRouter.post('/test', testKey);

// 2. Router nội bộ dành cho AI Service đồng bộ Key & xem logs
export const aiKeyInternalRouter = Router();
aiKeyInternalRouter.get('/active', getActiveKeysInternal);
aiKeyInternalRouter.get('/logs', getCallLogs);
aiKeyInternalRouter.post('/report', reportKeyUsageInternal);
aiKeyInternalRouter.post('/log', recordCallLogInternal);
