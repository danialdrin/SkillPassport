# SkillPassport 🎓

**AI-Powered Student Skill Intelligence Platform**

SkillPassport is an intelligent learning overlay operating above raw educational content (YouTube videos, PDFs, NPTEL lectures, course documents). Unlike traditional Learning Management Systems (LMS) or video platforms that track binary watch metrics, SkillPassport answers a fundamental student question: **"What do I actually know right now, and what is the exact prerequisite blocking my next concept?"**

---

## 🌟 Core Architecture & Capabilities

1. **Intake & Multi-Level Resource Intelligence**: Search or upload learning resources. Evaluates quality signals and extracts structured topics, concepts, prerequisite edges, and key sections using LLM analysis.
2. **Interactive Study Experience**: Enables studying via video transcripts, structured summaries, flashcards, interactive mindmaps, and practice quizzes.
3. **Adaptive Competency Assessment**: AI-driven adaptive exams (MCQ, Short Answer, Code Explanation) and multi-turn technical AI interviews generate verified evidence events.
4. **Student Knowledge Topology & Skill Passport**: Maps student knowledge state onto an interactive network topology and digital skill passport with automated gap discovery (0–100 competency scale).

---

## 📁 Repository Structure

```text
.
├── backend/                  # FastAPI Backend Services & AI Intelligence
│   ├── app/                  # Application source code (API, services, models, core)
│   ├── mock_data/            # Mock datasets for offline development
│   ├── tests/                # Test suites & pytest assertions
│   ├── requirements.txt      # Python dependencies
│   └── run.py                # Server launcher script
├── frontend/                 # React 19 + Vite Frontend Application
│   ├── src/                  # Components, pages, hooks, context, api clients
│   ├── public/               # Static web assets
│   ├── package.json          # Node dependencies & npm scripts
│   └── vite.config.ts        # Vite build & server configuration
├── specs/                    # Feature specification documents & planning artifacts
├── document1.md              # Consolidated Frontend Specification Document
└── README.md                 # Project Overview & Getting Started Guide
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18+ and `npm`
- **Python**: v3.11+
- **MongoDB** (or local database instance)

---

### Backend Setup (FastAPI)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables:
   ```bash
   cp .env.example .env
   # Update .env with your configuration credentials
   ```

5. Run the FastAPI development server:
   ```bash
   python run.py
   ```
   The backend API will be available at `http://localhost:8000`.

---

### Frontend Setup (React + Vite)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend application will be running at `http://localhost:5173`.

---

## 📜 License

This project is developed as part of the SkillPassport platform initiative. All rights reserved.
