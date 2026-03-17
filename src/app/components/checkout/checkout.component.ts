// checkout.component.ts
// Handles the checkout process and order success page. Uses a reactive
// form for capturing user address details and shows summary of items.
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  standalone: true,
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule
  ]
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cartItems: CartItem[] = [];
  subtotal = 0;
  shipping = 0;
  total = 0;
  isSuccessPage = false;
  orderId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.checkoutForm = this.fb.group({
      fullName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      email: ['', [Validators.required, Validators.email]],
      hostelRoom: ['', Validators.required],
      city: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      landmark: ['']
    });
  }

  /**
   * Initialize form/page depending on whether we are rendering the
   * success screen or the interactive checkout. On checkout we also
   * watch the cart and redirect if it becomes empty.
   */
  ngOnInit() {
    this.isSuccessPage = this.route.snapshot.url.some(segment => segment.path === 'success');

    if (this.isSuccessPage) {
      const id = this.route.snapshot.paramMap.get('id');
      this.orderId = id;
    } else {
      this.cartService.cartItems$.subscribe(items => {
        this.cartItems = items;
        this.calculateTotals();
        if (this.cartItems.length === 0) {
          this.router.navigate(['/cart']);
        }
      });
    }
  }

  /**
   * Compute billing totals used in summary panels. Applies same free
   * shipping threshold as CartComponent.
   */
  calculateTotals() {
    this.subtotal = this.cartService.getTotal();
    this.shipping = this.subtotal > 5000 ? 0 : 500;
    this.total = this.subtotal + this.shipping;
  }

  /**
   * Simple navigation helper used on success page to return to PLP.
   */
  continueShopping() {
    this.router.navigate(['/products']);
  }

  /**
   * Handler for the checkout form submit. Generates a fake order id,
   * clears the cart, and transitions to the success route.
   */
  onSubmit() {
    if (this.checkoutForm.valid) {
      // Create mock order id
      const orderId = 'ORD' + Date.now();
      this.cartService.clearCart();
      this.router.navigate(['/order-success', orderId]);
    }
  }
}
