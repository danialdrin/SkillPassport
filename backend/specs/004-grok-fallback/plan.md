# Implementation Plan: Reliable Groq Structured JSON for Strong Analysis

**Feature Branch**: `004-grok-fallback`
**Status**: Approved

## Technical Context & Scope

The service uses only Groq's OpenAI-compatible Responses API and one configured model, `openai/gpt-oss-20b`. Provider failures and empty output are logged and propagated without switching providers or models. Strong Analysis distinguishes API failures, response extraction failures, JSON syntax failures, and schema validation failures.

Strong Analysis sends one bounded primary prompt and may make one bounded correction retry only when the first successful HTTP response contains malformed or schema-invalid JSON. A successful operation persists only the validated result; it never partially saves malformed data.

YouTube search is intentionally outside the LLM provider decision. `YOUTUBE_API_KEY` remains a separate credential for YouTube Data API v3. Removing Gemini/Grok/OmniRoute keys must not remove or repurpose the YouTube key.

The installed OpenAI SDK exposes `responses.create(..., text=...)` but not `response_format`. The plan requires verifying Groq support for the SDK's `text` structured-output parameter before enabling it, with a prompt-only compatibility path if the provider rejects that parameter.

## Constitution Check

The repository constitution is a placeholder and defines no enforceable principles. No gate violations are identified. The plan follows the existing FastAPI, Pydantic, Groq, MongoDB, and Redis architecture.

## Phase 0: Research Summary

- `responses.create` returns `output_text`; the installed SDK supports a `text` parameter but not `response_format`.
- JSON syntax failures should preserve decoder line, column, and character position plus a safe local excerpt.
- A single correction retry is bounded and must use an explicit correction prompt; a second failure marks the job failed.
- Strong Analysis must continue to use one successful primary request and never split a resource into multiple analysis requests.
- YouTube Data API and Groq are independent integrations with separate credentials.

## Proposed Code Changes

### `app/services/llm_service.py`

- Extract raw `response.output_text` safely from the Groq Responses API.
- Add strict JSON instructions and use the SDK's `text` structured-output option only after verifying Groq/model compatibility.
- Distinguish API, extraction, parsing, and schema errors in logs without secrets.
- Preserve `expect_json=True` and provide a concise correction prompt for the one retry.

### `app/utils/json_extract.py`

- Remove Markdown fences and isolate one object or array without changing JSON meaning.
- Raise a typed error preserving decoder message, line, column, position, and a bounded diagnostic excerpt.
- Do not auto-repair commas, quotes, brackets, or content.

### `app/services/strong_analysis_service.py`

- Keep the existing endpoint, job system, database flow, and one-request architecture.
- Require a JSON object and validate it with `StrongAnalysisResultSchema` before MongoDB insertion or knowledge-graph updates.
- Retry once with an explicit correction prompt after parsing or schema validation failure.
- Mark the job failed with a clear diagnostic after the retry fails.

## Phase 1: Design & Validation

- Model the typed extraction failure and Strong Analysis validation boundary in `data-model.md`.
- Define the internal LLM and existing Strong Analysis endpoint behavior in `contracts/api-routes.md`.
- Add focused tests for valid JSON, fenced/surrounded JSON, malformed JSON, wrong JSON type, missing fields, retry success/failure, safe diagnostics, and no partial persistence.
- Preserve the existing Groq-only provider, YouTube integration, job lifecycle, and API response contracts.

## Verification Plan

- Run the focused JSON extraction and LLM service tests.
- Run the Strong Analysis retry and no-partial-save tests.
- Run the complete pytest suite.
- Verify syntax diagnostics include model, line, column, character position, and safe excerpt without credentials.
- Verify malformed first output triggers at most one correction retry.
