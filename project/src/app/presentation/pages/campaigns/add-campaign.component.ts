import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CampaignService } from '../../../application/services/campaign.service';
import { CreateCampaignRequest } from '../../../shared/models/campaign.model';

@Component({
  selector: 'app-add-campaign',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="add-campaign-container">
      <div class="add-campaign-content fade-in">
        <div class="add-header">
          <button class="back-button" (click)="goBack()">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.42-1.41L7.83 13H20v-2z"/>
            </svg>
          </button>
          <h1 class="add-title">Create New Campaign</h1>
        </div>

        <div class="add-form-card">
          <form (ngSubmit)="onSubmit()" #campaignForm="ngForm">
            <div class="form-group">
              <label for="name">Campaign Name *</label>
              <input 
                type="text" 
                id="name"
                class="form-input" 
                [(ngModel)]="campaignRequest.name"
                name="name"
                placeholder="e.g., Bovine Brucellosis Campaign"
                required>
            </div>

            <div class="form-group">
              <label for="description">Description *</label>
              <textarea 
                id="description"
                class="form-input textarea" 
                [(ngModel)]="campaignRequest.description"
                name="description"
                placeholder="Describe the campaign objectives and procedures"
                rows="4"
                required></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="startDate">Start Date *</label>
                <input 
                  type="date" 
                  id="startDate"
                  class="form-input" 
                  [(ngModel)]="startDateString"
                  name="startDate"
                  required>
              </div>

              <div class="form-group">
                <label for="endDate">End Date *</label>
                <input 
                  type="date" 
                  id="endDate"
                  class="form-input" 
                  [(ngModel)]="endDateString"
                  name="endDate"
                  [min]="startDateString"
                  required>
              </div>
            </div>

            <div class="form-group">
              <label for="vaccineType">Vaccine/Treatment Type</label>
              <input 
                type="text" 
                id="vaccineType"
                class="form-input" 
                [(ngModel)]="campaignRequest.vaccineType"
                name="vaccineType"
                placeholder="e.g., Brucellosis Vaccine, FMD Vaccine">
            </div>

            <div class="form-group">
              <label for="targetAnimals">Target Animals</label>
              <div class="checkbox-group">
                <label class="checkbox-item" *ngFor="let animal of availableAnimals">
                  <input 
                    type="checkbox" 
                    [value]="animal"
                    (change)="onAnimalSelectionChange($event)"
                    [checked]="isAnimalSelected(animal)">
                  <span class="checkbox-label">{{ animal }}</span>
                </label>
              </div>
              <small class="form-hint">Select the types of animals this campaign targets</small>
            </div>

            <div class="form-actions">
              <button 
                type="button" 
                class="btn btn-secondary" 
                (click)="goBack()"
                [disabled]="loading">
                Cancel
              </button>
              <button 
                type="submit" 
                class="btn btn-primary"
                [disabled]="loading || campaignForm.invalid || !isFormValid()">
                <span *ngIf="loading">Creating...</span>
                <span *ngIf="!loading">Create Campaign</span>
              </button>
            </div>
          </form>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .add-campaign-container {
      min-height: 100vh;
      background: var(--light-gray);
      padding: 20px;
    }

    .add-campaign-content {
      max-width: 700px;
      margin: 0 auto;
    }

    .add-header {
      display: flex;
      align-items: center;
      margin-bottom: 30px;
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
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .back-button:hover {
      transform: translateX(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .add-title {
      color: var(--dark-green);
      font-size: 28px;
      font-weight: bold;
      margin: 0;
    }

    .add-form-card {
      background: var(--white);
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }

    .form-group {
      margin-bottom: 25px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      color: var(--text-dark);
      margin-bottom: 8px;
    }

    .form-input {
      width: 100%;
      padding: 16px 20px;
      border: 2px solid #e0e0e0;
      border-radius: var(--border-radius);
      background-color: var(--white);
      font-size: 16px;
      color: var(--text-dark);
      transition: var(--transition);
    }

    .form-input:focus {
      outline: none;
      border-color: var(--dark-green);
      transform: translateY(-1px);
    }

    .textarea {
      resize: vertical;
      min-height: 100px;
      font-family: inherit;
    }

    .checkbox-group {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px;
      margin-top: 10px;
    }

    .checkbox-item {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding: 8px;
      border-radius: 8px;
      transition: var(--transition);
    }

    .checkbox-item:hover {
      background: var(--light-beige);
    }

    .checkbox-item input[type="checkbox"] {
      margin: 0;
      width: 18px;
      height: 18px;
      cursor: pointer;
    }

    .checkbox-label {
      font-size: 14px;
      color: var(--text-dark);
      text-transform: capitalize;
    }

    .form-hint {
      font-size: 12px;
      color: #666;
      margin-top: 5px;
      display: block;
    }

    .form-actions {
      display: flex;
      gap: 15px;
      margin-top: 40px;
      justify-content: flex-end;
    }

    .btn {
      padding: 16px 32px;
      font-size: 16px;
      font-weight: 600;
      min-width: 140px;
      border: none;
      border-radius: var(--border-radius);
      cursor: pointer;
      transition: var(--transition);
    }

    .btn-primary {
      background: var(--dark-green);
      color: var(--white);
    }

    .btn-primary:hover:not(:disabled) {
      background: #024a1c;
      transform: translateY(-2px);
    }

    .btn-secondary {
      background: var(--light-beige);
      color: var(--dark-green);
    }

    .btn-secondary:hover:not(:disabled) {
      background: #f0d99b;
      transform: translateY(-2px);
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .error-message {
      background: #ffebee;
      color: #c62828;
      padding: 16px;
      border-radius: var(--border-radius);
      margin-top: 20px;
      text-align: center;
      font-size: 14px;
    }

    @media (max-width: 600px) {
      .add-campaign-container {
        padding: 15px;
      }
      
      .add-form-card {
        padding: 25px;
      }
      
      .form-row {
        grid-template-columns: 1fr;
        gap: 0;
      }
      
      .checkbox-group {
        grid-template-columns: 1fr;
      }
      
      .form-actions {
        flex-direction: column;
      }
      
      .btn {
        width: 100%;
      }
    }
  `]
})
export class AddCampaignComponent {
  campaignRequest: CreateCampaignRequest = {
    name: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    targetAnimals: [],
    vaccineType: ''
  };

  startDateString = '';
  endDateString = '';
  loading = false;
  errorMessage = '';

  availableAnimals = ['cattle', 'bovine', 'livestock', 'sheep', 'goats', 'pigs', 'horses'];

  constructor(
    private campaignService: CampaignService,
    private router: Router
  ) {}

  onAnimalSelectionChange(event: any): void {
    const animal = event.target.value;
    const isChecked = event.target.checked;

    if (!this.campaignRequest.targetAnimals) {
      this.campaignRequest.targetAnimals = [];
    }

    if (isChecked) {
      if (!this.campaignRequest.targetAnimals.includes(animal)) {
        this.campaignRequest.targetAnimals.push(animal);
      }
    } else {
      const index = this.campaignRequest.targetAnimals.indexOf(animal);
      if (index > -1) {
        this.campaignRequest.targetAnimals.splice(index, 1);
      }
    }
  }

  isAnimalSelected(animal: string): boolean {
    return this.campaignRequest.targetAnimals?.includes(animal) || false;
  }

  isFormValid(): boolean {
    return this.startDateString !== '' && this.endDateString !== '';
  }

  onSubmit(): void {
    if (this.loading) return;

    // Validate dates
    if (!this.startDateString || !this.endDateString) {
      this.errorMessage = 'Please select both start and end dates.';
      return;
    }

    const startDate = new Date(this.startDateString);
    const endDate = new Date(this.endDateString);

    if (endDate <= startDate) {
      this.errorMessage = 'End date must be after start date.';
      return;
    }

    // Convert date strings to Date objects
    this.campaignRequest.startDate = startDate;
    this.campaignRequest.endDate = endDate;

    this.loading = true;
    this.errorMessage = '';

    this.campaignService.createCampaign(this.campaignRequest).subscribe({
      next: (campaign) => {
        this.loading = false;
        this.router.navigate(['/campaigns', campaign.id]);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.message || 'Failed to create campaign. Please try again.';
        console.error('Error creating campaign:', error);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/campaigns']);
  }
}