from pathlib import Path

from app.services.mock_transcript_provider import MockTranscriptProvider


FIXTURE_DIR = Path(__file__).parents[1] / "mock_data" / "transcriptions"


def test_repeated_fixture_reads_are_deterministic():
    provider = MockTranscriptProvider(FIXTURE_DIR)

    first = provider.load("mock_vid_normal").model_dump(mode="json")
    second = provider.load("mock_vid_normal").model_dump(mode="json")

    assert first == second


def test_fixture_identity_matches_filename():
    provider = MockTranscriptProvider(FIXTURE_DIR)

    for fixture_path in FIXTURE_DIR.glob("mock_vid_*.json"):
        fixture = provider.load(fixture_path.stem)
        assert fixture.video_id == fixture_path.stem
