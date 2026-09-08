# Implementation Plan: MongoDB Atlas Connection

**Branch**: `007-mongodb-atlas-connection` | **Date**: 2026-09-05 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/007-mongodb-atlas-connection/spec.md`

## Summary

Migrate MongoDB from localhost to the supplied Atlas cluster while retaining the existing async Motor database helpers. Configure `ServerApi("1")`, add an async ping verification path, update all discovered localhost references, and keep shutdown behavior unchanged.

## Technical Context

**Language/Version**: Python 3.x

**Primary Dependencies**: Motor, PyMongo Server API support, Pydantic Settings, FastAPI, pytest

**Storage**: MongoDB Atlas database `skill_intelligence`

**Testing**: pytest plus focused configuration and Mongo client tests

**Target Platform**: Linux-hosted FastAPI backend

**Project Type**: Web service

**Performance Goals**: Preserve singleton client reuse and avoid repeated client construction; verify connectivity with one ping when explicitly invoked or during startup integration.

**Constraints**: Keep the async Motor API; do not use the sample’s synchronous `MongoClient` in request-serving code; do not log credentials; preserve environment overrides and shutdown.

**Scale/Scope**: One database connection module, one settings value, all tracked setup references to the old localhost URI, and focused verification coverage

## Constitution Check

The repository constitution is a placeholder and defines no enforceable principles. No gate violations are identified. The design follows the existing async Motor architecture and keeps the sample’s Server API and ping intent without introducing a synchronous client.

## Project Structure

### Documentation (this feature)

```text
specs/007-mongodb-atlas-connection/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
    └── configuration.md
```

### Source Code (repository root)

```text
app/core/config.py                 # Default MONGO_URI
app/db/mongo.py                    # Async Motor client, Server API, ping, shutdown
.env                               # Local runtime configuration
.env.example                       # Setup example
techstack.md                       # Stack configuration reference
specs/001-backend/quickstart.md    # Existing backend setup guide
tests/test_mongo_config.py         # Focused URI and helper behavior tests
```

**Structure Decision**: Keep the migration inside the existing settings and database modules. Adapt the provided synchronous sample to Motor’s async client rather than creating a parallel connection implementation.

## Phase 0: Research Summary

- `AsyncIOMotorClient` accepts PyMongo client options, including `server_api=ServerApi("1")`.
- Motor database commands are awaitable, so Atlas verification should use `await get_mongo_client().admin.command("ping")`.
- The current module exposes singleton, database, collection, and close helpers; these public shapes should remain unchanged.
- The old localhost URI appears in the runtime default, `.env`, `.env.example`, `techstack.md`, and `specs/001-backend/quickstart.md`.
- The supplied Atlas URI contains credentials; tests and diagnostics must inspect only scheme, hostname, and port, and the credential should be rotated if exposed.

## Phase 1: Design and Validation

- The URI and client configuration are documented in `data-model.md`.
- The runtime configuration and ping behavior are documented in `contracts/configuration.md`.
- Atlas setup, network allowlisting, ping validation, and test commands are documented in `quickstart.md`.
- The post-design constitution check passes because no enforceable repository principles are defined.

## Complexity Tracking

No constitution violations or additional complexity require justification.
