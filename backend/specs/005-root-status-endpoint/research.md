# Research: Root Service Status Endpoint

## Decision: Add a direct FastAPI root route

- **Decision**: Register `GET /` beside the existing `/health` route in `app/main.py` and return a JSON object with a `message` field containing `AI-Powered Student Skill Intelligence Platform Backend`.
- **Rationale**: `app/main.py` constructs the FastAPI instance and is the smallest owning surface for a route that must be available as soon as the application is serving requests. A direct response avoids database, cache, authentication, and provider dependencies.
- **Alternatives considered**: Reusing `/health` was rejected because the user explicitly requires `/health` to remain unchanged. A redirect to `/health` was rejected because it would preserve the 404 user experience indirectly and would couple startup identity to dependency health semantics. A plain-text response was rejected in favor of the existing API's JSON response style.

## Decision: Preserve the existing health contract

- **Decision**: Do not modify the `/health` handler or its response fields.
- **Rationale**: `/health` is already used for dependency-aware diagnostics and changing it would create an unrelated compatibility risk.
- **Alternatives considered**: Combining service identity and health information into one response was rejected because it changes the established endpoint contract.

## Decision: Validate with a focused API test

- **Decision**: Add a pytest test that requests `/` and verifies status and exact message, plus a regression assertion for `/health`.
- **Rationale**: The route contract is small and behavior is best proven through the application boundary rather than only checking function output.
- **Alternatives considered**: Manual curl-only validation was rejected as insufficient regression protection.
