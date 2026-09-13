import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddEntryComponent } from './components/add-entry/add-entry.component';
import { InsightsComponent } from './components/insights/insights.component';
import { HistoryComponent } from './components/history/history.component';
import { GoalsComponent } from './components/goals/goals.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'add', component: AddEntryComponent },
  { path: 'insights', component: InsightsComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'goals', component: GoalsComponent },
];
