import { createHash, randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';
import { prisma } from '../../infrastructure/database/prisma';
import { signedPalnetExchange } from './palnetTransport';
import { PilotCatalog } from './pythonBasicsLessonCatalog';
import { trustedPythonFeedback } from './pythonModelEvidence';

export const PALNET_MODEL_VERSION = 'python70-r01-s20261102-advisory-v1';
export const PALNET_POLICY_VERSION = 'palnet-correctness-order/1.0';
export const PALNET_CHECKPOINT_SHA256 = '9fb3fe36edec11b1db625196494c5fc7d70cad1ca8b0747b22e1f2f1aa7a1397';
export interface PalnetAdvice {
  probabilities: Record<string, number>; modelVersion: string | null;
  checkpointSha256: string | null; inputSha256: string | null; cutoff: string;
  historyCount: number; fallback: string | null;
}
export const noPalnetAdvice = (reason: string, cutoff = new Date().toISOString()): PalnetAdvice => ({
  probabilities:{},modelVersion:null,checkpointSha256:null,inputSha256:null,cutoff,
  historyCount:0,fallback:reason,
});

/** Any incomplete, stale or unavailable signal follows the existing rules. */
export async function getPalnetAdvice(userId: string, catalog: PilotCatalog): Promise<PalnetAdvice> {
  let cutoff = new Date();
  const fallback = (reason: string) => noPalnetAdvice(reason,cutoff.toISOString());
  if ((process.env.PALNET_RUNTIME_ENABLED ?? 'true').toLowerCase() !== 'true') return fallback('MODEL_DISABLED');
  try {
    const graphPath = path.join(__dirname,'../../infrastructure/data/pythonSkillGraph.json');
    const graphRaw = fs.readFileSync(graphPath);
    const graphSha = createHash('sha256').update(graphRaw).digest('hex');
    const exercises = await prisma.codingExercise.findMany({
      where:{lessonId:{in:catalog.lessons.map(l => l.contentId)}},include:{testCases:true},
    });
    const events = await prisma.learningInteraction.findMany({
      where:{userId,sourceType:'COURSE_SUBMISSION',language:'PYTHON',dataOrigin:'REAL',
        itemId:{in:exercises.map(e => e.id)},submittedAt:{lt:cutoff}},
      orderBy:[{submittedAt:'asc'},{id:'asc'}],take:2001,
    });
    if (events.length > 2000) return fallback('HISTORY_LIMIT_REQUIRES_REVIEW');
    const submissions = await prisma.submission.findMany({
      where:{userId,language:'PYTHON',id:{in:events.map(e => e.sourceRecordId)}},
      select:{id:true,userId:true,exerciseId:true,language:true,code:true,status:true,submittedAt:true},
    });
    // All selected rows are committed and visible before the recorded decision cutoff.
    cutoff = new Date();
    const history = trustedPythonFeedback(events,submissions,exercises,
      new Map(catalog.lessons.map(l => [l.contentId,l.primarySkillId])),cutoff);
    if (!history.length) return fallback('NO_VERIFIED_CODE_HISTORY');
    const targets = [...new Set(catalog.lessons.map(l => l.primarySkillId))];
    const requestId = randomUUID();
    const body = JSON.stringify({
      schema_version:'palnet-advisory-request/1.0',request_id:requestId,user_id:userId,
      language:'PYTHON',goal_id:catalog.goalId,graph_version:catalog.graphVersion,
      graph_sha256:graphSha,cutoff:cutoff.toISOString(),target_skill_ids:targets,history,
    });
    const exchange = await signedPalnetExchange(body,1500);
    if(exchange.fallback)return fallback(exchange.fallback);
    const inputSha=exchange.inputSha256,result=exchange.result;
    if (result.status !== 'READY' || result.request_id !== requestId || result.user_id !== userId
      || result.input_sha256 !== inputSha || result.model_version !== PALNET_MODEL_VERSION
      || result.feature_version !== 'python70-causal-feedback/1.0'
      || result.policy_version !== PALNET_POLICY_VERSION || result.graph_sha256 !== graphSha
      || result.evaluation_status !== 'SYNTHETIC_EXPLORATORY'
      || result.checkpoint_sha256 !== PALNET_CHECKPOINT_SHA256
      || new Date(result.cutoff).getTime() !== cutoff.getTime()
      || !Number.isInteger(result.history_count) || result.history_count<1 || result.history_count>history.length
      || !result.probabilities || typeof result.probabilities!=='object'
      || Object.keys(result.probabilities).length!==targets.length
      || !targets.every(k => typeof result.probabilities[k]==='number'
        && Number.isFinite(result.probabilities[k]) && result.probabilities[k]>=0 && result.probabilities[k]<=1)) {
      return fallback('MODEL_RESPONSE_CONTRACT_INVALID');
    }
    return {probabilities:result.probabilities,modelVersion:result.model_version,
      checkpointSha256:result.checkpoint_sha256,inputSha256:inputSha,cutoff:cutoff.toISOString(),
      historyCount:result.history_count,fallback:null};
  } catch {
    // No grades or authentication tokens are included in diagnostic output.
    return fallback('MODEL_OR_HISTORY_UNAVAILABLE');
  }
}

