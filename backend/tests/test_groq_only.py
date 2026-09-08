from pathlib import Path

from app.core.config import settings


ROOT = Path(__file__).resolve().parents[1]


def test_groq_is_the_only_configured_llm_provider():
    assert settings.GROQ_MODEL == "openai/gpt-oss-20b"
    assert not hasattr(settings, "GEMINI_API_KEY")
    assert not hasattr(settings, "GROK_API_KEY")


def test_runtime_source_has_no_removed_llm_provider_imports():
    service_source = (ROOT / "app/services/llm_service.py").read_text()
    assert "google.genai" not in service_source
    assert "chat/completions" not in service_source
    assert "responses.create" in service_source
