# Single-Model Provider Verification

The LLM service uses Groq exclusively through the OpenAI Responses API. Set `GROQ_API_KEY`, `GROQ_BASE_URL`, and `GROQ_MODEL` in the environment, then run:

```bash
./.venv/bin/python -m pytest -q tests/test_llm_service.py
./.venv/bin/python -m pytest -q
```

The focused tests verify one Groq Responses API request, `response.output_text` parsing, JSON extraction, empty output, missing-key, and provider-error behavior. Tests use mocked provider responses and do not send credentials over the network.

Strong Analysis sends exactly one Groq request per resource. Input longer than the configured analysis bound is reduced before the request; the single structured response is used to build the persisted analysis and knowledge graph.

If the first successful Groq response is malformed or fails Strong Analysis schema validation, the service makes at most one correction request. It persists no analysis or knowledge-graph data until parsing and `StrongAnalysisResultSchema` validation succeed.

JSON reliability verification passes with 9 focused tests covering extraction diagnostics, safe excerpts, wrong types, missing fields, retry success, retry failure, safe logging, and no partial persistence. The installed SDK exposes `responses.create(text=...)`, but no provider-compatible structured-output parameter is enabled until Groq support for the retained model is verified.

Run the JSON reliability checks with:

```bash
./.venv/bin/python -m pytest -q tests/test_llm_json.py tests/test_strong_analysis_requests.py
```

YouTube search uses a separate `YOUTUBE_API_KEY`; it is not a Groq or LLM credential. With the key configured, `POST /search` returns live YouTube Data API results. Without it, development mode may return candidates explicitly marked as mock data, while non-development mode must return a clear configuration error.

Verified locally: `8 passed` for `tests/test_llm_service.py` and `tests/test_groq_only.py`; the complete suite passes `10 tests` with no provider calls because the LLM boundary is mocked.
