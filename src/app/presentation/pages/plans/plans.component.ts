import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PlansService } from '@services/plans.service';
import { Plan } from '@shared/models/plan.model';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="plans-container">
      <div class="plans-content fade-in">
        <div class="plans-header">
          <button class="back-button" (click)="goBack()">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.42-1.41L7.83 13H20v-2z"/>
            </svg>
          </button>
          <h1 class="plans-title">Plans</h1>
        </div>

        <div class="plans-grid" *ngIf="plans.length > 0">
          <div class="plan-card" 
               *ngFor="let plan of plans" 
               [class.popular]="plan.isPopular">
            <div class="plan-header">
              <h2 class="plan-name">{{ plan.name }}</h2>
              <div class="plan-price">
                <span class="currency">{{ plan.currency }}</span>
                <span class="amount">{{ plan.price }}</span>
                <span class="period" *ngIf="plan.price > 0">/ mes</span>
              </div>
            </div>

            <div class="plan-features">
              <ul>
                <li *ngFor="let feature of plan.features">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--dark-green)">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  {{ feature }}
                </li>
              </ul>
            </div>

            <button 
              class="btn btn-primary plan-button"
              [class.btn-popular]="plan.isPopular"
              (click)="selectPlan(plan)"
              [disabled]="loading">
              <span *ngIf="loading && selectedPlanId === plan.id">Selecting...</span>
              <span *ngIf="!loading || selectedPlanId !== plan.id">Choose</span>
            </button>
          </div>
        </div>

        <div class="loading-state" *ngIf="plans.length === 0 && !error">
          Loading plans...
        </div>

        <div class="error-state" *ngIf="error">
          <p>{{ error }}</p>
          <button class="btn btn-secondary" (click)="loadPlans()">Try Again</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .plans-container {
      min-height: 100vh;
      background: linear-gradient(135deg, var(--dark-green) 0%, #064a32 100%);
      padding: 20px;
    }

    .plans-content {
      max-width: 800px;
      margin: 0 auto;
    }

    .plans-header {
      display: flex;
      align-items: center;
      margin-bottom: 40px;
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
      margin-right: 20px;
      transition: var(--transition);
      color: var(--dark-green);
    }

    .back-button:hover {
      transform: translateX(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .plans-title {
      color: var(--white);
      font-size: 32px;
      font-weight: bold;
      margin: 0;
    }

    .plans-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
    }

    .plan-card {
      background: var(--white);
      border-radius: 20px;
      padding: 30px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      transition: var(--transition);
      position: relative;
    }

    .plan-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
    }

    .plan-card.popular {
      border: 3px solid var(--primary-green);
      transform: scale(1.05);
    }

    .plan-card.popular:hover {
      transform: scale(1.05) translateY(-10px);
    }

    .plan-card.popular::before {
      content: 'Most Popular';
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--primary-green);
      color: var(--dark-green);
      padding: 6px 20px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
    }

    .plan-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .plan-name {
      font-size: 28px;
      font-weight: bold;
      color: var(--text-dark);
      margin-bottom: 10px;
    }

    .plan-price {
      display: flex;
      align-items: baseline;
      justify-content: center;
      gap: 4px;
    }

    .currency {
      font-size: 18px;
      color: var(--dark-green);
      font-weight: 600;
    }

    .amount {
      font-size: 48px;
      font-weight: bold;
      color: var(--dark-green);
    }

    .period {
      font-size: 16px;
      color: #666;
    }

    .plan-features {
      margin-bottom: 30px;
    }

    .plan-features ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .plan-features li {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 12px;
      font-size: 14px;
      line-height: 1.5;
      color: var(--text-dark);
    }

    .plan-features svg {
      flex-shrink: 0;
      margin-top: 2px;
    }

    .plan-button {
      width: 100%;
      padding: 16px;
      font-size: 18px;
      font-weight: bold;
    }

    .btn-popular {
      background: var(--primary-green);
      color: var(--dark-green);
    }

    .btn-popular:hover {
      background: #b8e639;
    }

    .loading-state,
    .error-state {
      text-align: center;
      color: var(--white);
      font-size: 18px;
      padding: 40px;
    }

    @media (max-width: 768px) {
      .plans-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }
      
      .plan-card.popular {
        transform: scale(1);
      }
      
      .plan-card.popular:hover {
        transform: translateY(-10px);
      }
    }
  `]
})
export class PlansComponent implements OnInit {
  plans: Plan[] = [];
  loading = false;
  error = '';
  selectedPlanId = '';

  constructor(
    private plansService: PlansService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans(): void {
    this.loading = true;
    this.error = '';
    
    this.plansService.getPlans().subscribe({
      next: (plans) => {
        this.plans = plans;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load plans. Please try again.';
        this.loading = false;
      }
    });
  }

  selectPlan(plan: Plan): void {
    if (this.loading) return;
    
    this.loading = true;
    this.selectedPlanId = plan.id;
    
    this.plansService.subscribeToPlan(plan.id).subscribe({
      next: (success) => {
        this.loading = false;
        this.selectedPlanId = '';
        if (success) {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        this.loading = false;
        this.selectedPlanId = '';
        console.error('Failed to subscribe to plan:', error);
      }
    });
  }

  goBack(): void {
    window.history.back();
  }
}