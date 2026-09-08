# Feature Specification: Hosted Redis Connection

**Feature Branch**: `006-redis-cloud-connection`

**Created**: 2026-09-05

**Status**: Draft

**Input**: User description: "Change the Redis localhost connection to the provided hosted Redis URL in all places."

## User Scenarios & Testing

### User Story 1 - Use Hosted Redis (Priority: P1)

As a backend operator, I want the application to connect to the hosted Redis instance instead of localhost so cache-backed features work against the intended shared service.

**Why this priority**: The current localhost URL only works when a local Redis server is running and does not use the configured hosted Redis service.

**Independent Test**: Start the application with the configured Redis URL and verify the Redis client uses the hosted endpoint; when reachable, a ping succeeds.

**Acceptance Scenarios**:

1. **Given** the application loads its default settings, **When** `REDIS_URL` is read, **Then** it equals the provided hosted Redis URL.
2. **Given** the Redis client is created, **When** it constructs the async client, **Then** it passes the configured hosted URL to `Redis.from_url`.

### User Story 2 - Keep Configuration References Consistent (Priority: P2)

As a developer setting up the project, I want the examples and setup documentation to use the same hosted Redis URL so local configuration does not silently revert to localhost.

**Why this priority**: Inconsistent examples can cause deployments and development environments to connect to different Redis instances.

**Independent Test**: Search tracked configuration and setup documentation for localhost Redis references and confirm none remain in the intended Redis configuration locations.

**Acceptance Scenarios**:

1. **Given** the project setup files are inspected, **When** Redis configuration is located, **Then** the hosted URL is shown consistently.

## Edge Cases

- The Redis hostname may be unreachable; the existing resilient in-memory fallback behavior must remain available.
- The Redis URL contains credentials and must not be logged or exposed in diagnostics.
- The existing `REDIS_URL` environment override must continue to take precedence over the default.

## Requirements

### Functional Requirements

- **FR-001**: The default `REDIS_URL` MUST be the provided hosted Redis URL.
- **FR-002**: `.env.example` MUST document the same hosted Redis URL.
- **FR-003**: Redis setup documentation containing the old localhost URL MUST be updated to the hosted URL.
- **FR-004**: `ResilientRedis` MUST continue to construct its client from `settings.REDIS_URL`.
- **FR-005**: Existing Redis fallback, timeout, and close behavior MUST remain unchanged.
- **FR-006**: The Redis credential MUST NOT be added to logs, response payloads, or test output.

### Key Entities

- **Redis connection configuration**: The `REDIS_URL` setting consumed by the application Redis client and setup documentation.
- **Resilient Redis client**: The existing async Redis wrapper that connects to the configured URL and falls back to in-memory Redis when unavailable.

## Success Criteria

### Measurable Outcomes

- **SC-001**: No intended project Redis configuration reference contains `redis://localhost:6379/0`.
- **SC-002**: The application default settings resolve to the provided hosted Redis URL.
- **SC-003**: Existing Redis-related tests and the complete test suite pass without changes to fallback behavior.

## Assumptions

- The hosted Redis URL supplied by the user is valid and intended for this environment.
- The environment variable override remains the preferred production mechanism even though the requested default and examples are updated.
- The supplied credential should be rotated if it has been exposed in a shared repository or chat history.
