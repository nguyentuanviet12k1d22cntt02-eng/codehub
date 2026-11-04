import {createHash} from 'crypto';
import {internalHeaders,verifyInternal} from '../adaptive/adaptiveEvidence';
/** Shared transport: no PilotCatalog, history queries or model-specific policy. */
export async function signedPalnetExchange(body:string,timeoutMs:number=1500):Promise<{result?:any;inputSha256:string;fallback:string|null}> {
 const inputSha256=createHash('sha256').update(body).digest('hex'),req=JSON.parse(body);
 const base=new URL(process.env.AI_SERVICE_URL||'http://127.0.0.1:8000');
 if(!['http:','https:'].includes(base.protocol)||base.username||base.password)throw Error('INVALID_MODEL_ENDPOINT');
 const response=await fetch(new URL('/internal/palnet/predict',base),{method:'POST',headers:internalHeaders(body),body,signal:AbortSignal.timeout(timeoutMs)});
 if(!response.ok)return {inputSha256,fallback:'MODEL_SERVICE_UNAVAILABLE'};
 const reader=response.body?.getReader();let bytes=0;const chunks:Uint8Array[]=[];
 if(reader){try{while(true){const chunk=await reader.read();if(chunk.done)break;bytes+=chunk.value.byteLength;if(bytes>100000){await reader.cancel();return {inputSha256,fallback:'MODEL_RESPONSE_SIGNATURE_INVALID'};}chunks.push(chunk.value);}}finally{reader.releaseLock();}}
 const raw=Buffer.concat(chunks);
 if(!verifyInternal(raw,response.headers.get('X-Adaptive-Time')??'',response.headers.get('X-Adaptive-Signature')??''))return {inputSha256,fallback:'MODEL_RESPONSE_SIGNATURE_INVALID'};
 const result=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(raw));
 if(!result||result.request_id!==req.request_id||result.user_id!==req.user_id||result.input_sha256!==inputSha256||!Number.isFinite(new Date(result.cutoff).getTime())||new Date(result.cutoff).getTime()!==new Date(req.cutoff).getTime())return {inputSha256,fallback:'MODEL_RESPONSE_CONTRACT_INVALID'};
 return {result,inputSha256,fallback:null};
}
