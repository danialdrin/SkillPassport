# Configuration Contract: Redis

## `REDIS_URL`

The application reads `REDIS_URL` through `app.core.config.Settings`.

### Default

The default is the user-provided hosted Redis connection URL:

```text
redis://default:<password>@matchless-marvellous-topiary-27115.db.redis.io:17312
```

The actual password is supplied through the project configuration change and must not be printed in logs or test output.

### Precedence

A process environment variable or `.env` value overrides the code default.

### Runtime Behavior

`app.db.redis_client.ResilientRedis` passes the resolved setting to `redis.asyncio.Redis.from_url`. It retains its current connection timeout, lazy ping, in-memory fakeredis fallback, and close behavior.
