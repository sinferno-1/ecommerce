// cart.service.ts
// Manages the shopping cart state using a BehaviorSubject. Persists
// the cart to localStorage so that it survives page reloads.
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './product.service';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItems.asObservable();

  constructor() {
    this.loadCartFromStorage();
  }

  /**
   * Read the serialized cart from localStorage and update the
   * internal BehaviorSubject. If the stored data is malformed we
   * clear it to avoid further errors.
   */
  private loadCartFromStorage() {
    const storedCart = localStorage.getItem('cart_v1');
    if (storedCart) {
      try {
        this.cartItems.next(JSON.parse(storedCart));
      } catch (e) {
        // Clear corrupted data
        localStorage.removeItem('cart_v1');
      }
    }
  }

  /**
   * Persist the current cart value to localStorage; called after any
   * mutation so the state survives page refreshes.
   */
  private saveCartToStorage() {
    localStorage.setItem('cart_v1', JSON.stringify(this.cartItems.value));
  }

  /**
   * Add a product to the cart. If the product already exists in the
   * list we bump its quantity, otherwise we append a new entry.
   * After modification we emit the new array and save to storage.
   *
   * @param product product being added
   * @param quantity number of units (default 1)
   */
  addToCart(product: Product, quantity: number = 1) {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(item => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentItems.push({ product, quantity });
    }
    this.cartItems.next(currentItems);
    this.saveCartToStorage();
  }

  /**
   * Remove all quantities of a product specified by ID from the cart.
   * This will silently drop the item and persist the updated list.
   */
  removeFromCart(productId: number) {
    const currentItems = this.cartItems.value.filter(item => item.product.id !== productId);
    this.cartItems.next(currentItems);
    this.saveCartToStorage();
  }

  /**
   * Change the quantity for a specific cart item. A non-positive
   * value will cause the item to be removed entirely.
   */
  updateQuantity(productId: number, quantity: number) {
    const currentItems = this.cartItems.value;
    const item = currentItems.find(item => item.product.id === productId);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        this.cartItems.next(currentItems);
        this.saveCartToStorage();
      }
    }
  }

  /**
   * Helper to synchronously return the current cart items array.
   * Primarily used by guards and components needing immediate value.
   */
  getCartItems(): CartItem[] {
    return this.cartItems.value;
  }

  /**
   * Compute the total cost (in INR) of all items currently in the cart.
   */
  getTotal(): number {
    return this.cartItems.value.reduce((total, item) => total + item.product.priceInr * item.quantity, 0);
  }

  /**
   * Return the aggregated count of all units in the cart. Used for
   * badge displays and guard logic.
   */
  getItemCount(): number {
    return this.cartItems.value.reduce((count, item) => count + item.quantity, 0);
  }

  /**
   * Empty the cart completely and persist the empty array.
   */
  clearCart() {
    this.cartItems.next([]);
    this.saveCartToStorage();
  }
}
