"""
Health Tracker API - Main Application

A Python + FastAPI backend for a health tracking app
with AI-powered insights using Ollama and Scikit-learn.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, Base
from .routers import health, ai_insights

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="Health Tracker API",
    description="AI-powered health tracking backend",
    version="1.0.0",
)

# Enable CORS for Angular frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Angular dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router)
app.include_router(ai_insights.router)


@app.get("/")
def root():
    return {
        "message": "Health Tracker API",
        "docs": "/docs",
        "endpoints": {
            "health_entries": "/api/health/entries",
            "summary": "/api/health/summary",
            "chart_data": "/api/health/chart-data",
            "goals": "/api/health/goals",
            "ai_insights": "/api/ai/insights",
            "health_score": "/api/ai/health-score",
            "ai_status": "/api/ai/status",
        },
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}
