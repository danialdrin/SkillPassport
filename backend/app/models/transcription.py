from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator


TranscriptStatus = Literal["complete", "empty", "partial", "error"]


class TranscriptSegment(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: int = Field(gt=0)
    start: float = Field(ge=0)
    end: float = Field(gt=0)
    text: str
    speaker: str | None = None

    @model_validator(mode="after")
    def validate_segment(self) -> "TranscriptSegment":
        if self.end <= self.start:
            raise ValueError("segment end must be greater than start")
        if not self.text.strip():
            raise ValueError("segment text must not be empty")
        if self.speaker is not None and not self.speaker.strip():
            raise ValueError("speaker must not be empty when provided")
        return self


class MockTranscriptError(BaseModel):
    model_config = ConfigDict(extra="forbid")

    code: str = Field(min_length=1)
    message: str = Field(min_length=1)
    retryable: bool


class MockTranscriptFixture(BaseModel):
    model_config = ConfigDict(extra="forbid")

    video_id: str = Field(min_length=1)
    language: str = Field(min_length=1)
    duration: float = Field(ge=0)
    full_text: str
    segments: list[TranscriptSegment]
    status: TranscriptStatus
    error: MockTranscriptError | None = None

    @model_validator(mode="after")
    def validate_fixture(self) -> "MockTranscriptFixture":
        if self.status == "error":
            if self.error is None:
                raise ValueError("error fixtures require an error object")
            return self

        if self.error is not None:
            raise ValueError("only error fixtures may contain an error object")

        seen_ids: set[int] = set()
        previous_end = 0.0
        for segment in self.segments:
            if segment.id in seen_ids:
                raise ValueError("segment IDs must be unique")
            seen_ids.add(segment.id)
            if segment.end > self.duration:
                raise ValueError("segment end must not exceed fixture duration")
            if segment.start < previous_end:
                raise ValueError("segments must be ordered and must not overlap")
            previous_end = segment.end

        if self.status == "empty":
            if self.full_text.strip() or self.segments:
                raise ValueError("empty fixtures must have empty text and no segments")
        elif not self.full_text.strip() and not self.segments:
            raise ValueError("non-empty fixtures require transcript content")

        return self

    def to_legacy_segments(self) -> list[dict[str, object]]:
        normalized: list[dict[str, object]] = []
        for segment in self.segments:
            item: dict[str, object] = {
                "id": segment.id,
                "text": segment.text,
                "start": segment.start,
                "duration": segment.end - segment.start,
            }
            if segment.speaker is not None:
                item["speaker"] = segment.speaker
            normalized.append(item)
        return normalized
