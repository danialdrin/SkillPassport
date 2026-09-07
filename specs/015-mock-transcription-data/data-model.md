# Data Model: Deterministic Mock Transcription Data

## MockTranscriptFixture

A versioned JSON fixture selected by a development/test video ID.

| Field       | Type                         |    Required | Rules                                                                                                             |
| ----------- | ---------------------------- | ----------: | ----------------------------------------------------------------------------------------------------------------- |
| `video_id`  | string                       |         Yes | Must match the fixture identifier and be unique within the fixture directory.                                     |
| `language`  | string                       |         Yes | BCP-47-style language identifier; initial fixtures use `en`.                                                      |
| `duration`  | number                       |         Yes | Seconds; must be `>= 0`.                                                                                          |
| `full_text` | string                       |         Yes | Complete available text for `complete`/`empty`; may contain available text for `partial`; empty only for `empty`. |
| `segments`  | array of `TranscriptSegment` |         Yes | Ordered by `start`; may be empty only for `empty` or a valid partial with no available segments.                  |
| `status`    | enum                         |         Yes | `complete`, `empty`, `partial`, or `error`.                                                                       |
| `error`     | `MockTranscriptError`        | Conditional | Required only when `status` is `error`; absent for other statuses.                                                |

## TranscriptSegment

A time-bounded piece of transcript content.

| Field     | Type    | Required | Rules                                                   |
| --------- | ------- | -------: | ------------------------------------------------------- |
| `id`      | integer |      Yes | Unique within a fixture; positive and stable.           |
| `start`   | number  |      Yes | Seconds; `>= 0`.                                        |
| `end`     | number  |      Yes | Seconds; greater than `start` and `<= duration`.        |
| `text`    | string  |      Yes | Non-empty after trimming whitespace.                    |
| `speaker` | string  |       No | Non-empty when present; metadata only, not diarization. |

### Relationships and invariants

- `end - start` is the segment duration.
- Segments are chronologically ordered by `start`.
- Segments do not overlap unless the existing transcription model is intentionally extended to support overlap.
- Every segment timestamp is within the parent fixture duration.
- `full_text` is the ordered text joined from available segments for complete and partial fixtures; empty fixtures intentionally contain no usable text.

## MockTranscriptState

- `loading`: runtime request state while selecting/reading a fixture; not stored as a fixture status.
- `complete`: usable transcript is complete.
- `empty`: successful transcript response with no usable text or segments.
- `partial`: some transcript content is available, but processing is not complete.
- `error`: fixture selection or loading failed and includes a deterministic error result.

## MockTranscriptError

| Field       | Type    | Required | Rules                                                                             |
| ----------- | ------- | -------: | --------------------------------------------------------------------------------- |
| `code`      | string  |      Yes | Stable category such as `MOCK_TRANSCRIPT_NOT_FOUND` or `MOCK_TRANSCRIPT_FAILURE`. |
| `message`   | string  |      Yes | User-safe, deterministic message.                                                 |
| `retryable` | boolean |      Yes | Indicates whether existing retry behavior should be offered.                      |

## NormalizedTranscriptResult

The current service-compatible output passed to existing callers:

- `full_text: str`
- `segments: list[dict]`, with current consumer fields `text`, `start`, and derived `duration`; canonical metadata may be retained where safe.
- `transcript_available: bool`, true for complete, partial, and multi-speaker content with usable segments; false for empty/error results according to current service semantics.
- Explicit state/error information must remain available to the provider/API boundary where the current flow supports it, without requiring analysis consumers to change their existing tuple contract.

## State Transitions

```text
request starts
    -> loading
    -> complete       (valid normal/multi-speaker fixture)
    -> empty          (valid empty fixture)
    -> partial        (valid partial fixture)
    -> error          (missing, invalid, or error fixture)

loading -> error      (fixture read/validation failure)
loading -> complete/empty/partial (successful fixture resolution)
```

A partial result must not transition to `complete` unless a later provider response explicitly supplies completion; static fixtures do not simulate implicit completion.

## AnalysisJobFailure

The terminal failure record used when downstream analysis cannot consume the normalized transcript or when the LLM returns unusable output.

| Field        | Type     | Required | Rules                                                           |
| ------------ | -------- | -------: | --------------------------------------------------------------- |
| `job_id`     | string   |      Yes | Must be the same identifier returned when the job was created.  |
| `status`     | enum     |      Yes | `failed`; terminal and no longer pollable as processing.        |
| `error`      | string   |      Yes | User-safe summary; detailed provider traces remain server logs. |
| `updated_at` | datetime |      Yes | Time the terminal state was persisted.                          |

The state transition is `queued -> processing -> failed` after the bounded correction retry cannot produce the required analysis schema. A frontend poller must stop when it receives `failed` or a definitive missing-job response.

## InsufficientInputAnalysisFallback

When source text is unavailable or too short for reliable extraction, Strong Analysis returns a schema-valid illustrative result rather than empty required collections.

Rules:

- `topics`, `concepts`, `relationships`, and `important_sections` each contain at least one valid item.
- Text identifies the content as mock, illustrative, or based on insufficient source context.
- Content must describe general educational examples and must not claim unsupported facts about the original video or document.
- The result uses the existing `StrongAnalysisResultSchema`; no second downstream analysis format is introduced.
