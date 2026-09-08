# Quickstart & End-to-End Validation Guide

This document outlines prerequisites, environment setup, and runnable validation steps for verifying the backend implementation.

---

## 1. Prerequisites & Environment Setup

### Environment Variables (`.env`)

Create a `.env` file in the project root:

```ini
MONGO_URI=mongodb+srv://dani9629198934dani_db_user:SxGJSGhhNqTWuD6R@cluster0.d84ctwd.mongodb.net/?appName=Cluster0
MONGO_DB_NAME=skill_intelligence
REDIS_URL=redis://default:R7MjAPdAkNtKcTNBqcMjHcqUJLXWGUiE@matchless-marvellous-topiary-27115.db.redis.io:17312
JWT_SECRET=supersecretkey12345678901234567890
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=1440
OMNIROUTE_API_KEY=local-dev-key
OMNIROUTE_BASE_URL=http://localhost:20128/v1
OMNIROUTE_MODEL=default
YOUTUBE_API_KEY=your_youtube_api_key
MEDIUM_ANALYSIS_MODEL_NAME=all-MiniLM-L6-v2
```

### Installation

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

---

## 2. Validation Scenarios

### Scenario 1: Health & Auth Verification

1. Run application server: `uvicorn app.main:app --reload`
2. Register user: `POST /auth/register`
3. Login user: `POST /auth/login` -> Verify `access_token` returned.

### Scenario 2: Search & Local Medium Analysis

1. `POST /search` with `{ "query": "React Hooks" }` -> Verify 10 candidates returned with status `pending`.
2. `POST /search/{resource_id}/analyze-medium` -> Verify local CPU `SentenceTransformer` scores relevance, depth, coverage without calling OmniRoute.

### Scenario 3: Upload / Selection & Strong Analysis

1. `POST /resources/upload` (PDF file) or `POST /resources/{id}/select`.
2. Poll `GET /jobs/{job_id}` until `status == "done"`.
3. Fetch `GET /analyses/{analysis_id}` and `GET /knowledge-graph/material/{analysis_id}` -> Verify concept graph extraction.

### Scenario 4: Interactive Aids & Caching

1. Call `GET /resources/{id}/summary` twice.
2. Verify 1st request generates via OmniRoute and writes to Redis; 2nd request returns instantly (< 50ms) from Redis.

### Scenario 5: Exam Quiz, Competency Update, & Passport

1. Call `POST /exams/quiz/start` with `resource_id`.
2. Submit answers to `POST /exams/quiz/{assessment_id}/submit`.
3. Call `GET /passport/{user_id}` -> Verify competency score updated via Exponential Moving Average (EMA `α = 0.4`).
