# PROJECT FEATURES & FUNCTIONAL ROADMAP

> Status derived from actual codebase inspection during `/init` (git history + source audit).

## 1. Active Features (Production Ready)
- [x] **Auth system**: Register / Login with bcrypt password hashing + JWT (`controller.ts`, `auth.service.ts`, `middlewares/auth.ts`)
- [x] **Course browsing & detail**: Get published courses, course tree (Module → Chapter → Lesson) with ordering, lesson detail + next-lesson navigation (`courseController.ts`)
- [x] **Lesson completion tracking**: `LessonProgress` upsert via `POST /lessons/:id/complete` and on-exercise-pass
- [x] **Code sandbox**: Dockerized multi-language execution (PYTHON, JAVASCRIPT, CPP, C) with concurrency-limited queue, isolated `--network none` containers, local fallback, precise runtime measurement
- [x] **Coding exercise grading**: Run all testcases in parallel, compare I/O, static variable-constraint checks, persist `Submission`, auto-complete lesson, runtime beats percentile + distribution buckets
- [x] **Practice platform**: Independent algorithm problems (`PracticeProblem`), tag/difficulty/status filters, public+hidden testcases, submission grading per language, runtime distribution, leaderboard with difficulty-based points (Easy 10 / Medium 30 / Hard 50)
- [x] **Frontend course detail architecture**: TanStack Query data fetching + React Router v7 routing (`CourseDetail`, `Lesson`, `PracticeWorkspace`, Monaco editor, resizable panels, markdown rendering)
- [x] **AI Recommendation Service Entrypoint**: FastAPI microservice (`ai-service/main.py`) with `/health` and `/api/recommend` endpoints.

## 2. In-Progress Features
- [ ] **AI recommendation engine training & model refinement**: ML-based adaptive exercise recommendation using historical submission dataset.
- [ ] **AI review / feedback**: Wiring `AIReview` model with LLM/FastAPI feedback generation.

## 3. Backlog / Future Roadmap
- [ ] Automated test runner (`npm test` currently a placeholder; no test suite)
- [ ] Certificates issuance (`Certificate` model present, no endpoint)
- [ ] Enrollment flow (`Enrollment` model present, no endpoint)
- [ ] Security & rate limiting enhancements
