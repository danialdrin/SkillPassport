# Quickstart: Validate Mock Transcription Data

## Prerequisites

- Python environment available for the backend.
- Backend dependencies installed from `backend/requirements.txt`.
- Run commands from the repository root unless noted.
- Use development/test configuration only; never enable mock mode in production.

## Automated validation

```bash
cd backend
pytest -q tests/test_transcript_service.py tests/test_medium_analysis.py
```

Expected result: fixture schema/timestamp validation, provider selection, state handling, and existing medium-analysis compatibility tests pass.

If the focused test file does not yet exist, run the current suite while implementation tasks add it:

```bash
cd backend
pytest -q
```

## Fixture validation scenarios

For each required ID, explicitly enable mock mode and request the fixture through the existing transcription service boundary:

| Fixture                 | Expected state | Expected outcome                                                                             |
| ----------------------- | -------------- | -------------------------------------------------------------------------------------------- |
| `mock_vid_normal`       | `complete`     | Non-empty full text and multiple ordered segments; usable by analysis and search/navigation. |
| `mock_vid_multispeaker` | `complete`     | Segments preserve multiple speaker labels.                                                   |
| `mock_vid_empty`        | `empty`        | Successful empty result, not loading or error.                                               |
| `mock_vid_partial`      | `partial`      | Available segments are returned with incomplete status; not treated as final.                |
| `mock_vid_error`        | `error`        | Stable error code/message and existing retry behavior where supported.                       |

## Compatibility checks

1. Call the current medium-analysis endpoint for a development mock resource.
2. Confirm it receives normalized `text`, `start`, and derived `duration` segment fields.
3. Run strong analysis for a mock resource and confirm the same `full_text` input boundary is used as for real YouTube transcripts.
4. Open the existing resource transcript view and confirm normal and empty states render without a new downstream pipeline.
5. Use a non-mock live video ID with mock mode disabled and confirm the real provider path remains selected.
6. Repeat the same mock request and compare output for deterministic equality.

## Safety checks

- Attempting to select a mock fixture in production configuration must not activate mock mode.
- An unknown mock video ID must return a deterministic lookup error.
- A malformed fixture with invalid timestamps must fail validation before analysis.
- Replacing a fixture file must not require changes to analysis consumers.

## Strong Analysis failure and polling checks

1. Use a mock transcript and simulate an empty Groq response followed by a schema-incomplete correction response.
2. Confirm the job is persisted as `failed`, includes a user-safe error, and does not update the resource to `strong_analyzed`.
3. Confirm the resource-creation response `job_id` exactly matches the ID queried by the frontend.
4. Confirm the frontend poller stops on `failed` and displays the error instead of continuing to request `/jobs/{job_id}`.
5. Simulate a missing job (`404`) and confirm polling stops after one terminal error rather than repeating requests indefinitely.

## Insufficient-input analysis check

1. Submit a development/test resource with an empty or intentionally short transcript.
2. Confirm the Strong Analysis prompt requests a complete illustrative result rather than empty fields.
3. Confirm the returned result contains at least one topic, concept, relationship, and important section, with mock/insufficient-context labeling.
4. Confirm the result passes the existing analysis schema and reaches downstream consumers without a missing-field validation failure.
5. Confirm malformed output still becomes a terminal failed job after the bounded retry rather than entering an infinite loop.

See [contracts/transcription.md](contracts/transcription.md) for the exact fixture contract and [data-model.md](data-model.md) for entity/state rules.
