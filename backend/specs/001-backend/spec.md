# Feature Specification: AI-Powered Student Skill Intelligence Platform — Backend Logic

**Feature Branch**: `001-backend`  
**Created**: 2026-09-04  
**Status**: Specified  

**Input**: Derived from `plan.md`, `techstack.md`, and `BUILD_INSTRUCTIONS.md`

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Candidate Discovery & Medium Analysis (Priority: P1)
As a student searching for learning resources on a topic (e.g. "React Hooks"), I want to see a ranked list of candidate YouTube videos with instant, zero-LLM local relevance and quality scores so that I can decide which resource to study deeply without burning external API tokens.

**Why this priority**: Core entry point for resource discovery. Must run locally without LLM costs to scale per candidate video.

**Independent Test**: Can be tested by invoking `POST /search` with a query, then `POST /search/{resource_id}/analyze-medium`, verifying sentence-transformer embeddings and textstat heuristics return a 0-100 score without calling OmniRoute.

**Acceptance Scenarios**:
1. **Given** a query string "React Hooks", **When** `POST /search` is called, **Then** up to 10 YouTube candidates are retrieved and saved with status `pending`.
2. **Given** a candidate resource, **When** `POST /search/{resource_id}/analyze-medium` is called, **Then** `youtube-transcript-api` pulls the transcript, local `SentenceTransformer` computes embeddings, 7 quality/relevance factors are derived, and `resources.medium_analysis` is updated with status `medium_analyzed`.

---

### User Story 2 - Upload & Strong Analysis Knowledge Extraction (Priority: P1)
As a student uploading a PDF or selecting a YouTube video, I want deep semantic analysis performed via OmniRoute LLM so that detailed topics, concepts, bloom levels, timestamps/pages, and relationships are extracted into a Material Knowledge Graph.

**Why this priority**: Essential upstream dependency for all downstream interactive modules, exams, and competency tracking.

**Independent Test**: Can be tested by selecting a resource or uploading a PDF, polling `GET /jobs/{job_id}`, and inspecting `GET /analyses/{analysis_id}` and `GET /knowledge-graph/material/{analysis_id}`.

**Acceptance Scenarios**:
1. **Given** a PDF upload or selected YouTube resource, **When** `POST /resources/upload` or `POST /resources/{id}/select` is called, **Then** a background job is started, text is extracted/chunked, OmniRoute is called with strict Pydantic JSON schemas, and `analyses`, `concepts`, `skill_nodes`, and `kg_edges` are saved.
2. **Given** an ongoing strong analysis, **When** `GET /jobs/{job_id}` is polled, **Then** state transitions from `queued` -> `processing` -> `done`/`failed`.

---

### User Story 3 - Exam Module & Adaptive Assessment (Priority: P1)
As a student, I want to take quizzes and interactive interviews on analyzed materials with question difficulty adapted to my current competency, receiving partial credit for open answers.

**Why this priority**: Mandatory mechanism for producing `competency_events` evidence to update the student's knowledge state.

**Independent Test**: Can be tested by calling `POST /exams/quiz/start`, submitting answers to `POST /exams/quiz/{assessment_id}/submit`, and starting/responding to multi-turn interviews via `POST /exams/interview/start` and `POST /exams/interview/{session_id}/answer`.

**Acceptance Scenarios**:
1. **Given** an analyzed resource, **When** `POST /exams/quiz/start` is called, **Then** questions are generated with difficulty conditioned on `student_kg_state`.
2. **Given** an active quiz, **When** `POST /exams/quiz/{id}/submit` is called, **Then** MCQs are graded binary, short answers get LLM partial scores (0.0–1.0), and `competency_events` docs are recorded.
3. **Given** an interview session, **When** `POST /exams/interview/{id}/answer` is called, **Then** turn answer is evaluated, history saved in Mongo, and next question generated dynamically.

---

### User Story 4 - Digital Skill Passport & Competency Engine (Priority: P1)
As a student, I want an authoritative Digital Skill Passport that calculates my competency scores using an Exponential Moving Average (EMA) from exam evidence and shows proven knowledge gaps.

**Why this priority**: Core value proposition showing personal mastery and proven learning progress.

**Independent Test**: Can be tested by taking exam quizzes/interviews and calling `GET /passport/{user_id}` and `GET /passport/{user_id}/gaps` to verify EMA calculations and gap identification.

**Acceptance Scenarios**:
1. **Given** new `competency_events`, **When** the Competency Engine processes them, **Then** `student_kg_state` updates score via `α * raw_score * 100 + (1 - α) * old_score` (α = 0.4).
2. **Given** a passport request `GET /passport/{user_id}`, **Then** scores are joined with `skill_nodes` display names and evidence provenance IDs.

---

### User Story 5 - Interactive Study Aids (Summary, Quiz, Flashcards) (Priority: P2)
As a student, I want fast access to AI-generated summaries, practice quizzes, and flashcards cached in Redis so that I can study efficiently.

**Why this priority**: Secondary engagement feature (P1 tier in plan: build if time permits / interactive aids).

**Independent Test**: Can be tested by requesting `GET /resources/{id}/summary`, `/quiz`, `/flashcards` and confirming Redis cache hits on subsequent requests.

**Acceptance Scenarios**:
1. **Given** a request for `/summary`, `/quiz`, or `/flashcards`, **When** key `type:{analysis_id}:{version}` exists in Redis, **Then** cached content is returned immediately.
2. **Given** a cache miss, **When** requested, **Then** OmniRoute generates artifact, saves to Redis with 7-day TTL, and returns artifact.

---

### Edge Cases
- **Missing Captions**: YouTube video has no transcript available -> Fall back to title + description with conservative medium analysis score and flag `transcript_available: false`.
- **Malformed LLM Output**: OmniRoute returns non-JSON or invalid schema -> Retry once with strict prompt enforcement; on failure, mark job as `failed` with diagnostic error message.
- **Flushed Redis Cache**: Redis is cleared or restarted -> System automatically regenerates summaries/quizzes on demand without losing any Mongo-backed competency or analysis data.
- **Consecutive Failed Exam Attempts**: Low score exam submissions -> `competency_events` recorded with low raw scores, driving down EMA competency score appropriately without deleting historical evidence.

---

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: Auth system MUST handle user registration, password hashing (`passlib/bcrypt`), login, and JWT generation/validation via FastAPI dependencies.
- **FR-002**: System MUST integrate YouTube Data API v3 for candidate discovery and `youtube-transcript-api` for caption retrieval.
- **FR-003**: System MUST execute Medium Analysis locally using `SentenceTransformer("all-MiniLM-L6-v2")`, `numpy`, and `textstat` for 7 scoring factors (relevance, coverage, depth, examples, clarity, structure, redundancy) WITHOUT calling external LLM APIs.
- **FR-004**: System MUST perform Strong Analysis using OmniRoute LLM (`http://localhost:20128/v1`) with strict Pydantic schema validation for topics, concepts, bloom levels, timestamps/pages, and relationships.
- **FR-005**: System MUST maintain distinct Material Knowledge Graph (`skill_nodes` + `kg_edges` tagged with `material_id`) and Student Knowledge Graph (`student_kg_state` per user).
- **FR-006**: System MUST run Strong Analysis asynchronously via FastAPI `BackgroundTasks` and track status in a Mongo `jobs` collection.
- **FR-007**: System MUST provide Exam Quiz and multi-turn Interview modules, grading open questions with partial credit (0.0-1.0) and writing `competency_events`.
- **FR-008**: System MUST compute student competency using Exponential Moving Average (`α = 0.4`) upon receipt of `competency_events`.
- **FR-009**: System MUST cache interactive study aids (summary, practice quiz, flashcards) in Redis using versioned keys (`{artifact}:{analysis_id}:{version}`).
- **FR-010**: System MUST support PDF text extraction using `PyMuPDF` (`fitz`) with page-number tracking.

### Key Entities
- **User**: `_id, name, email, password_hash, created_at`
- **Resource**: `_id, user_id, source_type ("youtube"|"pdf"), url_or_file, title, status, medium_analysis, created_at`
- **Analysis**: `_id, resource_id, transcript_or_text, concepts, topics, relationships, created_at, version`
- **Concept / SkillNode**: `_id, name, description, bloom_level, parent_id, prerequisite_ids, type`
- **KGEdge**: `_id, from_node_id, to_node_id, relation, material_id`
- **StudentKGState**: `_id, user_id, node_id, competency_score, last_updated, evidence_event_ids`
- **Assessment & Attempt**: `_id, user_id, resource_id, type ("quiz"|"interview"), questions, answers, score, per_question_result`
- **InterviewSession**: `_id, user_id, resource_id, turns, status`
- **CompetencyEvent**: `_id, user_id, node_id, source, raw_score, weight, ref_id, created_at`
- **Job**: `_id, type, status ("queued"|"processing"|"done"|"failed"), payload, result, created_at`

---

## Success Criteria *(mandatory)*

### Measurable Outcomes
- **SC-001**: Medium Analysis processes a 10-candidate YouTube search batch locally in < 3 seconds on CPU.
- **SC-002**: Strong Analysis extracts structured JSON validated against Pydantic schemas without crashing or losing required fields.
- **SC-003**: Exam submissions update the Digital Skill Passport competency scores immediately via the EMA algorithm.
- **SC-004**: Subsequent requests for generated summaries, flashcards, or quizzes return in < 50ms from Redis cache.
- **SC-005**: 100% of protected API endpoints enforce JWT authorization and derive `user_id` strictly from token claims.
