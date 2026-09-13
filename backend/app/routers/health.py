from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from typing import List

from ..database import get_db
from ..models import HealthEntry, UserGoals
from ..schemas import (
    HealthEntryCreate,
    HealthEntryResponse,
    UserGoalsCreate,
    UserGoalsResponse,
)

router = APIRouter(prefix="/api/health", tags=["health"])


# ---- Health Entries ----

@router.post("/entries", response_model=HealthEntryResponse)
def create_health_entry(entry: HealthEntryCreate, db: Session = Depends(get_db)):
    db_entry = HealthEntry(**entry.model_dump())
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry


@router.get("/entries", response_model=List[HealthEntryResponse])
def get_health_entries(
    skip: int = 0,
    limit: int = 30,
    db: Session = Depends(get_db),
):
    entries = (
        db.query(HealthEntry)
        .order_by(HealthEntry.date.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return entries


@router.get("/entries/today", response_model=HealthEntryResponse)
def get_today_entry(db: Session = Depends(get_db)):
    today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    entry = (
        db.query(HealthEntry)
        .filter(HealthEntry.date >= today)
        .order_by(HealthEntry.date.desc())
        .first()
    )
    if not entry:
        raise HTTPException(status_code=404, detail="No entry for today")
    return entry


@router.get("/entries/{entry_id}", response_model=HealthEntryResponse)
def get_health_entry(entry_id: int, db: Session = Depends(get_db)):
    entry = db.query(HealthEntry).filter(HealthEntry.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    return entry


@router.put("/entries/{entry_id}", response_model=HealthEntryResponse)
def update_health_entry(
    entry_id: int, entry: HealthEntryCreate, db: Session = Depends(get_db)
):
    db_entry = db.query(HealthEntry).filter(HealthEntry.id == entry_id).first()
    if not db_entry:
        raise HTTPException(status_code=404, detail="Entry not found")

    for key, value in entry.model_dump().items():
        setattr(db_entry, key, value)

    db.commit()
    db.refresh(db_entry)
    return db_entry


@router.delete("/entries/{entry_id}")
def delete_health_entry(entry_id: int, db: Session = Depends(get_db)):
    db_entry = db.query(HealthEntry).filter(HealthEntry.id == entry_id).first()
    if not db_entry:
        raise HTTPException(status_code=404, detail="Entry not found")

    db.delete(db_entry)
    db.commit()
    return {"message": "Entry deleted successfully"}


# ---- Summary / Stats ----

@router.get("/summary")
def get_summary(db: Session = Depends(get_db)):
    """Get summary stats for the current week."""
    week_ago = datetime.now() - timedelta(days=7)

    entries = (
        db.query(HealthEntry)
        .filter(HealthEntry.date >= week_ago)
        .all()
    )

    if not entries:
        return {
            "avg_steps": 0,
            "avg_calories": 0,
            "avg_sleep": 0,
            "total_water_ml": 0,
            "entries_count": 0,
        }

    return {
        "avg_steps": round(sum(e.steps for e in entries) / len(entries)),
        "avg_calories": round(sum(e.calories for e in entries) / len(entries), 1),
        "avg_sleep": round(sum(e.sleep_hours for e in entries) / len(entries), 1),
        "total_water_ml": sum(e.water_intake_ml for e in entries),
        "entries_count": len(entries),
    }


@router.get("/chart-data")
def get_chart_data(days: int = 7, db: Session = Depends(get_db)):
    """Get data formatted for charts (last N days)."""
    start_date = datetime.now() - timedelta(days=days)

    entries = (
        db.query(HealthEntry)
        .filter(HealthEntry.date >= start_date)
        .order_by(HealthEntry.date.asc())
        .all()
    )

    return {
        "labels": [e.date.strftime("%b %d") for e in entries],
        "steps": [e.steps for e in entries],
        "calories": [e.calories for e in entries],
        "sleep": [e.sleep_hours for e in entries],
        "water": [e.water_intake_ml for e in entries],
    }


# ---- User Goals ----

@router.post("/goals", response_model=UserGoalsResponse)
def create_or_update_goals(goals: UserGoalsCreate, db: Session = Depends(get_db)):
    existing = db.query(UserGoals).first()

    if existing:
        for key, value in goals.model_dump().items():
            setattr(existing, key, value)
        db.commit()
        db.refresh(existing)
        return existing

    db_goals = UserGoals(**goals.model_dump())
    db.add(db_goals)
    db.commit()
    db.refresh(db_goals)
    return db_goals


@router.get("/goals", response_model=UserGoalsResponse)
def get_goals(db: Session = Depends(get_db)):
    goals = db.query(UserGoals).first()
    if not goals:
        # Return default goals
        return UserGoalsResponse(
            id=0,
            daily_steps_goal=10000,
            daily_calories_goal=2000.0,
            daily_sleep_goal=8.0,
            daily_water_goal=2000,
            target_weight_kg=None,
            updated_at=datetime.now(),
        )
    return goals
