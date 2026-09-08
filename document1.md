# AI-Powered Student Skill Intelligence Platform — Frontend Specification

## 1. Document Purpose

This document serves as the **definitive, single source of truth for frontend development** of the AI-Powered Student Skill Intelligence Platform. It consolidates, reconciles, and defines every frontend requirement, feature specification, visual design rule, interaction design, page layout, component contract, state model, responsive behavior, accessibility constraint, and API dependency extracted from the project documentation and implementation specs.

All frontend architecture, component engineering, state management, and user interface implementations must strictly adhere to the specifications defined in this document.

---

## 2. Product Overview

The AI-Powered Student Skill Intelligence Platform is an intelligent learning overlay operating above raw educational content (YouTube videos, PDFs, NPTEL lectures, course documents). Unlike traditional Learning Management Systems (LMS) or video platforms that track binary watch metrics, this platform addresses a fundamental student question: **What do I actually know right now, and what is the exact prerequisite blocking my next concept?**

### Core Intelligence Architecture
The platform establishes a continuous learning cycle:
1. **Intake & Multi-Level Resource Intelligence**: Search or upload learning resources. Local medium analysis evaluates raw quality/transcript signals, while LLM-powered strong analysis extracts structured topics, concepts, prerequisite edges, and key sections.
2. **Interactive Study Experience**: Students study resources via transcripts, structured summaries, flashcards, interactive mindmaps, and casual practice quizzes.
3. **Adaptive Competency Assessment**: AI-driven adaptive exams (MCQ, Short Answer, Code Explanation) and multi-turn technical AI interviews generate verified evidence events.
4. **Student Knowledge Topology & Passport**: Evidence updates per-skill competency scores (0–100 scale), mapping the student's live knowledge state onto an interactive network topology and a digital skill passport with automated gap discovery.

---

## 3. Frontend Goals

1. **Eliminate Generic SaaS Aesthetics**: Implement a warm, high-end editorial and academic design language (`paper` palette, serif typography, precise tabular numbers, liquid water-wave percentage visuals, and 3D card interactions).
2. **Provide Deep Learning Context**: Render knowledge as connected networks (anchored around the student's root identity) rather than isolated text tables or flat statistics.
3. **Defensive LLM Integration**: Provide resilient UI rendering for untyped, asynchronous LLM responses with per-panel loading skeletons, inline error fallbacks, and retry mechanisms.
4. **Seamless Responsiveness & Accessibility**: Ensure complete layout stability across desktop (including 5-column grids), tablet, and mobile, adhering to full keyboard navigation, screen reader labels, and `prefers-reduced-motion` compliance.
5. **Zero Backend Secret Exposure**: Strictly isolate API secret management to backend services, exposing only public client configuration (`VITE_API_BASE_URL`) to the client build.

---

## 4. Design Principles & Design System

### 4.1 Visual Identity & Palette
The interface uses two intentional palette systems: the primary **Eucalyptus & Mastery System** (for Home, Skill Graph, and Skill Passport) and the **Study Flow System** (for Search and Resource Detail).

#### Primary Mastery Palette (Home, Skill Graph, Passport)
| Token | Hex / Value | Usage & Semantics |
|---|---|---|
| `paper` | `#EEF2ED` | App background — warm eucalyptus-grey |
| `surface` | `#F5F7F3` | Elevated card and panel surfaces |
| `ink` | `#1C2430` | Headings, primary text, dark action buttons |
| `ink-muted` | `#4A554E` | Secondary body text, captions, metadata |
| `line` | `#D8DDD3` | Hairline borders and section dividers |
| `mastered` | `#2F6F5E` | Pine Green — Competency ≥ 80. Semantic mastery accent. |
| `developing` | `#C99A3E` | Gold — Competency 60–79. Semantic developing accent. |
| `gap` | `#A63D2F` | Brick Rust — Competency < 60. Reserved strictly for gap/needs-work semantics. |

*Semantic Rule*: The mastery colors (`#2F6F5E`, `#C99A3E`, `#A63D2F`) must retain singular semantic meaning across node graphs, competency chips, gap rows, and card borders. `gap` red must never be used for generic toast/form errors.

#### Study Flow Palette (Search & Resource Detail Exception)
| Token | Hex / Value | Usage |
|---|---|---|
| `study-bg` | `#FFFFFF` | Pure white content background |
| `study-text` | `#111827` | Slate-900 high contrast text |
| `study-accent` | `#3B82F6` | Blue-500 interactive elements, branch pills |
| `study-topic` | `linear-gradient(135deg, #7C3AED, #4F46E5)` | Purple gradient anchor for radial MindMap topic center |

### 4.2 Typography System
| Role | Font Family | Size Scale | Weight / Usage |
|---|---|---|---|
| Headline / Voice | `Source Serif 4`, serif | 40px (Hero), 32px (H1), 24px (H2) | Page titles, hero greetings, academic framing |
| UI / Body | `Inter`, sans-serif | 16px (Body), 14px (UI/Labels), 12px (Small) | Navigation, buttons, form controls, body text |
| Tabular Data | `IBM Plex Mono`, monospace | 14px, 12px | Monospace numerals: competency scores (`84/100`), timestamps (`03:45`), IDs |

### 4.3 Layout & Spacing
- Max content width: `1024px` on standard pages; extended full-bleed max width on Home and Landing.
- Vertical section spacing: `py-10` (40px) rhythm separated by subtle hairline rules (`border-b border-line`).
- Left-aligned, asymmetric hero layouts (`content` + `420px graph panel` on Home). No generic centered SaaS marketing heroes.
- Card styles: Hairline borders (`border border-line`) with subtle hover border shifts (`hover:border-ink/30`), avoiding heavy drop shadows.

---

## 5. Technology Stack

- **Core Framework**: React 19 + Vite 6
- **Language**: TypeScript 5.7 (Strict mode enabled)
- **Styling**: Tailwind CSS 3.4 (with CSS variables for dynamic design tokens)
- **Routing**: React Router DOM 7
- **Server State & Caching**: TanStack Query (React Query) v5
- **Icons**: Lucide React (`lucide-react`)
- **Build / Packaging**: Vite with `ES2022` target

---

## 6. Application Architecture

```
frontend/src/
├── api/                  # Axios/Fetch API client layer & endpoint definitions
│   ├── client.ts         # Axios instance, bearer token interceptor, 401 handler
│   └── endpoints.ts      # Strictly typed API calls
├── components/           # UI Components by domain
│   ├── assessment/       # QuestionRenderer, QuizResults, InterviewThread
│   ├── auth/             # ProtectedRoute, AuthForm
│   ├── common/           # ErrorBoundary, Skeletons, Modal
│   ├── dashboard/        # ActionTile, ScoreChip, GapRow, RecentResourceCard
│   ├── graph/            # SkillGraphPreviewSvg, InteractiveTopologyGraph
│   ├── landing/          # LandingHero, WaterWaveSkillCard, LandingSections
│   ├── layout/           # PageShell, TopBar, Header, Navigation
│   ├── passport/         # ConceptCompetencyCard, ConceptCompetencyGrid, GapCard
│   ├── resources/        # ResourceRow, StatusBadge, UploadModal
│   ├── search/           # CandidateCard, CandidateCardSkeleton, PaginationControls
│   ├── study/            # VideoPlayer, SummaryPanel, FlashcardsPanel, MindMapSvg
│   └── ui/               # Primitive UI components (Button, Badge, Card, Tabs, Input)
├── context/              # React Context Providers (AuthContext, SpaceContext)
├── hooks/                # Custom React hooks (useAuth, useJobPoller, useSequentialAnalysis)
├── pages/                # Route components (Landing, Login, Register, Home, Search, etc.)
├── types/                # TypeScript data interfaces & API contracts
└── utils/                # Formatting utilities, mastery score mappers
```

---

## 7. Route / Page Structure

| Route | Component | Access Level | Description |
|---|---|---|---|
| `/` | `LandingPage` | Public | Marketing product overview, water-wave card preview, feature pipeline |
| `/login` | `Login` | Public | User authentication login form |
| `/register` | `Register` | Public | User registration form |
| `/home` | `Home` | Protected | Student orientation workspace dashboard |
| `/search` | `SearchPage` | Protected | YouTube candidate search with 5x3 grid pagination & auto medium analysis |
| `/resources/:id` | `ResourceDetail` | Protected | Interactive study space (video player, transcript, summary, mindmap) |
| `/quiz/:resourceId` | `QuizPage` | Protected | Adaptive exam experience (MCQ, Short Answer, Code Explain) |
| `/interview/:resourceId`| `InterviewPage` | Protected | Multi-turn AI technical interview conversation |
| `/skill-graph` | `SkillGraphPage` | Protected | Interactive Student Knowledge State Topology network graph |
| `/passport` | `PassportPage` | Protected | Digital Skill Passport (3D Concept Competency Grid & Gap Intelligence) |
| `*` | `Navigate` | Fallback | Redirects unmapped routes to `/` |

---

## 8. Global Layout & Shell Refinements

### 8.1 TopBar Navigation Structure
The TopBar presents clean, un-cluttered header controls:
- **Order (Left to Right)**: Menu Trigger (`/menu`), Search Input (`/search`), User Profile Badge / Sign Out.
- **Menu Drawer / Dropdown**: Exposes primary workspace destinations: `Skill Gap` (`/skill-graph`) and `Digital Passport` (`/passport`).
- **Removed Affordances**: "Find & Ingest" is completely removed as a navigation item. The redundant "Overview" section and page footers are removed across all protected views.
- **Search Input**: Prominently placed in the top bar; typing initiates query navigation to `/search?q=...`.

### 8.2 Responsive Shell Behavior
- **Desktop (≥1024px)**: Full top bar layout with inline search input and expanded content container (`max-w-6xl` or `max-w-7xl`).
- **Tablet (768px - 1023px)**: Compact navigation items; search bar contracts smoothly.
- **Mobile (<768px)**: TopBar collapses into mobile drawer trigger; main grid layouts collapse to single-column vertical stacks.

---

## 9. Navigation & User Context

The application manages user context via `AuthContext`:
- `user`: Hydrated user object containing `user_id`, `name`, `email`, `created_at`.
- `accessToken`: JWT token stored in `localStorage` or `sessionStorage`.
- `isAuthenticated`: Boolean status (`status: "loading" | "authenticated" | "anonymous"`).
- `login(credentials)`: Submits `POST /auth/login`, stores JWT, hydrates user.
- `register(payload)`: Submits `POST /auth/register`, then auto-logs in user.
- `logout()`: Clears token and state, redirects to `/login`.

---

## 10. Authentication & Protected Routes

All routes except `/`, `/login`, and `/register` are wrapped in `<ProtectedRoute>`:
- If `status === "loading"`, render full-page loading skeleton.
- If `status === "anonymous"`, automatically redirect to `/login` preserving target route state.
- Global API `401 Unauthorized` handler automatically clears the session and triggers redirect to `/login`.

---

## 11. Page Specifications

### 11.1 Landing Page (`/`)
- **Purpose**: Public showcase of the Skill Intelligence Platform.
- **Sections**:
  1. **Top Nav**: Branding mark, links (How It Works, Skill Passport, Intelligence), CTAs (`Sign In`, `Get Started` / `Go to Workspace`).
  2. **Hero Section**: Eyebrow (`YOUR SKILLS. ONE INTELLIGENT PASSPORT.`), headline (`Know what you know. Prove what you can do.`), CTAs (`Build My Skill Passport`).
  3. **Interactive Hero Visual**: Liquid water-wave fill animated skill cards (`WaterWaveSkillCard`) showcasing competency percentages (React 76%, Python 84%, etc.).
  4. **Learning Sources Strip**: Convergence strip (YouTube, NPTEL, PDFs, ChatGPT -> Digital Skill Passport).
  5. **Problem & Solution Pipeline**: Disconnected Learning -> Learn -> Understand -> Assess -> Verify -> Track -> Grow.
  6. **Resource Intelligence**: Medium Analysis (local quality signals) vs Strong Analysis (deep concept extraction).
  7. **Knowledge Graph Preview**: Interactive SVG node graph preview.
  8. **AI Tutor Preview**: Mock chat conversation demonstrating material awareness.
  9. **Assessment & Verification Showcase**: 4 hint states & 6 evaluation dimensions for code/concepts.
  10. **Digital Skill Passport Showcase**: Gap discovery and career readiness.

### 11.2 Authentication Pages (`/login`, `/register`)
- **Purpose**: Allow users to register or sign in.
- **Form Controls**: Email input, password input (min 6 chars), name input (registration).
- **Feedback**: Form-level validation errors and human-readable backend errors (`Email already registered`, `Incorrect email or password`).

### 11.3 Student Home Workspace (`/home`)
- **Purpose**: Signed-in orientation dashboard ("Where am I weak, and what should I do next?").
- **Layout**: Asymmetric 2-column layout (Main workspace left, Skill Graph panel 420px right).
- **Components**:
  - **Greeting Header**: `Source Serif 4` greeting (`Welcome back, {Name}`) with overall competency `ScoreChip`.
  - **Action Tiles**: Direct entry points to Search, Upload PDF/URL, Take Quiz, Start AI Interview.
  - **Skill Gap Summary**: Render top 3 critical gaps (`GapRow`) with prerequisite recommendations.
  - **Recent Resources**: List of recently ingested resources with `StatusBadge`.
  - **Right Panel**: Embedded mini interactive Skill Graph SVG.

### 11.4 Search & Resource Ingest Page (`/search`)
- **Purpose**: Search YouTube educational resources or upload custom PDFs/URLs, automatically analyzing medium quality.
- **Grid Layout**: Strict 15 videos per page arranged in a **5 columns × 3 rows** desktop grid (`xl:grid-cols-5`).
- **Features**:
  - **Search Input & Filters**: Query input with filter chips (`All`, `Under 20 min`, `Beginner`, `With transcript`) applied client-side over the search result set (up to 50 items).
  - **Automatic Sequential Medium Analysis**: Upon page render, Medium Analysis runs **automatically and sequentially (video-by-video)** for the 15 active page items without manual button triggers. Network requests run one at a time.
  - **Card Analysis States**: `Waiting` -> `Analyzing...` -> `Analysis Complete` (displaying quality scores: Relevance, Depth, Clarity, Overall) or `Analysis Failed`.
  - **Pagination**: 15 items per page with `PaginationControls`. Page switches cancel any pending analysis queue on the old page and start sequential auto-analysis for the new page. Completed results are cached in-memory and re-used instantly on page revisit.
  - **Upload Modal**: Trigger modal for uploading PDF files or submitting raw YouTube URLs via `multipart/form-data`.

### 11.5 Resource Detail & Study Space (`/resources/:id`)
- **Purpose**: Interactive deep-learning environment for a strongly analyzed resource.
- **Layout**: Two-column layout (Video player & Transcript left, AI Study Panels right).
- **Left Column**:
  - Embedded YouTube video player or PDF preview.
  - Chapter & Transcript viewer with timestamp synchronization and auto-scroll toggle.
- **Right Column (Tabbed AI Panel)**:
  - **Detailed Summary**: Structured summary points and key takeaways with clickable timestamp chips.
  - **Flashcards**: Interactive front/back flip study cards.
  - **Practice Quiz**: Casual multi-choice study quiz with inline explanations.
  - **Radial MindMap (`MindMapSvg`)**: Radial tree visualization featuring a central topic pill (purple gradient) connected via curved SVG branches to concept pills (blue).
- **Top Actions**: Action buttons to launch `Take Adaptive Quiz` (`/quiz/:id`) or `Start AI Interview` (`/interview/:id`).

### 11.6 Adaptive Exam Page (`/quiz/:resourceId`)
- **Purpose**: Graded adaptive knowledge assessment.
- **Question Types**:
  - `mcq`: Multiple choice with radio option selection.
  - `short_answer`: Free-text textarea response.
  - `code_explain`: Technical code/concept explanation textarea.
- **Flow**: Fetches assessment from `POST /exams/quiz/start`, manages candidate answers locally keyed by `question_id`, submits to `POST /exams/quiz/{id}/submit`, renders overall percentage score and detailed per-question feedback cards. Refetches student graph & passport data upon completion.

### 11.7 AI Technical Interview Page (`/interview/:resourceId`)
- **Purpose**: Multi-turn AI technical evaluation conversation.
- **Flow**:
  - Initiates session via `POST /exams/interview/start`.
  - Displays interviewer question and turn index (Turns 1 to 5).
  - Student types text response in message input and submits to `/exams/interview/{session_id}/answer`.
  - Renders turn-by-turn evaluation (`raw_score`, `feedback`, target `node_id`).
  - Automatically completes after 5 turns (`status: "completed"`, `question: null`). Refetches passport and graph state upon conclusion.

### 11.8 Student Knowledge State Topology (`/skill-graph`)
- **Purpose**: Interactive network visualization of the student's complete knowledge topology.
- **Core Requirements**:
  - **Student Root Anchor**: Central root node represents the authenticated student (displaying student name e.g. "Ada Lovelace") with distinct avatar styling.
  - **Network Topology**: Concept nodes branch outward organically (not as a static tree), styled by competency score (Mastered ≥80 Pine Green, Developing 60-79 Gold, Needs Work <60 Brick Rust).
  - **Hover Interaction**: Hovering a node scales it up smoothly, highlights connected edges, dims unrelated nodes, and reveals connected child nodes without collapsing previously revealed paths.
  - **Click Interaction**: Clicking a node opens/populates the right-hand `Concept Node Details` inspector drawer (displaying name, score, bloom level, description, parent/child nodes, prerequisites, evidence event counts).
  - **Reveal All Animation**: `[Reveal All]` button progressively animates node expansion outward from the root node and toggles to `Collapse`.
  - **Canvas Navigation**: Pan, drag, zoom (`[+]`, `[-]`), `[Fit to View]` containment scaling, and `[Reset]` controls.

### 11.9 Digital Skill Passport Page (`/passport`)
- **Purpose**: Master student competency passport, gap discovery, and evidence log.
- **Sections**:
  1. **Passport Header**: Overall competency index, total verified concepts, active skill gaps.
  2. **Concept Competency Card Grid**: 3D interactive knowledge card grid replacing legacy table layouts.
     - **Desktop Layout**: Exactly 5 cards per row on desktop (`xl:grid-cols-5`), 15 cards per page (3 rows × 5 cards).
     - **Front Face**: Concept name, description (clamped 2-3 lines), Bloom Taxonomy badge (`remember`, `understand`, `apply`, `analyze`, `evaluate`, `create`), competency score chip, mastery status label.
     - **Back Face (Evidence Panel)**: 180° Y-axis flip on desktop hover / mobile tap. Displays "Last Evaluated" date, evidence event count with correct pluralization (`1 Event` vs `N Events`), and score tier accent continuity.
     - **Card Controls**: 15 items per page with pagination controls; flipped state resets upon page change.
  3. **Skill Gap Intelligence**: Prioritized gap list displaying nodes with competency < 60 and recommended prerequisite chains.
  4. **Interview & Assessment History**: Historical log of completed quizzes and AI interviews with turn evaluations.

---

## 12. Component Architecture & Reusable Components

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              PageShell                                  │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │                               TopBar                                │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │                         Page Content View                           │ │
│ │  ┌─────────────────────┐ ┌───────────────────┐ ┌─────────────────┐  │ │
│ │  │ConceptCompetencyGrid│ │ InteractiveGraph  │ │  UploadModal    │  │ │
│ │  │ ┌─────────────────┐ │ │ ┌───────────────┐ │ │ ┌─────────────┐ │  │ │
│ │  │ │3D CompetencyCard│ │ │ │   SVG Nodes   │ │ │ │ File/URL Form│ │  │ │
│ │  │ └─────────────────┘ │ │ └───────────────┘ │ │ └─────────────┘ │  │ │
│ │  └─────────────────────┘ └───────────────────┘ └─────────────────┘  │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

### Key Component Contracts

#### 1. `ConceptCompetencyCard`
- **Props**: `node: PassportNodeItem`, `onSelect?: (nodeId: string) => void`
- **Behavior**: 3D flip card with `perspective: 1000px`. Rotates 180° on hover/tap. Supports keyboard focus (`tabIndex={0}`, Enter/Space toggle).
- **Mastery Tiers**:
  - `score >= 80`: Mastered (`border-mastered text-mastered bg-mastered/5`)
  - `score >= 60`: Developing (`border-developing text-developing bg-developing/5`)
  - `score < 60`: Needs Work (`border-gap text-gap bg-gap/5`)

#### 2. `WaterWaveSkillCard`
- **Props**: `skillName: string`, `percentage: number`, `subSkills: Array<{name: string, score: number}>`
- **Behavior**: 3D flip card (`h-[310px] w-full`) with animated liquid water-wave fill SVG background matching the score percentage. Back side shows sub-skill breakdown and `AI FOCUS` box targeting the lowest scoring concept.

#### 3. `CandidateCard`
- **Props**: `candidate: CandidateResource`, `analysisState: VideoAnalysisState`, `onSelect: (id: string) => void`
- **Behavior**: 16:9 thumbnail display, title clamp, channel name, status indicator badge (`Waiting`, `Analyzing...`, `Analysis Complete`, `Analysis Failed`). Renders score breakdown chips (Relevance, Depth, Clarity, Overall) when complete.

#### 4. `InteractiveTopologyGraph`
- **Props**: `studentName: string`, `nodes: StudentSkillNode[]`, `edges: KGEdge[]`, `onNodeClick: (node: StudentSkillNode) => void`
- **Behavior**: SVG/Canvas topology network with student root node at center. Handles hover scaling, sub-concept expansion, zoom/pan transform, fit-to-view calculation, and progressive reveal animation.

---

## 13. Data & API Integration

### 13.1 Base HTTP Configuration
- **Base URL**: `VITE_API_BASE_URL` (e.g. `http://localhost:8000`)
- **Headers**: `Content-Type: application/json`
- **Authorization**: `Bearer <access_token>` injected automatically via Axios request interceptor for all protected endpoints.

### 13.2 API Endpoint Matrix

| Method | Endpoint | Purpose | Payload / Params | Response |
|---|---|---|---|---|
| `POST` | `/auth/register` | User Registration | `{ name, email, password }` | User Profile (`user_id`, `name`, `email`) |
| `POST` | `/auth/login` | User Authentication | `{ email, password }` | `{ access_token, token_type }` |
| `GET` | `/auth/me` | Hydrate User Profile | Header Bearer Token | User Profile |
| `POST` | `/search` | YouTube Search | `{ query, page_token? }` | `{ candidates: [], next_page_token }` |
| `POST` | `/search/{id}/analyze-medium` | Local Medium Analysis | Path `id` | Resource with `medium_analysis` scores |
| `POST` | `/resources/{id}/select` | Select & Start Strong Analysis | Path `id` | `{ resource_id, job_id, status }` |
| `POST` | `/resources/upload` | Upload PDF or URL | Multipart `file` or `url` | `{ resource_id, job_id, status }` |
| `GET` | `/resources` | List User Resources | None | `ResourceResponse[]` |
| `GET` | `/jobs/{job_id}` | Poll Strong Analysis Job | Path `job_id` | `{ job_id, status, result, error }` |
| `GET` | `/analyses/{id}` | Read Strong Analysis | Path `id` | Analysis object with transcript & extracted data |
| `GET` | `/knowledge-graph/material/{id}` | Material Graph | Path `id` | `{ nodes: [], edges: [] }` |
| `GET` | `/knowledge-graph/student/{user_id}` | Student Knowledge Graph | Path `user_id` | `{ user_id, skills: [] }` |
| `GET` | `/resources/{id}/summary` | AI Resource Summary | Path `id` | Untyped Summary JSON |
| `GET` | `/resources/{id}/flashcards` | AI Flashcards | Path `id` | Untyped Flashcards JSON |
| `GET` | `/resources/{id}/quiz` | Casual Practice Quiz | Path `id` | Untyped Quiz JSON |
| `POST` | `/exams/quiz/start` | Start Adaptive Exam | `{ resource_id }` | `{ assessment_id, questions: [] }` |
| `POST` | `/exams/quiz/{id}/submit` | Submit Exam Answers | `{ answers: [{ question_id, user_answer }] }` | `{ score, per_question_result: [] }` |
| `POST` | `/exams/interview/start` | Start AI Interview | `{ resource_id }` | `{ session_id, turn_index, question, status }` |
| `POST` | `/exams/interview/{id}/answer` | Submit Interview Turn | `{ answer }` | `{ session_id, turn_index, question, evaluation, status }` |
| `GET` | `/exams/interview/history/{user_id}`| Interview History | Path `user_id` | `InterviewSession[]` |
| `GET` | `/passport/{user_id}` | Digital Passport | Path `user_id` | `{ user_id, nodes: [] }` |
| `GET` | `/passport/{user_id}/gaps` | Passport Gaps | Path `user_id` | `{ user_id, gaps: [] }` |

---

## 14. State Management

1. **Global Auth State (`AuthContext`)**: Manages JWT token, session status, user profile, login, and logout.
2. **Space Context (`SpaceContext`)**: Manages active study space, current resource ID, and UI navigation drawer state.
3. **Server State & Caching (`TanStack Query`)**:
   - Query Keys: `['user']`, `['resources']`, `['job', jobId]`, `['analysis', id]`, `['studentGraph', userId]`, `['passport', userId]`, `['gaps', userId]`.
   - Stale Time: 5 minutes default; invalidation triggered immediately after job completion or exam/interview submission.
4. **Local Component State**:
   - `SearchPage`: Sequential medium analysis queue, search page index, candidate analysis cache.
   - `QuizPage`: Current question index, answer map `{ [questionId]: string }`.
   - `InterviewPage`: Active transcript array, input response string.
   - `SkillGraphPage`: Selected node ID, hover node ID, zoom/pan transform matrix, reveal-all toggle.

---

## 15. Loading States

Every asynchronous UI boundary must provide smooth, non-disruptive feedback:
- **Page Transitions**: Skeleton page placeholders matching final layout geometry.
- **Search Grid Loading**: 15 skeleton cards (`CandidateCardSkeleton`) rendered during query fetch.
- **Medium Analysis Queue**: Individual card loading spinner and `Analyzing...` badge without blocking adjacent cards.
- **Job Polling**: Progress banner with animated pulse indicator showing `Queued -> Processing -> Done`.
- **AI Study Panels**: Summary, Flashcards, and Practice Quiz render individual tab skeletons rather than blocking the full page.

---

## 16. Empty States

- **New Student Workspace**: Greeting displays score 0, recent resources renders "No ingested resources yet. Search or upload material to begin," gap list displays "No knowledge gaps recorded yet. Take an adaptive quiz to start mapping your skills."
- **Search Results Empty**: "No resources found matching '{query}'. Try adjusting your search term."
- **Skill Graph Empty**: "Your knowledge topology is clean. Ingest material and complete assessments to grow your skill network."

---

## 17. Error States

- **Auth Errors**: Form-level inline alert (`Email already registered`, `Incorrect email or password`).
- **Session Expiry (`401`)**: Silent token cleanup and seamless redirect to `/login`.
- **YouTube API Unavailable (`503`)**: Dedicated "Search Service Unavailable" alert block explaining missing backend API configuration.
- **Job Analysis Failure**: Card status transitions to `Analysis Failed` with error detail and retry action.
- **Untyped LLM Response Error**: Tolerant JSON parsing fallbacks render an inline warning ("Unable to parse summary format") with a manual retry button instead of throwing unhandled runtime exceptions.

---

## 18. Responsive Design

| Breakpoint | Target Devices | Layout Adjustments |
|---|---|---|
| `xl` (≥1280px) | Large Desktop | 5-column card grids (`grid-cols-5`), 2-column home workspace (main + 420px graph panel), full top bar |
| `lg` (1024px - 1279px) | Desktop / Laptop | 4-column card grids, stacked workspace panels, expanded container width |
| `md` (768px - 1023px) | Tablets | 3-column card grids, compact top bar, collapsible graph panel |
| `sm` (<768px) | Mobile Devices | 1-column vertical card stacks, top bar mobile menu drawer, tap-to-flip 3D cards, touch graph pan/zoom |

---

## 19. Accessibility (A11y)

- **Keyboard Focus Rings**: Visible high-contrast focus rings (`focus-visible:ring-2 focus-visible:ring-ink`) on all buttons, tabs, input fields, and 3D cards.
- **Keyboard Card Interaction**: 3D competency cards feature `tabIndex={0}` and flip on `Enter` or `Space` keypress.
- **Screen Reader Support**: Semantic HTML5 elements (`<main>`, `<nav>`, `<header>`, `<article>`), explicit `aria-label` attributes on icon-only controls.
- **Reduced Motion**: Full compliance with `@media (prefers-reduced-motion: reduce)` — disables 3D flip rotations, liquid wave animations, and graph expansion transitions, instantly swapping views instead.
- **Color Contrast**: All text tokens (`ink`, `ink-muted`) maintain a minimum contrast ratio of 4.5:1 against `paper` and `surface` backgrounds.

---

## 20. Animation & Interaction Guidelines

- **3D Card Flip**: `perspective: 1000px`, `transform-style: preserve-3d`, `transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)`. Flip rotation along Y-axis (`rotateY(180deg)`). Zero height expansion or vertical layout shift during rotation.
- **Liquid Water-Wave Fill**: Smooth SVG sine-wave path animation (`transform: translateX(...)`) filling card height proportional to score percentage.
- **Topology Graph Expansion**: Progressive outward node growth and edge drawing over 800ms upon clicking `[Reveal All]`.
- **Node Hover Scaling**: Smooth scale transformation (`scale-125`) with edge opacity highlight (`opacity-100`) and background dimming (`opacity-30`).

---

## 21. Forms & Validation

- **Login & Register Forms**: Real-time client validation (valid email format, password min length 6 chars). Disables submit button during active submission (`isSubmitting`).
- **Resource Search Form**: Trims whitespace; requires min 1 character; triggers submission on Enter or Search button click.
- **PDF & URL Ingest Form**: Validates PDF file extension (`.pdf`) or YouTube URL regex pattern (`youtube.com/watch?v=` or `youtu.be/`). Rejects missing inputs with inline field errors.

---

## 22. Data Visualization

1. **Student Knowledge State Topology Graph**: Interactive SVG network canvas displaying student root anchor node and connected concept node clusters with score-coded colors.
2. **Radial Resource MindMap (`MindMapSvg`)**: Radial tree visualization rendering a central topic pill (purple gradient) branching to blue concept sub-pills with curved SVG bezier connectors.
3. **Liquid Water-Wave Skill Cards**: Visual percentage representation via animated water fill levels.

---

## 23. AI & Analysis UI

- **Medium Analysis Card Badge**: Displays quality metrics (Relevance, Depth, Clarity, Overall) as score pills on search cards.
- **Strong Analysis Progress Poller**: Inline polling card showing real-time background status (`Queued` -> `Processing` -> `Completed`).
- **Interactive AI Study Workspace**: Tabbed layout organizing AI Summary, Flashcards, Practice Quiz, and MindMap.

---

## 24. Knowledge Graph / Skill Graph UI

- **Student Root Node**: Centered avatar displaying the authenticated user's name with "Student Knowledge State" subtitle.
- **Node Mastery Styling**: Mastered (Pine Green), Developing (Gold), Needs Work (Brick Rust).
- **Node Inspector Drawer**: Right-side panel opening on node click to display definition, Bloom level, prerequisites, score history, and evidence event count.
- **Graph Controls Bar**: `[Reveal All / Collapse]`, `[+] Zoom In`, `[-] Zoom Out`, `[Fit to View]`, `[Reset]`.

---

## 25. Competency & Skill UI

- **Concept Competency Card Grid**:
  - Desktop layout: 5 cards per row (`xl:grid-cols-5`), 15 concepts per page (3 rows × 5 cards).
  - Front Face: Display name, description (clamped 2-3 lines), Bloom level badge, score chip.
  - Back Face: Last evaluated date, evidence count with correct pluralization (`1 Event` vs `N Events`).
  - 180° Y-axis hover/tap flip animation.
- **Score Visual Identity**: Emerald border for Mastered (80–100), Amber border for Developing (60–79), Rose border for Needs Work (0–59).

---

## 26. Assessment UI

- **Adaptive Quiz Interface**:
  - Step-by-step or list view of questions with target Bloom levels.
  - Question options (MCQ radios, Short Answer textareas, Code Explain textareas).
  - Post-submission results view with percentage score breakdown and per-question feedback.
- **AI Technical Interview Interface**:
  - Turn-by-turn chat conversation interface (Turns 1 to 5).
  - Displays interviewer question, user answer input, and turn evaluation score/feedback.
  - Automatic conclusion banner when interview reaches status `completed`.

---

## 27. YouTube / Resource Analysis UI

- **Search Page Grid**: 15 videos per page in a 5×3 grid.
- **Sequential Auto Analysis Queue**: Video-by-video automatic sequential execution for medium analysis on active page items. Non-active pages remain unanalyzed until visited.
- **Result Caching**: Up to 50 search results cached locally; pagination switches pages without re-fetching YouTube API. Previously analyzed cards render results instantly.
- **Upload Modal**: Integrated file picker for PDFs and text input for YouTube URLs with status message feedback.

---

## 28. Notifications & Feedback

- **Toast System**: Non-blocking notification toasts for success (e.g. "Resource selected for analysis"), warning, and general messages.
- **Inline Alert Banners**: Standard `<Alert>` components for form errors, API failures, and 503 configuration warnings.

---

## 29. Performance Requirements

- **Bundle Size Optimization**: Code-splitting page routes via React `lazy()` and `Suspense`.
- **Render Optimization**: Memoizing heavy graph SVG renders (`React.memo`) to prevent re-renders during state updates.
- **Network Efficiency**: Caching API responses via TanStack Query; avoiding redundant YouTube API search requests across pagination.

---

## 30. Security Considerations

- **Secret Isolation**: Backend secrets (`GROQ_API_KEY`, `YOUTUBE_API_KEY`, `JWT_SECRET`, `MONGO_URI`) must NEVER be exposed in frontend environment variables or client bundles. Only `VITE_API_BASE_URL` is passed to Vite.
- **JWT Storage**: JWT access token stored securely and sent exclusively via HTTP `Authorization: Bearer` headers.
- **XSS Protection**: Sanitizing rendered user input and LLM markdown text.

---

## 31. Frontend / Backend Boundaries

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           Frontend Boundary                             │
│  - User Interface Rendering & Router Navigation                         │
│  - Form Input Validation & State Management                             │
│  - Sequential Search Analysis Queue Management                           │
│  - Defensive Untyped LLM JSON Parsing                                   │
│  - JWT Bearer Token Injection & 401 Session Expiry Handling             │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                            HTTP / REST API
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           Backend Boundary                              │
│  - Authentication, Password Hashing & JWT Generation                    │
│  - YouTube API Querying & Candidate Formatting                          │
│  - Local Medium Analysis Quality Scoring                                │
│  - Groq LLM Strong Analysis, Summary, Flashcards, Quiz Generation       │
│  - MongoDB Persistence (Users, Resources, Jobs, State, Assessments)     │
│  - Competency Score Calculations & Evidence Event Logging               │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 32. Existing Components to Preserve

The following implemented frontend components in `src/components/` must be preserved and integrated:
- `layout/TopBar.tsx`, `layout/PageShell.tsx`
- `dashboard/ActionTile.tsx`, `dashboard/ScoreChip.tsx`, `dashboard/GapRow.tsx`, `dashboard/RecentResourceCard.tsx`
- `search/CandidateCard.tsx`, `search/CandidateCardSkeleton.tsx`, `search/PaginationControls.tsx`
- `study/VideoPlayer.tsx`, `study/SummaryPanel.tsx`, `study/FlashcardsPanel.tsx`, `study/PracticeQuizPanel.tsx`, `study/MindMapSvg.tsx`
- `assessment/QuestionRenderer.tsx`, `assessment/QuizResultsView.tsx`, `assessment/InterviewThread.tsx`
- `graph/SkillGraphPreviewSvg.tsx`
- `passport/ConceptCompetencyCard.tsx`, `passport/ConceptCompetencyGrid.tsx`, `passport/GapRecommendationCard.tsx`
- `landing/LandingHero.tsx`, `landing/WaterWaveSkillCard.tsx`, `landing/LandingSections.tsx`
- `resources/UploadModal.tsx`, `resources/ResourceRow.tsx`, `resources/StatusBadge.tsx`

---

## 33. Implementation Constraints

1. **No Direct Database Access**: The frontend must never attempt to access MongoDB or Redis directly.
2. **No Invented Backend Endpoints**: The frontend must consume only existing FastAPI backend routes documented in `backend/document.md`.
3. **Single Request Analysis Limit**: Sequential medium analysis on search results must never run parallel network requests (`Promise.all`).
4. **Layout Continuity**: 3D card flips must maintain a fixed container height (`h-[310px]`) without vertical layout shifts.

---

## 34. Acceptance Criteria

- [x] **AC-1**: Public routes (`/`, `/login`, `/register`) render correctly without requiring authentication.
- [x] **AC-2**: Authenticated routes redirect unauthenticated users to `/login` and hydrate user profile via `GET /auth/me`.
- [x] **AC-3**: Home workspace displays orientation greeting, overall score chip, recent resources, top gaps, and action tiles. Overview section and page footers are removed.
- [x] **AC-4**: Search page displays exactly 15 videos per page in a 5×3 grid, executing automatic sequential medium analysis one-by-one for active page items.
- [x] **AC-5**: Page navigation across 50 search results reuses cached analysis results without duplicate YouTube search queries.
- [x] **AC-6**: Resource Detail page renders video player, transcript, summary, flashcards, practice quiz, and radial MindMap with timestamp links.
- [x] **AC-7**: Adaptive Quiz renders MCQ, Short Answer, and Code Explain questions, submits candidate answers, displays feedback, and refreshes passport data.
- [x] **AC-8**: AI Technical Interview manages 5-turn conversation, displays evaluation feedback per turn, and completes automatically.
- [x] **AC-9**: Student Knowledge State Topology renders student root node anchor, score-coded concept nodes, hover expansion, inspector drawer, reveal-all animation, zoom/pan controls, and fit-to-view containment.
- [x] **AC-10**: Concept Competency Grid displays 15 cards per page (5×3 grid on desktop) with 180° 3D hover/tap flip displaying evidence details on the back face.

---

## 35. Open Questions & Requirement Conflicts

### Open Questions
1. **OPEN QUESTION — Institutional Dashboard (`/institution`)**: High-level design framing (`design.md` §4) mentions an institutional placement cell view as a Phase 4 stretch goal. However, no backend endpoints currently exist for aggregate multi-student data. This route is marked as an `OPEN QUESTION` pending backend implementation.
2. **OPEN QUESTION — Practice Quiz vs Adaptive Exam Grading**: The casual study quiz (`GET /resources/{id}/quiz`) returns correct answers inline in the API response, whereas adaptive exams (`POST /exams/quiz/start`) hide correct answers. Frontend explicitly labels the casual study quiz as "Ungraded Study Tool".
3. **OPEN QUESTION — Search Result Cache Lifetime**: Up to 50 YouTube candidates are cached in-memory during a search session. Re-executing a new search query clears the cache, but refreshing the browser window resets session state.

### Requirement Conflicts Discovered & Resolved
1. **Palette Exception Conflict**: Search & Resource Detail screens use a light palette (`#FFFFFF` background, `#3B82F6` accent) as documented in `design.md` §6, while Home, Graph, and Passport use the Eucalyptus (`#EEF2ED`) & Mastery palette (`#2F6F5E`, `#C99A3E`, `#A63D2F`). *Resolution*: Retained both palettes as intentional domain-specific scoping (Study browsing vs Competency tracking).
2. **TopBar Branding Conflict**: `spec 016` removed the text logo from TopBar, while `spec 008` specified Menu-Logo-Search-Profile layout. *Resolution*: Implemented TopBar with Menu, Search Input, and Profile Badge, maintaining branding in the main application shell without topbar text clutter.

---

## 36. Traceability to Original Requirements

| Original Requirement Source | Frontend Document Section | Target Page / Component | Implementation Concern |
|---|---|---|---|
| `backend/document.md` §5 Auth API | §9, §10, §13 | `/login`, `/register`, `AuthContext` | JWT storage, `GET /auth/me` hydration, 401 redirect |
| `backend/document.md` §6 Search & Intake | §11.4, §13, §27 | `/search`, `CandidateCard`, `UploadModal` | 5x3 grid, PDF/URL upload, job creation |
| `backend/document.md` §7 Strong Analysis & Jobs | §11.5, §13, §23 | `/resources/:id`, `useJobPoller` | Background job polling (`queued` -> `done`) |
| `backend/document.md` §10 Knowledge Graphs | §11.8, §13, §24 | `/skill-graph`, `InteractiveTopologyGraph` | Student root node, material & student graph APIs |
| `backend/document.md` §11 Exams & Interviews | §11.6, §11.7, §26 | `/quiz/:id`, `/interview/:id` | Adaptive MCQ/short answer, 5-turn interview |
| `backend/document.md` §12 Passport & Gaps | §11.9, §13, §25 | `/passport`, `ConceptCompetencyGrid` | Score scale (0-100), gaps < 60, evidence counts |
| `frontend/design.md` §2 Design Tokens | §4.1, §4.2 | Global CSS, `ScoreChip`, `GapRow` | `paper`, `mastered`, `developing`, `gap` tokens |
| `frontend/design.md` §6 Search & Detail | §4.1, §11.4, §11.5 | `SearchResults`, `MindMapSvg` | Radial MindMap with purple center / blue branch pills |
| `spec 008` UI Shell Refinement | §8.1, §11.3 | `TopBar`, `PageShell`, `/home` | Menu-Search-Profile order, no overview, no footer |
| `spec 009` Search Pagination & Auto Analysis | §11.4, §27 | `/search`, `useSequentialAnalysis` | 15/page 5x3 grid, automatic sequential single request queue |
| `spec 018` Skill Graph Topology Redesign | §11.8, §24 | `/skill-graph`, `InteractiveTopologyGraph` | Student name root, hover expansion, inspector drawer, zoom/pan |
| `spec 019` Concept Competency Card Grid | §11.9, §25 | `/passport`, `ConceptCompetencyCard` | 5x3 desktop grid, 180° flip face-to-back evidence panel |
| `spec 020` Landing Page | §11.1 | `/`, `LandingHero`, `LandingSections` | Root `/` landing page, water-wave card previews |
| `spec 021` Skill Card 3D Flip | §11.1, §20 | `WaterWaveSkillCard` | 3D card flip (`rotateY(180deg)`), liquid wave fill |
