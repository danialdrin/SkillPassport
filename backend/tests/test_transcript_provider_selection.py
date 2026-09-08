from pathlib import Path

import pytest

from app.core.config import settings
from app.services.mock_transcript_provider import MockTranscriptProvider
from app.services.transcript_service import TranscriptService, transcript_service


@pytest.fixture
def mock_settings(monkeypatch):
    monkeypatch.setattr(settings, "USE_MOCK_TRANSCRIPTIONS", True)
    monkeypatch.setattr(settings, "APP_ENV", "test")


def test_explicit_mock_mode_loads_fixture(mock_settings):
    full_text, segments, available = transcript_service.get_transcript("mock_vid_normal")

    assert available is True
    assert len(full_text) > 100
    assert len(segments) >= 10
    assert segments[0]["start"] == 0.0
    assert segments[0]["duration"] > 0


def test_mock_mode_disabled_does_not_select_fixture(monkeypatch):
    monkeypatch.setattr(settings, "USE_MOCK_TRANSCRIPTIONS", False)
    monkeypatch.setattr(settings, "APP_ENV", "test")

    service = TranscriptService()
    monkeypatch.setattr(
        service,
        "_fetch_real_transcript",
        lambda video_id: ("", [], False),
    )

    assert service.get_transcript("mock_vid_normal") == ("", [], False)


def test_unknown_fixture_returns_deterministic_error(mock_settings):
    provider = MockTranscriptProvider()

    with pytest.raises(Exception, match="MOCK_TRANSCRIPT_NOT_FOUND"):
        provider.load("mock_vid_unknown")


def test_production_does_not_use_mock_fixture(monkeypatch):
    monkeypatch.setattr(settings, "USE_MOCK_TRANSCRIPTIONS", True)
    monkeypatch.setattr(settings, "APP_ENV", "production")

    service = TranscriptService()
    monkeypatch.setattr(
        service,
        "_fetch_real_transcript",
        lambda video_id: ("", [], False),
    )

    assert service.get_transcript("mock_vid_normal") == ("", [], False)
