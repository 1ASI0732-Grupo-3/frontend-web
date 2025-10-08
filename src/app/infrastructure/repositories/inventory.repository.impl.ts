import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { InventoryRepository } from '@domain/repositories/inventory.repository';
import { 
  Product, 
  CreateProductRequest, 
  InventoryStats, 
  ProductsByCategory, 
  LowStockProduct, 
  ExpiringProduct,
  ProductCategory 
} from '@shared/models/inventory.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryRepositoryImpl extends InventoryRepository {
  private products: Product[] = [
    {
      id: '1',
      name: 'Fiebre Aftosa (Oleosa)',
      category: ProductCategory.MEDICINES,
      stock: 2,
      expirationDate: new Date('2025-12-15'),
      minStockLevel: 5,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01')
    },
    {
      id: '2',
      name: 'Oxitetraciclina',
      category: ProductCategory.VACCINES,
      stock: 5,
      expirationDate: new Date('2025-11-20'),
      minStockLevel: 10,
      createdAt: new Date('2025-01-02'),
      updatedAt: new Date('2025-01-02')
    },
    {
      id: '3',
      name: 'Brucelosis (RB51)',
      category: ProductCategory.VACCINES,
      stock: 13,
      expirationDate: new Date('2025-10-25'),
      minStockLevel: 10,
      createdAt: new Date('2025-01-03'),
      updatedAt: new Date('2025-01-03')
    },
    {
      id: '4',
      name: 'Ketoprofeno',
      category: ProductCategory.MEDICINES,
      stock: 25,
      expirationDate: new Date('2026-06-18'),
      minStockLevel: 10,
      createdAt: new Date('2025-01-04'),
      updatedAt: new Date('2025-01-04')
    },
    {
      id: '5',
      name: 'Ivermectina 1%',
      category: ProductCategory.MEDICINES,
      stock: 8,
      expirationDate: new Date('2026-07-05'),
      minStockLevel: 15,
      createdAt: new Date('2025-01-05'),
      updatedAt: new Date('2025-01-05')
    },
    {
      id: '6',
      name: 'Clostridiates (8 vias)',
      category: ProductCategory.VACCINES,
      stock: 12,
      expirationDate: new Date('2026-07-23'),
      minStockLevel: 8,
      createdAt: new Date('2025-01-06'),
      updatedAt: new Date('2025-01-06')
    },
    // Duplicados para mostrar en diferentes categorías
    {
      id: '7',
      name: 'Fiebre Aftosa (Oleosa)',
      category: ProductCategory.FOOD,
      stock: 2,
      expirationDate: new Date('2025-12-15'),
      minStockLevel: 5,
      createdAt: new Date('2025-01-07'),
      updatedAt: new Date('2025-01-07')
    },
    {
      id: '8',
      name: 'Oxitetraciclina',
      category: ProductCategory.SUPPLEMENTS,
      stock: 5,
      expirationDate: new Date('2025-11-20'),
      minStockLevel: 10,
      createdAt: new Date('2025-01-08'),
      updatedAt: new Date('2025-01-08')
    },
    {
      id: '9',
      name: 'Brucelosis (RB51)',
      category: ProductCategory.FOOD,
      stock: 13,
      expirationDate: new Date('2025-10-25'),
      minStockLevel: 10,
      createdAt: new Date('2025-01-09'),
      updatedAt: new Date('2025-01-09')
    }
  ];

  private readonly categoryColors = {
    [ProductCategory.MEDICINES]: '#FFD93D',
    [ProductCategory.VACCINES]: '#FF6B6B', 
    [ProductCategory.FOOD]: '#A8E6CF',
    [ProductCategory.SUPPLEMENTS]: '#DDA0DD'
  };

  getProducts(): Observable<Product[]> {
    return of([...this.products]).pipe(delay(500));
  }

  getProductById(id: string): Observable<Product> {
    const product = this.products.find(p => p.id === id);
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    return of({ ...product }).pipe(delay(300));
  }

  createProduct(request: CreateProductRequest): Observable<Product> {
    const newProduct: Product = {
      id: Math.random().toString(36).substr(2, 9),
      ...request,
      minStockLevel: request.minStockLevel || 10,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.products.push(newProduct);
    return of({ ...newProduct }).pipe(delay(800));
  }

  updateProduct(id: string, updates: Partial<Product>): Observable<Product> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error(`Product with id ${id} not found`);
    }
    
    this.products[index] = { 
      ...this.products[index], 
      ...updates,
      updatedAt: new Date()
    };
    return of({ ...this.products[index] }).pipe(delay(500));
  }

  deleteProduct(id: string): Observable<void> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error(`Product with id ${id} not found`);
    }
    
    this.products.splice(index, 1);
    return of(void 0).pipe(delay(400));
  }

  getInventoryStats(): Observable<InventoryStats> {
    const totalStoredProducts = this.products.reduce((sum, product) => sum + product.stock, 0);
    const lowStockProducts = this.products.filter(p => p.stock <= p.minStockLevel).length;
    const expiringSoonProducts = this.getExpiringSoonCount();
    const totalCategories = Object.keys(ProductCategory).length;

    const stats: InventoryStats = {
      totalStoredProducts,
      lowStockProducts,
      expiringSoonProducts,
      totalCategories
    };

    return of(stats).pipe(delay(400));
  }

  getProductsByCategory(): Observable<ProductsByCategory[]> {
    const categoryCount: { [key: string]: number } = {};
    
    // Count products by category
    this.products.forEach(product => {
      categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
    });

    const total = this.products.length;
    
    const result: ProductsByCategory[] = Object.entries(categoryCount).map(([category, count]) => ({
      category: category as ProductCategory,
      count,
      percentage: Math.round((count / total) * 100),
      color: this.categoryColors[category as ProductCategory]
    }));

    return of(result).pipe(delay(400));
  }

  getLowStockProducts(): Observable<LowStockProduct[]> {
    const lowStockProducts = this.products
      .filter(p => p.stock <= p.minStockLevel)
      .map(p => ({
        name: p.name,
        stock: p.stock
      }))
      .slice(0, 5); // Top 5 como en la imagen

    return of(lowStockProducts).pipe(delay(300));
  }

  getExpiringProducts(): Observable<ExpiringProduct[]> {
    const now = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(now.getMonth() + 3);

    const expiringProducts = this.products
      .filter(p => p.expirationDate <= threeMonthsFromNow && p.expirationDate >= now)
      .map(p => ({
        name: p.name,
        expirationDate: p.expirationDate
      }))
      .sort((a, b) => a.expirationDate.getTime() - b.expirationDate.getTime())
      .slice(0, 5); // Top 5 como en la imagen

    return of(expiringProducts).pipe(delay(300));
  }

  private getExpiringSoonCount(): number {
    const now = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(now.getMonth() + 3);

    return this.products.filter(p => 
      p.expirationDate <= threeMonthsFromNow && p.expirationDate >= now
    ).length;
  }
}