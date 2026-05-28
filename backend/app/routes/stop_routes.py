"""
stop_routes.py — CRUD endpoints for Stops (cities in a trip)
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.session import get_db
from app.schemas.stop_schema import StopCreate, StopUpdate, StopResponse
from app.models.stop import Stop

router = APIRouter()


@router.post("/", response_model=StopResponse, status_code=status.HTTP_201_CREATED)
def create_stop(payload: StopCreate, db: Session = Depends(get_db)):

    new_stop = Stop(
        city=payload.city,
        country=payload.country,
        arrival_date=payload.arrival_date,
        departure_date=payload.departure_date,
        order_index=payload.order_index,
        trip_id=payload.trip_id
    )

    db.add(new_stop)
    db.commit()
    db.refresh(new_stop)

    return new_stop


@router.get("/trip/{trip_id}", response_model=List[StopResponse])
def list_stops(trip_id: int, db: Session = Depends(get_db)):

    stops = db.query(Stop).filter(Stop.trip_id == trip_id).all()

    return stops


@router.put("/{stop_id}", response_model=StopResponse)
def update_stop(
    stop_id: int,
    payload: StopUpdate,
    db: Session = Depends(get_db)
):

    stop = db.query(Stop).filter(Stop.id == stop_id).first()

    if not stop:
        raise HTTPException(
            status_code=404,
            detail="Stop not found"
        )

    if payload.city is not None:
        stop.city = payload.city

    if payload.country is not None:
        stop.country = payload.country

    if payload.arrival_date is not None:
        stop.arrival_date = payload.arrival_date

    if payload.departure_date is not None:
        stop.departure_date = payload.departure_date

    if payload.order_index is not None:
        stop.order_index = payload.order_index

    db.commit()
    db.refresh(stop)

    return stop


@router.delete("/{stop_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_stop(stop_id: int, db: Session = Depends(get_db)):

    stop = db.query(Stop).filter(Stop.id == stop_id).first()

    if not stop:
        raise HTTPException(
            status_code=404,
            detail="Stop not found"
        )

    db.delete(stop)
    db.commit()

    return None