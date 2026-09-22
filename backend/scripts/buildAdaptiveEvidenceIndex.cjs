// Consolidates previously captured real runs. It never calls a model or fabricates evidence.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict');
const root=path.resolve(__dirname,'../../reviews/ai-pipeline');
const languages=['python','javascript','cpp','sql'];
const read=name=>JSON.parse(fs.readFileSync(path.join(root,name),'utf8'));
const hash=name=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,name))).digest('hex');
const files=[];
const add=name=>{files.push({file:name,sha256:hash(name),bytes:fs.statSync(path.join(root,name)).size});};
const runs=languages.map(language=>{
  const fullName=language+'-live-report.json',publicName=language+'-public-report.json';
  const gradingName=language+'-grading.json',smokeName=language+'-docker-smoke.json';
  const report=read(fullName),publicReport=read(publicName),grading=read(gradingName),smoke=read(smokeName);
  assert.equal(report.status,'SUCCEEDED',language+' pipeline must succeed');
  assert.equal(report.fallback_used,false,language+' must never use fallback');
  assert.ok(report.agent_traces.some(r=>r.agent==='PublicationGate'&&r.status==='SUCCEEDED'&&r.output?.approved===true),language+' publication gate');
  const modelCalls=report.agent_traces.flatMap(r=>r.model_calls||[]);
  assert.ok(modelCalls.filter(c=>c.status==='SUCCEEDED').length>=3,language+' real model calls');
  assert.ok(!JSON.stringify(publicReport).includes('reference_solution'),language+' public report hides solution');
  assert.ok(!JSON.stringify(publicReport).includes('fixture_sql'),language+' public report hides SQL fixtures');
  assert.equal(grading.correct.isPassed,true,language+' correct solution passes');
  assert.equal(grading.wrong.isPassed,false,language+' wrong solution fails');
  assert.equal(grading.repeated.adaptiveFeedback.delta,0,language+' repeated pass has no mastery gain');
  assert.equal(smoke.kind,'REAL_DOCKER_SMOKE');
  assert.equal(smoke.result?.passed,true,language+' Docker smoke');
  [fullName,publicName,gradingName,smokeName].forEach(add);
  return {
    language,trace_id:report.trace_id,status:report.status,artifact_hash:report.exercise?.artifact_hash,
    stages:report.agent_traces.map(r=>({sequence:r.sequence,agent:r.agent,attempt:r.attempt,status:r.status,duration_ms:r.duration_ms})),
    model_calls:modelCalls.map(c=>({stage:c.stage,provider:c.provider,model:c.model,response_id:c.response_id,status:c.status,duration_ms:c.duration_ms,usage:c.usage,error_code:c.error_code})),
    checks:{no_fallback:true,publication_gate:true,public_report_protects_answers:true,real_correct_submission_passes:true,
      real_wrong_submission_fails:true,duplicate_mastery_gain_prevented:true,docker_smoke_passes:true}
  };
});
for(const name of ['cpp-first-attempt-failed.json','cpp-second-attempt-failed.json','sql-provider-timeout.json','sql-schema-repair-failed.json']) if(fs.existsSync(path.join(root,name))) add(name);
const result={schema_version:'1.0',kind:'REAL_PIPELINE_EVIDENCE_INDEX',generated_at:new Date().toISOString(),status:'PASSED',
  statement:'Four real provider pipelines completed without fallback; every published artifact passed deterministic validation, Docker execution and critic review.',
  runs,retained_failures:files.filter(f=>f.file.includes('failed')||f.file.includes('timeout')),files};
const encoded=JSON.stringify(result,null,2);
fs.writeFileSync(path.join(root,'final-verification-summary.json'),encoded);
fs.writeFileSync(path.join(root,'live-summary.json'),encoded);
console.log(JSON.stringify({status:result.status,runs:runs.map(r=>({language:r.language,trace_id:r.trace_id,stages:r.stages.length,model_calls:r.model_calls.length}))}));
