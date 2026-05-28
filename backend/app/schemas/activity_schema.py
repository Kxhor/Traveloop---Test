"""
activity_schema.py — Pydantic schemas for Activity endpoints
"""

from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ActivityCreate(BaseModel):
    """Schema for creating an activity at a stop."""
    name: str
    category: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    estimated_cost: Optional[float] = 0.0
    notes: Optional[str] = None
    stop_id: int


class ActivityUpdate(BaseModel):
    """Schema for updating an activity."""
    name: Optional[str] = None
    category: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    estimated_cost: Optional[float] = None
    notes: Optional[str] = None


class ActivityResponse(BaseModel):
    """Schema returned for activity data."""
    id: int
    name: str
    category: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    estimated_cost: Optional[float] = None
    notes: Optional[str] = None
    stop_id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
