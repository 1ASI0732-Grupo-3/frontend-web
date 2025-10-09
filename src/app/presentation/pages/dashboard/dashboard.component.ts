import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '@services/dashboard.service';
import { AuthService } from '@services/auth.service';
import { SidebarComponent } from '@components/sidebar/sidebar.component';
import { DashboardStats, UpcomingEvent } from '@shared/models/dashboard.model';
import { User } from '@shared/models/user.model';
import { ApiTestService } from '../../../infrastructure/services/api-test.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  template: `
    <div class="dashboard-container">
      <app-sidebar [isOpen]="sidebarOpen" (sidebarToggle)="toggleSidebar($event)"></app-sidebar>
      
      <div class="main-content">
        <header class="dashboard-header">
          <button class="menu-button" (click)="toggleSidebar(true)" [class.hidden-desktop]="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>
          </button>
          <div class="header-title">VacApp</div>
        </header>

        <div class="dashboard-content fade-in">
          <div class="welcome-section">
            <h1 class="welcome-title">
              Welcome<br>
              <span class="user-name" *ngIf="currentUser">{{ currentUser.name }}!</span>
            </h1>
            <!-- Temporary API Test Button -->
            <button 
              (click)="testApiConnectivity()" 
              style="margin-top: 20px; padding: 10px 20px; background: #ff6b6b; color: white; border: none; border-radius: 5px; cursor: pointer;">
              🔍 Test API Connectivity (Check Console)
            </button>
          </div>

          <div class="stats-grid" *ngIf="stats">
            <div class="stats-card main-stat">
              <div class="stats-label">Registered animals</div>
              <div class="stats-number">{{ stats.registeredAnimals }}</div>
            </div>

            <div class="stats-row">
              <div class="stats-card">
                <div class="stats-number">{{ stats.campaigns }}</div>
                <div class="stats-label">Campaigns</div>
              </div>
              
              <div class="stats-card">
                <div class="stats-number">{{ stats.employees }}</div>
                <div class="stats-label">Employees</div>
              </div>
            </div>

            <div class="stats-row">
              <div class="stats-card">
                <div class="stats-number">{{ stats.vaccinesAboutToExpire }}</div>
                <div class="stats-label">Vaccines about to expire</div>
              </div>
              
              <div class="stats-card">
                <div class="stats-number">{{ stats.activeCampaigns }}</div>
                <div class="stats-label">Campaigns</div>
              </div>
            </div>
          </div>

          <div class="events-section">
            <h2 class="section-title">Upcoming Events</h2>
            
            <div class="events-list" *ngIf="upcomingEvents.length > 0">
              <div class="event-item" *ngFor="let event of upcomingEvents">
                <div class="event-content">
                  <div class="event-title">{{ event.title }}</div>
                </div>
                <div class="event-date">{{ event.date }}</div>
              </div>
            </div>
          </div>

          <button class="fab">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      min-height: 100vh;
      background: var(--light-gray);
    }

    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .dashboard-header {
      background: var(--dark-green);
      color: var(--white);
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .menu-button {
      background: none;
      border: none;
      color: var(--white);
      cursor: pointer;
      padding: 8px;
      border-radius: 8px;
      transition: var(--transition);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .menu-button:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .header-title {
      font-size: 20px;
      font-weight: bold;
    }

    .dashboard-content {
      flex: 1;
      padding: 30px 20px;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
      position: relative;
    }

    .welcome-section {
      margin-bottom: 40px;
    }

    .welcome-title {
      font-size: 32px;
      font-weight: bold;
      color: var(--text-dark);
      line-height: 1.2;
    }

    .user-name {
      color: var(--dark-green);
    }

    .stats-grid {
      display: grid;
      gap: 20px;
      margin-bottom: 40px;
    }

    .main-stat {
      grid-column: 1 / -1;
      background: var(--light-beige);
      text-align: center;
      padding: 30px;
    }

    .main-stat .stats-label {
      font-size: 18px;
      color: var(--text-dark);
      margin-bottom: 10px;
    }

    .main-stat .stats-number {
      font-size: 48px;
      font-weight: bold;
      color: var(--dark-green);
    }

    .stats-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .stats-card {
      background: var(--light-beige);
      padding: 24px;
      border-radius: var(--border-radius);
      text-align: center;
      transition: var(--transition);
    }

    .stats-card:hover {
      background: #f0d99b;
      transform: translateY(-3px);
    }

    .stats-number {
      font-size: 36px;
      font-weight: bold;
      color: var(--dark-green);
      display: block;
    }

    .stats-label {
      font-size: 14px;
      color: #666;
      margin-top: 8px;
    }

    .events-section {
      background: var(--white);
      border-radius: var(--border-radius);
      padding: 24px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    }

    .section-title {
      font-size: 24px;
      font-weight: bold;
      color: var(--text-dark);
      margin-bottom: 20px;
    }

    .events-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .event-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
      border-bottom: 1px solid #eee;
    }

    .event-item:last-child {
      border-bottom: none;
    }

    .event-title {
      font-size: 16px;
      color: var(--text-dark);
    }

    .event-date {
      font-size: 14px;
      color: #666;
      font-weight: 500;
    }

    .fab {
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 56px;
      height: 56px;
      background: var(--dark-green);
      color: var(--white);
      border: none;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      transition: var(--transition);
    }

    .fab:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 24px rgba(0, 0, 0, 0.2);
    }

    @media (max-width: 768px) {
      .dashboard-content {
        padding: 20px 15px;
      }
      
      .welcome-title {
        font-size: 24px;
      }
      
      .stats-row {
        grid-template-columns: 1fr;
      }
      
      .main-stat .stats-number {
        font-size: 36px;
      }
    }

    @media (min-width: 1024px) {
      .hidden-desktop {
        display: none !important;
      }
      
      .dashboard-header {
        background: var(--light-gray);
        color: var(--dark-green);
        padding: 20px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  upcomingEvents: UpcomingEvent[] = [];
  currentUser: User | null = null;
  sidebarOpen = false;

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private apiTestService: ApiTestService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  loadDashboardData(): void {
    this.dashboardService.getStats().subscribe(stats => {
      this.stats = stats;
    });

    this.dashboardService.getUpcomingEvents().subscribe(events => {
      this.upcomingEvents = events;
    });
  }

  toggleSidebar(open: boolean): void {
    this.sidebarOpen = open;
  }

  testApiConnectivity(): void {
    console.log('Testing API connectivity...');
    this.apiTestService.testEndpoints();
  }
}