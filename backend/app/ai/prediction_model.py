"""
AI Prediction Model using Scikit-learn

Predicts:
- Tomorrow's likely step count based on trends
- Whether user will meet their goals
- Health score based on recent data
"""

import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
from typing import Optional


class HealthPredictor:
    """Simple ML model to predict health metrics and scores."""

    def __init__(self):
        self.steps_model = LinearRegression()
        self.scaler = StandardScaler()
        self.is_trained = False

    def prepare_features(self, entries: list[dict]) -> np.ndarray:
        """
        Convert health entries into features for the model.
        Features: [day_of_week, prev_steps, prev_calories, prev_sleep]
        """
        features = []
        for i, entry in enumerate(entries):
            day_of_week = entry.get("day_of_week", 0)
            prev_steps = entries[i - 1]["steps"] if i > 0 else entry["steps"]
            prev_calories = entries[i - 1]["calories"] if i > 0 else entry["calories"]
            prev_sleep = entries[i - 1]["sleep_hours"] if i > 0 else entry["sleep_hours"]
            features.append([day_of_week, prev_steps, prev_calories, prev_sleep])
        return np.array(features)

    def train(self, entries: list[dict]) -> None:
        """Train the model on historical entries."""
        if len(entries) < 3:
            return  # Not enough data

        X = self.prepare_features(entries)
        y_steps = np.array([e["steps"] for e in entries])

        self.scaler.fit(X)
        X_scaled = self.scaler.transform(X)
        self.steps_model.fit(X_scaled, y_steps)
        self.is_trained = True

    def predict_steps(self, entries: list[dict], day_of_week: int = 0) -> Optional[int]:
        """Predict tomorrow's step count."""
        if not self.is_trained or not entries:
            return None

        last_entry = entries[-1]
        features = np.array([[day_of_week, last_entry["steps"],
                              last_entry["calories"], last_entry["sleep_hours"]]])
        features_scaled = self.scaler.transform(features)
        prediction = self.steps_model.predict(features_scaled)[0]
        return max(0, int(prediction))

    def calculate_health_score(self, entry: dict, goals: dict) -> dict:
        """
        Calculate a health score (0-100) based on how well the user
        meets their goals.
        """
        scores = {}

        # Steps score
        steps_goal = goals.get("daily_steps_goal", 10000)
        steps_ratio = min(entry.get("steps", 0) / steps_goal, 1.0) if steps_goal > 0 else 0
        scores["steps"] = round(steps_ratio * 100)

        # Calories score (closer to goal = better)
        calories_goal = goals.get("daily_calories_goal", 2000)
        if calories_goal > 0:
            cal_diff = abs(entry.get("calories", 0) - calories_goal) / calories_goal
            scores["calories"] = round(max(0, (1 - cal_diff)) * 100)
        else:
            scores["calories"] = 50

        # Sleep score
        sleep_goal = goals.get("daily_sleep_goal", 8)
        sleep_hours = entry.get("sleep_hours", 0)
        if sleep_goal > 0:
            sleep_ratio = min(sleep_hours / sleep_goal, 1.0)
            scores["sleep"] = round(sleep_ratio * 100)
        else:
            scores["sleep"] = 50

        # Water score
        water_goal = goals.get("daily_water_goal", 2000)
        water_ratio = min(entry.get("water_intake_ml", 0) / water_goal, 1.0) if water_goal > 0 else 0
        scores["water"] = round(water_ratio * 100)

        # Overall score (weighted average)
        overall = round(
            scores["steps"] * 0.3
            + scores["calories"] * 0.2
            + scores["sleep"] * 0.3
            + scores["water"] * 0.2
        )

        return {
            "overall": overall,
            "breakdown": scores,
            "rating": self._get_rating(overall),
        }

    @staticmethod
    def _get_rating(score: int) -> str:
        if score >= 90:
            return "Excellent! 🌟"
        elif score >= 70:
            return "Good job! 👍"
        elif score >= 50:
            return "Keep going! 💪"
        else:
            return "Room to improve 📈"


# Singleton instance
health_predictor = HealthPredictor()
