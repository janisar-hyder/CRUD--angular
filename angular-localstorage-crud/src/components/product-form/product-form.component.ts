import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, CreateProductRequest } from '../../models/product.interface';
import { ProductService } from '../../services/product.service';
import { AppStateService, AppState } from '../../services/app-state.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="product-form">
      <div class="form-header">
        <div class="header-content">
          <div class="title-section">
            <h2>{{ isEditMode ? 'Edit Product' : 'Create New Product' }}</h2>
            <p class="subtitle">{{ isEditMode ? 'Update product information' : 'Add a new product to your inventory' }}</p>
          </div>
          <button class="btn btn-secondary btn-icon-text" (click)="onCancel()">
            <span class="btn-icon">←</span>
            Back to List
          </button>
        </div>
      </div>

      <div class="form-container">
        <form (ngSubmit)="onSubmit()" #productForm="ngForm" class="form">
          <div class="form-section">
            <h3 class="section-title">Basic Information</h3>
            
            <div class="form-group">
              <label for="name" class="form-label">
                Product Name *
                <span class="label-hint">Choose a clear, descriptive name</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                [(ngModel)]="formData.name"
                required
                #nameInput="ngModel"
                class="form-control"
                [class.error]="nameInput.invalid && nameInput.touched"
                placeholder="e.g., MacBook Pro 16-inch"
              />
              <div class="error-message" *ngIf="nameInput.invalid && nameInput.touched">
                <span class="error-icon">⚠️</span>
                Product name is required
              </div>
            </div>

            <div class="form-group">
              <label for="description" class="form-label">
                Description *
                <span class="label-hint">Provide detailed product information</span>
              </label>
              <textarea
                id="description"
                name="description"
                [(ngModel)]="formData.description"
                required
                #descriptionInput="ngModel"
                class="form-control textarea"
                [class.error]="descriptionInput.invalid && descriptionInput.touched"
                placeholder="Describe the product features, specifications, and benefits..."
                rows="4"
              ></textarea>
              <div class="error-message" *ngIf="descriptionInput.invalid && descriptionInput.touched">
                <span class="error-icon">⚠️</span>
                Description is required
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3 class="section-title">Pricing & Category</h3>
            
            <div class="form-row">
              <div class="form-group">
                <label for="price" class="form-label">
                  Price *
                  <span class="label-hint">Set competitive pricing</span>
                </label>
                <div class="price-input-wrapper">
                  <span class="currency-symbol">$</span>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    [(ngModel)]="formData.price"
                    required
                    min="0"
                    step="0.01"
                    #priceInput="ngModel"
                    class="form-control price-input"
                    [class.error]="priceInput.invalid && priceInput.touched"
                    placeholder="0.00"
                  />
                </div>
                <div class="error-message" *ngIf="priceInput.invalid && priceInput.touched">
                  <span class="error-icon">⚠️</span>
                  Valid price is required
                </div>
              </div>

              <div class="form-group">
                <label for="category" class="form-label">
                  Category *
                  <span class="label-hint">Choose the best fit</span>
                </label>
                <select
                  id="category"
                  name="category"
                  [(ngModel)]="formData.category"
                  required
                  #categoryInput="ngModel"
                  class="form-control"
                  [class.error]="categoryInput.invalid && categoryInput.touched"
                >
                  <option value="">Select a category</option>
                  <option value="Electronics">📱 Electronics</option>
                  <option value="Clothing">👕 Clothing</option>
                  <option value="Books">📚 Books</option>
                  <option value="Home & Garden">🏠 Home & Garden</option>
                  <option value="Sports & Outdoors">⚽ Sports & Outdoors</option>
                  <option value="Appliances">🔌 Appliances</option>
                </select>
                <div class="error-message" *ngIf="categoryInput.invalid && categoryInput.touched">
                  <span class="error-icon">⚠️</span>
                  Category is required
                </div>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3 class="section-title">Inventory Status</h3>
            
            <div class="form-group">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  name="inStock"
                  [(ngModel)]="formData.inStock"
                  class="checkbox"
                />
                <span class="checkmark"></span>
                <span class="checkbox-text">
                  <span class="checkbox-title">In Stock</span>
                  <span class="checkbox-description">Product is available for purchase</span>
                </span>
              </label>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-secondary btn-large" (click)="onCancel()">
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-primary btn-large"
              [disabled]="!productForm.valid"
            >
              <span class="btn-icon">{{ isEditMode ? '💾' : '✨' }}</span>
              {{ isEditMode ? 'Update Product' : 'Create Product' }}
            </button>
          </div>
        </form>
        
        <div class="form-preview" *ngIf="formData.name || formData.description">
          <h3 class="preview-title">Preview</h3>
          <div class="preview-card">
            <div class="preview-header">
              <h4>{{ formData.name || 'Product Name' }}</h4>
              <span class="preview-category" *ngIf="formData.category">{{ formData.category }}</span>
            </div>
            <p class="preview-description">{{ formData.description || 'Product description will appear here...' }}</p>
            <div class="preview-details">
              <div class="preview-price">$ {{ formData.price | number:'1.2-2' }}</div>
              <div class="preview-stock" [class.in-stock]="formData.inStock" [class.out-of-stock]="!formData.inStock">
                {{ formData.inStock ? 'In Stock' : 'Out of Stock' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-form {
      padding: 0;
    }

    .form-header {
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

    .form-container {
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 32px;
      align-items: start;
    }

    .form {
      background: white;
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid #f1f5f9;
    }

    .form-section {
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 1px solid #f1f5f9;
    }

    .form-section:last-of-type {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }

    .section-title {
      margin: 0 0 20px 0;
      color: #0f172a;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .form-group {
      margin-bottom: 24px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    .form-label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #0f172a;
      font-size: 0.875rem;
    }

    .label-hint {
      display: block;
      font-weight: 400;
      color: #64748b;
      font-size: 0.75rem;
      margin-top: 2px;
    }

    .form-control {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      font-size: 14px;
      transition: all 0.2s ease;
      background: #f8fafc;
      font-family: inherit;
    }

    .form-control:focus {
      outline: none;
      border-color: #3b82f6;
      background: white;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-control.error {
      border-color: #ef4444;
      background: #fef2f2;
    }

    .textarea {
      resize: vertical;
      min-height: 100px;
    }

    .price-input-wrapper {
      position: relative;
    }

    .currency-symbol {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: #64748b;
      font-weight: 600;
      font-size: 14px;
    }

    .price-input {
      padding-left: 32px;
    }

    .checkbox-label {
      display: flex;
      align-items: flex-start;
      cursor: pointer;
      padding: 16px;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      background: #f8fafc;
      transition: all 0.2s ease;
    }

    .checkbox-label:hover {
      border-color: #cbd5e1;
      background: white;
    }

    .checkbox {
      margin-right: 12px;
      width: 18px;
      height: 18px;
      margin-top: 2px;
    }

    .checkbox-text {
      display: flex;
      flex-direction: column;
    }

    .checkbox-title {
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 2px;
    }

    .checkbox-description {
      font-size: 0.75rem;
      color: #64748b;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #ef4444;
      font-size: 0.75rem;
      margin-top: 6px;
      font-weight: 500;
    }

    .error-icon {
      font-size: 14px;
    }

    .form-actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #f1f5f9;
    }

    .form-preview {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid #f1f5f9;
      position: sticky;
      top: 20px;
    }

    .preview-title {
      margin: 0 0 16px 0;
      color: #0f172a;
      font-size: 1.125rem;
      font-weight: 600;
    }

    .preview-card {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 16px;
      background: #f8fafc;
    }

    .preview-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }

    .preview-header h4 {
      margin: 0;
      color: #0f172a;
      font-size: 1.125rem;
      font-weight: 600;
      flex: 1;
      margin-right: 12px;
    }

    .preview-category {
      background: #dbeafe;
      color: #1e40af;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .preview-description {
      color: #64748b;
      margin-bottom: 16px;
      line-height: 1.5;
      font-size: 0.875rem;
    }

    .preview-details {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .preview-price {
      font-size: 1.25rem;
      font-weight: 700;
      color: #059669;
    }

    .preview-stock {
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .preview-stock.in-stock {
      background: #dcfce7;
      color: #166534;
    }

    .preview-stock.out-of-stock {
      background: #fef2f2;
      color: #991b1b;
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
      gap: 8px;
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

    @media (max-width: 1024px) {
      .form-container {
        grid-template-columns: 1fr;
      }
      
      .form-preview {
        position: static;
      }
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }
      
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .form-actions {
        flex-direction: column;
      }
      
      .preview-details {
        flex-direction: column;
        gap: 8px;
        align-items: flex-start;
      }
    }
  `]
})
export class ProductFormComponent implements OnInit {
  isEditMode = false;
  editingProductId: string | null = null;
  
  formData: CreateProductRequest = {
    name: '',
    description: '',
    price: 0,
    category: '',
    inStock: true
  };

  constructor(
    private productService: ProductService,
    private appStateService: AppStateService
  ) {}

  ngOnInit(): void {
    this.appStateService.state$.subscribe((state: AppState) => {
      if (state.mode === 'edit' && state.editingProductId) {
        this.isEditMode = true;
        this.editingProductId = state.editingProductId;
        this.loadProductForEdit(state.editingProductId);
      } else if (state.mode === 'create') {
        this.isEditMode = false;
        this.editingProductId = null;
        this.resetForm();
      }
    });
  }

  private loadProductForEdit(productId: string): void {
    const product = this.productService.getProductById(productId);
    if (product) {
      this.formData = {
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        inStock: product.inStock
      };
    }
  }

  private resetForm(): void {
    this.formData = {
      name: '',
      description: '',
      price: 0,
      category: '',
      inStock: true
    };
  }

  onSubmit(): void {
    try {
      if (this.isEditMode && this.editingProductId) {
        const updated = this.productService.updateProduct(this.editingProductId, this.formData);
        if (updated) {
          console.log('Product updated successfully:', updated);
          this.appStateService.setMode('list');
        } else {
          console.error('Failed to update product');
        }
      } else {
        const created = this.productService.createProduct(this.formData);
        if (created) {
          console.log('Product created successfully:', created);
          this.appStateService.setMode('list');
        } else {
          console.error('Failed to create product');
        }
      }
    } catch (error) {
      console.error('Error in form submission:', error);
    }
  }

  onCancel(): void {
    this.appStateService.setMode('list');
  }
}