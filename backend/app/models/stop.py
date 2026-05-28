"""
stop.py — Stop ORM Model

Represents one city/stop within a multi-city trip.
"""

from sqlalchemy import Column, Integer, String, Date, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.database import Base


class Stop(Base):
    __tablename__ = "stops"

    id = Column(Integer, primary_key=True, index=True)
    city = Column(String(200), nullable=False)
    country = Column(String(100), nullable=True)
    arrival_date = Column(Date, nullable=True)
    departure_date = Column(Date, nullable=True)
    order_index = Column(Integer, nullable=False, default=0)  # sequence within the trip
    trip_id = Column(Integer, ForeignKey("trips.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    trip = relationship("Trip", back_populates="stops")
    activities = relationship("Activity", back_populates="stop", cascade="all, delete-orphan")
