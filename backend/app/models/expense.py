"""
expense.py — Expense ORM Model

Tracks individual expenses associated with a trip for budget management.
"""

from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.sql import func

from app.database.database import Base


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String(10), nullable=False, default="USD")
    category = Column(String(100), nullable=True)  # e.g. transport, food, lodging
    trip_id = Column(Integer, ForeignKey("trips.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    from sqlalchemy.orm import relationship
    trip = relationship("Trip", back_populates="expenses")
