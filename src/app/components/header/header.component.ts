// header.component.ts
// Displays the top toolbar with navigation and cart badge count.
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { CartService } from '../../services/cart.service';
import { AuthService, User } from '../../services/auth.service';

@Component({
    selector: 'app-header',
    standalone: true,
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    imports: [
        CommonModule,
        RouterModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatBadgeModule,
        MatMenuModule,
        MatDividerModule
    ]
})
export class HeaderComponent implements OnInit {
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);

  itemCount = 0;
  currentUser: User | null = null;

  ngOnInit() {
    this.cartService.cartItems$.subscribe(() => {
      this.itemCount = this.cartService.getItemCount();
    });

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  /**
   * Logout the current user and navigate to login page
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
