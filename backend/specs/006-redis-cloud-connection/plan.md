# Implementation Plan: Hosted Redis Connection

**Branch**: `006-redis-cloud-connection` | **Date**: 2026-09-05 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/006-redis-cloud-connection/spec.md`

## Summary

Replace the localhost Redis URL with the user-provided hosted Redis URL in the application default, environment example, and Redis setup documentation. Keep the existing `REDIS_URL` override, resilient fallback, timeouts, and shutdown behavior unchanged.

## Technical Context

**Language/Version**: Python 3.x

**Primary Dependencies**: redis-py asyncio client, Pydantic Settings, fakeredis, pytest

**Storage**: Hosted Redis for cache data; in-memory fakeredis remains the unavailable-service fallback

**Testing**: pytest plus targeted configuration/client tests

**Target Platform**: Linux-hosted FastAPI backend

**Project Type**: Web service

**Performance Goals**: Preserve current Redis connection timeout and lazy connectivity behavior

**Constraints**: Do not log or return the credential; preserve environment overrides and fallback behavior

**Scale/Scope**: One runtime setting and all tracked setup/documentation references to the old localhost URL

## Constitution Check

The repository constitution is a placeholder and defines no enforceable principles. No gate violations are identified. The design follows the existing settings and resilient Redis client architecture.

## Project Structure

### Documentation (this feature)

```text
specs/006-redis-cloud-connection/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
    └── configuration.md
```

### Source Code (repository root)

```text
app/core/config.py                 # Default REDIS_URL
app/db/redis_client.py             # Existing settings.REDIS_URL consumer
.env.example                       # Setup example
techstack.md                       # Stack configuration reference
specs/001-backend/quickstart.md    # Existing backend setup guide
```

**Structure Decision**: Keep the change at the existing configuration boundary. No new abstraction is needed because `app/db/redis_client.py` already consumes `settings.REDIS_URL` centrally.

## Phase 0: Research Summary

- The runtime Redis URL is owned by `Settings.REDIS_URL` in `app/core/config.py`.
- `ResilientRedis` already receives the setting and passes it to `Redis.from_url`; no client logic change is required.
- The old localhost URL also appears in `.env.example`, `techstack.md`, and `specs/001-backend/quickstart.md`.
- The hosted URL contains a credential, so tests and logs must avoid printing the value and the credential should be rotated if exposed beyond the intended environment.

## Phase 1: Design and Validation

- The configuration contract is documented in `contracts/configuration.md`.
- The setting shape and precedence are documented in `data-model.md`.
- Runnable validation steps are documented in `quickstart.md`.
- The post-design constitution check passes because no enforceable repository principles are defined.

## Complexity Tracking

No constitution violations or additional complexity require justification.
