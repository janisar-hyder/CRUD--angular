import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product, CreateProductRequest } from '../models/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly STORAGE_KEY = 'products';
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  constructor() {
    this.loadProductsFromStorage();
  }

  private loadProductsFromStorage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const products = JSON.parse(stored).map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt)
        }));
        this.productsSubject.next(products);
      } catch (error) {
        console.error('Error loading products from storage:', error);
        this.productsSubject.next([]);
      }
    }
  }

  private saveProductsToStorage(products: Product[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
    this.productsSubject.next(products);
  }

  getAllProducts(): Observable<Product[]> {
    return this.products$;
  }

  getProductById(id: string): Product | undefined {
    return this.productsSubject.value.find(product => product.id === id);
  }

  createProduct(productData: CreateProductRequest): Product {
    const newProduct: Product = {
      id: this.generateId(),
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const currentProducts = this.productsSubject.value;
    const updatedProducts = [...currentProducts, newProduct];
    this.saveProductsToStorage(updatedProducts);

    return newProduct;
  }

  updateProduct(id: string, updateData: Partial<CreateProductRequest>): Product | null {
    const currentProducts = this.productsSubject.value;
    const productIndex = currentProducts.findIndex(product => product.id === id);

    if (productIndex === -1) {
      return null;
    }

    const updatedProduct: Product = {
      ...currentProducts[productIndex],
      ...updateData,
      updatedAt: new Date()
    };

    const updatedProducts = [...currentProducts];
    updatedProducts[productIndex] = updatedProduct;
    this.saveProductsToStorage(updatedProducts);

    return updatedProduct;
  }

  deleteProduct(id: string): boolean {
    const currentProducts = this.productsSubject.value;
    const filteredProducts = currentProducts.filter(product => product.id !== id);
    
    if (filteredProducts.length !== currentProducts.length) {
      this.saveProductsToStorage(filteredProducts);
      return true;
    }
    
    return false;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Utility method to seed some sample data
  seedSampleData(): void {
    const sampleProducts: CreateProductRequest[] = [
      {
        name: 'Laptop Pro',
        description: 'High-performance laptop for professionals',
        price: 1299.99,
        category: 'Electronics',
        inStock: true
      },
      {
        name: 'Wireless Headphones',
        description: 'Premium noise-cancelling headphones',
        price: 249.99,
        category: 'Electronics',
        inStock: true
      },
      {
        name: 'Coffee Maker',
        description: 'Automatic drip coffee maker',
        price: 89.99,
        category: 'Appliances',
        inStock: false
      }
    ];

    sampleProducts.forEach(product => this.createProduct(product));
  }
}