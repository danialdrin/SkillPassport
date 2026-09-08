import pytest
from app.services.medium_analysis_service import medium_analysis_service

def test_medium_analysis_scoring():
    query = "React Hooks useState useEffect"
    title = "React Hooks Masterclass: useState and useEffect Explained"
    description = "0:00 Intro 1:30 useState example 5:00 useEffect cleanup"
    transcript = "In this tutorial we learn about React Hooks. For example, useState allows functional components to hold state. useEffect handles cleanup functions when unmounting."
    segments = [
        {"text": "In this tutorial we learn about React Hooks.", "start": 0.0, "duration": 5.0},
        {"text": "For example, useState allows functional components to hold state.", "start": 5.0, "duration": 5.0},
        {"text": "useEffect handles cleanup functions when unmounting.", "start": 10.0, "duration": 5.0}
    ]

    scores = medium_analysis_service.compute_scores(
        query=query,
        title=title,
        description=description,
        transcript_text=transcript,
        segments=segments,
        transcript_available=True
    )

    assert scores.overall >= 0.0 and scores.overall <= 100.0
    assert scores.relevance >= 0.0 and scores.relevance <= 1.0
    assert scores.topic_coverage >= 0.0 and scores.topic_coverage <= 1.0
    assert scores.depth >= 0.0 and scores.depth <= 1.0
    assert scores.examples >= 0.0 and scores.examples <= 1.0
    assert scores.clarity >= 0.0 and scores.clarity <= 1.0
    assert scores.structure >= 0.0 and scores.structure <= 1.0
    assert scores.redundancy >= 0.0 and scores.redundancy <= 1.0
    assert scores.transcript_available is True
