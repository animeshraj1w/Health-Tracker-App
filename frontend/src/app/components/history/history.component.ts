import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HealthService } from '../../services/health.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="history-page">
      <h1>📅 Health History</h1>

      <div class="entries-list" *ngIf="entries.length > 0">
        <div class="entry-card" *ngFor="let entry of entries">
          <div class="entry-header">
            <span class="entry-date">{{ entry.date | date:'EEE, MMM d, y' }}</span>
            <span class="entry-mood" *ngIf="entry.mood">{{ getMoodEmoji(entry.mood) }}</span>
          </div>

          <div class="entry-stats">
            <div class="entry-stat">
              <span class="stat-icon">🚶</span>
              <span class="stat-value">{{ entry.steps | number }}</span>
              <span class="stat-unit">steps</span>
            </div>
            <div class="entry-stat">
              <span class="stat-icon">🔥</span>
              <span class="stat-value">{{ entry.calories | number:'1.0-0' }}</span>
              <span class="stat-unit">cal</span>
            </div>
            <div class="entry-stat">
              <span class="stat-icon">😴</span>
              <span class="stat-value">{{ entry.sleep_hours }}</span>
              <span class="stat-unit">hrs</span>
            </div>
            <div class="entry-stat">
              <span class="stat-icon">💧</span>
              <span class="stat-value">{{ entry.water_intake_ml }}</span>
              <span class="stat-unit">ml</span>
            </div>
          </div>

          <div class="entry-notes" *ngIf="entry.notes">
            📝 {{ entry.notes }}
          </div>

          <button class="btn-delete" (click)="deleteEntry(entry.id)">🗑️</button>
        </div>
      </div>

      <div class="empty-state" *ngIf="entries.length === 0 && !isLoading">
        <p>📭 No entries yet. Start tracking your health!</p>
      </div>

      <div class="loading" *ngIf="isLoading">
        <div class="spinner"></div>
      </div>
    </div>
  `,
  styles: [`
    .history-page h1 {
      font-size: 2rem;
      margin-bottom: 30px;
      color: #333;
    }

    .entries-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .entry-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.06);
      position: relative;
      transition: transform 0.2s;
    }

    .entry-card:hover {
      transform: translateY(-2px);
    }

    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .entry-date {
      font-weight: 600;
      color: #444;
    }

    .entry-mood {
      font-size: 1.5rem;
    }

    .entry-stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
      text-align: center;
    }

    .entry-stat {
      padding: 10px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .stat-icon { font-size: 1.2rem; display: block; }
    .stat-value { font-size: 1.1rem; font-weight: bold; color: #333; display: block; }
    .stat-unit { font-size: 0.75rem; color: #888; }

    .entry-notes {
      margin-top: 12px;
      padding: 10px;
      background: #f8f9fa;
      border-radius: 8px;
      color: #666;
      font-size: 0.9rem;
    }

    .btn-delete {
      position: absolute;
      top: 15px;
      right: 15px;
      background: none;
      border: none;
      cursor: pointer;
      opacity: 0.4;
      transition: opacity 0.2s;
      font-size: 1rem;
    }

    .btn-delete:hover {
      opacity: 1;
    }

    .empty-state {
      text-align: center;
      padding: 60px;
      color: #888;
      font-size: 1.1rem;
    }

    .loading {
      text-align: center;
      padding: 40px;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #e8e8e8;
      border-top-color: #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 600px) {
      .entry-stats {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `],
})
export class HistoryComponent implements OnInit {
  entries: any[] = [];
  isLoading = true;

  constructor(private healthService: HealthService) {}

  ngOnInit() {
    this.loadEntries();
  }

  loadEntries() {
    this.healthService.getEntries(0, 30).subscribe({
      next: (data) => {
        this.entries = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  deleteEntry(id: number) {
    if (confirm('Delete this entry?')) {
      this.healthService.deleteEntry(id).subscribe({
        next: () => {
          this.entries = this.entries.filter((e) => e.id !== id);
        },
      });
    }
  }

  getMoodEmoji(mood: string): string {
    const moods: Record<string, string> = {
      happy: '😊',
      neutral: '😐',
      tired: '😴',
      stressed: '😰',
      energetic: '⚡',
    };
    return moods[mood] || '😐';
  }
}
