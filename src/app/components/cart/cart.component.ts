// cart.component.ts
// Displays items in the shopping cart along with quantity controls,
// pricing summary, and navigation actions.
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CartService, CartItem } from '../../services/cart.service';

@Component({
    selector: 'app-cart',
    standalone: true,
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss'],
    imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule]
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);

  cartItems: CartItem[] = [];
  subtotal = 0;
  shipping = 0;
  total = 0;

  /**
   * Subscribe to cart observable on init and recalc totals whenever
   * the cart updates.
   */
  ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.calculateTotals();
    });
  }

  /**
   * Forward quantity change requests to CartService; ignores zeros.
   */
  updateQuantity(productId: number, quantity: number) {
    if (quantity > 0) {
      this.cartService.updateQuantity(productId, quantity);
    }
  }

  /**
   * Remove a product from the cart completely.
   */
  removeItem(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  /**
   * Recompute subtotal, shipping charge and grand total. Shipping is
   * free above a threshold amount.
   */
  calculateTotals() {
    this.subtotal = this.cartService.getTotal();
    this.shipping = this.subtotal > 5000 ? 0 : 500; // Free shipping over ₹5000
    this.total = this.subtotal + this.shipping;
  }

  trackByProductId(index: number, item: CartItem): number {
    return item.product.id;
  }
}
