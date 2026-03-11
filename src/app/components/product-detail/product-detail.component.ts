// product-detail.component.ts
// Shows detailed information about a single product (PDP).
// Includes quantity selector, related items and add-to-cart logic.
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  relatedProducts: Product[] = [];
  loading = true;
  error: string | null = null;
  quantity = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(+id);
    }
  }

  loadProduct(id: number) {
    this.loading = true;
    this.error = null;
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.product = product;
        this.loadRelatedProducts(product.category);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load product. Please try again.';
        this.loading = false;
      }
    });
  }

  loadRelatedProducts(category: string) {
    this.productService.getProductsByCategory(category).subscribe({
      next: (products) => {
        this.relatedProducts = products.filter(p => p.id !== this.product?.id).slice(0, 4);
      },
      error: (err) => {
        console.error('Failed to load related products', err);
      }
    });
  }

  increaseQuantity() {
    if (this.quantity < 5) {
      this.quantity++;
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    if (this.product) {
      for (let i = 0; i < this.quantity; i++) {
        this.cartService.addToCart(this.product);
      }
      // Reset quantity or navigate
      this.quantity = 1;
    }
  }

  goBack() {
    this.router.navigate(['/products']);
  }

  getTagColor(tag: string): string {
    switch (tag) {
      case 'under-999':
        return 'primary';
      case 'budget-pick':
        return 'accent';
      case 'premium':
        return 'warn';
      case 'bestseller':
        return 'primary';
      default:
        return '';
    }
  }
}
