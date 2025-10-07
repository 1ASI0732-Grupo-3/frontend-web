import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../../application/services/inventory.service';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { Product, ProductCategory } from '../../../shared/models/inventory.model';

interface CategoryData {
  category: ProductCategory;
  count: number;
  color: string;
  percentage: number;
}

@Component({
  selector: 'app-inventory-products',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  template: `
    <div class="products-container">
      <app-sidebar [isOpen]="sidebarOpen" (sidebarToggle)="toggleSidebar($event)"></app-sidebar>
      
      <div class="main-content">
        <header class="products-header">
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
          <div class="header-title">Products</div>
        </header>

        <div class="products-content fade-in">
          <div class="loading-state" *ngIf="loading">
            <div class="loading-spinner"></div>
            <p>Loading products...</p>
          </div>

          <div class="error-state" *ngIf="error">
            <p>{{ error }}</p>
            <button class="btn btn-primary" (click)="loadProducts()">Try Again</button>
          </div>

          <div class="products-dashboard" *ngIf="!loading && !error">
            <!-- Pie Chart Section -->
            <div class="chart-card">
              <div class="chart-container">
                <svg viewBox="0 0 200 200" class="pie-chart">
                  <g transform="translate(100,100)">
                    <g *ngFor="let segment of pieSegments; let i = index"
                       class="pie-segment"
                       [style.stroke]="segment.color"
                       [style.fill]="segment.color">
                      <path [attr.d]="segment.path" 
                            [style.opacity]="hoveredSegment === i ? '0.8' : '1'"
                            (mouseenter)="hoveredSegment = i"
                            (mouseleave)="hoveredSegment = -1"></path>
                    </g>
                    <!-- Center circle -->
                    <circle r="40" fill="var(--white)" stroke="none"></circle>
                  </g>
                </svg>
                
                <!-- Legend -->
                <div class="chart-legend">
                  <div class="legend-item" *ngFor="let category of categoryData; let i = index"
                       [class.hovered]="hoveredSegment === i">
                    <div class="legend-color" [style.background-color]="category.color"></div>
                    <span class="legend-text">{{ getCategoryDisplayName(category.category) }} ({{ category.count }})</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Products Table -->
            <div class="table-card">
              <div class="table-header">
                <h3>Product List</h3>
                <div class="table-controls">
                  <select class="category-filter" [(ngModel)]="selectedCategory" (change)="filterByCategory()">
                    <option value="">All Categories</option>
                    <option *ngFor="let category of availableCategories" [value]="category">
                      {{ getCategoryDisplayName(category) }}
                    </option>
                  </select>
                  <button class="refresh-btn" (click)="loadProducts()">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div class="table-container">
                <table class="products-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th class="text-center">Stock</th>
                      <th class="text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let product of filteredProducts; trackBy: trackByProductId"
                        class="product-row"
                        (click)="viewProductDetail(product)">
                      <td>
                        <div class="product-name">
                          {{ product.name }}
                        </div>
                      </td>
                      <td>
                        <span class="category-badge" [attr.data-category]="product.category">
                          {{ getCategoryDisplayName(product.category) }}
                        </span>
                      </td>
                      <td class="text-center">
                        <span class="stock-amount" [class.low-stock]="product.stock <= 10">
                          {{ product.stock }}
                        </span>
                      </td>
                      <td class="text-center">
                        <span class="status-badge" 
                              [class.low-stock-badge]="product.stock <= 10"
                              [class.normal-stock-badge]="product.stock > 10">
                          {{ getStockStatus(product.stock) }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div class="empty-state" *ngIf="filteredProducts.length === 0 && !loading">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,18H6V14H12M21,14V12L20,7H4L3,12V14H4V20H14V14H18V20H20V14M12,16H6V18H12V16Z"/>
                  </svg>
                  <p>No products found</p>
                  <button class="btn btn-primary" (click)="addProduct()">Add First Product</button>
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
    .products-container {
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

    .products-header {
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

    .products-content {
      flex: 1;
      padding: 30px 20px;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
      position: relative;
    }

    .products-dashboard {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 30px;
    }

    .chart-card, .table-card {
      background: var(--light-beige);
      border-radius: var(--border-radius);
      padding: 24px;
    }

    .chart-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }

    .pie-chart {
      width: 200px;
      height: 200px;
    }

    .pie-segment path {
      transition: opacity 0.2s ease;
      cursor: pointer;
    }

    .chart-legend {
      display: flex;
      flex-direction: column;
      gap: 12px;
      width: 100%;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px;
      border-radius: 8px;
      transition: var(--transition);
      cursor: pointer;
    }

    .legend-item:hover,
    .legend-item.hovered {
      background: rgba(255, 255, 255, 0.5);
    }

    .legend-color {
      width: 16px;
      height: 16px;
      border-radius: 50%;
    }

    .legend-text {
      font-size: 14px;
      color: var(--text-dark);
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .table-header h3 {
      margin: 0;
      color: var(--text-dark);
      font-size: 18px;
    }

    .table-controls {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .category-filter {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background: var(--white);
      font-size: 14px;
      color: var(--text-dark);
    }

    .refresh-btn {
      background: var(--white);
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 8px;
      cursor: pointer;
      transition: var(--transition);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-dark);
    }

    .refresh-btn:hover {
      background: #f5f5f5;
    }

    .table-container {
      overflow-x: auto;
    }

    .products-table {
      width: 100%;
      border-collapse: collapse;
    }

    .products-table th {
      background: var(--white);
      padding: 12px 16px;
      text-align: left;
      font-weight: 600;
      color: var(--text-dark);
      border-bottom: 2px solid #eee;
    }

    .products-table td {
      padding: 16px;
      border-bottom: 1px solid #eee;
    }

    .product-row {
      cursor: pointer;
      transition: var(--transition);
    }

    .product-row:hover {
      background: rgba(255, 255, 255, 0.7);
    }

    .product-name {
      font-weight: 500;
      color: var(--text-dark);
    }

    .product-subtitle {
      display: block;
      font-size: 12px;
      color: #666;
      margin-top: 2px;
    }

    .category-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      background: #e3f2fd;
      color: #1976d2;
    }

    .category-badge[data-category="MEDICINES"] {
      background: #fff3e0;
      color: #f57c00;
    }

    .category-badge[data-category="FOOD"] {
      background: #e8f5e8;
      color: #388e3c;
    }

    .category-badge[data-category="VACCINES"] {
      background: #fce4ec;
      color: #c2185b;
    }

    .category-badge[data-category="SUPPLEMENTS"] {
      background: #e3f2fd;
      color: #1976d2;
    }

    .stock-amount {
      font-weight: 600;
      color: var(--text-dark);
    }

    .stock-amount.low-stock {
      color: #f44336;
    }

    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .normal-stock-badge {
      background: #e8f5e8;
      color: #388e3c;
    }

    .low-stock-badge {
      background: #ffebee;
      color: #f44336;
    }

    .text-center {
      text-align: center;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .empty-state svg {
      margin-bottom: 16px;
      opacity: 0.5;
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

    .loading-state, .error-state {
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

    @media (max-width: 1024px) {
      .products-dashboard {
        grid-template-columns: 1fr;
        gap: 20px;
      }
    }

    @media (max-width: 768px) {
      .products-content {
        padding: 20px 15px;
      }
      
      .table-header {
        flex-direction: column;
        gap: 12px;
        align-items: stretch;
      }
      
      .table-controls {
        justify-content: space-between;
      }
    }

    @media (min-width: 1024px) {
      .hidden-desktop {
        display: none !important;
      }
      
      .products-header {
        background: var(--light-gray);
        color: var(--dark-green);
        padding: 20px;
      }
    }
  `]
})
export class InventoryProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categoryData: CategoryData[] = [];
  pieSegments: any[] = [];
  availableCategories: ProductCategory[] = [];
  selectedCategory = '';
  loading = false;
  error = '';
  sidebarOpen = false;
  hoveredSegment = -1;

  private categoryColors: { [key in ProductCategory]: string } = {
    [ProductCategory.MEDICINES]: '#FF6B6B',
    [ProductCategory.FOOD]: '#4ECDC4', 
    [ProductCategory.VACCINES]: '#45B7D1',
    [ProductCategory.SUPPLEMENTS]: '#96CEB4'
  };

  constructor(
    private inventoryService: InventoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = '';
    
    this.inventoryService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products;
        this.processProductData();
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load products. Please try again.';
        this.loading = false;
        console.error('Error loading products:', error);
      }
    });
  }

  private processProductData(): void {
    // Get available categories
    this.availableCategories = Array.from(new Set(this.products.map(p => p.category)));
    
    // Calculate category distribution
    const categoryCounts = this.availableCategories.map(category => {
      const count = this.products.filter(p => p.category === category).length;
      return {
        category,
        count,
        color: this.categoryColors[category] || '#999',
        percentage: 0
      };
    });

    const totalProducts = this.products.length;
    categoryCounts.forEach(item => {
      item.percentage = totalProducts > 0 ? (item.count / totalProducts) * 100 : 0;
    });

    this.categoryData = categoryCounts;
    this.generatePieSegments();
  }

  private generatePieSegments(): void {
    let currentAngle = -90; // Start at top
    this.pieSegments = [];

    this.categoryData.forEach((category, index) => {
      const angle = (category.percentage / 100) * 360;
      const startAngle = (currentAngle * Math.PI) / 180;
      const endAngle = ((currentAngle + angle) * Math.PI) / 180;
      
      const x1 = 80 * Math.cos(startAngle);
      const y1 = 80 * Math.sin(startAngle);
      const x2 = 80 * Math.cos(endAngle);
      const y2 = 80 * Math.sin(endAngle);
      
      const largeArcFlag = angle > 180 ? 1 : 0;
      
      const path = `M 0 0 L ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
      
      this.pieSegments.push({
        path,
        color: category.color,
        category: category.category,
        percentage: category.percentage
      });
      
      currentAngle += angle;
    });
  }

  filterByCategory(): void {
    if (this.selectedCategory) {
      this.filteredProducts = this.products.filter(p => p.category === this.selectedCategory);
    } else {
      this.filteredProducts = this.products;
    }
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

  getStockStatus(stock: number): string {
    return stock <= 10 ? 'Low Stock' : 'In Stock';
  }

  trackByProductId(index: number, product: Product): string {
    return product.id;
  }

  viewProductDetail(product: Product): void {
    // Navigate to product detail - will implement if needed
    console.log('View product detail:', product);
  }

  addProduct(): void {
    this.router.navigate(['/inventory/add-product']);
  }

  goBack(): void {
    this.router.navigate(['/inventory']);
  }

  toggleSidebar(open: boolean): void {
    this.sidebarOpen = open;
  }
}