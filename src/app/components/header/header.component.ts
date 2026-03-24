// header.component.ts
// Displays the top toolbar with navigation and cart badge count.
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { CartService } from '../../services/cart.service';

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
        MatBadgeModule
    ]
})
export class HeaderComponent implements OnInit {
  private cartService = inject(CartService);

  itemCount = 0;

  ngOnInit() {
    this.cartService.cartItems$.subscribe(() => {
      this.itemCount = this.cartService.getItemCount();
    });
  }
}
