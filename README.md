# 🚀 VIBECODE AI - Adaptive Programming Learning System (LearnPython)

Welcome to **VIBECODE AI**, a modern, state-of-the-art Adaptive Online Programming Learning System. This project is built to redefine how beginners learn programming by offering a personalized learning path, adaptive exercise recommendation, and deep student cognitive modeling.

---

## 🌟 Key Features

*   **Adaptive Recommendation Engine (CogProg-Rec):** Automatically personalizes learning paths. Exercises are proposed within the user's *Zone of Proximal Development (ZPD)*—not too easy to cause boredom, nor too hard to cause discouragement.
*   **User Profiling & Clustering:** Group learners into 4 behavioral archetypes (*Optimizer, Persister, Rusher, and Stuck*) using Machine Learning (K-Means/DBSCAN).
*   **Sandbox Code execution evaluation:** Real-time performance measurement (Runtime ms, Space Complexity, and code optimization beats).
*   **Comprehensive Student Tracking:** Analyze submissions, active timelines, logic attempts, and thematic strengths/weaknesses (Arrays, Hash Tables, Strings, etc.).

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | ![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB) ![Vite](https://img.shields.io/badge/Vite-B73BFE?style=flat-square&logo=vite&logoColor=FFD627) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white) |
| **Backend** | ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-3982CC?style=flat-square&logo=prisma&logoColor=white) |
| **Database** | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white) |
| **AI/ML Engine** | ![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white) ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white) ![Pandas](https://img.shields.io/badge/Pandas-150458?style=flat-square&logo=pandas&logoColor=white) |

---

## 📁 Directory Structure

```text
LearnPython/
├── backend/                  # EXPRESS & PRISMA BACKEND
│   ├── src/
│   │   ├── config/           # Database configurations
│   │   ├── controllers/      # APIs Business logic (Auth, Users)
│   │   ├── routes/           # Routing API definitions
│   │   ├── prisma/           # Database schema
│   │   └── app.ts            # Main application server
│   └── package.json
│
└── frontend/                 # REACT & VITE FRONTEND
    ├── public/               # Static assets
    ├── src/
    │   ├── components/       # Reusable components
    │   ├── pages/            # Page templates (Login, Register, Dashboard, etc.)
    │   ├── services/         # API connection handlers
    │   ├── App.tsx           # Router configuration
    │   └── main.tsx          # Application entrypoint
    └── package.json
```

---

## ⚙️ Installation & Setup

### 1. Prerequisites
Ensure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/) (v16+)
*   [PostgreSQL](https://www.postgresql.org/)
*   [Python](https://www.python.org/) (v3.9+)

### 2. Backend Configuration
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` directory and configure the database link:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/learnpython_db?schema=public"
   PORT=5000
   ```
4. Perform database migrations and seed default values:
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```
5. Spin up the backend server:
   ```bash
   npm run dev
   ```

### 3. Frontend Configuration
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development build:
   ```bash
   npm run dev
   ```
4. Access the web interface at `http://localhost:5173`.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/nguyentuanviet12k1d22cntt02-eng/codehub/issues).

---

## 📝 License

This project is licensed under the MIT License.
