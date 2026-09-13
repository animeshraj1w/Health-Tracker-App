from pydantic import BaseModel
from datetime import datetime
from typing import Optional


# Health Entry Schemas
class HealthEntryCreate(BaseModel):
    steps: int = 0
    calories: float = 0.0
    sleep_hours: float = 0.0
    water_intake_ml: int = 0
    weight_kg: Optional[float] = None
    mood: Optional[str] = None
    notes: Optional[str] = None


class HealthEntryResponse(BaseModel):
    id: int
    date: datetime
    steps: int
    calories: float
    sleep_hours: float
    water_intake_ml: int
    weight_kg: Optional[float]
    mood: Optional[str]
    notes: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


# User Goals Schemas
class UserGoalsCreate(BaseModel):
    daily_steps_goal: int = 10000
    daily_calories_goal: float = 2000.0
    daily_sleep_goal: float = 8.0
    daily_water_goal: int = 2000
    target_weight_kg: Optional[float] = None


class UserGoalsResponse(BaseModel):
    id: int
    daily_steps_goal: int
    daily_calories_goal: float
    daily_sleep_goal: float
    daily_water_goal: int
    target_weight_kg: Optional[float]
    updated_at: datetime

    class Config:
        from_attributes = True


# AI Insight Schemas
class AIInsightResponse(BaseModel):
    insights: str
    recommendations: list[str]
    prediction: Optional[str] = None
