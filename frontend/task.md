# Frontend Implementation Tasks: Student Skill Intelligence Platform

**Branch**: `frontend`  
**Status**: Ready for Implementation  
**Specification**: [frontend/spec.md](file:///media/SharedMemory/project/final%20year%20project/MySkills/frontend/spec.md)  
**Architecture & Plan**: [frontend/plan.md](file:///media/SharedMemory/project/final%20year%20project/MySkills/frontend/plan.md)  
**API Contracts**: [frontend/contracts/api.md](file:///media/SharedMemory/project/final%20year%20project/MySkills/frontend/contracts/api.md)

---

## Task Dependency Graph & Order

```
[Phase 0: Setup & Infrastructure]
    ├── TASK-001 (Vite + TS + Tailwind Design Tokens)
    ├── TASK-002 (API Client & Auth Interceptor)
    ├── TASK-003 (React Router & TanStack Query Setup)
    └── TASK-004 (shadcn Primitives & UI Foundation)
            │
            ▼
[Phase 1: Authentication & Session]
    ├── TASK-005 (AuthContext & Token Hydration)
    ├── TASK-006 (Registration Page & Form Validation)
    └── TASK-007 (Login Page & Protected Route Guard)
            │
            ▼
[Phase 2: Student Home Dashboard]
    ├── TASK-008 (Dashboard Layout & Competency Summary)
    ├── TASK-009 (SVG Student Skill Graph Preview)
    ├── TASK-010 (Passport Gaps Panel & Quick Action Tiles)
    └── TASK-011 (Recent Resources List & Status Badges)
            │
            ▼
[Phase 3: Resource Search, Intake & Job Polling]
    ├── TASK-012 (Search Page & Candidate Grid)
    ├── TASK-013 (Client Filters & Medium Analysis Action)
    ├── TASK-014 (Resource Selection & Polling Hook)
    └── TASK-015 (PDF & YouTube URL Upload Modal)
            │
            ▼
[Phase 4: Resource Detail & AI Study Tools]
    ├── TASK-016 (Resource Detail Layout & Video Player)
    ├── TASK-017 (Untyped LLM Content Normalizers)
    ├── TASK-018 (Material MindMap SVG Component)
    └── TASK-019 (Independent AI Study Panels)
            │
            ▼
[Phase 5: Adaptive Assessment Engine]
    ├── TASK-020 (Adaptive Quiz Start Flow)
    ├── TASK-021 (Dynamic Question Renderer)
    ├── TASK-022 (Quiz Submission & Feedback View)
    └── TASK-023 (Turn-by-Turn AI Technical Interview)
            │
            ▼
[Phase 6: Skill Graph & Digital Skill Passport]
    ├── TASK-024 (Interactive Student Skill Graph Page)
    ├── TASK-025 (Digital Skill Passport Page)
    ├── TASK-026 (Passport Gaps & Prerequisite Links)
    └── TASK-027 (Interview History Log View)
            │
            ▼
[Phase 7: Polish, Accessibility & Error Handling]
    ├── TASK-028 (Responsive Layout Reflow < 768px)
    ├── TASK-029 (Accessibility & Focus Rings)
    └── TASK-030 (Global Error States & Search 503 Banner)
            │
            ▼
[Phase 8: Production Build & QA]
    ├── TASK-031 (Build Bundle Verification & Secret Hygiene)
    └── TASK-032 (End-to-End Live Backend Acceptance Pass)
```

---

## Phase 0 — Foundation & Infrastructure Setup

### TASK-001: Project Setup & Design Token Configuration
- **Objective**: Initialize React + Vite + TypeScript application and configure Tailwind CSS with custom design tokens from `design.md`.
- **Dependencies**: None
- **Files to Create/Modify**:
  - `frontend/package.json`
  - `frontend/vite.config.ts`
  - `frontend/tailwind.config.js`
  - `frontend/src/index.css`
  - `frontend/index.html`
- **Design Tokens**:
  - `paper` (`#EEF2ED`), `surface` (`#F5F7F3`), `ink` (`#1C2430`), `ink-muted` (`#4A554E`), `line` (`#D8DDD3`)
  - Semantic Mastery Tokens: `mastered` (`#2F6F5E`), `developing` (`#C99A3E`), `gap` (`#A63D2F`)
  - Fonts: `Source Serif 4` (Headlines), `Inter` (UI/Body), `IBM Plex Mono` (Numerics)
- **Acceptance Criteria**:
  - `npm run dev` starts dev server without warnings.
  - Custom color tokens and font families are accessible as utility classes in Tailwind.

---

### TASK-002: API Client Infrastructure & Auth Interceptor
- **Objective**: Build centralized `apiClient.ts` wrapper with base URL resolution, JSON headers, bearer token injection, and global `401` interceptor.
- **Dependencies**: TASK-001
- **Files to Create/Modify**:
  - `frontend/src/api/client.ts`
  - `frontend/.env.example`
- **Technical Specs**:
  - Read base URL from `import.meta.env.VITE_API_BASE_URL`.
  - Automatically attach `Authorization: Bearer <token>` header if token exists in `localStorage`.
  - On HTTP `401 Unauthorized`: clear `localStorage` access token, notify auth context listener, and dispatch redirect to `/login`.
  - Parse error responses into a consistent `{ detail: string, status: number }` error structure.
- **Acceptance Criteria**:
  - Requests append Bearer token automatically when logged in.
  - API errors are parsed without unhandled promise rejections.

---

### TASK-003: React Router & TanStack Query Setup
- **Objective**: Establish application routing structure, QueryClient configuration, and root layout wrapper (`PageShell`, `TopBar`).
- **Dependencies**: TASK-001, TASK-002
- **Files to Create/Modify**:
  - `frontend/src/App.tsx`
  - `frontend/src/main.tsx`
  - `frontend/src/components/layout/PageShell.tsx`
  - `frontend/src/components/layout/TopBar.tsx`
- **Technical Specs**:
  - TanStack `QueryClient` configured with `staleTime: 1000 * 60 * 5` (5 mins) for static data, `retry: 1` for API queries.
  - Router setup with routes: `/login`, `/register`, `/`, `/search`, `/resources/:id`, `/quiz/:resourceId`, `/interview/:resourceId`, `/skill-graph`, `/passport`.
- **Acceptance Criteria**:
  - App renders `PageShell` header with active navigation links.
  - Page routes load cleanly without console errors.

---

### TASK-004: shadcn Primitives & UI Foundation
- **Objective**: Configure shadcn UI utility setup (`lib/utils.ts`) and install core UI components required across pages.
- **Dependencies**: TASK-001
- **Files to Create/Modify**:
  - `frontend/src/lib/utils.ts`
  - `frontend/src/components/ui/button.tsx`
  - `frontend/src/components/ui/card.tsx`
  - `frontend/src/components/ui/badge.tsx`
  - `frontend/src/components/ui/input.tsx`
  - `frontend/src/components/ui/tabs.tsx`
  - `frontend/src/components/ui/dialog.tsx`
  - `frontend/src/components/ui/skeleton.tsx`
  - `frontend/src/components/ui/alert.tsx`
  - `frontend/src/components/ui/table.tsx`
- **Acceptance Criteria**:
  - Components render consistently matching the design system colors and typography.

---

## Phase 1 — Authentication & Session Management

### TASK-005: AuthContext & Token Hydration
- **Objective**: Implement `AuthContext` managing authentication state, token storage, and initial hydration via `GET /auth/me`.
- **Dependencies**: TASK-002, TASK-003
- **Files to Create/Modify**:
  - `frontend/src/context/AuthContext.tsx`
  - `frontend/src/api/auth.ts`
  - `frontend/src/types/auth.ts`
- **API Endpoint**: `GET /auth/me`
- **Request/Response**:
  - Request: Header `Authorization: Bearer <token>`
  - Response: `{ user_id: string, name: string, email: string, created_at: string }`
- **State Requirements**:
  - `user`: `User | null`
  - `status`: `"loading" | "authenticated" | "anonymous"`
- **Acceptance Criteria**:
  - App start checks `localStorage` token; if present, calls `/auth/me` to hydrate profile.
  - Invalid or expired token (`401`) sets session to `"anonymous"` and purges token.

---

### TASK-006: User Registration Page
- **Objective**: Build registration view with client-side validation and API integration.
- **Dependencies**: TASK-004, TASK-005
- **Files to Create/Modify**:
  - `frontend/src/pages/Register.tsx`
  - `frontend/src/components/auth/RegisterForm.tsx`
- **API Endpoint**: `POST /auth/register`
- **Request Body**: `{ name: string, email: string, password: string }`
- **Response**: `201 Created` -> `{ user_id, name, email, created_at }`
- **Validation Rules**: Name (2-100 chars), valid email format, password (≥ 6 chars).
- **Error Handling**: Display backend error `detail` (e.g. `400 Email already registered`).
- **Acceptance Criteria**:
  - Form validates inputs inline before submission.
  - Successful registration navigates to `/login` with success feedback message.

---

### TASK-007: User Login Page & Protected Route Guard
- **Objective**: Build login page and `ProtectedRoute` component to secure application routes.
- **Dependencies**: TASK-005, TASK-006
- **Files to Create/Modify**:
  - `frontend/src/pages/Login.tsx`
  - `frontend/src/components/auth/LoginForm.tsx`
  - `frontend/src/components/auth/ProtectedRoute.tsx`
- **API Endpoint**: `POST /auth/login`
- **Request Body**: `{ email: string, password: string }`
- **Response**: `{ access_token: string, token_type: "bearer" }`
- **Behavior**:
  - On login success, store `access_token` in `localStorage`, hydrate session via `/auth/me`, and navigate to `/`.
  - `ProtectedRoute` redirects unauthenticated users to `/login`.
- **Acceptance Criteria**:
  - Accessing protected routes while unauthenticated redirects to `/login`.
  - Incorrect credentials render `401 Incorrect email or password` inline.

---

## Phase 2 — Student Home Dashboard

### TASK-008: Student Dashboard Layout & Competency Summary
- **Objective**: Implement student home dashboard (`/`) displaying orientation header, overall score chip, and asymmetric 2-column grid.
- **Dependencies**: TASK-003, TASK-005, TASK-007
- **Files to Create/Modify**:
  - `frontend/src/pages/Home.tsx`
  - `frontend/src/components/dashboard/ScoreChip.tsx`
  - `frontend/src/api/passport.ts`
- **API Endpoints**: `GET /passport/{user_id}`
- **Response Shape**: `{ user_id, nodes: PassportNodeItem[], updated_at }`
- **UI Logic**:
  - Calculate aggregate score as average of `nodes.competency_score` (or 0 if empty).
  - Format score chip with IBM Plex Mono font and apply semantic color (`mastered` ≥ 80, `developing` 60–79, `gap` < 60).
- **Acceptance Criteria**:
  - Dashboard renders student greeting and overall competency score chip.
  - Loading skeleton displays while passport data resolves.

---

### TASK-009: SVG Student Skill Graph Preview
- **Objective**: Build lightweight SVG skill graph preview component for dashboard hero right column.
- **Dependencies**: TASK-008
- **Files to Create/Modify**:
  - `frontend/src/components/graph/SkillGraphPreviewSvg.tsx`
  - `frontend/src/api/knowledge_graph.ts`
- **API Endpoint**: `GET /knowledge-graph/student/{user_id}`
- **Response Shape**: `{ user_id, skills: StudentKGStateItem[] }`
- **UI Logic**:
  - Render up to 8 top skill nodes as interactive SVG circles.
  - Node color mapped to competency score using semantic mastery tokens.
  - Link "View full skill graph" button to `/skill-graph`.
- **Acceptance Criteria**:
  - SVG graph scales dynamically within 420px panel.
  - Node entrance animation respects `prefers-reduced-motion`.

---

### TASK-010: Passport Gaps Panel & Quick Action Tiles
- **Objective**: Build priority gap recommendation list and quick action navigation tiles.
- **Dependencies**: TASK-008
- **Files to Create/Modify**:
  - `frontend/src/components/dashboard/GapRow.tsx`
  - `frontend/src/components/dashboard/ActionTile.tsx`
- **API Endpoint**: `GET /passport/{user_id}/gaps`
- **Response Shape**: `{ user_id, gaps: GapItem[] }`
- **UI Logic**:
  - Render gap rows with score badge, skill name, and recommended prerequisite tags.
  - Empty state when no gaps exist: "No gaps detected! Take an adaptive assessment to evaluate your knowledge."
  - Action tiles with left border accents for "Search Material", "Upload PDF/URL", "Take Quiz", "AI Interview".
- **Acceptance Criteria**:
  - Clicking action tiles navigates to corresponding flow.
  - Gaps render numeric scores alongside red accent lines.

---

### TASK-011: Recent Resources List & Status Badges
- **Objective**: Render current user's ingested resource history with mapped status badges.
- **Dependencies**: TASK-008
- **Files to Create/Modify**:
  - `frontend/src/components/resources/ResourceRow.tsx`
  - `frontend/src/components/resources/StatusBadge.tsx`
  - `frontend/src/api/resources.ts`
- **API Endpoint**: `GET /resources`
- **Response Shape**: `list[ResourceResponse]` (`resource_id, title, source_type, status, created_at`)
- **Status Mapping**:
  - `pending` -> "Not started" (gray badge)
  - `medium_analyzed` -> "Reviewed" (blue badge)
  - `selected` -> "Analyzing…" (yellow pulse badge)
  - `strong_analyzed` -> "Ready to study" (green badge)
- **Acceptance Criteria**:
  - List displays user's resources ordered by recency.
  - Clicking a `"strong_analyzed"` resource opens `/resources/:id`.

---

## Phase 3 — Resource Search, Intake & Job Polling

### TASK-012: Search Page & Candidate Grid
- **Objective**: Implement `/search` page featuring query search bar and candidate results grid.
- **Dependencies**: TASK-004, TASK-011
- **Files to Create/Modify**:
  - `frontend/src/pages/Search.tsx`
  - `frontend/src/components/search/SearchBar.tsx`
  - `frontend/src/components/search/CandidateCard.tsx`
- **API Endpoint**: `POST /search`
- **Request Body**: `{ query: string, page_token?: string }`
- **Response Shape**: `{ candidates: CandidateResourceResponse[], next_page_token?: string }`
- **Candidate Fields**: `resource_id, video_id, title, channel, thumbnail, description, is_mock, medium_analysis`
- **Acceptance Criteria**:
  - Submitting query renders candidate cards in responsive grid layout.
  - Cards render thumbnail, 2-line title clamp, channel name, and `is_mock` badge in dev mode.

---

### TASK-013: Client-Side Search Filters & Medium Analysis Action
- **Objective**: Implement client-side candidate list filtering and trigger local medium analysis scoring.
- **Dependencies**: TASK-012
- **Files to Create/Modify**:
  - `frontend/src/components/search/SearchFilterChips.tsx`
  - `frontend/src/api/search.ts`
- **API Endpoint**: `POST /search/{resource_id}/analyze-medium`
- **UI Logic**:
  - Filter chips: `All`, `With Transcript`, `Reviewed`, `Top Rated`.
  - "Analyze Quality" button triggers medium analysis endpoint; updates card with local CPU scores (`overall`, `relevance`, `clarity`, `depth`).
- **Acceptance Criteria**:
  - Filtering operates instantly on client-side candidate array without extra backend calls.
  - Medium analysis displays quality breakdown radar/chips.

---

### TASK-014: Resource Selection & Background Job Polling Hook
- **Objective**: Implement resource selection flow and custom `usePollJob` hook for background job tracking.
- **Dependencies**: TASK-012, TASK-013
- **Files to Create/Modify**:
  - `frontend/src/hooks/usePollJob.ts`
  - `frontend/src/api/jobs.ts`
- **API Endpoints**:
  - `POST /resources/{resource_id}/select` -> `{ resource_id, status: "selected", job_id, message }`
  - `GET /jobs/{job_id}` -> `JobResponse` (`job_id, status: "queued"|"processing"|"done"|"failed", result: { analysis_id, resource_id }`)
- **Polling Logic**:
  - Poll `GET /jobs/{job_id}` every 2000ms while status is `"queued"` or `"processing"`.
  - Stop polling on `"done"` or `"failed"`.
  - On `"done"`, invalidate `['resources']` query and navigate to `/resources/:resource_id`.
- **Acceptance Criteria**:
  - Selecting candidate initiates background job and displays polling progress indicator.
  - Navigates seamlessly to resource study view upon job completion.

---

### TASK-015: PDF & YouTube URL Intake Upload Modal
- **Objective**: Build upload modal supporting PDF file upload or direct YouTube URL ingestion.
- **Dependencies**: TASK-014
- **Files to Create/Modify**:
  - `frontend/src/components/resources/UploadModal.tsx`
- **API Endpoint**: `POST /resources/upload` (multipart form data)
- **Request Form Data**: `file` (PDF file) OR `url` (YouTube URL string)
- **Response**: `{ resource_id, title, status: "selected", job_id, message }`
- **Validation**: Ensure file is `.pdf` format or URL is valid YouTube format. Mutually exclusive selection.
- **Acceptance Criteria**:
  - Successfully uploading PDF or submitting URL starts Strong Analysis job and initiates `usePollJob`.
  - Non-PDF files trigger inline validation error.

---

## Phase 4 — Resource Detail & AI Study Tools

### TASK-016: Resource Detail Layout & Video/Transcript Player
- **Objective**: Implement two-column study layout (`/resources/:id`) featuring video player/text viewer and transcript tabs.
- **Dependencies**: TASK-003, TASK-011, TASK-014
- **Files to Create/Modify**:
  - `frontend/src/pages/ResourceDetail.tsx`
  - `frontend/src/components/study/VideoPlayer.tsx`
  - `frontend/src/components/study/TranscriptTab.tsx`
  - `frontend/src/api/analyses.ts`
- **API Endpoint**: `GET /analyses/{analysis_id}`
- **Response Shape**: `{ analysis_id, resource_id, transcript_or_text, extracted_data: { important_sections, topics, concepts } }`
- **UI Logic**:
  - Left column: Video player (for YouTube) or document viewer (for PDF), with chapter list and searchable transcript.
  - Right column: Tabbed AI study container ("Summary", "Flashcards", "Practice Quiz", "MindMap").
- **Acceptance Criteria**:
  - Clicking chapter timestamp syncs video playback position.
  - Transcript text renders cleanly with auto-scroll toggle.

---

### TASK-017: Untyped LLM Content Normalizers
- **Objective**: Create defensive normalizers for untyped LLM JSON responses to prevent rendering crashes.
- **Dependencies**: TASK-016
- **Files to Create/Modify**:
  - `frontend/src/utils/normalizers.ts`
- **Technical Specs**:
  - `normalizeSummary(raw: unknown)` -> returns `{ title: string, summary_points: string[], key_takeaway: string }` with safe fallbacks.
  - `normalizeFlashcards(raw: unknown)` -> returns `{ flashcards: Array<{ front: string, back: string }> }`.
  - `normalizePracticeQuiz(raw: unknown)` -> returns `{ quiz: Array<{ question: string, options: string[], answer: string, explanation: string }> }`.
- **Acceptance Criteria**:
  - Handles missing fields, nulls, and unexpected JSON structures without throwing runtime errors.

---

### TASK-018: Material MindMap SVG Component
- **Objective**: Build SVG radial concept graph for resource detail view.
- **Dependencies**: TASK-016
- **Files to Create/Modify**:
  - `frontend/src/components/study/MindMapSvg.tsx`
- **API Endpoint**: `GET /knowledge-graph/material/{analysis_id}`
- **Response Shape**: `MaterialKGResponse` (`{ analysis_id, nodes, edges }`)
- **UI Logic**:
  - Primary topic node rendered as center purple pill.
  - Related concepts rendered as branching blue pills with curved SVG connectors.
- **Acceptance Criteria**:
  - MindMap renders topic hierarchy visually matching design specification.

---

### TASK-019: Independent AI Study Panels
- **Objective**: Implement independent study panels for Detailed Summary, Flashcards, and Practice Quiz with independent loading skeletons.
- **Dependencies**: TASK-016, TASK-017, TASK-018
- **Files to Create/Modify**:
  - `frontend/src/components/study/SummaryPanel.tsx`
  - `frontend/src/components/study/FlashcardsPanel.tsx`
  - `frontend/src/components/study/PracticeQuizPanel.tsx`
  - `frontend/src/api/interactive.ts`
- **API Endpoints**:
  - `GET /resources/{resource_id}/summary`
  - `GET /resources/{resource_id}/flashcards`
  - `GET /resources/{resource_id}/quiz`
- **UI Logic**:
  - Each panel manages its own TanStack Query fetch and inline `Skeleton` loader.
  - Practice quiz explicitly labeled **"Ungraded Practice Quiz"** (answers visible).
  - Header actions: "Start Adaptive Quiz" -> routes to `/quiz/:resourceId`; "Start AI Interview" -> routes to `/interview/:resourceId`.
- **Acceptance Criteria**:
  - One slow AI provider request does not block the rest of the resource page from loading.
  - Panels support retryable error state.

---

## Phase 5 — Adaptive Assessment Engine

### TASK-020: Adaptive Quiz Start Flow
- **Objective**: Implement `/quiz/:resourceId` page and initialize dynamic exam quiz session.
- **Dependencies**: TASK-016, TASK-019
- **Files to Create/Modify**:
  - `frontend/src/pages/Quiz.tsx`
  - `frontend/src/api/exams.ts`
- **API Endpoint**: `POST /exams/quiz/start`
- **Request Body**: `{ resource_id: string }`
- **Response Shape**: `{ assessment_id: string, questions: ClientQuestion[] }`
- **ClientQuestion Shape**: `{ question_id, type: "mcq"|"short_answer"|"code_explain", prompt, options?: string[], node_id, target_bloom }`
- **Acceptance Criteria**:
  - Assessment initializes and displays question counter step indicator (e.g. Question 1 of 3).

---

### TASK-021: Dynamic Question Renderer Component
- **Objective**: Build input renderer switching on question `type` (`mcq`, `short_answer`, `code_explain`).
- **Dependencies**: TASK-020
- **Files to Create/Modify**:
  - `frontend/src/components/assessment/QuestionRenderer.tsx`
  - `frontend/src/components/assessment/McqOptionGroup.tsx`
  - `frontend/src/components/assessment/CodeExplainInput.tsx`
- **UI Logic**:
  - `mcq`: Radio button list with option text.
  - `short_answer`: Multi-line text input with character counter.
  - `code_explain`: Syntax-highlighted code container + explanation text area.
- **State**: Maintain local answers map `{ [question_id: string]: string }`.
- **Acceptance Criteria**:
  - Supports all three question types seamlessly.
  - Prevents submission if required questions are unanswered.

---

### TASK-022: Quiz Submission & Feedback View
- **Objective**: Submit quiz answers, display overall score, per-question feedback, and trigger passport cache invalidation.
- **Dependencies**: TASK-021
- **Files to Create/Modify**:
  - `frontend/src/components/assessment/QuizResultsView.tsx`
- **API Endpoint**: `POST /exams/quiz/{assessment_id}/submit`
- **Request Body**: `{ answers: Array<{ question_id: string, user_answer: string }> }`
- **Response Shape**: `AttemptResponse` (`{ attempt_id, assessment_id, user_id, score: float (0..100), per_question_result: QuestionResultItem[] }`)
- **Invalidation Logic**:
  - On submit success, invalidate TanStack queries: `['passport']`, `['passport-gaps']`, `['student-graph']`.
- **Acceptance Criteria**:
  - Displays percentage score chip, raw scores per question, and constructive feedback.
  - Refetches student passport and gaps in background.

---

### TASK-023: Turn-by-Turn AI Technical Interview
- **Objective**: Implement `/interview/:resourceId` interactive turn-by-turn chat interview.
- **Dependencies**: TASK-020
- **Files to Create/Modify**:
  - `frontend/src/pages/Interview.tsx`
  - `frontend/src/components/assessment/InterviewThread.tsx`
  - `frontend/src/components/assessment/InterviewTurnItem.tsx`
- **API Endpoints**:
  - `POST /exams/interview/start` -> `{ resource_id: string }` -> returns `InterviewTurnResponse` (`session_id, turn_index: 1, question: string, status: "in_progress"`)
  - `POST /exams/interview/{session_id}/answer` -> `{ answer: string }` -> returns `InterviewTurnResponse` (`session_id, turn_index, question: string|null, evaluation: QuestionResultItem|null, status: "in_progress"|"completed"`)
- **Flow Rules**:
  - Loop turns until response returns `status: "completed"` and `question: null`.
  - No explicit "End Interview" UI button.
  - On completion, display overall session summary card and invalidate passport queries.
- **Acceptance Criteria**:
  - Chat thread streams turns smoothly.
  - Completes automatically after turn 5 evaluation.

---

## Phase 6 — Skill Graph & Digital Skill Passport

### TASK-024: Dedicated Interactive Student Skill Graph Page
- **Objective**: Implement dedicated zoomable/panable student skill graph page (`/skill-graph`).
- **Dependencies**: TASK-009, TASK-022, TASK-023
- **Files to Create/Modify**:
  - `frontend/src/pages/SkillGraph.tsx`
  - `frontend/src/components/graph/FullSkillGraphSvg.tsx`
- **API Endpoint**: `GET /knowledge-graph/student/{user_id}`
- **Response Shape**: `StudentKGResponse` (`{ user_id, skills: StudentKGStateItem[] }`)
- **UI Logic**:
  - Full canvas SVG layout with node search filter and mastery color legend.
  - Node click opens details drawer showing node score, timestamp, and evidence count.
- **Acceptance Criteria**:
  - Renders all student competency nodes cleanly.
  - Legend clearly explains green (`mastered`), gold (`developing`), red (`gap`).

---

### TASK-025: Digital Skill Passport Page
- **Objective**: Implement `/passport` page rendering verified skill passport breakdown.
- **Dependencies**: TASK-008, TASK-024
- **Files to Create/Modify**:
  - `frontend/src/pages/Passport.tsx`
  - `frontend/src/components/passport/PassportNodeTable.tsx`
- **API Endpoint**: `GET /passport/{user_id}`
- **Response Shape**: `PassportResponse` (`{ user_id, nodes: PassportNodeItem[], updated_at }`)
- **UI Logic**:
  - Render tabular view of nodes with display name, Bloom level, competency score, and node-level `last_updated` timestamp.
  - Filterable by mastery tier (Mastered / Developing / Needs Work).
- **Acceptance Criteria**:
  - Shows verified list of skills with monospace score numerals.
  - Uses node-level `last_updated` timestamp for recency display.

---

### TASK-026: Passport Gaps & Prerequisite Resource Links
- **Objective**: Implement knowledge gaps section on passport page with direct prerequisite links back to study material.
- **Dependencies**: TASK-025
- **Files to Create/Modify**:
  - `frontend/src/components/passport/GapRecommendationCard.tsx`
- **API Endpoint**: `GET /passport/{user_id}/gaps`
- **Response Shape**: `GapRecommendationResponse` (`{ user_id, gaps: GapItem[] }`)
- **UI Logic**:
  - Render gaps list highlighting prerequisites needed to unlock concept.
  - Action link: "Find Material for [Prerequisite]" -> pre-fills search bar on `/search`.
- **Acceptance Criteria**:
  - Gaps accurately display missing prerequisite concepts.
  - Pre-filled search link opens search page with targeted query.

---

### TASK-027: Interview History Log View
- **Objective**: Implement interview history log view allowing students to review past mock interview evaluations.
- **Dependencies**: TASK-023, TASK-025
- **Files to Create/Modify**:
  - `frontend/src/components/passport/InterviewHistoryList.tsx`
- **API Endpoint**: `GET /exams/interview/history/{user_id}`
- **Response Shape**: `list[{ session_id, resource_id, status, turns_count, turns, created_at }]`
- **Acceptance Criteria**:
  - Renders list of past interview attempts with collapsible turn transcripts.

---

## Phase 7 — Polish, Responsive Design & Accessibility

### TASK-028: Responsive Layout Reflow (< 768px)
- **Objective**: Validate and implement single-column layout collapse for mobile viewports below 768px.
- **Dependencies**: TASK-008 through TASK-027
- **Files to Create/Modify**:
  - `frontend/src/pages/Home.tsx`
  - `frontend/src/pages/ResourceDetail.tsx`
  - `frontend/src/pages/Passport.tsx`
- **Reflow Specs**:
  - Home: Asymmetric 2-column grid collapses to single column; SVG preview panel moves below greeting.
  - Resource Detail: Video player and tabbed AI panels stack vertically.
  - TopBar: Navigation links move into mobile hamburger drawer.
- **Acceptance Criteria**:
  - All pages are fully usable on mobile screens (375px+ width) without horizontal overflow.

---

### TASK-029: Accessibility & Focus Ring Enhancements
- **Objective**: Enforce keyboard navigation, visible focus rings, color-blind compliance, and reduced-motion support.
- **Dependencies**: TASK-028
- **Files to Create/Modify**:
  - `frontend/src/index.css`
  - All interactive button/card components
- **Accessibility Rules**:
  - Focus rings: Explicit `focus-visible:ring-2 focus-visible:ring-slate-900` on all tiles, tabs, inputs, and links.
  - Color compliance: Competency colors (`mastered`, `developing`, `gap`) are always paired with numeric scores (e.g. `85/100`) and semantic labels ("Mastered").
  - Motion: `prefers-reduced-motion: reduce` suppresses SVG growth animations.
- **Acceptance Criteria**:
  - App is 100% navigable via `Tab` and `Enter/Space` keys.
  - No interactive control lacks a clear focus ring.

---

### TASK-030: Global Error States & Search 503 Banner
- **Objective**: Implement defensive error UI, human-readable error passthrough, and a distinct YouTube 503 unavailable banner.
- **Dependencies**: TASK-028
- **Files to Create/Modify**:
  - `frontend/src/components/common/ErrorBoundary.tsx`
  - `frontend/src/components/common/SearchUnavailableBanner.tsx`
- **Behavior**:
  - API `503 Service Unavailable` on `/search`: Displays distinct banner ("YouTube search is currently unavailable. You can still upload PDFs or paste direct URLs.") rather than a generic error toast.
  - API `422 Unprocessable Entity`: Highlights exact invalid input field from `detail[].loc`.
- **Acceptance Criteria**:
  - React ErrorBoundary catches unexpected rendering errors gracefully.
  - 503 error renders specific helpful intake alternative message.

---

## Phase 8 — Production Build & QA Validation

### TASK-031: Build Bundle Verification & Secret Hygiene
- **Objective**: Validate production Vite build output and ensure zero backend secrets leak into client JavaScript assets.
- **Dependencies**: TASK-001 through TASK-030
- **Commands**:
  - `npm run build`
- **Validation Check**:
  - Inspect generated `dist/` JS bundles.
  - Verify absence of `MONGO_URI`, `JWT_SECRET`, `GROQ_API_KEY`, `YOUTUBE_API_KEY`.
- **Acceptance Criteria**:
  - `npm run build` completes with zero TypeScript or Vite errors.
  - Bundle contains only public client configuration (`VITE_API_BASE_URL`).

---

### TASK-032: End-to-End Live Backend Acceptance Pass
- **Objective**: Execute full manual acceptance flow against running FastAPI backend service.
- **Dependencies**: TASK-031
- **Test Scenarios**:
  1. Register new user (`POST /auth/register`), verify login redirect (`POST /auth/login`), check `/auth/me` session hydration.
  2. Search candidates (`POST /search`), trigger medium analysis (`POST /search/{id}/analyze-medium`), test PDF upload modal (`POST /resources/upload`).
  3. Select candidate (`POST /resources/{id}/select`), verify job polling (`GET /jobs/{job_id}`) transitions from `queued` -> `processing` -> `done`.
  4. Open resource detail view (`/resources/:id`), verify transcript, chapters, Material MindMap (`GET /knowledge-graph/material/{id}`), summary, flashcards, and ungraded practice quiz.
  5. Complete adaptive quiz (`POST /exams/quiz/start` & `submit`), check per-question feedback and score chip update.
  6. Conduct AI interview (`POST /exams/interview/start` & `answer`), answer 5 turns until `status: "completed"`.
  7. Verify `/passport` and `/skill-graph` reflect updated competency scores and gap prerequisites.
- **Acceptance Criteria**:
  - All 7 end-to-end scenarios pass against live backend without errors.
