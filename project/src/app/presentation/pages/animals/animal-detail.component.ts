import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AnimalService } from '../../../application/services/animal.service';
import { Animal } from '../../../shared/models/animal.model';

@Component({
  selector: 'app-animal-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="animal-detail-container">
      <div class="animal-detail-content fade-in" *ngIf="animal && !loading">
        <div class="detail-header">
          <button class="back-button" (click)="goBack()">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.42-1.41L7.83 13H20v-2z"/>
            </svg>
          </button>
        </div>

        <div class="animal-card">
          <div class="animal-name-header">
            <h1 class="animal-name">
              {{ animal.name }}
              <span class="gender-icon">
                {{ animal.gender === 'female' ? '♀' : '♂' }}
              </span>
            </h1>
          </div>

          <div class="animal-image">
            <img [src]="animal.imageUrl" [alt]="animal.name" />
          </div>

          <div class="animal-details">
            <div class="detail-row">
              <div class="detail-item">
                <span class="detail-label">Breed</span>
                <span class="detail-value">{{ animal.breed }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Weight</span>
                <span class="detail-value">{{ animal.weight }} kg</span>
              </div>
            </div>

            <div class="detail-row">
              <div class="detail-item">
                <span class="detail-label">Age</span>
                <span class="detail-value">{{ animal.age }} años</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Birthdate</span>
                <span class="detail-value">{{ formatDate(animal.birthdate) }}</span>
              </div>
            </div>

            <div class="detail-row">
              <div class="detail-item">
                <span class="detail-label">Barn</span>
                <span class="detail-value">{{ animal.barn }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Location</span>
                <span class="detail-value">{{ animal.location }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="loading-state" *ngIf="loading">
        <div class="loading-spinner"></div>
        <p>Loading animal details...</p>
      </div>

      <div class="error-state" *ngIf="error">
        <p>{{ error }}</p>
        <button class="btn btn-primary" (click)="goBack()">Go Back</button>
      </div>
    </div>
  `,
  styles: [`
    .animal-detail-container {
      min-height: 100vh;
      background: var(--light-gray);
      padding: 20px;
    }

    .animal-detail-content {
      max-width: 500px;
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

    .animal-card {
      background: var(--light-beige);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }

    .animal-name-header {
      padding: 30px 30px 20px;
      text-align: center;
    }

    .animal-name {
      font-size: 32px;
      font-weight: bold;
      color: var(--text-dark);
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }

    .gender-icon {
      font-size: 24px;
      color: var(--dark-green);
    }

    .animal-image {
      width: 100%;
      height: 300px;
      overflow: hidden;
      margin-bottom: 30px;
    }

    .animal-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .animal-details {
      padding: 0 30px 30px;
    }

    .detail-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }

    .detail-row:last-child {
      margin-bottom: 0;
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
    }

    .detail-value {
      font-size: 18px;
      color: var(--text-dark);
      font-weight: 500;
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

    @media (max-width: 600px) {
      .animal-detail-container {
        padding: 15px;
      }
      
      .animal-name {
        font-size: 24px;
      }
      
      .animal-name-header {
        padding: 20px 20px 15px;
      }
      
      .animal-details {
        padding: 0 20px 20px;
      }
      
      .detail-row {
        grid-template-columns: 1fr;
        gap: 15px;
      }
      
      .animal-image {
        height: 250px;
        margin-bottom: 20px;
      }
    }
  `]
})
export class AnimalDetailComponent implements OnInit {
  animal: Animal | null = null;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private animalService: AnimalService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const animalId = params['id'];
      if (animalId) {
        this.loadAnimalDetails(animalId);
      }
    });
  }

  loadAnimalDetails(id: string): void {
    this.loading = true;
    this.error = '';
    
    const animalId = parseInt(id, 10);
    this.animalService.getAnimalById(animalId).subscribe({
      next: (animal) => {
        this.animal = animal;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load animal details. Please try again.';
        this.loading = false;
        console.error('Error loading animal details:', error);
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

  goBack(): void {
    this.router.navigate(['/animals']);
  }
}