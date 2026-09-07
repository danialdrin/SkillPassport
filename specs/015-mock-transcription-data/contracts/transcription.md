# Mock Transcription Contract

## Fixture location and selection

Fixtures are stored under:

```text
backend/mock_data/transcriptions/{video_id}.json
```

The fixture filename must match `video_id`. Mock selection requires both:

1. An explicit development/test mock-mode configuration.
2. An explicit known mock video ID, such as `mock_vid_normal`.

Production and ordinary live video IDs continue to use the existing real provider.

## Canonical fixture JSON

```json
{
  "video_id": "mock_vid_normal",
  "language": "en",
  "duration": 312.5,
  "full_text": "Complete transcript text.",
  "segments": [
    {
      "id": 1,
      "start": 0.0,
      "end": 5.4,
      "speaker": "Instructor",
      "text": "Welcome to this tutorial."
    }
  ],
  "status": "complete"
}
```

Required fields are `video_id`, `language`, `duration`, `full_text`, `segments`, and `status`. Segment `speaker` is optional. Error fixtures additionally require `error` with `code`, `message`, and `retryable`.

## Validation contract

A fixture is accepted only when:

- `duration >= 0`.
- Every segment has a unique integer `id`.
- Every segment has non-empty `text`.
- `start >= 0` and `end > start`.
- `end <= duration`.
- Segments are ordered chronologically and do not overlap.
- `status` matches its content: `empty` has no usable text/segments; `error` has an error object; `partial` is explicitly incomplete.

Invalid fixtures fail before downstream analysis receives them.

## Provider output compatibility

The existing provider boundary remains:

```text
get_transcript(video_id) -> (full_text, segments, transcript_available)
```

For mock fixtures, canonical segments are normalized into the current consumer shape:

```json
{
  "id": 1,
  "text": "Welcome to this tutorial.",
  "start": 0.0,
  "duration": 5.4,
  "speaker": "Instructor"
}
```

`duration` is derived as `end - start`. Existing medium analysis, strong analysis, search, transcript display, knowledge graph, quiz, and video-analysis consumers must continue using their existing input boundary.

## Runtime states

- `loading`: returned/displayed while the fixture is being selected or read; no incomplete transcript is rendered as final.
- `complete`: normalized transcript is available for downstream processing.
- `empty`: successful response with no usable transcript content; distinct from loading and error.
- `partial`: usable content exists but completion is explicitly false/incomplete.
- `error`: deterministic error category/message; retry behavior follows the existing flow when supported.

## Strong Analysis job failure contract

The existing resource creation response and persisted job document must use the same `job_id`. A valid terminal failure response is:

```json
{
  "job_id": "persisted-object-id",
  "type": "strong_analysis",
  "status": "failed",
  "result": null,
  "error": "Strong Analysis could not produce a valid structured result.",
  "created_at": "2026-09-07T00:00:00Z"
}
```

The LLM may return HTTP 200 with empty output or JSON missing required analysis keys. After the existing bounded correction retry, the backend must persist `status: failed` and return the user-safe `error`; it must not loop indefinitely or mark the resource `strong_analyzed`.

The frontend job poller must:

- stop polling when `status` is `failed`;
- surface the returned error to the user;
- stop polling on a `404` missing-job response and show a recoverable job-not-found error;
- continue polling only for `queued` and `processing` states.

## Insufficient-input Strong Analysis output

If the transcript or source text is insufficient, the Strong Analysis prompt must instruct the model to return a complete schema-valid illustrative result instead of omitting fields or returning empty arrays. The response must:

- include at least one item in `topics`, `concepts`, `relationships`, and `important_sections`;
- label the content as mock, illustrative, or based on insufficient source context;
- avoid unsupported source-specific claims;
- remain compatible with `StrongAnalysisResultSchema` and all existing downstream consumers.

If the model still returns malformed or incomplete output after the bounded correction retry, the job follows the terminal `failed` contract above.

## Required fixture IDs

- `mock_vid_normal`: long transcript for scrolling, search, timestamp navigation, and analysis.
- `mock_vid_multispeaker`: multiple speaker labels.
- `mock_vid_empty`: valid metadata with empty text and segments.
- `mock_vid_partial`: valid subset with explicit `partial` status.
- `mock_vid_error`: deterministic error scenario.
