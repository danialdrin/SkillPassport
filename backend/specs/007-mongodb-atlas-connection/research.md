# Research: MongoDB Atlas Connection

## Decision: Adapt the sample to Motor, not synchronous PyMongo

- **Decision**: Keep `AsyncIOMotorClient` and pass `server_api=ServerApi("1")` when constructing the singleton client.
- **Rationale**: FastAPI request handlers and the current database module are asynchronous. A synchronous `MongoClient` would block the event loop and create a second incompatible access path. Motor delegates client options to PyMongo and supports the Server API option.
- **Alternatives considered**: Replacing Motor with synchronous `MongoClient` was rejected because it changes the existing async architecture. Adding a separate test-only synchronous client was rejected because it would not verify the runtime path.

## Decision: Verify Atlas with an async ping

- **Decision**: Add an async connection verification helper that awaits `client.admin.command("ping")`; invoke it from an explicit validation path and preserve clean startup/shutdown integration.
- **Rationale**: The provided sample uses the admin ping as a connectivity check. Awaiting the same command through Motor verifies DNS, credentials, TLS, network allowlisting, and server compatibility without blocking.
- **Alternatives considered**: Treating client construction as proof of connectivity was rejected because Motor connects lazily. Writing a document as the health check was rejected because it mutates application data and is not needed to verify connectivity.

## Decision: Keep configuration overridable and credentials out of diagnostics

- **Decision**: Update the default and discovered setup references, while retaining Pydantic Settings environment precedence and sanitizing test/diagnostic output.
- **Rationale**: This satisfies the requested migration without removing deployment-specific configuration. Atlas URIs include credentials and must not be emitted in logs or test output.
- **Alternatives considered**: Hard-coding the URI only in `mongo.py` was rejected because it bypasses environment configuration. Printing the full URI for debugging was rejected because it exposes the password.
