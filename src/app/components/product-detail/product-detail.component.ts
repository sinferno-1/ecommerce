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

  /**
   * Retrieve product id from route parameters and load details on
   * component initialization.
   */
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(+id);
    }
  }

  /**
   * Fetch a single product by id and set up related products once
   * the main product is received.
   */
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

  /**
   * Request products within the same category and store a small subset
   * for display as suggestions on the PDP.
   */
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

  /**
   * Increment the selected quantity (capped at a maximum of 5).
   */
  increaseQuantity() {
    if (this.quantity < 5) {
      this.quantity++;
    }
  }

  /**
   * Decrement the quantity, ensuring it stays at least 1.
   */
  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  /**
   * Add the currently viewed product to the cart the specified number
   * of times, then reset quantity selector.
   */
  addToCart() {
    if (this.product) {
      for (let i = 0; i < this.quantity; i++) {
        this.cartService.addToCart(this.product);
      }
      // Reset quantity or navigate
      this.quantity = 1;
    }
  }

  /**
   * Navigate back to the product listing page.
   */
  goBack() {
    this.router.navigate(['/products']);
  }

  /**
   * Return a material color based on the tag string to colour-code
   * badge chips.
   */
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
