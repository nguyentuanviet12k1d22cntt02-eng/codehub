import { useEffect, useState } from 'react';
import { Download, CheckCircle2, AlertCircle, Clock3, ChevronDown } from 'lucide-react';
import { API_BASE_URL } from '../../../config/api';

export interface AgentEvidence {
    id?: string; sequence?: number; agent: string; method?: string; status?: string; attempt?: number;
    run_attempt?: number; stage_attempt?: number;
    started_at?: string; ended_at?: string; duration_ms?: number; input_hash?: string; output_hash?: string;
    output?: unknown; error?: {code?: string; message?: string};
    model_calls?: {provider?: string; model?: string; status?: string; duration_ms?: number; response_id?: string; usage?: unknown; error_code?: string}[];
}
export interface PipelineSummary {trace_id: string; status: string; schema_version?: string; error?: {code?: string}}
const labels:Record<string,string>={IntentRouterAgent:'Hiểu yêu cầu',AdaptiveExercisePlanner:'Chọn mục tiêu và độ khó',
    KnowledgeRetrievalService:'Tra cứu học liệu',ExplanationTutorAgent:'Biên soạn lý thuyết',ExerciseGeneratorAgent:'Sinh đề và bộ test',
    SchemaValidator:'Kiểm tra cấu trúc',ConstraintValidator:'Kiểm tra ràng buộc',SandboxValidator:'Chạy nghiệm mẫu',
    ResumeCheckpointAgent:'Dùng lại candidate đã kiểm định',CriticEvaluatorAgent:'Thẩm định nội dung',PublicationGate:'Kiểm tra điều kiện phát hành',GeneralChatAgent:'Trả lời hội thoại',LearnerStateService:'Đọc bằng chứng học tập'};
const statuses:Record<string,string>={RUNNING:'Đang chạy',WAITING_PROVIDER:'Đang chờ provider để thử lại',SUCCEEDED:'Hoàn thành',REJECTED:'Chưa đạt',FAILED:'Lỗi'};

export function AgentEvidencePanel({records,pipeline}:{records:AgentEvidence[];pipeline?:PipelineSummary}) {
    const [error,setError]=useState('');
    const [downloading,setDownloading]=useState(false);
    const [latest,setLatest]=useState<{records:AgentEvidence[];pipeline:PipelineSummary}|null>(null);
    useEffect(()=>{
        setLatest(null);
        if(!pipeline?.trace_id||pipeline.status!=='WAITING_PROVIDER') return;
        let cancelled=false;
        let timer:number|undefined;
        const refresh=async()=>{
            try {
                const response=await fetch(API_BASE_URL+'/api/learning-path/adaptive/runs/'+encodeURIComponent(pipeline.trace_id),
                    {headers:{Authorization:'Bearer '+localStorage.getItem('token')}});
                if(!response.ok||cancelled) return;
                const report=(await response.json()).data;
                if(cancelled||!report) return;
                setLatest({records:Array.isArray(report.agent_traces)?report.agent_traces:[],pipeline:{trace_id:report.trace_id,status:report.status,error:report.error,schema_version:report.schema_version}});
                if(report.status==='WAITING_PROVIDER') timer=window.setTimeout(refresh,10000);
            } catch {
                if(!cancelled) timer=window.setTimeout(refresh,10000);
            }
        };
        void refresh();
        return ()=>{cancelled=true;if(timer!==undefined)window.clearTimeout(timer);};
    },[pipeline?.status,pipeline?.trace_id]);
    const activePipeline=latest?.pipeline||pipeline;
    const activeRecords=latest?.records||records;
    const sorted=[...activeRecords].sort((a,b)=>(a.sequence||0)-(b.sequence||0)||new Date(a.started_at||0).getTime()-new Date(b.started_at||0).getTime());
    const calls=activeRecords.flatMap(r=>r.model_calls||[]);
    const completed=activeRecords.filter(r=>r.status==='SUCCEEDED').length;
    const download=async(full=false)=>{
        setDownloading(true);setError('');
        try {
            let report:unknown={pipeline:activePipeline,agent_traces:sorted};
            if(activePipeline?.trace_id) {
                const response=await fetch(API_BASE_URL+'/api/learning-path/adaptive/runs/'+encodeURIComponent(activePipeline.trace_id)+(full?'?full=true':''),
                    {headers:{Authorization:'Bearer '+localStorage.getItem('token')}});
                if(!response.ok) throw new Error(response.status===403?'Báo cáo đầy đủ cần tài khoản quản trị.':'Không tải được báo cáo đã lưu.');
                report=(await response.json()).data;
            }
            const blob=new Blob([JSON.stringify(report,null,2)],{type:'application/json;charset=utf-8'});
            const url=URL.createObjectURL(blob),link=document.createElement('a');
            link.href=url;link.download=(activePipeline?.trace_id||'agent-evidence')+(full?'-full':'')+'.json';
            link.style.display='none';document.body.appendChild(link);link.click();link.remove();
            setTimeout(()=>URL.revokeObjectURL(url),1000);
        } catch(e) {setError(e instanceof Error?e.message:'Không tải được báo cáo');}
        finally {setDownloading(false);}
    };
    return <section aria-label="Dẫn chứng hoạt động pipeline" className="mt-4 w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 text-slate-800">
        <div className="flex flex-wrap items-start justify-between gap-3 p-3">
            <div>
                <p className="text-sm font-semibold">Dẫn chứng hoạt động</p>
                <p className="mt-1 text-xs text-slate-600">{completed}/{activeRecords.length} bước hoàn thành · {calls.filter(c=>c.status==='SUCCEEDED').length} lời gọi mô hình thành công</p>
                {activePipeline && <p className="mt-1 break-all font-mono text-[10px] text-slate-500">{activePipeline.trace_id} · {statuses[activePipeline.status]||activePipeline.status}</p>}
            </div>
            <div className="flex flex-wrap gap-2">
                <button type="button" disabled={downloading} onClick={()=>download()} className="flex min-h-9 items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 text-xs font-medium focus-visible:outline-2 focus-visible:outline-blue-600 disabled:opacity-50">
                    <Download size={14} aria-hidden="true"/>Tải JSON
                </button>
                <button type="button" disabled={downloading} onClick={()=>download(true)} className="min-h-9 rounded-lg px-2 text-xs text-blue-700 underline focus-visible:outline-2 focus-visible:outline-blue-600">Báo cáo quản trị</button>
            </div>
        </div>
        {activePipeline?.error?.code && <p role="status" className={'mx-3 mb-3 rounded-lg p-2 text-xs '+(activePipeline.status==='WAITING_PROVIDER'?'bg-amber-50 text-amber-800':'bg-rose-50 text-rose-800')}>Mã lỗi: {activePipeline.error.code}. {activePipeline.status==='WAITING_PROVIDER'?'Yêu cầu được lưu và sẽ tự thử lại; bài chưa được phát hành.':'Bài chưa được phát hành.'}</p>}
        {error && <p role="alert" className="px-3 pb-3 text-xs text-rose-700">{error}</p>}
        <ol className="divide-y divide-slate-200">
            {sorted.map((record,index)=>{
                const failed=record.status==='FAILED'||record.status==='REJECTED';
                const Icon=failed?AlertCircle:record.status==='SUCCEEDED'?CheckCircle2:Clock3;
                return <li key={record.id||index}>
                    <details className="group">
                        <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 p-3 focus-visible:outline-2 focus-visible:outline-blue-600">
                            <Icon aria-hidden="true" size={16} className={failed?'shrink-0 text-rose-600':record.status==='SUCCEEDED'?'shrink-0 text-emerald-700':'shrink-0 text-slate-500'}/>
                            <span className="min-w-0 flex-1 text-xs font-medium">{labels[record.agent]||record.agent}
                                <span className="ml-1 font-normal text-slate-500">· Lần chạy {record.run_attempt||1} · Sửa lần {record.stage_attempt||record.attempt||1}</span>
                            </span>
                            <span className="text-[10px] text-slate-600">{statuses[record.status||'']||'Bản ghi cũ'}{record.duration_ms!==undefined?' · '+record.duration_ms+' ms':''}</span>
                            <ChevronDown size={14} aria-hidden="true" className="shrink-0 transition-transform group-open:rotate-180"/>
                        </summary>
                        <div className="space-y-2 px-3 pb-3 text-xs">
                            <p><span className="font-semibold">{record.agent}</span> · {record.method||'Chưa ghi phương thức'}</p>
                            {record.started_at&&<p className="text-slate-600">{new Date(record.started_at).toLocaleString('vi-VN')}{record.ended_at?' → '+new Date(record.ended_at).toLocaleTimeString('vi-VN'):''}</p>}
                            {(record.model_calls||[]).map((call,i)=><div key={i} className="rounded-lg border border-slate-200 bg-white p-2">
                                <p className="break-all font-medium">{call.provider} / {call.model||'Chưa chọn được model'}</p>
                                <p>{statuses[call.status||'']||call.status} · {call.duration_ms??0} ms{call.error_code?' · '+call.error_code:''}</p>
                                {call.response_id&&<p className="break-all text-[10px] text-slate-500">Response ID: {call.response_id}</p>}
                                {Boolean(call.usage)&&<pre className="overflow-auto whitespace-pre-wrap text-[10px]">{JSON.stringify(call.usage,null,2)}</pre>}
                            </div>)}
                            {record.error&&<p className="rounded bg-rose-50 p-2 text-rose-800">{record.error.code}: {record.error.message}</p>}
                            {record.output!==undefined&&<pre className="max-h-80 max-w-full overflow-auto whitespace-pre-wrap [overflow-wrap:anywhere] rounded-lg border border-slate-200 bg-white p-3 font-mono text-[11px] leading-relaxed">{JSON.stringify(record.output,null,2)}</pre>}
                            {record.input_hash&&<p className="break-all font-mono text-[10px] text-slate-500">Input SHA-256: {record.input_hash}</p>}
                            {record.output_hash&&<p className="break-all font-mono text-[10px] text-slate-500">Output SHA-256: {record.output_hash}</p>}
                        </div>
                    </details>
                </li>;
            })}
        </ol>
    </section>;
}
