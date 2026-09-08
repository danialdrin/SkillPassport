from pathlib import Path

from app.services.transcript_service import TranscriptService


FIXTURE_DIR = Path(__file__).parents[1] / "mock_data" / "transcriptions"


def test_mock_result_keeps_existing_analysis_input_shape(monkeypatch):
    monkeypatch.setattr("app.core.config.settings.USE_MOCK_TRANSCRIPTIONS", True)
    monkeypatch.setattr("app.core.config.settings.APP_ENV", "test")

    full_text, segments, available = TranscriptService().get_transcript("mock_vid_normal")

    assert full_text
    assert available is True
    assert {"text", "start", "duration"}.issubset(segments[0])


def test_mock_fixture_is_not_selected_in_production(monkeypatch):
    monkeypatch.setattr("app.core.config.settings.USE_MOCK_TRANSCRIPTIONS", True)
    monkeypatch.setattr("app.core.config.settings.APP_ENV", "production")

    service = TranscriptService()
    monkeypatch.setattr(service, "_fetch_real_transcript", lambda _: ("", [], False))

    assert service.get_transcript("mock_vid_normal") == ("", [], False)


def test_fixture_directory_is_not_a_production_persistence_target():
    assert "mock_data" in str(FIXTURE_DIR)
    assert "app/db" not in str(FIXTURE_DIR)
