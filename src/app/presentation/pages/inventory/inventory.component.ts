import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InventoryService } from '@services/inventory.service';
import { SidebarComponent } from '@components/sidebar/sidebar.component';
import { 
  InventoryStats, 
  LowStockProduct, 
  ExpiringProduct 
} from '@shared/models/inventory.model';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  template: `
    <div class="inventory-container">
      <app-sidebar [isOpen]="sidebarOpen" (sidebarToggle)="toggleSidebar($event)"></app-sidebar>
      
      <div class="main-content">
        <header class="inventory-header">
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
          <div class="header-title">Inventory</div>
        </header>

        <div class="inventory-content fade-in">
          <div class="loading-state" *ngIf="loading">
            <div class="loading-spinner"></div>
            <p>Loading inventory data...</p>
          </div>

          <div class="error-state" *ngIf="error">
            <p>{{ error }}</p>
            <button class="btn btn-primary" (click)="loadInventoryData()">Try Again</button>
          </div>

          <div class="inventory-dashboard" *ngIf="!loading && !error">
            <!-- Stored Products Card -->
            <div class="stats-card main-card">
              <div class="card-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,18H6V14H12M21,14V12L20,7H4L3,12V14H4V20H14V14H18V20H20V14M12,16H6V18H12V16Z"/>
                </svg>
              </div>
              <div class="card-content">
                <h3 class="card-title">Stored products</h3>
                <div class="card-number">{{ stats?.totalStoredProducts || 0 }}</div>
              </div>
              <button class="card-info-btn" (click)="viewProducts()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z"/>
                </svg>
              </button>
            </div>

            <!-- Low Stock Products -->
            <div class="stats-card alert-card">
              <div class="card-header">
                <div class="alert-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z"/>
                  </svg>
                </div>
                <div class="card-content">
                  <span class="alert-text">Products with low stock</span>
                  <div class="alert-number">{{ stats?.lowStockProducts || 0 }}</div>
                </div>
              </div>
              
              <div class="product-list" *ngIf="lowStockProducts.length > 0">
                <div class="product-item" *ngFor="let product of lowStockProducts">
                  <span class="product-name">{{ product.name }}</span>
                  <span class="product-stock">{{ product.stock.toString().padStart(2, '0') }}</span>
                </div>
              </div>
            </div>

            <!-- Products to Expire -->
            <div class="stats-card expiring-card">
              <div class="card-header">
                <div class="expiring-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,3H18V1H16V3H8V1H6V3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V8H19V19Z"/>
                  </svg>
                </div>
                <div class="card-content">
                  <span class="expiring-text">Products to expire</span>
                  <div class="expiring-number">{{ stats?.expiringSoonProducts || 0 }}</div>
                </div>
              </div>
              
              <div class="product-list" *ngIf="expiringProducts.length > 0">
                <div class="product-item" *ngFor="let product of expiringProducts">
                  <span class="product-name">{{ product.name }}</span>
                  <span class="product-date">{{ formatExpirationDate(product.expirationDate) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Add Product FAB -->
          <button class="fab" (click)="addProduct()" *ngIf="!loading">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .inventory-container {
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

    .inventory-header {
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

    .inventory-content {
      flex: 1;
      padding: 30px 20px;
      max-width: 800px;
      margin: 0 auto;
      width: 100%;
      position: relative;
    }

    .inventory-dashboard {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .stats-card {
      background: var(--light-beige);
      border-radius: var(--border-radius);
      padding: 24px;
      transition: var(--transition);
    }

    .main-card {
      display: flex;
      align-items: center;
      gap: 20px;
      position: relative;
      cursor: pointer;
    }

    .main-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
    }

    .card-icon {
      color: var(--dark-green);
    }

    .card-content {
      flex: 1;
    }

    .card-title {
      font-size: 16px;
      color: var(--text-dark);
      margin: 0 0 8px 0;
    }

    .card-number {
      font-size: 48px;
      font-weight: bold;
      color: var(--dark-green);
    }

    .card-info-btn {
      background: var(--white);
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: var(--transition);
      color: var(--text-dark);
    }

    .card-info-btn:hover {
      background: #f0f0f0;
      transform: scale(1.1);
    }

    .alert-card, .expiring-card {
      border: none;
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 20px;
    }

    .alert-icon {
      color: #ff6b6b;
    }

    .expiring-icon {
      color: var(--text-dark);
    }

    .alert-text, .expiring-text {
      font-size: 14px;
      color: var(--text-dark);
      display: block;
      margin-bottom: 4px;
    }

    .alert-number, .expiring-number {
      font-size: 32px;
      font-weight: bold;
      color: var(--dark-green);
    }

    .product-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .product-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 8px;
    }

    .product-name {
      font-size: 14px;
      color: var(--text-dark);
    }

    .product-stock, .product-date {
      font-size: 14px;
      font-weight: 600;
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

    @media (max-width: 768px) {
      .inventory-content {
        padding: 20px 15px;
      }
      
      .main-card {
        flex-direction: column;
        text-align: center;
      }
      
      .card-number {
        font-size: 36px;
      }
    }

    @media (min-width: 1024px) {
      .hidden-desktop {
        display: none !important;
      }
      
      .inventory-header {
        background: var(--light-gray);
        color: var(--dark-green);
        padding: 20px;
      }
    }
  `]
})
export class InventoryComponent implements OnInit {
  stats: InventoryStats | null = null;
  lowStockProducts: LowStockProduct[] = [];
  expiringProducts: ExpiringProduct[] = [];
  loading = false;
  error = '';
  sidebarOpen = false;

  constructor(
    private inventoryService: InventoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadInventoryData();
  }

  loadInventoryData(): void {
    this.loading = true;
    this.error = '';
    
    // Load all data in parallel
    Promise.all([
      this.inventoryService.getInventoryStats().toPromise(),
      this.inventoryService.getLowStockProducts().toPromise(),
      this.inventoryService.getExpiringProducts().toPromise()
    ]).then(([stats, lowStock, expiring]) => {
      this.stats = stats!;
      this.lowStockProducts = lowStock!;
      this.expiringProducts = expiring!;
      this.loading = false;
    }).catch(error => {
      this.error = 'Failed to load inventory data. Please try again.';
      this.loading = false;
      console.error('Error loading inventory data:', error);
    });
  }

  formatExpirationDate(date: Date): string {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = d.toLocaleDateString('en', { month: 'short' });
    return `${day}-${month}`;
  }

  viewProducts(): void {
    this.router.navigate(['/inventory/products']);
  }

  addProduct(): void {
    this.router.navigate(['/inventory/add-product']);
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  toggleSidebar(open: boolean): void {
    this.sidebarOpen = open;
  }
}