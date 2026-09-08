from app.core.config import Settings, settings


def test_groq_defaults_and_youtube_setting_are_independent():
    assert settings.GROQ_MODEL == "openai/gpt-oss-20b"
    assert Settings().GROQ_BASE_URL == "https://api.groq.com/openai/v1"
    assert hasattr(Settings(), "YOUTUBE_API_KEY")


def test_blank_groq_values_are_rejected():
    try:
        Settings(GROQ_MODEL=" ")
    except ValueError:
        return
    raise AssertionError("blank Groq model should fail validation")
