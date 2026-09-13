# 🏥 AI Health Tracker

A full-stack health tracking application powered by AI, built with **Python (FastAPI)** and **Angular**.

## 🚀 Features

- 📊 **Dashboard** — Track steps, calories, sleep, and water intake
- ➕ **Log Data** — Add daily health entries with mood tracking
- 🤖 **AI Insights** — Get personalized health recommendations (Ollama + Scikit-learn)
- 📈 **Health Score** — ML-based scoring of your daily health
- 🎯 **Goals** — Set and track daily health targets
- 📅 **History** — View and manage past entries

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python, FastAPI, SQLAlchemy |
| Database | SQLite |
| AI/ML | Scikit-learn, Ollama (local LLM) |
| Frontend | Angular 17+ |

## 📋 Prerequisites

- Python 3.9+
- Node.js 18+ and npm
- Angular CLI (`npm install -g @angular/cli`)
- [Ollama](https://ollama.com) (optional, for AI insights)

## 🏃 Setup & Run

### 1. Install Git for Windows

```bash
winget install --id Git.Git --exact --source winget
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python run.py
```

Backend will start at: `http://localhost:8000`
API docs: `http://localhost:8000/docs`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run the Angular dev server
ng serve
```

Frontend will start at: `http://localhost:4200`

### 4. (Optional) Ollama for AI Insights

```bash
# Install Ollama from https://ollama.com

# Pull a free model
ollama pull llama3

# Start Ollama
ollama serve
```

Without Ollama, the app uses **rule-based fallback** insights — still works great!

## 📁 Project Structure

```
health-tracker/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry point
│   │   ├── database.py          # SQLite + SQLAlchemy setup
│   │   ├── models.py            # Database models
│   │   ├── schemas.py           # Pydantic schemas
│   │   ├── ai/
│   │   │   ├── prediction_model.py  # Scikit-learn predictions
│   │   │   └── ollama_client.py     # Ollama LLM integration
│   │   └── routers/
│   │       ├── health.py        # Health entry endpoints
│   │       └── ai_insights.py   # AI insight endpoints
│   ├── requirements.txt
│   └── run.py
├── frontend/
│   └── src/app/
│       ├── components/
│       │   ├── dashboard/       # Dashboard view
│       │   ├── add-entry/       # Add health data form
│       │   ├── insights/        # AI insights view
│       │   ├── history/         # Past entries view
│       │   ├── goals/           # Goal settings
│       │   └── navbar/          # Navigation bar
│       ├── services/
│       │   └── health.service.ts  # API communication
│       ├── app.routes.ts        # Route configuration
│       └── app.config.ts        # App configuration
└── README.md
```

## 🧠 How the AI Works

### Scikit-learn (Predictions)
- Trains a linear regression model on your historical data
- Predicts tomorrow's likely step count
- Calculates a health score based on goal completion

### Ollama (Natural Language Insights)
- Sends your weekly health data to a local LLM
- Gets personalized, conversational health advice
- Falls back to rule-based insights if Ollama is not running

## 📚 Learning Outcomes

### Python (Backend)
- ✅ FastAPI REST API development
- ✅ SQLAlchemy ORM + SQLite database
- ✅ Pydantic data validation
- ✅ Scikit-learn machine learning basics
- ✅ Async HTTP client (httpx)

### Angular (Frontend)
- ✅ Component-based architecture
- ✅ Angular services & dependency injection
- ✅ Reactive forms and data binding
- ✅ HTTP client for API communication
- ✅ Route configuration and navigation
- ✅ TypeScript best practices

## 📄 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health/entries` | List all entries |
| POST | `/api/health/entries` | Create new entry |
| GET | `/api/health/entries/today` | Get today's entry |
| GET | `/api/health/summary` | Weekly summary |
| GET | `/api/health/chart-data` | Chart data |
| GET/POST | `/api/health/goals` | Get/set goals |
| GET | `/api/ai/insights` | AI health insights |
| GET | `/api/ai/health-score` | ML health score |
| GET | `/api/ai/status` | AI system status |
