// J02 503 (E2E giai đoạn 2): khi chưa chấm được, học viên thấy câu tiếng Việt, không thấy mã nội bộ.
import assert from 'node:assert/strict';
import { createServer } from 'vite';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
try {
    const { submissionErrorText } = await server.ssrLoadModule('/src/features/adaptive-learning/submissionError.ts');
    for (const code of ['GRADER_UNAVAILABLE', 'GRADING_UNAVAILABLE', 'SUBMISSION_IN_PROGRESS', 'AWS_DOCKER_HTTP_503', 'SOMETHING_NEW', '', undefined, null, 42]) {
        const text = submissionErrorText(code);
        assert.ok(text.length > 20, String(code));
        assert.doesNotMatch(text, /[A-Z]{3,}_[A-Z_0-9]+/, 'không lộ mã nội bộ: ' + code);
    }
    assert.match(submissionErrorText('GRADER_UNAVAILABLE'), /Nộp Bài/);
    assert.equal(submissionErrorText('Lỗi khi nộp bài thực hành lên máy chủ chấm'), 'Lỗi khi nộp bài thực hành lên máy chủ chấm');
    console.log('submissionError: ok');
} finally {
    await server.close();
}
