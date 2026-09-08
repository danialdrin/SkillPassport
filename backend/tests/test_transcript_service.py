import json
from pathlib import Path

import pytest

from app.models.transcription import MockTranscriptFixture


FIXTURE_DIR = Path(__file__).parents[1] / "mock_data" / "transcriptions"


def test_normal_fixture_has_valid_ordered_segments():
    fixture_data = json.loads((FIXTURE_DIR / "mock_vid_normal.json").read_text())
    fixture = MockTranscriptFixture.model_validate(fixture_data)

    assert fixture.status == "complete"
    assert fixture.full_text
    assert len(fixture.segments) >= 10
    assert fixture.segments == sorted(fixture.segments, key=lambda segment: segment.start)
    assert all(segment.end <= fixture.duration for segment in fixture.segments)


def test_segments_normalize_to_existing_consumer_shape():
    fixture = MockTranscriptFixture.model_validate({
        "video_id": "mock_vid_test",
        "language": "en",
        "duration": 10.0,
        "full_text": "Hello world.",
        "segments": [{"id": 1, "start": 2.0, "end": 5.5, "text": "Hello world."}],
        "status": "complete",
    })

    assert fixture.to_legacy_segments() == [
        {"id": 1, "start": 2.0, "duration": 3.5, "text": "Hello world."}
    ]


@pytest.mark.parametrize("field", ["start", "end", "text"])
def test_invalid_segment_data_is_rejected(field):
    segment = {"id": 1, "start": 0.0, "end": 2.0, "text": "Valid"}
    segment[field] = -1.0 if field != "text" else ""

    with pytest.raises(ValueError):
        MockTranscriptFixture.model_validate({
            "video_id": "mock_vid_invalid",
            "language": "en",
            "duration": 10.0,
            "full_text": "Valid",
            "segments": [segment],
            "status": "complete",
        })
