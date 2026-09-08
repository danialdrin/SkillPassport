# Configuration Contract: MongoDB Atlas

## `MONGO_URI`

The application reads `MONGO_URI` through `app.core.config.Settings`.

### Default

The default is the supplied MongoDB Atlas SRV URI. The credential-bearing value is kept out of this contract text; implementation uses the exact URI provided by the user.

### Precedence

A process environment variable or `.env` value overrides the code default.

### Runtime Client

`app.db.mongo` constructs one `AsyncIOMotorClient` using the resolved URI and `ServerApi("1")`. Existing database and collection helper functions continue to return Motor objects for `MONGO_DB_NAME`.

### Connectivity Verification

The database layer exposes an async verification path that awaits:

```python
await client.admin.command("ping")
```

Failures are propagated with safe diagnostics; the URI password is never logged or returned.
