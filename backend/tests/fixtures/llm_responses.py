class FakeResponsesResult:
    def __init__(self, output_text):
        self.output_text = output_text


def json_response():
    return FakeResponsesResult('{"ok": true}')


def fenced_json_response():
    return FakeResponsesResult('```json\n{"ok": true}\n```')


def empty_response():
    return FakeResponsesResult(" ")
