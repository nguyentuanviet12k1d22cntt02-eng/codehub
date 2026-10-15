// Harmless direct diagnostic for the production AI-to-backend sandbox hop.
require('dotenv').config({path: require('path').join(__dirname, '..', '.env'), quiet: true});
const {randomUUID} = require('crypto');
const {internalHeaders} = require('../dist/modules/adaptive/adaptiveEvidence');

const base = (process.env.PROBE_AI_URL || 'https://codehub-ai.onrender.com').replace(/\/$/, '');
const body = JSON.stringify({
    user_id: '00000000-0000-4000-8000-000000000001',
    session_id: randomUUID(), trace_id: 'trace_sandbox_probe_' + randomUUID().replace(/-/g, ''),
    language: 'python', target_concept_id: 'PY-DICT-01',
    messages: [{sender: 'USER', content: 'Vẫn tạo bài Python về dictionary cho tôi'}],
    learner_context: {pending_confirmation: {
        type: 'PREREQUISITE_OVERRIDE', target_concept_id: 'PY-DICT-01',
        target_concept_name: 'Dictionary', language: 'python'
    }}
});

(async () => {
    const response = await fetch(base + '/pal-net/adaptive-tutor-agent', {
        method: 'POST', headers: internalHeaders(body), body, signal: AbortSignal.timeout(150000)
    });
    const result = await response.json();
    const report = result.data || result;
    console.log(JSON.stringify({http: response.status, status: report.status,
        error: report.error,
        stages: report.agent_traces?.map(item => ({agent: item.agent, method: item.method,
            status: item.status, duration_ms: item.duration_ms, error: item.error}))}, null, 2));
    if (!response.ok || report.status !== 'SUCCEEDED') process.exitCode = 1;
})().catch(error => {console.error(error.name + ': ' + error.message); process.exitCode = 1;});
