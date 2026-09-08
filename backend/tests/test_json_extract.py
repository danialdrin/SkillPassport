import json

import pytest

from app.utils.json_extract import JSONExtractionError, extract_json_from_text


def test_extracts_plain_fenced_and_surrounded_json():
    assert extract_json_from_text('{"ok": true}') == {"ok": True}
    assert extract_json_from_text('```json\n{"ok": true}\n```') == {"ok": True}
    assert extract_json_from_text('Here is the result:\n{"ok": true}\nDone.') == {"ok": True}


def test_malformed_json_preserves_decoder_location_and_safe_excerpt():
    malformed = '{"items": [1, 2,], "secret": "do-not-log"}'

    with pytest.raises(JSONExtractionError) as error:
        extract_json_from_text(malformed)

    assert isinstance(error.value.original_error, json.JSONDecodeError)
    assert error.value.line is not None
    assert error.value.column is not None
    assert error.value.position is not None
    assert "secret" not in error.value.excerpt
    assert error.value.original_error.msg in str(error.value)


def test_rejects_empty_and_non_json_text():
    with pytest.raises(JSONExtractionError):
        extract_json_from_text("")

    with pytest.raises(JSONExtractionError):
        extract_json_from_text("plain text only")


def test_expected_object_rejects_array():
    with pytest.raises(JSONExtractionError, match="JSON object"):
        extract_json_from_text("[1, 2]", expected_type=dict)
