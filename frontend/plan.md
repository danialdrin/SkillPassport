# Implementation Plan: Student Skill Intelligence Frontend

**Branch**: `frontend` | **Date**: 2026-09-06 | **Spec**: [spec.md](spec.md)

## Summary

Build a protected React/Vite/TypeScript student workspace over the existing FastAPI API. The implementation centralizes authenticated HTTP behavior, uses TanStack Query for server state and background-job polling, and keeps LLM-generated content behind defensive normalizers. The supplied UI direction remains authoritative: eucalyptus mastery views for home/graph/passport and a lighter study palette for search/resource detail.

## Technical Context

**Language/Version**: TypeScript with React and Vite

**Primary Dependencies**: Tailwind CSS, React Router, TanStack Query, lucide-react

**Storage**: Browser `localStorage` for the access token; all domain data remains backend-owned

**Testing**: Vite production build, API/client unit tests, focused component tests, and live-backend manual flow validation

**Target Platform**: Modern desktop and mobile browsers; responsive breakpoint at 768px

**Project Type**: Authenticated single-page web application

**Performance Goals**: Avoid blocking the whole page on independent AI panels; poll active jobs about every 2 seconds; cap home graph preview nodes

**Constraints**: No backend secrets in the browser; tolerate untyped LLM JSON; clear and redirect on `401`; no refresh endpoint; no arbitrary user-entered backend IDs

**Scale/Scope**: Eight primary views, one current-user session, resources and graphs sized for an individual student; full graph may require a bounded layout as node count grows

## Constitution Check

The repository constitution is still the Spec Kit placeholder template and defines no ratified project principles or enforceable gates. No design gate is violated. The plan nevertheless adopts the feature’s explicit quality constraints: authenticated ownership boundaries, defensive API parsing, focused loading/error states, accessibility, responsive layout, and frontend secret hygiene.

**Gate status**: PASS, with the repository constitution itself needing ratification separately from this frontend feature.

## Project Structure

```text
frontend/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── api.md
└── src/
  ├── api/                  # typed endpoint wrappers and client
  ├── components/           # layout, graph, resources, assessment, common
  ├── context/              # AuthContext
  ├── hooks/                # query and job-polling hooks
  ├── pages/                # route-level screens
  └── App.tsx               # router and protected-route composition
```

**Structure Decision**: Keep the frontend as an independent Vite application beside the existing `backend/` FastAPI service. API wrappers own transport concerns; pages compose query hooks and presentational components; no frontend persistence layer is introduced.

## Phase 0: Setup

## 1. Scope

Build a React frontend against the existing FastAPI backend described in the
integration doc. The backend is done; this plan covers frontend only.

In scope: auth, resource search/upload, background job polling, resource
study tools, adaptive quiz, AI interview, student skill graph, skill
passport + gaps.

Out of scope for v1 (backend doesn't support it yet): institutional
dashboard, multi-user comparison views, portfolio export/PDF generation.

## 2. Tech stack

| Layer                  | Choice                                                                                                                                                            | Why                                                                                                                    |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Framework              | React + Vite                                                                                                                                                      | Fast dev loop, no need for Next.js SSR since everything is behind auth                                                 |
| Styling                | Tailwind CSS                                                                                                                                                      | Matches the token system in `design.md`; no component library needed for this visual direction                         |
| Routing                | React Router                                                                                                                                                      | Standard, small app                                                                                                    |
| Server state / polling | TanStack Query                                                                                                                                                    | Built-in polling (`refetchInterval`) is exactly what job status and interview turns need                               |
| Client/auth state      | React Context + `localStorage` for the JWT                                                                                                                        | App is small enough that Redux/Zustand is unnecessary overhead                                                         |
| Graph rendering        | Hand-rolled SVG (see `HomePage.jsx`) for the home preview; consider `react-force-graph` or `d3-force` only for the full Skill Graph page if node counts get large | Keep the home page dependency-light; reserve heavier graph libs for the page that actually needs force-directed layout |
| Icons                  | lucide-react                                                                                                                                                      | Already used in the home page mock                                                                                     |
| HTTP client            | `fetch` wrapped in a small `apiClient.ts`                                                                                                                         | No need for axios; centralize auth header injection and error parsing here                                             |

## 3. Architecture

```
src/
  api/
    client.ts          # fetch wrapper: base URL, auth header, error parsing, 401 handling
    auth.ts             # register, login, getMe
    resources.ts        # search, analyzeMedium, select, upload, list
    jobs.ts              # getJob (+ usePollJob hook)
    analyses.ts          # getAnalysis, getMaterialGraph
    interactive.ts       # getSummary, getFlashcards, getPracticeQuiz
    exams.ts             # quiz start/submit, interview start/answer
    passport.ts           # getPassport, getPassportGaps, getStudentGraph
  components/
    layout/               # TopBar, PageShell
    graph/                 # SkillGraphSvg, GraphLegend
    resources/             # ResourceRow, StatusBadge, SearchBar, UploadModal
    assessment/            # QuestionRenderer, InterviewThread
    common/                 # LoadingSkeleton, EmptyState, ErrorState
  pages/
    Login.tsx, Register.tsx
    Home.tsx
    Search.tsx
    ResourceDetail.tsx
    Quiz.tsx
    Interview.tsx
    SkillGraph.tsx
    Passport.tsx
  context/
    AuthContext.tsx
  App.tsx                  # routes + protected route guard
```

### Auth flow

`AuthContext` holds the JWT and current user. On app load, if a token exists
in `localStorage`, call `GET /auth/me`; on `401` anywhere, clear the token
and hard-redirect to `/login` (per backend doc, there is no refresh
endpoint and the login response carries no expiry).

### Job polling pattern

Any flow that returns a `job_id` (resource select, upload) uses one shared
`usePollJob(jobId)` hook: `refetchInterval: (data) => data.status === "queued" || data.status === "processing" ? 2000 : false`.

## 4. Phased milestones

| Phase                      | Deliverable                                                                                                               | Rough effort |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------ |
| 0 — Setup                  | Vite + Tailwind scaffold, token system from `design.md` wired into `tailwind.config`, `apiClient` with env-based base URL | 2–3 days     |
| 1 — Auth                   | Register, login, `AuthContext`, protected routes, 401 handling                                                            | 2–3 days     |
| 2 — Home                   | Home page per `HomePage.jsx`, wired to `getStudentGraph`, `getPassportGaps`, `listResources`                              | 3 days       |
| 3 — Search & intake        | Search bar + pagination, medium-analysis trigger, PDF/URL upload, job polling → resource list refresh                     | 4–5 days     |
| 4 — Resource detail        | Analysis view, material knowledge graph, summary/flashcards/practice quiz panels (independent loading states)             | 4–5 days     |
| 5 — Adaptive assessment    | Quiz start/answer/submit flow with per-type question rendering; interview turn-by-turn thread                             | 5–6 days     |
| 6 — Skill graph & passport | Full graph page, passport page, gap list with prerequisite links back to resources                                        | 3–4 days     |
| 7 — Polish                 | Empty/error states per `design.md` §5, responsive pass, accessibility pass, reduced-motion                                | 3 days       |
| 8 — QA & deploy            | Manual test pass against a real backend instance, env config for deploy target, README                                    | 2 days       |

Total: roughly 6–7 weeks part-time, compressible if Phases 3–6 run in
parallel across a team of 2–3.

## 5. Environment configuration

Frontend only ever needs:

```
VITE_API_BASE_URL=http://localhost:8000
```

No MongoDB/Redis/JWT-secret/Groq/YouTube keys ever reach the browser — those
stay backend-only per the integration doc.

## 6. Known backend caveats to design around

- Some routes (analysis, material graph, interactive content) don't
  consistently check resource ownership server-side — only ever use IDs the
  frontend itself received for the logged-in user; don't build a UI that
  lets a user paste in arbitrary IDs.
- Interactive endpoints (summary/flashcards/quiz) return **untyped**
  LLM JSON — render defensively, never assume field counts or exact shape.
- There is no interview "end" endpoint — the UI ends the thread purely by
  watching for `status: "completed"`.
- Redis cache fallback is in-memory and per-process — don't rely on cache
  behavior being consistent across a multi-instance backend deployment.
- Live YouTube search can return `503` if the key is missing outside dev —
  handle this as a distinct state, not a generic error toast.

## 7. Risks

| Risk                                     | Mitigation                                                                                                           |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| LLM-generated content shapes drift       | Defensive parsing + fallback UI in every AI-content panel                                                            |
| Long-running strong analysis feels stuck | Explicit polling UI with elapsed time, cancel/retry affordance                                                       |
| Graph gets large and unreadable          | Cap the home-page preview graph to top-N nodes by recency/importance; full force-directed view lives on its own page |
