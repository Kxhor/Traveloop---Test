"""
expense_routes.py — CRUD endpoints for Expenses
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.session import get_db
from app.schemas.expense_schema import (
    ExpenseCreate,
    ExpenseUpdate,
    ExpenseResponse
)
from app.models.expense import Expense
from app.services.budget_service import recalculate_trip_budget

router = APIRouter()


@router.post("/", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
def create_expense(payload: ExpenseCreate, db: Session = Depends(get_db)):

    new_expense = Expense(
    title=payload.title,
    amount=payload.amount,
    currency=payload.currency,
    category=payload.category,
    trip_id=payload.trip_id
)

    db.add(new_expense)
    db.commit()

    recalculate_trip_budget(
        payload.trip_id,
        db
    )

    db.refresh(new_expense)

    return new_expense


@router.get("/trip/{trip_id}", response_model=List[ExpenseResponse])
def list_expenses(trip_id: int, db: Session = Depends(get_db)):

    expenses = db.query(Expense).filter(
        Expense.trip_id == trip_id
    ).all()

    return expenses


@router.put("/{expense_id}", response_model=ExpenseResponse)
def update_expense(
    expense_id: int,
    payload: ExpenseUpdate,
    db: Session = Depends(get_db)
):

    expense = db.query(Expense).filter(
        Expense.id == expense_id
    ).first()

    if not expense:
        raise HTTPException(
            status_code=404,
            detail="Expense not found"
        )

    if payload.title is not None:
        expense.title = payload.title

    if payload.amount is not None:
        expense.amount = payload.amount

    if payload.currency is not None:
        expense.currency = payload.currency

    if payload.category is not None:
        expense.category = payload.category

    db.commit()

    recalculate_trip_budget(
        expense.trip_id,
        db
    )

    db.refresh(expense)

    return expense


@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(expense_id: int, db: Session = Depends(get_db)):

    expense = db.query(Expense).filter(
        Expense.id == expense_id
    ).first()

    if not expense:
        raise HTTPException(
            status_code=404,
            detail="Expense not found"
        )

    trip_id = expense.trip_id

    db.delete(expense)
    db.commit()

    recalculate_trip_budget(
        trip_id,
        db
    )

    return None