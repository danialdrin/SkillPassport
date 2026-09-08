# Data Model: MongoDB Atlas Connection

## `MONGO_URI`

| Property | Value                                                               |
| -------- | ------------------------------------------------------------------- |
| Name     | `MONGO_URI`                                                         |
| Type     | MongoDB connection URI string                                       |
| Default  | The supplied MongoDB Atlas SRV URI                                  |
| Override | `.env` or process environment variable via Pydantic Settings        |
| Consumer | `AsyncIOMotorClient(settings.MONGO_URI, server_api=ServerApi("1"))` |
| Database | `MONGO_DB_NAME`, default `skill_intelligence`                       |

## Client Lifecycle

1. Create one async Motor client lazily.
2. Configure MongoDB Server API version 1.
3. Verify connectivity with an awaited admin `ping` command.
4. Reuse the client for database and collection helpers.
5. Close the client during application shutdown.

## Validation Rules

- The URI must target the Atlas cluster, not `localhost:27017`.
- The URI must be passed to Motor unchanged after settings resolution.
- The password must not appear in logs, responses, or test output.
- Failed connectivity must surface a clear exception to the caller of the verification path.
- Existing `get_database()` and `get_collection(name)` interfaces remain valid.
