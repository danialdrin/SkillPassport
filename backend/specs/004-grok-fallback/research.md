# Research: Groq-Only LLM and YouTube Search Configuration

## Decision: Use typed JSON parsing failures and one correction retry

- **Decision**: Preserve the original JSON decoder location in a typed extraction error, log a bounded safe excerpt, and retry once with a correction prompt when the response is malformed or schema-invalid.
- **Rationale**: A successful HTTP response can still contain invalid JSON. One correction attempt improves reliability without infinite loops or repeated malformed payloads.
- **Alternatives considered**: Silent automatic repair was rejected because inserting commas or changing quotes can change analysis meaning. Unlimited retries were rejected because they can multiply cost and hide persistent model failures.

## Decision: Verify Responses structured output before using it

- **Decision**: The installed OpenAI SDK exposes `responses.create` with a `text` parameter but not `response_format`. Verify whether Groq accepts the SDK's structured text configuration for the retained model before enabling it; retain prompt-only JSON enforcement as the compatibility path.
- **Rationale**: Passing an unsupported parameter can turn a parsing problem into an API failure. The plan must follow the installed SDK and provider behavior rather than assume Chat Completions options apply to Responses.
- **Alternatives considered**: Use `response_format` unconditionally; rejected because it is absent from the installed method signature. Continue prompt-only output; retained as a fallback when provider support is unavailable.

## Decision: Validate before persistence

- **Decision**: Parse the response, require a JSON object, validate with `StrongAnalysisResultSchema`, then insert the analysis and build the knowledge graph. Failed validation marks the existing job failed and stores no partial result.
- **Rationale**: The analysis and graph are downstream state and must never be built from incomplete or wrong-type model output.
- **Alternatives considered**: Save valid portions; rejected because partial analysis is misleading and can create inconsistent graph state.

## Decision: Keep YouTube API as a separate integration

- **Decision**: Retain `YOUTUBE_API_KEY` independently from the Groq LLM settings.
- **Rationale**: YouTube Data API v3 performs resource discovery/search; it is not an LLM provider. Removing it causes `/search` to enter the service's mock-candidate path and makes live search appear unavailable.
- **Alternatives considered**: Remove YouTube search entirely; reject all searches without a key; reuse the Groq key. These were rejected because they either break an existing platform workflow or mix unrelated credentials.

## Decision: Make missing-key behavior explicit

- **Decision**: Use live YouTube search when `YOUTUBE_API_KEY` is configured. In development mode without a key, return candidates explicitly marked as mock data; in non-development mode, return a clear configuration error.
- **Rationale**: Local development can remain runnable without external credentials, while production responses cannot misrepresent generated placeholders as real search results.
- **Alternatives considered**: Always return unmarked mock results; always fail. Unmarked mocks are misleading, while always failing harms local development.

## Decision: Keep Groq as the only LLM provider

- **Decision**: Keep only `GROQ_API_KEY`, `GROQ_BASE_URL`, and `GROQ_MODEL` for LLM calls. Use the OpenAI Responses API and `openai/gpt-oss-20b`.
- **Rationale**: This preserves the requested one-provider/one-model boundary while leaving non-LLM API credentials available for their own integrations.
- **Alternatives considered**: Treat every API key as an LLM provider; remove all non-Groq keys. Both incorrectly conflate application integrations.

## Decision: No extra LLM requests for Strong Analysis

- **Decision**: Strong Analysis sends exactly one Groq request per resource operation; input is bounded before that request.
- **Rationale**: This is an explicit product requirement and prevents the observed multiple-request behavior.
- **Alternatives considered**: Chunked requests or provider fallback rotation. Both violate the clarified request-count requirement.
