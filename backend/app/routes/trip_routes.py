"""
trip_routes.py — CRUD endpoints for Trips
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.session import get_db
from app.schemas.trip_schema import TripCreate, TripUpdate, TripResponse
from app.models.trip import Trip
router = APIRouter()


@router.post("/", response_model=TripResponse, status_code=status.HTTP_201_CREATED)
def create_trip(payload: TripCreate, db: Session = Depends(get_db)):
    """Create a new trip."""

    new_trip = Trip(
        title=payload.title,
        description=payload.description,
        start_date=payload.start_date,
        end_date=payload.end_date,
        total_budget=payload.total_budget,
        
    )

    db.add(new_trip)
    db.commit()
    db.refresh(new_trip)

    return new_trip

@router.get("/", response_model=List[TripResponse])
def list_trips(db: Session = Depends(get_db)):
    """List all trips."""

    trips = db.query(Trip).all()

    return trips


@router.get("/{trip_id}", response_model=TripResponse)
def get_trip(trip_id: int, db: Session = Depends(get_db)):
    """Get a single trip by ID."""

    trip = db.query(Trip).filter(Trip.id == trip_id).first()

    if not trip:
        raise HTTPException(
            status_code=404,
            detail="Trip not found"
        )

    return trip


@router.put("/{trip_id}", response_model=TripResponse)
def update_trip(
    trip_id: int,
    payload: TripUpdate,
    db: Session = Depends(get_db)
):
    """Update trip details."""

    trip = db.query(Trip).filter(Trip.id == trip_id).first()

    if not trip:
        raise HTTPException(
            status_code=404,
            detail="Trip not found"
        )

    if payload.title is not None:
        trip.title = payload.title
    if payload.description is not None:
        trip.description = payload.description
    if payload.start_date is not None:
        trip.start_date = payload.start_date
    if payload.end_date is not None:
        trip.end_date = payload.end_date
    if payload.total_budget is not None:
        trip.total_budget = payload.total_budget

    db.commit()
    db.refresh(trip)

    return trip


@router.delete("/{trip_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_trip(trip_id: int, db: Session = Depends(get_db)):
    """Delete a trip."""

    trip = db.query(Trip).filter(Trip.id == trip_id).first()

    if not trip:
        raise HTTPException(
            status_code=404,
            detail="Trip not found"
        )

    db.delete(trip)
    db.commit()

    return None