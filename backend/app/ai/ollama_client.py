"""
Ollama Client for AI Health Insights

Uses a locally running Ollama instance with a free model like
Llama 3 or Mistral to generate health insights.

Setup:
1. Install Ollama: https://ollama.com
2. Pull a model: ollama pull llama3
3. Start Ollama: ollama serve
"""

import httpx
import json
from typing import Optional


OLLAMA_BASE_URL = "http://localhost:11434"
DEFAULT_MODEL = "llama3"


async def get_health_insights(
    health_data: dict,
    goals: dict,
    model: str = DEFAULT_MODEL,
) -> str:
    """
    Use Ollama to generate personalized health insights
    based on user's health data and goals.
    """
    prompt = _build_insights_prompt(health_data, goals)

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{OLLAMA_BASE_URL}/api/generate",
                json={
                    "model": model,
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "temperature": 0.7,
                        "top_p": 0.9,
                    },
                },
            )

            if response.status_code == 200:
                result = response.json()
                return result.get("response", "No insights generated.")
            else:
                return _fallback_insights(health_data, goals)

    except (httpx.ConnectError, httpx.TimeoutException):
        return _fallback_insights(health_data, goals)


async def get_recommendations(
    health_data: dict,
    goals: dict,
    model: str = DEFAULT_MODEL,
) -> list[str]:
    """Get personalized recommendations."""
    prompt = _build_recommendations_prompt(health_data, goals)

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{OLLAMA_BASE_URL}/api/generate",
                json={
                    "model": model,
                    "prompt": prompt,
                    "stream": False,
                },
            )

            if response.status_code == 200:
                result = response.json()
                raw = result.get("response", "")
                # Parse bullet points from response
                recs = [
                    line.strip("- •")
                    for line in raw.strip().split("\n")
                    if line.strip() and len(line.strip()) > 5
                ]
                return recs[:5] if recs else _fallback_recommendations()
            else:
                return _fallback_recommendations()

    except (httpx.ConnectError, httpx.TimeoutException):
        return _fallback_recommendations()


async def is_ollama_running() -> bool:
    """Check if Ollama server is running."""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
            return response.status_code == 200
    except (httpx.ConnectError, httpx.TimeoutException):
        return False


# ---- Prompt Builders ----

def _build_insights_prompt(data: dict, goals: dict) -> str:
    return f"""You are a friendly health coach AI. Analyze the following health data
and provide concise, motivating insights.

Recent Health Data (Weekly Averages):
- Steps: {data.get('avg_steps', 0):,} / {goals.get('daily_steps_goal', 10000):,} goal
- Calories: {data.get('avg_calories', 0)} / {goals.get('daily_calories_goal', 2000)} goal
- Sleep: {data.get('avg_sleep', 0)} hrs / {goals.get('daily_sleep_goal', 8)} hrs goal
- Water: {data.get('total_water_ml', 0):,} ml total this week

Provide:
1. A brief assessment of their overall health this week
2. Highlight what they're doing well
3. One area to focus on improving

Keep it under 100 words, friendly and encouraging."""


def _build_recommendations_prompt(data: dict, goals: dict) -> str:
    return f"""You are a health coach. Based on this data, give 5 specific,
actionable health recommendations. One per line, no numbering.

Steps: {data.get('avg_steps', 0):,} (goal: {goals.get('daily_steps_goal', 10000):,})
Calories: {data.get('avg_calories', 0)} (goal: {goals.get('daily_calories_goal', 2000)})
Sleep: {data.get('avg_sleep', 0)} hrs (goal: {goals.get('daily_sleep_goal', 8)} hrs)
Water: {data.get('total_water_ml', 0):,} ml this week

Format: Start each line with a dash (-). Be specific and actionable."""


# ---- Fallback (Rule-based) ----

def _fallback_insights(data: dict, goals: dict) -> str:
    """Rule-based fallback when Ollama is not available."""
    insights = []

    avg_steps = data.get("avg_steps", 0)
    steps_goal = goals.get("daily_steps_goal", 10000)

    if avg_steps >= steps_goal:
        insights.append(f"🌟 Great job! You're averaging {avg_steps:,} steps, hitting your {steps_goal:,} step goal!")
    elif avg_steps >= steps_goal * 0.7:
        insights.append(f"💪 You're at {avg_steps:,} steps — just {steps_goal - avg_steps:,} more to reach your goal!")
    else:
        insights.append(f"📈 You're at {avg_steps:,} steps. Try to increase by 1,000 steps each day.")

    avg_sleep = data.get("avg_sleep", 0)
    sleep_goal = goals.get("daily_sleep_goal", 8)

    if avg_sleep >= sleep_goal:
        insights.append(f"😴 Excellent sleep at {avg_sleep} hours per night!")
    elif avg_sleep >= 6:
        insights.append(f"😴 You're getting {avg_sleep} hours — aim for {sleep_goal} for optimal recovery.")
    else:
        insights.append(f"⚠️ Only {avg_sleep} hours of sleep. Try to get at least 7 hours.")

    if data.get("entries_count", 0) < 5:
        insights.append("📝 Keep logging daily for better insights!")

    return "\n\n".join(insights)


def _fallback_recommendations() -> list[str]:
    return [
        "🚶 Try to walk 10,000 steps daily — take stairs, walk during calls",
        "💧 Drink water first thing in the morning to stay hydrated",
        "😴 Set a consistent bedtime to improve sleep quality",
        "🥗 Add one extra serving of vegetables to your meals",
        "🧘 Take 5 minutes for deep breathing to reduce stress",
    ]
