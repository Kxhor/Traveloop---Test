"""
stop_schema.py — Pydantic schemas for Stop endpoints
"""

from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional


class StopCreate(BaseModel):
    """Schema for adding a stop to a trip."""
    city: str
    country: Optional[str] = None
    arrival_date: Optional[date] = None
    departure_date: Optional[date] = None
    order_index: int = 0
    trip_id: int


class StopUpdate(BaseModel):
    """Schema for updating a stop."""
    city: Optional[str] = None
    country: Optional[str] = None
    arrival_date: Optional[date] = None
    departure_date: Optional[date] = None
    order_index: Optional[int] = None


class StopResponse(BaseModel):
    """Schema returned for stop data."""
    id: int
    city: str
    country: Optional[str] = None
    arrival_date: Optional[date] = None
    departure_date: Optional[date] = None
    order_index: int
    trip_id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
