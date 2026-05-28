"""
activity_routes.py — CRUD endpoints for Activities
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.session import get_db
from app.schemas.activity_schema import ActivityCreate, ActivityUpdate, ActivityResponse
from app.models.activity import Activity
router = APIRouter()


@router.post("/", response_model=ActivityResponse, status_code=status.HTTP_201_CREATED)
def create_activity(payload: ActivityCreate, db: Session = Depends(get_db)):

    new_activity = Activity(
        name=payload.name,
        category=payload.category,
        scheduled_at=payload.scheduled_at,
        duration_minutes=payload.duration_minutes,
        estimated_cost=payload.estimated_cost,
        notes=payload.notes,
        stop_id=payload.stop_id
    )

    db.add(new_activity)
    db.commit()
    db.refresh(new_activity)

    return new_activity


@router.get("/stop/{stop_id}", response_model=List[ActivityResponse])
def list_activities(stop_id: int, db: Session = Depends(get_db)):

    activities = db.query(Activity).filter(
        Activity.stop_id == stop_id
    ).all()

    return activities


@router.get("/trip/{trip_id}", response_model=List[ActivityResponse])
def list_activities_by_trip(trip_id: int, db: Session = Depends(get_db)):

    from app.models.stop import Stop
    stop_ids = [s.id for s in db.query(Stop).filter(Stop.trip_id == trip_id).all()]
    if not stop_ids:
        return []

    activities = db.query(Activity).filter(
        Activity.stop_id.in_(stop_ids)
    ).all()

    return activities


@router.put("/{activity_id}", response_model=ActivityResponse)
def update_activity(
    activity_id: int,
    payload: ActivityUpdate,
    db: Session = Depends(get_db)
):

    activity = db.query(Activity).filter(
        Activity.id == activity_id
    ).first()

    if not activity:
        raise HTTPException(
            status_code=404,
            detail="Activity not found"
        )

    if payload.name is not None:
        activity.name = payload.name

    if payload.category is not None:
        activity.category = payload.category

    if payload.scheduled_at is not None:
        activity.scheduled_at = payload.scheduled_at

    if payload.duration_minutes is not None:
        activity.duration_minutes = payload.duration_minutes

    if payload.estimated_cost is not None:
        activity.estimated_cost = payload.estimated_cost

    if payload.notes is not None:
        activity.notes = payload.notes

    db.commit()
    db.refresh(activity)

    return activity


@router.delete("/{activity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_activity(activity_id: int, db: Session = Depends(get_db)):

    activity = db.query(Activity).filter(
        Activity.id == activity_id
    ).first()

    if not activity:
        raise HTTPException(
            status_code=404,
            detail="Activity not found"
        )

    db.delete(activity)
    db.commit()

    return None