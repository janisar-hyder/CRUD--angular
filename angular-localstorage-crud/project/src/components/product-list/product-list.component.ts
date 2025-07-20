import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product.interface';
import { ProductService } from '../../services/product.service';
import { AppStateService } from '../../services/app-state.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="product-list">
      <div class="list-header">
        <div class="header-content">
          <div class="title-section">
            <h2>Product Inventory</h2>
            <p class="subtitle">Manage your product catalog</p>
          </div>
          <button class="btn btn-primary btn-large" (click)="onAddProduct()">
            <span class="btn-icon">+</span>
            Add New Product
          </button>
        </div>
        
        <div class="search-filters" *ngIf="products.length > 0">
          <div class="search-box">
            <input
              type="text"
              placeholder="Search products..."
              [(ngModel)]="searchTerm"
              (input)="filterProducts()"
              class="search-input"
            />
            <span class="search-icon">🔍</span>
          </div>
          
          <select [(ngModel)]="selectedCategory" (change)="filterProducts()" class="category-filter">
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Books">Books</option>
            <option value="Home & Garden">Home & Garden</option>
            <option value="Sports & Outdoors">Sports & Outdoors</option>
            <option value="Appliances">Appliances</option>
          </select>
          
          <div class="results-count">
            {{ filteredProducts.length }} of {{ products.length }} products
          </div>
        </div>
      </div>

      <div class="products-grid" *ngIf="filteredProducts.length > 0; else emptyState">
        <div class="product-card" *ngFor="let product of filteredProducts; trackBy: trackByProductId">
          <div class="product-header">
            <div class="product-title">
              <h3>{{ product.name }}</h3>
              <span class="product-id">#{{ product.id.slice(-6).toUpperCase() }}</span>
            </div>
            <span class="category-badge" [attr.data-category]="product.category">
              {{ product.category }}
            </span>
          </div>
          
          <p class="description">{{ product.description }}</p>
          
          <div class="product-details">
            <div class="price">
              <span class="currency">$</span>{{ product.price | number:'1.2-2' }}
            </div>
            <div class="stock-status" [class.in-stock]="product.inStock" [class.out-of-stock]="!product.inStock">
              <span class="status-dot"></span>
              {{ product.inStock ? 'In Stock' : 'Out of Stock' }}
            </div>
          </div>
          
          <div class="product-actions">
            <button class="btn btn-secondary btn-icon-text" (click)="onEditProduct(product)">
              <span class="btn-icon">✏️</span>
              Edit
            </button>
            <button class="btn btn-danger btn-icon-text" (click)="onDeleteProduct(product.id)">
              <span class="btn-icon">🗑️</span>
              Delete
            </button>
          </div>
          
          <div class="product-meta">
            <div class="meta-item">
              <span class="meta-label">Created:</span>
              <span class="meta-value">{{ product.createdAt | date:'MMM d, y' }}</span>
            </div>
            <small *ngIf="product.updatedAt.getTime() !== product.createdAt.getTime()">
              <div class="meta-item">
                <span class="meta-label">Updated:</span>
                <span class="meta-value">{{ product.updatedAt | date:'MMM d, y' }}</span>
              </div>
            </small>
          </div>
        </div>
      </div>

      <ng-template #emptyState>
        <div class="empty-state" *ngIf="products.length === 0; else noResults">
          <div class="empty-icon">📦</div>
          <h3>No products yet</h3>
          <p>Start building your inventory by adding your first product.</p>
          <div class="empty-actions">
            <button class="btn btn-primary btn-large" (click)="onAddProduct()">
              <span class="btn-icon">+</span>
              Add Your First Product
            </button>
            <button class="btn btn-secondary" (click)="onSeedData()">
              Add Sample Data
            </button>
          </div>
        </div>
        
        <ng-template #noResults>
          <div class="empty-state">
            <div class="empty-icon">🔍</div>
            <h3>No products match your search</h3>
            <p>Try adjusting your search terms or filters.</p>
            <button class="btn btn-secondary" (click)="clearFilters()">
              Clear Filters
            </button>
          </div>
        </ng-template>
      </ng-template>
    </div>
  `,
  styles: [`
    .product-list {
      padding: 0;
    }

    .list-header {
      background: white;
      border-radius: 16px;
      padding: 32px;
      margin-bottom: 32px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid #f1f5f9;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
    }

    .title-section h2 {
      margin: 0;
      color: #0f172a;
      font-size: 2.25rem;
      font-weight: 700;
      letter-spacing: -0.025em;
    }

    .subtitle {
      margin: 4px 0 0 0;
      color: #64748b;
      font-size: 1.125rem;
    }

    .search-filters {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
    }

    .search-box {
      position: relative;
      flex: 1;
      min-width: 280px;
    }

    .search-input {
      width: 100%;
      padding: 12px 16px 12px 44px;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      font-size: 14px;
      transition: all 0.2s ease;
      background: #f8fafc;
    }

    .search-input:focus {
      outline: none;
      border-color: #3b82f6;
      background: white;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .search-icon {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: #64748b;
      font-size: 16px;
    }

    .category-filter {
      padding: 12px 16px;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      background: #f8fafc;
      font-size: 14px;
      min-width: 160px;
      transition: all 0.2s ease;
    }

    .category-filter:focus {
      outline: none;
      border-color: #3b82f6;
      background: white;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .results-count {
      color: #64748b;
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: 24px;
    }

    .product-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid #f1f5f9;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .product-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #3b82f6, #8b5cf6);
      transform: scaleX(0);
      transition: transform 0.3s ease;
    }

    .product-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      border-color: #e2e8f0;
    }

    .product-card:hover::before {
      transform: scaleX(1);
    }

    .product-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }

    .product-title {
      flex: 1;
      margin-right: 12px;
    }

    .product-title h3 {
      margin: 0;
      color: #0f172a;
      font-size: 1.375rem;
      font-weight: 700;
      line-height: 1.3;
      margin-bottom: 4px;
    }

    .product-id {
      color: #64748b;
      font-size: 0.75rem;
      font-weight: 500;
      font-family: 'Monaco', 'Menlo', monospace;
      background: #f1f5f9;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .category-badge {
      background: #f1f5f9;
      color: #475569;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 0.75rem;
      font-weight: 600;
      white-space: nowrap;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .category-badge[data-category="Electronics"] {
      background: #dbeafe;
      color: #1e40af;
    }

    .category-badge[data-category="Clothing"] {
      background: #fce7f3;
      color: #be185d;
    }

    .category-badge[data-category="Books"] {
      background: #ecfdf5;
      color: #059669;
    }

    .category-badge[data-category="Home & Garden"] {
      background: #fef3c7;
      color: #d97706;
    }

    .category-badge[data-category="Sports & Outdoors"] {
      background: #e0e7ff;
      color: #5b21b6;
    }

    .category-badge[data-category="Appliances"] {
      background: #fed7d7;
      color: #dc2626;
    }

    .description {
      color: #64748b;
      margin-bottom: 20px;
      line-height: 1.6;
      font-size: 0.95rem;
    }

    .product-details {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding: 16px;
      background: #f8fafc;
      border-radius: 12px;
    }

    .price {
      display: flex;
      align-items: baseline;
      font-size: 1.75rem;
      font-weight: 800;
      color: #059669;
    }

    .currency {
      font-size: 1.25rem;
      margin-right: 2px;
    }

    .stock-status {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .in-stock {
      background: #dcfce7;
      color: #166534;
    }

    .in-stock .status-dot {
      background: #22c55e;
    }

    .out-of-stock {
      background: #fef2f2;
      color: #991b1b;
    }

    .out-of-stock .status-dot {
      background: #ef4444;
    }

    .product-actions {
      display: flex;
      gap: 12px;
      margin-bottom: 20px;
    }

    .product-meta {
      border-top: 1px solid #f1f5f9;
      padding-top: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .meta-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .meta-label {
      color: #64748b;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .meta-value {
      color: #475569;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .empty-state {
      text-align: center;
      padding: 80px 20px;
      background: white;
      border-radius: 16px;
      border: 2px dashed #e2e8f0;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .empty-state h3 {
      color: #0f172a;
      margin-bottom: 8px;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .empty-state p {
      color: #64748b;
      margin-bottom: 24px;
      font-size: 1rem;
    }

    .empty-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 10px 20px;
      border: none;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.875rem;
      text-decoration: none;
      user-select: none;
      position: relative;
      overflow: hidden;
    }

    .btn-large {
      padding: 14px 28px;
      font-size: 1rem;
    }

    .btn-icon {
      margin-right: 8px;
      font-size: 1.1em;
    }

    .btn-icon-text {
      gap: 6px;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-primary {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      color: white;
      box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.3);
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px 0 rgba(59, 130, 246, 0.4);
    }

    .btn-secondary {
      background: #f8fafc;
      color: #475569;
      border: 2px solid #e2e8f0;
    }

    .btn-secondary:hover:not(:disabled) {
      background: #f1f5f9;
      border-color: #cbd5e1;
      transform: translateY(-1px);
    }

    .btn-danger {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
      box-shadow: 0 4px 14px 0 rgba(239, 68, 68, 0.3);
    }

    .btn-danger:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px 0 rgba(239, 68, 68, 0.4);
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 20px;
        align-items: stretch;
      }
      
      .search-filters {
        flex-direction: column;
        align-items: stretch;
      }
      
      .search-box {
        min-width: auto;
      }
      
      .products-grid {
        grid-template-columns: 1fr;
      }
      
      .product-details {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
      }
      
      .product-actions {
        flex-direction: column;
      }
      
      .empty-actions {
        flex-direction: column;
        align-items: center;
      }
    }
  `]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm: string = '';
  selectedCategory: string = '';

  constructor(
    private productService: ProductService,
    private appStateService: AppStateService
  ) {}

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe(products => {
      this.products = products;
      this.filterProducts();
    });
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = !this.searchTerm || 
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesCategory = !this.selectedCategory || 
        product.category === this.selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.filterProducts();
  }

  trackByProductId(index: number, product: Product): string {
    return product.id;
  }

  onAddProduct(): void {
    this.appStateService.setMode('create');
  }

  onEditProduct(product: Product): void {
    this.appStateService.setMode('edit', product.id);
  }

  onDeleteProduct(id: string): void {
    const product = this.products.find(p => p.id === id);
    if (product && confirm(`Are you sure you want to delete "${product.name}"?`)) {
      this.productService.deleteProduct(id);
    }
  }

  onSeedData(): void {
    this.productService.seedSampleData();
  }
}