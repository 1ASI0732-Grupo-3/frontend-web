import { Observable } from "rxjs";
import { 
  Product, 
  CreateProductRequest, 
  InventoryStats, 
  ProductsByCategory, 
  LowStockProduct, 
  ExpiringProduct 
} from "../../shared/models/inventory.model";

export abstract class InventoryRepository {
  abstract getProducts(): Observable<Product[]>;
  abstract getProductById(id: string): Observable<Product>;
  abstract createProduct(request: CreateProductRequest): Observable<Product>;
  abstract updateProduct(id: string, product: Partial<Product>): Observable<Product>;
  abstract deleteProduct(id: string): Observable<void>;
  abstract getInventoryStats(): Observable<InventoryStats>;
  abstract getProductsByCategory(): Observable<ProductsByCategory[]>;
  abstract getLowStockProducts(): Observable<LowStockProduct[]>;
  abstract getExpiringProducts(): Observable<ExpiringProduct[]>;
}

export {};