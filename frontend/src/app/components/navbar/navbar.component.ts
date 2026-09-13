import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="nav-brand">
        <span class="logo">🏥</span>
        <span class="title">Health Tracker</span>
      </div>
      <div class="nav-links">
        <a routerLink="/dashboard" routerLinkActive="active">📊 Dashboard</a>
        <a routerLink="/add" routerLinkActive="active">➕ Add Entry</a>
        <a routerLink="/insights" routerLinkActive="active">🤖 AI Insights</a>
        <a routerLink="/history" routerLinkActive="active">📅 History</a>
        <a routerLink="/goals" routerLinkActive="active">🎯 Goals</a>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 30px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .nav-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 1.4rem;
      font-weight: bold;
    }

    .logo {
      font-size: 1.8rem;
    }

    .nav-links {
      display: flex;
      gap: 20px;
    }

    .nav-links a {
      color: rgba(255,255,255,0.85);
      text-decoration: none;
      padding: 8px 16px;
      border-radius: 8px;
      transition: all 0.3s;
      font-size: 0.95rem;
    }

    .nav-links a:hover {
      background: rgba(255,255,255,0.15);
      color: white;
    }

    .nav-links a.active {
      background: rgba(255,255,255,0.25);
      color: white;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .navbar {
        flex-direction: column;
        gap: 15px;
      }
      .nav-links {
        flex-wrap: wrap;
        justify-content: center;
      }
    }
  `],
})
export class NavbarComponent {}
