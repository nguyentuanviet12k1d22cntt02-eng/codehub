const test=require('node:test'),assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const {caseId,state}=require('../scripts/sync_palnet_content_repairs.cjs');
const plan=read('reviews/palnet-content-repair-2026-11-03/db-change-plan.json'),before=read('reviews/palnet-content-repair-2026-11-03/db-before-30.json');
const after=()=>plan.rows.map(r=>({...structuredClone(r.after),courseId:r.courseId,bankCode:r.bankCode,moduleCode:r.moduleCode}));
test('scope/version guard recognizes all exact before/after versions and rejects incomplete or cross-course data',()=>{
 assert.ok(state(before,plan).every(s=>s==='BEFORE'));assert.ok(state(after(),plan).every(s=>s==='AFTER'));assert.throws(()=>state(before.slice(1),plan));let bad=after();bad[0].courseId='wrong';assert.throws(()=>state(bad,plan));
});
test('content, solution, testcase IDs and fixture data drift cannot reuse a planned version',()=>{
 for(const mutate of [e=>e.solutionCode+='\n# drift',e=>e.testCases[0].input+=' ',e=>e.testCases[0].id='11111111-1111-5111-8111-111111111111',e=>e.problemDescription+=' changed']){const bad=after();mutate(bad[0]);assert.throws(()=>state(bad,plan),/CONFLICT/);}
});
test('planned177 testcase IDs are deterministic UUIDv5 and unique across30 exercises',()=>{
 const ids=plan.rows.flatMap(r=>r.after.testCases.map(t=>t.id));assert.equal(ids.length,177);assert.equal(new Set(ids).size,177);assert.ok(ids.every(id=>/^[a-f0-9]{8}-[a-f0-9]{4}-5[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(id)));assert.equal(caseId(plan.rows[0].exerciseId,'x'),caseId(plan.rows[0].exerciseId,'x'));assert.notEqual(caseId(plan.rows[0].exerciseId,'x'),caseId(plan.rows[0].exerciseId,'y'));
});
