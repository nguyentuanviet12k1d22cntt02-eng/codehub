// J02 (E2E giai đoạn 2): lỗi HTTP khi gửi tin cho AI Tutor phải có thông điệp tiếng Việt đúng bản chất,
// không hiện "409 Conflict" và không gọi mọi lỗi là "kết nối gián đoạn".
import assert from 'node:assert/strict';
import { createServer } from 'vite';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
try {
    const { chatHttpErrorMessage, ChatHttpError } = await server.ssrLoadModule('/src/features/adaptive-learning/chatHttpError.ts');
    const busy = chatHttpErrorMessage(409, { success: false, error: 'Phiên này đang xử lý một yêu cầu' });
    assert.match(busy, /đang được xử lý/);
    assert.match(busy, /^Yêu cầu trước trong cuộc trò chuyện này vẫn đang được xử lý\./);
    assert.doesNotMatch(busy, /409|Conflict|gián đoạn/);
    assert.match(chatHttpErrorMessage(409, { error: 'PIPELINE_RESUMING', message: 'Lượt xử lý trước đang được tiếp tục tự động. Hãy đợi hoàn tất rồi gửi yêu cầu mới.' }), /^Lượt xử lý trước/);
    assert.doesNotMatch(chatHttpErrorMessage(409, { error: 'PIPELINE_RESUMING' }), /PIPELINE_RESUMING/, 'mã nội bộ không hiện cho học viên');
    assert.match(chatHttpErrorMessage(423, {}), /tạm khóa/);
    assert.match(chatHttpErrorMessage(429, {}), /quá nhiều yêu cầu/);
    assert.match(chatHttpErrorMessage(401, {}), /đăng nhập lại/);
    assert.match(chatHttpErrorMessage(400, {}), /6\.000 ký tự/);
    assert.match(chatHttpErrorMessage(503, { error: 'PIPELINE_UNAVAILABLE' }), /gặp sự cố/);
    for (const status of [400, 401, 403, 404, 409, 423, 429, 500, 503]) assert.doesNotMatch(chatHttpErrorMessage(status, {}), /\b(?:400|401|403|404|409|423|429|500|503)\b|Conflict|statusText/);
    const error = new ChatHttpError(409, busy);
    assert.ok(error instanceof Error && error.status === 409 && error.message === busy);
    console.log('chatHttpError: ok');
} finally {
    await server.close();
}
