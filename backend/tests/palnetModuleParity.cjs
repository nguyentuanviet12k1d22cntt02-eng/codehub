// Synthetic fixtures only. Exports the production TypeScript aggregate for Python parity.
const fs=require('node:fs'),path=require('node:path');
const {release,cutoff,owner,sha,root}=require('./palnetModuleFixtures.cjs');
const {aggregateModuleHistory}=require('../src/modules/onboarding/palnetModuleHistory');
const cases=[0,1,2000,2001,10000].map(n=>{
 const history=Array.from({length:n},(_,i)=>{const r=release.rows[i%208];return {event_id:'parity-'+String(i).padStart(8,'0'),item_id:r.exercise_id,content_version:r.content_version,skill_id:r.skill_id,correct:i%29===7,feedback_ready_at:new Date(Date.parse(cutoff)-Math.ceil(n/2)*10+Math.floor(i/2)*10-1000).toISOString()};}).reverse();
 const historyRevision=sha(JSON.stringify(history));
 const summary=aggregateModuleHistory(history,cutoff,release.catalog_revision,historyRevision,release.skill_ids);
 return {n,history,summary,historyRevision};
});
const out={owner,cutoff,cases};
fs.writeFileSync(path.join(root,'reviews/palnet-p3-2026-11-03/parity-fixtures.json'),JSON.stringify(out));
console.log(JSON.stringify({status:'PASS',synthetic:true,persisted:false,lengths:cases.map(c=>c.n)}));
