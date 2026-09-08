# Data Model: Root Service Status Response

## Root Status Response

| Field     | Type   | Required | Description                                                                      |
| --------- | ------ | -------: | -------------------------------------------------------------------------------- |
| `message` | string |      Yes | Exact service identity: `AI-Powered Student Skill Intelligence Platform Backend` |

## Persistence

The response is generated at request time and is not stored in MongoDB, Redis, or any other persistence layer.

## Validation Rules

- `GET /` returns HTTP 200 when the FastAPI application is serving requests.
- `message` must match the exact service identity string.
- The response must not include credentials, dependency state, or user data.
