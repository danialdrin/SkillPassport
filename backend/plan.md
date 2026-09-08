# AI-Powered Student Skill Intelligence Platform — Backend Business Logic Plan

**Scope:** Backend only. Solo build. Deadline: 7th (this month). Today: 4th → **3 working days.**
**Stack lock:** FastAPI monorepo, MongoDB (single DB, graph stored as documents), Redis (cache only, not source of truth), **SentenceTransformers (local, non-LLM) for Medium Analysis**, **OmniRoute (LLM) for Strong Analysis + all downstream content generation/grading**, YouTube Data API + youtube-transcript-api, JWT auth, local dev (uvicorn) only.

---

## 0. Priority Tiers (read this before writing any code)

| Tier | Modules | Rule |
|---|---|---|
| **P0 — must work for demo** | Auth, Upload/Search intake, Medium Analysis, Strong Analysis, Knowledge Graph (Material KG), Quiz (interactive + exam), Digital Skill Passport, Competency Engine | If P0 isn't fully working end-to-end by end of Day 2, stop adding features and stabilize P0. |
| **P1 — build if Day 3 has slack** | Flashcards, Summary generation, Interview module (multi-turn), Knowledge Gap recommendations | Cut silently if short on time — these degrade gracefully (passport still works without them). |
| **Explicitly OUT of scope for this build** | External Proof/Evidence Verification flow, Coding Assessment + Programming Assistant, raw video upload + Whisper transcription, Celery/queue infra, Docker, Google OAuth | Do not start these. Mention them only in the report's "Future Scope" section. |

**Content sources for v1:** YouTube video (via link, transcript pulled through `youtube-transcript-api` — no audio transcription needed) **and** PDF upload (via `PyMuPDF`). This is the cut that makes "Strong Analysis" achievable in 3 days — do not attempt raw video file transcription.

---

## 1. Core Data Model (MongoDB collections — all modules write into these)

```
users            { _id, name, email, password_hash, created_at }
resources        { _id, user_id, source_type: "youtube"|"pdf", url_or_file, title,
                   status: "pending"|"medium_analyzed"|"selected"|"strong_analyzed",
                   medium_analysis: {...} | null,
                   created_at }
analyses         { _id, resource_id, transcript_or_text, concepts: [...], created_at,
                   version }   # "strong analysis" output, versioned
concepts         { _id, name, description, bloom_level, source_analysis_id }
skill_nodes      { _id, name, parent_id | null, prerequisite_ids: [ObjectId],
                   type: "skill"|"concept" }
kg_edges         { _id, from_node_id, to_node_id, relation: "prerequisite"|"part_of"|"related_to" }
                 # Material KG lives here, tagged material_id = analysis_id
student_kg_state { _id, user_id, node_id, competency_score, last_updated,
                   evidence_event_ids: [ObjectId] }   # Student KG = this collection
assessments      { _id, user_id, resource_id|null, type: "quiz"|"interview",
                   questions: [...], created_at, status }
attempts         { _id, assessment_id, user_id, answers: [...], score,
                   per_question_result: [...], created_at }
interview_sessions { _id, user_id, resource_id, turns: [{question, answer, evaluation, ts}],
                     status: "in_progress"|"completed" }
competency_events { _id, user_id, node_id, source: "quiz"|"interview",
                    raw_score, weight, created_at, ref_id }
skill_passport   { _id, user_id, nodes: [{node_id, competency_score, last_verified,
                   evidence_event_ids}], updated_at }
jobs             { _id, type, status: "queued"|"processing"|"done"|"failed",
                   payload, result, created_at }
```

**Redis keys** (cache only, TTL applied, never authoritative):
```
summary:{analysis_id}:{version}      -> generated summary text
quiz:{analysis_id}:{version}         -> generated interactive quiz JSON
flashcards:{analysis_id}:{version}   -> generated flashcards JSON
```
Interview module does **not** use Redis — every turn is written straight to `interview_sessions` in Mongo because it needs durable, resumable history.

---

## 2. Module 1 — Search (External Resource Discovery)

**Purpose:** Let the student find candidate learning resources for a topic without leaving the platform.

**Trigger:** `POST /search` with `{ query: "React Hooks" }`

**Flow:**
1. Call YouTube Data API v3 `search.list` with the query, `maxResults=10`, `pageToken` support for pagination.
2. For each result, store a lightweight `resources` doc with `status: "pending"` (title, thumbnail, video_id, channel — no heavy processing yet).
3. Return the page of candidate resources to the client immediately (don't block on analysis).

**Business rules:**
- Never call Medium Analysis on more than one page (10 items) at a time — pagination is required per the source spec to avoid burning LLM cost on unseen results.
- YouTube API key lives only in backend `.env`, never returned to client.

**Endpoints:**
- `POST /search` — query + optional `page_token` → list of candidate resources
- `POST /search/{resource_id}/analyze-medium` — triggers Module 2 for one candidate (called as the student scrolls/hovers, or batched for the visible page)

---

## 3. Module 2 — Medium Analysis (Local, Non-LLM Pre-Selection)

**Purpose:** Cheap, fast, zero-LLM-cost scoring so the student can rank/pick between candidates *before* committing to expensive Strong Analysis. This runs entirely locally on CPU (SentenceTransformer embeddings + text heuristics) — **no LLM call, no OmniRoute cost, no network latency to an external model provider.**

**Trigger:** Called per-resource from the Search results page (batched, page at a time).

**Flow:**
1. Fetch the transcript via `youtube-transcript-api` (or, if captions unavailable, fall back to title+description only — flag `transcript_available: false`, and score conservatively/lower since there's less signal).
2. Compute a local **query embedding** (the student's search query) and **content embedding(s)** (transcript, chunked into segments) using a SentenceTransformer model (e.g. `all-MiniLM-L6-v2` — small, fast, CPU-friendly, no GPU needed for this scale).
3. Derive each scoring factor from embeddings + lightweight text statistics — **no factor requires an LLM call**:

   | Factor | How it's computed |
   |---|---|
   | **Relevance** | Cosine similarity between query embedding and whole-transcript (or title+description) embedding |
   | **Topic coverage** | Split the query into expected sub-topics (simple keyword/noun-phrase split, or a small fixed list of related terms if you want to keep it trivial), embed each, compute max cosine similarity of each sub-topic against transcript segments, average across sub-topics — higher = more of the topic's breadth is actually covered |
   | **Depth** | Proxy via: unique domain-term density (vocabulary richness after stopword removal), transcript length after filler-word/repetition removal, and segment-to-segment embedding *drift* (a transcript that stays semantically flat throughout is shallow; one that moves through distinct sub-embeddings as it progresses is going deeper) |
   | **Examples** | Heuristic keyword/pattern match count — phrases like "for example," "let's say," "imagine," "consider this," code-block-like patterns — normalized by transcript length |
   | **Clarity** | Standard readability heuristic (e.g. Flesch Reading Ease via `textstat`) on the transcript text — no embeddings needed for this one |
   | **Structure** | Presence/density of YouTube chapter markers or timestamp cues in the description, sentence-length variance (very erratic pacing scores lower), and whether the transcript shows a clear intro→body→conclusion embedding trajectory (compare first-segment, middle-segment, last-segment embeddings for a expected "shift then resolve" pattern vs. random noise) |
   | **Redundancy** | Average pairwise cosine similarity *between* transcript segments — high average similarity means the video is repeating itself; this factor should be inverted before combining (low redundancy = good) |

4. Combine factors into a single weighted `overall` score (0–100) plus the individual factor scores, all returned together — weights are a config dict (`{relevance: 0.25, topic_coverage: 0.2, depth: 0.15, examples: 0.1, clarity: 0.1, structure: 0.1, redundancy: 0.1}` — tune later, don't agonize over exact weights now).
5. Store result on `resources.medium_analysis`, set `status: "medium_analyzed"`.

**Business rules:**
- Medium Analysis is *only* run for Search-flow candidates. **Uploaded resources skip this entirely** and go straight to Strong Analysis (Module 4) — this is a hard rule from the spec, do not run Medium Analysis on uploads.
- No LLM call happens anywhere in this module — this is what makes it safe to run on every candidate in a results page without cost/rate-limit concern, unlike Strong Analysis.
- Embed the SentenceTransformer model **once at app startup** (module-level singleton), not per-request — loading the model repeatedly is the most common way to make this "lightweight" step accidentally slow.

**Endpoint:**
- Returns scores inline as part of `POST /search/{resource_id}/analyze-medium`

---

## 4. Module 3 — Selection

**Purpose:** Record that the student committed to a specific resource (from Search) so downstream modules know what to process deeply.

**Trigger:** `POST /resources/{resource_id}/select` (Search flow) **or** `POST /resources/upload` (Upload flow — PDF or YouTube link pasted directly, skips selection since it's implicit).

**Flow:**
1. Set `resources.status = "selected"`.
2. Immediately kick off Module 4 (Strong Analysis) — synchronously for a college-project demo (no queue), but structured as an async function so a real job queue can be dropped in later without refactoring the interface.

**Business rules:**
- This is a thin, almost trivial endpoint — do not over-engineer it. Its only job is state transition + trigger.

---

## 5. Module 4 — Strong Analysis (Deep Semantic Analysis via OmniRoute)

**Purpose:** Once the student has selected a resource (using the free, local Medium Analysis ranking), send its full transcript/text to OmniRoute for genuine LLM-driven deep semantic analysis. This is the **only** module that calls an LLM for content understanding, and its output becomes the single upstream source for every downstream module — summary, quiz, flashcards, knowledge graph, and exam content all read from this one structured result. The interview module also reads from it, but generates/evaluates one question at a time rather than consuming it all at once (see Module 7b).

**Trigger:** Automatically after Selection (Search flow), or directly after Upload (Upload flow — this is the only analysis an uploaded resource ever receives, since it skips Medium Analysis entirely).

**Flow:**
1. **Get raw text:**
   - YouTube → full transcript via `youtube-transcript-api` (with timestamps).
   - PDF → page-wise text via `PyMuPDF` (`fitz`), preserving page numbers.
2. **Chunk** the text if long (respect the OmniRoute model's context window — chunk by topic-sized blocks, ~2–4k tokens each, with slight overlap).
3. For each chunk, call the LLM via OmniRoute with a structured-output prompt requesting **JSON only**. The output schema is intentionally rich — this is the one point in the whole pipeline where depth matters more than speed:
   ```json
   {
     "topics": [
       {
         "topic": "React Hooks",
         "subtopics": ["useState", "useEffect", "Custom Hooks"],
         "difficulty": "intermediate",
         "skills": ["state management", "side-effect handling"],
         "learning_outcomes": ["Student can manage component state without classes"]
       }
     ],
     "concepts": [
       {
         "name": "useEffect",
         "definition": "...",
         "examples": ["..."],
         "prerequisites": ["useState"],
         "bloom_level": "apply",
         "difficulty": "intermediate",
         "timestamp_or_page": "12:34"
       }
     ],
     "relationships": [
       { "from": "useEffect", "to": "useState", "relation": "prerequisite" }
     ],
     "important_sections": [
       { "title": "Cleanup functions explained", "timestamp_or_page": "18:02", "why_important": "..." }
     ]
   }
   ```
   Fields to always include per your spec: **topic/subtopic coverage, concepts, definitions, examples, difficulty, skills, learning outcomes, important sections, timestamps (or page numbers), and relationships between concepts.** Keep the Pydantic model for this response strict — every one of these fields should have a defined (possibly empty-list) shape so a partially-missing LLM response fails validation loudly instead of silently saving an incomplete analysis.
4. Merge chunk outputs — dedupe concepts by normalized name across chunks, merge topic/subtopic lists, keep the union of relationships.
5. Persist:
   - `analyses` doc (raw text + full merged structured output above, versioned).
   - `concepts` docs (one per unique concept, carrying definition/examples/difficulty/bloom_level/timestamp_or_page).
   - `skill_nodes` + `kg_edges` docs (Module 5 does the actual graph build, but Strong Analysis hands it the raw material — topics and subtopics become candidate nodes alongside concepts).
6. Set `resources.status = "strong_analyzed"`.

**Business rules:**
- This is the single most expensive/slow step, and the only step that costs OmniRoute tokens for content understanding. Run it as a background task (`FastAPI BackgroundTasks` + a `jobs` doc for polling status) so the request doesn't hang.
- Store the **analysis version** — if the same resource is ever reprocessed, Redis-cached interactive content keyed to the old version is naturally invalidated (new version = new cache keys).
- Every downstream module (6, 7a, 7b) must read from this stored `analyses` doc — none of them should re-fetch the transcript or re-call OmniRoute for a fresh understanding of the content. Strong Analysis happens exactly once per resource version.

**Endpoints:**
- `GET /jobs/{job_id}` — poll status while Strong Analysis runs
- `GET /analyses/{analysis_id}` — retrieve the full extracted structure once done

---

## 6. Module 5 — Knowledge Graph (Material KG vs Student KG)

**Purpose:** Maintain two distinct graphs and never conflate them.

- **Material Knowledge Graph** = what a piece of content teaches. Built once per `analysis_id` from Module 4's output. Stored as `skill_nodes` + `kg_edges`, tagged with `material_id`.
- **Student Knowledge Graph** = what a specific student appears to know, across *all* content they've engaged with. This is `student_kg_state` — one row per (user, node), updated only by the Competency Engine (Module 8), never directly by analysis.

**Flow (build step, runs at the end of Module 4):**
1. For each extracted concept, upsert a `skill_nodes` doc (dedupe against existing nodes by normalized name — e.g. "useEffect" from two different videos should map to the *same* node, not create duplicates).
2. For each extracted relationship, upsert a `kg_edges` doc.
3. Do **not** touch `student_kg_state` here — that only happens when the student is actually assessed (Module 7/8).

**Business rules:**
- Never write competency scores onto Material KG nodes. Material KG has no notion of "score" — only Student KG does.
- Concept deduplication is important enough to get wrong silently — use simple normalization (lowercase, strip whitespace) for v1; don't attempt fuzzy/embedding-based dedup unless Day 3 has spare time.

**Endpoints:**
- `GET /knowledge-graph/material/{analysis_id}` — for rendering the content's concept map
- `GET /knowledge-graph/student/{user_id}` — for rendering the student's personal skill map (joins `student_kg_state` with `skill_nodes` for names)

---

## 7. Module 6 — Interactive Modules (Summary, Quiz, Flashcards)

**Purpose:** Let the student engage with analyzed content before being formally assessed.

**Trigger:** `GET /resources/{resource_id}/summary`, `/quiz`, `/flashcards`

**Flow (identical pattern for all three):**
1. Check Redis for `summary:{analysis_id}:{version}` (etc.).
2. **Cache hit** → return immediately.
3. **Cache miss** → call LLM using the `analyses` doc content, generate the artifact, store in Redis (with TTL, e.g. 7 days — these are cheap to regenerate if they expire, unlike exam records which must be permanent), return it.

**Business rules (per your explicit instruction):**
- These are generated **once** per analysis version and reused — never regenerated on every page load.
- If a resource is re-analyzed (new version), old cache keys are simply orphaned and expire naturally; new keys are generated on next request.
- These are *not* linked to competency scoring. Interacting with a flashcard proves nothing — only the Exam module (Module 7) produces competency evidence. Keep this boundary strict.

**Endpoints:**
- `GET /resources/{resource_id}/summary`
- `GET /resources/{resource_id}/quiz` (this is the *casual* practice quiz — distinct from the formal Exam quiz in Module 7)
- `GET /resources/{resource_id}/flashcards`

---

## 8. Module 7 — Exam Module (Quiz + Interview)

This is the only module whose output feeds the Competency Engine. Two sub-flows:

### 7a. Exam Quiz
1. `POST /exams/quiz/start` `{ resource_id }` → generate questions from the `analyses` content (LLM call, difficulty tuned by the student's current `student_kg_state` for the relevant nodes — see Adaptive Difficulty below), store as an `assessments` doc (`type: "quiz"`, `status: "active"`), return questions **without answers**.
2. `POST /exams/quiz/{assessment_id}/submit` `{ answers: [...] }`:
   - Grade each question. MCQ = binary. Short-answer/code-explain = LLM-graded, returns a **0.0–1.0 partial score**, not just pass/fail.
   - Store an `attempts` doc with per-question results.
   - For each concept tagged on a question, emit a `competency_events` doc (Module 8 consumes this).

### 7b. Interview (one question at a time — per your spec)
1. `POST /exams/interview/start` `{ resource_id }` → creates `interview_sessions` doc, LLM generates **question 1 only**, returned to student.
2. `POST /exams/interview/{session_id}/answer` `{ answer }`:
   - LLM evaluates the answer (0.0–1.0 + short feedback), appends `{question, answer, evaluation}` to `turns` in Mongo.
   - LLM generates the **next question**, conditioned on the previous answer + Strong Analysis context (so the interview adapts, doesn't just run a fixed script).
   - Emits a `competency_events` doc for the relevant concept(s).
3. `POST /exams/interview/{session_id}/end` → `status: "completed"`.
4. `GET /exams/interview/history/{user_id}` → all past sessions, for the student to review previous interview performance (explicit requirement).

**Business rules:**
- **Adaptive difficulty:** before generating quiz/interview questions, look up the student's current `student_kg_state.competency_score` for the target node(s). `>80` → generate harder questions; `50–80` → moderate; `<50` or no prior state → foundational. Pass this as an instruction in the LLM prompt (e.g., "generate questions at an advanced/intermediate/beginner difficulty").
- **Partial credit is mandatory** — never collapse a graded answer to strict pass/fail if it's not a plain MCQ.
- A failed attempt still produces a `competency_events` doc (with a low raw_score) — it is never simply discarded, per the "failed attempts still count as evidence" rule.

---

## 9. Module 8 — Digital Skill Passport & Competency Engine

**Purpose:** The single source of truth for "what does this student actually know," derived only from `competency_events`, never directly edited.

**Flow (runs every time a `competency_events` doc is created — from Module 7):**
1. Fetch the last N (e.g. 5) `competency_events` for this `(user_id, node_id)`.
2. Compute updated score using an exponential moving average so recent performance matters more without discarding history:
   ```
   new_score = α * event.raw_score * 100 + (1 - α) * old_score
   ```
   where `α = 0.4` (tunable constant, document this choice in your report as a design parameter). If no prior score exists, `old_score = event.raw_score * 100` (first event sets the baseline).
3. Upsert `student_kg_state` for that `(user_id, node_id)`: new score, `last_updated`, append the event id to `evidence_event_ids`.
4. Rebuild the relevant slice of `skill_passport.nodes` for that user (or lazily compute the whole passport on read — simpler for 3 days: **compute Skill Passport on read**, don't maintain a separately-synced cached document; only `student_kg_state` needs to be truly authoritative).

**Knowledge Gap identification (P1, only if time allows):**
- A node is a "gap" if it has evidence (`competency_score` exists) AND `competency_score < 60`.
- A node with *no* evidence is "unknown," not a "gap" — don't conflate the two, per spec.
- To recommend what to learn next: walk `kg_edges` (`relation: "prerequisite"`) from a gap node backward — prerequisite nodes with low/no score are the actual root cause, surface those first.

**Endpoints:**
- `GET /passport/{user_id}` — full passport: every node with a score, joined with `skill_nodes` for display names, plus evidence provenance (which `competency_events` support each score — answers "why does this student have this score")
- `GET /passport/{user_id}/gaps` — P1, filtered gap view with prerequisite suggestions

---

## 10. Cross-Cutting Rules (apply to every module above)

1. Never trust a `user_id` from the request body/query — always derive it from the JWT via a shared FastAPI dependency (`get_current_user`).
2. Every LLM call must request strict JSON output and validate it with a Pydantic model before saving — if parsing fails, retry once with a stricter prompt, then fail the job cleanly (don't half-write data).
3. Every collection write from an LLM-derived process must store which `analysis_id`/version it came from, so nothing is ever "orphaned" evidence.
4. Redis is disposable. If Redis is flushed, the platform should degrade (regenerate content on next request) but never lose competency data — competency lives only in Mongo.
