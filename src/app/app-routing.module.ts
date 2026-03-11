import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { CartGuard } from './guards/cart.guard';

// application route configuration
const routes: Routes = [
  // default redirect to product listing
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  // product listing page (PLP)
  { path: 'products', component: ProductListComponent },
  // product detail page (PDP)
  { path: 'product/:id', component: ProductDetailComponent },
  // shopping cart
  { path: 'cart', component: CartComponent },
  // checkout is protected by CartGuard; ensure cart not empty
  { path: 'checkout', component: CheckoutComponent, canActivate: [CartGuard] },
  // success page after order placement; uses same component
  { path: 'order-success/:id', component: CheckoutComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
