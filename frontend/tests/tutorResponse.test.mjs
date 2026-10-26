import assert from 'node:assert/strict';
import { createServer } from 'vite';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
    const { AITutorChat } = await server.ssrLoadModule('/src/features/ai-tutor/components/AITutorChat.tsx');
    const user = { sender: 'USER', content: 'Tạo 4 bài Set' };
    const pending = { sender: 'AI_TUTOR', content: 'Provider tạm thời chưa trả kết quả', metadata: {
        pipeline: { trace_id: 'trace_ui_regression', status: 'WAITING_PROVIDER' },
        agentTraces: [{ agent: 'IntentRouterAgent', status: 'FAILED' }]
    } };
    const props = { sessionId: 'qa', onSendMessage() {}, onConfirmPath() {}, loading: true };
    for (const messages of [[user], [user, pending], [user, { ...pending, metadata: {
        ...pending.metadata, practiceBatch: { status: 'GENERATING', expectedCount: 4, completedCount: 2, rootTraceId: 'trace_ui_regression' }
    } }]]) {
        const html = renderToStaticMarkup(React.createElement(AITutorChat, { ...props, messages }));
        assert.equal((html.match(/data-testid="tutor-processing"/g) || []).length, 1, 'Exactly one response status frame');
        assert.ok(!html.includes('Tiến trình các agent'), 'No intermediate report during processing');
        assert.ok(!html.includes('Provider tạm thời chưa trả kết quả'), 'No duplicate pending message');
        assert.ok(!html.includes('Mở Code Editor'), 'No partial exercise action');
    }
    const failed = renderToStaticMarkup(React.createElement(AITutorChat, { ...props, loading: false, messages: [user,
        { ...pending, content: 'Không hoàn tất', metadata: { ...pending.metadata, pipeline: { ...pending.metadata.pipeline, status: 'FAILED' } } }
    ] }));
    assert.ok(!failed.includes('data-testid="tutor-processing"'));
    assert.ok(failed.includes('Không hoàn tất'));
    console.log('PASS: initial, retry, batch progress each use one frame; terminal failure stops loading.');
} finally { await server.close(); }
