export type Difficulty='EASY'|'MEDIUM'|'HARD';
export interface PythonPracticeDecision {
    schemaVersion:'module-practice-recommendation/2.0'; language:'PYTHON';
    mode:'PALNET_ADVISORY'|'RULE_BASED'|'MANUAL'|'COMPLETE'; reason:string; decisionId:string;
    context:{type:'MODULE_PRACTICE';course_id:string;module_id:string;module_code:string;bank_id:string;bank_code:string};
    cutoff:string; policyVersion:string; mappingVersion:string;
    catalogRevision:string|null; historyRevision:string|null; selectionRevision:string|null;
    exerciseId:string|null; contentVersion:string|null; title:string|null; difficulty:Difficulty|null; skillId:string|null;
    availableCount:number;firstOpportunityCount:number;retryCount:number;passedCount:number;quarantinedCount:number;totalCount:number;
    modelVersion:string|null;checkpointSha256:string|null;manifestSha256:string|null;graphVersion:string|null;featureVersion:string|null;modelPolicyVersion:string|null;
    predictedCorrectness:number|null;evaluationStatus:'SYNTHETIC_EXPLORATORY'|null;
}
export interface PilotPracticeDecision {mode:'PALNET_SYNTHETIC_MULTILINGUAL_PILOT';language:'JAVASCRIPT'|'CPP';exerciseId:string;title:string;difficulty:Difficulty;skillId:string;estimatedReadiness:number;availableCount:number}
export type LegacyPracticeStatus={mode:'MANUAL'|'COMPLETE';reason:string;schemaVersion?:never};
export type ModulePracticeRecommendation=PythonPracticeDecision|PilotPracticeDecision|LegacyPracticeStatus;
export type SelectedPracticeRecommendation=(PythonPracticeDecision&{mode:'PALNET_ADVISORY'|'RULE_BASED';exerciseId:string;title:string;difficulty:Difficulty;skillId:string})|PilotPracticeDecision;
export interface PracticeBank {id:string;lessonId:string;codingExercises?:{id:string;title?:string;difficulty?:string}[]}
export type RecommendationErrorCode='AUTH_REQUIRED'|'ACCESS_DENIED'|'BANK_NOT_FOUND'|'STALE_DECISION'|'INVALID_RECOMMENDATION'|'REQUEST_TIMEOUT'|'SERVICE_UNAVAILABLE'|'SESSION_CHANGED'|'BANK_CONTEXT_CHANGED';
export class RecommendationError extends Error {
    code:RecommendationErrorCode;
    constructor(code:RecommendationErrorCode){super(code);this.code=code;}
}
const object=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v);
const text=(v:unknown):v is string=>typeof v==='string'&&v.length>0;
const sha=(v:unknown)=>typeof v==='string'&&/^[a-f0-9]{64}$/.test(v);
const version=(v:unknown)=>typeof v==='string'&&/^python-content-v1:[a-f0-9]{64}$/.test(v);
const score=(v:unknown)=>typeof v==='number'&&Number.isFinite(v)&&v>=0&&v<=1;
export const isPythonPracticeDecision=(v:ModulePracticeRecommendation):v is PythonPracticeDecision=>'schemaVersion'in v&&v.schemaVersion==='module-practice-recommendation/2.0';
export const isPilotRecommendation=(v:ModulePracticeRecommendation):v is PilotPracticeDecision=>v.mode==='PALNET_SYNTHETIC_MULTILINGUAL_PILOT';
export function hasPracticeSelection(v:ModulePracticeRecommendation):v is SelectedPracticeRecommendation {
    return v.mode==='PALNET_ADVISORY'||v.mode==='RULE_BASED'||isPilotRecommendation(v);
}
export function parsePracticeRecommendation(raw:unknown):ModulePracticeRecommendation {
    const fail=()=>{throw new RecommendationError('INVALID_RECOMMENDATION');};
    if(!object(raw))return fail();const v=raw;
    if(v.schemaVersion===undefined){
        if((v.mode==='MANUAL'||v.mode==='COMPLETE')&&text(v.reason))return {mode:v.mode,reason:v.reason};
        if(v.mode==='PALNET_SYNTHETIC_MULTILINGUAL_PILOT'&&['JAVASCRIPT','CPP'].includes(String(v.language))&&text(v.exerciseId)&&text(v.title)&&['EASY','MEDIUM','HARD'].includes(String(v.difficulty))&&text(v.skillId)&&score(v.estimatedReadiness)&&Number.isInteger(v.availableCount)&&Number(v.availableCount)>0)return v as unknown as PilotPracticeDecision;
        return fail();
    }
    if(v.schemaVersion!=='module-practice-recommendation/2.0'||v.language!=='PYTHON'||!['PALNET_ADVISORY','RULE_BASED','MANUAL','COMPLETE'].includes(String(v.mode)))return fail();
    if(!object(v.context)||v.context.type!=='MODULE_PRACTICE'||!['course_id','module_id','module_code','bank_id','bank_code'].every(k=>text(v.context&&object(v.context)?v.context[k]:null)))return fail();
    if(!/^MOD-0[1-8]$/.test(String(v.context.module_code))||!/^LS-0[1-8]\.MP(?:_FOR|_WHILE)?$/.test(String(v.context.bank_code)))return fail();
    if(!['reason','decisionId','policyVersion','mappingVersion','cutoff'].every(k=>text(v[k]))||!Number.isFinite(Date.parse(String(v.cutoff)))||!/(Z|[+-]\d\d:\d\d)$/.test(String(v.cutoff)))return fail();
    for(const k of ['catalogRevision','historyRevision','selectionRevision'])if(v[k]!==null&&!sha(v[k]))return fail();
    const counts=['availableCount','firstOpportunityCount','retryCount','passedCount','quarantinedCount','totalCount'];
    if(!counts.every(k=>Number.isSafeInteger(v[k])&&Number(v[k])>=0)||v.availableCount!==Number(v.firstOpportunityCount)+Number(v.retryCount)||v.totalCount!==Number(v.availableCount)+Number(v.passedCount)+Number(v.quarantinedCount))return fail();
    const selected=v.mode==='PALNET_ADVISORY'||v.mode==='RULE_BASED';
    if(selected){if(!text(v.exerciseId)||!text(v.title)||!text(v.skillId)||!version(v.contentVersion)||!['EASY','MEDIUM','HARD'].includes(String(v.difficulty))||Number(v.availableCount)<1||!['catalogRevision','historyRevision','selectionRevision'].every(k=>sha(v[k])))return fail();}
    else if(['exerciseId','title','skillId','contentVersion','difficulty'].some(k=>v[k]!==null))return fail();
    if(v.mode==='COMPLETE'&&(v.reason!=='ALL_CURRENT_ELIGIBLE_PASSED'||!Number(v.totalCount)||v.passedCount!==v.totalCount||v.quarantinedCount!==0||!['catalogRevision','historyRevision','selectionRevision'].every(k=>sha(v[k]))))return fail();
    const modelFields=['modelVersion','checkpointSha256','manifestSha256','graphVersion','featureVersion','modelPolicyVersion','predictedCorrectness','evaluationStatus'];
    if(v.mode==='PALNET_ADVISORY'){
        if(v.reason!=='FIRST_OPPORTUNITY_MODEL_RANKED'||Number(v.firstOpportunityCount)<1||!modelFields.filter(k=>k!=='predictedCorrectness').every(k=>text(v[k]))||!sha(v.checkpointSha256)||!sha(v.manifestSha256)||!score(v.predictedCorrectness)||v.evaluationStatus!=='SYNTHETIC_EXPLORATORY')return fail();
    }else if(modelFields.some(k=>v[k]!==null))return fail();
    return v as unknown as PythonPracticeDecision;
}
export function bindPracticeRecommendation(value:ModulePracticeRecommendation,bank:PracticeBank,passed:ReadonlyMap<string,string>=new Map()):ModulePracticeRecommendation {
    if(isPythonPracticeDecision(value)){
        if(value.context.bank_id!==bank.id||value.context.bank_code!==bank.lessonId)throw new RecommendationError('INVALID_RECOMMENDATION');
        if(hasPracticeSelection(value)&&passed.get(value.exerciseId)===value.contentVersion)throw new RecommendationError('STALE_DECISION');
    }else if(bank.lessonId.startsWith('LS-'))throw new RecommendationError('INVALID_RECOMMENDATION');
    else if(isPilotRecommendation(value)&&((bank.lessonId.startsWith('CPP-')&&value.language!=='CPP')||(bank.lessonId.startsWith('JS')&&value.language!=='JAVASCRIPT')))throw new RecommendationError('INVALID_RECOMMENDATION');
    if(hasPracticeSelection(value)&&!bank.codingExercises?.some(e=>e.id===value.exerciseId))throw new RecommendationError('INVALID_RECOMMENDATION');
    return value;
}
export function committedPracticeVersion(data:unknown,bankId:string):string|null {
    if(!object(data)||data.success!==true||!text(data.submissionId)||!object(data.recommendationRefresh))return null;
    const h=data.recommendationRefresh;return h.schemaVersion==='module-practice-refresh/1.0'&&h.bankId===bankId&&h.submissionId===data.submissionId&&h.refreshRequired===true&&version(h.contentVersion)?String(h.contentVersion):null;
}
export const recommendationReason=(reason:string):string=>({
    FIRST_OPPORTUNITY_MODEL_RANKED:'AI đề xuất theo kỹ năng và các lượt làm đã được chấm.',COLD_START:'Bạn chưa có đủ lịch sử được xác minh. Bài được chọn theo độ khó và thứ tự học.',MODEL_DISABLED:'AI chưa được bật cho module này. Bạn vẫn luyện tập theo thứ tự phù hợp.',MODEL_UNAVAILABLE:'AI tạm thời chưa sẵn sàng. Hệ thống đã chọn bài bằng quy tắc.',MODEL_CONTRACT_INVALID:'Chưa thể sử dụng gợi ý AI. Hệ thống đã chọn bài bằng quy tắc.',SKILL_SUPPORT_GAP:'Một số kỹ năng chưa đủ dữ liệu AI. Bài được chọn theo thứ tự học.',HISTORY_UNVERIFIED:'Một số lượt làm chưa đủ bằng chứng để tự chọn bài. Bạn có thể luyện tập thủ công.',RETRY_RULE:'Bạn đã thử các bài mới. Hãy luyện lại bài chưa đạt gần nhất.',CATALOG_REVIEW_REQUIRED:'Bộ bài đang cần kiểm tra lại. Bạn có thể xem và chọn bài thủ công.',LEGACY_ATTEMPT_VERSION_UNVERIFIED:'Lịch sử cũ chưa xác minh được phiên bản bài. Bạn vẫn có thể chọn bài để luyện lại.',SUBMISSION_PENDING:'Một lượt nộp đang chờ kết quả. Hãy thử làm mới sau.',ALL_CURRENT_ELIGIBLE_PASSED:'Bạn đã hoàn thành tất cả bài được xác minh ở phiên bản hiện tại.',NO_ELIGIBLE_EXERCISES:'Chưa có bài đủ điều kiện để tự chọn. Bạn có thể xem danh sách bài.',NO_VERIFIED_EXERCISES:'Chưa có bài được xác minh để tự chọn. Bạn có thể xem danh sách bài.',LOCAL_MODEL_UNAVAILABLE:'Gợi ý AI tạm thời chưa sẵn sàng. Bạn vẫn có thể chọn bài thủ công.'}[reason]??'Chưa thể tự chọn bài lúc này. Bạn có thể làm mới hoặc luyện tập thủ công.');
export const recommendationErrorText=(code:RecommendationErrorCode):string=>({AUTH_REQUIRED:'Hãy đăng nhập để nhận đề xuất bài tập.',ACCESS_DENIED:'Bạn không có quyền nhận đề xuất của bộ bài này.',BANK_NOT_FOUND:'Không tìm thấy bộ bài. Hãy quay lại khóa học.',STALE_DECISION:'Dữ liệu bài làm vừa thay đổi. Hãy làm mới đề xuất.',INVALID_RECOMMENDATION:'Đề xuất không còn khớp bộ bài đang mở. Hãy làm mới trước khi tiếp tục.',REQUEST_TIMEOUT:'Tải đề xuất mất nhiều thời gian. Bạn có thể thử lại hoặc chọn bài thủ công.',SERVICE_UNAVAILABLE:'Chưa thể tải đề xuất. Bạn có thể thử lại hoặc chọn bài thủ công.',SESSION_CHANGED:'Phiên đăng nhập đã thay đổi. Hãy tải lại đề xuất.',BANK_CONTEXT_CHANGED:'Không thể xác định duy nhất bộ bài. Hãy chọn lại từ khóa học.'}[code]);
