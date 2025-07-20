import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { AppStateService, AppState } from './services/app-state.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ProductListComponent, ProductFormComponent],
  template: `
    <div class="app">
      <header class="app-header">
        <div class="container">
          <div class="header-content">
            <div class="brand">
              <div class="brand-icon">📦</div>
              <div class="brand-text">
                <h1>ProductHub</h1>
                <p>Professional Inventory Management</p>
              </div>
            </div>
            <div class="header-stats" *ngIf="currentMode === 'list'">
              <div class="stat-item">
                <span class="stat-number">{{ totalProducts }}</span>
                <span class="stat-label">Products</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ inStockProducts }}</span>
                <span class="stat-label">In Stock</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main class="app-main">
        <div class="container">
          <app-product-list *ngIf="currentMode === 'list'"></app-product-list>
          <app-product-form *ngIf="currentMode === 'create' || currentMode === 'edit'"></app-product-form>
        </div>
      </main>
      
      <footer class="app-footer" *ngIf="currentMode === 'list'">
        <div class="container">
          <p>&copy; 2025 ProductHub. Built with Angular & Local Storage.</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .app {
      min-height: 100vh;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      display: flex;
      flex-direction: column;
    }

    .app-header {
      background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%);
      color: white;
      padding: 32px 0;
      box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      position: relative;
      overflow: hidden;
    }

    .app-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="90" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
      pointer-events: none;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      z-index: 1;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .brand-icon {
      font-size: 3rem;
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
    }

    .brand-text h1 {
      margin: 0;
      font-size: 2.5rem;
      font-weight: 800;
      letter-spacing: -0.025em;
      background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .brand-text p {
      margin: 4px 0 0 0;
      font-size: 1rem;
      opacity: 0.9;
      font-weight: 500;
    }

    .header-stats {
      display: flex;
      gap: 32px;
    }

    .stat-item {
      text-align: center;
    }

    .stat-number {
      display: block;
      font-size: 2rem;
      font-weight: 800;
      line-height: 1;
      color: #60a5fa;
    }

    .stat-label {
      display: block;
      font-size: 0.875rem;
      opacity: 0.8;
      margin-top: 4px;
      font-weight: 500;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }

    .app-main {
      flex: 1;
      padding: 40px 0;
    }

    .app-footer {
      background: #1e293b;
      color: #94a3b8;
      padding: 24px 0;
      text-align: center;
      border-top: 1px solid #334155;
    }

    .app-footer p {
      margin: 0;
      font-size: 0.875rem;
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 20px;
        text-align: center;
      }
      
      .brand {
        flex-direction: column;
        gap: 12px;
      }
      
      .brand-text h1 {
        font-size: 2.25rem;
      }
      
      .header-stats {
        gap: 24px;
      }
      
      .app-main {
        padding: 24px 0;
      }
    }
  `]
})
export class App implements OnInit {
  currentMode: 'list' | 'create' | 'edit' = 'list';
  totalProducts = 0;
  inStockProducts = 0;

  constructor(private appStateService: AppStateService) {}

  ngOnInit(): void {
    this.appStateService.state$.subscribe((state: AppState) => {
      this.currentMode = state.mode;
    });
    
    // Update stats when products change
    this.updateStats();
    
    // Listen for storage changes to update stats
    window.addEventListener('storage', () => {
      this.updateStats();
    });
  }

  private updateStats(): void {
    const stored = localStorage.getItem('products');
    if (stored) {
      try {
        const products = JSON.parse(stored);
        this.totalProducts = products.length;
        this.inStockProducts = products.filter((p: any) => p.inStock).length;
      } catch (error) {
        this.totalProducts = 0;
        this.inStockProducts = 0;
      }
    } else {
      this.totalProducts = 0;
      this.inStockProducts = 0;
    }
    
    // Force change detection
    setTimeout(() => {
      this.updateStats();
    }, 100);
  }
}

bootstrapApplication(App);