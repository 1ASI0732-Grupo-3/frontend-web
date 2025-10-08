import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CampaignService } from '@services/campaign.service';
import { Campaign, CampaignStatus } from '@shared/models/campaign.model';

@Component({
  selector: 'app-campaign-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="campaign-detail-container">
      <div class="campaign-detail-content fade-in" *ngIf="campaign && !loading">
        <div class="detail-header">
          <button class="back-button" (click)="goBack()">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.42-1.41L7.83 13H20v-2z"/>
            </svg>
          </button>
        </div>

        <div class="campaign-card">
          <div class="campaign-header">
            <h1 class="campaign-name">{{ campaign.name }}</h1>
            <div class="campaign-status" [class]="'status-' + campaign.status">
              {{ getStatusLabel(campaign.status) }}
            </div>
          </div>

          <div class="campaign-details">
            <div class="detail-section">
              <h3>Campaign Information</h3>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="detail-label">Description</span>
                  <span class="detail-value">{{ campaign.description }}</span>
                </div>
                
                <div class="detail-item">
                  <span class="detail-label">Start Date</span>
                  <span class="detail-value">{{ formatDate(campaign.startDate) }}</span>
                </div>
                
                <div class="detail-item">
                  <span class="detail-label">End Date</span>
                  <span class="detail-value">{{ formatDate(campaign.endDate) }}</span>
                </div>
                
                <div class="detail-item">
                  <span class="detail-label">Duration</span>
                  <span class="detail-value">{{ calculateDuration() }} days</span>
                </div>
              </div>
            </div>

            <div class="detail-section" *ngIf="campaign.vaccineType">
              <h3>Vaccination Details</h3>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="detail-label">Vaccine Type</span>
                  <span class="detail-value">{{ campaign.vaccineType }}</span>
                </div>
                
                <div class="detail-item" *ngIf="campaign.targetAnimals">
                  <span class="detail-label">Target Animals</span>
                  <span class="detail-value">{{ campaign.targetAnimals.join(', ') }}</span>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h3>Timeline</h3>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="detail-label">Created</span>
                  <span class="detail-value">{{ formatDate(campaign.createdAt) }}</span>
                </div>
                
                <div class="detail-item">
                  <span class="detail-label">Last Updated</span>
                  <span class="detail-value">{{ formatDate(campaign.updatedAt) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="campaign-actions">
            <button class="btn btn-secondary" (click)="goBack()">
              Back to Campaigns
            </button>
            <button class="btn btn-primary" (click)="editCampaign()" *ngIf="canEdit()">
              Edit Campaign
            </button>
          </div>
        </div>
      </div>

      <div class="loading-state" *ngIf="loading">
        <div class="loading-spinner"></div>
        <p>Loading campaign details...</p>
      </div>

      <div class="error-state" *ngIf="error">
        <p>{{ error }}</p>
        <button class="btn btn-primary" (click)="goBack()">Go Back</button>
      </div>
    </div>
  `,
  styles: [`
    .campaign-detail-container {
      min-height: 100vh;
      background: var(--light-gray);
      padding: 20px;
    }

    .campaign-detail-content {
      max-width: 800px;
      margin: 0 auto;
    }

    .detail-header {
      margin-bottom: 20px;
      padding-top: 20px;
    }

    .back-button {
      background: var(--white);
      border: none;
      border-radius: 12px;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: var(--transition);
      color: var(--dark-green);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .back-button:hover {
      transform: translateX(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .campaign-card {
      background: var(--white);
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }

    .campaign-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid var(--light-beige);
    }

    .campaign-name {
      font-size: 32px;
      font-weight: bold;
      color: var(--text-dark);
      margin: 0;
      flex: 1;
      margin-right: 20px;
    }

    .campaign-status {
      font-size: 14px;
      font-weight: 600;
      padding: 8px 16px;
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

    .campaign-details {
      margin-bottom: 40px;
    }

    .detail-section {
      margin-bottom: 30px;
    }

    .detail-section h3 {
      font-size: 20px;
      font-weight: bold;
      color: var(--dark-green);
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #e0e0e0;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .detail-label {
      font-size: 14px;
      color: #666;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .detail-value {
      font-size: 16px;
      color: var(--text-dark);
      font-weight: 500;
    }

    .campaign-actions {
      display: flex;
      gap: 15px;
      justify-content: flex-end;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
    }

    .btn {
      padding: 12px 24px;
      font-size: 16px;
      font-weight: 600;
      border-radius: var(--border-radius);
      border: none;
      cursor: pointer;
      transition: var(--transition);
    }

    .btn-primary {
      background: var(--dark-green);
      color: var(--white);
    }

    .btn-primary:hover {
      background: #024a1c;
      transform: translateY(-2px);
    }

    .btn-secondary {
      background: var(--light-beige);
      color: var(--dark-green);
    }

    .btn-secondary:hover {
      background: #f0d99b;
      transform: translateY(-2px);
    }

    .loading-state {
      text-align: center;
      padding: 80px 20px;
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
      padding: 80px 20px;
      color: #666;
    }

    @media (max-width: 768px) {
      .campaign-detail-container {
        padding: 15px;
      }
      
      .campaign-card {
        padding: 25px;
      }
      
      .campaign-name {
        font-size: 24px;
      }
      
      .campaign-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
      }
      
      .detail-grid {
        grid-template-columns: 1fr;
      }
      
      .campaign-actions {
        flex-direction: column;
      }
    }
  `]
})
export class CampaignDetailComponent implements OnInit {
  campaign: Campaign | null = null;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private campaignService: CampaignService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const campaignId = params['id'];
      if (campaignId) {
        this.loadCampaignDetails(campaignId);
      }
    });
  }

  loadCampaignDetails(id: string): void {
    this.loading = true;
    this.error = '';
    
    const campaignId = parseInt(id, 10);
    this.campaignService.getCampaignById(campaignId).subscribe({
      next: (campaign) => {
        this.campaign = campaign;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load campaign details. Please try again.';
        this.loading = false;
        console.error('Error loading campaign details:', error);
      }
    });
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  calculateDuration(): number {
    if (!this.campaign) return 0;
    
    const start = new Date(this.campaign.startDate);
    const end = new Date(this.campaign.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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

  canEdit(): boolean {
    return this.campaign?.status !== CampaignStatus.COMPLETED;
  }

  editCampaign(): void {
    if (this.campaign) {
      this.router.navigate(['/campaigns', this.campaign.id, 'edit']);
    }
  }

  goBack(): void {
    this.router.navigate(['/campaigns']);
  }
}