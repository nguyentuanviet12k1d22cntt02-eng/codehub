// Test plan reviews/exercise-generation-test-2026-11-21, group B: practice batch rules.
// B1/B2 (validExerciseBatchContinuation) and the summary basics live in adaptive.test.cjs.
const test=require('node:test');
const assert=require('node:assert/strict');
const {summarizeExerciseBatch,batchPositionTaken,batchReadyForPublish,batchProgressMessage,batchStatusView,
    isBatchRoot,SessionLock,ORPHAN_RUN_MS}=require('../dist/modules/adaptive/exerciseBatch');

const NOW=Date.parse('2026-11-21T03:00:00Z');
const GATE={agent_traces:[{agent:'PublicationGate',status:'SUCCEEDED',output:{approved:true}}]};
const ROOT='trace_root0001';
const at=minutesAgo=>new Date(NOW-minutesAgo*60000).toISOString();
const artifact=(title)=>({qc_status:'VERIFIED',title,concept_id:'PY-LIST-01',language:'python',reference_solution:'secret'});
const parent=(extra={})=>({trace_id:ROOT,status:'SUCCEEDED',exercise_id:'ex-1',session_id:'s1',created_at:at(60),updated_at:at(60),
    request:{},report:{exercise_count:5,...GATE},artifact:{...artifact('Bai 1'),concept_name:'List'},...extra});
const child=(trace,index,status,minutesAgo,extra={})=>({trace_id:trace,status,exercise_id:'ex-'+trace,
    created_at:at(minutesAgo),updated_at:at(minutesAgo),request:{batch_parent_trace_id:ROOT,batch_index:index},
    artifact:status==='SUCCEEDED'?artifact('Bai '+index):null,report:status==='SUCCEEDED'?GATE:{},...extra});
const full=()=>[parent(),child('c2',2,'SUCCEEDED',50),child('c3',3,'SUCCEEDED',40),child('c4',4,'SUCCEEDED',30),child('c5',5,'SUCCEEDED',20)];

test('B3 a verified position cannot be generated again',()=>{
    const s=summarizeExerciseBatch(parent(),[parent(),child('c2',2,'SUCCEEDED',50)],NOW);
    assert.equal(batchPositionTaken(s,2),true);
    assert.equal(batchPositionTaken(s,3),false);
});

test('B4 nothing new starts while a position is still generating',()=>{
    const s=summarizeExerciseBatch(parent(),[parent(),child('c2',2,'RUNNING',2)],NOW);
    assert.equal(s.running,true);
    assert.equal(batchPositionTaken(s,2),true);
    assert.equal(batchPositionTaken(s,3),true,'two tabs must not run positions in parallel');
});

test('B5 a run orphaned by a backend restart stops blocking after 10 minutes',()=>{
    assert.equal(ORPHAN_RUN_MS,10*60*1000);
    const s=summarizeExerciseBatch(parent(),[parent(),child('c2',2,'RUNNING',11)],NOW);
    assert.equal(s.running,false);
    assert.equal(batchPositionTaken(s,2),false);
    assert.equal(s.nextIndexFailures,0,'an orphan is not counted as a failed attempt');
    const waiting=summarizeExerciseBatch(parent(),[parent(),child('c2',2,'WAITING_PROVIDER',3)],NOW);
    assert.equal(waiting.running,true,'a provider retry in progress is in flight');
});

test('B6 one turn per session: second request is refused and cannot release the first',()=>{
    const lock=new SessionLock();
    const first=lock.tryAcquire('s1');
    const second=lock.tryAcquire('s1');
    assert.equal(first,true);
    assert.equal(second,false);
    lock.release('s1',second);
    assert.equal(lock.isHeld('s1'),true,'a rejected request must not unlock the running turn');
    assert.equal(lock.tryAcquire('s2'),true,'other sessions are independent');
    lock.release('s1',first);
    assert.equal(lock.tryAcquire('s1'),true);
});

test('B7/B8 progress card is updated only while the batch is generating',()=>{
    const s=summarizeExerciseBatch(parent(),[parent(),child('c2',2,'SUCCEEDED',50),child('c3',3,'SUCCEEDED',40)],NOW);
    const meta={step:'PRACTICE_BATCH',practiceBatch:{status:'GENERATING',expectedCount:5,completedCount:1,rootTraceId:ROOT}};
    const update=batchProgressMessage(meta,s);
    assert.equal(update.metadata.practiceBatch.completedCount,3);
    assert.equal(update.metadata.practiceBatch.rootTraceId,ROOT);
    assert.match(update.content,/3\/5/);
    assert.equal(batchProgressMessage({practiceBatch:{status:'READY'}},s),null,'a published batch is not rewritten');
    assert.equal(batchProgressMessage({practiceBatch:{status:'FAILED'}},s),null);
    assert.equal(batchProgressMessage({},s),null);
});

test('B9 status view exposes progress but never solutions or tests',()=>{
    const s=summarizeExerciseBatch(parent(),[parent(),child('c2',2,'SUCCEEDED',50)],NOW);
    const view=batchStatusView(parent(),s);
    assert.deepEqual([view.completedCount,view.expectedCount,view.nextIndex,view.published],[2,5,3,false]);
    assert.equal(view.exercise.concept_id,'PY-LIST-01');
    assert.equal(JSON.stringify(view).includes('secret'),false);
    assert.equal(batchStatusView(parent({path_id:'p1'}),s).published,true);
    assert.equal(isBatchRoot(parent()),true);
    assert.equal(isBatchRoot(child('c2',2,'SUCCEEDED',50)),false,'a child is not a batch root');
    assert.equal(isBatchRoot(parent({report:{exercise_count:1,...GATE}})),false,'a single exercise is not a batch');
    assert.equal(isBatchRoot(parent({status:'FAILED'})),false);
    assert.equal(isBatchRoot(undefined),false,'missing or foreign runs (getRun filters by user) give 404');
});

test('B10 a complete batch is ready to publish in position order',()=>{
    const runs=full();
    const s=summarizeExerciseBatch(parent(),runs,NOW);
    assert.deepEqual(s.ordered.map(r=>r.trace_id),[ROOT,'c2','c3','c4','c5']);
    assert.equal(batchReadyForPublish(parent(),s.ordered),true);
});

test('B11/B15 a batch with a missing position is not publishable',()=>{
    const runs=full().filter(r=>r.trace_id!=='c4');
    const s=summarizeExerciseBatch(parent(),runs,NOW);
    assert.equal(s.ordered.length,4);
    assert.equal(batchReadyForPublish(parent(),s.ordered),false);
});

test('B12 a failed attempt then a verified retry publishes the retry',()=>{
    const runs=[...full().filter(r=>r.trace_id!=='c4'),child('c4-fail',4,'FAILED',35),child('c4-retry',4,'SUCCEEDED',25)];
    const s=summarizeExerciseBatch(parent(),runs,NOW);
    assert.equal(s.ordered[3].trace_id,'c4-retry');
    assert.equal(batchReadyForPublish(parent(),s.ordered),true);
});

test('B12b two verified runs for one position (duplicate tabs) still publish exactly one per position',()=>{
    const runs=[...full(),child('c5-dup',5,'SUCCEEDED',10)];
    const s=summarizeExerciseBatch(parent(),runs,NOW);
    assert.equal(s.ordered.length,5);
    assert.equal(s.ordered[4].trace_id,'c5-dup','the latest verified run of a position wins');
    assert.equal(batchReadyForPublish(parent(),s.ordered),true);
});

test('B10b publish rejects mixed concepts, languages, duplicates or wrong positions',()=>{
    const s=summarizeExerciseBatch(parent(),full(),NOW);
    const swap=(i,patch)=>s.ordered.map((r,j)=>j===i?{...r,...patch}:r);
    assert.equal(batchReadyForPublish(parent(),swap(2,{artifact:{...artifact('x'),concept_id:'PY-SET-01'}})),false);
    assert.equal(batchReadyForPublish(parent(),swap(2,{artifact:{...artifact('x'),language:'cpp'}})),false);
    assert.equal(batchReadyForPublish(parent(),swap(2,{exercise_id:s.ordered[1].exercise_id})),false);
    assert.equal(batchReadyForPublish(parent(),swap(2,{request:{batch_parent_trace_id:ROOT,batch_index:7}})),false);
    assert.equal(batchReadyForPublish(parent(),swap(2,{report:{}})),false,'every exercise needs the publication gate');
});

test('B14 failure count reports how many positions were verified',()=>{
    const runs=[parent(),child('c2',2,'SUCCEEDED',50),child('c3a',3,'FAILED',40),child('c3b',3,'FAILED',30)];
    const s=summarizeExerciseBatch(parent(),runs,NOW);
    assert.equal(s.completed,2);
    assert.equal(s.nextIndex,3);
    assert.equal(s.nextIndexFailures,2);
});
