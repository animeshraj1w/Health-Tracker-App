import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HealthService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // ---- Health Entries ----

  getEntries(skip = 0, limit = 30): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/health/entries?skip=${skip}&limit=${limit}`);
  }

  getTodayEntry(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/health/entries/today`);
  }

  getEntry(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/health/entries/${id}`);
  }

  createEntry(entry: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/health/entries`, entry);
  }

  updateEntry(id: number, entry: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/health/entries/${id}`, entry);
  }

  deleteEntry(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/health/entries/${id}`);
  }

  // ---- Summary / Charts ----

  getSummary(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/health/summary`);
  }

  getChartData(days = 7): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/health/chart-data?days=${days}`);
  }

  // ---- Goals ----

  getGoals(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/health/goals`);
  }

  saveGoals(goals: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/health/goals`, goals);
  }

  // ---- AI Insights ----

  getAIInsights(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/ai/insights`);
  }

  getHealthScore(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/ai/health-score`);
  }

  getAIStatus(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/ai/status`);
  }
}
