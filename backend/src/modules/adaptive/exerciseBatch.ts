/**
 * Pure rules for multi-exercise practice batches (no database access), so each
 * rule can be tested on its own. adaptive.controller.ts does the I/O.
 */

const PENDING_RUN_STATUSES=['RUNNING','WAITING_PROVIDER'];
/** A run stuck in RUNNING longer than this (e.g. its backend restarted) no longer counts as in flight. */
export const ORPHAN_RUN_MS=10*60*1000;

export const passedPublicationGate=(run:any)=>run?.status==='SUCCEEDED'&&run.artifact?.qc_status==='VERIFIED'&&
    run.report?.agent_traces?.some((step:any)=>step.agent==='PublicationGate'&&step.status==='SUCCEEDED'&&step.output?.approved===true);

/**
 * Summarise a practice batch from its runs. A batch position can have several
 * runs (a failed attempt, then a retry after the tab reloaded), so the latest
 * verified run of each position counts and failed attempts are ignored.
 */
export function summarizeExerciseBatch(parent:any,candidates:any[],now=Date.now()) {
    const parentTrace=parent.trace_id;
    const expected=Number(parent?.report?.exercise_count);
    const children=candidates.filter(run=>run.trace_id!==parentTrace&&run.request?.batch_parent_trace_id===parentTrace);
    const verified=new Map<number,any>();
    if(passedPublicationGate(parent)) verified.set(1,parent);
    const failures=new Map<number,number>();
    let running=false;
    for(const run of [...children].sort((a,b)=>new Date(a.created_at).getTime()-new Date(b.created_at).getTime())) {
        const index=Number(run.request?.batch_index);
        if(!Number.isInteger(index)||index<2||index>expected) continue;
        if(passedPublicationGate(run)) verified.set(index,run);
        else if(PENDING_RUN_STATUSES.includes(run.status)&&now-new Date(run.updated_at).getTime()<ORPHAN_RUN_MS) running=true;
        else if(!PENDING_RUN_STATUSES.includes(run.status)) failures.set(index,(failures.get(index)||0)+1);
    }
    const size=Number.isInteger(expected)?expected:0;
    const ordered=Array.from({length:size},(_,i)=>verified.get(i+1)).filter(Boolean);
    let nextIndex:number|null=null;
    for(let index=2;index<=expected;index++) if(!verified.has(index)){nextIndex=index;break;}
    return {expected,ordered,completed:verified.size,running,nextIndex,
        nextIndexFailures:nextIndex?failures.get(nextIndex)||0:0,
        titles:Array.from({length:size},(_,i)=>verified.get(i+1)?.artifact?.title||null)};
}
export type BatchSummary=ReturnType<typeof summarizeExerciseBatch>;

/** A position already verified, or any position still generating, must not be generated again. */
export function batchPositionTaken(summary:BatchSummary,batchIndex:number):boolean {
    return Boolean(summary.titles[batchIndex-1])||summary.running;
}

/** Whether every position holds a distinct verified exercise of the same concept and language, in order. */
export function batchReadyForPublish(parent:any,ordered:any[]):boolean {
    const expected=Number(parent?.report?.exercise_count);
    const parentTrace=parent?.trace_id;
    return ordered.length===expected && new Set(ordered.map(run=>run.exercise_id)).size===expected &&
        ordered.every((run,index)=>passedPublicationGate(run)&&
            run.artifact?.concept_id===parent.artifact?.concept_id&&run.artifact?.language===parent.artifact?.language&&
            (index===0 ? run.trace_id===parentTrace
                : run.request?.batch_parent_trace_id===parentTrace&&Number(run.request?.batch_index)===index+1));
}

/** New content/metadata for the batch card after a position succeeded, or null when it must not change. */
export function batchProgressMessage(metadata:any,summary:BatchSummary) {
    const batch=metadata?.practiceBatch;
    if(!batch||batch.status!=='GENERATING') return null;
    return {content:`Đang tạo ${summary.expected} bài thực hành. Đã kiểm định ${summary.completed}/${summary.expected} bài; hệ thống tiếp tục tự tạo các bài còn lại.`,
        metadata:{...metadata,practiceBatch:{...batch,completedCount:summary.completed}}};
}

/** Public view returned by GET /adaptive/batch/:traceId (never the solution or tests). */
export function batchStatusView(parent:any,summary:BatchSummary) {
    const first=parent.artifact||{};
    return {rootTraceId:parent.trace_id,published:Boolean(parent.path_id),pathId:parent.path_id||null,
        expectedCount:summary.expected,completedCount:summary.completed,running:summary.running,
        nextIndex:summary.nextIndex,nextIndexFailures:summary.nextIndexFailures,titles:summary.titles,
        exercise:{exercise_id:parent.exercise_id,title:first.title,concept_id:first.concept_id,
            concept_name:first.concept_name,language:first.language}};
}

/** Whether a run can be the root of a batch (not a child, 2..5 exercises, verified). */
export function isBatchRoot(parent:any):boolean {
    const expected=Number(parent?.report?.exercise_count);
    return Boolean(parent)&&!parent.request?.batch_parent_trace_id&&Number.isInteger(expected)&&expected>=2&&expected<=5&&passedPublicationGate(parent);
}

/**
 * One in-flight turn per chat session. Check and take happen in one synchronous
 * step (two tabs must not both pass across an await), and only the holder
 * releases — a request rejected with 409 must not unlock the running turn.
 */
export class SessionLock {
    private readonly held=new Set<string>();
    tryAcquire(sessionId:string):boolean {
        if(this.held.has(sessionId)) return false;
        this.held.add(sessionId);
        return true;
    }
    release(sessionId:string,acquired:boolean) {
        if(acquired) this.held.delete(sessionId);
    }
    isHeld(sessionId:string):boolean { return this.held.has(sessionId); }
}
