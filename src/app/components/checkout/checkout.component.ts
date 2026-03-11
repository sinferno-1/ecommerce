// checkout.component.ts
// Handles the checkout process and order success page. Uses a reactive
// form for capturing user address details and shows summary of items.
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
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

  calculateTotals() {
    this.subtotal = this.cartService.getTotal();
    this.shipping = this.subtotal > 5000 ? 0 : 500;
    this.total = this.subtotal + this.shipping;
  }

  continueShopping() {
    this.router.navigate(['/products']);
  }

  onSubmit() {
    if (this.checkoutForm.valid) {
      // Create mock order id
      const orderId = 'ORD' + Date.now();
      this.cartService.clearCart();
      this.router.navigate(['/order-success', orderId]);
    }
  }
}
