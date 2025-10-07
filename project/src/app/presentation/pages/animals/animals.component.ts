import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AnimalService } from '../../../application/services/animal.service';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { Animal } from '../../../shared/models/animal.model';

@Component({
  selector: 'app-animals',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  template: `
    <div class="animals-container">
      <app-sidebar [isOpen]="sidebarOpen" (sidebarToggle)="toggleSidebar($event)"></app-sidebar>
      
      <div class="main-content">
        <header class="animals-header">
          <button class="menu-button" (click)="toggleSidebar(true)" [class.hidden-desktop]="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>
          </button>
          <div class="header-title">Animals</div>
        </header>

        <div class="animals-content fade-in">
          <div class="loading-state" *ngIf="loading">
            <div class="loading-spinner"></div>
            <p>Loading animals...</p>
          </div>

          <div class="error-state" *ngIf="error">
            <p>{{ error }}</p>
            <button class="btn btn-primary" (click)="loadAnimals()">Try Again</button>
          </div>

          <div class="animals-grid" *ngIf="!loading && !error && animals.length > 0">
            <div class="animal-card" 
                 *ngFor="let animal of animals" 
                 (click)="viewAnimalDetails(animal.id)">
              <div class="animal-image">
                <img [src]="animal.imageUrl" [alt]="animal.name" />
              </div>
              
              <div class="animal-info">
                <div class="animal-header">
                  <h3 class="animal-name">
                    {{ animal.name }}
                    <span class="gender-icon">
                      {{ animal.gender === 'female' ? '♀' : '♂' }}
                    </span>
                  </h3>
                  <div class="animal-campaign">
                    <span class="campaign-label">Campaña</span>
                    <span class="campaign-value">{{ animal.campaign }}</span>
                  </div>
                </div>
                
                <div class="animal-details">
                  <div class="detail-item">
                    <span class="detail-label">Peso</span>
                    <span class="detail-value">{{ animal.weight }} kg</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Edad</span>
                    <span class="detail-value">{{ animal.age }} años</span>
                  </div>
                </div>
              </div>
              
              <div class="card-info-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="empty-state" *ngIf="!loading && !error && animals.length === 0">
            <div class="empty-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" opacity="0.5">
                <path d="M4.5 12.5C5.5 10.5 7.5 9 10 9s4.5 1.5 5.5 3.5c0 2-2 4.5-5.5 4.5S4.5 14.5 4.5 12.5zM9 11a1 1 0 100 2 1 1 0 000-2zm2 0a1 1 0 100 2 1 1 0 000-2z"/>
              </svg>
            </div>
            <h3>No animals found</h3>
            <p>Start by adding your first animal</p>
          </div>

          <button class="fab" (click)="addAnimal()" *ngIf="!loading">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animals-container {
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

    .animals-header {
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

    .animals-content {
      flex: 1;
      padding: 30px 20px;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
      position: relative;
    }

    .animals-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
    }

    .animal-card {
      background: var(--light-beige);
      border-radius: var(--border-radius);
      overflow: hidden;
      transition: var(--transition);
      cursor: pointer;
      position: relative;
    }

    .animal-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    }

    .animal-image {
      width: 100%;
      height: 200px;
      overflow: hidden;
    }

    .animal-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: var(--transition);
    }

    .animal-card:hover .animal-image img {
      transform: scale(1.05);
    }

    .animal-info {
      padding: 20px;
    }

    .animal-header {
      margin-bottom: 15px;
    }

    .animal-name {
      font-size: 20px;
      font-weight: bold;
      color: var(--text-dark);
      margin: 0 0 8px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .gender-icon {
      font-size: 16px;
      color: var(--dark-green);
    }

    .animal-campaign {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .campaign-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      font-weight: 500;
    }

    .campaign-value {
      font-size: 14px;
      color: var(--dark-green);
      font-weight: 600;
    }

    .animal-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .detail-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      font-weight: 500;
    }

    .detail-value {
      font-size: 16px;
      color: var(--text-dark);
      font-weight: 600;
    }

    .card-info-icon {
      position: absolute;
      top: 15px;
      right: 15px;
      width: 32px;
      height: 32px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--dark-green);
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
      .animals-content {
        padding: 20px 15px;
      }
      
      .animals-grid {
        grid-template-columns: 1fr;
        gap: 15px;
      }
      
      .animal-card {
        max-width: none;
      }
    }

    @media (min-width: 1024px) {
      .hidden-desktop {
        display: none !important;
      }
      
      .animals-header {
        background: var(--light-gray);
        color: var(--dark-green);
        padding: 20px;
      }
    }
  `]
})
export class AnimalsComponent implements OnInit {
  animals: Animal[] = [];
  loading = false;
  error = '';
  sidebarOpen = false;

  constructor(
    private animalService: AnimalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAnimals();
  }

  loadAnimals(): void {
    this.loading = true;
    this.error = '';
    
    this.animalService.getAnimals().subscribe({
      next: (animals) => {
        this.animals = animals;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load animals. Please try again.';
        this.loading = false;
        console.error('Error loading animals:', error);
      }
    });
  }

  viewAnimalDetails(animalId: number): void {
    this.router.navigate(['/animals', animalId]);
  }

  addAnimal(): void {
    this.router.navigate(['/animals/new']);
  }

  toggleSidebar(open: boolean): void {
    this.sidebarOpen = open;
  }
}