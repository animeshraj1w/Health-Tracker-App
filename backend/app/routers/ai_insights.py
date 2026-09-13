from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime

from ..database import get_db
from ..models import HealthEntry, UserGoals
from ..schemas import AIInsightResponse
from ..ai.prediction_model import health_predictor
from ..ai.ollama_client import get_health_insights, get_recommendations, is_ollama_running

router = APIRouter(prefix="/api/ai", tags=["ai"])


@router.get("/insights", response_model=AIInsightResponse)
async def get_ai_insights(db: Session = Depends(get_db)):
    """
    Get AI-powered health insights based on recent data.
    Uses Ollama (local LLM) with fallback to rule-based insights.
    """
    # Get recent entries (last 7 days)
    from datetime import timedelta
    week_ago = datetime.now() - timedelta(days=7)

    entries = (
        db.query(HealthEntry)
        .filter(HealthEntry.date >= week_ago)
        .order_by(HealthEntry.date.asc())
        .all()
    )

    goals = db.query(UserGoals).first()
    goals_dict = {
        "daily_steps_goal": goals.daily_steps_goal if goals else 10000,
        "daily_calories_goal": goals.daily_calories_goal if goals else 2000,
        "daily_sleep_goal": goals.daily_sleep_goal if goals else 8,
        "daily_water_goal": goals.daily_water_goal if goals else 2000,
    }

    # Calculate summary
    data_dict = {}
    if entries:
        data_dict = {
            "avg_steps": round(sum(e.steps for e in entries) / len(entries)),
            "avg_calories": round(sum(e.calories for e in entries) / len(entries), 1),
            "avg_sleep": round(sum(e.sleep_hours for e in entries) / len(entries), 1),
            "total_water_ml": sum(e.water_intake_ml for e in entries),
            "entries_count": len(entries),
        }
    else:
        data_dict = {
            "avg_steps": 0, "avg_calories": 0, "avg_sleep": 0,
            "total_water_ml": 0, "entries_count": 0,
        }

    # Get insights from Ollama or fallback
    insights_text = await get_health_insights(data_dict, goals_dict)
    recommendations = await get_recommendations(data_dict, goals_dict)

    # Prediction
    prediction = None
    if len(entries) >= 3:
        entries_data = [
            {
                "day_of_week": e.date.weekday(),
                "steps": e.steps,
                "calories": e.calories,
                "sleep_hours": e.sleep_hours,
            }
            for e in entries
        ]
        health_predictor.train(entries_data)
        predicted_steps = health_predictor.predict_steps(entries_data)
        if predicted_steps:
            prediction = f"Based on your trend, you'll likely walk ~{predicted_steps:,} steps tomorrow."

    return AIInsightResponse(
        insights=insights_text,
        recommendations=recommendations,
        prediction=prediction,
    )


@router.get("/health-score")
def get_health_score(db: Session = Depends(get_db)):
    """Calculate health score for today's entry."""
    today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)

    entry = (
        db.query(HealthEntry)
        .filter(HealthEntry.date >= today)
        .order_by(HealthEntry.date.desc())
        .first()
    )

    goals = db.query(UserGoals).first()

    if not entry:
        return {"message": "No entry for today yet", "score": None}

    goals_dict = {
        "daily_steps_goal": goals.daily_steps_goal if goals else 10000,
        "daily_calories_goal": goals.daily_calories_goal if goals else 2000,
        "daily_sleep_goal": goals.daily_sleep_goal if goals else 8,
        "daily_water_goal": goals.daily_water_goal if goals else 2000,
    }

    entry_dict = {
        "steps": entry.steps,
        "calories": entry.calories,
        "sleep_hours": entry.sleep_hours,
        "water_intake_ml": entry.water_intake_ml,
    }

    score = health_predictor.calculate_health_score(entry_dict, goals_dict)
    return score


@router.get("/status")
async def get_ai_status():
    """Check AI system status."""
    ollama_running = await is_ollama_running()
    return {
        "ollama_running": ollama_running,
        "model": "llama3" if ollama_running else "rule-based-fallback",
        "mode": "ollama" if ollama_running else "fallback",
    }
