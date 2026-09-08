# API Contract: YouTube Search and Groq LLM Boundary

## `POST /search`

### Request

```json
{
  "query": "python programming",
  "page_token": null
}
```

### Live response

When `YOUTUBE_API_KEY` is configured, return the existing `SearchResponse` shape with YouTube-backed candidates and `next_page_token`. Do not include credentials.

### Development fallback response

When the application is in development mode and no YouTube key is configured, return the same candidate shape plus an explicit `is_mock: true` marker for each fallback candidate, or a top-level equivalent marker if the response schema is extended.

### Configuration error response

When the application is not in development mode and no YouTube key is configured, return an actionable 4xx/5xx configuration error rather than mock candidates.

## LLM internal contract

`LLMService.call_llm(prompt, system_prompt, expect_json)` makes one primary `OpenAI.responses.create` request to Groq using `GROQ_MODEL`. It reads `response.output_text`, parses JSON through `extract_json_from_text` when requested, and raises typed errors for extraction or JSON syntax failures. Strong Analysis may make one correction request after malformed or schema-invalid output, then propagates a clear failure without another retry.

For Strong Analysis, the parsed value must be a JSON object and must pass `StrongAnalysisResultSchema` before the analysis document or knowledge graph is written. JSON parsing diagnostics include model, error type, line, column, character position, and a bounded excerpt; credentials are never logged.
