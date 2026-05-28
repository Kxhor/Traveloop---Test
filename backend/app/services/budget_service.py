"""
budget_service.py — Budget Processing Logic

Handles trip budget calculations, spending summaries,
and budget threshold alerts.
"""
from sqlalchemy.orm import Session

from app.models.trip import Trip
from app.models.expense import Expense
from app.models.stop import Stop
from app.models.activity import Activity

def calculate_total_spent(expenses: list) -> float:
    """Sum all expense amounts for a trip."""
    return sum(e.amount for e in expenses)


def get_budget_remaining(total_budget: float, expenses: list) -> float:
    """Calculate remaining budget after all recorded expenses."""
    return total_budget - calculate_total_spent(expenses)


def get_spending_by_category(expenses: list) -> dict:
    """Group spending totals by category."""
    breakdown: dict[str, float] = {}
    for e in expenses:
        cat = e.category or "uncategorized"
        breakdown[cat] = breakdown.get(cat, 0.0) + e.amount
    return breakdown

def recalculate_trip_budget(trip_id: int, db: Session):
    """
    Recalculate total trip budget dynamically.
    """

    trip = db.query(Trip).filter(
        Trip.id == trip_id
    ).first()

    if not trip:
        return None

    expenses = db.query(Expense).filter(
        Expense.trip_id == trip_id
    ).all()

    stops = db.query(Stop).filter(
        Stop.trip_id == trip_id
    ).all()

    total_expense_cost = sum(
        e.amount for e in expenses
    )

    total_stop_cost = 0

    total_activity_cost = 0

    for stop in stops:

        activities = db.query(Activity).filter(
            Activity.stop_id == stop.id
        ).all()

        total_activity_cost += sum(
            a.estimated_cost or 0
            for a in activities
        )

    total_budget = (
    total_expense_cost
    + total_activity_cost
)

    trip.total_budget = total_budget

    db.commit()
    db.refresh(trip)

    return trip