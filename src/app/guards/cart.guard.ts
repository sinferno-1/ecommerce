import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CartService } from '../services/cart.service';

/**
 * Route guard that ensures the user cannot navigate to checkout when
 * the shopping cart is empty. It checks the CartService and, if
 * there are no items, redirects to the cart page.
 */
@Injectable({
  providedIn: 'root'
})
export class CartGuard implements CanActivate {
  constructor(private cartService: CartService, private router: Router) {}

  canActivate(): boolean {
    if (this.cartService.getItemCount() > 0) {
      return true;
    } else {
      this.router.navigate(['/cart']);
      return false;
    }
  }
}