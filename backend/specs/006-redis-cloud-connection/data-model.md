# Data Model: Redis Connection Configuration

## `REDIS_URL`

| Property    | Value                                                                    |
| ----------- | ------------------------------------------------------------------------ |
| Name        | `REDIS_URL`                                                              |
| Type        | Redis connection URL string                                              |
| Default     | The user-provided hosted Redis URL                                       |
| Override    | `.env` or process environment variable via Pydantic Settings             |
| Consumer    | `ResilientRedis(settings.REDIS_URL)`                                     |
| Persistence | Redis cache data only; no application records are stored by this feature |

## Validation Rules

- The URL must be passed unchanged to `Redis.from_url`.
- The URL must not be logged or included in API responses.
- Missing hosted Redis connectivity must preserve the existing fakeredis fallback.
- The old localhost URL must not remain in intended tracked Redis configuration references.
