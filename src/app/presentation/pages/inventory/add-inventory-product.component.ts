import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '@services/inventory.service';
import { SidebarComponent } from '@components/sidebar/sidebar.component';
import { ProductCategory, CreateProductRequest } from '@shared/models/inventory.model';

@Component({
  selector: 'app-add-inventory-product',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  template: `
    <div class="add-product-container">
      <app-sidebar [isOpen]="sidebarOpen" (sidebarToggle)="toggleSidebar($event)"></app-sidebar>
      
      <div class="main-content">
        <header class="add-product-header">
          <button class="menu-button" (click)="toggleSidebar(true)" [class.hidden-desktop]="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>
          </button>
          <button class="back-button" (click)="goBack()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.42-1.41L7.83 13H20v-2z"/>
            </svg>
          </button>
          <div class="header-title">Add Product</div>
        </header>

        <div class="add-product-content fade-in">
          <div class="form-card">
            <form class="product-form" (ngSubmit)="onSubmit()" #productForm="ngForm">
              <div class="form-group">
                <label for="name" class="form-label">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  class="form-input"
                  [(ngModel)]="formData.name"
                  #nameInput="ngModel"
                  required
                  placeholder="Enter product name"
                  [class.error]="nameInput.touched && nameInput.invalid"
                />
                <div class="error-message" *ngIf="nameInput.touched && nameInput.invalid">
                  Product name is required
                </div>
              </div>

              <div class="form-group">
                <label for="category" class="form-label">Category</label>
                <select
                  id="category"
                  name="category"
                  class="form-select"
                  [(ngModel)]="formData.category"
                  #categoryInput="ngModel"
                  required
                  [class.error]="categoryInput.touched && categoryInput.invalid"
                >
                  <option value="">Select category</option>
                  <option *ngFor="let category of availableCategories" [value]="category">
                    {{ getCategoryDisplayName(category) }}
                  </option>
                </select>
                <div class="error-message" *ngIf="categoryInput.touched && categoryInput.invalid">
                  Please select a category
                </div>
              </div>

              <div class="form-group">
                <label for="stock" class="form-label">Stock</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  class="form-input"
                  [(ngModel)]="formData.stock"
                  #stockInput="ngModel"
                  required
                  min="0"
                  placeholder="Enter stock quantity"
                  [class.error]="stockInput.touched && stockInput.invalid"
                />
                <div class="error-message" *ngIf="stockInput.touched && stockInput.invalid">
                  <span *ngIf="stockInput.errors?.['required']">Stock quantity is required</span>
                  <span *ngIf="stockInput.errors?.['min']">Stock must be 0 or greater</span>
                </div>
              </div>

              <div class="form-group">
                <label for="expirationDate" class="form-label">Expiration date</label>
                <input
                  type="date"
                  id="expirationDate"
                  name="expirationDate"
                  class="form-input"
                  [(ngModel)]="formData.expirationDate"
                  #expirationInput="ngModel"
                  required
                  [min]="todayDate"
                  [class.error]="expirationInput.touched && expirationInput.invalid"
                />
                <div class="error-message" *ngIf="expirationInput.touched && expirationInput.invalid">
                  <span *ngIf="expirationInput.errors?.['required']">Expiration date is required</span>
                </div>
              </div>

              <div class="form-group">
                <label for="minStockLevel" class="form-label">Minimum stock level (optional)</label>
                <input
                  type="number"
                  id="minStockLevel"
                  name="minStockLevel"
                  class="form-input"
                  [(ngModel)]="formData.minStockLevel"
                  min="0"
                  placeholder="Enter minimum stock level"
                />
              </div>

              <!-- Form Actions -->
              <div class="form-actions">
                <button
                  type="button"
                  class="btn btn-secondary"
                  (click)="clearForm()"
                  [disabled]="submitting"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  class="btn btn-primary"
                  [disabled]="productForm.invalid || submitting"
                >
                  <div class="btn-content">
                    <div class="loading-spinner" *ngIf="submitting"></div>
                    <span>{{ submitting ? 'Adding...' : 'Add Product' }}</span>
                  </div>
                </button>
              </div>
            </form>

            <!-- Success Message -->
            <div class="success-message" *ngIf="successMessage">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              <span>{{ successMessage }}</span>
            </div>

            <!-- Error Message -->
            <div class="error-banner" *ngIf="errorMessage">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span>{{ errorMessage }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .add-product-container {
      display: flex;
      min-height: 100vh;
      min-height: 100dvh;
      background: var(--light-gray);
    }

    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      min-height: 100dvh;
      width: 0; /* Prevents flex item from growing beyond container */
    }

    .add-product-header {
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

    .menu-button, .back-button {
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

    .menu-button:hover, .back-button:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .header-title {
      font-size: 20px;
      font-weight: bold;
    }

    .add-product-content {
      flex: 1;
      padding: 30px 20px;
      max-width: 600px;
      margin: 0 auto;
      width: 100%;
    }

    .form-card {
      background: var(--light-beige);
      border-radius: var(--border-radius);
      padding: 32px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .product-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-label {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-dark);
      margin-bottom: 4px;
    }

    .form-input, .form-select {
      padding: 16px;
      border: 2px solid #e1e5e9;
      border-radius: 12px;
      font-size: 16px;
      color: var(--text-dark);
      background: var(--white);
      transition: var(--transition);
    }

    .form-input:focus, .form-select:focus {
      outline: none;
      border-color: var(--dark-green);
      box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
    }

    .form-input.error, .form-select.error {
      border-color: #f44336;
      box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1);
    }

    .form-input::placeholder {
      color: #999;
    }

    .error-message {
      color: #f44336;
      font-size: 14px;
      margin-top: 4px;
    }

    .form-actions {
      display: flex;
      gap: 16px;
      margin-top: 16px;
    }

    .btn {
      padding: 16px 32px;
      border: none;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition);
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 56px;
    }

    .btn:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }

    .btn-secondary {
      background: var(--white);
      color: var(--text-dark);
      border: 2px solid #e1e5e9;
      flex: 1;
    }

    .btn-secondary:hover:not(:disabled) {
      background: #f5f5f5;
    }

    .btn-primary {
      background: var(--dark-green);
      color: var(--white);
      flex: 2;
    }

    .btn-primary:hover:not(:disabled) {
      background: #1b5e20;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3);
    }

    .btn-content {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .loading-spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid var(--white);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .success-message {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: #e8f5e8;
      color: #2e7d32;
      border-radius: 12px;
      margin-top: 24px;
      font-weight: 500;
    }

    .error-banner {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: #ffebee;
      color: #c62828;
      border-radius: 12px;
      margin-top: 24px;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .add-product-content {
        padding: 20px 15px;
      }
      
      .form-card {
        padding: 24px;
      }
      
      .form-actions {
        flex-direction: column;
      }
    }

    @media (min-width: 1024px) {
      .hidden-desktop {
        display: none !important;
      }
      
      .add-product-header {
        background: var(--light-gray);
        color: var(--dark-green);
        padding: 20px;
      }
    }
  `]
})
export class AddInventoryProductComponent {
  formData: CreateProductRequest = {
    name: '',
    category: '' as ProductCategory,
    stock: 0,
    expirationDate: new Date(),
    minStockLevel: 10
  };

  availableCategories = Object.values(ProductCategory);
  todayDate: string;
  submitting = false;
  successMessage = '';
  errorMessage = '';
  sidebarOpen = false;

  constructor(
    private inventoryService: InventoryService,
    private router: Router
  ) {
    // Set minimum date to today
    const today = new Date();
    this.todayDate = today.toISOString().split('T')[0];
  }

  getCategoryDisplayName(category: ProductCategory): string {
    const names: { [key in ProductCategory]: string } = {
      [ProductCategory.MEDICINES]: 'Medicines',
      [ProductCategory.FOOD]: 'Food',
      [ProductCategory.VACCINES]: 'Vaccines',
      [ProductCategory.SUPPLEMENTS]: 'Supplements'
    };
    return names[category] || category;
  }

  onSubmit(): void {
    if (!this.formData.name || !this.formData.category || !this.formData.expirationDate) {
      return;
    }

    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Create product request
    const productRequest: CreateProductRequest = {
      name: this.formData.name,
      category: this.formData.category,
      stock: this.formData.stock,
      expirationDate: new Date(this.formData.expirationDate),
      minStockLevel: this.formData.minStockLevel || 10
    };

    this.inventoryService.createProduct(productRequest).subscribe({
      next: (product) => {
        this.submitting = false;
        this.successMessage = `Product "${product.name}" has been added successfully!`;
        
        // Clear form after success
        setTimeout(() => {
          this.clearForm();
          this.successMessage = '';
          this.router.navigate(['/inventory']);
        }, 2000);
      },
      error: (error) => {
        this.submitting = false;
        this.errorMessage = 'Failed to add product. Please try again.';
        console.error('Error adding product:', error);
      }
    });
  }

  clearForm(): void {
    this.formData = {
      name: '',
      category: '' as ProductCategory,
      stock: 0,
      expirationDate: new Date(),
      minStockLevel: 10
    };
    this.successMessage = '';
    this.errorMessage = '';
  }

  goBack(): void {
    this.router.navigate(['/inventory']);
  }

  toggleSidebar(open: boolean): void {
    this.sidebarOpen = open;
  }
}