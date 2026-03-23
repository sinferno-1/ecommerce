// product-card.component.ts
// Reusable card component used in lists to represent a product.
// Shows add button when product not in cart, quantity editor when present.
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
    selector: 'app-product-card',
    templateUrl: './product-card.component.html',
    styleUrls: ['./product-card.component.scss'],
    imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatChipsModule]
})
export class ProductCardComponent implements OnInit, OnDestroy {
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<Product>();

  inCart = false;
  quantity = 0;
  private cartSub?: Subscription;

  constructor(private router: Router, private cartService: CartService) {}

  ngOnInit() {
    this.cartSub = this.cartService.cartItems$.subscribe(items => {
      const item = items.find(i => i.product.id === this.product.id);
      this.inCart = !!item;
      this.quantity = item?.quantity ?? 0;
    });
  }

  ngOnDestroy() {
    this.cartSub?.unsubscribe();
  }

  /**
   * Handle click on the card by routing to the product detail page.
   */
  onCardClick() {
    this.router.navigate(['/product', this.product.id]);
  }

  /**
   * Add product from card and emit event for any outer handler.
   * Cart mutation is handled by parent to avoid duplicate operations.
   */
  onAddToCart(event: Event) {
    event.stopPropagation();
    this.addToCart.emit(this.product);
  }

  /**
   * Update quantity directly in cart from card controls.
   */
  updateQuantity(event: Event, newQuantity: number) {
    event.stopPropagation();
    if (newQuantity <= 0) {
      this.cartService.removeFromCart(this.product.id);
    } else {
      this.cartService.updateQuantity(this.product.id, newQuantity);
    }
  }

  removeFromCart(event: Event) {
    event.stopPropagation();
    this.cartService.removeFromCart(this.product.id);
  }

  /**
   * Convert a tag name to a material color string for badge styling.
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
