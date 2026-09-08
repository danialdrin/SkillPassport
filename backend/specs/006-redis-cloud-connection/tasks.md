# Tasks: Hosted Redis Connection

## Phase 1: Tests

- [x] T001 Add focused settings coverage proving the default Redis host and port resolve to the hosted endpoint without asserting or printing the password.
- [x] T002 Add a configuration-reference regression check covering the tracked setup files that previously used the localhost Redis URL.

## Phase 2: Core Implementation

- [x] T003 Change the default `REDIS_URL` in `app/core/config.py` to the provided hosted Redis URL.
- [x] T004 Update `.env.example`, `techstack.md`, and `specs/001-backend/quickstart.md` to use the provided hosted Redis URL.
- [x] T005 Preserve `app/db/redis_client.py` behavior and verify it still consumes `settings.REDIS_URL` without logging credentials.

## Phase 3: Validation

- [x] T006 Run focused Redis configuration tests and the complete pytest suite.
- [x] T007 Mark completed tasks and confirm the Redis contract, fallback behavior, and documentation are consistent.
