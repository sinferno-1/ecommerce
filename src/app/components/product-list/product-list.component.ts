// product-list.component.ts
// Displays the main product listing page (PLP) with filters, sorting,
// pagination and an "Add Product" button. Handles interactions with
// ProductService and aggregates filter state.
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';
import { ProductService, Product, USD_TO_INR } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ProductCardComponent } from '../product-card/product-card.component';
import { AddProductDialogComponent } from '../add-product-dialog/add-product-dialog.component';


@Component({
  standalone: true,
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    ProductCardComponent
  ]
})
export class ProductListComponent implements OnInit, OnDestroy {
  // holds products fetched from API + locally added
  products: Product[] = [];
  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = [];
  loading = true;
  error: string | null = null;

  searchControl = new FormControl('');
  sortBy = 'recommended';
  selectedCategories: string[] = [];
  minPrice: number | null = null;
  maxPrice: number | null = null;
  ratingFilter: number | null = null;
  inStockOnly = false;
  categories: string[] = [];
  pageSize = 12;
  currentPage = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
    this.setupSearchDebounce();
  }

  /**
   * Open dialog allowing user to enter new product details.
   * After successful creation we append to list and refresh filters.
   */
  /**
   * Show the dialog where the user can input details for a new product.
   * When the dialog closes with data we attempt to add the item and
   * update the list (or fall back to a locally-constructed product).
   */
  openAddProductDialog() {
    const dialogRef = this.dialog.open(AddProductDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dialog result', result);
        // POST to server via service
        this.productService.addProduct(result).subscribe({
          next: (p) => {
            console.log('Product added', p);
            this.products.unshift(p);
            // ensure category chip is available
            if (!this.categories.includes(p.mappedCategory)) {
              this.categories.push(p.mappedCategory);
            }
            this.applyFilters();
          },
          error: (err) => {
            console.error('Failed to add product via API, saving locally', err);
            // fallback: create a local product object ourselves
            const fallback: Product = {
              id: Date.now(), // temporary id
              price: result.price,
              priceInr: Math.round(result.price * USD_TO_INR),
              mrp: Math.round(Math.round(result.price * USD_TO_INR) * 1.2),
              discount: 0,
              title: result.title,
              description: result.description,
              category: result.category,
              mappedCategory: this.mapCategory(result.category),
              image: result.image,
              rating: { rate: 0, count: 0 },
              tags: [],
              inStock: true
            };
            this.products.unshift(fallback);
            if (!this.categories.includes(fallback.mappedCategory)) {
              this.categories.push(fallback.mappedCategory);
            }
            this.applyFilters();
            // also save locally
            this.productService.addLocalProduct(fallback);
          }
        });
      }
    });
  }

  /**
   * Lifecycle hook called when component is torn down. Notify
   * subscribers to clean up any RxJS subscriptions.
   */
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Fetch category list from service and map them to human-friendly
   * labels used in the filter chips.
   */
  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories.map(cat => this.mapCategory(cat));
      },
      error: (err) => {
        console.error('Failed to load categories', err);
      }
    });
  }

  /**
   * Retrieve products (including any locally added ones) and apply
   * the currently selected filters so that UI can render page 1.
   */
  loadProducts() {
    this.loading = true;
    this.error = null;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load products. Please try again.';
        this.loading = false;
      }
    });
  }

  /**
   * Wire up the search text field so that typing is debounced before
   * triggering the filter logic to reduce frequent recalculations.
   */
  setupSearchDebounce() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.applyFilters();
    });
  }

  /**
   * Called when the sort dropdown value changes; just recompute filters.
   */
  onSortChange() {
    this.applyFilters();
  }

  /**
   * Toggle a category chip when clicked. Adds/removes from the
   * selectedCategories array then reapplies filters.
   */
  onCategoryToggle(category: string) {
    const index = this.selectedCategories.indexOf(category);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(category);
    }
    this.applyFilters();
  }

  /**
   * Called when the min/max price inputs change; triggers filtering.
   */
  onPriceChange() {
    this.applyFilters();
  }

  /**
   * Update filters after the rating selector changes.
   */
  onRatingChange() {
    this.applyFilters();
  }

  /**
   * Checkbox toggle for showing only in-stock items; re-evaluates
   * the filtered results when toggled.
   */
  onInStockChange() {
    this.applyFilters();
  }

  /**
   * Core filtering routine. Takes the full products array and applies
   * search text, category, price, rating, and stock filters, then
   * sorts and paginates the resulting list for display.
   */
  applyFilters() {
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    let filtered = this.products.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm);
      const matchesCategory = this.selectedCategories.length === 0 || this.selectedCategories.includes(product.mappedCategory);
      const matchesMinPrice = this.minPrice === null || product.priceInr >= this.minPrice;
      const matchesMaxPrice = this.maxPrice === null || product.priceInr <= this.maxPrice;
      const matchesRating = this.ratingFilter === null || product.rating.rate >= this.ratingFilter;
      const matchesStock = !this.inStockOnly || product.inStock;
      return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice && matchesRating && matchesStock;
    });

    switch (this.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.priceInr - b.priceInr);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.priceInr - a.priceInr);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      case 'newest':
        // Mock newest by id descending
        filtered.sort((a, b) => b.id - a.id);
        break;
      default: // recommended
        filtered.sort((a, b) => b.rating.rate - a.rating.rate); // Sort by rating as recommended
    }

    this.filteredProducts = filtered;
    this.updatePagination();
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagination();
  }

  updatePagination() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  onAddToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  private mapCategory(apiCategory: string): string {
    const categoryMap: { [key: string]: string } = {
      'electronics': 'Tech',
      'jewelery': 'Fashion',
      "men's clothing": "Men's Fashion",
      "women's clothing": "Women's Fashion"
    };
    return categoryMap[apiCategory] || apiCategory;
  }
}
