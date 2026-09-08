# Implementation Plan: AI-Powered Student Skill Intelligence Platform Backend

**Branch**: `001-backend` | **Date**: 2026-09-04 | **Spec**: [spec.md](file:///media/SharedMemory/project/final%20year%20project/1/specs/001-backend/spec.md)

---

## Summary

Build the Python FastAPI monorepo backend for the AI-Powered Student Skill Intelligence Platform. The backend provides YouTube search and local SentenceTransformer-based Medium Analysis (zero LLM cost), PDF/YouTube ingestion with OmniRoute LLM Strong Analysis, dual Material & Student Knowledge Graphs in MongoDB, Redis-cached interactive study aids, adaptive Exam Quizzes and multi-turn Interviews, and an EMA-based Digital Skill Passport Competency Engine.

---

## Technical Context

**Language/Version**: Python 3.11+  
**Primary Dependencies**: FastAPI, Uvicorn, Motor (Async Mongo), redis.asyncio, SentenceTransformers, OpenAI client (for OmniRoute), PyMuPDF (`fitz`), youtube-transcript-api, python-jose, passlib, textstat, Pydantic v2  
**Storage**: MongoDB (documents + graph nodes/edges), Redis (ephemeral cache only)  
**Testing**: `pytest` for Competency Engine EMA math & FastAPI TestClient for endpoints  
**Target Platform**: Linux server / Local Uvicorn (`http://localhost:8000`)  
**Project Type**: Async Web Service API (`web-service`)  
**Performance Goals**: Medium Analysis < 3s per 10-video batch on CPU; Redis cache hits < 50ms; non-blocking background Strong Analysis  
**Constraints**: Solo build, 3 working days deadline, local OmniRoute LLM service running on `localhost:20128`, zero LLM calls in Medium Analysis  
**Scale/Scope**: P0 core endpoints (Auth, Search/Medium Analysis, Selection/Upload, Strong Analysis, KG, Exam Quiz/Interview, Competency Engine, Skill Passport)  

---

## Constitution Check

*GATE: Passed*

1. **Library-First / Modular Architecture**: Services (`llm_service`, `embedding_service`, `medium_analysis_service`, `strong_analysis_service`, `kg_service`, `competency_service`) are decoupled from FastAPI router handlers.
2. **Standard API Protocol**: JSON request/response over HTTP with JWT authentication.
3. **No Unjustified Overhead**: Single MongoDB instance for document & graph storage; Redis strictly as non-authoritative cache.
4. **Resilience & Safety**: Ephemeral Redis failure does not lose competency data; background task job polling prevents HTTP timeouts.

---

## Project Structure

### Documentation (this feature)

```text
specs/001-backend/
├── plan.md              # Implementation Plan
├── research.md          # Technical research & decisions
├── data-model.md        # MongoDB collection schemas & indexes
├── quickstart.md        # Validation guide & run instructions
└── contracts/
    └── api-routes.md    # REST API contracts
```

### Source Code (repository root)

```text
app/
├── main.py                    # FastAPI entry point & lifespan hooks
├── core/
│   ├── config.py              # Environment settings (pydantic-settings)
│   ├── security.py            # Password hashing & JWT helper
│   └── deps.py                # get_current_user, get_db, get_redis dependencies
├── db/
│   ├── mongo.py               # Motor client & collection handles
│   └── redis_client.py        # redis.asyncio connection pool
├── models/                    # Pydantic schemas per domain
│   ├── user.py
│   ├── resource.py
│   ├── analysis.py
│   ├── knowledge_graph.py
│   ├── assessment.py
│   └── passport.py
├── routers/                   # Router endpoints matching API contracts
│   ├── auth.py
│   ├── search.py
│   ├── resources.py           # Upload & selection
│   ├── analysis.py            # Strong analysis trigger & job polling
│   ├── knowledge_graph.py
│   ├── interactive.py         # Summary / quiz / flashcards (Redis cached)
│   ├── exams.py                # Exam quiz & multi-turn interview
│   └── passport.py            # Passport & gap analysis
├── services/                  # Core business logic
│   ├── youtube_service.py
│   ├── transcript_service.py
│   ├── pdf_service.py
│   ├── llm_service.py         # OmniRoute client wrapper
│   ├── embedding_service.py   # SentenceTransformer singleton & cosine similarity
│   ├── medium_analysis_service.py  # Local CPU non-LLM scoring
│   ├── strong_analysis_service.py  # Async LLM analysis & Pydantic validation
│   ├── kg_service.py          # Node deduplication & edge builder
│   ├── exam_service.py        # Question generation & partial credit grading
│   └── competency_service.py  # Exponential Moving Average engine
└── utils/
    └── json_extract.py        # LLM JSON fence stripper & validator
```

---

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Dual Graph (Material vs Student) | Separates static content concept maps from dynamic student mastery state | Storing competency on content nodes causes state pollution across multiple students |
| Background Job Polling | Strong Analysis LLM processing takes 15-45s per resource | Synchronous blocking HTTP requests hit client timeouts |
