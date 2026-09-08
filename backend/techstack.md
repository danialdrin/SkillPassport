# Tech Stack — AI-Powered Student Skill Intelligence Platform (Backend)

**Decisions locked from your answers:** Python-only monorepo (FastAPI), MongoDB for everything including the knowledge graph, Redis for cache only, **local SentenceTransformer-based scoring for Medium Analysis (no LLM cost)**, **Groq through the OpenAI Responses API for Strong Analysis and all LLM-dependent generation/grading**, plain JWT auth, local dev only (no Docker for now).

---

## 1. Core Framework

| Tech             | Purpose                                                                                     | Why this, not alternatives                                                                                                                                                                                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **FastAPI**      | The entire backend — routing, auth, business logic, orchestration, LLM calls, YouTube calls | Async-native (matters a lot since Strong Analysis and generation calls hit OmniRoute over HTTP, and Search hits YouTube), automatic OpenAPI docs (`/docs`) which doubles as your API documentation for the report with zero extra work, Pydantic-based validation built in |
| **Uvicorn**      | ASGI server to actually run FastAPI                                                         | Standard pairing, `uvicorn main:app --reload` for dev                                                                                                                                                                                                                      |
| **Python 3.11+** | Language                                                                                    | Required by FastAPI's async features and current library support                                                                                                                                                                                                           |

**Action:** `pip install fastapi "uvicorn[standard]"`

---

## 2. Database & Cache

| Tech                 | Purpose                                                                                                                                                                                  | Why                                                                                                                                                                                                                                                                                                                                   |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **MongoDB**          | Single source of truth for everything: users, resources, analyses, concepts, skill_nodes, kg_edges, student_kg_state, assessments, attempts, interview_sessions, competency_events, jobs | You explicitly chose document-based graph storage over Neo4j — this is the right call for a 3-day solo build; a document DB with `from_id`/`to_id` edge documents supports everything you need (traversal via app-level BFS, not native graph queries) without adding a second database technology to learn/debug under time pressure |
| **Motor**            | Async MongoDB driver for Python                                                                                                                                                          | FastAPI is async end-to-end; using the sync `pymongo` driver directly in async route handlers would block the event loop under load. Motor is the async-native counterpart                                                                                                                                                            |
| **Redis**            | Cache only — generated summaries/quizzes/flashcards keyed by `{analysis_id}:{version}`                                                                                                   | Explicitly non-authoritative per your design — if it's flushed, nothing is lost, content just regenerates on next request                                                                                                                                                                                                             |
| **redis-py (async)** | Redis client                                                                                                                                                                             | `redis.asyncio` module ships with the modern `redis` package — no need for `aioredis` separately (it's deprecated/merged)                                                                                                                                                                                                             |

**Action:**

```
pip install motor redis
```

Install MongoDB + Redis locally (or use MongoDB Atlas free tier / Redis Cloud free tier if you don't want local services running — either works for local dev, just point the connection string in `.env`).

---

## 3. Auth

| Tech                          | Purpose            | Why                                                                                         |
| ----------------------------- | ------------------ | ------------------------------------------------------------------------------------------- |
| **python-jose[cryptography]** | Encode/decode JWTs | Standard, well-documented FastAPI pairing                                                   |
| **passlib[bcrypt]**           | Password hashing   | Never store plain-text passwords, even in a college project — bcrypt is the standard choice |

**Action:** `pip install "python-jose[cryptography]" "passlib[bcrypt]"`

**Flow:** `POST /auth/register`, `POST /auth/login` → returns JWT → every protected route uses a shared `get_current_user` dependency that decodes the token and rejects on failure/expiry.

---

## 4. Medium Analysis Engine (Local, Non-LLM)

| Tech                      | Purpose                                                                                                                                                                                 | Why                                                                                                                                                                                                                                                                                                  |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **sentence-transformers** | Embed the search query and candidate video transcripts/segments so relevance, topic coverage, depth, and redundancy can be scored via cosine similarity — entirely offline, no API call | This is the module that runs on _every_ candidate on a results page (potentially 10+ per search) — the whole point is that it must not cost LLM tokens or add network latency per video. A small pretrained model (`all-MiniLM-L6-v2`) is fast enough on CPU for this scale and needs no fine-tuning |
| **numpy**                 | Cosine similarity math between embedding vectors                                                                                                                                        | Trivial to compute directly (`np.dot(a, b) / (norm(a) * norm(b))`) without pulling in a heavier ML library                                                                                                                                                                                           |
| **textstat**              | Readability scoring (Flesch Reading Ease) for the **Clarity** factor                                                                                                                    | Purpose-built for this single job — don't reinvent readability scoring                                                                                                                                                                                                                               |

**Action:** `pip install sentence-transformers numpy textstat`

**Load the model once at startup**, not per-request:

```python
from sentence_transformers import SentenceTransformer
model = SentenceTransformer("all-MiniLM-L6-v2")  # loaded once, reused across all requests
```

See `plan.md` §3 for exactly how each scoring factor (relevance, topic coverage, depth, examples, clarity, structure, redundancy) is derived from these embeddings + heuristics.

---

## 5. LLM Layer — Groq OpenAI Responses API (Strong Analysis + all downstream generation)

| Tech                        | Purpose                                                                                                                                                 | Why                                                                                                                                                |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Groq**                    | The only external LLM provider — used for Strong Analysis, summaries, quizzes, flashcards, exam generation/grading, and interview generation/evaluation | Medium Analysis deliberately does **not** use an LLM, while all generation and grading calls share one Groq model through the OpenAI Responses API |
| **openai (python package)** | OpenAI-compatible client for Groq's Responses API                                                                                                       | Avoids hand-rolling HTTP calls and supports `responses.create` with the configured Groq endpoint                                                   |

**Action:** `pip install openai`

```python
from openai import OpenAI
client = OpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=GROQ_API_KEY,
)
```

**Single model config:** since Medium Analysis no longer uses an LLM at all, the application uses one Groq model, `openai/gpt-oss-20b`, for all LLM-dependent workflows.

---

## 5. Content Ingestion

| Tech                                                   | Purpose                                                               | Why                                                                                                                                                                                                |
| ------------------------------------------------------ | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **google-api-python-client** (or direct `httpx` calls) | YouTube Data API v3 — `search.list` for Module 1                      | Official client if you want convenience; direct REST via `httpx` is equally fine and one less dependency — your call, both are documented                                                          |
| **youtube-transcript-api**                             | Pull YouTube video transcripts without downloading/transcribing audio | This is the single biggest scope-saver in this whole build — it eliminates the need for Whisper/audio transcription entirely for the YouTube path. Free, no API key needed, works off the video ID |
| **PyMuPDF (fitz)**                                     | Extract text page-by-page from uploaded PDFs                          | Fast, preserves page numbers (needed for citing "page 12" the way the spec preserves timestamps for video), simpler API than `pdfplumber` for pure text extraction                                 |

**Action:** `pip install google-api-python-client youtube-transcript-api pymupdf httpx`

**Note:** Raw video file upload + audio transcription (Whisper) is explicitly **out of scope** for this build — only YouTube-link ingestion and PDF upload are supported content sources for v1.

---

## 6. Validation & Config

| Tech              | Purpose                                                                                | Why                                                                                                                                                                                 |
| ----------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Pydantic v2**   | Request/response schemas, and validating LLM JSON output before it's trusted and saved | Ships with FastAPI already — every LLM response should be parsed into a Pydantic model, not saved as raw dict, so malformed LLM output fails loudly instead of corrupting your data |
| **python-dotenv** | Load `.env` for API keys, DB URIs, JWT secret, model names                             | Keeps every secret out of source code                                                                                                                                               |

**Action:** `pip install python-dotenv`

---

## 7. Background Processing (deliberately minimal)

| Tech                          | Purpose                                                                | Why                                                                                                                                                                                                                                                                   |
| ----------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **FastAPI `BackgroundTasks`** | Run Strong Analysis (the slow step) without blocking the HTTP response | Given your 3-day timeline, a real job queue (Celery/RQ + broker) is not worth the setup/debugging time. `BackgroundTasks` + a `jobs` collection for status polling gets you the same _user experience_ (non-blocking, pollable status) with zero extra infrastructure |
| **`jobs` collection (Mongo)** | Track `queued → processing → done/failed` status per long-running task | Frontend (built later) polls `GET /jobs/{id}` — same interface a real queue would expose, so upgrading to Celery post-deadline is a drop-in replacement, not a rewrite                                                                                                |

**Explicitly not used for this build:** Celery, RQ, Kafka, Docker. These are legitimate "Future Scope" line items for your report's Chapter 6, not build tasks for the next 3 days.

---

## 8. Dev Tools

| Tech                                                | Purpose                                                                                                                        |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **`/docs` (Swagger UI, auto-generated by FastAPI)** | Your live API reference and manual testing tool — use this instead of building/maintaining a separate Postman collection       |
| **pytest** (optional, only if Day 3 has slack)      | Basic tests for the Competency Engine's scoring math, since that's the one place a silent bug would be hard to notice visually |

---

## 9. Full `requirements.txt`

```
fastapi
uvicorn[standard]
motor
redis
python-jose[cryptography]
passlib[bcrypt]
openai
sentence-transformers
numpy
textstat
google-api-python-client
youtube-transcript-api
pymupdf
httpx
python-dotenv
pydantic
```

## 10. `.env` template

```
MONGO_URI=mongodb+srv://dani9629198934dani_db_user:SxGJSGhhNqTWuD6R@cluster0.d84ctwd.mongodb.net/?appName=Cluster0
MONGO_DB_NAME=skill_intelligence
REDIS_URL=redis://default:R7MjAPdAkNtKcTNBqcMjHcqUJLXWGUiE@matchless-marvellous-topiary-27115.db.redis.io:17312
JWT_SECRET=<generate a random 32+ char string>
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=1440
GROQ_API_KEY=<your key>
GROQ_BASE_URL=https://api.groq.com/openai/v1
GROQ_MODEL=openai/gpt-oss-20b
MEDIUM_ANALYSIS_MODEL_NAME=all-MiniLM-L6-v2
```

**Important:** `GROQ_API_KEY` must be provided through the environment. Never place a real key in source code, documentation, or committed environment files.
