// Synthetic in-memory DB fixture. REAL metadata here tests the verifier; nothing is persisted.
const f=require('./palnetModuleFixtures.cjs'),path=require('node:path'),Module=require('node:module');
const {moduleRelease}=require('../src/modules/onboarding/palnetModuleRelease');
const release=moduleRelease(),principal={id:f.owner,role:'STUDENT'};
function lesson(context=release.banks[0]){return {id:context.bank_id,lessonId:context.bank_code,chapter:{module:{id:context.module_id,moduleId:context.module_code,courseId:context.course_id,course:{id:context.course_id,status:'PUBLISHED',createdBy:'fixture-creator'}}}};}
const compare=(a,b)=>a<b?-1:a>b?1:0;
function fakeDB(){
 const state={ex:f.exercises(),events:[],subs:[],lessons:release.banks.map(lesson),cutoff:f.cutoff,transactions:0,queries:[]};let seq=0;
 function add(item=release.rows[0],options={}){
  const i=seq++,s={id:'p4-s'+String(i).padStart(8,'0'),userId:principal.id,exerciseId:item.exercise_id,language:'PYTHON',code:'print(1)',status:'FAILED',submittedAt:new Date(Date.parse(state.cutoff)-1000000+i*10),...options.submission};
  if(options.status)s.status=options.status;
  const ex=state.ex.find(e=>e.id===s.exerciseId),ready=new Date(s.submittedAt.getTime()+1).toISOString();
  const e={id:'p4-e'+String(i).padStart(8,'0'),sourceType:'COURSE_SUBMISSION',sourceRecordId:s.id,userId:s.userId,language:s.language,dataOrigin:'REAL',itemId:s.exerciseId,status:s.status,isCorrect:s.status==='PASSED',codeHash:f.sha(s.code),contentVersion:item.content_version,courseId:item.course_id,lessonId:item.bank_id,submittedAt:s.submittedAt,testsTotal:ex.testCases.length,testsPassed:s.status==='PASSED'?ex.testCases.length:0,payload:{gradingContract:'python-code-grading/1.0',feedbackReadyAt:ready},...options.event};
  state.subs.push(s);if(options.event!==null&&s.status!=='PENDING')state.events.push(e);return {s,e};
 }
 function page(rows,q){let result=[...rows].sort((a,b)=>new Date(a.submittedAt)-new Date(b.submittedAt)||compare(a.id,b.id));if(q.cursor){const at=result.findIndex(e=>e.id===q.cursor.id);if(at<0)throw Error('MISSING_FIXTURE_CURSOR');result=result.slice(at+(q.skip||0));}return q.take?result.slice(0,q.take):result;}
 const db={state,add,lesson:{findMany:async q=>state.lessons.filter(l=>q.where.id?l.id===q.where.id:l.lessonId===q.where.lessonId).slice(0,q.take)},$transaction:async(fn,options)=>{
  if(options.isolationLevel!=='RepeatableRead')throw Error('WRONG_FIXTURE_ISOLATION');state.transactions++;const snapshot=structuredClone(state);
  const tx={$executeRawUnsafe:async sql=>{if(sql!=='SET TRANSACTION READ ONLY')throw Error('FIXTURE_WRITE_BLOCKED');},$queryRawUnsafe:async()=>[{cutoff:new Date(snapshot.cutoff)}],
   codingExercise:{findMany:async q=>q.where.id?snapshot.ex.filter(e=>q.where.id.in.includes(e.id)):snapshot.ex.filter(e=>e.lessonId===q.where.lessonId)},
   lesson:{findUnique:async q=>snapshot.lessons.find(l=>l.id===q.where.id)||null},
   learningInteraction:{findMany:async q=>{state.queries.push({model:'event',q});const w=q.where;return page(snapshot.events.filter(e=>e.userId===w.userId&&e.sourceType===w.sourceType&&(!w.sourceRecordId||w.sourceRecordId.in.includes(e.sourceRecordId))&&(!w.language||e.language===w.language)&&(!w.dataOrigin||e.dataOrigin===w.dataOrigin)&&(!w.itemId||w.itemId.in.includes(e.itemId))&&(!w.submittedAt||new Date(e.submittedAt)<w.submittedAt.lt)),q);}},
   submission:{findMany:async q=>{state.queries.push({model:'submission',q});const w=q.where;return page(snapshot.subs.filter(s=>s.userId===w.userId&&s.language===w.language&&(!w.id||w.id.in.includes(s.id))&&(!w.exerciseId||w.exerciseId.in.includes(s.exerciseId))&&(!w.submittedAt||new Date(s.submittedAt)<w.submittedAt.lt)),q);}}};
  return fn(tx);
 }};return db;
}
function advice(snapshot,targets,id){return {decisionId:id,context:snapshot.context,cutoff:snapshot.cutoff,catalogRevision:snapshot.catalogRevision,historyRevision:snapshot.historyRevision,historyCount:snapshot.summary.history_count,sourceEventCount:snapshot.summary.source_event_count,probabilities:Object.fromEntries(targets.map((s,i)=>[s,.2+i*.01])),modelVersion:release.pins.model_version,checkpointSha256:release.pins.checkpoint_sha256,manifestSha256:release.pins.manifest_sha256,graphVersion:release.pins.graph_version,mappingVersion:release.pins.mapping_version,featureVersion:release.pins.feature_version,policyVersion:release.pins.policy_version,inputSha256:'a'.repeat(64),fallback:null};}
function loadController(db,target='../src/modules/courses/modulePracticeRecommendation',overrides={}){
 const resolved=require.resolve(target),original=Module._load;delete require.cache[resolved];
 try{Module._load=function(name,parent,isMain){const filename=String(Module._resolveFilename(name,parent)).replace(/\\/g,'/');if(filename.endsWith('/infrastructure/database/prisma.ts'))return{prisma:db};for(const [suffix,value]of Object.entries(overrides))if(filename.endsWith(suffix))return value;return original.apply(this,arguments);};return require(target);}finally{Module._load=original;}
}
function response(){return {code:200,body:null,headers:{},status(n){this.code=n;return this;},json(body){this.body=body;return this;},setHeader(k,v){this.headers[k]=v;return this;}};}
module.exports={...f,release,principal,lesson,fakeDB,advice,loadController,response};
