from __future__ import annotations

import logging
from typing import Any, Dict, List, Tuple

from youtube_transcript_api import NoTranscriptFound, TranscriptsDisabled, YouTubeTranscriptApi

from app.core.config import settings
from app.models.transcription import MockTranscriptFixture
from app.services.mock_transcript_provider import MockTranscriptProviderError, mock_transcript_provider

logger = logging.getLogger(__name__)


class TranscriptService:
    @staticmethod
    def _mock_enabled() -> bool:
        return bool(settings.USE_MOCK_TRANSCRIPTIONS) and settings.APP_ENV.lower() in {
            "development",
            "test",
        }

    @staticmethod
    def _fixture_to_result(
        fixture: MockTranscriptFixture,
    ) -> Tuple[str, List[Dict[str, Any]], bool]:
        if fixture.status == "error":
            logger.error(
                "Mock transcription error video_id=%s code=%s message=%s",
                fixture.video_id,
                fixture.error.code if fixture.error else "MOCK_TRANSCRIPT_FAILURE",
                fixture.error.message if fixture.error else "Unknown mock error",
            )
            return "", [], False

        transcript_available = fixture.status in {"complete", "partial"} and bool(
            fixture.full_text.strip() or fixture.segments
        )
        return fixture.full_text, fixture.to_legacy_segments(), transcript_available

    @staticmethod
    def _fetch_real_transcript(video_id: str) -> Tuple[str, List[Dict[str, Any]], bool]:
        try:
            if hasattr(YouTubeTranscriptApi, "get_transcript"):
                transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
            else:
                transcript_list = YouTubeTranscriptApi().fetch(video_id).to_raw_data()
            full_text = " ".join(item["text"] for item in transcript_list)
            return full_text, transcript_list, True
        except (TranscriptsDisabled, NoTranscriptFound) as exc:
            logger.warning("No transcript found for video_id %s: %s", video_id, exc)
            return "", [], False
        except Exception as exc:
            logger.error("Error fetching transcript for video_id %s: %s", video_id, exc)
            return "", [], False

    def get_transcript(self, video_id: str) -> Tuple[str, List[Dict[str, Any]], bool]:
        """Return the existing transcript tuple, optionally backed by mock fixtures."""
        if self._mock_enabled() and video_id.startswith("mock_vid_"):
            try:
                fixture = mock_transcript_provider.load(video_id)
            except MockTranscriptProviderError as exc:
                if exc.code != "MOCK_TRANSCRIPT_NOT_FOUND":
                    logger.error("Unable to load mock transcript: %s", exc)
                    return "", [], False
                try:
                    fixture = mock_transcript_provider.load(settings.MOCK_TRANSCRIPT_FALLBACK_ID)
                except MockTranscriptProviderError as fallback_exc:
                    logger.error("Unable to load mock fallback transcript: %s", fallback_exc)
                    return "", [], False
            return self._fixture_to_result(fixture)

        if video_id.startswith("mock_vid_"):
            logger.warning("Ignoring synthetic mock video ID outside mock mode: %s", video_id)
            return "", [], False

        full_text, segments, available = self._fetch_real_transcript(video_id)
        if available or not self._mock_enabled():
            return full_text, segments, available

        try:
            fallback = mock_transcript_provider.load(settings.MOCK_TRANSCRIPT_FALLBACK_ID)
            logger.info("Using development mock fallback for video_id=%s", video_id)
            return self._fixture_to_result(fallback)
        except MockTranscriptProviderError as exc:
            logger.error("Unable to load configured mock fallback transcript: %s", exc)
            return full_text, segments, available


transcript_service = TranscriptService()
