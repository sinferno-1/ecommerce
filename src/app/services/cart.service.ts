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

  private saveCartToStorage() {
    localStorage.setItem('cart_v1', JSON.stringify(this.cartItems.value));
  }

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

  removeFromCart(productId: number) {
    const currentItems = this.cartItems.value.filter(item => item.product.id !== productId);
    this.cartItems.next(currentItems);
    this.saveCartToStorage();
  }

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

  getCartItems(): CartItem[] {
    return this.cartItems.value;
  }

  getTotal(): number {
    return this.cartItems.value.reduce((total, item) => total + item.product.priceInr * item.quantity, 0);
  }

  getItemCount(): number {
    return this.cartItems.value.reduce((count, item) => count + item.quantity, 0);
  }

  clearCart() {
    this.cartItems.next([]);
    this.saveCartToStorage();
  }
}
