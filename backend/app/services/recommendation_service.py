"""
recommendation_service.py — Recommendation Scoring

Placeholder for activity/stop recommendation logic.
Could integrate external APIs or ML scoring in the future.
"""

from typing import List, Dict


def score_activities(activities: list) -> List[Dict]:
    """
    Score and rank activities based on heuristics.

    TODO: integrate real scoring logic (popularity, reviews, cost-value).
    """
    scored = []
    for activity in activities:
        score = 0.5  # placeholder neutral score
        scored.append({"activity": activity, "score": score})
    return sorted(scored, key=lambda x: x["score"], reverse=True)
