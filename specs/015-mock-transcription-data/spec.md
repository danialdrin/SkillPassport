# Feature Specification: Deterministic Mock Transcription Data

**Feature Branch**: `015-mock-transcription-data`

**Created**: 2026-09-06

**Status**: Draft

**Input**: User description: "Create a separate feature specification for adding mock transcription data to the existing transcription flow."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Use a realistic transcript during development (Priority: P1)

As a developer or tester, I want deterministic transcript data that follows the same contract as the current transcription flow, so that transcript display and downstream analysis can be exercised when external transcription is unavailable.

**Why this priority**: A stable transcript fixture prevents the development and testing flow from breaking because of external provider availability or inconsistent source data.

**Independent Test**: Enable the mock provider in a development/test environment, request a normal mock video, and verify that the existing transcript and analysis consumers receive usable text and ordered segments without calling the real provider.

**Acceptance Scenarios**:

1. **Given** mock transcription is explicitly enabled and a normal mock video ID is selected, **When** the transcription flow requests the video transcript, **Then** deterministic transcript data is returned with full text and ordered timestamped segments.
2. **Given** the normal mock transcript is passed to existing analysis, **When** analysis runs, **Then** analysis receives the same normalized transcript inputs it would receive from the real provider.
3. **Given** mock transcription is not explicitly enabled or the environment is production, **When** a real video is processed, **Then** the existing real transcription flow remains the default.

### User Story 2 - Test transcript states and metadata (Priority: P1)

As a frontend or analysis tester, I want fixtures for normal, multi-speaker, empty, partial, and failed transcription states, so that each user-visible state can be verified without depending on a live transcription service.

**Why this priority**: State coverage is required to prevent loading, empty, partial, and error flows from being conflated.

**Independent Test**: Select each named fixture and verify its state, metadata, UI/API result, and downstream behavior independently.

**Acceptance Scenarios**:

1. **Given** a multi-speaker fixture, **When** it is loaded, **Then** each segment may expose a speaker label while retaining the canonical segment fields.
2. **Given** an empty fixture, **When** it is loaded successfully, **Then** the flow reports a completed empty transcript rather than loading or error, and the existing empty-transcript presentation is used.
3. **Given** a partial fixture, **When** it is loaded, **Then** the flow identifies it as incomplete and does not present it as a completed transcript.
4. **Given** an error fixture, **When** it is selected, **Then** the flow reports a deterministic transcription error with user-safe error information and exposes the existing retry behavior when supported.

### User Story 3 - Replace fixtures without changing consumers (Priority: P2)

As a developer maintaining transcription integrations, I want mock files to be identifiable by video ID and replaceable independently, so that new test videos can be added without creating a second downstream processing pipeline.

**Why this priority**: Clear fixture ownership keeps test data maintainable and protects the existing real-provider and analysis boundaries.

**Independent Test**: Add or replace one fixture using the documented naming and schema rules, select it explicitly, and verify that existing transcript and analysis consumers continue to operate without code changes to their input contract.

**Acceptance Scenarios**:

1. **Given** a valid fixture named for a known mock video ID, **When** that ID is selected, **Then** the matching fixture is loaded deterministically.
2. **Given** mock mode is disabled, **When** the same video flow is requested, **Then** fixture data is not selected accidentally.

### Edge Cases

- A fixture with an empty `full_text` and no segments is a completed empty transcript, not a loading state.
- A partial fixture must declare an incomplete state even when it contains valid segments.
- A fixture whose segment timestamps are invalid, overlapping, out of order, or beyond `duration` must fail validation before it reaches downstream consumers.
- A missing fixture or unknown mock video ID must produce a deterministic mock lookup error distinct from an intentionally empty transcript.
- A duplicate transcription request while a mock request is loading must not start a second request.
- Segment text containing punctuation, line breaks, Unicode characters, or long content must remain valid and searchable.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The system MUST provide a dedicated mock transcription data location separated from production transcription logic, with one identifiable fixture per mock video ID.
- **FR-002**: Each normal mock fixture MUST use one canonical transcript object containing required `video_id` (string), `language` (string), `duration` (number of seconds), `full_text` (string), and `segments` (array) fields.
- **FR-003**: Each transcript segment MUST contain required `id` (integer), `start` (number of seconds), `end` (number of seconds), and `text` (non-empty string) fields; `speaker` (non-empty string) MUST be supported as optional metadata.
- **FR-004**: Transcript validation MUST require `duration >= 0`, `start >= 0`, `end > start`, `end <= duration`, chronological segment ordering, unique segment IDs within a fixture, and no segment overlap unless the existing transcription contract explicitly supports overlap.
- **FR-005**: The mock provider MUST normalize valid fixture data to the current transcription service contract of full text, segment records, and transcript availability so existing medium analysis, strong analysis, transcript display, search/navigation, and downstream consumers can reuse their current input boundary.
- **FR-006**: The system MUST include at least one normal long transcript fixture with enough ordered segments to exercise scrolling, timestamp navigation, speaker labels, segment selection, search, and analysis.
- **FR-007**: The system MUST include at least one multi-speaker fixture that uses multiple labels such as `Speaker 1`, `Speaker 2`, `Instructor`, or `Student` without implementing speaker diarization.
- **FR-008**: The system MUST include an intentionally empty fixture with valid metadata, empty `full_text`, and an empty `segments` array, and MUST distinguish it from loading and error states.
- **FR-009**: The system MUST include a partial fixture with valid available segments and an explicit incomplete status, and MUST prevent consumers from treating that fixture as a completed transcript.
- **FR-010**: The system MUST include an error scenario that can be selected deterministically and returns a stable error category/message distinct from empty and partial transcript results.
- **FR-011**: The mock flow MUST expose a loading state while fixture data is being selected or loaded, reuse existing loading presentation where available, avoid rendering incomplete data as final, and prevent duplicate requests.
- **FR-012**: Mock transcription MUST be explicitly enabled through a development/test-only selection mechanism compatible with the existing project configuration; production MUST continue using the real transcription provider by default.
- **FR-013**: Mock fixture selection MUST be deterministic by explicit mock video ID or equivalent explicit test configuration; normal live video IDs MUST NOT silently select mock data.
- **FR-014**: The system MUST preserve the existing real transcription provider, production behavior, strong-analysis algorithm, and downstream processing logic except for the smallest provider boundary or normalization change required to select mock data cleanly.
- **FR-015**: Mock transcription data MUST NOT be persisted as production user transcript data solely because it was used for development or testing.
- **FR-016**: The fixture set and its validation rules MUST be documented sufficiently for developers to add, replace, and identify fixtures without reverse-engineering the provider implementation.

### Key Entities _(include if feature involves data)_

- **MockTranscriptFixture**: A deterministic transcript fixture identified by `video_id`, with language, duration, full text, ordered segments, and an optional lifecycle state.
- **TranscriptSegment**: A time-bounded text unit with an integer ID, start/end timestamps, text, and optional speaker label.
- **MockTranscriptState**: The explicit state of a fixture or request: `loading`, `complete`, `empty`, `partial`, or `error`.
- **MockTranscriptError**: A deterministic failure result containing an error category and user-safe message without changing the production provider's error model unnecessarily.
- **NormalizedTranscriptResult**: The existing downstream-compatible result containing full text, normalized segment records, and transcript availability.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Five documented deterministic scenarios are available for development/testing: normal, multi-speaker, empty, partial, and error.
- **SC-002**: 100% of valid fixture segments pass schema and timestamp validation before reaching downstream consumers.
- **SC-003**: 100% of mock requests with explicit fixture IDs return the same result across repeated runs with the same fixture files and configuration.
- **SC-004**: Existing downstream consumers receive the same normalized transcript input shape for both real-provider and mock-provider flows, with no second analysis pipeline introduced.
- **SC-005**: Production runs select the real transcription provider by default when mock mode is not explicitly enabled.
- **SC-006**: Testers can distinguish loading, completed empty, partial, and error outcomes from the returned state and user-visible behavior in every provided scenario.
- **SC-007**: Replacing one fixture file or adding one new valid fixture does not require changes to strong analysis, transcript display, search/navigation, knowledge graph generation, quiz generation, or video analysis consumers.

## Assumptions

- The existing backend transcription service remains the provider boundary because it already returns full text, segments, and an availability flag.
- The existing legacy segment shape uses `text`, `start`, and `duration`; the mock provider may normalize canonical `start`/`end` values into that shape for current consumers while retaining the canonical fixture schema.
- The current frontend transcript view primarily consumes flattened `transcript_or_text`; richer segment navigation can consume normalized segments when the existing flow exposes them, but this feature does not require a new transcript UI redesign.
- Mock fixtures are development/test assets and are not user-owned production records.
- The default behavior is real transcription in production and mock transcription only after explicit development/test selection.
- The existing project configuration mechanism will be reused rather than introducing a separate production configuration system.

## Non-Goals

- Replacing the real transcription provider.
- Changing production transcription behavior by default.
- Implementing speech-to-text or speaker diarization.
- Generating real transcripts.
- Modifying strong analysis or creating a second downstream processing pipeline.
- Persisting mock transcripts as production user data.
