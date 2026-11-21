// Kịch bản reviews/exercise-generation-test-2026-11-21, nhóm C: tự tiếp tục bộ bài ở frontend.
// Chạy: node tests/batchResume.test.mjs (trong thư mục frontend).
import assert from 'node:assert/strict';
import { createServer } from 'vite';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
let passed = 0;
const check = (name, fn) => { fn(); passed += 1; console.log('ok -', name); };
try {
    const { planBatch, batchToResume, shouldResume, isQuietBatchError, MAX_POSITION_FAILURES } =
        await server.ssrLoadModule('/src/features/adaptive-learning/batchResume.ts');
    const { withPendingRuns } = await server.ssrLoadModule('/src/features/adaptive-learning/pendingRuns.ts');
    const status = (patch = {}) => ({ rootTraceId: 'trace_root0001', published: false, pathId: null, expectedCount: 5,
        completedCount: 3, running: false, nextIndex: 4, nextIndexFailures: 0,
        titles: ['Thêm', 'Xóa', 'Kiểm tra', null, null],
        exercise: { exercise_id: 'ex-1', title: 'Thêm', concept_id: 'PY-LIST-01', language: 'python' }, ...patch });

    check('C0 live batch: bài 1 xong, tạo 2..N', () => {
        const plan = planBatch(5, 'Thêm');
        assert.deepEqual(plan.remaining, [2, 3, 4, 5]);
        assert.deepEqual(plan.titles, ['Thêm']);
        assert.equal(plan.done.size, 1);
        assert.equal(planBatch(9, 'x').total, 5, 'tối đa 5 bài');
    });

    check('C1 tải lại khi đã xong 3/5: chỉ tạo tiếp 4 và 5, giữ tiêu đề để tránh trùng', () => {
        const plan = planBatch(5, 'ignored', status());
        assert.deepEqual(plan.remaining, [4, 5]);
        assert.deepEqual(plan.titles, ['Thêm', 'Xóa', 'Kiểm tra']);
        assert.equal(plan.exhausted, false);
    });

    check('C1b vị trí bị thiếu ở giữa cũng được tạo lại', () => {
        const plan = planBatch(5, 'x', status({ titles: ['Thêm', null, 'Kiểm tra', 'Sửa', null], nextIndex: 2 }));
        assert.deepEqual(plan.remaining, [2, 5]);
    });

    check('C3 đủ bài nhưng chưa phát hành: không tạo thêm, chỉ phát hành', () => {
        const plan = planBatch(5, 'x', status({ titles: ['a', 'b', 'c', 'd', 'e'], completedCount: 5, nextIndex: null }));
        assert.deepEqual(plan.remaining, []);
        assert.equal(plan.done.size, plan.total);
    });

    check('C4 vị trí kế tiếp đã lỗi 2 lần: dừng, không thử vô hạn', () => {
        assert.equal(MAX_POSITION_FAILURES, 2);
        const plan = planBatch(5, 'x', status({ nextIndexFailures: 2 }));
        assert.equal(plan.exhausted, true);
        assert.deepEqual(plan.remaining, []);
        assert.ok(plan.done.size < plan.total, 'vòng lặp kết thúc thiếu bài → đánh dấu FAILED');
        assert.equal(planBatch(5, 'x', status({ nextIndexFailures: 1 })).exhausted, false, 'lỗi 1 lần vẫn thử lại');
    });

    check('C2/C7 chỉ tự tiếp tục bộ GENERATING chưa xử lý; bộ READY/FAILED/đã phát hành thì không', () => {
        const generating = { metadata: { practiceBatch: { status: 'GENERATING', rootTraceId: 'trace_root0001' } } };
        assert.equal(batchToResume([{ metadata: {} }, generating], new Set()), 'trace_root0001');
        assert.equal(batchToResume([generating], new Set(['trace_root0001'])), null, 'đang được tiếp tục trong tab này');
        for (const done of ['READY', 'FAILED'])
            assert.equal(batchToResume([{ metadata: { practiceBatch: { status: done, rootTraceId: 'r' } } }], new Set()), null);
        assert.equal(shouldResume(status({ published: true, pathId: 'p' })), false);
        assert.equal(shouldResume(undefined), false);
        assert.equal(shouldResume(status()), true);
    });

    check('C5/C8/C10 lỗi nào giữ nguyên thẻ, lỗi nào làm bộ thất bại', () => {
        assert.equal(isQuietBatchError(true, false, undefined), true, 'C8: đọc trạng thái lỗi trước khi chạy');
        assert.equal(isQuietBatchError(true, true, 409), true, 'C5: tab khác đang chạy bộ này');
        assert.equal(isQuietBatchError(false, true, 409), true, 'C5: cả vòng chạy trực tiếp gặp 409 cũng không đánh dấu thất bại');
        assert.equal(isQuietBatchError(false, true, undefined), false, 'C10: mạng đứt giữa chừng → FAILED');
        assert.equal(isQuietBatchError(false, true, 500), false);
        assert.equal(isQuietBatchError(false, false, 409), false, 'tin nhắn thường gặp 409 vẫn hiện lỗi cho học viên');
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
