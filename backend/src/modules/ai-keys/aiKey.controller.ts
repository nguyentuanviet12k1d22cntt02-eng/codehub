import { Request, Response } from 'express';
import { prisma } from '../../infrastructure/database/prisma';

// Hàm che mờ API key để hiển thị an toàn trên giao diện
export const maskApiKey = (key: string): string => {
    if (!key) return '';
    if (key.length <= 12) return key.slice(0, 3) + '...' + key.slice(-3);
    return key.slice(0, 8) + '••••••••' + key.slice(-4);
};

// 1. Lấy danh sách toàn bộ API Keys (Cho Admin)
export const getAllKeys = async (req: Request, res: Response) => {
    try {
        // Tự động nạp key từ file .env nếu hồ chứa hiện đang trống
        const count = await prisma.aIProviderKey.count();
        if (count === 0 && process.env.GEMINI_API_KEY) {
            await prisma.aIProviderKey.create({
                data: {
                    provider: 'GEMINI',
                    apiKey: process.env.GEMINI_API_KEY.trim(),
                    label: 'Mặc định từ .env',
                    isActive: true
                }
            });
        }

        const keys = await prisma.aIProviderKey.findMany({
            orderBy: { createdAt: 'desc' }
        });

        const formatted = keys.map(k => ({
            id: k.id,
            provider: k.provider,
            apiKeyMasked: maskApiKey(k.apiKey),
            label: k.label || 'Không có nhãn',
            isActive: k.isActive,
            usageCount: k.usageCount,
            lastUsedAt: k.lastUsedAt,
            errorCount: k.errorCount,
            lastError: k.lastError,
            createdAt: k.createdAt
        }));

        return res.json({
            success: true,
            total: keys.length,
            activeCount: keys.filter(k => k.isActive).length,
            keys: formatted
        });
    } catch (error: any) {
        console.error('getAllKeys error:', error);
        return res.status(500).json({ success: false, message: 'Lỗi lấy danh sách API Keys: ' + error.message });
    }
};

// Helper tự động nhận diện provider dựa theo tiền tố của API Key
function detectProvider(key: string, selectedProvider: string = 'AUTO'): string {
    const trimmed = key.trim();
    if (selectedProvider && selectedProvider !== 'AUTO') {
        return selectedProvider.toUpperCase();
    }
    if (trimmed.startsWith('AIza')) return 'GEMINI';
    if (trimmed.startsWith('gsk_')) return 'GROQ';
    if (trimmed.startsWith('sk-or-')) return 'OPENROUTER';
    if (trimmed.startsWith('sk-ant-')) return 'ANTHROPIC';
    if (trimmed.startsWith('sk-')) return 'OPENAI';
    return 'GEMINI';
}

// 2. Thêm một hoặc nhiều API Key hàng loạt
export const createBulkKeys = async (req: Request, res: Response) => {
    try {
        const { provider = 'AUTO', rawKeys, label } = req.body;

        if (!rawKeys || typeof rawKeys !== 'string') {
            return res.status(400).json({ success: false, message: 'Vui lòng cung cấp danh sách API Keys' });
        }

        // Tách chuỗi theo dấu xuống dòng hoặc dấu phẩy
        const lines = rawKeys
            .split(/[\r\n,]+/)
            .map(k => k.trim())
            .filter(k => k.length > 5);

        if (lines.length === 0) {
            return res.status(400).json({ success: false, message: 'Không tìm thấy API Key hợp lệ nào để thêm' });
        }

        // Lấy danh sách key đã tồn tại để chống trùng
        const existingKeys = await prisma.aIProviderKey.findMany({
            select: { apiKey: true }
        });
        const existingSet = new Set(existingKeys.map(k => k.apiKey));

        const toInsert = [];
        for (let i = 0; i < lines.length; i++) {
            const keyStr = lines[i];
            if (!existingSet.has(keyStr)) {
                existingSet.add(keyStr);
                const assignedProvider = detectProvider(keyStr, provider);
                toInsert.push({
                    provider: assignedProvider,
                    apiKey: keyStr,
                    label: label ? (lines.length > 1 ? `${label} #${i + 1}` : label) : `Key ${assignedProvider} #${Date.now().toString().slice(-4)}`,
                    isActive: true
                });
            }
        }

        if (toInsert.length === 0) {
            return res.status(400).json({ success: false, message: 'Tất cả các key vừa nhập đều đã tồn tại trong hồ chứa' });
        }

        await prisma.aIProviderKey.createMany({
            data: toInsert
        });

        return res.json({
            success: true,
            message: `Đã nạp thành công ${toInsert.length} API Key vào hồ chứa!`,
            addedCount: toInsert.length,
            skippedCount: lines.length - toInsert.length
        });
    } catch (error: any) {
        console.error('createBulkKeys error:', error);
        return res.status(500).json({ success: false, message: 'Lỗi thêm API Keys: ' + error.message });
    }
};

// 3. Bật / Tắt trạng thái kích hoạt Key
export const toggleKeyStatus = async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id);
        const existing = await prisma.aIProviderKey.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy API Key' });
        }

        const updated = await prisma.aIProviderKey.update({
            where: { id },
            data: { isActive: !existing.isActive }
        });

        return res.json({
            success: true,
            message: `Đã ${updated.isActive ? 'kích hoạt' : 'tạm ngưng'} API Key thành công`,
            isActive: updated.isActive
        });
    } catch (error: any) {
        console.error('toggleKeyStatus error:', error);
        return res.status(500).json({ success: false, message: 'Lỗi thay đổi trạng thái key: ' + error.message });
    }
};

// 4. Xóa Key khỏi hồ chứa
export const deleteKey = async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id);
        await prisma.aIProviderKey.delete({ where: { id } });
        return res.json({ success: true, message: 'Đã xóa API Key khỏi hồ chứa' });
    } catch (error: any) {
        console.error('deleteKey error:', error);
        return res.status(500).json({ success: false, message: 'Lỗi xóa API Key: ' + error.message });
    }
};

// 5. Kiểm tra trực tiếp Key xem có hoạt động không (Test Key đa nhà cung cấp)
export const testKey = async (req: Request, res: Response) => {
    try {
        let keyToTest = req.body.apiKey;
        const id = req.body.id ? String(req.body.id) : undefined;
        let provider = String(req.body.provider || 'GEMINI').toUpperCase();

        if (!keyToTest && id) {
            const found = await prisma.aIProviderKey.findUnique({ where: { id } });
            if (found) {
                keyToTest = found.apiKey;
                provider = found.provider.toUpperCase();
            }
        }

        if (!keyToTest) {
            return res.status(400).json({ success: false, message: 'Không tìm thấy API Key để kiểm tra' });
        }

        const trimmedKey = keyToTest.trim();
        const startTime = Date.now();
        let isSuccess = false;
        let statusCode = 500;
        let responseMessage = '';

        if (provider === 'GEMINI') {
            const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${trimmedKey}`;
            const testRes = await fetch(url);
            statusCode = testRes.status;
            if (testRes.ok) {
                isSuccess = true;
                responseMessage = 'Google Gemini xác thực thành công!';
            } else {
                const errText = await testRes.text();
                responseMessage = `Gemini từ chối (HTTP ${statusCode}): ${errText.slice(0, 120)}`;
            }
        } else if (provider === 'GROQ') {
            const testRes = await fetch('https://api.groq.com/openai/v1/models', {
                headers: { 'Authorization': `Bearer ${trimmedKey}` }
            });
            statusCode = testRes.status;
            if (testRes.ok) {
                isSuccess = true;
                responseMessage = 'Groq Cloud xác thực thành công!';
            } else {
                const errText = await testRes.text();
                responseMessage = `Groq từ chối (HTTP ${statusCode}): ${errText.slice(0, 120)}`;
            }
        } else if (provider === 'OPENROUTER') {
            const testRes = await fetch('https://openrouter.ai/api/v1/auth/key', {
                headers: { 'Authorization': `Bearer ${trimmedKey}` }
            });
            statusCode = testRes.status;
            if (testRes.ok) {
                isSuccess = true;
                responseMessage = 'OpenRouter xác thực thành công!';
            } else {
                const errText = await testRes.text();
                responseMessage = `OpenRouter từ chối (HTTP ${statusCode}): ${errText.slice(0, 120)}`;
            }
        } else if (provider === 'OPENAI') {
            const testRes = await fetch('https://api.openai.com/v1/models', {
                headers: { 'Authorization': `Bearer ${trimmedKey}` }
            });
            statusCode = testRes.status;
            if (testRes.ok) {
                isSuccess = true;
                responseMessage = 'OpenAI xác thực thành công!';
            } else {
                const errText = await testRes.text();
                responseMessage = `OpenAI từ chối (HTTP ${statusCode}): ${errText.slice(0, 120)}`;
            }
        } else {
            // Default check
            isSuccess = true;
            statusCode = 200;
            responseMessage = `Nhà cung cấp ${provider} đã được ghi nhận.`;
        }

        const latency = Date.now() - startTime;

        if (id) {
            if (isSuccess) {
                await prisma.aIProviderKey.update({
                    where: { id },
                    data: { lastUsedAt: new Date(), lastError: null, isActive: true }
                });
            } else {
                await prisma.aIProviderKey.update({
                    where: { id },
                    data: { lastError: responseMessage, errorCount: { increment: 1 } }
                });
            }
        }

        return res.json({
            success: isSuccess,
            status: statusCode,
            latencyMs: latency,
            message: isSuccess 
                ? `✅ ${responseMessage} (${latency}ms)`
                : `❌ ${responseMessage} (${latency}ms)`
        });
    } catch (error: any) {
        console.error('testKey error:', error);
        return res.status(500).json({ success: false, message: 'Lỗi kiểm tra API Key: ' + error.message });
    }
};

// 6. Endpoint nội bộ cho AI Service lấy danh sách Key đang hoạt động theo từng Provider
export const getActiveKeysInternal = async (req: Request, res: Response) => {
    try {
        const activeKeys = await prisma.aIProviderKey.findMany({
            where: { isActive: true },
            select: { id: true, provider: true, apiKey: true }
        });

        // Phân loại key theo từng nhà cung cấp
        const geminiKeys = activeKeys.filter(k => k.provider === 'GEMINI').map(k => k.apiKey);
        const groqKeys = activeKeys.filter(k => k.provider === 'GROQ').map(k => k.apiKey);
        const openrouterKeys = activeKeys.filter(k => k.provider === 'OPENROUTER').map(k => k.apiKey);
        const openaiKeys = activeKeys.filter(k => k.provider === 'OPENAI').map(k => k.apiKey);

        // Fallback từ .env nếu bảng trống
        if (geminiKeys.length === 0 && process.env.GEMINI_API_KEY) {
            geminiKeys.push(process.env.GEMINI_API_KEY.trim());
        }
        if (groqKeys.length === 0 && process.env.GROQ_API_KEY) {
            groqKeys.push(process.env.GROQ_API_KEY.trim());
        }
        if (openrouterKeys.length === 0 && process.env.OPENROUTER_API_KEY) {
            openrouterKeys.push(process.env.OPENROUTER_API_KEY.trim());
        }
        if (openaiKeys.length === 0 && process.env.OPENAI_API_KEY) {
            openaiKeys.push(process.env.OPENAI_API_KEY.trim());
        }

        return res.json({
            success: true,
            geminiKeys,
            groqKeys,
            openrouterKeys,
            openaiKeys,
            allKeys: activeKeys
        });
    } catch (error: any) {
        console.error('getActiveKeysInternal error:', error);
        return res.status(500).json({
            success: false,
            geminiKeys: process.env.GEMINI_API_KEY ? [process.env.GEMINI_API_KEY.trim()] : [],
            groqKeys: [],
            openrouterKeys: [],
            openaiKeys: []
        });
    }
};

// 7. Báo cáo sử dụng/lỗi từ AI Service
export const reportKeyUsageInternal = async (req: Request, res: Response) => {
    try {
        const { apiKey, success, errorMessage } = req.body;
        if (!apiKey) return res.json({ ok: true });

        const keyRecord = await prisma.aIProviderKey.findFirst({
            where: { apiKey }
        });

        if (keyRecord) {
            if (success) {
                await prisma.aIProviderKey.update({
                    where: { id: keyRecord.id },
                    data: {
                        usageCount: { increment: 1 },
                        lastUsedAt: new Date()
                    }
                });
            } else if (errorMessage) {
                await prisma.aIProviderKey.update({
                    where: { id: keyRecord.id },
                    data: {
                        errorCount: { increment: 1 },
                        lastError: errorMessage.slice(0, 255)
                    }
                });
            }
        }
        return res.json({ ok: true });
    } catch (e) {
        return res.json({ ok: false });
    }
};

// 8. Ghi nhận log chi tiết từng cuộc gọi AI
export const recordCallLogInternal = async (req: Request, res: Response) => {
    try {
        const { provider, model, apiKey, status, statusCode, latencyMs, promptSample, responseSample, errorMessage } = req.body;
        const masked = apiKey ? (apiKey.slice(0, 8) + '••••••••' + apiKey.slice(-6)) : 'UNKNOWN';

        await prisma.aICallLog.create({
            data: {
                provider: String(provider || 'UNKNOWN').toUpperCase(),
                model: String(model || 'unknown'),
                apiKeyMasked: masked,
                status: String(status || 'SUCCESS'),
                statusCode: Number(statusCode || 200),
                latencyMs: Number(latencyMs || 0),
                promptSample: promptSample ? String(promptSample).slice(0, 500) : null,
                responseSample: responseSample ? String(responseSample).slice(0, 800) : null,
                errorMessage: errorMessage ? String(errorMessage).slice(0, 500) : null
            }
        });

        // Đồng thời cập nhật vào AIProviderKey nếu tìm thấy
        if (apiKey) {
            const keyRecord = await prisma.aIProviderKey.findFirst({ where: { apiKey } });
            if (keyRecord) {
                if (status === 'SUCCESS') {
                    await prisma.aIProviderKey.update({
                        where: { id: keyRecord.id },
                        data: { usageCount: { increment: 1 }, lastUsedAt: new Date() }
                    });
                } else {
                    await prisma.aIProviderKey.update({
                        where: { id: keyRecord.id },
                        data: { errorCount: { increment: 1 }, lastError: errorMessage ? String(errorMessage).slice(0, 255) : null }
                    });
                }
            }
        }

        return res.json({ ok: true });
    } catch (e: any) {
        console.error('recordCallLogInternal error:', e);
        return res.json({ ok: false });
    }
};

// 9. Lấy danh sách lịch sử gọi AI cho Admin
export const getCallLogs = async (req: Request, res: Response) => {
    try {
        const limit = Math.min(Number(req.query.limit || 50), 100);
        const logs = await prisma.aICallLog.findMany({
            take: limit,
            orderBy: { createdAt: 'desc' }
        });

        const totalCalls = await prisma.aICallLog.count();
        const successCalls = await prisma.aICallLog.count({ where: { status: 'SUCCESS' } });

        return res.json({
            success: true,
            total: totalCalls,
            successRate: totalCalls > 0 ? Math.round((successCalls / totalCalls) * 100) : 100,
            logs
        });
    } catch (error: any) {
        console.error('getCallLogs error:', error);
        return res.status(500).json({ success: false, message: 'Lỗi lấy lịch sử cuộc gọi AI: ' + error.message });
    }
};
