# Feature Specification: Student Skill Intelligence Frontend

**Feature Branch**: `frontend-student-skill-intelligence`
**Created**: 2026-09-06
**Status**: Draft
**Input**: Build a React frontend for the existing FastAPI backend using the supplied design, frontend plan, and build checklist.

## User Scenarios & Testing

### User Story 1 - Authenticate and orient (Priority: P1)

As a student, I want to register or sign in and land on a home view that shows my current competency, skill graph, gaps, resources, and next actions.

**Independent Test**: Register a user, sign in, reload the app, and verify `GET /auth/me` hydrates the session and the protected home route renders empty states for a new account.

### User Story 2 - Find and ingest learning material (Priority: P1)

As a student, I want to search YouTube candidates or upload a PDF/YouTube URL, review medium analysis, select material, and follow its background analysis to completion.

**Independent Test**: Search, analyze one candidate, select or upload it, poll its job through `queued`/`processing` to `done`, and open the resulting resource detail page.

### User Story 3 - Study analyzed material (Priority: P1)

As a student, I want to inspect the transcript, chapters, concepts, material graph, summary, flashcards, and casual quiz for a strongly analyzed resource.

**Independent Test**: Open a completed resource and verify each AI panel loads independently, tolerates untyped JSON, and can display retry and empty states.

### User Story 4 - Measure and improve competency (Priority: P1)

As a student, I want to take an adaptive quiz or AI interview and see feedback reflected in my passport, gaps, and skill graph.

**Independent Test**: Start and submit a quiz with each supported question type, complete an interview by status, then refetch the competency views.

## Requirements

### Functional Requirements

- **FR-001**: The app MUST use React + Vite, TypeScript, Tailwind CSS, React Router, TanStack Query, and lucide-react.
- **FR-002**: The app MUST centralize JSON requests, bearer-token injection, API error parsing, and global `401` session clearing/redirect behavior.
- **FR-003**: Public register and login flows MUST validate inputs and display human-readable backend errors; all other application pages MUST be protected.
- **FR-004**: The app MUST implement search, pagination, client-side result filters, medium analysis, resource selection, PDF/URL upload, and job polling.
- **FR-005**: The app MUST stop job polling on `done` or `failed`, route successful jobs to resource detail, and expose retryable failure states.
- **FR-006**: The app MUST render home, search, resource detail, adaptive quiz, AI interview, full skill graph, and passport views against the backend endpoints.
- **FR-007**: Untyped LLM responses MUST be rendered defensively without assuming fixed field names, array lengths, or question counts.
- **FR-008**: Quiz answers MUST remain keyed by `question_id`; interview flow MUST end only when the backend returns `status: "completed"` and `question: null`.
- **FR-009**: Competency colors MUST be paired with scores or labels and MUST retain their defined semantic meaning across graph, passport, and gap views.
- **FR-010**: The frontend bundle MUST receive only `VITE_API_BASE_URL`; backend secrets MUST never be included in frontend source or build output.
- **FR-011**: Layouts MUST collapse to one column below 768px, expose visible keyboard focus states, and respect reduced-motion preferences.

### Key Entities

- **User session**: JWT access token and hydrated user profile.
- **Resource**: User-owned YouTube or uploaded learning material with status and optional medium analysis.
- **Analysis job**: User-scoped asynchronous job with `queued`, `processing`, `done`, or `failed` state.
- **Strong analysis**: Transcript/text, topics, concepts, relationships, and important sections for a resource.
- **Student competency**: Skill node score, timestamp, evidence, prerequisites, and gap state.
- **Assessment**: Quiz questions/answers/results or an interview session with turn-by-turn evaluation.

## Success Criteria

- **SC-001**: A new user can complete registration or login and reach a protected home page without exposing backend credentials.
- **SC-002**: A user can complete search or upload intake and reach a strongly analyzed resource detail view through job polling.
- **SC-003**: Resource detail independently renders analysis, graph, summary, flashcards, and casual quiz content with retryable failures.
- **SC-004**: Quiz and interview submissions display feedback and refresh the student’s passport, gaps, and graph data.
- **SC-005**: All listed flows remain usable on mobile-sized layouts and via keyboard navigation.

## Assumptions

- The FastAPI backend is available at `VITE_API_BASE_URL` and exposes the routes documented in `contracts/api.md`.
- The backend remains the source of truth for authentication, resource ownership, analysis state, and competency calculations.
- The frontend does not implement institutional dashboards, multi-user comparison, portfolio export, or backend changes in v1.
