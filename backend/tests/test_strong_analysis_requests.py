import asyncio
from bson import ObjectId

from app.services import strong_analysis_service as module


class FakeCollection:
    def __init__(self, documents=None):
        self.documents = documents or []
        self.updates = []

    async def update_one(self, query, update):
        self.updates.append((query, update))

    async def find_one(self, query):
        return self.documents[0] if self.documents else None

    async def insert_one(self, document):
        result = type("InsertResult", (), {})()
        result.inserted_id = ObjectId()
        self.documents.append(document)
        return result


class FakeLLM:
    def __init__(self, responses=None):
        self.calls = []
        self.responses = responses or [valid_analysis()]

    async def call_llm(self, prompt, expect_json=True):
        self.calls.append((prompt, expect_json))
        response = self.responses[min(len(self.calls) - 1, len(self.responses) - 1)]
        if isinstance(response, Exception):
            raise response
        return response


class FakeKG:
    def __init__(self):
        self.calls = []

    async def build_material_kg(self, **kwargs):
        self.calls.append(kwargs)


def valid_analysis():
    return {
        "topics": [{
            "topic": "Mock topic based on insufficient source context",
            "subtopics": ["Illustrative subtopic"],
            "skills": ["Critical reading"],
            "learning_outcomes": ["Identify the main idea"],
        }],
        "concepts": [{
            "name": "Mock concept",
            "definition": "An illustrative concept used when source detail is insufficient.",
            "examples": ["Illustrative example"],
        }],
        "relationships": [{
            "from": "Mock concept",
            "to": "Mock topic based on insufficient source context",
            "relation": "part_of",
        }],
        "important_sections": [{
            "title": "Mock section",
            "why_important": "Illustrative guidance because source context is insufficient.",
        }],
    }


def test_strong_analysis_makes_one_llm_request_for_long_resource(monkeypatch):
    resource_id = ObjectId()
    job_id = ObjectId()
    collections = {
        "jobs": FakeCollection(),
        "resources": FakeCollection([{
            "_id": resource_id,
            "source_type": "pdf",
            "raw_text": "learning content " * 5000,
            "title": "Long resource",
        }]),
        "analyses": FakeCollection(),
    }
    llm = FakeLLM()
    kg = FakeKG()

    monkeypatch.setattr(module, "get_collection", lambda name: collections[name])
    monkeypatch.setattr(module, "llm_service", llm)
    monkeypatch.setattr(module, "kg_service", kg)

    asyncio.run(module.StrongAnalysisService().run_analysis_task(str(job_id), str(resource_id)))

    assert len(llm.calls) == 1
    assert len(kg.calls) == 1
    assert collections["jobs"].updates[-1][1]["$set"]["status"] == "done"


def make_analysis_context(monkeypatch, llm):
    resource_id = ObjectId()
    job_id = ObjectId()
    collections = {
        "jobs": FakeCollection(),
        "resources": FakeCollection([{
            "_id": resource_id,
            "source_type": "pdf",
            "raw_text": "content",
            "title": "Resource",
        }]),
        "analyses": FakeCollection(),
    }
    kg = FakeKG()
    monkeypatch.setattr(module, "get_collection", lambda name: collections[name])
    monkeypatch.setattr(module, "llm_service", llm)
    monkeypatch.setattr(module, "kg_service", kg)
    return resource_id, job_id, collections, kg


def test_strong_analysis_retries_once_after_malformed_response(monkeypatch):
    valid = valid_analysis()
    llm = FakeLLM([ValueError("malformed JSON"), valid])
    resource_id, job_id, collections, kg = make_analysis_context(monkeypatch, llm)

    asyncio.run(module.StrongAnalysisService().run_analysis_task(str(job_id), str(resource_id)))

    assert len(llm.calls) == 2
    assert "corrected JSON" in llm.calls[1][0]
    assert len(collections["analyses"].documents) == 1
    assert len(kg.calls) == 1
    assert collections["jobs"].updates[-1][1]["$set"]["status"] == "done"


def test_strong_analysis_does_not_persist_after_retry_failure(monkeypatch):
    llm = FakeLLM([ValueError("bad JSON"), ValueError("still bad JSON")])
    resource_id, job_id, collections, kg = make_analysis_context(monkeypatch, llm)

    asyncio.run(module.StrongAnalysisService().run_analysis_task(str(job_id), str(resource_id)))

    assert len(llm.calls) == 2
    assert len(collections["analyses"].documents) == 0
    assert kg.calls == []
    assert collections["jobs"].updates[-1][1]["$set"]["status"] == "failed"
    assert collections["jobs"].updates[-1][1]["$set"]["error"] == (
        "Strong Analysis could not produce a valid structured result. Please retry."
    )


def test_strong_analysis_retries_missing_top_level_fields(monkeypatch):
    valid = valid_analysis()
    llm = FakeLLM([{"topics": []}, valid])
    resource_id, job_id, collections, kg = make_analysis_context(monkeypatch, llm)

    asyncio.run(module.StrongAnalysisService().run_analysis_task(str(job_id), str(resource_id)))

    assert len(llm.calls) == 2
    assert collections["jobs"].updates[-1][1]["$set"]["status"] == "done"


def test_insufficient_input_instruction_requires_labeled_non_empty_mock_output():
    assert "complete illustrative mock analysis" in module.STRONG_ANALYSIS_PROMPT
    assert "do not return empty arrays" in module.STRONG_ANALYSIS_PROMPT
    assert "clearly labeled mock/illustrative item" in module.JSON_CORRECTION_PROMPT
