# V4 real-agent verification

Run date: 2026-09-20. All executions used the local backend, PostgreSQL, Docker runner, and configured external model providers. No mocked agent output and no reserve exercise were used.

| Language | Trace | Final status | Evidence |
|---|---|---|---|
| Python | `trace_80d2b4b498454cdeab26869a02cd2c74` | `SUCCEEDED` | Three real model calls, `PublicationGate`, five Docker cases, correct and incorrect submissions, and idempotent mastery are recorded in `python-live-report.json` and `python-grading.json`. |
| Python — provider resilience | `trace_cfde85d64f2841f5b8b197fa0853135d` | `SUCCEEDED` | All ten stages completed: Generator, schema, constraints, five-case Docker sandbox, theory, critic, and publication. Gemini returned 429 then 503; a Groq key returned 400; another eligible Groq key completed Generator, Theory, and Critic. The stored reference solution was regraded against all five cases, including one hidden case, and passed. See `python-live-report.json` and `python-latest-regrade.json`. |
| JavaScript | `trace_f4bffeb6b34d466bb517eaef2040df77` | `SUCCEEDED` | Real provider, sandbox, critic, publication, and grading completed. The report is in `javascript-live-report.json` and `javascript-grading.json`. |
| C++ | `trace_cd7738546857404aad9dc7b7cfc7feb4` | `FAILED` | The request reached Docker sandbox but the provider did not complete the critic within its bounded retries. The run retained its stages and never published an exercise. |
| SQL | `trace_d9f600ca3d294724a2783af32300c332` | `FAILED` | The provider did not complete the theory stage within its bounded retries. The run retained its stages and never published an exercise. |

The first attempt of retryable provider errors enters `WAITING_PROVIDER` in PostgreSQL. The backend worker makes at most two further attempts, appends each attempt's evidence, and only then marks the run failed. A retry now passes the signed, server-stored checkpoint back to the AI service. When Planner, Generator, Schema, Constraint, Sandbox, and Theory already have valid receipts, it resumes at Critic rather than repeating completed model calls. If only Theory is missing after Sandbox, it reuses the verified candidate, creates Theory, then continues to Critic. Each receipt records `run_attempt`, `stage_attempt`, and a monotonic sequence.

Provider handling is key-specific: an HTTP 429 cools only the key that received it and honors `Retry-After` when supplied. A 5xx, timeout, network, deadline, or invalid-response failure likewise cools only that key; every eligible sibling key is tried before a provider-wide recovery window can open. Stage output budgets are bounded and non-streaming JSON calls receive realistic 20–35 second stage deadlines. No path creates or publishes a reserve/template exercise.

## Router and provider verification — 2026-09-20

`intent-router-live-summary.json` records two real backend-to-provider runs after the final key-rotation, GROQ model-policy, and Router contract deployment. Both completed with `SUCCEEDED` and no fallback content.

- Exact request `Hãy tạo nội dung Def trong Python cho tôi` produced `EXPLAIN_CONCEPT / python / def` in `trace_1873447485f44cb4aaeeac9d58968b0c`. Its real `ExplanationTutorAgent` receipt records eleven distinct Gemini key attempts (ten HTTP 503 and one HTTP 429) before GROQ selected its structured Qwen candidate and returned HTTP 200, response ID `chatcmpl-c1695a0c-ef57-4641-aa14-18e520c5f1c6`.
- The LLM Router request `Tôi muốn tìm hiểu Def trong Python.` produced the same Pydantic-validated routing object in `trace_1d380c63675b4966b8cc694ef9cd97a0`. Its actual `IntentRouterAgent` receipt records GROQ Qwen HTTP 200, response ID `chatcmpl-a21e3f72-2673-46c8-b9f2-8766f0aec415`, with exactly `intent`, `language`, and `topic` returned by the model.
- GROQ ignores model environment/cache overrides and evaluates its allowlist for each key in this strict order: `llama-3.3-70b-versatile`, `llama-3.1-8b-instant`, then `qwen/qwen3.8-27b`. The active Groq account did not expose either Llama model. `groq-intent-router-live-summary.json` is a separate real call against the final deployment: the client selected Qwen, returned HTTP 200, response ID `chatcmpl-152c1e67-5ccb-42dc-98d4-65876d3fbbb8`, trace `trace_dd930356a78b4f1ebb91b616ac22526a`, and a Pydantic-validated `EXPLAIN_CONCEPT / python / def` object. `openai/gpt-oss-*` was not selected.

V4 regression checks passed: 34 Python tests, 11 backend tests, backend TypeScript validation, and a frontend production build. A separate real Docker smoke run is stored in `python-docker-smoke.json`.

## Deadline recovery verification — 2026-09-21

The run envelope is 300 seconds and the backend transport permits 330 seconds so it can persist the final SSE event. A run that still reaches this bound is retryable and resumes only from server-stored sandbox receipts; it does not regenerate a template or publish unverified content.

`trace_9ad58c3036e54bd8a889f5471e04c22d` is a real end-to-end Python run after this update. It ran for about 217 seconds, longer than the former 180-second limit, then completed SandboxValidator, ExplanationTutorAgent, CriticEvaluatorAgent, PublicationGate, publication, and real Docker grading. The reference solution passed all six cases; intentionally incorrect code failed all six. The detailed evidence is in `python-latest-summary.json` and `python-live-report.json`.

The exact request `hãy tạo cho tôi bài tập về for trong python` was then verified as `trace_e1a38889cae840c1bc12db58d277dade`. It ran for about 193 seconds and completed every stage, including Docker sandbox, theory, critic, publication, and grading. This confirms the production path used by the reported failure works past the former 180-second envelope without any content fallback.

Regression checks after the update passed: 35 Python tests, 11 backend tests, and backend TypeScript validation.

## Scheduler and durable-retry verification — 2026-09-22

The provider scheduler now gives one shared budget to an LLM stage instead of restarting the full per-call timeout for every key. Failed keys remain excluded for the lifetime of the run, and a provider is marked unhealthy for later stages only after all of its eligible keys have returned real transient failures. This retains sibling-key rotation while preventing Theory or Critic from replaying a known failed Gemini pool.

The retry checkpoint is compact and server-owned. It transports only the latest successful Planner, Generator, SchemaValidator, ConstraintValidator, SandboxValidator and Theory or Grounding outputs that the resume path actually reads. Full model receipts remain in PostgreSQL. Payloads over 150 KB are reported as HTTP 413 rather than being misreported as a signature failure.

The exact request `hãy tạo cho tôi bài tập về for trong python` completed as `trace_17b4758597ea40bab913ae6591784fc1` after this deployment. All eleven Gemini keys failed with real 5xx/timeout responses during generation, then a real Groq response generated the draft in 3.2 seconds. The same run passed schema, constraints, Docker sandbox, theory, critic, publication, and correct/incorrect grading. The complete evidence is in `python-latest-summary.json` and `python-live-report.json`; no fallback content was used.

Regression checks after this update passed: 38 Python tests, 12 backend tests, and backend TypeScript validation.

## Admin call monitoring and explicit learning request — 2026-09-22

The adaptive client now emits an Admin call-log row for every real provider attempt. The log contains the stage, provider, selected model, masked key, HTTP status, latency, response excerpt or stable error code. These writes run outside the provider critical path. Key success and failure counters remain owned by the existing `/report` call, so the new monitoring row does not double-count usage.

The exact request `Tôi muốn học vòng lặp while trong python` completed as `trace_08cab5e6238a4516b765a587b44e8dee`. Routing was deterministic and completed as `EXPLAIN_CONCEPT / python / while` without a classifier model call. The real `ExplanationTutorAgent` then recorded eleven distinct Gemini key failures in Admin before Groq returned HTTP 200 from `qwen/qwen3.8-27b` with response ID `chatcmpl-6935764a-7dc4-4dbd-ad05-cf844a4d0536`.

Regression checks after this update passed: 39 Python tests, 12 backend tests, backend TypeScript validation, and both rebuilt services reported healthy.
