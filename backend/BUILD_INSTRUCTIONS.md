# Build Instructions — Ordered Build Sequence

No day/time restrictions — this is a strict **dependency order**, not a schedule. Each phase produces a runnable, demoable slice before you move to the next. Don't skip ahead to a later phase while an earlier one is half-working — every module downstream depends on the one before it actually functioning.

---

## Folder Structure (create this first)

```
skill-platform/
├── .env
├── requirements.txt
├── app/
│   ├── main.py
│   ├── core/
│   │   ├── config.py          # loads .env via pydantic-settings or dotenv
│   │   ├── security.py        # JWT create/verify, password hash/verify
│   │   └── deps.py            # get_current_user, get_db, get_redis dependencies
│   ├── db/
│   │   ├── mongo.py           # Motor client + collection getters
│   │   └── redis_client.py    # redis.asyncio client
│   ├── models/                # Pydantic schemas: one file per domain
│   │   ├── user.py
│   │   ├── resource.py
│   │   ├── analysis.py
│   │   ├── knowledge_graph.py
│   │   ├── assessment.py
│   │   └── passport.py
│   ├── routers/                # one file per module from plan.md
│   │   ├── auth.py
│   │   ├── search.py
│   │   ├── resources.py        # upload + selection
│   │   ├── analysis.py         # strong analysis trigger + polling
│   │   ├── knowledge_graph.py
│   │   ├── interactive.py      # summary/quiz/flashcards
│   │   ├── exams.py             # quiz + interview
│   │   └── passport.py
│   ├── services/                # business logic, called by routers
│   │   ├── youtube_service.py
│   │   ├── transcript_service.py
│   │   ├── pdf_service.py
│   │   ├── llm_service.py       # Groq OpenAI Responses client wrapper + prompt templates
│   │   ├── embedding_service.py # SentenceTransformer singleton + cosine similarity helpers
│   │   ├── medium_analysis_service.py  # local, non-LLM scoring — uses embedding_service, no llm_service calls
│   │   ├── strong_analysis_service.py
│   │   ├── kg_service.py
│   │   ├── exam_service.py
│   │   └── competency_service.py
│   └── utils/
│       └── json_extract.py     # safely parse LLM JSON output, strip markdown fences
```

**Action right now:**

```bash
mkdir skill-platform && cd skill-platform
python -m venv venv && source venv/bin/activate   # or venv\Scripts\activate on Windows
pip install fastapi "uvicorn[standard]" motor redis "python-jose[cryptography]" \
    "passlib[bcrypt]" openai sentence-transformers numpy textstat \
    google-api-python-client youtube-transcript-api \
    pymupdf httpx python-dotenv pydantic
pip freeze > requirements.txt
```

Create the folder tree above, drop your `.env` (from `techstack.md`'s template) in the root, confirm MongoDB and Redis are reachable (local install, or point `.env` at Atlas/Redis Cloud free-tier URIs if you'd rather not run local services).

**Smoke test before writing any business logic:** a bare `main.py` with one `GET /health` route, run `uvicorn app.main:app --reload`, hit `/docs`. If this doesn't work, nothing after it will — fix it first.

---

## Phase 1 — Foundation

1. **Auth.** Build `users` collection, register/login endpoints, JWT create/verify, the `get_current_user` dependency. Test fully via `/docs` before moving on — every other route depends on this working.
2. **DB connection layer.** `db/mongo.py` with a Motor client and helper functions to get each collection by name. `db/redis_client.py` similarly.
3. **LLM service wrapper.** `services/llm_service.py` — one function `call_llm(prompt: str, expect_json: bool) -> dict` calling Groq through the OpenAI Responses API. Handle stripping markdown code fences from `response.output_text` before `json.loads`. Configure `GROQ_API_KEY`, `GROQ_BASE_URL`, and `GROQ_MODEL` in the environment. This service is only ever called starting in Phase 3 (Strong Analysis) — Phase 2's Medium Analysis never touches it.
4. **Embedding service.** `services/embedding_service.py` — load the SentenceTransformer model once at module import time, expose `embed(text: str) -> np.ndarray` and `cosine_sim(a, b) -> float`. Test standalone: embed two similar sentences and two unrelated ones, confirm similarity scores make intuitive sense before wiring into Medium Analysis.

**Checkpoint:** register, login, get a JWT; successfully make one standalone Groq Responses API call; successfully embed and compare two sentences locally. Do not proceed until all three work.

---

## Phase 2 — Search + Medium Analysis

1. **Search module.** YouTube search endpoint, store lightweight `resources` docs, return to client (paginated, per `plan.md` §2).
2. **Medium Analysis module.** Pull transcript via `youtube-transcript-api`. Using `embedding_service`, compute the seven factors (relevance, topic coverage, depth, examples, clarity, structure, redundancy) exactly as specified in `plan.md` §3, combine into a weighted `overall` score, store on `resources.medium_analysis`, `status: "medium_analyzed"`. **No call to `llm_service` anywhere in this step.**

**Checkpoint:** search a real topic, see candidate videos scored and ranked — confirm this is fast (no perceptible per-video LLM latency) and works even if you temporarily disconnect from the internet other than YouTube (proves it's not secretly depending on OmniRoute).

---

## Phase 3 — Selection, Upload, Strong Analysis, Knowledge Graph

1. **Selection + Upload endpoints.** Trivial state transitions for Search-flow selection; file handling for PDF upload (`PyMuPDF` text extraction, page-tagged). Upload skips Medium Analysis entirely — goes straight here.
2. **Strong Analysis service.** The hardest single piece — give it the most attention.
   - Chunking logic: naive is fine (split by N characters/tokens with slight overlap) — don't build topic-aware chunking.
   - Structured-output prompt (exact JSON shape in `plan.md` §5). Validate every LLM response against a Pydantic model before saving — catches malformed output immediately instead of corrupting the knowledge graph.
   - Wrap in `BackgroundTasks` + a `jobs` doc so the HTTP request returns instantly with a `job_id`, polled via `GET /jobs/{id}`.
3. **Knowledge Graph build.** Concept dedup (normalize name — lowercase + strip, don't attempt fuzzy/embedding matching), upsert `skill_nodes` + `kg_edges`.
4. **`GET /knowledge-graph/material/{analysis_id}`** — confirm a real video/PDF produces a sensible concept graph. This is your most important artifact for the report — capture a good result once it works.

**Checkpoint:** upload a test PDF and paste a test YouTube link, watch Strong Analysis complete, view the resulting knowledge graph for each.

---

## Phase 4 — Interactive Modules

1. Summary, quiz, flashcards — Redis-cache pattern (check cache → miss → generate via LLM → store → return), keyed `{analysis_id}:{version}`.
2. These are the simplest LLM calls in the system (no grading, no scoring) — should move fast.

**Checkpoint:** fetch cached summary/quiz/flashcards for an analyzed resource; confirm a second request hits cache instead of calling the LLM again.

---

## Phase 5 — Exam Module (Quiz + Interview)

1. **Exam Quiz.** Generate questions from `analyses` content (reuse Strong Analysis output — never re-analyze). Look up `student_kg_state` for difficulty tuning (default "beginner" if no prior state). Grade: MCQ binary, everything else LLM-graded 0.0–1.0 partial credit.
2. **Interview.** One question at a time — generate question 1, student answers, LLM evaluates + generates question 2 conditioned on the previous answer, repeat. Every turn written to `interview_sessions` in Mongo (not Redis) so history is durable and resumable.

**Checkpoint:** complete one quiz attempt and one interview session end-to-end, confirm `attempts` / `interview_sessions` docs and `competency_events` docs are created correctly.

---

## Phase 6 — Competency Engine + Skill Passport

1. **Competency Engine.** The EMA update function from `plan.md` §9 — write as a small, isolated, testable function: `update_competency(old_score, event_score, alpha=0.4) -> new_score`. Worth a unit test if you write any tests at all — this is the one place a bug wouldn't be visually obvious.
2. **Wire quiz/interview submission → `competency_events` → Competency Engine → `student_kg_state` update.** Confirm a submitted quiz actually moves the relevant node's score.
3. **Skill Passport read endpoint.** Compute-on-read: join `student_kg_state` with `skill_nodes` for display names, include evidence provenance (which `competency_events` back each score).
4. **Knowledge gap endpoint (optional but cheap once the above works):** nodes with evidence + score < 60, plus low-scoring prerequisites walked via `kg_edges`.

**Checkpoint:** run the full loop on fresh data — search → select → strong analysis → knowledge graph → quiz → passport update — and see the score move as a direct result of the quiz you just took.

---

## Standing Rules (apply throughout, not tied to any phase)

- **Do not refactor for elegance mid-build.** If a service function is ugly but correct, leave it — clean it up in the report's narrative, not in working code.
- **Test each endpoint via `/docs` the moment it's written**, not at the end. Catching a broken endpoint immediately costs minutes; catching it during later integration costs much more.
- **If Strong Analysis is slow to get right, cut chunking sophistication further** (process only the first portion of any long resource) rather than cutting the module — a working shallow version beats a broken deep one.
- **Never delete a working endpoint to "do it properly later."** Working beats perfect until everything above is done once, end to end.
