"""
activity.py — Activity ORM Model

Represents a scheduled activity at a particular stop.
"""

from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.database import Base


class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    category = Column(String(100), nullable=True)  # e.g. sightseeing, food, adventure
    scheduled_at = Column(DateTime(timezone=True), nullable=True)
    duration_minutes = Column(Integer, nullable=True)
    estimated_cost = Column(Float, nullable=True, default=0.0)
    notes = Column(String(500), nullable=True)
    stop_id = Column(Integer, ForeignKey("stops.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    stop = relationship("Stop", back_populates="activities")
