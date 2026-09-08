# Tasks: MongoDB Atlas Connection

## Phase 1: Tests

- [x] T001 Add focused settings coverage proving the Mongo URI resolves to the Atlas host and SRV scheme without printing credentials.
- [x] T002 Add focused client coverage proving `ServerApi("1")` is supplied and the async ping verification path awaits `admin.command("ping")`.
- [x] T003 Add a configuration-reference regression check covering all discovered files that previously used `mongodb://localhost:27017`.

## Phase 2: Core Implementation

- [x] T004 Change the default `MONGO_URI` in `app/core/config.py` to the supplied Atlas URI.
- [x] T005 Update `.env`, `.env.example`, `techstack.md`, and `specs/001-backend/quickstart.md` to use the supplied Atlas URI.
- [x] T006 Update `app/db/mongo.py` to configure `ServerApi("1")` on the async Motor client and add the async ping verification path while preserving existing helper and close APIs.

## Phase 3: Validation

- [x] T007 Run focused MongoDB configuration/client tests and the complete pytest suite.
- [x] T008 Validate an actual Atlas ping when credentials and network allowlisting are available, without printing the URI password.
- [x] T009 Mark completed tasks and confirm the Atlas contract, lifecycle, and documentation are consistent.
