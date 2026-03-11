// product-card.component.ts
// Reusable card component used in lists to represent a product.
// Emits addToCart events and navigates to the PDP when clicked.
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../services/product.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<Product>();

  constructor(private router: Router) {}

  /**
   * Handle click on the card by routing to the product detail page.
   */
  onCardClick() {
    this.router.navigate(['/product', this.product.id]);
  }

  /**
   * Emit an add-to-cart event when the button is clicked. Stop
   * propagation so the card click handler does not fire.
   */
  onAddToCart(event: Event) {
    event.stopPropagation();
    this.addToCart.emit(this.product);
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
