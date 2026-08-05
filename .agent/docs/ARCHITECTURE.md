# PROJECT ARCHITECTURE & DESIGN SPECIFICATION

> **Agent Instruction**: This document is the Single Source of Truth for system architecture. Populate and update the sections below during `/init` or `/spec` based on the ACTUAL project codebase.

---

## 1. Core Tech Stack
- **Language(s)**: TypeScript (backend + frontend), Python (AI service)
- **Framework(s)**:
  - Backend: Node.js / Express 5 + Prisma ORM 7 (PrismaPg adapter + `pg` Pool)
  - Frontend: React 19 + Vite 8 + TanStack Query 5 + React Router 7, Tailwind CSS 4, Monaco Editor
  - AI/ML Service: FastAPI + pandas + scikit-learn (planned/partial microservice in `ai-service/`)
- **Storage & Caching**: PostgreSQL (single source of truth), no external cache layer yet
- **Test Runner**: None configured (`npm test` is a placeholder). No formal test suite yet.

## 2. Directory Layout & Module Boundaries
- `backend/` — Express REST API (monolith)
  - `src/app.ts` — App entrypoint, CORS (Vite `:5173`), JSON parsing, mounts `/api/auth`
  - `src/routes/routes.ts` — Single router: auth, courses, lessons, compiler, exercises, practice platform
  - `src/controllers/` — `controller.ts` (auth), `courseController.ts`, `exerciseController.ts`, `practiceController.ts`
  - `src/services/` — `auth.service.ts`, `queueService.ts` (concurrency=4 singleton), `sandboxService.ts` (Docker + local fallback)
  - `src/middlewares/auth.ts` — JWT `authenticateToken` / `optionalAuthenticateToken`
  - `src/prisma/schema.prisma` — data model; `seed.ts`, `seed_problems.ts`, `exercises_data.ts`, `test_api.ts`
- `frontend/` — React SPA
  - `src/pages/` — Home, Dashboard, CourseDetail, Lesson, Practice, PracticeList, PracticeWorkspace, Login, Register
  - `src/components/`, `src/services/authService.ts`, `src/utils/themeHelper.ts`
- `ai-service/` — Python FastAPI microservice (recommendation engine) — partially scaffolded
- `Dữ liệu nội dung bài học/` — Vietnamese Python course curriculum content (Chapters → Lessons, independent exercises)

## 3. System Data Flow & Topology

```mermaid
graph TD
    FR["Frontend (React + Vite)"] -->|REST /api | BE["Backend (Express + Prisma)"]
    BE -->|SQL via PrismaPg| PG[("PostgreSQL")]

    subgraph Compiler["Code Execution Sandbox"]
        BE -->|queueService pushJob| Q["CodeExecutionQueue (max 4)"]
        Q -->|spawn| DK["Docker container<br/>(python/node/gcc)· no-network · user nobody"]
        DK -->|runCodeInDocker| BE
        DK -.->|fallback on docker error| LC["runCodeLocally"]
    end

    subgraph Practice["Practice Platform (Luyện tập Thuật toán)"]
        BE -->|problems/leaderboard| FR
    end

    BE -->|POST /api/recommend (future)| AI["ai-service (FastAPI)"]
    PG -->|offline training data| AI

    FR -->|Post submission| BE
    BE -->|grade testcases + persist| PG
    BE -->|runtime beats + distribution| FR
```

Core request flows (course workflow):
1. **Run code (sandbox):** `POST /api/auth/compiler/run` → `codeExecutionQueue.pushJob` → Docker executes with stdin/testcase → returns stdout/stderr/runtime. No DB write.
2. **Submit coding exercise:** `POST /api/auth/exercises/:id/submit` → validate static variable constraints → run ALL testcases in sandbox → persist `Submission` (PASSED/FAILED) → upsert `LessonProgress` on pass → compute `runtimeBeats` + runtime distribution buckets.
3. **Practice submission:** `POST /api/auth/practice/problems/:id/submit` → run public+hidden testcases → persist `PracticeSubmission` → beats + distribution, feeds leaderboard (points: Easy 10 / Medium 30 / Hard 50).
4. **Lesson completion:** `POST /api/auth/lessons/:id/complete` → upsert `LessonProgress.isCompleted`.

## 4. Key Architectural Invariants
- **Zero overwrite of user config**: never overwrite existing `package.json`, `tsconfig`, `.env`, or linter configs.
- **Sandbox isolation**: user code executes only in ephemeral Docker containers (`--rm -i --network none -u nobody`, `--memory`/`--cpus` capped); `temp_code/` files cleaned after each run.
- **Concurrency bound**: code execution serialized through a single queuing singleton (`maxConcurrency = 4`) to avoid resource exhaustion / race conditions.
- **UUID-validated inputs**: course/lesson/route IDs are validated against a UUID regex before DB queries.
- **Auth boundary**: submission / completion routes require `authenticateToken`; read-only practice/problem routes use `optionalAuthenticateToken`.
- **Hidden testcase protection**: `solutionCodes` are never returned; hidden testcase I/O is masked on the frontend response.
- **Seed safety**: no destructive reset in default flows; `upsert` used for progress to avoid duplicate rows.
