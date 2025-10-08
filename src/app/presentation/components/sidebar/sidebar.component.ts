import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="sidebar-wrapper" [class.open]="isOpen">
      <div class="sidebar-overlay" (click)="closeSidebar()" *ngIf="isOpen"></div>
      
      <div class="sidebar" [class.open]="isOpen">
        <div class="sidebar-content">
          <div class="sidebar-header">
            <div class="logo-mini">
              <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
                <path d="M8 16C8 12 12 8 16 8H24C28 8 32 12 32 16V20C32 24 28 28 24 28H16C12 28 8 24 8 20V16Z" 
                      fill="currentColor" opacity="0.8"/>
                <circle cx="16" cy="18" r="2" fill="currentColor"/>
                <circle cx="24" cy="18" r="2" fill="currentColor"/>
                <path d="M14 12C14 10 12 8 10 8C8 8 6 10 6 12V14H14V12Z" fill="currentColor" opacity="0.6"/>
                <path d="M26 12C26 10 28 8 30 8C32 8 34 10 34 12V14H26V12Z" fill="currentColor" opacity="0.6"/>
              </svg>
            </div>
            <span class="logo-text">VacApp</span>
          </div>

          <nav class="sidebar-nav">
            <a routerLink="/dashboard" class="nav-item" routerLinkActive="active" (click)="navigate('/dashboard')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
              <span>Home</span>
            </a>
            
            <a routerLink="/animals" class="nav-item" routerLinkActive="active" (click)="navigate('/animals')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.5 12.5C5.5 10.5 7.5 9 10 9s4.5 1.5 5.5 3.5c0 2-2 4.5-5.5 4.5S4.5 14.5 4.5 12.5zM9 11a1 1 0 100 2 1 1 0 000-2zm2 0a1 1 0 100 2 1 1 0 000-2z"/>
                <path d="M2 7c0-1 .5-2 1.5-2.5S5.5 4 6.5 4.5 8 5.5 8 6.5 7.5 8 6.5 8.5 4.5 8 3.5 7.5 2 7 2 7zm20 0c0 1-.5 2-1.5 2.5S18.5 10 17.5 9.5 16 8.5 16 7.5 16.5 6 17.5 5.5 20.5 5 21.5 5.5 22 7 22 7z"/>
              </svg>
              <span>Animals</span>
            </a>
            
            <a routerLink="/campaigns" class="nav-item" routerLinkActive="active" (click)="navigate('/campaigns')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
              <span>Campaigns</span>
            </a>
            
            <a routerLink="/inventory" class="nav-item" routerLinkActive="active" (click)="navigate('/inventory')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM8 20H4v-4h4v4zm0-6H4v-4h4v4zm0-6H4V4h4v4zm6 12h-4v-4h4v4zm0-6h-4v-4h4v4zm0-6h-4V4h4v4zm6 12h-4v-4h4v4zm0-6h-4v-4h4v4zm0-6h-4V4h4v4z"/>
              </svg>
              <span>Inventory</span>
            </a>
          </nav>

          <div class="sidebar-footer">
            <a routerLink="/settings" class="nav-item" routerLinkActive="active" (click)="navigate('/settings')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
              </svg>
              <span>Settings</span>
            </a>
            
            <a href="#" class="nav-item logout" (click)="logout($event)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
              </svg>
              <span>Log out</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sidebar-wrapper {
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      height: 100dvh; /* Dynamic viewport height for mobile */
      width: 100%;
      z-index: 1000;
      pointer-events: none;
    }

    .sidebar-wrapper.open {
      pointer-events: all;
    }

    .sidebar-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1;
    }

    .sidebar {
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      height: 100dvh; /* Dynamic viewport height for mobile */
      width: 280px;
      background: var(--dark-green);
      color: var(--white);
      transform: translateX(-100%);
      transition: transform 0.3s ease;
      z-index: 2;
      overflow-y: auto; /* Allow scroll if content is too tall */
    }

    .sidebar.open {
      transform: translateX(0);
    }

    .sidebar-content {
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 20px 0;
    }

    .sidebar-header {
      padding: 0 24px 30px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-mini {
      color: var(--primary-green);
    }

    .logo-text {
      font-size: 20px;
      font-weight: bold;
      color: var(--primary-green);
    }

    .sidebar-nav {
      flex: 1;
      padding: 0 12px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 20px;
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      border-radius: 12px;
      margin-bottom: 8px;
      transition: var(--transition);
    }

    .nav-item:hover {
      background: rgba(255, 255, 255, 0.1);
      color: var(--white);
    }

    .nav-item.active {
      background: var(--primary-green);
      color: var(--dark-green);
    }

    .nav-item.logout {
      color: #ff6b6b;
    }

    .nav-item.logout:hover {
      background: rgba(255, 107, 107, 0.1);
      color: #ff5252;
    }

    .sidebar-footer {
      padding: 20px 12px 0;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    /* Desktop styles */
    @media (min-width: 1024px) {
      .sidebar-wrapper {
        position: sticky;
        top: 0;
        width: 280px;
        height: 100vh;
        height: 100dvh;
        flex-shrink: 0;
        pointer-events: all;
      }
      
      .sidebar-overlay {
        display: none;
      }

      .sidebar {
        position: sticky;
        top: 0;
        height: 100vh;
        height: 100dvh;
        transform: translateX(0);
        overflow-y: auto;
      }
    }
  `]
})
export class SidebarComponent {
  @Input() isOpen = false;
  @Output() sidebarToggle = new EventEmitter<boolean>();

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  navigate(path: string): void {
    this.router.navigate([path]);
    this.closeSidebar();
  }

  logout(event: Event): void {
    event.preventDefault();
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/auth/login']);
    });
  }

  closeSidebar(): void {
    this.sidebarToggle.emit(false);
  }
}