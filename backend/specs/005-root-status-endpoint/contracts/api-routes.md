# API Contract: Root Service Status

## `GET /`

Returns the identity of the running backend for quick local startup confirmation.

### Response: `200 OK`

```json
{
  "message": "AI-Powered Student Skill Intelligence Platform Backend"
}
```

### Behavior

- No authentication is required.
- No database, cache, or external provider request is made.
- The endpoint is independent of the existing `/health` endpoint.

## Compatibility Contract: `GET /health`

The existing endpoint remains unchanged and continues to return its current `status`, `service`, and `version` fields. This feature does not redefine or merge the two responses.
