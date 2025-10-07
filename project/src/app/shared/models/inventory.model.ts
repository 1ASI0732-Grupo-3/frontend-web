export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  stock: number;
  expirationDate: Date;
  minStockLevel: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum ProductCategory {
  MEDICINES = 'Medicines',
  VACCINES = 'Vaccines',
  FOOD = 'Food',
  SUPPLEMENTS = 'Supplements'
}

export interface InventoryStats {
  totalStoredProducts: number;
  lowStockProducts: number;
  expiringSoonProducts: number;
  totalCategories: number;
}

export interface ProductsByCategory {
  category: ProductCategory;
  count: number;
  percentage: number;
  color: string;
}

export interface LowStockProduct {
  name: string;
  stock: number;
}

export interface ExpiringProduct {
  name: string;
  expirationDate: Date;
}

export interface CreateProductRequest {
  name: string;
  category: ProductCategory;
  stock: number;
  expirationDate: Date;
  minStockLevel?: number;
}