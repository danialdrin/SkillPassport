import pytest
from pydantic import ValidationError

from app.models.transcription import MockTranscriptFixture


def valid_fixture(**overrides):
    value = {
        "video_id": "mock_vid_validation",
        "language": "en",
        "duration": 20.0,
        "full_text": "First. Second.",
        "segments": [
            {"id": 1, "start": 0.0, "end": 5.0, "text": "First."},
            {"id": 2, "start": 5.0, "end": 10.0, "text": "Second."},
        ],
        "status": "complete",
    }
    value.update(overrides)
    return value


def test_overlapping_segments_are_rejected():
    with pytest.raises(ValidationError, match="ordered and must not overlap"):
        MockTranscriptFixture.model_validate(valid_fixture(
            segments=[
                {"id": 1, "start": 0.0, "end": 6.0, "text": "First."},
                {"id": 2, "start": 5.0, "end": 10.0, "text": "Second."},
            ]
        ))


def test_duplicate_segment_ids_are_rejected():
    with pytest.raises(ValidationError, match="unique"):
        MockTranscriptFixture.model_validate(valid_fixture(
            segments=[
                {"id": 1, "start": 0.0, "end": 5.0, "text": "First."},
                {"id": 1, "start": 5.0, "end": 10.0, "text": "Second."},
            ]
        ))


def test_segment_beyond_duration_is_rejected():
    with pytest.raises(ValidationError, match="duration"):
        MockTranscriptFixture.model_validate(valid_fixture(
            segments=[{"id": 1, "start": 0.0, "end": 21.0, "text": "Too long."}]
        ))


def test_error_fixture_requires_error_metadata():
    with pytest.raises(ValidationError, match="error object"):
        MockTranscriptFixture.model_validate(valid_fixture(
            full_text="",
            segments=[],
            status="error",
        ))


def test_empty_fixture_rejects_content():
    with pytest.raises(ValidationError, match="empty fixtures"):
        MockTranscriptFixture.model_validate(valid_fixture(status="empty"))
