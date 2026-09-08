# Quickstart: MongoDB Atlas Connection

## Prerequisites

- MongoDB Atlas user credentials are valid.
- The development machine IP is allowlisted in Atlas Network Access.
- Python dependencies are installed in `.venv`.
- The project `.env` contains the supplied `MONGO_URI` if overriding the code default.

## Validate configuration without printing credentials

```bash
./.venv/bin/python -c 'from app.core.config import settings; from urllib.parse import urlsplit; u=urlsplit(settings.MONGO_URI); print(u.scheme, u.hostname)'
```

Expected output identifies the `mongodb+srv` scheme and Atlas cluster hostname without printing the username or password.

## Validate Atlas connectivity

Use the application’s async verification path or start the backend and inspect the resulting connection check. The expected result is a successful `admin.command("ping")`; authentication, DNS, TLS, and IP allowlist errors should be reported without the password.

## Run tests

```bash
./.venv/bin/pytest -q tests/test_mongo_config.py
./.venv/bin/pytest -q
```

All focused and complete tests must pass. Existing database and collection helper callers must remain functional.
