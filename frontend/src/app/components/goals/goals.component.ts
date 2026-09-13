import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HealthService } from '../../services/health.service';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="goals-page">
      <h1>🎯 Daily Goals</h1>

      <form class="goals-form" (ngSubmit)="saveGoals()">
        <div class="goal-card">
          <div class="goal-header">
            <span class="goal-icon">🚶</span>
            <h3>Steps</h3>
          </div>
          <input type="number" [(ngModel)]="goals.daily_steps_goal"
                 name="steps_goal" min="1000" step="500">
          <span class="goal-hint">Recommended: 10,000</span>
        </div>

        <div class="goal-card">
          <div class="goal-header">
            <span class="goal-icon">🔥</span>
            <h3>Calories</h3>
          </div>
          <input type="number" [(ngModel)]="goals.daily_calories_goal"
                 name="calories_goal" min="500" step="50">
          <span class="goal-hint">Recommended: 2,000</span>
        </div>

        <div class="goal-card">
          <div class="goal-header">
            <span class="goal-icon">😴</span>
            <h3>Sleep (hours)</h3>
          </div>
          <input type="number" [(ngModel)]="goals.daily_sleep_goal"
                 name="sleep_goal" min="4" max="12" step="0.5">
          <span class="goal-hint">Recommended: 8</span>
        </div>

        <div class="goal-card">
          <div class="goal-header">
            <span class="goal-icon">💧</span>
            <h3>Water (ml)</h3>
          </div>
          <input type="number" [(ngModel)]="goals.daily_water_goal"
                 name="water_goal" min="500" step="100">
          <span class="goal-hint">Recommended: 2,000ml</span>
        </div>

        <button type="submit" class="btn-save" [disabled]="isSaving">
          {{ isSaving ? '💾 Saving...' : '💾 Save Goals' }}
        </button>

        <div class="success-message" *ngIf="successMessage">
          ✅ {{ successMessage }}
        </div>
      </form>
    </div>
  `,
  styles: [`
    .goals-page h1 {
      font-size: 2rem;
      margin-bottom: 30px;
      color: #333;
    }

    .goals-form {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      max-width: 900px;
    }

    .goal-card {
      background: white;
      border-radius: 16px;
      padding: 25px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    }

    .goal-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 20px;
    }

    .goal-icon { font-size: 1.8rem; }
    .goal-header h3 { margin: 0; color: #444; }

    input {
      width: 100%;
      padding: 14px;
      border: 2px solid #e8e8e8;
      border-radius: 10px;
      font-size: 1.2rem;
      font-weight: 600;
      text-align: center;
      transition: border-color 0.3s;
      box-sizing: border-box;
    }

    input:focus {
      outline: none;
      border-color: #667eea;
    }

    .goal-hint {
      display: block;
      text-align: center;
      margin-top: 10px;
      font-size: 0.8rem;
      color: #999;
    }

    .btn-save {
      grid-column: 1 / -1;
      padding: 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s;
      max-width: 300px;
      justify-self: center;
      width: 100%;
    }

    .btn-save:hover:not(:disabled) {
      transform: translateY(-2px);
    }

    .success-message {
      grid-column: 1 / -1;
      text-align: center;
      padding: 15px;
      background: #d4edda;
      border-radius: 10px;
      color: #155724;
      font-weight: 500;
    }
  `],
})
export class GoalsComponent implements OnInit {
  goals = {
    daily_steps_goal: 10000,
    daily_calories_goal: 2000,
    daily_sleep_goal: 8,
    daily_water_goal: 2000,
  };

  isSaving = false;
  successMessage = '';

  constructor(private healthService: HealthService) {}

  ngOnInit() {
    this.healthService.getGoals().subscribe({
      next: (data) => {
        this.goals = {
          daily_steps_goal: data.daily_steps_goal,
          daily_calories_goal: data.daily_calories_goal,
          daily_sleep_goal: data.daily_sleep_goal,
          daily_water_goal: data.daily_water_goal,
        };
      },
    });
  }

  saveGoals() {
    this.isSaving = true;
    this.successMessage = '';

    this.healthService.saveGoals(this.goals).subscribe({
      next: () => {
        this.successMessage = 'Goals saved!';
        this.isSaving = false;
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: () => {
        this.isSaving = false;
      },
    });
  }
}
