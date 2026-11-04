import fs from 'fs';
import path from 'path';
import {createHash} from 'crypto';
export interface ModuleContext {type:'MODULE_PRACTICE';course_id:string;module_id:string;module_code:string;bank_id:string;bank_code:string}
export interface ModuleRow {exercise_id:string;bank_id:string;bank_code:string;module_code:string;module_id:string;course_id:string;content_version:string;inventory_version:string;skill_id:string}
export interface ModuleRelease {pins:Record<string,string>;catalog_revision:string;skill_ids:string[];qualified_skill_ids:string[];banks:ModuleContext[];rows:ModuleRow[]}
export const sha=(v:string|Buffer)=>createHash('sha256').update(v).digest('hex');
export function moduleRelease():ModuleRelease {
 const raw=fs.readFileSync(path.join(__dirname,'../../infrastructure/data/pythonModulePracticeRuntime.r03.json'));
 if(sha(raw)!=='2a6d87c7e134503d606b67355bea883528227c9441b398fb1bf2f861000b0898')throw Error('MODULE_RELEASE_INTEGRITY');
 return JSON.parse(raw.toString('utf8'));
}
export const sameContext=(a:ModuleContext,b:ModuleContext)=>['type','course_id','module_id','module_code','bank_id','bank_code'].every(k=>a[k as keyof ModuleContext]===b[k as keyof ModuleContext]);
export function resolvePinnedModuleContext(bankId:string):ModuleContext {
 const matches=moduleRelease().banks.filter(b=>b.bank_id===bankId);if(matches.length!==1)throw Error('CONTEXT_OUTSIDE_DOMAIN');return matches[0];
}
export function moduleEnabled(module:string):boolean {
 if((process.env.PALNET_MODULE_PRACTICE_ENABLED??'false').toLowerCase()!=='true')return false;
 const raw=process.env.PALNET_MODULE_PRACTICE_MODULES||'',all=Array.from({length:8},(_,i)=>'MOD-0'+(i+1));
 const modules=raw.trim()?raw.split(',').map(s=>s.trim()).filter(Boolean):all;
 if(modules.some(s=>!all.includes(s)))throw Error('INVALID_MODULE_FLAG');return modules.includes(module);
}
export function portableModuleVersion(e:any):string {
 const testCases=e.testCases.map((t:any)=>JSON.stringify([t.input,t.expectedOutput,t.isHidden??false])).sort();
 return 'palnet-inventory-content/1.0:'+sha(JSON.stringify({title:e.title,difficulty:e.difficulty,problemDescription:e.problemDescription,starterCode:e.starterCode??null,solutionCode:e.solutionCode??null,testCases}));
}
