// Kịch bản reviews/exercise-generation-test-2026-11-21, nhóm C: bộ bài do backend tạo; frontend chỉ theo dõi tiến độ.
// Chạy: node tests/batchResume.test.mjs (trong thư mục frontend).
import assert from 'node:assert/strict';
import { createServer } from 'vite';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
let passed = 0;
const check = (name, fn) => { fn(); passed += 1; console.log('ok -', name); };
try {
    const { batchToWatch, batchPollOutcome, BATCH_POLL_MS } =
        await server.ssrLoadModule('/src/features/adaptive-learning/batchResume.ts');
    const { withPendingRuns } = await server.ssrLoadModule('/src/features/adaptive-learning/pendingRuns.ts');
    const status = (patch = {}) => ({ rootTraceId: 'trace_root0001', state: 'GENERATING', published: false, pathId: null, expectedCount: 5,
        completedCount: 3, running: true, nextIndex: 4, nextIndexFailures: 0,
        titles: ['Thêm', 'Xóa', 'Kiểm tra', null, null],
        exercise: { exercise_id: 'ex-1', title: 'Thêm', concept_id: 'PY-LIST-01', language: 'python' }, ...patch });

    check('C2/C7 chỉ theo dõi bộ đang GENERATING; bộ READY/FAILED thì không', () => {
        const generating = { metadata: { practiceBatch: { status: 'GENERATING', rootTraceId: 'trace_root0001' } } };
        assert.equal(batchToWatch([{ metadata: {} }, generating]), 'trace_root0001');
        for (const done of ['READY', 'FAILED'])
            assert.equal(batchToWatch([{ metadata: { practiceBatch: { status: done, rootTraceId: 'r' } } }]), null);
        assert.equal(batchToWatch([]), null);
    });

    check('C1 tiến độ: tab chỉ hiển thị số bài đã kiểm định, không tự tạo bài', () => {
        assert.deepEqual(batchPollOutcome(status()), { kind: 'progress', completedCount: 3, expectedCount: 5 });
        assert.deepEqual(batchPollOutcome(status({ completedCount: 9, expectedCount: 9 })), { kind: 'progress', completedCount: 5, expectedCount: 5 }, 'tối đa 5 bài');
        assert.ok(BATCH_POLL_MS >= 2000 && BATCH_POLL_MS <= 10000);
    });

    check('C3 backend đã phát hành: mở bộ bài (mọi tab đang theo dõi)', () => {
        assert.deepEqual(batchPollOutcome(status({ state: 'READY', published: true, pathId: 'path-1', completedCount: 5 })), { kind: 'ready', pathId: 'path-1' });
        assert.deepEqual(batchPollOutcome(status({ state: undefined, published: true, pathId: 'path-1' })), { kind: 'ready', pathId: 'path-1' }, 'backend chưa có state');
    });

    check('C4 backend đánh dấu thất bại (vị trí lỗi 2 lần): tải lại đoạn chat, không thử tiếp ở trình duyệt', () => {
        assert.deepEqual(batchPollOutcome(status({ state: 'FAILED', nextIndexFailures: 2, running: false })), { kind: 'failed' });
        assert.equal(batchPollOutcome(status({ nextIndexFailures: 2, running: false })).kind, 'progress', 'chưa FAILED thì chỉ chờ backend');
    });

    check('C9 bài con của bộ không thành thẻ chờ riêng; run thường vẫn có thẻ chờ', () => {
        const messages = [{ sender: 'AI_TUTOR', content: 'x', metadata: { pipeline: { trace_id: 'trace_known' } } }];
        const result = withPendingRuns(messages, [
            { trace_id: 'trace_child', status: 'RUNNING', batch_parent_trace_id: 'trace_root0001' },
            { trace_id: 'trace_single', status: 'RUNNING', batch_parent_trace_id: null },
            { trace_id: 'trace_known', status: 'RUNNING' },
            { trace_id: 'trace_done', status: 'SUCCEEDED' },
        ]);
        assert.deepEqual(result.slice(1).map(m => m.metadata.pipeline.trace_id), ['trace_single']);
        assert.equal(withPendingRuns(messages, undefined), messages);
    });
    console.log(`\n# pass ${passed}`);
} finally {
    await server.close();
}
