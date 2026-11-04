import assert from 'node:assert/strict';
import {after,test} from 'node:test';
import {createRequire} from 'node:module';
import {createServer} from 'vite';
import react from '@vitejs/plugin-react';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {MemoryRouter} from 'react-router-dom';
import axios,{AxiosError} from 'axios';
import {release,fixtureLesson,decision,grade,fingerprint} from './palnet-p5-fixtures.mjs';
const server=await createServer({configFile:false,plugins:[react()],server:{middlewareMode:true},appType:'custom',optimizeDeps:{noDiscovery:true,include:[]}});
after(()=>server.close());
const base='/src/features/lesson/';
const contracts=await server.ssrLoadModule(base+'services/modulePracticeContracts.ts');
const {LatestPracticeRequest}=await server.ssrLoadModule(base+'services/latestPracticeRequest.ts');
const {getModulePracticeRecommendation}=await server.ssrLoadModule(base+'services/modulePracticeRecommendation.ts');
const {PracticeRecommendationCard}=await server.ssrLoadModule(base+'components/PracticeRecommendationCard.tsx');
const {parsePracticeRecommendation:parse,bindPracticeRecommendation:bind,committedPracticeVersion,hasPracticeSelection}=contracts;
const context=release.banks[0],bank=fixtureLesson(context),d=()=>decision(context);

test('all four DTO v2 modes bind all nine bank contexts',()=>{for(const b of release.banks)for(const mode of ['PALNET_ADVISORY','RULE_BASED','MANUAL','COMPLETE']){const p=bind(parse(decision(b,mode)),fixtureLesson(b));assert.equal(p.mode,mode);assert.equal(hasPracticeSelection(p),mode==='PALNET_ADVISORY'||mode==='RULE_BASED');}});
test('reject malformed score, version, counts, provenance, cutoff and false completion',()=>{
 for(const bad of [{predictedCorrectness:NaN},{predictedCorrectness:2},{contentVersion:'legacy'},{availableCount:0},{modelVersion:null},{cutoff:'2026-11-03T12:00:00'},{selectionRevision:'bad'},{evaluationStatus:'VALIDATED'},{schemaVersion:'old'}])assert.throws(()=>parse({...d(),...bad}),/INVALID_RECOMMENDATION/);
 assert.throws(()=>parse({...decision(context,'COMPLETE'),passedCount:1,quarantinedCount:1}),/INVALID_RECOMMENDATION/);
 assert.throws(()=>parse({...decision(context,'COMPLETE'),selectionRevision:null}),/INVALID_RECOMMENDATION/);
 assert.throws(()=>parse({...decision(context,'RULE_BASED'),predictedCorrectness:.8}),/INVALID_RECOMMENDATION/);
});
test('never open an exercise outside the current lesson or mismatched bank',()=>{
 assert.throws(()=>bind(parse({...d(),exerciseId:'elsewhere'}),bank),/INVALID_RECOMMENDATION/);
 assert.throws(()=>bind(parse(decision(release.banks[1])),bank),/INVALID_RECOMMENDATION/);
 assert.throws(()=>bind(parse({mode:'COMPLETE',reason:'ALL_VERIFIED_EXERCISES_PASSED'}),bank),/INVALID_RECOMMENDATION/);
});
test('JS/CPP pilot remains separate; Python cannot consume legacy pilot or wrong language',()=>{
 for(const [language,lessonId]of [['JAVASCRIPT','JS1-01.MP'],['CPP','CPP-01.MP']]){const x={mode:'PALNET_SYNTHETIC_MULTILINGUAL_PILOT',language,exerciseId:'pilot',title:'Pilot',difficulty:'EASY',skillId:'PILOT',estimatedReadiness:.5,availableCount:1};assert.equal(bind(parse(x),{id:'pilot-bank',lessonId,codingExercises:[{id:'pilot'}]}).language,language);assert.throws(()=>bind(parse(x),bank),/INVALID_RECOMMENDATION/);}
 assert.throws(()=>parse({...d(),schemaVersion:undefined,mode:'PALNET_SYNTHETIC_LOCAL_PILOT'}),/INVALID_RECOMMENDATION/);
});
test('only a matching committed receipt identifies the graded version',()=>{
 const r=grade(context,'submission',true);assert.equal(committedPracticeVersion(r,bank.id),fingerprint);
 for(const modified of [{...r,success:false},{...r,submissionId:'older'},{...r,recommendationRefresh:{...r.recommendationRefresh,contentVersion:'old'}},{...r,recommendationRefresh:null}])assert.equal(committedPracticeVersion(modified,bank.id),null);
 assert.equal(committedPracticeVersion(r,'another-bank'),null);
});
test('same-version PASS cannot reappear, newer version and current FAILED retry can',()=>{
 const p=parse(d()),passed=new Map([[p.exerciseId,fingerprint]]);assert.throws(()=>bind(p,bank,passed),/STALE_DECISION/);
 const newVersion=parse({...d(),contentVersion:'python-content-v1:'+'b'.repeat(64)});assert.equal(bind(newVersion,bank,passed),newVersion);
 const retry=parse(decision(context,'RULE_BASED',{revision:1,reason:'RETRY_RULE'}));assert.equal(bind(retry,bank).exerciseId,p.exerciseId);
});
test('new request aborts prior one and a late completion cannot overwrite a different route',()=>{
 const g=new LatestPracticeRequest(),first=g.begin(bank.id),second=g.begin(bank.id);assert(first.signal.aborted);assert(g.accept(second,d()));assert(!g.accept(first,d()));
 const next=g.begin('another-bank');assert(!g.current(second));g.cancel();assert(next.signal.aborted);assert(!g.accept(next,d()));
});
test('after a committed submission, reject earlier selection revision even with a new decision ID',()=>{
 const g=new LatestPracticeRequest();assert(g.accept(g.begin(bank.id),d()));const pending=g.begin(bank.id);g.markCommitted(bank.id);assert(pending.signal.aborted);
 const stale={...d(),decisionId:'another-request',cutoff:'2026-11-03T12:00:01Z'};assert(!g.accept(g.begin(bank.id),stale));
 const fresh=decision(context,'RULE_BASED',{revision:2,selected:1});assert(g.accept(g.begin(bank.id),fresh));
});
test('server cutoff cannot move backwards within a bank; a different bank starts cleanly',()=>{
 const g=new LatestPracticeRequest();assert(g.accept(g.begin(bank.id),decision(context,'PALNET_ADVISORY',{revision:4,selected:1})));assert(!g.accept(g.begin(bank.id),d()));const other=release.banks[1];assert(g.accept(g.begin(other.bank_id),decision(other)));
});
test('HTTP auth, access, missing bank, ambiguity, stale, timeout and outage stay distinct',async()=>{
 const original=axios.defaults.adapter,descriptor=Object.getOwnPropertyDescriptor(globalThis,'localStorage');let token='fixture-token';
 Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem:()=>token}});
 try{
  for(const [status,body,code,errorCode]of [[401,{},'AUTH_REQUIRED'],[403,{},'ACCESS_DENIED'],[404,{},'BANK_NOT_FOUND'],[409,{code:'AMBIGUOUS_MODULE_PRACTICE'},'BANK_CONTEXT_CHANGED'],[409,{code:'DECISION_STALE_RETRY'},'STALE_DECISION'],[503,{},'SERVICE_UNAVAILABLE'],[null,{},'REQUEST_TIMEOUT','ECONNABORTED']]){
   axios.defaults.adapter=async config=>{throw new AxiosError('fixture',errorCode,config,null,status?{status,data:body,headers:{},config,statusText:'fixture'}:undefined);};
   await assert.rejects(getModulePracticeRecommendation('LS-01.MP'),e=>e.code===code);
  }
  axios.defaults.adapter=async config=>{token='other-session';return {data:d(),status:200,statusText:'OK',headers:{},config};};
  await assert.rejects(getModulePracticeRecommendation(bank.id),e=>e.code==='SESSION_CHANGED');
  token=null;await assert.rejects(getModulePracticeRecommendation(bank.id),e=>e.code==='AUTH_REQUIRED');
 }finally{axios.defaults.adapter=original;if(descriptor)Object.defineProperty(globalThis,'localStorage',descriptor);else delete globalThis.localStorage;}
});
function render(state){return renderToStaticMarkup(React.createElement(MemoryRouter,null,React.createElement(PracticeRecommendationCard,{state,onRetry(){},onOpen(){},manualHref:'/practice/current'})));}
test('actual card renders advisory score only for first opportunities, distinct rule/manual/complete',()=>{
 for(const mode of ['PALNET_ADVISORY','RULE_BASED','MANUAL','COMPLETE']){
  const html=render({status:'ready',value:parse(decision(context,mode)),error:null});assert(html.includes('Chọn bài thủ công'));assert.equal(html.includes('62%'),mode==='PALNET_ADVISORY');assert.equal(html.includes('Bạn đã hoàn thành bộ bài'),mode==='COMPLETE');assert.equal(html.includes('Mở bài được gợi ý'),mode==='PALNET_ADVISORY'||mode==='RULE_BASED');
 }
 assert(render({status:'ready',value:parse(decision(context,'RULE_BASED',{revision:1,reason:'RETRY_RULE'})),error:null}).includes('Luyện lại bài này'));
});
test('actual card exposes live loading, retryable errors and login/access actions',()=>{
 assert(render({status:'loading',value:null,error:null}).includes('aria-busy="true"'));
 const stale=render({status:'error',value:null,error:'STALE_DECISION'});assert(stale.includes('role="alert"'));assert(stale.includes('Làm mới đề xuất'));assert(stale.includes('Chọn bài thủ công'));
 const denied=render({status:'error',value:null,error:'ACCESS_DENIED'});assert(!denied.includes('Chọn bài thủ công'));
 assert(render({status:'error',value:null,error:'AUTH_REQUIRED'}).includes('href="/login"'));
});

test('frontend accepts all four DTO modes produced by actual P4 policy/service',async()=>{
 const backend=createRequire(new URL('../../backend/package.json',import.meta.url));
 const f=backend('./tests/palnetP4Fixtures.cjs');
 const {getPythonModulePracticeDecision}=backend('./src/modules/courses/pythonModulePracticeService');
 const db=f.fakeDB(),b=f.release.banks[0],scope=db.state.lessons[0];
 const practiceBank={id:scope.id,lessonId:scope.lessonId,codingExercises:db.state.ex.filter(e=>e.lessonId===scope.id)};
 const saved=process.env.PALNET_MODULE_PRACTICE_ENABLED,allowlist=process.env.PALNET_MODULE_PRACTICE_MODULES;
 process.env.PALNET_MODULE_PRACTICE_ENABLED='true';process.env.PALNET_MODULE_PRACTICE_MODULES='';
 const run=()=>getPythonModulePracticeDecision(db,f.principal,scope,{advise:async(...args)=>f.advice(...args),trace(){}});
 try{
  assert.equal(bind(parse(await run()),practiceBank).mode,'RULE_BASED');
  db.add();assert.equal(bind(parse(await run()),practiceBank).mode,'PALNET_ADVISORY');
  const rows=f.release.rows.filter(r=>r.bank_id===b.bank_id);for(const row of rows)db.add(row,{event:null});
  assert.equal(bind(parse(await run()),practiceBank).mode,'MANUAL');
  for(const row of rows)db.add(row,{status:'PASSED'});
  assert.equal(bind(parse(await run()),practiceBank).mode,'COMPLETE');
 }finally{if(saved===undefined)delete process.env.PALNET_MODULE_PRACTICE_ENABLED;else process.env.PALNET_MODULE_PRACTICE_ENABLED=saved;if(allowlist===undefined)delete process.env.PALNET_MODULE_PRACTICE_MODULES;else process.env.PALNET_MODULE_PRACTICE_MODULES=allowlist;}
});
