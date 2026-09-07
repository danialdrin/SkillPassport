# Design.md — AI-Powered Student Skill Intelligence Platform

## 1. Product framing

This is not a video-completion tracker. It is a layer that sits above whatever
a student is already learning from (YouTube, PDFs, docs) and answers one
question the LMS can't: **what does this student actually know, right now,
and what's the one thing blocking their next concept?**

Two audiences, one codebase:
- **Student** — searches/uploads material, gets quizzed and interviewed,
  watches their skill graph fill in.
- **Institution / placement cell** (later phase) — views aggregate skill
  data instead of GPA or attendance.

The home page designed here is the **student's signed-in home**, not a
marketing landing page — the backend has no public marketing content, so the
home screen's job is orientation: *where am I weak, and what should I do
next*.

## 2. Design tokens

### Color

| Token | Hex | Use |
|---|---|---|
| `paper` | `#EEF2ED` | App background — pale eucalyptus-grey, not stock cream |
| `surface` | `#F5F7F3` | Cards / panels raised slightly off paper |
| `ink` | `#1C2430` | Primary text, headings, primary buttons |
| `ink-muted` | `#4A554E` | Secondary text |
| `line` | `#D8DDD3` | Borders, dividers |
| `mastered` | `#2F6F5E` | Pine green — competency ≥ 80, brand accent |
| `developing` | `#C99A3E` | Gold — competency 60–79 |
| `gap` | `#A63D2F` | Brick rust — competency < 60, used **only** for gap semantics |

These three mastery colors are functional, not decorative — they always mean
the same thing everywhere they appear (graph nodes, gap list, score chips).
Never reuse `gap` red as a generic "error" color or `mastered` green as a
generic "success" toast color; keep the semantic meaning singular.

### Type

| Role | Face | Notes |
|---|---|---|
| Headline / product voice | Source Serif 4 | Used for page titles and the greeting only — gives the academic-report seriousness the subject deserves without being a generic SaaS sans headline |
| UI / body | Inter | Nav, buttons, body copy, labels |
| Numeric data | IBM Plex Mono | **Only** for actual numbers that benefit from tabular alignment: competency scores, IDs, timestamps. Never used for decorative labels. |

Type scale: 40/32/24/16/14px. Line length capped near 60–70 characters for
body copy under the hero.

### Layout

- Left-aligned, asymmetric grid (`content` + `420px graph panel` on the
  home hero). No centered marketing-style hero.
- Max content width 1024px, generous vertical rhythm (see `py-10` sections)
  rather than boxed cards — sections are separated by hairline rules, not
  drop shadows.
- Action tiles use a left border accent instead of the rounded-card-with-
  shadow pattern, to avoid every piece of content looking identically boxed.

### Motion

- One deliberate moment: the skill graph nodes animate in on first load
  (Phase 2, optional) growing from the center outward to mimic "concepts
  connecting." No hover-fade on every tile — keep hover states to a simple
  border-color change.

## 3. Component inventory

| Component | Backend source | Notes |
|---|---|---|
| `ScoreChip` | `student.overallScore` from student graph / passport | Monospace numeral, `x/100` |
| `SkillGraph` (SVG) | `GET /knowledge-graph/student/{user_id}` | Nodes colored by `competency_score` via the three mastery tokens; edges from `prerequisite_ids` |
| `ActionTile` | — | Entry points into Search, Upload, Quiz, Interview flows |
| `GapRow` | `GET /passport/{user_id}/gaps` | Shows `display_name`, `recommended_prerequisites`, `competency_score` |
| `ResourceRow` + `StatusBadge` | `GET /resources` | Status badge maps `pending / medium_analyzed / selected / strong_analyzed` to plain-language labels (see table below) |
| `ActivityItem` | `competency_events` (surfaced via quiz/interview submit responses) | Most recent evidence events |
| `JobPoller` (non-visual) | `GET /jobs/{job_id}` | Polls every 1–3s while `queued`/`processing`; drives resource status transitions |
| `QuestionRenderer` | `POST /exams/quiz/start` | Switches on `type`: `mcq` (options), `short_answer` / `code_explain` (textarea) |
| `InterviewThread` | `POST /exams/interview/*` | Turn-by-turn chat; ends automatically at 5 turns, no explicit end action in UI |

### Status label mapping (used verbatim in UI copy)

| API status | UI label |
|---|---|
| `pending` | Not started |
| `medium_analyzed` | Reviewed |
| `selected` | Analyzing… |
| `strong_analyzed` | Ready to study |

## 4. Page inventory

1. **Login / Register** — `POST /auth/login`, `POST /auth/register`
2. **Home** (built here) — orientation dashboard
3. **Search & Intake** — `POST /search`, medium analysis, upload (PDF/URL)
4. **Resource Detail** — analysis, material graph, summary/flashcards/quiz,
   "Start adaptive quiz" / "Start interview" entry points
5. **Adaptive Quiz** — question-by-question, submit, per-question feedback
6. **AI Interview** — turn-by-turn conversation
7. **Skill Graph (full view)** — student's whole graph, zoomable
8. **Skill Passport** — full competency list + gaps, shareable/verifiable
   view (stretch: exportable as a portfolio artifact)
9. *(Stretch, Phase 4)* **Institutional Dashboard** — aggregate view, not in
   current backend surface; needs new endpoints before building

## 5. Interaction and state patterns

- **Loading**: every AI-generated panel (summary, flashcards, quiz, graph)
  gets its own inline skeleton — never block the whole page on one slow
  provider call, since these are three independent, retryable requests.
- **Empty**: a new user's graph, gaps, and activity feed are legitimately
  empty. Empty states say what to do next in the interface's own voice —
  e.g. "No gaps yet. Take a quiz to start mapping what you know" — not a
  generic "No data."
- **Error**: surface `detail` from the API directly where it's written for
  humans; for `401` clear the session and redirect to login without a
  toast (per API doc, tokens don't self-report expiry); for `503` (YouTube
  key missing) show a distinct "search unavailable" state, not a generic
  error.
- **Untyped LLM JSON** (summary/flashcards/quiz/interview bodies): render
  defensively — missing optional fields must degrade gracefully, never
  crash a panel.

## 6. Search & Resource Detail screens (client-specified visual direction)

These two screens follow a reference design provided directly, which uses a
different, lighter palette than the Home token system in §2 — treat this as
an intentional exception for the "study" flow rather than a drift from the
system:

- **Search results** (`SearchResults.jsx`) — a YouTube-style grid, not a
  list. Each card: 16:9 thumbnail with duration/preview image, title (2-line clamp), channel name, description snippet, and `is_mock` badge in dev — sourced directly from `CandidateResourceResponse` returned by `POST /search`. Filter chips above
  the grid (`All / Under 20 min / Beginner / With transcript`) map to
  client-side filtering of `POST /search` results — the backend doesn't
  support these as query params, so filter the returned candidate list.
- **Resource Detail** (`ResourceDetail.jsx`) — two-column study layout:
  - Left: video player, chapter/transcript tabs (green dot = has content),
    auto-scroll toggle, chapter list with inline timestamps — sourced from
    `GET /analyses/{analysis_id}` (`important_sections`, transcript text).
  - Right: a tabbed AI panel ("Detailed Summary" is the default tab, "+
    Learn Tab" adds more views). Content is `GET /resources/{id}/summary`
    bullets with inline timestamp chips, followed by an embedded **mindmap**
    — a radial tree with one purple center pill (the topic) branching to
    blue pills (its sub-concepts), rendered as curved SVG connectors. Source
    this from `GET /knowledge-graph/material/{analysis_id}`: center = the
    concept node being explained, branches = its directly related/`part_of`
    nodes.
  - Top bar carries the primary "Take Exam" action, which should route
    straight into `POST /exams/quiz/start` for the current resource.

Color/type notes specific to these two screens: white surface, gray-900
text, blue-500 as the interactive/branch-pill accent, purple gradient
reserved for the single center "topic" pill so it reads as the anchor of
the mindmap. Keep this palette scoped to Search + Resource Detail; Home,
Skill Graph, and Passport keep the mastery-token system in §2 since those
screens are about competency, not content browsing.

## 7. Accessibility & responsiveness

- Color is never the only signal for mastery — gap rows also carry the
  numeric score and the word "Needs:" prerequisite text.
- Visible keyboard focus rings on all interactive elements (tiles, tabs,
  nav links).
- Home collapses to a single column under 768px; the skill graph panel
  moves below the greeting rather than shrinking illegibly.
- Respect `prefers-reduced-motion` for the graph's entrance animation.
