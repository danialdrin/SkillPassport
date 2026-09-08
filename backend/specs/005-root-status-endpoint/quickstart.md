# Quickstart: Root Service Status Endpoint

## Prerequisites

- Python environment configured according to `BUILD_INSTRUCTIONS.md`.
- Project dependencies installed.

## Run the server

From the repository root:

```bash
uvicorn app.main:app --reload
```

## Validate the root endpoint

In another terminal:

```bash
curl -i http://127.0.0.1:8000/
```

Expected result:

```json
{ "message": "AI-Powered Student Skill Intelligence Platform Backend" }
```

The HTTP status must be `200 OK`.

## Validate health compatibility

```bash
curl -i http://127.0.0.1:8000/health
```

The existing health response must still contain `status`, `service`, and `version`.

## Run automated validation

```bash
pytest tests/test_root_endpoint.py
```

The focused tests must pass for both the root response and the unchanged health response.
