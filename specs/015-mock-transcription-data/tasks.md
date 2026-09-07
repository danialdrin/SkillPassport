# Tasks: Deterministic Mock Transcription Data

**Input**: Design documents from `specs/015-mock-transcription-data/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/transcription.md`, and `quickstart.md`

**Organization**: Tasks are grouped by user story so each increment can be implemented and validated independently.

## Phase 1: Setup

**Purpose**: Create the fixture and test locations required by the implementation plan.

- [x] T001 Create the mock transcription fixture directory at `backend/mock_data/transcriptions/` and add its fixture ownership README at `backend/mock_data/transcriptions/README.md`
- [x] T002 Create the backend transcription test module at `backend/tests/test_transcript_service.py` with shared fixture-loading and service-test setup

## Phase 2: Foundational

**Purpose**: Establish the canonical schema, validation rules, explicit configuration, and provider error types required by all user stories.

- [x] T003 [P] Define `MockTranscriptFixture`, `TranscriptSegment`, `MockTranscriptError`, and lifecycle-state validation in `backend/app/models/transcription.py`
- [x] T004 [P] Add an explicit development/test-only mock-transcription setting with a production-safe default in `backend/app/core/config.py`
- [x] T005 [P] Add the canonical fixture schema, validation rules, state values, and normalized legacy output examples to `backend/mock_data/transcriptions/README.md`
- [x] T006 Add fixture loading, filename/video-ID matching, validation failure handling, and deterministic lookup errors in `backend/app/services/mock_transcript_provider.py`
- [x] T007 Add shared provider result/error types and normalization helpers for canonical `start`/`end` segments to legacy `start`/`duration` records in `backend/app/models/transcription.py`

**Checkpoint**: Canonical fixtures can be validated and loaded through a dedicated provider without changing downstream analysis consumers.

## Phase 3: User Story 1 - Use a Realistic Transcript During Development (Priority: P1) 🎯 MVP

**Goal**: Use deterministic mock data when real transcription is unavailable, but only when mock mode is explicitly enabled; preserve the current real-provider path otherwise.

**Independent Test**: With mock mode enabled, request `mock_vid_normal` and verify stable full text, ordered normalized segments, and successful medium/strong analysis inputs. With mock mode disabled or production configured, verify the real provider remains selected.

### Tests for User Story 1

- [x] T008 [P] [US1] Add schema and timestamp validation tests for the normal fixture in `backend/tests/test_transcript_service.py`
- [x] T009 [P] [US1] Add provider-selection tests proving explicit mock mode uses fixtures and disabled/production mode does not use fixtures in `backend/tests/test_transcript_provider_selection.py`
- [x] T010 [US1] Add fallback tests proving an unavailable real transcript uses the matching mock fixture only in development/test mock mode in `backend/tests/test_transcript_provider_selection.py`

### Implementation for User Story 1

- [x] T011 [P] [US1] Add the long deterministic normal transcript fixture with enough segments for scrolling, timestamp navigation, search, and analysis in `backend/mock_data/transcriptions/mock_vid_normal.json`
- [x] T012 [US1] Refactor `backend/app/services/transcript_service.py` to use the mock provider for explicitly selected mock IDs and normalize canonical segments to the existing `(full_text, segments, transcript_available)` contract
- [x] T013 [US1] Add development/test fallback behavior in `backend/app/services/transcript_service.py` so a missing real transcript uses mock data only when mock mode is enabled and the selected ID has a matching fixture
- [x] T014 [US1] Preserve real-provider error and no-transcript behavior in `backend/app/services/transcript_service.py` when mock mode is disabled or the environment is production
- [x] T015 [US1] Verify the normalized mock output remains compatible with medium analysis inputs in `backend/tests/test_medium_analysis.py`

**Checkpoint**: User Story 1 is independently functional; mock data prevents development flow breaks without changing production transcription behavior.

## Phase 4: User Story 2 - Test Transcript States and Metadata (Priority: P1)

**Goal**: Provide multi-speaker, empty, partial, loading, and error scenarios with distinguishable behavior.

**Independent Test**: Select each state fixture and verify its schema, returned state, user-safe error behavior, and distinction from loading or completed empty results.

### Tests for User Story 2

- [x] T016 [P] [US2] Add multi-speaker, empty, partial, and error fixture contract tests in `backend/tests/test_mock_transcription_states.py`
- [x] T017 [P] [US2] Add tests for invalid timestamps, overlap, ordering, duplicate IDs, missing fixtures, and invalid state/content combinations in `backend/tests/test_mock_transcription_validation.py`
- [x] T018 [US2] Add tests proving loading, empty, partial, and error outcomes remain distinguishable in `backend/tests/test_mock_transcription_states.py`

### Implementation for User Story 2

- [x] T019 [P] [US2] Add the multi-speaker fixture with multiple speaker labels in `backend/mock_data/transcriptions/mock_vid_multispeaker.json`
- [x] T020 [P] [US2] Add the intentionally empty fixture with valid metadata and no usable transcript content in `backend/mock_data/transcriptions/mock_vid_empty.json`
- [x] T021 [P] [US2] Add the explicitly incomplete partial fixture in `backend/mock_data/transcriptions/mock_vid_partial.json`
- [x] T022 [P] [US2] Add the deterministic error fixture with stable error code, message, and retryability in `backend/mock_data/transcriptions/mock_vid_error.json`
- [x] T023 [US2] Extend `backend/app/services/mock_transcript_provider.py` to return explicit complete, empty, partial, and error outcomes while keeping loading as a request lifecycle state
- [x] T024 [US2] Integrate mock lifecycle/error results with the existing transcription caller boundary in `backend/app/services/transcript_service.py` without exposing incomplete data as completed transcript content

**Checkpoint**: User Story 2 is independently functional; all required transcript states and speaker metadata are testable without live transcription.

## Phase 5: User Story 3 - Replace Fixtures Without Changing Consumers (Priority: P2)

**Goal**: Make fixtures identifiable, replaceable, and compatible with existing analysis and transcript consumers.

**Independent Test**: Add or replace one valid video-ID-keyed fixture, select it explicitly, and verify downstream consumers continue receiving the existing normalized contract without consumer-specific changes.

### Tests for User Story 3

- [x] T025 [P] [US3] Add fixture replacement and deterministic repeated-read tests in `backend/tests/test_mock_transcription_fixtures.py`
- [x] T026 [P] [US3] Add compatibility tests for strong analysis, transcript text storage, and downstream normalized input in `backend/tests/test_mock_transcription_compatibility.py`
- [x] T027 [US3] Add a production-safety regression test proving mock fixtures are not selected or persisted as production user transcript data in `backend/tests/test_mock_transcription_compatibility.py`

### Implementation for User Story 3

- [x] T028 [US3] Document fixture naming, replacement, validation, and explicit selection workflow in `backend/mock_data/transcriptions/README.md`
- [x] T029 [US3] Update `backend/app/services/strong_analysis_service.py` only if required to preserve the existing full-text boundary for normalized mock results; otherwise record the compatibility proof in tests
- [x] T030 [US3] Verify `backend/app/routers/search.py`, `backend/app/services/medium_analysis_service.py`, `backend/app/services/kg_service.py`, and existing quiz/video-analysis consumers require no mock-specific branches

**Checkpoint**: User Stories 1, 2, and 3 all work independently and mock fixtures can be replaced without changing downstream consumers.

## Phase 6: Runtime Failure Remediation

**Purpose**: Prevent malformed Strong Analysis responses and missing job records from creating indefinite loading or repeated 404 polling.

**Independent Test**: Simulate an empty/schema-invalid LLM response and a missing job ID; verify the job becomes terminally failed, the user receives a stable error, and frontend polling stops.

### Tests for Runtime Failure Remediation

- [x] T035 [P] Add Strong Analysis malformed-output tests for empty and schema-incomplete LLM responses in `backend/tests/test_strong_analysis_service.py`
- [x] T036 [P] Add job creation/status tests proving the returned ID matches the persisted job and failed jobs return a terminal `JobResponse` in `backend/tests/test_resources_jobs.py`
- [x] T037 [P] Add polling behavior tests or a deterministic query harness for `failed` and `404` outcomes in `frontend/src/hooks/usePollJob.ts`

### Implementation for Runtime Failure Remediation

- [x] T038 [US1] Persist a stable user-safe failure message after bounded Strong Analysis validation retries in `backend/app/services/strong_analysis_service.py` without marking the resource `strong_analyzed`
- [x] T039 [US1] Verify resource creation and background dispatch preserve the exact persisted job ID in `backend/app/routers/resources.py`
- [x] T040 [US1] Ensure failed jobs are returned as terminal responses and missing jobs produce one definitive error in `backend/app/routers/analysis.py`
- [x] T041 [US1] Stop React Query polling on terminal failures and disable automatic retries for missing-job errors in `frontend/src/hooks/usePollJob.ts`
- [x] T042 [US1] Surface failed Strong Analysis and missing-job messages in the upload flow in `frontend/src/components/resources/UploadModal.tsx`
- [x] T043 [US1] Surface failed Strong Analysis and missing-job messages and clear the active job in `frontend/src/pages/Search.tsx`

**Checkpoint**: Empty/schema-invalid LLM output and missing job IDs produce one terminal, user-visible failure instead of repeated polling.

## Phase 7: Polish & Cross-Cutting Validation

**Purpose**: Validate the complete feature against the design contract and quickstart.

- [x] T044 [P] Run the focused transcription, Strong Analysis, and job polling tests from `specs/015-mock-transcription-data/quickstart.md` in `backend/` and `frontend/`
- [x] T045 [P] Run the complete backend test suite and frontend production build, recording unrelated baseline warnings in `backend/` and `frontend/`
- [x] T046 Run the production-safety, no-network, malformed-LLM, and missing-job checks defined in `specs/015-mock-transcription-data/quickstart.md`
- [x] T047 Review `backend/app/services/transcript_service.py`, `backend/app/services/mock_transcript_provider.py`, and `frontend/src/hooks/usePollJob.ts` to remove duplicate fallback/error logic

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; create directories and test scaffolding first.
- **Foundational (Phase 2)**: Depends on Setup; blocks all user-story work.
- **User Story 1 (Phase 3)**: Depends on Foundational; MVP and required before state expansion.
- **User Story 2 (Phase 4)**: Depends on Foundational and the provider boundary from US1; adds state coverage without changing the real provider.
- **User Story 3 (Phase 5)**: Depends on US1 normalization and US2 fixture/state contracts; verifies replaceability and consumer compatibility.
- **Runtime Failure Remediation (Phase 6)**: Depends on the existing provider and job boundaries from US1; blocks final validation.
- **Polish (Phase 7)**: Depends on all user stories and runtime remediation.

### User Story Dependencies

- **US1**: Starts after Phase 2; no dependency on another user story.
- **US2**: Starts after Phase 2, but shares the provider boundary completed in US1.
- **US3**: Starts after US1 and US2 because it verifies the complete normalized contract and fixture set.
- **Runtime remediation**: Starts after US1 and uses the existing Strong Analysis job boundary; it is independently testable with simulated LLM and polling failures.

### Within Each User Story

- Write tests before the corresponding implementation tasks.
- Create independent fixture files in parallel where no shared file is modified.
- Complete schema/provider work before integration verification.
- Keep tasks modifying `transcript_service.py` sequential.

## Parallel Opportunities

- **Phase 2**: T003, T004, and T005 can run in parallel; T006 and T007 follow the model/configuration definitions.
- **US1**: T008 and T009 can run in parallel; T011 can run in parallel with those tests because it is a separate fixture file.
- **US2**: T016 and T017 can run in parallel; T019-T022 can run in parallel because each fixture is a separate file.
- **US3**: T025 and T026 can run in parallel; T028 can run in parallel with tests.
- **Runtime remediation**: T035, T036, and T037 can run in parallel because they target independent backend/frontend test files; T038-T043 are sequential where they share runtime boundaries.
- **Polish**: T044 and T045 can run in parallel after implementation; T046 and T047 follow the test results.

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 Setup.
2. Complete Phase 2 Foundational schema, configuration, loader, and normalization.
3. Complete Phase 3 US1 normal fixture and fallback behavior.
4. Run T008-T015 and stop for independent validation.
5. Keep production mock mode disabled throughout MVP validation.

### Incremental Delivery

1. Deliver US1 for deterministic development fallback.
2. Add US2 for state and speaker coverage.
3. Add US3 for fixture replacement and downstream compatibility proof.
4. Add Runtime Failure Remediation and validate malformed-LLM and missing-job behavior.
5. Run Phase 7 cross-cutting validation before implementation completion.

## Phase 8: Complete Structured Fallback Output

**Purpose**: Ensure insufficient source input produces labeled mock analysis content instead of omitted or empty required fields.

- [x] T048 [US1] Update the primary and correction Strong Analysis prompts and non-empty field validation in `backend/app/services/strong_analysis_service.py`
- [x] T049 [P] [US1] Add regression coverage for complete labeled mock output instructions in `backend/tests/test_strong_analysis_requests.py`
- [x] T050 Run the complete backend suite and frontend production build after prompt hardening in `backend/` and `frontend/`

## Notes

- Every task uses the required `- [ ] T###` checklist format with file paths.
- `[P]` marks only tasks that modify independent files and have no incomplete prerequisite.
- Existing real transcription and analysis logic must remain the default and must not gain mock-specific downstream branches.
