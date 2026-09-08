# Mock Transcription Fixtures

Fixtures in this directory are development/test data only. Each JSON filename must match its `video_id`, for example `mock_vid_normal.json`.

Mock transcription is selected by default for the local `development` environment and can be controlled with `USE_MOCK_TRANSCRIPTIONS`. It is allowed only when that setting is true and `APP_ENV` is `development` or `test`. Production keeps the real transcription provider by default, and synthetic `mock_vid_*` IDs never trigger a real network lookup.

## Canonical shape

```json
{
  "video_id": "mock_vid_normal",
  "language": "en",
  "duration": 30.0,
  "full_text": "Complete transcript text.",
  "segments": [
    {
      "id": 1,
      "start": 0.0,
      "end": 5.0,
      "text": "Complete transcript text.",
      "speaker": "Instructor"
    }
  ],
  "status": "complete"
}
```

Required top-level fields are `video_id`, `language`, `duration`, `full_text`, `segments`, and `status`. Valid statuses are `complete`, `empty`, `partial`, and `error`. Error fixtures also contain `error.code`, `error.message`, and `error.retryable`.

Each segment requires an integer `id`, non-negative `start`, `end` greater than `start`, and non-empty `text`. `end` must not exceed the fixture duration. Segments must be chronologically ordered, have unique IDs, and must not overlap. `speaker` is optional metadata.

The provider normalizes canonical segments to the existing consumer shape by deriving `duration = end - start` while preserving `text`, `start`, and optional metadata. Downstream analysis continues to receive the existing full-text and segment contract.

## Required fixtures

- `mock_vid_normal.json`: long deterministic transcript for scrolling, search, timestamp navigation, and analysis.
- `mock_vid_multispeaker.json`: transcript with multiple speaker labels.
- `mock_vid_empty.json`: successful empty transcript.
- `mock_vid_partial.json`: explicitly incomplete transcript.
- `mock_vid_error.json`: deterministic retryable error scenario.

Do not store user transcripts or production-generated data in this directory.
