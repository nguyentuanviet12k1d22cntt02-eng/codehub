import { consumeSse } from './sse';
import { wakeBatchWorker } from './exerciseBatchWorker';
import { internalHeaders, mergeReviewReport, resumeCheckpoint, reviewCheckpoint, verifiedTargetConcept } from './adaptiveEvidence';
import { claimRetry, deferRun, dueRetries, ensureBatchPositionIndex, finishRetryRun, saveStage, sweepOrphanRuns } from './adaptiveRepository';
import { AI_SERVICE_BUSY, AI_SERVICE_BUSY_FINAL_REPLY, aiServiceBusyReport, isRetryableProviderFailure, providerRetryDelay, syncBatchProgressMessage, upstreamPipelineTimeoutMs, waitingProviderReply } from './adaptive.controller';

let active=false;

async function retryRun(row:any) {
    // Pass a server-owned report only.  The Python service reuses it solely
    // when the stored schema, constraints and sandbox receipts are all valid.
    const priorRecords=Array.isArray(row.report?.agent_traces)?row.report.agent_traces:[];
    const sequenceOffset=priorRecords.reduce((highest:number,record:any)=>Math.max(highest,Number(record.sequence)||0),0);
    const isReviewMode=row.request?.review_mode===true;
    const checkpoint=isReviewMode?reviewCheckpoint(row.report):resumeCheckpoint(row.report);
    const targetConceptId=row.request?.target_concept_id || verifiedTargetConcept(row.report);
    const body=JSON.stringify({...row.request,
        ...(targetConceptId?{target_concept_id:targetConceptId}:{}),
        resume_report:checkpoint,run_attempt:Number(row.retry_count||0)+1,sequence_offset:sequenceOffset});
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),upstreamPipelineTimeoutMs);
    let report:any;
    try {
        // The receiver intentionally limits signed internal bodies. Do not
        // drop any verified output to fit this boundary; report it explicitly.
        if(Buffer.byteLength(body,'utf8')>150000) throw Error('RESUME_CHECKPOINT_TOO_LARGE');
        const response=await fetch((process.env.AI_SERVICE_URL||'http://127.0.0.1:8000')+'/pal-net/adaptive-tutor-agent/stream',
            {method:'POST',headers:internalHeaders(body),body,signal:controller.signal});
        if(response.status===413) throw Error('RESUME_CHECKPOINT_TOO_LARGE');
        if(response.status===429) {
            // AI vẫn đang đủ luồng: giữ yêu cầu, xếp lịch thử lại như lỗi provider tạm thời.
            await response.body?.cancel().catch(()=>{});
            report=aiServiceBusyReport(row.trace_id);
        } else {
            if(!response.ok||!response.body) throw Error('AI_SERVICE_HTTP_'+response.status);
            await consumeSse(response.body,async event=>{
                if(event.type==='agent_step'&&event.record) await saveStage(row.trace_id,event.record);
                else if(event.type==='complete') report=event.data;
                else if(event.type==='error') throw Error(event.error||'AI_STREAM_FAILED');
            });
            if(!report||report.trace_id!==row.trace_id) throw Error('AI_STREAM_INCOMPLETE');
            if(report.exercise && (report.status!=='SUCCEEDED'||!report.agent_traces?.some((step:any)=>
                step.agent==='PublicationGate'&&step.status==='SUCCEEDED'&&step.output?.approved===true))) throw Error('PUBLICATION_GATE_MISSING');
        }
    } catch(error:any) {
        const errorCode=error?.message==='RESUME_CHECKPOINT_TOO_LARGE'?'RESUME_CHECKPOINT_TOO_LARGE':error.name==='AbortError'?'RUN_DEADLINE_EXCEEDED':'TRANSPORT_OR_STORAGE_ERROR';
        report={trace_id:row.trace_id,schema_version:'4.0',status:'FAILED',exercise:null,agent_traces:[],fallback_used:false,
            reply:'Lần thử lại chưa hoàn thành; yêu cầu vẫn được lưu.',error:{code:errorCode,message:error.message}};
    } finally { clearTimeout(timer); }
    const merged=isReviewMode?mergeReviewReport(row.report,report):
        {...report,agent_traces:[...(row.report?.agent_traces||[]),...(report.agent_traces||[])]};
    if(isRetryableProviderFailure(report.error?.code)&&row.retry_count<2) {
        await deferRun(row.trace_id,{...merged,status:'WAITING_PROVIDER',reply:waitingProviderReply(report.error?.code,'Provider chưa sẵn sàng; yêu cầu được xếp lịch thử lại.')},providerRetryDelay(report.error,row.retry_count));
    } else {
        await finishRetryRun(row.trace_id,row.session_id,
            report.error?.code===AI_SERVICE_BUSY?{...merged,reply:AI_SERVICE_BUSY_FINAL_REPLY}:merged);
        // A batch position finished by the worker must update the batch card too.
        if(merged.status==='SUCCEEDED'&&row.request?.batch_parent_trace_id)
            await syncBatchProgressMessage(row.request.batch_parent_trace_id,row.user_id).catch(()=>{});
        // The batch worker continues (or closes) the batch now instead of at its next tick.
        if(row.request?.batch_parent_trace_id) wakeBatchWorker();
    }
}

const ORPHAN_SWEEP_INTERVAL_MS=60*1000;
let lastOrphanSweep=0;

export async function retryAdaptiveRuns() {
    if(active) return;
    active=true;
    try {
        // Close runs orphaned by a restart first: the batch-position index cannot be
        // created while two orphaned RUNNING rows still share a position.
        if(Date.now()-lastOrphanSweep>=ORPHAN_SWEEP_INTERVAL_MS) {
            lastOrphanSweep=Date.now();
            await sweepOrphanRuns().catch(err=>console.warn('[AdaptiveRetryWorker] Warning sweeping orphaned runs:', err?.message || err));
            await ensureBatchPositionIndex();
        }
        const candidates = await dueRetries().catch(err => {
            console.warn('[AdaptiveRetryWorker] Warning fetching due retries:', err?.message || err);
            return [];
        });
        for(const candidate of candidates) {
            const row=await claimRetry(candidate.trace_id).catch(() => null);
            if(row) await retryRun(row).catch(err => {
                console.warn('[AdaptiveRetryWorker] Warning in retryRun:', err?.message || err);
            });
        }
    } catch(err: any) {
        console.warn('[AdaptiveRetryWorker] Unexpected error in retry loop:', err?.message || err);
    } finally { active=false; }
}

export function startAdaptiveRetryWorker() {
    const timer=setInterval(()=>{retryAdaptiveRuns().catch(error=>console.warn('adaptive retry worker',error));},10000);
    timer.unref();
    void retryAdaptiveRuns().catch(error=>console.warn('adaptive retry worker initial run',error));
}
