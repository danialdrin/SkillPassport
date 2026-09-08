# Technical Research & Architecture Decisions — Backend Logic

## Overview
This document consolidates research and design decisions for the AI-Powered Student Skill Intelligence Platform backend.

---

## Technical Decisions

### 1. Framework & Runtime
- **Decision**: Python 3.11+ with FastAPI and Uvicorn.
- **Rationale**: FastAPI provides async-native execution (essential for concurrent OmniRoute LLM HTTP calls, YouTube Data API, and database operations), auto-generates OpenAPI (`/docs`), and has standard integration with Pydantic v2.
- **Alternatives Considered**:
  - Flask / Django: Synchronous by default, heavier overhead, manual OpenAPI documentation generation.

### 2. Database & Data Model (MongoDB + Motor)
- **Decision**: MongoDB (single DB instance via Motor async driver) storing all document collections including graph nodes (`skill_nodes`) and graph edges (`kg_edges`).
- **Rationale**:
  - Avoids dual-database complexity (e.g. Postgres + Neo4j) during a tight build window.
  - Document structure naturally fits hierarchical analysis outputs (topics, subtopics, concepts, timestamps/pages).
  - Graph traversal for material concept maps and student skill trees can be handled efficiently via in-memory BFS/DFS queries over edge documents.
- **Alternatives Considered**:
  - Neo4j / NetworkX: Adds external infrastructure dependency and network overhead for graph operations.

### 3. Caching Strategy (Redis)
- **Decision**: Redis (via `redis.asyncio`) used strictly as an ephemeral cache for generated study aids (`summary:{analysis_id}:{version}`, `quiz:...`, `flashcards:...`).
- **Rationale**:
  - Prevents redundant OmniRoute LLM calls for repeated summary/quiz requests.
  - Disposable: system degrades gracefully on cache flush (re-generates on miss) without risking competency or user data loss.
  - Interview sessions are explicitly stored in MongoDB (`interview_sessions`) for durable multi-turn state rather than ephemeral Redis cache.

### 4. Medium Analysis Engine (Local CPU Embedding & Heuristics)
- **Decision**: SentenceTransformers (`all-MiniLM-L6-v2`) + NumPy cosine similarity + `textstat` readability heuristics.
- **Rationale**:
  - Evaluates search candidates locally on CPU with zero LLM API token cost and zero external LLM latency.
  - Evaluates 7 distinct quality/relevance factors: Relevance, Topic Coverage, Depth, Examples, Clarity, Structure, Redundancy.
  - Model is instantiated once at app startup as a singleton service to prevent reload latency per request.
- **Alternatives Considered**:
  - Calling LLM for candidate scoring: Prohibitively expensive and slow for 10+ YouTube search candidates per query.

### 5. Deep Semantic Analysis & Content Generation (OmniRoute LLM)
- **Decision**: OmniRoute LLM endpoint (`http://localhost:20128/v1`) using OpenAI python client library with strict Pydantic JSON response parsing.
- **Rationale**:
  - Single local LLM gateway endpoint for deep content analysis, quiz question generation, short-answer grading with partial credit, and interview turn responses.
  - Uses `BackgroundTasks` + MongoDB `jobs` collection to decouple long-running analysis requests from HTTP response cycles.

### 6. Competency Engine (Exponential Moving Average)
- **Decision**: Competency score updated per node using EMA formula: `new_score = α * raw_score * 100 + (1 - α) * old_score` where `α = 0.4`.
- **Rationale**:
  - Balances recent student performance against historical attempts without losing context.
  - Fast compute-on-write operation triggered by `competency_events`.
  - Baseline score initialized to `raw_score * 100` on first event.

### 7. Content Ingestion (YouTube & PDF)
- **Decision**: YouTube transcripts fetched via `youtube-transcript-api` (no raw video audio downloading or Whisper processing needed). PDF text extracted via `PyMuPDF` (`fitz`) maintaining page-number context.
- **Rationale**:
  - Scope-saving architecture that eliminates heavyweight audio transcription pipelines while preserving exact content references (timestamps for YouTube, page numbers for PDF).

---

## Architecture Summary Table

| Module | Core Tech | Data Storage | LLM / Model Used |
|---|---|---|---|
| Auth & Security | FastAPI, python-jose, passlib | MongoDB (`users`) | None |
| Search | YouTube Data API v3 | MongoDB (`resources`) | None |
| Medium Analysis | SentenceTransformers, textstat | MongoDB (`resources.medium_analysis`) | `all-MiniLM-L6-v2` (Local CPU) |
| Selection & Upload | PyMuPDF, youtube-transcript-api | MongoDB (`resources`) | None |
| Strong Analysis | OmniRoute LLM, BackgroundTasks | MongoDB (`analyses`, `jobs`) | OmniRoute LLM |
| Knowledge Graph | Motor, PyMongo | MongoDB (`skill_nodes`, `kg_edges`) | None |
| Interactive Aids | Redis (`redis.asyncio`) | Redis (Cache), Mongo (`analyses`) | OmniRoute LLM (Cache Miss) |
| Exam Quiz & Interview | FastAPI, Motor | MongoDB (`assessments`, `attempts`, `interview_sessions`) | OmniRoute LLM |
| Competency & Passport | Competency Engine (EMA) | MongoDB (`competency_events`, `student_kg_state`) | None |
