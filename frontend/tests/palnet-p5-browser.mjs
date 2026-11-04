// Isolated React UI on loopback; no application DB, real grader, or external services.
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import net from 'node:net';
import {createServer} from 'vite';
import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/vite';
import {release,fixtureLesson,decision,grade} from './palnet-p5-fixtures.mjs';
const root=fileURLToPath(new URL('..',import.meta.url)),state=new Map();
const free=net.createServer();await new Promise(r=>free.listen(0,'127.0.0.1',r));const port=free.address().port;await new Promise(r=>free.close(r));const base=`http://127.0.0.1:${port}`;
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const findBank=id=>release.banks.find(b=>b.bank_id===id||b.bank_code===id);
const scenarios=new Set(['advisory','rule','outage','manual','complete','failed','finish','race','stale','ambiguous','401','403','404','503','wrongbank','wrongid','empty']);
function config(bank){if(!state.has(bank.bank_id))state.set(bank.bank_id,{scenario:'advisory',commits:0,recommendations:0,lateReplies:0});return state.get(bank.bank_id);}
function json(res,status,data){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(data));}
function current(bank,s){
 if(s.scenario==='complete'||s.scenario==='finish'&&s.commits)return decision(bank,'COMPLETE',{revision:s.commits});
 if(s.scenario==='manual'||s.scenario==='empty')return decision(bank,'MANUAL',{reason:s.scenario==='empty'?'NO_ELIGIBLE_EXERCISES':undefined});
 if(s.scenario==='failed'&&s.commits)return decision(bank,'RULE_BASED',{revision:s.commits,reason:'RETRY_RULE'});
 if(s.scenario==='rule'||s.scenario==='outage')return decision(bank,'RULE_BASED',{reason:s.scenario==='outage'?'MODEL_UNAVAILABLE':'COLD_START'});
 if(s.scenario==='wrongbank')return decision(release.banks.find(b=>b.bank_id!==bank.bank_id));
 if(s.scenario==='wrongid')return decision(bank,'PALNET_ADVISORY',{overrides:{exerciseId:'outside-fixture-bank'}});
 return decision(bank,'PALNET_ADVISORY',{revision:s.commits,selected:s.commits?1:0});
}
const index='<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>P5 · Kiểm thử giao diện</title></head><body><div id="root"></div><script type="module" src="/tests/palnet-p5-browser.tsx"></script></body></html>';
const fixturePlugin={name:'p5-isolated-ui-fixture',configureServer(server){server.middlewares.use(async(req,res,next)=>{
 const u=new URL(req.url,base),p=u.pathname;
 try{
  if(p==='/qa/fixture'){
   const bank=findBank(u.searchParams.get('bank'))||release.banks[0],scenario=u.searchParams.get('case')||'advisory';if(!scenarios.has(scenario))return json(res,400,{error:'invalid fixture case'});
   state.set(bank.bank_id,{scenario,commits:0,recommendations:0,lateReplies:0});res.writeHead(302,{Location:`/module-practice/${bank.module_code}/${bank.bank_code}`});return res.end();
  }
  if(p==='/qa/status'){const bank=findBank(u.searchParams.get('bank'))||release.banks[0];return json(res,200,config(bank));}
  if(p==='/qa/mobile'){
   res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});return res.end('<!doctype html><title>P5 mobile fixture</title><iframe title="Giao diện 375px" style="width:375px;height:812px;border:1px solid #aaa" src="/qa/fixture?case=advisory&amp;bank=LS-04.MP"></iframe>');
  }
  let m=/^\/api\/auth\/lesson\/([^/]+)$/.exec(p);if(m){const bank=findBank(decodeURIComponent(m[1]));if(!bank)return json(res,404,{});const lesson=fixtureLesson(bank);if(config(bank).scenario==='empty')lesson.codingExercises=[];return json(res,200,lesson);}
  m=/^\/api\/courses\/module-practice\/([^/]+)\/recommendation$/.exec(p);
  if(m){
   const bank=findBank(decodeURIComponent(m[1]));if(!bank)return json(res,404,{});const s=config(bank);s.recommendations++;
   if(['401','403','404','503'].includes(s.scenario))return json(res,Number(s.scenario),{});
   if(s.scenario==='stale')return json(res,409,{code:'DECISION_STALE_RETRY'});
   if(s.scenario==='ambiguous')return json(res,409,{code:'AMBIGUOUS_MODULE_PRACTICE'});
   const captured=current(bank,s);
   if(s.scenario==='race'&&s.recommendations===3){await wait(4500);s.lateReplies++;}
   return json(res,200,captured);
  }
  m=/^\/api\/auth\/exercises\/([^/]+)\/submit$/.exec(p);
  if(m&&req.method==='POST'){
   const bank=release.banks.find(b=>fixtureLesson(b).codingExercises.some(e=>e.id===decodeURIComponent(m[1])));if(!bank)return json(res,404,{});
   req.resume();await wait(150);const s=config(bank);s.commits++;return json(res,200,grade(bank,`fixture-sub-${s.commits}`,s.scenario!=='failed'));
  }
  if(/^\/api\/auth\/exercises\/[^/]+\/submissions$/.test(p))return json(res,200,[]);
  if(p.startsWith('/api/'))return json(res,404,{code:'FIXTURE_ONLY'});
  if(p==='/'||p==='/dashboard'||p==='/login'||p.startsWith('/module-practice/')||p.startsWith('/practice/')){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});return res.end(await server.transformIndexHtml(req.url,index));}
  next();
 }catch{if(!res.headersSent)json(res,500,{code:'FIXTURE_ERROR'});else res.end();}
});}};
const server=await createServer({root,configFile:false,plugins:[fixturePlugin,react(),tailwind()],resolve:{alias:{'@monaco-editor/react':path.join(root,'tests/palnet-p5-editor-fixture.tsx')}},define:{'import.meta.env.VITE_API_URL':JSON.stringify(base)},server:{host:'127.0.0.1',port,strictPort:true}});
await server.listen();console.log(JSON.stringify({status:'READY',base,fixture:`${base}/qa/fixture`,mobile:`${base}/qa/mobile`,databaseWrites:0,externalCalls:0}));
for(const sig of ['SIGINT','SIGTERM'])process.once(sig,async()=>{await server.close();process.exit(0);});
