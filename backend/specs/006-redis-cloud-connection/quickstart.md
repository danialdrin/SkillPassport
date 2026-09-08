# Quickstart: Hosted Redis Connection

## Prerequisites

- Python environment configured according to `BUILD_INSTRUCTIONS.md`.
- The hosted Redis service is reachable from the development environment.
- The project `.env` contains the intended `REDIS_URL` if overriding the code default.

## Validate configuration without printing credentials

```bash
./.venv/bin/python -c 'from app.core.config import settings; from urllib.parse import urlsplit; u=urlsplit(settings.REDIS_URL); print(u.scheme, u.hostname, u.port)'
```

Expected output identifies the `redis` scheme, the hosted Redis hostname, and port `17312`; it must not print the password.

## Validate Redis connectivity

```bash
./.venv/bin/python -c 'import asyncio; from app.db.redis_client import get_redis_client; asyncio.run(get_redis_client().ping())'
```

When the hosted service is reachable, the command completes successfully. When it is unavailable, the existing in-memory fallback behavior remains available.

## Run tests

```bash
./.venv/bin/pytest -q
```

The complete test suite must pass, and no test output should contain the Redis password.
