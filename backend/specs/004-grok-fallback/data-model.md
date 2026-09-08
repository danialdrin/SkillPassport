# Data Model: Provider Configuration

## Settings

| Field             | Type       |                                      Required | Purpose                                                        |
| ----------------- | ---------- | --------------------------------------------: | -------------------------------------------------------------- |
| `GROQ_API_KEY`    | string     |                              For LLM features | Credential for the sole LLM provider; never returned or logged |
| `GROQ_MODEL`      | string     |             Yes, default `openai/gpt-oss-20b` | One Groq model used by all LLM workflows                       |
| `GROQ_BASE_URL`   | URL string | Yes, default `https://api.groq.com/openai/v1` | OpenAI-compatible Groq endpoint                                |
| `YOUTUBE_API_KEY` | string     |                               For live search | Independent YouTube Data API v3 credential; not an LLM key     |
| `APP_ENV`         | string     |                     No, default `development` | Controls missing-YouTube-key behavior                          |

## Search Result

A search response contains `candidates` and `next_page_token`. Development fallback candidates must include an explicit `is_mock: true` marker. Live YouTube candidates must use the YouTube `videoId`, title, channel, thumbnail, and description fields and must not expose the API key.

## Relationships

- `YOUTUBE_API_KEY` -> `YouTubeService.search_videos` -> `/search`
- `GROQ_API_KEY` + `GROQ_MODEL` + `GROQ_BASE_URL` -> `LLMService.call_llm` -> Strong Analysis and downstream generation/grading
- The two credential paths are independent and must never be substituted for one another.

## Strong Analysis Validation State

| Boundary                 | Accepted value                      | Failure behavior                                                 |
| ------------------------ | ----------------------------------- | ---------------------------------------------------------------- |
| Responses API extraction | Non-empty `response.output_text`    | Typed extraction error with safe excerpt                         |
| JSON parsing             | One JSON object for Strong Analysis | Preserve decoder message, line, column, and position; retry once |
| Schema validation        | `StrongAnalysisResultSchema` object | Retry once; then fail job without persistence                    |
| Persistence              | Fully validated `extracted_data`    | Insert analysis and build graph only after validation            |

The correction retry is limited to one additional Groq request for the same Strong Analysis operation. No malformed or partially validated data is persisted.
