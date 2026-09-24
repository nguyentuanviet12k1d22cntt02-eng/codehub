import { consumeSse } from './sse';
import { internalHeaders, resumeCheckpoint } from './adaptiveEvidence';
import { claimRetry, deferRun, dueRetries, finishRun, saveStage } from './adaptiveRepository';
import { isRetryableProviderFailure, providerRetryDelay, upstreamPipelineTimeoutMs } from './adaptive.controller';

let active=false;

async function retryRun(row:any) {
    // Pass a server-owned report only.  The Python service reuses it solely
    // when the stored schema, constraints and sandbox receipts are all valid.
    const priorRecords=Array.isArray(row.report?.agent_traces)?row.report.agent_traces:[];
    const sequenceOffset=priorRecords.reduce((highest:number,record:any)=>Math.max(highest,Number(record.sequence)||0),0);
    const checkpoint=resumeCheckpoint(row.report);
    const body=JSON.stringify({...row.request,resume_report:checkpoint,run_attempt:Number(row.retry_count||0)+1,sequence_offset:sequenceOffset});
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
        if(!response.ok||!response.body) throw Error('AI_SERVICE_HTTP_'+response.status);
        await consumeSse(response.body,async event=>{
            if(event.type==='agent_step'&&event.record) await saveStage(row.trace_id,event.record);
            else if(event.type==='complete') report=event.data;
            else if(event.type==='error') throw Error(event.error||'AI_STREAM_FAILED');
        });
        if(!report||report.trace_id!==row.trace_id) throw Error('AI_STREAM_INCOMPLETE');
    } catch(error:any) {
        const errorCode=error?.message==='RESUME_CHECKPOINT_TOO_LARGE'?'RESUME_CHECKPOINT_TOO_LARGE':error.name==='AbortError'?'RUN_DEADLINE_EXCEEDED':'TRANSPORT_OR_STORAGE_ERROR';
        report={trace_id:row.trace_id,schema_version:'4.0',status:'FAILED',exercise:null,agent_traces:[],fallback_used:false,
            reply:'Lần thử lại chưa hoàn thành; yêu cầu vẫn được lưu.',error:{code:errorCode,message:error.message}};
    } finally { clearTimeout(timer); }
    const merged={...report,agent_traces:[...(row.report?.agent_traces||[]),...(report.agent_traces||[])]};
    if(isRetryableProviderFailure(report.error?.code)&&row.retry_count<2) {
        await deferRun(row.trace_id,{...merged,status:'WAITING_PROVIDER',reply:'Provider chưa sẵn sàng; yêu cầu được xếp lịch thử lại.'},providerRetryDelay(report.error,row.retry_count));
    } else await finishRun(row.trace_id,merged);
}

export async function retryAdaptiveRuns() {
    if(active) return;
    active=true;
    try {
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
