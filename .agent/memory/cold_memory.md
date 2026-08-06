# 🧊 EURUS AGENT - COLD MEMORY & LEARNING ARCHIVE

> Persistent repository memory across chat sessions. Captures architectural decisions, failure logs, and workarounds.

## 1. Architectural Decisions (ADR Archive)
- **ADR-001**: SDD 2.0 Executable Contracts (Flat YAML + Gherkin Syntax).
- **ADR-002**: Three-Tier Codified Context Architecture (Tier 1 Constitution -> Tier 2 Specialist Regex -> Tier 3 On-Demand).
- **ADR-003**: Deterministic Control Plane with Human Escalation State on Circuit Breaker triggers.

## 1.1 Project Baseline ADRs (Hydrated via /init on 2026-08-04)
- **ADR-010**: **Synchronous Docker Sandbox with Local Fallback.** User code is graded by spawning ephemeral, isolated Docker containers (`--rm -i -u nobody --network none`, memory/CPU capped) per execution. If Docker errors, execution transparently falls back to `runCodeLocally`.
- **ADR-011**: **Concurrency-Limited Execution Queue (Singleton).** All `run`/`submit` calls funnel through one `CodeExecutionQueue(maxConcurrency=4)` to bound concurrent container spawns and avoid resource exhaustion/race conditions.
- **ADR-012**: **In-Container Subprocess Runtime Measurement.** Runtime is measured inside the container via a wrapper subprocess and reported through an `___RUNTIME___:N` marker stripped from `stderr`, isolating user-code time from Docker/interpreter startup overhead.
- **ADR-013**: **DB-driven Stats (beats + distribution) Derived From Real Submissions.** `runtimeBeats` percentile and runtime distribution buckets are computed live from persisted `Submission`/`PracticeSubmission` rows.
- **ADR-014**: **Monolith Backend + SPA Frontend + PAL-Net FastAPI AI Microservice.** App is a Node/Express backend, React/Vite frontend, and PAL-Net/BKT/DKT recommendation service (`ai-service/main.py`).
- **ADR-015**: **Idempotent Database Seed Strategy.** Clear pre-existing unique constraint keys (e.g. `module_id` array `MOD-01`..`MOD-05`) in `seed.ts` prior to record creation to prevent P2002 duplicate key failures on remote PostgreSQL/Supabase instances.
- **ADR-016**: **Docker Multi-Stage Production Builds.** Nginx Alpine SPA fallback for frontend (8080), pruned Node 20 Alpine for backend (3000), PyTorch CPU wheel + scipy for ai-service (8000).
- **ADR-017**: **Supabase IPv4 Connection Pooler in Docker Environments.** Supabase direct connections (`db.project.supabase.co:5432`) are IPv6-only. Use Supabase IPv4 Pooler (`aws-0-ap-northeast-1.pooler.supabase.com:5432`) in Docker bridge networks to avoid `ENETUNREACH`.
- **ADR-018**: **HashiCorp Standard Module & Environment Pattern.** Organise Terraform code into reusable modules (`modules/network`, `modules/compute`, `modules/finops`) and environment roots (`environments/dev`).

## 2. Failure & Workaround Archive
- **Pattern**: `Unmerged files conflict during git pull` on `ai-service/main.py` and `backend/src/prisma/seed.ts`.
  - *Fix*: Integrated remote PAL-Net recommendation code and upsert-based seed logic, staged via `git add`, and committed (`1a3e811`).
- **Pattern**: `P2002 Unique constraint failed on (module_id)` during `npx prisma db seed`.
  - *Fix*: Delete existing `Module` records with matching `moduleId` in `seed.ts` before creating courses.
- **Pattern**: `connect ENETUNREACH 2406:da14:...` in Node/Prisma container when connecting to Supabase.
  - *Fix*: Switch `DATABASE_URL` in `.env` to Supabase IPv4 Connection Pooler host (`aws-0-ap-northeast-1.pooler.supabase.com:5432`).
- **Pattern**: Nginx 404 on direct URL navigation to `/login` or SPA refresh.
  - *Fix*: Copy `nginx.conf` into `/etc/nginx/conf.d/default.conf` in Stage 2 of `frontend/Dockerfile`.
- **Pattern**: CORS preflight request blocked from origin `http://localhost:8080`.
  - *Fix*: Add `'http://localhost:8080'` to `cors({ origin: [...] })` in `backend/src/app.ts`.

## 3. Session Snapshots
- **Snapshot 2026-08-04T09:00 (git `99e1757`, dirty)**: Hydrated `ARCHITECTURE.md`, `FEATURES.md`, `hot_memory.json`, appended ADRs 010-014.
- **Snapshot 2026-08-05T21:24 (git `1a3e811`)**: Resolved Git pull merge conflicts on `ai-service/main.py` and `seed.ts`, committed merge, configured Supabase env, updated README.md, and synced `.agent` memory.
- **Snapshot 2026-08-06T22:23 (git `8a19a70`, clean)**: Completed Phase 1 Dockerization, fixed CORS, fixed Supabase IPv4 pooler, created GitHub PR #3 (`feature/Eurus-docker-containerization`), and updated DEVOPS_PLAN.md with Azure FinOps + Standard Terraform Modules.
