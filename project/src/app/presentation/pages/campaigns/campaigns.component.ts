import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CampaignService } from '../../../application/services/campaign.service';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { Campaign, CampaignStatus } from '../../../shared/models/campaign.model';

@Component({
  selector: 'app-campaigns',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  template: `
    <div class="campaigns-container">
      <app-sidebar [isOpen]="sidebarOpen" (sidebarToggle)="toggleSidebar($event)"></app-sidebar>
      
      <div class="main-content">
        <header class="campaigns-header">
          <button class="menu-button" (click)="toggleSidebar(true)" [class.hidden-desktop]="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>
          </button>
          <div class="header-title">My Campaigns</div>
        </header>

        <div class="campaigns-content fade-in">
          <div class="loading-state" *ngIf="loading">
            <div class="loading-spinner"></div>
            <p>Loading campaigns...</p>
          </div>

          <div class="error-state" *ngIf="error">
            <p>{{ error }}</p>
            <button class="btn btn-primary" (click)="loadCampaigns()">Try Again</button>
          </div>

          <div class="campaigns-list" *ngIf="!loading && !error && campaigns.length > 0">
            <div class="campaign-card" 
                 *ngFor="let campaign of campaigns" 
                 (click)="viewCampaignDetails(campaign.id)"
                 [class.completed]="campaign.status === 'completed'"
                 [class.scheduled]="campaign.status === 'scheduled'">
              
              <div class="campaign-header">
                <h3 class="campaign-name">{{ campaign.name }}</h3>
                <div class="campaign-status" [class]="'status-' + campaign.status">
                  {{ getStatusLabel(campaign.status) }}
                </div>
              </div>
              
              <div class="campaign-info">
                <div class="info-item">
                  <span class="info-label">Description:</span>
                  <span class="info-value">{{ campaign.description }}</span>
                </div>
                
                <div class="info-item">
                  <span class="info-label">Date:</span>
                  <span class="info-value">{{ formatDate(campaign.startDate) }}</span>
                </div>
                
                <div class="info-item">
                  <span class="info-label">End Date:</span>
                  <span class="info-value">{{ formatDate(campaign.endDate) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="empty-state" *ngIf="!loading && !error && campaigns.length === 0">
            <div class="empty-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" opacity="0.5">
                <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M17,17H7V15H17V17M17,13H7V11H17V13M17,9H7V7H17V9Z"/>
              </svg>
            </div>
            <h3>No campaigns found</h3>
            <p>Start by creating your first campaign</p>
          </div>

          <button class="fab" (click)="addCampaign()" *ngIf="!loading">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .campaigns-container {
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

    .campaigns-header {
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

    .campaigns-content {
      flex: 1;
      padding: 30px 20px;
      max-width: 800px;
      margin: 0 auto;
      width: 100%;
      position: relative;
    }

    .campaigns-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .campaign-card {
      background: var(--light-beige);
      border-radius: var(--border-radius);
      padding: 24px;
      transition: var(--transition);
      cursor: pointer;
      position: relative;
      border-left: 4px solid var(--dark-green);
    }

    .campaign-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
    }

    .campaign-card.completed {
      border-left-color: #28a745;
      opacity: 0.85;
    }

    .campaign-card.scheduled {
      border-left-color: #ffc107;
    }

    .campaign-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
    }

    .campaign-name {
      font-size: 22px;
      font-weight: bold;
      color: var(--text-dark);
      margin: 0;
      flex: 1;
      margin-right: 15px;
    }

    .campaign-status {
      font-size: 12px;
      font-weight: 600;
      padding: 4px 12px;
      border-radius: 20px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .status-active {
      background: #d4edda;
      color: #155724;
    }

    .status-completed {
      background: #d1ecf1;
      color: #0c5460;
    }

    .status-scheduled {
      background: #fff3cd;
      color: #856404;
    }

    .status-cancelled {
      background: #f8d7da;
      color: #721c24;
    }

    .campaign-info {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .info-item {
      display: flex;
      gap: 10px;
    }

    .info-label {
      font-size: 16px;
      color: var(--text-dark);
      font-weight: 600;
      min-width: 90px;
    }

    .info-value {
      font-size: 16px;
      color: var(--text-dark);
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
      z-index: 50;
    }

    .fab:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 24px rgba(0, 0, 0, 0.2);
    }

    .loading-state {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid var(--dark-green);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .error-state {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .empty-icon {
      margin-bottom: 20px;
    }

    .empty-state h3 {
      color: var(--text-dark);
      margin-bottom: 10px;
    }

    @media (max-width: 768px) {
      .campaigns-content {
        padding: 20px 15px;
      }
      
      .campaign-card {
        padding: 20px;
      }
      
      .campaign-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }
      
      .info-item {
        flex-direction: column;
        gap: 2px;
      }
      
      .info-label {
        min-width: auto;
        font-size: 14px;
      }
    }

    @media (min-width: 1024px) {
      .hidden-desktop {
        display: none !important;
      }
      
      .campaigns-header {
        background: var(--light-gray);
        color: var(--dark-green);
        padding: 20px;
      }
    }
  `]
})
export class CampaignsComponent implements OnInit {
  campaigns: Campaign[] = [];
  loading = false;
  error = '';
  sidebarOpen = false;

  constructor(
    private campaignService: CampaignService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCampaigns();
  }

  loadCampaigns(): void {
    this.loading = true;
    this.error = '';
    
    this.campaignService.getCampaigns().subscribe({
      next: (campaigns) => {
        this.campaigns = campaigns;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load campaigns. Please try again.';
        this.loading = false;
        console.error('Error loading campaigns:', error);
      }
    });
  }

  viewCampaignDetails(campaignId: number): void {
    this.router.navigate(['/campaigns', campaignId]);
  }

  addCampaign(): void {
    this.router.navigate(['/campaigns/new']);
  }

  toggleSidebar(open: boolean): void {
    this.sidebarOpen = open;
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  getStatusLabel(status: CampaignStatus): string {
    switch (status) {
      case CampaignStatus.ACTIVE:
        return 'Active';
      case CampaignStatus.COMPLETED:
        return 'Completed';
      case CampaignStatus.SCHEDULED:
        return 'Scheduled';
      case CampaignStatus.CANCELLED:
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  }
}