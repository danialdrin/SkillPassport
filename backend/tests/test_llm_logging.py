import asyncio
import logging

from app.services.llm_service import LLMService


class FakeResponses:
    def create(self, **kwargs):
        return type("Response", (), {"output_text": '{"secret": [1,], "items": []}'})()


class FakeOpenAI:
    def __init__(self, **kwargs):
        self.responses = FakeResponses()


def make_service(monkeypatch):
    monkeypatch.setattr("app.services.llm_service.OpenAI", FakeOpenAI)
    return LLMService()


def test_json_failure_log_contains_location_without_secret(monkeypatch, caplog):
    service = make_service(monkeypatch)

    with caplog.at_level(logging.ERROR):
        try:
            asyncio.run(service.call_llm("prompt"))
        except ValueError:
            pass

    message = " ".join(record.getMessage() for record in caplog.records)
    assert "JSON parsing failure" in message
    assert "line=" in message
    assert "column=" in message
    assert "position=" in message
    assert "secret" not in message
