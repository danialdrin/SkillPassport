# Implementation Plan: Deterministic Mock Transcription Data

**Branch**: `015-mock-transcription-data` | **Date**: 2026-09-06 | **Spec**: [spec.md](./spec.md)

## Summary

Replace the current inline `mock_vid_` transcript shortcut with replaceable, validated JSON fixtures and a small mock-provider boundary inside the existing backend transcription service. The provider will normalize canonical fixture segments to the existing `(full_text, segments, transcript_available)` contract so medium analysis, strong analysis, transcript display, and other downstream consumers remain unchanged. Mock selection will be explicit and development/test-only; the real provider remains the production default. Add runtime hardening so malformed/empty Strong Analysis responses become terminal, user-visible failures and job polling stops cleanly on terminal errors or missing jobs. Update the Strong Analysis prompt so insufficient source input produces clearly labeled mock educational output with every required field populated rather than omitted or empty.

## Technical Context

**Language/Version**: Python 3.14 runtime environment; project code uses Python typing compatible with the existing backend.

**Primary Dependencies**: FastAPI, Pydantic v2, `youtube-transcript-api`, pydantic-settings, pytest.

**Storage**: Versioned JSON fixture files under `backend/mock_data/transcriptions/`; no production database persistence for mock transcripts.

**Testing**: pytest for schema, validation, provider selection, state handling, downstream compatibility, and Strong Analysis failure handling; frontend TypeScript/Vite production build.

**Target Platform**: Backend service running locally or in a development/test environment.

**Project Type**: FastAPI web service with a React frontend and shared backend service contracts.

**Performance Goals**: Fixture lookup and validation should be local and fast enough not to add user-visible delay beyond the existing transcription-loading state; no network request is permitted for mock fixture retrieval.

**Constraints**: Preserve `TranscriptService.get_transcript()` callers; preserve the real YouTube transcript provider; keep mock mode explicitly disabled by default outside development/test configuration; reject invalid timestamps before analysis; keep job IDs consistent from creation through polling; never retry a malformed LLM response indefinitely; require complete schema-shaped Strong Analysis output even when the source is insufficient.

**Scale/Scope**: Five initial fixtures covering normal long, multi-speaker, empty, partial, and error scenarios; extensible to additional video-ID keyed fixtures without consumer changes.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

The constitution file contains only unratified placeholder principles and no enforceable MUST/SHOULD rules. No constitution gates can be evaluated, and no violation is introduced by this plan. The design follows the feature's explicit non-goals by keeping the change local to fixture loading/provider selection and not modifying real transcription or analysis algorithms.

## Phase 0: Research

See [research.md](./research.md) for decisions about the existing transcript tuple, canonical-to-legacy segment normalization, fixture state representation, explicit mock selection, validation strategy, and complete fallback analysis output.

## Phase 1: Design

See:

- [data-model.md](./data-model.md) for fixture, segment, state, analysis-job failure, and insufficient-input fallback entities.
- [contracts/transcription.md](./contracts/transcription.md) for the fixture, Strong Analysis, and job polling contracts.
- [quickstart.md](./quickstart.md) for runnable validation scenarios.

## Project Structure

### Documentation

```text
specs/015-mock-transcription-data/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── transcription.md
└── checklists/
    └── requirements.md
```

### Source Code

```text
backend/
├── app/
│   ├── core/config.py
│   ├── models/
│   ├── routers/
│   └── services/
│       ├── transcript_service.py
│       └── strong_analysis_service.py
├── mock_data/
│   └── transcriptions/
│       ├── mock_vid_normal.json
│       ├── mock_vid_multispeaker.json
│       ├── mock_vid_empty.json
│       ├── mock_vid_partial.json
│       └── mock_vid_error.json
└── tests/
    ├── test_transcript_service.py
    ├── test_medium_analysis.py
    ├── test_strong_analysis_requests.py
    └── test_resources_jobs.py

frontend/src/
├── components/study/TranscriptTab.tsx
├── hooks/usePollJob.ts
├── components/resources/UploadModal.tsx
├── components/search/CandidateCard.tsx
├── pages/Search.tsx
├── pages/ResourceDetail.tsx
└── types/analysis.ts
```

**Structure Decision**: Keep fixture data in a dedicated backend directory and keep provider selection/normalization in the existing `transcript_service.py` boundary. Keep Strong Analysis validation and terminal failure handling in its existing service. Keep job polling behavior in the existing React Query hook and its current consumers.

## Implementation Sequence

1. Add canonical fixture schema/state validation and the five fixture files.
2. Add an explicit development/test mock-selection setting with a safe production default.
3. Refactor the existing inline mock branch into fixture lookup and normalization while preserving real-provider behavior.
4. Add service and compatibility tests before changing downstream consumers.
5. Verify frontend and analysis consumers continue to receive their existing input shapes; make only narrowly required state-contract changes.
6. Update the Strong Analysis prompt and correction prompt to require non-empty, clearly labeled mock content when the input is insufficient, then validate that response through the existing schema.
7. Verify malformed-output jobs terminate cleanly and frontend polling stops on terminal failures or missing jobs.

## Runtime Remediation Scope

The observed development trace exposed two integration failures that block the intended mock-transcription flow:

1. Groq returned HTTP 200 with empty or schema-incomplete output. The Strong Analysis job must preserve a terminal `failed` state with a stable, user-safe error rather than leaving the UI in an indefinite analyzing state. When source input is insufficient, the prompt should instead request a complete illustrative result with every required field populated.
2. The frontend repeatedly polled `/jobs/{job_id}` after the backend returned 404. Job creation must return the exact persisted job ID, and polling must stop and surface an error on terminal `failed` or missing-job responses.

These changes are limited to the existing Strong Analysis job/result boundary. They do not change the analysis algorithm, provider selection, or mock transcript schema.

When the source text is too short, unavailable, or insufficient for reliable extraction, the prompt must instruct Groq to return a complete educationally useful mock result. The result must populate `topics`, `concepts`, `relationships`, and `important_sections` with clearly labeled assumptions/mock examples and must not claim unsupported source-specific facts.

See the updated [contracts/transcription.md](./contracts/transcription.md) and [quickstart.md](./quickstart.md) for the job failure, polling, and insufficient-input validation scenarios.

## Complexity Tracking

No constitution violations or complexity exceptions require justification.
