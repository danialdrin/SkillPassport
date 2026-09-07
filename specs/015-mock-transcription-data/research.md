# Research: Deterministic Mock Transcription Data

## Decision 1: Keep `TranscriptService` as the provider boundary

**Decision**: Implement mock selection and normalization behind the existing `backend/app/services/transcript_service.py` boundary.

**Rationale**: The current service already centralizes real transcript retrieval and returns `(full_text, segments, transcript_available)`. Both `search.py` medium analysis and `strong_analysis_service.py` call this boundary directly, so downstream consumers do not need a second pipeline.

**Alternatives considered**:

- Add a separate mock API endpoint: rejected because it would bypass the current analysis flow and create a second contract.
- Modify each analysis consumer: rejected because it spreads provider concerns through downstream logic.

## Decision 2: Store canonical fixtures as JSON files keyed by mock video ID

**Decision**: Use `backend/mock_data/transcriptions/{video_id}.json`, with five initial fixtures.

**Rationale**: JSON matches the requested replaceable dataset format, is easy to review and version, and allows deterministic lookup without database persistence. The existing development search already creates IDs beginning with `mock_vid_`.

**Alternatives considered**:

- Inline Python dictionaries: rejected because the current inline mock is difficult to extend and replace.
- MongoDB fixtures: rejected because mock data must not become production user data and local files are sufficient.

## Decision 3: Separate canonical fixture schema from legacy consumer segment normalization

**Decision**: Fixtures use `id`, `start`, `end`, `text`, and optional `speaker`. The provider derives the legacy `duration = end - start` field when returning segments to current consumers.

**Rationale**: The requested schema has explicit end timestamps, while the current medium-analysis code and existing fixtures consume `start` plus `duration`. A boundary adapter preserves compatibility without creating a competing downstream format.

**Alternatives considered**:

- Change every consumer to use `end`: rejected as unnecessary scope and a compatibility risk.
- Keep only the legacy shape in fixture files: rejected because it omits the requested canonical contract and makes validation less explicit.

## Decision 4: Use explicit configuration plus explicit mock IDs

**Decision**: Mock mode is enabled only through a development/test configuration setting, and fixture selection still requires a recognized mock video ID. Production defaults to the real provider.

**Rationale**: Configuration prevents accidental production activation, while the ID prefix/fixture lookup prevents ordinary live video IDs from silently selecting mock data. The existing settings class already loads environment configuration and has `APP_ENV`.

**Alternatives considered**:

- Enable all `mock_vid_` IDs in every environment: rejected because environment isolation is required.
- Replace the real provider globally in development: rejected because tests must also verify the real-provider path remains available.

## Decision 5: Represent lifecycle scenarios explicitly in fixture metadata

**Decision**: Use a required fixture `status` with values `complete`, `empty`, `partial`, or `error`; `loading` is a request/runtime state rather than persisted transcript content.

**Rationale**: Empty and partial data cannot be inferred safely from segment count alone, and loading does not describe a stable file. Explicit state keeps UI/API behavior distinguishable and deterministic.

**Alternatives considered**:

- Infer partial from a missing final segment: rejected because it is ambiguous.
- Store `loading` fixtures: rejected because loading is controlled by request lifecycle, not static data.

## Decision 6: Validate before normalization and analysis

**Decision**: Validate required fields, timestamp bounds, ordering, unique IDs, text, and overlap rules before returning data to existing consumers.

**Rationale**: Invalid mock data should fail close to the fixture boundary rather than causing confusing analysis or UI failures. Validation also makes adding/replacing fixtures safe.

**Alternatives considered**:

- Trust fixture authors: rejected because deterministic test data must fail predictably when malformed.
- Validate only in tests: rejected because runtime fixture selection should not pass malformed data downstream.

## Decision 7: Treat malformed Strong Analysis output as a terminal job failure

**Decision**: Preserve the existing correction retry, then persist a stable failed-job status and user-safe error when the LLM returns empty or schema-incomplete JSON.

**Rationale**: The observed Groq response returned HTTP 200 but no usable output, causing schema validation to fail after the retry. A terminal failure is more reliable than presenting the job as processing indefinitely or repeatedly invoking the provider.

**Alternatives considered**:

- Accept an empty analysis: rejected because downstream schemas require `topics`, `concepts`, `relationships`, and `important_sections`.
- Retry indefinitely: rejected because it can duplicate cost and keep the UI in an unbounded loading state.

## Decision 8: Make job polling terminal-error aware

**Decision**: Return the persisted job ID unchanged from resource creation, stop polling on `failed`, and convert a `404` job response into a surfaced terminal error instead of continuing interval requests.

**Rationale**: The runtime trace showed repeated `GET /jobs/{id}` 404 responses. The backend already creates a job document and updates it to `failed`; the frontend polling hook must consume that state and stop on missing jobs.

**Alternatives considered**:

- Continue polling 404 responses: rejected because the job cannot become available through repeated reads of a missing ID.
- Hide all polling errors: rejected because users need actionable feedback when analysis cannot complete.

## Decision 9: Require complete labeled mock analysis output for insufficient input

**Decision**: Add an explicit instruction to both the primary Strong Analysis prompt and correction prompt: when the source input is insufficient, return a valid complete schema populated with clearly labeled mock educational content. Every required array must contain at least one valid item, and the response must not invent unsupported source-specific facts.

**Rationale**: The observed Groq response returned malformed/incomplete structured output after receiving a fallback transcript. Requiring a complete schema-shaped response prevents missing-field failures while preserving transparency that the content is illustrative rather than extracted from the source.

**Alternatives considered**:

- Allow empty arrays: rejected because the frontend and downstream learning features receive no usable result.
- Silently present fabricated source facts: rejected because it misrepresents the quality and origin of the analysis.
- Add unlimited retries: rejected because it does not solve insufficient-input behavior and can create cost or latency loops.
