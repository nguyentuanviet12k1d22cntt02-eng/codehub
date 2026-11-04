"""R03 advisory runtime. Evidence is verified by the signed backend; no DB access here."""
import hashlib,json,math,os,threading
from pathlib import Path
from functools import lru_cache
import torch
from torch import nn
from app.recommendation.python70_runtime import Python70PAL,history_features
ROOT=Path(__file__).resolve().parents[2]
BUNDLE=ROOT/'models/python-module-practice-r03'
RELEASE=Path(__file__).with_name('module_practice_release.json')
RELEASE_SHA='2a6d87c7e134503d606b67355bea883528227c9441b398fb1bf2f861000b0898'
_slots=threading.BoundedSemaphore(2)
class ContractError(ValueError):pass
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def release():
    if sha(RELEASE)!=RELEASE_SHA:raise ValueError('RELEASE_INTEGRITY')
    return json.loads(RELEASE.read_text(encoding='utf-8'))
def module_enabled(module):
    if os.getenv('PALNET_MODULE_PRACTICE_ENABLED','false').lower()!='true':return False
    raw=os.getenv('PALNET_MODULE_PRACTICE_MODULES','')
    modules={s.strip() for s in raw.split(',') if s.strip()} if raw.strip() else {f'MOD-0{i}' for i in range(1,9)}
    if not modules<={f'MOD-0{i}' for i in range(1,9)}:raise ContractError('INVALID_MODULE_FLAG')
    return module in modules
class ModulePracticePAL(Python70PAL):
    def __init__(self):
        super().__init__(36);self.target_bias=nn.Embedding(36,1)
    def forward(self,target,summary,rates,adjacency):
        return super().forward(target,summary,rates,adjacency)+self.target_bias(target).squeeze(1)
def metadata():
    r=release();pins=r['pins'];m=json.loads((BUNDLE/'manifest.json').read_text(encoding='utf-8'))
    if sha(BUNDLE/'manifest.json')!=pins['manifest_sha256'] or m['architecture']!='python-module-practice-adapter/2.0' or m['evaluationStatus']!='SYNTHETIC_EXPLORATORY' or m['deploymentMode']!='ADVISORY':raise ValueError('MANIFEST_INTEGRITY')
    for file,key in [('checkpoint.pt','checkpointSha256'),('graph.json','graphSha256'),('mapping.json','mappingSha256'),('support.json','supportSha256')]:
        if sha(BUNDLE/file)!=m[key]:raise ValueError('BUNDLE_INTEGRITY')
    if m['skillIds']!=r['skill_ids'] or set(m['qualifiedSkillIds'])!=set(r['qualified_skill_ids']):raise ValueError('SUPPORT_INTEGRITY')
    mapping=json.loads((BUNDLE/'mapping.json').read_text(encoding='utf-8'))
    if sorted((x['exerciseId'],x['contentVersion'],x['primarySkillId']) for x in mapping['rows'])!=sorted((x['exercise_id'],x['content_version'],x['skill_id']) for x in r['rows']):raise ValueError('DOMAIN_INTEGRITY')
    return r,m
@lru_cache(maxsize=1)
def load(manifest_sha):
    r,m=metadata()
    if manifest_sha!=r['pins']['manifest_sha256']:raise ValueError('MODEL_CHANGED')
    c=torch.load(BUNDLE/'checkpoint.pt',map_location='cpu',weights_only=True)
    if c['skills']!=r['skill_ids'] or c['architecture']!=m['architecture'] or c['seed']!=m['trainingSeed'] or c['feature_version']!=m['featureVersion'] or c['mapping_sha256']!=m['mappingSha256']:raise ValueError('CHECKPOINT_METADATA')
    graph=json.loads((BUNDLE/'graph.json').read_text(encoding='utf-8'));index={s:i for i,s in enumerate(r['skill_ids'])};adj=torch.zeros((36,36))
    if graph['version']!='2.2' or [s['id'] for s in graph['skills']]!=r['skill_ids']:raise ValueError('GRAPH_ORDER')
    for e in graph['edges']:a,b=index[e['source']],index[e['target']];adj[a,b]=adj[b,a]=1
    net=ModulePracticePAL();net.load_state_dict(c['state_dict'],strict=True);net.eval();return net,adj,index

def validate_domain(payload,r):
    context=payload.context.model_dump()
    if context not in r['banks']:raise ContractError('CONTEXT_OUTSIDE_DOMAIN')
    if any(getattr(payload,k)!=v for k,v in r['pins'].items()) or payload.catalog_revision!=r['catalog_revision']:raise ContractError('PIN_MISMATCH')
    bank_skills={x['skill_id'] for x in r['rows'] if x['bank_id']==context['bank_id']}
    if not set(payload.target_skill_ids)<=bank_skills or not set(payload.target_skill_ids)<=set(r['qualified_skill_ids']):raise ContractError('TARGET_OUTSIDE_BANK_SUPPORT')

def features(payload,r):
    index={s:i for i,s in enumerate(r['skill_ids'])}
    if payload.summary is None:
        allowed={x['exercise_id']:x for x in r['rows']};seen=set()
        for e in payload.history:
            row=allowed.get(e.item_id)
            if e.event_id in seen or not row or e.content_version!=row['content_version'] or e.skill_id!=row['skill_id'] or e.feedback_ready_at>=payload.cutoff:raise ContractError('INVALID_HISTORY_SCOPE_OR_CUTOFF')
            seen.add(e.event_id)
        summaries,rates,used=history_features(payload.history,payload.cutoff,index)
        return summaries,rates,len(used),len(payload.history)
    s=payload.summary
    if s.skill_ids!=r['skill_ids'] or any(n and skill not in r['qualified_skill_ids'] for n,skill in zip(s.attempt_counts,s.skill_ids)):raise ContractError('INVALID_SUMMARY_SCOPE')
    total=s.history_count;success=sum(s.correct_counts);values=[]
    for n,c,e in zip(s.attempt_counts,s.correct_counts,s.ema):values.append([math.log1p(n),c/n if n else .5,e,math.log1p(total),success/total if total else .5])
    return torch.tensor(values,dtype=torch.float32),torch.tensor([(c+1)/(n+2) for n,c in zip(s.attempt_counts,s.correct_counts)],dtype=torch.float32),total,s.source_event_count

def infer(payload):
    r=release();validate_domain(payload,r);summary,rates,count,source_count=features(payload,r)
    common=dict(**r['pins'],evaluation_status='SYNTHETIC_EXPLORATORY',context=payload.context.model_dump(),catalog_revision=payload.catalog_revision,history_revision=payload.history_revision,history_count=count,source_event_count=source_count,cutoff=payload.cutoff.isoformat())
    if not module_enabled(payload.context.module_code):return dict(status='FALLBACK',reason='MODEL_DISABLED',probabilities={},**common)
    if not count:return dict(status='FALLBACK',reason='COLD_START',probabilities={},**common)
    metadata();net,adj,index=load(r['pins']['manifest_sha256'])
    # Give short bursts a bounded wait while keeping two concurrent forwards.
    if not _slots.acquire(timeout=1.0):
        raise RuntimeError('MODEL_BUSY')
    try:
        target=torch.tensor([index[s] for s in payload.target_skill_ids],dtype=torch.long)
        with torch.inference_mode():pred=torch.sigmoid(net(target,summary[target],rates.repeat(len(target),1),adj))
        if not torch.isfinite(pred).all() or (pred<0).any() or (pred>1).any():raise RuntimeError('INVALID_MODEL_PROBABILITY')
        return dict(status='READY',reason=None,probabilities=dict(zip(payload.target_skill_ids,pred.tolist())),**common)
    finally:_slots.release()
def runtime_status():
    try:
        if os.getenv('PALNET_MODULE_PRACTICE_ENABLED','false').lower()!='true':return {'available':False,'reason':'MODEL_DISABLED'}
        enabled=[f'MOD-0{i}' for i in range(1,9) if module_enabled(f'MOD-0{i}')]
        if not enabled:return {'available':False,'reason':'MODEL_DISABLED'}
        r,m=metadata();load(r['pins']['manifest_sha256']);return {'available':True,'modelVersion':m['modelVersion'],'featureVersion':m['featureVersion'],'graphVersion':'2.2','enabledModules':enabled,'qualifiedPrimarySkills':25,'deploymentMode':'ADVISORY','evaluationStatus':'SYNTHETIC_EXPLORATORY'}
    except (OSError,ValueError,RuntimeError,KeyError):return {'available':False,'reason':'MODEL_UNAVAILABLE'}
