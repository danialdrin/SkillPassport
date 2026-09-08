import json
from pathlib import Path

import pytest

from app.services.mock_transcript_provider import MockTranscriptProvider
from app.services.transcript_service import TranscriptService


FIXTURE_DIR = Path(__file__).parents[1] / "mock_data" / "transcriptions"
provider = MockTranscriptProvider(FIXTURE_DIR)


@pytest.mark.parametrize(
    ("video_id", "status"),
    [
        ("mock_vid_multispeaker", "complete"),
        ("mock_vid_empty", "empty"),
        ("mock_vid_partial", "partial"),
        ("mock_vid_error", "error"),
    ],
)
def test_required_fixture_states(video_id, status):
    fixture = provider.load(video_id)
    assert fixture.status == status


def test_multi_speaker_fixture_preserves_multiple_labels():
    fixture = provider.load("mock_vid_multispeaker")
    speakers = {segment.speaker for segment in fixture.segments}

    assert speakers >= {"Instructor", "Student"}


def test_empty_fixture_is_not_loading_or_error():
    fixture = provider.load("mock_vid_empty")

    assert fixture.status == "empty"
    assert fixture.full_text == ""
    assert fixture.segments == []
    assert fixture.error is None


def test_partial_fixture_is_not_presented_as_complete():
    fixture = provider.load("mock_vid_partial")

    assert fixture.status == "partial"
    assert fixture.segments
    assert fixture.status != "complete"


def test_error_fixture_has_stable_retryable_error():
    fixture = provider.load("mock_vid_error")

    assert fixture.error is not None
    assert fixture.error.code == "MOCK_TRANSCRIPT_FAILURE"
    assert fixture.error.retryable is True


def test_error_fixture_maps_to_unavailable_legacy_tuple(monkeypatch):
    monkeypatch.setattr("app.core.config.settings.USE_MOCK_TRANSCRIPTIONS", True)
    monkeypatch.setattr("app.core.config.settings.APP_ENV", "test")

    assert TranscriptService().get_transcript("mock_vid_error") == ("", [], False)
