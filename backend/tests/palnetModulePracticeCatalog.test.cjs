const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { loadPinned, json, hashFile, sha, assessReference } = require('../scripts/palnet_p1_common.cjs');
const { validateCatalog, matchCurrentExercise } = require('../scripts/palnet_module_practice_schema.cjs');
const { prerequisiteSkills } = require('../scripts/build_palnet_module_practice_catalog.cjs');
const pinned = loadPinned();
const catalog = json('backend/src/infrastructure/data/pythonModulePracticeMapping.v1.json');
const clone = () => structuredClone(catalog);
const byKey = key => catalog.rows.find(r => r.sourceKey === key);
const context = row => ({ courseId:row.courseId,lessonContentId:row.lessonContentId,bankCode:row.bankCode,moduleCode:row.moduleCode });

test('all 208 exact IDs/versions/context have one graph primary and reviewed provenance', () => {
  assert.equal(validateCatalog(catalog,pinned.graph,pinned.rows).rows.length,208);
  assert.equal(new Set(catalog.rows.map(r=>r.bankCode)).size,9);
  assert.equal(new Set(catalog.rows.map(r=>r.moduleCode)).size,8);
  assert.ok(catalog.rows.every(r=>r.modelSupport==='P2_NOT_EVALUATED'));
  assert.equal(catalog.automaticRecommendationEnabled,false);
});
test('mapping follows required operations rather than module/title majority', () => {
  assert.equal(byKey('LS-08.MP:011').primarySkillId,'PY-BASICS-03');
  assert.equal(byKey('LS-08.MP:024').primarySkillId,'PY-OOP-01');
  assert.equal(byKey('LS-08.MP:015').primarySkillId,'PY-OOP-04');
  assert.equal(byKey('LS-05.MP:014').primarySkillId,'PY-LIST-03');
  assert.equal(byKey('LS-05.MP:027').primarySkillId,'PY-FLOW-03');
  assert.ok(byKey('LS-07.MP:017').contentReview.issues.includes('REQUIRED_RECURSION_CONCEPT_NOT_IN_GRAPH'));
});
test('unknown or multiple primary skills cannot validate', () => {
  let bad=clone();bad.rows[0].primarySkillId='PY-FAKE-99';assert.throws(()=>validateCatalog(bad,pinned.graph),/UNKNOWN_GRAPH_SKILL/);
  bad=clone();bad.rows[0].primarySkillId=['PY-BASICS-01','PY-BASICS-03'];assert.throws(()=>validateCatalog(bad,pinned.graph));
});
test('duplicate identity, duplicate secondary, invented eligibility fail closed', () => {
  let bad=clone();bad.rows[1].exerciseId=bad.rows[0].exerciseId;assert.throws(()=>validateCatalog(bad,pinned.graph),/DUPLICATE/);
  bad=clone();bad.rows[0].secondarySkillIds.push(bad.rows[0].primarySkillId);assert.throws(()=>validateCatalog(bad,pinned.graph),/SELF_SKILL/);
  bad=clone();const excluded=bad.rows.find(r=>r.eligibility==='EXCLUDED');excluded.eligibility='P1_ELIGIBLE';assert.throws(()=>validateCatalog(bad,pinned.graph),/ELIGIBILITY/);
});
test('snapshot rejects stale contentVersion and misplaced bank', () => {
  let bad=clone();bad.rows[0].contentVersion='python-content-v1:'+'0'.repeat(64);assert.throws(()=>validateCatalog(bad,pinned.graph,pinned.rows),/DRIFT/);
  bad=clone();bad.rows[0].bankCode='LS-08.MP';assert.throws(()=>validateCatalog(bad,pinned.graph,pinned.rows),/DRIFT/);
});
test('current content, reference change and wrong owner context cannot reuse eligibility', () => {
  const row=byKey('LS-01.MP:001'),seed=pinned.rows.find(r=>r.exerciseId===row.exerciseId).seed;
  assert.equal(matchCurrentExercise(row,seed,row.contentVersion,context(row)).eligible,true);
  assert.equal(matchCurrentExercise(row,{...seed,solutionCode:seed.solutionCode+'\n# changed'},row.contentVersion,context(row)).eligible,false);
  assert.equal(matchCurrentExercise(row,seed,'python-content-v1:'+'0'.repeat(64),context(row)).eligible,false);
  assert.equal(matchCurrentExercise(row,seed,row.contentVersion,{...context(row),courseId:'wrong'}).eligible,false);
});
test('blank output keeps meaning; leading/trailing spaces and arbitrary prefix are significant', () => {
  const evaluate=(actual,expected,status='SUCCESS')=>assessReference({testCases:[{input:'',expectedOutput:expected}]},[{stdout:actual,stderr:'',status,runtimeMs:1}]).status;
  assert.equal(evaluate('\r\n',''),'PASS');
  assert.equal(evaluate(' \n',''),'REFERENCE_TEST_MISMATCH');
  assert.equal(evaluate('value \n','value\n'),'REFERENCE_TEST_MISMATCH');
  assert.equal(evaluate(' value\n','value\n'),'REFERENCE_TEST_MISMATCH');
  assert.equal(evaluate('garbagevalue\n','value\n'),'REFERENCE_TEST_MISMATCH');
  assert.equal(evaluate('value\n','value\r\n'),'PASS');
  assert.equal(evaluate('value','value','TIMEOUT'),'REFERENCE_TEST_MISMATCH');
  assert.throws(()=>assessReference({testCases:[{}]},[]),/COUNT/);
});
test('all 683 sandbox case results are linked, versioned, hash-only and one input/container', () => {
  let total=0;
  for(const row of catalog.rows){
    assert.equal(hashFile(row.sandbox.evidencePath),row.sandbox.evidenceSha256);
    const evidence=json(row.sandbox.evidencePath);
    assert.equal(evidence.contentVersion,row.contentVersion);
    assert.equal(evidence.inventoryContentVersion,row.inventoryContentVersion);
    assert.equal(evidence.provenance.caseIsolation,'ONE_TESTCASE_PER_REQUEST_FRESH_CONTAINER');
    assert.ok(evidence.cases.every(c=>!('input' in c)&&!('stdout' in c)&&!('expectedOutput' in c)));
    assert.equal(evidence.cases.filter(c=>c.passed).length,evidence.passed);
    total+=evidence.testCount;
  }
  assert.equal(total,683);
});
test('all four blank-result items reviewed; file fixtures/random/class mismatches remain excluded even on PASS', () => {
  const blanks=catalog.rows.filter(r=>r.contentReview.notes.includes('BLANK_OUTPUT_REVIEWED_AS_VALID_EMPTY_RESULT'));
  assert.equal(blanks.length,4);
  for(const key of ['LS-08.MP:003','LS-07.MP:019','LS-08.MP:022','LS-04.MP:001']){
    const row=byKey(key);assert.equal(row.sandbox.status,'PASS');assert.equal(row.eligibility,'EXCLUDED');
  }
  assert.ok(catalog.rows.filter(r=>r.eligibility==='EXCLUDED').every(r=>r.contentReview.issues.length));
});
test('24 handoff batches cover every ID exactly once with at most 10 items', () => {
  assert.equal(pinned.handoff.batches.length,24);
  const ids=pinned.handoff.batches.flatMap(b=>{assert.ok(b.rows.length<=10);return b.rows.map(r=>r.exerciseId);});
  assert.equal(ids.length,208);assert.equal(new Set(ids).size,208);
  for(const row of catalog.rows)assert.ok(pinned.handoff.batches.some(b=>b.taskId===row.provenance.taskId&&b.rows.some(r=>r.exerciseId===row.exerciseId)));
});
test('prerequisites are graph ancestors, distinct from primary/secondary skills', () => {
  for(const row of catalog.rows)assert.deepEqual(row.prerequisiteSkillIds,prerequisiteSkills(pinned.graph,[row.primarySkillId,...row.secondarySkillIds]));
  assert.ok(byKey('LS-08.MP:015').secondarySkillIds.includes('PY-OOP-03'));
});
test('runtime probe evidence reports its limits instead of asserting an unobserved remote image digest', () => {
  const probes=json('reviews/palnet-p1-2026-11-03/sandbox/probes-v2.json');
  assert.ok(Object.values(probes.observed).every(v=>v===true));
  assert.equal(probes.provenance.remoteImageDigest,null);
  assert.equal(probes.provenance.sourceAttestation,'REPOSITORY_SOURCE_ONLY_NOT_REMOTE_IMAGE_DIGEST');
  assert.equal(json('reviews/palnet-p1-2026-11-03/sandbox/probes.json').observed.freshWorkspacePerCase,false);
});
