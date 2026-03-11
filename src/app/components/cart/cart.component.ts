// cart.component.ts
// Displays items in the shopping cart along with quantity controls,
// pricing summary, and navigation actions.
import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  subtotal = 0;
  shipping = 0;
  total = 0;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.calculateTotals();
    });
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity > 0) {
      this.cartService.updateQuantity(productId, quantity);
    }
  }

  removeItem(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  calculateTotals() {
    this.subtotal = this.cartService.getTotal();
    this.shipping = this.subtotal > 5000 ? 0 : 500; // Free shipping over ₹5000
    this.total = this.subtotal + this.shipping;
  }
}
