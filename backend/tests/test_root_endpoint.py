from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_root_returns_service_identity():
    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {
        "message": "AI-Powered Student Skill Intelligence Platform Backend"
    }


def test_health_contract_is_preserved():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "healthy",
        "service": "AI-Powered Student Skill Intelligence Platform Backend",
        "version": "1.0.0",
    }