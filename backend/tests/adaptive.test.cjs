const test=require('node:test');
const assert=require('node:assert/strict');
const {equalOutput,staticConstraints,sandboxInput,executionTimeoutMs}=require('../dist/modules/adaptive/adaptiveRunner');
const {publicReport,publicTutorMessageData,publicCase,internalHeaders,verifyInternal,resumeCheckpoint,reviewCheckpoint,mergeReviewReport,sanitizeLegacy,verifiedTargetConcept}=require('../dist/modules/adaptive/adaptiveEvidence');
const {consumeSse}=require('../dist/modules/adaptive/sse');
const {isRetryableProviderFailure,providerRetryDelay,confirmedLanguageForReply,recoverLearningModeConfirmation,confirmedSessionLanguage,validExerciseBatchContinuation,publicPracticeExercise}=require('../dist/modules/adaptive/adaptive.controller');
const {calculateMasteryUpdate}=require('../dist/modules/adaptive/masteryPolicy');
const spec={language:'python',execution:{mode:'function',entrypoint:'solution',comparator:'json',call_style_required:true},required_constructs:[],forbidden_constructs:[]};

test('batch continuation requires the verified parent, same session, language and concept',()=>{
 const parent={session_id:'session-1',status:'SUCCEEDED',report:{exercise_count:3},artifact:{concept_id:'PY-FLOW-01',language:'python'}};
 assert.equal(validExerciseBatchContinuation(parent,'session-1','PY-FLOW-01','python',2),true);
 assert.equal(validExerciseBatchContinuation(parent,'session-1','PY-FLOW-01','python',3),true);
 assert.equal(validExerciseBatchContinuation(parent,'session-1','PY-FLOW-01','python',4),false);
 assert.equal(validExerciseBatchContinuation(parent,'session-2','PY-FLOW-01','python',2),false);
 assert.equal(validExerciseBatchContinuation(parent,'session-1','PY-FUNC-01','python',2),false);
 assert.equal(validExerciseBatchContinuation(parent,'session-1','PY-FLOW-01','cpp',2),false);
 assert.equal(validExerciseBatchContinuation({...parent,status:'FAILED'},'session-1','PY-FLOW-01','python',2),false);
});

test('grouped practice exposes only visible tests and never the solution',()=>{
 const preview=publicPracticeExercise({exercise_id:'exercise-1',artifact:{title:'Tập hợp',difficulty:'EASY',
  language:'python',problem_statement:'Tìm giao của hai tập',starter_code:'a = set()',
  reference_solution:'print({1})',test_cases:[
   {input:'a b',expected_output:'1',is_hidden:false},
   {input:'secret',expected_output:'secret-answer',is_hidden:true}]}});
 assert.equal(preview.id,'exercise-1');
 assert.equal(preview.testCases.length,1);
 assert.equal(JSON.stringify(preview).includes('secret-answer'),false);
 assert.equal(JSON.stringify(preview).includes('reference_solution'),false);
});

test('learning-mode reply carries the confirmed C++ language into learner context',()=>{
 const pending={type:'LEARNING_MODE_SELECTION',language:'cpp',target_concept_id:'CPP-LOOP-01'};
 assert.equal(confirmedLanguageForReply('Học lý thuyết',pending),'cpp');
 assert.equal(confirmedLanguageForReply('Làm bài thực hành',pending),'cpp');
 assert.equal(confirmedLanguageForReply('Tôi muốn học Python',pending),undefined);
 assert.equal(confirmedLanguageForReply('C++',{type:'ROUTING_CLARIFICATION'}),'cpp');
});

test('an already-broken mode selection can resume after the learner repeats C++',()=>{
 const saved={type:'LEARNING_MODE_SELECTION',language:'cpp',target_concept_id:'CPP-LOOP-01',original_user_request:'Tôi muốn học For'};
 const latest={type:'ROUTING_CLARIFICATION',original_user_request:'Học lý thuyết'};
 const messages=[{sender:'AI_TUTOR',metadata:{pendingConfirmation:saved}},
                 {sender:'USER',content:'Học lý thuyết'},
                 {sender:'AI_TUTOR',metadata:{pendingConfirmation:latest}}];
 assert.deepEqual(recoverLearningModeConfirmation('C++',latest,messages),
                  {...saved,resumed_mode_choice:'học lý thuyết'});
 assert.equal(recoverLearningModeConfirmation('Python',latest,messages),null);
});

test('a theory-only chat remembers its last confirmed language',()=>{
 const messages=[
  {sender:'AI_TUTOR',metadata:{pendingConfirmation:{type:'ROUTING_CLARIFICATION',language:null}}},
  {sender:'AI_TUTOR',metadata:{agentTraces:[{agent:'IntentRouterAgent',status:'SUCCEEDED',
   output:{intent:'EXPLAIN_CONCEPT',language:'python',language_confirmed:true}}]}},
  {sender:'AI_TUTOR',metadata:{agentTraces:[{agent:'IntentRouterAgent',status:'SUCCEEDED',
   output:{intent:'GENERAL_CHAT',language:null,language_confirmed:false}}]}}
 ];
 assert.equal(confirmedSessionLanguage(messages),'python');
 assert.equal(confirmedSessionLanguage([{sender:'USER',content:'Python'}]),undefined);
});

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

test('beginner stdio exercise uses plain output and does not expose the answer',()=>{
 const beginner={...spec,execution:{mode:'stdio',entrypoint:'main',comparator:'text'}};
 const payload=sandboxInput('score = float(input())\nprint("Giỏi")',
  {reference_solution:'SECRET',test_cases:[{input:'8\n',expected_output:'Giỏi',is_hidden:false}]},beginner,0);
 assert.equal(payload.test.input,'8\n');
 assert.equal(payload.test.arguments,undefined);
 assert.ok(!JSON.stringify(payload).includes('SECRET'));
 assert.equal(equalOutput('Giỏi\n','Giỏi',beginner),true);
});

test('typed JSON comparison never ignores case or value type',()=>{
 assert.equal(equalOutput('"ABC"','"abc"',spec),false);
 assert.equal(equalOutput('true','"true"',spec),false);
 assert.equal(equalOutput('{"b":2,"a":1}','{"a":1,"b":2}',spec),true);
});
test('EC2 Docker harness allows queue and sandbox startup time',()=>{
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
 // Syntax failures must reach EC2, which supplies the real source coordinates.
 assert.deepEqual(staticConstraints('not valid code !!!',js),[]);
});
test('student reports hide reference solutions and hidden outputs',()=>{
 const report=publicReport({exercise:{title:'test',reference_solution:'SECRET_CODE',test_cases:[{is_hidden:true,input:'SECRET_INPUT',expected_output:'SECRET_OUTPUT'}]},
 agent_traces:[{agent:'SandboxValidator',output:{passed:true,test_results:[{is_hidden:true,input:'SECRET_INPUT',actual:'SECRET_OUTPUT',stderr:'SECRET_OUTPUT',passed:true}]}}]});
 assert.ok(!JSON.stringify(report).includes('SECRET'));
 assert.deepEqual(publicCase({is_hidden:true,passed:true}).passed,true);
});
test('retry completion replaces the existing tutor message without leaking hidden cases',()=>{
 const report={trace_id:'trace-retry',schema_version:'4.0',status:'AWAITING_CONFIRMATION',intent:'REQUEST_ADAPTIVE_EXERCISE',
  reply:'Bạn xác nhận chủ đề C++?',pending_confirmation:{type:'ROUTING_CLARIFICATION',original_user_request:'iterator C++'},
  suggested_options:['Thuật toán STL và iterator'],exercise:null,agent_traces:[{agent:'IntentRouterAgent',status:'SUCCEEDED'}]};
 const update=publicTutorMessageData(report,{oldField:'preserved',pipeline:{status:'WAITING_PROVIDER'}});
 assert.equal(update.content,'Bạn xác nhận chủ đề C++?');
 assert.equal(update.metadata.pipeline.status,'AWAITING_CONFIRMATION');
 assert.equal(update.metadata.pendingConfirmation.original_user_request,'iterator C++');
 assert.deepEqual(update.metadata.suggestedOptions,['Thuật toán STL và iterator']);
 assert.equal(update.metadata.oldField,'preserved');
});
test('multi-exercise reply stays a single pending batch card without next-exercise prompt',()=>{
 const update=publicTutorMessageData({trace_id:'trace-batch',status:'SUCCEEDED',intent:'REQUEST_ADAPTIVE_EXERCISE',
  exercise_count:4,exercise:{title:'Bài 1',exercise_id:'exercise-1',test_cases:[]},
  suggested_options:['Tạo bài tiếp theo'],agent_traces:[]});
 assert.equal(update.metadata.exercise,null);
 assert.deepEqual(update.metadata.suggestedOptions,[]);
 assert.equal(update.metadata.practiceBatch.expectedCount,4);
 assert.match(update.content,/1\/4/);
});
test('student reports show safe curriculum-routing guidance without leaking internals',()=>{
 const unresolved=publicReport({error:{code:'PIPELINE_FAILED',message:'Chưa xác định được chủ đề cần học trong đồ thị tri thức'}});
 assert.equal(unresolved.error.message,'Chưa xác định được chủ đề cần học trong đồ thị tri thức');
 const infrastructure=publicReport({error:{code:'PIPELINE_FAILED',message:'postgres://private-host:5432 failed'}});
 assert.equal(infrastructure.error.message,'AI Tutor chưa hoàn thành yêu cầu này. Bạn có thể xem bước lỗi và thử lại sau.');
 assert.ok(!JSON.stringify(infrastructure).includes('private-host'));
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
    assert.equal(isRetryableProviderFailure('LLM_BUDGET_EXCEEDED'),true);
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
test('manual review checkpoint preserves outputs without replacing full stored evidence',()=>{
 const previous={trace_id:'trace-review',intent:'EXPLAIN_CONCEPT',agent_traces:[
  {id:'router-1',sequence:1,agent:'IntentRouterAgent',status:'SUCCEEDED',input:{private:'context'},output:{intent:'EXPLAIN_CONCEPT'}},
 ]};
 const checkpoint=reviewCheckpoint(previous);
 assert.equal(checkpoint.agent_traces[0].output.intent,'EXPLAIN_CONCEPT');
 assert.equal(checkpoint.agent_traces[0].input,undefined);
 const next={trace_id:'trace-review',status:'AWAITING_AGENT_APPROVAL',agent_traces:[
  checkpoint.agent_traces[0],
  {id:'planner-1',sequence:2,agent:'AdaptiveExercisePlanner',status:'SUCCEEDED',output:{target_concept:'PY-FUNC-01'}},
 ]};
 const merged=mergeReviewReport(previous,next);
 assert.deepEqual(merged.agent_traces.map(record=>record.id),['router-1','planner-1']);
 assert.deepEqual(merged.agent_traces[0].input,{private:'context'});
});

test('new candidate cannot reuse sandbox receipts from the previous draft',()=>{
 const success=(agent,output)=>({agent,status:'SUCCEEDED',output});
 const checkpoint=resumeCheckpoint({exercise_count:4,agent_traces:[
  success('AdaptiveExercisePlanner',{target_concept:'PY-SET-01'}),
  success('KnowledgeRetrievalService',{sources:[]}),
  success('ExerciseGeneratorAgent',{title:'old'}),
  success('SchemaValidator',{passed:true}),success('ConstraintValidator',{passed:true}),
  success('SandboxValidator',{passed:true}),
  success('ExerciseGeneratorAgent',{title:'new'}),
  success('SchemaValidator',{passed:true}),success('ConstraintValidator',{passed:true}),
  {agent:'SandboxValidator',status:'FAILED',error:{code:'SANDBOX_BACKEND_TIMEOUT'}}
 ]});
 assert.equal(checkpoint.exercise_count,4);
 assert.equal(checkpoint.agent_traces.find(r=>r.agent==='ExerciseGeneratorAgent').output.title,'new');
 assert.equal(checkpoint.agent_traces.some(r=>r.agent==='SandboxValidator'),false);
 assert.equal(checkpoint.agent_traces.some(r=>r.agent==='KnowledgeRetrievalService'),true);
 assert.equal(isRetryableProviderFailure('SANDBOX_BACKEND_TIMEOUT'),true);
 assert.equal(isRetryableProviderFailure('SANDBOX_AUTH_FAILED'),false);
});
test('retry checkpoint carries the last exercise rejection and skips retrying that same draft',()=>{
 const success=(agent,output,sequence)=>({agent,status:'SUCCEEDED',output,sequence});
 const rejection={is_approved:false,feedback_target:'EXERCISE',exercise_feedback:'Trùng bài trước'};
 const base=[success('AdaptiveExercisePlanner',{target_concept:'PY-FLOW-03'},1),
  success('ExerciseGeneratorAgent',{title:'old'},2),success('SchemaValidator',{passed:true},3),
  success('ConstraintValidator',{passed:true},4),success('SandboxValidator',{passed:true},5),
  {agent:'CriticEvaluatorAgent',status:'REJECTED',output:rejection,sequence:6}];
 const rejected=resumeCheckpoint({agent_traces:base});
 assert.equal(rejected.repair_feedback.exercise_feedback,'Trùng bài trước');
 assert.equal(rejected.rejected_current_candidate,true);
 const fresh=resumeCheckpoint({agent_traces:[...base,success('ExerciseGeneratorAgent',{title:'new'},7),
  success('SchemaValidator',{passed:true},8),success('ConstraintValidator',{passed:true},9)]});
 assert.equal(fresh.rejected_current_candidate,false);
 assert.equal(fresh.agent_traces.find(r=>r.agent==='ExerciseGeneratorAgent').output.title,'new');
});
test('retry reuses the latest planner-verified graph concept',()=>{
 const report={agent_traces:[
  {agent:'IntentRouterAgent',status:'SUCCEEDED',output:{topic:'array'}},
  {agent:'AdaptiveExercisePlanner',status:'SUCCEEDED',output:{target_concept:'PY-LIST-01'}},
  {agent:'AdaptiveExercisePlanner',status:'FAILED',output:{target_concept:'array'}},
  {agent:'AdaptiveExercisePlanner',status:'SUCCEEDED',output:{target_concept:'PY-LIST-02'}},
 ]};
 assert.equal(verifiedTargetConcept(report),'PY-LIST-02');
 assert.equal(verifiedTargetConcept({agent_traces:[{agent:'AdaptiveExercisePlanner',status:'SUCCEEDED',output:{target_concept:'array'}}]}),undefined);
});
test('SSE parser keeps split Unicode, trailing frame, and propagates server errors',async()=>{
 const bytes=new TextEncoder().encode('data: {"text":"Tiếng Việt"}\n\ndata: {"type":"complete"}');
 const stream=new ReadableStream({start(c){for(const b of bytes)c.enqueue(new Uint8Array([b]));c.close();}});
 const got=[];await consumeSse(stream,async e=>got.push(e));
 assert.equal(got[0].text,'Tiếng Việt');assert.equal(got[1].type,'complete');
 const broken=new ReadableStream({start(c){c.enqueue(new TextEncoder().encode('data: {"type":"error"}\n\n'));c.close();}});
 await assert.rejects(()=>consumeSse(broken,async()=>{throw Error('actual-error');}),/actual-error/);
});
