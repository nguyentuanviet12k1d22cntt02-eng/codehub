const test=require('node:test'),assert=require('node:assert/strict');
const f=require('./palnetP4Fixtures.cjs');
const {loadPracticeSelectionSnapshot}=require('../src/modules/courses/pythonModulePracticeSnapshot');
const {practicePools,selectPractice,selectionItems}=require('../src/modules/courses/pythonModulePracticePolicy');
const context=f.release.banks[0],load=db=>loadPracticeSelectionSnapshot(db,f.principal,context);
test('all nine banks use per-item pinned skills and preserve legitimate blank outputs',async()=>{
 const db=f.fakeDB();let count=0;
 for(const bank of f.release.banks){const s=await loadPracticeSelectionSnapshot(db,f.principal,bank);assert.equal(s.items.length,f.release.rows.filter(r=>r.bank_id===bank.bank_id).length);for(const i of s.items)assert.equal(i.skillId,f.release.rows.find(r=>r.exercise_id===i.id).skill_id);count+=s.items.length;}
 assert.equal(count,208);assert(db.state.ex.some(e=>e.testCases.some(t=>t.expectedOutput==='')));
});
test('current PASS excludes item, even after a subsequent FAILED or legacy attempt',async()=>{
 const db=f.fakeDB();db.add(undefined,{status:'PASSED'});db.add();db.add(undefined,{event:null});const s=await load(db),p=practicePools(s.items,s.attempts);assert.equal(p.passed,1);assert.equal(p.quarantined,0);assert(!p.first.some(i=>i.id===f.release.rows[0].exercise_id));
});
for(const [name,options,reason]of [
 ['missing event',{event:null},'LEGACY_ATTEMPT_VERSION_UNVERIFIED'],['legacy timestamp',{event:{contentVersion:'2026-01-01'}},'LEGACY_ATTEMPT_VERSION_UNVERIFIED'],['synthetic',{event:{dataOrigin:'SYNTHETIC'}},'HISTORY_UNVERIFIED'],['code mismatch',{event:{codeHash:'0'.repeat(64)}},'HISTORY_UNVERIFIED'],['future feedback',{event:{payload:{gradingContract:'python-code-grading/1.0',feedbackReadyAt:f.cutoff}}},'HISTORY_UNVERIFIED'],['pending',{status:'PENDING'},'SUBMISSION_PENDING']])test('quarantine '+name+' instead of pretending first opportunity',async()=>{
 const db=f.fakeDB();db.add(undefined,options);const s=await load(db),p=practicePools(s.items,s.attempts);assert.equal(p.quarantined,1);assert.equal(s.attempts[f.release.rows[0].exercise_id].quarantine,reason);assert.equal(p.first.length,29);
});
test('known older fingerprint is not current PASS or retry; tampered old proof remains quarantined',async()=>{
 const db=f.fakeDB();db.add(undefined,{status:'PASSED',event:{contentVersion:'python-content-v1:'+'0'.repeat(64)}});let s=await load(db),p=practicePools(s.items,s.attempts);assert.equal(p.passed,0);assert.equal(p.first.length,30);db.state.events[0].codeHash='bad';s=await load(db);assert.equal(practicePools(s.items,s.attempts).quarantined,1);
});
test('legacy plus current FAILED stays quarantined; only current verified PASS resolves it',async()=>{const db=f.fakeDB();db.add(undefined,{event:null});db.add();let s=await load(db);assert.equal(practicePools(s.items,s.attempts).quarantined,1);db.add(undefined,{status:'PASSED'});s=await load(db);assert.equal(practicePools(s.items,s.attempts).passed,1);});
test('missing/extra/changed curriculum fails closed; no implicit complete',async()=>{
 for(const mutate of [db=>db.state.ex.push({...db.state.ex[0],id:'new-extra-exercise'}),db=>db.state.ex.shift(),db=>db.state.ex[0].testCases[0].expectedOutput+='drift']){const db=f.fakeDB();mutate(db);await assert.rejects(load(db),/CATALOG/);}
});
test('submission pagination retains1001attempts, including missing-event legacy; no lastN',async()=>{
 const db=f.fakeDB();for(let i=0;i<1001;i++)db.add(undefined,{event:null});const s=await load(db);assert.equal(practicePools(s.items,s.attempts).quarantined,1);const pages=db.state.queries.filter(x=>x.model==='submission'&&x.q.where.exerciseId);assert.equal(pages.length,3);assert.deepEqual(pages[1].q.cursor,{id:db.state.subs[499].id});assert.equal(pages[1].q.where.OR,undefined);
});
const items=[{id:'hard-a',title:'A',difficulty:'HARD',skillId:'PY-BASICS-01',contentVersion:'v',sourcePosition:1},{id:'easy-b',title:'B',difficulty:'EASY',skillId:'PY-BASICS-03',contentVersion:'v',sourcePosition:2},{id:'easy-a',title:'A easy',difficulty:'EASY',skillId:'PY-BASICS-01',contentVersion:'v',sourcePosition:3}];
test('rank skill correctness first, then difficulty/catalog; graph order breaks score ties',()=>{
 const p=practicePools(items,{}),a=f.advice(f.snapshot(1),['PY-BASICS-01','PY-BASICS-03'],'id');a.probabilities={'PY-BASICS-01':.9,'PY-BASICS-03':.2};let s=selectPractice(p,f.release,a,'x');assert.equal(s.candidate.id,'easy-a');assert.equal(s.probability,.9);
 a.probabilities['PY-BASICS-03']=.9;s=selectPractice(p,f.release,a,'x');const firstSkill=f.release.skill_ids.filter(k=>k in a.probabilities)[0];assert.equal(s.candidate.skillId,firstSkill);
});
test('first opportunity outranks retry; retry uses latest valid failure then catalog without model',()=>{
 const attempts={'hard-a':{passed:false,failedAt:'2026-11-03T10:00:00Z',quarantine:null},'easy-b':{passed:false,failedAt:'2026-11-03T11:00:00Z',quarantine:null}};let p=practicePools(items,attempts),s=selectPractice(p,f.release,null,'COLD_START');assert.equal(s.candidate.id,'easy-a');attempts['easy-a']={passed:true,failedAt:null,quarantine:null};p=practicePools(items,attempts);s=selectPractice(p,f.release,null,'MODEL_DISABLED');assert.equal(s.reason,'RETRY_RULE');assert.equal(s.candidate.id,'easy-b');assert.equal(s.probability,null);
});
test('support gap applies to the entire first pool; model failures never invent scores',()=>{
 const p=practicePools(items,{}),gap={...f.release,qualified_skill_ids:['PY-BASICS-01']};const s=selectPractice(p,gap,f.advice(f.snapshot(1),['PY-BASICS-01','PY-BASICS-03'],'id'),'x');assert.equal(s.reason,'SKILL_SUPPORT_GAP');assert.equal(s.candidate.id,'easy-b');assert.equal(s.probability,null);
});
test('all current PASS means COMPLETE; legacy-only is MANUAL, never completion',()=>{
 const attempts=Object.fromEntries(items.map(i=>[i.id,{passed:true,failedAt:null,quarantine:null}]));assert.equal(selectPractice(practicePools(items,attempts),f.release,null,'x').mode,'COMPLETE');for(const a of Object.values(attempts)){a.passed=false;a.quarantine='LEGACY_ATTEMPT_VERSION_UNVERIFIED';}const s=selectPractice(practicePools(items,attempts),f.release,null,'x');assert.equal(s.mode,'MANUAL');assert.equal(s.reason,'LEGACY_ATTEMPT_VERSION_UNVERIFIED');assert.equal(s.candidate,null);
});

test('old-version proof with another course/bank is quarantined rather than consuming or clearing a current opportunity',async()=>{
 for(const field of ['courseId','lessonId']){const db=f.fakeDB();db.add(undefined,{status:'PASSED',event:{contentVersion:'python-content-v1:'+'0'.repeat(64),[field]:'another-context'}});const s=await load(db);assert.equal(practicePools(s.items,s.attempts).quarantined,1);}
});
