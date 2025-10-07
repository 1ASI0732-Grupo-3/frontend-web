import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnimalService } from '../../../application/services/animal.service';
import { CreateAnimalRequest } from '../../../shared/models/animal.model';

@Component({
  selector: 'app-add-animal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="add-animal-container">
      <div class="add-animal-content fade-in">
        <div class="add-header">
          <button class="back-button" (click)="goBack()">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.42-1.41L7.83 13H20v-2z"/>
            </svg>
          </button>
          <h1 class="add-title">Add New Animal</h1>
        </div>

        <div class="add-form-card">
          <form (ngSubmit)="onSubmit()" #animalForm="ngForm">
            <div class="form-group">
              <label for="name">Name *</label>
              <input 
                type="text" 
                id="name"
                class="form-input" 
                [(ngModel)]="animalRequest.name"
                name="name"
                required>
            </div>

            <div class="form-group">
              <label for="breed">Breed *</label>
              <input 
                type="text" 
                id="breed"
                class="form-input" 
                [(ngModel)]="animalRequest.breed"
                name="breed"
                required>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="weight">Weight (kg) *</label>
                <input 
                  type="number" 
                  id="weight"
                  class="form-input" 
                  [(ngModel)]="animalRequest.weight"
                  name="weight"
                  required
                  min="1">
              </div>

              <div class="form-group">
                <label for="gender">Gender *</label>
                <select 
                  id="gender"
                  class="form-input" 
                  [(ngModel)]="animalRequest.gender"
                  name="gender"
                  required>
                  <option value="">Select gender</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label for="birthdate">Birth Date *</label>
              <input 
                type="date" 
                id="birthdate"
                class="form-input" 
                [(ngModel)]="birthdateString"
                name="birthdate"
                required>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="barn">Barn *</label>
                <input 
                  type="text" 
                  id="barn"
                  class="form-input" 
                  [(ngModel)]="animalRequest.barn"
                  name="barn"
                  required>
              </div>

              <div class="form-group">
                <label for="location">Location *</label>
                <input 
                  type="text" 
                  id="location"
                  class="form-input" 
                  [(ngModel)]="animalRequest.location"
                  name="location"
                  required>
              </div>
            </div>

            <div class="form-group">
              <label for="campaign">Campaign *</label>
              <input 
                type="text" 
                id="campaign"
                class="form-input" 
                [(ngModel)]="animalRequest.campaign"
                name="campaign"
                required>
            </div>

            <div class="form-group">
              <label for="imageFile">Animal Photo *</label>
              <div class="file-input-container">
                <input 
                  type="file" 
                  id="imageFile"
                  class="file-input"
                  (change)="onFileSelected($event)"
                  accept="image/*"
                  #fileInput>
                <label for="imageFile" class="file-input-label">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                  </svg>
                  <span *ngIf="!selectedFileName">Choose Image</span>
                  <span *ngIf="selectedFileName">{{ selectedFileName }}</span>
                </label>
              </div>
              
              <div class="image-preview" *ngIf="imagePreview">
                <img [src]="imagePreview" alt="Preview" />
                <button type="button" class="remove-image" (click)="removeImage()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                  </svg>
                </button>
              </div>
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
                [disabled]="loading || animalForm.invalid || !selectedFile">
                <span *ngIf="loading">Adding...</span>
                <span *ngIf="!loading">Add Animal</span>
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
    .add-animal-container {
      min-height: 100vh;
      background: var(--light-gray);
      padding: 20px;
    }

    .add-animal-content {
      max-width: 600px;
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
      padding: 30px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }

    .form-group {
      margin-bottom: 20px;
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

    select.form-input {
      cursor: pointer;
    }

    .form-actions {
      display: flex;
      gap: 15px;
      margin-top: 30px;
      justify-content: flex-end;
    }

    .btn {
      padding: 14px 28px;
      font-size: 16px;
      font-weight: 600;
      min-width: 120px;
    }

    .file-input-container {
      position: relative;
    }

    .file-input {
      position: absolute;
      opacity: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }

    .file-input-label {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 16px 20px;
      border: 2px dashed #e0e0e0;
      border-radius: var(--border-radius);
      background-color: var(--light-gray);
      cursor: pointer;
      transition: var(--transition);
      color: #666;
      font-size: 16px;
    }

    .file-input-label:hover {
      border-color: var(--dark-green);
      background-color: #f0f0f0;
      color: var(--dark-green);
    }

    .image-preview {
      margin-top: 15px;
      position: relative;
      display: inline-block;
    }

    .image-preview img {
      width: 100%;
      max-width: 200px;
      height: 150px;
      object-fit: cover;
      border-radius: var(--border-radius);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .remove-image {
      position: absolute;
      top: -8px;
      right: -8px;
      background: #ff4757;
      color: white;
      border: none;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: var(--transition);
    }

    .remove-image:hover {
      background: #ff3742;
      transform: scale(1.1);
    }

    .error-message {
      background: #ffebee;
      color: #c62828;
      padding: 12px;
      border-radius: 8px;
      margin-top: 20px;
      text-align: center;
      font-size: 14px;
    }

    @media (max-width: 600px) {
      .add-animal-container {
        padding: 15px;
      }
      
      .add-form-card {
        padding: 20px;
      }
      
      .form-row {
        grid-template-columns: 1fr;
        gap: 0;
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
export class AddAnimalComponent {
  animalRequest: CreateAnimalRequest = {
    name: '',
    breed: '',
    weight: 0,
    birthdate: new Date(),
    barn: '',
    location: '',
    campaign: '',
    gender: 'female',
    imageUrl: ''
  };

  birthdateString = '';
  loading = false;
  errorMessage = '';
  selectedFileName = '';
  imagePreview: string | null = null;
  selectedFile: File | null = null;

  constructor(
    private animalService: AnimalService,
    private router: Router
  ) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.selectedFileName = file.name;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.selectedFileName = '';
    this.imagePreview = null;
    this.animalRequest.imageUrl = '';
    
    // Reset file input
    const fileInput = document.getElementById('imageFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  private convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async onSubmit(): Promise<void> {
    if (this.loading) return;

    // Validate that an image is selected
    if (!this.selectedFile) {
      this.errorMessage = 'Please select an image for the animal.';
      return;
    }

    // Convert date string to Date object
    if (this.birthdateString) {
      this.animalRequest.birthdate = new Date(this.birthdateString);
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      // Convert file to base64 for storage (in a real app, you'd upload to a server)
      const base64Image = await this.convertFileToBase64(this.selectedFile);
      this.animalRequest.imageUrl = base64Image;

      this.animalService.createAnimal(this.animalRequest).subscribe({
        next: (animal) => {
          this.loading = false;
          this.router.navigate(['/animals', animal.id]);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.message || 'Failed to add animal. Please try again.';
          console.error('Error creating animal:', error);
        }
      });
    } catch (error) {
      this.loading = false;
      this.errorMessage = 'Failed to process the image. Please try again.';
      console.error('Error processing image:', error);
    }
  }

  goBack(): void {
    this.router.navigate(['/animals']);
  }
}