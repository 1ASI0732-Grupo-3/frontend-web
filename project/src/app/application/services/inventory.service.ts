import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InventoryRepository } from '../../domain/repositories/inventory.repository';
import { 
  Product, 
  CreateProductRequest, 
  InventoryStats, 
  ProductsByCategory, 
  LowStockProduct, 
  ExpiringProduct 
} from '../../shared/models/inventory.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(private inventoryRepository: InventoryRepository) {}

  getProducts(): Observable<Product[]> {
    return this.inventoryRepository.getProducts();
  }

  getProductById(id: string): Observable<Product> {
    return this.inventoryRepository.getProductById(id);
  }

  createProduct(request: CreateProductRequest): Observable<Product> {
    return this.inventoryRepository.createProduct(request);
  }

  updateProduct(id: string, product: Partial<Product>): Observable<Product> {
    return this.inventoryRepository.updateProduct(id, product);
  }

  deleteProduct(id: string): Observable<void> {
    return this.inventoryRepository.deleteProduct(id);
  }

  getInventoryStats(): Observable<InventoryStats> {
    return this.inventoryRepository.getInventoryStats();
  }

  getProductsByCategory(): Observable<ProductsByCategory[]> {
    return this.inventoryRepository.getProductsByCategory();
  }

  getLowStockProducts(): Observable<LowStockProduct[]> {
    return this.inventoryRepository.getLowStockProducts();
  }

  getExpiringProducts(): Observable<ExpiringProduct[]> {
    return this.inventoryRepository.getExpiringProducts();
  }
}