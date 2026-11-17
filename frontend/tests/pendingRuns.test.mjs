// G05 (E2E giai đoạn 2): mở lại phiên khi run còn chạy phải hiện tin nhắn chờ để TutorProcessing tự cập nhật.
import assert from 'node:assert/strict';
import { createServer } from 'vite';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
try {
    const { withPendingRuns } = await server.ssrLoadModule('/src/features/adaptive-learning/pendingRuns.ts');
    const { isPendingPipeline } = await server.ssrLoadModule('/src/features/ai-tutor/components/TutorProcessing.tsx');
    const user = { sender: 'USER', content: 'Cho tôi bài về while' };
    const out = withPendingRuns([user], [{ trace_id: 'trace_a', status: 'RUNNING' }]);
    assert.equal(out.length, 2);
    assert.equal(out[1].sender, 'AI_TUTOR');
    assert.equal(out[1].metadata.pipeline.trace_id, 'trace_a');
    assert.ok(isPendingPipeline(out[1].metadata.pipeline.status), 'tin nhắn chờ được TutorProcessing theo dõi');
    // Đã có tin nhắn của run này (vd WAITING_PROVIDER đã lưu) → không thêm trùng.
    const existing = { sender: 'AI_TUTOR', content: 'đang chờ', metadata: { pipeline: { trace_id: 'trace_a', status: 'WAITING_PROVIDER' } } };
    assert.equal(withPendingRuns([user, existing], [{ trace_id: 'trace_a', status: 'WAITING_PROVIDER' }]).length, 2);
    // Dữ liệu lạ hoặc trống → giữ nguyên.
    for (const bad of [undefined, null, [], [{}], [{ trace_id: 'x', status: 'SUCCEEDED' }], 'RUNNING']) {
        const same = [user];
        assert.equal(withPendingRuns(same, bad), same);
    }
    console.log('pendingRuns: ok');
} finally {
    await server.close();
}
