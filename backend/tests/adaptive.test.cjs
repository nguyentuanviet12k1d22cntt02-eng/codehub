const test=require('node:test');
const assert=require('node:assert/strict');
const {equalOutput,staticConstraints,sandboxInput,executionTimeoutMs}=require('../dist/modules/adaptive/adaptiveRunner');
const {publicReport,publicCase,internalHeaders,verifyInternal,resumeCheckpoint,sanitizeLegacy}=require('../dist/modules/adaptive/adaptiveEvidence');
const {consumeSse}=require('../dist/modules/adaptive/sse');
const {isRetryableProviderFailure,providerRetryDelay}=require('../dist/modules/adaptive/adaptive.controller');
const {calculateMasteryUpdate}=require('../dist/modules/adaptive/masteryPolicy');
const spec={language:'python',execution:{mode:'function',entrypoint:'solution',comparator:'json',call_style_required:true},required_constructs:[],forbidden_constructs:[]};

test('mastery policy uses verified outcomes in both directions and downweights repeats',()=>{
 const pass=calculateMasteryUpdate({previousMastery:.4,priorAttempts:0,passedCases:5,totalCases:5,difficulty:'MEDIUM',repeatedExercise:false});
 const fail=calculateMasteryUpdate({previousMastery:.7,priorAttempts:3,passedCases:0,totalCases:5,difficulty:'MEDIUM',repeatedExercise:false});
 const repeated=calculateMasteryUpdate({previousMastery:.4,priorAttempts:0,passedCases:5,totalCases:5,difficulty:'MEDIUM',repeatedExercise:true});
 assert.ok(pass.nextMastery>.4);
 assert.ok(fail.nextMastery<.7);
 assert.ok(repeated.delta<pass.delta);
 assert.ok(pass.confidenceAfter>pass.confidenceBefore);
});

test('mastery confidence follows accumulated evidence weight instead of raw retry count',()=>{
 const update=calculateMasteryUpdate({
  previousMastery:.45,priorAttempts:4,priorEvidenceWeight:1.05,
  passedCases:3,totalCases:5,difficulty:'HARD',repeatedExercise:true
 });
 const expectedBefore=1-Math.exp(-1.05/3);
 const expectedWeight=1.2*.35;
 assert.ok(Math.abs(update.confidenceBefore-expectedBefore)<1e-10);
 assert.ok(Math.abs(update.observationWeight-expectedWeight)<1e-10);
 assert.equal(update.observedScore,.6);
});

test('untrusted execution receives inputs but never the expected answer',()=>{
 const payload=sandboxInput('def solution(n): return n',{reference_solution:'SECRET_SOLUTION',test_cases:[{arguments:[1],call_style:'spread',expected_output:'SECRET_ANSWER',is_hidden:true}]},spec,0);
 assert.deepEqual(payload.test.arguments,[1]);
 assert.ok(!JSON.stringify(payload).includes('SECRET'));
});

test('function runner payload makes list-as-one-argument explicit',()=>{
 const payload=sandboxInput('def solution(lines): return len(lines)',{reference_solution:'SECRET',test_cases:[{arguments:[['a','b']],call_style:'single',expected_output:'2',is_hidden:false}]},spec,0);
 assert.deepEqual(payload.test.arguments,[['a','b']]);
 assert.equal(payload.test.call_style,'single');
 assert.equal(payload.test.input,undefined);
});

test('typed JSON comparison never ignores case or value type',()=>{
 assert.equal(equalOutput('"ABC"','"abc"',spec),false);
 assert.equal(equalOutput('true','"true"',spec),false);
 assert.equal(equalOutput('{"b":2,"a":1}','{"a":1,"b":2}',spec),true);
});
test('Docker harness allows startup time without dropping resource limits',()=>{
 assert.equal(executionTimeoutMs('python'),8000);
 assert.equal(executionTimeoutMs('javascript'),8000);
 assert.equal(executionTimeoutMs('cpp'),12000);
});
test('SQL bag comparison preserves duplicates',()=>{
 const sql={...spec,language:'sql',execution:{mode:'sql',comparator:'json',ordered:false}};
 assert.equal(equalOutput('[[2],[1]]','[[1],[2]]',sql),true);
 assert.equal(equalOutput('[[1],[1]]','[[1]]',sql),false);
});
test('JS AST ignores forbidden words in strings, rejects actual loops',()=>{
 const js={...spec,language:'javascript',forbidden_constructs:['for']};
 assert.deepEqual(staticConstraints('function solution(){return "for";}',js),[]);
 assert.ok(staticConstraints('function solution(){for(let i=0;i<2;i++){} return 2;}',js).length);
 assert.ok(staticConstraints('not valid code !!!',js).length);
});
test('student reports hide reference solutions and hidden outputs',()=>{
 const report=publicReport({exercise:{title:'test',reference_solution:'SECRET_CODE',test_cases:[{is_hidden:true,input:'SECRET_INPUT',expected_output:'SECRET_OUTPUT'}]},
 agent_traces:[{agent:'SandboxValidator',output:{passed:true,test_results:[{is_hidden:true,input:'SECRET_INPUT',actual:'SECRET_OUTPUT',stderr:'SECRET_OUTPUT',passed:true}]}}]});
 assert.ok(!JSON.stringify(report).includes('SECRET'));
 assert.deepEqual(publicCase({is_hidden:true,passed:true}).passed,true);
});
test('reloaded history preserves dates and hidden execution receipts without answers',()=>{
 const value=sanitizeLegacy({date:new Date('2026-09-18T00:00:00Z'),records:[{is_hidden:true,executed:true,passed:true,actual:'SECRET',expected:'SECRET'}]});
 assert.equal(value.date,'2026-09-18T00:00:00.000Z');
 assert.equal(value.records.length,1);assert.equal(value.records[0].passed,true);
 assert.ok(!JSON.stringify(value).includes('SECRET'));
});

test('internal signature covers exact bytes and rejects stale timestamp',()=>{
 process.env.ADAPTIVE_INTERNAL_SECRET='unit-test-only';
 const body='{"request":"hello"}',headers=internalHeaders(body);
 assert.equal(verifyInternal(Buffer.from(body),headers['X-Adaptive-Time'],headers['X-Adaptive-Signature']),true);
 assert.equal(verifyInternal(Buffer.from(body+' '),headers['X-Adaptive-Time'],headers['X-Adaptive-Signature']),false);
 assert.equal(verifyInternal(Buffer.from(body),'1',headers['X-Adaptive-Signature']),false);
});
test('provider cooldown remains retryable and honors a recorded Retry-After',()=>{
    assert.equal(isRetryableProviderFailure('PROVIDER_COOLDOWN'),true);
    assert.equal(isRetryableProviderFailure('STAGE_BUDGET_EXHAUSTED'),true);
    assert.equal(isRetryableProviderFailure('PROVIDER_FULL_POOL_OUTAGE'),true);
    assert.equal(isRetryableProviderFailure('RUN_DEADLINE_EXCEEDED'),true);
 assert.equal(providerRetryDelay({details:{retry_after_seconds:75}},0),75);
 assert.equal(providerRetryDelay({},1),60);
});
test('retry checkpoint keeps only verified real outputs below the transport limit',()=>{
 const draft={title:'real draft',reference_solution:'def solution(n): return n',test_cases:[{arguments:[1],call_style:'spread',expected_output:'1',is_hidden:false}]};
 const report={trace_id:'trace-real',intent:'REQUEST_ADAPTIVE_EXERCISE',agent_traces:[
  {agent:'ExerciseGeneratorAgent',status:'SUCCEEDED',input:{large:'x'.repeat(200000)},model_calls:[{output:'x'.repeat(200000)}],output:{title:'old draft'}},
  {agent:'AdaptiveExercisePlanner',status:'SUCCEEDED',input:{large:'x'.repeat(200000)},model_calls:[{output:'x'.repeat(200000)}],output:{target_concept:'PY-LOOP-01'}},
  {agent:'ExerciseGeneratorAgent',status:'SUCCEEDED',input:{large:'x'.repeat(200000)},model_calls:[{output:'x'.repeat(200000)}],output:draft},
  {agent:'SchemaValidator',status:'SUCCEEDED',input:{large:'x'.repeat(200000)},model_calls:[{output:'x'.repeat(200000)}],output:{passed:true}},
  {agent:'ConstraintValidator',status:'SUCCEEDED',input:{large:'x'.repeat(200000)},model_calls:[{output:'x'.repeat(200000)}],output:{passed:true}},
  {agent:'SandboxValidator',status:'SUCCEEDED',input:{large:'x'.repeat(200000)},model_calls:[{output:'x'.repeat(200000)}],output:{passed:true,test_results:[{passed:true}]}},
  {agent:'ExplanationTutorAgent',status:'SUCCEEDED',input:{large:'x'.repeat(200000)},model_calls:[{output:'x'.repeat(200000)}],output:{reply:'A real theory response with enough content.',source_ids:[]}},
  {agent:'CriticEvaluatorAgent',status:'FAILED',input:{large:'x'.repeat(200000)},model_calls:[{output:'x'.repeat(200000)}],error:{code:'RUN_DEADLINE_EXCEEDED'}},
 ]};
 const checkpoint=resumeCheckpoint(report),body=JSON.stringify({user_id:'u',trace_id:'trace-real',messages:[{sender:'USER',content:'for'}],resume_report:checkpoint});
 assert.ok(Buffer.byteLength(body,'utf8')<150000);
 assert.equal(checkpoint.agent_traces.find(r=>r.agent==='ExerciseGeneratorAgent').output,draft);
 assert.equal(checkpoint.agent_traces.some(r=>r.agent==='CriticEvaluatorAgent'),false);
 assert.ok(!JSON.stringify(checkpoint).includes('x'.repeat(100)));
});
test('SSE parser keeps split Unicode, trailing frame, and propagates server errors',async()=>{
 const bytes=new TextEncoder().encode('data: {"text":"Tiếng Việt"}\n\ndata: {"type":"complete"}');
 const stream=new ReadableStream({start(c){for(const b of bytes)c.enqueue(new Uint8Array([b]));c.close();}});
 const got=[];await consumeSse(stream,async e=>got.push(e));
 assert.equal(got[0].text,'Tiếng Việt');assert.equal(got[1].type,'complete');
 const broken=new ReadableStream({start(c){c.enqueue(new TextEncoder().encode('data: {"type":"error"}\n\n'));c.close();}});
 await assert.rejects(()=>consumeSse(broken,async()=>{throw Error('actual-error');}),/actual-error/);
});
