# Feature Specification: MongoDB Atlas Connection

**Feature Branch**: `007-mongodb-atlas-connection`

**Created**: 2026-09-05

**Status**: Draft

**Input**: User description: "Change the localhost MongoDB connection to MongoDB Atlas using the supplied Atlas URI and refine the code so it successfully connects."

## User Scenarios & Testing

### User Story 1 - Connect to MongoDB Atlas (Priority: P1)

As a backend operator, I want the application to connect to the supplied MongoDB Atlas cluster instead of localhost so the existing application collections are available in the hosted database.

**Why this priority**: The current localhost URI requires a local MongoDB server and does not connect the backend to the intended Atlas cluster.

**Independent Test**: Load the configured URI, create the async Mongo client, send an Atlas ping using Server API version 1, and verify the command succeeds.

**Acceptance Scenarios**:

1. **Given** the application loads its default settings, **When** `MONGO_URI` is read, **Then** it targets the supplied Atlas cluster rather than `localhost:27017`.
2. **Given** the Mongo client is created, **When** the connection is verified, **Then** the async client sends `admin.command("ping")` with Server API version 1 and succeeds against Atlas.

### User Story 2 - Preserve Existing Database Access (Priority: P2)

As an application feature, I want existing `get_database()` and `get_collection()` callers to keep working after the connection migration.

**Why this priority**: Authentication, resources, analysis, and other routers depend on the current database helper API.

**Independent Test**: Run the existing test suite and verify the Mongo helper still selects the configured `skill_intelligence` database without changing caller interfaces.

**Acceptance Scenarios**:

1. **Given** the Mongo client has been initialized, **When** application code calls `get_database()` or `get_collection(name)`, **Then** it receives the same Motor database/collection abstractions as before.

## Edge Cases

- Atlas connectivity or DNS may be unavailable; connection verification must raise a clear error without logging the password.
- Atlas may reject the connection because the client IP is not allowlisted or the credentials are invalid.
- The existing environment override for `MONGO_URI` must continue to take precedence over the code default.
- Shutdown must still close the Motor client cleanly.

## Requirements

### Functional Requirements

- **FR-001**: The default `MONGO_URI` MUST target the supplied MongoDB Atlas cluster.
- **FR-002**: The `.env`, `.env.example`, tech stack documentation, and backend quickstart MUST no longer use the localhost MongoDB URI.
- **FR-003**: The runtime client MUST remain asynchronous and use the existing `AsyncIOMotorClient` integration.
- **FR-004**: The runtime client MUST configure MongoDB Server API version 1 using `ServerApi("1")`.
- **FR-005**: The connection verification path MUST issue an asynchronous `admin.command("ping")` and report failure clearly.
- **FR-006**: Existing database and collection helper interfaces and shutdown behavior MUST remain compatible.
- **FR-007**: MongoDB credentials MUST NOT be logged, returned in API responses, or printed by tests.

### Key Entities

- **MongoDB connection configuration**: The `MONGO_URI` and `MONGO_DB_NAME` settings consumed by the database layer.
- **Async Mongo client**: The singleton Motor client configured for Atlas and Server API version 1.

## Success Criteria

### Measurable Outcomes

- **SC-001**: The configured Mongo URI resolves to the Atlas hostname and no intended configuration file contains the old localhost URI.
- **SC-002**: An Atlas `ping` succeeds from the application’s async connection path when network access and credentials are valid.
- **SC-003**: Existing tests pass and database helper callers require no API changes.
- **SC-004**: No test or application log exposes the MongoDB password.

## Assumptions

- The supplied Atlas database user, password, cluster hostname, and network access rules are valid.
- The target database remains `skill_intelligence`.
- The supplied credential should be rotated if it has been exposed outside the intended environment.
