import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HealthService } from '../../services/health.service';

@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="insights-page">
      <h1>🤖 AI Health Insights</h1>

      <!-- AI Status -->
      <div class="ai-status" [class.running]="aiStatus?.ollama_running">
        <span class="status-dot"></span>
        {{ aiStatus?.ollama_running ? 'Ollama Connected' : 'Using Fallback Mode' }}
        <span class="mode-badge">{{ aiStatus?.mode }}</span>
      </div>

      <!-- Health Score -->
      <section class="score-card" *ngIf="healthScore">
        <h2>Today's Health Score</h2>
        <div class="score-circle" [class]="'score-' + getScoreLevel()">
          <span class="score-value">{{ healthScore.overall }}</span>
          <span class="score-label">/ 100</span>
        </div>
        <p class="score-rating">{{ healthScore.rating }}</p>

        <div class="score-breakdown">
          <div class="breakdown-item" *ngFor="let item of getScoreItems()">
            <span class="breakdown-label">{{ item.label }}</span>
            <div class="breakdown-bar">
              <div class="breakdown-fill" [style.width.%]="item.value"></div>
            </div>
            <span class="breakdown-value">{{ item.value }}%</span>
          </div>
        </div>
      </section>

      <!-- AI Insights -->
      <section class="insights-card" *ngIf="insights">
        <h2>💡 Health Analysis</h2>
        <div class="insights-text" [innerHTML]="formatInsights(insights.insights)"></div>
      </section>

      <!-- Prediction -->
      <section class="prediction-card" *ngIf="insights?.prediction">
        <h2>🔮 Prediction</h2>
        <p>{{ insights.prediction }}</p>
      </section>

      <!-- Recommendations -->
      <section class="recommendations-card" *ngIf="insights?.recommendations?.length">
        <h2>📋 Recommendations</h2>
        <ul class="recommendation-list">
          <li *ngFor="let rec of insights.recommendations">
            {{ rec }}
          </li>
        </ul>
      </section>

      <!-- Loading -->
      <div class="loading" *ngIf="isLoading">
        <div class="spinner"></div>
        <p>Analyzing your health data...</p>
      </div>

      <!-- Refresh Button -->
      <button class="btn-refresh" (click)="loadInsights()" *ngIf="!isLoading">
        🔄 Refresh Insights
      </button>
    </div>
  `,
  styles: [`
    .insights-page h1 {
      font-size: 2rem;
      margin-bottom: 25px;
      color: #333;
    }

    .ai-status {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: #fff3cd;
      border-radius: 20px;
      font-size: 0.9rem;
      margin-bottom: 25px;
    }

    .ai-status.running {
      background: #d4edda;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #ffc107;
    }

    .ai-status.running .status-dot {
      background: #28a745;
    }

    .mode-badge {
      background: rgba(0,0,0,0.1);
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 0.8rem;
    }

    .score-card, .insights-card, .prediction-card, .recommendations-card {
      background: white;
      border-radius: 16px;
      padding: 30px;
      margin-bottom: 25px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    }

    .score-card h2, .insights-card h2, .prediction-card h2, .recommendations-card h2 {
      margin-top: 0;
      color: #444;
    }

    .score-circle {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin: 20px auto;
    }

    .score-excellent { background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); }
    .score-good { background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%); }
    .score-fair { background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); }
    .score-poor { background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); }

    .score-value { font-size: 2.5rem; font-weight: bold; color: #333; }
    .score-label { font-size: 0.9rem; color: #666; }
    .score-rating { text-align: center; font-size: 1.2rem; color: #555; margin-top: 10px; }

    .score-breakdown {
      margin-top: 25px;
    }

    .breakdown-item {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    .breakdown-label { width: 80px; font-size: 0.9rem; color: #666; }
    .breakdown-bar { flex: 1; height: 8px; background: #e8e8e8; border-radius: 4px; overflow: hidden; }
    .breakdown-fill { height: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 4px; transition: width 0.5s; }
    .breakdown-value { width: 40px; text-align: right; font-size: 0.85rem; color: #555; }

    .insights-text {
      font-size: 1.05rem;
      line-height: 1.8;
      color: #444;
      white-space: pre-line;
    }

    .prediction-card p {
      font-size: 1.1rem;
      color: #555;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 10px;
      border-left: 4px solid #667eea;
    }

    .recommendation-list {
      list-style: none;
      padding: 0;
    }

    .recommendation-list li {
      padding: 15px;
      margin-bottom: 10px;
      background: #f8f9fa;
      border-radius: 10px;
      font-size: 1rem;
      color: #444;
      border-left: 4px solid #667eea;
    }

    .loading {
      text-align: center;
      padding: 60px;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #e8e8e8;
      border-top-color: #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .btn-refresh {
      display: block;
      width: 100%;
      max-width: 300px;
      margin: 20px auto;
      padding: 14px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .btn-refresh:hover {
      transform: translateY(-2px);
    }
  `],
})
export class InsightsComponent implements OnInit {
  insights: any = null;
  healthScore: any = null;
  aiStatus: any = null;
  isLoading = false;

  constructor(private healthService: HealthService) {}

  ngOnInit() {
    this.loadInsights();
    this.loadHealthScore();
    this.loadAIStatus();
  }

  loadInsights() {
    this.isLoading = true;
    this.healthService.getAIInsights().subscribe({
      next: (data) => {
        this.insights = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  loadHealthScore() {
    this.healthService.getHealthScore().subscribe({
      next: (data) => {
        if (data.score !== null) {
          this.healthScore = data;
        }
      },
    });
  }

  loadAIStatus() {
    this.healthService.getAIStatus().subscribe({
      next: (data) => (this.aiStatus = data),
    });
  }

  getScoreLevel(): string {
    const score = this.healthScore?.overall || 0;
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    return 'poor';
  }

  getScoreItems(): { label: string; value: number }[] {
    if (!this.healthScore?.breakdown) return [];
    return [
      { label: 'Steps', value: this.healthScore.breakdown.steps },
      { label: 'Calories', value: this.healthScore.breakdown.calories },
      { label: 'Sleep', value: this.healthScore.breakdown.sleep },
      { label: 'Water', value: this.healthScore.breakdown.water },
    ];
  }

  formatInsights(text: string): string {
    return text?.replace(/\n/g, '<br>') || '';
  }
}
