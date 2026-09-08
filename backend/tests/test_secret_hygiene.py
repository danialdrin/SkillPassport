from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def test_llm_source_contains_only_groq_configuration():
    source = (ROOT / "app/services/llm_service.py").read_text()
    assert "GEMINI" not in source
    assert "GROK" not in source
    assert "OMNIROUTE" not in source
    assert "chat/completions" not in source
    assert "responses.create" in source


def test_environment_example_contains_placeholders_not_credentials():
    example = (ROOT / ".env.example").read_text()
    assert "GROQ_API_KEY=replace-with-your-groq-key" in example
    assert "YOUTUBE_API_KEY" not in example
    assert "gsk_" not in example
    assert "AIza" not in example
    assert "xai-" not in example
