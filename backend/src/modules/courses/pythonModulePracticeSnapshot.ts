import {withModulePracticeSnapshot,ModuleSnapshot} from '../onboarding/palnetModuleHistory';
import {moduleRelease,ModuleContext,sameContext,sha} from '../onboarding/palnetModuleRelease';
import {pythonCodeHash,PYTHON_GRADING_EVIDENCE} from '../onboarding/pythonModelEvidence';
import {selectionItems,PracticeItem,ItemAttempt} from './pythonModulePracticePolicy';

export interface PracticePrincipal {id:string;role:string}
export interface PracticeLesson {id:string;lessonId:string|null;chapter:{module:{id:string;moduleId:string;courseId:string;course:{id:string;status:string;createdBy:string}}}}
export class PracticeHttpError extends Error {constructor(public status:number,public code:string){super(code);}}
export const practiceLessonSelect={id:true,lessonId:true,chapter:{select:{module:{select:{id:true,moduleId:true,courseId:true,course:{select:{id:true,status:true,createdBy:true}}}}}}};

export async function resolvePracticeLesson(db:any,id:string):Promise<PracticeLesson> {
    const where=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)?{id}:{lessonId:id};
    const lessons=await db.lesson.findMany({where,select:practiceLessonSelect,take:2});
    if(!lessons.length)throw new PracticeHttpError(404,'MODULE_PRACTICE_NOT_FOUND');
    if(lessons.length!==1)throw new PracticeHttpError(409,'AMBIGUOUS_MODULE_PRACTICE');
    return lessons[0];
}
export function checkPracticeAccess(principal:PracticePrincipal,lesson:PracticeLesson):void {
    if(!principal.id)throw new PracticeHttpError(401,'AUTHENTICATION_REQUIRED');
    const course=lesson.chapter.module.course;
    if(course.status!=='PUBLISHED'&&principal.role!=='ADMIN'&&course.createdBy!==principal.id)throw new PracticeHttpError(403,'COURSE_ACCESS_DENIED');
}
export function contextForPractice(lesson:PracticeLesson):ModuleContext {
    const module=lesson.chapter.module;
    const context:ModuleContext={type:'MODULE_PRACTICE',course_id:module.courseId,module_id:module.id,module_code:module.moduleId,bank_id:lesson.id,bank_code:lesson.lessonId||''};
    if(module.course.id!==context.course_id||!moduleRelease().banks.some(b=>sameContext(b,context)))throw new PracticeHttpError(404,'PYTHON_PRACTICE_BANK_OUTSIDE_RELEASE');
    return context;
}
export interface SelectionSnapshot {history:ModuleSnapshot;items:PracticeItem[];attempts:Record<string,ItemAttempt>;selectionRevision:string}
const time=(v:any)=>new Date(v).getTime();

/** A known old version is not a current attempt. Do not infer an old version for legacy rows. */
function trustedOlderAttempt(e:any,s:any,cutoff:string,context:ModuleContext):boolean {
    const ready=time(e?.payload?.feedbackReadyAt);
    return !!e&&e.userId===s.userId&&e.itemId===s.exerciseId&&e.language==='PYTHON'&&e.dataOrigin==='REAL'
        &&e.sourceType==='COURSE_SUBMISSION'&&e.sourceRecordId===s.id&&e.status===s.status
        &&(e.courseId==null||e.courseId===context.course_id)&&(e.lessonId==null||e.lessonId===context.bank_id)
        &&typeof e.isCorrect==='boolean'&&e.isCorrect===(s.status==='PASSED')
        &&e.codeHash===pythonCodeHash(s.code)&&e.payload?.gradingContract===PYTHON_GRADING_EVIDENCE
        &&Number.isInteger(e.testsTotal)&&e.testsTotal>0&&Number.isInteger(e.testsPassed)&&e.testsPassed>=0&&e.testsPassed<=e.testsTotal
        &&(!e.isCorrect||e.testsPassed===e.testsTotal)&&Number.isFinite(ready)&&ready>=time(s.submittedAt)&&ready<time(cutoff)
        &&time(e.submittedAt)===time(s.submittedAt);
}

export async function loadPracticeSelectionSnapshot(db:any,principal:PracticePrincipal,context:ModuleContext):Promise<SelectionSnapshot> {
    return withModulePracticeSnapshot(db,principal.id,context,async(tx,history,exercises)=>{
        const lesson:PracticeLesson|null=await tx.lesson.findUnique({where:{id:context.bank_id},select:practiceLessonSelect});
        if(!lesson)throw new PracticeHttpError(404,'MODULE_PRACTICE_NOT_FOUND');
        checkPracticeAccess(principal,lesson);if(!sameContext(contextForPractice(lesson),context))throw new PracticeHttpError(409,'MODULE_CONTEXT_CHANGED');
        const ids=await tx.codingExercise.findMany({where:{lessonId:context.bank_id},select:{id:true}});
        const byId=new Map(exercises.map(e=>[e.id,e]));
        const items=selectionItems(ids.map((e:any)=>byId.get(e.id)||e),context),current=new Map(items.map(i=>[i.id,i]));
        const verified=new Map(history.history.map(e=>[e.event_id,e]));
        const attempts:Record<string,ItemAttempt>={};const revisionRows:any[]=[];let cursor:string|undefined;
        const seen=new Set<string>();
        for(;;){
            const page=await tx.submission.findMany({where:{userId:principal.id,language:'PYTHON',exerciseId:{in:items.map(i=>i.id)},submittedAt:{lt:new Date(history.cutoff)}},orderBy:[{submittedAt:'asc'},{id:'asc'}],take:500,...(cursor?{cursor:{id:cursor},skip:1}:{}),select:{id:true,userId:true,exerciseId:true,language:true,code:true,status:true,submittedAt:true}});
            if(!page.length)break;
            const events=await tx.learningInteraction.findMany({where:{userId:principal.id,sourceType:'COURSE_SUBMISSION',sourceRecordId:{in:page.map((s:any)=>s.id)}}});
            const eventMap=new Map<string,any>();for(const event of events){if(eventMap.has(event.sourceRecordId))throw Error('DUPLICATE_ATTEMPT_SOURCE');eventMap.set(event.sourceRecordId,event);}
            for(const s of page){
                if(seen.has(s.id)||s.userId!==principal.id||s.language!=='PYTHON'||!current.has(s.exerciseId)||!Number.isFinite(time(s.submittedAt))||time(s.submittedAt)>=time(history.cutoff))throw Error('ATTEMPT_SNAPSHOT_INVALID');
                seen.add(s.id);const e=eventMap.get(s.id),v=e&&verified.get(e.id),item=current.get(s.exerciseId)!;
                const state=attempts[s.exerciseId]??={passed:false,failedAt:null,quarantine:null};
                revisionRows.push([s.id,s.exerciseId,s.status,s.submittedAt,pythonCodeHash(s.code),e?[e.id,e.contentVersion,e.status,e.dataOrigin,e.codeHash,e.payload?.gradingContract,e.payload?.feedbackReadyAt,e.testsTotal,e.testsPassed]:null]);
                if(s.status==='PENDING'){state.quarantine=state.quarantine||'SUBMISSION_PENDING';continue;}
                if(v&&v.item_id===s.exerciseId&&v.content_version===item.contentVersion){
                    if(v.correct)state.passed=true;
                    else if(!state.failedAt||time(v.feedback_ready_at)>time(state.failedAt))state.failedAt=v.feedback_ready_at;
                }else if(e&&/^python-content-v1:[a-f0-9]{64}$/.test(e.contentVersion||'')&&e.contentVersion!==item.contentVersion&&trustedOlderAttempt(e,s,history.cutoff,context)){
                    // A previously graded version does not complete or consume the new version.
                }else{
                    const legacy=!e||!/^python-content-v1:[a-f0-9]{64}$/.test(e.contentVersion||'');
                    if(legacy||!state.quarantine)state.quarantine=legacy?'LEGACY_ATTEMPT_VERSION_UNVERIFIED':'HISTORY_UNVERIFIED';
                }
            }
            const last=page[page.length-1].id;if(last===cursor)throw Error('ATTEMPT_PAGINATION_INVALID');cursor=last;if(page.length<500)break;
        }
        const selectionRevision=sha(JSON.stringify([history.catalogRevision,context,lesson.chapter.module.course,items.map(i=>i.id),revisionRows,attempts]));
        return {history,items,attempts,selectionRevision};
    });
}
