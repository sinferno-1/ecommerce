import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnDestroy {
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
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
    this.setupSearchDebounce();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

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

  setupSearchDebounce() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.applyFilters();
    });
  }

  onSortChange() {
    this.applyFilters();
  }

  onCategoryToggle(category: string) {
    const index = this.selectedCategories.indexOf(category);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(category);
    }
    this.applyFilters();
  }

  onPriceChange() {
    this.applyFilters();
  }

  onRatingChange() {
    this.applyFilters();
  }

  onInStockChange() {
    this.applyFilters();
  }

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
