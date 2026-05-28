"""
expense_schema.py — Pydantic schemas for Expense endpoints
"""

from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ExpenseCreate(BaseModel):
    title: str
    amount: float
    currency: str = "USD"
    category: Optional[str] = None
    trip_id: int


class ExpenseUpdate(BaseModel):
    title: Optional[str] = None
    amount: Optional[float] = None
    currency: Optional[str] = None
    category: Optional[str] = None


class ExpenseResponse(BaseModel):
    id: int
    title: str
    amount: float
    currency: str
    category: Optional[str] = None
    trip_id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
