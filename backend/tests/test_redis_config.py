from pathlib import Path
from urllib.parse import urlsplit

from app.core.config import Settings


PROJECT_ROOT = Path(__file__).resolve().parents[1]
HOSTED_REDIS_HOST = "matchless-marvellous-topiary-27115.db.redis.io"
HOSTED_REDIS_PORT = 17312
LOCAL_REDIS_URL = "redis://" + "localhost" + ":6379/0"


def test_default_redis_url_targets_hosted_instance_without_printing_password():
    settings = Settings(_env_file=None)
    parsed_url = urlsplit(settings.REDIS_URL)

    assert parsed_url.scheme == "redis"
    assert parsed_url.hostname == HOSTED_REDIS_HOST
    assert parsed_url.port == HOSTED_REDIS_PORT


def test_redis_configuration_references_do_not_use_localhost():
    redis_files = (
        PROJECT_ROOT / "app/core/config.py",
        PROJECT_ROOT / ".env",
        PROJECT_ROOT / ".env.example",
        PROJECT_ROOT / "techstack.md",
        PROJECT_ROOT / "specs/001-backend/quickstart.md",
    )

    for redis_file in redis_files:
        assert LOCAL_REDIS_URL not in redis_file.read_text()