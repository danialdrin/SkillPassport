from __future__ import annotations

import json
from pathlib import Path

from pydantic import ValidationError

from app.models.transcription import MockTranscriptFixture


class MockTranscriptProviderError(Exception):
    """Raised when a deterministic mock fixture cannot be loaded safely."""

    def __init__(self, code: str, message: str, retryable: bool = False):
        self.code = code
        self.message = message
        self.retryable = retryable
        super().__init__(f"{code}: {message}")


class MockTranscriptProvider:
    def __init__(self, fixture_dir: Path | None = None):
        self.fixture_dir = fixture_dir or (
            Path(__file__).resolve().parents[2] / "mock_data" / "transcriptions"
        )

    def load(self, video_id: str) -> MockTranscriptFixture:
        if not video_id.startswith("mock_vid_"):
            raise MockTranscriptProviderError(
                "MOCK_TRANSCRIPT_NOT_FOUND",
                f"No mock transcription is registered for video ID '{video_id}'.",
            )

        fixture_path = self.fixture_dir / f"{video_id}.json"
        if not fixture_path.is_file():
            raise MockTranscriptProviderError(
                "MOCK_TRANSCRIPT_NOT_FOUND",
                f"No mock transcription fixture exists for video ID '{video_id}'.",
            )

        try:
            data = json.loads(fixture_path.read_text(encoding="utf-8"))
            fixture = MockTranscriptFixture.model_validate(data)
        except (OSError, json.JSONDecodeError, ValidationError, ValueError) as exc:
            raise MockTranscriptProviderError(
                "MOCK_TRANSCRIPT_INVALID",
                f"Mock transcription fixture '{fixture_path.name}' is invalid.",
            ) from exc

        if fixture.video_id != video_id:
            raise MockTranscriptProviderError(
                "MOCK_TRANSCRIPT_INVALID",
                f"Fixture '{fixture_path.name}' does not match requested video ID.",
            )

        return fixture


mock_transcript_provider = MockTranscriptProvider()
