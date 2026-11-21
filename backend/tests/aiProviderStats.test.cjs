// Admin reliability table: per provider/model calls, success rate, latency and latest error.
const test=require('node:test');
const assert=require('node:assert/strict');
const {shapeProviderStats}=require('../dist/modules/ai-keys/aiKey.controller');

test('rates, rounded latencies and a one-line latest error',()=>{
    const [row]=shapeProviderStats([{provider:'GROQ',model:'qwen/qwen3.8-27b',total:272,ok:133,p50:4262.4,p90:5870.6,
        last_error:'{\n  "error": {\n    "code": 429 }\n}'}]);
    assert.deepEqual(row,{provider:'GROQ',model:'qwen/qwen3.8-27b',total:272,succeeded:133,successRate:49,
        p50LatencyMs:4262,p90LatencyMs:5871,lastError:'{ "error": { "code": 429 } }'});
});

test('a model that never succeeded shows 0% and no latency, not NaN',()=>{
    const [row]=shapeProviderStats([{provider:'GEMINI',model:'gemini-3.8-flash',total:57,ok:0,p50:null,p90:null,last_error:null}]);
    assert.equal(row.successRate,0);
    assert.equal(row.p50LatencyMs,null);
    assert.equal(row.lastError,null);
    assert.equal(shapeProviderStats([{provider:'X',model:'y',total:0,ok:0}])[0].successRate,0);
});

test('long errors are cut so the table stays readable',()=>{
    const [row]=shapeProviderStats([{provider:'P',model:'m',total:1,ok:0,last_error:'x'.repeat(500)}]);
    assert.equal(row.lastError.length,160);
});
