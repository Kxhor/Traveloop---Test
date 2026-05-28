"""
route_service.py — Route / Itinerary Optimization

Placeholder for multi-city route ordering and travel-time estimation.
"""

from typing import List


def optimize_stop_order(stops: list) -> list:
    """
    Re-order stops for an optimal travel route.

    TODO: plug in distance-matrix API or TSP heuristic.
    Currently returns stops sorted by their existing order_index.
    """
    return sorted(stops, key=lambda s: s.order_index)


def estimate_travel_time(origin: str, destination: str) -> int:
    """
    Estimate travel time between two cities in minutes.

    TODO: integrate a real mapping/travel API.
    """
    return 0  # placeholder
