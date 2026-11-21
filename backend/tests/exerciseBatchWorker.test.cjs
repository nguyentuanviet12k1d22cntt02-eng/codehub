// Scheduling rules of the backend batch worker: which action it takes for a batch.
const test=require('node:test');
const assert=require('node:assert/strict');
const {nextBatchAction,batchPositionPrompt,batchStatusView,summarizeExerciseBatch,MAX_POSITION_FAILURES,BATCH_CONTINUE_WINDOW_MS}=require('../dist/modules/adaptive/exerciseBatch');
const {PENDING_BATCH_ROOTS_SQL}=require('../dist/modules/adaptive/adaptiveRepository');

const now=Date.parse('2026-11-21T12:00:00Z');
const gate=[{agent:'PublicationGate',status:'SUCCEEDED',output:{approved:true}}];
const at=minutesAgo=>new Date(now-minutesAgo*60000).toISOString();
const parent=(patch={})=>({trace_id:'trace_root0001',session_id:'s1',user_id:'u1',status:'SUCCEEDED',exercise_id:'e1',path_id:null,
    created_at:at(5),request:{},report:{exercise_count:4,agent_traces:gate},
    artifact:{qc_status:'VERIFIED',concept_id:'PY-LIST-01',concept_name:'List',language:'python',title:'Thêm'},...patch});
const child=(index,status,patch={})=>({trace_id:`trace_child${index}${status}${patch.n||''}`,status,exercise_id:status==='SUCCEEDED'?`e${index}`:null,
    created_at:at(4),updated_at:at(patch.updatedMinutesAgo??1),request:{batch_parent_trace_id:'trace_root0001',batch_index:index},
    report:{agent_traces:status==='SUCCEEDED'?gate:[]},
    artifact:status==='SUCCEEDED'?{qc_status:'VERIFIED',concept_id:'PY-LIST-01',language:'python',title:`Bài ${index}`}:null});
const action=(runs,p=parent(),card='GENERATING')=>nextBatchAction(p,summarizeExerciseBatch(p,runs,now),card,now);

test('first exercise verified: the worker generates position 2, then the next missing position in order',()=>{
    assert.deepEqual(action([]),{kind:'generate',index:2});
    assert.deepEqual(action([child(2,'SUCCEEDED')]),{kind:'generate',index:3});
    // A gap is filled before later positions.
    assert.deepEqual(action([child(3,'SUCCEEDED')]),{kind:'generate',index:2});
});

test('a position generating or waiting for a provider retry blocks the batch (no second run for it)',()=>{
    assert.deepEqual(action([child(2,'RUNNING')]),{kind:'wait'});
    assert.deepEqual(action([child(2,'WAITING_PROVIDER')]),{kind:'wait'});
    // A RUNNING row silent for 10+ minutes is an orphan: no longer blocks (the sweeper closes it).
    assert.deepEqual(action([child(2,'RUNNING',{updatedMinutesAgo:11})]),{kind:'generate',index:2});
});

test('one failure retries the position; MAX_POSITION_FAILURES failures stop the batch',()=>{
    assert.equal(MAX_POSITION_FAILURES,2);
    assert.deepEqual(action([child(2,'FAILED')]),{kind:'generate',index:2});
    assert.deepEqual(action([child(2,'FAILED'),child(2,'FAILED',{n:'b'})]),{kind:'fail',reason:'POSITION_FAILED'});
    // Failures at a position that later succeeded do not count against the next one.
    assert.deepEqual(action([child(2,'FAILED'),child(2,'FAILED',{n:'b'}),child(2,'SUCCEEDED')]),{kind:'generate',index:3});
});

test('every position verified: publish; published or no longer GENERATING: nothing to do',()=>{
    const all=[child(2,'SUCCEEDED'),child(3,'SUCCEEDED'),child(4,'SUCCEEDED')];
    assert.deepEqual(action(all),{kind:'publish'});
    assert.deepEqual(action(all,parent({path_id:'p1'})),{kind:'none'});
    for(const card of ['READY','FAILED',undefined]) assert.deepEqual(nextBatchAction(parent(),summarizeExerciseBatch(parent(),[],now),card,now),{kind:'none'});
});

test('a batch older than the continue window is closed, not revived; a complete one is still published',()=>{
    const old=parent({created_at:new Date(now-BATCH_CONTINUE_WINDOW_MS-60000).toISOString()});
    assert.deepEqual(action([],old),{kind:'fail',reason:'EXPIRED'});
    assert.deepEqual(action([child(2,'SUCCEEDED'),child(3,'SUCCEEDED'),child(4,'SUCCEEDED')],old),{kind:'publish'});
    assert.deepEqual(action([child(2,'RUNNING')],old),{kind:'wait'},'a run in flight finishes first');
});

test('the prompt for the next position names the concept, language and titles already made',()=>{
    const p=parent();
    const prompt=batchPositionPrompt(p,summarizeExerciseBatch(p,[child(2,'SUCCEEDED')],now));
    assert.match(prompt,/về List bằng python/);
    assert.match(prompt,/Thêm; Bài 2/);
});

test('status view tells the browser the batch state (generating, failed, ready)',()=>{
    const p=parent();
    const summary=summarizeExerciseBatch(p,[],now);
    assert.equal(batchStatusView(p,summary,'GENERATING').state,'GENERATING');
    assert.equal(batchStatusView(p,summary,'FAILED').state,'FAILED');
    assert.equal(batchStatusView(parent({path_id:'p1'}),summary,'READY').state,'READY');
    assert.equal(batchStatusView(p,summary,'GENERATING').maxPositionFailures,MAX_POSITION_FAILURES);
});

test('the worker only picks unpublished verified roots (not children) whose card is GENERATING',()=>{
    assert.match(PENDING_BATCH_ROOTS_SQL,/r\.status='SUCCEEDED' AND r\.path_id IS NULL/);
    assert.match(PENDING_BATCH_ROOTS_SQL,/NOT \(r\.request \? 'batch_parent_trace_id'\)/);
    assert.match(PENDING_BATCH_ROOTS_SQL,/IN \('2','3','4','5'\)/);
    assert.match(PENDING_BATCH_ROOTS_SQL,/'practiceBatch'->>'status'='GENERATING'/);
    assert.match(PENDING_BATCH_ROOTS_SQL,/LIMIT \$1/);
});
