# 🚀 VIBECODE AI - Adaptive Programming Learning System (LearnPython)

Welcome to **VIBECODE AI**, a modern, state-of-the-art Adaptive Online Programming Learning System. This project is built to redefine how beginners learn programming by offering a personalized learning path, adaptive exercise recommendation, and deep student cognitive modeling.

---

## 🌟 Key Features

*   **Adaptive Recommendation Engine (PAL-Net / BKT / DKT):** Automatically personalizes learning paths. Exercises are proposed within the user's *Zone of Proximal Development (ZPD)*—not too easy to cause boredom, nor too hard to cause discouragement.
*   **User Profiling & Clustering:** Group learners into 4 behavioral archetypes (*Optimizer, Persister, Rusher, and Stuck*) using Machine Learning (K-Means/DBSCAN).
*   **Isolated Code Execution:** Python, JavaScript, C, C++, and SQL run in ephemeral Docker sandboxes on the dedicated EC2 host. SQL uses a Python/SQLite wrapper inside the sandbox. The backend never executes learner code locally or through its own Docker daemon.
*   **Comprehensive Student Tracking & Practice Arena:** Analyze submissions, active timelines, logic attempts, and algorithm problems with live leaderboards.

---

## ⚡ Daily Startup Workflow

Once initial setup is complete, follow this simple 3-step routine to spin up all 3 microservices smoothly every day:

### 1️⃣ Terminal 1: Launch Backend Server (Port 3000)
```bash
cd backend
npm run dev
```
*(Server active at `http://localhost:3000`)*

### 2️⃣ Terminal 2: Launch Frontend Web UI (Port 5173)
```bash
cd frontend
npm run dev
```
*(Web UI active at `http://localhost:5173`)*

### 3️⃣ Terminal 3: Launch AI Recommendation Microservice (Port 8000)
```bash
cd ai-service

# Windows (PowerShell / Git Bash):
.\venv\Scripts\activate
uvicorn main:app --reload --port 8000

# macOS / Linux:
source venv/bin/activate
uvicorn main:app --reload --port 8000
```
*(AI Service active at `http://localhost:8000`)*

🔑 **Default Demo Account:**
- **Email:** `author@mcode.vn`
- **Password:** `10092004`

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | ![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB) ![Vite](https://img.shields.io/badge/Vite-B73BFE?style=flat-square&logo=vite&logoColor=FFD627) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) |
| **Backend** | ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-3982CC?style=flat-square&logo=prisma&logoColor=white) |
| **Database** | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white) (Supabase / Local) |
| **Sandbox** | AWS EC2 Docker for Python, JavaScript, C, C++, and SQL |
| **AI/ML Engine** | ![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white) ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white) ![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=flat-square&logo=pytorch&logoColor=white) ![Pandas](https://img.shields.io/badge/Pandas-150458?style=flat-square&logo=pandas&logoColor=white) ![Scikit-Learn](https://img.shields.io/badge/scikit--learn-F7931E?style=flat-square&logo=scikit-learn&logoColor=white) |

---

## 📁 Directory Structure

```text
LearnPython/
├── backend/                  # EXPRESS & PRISMA BACKEND (Feature-Based Architecture)
│   ├── prisma/               # Schema (schema.prisma), Migrations & Seed data
│   ├── src/
│   │   ├── modules/          # Domain features (auth, courses, practice, learning-path, admin...)
│   │   ├── infrastructure/   # EC2 Docker sandbox client, database, email, queue
│   │   ├── shared/           # Common middleware (auth, adminAuth), types
│   │   └── app.ts            # Express entrypoint
│   ├── scripts/              # Helper admin & database scripts
│   ├── .env                  # Backend environment variables
│   └── package.json
│
├── frontend/                 # REACT & VITE FRONTEND (Feature-Based Architecture)
│   ├── src/
│   │   ├── features/         # Feature modules (admin, auth, course, lesson, practice, adaptive...)
│   │   ├── components/       # Shared UI components (ThemeToggle, UserMenuDropdown)
│   │   ├── App.tsx           # React Router & TanStack Query Setup
│   │   └── main.tsx          # Application entrypoint
│   └── package.json
│
├── ai-service/               # FASTAPI AI MICROSERVICE (PAL-Net / BKT / DKT / Multi-Agent)
│   ├── app/                  # Modular domains (agents, adaptive, knowledge_tracing, llm)
│   ├── models/               # PyTorch weights (.pth)
│   ├── data/                 # Skill graphs, parameters, mock data
│   ├── scripts/              # Training, data generation & testing
│   ├── main.py               # FastAPI microservice entrypoint (/recommend, /pal-net)
│   ├── requirements.txt      # Python dependencies
│   └── venv/                 # Python virtual environment
│
└── .agent/                   # EURUS AGENT BACKBONE (Architecture, Memory, Rules)
```

---

## ⚙️ First-Time Setup

Perform these steps **only once** after cloning the repository on a new environment:

### 1. System Requirements
*   [Node.js](https://nodejs.org/) (v18+)
*   [PostgreSQL](https://www.postgresql.org/) (Local instance or Cloud Supabase URL)
*   [Python](https://www.python.org/) (v3.9+)

### 2. Backend Setup
```bash
cd backend
npm install

# Create backend/.env with:
# JWT_SECRET=mykey
# PORT=3000
# DATABASE_URL="postgresql://postgres:password@localhost:5432/learnpython_db?schema=public"
# AI_SERVICE_URL="http://localhost:8000"
# Required for Python, JavaScript, C, C++, and SQL execution:
# SANDBOX_PROVIDER=AWS_DOCKER  # default for all languages
# AWS_DOCKER_GRADER_URL=https://47.128.81.75
# AWS_DOCKER_GRADER_TOKEN=use-the-same-random-token-configured-on-ec2

npx prisma generate
npx prisma db seed
```

On Render, the AI service must also know how to call the backend's sandbox
validation endpoint. Set `ADAPTIVE_BACKEND_URL` to the backend origin (for
example, `https://your-backend.onrender.com`). If `BACKEND_INTERNAL_URL` already
points to that backend's `/api/internal/ai-keys`, the AI service derives the
same origin automatically. Both services must share the same
`ADAPTIVE_INTERNAL_SECRET` (or `JWT_SECRET`) for signed internal requests.

### 3. Frontend Setup
```bash
cd frontend
npm install
```

### 4. AI Service Setup
```bash
cd ai-service
python -m venv venv

# Windows:
.\venv\Scripts\activate
# Linux/macOS:
# source venv/bin/activate

pip install -r requirements.txt
pip install torch --extra-index-url https://download.pytorch.org/whl/cpu
```

---

## 💡 Troubleshooting & Tips

- **After Pulling New Code (`git pull`)**:
  - If `schema.prisma` is updated: Re-run `npx prisma generate` in `backend/`.
  - If `requirements.txt` is updated: Re-run `pip install -r requirements.txt` inside `ai-service/` virtual environment.
- **`Address already in use` Error (Port Conflict)**:
  - Check if another terminal is already running `npm run dev` or `uvicorn`. Close redundant terminal processes before restarting.
- **Code Execution Editor Fails**:
  - For Python, JavaScript, C, C++, and SQL, verify `AWS_DOCKER_GRADER_URL`, `AWS_DOCKER_GRADER_TOKEN`, the EC2 `/health/ready` endpoint, and the runner images documented in `grader-service/README.md`. Restart the backend after changing environment variables.
  - To verify the exercise-validation path, run `PROBE_LANGUAGE=javascript node scripts/probeProductionAdaptive.cjs` from `backend/` (PowerShell: `$env:PROBE_LANGUAGE='javascript'; node scripts/probeProductionAdaptive.cjs`). Use `PROBE_LANGUAGE=sql` for SQLite. The probe fails unless all four cases report `image=aws-docker`; set `PROBE_BACKEND_URL=http://127.0.0.1:3000` to check the local backend.
  - The EC2 provider fails closed. The backend never falls back to Judge0, the Render process, or its local Docker daemon.

---

## 📝 License

This project is licensed under the MIT License.
