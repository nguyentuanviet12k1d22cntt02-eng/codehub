/**
 * Finishes multi-exercise practice batches on the server. After the learner's request
 * produced a verified first exercise (the batch root), this worker generates positions
 * 2..N one at a time and publishes the batch, so it completes even when no browser tab
 * is open. The browser only shows progress (GET /adaptive/batch/:traceId).
 *
 * Safety rails: one batch per chat session at a time (sessionLock, shared with chat
 * turns), one in-flight run per position (unique index adaptive_runs_batch_position_inflight,
 * for every backend instance), provider failures go through the retry worker
 * (WAITING_PROVIDER), and a position that failed MAX_POSITION_FAILURES times stops the batch.
 */
import { nextBatchAction } from './exerciseBatch';
import { getRun, pendingBatchRoots } from './adaptiveRepository';
import { batchCardMessage, generateBatchPosition, loadBatchSummary, markBatchFailed, publishExerciseBatch, sessionLock } from './adaptive.controller';
import { getTutorAvailability } from '../ai-tutor/tutorAvailability';

const TICK_MS=10000;
/** Batches advanced at once by this process (each runs one AI pipeline at a time). */
const MAX_PARALLEL=Math.max(1,Number(process.env.ADAPTIVE_BATCH_WORKER_CONCURRENCY)||2);
/** Upper bound on actions in one advanceBatch call: 4 positions x 2 failures + publish. */
const MAX_STEPS=10;

const inFlight=new Set<string>();
let scanning=false;

export type AdvanceOutcome='session-busy'|'position-taken'|'waiting'|'published'|'failed'|'none'|'wait'|'step-limit';

/** Run the batch forward until it waits on something, is published, or fails. */
export async function advanceBatch(root:{trace_id:string,user_id:string,session_id:string}):Promise<AdvanceOutcome> {
    // A chat turn (or another batch) is running in this session; try again next tick.
    if(!sessionLock.tryAcquire(root.session_id)) return 'session-busy';
    try {
        for(let step=0;step<MAX_STEPS;step++) {
            const parent=await getRun(root.trace_id,root.user_id);
            if(!parent) return 'none';
            const summary=await loadBatchSummary(parent);
            const card=await batchCardMessage(parent);
            const action=nextBatchAction(parent,summary,card?.metadata?.practiceBatch?.status);
            if(action.kind==='generate') {
                const report=await generateBatchPosition(parent,action.index,summary);
                if(!report) return 'position-taken';
                // The retry worker owns a deferred run; this batch waits for it.
                if(report.status==='WAITING_PROVIDER') return 'waiting';
                continue;
            }
            if(action.kind==='publish') {
                await publishExerciseBatch(parent,parent.user_id);
                return 'published';
            }
            if(action.kind==='fail') {
                await markBatchFailed(parent);
                console.warn(`[ExerciseBatchWorker] batch ${parent.trace_id} closed as failed (${action.reason}).`);
                return 'failed';
            }
            return action.kind;
        }
        return 'step-limit';
    } finally {
        sessionLock.release(root.session_id,true);
    }
}

export async function runExerciseBatchWorker() {
    if(scanning) return;
    scanning=true;
    try {
        if(!(await getTutorAvailability()).enabled) return;
        const roots=await pendingBatchRoots();
        for(const root of roots) {
            if(inFlight.size>=MAX_PARALLEL) break;
            if(inFlight.has(root.trace_id)) continue;
            inFlight.add(root.trace_id);
            void advanceBatch(root)
                .catch(error=>console.warn('[ExerciseBatchWorker] Warning advancing batch',root.trace_id,error?.message||error))
                .finally(()=>inFlight.delete(root.trace_id));
        }
    } catch(error:any) {
        console.warn('[ExerciseBatchWorker] Warning scanning batches:',error?.message||error);
    } finally {
        scanning=false;
    }
}

let started=false;
/** Start a scan now (e.g. right after a batch root was created) instead of at the next tick. */
export function wakeBatchWorker() {
    if(started) setImmediate(()=>{void runExerciseBatchWorker();});
}

export function startExerciseBatchWorker() {
    // Off switch for a backend that must not generate batches (e.g. a local backend pointed at a shared database).
    if(process.env.ADAPTIVE_BATCH_WORKER==='off') {
        console.warn('[ExerciseBatchWorker] disabled by ADAPTIVE_BATCH_WORKER=off');
        return;
    }
    started=true;
    const timer=setInterval(()=>{void runExerciseBatchWorker();},TICK_MS);
    timer.unref();
    void runExerciseBatchWorker();
}
