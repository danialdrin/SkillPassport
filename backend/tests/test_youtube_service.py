import asyncio

import pytest
from fastapi import HTTPException

from app.core.config import settings
from app.services.youtube_service import YouTubeService


def test_missing_youtube_key_returns_marked_development_mocks(monkeypatch):
    monkeypatch.setattr(settings, "YOUTUBE_API_KEY", "")
    monkeypatch.setattr(settings, "APP_ENV", "development")

    result = asyncio.run(YouTubeService().search_videos("python"))

    assert result["candidates"]
    assert all(candidate["is_mock"] is True for candidate in result["candidates"])


def test_missing_youtube_key_fails_outside_development(monkeypatch):
    monkeypatch.setattr(settings, "YOUTUBE_API_KEY", "")
    monkeypatch.setattr(settings, "APP_ENV", "production")

    with pytest.raises(HTTPException) as error:
        asyncio.run(YouTubeService().search_videos("python"))

    assert error.value.status_code == 503


def test_youtube_key_is_independent_from_groq(monkeypatch):
    monkeypatch.setattr(settings, "YOUTUBE_API_KEY", "youtube-test")
    monkeypatch.setattr(settings, "GROQ_API_KEY", "groq-test")
    service = YouTubeService()

    assert service.api_key == "youtube-test"
    assert service.api_key != settings.GROQ_API_KEY
