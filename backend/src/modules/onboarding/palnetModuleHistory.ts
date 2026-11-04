import {createHash} from 'crypto';
import {pythonContentVersion,pythonCodeHash,PYTHON_GRADING_EVIDENCE} from './pythonModelEvidence';
import {moduleRelease,portableModuleVersion,sameContext,ModuleContext,ModuleRelease} from './palnetModuleRelease';
export interface MappedFeedback {event_id:string;item_id:string;content_version:string;skill_id:string;correct:boolean;feedback_ready_at:string}
export interface Rejection {itemId:string;reason:string}
const time=(d:any)=>new Date(d).getTime();
const compare=(a:string,b:string)=>a<b?-1:a>b?1:0;
export function verifyMappedFeedback(events:any[],submissions:any[],exercises:any[],owner:string,cutoff:Date,release:ModuleRelease) {
 const subs=new Map(submissions.map(s=>[s.id,s])),ex=new Map(exercises.map(e=>[e.id,e])),mapping=new Map(release.rows.map(r=>[r.exercise_id,r]));
 const verified:MappedFeedback[]=[],rejected:Rejection[]=[],seenEvents=new Set<string>(),seenSubmissions=new Set<string>();
 for(const e of events){
  const s=subs.get(e.sourceRecordId),x=ex.get(e.itemId),m=mapping.get(e.itemId);let reason='';const ready=time(e.payload?.feedbackReadyAt),submitted=time(s?.submittedAt);
  if(!s||!x||!m)reason='MISSING_SOURCE';
  else if(e.userId!==owner||s.userId!==owner||e.sourceType!=='COURSE_SUBMISSION'||e.language!=='PYTHON'||s.language!=='PYTHON'||e.dataOrigin!=='REAL'||s.exerciseId!==x.id)reason='OWNER_OR_SOURCE_SCOPE';
  else if(!['PASSED','FAILED'].includes(s.status)||e.status!==s.status||typeof e.isCorrect!=='boolean'||e.isCorrect!==(s.status==='PASSED')||typeof s.code!=='string'||e.codeHash!==pythonCodeHash(s.code))reason='GRADE_OR_CODE_MISMATCH';
  else if(!e.contentVersion||!/^python-content-v1:[a-f0-9]{64}$/.test(e.contentVersion))reason='LEGACY_VERSION_UNVERIFIED';
  else if(e.contentVersion!==m.content_version||pythonContentVersion(x)!==m.content_version)reason='CONTENT_VERSION_STALE';
  else if((e.courseId!=null&&e.courseId!==m.course_id)||(e.lessonId!=null&&e.lessonId!==m.bank_id))reason='CONTEXT_MISMATCH';
  else if(e.payload?.gradingContract!==PYTHON_GRADING_EVIDENCE||!Number.isInteger(e.testsTotal)||e.testsTotal!==x.testCases.length||e.testsTotal<=0||!Number.isInteger(e.testsPassed)||e.testsPassed<0||e.testsPassed>e.testsTotal||(e.isCorrect&&e.testsPassed!==e.testsTotal))reason='GRADING_PROOF_UNVERIFIED';
  else if(!Number.isFinite(ready)||!Number.isFinite(submitted)||ready<submitted||ready>=cutoff.getTime()||submitted>=cutoff.getTime()||time(e.submittedAt)!==submitted)reason='FEEDBACK_TIME_INVALID';
  if(reason||!m){rejected.push({itemId:e.itemId,reason:reason||'MISSING_SOURCE'});continue;}
  if(seenEvents.has(e.id)||seenSubmissions.has(s.id))throw Error('DUPLICATE_TRUSTED_EVIDENCE');seenEvents.add(e.id);seenSubmissions.add(s.id);
  verified.push({event_id:e.id,item_id:x.id,content_version:e.contentVersion,skill_id:m.skill_id,correct:e.isCorrect,feedback_ready_at:new Date(ready).toISOString()});
 }
 verified.sort((a,b)=>time(a.feedback_ready_at)-time(b.feedback_ready_at)||compare(a.event_id,b.event_id));return {verified,rejected};
}
export function aggregateModuleHistory(history:MappedFeedback[],cutoff:string,catalogRevision:string,historyRevision:string,skills:string[]) {
 const counts=skills.map(()=>0),corrects=skills.map(()=>0),ema=skills.map(()=>.5),indices=new Map(skills.map((s,i)=>[s,i])),seen=new Set<string>(),solved=new Set<string>();let last:string|null=null;
 const ordered=[...history].sort((a,b)=>time(a.feedback_ready_at)-time(b.feedback_ready_at)||compare(a.event_id,b.event_id));
 for(const e of ordered){const k=indices.get(e.skill_id);if(k===undefined||seen.has(e.event_id)||typeof e.correct!=='boolean'||!Number.isFinite(time(e.feedback_ready_at))||time(e.feedback_ready_at)>=time(cutoff))throw Error('INVALID_CAUSAL_HISTORY');seen.add(e.event_id);last=e.feedback_ready_at;const pair=JSON.stringify([e.item_id,e.content_version]);if(solved.has(pair))continue;counts[k]++;corrects[k]+=Number(e.correct);ema[k]=.7*ema[k]+.3*Number(e.correct);if(e.correct)solved.add(pair);}
 return {schema_version:'palnet-causal-summary/2.0' as const,cutoff,catalog_revision:catalogRevision,history_revision:historyRevision,skill_ids:skills,attempt_counts:counts,correct_counts:corrects,ema,source_event_count:ordered.length,history_count:counts.reduce((a,b)=>a+b,0),last_feedback_ready_at:last};
}
export interface ModuleSnapshot {owner:string;context:ModuleContext;cutoff:string;catalogRevision:string;historyRevision:string;history:MappedFeedback[];rejected:Rejection[];rawEventCount:number;summary:ReturnType<typeof aggregateModuleHistory>}
/** Native unique-ID cursor preserves PostgreSQL submillisecond timestamp ordering. No history cache/last-N limit. A timeout aborts the entire snapshot. Caller owns learner access checks. */
export async function loadModulePracticeSnapshot(db:any,owner:string,context:ModuleContext):Promise<ModuleSnapshot> {
 return withModulePracticeSnapshot(db,owner,context,async(_tx,snapshot)=>snapshot);
}
/** Selection/access reads share the same committed, read-only evidence snapshot. */
export async function withModulePracticeSnapshot<T>(db:any,owner:string,context:ModuleContext,read:(tx:any,snapshot:ModuleSnapshot,exercises:any[])=>Promise<T>):Promise<T> {
 const release=moduleRelease();if(!release.banks.some(b=>sameContext(b,context)))throw Error('CONTEXT_OUTSIDE_DOMAIN');
 return db.$transaction(async(tx:any)=>{
  await tx.$executeRawUnsafe('SET TRANSACTION READ ONLY');
  const clock=await tx.$queryRawUnsafe('SELECT clock_timestamp() AS cutoff');const cutoff=new Date(clock[0].cutoff);if(!Number.isFinite(cutoff.getTime()))throw Error('SNAPSHOT_CLOCK_INVALID');
  const exercises=await tx.codingExercise.findMany({where:{id:{in:release.rows.map(r=>r.exercise_id)}},include:{testCases:true,lesson:{select:{id:true,lessonId:true,chapter:{select:{module:{select:{id:true,moduleId:true,courseId:true}}}}}}}});
  if(exercises.length!==release.rows.length||new Set(exercises.map((e:any)=>e.id)).size!==release.rows.length)throw Error('CATALOG_REVIEW_REQUIRED');
  for(const e of exercises){const row=release.rows.find(r=>r.exercise_id===e.id),module=e.lesson?.chapter?.module;if(!row||e.lessonId!==row.bank_id||e.lesson?.lessonId!==row.bank_code||module?.id!==row.module_id||module.moduleId!==row.module_code||module.courseId!==row.course_id||pythonContentVersion(e)!==row.content_version||portableModuleVersion(e)!==row.inventory_version)throw Error('CATALOG_REVIEW_REQUIRED');}
  const verified:MappedFeedback[]=[],rejected:Rejection[]=[],revision=createHash('sha256');let cursor:any=null,rawEventCount=0;const seenSources=new Set<string>(),seenRecords=new Set<string>();
  revision.update(release.catalog_revision);revision.update(owner);
  for(;;){const page=await tx.learningInteraction.findMany({where:{userId:owner,sourceType:'COURSE_SUBMISSION',language:'PYTHON',dataOrigin:'REAL',itemId:{in:release.rows.map(r=>r.exercise_id)},submittedAt:{lt:cutoff}},...(cursor?{cursor:{id:cursor.id},skip:1}:{}),orderBy:[{submittedAt:'asc'},{id:'asc'}],take:500});if(!page.length)break;
   const last=page[page.length-1];if(!Number.isFinite(time(last.submittedAt))||typeof last.id!=='string')throw Error('HISTORY_PAGINATION_INVALID');if(cursor&&last.id===cursor.id)throw Error('HISTORY_PAGINATION_INVALID');
   const subs=await tx.submission.findMany({where:{userId:owner,language:'PYTHON',id:{in:page.map((e:any)=>e.sourceRecordId)}},select:{id:true,userId:true,exerciseId:true,language:true,code:true,status:true,submittedAt:true}});
   const checked=verifyMappedFeedback(page,subs,exercises,owner,cutoff,release);for(const e of checked.verified){const record=page.find((p:any)=>p.id===e.event_id).sourceRecordId;if(seenSources.has(e.event_id)||seenRecords.has(record))throw Error('DUPLICATE_TRUSTED_EVIDENCE');seenSources.add(e.event_id);seenRecords.add(record);verified.push(e);}rejected.push(...checked.rejected);rawEventCount+=page.length;
   revision.update(JSON.stringify(page.map((e:any)=>[e.id,e.sourceRecordId,e.contentVersion,e.codeHash,e.status,e.isCorrect,e.testsPassed,e.testsTotal,e.payload?.gradingContract,e.payload?.feedbackReadyAt,e.submittedAt])));revision.update(JSON.stringify(checked));cursor={id:last.id,submittedAt:last.submittedAt};if(page.length<500)break;
  }
  verified.sort((a,b)=>time(a.feedback_ready_at)-time(b.feedback_ready_at)||compare(a.event_id,b.event_id));const historyRevision=revision.digest('hex'),cutoffString=cutoff.toISOString();const summary=aggregateModuleHistory(verified,cutoffString,release.catalog_revision,historyRevision,release.skill_ids);
  return read(tx,{owner,context,cutoff:cutoffString,catalogRevision:release.catalog_revision,historyRevision,history:verified,rejected,rawEventCount,summary},exercises);
 },{isolationLevel:'RepeatableRead',maxWait:10000,timeout:30000});
}
