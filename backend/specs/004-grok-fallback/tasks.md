# Tasks: Groq-Only OpenAI Responses LLM Integration

**Input**: Remove all other API-key providers and retain only Groq, using the OpenAI-compatible client and `responses.create` with model `openai/gpt-oss-20b`.

**Prerequisites**: FastAPI backend, Pydantic settings, existing centralized `LLMService`, downstream LLM consumers, and JSON extraction utility.

**Security requirement**: The API key shown in the request must never be copied into source, tests, documentation, or committed environment files. Treat it as exposed and rotate/revoke it outside the repository.

**Tests**: Included because provider replacement changes the shared LLM boundary used by Strong Analysis, summaries, flashcards, practice quizzes, exams, and interviews.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish the Groq-only configuration and OpenAI Responses API contract.

- [x] T001 [P] Document Groq as the sole external LLM provider and `openai/gpt-oss-20b` as the retained model in `specs/004-grok-fallback/spec.md`
- [x] T002 [P] Add mocked OpenAI Responses API success, empty-output, malformed-output, and provider-error fixtures in `tests/fixtures/llm_responses.py`
- [x] T003 [P] Document required `GROQ_API_KEY`, `GROQ_BASE_URL`, and `GROQ_MODEL` variables plus local verification commands in `specs/004-grok-fallback/quickstart.md`
- [x] T004 [P] Add a repository secret-scan check for provider keys and hard-coded authorization tokens in `tests/test_secret_hygiene.py`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Remove provider ambiguity and define the single shared client boundary.

- [x] T005 Remove Gemini, Grok, and all other non-Groq API-key/model settings, retaining only Groq LLM configuration in `app/core/config.py`
- [x] T006 Set the canonical Groq defaults to `GROQ_BASE_URL=https://api.groq.com/openai/v1` and `GROQ_MODEL=openai/gpt-oss-20b` in `app/core/config.py`
- [x] T007 Remove non-Groq keys, endpoints, and model variables from `.env` and any tracked environment examples, leaving placeholders only for `GROQ_API_KEY` in `.env.example`
- [x] T008 Add settings validation requiring a non-blank Groq model/base URL and a runtime Groq key without logging the key in `app/core/config.py`
- [x] T009 Replace Gemini/OpenAI-compatible HTTP provider branching with one provider-neutral client contract for Groq in `app/services/llm_service.py`

---

## Phase 3: User Story 1 - Call Groq Through OpenAI Responses API (Priority: P1) MVP

**Goal**: Every LLM request uses only Groq through `OpenAI(...).responses.create`, with model `openai/gpt-oss-20b` and no other provider or model fallback.

**Independent Test**: Mock `OpenAI.responses.create`, call `LLMService.call_llm`, and assert exactly one Groq request with the configured base URL, API key sourced from settings, model, and prompt; assert no Gemini/Grok/HTTP fallback request occurs.

### Tests for User Story 1

- [x] T010 [P] [US1] Add unit tests asserting `OpenAI` is initialized with the Groq base URL and settings-provided key in `tests/test_llm_service.py`
- [x] T011 [P] [US1] Add unit tests asserting `responses.create` receives `model="openai/gpt-oss-20b"` and the expected `input` in `tests/test_llm_service.py`
- [x] T012 [P] [US1] Add regression tests asserting one request only and no non-Groq provider/model identifiers in `tests/test_groq_only.py`

### Implementation for User Story 1

- [x] T013 [US1] Replace Gemini client construction and imports with the configured OpenAI client in `app/services/llm_service.py`
- [x] T014 [US1] Implement the single Groq `responses.create` call using `input=prompt`, configured `GROQ_MODEL`, and configured `GROQ_BASE_URL` in `app/services/llm_service.py`
- [x] T015 [US1] Read the Responses API result from `response.output_text` and preserve the existing `expect_json` return contract in `app/services/llm_service.py`
- [x] T016 [US1] Remove all Gemini/Grok provider switching, candidate-model lists, aliases, and `model is been switched` fallback behavior from `app/services/llm_service.py`
- [x] T017 [US1] Raise clear configuration/provider errors when Groq is unavailable, the key is missing, the response is empty, or the request fails in `app/services/llm_service.py`

**Checkpoint**: All LLM calls make one Groq Responses API request and never invoke another provider or model.

---

## Phase 4: User Story 2 - Preserve Structured Output and Downstream Workflows (Priority: P2)

**Goal**: The Groq Responses API replacement preserves JSON parsing, text responses, and every existing LLM-dependent application workflow.

**Independent Test**: Mock Groq Responses API text and JSON outputs, exercise each centralized `call_llm` consumer, and verify parsed results and prompts remain compatible.

### Tests for User Story 2

- [x] T018 [P] [US2] Add JSON/text response tests for plain JSON, fenced JSON, malformed JSON, empty output, and `expect_json=False` in `tests/test_llm_json.py`
- [x] T019 [P] [US2] Add the Strong Analysis one-request regression test in `tests/test_strong_analysis_requests.py`
- [x] T020 [P] [US2] Add request-shape tests proving system instructions and user prompts are represented correctly in the Responses API `input` in `tests/test_llm_service.py`

### Implementation for User Story 2

- [x] T021 [US2] Normalize Responses API output extraction and JSON parsing through `extract_json_from_text` in `app/services/llm_service.py` and `app/utils/json_extract.py`
- [x] T022 [US2] Preserve system-prompt behavior by composing the existing system and user instructions into the Responses API input contract in `app/services/llm_service.py`
- [x] T023 [US2] Verify all existing LLM consumers use the centralized Groq-only `call_llm` path without direct provider imports in `app/services/strong_analysis_service.py`, `app/routers/interactive.py`, and `app/services/exam_service.py`
- [x] T024 [US2] Update dependency declarations to include the OpenAI Python package and remove dependencies used only by deleted provider integrations in `requirements.txt` and `pyproject.toml`

**Checkpoint**: Existing application workflows receive equivalent parsed output through Groq without provider-specific regressions.

---

## Phase 5: User Story 3 - Secure and Observable Groq Configuration (Priority: P3)

**Goal**: Groq configuration is secure, failures are diagnosable, and no removed provider or secret remains in active code or documentation.

**Independent Test**: Run configuration and log tests with fake keys, trigger success/failure paths, and scan the repository for non-Groq provider names and credential patterns.

### Tests for User Story 3

- [x] T025 [P] [US3] Add logging tests asserting provider/model/error context is present while API keys and authorization headers are absent in `tests/test_llm_logging.py`
- [x] T026 [P] [US3] Add repository regression tests asserting `GEMINI_API_KEY`, `GROK_API_KEY`, YouTube-style key literals, and hard-coded Groq tokens are absent from tracked configuration and source in `tests/test_secret_hygiene.py`
- [x] T027 [P] [US3] Add configuration tests for missing key, invalid base URL, model override, and Groq-only startup behavior in `tests/test_config.py`

### Implementation for User Story 3

- [x] T028 [US3] Add structured Groq model/request outcome logging without secret values in `app/services/llm_service.py`
- [x] T029 [US3] Remove obsolete Gemini/Grok settings and provider references from `app/core/config.py`, `.env`, `.env.example`, and `app/services/llm_service.py`
- [x] T030 [US3] Update provider and model documentation, sample code, and runtime instructions to use settings-based Groq credentials rather than inline keys in `techstack.md`, `BUILD_INSTRUCTIONS.md`, and `specs/004-grok-fallback/quickstart.md`
- [x] T031 [US3] Add startup/runtime checks that fail safely when `GROQ_API_KEY` is absent and never print credentials in `app/main.py` and `app/services/llm_service.py`

**Checkpoint**: Only Groq is documented and active, failures are actionable, and secret scanning is clean.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Complete migration verification and preserve platform behavior.

- [x] T032 [P] Run the full test suite with mocked Groq Responses API calls and record results in `specs/004-grok-fallback/quickstart.md`
- [x] T033 [P] Run a repository-wide search for Gemini, Grok/xAI, alternate provider keys, chat-completions endpoint code, and legacy model lists, then remove remaining active references in `app/`
- [ ] T034 Revoke/rotate the exposed key from the request through the provider dashboard and document that only a placeholder belongs in `.env.example`
- [ ] T035 Verify Strong Analysis, summaries, flashcards, practice quizzes, exams, interviews, authentication, caching, and competency workflows with Groq-only configuration in `tests/test_regressions.py`
- [x] T036 Restore `YOUTUBE_API_KEY` and add `APP_ENV` as independent settings without changing the Groq-only LLM settings in `app/core/config.py`
- [x] T037 Update YouTube search missing-key handling to distinguish marked development mocks from non-development configuration errors in `app/services/youtube_service.py`
- [x] T038 Add YouTube live, missing-key, environment-mode, and credential-isolation tests in `tests/test_youtube_service.py`
- [x] T039 Update search response schema and documentation to identify development mock candidates without exposing either provider credential in `app/models/resource.py`, `specs/004-grok-fallback/contracts/api-routes.md`, and `specs/004-grok-fallback/quickstart.md`
- [x] T040 Add typed JSON extraction errors preserving decoder location and safe excerpts in `app/utils/json_extract.py`
- [x] T041 Add strict Strong Analysis JSON instructions and one correction retry for parse/schema failures in `app/services/strong_analysis_service.py`
- [x] T042 Require object type and all top-level Strong Analysis fields before persistence in `app/services/strong_analysis_service.py`
- [x] T043 Add JSON reliability tests for fenced/surrounded/malformed/wrong-type/missing-field/retry/no-partial-save cases in `tests/test_json_extract.py` and `tests/test_strong_analysis_requests.py`
- [x] T044 Add structured error logging tests and distinguish API, extraction, and JSON parsing failures in `app/services/llm_service.py` and `tests/test_llm_logging.py`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; contract, fixtures, documentation, and secret-scan setup can begin immediately.
- **Foundational (Phase 2)**: Depends on the Groq-only contract and blocks provider migration.
- **User Story 1 (Phase 3)**: Depends on Phase 2 and delivers the MVP client migration.
- **User Story 2 (Phase 4)**: Depends on the new `call_llm` implementation and preserves application behavior.
- **User Story 3 (Phase 5)**: Depends on the Groq-only boundary and can overlap with User Story 2 after the call contract stabilizes.
- **Polish (Phase 6)**: Depends on all required stories and external key rotation.

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Phase 2 only.
- **User Story 2 (P2)**: Depends on User Story 1's Responses API contract.
- **User Story 3 (P3)**: Depends on User Story 1's provider removal and logging boundary; independent of downstream consumer changes.

### Parallel Opportunities

- T001-T004 can run in parallel.
- T010-T012 can run in parallel with coordination for shared test files.
- T018-T020 can run in parallel because they target separate test modules.
- T025-T027 can run in parallel.
- T032-T033 can run in parallel after implementation stabilizes.

## Parallel Example: User Story 1

```text
Task: T010 OpenAI client initialization tests in tests/test_llm_service.py
Task: T011 Responses API model/input tests in tests/test_llm_service.py
Task: T012 Groq-only request regression tests in tests/test_groq_only.py
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Replace the existing multi-provider service with one Groq OpenAI Responses API call.
3. Run T010-T012 and verify exactly one request using `openai/gpt-oss-20b`.
4. Stop for validation before broad downstream and documentation cleanup.

### Incremental Delivery

1. Add User Story 2 to preserve JSON and downstream workflow behavior.
2. Add User Story 3 to remove secrets/provider residue and improve diagnostics.
3. Complete key rotation and Phase 6 regression verification.

## Notes

- The supplied API key is intentionally excluded from all generated artifacts; rotate it because it was exposed in the request.
- Groq is the only retained API-key provider. Gemini, Grok/xAI, and any other provider keys/configuration are removed.
- The supplied sample uses `responses.create`, so the implementation must not retain the old `/chat/completions` response parsing contract.
