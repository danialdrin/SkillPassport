# Feature Specification: Grok API Fallback for LLM Service

**Feature Branch**: `004-grok-fallback`
**Created**: 2026-09-04
**Status**: Draft

**Input**: Remove all other API-key providers and use Groq exclusively through the OpenAI Responses API with `openai/gpt-oss-20b`.

YouTube Data API is a separate content-search integration and is not an LLM provider. Its `YOUTUBE_API_KEY` must remain independently configurable for live `/search` results.

## Overview

The application relies exclusively on Groq through its OpenAI-compatible Responses API. Each request uses the configured Groq model once; no Gemini, Grok/xAI, or alternate-provider fallback is used.

## Clarifications

### Session 2026-09-04

- Q: Should Strong Analysis make one Groq API request for the entire resource, or one request per text chunk when the resource is divided into chunks? → A: Make exactly one Groq API request for the entire resource, regardless of length; the response must contain all data needed for the displayed Strong Analysis result.

### Strong Analysis Request Scope

- Strong Analysis MUST make exactly one Groq Responses API request per resource analysis operation.
- The request MUST return all required topics, concepts, relationships, important sections, and other data needed by the UI in one structured response.
- The implementation MUST NOT split the resource into multiple LLM requests or make follow-up requests for the same analysis operation.
- Resource length handling MUST occur before the single request, using bounded input, truncation, or another deterministic non-LLM reduction strategy when necessary.

## Requirements

### Functional Requirements

- **FR-001**: Configure only `GROQ_API_KEY`, `GROQ_MODEL`, and `GROQ_BASE_URL` in `app/core/config.py` and environment files.
- **FR-006**: Preserve `YOUTUBE_API_KEY` as a separate non-LLM search setting in `app/core/config.py` and environment files; it must not be treated as a Groq or LLM credential.
- **FR-007**: When `YOUTUBE_API_KEY` is missing, `/search` must return a clearly identified development fallback or a clear configuration error according to the runtime mode; live mode must never silently present mock results.
- **FR-002**: Implement `LLMService.call_llm` with the OpenAI client and `responses.create` using `input` and the configured Groq model.
- **FR-003**: Read response text from `response.output_text` and preserve structured JSON and plain-text return behavior.
- **FR-004**: If `GROQ_API_KEY` is missing or Groq fails, log a safe diagnostic and propagate the failure cleanly.
- **FR-005**: Strong Analysis MUST call `LLMService.call_llm` exactly once per resource analysis operation and persist the complete structured response returned by that request.

## Acceptance Criteria

1. **Groq Success**: Normal requests use Groq model `openai/gpt-oss-20b`.
2. **Responses API**: Requests use `responses.create` and parse `output_text`.
3. **Configuration**: Only Groq credentials, endpoint, and model are configurable.
4. **Single Analysis Request**: A Strong Analysis operation produces its complete displayed result from exactly one Groq API request, including for resources that exceed the normal input size.
5. **YouTube Search**: A configured `YOUTUBE_API_KEY` enables live YouTube search independently of Groq; missing-key behavior is explicit and cannot silently misrepresent mock data as live results.
