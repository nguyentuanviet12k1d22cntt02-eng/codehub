# 🚀 VIBECODE AI - Adaptive Programming Learning System (LearnPython)

Welcome to **VIBECODE AI**, a modern, state-of-the-art Adaptive Online Programming Learning System. This project is built to redefine how beginners learn programming by offering a personalized learning path, adaptive exercise recommendation, and deep student cognitive modeling.

---

## 🌟 Key Features

*   **Adaptive Recommendation Engine (CogProg-Rec):** Automatically personalizes learning paths. Exercises are proposed within the user's *Zone of Proximal Development (ZPD)*—not too easy to cause boredom, nor too hard to cause discouragement.
*   **User Profiling & Clustering:** Group learners into 4 behavioral archetypes (*Optimizer, Persister, Rusher, and Stuck*) using Machine Learning (K-Means/DBSCAN).
*   **Docker Sandbox Code Execution:** Isolated multi-language code execution (Python, JavaScript, C++, C) with strict memory/CPU limits and zero network access.
*   **Comprehensive Student Tracking & Practice Arena:** Analyze submissions, active timelines, logic attempts, and algorithm problems with live leaderboards.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | ![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB) ![Vite](https://img.shields.io/badge/Vite-B73BFE?style=flat-square&logo=vite&logoColor=FFD627) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) |
| **Backend** | ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-3982CC?style=flat-square&logo=prisma&logoColor=white) |
| **Database** | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white) (Supabase / Local) |
| **Sandbox** | ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white) (Isolated container execution engine) |
| **AI/ML Engine** | ![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white) ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white) ![Pandas](https://img.shields.io/badge/Pandas-150458?style=flat-square&logo=pandas&logoColor=white) ![Scikit-Learn](https://img.shields.io/badge/scikit--learn-F7931E?style=flat-square&logo=scikit-learn&logoColor=white) |

---

## 📁 Directory Structure

```text
LearnPython/
├── backend/                  # EXPRESS & PRISMA BACKEND
│   ├── src/
│   │   ├── config/           # Prisma client config
│   │   ├── controllers/      # Business logic (Auth, Courses, Exercises, Practice)
│   │   ├── middlewares/      # JWT authentication middleware
│   │   ├── prisma/           # Schema & seed scripts (seed.ts, seed_problems.ts)
│   │   ├── routes/           # REST API routes
│   │   ├── services/         # Sandbox (Docker) & Concurrency Queue Services
│   │   └── app.ts            # Express entrypoint
│   ├── .env                  # Backend environment variables
│   └── package.json
│
├── frontend/                 # REACT & VITE FRONTEND
│   ├── src/
│   │   ├── components/       # Monaco Editor, Navbar, UI Components
│   │   ├── pages/            # Home, Dashboard, CourseDetail, Lesson, Practice
│   │   ├── services/         # API HTTP handlers
│   │   ├── App.tsx           # React Router & TanStack Query Setup
│   │   └── main.tsx          # Application entrypoint
│   └── package.json
│
├── ai-service/               # FASTAPI AI RECOMMENDATION MICROSERVICE
│   ├── database_test.py      # Database connection & training data inspector
│   ├── main.py               # FastAPI microservice entrypoint (/api/recommend)
│   ├── requirements.txt      # Python dependencies
│   └── venv/                 # Python virtual environment
│
└── .agent/                   # EURUS AGENT BACKBONE (Architecture, Memory, Rules)
```

---

## ⚙️ Installation & Setup

### 1. Prerequisites
Ensure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/) (v18+)
*   [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Required for safe code execution sandbox)
*   [PostgreSQL](https://www.postgresql.org/) (Local instance or Cloud Supabase URL)
*   [Python](https://www.python.org/) (v3.9+)

---

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` in `backend/`:
   ```env
   JWT_SECRET=mykey
   PORT=3000
   DATABASE_URL="postgresql://postgres:password@localhost:5432/learnpython_db?schema=public"
   AI_SERVICE_URL="http://localhost:8000"
   ```
4. Generate Prisma Client and seed initial curriculum data:
   ```bash
   npx prisma generate --schema=src/prisma/schema.prisma
   npx prisma db seed
   ```
5. Start backend dev server:
   ```bash
   npm run dev
   ```
   *(Running at `http://localhost:3000`)*

---

### 3. Frontend Setup
1. Open a new terminal and navigate to `frontend/`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start frontend dev server:
   ```bash
   npm run dev
   ```
4. Access web UI at `http://localhost:5173`.

🔑 **Default Admin Seed Account:**
- **Email:** `author@mcode.vn`
- **Password:** `10092004`

---

### 4. AI Recommendation Microservice Setup (`ai-service`)
1. Open a new terminal and navigate to `ai-service/`:
   ```bash
   cd ai-service
   ```
2. Create and activate Python virtual environment:
   ```bash
   # Windows PowerShell / CMD:
   python -m venv venv
   .\venv\Scripts\activate

   # Linux / macOS:
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run FastAPI recommendation service:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   *(Running at `http://localhost:8000`)*

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

## 📝 License

This project is licensed under the MIT License.
