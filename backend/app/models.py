from sqlalchemy import Column, Integer, Float, String, Date, DateTime, Text
from sqlalchemy.sql import func
from datetime import date
from app.database import Base


class HealthEntry(Base):
    __tablename__ = "health_entries"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, default=date.today, unique=True)
    steps = Column(Integer)
    calories = Column(Integer)
    sleep_hours = Column(Float)
    water_intake_ml = Column(Integer)
    weight_kg = Column(Float, nullable=True)
    mood = Column(String(20))
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=func.now())
