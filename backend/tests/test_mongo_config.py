import asyncio
from pathlib import Path
from urllib.parse import urlsplit

from app.core.config import Settings


PROJECT_ROOT = Path(__file__).resolve().parents[1]
ATLAS_HOST = "cluster0.d84ctwd.mongodb.net"
LOCAL_MONGO_URI = "mongodb://" + "localhost" + ":27017"


def test_default_mongo_uri_targets_atlas_without_printing_credentials():
    settings = Settings(_env_file=None)
    parsed_uri = urlsplit(settings.MONGO_URI)

    assert parsed_uri.scheme == "mongodb+srv"
    assert parsed_uri.hostname == ATLAS_HOST


def test_mongo_configuration_references_do_not_use_localhost():
    mongo_files = (
        PROJECT_ROOT / "app/core/config.py",
        PROJECT_ROOT / ".env",
        PROJECT_ROOT / ".env.example",
        PROJECT_ROOT / "techstack.md",
        PROJECT_ROOT / "specs/001-backend/quickstart.md",
    )

    for mongo_file in mongo_files:
        assert LOCAL_MONGO_URI not in mongo_file.read_text()


def test_mongo_client_uses_server_api_and_async_ping(monkeypatch):
    import app.db.mongo as mongo

    captured = {}

    class FakeAdmin:
        async def command(self, name):
            captured["command"] = name
            return {"ok": 1}

    class FakeClient:
        def __init__(self, uri, **kwargs):
            captured["uri"] = uri
            captured["kwargs"] = kwargs
            self.admin = FakeAdmin()

        def close(self):
            captured["closed"] = True

    monkeypatch.setattr(mongo, "AsyncIOMotorClient", FakeClient)
    mongo._client = None

    client = mongo.get_mongo_client()
    result = asyncio.run(mongo.verify_mongo_connection())

    assert result == {"ok": 1}
    assert urlsplit(captured["uri"]).hostname == ATLAS_HOST
    assert captured["kwargs"]["server_api"].version == "1"
    assert captured["command"] == "ping"

    asyncio.run(mongo.close_mongo_connection())
    assert captured["closed"] is True