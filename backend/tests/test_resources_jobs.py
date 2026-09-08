import asyncio
from bson import ObjectId

from app.routers import analysis as analysis_router


class FakeJobsCollection:
    def __init__(self, document):
        self.document = document

    async def find_one(self, query):
        assert query["_id"] == self.document["_id"]
        assert query["user_id"] == self.document["user_id"]
        return self.document


def test_failed_job_response_preserves_persisted_job_id(monkeypatch):
    job_id = ObjectId()
    user_id = ObjectId()
    document = {
        "_id": job_id,
        "user_id": user_id,
        "type": "strong_analysis",
        "status": "failed",
        "result": None,
        "error": "Strong Analysis could not produce a valid structured result. Please retry.",
    }
    monkeypatch.setattr(
        analysis_router,
        "get_collection",
        lambda name: FakeJobsCollection(document),
    )

    response = asyncio.run(
        analysis_router.get_job_status(
            str(job_id),
            {"_id": str(user_id)},
        )
    )

    assert response.job_id == str(job_id)
    assert response.status == "failed"
    assert response.error == document["error"]
