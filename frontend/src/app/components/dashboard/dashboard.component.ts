import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HealthService } from '../../services/health.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard">
      <h1>📊 Dashboard</h1>

      <!-- Today's Summary -->
      <section class="today-card" *ngIf="todayEntry">
        <h2>Today's Progress</h2>
        <div class="stats-grid">
          <div class="stat-card steps">
            <div class="stat-icon">🚶</div>
            <div class="stat-value">{{ todayEntry.steps | number }}</div>
            <div class="stat-label">Steps</div>
            <div class="progress-bar">
              <div class="progress" [style.width.%]="getProgress('steps')"></div>
            </div>
          </div>

          <div class="stat-card calories">
            <div class="stat-icon">🔥</div>
            <div class="stat-value">{{ todayEntry.calories | number:'1.0-0' }}</div>
            <div class="stat-label">Calories</div>
            <div class="progress-bar">
              <div class="progress" [style.width.%]="getProgress('calories')"></div>
            </div>
          </div>

          <div class="stat-card sleep">
            <div class="stat-icon">😴</div>
            <div class="stat-value">{{ todayEntry.sleep_hours }}h</div>
            <div class="stat-label">Sleep</div>
            <div class="progress-bar">
              <div class="progress" [style.width.%]="getProgress('sleep')"></div>
            </div>
          </div>

          <div class="stat-card water">
            <div class="stat-icon">💧</div>
            <div class="stat-value">{{ todayEntry.water_intake_ml }}ml</div>
            <div class="stat-label">Water</div>
            <div class="progress-bar">
              <div class="progress" [style.width.%]="getProgress('water')"></div>
            </div>
          </div>
        </div>
      </section>

      <section class="today-card" *ngIf="!todayEntry">
        <h2>Welcome! 👋</h2>
        <p>No entry for today yet.</p>
        <a routerLink="/add" class="btn-primary">Add Today's Data</a>
      </section>

      <!-- Weekly Summary -->
      <section class="weekly-card" *ngIf="summary">
        <h2>📈 This Week</h2>
        <div class="summary-stats">
          <div class="summary-item">
            <span class="summary-value">{{ summary.avg_steps | number }}</span>
            <span class="summary-label">Avg Steps</span>
          </div>
          <div class="summary-item">
            <span class="summary-value">{{ summary.avg_calories | number:'1.0-0' }}</span>
            <span class="summary-label">Avg Calories</span>
          </div>
          <div class="summary-item">
            <span class="summary-value">{{ summary.avg_sleep }}h</span>
            <span class="summary-label">Avg Sleep</span>
          </div>
          <div class="summary-item">
            <span class="summary-value">{{ summary.total_water_ml | number }}ml</span>
            <span class="summary-label">Total Water</span>
          </div>
        </div>
      </section>

      <!-- Quick Actions -->
      <section class="quick-actions">
        <h2>⚡ Quick Actions</h2>
        <div class="action-buttons">
          <a routerLink="/add" class="action-btn">➕ Log Data</a>
          <a routerLink="/insights" class="action-btn">🤖 Get AI Insights</a>
          <a routerLink="/history" class="action-btn">📅 View History</a>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .dashboard h1 {
      font-size: 2rem;
      margin-bottom: 30px;
      color: #333;
    }

    .today-card, .weekly-card, .quick-actions {
      background: white;
      border-radius: 16px;
      padding: 30px;
      margin-bottom: 25px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    }

    .today-card h2, .weekly-card h2, .quick-actions h2 {
      margin-top: 0;
      color: #444;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .stat-card {
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      border-radius: 12px;
      padding: 20px;
      text-align: center;
    }

    .stat-card.steps { background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); }
    .stat-card.calories { background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); }
    .stat-card.sleep { background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%); }
    .stat-card.water { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }

    .stat-icon { font-size: 2rem; margin-bottom: 10px; }
    .stat-value { font-size: 1.8rem; font-weight: bold; }
    .stat-label { font-size: 0.9rem; opacity: 0.8; margin-top: 5px; }

    .progress-bar {
      width: 100%;
      height: 6px;
      background: rgba(0,0,0,0.1);
      border-radius: 3px;
      margin-top: 15px;
      overflow: hidden;
    }

    .progress {
      height: 100%;
      background: #667eea;
      border-radius: 3px;
      transition: width 0.5s ease;
    }

    .summary-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .summary-item {
      text-align: center;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 10px;
    }

    .summary-value { display: block; font-size: 1.5rem; font-weight: bold; color: #667eea; }
    .summary-label { display: block; font-size: 0.85rem; color: #666; margin-top: 5px; }

    .action-buttons {
      display: flex;
      gap: 15px;
      margin-top: 20px;
      flex-wrap: wrap;
    }

    .action-btn {
      padding: 12px 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-decoration: none;
      border-radius: 10px;
      font-weight: 600;
      transition: transform 0.2s;
    }

    .action-btn:hover {
      transform: translateY(-2px);
    }

    .btn-primary {
      display: inline-block;
      padding: 12px 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-decoration: none;
      border-radius: 10px;
      font-weight: 600;
      margin-top: 15px;
    }
  `],
})
export class DashboardComponent implements OnInit {
  todayEntry: any = null;
  summary: any = null;
  goals: any = null;

  constructor(private healthService: HealthService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.healthService.getTodayEntry().subscribe({
      next: (data) => (this.todayEntry = data),
      error: () => (this.todayEntry = null),
    });

    this.healthService.getSummary().subscribe({
      next: (data) => (this.summary = data),
    });

    this.healthService.getGoals().subscribe({
      next: (data) => (this.goals = data),
    });
  }

  getProgress(type: string): number {
    if (!this.todayEntry || !this.goals) return 0;

    switch (type) {
      case 'steps':
        return Math.min((this.todayEntry.steps / this.goals.daily_steps_goal) * 100, 100);
      case 'calories':
        return Math.min((this.todayEntry.calories / this.goals.daily_calories_goal) * 100, 100);
      case 'sleep':
        return Math.min((this.todayEntry.sleep_hours / this.goals.daily_sleep_goal) * 100, 100);
      case 'water':
        return Math.min((this.todayEntry.water_intake_ml / this.goals.daily_water_goal) * 100, 100);
      default:
        return 0;
    }
  }
}
