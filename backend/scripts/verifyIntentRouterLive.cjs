// Real integration verification: backend, PostgreSQL, ai-service, and providers.
// It never injects a model response, template, or fallback routing decision.
require('dotenv').config({quiet:true});
const assert = require('assert/strict');
const bcrypt = require('bcryptjs');
const {randomBytes} = require('crypto');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const path = require('path');
const {prisma} = require('../dist/infrastructure/database/prisma');
const {getRun} = require('../dist/modules/adaptive/adaptiveRepository');

const base = process.env.ADAPTIVE_TEST_URL || 'http://127.0.0.1:3000';
const output = path.resolve(__dirname, '../../reviews/ai-pipeline');
const cases = [
  {
    name: 'while-learning-rule',
    request: 'Tôi muốn học vòng lặp while trong python',
    expectedTopic: 'while',
    expectsRouterModelCall: false,
  },
];

async function callPipeline(token, goal) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 230000);
  try {
    const response = await fetch(base + '/api/learning-path/chat/start', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', Authorization: 'Bearer ' + token},
      body: JSON.stringify({goal, language: 'python'}),
      signal: controller.signal,
    });
    const data = await response.json();
    assert.equal(response.status, 200, 'chat/start HTTP response');
    return data;
  } finally {
    clearTimeout(timer);
  }
}

function compactCalls(record) {
  return (record?.model_calls || []).map(({provider, model, response_id, status, http_status, error_code, key_fingerprint, usage}) => ({
    provider, model, response_id, status, http_status, error_code, key_fingerprint, usage,
  }));
}

async function executeCase(token, userId, item) {
  const response = await callPipeline(token, item.request);
  const traceId = response?.pipeline?.trace_id;
  assert.ok(traceId, 'pipeline trace id');
  const run = await getRun(traceId, userId);
  assert.ok(run, 'persisted run');
  fs.writeFileSync(
    path.join(output, `intent-router-${item.name}-live-report.json`),
    JSON.stringify(run.report, null, 2),
  );

  const router = run.report.agent_traces?.find((record) => record.agent === 'IntentRouterAgent');
  const explainer = run.report.agent_traces?.find((record) => record.agent === 'ExplanationTutorAgent');
  assert.equal(run.status, 'SUCCEEDED', `pipeline status for ${item.name}`);
  assert.equal(router?.status, 'SUCCEEDED', `router status for ${item.name}`);
  assert.equal(router?.output?.intent, 'EXPLAIN_CONCEPT', `router intent for ${item.name}`);
  assert.equal(router?.output?.language, 'python', `router language for ${item.name}`);
  assert.equal(router?.output?.topic, item.expectedTopic, `router topic for ${item.name}`);
  assert.equal(explainer?.status, 'SUCCEEDED', `explanation status for ${item.name}`);
  assert.ok(compactCalls(explainer).some((call) => call.status === 'SUCCEEDED' && call.response_id), 'real ExplanationTutorAgent provider receipt');

  const routerCalls = compactCalls(router);
  if (item.expectsRouterModelCall) {
    assert.ok(routerCalls.some((call) => call.status === 'SUCCEEDED' && call.response_id), 'real IntentRouterAgent provider receipt');
  } else {
    assert.equal(routerCalls.length, 0, 'unambiguous rule route must not pretend to be an LLM call');
  }
  return {
    name: item.name,
    request: item.request,
    trace_id: traceId,
    status: run.status,
    routing: router.output,
    intent_router_model_calls: routerCalls,
    explanation_model_calls: compactCalls(explainer),
  };
}

async function main() {
  fs.mkdirSync(output, {recursive: true});
  const suffix = Date.now().toString(36);
  const password = randomBytes(24).toString('hex');
  const user = await prisma.user.create({
    data: {
      username: 'router_qa_' + suffix,
      email: 'router_qa_' + suffix + '@example.invalid',
      password: await bcrypt.hash(password, 10),
    },
  });
  const token = jwt.sign({id: user.id, username: user.username, role: 'STUDENT'}, process.env.JWT_SECRET, {expiresIn: '30m'});
  const summary = {kind: 'REAL_INTENT_ROUTER_VERIFICATION', started_at: new Date().toISOString(), fixture_user_id: user.id, runs: []};
  for (const item of cases) {
    try {
      const result = await executeCase(token, user.id, item);
      summary.runs.push(result);
      console.log(`${item.name}: ${result.status} ${result.trace_id}`);
    } catch (error) {
      summary.runs.push({name: item.name, request: item.request, status: 'FAILED', error: error.message});
      console.error(`${item.name}: ${error.message}`);
    }
    fs.writeFileSync(path.join(output, 'intent-router-live-summary.json'), JSON.stringify(summary, null, 2));
  }
  summary.ended_at = new Date().toISOString();
  summary.status = summary.runs.every((run) => run.status === 'SUCCEEDED') ? 'PASSED' : 'FAILED';
  fs.writeFileSync(path.join(output, 'intent-router-live-summary.json'), JSON.stringify(summary, null, 2));
  console.log(JSON.stringify({status: summary.status, runs: summary.runs.map(({name, status, trace_id}) => ({name, status, trace_id}))}));
  if (summary.status !== 'PASSED') process.exitCode = 1;
}

// The Prisma adapter can hold an unref'ed connection while establishing the
// first pool connection. Keep this CLI process alive until the real run ends.
const keepAlive = setInterval(() => {}, 1000);

main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    clearInterval(keepAlive);
    await prisma.$disconnect();
  });
