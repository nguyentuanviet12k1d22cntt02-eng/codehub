import {randomUUID} from 'crypto';
import {hash} from '../adaptive/adaptiveEvidence';
import {moduleEnabled,moduleRelease,ModuleContext,sameContext} from './palnetModuleRelease';
import {loadModulePracticeSnapshot,ModuleSnapshot} from './palnetModuleHistory';
import {signedPalnetExchange} from './palnetTransport';
export interface ModuleAdvice {decisionId:string;context:ModuleContext;cutoff:string;catalogRevision:string|null;historyRevision:string|null;historyCount:number;sourceEventCount:number;probabilities:Record<string,number>;modelVersion:string|null;checkpointSha256:string|null;manifestSha256:string|null;graphVersion:string|null;mappingVersion:string|null;featureVersion:string|null;policyVersion:string|null;inputSha256:string|null;fallback:string|null}
function empty(context:ModuleContext,reason:string,decisionId:string=randomUUID(),cutoff=new Date().toISOString()):ModuleAdvice {
 return {decisionId,context,cutoff,catalogRevision:null,historyRevision:null,historyCount:0,sourceEventCount:0,probabilities:{},modelVersion:null,checkpointSha256:null,manifestSha256:null,graphVersion:null,mappingVersion:null,featureVersion:null,policyVersion:null,inputSha256:null,fallback:reason};
}
/** Consumes only a server-created verified snapshot. P4 owns access and candidate eligibility. */
export async function requestModulePracticeAdvice(snapshot:ModuleSnapshot,targets:string[],decisionId:string=randomUUID()):Promise<ModuleAdvice> {
 const no=(reason:string)=>({...empty(snapshot.context,reason,decisionId,snapshot.cutoff),catalogRevision:snapshot.catalogRevision,historyRevision:snapshot.historyRevision,historyCount:snapshot.summary.history_count,sourceEventCount:snapshot.summary.source_event_count});
 try{
  const release=moduleRelease();if(!release.banks.some(b=>sameContext(b,snapshot.context)))return no('CATALOG_REVIEW_REQUIRED');
  if(!moduleEnabled(snapshot.context.module_code))return no('MODEL_DISABLED');
  const bankSkills=new Set(release.rows.filter(r=>r.bank_id===snapshot.context.bank_id).map(r=>r.skill_id));
  if(!targets.length||new Set(targets).size!==targets.length||targets.some(s=>!bankSkills.has(s)||!release.qualified_skill_ids.includes(s)))return no('SKILL_SUPPORT_GAP');
  if(snapshot.catalogRevision!==release.catalog_revision)return no('CATALOG_REVIEW_REQUIRED');
  if(!snapshot.summary.history_count)return no(snapshot.rawEventCount?'HISTORY_UNVERIFIED':'COLD_START');
  if(snapshot.summary.cutoff!==snapshot.cutoff||snapshot.summary.history_revision!==snapshot.historyRevision||snapshot.summary.catalog_revision!==snapshot.catalogRevision)return no('HISTORY_UNVERIFIED');
  const body=JSON.stringify({schema_version:'palnet-advisory-request/2.0',request_id:decisionId,user_id:snapshot.owner,language:'PYTHON',context:snapshot.context,...release.pins,cutoff:snapshot.cutoff,catalog_revision:snapshot.catalogRevision,history_revision:snapshot.historyRevision,target_skill_ids:targets,summary:snapshot.summary});
  const configured=Number(process.env.PALNET_MODULE_PRACTICE_TIMEOUT_MS||5000);if(!Number.isInteger(configured)||configured<100||configured>60000)return no('MODEL_CONTRACT_INVALID');
  const reply=await signedPalnetExchange(body,configured);if(reply.fallback)return no(reply.fallback);
  const v=reply.result;
  if(Object.entries(release.pins).some(([k,value])=>v[k]!==value)||v.evaluation_status!=='SYNTHETIC_EXPLORATORY'||hash(v.context)!==hash(snapshot.context)||v.catalog_revision!==snapshot.catalogRevision||v.history_revision!==snapshot.historyRevision||v.history_count!==snapshot.summary.history_count||v.source_event_count!==snapshot.summary.source_event_count)return no('MODEL_RESPONSE_CONTRACT_INVALID');
  if(v.status==='FALLBACK')return no(['MODEL_DISABLED','COLD_START'].includes(v.reason)&&v.probabilities&&Object.keys(v.probabilities).length===0?v.reason:'MODEL_RESPONSE_CONTRACT_INVALID');
  if(v.status!=='READY'||v.reason!==null||!v.probabilities||Array.isArray(v.probabilities)||typeof v.probabilities!=='object'||Object.keys(v.probabilities).length!==targets.length||!targets.every(k=>typeof v.probabilities[k]==='number'&&Number.isFinite(v.probabilities[k])&&v.probabilities[k]>=0&&v.probabilities[k]<=1))return no('MODEL_RESPONSE_CONTRACT_INVALID');
  return {...no(''),probabilities:v.probabilities,modelVersion:v.model_version,checkpointSha256:v.checkpoint_sha256,manifestSha256:v.manifest_sha256,graphVersion:v.graph_version,mappingVersion:v.mapping_version,featureVersion:v.feature_version,policyVersion:v.policy_version,inputSha256:reply.inputSha256,fallback:null};
 }catch{return no('MODEL_UNAVAILABLE');}
}
export async function getModulePracticeAdvice(db:any,owner:string,context:ModuleContext,targets:string[]):Promise<ModuleAdvice> {
 const id=randomUUID();try{if(!moduleEnabled(context.module_code))return empty(context,'MODEL_DISABLED',id);const snapshot=await loadModulePracticeSnapshot(db,owner,context);return requestModulePracticeAdvice(snapshot,targets,id);}catch(error:any){return empty(context,error?.message==='CATALOG_REVIEW_REQUIRED'?'CATALOG_REVIEW_REQUIRED':'HISTORY_SNAPSHOT_UNAVAILABLE',id);}
}
