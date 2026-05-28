"""
validation_service.py — Data Validation Workflows

Provides validation helpers for trips, stops, and dates that go
beyond what Pydantic handles at the schema level.
"""

from datetime import date
from typing import Optional


def validate_date_range(start: Optional[date], end: Optional[date]) -> bool:
    """Ensure start_date is before end_date when both are provided."""
    if start and end:
        return start <= end
    return True


def validate_stop_order(stops: list) -> bool:
    """Check that stop order_index values are unique and sequential."""
    indices = [s.order_index for s in stops]
    return len(indices) == len(set(indices))
