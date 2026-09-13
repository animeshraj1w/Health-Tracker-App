from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base


class HealthEntry(Base):
    __tablename__ = "health_entries"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, default=datetime.now)
    steps = Column(Integer, default=0)
    calories = Column(Float, default=0.0)
    sleep_hours = Column(Float, default=0.0)
    water_intake_ml = Column(Integer, default=0)
    weight_kg = Column(Float, nullable=True)
    mood = Column(String, nullable=True)  # happy, sad, neutral, stressed
    notes = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.now)


class UserGoals(Base):
    __tablename__ = "user_goals"

    id = Column(Integer, primary_key=True, index=True)
    daily_steps_goal = Column(Integer, default=10000)
    daily_calories_goal = Column(Float, default=2000.0)
    daily_sleep_goal = Column(Float, default=8.0)
    daily_water_goal = Column(Integer, default=2000)
    target_weight_kg = Column(Float, nullable=True)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
