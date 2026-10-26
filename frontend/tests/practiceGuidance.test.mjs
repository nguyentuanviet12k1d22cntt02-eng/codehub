import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createServer } from 'vite';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { isPracticeGuidance, matchingPracticeGuidance } from '../src/features/adaptive-learning/components/practiceGuidanceResult.ts';

const guidance = {source:'EVIDENCE',tone:'thinking',title:'Chưa có kết quả đầu ra',
    reason:'Test công khai #1 cần đầu ra nhưng mã vừa nộp chưa tạo ra kết quả.', hint:'Kiểm tra lệnh xuất kết quả có được thực thi không.'};

test('accept both honest sources and reject empty feedback or another submission', () => {
    assert.ok(isPracticeGuidance(guidance));
    assert.ok(isPracticeGuidance({...guidance,source:'AI'}));
    assert.ok(!isPracticeGuidance({...guidance,reason:' '}));
    assert.equal(matchingPracticeGuidance({submissionId:'new',guidance},'new',2,2),guidance);
    assert.equal(matchingPracticeGuidance({submissionId:'old',guidance},'new',2,2),null);
    assert.equal(matchingPracticeGuidance({submissionId:'old',guidance},'old',1,2),null);
});

test('evidence remains readable while AI is pending, failed or unavailable', async () => {
    const server = await createServer({server:{middlewareMode:true},appType:'custom',optimizeDeps:{noDiscovery:true,include:[]}});
    try {
        const { PracticeGuidanceCard } = await server.ssrLoadModule('/src/features/adaptive-learning/components/PracticeGuidanceCard.tsx');
        for (const extra of [{analyzing:true},{analysisError:true},{error:'GRADER_UNAVAILABLE'}]) {
            const html = renderToStaticMarkup(React.createElement(PracticeGuidanceCard, {
                guidance,submitting:false,analyzing:false,analysisError:false,exerciseTitle:'QA',...extra,
            }));
            assert.ok(html.includes(guidance.reason));
            assert.ok(html.includes(guidance.hint));
            assert.ok(html.includes('Từ kết quả chấm'));
            assert.ok(!html.includes('Chưa thể phân tích bài làm'));
            assert.ok(html.includes('aria-busy="false"'));
            if (extra.analyzing) assert.ok(html.includes('Đang phân tích thêm bằng AI'));
        }
        const success = renderToStaticMarkup(React.createElement(PracticeGuidanceCard, {
            guidance:{...guidance,source:'AI',tone:'success',title:'Làm tốt!'},submitting:false,analyzing:false,analysisError:false,exerciseTitle:'QA',
        }));
        assert.ok(success.includes('Nhận xét AI'));
        assert.ok(success.includes('practice-guide--success'));
        const idle = renderToStaticMarkup(React.createElement(PracticeGuidanceCard, {
            submitting:false,analyzing:false,analysisError:false,exerciseTitle:'QA',
        }));
        assert.ok(idle.includes('data-state="minimized"'));
        assert.ok(idle.includes('aria-label="Mở gợi ý theo bài làm"'));
        assert.ok(!idle.includes('<section'));
        const stale = renderToStaticMarkup(React.createElement(PracticeGuidanceCard, {
            guidance,stale:true,submitting:false,analyzing:false,analysisError:false,exerciseTitle:'QA',
        }));
        assert.ok(stale.includes(guidance.hint));
        assert.ok(stale.includes('Gợi ý này dựa trên lần nộp trước'));
        assert.ok(stale.includes('aria-label="Thu gọn gợi ý"'));
        assert.ok(stale.includes('aria-label="Đóng gợi ý"'));
        assert.ok(!stale.includes('aria-modal="true"'));
    } finally { await server.close(); }
});
