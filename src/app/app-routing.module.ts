import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { CartGuard } from './guards/cart.guard';
import { AuthGuard } from './guards/auth.guard';

// application route configuration
const routes: Routes = [
  // default redirect to products page
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  // authentication pages
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  // product listing page (PLP) - requires auth
  { path: 'products', component: ProductListComponent, canActivate: [AuthGuard] },
  // product detail page (PDP) - requires auth
  { path: 'product/:id', component: ProductDetailComponent, canActivate: [AuthGuard] },
  // shopping cart - requires auth
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  // checkout is protected by CartGuard; ensure cart not empty
  { path: 'checkout', component: CheckoutComponent, canActivate: [CartGuard, AuthGuard] },
  // success page after order placement; uses same component
  { path: 'order-success/:id', component: CheckoutComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
