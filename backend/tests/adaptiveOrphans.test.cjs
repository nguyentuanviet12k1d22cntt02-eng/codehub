// Orphaned runs and the database guard for one in-flight run per batch position.
// The SQL was also dry-run on the real database inside a rolled-back transaction
// (2026-11-21: 2 orphans from a backend restart, 1 duplicated position; sweep then index OK).
const test=require('node:test');
const assert=require('node:assert/strict');
const {ORPHAN_SWEEP_SQL,BATCH_POSITION_INDEX_SQL,isUniqueViolation}=require('../dist/modules/adaptive/adaptiveRepository');

test('the sweep closes only RUNNING rows silent for 10 minutes and records why',()=>{
    assert.match(ORPHAN_SWEEP_SQL,/WHERE status='RUNNING' AND updated_at < now\(\) - interval '10 minutes'/);
    assert.doesNotMatch(ORPHAN_SWEEP_SQL,/WAITING_PROVIDER/,'provider retries wait for next_attempt_at by design');
    assert.match(ORPHAN_SWEEP_SQL,/RUN_ORPHANED/);
    assert.match(ORPHAN_SWEEP_SQL,/SET status='FAILED'/);
});

test('the index allows one in-flight run per batch position, and only for batch children',()=>{
    assert.match(BATCH_POSITION_INDEX_SQL,/CREATE UNIQUE INDEX IF NOT EXISTS/);
    assert.match(BATCH_POSITION_INDEX_SQL,/\(request->>'batch_parent_trace_id'\),\(request->>'batch_index'\)/);
    assert.match(BATCH_POSITION_INDEX_SQL,/status IN \('RUNNING','WAITING_PROVIDER'\)/);
    assert.match(BATCH_POSITION_INDEX_SQL,/request \? 'batch_parent_trace_id'/);
});

test('a duplicate insert is recognised in every form Prisma reports it',()=>{
    assert.equal(isUniqueViolation({code:'P2010',meta:{code:'23505'}}),true);
    assert.equal(isUniqueViolation({message:'duplicate key value violates unique constraint "adaptive_runs_batch_position_inflight"'}),true);
    assert.equal(isUniqueViolation({code:'P2002',message:'Unique constraint failed on the fields'}),true);
    assert.equal(isUniqueViolation({code:'P2010',meta:{code:'23503'},message:'foreign key violation'}),false);
    assert.equal(isUniqueViolation(undefined),false);
});
