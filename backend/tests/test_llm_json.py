import asyncio

import pytest

from app.services.llm_service import LLMService


class FakeResponse:
    def __init__(self, output_text):
        self.output_text = output_text


class FakeResponses:
    output_text = ""

    def create(self, **kwargs):
        return FakeResponse(self.output_text)


class FakeOpenAI:
    def __init__(self, **kwargs):
        self.responses = FakeResponses()


def make_service(monkeypatch, output_text):
    monkeypatch.setattr("app.services.llm_service.OpenAI", FakeOpenAI)
    service = LLMService()
    service.client.responses.output_text = output_text
    return service


def test_plain_and_fenced_json(monkeypatch):
    service = make_service(monkeypatch, '{"value": 1}')
    assert asyncio.run(service.call_llm("prompt")) == {"value": 1}

    service = make_service(monkeypatch, '```json\n{"value": 2}\n```')
    assert asyncio.run(service.call_llm("prompt")) == {"value": 2}


def test_malformed_json_is_rejected(monkeypatch):
    service = make_service(monkeypatch, "not json")
    with pytest.raises(ValueError):
        asyncio.run(service.call_llm("prompt"))


def test_plain_text_contract(monkeypatch):
    service = make_service(monkeypatch, "plain response")
    assert asyncio.run(service.call_llm("prompt", expect_json=False)) == "plain response"
