import asyncio

import pytest

from app.core.config import settings
from app.services.llm_service import LLMService


class FakeResponse:
    def __init__(self, output_text):
        self.output_text = output_text


class FakeResponses:
    def __init__(self, output_text='{"ok": true}', error=None):
        self.calls = []
        self.output_text = output_text
        self.error = error

    def create(self, **kwargs):
        self.calls.append(kwargs)
        if self.error:
            raise self.error
        return FakeResponse(self.output_text)


class FakeOpenAI:
    instances = []

    def __init__(self, **kwargs):
        self.init_kwargs = kwargs
        self.responses = FakeResponses()
        self.__class__.instances.append(self)


def make_service(monkeypatch, *, output_text='{"ok": true}', error=None):
    monkeypatch.setattr(settings, "GROQ_API_KEY", "test-key")
    monkeypatch.setattr(settings, "GROQ_MODEL", "openai/gpt-oss-20b")
    monkeypatch.setattr(settings, "GROQ_BASE_URL", "https://api.groq.test/v1")
    monkeypatch.setattr("app.services.llm_service.OpenAI", FakeOpenAI)
    FakeOpenAI.instances = []
    service = LLMService()
    service.client.responses.output_text = output_text
    service.client.responses.error = error
    return service


def test_call_llm_uses_groq_responses_api_once(monkeypatch):
    service = make_service(monkeypatch)

    result = asyncio.run(service.call_llm("explain black holes", expect_json=True))

    assert result == {"ok": True}
    assert FakeOpenAI.instances[0].init_kwargs == {
        "api_key": "test-key",
        "base_url": "https://api.groq.test/v1",
    }
    assert len(service.client.responses.calls) == 1
    request = service.client.responses.calls[0]
    assert request["model"] == "openai/gpt-oss-20b"
    assert request["input"][-1] == {"role": "user", "content": "explain black holes"}


def test_call_llm_preserves_system_and_text_output(monkeypatch):
    service = make_service(monkeypatch, output_text="A black hole is a very dense object.")

    result = asyncio.run(
        service.call_llm(
            "explain black holes",
            system_prompt="Use simple words.",
            expect_json=False,
        )
    )

    assert result == "A black hole is a very dense object."
    assert service.client.responses.calls[0]["input"][0] == {
        "role": "system",
        "content": "Use simple words.",
    }


def test_call_llm_parses_fenced_json(monkeypatch):
    service = make_service(monkeypatch, output_text='```json\n{"answer": 42}\n```')

    assert asyncio.run(service.call_llm("prompt", expect_json=True)) == {"answer": 42}


def test_call_llm_rejects_empty_output(monkeypatch):
    service = make_service(monkeypatch, output_text="  ")

    with pytest.raises(ValueError, match="empty output"):
        asyncio.run(service.call_llm("prompt", expect_json=True))


def test_call_llm_propagates_groq_errors(monkeypatch):
    service = make_service(monkeypatch, error=RuntimeError("provider unavailable"))

    with pytest.raises(RuntimeError, match="provider unavailable"):
        asyncio.run(service.call_llm("prompt", expect_json=True))


def test_call_llm_requires_groq_key(monkeypatch):
    monkeypatch.setattr(settings, "GROQ_API_KEY", "")
    service = make_service(monkeypatch)
    monkeypatch.setattr(settings, "GROQ_API_KEY", "")

    with pytest.raises(ValueError, match="GROQ_API_KEY"):
        asyncio.run(service.call_llm("prompt"))
