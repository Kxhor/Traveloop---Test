"""
trip_schema.py — Pydantic schemas for Trip endpoints
"""

from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional


class TripCreate(BaseModel):
    """Schema for creating a new trip."""
    title: str
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    total_budget: Optional[float] = 0.0


class TripUpdate(BaseModel):
    """Schema for updating an existing trip."""
    title: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    total_budget: Optional[float] = None


class TripResponse(BaseModel):
    """Schema returned for trip data."""
    id: int
    title: str
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    total_budget: Optional[float] = None
    owner_id: Optional[int] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
