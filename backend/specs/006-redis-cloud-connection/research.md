# Research: Hosted Redis Connection

## Decision: Change the centralized default and tracked setup references

- **Decision**: Replace the localhost Redis URL with the user-provided hosted URL in `Settings.REDIS_URL`, `.env.example`, `techstack.md`, and `specs/001-backend/quickstart.md`.
- **Rationale**: These are the discovered configuration and setup references. Runtime code already consumes `settings.REDIS_URL`, so changing the setting preserves one connection path and avoids duplicating URL logic.
- **Alternatives considered**: Changing only `redis_client.py` was rejected because it would bypass the existing environment override and leave setup files inconsistent. Changing only `.env.example` was rejected because the application default would still target localhost.

## Decision: Preserve resilient fallback behavior

- **Decision**: Do not change `ResilientRedis`, its connection timeout, lazy ping, fakeredis fallback, or close behavior.
- **Rationale**: The request changes the connection destination, not failure handling. Preserving the wrapper limits the change and keeps the application usable when the hosted service is unavailable.
- **Alternatives considered**: Removing the fallback was rejected because it would make cache availability a hard application dependency.

## Decision: Treat the URL as sensitive configuration

- **Decision**: Avoid printing the hosted URL in tests or logs and retain the environment variable override for deployment-specific values.
- **Rationale**: The URL includes a password. Embedding it in defaults and documentation follows the explicit request but creates credential exposure risk.
- **Alternatives considered**: Replacing the requested value with a placeholder everywhere was rejected because it would not satisfy the request to change all localhost references. The credential should be rotated if it is shared beyond the intended environment.
