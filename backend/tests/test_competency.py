import pytest
from app.services.competency_service import calculate_ema_score

def test_initial_competency_score():
    # First event sets baseline score (raw_score * 100)
    score = calculate_ema_score(old_score=None, raw_score=0.8, alpha=0.4)
    assert score == 80.0

def test_ema_score_update():
    # Prior score 80.0, new raw_score 1.0 (100.0)
    # EMA: 0.4 * 100.0 + 0.6 * 80.0 = 40.0 + 48.0 = 88.0
    score = calculate_ema_score(old_score=80.0, raw_score=1.0, alpha=0.4)
    assert score == 88.0

def test_ema_score_decrease_on_poor_attempt():
    # Prior score 88.0, new raw_score 0.2 (20.0)
    # EMA: 0.4 * 20.0 + 0.6 * 88.0 = 8.0 + 52.8 = 60.8
    score = calculate_ema_score(old_score=88.0, raw_score=0.2, alpha=0.4)
    assert score == 60.8
