import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HealthService } from '../../services/health.service';

@Component({
  selector: 'app-add-entry',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="add-entry">
      <h1>➕ Log Today's Data</h1>

      <form class="entry-form" (ngSubmit)="onSubmit()">
        <!-- Steps -->
        <div class="form-group">
          <label>🚶 Steps</label>
          <input type="number" [(ngModel)]="entry.steps" name="steps"
                 placeholder="e.g. 8500" min="0">
        </div>

        <!-- Calories -->
        <div class="form-group">
          <label>🔥 Calories</label>
          <input type="number" [(ngModel)]="entry.calories" name="calories"
                 placeholder="e.g. 2100" min="0" step="50">
        </div>

        <!-- Sleep -->
        <div class="form-group">
          <label>😴 Sleep (hours)</label>
          <input type="number" [(ngModel)]="entry.sleep_hours" name="sleep_hours"
                 placeholder="e.g. 7.5" min="0" max="24" step="0.5">
        </div>

        <!-- Water -->
        <div class="form-group">
          <label>💧 Water Intake (ml)</label>
          <input type="number" [(ngModel)]="entry.water_intake_ml" name="water_intake_ml"
                 placeholder="e.g. 2000" min="0" step="100">
        </div>

        <!-- Weight -->
        <div class="form-group">
          <label>⚖️ Weight (kg) <span class="optional">optional</span></label>
          <input type="number" [(ngModel)]="entry.weight_kg" name="weight_kg"
                 placeholder="e.g. 70" min="0" step="0.1">
        </div>

        <!-- Mood -->
        <div class="form-group">
          <label>😊 Mood</label>
          <div class="mood-options">
            <button type="button" *ngFor="let mood of moods"
                    [class.selected]="entry.mood === mood.value"
                    (click)="entry.mood = mood.value">
              {{ mood.emoji }} {{ mood.label }}
            </button>
          </div>
        </div>

        <!-- Notes -->
        <div class="form-group">
          <label>📝 Notes <span class="optional">optional</span></label>
          <textarea [(ngModel)]="entry.notes" name="notes"
                    placeholder="How are you feeling today?" rows="3"></textarea>
        </div>

        <button type="submit" class="btn-submit" [disabled]="isSubmitting">
          {{ isSubmitting ? '💾 Saving...' : '💾 Save Entry' }}
        </button>

        <div class="success-message" *ngIf="successMessage">
          ✅ {{ successMessage }}
        </div>

        <div class="error-message" *ngIf="errorMessage">
          ❌ {{ errorMessage }}
        </div>
      </form>
    </div>
  `,
  styles: [`
    .add-entry h1 {
      font-size: 2rem;
      margin-bottom: 30px;
      color: #333;
    }

    .entry-form {
      background: white;
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.08);
      max-width: 600px;
    }

    .form-group {
      margin-bottom: 25px;
    }

    .form-group label {
      display: block;
      font-weight: 600;
      margin-bottom: 8px;
      color: #444;
      font-size: 1rem;
    }

    .optional {
      font-weight: 400;
      color: #999;
      font-size: 0.85rem;
    }

    input, textarea {
      width: 100%;
      padding: 14px 16px;
      border: 2px solid #e8e8e8;
      border-radius: 10px;
      font-size: 1rem;
      transition: border-color 0.3s;
      box-sizing: border-box;
    }

    input:focus, textarea:focus {
      outline: none;
      border-color: #667eea;
    }

    .mood-options {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .mood-options button {
      padding: 10px 16px;
      border: 2px solid #e8e8e8;
      border-radius: 10px;
      background: white;
      cursor: pointer;
      transition: all 0.3s;
      font-size: 0.9rem;
    }

    .mood-options button:hover {
      border-color: #667eea;
    }

    .mood-options button.selected {
      border-color: #667eea;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-submit {
      width: 100%;
      padding: 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s;
      margin-top: 10px;
    }

    .btn-submit:hover:not(:disabled) {
      transform: translateY(-2px);
    }

    .btn-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .success-message {
      margin-top: 20px;
      padding: 15px;
      background: #d4edda;
      border-radius: 10px;
      color: #155724;
      text-align: center;
      font-weight: 500;
    }

    .error-message {
      margin-top: 20px;
      padding: 15px;
      background: #f8d7da;
      border-radius: 10px;
      color: #721c24;
      text-align: center;
      font-weight: 500;
    }
  `],
})
export class AddEntryComponent implements OnInit {
  entry = {
    steps: 0,
    calories: 0,
    sleep_hours: 0,
    water_intake_ml: 0,
    weight_kg: null as number | null,
    mood: '',
    notes: '',
  };

  moods = [
    { value: 'happy', emoji: '😊', label: 'Happy' },
    { value: 'neutral', emoji: '😐', label: 'Neutral' },
    { value: 'tired', emoji: '😴', label: 'Tired' },
    { value: 'stressed', emoji: '😰', label: 'Stressed' },
    { value: 'energetic', emoji: '⚡', label: 'Energetic' },
  ];

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private healthService: HealthService,
    private router: Router,
  ) {}

  ngOnInit() {
    // Try to load today's existing entry
    this.healthService.getTodayEntry().subscribe({
      next: (data) => {
        this.entry = {
          steps: data.steps || 0,
          calories: data.calories || 0,
          sleep_hours: data.sleep_hours || 0,
          water_intake_ml: data.water_intake_ml || 0,
          weight_kg: data.weight_kg,
          mood: data.mood || '',
          notes: data.notes || '',
        };
      },
      error: () => {},
    });
  }

  onSubmit() {
    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.healthService.createEntry(this.entry).subscribe({
      next: () => {
        this.successMessage = 'Entry saved successfully!';
        this.isSubmitting = false;
        setTimeout(() => this.router.navigate(['/dashboard']), 1500);
      },
      error: (err) => {
        this.errorMessage = 'Failed to save. Please try again.';
        this.isSubmitting = false;
      },
    });
  }
}
